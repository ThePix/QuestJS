"use strict";


/*

character attacks foe with weapon and skill

Start from skill, as it may involve more than one attack
Calc base chance and damage

Pass to weapon to modify

Pass to character to modify

Pass to room to modify

Pass to foe to modify

Determine if it hits
Apply damage

, using weapon


A spell can trigger an attack, or modify an attack

*/



// Authors can overide AS DESIRED
settings.attackOutputLevel = 10
settings.output = function(reportTexts) {
  for (let el of reportTexts) {
    if (el.level <= settings.attackOutputLevel) {
      if (el.level === 1) {
        msg(el.t)
      }
      else  if (el.level === 2) {
        metamsg(el.t)
      }
      else {
        msgPre(el.t)
      }
    }
  }
}



settings.afterTurn.push(function() {
  for (const key in w) {
    const obj = w[key]
    
    

    // handle limited duration active effects
    if (obj.activeEffects) {
      for (let name of obj.activeEffects) {
        if (obj['countdown_' + name]) {
          obj['countdown_' + name]--
          if (obj['countdown_' + name] <= 0) {
            msg(rpg.findEffect(name).terminate(obj))
          }
        }
      }
    }

    // handle limited duration summoned creatures
    if (obj.summonedCountdown) {
      obj.summonedCountdown--
      if (obj.summonedCountdown <= 0) {
        if (obj.isHere()) msg("{nv:item:disappear:true}.", {item:obj})
        rpg.destroy(obj)
      }
    }
  }

  // Determine lighting and fog/smoke in room
  currentLocation.rpgLighting = game.dark ? rpg.DARK : rpg.LIGHT
  if (!currentLocation.rpgFog) currentLocation.rpgFog = 0
  let targetFog = currentLocation.defaultFog ? currentLocation.defaultFog : 0
  if (currentLocation.activeEffects) {
    for (const effectName of currentLocation.activeEffects) {
      const effect = rpg.findEffect(effectName)
      if (effect.fogEffect) targetFog *= effect.fogEffect
      if (effect.lightEffect) {
        if (effect.lightEffect === rpg.UTTERLIGHT) currentLocation.rpgLighting = rpg.UTTERLIGHT
        if (effect.lightEffect === rpg.UTTERDARK && currentLocation.rpgLighting !== rpg.UTTERLIGHT) currentLocation.rpgLighting = rpg.UTTERDARK
        if (effect.lightEffect === rpg.LIGHT && currentLocation.rpgLighting !== rpg.UTTERLIGHT && currentLocation.rpgLighting !== rpg.UTTERDARK) currentLocation.rpgLighting = rpg.DARK
        if (effect.lightEffect === rpg.LIGHT && currentLocation.rpgLighting !== rpg.UTTERLIGHT && currentLocation.rpgLighting !== rpg.UTTERDARK && currentLocation.rpgLighting !== rpg.LIGHT) currentLocation.rpgLighting = rpg.DARK
      }
    }
    game.dark = (currentLocation.rpgLighting === rpg.UTTERDARK || currentLocation.rpgLighting === rpg.DARK) // !!! This could have bad consequences!
  }
  if (targetFog > currentLocation.rpgFog) currentLocation.rpgFog++
  if (targetFog < currentLocation.rpgFog) currentLocation.rpgFog--
  
})



const elements = {
  list:[
    {name:'fire', opposed:'frost'},
    {name:'frost', opposed:'fire'},

    {name:'storm', opposed:'earthmight'},
    {name:'earthmight', opposed:'storm'},

    {name:'shadow', opposed:'rainbow'},
    {name:'rainbow', opposed:'shadow'},

    {name:'divine', opposed:'necrotic'},
    {name:'necrotic', opposed:'divine'},

    {name:'chaos', opposed:'law'},
    {name:'law', opposed:'chaos'},

    {name:'life', opposed:'corruption'},
    {name:'corruption', opposed:'life'},
  ],
  
  opposed:function(s) {
    if (!s) errormsg("elements.opposed was sent something that evaluates to false (type is " + (typeof s) + ")")
    for (let el of this.list) {
      if (el.name === s) return el.opposed
    }
    errormsg("elements.opposed was sent an unrecognised element: " + s)
    return null
  },
}







