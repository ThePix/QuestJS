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


*/





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
    if (!s) errormsg("elements.opposed was sent something that evaulates to false (type is " + (typeof s) + ")")
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
    this.reportText = "{nv:attacker:attack:true} {nm:target:the}."
    this.targetText = "Targeting {nm:target:the}."
    for (let key in data) this[key] = data[key]
  }
}

class MetaSkill extends Skill {
  constructor(name, data) {
    super(name, data)
    this.meta = true
  }
}

class Spell extends Skill {
  constructor(name, data) {
    super(name, data)
    this.spell = true
    this.noWeapon = true
    this.reportText = "{nv:attacker:cast:true} {i:{nm:skill}}."
    this.statForOffensiveBonus = 'spellCasting'
  }
}

class SpellSelf extends Spell {
  constructor(name, data) {
    super(name, data)
    this.getPrimaryTargets = function() { 
      return false 
    }
    this.noTarget = true
    this.automaticSuccess = true
    this.reportText = "{nv:attacker:cast:true} the {i:{nm:skill}} spell."
  }
}

class SpellInanimate extends Spell {
  constructor(name, data) {
    super(name, data)
    this.inanimateTarget = true
  }
}


const defaultSkill = new Skill("Basic attack", {
  icon:"sword1",
  tooltip:"A simple attack",
  modifyOutgoingAttack:function(attack) {}
})

const skills = {
  list:[defaultSkill],
  add:function(skill) { this.list.push(skill) },
  
  find:function(skillName) { 
    return this.list.find(el => skillName === el.name.toLowerCase() || (el.regex && skillName.match(el.regex))) 
  },
  
  findName:function(skillName) { 
    return this.list.find(el => skillName === el.name) 
  },
  

  terminate:function(spell, item) {
    array.remove(item.activeEffects, spell.name)
    delete item['countdown_' + spell.name]
    let s = "The {i:" + spell.name + "} spell" + (item === game.player ? '' : " on " + lang.getName(item, {article:DEFINITE})) + " terminates."
    if (spell.terminatingScript) s += spell.terminatingScript(item)
    return s
  }
}







