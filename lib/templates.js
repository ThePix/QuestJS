"use strict";

// Should all be language neutral



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
    for (var i = 0; i < ROOM_TEMPLATE.length; i++) {
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
    var list = [];
    for (var key in w) {
      if (w[key].isAtLoc(this.name) && w[key].display >= DSPY_SCENERY) {
        list.push(w[key]);
      }
    }
    return list;
  },
  
  getExits:function(excludeLocked) {
    var list = [];
    for (var i = 0; i < EXITS.length; i++) {
      if (this.hasExit(EXITS[i].name, excludeLocked)) {
        list.push(this[EXITS[i].name]);
      }
    }
    return list; 
  },
  
  getRandomExit:function(excludeLocked) {
    return randomFromArray(this.getExits()); 
  },
  
  hasExit:function(dir, excludeLocked) {
    if (!this[dir]) return false;
    if (excludeLocked && this[dir].isLocked()) return false;
    return !this[dir].isHidden();
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


const TAKEABLE_DICTIONARY = {
  getVerbs:function() {
    if (this.isAtLoc(game.player.name)) {
      return [VERBS.examine, VERBS.drop];
    }
    else {
      return [VERBS.examine, VERBS.take];
    }
  },

  takeable:true,
  
  drop:function(isMultiple, char) {
    msg(prefix(this, isMultiple) + CMD_DROP_SUCCESSFUL(char, this));
    this.moveFromTo(this.loc, char.loc);
    return true;
  },
  
  take:function(isMultiple, char) {
    if (this.isAtLoc(char.name)) {
      msg(prefix(this, isMultiple) + CMD_ALREADY_HAVE(char, this));
      return false;
    }

    msg(prefix(this, isMultiple) + CMD_TAKE_SUCCESSFUL(char, this));
    this.moveFromTo(this.loc, char.name);
    if (this.display === DSPY_SCENERY) {
      this.display = DSPY_DISPLAY;
    }
    return true;
  },
  
};


const TAKEABLE = function() {
  return TAKEABLE_DICTIONARY;
}



const COUNTABLE = function(countableLocs) {
  var res = $.extend({}, TAKEABLE_DICTIONARY);
  //var res = TAKEABLE_DICTIONARY;
  res.countable = true;
  res.countableLocs = countableLocs;
  res.infinity = "uncountable";
  
  res.extractNumber = function() {
    var md = /^(\d+)/.exec(this.cmdMatch);
    if (!md) { return false; }
    return parseInt(md[1]);
  };
  
  res.customSave = function() {
    var l = [];
    for (var key in this.countableLocs) {
      l.push(key + "=" + this.countableLocs[key]);
    }
    this.customSaveCountableLocs = l.join(",");
  };

  res.customLoad = function() {
    var l = this.customSaveCountableLocs.split(",");
    this.countableLocs = {};
    for (var i = 0; i < l.length; i++) {
      var parts = l[i].split("=");
      this.countableLocs[parts[0]] = parseInt(parts[1]);
    }
    delete this.customSaveCountableLocs;
  };

  res.byname = function(options) {
    var s = "";
    var count = options.loc ? this.countAtLoc(options.loc) : false;
    if (options.count) {
      count = options.count;
      s = (count === INFINITY ? this.infinity : toWords(count)) + " ";
    }
    else if (options.article === DEFINITE) {
      s = "the ";
    }
    else if (options.article === INDEFINITE) {
      if (count) {
        switch (count) {
          case 1: s = "a "; break;
          case INFINITY: s = this.infinity + " "; break;
          default: s = toWords(count) + " ";
        }
      }
      else {
        s = "some ";
      }
    }
    if (count === 1) {
      s += this.alias;
    }
    else if (this.pluralAlias) {
      s += this.pluralAlias;
    }
    else {
      s += this.alias + "s";
    }
    return s;
  };
  
  res.getListAlias = function(loc) {
    return sentenceCase(this.pluralAlias ? this.pluralAlias : this.listalias + "s") + " (" + this.countAtLoc(loc) + ")";
  };
  
  res.isAtLoc = function(loc) {
    if (!this.countableLocs[loc]) { return false; }
    return (this.countableLocs[loc] > 0);
  };

  res.countAtLoc = function(loc) {
    if (!this.countableLocs[loc]) { return 0; }
    return this.countableLocs[loc];
  };
  
  res.moveFromTo = function(fromLoc, toLoc, count) {
    if (!count) count = this.extractNumber();
    if (!count) count = this.countAtLoc(fromLoc);
    this.takeFrom(fromLoc, count);
    this.giveTo(toLoc, count);
  };
  
  res.takeFrom = function(loc, count) {
    if (this.countableLocs[loc] !== INFINITY) this.countableLocs[loc] -= count;
    if (this.countableLocs[loc] <= 0) { delete this.countableLocs[loc]; }
    w[loc].itemTaken(this, count);
  };
  
  res.giveTo = function(loc, count) {
    if (!this.countableLocs[loc]) { this.countableLocs[loc] = 0; }
    if (this.countableLocs[loc] !== INFINITY) this.countableLocs[loc] += count;
    w[loc].itemDropped(this, count);
  };
  
  res.take = function(isMultiple, char) {
    var sourceLoc = findSource(this, char.loc);
    if (!sourceLoc) {
      msg(prefix(this, isMultiple) + CMD_NONE_THERE(char, this));
      return false;
    }
    var n = this.extractNumber();
    var m = this.countAtLoc(sourceLoc);
    //if (m === 0) {
    //  msg(prefix(this, isMultiple) + CMD_NONE_THERE(char, this));
    //  return false;
    //}

    if (!n) { n = m; }  // no number specified
    if (n > m)  { n = m; }  // too big number specified
    
    msg(prefix(this, isMultiple) + CMD_TAKE_SUCCESSFUL(char, this, n));
    this.takeFrom(sourceLoc, n);
    this.giveTo(char.name, n);
    if (this.display === DSPY_SCENERY) {
      this.display = DSPY_DISPLAY;
    }
    return true;
  };

  res.drop = function(isMultiple, char) {
    var n = this.extractNumber();
    var m = this.countAtLoc(char.name);
    if (m === 0) {
      msg(prefix(this, isMultiple) + CMD_NONE_HELD(char, this));
      return false;
    }

    if (!n) { m === INFINITY ? 1 : n = m; }  // no number specified
    if (n > m)  { n = m; }  // too big number specified
    
    msg(prefix(this, isMultiple) + CMD_DROP_SUCCESSFUL(char, this, n));
    this.takeFrom(char.name, n);
    this.giveTo(char.loc, n);
    return true;
  };

  return res;
};



const WEARABLE = function(layer, slots) {
  var res = $.extend({}, TAKEABLE_DICTIONARY);
  //var res = TAKEABLE_DICTIONARY;
  res.wearable = true;
  res.layer = layer ? layer : false;
  res.slots = slots && layer ? slots: [];
  
  res.getVerbs = function() {
    if (!this.isAtLoc(game.player.name)) {
      return [VERBS.examine, VERBS.take];
    }
    else if (this.worn) {
      if (this.getWearRemoveBlocker(game.player, false)) {
        return [VERBS.examine];
      }
      else {
        return [VERBS.examine, VERBS.remove];
      }
    }
    else {
      if (this.getWearRemoveBlocker(game.player, true)) {
        return [VERBS.examine, VERBS.drop];
      }
      else {
        return [VERBS.examine, VERBS.drop, VERBS.wear];
      }
    }
  };

  res.icon = function() {
    return ('<img src="images/garment12.png" />');
  };
  
  res.getWearRemoveBlocker = function(char, toWear) {
    if (!this.layer) { return false; }
    for (var i = 0; i < slots.length; i++) {
      var outer = getOuterWearable(char, slots[i]);
      if (outer && outer !== this && outer.layer >= this.layer) {
        return outer;
      }
    }
    return false;
  };
  
  res.canWearRemove = function(char, toWear) {
    var garment = this.getWearRemoveBlocker(char, toWear);
    if (garment) {
      if (toWear) {
        msg(CMD_CANNOT_WEAR_OVER(char, this, garment));
      }
      else {
        msg(CMD_CANNOT_REMOVE_UNDER(char, this, garment));
      }
      return false;
    }
    return true;
  };
  
  // Assumes the item is already held  
  res.wear = function(isMultiple, char) {
    if (!this.canWearRemove(char, true)) { return false; }
    msg(prefix(this, isMultiple) + CMD_WEAR_SUCCESSFUL(char, this));
    this.worn = true;
    return true;
  };

  // Assumes the item is already held  
  res.remove = function(isMultiple, char) {
    if (!this.canWearRemove(char, false)) { return false; }
    msg(prefix(this, isMultiple) + CMD_REMOVE_SUCCESSFUL(char, this));
    this.worn = false;
    return true;
  };

  res.byname = function(options) {
    if (!options) { options = {}; }
    var s = "";
    if (options.article === DEFINITE) {
      s = addDefiniteAritcle(this);
    }
    if (options.article === INDEFINITE) {
      s = addIndefiniteAritcle(this);
    }
    s += this.alias;
    if (this.worn && options.modified && (this.isAtLoc(game.player.name))) { s += " (worn)"; }
    return s;
  };

  return res;
};


const VESSEL = function(capacity) {
  var res = {};
  res.vessel = true;
  res.containedLiquidName = false;
  res.volumeContained = false;
  res.capacity = capacity;

  res.byname = function(options) {
    if (!options) { options = {}; }
    var s = "";
    if (options.article === DEFINITE) {
      s = addDefiniteAritcle(this);
    }
    if (options.article === INDEFINITE) {
      s = addIndefiniteAritcle(this);
    }
    s += this.alias;
    if (options.modified && res.volumeContained) { s += " (" + this.volumeContained + " " + VOLUME_UNITS + " " + res.containedLiquidName + ")"; }
    return s;
  };
  
  res.fill = function(isMultiple, char) {
    if (this.volumeContained >= this.capacity) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(this));
      return false;
    }
    // check if liquid available
    msg(prefix(this, isMultiple) + CMD_FILL_SUCCESSFUL(char, this));
    //this.worn = false;
    return true;
  };

  res.empty = function(isMultiple, char) {
    if (this.volumeContained >= this.capacity) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(this));
      return false;
    }
    // check if liquid available
    msg(prefix(this, isMultiple) + CMD_EMPTY_SUCCESSFUL(char, this));
    //this.worn = false;
    return true;
  };

  return res;
}

