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



// This is a method to allow the Array.find method to find the player
isPlayer = function(item) {
  return item.player;
};

// Gets the object with the given name (or htmlName name)
// Returns undefined if not found
// Reports failure if reportError is true (useful for debugging)
getObject = function(name, useHtmlName, reportError) {
  var found = data.find(function(el) {
    return (useHtmlName ? el.htmlName : el.name) == name;
  });
  if (!found && reportError) {
    errormsg("Object not found: " + name);
  }
  return found;
};






// Gets the current room object
getCurrentRoom = function() {
  return getObject(player.loc, false);
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
  return data.filter(fn, p);
};


// For dubugging only!!!
_scopeReport = function(o) {
  if (typeof o == "string") {
    o = getObject(o, false, true);
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







// ============  Game Utilities  =======================================


// If the given attribute is a string it is printed, if it is a
// function it is called. Otherwise an error is generated.
msgOrRun = function(item, attname, isMultiple) {
  if (typeof item[attname] == "string") {
    msg(prefix(item, isMultiple) + item[attname]);
    return true;
  }
  else if (typeof item[attname] === "function"){
    return item[attname](item, isMultiple);
  }
  else {
    errormsg(ERR_GAME_BUG, ERROR_MSG_OR_RUN);
    return false;
  }
};


// Sets the current room to the one named
setRoom = function(roomName, suppressOutput) {
  room = getObject(roomName);
  if (room === undefined) {
    errormsg(ERR_GAME_BUG, ERROR_NO_ROOM + ": " + roomName + ".");
    return false;
  }
  //clearScreen();
  player.loc = room.name;
  setBackground();
  if (!suppressOutput) {
    heading(4, room.name);
    msgOrRun(room, "examine");
  }
  updateUIItems();
  return true;
};



// Must be called before the game starts to perform various housekeeping jobs
init = function() {
  // Sort out the player
  player = data.find(isPlayer);
  if (typeof player == "undefined") {
    errormsg(ERR_GAME_BUG, ERROR_NO_PLAYER);
  }
  
  // Create a background item if it does not exist
  background = getObject("background");
  if (background == undefined) {
    background = createItem("background", [{
      loc:'Ubiquitous',
      display:'invisible',
      examine:DEFAULT_DESCRIPTION,
      background:true,
    }]);
    data.push(background);
  }
  if (!background.background) {
      errormsg(ERR_GAME_BUG, ERROR_INIT_BACKGROUND);
  }

  // Go through each item
  data.forEach(function (el) {
    initItem(el);
  });
  
  // Go through each command
  parser.initCommands(EXITS);
  
  // Set up the UI
  endTurnUI();
  heading(2, TITLE);
  document.title = TITLE;
};



// Every item or room should have this called for them.
// That will be done at the start, but you need to do it yourself 
// if creating items on the fly.
initItem = function(item) {
  if (PRE_RELEASE) {
    var l = data.filter(function(el) {
      return el.name == item.name;
    });      
    if (l.length > 1) {
      errormsg(ERR_GAME_BUG, ERROR_INIT_REPEATED_NAME(item));
      return false;
    }
  }
  
  // Give every object an alias and list alias (used in the inventories)
  if (!item.alias) {
    item.alias = item.name;
  }
  if (!item.listalias) {
    item.listalias = sentenceCase(item.alias);
  }
  
  // Give every object a unique htmlName
  var htmlName = item.name.replace(/\W/g, "");
  while (o = getObject(htmlName, true)) {
    md = /(\d+)$/.exec(htmlName);
    if (md) {
      count = parseInt(md[0]) + 1;
      htmlName = htmlName.replace(/(\d+)$/, "" + count);
    }
    else {
      htmlName += "0";
    }
  }
  item.htmlName = htmlName;
  
  // Sort out the location
  if (item.loc == "Held") {
    item.loc = player.name;
  }
  else if (item.loc == "Worn") {
    item.loc = player.name;
    item.worn = true;
  }
  if (PRE_RELEASE) {
    if (item.loc && !getObject(item.loc) && item.loc != "Ubiquitous") {
      errormsg(ERR_GAME_BUG, ERROR_INIT_UNKNOWN_LOC(item));
    }
    for (var i = 0; i < EXITS.length; i++) {
      var ex = item[EXITS[i].name];
      if (typeof ex == "string") {
        if (!getObject(ex)) {
          errormsg(ERR_GAME_BUG, ERROR_INIT_UNKNOWN_EXIT(EXITS[i].name, item, ex));
        }
      }
      if (typeof ex == "object") {
        if (!getObject(ex.name)) {
          errormsg(ERR_GAME_BUG, ERROR_INIT_UNKNOWN_EXIT(EXITS[i].name, item, ex.name));
        }
      }
    }
  }
};



// Call after the player takes a turn, sending it a result, SUCCESS, SUCCESS_NO_TURNSCRIPTS or FAILED
// If you want ten turns to pass you would be better calling runTurnScripts directly
endTurn = function(result) {
  if (result == SUCCESS) {
    runTurnScripts();
  }
  endTurnUI();
};


// Runs turnscipts
// Turnscripts are just objects in the data array with a "turnscript" attribute set to a function
// and a Boolean "runTurnscript".
runTurnScripts = function() {
  for (var i = 0; i < data.length; i++) {
    if (typeof data[i]["turnscript"] === "function"){
      if (((("loc" in data[i]) && IsPresent(data[i])) || !("loc" in data[i])) && data[i].runTurnscript) {
        data[i]["turnscript"]();
      }
    }
  }
};


// Call this when entering a new room
// It will set the alt names of the Ubiquitous background object
// to any objects highlighted in the room description.

const BACK_REGEX = /\[.+?\]/;
setBackground = function() {
  room = getObject(player.loc);
  background = getObject("background");
  background.alt = [];
  if (typeof room.examine == 'string') {
    if (!room.backgroundNames) {
      room.backgroundNames = [];
      while (md = BACK_REGEX.exec(room.examine)) {
        var arr = md[0].substring(1, md[0].length - 1).split(":");
        room.examine = room.examine.replace(md[0], arr[0]);
        for (var j = 0; j < arr.length; j++) {
          room.backgroundNames.push(arr[j]);
        }
      }
    }
    background.alt = room.backgroundNames;
  }
}



function Exit(name, hash) {
  this.name = name;
  this.use = function(self) {
    if ('msg' in self) {
      msg(self.msg);
    }
    setRoom(self.name);
  }
  for (var key in hash) {
    item[key] = hash[key];
  }
}
