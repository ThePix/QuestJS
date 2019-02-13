"use strict";

// Should all be language neutral



const DEFAULT_OBJECT = {
  byname:function(options) {
    if (options.article === DEFINITE) {
      return addDefiniteArticle(this) + this.alias;
    }
    if (options.article === INDEFINITE) {
      return addIndefiniteArticle(this) + this.alias;
    }
    return this.alias;
  },
  //runTurnscript:function() { return false; },
  pronouns:PRONOUNS.thirdperson,
  
  isAtLoc:function(loc) {
    if (!w[loc]) errormsg("The location name `" + loc + "`, does not match anything in the game.");
    return (this.loc === loc);
  },
  
  scopeSnapshot:function(visible) {
    if (this.scopeStatus) { return; }
    this.scopeStatus = visible ? VISIBLE : REACHABLE;
    if (!this.getContents) { return; }
    if (!this.canSeeThrough() && !this.scopeStatusForRoom) { return; }
    if (!this.canReachThrough() && this.scopeStatusForRoom !== REACHABLE) { visible = true; }
    const l = this.getContents();
    for (let i = 0; i < l.length; i++) {
      l[i].scopeSnapshot(visible);
    }
  },
  canReachThrough:function() { return false; },
  canSeeThrough:function() { return false; },
  itemTaken:NULL_FUNC,
  itemDropped:NULL_FUNC,
  canTalkToPlayer:function() { return false; },
  getExits:function() { return {}; },
  hasExit:function(dir) { return false; },
  
  moveFromTo:function(fromLoc, toLoc) {
    if (!w[fromLoc]) errormsg("The location name `" + fromLoc + "`, does not match anything in the game.");
    if (!w[toLoc]) errormsg("The location name `" + toLoc + "`, does not match anything in the game.");
    this.loc = toLoc; 
    w[fromLoc].itemTaken(this);
    w[toLoc].itemDropped(this);
  },
    
  postLoad:function() {},

  templatePostLoad:function() {
    this.postLoad();
  },
  
  preSave:function() {},

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
  eventIsActive:function() { return this.eventActive; },
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
  afterFirstEnter:NULL_FUNC,
  onExit:NULL_FUNC,
  visited:0,
  
  lightSource:function() { return LIGHT_FULL; },

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
  
  darkDescription:function() {
    msg("It is dark.");
  },
  
  getContents:function() {
    const list = [];
    for (let key in w) {
      if (w[key].isAtLoc(this.name) && w[key].display >= DSPY_SCENERY) {
        list.push(w[key]);
      }
    }
    return list;
  },
  
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
  getRandomExit:function(options) {
    return randomFromArray(this.getExits(options)); 
  },
  
  hasExit:function(dir, options) {
    if (options === undefined) options = {};
    if (!this[dir]) return false;
    if (options.excludeLocked && this[dir].isLocked()) return false;
    if (options.excludeScenery && this[dir].display <= DSPY_SCENERY) return false;
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
      }
    }
    this.postLoad();
  },

};


const DEFAULT_ITEM = {
  display:DSPY_DISPLAY,
  
  // Used in speak to
  isTopicVisible:function() { return false; },
  lightSource:function() { return LIGHT_NONE; },
  testKeys:function(char, toLock) { return false; },
  here:function() { return this.isAtLoc(game.player.loc); },

  icon:function() {
    return "";
  },
  
  getVerbs:function() {
    return [VERBS.examine];
  },
};

