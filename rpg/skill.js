"use strict";

//Generic class for skills; you should not use directly
class Skill {
  constructor(name, data) {
    this.name = name
    this.offensiveBonus = 0
    for (let key in data) this[key] = data[key]
    if (!this.alias) this.alias = name
    if (!this.regex) this.regex = new RegExp('^' + this.alias.toLowerCase() + '$')
    if (!this.tooltip) this.tooltip = this.description
    //log(this.alias)
    if (data.effect) {
      if (!data.effect.css) data.effect.css = 'spell'
      if (!data.effect.tooltip) data.effect.tooltip = 'Effect of the spell ' + name
      new Effect(this.name, data.effect, data)
      this.targetEffectName = true
    }
    if (rpg.findSkill(this.name, true)) throw new Error("Skill name collision: " + this.name)
    rpg.list.push(this)
  }



  afterUse(attack, count) { rpg.defaultSkillAfterUse(attack, count) }

}


// All attacks are divided between spells, weapon attacks and natural attacks
// If you need to usae a weapon, it is a weapon attack
// If you need to learn a spell first, it is a spell
// Otherwise, it is a natural attack

class WeaponAttack extends Skill {
  constructor(name, data) {
    super(name, data)
    this.type = 'weapon'
    this.activityType = 'weapon'
    this.msgAttack = lang.attacking
  }
  testUseable(char) {
    if (!char.getEquippedWeapon()) {
      if (char === player) msg(lang.noWeapon, {char:char})
      return false
    }
    return rpg.defaultSkillTestUseable(char) 
  }
  afterUse(attack, count) { }
}


class NaturalAttack extends Skill {
  constructor(name, data) {
    super(name, data)
    this.noWeapon = true
    this.type = 'natural'
    this.activityType = 'natural'
    this.msgAttack = lang.attacking
  }
  testUseable(char) { return rpg.defaultSkillTestUseable(char) }
  afterUse(attack, count) { }
}


class Spell extends Skill {
  constructor(name, data) {
    super(name, data)
    this.noWeapon = true
    this.type = 'spell'
    this.activityType = 'castSpell'
    this.msgAttack = lang.castSpell
    if (!data.damage) this.noDamage = true
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
    this.activityType = 'castSpellSelf'
    this.suppressAntagonise = true
    this.automaticSuccess = true
    this.msgAttack = "{nv:attacker:cast:true} the {i:{nm:skill}} spell."
  }
}

class SpellSummon extends Spell {
  constructor(prototype, level, duration, data) {
    //log(prototype)
    super(lang.summonSpellPre + ' ' + titleCase((prototype.spellAlias ? prototype.spellAlias : prototype.alias).replace('_', ' ')), data)
    this.noTarget = true
    this.level = level
    this.duration = duration
    this.automaticSuccess = true
    this.prototype = prototype
    if (!this.description) {
      if (prototype.weapon) {
        this.description = "Summons the " + this.prototype.alias + " to the caster."
        this.tactical = 'The summoned weapon will appear in the caster\'s hand, already equipped, but will disappear after ' + (this.duration - 1) + ' turns. It does ' + this.prototype.damage + ' damage.'
      }
      else {
        this.description = lang.summonSpellDesc(this)
        this.tactical = 'The summoned creature will fight any foes, but will disappear after ' + this.duration + ' turns.'
      }
    }
  }
  
  targetEffect(attack) {
    attack.item = cloneObject(this.prototype, attack.attacker.loc)
    attack.item.summonedCountdown = this.duration

    if (attack.item.weapon) {
      const equipped = attack.item.getObstructing(player)
      if (equipped.includes(attack.item)) return falsemsg(lang.already, {char:player})
      if (equipped.length === 0) {
        //attack.msg(lang.equip, options, 1)
      }
      else {
        //options.list = formatList(equipped, {article:DEFINITE, lastSep:lang.list_and})
        //attack.msg(lang.unequipAndEquip, options, 1)
        for (let el of equipped) el.equipped = false
      }
      attack.item.equipped = true
      attack.item.loc = player.name
      attack.msg(lang.summoning_successful, 1)
    }
    else {
      attack.msg(lang.summoning_successful, 1)
    }
  }

}


class SpellInanimate extends Spell {
  constructor(name, data) {
    super(name, data)
    if (!data.noTarget) this.noTarget = true
    this.inanimateTarget = true
    this.automaticSuccess = true
  }
  
  getPrimaryTargets(target, attack) { return this.getTargets(attack) }
}


class SpellTransformInanimate extends SpellInanimate {
  constructor(name, data) {
    super(name, data)
    this.destroyOriginal = true
  }
  
