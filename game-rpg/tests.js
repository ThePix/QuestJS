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
  test.assertCmd("i", "You are carrying a flail, an ice amulet and a knife.");
  test.assertCmd("equip knife", "You draw the knife.");
  test.assertCmd("i", "You are carrying a flail, an ice amulet and a knife (equipped).");
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
  const attack0 = Attack.createAttack(player, w.goblin)
  test.assertEqual('me', attack0.attacker.name)
  test.assertEqual([w.goblin], attack0.primaryTargets)
  test.assertEqual('d4', attack0.damage)
  test.assertEqual(1, attack0.offensiveBonus)

  random.prime(3)
  //w.goblin.applyAttack(attack0, true, 0)
  attack0.resolve(w.goblin, true, 0)
  test.assertEqual(40, w.goblin.health)

  



  test.title("Attack.createAttack (unarmed)");
  const attack1 = Attack.createAttack(player, w.goblin)
  test.assertEqual('me', attack1.attacker.name)
  test.assertEqual([w.goblin], attack1.primaryTargets)
  test.assertEqual('d4', attack1.damage)
  test.assertEqual(1, attack1.offensiveBonus)

  random.prime([19, 4])
  attack1.resolve(w.goblin, true, 0)
  test.assertEqual(36, w.goblin.health)

  w.goblin.armour = 2
  random.prime([19, 4])
  attack1.resolve(w.goblin, true, 0)
  test.assertEqual(34, w.goblin.health)
  w.goblin.armour = 0
  w.goblin.health = 40
  


  test.title("Attack.createAttack flail)");
  const oldProcessAttack = player.modifyOutgoingAttack
  player.modifyOutgoingAttack = function(attack) { attack.offensiveBonus += 2 }
  w.flail.equipped = true

  const attack2 = Attack.createAttack(player, w.orc)
  test.assertEqual('me', attack2.attacker.name)
  test.assertEqual('2d10+4', attack2.damage)
  test.assertEqual(2, attack2.offensiveBonus)

  random.prime([19, 4, 7])
  attack2.resolve(w.goblin, true, 0)
  test.assertEqual(25, w.goblin.health)

  w.goblin.armour = 2
  random.prime([19, 4, 7])
  attack2.resolve(w.goblin, true, 0)
  test.assertEqual(14, w.goblin.health)
  w.goblin.armour = 0
  w.goblin.health = 40
  
  player.modifyOutgoingAttack = oldProcessAttack
  w.flail.equipped = false

  test.title("Attack.createAttack (goblin)");
  const attack2a = Attack.createAttack(w.goblin, player)
  test.assertEqual('goblin', attack2a.attacker.name)
  test.assertEqual([w.me], attack2a.primaryTargets)
  test.assertEqual('d8', attack2a.damage)
  test.assertEqual(0, attack2a.offensiveBonus)
  random.prime([19, 5])
  attack2a.resolve(w.me, true, 0)
  test.assertEqual(98, w.me.health)
  w.me.health = 100
  



  test.assertCmd("get shotgun", "You take the shotgun.")
  test.assertCmd("equip shotgun", "You draw the shotgun.")
  random.prime(2)
  test.assertCmd("attack goblin", ["You attack the goblin.", "A miss!"])
  test.assertCmd("attack goblin", ["You attack the goblin.", "Out of ammo!"])
  test.assertCmd("drop shotgun", "You drop the shotgun.")









  test.title("attack command, success");
  random.prime([19, 4, 7])
  w.flail.equipped = true

  test.assertCmd('attack goblin', ['You attack the goblin.', /A hit/, 'Damage: 15', 'Health now: 25'])
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
  
  const spell = skills.find('fireball')
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
  test.assertCmd('cast fireball', ['You cast <i>Fireball</i>.', 'The room is momentarily filled with fire.', 'The goblin reels from the explosion.', 'Damage: 8', 'Health now: 32', 'The orc reels from the explosion.', 'Damage: 4', 'Health now: 56', 'The snotling ignores it.', 'The rabbit ignores it.'])
  w.goblin.health = 40
  w.orc.health = 60





  test.title("learn Ice shard")
  test.assertCmd('learn ice shard', ['You learn <i>Ice shard</i> from the spellbook.'])
  player.skillsLearnt = ["Double attack", "Fireball", "Ice shard"]
  test.assertCmd('cast ice shard', ['You need a target for the spell <i>Ice shard</i>.'])
  test.assertCmd('drop spellbook', ['You drop the spellbook.'])
  random.prime([19, 4, 7, 9])
  test.assertCmd('cast Ice shard at goblin', ['You cast <i>Ice shard</i>.', 'A shard of ice jumps from your finger to the goblin!', 'Damage: 20', 'Health now: 20'])
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

  test.assertCmd('cast Lightning bolt at goblin', ['You cast <i>Lightning bolt</i>.', 'A lightning bolt jumps from your out-reached hand to the goblin!', 'Damage: 20', 'Health now: 20', 'A smaller bolt jumps your target, but entirely misses the orc!', 'A smaller bolt jumps your target to the snotling!', 'Damage: 11', 'Health now: 9'])
  w.goblin.health = 40
  w.snotling.health = 20
  
  random.prime(4)
  test.assertCmd('cast lightning bolt at goblin', ['You cast <i>Lightning bolt</i>.', 'A lightning bolt jumps from your out-reached hand to the goblin, fizzling out before it can actually do anything.'])
  



  test.title("Attack.createAttack  (goblin, spells)")
  w.goblin.spellCasting = 3
  
  const attack2b = Attack.createAttack(w.goblin, player, skills.findName('Ice shard'))
  test.assertEqual('goblin', attack2b.attacker.name)
  test.assertEqual([w.me], attack2b.primaryTargets)
  test.assertEqual('3d6', attack2b.damage)
  test.assertEqual(3, attack2b.offensiveBonus)
  random.prime([19, 5, 5, 5])
  attack2b.resolve(w.me, true, 0)
  test.assertEqual(94, w.me.health)


  const attack2c = Attack.createAttack(w.goblin, player, skills.findName('Psi-blast'))
  test.assertEqual('goblin', attack2c.attacker.name)
  random.prime([19, 5, 5, 5])
  attack2c.resolve(w.me, true, 0)
  test.assertEqual(79, w.me.health)
  
  
  w.ice_amulet.worn = true
  const attack2d = Attack.createAttack(w.goblin, player, skills.findName('Ice shard'))
  random.prime(19)
  attack2d.resolve(w.me, true, 0)
  test.assertEqual(79, w.me.health)
  test.assertEqual("A shard of ice jumps from the goblin's finger to you, but the ice amulet protects you, and you take no damage.", attack2d.report[4].t)
  
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
  w.spell_handler.eventScript()
  test.assertEqual(2, player['countdown_Steelskin'])
  test.assertCmd('z', ['Time passes...'])
  test.assertEqual(1, player['countdown_Steelskin'])
  test.assertCmd('z', ['Time passes...', 'The <i>Steelskin</i> effect on you expires.'])
  test.assertEqual(undefined, player['countdown_Steelskin'])
  test.assertEqual([], player.activeEffects)
  test.assertCmd('z', ['Time passes...'])
  





  test.title("cast unlock")
  player.skillsLearnt = ["Double attack", "Fireball", "Unlock"]
  test.assertCmd('cast unlock', ['You cast <i>Unlock</i>.', 'The door to the south unlocks.', 'The practice room door unlocks.', 'The chest unlocks.'])
  test.assertCmd('cast unlock', ['There are no locked doors.'])




  test.title("cast Commune with animal")
  player.skillsLearnt = ["Double attack", "Fireball", "Commune with animal"]
  test.assertCmd('talk to rabbit', [/You spend a few minutes telling the rabbit/])
  test.assertCmd('cast commune on rabbit', ['You cast <i>Commune with animal</i>.', 'You can now talk to the rabbit for a short time.'])
  test.assertCmd('talk to rabbit', [/You say \'Hello,\' to the rabbit/, /Fading away bunny/])
  test.assertCmd('z', ['Time passes...'])
  test.assertCmd('z', ['Time passes...'])
  test.assertCmd('z', ['Time passes...', 'The <i>Commune with animal</i> effect on the rabbit expires.'])



  test.title("cast Commune with animal restricted")
  skills.defaultSpellTestUseable = function(char) { return falsemsg("You have no mana.") }
  test.assertCmd('cast commune on rabbit', ['You have no mana.'])
  skills.defaultSpellTestUseable = function(char) { return true }


  test.title("cast Protection from Frost")
  player.skillsLearnt = ["Double attack", "Fireball", "Protection From Frost"]
  test.assertCmd('cast Protection From Frost', ['You cast the <i>Protection From Frost</i> spell.', 'You take only a third damage from frost-based attacks for six turns.'])
  w.me.health = 100
  let attack4 = Attack.createAttack(w.goblin, player, skills.findName('Ice shard'))
  random.prime([19,6, 6, 6])
  attack4.resolve(w.me, true, 0)
  test.assertEqual(97, w.me.health)
  test.assertEqual("A shard of ice jumps from the goblin's finger to you!", attack4.report[4].t)


  test.title("cast Vuln to Frost")
  player.skillsLearnt = ["Double attack", "Fireball", "Vulnerability To Frost"]
  random.prime([19])
  test.assertCmd('cast Vulnerability To Frost on me', ['You cast <i>Vulnerability To Frost</i>.', 'Target takes triple damage from frost-based attacks for six turns.', 'The <i>Protection From Frost</i> effect on you expires.'])
  w.me.health = 100
  attack4 = Attack.createAttack(w.goblin, player, skills.findName('Ice shard'))
  random.prime([19,6, 6, 6])
  attack4.resolve(w.me, true, 0)
  test.assertEqual(73, w.me.health)
  test.assertEqual("A shard of ice jumps from the goblin's finger to you!", attack4.report[4].t)


  test.title("cast Immunity to Frost")
  player.skillsLearnt = ["Double attack", "Fireball", "Immunity To Frost"]
  test.assertCmd('cast Immunity To Frost on me', ['You cast the <i>Immunity To Frost</i> spell.', 'You take no damage from frost-based attacks for six turns.', 'The <i>Vulnerability To Frost</i> effect on you expires.'])
  w.me.health = 100
  attack4 = Attack.createAttack(w.goblin, player, skills.findName('Ice shard'))
  random.prime([19,6, 6, 6])
  attack4.resolve(w.me, true, 0)
  test.assertEqual(100, w.me.health)
  test.assertEqual("A shard of ice jumps from the goblin's finger to you!", attack4.report[4].t)


  player.skillsLearnt = ["Double attack", "Fireball"]


  // knife does d4+2 normally
  test.title("cast Flaming blade")
  player.skillsLearnt = ["Double attack", "Fireball", "Flaming Blade"]
  test.assertCmd('cast Flaming blade', ['You cast <i>Flaming Blade</i>.', 'The knife now has fire along its blade.'])
  test.assertCmd('equip knife', ['You draw the knife.', ])
  random.prime([19, 3, 4])
  test.assertCmd('attack goblin', ['You attack the goblin.', 'A hit!', 'Damage: 9', 'Health now: 31'])

  test.assertCmd('z', ['Time passes...',])
  test.assertCmd('z', ['Time passes...', 'The <i>Immunity To Frost</i> effect on you expires.'])


  test.title("cast Summon Frost Elemental")
  player.skillsLearnt = ["Double attack", "Fireball", "Summon Frost Elemental"]
  test.assertCmd('cast Summon Frost Elemental', ['You cast <i>Summon Frost Elemental</i>.', 'A frost elemental appears before you.'])
  random.prime([19, 3, 4])
  test.assertCmd('attack elemental', ['You attack the frost elemental.', 'A hit!', 'Damage: 18', 'Health now: 17'])

 

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
  test.assertCmd('n', ['You head north.', 'The practice room', 'A large room with straw scattered across the floor. The only exit is west', 'You can see some boots, a chest, a frost elemental, a goblin, an orc (holding a huge shield), a rabbit, a shotgun, a small key, a snotling and a spellbook here.', 'You can go south or west.'])

  test.assertCmd('z', ['Time passes...',])
  test.assertCmd('z', ['Time passes...', 'You stop shining.'])


  test.title("cast Walk On Water")
  test.assertCmd('w', ['You open the door to the great hall and walk through.', 'The great hall', 'An imposing - and rather cold - room with a high, vaulted roof, and tapestries hanging from the walls.', 'You can go east or north.'])
  test.assertCmd('n', ['You head north.', 'The yard', 'A large open area in front of the Great Hall, which is to the south. There is a lake to the north, and you can see an island in the lake.', 'You can go north or south.'])
  test.assertCmd('n', ['You dive into the lake...', 'The lake swimming', 'You are swimming in a lake! Dry land is to the south.', 'You can go south.'])
  test.assertCmd('s', ['You head south.', 'The yard', 'A large open area in front of the Great Hall, which is to the south. There is a lake to the north, and you can see an island in the lake.', 'You can go north or south.'])
  player.skillsLearnt = ["Double attack", "Fireball", "Lore", "Steelskin", "Walk On Water"]
  test.assertCmd('cast walk on water', ['You cast the <i>Walk On Water</i> spell.', 'You feel lighter.', 'The <i>Lore</i> effect on you expires.'])
  test.assertEqual(['Walk On Water'], player.activeEffects)
  test.assertCmd('n', ['You walk out on to the surface of the lake.', 'The lake', 'You are stood on a lake! Dry land is to the south.', 'You can go south.'])




/**/
  
};
