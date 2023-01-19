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
  const args = Array.prototype.slice.call(arguments)
  const o = createItemOrRoom(args, DEFAULT_ITEM, settings.itemCreateFunc)

  // Create topics from convTopics
  if (o.convTopics) {
    o.convTopics.forEach(function (value, i) {
      value.loc = o.name
      createItem(value.name ? value.name : o.name + '_convTopic_' + i, TOPIC(), value)
    })
    delete o.convTopics
  }
  return o
}



//@DOC
// Use this to create a new room (as opposed to an item).
// It adds various defaults that apply only to items
// The first argument should be a string - a unique name for this object, composed only of letters, numbers and underscores.
// It will than take any number of dictionaries that will be combined to set the properties.
// Generally objects should not be created during play as they will not be saved properly.
// Either keep the object hodden until required or clone existing objects.
function createRoom() {
  const args = Array.prototype.slice.call(arguments)
  const o = createItemOrRoom(args, DEFAULT_ROOM, settings.roomCreateFunc)
  o._region = region
  if (o.scenery) {
    for (const x of o.scenery) {
      const el = typeof x === 'string' ? {alias:x} : x 
      const alias = Array.isArray(el.alias) ? el.alias.shift() : el.alias
      const aliases = Array.isArray(el.alias) ? el.alias : []
      if (!alias) throw "ERROR: Scenery item is missing an alias in room: " + o.name
      const obj = createItem(o.name + '_scenery_' + alias.replace(/\W/g, ''), {
        loc:o.name,
        alias:alias,
        synonyms:aliases,
        scenery:true,
        examine:el.examine ? el.examine : lang.default_description,
      })
      delete el.alias
      delete el.examine
      for (const key in el) obj[key] = el[key]
    }
    delete o.scenery
  }
  return o
}


function createItemOrRoom(args, defaults, createFunc) {
  const name = args.shift()
  args.unshift(defaults)
  const o = createObject(name, args)
  if (createFunc) createFunc(o)
  return o
}



//@DOC
// Use this to create new items during play. The given item will be cloned at the given location.
// The `newName` is optional, one will be generated if not supplied. If you do supply one bear inmid that
// every clone must have a unique name.
function cloneObject(item, loc, newName) {
  if (item === undefined) { return errormsg("Item is not defined.") }
  if (typeof item === 'string') {
    const o = w[item]
    if (o === undefined) { return errormsg("No item called '" + item + "' found in cloneObject.") }
    item = o
  }
  if (!newName) newName = item.name
  const clone = {};
  for (let key in item) clone[key] = item[key]
  clone.name = util.findUniqueName(newName)
  if (!clone.clonePrototype) {
    clone.clonePrototype = item
  }
  if (loc !== undefined) {
    clone.loc = loc;
  }

  clone.getSaveStringPreamble = function(item) {
    return "Clone:" + this.clonePrototype.name + "="
  }
  
  w[clone.name] = clone
  return clone
}



//@DOC
// Use this to create new items before play. The given item will be cloned at the given location.
// The `newName` is optional, one will be generated if not supplied. If you do supply one bear in mind that
// every copy must have a unique name.
function copyObject(item, loc, newName) {
  if (world.isCreated) { return errormsg("Attempting to copy item after the game has started") }
  if (item === undefined) { return errormsg("Item is not defined.") }
  if (typeof item === 'string') {
    const o = w[item]
    if (o === undefined) { return errormsg("No item called '" + item + "' found in copyObject.") }
    item = o
  }
  if (!newName) newName = item.name
  
  
  const copy = {...item,
    verbFunctions:[world.defaultVerbFunction],
    initialiserFunctions:[...item.initialiserFunctions],
  };
  copy.name = util.findUniqueName(newName)
  if (loc !== undefined) {
    copy.loc = loc;
  }

  w[copy.name] = copy
  return copy
}





