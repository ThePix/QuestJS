'use strict'
import { game, lang, util, w, io, saveLoad } from './main'
// Should all be language neutral

const DEFAULT_OBJECT = {
  byname: function (options) {
    let s
    if (options && options.article === util.DEFINITE) {
      s = lang.addDefiniteArticle(this) + this.alias
    } else if (options && options.article === util.INDEFINITE) {
      s = lang.addIndefiniteArticle(this) + this.alias
    } else {
      s = this.alias
    }
    if (options && options.possessive) {
      if (this.pronouns.possessive_name) {
        s = this.pronouns.possessive_name
      } else {
        s += "'s"
      }
    }
    if (options && options.capital) s = util.sentenCecase(s)
    return s
  },
  pronouns: lang.pronouns.thirdperson,

  isAtLoc: function (loc, situation) {
    if (typeof loc !== 'string') loc = loc.name
    if (!w[loc]) io.errorio.msg('The location name `' + loc + '`, does not match anything in the game.')
    if (this.complexIsAtLoc) {
      if (!this.complexIsAtLoc(loc, situation)) return false
    } else {
      if (this.loc !== loc) return false
    }
    if (situation === undefined) return true
    if (situation === util.display.LOOK && this.scenery) return false
    if (situation === util.display.SIDE_PANE && this.scenery) return false
    return true
  },

  isHere: function () {
    return this.isAtLoc(game.player.loc)
  },

  isHeld: function () {
    return this.isAtLoc(game.player.name)
  },

  isHereOrHeld: function () {
    return this.isHere() || this.isHeld()
  },

  countAtLoc: function (loc) {
    if (typeof loc !== 'string') loc = loc.name
    return this.isAtLoc(loc) ? 1 : 0
  },

  scopeSnapshot: function (visible) {
    if (this.scopeStatus) { return } // already done this one

    this.scopeStatus = visible ? util.VISIBLE : util.REACHABLE // set the value

    if (!this.getContents && !this.componentHolder) { return } // no lower levels so done

    let l
    if (this.getContents) {
      // this is a container, so get the contents
      if (!this.canSeeThrough() && !this.scopeStatusForRoom) { return } // cannot see or reach contents
      if (!this.canReachThrough() && this.scopeStatusForRoom !== util.REACHABLE) { visible = true } // can see but not reach contents
      l = this.getContents(util.display.SCOPING)
    } else {
      // this has components, so get them
      l = []
      for (const key in w) {
        if (w[key].loc === this.name) l.push(w[key])
      }
    }
    for (const el of l) {
      // go through them
      el.scopeSnapshot(visible)
    }
  },

  canReachThrough: () => false, // <-- Searchers after horror haunt strange, far places...
  canSeeThrough: () => false,
  itemTaken: util.NULL_FUNC,
  itemDropped: util.NULL_FUNC,
  canTalkPlayer: () => false,
  getExits: function () { return {} },
  hasExit: dir => false, // -fixme: never use "dir" to mean something besides "directory"
  getWorn: () => false,

  moveToFrom: function (toLoc, fromLoc) {
    if (fromLoc === undefined) fromLoc = this.loc
    if (fromLoc === toLoc) return

    if (!w[fromLoc]) io.errorio.msg('The location name `' + fromLoc + '`, does not match anything in the game.')
    if (!w[toLoc]) io.errorio.msg('The location name `' + toLoc + '`, does not match anything in the game.')
    this.loc = toLoc
    w[fromLoc].itemTaken(this)
    w[toLoc].itemDropped(this)
    if (this.onMove !== undefined) this.onMove(toLoc, fromLoc)
  },

  postLoad: util.NULL_FUNC,

  templatePostLoad: function () {
    this.postLoad()
  },

  preSave: util.NULL_FUNC,

  templatePreSave: function () {
    this.preSave()
  },

  getSaveString: function () {
    this.templatePreSave()
    let s = 'Object='
    for (const key in this) {
      if (typeof this[key] !== 'function') {
        if (key !== 'name' && key !== 'gameState') {
          s += saveLoad.encode(key, this[key])
        }
      }
    }
    return s
  },

  eventActive: false,
  eventCountdown: 0,
  eventIsActive: () => this.eventActive,
  doEvent: function (turn) {
    // debugio.msg("this=" + this.name);
    // Not active, so stop
    if (!this.eventIsActive()) return
    // Countdown running, so stop
    if (this.eventCountdown > 1) {
      this.eventCountdown--
      return
    }
    // If there is a condition and it is not met, stop
    if (this.eventCondition && !this.eventCondition(turn)) return
    this.eventScript(turn)
    if (typeof this.eventPeriod === 'number') {
      this.eventCountdown = this.eventPeriod
    } else {
      this.eventActive = false
    }
  }
}

