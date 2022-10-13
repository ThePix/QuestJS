"use strict"

createItem("me", PLAYER(), {
  loc:"kitchen",
  synonyms:['me', 'myself'],
  examine: "Just a regular guy.",
})

createRoom("kitchen", {
  desc:"The kitchen is boring, the author really needs to put stuff in it.",
})


createItem("big_kitchen_table", SURFACE(), {
  loc:"kitchen",
  examine: "A Formica table.",
})

createItem("little_coffee_table", SURFACE(), {
  loc:"kitchen",
  examine: "A Formica table.",
})



createItem("bottle", TAKEABLE(), {
  examine:"A potion bottle, with a label that reads \"Drink me\".",
  countable:true,
  states:['full', 'empty'],
  countableLocs_full:{kitchen:5},
  countableLocs_empty:{me:2},
  multiLoc:true,
  defaultToAll:true,


  isUltimatelyHeldBy:function(obj, state) {
    const locs = []
    if (state) {
      for (const key in this.countableLocs) {
        if (this['countableLocs_' + state][key]) locs.push(key)
      }
    }
    else {
      for (const st of this.states) {
        for (const key in this.countableLocs) {
          if (this['countableLocs_' + state][key]) locs.push(key)
        }
      }
    }
    return util.multiIsUltimatelyHeldBy(obj, locs) 
  },

  extractNumber:function() {
    const md = /^(\d+)/.exec(this.cmdMatch)
    if (!md) { return false }
    return parseInt(md[1])
  },
  
  beforeSaveForTemplate:function() {
    for (const st of this.states) {
      const l = []
      for (let key in this['countableLocs_' + st]) {
        l.push(key + "=" + this['countableLocs_' + st][key])
      }
      this['customSaveCountableLocs_' + st] = l.join(",")
    }
    this.beforeSave()
  },

  afterLoadForTemplate:function() {
    for (const st of this.states) {
      const l = this['customSaveCountableLocs_' + st].split(",")
      this['countableLocs_' + st] = {}
      for (let el of l) {
        const parts = el.split("=")
        this['countableLocs_' + st][parts[0]] = parseInt(parts[1])
      }
      this['customSaveCountableLocs_' + st] = false
    }
    this.afterLoad()
  },

  getListAlias = function(loc) {
    return sentenceCase(this.pluralAlias) + " (" + this.countAtLoc(loc) + ")"
  },
  
  isLocatedAt:function(loc, situation) {
    let flag = false
    for (const st of this.states) {
      if (!this['countableLocs_' + st][loc]) { flag = true }
    }
    if (!flag) return false
    return (this.countableLocs[loc] > 0 || this.countableLocs[loc] === 'infinity');
  },

  countAtLoc:function(loc) {
    if (typeof loc !== 'string') loc = loc.name
    if (!this.countableLocs[loc]) { return 0; }
    return this.countableLocs[loc];
  },
  
  moveToFrom:function(options, toLoc, fromLoc) {
    util.setToFrom(options, toLoc, fromLoc)
    let count = options.count ? options.count : this.extractNumber()
    if (!count) count = options.fromLoc === player.name ? 1 : this.countAtLoc(options.fromLoc)
    if (count === 'infinity') count = 1
    this.takeFrom(options.fromLoc, count)
    this.giveTo(options.toLoc, count)
  },
  
  takeFrom:function(loc, count) {
    if (this.countableLocs[loc] !== 'infinity') this.countableLocs[loc] -= count
    if (this.countableLocs[loc] <= 0) delete this.countableLocs[loc]
    w[loc].afterDropIn(player, {item:this, count:count})
  },
  
  giveTo:function(loc, count) {
    if (!this.countableLocs[loc]) { this.countableLocs[loc] = 0; }
    if (this.countableLocs[loc] !== 'infinity') this.countableLocs[loc] += count;
    w[loc].afterDropIn(player, {item:this, count:count});
  },
  
  findSource:function(sourceLoc, tryContainers) {
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
  },


  getTakeDropCount:function(options, loc) {
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
  },

  // As this is flagged as multiLoc, need to take special care about where the thing is
  take:function(options) {
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
  },

  drop:function(options) {
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
  },

  afterCreation:function(o) {
    if (!o.regex) o.regex = new RegExp("^(\\d+ )?" + o.name + "s?$")
  },
*/


})
