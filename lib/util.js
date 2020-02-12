"use strict";

// ============  Utilities  =================================

// Should all be language neutral


// A command should return one of these
// (but a verb will return true or false, so the command that uses it
// can in turn return one of these - a verb is an attribute of an object)

const SUCCESS = 1;                                  
const SUCCESS_NO_TURNSCRIPTS = 2;
const SUPPRESS_ENDTURN = 3
const FAILED = -1;
const PARSER_FAILURE = -2;
const ERROR = -3;

const BRIEF = 1;
const TERSE = 2;
const VERBOSE = 3;

const TEXT_COLOUR = $(".sidepanes").css("color");

// A bug in Quest I need to sort out
const ERR_QUEST_BUG = 21;
// A bug in the game the creator needs to sort out
const ERR_GAME_BUG = 22;
const ERR_TP = 25;
const ERR_SAVE_LOAD = 26;
const ERR_DEBUG_CMD = 27;


const display = {
  ALL:0,
  LOOK:1,
  PARSER:2,
  INVENTORY:3,
  SIDE_PANE:4,
  SCOPING:5,
}  


//const PARSER = 1

const LIGHT_none = 0;
const LIGHT_SELF = 1;
const LIGHT_MEAGRE = 2;
const LIGHT_FULL = 3;
const LIGHT_EXTREME = 4;

const VISIBLE = 1;
const REACHABLE = 2;

const INDEFINITE = 1;
const DEFINITE = 2;

const INFINITY = 9999;
//const INFINITY = {infinity:true};

const NULL_FUNC = function() {};

const test = {};
test.testing = false;




// ============  Random Utilities  =======================================

// Returns a random number from 0 to n1, or n1 to n2, inclusive
function randomInt(n1, n2) {
  if (n2 === undefined) {
    n2 = n1;
    n1 = 0;
  }
  return Math.floor(Math.random() * (n2 - n1 + 1)) + n1;
}

// Returns true 'percentile' times out of 100, false otherwise
function randomChance(percentile) {
  return randomInt(99) < percentile;
}

// Returns a random element from the array, or null if it is empty
// If the second parameter is true, then the selected value is also deleted from the array,
// preventing it from being selected a second time
function randomFromArray(arr, deleteEntry) {
  if (arr.length === 0) return null;
  const index = Math.floor(Math.random() * arr.length);
  const res = arr[index];
  if (deleteEntry) arr.splice(index, 1)
  return res;
}

// Returns a random number based in the standard RPG dice notation
// For example 2d6+3 means roll two six sided dice and add three
// Returns null if the string cannot be interpreted
function diceRoll(dice) {
  if (typeof dice === "number") return dice;
  if (!isNaN(dice)) return parseInt(dice);
  
  const regexMatch = /^(\d*)d(\d+)([\+|\-]\d+)?$/i.exec(dice);
  if (regexMatch === null) return null;
  const number = regexMatch[1] === ""  ? 1 : parseInt(regexMatch[1]);
  const sides = parseInt(regexMatch[2]);
  
  let total = regexMatch[3] === undefined  ? 0 : parseInt(regexMatch[3]);
  for (let i = 0; i < number; i++) {
    total += randomInt(1, sides);
  }
  return total;
}


// ============  String Utilities  =======================================

// Returns the string with the first letter capitalised
function sentenceCase(str) {
  return str.replace(/[a-z]/i, letter => letter.toUpperCase()).trim();
}


function replaceAll(str, regex, replace) {
    return str.replace(regex, replace);
}




// If isMultiple is true, returns the item name
// to be prefixed to the command response
function prefix(item, isMultiple) {
  if (!isMultiple) { return ""; }
  return sentenceCase(item.name) + ": ";
}


