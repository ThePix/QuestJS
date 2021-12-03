"use strict";




// Give a character a modifyOutgoingAttack function to have it modify an attack the character is making
// or modifyIncomingAttack for an attack it is receiving
const RPG_TEMPLATE = {
  offensiveBonus:0,
  spellCasting:0,
  dead:false,
  afterLoadForTemplate:function() {
    if (this.agenda && this.agenda[0].startWith('guardExit')) this.setGuardFromAgenda(this.agenda[0].split(':').shift())
    log("loaded!")
  },
  setGuardFromAgenda(ary) {
    log(ary)
    const room = w[ary.shift()]
    const dir = ary.shift()
    this.setGuard(room, dir, ary.join(':'))
  },
  setGuard(room, dir, comment) {
    this.guardingLoc = room.name
    this.guardingDir = dir
    this.guardingComment = comment
    if (!room[dir].guardedBy.includes(this.name)) room[dir].guardedBy.push(this.name)
    //log("Guarding " + dir + " exit of " + room.alias)
  },
  unsetGuard() {
    array.remove(w[this.guardingLoc][this.guardingDir].guardedBy, this.name)
    delete this.guardingLoc
    delete this.guardingDir
  },
  isGuarding(exit) {
    if (this.dead) return false
    return exit.origin.name === this.guardingLoc && exit.dir === this.guardingDir && this.loc === this.guardingLoc
  },
  getOffensiveBonus:function(skill) {
    if (!skill.statForOffensiveBonus) {
      return this.offensiveBonus
    }
    else if (this[skill.statForOffensiveBonus] !== undefined) {
      return this[skill.statForOffensiveBonus]
    }
    else {
      return 0
    }
  },
  defensiveBonus:0,
  spellDefence:0,
  // call this to flag as dead - no output
  terminate:function() {
    this.dead = true
    this.suspended = true
    if (this.noCorpse) {
      rpg.destroy(this)
    }
  },
  testTalk:function() {
    if (this.dead) return falsems(lang.npc_dead)
    return true
  },
  getDefensiveBonus:function(skill) {
    if (!skill.statForDefensiveBonus) {
      return this.defensiveBonus
    }
    else if (this[skill.statForDefensiveBonus] !== undefined) {
      return this[skill.statForDefensiveBonus]
    }
    else {
      return 0
    }
  },
  attitude:rpg.NEUTRAL,
  modAttitudeOnAttack:function() {
    if (this.attitude > rpg.HOSTILE) return // already hostile or fearful
    if (this.attitude > 200) {
      this.attitude += 100
    }
    else if (this.attitude > 100) {
      this.attitude = rpg.BELLIGERENT_HOSTILE
    }
    else if (this.attitude === rpg.TIMID) {
      this.attitude = rpg.FEARFUL
    }
  },
  armour:0,
  isLight:false,  // should this be on default items?
  activeEffects:[],
  skillsLearnt:[],
  
  dead:false,
  asleep:false,
  stunned:0,
  petrified:false,
  blinded:false,
  signalResponses:{},

  // player attacks this
  attack:function(options) {
    // Create an attack, based on the current skill, weapon and given target
    const attack = Attack.createAttack(options.char, this)
    if (!attack) return false
    attack.apply().output()
      
    //msg(attack.result.join(''))
    return true;
  },

  modifyOutgoingAttack:function(attack) { },
  
  getEquippedWeapon:function() { return this },
  
  getEquippedShield:function() { return null },
  
  isHostile:function() { return this.attitude > rpg.HOSTILE },

  getArmour:function() { return this.armour },

  hasEffect:function(name) { return this.activeEffects.includes(name) },
  
  lightSource:function() { return this.isLight ? world.LIGHT_FULL : world.LIGHT_NONE },

}



const RPG_PLAYER = function(female) {
  const res = PLAYER(female)
  
  for (let key in RPG_TEMPLATE) res[key] = RPG_TEMPLATE[key]
  
  //res.getEquippedWeapon = function() { return this.equipped ? w[this.equipped] : w.weapon_unarmed; }
  
  res.getEquippedWeapon = function() {
    const carried = scopeHeldBy(this)
    return carried.find(el => el.equipped && el.weapon) || w.weapon_unarmed
  }

  res.getEquippedShield = function() {
    const carried = scopeHeldBy(this)
    return carried.find(el => el.equipped && el.shield)
  }

  res.getArmour = function() {
    const garments = scopeHeldBy(this).filter(el => el.worn)
    let armour = 0
    for (let el of garments) armour += el.getArmour()
    return armour / settings.armourScaling
  }

  res.afterCreation = function(o) {
    if (!o.maxHealth) o.maxHealth = o.health
  }

  return res;
}

