'use strict'
// -fixme: serious namespace pollution.
import {
  failedmsg, errormsg, printOrRun, msg /* alert */,
  commands,
  prefix, SUPPRESS_ENDTURN, SUCCESS_NO_TURNSCRIPTS, SUCCESS, FAILED, sentenceCase, display, REACHABLE,
  parser,
  game, world, w,
  lang
} from './main.js'
// Should all be language neutral (except the inspect function, which is just for debugging)

export function Cmd (name, hash) {
  this.name = name
  this.objects = []
  this.rules = []
  this.default = function (item, isMultiple, char) {
    if (typeof this.defmsg === 'string') {
      failedmsg(prefix(item, isMultiple) + this.defmsg)
    } else if (typeof this.defmsg === 'function') {
      failedmsg(prefix(item, isMultiple) + this.defmsg(char, item))
    } else {
      errormsg("No default set for command '" + this.name + "'.")
    }
    return false
  }

  // This is the default script for commands
  // Assumes a verb and an object; the verb may or may not be the first object
  this.script = function (objects, matches) {
    let success = false
    let suppressEndturn = false
    let verb
    if (objects.length > 1) verb = objects.shift()
    const multi = objects[0].length > 1 || parser.currentCommand.all
    for (let i = 0; i < objects[0].length; i++) {
      if (!objects[0][i][this.attName]) {
        this.default(objects[0][i], multi, game.player)
      } else {
        let result = this.processCommand(game.player, objects[0][i], multi, matches[0][i], verb)
        if (result === SUPPRESS_ENDTURN) {
          suppressEndturn = true
          result = true
        }
        success = result || success
      }
    }
    if (success) {
      return (this.noTurnscripts || suppressEndturn ? SUCCESS_NO_TURNSCRIPTS : SUCCESS)
    } else {
      return FAILED
    }
  }

  this.processCommand = function (char, item, multi, match, verb) {
    for (const rule of this.rules) {
      if (typeof rule !== 'function') {
        errormsg("Failed to process command '" + this.name + "' as one of its rules is not a function (see console).")
        console.log('Failed:')
        console.log(this)
        console.log(rule)
      }
      if (!rule(this, char, item, multi)) {
        return false
      }
    }
    let result = printOrRun(char, item, this.attName, { multi: multi, match: match, verb: verb })
    if (typeof result !== 'boolean' && result !== SUPPRESS_ENDTURN) {
      // Assume the author wants to return true from './main.js'
      result = true
    }
    return result
  }

  for (const key in hash) {
    this[key] = hash[key]
  }
  this.attName = this.attName ? this.attName : this.name.toLowerCase()
  for (const key in this.objects) {
    if (!this.objects[key].attName) {
      this.objects[key].attName = this.attName
    }
  }
  if (!this.regex) this.regex = lang[this.name]
}

// Use only for NPC commands that you are not giving your
// own custom script attribute. Commands must be an order to a single
// NPC in the form verb-object.
export function NpcCmd (name, hash) {
  Cmd.call(this, name, hash)
  if (!this.cmdCategory) this.cmdCategory = name
  this.script = function (objects) {
    const npc = objects[0][0]
    if (!npc.npc) {
      failedmsg(lang.not_npc(npc))
      return FAILED
    }
    let success = false; let handled
    if (objects.length !== 2) {
      errormsg('The command ' + name + ' is trying to use a facility for NPCs to do it, but there is no object list; this facility is only for commands in the form verb-object.')
      return FAILED
    }
    const multi = (objects[1].length > 1 || parser.currentCommand.all)
    for (const obj of objects[1]) {
      if (npc['getAgreement' + this.cmdCategory] && !npc['getAgreement' + this.cmdCategory](obj, this.name)) {
        // The getAgreement should give the response
        continue
      }
      if (!npc['getAgreement' + this.cmdCategory] && npc.getAgreement && !npc.getAgreement(this.cmdCategory, obj)) {
        continue
      }
      if (!obj[this.attName]) {
        this.default(obj, multi, npc)
      } else {
        let result = this.processCommand(npc, obj, multi)
        if (result === SUPPRESS_ENDTURN) {
          result = true
        }
        success = result || success
      }
    }
    if (success) {
      npc.pause()
      return (this.noTurnscripts ? SUCCESS_NO_TURNSCRIPTS : SUCCESS)
    } else {
      return FAILED
    }
  }
}

