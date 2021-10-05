"use strict"

test.tests = function() {
  test.title("Text processor 1")
  test.assertEqual("Sir! Yes, sir", processText("{Sir}! Yes, {sir}"))
  player.callmemaam = true 
  test.assertEqual("Ma'am! Yes, ma'am", processText("{Sir}! Yes, {sir}"))

  test.title("Text processor 2")
  w.ship.helm = 'sharraaa'
  w.ship.science = 'sharraaa'
  w.ship.engineering = 'farrington_moss'
  w.sharraaa.loc = 'bridge'
  w.farrington_moss.loc = 'bridge'
  test.assertEqual("The Helmsman is Sharraaa.", processText("The Helmsman is {role:helm:alias}."))
  test.assertEqual("The Helmsman is the Salis.", processText("The Helmsman is {role:helm:altName}."))
  test.assertEqual("The Salis is the Helmsman.", processText("{role:helm:altName:true} is the Helmsman."))

  test.title("Text processor 3")
  test.assertEqual("Stardate 854.63.5", processText("{time}"))
  w.ship.dateTime += 24
  test.assertEqual("Stardate 854.64.5", processText("{time}"))
  w.ship.dateTime += 2
  test.assertEqual("Stardate 854.64.7", processText("{time}"))

  test.assertEqual("Stardate 854.63.5", processText("{time:0}"))
  test.assertEqual("Stardate 854.63.6", processText("{time:1}"))
  test.assertEqual("Stardate 854.64.5", processText("{time:24}"))


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


  test.title("Stars 1")
  test.assertEqual('Stardock 83', stars.getLocation().alias)
  test.assertEqual('Sol', stars.getSystem().alias)
  test.assertEqual('Starbase 142', stars.getLocation('starbase').alias)
  test.assertEqual('Cyrennis Minima', stars.getSystem('starbase').alias)

  test.title("Missions 1")
  test.assertEqual('Asteroid heading for Chloris V', missions.getMission('asteroid').alias)
  test.assertEqual(false, missions.isActive('asteroid'))
  test.assertEqual(undefined, missions.getState('asteroid'))

  stars.arriveAtSector()
  test.assertEqual('Ship officer roster:|Helm: Sharraaa|Chief Engineer: Farrington Moss|Science Officer: Sharraaa|Armsman: no assignment', roster.getRoster())

  test.assertEqual('Starbase 142', stars.getLocation().alias)

  test.title("Stars 2")
  test.assertEqual('Starbase 142', stars.getLocation().alias)
  test.assertEqual('Cyrennis Minima', stars.getSystem().alias)

  test.title("Missions 2")
  test.assertEqual(true, missions.isActive('asteroid'))
  test.assertEqual(1, missions.getState('asteroid'))
  test.assertEqual('Get to Chloris', missions.getStatus('asteroid'))


  /**/
}