"use strict";

// Should all be language neutral



const DEFAULT_OBJECT = {
  pronouns:lang.pronouns.thirdperson,
  
  isLocatedAt:function(loc) { return loc === this.loc },
  
  isApparentTo:function(situation) {
    if (settings.defaultIsApparentTo) return settings.defaultIsApparentTo(situation)

    if (situation === world.LOOK && this.scenery) return false
    if (situation === world.SIDE_PANE && this.scenery && !settings.showSceneryInSidePanes) return false
    if (situation === world.SIDE_PANE && this.player) return false
    return true
  },
  
  isAtLoc:function(loc, situation) {
    if (typeof loc !== "string") loc = loc.name
    if (!w[loc] && !settings.placeholderLocations.includes(loc)) { 
      errormsg("The location name `" + loc + "`, does not match anything in the game.")
    }
    if (!this.isLocatedAt(loc, situation)) return false
    return this.isApparentTo(situation)
  },
  
  isHere:function() {
    return this.isAtLoc(player.loc);
  },
  
  isHeld:function() {
    return this.isAtLoc(player.name);
  },

  isHeldBy:function(char) {
    return this.isAtLoc(char.name);
  },

  isUltimatelyHeldBy:function(obj) {
    let o = this
    while (o.loc) {
      if (o.loc === obj.name) return true
      if (!o.loc) return errormsg("isUltimatelyHeldBy has found that the object \"" + o.name + "\" has no loc attribute (or it is set to undefined/false/null/0), and so has failed. If this is a takeable item you may need to give it a custom isUltimatelyHeldBy function. If this is a takeable container or surface, it needs a loc attribute set.")
      if (!w[o.loc] && !settings.placeholderLocations.includes(loc)) {
        return errormsg("isUltimatelyHeldBy has found that the object \"" + o.name + "\" has its \"loc\" attribute set to \"" + o.loc + "\"), which does not exist, and so has failed.")
      }
      o = w[o.loc]
    }
    return false
  },
 
  isHereOrHeld:function() {
    return this.isHere() || this.isHeld();
  },
 
  isHereOrHeldBy:function(char) {
    return this.isHere() || this.isHeldBy(char);
  },
  
  countAtLoc:function(loc) {
    if (typeof loc !== "string") loc = loc.name;
    return this.isAtLoc(loc) ? 1 : 0;
  },
  
  scopeSnapshot:function(mode) {
    if (this.scopeStatus['done' + mode]) return  // already done this one
    
    if (Object.keys(this.scopeStatus).length === 0) world.scope.push(this)
    
    this.scopeStatus['can' + mode] = true  // set the value
    this.scopeStatus['done' + mode] = true
    
    if (!this.getContents && !this.componentHolder) return // no lower levels so done

    let l    
    if (this.getContents) {
      // this is a container, so get the contents
      
      // cannot see or reach contents and not flagged is a visible room, and not the player, so abort
      if (!this['can' + mode + 'ThroughThis']() && !this.scopeStatus['room' + mode] && this !== player) return
      l = this.getContents(world.PARSER)
    }
    else {
      // this has components, so get them
      l = []
      for (let key in w) {
        if (w[key].loc === this.name) l.push(w[key]);
      }
    }
    for (let el of l) {
      // go through them
      el.scopeSnapshot(mode)
    }
  },
  
  canReachThroughThis:() => false,
  canSeeThroughThis:() => false,
  afterTakeOut:NULL_FUNC,
  afterDropIn:NULL_FUNC,
  testTalkPlayer:() => false,
  getExits:function() { return []; },
  hasExit:dir => false,
  getWorn:() => false,
  saveLoadExcludedAtts:[],
  
  
  moveToFrom:function(options, toLoc, fromLoc) {
    util.setToFrom(options, toLoc, fromLoc)
    if (options.fromLoc === undefined) options.fromLoc = this.loc
    if (options.fromLoc === options.toLoc) return
    
    if (!w[options.fromLoc] && !settings.placeholderLocations.includes(options.fromLoc)) {
      errormsg("The location name `" + options.fromLoc + "`, does not match anything in the game.")
    }
    if (!w[options.toLoc] && !settings.placeholderLocations.includes(options.toLoc)) {
      errormsg("The location name `" + options.toLoc + "`, does not match anything in the game.")
    }
    
    this.loc = options.toLoc
    options.item = this
    if (!settings.placeholderLocations.includes(options.fromLoc)) w[options.fromLoc].afterTakeOut(options)
    if (!settings.placeholderLocations.includes(options.toLoc)) w[options.toLoc].afterDropIn(options)
    if (this.afterMove !== undefined) this.afterMove(options)
    if (options.toLoc === player.name && this.afterTake !== undefined) this.afterTake(options)
  },
    
  afterLoad:NULL_FUNC,

  afterLoadForTemplate:function() {
    this.afterLoad();
  },
  
  beforeSave:NULL_FUNC,

  beforeSaveForTemplate:function() {
    this.beforeSave();
  },
  
  getSaveString:function() {
    this.beforeSaveForTemplate()
    let s = this.getSaveStringPreamble()
    for (let key in this) {
      if (typeof this[key] !== "function") {
        if (!this.saveLoadExclude(key)) {
          s += saveLoad.encode(key, this[key]);
        }
      }
    }
    return s
  },
  
  getSaveStringPreamble:function(item) {
    return "Object="
  },

  saveLoadExclude:function(att) {
    if (typeof this[att] === 'function') return true
    if (typeof this[att] === 'object' && !Array.isArray(this[att])) return true
    if (this[att] instanceof Exit) return true
    if (array.hasMatch(settings.saveLoadExcludedAtts, att)) return true
    if (array.hasMatch(this.saveLoadExcludedAtts, att)) return true
    return false
  },
  

  setAlias:function(alias, options = {}) {
    if (this.synonyms && this.alias) this.synonyms.push(this.alias)
    this.alias = alias
    this.listAlias = options.listAlias ? options.listAlias : sentenceCase(alias)
    this.properNoun = options.properNoun === undefined ? /^[A-Z]/.test(this.alias) : options.properNoun
    if (this.room) this.headingAlias = options.headingAlias ? options.headingAlias : settings.getDefaultRoomHeading(this)
    this.parserOptionsSet = false
    this.pluralAlias = options.pluralAlias ? options.pluralAlias : lang.getPlural(alias)
    this.properNoun = options.properNoun === undefined ? /^[A-Z]/.test(this.alias) : options.properNoun
  },
    

  eventActive:false,
  eventCountdown:0,
  eventIsActive:function() { return this.eventActive},
  endTurn:function(turn) { this.doEvent(turn) },
  doEvent:function(turn) {
    //console.log("this=" + this.name);
    // Not active, so stop
    if (!this.eventIsActive()) return;
    // Countdown running, so stop
    if (this.eventCountdown > 1) {
      this.eventCountdown--;
      return;
    }
    // If there is a condition and it is not met, stop
    //console.log("this=" + this.name);
    if (this.eventCondition && !this.eventCondition(turn)) return;
    if (typeof this.eventScript !== 'function') log("About to call eventScrip on the object '" + this.name + "', but it will throw an exception because there is no such function!")
    this.eventScript(turn);
    if (typeof this.eventPeriod === "number") {
      this.eventCountdown = this.eventPeriod;
    }
    else {
      this.eventActive = false;
    }
  },
};







