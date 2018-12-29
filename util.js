"use strict";

// ============  Utilities  =======================================

// Should all be language neutral


const SUCCESS = 1;
const SUCCESS_NO_TURNSCRIPTS = 2;
const FAILED = -1;

const BRIEF = 1;
const TERSE = 2;
const VERBOSE = 3;


const ERR_QUEST_BUG = 21;   // A bug in Quest I need to sort out
const ERR_GAME_BUG = 22;    // A bug in the game the creator needs to sort out
const ERR_PARSER = 23;      // Player is typing something unintelligible
const ERR_PLAYER = 24;      // Player is typing something not allowed
const ERR_TP = 25;
const ERR_SAVE_LOAD = 26;
const DBG_PARSER = 21;      // Debug message from the parser
const DBG_UTIL = 22;        // Debug message from util

const DSPY_DISPLAY = 10;    // Item accessible and in lists and inventories
const DSPY_LIST_EXCLUDE = 9;// Item accessible and in inventories, but not lists
const DSPY_INV_EXCLUDE = 8; // Item accessible and in lists, but not inventories
const DSPY_SCENERY = 5;     // Item exist and accessible, but not mentioned at all
const DSPY_HIDDEN = 2;      // Item exists here, but not accessible (inc turnscripts)
const DSPY_NOT_HERE = 1;    // Item does not exist yet, but is ready to
const DSPY_DELETED = 0;     // Item no longer exists

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
};

// Returns true percentile out of 100 times, false otherwise
function randomChance(percentile) {
  return randomInt(100) <= percentile;
};



// ============  String Utilities  =======================================

// Returns the string with the first letter capitalised
function sentenceCase(str) {
  return str.replace(/[a-z]/i, function (letter) {
    return letter.toUpperCase();
  }).trim();
};


function replaceAll(str, regex, replace) {
    return str.replace(regex, replace);
}




// If isMultiple is true, returns the item name to be prefixed to the command response
function prefix(item, isMultiple) {
  if (!isMultiple) { return ""; }
  return sentenceCase(item.name) + ": ";
}

// Creates a string from an array. If the array element is a string, that is used,
// if it is an item, its byname is used.
// options:
// def:        used by byname, "the" or "a", defaults to none
// sep:        separator (defaults to comma)
// joiner:     separator for last two items (just separator if not provided)
// modified:   item aliases modified (see byname) (defaults to false)
// nothing:    return this if the list is empty (defaults to empty string)
function formatList(itemArray, options) {
  if (options == undefined) { options = {}; }
  if (itemArray.length == 0) {
    return options.nothing ? options.nothing : "";
  }
  var sep = options.sep ? options.sep + " " : ", ";
  var s = itemArray.map(function(el) {
    return (typeof el == "string") ? el : el.byname(options.def, options.modified);
  }).join(sep);

  if (options.lastJoiner) {
    var lastIndex = s.lastIndexOf(",");
    if (lastIndex === -1) { return s; }
    s = s.substring(0, lastIndex) + options.lastJoiner + s.substring(lastIndex + 1);
  }
  return s;
};



function saveGame(filename, comment) {
  if (filename == undefined) {
    errormsg(ERR_GAME_BUG, "Trying to save with no filename");
    return false;
  }
  if (comment == undefined) { comment = "-"; }
  var s = saveLoad.saveTheWorld(comment);
  localStorage.setItem(TITLE + ": " + filename, s);
  metamsg("Saved");
  return true;
}



function loadGame(filename) {
  var s = localStorage.getItem(TITLE + ": " + filename);
  saveLoad.loadTheWorld(s);
  metamsg("Loaded");
}

function deleteGame(filename) {
  localStorage.removeItem(TITLE + ": " + filename);
  metamsg("Deleted");
}



function dirGame() {
  var s = "<table class=\"meta\"><tr><th>Filename</th><th>Ver</th><th>Timestamp</th><th>Comment</th></tr>";
  $.each(localStorage, function(key, value){
    debugmsg(0, "key=" + key);
    var regex = new RegExp("^" + TITLE + ": ");
    var name = key.replace(regex, "");
    if (regex.test(key)) {
      var dic = saveLoad.getHeader(value);
      s += "<tr><td>" + name + "</td>";
      s += "<td>" + dic.version + "</td>";
      s += "<td>" + dic.timestamp + "</td>";
      s += "<td>" + dic.comment + "</td></tr>";
    }
  });  
  s += "</table>";
  metamsg(s);
  metamsg("Ver is the version of the game that was being played when saved. Loading a save game from a different version may or may not work. You can delete a file with the DEL command.");

}

// Each object is separated by a vertical bar
// Each name-value pair is separated by a semi-colon


