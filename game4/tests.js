"use strict";



test.tests = function() {

  test.title("Planet one");
  test.assertCmd("ask ai about crew", test.padArray(["'Tell me about the crew, Xsansi,' you say."], 4));
  
  
  test.assertCmd("o", ["You climb out of the stasis pod.", /^There are six/]);
  test.assertCmd("a", ["You head aft.", /^The cargo bay is/]);
  test.assertCmd("u", ["You walk up the narrow stair way to the top deck.", /^./]);
};