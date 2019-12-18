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




// Effects like confusion would apply before this; it assumes we have a target set
// We are limited to a single target, but that seems natural for a parser game
// where you type  ATTACK GOBLIN

// Ammo

// How would we handle grenade?
// Would damage depend on the size of the room?
// In a small room the player takes damage
// Throw into another room
function performAttack(attacker, target) {
  let skill = skills.getSkillFromButtons();
  skills.resetButtons();
  if (skill === null) skill = skills.list[0];
  const attackNumber = skill.attackNumber ? skill.attackNumber : 1;
  let foes = [target];
  if (skill.attackTarget === "foes") {
    foes = getFoes(target);
  }
  else if (skill.attackTarget === "all") {
    foes = getAll(target);
  }
  else {
    foes = [target];
  }
  

  for (let j = 0; j < foes.length; j++) {
    for (let i = 0; i < attackNumber; i++) {
      const options = {count:i, skill:skill};
      if (j > 0) options.secondary = true
      // base attack from weapon
      const attack = new Attack(attacker.getEquippedWeapon());
      // modify for attacker
      attacker.processAttack(attack, options);
      for (let k = 0; k < attacker.attackModifiers.length; k++) {
        attacker.attackModifiers[k].processAttack(attack, options);
      }
      // modify for skill
      skill.processAttack(attack, options);
      // modify for room
      if (game.room.processAttack) game.room.processAttack(attack, options);
      // modify for foe
      for (let k = 0; k < foes[j].defenceModifiers.length; k++) {
        foes[j].defenceModifiers[k].processDefence(attack, options);
      }
      foes[j].processDefence(attack, options);
      
      attack.apply(attacker, foes[j], options);
    }
  }
}  






// Get a list of foes in the current room, with target first (whether a foe or not)
function getFoes(target) {
  const l = scope(isHere).filter(function(el) {
    return el.npc && el.isHostile() && el !== target;
  });
  if (target !== undefined) l.unshift(target);
  return l;
}  

// Get a list of NPCs in the current room, with target first
function getAll(target) {
  const l = scope(isHere).filter(function(el) {
    return el.npc && el !== target;
  });
  if (target !== undefined) l.unshift(target);
  return l;
}  


function Attack(weapon) {
  this.element = null;
  this.offensiveBonus = 0;
  this.armour = 0;
  for (let key in weapon) this[key] = weapon[key];
  if (this.damage === undefined) {
    errormsg(`Weapon ${weapon.name} has no damage attribute.`);
    return;
  }
  const regexMatch = /^(\d*)d(\d+)([\+|\-]\d+)?$/i.exec(this.damage);
  if (regexMatch === null) {
    errormsg(`Weapon ${weapon.name} has a bad damage attribute.`);
    return;
  }
  this.damageNumber = regexMatch[1] === ""  ? 1 : parseInt(regexMatch[1]);
  this.damageSides = parseInt(regexMatch[2]);
  this.damageBonus = (regexMatch[3] === undefined  ? 0 : parseInt(regexMatch[3]));
  this.apply = function(attacker, target, options) {
    let damage = this.damageBonus;
    for (let i = 0; i < this.damageNumber; i++) {
      damage += randomInt(1, this.damageSides);
    }
    damage -= this.damageSides - this.armour;
    if (damage < 1) damage = 1;
    msg(lang.nounVerb(attacker, "attack", true) + " " + target.byname({article:DEFINITE}) + ".");
    msg("Element: " + this.element);
    msg("Offensive bonus: " + this.offensiveBonus);
    msg(`Damage: ${this.damageNumber}d${this.damageSides}+${this.damageBonus}`);
    msg("Damage: " + damage);
  };
}





const RPG_TEMPLATE = {
  offensiveBonus:0,
  armour:0,
  defensiveBonus:0,
  // TODO!!! How we we save these?
  attackModifiers:[],
  defenceModifiers:[],

  attack:function(isMultiple, char) {
    performAttack(char, this);
    return true;
  },

  processDefence:function(attack) {
    attack.armour += this.armour;
    attack.offensiveBonus -= this.defensiveBonus;
  },
  
  processAttack:function(attack) {
    attack.offensiveBonus += this.defensiveBonus;
  },
}



const RPG_PLAYER = function() {
  const res = PLAYER();
  
  for (let key in RPG_TEMPLATE) res[key] = RPG_TEMPLATE[key];
  
  res.getEquippedWeapon = function() { return w[this.equipped]; }
  
  return res;
}

const RPG_NPC = function(female) {
  const res = NPC(female);

  for (let key in RPG_TEMPLATE) res[key] = RPG_TEMPLATE[key];
  
  res.getVerbs = function() {
    return [verbs.lookat, verbs.talkto, "Attack"];
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
      return [verbs.lookat, verbs.take];
    }
    else if (game.player.equipped === this.name) {
      return [verbs.drop, "Unequip"];
    }
    else {
      return [verbs.drop, "Equip"];
    }
  };

  res.drop = function(isMultiple, char) {
    if (char.equipped === this.name) {
      char.equipped = "weapon_unarmed";
    }
    msg(prefix(this, isMultiple) + drop_successful(char, this));
    this.moveToFrom(char.loc, this.loc);
    return true;
  },
  
  res.equip = function(isMultiple, char) {
    if (char.equipped === this.name) {
      msg("It already is.");
      return false;
    }
    if (char.equipped !== "weapon_unarmed") {
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
    char.equipped = "weapon_unarmed";
    msg(lang.pronounVerb(char, "put", true) + " away " + this.byname({article:DEFINITE}) + ".");
    return true;
  }
  
  return res;
}  
  



  


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




