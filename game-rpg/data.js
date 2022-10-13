"use strict";





  
createItem("me", RPG_PLAYER(), {
  loc:"practice_room",
  regex:/^(me|myself|player)$/,
  health:100,
  mana:50,
  maxMana:50,
  //activeEffects:['Not attuned'],
  //activeEffects:['Spell cooldown'],
  spellCasting:5,
  offensiveBonus:3,
  level:3,
  skillsLearnt:["Attune to fire", "Fireball"],
  
  getSpellCooldownDelay:function(skill) {
    return 2 * skill.level - this.level
  },
  examine:function() {
    msg("A " + (this.isFemale ? "chick" : "guy") + " called " + this.alias);
  },
})



createItem("knife", WEAPON("d4+2"), {
  loc:"me",
  weaponClass:'Blade',
  image:"knife",
  examine:"An example of a poor weapon.",
  offensiveBonus:-2,
});

createItem("flail", WEAPON("2d10+4"), {
  loc:"me",
  image:"flail",
  examine:"An example of a good weapon.",
});

createItem("long_bow", LIMITED_AMMO_WEAPON("2d8", "arrow"), {
  loc:"me",
  weaponClass:'Bow',
  examine:"An example of a bow.",
})

createItem("arrow", COUNTABLE({yard:14}), {
  examine:"A simple arrow.",
})


createItem("flaming_sword", WEAPON("3d6+2"), {
  //loc:"me",
  image:"sword",
  examine:"An example of a magic weapon.",
  activeEffects:["Flaming weapon"],
});


createItem("ice_amulet", AMULET(), {
  loc:"me",
  examine:"An example of a wearable magic item; it stops ice/frost damage.",
  modifyIncomingAttack:function(attack) {
    if (this.worn && attack.element === 'frost') {
      attack.damageMultiplier = 0
      attack.primarySuccess = attack.primarySuccess.replace(/[.!]/, ", but the ice amulet protects {sb:target}, and {pv:target:take} no damage.")
    }
  },
})


/*

createItem("blue_ring", RING(), {
  loc:"me",
  worn:true,
  examine:"A fancy blue ring.",
})

createItem("red_ring", RING(), {
  loc:"me",
  worn:true,
  examine:"A fancy red ring.",
})

createItem("green_ring", RING(), {
  loc:"me",
  examine:"A fancy green ring.",
})
*/



createRoom("practice_room", {
  desc:'A large room with straw scattered across the floor. The only exit is west',
  apocDesc:'A large room with writhing worms all across the floor, and ichor dropping from the walls. The only exit is west',
  west:new Exit('great_hall'),
  east:new Exit('passage'),
  /*east:new Exit('passage', {
    simpleUse:function(char) {
      if (w.practice_room.guarded && !w.orc.dead) {
        rpg.broadcast('guards', 'attack', 'practice room exit')
        return falsemsg("You try to head east, but the orc bars your way. Looks like he is going to attack!")
      }
      return util.defaultSimpleExitUse(char, this)
    }    
  }),*/
  south:new Exit('cupboard', {
    lockedmsg:"It seems to be locked."
  }),
  exit_locked_south:true,
});




createRoom("great_hall", {
  desc:'An imposing - and rather cold - room with a high, vaulted roof{if:tapestry.scenery:, and an impressive tapestry hanging from the wall}.',
  east:new Exit('practice_room'),
  north:new Exit('yard'),
})

