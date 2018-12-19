// ============  Utilities  =======================================

// Should all be language neutral

// Stores the current player object
var player;


const SUCCESS = 1;
const SUCCESS_NO_TURNSCRIPTS = 2;
const FAILED = -1;

const ERR_QUEST_BUG = 21;   // A bug in Quest I need to sort out
const ERR_GAME_BUG = 22;    // A bug in the game the creator needs to sort out
const ERR_PARSER = 23;      // Player is typing something unintelligible
const ERR_PLAYER = 24;      // Player is typing something not allowed
const DBG_PARSER = 21;      // Debug message from the parser
const DBG_UTIL = 22;        // Debug message from util



// ============  Random Utilities  =======================================

// Returns a random number from 1 to n
randomInt = function(n) {
  return Math.floor(Math.random() * n);
};

// Returns true percentile out of 100 times, false otherwise
randomChance = function(percentile) {
  return randomInt(100) <= percentile;
};



// ============  String Utilities  =======================================

// Returns the string with the first letter capitalised
sentenceCase = function(str) {
  return str.replace(/[a-z]/i, function (letter) {
    return letter.toUpperCase();
  }).trim();
};

// If isMultiple is true, returns the item name to be prefixed to the command response
prefix = function(item, isMultiple) {
  if (!isMultiple) { return ""; }
  return sentenceCase(item.name) + ": ";
}

// Creates a string that lists the items by name
formatList = function(itemArray) {
  var s = itemArray.map(function(el) { return el.name; }).join(", ");

  var lastIndex = s.lastIndexOf(",");
  if (lastIndex === -1) { return s; }

  return s.substring(0, lastIndex) + " and" + s.substring(lastIndex + 1);
};


// Gets an array of strings, extracting each regex match from this string.
String.prototype.scan = function (re) {
  var s = this;
  var m, r = [];
  while (m = re.exec(s)) {
    s = s.replace(m[0], "");
    r.push(m[0]);
  }
  return r;
};








// ============  Object Utilities  =======================================








// Gets the current room object
getCurrentRoom = function() {
  return getObject(player.loc);
};

// Gets the command with the given name
getCommand = function(name) {
  var found = commands.find(function(el) {
    return el.name == name;
  });
  return found;
};


itemNameWithThe = function(item) {
  if (item.properName) {
    return item.name;
  }
  return "the " + item.name;
}




// ============  Scope Utilities  =======================================

// Scope functions
isPresent = function(item) {
  return (isHere(item) || isHeldOrWorn(item)) && item.display != "not here";
};
isHeldOrWorn = function(item) {
  return item.loc == player.name && item.display != "not here";
};
isHeld = function(item) {
  return (item.loc == player.name) && !item.worn && item.display != "not here";
};
isHere = function(item) {
  return item.loc === player.loc && item.display != "not here";
};
isWorn = function(item) {
  return (item.loc == player.name) && item.worn;
};

// Requires an extra parameter, so used like this:
// scope(isInside, container);
isInside = function(item) {
  return item.loc == this.name;
};


// Is the given item in the location named
// or in an open container in that location?
// Includes "Ubiquitous" items, but not "not here" items
isReachable = function(item) {
  if (item.loc == player.loc || item.loc == player.name || item.loc === "Ubiquitous") { return true; }
  if (!item.loc || item.display == "not here") { return false; }
  container = getObject(item.loc);
  if (!container.container) { return false; }
  if (container.closed) { return false; }
  return isVisible(container);
}

// Is the given item in the location named
// or in an open or transparent container in that location?
// Includes "Ubiquitous" items, but not "not here" items
// This is the fallback for the parser scope
isVisible = function(item) {
  if (item.loc == player.loc || item.loc == player.name || item.loc === "Ubiquitous") { return true; }
  if (!item.loc || item.display == "not here") { return false; }
  container = getObject(item.loc);
  if (!container.container) { return false; }
  if (container.closed && !container.transparent) { return false; }
  return isVisible(container);
}

// To use, do something like this:
// var listOfOjects = scope(isHeld);
// Hopefully this works too
// var listOfOjects = scope(isInside, container.loc);
scope = function(fn, p) {
  return world.data.filter(fn, p);
};


// For dubugging only!!!
_scopeReport = function(o) {
  if (typeof o == "string") {
    o = getObject(o, true);
  }
  s = "<b>" + o.name + "</b><br/>";
  s += "held: " + isHeld(o) + "<br/>";
  s += "here: " + isHere(o) + "<br/>";
  s += "held or worn: " + isHeldOrWorn(o) + "<br/>";
  s += "present: " + isPresent(o) + "<br/>";
  s += "reachable here: " + isReachable(o, player.loc) + "<br/>";
  s += "visible here: " + isVisible(o, player.loc) + "<br/>";
  s += "reachable held: " + isReachable(o, player.name) + "<br/>";
  s += "visible held: " + isVisible(o, player.name) + "<br/>";
  debugmsg(DBG_UTIL, s);
}



// ============  Debugging Utilities  =======================================

// Lists the properties of the given object
// Useful for debugging only
listProperties = function(obj) {
  return Object.keys(obj).join(", ");
};


// To inspect an object use JSON.stringify(car)





