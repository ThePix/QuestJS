"use strict";



test.tests = function() {

  test.title("Planet one");
  test.assertCmd("ask ai about crew", test.padArray(["'Tell me about the crew, Xsansi,' you say."], 4));
  
  
  test.assertCmd("o", ["You climb out of the stasis pod.", /^There are six/]);
  test.assertCmd("a", ["You head aft.", /^The cargo bay is/]);
  test.assertCmd("u", ["You walk up the narrow stair way to the top deck.", /^The top deck is where the living quarters/]);
  test.assertCmd("f", ["You head forward.", /^You are stood at the forward end /]);
  test.assertCmd("ask ostap about probes", "You can't see anything you might call 'ostap'.");
  test.assertCmd("s", ["You head starboard.", /^The canteen/, "You can see Ostap here."]);
  test.assertCmd("x chair", "It's just scenery.");
  test.assertCmd("x table", "The table is plastic, attached to the wall at one end, and held up by a single leg at the other end. The table is bare.");
  test.assertCmd("ask ostap about bio-probes", test.padArray(["'How does a bio-probe work?,' you ask Ostap."], 2));
  test.assertCmd("ask ostap about his health", ["'How are you feeling?' you ask Ostap.", "'I am feeling good.'"]);
  test.assertCmd("ostap, launch 19 probes", ["'Launch 19 bio-probes,' you say to Ostap.", "'We only have 16 and we should save some for the other planets on our itinery.'"]);
  test.assertCmd("ostap, launch bio-probe", ["'Launch a bio-probe,' you say to Ostap.", "'Okay captain.'"]);
  test.assertCmd("z", ["You wait one turn.", "Ostap leaves the canteen, heading port."]);
};