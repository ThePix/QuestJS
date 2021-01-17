"use strict"

test.tests = function() {
  test.title("Text processor 1")
  test.assertEqual("Sir! Yes, sir", processText("{Sir}! Yes, {sir}"))
  game.player.callmemaam = true 
  test.assertEqual("Ma'am! Yes, ma'am", processText("{Sir}! Yes, {sir}"))

  test.title("Text processor 2")
  w.ship.helm = 'sharraaa'
  w.ship.science = 'sharraaa'
  w.ship.engineering = 'farrington_moss'
  test.assertEqual("The Helmsman is Sharraaa.", processText("The Helmsman is {role:helm:alias}."))
  test.assertEqual("The Helmsman is the Salis.", processText("The Helmsman is {role:helm:altName}."))
  test.assertEqual("The Salis is the Helmsman.", processText("{role:helm:altName:true} is the Helmsman."))

  test.title("Text processor 3")
  test.assertEqual("Stardate 854.63.5", processText("{time}"))
  w.ship.dateTime += 24
  test.assertEqual("Stardate 854.64.5", processText("{time}"))
  w.ship.dateTime += 2
  test.assertEqual("Stardate 854.64.7", processText("{time}"))


  test.title("Roster")
  test.assertEqual("Helm", roster.getRole('helm').alias)
  log(w.ship)
  test.assertEqual(true, roster.hasOfficer('helm'))
  test.assertEqual(false, roster.hasOfficer('armsman'))
  test.assertEqual('sharraaa', roster.getOfficer('helm').name)
  test.assertEqual(null, roster.getOfficer('armsman'))
  test.assertEqual(4, roster.getRoles().length)
  test.assertEqual(3, roster.getRoles(true).length)
  test.assertEqual(1, roster.getRoles(false).length)
  test.assertEqual(['helm', 'science'], roster.getRoles('sharraaa'))
  test.assertEqual(['engineering'], roster.getRoles(w.farrington_moss))
  test.assertEqual(1, w.sharraaa.getTopics().length)


  w.helmsman_go_to_7iota.script()
  test.assertEqual('Ship officer roster:|Helm: Sharraaa|Chief Engineer: Farrington Moss|Science Officer: Sharraaa|Armsman: no assignment', roster.getRoster())

  test.assertEqual('Starbase 142', stars.getLocation().alias)


  /**/
}