"use strict";

// Should all be language neutral (except the inspect function, which is just for debugging)

function Cmd(name, hash) {
  this.name = name;
  this.objects = [];
  this.rules = [];
  this.default = function(options) { falsemsg(this.defmsg, options) }
  
  // This is the default script for commands
  // Assumes a verb and an object; the verb may or may not be the first object
  this.script = function(objects) {
    let success = false;
    let suppressEndturn = false
    let verb
    if (objects.length > 1) verb = objects.shift()
    const multiple = objects[0] && (objects[0].length > 1 || parser.currentCommand.all)
    if (objects[0].length === 0) {
      metamsg(lang.nothing_msg)
      return world.FAILED; 
    }
    for (let i = 0; i < objects[0].length; i++) {
      const options = {multiple:multiple, verb:verb, char:player, item:objects[0][i]}
      if (!objects[0][i][this.attName]) {
        this.default(options);
      }
      else {
        //log(options)
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
  };
  
  this.processCommand = function(options) {
    for (let rule of this.rules) {
      if (typeof rule !== "function") {
        errormsg("Failed to process command '" + this.name + "' as one of its rules is not a function (F12 for more).");
        console.log ("Failed to process command '" + this.name + "' as one of its rules is not a function:")
        console.log (this)
        console.log (rule)
      }
      if (!rule(this, options)) {
        return false;
      }
    }
    let result = printOrRun(options.char, options.item, this.attName, options);
    if (typeof result !== "boolean" && result !== world.SUCCESS_NO_TURNSCRIPTS) {
      // Assume the author wants to return true from the verb
      result = true;
    }
    return result;
  };
  
  this.noobjecterror = function(s) {
    return lang.object_unknown_msg(s)
  }
  
  for (let key in hash) {
    this[key] = hash[key];
  }
  
  this.attName = this.attName ? this.attName : this.name.toLowerCase();
  for (let key in this.objects) {
    if (!this.objects[key].attName) {
      this.objects[key].attName = this.attName;
    }
  }
  if (!this.regex && !this.regexes) {
    this.regexes = Array.isArray(lang.regex[this.name]) ? lang.regex[this.name] : [lang.regex[this.name]]
  }
}

// Use only for NPC commands that you are not giving your
// own custom script attribute. Commands must be an order to a single
// NPC in the form verb-object.
function NpcCmd(name, hash) {
  Cmd.call(this, name, hash);
  if (!this.cmdCategory) this.cmdCategory = name;
  this.script = function(objects) {
    const npc = objects[0][0];
    if (!npc.npc) {
      failedmsg(lang.not_npc, {char:player, item:npc});
      return world.FAILED; 
    }
    let success = false, handled;
    if (objects.length !== 2) {
      errormsg("The command " + name + " is trying to use a facility for NPCs to do it, but there is no object list; this facility is only for commands in the form verb-object.");
      return world.FAILED;
    }
    const multiple = (objects[1].length > 1 || parser.currentCommand.all);
    for (let obj of objects[1]) {
      const options = {multiple:multiple, char:npc, item:obj}
      if (!npc.getAgreement(this.cmdCategory, obj, this)) continue
      if (!obj[this.attName]) {
        this.default(options);
      }
      else {
        let result = this.processCommand({multiple:multiple, char:npc, item:obj});
        if (result === world.SUCCESS_NO_TURNSCRIPTS) {
          result = true;
        }
        success = result || success;
      }
    }
    if (success) {
      npc.pause();
      return (this.noTurnscripts ? world.SUCCESS_NO_TURNSCRIPTS : world.SUCCESS);
    }
    else {
      return world.FAILED; 
    }
  };
}

function ExitCmd(name, dir, hash) {
  Cmd.call(this, name, hash);
  this.exitCmd = true;
  this.dir = dir;
  this.objects = [{special:'ignore'}, {special:'ignore'}, ],
  this.script = function(objects) {
    if (!currentLocation.hasExit(this.dir)) {
      const exitObj = lang.exit_list.find(el => el.name === this.dir )
      if (exitObj.not_that_way) return failedmsg(exitObj.not_that_way, {char:player, dir:this.dir})
      return failedmsg(lang.not_that_way, {char:player, dir:this.dir})
    }
    else {
      const ex = currentLocation[this.dir];
      if (typeof ex === "object"){

        if (!player.canMove(ex, this.dir)) {
          return world.FAILED;
        }
        if (typeof ex.use !== 'function') {
          errormsg("Exit's 'use' attribute is not a function (or does not exist). Press F12 for more.");
          console.log("Bad exit:")
          console.log(ex)
          return world.FAILED;
        }
        const flag = ex.use(player, this.dir);
        if (typeof flag !== "boolean") {
          console.warn("Exit on " + currentLocation.name + " failed to return a Boolean value, indicating success or failure; assuming success");
          return world.SUCCESS;
        }
        if (flag && ex.extraTime) game.elapsedTime += ex.extraTime
        return flag ? world.SUCCESS : world.FAILED;
      }
      else {
        errormsg("Unsupported type for direction");
        return world.FAILED;
      }
    }
  };
}

function NpcExitCmd(name, dir, hash) {
  Cmd.call(this, name, hash);
  this.exitCmd = true;
  this.dir = dir;
  this.objects = [{scope:parser.isHere, attName:"npc"}, {special:'ignore'}, {special:'ignore'}, ],
  this.script = function(objects) {
    const npc = objects[0][0]
    if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
    if (!currentLocation.hasExit(this.dir)) {
      const exitObj = lang.exit_list.find(el => el.name === this.dir )
      if (exitObj.not_that_way) return failedmsg(exitObj.not_that_way, {char:npc, dir:this.dir})
      return failedmsg(lang.not_that_way, {char:npc, dir:this.dir})
    }
    if (npc.testMove && !npc.testMove(this)) return world.FAILED
    if (!npc.getAgreement("Go", dir)) return world.FAILED

    const ex = currentLocation[this.dir];
    if (typeof ex === "object"){
      const flag = ex.use(npc, this.dir);
      if (flag) npc.pause();
      return flag ? world.SUCCESS : world.FAILED;
    }
    else {
      errormsg("Unsupported type for direction");
      return world.FAILED;
    }
  };
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
  
  commands.push.apply(commands, newCmds);
  
  for (let el of lang.exit_list) {
    if (el.type !== 'nocmd') {
      let regex = "(" + lang.go_pre_regex + ")(" + el.name + "|" + el.abbrev.toLowerCase();
      if (el.alt) { regex += "|" + el.alt; }
      regex += ")$";
      commands.push(new ExitCmd("Go" + sentenceCase(el.name), el.name, { regexes:[new RegExp("^" + regex)] }));
      
      const regexes = []
      for (let key in lang.tell_to_prefixes) {
        regexes.push(new RegExp("^" + lang.tell_to_prefixes[key] + regex))
      }
      commands.push(new NpcExitCmd("NpcGo" + sentenceCase(el.name) + "2", el.name, { regexes:regexes }))
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
cmdRules.isHere = function(cmd, options) {
  if (options.item.isAtLoc(options.char.loc, world.PARSER)) return true
  if (options.item.isAtLoc(options.char.name, world.PARSER)) return true

  if (options.item.loc) {
    options.holder = w[options.item.loc]
    // Has a specific location and held by someone
    if (options.holder.npc || options.holder.player) return falsemsg(lang.char_has_it, options)
  }
  
  if (options.item.scopeStatus === world.REACHABLE) return true

  return falsemsg(lang.not_here, options)
}

// Item's location is the char's location or the char
// or item is reachable, but not held by someone else
cmdRules.isHereNotHeld = function(cmd, options) {
  if (options.item.isAtLoc(options.char.loc, world.PARSER)) return true

  if (options.item.loc) {
    options.holder = w[options.item.loc]
    if (options.already && options.holder === options.char) return falsemsg(lang.already_have, options)
    if (options.holder.npc || options.holder.player) return falsemsg(lang.char_has_it, options)
  }
  
  if (options.item.scopeStatus === world.REACHABLE || options.item.multiLoc) return true
  return falsemsg(lang.not_here, options)
}

// Used by take to note if player already holding
cmdRules.isHereNotHeldAlready = function(cmd, options) {
  options.already = true
  return cmdRules.isHereNotHeld(cmd, options)
}


cmdRules.canManipulate = function(cmd, options) {
  if (!options.char.canManipulate(options.item, cmd.name)) return false
  return true
}

cmdRules.canTalkTo = function(cmd, options) {
  if (!options.char.canTalk(options.item)) return false
  if (!options.item.npc) return falsemsg(lang.not_able_to_hear, options)
  return true
}

cmdRules.canPosture = function(cmd, options) {
  if (!options.char.canPosture(cmd.name)) return false
  return true
}