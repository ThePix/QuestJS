"use strict";

test.resetOnCompletion = false


test.tests = function() {
  





  //game.player.skillsLearnt = ["Double attack", "Fireball",  "Commune with animal", "Unlock", "Stoneskin", "Steelskin", "Lightning bolt", "Ice shard", "Psi-blast"]
  //ioUpdateCustom()

  settings.attackOutputLevel = 2

  test.title("Elements");
  test.assertEqual("fire", elements.opposed('frost'))
  test.assertEqual("frost", elements.opposed('fire'))




  test.title("Equip")
  test.assertEqual('unarmed', game.player.getEquippedWeapon().alias)
  test.assertCmd("i", "You are carrying a flail, an ice amulet and a knife.");
  test.assertCmd("equip knife", "You draw the knife.");
  test.assertCmd("i", "You are carrying a flail, an ice amulet and a knife (equipped).");
  test.assertEqual('knife', game.player.getEquippedWeapon().alias)
  test.assertCmd("equip knife", "It already is.");
  test.assertCmd("drop knife", "You drop the knife.");
  test.assertEqual('unarmed', game.player.getEquippedWeapon().alias)
  test.assertEqual(undefined, game.player.equipped)
  test.assertCmd("take knife", "You take the knife.");
  test.assertCmd("unequip knife", "It already is.");
  test.assertCmd("equip knife", "You draw the knife.");
  test.assertCmd("unequip knife", "You put away the knife.");
  

  test.title("Armour")
  settings.armourScaling = 1
  test.assertEqual(0, game.player.getArmour())
  test.assertCmd("get helmet", "You take the helmet.");
  test.assertEqual(0, game.player.getArmour())
  test.assertCmd("wear helmet", "You put on the helmet.");
  test.assertEqual(10, game.player.getArmour())
  test.assertCmd("get chestplate", "You take the chestplate.");
  test.assertEqual(10, game.player.getArmour())
  test.assertCmd("wear chestplate", "You put on the chestplate.");
  test.assertEqual(30, game.player.getArmour())
  settings.armourScaling = 10



  //TODO
  // Monster descriptions that include an injury note and optionally hits
  // Also lore and truesight, search
  // behavior - hostile, following, guarding, etc.

  // non-corporeal
  // death, onDeath, corpseDescription
  
  // pickpocket



  test.title("Attack.createAttack  (unarmed) misses");
  const attack0 = Attack.createAttack(game.player, w.goblin)
  test.assertEqual('me', attack0.attacker.name)
  test.assertEqual([w.goblin], attack0.primaryTargets)
  test.assertEqual('d4', attack0.damage)
  test.assertEqual(1, attack0.offensiveBonus)

  random.prime(3)
  //w.goblin.applyAttack(attack0, true, 0)
  attack0.resolve(w.goblin, true, 0)
  test.assertEqual(40, w.goblin.health)

  



  test.title("Attack.createAttack  (unarmed)");
  const attack1 = Attack.createAttack(game.player, w.goblin)
  test.assertEqual('me', attack1.attacker.name)
  test.assertEqual([w.goblin], attack1.primaryTargets)
  test.assertEqual('d4', attack1.damage)
  test.assertEqual(1, attack1.offensiveBonus)

  random.prime(19)
  random.prime(4)
  attack1.resolve(w.goblin, true, 0)
  test.assertEqual(36, w.goblin.health)

  w.goblin.armour = 2
  random.prime(19)
  random.prime(4)
  attack1.resolve(w.goblin, true, 0)
  test.assertEqual(34, w.goblin.health)
  w.goblin.armour = 0
  w.goblin.health = 40
  


  test.title("Attack.createAttack  (flail)");
  const oldProcessAttack = game.player.modifyOutgoingAttack
  game.player.modifyOutgoingAttack = function(attack) { attack.offensiveBonus += 2 }
  w.flail.equipped = true

  const attack2 = Attack.createAttack(game.player, w.orc)
  test.assertEqual('me', attack2.attacker.name)
  test.assertEqual('2d10+4', attack2.damage)
  test.assertEqual(2, attack2.offensiveBonus)

  random.prime(19)
  random.prime(4)
  random.prime(7)
  attack2.resolve(w.goblin, true, 0)
  test.assertEqual(25, w.goblin.health)

  w.goblin.armour = 2
  random.prime(19)
  random.prime(4)
  random.prime(7)
  attack2.resolve(w.goblin, true, 0)
  test.assertEqual(14, w.goblin.health)
  w.goblin.armour = 0
  w.goblin.health = 40
  
  game.player.modifyOutgoingAttack = oldProcessAttack
  w.flail.equipped = false




  test.title("Attack.createAttack  (goblin)");
  const attack2a = Attack.createAttack(w.goblin, game.player)
  test.assertEqual('goblin', attack2a.attacker.name)
  test.assertEqual([w.me], attack2a.primaryTargets)
  test.assertEqual('d8', attack2a.damage)
  test.assertEqual(0, attack2a.offensiveBonus)
  random.prime(19)
  random.prime(5)
  attack2a.resolve(w.me, true, 0)
  test.assertEqual(98, w.me.health)
  w.me.health = 100
  



  test.assertCmd("get shotgun", "You take the shotgun.");
  test.assertCmd("equip shotgun", "You draw the shotgun.");
  random.prime(2)
  test.assertCmd("attack goblin", ["You attack the goblin.", "A miss!"]);/*
  test.assertCmd("attack goblin", ["You attack the goblin.", "Out of ammo!"]);
  test.assertCmd("drop shotgun", "You drop the shotgun.");




  test.title("Attack.createAttack  (fireball)");
  const oldgetSkillFromButtons = skillUI.getSkillFromButtons
  skillUI.getSkillFromButtons = function() { return skills.findName('Fireball') }
  
  const attack3 = Attack.createAttack(game.player, w.goblin)
  
  test.assertEqual('spellCasting', attack3.skill.statForOffensiveBonus)
  test.assertEqual(5, w.me.spellCasting)
  
  test.assertEqual('me', attack3.attacker.name)
  test.assertEqual(undefined, attack3.weapon)
  test.assertEqual([w.goblin, w.orc, w.snotling, w.rabbit], attack3.primaryTargets)
  test.assertEqual('2d6', attack3.damage)
  test.assertEqual(5, attack3.offensiveBonus)
  test.assertEqual('fire', attack3.element)

  random.prime(19)
  random.prime(4)
  random.prime(3)
  attack3.resolve(w.goblin, true, 0)
  test.assertEqual(33, w.goblin.health)

  attack3.report = []
  random.prime(2)
  attack3.resolve(w.goblin, true, 0)
  test.assertEqual(33, w.goblin.health)
  
  w.goblin.element = 'frost'
  random.prime(19)
  random.prime(4)
  random.prime(3)
  attack3.resolve(w.goblin, true, 0)
  test.assertEqual(19, w.goblin.health)
  //attack3.output(40)
  
    
  w.goblin.fireModifier = false
  w.goblin.health = 40
  skillUI.getSkillFromButtons = oldgetSkillFromButtons
  




  test.title("attack command, success");
  random.prime(19)
  random.prime(4)
  random.prime(7)
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
  game.player.skillsLearnt = ["Double attack"]
  test.assertCmd('cast nonsense', ['There is no spell called nonsense.'])
  test.assertCmd('cast fireball', ['You do not know the spell <i>Fireball</i>.'])
  test.assertCmd('learn nonsense', ['There is no spell called nonsense.'])
  test.assertCmd('learn fireball', ['You do not have anything you can learn <i>Fireball</i> from.'])
  test.assertCmd('get spellbook', ['You take the spellbook.'])
  test.assertCmd('learn fireball', ['You learn <i>Fireball</i> from the spellbook.'])
  test.assertEqual(["Double attack", "Fireball"], game.player.skillsLearnt) 
  //goblin, orc, snotling, rabbit

  random.prime(19)
  random.prime(4)
  random.prime(4)

  random.prime(19)
  random.prime(2)
  random.prime(2)

  random.prime(4)

  random.prime(4)
  test.assertCmd('cast fireball', ['You cast <i>Fireball</i>.', 'The room is momentarily filled with fire.', 'The goblin reels from the explosion.', 'Damage: 16', 'Health now: 24', 'The orc reels from the explosion.', 'Damage: 4', 'Health now: 56', 'The snotling ignores it.', 'The rabbit ignores it.'])
  w.goblin.health = 40
  w.orc.health = 60





  test.title("learn Ice shard")
  test.assertCmd('learn ice shard', ['You learn <i>Ice shard</i> from the spellbook.'])
  game.player.skillsLearnt = ["Double attack", "Fireball", "Ice shard"]
  test.assertCmd('cast ice shard', ['You need a target for the spell <i>Ice shard</i>.'])
  test.assertCmd('drop spellbook', ['You drop the spellbook.'])
  skillUI.getSkillFromButtons = function() { return skills.findName('Ice shard') }
  random.prime(19)
  random.prime(4)
  random.prime(7)
  random.prime(9)
  test.assertCmd('attack goblin', ['You cast <i>Ice shard</i>.', 'A shard of ice jumps from your finger to the goblin!', 'Damage: 10', 'Health now: 30'])
  w.goblin.health = 40
  skillUI.getSkillFromButtons = oldgetSkillFromButtons
  random.prime(19)
  random.prime(4)
  random.prime(7)
  random.prime(9)
  test.assertCmd('cast Ice shard at goblin', ['You cast <i>Ice shard</i>.', 'A shard of ice jumps from your finger to the goblin!', 'Damage: 10', 'Health now: 30'])
  w.goblin.health = 40
  skillUI.getSkillFromButtons = oldgetSkillFromButtons




  test.title("Lightning bolt")
  game.player.skillsLearnt = ["Double attack", "Fireball", "Lightning bolt"]
  test.assertCmd('cast lightning bolt', ['You need a target for the spell <i>Lightning bolt</i>.'])
  skillUI.getSkillFromButtons = function() { return skills.findName('Lightning bolt') }
  random.prime(19)
  random.prime(4)
  random.prime(7)
  random.prime(9)
  
  // For the orc
  random.prime(2)
  
  // For the snotling
  random.prime(19)
  random.prime(4)
  random.prime(7)
  test.assertCmd('attack goblin', ['You cast <i>Lightning bolt</i>.', 'A lightning bolt jumps from your out-reached hand to the goblin!', 'Damage: 20', 'Health now: 20', 'A smaller bolt jumps your target, but entirely misses the orc!', 'A smaller bolt jumps your target to the snotling!', 'Damage: 11', 'Health now: 9'])
  w.goblin.health = 40
  w.snotling.health = 20
  
  random.prime(4)
  test.assertCmd('attack goblin', ['You cast <i>Lightning bolt</i>.', 'A lightning bolt jumps from your out-reached hand to the goblin, fizzling out before it can actually do anything.'])
  
  
  skillUI.getSkillFromButtons = oldgetSkillFromButtons



  test.title("Attack.createAttack  (goblin, spells)")
  w.goblin.spellCasting = 3
  
  const attack2b = Attack.createAttack(w.goblin, game.player, skills.findName('Ice shard'))
  test.assertEqual('goblin', attack2b.attacker.name)
  test.assertEqual([w.me], attack2b.primaryTargets)
  test.assertEqual('3d6', attack2b.damage)
  test.assertEqual(3, attack2b.offensiveBonus)
  random.prime(19)
  random.prime(5)
  random.prime(5)
  random.prime(5)
  attack2b.resolve(w.me, true, 0)
  test.assertEqual(94, w.me.health)

  const attack2c = Attack.createAttack(w.goblin, game.player, skills.findName('Psi-blast'))
  test.assertEqual('goblin', attack2c.attacker.name)
  random.prime(19)
  random.prime(5)
  random.prime(5)
  random.prime(5)
  attack2c.resolve(w.me, true, 0)
  test.assertEqual(79, w.me.health)
  
  
  w.ice_amulet.worn = true
  const attack2d = Attack.createAttack(w.goblin, game.player, skills.findName('Ice shard'))
  random.prime(19)
  attack2d.resolve(w.me, true, 0)
  test.assertEqual(79, w.me.health)
  test.assertEqual("A shard of ice jumps from the goblin's finger to you, but the ice amulet protects you, and you take no damage.", attack2d.report[5].t)
  
  w.me.health = 100
  w.goblin.spellCasting = false
  



  test.title("learn ongoing spells")
  test.assertCmd('get spellbook', ['You take the spellbook.'])
  test.assertCmd('learn steelskin', ['You learn <i>Steelskin</i> from the spellbook.'])
  test.assertCmd('learn stoneskin', ['You learn <i>Stoneskin</i> from the spellbook.'])
  test.assertCmd('drop spellbook', ['You drop the spellbook.'])
  test.assertEqual([], game.player.activeEffects)
  test.assertCmd('cast stoneskin', ['You cast the <i>Stoneskin</i> spell.', 'Your skin becomes as hard as stone - and yet still just as flexible.'])

  test.assertEqual(['Stoneskin'], game.player.activeEffects)
  test.assertCmd('cast steelskin', ['You cast the <i>Steelskin</i> spell.', 'Your skin becomes as hard as steel - and yet still just as flexible.', 'The <i>Stoneskin</i> spell terminates.'])
  test.assertEqual(['Steelskin'], game.player.activeEffects)







  test.title("ongoing spells expire")
  game.player.countdown_Steelskin = 3
  w.spell_handler.eventScript()
  test.assertEqual(2, game.player.countdown_Steelskin)
  test.assertCmd('z', ['Time passes...'])
  test.assertEqual(1, game.player.countdown_Steelskin)
  test.assertCmd('z', ['Time passes...', 'The <i>Steelskin</i> spell terminates.'])
  test.assertEqual(false, game.player.countdown_Steelskin)
  test.assertEqual([], game.player.activeEffects)
  test.assertCmd('z', ['Time passes...'])
  





  test.title("cast unlock")
  game.player.skillsLearnt = ["Double attack", "Fireball", "Unlock"]
  test.assertCmd('cast unlock', ['You cast the <i>Unlock</i> spell.', 'The door to the south unlocks.'])
  test.assertCmd('cast unlock', ['You cast the <i>Unlock</i> spell.', 'There are no locked doors.'])
  // should also open other door!!!




  test.title("cast Commune with animal")
  game.player.skillsLearnt = ["Double attack", "Fireball", "Commune with animal"]
  test.assertCmd('talk to rabbit', [/You spend a few minutes telling the rabbit/])
  test.assertCmd('cast commune on rabbit', ['You cast <i>Commune with animal</i>.', 'You can now talk to the rabbit for a short time.'])
  test.assertCmd('talk to rabbit', [/You say \'Hello,\' to the rabbit/, /Fading away bunny/])



  game.player.skillsLearnt = ["Double attack", "Fireball"]



  

/**/
  
};
