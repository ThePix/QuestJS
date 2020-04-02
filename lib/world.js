'use strict'
import { util, saveLoad, settings, io, lang, commands } from 'module'
// This is where the world exist!
const w = {} // // -fixme: don't be cheep while naming the central object, use a full word, autocomlete is smart enough to know what you mean anyways

// @DOC
// ## World Functions
//
// These are functions for creating objects in the game world
// @UNDOC

// @DOC
// Use this to create a new item (as opposed to a room).
// It adds various defaults that apply only to items.
// The first argument should be a string - a unique name for this object, composed only of letters, numbers and underscores.
// It will than take any number of dictionaries that will be combined to set the properties.
// Generally objects should not be created during play as they will not be saved properly.
// Either keep the object hodden until required or clone existing objects.
function createItem () {
  const args = Array.prototype.slice.call(arguments)
  const name = args.shift()
  args.unshift(util.DEFAULT_ITEM)
  return createObject(name, args)
}

// @DOC
// Use this to create a new room (as opposed to an item).
// It adds various defaults that apply only to items
// The first argument should be a string - a unique name for this object, composed only of letters, numbers and underscores.
// It will than take any number of dictionaries that will be combined to set the properties.
// Generally objects should not be created during play as they will not be saved properly.
// Either keep the object hodden until required or clone existing objects.
function createRoom () {
  const args = Array.prototype.slice.call(arguments)
  const name = args.shift()
  args.unshift(util.DEFAULT_ROOM)
  return createObject(name, args)
}

// @DOC
// Use this to create new items during play. The given item will be cloned at the given location.
// The `newName` isoptional, one will be generated if not supplied. If you do supply one bear inmid that
// every clone must have a unique name.
function cloneObject (item, loc, newName) {
  if (item === undefined) { console.log('Item is not defined.') }
  const clone = {}
  for (const key in item) {
    clone[key] = item[key]
  }
  clone.name = newName === undefined ? world.findUniqueName(item.name) : newName
  if (!clone.clonePrototype) {
    clone.clonePrototype = item
  }
  if (loc !== undefined) {
    clone.loc = loc
  }

  clone.getSaveString = function (item) {
    this.templatePreSave()
    let s = 'Clone:' + this.clonePrototype.name + '='
    for (const key in this) {
      if (typeof this[key] !== 'function' && typeof this[key] !== 'object') {
        if (key !== 'desc' && key !== 'examine' && key !== 'name') {
          s += saveLoad.encode(key, this[key])
        }
        if (key === 'desc' && this.mutableDesc) {
          s += saveLoad.encode(key, this[key])
        }
        if (key === 'examine' && this.mutableExamine) {
          s += saveLoad.encode(key, this[key])
        }
      }
    }
    return s
  }
  w[clone.name] = clone
  return clone
}

// @DOC
// Creates a basic object. Generally it is better to use CreateItem or CreateRoom.
function createObject (name, listOfHashes) {
  if (world.isCreated && !settings.saveDisabled) {
    console.log('Attempting to use createObject with `' + name + '` after set up. To ensure games save properly you should use cloneObject to create ites during play.')
    io.errorio.msg('Attempting to use createObject with `' + name + '` after set up. To ensure games save properly you should use cloneObject to create ites during play.')
    return null
  }

  if (/\W/.util.test(name)) {
    console.log('Attempting to use the disallowed name `' + name + "`; a name can only include letters and digits - no util.spaces or accented characters. Use the 'alias' attribute to give an item a name with other characters.")
    io.errorio.msg('Attempting to use the disallowed name `' + name + "`; a name can only include letters and digits - no util.spaces or accented characters. Use the 'alias' attribute to give an item a name with other characters.")
    return null
  }
  if (w[name]) {
    console.log('Attempting to use the name `' + name + '` when there is already an item with that name in the world.')
    io.errorio.msg('Attempting to use the name `' + name + '` when there is already an item with that name in the world.')
    return null
  }

  listOfHashes.unshift(util.DEFAULT_OBJECT)

  const item = {
    name: name
  }

  for (const hash of listOfHashes) {
    for (const key in hash) {
      item[key] = hash[key]
    }
  }

  // Give every object an alias and list alias (used in the inventories)
  if (!item.alias) item.alias = item.name.replace(/_/g, ' ')
  if (!item.listalias) item.listalias = util.sentenCecase(item.alias)
  if (!item.getListAlias) item.getListAlias = function (loc) { return this.listalias }
  if (!item.pluralAlias) item.pluralAlias = item.alias + 's'
  if (item.pluralAlias === '*') item.pluralAlias = item.alias

  // world.data.push(item);
  w[name] = item
  return item
}