// The Attack object is used when someone casts a spell or makes a weapon or unarmed attack.
// The target could be the attacker, the room, a weapon or other item, or a number of characters.
// The Attack object should only be created once we are sure the command is successful
// (that is, the player input is okay - we can still throw errors if the code is wrong!).
// The Attack object may get modified at several points in the process,
// each can add to the report array to say what it has done
// If the primaryTargets is false, the target is the attacker himself
class Attack {
  static createAttack(attacker, target, skill) {
    const attack = new Attack()
    
    attack.attacker = attacker
    attack.skill = skill
    attack.target = target

    // Find the skill
    if (attacker === game.player && skill === undefined) {
      attack.skill = skillUI.getSkillFromButtons();
      skillUI.resetButtons();
    }
    if (!attack.skill) attack.skill = defaultSkill;

    // Set targets
    if (attack.skill.noTarget) {
      attack.primaryTargets = attack.skill.getPrimaryTargets ? attack.skill.getPrimaryTargets() : [];
    }
    else {
      attack.primaryTargets = attack.skill.getPrimaryTargets ? attack.skill.getPrimaryTargets(target) : [target];
    }
    attack.secondaryTargets = attack.skill.getSecondaryTargets ? attack.skill.getSecondaryTargets(target) : [];

    // Set some defaults first
    attack.attackNumber = 1
    attack.report = []
    attack.armourModifier = 0
    attack.armourMultiplier = 1
    attack.primarySuccess = attack.skill.primarySuccess || 'A hit!'
    attack.primaryFailure = attack.skill.primaryFailure || 'A miss!'
    attack.secondarySuccess = attack.skill.secondarySuccess || 'A hit!'
    attack.secondaryFailure = attack.skill.secondaryFailure || 'A miss!'
    attack.msg(attack.skill.reportText, 1)
    

    // Get the weapon (for most monsters, the monster IS the weapon)
    // Base the attack on the weapon
    // Some skills use no weapon
    if (attack.skill.noWeapon) {
      attack.damage = attack.skill.damage
      if (attack.damage) attack.setDamageAtts(attack.damage)
      attack.offensiveBonus = attack.skill.offensiveBonus || 0
      attack.element = attack.skill.element
    }
    else {
      attack.weapon = attacker.getEquippedWeapon()
      attack.offensiveBonus = attack.weapon.offensiveBonus || 0
      attack.element = attack.weapon.element
      attack.damage = attack.weapon.damage
      attack.setDamageAtts(attack.damage)
    }
    if (attack.skill.secondaryDamage) attack.setDamageAtts(attack.skill.secondaryDamage, 'secondaryDamage')
    
    // modify for the skill
    if (attack.skill.modifyOutgoingAttack) attack.skill.modifyOutgoingAttack(attack)
      
    // Now take into account the attacker's stats
    attacker.modifyOutgoingAttack(attack)
    
    // Now take into account the attacker's weapon's active spell
    attack.applyActiveEffects(attack.weapon)
    
    // Now take into account the attacker's active spells
    attack.applyActiveEffects(attack.attacker)
    
    const items = scopeHeldBy(attack.attacker)
    for (let el of items) {
      if (el.modifyOutgoingAttack) el.modifyOutgoingAttack(attack)
    }
  
    // Now take into account the target's room
    const room = (target ? w[target.loc] : w[attacker.loc])
    if (room.modifyOutgoingAttack) room.modifyOutgoingAttack(attack)
    attack.applyActiveEffects(room)

    return attack
  }
  
  
  // Once we have an attack object set up, call this to apply the attack to each target.
  // Creates a clone of this attack and calls resolve on it for each target to do the real work
  apply() {
    if (this.abort) return this
    
    // target self
    if (!this.primaryTargets) {
      this.resolve(this.attacker, true, false)
      return this
    }
    
    // target inanimate object
    // TODO!!!
    if (this.inanimateTarget) {
      this.resolveForInanimate(this.attacker, this.primaryTargets)
      return this
    }

    // Iterate through the targets and apply the attack
    // The attack may be modified by the target, so we send a clone
    for (let target of this.primaryTargets) {
      for (let i = 0; i < this.attackNumber; i++) {
        this.clone().resolve(target, true, i)
      }
    }
    for (let target of this.secondaryTargets) {
      for (let i = 0; i < this.attackNumber; i++) {
        this.clone().resolve(target, false, i)
      }
    }
    return this
  }
  
  