createItem("tapestry", TAKEABLE(), {
  examine:'A huge tapestry, taller than you, and wider than it is tall.',
  scenery:true,
  loc:'great_hall',
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

createItem("statue_hunter", {
  alias:'statue of a hunter',
  examine:'A marble statue of a naked man, casually holding a bow.',
  transform_stone_golem:function(o) {
    o.ex = 'A stone golem; it resembles a man, and is carrying a bow.'
  },
  //loc:"practice_room",
})

createItem("statue_lion", {
  alias:'statue of a lion',
  examine:'A marble statue of a lion rampant.',
  transform_stone_golem:function(o) {
    o.ex = 'A stone golem in the form of a lion.'
  },
  //loc:"yard",
})

createRoom("yard", {
  desc:'A large open area in front of the Great Hall, which is to the south. There is a lake to the north, and you can see an island in the lake.',
  yesWeather:true,
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
  yesWeather:true,
  south:new Exit('yard'),
})

createRoom("lake_swimming", {
  desc:'You are swimming in a lake! Dry land is to the south.',
  yesWeather:true,
  south:new Exit('yard'),
})




createItem("goblin", RPG_NPC(false), {
  loc:"practice_room",
  damage:"d4",
  health:40,
  signalGroups:['guards'],
  weapon:'goblin_dagger',
  ex:"A rather small green humanoid; hairless and dressed in rags.",
})

createItem("goblin_dagger", WEAPON('d8'), {
  examine:'A crude, but viscious knife.',
});


/*
createItem("goblin_shaman", RPG_NPC(true), {
  loc:"practice_room",
  health:40,
  defensiveBonus:2,
  skillOptions:['Ice shard', 'Fireball'],
  ex:"A rather small green humanoid; hairless and dressed in rags and bizarre bone-jewellery.",
})
*/

createItem("orc", RPG_NPC(false), {
  loc:"practice_room",
  damage:"2d6",
  health:60,
  signalGroups:['guards'],
  ex:"A large green humanoid; hairless and dressed in leather.",
  //weapon:'orc_sword',
  weapon:'broad_sword_prototype',
  shield:"wall_shield_prototype",
  offensiveBonus:1,
  offensiveBonus_weapon:4,
  signalResponses:{
    wake:function() {
      msg("He rolls over and goes back to sleep.")
    },
  },  
})


createItem("orc_sword", WEAPON('2d10+4'), {
  examine:'A crude, but hefty sword.',
});




createItem("snotling", RPG_NPC(false), {
  loc:"practice_room",
  damage:"2d4",
  health:20,
  signalGroups:['guards'],
  ex:"A cowering green humanoid; hairless and dressed in rags.",
})

createItem("rabbit", RPG_BEAST(false), {
  loc:"practice_room",
  damage:"2d4",
  health:20,
  ex:"{lore:An example of a monster you can talk to after casting the right spell, and is generally not hostile.:With Lore active, you can learn all about rabbit culture... they like carrots.}",
  allegiance:'friend',
  talk:function() {
    switch (this.talkto_count) {
      case 0 : 
        msg("You say 'Hello,' to the rabbit, 'how is it going?'");
        msg("The rabbit looks at you. 'Need carrots.' It looks plaintively at it round tummy. 'Fading away bunny!");
        break;
      default: msg("You wonder what you can talk to the rabbit about."); break;
    }
    return true
  },  
});






createItem("phantasm_prototype", RPG_PHANTOM(), {
  alias:"phantom",
  damage:"1",
  health:1,
  ex:'A scary, transparent image.',
})


//-------  SUMMONING SPELLS  -----------
// Affect inanimate items in the location



new SpellSummon(w.phantasm_prototype, 1, 6, {})





createItem("modern_zombie_prototype", RPG_CORPOREAL_UNDEAD(), {
  alias:'zombie',
  damage:"2d4",
  health:20,
  signalGroups:['zombies'],
  ex:"A shambling corpse.",
  stdExs:[
    "A very decayed shambling corpse, wearing the remains of a {random:Dead Pixies:Metallica:Sugababes} tee-shirt.",
    "A shambling corpse, missing an {random:eye:ear:arm}.",
  ],
  hospitalExs:[
    {name:'nurse', ex:"A shambling corpse in a nurse's uniform."},
    {name:'doctor', ex:"A slow-moving corpse in a lab coat."},
  ],
  mutate:function(options) {
    log(options)
    if (options.zone === 'hospital' && random.chance(50)) {
      log('here')
      const data = random.fromArray(this.hospitalExs)
      this.ex = processText(data.ex)
      this.setAlias('zombie ' + data.name)
    }
    else {
      this.ex = processText(random.fromArray(this.stdExs))
    }
  },
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
  examine:'The chest is wooden, banded in iron, and big enough to hold a shed-load of treasure.',
});

createItem("spellbook", SPELLBOOK(["Fireball", "Stoneskin", "Steelskin", "Lightning bolt", "Ice shard"]), {
  examineX:"An example of a spell book, obviously.",
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
  examine:'A pair of sturdy boots.',
  pronouns:lang.pronouns.plural,
});

createItem("shotgun", LIMITED_AMMO_WEAPON("2d10+4", 1), {
  loc:"practice_room",
  ammo:1,
  examine:"An example of a limited ammo weapon.",
  image:"flail",
});



createItem("Stone_of_Returning", TAKEABLE(), {
  loc:"yard",
  examine:'A flattish stone, somewhat bigger than your hand; very smooth and almost white.',
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






new WeaponAttack("Never mind the armour", {
  level:2,
  description:"Maximise your attacks against unarmoured foes.",
  tactical:"On a successful attack, do one additional damage roll, but on dice with three less sides",
  modifyOutgoingAttack:function(attack) {
    attack.damageNumber++
    attack.damageSides -= 3
  },
})

new WeaponAttack("Find the weak point", {
  level:2,
  description:"Maximise your attacks against armoured foes.",
  tactical:"On a successful attack, use dice with three more sides, but roll one less of them",
  modifyOutgoingAttack:function(attack) {
    attack.damageNumber--
    attack.damageSides += 3
  },
})

new WeaponAttack("Double attack", {
  level:2,
  description:"Two attacks is better than one - though admittedky less accurate.",
  tactical:"Attack one foe twice, but at -2 to the attack roll",
  modifyOutgoingAttack:function(attack) {
    attack.offensiveBonus -= 2
    attack.attackNumber = 2
  },
})

new WeaponAttack("Sweeping attack", {
  level:1,
  description:"You attack your foe with a flourish that may do minor damage to the others who assail you.",
  tactical:"Attack one foe as normal. In addition, attack any other foe -2; on a success do 4 damage.", 
  getSecondaryTargets:rpg.getFoesBut,
  testUseable:function(char) {
    if (!char.equipped.weaponType === 'blade') {
      if (char === player) msg("This skill is only useable with a bladed weapon.")
      return false
    }
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

new WeaponAttack("Defensive attack", {
  level:2,
  description:"Make a cautious attack, careful to maintain your defense, at the expense of your attack.",
  tactical:"Attack one foe with a -2 penalty, but any attacks on you will suffer a -3 penalty until your next turn.",
  testUseable:function(char) {
    const weapon = char.getEquippedWeapon()
    if (!weapon) {
      if (char === player) msg("This skill is not useable without an equipped weapon.")
      return false
    }

    if (weapon.weaponClass === 'Bow') {
      if (char === player) msg("This skill is not useable with a bow.")
      return false
    }

    if (weapon.weaponClass === 'Firearm') {
      if (char === player) msg("This skill is not useable with a firearm.")
      return false
    }

    return rpg.defaultSkillTestUseable(char)
  },
  modifyOutgoingAttack:function(attack) {
    attack.offensiveBonus -= 2
  },
  afterUse:function(attack, count) {
    const effect = rpg.findEffect('Defensive')
    effect.apply(attack.attacker, attack, 1)
    rpg.defaultSkillAfterUse(attack, count)
  }
})