class Skill {
  constructor(name, data) {
    this.name = name
    this.reportText = lang.attacking
    this.offensiveBonus = 0
    for (let key in data) this[key] = data[key]
    if (!this.alias) this.alias = name
    //log(this.alias)
    if (data.effect) {
      new Effect(this.name, this.effect, data)
      this.targetEffectName = true
    }
    if (rpg.findSkill(this.name)) throw new Error("Skill/Spell name collision: " + this.name)
    rpg.list.push(this)
  }



  testUseable(char) { return rpg.defaultSkillTestUseable(char) }
  afterUse(attack, count) { rpg.defaultSkillAfterUse(attack, count) }

}

class MonsterAttack extends Skill {
  constructor(name, data) {
    super(name, data)
    this.noWeapon = true
    this.reportText = lang.castSpell
    this.statForOffensiveBonus = 'spellCasting'
  }
  testUseable(char) { return true }
  afterUse(attack, count) { }
}


class Spell extends Skill {
  constructor(name, data) {
    super(name, data)
    this.spell = true
    this.noWeapon = true
    this.reportText = lang.castSpell
    this.statForOffensiveBonus = 'spellCasting'
  }
  testUseable(char) { return rpg.defaultSpellTestUseable(char) }
  afterUse(attack, count) {  rpg.defaultSpellAfterUse(attack, count) }
}

class SpellSelf extends Spell {
  constructor(name, data) {
    super(name, data)
    this.getPrimaryTargets = function(target, attack) { 
      return [attack.attacker]
    }
    this.noTarget = true
    this.automaticSuccess = true
    this.notAnAttack = true
    this.reportText = "{nv:attacker:cast:true} the {i:{nm:skill}} spell."
  }
}

class SpellSummon extends Spell {
  constructor(name, data) {
    super(name, data)
    this.noTarget = true
    this.automaticSuccess = true
  }
  
  targetEffect(attack) {
    attack.item = cloneObject(w[this.prototype], attack.attacker.loc)
    attack.item.summonedCountdown = this.duration
    attack.msg(lang.summoning_successful, 1)
  }

}

class SpellInanimate extends Spell {
  constructor(name, data) {
    super(name, data)
    if (!data.noTarget) this.noTarget = true
    this.inanimateTarget = true
  }
  
  getPrimaryTargets(target, attack) { return this.getTargets(attack) }
}



class Effect {
  constructor(name, data, extra = {}) {
    this.name = name
    for (let key in data) this[key] = data[key]
    if (!this.alias) this.alias = name
    for (const name of rpg.copyToEffect) {
      if (extra[name]) this[name] = extra[name]
    }
    if (rpg.findEffect(this.name)) throw new Error("Effect name collision: " + this.name)
    rpg.effectsList.push(this)
  }
  
  apply(attack, target, duration) {
    if (this.start) attack.msg(this.start(target), 1)
    if (duration) target['countdown_' + this.name] = duration
    if (!target.activeEffects.includes(this.name)) target.activeEffects.push(this.name)
  }  

  terminate(target) {
    array.remove(target.activeEffects, this.name)
    delete target['countdown_' + this.name]
    let s
    if (this.finish) s = this.finish(target)
    if (this.suppressFinishMsg) return ''
    if (!s) s = lang.defaultEffectExpires
    return processText(s, {effect:this, target:target})
  }
}