const world = {
  isCreated: false,
  exits: [],

  findUniqueName: function (s) {
    if (!w[s]) {
      return (s)
    } else {
      const res = /(\d+)$/.exec(s)
      if (!res) {
        return world.findUniqueName(s + '0')
      }
      const n = parseInt(res[0]) + 1
      return world.findUniqueName(s.replace(/(\d+)$/, '' + n))
    }
  },

  init: function () {
    // Sort out the player
    let player
    for (const key in w) {
      if (w[key].player) { player = w[key] }
    }
    if (!player) {
      io.errorio.msg('No player object found. This is probably due to an error in data.js. Do [Ctrl][Shft]-I to open the developer tools, and go to the console tab, and look at the first error in the list (if it mentions jQuery, skip it and look at the second one). It should tell you exactly which line in which file. But also check one object is actually flagged as the player.')
      return
    }
    game.update(player)

    // Create a background item if it does not exist
    // This handles the player wanting to interact with things in room descriptions
    // that are not implemented by changing its regex when a room is entered.
    if (w.background === undefined) {
      w.background = createItem('background', {
        scenery: true,
        examine: lang.default_description,
        background: true,
        name: 'default_background_object',
        lightSource: function () { return util.LIGHT_none },
        isAtLoc: function (loc, situation) {
          if (typeof loc !== 'string') loc = loc.name
          if (!w[loc]) io.errorio.msg('Unknown location: ' + loc)
          return w[loc] && w[loc].room && situation === util.display.PARSER
        }
      })
    }
    if (!w.background.background) {
      io.errorio.msg("It looks like an item has been named 'background`, but is not set as the background item. If you intended to do this, ensure the background property is set to true.")
    }

    for (const key in w) {
      world.initItem(w[key])
    }
    this.isCreated = true

    // Go through each command
    commands.initCommands()

    // Set up the UI
    // endTurnUI();
    io.msgHeading(settings.title, 2)
    if (settings.subtitle) io.msgHeading(settings.subtitle, 3)
    io.setTitle(settings.title)

    game.ticker = setInterval(game.gameTimer, 1000)
  },

  // Every item or room should have this called for them.
  // That will be done at the start, but you need to do it yourself
  // if creating items on the fly.
  initItem: function (item) {
    if (item.loc && !w[item.loc]) {
      io.errorio.msg('The item `' + item.name + '` is in an unknown location (' + item.loc + ')')
    }
    for (const exit of lang.exit_list) {
      const ex = item[exit.name]
      if (ex) {
        ex.origin = item
        ex.dir = exit.name
        world.exits.push(ex)
        if (ex.alsoDir) {
          for (const dir in ex.alsoDir) {
            item[dir] = new Exit(ex.name, ex)
            item[dir].scenery = true
          }
        }
      }
    }
  },

  // Call after the player takes a turn, sending it a result, util.SUCCESS, util.SUCCESS_NO_TURNSCRIPTS or util.FAILED
  endTurn: function (result) {
    // io.debugmsg("endTurn=" + result);
    if (result === true) io.debugmsg("That command returned 'true', rather than the proper result code.")
    if (result === false) io.debugmsg("That command returned 'false', rather than the proper result code.")
    if (result === util.SUCCESS || (settings.failCountsAsTurn && result === util.FAILED)) {
      game.turnCount++
      game.elapsedTime += settings.dateTime.secondsPerTurn
      // events.runEvents();
      for (const key in w) {
        w[key].doEvent()
      }
      world.resetPauses()
      game.update()
      game.saveGameState()
      endTurnUI(true) // // -review: why would you handle this here?
    } else {
      endTurnUI(false)
    }
  },

  resetPauses: function () {
    for (const key in w) {
      if (w[key].paused) {
        delete w[key].paused
      }
    }
  },

  // Returns true if bad lighting is not obscuring the item
  ifNotDark: function (item) {
    return (!game.dark || item.lightSource() > util.LIGHT_none)
  },

  // scopeStatus is used to track what the player can see and reach; it is a lot faster than working
  // it out each time, as this needs to be used several times every turn.
  scopeSnapshot: function () {
    // reset every object
    for (const key in w) {
      delete w[key].scopeStatus
      delete w[key].scopeStatusForRoom
    }

    // start from the current room
    const room = w[game.player.loc]
    if (room === undefined) {
      io.errorio.msg('Error in scopeSnapshot; the location assigned to the player does not exist.')
    }
    room.scopeStatusForRoom = util.REACHABLE
    // crawl up the room hierarchy to the topmost visible
    while (room.loc && room.canReachThrough()) {
      room = w[room.loc] // -fixme: you are trying to reassing a constant
      room.scopeStatusForRoom = util.REACHABLE
    }
    // room is now the top level applicable, so now work downwards from here (recursively)

    room.scopeSnapshot(false)

    // Also want to go further upwards if room is transparent
    while (room.loc && room.canSeeThrough()) {
      room = w[room.loc] // -fixme: you are trying to reassing a constant
      room.scopeStatusForRoom = util.VISIBLE
    }
    // room is now the top level applicable

    room.scopeSnapshot(true)
  },

  // Sets the current room to the one named
  //
  // Can also be used to move an NPC, but just gives a message and set "loc"
  // however, this does make it char-neutral.
  // Suppress output (if done elsewhere) by sending false for dir
  setRoom: function (char, roomName, dir) {
    if (char !== game.player) {
      if (dir) {
        io.msg(lang.stop_posture(char))
        io.msg(lang.npc_heading(char, dir))
      }
      char.previousLoc = char.loc
      char.loc = roomName
      return true
    }

    if (game.player.loc === roomName) {
      // Already here, do nothing
      return false
    }
    const room = w[roomName]
    if (room === undefined) {
      io.errorio.msg('Failed to find room: ' + roomName + '.')
      return false
    }

    if (settings.clearScreenOnRoomEnter) util.clearScreen()

    game.room.onExit()

    char.previousLoc = char.loc
    char.loc = room.name
    game.update()
    world.setBackground()
    if (dir !== 'suppress') {
      world.enterRoom()
    }
    return true
  },

  // Runs the script and gives the description
  enterRoom: function () {
    if (game.room.beforeEnter === undefined) {
      io.errorio.msg('This room, ' + game.room.name + ", has no 'beforeEnter` function defined.  This is probably because it is not actually a room (it was not created with 'createRoom' and has not got the DEFAULT_ROOM template), but it an item. It is not clear what state the game will continue in.")
      return
    }
    game.room.beforeEnter()
    if (game.room.visited === 0) { game.room.beforeFirstEnter() }
    world.enterRoomAfterScripts()
  },

  // Called when entering a new room, after beforeEnter and beforeFirstEnter re done
  enterRoomAfterScripts: function () {
    game.room.description()
    game.room.afterEnter()
    if (game.room.visited === 0) { game.room.afterFirstEnter() }
    if (game.room.afterEnterIf) {
      for (const key in game.room.afterEnterIf) {
        if (game.room.afterEnterIfFlags.split(' ').includes(key)) continue
        if (game.room.afterEnterIf[key].util.test()) {
          game.room.afterEnterIf[key].action
          game.room.afterEnterIfFlags += ' ' + key
        }
      }
    }
    game.room.visited++
  },

  // Call this when entering a new room
  // It will set the regex of the ubiquitous background object
  // to any objects highlighted in the room description.
  setBackground: function () {
    let md // -fixme is it MarkDown? or does this stand for a doctorate in medicine?
    if (typeof game.room.desc === 'string') {
      if (!game.room.backgroundNames) {
        game.room.backgroundNames = []
        while (md = world.BACK_REGEX.exec(game.room.desc)) { // yes it is an assignment! // -fixme yes this is garbage
          const arr = md[0].substring(1, md[0].length - 1).split(':')
          game.room.desc = game.room.desc.replace(md[0], arr[0])
          for (const el of arr) game.room.backgroundNames.push(el)
        }
      }
    }
    w.background.regex = (game.room.backgroundNames && game.room.backgroundNames.length > 0) ? new RegExp(game.room.backgroundNames.join('|')) : false
  },

  BACK_REGEX: /\[.+?\]/

}