  // Once we have an attack object set up, call this to apply the attack to each target.
  // This applies all effects, and puts the descriptive text in report
  // (report is the attribute of the parent attack, not this clone)
  resolve(target, isPrimary, count) {
    this.target = target

    // Now take into account the target's active spell
    this.applyActiveEffects(target)
    
    const items = scopeHeldBy(target)
    for (let el of items) {
      if (el.modifyIncomingAttack) el.modifyIncomingAttack(this)
    }
  
    // Now take into account the target
    if (target.modifyIncomingAttack) target.modifyIncomingAttack(this)
    if (this.element && target.element) this.modifyElementalAttack(target.element, this, isPrimary)

    // Is the target affected (hit)?
    if (this.skill.automaticSuccess) {
      this.msg(processText(this.skill.targetText, {skill:this.skill, attacker:this.attacker, target:target}), 3)
      this.msg("Element: " + this.element, 4)
      this.msg("Automatic success", 4)
    }
    else {
      this.roll = random.int(1, 20)
      this.result = this.offensiveBonus - target.defensiveBonus + this.roll - 10
      this.msg(processText(this.skill.targetText, {skill:this.skill, attacker:this.attacker, target:target}), 3)
      if (this.element) this.msg("Element: " + this.element, 4)
      this.msg("Offensive bonus: " + this.offensiveBonus, 4)
      this.msg("Roll: " + this.roll, 4)
      
      if (this.result < 0) {
        if (isPrimary && this.primaryFailure) {
          this.msg(processText(this.primaryFailure, this), 1)
        }
        else if (!isPrimary && this.secondaryFailure) {
          this.msg(processText(this.secondaryFailure, this), 1)
        }
        else {
          this.msg("A miss...\n", 1)
        }
        if (isPrimary && this.skill.onPrimaryFailure) this.skill.onPrimaryFailure(this.prototype)
        return
      }
      
      if (isPrimary && this.primarySuccess) {
        this.msg(processText(this.primarySuccess, this), 1)
      }
      else if (!isPrimary && this.secondarySuccess) {
        this.msg(processText(this.secondarySuccess, this), 1)
      }
      else {
        this.msg("A hit!", 1)
      }
    }

    // check for any spell effects that will be terminated by this for use later
    const terminatedSpells = []
    if (this.skill.incompatible) {
      for (let spellName of target.activeEffects) {
        for (let regex of this.skill.incompatible) {
          if (spellName.match(regex)) terminatedSpells.push(spellName)
        }
      }
    }
      
    if (this.skill.ongoing) target.activeEffects.push(this.skill.name)
    if (this.skill.duration) target['countdown_' + this.skill.name] = this.skill.duration
    if (this.skill.targetEffect) {
      this.skill.targetEffect(this, isPrimary, count)
    }

    if (isPrimary) {
      this.applyDamage(target)
    }
    else {
      this.applyDamage(target, 'secondaryDamage')
    }

    for (let spellName of terminatedSpells) {
      this.msg(skills.terminate(skills.findName(spellName), target))
    }
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
    this.report.push({t:processText(s, this), level:n || 1})
  }

  output() {
    settings.output(this.report)
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
      errormsg(`Weapon ${this.weapon.name} has a bad damage attribute (${string}).`);
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
      this.msg(`Damage: ${this.damageNumber}d${this[prefix + 'Sides']}+${this[prefix + 'Bonus']}`, 3)
      let damage = this[prefix + 'Bonus'];
      for (let i = 0; i < this[prefix + 'Number']; i++) {
        const roll = random.int(1, this[prefix + 'Sides'])
        damage += roll
        this.msg(`Damage roll (d${this[prefix + 'Sides']}): ${roll}`, 5)
      }
      this.msg("Damage before armour: " + damage, 4)
      this.msg("Armour: " + target.armour, 4)
      damage -= this[prefix + 'Number'] * (target.armour * this.armourMultiplier + this.armourModifier)
      this.msg("Damage after armour: " + damage, 4)
      if (damage < 1) damage = 1;
      this.msg("Damage before multiplier: " + damage, 6)
      const modifiedDamage = this[prefix + 'Multiplier'] * damage
      this.msg("Damage: " + modifiedDamage, 1)
      target.health -= modifiedDamage
      this.msg("Health now: " + target.health, 2)
    }
  }

  
  applyActiveEffects(source) {
    if (!source || !source.activeEffects) return
    for (let el of source.activeEffects) {
      const effect = skills.findName(el)
      if (effect.modifyOutgoingAttack) effect.modifyOutgoingAttack(this, source)
    }
  }
}




















// Get a list of foes in the current room, with target first (whether a foe or not)
const getFoes = function(target) {
  const l = scopeHereListed().filter(function(el) {
    return el.npc && el.isHostile() && el !== target;
  });
  if (target !== undefined) l.unshift(target);
  return l;
}  

// Get a list of NPCs in the current room, with target first
const getAll = function(target) {
  const l = scopeHereListed().filter(function(el) {
    return el.npc && el !== target;
  });
  if (target !== undefined) l.unshift(target);
  return l;
}

// Get a list of foes in the current room, with target first (whether a foe or not)
const getFoesBut = function(target) {
  const l = scopeHereListed().filter(function(el) {
    return el.npc && el.isHostile() && el !== target;
  });
  return l;
}  

