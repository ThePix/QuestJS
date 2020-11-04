"use strict";



// This is where the world exist!
const w = {};


//@DOC
// ## World Functions
//
// These are functions for creating objects in the game world
//@UNDOC


//@DOC
// Use this to create a new item (as opposed to a room).
// It adds various defaults that apply only to items.
// The first argument should be a string - a unique name for this object, composed only of letters, numbers and underscores.
// It will than take any number of dictionaries that will be combined to set the properties.
// Generally objects should not be created during play as they will not be saved properly.
// Either keep the object hodden until required or clone existing objects.
function createItem() {
  const args = Array.prototype.slice.call(arguments);
  const name = args.shift();
  args.unshift(DEFAULT_ITEM);
  return createObject(name, args);
}



//@DOC
// Use this to create a new room (as opposed to an item).
// It adds various defaults that apply only to items
// The first argument should be a string - a unique name for this object, composed only of letters, numbers and underscores.
// It will than take any number of dictionaries that will be combined to set the properties.
// Generally objects should not be created during play as they will not be saved properly.
// Either keep the object hodden until required or clone existing objects.
function createRoom() {
  const args = Array.prototype.slice.call(arguments);
  const name = args.shift();
  args.unshift(DEFAULT_ROOM);
  return createObject(name, args);
}



