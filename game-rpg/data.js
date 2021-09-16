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



createItem("knife", WEAPON("d4+2", "blade"), {
  loc:"me",
  image:"knife",
  examine:"An example of a poor weapon.",
  offensiveBonus:-2,
});

createItem("flail", WEAPON("2d10+4", "crush"), {
  loc:"me",
  image:"flail",
  examine:"An example of a good weapon.",
});

createItem("long_bow", LIMITED_AMMO_WEAPON("2d8", "bow", "arrow"), {
  loc:"me",
  examine:"An example of a bow.",
})

createItem("arrow", COUNTABLE({yard:14}), {
  examine:"A simple arrow.",
})


createItem("flaming_sword", WEAPON("3d6+2", "blade"), {
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
  east:new Exit('passage', {
    simpleUse:function(char) {
      log('here')
      if (w.practice_room.guarded && !w.orc.dead) {
        log('here')
        rpg.broadcast('guards', 'attack', 'practice room exit')
        return falsemsg("You try to head east, but the orc bars your way. Looks like he is going to attack!")
      }
      return util.defaultSimpleExitUse(char, this)
    }    
  }),
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

createRoom("passage", {
  desc:'A long passage.',
  west:new Exit('practice_room'),
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
  signalGroups:['guards'],
  afterAttack:function() { rpg.broadcast('guards', 'attack', this.name) },
  ex:"A rather small green humanoid; hairless and dressed in rags.",
})

createItem("orc", RPG_NPC(false), {
  loc:"practice_room",
  damage:"2d10+4",
  health:60,
  signalGroups:['guards'],
  ex:"A large green humanoid; hairless and dressed in leather.",
  signalResponses:{
    wake:function() {
      msg("He rolls over and goes back to sleep.")
    },
  },  
});

createItem("huge_shield", SHIELD(10), {
  loc:"orc",
});

createItem("snotling", RPG_NPC(false), {
  loc:"practice_room",
  damage:"2d4",
  health:20,
  signalGroups:['guards'],
  ex:"A cowering green humanoid; hairless and dressed in rags.",
});

createItem("rabbit", RPG_BEAST(false), {
  loc:"practice_room",
  damage:"2d4",
  health:20,
  ex:"{lore:An example of a monster you can talk to after casting the right spell, and is generally not hostile.:With Lore active, you can learn all about rabbit culture... they like carrots.}",
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
  signalGroups:['elementals'],
  ex:"A swirling mass of freezing air that chills you to the bone.",
})



createItem("phantasm_prototype", RPG_NPC(false), {
  damage:"1",
  element:'frost',
  health:1,
  unillusionable:true,
  unillusion:function(attack) {
    attack.msg("{nv:target:disappear:true}.", 1)
    if (this.clonePrototype) {
      delete w[this.name]
    }
    else {
      delete w[this.name].loc
    }
  },
})



createItem("zombie_prototype", RPG_CORPOREAL_UNDEAD(false), {
  alias:'zombie',
  damage:"2d4",
  health:20,
  signalGroups:['zombies'],
  ex:"A shambling corpse.",
})




createItem("pink_scroll", SCROLL("Fireball", false), {
  examine:'A scroll with a magical glyph on it.',
})

createItem("blue_scroll", SCROLL("Ice shard", true), {
  examine:'A scroll with a magical glyph on it.',
})

createItem("healing_potion", POTION("Healing"), {
  examine:'A sweet smelling concoction!',
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

createItem("shotgun", LIMITED_AMMO_WEAPON("2d10+4", 'firearm', 1), {
  loc:"practice_room",
  ammo:1,
  examine:"An example of a limited ammo weapon.",
  image:"flail",
});



createItem("Stone_of_Returning", TAKEABLE(), {
  loc:"yard",
});




new Effect("Flaming weapon", {
  modifyOutgoingAttack:function(attack, source) {
    if (!source.equipped) return
    attack.element = 'fire'
  },
})


new Effect("Frost vulnerability", {
  modifyIncomingAttack:function(attack) {
    if (attack.element) attack.damageMultiplier *= 2
  },
})

new Effect("Report for testing", {
  modifyOutgoingAttack:function(attack) {
    attack.element = 'fire'
  },
  modifyIncomingAttack:function(attack) {
    if (attack.element) attack.damageMultiplier *= 2
  },
})

new Effect("Defensive", {
  modifyIncomingAttack:function(attack) {
    attack.offensiveBonus -= 3
  },
  suppressFinishMsg:true,
})






new Skill("Double attack", {
  level:2,
  description:"Two attacks is better than one - though admittedky less accurate.",
  tactical:"Attack one foe twice, but at -2 to the attack roll",
  modifyOutgoingAttack:function(attack) {
    attack.offensiveBonus -= 2
    attack.attackNumber = 2
  },
})

new Skill("Sweeping attack", {
  level:1,
  description:"You attack you foe with a flourish that may do minor damage to the others who assail you.",
  tactical:"Attack one foe as normal. In addition, attack any other foe -2; on a success do 4 damage.", 
  getSecondaryTargets:rpg.getFoesBut,
  testUseable:function(char) {
    if (!char.equipped.weaponType === 'blade') return falsemsg("This skill is only useable with a bladed weapon.")
    return rpg.defaultSkillTestUseable(char)
  },
  modifyOutgoingAttack:function(attack) {
    if (options.secondary) {
      attack.damageNumber = 0
      attack.damageBonus = 4
    }
    attack.offensiveBonus -= 2
  },
})

new Skill("Defensive attack", {
  level:2,
  description:"Make a cautious attack, careful to maintain your defense, at the expense of your attack.",
  tactical:"Attack one foe with a -2 penalty, but any attacks on you will suffer a -3 penalty until your next turn.",
  testUseable:function(char) {
    if (char.getEquippedWeapon().weaponType === 'bow') return falsemsg("This skill is not useable with a bow.")
    return rpg.defaultSkillTestUseable(char)
  },
  modifyOutgoingAttack:function(attack) {
    attack.offensiveBonus -= 2
  },
  afterUse:function(attack, count) {
    const effect = rpg.findEffect('Defensive')
    effect.apply(attack, attack.attacker, 1)
    rpg.defaultSkillAfterUse(attack, count)
  }
})

