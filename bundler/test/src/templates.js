'use strict'
// -fixme: serious namespace pollution.
import { failedmsg, printOrRun, msg, falsemsg, debugmsg, errormsg, showMenu, INDEFINITE, prefix, SUCCESS, sentenceCase, display, formatList, scopeReachable, scopeHeldBy, DEFINITE, INFINITY, NULL_FUNC, util, game, w, world, createItem, cloneObject, lang, CONTAINER_BASE } from './main.js'
//  PLAYER, items, cloneObject

// Should all be language neutral

export const TAKEABLE_DICTIONARY = {
  getVerbs: function () {
    const verbList = this.use === undefined ? [lang.verbs.examine] : [lang.verbs.examine, lang.verbs.use]
    if (this.isAtLoc(game.player.name)) {
      verbList.push(lang.verbs.drop)
    } else {
      verbList.push(lang.verbs.take)
    }
    if (this.read) verbList.push(lang.verbs.read)
    return verbList
  },

  takeable: true,

  drop: function (isMultiple, char) {
    msg(prefix(this, isMultiple) + lang.drop_successful(char, this))
    this.moveToFrom(char.loc)
    return true
  },

  take: function (isMultiple, char) {
    if (this.isAtLoc(char.name)) {
      msg(prefix(this, isMultiple) + lang.already_have(char, this))
      return false
    }
    if (!char.canManipulate(this, 'take')) return false
    msg(prefix(this, isMultiple) + lang.take_successful(char, this))
    this.moveToFrom(char.name)
    if (this.scenery) delete this.scenery
    return true
  }

}

export const TAKEABLE = () => TAKEABLE_DICTIONARY

export const SHIFTABLE = function () {
  const res = {
    shiftable: true
  }
  return res
}

export const createEnsemble = function (name, members, dict) {
  const res = createItem(name, dict)
  res.ensemble = true
  res.members = members
  res.parsePriority = 10
  res.inventorySkip = true
  res.takeable = true
  res.getWorn = function (situation) { return this.isAtLoc(this.members[0].loc, situation) && this.members[0].getWorn() }

  res.byname = function (options) {
    if (!options) options = {}
    let s = ''
    if (options.article === DEFINITE) {
      s = lang.addDefiniteArticle(this)
    }
    if (options.article === INDEFINITE) {
      s = lang.addIndefiniteArticle(this)
    }
    s += this.alias
    if (options && options.possessive) s += "'s"
    if (this.members[0].getWorn() && options.modified && this.isAllTogether()) { s += ' (worn)' }
    if (options && options.capital) s = sentenceCase(s)
    // console.log(s)
    return s
  }

  // Tests if all parts are n the same location and either all are worn or none are worn
  // We can use this to determine if the set is together or not too
  res.isAtLoc = function (loc, situation) {
    if (situation !== display.PARSER && situation !== display.SCOPING) return false
    const worn = this.members[0].getWorn()
    for (const member of this.members) {
      if (member.loc !== loc) return false
      if (member.getWorn() !== worn) return false
    }
    return true
  }

  // Tests if all parts are together
  res.isAllTogether = function () {
    const worn = this.members[0].getWorn()
    const loc = this.members[0].loc
    for (const member of this.members) {
      if (member.loc !== loc) return false
      if (member.breakEnsemble && member.breakEnsemble()) return false
      if (member.getWorn() !== worn) return false
    }
    return true
  }

  res.drop = function (isMultiple, char) {
    msg(prefix(this, isMultiple) + lang.drop_successful(char, this))
    for (const member of this.members) {
      member.moveToFrom(char.loc)
    }
    return true
  }

  res.take = function (isMultiple, char) {
    if (this.isAtLoc(char.name)) {
      msg(prefix(this, isMultiple) + lang.already_have(char, this))
      return false
    }

    if (!char.canManipulate(this, 'take')) return false
    msg(prefix(this, isMultiple) + lang.take_successful(char, this))
    for (const member of this.members) {
      member.moveToFrom(char.name)
      if (member.scenery) delete member.scenery
    }
    return true
  }

  for (const member of members) {
    member.ensembleMaster = res
  }
  return res
}

