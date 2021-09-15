"use strict";

test.resetOnCompletion = false


test.tests = function() {
  





  //player.skillsLearnt = ["Double attack", "Fireball",  "Commune with animal", "Unlock", "Stoneskin", "Steelskin", "Lightning bolt", "Ice shard", "Psi-blast"]
  //ioUpdateCustom()

  settings.attackOutputLevel = 2

  test.title("Elements");
  test.assertEqual("fire", elements.opposed('frost'))
  test.assertEqual("frost", elements.opposed('fire'))




  test.title("Equip")
  test.assertEqual('unarmed', player.getEquippedWeapon().alias)
  test.assertCmd("i", "You are carrying a flail, an ice amulet, a knife and a long bow.");
  test.assertCmd("equip knife", "You draw the knife.");
  test.assertCmd("i", "You are carrying a flail, an ice amulet, a knife (equipped) and a long bow.");
  test.assertEqual('knife', player.getEquippedWeapon().alias)
  test.assertCmd("equip knife", "It already is.");
  test.assertCmd("drop knife", "You drop the knife.");
  test.assertEqual('unarmed', player.getEquippedWeapon().alias)
  test.assertEqual(undefined, player.equipped)
  test.assertCmd("take knife", "You take the knife.");
  test.assertCmd("unequip knife", "It already is.");
  test.assertCmd("equip knife", "You draw the knife.");
  test.assertCmd("unequip knife", "You put away the knife.");
  

  test.title("Armour")
  settings.armourScaling = 1
  test.assertEqual(0, player.getArmour())
  test.assertCmd("get helmet", "You take the helmet.");
  test.assertEqual(0, player.getArmour())
  test.assertCmd("wear helmet", "You put on the helmet.");
  test.assertEqual(10, player.getArmour())
  test.assertCmd("get chestplate", "You take the chestplate.");
  test.assertEqual(10, player.getArmour())
  test.assertCmd("wear chestplate", "You put on the chestplate.");
  test.assertEqual(30, player.getArmour())
  settings.armourScaling = 10



  //TODO
  // Monster descriptions that include an injury note and optionally hits
  // Also lore and truesight, search
  // behavior - hostile, following, guarding, etc.

  // non-corporeal
  // death, afterDeath, corpseDescription
  
  // pickpocket



  test.title("Attack.createAttack (unarmed) misses");
  test.assertEqual(rpg.NEUTRAL, w.goblin.attitude)
  let attack = Attack.createAttack(player, w.goblin)
  test.assertEqual('me', attack.attacker.name)
  test.assertEqual([w.goblin], attack.primaryTargets)
  test.assertEqual('d4', attack.damage)
  test.assertEqual(1, attack.offensiveBonus)

  random.prime(3)
  attack.resolve(w.goblin, true, 0)
  test.assertEqual(40, w.goblin.health)
  test.assertEqual(rpg.BELLIGERENT_HOSTILE, w.goblin.attitude)

  



  test.title("Attack.createAttack (unarmed)");
  attack = Attack.createAttack(player, w.goblin)
  test.assertEqual('me', attack.attacker.name)
  test.assertEqual([w.goblin], attack.primaryTargets)
  test.assertEqual('d4', attack.damage)
  test.assertEqual(1, attack.offensiveBonus)

  random.prime([19, 4])
  attack.resolve(w.goblin, true, 0)
  test.assertEqual(36, w.goblin.health)

  w.goblin.armour = 2
  random.prime([19, 4])
  attack.resolve(w.goblin, true, 0)
  test.assertEqual(34, w.goblin.health)
  w.goblin.armour = 0
  w.goblin.health = 40
  


  test.title("Attack.createAttack (flail)")
  const oldProcessAttack = player.modifyOutgoingAttack
  player.modifyOutgoingAttack = function(attack) { attack.offensiveBonus += 2 }
  w.flail.equipped = true

  //settings.attackOutputLevel = 5
  attack = Attack.createAttack(player, w.orc)
  test.assertEqual('me', attack.attacker.name)
  test.assertEqual('2d10+4', attack.damage)
  test.assertEqual(5, attack.offensiveBonus)  // player has + 3 plus 2 from l107 above
  

  random.prime([19, 4, 7])
  attack.resolve(w.goblin, true, 0)
  test.assertEqual(25, w.goblin.health)

  w.goblin.armour = 2
  random.prime([19, 4, 7])
  attack.resolve(w.goblin, true, 0)
  test.assertEqual(14, w.goblin.health)
  w.goblin.armour = 0
  w.goblin.health = 40
  
  player.modifyOutgoingAttack = oldProcessAttack
  w.flail.equipped = false





  test.title("Attack.createAttack (flail, defensive)")
  w.flail.equipped = true

  attack = Attack.createAttack(player, w.goblin, rpg.findSkill("Defensive attack"))
  random.prime([19, 4, 7])
  attack.apply()
  test.assertEqual(25, w.goblin.health)
  test.assertEqual(['Defensive'], player.activeEffects)
  test.assertCmd("z", "Time passes...")
  test.assertEqual([], player.activeEffects)

  
  w.goblin.health = 40
  w.flail.equipped = false





  test.title("Attack.createAttack (bow, defensive)")
  w.long_bow.equipped = true
  const bowTmp = w.long_bow.activeEffects
  w.long_bow.activeEffects = []

  attack = Attack.createAttack(player, w.goblin, rpg.findSkill("Defensive attack"))
  test.assertEqual(false, attack)
  w.long_bow.equipped = false
  w.long_bow.activeEffects =  bowTmp


  test.title("Attack.createAttack (goblin)");
  attack = Attack.createAttack(w.goblin, player)
  test.assertEqual('goblin', attack.attacker.name)
  test.assertEqual([w.me], attack.primaryTargets)
  test.assertEqual('d8', attack.damage)
  test.assertEqual(0, attack.offensiveBonus)
  random.prime([19, 5])
  attack.resolve(w.me, true, 0)
  test.assertEqual(98, w.me.health)
  w.me.health = 100
  










  test.title("attack command, success");
  random.prime([19, 4, 7])
  w.flail.equipped = true

  test.assertCmd('attack goblin', ['You attack the goblin.', /A hit/, "The attack does 15 hits, the goblin's health is now 25."])
  test.assertEqual(25, w.goblin.health)

  w.goblin.health = 40
  w.flail.equipped = false



  test.title("attack command, fails");
  random.prime(4)
  w.flail.equipped = true

  test.assertCmd('attack goblin', ['You attack the goblin.', /A miss/])
  test.assertEqual(40, w.goblin.health)

  w.flail.equipped = false




  test.title("learn fireball")
  
  const spell = rpg.find('fireball')
  test.assertEqual(true, spell.spell)
  
  player.skillsLearnt = ["Double attack"]
  test.assertCmd('cast nonsense', ['There is no spell called nonsense.'])
  test.assertCmd('cast fireball', ['You do not know the spell <i>Fireball</i>.'])
  test.assertCmd('learn nonsense', ['There is no spell called nonsense.'])
  test.assertCmd('learn fireball', ['You do not have anything you can learn <i>Fireball</i> from.'])
  test.assertCmd('get spellbook', ['You take the spellbook.'])
  test.assertCmd('learn fireball', ['You learn <i>Fireball</i> from the spellbook.'])
  test.assertEqual(["Double attack", "Fireball"], player.skillsLearnt) 
  //goblin, orc, snotling, rabbit

  random.prime([19, 4, 4, 19, 2, 2, 4, 4])
  test.assertCmd('cast fireball', ['You cast the <i>Fireball</i> spell.', 'The room is momentarily filled with fire.', 'The goblin reels from the explosion.', "The attack does 8 hits, the goblin's health is now 32.", 'The orc reels from the explosion.', "The attack does 4 hits, the orc's health is now 56.", 'The snotling ignores it.', 'The rabbit ignores it.'])
  w.goblin.health = 40
  w.orc.health = 60





  test.title("learn Ice shard")
  test.assertCmd('learn ice shard', ['You learn <i>Ice shard</i> from the spellbook.'])
  player.skillsLearnt = ["Double attack", "Fireball", "Ice shard"]
  test.assertCmd('cast ice shard', ['You need a target for the spell <i>Ice shard</i>.'])
  test.assertCmd('drop spellbook', ['You drop the spellbook.'])
  random.prime([19, 4, 7, 9])
  test.assertCmd('cast Ice shard at goblin', ['You cast the <i>Ice shard</i> spell.', 'A shard of ice jumps from your finger to the goblin!', "The attack does 20 hits, the goblin's health is now 20."])
  w.goblin.health = 40




  test.title("Lightning bolt")
  player.skillsLearnt = ["Double attack", "Fireball", "Lightning bolt"]
  test.assertCmd('cast lightning bolt', ['You need a target for the spell <i>Lightning bolt</i>.'])
  random.prime([
    19, 4, 7, 9,

    // For the orc
    2,
   
    // For the snotling
    19, 4, 7,
  ])

  test.assertCmd('cast Lightning bolt at goblin', ['You cast the <i>Lightning bolt</i> spell.', 'A lightning bolt jumps from your out-reached hand to the goblin!', "The attack does 20 hits, the goblin's health is now 20.", 'A smaller bolt jumps your target, but entirely misses the orc!', 'A smaller bolt jumps your target to the snotling!', "The attack does 11 hits, the snotling's health is now 9."])
  w.goblin.health = 40
  w.snotling.health = 20
  
  random.prime(4)
  test.assertCmd('cast lightning bolt at goblin', ['You cast the <i>Lightning bolt</i> spell.', 'A lightning bolt jumps from your out-reached hand to the goblin, fizzling out before it can actually do anything.'])
  



  test.title("Attack.createAttack  (goblin, spells)")
  w.goblin.spellCasting = 3
  
  attack = Attack.createAttack(w.goblin, player, rpg.findSkill('Ice shard'))
  test.assertEqual('goblin', attack.attacker.name)
  test.assertEqual([w.me], attack.primaryTargets)
  test.assertEqual('3d6', attack.damage)
  test.assertEqual(3, attack.offensiveBonus)
  random.prime([19, 5, 5, 5])
  attack.resolve(w.me, true, 0)
  test.assertEqual(94, w.me.health)


  attack = Attack.createAttack(w.goblin, player, rpg.findSkill('Psi-blast'))
  test.assertEqual('goblin', attack.attacker.name)
  random.prime([19, 5, 5, 5])
  attack.resolve(w.me, true, 0)
  test.assertEqual(79, w.me.health)
  
  
  w.ice_amulet.worn = true
  attack = Attack.createAttack(w.goblin, player, rpg.findSkill('Ice shard'))
  random.prime(19)
  attack.resolve(w.me, true, 0)
  test.assertEqual(79, w.me.health)
  test.assertEqual("A shard of ice jumps from the goblin's finger to you, but the ice amulet protects you, and you take no damage.", attack.reportTexts[13].t)
  log(attack.reportTexts)
  
  w.me.health = 100
  w.goblin.spellCasting = false
  w.ice_amulet.worn = false
  



  test.title("learn ongoing spells")
  test.assertCmd('get spellbook', ['You take the spellbook.'])
  test.assertCmd('learn steelskin', ['You learn <i>Steelskin</i> from the spellbook.'])
  test.assertCmd('learn stoneskin', ['You learn <i>Stoneskin</i> from the spellbook.'])
  test.assertCmd('drop spellbook', ['You drop the spellbook.'])
  
  
  
  test.title("cast ongoing spells")
  test.assertEqual([], player.activeEffects)
  test.assertCmd('cast stoneskin', ['You cast the <i>Stoneskin</i> spell.', 'Your skin becomes as hard as stone - and yet still just as flexible.'])
  test.assertEqual(['Stoneskin'], player.activeEffects)
  test.assertCmd('cast steelskin', ['You cast the <i>Steelskin</i> spell.', 'Your skin becomes as hard as steel - and yet still just as flexible.', 'The <i>Stoneskin</i> effect on you expires.'])
  test.assertEqual(['Steelskin'], player.activeEffects)







  test.title("ongoing spells expire")
  player['countdown_Steelskin'] = 3
  test.assertCmd('z', ['Time passes...',])
  test.assertEqual(2, player['countdown_Steelskin'])
  test.assertCmd('z', ['Time passes...'])
  test.assertEqual(1, player['countdown_Steelskin'])
  test.assertCmd('z', ['Time passes...', 'The <i>Steelskin</i> effect on you expires.'])
  test.assertEqual(undefined, player['countdown_Steelskin'])
  test.assertEqual([], player.activeEffects)
  test.assertCmd('z', ['Time passes...'])
  




  test.title("cast unlock")
  player.skillsLearnt = ["Double attack", "Fireball", "Unlock"]
  test.assertCmd('cast unlock', ['You cast the <i>Unlock</i> spell.', 'The door to the south unlocks.', 'The practice room door unlocks.', 'The chest unlocks.'])
  test.assertCmd('cast unlock', ['You cast the <i>Unlock</i> spell, but there are no locked doors.'])




  test.title("cast Commune with animal")
  player.skillsLearnt = ["Double attack", "Fireball", "Commune with animal"]
  test.assertCmd('talk to rabbit', [/You spend a few minutes telling the rabbit/])
  test.assertCmd('cast commune on rabbit', ['You cast the <i>Commune with animal</i> spell.', 'You can now talk to the rabbit for a short time.'])
  test.assertCmd('talk to rabbit', [/You say \'Hello,\' to the rabbit/, /Fading away bunny/])
  test.assertCmd('z', ['Time passes...'])
  test.assertCmd('z', ['Time passes...'])
  test.assertCmd('z', ['Time passes...', 'The <i>Commune with animal</i> effect on the rabbit expires.'])



  test.title("cast Commune with animal restricted")
  rpg.defaultSpellTestUseable = function(char) { return falsemsg("You have no mana.") }
  test.assertCmd('cast commune on rabbit', ['You have no mana.'])
  rpg.defaultSpellTestUseable = function(char) { return true }


  test.title("cast Protection from Frost")
  player.skillsLearnt = ["Double attack", "Fireball", "Protection From Frost"]
  test.assertCmd('cast Protection From Frost', ['You cast the <i>Protection From Frost</i> spell.', 'You take only a third damage from frost-based attacks for six turns.'])
  w.me.health = 100
  let attack4 = Attack.createAttack(w.goblin, player, rpg.findSkill('Ice shard'))
  random.prime([19,6, 6, 6])
  attack4.resolve(w.me, true, 0)
  test.assertEqual(97, w.me.health)
  test.assertEqual("A shard of ice jumps from the goblin's finger to you!", attack4.reportTexts[13].t)


  test.title("cast Vuln to Frost")
  player.skillsLearnt = ["Double attack", "Fireball", "Vulnerability To Frost"]
  random.prime([19])
  test.assertCmd('cast Vulnerability To Frost on me', ['You cast the <i>Vulnerability To Frost</i> spell.', 'Target takes triple damage from frost-based attacks for six turns.', 'The <i>Protection From Frost</i> effect on you expires.'])
  w.me.health = 100
  attack4 = Attack.createAttack(w.goblin, player, rpg.findSkill('Ice shard'))
  random.prime([19,6, 6, 6])
  attack4.resolve(w.me, true, 0)
  test.assertEqual(73, w.me.health)
  test.assertEqual("A shard of ice jumps from the goblin's finger to you!", attack4.reportTexts[13].t)


  test.title("cast Immunity to Frost")
  player.skillsLearnt = ["Double attack", "Fireball", "Immunity To Frost"]
  test.assertCmd('cast Immunity To Frost on me', ['You cast the <i>Immunity To Frost</i> spell.', 'You take no damage from frost-based attacks for six turns.', 'The <i>Vulnerability To Frost</i> effect on you expires.'])
  w.me.health = 100
  attack4 = Attack.createAttack(w.goblin, player, rpg.findSkill('Ice shard'))
  random.prime([19,6, 6, 6])
  attack4.resolve(w.me, true, 0)
  test.assertEqual(100, w.me.health)
  test.assertEqual("A shard of ice jumps from the goblin's finger to you!", attack4.reportTexts[13].t)


  player.skillsLearnt = ["Double attack", "Fireball"]


  // knife does d4+2 normally
  test.title("cast Flaming blade")
  test.assertEqual([], w.knife.activeEffects)
  player.skillsLearnt = ["Double attack", "Fireball", "Flaming Blade"]
  test.assertCmd('cast Flaming blade', ['You cast the <i>Flaming Blade</i> spell.', 'The knife now has fire along its blade.'])
  test.assertEqual(['Flaming Blade'], w.knife.activeEffects)
  test.assertCmd('equip knife', ['You draw the knife.', ])
  random.prime([19, 3, 4])

  test.assertCmd('attack goblin', ['You attack the goblin.', 'A hit!', "The attack does 9 hits, the goblin's health is now 31."])



  test.assertCmd('z', ['Time passes...',])
  test.assertCmd('z', ['Time passes...', 'The <i>Immunity To Frost</i> effect on you expires.'])


  test.title("cast Summon Frost Elemental")
  player.skillsLearnt = ["Double attack", "Fireball", "Summon Frost Elemental"]
  test.assertCmd('cast Summon Frost Elemental', ['You cast the <i>Summon Frost Elemental</i> spell.', 'The frost elemental appears before you.'])
  random.prime([19, 3, 4])
  test.assertCmd('attack elemental', ['You attack the frost elemental.', 'A hit!', "The attack does 18 hits, the frost elemental's health is now 17."])

  test.assertCmd('z', ['Time passes...',])
  test.assertCmd('z', ['Time passes...',])
  test.assertCmd('z', ['Time passes...',])
  test.assertCmd('z', ['Time passes...', 'The frost elemental disappears.'])



  test.title("cast Lore")
  player.activeEffects = []
  player.skillsLearnt = ["Double attack", "Fireball", "Lore", "Steelskin"]
  test.assertCmd('x rabbit', ['An example of a monster you can talk to after casting the right spell, and is generally not hostile.'])
  test.assertCmd('cast lore', ['You cast the <i>Lore</i> spell.', 'You feel enlightened.'])
  test.assertEqual(['Lore'], player.activeEffects)
  test.assertCmd('x rabbit', ['With Lore active, you can learn all about rabbit culture... they like carrots.'])


  w.rabbit.setLeader()



  test.title("cast Mage Light")
  player.skillsLearnt = ["Double attack", "Fireball", "Lore", "Steelskin", "Mage Light"]
  test.assertCmd('cast Mage Light', ['You cast the <i>Mage Light</i> spell.', 'You are shines brightly.'])
  test.assertEqual(['Lore', 'Mage Light'], player.activeEffects)
  test.assertEqual(true, player.isLight)
  test.assertEqual(world.LIGHT_FULL, player.lightSource())
  test.assertCmd('s', ['You head south.', 'The cupboard', 'A large storeroom, with no windows.', 'You can go north.'])
  test.assertCmd('n', ['You head north.', 'The practice room', 'A large room with straw scattered across the floor. The only exit is west', 'You can see some boots, a chest, a goblin, an orc (holding a huge shield), a rabbit, a shotgun, a small key, a snotling and a spellbook here.', 'You can go south or west.'])

  test.assertCmd('z', ['Time passes...',])
  test.assertCmd('z', ['Time passes...', 'You stop shining.'])



  test.title("cast Teleport, etc")
  player.skillsLearnt = ["Double attack", "Fireball", "Returning", "Teleport", "Mark"]
  test.assertCmd('cast Teleport', ['You cast the <i>Teleport</i> spell.', 'The <i>Teleport</i> spell has no effect - no location has been marked!'])
  test.assertCmd('cast Mark', ['You cast the <i>Mark</i> spell.', 'This location is marked for future use.'])
  test.assertCmd('cast Returning', ['You cast the <i>Returning</i> spell.', 'The air swirls around you, and everything blurs...', 'The yard', 'A large open area in front of the Great Hall, which is to the south. There is a lake to the north, and you can see an island in the lake.', 'You can see fourteen arrows and Stone of Returning here.', 'You can go north or south.'])
  test.assertCmd('cast Teleport', ['You cast the <i>Teleport</i> spell.', 'The air swirls around you, and everything blurs...', 'The practice room', 'A large room with straw scattered across the floor. The only exit is west', 'You can see some boots, a chest, a goblin, an orc (holding a huge shield), a rabbit, a shotgun, a small key, a snotling and a spellbook here.', 'You can go south or west.'])
  
  

  test.title("cast Walk On Water")
  test.assertCmd('w', ['You open the door to the great hall and walk through.', 'The great hall', 'An imposing - and rather cold - room with a high, vaulted roof, and tapestries hanging from the walls.', 'You can go east or north.'])
  test.assertCmd('n', ['You head north.', 'The yard', 'A large open area in front of the Great Hall, which is to the south. There is a lake to the north, and you can see an island in the lake.', 'You can see fourteen arrows and Stone of Returning here.', 'You can go north or south.'])
  test.assertCmd('n', ['You dive into the lake...', 'The lake swimming', 'You are swimming in a lake! Dry land is to the south.', 'You can go south.'])
  test.assertCmd('s', ['You head south.', 'The yard', 'A large open area in front of the Great Hall, which is to the south. There is a lake to the north, and you can see an island in the lake.', 'You can see fourteen arrows and Stone of Returning here.', 'You can go north or south.'])
  player.skillsLearnt = ["Double attack", "Fireball", "Lore", "Steelskin", "Walk On Water"]
  test.assertCmd('cast walk on water', ['You cast the <i>Walk On Water</i> spell.', 'You feel lighter.', 'The <i>Lore</i> effect on you expires.'])
  test.assertEqual(['Walk On Water'], player.activeEffects)
  test.assertCmd('n', ['You walk out on to the surface of the lake.', 'The lake', 'You are stood on a lake! Dry land is to the south.', 'You can go south.'])


  test.title("use ammo")
  w.goblin.loc = 'yard'
  w.shotgun.loc = 'yard'
  test.assertCmd('s', ['You head south.', 'The yard', 'A large open area in front of the Great Hall, which is to the south. There is a lake to the north, and you can see an island in the lake.', 'You can see fourteen arrows, a goblin, a shotgun and Stone of Returning here.', 'You can go north or south.'])

  test.assertCmd("equip bow", "You put away the knife, and equip the long bow.")
  test.assertCmd("attack goblin", ["You attack the goblin.", "Out of ammo!",])
  test.assertCmd("get 3 arrow", "You take three arrows.")
  random.prime([4])
  test.assertCmd("attack goblin", ["You attack the goblin.", "A miss!"])
  test.assertEqual(2, w.arrow.countAtLoc(player.name))



  test.assertCmd("get shotgun", "You take the shotgun.")
  test.assertCmd("equip shotgun", "You put away the long bow, and equip the shotgun.")
  random.prime(2)
  test.assertCmd("attack goblin", ["You attack the goblin.", "A miss!"])
  test.assertCmd("attack goblin", ["You attack the goblin.", "Out of ammo!"])
  test.assertCmd("drop shotgun", "You drop the shotgun.")


  test.title("cast unillusion")
  const illusion = cloneObject(w.phantasm_prototype, 'great_hall')
  illusion.alias = 'red dragon'
  illusion.examine = 'A scary dragon, that is definitely real!'
  player.skillsLearnt = ["Double attack", "Fireball", "Returning", "Teleport", "Mark", "Unillusion"]

  test.assertCmd('s', ['You head south.', 'The great hall', 'An imposing - and rather cold - room with a high, vaulted roof, and tapestries hanging from the walls.', 'You can see a red dragon here.', 'You can go east or north.'])
  test.assertCmd('cast unillusion', ['You cast the <i>Unillusion</i> spell.', 'The red dragon disappears.'])
  test.assertCmd('cast unillusion', ['You cast the <i>Unillusion</i> spell, but there are no illusions here.'])




  test.title("selectSkill")
  test.assertEqual('Basic attack', w.goblin.selectSkill().name)
  w.goblin.skillOptions = ["Fireball"]
  test.assertEqual('Fireball', w.goblin.selectSkill().name)
  w.goblin.skillOptions = ["Double attack", "Fireball", "Returning", "Teleport", "Mark"]
  random.prime([1])
  test.assertEqual('Fireball', w.goblin.selectSkill().name)
  delete w.goblin.skillOptions


  test.title("makeAttack  (goblin)")
  random.prime([19, 5])
  attack = w.goblin.makeAttack(player)
  test.assertEqual('goblin', attack.attacker.name)
  test.assertEqual('Basic attack', attack.skill.name)
  test.assertEqual([w.me], attack.primaryTargets)
  test.assertEqual('d8', attack.damage)
  test.assertEqual(0, attack.offensiveBonus)
  test.assertEqual(98, w.me.health)

  test.title("makeAttack  (goblin, fireball)")
  random.prime([1, 19, 5, 5, 5])
  w.goblin.skillOptions = ["Double attack", "Ice shard", "Returning", "Teleport", "Mark"]
  attack = w.goblin.makeAttack(player)
  
  test.assertEqual('goblin', attack.attacker.name)
  test.assertEqual('Ice shard', attack.skill.name)
  test.assertEqual([w.me], attack.primaryTargets)
  test.assertEqual('3d6', attack.damage)
  test.assertEqual(0, attack.offensiveBonus)
  test.assertEqual(92, w.me.health)





/**/
  
};