const LIQUID = function() {
  var res = {};
  res.liquid;
  return res;
}


const CONTAINER = function(openable) {
  var res = {};
  res.container = true;
  res.closed = openable;
  res.openable = openable;
  res.listContents = contentsForContainer;
  res.transparent = false;
  
  res.getVerbs = function() {
    var arr = [VERBS.examine];
    if (this.takeable) {
      arr.push(this.isAtLoc(game.player.name) ? VERBS.drop : VERBS.take);
    }
    if (this.openable) {
      arr.push(this.closed ? VERBS.open : VERBS.close);
    }
    return arr;
  };

  res.byname = function(options) {
    var prefix = "";
    if (options.article === DEFINITE) {
      prefix = addDefiniteAritcle(this);
    }
    if (options.article === INDEFINITE) {
      prefix = addIndefiniteAritcle(this);
    }
    var contents = this.getContents();
    if (contents.length === 0 || !options.modified || (this.closed && !this.transparent)) {
      return prefix + this.alias;
    }
    else {
      return prefix + this.alias + " (" + this.listContents(contents) + ")";
    }
  };
  
  res.getContents = function() {
    var list = [];
    for (var key in w) {
      if (w[key].isAtLoc(this.name) && w[key].display >= DSPY_SCENERY) {
        list.push(w[key]);
      }
    }
    return list;
  };
  
  res.open = function(isMultiple, char) {
    if (!this.openable) {
      msg(prefix(this, isMultiple) + CMD_CANNOT_OPEN(char, this));
      return false;
    }
    else if (!this.closed) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(this));
      return false;
    }
    if (this.locked) {
      if (this.testKeys(char)) {
        this.closed = false;
        msg(prefix(this, isMultiple) + CMD_UNLOCK_SUCCESSFUL(char, this));
        msg(prefix(this, isMultiple) + CMD_OPEN_SUCCESSFUL(char, this));
        return true;
      }
      else {
        msg(prefix(this, isMultiple) + CMD_LOCKED(char, this));
        return false;
      }
    }
    this.closed = false;
    msg(prefix(this, isMultiple) + CMD_OPEN_SUCCESSFUL(char, this));
    return true;
  };
  
  res.close = function(isMultiple, char) {
    if (!this.openable) {
      msg(prefix(this, isMultiple) + CMD_CANNOT_CLOSE(char, this));
      return false;
    }
    else if (this.closed) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(this));
      return false;
    }
    this.hereVerbs = ['Examine', 'Open'];
    this.closed = true;
    msg(prefix(this, isMultiple) + CMD_CLOSE_SUCCESSFUL(char, this));
    return true;
  };
  
  res.icon = function() {
    return ('<img src="images/' + (this.closed ? 'closed' : 'opened') + '12.png" />');
  };
  
  res.canReachThrough = function() { return !this.closed; };
  res.canSeeThrough = function() { return !this.closed || this.transparent; };

  return res;
};