//@DOC
// Use this to create new items during play. The given item will be cloned at the given location.
// The `newName` isoptional, one will be generated if not supplied. If you do supply one bear inmid that
// every clone must have a unique name.
function cloneObject(item, loc, newName) {
  if (item === undefined) { console.log("Item is not defined.") }
  if (typeof item === 'string') {
    const o = w[item]
    if (o === undefined) { console.log("No item called '" + item + "' found in cloneObject.") }
    item = o
  }
  const clone = {};
  for (let key in item) clone[key] = item[key];
  clone.name = newName === undefined ? world.findUniqueName(item.name) : newName;
  if (!clone.clonePrototype) {
    clone.clonePrototype = item;
  }
  if (loc !== undefined) {
    clone.loc = loc;
  }

  clone.getSaveString = function(item) {
    this.templatePreSave();
    let s = "Clone:" + this.clonePrototype.name + "=";
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



//@DOC
// Creates a basic object. Generally it is better to use CreateItem or CreateRoom.
function createObject(name, listOfHashes) {
  if (world.isCreated && !settings.saveDisabled) {
    console.log("Attempting to use createObject with `" + name + "` after set up. To ensure games save properly you should use cloneObject to create ites during play.")
    errormsg("Attempting to use createObject with `" + name + "` after set up. To ensure games save properly you should use cloneObject to create ites during play.");
    return null;
  }

  if (/\W/.test(name)) {
    console.log("Attempting to use the disallowed name `" + name + "`; a name can only include letters and digits - no spaces or accented characters. Use the 'alias' attribute to give an item a name with other characters.")
    errormsg("Attempting to use the disallowed name `" + name + "`; a name can only include letters and digits - no spaces or accented characters. Use the 'alias' attribute to give an item a name with other characters.");
    return null;
  }
  if (w[name]) {
    console.log("Attempting to use the name `" + name + "` when there is already an item with that name in the world.")
    errormsg("Attempting to use the name `" + name + "` when there is already an item with that name in the world.");
    return null;
  }
  if (typeof listOfHashes.unshift !== 'function') {
    console.log("The list of hashes for `" + name + "` is not what I was expecting. Found:")
    console.log(listOfHashes)
    console.log('Maybe you meant to use createItem?')
    errormsg("The list of hashes for `" + name + "` is not what I was expecting. Look at the console for more.");
    return null;
  }

  listOfHashes.unshift(DEFAULT_OBJECT);

  const item = { 
    name:name,
  };
  
  for (let hash of listOfHashes) {
    for (let key in hash) {
      item[key] = hash[key];
    }
  }

  // Give every object an alias and list alias (used in the inventories)
  if (!item.alias) item.alias = item.name.replace(/_/g, " ");
  if (!item.listalias) item.listalias = sentenceCase(item.alias);
  if (!item.getListAlias) item.getListAlias = function(loc) { return this.listalias; };
  if (!item.pluralAlias) item.pluralAlias = item.alias + "s";
  if (item.pluralAlias === '*') item.pluralAlias = item.alias;

  item.verbFunctions = [function(o, verbList) {
    verbList.push(lang.verbs.examine)
    if (o.use !== undefined) verbList.push(lang.verbs.use)
  }]
  item.nameModifierFunctions = []
  for (let hash of listOfHashes) {
    if (hash.onCreation) hash.onCreation(item)
  }

  
  //world.data.push(item);
  w[name] = item;
  return item;
}













const world = {
  VISIBLE:1,
  REACHABLE:2,

  // constants for lighting levels
  LIGHT_NONE:0,
  LIGHT_SELF:1,
  LIGHT_MEAGRE:2,
  LIGHT_FULL:3,
  LIGHT_EXTREME:4,

  // constants for verbosity of room descriptions
  BRIEF:1,
  TERSE:2,
  VERBOSE:3,
  
  // constants for isAtLoc situations
  ALL:0,
  LOOK:1,
  PARSER:2,
  INVENTORY:3,
  SIDE_PANE:4,
  SCOPING:5,
  
  // constants for command responses
  // (but a verb will return true or false, so the command that uses it
  // can in turn return one of these - a verb is an attribute of an object)
  SUCCESS:1,                             
  SUCCESS_NO_TURNSCRIPTS:2,
  FAILED:-1,
  PARSER_FAILURE:-2,

  isCreated:false,

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
    // This handles the player wanting to interact with things in room descriptions
    // that are not implemented by changing its regex when a room is entered.
    if (w.background === undefined) {
      w.background = createItem("background", {
        scenery:true,
        examine:lang.default_description,
        background:true,
        name:'default_background_object',
        lightSource:function() { return world.LIGHT_NONE; },
        isAtLoc:function(loc, situation) {
          if (typeof loc !== "string") loc = loc.name
          if (!w[loc]) errormsg("Unknown location: " + loc)
          return w[loc] && w[loc].room && situation === world.PARSER; 
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
    initCommands();
    
    // Set up the UI
    //endTurnUI();
    if (settings.playMode === 'beta') {
      lang.betaTestIntro()
    }
    msgHeading(settings.title, 2)
    if (settings.subtitle) msgHeading(settings.subtitle, 3)
    io.setTitleAndInit(settings.title)
    
    game.ticker = setInterval(game.gameTimer, 1000);
    w[game.player.loc].visited++

  },

  // Every item or room should have this called for them.
  // That will be done at the start, but you need to do it yourself 
  // if creating items on the fly (but you should not be doing that anyway!).
  initItem:function(item) {
    if (settings.playMode === 'dev' && item.loc && !w[item.loc]) {
      console.log("ERROR: The item `" + item.name + "` is in an unknown location (" + item.loc + ")");
    }
    
    if (item._setup) item._setup()
    if (item.setup) item.setup()
    for (let exit of lang.exit_list) {
      const ex = item[exit.name];
      if (ex) {
        ex.origin = item;
        ex.dir = exit.name;
        if (ex.alsoDir) {
          for (let dir of ex.alsoDir) {
            item[dir] = new Exit(ex.name, ex);
            item[dir].scenery = true;
          }
        }
      }
    }

    if (settings.playMode === 'dev') {
      const dirs = lang.exit_list.filter(el => el.type !== 'nocmd').map(el => el.name)
      //console.log(dirs)
      for (let key in item) {
        if (dirs.includes(key)) {
          if (!item[key] instanceof Exit) console.log("ERROR: Exit " + key + " of " + item.name + " is not an Exit instance.")
          if (item[key].name !== '_' && !w[item[key].name]) console.log("ERROR: Exit " + key + " of " + item.name + " goes to an unknown location (" + item[key].name + ").")
        }
        else {
          if (item[key] instanceof Exit) console.log("ERROR: Attribute " + key + " of " + item.name + " is an Exit instance and probably should not.")
        }
      }
    }
  },

  // Call after the player takes a turn, sending it a result, SUCCESS, SUCCESS_NO_TURNSCRIPTS or FAILED
  endTurn:function(result) {
    if (result === true) debugmsg("That command returned 'true', rather than the proper result code.");
    if (result === false) debugmsg("That command returned 'false', rather than the proper result code.");
    util.handleChangeListeners()
    if (result === world.SUCCESS || (settings.failCountsAsTurn && result === world.FAILED)) {
      game.turnCount++;
      game.elapsedTime += settings.dateTime.secondsPerTurn;
      //events.runEvents();
      for (let key in w) {
        w[key].doEvent();
      }
      util.handleChangeListeners()
      world.resetPauses();
      game.update();
      game.saveGameState();
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

  // Returns true if bad lighting is not obscuring the item
  ifNotDark:function(item) {
    return (!game.dark || item.lightSource() > world.LIGHT_NONE);
  },

  // scopeStatus is used to track what the player can see and reach; it is a lot faster than working 
  // it out each time, as this needs to be used several times every turn.
  scopeSnapshot:function() {
    // reset every object
    for (let key in w) {
      delete w[key].scopeStatus;
      delete w[key].scopeStatusForRoom;
    }

    // start from the current room
    const room = w[game.player.loc];
    if (room === undefined) {
      errormsg("Error in scopeSnapshot; the location assigned to the player does not exist.")
      console.log("Error in scopeSnapshot; the location assigned to the player does not exist ('" + game.player.loc + "').")
      console.log("Is it possible the location is in a file not loaded? Loaded files are: " + settings.files)
      return
    }
    room.scopeStatusForRoom = world.REACHABLE;
    // crawl up the room hierarchy to the topmost visible
    while (room.loc && room.canReachThrough()) {
      room = w[room.loc];
      room.scopeStatusForRoom = world.REACHABLE;
    }
    // room is now the top level applicable, so now work downwards from here (recursively)

    room.scopeSnapshot(false);
    
    // Also want to go further upwards if room is transparent
    while (room.loc && room.canSeeThrough()) {
      room = w[room.loc];
      room.scopeStatusForRoom = world.VISIBLE;
    }
    // room is now the top level applicable

    room.scopeSnapshot(true);
  },

  // Sets the current room to the one named
  //
  // Can also be used to move an NPC, but just gives a message and set "loc"
  // however, this does make it char-neutral.
  // Also calls onCarry, so rope works!
  // Suppress output (if done elsewhere) by sending false for dir
  // Force the move to happen even if the room name is the same by setting forced to true
  setRoom:function(char, roomName, dir, forced) {
    let room
    if (typeof roomName === 'string') {
      room = w[roomName];
      if (room === undefined) {
        errormsg("Failed to find room: " + roomName + ".");
        return false;
      }
    }
    else {
      if (roomName.name === undefined) {
        errormsg("Not sure what to do with this room: " + roomName + " (a " + (typeof roomName) + ").");
        return false;
      }
      room = roomName
      roomName = room.name
    }
    
    if (dir) {  // if dir is false, assume already done
      for (let el of char.onGoCheckList) {
        if (!w[el].onGoCheck(char, roomName, dir)) return false
      }
    }
    
    
    if (char !== game.player) {
      if (dir) { 
        msg(lang.stop_posture(char));
        msg(lang.go_successful, {char:char, dir:dir}); 
      }
      char.previousLoc = char.loc;
      char.loc = roomName;
      for (let el of char.onGoActionList) {
        console.log(el)
        if (!w[el].onGoAction(char, roomName, dir)) return false
      }
      return true;
    }

    if (!forced && game.player.loc === roomName) {
      // Already here, do nothing
      return false;
    }
    
    if (settings.clearScreenOnRoomEnter) clearScreen();

    game.room.onExit();
    
    char.previousLoc = char.loc;
    char.loc = room.name;
    game.update();
    world.setBackground();
    if (dir !== "suppress") {
      world.enterRoom();
    }
    for (let el of char.onGoActionList) {
      if (!w[el].onGoAction(char, roomName, dir)) return false
    }
    return true;
  },

  // Runs the script and gives the description
  enterRoom:function() {
    if (game.room.beforeEnter === undefined) {
      errormsg("This room, " + game.room.name + ", has no 'beforeEnter` function defined.  This is probably because it is not actually a room (it was not created with 'createRoom' and has not got the DEFAULT_ROOM template), but it an item. It is not clear what state the game will continue in.");
      return;
    }
    game.room.beforeEnter();
    if (game.room.visited === 0) { game.room.beforeFirstEnter(); }
    world.enterRoomAfterScripts();
  },

  // Called when entering a new room, after beforeEnter and beforeFirstEnter re done
  enterRoomAfterScripts:function() {
    game.room.description();
    game.room.afterEnter();
    if (game.room.visited === 0) { game.room.afterFirstEnter(); }
    if (game.room.afterEnterIf) {
      for (let key in game.room.afterEnterIf) {
        if (game.room.afterEnterIfFlags.split(" ").includes(key)) continue;
        if (game.room.afterEnterIf[key].test()) {
          game.room.afterEnterIf[key].action;
          game.room.afterEnterIfFlags += " " + key;
        }
      }
    }
    game.room.visited++;
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
          for (let el of arr) game.room.backgroundNames.push(el);
        }
      }
    }
    w.background.regex = (game.room.backgroundNames && game.room.backgroundNames.length > 0) ? new RegExp(game.room.backgroundNames.join("|")) : false;
  },

  BACK_REGEX:/\[.+?\]/,
  
};





const game = createObject("game", [{
  verbosity:world.VERBOSE,
  spoken:false,
  turnCount:0,
  elapsedTime:0,
  elapsedRealTime:0,
  startTime:settings.dateTime.start,
  gameState:[],
  name:'built-in_game_object',
  isAtLoc:function() { return false; },
  
  
  initialise:function() {
    world.init();
    game.update();
    game.saveGameState()
    world.setBackground();
  },
  
  begin:function() {
    if (settings.startingDialogEnabled) return
    if (typeof settings.intro === "string") {
      msg(settings.intro)
    }
    else if (settings.intro) {
      for (let el of settings.intro) msg(el)
    }
    if (typeof settings.setup === "function") settings.setup()
    world.enterRoom()
  },
  
  // Updates the game world, specifically...
  // Sets game.player and game.room
  // Sets the scoping snapshot
  // Sets the light/dark
  update:function(player) {
    //debugmsg("update");
    if (player !== undefined) {
      this.player = player;
    }
    
    if (!this.player) {
      errormsg("No player object found. This will not go well...");
      return;
    }
    if (!this.player.loc || !w[this.player.loc]) {
      errormsg(this.player.loc === undefined ? "No player location set." : "Player location set to '" + this.player.loc + "', which does not exist.");
      errormsg("If this is when you load a game: This is likely to be because of an error in one of the .js files. Press F12, and go to the 'Console' tab (if not already open), to see the error. Look at the very first error (but ignore any that mentions 'jquery'). It should tell you the file and line number that is causing the problem.");
      errormsg("If this is when player moves: This is likely to be because of an error in the exit being used.");
    }
    this.room = w[this.player.loc];
    world.scopeSnapshot();

    let light = world.LIGHT_NONE;
    for (let key in w) {
      
      if (w[key].scopeStatus) {
        if (light < w[key].lightSource()) {
          light = w[key].lightSource();
        }
      }
    }
    this.dark = (light < world.LIGHT_MEAGRE);
    this.dark = (light < world.LIGHT_MEAGRE);
    //endTurnUI();
    //io.updateUIItems();
  },
  
  // UNDO SUPPORT
  saveGameState:function() {
    if (settings.maxUndo > 0) {
      this.gameState.push(saveLoad.getSaveBody());
      if (this.gameState.length > settings.maxUndo) this.gameState.shift();
    }
  },
  
  
  
  timerEvents:[],
  eventFunctions:{},
  registerEvent:function(eventName, func) {
    if (world.isCreated && !settings.saveDisabled) {
      errormsg("Attempting to use registerEvent after set up.")
      return
    }
    this.eventFunctions[eventName] = func;
  },
  registerTimedEvent:function(eventName, triggerTime, interval) {
    if (world.isCreated && !settings.saveDisabled) {
      errormsg("Attempting to use registerTimedEvent after set up.")
      return
    }
    this.timerEvents.push({eventName:eventName, triggerTime:triggerTime + game.elapsedRealTime, interval:interval});
  },
  gameTimer:function() {
    // Note that this gets added to window by setInterval, so 'this' does not refer to the game object
    game.elapsedRealTime++;
    let somethingHappened = false
    for (let el of game.timerEvents) {
      if (el.triggerTime && el.triggerTime < game.elapsedRealTime) {
        if (typeof(game.eventFunctions[el.eventName]) === 'function') {
          const flag = game.eventFunctions[el.eventName]();
          if (el.interval && !flag) {
            el.triggerTime += el.interval;
          }
          else {
            delete el.triggerTime;
          }
          somethingHappened = true
        }
        else {
          errormsg("A timer is trying to call event '" + el.eventName + "' but no such function is registered.");
          //console.log(game.eventFunctions);
        }
      }
    }
    if (somethingHappened) util.handleChangeListeners()
  },
  preSave:function() {
    const arr = [];
    for (let el of game.timerEvents) {
      if (el.triggerTime) {
        arr.push(el.eventName + "/" + el.triggerTime + "/" + (el.interval ? el.interval : '-'));
      }
    }
    game.timeSaveAttribute = arr.join(" ");
  },
  postLoad:function() {
    game.timerEvents = [];
    const arr = game.timeSaveAttribute.split(' ');
    for (let el of arr) {
      const params = el.split('/');
      const interval = params[2] === '-' ? undefined : parseInt(params[2]);
      game.timerEvents.push({eventName:params[0], triggerTime:parseInt(params[1]), interval:interval});
    }
    delete game.timeSaveAttribute;
  },
  
  
}]);










function Exit(name, hash) {
  if (!hash) hash = {}
  this.name = name
  this.use = util.defaultExitUse
  // These two will not be saved!!! 
  this.isLocked = function() { return this.locked; };
  this.isHidden = function() { return this.hidden || game.dark; };
  for (let key in hash) {
    this[key] = hash[key];
  }
}