//@DOC
// Creates a basic object. Generally it is better to use CreateItem or CreateRoom.
// List of hashes will contain the hash that is common to everything, then the hash that is common to rooms or item, then any templates in oder and finally the author's data
function createObject(name, listOfHashes) {
  if (world.isCreated && !settings.saveDisabled) return errormsg("Attempting to use createObject with `" + name + "` after set up. To ensure games save properly you should use cloneObject to create ites during play.")
  if (/\W/.test(name)) return errormsg("Attempting to use the prohibited name `" + name + "`; a name can only include letters and digits - no spaces or accented characters. Use the 'alias' attribute to give an item a name with other characters.")
  if (w[name]) return errormsg("Attempting to use the name `" + name + "` when there is already an item with that name in the world.")
  if (typeof listOfHashes.unshift !== 'function') return errormsg("The list of hashes for `" + name + "` is not what I was expecting. Maybe you meant to use createItem or createRoom?")

  // put the default attributes on the list
  listOfHashes.unshift(DEFAULT_OBJECT)
  
  const item = { name:name }
  
  for (let hash of listOfHashes) {
    for (let key in hash) {
      item[key] = hash[key]
    }
  }

  // Give every object an alias and list alias (used in the inventories)
  item.setAlias(item.alias ? item.alias : item.name.replace(/_/g, " "), item)

  item.verbFunctions = [world.defaultVerbFunction]
  item.nameModifierFunctions = []
  item.initialiserFunctions = []
  for (let hash of listOfHashes) {
    if (hash.afterCreation) item.initialiserFunctions.push(hash.afterCreation)
  }

  w[name] = item;
  return item;
}





let player, currentLocation







