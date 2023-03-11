"use strict";

// Should all be language neutral (except the inspect function, which is just for debugging)

class Cmd {
  constructor(name, hash) {
    this.name = name
    this.objects = []
    this.rules = []
    for (let key in hash) this[key] = hash[key]
   
    this.attName = this.attName ? this.attName : this.name.toLowerCase()
    for (let key in this.objects) {
      if (!this.objects[key].attName) this.objects[key].attName = this.attName
    }
    if (!this.regex && !this.regexes) {
      this.regexes = Array.isArray(lang.regex[this.name]) ? lang.regex[this.name] : [lang.regex[this.name]]
    }
    if (this.withScript) this.script = this.scriptWith
    commands.push(this)
  }


  default(options) { falsemsg(this.defmsg, options) }
  
  // Is this command a match at the most basic level (ignoring items, etc)
  // Also resets the command
  _test(s) {
    if (!Array.isArray(this.regexes)) console.log(this)  // it will crash in the next line!
    for (let regex of this.regexes) {
      if (regex instanceof RegExp) {
        if (regex.test(s)) {
          this.tmp = {regex:regex, mod:{}}
          return true
        }
      }
      else {
        if (regex.regex.test(s)) {
          this.tmp = {regex:regex.regex, mod:regex.mod}
          return true
        }
      }
    }
    this.tmp = { score: parser.NO_MATCH }
    return false
  }
  
