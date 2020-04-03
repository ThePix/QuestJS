'use strict'
import { util, parser, io, game, world } from './main'
// This is not language neutral, but should not be shipping with the game, so tough

// Note that the util.test object was defined in util.js

util.test.runTests = function () {
  const time = parseInt(Date.now())
  util.test.util.tests()
  util.test.results(time)
}

util.test.util.testOutput = []
util.test.totalCount = 0
util.test.failCount = 0
util.test.subCount = 0
util.test.currentTitle = 'Not specified'

util.test.title = function (title) {
  util.test.subCount = 0
  util.test.currentTitle = title
}

util.test.printTitle = function () {
  io.debugmsg(util.test.currentTitle + ': Error (util.test ' + util.test.subCount + ')')
  util.test.failCount++
}

util.test.assertCmd = function (cmdStr, expected, extraOutput) {
  util.test.totalCount++
  util.test.subCount++
  if (expected.constructor !== Array) {
    expected = [expected]
  }
  util.test.util.testing = true
  util.test.util.testOutput = []
  parser.parse(cmdStr)
  // world.endTurn();
  util.test.util.testing = false

  if (util.test.util.testOutput.length === expected.length && util.test.util.testOutput.every(function (value, index) {
    if (typeof expected[index] === 'string') {
      return value === expected[index]
    } else {
      return expected[index].util.test(value)
    }
  })) {
    // io.debugmsg(".");
  } else {
    util.test.printTitle()
    for (let i = 0; i < Math.max(util.test.util.testOutput.length, expected.length); i++) {
      if (typeof expected[i] === 'string') {
        if (expected[i] !== util.test.util.testOutput[i]) {
          io.debugmsg('Expected (A): ' + expected[i])
          io.debugmsg('...Found (A): ' + util.test.util.testOutput[i])
          if (extraOutput) {
            if (typeof expected[i] === 'string' && typeof util.test.util.testOutput[i] === 'string') {
              for (let j = 0; j < expected[i].length; j++) {
                if (expected[i][j] !== util.test.util.testOutput[i][j]) {
                  console.log('Mismatch at position: ' + j)
                  console.log('Expected: ' + expected[i].charCodeAt(j))
                  console.log('Found: ' + util.test.util.testOutput[i].charCodeAt(j))
                }
              }
            } else {
              console.log('Found: type mismatch')
              console.log(typeof expected[i])
              console.log(typeof util.test.util.testOutput[i])
            }
          }
        }
      } else if (expected[i] instanceof RegExp) {
        if (util.test.util.testOutput[i] === undefined || !expected[i].util.test(util.test.util.testOutput[i])) {
          io.debugmsg('Expected: ' + expected[i])
          io.debugmsg('...Found: ' + util.test.util.testOutput[i])
        }
      } else if (expected[i] === undefined) {
        io.debugmsg('Expected nothing')
        io.debugmsg('...Found: ' + util.test.util.testOutput[i])
      } else {
        io.debugmsg('Found an unrecognised type for expected (should be string or regex): ' + (typeof expected[i]))
      }
    }
  }
}

util.test.assertEqual = function (expected, found, extraOutput) {
  util.test.totalCount++
  util.test.subCount++

  if (Array.isArray(expected)) {
    if (!util.arrayCompare(expected, found)) {
      util.test.printTitle()
      io.debugmsg('Expected (A): ' + expected)
      io.debugmsg('...Found (A): ' + found)
    }
  } else if (expected === found) {
    // io.debugmsg(".");
  } else {
    util.test.printTitle()
    io.debugmsg('Expected: ' + expected)
    io.debugmsg('...Found: ' + found)
    if (extraOutput) {
      if (typeof expected === 'string' && typeof found === 'string') {
        for (let i = 0; i < expected.length; i++) {
          if (expected[i] !== found[i]) {
            console.log('Mismatch at position: ' + i)
            console.log('Expected: ' + expected.charCodeAt(i))
            console.log('Found: ' + found.charCodeAt(i))
          }
        }
      }
    }
  }
}

// Use only for numbers; expected must not be zero, as long as the found is within 0.1% of the expected, this is pass
util.test.assertAlmostEqual = function (expected, found) {
  util.test.totalCount++
  util.test.subCount++

  if (Math.abs((found - expected) / expected) < 0.001) {
    // io.debugmsg(".");
  } else {
    util.test.printTitle()
    io.debugmsg('Expected: ' + expected)
    io.debugmsg('...Found: ' + found)
  }
}

util.test.assertMatch = function (expected, found) {
  util.test.totalCount++
  util.test.subCount++
  if (expected.util.test(found)) {
    // io.debugmsg(".");
  } else {
    util.test.printTitle()
    io.debugmsg('Expected: ' + expected)
    io.debugmsg('...Found: ' + found)
  }
}

util.test.fail = function (msg) {
  util.test.printTitle()
  io.debugmsg('Failure: ' + io.msg)
}

util.test.results = function (time) {
  const elapsed = parseInt(Date.now()) - time
  io.debugmsg('Number of util.tests: ' + util.test.totalCount)
  io.debugmsg('Number of fails: ' + util.test.failCount)
  io.debugmsg('Elapsed time: ' + elapsed + ' ms (' + (Math.round(elapsed / util.test.totalCount * 10) / 10) + ' ms/util.test)')
}

util.test.padArray = function (arr, n) {
  for (let i = 0; i < n; i++) arr.push(/./)
  return arr
}

// You can use this in a util.test to move the player silently
util.test.movePlayer = function (roomName) {
  game.player.loc = roomName
  game.update()
  world.setBackground()
}
