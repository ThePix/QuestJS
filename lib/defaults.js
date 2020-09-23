"use strict";

// Should all be language neutral



const DEFAULT_OBJECT = {
  pronouns:lang.pronouns.thirdperson,
  
  isAtLoc:function(loc, situation) {
    if (typeof loc !== "string") loc = loc.name;
    if (!w[loc]) errormsg("The location name `" + loc + "`, does not match anything in the game.");
    if (this.complexIsAtLoc) {
      if (!this.complexIsAtLoc(loc, situation)) return false;
    }
    else {
      if (this.loc !== loc) return false;
    }
    if (situation === undefined) return true;
    if (situation === world.LOOK && this.scenery) return false;
    if (situation === world.SIDE_PANE && this.scenery) return false;
    return true;
  },
  
  isHere:function() {
    return this.isAtLoc(game.player.loc);
  },
  
  isHeld:function() {
    return this.isAtLoc(game.player.name);
  },
  
  isHereOrHeld:function() {
    return this.isHere() || this.isHeld();
  },
  
  countAtLoc:function(loc) {
    if (typeof loc !== "string") loc = loc.name;
    return this.isAtLoc(loc) ? 1 : 0;
  },
  
  scopeSnapshot:function(visible) {
    if (this.scopeStatus) { return; }  // already done this one
    
    this.scopeStatus = visible ? world.VISIBLE : world.REACHABLE;  // set the value
    
    if (!this.getContents && !this.componentHolder) { return; } // no lower levels so done

    let l    
    if (this.getContents) {
      // this is a container, so get the contents
      if (!this.canSeeThrough() && !this.scopeStatusForRoom) { return; }  // cannot see or reach contents
      if (!this.canReachThrough() && this.scopeStatusForRoom !== world.REACHABLE) { visible = true; }  // can see but not reach contents
      l = this.getContents(world.SCOPING);
    }
    else {
      // this has components, so get them
      l = [];
      for (let key in w) {
        if (w[key].loc === this.name) l.push(w[key]);
      }
    }
    for (let el of l) {
      // go through them
      el.scopeSnapshot(visible);
    }
  },
  
  canReachThrough:() => false,
  canSeeThrough:() => false,
  itemTaken:NULL_FUNC,
  itemDropped:NULL_FUNC,
  canTalkPlayer:() => false,
  getExits:function() { return []; },
  hasExit:dir => false,
  getWorn:() => false,
  
  
  moveToFrom:function(toLoc, fromLoc) {
    if (fromLoc === undefined) fromLoc = this.loc;
    if (fromLoc === toLoc) return;
    
    if (!w[fromLoc]) errormsg("The location name `" + fromLoc + "`, does not match anything in the game.");
    if (!w[toLoc]) errormsg("The location name `" + toLoc + "`, does not match anything in the game.");
    this.loc = toLoc; 
    w[fromLoc].itemTaken(this);
    w[toLoc].itemDropped(this);
    if (this.onMove !== undefined) this.onMove(toLoc, fromLoc)
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
    this.templatePreSave();
    let s = "Object=";
    for (let key in this) {
      if (typeof this[key] !== "function") {
        if (key !== "name" && key !== "gameState") {
          s += saveLoad.encode(key, this[key]);
        }
      }
    }
    return s;
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
  afterEnterIf:[],
  afterEnterIfFlags:'',
  afterFirstEnter:NULL_FUNC,
  onExit:NULL_FUNC,
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
  
  getExits:function(options) {
    const list = [];
    for (let exit of lang.exit_list) {
      if (this.hasExit(exit.name, options)) {
        list.push(this[exit.name]);
      }
    }
    return list; 
  },
  
  // returns null if there are no exits
  getRandomExit:options => random.fromArray(this.getExits(options)),
  
  hasExit:function(dir, options) {
    //console.log(this.name)
    //console.log(dir)
    if (options === undefined) options = {};
    if (!this[dir]) return false;
    //console.log(this[dir])
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
    if (!this[dir]) { return false; }
    const ex = this[dir];
    this[dir].locked = locked;
    return true;  
  },

  // Hide or unhide the exit indicated
  // Returns false if the exit does not exist or is not an Exit object
  // Returns true if successful
  setExitHide:function(dir, hidden) {
    if (!this[dir]) { return false; }
    this[dir].hidden = hidden;
    return true;  
  },
  
  
  templatePreSave:function() {
    /*for (let i = 0; i < lang.exit_list.length; i++) {
      const dir = lang.exit_list[i].name;
      if (this[dir] !== undefined) {
        this["customSaveExit" + dir] = (this[dir].locked ? "locked" : "");
        this["customSaveExit" + dir] += "/" + (this[dir].hidden ? "hidden" : "");
        if (this.saveExitDests) this["customSaveExitDest" + dir] = this[dir].name;
      }
    }*/
    this.preSave();
  },

  templatePostLoad:function() {
    for (let exit of lang.exit_list) {
      const dir = exit.name;
      if (this["customSaveExit" + dir]) {
        this[dir].locked = /locked/.test(this["customSaveExit" + dir]);
        this[dir].hidden = /hidden/.test(this["customSaveExit" + dir]);
        delete this["customSaveExit" + dir];
        if (this.saveExitDests) {
          this[dir].name = this["customSaveExitDest" + dir];
          //console.log("Just set " + dir + " in " + this.name + " to " + this["customSaveExitDest" + dir])
          delete this["customSaveExitDest" + dir];
        }
      }
    }
    this.postLoad();
  },

};


const DEFAULT_ITEM = {
  lightSource:() => world.LIGHT_NONE,
  icon:() => "",
  testKeys:(char, toLock) => false,
  getVerbs:function() {
    return this.use === undefined ? [lang.verbs.examine] : [lang.verbs.examine, lang.verbs.use];
  },
};

