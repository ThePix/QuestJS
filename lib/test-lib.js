"use strict";

// This is not language neutral, but should not be shipping with the game, so tough

// Note that the test object was defined in util.js

test.runTests = function() {
  const time = parseInt(Date.now());
  test.tests();
  test.results (time);
};



test.testOutput = [];
test.totalCount = 0;
test.failCount = 0;
test.subCount = 0;
test.currentTitle = "Not specified";

test.title = function(title) {
test.subCount = 0;
  test.currentTitle = title;
};

test.printTitle = function() {
  debugmsg(test.currentTitle + ": Error (test " + test.subCount + ")");
  test.failCount++;
};

test.assertCmd = function(cmdStr, expected) {
  test.totalCount++;
  test.subCount++;
  if (expected.constructor !== Array) {
    expected = [expected];
  }
  test.testing = true;
  test.testOutput = [];
  parser.parse(cmdStr);
  //world.endTurn();
  test.testing = false;
  
  if (test.testOutput.length === expected.length && test.testOutput.every(function(value, index) {
    if (typeof expected[index] === "string") {
      return value === expected[index];
    }
    else {
      return expected[index].test(value);
    }
  })) {
    //debugmsg(".");
  }
  else {
    test.printTitle();
    for (let i = 0; i < Math.max(test.testOutput.length, expected.length); i++) {
      if (typeof expected[i] === "string") {
        if (expected[i] !== test.testOutput[i]) {
          debugmsg("Expected: " + expected[i]);
          debugmsg("...Found: " + test.testOutput[i]);
        }
      }
      else if (expected[i] instanceof RegExp) {
        if (test.testOutput[i] === undefined || !expected[i].test(test.testOutput[i])) {
          debugmsg("Expected: " + expected[i]);
          debugmsg("...Found: " + test.testOutput[i]);
        }
      }
      else if (expected[i] === undefined) {
        debugmsg("Expected nothing");
        debugmsg("...Found: " + test.testOutput[i]);
      }
      else {
        debugmsg("Found an unrecognised type for expected (should be string or regex): " + (typeof expected[i]));
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

test.assertMatch = function(expected, found) {
  test.totalCount++;
  test.subCount++;
  if (expected.test(found)) {
    //debugmsg(".");
  }
  else {
    test.printTitle();
    debugmsg("Expected: " + expected);
    debugmsg("...Found: " + found);
  }
};

test.results = function(time) {
  const elapsed = parseInt(Date.now()) - time;
  debugmsg("Number of tests: " + test.totalCount);
  debugmsg("Number of fails: " + test.failCount);
  debugmsg("Elapsed time: " + elapsed + " ms (" + (Math.round(elapsed / test.totalCount * 10) / 10) + " ms/test)");
};

test.padArray = function(arr, n) {
  for (let i = 0; i < n; i++) arr.push(/./);
  return arr;
}
