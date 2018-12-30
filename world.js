"use strict";

// Use this to create a new item (as opposed to a room).
// It adds various defaults that apply only to items
function createItem() {
  var args = Array.prototype.slice.call(arguments);
  var name = args.shift()
  args.unshift(DEFAULT_ITEM);
  return createObject(name, args);
}

// Use this to create a new item (as opposed to a room).
// It adds various defaults that apply only to items
function createRoom() {
  var args = Array.prototype.slice.call(arguments);
  var name = args.shift()
  args.unshift(DEFAULT_ROOM);
  return createObject(name, args);
}



// Use this to create new items during play.
function cloneObject(item, loc) {
  var clone = {};
  for (var key in item) {
    clone[key] = item[key];
  }
  clone.name = world.findUniqueName(item.name);
  if (!clone.proto) {
    clone.proto = item;
  }
  if (loc != undefined) {
    clone.loc = loc;
  }
}  



function createObject(name, listOfHashes) {
  if (world.isCreated) {
    errormsg(ERR_GAME_BUG, ERROR_USING_CREATE_OBJECT(name));
    return null;
  }

  if (/\W/.test(name)) {
    errormsg(ERR_GAME_BUG, ERROR_INIT_DISALLOWED_NAME(name));
    return null;
  }
  if (w[name]) {
    errormsg(ERR_GAME_BUG, ERROR_INIT_REPEATED_NAME(name));
    return null;
  }
  var item = {
    name:name,
    byname:function(def) {
      if (def == "the") {
        return _itemThe(this) + this.alias;
      }
      if (def == "a") {
        return _itemA(this) + this.alias;
      }
      return this.alias;
    },
    runTurnscript:function() { return false; },
    
    _isAt:function(loc) {
      // Reachable if Ubiquitous
      if (this.loc == "Ubiquitous") { return true; }
      if (this.loc == loc) { return true; }
      if (this.altLocs && this.altLocs.includes(loc))  { return true; }
      return false;
    },
    
    isAt:function(loc) {
      // Not there if dark
      if (game.dark) { return false; }
      // Not there if flagged as less than scenery
      if (this.display < DSPY_SCENERY) { return false; }
      return this._isAt(loc);
    },
    isReachable:function() {
      // Not reachable if dark
      if (game.dark) { return false; }
      // Not reachable if flagged as less than scenery
      if (this.display < DSPY_SCENERY) { return false; }
      // Not reachable if a container blocks it
      if (getBlock(this, false)) { return false; }
      return true;
    },
    isVisible:function() {
      // Not reachable if dark
      if (game.dark) { return false; }
      // Not reachable if flagged as less than scenery
      if (this.display < DSPY_SCENERY) { return false; }
      // Not reachable if a container blocks it
      if (getBlock(this, true)) { return false; }
      return true;
    },
    isObvious:function() {
      // Not reachable if dark
      if (game.dark) { return false; }
      // Not reachable if flagged as scenery or less
      if (this.display <= DSPY_SCENERY) { return false; }
      // Not reachable if a container blocks it
      if (getBlock(this, true)) { return false; }
      return true;
    },

    getSaveString:function() {
      var s = "";
      for (var key in this) {
        if (typeof this[key] != "function" && typeof this[key] != "object") {
          if (key != "desc" && key != "examine" && key != "name") {
            s += saveLoad.encode(key, this[key]);
          }
          if (key == "desc" && this.mutableDesc) {
            s += saveLoad.encode(key, this[key]);
          }
          if (key == "examine" && this.mutableExamine) {
            s += saveLoad.encode(key, this[key]);
          }
        }
      }
      return s;
    },
    
    setLoadString:function(s) {
      var arr = s.split(";");
      for (var i = 0; i < arr.length; i++) {
        var parts = arr[i].split(":");
        this[parts[0]] = saveLoad.decode(parts[1]);
      }
    },
  };
  //item.name = name;
  for (var i = 0; i < listOfHashes.length; i++) {
    for (var key in listOfHashes[i]) {
      item[key] = listOfHashes[i][key];
    }
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
    item.loc = game.player.name;
  }
  else if (item.loc == "Worn") {
    item.loc = game.player.name;
    item.worn = true;
  }
  else if (item.loc == "Here") {
    item.loc = game.player.loc;
    item.worn = true;
  }
  
  //if (world.isCreated) {
  //  initItem(item);
  //}
  
  //world.data.push(item);
  w[name] = item;
  return item;
};



// We can only save in string format, so functions are not saved
// When retrieving, you need that actual object, and then overwrite
// any attributes that might have changed.
function object2String(object) {
  s = "name: " + object.name;
}
  
function string2Object(string) {
  //obj = getObject(0);
}









var w = {}

var world = {};
world.isCreated = false;



world.findUniqueName = function(s) {
  debugmsg(0, "Trying " + s);
  if (!w[s]) {
    return (s);
  }
  else {
    var res = /(\d+)$/.exec(s);
    if (!res) {
      return world.findUniqueName(s + "0");
    }
    var n = parseInt(res[0]) + 1;
    return world.findUniqueName(s.replace(/(\d+)$/, "" + n));
  }
} 





world.init = function() {
  for (var key in w) {
    world.initItem(w[key]);
  }
  this.isCreated = true;
}



