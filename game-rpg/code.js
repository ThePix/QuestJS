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

const RPG_NPC = function(female) {
  //const res = $.extend({}, NPC(female));
  const res = NPC(female);

  res.attack = function(isMultiple, char) {
    let skill = skills.getSkillFromButtons();
    skills.resetButtons();
    if (skill === null) skill = skills.list[0];
    msg(prefix(this, isMultiple) + nounVerb(char, "attack", true) + " " + this.byname({article:DEFINITE}) + " using " + skill.name + ".");
    return true;
  };
  
  res.getVerbs = function() {
    return [VERBS.lookat, VERBS.talkto, "Attack"];
  };
    
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




