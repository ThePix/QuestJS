"use strict"

/*

This file is optional
It adds some basic monsters suitable for a standard fantasy game
There are:
20 special monsters
8 groups of levelled monsters, 15 monsters in each
10 elementals for each of 10 elements

It was converted from the Quest 5 game, Deeper

*/

// attackdesc
// simple monsters with weapons
// ideally can disarm and make them far less dangerous



// Twenty unusual creatures, imported from Deeper
  createItem("slug_prototype", RPG_CORRUPTED(), {
    alias: "giant slug",
    ex: "At least fifteen foot of slimy slug.",
  })
  createItem("giant_rat_prototype", RPG_BEAST(), {
    alias: "giant rat",
    level:1,
    health:20,
    defensiveBonus:3,
    armour:1,
    damage:2,
    ex: "This thing looks like a rat, only bigger. Much bigger.{lore: Giantism is a common way for those skilled in the art to create powerful guardians, and in many ways the rat is the idea starting point, being fierce, easy to feed and overly abundant.}",
    treasureChance:8,
  })
  createItem("gargoyle_prototype", RPG_CREATED(), {
    alias: "gargoyle",
    ex: "A dire cross between a bat and a statue.",
    treasureChance:0,
  })
  createItem("tentacled_horror_prototype", RPG_CORRUPTED(), {
    alias: "tentacled horror",
    ex: "A writhing black mass of mouths and eyes.",
  })
  createItem("mudman_prototype", RPG_CREATED(), {
    alias: "mudman",
    level:2,
    damage:"2d6+1",
    ex: "Composed of primordial mud, the mudman is a horrific caricature of a man. Dark holes for eyes, a gaping mawl, and no neck or nose. It looks tough to fight, but it is guarding the way north.",
    "element":"earthmight",
  })
  createItem("hydra_prototype", RPG_BEAST(), {
    alias: "hydra",
    ex: "A semi-aquatic creature with numerous heads.{lore: A semi-aquatic creature with numerous heads, academics have suggested that it is related to the dragon, adapted for life in water. Some speculate that in fact it is a colony of creatures; each head is in fact a separate entity, but this theory so far remains unpopular with more respected scholars.}",
  })
  createItem("rust_monster_prototype", RPG_BEAST(), {
    armour:3,
    msgAttack: "{nv:attacker:bite:true} at {nm:target:the}",
    level:8,
    health:32,
    alias: "rust monster",
    ex: "A beetle-like reptile, with two long tendrils extending from its mouth, and a spiky tail.",
    defensiveBonus:1,
    treasureChance:5,
    offensiveBonus:2,
    damage:"3d8+2",
    "onweaponhit":"if (player.equipped.canberusted) {\n            msg (\"Your \" + player.equipped.alias + \" has been rusted by its contact with the creature. It will not be so effective from now on (but it is immune to further rusting).\")\n            player.equipped.canberusted = false\n            player.equipped.rusted = true\n            player.equipped.attackbonus = player.equipped.attackbonus - 2\n            player.equipped.damagebonus = player.equipped.damagebonus - 2\n            player.equipped.damagedicesides = player.equipped.damagedicesides - 2\n            player.equipped.alias = player.equipped.alias + \" (rusted)\"\n            UpdateStatus\n          }",
  })
  createItem("amorphous_blob_prototype", RPG_PLANT(), {
    alias: "amorphous blob",
    level:7,
    "canberusted":false,
    noCorpse:true,
    ex: "The blob is a grey-green colour, and every now and again is vaguely man-shaped, but seems unable to keep any shape for long.",
    msgAttack: "{nv:attacker:lunge:true} at {nm:target:the} with a pseudopod",
    offensiveBonus:3,
    damage:"3d8",
    health:40,
    treasureChance:0,
    afterDeath:function(attack) {
      msg ("The blob slumps to the ground, split in to three by your attack, dead at last...")
      msg ("Wait... The bits are starting to twitch. As you watch, each of the three parts rises up, a new, albeit smaller, amorphous blob.")
      spawn(amorphous_blob_2, this.loc, {count:3, target:attack.attacker})
    },
  })
  createItem("amorphous_blob_2_prototype", RPG_PLANT(), {
    alias: "amorphous blob",
    level:3,
    "canberusted":false,
    noCorpse:true,
    ex: "The smaller blob is a grey-green colour, and every now and again is vaguely man-shaped, but seems unable to keep any shape for long.",
    msgAttack: "{nv:attacker:lunge:true} at {nm:target:the} with a pseudopod",
    offensiveBonus:3,
    damage:"2d6",
    treasureChance:0,
    afterDeath:function(attack) { 
      msg ("The smaller blob slumps to the ground.")
      msg ("Then the bits start to twitch. As you watch, each of the parts rises up, a new, even smaller, amorphous blob.")
      spawn(amorphous_blob_3, this.loc, {count:random.int(2,4), target:attack.attacker})
    },
  })
  createItem("amorphous_blob_3_prototype", RPG_PLANT(), {
    alias: "amorphous blob",
    level:1,
    "canberusted":false,
    noCorpse:true,
    ex: "The small blob is a grey-green colour, and every now and again is vaguely man-shaped, but seems unable to keep any shape for long.",
    msgAttack: "{nv:attacker:lunge:true} at {nm:target:the} with a pseudopod",
    health:1,
    treasureChance:0,
    offensiveBonus:3,
    msgDeath: "The remains of the blob seep away through cracks in the floor.",
    afterDeath:function() {
      msg ("The blob slumps to the ground, split in two by your attack, dead at last...")
    },
  })
  createItem("adherer_prototype", RPG_CORRUPTED(), {
    armour:2,
    msgAttack: "{nv:attacker:bite:true} at {nm:target:the}",
    level:4,
    health:24,
    "nonweapon": [],
    alias: "weird mummy creature",
    ex: "This creature looks kind of like a mummy, but it seems to have various things stuck to it; you can see a dagger and some kind of club. It has the slow, shambling gait of a mummy, but somehow you feel it is not undead.",
    "lookwhendead": "There is just a pile of bandages and junk.",
    damage:"2d8+1",
    "onweaponhit":"if (not player.equipped = fists) {\n            msg (\"Your \" + player.equipped.alias + \" has stuck fast to the creature!\")\n            player.equipped.parent = this\n            player.equipped.inventoryverbs = Split (\"Look at;Drop;Equip;Sell\", \";\")\n            player.equipped = fists\n            UpdateStatus\n            this.alias = \"Adherer\"\n          }",
  })
  createItem("mimic_prototype", RPG_PLANT(), {
    "nonweapon": [],
    alias: "chest",
    ex: "This battered chest has a lock, but it looks crude.",
    msgAttack: "{nv:attacker:bite:true} at {nm:target:the}",
    msgDeath: "The mimic now looks like a surrealist take on the subject of chests.",
    offensiveBonus:2,
    damage:"3+6",
    health:14,
    level:3,
  })
  createItem("mushroomman_prototype", RPG_PLANT(), {
    alias: "mushroomman",
    ex: "A weirldly humanoid mushroom, according to that guy in the Greedy Goblin, they explode when killed.",
    level:1,
    damage:"d6",
    "attackonsight":false,
    noCorpse:true,
    afterDeath:function(attack) {  
      if (attack.skill.noWeapon) {
        msg("The mushroom man's corpse explodes in a haze of spores. Just as well you were not right next to it.")
      }
      else if (attack.weapon.longReach) {
        msg("The mushroomman's corpse explodes in a haze of spores. Just as well you finished it off with a weapon with long reach.")
      }
      else {
        msg("The mushroomman's corpse explodes in a haze of spores, leaving you coughing and spluttering. -6 hits.")
        player.health -= 6
      }
    },
  })
  createItem("dark_pixie_prototype", RPG_FEY(), {
    alias: "dark pixie",
    ex: "While most pixies are wondrous and clever, dark pixies are annoying! They are less than a foot tall, and have wings not unlike that of a dragon fly. Cunning and elusive!",
    "poisonimmunity":true,
    "poisonimmunitymsg": "Poison has no effect on pixies, they are just too cool!",
    "reflectsmagic": [],
    level:3,
    defensiveBonus:5,
    "attackasgroup": []
  })
  createItem("shambling_mound_prototype", RPG_CORPOREAL_UNDEAD(), {
    alias: "shambling mound",
    ex: "Humanoid, flesh-eating vegetation!",
    "absorbsmagic": [],
    level:1,
    health:24,
    "attackonsight": []
  })
  createItem("dire_hag_prototype", RPG_CORRUPTED(), {
    ex: "At first glance the hag resembles an old woman, but the reality is this creature is considerably tougher than that.",
    msgDeath: "In the death, the Dire Hag looks like a sad old woman.",
    level:5,
    health:24,
    defensiveBonus:3,
    alias: "dire hag",
    afterDeath:function() {
      // TODO!!!
      if (this.oldroomdesc) {
        w[this.loc].description = this.oldroomdesc
      }
      //for (ex, ScopeExitsForRoom(this.parent)) {
      //  ex.visible = true
      //}
      msg("As the Dire Hag dies, the lava-filled cavern shimmers before you eyes, and a moment later you are back in the chamber you first encountered the creature - if you ever left it?")
    },
  })
  createItem("iron_cobra_prototype", RPG_CONSTRUCT(), {
    alias: "iron cobra",
    ex: "A huge, mechanical snake, constructed of articulated segments.",
    health:50,
    armour:4,
    level:10,
  })
  createItem("lich_prototype", RPG_CORPOREAL_UNDEAD(), {
    ex: "A malicious wizard who has tried to cheat death, the lich resembles a bonelord, but retains his evil powers,",
    alias: "lich",
    level:15,
    health:80,
    defensiveBonus:4,
    armour:2,
  })
  createItem("electric_skeleton_prototype", RPG_CORPOREAL_UNDEAD(), {
    ex: "A skeleton, with electricity sparking off it.",
    alias: "electric skeleton",
    level:8,
    health:30,
    defensiveBonus:2,
    armour:2,
    msgAttack: "{nv:attacker:lunge:true} at {nm:target:the}",
  })
  createItem("fire_zombie_prototype", RPG_CORPOREAL_UNDEAD(), {
    ex: "A zombie, burning, but not consumed in the fire.",
    alias: "fire zombie",
    level:5,
    health:25,
    defensiveBonus:1,
    armour:0,
    msgAttack: "{nv:attacker:swing:true} a burning hard at {nm:target:the}",
  })
