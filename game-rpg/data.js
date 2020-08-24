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
  offensiveBonus:-2,
});

createItem("flail", WEAPON(), {
  loc:"me",
  image:"flail",
  damage:"2d10+4",
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

createItem("spellbook", SPELLBOOK(["Fireball", "Stoneskin", "Steelskin", "Lightning bolt", "Ice shard"]), {
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
  noTarget:true,
  damage:'2d6',
  tooltip:"A fireball that fills the room (but does not affect you!)",
  primarySuccess:"{nv:target:reel:true} from the explosion.",
  primaryFailure:"{nv:target:ignore:true} it.",
  getPrimaryTargets:getAll,
  processAttack:function(attack) {
    attack.element = "fire";
    attack.report.push({t:"The room is momentarily filled with fire.", level:1})
  },
}))

skills.add(new Spell("Ice shard", {
  damage:'3d6',
  icon:'lightning',
  tooltip:"A shard of ice pierces your foe!",
  primarySuccess:"A shard of ice jumps from your finger to your target!",
  processAttack:function(attack) {
    attack.element = "frost";
  },
}))

skills.add(new Spell("Lightning bolt", {
  damage:'3d6',
  secondaryDamage:'2d6',
  icon:'lightning',
  tooltip:"A lightning bolt jumps from your out-reached hand to you foe!",
  primarySuccess:"A lightning bolt jumps from your out-reached hand to your target!",
  secondarySuccess:"A smaller bolt jumps your target to {nm:target:the}!",
  primaryFailure:"A lightning bolt jumps from your out-reached hand to your target, fizzling out before it can actually do anything.",
  secondaryFailure:"A smaller bolt jumps your target, but entirely misses {nm:target:the}!",
  getSecondaryTargets:getFoesBut,
  processAttack:function(attack) {
    attack.element = "storm";
  },
  onPrimaryFailure:function(attack) {
    attack.secondaryTargets = []
  },
}))

skills.add(new Spell("Cursed armour", {
  targetEffect:function(attack) {
    attack.report.push({t:processText("{nms:target:the:true} armour is reduced.", {target:attack.target}), level:1})
  },
  icon:'lightning',
  tooltip:"A lightning bolt jumps from your out-reached hand to you foe!", 
  processAttack:function(attack) {
    attack.armourModifier = (attack.armourModifier> 2 ? attack.armourModifier - 2 : 0)
  },
}))

skills.add(new SpellSelf("Stoneskin", {
  targetEffect:function(attack) {
    console.log('here')
    attack.report.push({t:"Your skin becomes as hard as stone - and yet still just as flexible.", level:1})
  },
  ongoing:true,
  incompatible:[/skin$/],
  modifyAttack:function(attack) {
    attack.armourModifier += 2
  },
}))

skills.add(new SpellSelf("Steelskin", {
  targetEffect:function(attack) {
    attack.report.push({t:"Your skin becomes as hard as steel - and yet still just as flexible.", level:1})
  },
  ongoing:true,
  duration:3,
  incompatible:[/skin$/],
  modifyAttack:function(attack) {
    attack.armourModifier += 4
  },
}))
