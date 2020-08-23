"use strict";



test.tests = function() {
  




  test.title("Elements");
  test.assertEqual("fire", elements.opposed('frost'))
  test.assertEqual("frost", elements.opposed('fire'))




  test.title("Equip")
  test.assertEqual('unarmed', game.player.getEquippedWeapon().alias)
  test.assertCmd("i", "You are carrying a flail and a knife.");
  test.assertCmd("equip knife", "You draw the knife.");
  test.assertCmd("i", "You are carrying a flail and a knife (equipped).");
  test.assertEqual('knife', game.player.getEquippedWeapon().alias)
  test.assertCmd("equip knife", "It already is.");
  test.assertCmd("drop knife", "You drop the knife.");
  test.assertEqual('unarmed', game.player.getEquippedWeapon().alias)
  test.assertEqual(undefined, game.player.equipped)
  test.assertCmd("take knife", "You take the knife.");
  test.assertCmd("unequip knife", "It already is.");
  test.assertCmd("equip knife", "You draw the knife.");
  test.assertCmd("unequip knife", "You put away the knife.");
  




 test.title("Attack.createAttack  (unarmed) misses");
  const attack0 = Attack.createAttack(game.player, w.goblin)
  attack0.outputLevel = -1
  test.assertEqual('me', attack0.attacker.name)
  test.assertEqual([w.goblin], attack0.primaryTargets)
  test.assertEqual('d4', attack0.damage)
  test.assertEqual(-2, attack0.offensiveBonus)
  attack0.attacker.processAttack(attack0)
  test.assertEqual(-2, attack0.offensiveBonus)

  random.prime(3)
  //w.goblin.applyAttack(attack0, true, 0)
  attack0.resolve(attack0.report, w.goblin, true, 0)
  test.assertEqual(40, w.goblin.health)

  



  test.title("Attack.createAttack  (unarmed)");
  const attack1 = Attack.createAttack(game.player, w.goblin)
  attack1.outputLevel = -1
  test.assertEqual('me', attack1.attacker.name)
  test.assertEqual([w.goblin], attack1.primaryTargets)
  test.assertEqual('d4', attack1.damage)
  test.assertEqual(-2, attack1.offensiveBonus)
  attack1.attacker.processAttack(attack1)
  test.assertEqual(-2, attack1.offensiveBonus)

  random.prime(19)
  random.prime(4)
  attack1.resolve(attack1.report, w.goblin, true, 0)
  test.assertEqual(36, w.goblin.health)
  console.log(attack1)

  w.goblin.armour = 2
  random.prime(19)
  random.prime(4)
  attack1.resolve(attack1.report, w.goblin, true, 0)
  test.assertEqual(34, w.goblin.health)
  w.goblin.armour = 0
  w.goblin.health = 40
  


  test.title("Attack.createAttack  (flail)");
  const oldProcessAttack = game.player.processAttack
  game.player.processAttack = function(attack) { attack.offensiveBonus += 2 }
  game.player.equipped = 'flail'

  const attack2 = Attack.createAttack(game.player, w.orc)
  attack2.outputLevel = -1
  test.assertEqual('me', attack2.attacker.name)
  test.assertEqual('2d10+4', attack2.damage)
  test.assertEqual(2, attack2.offensiveBonus)

  random.prime(19)
  random.prime(4)
  random.prime(7)
  attack2.resolve(attack2.report, w.goblin, true, 0)
  test.assertEqual(25, w.goblin.health)

  w.goblin.armour = 2
  random.prime(19)
  random.prime(4)
  random.prime(7)
  attack2.resolve(attack2.report, w.goblin, true, 0)
  test.assertEqual(14, w.goblin.health)
  w.goblin.armour = 0
  w.goblin.health = 40
  
  game.player.processAttack = oldProcessAttack
  delete game.player.equipped




  test.title("Attack.createAttack  (fireball)");
  const oldgetSkillFromButtons = skillUI.getSkillFromButtons
  skillUI.getSkillFromButtons = function() { return skills.findName('Fireball') }
  
  const attack3 = Attack.createAttack(game.player, w.goblin)
  console.log(attack3)
  attack3.outputLevel = -1
  test.assertEqual('me', attack3.attacker.name)
  test.assertEqual(undefined, attack3.weapon)
  test.assertEqual([w.goblin, w.orc, w.snotling, w.friend], attack3.primaryTargets)
  test.assertEqual('2d6', attack3.damage)
  test.assertEqual(0, attack3.offensiveBonus)
  test.assertEqual('fire', attack3.element)

  random.prime(19)
  random.prime(4)
  random.prime(3)
  attack3.resolve(attack3.report, w.goblin, true, 0)
  test.assertEqual(33, w.goblin.health)

  attack3.report = []
  random.prime(2)
  attack3.resolve(attack3.report, w.goblin, true, 0)
  test.assertEqual(33, w.goblin.health)
  
  w.goblin.element = 'frost'
  random.prime(19)
  random.prime(4)
  random.prime(3)
  attack3.resolve(attack3.report, w.goblin, true, 0)
  test.assertEqual(19, w.goblin.health)
  //attack3.output(40)
  
    
  delete w.goblin.fireModifier
  w.goblin.health = 40
  skillUI.getSkillFromButtons = oldgetSkillFromButtons
  

/*


  test.title("attack command, success");
  random.prime(19)
  random.prime(4)
  random.prime(7)
  game.player.equipped = 'flail'

  test.assertCmd('attack goblin', ['You attack the goblin.', /A hit/, 'Damage: 15'])
  test.assertEqual(25, w.goblin.health)

  w.goblin.health = 40
  delete game.player.equipped



  test.title("attack command, fails");
  random.prime(4)
  game.player.equipped = 'flail'

  test.assertCmd('attack goblin', ['You attack the goblin.', /A miss/])
  test.assertEqual(40, w.goblin.health)

  delete game.player.equipped




  test.title("learn fireball")
  game.player.skillsLearnt = ["Double attack"]
  test.assertCmd('cast nonsense', ['There is no spell called nonsense.'])
  test.assertCmd('cast fireball', ['You do not know the spell <i>Fireball</i>.'])
  test.assertCmd('learn nonsense', ['There is no spell called nonsense.'])
  test.assertCmd('learn fireball', ['You do not have anything you can learn <i>Fireball</i> from.'])
  test.assertCmd('get spellbook', ['You take the spellbook.'])
  test.assertCmd('learn fireball', ['You learn <i>Fireball</i> from the spellbook.'])
  game.player.skillsLearnt = ["Double attack", "Fireball"]
  //test.assertCmd('rpg', [/All/])
  //test.assertCmd('cast fireball', ['You cast the <i>Fireball</i> spell.', 'The room is momentarily filled with fire.'])


/*



  test.title("learn Lightning bolt")
  test.assertCmd('learn lightning bolt', ['You learn <i>Lightning bolt</i> from the spellbook.'])
  game.player.skillsLearnt = ["Double attack", "Fireball", "Lightning bolt"]
  test.assertCmd('cast lightning bolt', ['You need a target to cast the <i>Lightning bolt</i> spell.'])
  test.assertCmd('drop spellbook', ['You drop the spellbook.'])
  skillUI.getSkillFromButtons = function() { return skills.findName('Lightning bolt') }
  random.prime(19)
  random.prime(4)
  random.prime(7)
  random.prime(9)
  test.assertCmd('attack goblin', ['You attack the goblin.', 'A hit!', 'Damage: 20'])
  w.goblin.health = 40
  skillUI.getSkillFromButtons = oldgetSkillFromButtons




  random.prime(19)
  random.prime(4)
  random.prime(7)
  random.prime(9)
  test.assertCmd('cast lightning bolt at goblin', ['You cast the <i>Lightning bolt</i> spell on the goblin.'])
  w.goblin.health = 40
  skillUI.getSkillFromButtons = oldgetSkillFromButtons




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
  test.assertCmd('z', ['You wait one turn.'])
  test.assertEqual(1, game.player.countdown_Steelskin)
  test.assertCmd('z', ['You wait one turn.', 'The <i>Steelskin</i> spell terminates.'])
  test.assertEqual(undefined, game.player.countdown_Steelskin)
  test.assertEqual([], game.player.activeEffects)
  test.assertCmd('z', ['You wait one turn.'])
  



  game.player.skillsLearnt = ["Double attack", "Fireball"]






// Add some buffing spells for attacker and defender
// Do spells need to be Quest objects? Could they be JS objects?
// Spells spawn spell effects
// a spell effect needs a processAttack function that modifies an attack object to modify attacks made by the character
// and modifyAttack if the character is the target
// spell effect also needs to have a system that potentially causes it to expire

// Or just use the name of the spell, rather than a spell effect. This would then be saved.
// So have a spell handler as there is for elements
// Learning a spell is having the name in a list - both character and monsters
  

/**/
  
};
