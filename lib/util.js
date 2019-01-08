"use strict";

// ============  Utilities  =================================

// Should all be language neutral


const SUCCESS = 1;
const SUCCESS_NO_TURNSCRIPTS = 2;
const FAILED = -1;

const BRIEF = 1;
const TERSE = 2;
const VERBOSE = 3;

const TEXT_COLOUR = $(".sidepanes").css("color");

// A bug in Quest I need to sort out
const ERR_QUEST_BUG = 21;
// A bug in the game the creator needs to sort out
const ERR_GAME_BUG = 22;
// Player is typing something unintelligible
const ERR_PARSER = 23;
// Player is typing something not allowed
const ERR_PLAYER = 24;
const ERR_TP = 25;
const ERR_SAVE_LOAD = 26;

// Debug message from the parser
const DBG_PARSER = 21;
// Debug message from util
const DBG_UTIL = 22;
// Debug message from test
const DBG_TEST = 22;

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
// article:    used by byname, "the" or "a", defaults to none
// sep:        separator (defaults to comma)
// lastJoiner: separator for last two items (just separator if not provided)
// modified:   item aliases modified (see byname) (defaults to false)
// nothing:    return this if the list is empty (defaults to empty string)


// 

function formatList(itemArray, options) {
  if (itemArray.length === 0) {
    return options.nothing ? options.nothing : "";
  }

  if (options === undefined) { options = {}; }
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
};



const arabic = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
const roman = "M;CM;D;CD;C;XC;L;XL;X;IX;V;IV;I".split(";");


function toRoman(number) {
  if (!typeof number == "number") {
    errormsg ("toRoman can only handle numbers");
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





// This set is used in the world model
// The "if" functions are filters for narrowing down the entire
// setof accessible objects

// Returns true if the item is not worn
function ifNotWorn(item) { return !item.worn; }
// Returns true if the item is worn (does not check who by)
function ifWorn(item) { return item.worn; }
// Returns true if the item is not an NPC
function ifNotNpc(item) { return !item.npc; }
// Returns true if the item is not the player
function ifNotPlayer(item) { return item !== game.player; }
// Returns true if the item is in a container that is either open
// (or not in a container)
// NB If the author puts an item in an item that is not a container, it will be found!!!
function ifNotClosed(item) {
  var cont = w[item.loc];
  if (!cont) { return true; }
  if (!cont.container) { return true; }
  return !cont.closed; 
}
// Returns true if the item is in a container that is either open or transparent
// (or not in a container)
// NB If the author puts an item in an item that is not a container, it will be found!!!
function ifTransparent(item) {
  var cont = w[item.loc];
  if (!cont) { return true; }
  if (!cont.container) { return true; }
  return (!cont.closed || cont.transparent); 
}
// Returns true if the item is not held or worn by an NPC
function ifNotWithNpc(item) {
  var cont = w[item.loc];
  if (!cont) { return true; }
  return !cont.npc; 
}

// Returns true as long as the item is not scenery (or less)
function ifNotScenery(item) { return (item.display > DSPY_SCENERY); }

// Returns true if bad lighting is not obscuring the item
function ifNotDark(item) { return (!game.dark || item.lightSource() > LIGHT_NONE); }







 

function scope(fn, options) {
  var list = [];
  for (var key in w) {
    if (fn(w[key], options)) {
      list.push(w[key]);
    }
  }
  return list;
}







function scopeSnapshot() {
  // reset every object
  for (var key in w) {
    delete w[key].scopeStatus;
    delete w[key].scopeStatusForRoom;
  }

  // find topmost room
  // TODO needs to be selective, if isBlocking
  var room = w[game.player.loc];
  room.scopeStatusForRoom = REACHABLE;
  while (room.loc && room.canReachThrough()) {
    room = w[room.loc];
    room.scopeStatusForRoom = REACHABLE;
  }
  // room is now the top level applicable
  //debugmsg("scope room: " + room.name);

  room.scopeSnapshot(false);
  
  // Also want to go further upwards if room is transparent
  while (room.loc && room.canSeeThrough()) {
    room = w[room.loc];
    room.scopeStatusForRoom = VISIBLE;
  }
  // room is now the top level applicable
  //debugmsg("scope room: " + room.name);

  room.scopeSnapshot(true);
}

// All these must have just done scopeSnapshot for this to be reliable






// This set is used in the objects attribute of commands
// The "is" functions are for looking at a specific place

// Anywhere in the world
function isInWorld(item) {
  return true;
}// Anywhere in the world
function isReachable(item) {
  return item.scopeStatus === REACHABLE && ifNotDark(item);
}// Anywhere in the world
function isVisible(item) {
  return item.scopeStatus && ifNotDark(item);
}
// Held or here, but not in a container
function isPresent(item) {
  return isHereListed(item) || isHeld(item);
}
// ... but not in a container
function isHeldNotWorn(item) {
  return item.isAtLoc(game.player.name) && ifNotDark(item) && !item.worn;
}
function isHeld(item) {
  return item.isAtLoc(game.player.name) && ifNotDark(item);
}
function isHeldByNpc(item) {
  if (!item.loc) { return false; }
  return w[item.loc].npc;
}
function isHere(item) {
  return item.isAtLoc(game.player.loc) && ifNotDark(item);
}
function isHereListed(item) {
  return item.isAtLoc(game.player.loc) && ifNotDark(item) && ifNotScenery(item);
}
function isWorn(item) {
  return item.isAtLoc(game.player.name) && ifNotDark(item) && item.worn;
}

function isInside(item, options) {
  return item.isAtLoc(options.container.name) && ifNotDark(item) && ifNotScenery(item);
}