export function ExitCmd (name, dir, hash) {
  Cmd.call(this, name, hash)
  this.exitCmd = true
  this.dir = dir
  this.objects = [{ ignore: true }, { ignore: true }]
  this.script = function (objects) {
    if (!game.room.hasExit(this.dir)) {
      failedmsg(lang.not_that_way(game.player, this.dir))
      return FAILED
    } else {
      const ex = game.room[this.dir]
      if (typeof ex === 'object') {
        if (!game.player.canMove(ex, this.dir)) {
          return FAILED
        }
        const flag = ex.use(game.player, this.dir)
        if (typeof flag !== 'boolean') {
          errormsg('Exit failed to return a Boolean value, indicating success of failure; assuming success')
          return SUCCESS
        }
        return flag ? SUCCESS : FAILED
      } else {
        errormsg('Unsupported type for direction')
        return FAILED
      }
    }
  }
}

export function NpcExitCmd (name, dir, hash) {
  Cmd.call(this, name, hash)
  this.exitCmd = true
  this.dir = dir
  this.objects = [{ scope: parser.isHere, attName: 'npc' }, { ignore: true }, { ignore: true }]
  this.script = function (objects) {
    const npc = objects[0][0]
    if (!game.room.hasExit(this.dir)) {
      failedmsg(lang.not_that_way(npc, this.dir))
      return FAILED
    }
    if (!npc.canMove(game.room[this.dir], this.dir)) {
      return FAILED
    }
    if (npc.getAgreementGo && !npc.getAgreementGo(dir)) {
      return FAILED
    }
    if (!npc.getAgreementGo && npc.getAgreement && !npc.getAgreement('Go', dir)) {
      return FAILED
    } else {
      const ex = game.room[this.dir]
      if (typeof ex === 'object') {
        const flag = ex.use(npc, this.dir)
        if (flag) npc.pause()
        return flag ? SUCCESS : FAILED
      } else {
        errormsg('Unsupported type for direction')
        return FAILED
      }
    }
  }
}

export function useWithDoor (char, dir) {
  const obj = w[this.door]
  if (obj === undefined) {
    errormsg("Not found an object called '" + this.door + "'. Any exit that uses the 'useWithDoor' function must also set a 'door' attribute.")
  }
  const doorName = this.doorName ? this.doorName : 'door'
  if (!obj.closed) {
    world.setRoom(char, this.name, dir)
    return true
  }
  if (!obj.locked) {
    obj.closed = false
    msg(lang.open_and_enter(char, doorName))
    world.setRoom(char, this.name, false)
    return true
  }
  if (obj.testKeys(char)) {
    obj.closed = false
    obj.locked = false
    msg(lang.unlock_and_enter(char, doorName))
    world.setRoom(char, this.name, false)
    return true
  }
  msg(lang.try_but_locked(char, doorName))
  return false
};

// Should be called during the initialisation process
export function initCommands () {
  const newCmds = []
  commands.forEach(function (el) {
    if (el.verb) {
      el.regex = el.regex + ' #object#'
    }
    if (!(el.regex instanceof RegExp)) {
      alert('No regex for ' + el.name)
    }
    if (el.npcCmd) {
      // console.log("creating NPC command for " + el.name)
      const regexAsStr = el.regex.source.substr(1) // lose the ^ at the start, as we will prepend to it
      const objects = el.objects.slice()
      objects.unshift({ scope: parser.isHere, attName: 'npc' })

      const data = {
        objects: objects,
        attName: el.attName,
        default: el.default,
        defmsg: el.defmsg,
        rules: el.rules,
        score: el.score,
        cmdCategory: el.cmdCategory ? el.cmdCategory : el.name,
        forNpc: true
      }

      for (const key in lang.tell_to_prefixes) {
        const cmd = new NpcCmd('Npc' + el.name + key, data)
        cmd.regex = new RegExp('^' + lang.tell_to_prefixes[key] + regexAsStr)
        if (el.useThisScriptForNpcs) cmd.script = el.script
        newCmds.push(cmd)
      }
    }
  })

  commands.push.apply(commands, newCmds)

  lang.exit_list.forEach(function (el) {
    if (!el.nocmd) {
      let regex = '^(' + lang.go_pre_regex + ')(' + el.name + '|' + el.abbrev.toLowerCase()
      if (el.alt) { regex += '|' + el.alt }
      regex += ')$'
      let cmd = new ExitCmd('Go' + sentenceCase(el.name), el.name, {
        regex: new RegExp(regex)
      })
      commands.push(cmd)

      regex = '^(.+), ?(' + lang.go_pre_regex + ')(' + el.name + '|' + el.abbrev.toLowerCase()
      if (el.alt) { regex += '|' + el.alt }
      regex += ')$'
      cmd = new NpcExitCmd('NpcGo' + sentenceCase(el.name) + '1', el.name, {
        regex: new RegExp(regex)
      })
      commands.push(cmd)

      regex = '^tell (.+) to (' + lang.go_pre_regex + ')(' + el.name + '|' + el.abbrev.toLowerCase()
      if (el.alt) { regex += '|' + el.alt }
      regex += ')$'
      cmd = new NpcExitCmd('NpcGo' + sentenceCase(el.name) + '2', el.name, {
        regex: new RegExp(regex)
      })
      commands.push(cmd)
    }
  })
}