const rpg = {
  TIMID:1,
  FEARFUL:2,
  
  // These attitudes go to BELLIGERENT_HOSTILE on attack
  FRIENDLY:101,
  NEUTRAL:102,
  
  // These attitudes go to +100 on attack
  PROTECTIVE:201,
  BELLIGERENT:202,
  AGGRESSIVE:203,
  
  // The character will attack
  HOSTILE:300,  // boundary marker, do not set attitude to this
  PROTECTIVE_HOSTILE:301,
  BELLIGERENT_HOSTILE:302,
  AGGRESSIVE_HOSTILE:303,
  
  list:[],
  effectsList:[],
  copyToEffect:['element','visage'],
  add:function(skill) {
    //this.list.push(skill)
  },
  
  find:function(skillName) {
    skillName = skillName.toLowerCase()
    return this.list.find(el => skillName === el.name.toLowerCase() || (el.regex && skillName.match(el.regex))) 
  },
  
  findSkill:function(skillName) {
    return this.list.find(el => skillName === el.name)
  },
  

  findEffect:function(name) {
    return this.effectsList.find(el => name === el.name)
  },

  defaultSkillTestUseable:function(char) { return true },
  defaultSkillAfterUse:function(attack, count) { },

  defaultSpellTestUseable:function(char) { return true },
  defaultSpellAfterUse:function(attack, count) { },

  broadcast:function(group, message, source) {
    for (const key in w) {
      const o = w[key]
      if (o.signalGroups && o.signalGroups.includes(group)) {
        if (o.signalResponses[message]) {
          o.signalResponses[message].bind(o)(source)
        }
        else if (rpg.signalResponses[message]) {
          rpg.signalResponses[message].bind(o)(source)
        }
        else {
          log('WARNING: No response for ' + message)
        }
      }
    }
  },
  signalResponses:{
    test:function(source) { msg("{nv:npc:receive:true} a message from {show:source}.", {npc:this, source:source})},
    alert:function() { this.alert = true },
    wake:function() { this.asleep = false },
    attack:function() { if (this.attitude < rpg.BELLIGERENT_HOSTILE) this.attitude = rpg.BELLIGERENT_HOSTILE },
  },


  // These are only suitable for attacks the player (and allies) uses; do not use for foes, they will target each other!

  // Get a list of foes in the current room, with target first (whether a foe or not)
  getFoes:function(target) {
    const l = scopeHereListed().filter(function(el) {
      return el.npc && el.isHostile() && el !== target;
    });
    if (target !== undefined) l.unshift(target);
    return l
  },

  // Get a list of NPCs in the current room, with target first
  getAll:function(target) {
    const l = scopeHereListed().filter(function(el) {
      return el.npc && el !== target;
    });
    if (target !== undefined) l.unshift(target);
    return l
  },

  // Get a list of foes in the current room, excluding target
  getFoesBut:function(target) {
    const l = scopeHereListed().filter(function(el) {
      return el.npc && el.isHostile() && el !== target;
    });
    return l
  },

  // Get a list of NPCs in the current room, excluding target
  getAllBut:function(target) {
    const l = scopeHereListed().filter(function(el) {
      return el.npc && el !== target;
    });
    return l
  },

  isSpellAvailable:function(char, spell) {
    for (let el of scopeHeldBy(char)) {
      if (el.spellsAvailableToLearn && el.spellsAvailableToLearn.includes(spell.name)) {
        return el
      }
    }
    return false
  },


  teleport:function(char, loc) {
    const oldLocation = w[char.loc]
    char.loc = loc
      
    if (char === player) {
      world.update()
      world.enterRoom(new Exit(loc, {origin:oldLocation, dir:'teleport', msg:lang.teleport}))
    }
  },

  destroy:function(obj) {
    if (obj.clonePrototype) {
      delete w[obj.name]
    }
    else {
      delete obj.loc
    }
  },
  
  hasEffect:function(obj, effect) {
    if (!obj.activeEffects) return false
    if (typeof effect !== 'string') effect = effect.name
    return obj.activeEffects.includes(effect)
  },


}