const SURFACE = function() {
  var res = {};
  res.container = true;
  res.closed = false;
  res.openable = false;
  res.byname = CONTAINER().byname;
  res.getContents = CONTAINER().getContents;
  res.listContents = contentsForSurface;
  res.canReachThrough = function() { return true; };
  res.canSeeThrough = function() { return true; };
  return res;
};


const OPENABLE = function(alreadyOpen) {
  var res = {};
  res.container = true;
  res.closed = !alreadyOpen;
  res.openable = true;
  
  res.getVerbs = function() {
    var arr = [VERBS.examine];
    if (this.takeable) {
      arr.push(this.isAtLoc(game.player.name) ? VERBS.drop : VERBS.take);
    }
    arr.push(this.closed ? VERBS.open : VERBS.close);
    return arr;
  };

  res.byname = function(options) {
    var s = "";
    if (options.article === DEFINITE) {
      s = addDefiniteAritcle(this);
    }
    if (options.article === INDEFINITE) {
      s = addIndefiniteAritcle(this);
    }
    s += this.alias;
    if (!this.closed && options.modified) { s += " (open)"; }
    return s;
  };

  res.open = CONTAINER().open;
  res.close = CONTAINER().close;
  return res;
};


const LOCKED_WITH = function(keyNames) {
  if (typeof keyNames === "string") { keyNames = [keyNames]; }
  if (keyNames === undefined) { keyNames = []; }
  var res = {
    keyNames:keyNames,
    locked:true,
    lock:function(isMultiple, char) {
      if (this.locked) {
        msg(CMD_ALREADY(this));
        return false;
      }
      if (!this.testKeys(char, true)) {
        msg(CMD_NO_KEY(char, this));
        return false;
      }
      if (!this.closed) {
        this.closed = true;
        msg(CMD_CLOSE_SUCCESSFUL(char, this));
      }      
      msg(CMD_LOCK_SUCCESSFUL(char, this));
      this.locked = true;
      return true;
    },
    unlock:function(isMultiple, char) {
      if (!this.locked) {
        msg(CMD_ALREADY(this));
        return false;
      }
      if (!this.testKeys(char, false)) {
        msg(CMD_NO_KEY(char, this));
        return false;
      }
      msg(CMD_UNLOCK_SUCCESSFUL(char, this));
      this.locked = false;
      return true;
    },
    testKeys:function(char, toLock) {
      for (var i = 0; i < keyNames.length; i++) {
        if (!w[keyNames[i]]) {
          errormsg("The key name for this container, `" + keyNames[i] + "`, does not match any key in the game.");
          return false;
        }
        if (w[keyNames[i]].isAtLoc(char.name)) { 
          return true; 
        }
      }
      return false;
    }
  };
  return res;
};


