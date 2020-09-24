"use strict";



test.tests = function() {
  
  test.title("Planet Analysis")
  w.Xsansi.currentPlanet = 2
  const response = {actor:w.Ostap}
  test.assertEqual("'Not as interesting as the last one, I think.'", planetAnalysis(response))
  w.Ostap.rank2 = 4
  test.assertEqual("'There are things a live here, but buried. There's bacteria in the soil. But it is not primitive bacteria. I cannot say for sure - I know only Earth bacteria - but I think this is highly evolved. I think some disaster, an extinction event, has wiped out virtually all life. This is all that survives.'", planetAnalysis(response))
  w.Ostap.rank2 = 8
  test.assertEqual("'It is sad; a whole planet dead - or virtually dead. Sad that we missed them, sad they all died. This is why this mission is so important, so mankind can spread to the stars before something like this happens on Earth.'", planetAnalysis(response))
  w.Ostap.rank2 = 0


  test.title("Probe events 1")
  test.testing = true;
  test.testOutput = [];

  w.Xsansi.currentPlanet = 2
  w.Ostap.deployProbeOverallTotal = 1
  w.Ostap.deployProbeTotal = 1
  const probe = w.probe_prototype.cloneMe(w.Ostap)
  test.assertEqual("Ostap", probe.owner)
  test.assertEqual("Bio-probe I", probe.alias)
  test.assertEqual("In flight", probe.status)
  test.assertEqual(0, probe.launchCounter)
  probe.eventScript()
  test.assertEqual("In flight", probe.status)
  test.assertEqual(1, probe.launchCounter)
  for (let i = 0; i < TURNS_TO_LANDING - 1; i++) probe.eventScript()
  test.assertEqual(0, w.Ostap.rank2)
  test.assertEqual(0, w.me.bonus)
  test.assertEqual("Landing", probe.status)
  test.assertEqual(TURNS_TO_LANDING, probe.launchCounter)
  probe.eventScript()
  test.assertEqual("Exploring", probe.status)
  test.assertEqual(1 + TURNS_TO_LANDING, probe.launchCounter)


  test.title("Probe events 2")
  for (let i = 0; i < 4; i++) probe.eventScript()
  test.assertEqual(1, w.Ostap.rank2)
  test.assertEqual(2, w.me.bonus)
  for (let i = 0; i < 4; i++) probe.eventScript()
  test.assertEqual(2, w.Ostap.rank2)
  test.assertEqual(4, w.me.bonus)
  for (let i = 0; i < 8; i++) probe.eventScript()
  test.assertEqual(3, w.Ostap.rank2)
  test.assertEqual(6, w.me.bonus)
  for (let i = 0; i < 4; i++) probe.eventScript()
  test.assertEqual(3, w.Ostap.rank2)
  test.assertEqual(6, w.me.bonus)
  w.Ostap.rank2 = 0
  w.Ostap.deployProbeOverallTotal = 0
  w.Xsansi.currentPlanet = 0
  test.testing = false;
  test.assertEqual("'Bio-probe I has successfully landed on the planet.' announces Xsansi.", test.testOutput[0])
  

  test.title("Planet one");
  test.assertCmd("ask ai about crew", test.padArray(["'Tell me about the crew, Xsansi,' you say."], 4));
  test.assertCmd("o", ["You climb out of the stasis pod.", /^There are six/, "A drawer under the pod slides open to reveal your jumpsuit."]);
  test.assertCmd("get jumpsuit", ["You take your jumpsuit.", "The stasis pod drawer slides shut."]);
  test.assertCmd("wear jumpsuit", ["You put on your jumpsuit."]);
  

  test.title("Go to Ostap")
  test.assertCmd("a", ["You head aft.", /^The cargo bay is/]);
  test.assertCmd("u", ["You walk up the narrow stair way to the top deck.", /^The top deck is where the living quarters/]);
  test.assertCmd("f", ["You head forward.", /^You are stood at the forward end /, "'Satellite I has successfully entered orbit around the planet.' announces Xsansi."]);
  test.assertCmd("ask ostap about probes", "You can't see anything you might call 'ostap' here.");
  test.assertCmd("s", ["You head starboard.", /^The canteen/, "You can see Ostap here."]);
  test.assertCmd("x chair", ["It's just scenery."]);
  test.assertCmd("x table", "The table is plastic, attached to the wall at one end, and held up by a single leg at the other end. The table is bare.");
  test.assertCmd("ask ostap about bio-probes", test.padArray(["'How does a bio-probe work?' you ask Ostap."], 2));
  test.assertCmd("ask ostap about his health", ["'How are you feeling?' you ask Ostap.", "'I am feeling good.'"]);


  test.title("Order launch");
  test.assertCmd("ostap, launch 19 probes", ["'Launch 19 bio-probes,' you say to Ostap.", "'We only have 16 and we should save some for the other planets on our itinerary.'"]);
  test.assertCmd("ostap, launch 2 bio-probe", ["'Launch 2 bio-probes,' you say to Ostap.", "'Okay captain.'"]);
  test.assertCmd("z", ["You wait one turn.", "Ostap leaves the canteen, heading port."]);
  test.assertCmd("p", ["You head port.", "You are stood at the forward end of a narrow corridor, with your cabin to port, and the canteen to starboard. Ahead, is the lounge.", "You can see Ostap here.", "Ostap leaves the top deck forward, heading down."]);
  test.assertCmd("d", ["You head down.", /^This is, in a sense, the central nexus of the ship./, "You can see Ostap here.", "Ostap leaves the hallway, heading down."]);
  test.assertCmd("d", ["You head down.", /^The forward probe hanger is where the satellites/, "You can see Kyle and Ostap here.", "Ostap leaves the Forward probe hanger, heading aft."]);
  test.assertCmd("a", ["You head aft.", /^The aft probe hanger has/, "You can see Ostap here.", "'Okay, two probes to deploy...' mutters Ostap as he types at the console."]);


  test.title("Launching");
  test.assertCmd("z", ["You wait one turn.", "Ostap prepares the first bio-probe."]);
  test.assertCmd("ask ostap about lost probes", ["'Do we ever lose probes?' you ask Ostap.", /^'We are exploring the unknown, we have to expect /])
  test.assertCmd("ask ostap about planet", ["'What's your report on HD 154088D?' you ask Ostap.", "'So, this one does not look so interesting,' he replies. 'I think we see nothing more than bacteria here - maybe not even that.'"]);
  test.assertCmd("ask ostap about lost probes", ["'Do we ever lose probes?' you ask Ostap.", /^'We are exploring the unknown/]);
  test.assertCmd("topics for ostap", ["Some suggestions for what to ask Ostap about: background; expertise; health; planet; probes."]);
  test.assertCmd("z", ["You wait one turn.", "Ostap launches the first bio-probe."]);
  test.assertCmd("z", ["You wait one turn.", "Ostap prepares the second bio-probe."]);
  test.assertCmd("z", ["You wait one turn.", "Ostap launches the second bio-probe."]);
  test.assertCmd("z", ["You wait one turn.", "'Okay, two probes launched,' says Ostap as he stands up.", "'Bio-probe I has successfully landed on the planet.' announces Xsansi."]);
  
  
  test.title("Waiting")
  test.assertCmd("z", ["You wait one turn."]);
  test.assertCmd("z", ["You wait one turn.", "'Contact with Bio-probe II has been lost as it attempted to land on the planet.' announces Xsansi."]);
  test.assertCmd("ask ostap about lost probes", ["'What does Xsansi mean by \"contact lost\" with that probe?' you ask Ostap.", /^'We are exploring the unknown/]);
  test.assertCmd("ask ostap about planet", ["'What's your report on HD 154088D?' you ask Ostap.", "'So, this one does not look so interesting,' he replies. 'I think we see nothing more than bacteria here - maybe not even that.'"]);
  test.assertCmd("topics ostap", ["Some suggestions for what to ask Ostap about: background; expertise; health; lost probe; planet; probes."]);
  test.assertEqual(0, w.Ostap.relationship);
  test.assertCmd("ask ostap about himself", ["'Tell me about yourself,' you say to Ostap.", /^'I'm from Nastasiv, near Ternopil.'/]);
  test.assertEqual(1, w.Ostap.relationship);
  test.assertCmd("ask ostap about himself", ["'Tell me about yourself,' you say to Ostap.", /^'I'm from Nastasiv, near Ternopil.'/]);
  test.assertEqual(1, w.Ostap.relationship);
  test.assertCmd("ask ostap about planet", ["'What's your report on HD 154088D?' you ask Ostap.", "'So far, we see nothing. No life, no green. Perhaps bacteria living below the surface?'"]);
  test.assertCmd("ask ostap about jjjj", ["Ostap has no interest in that."]);
  

  test.title("Ostap to stasis");
  test.assertCmd("ostap, go in stasis pod", ["'Ostap, you're work here is done; you can go get in your stasis pod.'", "'Right, okay then.'"]);
  test.assertCmd("z", ["You wait one turn.", "Ostap leaves the Aft probe hanger, heading forward."]);
  test.assertCmd("f", test.padArray([], 4));
  test.assertCmd("u", test.padArray([], 4));
  test.assertCmd("s", test.padArray([], 4));
  test.assertCmd("ostap, stop", ["'Ostap, forget what I said; don't get in your stasis pod yet.'", "'Oh, okay.'"]);
  test.assertCmd("ostap, stop", ["'Ostap, stop what you're doing.'", "'Not really doing anything.'"]);


  test.title("Waiting 2");
  test.assertCmd("z", "You wait one turn.");
  test.assertCmd("z", "You wait one turn.");
  test.assertCmd("l", [/All pods are currently open/, "You can see Ostap here."]);
  test.assertCmd("ostap, go in stasis pod", ["'Ostap, you're work here is done; you can go get in your stasis pod.'", "'Right, okay then.'"]);
  test.assertCmd("z", ["You wait one turn.", "Just in his underwear, Ostap climbs into his stasis pod."]);
  test.assertCmd("x ostap", ["Ostap is a big guy; not fat, but broad and tall. He keeps his dark hair in a short ponytail. He is in his underwear. He is lying in his stasis pod.", "'Close the pod, Xsansi,' Ostap says. The stasis pod lid smoothly lowers, and Xsansi operates the stasis field."]);
  test.assertCmd("l", /Ostap's stasis pod is closed/);
  test.assertCmd("ask ai about crew", [
    "'Tell me about the crew, Xsansi,' you say.", "'Crew member Ostap's designation is: biology. His current status is: In stasis.'",
    "'Crew member Aada's designation is: geology. Her current status is: perfect. Her current location is: the girls' cabin.'",
    "'Crew member Kyle's designation is: coms. His current status is: good. His current location is: the Forward probe hanger.'",
    "'Crew member Ha-yoon's designation is: engineering. Her current status is: good. Her current location is: Engineering (starboard).'",
  ])

  test.assertCmd("z", "You wait one turn.");


  /* */
};