  // A command can have an array of regexs, "antiRegexes" that will stop the command getting matched
  _testNot(s) {
    if (!Array.isArray(this.antiRegexes)) return true
    for (let regex of this.antiRegexes) {
      if (regex instanceof RegExp) {
        if (regex.test(s)) {
          return false
        }
      }
      else {
        if (regex.regex.test(s)) {
          return false
        }
      }
    }
    return true
  }
  
  
  // We want to see if this command is a good match to the string
  // This will involve trying to matching objects, according to the
  // values in the command
  // 
  // The results go in an attribute, tmp, that should have alreadsy been set by test,
  // and is a dictionary containing:
  //
  // objectTexts - the matched object names from the player input
  // objects - the matched objects (lists of lists ready to be disabiguated)
  // score - a rating of how good the match is
  // error - a string to report why it failed, if it did!
  //
  // objects will be an array for each object role (so PUT HAT IN BOX is two),
  // of arrays for each object listed (so GET HAT, TEAPOT AND GUN is three),
  // of possible object matches (so GET HAT is four if there are four hats in the room)
  //
  // score is a rating for how well this command matches, based on the score attribute
  // of the command itself (defaults to 10); if zero or less, this is an error
  //
  // If this does give an error, it is only reported if no command is a success
  //
  // The parameter mod allows us to change how this is done, eg if the nouns are reversed
  // and will have been set in test
  matchItems(s) {
    if (!this._test(s)) return
    if (!this._testNot(s)) return
    
    
    parser.msg("---------------------------------------------------------");
    parser.msg("* Looking at candidate: " + this.name);
    
    // this is a temporary set of data used while we parser one input
    this.tmp.objectTexts = [],
    this.tmp.objects = [],
    this.tmp.score = this.score ? this.score : 10
    this.tmp.error = undefined
    
    // Array of item positions corresponding to capture groups in the regex
    let arr = this.tmp.regex.exec(s)
    arr.shift()  // first element is the whole match, so discard
    if (this.tmp.mod.reverse) arr = arr.reverse()
    if (this.tmp.mod.reverseNotFirst) {
      const first = arr.shift()
      arr = arr.reverse()
      arr.unshift(first)
    }
    if (this.tmp.mod.func) arr = this.tmp.mod.func(arr)
    
    parser.msg("..Base score: " + this.tmp.score);

    for (let i = 0; i < arr.length; i++) {
      const cmdParams = this.objects[i]
      if (!cmdParams) {
        errormsg("The command \"" + this.name + "\" seems to have an error. It has more capture groups than there are elements in the 'objects' attribute.", true)
        return false
      }
      if (arr[i] === undefined) {
        errormsg("The command \"" + this.name + "\" seems to have an error. It has captured undefined. This is probably an issue with the command's regular expression.", true)
        return false
      }
      let score = 0;
      this.tmp.objectTexts.push(arr[i])
      
      if (cmdParams.special) {
        // this capture group has been flagged to be special
        const specialError = parser.specialText[cmdParams.special].error(arr[i], cmdParams)
        if (specialError) return this.setError(parser.BAD_SPECIAL, specialError)
        const special = parser.specialText[cmdParams.special].exec(arr[i], cmdParams)
        if (special !== false) this.tmp.objects.push(special)
        score = 1
        if (special.name) {
          parser.msg("-> special match object found: " + special.name)
        }
        else {
          parser.msg("-> special match found: " + special)
        }
      }
      
      else if (lang.all_regex.test(arr[i]) || lang.all_exclude_regex.test(arr[i])) {
        // Handle ALL and ALL BUT
        this.tmp.all = true
        if (!cmdParams.multiple) return this.setError(parser.DISALLOWED_MULTIPLE, lang.no_multiples_msg)
        if (!cmdParams.scope) console.log("WARNING: Command without scope - " + this.name)
        
        let scope = parser.getScope(cmdParams)
        let exclude = [player];
        
        // anything flagged as scenery should be excluded
        for (let item of scope) {
          if (item.scenery || item.excludeFromAll) exclude.push(item)
        }
        
        if (lang.all_exclude_regex.test(arr[i])) {
          // if this is ALL BUT we need to remove some things from the list
          // excludes must be in isVisible
          // if it is ambiguous or not recognised it does not get added to the list
          let s = arr[i].replace(all_exclude_regex, "").trim();
          const objectNames = s.split(joiner_regex).map(function(el){ return el.trim(); });
          for (let s in objectNames) {
            const items = parser.findInList(s, world.scope);
            if (items.length === 1) exclude.push(items[0])
          }
        }
        scope = scope.filter(el => !exclude.includes(el))
        if (scope.length > 1 && !cmdParams.multiple) return this.setError(parser.DISALLOWED_MULTIPLE, lang.no_multiples_msg)
        if (scope.length === 0) return this.setError(parser.NONE_FOR_ALL, this.nothingForAll ? this.nothingForAll : lang.nothing_msg)
        score = 2
        this.tmp.objects.push(scope.map(el => [el]))
      }
      
      else {
        if (!cmdParams.scope) {
          console.warn("No scope found in command. This may be because the scope specified does not exist; check the spelling. The command in question is:")
          log(this)
          parser.msg("ERROR: No scope")
          return null
        }
        const scope = parser.getScopes(cmdParams)
        parser.matchToNames(arr[i], scope, cmdParams, this.tmp)
        if (this.tmp.score === parser.NO_OBJECT) {
          this.tmp.error = this.noobjecterror(this.tmp.error_s, i)
          if (this.objects.length > 1) this.tmp.score += 10
          parser.msg("Result score is (no object): " + this.tmp.score)
          return
        }
      }
      parser.msg("...Adding to the score: " + score)
      parser.msg("Result score is: " + this.tmp.score)
      this.tmp.score += score
    }
  }  
  
  
  // If this has multiple parts the error probably takes priority
  // GET STUFF -> assume item
  // FILL JUG WITH WATER -> assume fluid
  setError(score, msg) {
    this.tmp.error = msg
    this.tmp.score = score
    if (this.objects.length > 1) this.tmp.score += 10
    parser.msg("Match failed: " + this.tmp.score + " (" + msg + ")")
  }
  
  
  
