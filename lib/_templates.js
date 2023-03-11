"use strict";

// Should all be language neutral




const TAKEABLE_DICTIONARY = {
  afterCreation:function(o) {
    o.verbFunctions.push(function(o, verbList) {
      verbList.push(o.isAtLoc(player.name) ? lang.verbs.drop : lang.verbs.take)
    })
  },

  takeable:true,
  msgDrop:lang.drop_successful,
  msgDropIn:lang.done_msg,
  msgTake:lang.take_successful,
  msgTakeOut:lang.done_msg,
  
  drop:function(options) {
    if (this.testDrop && !this.testDrop(options)) return false
    const dest = w[options.char.loc]
    if (dest.testDropIn && !dest.testDropIn(options)) return false

    msg(this.msgDrop, options);
    this.moveToFrom(options, "loc", "name")
    return true;
  },
  
  take:function(options) {
    const char = options.char
    if (this.isAtLoc(char.name)) return falsemsg(lang.already_have, options)
    if (!char.testManipulate(this, "take")) return false
    if (this.testTake && !this.testTake(options)) return false
    if (w[char.loc].testTakeOut && !w[char.loc].testTakeOut(options)) return false
    
    msg(this.msgTake, options)
    
    this.moveToFrom(options, "name", "loc")
    if (this.scenery) this.scenery = false
    return true
  },
  
  // This returns the location from which the item is to be taken
  // (and does not do taking from a location).
  // This can be useful for weird objects, such as ropes
  takeFromLoc:function(char) { return this.loc },

};


const TAKEABLE = () => TAKEABLE_DICTIONARY;



const SHIFTABLE = function() {
  const res = {
    shiftable:true,
  };
  return res;
}








const createEnsemble = function(name, ensembleMembers, dict) {
  const res = createItem(name, dict);
  res.ensemble = true;
  res.ensembleMembers = ensembleMembers;
  res.parserPriority = 30;
  res.inventorySkip = true;
  res.takeable = true;
  res.getWorn = function(situation) { return this.isAtLoc(this.ensembleMembers[0].loc, situation) && this.ensembleMembers[0].getWorn(); }

  res.nameModifierFunctions = [function(o, list) {
    if (o.ensembleMembers[0].getWorn() && o.isAllTogether() && o.ensembleMembers[0].isAtLoc(player.name)) list.push(lang.invModifiers.worn)
  }]
  

  // Tests if all parts are n the same location and either all are worn or none are worn
  // We can use this to determine if the set is together or not too
  res.isLocatedAt = function(loc, situation) {
    if (situation !== world.PARSER) return false;
    const worn = this.ensembleMembers[0].getWorn();
    for (let member of this.ensembleMembers) {
      if (member.loc !== loc) return false;
      if (member.getWorn() !== worn) return false;
    }
    return true;
  }

 
  // Tests if all parts are together
  res.isAllTogether = function() {
    const worn = this.ensembleMembers[0].getWorn();
    const loc = this.ensembleMembers[0].loc;
    for (let member of this.ensembleMembers) {
      if (member.loc !== loc) return false;
      if (member.breakEnsemble && member.breakEnsemble()) return false;
      if (member.getWorn() !== worn) return false;
    }
    return true;
  }
  
  res.msgDrop = lang.drop_successful
  res.msgTake = lang.take_successful
  
  res.drop = function(options) {
    const dest = w[options.char.loc]
    if (dest.testDrop && !dest.testDrop(options)) return false
    if (dest.testDropIn && !dest.testDropIn(options)) return false
    msg(this.msgDrop, options);
    for (let member of this.ensembleMembers) {
      member.moveToFrom(options, "loc")
    }
    return true;
  }
  
  res.take = function(options) {
    const char = options.char
    if (this.isAtLoc(char.name)) {
      msg(lang.already_have, options);
      return false;
    }

    if (!char.testManipulate(this, "take")) return false;
    if (this.testTake && !this.testTake(options)) return false
    if (w[char.loc].testTakeOut && !w[char.loc].testTakeOut(options)) return false
    msg(this.msgTake, options);
    for (let member of this.ensembleMembers) {
      member.moveToFrom(options, "name")
      if (member.scenery) member.scenery = false
    }
    return true;
  }

  for (let member of ensembleMembers) {
    member.ensembleMaster = res;
  }
  return res;
}