// The Attack object is used when someone casts a spell or makes a weapon or unarmed attack.
// The target could be the attacker, the room, a weapon or other item, or a number of characters.
// The Attack object should only be created once we are sure the command is successful
// (that is, the player input is okay - we can still throw errors if the code is wrong!).
// The Attack object may get modified at several points in the process,
// each can add to the reportTexts array to say what it has done
// If the primaryTargets is false, the target is the attacker himself
class Attack {
  static createAttack(attacker, target, skill, source) {
    const attack = new Attack()
    
    attack.attacker = attacker
    attack.skill = skill
    attack.target = target
    attack.source = source

    // Find the skill
    if (attacker === player && skill === undefined && rpg.getSkill) {
      attack.skill = rpg.getSkill()
      skillUI.resetButtons()
    }
    if (!attack.skill) attack.skill = defaultSkill
    attack.reportText = (source && source.reportText) ? source.reportText : attack.skill.reportText

    if (!attack.skill.testUseable(attack.attacker)) return false

    // Set targets
    if (attack.skill.noTarget) {
      attack.primaryTargets = attack.skill.getPrimaryTargets ? attack.skill.getPrimaryTargets(undefined, attack) : [attack.attacker]
    }
    else {
      attack.primaryTargets = attack.skill.getPrimaryTargets ? attack.skill.getPrimaryTargets(target, attack) : [target]
    }
    attack.secondaryTargets = attack.skill.getSecondaryTargets ? attack.skill.getSecondaryTargets(target, attack) : []
    
    if (attack.primaryTargets.length === 0) {
      return falsemsg(attack.skill.msgNoTarget ? attack.skill.msgNoTarget : lang.noTarget, attack)
    }
    

    // Set some defaults first
    attack.attackNumber = 1
    attack.reportTexts = []
    attack.armourModifier = 0
    attack.armourMultiplier = 1
    attack.primarySuccess = attack.skill.primarySuccess //|| 'A hit!'
    attack.primaryFailure = attack.skill.primaryFailure //|| 'A miss!'
    attack.secondarySuccess = attack.skill.secondarySuccess //|| 'A hit!'
    attack.secondaryFailure = attack.skill.secondaryFailure //|| 'A miss!'

    log(attack.reportText)
    log({attacker:attacker, skill:attack.skill, target:attack.primaryTargets[0], source:source})
    msg(attack.reportText, {attacker:attacker, skill:attack.skill, target:attack.primaryTargets[0], source:source})

    // Get the weapon (for most monsters, the monster IS the weapon)
    // Base the attack on the weapon
    // Some skills use no weapon
    attack.msg('Offensive bonus', 4)
    if (attack.skill.noWeapon) {
      attack.offensiveBonus = attack.skill.offensiveBonus
      attack.damage = attack.skill.damage
      attack.element = attack.skill.element
      attack.report('From skill:', attack.offensiveBonus)
    }
    else {
      attack.weapon = attacker.getEquippedWeapon()
      attack.offensiveBonus = attack.weapon.offensiveBonus || 0
      attack.damage = attack.weapon.damage
      attack.element = attack.weapon.element
      attack.report('From weapon:', attack.offensiveBonus)
    }
    
    if (attack.damage) attack.setDamageAtts(attack.damage)
    if (attack.skill.secondaryDamage) attack.setDamageAtts(attack.skill.secondaryDamage, 'secondaryDamage')
    
    // modify for the skill
    if (attack.skill.modifyOutgoingAttack) attack.skill.modifyOutgoingAttack(attack)
    attack.report('After skill:', attack.offensiveBonus)
      
    // Now take into account the attacker's stats
    attack.offensiveBonus += attacker.getOffensiveBonus(attack.skill)
    attack.report('After attacker bonus:', attack.offensiveBonus)
    attacker.modifyOutgoingAttack(attack)
    attack.report('After attacker mods:', attack.offensiveBonus)
    
    // Now take into account the attacker's weapon's active spell
    //if (!attack.skill.noWeapon) attack.applyActiveEffects(attack.weapon, true, 'Weapon')
    
    // Now take into account the attacker's active spells
    attack.applyActiveEffects(attack.attacker, true)
    attack.report('After attacker effects:', attack.offensiveBonus)
    
    // Anything the attacker is holding
    const items = scopeHeldBy(attack.attacker)
    for (let el of items) {
      if (el.modifyOutgoingAttack) el.modifyOutgoingAttack(attack)
      attack.applyActiveEffects(el, true)
    }
    attack.report('After attacker items:', attack.offensiveBonus)
  
    // Now take into account the target's room (count as incoming still)
    const room = (target ? w[target.loc] : w[attacker.loc])
    if (room.modifyOutgoingAttack) room.modifyOutgoingAttack(attack)
    attack.applyActiveEffects(room, false)
    attack.report('After room effects:', attack.offensiveBonus)

    return attack
  }
  
  
  // Once we have an attack object set up, call this to apply the attack to each target.
  // Creates a clone of this attack and calls resolve on it for each target to do the real work
  apply() {
    if (this.abort) {
      this.skill.afterUse(this, -1)
      return this
    }
    

    // Iterate through the targets and apply the attack
    // The attack may be modified by the target, so we send a clone
    let count = 0
    for (let target of this.primaryTargets) {
      for (let i = 0; i < this.attackNumber; i++) {
        if (this.clone().resolve(target, true, i)) count++
      }
    }
    for (let target of this.secondaryTargets) {
      for (let i = 0; i < this.attackNumber; i++) {
        this.clone().resolve(target, false, i)
      }
    }
    this.skill.afterUse(this, count)
    return this
  }
  
  