const CONTAINER_BASE = {
  // -review: why not just use proper object construction?
  // `if (container) (return this.container.getContent())` // this way you can use getContent() on everything and dynamically request it
  // `function getContent () {return this.contaier.content}` and content is an object: `content: [item1, item2, item3]`
  container: true,

  getContents: function (situation) { // -fixme: "situation" is way too ambiguous of an arg. name
    // -review: this is pure madness:
    // - dont use a global array to log every single thing in the game, use objects to catigorise them
    const list = []
    for (const key in w) {
      if (w[key].isAtLoc(this.name, situation)) {
        list.push(w[key])
      }
    }
    return list
  },

  // Is this container already inside the given object, and hence
  // putting the object in the container will destroy the universe
  testForRecursion: function (char, item) { // -review: why does this need a "char" argument?
  // instead simply use: if (item === this) throw [some error]
  // then catch the error and report it
    let contName = this.name
    while (w[contName]) {
      if (w[contName].loc === item.name) return falsemsg(container_recursion(char, this, item))
      contName = w[contName].loc
    }
    return true
  }

}

const DEFAULT_ROOM = {
  room: true, // -fixme: declare a new type and then if you want to check if this object is a room then check `typeof === 'Room'`
  beforeEnter: util.NULL_FUNC,
  beforeFirstEnter: util.NULL_FUNC,
  afterEnter: util.NULL_FUNC,
  afterEnterIf: [],
  afterEnterIfFlags: '',
  afterFirstEnter: util.NULL_FUNC,
  onExit: util.NULL_FUNC,
  visited: 0,

  lightSource: () => util.LIGHT_FULL,

  description: function () {
    if (game.dark) {
      io.printOrRun(game.player, this, 'darkDesc')
      return true
    }
    for (const line of settings.roomTemplate) {
      io.msg(line)
    }
    return true
  },

  darkDescription: () => io.msg('It is dark.'), // -fixme: hardcoded output string

  getContents: CONTAINER_BASE.getContents,

  getExits: function (options) {
    const list = []
    for (const exit of lang.exit_list) { // -fixme: hardcode implementation, dont load from a language list,
      if (this.hasExit(exit.name, options)) { // directly from game script at initiation and return an array of exits at the game config level
        list.push(this[exit.name])
      }
    }
    return list
  },

  // returns null if there are no exits // -fixme: returns "void" actually
  getRandomExit: options => util.randomFromArray(this.getExits(options)), // -review: when is this called? why not just save the exits and request it again

  hasExit: function (dir, options) { -fixme: again, just
    // console.log(this.name)
    // console.log(dir)
    if (options === undefined) options = {} // -review: why nullcheck instead of setting the object property for the default 'options = {}'?
    if (!this[dir]) return false
    // console.log(this[dir])
    if (options.excludeLocked && this[dir].isLocked()) return false
    if (options.excludeScenery && this[dir].scenery) return false
    return !this[dir].isHidden() // --review: what?
  },

  findExit: function (dest, options) {
    if (typeof dest === 'object') dest = dest.name
    for (const exit of lang.exit_list) {
      if (this.hasExit(exit.name, options) && this[exit.name].name === dest) {
        return this[exit.name]
      }
    }
    return null
  },

  // Lock or unlock the exit indicated
  // Returns false if the exit does not exist or is not an Exit object
  // Returns true if successful
  setExitLock: function (dir, locked) {
    if (!this[dir]) { return false }
    const ex = this[dir] // -fixme: unuse variable "ex"
    this[dir].locked = locked
    return true
  },

  // Hide or unhide the exit indicated
  // Returns false if the exit does not exist or is not an Exit object
  // Returns true if successful
  setExitHide: function (dir, hidden) {
    if (!this[dir]) { return false }
    this[dir].hidden = hidden
    return true
  },

  templatePreSave: function () {
    /* for (let i = 0; i < lang.exit_list.length; i++) {
      const dir = lang.exit_list[i].name;
      if (this[dir] !== undefined) {
        this["customSaveExit" + dir] = (this[dir].locked ? "locked" : "");
        this["customSaveExit" + dir] += "/" + (this[dir].hidden ? "hidden" : "");
        if (this.saveExitDests) this["customSaveExitDest" + dir] = this[dir].name;
      }
    } */
    this.preSave()
  },

  templatePostLoad: function () {
    for (const exit of lang.exit_list) {
      const dir = exit.name
      if (this['customSaveExit' + dir]) {
        this[dir].locked = /locked/.util.test(this['customSaveExit' + dir])
        this[dir].hidden = /hidden/.util.test(this['customSaveExit' + dir])
        delete this['customSaveExit' + dir]
        if (this.saveExitDests) {
          this[dir].name = this['customSaveExitDest' + dir]
          // console.log("Just set " + dir + " in " + this.name + " to " + this["customSaveExitDest" + dir])
          delete this['customSaveExitDest' + dir]
        }
      }
    }
    this.postLoad()
  }

}

const DEFAULT_ITEM = {
  lightSource: () => LIGHT_none, // -fixme: why use an anonymus function to return a constant? just use '[key]: [value]'
  icon: () => '',
  testKeys: (char, toLock) => false, // -fixme: again just use "[key]: [bool]", in a case like this you could even use "[key]: boolean" to get a Boolean-constructor
  here: function () { return this.isAtLoc(game.player.loc) },
  getVerbs: function () {
    return this.use === undefined ? [lang.verbs.examine] : [lang.verbs.examine, lang.verbs.use]
  }
}
