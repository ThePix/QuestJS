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
    if (!char.canManipulate(this, "take")) return false;
    msg(prefix(this, isMultiple) + TAKE_SUCCESSFUL(char, this));
    this.moveToFrom(char.name);
    if (this.scenery) delete this.scenery;
    return true;
  },
  
};


const TAKEABLE = () => TAKEABLE_DICTIONARY;



const SHIFTABLE = function() {
  const res = {
    shiftable:true,
  };
  return res;
}








const createEnsemble = function(name, members, dict) {
  const res = createItem(name, dict);
  res.ensemble = true;
  res.members = members;
  res.parsePriority = 10;
  res.inventorySkip = true;
  res.takeable = true;
  res.getWorn = function(situation) { return this.isAtLoc(this.members[0].loc, situation) && this.members[0].getWorn(); }

  res.byname = function(options) {
    if (!options) options = {};
    let s = "";
    if (options.article === DEFINITE) {
      s = addDefiniteArticle(this);
    }
    if (options.article === INDEFINITE) {
      s = addIndefiniteArticle(this);
    }
    s += this.alias;
    if (options && options.possessive) s += "'s";
    if (this.members[0].getWorn() && options.modified && this.isAllTogether()) { s += " (worn)"; }
    if (options && options.capital) s = sentenceCase(s);
    //console.log(s)
    return s;
  };
  
  // Tests if all parts are n the same location and either all are worn or none are worn
  // We can use this to determine if the set is together or not too
  res.isAtLoc = function(loc, situation) {
    if (situation !== display.PARSER) return false;
    const worn = this.members[0].getWorn();
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].loc !== loc) return false;
      if (this.members[i].getWorn() !== worn) return false;
    }
    return true;
  }
  
  // Tests if all parts are together
  res.isAllTogether = function() {
    const worn = this.members[0].getWorn();
    const loc = this.members[0].loc;
    for (let i = 0; i < this.members.length; i++) {
      if (this.members[i].loc !== loc) return false;
      if (this.members[i].breakEnsemble && this.members[i].breakEnsemble()) return false;
      if (this.members[i].getWorn() !== worn) return false;
    }
    return true;
  }
  
  res.drop = function(isMultiple, char) {
    msg(prefix(this, isMultiple) + DROP_SUCCESSFUL(char, this));
    for (let i = 0; i < this.members.length; i++) {
      this.members[i].moveToFrom(char.loc);
    }
    return true;
  }
  
  res.take = function(isMultiple, char) {
    if (this.isAtLoc(char.name)) {
      msg(prefix(this, isMultiple) + ALREADY_HAVE(char, this));
      return false;
    }

    if (!char.canManipulate(this, "take")) return false;
    msg(prefix(this, isMultiple) + TAKE_SUCCESSFUL(char, this));
    for (let i = 0; i < this.members.length; i++) {
      this.members[i].moveToFrom(char.name);
      if (this.members[i].scenery) delete this.members[i].scenery;
    }
    return true;
  }

  for (let i = 0; i < members.length; i++) {
    members[i].ensembleMaster = res;
    /*members[i].isAtLoc = function(loc, preferEnsemble) {
      if (this.ensembleMaster.isAtLoc(this.loc) && preferEnsemble) return false;
      return (this.loc === loc);
    }*/
  }
  return res;
}


