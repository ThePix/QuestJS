"use strict";

// Should all be language neutral




const TAKEABLE_DICTIONARY = {
  getVerbs:function() {
    const verbs = this.use === undefined ? [VERBS.examine] : [VERBS.examine, VERBS.use];
    if (this.isAtLoc(game.player.name)) {
      verbs.push(VERBS.drop);
    }
    else {
      verbs.push(VERBS.take);
    }
    return verbs;
  },

  takeable:true,
  
  drop:function(isMultiple, char) {
    msg(prefix(this, isMultiple) + DROP_SUCCESSFUL(char, this));
    this.moveToFrom(char.loc);
    return true;
  },
  
  take:function(isMultiple, char) {
    if (this.isAtLoc(char.name)) {
      msg(prefix(this, isMultiple) + ALREADY_HAVE(char, this));
      return false;
    }

    if (!char.canTakeDrop()) return false;
    msg(prefix(this, isMultiple) + TAKE_SUCCESSFUL(char, this));
    this.moveToFrom(char.name);
    if (this.display === DSPY_SCENERY) {
      this.display = DSPY_DISPLAY;
    }
    return true;
  },
  
};


const TAKEABLE = () => TAKEABLE_DICTIONARY;



// countableLocs should be a dictionary, with the room name as the key, and the number there as the value
const COUNTABLE = function(countableLocs) {
  const res = $.extend({}, TAKEABLE_DICTIONARY);
  res.countable = true;
  res.countableLocs = countableLocs;
  res.infinity = "uncountable";
  
  res.extractNumber = function() {
    const md = /^(\d+)/.exec(this.cmdMatch);
    if (!md) { return false; }
    return parseInt(md[1]);
  };
  
  res.templatePreSave = function() {
    const l = [];
    for (let key in this.countableLocs) {
      l.push(key + "=" + this.countableLocs[key]);
    }
    this.customSaveCountableLocs = l.join(",");
    this.preSave();
  };

  res.templatePostLoad = function() {
    const l = this.customSaveCountableLocs.split(",");
    this.countableLocs = {};
    for (let i = 0; i < l.length; i++) {
      const parts = l[i].split("=");
      this.countableLocs[parts[0]] = parseInt(parts[1]);
    }
    delete this.customSaveCountableLocs;
    this.postLoad();
  };

  res.byname = function(options) {
    let s = "";
    let count = options.loc ? this.countAtLoc(options.loc) : false;
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
  
  res.moveToFrom = function(toLoc, fromLoc, count) {
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
  
  res.findSource = function(sourceLoc) {
    if (this.isAtLoc(sourceLoc)) {
      return sourceLoc;
    }
    const l = scope(isInside, {container:w[sourceLoc]});
    for (let i = 0; i < l.length; i++) {
      if (l[i].player) { continue; }
      sourceLoc = this.findSource(l[i].name);
      if (sourceLoc) { return sourceLoc; }
    }
    return false;
  }


  res.take = function(isMultiple, char) {
    const sourceLoc = this.findSource(char.loc);
    if (!sourceLoc) {
      msg(prefix(this, isMultiple) + NONE_THERE(char, this));
      return false;
    }
    let n = this.extractNumber();
    let m = this.countAtLoc(sourceLoc);
    //if (m === 0) {
    //  msg(prefix(this, isMultiple) + NONE_THERE(char, this));
    //  return false;
    //}

    if (!n) { n = m; }  // no number specified
    if (n > m)  { n = m; }  // too big number specified
    
    msg(prefix(this, isMultiple) + TAKE_SUCCESSFUL(char, this, n));
    this.takeFrom(sourceLoc, n);
    this.giveTo(char.name, n);
    if (this.display === DSPY_SCENERY) {
      this.display = DSPY_DISPLAY;
    }
    return true;
  };

  res.drop = function(isMultiple, char) {
    let n = this.extractNumber();
    let m = this.countAtLoc(char.name);
    if (m === 0) {
      msg(prefix(this, isMultiple) + NONE_HELD(char, this));
      return false;
    }

    if (!n) { m === INFINITY ? 1 : n = m; }  // no number specified
    if (n > m)  { n = m; }  // too big number specified
    
    msg(prefix(this, isMultiple) + DROP_SUCCESSFUL(char, this, n));
    this.takeFrom(char.name, n);
    this.giveTo(char.loc, n);
    return true;
  };

  return res;
};



const WEARABLE = function(layer, slots) {
  const res = $.extend({}, TAKEABLE_DICTIONARY);
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

  res.icon = () => '<img src="images/garment12.png" />';
  
  res.getWearRemoveBlocker = function(char, toWear) {
    if (!this.layer) { return false; }
    for (let i = 0; i < slots.length; i++) {
      let outer = char.getOuterWearable(slots[i]);
      if (outer && outer !== this && outer.layer >= this.layer) {
        return outer;
      }
    }
    return false;
  };
  
  res.canWearRemove = function(char, toWear) {
    const garment = this.getWearRemoveBlocker(char, toWear);
    if (garment) {
      if (toWear) {
        msg(CANNOT_WEAR_OVER(char, this, garment));
      }
      else {
        msg(CANNOT_REMOVE_UNDER(char, this, garment));
      }
      return false;
    }
    return true;
  };
  
  // Assumes the item is already held  
  res.wear = function(isMultiple, char) {
    if (!this.canWearRemove(char, true)) { return false; }
    if (!char.canWearRemove(this, true)) { return false; }
    msg(prefix(this, isMultiple) + WEAR_SUCCESSFUL(char, this));
    this.worn = true;
    if (this.afterWear) this.afterWear(char);
    return true;
  };

  // Assumes the item is already held  
  res.remove = function(isMultiple, char) {
    if (!this.canWearRemove(char, false)) { return false; }
    if (!char.canWearRemove(this, false)) { return false; }
    msg(prefix(this, isMultiple) + REMOVE_SUCCESSFUL(char, this));
    this.worn = false;
    if (this.afterRemove) this.afterRemove(char);
    return true;
  };

  res.byname = function(options) {
    if (!options) { options = {}; }
    let s = "";
    if (options.article === DEFINITE) {
      s = addDefiniteArticle(this);
    }
    if (options.article === INDEFINITE) {
      s = addIndefiniteArticle(this);
    }
    s += this.alias;
    if (this.worn && options.modified && (this.isAtLoc(game.player.name))) { s += " (worn)"; }
    return s;
  };

  return res;
};


const VESSEL = function(capacity) {
  const res = {};
  res.vessel = true;
  res.containedLiquidName = false;
  res.volumeContained = false;
  res.capacity = capacity;

  res.byname = function(options) {
    if (!options) { options = {}; }
    let s = "";
    if (options.article === DEFINITE) {
      s = addDefiniteArticle(this);
    }
    if (options.article === INDEFINITE) {
      s = addIndefiniteArticle(this);
    }
    s += this.alias;
    if (options.modified && res.volumeContained) { s += " (" + this.volumeContained + " " + VOLUME_UNITS + " " + res.containedLiquidName + ")"; }
    return s;
  };
  
  res.fill = function(isMultiple, char) {
    if (this.volumeContained >= this.capacity) {
      msg(prefix(this, isMultiple) + ALREADY(this));
      return false;
    }
    // check if liquid available
    msg(prefix(this, isMultiple) + FILL_SUCCESSFUL(char, this));
    //this.worn = false;
    return true;
  };

  res.empty = function(isMultiple, char) {
    if (this.volumeContained >= this.capacity) {
      msg(prefix(this, isMultiple) + ALREADY(this));
      return false;
    }
    // check if liquid available
    msg(prefix(this, isMultiple) + EMPTY_SUCCESSFUL(char, this));
    //this.worn = false;
    return true;
  };

  return res;
}

const LIQUID = function() {
  const res = {};
  res.liquid;
  return res;
}


const CONTAINER = function(openable) {
  const res = {};
  res.container = true;
  res.closed = openable;
  res.openable = openable;
  res.listContents = contentsForContainer;
  res.transparent = false;
  
  res.getVerbs = function() {
    const arr = [VERBS.examine];
    if (this.takeable) {
      arr.push(this.isAtLoc(game.player.name) ? VERBS.drop : VERBS.take);
    }
    if (this.openable) {
      arr.push(this.closed ? VERBS.open : VERBS.close);
    }
    return arr;
  };

  res.byname = function(options) {
    let prefix = "";
    if (options.article === DEFINITE) {
      prefix = addDefiniteArticle(this);
    }
    if (options.article === INDEFINITE) {
      prefix = addIndefiniteArticle(this);
    }
    const contents = this.getContents();
    if (contents.length === 0 || !options.modified || (this.closed && !this.transparent)) {
      return prefix + this.alias;
    }
    else {
      return prefix + this.alias + " (" + this.listContents(contents) + ")";
    }
  };
  
  res.getContents = function(includeScenery) {
    const list = [];
    const threshold = includeScenery ? DSPY_SCENERY - 1: DSPY_SCENERY
    for (let key in w) {
      if (w[key].isAtLoc(this.name) && w[key].display > threshold) {
        list.push(w[key]);
      }
    }
    return list;
  };
  
  res.open = function(isMultiple, char) {
    if (!this.openable) {
      msg(prefix(this, isMultiple) + CANNOT_OPEN(char, this));
      return false;
    }
    else if (!this.closed) {
      msg(prefix(this, isMultiple) + ALREADY(this));
      return false;
    }
    if (this.locked) {
      if (this.testKeys(char)) {
        this.closed = false;
        msg(prefix(this, isMultiple) + UNLOCK_SUCCESSFUL(char, this));
        msg(prefix(this, isMultiple) + OPEN_SUCCESSFUL(char, this));
        return true;
      }
      else {
        msg(prefix(this, isMultiple) + LOCKED(char, this));
        return false;
      }
    }
    this.closed = false;
    msg(prefix(this, isMultiple) + OPEN_SUCCESSFUL(char, this));
    return true;
  };
  
  res.close = function(isMultiple, char) {
    if (!this.openable) {
      msg(prefix(this, isMultiple) + CANNOT_CLOSE(char, this));
      return false;
    }
    else if (this.closed) {
      msg(prefix(this, isMultiple) + ALREADY(this));
      return false;
    }
    this.hereVerbs = ['Examine', 'Open'];
    this.closed = true;
    msg(prefix(this, isMultiple) + CLOSE_SUCCESSFUL(char, this));
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
  const res = {};
  res.container = true;
  res.closed = false;
  res.openable = false;
  res.byname = CONTAINER().byname;
  res.getContents = CONTAINER().getContents;
  res.listContents = contentsForSurface;
  res.canReachThrough = () => true;
  res.canSeeThrough = () => true;
  return res;
};


const OPENABLE = function(alreadyOpen) {
  const res = {};
  res.container = true;
  res.closed = !alreadyOpen;
  res.openable = true;
  
  res.getVerbs = function() {
    const arr = [VERBS.examine];
    if (this.takeable) {
      arr.push(this.isAtLoc(game.player.name) ? VERBS.drop : VERBS.take);
    }
    arr.push(this.closed ? VERBS.open : VERBS.close);
    return arr;
  };

  res.byname = function(options) {
    let s = "";
    if (options.article === DEFINITE) {
      s = addDefiniteArticle(this);
    }
    if (options.article === INDEFINITE) {
      s = addIndefiniteArticle(this);
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
  const res = {
    keyNames:keyNames,
    locked:true,
    lock:function(isMultiple, char) {
      if (this.locked) {
        msg(ALREADY(this));
        return false;
      }
      if (!this.testKeys(char, true)) {
        msg(NO_KEY(char, this));
        return false;
      }
      if (!this.closed) {
        this.closed = true;
        msg(CLOSE_SUCCESSFUL(char, this));
      }      
      msg(LOCK_SUCCESSFUL(char, this));
      this.locked = true;
      return true;
    },
    unlock:function(isMultiple, char) {
      if (!this.locked) {
        msg(ALREADY(this));
        return false;
      }
      if (!this.testKeys(char, false)) {
        msg(NO_KEY(char, this));
        return false;
      }
      msg(UNLOCK_SUCCESSFUL(char, this));
      this.locked = false;
      return true;
    },
    testKeys:function(char, toLock) {
      for (let i = 0; i < keyNames.length; i++) {
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
  const res = {
    testForPosture:(char, posture) => true,
    getoff:function(isMultiple, char) {
      if (!char.posture) {
        msg(ALREADY(char));
        return false;
      }
      if (char.posture) {
        msg(STOP_POSTURE(char))
        return true;
      }  
    },
  }
  res.assumePosture = function(isMultiple, char, posture, success_msg) {
    if (char.posture === posture && char.postureFurniture === this.name) {
      msg(ALREADY(char));
      return false;
    }
    if (!this.testForPosture(char, posture)) {
      return false;
    }
    if (char.posture) {
      msg(STOP_POSTURE(char))
    }
    char.posture = posture;
    char.postureFurniture = this.name;
    msg(success_msg(char, this));
    if (typeof this["on" + posture] === "function") this["on" + posture](char);
    return true;
  };
  if (options.sit) {
    res.siton = function(isMultiple, char) {
      return this.assumePosture(isMultiple, char, "sitting", SIT_ON_SUCCESSFUL);
    };
  }
  if (options.stand) {
    res.standon = function(isMultiple, char) {
      return this.assumePosture(isMultiple, char, "standing", STAND_ON_SUCCESSFUL);
    };
  }
  if (options.recline) {
    res.reclineon = function(isMultiple, char) {
      return this.assumePosture(isMultiple, char, "reclining", RECLINE_ON_SUCCESSFUL);
    };
  }

  return res;
}

const SWITCHABLE = function(alreadyOn) {
  const res = {};
  res.switchedon = alreadyOn;
  
  res.getVerbs = function() {
    const arr = [VERBS.examine];
    if (this.takeable) {
      arr.push(this.isAtLoc(game.player.name) ? VERBS.drop : VERBS.take);
    }
    arr.push(this.switchedon ? VERBS.switchoff : VERBS.switchon);
    return arr;
  };

  res.switchon = function(isMultiple, char) {
    if (this.switchedon) {
      msg(prefix(this, isMultiple) + ALREADY(this));
      return false;
    }
    if (!this.checkCanSwitchOn()) {
      return false;
    }
    msg(TURN_ON_SUCCESSFUL(char, this));
    this.doSwitchon();
    return true;
  };
  
  res.doSwitchon = function() {
    let lighting = game.dark;
    this.switchedon = true;
    game.update();
    if (lighting !== game.dark) {
      game.room.description();
    }
  };
  
  res.checkCanSwitchOn = () => true;
  
  res.switchoff = function(isMultiple, char) {
    if (!this.switchedon) {
      msg(prefix(this, isMultiple) + ALREADY(this));
      return false;
    }
    msg(TURN_OFF_SUCCESSFUL(char, this));
    this.doSwitchoff();
    return true;
  };
  
  res.doSwitchoff = function() {
    let lighting = game.dark;
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
  const res = {
    display:DSPY_SCENERY,
    component:true,
    loc:nameOfWhole,
    takeable:true, // Set this as it has its own take attribute
    isAtLoc:function(loc) {
      let cont = w[this.loc];
      if (cont.isAtLoc(loc)) { return true; }
      return cont.isAtLoc(loc);
    },
    take:function(isMultiple, char) {
      msg(prefix(this, isMultiple) + CANNOT_TAKE_COMPONENT(char, this));
      return false;
    },
  };
  if (!w[nameOfWhole]) debugmsg("Whole is not define: " + nameOfWhole);
  return res;
};

const TRANSIT_BUTTON = function(nameOfTransit) {
  const res = {
    loc:nameOfTransit,
    transitButton:true,
    getVerbs:function() { return [VERBS.examine, "Push"]; },
    push:function() {
      const transit = w[this.loc];
      const exit = transit[transit.transitDoorDir];
      if (this.locked) {
        printOrRun(game.player, this, "transitLocked");
        return false;
      }
      else if (exit.name === this.transitDest) {
        printOrRun(game.player, this, "transitAlreadyHere");
        return false;
      }
      else {
        printOrRun(game.player, this, "transitGoToDest");
        if (typeof w[this.loc].transitOnMove === "function") w[this.loc].transitOnMove(this.transitDest, exit.name);
        exit.name = this.transitDest;
        return true;
      }
    },
  };
  return res;
};


// This is for rooms
const TRANSIT = function(exitDir) {
  const res = {
    saveExitDests:true,
    transitDoorDir:exitDir,
    beforeEnter:function() {
      this[this.transitDoorDir].name = game.player.previousLoc;
    },
    getTransitButtons:function(includeHidden, includeLocked) {
      return this.getContents().filter(function(el) {
        if (!el.transitButton) return false;
        if (!includeHidden && el.hidden) return false;
        if (!includeLocked && el.locked) return false;
        return true;
      });
    },
  };
  return res;
};

// This function is useful only to the TRANSIT template so is here
function transitOfferMenu() {
  if (typeof this.transitCheck === "function" && !this.transitCheck()) {
    if (this.transitAutoMove) world.setRoom(game.player, game.player.previousLoc, this.transitDoorDir)
    return false;
  }
  const buttons = this.getTransitButtons(true, false);
  const transitDoorDir = this.transitDoorDir;
  const room = this;
  showMenu(this.transitMenuPrompt, buttons.map(el => el.transitDestAlias), function(result) {
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].transitDestAlias === result) {
        if (room[transitDoorDir].name === buttons[i].transitDest) {
          printOrRun(game.player, buttons[i], "transitAlreadyHere");
        }
        else {
          printOrRun(game.player, buttons[i], "transitGoToDest");
          if (typeof room.transitOnMove === "function") room.transitOnMove(buttons[i].transitDest, room[transitDoorDir].name);
        }
        
        room[transitDoorDir].name = buttons[i].transitDest
        if (room.transitAutoMove) world.setRoom(game.player, buttons[i].transitDest, room[transitDoorDir])
      }
    }
  });
}




const PLAYER = function() {

  const res = {
    pronouns:PRONOUNS.secondperson,
    display:DSPY_SCENERY,
    player:true,
    // The following are used also by NPCs, so we can use the same functions for both
    canReachThrough:() => true,
    canSeeThrough:() => true,
    getAgreement:() => true,
    getContents:CONTAINER().getContents,
    pause:NULL_FUNC,  
    canManipulate:() => true,
    canMove:() => true,
    canTalk:() => true,
    canPosture:() => true,
    canWearRemove:() => true,
    canTakeDrop:() => true,
    getOuterWearable:function(slot) {
      const clothing = scope(isWornBy, {npc:this}).filter(el => el.slots.includes(slot));
      if (clothing.length === 0) { return false; }
      let outer = clothing[0];
      for (let i = 1; i < clothing.length; i++) {
        if (clothing[i].layer > outer.layer) {
          outer = clothing[i];
        }
      }
      return outer;
    },
  }
  return res;
};


