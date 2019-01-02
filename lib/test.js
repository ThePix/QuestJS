"use strict";

var test = {};

test.testing = false;
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
  debugmsg(DBG_TEST, test.currentTitle + ": Error (test " + test.subCount + ")");
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
  
  if (test.testOutput.length === expected.length && test.testOutput.every(function(value, index) { return value === expected[index]})) {
    //debugmsg(DBG_TEST, ".");
  }
  else {
    test.printTitle();
    for (var i = 0; i < test.testOutput.length; i++) {
      debugmsg(DBG_TEST, "Expected: " + expected[i]);
      debugmsg(DBG_TEST, "Found: " + test.testOutput[i]);
    }
  }
};


test.assertEqual = function(expected, found) {
  test.totalCount++;
  test.subCount++;
  if (expected === found) {
    //debugmsg(DBG_TEST, ".");
  }
  else {
    test.printTitle();
    debugmsg(DBG_TEST, "Expected: " + expected);
    debugmsg(DBG_TEST, "Found: " + found);
  }
};

test.results = function() {
  debugmsg(DBG_TEST, "Number of tests: " + test.totalCount);
  debugmsg(DBG_TEST, "Number of fails: " + test.failCount);
};