/*
This can be considered a stateless controller for the game world.
It is stateless because nothing here will be saved - use `game` for that.
It handles initialising, turn taking, room entering
*/
const world = {
  //VISIBLE:1,
  //REACHABLE:2,

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
  LOOK:1,
  PARSER:2,
  INVENTORY:3,
  SIDE_PANE:4,
  PURCHASE:5,
  ALL:6,
  
  // constants for command responses
  // (but a verb will return true or false, so the command that uses it
  // can in turn return one of these - a verb is an attribute of an object)
  SUCCESS:1,                             
  SUCCESS_NO_TURNSCRIPTS:2,
  FAILED:-1,
  PARSER_FAILURE:-2,

  isCreated:false,
  



  
  //------------------------------------------------------------
  // Initialisation

  init:function() {
    settings.performanceLog('Start world.init')
    // Initialise the player
    for (let key in w) {
      if (w[key].player) { player = w[key]; }
    }
    if (!player) {
      errormsg("No player object found. This is probably due to an error in the data file where the player object is defined, but could be because you have not set one.");
      return;
    }

    // Initialise all object
    for (let key in w) {
      world.initItem(w[key])
    }
    
    // Initialise commands
    initCommands()
    
    settings.verbosity = world.VERBOSE

    game.ticker = setInterval(world.gameTimer, settings.timerInterval);

    w[player.loc].visited++
    world.update()
    world.saveGameState()
    settings.performanceLog('End world.init')
    world.isCreated = true
  },
  // Every item or room should have this called for them.
  // That will be done at the start, but you need to do it yourself 
  // if creating items on the fly (but you should not be doing that anyway!).
  initItem:function(item) {
    if (item.clonePrototype) return errormsg('Trying to initiaslise a cloned object. This is not permitted, as the prototype will not have been initialised before it was cloned. Instead, clone the object in settings.setup.')
    // remove duplicates first - can occur if a template adds another template and the author does so too
    for (const f of [...new Set(item.initialiserFunctions)]) f(item)
    delete item.initialiserFunctions
    delete item.afterCreation  

    // Initialise exits
    for (let exit of lang.exit_list) {
      // So exit is the data object from lang, while ex is the Exit the author has created
      const ex = item[exit.name]
      if (ex) {
        ex.origin = item
        ex.dir = exit.name
        if (ex.alsoDir) {
          for (let dir of ex.alsoDir) {
            item[dir] = new Exit(ex.name, ex);
            item[dir].scenery = true
            item[dir].isAlsoDir = true
            item[dir].dir = dir
            delete item[dir].alsoDir
          }
        }
        if (ex instanceof Link) {
          const reverseDir = ex.reverse()
          const dest = w[ex.name]
          if (dest[reverseDir]) {
            log('WARNING: The returning Exit for the Link on ' + item.name + ' goes to a direction that already has something set (conflicts with "' + reverseDir + '" on ' + dest.name + ').')
            continue
          }
          dest[reverseDir] = new Exit(ex.origin.name)
          dest[reverseDir].origin = dest
          dest[reverseDir].dir = reverseDir
        }
      }
    }
    
    
    // Handle room set
    if (item.roomSet) {
      if (!settings.roomSetList[item.roomSet]) {
        settings.roomSetList[item.roomSet] = []
      }
      settings.roomSetList[item.roomSet].push({name:item.name, visited:false})
    }



    if (settings.playMode === 'dev' && !settings.disableChecks && !item.abstract) {
      if (item.loc && !w[item.loc]) {
        warningFor(item, "In an unknown location (" + item.loc + ")");
      }

      if (item.consultable && !settings.noAskTell) {
        if (!item.tellOptions || item.tellOptions.length === 0) warningFor(item, "No tellOptions for consultable/NPC")
        if (!item.askOptions || item.askOptions.length === 0) warningFor(item, "No askOptions for consultable/NPC")
      }

      const dirs = lang.exit_list.filter(el => el.type !== 'nocmd').map(el => el.name)
      //console.log(dirs)
      for (let key in item) {
        if (dirs.includes(key)) {
          if (!item[key] instanceof Exit) warningFor(item, "Exit " + key + " is not an Exit instance.")
          if (item[key].name !== '_' && !w[item[key].name]) warningFor(item, "Exit " + key + " goes to an unknown location (" + item[key].name + ").")
        }
        else {
          if (item[key] instanceof Exit) warningFor(item, "Attribute " + key + " is an Exit instance and probably should not.")
        }
      }
      
      if (item.abstract) {
        // do nothing
      }
      if (item.room) {
        if (typeof item.desc === 'function') {
          try {
            test.testing = true
            test.testOutput = []
            const out = item.desc()
            test.testing = false
            if (test.testOutput.length > 0) warningFor(item, "The 'desc' attribute for this location is a function that prints directy to screen; should return a string only: " + item.name)
            if (typeof out !== 'string') {
              warningFor(item, "The 'desc' function attribute does not return a string")
            }
          }
          catch(err) {
            warningFor(item, "The 'desc' function caused an error")
            log(err.message)
            log(err.stack)
          }
        } else if (typeof item.desc !== 'string') {
          warningFor(item, "The 'desc' attribute for this location is neither a string nor a function")
        }
      }
      else if (item.conversationTopic) {
        if (!item.msg && !item.script) warningFor(item, "Topic has neither 'script' or 'msg' attribute")
        if (item.msg && typeof item.msg !== 'string') warningFor(item, "The 'msg' attribute for this topic is not a string")
        if (item.script && typeof item.script !== 'function') warningFor(item, "The 'script' attribute for this topic is not a function")
      }
      else {
        if (typeof item.examine === 'function') {
          try {
            test.testing = true
            test.testOutput = []
            const out = item.examine({char:player, item:item})
            test.testing = false
            if (out !== undefined) {
              warningFor(item, "The 'examine' function attribute returns a value; it probably should not")
            }
          }
          catch(err) {
            warningFor(item, "The 'examine' function caused an error")
            log(err.message)
            log(err.stack)
          }
        }
        else if (typeof item.examine !== 'string') {
          warningFor(item, "The 'examine' attribute for this item is neither a string nor a function")
        }
      }
      if (settings.customObjectChecks) settings.customObjectChecks(item)
    }


  },

  // Start the game - could be called after the start up dialog, so not part of init
  begin:function() {
    settings.performanceLog('Start begin')
    if (settings.startingDialogEnabled) return
    if (typeof settings.intro === "string") {
      msg(settings.intro)
    }
    else if (settings.intro) {
      for (let el of settings.intro) msg(el)
    }
    if (typeof settings.setup === "function") settings.setup()
    world.enterRoom()
    settings.performanceLog('End begin')
  },




  //------------------------------------------------------------
  // Turn taking

  // Call after the player takes a turn, sending it a result, SUCCESS, SUCCESS_NO_TURNSCRIPTS or FAILED
  endTurn:function(result) {
    if (result === true) log("That command returned 'true', rather than the proper result code.");
    if (result === false) log("That command returned 'false', rather than the proper result code.");
    util.handleChangeListeners()
    if (result === world.SUCCESS || (settings.failCountsAsTurn && result === world.FAILED)) {
      game.turnCount++
      game.elapsedTime += settings.dateTime.secondsPerTurn;
      for (const key in w) w[key].endTurn()
      for (const m of settings.modulesToEndTurn) m.endTurn()
       
      util.handleChangeListeners()
      world.resetPauses();
      world.update();
      world.saveGameState();
      endTurnUI(true);
    }
    else {
      endTurnUI(false);
    }
  },


  // Updates the game world, specifically...
  // Sets the scoping snapshot
  // Sets the light/dark
  update:function() {
    if (!player) return errormsg("No player object found. This will not go well...")
    if (player.loc === player.name) return errormsg("The location assigned to the player is the player itself.")
    if (!player.loc || !w[player.loc]) {
      if (world.isCreated) {
        return errormsg((player.loc === undefined ? "No player location set." : "Player location set to '" + player.loc + "', which does not exist.") + " Has the player just moved? This is likely to be because of an error in the exit being used.")
      }
      else {
        return errormsg((player.loc === undefined ? "No player location set." : "Player location set to '" + player.loc + "', which does not exist.") + " This is may be because of an error in one of the .js files; the browser has hit the error and stopped at that point, before getting to where the player is set. Is there another error above this one? If so, that i the real problem.")
      }
    }
    currentLocation = w[player.loc]
    
    world.scopeSnapshot()
  },




  resetPauses:function() {
    for (let key in w) {
      if (w[key].paused){
        w[key].paused = false
      }
    }
  },

  // Returns true if bad lighting is not obscuring the item
  ifNotDark:function(item) {
    return (!game.dark || item.lightSource() > world.LIGHT_NONE);
  },

  // scopeStatus is used to track what the player can see and reach; it is a lot faster than working
  // it out each time, as the scope needs to be checked several times every turn.
  scopeSnapshot:function() {
    // reset every object
    for (let key in w) w[key].scopeStatus = {}
    world.scope = []

    world.takeScopeSnapshot("See")
    world.takeScopeSnapshot("Reach")
    if (!world.scope.includes(currentLocation)) world.scope.push(currentLocation)
    if (player.onPhoneTo && !world.scope.includes(w[player.onPhoneTo])) world.scope.push(w[player.onPhoneTo])

    let light = world.LIGHT_NONE
    for (const item of world.scope) {
      if (!item.lightSource) log(item.name)
      if (light < item.lightSource()) {
        light = item.lightSource()
      }
    }
    game.dark = (light < world.LIGHT_MEAGRE)
  },
  
  
  // mode is either "Reach" or "See"
  takeScopeSnapshot:function(mode) {
    // start from the current room
    let room = currentLocation
    room.scopeStatus['room' + mode] = true
    // crawl up the room hierarchy to the topmost reachable/visible
    while (room.loc && room['can' + mode + 'ThroughThis']()) {
      room = w[room.loc]
      room.scopeStatus['room' + mode] = true
    }
    // room is now the top level applicable, so now work downwards from here (recursively)
    room.scopeSnapshot(mode)
  },
  
  defaultVerbFunction:function(o, verbList) {
    verbList.push(lang.verbs.examine)
    if (o.use !== undefined) verbList.push(lang.verbs.use)
  },

  //------------------------------------------------------------
  // Entering a new room

  // Runs the script and gives the description
  enterRoom:function(exit) {
    if (currentLocation.beforeEnter === undefined) {
      return errormsg("This room, " + currentLocation.name + ", has no 'beforeEnter` function defined.  This is probably because it is not actually a room (it was not created with 'createRoom' and has not got the DEFAULT_ROOM template), but is an item. It is not clear what state the game will continue in.")
    }
    settings.beforeEnter(exit)
    if (currentLocation.visited === 0) {
      if (currentLocation.roomSet) {
        currentLocation.roomSetOrder = 1
        for (const el of settings.roomSetList[currentLocation.roomSet]) {
          if (el.visited) currentLocation.roomSetOrder++
          if (el.name === currentLocation.name) el.visited = true
        }
      }
      currentLocation.beforeFirstEnter(exit)
    }
    currentLocation.beforeEnter(exit)
    world.enterRoomAfterScripts(exit);
  },

  // Called when entering a new room, after beforeEnter and beforeFirstEnter re done
  enterRoomAfterScripts:function(exit) {
    currentLocation.description()
    player.handleMovingFollowers(exit) 
    currentLocation.visited++
    currentLocation.afterEnter(exit)
    settings.afterEnter(exit)
    if (currentLocation.visited === 1) { currentLocation.afterFirstEnter(exit) }
    for (let key in currentLocation.afterEnterIf) {
      // if already done, skip
      if (currentLocation.afterEnterIfFlags.split(" ").includes(key)) continue;
      if (currentLocation.afterEnterIf[key].test()) {
        currentLocation.afterEnterIf[key].action()
        currentLocation.afterEnterIfFlags += " " + key
      }
    }
  },
  
  

  //------------------------------------------------------------
  // Real time event handling
  gameTimer:function() {
    // Note that this gets added to window by setInterval, so 'this' does not refer to the game object
    game.elapsedRealTime++;
    let somethingHappened = false
    for (let i = 0; i < game.timerEventNames.length; i++) {
      if (game.timerEventTriggerTimes[i] && game.timerEventTriggerTimes[i] < game.elapsedRealTime) {
        const flag = settings.eventFunctions[game.timerEventNames[i]]()
        if (game.timerEventIntervals[i] !== -1 && !flag) {
          game.timerEventTriggerTimes[i] += game.timerEventIntervals[i]
        }
        else {
          game.timerEventTriggerTimes[i] = 0
        }
        somethingHappened = true
      }
    }
    if (somethingHappened) util.handleChangeListeners()
  },


  //------------------------------------------------------------
  // UNDO Support
  gameState:[],
  saveGameState:function() {
    if (settings.maxUndo > 0) {
      world.gameState.push(saveLoad.getSaveBody());
      if (world.gameState.length > settings.maxUndo) world.gameState.shift();
    }
  },
  
  find:function(fn, options) {
    for (const key in w) {
      if (fn(w[key], options)) return w[key]
    }
    return null
  }
}