export const MERCH = function (value, locs) {
  const res = {
    price: value,
    getPrice: function () { return this.price },

    // The price when the player sells the item
    // By default, half the "list" price
    //
    getSellingPrice: function (char) {
      if (w[char.loc].buyingValue) {
        return Math.round(this.getPrice() * (w[char.loc].buyingValue) / 100)
      }
      return Math.round(this.getPrice() / 2)
    },

    // The price when the player buys the item
    // Uses the sellingDiscount, as te shop is selling it!
    getBuyingPrice: function (char) {
      if (w[char.loc].sellingDiscount) {
        return Math.round(this.getPrice() * (100 - w[char.loc].sellingDiscount) / 100)
      }
      return this.getPrice()
    },

    isForSale: function (loc) {
      if (this.doNotClone) return (this.salesLoc === loc)
      return (this.salesLocs.includes(loc))
    },

    canBeSoldHere: function (loc) {
      return w[loc].willBuy && w[loc].willBuy(this)
    },

    purchase: function (isMultiple, char) {
      if (!this.isForSale(char.loc)) return failedmsg(prefix(this, isMultiple) + lang.cannot_purchase_here(char, this))
      const cost = this.getBuyingPrice(char)
      if (char.money < cost) return failedmsg(prefix(this, isMultiple) + lang.cannot_afford(char, this, cost))
      this.purchaseScript(isMultiple, char, cost)
    },

    purchaseScript: function (isMultiple, char, cost) {
      char.money -= cost
      msg(prefix(this, isMultiple) + lang.purchase_successful(char, this, cost))
      if (this.doNotClone) {
        this.moveToFrom(char.name, char.loc)
        delete this.salesLoc
      } else {
        cloneObject(this, char.name)
      }
      return SUCCESS
    },

    sell: function (isMultiple, char) {
      if (!this.canBeSoldHere(char.loc)) {
        return failedmsg(prefix(this, isMultiple) + lang.cannot_sell_here(char, this))
      }
      const cost = this.getSellingPrice(char)
      char.money += cost
      msg(prefix(this, isMultiple) + lang.sell_successful(char, this, cost))
      if (this.doNotClone) {
        this.moveToFrom(char.loc, char.name)
        this.salesLoc = char.loc
      }
      delete this.loc
      return SUCCESS
    }
  }
  if (!Array.isArray(locs)) {
    res.doNotClone = true
    res.salesLoc = locs
  } else {
    res.salesLocs = locs
  }
  return res
}