const MERCH = function(value, locs) {
  const res = {
    price:value,
    getPrice:function() { return this.price },
    msgPurchase:lang.purchase_successful,
    msgSell:lang.sell_successful,


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
    
    isLocatedAt:function(loc, situation) {
      if (this.salesLoc || this.salesLocs) {
        // In the shop for sale
        return (situation === world.PURCHASE || situation === world.PARSER) && this.isForSale(loc)
      }
      else {
        // Acting like a normal item
        return this.loc === loc
      }
    },

    isForSale:function(loc) {
      if (!this.salesLoc && !this.salesLocs) return false  // already sold
      if (this.doNotClone) return (this.salesLoc === loc)
      return (this.salesLocs.includes(loc))
    },
    
    canBeSoldHere:function(loc) {
      return w[loc].willBuy && w[loc].willBuy(this);
    },
    
    purchase:function(options) {
      if (this.testPurchase && !this.testPurchase(options)) return false
      if (!this.isForSale(options.char.loc)) {
        return failedmsg(this.doNotClone && this.isAtLoc(options.char.name) ? lang.cannot_purchase_again : lang.cannot_purchase_here, options)
      }
      
      const cost = this.getBuyingPrice(options.char);
      options.money = cost
      if (options.char.money < cost) return failedmsg(lang.cannot_afford, options);
      return this.purchaseScript(options, options.char, cost)
    },
    
    purchaseScript:function(options, char, cost) {
      char.money -= cost;
      msg(this.msgPurchase, options);
      if (this.doNotClone) {
        this.loc = char.name
        delete this.salesLoc
        if (this.afterPurchase) this.afterPurchase(options)
      }
      else {
        const o = cloneObject(this, char.name)
        o.loc = char.name
        delete o.salesLocs
        if (o.afterPurchase) o.afterPurchase(options)
      }
      return world.SUCCESS;
    },
    
    sell:function(options) {
      if (this.testSell && !this.testSell(options)) return false
      if (!this.canBeSoldHere(options.char.loc)) {
        return failedmsg(lang.cannot_sell_here, options);
      }
      const cost = this.getSellingPrice(options.char);
      options.money = cost
      options.char.money += cost;
      msg(this.msgSell, options);
      if (this.doNotClone) {
        this.salesLoc = options.char.loc
        delete this.loc
      }
      else {
        delete w[this.name]
      }
      if (this.afterSell) this.afterSell(options)
      return world.SUCCESS;
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
  const res = Object.assign({}, TAKEABLE_DICTIONARY)
  res.countable = true
  res.countableLocs = countableLocs ? countableLocs : {}
  res.multiLoc = true
  res.defaultToAll = true
  
  res.isUltimatelyHeldBy = function(obj) {
    const locs = []
    for (const key in this.countableLocs) {
      if (this.countableLocs[key]) locs.push(key)
    }
    return util.multiIsUltimatelyHeldBy(obj, locs) 
  }

  res.extractNumber = function() {
    const md = /^(\d+)/.exec(this.cmdMatch)
    if (!md) { return false;}
    return parseInt(md[1])
  }
  
  res.beforeSaveForTemplate = function() {
    const l = []
    for (let key in this.countableLocs) {
      l.push(key + "=" + this.countableLocs[key])
    }
    this.customSaveCountableLocs = l.join(",")
    this.beforeSave()
  }

  res.afterLoadForTemplate = function() {
    const l = this.customSaveCountableLocs.split(",")
    this.countableLocs = {}
    for (let el of l) {
      const parts = el.split("=")
      this.countableLocs[parts[0]] = parseInt(parts[1])
    }
    this.customSaveCountableLocs = false
    this.afterLoad()
  };

  res.getListAlias = function(loc) {
    return sentenceCase(this.pluralAlias) + " (" + this.countAtLoc(loc) + ")";
  };
  
  res.isLocatedAt = function(loc, situation) {
    if (!this.countableLocs[loc]) { return false; }
    return (this.countableLocs[loc] > 0 || this.countableLocs[loc] === 'infinity');
  };

  res.countAtLoc = function(loc) {
    if (typeof loc !== 'string') loc = loc.name
    if (!this.countableLocs[loc]) { return 0; }
    return this.countableLocs[loc];
  };
  
  res.moveToFrom = function(options, toLoc, fromLoc) {
    util.setToFrom(options, toLoc, fromLoc)
    let count = options.count ? options.count : this.extractNumber()
    if (!count) count = options.fromLoc === player.name ? 1 : this.countAtLoc(options.fromLoc)
    if (count === 'infinity') count = 1
    this.takeFrom(options.fromLoc, count)
    this.giveTo(options.toLoc, count)
  };
  
  res.takeFrom = function(loc, count) {
    if (this.countableLocs[loc] !== 'infinity') this.countableLocs[loc] -= count
    if (this.countableLocs[loc] <= 0) this.countableLocs[loc] = false
    w[loc].afterDropIn(player, {item:this, count:count})
  };
  
  res.giveTo = function(loc, count) {
    if (!this.countableLocs[loc]) { this.countableLocs[loc] = 0; }
    if (this.countableLocs[loc] !== 'infinity') this.countableLocs[loc] += count;
    w[loc].afterDropIn(player, {item:this, count:count});
  };
  
  res.findSource = function(sourceLoc, tryContainers) {
    // some at the specific location, so use them
    if (this.isAtLoc(sourceLoc)) {
      return sourceLoc;
    }

    if (tryContainers) {
      const containers = scopeReachable().filter(el => el.container);
      for (let container of containers) {
        if (container.closed) continue;
        if (this.isAtLoc(container.name)) return container.name;
      }
    }

    return false;
  }


  res.getTakeDropCount = function(options, loc) {
    options.excess = false // do this here to ensure it is resrt
    let n = this.extractNumber()
    let m = this.countAtLoc(loc)
    if (!n) {  // no number specified
      if (m === 'infinity') {
        n = 1
      }
      else if (this.defaultToAll) {
        n = m
      }
      else {
        n = 1
      }
    }
    if (n > m) {  // too big number specified
      n = m
      options.excess = true
    }
    options.count = n
  }

  // As this is flagged as multiLoc, need to take special care about where the thing is
  res.take = function(options) {
    const sourceLoc = this.findSource(options.char.loc, true);
    if (!sourceLoc) return falsemsg(lang.none_here, options)
    this.getTakeDropCount(options, sourceLoc)
    
    if (this.testTake && !this.testTake(options)) return false
    if (w[sourceLoc].testTakeOut && !w[sourceLoc].testTakeOut(options)) return false
    
    msg(this.msgTake, options)
    this.takeFrom(sourceLoc, options.count)
    this.giveTo(options.char.name, options.count)
    if (this.scenery) this.scenery = false
    return true
  }

  res.drop = function(options) {
    if (this.countAtLoc(options.char.name) === 0) return falsemsg(lang.none_held, options)
    const dest = w[options.char.loc]
    options.destination = dest
    this.getTakeDropCount(options, options.char.name)

    if (this.testDrop && !this.testDrop(options)) return false
    if (dest.testDropIn && !dest.testDropIn(options)) return false
    
    msg(this.msgDrop, options);
    this.takeFrom(options.char.name, options.count);
    this.giveTo(options.char.loc, options.count);
    return true;
  };

  res.afterCreation = function(o) {
    if (!o.regex) o.regex = new RegExp("^(\\d+ )?" + o.name + "s?$")
  }


  return res;
};



const WEARABLE = function(wear_layer, slots) {
  const res = Object.assign({}, TAKEABLE_DICTIONARY)
  res.wearable = true
  res.armour = 0
  res.wear_layer = wear_layer ? wear_layer : false
  res.slots = slots && wear_layer ? slots: []
  res.worn = false
  res.useDefaultsTo = function(char) {
    return char === player ? 'Wear' : 'NpcWear'
  }
  
  res.getSlots = function() { return this.slots }
  res.getWorn = function() { return this.worn }
  res.getArmour = function() { return this.armour }
  res.msgWear = lang.wear_successful
  res.msgRemove = lang.remove_successful
  
  res.afterCreation = function(o) {
    o.verbFunctions.push(function(o, verbList) {
      if (!o.isAtLoc(player.name)) {
        verbList.push(lang.verbs.take)
      }
      else if (o.getWorn()) {
        if (!o.getWearRemoveBlocker(player, false)) verbList.push(lang.verbs.remove)
      }
      else {
        verbList.push(lang.verbs.drop)
        if (!o.getWearRemoveBlocker(player, true)) verbList.push(lang.verbs.wear)
      }
    })

    o.nameModifierFunctions.push(function(o, list) {
      if (o.worn && o.isAtLoc(player.name)) list.push(lang.invModifiers.worn)
    })
  }

  res.icon = () => 'garment12'
  
  res.getWearRemoveBlocker = function(char, toWear) {
    if (!this.wear_layer) return false
    const slots = this.getSlots()
    for (let slot of slots) {
      let outer = char.getOuterWearable(slot)
      if (outer && outer !== this && (outer.wear_layer >= this.wear_layer || outer.wear_layer === 0)) {
        return outer
      }
    }
    return false
  }
  
  res.testWear = function() { return true }
  res.testRemove = function() { return true }
  
  res._canWearRemove = function(toWear, options) {
    if (toWear) {
      if (!this.testWear(options)) return false
    }
    else {
      if (!this.testRemove(options)) return false
    }
    const outer = this.getWearRemoveBlocker(options.char, toWear)
    if (outer) {
      options.outer = outer
      return falsemsg(toWear ? lang.cannot_wear_over : lang.cannot_remove_under, options)
    }
    return true;
  };
  
  // Assumes the item is already held  
  res.wear = function(options) {
    if (!this._canWearRemove(true, options)) return false
    if (!options.char.testManipulate(this, "wear")) return false
    msg(this.msgWear, options)
    this.worn = true
    if (this.afterWear) this.afterWear(options)
    return true
  };

  // Assumes the item is already held  
  res.remove = function(options) {
    if (!this._canWearRemove(false, options)) return false
    if (!options.char.testManipulate(this, "remove")) return false
    msg(this.msgRemove, options);
    this.worn = false;
    if (this.afterRemove) this.afterRemove(options);
    return true;
  };


  return res;
};



const OPENABLE_DICTIONARY = {
  msgClose:lang.close_successful,
  msgOpen:lang.open_successful,
  msgLock:lang.lock_successful,
  msgUnlock:lang.unlock_successful,
  msgCloseAndLock:lang.close_and_lock_successful,
  openMsg:function(options) { msg(this.msgOpen, options) },
  open:function(options) {
    options.container = this
    if (!this.openable) {
      msg(lang.cannot_open, {item:this});
      return false;
    }
    else if (!this.closed) {
      msg(lang.already, {item:this});
      return false;
    }
    else if (this.testOpen && !this.testOpen(options)) {
      return false
    }
    if (this.locked) {
      if (this.testKeys(options.char)) {
        this.locked = false
        this.closed = false
        msg(this.msgUnlock, options)
        this.openMsg(options)
        return true
      }
      else {
        msg(lang.locked, options)
        return false;
      }
    }
    this.closed = false;
    this.openMsg(options)
    if (this.afterOpen) this.afterOpen(options)
    return true;
  },
  
  close:function(options) {
    options.container = this
    if (!this.openable) {
      msg(lang.cannot_close, {item:this});
      return false;
    }
    else if (this.closed) {
      msg(lang.already, {item:this});
      return false;
    }
    else if (this.testClose && !this.testClose(options)) {
      return false
    }
    this.closed = true;
    msg(this.msgClose, options)
    if (this.afterClose) this.afterClose(options)
    return true;
  },
  
  
}

const CONTAINER = function(openable) {
  const res = Object.assign({}, OPENABLE_DICTIONARY);
  res.container = true
  
  res.closed = openable;
  res.openable = openable
  res.contentsType = "container"
  res.getContents = util.getContents
  res.testForRecursion = util.testForRecursion
  res.listContents = util.listContents
  res.transparent = false
  
  res.afterCreation = function(o) {
    o.verbFunctions.push(function(o, verbList) {
      if (o.openable) {
        verbList.push(o.closed ? lang.verbs.open : lang.verbs.close);
      }
    })
    o.nameModifierFunctions.push(util.nameModifierFunctionForContainer) 
  },

  res.lookinside = function(options) {
    options.container = this
    if (this.closed && !this.transparent) {
      msg(lang.not_open, options);
      return false;
    }
    options.list = this.listContents(world.LOOK, true)
    msg(lang.look_inside, options);
    return true;
  };
  
  res.openMsg = function(options) {
    options.list = this.listContents(world.LOOK)
    msg(this.msgOpen + " " + (options.list === lang.list_nothing ? lang.it_is_empty : lang.look_inside_it), options)
  };
  
  res.icon = function() {
    return this.closed ? 'closed12' : 'opened12'
  };
  
  res.canReachThroughThis = function() { return !this.closed };
  res.canSeeThroughThis = function() { return !this.closed || this.transparent };

  return res;
};



const SURFACE = function() {
  const res = {}
  res.container = true
  res.getContents = util.getContents
  res.testForRecursion = util.testForRecursion
  res.listContents = util.listContents
  res.afterCreation = function(o) { o.nameModifierFunctions.push(util.nameModifierFunctionForContainer) }
  res.closed = false;
  res.openable = false;
  res.contentsType = "surface",
  res.canReachThroughThis = () => true;
  res.canSeeThroughThis = () => true;
  return res;
};



const OPENABLE = function(alreadyOpen) {
  const res = Object.assign({}, OPENABLE_DICTIONARY);
  res.closed = !alreadyOpen;
  res.openable = true;
  
  res.afterCreation = function(o) {
    o.verbFunctions.push(function(o, verbList) {
      verbList.push(o.closed ? lang.verbs.open : lang.verbs.close);
    })
    o.nameModifierFunctions.push(function(o, list) {
      if (!o.closed) list.push(lang.invModifiers.open)
    })
  }

  return res
}



const LOCKED_WITH = function(keyNames) {
  if (typeof keyNames === "string") { keyNames = [keyNames]; }
  if (keyNames === undefined) { keyNames = []; }
  const res = {
    keyNames:keyNames,
    locked:true,
    lockwith:function(options) { this.lock(options) },
    unlockwith:function(options) { this.unlock(options) },
    
    lock:function(options) {
      options.container = this
      if (this.locked) return falsemsg(lang.already, options)
      if (!this.testKeys(options.char, true)) return falsemsg(lang.no_key, options)

      if (!this.closed) {
        this.closed = true
        this.locked = true
        msg(this.msgCloseAndLock, options)
      }
      else {
        this.locked = true
        msg(this.msgLock, options)
      }
      if (this.afterLock) this.afterLock(options)
      return true
    },
    
    unlock:function(options) {
      options.container = this
      if (!this.locked) return falsemsg(lang.already, {item:this})
      if (options.secondItem) {
        if (!this.keyNames.includes(options.secondItem.name)) return falsemsg(lang.cannot_unlock_with, options)
      }
      else {
        if (!this.testKeys(options.char, false)) return falsemsg(lang.no_key, options)
      }
      msg(this.msgUnlock, options)
      this.locked = false
      if (this.afterUnlock) this.afterUnlock(options)
      return true
    },
    
    testKeys:function(char, toLock) {

      for (let s of this.keyNames) {
        if (!w[s]) return errormsg("The key name for this container, `" + s + "`, does not match any key in the game.")
        if (w[s].isAtLoc(char.name)) return true
      }
      return false;
    }
  }
  return res
}



const LOCKED_DOOR = function(key, loc1, loc2, name1, name2) {
  const res = Object.assign({}, OPENABLE(false), LOCKED_WITH(key))
  res.loc1 = loc1
  res.loc2 = loc2
  res.name1 = name1
  res.name2 = name2
  res.scenery = true

  res.afterCreation = function(item) {
    const room1 = w[item.loc1]
    if (!room1) return errormsg("Bad location name '" + item.loc1 + "' for door " + item.name)
      
    const exit1 = room1.findExit(item.loc2)
    if (!exit1) return errormsg("No exit to '" + item.loc2 + "' for door " + item.name)
    item.dir1 = exit1.dir
    if (!room1[item.dir1]) return errormsg("Bad exit '" + item.dir1 + "' in location '" + room1.name + "' for door: " + item.name + " (possibly because the room is defined after the door?)")

    const room2 = w[item.loc2]
    if (!room2) return errormsg("Bad location name '" + item.loc2 + "' for door " + item.name)
    const exit2 = room2.findExit(item.loc1)
    if (!exit2) return errormsg("No exit to '" + item.loc1 + "' for door " + item.name)
    item.dir2 = exit2.dir
    if (!room2[item.dir2]) return errormsg("Bad exit '" + item.dir2 + "' in location '" + room2.name + "' for door: " + item.name + " (possibly because the room is defined after the door?)")

    room1[item.dir1].use = util.useWithDoor
    room1[item.dir1].door = item.name
    room1[item.dir1].doorName = item.name1 || 'door to ' + lang.getName(w[item.loc2], {article:DEFINITE})

    room2[item.dir2].use = util.useWithDoor
    room2[item.dir2].door = item.name
    room2[item.dir2].doorName = item.name2 || 'door to ' + lang.getName(w[item.loc1], {article:DEFINITE})
  }
  
  res.isLocatedAt = function(loc) { return (loc == this.loc1 || loc == this.loc2) }

  res.icon = () => 'door12'

  return res;
}  



const KEY = function() {
  const res = Object.assign({}, TAKEABLE_DICTIONARY)
  res.key = true
  res.icon = () => 'key12'
  return res;
}  

const READABLE = function(mustBeHeld) {
  const res = {}
  res.readable = true
  res.mustBeHeld = mustBeHeld
  res.icon = () => 'readable12'
  res.afterCreation = function(o) {
    o.verbFunctions.push(function(o, verbList) {
      if (o.loc === player.name || !o.mustBeHeld) verbList.push(lang.verbs.read)
    })
  }
  return res;
}  




const BACKSCENE = function() {
  return {
    scenery:true,
    parserPriority:-15,
    isLocatedAt:function(loc, situation) {
      if (!w[loc].room) return false
      const locationType = w[loc].locationType || w[loc]._region
      if (!locationType) return false
      if (w[loc + '_' + this.name]) return false
      if (regions[locationType][this.name]) return true
      return false
    },
    examine_for_backscene:function() {
      if (!currentLocation) return
     
      const locationType = currentLocation.locationType || currentLocation._region
      const addendum = currentLocation['addendum_examine_' + this.name] ? ' ' + currentLocation['addendum_examine_' + this.name] : ''

      if (typeof currentLocation['examine_' + this.name] === 'function') {
        currentLocation['examine_' + this.name](addendum)
      }
      else if (typeof currentLocation['examine_' + this.name] === 'string') {
        msg(currentLocation['examine_' + this.name] + addendum)
      }
      else if (currentLocation._region && regions[currentLocation._region][this.name]) {
        msg(regions[currentLocation._region][this.name] + addendum)
      }
      else if (this.defaultExamine) {
        msg(this.defaultExamine + addendum)
      }
      else {
        msg(lang.default_scenery)
      }
    },
    afterCreation:function(o) {
      o.defaultExamine = o.examine
      o.examine = o.examine_for_backscene
    },
  }  
}




const FURNITURE = function(options) {
  if (options === undefined) return errormsg("No options for FURNITURE template. Look in the stack traces below for a reference to a file you are using to create objects, and see what the line number is.")
  const res = {
    testPostureOn:() => true,
    getoff:function(options) {
      if (!options.char.posture) {
        options.char.msg(lang.already, options);
        return false;
      }
      if (options.char.posture) {
        options.char.msg(lang.stop_posture(options.char));  // stop_posture handles details
        return true;
      }  
    },
  }
  res.useDefaultsTo = function(char) {
    const cmd = this.useCmd ? this.useCmd : (this.reclineon ? 'ReclineOn' : (this.siton ? 'SitOn' : 'StandOn'))
    return char === player ? cmd : 'Npc' + cmd
  }

  res.afterCreation = function(o) {
    o.verbFunctions.push(function(o, verbList) {
      if (player.posture && player.postureFurniture === o.name) {
        verbList.push(lang.verbs.getOff)
        return
      }
      if (player.posture && player.posture !== 'standing') return
      if (o.siton) verbList.push(lang.verbs.sitOn)
      if (o.standon) verbList.push(lang.verbs.standOn)
      if (o.reclineon) verbList.push(lang.verbs.reclineOn)
    })
  }

  res.assumePosture = function(options, posture, name, adverb) {
    options.posture = posture
    const char = options.char
    if (char.posture === posture && char.postureFurniture === this.name) {
      char.msg(lang.already, {item:char})
      return false
    }
    if (!this.testPostureOn({char:char, posture:posture})) return false
    if (char.posture && char.postureFurniture !== this.name) {
      char.msg(stop_posture(char))
      char.msg(lang[name + '_on_successful'], options)
    }
    else if (char.posture && this[char.posture + "_to_" + posture] && this.postureChangesImplemented) {
      char.msg(this[char.posture + "_to_" + posture], options)
    }
    else {
      char.msg(lang[name + '_on_successful'], options)
    }
    char.posture = posture
    char.postureFurniture = this.name
    char.postureAdverb = adverb === undefined ? 'on' : adverb;
    if (this.afterPostureOn) this.afterPostureOn(options)
    return true
  }

  if (options.sit) {
    res.siton = function(options) {
      return this.assumePosture(options, "sitting", 'sit')
    }
  }
  if (options.stand) {
    res.standon = function(options) {
      return this.assumePosture(options, "standing", 'stand')
    }
  }
  if (options.recline) {
    res.reclineon = function(options) {
      return this.assumePosture(options, "reclining", 'recline')
    }
  }
  if (options.useCmd) {
    res.useCmd = options.useCmd
  }
  res.icon = () => 'furniture12'
  return res;
}



const SWITCHABLE = function(alreadyOn, nameModifier) {
  const res = {}
  res.switchedon = alreadyOn
  res.nameModifier = nameModifier
  res.msgSwitchOff = lang.switch_off_successful
  res.msgSwitchOn = lang.switch_on_successful
  
  res.afterCreation = function(o) {
    o.verbFunctions.push(function(o, verbList) {
      if (!o.mustBeHeldToOperate || o.isAtLoc(player)) {
        verbList.push(o.switchedon ? lang.verbs.switchoff : lang.verbs.switchon)
      }
    })
    o.nameModifierFunctions.push(function(o, list) {
      if (o.nameModifier && o.switchedon) list.push(o.nameModifier)
    })
  }

  res.switchon = function(options) {
    if (this.switchedon) {
      options.char.msg(lang.already, {item:this});
      return false;
    }
    if (!this.testSwitchOn(options)) return false
    if (!options.char.getAgreement("SwitchOn", {item:this, switchOn:true})) return false
    
    if (!this.suppressMsgs) options.char.msg(this.msgSwitchOn, options);
    this.doSwitchon(options);
    return true;
  };
  
  res.doSwitchon = function(options) {
    let lighting = game.dark;
    this.switchedon = true;
    world.update();
    if (lighting !== game.dark) {
      currentLocation.description();
    }
    if (this.afterSwitchOn) this.afterSwitchOn(options)
  };
  
  res.testSwitchOn = () => true;
  res.testSwitchOff = () => true;
  
  res.switchoff = function(options) {
    if (!this.switchedon) {
      options.char.msg(lang.already, {item:this});
      return false;
    }
    if (!this.testSwitchOff(options)) return false
    if (!options.char.getAgreement("SwitchOn", {item:this})) return false

    if (!this.suppressMsgs) options.char.msg(this.msgSwitchOff, options);
    this.doSwitchoff(options);
    return true;
  };
  
  res.doSwitchoff = function(options) {
    let lighting = game.dark;
    this.switchedon = false;
    world.update();
    if (lighting !== game.dark) {
      currentLocation.description();
    }
    if (this.afterSwitchOff) this.afterSwitchOff(options)
  };

  res.icon = function() {
    return this.switchedon ? 'turnedon12' : 'turnedoff12'
  }

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
    isLocatedAt:function(loc, situation) {
      if (situation !== world.PARSER && situation !== world.ALL) return false;
      let cont = w[this.loc];
      return cont.isAtLoc(loc);
    },
    take:function(options) {
      options.whole = w[this.loc]
      msg(lang.cannot_take_component, options);
      return false;
    },
  };
  if (!w[nameOfWhole]) debugmsg("Whole is not define: " + nameOfWhole);
  w[nameOfWhole].componentHolder = true;
  return res;
};


const EDIBLE = function(isLiquid) {
  const res = Object.assign({}, TAKEABLE_DICTIONARY);
  res.isLiquid = isLiquid
  res.msgIngest = isLiquid ? lang.drink_successful : lang.eat_successful
  res.eat = function(options) {
    if (this.isLiquid) {
      msg(lang.cannot_eat, options);
      return false;
    }
    msg(this.msgIngest, options);
    this.loc = null;
    if (this.afterIngest) this.afterIngest(options);
    return true;
  };
  res.drink = function(options) {
    if (!this.isLiquid) {
      msg(lang.cannot_drink, options);
      return false;
    }
    msg(this.msgIngest, options);
    this.loc = null;
    if (this.afterIngest) this.afterIngest(options);
    return true;
  };
  res.ingest = function(options) {
    if (this.isLiquid) {
      return this.drink(options)
    }
    else {
      return this.eat(options)
    }
  }
  res.icon = () => 'edible12'
  res.afterCreation = function(o) {
    o.verbFunctions.push(function(o, verbList) {
      verbList.push(o.isAtLoc(player.name) ? lang.verbs.drop : lang.verbs.take)
      if (o.isAtLoc(player)) verbList.push(o.isLiquid ? lang.verbs.drink : lang.verbs.eat)
    })
  }
  return res;
};


const VESSEL = function() {
  const res = {}
  res.vessel = true

  res.afterCreation = function(o) {
    if (o.volumeContained) {
      list.push("full of " + o.containedFluidName)
    }
  },
  
  res.findSource = function(options) { return util.findSource(options) },
  
  res.fill = function(options) {
    if (!this.findSource(options)) return falsemsg(lang.no_generic_fluid_here, {item:this})
    return this.doFill(options)
  },
  
  res.doFill = function(options) {
    options.item = this
    if (this.testFill && !this.testFill(options)) return false
    if (this.containedFluidName) return falsemsg(lang.already_full, options)
    
    this.containedFluidName = options.fluid
    if (options.source.vessel) delete options.source.containedFluidName

    msg(lang.fill_successful, options)
    if (this.afterFill) this.afterFill(options)
    return true
  }

  res.empty = function(options) {
    delete options.item
    return this.doEmpty(options)
  }

  res.doEmpty = function(options) {
    options.source = this
    options.fluid = this.containedFluidName

    if (!this.containedFluidName) return falsemsg(lang.already_empty, options)
    if (this.testEmpty && !this.testEmpty(options)) return false

    if (!options.item) {
      msg(lang.empty_successful, options)
      delete this.containedFluidName
    }
    else if (options.item === options.source) {
      return falsemsg(lang.pour_into_self, options)
    }
    else if (options.item.vessel) {
      if (options.item.containedFluidName) return falsemsg(lang.already_full, {char:options.char, item:options.sink, fluid:options.item.containedFluidName})
      msg(lang.empty_into_successful, options)
      options.item.containedFluidName = this.containedFluidName
      delete this.containedFluidName
    }
    else if (options.item.sink) {
      if (!options.item.sink(this.containedFluidName, options.char, this)) return false
    }
    else {
      msg(lang.empty_onto_successful, options)
      delete this.containedFluidName
    }
    if (this.afterEmpty) this.afterEmpty(options.char, {fluid:this.containedFluidName, sink:options.item})
    delete this.containedFluidName
    return true
  }

  res.handleInOutContainer = function(options, items) {
    let success = false;
    for (const obj of items) {
      if (!options.char.testManipulate(obj, options.verb)) return world.FAILED
      options.count = obj.countable ? obj.extractNumber() : undefined
      options.item = obj
      if (options.count) options[obj.name + '_count'] = options.count  // for the text processor
      let flag
      if (this.container) {
        success = success || func(char, container, obj, options)
      }
      /*else if (obj.representsFluid) {
        flag = this.doFill({char:options.char, fluid:obj.representsFluid})
        success = success || flag
      }*/
      else {
        msg(lang.not_container_not_vessel, options)
      }
    }
    if (success) options.char.pause();
    return success ? world.SUCCESS : world.FAILED;
  },

  res.afterCreation = function(o) {
    o.verbFunctions.push(function(o, verbList) {
      if (!o.isAtLoc(player.name)) return
      verbList.push(o.containedFluidName ? lang.verbs.empty : lang.verbs.fill)
    })
  }
  return res;
}


const CONSTRUCTION = function(componentNames) {
  const res = {}
  res.construction = true
  res.componentNames = componentNames ? componentNames : []
  res.destroyComponentsOnBuild = true
  res.msgConstruction = lang.construction_done
  
  res.testComponents = function(components, options) {
    for (const el of components) {
      if (!res.componentNames.includes(el.name)) {
        options.wrong = el
        return falsemsg(lang.component_wrong, options)
      }
    }
    return true
  }
  
  res.buildPrecheck = function(options) {
    if (this.loc) return falsemsg(lang.construction_already, options)
    for (const el of options.components) {
      if (el.loc !== player.name) {
        options.missing = el
        return falsemsg(lang.component_missing, options)
      }
    }
    return true
  }

  res.build = function(options) {
    const components = this.componentNames.map(el => w[el])
    options.components = components
    if (!this.buildPrecheck(options)) return false
    if (this.testConstruction && !this.testConstruction(options)) return false
    
    if (this.destroyComponentsOnBuild) {
      for (const el of components) delete el.loc
    }
    this.loc = this.buildAtLocation ? player.loc : player.name
    options.list = formatList(components, {article:DEFINITE, lastSep:'and'})
    msg(this.msgConstruction, options)
    if (this.afterConstruction) this.afterConstruction(options)
    return true
  }
  
  return res
}



const ROPE = function(length, tetheredTo) {
  const res = Object.assign({
    rope:true,
    ropeLength:length,
    tethered:(tetheredTo !== undefined),
    tiedTo1:tetheredTo,
    locs:tetheredTo ? [w[w[tetheredTo].loc]] : [],
    attachVerb:lang.rope_attach_verb,
    attachedVerb:lang.rope_attached_verb,
    detachVerb:lang.rope_detach_verb,
    msgDetach:lang.rope_detach_success,
    msgAttach:lang.rope_attach_success,
    msgWind:lang.rope_wind,
    msgUnwind:lang.rope_unwind,
    isLocatedAt:function(loc, situation) {
      if (this.loc) {
        this.locs = [this.loc]
        this.loc = false
      }
      if (typeof loc !== "string") loc = loc.name
      // If the rope is in the location and held by the character, only want it to appear once in the side pane
      if (situation === world.SIDE_PANE && this.locs.includes(player.name) && loc !== player.name) return false
      return this.locs.includes(loc) 
    },
    isUltimatelyHeldBy:function(obj) { return util.multiIsUltimatelyHeldBy(obj, this.locs) },
    isAttachedTo:function(item) {
      return this.tiedTo1 === item.name || this.tiedTo2 === item.name
    },
    getAttached:function() {
      let res = this.tiedTo1 ? [this.tiedTo1] : []
      if (this.tiedTo2) res.push(this.tiedTo2)
      return res
    },
    examineAddendum:function() {
      // It is tied to the chair, and trails into the kitchen.
      
      // What is it tied to (and we can see)
      const obj1 = (this.tiedTo1 && w[this.tiedTo1].isHere()) ? w[this.tiedTo1] : false
      const obj2 = (this.tiedTo2 && w[this.tiedTo2].isHere()) ? w[this.tiedTo2] : false

      // Handle the easy cases, only one loc in locs
      if (this.locs.length === 1) {
        if (obj1 && obj2) return processText(lang.examineAddBothEnds, {item:this, obj1:obj1, obj2:obj2})
        if (obj1) return processText(lang.rope_examine_attached_one_end, {item:this, obj1:obj1})
        if (obj2) return processText(lang.rope_examine_attached_one_end, {item:this, obj1:obj2})
        return ''  // just in one place, like any ordinary object
      }

      // Who is it held by (and we can see)
      const end1 = w[this.locs[0]]
      const holder1 = (end1.npc || end1.player) && end1.isHere() ? end1 : false
      const end2 = w[this.locs[this.locs.length - 1]]
      const holder2 = (end2.npc || end2.player) && end2.isHere() ? end2 : false
      
      // What locations does it go to
      const index = this.locs.findIndex(el => el === player.loc)
      const loc1 = (index > 0 && w[this.locs[index - 1]].room) ? w[this.locs[index - 1]] : false
      const loc2 = (index < (this.locs.length - 1) && w[this.locs[index + 1]].room) ? w[this.locs[index + 1]] : false
      
      let s = ''
      let flag = false
      if (obj1 || holder1 || loc1) {
        s += ' ' + lang.rope_one_end + ' '
        flag = true
      }
      if (obj1) {
        s += lang.rope_examine_end_attached.replace('obj', 'obj1')
      }
      else if (holder1) {
        s += lang.rope_examine_end_held.replace('holder', 'holder1')
      }
      else if (loc1) {
        s += lang.rope_examine_end_headed.replace('loc', 'loc1')
      }
      
      if (obj2 || holder2 || loc2) {
        s += ' ' + (flag ? lang.rope_other_end : lang.rope_one_end) + ' '
        flag = true
      }
      if (obj2) {
        s += lang.rope_examine_end_attached.replace('obj', 'obj2')
      }
      else if (holder2) {
        s += lang.rope_examine_end_held.replace('holder', 'holder2')
      }
      else if (loc2) {
        s += lang.rope_examine_end_headed.replace('loc', 'loc2')
      }
      
      return processText(s, {item:this, obj1:obj1, obj2:obj2, holder1:holder1, holder2:holder2, loc1:loc1, loc2:loc2})
    },
    canAttachTo:function(item) {
      return item.attachable
    },
    handleTieTo:function(char, obj) {
      if (obj === undefined) obj = this.findAttachable(this)
      const options = {char:char, item:this, obj:obj}

      if (obj === undefined) return falsemsg(lang.rope_no_attachable_here, options)
      if (!obj.attachable) return failedmsg(lang.rope_not_attachable_to, options)
      
      if (this.tiedTo1 === obj.name) return failedmsg(lang.already, {item:this})
      if (this.tiedTo2 === obj.name) return failedmsg(lang.already, {item:this})
      if (this.tiedTo1 && this.tiedTo) return failedmsg(lang.rope_tied_both_ends_already, {item:this, obj1:w[this.tiedTo1], obj2:w[this.tiedTo2]})

      if (obj.testAttach && !obj.testAttach(options)) return world.FAILED
      this.attachTo(char, obj)
      if (!this.suppessMsgs) msg(this.msgAttach, options)
      return world.SUCCESS
    },
    handleUntieFrom:function(char, obj) {
      const tpParams = {char:char, item:this, obj:obj}
      if (obj === undefined) {
        // obj not set; can we guess it?
        if (!this.tiedTo1 && !this.tiedTo2) return failedmsg(lang.rope_not_attached, tpParams)
        if (this.tiedTo1 && !this.tiedTo2) {
          obj = w[this.tiedTo1]
        }
        else if (!this.tiedTo1 && this.tiedTo2) {
          obj = w[this.tiedTo2]
        } 
        else if (w[this.tiedTo1].isHere() && !w[this.tiedTo2].isHere()) {
          obj = w[this.tiedTo1]
        } 
        else if (!w[this.tiedTo1].isHere() && w[this.tiedTo2].isHere()) {
          obj = w[this.tiedTo2]
        } 
        else {
          return failedmsg(lang.rope_detach_end_ambig, tpParams)
        }
        tpParams.obj = obj
      }
      else {
        if (this.tiedTo1 !== obj.name && this.tiedTo2 !== obj.name) {
          return failedmsg(lang.rope_not_attached_to, tpParams)
        }
      }
      if (obj === this.tiedTo1 && this.tethered) return failedmsg(lang.rope_tethered, tpParams)

      this.detachFrom(char, obj)
      if (!this.suppessMsgs) msg(this.msgDetach, tpParams)
      return world.SUCCESS
    },
    useWith:function(char, item) {
      return this.handleTieTo(char, item) === world.SUCCESS
    },
    attachTo:function(char, item) {
      const loc = item.loc // may want to go deep in case tied to a component of an item !!!
      if (!this.tiedTo1) {
        if (this.locs.length > 1) this.locs.shift()
        if (this.locs[0] !== loc) this.locs.unshift(loc)
        this.tiedTo1 = item.name
      }
      else {
        if (this.locs.length > 1) this.locs.pop()
        if (this.locs[this.locs.length - 1] !== loc) this.locs.push(loc)
        this.tiedTo2 = item.name
      }
      if (this.afterAttach) this.afterAttach(char, {item:item})
    },
    detachFrom:function(char, item) {
      if (this.tiedTo1 === item.name) {
        if (this.locs.length === 2 && this.locs.includes(char.name)) this.locs.shift() // remove this room
        if (this.locs[0] !== char.name) {
          this.locs.unshift(char.name)
        }
        this.tiedTo1 = false
      }
      else {
        if (this.locs.length === 2 && this.locs.includes(char.name)) this.locs.pop() // remove this room
        if (this.locs[this.locs.length - 1] !== char.name) this.locs.push(char.name)
        this.tiedTo2 = false
      }
      if (this.afterDetach) this.afterDetach(char, {item:item})
    },  
    findAttachable:function() {
      // Is there some other source?
      const items = scopeReachable()
      for (let obj of items) {
        if (obj.attachable) return obj
      }
      return undefined
    },
  }, TAKEABLE_DICTIONARY)
  
  res.moveToFrom = function() {
    errormsg("You cannot use \"moveToFrom\" with a ROPE object, due to the complicated nature of these things. You should either prevent the user trying to do this, or look to implement some custom code as the ROPE template does for DROP and TAKE. Sorry I cannot be any more help than that!")
  }

  res.drop = function(options) {
    const char = options.char
    if (!this.isAtLoc(char.name)) return falsemsg(lang.not_carrying, options)

    let end
    if (this.locs.length === 1) {
      // Rope is in one place so move as a single item
      this.locs = [char.loc]
      end = 0
    }
    else if (this.locs[0] === char.name) {
      // end 1 is here and not attached, so get that
      this.locs.shift()
      end = 1
    }
    else if (this.locs[this.locs.length - 1] === char.name) {
      // end 2 is here and not attached, so get that
      this.locs.pop()
      end = 2
    }
    options.end = end
    options.toLoc = char.loc
    options.fromLoc = char.name
    
    msg(this.msgDrop, options)
    if (w[char.loc].afterDropIn) w[char.loc].afterDropIn(options);
    if (w[char.name].afterTakeFrom) w[char.name].afterTakeFrom(options);
    if (this.afterMove !== undefined) this.afterMove(options)
    return true;
  }
  
  res.take = function(options) {
    const char = options.char
    if (this.isAtLoc(char.name) && !this.isAtLoc(options.char.loc)) return falsemsg(lang.already_have, options)
    if (!char.testManipulate(this, "take")) return false;
    if (this.tiedTo1 && this.tiedTo2) return falsemsg(lang.rope_tied_both_end, options)

    let end
    if (this.locs.length === 1 && !this.tiedTo1 && !this.tiedTo2) {
      // Rope is in one place, not tied to anything, so move as a single item
      this.locs = [char.name]
      end = 0
    }
    else if (this.locs[0] === char.loc && !this.tiedTo1) {
      // end 1 is here and not attached, so get that
      this.locs.unshift(char.name)
      end = 1
    }
    else if (this.locs[this.locs.length - 1] === char.loc && !this.tiedTo2) {
      // end 2 is here and not attached, so get that
      this.locs.push(char.name)
      end = 2
    }
    else if (this.locs[0] === char.loc || this.locs[this.locs.length - 1] === char.loc) {
      // an end is here - presumably tied to something
      return falsemsg(lang.rope_tied_one_end, options)
    }
    else {
      return falsemsg(lang.rope_no_end, options)
    }
    options.end = end
    options.toLoc = char.name
    options.fromLoc = char.loc
    
    msg(this.msgTake, options)
    if (w[char.loc].afterTakeOut) w[char.loc].afterTakeOut(options)
    if (w[char.name].afterDropIn) w[char.name].afterDropIn(options)
    if (this.afterMove !== undefined) this.afterMove(options)
    if (this.afterTake !== undefined) this.afterTake(options)
    if (this.scenery) this.scenery = false
    return true;
  }
  
  res.testCarry = function(options) {
    if (this.ropeLength === undefined) return true // length not set, infinitely long!
    if (this.locs.length < 3) return true // just in one room
    if (!this.locs.includes(options.char.name)) return true // not carrying, so no issue
    if (this.locs[0] === options.char.name) {
      if (this.locs[2] === options.exit.name) return true // heading back where we came from
    }
    else {
      if (this.locs[this.locs.length - 3] === options.exit.name) return true // heading back where we came from
    }        
    if (this.locs.length <= this.ropeLength) return true
    msg(lang.rope_cannot_move, options)
    return false
  }
  res.afterCarry = function(options) {
    const char = options.char
    if (this.locs.length === 1) return // carried as single item, treat as std item
    if (!this.locs.includes(char.name)) return // not carrying, so no issue
    if (this.locs[0] === char.name) {
      // suppose locs is me, lounge, kitchen, garden
      // case 1: move lounge to kitchen -> me, kitchen, garden
      // case 2: move lounge to hall -> me, hall, lounge, kitchen, garden
      this.locs.shift()  // remove me
      if (this.locs[1] === char.loc) {
        this.locs.shift()
        char.msg(this.msgWind, {char:char, item:this})
      }
      else {
        this.locs.unshift(char.loc)
        char.msg(this.msgUnwind, {char:char, item:this})
      }
      this.locs.unshift(char.name)
    }
    else {
      this.locs.pop()  // remove me
      if (this.locs[this.locs.length - 2] === char.loc) {
        this.locs.pop()
        char.msg(this.msgWind, {char:char, item:this})
      }
      else {
        this.locs.push(char.loc)
        char.msg(this.msgUnwind, {char:char, item:this})
      }
      this.locs.push(char.name)
    }        
  }
  return res
}



const BUTTON_DICTIONARY = {
  button:true,
  msgPress:lang.press_button_successful,
  
  afterCreation:function(o) {
    o.verbFunctions.push(function(o, verbList) {
      verbList.push(lang.verbs.push)
    })
  },
}

const BUTTON = function() {
  const res = Object.assign({}, BUTTON_DICTIONARY)

  res.push = function(options) {
    msg(this.msgPress, options)
    if (this.afterPress) this.afterPress(options)
  }

  return res
}



const TRANSIT_BUTTON = function(nameOfTransit, transitDest) {
  const res = Object.assign({}, BUTTON_DICTIONARY)
  res.loc = nameOfTransit,
  res.transitDest = transitDest
  res.transitButton = true,
  res.transitAlreadyHere = lang.transit_already_here
  res.transitGoToDest = lang.transit_go_to_dest

  res.push = function(options) {
    const transit = w[this.loc];
    const exit = transit[transit.transitDoorDir]

    if (this.testTransitButton && !this.testTransitButton(options.char, {multiple:options.multiple, transit:transit})) return false
    if (transit.testTransit && !transit.testTransit(options.char, {multiple:options.multiple, button:this})) return false
    if (this.locked) return falsemsg(this.transitLocked)
    if (exit.name === this.transitDest) return falsemsg(this.transitAlreadyHere)
    
    if (transit.transitAutoMove) {
      player.moveChar(transit[transit.transitDoorDir])  //player.previousLoc, 
    }
    else {
      printOrRun(player, this, "transitGoToDest")
      transit.transitUpdate(this, true)
    }
    return true
  }

  return res;
};


// This is for rooms
const ROOM_SET = function(setName) {
  return { roomSet:setName }
}



// This is for rooms
const EXIT_FAKER = function() {
  const res = {}
  
  res.exit_attributes = ['msg', 'npcLeaveMsg', 'npcEnterMsg']
  
  res.getExit = function(dir) {
    if (this['exit_' + dir] === undefined) return undefined
    const params = {origin:this, dir:dir}
    if (this['exit_func_' + dir]) params.simpleUse = this[this['exit_func_' + dir]]
    for (const att of this.exit_attributes) {
      if (this['exit_' + att + '_' + dir]) params[att] = this['exit_' + att + '_' + dir]
    }
    return new Exit(this['exit_' + dir], params)
  }
  
  res.hasExit = function(dir, options) {
    if (options === undefined) options = {}
    if (!this['exit_' + dir]) return false
    if (options.excludeLocked && this.isExitLocked(dir)) return false

    if (options.excludeScenery && this['exit_scenery_' + dir]) return false    
    if (game.dark && !this['exit_illuminated_' + dir]) return false
    return !this.isExitHidden(dir)
  }

  return res
}



// This is for rooms
const TRANSIT = function(exitDir) {
  const res = {
    saveExitDests:true,
    transitDoorDir:exitDir,
    mapMoveableLoc:true,
    mapRedrawEveryTurn:true,

    beforeEnter:function() {
      const transitButton = this.findTransitButton(player.previousLoc)
      if (transitButton) this.transitUpdate(transitButton)
    },

    getTransitButtons:function(includeHidden, includeLocked) {
      return this.getContents(world.LOOK).filter(function(el) {
        if (!el.transitButton) return false;
        if (!includeHidden && el.hidden) return false;
        if (!includeLocked && el.locked) return false;
        return true;
      })
    },
    
    findTransitButton:function(dest) {
      for (let key in w) {
        if (w[key].loc === this.name && w[key].transitDest === dest) return w[key]
      }
      return null
    },

    setTransitDest:function(transitButton) {
      if (typeof transitButton === 'string') {
        transitButton = this.findTransitButton(transitButton)
      }
      if (!transitButton) return errormsg("Trying to set a transit to an unfathomable destination.")
      
      this[this.transitDoorDir].name = transitButton.transitDest
      this.currentButtonName = transitButton.name
      this.transitCurrentLocation = transitButton.transitDest
    },
    
    getTransitDestLocation:function() { return w[this[this.transitDoorDir].name] },
    getTransitDestButton:function() { return w[this.currentButtonName] },

    transitUpdate:function(transitButton, callEvent) {
      if (!this[this.transitDoorDir]) return errormsg("The transit \"" + this.name + "\" is set to use \"" + this.transitDoorDir + "\" as the exit, but has no such exit.")
      const previousDest = this[this.transitDoorDir].name
      this.setTransitDest(transitButton)
      if (typeof map !== 'undefined' && map.transitUpdate) map.transitUpdate(this, transitButton, callEvent)
      if (callEvent && this.afterTransitMove) this.afterTransitMove(transitButton.transitDest, previousDest)
    },
  
    // The exit is not saved, so after a load, need to update the exit
    afterLoadForTemplate:function() {
      if (this.currentButtonName) this.setTransitDest(w[this.currentButtonName])
      if (this.afterLoad) this.afterLoad()
    },
  
    isTransitHere:function(char = player) {
      log(this[this.transitDoorDir].name)
      log(char.loc)
      return this[this.transitDoorDir].name === char.loc
    },
  
  
    transitOfferMenu:function() {
      if (this.testTransit && !this.testTransit(player)) {
        if (this.transitAutoMove) player.moveChar(this[this.transitDoorDir])  // player.previousLoc,
        return false
      }
      const buttons = this.getTransitButtons(true, false);
      const transitDoorDir = this.transitDoorDir;
      const room = this;
      showMenu(this.transitMenuPrompt, buttons.map(el => el.transitDestAlias), function(result) {
        for (let button of buttons) {
          if (buttons[i].transitDestAlias === result) {
            buttons[i].push(false, player)
          }
        }
      })
    },
  }
  
  return res;
}



const CHARACTER = function() {
  const res = {
    // The following are used also both player and NPCs, so we can use the same functions for both
    canReachThroughThis:() => true,
    canSeeThroughThis:() => true,
    getContents:util.getContents,
    pause:NULL_FUNC,  
    testManipulate:() => true,
    testMove:() => true,
    testPosture:() => true,
    testTakeDrop:() => true,
    mentionedTopics:[],
    testTalkFlag:true,
    testTalk:function() { return this.testTalkFlag },
    afterCarryList:[],
    followers:[],
    money:0,
    
    getAgreement:function(cmdType, options) {
      if (this['getAgreement' + cmdType]) return this['getAgreement' + cmdType](options)
      if (this.getAgreementDefault) return this.getAgreementDefault()
      return true
    },

    getHolding:function() {
      return this.getContents(world.LOOK).filter(function(el) { return !el.getWorn(); });
    },
    
    getWearing:function() {
      return this.getContents(world.LOOK).filter(function(el) { return el.getWorn() && !el.ensemble; });
    },
    
    getCarrying:function() {
      const res = []
      for (const key in w) {
        if (w[key].isUltimatelyHeldBy && w[key].isUltimatelyHeldBy(this)) res.push(w[key])
      }
      return res
    },
  
    getStatusDesc:function() {
      if (!this.posture) return false;
      return this.posture + " " + this.postureAdverb + " " + lang.getName(w[this.postureFurniture], {article:DEFINITE});
    },
    
    handleGiveTo:function(options) {
      if (!options.item.isAtLoc(options.char.name)) return falsemsg(lang.not_carrying, options)
      if (!options.char.getAgreement("Give", options)) return false
      if (!options.char.testManipulate(options.item, "give")) return false

      options.extraTest = function(options, response) {
        if (!response.item) return true
        const item = typeof response.item === 'string' ? w[response.item] : response.item
        return item === options.item
      }
      return respond(options, this.receiveItems)
    },

    getOuterWearable:function(slot) {
      const clothing = this.getWearing().filter(function(el) {
        if (typeof el.getSlots !== "function") {
          console.log("Item with worn set to true, but no getSlots function");
          console.log(el);
        }
        return el.getSlots().includes(slot);
      });

      if (clothing.length === 0) { return false; }
      let outer = clothing[0];
      for (let garment of clothing) {
        if (garment.wear_layer > outer.wear_layer) {
          outer = garment;
        }
      }
      return outer;
    },

    // Also used by NPCs, so has to allow for that
    msg:function(s, params) {
      msg(s, params);
    },
    
    afterCreation:function(o) {
      o.nameModifierFunctions.push(function(o, l) {
        let s = ''
        const state = o.getStatusDesc();
        const held = o.getHolding();
        const worn = o.getWearingVisible();

        const list = [];
        if (state) {
          list.push(state);
        }
        if (held.length > 0) {
          list.push(lang.invHoldingPrefix + ' ' + formatList(held, {article:INDEFINITE, lastSep:lang.list_and, modified:false, nothing:lang.list_nothing, loc:o.name, npc:true}));
        }
        if (worn.length > 0) {
          list.push(lang.invWearingPrefix + ' ' + formatList(worn, {article:INDEFINITE, lastSep:lang.list_and, modified:false, nothing:lang.list_nothing, loc:o.name, npc:true}));
        }
        if (list.length > 0) l.push(list.join('; '))
      })
      o.verbFunctions.push(function(o, verbList) {
        verbList.shift()
        verbList.push(lang.verbs.lookat)
        if (!settings.noTalkTo) verbList.push(lang.verbs.talkto)
      })
    },

    // Use this to move the character. Describing it should be done elsewhere
    moveChar:function(exit) {
      if (!(exit instanceof Exit)) return errormsg("Using moveChar for " + this.name + " but no exit sent.")
      const room = util.getObj(exit.name)
      this.previousLoc = this.loc

      if (this.player) {
        if (settings.clearScreenOnRoomEnter) clearScreen();
        currentLocation.afterExit(exit)
        this.loc = room.name
        world.update()
        world.enterRoom(exit)
      }
      
      else {
        this.loc = room.name
        this.handleMovingFollowers(exit)
      }

      if (this.afterMove) this.afterMove(exit)
      for (const el of this.getCarrying()) {
        if (el.afterCarry) el.afterCarry({char:this, item:el, exit:exit})
      }
    },
    
    // Use when the NPC changes rooms; will give a message if the player can observe it
    movingMsg:function(exit) {
      if (this.player) {
        if (exit.msg) {
          printOrRun(this, exit, "msg")
        }
        else if (lang.go_successful) {
          msg(lang.go_successful, {char:this, dir:exit.dir})
        }
      }
      else {
        if (exit.msgNPC) {
          exit.msgNPC(this)
        }
        else {
          lang.npc_leaving_msg(this, exit)
          lang.npc_entering_msg(this, exit)
        }
      }
    },

    handleMovingFollowers:function(exit) {
      for (let s of this.followers) {
        const follower = w[s]
        if (follower.loc === this.loc) continue
        if (!follower.testFollowTo || follower.testFollowTo(w[exit.name])) {
          if (this.player) follower.movingMsg(exit, true)
          follower.moveChar(exit)
        }
      }
    }
  }
  return res
}




const PLAYER = function() {
  const res = CHARACTER()
  res.pronouns = lang.pronouns.secondperson
  res.player = true

  res.receiveItems = [
    {
      test:function() { return true },
      f:function(options) { 
        msg(lang.done_msg, options)
        util.giveItem(options)
        return true
      }
    },
  ]

  return res;
}