  // This is the default script for commands
  // Assumes objects is:
  // optionally the verb, a string
  // an array of objects - each object will have the attribute indicated by attName called
  // optionally an array of one object
  script(objects) {
    let success = false;
    let suppressEndturn = false
    let verb
    if (typeof objects[0] === 'string') verb = objects.shift()
    let secondItem
    if (objects.length > 1) secondItem = objects[1][0]
    const multiple = objects[0] && (objects[0].length > 1 || parser.currentCommand.all)
    if (objects[0].length === 0) {
      metamsg(lang.nothing_msg)
      return world.FAILED; 
    }
    for (let i = 0; i < objects[0].length; i++) {
      const options = {multiple:multiple, verb:verb, char:player, item:objects[0][i], secondItem:secondItem}
      const obj = objects[0][i]
      if (!obj[this.attName + '_count']) obj[this.attName + '_count'] = 0
      if (!obj[this.attName]) {
        this.default(options)
      }
      else {
        let result = this.processCommand(options);
        if (result === world.SUCCESS_NO_TURNSCRIPTS) {
          suppressEndturn = true;
          result = true;
        }
        if (result) obj[this.attName + '_count']++
        success = result || success;
      }
    }
    if (success) {
      return (this.noTurnscripts || suppressEndturn ? world.SUCCESS_NO_TURNSCRIPTS : world.SUCCESS);
    }
    else {
      return world.FAILED; 
    }
  }
 
 
  // This is the second script for commands
  // Assumes a verb and two objects; the verb may or may not be the first object
  scriptWith(objects) {
    let success = false;
    let suppressEndturn = false
    let verb
    if (objects.length > 2) verb = objects.shift()
    const multiple = objects[0] && (objects[0].length > 1 || parser.currentCommand.all)
    if (objects[0].length === 0) {
      metamsg(lang.nothing_msg)
      return world.FAILED; 
    }
    for (let i = 0; i < objects[0].length; i++) {
      const options = {multiple:multiple, verb:verb, char:player, item:objects[0][i], with:objects[1][0]}
      if (!objects[0][i][this.attName]) {
        this.default(options)
      }
      else {
        let result = this.processCommand(options);
        if (result === world.SUCCESS_NO_TURNSCRIPTS) {
          suppressEndturn = true;
          result = true;
        }
        success = result || success;
      }
    }
    if (success) {
      return (this.noTurnscripts || suppressEndturn ? world.SUCCESS_NO_TURNSCRIPTS : world.SUCCESS);
    }
    else {
      return world.FAILED; 
    }
  }

  processCommand(options) {
    for (let rule of this.rules) {
      if (typeof rule !== "function") {
        errormsg("Failed to process command '" + this.name + "' as one of its rules is not a function.")
        console.log (this)
        console.log (rule)
      }
      if (!rule(this, options)) return false
    }
    let result = printOrRun(options.char, options.item, this.attName, options);
    if (typeof result !== "boolean" && result !== world.SUCCESS_NO_TURNSCRIPTS) {
      // Assume the author wants to return true from the verb
      result = true;
    }
    return result;
  };
  
  noobjecterror(s) {
    return lang.object_unknown_msg(s)
  }
  

}

// Use only for NPC commands that you are not giving your
// own custom script attribute. Commands must be an order to a single
// NPC in the form verb-object.
class NpcCmd extends Cmd {
  constructor(name, hash) {
    super(name, hash)
    if (!this.cmdCategory) this.cmdCategory = name
  }

  script(objects) {
    const npc = objects[0][0];
    if (!npc.npc) {
      failedmsg(lang.not_npc, {char:player, item:npc})
      return world.FAILED 
    }
    let success = false, handled;
    if (objects.length !== 2) {
      errormsg("The command " + name + " is trying to use a facility for NPCs to do it, but there is no object list; this facility is only for commands in the form verb-object.")
      return world.FAILED
    }
    const multiple = (objects[1].length > 1 || parser.currentCommand.all)
    for (let obj of objects[1]) {
      const options = {multiple:multiple, char:npc, item:obj}
      if (!npc.getAgreement(this.cmdCategory, {item:obj, cmd:this})) continue
      if (!obj[this.attName]) {
        this.default(options)
      }
      else {
        let result = this.processCommand({multiple:multiple, char:npc, item:obj})
        if (result === world.SUCCESS_NO_TURNSCRIPTS) {
          result = true;
        }
        success = result || success
      }
    }
    if (success) {
      npc.pause()
      return (this.noTurnscripts ? world.SUCCESS_NO_TURNSCRIPTS : world.SUCCESS)
    }
    else {
      return world.FAILED
    }
  }
}

class ExitCmd extends Cmd {
  constructor(name, dir, hash) {
    super(name, hash)
    this.exitCmd = true
    this.dir = dir
    this.objects = [{special:'ignore'}, {special:'ignore'}, ]
  }