const DEFAULT_ROOM = {
  room:true,
  beforeEnter:NULL_FUNC,
  beforeFirstEnter:NULL_FUNC,
  afterEnter:NULL_FUNC,
  afterEnterIf:{},
  afterEnterIfFlags:'',
  afterFirstEnter:NULL_FUNC,
  afterExit:NULL_FUNC,
  visited:0,
  
  lightSource:() => world.LIGHT_FULL,
  
  isAtLoc:function(loc, situation) { return situation === world.PARSER && loc === this.name },

  description:function() {
    for (let line of settings.roomTemplate) {
      msg(line);
    }
    return true;
  },


  examine:function() {
    msg('{hereDesc}')
    return true
  },
  
  darkDesc:() => msg(lang.it_is_dark),
  
  getContents:util.getContents,
  


  getExit:function(dir) {
    return this[dir]
  },
  
  hasExit:function(dir, options) {
    if (options === undefined) options = {}
    if (!this[dir]) return false
    if (options.excludeAlsoDir && this[dir].isAlsoDir) return false
    if (options.excludeLocked && this[dir].isLocked()) return false
    if (options.excludeScenery && this[dir].scenery) return false    
    if (game.dark && !this[dir].illuminated) return false
    return !this[dir].isHidden()
  },
  




  getExitObjs:function(options) {
    if (options === undefined) options = {};
    const list = []
    if (options.excludeAlsoDir === undefined) options.excludeAlsoDir = true
    for (let exit of lang.exit_list) {
      if (this.hasExit(exit.name, options)) {
        list.push(exit)
      }
    }
    return list
  },
  
  getExits:function(options) {
    return this.getExitObjs(options).map(el => this.getExit(el.name)) 
  },
  
  getExitDirs:function(options) {
    return this.getExits(options).map(el => el.dir) 
  },
  
  // returns null if there are no exits
  getRandomExit:function(options) { return random.fromArray(this.getExits(options)) },
  
  findExit:function(dest, options) {
    if (typeof dest === "object") dest = dest.name;
    for (let exit of lang.exit_list) {
      if (this.hasExit(exit.name, options) && this[exit.name].name === dest) {
        return this.getExit(exit.name)
      }
    }
    return null;
  },

  // Lock or unlock the exit indicated
  // Returns false if the exit does not exist or is not an Exit object
  // Returns true if successful
  setExitLock:function(dir, locked) {
    if (!this[dir]) return false
    this['exit_locked_' + dir] = locked
    return true
  },
  
  isExitLocked:function(dir) {
    return this['exit_locked_' + dir]
  },

  // Hide or unhide the exit indicated
  // Returns false if the exit does not exist or is not an Exit object
  // Returns true if successful
  setExitHide:function(dir, hidden) {
    if (!this[dir]) return false
    this['exit_hidden_' + dir] = hidden
    return true
  },
  
  isExitHidden:function(dir) {
    return this['exit_hidden_' + dir]
  },

  // Returns an exit going TO this room. If sent "west", it will return the exit from the room to the west, to this room
  // which will probably be east, but may not
  getReverseExit:function(dir) {
    const dest = this[dir]
    return dest.findExit(this)
  },

  // Used for GO IN HOUSE, CLIMB UP TREE, GO THROUGH PORTAL, etc.
  // dir should be one of 'In', 'Out', 'Up', 'Down', Through' - case sensitive
  goItem:function(obj, dir, char) {
    const att = 'go' + dir + 'Direction'
    if (!char) char = player
    if (!obj[att]) return failedmsg(lang['cannot_go_' + dir.toLowerCase()], {item:obj, char:char})
    if (!this[obj[att]]) return errormsg("Trying to 'go " + dir.toLowerCase() + "' using unknown exit '" + obj[att] + "' for " + this.name)
    return this[obj[att]].use(char) ? world.SUCCESS : world.FAILED
  }  
  
//    


};