//]
log("Added 20 special monsters")


rpg.monsters = [
  {
    name:"ghost",
    desc:"Floating a little above the ground, the insubstantial ghost regards you with its one good eye.",
    health:0.6,
    treasureChance: 0,
    template:RPG_NON_CORPOREAL_UNDEAD(),
    instances: [
      { name:"minor apparition", ex:"The spirit of someone who has died in unfortunate circumstances."},
      { name:"apparition", ex:"The spirit of someone who has died in unfortunate circumstances."},
      { name:"spook", ex:"The spirit of someone who has died in unfortunate circumstances."},
      { name:"ghost", ex:"The spirit of someone who has died in unfortunate circumstances."},
      { name:"spectre", ex:"The spirit of someone guilty of dark crimes."},
      { name:"dire spectre", ex:"The spirit of someone guilty of dark crimes."},
      { name:"shade", ex:"The spirit of someone guilty of particularly dark crimes."},
      { name:"banshee", ex:"The spirit of someone guilty of particularly dark crimes, whose laments chill the soul."},
      { name:"revenant", ex:"The spirit of one who has fallen in battle, but is kept tied to this world by his or her own hate and need for vengeance against all living things."},
      { name:"dark stalker", ex:"The spirit of one who has fallen in battle, but is kept tied to this world by his or her own hate and need for vengeance against all living things."},
      { name:"greater banshee", ex:"The spirit of someone guilty of particularly dark crimes, whose laments chill the soul."},
      { name:"wraith", ex:"The spirit of someone corrupted to evil by dark magicks."},
      { name:"revenant lord", ex:"The spirit of a powerful leader who has fallen in battle, but is kept tied to this world by his or her own hate and need for vengeance against all living things."},
      { name:"blood wraith", ex:"The spirit of someone corrupted to evil by dark magicks."},
      { name:"wraith lord", ex:"The spirit of a powerful leader corrupted to evil by dark magicks."},
    ],
    specialAttacks: [
      {
        name: "ghost_attack",
        "canberusted":false,
        msgAttack: "The % lunges at you"
      },
      {
        name: "wraith_attack",
        "canberusted":false,
        msgAttack: "The % tries to drain your intelligence",
        "mustmatch": "wraith"
      },
      {
        name: "banshee shriek",
        "canberusted":false,
        msgAttack: "The % emits an ear-spliting shriek",
        "mustmatch": "banshee",
        "onsuccessfulattack": {
          "type": "script",
          "text": "msg (\"The % has drained your mind!\")\n      player.magiccurse = player.magiccurse + 2\n      player.magicbonus = player.magicbonus - 2"
        }
      }
    ],
  },
  {
    name:"zombie",
    desc:"The bodies of the recently dead are easily transformed into zombies by those skilled in the necrotic arts.",
    template:RPG_CORPOREAL_UNDEAD(),
    health:1,
    instances:[
      { name:"animated corpse", ex:"The bodies of the recently dead are easily transformed into animated corpses by those skilled in the necrotic arts."},
      { name:"zombie", ex:"The bodies of the recently dead are easily transformed into zombies by those skilled in the necrotic arts."},
      { name:"dire zombie", ex:"The bodies of the recently dead are easily transformed into zombies by those skilled in the necrotic arts."},
      { name:"decrepit skeleton", ex:"A skeleton animated by necromancer."},
      { name:"skeleton", ex:"A skeleton animated by necromancer."},
      { name:"ghoul", ex:"A zombie that has broken free of its controller, and survives by eating the dead."},
      { name:"mummy", ex:"In ancient times, priests would try to preserve the body of the deceased by embalming. Such corpses are highly prized by necromancers who can animate them for their own evil deeds."},
      { name:"wight", ex:"The corpse of one who has fallen in battle, animated and corrupted."},
      { name:"greater mummy", ex:"In ancient times, priests would try to preserve the body of the deceased by embalming. Such corpses are highly prized by necromancers who can animate them for their own evil deeds."},
      { name:"skeletal warrior", ex:"A skeleton animated by necromancer, using superior enchantments to create this fearsome warrior."},
      { name:"wight king", ex:"The corpse of a powerful leader who has fallen in battle, animated and corrupted."},
      { name:"ghast", ex:"A zombie that has broken free of its controller, and survives by eating the dead."},
      { name:"necrotic warrior", ex:"Like a mummy, the necrotic warrior has been animated from a mummified corpse, but the enchantments are rather more powerful."},
      { name:"bonelord", ex:"A malicious wizard who has tried to cheat death, the bonelord is now little more than a skeleton animated by evil in some disturbing armour."},
      { name:"greater bonelord", ex:"A malicious wizard who has tried to cheat death, the bonelord is now little more than a skeleton animated by evil in some disturbing armour."},
    ]
  },
  
  
  
  {
    name:"goblinoid",
    template:RPG_NPC(),
    health:1,
    instances:[
      { name:"snotling", ex:"Smallest of the goblinoids, the snotling is nevertheless dangerous when encountered in numbers."},
      { name:"kobold", ex:"The kobold is a skulking humanoid, who would only come up to your shoulder if he stood up straight. Its skin is green and scaled, and it is dressed in ragged clothes. Its teeth look sharp, his eyes cruel."},
      { name:"goblin", ex:"A cruel creature, the goblin will bully those weaker than itself, and cower from those stronger."},
      { name:"dire goblin", ex:"A cruel creature, the goblin will bully those weaker than itself, and cower from those stronger. The dire goblin is the larger, more unpleasant type."},
      { name:"gnoll", ex:"A little bigger than a goblin, but rather less intelligent, gnolls seem to spend their lives rooting through rubbish."},
      { name:"dire gnoll", ex:"A little bigger than a goblin, but rather less intelligent, gnolls seem to spend their lives rooting through rubbish."},
      { name:"hobgoblin", ex:"A bigger version of the goblin, less cowardly more cruel."},
      { name:"orc", ex:"Orcs are like goblins but bigger; cruel and cowardly, but more dangerous to be around."},
      { name:"greater orc", ex:"Orcs are like goblins but bigger; cruel and cowardly, but more dangerous to be around."},
      { name:"bugbear", ex:"Larger than orcs, bugbears have thick fur hides."},
      { name:"greater bugbear", ex:"Larger than orcs, bugbears have thick fur hides."},
      { name:"blood orc", ex:"Orcs are like goblins but bigger; cruel and cowardly, but more dangerous to be around."},
      { name:"ogre", ex:"Largest of the goblinoids, the ogre is possibly also the dumbest."},
      { name:"blood ogre", ex:"Largest of the goblinoids, the ogre is possibly also the dumbest."},
      { name:"ogre monarch", ex:"Largest of the goblinoids, the ogre is possibly also the dumbest."},
    ]
  },
  
  {
    name:"goblinoid_shaman",
    template:RPG_NPC(),
    health:0.75,
    signalGroups:['goblinoid'],
    treasureChance:20,
    instances:[
      { name:"snotling shaman", ex:"Smallest of the goblinoids, the snotling is nevertheless dangerous when encountered in numbers."},
      { name:"kobold diremage", ex:"The kobold is a skulking humanoid, who would only come up to your shoulder if he stood up straight. Its skin is green and scaled, and it is dressed in ragged clothes. Its teeth look sharp, his eyes cruel."},
      { name:"goblin shaman", ex:"A cruel creature, the goblin will bully those weaker han itself, and cower from those stronger."},
      { name:"dire goblin shaman", ex:"A cruel creature, the goblin will bully those weaker han itself, and cower from those stronger. The dire goblin is the larger, more unpleasant type."},
      { name:"gnoll bloodmage", ex:"A little bigger than a goblin, but rather less intelligent, gnolls seem to spend their lives rooting through rubbish."},
      { name:"dire gnoll bloodmage", ex:"A little bigger than a goblin, but rather less intelligent, gnolls seem to spend their lives rooting through rubbish."},
      { name:"hobgoblin warlord", ex:"A bigger version of the goblin, less cowardly more cruel."},
      { name:"orc shaman", ex:"Orcs are like goblins but bigger; cruel and cowardly, but more dangerous to be around."},
      { name:"greater orc shaman", ex:"Orcs are like goblins but bigger; cruel and cowardly, but more dangerous to be around."},
      { name:"bugbear obeah", ex:"Larger than orcs, bugbears have thick fur hides."},
      { name:"greater bugbear obeah", ex:"Larger than orcs, bugbears have thick fur hides."},
      { name:"blood orc shaman", ex:"Orcs are like goblins but bigger; cruel and cowardly, but more dangerous to be around."},
      { name:"ogre magi", ex:"Largest of the goblinoids, the ogre is possibly also the dumbest."},
      { name:"blood ogre magi", ex:"Largest of the goblinoids, the ogre is possibly also the dumbest."},
      { name:"ogre monarch magi", ex:"Largest of the goblinoids, the ogre is possibly also the dumbest."},
    ],
    specialAttacks:[
      {
        name: "goblinoid_shaman_ice_blast",
        msgAttack: "The % casts <i>Ice blast</i> at you",
        "damagedicenumber":3,
        "nonweapon": [],
        alias: "Ice blast",
        "element": {
          "type": "object",
          "text": "frost"
        }
      },
      {
        name: "goblinoid_shaman_lightning",
        msgAttack: "The % casts <i>Lightning bolt</i> at you",
        "damagedicesides":14,
        "nonweapon": [],
        alias: "Lightning bolt",
        "element": {
          "type": "object",
          "text": "storm"
        }
      },
      {
        name: "goblinoid_shaman_staff",
        msgAttack: "The % swings his staff at you",
        "damagedicesides":6,
        alias: "Staff"
      },
      {
        name: "goblinoid_shaman_weaken",
        "damagedicesides":14,
        "nonweapon": [],
        alias: "Weaken",
        "destroyonsale": [],
        level:5,
        "attackplayer": {
          "type": "script",
          "text": "// Only targets player!\n      player.damagebonus = player.damagebonus - 5\n      this.parent.resetattribute = \"damagebonus\"\n      this.parent.resetbonus = 5\n      this.parent = dead\n      msg (CapFirst(GetDisplayAlias (this.parent)) + \" casts <i>Weaken</i> at you; you will do 5  less damage.with every weapon attack.\")"
        }
      }
    ],
  },
  
  
  
  
  {
    name:"fiend",
    template:RPG_DEMON(),
    health:2.5,
    treasureChance:20,
    instances:[
      { name:"imp", ex:"A small humanoid, the imp has grey skin, pointed eyes and no hair at all. It stares at you with cruel, cat-like eyes."},
      { name:"blood imp", ex:"A small humanoid, the blood imp has red skin, pointed eyes and no hair at all."},
      { name:"fiend", ex:"A humanoid with leathery wings, and small horns on its head, the fiend is not quite as tall as you."},
      { name:"pit fiend", ex:"A humanoid with leathery wings, and small horns on its head, the pit fiend is about your size."},
      { name:"dire fiend", ex:"A humanoid with leathery wings, small horns on its head and blood red skin, the pit fiend is about your size."},
      { name:"devil", ex:"A pair of leathery wings sprout from the back of the devil, and ram's horns from its head."},
      { name:"greater devil", ex:"A pair of leathery wings sprout from the back of the devil, and ram's horns from its head."},
      { name:"demon", ex:"The horns of a bull, the face of a snarling mutt; the demon is muscled and large."},
      { name:"greater demon", ex:"The horns of a bull, the face of a snarling mutt; the demon is muscled and large."},
      { name:"rage demon", ex:"The horns of a bull, the face of a snarling mutt; the demon is muscled and large."},
      { name:"cacodemon", ex:"The cacodemon towers over you, a body rippling with might and spikes."},
      { name:"blood demon", ex:"The horns of a bull, the face of a snarling mutt and skin red as blood; this demon is muscled and large"},
      { name:"archdemon", ex:"The legs of a goat, the wings and talons of a dragon, this fearsome creature regards you with obvious contempt."},
      { name:"demon prince", ex:"The legs of a goat, the wings and talons of a dragon, this fearsome creature grins as it contemplates your doom."},
      { name:"demon lord", ex:"The legs of a goat, the wings and talons of a dragon, this is the most fearsome of all the demons."},
    ],
    specialAttacks:[
      {
        name: "fiend_fire_blast",
        msgAttack: "The % casts <i>Fire Storm</i> at you",
        "damagedicenumber":3,
        "nonweapon": [],
        alias: "Fire blast",
        "element": {
          "type": "object",
          "text": "frost"
        }
      },
      {
        name: "fiend_lightning",
        msgAttack: "The % casts <i>Lightning Storm</i> at you",
        "damagedicesides":14,
        "nonweapon": [],
        alias: "Lightning bolt",
        "element": {
          "type": "object",
          "text": "storm"
        }
      },
      {
        name: "fiend_claw",
        msgAttack: "The % lunges at you with its claws",
        "damagedicesides":6,
        alias: "Claw"
      },
      {
        name: "fiend_befuddle",
        "damagedicesides":14,
        "nonweapon": [],
        alias: "Befuddle",
        "destroyonsale": [],
        level:5,
        "attackplayer": {
          "type": "script",
          "text": "// Only targets player!\n      player.damagebonus = player.magicbonus - 2\n      this.parent.resetattribute = \"magicbonus\"\n      this.parent.resetbonus = 2\n      this.parent = dead\n      msg (CapFirst(GetDisplayAlias (this.parent)) + \" casts <i>Befuddle</i> at you; your intelligence drops by 2.\")"
        }
      }
    ],
  },
  {
    name:"horror",
    template:RPG_CORRUPTED(),
    health:3,
    treasureChance:0,
    instances:[
      { name:"maloeg grub", ex:"A mottled worm-like creature, with three sickly-white tentacles emerging from its mouth."},
      { name:"grim shambler", ex:"A fleshy mass of eyes, mouths and tentacles."},
      { name:"creeping fright", ex:"The creeping fright is like a giant centipede with tentacles."},
      { name:"spawn of hab yogsoth", ex:"A shadowy creature of almost there tentacles."},
      { name:"dire creeper", ex:"A slender body, held up on loing thin tentacles that flick arounmd it, its round, toothed mouth is pointed at you."},
      { name:"night horror", ex:"A bulbous quadruped, this sickly-white creature's head has tentacles where you might have expected a face."},
      { name:"chaos worm", ex:"This fat, white worm is covered in eyes and tentacles."},
      { name:"abysmal horror", ex:"A mouth full of vicious, surrounded by tentacles."},
      { name:"maloeg", ex:"A dark red writhing mass of tentacles."},
      { name:"greater maloeg", ex:"A dark red, almost black writhing mass of tentacles."},
      { name:"loathsome fright", ex:"This vaguely humanoid creature has a mouth in its stomach, filled with sharp, needle-like teeth, and a skull-like face dwarfed by its huge head. Its arms end in wriggling tentacles."},
      { name:"night grim", ex:"A humanoid bat, with tentacles rounds its foul mouth."},
      { name:"archmaloeg", ex:"A huge, dark red, almost black writhing mass of tentacles."},
      { name:"ethereal horror", ex:"You can see this humanoid bat, with tentacles rounds its foul mouth."},
      { name:"ascended maloeg", ex:"Floating above the ground, the ascended maloeg is a writhing mass of blood red tentacles beneath a huge grey brain."},
    ],
    specialAttacks:[
      {
        name: "horror_death_blast",
        msgAttack: "The % blasts you with necrotic might",
        "damagedicenumber":3,
        "nonweapon": [],
        alias: "Death blast",
        "element": {
          "type": "object",
          "text": "necrotic"
        }
      },
      {
        name: "horror_lightning",
        msgAttack: "The % blasts you with lightning",
        "damagedicesides":14,
        "nonweapon": [],
        alias: "Lightning bolt",
        "element": {
          "type": "object",
          "text": "storm"
        }
      },
      {
        name: "horror_tentacle",
        msgAttack: "The % whips a foul tentacle",
        "damagedicesides":6,
        alias: "Tentacle"
      }
    ],
  },
  {
    name:"construct_archetype",
    template:RPG_CONSTRUCT(),
    health:4,
    instances:[
      { name:"scarecrow", ex:"Unlike the usual scarecrow, this one has eyes of fire. And it moves."},
      { name:"large scarecrow", ex:"Bigger than the scarecrows you are familiar with, this one has eyes of fire. And it moves."},
      { name:"pumpkinhead", ex:"A more fearsome version of the standard animated scarecrow, this has a pumpkin for its head."},
      { name:"lesser automaton", ex:"A simple automaton, not as big as you, and rather slow."},
      { name:"greater automaton", ex:"A simple automaton, a little bigger than you, and rather slow."},
      { name:"warden", ex:"A basic automaton, a little bigger than you, and rather slow, with glowing red eyes."},
      { name:"construct", ex:"A somewhat advanced automaton, rather bigger than you, and rather slow, with glowing red eyes."},
      { name:"greater construct", ex:"A somewhat advanced automaton, rather bigger than you, and rather slow, with glowing red eyes and scary weaponry."},
      { name:"advanced construct", ex:"An advanced automaton, rather bigger than you, and not so slow, with glowing red eyes."},
      { name:"brass man", ex:"A sophisticated brass automaton, with glowing red eyes."},
      { name:"brass soldier", ex:"A sophisticated brass automaton, with glowing red eyes, designed for warfare."},
      { name:"iron soldier", ex:"A sophisticated iron automaton, with glowing red eyes, designed for warfare."},
      { name:"bronze sentinel", ex:"A sophisticated bronze automaton, with glowing red eyes, designed for warfare."},
      { name:"steel sentinel", ex:"A sophisticated steel automaton, with glowing red eyes, designed for warfare."},
      { name:"colossus", ex:"A huge, steel automaton, with glowing red eyes, designed for warfare."},
    ]
  },
  {
    name:"golem_archetype",
    template:RPG_CONSTRUCT(),
    health:3,
    instances:[
      { name:"slime golem", ex:"A vaguely man-shaped blob of slime."},
      { name:"tar golem", ex:"A humanoid figure of blachest tar."},
      { name:"wood golem", ex:"Carved from a single piece of wood, man-shaped and animated."},
      { name:"stone golem", ex:"Sculpted from a single block of stone, man-shaped and animated."},
      { name:"iron golem", ex:"Forged as a single piece, this huge man-shaped creature is nevettheless quite flexible."},
      { name:"mithril golem", ex:"Slick and silver, this humanoid mirror moves with alarming speed."},
    ]
  },
  {
    name:"dinosaur",
    template:RPG_BEAST(),
    health:5,
    instances:[
      { name:"Microraptor", ex: "This small, bepedal dinosaur only comes up to your knee, but has sharp, vicious teeth. It has brightly coloured feathers on both its arms and legs.", },
      { name:"Orntholestes", ex: "This small, bepedal dinosaur is not much taller than your knees, but has sharp, vicious teeth. It has brightly coloured feathers on both its arms and tail.", },
      { name:"Borogovia", ex: "This small, bepedal dinosaur does not even come up to your waist, but has sharp, vicious teeth and an intelligent look to its eyes.", },
      { name:"Eoraptor", ex: "This small, bepedal dinosaur only comes up to your waist, but has sharp, vicious teeth.", },
      
      // has claw attack too
      { name:"Velociraptor", ex: "This bipedal dinosaur comes up to your chest. It has sharp, vicious teeth and equally nasty-looking claws. Brightly-coloured feathers adorn its arms.", },
      { name:"Coelophysis", ex: "This bipedal dinosaur comes up to your shoulders. It has sharp, vicious teeth and equally nasty-looking claws. It has a strange bulge on its snout.", },
      { name:"Utahraptor", ex: "This bipedal dinosaur is about your height, but considerably longer. It has sharp, vicious teeth and equally nasty-looking claws. Brightly-coloured feathers adorn its arms and tail.", },

      // fish-eating
      { name:"Suchomimus", ex: "This large, bipedal dinosaur stands taller than you, and is even longer. It has a long, narrow snout, full of teeth.", },
      { name:"Baryonyx", ex: "This large, bipedal dinosaur stands taller than you, and is even longer. It has a long, narrow snout, full of teeth.", },
      { name:"Spinosaurus", ex: "This tyrannosaur has a sail on its back, and a long, narrow snout.", },
      
      // the big ones
      { name:"Tarbosaurus", ex: "This tyrannosaur has a small horn-like ridge on its head.", },
      { name:"Ceratosaurus", ex: "This tyrannosaur has three small horn-like ridges on its head.", },
      { name:"Allosaurus", ex: "This tyrannosaur has two small horn-like ridges on its head, just above the eyes.", },
      { name:"Carnotaurus", ex: "This tyrannosaur has two small horns on its head, just above the eyes, and a relatively short snout.", },
      { name:"Tyrannosaurus", ex: "The biggest and fiercest of the tyrannosaurs!", },
    ]
  },
  {
    name:"dragon",
    template:RPG_BEAST(),
    health:3.5,
    instances:[
      { name:"serpent", ex:"A large snake with intelligent eyes."},
      { name:"vicious serpent", ex:"A large snake with intelligent eyes, and a vicious temperament."},
      { name:"cave wyrm", ex:"A fat, snake-like creature."},
      { name:"greater wyrm", ex:"A large, snake-like creature with a row of spines down its back."},
      { name:"cockatrice", ex:"A winged reptile, with a rooster-like head."},
      { name:"great serpent", ex:"A huge snake with intelligent eyes, and a vicious temperament"},
      { name:"basilisk", ex:"This huge snake has a crest on its head."},
      { name:"lesser drake", ex:"A winged reptile, with viscous claws and teeth, the drake is the smallest member of the dragon family."},
      { name:"greater drake", ex:"A winged reptile, with viscous claws and teeth, the drake is the smallest member of the dragon family."},
      { name:"young wyvern", ex:"A winged reptile, with viscous claws and teeth, the wyvern is somewhat bigger than the more common drake."},
      { name:"mature wyvern", ex:"A winged reptile, with viscous claws and teeth, the wyvern is somewhat bigger than the more common drake."},
      { name:"young dragon", ex:"This may be a young dragon, but it is still a powerful creature, with a tough hide, nasty teath and a bad temperament."},
      { name:"ancient wyvern", ex:"A winged reptile, with viscous claws and teeth, the wyvern is somewhat bigger than the more common drake. This is an ancient one; it only got to be this old by being tougher than the rest."},
      { name:"mature dragon", ex:"This dragon is a powerful creature, with a tough hide, nasty teeth and a bad temperament. Maturity has not improved it!"},
      { name:"ancient dragon", ex:"Oldest of the dragon, it is also the biggest and the toughest."},
    ],
    specialAttacks:[
      {
        name: "dragon_bite",
        msgAttack: "The % bites at you",
        "damagedicesides":6,
        alias: "Bite",
        "damagedicenumber":2,
        "nonweapon": [],
        "canberusted": {
          "type": "boolean",
          "text": "false"
        }
      },
      {
        name: "dragon_claw",
        msgAttack: "The % lunges at you with its claws",
        "damagedicesides":6,
        alias: "Claw",
        offensiveBonus:2,
        "canberusted":false,
        "nonweapon": [],
        level:4
      },
      {
        name: "dragon_breath",
        msgAttack: "A jet of fire shoots from the %'s mouth",
        "damagedicesides":4,
        alias: "Dragon breath",
        "damagedicenumber":4,
        "canberusted":false,
        "nonweapon": [],
        level:10,
        "element": {
          "type": "object",
          "text": "fire"
        }
      }
    ]
  }
]

