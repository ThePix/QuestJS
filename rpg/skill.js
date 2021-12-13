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