  script(objects) {
    if (!currentLocation.hasExit(this.dir)) {
      const exitObj = lang.exit_list.find(el => el.name === this.dir )
      if (exitObj.not_that_way) return failedmsg(exitObj.not_that_way, {char:player, dir:this.dir})
      if (settings.customNoExitMsg) return failedmsg(settings.customNoExitMsg(player, this.dir))
      return failedmsg(lang.not_that_way, {char:player, dir:this.dir})
    }
    else {
      const ex = currentLocation.getExit(this.dir);
      if (typeof ex === "object"){
        if (!player.testMove(ex)) {
          return world.FAILED
        }
        if (typeof ex.use !== 'function') {
          errormsg("Exit's 'use' attribute is not a function (or does not exist).")
          console.log("Bad exit:")
          console.log(ex)
          return world.FAILED
        }
        const flag = ex.use(player, ex)
        if (typeof flag !== "boolean") {
          console.warn("Exit on " + currentLocation.name + " failed to return a Boolean value, indicating success or failure; assuming success")
          return world.SUCCESS
        }
        if (flag && ex.extraTime) game.elapsedTime += ex.extraTime
        return flag ? world.SUCCESS : world.FAILED
      }
      else {
        errormsg("Unsupported type for direction")
        return world.FAILED
      }
    }
  }
}

class NpcExitCmd extends Cmd {
  constructor(name, dir, hash) {
    super(name, hash)
    this.exitCmd = true
    this.dir = dir
    this.objects = [{scope:parser.isHere, attName:"npc"}, {special:'ignore'}, {special:'ignore'}, ]
  }

  script(objects) {
    const npc = objects[0][0]
    if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
    if (!currentLocation.hasExit(this.dir)) {
      const exitObj = lang.exit_list.find(el => el.name === this.dir )
      if (exitObj.not_that_way) return failedmsg(exitObj.not_that_way, {char:npc, dir:this.dir})
      return failedmsg(lang.not_that_way, {char:npc, dir:this.dir})
    }

    const ex = currentLocation.getExit(this.dir)
    if (typeof ex !== "object"){
      errormsg("Unsupported type for direction")
      return world.FAILED
    }

    if (npc.testMove && !npc.testMove(ex)) return world.FAILED
    if (!npc.getAgreement("Go", {exit:ex})) return world.FAILED

    const flag = ex.use(npc, ex)
    if (flag) npc.pause()
    return flag ? world.SUCCESS : world.FAILED;
  }
}




  // Should be called during the initialisation process
function initCommands() {
  const newCmds = [];
  for (let el of commands) {
    if (!el.regexes) {
      el.regexes = [el.regex]
    }
    if (el.npcCmd) {
      if (!Array.isArray(el.regexes)) console.log(el)
      //console.log("creating NPC command for " + el.name)
      const regexAsStr = el.regexes[0].source.substr(1);  // lose the ^ at the start, as we will prepend to it
      const objects = el.objects.slice();
      objects.unshift({scope:parser.isHere, attName:"npc"});
      
      const data = {
        objects:objects,
        attName:el.attName,
        default:el.default,
        defmsg:el.defmsg,
        rules:el.rules,
        score:el.score,
        cmdCategory:el.cmdCategory ? el.cmdCategory : el.name,
        forNpc:true,
      };

      const cmd = new NpcCmd("Npc" + el.name, data)
      cmd.regexes = []
      for (let key in lang.tell_to_prefixes) {
        cmd.regexes.push(new RegExp("^" + lang.tell_to_prefixes[key] + regexAsStr))
      }
      if (el.useThisScriptForNpcs) cmd.script = el.script
      cmd.scope = []
      for (let el2 of el.objects) {
        cmd.scope.push(el2 === parser.isHeld ? parser.isHeldByNpc : el2)
        cmd.scope.push(el2 === parser.isWorn ? parser.isWornByNpc : el2)
      }
      newCmds.push(cmd)
    }
  }
  
  //commands.push.apply(commands, newCmds); ?????
  
  for (let el of lang.exit_list) {
    if (el.type !== 'nocmd') {
      let regex = "(" + lang.go_pre_regex + ")(" + el.name + "|" + el.abbrev.toLowerCase()
      if (el.alt) { regex += "|" + el.alt; }
      regex += ")$";
      new ExitCmd("Go" + sentenceCase(el.name), el.name, { regexes:[new RegExp("^" + regex)] })
      
      const regexes = []
      for (let key in lang.tell_to_prefixes) {
        regexes.push(new RegExp("^" + lang.tell_to_prefixes[key] + regex))
      }
      new NpcExitCmd("NpcGo" + sentenceCase(el.name) + "2", el.name, { regexes:regexes })
    }
  }
}


// Useful in a command's script when handling NPCs as well as the player
function extractChar(cmd, objects) {
  let char;
  if (cmd.forNpc) {
    char = objects[0][0];
    if (!char.npc) {
      failedmsg(lang.not_npc, {char:player, item:char});
      return world.FAILED; 
    }
    objects.shift();
  }
  else {
    char = player;
  }
  return char
}


