// ============  Utilities  =======================================

// Should all be language neutral

// Stores the current player object
var player;



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



// ============  Object Utilities  =======================================


// This is a method to allow the Array.find method to find the player
isPlayer = function(item) {
  return item.player;
};

// Gets the object with the given name (or htmlName name)
getObject = function(name, useHtmlName) {
  var found = data.find(function(el, useHtmlName) {
    return (useHtmlName ? el.htmlName : el.name) == name;
  });
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






// ============  Scope Utilities  =======================================

// Scope functions
isPresent = function(item) {
  return item.loc == player.loc || item.loc == player.name;
};
isHeldOrWorn = function(item) {
  return item.loc == player.name;
};
isHeld = function(item) {
  return (item.loc == player.name) && !item.worn;
};
isHere = function(item) {
  return (item.loc == player.loc);
};
isWorn = function(item) {
  return (item.loc == player.name) && item.worn;
};

isNotNotHere = function(item) {
  return item.display != "not here";
};

// To use, do something like this:
// var listOfOjects = scope(isHeld);
scope = function(fn) {
  return data.filter(isNotNotHere).filter(fn);
};





// ============  Debugging Utilities  =======================================

// Lists the properties of the given object
// Useful for debugging only
listProperties = function(obj) {
  return Object.keys(obj).join(", ");
};






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
    errormsg(ERR_GAME_BUG, CMD_MSG_OR_RUN_ERROR);
    return false;
  }
};


// Sets the current room to the one named
setRoom = function(roomName) {
  room = getObject(roomName);
  if (room === undefined) {
    errormsg(ERR_GAME_BUG, CMD_FAILED_TO_FIND_ROOM + ": " + roomName + ".");
    return false;
  }
  //clearScreen();
  player.loc = room.name;
  heading(4, room.name);
  msgOrRun(room, "examine");
  updateUIItems();
  return true;
};



// Must be called before the ame starts to perform varius housekeeping jobs
init = function() {
  player = data.find(isPlayer);
  if (typeof player == "undefined") {
    errormsg(ERR_GAME_BUG, "No player object found. This will not go well...");
  }
  currentRoom = getObject(player.loc);
  if (typeof currentRoom == "undefined") {
    errormsg(ERR_GAME_BUG, "No room object found (looking for '" + player.loc + "'). This will not go well...");
  }
  data.forEach(function (el) {
    if (!el.alias) {
      el.alias = el.name;
    }
    el.htmlName = el.name.replace(/\W/g, "");
    // TODO: Make htmlName unique
    if (el.loc == "Held") {
      el.loc = player.name;
    }
    else if (el.loc == "Worn") {
      el.loc = player.name;
      el.worn = true;
    }
  });
  parser.initCommands(exits);
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
// Turnscripts are just objects in the data array with a "run" attribute set to a function.
runTurnScripts = function() {
  for (var i = 0; i < data.length; i++) {
    if (typeof data[i]["run"] === "function"){
      if (((("loc" in data[i]) && IsPresent(data[i])) || !("loc" in data[i])) && data[i].runTurnscript) {
        data[i]["run"]();
      }
    }
  }
};