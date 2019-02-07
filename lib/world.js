"use strict";



// This is where the world exist!
const w = {};




// Use this to create a new item (as opposed to a room).
// It adds various defaults that apply only to items
function createItem() {
  const args = Array.prototype.slice.call(arguments);
  const name = args.shift();
  args.unshift(DEFAULT_ITEM);
  return createObject(name, args);
}

// Use this to create a new item (as opposed to a room).
// It adds various defaults that apply only to items
function createRoom() {
  const args = Array.prototype.slice.call(arguments);
  const name = args.shift();
  args.unshift(DEFAULT_ROOM);
  return createObject(name, args);
}



// Use this to create new items during play.
function cloneObject(item, loc) {
  const clone = {};
  for (let key in item) {
    clone[key] = item[key];
  }
  clone.name = world.findUniqueName(item.name);
  if (!clone.clonePrototype) {
    clone.clonePrototype = item;
  }
  if (loc !== undefined) {
    clone.loc = loc;
  }

  clone.getSaveString = function(item) {
    this.templatePreSave();
    let s = "";
    s += saveLoad.encode("saveType", "Clone");
    s += saveLoad.encode("clonePrototype", this.clonePrototype.name);
    for (let key in this) {
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
  };
  w[clone.name] = clone;
  return clone;
}



function createObject(name, listOfHashes) {
  if (world.isCreated && !SAVE_DISABLED) {
    errormsg("Attempting to use createObject with `" + name + "` after set up. To ensure games save properly you should use cloneObject to create ites during play.");
    return null;
  }

  if (/\W/.test(name)) {
    errormsg("Attempting to use the disallowed name `" + name + "`; a name can only include letters and digits - no spaces or accented characters. Use the 'alias' attribute to give an item a name with other characters.");
    return null;
  }
  if (w[name]) {
    errormsg("Attempting to use the name `" + name + "`, there there is already an item with that name in the world.");
    return null;
  }

  listOfHashes.unshift(DEFAULT_OBJECT);

  const item = { 
    name:name,
  };
  
  for (let i = 0; i < listOfHashes.length; i++) {
    for (let key in listOfHashes[i]) {
      item[key] = listOfHashes[i][key];
    }
  }

  // Give every object an alias and list alias (used in the inventories)
  if (!item.alias) item.alias = replaceAll(item.name, /_/g, " ");
  if (!item.listalias) item.listalias = sentenceCase(item.alias);
  if (!item.getListAlias) item.getListAlias = function(loc) { return this.listalias; };
  if (!item.pluralAlias) item.pluralAlias = item.alias + "s";
  
  //world.data.push(item);
  w[name] = item;
  return item;
}













const world = {
  isCreated:false,
  exits:[],

  findUniqueName:function(s) {
    if (!w[s]) {
      return (s);
    }
    else {
      const res = /(\d+)$/.exec(s);
      if (!res) {
        return world.findUniqueName(s + "0");
      }
      const n = parseInt(res[0]) + 1;
      return world.findUniqueName(s.replace(/(\d+)$/, "" + n));
    }
  },

  init:function() {
    // Sort out the player
    let player;
    for (let key in w) {
      if (w[key].player) { player = w[key]; }
    }
    if (!player) {
      errormsg("No player object found. This is probably due to an error in data.js. Do [Ctrl][Shft]-I to open the developer tools, and go to the console tab, and look at the first error in the list (if it mentions jQuery, skip it and look at the second one). It should tell you exactly which line in which file. But also check one object is actually flagged as the player.");
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
        isAtLoc:function(loc) {
          return w[loc].room; 
        },
      });
    }
    if (!w.background.background) {
        errormsg("It looks like an item has been named 'background`, but is not set as the background item. If you intended to do this, ensure the background property is set to true.");
    }

    for (let key in w) {
      world.initItem(w[key]);
    }
    this.isCreated = true;
    
    // Go through each command
    initCommands(EXITS);
    
    // Set up the UI
    //endTurnUI();
    heading(2, TITLE);
    io.setTitle(TITLE);
  },

  // Every item or room should have this called for them.
  // That will be done at the start, but you need to do it yourself 
  // if creating items on the fly.
  initItem:function(item) {
    if (item.loc && !w[item.loc]) {
      errormsg("The item `" + item.name + "` is in an unknown location (" + item.loc + ")");
    }
    for (let i = 0; i < EXITS.length; i++) {
      const ex = item[EXITS[i].name];
      if (ex) {
        ex.origin = item;
        ex.dir = EXITS[i].name;
        world.exits.push(ex);
      }
    }
  },

  // Call after the player takes a turn, sending it a result, SUCCESS, SUCCESS_NO_TURNSCRIPTS or FAILED
  // If you want ten turns to pass you would be better calling world.endTurn directly
  // Runs turnscipts
  // Turnscripts are just objects in the world.data array with a "turnscript" attribute set to a function
  // and a Boolean "runTurnscript".
  // For NPCs you can test "p" to see if the NPC has alread done something this turn
  endTurn:function(result) {
    if (result === true) debugmsg("That command returned 'true', rather than the proper result code.");
    if (result === false) debugmsg("That command returned 'false', rather than the proper result code.");
    if (result === SUCCESS || (FAILS_COUNT_AS_TURNS && result === FAILED)) {
      game.turnCount++;
      game.elapsedTime += SECONDS_PER_TURN;
      //events.runEvents();
      for (let key in w) {
        w[key].doEvent();
      }
      world.resetPauses();
      game.update();
      endTurnUI(true);
    }
    else {
      endTurnUI(false);
    }
  },

  resetPauses:function() {
    for (let key in w) {
      if (w[key].paused){
        delete w[key].paused;
      }
    }
  },

  // Returns true as long as the item is not scenery (or less)
  ifNotScenery:function(item) {
    return (item.display > DSPY_SCENERY); 
  },

  // Returns true if bad lighting is not obscuring the item
  ifNotDark:function(item) {
    return (!game.dark || item.lightSource() > LIGHT_NONE);
  },

  scopeSnapshot:function() {
    // reset every object
    for (let key in w) {
      delete w[key].scopeStatus;
      delete w[key].scopeStatusForRoom;
    }

    const room = w[game.player.loc];
    room.scopeStatusForRoom = REACHABLE;
    while (room.loc && room.canReachThrough()) {
      room = w[room.loc];
      room.scopeStatusForRoom = REACHABLE;
    }
    // room is now the top level applicable

    room.scopeSnapshot(false);
    
    // Also want to go further upwards if room is transparent
    while (room.loc && room.canSeeThrough()) {
      room = w[room.loc];
      room.scopeStatusForRoom = VISIBLE;
    }
    // room is now the top level applicable

    room.scopeSnapshot(true);
  },

  // Sets the current room to the one named
  // Can also be used to move an NPC, but just gives a message and set "loc"
  // however, this does make it char-neutral.
  // Suppress output for NPCs (if done elsewhere) by sending false for dir
  setRoom:function(char, roomName, dir) {
    if (char !== game.player) {
      if (dir) { 
        msg(STOP_POSTURE(char));
        msg(NPC_HEADING(char, dir)); 
      }
      char.loc = roomName;
      return true;
    }

    if (game.player.loc === roomName) {
      // Already here, do nothing
      return false;
    }
    const room = w[roomName];
    if (room === undefined) {
      errormsg("Failed to find room: " + roomName + ".");
      return false;
    }
    //clearScreen();

    game.room.onExit();
    
    game.player.loc = room.name;
    game.update();
    world.setBackground();
    world.enterRoom(room);
    return true;
  },

  // Runs the script and gives the description
  enterRoom:function(room) {
    room.beforeEnter();
    if (room.visited === 0) { room.beforeFirstEnter(); }
    heading(4, sentenceCase(room.alias));
    if ((game.verbosity === TERSE && room.visited === 0) || game.verbosity === VERBOSE) {
      room.description();
    }
    room.afterEnter();
    if (room.visited === 0) { room.afterFirstEnter(); }
    room.visited ++;
  },

  // Call this when entering a new room
  // It will set the regex of the ubiquitous background object
  // to any objects highlighted in the room description.
  setBackground:function() {
    let md;
    if (typeof game.room.desc === 'string') {
      if (!game.room.backgroundNames) {
        game.room.backgroundNames = [];
        while (md = world.BACK_REGEX.exec(game.room.desc)) {  // yes it is an assignment!
          let arr = md[0].substring(1, md[0].length - 1).split(":");
          game.room.desc = game.room.desc.replace(md[0], arr[0]);
          for (let j = 0; j < arr.length; j++) {
            game.room.backgroundNames.push(arr[j]);
          }
        }
      }
    }
    w.background.regex = (game.room.backgroundNames && game.room.backgroundNames.length > 0) ? new RegExp(game.room.backgroundNames.join("|")) : false;
  },

  BACK_REGEX:/\[.+?\]/,
  
  // Used in PLAYER and NPC; do not invoke for the world object
  getOuterWearable:function(slot) {
    const clothing = scope(isWornBy, {npc:this}).filter(function(el) { return el.slots.includes(slot); });
    if (clothing.length === 0) { return false; }
    let outer = clothing[0];
    for (let i = 1; i < clothing.length; i++) {
      if (clothing[i].layer > outer.layer) {
        outer = clothing[i];
      }
    }
    return outer;
  },
  
  

};





