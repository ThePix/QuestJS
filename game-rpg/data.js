"use strict";



  
createItem("me", RPG_PLAYER(), {
  loc:"practice_room",
  regex:/^(me|myself|player)$/,
  health:100,
  pp:40,
  maxPP:40,
  spellCasting:5,
  offensiveBonus:3,
  examine:function() {
    msg("A " + (this.isFemale ? "chick" : "guy") + " called " + this.alias);
  },
})



createItem("knife", BLADE_WEAPON("d4+2"), {
  loc:"me",
  image:"knife",
  examine:"An example of a poor weapon.",
  offensiveBonus:-2,
});

createItem("flail", CRUSH_WEAPON("2d10+4"), {
  loc:"me",
  image:"flail",
  examine:"An example of a good weapon.",
});

createItem("flaming_sword", BLADE_WEAPON("3d6+2"), {
  //loc:"me",
  image:"sword",
  examine:"An example of a magic weapon.",
  activeEffects:["Flaming weapon"],
});


createItem("ice_amulet", WEARABLE(4, ['neck']), {
  loc:"me",
  examine:"An example of a wearable magic item; it stops ice/frost damage.",
  modifyIncomingAttack:function(attack) {
    if (this.worn && attack.element === 'frost') {
      attack.damageMultiplier = 0
      attack.primarySuccess = attack.primarySuccess.replace(/[.!]/, ", but the ice amulet protects {sb:target}, and {pv:target:take} no damage.")
    }
  }
});





createRoom("practice_room", {
  desc:'A large room with straw scattered across the floor. The only exit is west',
  west:new Exit('great_hall'),
  south:new Exit('cupboard', {
    lockedmsg:"It seems to be locked."
  }),
  exit_locked_south:true,
});




createRoom("great_hall", {
  desc:'An imposing - and rather cold - room with a high, vaulted roof, and tapestries hanging from the walls.',
  east:new Exit('practice_room'),
  north:new Exit('yard'),
})

createItem("practice_room_door", LOCKED_DOOR("small_key", "great_hall", "practice_room"), {
  examine:'A very solid, wooden door.',
})

createRoom("cupboard", {
  desc:'A large storeroom, with no windows.',
  darkDesc:"It is dark, but the exit is north.",
  lightSource:function() { return world.LIGHT_NONE },
  north:new Exit('practice_room', {
    isHidden:function() { return false }
  }),
})

createItem("small_key", KEY(), {
  examine:'A small key.',
  loc:"practice_room",
})

createRoom("yard", {
  desc:'A large open area in front of the Great Hall, which is to the south. There is a lake to the north, and you can see an island in the lake.',
  south:new Exit('great_hall'),
  north:new Exit('lake_swimming', {
    simpleUse:function(char) {
      if (char.hasEffect('Walk On Water')) {
        return util.defaultSimpleExitUse(char, new Exit('lake', {origin:this.origin, dir:this.dir, msg:"You walk out on to the surface of the lake."}))
      }
      return util.defaultSimpleExitUse(char, this)
    },
    msg:'You dive into the lake...',
  }),
})

createRoom("lake", {
  desc:'You are stood on a lake! Dry land is to the south.',
  south:new Exit('yard'),
})

createRoom("lake_swimming", {
  desc:'You are swimming in a lake! Dry land is to the south.',
  south:new Exit('yard'),
})




createItem("goblin", RPG_NPC(false), {
  loc:"practice_room",
  damage:"d8",
  health:40,
  examine:"An example of a simple monster.",
});

createItem("orc", RPG_NPC(false), {
  loc:"practice_room",
  damage:"2d10+4",
  health:60,
  examine:"An example of a simple monster.",
});

createItem("huge_shield", SHIELD(10), {
  loc:"orc",
});

createItem("snotling", RPG_NPC(false), {
  loc:"practice_room",
  damage:"2d4",
  health:20,
  examine:"An example of a simple monster.",
});

createItem("rabbit", RPG_BEAST(false), {
  loc:"practice_room",
  damage:"2d4",
  health:20,
  examine:"{lore:An example of a monster you can talk to after casting the right spell, and is generally not hostile.:With Lore active, you can learn all about rabbit culture... they like carrots.}",
  talk:function() {
    switch (this.talktoCount) {
      case 1 : 
        msg("You say 'Hello,' to the rabbit, 'how is it going?'");
        msg("The rabbit looks at you. 'Need carrots.' It looks plaintively at it round tummy. 'Fading away bunny!");
        break;
      default: msg("You wonder what you can talk to the rabbit about."); break;
    }
    return true
  },  
});







createItem("frost_elemental_prototype", RPG_NPC(false), {
  alias:'frost elemental',
  damage:"2d4",
  element:'frost',
  health:35,
  examine:"A swirling mass of freezing air that chills you to the bone.",
})






createItem("chest", CONTAINER(true), LOCKED_WITH(), {
  loc:"practice_room",
});

createItem("spellbook", SPELLBOOK(["Fireball", "Stoneskin", "Steelskin", "Lightning bolt", "Ice shard"]), {
  examine:"An example of a spell book, obviously.",
  loc:"practice_room",
});

createItem("helmet", WEARABLE(2, ['head']), {
  loc:"practice_room",
  examine:"An example of armour; it will add +{armour} to your armour rating.",
  armour:10,
});

createItem("chestplate", WEARABLE(2, ['chest']), {
  loc:"practice_room",
  examine:"An example of armour; it will add +{armour} to your armour rating.",
  armour:20,
});

createItem("boots", WEARABLE(2, ['feet']), {
  loc:"practice_room",
  pronouns:lang.pronouns.plural,
});

createItem("shotgun", LIMITED_USE_WEAPON("2d10+4", 1), {
  loc:"practice_room",
  ammo:1,
  examine:"An example of a limited use weapon.",
  image:"flail",
});



skills.add(new Skill("Double attack", {
  level:2,
  icon:"sword2",
  tooltip:"Attack one foe twice, but at -2 to the attack roll",
  modifyOutgoingAttack:function(attack) {
    attack.offensiveBonus -= 2
    attack.attackNumber = 2
  },
}))

skills.add(new Effect("Flaming weapon", {
  modifyOutgoingAttack:function(attack, source) {
    if (!source.equipped) return
    attack.element = 'fire'
  },
}))

skills.add(new Effect("Frost vulnerability", {
  modifyIncomingAttack:function(attack) {
    if (attack.element) attack.damageMultiplier *= 2
  },
}))

skills.add(new Effect("Report for testing", {
  modifyOutgoingAttack:function(attack) {
    attack.element = 'fire'
  },
  modifyIncomingAttack:function(attack) {
    if (attack.element) attack.damageMultiplier *= 2
  },
}))

skills.add(new Skill("Sweeping attack", {
  level:1,
  icon:"sword3", 
  tooltip:"Attack one foe for normal damage, and any other for 4 damage; at -3 to the attack roll for reach", 
  getPrimaryTargets:rpg.getFoes,
  modifyOutgoingAttack:function(attack) {
    if (options.secondary) {
      attack.damageNumber = 0;
      attack.damageBonus = 4;
    }
    attack.offensiveBonus -= 3;
  },
}))

skills.add(new Skill("Sword of Fire", {
  level:2,
  icon:"sword-fire", 
  tooltip:"Attack with a flaming sword", 
  modifyOutgoingAttack:function(attack) {
    attack.element = "fire";
  },
}))

skills.add(new Skill("Ice Sword", {
  level:2,
  icon:"sword-ice", 
  tooltip:"Attack with a freezing blade",
  modifyOutgoingAttack:function(attack) {
    attack.element = "ice";
  },
}))
