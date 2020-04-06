'use strict'

util.test.util.tests = function () {
  util.test.title('Planet one')
  util.test.assertCmd('ask ai about crew', util.test.padArray(["'Tell me about the crew, Xsansi,' you say."], 4))
  util.test.assertCmd('o', ['You climb out of the stasis pod.', /^There are six/, 'A drawer under the pod slides open to reveal your jumpsuit.'])
  util.test.assertCmd('get jumpsuit', ['You take your jumpsuit.', 'The stasis pod drawer slides shut.'])
  util.test.assertCmd('wear jumpsuit', ['You put on your jumpsuit.'])

  util.test.title('Go to Ostap')
  util.test.assertCmd('a', ['You head aft.', /^The cargo bay is/])
  util.test.assertCmd('u', ['You walk up the narrow stair way to the top deck.', /^The top deck is where the living quarters/])
  util.test.assertCmd('f', ['You head forward.', /^You are stood at the forward end /, "'The satellite is in orbit,' announces Xsansi."])
  util.test.assertCmd('ask ostap about probes', "You can't see anything you might call 'ostap' here.")
  util.test.assertCmd('s', ['You head starboard.', /^The canteen/, 'You can see Ostap here.'])
  util.test.assertCmd('x chair', ["It's just scenery."])
  util.test.assertCmd('x table', 'The table is plastic, attached to the wall at one end, and held up by a single leg at the other end. The table is bare.')
  util.test.assertCmd('ask ostap about bio-probes', util.test.padArray(["'How does a bio-probe work?' you ask Ostap."], 2))
  util.test.assertCmd('ask ostap about his health', ["'How are you feeling?' you ask Ostap.", "'I am feeling good.'"])

  util.test.title('Order launch')
  util.test.assertCmd('ostap, launch 19 probes', ["'Launch 19 bio-probes,' you say to Ostap.", "'We only have 16 and we should save some for the other planets on our itinerary.'"])
  util.test.assertCmd('ostap, launch 2 bio-probe', ["'Launch 2 bio-probes,' you say to Ostap.", "'Okay captain.'"])
  util.test.assertCmd('z', ['You wait one turn.', 'Ostap leaves the canteen, heading port.'])
  util.test.assertCmd('p', ['You head port.', 'You are stood at the forward end of a narrow corridor, with your cabin to port, and the canteen to starboard. Ahead, is the lounge.', 'You can see Ostap here.', 'Ostap leaves the top deck forward, heading down.'])
  util.test.assertCmd('d', ['You head down.', /^This is, in a sense, the central nexus of the ship./, 'You can see Ostap here.', 'Ostap leaves the hallway, heading down.'])
  util.test.assertCmd('d', ['You head down.', /^The forward probe hanger is where the satellites/, 'You can see Kyle and Ostap here.', 'Ostap leaves the Forward probe hanger, heading aft.'])
  util.test.assertCmd('a', ['You head aft.', /^The aft probe hanger has/, 'You can see Ostap here.', "'Okay, two probes to deploy...' mutters Ostap as he types at the console."])

  util.test.title('Launching')
  util.test.assertCmd('z', ['You wait one turn.', 'Ostap prepares the first probe.'])
  util.test.assertCmd('ask ostap about lost probes', ["'Do we ever lose probes?' you ask Ostap.", /^'We are exploring the unknown, we have to expect /])
  util.test.assertCmd('ask ostap about planet', ["'What's your report on HD 154088D?' you ask Ostap.", "'So, this one does not look so interesting,' he replies. 'I think we see nothing more than bacteria here - maybe not even that.'"])
  util.test.assertCmd('ask ostap about lost probes', ["'Do we ever lose probes?' you ask Ostap.", /^'We are exploring the unknown/])
  util.test.assertCmd('topics for ostap', ['Some suggestions for what to ask Ostap about: background; expertise; health; planet; probes.'])
  util.test.assertCmd('z', ['You wait one turn.', 'Ostap launches the first probe.'])
  util.test.assertCmd('z', ['You wait one turn.', 'Ostap prepares the second probe.'])
  util.test.assertCmd('z', ['You wait one turn.', 'Ostap launches the second probe.'])
  util.test.assertCmd('z', ['You wait one turn.', "'Okay, two probes launched,' says Ostap as he stands up.", "'Bio-probe I has successfully landed on the planet.' announces Xsansi."])

  util.test.title('Waiting')
  util.test.assertCmd('z', ['You wait one turn.'])
  util.test.assertCmd('z', ['You wait one turn.', "'Contact with Bio-probe II has been lost as it attempted to land on the planet.' announces Xsansi."])
  util.test.assertCmd('ask ostap about lost probes', ["'What does Xsansi mean by \"contact lost\" with that probe?' you ask Ostap.", /^'We are exploring the unknown/])
  util.test.assertCmd('ask ostap about planet', ["'What's your report on HD 154088D?' you ask Ostap.", "'So far, we see nothing. No life, no green. Perhaps bacteria living below the surface?'"])
  util.test.assertCmd('topics ostap', ['Some suggestions for what to ask Ostap about: background; expertise; health; lost probe; planet; probes.'])
  util.test.assertEqual(0, w.Ostap.relationship)
  util.test.assertCmd('ask ostap about himself', ["'Tell me about yourself,' you say to Ostap.", /^'I'm from Nastasiv, near Ternopil.'/])
  util.test.assertEqual(1, w.Ostap.relationship)
  util.test.assertCmd('ask ostap about himself', ["'Tell me about yourself,' you say to Ostap.", /^'I'm from Nastasiv, near Ternopil.'/])
  util.test.assertEqual(1, w.Ostap.relationship)
  util.test.assertCmd('ostap, go in stasis pod', ["'Ostap, you're work here is done; you can go get in your stasis pod.'", "'Right, okay then.'", 'Ostap leaves the Aft probe hanger, heading forward.'])
  util.test.assertCmd('f', util.test.padArray([], 4))
  util.test.assertCmd('u', util.test.padArray([], 4))
  util.test.assertCmd('s', util.test.padArray([], 4))
  util.test.assertCmd('ostap, stop', ["'Ostap, forget what I said; don't get in your stasis pod yet.'", "'Oh, okay.'"])
  util.test.assertCmd('ostap, stop', ["'Ostap, stop what you're doing.'", "'Not really doing anything.'"])
  util.test.assertCmd('z', 'You wait one turn.')
  util.test.assertCmd('z', 'You wait one turn.')
  util.test.assertCmd('l', [/All pods are currently open/, 'You can see Ostap here.'])
  util.test.assertCmd('ostap, go in stasis pod', ["'Ostap, you're work here is done; you can go get in your stasis pod.'", "'Right, okay then.'"])
  util.test.assertCmd('z', ['You wait one turn.', 'Just in his underwear, Ostap climbs into his stasis pod.'])
  util.test.assertCmd('x ostap', ['Ostap is a big guy; not fat, but broad and tall. He keeps his dark hair in a short ponytail.He is in his underwear. He is lying in his stasis pod.', "'Close the pod, Xsansi,' says Ostap. The stasis pod lid smoothly lowers, and Xsansi operates the stasis field."])
  util.test.assertCmd('l', /Ostap's stasis pod is closed/)

  // util.test.assertCmd("z", ["You wait one turn.", "Just in his underwear, Ostap climbs into his stasis pod."]);
  // util.test.assertCmd("z", ["You wait one turn.", "'Close the pod, Xsansi,' says Ostap. The stasis pod lid smoothly lowers, and Xsansi operates the stasis field."]);
  // util.test.assertCmd("z", "You wait one turn.");
}