// countableLocs should be a dictionary, with the room name as the key, and the number there as the value
export const COUNTABLE = function (countableLocs) {
  const res = $.extend({}, TAKEABLE_DICTIONARY)
  res.countable = true
  res.countableLocs = countableLocs
  res.infinity = 'uncountable'

  res.extractNumber = function () {
    const md = /^(\d+)/.exec(this.cmdMatch)
    if (!md) { return false }
    return parseInt(md[1])
  }

  res.templatePreSave = function () {
    const l = []
    for (const key in this.countableLocs) {
      l.push(key + '=' + this.countableLocs[key])
    }
    this.customSaveCountableLocs = l.join(',')
    this.preSave()
  }

  res.templatePostLoad = function () {
    const l = this.customSaveCountableLocs.split(',')
    this.countableLocs = {}
    for (const el of l) {
      const parts = el.split('=')
      this.countableLocs[parts[0]] = parseInt(parts[1])
    }
    delete this.customSaveCountableLocs
    this.postLoad()
  }

  res.byname = function (options) {
    if (!options) options = {}
    let s = ''
    let count = options.loc ? this.countAtLoc(options.loc) : false
    if (options.count) {
      count = options.count
      s = (count === INFINITY ? this.infinity : lang.toWords(count)) + ' '
    } else if (options.article === DEFINITE) {
      s = 'the '
    } else if (options.article === INDEFINITE) {
      if (count) {
        switch (count) {
          case 1: s = 'a '; break
          case INFINITY: s = this.infinity + ' '; break
          default: s = lang.toWords(count) + ' '
        }
      } else {
        s = 'some '
      }
    }
    if (count === 1) {
      s += this.alias
    } else if (this.pluralAlias) {
      s += this.pluralAlias
    } else {
      s += this.alias + 's'
    }
    if (options && options.possessive) s += "'s"
    if (options && options.capital) s = sentenceCase(s)
    return s
  }

  res.getListAlias = function (loc) {
    return sentenceCase(this.pluralAlias ? this.pluralAlias : this.listalias + 's') + ' (' + this.countAtLoc(loc) + ')'
  }

  res.isAtLoc = function (loc, situation) {
    if (!this.countableLocs[loc]) { return false }
    if (situation === display.LOOK && this.scenery) return false
    if (situation === display.SIDE_PANE && this.scenery) return false
    return (this.countableLocs[loc] > 0)
  }

  res.countAtLoc = function (loc) {
    if (!this.countableLocs[loc]) { return 0 }
    return this.countableLocs[loc]
  }

  res.moveToFrom = function (toLoc, fromLoc, count) {
    if (!count) count = this.extractNumber()
    if (!count) count = this.countAtLoc(fromLoc)
    this.takeFrom(fromLoc, count)
    this.giveTo(toLoc, count)
  }

  res.takeFrom = function (loc, count) {
    if (this.countableLocs[loc] !== INFINITY) this.countableLocs[loc] -= count
    if (this.countableLocs[loc] <= 0) { delete this.countableLocs[loc] }
    w[loc].itemTaken(this, count)
  }

  res.giveTo = function (loc, count) {
    if (!this.countableLocs[loc]) { this.countableLocs[loc] = 0 }
    if (this.countableLocs[loc] !== INFINITY) this.countableLocs[loc] += count
    w[loc].itemDropped(this, count)
  }

  res.findSource = function (sourceLoc, tryContainers) {
    // some at the specific location, so use them
    if (this.isAtLoc(sourceLoc)) {
      return sourceLoc
    }

    if (tryContainers) {
      const containers = scopeReachable().filter(el => el.container)
      for (const container of containers) {
        if (container.closed) continue
        if (this.isAtLoc(container.name)) return container.name
      }
    }

    return false
  }

  res.take = function (isMultiple, char) {
    const sourceLoc = this.findSource(char.loc, true)
    if (!sourceLoc) {
      msg(prefix(this, isMultiple) + lang.none_here(char, this))
      return false
    }
    let n = this.extractNumber()
    const m = this.countAtLoc(sourceLoc)
    // if (m === 0) {
    //  msg(prefix(this, isMultiple) + lang.none_here(char, this));
    //  return false;
    // }

    if (!n) { n = m } // no number specified
    if (n > m) { n = m } // too big number specified

    msg(prefix(this, isMultiple) + lang.take_successful(char, this, n))
    this.takeFrom(sourceLoc, n)
    this.giveTo(char.name, n)
    if (this.scenery) delete this.scenery
    return true
  }

  res.drop = function (isMultiple, char) {
    let n = this.extractNumber()
    const m = this.countAtLoc(char.name)
    if (m === 0) {
      msg(prefix(this, isMultiple) + lang.none_held(char, this))
      return false
    }

    if (!n) { m === INFINITY ? 1 : n = m } // no number specified
    if (n > m) { n = m } // too big number specified

    msg(prefix(this, isMultiple) + lang.drop_successful(char, this, n))
    this.takeFrom(char.name, n)
    this.giveTo(char.loc, n)
    return true
  }

  return res
}

export const WEARABLE = function (wear_layer, slots) {
  const res = $.extend({}, TAKEABLE_DICTIONARY)
  res.wearable = true
  res.wear_layer = wear_layer || false
  res.slots = slots && wear_layer ? slots : []

  res.getSlots = function () { return this.slots }
  res.getWorn = function () { return this.worn }

  res.getVerbs = function () {
    if (!this.isAtLoc(game.player.name)) {
      return [lang.verbs.examine, lang.verbs.take]
    } else if (this.getWorn()) {
      if (this.getWearRemoveBlocker(game.player, false)) {
        return [lang.verbs.examine]
      } else {
        return [lang.verbs.examine, lang.verbs.remove]
      }
    } else {
      if (this.getWearRemoveBlocker(game.player, true)) {
        return [lang.verbs.examine, lang.verbs.drop]
      } else {
        return [lang.verbs.examine, lang.verbs.drop, lang.verbs.wear]
      }
    }
  }

  res.icon = () => '<img src="images/garment12.png" />'

  res.getWearRemoveBlocker = function (char, toWear) {
    if (!this.wear_layer) { return false }
    const slots = this.getSlots()
    for (const slot of slots) {
      const outer = char.getOuterWearable(slot)
      if (outer && outer !== this && (outer.wear_layer >= this.wear_layer || outer.wear_layer === 0)) {
        return outer
      }
    }
    return false
  }

  res.canWearRemove = function (char, toWear) {
    const garment = this.getWearRemoveBlocker(char, toWear)
    if (garment) {
      if (toWear) {
        msg(lang.cannot_wear_over(char, this, garment))
      } else {
        msg(lang.cannot_remove_under(char, this, garment))
      }
      return false
    }
    return true
  }

  // Assumes the item is already held
  res.wear = function (isMultiple, char) {
    if (!this.canWearRemove(char, true)) { return false }
    if (!char.canManipulate(this, 'wear')) { return false }
    msg(prefix(this, isMultiple) + this.wearMsg(char, this), { garment: this, actor: char })
    this.worn = true
    if (this.afterWear) this.afterWear(char)
    return true
  }
  res.wearMsg = lang.wear_successful

  // Assumes the item is already held
  res.remove = function (isMultiple, char) {
    if (!this.canWearRemove(char, false)) { return false }
    if (!char.canManipulate(this, 'remove')) { return false }
    msg(prefix(this, isMultiple) + this.removeMsg(char, this), { garment: this, actor: char })
    this.worn = false
    if (this.afterRemove) this.afterRemove(char)
    return true
  }
  res.removeMsg = lang.remove_successful

  res.byname = function (options) {
    if (!options) options = {}
    let s = ''
    if (options.article === DEFINITE) {
      s = lang.addDefiniteArticle(this)
    }
    if (options.article === INDEFINITE) {
      s = lang.addIndefiniteArticle(this)
    }
    s += this.alias
    if (options && options.possessive) s += "'s"
    if (this.worn && options.modified && (this.isAtLoc(game.player.name))) { s += ' (worn)' }
    if (options && options.capital) s = sentenceCase(s)
    return s
  }

  return res
}

