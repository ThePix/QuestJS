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
    for (let key in data) this[key] = data[key]
  }
}

class Spell extends Skill {
  constructor(name, data) {
    super(name, data)
    this.spell = true
    //this.reportText = data.noTarget ? "{nv:attacker:cast:true} {i:" + name + "}." : "{nv:attacker:cast:true} {i:" + name + "} at {nm:target:the}."
    this.reportText = "{nv:attacker:cast:true} {i:" + name + "} at {nm:target:the}."
    this.noWeapon = true
  }
}

class SpellSelf extends Spell {
  constructor(name, data) {
    super(name, data)
    this.primaryTargets = function() { return false }
    this.reportText = "{nv:attacker:cast:true} {i:" + name + "} on {rf:attacker}."
    this.noTarget = true
    this.automaticSuccess = true
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
  
  

  castSpell:function(spell, caster, target) {
    if (!spell.spell) return true  // should never happen?

    // ????
    if (spell.damage && target) {
      if (!target.attack) return falsemsg("You can't attack that.")
      return target.attack(false, game.player)
      // handle as standard attack
    }

    const terminatedSpells = []
    for (let spellName of target.activeSpells) {
      for (let regex of spell.incompatible) {
        if (spellName.match(regex)) terminatedSpells.push(spellName)
      }
    }
    
    if (!spell.noTarget && !target) return falsemsg("You need a target to cast the {i:" + spell.name + "} spell.", {caster:caster})
      
    if (!target) target = caster
      
    if (spell.ongoing) target.activeSpells.push(spell.name)
    if (spell.duration) target['countdown_' + spell.name] = spell.duration
    if (target === caster) {
      msg("{nv:caster:cast:true} the {i:" + spell.name + "} spell.", {caster:caster})
    }
    else {
      msg("{nv:caster:cast:true} the {i:" + spell.name + "} spell on {nm:target:the}.", {caster:caster, target:target})
    }
    if (spell.castingScript) spell.castingScript(caster, target)
    return true

    
    for (let spellName of terminatedSpells) {
      skills.terminate(skills.findName(spellName), target)
    }
    return true
  },
  

  terminate:function(spell, item) {
    arrayRemove(item.activeSpells, spell.name)
    delete item['countdown_' + spell.name]
    msg("The {i:" + spell.name + "} spell" + (item === game.player ? '' : " on " + item.byname({article:DEFINITE})) + " terminates.")
    if (spell.terminatingScript) spell.terminatingScript(item)
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
  constructor(attacker, target, skill) {
    this.attacker = attacker
    this.skill = skill

    // Find the skill
    if (attacker === game.player && skill === undefined) {
      this.skill = skillUI.getSkillFromButtons();
      skillUI.resetButtons();
    }
    if (!this.skill) this.skill = defaultSkill;

    // Set targets
    this.primaryTargets = this.skill.getPrimaryTargets ? this.skill.getPrimaryTargets(target) : [target];
    this.secondaryTargets = this.skill.getSecondaryTargets ? this.skill.getSecondaryTargets(target) : [];

    // Set some defaults first
    this.armour = 0
    this.attackNumber = 1
    this.report = []
    this.outputLevel = 10
    this.armourModifier = 0

    // Get the weapon (for most monsters, the monster IS the weapon)
    // Base the attack on the weapon
    // Some skills use no weapon
    if (this.skill.noWeapon) {
      this.damage = this.skill.damage
      if (this.damage) this.setDamageAtts(this.damage)
      this.offensiveBonus = this.skill.offensiveBonus || 0
      this.element = this.skill.element
    }
    else {
      this.weapon = attacker.getEquippedWeapon ? attacker.getEquippedWeapon() : attacker
      this.offensiveBonus = this.weapon.offensiveBonus || 0
      this.element = this.weapon.element
      this.damage = this.weapon.damage
      this.setDamageAtts(this.damage)
    }
    
    // modify for the skill
    if (this.skill.processAttack) this.skill.processAttack(this)
  }
  
  
  setDamageAtts(string) {
    const regexMatch = /^(\d*)d(\d+)([\+|\-]\d+)?$/i.exec(string);
    if (regexMatch === null) {
      errormsg(`Weapon ${this.weapon.name} has a bad damage attribute (${string}).`);
      return;
    }
    this.damageNumber = regexMatch[1] === ""  ? 1 : parseInt(regexMatch[1]);
    this.damageSides = parseInt(regexMatch[2]);
    this.damageBonus = (regexMatch[3] === undefined  ? 0 : parseInt(regexMatch[3]));
    this.damageModifier = 1
  }


  resolve(target) {
    if (this.skill.automaticSuccess) {
      this.report.push({t:processText(this.skill.reportText, {attacker:this.attacker, target:target}), level:1})
      this.report.push({t:"Element: " + this.element, level:4})
      this.report.push({t:"Automatic success", level:4})
    }
    else {
      this.roll = random.int(1, 20)
      this.result = this.offensiveBonus - target.defensiveBonus + this.roll - 10
      this.report.push({t:processText(this.skill.reportText, {attacker:this.attacker, target:target}), level:1})
      this.report.push({t:"Element: " + this.element, level:4})
      this.report.push({t:"Offensive bonus: " + this.offensiveBonus, level:4})
      this.report.push({t:"Roll: " + this.roll, level:4})
      if (this.result < 0) {
        this.report.push({t:"A miss...\n", level:1})
        return
      }        
    }


    const terminatedSpells = []
    if (this.skill.incompatible) {
      for (let spellName of target.activeSpells) {
        for (let regex of spell.incompatible) {
          if (spellName.match(regex)) terminatedSpells.push(spellName)
        }
      }
    }
    
    if (!skills.castSpell(this.skill, this.attacker, target)) return world.FAILED
    
    for (let spellName of terminatedSpells) {
      skills.terminate(skills.findName(spellName), target)
    }

    // calculate base damage
    this.report.push({t:"A hit!", level:1})
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
    // now do spell effects
    this.output()
  }

  modifyElementalAttack(element) {
    if (this.element === element) {
      this.report.push({t:"Damage halved as same element", level:4})
      this.damageModifier *= 0.5
    }
    if (this.element === elements.opposed(element)) {
      this.report.push({t:"Damage doubled as opposed element", level:4})
      this.damageModifier *= 2
    }
  }

  output() {
    for (let el of this.report) {
      if (el.level <= this.outputLevel) {
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
    const copy = new Attack(this.attacker, this.target)
    for (let key in this) copy[key] = this[key]
    return copy
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




// Give a character a processAttack function to have it modify an attack the character is making
// or modifyAttack for an attack it is receiving
const RPG_TEMPLATE = {
  offensiveBonus:0,
  armour:0,
  defensiveBonus:0,
  activeSpells:[],
  skillsLearnt:[],

  attack:function(isMultiple, char) {
    // Create an attack, based on the current skill, weapon and given target
    const attack = new Attack(char, this)
    console.log(typeof attack.resolve)
      
    // Now take into account the attacker's stats
    char.processAttack(attack)
    
    // Now take into account the attacker's weapon's active spell
    if (attack.weapon && attack.weapon.activeSpell) {
      const spell = spells.findName[attack.weapon.activeSpell]
      if (spell.processAttack) spell.processAttack(attack)
    }
    
    // Now take into account the attacker's active spells
    for (let spell of char.activeSpells) {
      if (spell.processAttack) char.activeSpell.processAttack(attack)
    }
  
    // Now take into account the target's room
    if (w[this.loc].processAttack) w[this.loc].processAttack(attack)

    // Now take into account the room's active spell
    if (w[this.loc].activeSpell && w[this.loc].activeSpell.processAttack) w[this.loc].activeSpell.processAttack(attack)
    
  
    // Iterate through the targets and apply the attack
    // The attack may be modified by the target, so we send a clone
    let result = []
    console.log(attack)
    for (let target of attack.primaryTargets) {
      for (let i = 0; i < attack.attackNumber; i++) {
        result.push(target.applyAttack(attack.clone(), true, i))
      }
    }
    for (let target of attack.secondaryTargets) {
      for (let i = 0; i < attack.attackNumber; i++) {
        result.push(target.applyAttack(attack.clone(), false, i))
      }
    }
    msg(result.join(''))
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

  applyAttack(attack, isPrimary, count) {
    // Now take into account the target's active spell
    for (let spell of this.activeSpells) {
      if (spell.modifyAttack) spell.modifyAttack(attack, this)
    }
    
    // Now take into account the target
    if (this.modifyAttack) this.modifyAttack(attack)
    
    // Now take into account the target
    if (attack.element && this.element) attack.modifyElementalAttack(this.element)
    
    attack.resolve(this)
    attack.output()
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
    console.log("spell turnscript")
    const objs = scopeBy(function(o) { return o.activeSpells !== undefined })
    console.log(objs)
    for (let el of objs) {
      for (let spellName of el.activeSpells) {
        if (el['countdown_' + spellName]) {
          el['countdown_' + spellName]--
          if (el['countdown_' + spellName] <= 0) {
            skills.terminate(skills.findName(spellName), el)
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
    
    return skills.castSpell(spell, game.player, game.player)
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
    console.log("spell: " + objects[0])
    const spell = skills.find(objects[0])
    if (!spell || !spell.spell) return failedmsg("There is no spell called " + objects[0] + ".")
      
    if (!game.player.skillsLearnt.includes(spell.name)) return failedmsg("You do not know the spell {i:" + spell.name + "}.")
    
    console.log("target: " + objects[1][0])
    const target = objects[1][0]

    // check target
    
    if (spell.damage) {
      if (!target.attack) return failedmsg("You can't attack that.")
        return target.attack(false, game.player) ? world.SUCCESS : world.FAILED
      // handle as standard attack
      return
    }

    return skills.castSpell(spell, game.player, target)
  },
}));