  // Once we have an attack object set up, call this to apply the attack to each target.
  // This applies all effects, and puts the descriptive text in reportTexts
  // (reportTexts is the attribute of the parent attack, not this clone)
  resolve(target, isPrimary, count) {
    this.target = target
    
    
    if (target.modAttitudeOnAttack && !this.notAnAttack) target.modAttitudeOnAttack()

    if (!this.skill.inanimateTarget) {
      // Now take into account the target's active spell
      this.applyActiveEffects(target, false)
      // And anything the target is holding
      const items = scopeHeldBy(target)
      for (let el of items) {
        if (el.modifyIncomingAttack) el.modifyIncomingAttack(this)
        this.applyActiveEffects(el, false)
      }
      // Now take into account the target
      if (target.modifyIncomingAttack) target.modifyIncomingAttack(this)
      if (this.element && target.element) this.modifyElementalAttack(target.element, this, isPrimary)
    }

    this.msg(processText("---\nTargeting {nm:target:the}...", {skill:this.skill, attacker:this.attacker, target:target}), 3)
    if (this.element) this.msg("Element: " + this.element, 3)
  
    // Is the target affected (hit)?
    if (this.skill.automaticSuccess || !target.getDefensiveBonus) {
      this.msg("Automatic success", 4)
    }
    else {
      this.roll = random.int(1, 20)
      this.defensiveBonus = target.getDefensiveBonus(this.skill)
      this.result = this.offensiveBonus - this.defensiveBonus + this.roll
      this.report("Offensive bonus:", this.offensiveBonus)
      this.report("Defensive bonus:", this.defensiveBonus)
      this.report("Roll:", this.roll)
      this.report("Total:", this.result)
      
      if (this.result < 10) {
        if (isPrimary && this.primaryFailure) {
          this.msg(processText(this.primaryFailure, this), 1)
        }
        else if (!isPrimary && this.secondaryFailure) {
          this.msg(processText(this.secondaryFailure, this), 1)
        }
        else {
          this.msg("A miss...\n", 1)
        }
        if (isPrimary && this.skill.afterPrimaryFailure) this.skill.afterPrimaryFailure(this.prototype)
        if (target.afterAttack) target.afterAttack(this, false)
        return false
      }
    }
    if (isPrimary && this.primarySuccess) {
      this.msg(processText(this.primarySuccess, this), 1)
    }
    else if (!isPrimary && this.secondarySuccess) {
      this.msg(processText(this.secondarySuccess, this), 1)
    }
    else {
      //this.msg("A hit!", 1)
    }

    // if we got to here, the attack worked!

    if (this.skill.targetEffect) this.skill.targetEffect(this, target, isPrimary, count)

    if (this.skill.targetEffectName) {
      const effect = rpg.findEffect(this.skill.targetEffectName === true ? this.skill.name : this.skill.targetEffectName)
      if (!target.hasEffect(effect)) {
        if (effect.category) {
          for (let name of target.activeEffects) {
            const eff = rpg.findEffect(name)
            if (eff.category === effect.category) {
              this.msg(eff.terminate(target))
            }
          }
        }
        effect.apply(this, target, this.skill.duration)
      }
    }

    if (isPrimary) {
      this.applyDamage(target)
    }
    else {
      this.applyDamage(target, 'secondaryDamage')
    }
    
    // handle death
    if (target.health <= 0) {
      if (target.afterDeath) target.afterDeath(this)
      this.msg(target.msgDeath, 1)
      target.terminate()
    }
    
    if (target.afterAttack) target.afterAttack(this, true)
    return true
  }

  modifyElementalAttack(element) {
    if (this.element === element) {
      this.msg("Damage halved as same element", 4)
      this.damageMultiplier *= 0.5
      this.secondaryDamageMultiplier *= 0.5
    }
    if (this.element === elements.opposed(element)) {
      this.msg("Damage doubled as opposed element", 4)
      this.damageMultiplier *= 2
      this.secondaryDamageMultiplier *= 2
    }
  }

  msg(s, n) {
    this.reportTexts.push({t:processText(s, this), level:n || 1})
  }

  output() {
    settings.output(this.reportTexts)
  }
  
  report(s, n) {
    this.msg(s.padEnd(25) + ('' + n).padStart(3), 4)
  }
 
  clone() {
    const copy = new Attack()  // !!!!!
    for (let key in this) copy[key] = this[key]
    copy.prototype = this
    return copy
  }

