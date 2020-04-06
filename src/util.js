'use strict'
import { errormsg, game, w, world, lang, settings } from './main.js'

// ============  Utilities  =================================

// Should all be language neutral

// A command should return one of these
// (but a verb will return true or false, so the command that uses it
// can in turn return one of these - a verb is an attribute of an object)

export const SUCCESS = 1
export const SUCCESS_NO_TURNSCRIPTS = 2
export const SUPPRESS_ENDTURN = 3
export const FAILED = -1
export const PARSER_FAILURE = -2
export const ERROR = -3

export const BRIEF = 1
export const TERSE = 2
export const VERBOSE = 3

export const TEXT_COLOUR = $('.sidepanes').css('color')

// A bug in Quest I need to sort out
export const ERR_QUEST_BUG = 21
// A bug in the game the creator needs to sort out
export const ERR_GAME_BUG = 22
export const ERR_TP = 25
export const ERR_SAVE_LOAD = 26
export const ERR_DEBUG_CMD = 27

export const display = {
  ALL: 0,
  LOOK: 1,
  PARSER: 2,
  INVENTORY: 3,
  SIDE_PANE: 4,
  SCOPING: 5
}

// const PARSER = 1

export const LIGHT_none = 0
export const LIGHT_SELF = 1
export const LIGHT_MEAGRE = 2
export const LIGHT_FULL = 3
export const LIGHT_EXTREME = 4

export const VISIBLE = 1
export const REACHABLE = 2

export const INDEFINITE = 1
export const DEFINITE = 2

export const INFINITY = 9999
// const INFINITY = {infinity:true};

export const NULL_FUNC = function () {}

export const COLOURS = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']

export const test = {}
test.testing = false

// @DOC
// ## General Utility Functions
// @UNDOC

// @DOC
// This is an attempt to mimic the firsttime functionality of Quest 5. Unfortunately, JavaScript does not
// lend itself well to that!
// If this is the first time the give `id` has been encountered, the `first` function will be run.
// Otherwise the `other` function will be run, if given.
//
//     firstime(342, function() {
//       msg("This was the first time.")
//     }, function() {
//       msg("This was NOT the first time.")
//     }, function() {
//
export function firsttime (id, first, other) {
  if (firsttimeTracker.includes(id)) {
    if (other) other()
  } else {
    firsttimeTracker.push(id)
    first()
  }
}
export const firsttimeTracker = []

// ============  Random Utilities  =======================================
// @DOC
// ## Random Functions
// @UNDOC

// @DOC
// Returns a random number from 0 to n1, or n1 to n2, inclusive.
export function randomInt (n1, n2) {
  if (n2 === undefined) {
    n2 = n1
    n1 = 0
  }
  return Math.floor(Math.random() * (n2 - n1 + 1)) + n1
}

// @DOC
// Returns true 'percentile' times out of 100, false otherwise.
export function randomChance (percentile) {
  return randomInt(99) < percentile
}

// @DOC
// Returns a random element from the array, or null if it is empty
// If the second parameter is true, then the selected value is also deleted from the array,
// preventing it from being selected a second time
export function randomFromArray (arr, deleteEntry) {
  if (arr.length === 0) return null
  const index = Math.floor(Math.random() * arr.length)
  const res = arr[index]
  if (deleteEntry) arr.splice(index, 1)
  return res
}

// @DOC
// Returns a random number based on the standard RPG dice notation.
// For example 2d6+3 means roll two six sided dice and add three.
// Returns he number if sent a number.
// It can cope with complex strings such as 2d8-3d6
// You can also specify unusual dice, i.e., not a sequence from one to n, by separating each value with a colon,
// so d1:5:6 rolls a three sided die, with 1, 5 and 6 on the sides.
// It will cope with any number of parts, so -19+2d1:5:6-d4 will be fine.
export function diceRoll (s) {
  if (typeof s === 'number') return s
  s = s.replace(/ /g, '').replace(/-/g, '+-')
  let total = 0

  console.log(s)
  for (let dice of s.split('+')) {
    if (dice === '') continue
    let negative = 1
    if (/^-/.test(dice)) {
      dice = dice.substring(1)
      negative = -1
    }
    if (/^\d+$/.test(dice)) {
      total += parseInt(dice)
    } else {
      if (/^d/.test(dice)) {
        dice = '1' + dice
      }
      const parts = dice.split('d')
      if (parts.length === 2 && /^\d+$/.test(parts[0]) && /^[0-9:]+$/.test(parts[1])) {
        const number = parseInt(parts[0])
        for (let i = 0; i < number; i++) {
          if (/^\d+$/.test(parts[1])) {
            total += negative * randomInt(1, parseInt(parts[1]))
          } else {
            total += negative * parseInt(randomFromArray(parts[1].split(':')))
          }
        }
      } else {
        console.log("Can't parse dice type (but will attempt to use what I can): " + dice)
        errormsg("Can't parse dice type (but will attempt to use what I can): " + dice)
      }
    }
  }
  console.log(total)
  return total
}

