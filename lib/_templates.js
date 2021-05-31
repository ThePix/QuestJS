"use strict";

// Should all be language neutral




const TAKEABLE_DICTIONARY = {
  onCreation:function(o) {
    //console.log('takeable: ' + o.name)
    o.verbFunctions.push(function(o, verbList) {
      verbList.push(o.isAtLoc(game.player.name) ? lang.verbs.drop : lang.verbs.take)
    })
    //console.log(o.verbFunctions.length)
  },

  takeable:true,
  
  getDropMsg:function(char) {
    return lang.drop_successful
  },
  
  getDropInMsg:function(char) {
    return lang.done_msg
  },
  
  getTakeMsg:function(char) {
    return lang.take_successful
  },
  
  getTakeOutMsg:function(char) {
    return lang.done_msg
  },
  
  drop:function(multiple, char) {
    if (this.testDropRestrictions && !this.testDropRestrictions(char, multiple)) return false
    const dest = w[char.loc]
    if (dest.testDropInRestrictions && !dest.testDropInRestrictions(char, multiple, this)) return false

    const tpParams = {char:char, item:this}
    msg(prefix(this, multiple) + this.getDropMsg(char), tpParams);
    this.moveToFrom(char.loc, char.name);
    return true;
  },
  
  take:function(multiple, char) {
    const tpParams = {char:char, item:this}
    if (this.isAtLoc(char.name)) {
      log('here')
      msg(prefix(this, multiple) + lang.already_have, tpParams)
      return false
    }
    if (!char.canManipulate(this, "take")) return false
    if (this.testTakeRestrictions && !this.testTakeRestrictions(char, multiple)) return false
    if (w[char.loc].testTakeOutRestrictions && !w[char.loc].testTakeOutRestrictions(char, multiple, this)) return false
    
    msg(prefix(this, multiple) + this.getTakeMsg(char), tpParams)
    this.moveToFrom(char.name, this.takeFromLoc(char))
    if (this.scenery) this.scenery = false
    return true
  },
  
  // This returns the location from which the item is to be taken
  // (and does not do taking from a location).
  // This can be useful for weird objects, such as ropes
  takeFromLoc:function(char) { return this.loc }
  
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
  res.parsePriority = 30;
  res.inventorySkip = true;
  res.takeable = true;
  res.getWorn = function(situation) { return this.isAtLoc(this.ensembleMembers[0].loc, situation) && this.ensembleMembers[0].getWorn(); }

  res.nameModifierFunctions = [function(o, list) {
    if (o.ensembleMembers[0].getWorn() && o.isAllTogether() && o.ensembleMembers[0].isAtLoc(game.player.name)) list.push(lang.invModifiers.worn)
  }]
  
  // Tests if all parts are n the same location and either all are worn or none are worn
  // We can use this to determine if the set is together or not too
  res.isAtLoc = function(loc, situation) {
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
  
  res.getDropMsg = function(char) {
    return lang.drop_successful
  }
  res.getTakeMsg = function(char) {
    return lang.take_successful
  }
  
  
  res.drop = function(multiple, char) {
    const dest = w[char.loc]
    if (dest.testDropRestrictions && !dest.testDropRestrictions(char, multiple)) return false
    if (dest.testDropInRestrictions && !dest.testDropInRestrictions(char, multiple, this)) return false
    const tpParams = {char:char, item:this}
    msg(prefix(this, multiple) + this.getDropMsg(char), tpParams);
    for (let member of this.ensembleMembers) {
      member.moveToFrom(char.loc);
    }
    return true;
  }
  
  res.take = function(multiple, char) {
    const tpParams = {char:char, item:this}
    if (this.isAtLoc(char.name)) {
      msg(prefix(this, multiple) + lang.already_have, tpParams);
      return false;
    }

    if (!char.canManipulate(this, "take")) return false;
    if (this.testTakeRestrictions && !this.testTakeRestrictions(char, multiple)) return false
    if (w[char.loc].testTakeOutRestrictions && !w[char.loc].testTakeOutRestrictions(char, multiple, obj)) return false
    msg(prefix(this, multiple) + this.getTakeMsg(char), tpParams);
    for (let member of this.ensembleMembers) {
      member.moveToFrom(char.name);
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
    
    isAtLoc:function(loc, situation) {
      if (situation === world.PARSER && this.isForSale(loc)) return true;
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
      if (situation === world.SIDE_PANE && this.scenery) return false;
      return true;
    },

    isForSale:function(loc) {
      if (this.loc) return false  // if a location is set, the item is already sold
      if (this.doNotClone) return (this.salesLoc === loc);
      return (this.salesLocs.includes(loc));
    },
    
    canBeSoldHere:function(loc) {
      return w[loc].willBuy && w[loc].willBuy(this);
    },
    
    purchase:function(multiple, char) {
      const tpParams = {char:char, item:this}
      if (!this.isForSale(char.loc)) {
        if (this.doNotClone && this.isAtLoc(char.name)) {
          return failedmsg(lang.cannot_purchase_again, tpParams)
        }
        else {
          return failedmsg(lang.cannot_purchase_here, tpParams)
        }
      }
      
      const cost = this.getBuyingPrice(char);
      tpParams.money = cost
      if (char.money < cost) return failedmsg(prefix(this, multiple) + lang.cannot_afford, tpParams);
      this.purchaseScript(multiple, char, cost, tpParams)
    },
    
    purchaseScript:function(multiple, char, cost, tpParams) {
      char.money -= cost;
      msg(prefix(this, multiple) + lang.purchase_successful, tpParams);
      if (this.doNotClone) {
        this.moveToFrom(char.name, char.loc);
        this.salesLoc = false
      }
      else {
        cloneObject(this, char.name);
      }
      return world.SUCCESS;
    },
    
    sell:function(multiple, char) {
      const tpParams = {char:char, item:this}
      if (!this.canBeSoldHere(char.loc)) {
        return failedmsg(prefix(this, multiple) + lang.cannot_sell_here, tpParams);
      }
      const cost = this.getSellingPrice(char);
      tpParams.money = cost
      char.money += cost;
      msg(prefix(this, multiple) + lang.sell_successful, tpParams);
      if (this.doNotClone) {
        this.moveToFrom(char.loc, char.name);
        this.salesLoc = char.loc;
      }
      this.loc = false
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
  const res = $.extend({}, TAKEABLE_DICTIONARY);
  res.countable = true;
  res.countableLocs = countableLocs ? countableLocs : {};
  res.multiLoc = true
  res.defaultToAll = true
  
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
    for (let el of l) {
      const parts = el.split("=");
      this.countableLocs[parts[0]] = parseInt(parts[1]);
    }
    this.customSaveCountableLocs = false
    this.postLoad()
  };

  res.getListAlias = function(loc) {
    return sentenceCase(this.pluralAlias ? this.pluralAlias : this.listAlias + "s") + " (" + this.countAtLoc(loc) + ")";
  };
  
  res.isAtLoc = function(loc, situation) {
    if (!this.countableLocs[loc]) { return false; }
    if (situation === world.LOOK && this.scenery) return false;
    if (situation === world.SIDE_PANE && this.scenery) return false;
    return (this.countableLocs[loc] > 0 || this.countableLocs[loc] === 'infinity');
  };

  res.countAtLoc = function(loc) {
    if (!this.countableLocs[loc]) { return 0; }
    return this.countableLocs[loc];
  };
  
  res.moveToFrom = function(toLoc, fromLoc, count) {
    if (!count) count = this.extractNumber()
    if (!count) count = fromLoc === player.name ? 1 : this.countAtLoc(fromLoc)
    if (count === 'infinity') count = 1
    this.takeFrom(fromLoc, count)
    this.giveTo(toLoc, count)
  };
  
  res.takeFrom = function(loc, count) {
    if (this.countableLocs[loc] !== 'infinity') this.countableLocs[loc] -= count
    if (this.countableLocs[loc] <= 0) this.countableLocs[loc] = false
    w[loc].afterItemTakenFrom(this, count)
  };
  
  res.giveTo = function(loc, count) {
    if (!this.countableLocs[loc]) { this.countableLocs[loc] = 0; }
    if (this.countableLocs[loc] !== 'infinity') this.countableLocs[loc] += count;
    w[loc].afterItemDroppedHere(this, count);
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

  // As this is flagged as multiLoc, need to take special care about where the thing is
  res.take = function(multiple, char) {
    const tpParams = {char:char, item:this}
    const sourceLoc = this.findSource(char.loc, true);
    if (!sourceLoc) return falsemsg(prefix(this, multiple) + lang.none_here, tpParams)
    
    let n = this.extractNumber()
    let m = this.countAtLoc(sourceLoc)
    if (!n) { n = m === 'infinity' ? 1 : m; }  // no number specified
    if (n > m && m !== 'infinity')  { n = m; }  // too big number specified

    if (this.testTakeRestrictions && !this.testTakeRestrictions(char, multiple, n)) return false
    if (w[sourceLoc].testTakeOutRestrictions && !w[sourceLoc].testTakeOutRestrictions(char, multiple, this, n)) return false
    
    tpParams[this.name + '_count'] = n
    msg(prefix(this, multiple) +  this.getTakeMsg(char, n), tpParams)
    this.takeFrom(sourceLoc, n)
    this.giveTo(char.name, n)
    if (this.scenery) this.scenery = false
    return true
  }

  res.drop = function(multiple, char) {
    const tpParams = {char:char, item:this}
    let n = this.extractNumber();
    let m = this.countAtLoc(char.name);
    if (m === 0) {
      msg(prefix(this, multiple) + lang.none_held, tpParams);
      return false;
    }
    const dest = w[char.loc]

    if (!n) n = this.defaultToAll ? m : 1   // no number specified
    if (n > m)  { n = m; }  // too big number specified

    if (this.testDropRestrictions && !this.testDropRestrictions(char, multiple, n)) return false
    if (dest.testDropInRestrictions && !dest.testDropInRestrictions(char, multiple, dest, n)) return false
    
    tpParams[this.name + '_count'] = n
    msg(prefix(this, multiple) + this.getDropMsg(char, n), tpParams);
    this.takeFrom(char.name, n);
    this.giveTo(char.loc, n);
    return true;
  };

  return res;
};



const WEARABLE = function(wear_layer, slots) {
  const res = $.extend({}, TAKEABLE_DICTIONARY)
  res.wearable = true
  res.armour = 0
  res.wear_layer = wear_layer ? wear_layer : false
  res.slots = slots && wear_layer ? slots: []
  res.worn = false
  res.useDefaultsTo = function(char) {
    return char === game.player ? 'Wear' : 'NpcWear'
  }
  
  res.getSlots = function() { return this.slots }
  res.getWorn = function() { return this.worn }
  res.getArmour = function() { return this.armour }
  res.getWearMsg = function(char) { return lang.wear_successful }
  res.getRemoveMsg = function(char) { return lang.remove_successful }
  
  res.onCreation = function(o) {
    //console.log('wearable: ' + o.name)
    o.verbFunctions.push(function(o, verbList) {
      if (!o.isAtLoc(game.player.name)) {
        verbList.push(lang.verbs.take)
      }
      else if (o.getWorn()) {
        if (!o.getWearRemoveBlocker(game.player, false)) verbList.push(lang.verbs.remove)
      }
      else {
        verbList.push(lang.verbs.drop)
        if (!o.getWearRemoveBlocker(game.player, true)) verbList.push(lang.verbs.wear)
      }
    })
    //console.log(o.verbFunctions.length)

    o.nameModifierFunctions.push(function(o, list) {
      if (o.worn && o.isAtLoc(game.player.name)) list.push(lang.invModifiers.worn)
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
  
  res.testWearRestrictions = function(char) { return true }
  res.testRemoveRestrictions = function(char) { return true }
  
  res._canWearRemove = function(char, toWear, multiple) {
    if (toWear) {
      if (!this.testWearRestrictions(char, multiple)) return false
    }
    else {
      if (!this.testRemoveRestrictions(char, multiple)) return false
    }
    const outer = this.getWearRemoveBlocker(char, toWear)
    if (outer) {
      const tpParams = {char:char, garment:this, outer:outer}
      if (toWear) {
        msg(lang.cannot_wear_over, tpParams)
      }
      else {
        msg(lang.cannot_remove_under, tpParams)
      }
      return false;
    }
    return true;
  };
  
  // Assumes the item is already held  
  res.wear = function(multiple, char) {
    if (!this._canWearRemove(char, true, multiple)) return false
    if (!char.canManipulate(this, "wear")) return false
    if (this.wearMsg) {
      msg(prefix(this, multiple) + this.wearMsg(char, this), {garment:this, actor:char})
    }
    else {
      msg(prefix(this, multiple) + this.getWearMsg(char), {garment:this, char:char})
    }
    this.worn = true
    if (this.onWear) this.onWear(char)
    return true
  };

  // Assumes the item is already held  
  res.remove = function(multiple, char) {
    if (!this._canWearRemove(char, false, multiple)) return false
    if (!char.canManipulate(this, "remove")) return false
    if (this.removeMsg) {
      msg(prefix(this, multiple) + this.removeMsg(char, this), {garment:this, actor:char});
    }
    else {
      msg(prefix(this, multiple) + this.getRemoveMsg(char), {garment:this, char:char});
    }
    this.worn = false;
    if (this.onRemove) this.onRemove(char);
    return true;
  };


  return res;
};



const OPENABLE_DICTIONARY = {
  open:function(multiple, char) {
    const tpParams = {char:char, container:this}
    if (!this.openable) {
      msg(prefix(this, multiple) + lang.cannot_open, {item:this});
      return false;
    }
    else if (!this.closed) {
      msg(prefix(this, multiple) + lang.already, {item:this});
      return false;
    }
    else if (this.testOpenRestrictions && !this.testOpenRestrictions(char)) {
      return false
    }
    if (this.locked) {
      if (this.testKeys(char)) {
        this.locked = false;
        this.closed = false;
        msg(prefix(this, multiple) + lang.unlock_successful, tpParams);
        this.openMsg(multiple, tpParams);
        return true;
      }
      else {
        msg(prefix(this, multiple) + lang.locked, tpParams);
        return false;
      }
    }
    this.closed = false;
    this.openMsg(multiple, tpParams);
    if (this.afterOpen) this.afterOpen(char)
    return true;
  },
  
  close:function(multiple, char) {
    const tpParams = {char:char, container:this}
    if (!this.openable) {
      msg(prefix(this, multiple) + lang.cannot_close, {item:this});
      return false;
    }
    else if (this.closed) {
      msg(prefix(this, multiple) + lang.already, {item:this});
      return false;
    }
    else if (this.testCloseRestrictions && !this.testCloseRestrictions(char)) {
      return false
    }
    this.closed = true;
    this.closeMsg(multiple, tpParams);
    if (this.afterClose) this.afterClose(char)
    return true;
  },
  
  closeMsg:function(multiple, tpParams) {
    msg(prefix(this, multiple) + lang.close_successful, tpParams);
  },
  
}

const CONTAINER = function(openable) {
  const res = $.extend({}, OPENABLE_DICTIONARY);
  res.container = true
  
  res.closed = openable;
  res.openable = openable
  res.contentsType = "container"
  res.getContents = util.getContents
  res.testForRecursion = util.testForRecursion
  res.listContents = util.listContents
  res.transparent = false
  
  res.onCreation = function(o) {
    //console.log('container: ' + o.name)
    o.verbFunctions.push(function(o, verbList) {
      if (o.openable) {
        verbList.push(o.closed ? lang.verbs.open : lang.verbs.close);
      }
    })
    //console.log(o.verbFunctions.length)
    o.nameModifierFunctions.push(util.nameModifierFunctionForContainer) 
    //console.log(o.nameModifierFunctions)
  },

  res.lookinside = function(multiple, char) {
    const tpParams = {char:char, container:this}
    if (this.closed && !this.transparent) {
      msg(prefix(this, multiple) + lang.nothing_inside, {char:char});
      return false;
    }
    //tpParams.list = formatList(this.getContents(world.LOOK), {article:INDEFINITE, lastJoiner:lang.list_and, nothing:lang.list_nothing})
    tpParams.list = this.listContents(world.LOOK, true)
    msg(prefix(this, multiple) + lang.look_inside, tpParams);
    return true;
  };
  
  res.openMsg = function(multiple, tpParams) {
    tpParams.list = this.listContents(world.LOOK)
    msg(prefix(this, multiple) + lang.open_successful + " " + (tpParams.list === lang.list_nothing ? lang.it_is_empty : lang.look_inside), tpParams)
  };
  
  res.icon = function() {
    return this.closed ? 'closed12' : 'opened12'
  };
  
  res.canReachThrough = function() { return !this.closed };
  res.canSeeThrough = function() { return !this.closed || this.transparent };

  return res;
};



const SURFACE = function() {
  const res = {}
  res.container = true
  res.getContents = util.getContents
  res.testForRecursion = util.testForRecursion
  res.listContents = util.listContents
  res.onCreation = function(o) { o.nameModifierFunctions.push(util.nameModifierFunctionForContainer) }
  res.closed = false;
  res.openable = false;
  res.contentsType = "surface",
  res.canReachThrough = () => true;
  res.canSeeThrough = () => true;
  return res;
};



const OPENABLE = function(alreadyOpen) {
  const res = $.extend({}, OPENABLE_DICTIONARY);
  res.closed = !alreadyOpen;
  res.openable = true;
  
  res.onCreation = function(o) {
    //console.log('openable: ' + o.name)
    o.verbFunctions.push(function(o, verbList) {
      verbList.push(o.closed ? lang.verbs.open : lang.verbs.close);
    })
    o.nameModifierFunctions.push(function(o, list) {
      if (!o.closed) list.push(lang.invModifiers.open)
    })
  }

  res.openMsg = function(multiple, tpParams) {
    msg(prefix(this, multiple) + lang.open_successful, tpParams);
  };

  return res;
};



const LOCKED_WITH = function(keyNames) {
  if (typeof keyNames === "string") { keyNames = [keyNames]; }
  if (keyNames === undefined) { keyNames = []; }
  const res = {
    keyNames:keyNames,
    locked:true,
    
    lock:function(multiple, char) {
      const tpParams = {char:char, container:this}
      if (this.locked) return falsemsg(lang.already, tpParams)
      if (!this.testKeys(char, true)) return falsemsg(lang.no_key, tpParams)

      if (!this.closed) {
        this.closed = true
        this.locked = true
        msg(lang.close_and_lock_successful, tpParams)
      }
      else {
        this.locked = true
        msg(lang.lock_successful, tpParams)
      }
      return true
    },
    
    unlock:function(multiple, char) {
      const tpParams = {char:char, container:this}
      if (!this.locked) return falsemsg(lang.already, {item:this})
      if (!this.testKeys(char, false)) return falsemsg(lang.no_key, tpParams)
      msg(lang.unlock_successful, tpParams)
      this.locked = false
      if (this.onUnlock) this.onUnlock(char)
      return true
    },
    
    testKeys:function(char, toLock) {
      for (let s of keyNames) {
        if (!w[s]) {
          errormsg("The key name for this container, `" + s + "`, does not match any key in the game.");
          return false;
        }
        if (w[s].isAtLoc(char.name)) { 
          return true; 
        }
      }
      return false;
    }
  }
  return res
}



const LOCKED_DOOR = function(key, loc1, loc2, name1, name2) {
  const res = $.extend({}, OPENABLE(false), LOCKED_WITH(key))
  res.loc1 = loc1
  res.loc2 = loc2
  res.name1 = name1
  res.name2 = name2
  res.scenery = true

  res._setup = function() {
    const room1 = w[this.loc1]
    if (!room1) return errormsg("Bad location name '" + this.loc1 + "' for door " + this.name)
    const exit1 = room1.findExit(this.loc2)
    if (!exit1) return errormsg("No exit to '" + this.loc2 + "' for door " + this.name)
    this.dir1 = exit1.dir
    if (!room1[this.dir1]) return errormsg("Bad exit '" + this.dir1 + "' in location '" + room1.name + "' for door: " + this.name + " (possibly because the room is defined after the door?)")

    const room2 = w[this.loc2]
    if (!room2) return errormsg("Bad location name '" + this.loc2 + "' for door " + this.name)
    const exit2 = room2.findExit(this.loc1)
    if (!exit2) return errormsg("No exit to '" + this.loc1 + "' for door " + this.name)
    this.dir2 = exit2.dir
    if (!room2[this.dir2]) return errormsg("Bad exit '" + this.dir2 + "' in location '" + room2.name + "' for door: " + this.name + " (possibly because the room is defined after the door?)")

    room1[this.dir1].use = util.useWithDoor
    room1[this.dir1].door = this.name
    room1[this.dir1].doorName = this.name1 || 'door to ' + lang.getName(w[this.loc2], {article:DEFINITE})

    room2[this.dir2].use = util.useWithDoor
    room2[this.dir2].door = this.name
    room2[this.dir2].doorName = this.name2 || 'door to ' + lang.getName(w[this.loc1], {article:DEFINITE})
  }
  
  res.isAtLoc = function(loc, situation) {
    if (typeof loc !== "string") loc = loc.name
    if (situation !== world.PARSER && this.scenery) return false;
    return (loc == this.loc1 || loc == this.loc2);
  }

  res.icon = () => 'door12'

  return res;
}  



const KEY = function() {
  const res = $.extend({}, TAKEABLE_DICTIONARY)
  res.key = true
  res.icon = () => 'key12'
  return res;
}  

const READABLE = function(mustBeHeld) {
  const res = {}
  res.readable = true
  res.mustBeHeld = mustBeHeld
  res.icon = () => 'readable12'
  res.onCreation = function(o) {
    o.verbFunctions.push(function(o, verbList) {
      if (o.loc === game.player.name || !o.mustBeHeld) verbList.push(lang.verbs.read)
    })
  }
  return res;
}  



const FURNITURE = function(options) {
  const res = {
    testForPosture:(char, posture) => true,
    getoff:function(multiple, char) {
      if (!char.posture) {
        char.msg(lang.already, {item:char});
        return false;
      }
      if (char.posture) {
        char.msg(lang.stop_posture(char));  // stop_posture handles details
        return true;
      }  
    },
  }
  res.useDefaultsTo = function(char) {
    const cmd = this.useCmd ? this.useCmd : (this.reclineon ? 'ReclineOn' : (this.siton ? 'SitOn' : 'StandOn'))
    return char === game.player ? cmd : 'Npc' + cmd
  }

  res.onCreation = function(o) {
    o.verbFunctions.push(function(o, verbList) {
      if (game.player.posture && game.player.postureFurniture === o.name) {
        verbList.push(lang.verbs.getOff)
        return
      }
      if (game.player.posture && game.player.posture !== 'standing') return
      if (o.siton) verbList.push(lang.verbs.sitOn)
      if (o.standon) verbList.push(lang.verbs.standOn)
      if (o.reclineon) verbList.push(lang.verbs.reclineOn)
    })
  }

  res.assumePosture = function(multiple, char, posture, name, adverb) {
    const tpParams = {char:char, item:this}
    if (char.posture === posture && char.postureFurniture === this.name) {
      char.msg(lang.already, {item:char})
      return false
    }
    if (!this.testForPosture(char, posture)) {
      return false
    }
    if (char.posture && char.postureFurniture !== this.name) {
      char.msg(stop_posture(char))
      char.msg(lang[name + '_on_successful'], tpParams)
    }
    else if (char.posture && this[char.posture + "_to_" + posture] && this.postureChangesImplemented) {
      char.msg(this[char.posture + "_to_" + posture], {actor:char, item:this})
    }
    else {
      char.msg(lang[name + '_on_successful'], tpParams)
    }
    char.posture = posture
    char.postureFurniture = this.name
    char.postureAdverb = adverb === undefined ? 'on' : adverb;
    const eventName = 'on' + sentenceCase(name)
    if (typeof this[eventName] === "function") this[eventName](char)
    return true
  }

  if (options.sit) {
    res.siton = function(multiple, char) {
      return this.assumePosture(multiple, char, "sitting", 'sit')
    }
  }
  if (options.stand) {
    res.standon = function(multiple, char) {
      return this.assumePosture(multiple, char, "standing", 'stand')
    }
  }
  if (options.recline) {
    res.reclineon = function(multiple, char) {
      return this.assumePosture(multiple, char, "reclining", 'recline')
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
  
  res.onCreation = function(o) {
    o.verbFunctions.push(function(o, verbList) {
      if (!o.mustBeHeldToOperate || o.isAtLoc(game.player)) {
        verbList.push(o.switchedon ? lang.verbs.switchoff : lang.verbs.switchon)
      }
    })
    o.nameModifierFunctions.push(function(o, list) {
      if (o.nameModifier && o.switchedon) list.push(o.nameModifier)
    })
  }

  res.switchon = function(multiple, char) {
    const tpParams = {char:char, item:this}
    if (this.switchedon) {
      char.msg(prefix(this, multiple) + lang.already, {item:this});
      return false;
    }
    if (!this.checkCanSwitchOn()) return false
    if (!char.getAgreement("SwitchOn", this, true)) return false
    
    if (!this.suppressMsgs) char.msg(lang.turn_on_successful, tpParams);
    this.doSwitchon();
    return true;
  };
  
  res.doSwitchon = function() {
    let lighting = game.dark;
    this.switchedon = true;
    world.update();
    if (lighting !== game.dark) {
      currentLocation.description();
    }
    if (this.onSwitchOn) this.onSwitchOn()
  };
  
  res.checkCanSwitchOn = () => true;
  
  res.switchoff = function(multiple, char) {
    const tpParams = {char:char, item:this}
    if (!this.switchedon) {
      char.msg(prefix(this, multiple) + lang.already, {item:this});
      return false;
    }
    if (!char.getAgreement("SwitchOn", this, false)) return false

    if (!this.suppressMsgs) char.msg(lang.turn_off_successful, tpParams);
    this.doSwitchoff();
    return true;
  };
  
  res.doSwitchoff = function() {
    let lighting = game.dark;
    this.switchedon = false;
    world.update();
    if (lighting !== game.dark) {
      currentLocation.description();
    }
    if (this.onSwitchOff) this.onSwitchOff()
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
    isAtLoc:function(loc, situation) {
      if (typeof loc !== "string") loc = loc.name
      if (situation !== world.PARSER) return false;
      let cont = w[this.loc];
      if (cont.isAtLoc(loc)) { return true; }
      return cont.isAtLoc(loc);
    },
    take:function(multiple, char) {
      msg(prefix(this, multiple) + lang.cannot_take_component, {char:char, item:this, whole:w[this.loc]});
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
  res.eat = function(multiple, char) {
    const tpParam = {char:char, item:this}
    if (this.isLiquid) {
      msg(prefix(this, multiple) + lang.cannot_eat, tpParam);
      return false;
    }
    msg(prefix(this, multiple) + lang.eat_successful, tpParam);
    this.loc = null;
    if (this.onIngesting) this.onIngesting(char);
    return true;
  };
  res.drink = function(multiple, char) {
    const tpParam = {char:char, item:this}
    if (!this.isLiquid) {
      msg(prefix(this, multiple) + lang.cannot_drink, tpParam);
      return false;
    }
    msg(prefix(this, multiple) + lang.drink_successful, tpParam);
    this.loc = null;
    if (this.onIngesting) this.onIngesting(char);
    return true;
  };
  res.ingest = function(multiple, char) {
    if (this.isLiquid) {
      return this.drink(multiple, char)
    }
    else {
      return this.eat(multiple, char)
    }
  }
  res.icon = () => 'edible12'
  res.onCreation = function(o) {
    //console.log('edible: ' + o.name)
    o.verbFunctions.push(function(o, verbList) {
      verbList.push(o.isAtLoc(game.player.name) ? lang.verbs.drop : lang.verbs.take)
      if (o.isAtLoc(game.player)) verbList.push(o.isLiquid ? lang.verbs.drink : lang.verbs.eat)
    })
    //console.log(o.verbFunctions.length)
  }
  return res;
};


const VESSEL = function() {
  const res = {}
  res.vessel = true

  res.onCreation = function(o) {
    if (o.volumeContained) {
      list.push("full of " + o.containedFluidName)
    }
  },
  
  res.findSource = function(chr, fluid) {
    const fluids = fluid ? [fluid] : settings.fluids
    if (chr === undefined) chr = game.player
    
    // Is character a source?
    if (chr.isSourceOf) {
      for (const s of fluids) {
        if (chr.isSourceOf(s)) return [chr, s]
      }
    }
    
    // Is the room a source?
    if (w[chr.loc].isSourceOf) {
      for (const s of fluids) {
        if (w[chr.loc].isSourceOf(s)) return [w[chr.loc], s]
      }
    }

    // Is there some other source?
    const items = scopeReachable()
    for (const s of fluids) {
      for (let obj of items) {
        if (obj.isSourceOf && obj.isSourceOf(s)) return [obj, s]
      }
    }
    return [false, false];
  },
  
  res.fill = function(multiple, chr) {
    const [source, fluid] = this.findSource(chr)
    if (!source) return falsemsg(lang.no_generic_fluid_here, {item:this});
    return this.doFill(multiple, chr, source, fluid)
  },
  
  res.doFill = function(multiple, char, source, fluid) {
    const tpParams = {char:char, item:this, fluid:fluid}
    if (this.testFillRestrictions && !this.testFillRestrictions(char, fluid, multiple)) return false
    if (this.containedFluidName) return falsemsg(lang.already_full, tpParams)
    
    this.containedFluidName = fluid
    msg(lang.fill_successful, tpParams)
    if (this.onFill) this.onFill(this.containedFluidName, char, source)
    return true
  }

  res.empty = function(multiple, char) {
    return this.doEmpty(multiple, char)
  }

  res.doEmpty = function(multiple, char, sink) {
    const tpParams = {char:char, item:this, sink:sink}
    
    if (!this.containedFluidName) return falsemsg(lang.already_full, tpParams)

    if (!sink) {
      msg(lang.empty_successful, tpParams)
    }
    else if (sink.vessel) {
      msg(lang.empty_into_successful, tpParams)
      sink.containedFluidName = this.containedFluidName
    }
    else if (sink.sink) {
      sink.sink(this.containedFluidName, char, this)
    }
    else {
      msg(lang.empty_onto_successful, tpParams)
    }
    if (this.onEmpty) this.onEmpty(this.containedFluidName, char, sink)
    delete this.containedFluidName
    return true
  }

  res.onCreation = function(o) {
    o.verbFunctions.push(function(o, verbList) {
      if (!o.isAtLoc(game.player.name)) return
      verbList.push(o.containedFluidName ? lang.verbs.empty : lang.verbs.fill)
    })
  }
  return res;
}






const ROPE = function(tetheredTo) {
  const res = $.extend({
    rope:true,
    tethered:(tetheredTo !== undefined),
    tiedTo1:tetheredTo,
    locs:[],
    attachVerb:lang.rope_attach_verb,
    attachedVerb:lang.rope_attached_verb,
    detachVerb:lang.rope_detach_verb,
    isAtLoc:function(loc, situation) {
      if (this.loc) {
        this.locs = [this.loc]
        this.loc = false
      }
      if (typeof loc !== "string") loc = loc.name
      // If the rope is in the location and held by the character, only want it to appear once in the side pane
      if (situation === world.SIDE_PANE && this.locs.includes(game.player.name) && loc !== game.player.name) return false
      return this.locs.includes(loc) 
    },
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
        if (obj1 && obj2) return processText(lang.examineAddBothEnds, {rope:this, obj1:obj1, obj2:obj2})
        if (obj1) return processText(lang.rope_examine_attached_one_end, {rope:this, obj1:obj1})
        if (obj2) return processText(lang.rope_examine_attached_one_end, {rope:this, obj1:obj2})
        return ''  // just in one place, like any ordinary object
      }

      // Who is it held by (and we can see)
      const end1 = w[this.locs[0]]
      const holder1 = (end1.npc || end1.player) && end1.isHere() ? end1 : false
      const end2 = w[this.locs[this.locs.length - 1]]
      const holder2 = (end2.npc || end2.player) && end2.isHere() ? end2 : false
      
      // What locations does it go to
      const index = this.locs.findIndex(el => el === game.player.loc)
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
      
      return processText(s, {rope:this, obj1:obj1, obj2:obj2, holder1:holder1, holder2:holder2, loc1:loc1, loc2:loc2})
    },
    canAttachTo:function(item) {
      return item.attachable
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
      if (this.onTie) this.onTie(char, item)
    },
    useWith:function(char, item) {
      return handleTieTo(char, this, item) === world.SUCCESS
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
      if (this.onUntie) this.onUntie(char, item)
    },  
  
  }, TAKEABLE_DICTIONARY)
  
  // This MUST be sent the fromLoc unless if is only in a single location, and you must already have established it is not attached
  // once this is registered for onGoX it stays registered, even when dropped - it is much easier!
  res.moveToFrom = function(toLoc, fromLoc) {
    if (fromLoc === undefined) {
      if (this.locs.length !== 1) throw "Need a fromLoc here for a rope object"
      fromLoc = this.locs[0]
    }
    if (fromLoc === toLoc) return
    if (!w[fromLoc]) errormsg("The location name `" + fromLoc + "`, does not match anything in the game.")
    if (!w[toLoc]) errormsg("The location name `" + toLoc + "`, does not match anything in the game.")
      
    let end
    if (this.locs.length === 1) {
      this.locs = [toLoc]
      end = 0
    }
    else if (this.locs[0] === fromLoc) {
      this.locs.shift()
      this.locs.unshift(toLoc)
      end = 1
    }
    else if (this.locs[this.locs.length - 1] === fromLoc) {
      this.locs.pop()
      this.locs.push(toLoc)
      end = 2
    }
    if (w[toLoc].testCarryRestrictionsList && !w[toLoc].testCarryRestrictionsList.includes(this.name)) w[toLoc].testCarryRestrictionsList.push(this.name)
    if (w[toLoc].afterCarryList && !w[toLoc].afterCarryList.includes(this.name)) w[toLoc].afterCarryList.push(this.name)
    w[fromLoc].afterItemTakenFrom(this, end);
    w[toLoc].afterItemDroppedHere(this, end);
    if (this.afterMove !== undefined) this.afterMove(toLoc, fromLoc, end)
  }

  res.takeFromLoc = function(char) {
    if (this.locs.includes(char.loc)) return char.loc
    if (this.locs.length === 1) return this.locs[0]
    throw "Sorry, taking ropes from containers has yet to be fully implemented"
  }

/*  res.drop = function(multiple, char) {
    msg(prefix(this, multiple) + lang.drop_successful(char, this));
    //this.moveToFrom(char.loc);
    if (this.tiedTo1 === char.name) this.tiedTo1 = char.loc
    if (this.tiedTo2 === char.name) this.tiedTo2 = char.loc
    w[char.name].afterItemTakenFrom(this);
    w[char.loc].afterItemDroppedHere(this);
    if (this.afterMove !== undefined) this.afterMove(char.loc, char.name)  // may want to say which end
    return true;
  }*/
  
  res.take = function(multiple, char) {
    const tpParams = {char:char, item:this}
    if (this.isAtLoc(char.name)) return falsemsg(prefix(this, multiple) + lang.already_have, tpParams)
    if (!char.canManipulate(this, "take")) return false;
    if (this.tiedTo1 && this.tiedTo2) return falsemsg(prefix(this, multiple) + "It is tied up at both ends.")
    msg(prefix(this, multiple) + lang.take_successful, tpParams);
    this.moveToFrom(char.name, char.loc) // !!! assuming where it is going from
    if (this.scenery) this.scenery = false
    return true;
  }
  
  res.testCarryRestrictions = function(char, dest) {
    if (this.ropeLength === undefined)  // length not set, infinitely long!
    if (this.locs.length < 3) return true // just in one room
    if (!this.locs.includes(char.name)) return true // not carrying, so no issue
    if (this.locs[0] === char.name) {
      if (this.locs[2] === dest) return true // heading back where we came from
    }
    else {
      if (this.locs[this.locs.length - 3] === dest) return true // heading back where we came from
    }        
    if (this.locs.length <= this.ropeLength) return true
    msg("{nv:rope:be:true} not long enough, you cannot go any further.", {rope:this})
    return false
  }
  res.afterCarry = function(char) {
    if (this.locs.length === 1) return // carried as single item, treat as std item
    if (!this.locs.includes(char.name)) return // not carrying, so no issue
    if (this.locs[0] === char.name) {
      // suppose locs is me, lounge, kitchen, garden
      // case 1: move lounge to kitchen -> me, kitchen, garden
      // case 2: move lounge to hall -> me, hall, lounge, kitchen, garden
      this.locs.shift()  // remove me
      if (this.locs[1] === char.loc) {
        this.locs.shift()
      }
      else {
        this.locs.unshift(char.loc)
      }
      this.locs.unshift(char.name)
    }
    else {
      this.locs.pop()  // remove me
      if (this.locs[this.locs.length - 2] === char.loc) {
        this.locs.pop()
      }
      else {
        this.locs.push(char.loc)
      }
      this.locs.push(char.name)
    }        
  }
  return res
}



const BUTTON_DICTIONARY = {
  button:true,
  
  onCreation:function(o) {
    o.verbFunctions.push(function(o, verbList) {
      verbList.push(lang.verbs.push)
    })
  },
}

const BUTTON = function() {
  const res = $.extend({}, BUTTON_DICTIONARY)

  res.push = function(multiple, char) {
    const tpParams = {char:char, item:this}
    msg(lang.push_button_successful, tpParams)
    if (this.onPress) this.onPress(char)
  }

  return res
}



const TRANSIT_BUTTON = function(nameOfTransit) {
  const res = $.extend({}, BUTTON_DICTIONARY)
  res.loc = nameOfTransit,
  res.transitButton = true,
    
  res.isAtLoc = function(loc, situation) {
    if (situation === world.LOOK) return false;
    if (typeof loc !== "string") loc = loc.name
    return (this.loc === loc)
  }

  res.push = function(multiple, char) {
    const transit = w[this.loc];
    const exit = transit[transit.transitDoorDir]

    if (this.testTransitButtonRestrictions && !this.testTransitButtonRestrictions(char, multiple, transit)) return false
    if (transit.testTransitRestrictions && !transit.testTransitRestrictions(char, multiple, this)) return false
    if (this.locked) return falsemsg(this.transitLocked)
    if (exit.name === this.transitDest) return falsemsg(this.transitAlreadyHere)
    
    if (transit.transitAutoMove) {
      game.player.moveChar(game.player.previousLoc, transit[transit.transitDoorDir])
    }
    else {
      printOrRun(game.player, this, "transitGoToDest")
      transit.update(this, true)
    }
    return true
  }

  return res;
};


// This is for rooms
const TRANSIT = function(exitDir) {
  const res = {
    saveExitDests:true,
    transitDoorDir:exitDir,
    mapMoveableLoc:true,
    mapRedrawEveryTurn:true,

    beforeEnter:function() {
      const transitButton = this.findTransitButton(game.player.previousLoc)
      if (transitButton) this.update(transitButton)
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

    setDest:function(transitButton) {
      this[this.transitDoorDir].name = transitButton.transitDest
      this.currentButtonName = transitButton.name
    },

    update:function(transitButton, callEvent) {
      if (!this[this.transitDoorDir]) return errormsg("The transit \"" + this.name + "\" is set to use \"" + this.transitDoorDir + "\" as the exit, but has no such exit.")
      const previousDest = this[this.transitDoorDir].name
      this.setDest(transitButton)
      if (typeof map !== 'undefined' && map.transitUpdate) map.transitUpdate(this, transitButton, callEvent)
      if (callEvent && this.afterTransitMove) this.afterTransitMove(transitButton.transitDest, previousDest)
    },
  
    // The exit is not saved, so after a load, need to update the exit
    templatePostLoad:function() {
      if (this.currentButtonName) this.setDest(w[this.currentButtonName])
      if (this.postLoad) this.postLoad()
    },
  
  
    transitOfferMenu:function() {
      if (this.testTransitRestrictions && !this.testTransitRestrictions(player, false, this)) {
        if (this.transitAutoMove) game.player.moveChar(game.player.previousLoc, this[this.transitDoorDir])
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
    canReachThrough:() => true,
    canSeeThrough:() => true,
    getContents:util.getContents,
    pause:NULL_FUNC,  
    canManipulate:() => true,
    canMove:() => true,
    canPosture:() => true,
    canTakeDrop:() => true,
    mentionedTopics:[],
    canTalkFlag:true,
    canTalk:function() { return this.canTalkFlag },
    testCarryRestrictionsList:[],
    afterCarryList:[],
    followers:[],
    
    getAgreement:function(cmdType, obj1, obj2) {
      if (this['getAgreement' + cmdType]) return this['getAgreement' + cmdType](obj1, obj2)
      if (this.getAgreementDefault) return this.getAgreementDefault()
      return true
    },

    getHolding:function() {
      return this.getContents(world.LOOK).filter(function(el) { return !el.getWorn(); });
    },
    
    getWearing:function() {
      return this.getContents(world.LOOK).filter(function(el) { return el.getWorn() && !el.ensemble; });
    },
  
    getStatusDesc:function() {
      if (!this.posture) return false;
      return this.posture + " " + this.postureAdverb + " " + lang.getName(w[this.postureFurniture], {article:DEFINITE});
    },
    
    isAtLoc:function(loc, situation) {
      if (situation === world.LOOK) return false;
      if (situation === world.SIDE_PANE) return false;
      if (typeof loc !== "string") loc = loc.name
      return (this.loc === loc);
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
    
    onCreation:function(o) {
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
          list.push(lang.invHoldingPrefix + ' ' + formatList(held, {article:INDEFINITE, lastJoiner:lang.list_and, modified:false, nothing:lang.list_nothing, loc:o.name, npc:true}));
        }
        if (worn.length > 0) {
          list.push(lang.invWearingPrefix + ' ' + formatList(worn, {article:INDEFINITE, lastJoiner:lang.list_and, modified:false, nothing:lang.list_nothing, loc:o.name, npc:true}));
        }
        if (list.length > 0) l.push(list.join('; '))
      })
      o.verbFunctions.push(function(o, verbList) {
        verbList.shift()
        verbList.push(lang.verbs.lookat)
        if (!settings.noTalkTo) verbList.push(lang.verbs.talkto)
      })
    },

    // Use this to move the character. Describing it should be described elsewhere
    moveChar:function(roomName, exit) {
      const room = util.getObj(roomName)
      this.previousLoc = this.loc

      if (this.player) {
        if (settings.clearScreenOnRoomEnter) clearScreen();
        currentLocation.onExit()
        this.loc = room.name
        world.update()
        world.enterRoom(exit)
      }
      
      else {
        this.loc = room.name
        this.handleMovingFollowers(room, exit)
      }

      for (let el of this.afterCarryList) {
        w[el].afterCarry(this, room, exit)
      }
    },
    
    // Use when the NPC changes rooms; will give a message if the player can observe it
    movingMsg:function(exit) {
      if (this.player) {
        if (exit.msg) {
          printOrRun(this, exit, "msg")
        }
        else {
          msg(lang.go_successful, {char:this, dir:exit.dir})
        }
      }
      else {
        if (exit.msgNPC) {
          exit.msgNPC(char)
        }
        else {
          lang.npc_leaving_msg(this, exit)
          lang.npc_entering_msg(this, exit)
        }
      }
    },

    handleMovingFollowers:function(room, exit) {
      for (let s of this.followers) {
        const follower = w[s]
        if (follower.loc === this.loc) continue
        if (!follower.testFollowToRestrictions || follower.testFollowToRestrictions(room)) {
          if (this.player) follower.movingMsg(exit)
          follower.moveChar(room.name, this === player ? exit : undefined)
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


  return res;
}


