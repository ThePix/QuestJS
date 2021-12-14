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
  damage:"d8",
  health:40,
  signalGroups:['guards'],
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



const elementals = [
  {name:'frost', level:0, desc:"swirling mass of freezing air that chills you to the bone"},
  {name:'fire', level:2, desc:"burning ball of fire"},
  {name:'storm', level:1, desc:"sizzling whirlwind of crackling lightning"},
  {name:'earthmight', level:3, desc:"churning mass of rocks and earth"},
  {name:'shadow', level:1, desc:"ball of utter darkness"},
  {name:'rainbow', level:2, desc:"kaleidoscope of colours too painful to look at"},
]

for (const el of elementals) {
  createItem("lesser_" + el.name + "_elemental_prototype", RPG_ELEMENTAL(el.name), {
    alias:"lesser " + el.name + ' elemental',
    damage:"2d" + (4 + el.level),
    health:35 + 5 * el.level,
    signalGroups:['elementals'],
    ex:'A small ' + el.desc + '.',
  })
  createItem("greater_" + el.name + "_elemental_prototype", RPG_ELEMENTAL(el.name), {
    alias:"greater " + el.name + ' elemental',
    damage:"3d" + (6 + el.level),
    health:100 + 10 * el.level,
    signalGroups:['elementals'],
    ex:'A large ' + el.desc + '.',
  })
}


for (const el of elementals) {
  new SpellSummon(w['lesser_' + el.name + '_elemental_prototype'], { level:2 + el.level, duration:6, })
  new SpellSummon(w['greater_' + el.name + '_elemental_prototype'], { level:12 + el.level, duration:6, })
}


createItem("phantasm_prototype", RPG_PHANTOM(), {
  alias:"phantom",
  damage:"1",
  health:1,
})


//-------  SUMMONING SPELLS  -----------
// Affect inanimate items in the location



new SpellSummon(w.phantasm_prototype, { level:1, duration:6, })




/*
createItem("zombie_prototype", RPG_CORPOREAL_UNDEAD(), {
  alias:'zombie',
  damage:"2d4",
  health:20,
  signalGroups:['zombies'],
  ex:"A shambling corpse.",
})
*/



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