// Get a list of NPCs in the current room, with target first
const getAllBut = function(target) {
  const l = scopeHereListed().filter(function(el) {
    return el.npc && el !== target;
  });
  return l;
}



// Give a character a modifyOutgoingAttack function to have it modify an attack the character is making
// or modifyIncomingAttack for an attack it is receiving
const RPG_TEMPLATE = {
  offensiveBonus:0,
  defensiveBonus:0,
  armour:0,
  activeEffects:[],
  skillsLearnt:[],

  attack:function(isMultiple, char) {
    // Create an attack, based on the current skill, weapon and given target
    const attack = Attack.createAttack(game.player, this).apply().output()
      
    //msg(attack.result.join(''))
    return true;
  },

  modifyOutgoingAttack:function(attack) {
    if (!attack.skill.statForOffensiveBonus) {
      attack.offensiveBonus += this.offensiveBonus
    }
    else if (this[attack.skill.statForOffensiveBonus] !== undefined) {
      attack.offensiveBonus += this[attack.skill.statForOffensiveBonus]
    }
    else {
      errormsg("ERROR: Trying to use a stat the character " + this.name + " does not have: " + attack.statForOffensiveBonus)
    }
  },
  
  getEquippedWeapon:function() { return this; },
  
  isHostile:function() { return true; },

  getArmour:function() { return this.armour },

}



const RPG_PLAYER = function() {
  const res = PLAYER();
  
  for (let key in RPG_TEMPLATE) res[key] = RPG_TEMPLATE[key];
  
  //res.getEquippedWeapon = function() { return this.equipped ? w[this.equipped] : w.weapon_unarmed; }
  
  res.getEquippedWeapon = function() {
    const carried = scopeHeldBy(this)
    return carried.find(el => el.equipped && el.weapon) || w.weapon_unarmed
  }

  res.getArmour = function() {
    const garments = scopeHeldBy(this).filter(el => el.worn)
    let armour = 0
    for (let el of garments) armour += el.getArmour()
    return armour / settings.armourScaling
  }

  return res;
}



const RPG_NPC = function(female) {
  const res = NPC(female);

  for (let key in RPG_TEMPLATE) res[key] = RPG_TEMPLATE[key];
  
  res.getVerbs = function() {
    return [lang.verbs.lookat, lang.verbs.talkto, "Attack"];
  };
  
    
  return res;
}


const RPG_CORPOREAL_UNDEAD = function(female) {
  const res = RPG_NPC(female);

  res.element = necrotic
    
  return res;
}


const RPG_NON_CORPOREAL_UNDEAD = function(female) {
  const res = RPG_CORPOREAL_UNDEAD(female);

  res.noCorpse = true

  res.modifyIncomingAttack = function(attack) {
    if (attack.element || attack.isMagic || attack.spell) {
      attack.damageMultiplier = 0
      attack.primarySuccess = attack.primarySuccess.replace(/[.!]/, ", but it passes straight through {sb:target}.")
    }
  }
    
  return res;
}





// The attack agenda item will have the monster wait until the player appears, then attack, fllowing if the player moves away
agenda.attack = function(npc, arr) {

  // do stuff
  return false
}