// Creates a string from an array. If the array element is a string,
// that is used, if it is an item, its byname is used.
// options:
// article:    used by byname, DEFINITE or INDEFINITE, defaults to none
// sep:        separator (defaults to comma)
// lastJoiner: separator for last two items (just separator if not provided)
// modified:   item aliases modified (see byname) (defaults to false)
// nothing:    return this if the list is empty (defaults to empty string)
function formatList(itemArray, options) {
  if (options === undefined) { options = {}; }

  if (itemArray.length === 0) {
    return options.nothing ? options.nothing : "";
  }

  if (!options.sep) { options.sep = ", "; }
  if (!options.lastJoiner) { options.lastJoiner = options.sep; }
  
  
  if (!options.separateEnsembles) {
    const toRemove = [];
    const toAdd = [];
    for (let item of itemArray) {
      if (item.ensembleMaster && item.ensembleMaster.isAllTogether()) {
        toRemove.push(item);
        if (!toAdd.includes(item.ensembleMaster)) toAdd.push(item.ensembleMaster);
      }
    }
    itemArray = arraySubtract(itemArray, toRemove);
    itemArray = itemArray.concat(toAdd);
  }
  
  // sort the list alphabetically on name
  if (!options.doNotSort) {
    itemArray.sort(function(a, b){
      if (a.name) a = a.name;
      if (b.name) b = b.name;
      return a.localeCompare(b)
    });
  }
  //console.log(itemArray)
  const l = itemArray.map(el => {
    if (el === undefined) return "[undefined]";
    if (typeof el === "string") return el;
    if (el.byname) return el.byname(options);
    if (el.name) return el.name;
    return "[" + (typeof el) + "]"
  });
  //console.log(l)
  let s = "";
  do {
  s += l.shift();
  if (l.length === 1) { s += options.lastJoiner; }
  if (l.length > 1) { s += options.sep; }
  } while (l.length > 0);
  
  return s;
}


// Lists the properties of the given object
// Useful for debugging only
// To inspect an object use JSON.stringify(obj)
function listProperties(obj) {
  return Object.keys(obj).join(", ");
}



const arabic = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
const roman = "M;CM;D;CD;C;XC;L;XL;X;IX;V;IV;I".split(";");


function toRoman(number) {
  if (typeof number !== "number") {
    errormsg ("toRoman can only handle numbers");
    return number;
  }

  let result = "";
  //var a, r;
  for (let i = 0; i < 13; i++) {
    while (number >= arabic[i]) {
      result = result + roman[i];
      number = number - arabic[i];
    }
  }
  return result;
}



function getDateTime() {
  const time = new Date(game.elapsedTime * 1000 + game.startTime.getTime());
  //console.log(time);
  return time.toLocaleString(DATE_TIME_LOCALE, DATE_TIME_OPTIONS);
}




function displayMoney(n) {
  // Returns the given number formatted according to MONEY_FORMAT
  if (typeof MONEY_FORMAT === "undefined") {
    errormsg ("No format for money set (set MONEY_FORMAT in setting.js).");
    return "" + n;
  }
  const ary = MONEY_FORMAT.split("!");
  if (ary.length === 2) {
    return MONEY_FORMAT.replace("!", "" + n);
  }
  else if (ary.length === 3) {
    const negative = (n < 0)
    n = Math.abs(n);
    let options = ary[1]
    const showsign = options.startsWith("+")
    if (showsign) {
      options = options.substring(1);
    }
    let number = displayNumber(n, options)
    if (negative) {
      number = "-" + number;
    }
    else if (n !== 0 && showsign) {
      number = "+" + number;
    }
    return (ary[0] + number + ary[2]);
  }
  else if (ary.length === 4) {
    const options = n < 0 ? ary[2] : ary[1];
    return ary[0] + displayNumber(n, options) + ary[3];
  }
  else {
    errormsg ("MONEY_FORMAT in setting.js expected to have either 1, 2 or 3 exclamation marks.")
    return "" + n;
  }
}


// Suppose this is sent 1234, "(3,2)"...

function displayNumber(n, control) {
  n = Math.abs(n);  // must be positive
  const regex = /^(\D*)(\d+)(\D)(\d*)(\D*)$/;
  if (!regex.test(control)) {
    errormsg ("Unexpected format in displayNumber (" + control + "). Should be a number, followed by a single character separator, followed by a number.");
    return "" + n;
  }
  const options = regex.exec(control);
  const places = parseInt(options[4]);                      // eg 2
  let padding = parseInt(options[2]);             // eg 3
  if (places > 0) {
    // We want a decimal point, so the padding, the total length, needs that plus the places
    padding = padding + 1 + places;               // eg 6
  }
  const factor = Math.pow (10, places)            // eg 100
  const base = (n / factor).toFixed(places);      // eg "12.34"
  const decimal = base.replace(".", options[3])   // eg "12,34"
  return (options[1] + decimal.padStart(padding, "0") + options[5])   // eg "(012,34)"
}


// Should convert the string (what the player typed) to the actual direction, used as an attribute
function getDir(s) {
  for (let exit of lang.exit_list) {
    if (exit.nocmd) continue;
    if (exit.name === s) return exit.name;
    if (exit.abbrev.toLowerCase() === s) return exit.name;
    if (new RegExp("^(" + exit.alt + ")$").test(s)) return exit.name;
  }
  return false;
}






// ============  Scope Utilities  =======================================