// ============  String Utilities  =======================================
// @DOC
// ## String Functions
// @UNDOC

// @DOC
// Returns the string with the first letter capitalised
export function sentenceCase (str) {
  return str.replace(/[a-z]/i, letter => letter.toUpperCase()).trim()
}

// @DOC
// Returns a string with the given number of hard spaces. Browsers collapse multiple white spaces to just show
// one, so you need to use hard spaces (NBSPs) if you want several together.
export function spaces (n) {
  return '&nbsp;'.repeat(n)
}

// @DOC
// If isMultiple is true, returns the item name, otherwise nothing. This is useful in commands that handle
// multiple objects, as you can have this at the start of the response string. For example, if the player does GET BALL,
// the response might be "Done". If she does GET ALL, then the response for the ball needs to be "Ball: Done".
// In the command, you can have `msg(prefix(item, isMultiple) + "Done"), and it is sorted.
export function prefix (item, isMultiple) {
  if (!isMultiple) { return '' }
  return sentenceCase(item.name) + ': '
}

// @DOC
// Creates a string from an array. If the array element is a string, that is used, if it is an item, its byname is used (and passed the `options`). Items are sorted alphabetically, based on the "name" attribute.
//
// Options:
//
// * article:    DEFINITE (for "the") or INDEFINITE (for "a"), defaults to none (see byname)
// * sep:        separator (defaults to comma)
// * lastJoiner: separator for last two items (just separator if not provided); you should include any spaces (this allows you to have a comma and "and", which is obviously wrong, but some people like it)
// * modified:   item aliases modified (see byname) (defaults to false)
// * nothing:    return this if the list is empty (defaults to empty string)
// * count:      if this is a number, the name will be prefixed by that (instead of the article)
// * doNotSort   if true the list isnot sorted
// * separateEnsembles:  if true, ensembles are listed as the separate items
//
// For example:
//
// ```
// formatList(listOfOjects, {def:"a", joiner:" and"})
// -> "a hat, Mary and some boots"
//
// formatList(list, {joiner:" or", nothing:"nowhere");
// -> north, east or up
// ```
//
// Note that you can add further options for your own game, and then write your own byname function that uses it.
export function formatList (itemArray, options) {
  if (options === undefined) { options = {} }

  if (itemArray.length === 0) {
    return options.nothing ? options.nothing : ''
  }

  if (!options.sep) { options.sep = ', ' }
  if (!options.lastJoiner) { options.lastJoiner = options.sep }

  if (!options.separateEnsembles) {
    const toRemove = []
    const toAdd = []
    for (const item of itemArray) {
      if (item.ensembleMaster && item.ensembleMaster.isAllTogether()) {
        toRemove.push(item)
        if (!toAdd.includes(item.ensembleMaster)) toAdd.push(item.ensembleMaster)
      }
    }
    itemArray = arraySubtract(itemArray, toRemove)
    itemArray = itemArray.concat(toAdd)
  }

  // sort the list alphabetically on name
  if (!options.doNotSort) {
    itemArray.sort(function (a, b) {
      if (a.name) a = a.name
      if (b.name) b = b.name
      return a.localeCompare(b)
    })
  }
  // console.log(itemArray)
  const l = itemArray.map(el => {
    if (el === undefined) return '[undefined]'
    if (typeof el === 'string') return el
    if (el.byname) return el.byname(options)
    if (el.name) return el.name
    return '[' + (typeof el) + ']'
  })
  // console.log(l)
  let s = ''
  do {
    s += l.shift()
    if (l.length === 1) { s += options.lastJoiner }
    if (l.length > 1) { s += options.sep }
  } while (l.length > 0)

  return s
}

// @DOC
// Lists the properties of the given object; useful for debugging only.
// To inspect an object use JSON.stringify(obj)
export function listProperties (obj) {
  return Object.keys(obj).join(', ')
}

export const arabic = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
export const roman = 'M;CM;D;CD;C;XC;L;XL;X;IX;V;IV;I'.split(';')

