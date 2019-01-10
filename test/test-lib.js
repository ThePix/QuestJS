"use strict";

// This is not language neutral, but should not be shipping with the game

// var test = {};  Done in util.js

test.runTests = function() {
  var time = parseInt(Date.now());
  test.tests();
  test.results (time);
}  



test.testOutput = [];
test.totalCount = 0;
test.failCount = 0;
test.subCount = 0;
test.currentTitle = "Not specified";

test.title = function(title) {
test.subCount = 0;
  test.currentTitle = title;
}

test.printTitle = function() {
  debugmsg(test.currentTitle + ": Error (test " + test.subCount + ")");
  test.failCount++;
}

test.assertCmd = function(cmdStr, expected) {
  test.totalCount++;
  test.subCount++;
  if (typeof expected === "string") {
    expected = [expected];
  }
  test.testing = true;
  test.testOutput = [];
  parser.parse(cmdStr);
  test.testing = false;
  
  if (test.testOutput.length === expected.length && test.testOutput.every(function(value, index) {
    if (typeof expected[index] === "string") {
      return value === expected[index];
    }
    else {
      return new RegExp(expected[index]).test(value);
    }
  })) {
    //debugmsg(".");
  }
  else {
    test.printTitle();
    for (var i = 0; i < test.testOutput.length; i++) {
      if (expected[i] !== test.testOutput[i]) {
        debugmsg("Expected: " + expected[i]);
        debugmsg("...Found: " + test.testOutput[i]);
      }
    }
  }
};


test.assertEqual = function(expected, found) {
  test.totalCount++;
  test.subCount++;
  if (expected === found) {
    //debugmsg(".");
  }
  else {
    test.printTitle();
    debugmsg("Expected: " + expected);
    debugmsg("...Found: " + found);
  }
};

test.results = function(time) {
  var elapsed = parseInt(Date.now()) - time;
  debugmsg("Number of tests: " + test.totalCount);
  debugmsg("Number of fails: " + test.failCount);
  debugmsg("Elapsed time: " + elapsed + " ms (" + (Math.round(elapsed / test.totalCount * 10) / 10) + " ms/test)");
};