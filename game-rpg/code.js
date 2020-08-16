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
    for (let key in data) this[key] = data[key]
  }
}

class Spell extends Skill {
  constructor(name, data) {
    super(name, data)
    this.spell = true
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
}








// The attack object may get modified at several points in the process
// Each can add to the report array to say what it has done

class Attack {
  constructor(attacker, target) {
    this.attacker = attacker

    // Find the skill
    if (attacker === game.player) {
      const skillName = skillUI.getSkillFromButtons();
      skillUI.resetButtons();
      this.skill = skills.findName(skillName)
    }
    if (!this.skill) this.skill = defaultSkill;

    // Set targets
    this.primaryTargets = this.skill.getPrimaryTargets ? this.skill.getPrimaryTargets(target) : [target];
    this.secondaryTargets = this.skill.getSecondaryTargets ? this.skill.getSecondaryTargets(target) : [];

    // Set some defaults first
    this.element = null;
    this.offensiveBonus = 0
    this.armour = 0
    this.attackNumber = 1
    this.report = []
    this.outputLevel = 1
    this.armourModifier = 0

    // Get the weapon (for most monsters, the monster IS the weapon)
    // Base the attack on the weapon
    // Some skills use no weapon
    if (this.skill.noweapon) {
      this.damage = this.skill.damage
    }
    else {
      this.weapon = attacker.getEquippedWeapon ? attacker.getEquippedWeapon() : attacker
      for (let key in this.weapon) if (key !== 'weapon') this[key] = this.weapon[key]
    }
    if (this.skill.processAttack) this.skill.processAttack(this)

    // process the damage    
    if (this.damage === undefined) {
      errormsg(`Weapon ${this.weapon.name} has no damage attribute.`);
      return;
    }
    const regexMatch = /^(\d*)d(\d+)([\+|\-]\d+)?$/i.exec(this.damage);
    if (regexMatch === null) {
      errormsg(`Weapon ${this.weapon.name} has a bad damage attribute.`);
      return;
    }
    this.damageNumber = regexMatch[1] === ""  ? 1 : parseInt(regexMatch[1]);
    this.damageSides = parseInt(regexMatch[2]);
    this.damageBonus = (regexMatch[3] === undefined  ? 0 : parseInt(regexMatch[3]));
    this.damageModifier = 1
  }

  resolve(target) {
    this.roll = random.int(1, 20)
    this.result = this.offensiveBonus - target.defensiveBonus + this.roll - 10


    this.report.push({t:lang.nounVerb(this.attacker, "attack", true) + " " + target.byname({article:DEFINITE}) + ".", level:1})
    this.report.push({t:"Element: " + this.element, level:4})
    this.report.push({t:"Offensive bonus: " + this.offensiveBonus, level:4})
    this.report.push({t:"Roll: " + this.roll, level:4})

    if (this.result > 0) {
      // calculate base damage
      this.report.push({t:"A hit!", level:1})
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
    else {
      this.report.push({t:"A miss...\n", level:1})
    }
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
    if (attack.weapon && attack.weapon.activeSpell && attack.weapon.activeSpell.processAttack) attack.weapon.activeSpell.processAttack(attack)
    
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
  bonus:-2,
  alias:"unarmed",
  scenery:true,
});


  


commands.push(new Cmd('Attack', {
  npcCmd:true,
  rules:[cmdRules.isHere],
  regex:/^(attack) (.+)$/,
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
    
    const terminatedSpells = []
    for (let spellName of game.player.activeSpells) {
      for (let regex of spell.incompatible) {
        if (spellName.match(regex)) terminatedSpells.push(spellName)
      }
    }
    
    console.log(terminatedSpells)

    msg("You cast {i:" + spell.name + "}...")
    spell.castingScript(game.player)
    
    if (spell.ongoing) {
      for (let spellName of terminatedSpells) {
        msg("The {i:" + spellName + "} spell terminates.")
        const spl = skills.findName(spellName)
        if (spl.terminatingScript) spl.terminatingScript(game.player)
        arrayRemove(game.player.activeSpells, spellName)
      }
      game.player.activeSpells.push(spell.name)
    }
    return world.SUCCESS
  },
}));