function scopeReachable() {
  const list = [];
  for (let key in w) {
    if (w[key].scopeStatus === REACHABLE && world.ifNotDark(w[key])) {
      list.push(w[key]);
    }
  }
  return list;
}

// Can also be used to see what is at the location
function scopeHeldBy(chr) {
  const list = [];
  for (let key in w) {
    if (w[key].isAtLoc(chr)) {
      list.push(w[key]);
    }
  }
  return list;
}

function scopeHereListed() {
  const list = [];
  for (let key in w) {
    if (w[key].isAtLoc(game.player.loc, display.LOOK) && world.ifNotDark(w[key])) {
      list.push(w[key]);
    }
  }
  return list;
}


const util = {}

// Functions for the side panes lists
util.isHeldNotWorn = function(item) {
  return item.isAtLoc(game.player.name, display.SIDE_PANE) && world.ifNotDark(item) && !item.getWorn();
}
util.isHere = function(item) {
  return item.isAtLoc(game.player.loc, display.SIDE_PANE) && world.ifNotDark(item);
}

util.isWorn = function(item) {
  return item.isAtLoc(game.player.name, display.SIDE_PANE) && world.ifNotDark(item) && item.getWorn();
}






function respond(params, list, func) {
  //console.log(params)
  //if (!params.action) throw "No action in params"
  //if (!params.actor) throw "No action in params"
  //if (!params.target) throw "No action in params"
  const response = util.findResponse(params, list)
  if (!response) {
    if (func) func(params)
    errormsg("Failed to find a response (F12 for more)")
    console.log("Failed to find a response")
    console.log(params)
    console.log(list)
    return false
  }
  //console.log(response)
  if (response.script) response.script(params)
  if (response.msg) params.actor.msg(response.msg, params)
  if (func) func(params, response)
  return !response.failed
}








function getResponseList(params, list, result) {
  if (!result) result = []
  for (let item of list) {
    if (item.name) {
      params.text = item.name.toLowerCase()
      //console.log("check item: " + item.name)
      if (item.test) {
        if (!result.includes(item.name) && item.test(params)) result.push(item.name)
      }
      else {
        if (!result.includes(item.name)) result.push(item.name)
      }
      //console.log("item is good: " + item.name)
    }
    if (item.responses) result = getResponseList(params, item.responses, result)
    //console.log("done")
  }
  return result
}

util.findResponse = function(params, list) {
  for (let item of list) {
    //console.log("check item: " + item.name)
    if (item.test && !item.test(params)) continue
    //console.log("item is good: " + item.name)
    if (item.responses) return util.findResponse(params, item.responses)
    //console.log("done")
    return item
  }
  return false
}
  
util.addResponse = function(route, data, list) {
  util.addResponseToList(route, data, list)
}

util.addResponseToList = function(route, data, list) {
  const sublist = util.getResponseSubList(route, list)
  sublist.unshift(data)
}

util.getResponseSubList = function(route, list) {
  const s = route.shift()
  if (s) {
    const sublist = list.find(el => el.name === s)
    if (!sublist) throw "Failed to add sub-list with " + s
    return util.getResponseSubList(route, sublist.responses)
  }
  else {
    return list
  }
}

util.verifyResponses = function(list) {
  //  console.log(list)
  
  if (list[list.length - 1].test) {
    console.log("WARNING: Last entry has a test condition:")
    console.log(list)
  }
  for (let item of list) {
    if (item.responses) {
      //console.log(item.name)
      if (item.responses.length === 0) {
        console.log("Zero responses for: " + item.name)
      }
      else {
        util.verifyResponses(item.responses)
      }
    }
  }
}



util.listContents = function(contents) {
  return formatList(this.getContents(), {article:INDEFINITE, lastJoiner:lang.list_and, modified:true, nothing:lang.list_nothing, loc:this.name});
}

util.niceDirections = function(dir) {
  const dirObj = lang.exit_list.find(function(el) { return el.name === dir; });
  return dirObj.niceDir ? dirObj.niceDir : dirObj.name;
}
    



util.exitList = function() {
  const list = [];
  for (let exit of lang.exit_list) {
    if (game.room.hasExit(exit.name)) {
      list.push(exit.name);
    }
  }
  return list;
}









// assumes a and b both arrays
// unit tested
function arraySubtract(a, b) {
  const res = []
  for (let i = 0; i < a.length; i++) {
    if (!b.includes(a[i])) res.push(a[i]);
  }
  return res;
}

// assumes a is an array
// unit tested
function arrayCompare(a, b) {
  if (!Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (b[i] !== a[i]) return false;
  }
  return true;
}