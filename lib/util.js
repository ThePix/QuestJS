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

const NULL_FUNC = function() {};

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



const numberUnits = "zero;one;two;three;four;five;six;seven;eight;nine;ten;eleven;twelve;thirteen;fourteen;fifteen;sixteen;seventeen;eighteen;nineteen;twenty".split(";");
const numberTens = "twenty;thirty;forty;fifty;sixty;seventy;eighty;ninety".split(";");


function toWords(number) {
  if (!typeof number == "number") {
    errormsg ("toWords can only handle numbers");
    return number;
  }
  
  var s = "";
  if (number < 0) {
    s = "minus ";
    number = -number;
  }
  if (number < 2000) {
    var hundreds = Math.floor(number / 100);
    number = number % 100;
    if (hundreds > 0) {
      s = s + numberUnits[hundreds] + " hundred ";
      if (number > 0) {
        s = s + "and ";
      }
    }
    if (number < 20) {
      if (number !== 0 || s === "") {
        s = s + numberUnits[number];
      }
    }
    else {
      var units = number % 10;
      var tens = Math.floor(number / 10) % 10;
      s = s + numberTens[tens - 2];
      if (units !== 0) {
        s = s + numberUnits[units];
      }
    }
  }
  else {
    s = "" + number;
  }
  return (s);
}

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


// This set is used in the objects attribute of commands
// The "is" functions are for looking at a specific place

// Anywhere in the world
function isInWorld(item) {
  return true;
}
// Held or here, but not in a container
function isPresent(item) {
  return (isHere(item, [ifNotDark, ifNotScenery]) || isHeld(item, [ifNotDark, ifNotScenery]));
}
// ... but not in a container
function isHeldNotWorn(item) {
  return item.isAt(game.player.name, [ifNotDark, ifNotWorn]);
}
function isHeld(item) {
  return item.isAt(game.player.name, [ifNotDark]);
}
function isHeldByNpc(item) {
  if (!item.loc) { return false; }
  return w[item.loc].npc;
}
function isHere(item) {
  return item.isAt(game.player.loc, [ifNotDark]);
}
function isHereListed(item) {
  return item.isAt(game.player.loc, [ifNotDark, ifNotScenery]);
}
function isWorn(item) {
  return item.isAt(game.player.name, [ifNotDark, ifWorn]);
}

function isInside(item, options) {
  return item.isAt(options.container.name, [ifNotDark, ifNotScenery]);
}


// This set is used in the world model
// The "if" functions are filters for narrowing down the entire
// setof accessible objects

// Returns true as long as the item is not scenery (or less)
function ifNotScenery(item) { return (item.display > DSPY_SCENERY); }
// Returns true if the item is not worn
function ifNotWorn(item) { return !item.worn; }
// Returns true if the item is worn (does not check who by)
function ifWorn(item) { return item.worn; }
// Returns true if bad lighting is not obscuring the item
function ifNotDark(item) { return (!game.dark || item.lightSource() > LIGHT_NONE); }
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








 

function scope(fns, options) {
  if (typeof fns === "function") { fns = [fns]; }
  var room = w[game.player.loc];
  while (room.testOptions(fns, options) && room.loc) {
    room = w[room.loc];
  }
  // room is now the top level applicable
  var list = [], secList;
  for (var key in w) {
    if (w[key].isAt(room.name, fns, options)) {
      //debugmsg("Adding1: " + w[key].name);
      list.push(w[key]);
    }
  }
  var flag = true, i;
  while (flag) {
    secList = [];
    for (key in w) {
      if (w[key].isAt(list, fns, options)) {
        secList.push(w[key]);
      }
    }
    flag = false;
    for (i = 0; i < secList.length; i++) {
      if (!list.includes(secList[i])) {
        //debugmsg("Adding2: " + w[key].name);
        list.push(secList[i]);
        flag = true;
      }
    }
  }  
  
  return list;
}






// ============  Debugging Utilities  =======================================


var test = {};
test.testing = false;