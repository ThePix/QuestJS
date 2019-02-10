"use strict";



test.tests = function() {

  test.title("Planet one");
  test.assertCmd("ask ai about crew", test.padArray(["'Tell me about the crew, Xsansi,' you say."], 4));
  
  
  test.assertCmd("o", ["You climb out of the stasis pod.", /^There are six/]);

};