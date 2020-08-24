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
  
  byname(options) {
    return (options.article === DEFINITE ? 'the ' : '') + this.name
  }
}

class Spell extends Skill {
  constructor(name, data) {
    super(name, data)
    this.spell = true
    this.noWeapon = true
    this.reportText = "{nv:attacker:cast:true} {i:{nm:skill}}."
  }
}

class SpellSelf extends Spell {
  constructor(name, data) {
    super(name, data)
    this.getPrimaryTargets = function() { 
      console.log('here')
      return false 
    }
    this.noTarget = true
    this.automaticSuccess = true
    this.reportText = "{nv:attacker:cast:true} the {i:{nm:skill}} spell."
  }
}


const defaultSkill = new Skill("Basic attack", {
  icon:"sword1",
  tooltip:"A simple attack",
  processAttack:function(attack) {}
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
  

  terminate:function(spell, item, report) {
    arrayRemove(item.activeEffects, spell.name)
    delete item['countdown_' + spell.name]
    report.push({t:"The {i:" + spell.name + "} spell" + (item === game.player ? '' : " on " + item.byname({article:DEFINITE})) + " terminates.", level:1})
    if (spell.terminatingScript) spell.terminatingScript(item, report)
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

    // Find the skill
    if (attacker === game.player && skill === undefined) {
      attack.skill = skillUI.getSkillFromButtons();
      skillUI.resetButtons();
    }
    if (!attack.skill) attack.skill = defaultSkill;

    // Set targets
    if (attack.skill.noTarget) {
      console.log('here')
      attack.primaryTargets = attack.skill.getPrimaryTargets ? attack.skill.getPrimaryTargets() : [];
    }
    else {
      attack.primaryTargets = attack.skill.getPrimaryTargets ? attack.skill.getPrimaryTargets(target) : [target];
    }
    console.log(attack.primaryTargets)
    attack.secondaryTargets = attack.skill.getSecondaryTargets ? attack.skill.getSecondaryTargets(target) : [];

    // Set some defaults first
    attack.armour = 0
    attack.attackNumber = 1
    attack.report = []
    attack.armourModifier = 0
    
    attack.report.push({t:processText(attack.skill.reportText, {skill:attack.skill, attacker:attack.attacker, target:target}), level:1})
    

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
      attack.weapon = attacker.getEquippedWeapon ? attacker.getEquippedWeapon() : attacker
      attack.offensiveBonus = attack.weapon.offensiveBonus || 0
      attack.element = attack.weapon.element
      attack.damage = attack.weapon.damage
      attack.setDamageAtts(attack.damage)
    }
    if (attack.secondaryDamage) attack.setDamageAtts(attack.secondaryDamage, 'secondaryDamage')
    
    // modify for the skill
    if (attack.skill.processAttack) attack.skill.processAttack(attack)
      
    // Now take into account the attacker's stats
    attacker.processAttack(attack)
    
    // Now take into account the attacker's weapon's active spell
    if (attack.weapon && attack.weapon.activeSpell) {
      const spell = spells.findName[attack.weapon.activeSpell]
      if (spell.processAttack) spell.processAttack(attack)
    }
    
    // Now take into account the attacker's active spells
    for (let spell of attacker.activeEffects) {
      if (spell.processAttack) attacker.activeSpell.processAttack(attack)
    }
  
    // Now take into account the target's room
    const room = (target ? w[target.loc] : w[attacker.loc])
    if (room.processAttack) room.processAttack(attack)

    // Now take into account the room's active spell
    if (room.activeSpell && room.activeSpell.processAttack) room.activeSpell.processAttack(attack)

    return attack
  }
  
  
  // Once we have an attack object set up, call this to apply the attack to each target.
  // Calls applyAttack for each target to do the real work
  apply() {
    // target self
    if (!this.primaryTargets) {
      console.log('here')
      this.resolve(this.attacker, true, false)
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
    console.log('here')
    this.target = target

    // Now take into account the target's active spell
    for (let spellName of target.activeEffects) {
      const spell = skills.findName(spellName)
      if (spell.modifyAttack) spell.modifyAttack(this, target, this.report)
    }
    
    // Now take into account the target
    if (target.modifyAttack) target.modifyAttack(this, this.report)
    
    // Now take into account the target
    if (this.element && target.element) this.modifyElementalAttack(target.element, this.report)

    // Is the target affected (hit)?
    if (this.skill.automaticSuccess) {
      this.report.push({t:processText(this.skill.targetText, {skill:this.skill, attacker:this.attacker, target:target}), level:3})
      this.report.push({t:"Element: " + this.element, level:4})
      this.report.push({t:"Automatic success", level:4})
    }
    else {
      this.roll = random.int(1, 20)
      this.result = this.offensiveBonus - target.defensiveBonus + this.roll - 10
      this.report.push({t:processText(this.skill.targetText, {skill:this.skill, attacker:this.attacker, target:target}), level:3})
      if (this.element) this.report.push({t:"Element: " + this.element, level:4})
      this.report.push({t:"Offensive bonus: " + this.offensiveBonus, level:4})
      this.report.push({t:"Roll: " + this.roll, level:4})
      
      if (this.result < 0) {
        if (isPrimary && this.skill.primaryFailure) {
          this.report.push({t:processText(this.skill.primaryFailure, {target:target}), level:1})
        }
        else if (!isPrimary && this.skill.secondaryFailure) {
          this.report.push({t:processText(this.skill.secondaryFailure, {target:target}), level:1})
        }
        else {
          this.report.push({t:"A miss...\n", level:1})
        }
        if (isPrimary && this.skill.onPrimaryFailure) this.skill.onPrimaryFailure(this.prototype)
        return
      }
      
      if (isPrimary && this.skill.primarySuccess) {
        this.report.push({t:processText(this.skill.primarySuccess, {target:target}), level:1})
      }
      else if (!isPrimary && this.skill.secondarySuccess) {
        this.report.push({t:processText(this.skill.secondarySuccess, {target:target}), level:1})
      }
      else {
        this.report.push({t:"A hit!", level:1})
      }
    }

    // check fr any spell effects that will be terminated by this for use later
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
    console.log(this.skill)
    if (this.skill.targetEffect) {
      console.log('here')
      this.skill.targetEffect(this, isPrimary, count)
    }

    // calculate base damage
    if (this.damageBonus || this.damageNumber) {
      this.report.push({t:`Damage: ${this.damageNumber}d${this.damageSides}+${this.damageBonus}`, level:3})
      let damage = this.damageBonus;
      for (let i = 0; i < this.damageNumber; i++) {
        const roll = random.int(1, this.damageSides)
        damage += roll
        this.report.push({t:`Damage roll (d${this.damageSides}): ${roll}`, level:5})
      }
      this.report.push({t:"Damage before armour: " + damage, level:4})
      this.report.push({t:"Armour: " + target.armour, level:4})
      damage -= this.damageNumber * (target.armour + this.armourModifier)
      this.report.push({t:"Damage after armour: " + damage, level:4})
      if (damage < 1) damage = 1;
      const modifiedDamage = this.damageModifier * damage
      this.report.push({t:"Damage: " + modifiedDamage, level:1})
      target.health -= modifiedDamage
      this.report.push({t:"Health now: " + target.health, level:2})
    }

    for (let spellName of terminatedSpells) {
      skills.terminate(skills.findName(spellName), target, this.report)
    }
  }

  modifyElementalAttack(element, report) {
    if (this.element === element) {
      report.push({t:"Damage halved as same element", level:4})
      this.damageModifier *= 0.5
    }
    if (this.element === elements.opposed(element)) {
      report.push({t:"Damage doubled as opposed element", level:4})
      this.damageModifier *= 2
    }
  }

  output() {
    for (let el of this.report) {
      if (el.level <= settings.attackOutputLevel) {
        if (el.level === 1) {
          msg(el.t)
        }
        else {
          metamsg(el.t)
        }
      }
    }
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
    this[prefix + 'Modifier'] = 1
  }
  getDamageAtts(string) {
    const regexMatch = /^(\d*)d(\d+)([\+|\-]\d+)?$/i.exec(string);
    if (regexMatch === null) {
      errormsg(`Weapon ${this.weapon.name} has a bad damage attribute (${string}).`);
      return;
    }
    const res = {}
    res.number = regexMatch[1] === ""  ? 1 : parseInt(regexMatch[1]);
    res.sides = parseInt(regexMatch[2]);
    res.bonus = (regexMatch[3] === undefined  ? 0 : parseInt(regexMatch[3]));
    res.modifier = 1
    return res
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



// Give a character a processAttack function to have it modify an attack the character is making
// or modifyAttack for an attack it is receiving
const RPG_TEMPLATE = {
  offensiveBonus:0,
  armour:0,
  defensiveBonus:0,
  activeEffects:[],
  skillsLearnt:[],

  attack:function(isMultiple, char) {
    // Create an attack, based on the current skill, weapon and given target
    const attack = Attack.createAttack(game.player, this).apply().output()
      
    //msg(attack.result.join(''))
    return true;
  },

  processAttack:function(attack) {
    attack.offensiveBonus += this.offensiveBonus;
  },
  
  modifyDamage(damage, attack) {
    if (!attack.element) return damage
    if (this[attack.element + 'Modifier']) return damage * this[attack.element + 'Modifier']
    return damage
  },

}



const RPG_PLAYER = function() {
  const res = PLAYER();
  
  for (let key in RPG_TEMPLATE) res[key] = RPG_TEMPLATE[key];
  
  res.getEquippedWeapon = function() { return this.equipped ? w[this.equipped] : w.weapon_unarmed; }
  
  return res;
}

const RPG_NPC = function(female) {
  const res = NPC(female);

  for (let key in RPG_TEMPLATE) res[key] = RPG_TEMPLATE[key];
  
  res.getVerbs = function() {
    return [lang.verbs.lookat, lang.verbs.talkto, "Attack"];
  };
  
  res.getEquippedWeapon = function() { return this; }
  
  res.isHostile = function() { return true; }
    
  return res;
}

const WEAPON = function() {
  const res = $.extend({}, TAKEABLE_DICTIONARY);
  
  res.weapon = true;
  
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
    if (char.equipped === this.name) {
      delete char.equipped
    }
    msg(prefix(this, isMultiple) + lang.drop_successful(char, this));
    this.moveToFrom(char.loc, this.loc);
    return true;
  },
  
  res.equip = function(isMultiple, char) {
    if (char.equipped === this.name) {
      msg("It already is.");
      return false;
    }
    if (char.equipped) {
      msg(lang.pronounVerb(char, "put", true) + " away " + w[char.equipped].byname({article:DEFINITE}) + ".");
    }
    char.equipped = this.name;
    msg(lang.pronounVerb(char, "draw", true) + " " + this.byname({article:DEFINITE}) + ".");
    return true;
  }

  res.unequip = function(isMultiple, char) {
    if (char.equipped !== this.name) {
      msg("It already is.");
      return false;
    }
    delete char.equipped
    msg(lang.pronounVerb(char, "put", true) + " away " + this.byname({article:DEFINITE}) + ".");
    return true;
  }
  
  res.byname = function(options) {
    if (!options) options = {};
    let s = "";
    if (options.article === DEFINITE) {
      s = lang.addDefiniteArticle(this);
    }
    if (options.article === INDEFINITE) {
      s = lang.addIndefiniteArticle(this);
    }
    s += this.alias;
    if (options && options.possessive) s += "'s";
    if (game.player.equipped === this.name && options.modified && (this.isAtLoc(game.player.name))) { s += " (equipped)"; }
    if (options && options.capital) s = sentenceCase(s);
    return s;
  };

  return res;
}  
  

const SPELLBOOK = function(list) {
  const res = $.extend({}, TAKEABLE_DICTIONARY);
  res.spellbook = true;
  res.spellsAvailableToLearn = list
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
    const report = []
    for (let el of objs) {
      for (let spellName of el.activeEffects) {
        if (el['countdown_' + spellName]) {
          el['countdown_' + spellName]--
          if (el['countdown_' + spellName] <= 0) {
            skills.terminate(skills.findName(spellName), el, report)
          }
        }
      }
    }
    for (let el of report) msg(el.t)
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
    msg(prefix(item, isMultiple) + "No point attacking " + item.byname({article:DEFINITE}) + ".");
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
    msg("You learn {i:" + spell.name + "} from " + source.byname({article:DEFINITE}) + ".")
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