// Every item or room should have this called for them.
// That will be done at the start, but you need to do it yourself 
// if creating items on the fly.
world.initItem = function(item) {
  if (DEBUG) {
    if (item.loc && !w[item.loc] && item.loc != "Ubiquitous") {
      errormsg(ERR_GAME_BUG, ERROR_INIT_UNKNOWN_LOC(item));
    }
    for (var i = 0; i < EXITS.length; i++) {
      var ex = item[EXITS[i].name];
      if (typeof ex == "string") {
        if (!w[ex]) {
          errormsg(ERR_GAME_BUG, ERROR_INIT_UNKNOWN_EXIT(EXITS[i].name, item, ex));
        }
      }
      if (typeof ex == "object") {
        if (!w[ex.name]) {
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
  for (var key in w) {
    var item = w[key];
    if (item.runTurnscript() && typeof item.turnscript === "function"){
      item.turnscript();
    }
  }
};



var game = {
  verbosity:VERBOSE,
  update:function(player) {
    if (player != undefined) {
      this.player = player;
    }
    
    if (!this.player) {
      errormsg(ERR_GAME_BUG, ERROR_NO_PLAYER);
    }
    this.room = w[this.player.loc];
    this.dark = false; // We need to check all objects, so set this to false for now
    var light = this.room.lightSource();
    var listOfOjects = scope(isVisible);
    for (var i = 0; i < listOfOjects.length; i++) {
      if (light < listOfOjects[i].lightSource()) {
        light = listOfOjects[i].lightSource();
      }
    }
    this.dark = (light < LIGHT_MEAGRE);
    io.updateUIItems();
  }
};



// Sets the current room to the one named
function setRoom(roomName, suppressOutput) {
  if (game.player.loc == roomName && game.player.hasAlreadyBeenSetup) {
    // Already here, do nothing
    return false;
  }
  var room = w[roomName];
  if (room === undefined) {
    errormsg(ERR_GAME_BUG, ERROR_NO_ROOM + ": " + roomName + ".");
    return false;
  }
  //clearScreen();

  if (!suppressOutput) {
    if (game.player.hasAlreadyBeenSetup) game.room.onExit();
  }
  
  game.player.loc = room.name;
  game.update();
  world.setBackground();
  if (!suppressOutput) {
    room.beforeEnter();
    if (room.visited == 0) { room.beforeEnterFirst(); }
    heading(4, room.name);
    if ((game.verbosity == TERSE && room.visited == 0) || game.verbosity == VERBOSE) {
      room.description();
    }
    room.afterEnter();
    if (room.visited == 0) { room.afterEnterFirst(); }
    room.visited ++;
  }
  game.room = room;
  game.player.hasAlreadyBeenSetup = true;
  return true;
};



// Must be called before the game starts to perform various housekeeping jobs
function init() {
  // Sort out the player
  if (!w[PLAYER_NAME]) {
    errormsg(ERR_GAME_BUG, ERROR_NO_PLAYER_FOUND(PLAYER_NAME));
  }

  game.update(w[PLAYER_NAME]);
  
  // Create a background item if it does not exist
  if (w.background == undefined) {
    w.background = createItem("background", {
      loc:'Ubiquitous',
      display:DSPY_SCENERY,
      examine:DEFAULT_DESCRIPTION,
      background:true,
    });
  }
  if (!w.background.background) {
      errormsg(ERR_GAME_BUG, ERROR_INIT_BACKGROUND);
  }

  // Go through each item
  world.init();
  
  // Go through each command
  parser.initCommands(EXITS);
  
  // Set up the UI
  //endTurnUI();
  heading(2, TITLE);
  document.title = TITLE;
};







// Call after the player takes a turn, sending it a result, SUCCESS, SUCCESS_NO_TURNSCRIPTS or FAILED
// If you want ten turns to pass you would be better calling runTurnScripts directly
function endTurn(result) {
  if (result == SUCCESS) {
    world.runTurnScripts();
  }
  endTurnUI();
};




// Call this when entering a new room
// It will set the alt names of the Ubiquitous background object
// to any objects highlighted in the room description.

world.BACK_REGEX = /\[.+?\]/;
world.setBackground = function() {
  var md;
  if (typeof game.room.desc == 'string') {
    if (!game.room.backgroundNames) {
      game.room.backgroundNames = [];
      while (md = world.BACK_REGEX.exec(game.room.desc)) {
        var arr = md[0].substring(1, md[0].length - 1).split(":");
        game.room.desc = game.room.desc.replace(md[0], arr[0]);
        for (var j = 0; j < arr.length; j++) {
          game.room.backgroundNames.push(arr[j]);
        }
      }
    }
  }
  w.background.alt = game.room.backgroundNames ? game.room.backgroundNames : [];
}


function hasExit(room, dir) {
  if (!room[dir]) { return false; }
  var ex = room[dir];
  if (typeof ex !== "object") { return !game.dark; }
  return !ex.isHidden();
}


// Lock or unlock the exit indicated
// Returns false if the exit does not exist or is not an Exit object
// Returns true if successful
function setExitLock(room, dir, locked) {
  if (!room[dir]) { return false; }
  var ex = room[dir];
  if (typeof ex !== "object") { return false; }
  ex.locked = locked;
  return true;  
}

// Lock or unlock the exit indicated
// Returns false if the exit does not exist or is not an Exit object
// Returns true if successful
function setExitNonexistent(room, dir, hidden) {
  if (!room[dir]) { return false; }
  var ex = room[dir];
  if (typeof ex !== "object") { return false; }
  ex.hidden = hidden;
  return true;  
}

function Exit(name, hash) {
  this.name = name;
  this.use = function(exit, dir) {
    if (exit.isLocked()) {
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
  this.isLocked = function() { return this.locked; }
  this.isHidden = function() { return this.hidden || game.dark; }
  for (var key in hash) {
    this[key] = hash[key];
  }
}