var saveLoad = {

  saveTheWorld:function(comment) {
    return saveLoad.getSaveHeader(comment) + saveLoad.getSaveBody();
  },



  loadTheWorld:function(s) {
    var arr = s.split("|");
    arr.splice(0, 4);
    
    for (var i = 0; i < arr.length; i++) {
      var parts = arr[i].split("=");
      var obj = w[parts[0]];
      if (obj == undefined) {
        errormsg(ERR_SAVE_LOAD, "Cannot find object '" + parts[0] + "'");
      }
      else {
        obj.setLoadString(parts[1]);
      }
    }
    game.update();
  },

  getHeader:function(s) {
    var arr = s.split("|");
    return { title:arr[0], version:arr[1], comment:arr[2], timestamp:arr[3] };
  },

  getSaveHeader:function(comment) {
    var currentdate = new Date();
    var s = replaceAll(TITLE, "|", "") + "|";
    s += replaceAll(VERSION, "|", "") + "|";
    s += (comment ? replaceAll(comment, "|", "") : "-") + "|";
    s += currentdate.toLocaleString() + "|";
    return s;
  },

  getSaveBody:function() {
    var s = "";
    for (var key in w) {
      s += key + "=" + w[key].getSaveString() + "|";
    }
    return s;
  },
  
  decode:function(s) {
    if (s == "true") return true;
    if (s == "false") return false;
    if (!/^\"/.test(s)) return parseInt(s);
    return unescape(s);
  },
  
  encode:function(key, value) {
    return key + ":" + saveLoad.escape(value) + ";";
  },

  escape:function(s) {
    if (typeof s != "string") {
      return s;
    }
    s = replaceAll(s, /\{/g, "@@@ocb@@@");
    s = replaceAll(s, /\}/g, "@@@ccb@@@");
    s = replaceAll(s, /\:/g, "@@@cln@@@");
    s = replaceAll(s, /\;/g, "@@@sc@@@");
    s = replaceAll(s, /\"/g, "@@@dq@@@");
    s = replaceAll(s, /\|/g, "@@@vb@@@");
    s = replaceAll(s, /\=/g, "@@@eqs@@@");
    return '"' + s + '"';
  },

  unescape:function(s) {
    s = replaceAll(s, /\"/g, "");
    s = replaceAll(s, /@@@ocb@@@/g, "{");
    s = replaceAll(s, /@@@ccb@@@/g, "}");
    s = replaceAll(s, /@@@cln@@@/g, ":");
    s = replaceAll(s, /@@@sc@@@/g, ";");
    s = replaceAll(s, /@@@dq@@@/g, '"');
    s = replaceAll(s, /@@@vb@@@/g, '|');
    s = replaceAll(s, /@@@eqs@@@/g, '=');
    return '"' + s + '"';
  },
};


// ============  Object Utilities  =======================================







// Gets the command with the given name
function getCommand(name) {
  var found = commands.find(function(el) {
    return el.name == name;
  });
  return found;
};








// ============  Scope Utilities  =======================================

// Anywhere in the world
function isInWorld(item) {
  return true;
};

// Held or here, but not in a container
function isPresent(item) {
  return (isHere(item) || isHeld(item)) && item.display >= DSPY_SCENERY;
};

// ... but not in a container
function isHeldNotWorn(item) {
  return item.isAt(game.player.name) && !item.worn;
};
function isHeld(item) {
  return item.isAt(game.player.name);
};
function isHere(item) {
  return item.isAt(game.player.loc);
};
function isHereListed(item) {
  return item.isAt(game.player.loc) && item.display > DSPY_SCENERY;
};
function isWorn(item) {
  return item.isAt(game.player.name) && item.worn;
};

function isInside(item, options) {
  return item.isAt(options.container.name);
};


// Is the given item in the location named
// or in an open container in that location?
// An item is visible/obvious but not reachable
// if it is in a closed transparent container
// An item is visible but not obvious if it is scenery
function isReachable(item, options) {
  return item.isReachable();
}
function isVisible(item, options) {
  return item.isVisible();
}
function isObvious(item, options) {
  return item.isObvious();
}

// To use, do something like this:
// var listOfOjects = scope(isHeld);
// Hopefully this works too
// var listOfOjects = scope(isInside, container.loc);
function scope(fn, options) {
  var list = [];
  for (var key in w) {
    if (fn(w[key], options)) {
      list.push(w[key]);
    }
  }
  return list;
};


// For dubugging only!!!
function _scopeReport(o) {
  if (typeof o == "string") {
    o = w[o];
  }
  s = "<b>" + o.name + "</b><br/>";
  s += "held: " + isHeld(o) + "<br/>";
  s += "here: " + isHere(o) + "<br/>";
  s += "held or worn: " + isHeldOrWorn(o) + "<br/>";
  s += "reachable here: " + isReachable(o, game.player.loc) + "<br/>";
  s += "visible here: " + isVisible(o, game.player.loc) + "<br/>";
  s += "reachable held: " + isReachable(o, game.player.name) + "<br/>";
  s += "visible held: " + isVisible(o, game.player.name) + "<br/>";
  debugmsg(DBG_UTIL, s);
}


function getChain(item, attName) {
  if (attName == undefined) { attName = "loc"; }
  
  var list = [];
  var current = item;
  while (current[attName]) {
    current = w[current[attName]];
    list.push(current);
  }
  return list;
}

function getBlock(item, visible) {
  var list = getChain(item);
  for (var i = 0; i < list.length; i++) {
    if (list[i] == game.player || list[i].name == game.player.loc) {
      return null;
    }
    if (item.isBlocking(visible)) {
      return item;
    }
  }
  return true;
}


// ============  Debugging Utilities  =======================================

// Lists the properties of the given object
// Useful for debugging only
function listProperties(obj) {
  return Object.keys(obj).join(", ");
};


// To inspect an object use JSON.stringify(car)









function checkCannotSpeak(npc) {
  
  return false;
}