export const CONTAINER = function (openable) {
  const res = CONTAINER_BASE
  res.closed = openable
  res.openable = openable
  res.contentsType = 'container'
  res.listContents = util.listContents
  res.transparent = false

  res.getVerbs = function () {
    const arr = [lang.verbs.examine]
    if (this.takeable) {
      arr.push(this.isAtLoc(game.player.name) ? lang.verbs.drop : lang.verbs.take)
    }
    if (this.openable) {
      arr.push(this.closed ? lang.verbs.open : lang.verbs.close)
    }
    return arr
  }

  res.byname = function (options) {
    if (!options) options = {}
    let prefix = ''
    if (options.article === DEFINITE) {
      prefix = lang.addDefiniteArticle(this)
    }
    if (options.article === INDEFINITE) {
      prefix = lang.addIndefiniteArticle(this)
    }
    const contents = this.getContents(display.LOOK)
    let s = prefix + this.alias
    if (options && options.possessive) s += "'s"
    if (contents.length > 0 && options.modified && (!this.closed || this.transparent)) {
      s += ' (' + lang.contentsForData[this.contentsType].prefix + this.listContents(contents) + lang.contentsForData[this.contentsType].suffix + ')'
    }
    if (options && options.capital) s = sentenceCase(s)
    return s
  }

  res.lookinside = function (isMultiple, char) {
    if (this.closed && !this.transparent) {
      msg(prefix(this, isMultiple) + lang.nothing_inside(char))
      return false
    }
    msg(prefix(this, isMultiple) + lang.look_inside(char, this))
    return true
  }

  res.open = function (isMultiple, char) {
    if (!this.openable) {
      msg(prefix(this, isMultiple) + lang.cannot_open(char, this))
      return false
    } else if (!this.closed) {
      msg(prefix(this, isMultiple) + lang.already(this))
      return false
    }
    if (this.locked) {
      if (this.testKeys(char)) {
        this.closed = false
        msg(prefix(this, isMultiple) + lang.unlock_successful(char, this))
        this.openMsg(isMultiple, char)
        return true
      } else {
        msg(prefix(this, isMultiple) + lang.locked(char, this))
        return false
      }
    }
    this.closed = false
    this.openMsg(isMultiple, char)
    return true
  }

  res.openMsg = function (isMultiple, char) {
    msg(prefix(this, isMultiple) + lang.open_successful(char, this))
  }

  res.close = function (isMultiple, char) {
    if (!this.openable) {
      msg(prefix(this, isMultiple) + lang.cannot_close(char, this))
      return false
    } else if (this.closed) {
      msg(prefix(this, isMultiple) + lang.already(this))
      return false
    }
    this.hereVerbs = ['Examine', 'Open']
    this.closed = true
    this.closeMsg(isMultiple, char)
    return true
  }

  res.closeMsg = function (isMultiple, char) {
    msg(prefix(this, isMultiple) + lang.close_successful(char, this))
  }

  res.icon = function () {
    return ('<img src="images/' + (this.closed ? 'closed' : 'opened') + '12.png" />')
  }

  res.canReachThrough = function () { return !this.closed }
  res.canSeeThrough = function () { return !this.closed || this.transparent }

  return res
}