  setDamageAtts(string, prefix = 'damage') {
    const regexMatch = /^(\d*)d(\d+)([\+|\-]\d+)?$/i.exec(string);
    if (regexMatch === null) {
      errormsg('Weapon ' + this.weapon.name + ' has a bad damage attribute: ' + string)
      return;
    }
    this[prefix + 'Number'] = regexMatch[1] === ""  ? 1 : parseInt(regexMatch[1]);
    this[prefix + 'Sides'] = parseInt(regexMatch[2]);
    this[prefix + 'Bonus'] = (regexMatch[3] === undefined  ? 0 : parseInt(regexMatch[3]));
    this[prefix + 'Multiplier'] = 1
  }
  
  applyDamage(target, prefix = 'damage') {
    // calculate base damage
    if (this[prefix + 'Bonus'] || this[prefix + 'Number']) {
      this.msg(`Damage: ${this.damageNumber}d${this[prefix + 'Sides']}+${this[prefix + 'Bonus']}\n`, 3)
      let damage = this[prefix + 'Bonus']
      
      for (let i = 0; i < this[prefix + 'Number']; i++) {
        const roll = random.int(1, this[prefix + 'Sides'])
        damage += roll
        this.report('Damage roll ' + i + ':', roll)
      }
      this.report("Damage before armour:", damage)
      this.msg("Target's armour is " + target.getArmour(), 4)
      damage -= this[prefix + 'Number'] * (target.getArmour() * this.armourMultiplier + this.armourModifier)
      this.report("Damage after armour:", damage)
      if (damage < 1) damage = 1;
      this.report("Damage before multiplier:", damage)
      this.modifiedDamage = this[prefix + 'Multiplier'] * damage
      this.report("Total damage:", this.modifiedDamage)
      target.health -= this.modifiedDamage
      this.msg(lang.damageReport, 1)
    }
  }

  
  applyActiveEffects(source, outgoing) {
    if (!source || !source.activeEffects) return
    for (let el of source.activeEffects) {
      const effect = rpg.findEffect(el)
      if (!effect) return errormsg("applyActiveEffects: Failed to find skill [" + el + "]")
      if (outgoing) {
        if (effect.modifyOutgoingAttack) effect.modifyOutgoingAttack(this, source)
      }
      else {
        if (effect.modifyIncomingAttack) effect.modifyIncomingAttack(this, source)
      }
    }
  }
}




