// @DOC
// Returns the given number as a string in Roman numerals.
export function toRoman (number) {
  if (typeof number !== 'number') {
    errormsg('toRoman can only handle numbers')
    return number
  }

  let result = ''
  // var a, r;
  for (let i = 0; i < 13; i++) {
    while (number >= arabic[i]) {
      result = result + roman[i]
      number = number - arabic[i]
    }
  }
  return result
}

// @DOC
// Returns the game time as a string. The game time is game.elapsedTime seconds after game.startTime.
export function getDateTime () {
  const time = new Date(game.elapsedTime * 1000 + game.startTime.getTime())
  // console.log(time);
  return time.toLocaleString(settings.dateTime.locale, settings.dateTime)
}

// @DOC
// Returns the given number as a string formatted as money. The formatting is defined by settings.moneyFormat.
export function displayMoney (n) {
  if (typeof settings.moneyFormat === 'undefined') {
    errormsg('No format for money set (set settings.moneyFormat in settings.js).')
    return '' + n
  }
  const ary = settings.moneyFormat.split('!')
  if (ary.length === 2) {
    return settings.moneyFormat.replace('!', '' + n)
  } else if (ary.length === 3) {
    const negative = (n < 0)
    n = Math.abs(n)
    let options = ary[1]
    const showsign = options.startsWith('+')
    if (showsign) {
      options = options.substring(1)
    }
    let number = displayNumber(n, options)
    if (negative) {
      number = '-' + number
    } else if (n !== 0 && showsign) {
      number = '+' + number
    }
    return (ary[0] + number + ary[2])
  } else if (ary.length === 4) {
    const options = n < 0 ? ary[2] : ary[1]
    return ary[0] + displayNumber(n, options) + ary[3]
  } else {
    errormsg('settings.moneyFormat in settings.js expected to have either 1, 2 or 3 exclamation marks.')
    return '' + n
  }
}

// @DOC
// Returns the given number as a string formatted as per the control string.
// The control string is made up of five parts.
// The first is a sequence of characters that are not digits that will be added to the start of the string, and is optional.
// The second is a sequence of digits and it the number of characters left of the decimal point; this is padded with zeros to make it longer.
// The third is a single non-digit character; the decimal marker.
// The fourth is a sequence of digits and it the number of characters right of the decimal point; this is padded with zeros to make it longer.
// The fifth is a sequence of characters that are not digits that will be added to the end of the string, and is optional.
export function displayNumber (n, control) {
  n = Math.abs(n) // must be positive
  const regex = /^(\D*)(\d+)(\D)(\d*)(\D*)$/
  if (!regex.test(control)) {
    errormsg('Unexpected format in displayNumber (' + control + '). Should be a number, followed by a single character separator, followed by a number.')
    return '' + n
  }
  const options = regex.exec(control)
  const places = parseInt(options[4]) // eg 2
  let padding = parseInt(options[2]) // eg 3
  if (places > 0) {
    // We want a decimal point, so the padding, the total length, needs that plus the places
    padding = padding + 1 + places // eg 6
  }
  const factor = Math.pow(10, places) // eg 100
  const base = (n / factor).toFixed(places) // eg "12.34"
  const decimal = base.replace('.', options[3]) // eg "12,34"
  return (options[1] + decimal.padStart(padding, '0') + options[5]) // eg "(012,34)"
}

// @DOC
// Converts the string to the standard direction name, so "down", "dn" and "d" will all return "down".
// Uses the EXITS array, so language neutral.
export function getDir (s) {
  for (const exit of lang.exit_list) {
    if (exit.nocmd) continue
    if (exit.name === s) return exit.name
    if (exit.abbrev.toLowerCase() === s) return exit.name
    if (new RegExp('^(' + exit.alt + ')$').test(s)) return exit.name
  }
  return false
}

// ============  Array Utilities  =======================================
// @DOC
// ## Array (List) Functions
// @UNDOC

// @DOC
// Returns a new array, derived by subtracting each element in b from the array a.
// If b is not an array, then b itself will be removed.
// Unit tested.
export function arraySubtract (a, b) {
  if (!Array.isArray(b)) b = [b]
  const res = []
  for (let i = 0; i < a.length; i++) {
    if (!b.includes(a[i])) res.push(a[i])
  }
  return res
}

// @DOC
// Returns true if the arrays a and b are equal. They are equal if both are arrays, they have the same length,
// and each element in order is the same.
// Assumes a is an array, but not b.
// Unit tested
export function arrayCompare (a, b) {
  if (!Array.isArray(b)) return false
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (b[i] !== a[i]) return false
  }
  return true
}

// @DOC
// Removes the element el from the array, ary.
// Unlike arraySubtract, no new array is created; the original aray is modified, and nothing is returned.
export function arrayRemove (ary, el) {
  const index = ary.indexOf(el)
  if (index !== -1) {
    ary.splice(index, 1)
  }
}