export const SURFACE = function () {
  const res = CONTAINER_BASE
  res.closed = false
  res.openable = false
  res.byname = CONTAINER().byname
  res.listContents = util.listContents
  res.contentsType = 'surface'
  res.canReachThrough = () => true
  res.canSeeThrough = () => true
  return res
}

export const OPENABLE = function (alreadyOpen) {
  const res = {}
  res.closed = !alreadyOpen
  res.openable = true

  res.getVerbs = function () {
    const arr = [lang.verbs.examine]
    if (this.takeable) {
      arr.push(this.isAtLoc(game.player.name) ? lang.verbs.drop : lang.verbs.take)
    }
    arr.push(this.closed ? lang.verbs.open : lang.verbs.close)
    return arr
  }

  res.byname = function (options) {
    if (!options) options = {}
    let s = ''
    if (options.article === DEFINITE) {
      s = lang.addDefiniteArticle(this)
    }
    if (options.article === INDEFINITE) {
      s = lang.addIndefiniteArticle(this)
    }
    s += this.alias
    if (options && options.possessive) s += "'s"
    if (!this.closed && options.modified) { s += ' (open)' }
    return s
    if (options && options.capital) s = sentenceCase(s)
  }

  const c = CONTAINER()
  res.open = c.open
  res.close = c.close
  res.openMsg = c.openMsg
  res.closeMsg = c.closeMsg
  return res
}

export const locked_WITH = function (keyNames) {
  if (typeof keyNames === 'string') { keyNames = [keyNames] }
  if (keyNames === undefined) { keyNames = [] }
  const res = {
    keyNames: keyNames,
    locked: true,
    lock: function (isMultiple, char) {
      if (this.locked) {
        msg(already(this))
        return false
      }
      if (!this.testKeys(char, true)) {
        msg(no_key(char, this))
        return false
      }
      if (!this.closed) {
        this.closed = true
        msg(close_successful(char, this))
      }
      msg(lock_successful(char, this))
      this.locked = true
      return true
    },
    unlock: function (isMultiple, char) {
      if (!this.locked) {
        msg(already(this))
        return false
      }
      if (!this.testKeys(char, false)) {
        msg(no_key(char, this))
        return false
      }
      msg(unlock_successful(char, this))
      this.locked = false
      return true
    },
    testKeys: function (char, toLock) {
      for (const s of keyNames) {
        if (!w[s]) {
          errormsg('The key name for this container, `' + s + '`, does not match any key in the game.')
          return false
        }
        if (w[s].isAtLoc(char.name)) {
          return true
        }
      }
      return false
    }
  }
  return res
}

export const FURNITURE = function (options) {
  const res = {
    testForPosture: (char, posture) => true,
    getoff: function (isMultiple, char) {
      if (!char.posture) {
        char.msg(already(char))
        return false
      }
      if (char.posture) {
        char.msg(lang.stop_posture(char)) // stop_posture handles details
        return true
      }
    }
  }
  res.assumePosture = function (isMultiple, char, posture, success_msg, adverb) {
    if (char.posture === posture && char.postureFurniture === this.name) {
      char.msg(already(char))
      return false
    }
    if (!this.testForPosture(char, posture)) {
      return false
    }
    if (char.posture) {
      char.msg(stop_posture(char))
    }
    char.posture = posture
    char.postureFurniture = this.name
    char.postureAdverb = adverb === undefined ? 'on' : adverb
    char.msg(success_msg(char, this))
    if (typeof this['on' + posture] === 'function') this['on' + posture](char)
    return true
  }
  if (options.sit) {
    res.siton = function (isMultiple, char) {
      return this.assumePosture(isMultiple, char, 'sitting', lang.sit_on_successful)
    }
  }
  if (options.stand) {
    res.standon = function (isMultiple, char) {
      return this.assumePosture(isMultiple, char, 'standing', lang.stand_on_successful)
    }
  }
  if (options.recline) {
    res.reclineon = function (isMultiple, char) {
      return this.assumePosture(isMultiple, char, 'reclining', lang.recline_on_successful)
    }
  }

  return res
}