const game = {
  turnCount:0,
  elapsedTime:0,
  elapsedRealTime:0,
  startTime:settings.dateTime.start,
  name:'built-in_game_object',
  
  timerEventNames:[],
  timerEventTriggerTimes:[],
  timerEventIntervals:[],

  getSaveString:function() {
    let s = "GameState="
    for (const key in this) {
      if (!this.saveLoadExclude(key)) s += saveLoad.encode(key, this[key])
    }
    return s
  },
  setLoadString:function(s) {
    const parts = s.split("=")
    if (parts.length !== 2) return errormsg("Bad format in saved data (" + s + ")")
    if (parts[0] !== "GameState") return errormsg("Expected GameState to be second")
    saveLoad.setFromArray(this, parts[1].split(";"));
  },
  saveLoadExclude:function(att) {
    return (att === 'player' || typeof this[att] === 'function' || typeof this[att] === 'object')
  },
}






class Exit {
  constructor(name, hash) {
    if (!hash) hash = {}
    this.name = name
    // set these from util so the defaults can be modified
    this.use = util.defaultExitUse
    this.isGuarded = util.defaultExitIsGuarded
    this.getExitObject = function() { return lang.exit_list.find(el => el.name === this.dir ) }
    this.nice = function() {
      const dirObj = this.getExitObject()
      return dirObj.niceDir ? dirObj.niceDir : dirObj.name
    }
    this.reverseNice = function() {
      const dirObj = this.reverseObject()
      return dirObj.niceDir ? dirObj.niceDir : dirObj.name
    }
    this.reverse = function() { return this.getExitObject().opp }
    this.reverseObject = function() {
      const dir = this.getExitObject().opp
      return lang.exit_list.find(el => el.name === dir)
    }
    this.isLocked = function() { return this.origin.isExitLocked(this.dir); }
    this.setLock = function(locked) { return this.origin.setExitLock(this.dir, locked); }
    this.isHidden = function() { return this.origin.isExitHidden(this.dir) }
    this.setHide = function(hidden) { return this.origin.setExitHide(this.dir, hidden); }
    for (let key in hash) {
      if (key !== 'name') this[key] = hash[key];
    }
  }
}

class Link extends Exit {
  constructor(name, hash) {
    super(name, hash)
  }  
}



let region
const regions = {}
const setRegion = function(name, data) {
  region = name
  regions[name] = data
}