const FURNITURE = function(options) {
  var res = {
    testForPosture:function(char, posture) {
      return true;
    },
    getoff:function(isMultiple, char) {
      if (!char.posture) {
        msg(CMD_ALREADY(char));
        return false;
      }
      if (char.posture) {
        msg(CMD_STOP_POSTURE(char))
        return true;
      }  
    },
  }
  res.assumePosture = function(isMultiple, char, posture, success_msg) {
    if (char.posture === posture && char.postureFurniture === this) {
      msg(CMD_ALREADY(char));
      return false;
    }
    if (!this.testForPosture(char, posture)) {
      return false;
    }
    if (char.posture) {
      msg(CMD_STOP_POSTURE(char))
    }
    char.posture = posture;
    char.postureFurniture = this;
    msg(success_msg(char, this));
    if (typeof this["on" + posture] === "function") this["on" + posture](char);
    return true;
  };
  if (options.sit) {
    res.siton = function(isMultiple, char) {
      return this.assumePosture(isMultiple, char, "sitting", CMD_SIT_ON_SUCCESSFUL);
    };
  }
  if (options.stand) {
    res.standon = function(isMultiple, char) {
      return this.assumePosture(isMultiple, char, "standing", CMD_STAND_ON_SUCCESSFUL);
    };
  }
  if (options.recline) {
    res.reclineon = function(isMultiple, char) {
      return this.assumePosture(isMultiple, char, "reclining", CMD_RECLINE_ON_SUCCESSFUL);
    };
  }

  return res;
}

