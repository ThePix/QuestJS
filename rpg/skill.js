"use strict";


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
    if (rpg.findSkill(this.name, true)) throw new Error("Skill/Spell name collision: " + this.name)
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
    this.suppressAntagonise = true
    this.automaticSuccess = true
    this.notAnAttack = true
    this.reportText = "{nv:attacker:cast:true} the {i:{nm:skill}} spell."
  }
}

class SpellSummon extends Spell {
  constructor(prototype, data) {
    super(lang.summonSpellPre + ' ' + titleCase(prototype.alias.replace('_', ' ')), data)
    this.noTarget = true
    this.automaticSuccess = true
    this.prototype = prototype
    if (!this.description) this.description = lang.summonSpellDesc(this)

  }
  
  targetEffect(attack) {
    attack.item = cloneObject(this.prototype, attack.attacker.loc)
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







const defaultSkill = new Skill("Basic attack", {
  primarySuccess:lang.primarySuccess,
  primaryFailure:lang.primaryFailure,
  modifyOutgoingAttack:function(attack) {},
})


new Effect("Spell cooldown", {
  modifyOutgoingAttack:function(attack, source) {
    log(source)
    if (source.cooldown === undefined) return
    if (!attack.skill) return
    if (!attack.skill instanceof Spell) return
    if (!attack.skill.level) return

    log(source.cooldown)
    if (source.cooldown < 0) {
      source.cooldown = source.getSpellCooldownDelay(attack.skill)
    }
    else {
      attack.abort('Cooldown still in progress, cannot cast ' + attack.skill.name)
    }
  },
})



new Effect("Skill cooldown", {
  modifyOutgoingAttack:function(attack, source) {
    if (source.cooldown === undefined) return
    if (!attack.skill) return
    if (attack.skill instanceof Spell) return
    if (!attack.skill.level) return

    if (source.cooldown < 0) {
      source.cooldown = source.getSkillCooldownDelay(attack.skill)
    }
    else {
      attack.abort('Cooldown still in progress, cannot cast ' + attack.skill.name)
    }
  },
})


new Effect("Limited mana", {
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
  modifyOutgoingAttack:function(attack, source) {
    if (!attack.skill) return
    if (!attack.skill instanceof Spell) return
    array.remove(source.skillsLearnt, attack.skill.name)
  },
})