// Give a character a modifyOutgoingAttack function to have it modify an attack the character is making
// or modifyIncomingAttack for an attack it is receiving
const RPG_TEMPLATE = {
  offensiveBonus:0,
  spellCasting:0,
  dead:false,
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








// The attack agenda item will have the monster wait until the player appears, then attack, fllowing if the player moves away
agenda.attack = function(npc, arr) {

  // do stuff
  return false
}


agenda.guard = function(npc, arr) {
  npc.agendaGuarding = arr[0]
  if (arr[1]) npc.agendaGuardingExit = arr[1]
  // do stuff
  return false
}







const EQUIPPABLE = function() {
  const res = Object.assign({}, TAKEABLE_DICTIONARY);
  
  res.equippable = true;
  res.activeEffects = [],
  res.hasEffect = function(name) { return this.activeEffects.includes(name) }
  
  res.getObstructing = function(char) {
    return scopeHeldBy(char).filter(el => el.equipped && this.match(el))
  }
  
  res.oldRpgOnCreation = res.afterCreation
  res.afterCreation = function(o) {
    o.oldRpgOnCreation(o)
    o.verbFunctions.push(function(o, verbList) {
      if (o.isAtLoc(player)) {
        verbList.push(o.equipped ? lang.verbs.unequip : lang.verbs.equip)
      }
    })
    o.nameModifierFunctions.push(function(o, list) {
      if (o.equipped && o.isAtLoc(player.name)) list.push(lang.invModifiers.equipped)
    })
  }


  res.drop = function(options) {
    if (this.equipped) this.equipped = false
    msg(lang.drop_successful, options);
    this.moveToFrom(options, "loc", "name");
    return true;
  }
  
  res.equip = function(options) {
    const equipped = this.getObstructing(options.char)
    if (equipped.includes(this)) return falsemsg(lang.already, options)
    if (equipped.length === 0) {
      msg(lang.equip, options)
    }
    else {
      options.list = formatList(equipped, {article:DEFINITE, joiner:lang.list_and})
      msg(lang.unequipAndEquip, options)
      for (let el of equipped) el.equipped = false
    }
    this.equipped = true
    return true;
  }

  res.unequip = function(options) {
    if (!this.equipped) return falsemsg(lang.already, options)
    this.equipped = false
    msg(lang.unequip, options)
    return true;
  }
  
  return res;
}  
  


const WEAPON = function(damage, weaponType) {
  const res = Object.assign({}, EQUIPPABLE())
  res.weapon = true
  res.weaponType = weaponType
  res.damage = damage
  res.match = function(item) { return item.weapon }
  res.icon = () => 'weapon12'
  return res;
}  





const LIMITED_AMMO_WEAPON = function(damage, weaponType, ammo) {
  const res = Object.assign({}, WEAPON(damage, weaponType))
  res.ammo = ammo
  res.activeEffects.push(typeof ammo === 'number' ? "Ammo tracker" : "Ammo consumer")
  return res;
}  

 

new Effect("Ammo consumer", {
  modifyOutgoingAttack:function(attack, source) {
    if (!source.equipped) return
    const item = w[source.ammo]
    if (!item) return errormsg("The weapon " + source.name + " has an unknown ammo set: " + source.ammo)
    if (item.countAtLoc(player.name) < 1) {
      attack.msg("Out of ammo!", 1)
      attack.abort = true
    }
    else {
      item.takeFrom(player.name, 1)
    }
  },
})



new Effect("Ammo tracker", {
  modifyOutgoingAttack:function(attack, source) {
    if (!source.equipped) return
    if (attack.weapon.ammo === 0) {
      attack.msg("Out of ammo!", 1)
      attack.abort = true
    }
    else {
      attack.weapon.ammo--
    }
  },
})


/*
rpg.add(new Effect("Deteriorating", {
  // really needs to be on success only
  modifyOutgoingAttack:function(attack) {
    if (attack.weapon.ammo === 0) {
      attack.msg("Out of ammo!")
      attack.abort = true
    }
    else {
      attack.weapon.ammo--
    }
  },
}))
*/

const SHIELD = function(bonus) {
  const res = Object.assign({}, EQUIPPABLE())
  res.shield = true
  res.shieldBonus = bonus
  res.match = function(item) { return item.shield }
  res.modifyIncomingAttack = function(attack) {
    if (!this.equipped) return
    attack.offensiveBonus -= this.shieldBonus
  }
  res.icon = () => 'shield12'
  return res;
}  


const SPELLBOOK = function(list) {
  const res = Object.assign({}, TAKEABLE_DICTIONARY)
  res.spellbook = true
  res.spellsAvailableToLearn = list
  res.examineX = ''
  res.examine = function() {
    msg(this.examineX + ' It contains the spells ' + formatList(this.spellsAvailableToLearn.map(el => '<i>' + el + '</i>'), {lastJoiner:lang.list_and}) + '.')
  }
  res.icon = () => 'spell12'
  return res 
}




const ONE_USE_ITEM = function(spellName, requiresTarget) {
  const res = Object.assign({}, TAKEABLE_DICTIONARY)
  res.spellName = spellName
  res.requiresTarget = requiresTarget
  res.use = function(options) {
    if (this.requiresTarget) return falsemsg("You need to specify a target when using this item.")
    if (this.loc !== options.char.name) return falsemsg("You need to be holding {nm:item:the} when using {sb:item}.", options)
      
    const attack = Attack.createAttack(options.char, null, rpg.findSkill(this.spellName), this)
    attack.apply().output()
    if (this.msgDestroy) msg(this.msgDestroy)
    rpg.destroy(this)
    return true
  }
  res.useWith = function(char, target) {
    if (!this.requiresTarget) return falsemsg("You should not specify a target when using this item.")
    if (this.loc !== char.name) return falsemsg("You need to be holding {nm:item:the} when using {sb:item}.", {item:this})
      
    const attack = Attack.createAttack(char, target, rpg.findSkill(this.spellName), this)
    attack.apply().output()
    if (this.msgDestroy) msg(this.msgDestroy)
    rpg.destroy(this)
    return true
  }
  return res 
}



const SCROLL = function(spellName, requiresTarget) {
  const res = Object.assign({}, ONE_USE_ITEM(spellName, requiresTarget))
  res.reportText = lang.castSpellFrom
  res.msgDestroy = 'The scroll crumbles to dust.'
  return res 
}


const POTION = function(spellName) {
  const res = Object.assign({}, ONE_USE_ITEM(spellName, false))
  res.reportText = lang.drinkPotion
  res.drink = function(options) { return this.use(options) }
  res.ingest = function(options) { return this.use(options) }
  return res 
}







const defaultSkill = new Skill("Basic attack", {
  primarySuccess:lang.primarySuccess,
  primaryFailure:lang.primaryFailure,
  modifyOutgoingAttack:function(attack) {},
})

createItem("weapon_unarmed", WEAPON(), {
  image:"fist",
  damage:"d4",
  offensiveBonus:-2,
  alias:"unarmed",
  scenery:true,
  isLocatedAt:function(loc, situation) {
    return (situation === world.PARSER || situation === world.ALL) && loc === player.name
  },
})




// do we need a dead attribute? is it an attribute of NPC? yes and no




agenda.guardScenery = function(npc, arr) {
  const item = w[arr.shift()]
  if (item.scenery) return false
  msg(arr.join(':'))
  return true
}

agenda.basicAttack = function(npc, arr) {
  const attack = Attack.createAttack(this, player)
  attack.resolve(player, true, 0)
  return false
}

  


commands.push(new Cmd('Attack', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {scope:parser.isPresent}
  ],
  defmsg:"No point attacking {nm:item:the}."
}))


