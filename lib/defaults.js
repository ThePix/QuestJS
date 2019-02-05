"use strict";

// Should all be language neutral



const DEFAULT_OBJECT = {
    byname:function(options) {
      if (options.article === DEFINITE) {
        return addDefiniteAritcle(this) + this.alias;
      }
      if (options.article === INDEFINITE) {
        return addIndefiniteAritcle(this) + this.alias;
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
    
  getSaveString:function() {
    if (this.customSave) {
      this.customSave();
    }
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
  
  getExits:function(excludeLocked) {
    const list = [];
    for (let i = 0; i < EXITS.length; i++) {
      if (this.hasExit(EXITS[i].name, excludeLocked)) {
        list.push(this[EXITS[i].name]);
      }
    }
    return list; 
  },
  
  // returns null if there are no exits
  getRandomExit:function(excludeLocked) {
    return randomFromArray(this.getExits()); 
  },
  
  hasExit:function(dir, excludeLocked) {
    if (!this[dir]) return false;
    if (excludeLocked && this[dir].isLocked()) return false;
    return !this[dir].isHidden();
  },
  
  findExit:function(dest, excludeLocked) {
    if (typeof dest === "object") dest = dest.name;
    for (let i = 0; i < EXITS.length; i++) {
      if (this.hasExit(EXITS[i].name, excludeLocked) && this[EXITS[i].name].name === dest) {
        return this[EXITS[i].name];
      }
    }
    return null;
  },

  // Lock or unlock the exit indicated
  // Returns false if the exit does not exist or is not an Exit object
  // Returns true if successful
  // TODO!!! These will not be saved
  setExitLock:function(room, dir, locked) {
    if (!room[dir]) { return false; }
    const ex = room[dir];
    room[dir].locked = locked;
    return true;  
  },

  // Lock or unlock the exit indicated
  // Returns false if the exit does not exist or is not an Exit object
  // Returns true if successful
  // TODO!!! These will not be saved
  setExitNonexistent:function(room, dir, hidden) {
    if (!room[dir]) { return false; }
    room[dir].hidden = hidden;
    return true;  
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

