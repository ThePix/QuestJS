"use strict";

// Should all be language neutral



const DEFAULT_OBJECT = {
  pronouns:lang.pronouns.thirdperson,
  
  isAtLoc:function(loc, situation) {
    if (typeof loc !== "string") loc = loc.name;
    if (!w[loc]) errormsg("The location name `" + loc + "`, does not match anything in the game.");
    if (this.simpleIsAtLoc) {
      if (!this.simpleIsAtLoc(loc, situation)) return false;
    }
    else {
      if (this.loc !== loc) return false;
    }
    if (situation === undefined) return true;
    if (situation === world.LOOK && this.scenery) return false;
    if (situation === world.SIDE_PANE && this.scenery && !settings.showSceneryInSidePanes) return false;
    return true;
  },
  
  isHere:function() {
    return this.isAtLoc(game.player.loc);
  },
  
  isHeld:function() {
    return this.isAtLoc(game.player.name);
  },

  isUltimatelyHeldBy:function(obj) {
    let o = this
    while (o.loc) {
      if (o.loc === obj.name) return true
      if (!w[o.loc]) return errormsg("isUltimatelyHeldBy has found that the object \"" + o.name + "\" has no good loc (" + o.loc + ") attribute, and so has failed. If this is a takeable item you may need to give it a custom isUltimatelyHeldBy function. If this is a takeable container or surface, it needs a loc attribute set.")
      o = w[o.loc]
    }
    return false
  },
  
  isHereOrHeld:function() {
    return this.isHere() || this.isHeld();
  },
  
  countAtLoc:function(loc) {
    if (typeof loc !== "string") loc = loc.name;
    return this.isAtLoc(loc) ? 1 : 0;
  },
  
  scopeSnapshot:function(visible) {
    if (this.scopeStatus) return  // already done this one
    
    this.scopeStatus = visible ? world.VISIBLE : world.REACHABLE  // set the value
    
    if (!this.getContents && !this.componentHolder) return // no lower levels so done

    let l    
    if (this.getContents) {
      // this is a container, so get the contents
      if (!this.canSeeThrough() && !this.scopeStatusForRoom && this !== game.player) {
        // cannot see or reach contents
        return
      }
      if (!this.canReachThrough() && this.scopeStatusForRoom !== world.REACHABLE && this !== game.player) {
        // can see but not reach contents
        visible = true
      }
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
      el.scopeSnapshot(visible)
    }
  },
  
  canReachThrough:() => false,
  canSeeThrough:() => false,
  afterTakeOut:NULL_FUNC,
  afterDropIn:NULL_FUNC,
  canTalkPlayer:() => false,
  getExits:function() { return []; },
  hasExit:dir => false,
  getWorn:() => false,
  saveLoadExcludedAtts:[],
  
  
  moveToFrom:function(char, toLoc, fromLoc) {
    if (fromLoc === undefined) fromLoc = this.loc;
    if (fromLoc === toLoc) return;
    
    if (!w[fromLoc]) errormsg("The location name `" + fromLoc + "`, does not match anything in the game.");
    if (!w[toLoc]) errormsg("The location name `" + toLoc + "`, does not match anything in the game.");
    this.loc = toLoc; 
    w[fromLoc].afterTakeOut(char, {item:this});
    w[toLoc].afterDropIn(char, {item:this});
    if (this.afterMove !== undefined) this.afterMove(char, {toLoc:toLoc}, {fromLoc:fromLoc})
  },
    
  postLoad:NULL_FUNC,

  templatePostLoad:function() {
    this.postLoad();
  },
  
  preSave:NULL_FUNC,

  templatePreSave:function() {
    this.preSave();
  },
  
  getSaveString:function() {
    this.templatePreSave()
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
    if (this[att] instanceof Exit) return true
    if (array.hasMatch(settings.saveLoadExcludedAtts, att)) return true
    if (array.hasMatch(this.saveLoadExcludedAtts, att)) return true
    return false
  },
  

  setAlias:function(alias, listAlias) {
    if (listAlias === undefined) listAlias = sentenceCase(alias)
    this.alias = alias
    this.listAlias = listAlias
    this.parserOptionsSet = false
  },
    

  eventActive:false,
  eventCountdown:0,
  eventIsActive:function() { return this.eventActive},
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
    //console.log("this=" + this.name);
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

  description:function() {
    if (game.dark) {
      printOrRun(game.player, this, "darkDesc");
      return true;
    }
    for (let line of settings.roomTemplate) {
      msg(line);
    }
    return true;
  },
  
  examine:function() {
    if (game.dark) {
      printOrRun(game.player, this, "darkDesc");
      return true;
    }
    msg(typeof this.desc === 'string' ? this.desc : this.desc())
    return true;
  },
  
  darkDescription:() => msg("It is dark."),
  
  getContents:util.getContents,
  
  getExitObjs:function(options) {
    const list = []
    for (let exit of lang.exit_list) {
      if (this.hasExit(exit.name, options)) {
        list.push(exit)
      }
    }
    return list
  },
  
  getExits:function(options) {
    return this.getExitObjs(options).map(el => this[el.name]) 
  },
  
  getExitDirs:function(options) {
    return this.getExits(options).map(el => el.dir) 
  },
  
  // returns null if there are no exits
  getRandomExit:function(options) { return random.fromArray(this.getExits(options)) },
  
  hasExit:function(dir, options) {
    if (options === undefined) options = {};
    if (!this[dir]) return false;
    if (options.excludeLocked && this[dir].isLocked()) return false;
    if (options.excludeScenery && this[dir].scenery) return false;
    return !this[dir].isHidden();
  },
  
  findExit:function(dest, options) {
    if (typeof dest === "object") dest = dest.name;
    for (let exit of lang.exit_list) {
      if (this.hasExit(exit.name, options) && this[exit.name].name === dest) {
        return this[exit.name];
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
    const reverseDir = lang.exit_list.find(el => el.name === dir)
    const dest = this[dir]
    return dest.findExit(this)
  },

//    


};


const DEFAULT_ITEM = {
  lightSource:() => world.LIGHT_NONE,
  icon:() => "",
  testKeys:(char, toLock) => false,
  getVerbs:function() {
    const verbList = []
    //console.log('verbs for ' + this.name)
    //console.log('count ' + this.verbFunctions.length)
    //console.log(verbList)
    for (let f of this.verbFunctions) f(this, verbList)

    //console.log(verbList)
    if (!this.isAtLoc(game.player.name)) {
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
};

