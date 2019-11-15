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

// Use this to create a new room (as opposed to an item).
// It adds various defaults that apply only to items
function createRoom() {
  const args = Array.prototype.slice.call(arguments);
  const name = args.shift();
  args.unshift(DEFAULT_ROOM);
  return createObject(name, args);
}



// Use this to create new items during play.
function cloneObject(item, loc, newName) {
  if (item === undefined) { console.log("Item is not defined.") }
  const clone = {};
  for (let key in item) {
    clone[key] = item[key];
  }
  clone.name = newName === undefined ? world.findUniqueName(item.name) : newName;
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
    // This handles the player wanting to interact with things in room descriptions
    // that are not implemented by changing its regex when a room is entered.
    if (w.background === undefined) {
      w.background = createItem("background", {
        scenery:true,
        examine:DEFAULT_DESCRIPTION,
        background:true,
        name:'default_background_object',
        lightSource:function() { return LIGHT_NONE; },
        isAtLoc:function(loc, situation) {
          if (typeof loc !== "string") loc = loc.name
          if (!w[loc]) errormsg("Unknown location: " + loc)
          return w[loc] && w[loc].room && situation === display.PARSER; 
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
    msgHeading(TITLE, 2);
    io.setTitle(TITLE);
    
    game.ticker = setInterval(game.gameTimer, 1000);

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
        if (ex.alsoDir) {
          for (let j = 0; j < ex.alsoDir.length; j++) {
            item[ex.alsoDir[j]] = new Exit(ex.name, ex);
            item[ex.alsoDir[j]].scenery = true;
          }
        }
      }
    }
  },

  // Call after the player takes a turn, sending it a result, SUCCESS, SUCCESS_NO_TURNSCRIPTS or FAILED
  endTurn:function(result) {
    //debugmsg("endTurn=" + result);
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
    return (!game.dark || item.lightSource() > LIGHT_NONE);
  },

  scopeSnapshot:function() {
    // reset every object
    for (let key in w) {
      delete w[key].scopeStatus;
      delete w[key].scopeStatusForRoom;
    }

    const room = w[game.player.loc];
    if (room === undefined) {
      errormsg("Error in scopeSnapshot; the location assigned to the player does not exist.")
    }
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
  // Suppress output (if done elsewhere) by sending false for dir
  setRoom:function(char, roomName, dir) {
    if (char !== game.player) {
      if (dir) { 
        msg(STOP_POSTURE(char));
        msg(NPC_HEADING(char, dir)); 
      }
      char.previousLoc = char.loc;
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
    
    char.previousLoc = char.loc;
    char.loc = room.name;
    game.update();
    world.setBackground();
    if (dir !== "suppress") {
      world.enterRoom();
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
    if (io.waitFns.length === 0) {
      world.enterRoomAfterScripts();
    }
  },

  // Called when entering a new room, after beforeEnter and beforeFirstEnter re done
  enterRoomAfterScripts:function() {
    if (ROOM_HEADINGS) msgHeading(sentenceCase(game.room.alias), 4);
    if ((game.verbosity === TERSE && game.room.visited === 0) || game.verbosity === VERBOSE) {
      game.room.description();
    }
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
          for (let j = 0; j < arr.length; j++) {
            game.room.backgroundNames.push(arr[j]);
          }
        }
      }
    }
    w.background.regex = (game.room.backgroundNames && game.room.backgroundNames.length > 0) ? new RegExp(game.room.backgroundNames.join("|")) : false;
  },

  BACK_REGEX:/\[.+?\]/,
  
};





const game = createObject("game", [{
  verbosity:VERBOSE,
  transcript:false,
  transcriptText:[],
  spoken:false,
  turnCount:0,
  elapsedTime:0,
  elapsedRealTime:0,
  startTime:DATE_TIME_START,
  gameState:[],
  name:'built-in_game_object',
  isAtLoc:function() { return false; },
  
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
      errormsg("No player location set or set to location that does no exist. This will not go well...");
    }
    this.room = w[this.player.loc];
    //debugmsg("About to take snapshot");
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
    //endTurnUI();
    //io.updateUIItems();
  },
  
  // UNDO SUPPORT
  saveGameState:function() {
    if (MAX_UNDO > 0) {
      this.gameState.push(saveLoad.getSaveBody());
      if (this.gameState.length > MAX_UNDO) this.gameState.shift();
    }
  },
  
  // TRANSCRIPT SUPPORT
  scriptStart:function() {
    this.transcript = true;
    metamsg("Transcript is now on.");
  },
  scriptEnd:function() {
    metamsg("Transcript is now off.");
    this.transcript = false;
  },
  scriptShow:function(opts) {
    if (opts === undefined) opts = '';
    let html = '';
    for (let i = 0; i < this.transcriptText.length; i++) {
      const s = this.transcriptText[i].substring(1);
      switch (this.transcriptText[i][0]) {
        case '-': html += '<p>' + s + '</p>'; break;
        case 'M': if (!opts.includes('m')) {html += '<p style="color:blue">' + s + '</p>';} break;
        case 'E': if (!opts.includes('e')) {html += '<p style="color:red">' + s + '</p>';} break;
        case 'D': if (!opts.includes('d')) {html += '<p style="color:grey">' + s + '</p>';} break;
        case 'P': if (!opts.includes('p')) {html += '<p style="color:magenta">' + s + '</p>';} break;
        case 'I': if (!opts.includes('i')) {html += '<p style="color:cyan">' + s + '</p>';} break;
        default : html += '<h' + this.transcriptText[i][0] + '>' + s + '</h' + this.transcriptText[i][0] + '>'; break;
      }
    }
    io.showHtml("Transcript", html);
  },
  scriptClear:function() {
    this.transcriptText = [];
    metamsg("Transcript cleared.");
  },
  scriptAppend:function(s) {
    this.transcriptText.push(s);
  },
  
  
  timerEvents:[],  // These will not get saved!!!
  eventFunctions:{},
  registerEvent:function(eventName, func) {
    this.eventFunctions[eventName] = func;
  },
  registerTimedEvent:function(eventName, triggerTime, interval) {
    this.timerEvents.push({eventName:eventName, triggerTime:triggerTime + game.elapsedRealTime, interval:interval});
  },
  gameTimer:function() {
    // Note that this gets added to window by setInterval, so 'this' does not refer to the game object
    game.elapsedRealTime++;
    for (let i = 0; i < game.timerEvents.length; i++) {
      if (game.timerEvents[i].triggerTime && game.timerEvents[i].triggerTime < game.elapsedRealTime) {
        if (typeof(game.eventFunctions[game.timerEvents[i].eventName]) === 'function') {
          const flag = game.eventFunctions[game.timerEvents[i].eventName]();
          if (game.timerEvents[i].interval && !flag) {
            game.timerEvents[i].triggerTime += game.timerEvents[i].interval;
          }
          else {
            delete game.timerEvents[i].triggerTime;
          }
        }
        else {
          errormsg("A timer is trying to call event '" + game.timerEvents[i].eventName + "' but no such function is registered.");
          //console.log(game.eventFunctions);
        }
      }
    }
  },
  preSave:function() {
    const arr = [];
    for (let i = 0; i < game.timerEvents.length; i++) {
      if (game.timerEvents[i].triggerTime) {
        arr.push(game.timerEvents[i].eventName + "/" + game.timerEvents[i].triggerTime + "/" + (game.timerEvents[i].interval ? game.timerEvents[i].interval : '-'));
      }
    }
    game.timeSaveAttribute = arr.join(" ");
    //console.log(game.timeSaveAttribute);
  },
  postLoad:function() {
    //console.log(game.timeSaveAttribute);
    game.timerEvents = [];
    const arr = game.timeSaveAttribute.split(' ');
    //console.log(arr.length);
    //console.log("Time:" + game.elapsedRealTime);
    for (let i = 0; i < arr.length; i++) {
      const params = arr[i].split('/');
      const interval = params[2] === '-' ? undefined : parseInt(params[2]);
      //console.log(params[2]);
      //console.log(interval);
      game.timerEvents.push({eventName:params[0], triggerTime:parseInt(params[1]), interval:interval});
    }
    //console.log(game.timerEvents);
    delete game.timeSaveAttribute;
  },
  
  
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




