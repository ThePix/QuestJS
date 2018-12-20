

// Use this to create a new item (as opposed to a room).
// It adds various defaults that apply only to items
createItem = function (name, listOfHashes) {
  listOfHashes.unshift(DEFAULT_ITEM);
  return createObject(name, listOfHashes);
}

// Use this to create a new item (as opposed to a room).
// It adds various defaults that apply only to items
createRoom = function (name, listOfHashes) {
  listOfHashes.unshift(DEFAULT_ROOM);
  return createObject(name, listOfHashes);
}


createObject = function (name, listOfHashes) {
  if (/\W/.test(name)) {
    errormsg(ERR_GAME_BUG, ERROR_INIT_DISALLOWED_NAME(name));
    return null;
  }
  if (getObject(name)) {
    errormsg(ERR_GAME_BUG, ERROR_INIT_REPEATED_NAME(name));
    return null;
  }
  item = {};
  item.name = name;
  for (var i = 0; i < listOfHashes.length; i++) {
    for (var key in listOfHashes[i]) {
      item[key] = listOfHashes[i][key];
    }
    resolveVerbs(item);
  }
  
  // Give every object an alias and list alias (used in the inventories)
  if (!item.alias) {
    item.alias = item.name;
  }
  if (!item.listalias) {
    item.listalias = sentenceCase(item.alias);
  }
  if (!item.alt) {
    item.alt = [];
  }
  
  // Sort out the location
  if (item.loc == "Held") {
    item.loc = player.name;
  }
  else if (item.loc == "Worn") {
    item.loc = player.name;
    item.worn = true;
  }
  else if (item.loc == "Here") {
    item.loc = player.loc;
    item.worn = true;
  }
  
  if (world.isCreated) {
    initItem(item);
  }
  
  world.data.push(item);
  return item;
};



// Sort out inventory verb lists

resolveVerbs = function(item) {
  for (var i = 0; i < INVENTORIES.length; i++) {
    var att = INVENTORIES[i].verbs;
    var attX = att + "X";
    if (item[attX]) {
      if (!item[att]) {
        errormsg(ERR_GAME_BUG, "Attempting to add to a verb list that does not exist for " + item.name + " (" + attX + ")"); 
      }
      else if (item[att].constructor !== Array) {
        errormsg(ERR_GAME_BUG, "Attempting to add to a verb list, but original is not array for " + item.name + " (" + attX + ")"); 
      }
      else if (item[attX].constructor !== Array) {
        errormsg(ERR_GAME_BUG, "Attempting to add to a verb list, but addition is not array for " + item.name + " (" + attX + ")"); 
      }
      else {
        item[att].push.apply(item[att], item[attX]);
        delete item[attX];
      }
    }
  }
}




getPlayer = function() {
  return world.data.find(function(item) {
    return item.player;
  });
};


// Gets the object with the given name
// Returns undefined if not found
// Reports failure if reportError is true (useful for debugging)
getObject = function(name, reportError) {
  var found = world.data.find(function(el) {
    return el.name == name;
  });
  if (!found && reportError) {
    errormsg("Object not found: " + name);
  }
  return found;
};

var world = {};
world.data = [];
world.isCreated = false;



world.init = function() {
  this.data.forEach(function (el) {
    world.initItem(el);
  });
  this.isCreated = true;
}



// Every item or room should have this called for them.
// That will be done at the start, but you need to do it yourself 
// if creating items on the fly.
world.initItem = function(item) {
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


// Runs turnscipts
// Turnscripts are just objects in the world.data array with a "turnscript" attribute set to a function
// and a Boolean "runTurnscript".
world.runTurnScripts = function() {
  for (var i = 0; i < this.data.length; i++) {
    var item = this.data[i];
    if (typeof item.turnscript === "function"){
      if (((("loc" in item) && IsPresent(item)) || !("loc" in item)) && item.runTurnscript) {
        item.turnscript();
      }
    }
  }
};





// Sets the current room to the one named
setRoom = function(roomName, suppressOutput) {
  if (player.loc == roomName && player.hasAlreadyBeenSetup) {
    // Already here, do nothing
    return false;
  }
  room = getObject(roomName);
  if (room === undefined) {
    errormsg(ERR_GAME_BUG, ERROR_NO_ROOM + ": " + roomName + ".");
    return false;
  }
  //clearScreen();
  var oldRoom = getObject(player.loc);
  
  player.loc = room.name;
  setBackground();
  if (!suppressOutput) {
    if (player.hasAlreadyBeenSetup) oldRoom.onExit();
    room.beforeEnter();
    if (room.visited == 0) { room.beforeEnterFirst(); }
    heading(4, room.name);
    msgOrRun(room, "examine");
    room.afterEnter();
    if (room.visited == 0) { room.afterEnterFirst(); }
    room.visited += 1;
  }
  player.hasAlreadyBeenSetup = true;
  updateUIItems();
  return true;
};



// Must be called before the game starts to perform various housekeeping jobs
init = function() {
  // Sort out the player
  player = getPlayer();
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
  }
  if (!background.background) {
      errormsg(ERR_GAME_BUG, ERROR_INIT_BACKGROUND);
  }

  // Go through each item
  world.init();
  
  // Go through each command
  parser.initCommands(EXITS);
  
  // Set up the UI
  endTurnUI();
  heading(2, TITLE);
  document.title = TITLE;
};







// Call after the player takes a turn, sending it a result, SUCCESS, SUCCESS_NO_TURNSCRIPTS or FAILED
// If you want ten turns to pass you would be better calling runTurnScripts directly
endTurn = function(result) {
  if (result == SUCCESS) {
    world.runTurnScripts();
  }
  endTurnUI();
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


hasExit = function(room, dir) {
  if (!room[dir]) { return false; }
  var ex = room[dir];
  if (typeof ex !== "object") { return true; }
  return !ex.hidden;
}


// Lock or unlock the exit indicated
// Returns false if the exit does not exist or is not an Exit object
// Returns true if successful
setExitLock = function(room, dir, locked) {
  if (!room[dir]) { return false; }
  var ex = room[dir];
  if (typeof ex !== "object") { return false; }
  ex.locked = locked;
  return true;  
}

// Lock or unlock the exit indicated
// Returns false if the exit does not exist or is not an Exit object
// Returns true if successful
setExitNonexistent = function(room, dir, hidden) {
  if (!room[dir]) { return false; }
  var ex = room[dir];
  if (typeof ex !== "object") { return false; }
  ex.hidden = hidden;
  return true;  
}

function Exit(name, hash) {
  this.name = name;
  this.use = function(exit, dir) {
    if (exit.locked) {
      if (exit.lockedmsg) {
        msg(exit.lockedmsg);
      }
      else {
        msg(CMD_LOCKED_EXIT);
      }
      return false;
    }
    else {
      if (exit.msg) {
        msg(exit.msg);
      }
      setRoom(exit.name);
      return true;
    }
  }
  for (var key in hash) {
    this[key] = hash[key];
  }
}