export const SWITCHABLE = function (alreadyOn) {
  const res = {}
  res.switchedon = alreadyOn

  res.getVerbs = function () {
    const arr = [lang.verbs.examine]
    if (this.takeable) {
      arr.push(this.isAtLoc(game.player.name) ? lang.verbs.drop : lang.verbs.take)
    }
    arr.push(this.switchedon ? lang.verbs.switchoff : lang.verbs.switchon)
    return arr
  }

  res.switchon = function (isMultiple, char) {
    if (this.switchedon) {
      char.msg(prefix(this, isMultiple) + lang.already(this))
      return false
    }
    if (!this.checkCanSwitchOn()) {
      return false
    }
    char.msg(lang.turn_on_successful(char, this))
    this.doSwitchon()
    return true
  }

  res.doSwitchon = function () {
    const lighting = game.dark
    this.switchedon = true
    game.update()
    if (lighting !== game.dark) {
      game.room.description()
    }
  }

  res.checkCanSwitchOn = () => true

  res.switchoff = function (isMultiple, char) {
    if (!this.switchedon) {
      char.msg(prefix(this, isMultiple) + lang.already(this))
      return false
    }
    char.msg(lang.turn_off_successful(char, this))
    this.doSwitchoff()
    return true
  }

  res.doSwitchoff = function () {
    const lighting = game.dark
    this.switchedon = false
    game.update()
    if (lighting !== game.dark) {
      game.room.description()
    }
  }

  return res
}

// Ideally Quest will check components when doing a command for the whole
// I think?

export const COMPONENT = function (nameOfWhole) {
  const res = {
    scenery: true,
    component: true,
    loc: nameOfWhole,
    takeable: true, // Set this as it has its own take attribute
    isAtLoc: function (loc, situation) {
      if (typeof loc !== 'string') loc = loc.name
      if (situation !== display.PARSER) return false
      const cont = w[this.loc]
      if (cont.isAtLoc(loc)) { return true }
      return cont.isAtLoc(loc)
    },
    take: function (isMultiple, char) {
      msg(prefix(this, isMultiple) + lang.cannot_take_component(char, this))
      return false
    }
  }
  if (!w[nameOfWhole]) debugmsg('Whole is not define: ' + nameOfWhole)
  w[nameOfWhole].componentHolder = true
  return res
}

export const EDIBLE = function (isLiquid) {
  const res = $.extend({}, TAKEABLE_DICTIONARY)
  res.isLiquid = isLiquid
  res.eat = function (isMultiple, char) {
    if (this.isLiquid) {
      msg(prefix(this, isMultiple) + lang.cannot_eat(char, this))
      return false
    }
    msg(prefix(this, isMultiple) + lang.eat_successful(char, this))
    this.loc = null
    if (this.onIngesting) this.onIngesting(char)
    return true
  }
  res.drink = function (isMultiple, char) {
    if (!this.isLiquid) {
      msg(prefix(this, isMultiple) + lang.cannot_drink(char, this))
      return false
    }
    msg(prefix(this, isMultiple) + lang.drink_successful(char, this))
    this.loc = null
    if (this.onIngesting) this.onIngesting(char)
    return true
  }
  res.ingest = function (isMultiple, char) {
    if (this.isLiquid) {
      return this.drink(isMultiple, char)
    } else {
      return this.eat(isMultiple, char)
    }
  }
  res.getVerbs = function () {
    const arr = [lang.verbs.examine]
    if (this.isAtLoc(game.player.name)) {
      return [lang.verbs.examine, lang.verbs.drop, this.isLiquid ? lang.verbs.drink : lang.verbs.eat]
    } else {
      return [lang.verbs.examine, lang.verbs.take]
    }
  }
  return res
}

export const VESSEL = function (capacity) {
  const res = {}
  res.vessel = true
  res.containedLiquidName = false
  res.volumeContained = 0
  res.capacity = capacity

  res.byname = function (options) {
    if (!options) options = {}
    let s = ''
    if (options.article === DEFINITE) {
      s = lang.addDefiniteArticle(this)
    }
    if (options.article === INDEFINITE) {
      s = lang.addIndefiniteArticle(this)
    }
    s += this.alias
    if (options && options.possessive) s += "'s"
    if (options.modified && this.volumeContained && this.volumeContained > 0) {
      if (this.volumeContained >= this.capacity) {
        s += ' (full of ' + this.containedLiquidName + ')'
      } else {
        s += ' (' + this.volumeContained + ' ' + VOLUME_UNITS + ' ' + this.containedLiquidName + ')'
      }
    }
    if (options && options.capital) s = sentenceCase(s)
    return s
  }

  res.fill = function (isMultiple, char, liquid) {
    if (this.testRestrictions && !this.testRestrictions(liquid, char)) return false
    const source = liquid.source(char)
    if (!source) return falsemsg(lang.none_here(char, liquid))
    if (!this.mix && this.containedLiquidName !== liquid.name && this.volumeContained > 0) return falsemsg(lang.cannot_mix(char, this))
    if (this.volumeContained >= this.capacity) return falsemsg(prefix(this, isMultiple) + lang.already(this))

    let volumeAdded = this.capacity - this.volumeContained
    // limited volume available?
    if (source.getVolume) {
      const volumeAvailable = source.getVoume(liquid)
      if (volumeAvailable < volumeAdded) {
        volumeAdded = volumeAvailable
      }
    }
    if (this.mix && liquid.name !== this.containedLiquidName !== liquid.name) {
      this.mix(liquid, volumeAdded)
    } else {
      this.volumeContained += volumeAdded
      // Slight concerned that JavaScript using floats for everything means you could have a vessel 99.99% full, but that
      // does not behave as a full vessel, so if the vessel is pretty much full set the volume contained to the capacity
      if (this.volumeContained * 1.01 > this.capacity) this.volumeContained = this.capacity
      this.containedLiquidName = liquid.name
      msg(prefix(this, isMultiple) + lang.fill_successful(char, this))
      if (this.putInResponse) this.putInResponse()
    }
    return true
  }

  res.empty = function (isMultiple, char) {
    if (this.volumeContained >= this.capacity) {
      msg(prefix(this, isMultiple) + lang.already(this))
      return false
    }
    // check if liquid available
    msg(prefix(this, isMultiple) + lang.empty_successful(char, this))
    return true
  }

  return res
}