const imported = [
  createItem("slug_prototype", RPG_CORRUPTED(), {
    "name": "slug",
    "alias": "Giant slug",
    "desc": "At least fifteen foot of slimy slug.",
  }),          
  createItem("giant_rat_prototype", RPG_BEAST(), {
    "alias": "Giant rat",
    "level":1,
    "hitpoints":20,
    "defence":3,
    "armour":1,
    "damage":2,
    "noncorporeal": [],
    "movetype": "Constrained",
    "guarding": [],
    "image": "giant_rat",
    "desc": "This thing looks like a rat, only bigger. Much bigger.",
    "loredesc": "Giantism is a common way for those skilled in the art to create powerful guardians, and in many ways the rat is the idea starting point, being fierce, easy to feed and overly abundant.",
    "treasurechance":8,
  }),          
  createItem("gargoyle_prototype", RPG_CREATED(), {
    "alias": "Gargoyle",
    "desc": "A dire cross between a bat and a statue.",
    "treasurechance":0,
  }),          
  createItem("tentacled_horror_prototype", RPG_CORRUPTED(), {
    "alias": "Tentacled horror",
    "desc": "A writhing black mass of mouths and eyes.",
  }),          
  createItem("mudman_prototype", RPG_CREATED(), {
    "alias": "Mudman",
    "level":2,
    "damage":"2d6+1",
    "desc": "Composed of primordial mud, the mudman is a horrific caricature of a man. Dark holes for eyes, a gaping mawl, and no neck or nose. It looks tough to fight, but it is guarding the way north.",
    "element":"earthmight",
  }),          
  createItem("hydra_prototype", RPG_BEAST(), {
    "alias": "Hydra",
    "desc": "A semi-aquatic creature with numerous heads,",
    "loredesc": "A semi-aquatic creature with numerous heads, academics have suggested that it is related to the dragon, adapted for life in water. Some speculate that in fact it is a colony of creatures; each head is in fact a separate entity, but this theory so far remains unpopular with more respected scholars.",
  }),          
  createItem("rust_monster_prototype", RPG_BEAST(), {
    "armour":3,
    "attackdesc": "% bites at you",
    "level":8,
    "hitpoints":32,
    "alias": "Rust monster",
    "desc": "A beetle-like reptile, with two long tendrils extending from its mouth, and a spiky tail.",
    "defence":1,
    "treasurechance":5,
    "attackbonus":2,
    "damage":"3d8+2",
    "onweaponhit":"if (player.equipped.canberusted) {\n            msg (\"Your \" + player.equipped.alias + \" has been rusted by its contact with the creature. It will not be so effective from now on (but it is immune to further rusting).\")\n            player.equipped.canberusted = false\n            player.equipped.rusted = true\n            player.equipped.attackbonus = player.equipped.attackbonus - 2\n            player.equipped.damagebonus = player.equipped.damagebonus - 2\n            player.equipped.damagedicesides = player.equipped.damagedicesides - 2\n            player.equipped.alias = player.equipped.alias + \" (rusted)\"\n            UpdateStatus\n          }",
  }),          
  createItem("amorphous_blob_prototype", RPG_PLANT(), {
    "alias": "Amorphous blob",
    "level":7,
    "canberusted":false,
    "nocorpse": [],
    "desc": "The blob is a grey-green colour, and every now and again is vaguely man-shaped, but seems unable to keep any shape for long.",
    "attackdesc": "% lunges at you with a pseudopod",
    "attackbonus":3,
    "damage":"3d8",
    "hitpoints":40,
    "treasurechance":0,
    "ondeath":"msg (\"The blob slumps to the ground, split in to three by your attack, dead at last...\")\n          msg (\"Wait... The bits are starting to twitch. As you watch, each of the three parts rises up, a new, albeit smaller, amorphous blob.\")\n          for (i, 1, 3) {\n            o = CloneObjectAndMove(amorphous_blob_2, this.parent)\n            do (o, \"settoattack\")\n          }",
  }),          
  createItem("amorphous_blob_2_prototype", RPG_PLANT(), {
    "alias": "Amorphous blob",
    "level":3,
    "attackonsight": [],
    "canberusted":false,
    "nocorpse": [],
    "desc": "The smaller blob is a grey-green colour, and every now and again is vaguely man-shaped, but seems unable to keep any shape for long.",
    "attackdesc": "% lunges at you with a pseudopod",
    "attackbonus":3,
    "damage":"2d6",
    "treasurechance":0,
    "ondeath":"msg (\"The smaller blob slumps to the ground.\")\n          msg (\"Then the bits start to twitch. As you watch, each of the parts rises up, a new, even smaller, amorphous blob.\")\n          for (i, 1, GetRandomInt(2, 4)) {\n            o = CloneObjectAndMove(amorphous_blob_3, this.parent)\n            do (o, \"settoattack\")\n          }",
  }),          
  createItem("amorphous_blob_3_prototype", RPG_PLANT(), {
    "alias": "Amorphous blob",
    "level":1,
    "attackonsight": [],
    "canberusted":false,
    "nocorpse": [],
    "desc": "The small blob is a grey-green colour, and every now and again is vaguely man-shaped, but seems unable to keep any shape for long.",
    "attackdesc": "% lunges at you with a pseudopod",
    "hitpoints":1,
    "treasurechance":0,
    "attackbonus":3,
    "death": "The remains of the blob seep away through cracks in the floor.",
    "ondeath":"msg (\"The blob slumps to the ground, split in two by your attack, dead at last...\")\n          msg (\"Wait... The bits are starting to twitch. As you watch, each of the three parts rises up, a new, albeit smaller, amorphous blob.\")\n          for (i, 1, 3) {\n            o = CloneObjectAndMove(amorphous_blob_2, this.parent)\n            do (o, \"settoattack\")\n          }",
  }),          
  createItem("adherer_prototype", RPG_CORRUPTED(), {
    "armour":2,
    "attackdesc": "% bites at you",
    "level":4,
    "hitpoints":24,
    "nonweapon": [],
    "alias": "Weird mummy creature",
    "desc": "This creature looks kind of like a mummy, but it seems to have various things stuck to it; you can see a dagger and some kind of club. It has the slow, shambling gait of a mummy, but somehow you feel it is not undead.",
    "lookwhendead": "There is just a pile of bandages and junk.",
    "damage":"2d8+1",
    "attackonsight": [],
    "onweaponhit":"if (not player.equipped = fists) {\n            msg (\"Your \" + player.equipped.alias + \" has stuck fast to the creature!\")\n            player.equipped.parent = this\n            player.equipped.inventoryverbs = Split (\"Look at;Drop;Equip;Sell\", \";\")\n            player.equipped = fists\n            UpdateStatus\n            this.alias = \"Adherer\"\n          }",
  }),          
  createItem("mimic_prototype", RPG_PLANT(), {
    "nonweapon": [],
    "alias": "Chest",
    "look": "This battered chest has a lock, but it looks crude.",
    "attackdesc": "% bites at you",
    "death": "The mimic now looks like a surrealist take on the subject of chests.",
    "attackbonus":2,
    "damage":"3+6",
    "hitpoints":14,
    "level":3,
  }),          
  createItem("mushroomman_prototype", RPG_PLANT(), {
    "alias": "Mushroomman",
    "desc": "A weirldly humanoid mushroom, according to that guy in the Greedy Goblin, they explode when killed.",
    "level":1,
    "damage":"d6",
    "attackonsight":false,
    "nocorpse": [],
    "ondeath": "if (DoesInherit(player.currectattack, \"spell\") or DoesInherit(player.currectattack, \"scroll\")) {\n            msg (\"The mushroom man's corpse explodes in a haze of spores. Just as well you were not right next to it.\")\n          }\n          else if (GetBoolean(player.currectattack, \"longreach\")) {\n            msg (\"The mushroomman's corpse explodes in a haze of spores. Just as well you finished it off with a weapon with long reach.\")\n          }\n          else {\n            msg (\"The mushroomman's corpse explodes in a haze of spores, leaving you coughing and spluttering. -6 hits.\")\n            game.pov.hitpoints = game.pov.hitpoints - 6\n          }"
  }),          
  createItem("dark_pixie_prototype", RPG_FEY(), {
    "alias": "Dark pixie",
    "desc": "While most pixies are wondrous and clever, dark pixies are annoying! They are less than a foot tall, and have wings not unlike that of a dragon fly. Cunning and elusive!",
    "poisonimmunity":true,
    "poisonimmunitymsg": "Poison has no effect on pixies, they are just too cool!",
    "reflectsmagic": [],
    "level":3,
    "defence":5,
    "attackasgroup": []
  }),          
  createItem("shambling_mound_prototype", RPG_CORPOREAL_UNDEAD(), {
    "alias": "Shambling Mound",
    "desc": "Humanoid, flesh-eating vegetation!",
    "absorbsmagic": [],
    "level":1,
    "hitpoints":24,
    "attackonsight": []
  }),          
  createItem("dire_hag_prototype", RPG_CORRUPTED(), {
    "desc": "At first glance the hag resembles an old woman, but the reality is this creature is considerably tougher than that.",
    "death": "In the death, the Dire Hag looks like a sad old woman.",
    "level":5,
    "hitpoints":24,
    "defence":3,
    "alias": "Dire hag",
    "attackonsight": [],
    "ondeath": "if (HasString(this, \"oldroomdesc\")) {\n            this.parent.description = this.oldroomdesc\n          }\n          foreach (ex, ScopeExitsForRoom(this.parent)) {\n            ex.visible = true\n          }\n          msg (\"As the Dire Hag dies, the lava-filled cavern shimmers before you eyes, and a moment later you are back in the chamber you first encountered the creature - if you ever left it?\")",
  }),          
  createItem("iron_cobra_prototype", RPG_CONSTRUCT(), {
    "alias": "Iron cobra",
    "desc": "A huge, mechanical snake, constructed of articulated segments.",
    "attackonsight": [],
    "hitpoints":50,
    "armour":4,
    "level":10,
  }),          
  createItem("lich_prototype", RPG_CORPOREAL_UNDEAD(), {
    "name": "lich",
    "desc": "A malicious wizard who has tried to cheat death, the lich resembles a bonelord, but retains his evil powers,",
    "alias": "Lich",
    "level":15,
    "hitpoints":80,
    "defence":4,
    "armour":2,
    "attackonsight": [],
  }),          
  createItem("electric_skeleton_prototype", RPG_CORPOREAL_UNDEAD(), {
    "desc": "A skeleton, with electricity sparking off it.",
    "alias": "Electric skeleton",
    "level":8,
    "hitpoints":30,
    "defence":2,
    "armour":2,
    "attackonsight": [],
    "attackdesc": "% lunges at you",
  }),          
  createItem("fire_zombie_prototype", RPG_CORPOREAL_UNDEAD(), {
    "desc": "A zombie, burning, but not consumed in the fire.",
    "alias": "Fire zombie",
    "level":5,
    "hitpoints":25,
    "defence":1,
    "armour":0,
    "attackonsight": [],
    "attackdesc": "% swings a burning hard at you",
  }),
]