commands.push(new Cmd('Search', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {scope:parser.isPresent}
  ],
  defmsg:"No point attacking {nm:item:the}."
}))

commands.push(new Cmd('Equip', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  objects:[
    {scope:parser.isHeld}
  ],
  defmsg:"{nv:item:be:true} not something you can equip.",
}))


commands.push(new Cmd('Unequip', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  objects:[
    {scope:parser.isHeld}
  ],
  defmsg:"{nv:item:be:true} not something you can equip.",
}))





commands.push(new Cmd('LearnSpell', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {special:'text'}
  ],
  script:function(objects) {
    const spell = rpg.find(objects[0])
    if (!spell || !spell.spell) return failedmsg("There is no spell called " + objects[0] + ".")
      
    const source = rpg.isSpellAvailable(player, spell)
    if (!source) return failedmsg("You do not have anything you can learn {i:" + spell.name + "} from.")
    
    player.skillsLearnt.push(spell.name)
    msg("You learn {i:" + spell.name + "} from " + lang.getName(source, {article:DEFINITE}) + ".")
    return world.SUCCESS
  },
}))



commands.push(new Cmd('CastSpell', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {special:'text'}
  ],
  script:function(objects) {
    const spell = rpg.find(objects[0])
    if (!spell || !spell.spell) return failedmsg("There is no spell called " + objects[0] + ".")
      
    if (!player.skillsLearnt.includes(spell.name)) return failedmsg("You do not know the spell {i:" + spell.name + "}.")
    
    if (!spell.noTarget) return failedmsg("You need a target for the spell {i:" + spell.name + "}.")

    const attack = Attack.createAttack(player, player, spell)
    if (!attack) return world.FAILED
    attack.apply().output()
    return world.SUCCESS
  },
}))





commands.push(new Cmd('CastSpellAt', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {special:'text'},
    {scope:parser.isPresent},
  ],
  script:function(objects) {
    const spell = rpg.find(objects[0])
    if (!spell || !spell.spell) return failedmsg("There is no spell called " + objects[0] + ".")
      
    if (!player.skillsLearnt.includes(spell.name)) return failedmsg("You do not know the spell {i:" + spell.name + "}.")
    
    const target = objects[1][0]

    // check target
    
    if (spell.damage && target.health === undefined) return failedmsg("You can't attack that.")

    const attack = Attack.createAttack(player, target, spell)
    if (!attack) return world.FAILED
    attack.apply().output()
    return world.SUCCESS
  },
}))


commands.push(new Cmd('DebugRPG', {
  regex:/^rpg$/,
  objects:[
  ],
  script:function(objects) {
    settings.attackOutputLevel = 10
    metamsg("All output from attacks will now be seen.");
    return world.SUCCESS_NO_TURNSCRIPTS
  },
}))