// If locs changes, that changes are not saved!!!

// A room or item can be a source of one liquid by giving it a "isSourceOf" function:
// room.isSourceOf("water")
//

export const LIQUID = function (locs) {
  const res = EDIBLE(true)
  res.liquid = true
  res.pronouns = lang.pronouns.massnoun
  res.pluralAlias = '*'
  res.drink = function (isMultiple, char, options) {
    msg(prefix(this, isMultiple) + 'drink: ' + options.verb + ' char: ' + char.name)
  }
  res.sourcedAtLoc = function (loc) {
    if (typeof loc !== 'string') loc = loc.name
    return w[loc].isSourceOf(this.name)
  }
  res.source = function (chr) {
    if (chr === undefined) chr = game.player
    // Is character a source?
    if (chr.isSourceOf && chr.isSourceOf(this.name)) return chr
    // Is the room a source?
    if (w[chr.loc].isSourceOf && w[chr.loc].isSourceOf(this.name)) return w[chr.loc]
    const items = scopeHeldBy(chr).concat(scopeHeldBy(chr.loc))
    for (const obj of items) {
      if (obj.isSourceOf && obj.isSourceOf(this.name)) return obj
    }
    return false
  }
  res.isAtLoc = function (loc) { return false }
  return res
}

export const TRANSIT_BUTTON = function (nameOfTransit) {
  const res = {
    loc: nameOfTransit,
    transitButton: true,
    getVerbs: function () { return [lang.verbs.examine, 'Push'] },
    push: function () {
      const transit = w[this.loc]
      const exit = transit[transit.transitDoorDir]
      if (this.locked) {
        printOrRun(game.player, this, 'transitLocked')
        return false
      } else if (exit.name === this.transitDest) {
        printOrRun(game.player, this, 'transitAlreadyHere')
        return false
      } else {
        printOrRun(game.player, this, 'transitGoToDest')
        if (typeof w[this.loc].transitOnMove === 'function') w[this.loc].transitOnMove(this.transitDest, exit.name)
        exit.name = this.transitDest
        return true
      }
    }
  }
  return res
}

// This is for rooms
export const TRANSIT = function (exitDir) {
  const res = {
    saveExitDests: true,
    transitDoorDir: exitDir,
    beforeEnter: function () {
      this[this.transitDoorDir].name = game.player.previousLoc
    },
    getTransitButtons: function (includeHidden, includeLocked) {
      return this.getContents(display.LOOK).filter(function (el) {
        if (!el.transitButton) return false
        if (!includeHidden && el.hidden) return false
        if (!includeLocked && el.locked) return false
        return true
      })
    }
  }
  return res
}

// This function is useful only to the TRANSIT template so is here
export function transitOfferMenu () {
  if (typeof this.transitCheck === 'function' && !this.transitCheck()) {
    if (this.transitAutoMove) world.setRoom(game.player, game.player.previousLoc, this.transitDoorDir)
    return false
  }
  const buttons = this.getTransitButtons(true, false)
  const transitDoorDir = this.transitDoorDir
  const room = this
  showMenu(this.transitMenuPrompt, buttons.map(el => el.transitDestAlias), function (result) {
    for (const button of buttons) {
      if (buttons[i].transitDestAlias === result) {
        if (room[transitDoorDir].name === button.transitDest) {
          printOrRun(game.player, button, 'transitAlreadyHere')
        } else {
          printOrRun(game.player, button, 'transitGoToDest')
          if (typeof room.transitOnMove === 'function') room.transitOnMove(button.transitDest, room[transitDoorDir].name)
        }

        room[transitDoorDir].name = button.transitDest
        if (room.transitAutoMove) world.setRoom(game.player, button.transitDest, room[transitDoorDir])
      }
    }
  })
}

