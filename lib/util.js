"use strict";

// ============  Utilities  =================================

// Should all be language neutral


// A command should return one of these
// (but a verb will return true or false, so the command that uses it
// can in turn return one of these - a verb is an attribute of an object)

const SUCCESS = 1;                                  
const SUCCESS_NO_TURNSCRIPTS = 2;
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
// Item exists here, but not accessible (inc turnscripts)
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

var test = {};
test.testing = false;

// ============  Random Utilities  =======================================

// Returns a random number from 1 to n
function randomInt(n) {
  return Math.floor(Math.random() * n);
}

// Returns true percentile out of 100 times, false otherwise
function randomChance(percentile) {
  return randomInt(100) <= percentile;
}



// ============  String Utilities  =======================================

// Returns the string with the first letter capitalised
function sentenceCase(str) {
  return str.replace(/[a-z]/i, function (letter) {
    return letter.toUpperCase();
  }).trim();
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


// 

function formatList(itemArray, options) {
  if (options === undefined) { options = {}; }

  if (itemArray.length === 0) {
    return options.nothing ? options.nothing : "";
  }

  if (!options.sep) { options.sep = ", "; }
  if (!options.lastJoiner) { options.lastJoiner = options.sep; }
  
  var l = itemArray.map(function(el) {
    return (typeof el === "string") ? el : el.byname(options);
  });
  var s = "";
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
    errormsg (ERR_GAME_BUG, ERR_ROMAN_NUMBERS_ONLY);
    return number;
  }

  var result = "";
  var a, r;
  for (var i = 0; i < 13; i++) {
    while (number >= arabic[i]) {
      result = result + roman[i];
      number = number - arabic[i];
    }
  }
  return result;
}


// ============  Scope Utilities  =======================================











 

function scope(fn, options) {
  var list = [];
  for (var key in w) {
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
// ... but not in a container
function isHeldNotWorn(item) {
  return item.isAtLoc(game.player.name) && world.ifNotDark(item) && !item.worn;
}
function isHeld(item) {
  return item.isAtLoc(game.player.name) && world.ifNotDark(item);
}
function isHeldByNpc(item) {
  if (!item.loc) { return false; }
  return w[item.loc].npc;
}
function isHere(item) {
  return item.isAtLoc(game.player.loc) && world.ifNotDark(item);
}
function isNpcHere(item) {
  return (item.isAtLoc(game.player.loc) && world.ifNotDark(item)) || item.canTalkToPlayer();
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

function isLiquid(item, options) {
  return item.isAtLoc(options.npc.name) && item.liquid;
}




function findSource(item, sourceLoc) {
  if (item.isAtLoc(sourceLoc)) {
    return sourceLoc;
  }
  var l = scope(isInside, {container:w[sourceLoc]});
  for (var i = 0; i < l.length; i++) {
    if (l[i].player) { continue; }
    sourceLoc = findSource(item, l[i].name);
    if (sourceLoc) { return sourceLoc; }
  }
  return false;
}


function getOuterWearable(char, slot) {
  var clothing = scope(isWornBy, {npc:char}).filter(function(el) { return el.slots.includes(slot); });
  if (clothing.length === 0) { return false; }
  var outer = clothing[0];
  for (var i = 1; i < clothing.length; i++) {
    if (clothing[i].layer > outer.layer) {
      outer = clothing[i];
    }
  }
  return outer;
}
  

  
function setFromHash(obj, hash) {
  for (var key in hash) {
    obj[key] = hash[key];
  }
}




// attributes for events
// script           A function to run
// period           An optional integer, it will repeat every so many turns 
// condition        The event will only fire if this is true
// count             It will trigger after this many turns
// active            The state of the


const events = {
  eventQueue:{},
  runEvents:function() {
    for (var key in this.eventQueue) {
      if (this.eventQueue[key].turnCount <= game.turnCount && this.eventQueue[key].active && (!this.eventQueue[key].condition || this.eventQueue[key].condition())) {
        this.eventQueue[key].script();
        if (this.eventQueue[key].period) {
          this.eventQueue[key].turnCount += this.eventQueue[key].period;
        }
        else {
          this.eventQueue[key].active = false;
        }
      }
    }
  },
  add:function(name, ev) {
    if (world.isCreated && !SAVE_DISABLED) {
      errormsg(ERR_GAME_BUG, ERROR_USING_CREATE_OBJECT(name));
      return;
    }
    if (ev.count === undefined) errormsg("No count given for event: " + name);
    if (ev.active) ev.turnCount = ev.count + 1;
    ev.name = name;
    this.eventQueue[name] = ev;
  },
  start:function(name) {
    debugmsg("Starting..." + name);
    var ev = this.eventQueue[name];
    debugmsg("ev.name..." + ev.name);
    debugmsg("ev.count..." + ev.count);
    debugmsg("game.turnCount..." + game.turnCount);
    ev.active = true;
    ev.turnCount = ev.count + game.turnCount + 1;
    debugmsg("Trigger turn: " + ev.turnCount);
  },
};