const game = createObject('game', [{
  verbosity: util.VERBOSE,
  transcript: false,
  transcriptText: [],
  spoken: false,
  turnCount: 0,
  elapsedTime: 0,
  elapsedRealTime: 0,
  startTime: settings.dateTime.start,
  gameState: [],
  name: 'built-in_game_object',
  isAtLoc: function () { return false },

  initialise: function () {
    world.init()
    game.update()
    game.saveGameState()
    world.setBackground()
  },

  begin: function () {
    if (typeof settings.intro === 'string') io.msg(settings.intro)
    if (typeof settings.setup === 'function') settings.setup()
    world.enterRoom()
  },

  // Updates the game world, specifically...
  // Sets game.player and game.room
  // Sets the scoping snapshot
  // Sets the light/dark
  update: function (player) {
    // io.debugmsg("update");
    if (player !== undefined) {
      this.player = player
    }

    if (!this.player) {
      io.errorio.msg('No player object found. This will not go well...')
      return
    }
    if (!this.player.loc || !w[this.player.loc]) {
      io.errorio.msg('No player location set or set to location that does no exist. This will not go well...')
      io.errorio.msg("This is likely to be because of an error in one of the .js files. Press F12, and go to the 'Console' tab (if not already open), to see the error. Look at the vey first error (but ignore any that mentions 'jquery'). It should tell you the file and line number that is causing the problem.")
    }
    this.room = w[this.player.loc]
    // io.debugmsg("About to take snapshot");
    world.scopeSnapshot()

    let light = util.LIGHT_none
    for (const key in w) {
      if (w[key].scopeStatus) {
        if (light < w[key].lightSource()) {
          light = w[key].lightSource()
        }
      }
    }
    this.dark = (light < util.LIGHT_MEAGRE)
    // endTurnUI();
    // io.updateUIItems();
  },

  // UNDO SUPPORT
  saveGameState: function () {
    if (settings.maxUndo > 0) {
      this.gameState.push(saveLoad.getSaveBody())
      if (this.gameState.length > settings.maxUndo) this.gameState.shift()
    }
  },

  // TRANSCRIPT SUPPORT
  scriptStart: function () {
    this.transcript = true
    io.metamsg('Transcript is now on.')
  },
  scriptEnd: function () {
    io.metamsg('Transcript is now off.')
    this.transcript = false
  },
  scriptShow: function (opts) {
    if (opts === undefined) opts = ''
    let html = ''
    for (const st of this.transcriptText) {
      const s = st.substring(1)
      switch (st[0]) {
        case '-': html += '<p>' + s + '</p>'; break
        case 'M': if (!opts.includes('m')) { html += '<p style="color:blue">' + s + '</p>' } break
        case 'E': if (!opts.includes('e')) { html += '<p style="color:red">' + s + '</p>' } break
        case 'D': if (!opts.includes('d')) { html += '<p style="color:grey">' + s + '</p>' } break
        case 'P': if (!opts.includes('p')) { html += '<p style="color:magenta">' + s + '</p>' } break
        case 'I': if (!opts.includes('i')) { html += '<p style="color:cyan">' + s + '</p>' } break
        default : html += '<h' + st[0] + '>' + s + '</h' + st[0] + '>'; break
      }
    }
    io.showHtml('Transcript', html)
  },
  scriptClear: function () {
    this.transcriptText = []
    io.metamsg('Transcript cleared.')
  },
  scriptAppend: function (s) {
    this.transcriptText.push(s)
  },

  timerEvents: [], // These will not get saved!!!
  eventFunctions: {},
  registerEvent: function (eventName, func) {
    this.eventFunctions[eventName] = func
  },
  registerTimedEvent: function (eventName, triggerTime, interval) {
    this.timerEvents.push({ eventName: eventName, triggerTime: triggerTime + game.elapsedRealTime, interval: interval })
  },
  gameTimer: function () {
    // Note that this gets added to window by setInterval, so 'this' does not refer to the game object
    game.elapsedRealTime++
    for (const el of game.timerEvents) {
      if (el.triggerTime && el.triggerTime < game.elapsedRealTime) {
        if (typeof (game.eventFunctions[el.eventName]) === 'function') {
          const flag = game.eventFunctions[el.eventName]()
          if (el.interval && !flag) {
            el.triggerTime += el.interval
          } else {
            delete el.triggerTime
          }
        } else {
          io.errorio.msg("A timer is trying to call event '" + el.eventName + "' but no such function is registered.")
          // console.log(game.eventFunctions);
        }
      }
    }
  },
  preSave: function () {
    const arr = []
    for (const el of game.timerEvents) {
      if (el.triggerTime) {
        arr.push(el.eventName + '/' + el.triggerTime + '/' + (el.interval ? el.interval : '-'))
      }
    }
    game.timeSaveAttribute = arr.join(' ')
  },
  postLoad: function () {
    game.timerEvents = []
    const arr = game.timeSaveAttribute.split(' ')
    for (const el of arr) {
      const params = el.split('/')
      const interval = params[2] === '-' ? undefined : parseInt(params[2])
      game.timerEvents.push({ eventName: params[0], triggerTime: parseInt(params[1]), interval: interval })
    }
    delete game.timeSaveAttribute
  }

}])

function Exit (name, hash) {
  if (!hash) hash = {}
  this.name = name
  this.use = function (char, dir) {
    if (char.util.testMobility && !char.util.testMobility()) {
      return false
    }
    if (this.isLocked()) {
      if (this.lockedio.msg) {
        io.msg(this.lockedio.msg)
      } else {
        io.msg(lang.locked_exit(char, this))
      }
      return false
    } else {
      io.msg(lang.stop_posture(char))
      if (this.io.msg) {
        io.printOrRun(char, this, 'io.msg')
      } else {
        io.msg(lang.npc_heading(char, dir))
      }
      world.setRoom(char, this.name, false)
      return true
    }
  }
  // These two will not be saved!!!
  this.isLocked = function () { return this.locked }
  this.isHidden = function () { return this.hidden || game.dark }
  for (const key in hash) {
    this[key] = hash[key]
  }
}
