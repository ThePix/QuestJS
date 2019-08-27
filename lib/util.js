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


// Item accessible and in lists and inventories
const DSPY_DISPLAY = 10;
// Item accessible and in inventories, but not lists
const DSPY_LIST_EXCLUDE = 9;
// Item accessible and in lists, but not inventories
const DSPY_INV_EXCLUDE = 8;
// Item exist and accessible, but not mentioned at all
const DSPY_SCENERY = 5;
// Item exists here, but not accessible (inc turnscripts/events)
const DSPY_HIDDEN = 2;
// Item does not exist yet, but is ready to
const DSPY_NOT_HERE = 1;
// Item no longer exists
const DSPY_DELETED = 0;

const LIGHT_NONE = 0;
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
function randomFromArray(arr) {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
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
  
  const l = itemArray.map(el => {
    if (el === undefined) return "[undefined]";
    if (typeof el === "string") return el;
    if (el.byname) return el.byname(options);
    if (el.name) return el.name;
    return "[" + (typeof el) + "]"
  });
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




// ============  Scope Utilities  =======================================




function scope(fn, options) {
  const list = [];
  for (let key in w) {
    if (fn(w[key], options)) {
      list.push(w[key]);
    }
  }
  return list;
}








// All these must have just done scopeSnapshot for this to be reliable






// This set is used in the objects attribute of commands
// The "is" functions are for looking at a specific place

// Anywhere in the world
function isInWorld(item) {
  return true;
}// Anywhere in the world
function isReachable(item) {
  return item.scopeStatus === REACHABLE && world.ifNotDark(item);
}// Anywhere in the world
function isVisible(item) {
  return item.scopeStatus && world.ifNotDark(item);
}
// Held or here, but not in a container
function isPresent(item) {
  return isHereListed(item) || isHeld(item);
}
// Used by examine, so the player can X ME, even if something called metalhead is here.
function isPresentOrMe(item) {
  return isHereListed(item) || isHeld(item) || item === game.player;
}
// ... but not in a container
function isHeldNotWorn(item) {
  return item.isAtLoc(game.player.name) && world.ifNotDark(item) && !item.worn;
}
function isHeld(item) {
  return item.isAtLoc(game.player.name) && world.ifNotDark(item);
}
function isHeldListed(item) {
  return item.isAtLoc(game.player.name) && world.ifNotDark(item) && world.ifNotScenery(item);
}

function isHeldByNpc(item) {
  const npcs = scope(isReachable).filter(el => el.npc);
  for (let i = 0; i < npcs.length; i++) {
    if (item.isAtLoc(npcs[i].name)) return true;
  }
  return false;
}

function isHere(item) {
  return item.isAtLoc(game.player.loc) && world.ifNotDark(item);
}
function IsNpcOrHere(item) {
  return (item.isAtLoc(game.player.loc) && world.ifNotDark(item)) || item.npc;
}
function IsNpcAndHere(item) {
  return item.isAtLoc(game.player.loc) && item.npc;
}
function isHereListed(item) {
  return item.isAtLoc(game.player.loc) && world.ifNotDark(item) && world.ifNotScenery(item);
}
function isWorn(item) {
  return item.isAtLoc(game.player.name) && world.ifNotDark(item) && item.worn;
}
function isWornBy(item, options) {
  return item.isAtLoc(options.npc.name) && item.worn;
}

function isInside(item, options) {
  return item.isAtLoc(options.container.name) && world.ifNotDark(item) && world.ifNotScenery(item);
}

function isRoom(item) {
  return item.room;
}

function isContained(item) {
  const containers = scope(isReachable).filter(el => el.container);
  for (let i = 0; i < containers.length; i++) {
    if (containers[i].closed) continue;
    if (item.isAtLoc(containers[i].name)) return true;
  }
  return false;
}
function isHereOrContained(item) {
  if (isHere(item)) return true;
  if (isContained(item)) return true;
  return false;
}

function isLiquid(item, options) {
  return item.isAtLoc(options.npc.name) && item.liquid;
}