rpg.elementals =  [
  { name:"elemental ball of %element%", ex:"Floating, swirling elemental %element%, a little smaller than your head."},
  { name:"elemental guardian of %element%", ex:"Floating, swirling elemental %element%, perhaps the size of a large child."},
  { name:"lesser %element% elemental", ex:"A swirling mass of %element%."},
  { name:"%element% hound", ex:"A dog-like being full of elemental fury."},
  { name:"greater %element% elemental", ex:"A large swirling mass of %element%."},
  { name:"%element% bull", ex:"A bull-like being full of elemental fury."},
  { name:"elemental tumult of %element%", ex:"A large swirling mass of %element%."},
  { name:"elemental maelstrom of %element%", ex:"A large swirling mass of %element%."},
  { name:"elemental %element% daemon", ex:"A large, vaglue humanoid swirling mass of %element%."},
  { name:"elemental archon of %element%", ex:"A large, vaguely-humanoid swirling mass of %element%."},
]


let count = 0
for (const el of rpg.monsters) {  
  for (let i = 0; i < el.instances.length; i++) {
    const name = el.instances[i].name.replace(/ /g, '_') + "_prototype"
    //log(name)
    createItem(name, el.template, {
      name:name,
      alias:el.instances[i].name,
      ex:el.instances[i].ex,
      element:el.element,
      level:i + 1,
      damage:"2d" + (4 + i),
      health:Math.floor((20 + 5 * i) * el.health),
      signalGroups:el.signalGroups ? el.signalGroups : [el,name],
    })
    count++
  }
}
log("Added " + count + " levelled monsters from " + rpg.monsters.length + " groups")


