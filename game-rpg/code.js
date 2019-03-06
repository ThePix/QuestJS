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

function performAttack(attacker, target) {
  let skill = skills.getSkillFromButtons();
  skills.resetButtons();
  if (skill === null) skill = skills.list[0];
  const attackNumber = skill.attackNumber ? skill.attackNumber : 1;

  for (let i = 0; i < attackNumber; i++) {
    // base attack from weapon
    const attack = new Attack(attacker.getEquippedWeapon());
    // modify for attacker
    attacker.processAttack(attack);
    // modify for skill
    skill.processAttack(attack, i);
    // modify for room
    if (game.room.processAttack) game.room.processAttack(attack);
    // modify for target
    target.processDefence(attack);
    
    attack.apply(attacker, target, i);
  }
}  



const RPG_TEMPLATE = {
  offensiveBonus:0,
  armour:0,
  defensiveBonus:0,

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
    return [VERBS.lookat, VERBS.talkto, "Attack"];
  };
  
  res.getEquippedWeapon = function() { return this; }
    
  return res;
}


const WEAPON = function() {
  const res = $.extend({}, TAKEABLE_DICTIONARY);
  
  res.getVerbs = function() {
    if (!this.isAtLoc(game.player.name)) {
      return [VERBS.lookat, VERBS.take];
    }
    else if (game.player.equipped === this.name) {
      return [VERBS.drop, "Unequip"];
    }
    else {
      return [VERBS.drop, "Equip"];
    }
  };

  res.drop = function(isMultiple, char) {
    if (char.equipped === this.name) {
      char.equipped = "weapon_unarmed";
    }
    msg(prefix(this, isMultiple) + DROP_SUCCESSFUL(char, this));
    this.moveFromTo(this.loc, char.loc);
    return true;
  },
  
  res.equip = function(isMultiple, char) {
    if (char.equipped === this.name) {
      msg("It already is.");
      return false;
    }
    if (char.equipped !== "weapon_unarmed") {
      msg(pronounVerb(char, "put", true) + " away " + w[char.equipped].byname({article:DEFINITE}) + ".");
    }
    char.equipped = this.name;
    msg(pronounVerb(char, "draw", true) + " " + this.byname({article:DEFINITE}) + ".");
    return true;
  }

  res.unequip = function(isMultiple, char) {
    if (char.equipped !== this.name) {
      msg("It already is.");
      return false;
    }
    char.equipped = "weapon_unarmed";
    msg(pronounVerb(char, "put", true) + " away " + this.byname({article:DEFINITE}) + ".");
    return true;
  }
  
  return res;
}  
  



  


commands.push(new Cmd('Attack', {
  npcCmd:true,
  rules:[cmdRules.isHereRule],
  regex:/^(attack) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isPresent}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(this, isMultiple) + "No point attacking " + this.byname({article:DEFINITE}) + ".");
    return false;
  },
}));


commands.push(new Cmd('Equip', {
  npcCmd:true,
  rules:[cmdRules.isHeldRule, cmdRules.charCanManipulateRule],
  regex:/^(equip|brandish|draw) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isHeld}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(this, isMultiple) + pronounVerb(item, "be", true) + " not something you can equip.");
    return false;
  },
}));


commands.push(new Cmd('Unequip', {
  npcCmd:true,
  rules:[cmdRules.isHeldRule, cmdRules.charCanManipulateRule],
  regex:/^(unequip|holster|sheath|put away) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isHeld}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(this, isMultiple) + pronounVerb(item, "be", true) + " not something you can equip.");
    return false;
  },
}));