const DEFAULT_ITEM = {
  lightSource:() => world.LIGHT_NONE,
  icon:() => "",
  testKeys:(char, toLock) => false,
  getListAlias:function(loc) { return this.listAlias },

  getVerbs:function() {
    const verbList = []
    //console.log('verbs for ' + this.name)
    //console.log('count ' + this.verbFunctions.length)
    //console.log(verbList)
    for (let f of this.verbFunctions) f(this, verbList)

    //console.log(verbList)
    if (player && !this.isAtLoc(player.name)) {
      if (this.hereVerbs) {
        for (let s of this.hereVerbs) verbList.push(s)
      }
    }
    else if (this.getWorn()) {
      if (this.wornVerbs) {
        for (let s of this.wornVerbs) verbList.push(s)
      }
    }
    else {
      if (this.heldVerbs) {
        for (let s of this.heldVerbs) verbList.push(s)
      }
    }
    if (this.verbFunction) this.verbFunction(verbList)
    return verbList;
  },
  
  transform:function(item) {
    item.loc = this.loc
    delete this.loc
    for (const key in w) {
      if (w[key].loc === this.name) w[key].loc = item.name
    }
    for (const key in parser.pronouns) {
      if (parser.pronouns[key] === this) parser.pronouns[key] = item
    }
  },
};