count = 0
for (const el of rpg.elements.list) {  
  for (let i = 0; i < rpg.elementals.length; i++) {
    const baseName = rpg.elementals[i].name.replace('%element%', el.name)
    const name = baseName.replace(/ /g, '_') + "_prototype"
    //log(name)
    createItem(name, RPG_ELEMENTAL(el.name), {
      alias:baseName,
      ex:rpg.elementals[i].ex.replace('%element%', el.name),
      element:el.name,
      level:Math.floor(i * 1.5 + 1),
      damage:"2d" + (4 + i),
      health:35 + 5 * i,
      signalGroups:['elementals'],
    })
    count++
  }
}
log("Added " + count + " elementals for " + rpg.elements.list.length + " elements")







function spawnLevelled(name, loc, level, options) {
  const group = rpg.monsters.find(el => el.name === name)
  log(group)
  let monsterName = group.instances[level - 1].name
  monsterName = monsterName.replace(/ /g, '_')
  spawn(monsterName, loc, options)
}

function spawnElemental(name, loc, level, options) {
  let monsterName = rpg.elementals[level - 1].name
  monsterName = monsterName.replace('%element%', name)
  monsterName = monsterName.replace(/ /g, '_')
  spawn(monsterName, loc, options)
}





for (const el of rpg.elements.list) {
  new SpellSummon(w['lesser_' + el.name + '_elemental_prototype'], 2 + el.level, 6, {})
  new SpellSummon(w['greater_' + el.name + '_elemental_prototype'], 12 + el.level, 6, {})
}