const MERCH = function(value, locs) {
  const res = {
    price:value,
    getPrice:function() { return this.price },

    // The price when the player sells the item
    // By default, half the "list" price
    // 
    getSellingPrice:function(char) { 
      if (w[char.loc].buyingValue) {
        return Math.round(this.getPrice() * (w[char.loc].buyingValue) / 100);
      }
      return Math.round(this.getPrice() / 2); 
    },
    
    // The price when the player buys the item
    // Uses the sellingDiscount, as te shop is selling it!
    getBuyingPrice:function(char) {
      if (w[char.loc].sellingDiscount) {
        return Math.round(this.getPrice() * (100 - w[char.loc].sellingDiscount) / 100);
      }
      return this.getPrice(); 
    },
    
    isForSale:function(loc) {
      if (this.doNotClone) return (this.salesLoc === loc);
      return (this.salesLocs.includes(loc));
    },
    
    canBeSoldHere:function(loc) {
      return w[loc].willBuy && w[loc].willBuy(this);
    },
    
    purchase:function(isMultiple, char) {
      if (!this.isForSale(char.loc)) return failedmsg(prefix(this, isMultiple) + CANNOT_PURCHASE_HERE(char, this));
      const cost = this.getBuyingPrice(char);
      if (char.money < cost) return failedmsg(prefix(this, isMultiple) + CANNOT_AFFORD(char, this, cost));
      this.purchaseScript(isMultiple, char, cost)
    },
    
    purchaseScript:function(isMultiple, char, cost) {
      char.money -= cost;
      msg(prefix(this, isMultiple) + PURCHASE_SUCCESSFUL(char, this, cost));
      if (this.doNotClone) {
        this.moveToFrom(char.name, char.loc);
        delete this.salesLoc;
      }
      else {
        cloneObject(this, char.name);
      }
      return SUCCESS;
    },
    
    sell:function(isMultiple, char) {
      if (!this.canBeSoldHere(char.loc)) {
        return failedmsg(prefix(this, isMultiple) + CANNOT_SELL_HERE(char, this));
      }
      const cost = this.getSellingPrice(char);
      char.money += cost;
      msg(prefix(this, isMultiple) + SELL_SUCCESSFUL(char, this, cost));
      if (this.doNotClone) {
        this.moveToFrom(char.loc, char.name);
        this.salesLoc = char.loc;
      }
      delete this.loc
      return SUCCESS;
      
    },
  }
  if (!Array.isArray(locs)) {
    res.doNotClone = true;
    res.salesLoc = locs;
  }
  else {
    res.salesLocs = locs;
  }
  return res;
}  






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
    if (!options) options = {};
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
    if (options && options.possessive) s += "'s";
    if (options && options.capital) s = sentenceCase(s);
    return s;
  };
  
  res.getListAlias = function(loc) {
    return sentenceCase(this.pluralAlias ? this.pluralAlias : this.listalias + "s") + " (" + this.countAtLoc(loc) + ")";
  };
  
  res.isAtLoc = function(loc, situation) {
    if (!this.countableLocs[loc]) { return false; }
    if (situation === display.LOOK && this.scenery) return false;
    if (situation === display.SIDE_PANE && this.scenery) return false;
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
  
  res.findSource = function(sourceLoc, tryContainers) {
    // some at the specific location, so use them
    if (this.isAtLoc(sourceLoc)) {
      return sourceLoc;
    }

    /*
    // get a list of items inside the source
    const l = scope(isInside, {container:w[sourceLoc]});
    for (let i = 0; i < l.length; i++) {
      // exclude the player
      if (l[i].player) { continue; }
      sourceLoc = this.findSource(l[i].name);
      if (sourceLoc) { return sourceLoc; }
    }*/

    if (tryContainers) {
      const containers = scopeReachable().filter(el => el.container);
      for (let i = 0; i < containers.length; i++) {
        if (containers[i].closed) continue;
        if (this.isAtLoc(containers[i].name)) return containers[i].name;
      }
    }

    return false;
  }


  res.take = function(isMultiple, char) {
    const sourceLoc = this.findSource(char.loc, true);
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
    if (this.scenery) delete this.scenery;
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



const WEARABLE = function(wear_layer, slots) {
  const res = $.extend({}, TAKEABLE_DICTIONARY);
  res.wearable = true;
  res.wear_layer = wear_layer ? wear_layer : false;
  res.slots = slots && wear_layer ? slots: [];
  
  res.getSlots = function() { return this.slots; };
  res.getWorn = function() { return this.worn; };
  
  res.getVerbs = function() {
    if (!this.isAtLoc(game.player.name)) {
      return [VERBS.examine, VERBS.take];
    }
    else if (this.getWorn()) {
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
    if (!this.wear_layer) { return false; }
    const slots = this.getSlots();
    for (let i = 0; i < slots.length; i++) {
      let outer = char.getOuterWearable(slots[i]);
      if (outer && outer !== this && (outer.wear_layer >= this.wear_layer || outer.wear_layer === 0)) {
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
    if (!char.canManipulate(this, "wear")) { return false; }
    msg(prefix(this, isMultiple) + this.wearMsg(char, this), {garment:this, actor:char});
    this.worn = true;
    if (this.afterWear) this.afterWear(char);
    return true;
  };
  res.wearMsg = WEAR_SUCCESSFUL;

  // Assumes the item is already held  
  res.remove = function(isMultiple, char) {
    if (!this.canWearRemove(char, false)) { return false; }
    if (!char.canManipulate(this, "remove")) { return false; }
    msg(prefix(this, isMultiple) + this.removeMsg(char, this), {garment:this, actor:char});
    this.worn = false;
    if (this.afterRemove) this.afterRemove(char);
    return true;
  };
  res.removeMsg = REMOVE_SUCCESSFUL;

  res.byname = function(options) {
    if (!options) options = {};
    let s = "";
    if (options.article === DEFINITE) {
      s = addDefiniteArticle(this);
    }
    if (options.article === INDEFINITE) {
      s = addIndefiniteArticle(this);
    }
    s += this.alias;
    if (options && options.possessive) s += "'s";
    if (this.worn && options.modified && (this.isAtLoc(game.player.name))) { s += " (worn)"; }
    if (options && options.capital) s = sentenceCase(s);
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
    if (!options) options = {}
    let s = "";
    if (options.article === DEFINITE) {
      s = addDefiniteArticle(this);
    }
    if (options.article === INDEFINITE) {
      s = addIndefiniteArticle(this);
    }
    s += this.alias;
    if (options && options.possessive) s += "'s";
    if (options.modified && res.volumeContained) { s += " (" + this.volumeContained + " " + VOLUME_UNITS + " " + res.containedLiquidName + ")"; }
    if (options && options.capital) s = sentenceCase(s);
    return s;
  };
  
  res.fill = function(isMultiple, char) {
    if (this.volumeContained >= this.capacity) {
      msg(prefix(this, isMultiple) + ALREADY(this));
      return false;
    }
    // check if liquid available
    msg(prefix(this, isMultiple) + FILL_SUCCESSFUL(char, this));
    return true;
  };

  res.empty = function(isMultiple, char) {
    if (this.volumeContained >= this.capacity) {
      msg(prefix(this, isMultiple) + ALREADY(this));
      return false;
    }
    // check if liquid available
    msg(prefix(this, isMultiple) + EMPTY_SUCCESSFUL(char, this));
    return true;
  };

  return res;
}

// If locs changes, that changes are not saved!!!
const LIQUID = function(locs) {
  const res = {};
  res.liquid = true;
  res.sourcedAtLoc = function(loc) { 
    if (typeof loc !== "string") loc = loc.name
    return this.locs.includes(loc);
  }
  res.isAtLoc = function(loc) { return false; }
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
    if (!options) options = {}
    let prefix = "";
    if (options.article === DEFINITE) {
      prefix = addDefiniteArticle(this);
    }
    if (options.article === INDEFINITE) {
      prefix = addIndefiniteArticle(this);
    }
    const contents = this.getContents(display.LOOK);
    let s = prefix + this.alias;
    if (options && options.possessive) s += "'s";
    if (contents.length > 0 && options.modified && (!this.closed || this.transparent)) {
      s += " (" + this.listContents(contents) + ")";
    }
    if (options && options.capital) s = sentenceCase(s);
    return s;
  };
  
  res.getContents = getContents;
  
  res.lookinside = function(isMultiple, char) {
    if (this.closed && !this.transparent) {
      msg(prefix(this, isMultiple) + NOTHING_INSIDE(char));
      return false;
    }
    msg(prefix(this, isMultiple) + LOOK_INSIDE(char, this));
    return true;
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
        this.openMsg(isMultiple, char);
        return true;
      }
      else {
        msg(prefix(this, isMultiple) + LOCKED(char, this));
        return false;
      }
    }
    this.closed = false;
    this.openMsg(isMultiple, char);
    return true;
  };
  
  res.openMsg = function(isMultiple, char) {
    msg(prefix(this, isMultiple) + OPEN_SUCCESSFUL(char, this));
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
    this.closeMsg(isMultiple, char);
    return true;
  };
  
  res.closeMsg = function(isMultiple, char) {
    msg(prefix(this, isMultiple) + CLOSE_SUCCESSFUL(char, this));
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
  res.getContents = getContents;
  res.listContents = contentsForSurface;
  res.canReachThrough = () => true;
  res.canSeeThrough = () => true;
  return res;
};


const OPENABLE = function(alreadyOpen) {
  const res = {};
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
    if (!options) options = {}
    let s = "";
    if (options.article === DEFINITE) {
      s = addDefiniteArticle(this);
    }
    if (options.article === INDEFINITE) {
      s = addIndefiniteArticle(this);
    }
    s += this.alias;
    if (options && options.possessive) s += "'s";
    if (!this.closed && options.modified) { s += " (open)"; }
    return s;
    if (options && options.capital) s = sentenceCase(s);
  };

  const c = CONTAINER();
  res.open = c.open;
  res.close = c.close;
  res.openMsg = c.openMsg;
  res.closeMsg = c.closeMsg;
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
        char.msg(ALREADY(char));
        return false;
      }
      if (char.posture) {
        char.msg(STOP_POSTURE(char));  // STOP_POSTURE handles details
        return true;
      }  
    },
  }
  res.assumePosture = function(isMultiple, char, posture, success_msg, adverb) {
    if (char.posture === posture && char.postureFurniture === this.name) {
      char.msg(ALREADY(char));
      return false;
    }
    if (!this.testForPosture(char, posture)) {
      return false;
    }
    if (char.posture) {
      char.msg(STOP_POSTURE(char))
    }
    char.posture = posture;
    char.postureFurniture = this.name;
    char.postureAdverb = adverb === undefined ? 'on' : adverb;
    char.msg(success_msg(char, this));
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
      char.msg(prefix(this, isMultiple) + ALREADY(this));
      return false;
    }
    if (!this.checkCanSwitchOn()) {
      return false;
    }
    char.msg(TURN_ON_SUCCESSFUL(char, this));
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
      char.msg(prefix(this, isMultiple) + ALREADY(this));
      return false;
    }
    char.msg(TURN_OFF_SUCCESSFUL(char, this));
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
    scenery:true,
    component:true,
    loc:nameOfWhole,
    takeable:true, // Set this as it has its own take attribute
    isAtLoc:function(loc, situation) {
      if (typeof loc !== "string") loc = loc.name
      if (situation !== display.PARSER) return false;
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
  w[nameOfWhole].componentHolder = true;
  return res;
};


