"use strict";

// Should all be language neutral



const DEFAULT_OBJECT = {
  byname:function(options) {
    let s;
    if (options && options.article === DEFINITE) {
      s = addDefiniteArticle(this) + this.alias;
    }
    else if (options && options.article === INDEFINITE) {
      s =  addIndefiniteArticle(this) + this.alias;
    }
    else {
      s =  this.alias;
    }
    if (options && options.possessive) {
      s += "'s";
    }
    return s;
  },
  //runTurnscript:function() { return false; },
  pronouns:PRONOUNS.thirdperson,
  
  isAtLoc:function(loc, situation) {
    if (typeof loc !== "string") loc = loc.name;
    if (!w[loc]) errormsg("The location name `" + loc + "`, does not match anything in the game.");
    if (this.loc !== loc) return false;
    if (situation === undefined) return true;
    if (situation === display.LOOK && this.scenery) return false;
    if (situation === display.SIDE_PANE && this.scenery) return false;
    //if (situation === display.LOOK && this.scenery) return false;
    return true;
  },
  
  isHere:function() {
    return this.isAtLoc(game.player.loc);
  },
  
  countAtLoc:function(loc) {
    if (typeof loc !== "string") loc = loc.name;
    return this.isAtLoc(loc) ? 1 : 0;
  },
  
  scopeSnapshot:function(visible) {
    if (this.scopeStatus) { return; }
    this.scopeStatus = visible ? VISIBLE : REACHABLE;
    if (!this.getContents && !this.componentHolder) { return; }

    let l    
    if (this.getContents) {
      if (!this.canSeeThrough() && !this.scopeStatusForRoom) { return; }
      if (!this.canReachThrough() && this.scopeStatusForRoom !== REACHABLE) { visible = true; }
      l = this.getContents(display.ALL);
    }
    else {
      l = [];
      for (let key in w) {
        if (w[key].loc === this.name) l.push(w[key]);
      }
    }
    for (let i = 0; i < l.length; i++) {
      l[i].scopeSnapshot(visible);
    }
  },
  
  canReachThrough:() => false,
  canSeeThrough:() => false,
  itemTaken:NULL_FUNC,
  itemDropped:NULL_FUNC,
  canTalkPlayer:() => false,
  getExits:function() { return {}; },
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
    let s = "";
    s += saveLoad.encode("saveType", "Object");
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
  },

  eventActive:false,
  eventCountdown:0,
  eventIsActive:() => this.eventActive,
  doEvent:function(turn) {
    //debugmsg("this=" + this.name);
    // Not active, so stop
    if (!this.eventIsActive()) return;
    // Countdown running, so stop
    if (this.eventCountdown > 1) {
      this.eventCountdown--;
      return;
    }
    // If there is a condition and it is not met, stop
    if (this.eventCondition && !this.eventCondition(turn)) return;
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
  
  lightSource:() => LIGHT_FULL,

  description:function() {
    if (game.dark) {
      printOrRun(game.player, this, "darkDesc");
      return true;
    }
    for (let i = 0; i < ROOM_TEMPLATE.length; i++) {
      if (ROOM_TEMPLATE[i] === "%") {
        printOrRun(game.player, this, "desc");
      }
      else {
        msg(ROOM_TEMPLATE[i]);
      }
    }
    return true;
  },
  
  darkDescription:() => msg("It is dark."),
  
  getContents:getContents,
  
  getExits:function(options) {
    const list = [];
    for (let i = 0; i < EXITS.length; i++) {
      if (this.hasExit(EXITS[i].name, options)) {
        list.push(this[EXITS[i].name]);
      }
    }
    return list; 
  },
  
  // returns null if there are no exits
  getRandomExit:options => randomFromArray(this.getExits(options)),
  
  hasExit:function(dir, options) {
    if (options === undefined) options = {};
    if (!this[dir]) return false;
    if (options.excludeLocked && this[dir].isLocked()) return false;
    if (options.excludeScenery && this[dir].scenery) return false;
    return !this[dir].isHidden();
  },
  
  findExit:function(dest, options) {
    if (typeof dest === "object") dest = dest.name;
    for (let i = 0; i < EXITS.length; i++) {
      if (this.hasExit(EXITS[i].name, options) && this[EXITS[i].name].name === dest) {
        return this[EXITS[i].name];
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
    for (let i = 0; i < EXITS.length; i++) {
      const dir = EXITS[i].name;
      if (this[dir] !== undefined) {
        this["customSaveExit" + dir] = (this[dir].locked ? "locked" : "");
        this["customSaveExit" + dir] += "/" + (this[dir].hidden ? "hidden" : "");
        if (this.saveExitDests) this["customSaveExitDest" + dir] = this[dir].name;
      }
    }
    this.preSave();
  },

  templatePostLoad:function() {
    for (let i = 0; i < EXITS.length; i++) {
      const dir = EXITS[i].name;
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
  lightSource:() => LIGHT_NONE,
  icon:() => "",
  testKeys:(char, toLock) => false,
  here:function() { return this.isAtLoc(game.player.loc); },
  getVerbs:function() {
    return this.use === undefined ? [VERBS.examine] : [VERBS.examine, VERBS.use];
  },
};