  getTargets(attack) {
    const list = scopeHereParser().filter(el => el['transform_' + this.prototype])
    return list
  }
  
  targetEffect(attack, item) {
    log(item)
    if (this.destroyOriginal) delete item.loc
    const o = spawn(this.prototype + '_prototype')
    item['transform_' + this.prototype](o)
    o.allegiance = attack.attacker.allegiance
    log(o)
  }
}


class SpellElementalAttack extends Spell {
  constructor(name, element, damage, effect) {
    super(name, {})
    if (!rpg.elements.isElement(element)) throw 'Not a real element!'
    this.icon = element
    this.element = element
    this.damage = damage
    this.noDamage = false
    this.effect = effect
    this.tactical = "On a successful hit, target takes " + this.damage + " hits."
    if (!this.level) this.level = Math.round(random.dice(this.damage, true) / settings.damagePerLevel)
    this.description = this.effect + " blasts your target."
    this.primarySuccess = this.effect + " jumps from {nms:attacker:the} finger to {nm:target:the}!"
  }
  
  modifyOutgoingAttack(attack) {
    attack.element = this.element;
  }
  
}









const defaultWeaponAttack = new WeaponAttack("Basic attack", {
  primarySuccess:lang.primarySuccess,
  primaryFailure:lang.primaryFailure,
  modifyOutgoingAttack:function(attack) {},
})

const defaultNaturalAttack = new NaturalAttack("Bash attack", {
  primarySuccess:lang.primarySuccess,
  primaryFailure:lang.primaryFailure,
  modifyOutgoingAttack:function(attack) {},
})

const unarmedAttack = new NaturalAttack("Punch attack", {
  primarySuccess:lang.primarySuccess,
  primaryFailure:lang.primaryFailure,
  damage:'d4',
  offensiveBonus:0,
  modifyOutgoingAttack:function(attack) {},
})


new Effect("Spell cooldown", {
  modifyOutgoingAttack:function(attack, source) {
    log(source)
    if (source.spellCooldown === undefined) return
    if (!attack.skill) return
    if (!attack.skill instanceof Spell) return
    if (!attack.skill.level) return

    log(source.spellCooldown)
    if (source.spellCooldown < 0) {
      source.spellCooldown = source.getSpellCooldownDelay(attack.skill)
    }
    else {
      attack.abort(processText("Cooldown still in progress, cannot cast {show:skill:name} ({number:count:turn} remaining)", {skill:attack.skill, count:source.spellCooldown + 1}))
    }
  },
})

new Effect("Weapon attack cooldown", {
  modifyOutgoingAttack:function(attack, source) {
    if (source.weaponAttackCooldown === undefined) return
    if (!attack.skill) return
    if (attack.skill instanceof Spell) return
    if (!attack.skill.level) return

    if (source.weaponAttackCooldown < 0) {
      source.weaponAttackCooldown = source.getWeaponAttackCooldownDelay(attack.skill)
    }
    else {
      attack.abort('Cooldown still in progress, cannot cast ' + attack.skill.name + " (" + source.weaponAttackCooldown + " turns remaining)")
    }
  },
})

new Effect("Natural attack cooldown", {
  modifyOutgoingAttack:function(attack, source) {
    if (source.naturalAttackCooldown === undefined) return
    if (!attack.skill) return
    if (attack.skill instanceof Spell) return
    if (!attack.skill.level) return

    if (source.naturalAttackCooldown < 0) {
      source.naturalAttackCooldown = source.getNaturalAttackCooldownDelay(attack.skill)
    }
    else {
      attack.abort('Cooldown still in progress, cannot cast ' + attack.skill.name + " (" + source.naturalAttackCooldown + " turns remaining)")
    }
  },
})

new Effect("Limited mana", {
  doNotList:true,
  modifyOutgoingAttack:function(attack, source) {
    if (source.mana === undefined) return
    if (!attack.skill) return
    if (!attack.skill instanceof Spell) return
    if (!attack.skill.level) {
      log('no level')
      log(attack.skill)
      return
    }
    if (source.mana >= attack.skill.level) {
      source.mana -= attack.skill.level
    }
    else {
      attack.abort('Insufficient mana to cast ' + attack.skill.name)
    }
  },
})

new Effect("Fire and forget", {
  doNotList:true,
  modifyOutgoingAttack:function(attack, source) {
    if (!attack.skill) return
    if (!attack.skill instanceof Spell) return
    array.remove(source.skillsLearnt, attack.skill.name)
  },
})