const EQUIPPABLE = function() {
  const res = $.extend({}, TAKEABLE_DICTIONARY);
  
  res.equippable = true;
  res.activeEffects = [],
  
  res.getObstructing = function(char) {
    return scopeHeldBy(char).filter(el => el.equipped && this.match(el))
  }
  
  res.getVerbs = function() {
    if (!this.isAtLoc(game.player.name)) {
      return [lang.verbs.lookat, lang.verbs.take];
    }
    else if (game.player.equipped === this.name) {
      return [lang.verbs.drop, "Unequip"];
    }
    else {
      return [lang.verbs.drop, "Equip"];
    }
  };

  res.drop = function(isMultiple, char) {
    if (this.equipped) {
      delete this.equipped
    }
    msg(prefix(this, isMultiple) + lang.drop_successful(char, this));
    this.moveToFrom(char.loc, this.loc);
    return true;
  },
  
  res.equip = function(isMultiple, char) {
    const equipped = this.getObstructing(char)
    if (equipped.includes(this)) {
      msg("It already is.");
      return false;
    }
    if (equipped.length === 0) {
      msg("{nv:char:draw:true} {nm:item:the}.", {char:char, item:this})
    }
    else if (equipped.length === 1) {
      const params = {char:char, item:this}
      msg("{nv:char:put:true} away " + formatList(equipped, {article:DEFINITE, joiner:" and "}) + ", and equip {nm:item:the}.", params)
      for (let el of equipped) delete el.equipped
    }
    this.equipped = true
    return true;
  }

  res.unequip = function(isMultiple, char) {
    if (!this.equipped) {
      msg("It already is.");
      return false;
    }
    delete this.equipped
    const params = {char:char, weapon:this}
    msg("{nv:char:put:true} away {nm:weapon:the}.", params)
    return true;
  }
  
  res.getNameModifier = function(options) {
    if (!options) options = {}
    let s = lang.getName(this, options)
    return (this.equipped && options.modified && (this.isAtLoc(game.player.name))) ? " (equipped)": ""
  }

  return res;
}  
  


const WEAPON = function(damage) {
  const res = $.extend({}, EQUIPPABLE())
  res.weapon = true
  res.damage = damage
  res.match = function(item) { return item.weapon }
  res.icon = () => '<img src="' + settings.imagesFolder + 'weapon12.png" />'
  return res;
}  


const LIMITED_USE_WEAPON = function(damage, ammo) {
  const res = $.extend({}, WEAPON(damage))
  res.ammo = ammo
  res.activeEffects.push("Limited ammo")
  return res;
}  