// Useful in a command's script when handling NPCs as well as the player
export function extractChar (cmd, objects) {
  let char
  if (cmd.forNpc) {
    char = objects[0][0]
    if (!char.npc) {
      failedmsg(lang.not_npc(char))
      return FAILED
    }
    objects.shift()
  } else {
    char = game.player
  }
  return char
}

export const cmdRules = {}

// Item's location is the char and it is not worn
cmdRules.isHeldNotWorn = function (cmd, char, item, isMultiple) {
  if (!item.getWorn() && item.isAtLoc(char.name, display.PARSER)) {
    return true
  }

  if (item.isAtLoc(char.name, display.PARSER)) {
    failedmsg(prefix(item, isMultiple) + lang.wearing(char, item))
    return false
  }

  if (item.loc) {
    const holder = w[item.loc]
    if (holder.npc || holder.player) {
      failedmsg(prefix(item, isMultiple) + lang.char_has_it(holder, item))
      return false
    }
  }

  failedmsg(prefix(item, isMultiple) + lang.not_carrying(char, item))
  return false
}

// Item's location is the char and it is worn
cmdRules.isWorn = function (cmd, char, item, isMultiple) {
  if (item.getWorn() && item.isAtLoc(char.name, display.PARSER)) {
    return true
  }

  if (item.isAtLoc(char.name, display.PARSER)) {
    failedmsg(prefix(item, isMultiple) + lang.not_wearing(char, item))
    return false
  }

  if (item.loc) {
    const holder = w[item.loc]
    if (holder.npc || holder.player) {
      failedmsg(prefix(item, isMultiple) + lang.char_has_it(holder, item))
      return false
    }
  }

  failedmsg(prefix(item, isMultiple) + lang.not_carrying(char, item))
  return false
}

// Item's location is the char
cmdRules.isHeld = function (cmd, char, item, isMultiple) {
  if (item.isAtLoc(char.name, display.PARSER)) {
    return true
  }

  if (item.loc) {
    const holder = w[item.loc]
    if (holder.npc || holder.player) {
      failedmsg(prefix(item, isMultiple) + lang.char_has_it(holder, item))
      return false
    }
  }

  failedmsg(prefix(item, isMultiple) + lang.not_carrying(char, item))
  return false
}

// Item's location is the char's location or the char
// or item is reachable, but not held by someone else
cmdRules.isHere = function (cmd, char, item, isMultiple) {
  if (item.isAtLoc(char.loc, display.PARSER)) return true
  if (item.isAtLoc(char.name, display.PARSER)) return true

  if (item.loc) {
    const holder = w[item.loc]
    if (holder.npc || holder.player) {
      // Has a specific location and held by someone
      failedmsg(prefix(item, isMultiple) + lang.char_has_it(holder, item))
      return false
    }
  }

  if (item.scopeStatus === REACHABLE) {
    return true
  }

  failedmsg(prefix(item, isMultiple) + lang.not_here(char, item))
  return false
}

// Item's location is the char's location or the char
// or item is reachable, but not held by someone else
cmdRules.isHereNotHeld = function (cmd, char, item, isMultiple) {
  // console.log("here")
  if (item.isAtLoc(char.loc, display.PARSER)) return true

  if (item.loc) {
    const holder = w[item.loc]
    if (holder.npc || holder.player) {
      // Has a specific location and held by someone
      failedmsg(prefix(item, isMultiple) + lang.char_has_it(holder, item))
      return false
    }
  }

  if (item.scopeStatus === REACHABLE) {
    return true
  }

  console.log('here2')
  console.log(item.scopeStatus)
  failedmsg(prefix(item, isMultiple) + lang.not_here(char, item))
  return false
}

cmdRules.canManipulate = function (cmd, char, item) {
  if (!char.canManipulate(item, cmd.name)) {
    return false
  }
  return true
}

cmdRules.canTalkTo = function (cmd, char, item) {
  if (!char.canTalk(item)) {
    return false
  }
  if (!item.npc) {
    failedmsg(prefix(item, isMultiple) + lang.not_able_to_hear(char, item))
    return false
  }
  return true
}

cmdRules.canPosture = function (cmd, char, item) {
  if (!char.canPosture(cmd.name)) {
    return false
  }
  return true
}