const RPG_NPC = function(female) {
  const res = NPC(female)

  for (let key in RPG_TEMPLATE) res[key] = RPG_TEMPLATE[key]
  
  res.oldRpgOnCreation = res.afterCreation
  res.afterCreation = function(o) {
    o.oldRpgOnCreation(o)
    if (!o.maxHealth) o.maxHealth = o.health
    o.verbFunctions.push(function(o, verbList) {
      verbList.push(lang.verbs.attack)
    })
    o.nameModifierFunctions.push(function(o, list) {
      if (o.dead) list.push(lang.invModifiers.dead)
    })
  }
  
  res.msgDeath = lang.deathGeneral

  res.selectSkill = function() {
    return this.skillOptions ? rpg.findSkill(random.fromArray(this.skillOptions)) : defaultSkill 
  }

  // this NPC is going to attack target
  res.makeAttack = function(target) {
    const attack = Attack.createAttack(this, target, this.selectSkill(target))
    if (!attack) return false
    attack.apply().output()
    return attack
  }
  
  res.examine = function(options) {
    let s
    if (this.dead) {
      if (this.exDead) {
        s = this.exDead
      }
      else {
        s = typeof this.ex === 'string' ? this.ex : this.ex()
        s += lang.deadAddendum
      }
    }
    else if (this.asleep) {
      if (this.exAsleep) {
        s = this.exAsleep
      }
      else {
        s = typeof this.ex === 'string' ? this.ex : this.ex() + lang.asleepAddendum
      }
    }
    else {
      s = typeof this.ex === 'string' ? this.ex : this.ex()
      if (this.health < this.maxHealth / 5) {
        s += lang.badlyInjuredAddendum
      }
      else if (this.health < this.maxHealth / 2) {
        s += lang.injuredAddendum
      }
    }
    if (settings.includeHitsInExamine) {
      s += ' {class:tactical:Hits: ' + this.health + '/' + this.maxHealth + '.}'
    }
    msg(s, options)
  }
  
  res.search = function(options) {
    if (!this.dead && !this.asleep) return falsemsg(lang.searchAlive, options)
    if (!settings.defaultSearch) return falsemsg(lang.searchNothing, options)

    settings.defaultSearch(this)
    return true
  }
    
  return res;
}





const RPG_CORPOREAL_UNDEAD = function() {
  const res = RPG_NPC();
  res.element = 'necrotic'
  res.pronouns = lang.pronouns.thirdperson
  res.msgDeath = lang.deathUndead
  res.poisonImmunity = true
  res.poisonImmunityMsg = "Poison has no effect on the undead!"
  return res
}

const RPG_NON_CORPOREAL_UNDEAD = function() {
  const res = RPG_CORPOREAL_UNDEAD();
  res.noCorpse = true
  res.msgDeath = lang.deathUndeadNoCorpse
  res.modifyIncomingAttack = function(attack) {
    if (attack.element || attack.isMagic || attack.spell) {
      attack.damageMultiplier = 0
      attack.primarySuccess = attack.primarySuccess.replace(/[.!]/, ", but it passes straight through {sb:target}.")
    }
  }
  return res
}

const RPG_PHANTOM = function() {
  const res = RPG_NPC();
  res.element = 'rainbow'
  res.noCorpse = true
  res.msgDeath = lang.deathPhantom
  res.pronouns = lang.pronouns.thirdperson
  res.poisonImmunity = true
  res.poisonImmunityMsg = "Poison has no effect for some reason..."
  res.unillusionable = true
  res.unillusion = function(attack) {
    attack.msg("{nv:target:disappear:true}.", 1)
    if (this.clonePrototype) {
      delete w[this.name]
    }
    else {
      delete w[this.name].loc
    }
  }
  return res
}

const RPG_ELEMENTAL = function(element) {
  const res = RPG_NPC()
  res.element = element
  res.noCorpse = true
  res.msgDeath = lang.deathElemental
  res.pronouns = lang.pronouns.thirdperson
  res.poisonImmunity = true
  res.poisonImmunityMsg = "Poison has no effect on elementals!"
  return res
}

const RPG_CONSTRUCT = function() {
  const res = RPG_NPC()
  res.msgDeath = lang.deathConstruct
  res.pronouns = lang.pronouns.thirdperson
  res.poisonImmunity = true
  res.poisonImmunityMsg = "Poison has no effect on constructs!"
  return res
}

const RPG_DEMON = function() {
  const res = RPG_NPC()
  res.msgDeath = lang.deathConstruct
  res.pronouns = lang.pronouns.thirdperson
  res.poisonImmunity = true
  res.poisonImmunityMsg = "Poison has no effect on demons!"
  return res
}

const RPG_CORRUPTED = function() {
  const res = RPG_NPC()
  res.msgDeath = lang.deathConstruct
  res.pronouns = lang.pronouns.thirdperson
  return res
}

const RPG_CREATED = function() {
  const res = RPG_NPC()
  res.msgDeath = lang.deathConstruct
  res.pronouns = lang.pronouns.thirdperson
  return res
}

const RPG_PLANT = function() {
  const res = RPG_NPC()
  res.msgDeath = lang.deathConstruct
  res.pronouns = lang.pronouns.thirdperson
  return res
}

const RPG_FEY = function(female) {
  const res = RPG_NPC(female);

  res.fey = true
    
  return res
}

const RPG_BEAST = function(female, aggressive) {
  const res = RPG_NPC(female);

  res.beast = true
  res.charmed = false
  res.aggressive = aggressive
  res.testTalk = function() {
    if (this.dead) return falsems(lang.npc_dead)
    if (this.activeEffects.includes(lang.communeWithAnimalSpell)) return true
    return falsemsg(lang.cannotTalkToBeast, {item:this, char:player})
  }
  res.isHostile = function() { return this.aggressive && !this.charmed }
    
  return res
}






