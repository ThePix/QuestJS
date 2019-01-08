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
  if (loc !== undefined) {
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
    byname:function(options) {
      if (options.article === "the") {
        return _itemThe(this) + this.alias;
      }
      if (options.article === "a") {
        return _itemA(this) + this.alias;
      }
      return this.alias;
    },
    runTurnscript:function() { return false; },
    
    isAtLoc:function(loc) {
      return (this.loc === loc);
    },
    
    
    /*testOptions:function(fns, options) {
      if (fns) {
        for (var i = 0; i < fns.length; i++) {
          if (!fns[i](this, options)) { return false; }
        }
      }
      return true;
    },*/
    scopeSnapshot:function(visible) {
      //debugmsg("Looking at " + this.name);
      if (this.scopeStatus) { return }
      this.scopeStatus = visible ? VISIBLE : REACHABLE;
      if (!this.getContents) { return }
      //debugmsg("Has contents");
      if (!this.canSeeThrough() && !this.scopeStatusForRoom) { return }
      //debugmsg("Can see through");
      if (!this.canReachThrough() && !this.scopeStatusForRoom === REACHABLE) { visible = true }
      var l = this.getContents();
      //debugmsg("Looking deeper");
      for (var i = 0; i < l.length; i++) {
        l[i].scopeSnapshot(visible);
      }
    },
    canReachThrough:function() { return false; },
    canSeeThrough:function() { return false; },
    
    getSaveString:function() {
      var s = "";
      for (var key in this) {
        if (typeof this[key] !== "function" && typeof this[key] !== "object") {
          if (key !== "desc" && key !== "examine" && key !== "name") {
            s += saveLoad.encode(key, this[key]);
          }
          if (key === "desc" && this.mutableDesc) {
            s += saveLoad.encode(key, this[key]);
          }
          if (key === "examine" && this.mutableExamine) {
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
    item.alias = replaceAll(item.name, /_/g, " ");
  }
  if (!item.listalias) {
    item.listalias = sentenceCase(item.alias);
  }
  if (!item.getListAlias) {
    item.getListAlias = function(loc) { return this.listalias; }
  }
  if (!item.alt) {
    item.alt = [];
  }
  if (item.resolveNames) { item.resolveNames(); }
  
  // Sort out the location
  if (item.loc === "Held") {
    item.loc = game.player.name;
  }
  else if (item.loc === "Worn") {
    item.loc = game.player.name;
    item.worn = true;
  }
  else if (item.loc === "Here") {
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




function checkCannotSpeak(npc) {
  return false;
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
    if (item.loc && !w[item.loc]) {
      errormsg(ERR_GAME_BUG, ERROR_INIT_UNKNOWN_LOC(item));
    }
    for (var i = 0; i < EXITS.length; i++) {
      var ex = item[EXITS[i].name];
      if (typeof ex === "string") {
        if (!w[ex]) {
          errormsg(ERR_GAME_BUG, ERROR_INIT_UNKNOWN_EXIT(EXITS[i].name, item, ex));
        }
      }
      if (typeof ex === "object") {
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
    if (item.runTurnscript() && typeof item.turnscript === "function" && !test.testing){
      item.turnscript();
    }
  }
};




// Returns true as long as the item is not scenery (or less)
world.ifNotScenery = function(item) { return (item.display > DSPY_SCENERY); };

// Returns true if bad lighting is not obscuring the item
world.ifNotDark = function(item) { return (!game.dark || item.lightSource() > LIGHT_NONE); };




world.scopeSnapshot = function() {
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
};




var game = {
  verbosity:VERBOSE,
  update:function(player) {
    if (player !== undefined) {
      this.player = player;
    }
    
    if (!this.player) {
      errormsg(ERR_GAME_BUG, ERROR_NO_PLAYER);
    }
    this.room = w[this.player.loc];
    world.scopeSnapshot();

    var light = LIGHT_NONE;
    for (var key in w) {
      if (w[key].scopeStatus) {
        if (light < w[key].lightSource()) {
          light = w[key].lightSource();
        }
      }
    }
    this.dark = (light < LIGHT_MEAGRE);
    io.updateUIItems();
  }
};



// Sets the current room to the one named
// Can also be used to move an NPC, but just gives a message and set "loc"
// however, this does make it char-neutral.
// Supress output for NPCs (if done elsewhere) by sending false for dir
function setRoom(char, roomName, dir) {
  if (char !== game.player) {
    if (dir) { msg(NPC_HEADING(char, dir)); }
    char.loc = roomName;
    return true;
  }

  if (game.player.loc === roomName) {
    // Already here, do nothing
    return false;
  }
  var room = w[roomName];
  if (room === undefined) {
    errormsg(ERR_GAME_BUG, ERROR_NO_ROOM + ": " + roomName + ".");
    return false;
  }
  //clearScreen();

  game.room.onExit();
  
  game.player.loc = room.name;
  game.update();
  world.setBackground();
  enterRoom(room);
  return true;
};


// Runs the script and gives the description
function enterRoom(room) {
  room.beforeEnter();
  if (room.visited === 0) { room.beforeEnterFirst(); }
  heading(4, sentenceCase(room.alias));
  if ((game.verbosity === TERSE && room.visited === 0) || game.verbosity === VERBOSE) {
    room.description();
  }
  room.afterEnter();
  if (room.visited === 0) { room.afterEnterFirst(); }
  room.visited ++;
}


// Must be called before the game starts to perform various housekeeping jobs
function init() {
  // Sort out the player
  var player;
  for (var key in w) {
    if (w[key].player) { player = w[key]; }
  }
  if (!player) {
    errormsg(ERR_GAME_BUG, ERROR_NO_PLAYER_FOUND);
    return;
  }
  game.update(player);
  
  // Create a background item if it does not exist
  if (w.background === undefined) {
    w.background = createItem("background", {
      display:DSPY_SCENERY,
      examine:DEFAULT_DESCRIPTION,
      background:true,
      lightSource:function() { return LIGHT_NONE; },
      isAtLoc:function(loc) { return w[loc].room; },
    });
  }
  if (!w.background.background) {
      errormsg(ERR_GAME_BUG, ERROR_INIT_BACKGROUND);
  }

  // Go through each item
  world.init();
  
  // Go through each command
  initCommands(EXITS);
  
  // Set up the UI
  //endTurnUI();
  heading(2, TITLE);
  document.title = TITLE;
};







// Call after the player takes a turn, sending it a result, SUCCESS, SUCCESS_NO_TURNSCRIPTS or FAILED
// If you want ten turns to pass you would be better calling runTurnScripts directly
function endTurn(result) {
  if (result === SUCCESS) {
    world.runTurnScripts();
  }
  if (result != FAILED) {
    game.update();
  }
  endTurnUI(result != FAILED);
};




// Call this when entering a new room
// It will set the regex of the ubiquitous background object
// to any objects highlighted in the room description.

world.BACK_REGEX = /\[.+?\]/;
world.setBackground = function() {
  var md;
  if (typeof game.room.desc === 'string') {
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
  w.background.regex = (game.room.backgroundNames && game.room.backgroundNames.length > 0) ? new RegExp(game.room.backgroundNames.join("|")) : false;
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
  this.use = function(char, dir) {
    if (this.isLocked()) {
      if (this.lockedmsg) {
        msg(this.lockedmsg);
      }
      else {
        msg(CMD_LOCKED_EXIT(char, this));
      }
      return false;
    }
    else {
      if (this.msg) {
        printOrRun(char, this, "msg");
      }
      else {
        msg(NPC_HEADING(char, dir));
      }
      setRoom(char, this.name, false);
      return true;
    }
  }
  this.isLocked = function() { return this.locked; }
  this.isHidden = function() { return this.hidden || game.dark; }
  for (var key in hash) {
    this[key] = hash[key];
  }
}