// @DOC
// Returns a new array based on ary, but including only those objects for which the attribute attName is equal to value.
// To filter for objects that do not have the attribute you can filter for the value undefined.
export function arrayFilterByAttribute (ary, attName, value) {
  return ary.filter(el => el[attName] === value)
}

// ============  Scope Utilities  =======================================

// @DOC
// ## Scope Functions
// @UNDOC

// @DOC
// Returns an array of objects the player can currently reach and see.
export function scopeReachable () {
  const list = []
  for (const key in w) {
    if (w[key].scopeStatus === REACHABLE && world.ifNotDark(w[key])) {
      list.push(w[key])
    }
  }
  return list
}

// @DOC
// Returns an array of objects held by the given character.
export function scopeHeldBy (chr) {
  const list = []
  for (const key in w) {
    if (w[key].isAtLoc(chr)) {
      list.push(w[key])
    }
  }
  return list
}

// @DOC
// Returns an array of objects at the player's location that can be seen.
export function scopeHereListed () {
  const list = []
  for (const key in w) {
    if (w[key].isAtLoc(game.player.loc, display.LOOK) && world.ifNotDark(w[key])) {
      list.push(w[key])
    }
  }
  return list
}

export const util = {}

// ============  Response Utilities  =======================================

// @DOC
// ## The Respond Function
// @UNDOC

// @DOC
// Searchs the given list for a suitable response, according to the given params, and runs that response.
// This is a big topic, see [here](https://github.com/ThePix/QuestJS/wiki/The-respond-function) for more.
export function respond (params, list, func) {
  // console.log(params)
  // if (!params.action) throw "No action in params"
  // if (!params.actor) throw "No action in params"
  // if (!params.target) throw "No action in params"
  const response = util.findResponse(params, list)
  if (!response) {
    if (func) func(params)
    errormsg('Failed to find a response (F12 for more)')
    console.log('Failed to find a response')
    console.log(params)
    console.log(list)
    return false
  }
  // console.log(response)
  if (response.script) response.script(params)
  if (response.msg) params.actor.msg(response.msg, params)
  if (func) func(params, response)
  return !response.failed
}

export function getResponseList (params, list, result) {
  if (!result) result = []
  for (const item of list) {
    if (item.name) {
      params.text = item.name.toLowerCase()
      // console.log("check item: " + item.name)
      if (item.test) {
        if (!result.includes(item) && item.test(params)) result.push(item)
      } else {
        if (!result.includes(item)) result.push(item)
      }
      // console.log("item is good: " + item.name)
    }
    if (item.responses) result = getResponseList(params, item.responses, result)
    // console.log("done")
  }
  return result
}

util.findResponse = function (params, list) {
  for (const item of list) {
    // console.log("check item: " + item.name)
    if (item.test && !item.test(params)) continue
    // console.log("item is good: " + item.name)
    if (item.responses) return util.findResponse(params, item.responses)
    // console.log("done")
    return item
  }
  return false
}

util.addResponse = function (route, data, list) {
  util.addResponseToList(route, data, list)
}

util.addResponseToList = function (route, data, list) {
  const sublist = util.getResponseSubList(route, list)
  sublist.unshift(data)
}

util.getResponseSubList = function (route, list) {
  const s = route.shift()
  if (s) {
    const sublist = list.find(el => el.name === s)
    if (!sublist) throw 'Failed to add sub-list with ' + s
    return util.getResponseSubList(route, sublist.responses)
  } else {
    return list
  }
}

util.verifyResponses = function (list) {
  //  console.log(list)

  if (list[list.length - 1].test) {
    console.log('WARNING: Last entry has a test condition:')
    console.log(list)
  }
  for (const item of list) {
    if (item.responses) {
      // console.log(item.name)
      if (item.responses.length === 0) {
        console.log('Zero responses for: ' + item.name)
      } else {
        util.verifyResponses(item.responses)
      }
    }
  }
}

util.listContents = function (contents) {
  return formatList(this.getContents(), { article: INDEFINITE, lastJoiner: lang.list_and, modified: true, nothing: lang.list_nothing, loc: this.name })
}

util.niceDirections = function (dir) {
  const dirObj = lang.exit_list.find(function (el) { return el.name === dir })
  return dirObj.niceDir ? dirObj.niceDir : dirObj.name
}

util.exitList = function () {
  const list = []
  for (const exit of lang.exit_list) {
    if (game.room.hasExit(exit.name)) {
      list.push(exit.name)
    }
  }
  return list
}
