"use strict";



  
createItem("me", RPG_PLAYER(), {
  loc:"practice_room",
  regex:/^(me|myself|player)$/,
  health:20,
  maxHealth:100,
  pp:40,
  maxPP:40,
  maxArmour:20,
  armour:10,
  examine:function(isMultiple) {
    msg(prefix(this, isMultiple) + "A " + (this.isFemale ? "chick" : "guy") + " called " + this.alias);
  },
});



createItem("knife", WEAPON(), {
  loc:"me",
  image:"knife",
  damage:"d4+2",
  bonus:-2,
  sharp:true,
  examine:function(isMultiple) {
    if (this.sharp) {
      msg(prefix(item, isMultiple) + "A really sharp knife.");
    }
    else {
      msg(prefix(item, isMultiple) + "A blunt knife.");
    }
  },
});

createItem("flail", WEAPON(), {
  loc:"me",
  image:"flail",
  damage:"2d10+4",
  sharp:true,
  examine:function(isMultiple) {
    if (this.sharp) {
      msg(prefix(item, isMultiple) + "A really sharp knife.");
    }
    else {
      msg(prefix(item, isMultiple) + "A blunt knife.");
    }
  },
});






createRoom("practice_room", {
  desc:'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
  hint:"There is a lot in this room! The bricks can be picked up by number (try GET 3 BRICKS). The book can be read. The coin is stuck to the floor. There are containers too. Kyle is an NPC; you can tell him to do nearly anything the player character can do (everything except looking and talking).",
});




createItem("goblin", RPG_NPC(false), {
  loc:"practice_room",
  damage:"3d6",
  health:40,
});

createItem("orc", RPG_NPC(false), {
  loc:"practice_room",
  damage:"2d10+4",
  health:60,
});

createItem("snotling", RPG_NPC(false), {
  loc:"practice_room",
  damage:"2d4",
  health:20,
});

createItem("friend", RPG_NPC(false), {
  loc:"practice_room",
  damage:"2d4",
  health:20,
  isHostile:function() { return false; }
});

createItem("chest", CONTAINER(true), {
  loc:"practice_room",
});

createItem("spellbook", SPELLBOOK(["Fireball", "Stoneskin", "Steelskin"]), {
  loc:"practice_room",
});





skills.add(new Skill("Double attack", {
  icon:"sword2",
  tooltip:"Attack one foe twice, but at -2 to the attack roll",
  processAttack:function(attack) {
    attack.offensiveBonus -= 2
    attack.attackNumber = 2
  },
}))

skills.add(new Skill("Sweeping attack", {
  icon:"sword3", 
  tooltip:"Attack one foe for normal damage, and any other for 4 damage; at -3 to the attack roll for reach", 
  getPrimaryTargets:getFoes,
  processAttack:function(attack) {
    if (options.secondary) {
      attack.damageNumber = 0;
      attack.damageBonus = 4;
    }
    attack.offensiveBonus -= 3;
  },
}))

skills.add(new Skill("Sword of Fire", {
  icon:"sword-fire", 
  tooltip:"Attack with a flaming sword", 
  processAttack:function(attack) {
    attack.element = "fire";
  },
}))

skills.add(new Skill("Ice Sword", {
  icon:"sword-ice", 
  tooltip:"Attack with a freezing blade",
  processAttack:function(attack) {
    attack.element = "ice";
  },
}))

skills.add(new Spell("Fireball", {
  castingScript:function() {
    msg("The room is momentarily filled with fire.")
  },
  icon:"fireball", 
  noweapon:true,
  damage:'2d6',
  tooltip:"A fireball that fills the room (but does not affect you!)", 
  getPrimaryTargets:getAll,
  processAttack:function(attack) {
    attack.element = "fire";
  },
}))

skills.add(new Spell("Stoneskin", {
  castingScript:function() {
    msg("Your skin becomes as hard as stone - and yet still just as flexible.")
  },
  ongoing:true,
  incompatible:[/skin$/],
  modifyAttack:function(attack) {
    attack.armourModifier += 2
  },
}))

skills.add(new Spell("Steelskin", {
  castingScript:function() {
    msg("Your skin becomes as hard as steel - and yet still just as flexible.")
  },
  ongoing:true,
  incompatible:[/skin$/],
  modifyAttack:function(attack) {
    attack.armourModifier += 4
  },
}))