const monsters = [
    {
        name:"ghost",
        desc:"Floating a little above the ground, the insubstantial ghost regards you with its one good eye.",
        instances: [
            {
                "desc": "The spirit of someone who has died in unfortunate circumstances.",
                "name": "minor apparition"
            },
            {
                "desc": "The spirit of someone who has died in unfortunate circumstances.",
                "name": "apparition"
            },
            {
                "desc": "The spirit of someone who has died in unfortunate circumstances.",
                "name": "spook"
            },
            {
                "desc": "The spirit of someone who has died in unfortunate circumstances.",
                "name": "ghost"
            },
            {
                "desc": "The spirit of someone guilty of dark crimes.",
                "name": "spectre"
            },
            {
                "desc": "The spirit of someone guilty of dark crimes.",
                "name": "dire spectre"
            },
            {
                "desc": "The spirit of someone guilty of particularly dark crimes.",
                "name": "shade"
            },
            {
                "desc": "The spirit of someone guilty of particularly dark crimes, whose laments chill the soul.",
                "name": "banshee"
            },
            {
                "desc": "The spirit of one who has fallen in battle, but is kept tied to this world by his or her own hate and need for vengeance against all living things.",
                "name": "revenant"
            },
            {
                "desc": "The spirit of one who has fallen in battle, but is kept tied to this world by his or her own hate and need for vengeance against all living things.",
                "name": "dark stalker"
            },
            {
                "desc": "The spirit of someone guilty of particularly dark crimes, whose laments chill the soul.",
                "name": "greater banshee"
            },
            {
                "desc": "The spirit of someone corrupted to evil by dark magicks.",
                "name": "wraith"
            },
            {
                "desc": "The spirit of a powerful leader who has fallen in battle, but is kept tied to this world by his or her own hate and need for vengeance against all living things.",
                "name": "revenant lord"
            },
            {
                "desc": "The spirit of someone corrupted to evil by dark magicks.",
                "name": "blood wraith"
            },
            {
                "desc": "The spirit of a powerful leader corrupted to evil by dark magicks.",
                "name": "wraith lord"
            }
        ],
        specialAttacks: [
            {
                "name": "ghost_attack",
                "canberusted":false,
                "attackdesc": "The % lunges at you"
            },
            {
                "name": "wraith_attack",
                "canberusted":false,
                "attackdesc": "The % tries to drain your intelligence",
                "mustmatch": "wraith"
            },
            {
                "name": "banshee shriek",
                "canberusted":false,
                "attackdesc": "The % emits an ear-spliting shriek",
                "mustmatch": "banshee",
                "onsuccessfulattack": {
                    "type": "script",
                    "text": "msg (\"The % has drained your mind!\")\n            player.magiccurse = player.magiccurse + 2\n            player.magicbonus = player.magicbonus - 2"
                }
            }
        ],
        treasureChance: 0,
        template:RPG_NON_CORPOREAL_UNDEAD(),
    },
    {
        name:"zombie",
        desc:"The bodies of the recently dead are easily transformed into zombies by those skilled in the necrotic arts.",
        template:RPG_CORPOREAL_UNDEAD(),
        instances:[
            {
                "desc": "The bodies of the recently dead are easily transformed into animated corpses by those skilled in the necrotic arts.",
                "name": "animated corpse"
            },
            {
                "desc": "The bodies of the recently dead are easily transformed into zombies by those skilled in the necrotic arts.",
                "name": "zombie"
            },
            {
                "desc": "The bodies of the recently dead are easily transformed into zombies by those skilled in the necrotic arts.",
                "name": "dire zombie"
            },
            {
                "desc": "A skeleton animated by necromancer.",
                "name": "decipit skeleton"
            },
            {
                "desc": "A skeleton animated by necromancer.",
                "name": "skeleton"
            },
            {
                "desc": "A zombie that has broken free of its controller, and survives by eating the dead.",
                "name": "ghoul"
            },
            {
                "desc": "In ancient times, priests would try to preserve the body of the deceased by embalming. Such corpses are highly prized by necromancers who can animate them for their own evil deeds.",
                "name": "mummy"
            },
            {
                "desc": "The corpse of one who has fallen in battle, animated and corrupted.",
                "name": "wight"
            },
            {
                "desc": "In ancient times, priests would try to preserve the body of the deceased by embalming. Such corpses are highly prized by necromancers who can animate them for their own evil deeds.",
                "name": "greater mummy"
            },
            {
                "desc": "A skeleton animated by necromancer, using superior enchantments to create this fearsome warrior.",
                "name": "skeletal warrior"
            },
            {
                "desc": "The corpse of a powerful leader who has fallen in battle, animated and corrupted.",
                "name": "wight king"
            },
            {
                "desc": "A zombie that has broken free of its controller, and survives by eating the dead.",
                "name": "ghast"
            },
            {
                "desc": "Like a mummy, the necrotic warrior has been animated from a mummified corpse, but the enchantments are rather more powerful.",
                "name": "necrotic warrior"
            },
            {
                "desc": "A malicious wizard who has tried to cheat death, the bonelord is now little more than a skeleton animated by evil in some disturbing armour.",
                "name": "bonelord"
            },
            {
                "desc": "A malicious wizard who has tried to cheat death, the bonelord is now little more than a skeleton animated by evil in some disturbing armour.",
                "name": "greater bonelord"
            }
        ]
    },
    {
        name:"kobold",
        template:RPG_NPC(),
        instances:[
            {
                "desc": "Smallest of the goblinoids, the snotling is nevertheless dangerous when encountered in numbers.",
                "name": "snotling"
            },
            {
                "desc": "The kobold is a skulking humanoid, who would only come up to your shoulder if he stood up straight. Its skin is green and scaled, and it is dressed in ragged clothes. Its teeth look sharp, his eyes cruel.",
                "name": "kobold"
            },
            {
                "desc": "A cruel creature, the goblin will bully those weaker than itself, and cower from those stronger.",
                "name": "goblin"
            },
            {
                "desc": "A cruel creature, the goblin will bully those weaker than itself, and cower from those stronger. The dire goblin is the larger, more unpleasant type.",
                "name": "dire goblin"
            },
            {
                "desc": "A little bigger than a goblin, but rather less intelligent, gnolls seem to spend their lives rooting through rubbish.",
                "name": "gnoll"
            },
            {
                "desc": "A little bigger than a goblin, but rather less intelligent, gnolls seem to spend their lives rooting through rubbish.",
                "name": "dire gnoll"
            },
            {
                "desc": "A bigger version of the goblin, less cowardly more cruel.",
                "name": "hobgoblin"
            },
            {
                "desc": "Orcs are like goblins but bigger; cruel and cowardly, but more dangerous to be around.",
                "name": "orc"
            },
            {
                "desc": "Orcs are like goblins but bigger; cruel and cowardly, but more dangerous to be around.",
                "name": "greater orc"
            },
            {
                "desc": "Larger than orcs, bugbears have thick fur hides.",
                "name": "bugbear"
            },
            {
                "desc": "Larger than orcs, bugbears have thick fur hides.",
                "name": "greater bugbear"
            },
            {
                "desc": "Orcs are like goblins but bigger; cruel and cowardly, but more dangerous to be around.",
                "name": "blood orc"
            },
            {
                "desc": "Largest of the goblinoids, the ogre is possibly also the dumbest.",
                "name": "ogre"
            },
            {
                "desc": "Largest of the goblinoids, the ogre is possibly also the dumbest.",
                "name": "blood ogre"
            },
            {
                "desc": "Largest of the goblinoids, the ogre is possibly also the dumbest.",
                "name": "ogre monarch"
            }
        ]
    },
    {
        name:"kobold_shaman",
        template:RPG_NPC(),
        instances:[
            {
                "desc": "Smallest of the goblinoids, the snotling is nevertheless dangerous when encountered in numbers.",
                "name": "snotling shaman"
            },
            {
                "desc": "The kobold is a skulking humanoid, who would only come up to your shoulder if he stood up straight. Its skin is green and scaled, and it is dressed in ragged clothes. Its teeth look sharp, his eyes cruel.",
                "name": "kobold diremage"
            },
            {
                "desc": "A cruel creature, the goblin will bully those weaker han itself, and cower from those stronger.",
                "name": "goblin shaman"
            },
            {
                "desc": "A cruel creature, the goblin will bully those weaker han itself, and cower from those stronger. The dire goblin is the larger, more unpleasant type.",
                "name": "dire goblin shaman"
            },
            {
                "desc": "A little bigger than a goblin, but rather less intelligent, gnolls seem to spend their lives rooting through rubbish.",
                "name": "gnoll bloodmage"
            },
            {
                "desc": "A little bigger than a goblin, but rather less intelligent, gnolls seem to spend their lives rooting through rubbish.",
                "name": "dire gnoll bloodmage"
            },
            {
                "desc": "A bigger version of the goblin, less cowardly more cruel.",
                "name": "hobgoblin warlord"
            },
            {
                "desc": "Orcs are like goblins but bigger; cruel and cowardly, but more dangerous to be around.",
                "name": "orc shaman"
            },
            {
                "desc": "Orcs are like goblins but bigger; cruel and cowardly, but more dangerous to be around.",
                "name": "greater orc shaman"
            },
            {
                "desc": "Larger than orcs, bugbears have thick fur hides.",
                "name": "bugbear obeah"
            },
            {
                "desc": "Larger than orcs, bugbears have thick fur hides.",
                "name": "greater bugbear obeah"
            },
            {
                "desc": "Orcs are like goblins but bigger; cruel and cowardly, but more dangerous to be around.",
                "name": "blood orc shaman"
            },
            {
                "desc": "Largest of the goblinoids, the ogre is possibly also the dumbest.",
                "name": "ogre magi"
            },
            {
                "desc": "Largest of the goblinoids, the ogre is possibly also the dumbest.",
                "name": "blood ogre magi"
            },
            {
                "desc": "Largest of the goblinoids, the ogre is possibly also the dumbest.",
                "name": "ogre monarch magi"
            }
        ],
        specialAttacks:[
            {
                "name": "kobold_shaman_ice_blast",
                "attackdesc": "The % casts <i>Ice blast</i> at you",
                "damagedicenumber": {
                    "type": "int",
                    "text": "3"
                },
                "nonweapon": [],
                "alias": "Ice blast",
                "element": {
                    "type": "object",
                    "text": "frost"
                }
            },
            {
                "name": "kobold_shaman_lightning",
                "attackdesc": "The % casts <i>Lightning bolt</i> at you",
                "damagedicesides": {
                    "type": "int",
                    "text": "14"
                },
                "nonweapon": [],
                "alias": "Lightning bolt",
                "element": {
                    "type": "object",
                    "text": "storm"
                }
            },
            {
                "name": "kobold_shaman_staff",
                "attackdesc": "The % swings his staff at you",
                "damagedicesides": {
                    "type": "int",
                    "text": "6"
                },
                "alias": "Staff"
            },
            {
                "name": "kobold_shaman_weaken",
                "damagedicesides": {
                    "type": "int",
                    "text": "14"
                },
                "nonweapon": [],
                "alias": "Weaken",
                "destroyonsale": [],
                "level": {
                    "type": "int",
                    "text": "5"
                },
                "attackplayer": {
                    "type": "script",
                    "text": "// Only targets player!\n            player.damagebonus = player.damagebonus - 5\n            this.parent.resetattribute = \"damagebonus\"\n            this.parent.resetbonus = 5\n            this.parent = dead\n            msg (CapFirst(GetDisplayAlias (this.parent)) + \" casts <i>Weaken</i> at you; you will do 5  less damage.with every weapon attack.\")"
                }
            }
        ],
        treasureChance:20,
    },
    /*
        name:"elemental_archetype",
        desc:"A swirling mass of %element%.",
        instances:[
            {
                "desc": "Floating, swirling elemental %element%, a little larger than your head.",
                "name": "elemental guardian"
            },
            {
                "desc": "A swirling mass of %element%.",
                "name": "lesser elemental"
            },
            {
                "desc": "A dog-like being full of elemental fury.",
                "name": "elemental hound"
            },
            {
                "desc": "A large swirling mass of %element%.",
                "name": "greater elemental"
            },
            {
                "desc": "A bull-like being full of elemental fury.",
                "name": "elemental bull"
            },
            {
                "desc": "A large swirling mass of %element%.",
                "name": "elemental tumult"
            },
            {
                "desc": "A large swirling mass of %element%.",
                "name": "elemental maelstrom"
            },
            {
                "desc": "A large, vaglue humanoid swirling mass of %element%.",
                "name": "elemental daemon"
            },
            {
                "desc": "A large, vaglue humanoid swirling mass of %element%.",
                "name": "elemental archon"
            }
        ]
    },*/
    {
        name:"fiend",
        template:RPG_DEMON(),
        instances:[
            {
                "desc": "A small humanoid, the imp has grey skin, pointed eyes and no hair at all. It stares at you with cruel, cat-like eyes.",
                "name": "imp"
            },
            {
                "desc": "A small humanoid, the blood imp has red skin, pointed eyes and no hair at all.",
                "name": "blood imp"
            },
            {
                "desc": "A humanoid with leathery wings, and small horns on its head, the fiend is not quite as tall as you.",
                "name": "fiend"
            },
            {
                "desc": "A humanoid with leathery wings, and small horns on its head, the pit fiend is about your size.",
                "name": "pit fiend"
            },
            {
                "desc": "A humanoid with leathery wings, small horns on its head and blood red skin, the pit fiend is about your size.",
                "name": "dire fiend"
            },
            {
                "desc": "A pair of leathery wings sprout from the back of the devil, and ram's horns from its head.",
                "name": "devil"
            },
            {
                "desc": "A pair of leathery wings sprout from the back of the devil, and ram's horns from its head.",
                "name": "greater devil"
            },
            {
                "desc": "The horns of a bull, the face of a snarling mutt; the demon is muscled and large.",
                "name": "demon"
            },
            {
                "desc": "The horns of a bull, the face of a snarling mutt; the demon is muscled and large.",
                "name": "greater demon"
            },
            {
                "desc": "The horns of a bull, the face of a snarling mutt; the demon is muscled and large.",
                "name": "rage demon"
            },
            {
                "desc": "The cacodemon towers over you, a body rippling with might and spikes.",
                "name": "cacodemon"
            },
            {
                "desc": "The horns of a bull, the face of a snarling mutt and skin red as blood; this demon is muscled and large",
                "name": "blood demon"
            },
            {
                "desc": "The legs of a goat, the wings and talons of a dragon, this fearsome creature regards you with obvious contempt.",
                "name": "archdemon"
            },
            {
                "desc": "The legs of a goat, the wings and talons of a dragon, this fearsome creature grins as it contemplates your doom.",
                "name": "demon prince"
            },
            {
                "desc": "The legs of a goat, the wings and talons of a dragon, this is the most fearsome of all the demons.",
                "name": "demon lord"
            }
        ],
        specialAttacks:[
            {
                "name": "fiend_fire_blast",
                "attackdesc": "The % casts <i>Fire Storm</i> at you",
                "damagedicenumber": {
                    "type": "int",
                    "text": "3"
                },
                "nonweapon": [],
                "alias": "Fire blast",
                "element": {
                    "type": "object",
                    "text": "frost"
                }
            },
            {
                "name": "fiend_lightning",
                "attackdesc": "The % casts <i>Lightning Storm</i> at you",
                "damagedicesides": {
                    "type": "int",
                    "text": "14"
                },
                "nonweapon": [],
                "alias": "Lightning bolt",
                "element": {
                    "type": "object",
                    "text": "storm"
                }
            },
            {
                "name": "fiend_claw",
                "attackdesc": "The % lunges at you with its claws",
                "damagedicesides": {
                    "type": "int",
                    "text": "6"
                },
                "alias": "Claw"
            },
            {
                "name": "fiend_befuddle",
                "damagedicesides": {
                    "type": "int",
                    "text": "14"
                },
                "nonweapon": [],
                "alias": "Befuddle",
                "destroyonsale": [],
                "level": {
                    "type": "int",
                    "text": "5"
                },
                "attackplayer": {
                    "type": "script",
                    "text": "// Only targets player!\n            player.damagebonus = player.magicbonus - 2\n            this.parent.resetattribute = \"magicbonus\"\n            this.parent.resetbonus = 2\n            this.parent = dead\n            msg (CapFirst(GetDisplayAlias (this.parent)) + \" casts <i>Befuddle</i> at you; your intelligence drops by 2.\")"
                }
            }
        ],
        treasureChance:20,
    },
    {
        name:"horror",
        template:RPG_CORRUPTED(),
        instances:[
            {
                "desc": "A mottled worm-like creature, with three sickly-white tentacles emerging from its mouth.",
                "name": "maloeg grub"
            },
            {
                "desc": "A fleshy mass of eyes, mouths and tentacles.",
                "name": "grim shambler"
            },
            {
                "desc": "The creeping fright is like a giant centipede with tentacles.",
                "name": "creeping fright"
            },
            {
                "desc": "A shadowy creature of almost there tentacles.",
                "name": "spawn of hab yogsoth"
            },
            {
                "desc": "A slender body, held up on loing thin tentacles that flick arounmd it, its round, toothed mouth is pointed at you.",
                "name": "dire creeper"
            },
            {
                "desc": "A bulbous quadruped, this sickly-white creature's head has tentacles where you might have expected a face.",
                "name": "night horror"
            },
            {
                "desc": "This fat, white worm is covered in eyes and tentacles.",
                "name": "chaos worm"
            },
            {
                "desc": "A mouth full of vicious, surrounded by tentacles.",
                "name": "abysmal horror"
            },
            {
                "desc": "A dark red writhing mass of tentacles.",
                "name": "maloeg"
            },
            {
                "desc": "A dark red, almost black writhing mass of tentacles.",
                "name": "greater maloeg"
            },
            {
                "desc": "This vaguely humanoid creature has a mouth in its stomach, filled with sharp, needle-like teeth, and a skull-like face dwarfed by its huge head. Its arms end in wriggling tentacles.",
                "name": "loathsome fright"
            },
            {
                "desc": "A humanoid bat, with tentacles rounds its foul mouth.",
                "name": "night grim"
            },
            {
                "desc": "A huge, dark red, almost black writhing mass of tentacles.",
                "name": "archmaloeg"
            },
            {
                "desc": "You can see this humanoid bat, with tentacles rounds its foul mouth.",
                "name": "ethereal horror"
            },
            {
                "desc": "Floating above the ground, the ascended maloeg is a writhing mass of blood red tentacles beneath a huge grey brain.",
                "name": "ascended maloeg"
            }
        ],
        specialAttacks:[
            {
                "name": "horror_death_blast",
                "attackdesc": "The % blasts you with necrotic might",
                "damagedicenumber": {
                    "type": "int",
                    "text": "3"
                },
                "nonweapon": [],
                "alias": "Death blast",
                "element": {
                    "type": "object",
                    "text": "necrotic"
                }
            },
            {
                "name": "horror_lightning",
                "attackdesc": "The % blasts you with lightning",
                "damagedicesides": {
                    "type": "int",
                    "text": "14"
                },
                "nonweapon": [],
                "alias": "Lightning bolt",
                "element": {
                    "type": "object",
                    "text": "storm"
                }
            },
            {
                "name": "horror_tentacle",
                "attackdesc": "The % whips a foul tentacle",
                "damagedicesides": {
                    "type": "int",
                    "text": "6"
                },
                "alias": "Tentacle"
            }
        ],
        treasureChance:0,
    },
    {
        name:"construct_archetype",
        template:RPG_CONSTRUCT(),
        instances:[
            {
                "desc": "Unlike the usual scarecrow, this one has eyes of fire. And it moves.",
                "name": "scarecrow"
            },
            {
                "desc": "Bigger than the scarecrows you are familiar with, this one has eyes of fire. And it moves.",
                "name": "large scarecrow"
            },
            {
                "desc": "A more fearsome version of the standard animated scarecrow, this has a pumpkin for its head.",
                "name": "pumpkinhead"
            },
            {
                "desc": "A simple automaton, not as big as you, and rather slow.",
                "name": "lesser automaton"
            },
            {
                "desc": "A simple automaton, a little bigger than you, and rather slow.",
                "name": "greater automaton"
            },
            {
                "desc": "A basic automaton, a little bigger than you, and rather slow, with glowing red eyes.",
                "name": "warden"
            },
            {
                "desc": "A somewhat advanced automaton, rather bigger than you, and rather slow, with glowing red eyes.",
                "name": "construct"
            },
            {
                "desc": "A somewhat advanced automaton, rather bigger than you, and rather slow, with glowing red eyes and scary weaponry.",
                "name": "greater construct"
            },
            {
                "desc": "An advanced automaton, rather bigger than you, and not so slow, with glowing red eyes.",
                "name": "advanced construct"
            },
            {
                "desc": "A sophisticated brass automaton, with glowing red eyes.",
                "name": "brass man"
            },
            {
                "desc": "A sophisticated brass automaton, with glowing red eyes, designed for warfare.",
                "name": "brass soldier"
            },
            {
                "desc": "A sophisticated iron automaton, with glowing red eyes, designed for warfare.",
                "name": "iron golem"
            },
            {
                "desc": "A sophisticated bronze automaton, with glowing red eyes, designed for warfare.",
                "name": "bronze sentinel"
            },
            {
                "desc": "A sophisticated steel automaton, with glowing red eyes, designed for warfare.",
                "name": "steel sentinel"
            },
            {
                "desc": "A huge, steel automaton, with glowing red eyes, designed for warfare.",
                "name": "colossus"
            }
        ]
    },
    {
        name:"dragon",
        template:RPG_BEAST(),
        instances:[
            {
                "desc": "A large snake with intelligent eyes.",
                "name": "serpent"
            },
            {
                "desc": "A large snake with intelligent eyes, and a vicious temperament.",
                "name": "vicious serpent"
            },
            {
                "desc": "A fat, snake-like creature.",
                "name": "cave wyrm"
            },
            {
                "desc": "A large, snake-like creature with a row of spines down its back.",
                "name": "greater wyrm"
            },
            {
                "desc": "A winged reptile, with a rooster-like head.",
                "name": "cockatrice"
            },
            {
                "desc": "A huge snake with intelligent eyes, and a vicious temperament",
                "name": "great serpent"
            },
            {
                "desc": "This huge snake has a crest on its head.",
                "name": "basilisk"
            },
            {
                "desc": "A winged reptile, with viscous claws and teeth, the drake is the smallest member of the dragon family.",
                "name": "lesser drake"
            },
            {
                "desc": "A winged reptile, with viscous claws and teeth, the drake is the smallest member of the dragon family.",
                "name": "greater drake"
            },
            {
                "desc": "A winged reptile, with viscous claws and teeth, the wyvern is somewhat bigger than the more common drake.",
                "name": "young wyvern"
            },
            {
                "desc": "A winged reptile, with viscous claws and teeth, the wyvern is somewhat bigger than the more common drake.",
                "name": "mature wyvern"
            },
            {
                "desc": "This may be a young dragon, but it is still a powerful creature, with a tough hide, nasty teath and a bad temperament.",
                "name": "young dragon"
            },
            {
                "desc": "A winged reptile, with viscous claws and teeth, the wyvern is somewhat bigger than the more common drake. This is an ancient one; it only got to be this old by being tougher than the rest.",
                "name": "ancient wyvern"
            },
            {
                "desc": "This dragon is a powerful creature, with a tough hide, nasty teeth and a bad temperament. Maturity has not improved it!",
                "name": "mature dragon"
            },
            {
                "desc": "Oldest of the dragon, it is also the biggest and the toughest.",
                "name": "ancient dragon"
            }
        ],
        specialAttacks:[
            {
                "name": "dragon_bite",
                "attackdesc": "The % bites at you",
                "damagedicesides": {
                    "type": "int",
                    "text": "6"
                },
                "alias": "Bite",
                "damagedicenumber": {
                    "type": "int",
                    "text": "2"
                },
                "nonweapon": [],
                "canberusted": {
                    "type": "boolean",
                    "text": "false"
                }
            },
            {
                "name": "dragon_claw",
                "attackdesc": "The % lunges at you with its claws",
                "damagedicesides": {
                    "type": "int",
                    "text": "6"
                },
                "alias": "Claw",
                "attackbonus": {
                    "type": "int",
                    "text": "2"
                },
                "canberusted":false,
                "nonweapon": [],
                "level": {
                    "type": "int",
                    "text": "4"
                }
            },
            {
                "name": "dragon_breath",
                "attackdesc": "A jet of fire shoots from the %'s mouth",
                "damagedicesides": {
                    "type": "int",
                    "text": "4"
                },
                "alias": "Dragon breath",
                "damagedicenumber": {
                    "type": "int",
                    "text": "4"
                },
                "canberusted":false,
                "nonweapon": [],
                "level": {
                    "type": "int",
                    "text": "10"
                },
                "element": {
                    "type": "object",
                    "text": "fire"
                }
            }
        ]
    }
]


for (const el of monsters) {
  
  for (let i = 0; i < el.instances.length; i++) {
    const name = el.instances[i].name.replace(/ /g, '_') + "_prototype"
    //log(name)
    createItem(name, el.template, {
      name:el.instances[i].name,
      alias:sentenceCase(el.instances[i].name),
      desc:el.instances[i].desc,
      element:el.element,
      level:i,
    })
  }
  
  
}