const game = createObject("game", [{
  verbosity:VERBOSE,
  spoken:false,
  turnCount:0,
  elapsedTime:0,
  startTime:DATE_TIME_START,
  isAtLoc:function() { return false; },
  runTurnscript:function() { return false; },
  update:function(player) {
    if (player !== undefined) {
      this.player = player;
    }
    
    if (!this.player) {
      errormsg("No player object found. This will not go well...");
    }
    if (!this.player.loc || !w[this.player.loc]) {
      errormsg("No player location set or set to location that does no exist. This will not go well...");
    }
    this.room = w[this.player.loc];
    world.scopeSnapshot();

    let light = LIGHT_NONE;
    for (let key in w) {
      
      if (w[key].scopeStatus) {
        if (light < w[key].lightSource()) {
          light = w[key].lightSource();
        }
      }
    }
    this.dark = (light < LIGHT_MEAGRE);
    endTurnUI();
    //io.updateUIItems();
  }
}]);










function Exit(name, hash) {
  if (!hash) hash = {};
  this.name = name;
  this.use = function(char, dir) {
    if (char.testMobility && !char.testMobility()) {
      return false;
    }
    if (this.isLocked()) {
      if (this.lockedmsg) {
        msg(this.lockedmsg);
      }
      else {
        msg(LOCKED_EXIT(char, this));
      }
      return false;
    }
    else {
      msg(STOP_POSTURE(char));
      if (this.msg) {
        printOrRun(char, this, "msg");
      }
      else {
        msg(NPC_HEADING(char, dir));
      }
      world.setRoom(char, this.name, false);
      return true;
    }
  };
  // These two will not be saved!!! 
  this.isLocked = function() { return this.locked; };
  this.isHidden = function() { return this.hidden || game.dark; };
  for (let key in hash) {
    this[key] = hash[key];
  }
}