function findCmd(name) {
  return commands.find(el => el.name === name)
}



function testCmd(name, s) {
  const cmd = findCmd(name)
  cmd.matchItems(s)
  log(cmd.tmp)
  metamsg("See results in console (F12)")
}




const cmdRules = {};


// Item's location is the char and it is not worn
cmdRules.isHeldNotWorn = function(cmd, options) {
  if (!options.item.getWorn() && options.item.isAtLoc(options.char.name, world.PARSER)) return true

  if (options.item.isAtLoc(options.char.name, world.PARSER)) return falsemsg(lang.already_wearing, options)

  if (options.item.loc) {
    options.holder = w[options.item.loc]
    if (options.holder.npc || options.holder.player) return falsemsg(lang.char_has_it, options)
  }
    
  return falsemsg(lang.not_carrying, options)
}

// Item's location is the char and it is worn
cmdRules.isWorn = function(cmd, options) {
  if (options.item.getWorn() && options.item.isAtLoc(options.char.name, world.PARSER)) return true

  if (options.item.isAtLoc(options.char.name, world.PARSER)) return falsemsg(lang.not_wearing, options)
  
  if (options.item.loc) {
    options.holder = w[options.item.loc];
    if (options.holder.npc || options.holder.player) return falsemsg(lang.char_has_it, options)
  }
    
  return falsemsg(lang.not_carrying, options)
}

// Item's location is the char
cmdRules.isHeld = function(cmd, options) {
  if (options.item.isAtLoc(options.char.name, world.PARSER)) return true
    
  if (options.item.loc) {
    options.holder = w[options.item.loc]
    if (options.holder.npc || options.holder.player) return falsemsg(lang.char_has_it, options)
  }
    
  return falsemsg(lang.not_carrying, options)
}

// Item's location is the char's location or the char
// or item is reachable, but not held by someone else
cmdRules.isPresent = function(cmd, options) {
  if (options.item.isAtLoc(options.char.loc, world.PARSER)) return true
  if (options.item.isAtLoc(options.char.name, world.PARSER)) return true

  if (options.item.loc) {
    options.holder = w[options.item.loc]
    // Has a specific location and held by someone
    if (options.holder.npc || options.holder.player) return falsemsg(lang.char_has_it, options)
  }
  
  if (options.item.scopeStatus.canReach) return true

  return falsemsg(lang.not_here, options)
}

// Item's location is the char's location or the char
// or item is reachable, but not held by someone else
cmdRules.isHere = function(cmd, options) {
  if (options.item.isAtLoc(options.char.loc, world.PARSER)) return true

  if (options.item.loc) {
    options.holder = w[options.item.loc]
    if (options.already && options.holder === options.char) return falsemsg(lang.already_have, options)
    if (options.holder.npc || options.holder.player) return falsemsg(lang.char_has_it, options)
  }
  
  if (options.item.scopeStatus.canReach || options.item.multiLoc) return true
  return falsemsg(lang.not_here, options)
}

// Used by take to note if player already holding
cmdRules.isHereAlready = function(cmd, options) {
  options.already = true
  return cmdRules.isHere(cmd, options)
}


// In this location or held by this char, or in a container (used by eg TAKE)
cmdRules.isPresentOrContained = function(cmd, options) {
  // use parser functions here as we do not want messages at this point
  
  if (!options.item.isAtLoc) log(options.item.name)
  if (!options.char) log(cmd.name)
  
  if (options.item.isAtLoc(options.char.name, world.PARSER)) return true;
  if (parser.isHere(options.item)) return true;

  if (options.item.loc) {
    options.holder = w[options.item.loc]
    if (options.holder && (options.holder.npc || options.holder.player)) return falsemsg(lang.char_has_it, options)
  }
  if (parser.isContained(options.item)) return true;
  return falsemsg(lang.not_here, options)
}

cmdRules.testManipulate = function(cmd, options) {
  if (!options.char.testManipulate(options.item, cmd.name)) return false
  return true
}

cmdRules.canTalkTo = function(cmd, options) {
  if (!options.char.testTalk(options.item)) return false
  if (!options.item.npc && !options.item.talker && !options.item.player) return falsemsg(lang.not_able_to_hear, options)
  return true
}

cmdRules.testPosture = function(cmd, options) {
  if (!options.char.testPosture(cmd.name)) return false
  return true
}