const EDIBLE = function(isLiquid) {
  const res = $.extend({}, TAKEABLE_DICTIONARY);
  res.isLiquid = isLiquid;
  res.eat = function(isMultiple, char) {
    if (this.isLiquid) {
      msg(prefix(this, isMultiple) + CANNOT_EAT(char, this));
      return false;
    }
    msg(prefix(this, isMultiple) + EAT_SUCCESSFUL(char, this));
    this.loc = null;
    if (this.onIngesting) this.onIngesting(char);
    return true;
  };
  res.drink = function(isMultiple, char) {
    if (!this.isLiquid) {
      msg(prefix(this, isMultiple) + CANNOT_DRINK(char, this));
      return false;
    }
    msg(prefix(this, isMultiple) + DRINK_SUCCESSFUL(char, this));
    this.loc = null;
    if (this.onIngesting) this.onIngesting(char);
    return true;
  };
  res.ingest = function(isMultiple, char) {
    if (this.isLiquid) {
      return this.drink(isMultiple, char)
    }
    else {
      return this.eat(isMultiple, char)
    }
  };
  res.getVerbs = function() {
    const arr = [VERBS.examine];
    if (this.isAtLoc(game.player.name)) {
      return [VERBS.examine, VERBS.drop, this.isLiquid ? VERBS.drink : VERBS.eat];
    }
    else {
      return [VERBS.examine, VERBS.take];
    }
  };
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
      return this.getContents(display.LOOK).filter(function(el) {
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
    player:true,
    // The following are used also by NPCs, so we can use the same functions for both
    canReachThrough:() => true,
    canSeeThrough:() => true,
    getAgreement:() => true,
    getContents:getContents,
    pause:NULL_FUNC,  
    canManipulate:() => true,
    canMove:() => true,
    canTalk:() => true,
    canPosture:() => true,
    canTakeDrop:() => true,
    
    getHolding:function() {
      return this.getContents(display.LOOK).filter(function(el) { return !el.getWorn(); });
    },
    
    getWearing:function() {
      return this.getContents(display.LOOK).filter(function(el) { return el.getWorn() && !el.ensemble; });
    },
  
    getStatusDesc:function() {
      if (!this.posture) return false;
      return this.posture + " " + this.postureAdverb + " " + w[this.postureFurniture].byname({article:DEFINITE});
    },
    
    isAtLoc:function(loc, situation) {
      if (situation === display.LOOK) return false;
      if (situation === display.SIDE_PANE) return false;
      if (typeof loc !== "string") loc = loc.name
      return (this.loc === loc);
    },

    getOuterWearable:function(slot) {
      /*
      console.log("---------------------------")
      console.log(this.name);
      console.log(scope(isWornBy, {npc:this}));
      console.log(scope(isWornBy, {npc:this}).filter(el => el.getSlots().includes(slot)));
      */

      const clothing = this.getWearing().filter(function(el) {
        if (typeof el.getSlots !== "function") {
          console.log("Item with worn set to true, but no getSlots function");
          console.log(el);
        }
        return el.getSlots().includes(slot);
      });


      if (clothing.length === 0) { return false; }
      let outer = clothing[0];
      for (let i = 1; i < clothing.length; i++) {
        if (clothing[i].wear_layer > outer.wear_layer) {
          outer = clothing[i];
        }
      }
      return outer;
    },

    // Also used by NPCs, so has to allow for that
    msg:function(s, params) {
      msg(s, params);
    },
    byname:function(options) {
    //console.log("npc byname " + this.name)
      if (options === undefined) options = {};
      
      if (this.pronouns === PRONOUNS.firstperson || this.pronouns === PRONOUNS.secondperson) {
        let s = options && options.possessive ? this.pronouns.poss_adj : this.pronouns.subjective;
        if (options && options.capital) {
          s = sentenceCase(s);
        }
        return s        
      }

      if (options.group && this.followers.length > 0) {
        options.group = false;
        options.lastJoiner = LIST_AND;
        this.followers.unshift(this);
        const s = formatList(this.followers, options);
        this.followers.shift();
        if (options && options.possessive) s += "'s";
        if (options && options.capital) s = sentenceCase(s);
        return s;
      }
      
      let s = this.alias;
      if (options.article === DEFINITE) {
        s = addDefiniteArticle(this) + this.alias;
      }
      if (options.article === INDEFINITE) {
        s = addIndefiniteArticle(this) + this.alias;
      }
      
      const state = this.getStatusDesc();
      const held = this.getHolding();
      const worn = this.getWearingVisible();
      if (options.modified) {
        const list = [];
        if (state) {
          list.push(state);
        }
        if (held.length > 0) {
          list.push("holding " + formatList(held, {article:INDEFINITE, lastJoiner:LIST_AND, modified:false, nothing:LIST_NOTHING, loc:this.name, npc:true}));
        }
        if (worn.length > 0) {
          list.push("wearing " + formatList(worn, {article:INDEFINITE, lastJoiner:LIST_AND, modified:false, nothing:LIST_NOTHING, loc:this.name, npc:true}));
        }
        if (list.length > 0) s += " (" + formatList(list, {lastJoiner:";" + LIST_AND, sep:";"}) + ")";
      }
      
      if (options && options.possessive) {
        if (this.pronouns.possessive_name) {
          s = this.pronouns.possessive_name
        }
        else {
          s += "'s";
        }
      }
      if (options && options.capital) s = sentenceCase(s);
      return s;
    },
  

  }
  return res;
};