const SWITCHABLE = function(alreadyOn) {
  var res = {};
  res.switchedon = alreadyOn;
  
  res.getVerbs = function() {
    var arr = [VERBS.examine];
    if (this.takeable) {
      arr.push(this.isAtLoc(game.player.name) ? VERBS.drop : VERBS.take);
    }
    arr.push(this.switchedon ? VERBS.switchoff : VERBS.switchon);
    return arr;
  };

  res.switchon = function(isMultiple, char) {
    if (this.switchedon) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(this));
      return false;
    }
    if (!this.checkCanSwitchOn()) {
      return false;
    }
    msg(CMD_TURN_ON_SUCCESSFUL(char, this));
    this.doSwitchon();
    return true;
  };
  
  res.doSwitchon = function() {
    var lighting = game.dark;
    this.switchedon = true;
    game.update();
    if (lighting !== game.dark) {
      game.room.description();
    }
  };
  
  res.checkCanSwitchOn = function() { return true; };
  
  res.switchoff = function(isMultiple, char) {
    if (!this.switchedon) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(this));
      return false;
    }
    msg(CMD_TURN_OFF_SUCCESSFUL(char, this));
    this.doSwitchoff();
    return true;
  };
  
  res.doSwitchoff = function() {
    var lighting = game.dark;
    this.switchedon = false;
    game.update();
    if (lighting !== game.dark) {
      game.room.description();
    }
  };

  return res;
};


// Ideally Quest will check components when doing a command for the whole
// I think?

const COMPONENT = function(nameOfWhole) {
  var res = {
    display:DSPY_SCENERY,
    component:true,
    loc:nameOfWhole,
    takeable:true, // Set this as it has its own take attribute
    isAtLoc:function(loc) {
      var cont = w[this.loc];
      if (cont.isAtLoc(loc)) { return true; }
      return cont.isAtLoc(loc);
    },
    take:function(isMultiple, char) {
      msg(prefix(this, isMultiple) + CMD_CANNOT_TAKE_COMPONENT(char, this));
      return false;
    },
  };
  if (!w[nameOfWhole]) debugmsg("Whole is not define: " + nameOfWhole);
  return res;
};


const PLAYER = function() {
  var res = {
    pronouns:PRONOUNS.secondperson,
    display:DSPY_SCENERY,
    player:true,
    canReachThrough:function() { return true; },
    canSeeThrough:function() { return true; },
    getAgreement:function() { return true; },
    getContents:CONTAINER().getContents,
    pause:function() { },  // so it is like an NPC
  }
  return res;
};