export const PLAYER = function () {
  const res = {
    pronouns: lang.pronouns.secondperson,
    player: true,
    // The following are used also by NPCs, so we can use the same functions for both
    canReachThrough: () => true,
    canSeeThrough: () => true,
    getAgreement: () => true,
    getContents: CONTAINER_BASE.getContents,
    pause: NULL_FUNC,
    canManipulate: () => true,
    canMove: () => true,
    canTalk: () => true,
    canPosture: () => true,
    canTakeDrop: () => true,
    mentionedTopics: [],

    getHolding: function () {
      return this.getContents(display.LOOK).filter(function (el) { return !el.getWorn() })
    },

    getWearing: function () {
      return this.getContents(display.LOOK).filter(function (el) { return el.getWorn() && !el.ensemble })
    },

    getStatusDesc: function () {
      if (!this.posture) return false
      return this.posture + ' ' + this.postureAdverb + ' ' + w[this.postureFurniture].byname({ article: DEFINITE })
    },

    isAtLoc: function (loc, situation) {
      if (situation === display.LOOK) return false
      if (situation === display.SIDE_PANE) return false
      if (typeof loc !== 'string') loc = loc.name
      return (this.loc === loc)
    },

    getOuterWearable: function (slot) {
      /*
      console.log("---------------------------")
      console.log(this.name);
      console.log(scope(isWornBy, {npc:this}));
      console.log(scope(isWornBy, {npc:this}).filter(el => el.getSlots().includes(slot)));
      */

      const clothing = this.getWearing().filter(function (el) {
        if (typeof el.getSlots !== 'function') {
          console.log('Item with worn set to true, but no getSlots function')
          console.log(el)
        }
        return el.getSlots().includes(slot)
      })

      if (clothing.length === 0) { return false }
      let outer = clothing[0]
      for (const garment of clothing) {
        if (garment.wear_layer > outer.wear_layer) {
          outer = garment
        }
      }
      return outer
    },

    // Also used by NPCs, so has to allow for that
    msg: function (s, params) {
      msg(s, params)
    },
    byname: function (options) {
    // console.log("npc byname " + this.name)
      if (options === undefined) options = {}

      if (this.pronouns === lang.pronouns.firstperson || this.pronouns === lang.pronouns.secondperson) {
        let s = options.possessive ? this.pronouns.poss_adj : this.pronouns.subjective
        if (options.capital) {
          s = sentenceCase(s)
        }
        return s
      }

      if (options.group && this.followers.length > 0) {
        options.group = false
        options.lastJoiner = lang.list_and
        this.followers.unshift(this)
        let s = formatList(this.followers, options)
        this.followers.shift()
        if (options && options.possessive) s += "'s"
        if (options && options.capital) s = sentenceCase(s)
        return s
      }

      let s = this.alias
      if (options.article === DEFINITE) {
        s = lang.addDefiniteArticle(this) + this.alias
      }
      if (options.article === INDEFINITE) {
        s = lang.addIndefiniteArticle(this) + this.alias
      }

      const state = this.getStatusDesc()
      const held = this.getHolding()
      const worn = this.getWearingVisible()
      if (options.modified) {
        const list = []
        if (state) {
          list.push(state)
        }
        if (held.length > 0) {
          list.push('holding ' + formatList(held, { article: INDEFINITE, lastJoiner: lang.list_and, modified: false, nothing: lang.list_nothing, loc: this.name, npc: true }))
        }
        if (worn.length > 0) {
          list.push('wearing ' + formatList(worn, { article: INDEFINITE, lastJoiner: lang.list_and, modified: false, nothing: lang.list_nothing, loc: this.name, npc: true }))
        }
        if (list.length > 0) s += ' (' + formatList(list, { lastJoiner: ';' + lang.list_and, sep: ';' }) + ')'
      }

      if (options && options.possessive) {
        if (this.pronouns.possessive_name) {
          s = this.pronouns.possessive_name
        } else {
          s += "'s"
        }
      }
      if (options && options.capital) s = sentenceCase(s)
      return s
    }

  }
  return res
}