skills.add(new MetaSkill("Limited ammo", {
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

/*
skills.add(new MetaSkill("Deteriorating", {
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
  const res = $.extend({}, EQUIPPABLE())
  res.shield = true
  res.shieldBonus = bonus
  res.match = function(item) { return item.shield }
  res.modifyIncomingAttack = function(attack) {
    if (!this.equipped) return
    attack.offensiveBonus -= this.shieldBonus
  }
  res.icon = () => '<img src="' + settings.imagesFolder + 'shield12.png" />'
  return res;
}  


const SPELLBOOK = function(list) {
  const res = $.extend({}, TAKEABLE_DICTIONARY)
  res.spellbook = true
  res.spellsAvailableToLearn = list
  res.examineX = ''
  res.examine = function() {
    msg(this.examineX + ' It contains the spells ' + formatList(this.spellsAvailableToLearn.map(el => '<i>' + el + '</i>'), {lastJoiner:' and '}) + '.')
  }
  res.icon = () => '<img src="' + settings.imagesFolder + 'spell12.png" />'
  return res 
}






createItem("weapon_unarmed", WEAPON(), {
  loc:"me",
  image:"fist",
  damage:"d4",
  offensiveBonus:-2,
  alias:"unarmed",
  scenery:true,
  isAtLoc:function(loc, situation) {
    if (situation !== world.SCOPING) return false
    if (typeof loc !== "string") loc = loc.name
    return (this.loc === loc);
  },
});


createItem("spell_handler", {
  eventPeriod:1,
  eventActive:true,
  eventScript:function() {
    const objs = scopeBy(function(o) { return o.activeEffects !== undefined })
    //console.log(objs)
    for (let el of objs) {
      for (let spellName of el.activeEffects) {
        if (el['countdown_' + spellName]) {
          el['countdown_' + spellName]--
          if (el['countdown_' + spellName] <= 0) {
            msg(skills.terminate(skills.findName(spellName), el))
          }
        }
      }
    }
  },
  isAtLoc:function() { return false },
});


  


commands.push(new Cmd('Attack', {
  npcCmd:true,
  rules:[cmdRules.isHere],
  regex:/^(attack|att) (.+)$/,
  objects:[
    {ignore:true},
    {scope:parser.isPresent}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(item, isMultiple) + "No point attacking " + lang.getName(item, {article:DEFINITE}) + ".");
    return false;
  },
}));


commands.push(new Cmd('Equip', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  regex:/^(equip|brandish|draw) (.+)$/,
  objects:[
    {ignore:true},
    {scope:parser.isHeld}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(item, isMultiple) + lang.pronounVerb(item, "be", true) + " not something you can equip.");
    return false;
  },
}));


commands.push(new Cmd('Unequip', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  regex:/^(unequip|holster|sheath|put away) (.+)$/,
  objects:[
    {ignore:true},
    {scope:parser.isHeld}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(item, isMultiple) + lang.pronounVerb(item, "be", true) + " not something you can equip.");
    return false;
  },
}));



world.isSpellAvailable = function(char, spell) {
  for (let el of scopeHeldBy(char)) {
    if (el.spellsAvailableToLearn && el.spellsAvailableToLearn.includes(spell.name)) {
      return el
    }
  }
  return false
}


commands.push(new Cmd('LearnSpell', {
  npcCmd:true,
  rules:[cmdRules.isHere],
  regex:/^(learn) (.+)$/,
  objects:[
    {ignore:true},
    {text:true}
  ],
  script:function(objects) {
    const spell = skills.find(objects[0])
    if (!spell || !spell.spell) return failedmsg("There is no spell called " + objects[0] + ".")
      
    const source = world.isSpellAvailable(game.player, spell)
    if (!source) return failedmsg("You do not have anything you can learn {i:" + spell.name + "} from.")
    
    game.player.skillsLearnt.push(spell.name)
    msg("You learn {i:" + spell.name + "} from " + lang.getName(source, {article:DEFINITE}) + ".")
    return world.SUCCESS
  },
}));



commands.push(new Cmd('CastSpell', {
  npcCmd:true,
  rules:[cmdRules.isHere],
  regex:/^(cast|invoke) (.+)$/,
  objects:[
    {ignore:true},
    {text:true}
  ],
  script:function(objects) {
    const spell = skills.find(objects[0])
    if (!spell || !spell.spell) return failedmsg("There is no spell called " + objects[0] + ".")
      
    if (!game.player.skillsLearnt.includes(spell.name)) return failedmsg("You do not know the spell {i:" + spell.name + "}.")
    
    if (!spell.noTarget) return failedmsg("You need a target for the spell {i:" + spell.name + "}.")
  
    const attack = Attack.createAttack(game.player, game.player, spell).apply().output()
    
    //return skills.castSpell(spell, game.player, game.player)
  },
}));





commands.push(new Cmd('CastSpellAt', {
  npcCmd:true,
  rules:[cmdRules.isHere],
  regex:/^(cast|invoke) (.+) (at|on) (.+)$/,
  objects:[
    {ignore:true},
    {text:true},
    {ignore:true},
    {scope:parser.isPresent},
  ],
  script:function(objects) {
    const spell = skills.find(objects[0])
    if (!spell || !spell.spell) return failedmsg("There is no spell called " + objects[0] + ".")
      
    if (!game.player.skillsLearnt.includes(spell.name)) return failedmsg("You do not know the spell {i:" + spell.name + "}.")
    
    const target = objects[1][0]

    // check target
    
    if (spell.damage && target.health === undefined) return failedmsg("You can't attack that.")

    const attack = Attack.createAttack(game.player, target, spell).apply().output()
    return world.SUCCESS
  },
}));


commands.push(new Cmd('DebugRPG', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  regex:/^(rpg)$/,
  objects:[
    {ignore:true},
  ],
  script:function(objects) {
    settings.attackOutputLevel = 10
    metamsg("All output from attacks will now be seen.");
    return world.SUCCESS_NO_TURNSCRIPTS
  },
}));
