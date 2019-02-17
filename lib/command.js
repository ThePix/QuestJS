"use strict";

// Should all be language neutral (except the inspect function, which is just for debugging)

function Cmd(name, hash) {
  this.name = name;
  this.objects = [];
  this.rules = [];
  this.default = function(item, isMultiple, char) { 
    if (this.defmsg) {
      msg(prefix(item, isMultiple) + this.defmsg(char, item));
    }
    else {
      errormsg("No default set for command '" + this.name + "'.");
    }
    return false;
  };
  
  // This is the default script for commands
  this.script = function(objects) {
    let success = false;
    let suppressEndturn = false
    const multi = objects[0].length > 1 || parser.currentCommand.all;
    for (let i = 0; i < objects[0].length; i++) {
      if (!objects[0][i][this.attName]) {
        this.default(objects[0][i], multi, game.player);
      }
      else {
        let result = this.processCommand(game.player, objects[0][i], multi);
        if (result === SUPPRESS_ENDTURN) {
          suppressEndturn = true;
          result = true;
        }
        success = result || success;
      }
    }
    if (success) {
      return (this.noTurnscripts || suppressEndturn ? SUCCESS_NO_TURNSCRIPTS : SUCCESS);
    }
    else {
      return FAILED; 
    }
  };
  
  this.processCommand = function(char, item, multi) {
    for (let i = 0; i < this.rules.length; i++) {
      if (typeof this.rules[i] !== "function") {
        errormsg("Failed to process command '" + this.name + "' as one of its rules (" + i + ") is not a function.");
      }
      if (!this.rules[i](char, item, multi)) {
        return false;
      }
    }
    let result = printOrRun(char, item, this.attName, multi);
    if (typeof result !== "boolean" && result !== SUPPRESS_ENDTURN) {
      // Assume the author wants to return true from the verb
      result = true;
    }
    return result;
  };
  
  for (let key in hash) {
    this[key] = hash[key];
  }
  this.attName = this.attName ? this.attName : this.name.toLowerCase();
  for (let key in this.objects) {
    if (!this.objects[key].attName) {
      this.objects[key].attName = this.attName;
    }
  }
}

// Use only for NPC commands that you are not giving your
// own custom script attribute. Commands must be an order to a single
// NPC in the form verb-object.
function NpcCmd(name, hash) {
  Cmd.call(this, name, hash);
  if (!this.shortName) this.shortName = name;
  this.script = function(objects) {
    const npc = objects[0][0];
    if (!npc.npc) {
      msg(NOT_NPC(npc));
      return FAILED; 
    }
    let success = false, handled;
    const multi = (objects[1].length > 1 || parser.currentCommand.all);
    for (let i = 0; i < objects[1].length; i++) {
      if (npc["getAgreement" + this.shortName] && !npc["getAgreement" + this.shortName](objects[1][i])) {
        // The getAgreement should give the response
        continue;
      }
      if (!npc["getAgreement" + this.shortName] && npc.getAgreement && !npc.getAgreement()) {
        continue;
      }
      if (!objects[1][i][this.attName]) {
        this.default(objects[1][i], multi, npc);
      }
      else {
        let result = this.processCommand(npc, objects[1][i], multi);
        if (result === SUPPRESS_ENDTURN) {
          result = true;
        }
        success = result || success;
      }
    }
    if (success) {
      npc.pause();
      return (this.noTurnscripts ? SUCCESS_NO_TURNSCRIPTS : SUCCESS);
    }
    else {
      return FAILED; 
    }
  };
}

function ExitCmd(name, hash) {
  Cmd.call(this, name, hash);
  this.exitCmd = true;
  this.dir = name;
  this.objects = [{ignore:true}, {ignore:true}, ],
  this.script = function(objects) {
    if (!game.room.hasExit(this.name)) {
      msg(NOT_THAT_WAY(game.player, this.name));
      return FAILED;
    }
    else {
      const ex = game.room[this.dir];
      if (typeof ex === "object"){
        const flag = ex.use(game.player, this.dir);
        if (typeof flag !== "boolean") {
          errormsg("Exit failed to return a Boolean value, indicating success of failure; assuming success");
          return SUCCESS;
        }
        return flag ? SUCCESS : FAILED;
      }
      else {
        errormsg("Unsupported type for direction");
        return FAILED;
      }
    }
  };
}

function NpcExitCmd(name, hash, dir) {
  Cmd.call(this, name, hash);
  this.exitCmd = true;
  this.dir = dir;
  this.objects = [{scope:isHere, attName:"npc"}, {ignore:true}, {ignore:true}, ],
  this.script = function(objects) {
    const npc = objects[0][0];
    if (!game.room.hasExit(this.dir)) {
      msg(NOT_THAT_WAY(npc, this.dir));
      return FAILED;
    }
    if (npc.getAgreementGo && !npc.getAgreementGo(dir)) {
      return FAILED;
    }
    if (!npc.getAgreementGo && npc.getAgreement && !npc.getAgreement()) {
      return FAILED;
    }
    else {
      const ex = game.room[this.dir];
      if (typeof ex === "object"){
        const flag = ex.use(npc, this.dir);
        if (flag) npc.pause();
        return flag ? SUCCESS : FAILED;
      }
      else {
        errormsg("Unsupported type for direction");
        return FAILED;
      }
    }
    
  };
}

function useWithDoor(char, dir) {
  const obj = w[this.door];
  if (obj === undefined) {
    errormsg("Not found an object called '" + this.door + "'. Any exit that uses the 'useWithDoor' function must also set a 'door' attribute.");
  }
  const doorName = this.doorName ? this.doorName : "door";
  if (!obj.closed) {
    world.setRoom(char, this.name, dir);
    return true;
  }
  if (!obj.locked) {
    obj.closed = false;
    msg(OPEN_AND_ENTER(char, doorName));
    world.setRoom(char, this.name, false);
    return true;
  }
  if (obj.testKeys(char)) {
    obj.closed = false;
    obj.locked = false;
    msg(UNLOCK_AND_ENTER(char, doorName));
    world.setRoom(char, this.name, false);
    return true;
  }        
  msg(TRY_BUT_LOCKED(char, doorName));
  return false;
};



  // Should be called during the initialisation process
function initCommands(EXITS) {
  const newCmds = [];
  commands.forEach(function(el) {
    if (el.verb) {
      el.regex = el.regex + " #object#";
    }
    if (!(el.regex instanceof RegExp)) {
      alert("No regex for " + el.name);
    }
    if (el.npcCmd) {
      const regexAsStr = el.regex.source.substr(1);
      const objects = el.objects.slice();
      objects.unshift({scope:isHere, attName:"npc"});
      
      let cmd = new NpcCmd("Npc" + el.name + "1", {
        regex:new RegExp("^(.+), ?" + regexAsStr),
        objects:objects,
        attName:el.attName,
        default:el.default,
        defmsg:el.defmsg,
        rules:el.rules,
        shortName:el.shortName ? el.shortName : el.name,
      });
      newCmds.push(cmd);
      
      cmd = new NpcCmd("Npc" + el.name + "2", {
        regex:new RegExp("^tell (.+) to " + regexAsStr),
        objects:objects,
        attName:el.attName,
        default:el.default,
        defmsg:el.defmsg,
        rules:el.rules,
        shortName:el.shortName ? el.shortName : el.name,
      });
      newCmds.push(cmd);
    }
  });
  
  commands.push.apply(commands, newCmds);
  
  EXITS.forEach(function(el) {
    if (!el.nocmd) {
      let regex = "^(" + GO_PRE_REGEX + ")(" + el.name + "|" + el.abbrev.toLowerCase();
      if (el.alt) { regex += "|" + el.alt; }
      regex += ")$";
      let cmd = new ExitCmd(el.name, {
        regex:new RegExp(regex),
      });
      commands.push(cmd);
      
      regex = "^(.+), ?(" + GO_PRE_REGEX + ")(" + el.name + "|" + el.abbrev.toLowerCase();
      if (el.alt) { regex += "|" + el.alt; }
      regex += ")$";
      cmd = new NpcExitCmd("Npc" + el.name + "1", {
        regex:new RegExp(regex),
      }, el.name);
      commands.push(cmd);
      
      regex = "^tell (.+) to (" + GO_PRE_REGEX + ")(" + el.name + "|" + el.abbrev.toLowerCase();
      if (el.alt) { regex += "|" + el.alt; }
      regex += ")$";
      cmd = new NpcExitCmd("Npc" + el.name + "2", {
        regex:new RegExp(regex),
      }, el.name);
      commands.push(cmd);
      
    }
  });
}


const cmdRules = {};

cmdRules.isReachableRule = function(char, item, isMultiple) {
  if (item.scopeStatus !== REACHABLE) {
    let handled = false;
    if (item.loc) {
      const cont = w[item.loc];
      if (cont.scopeStatus === REACHABLE && cont.closed) {
        msg(prefix(item, isMultiple) + INSIDE_CONTAINER(char, item, cont));
        handled = true;
      }
    }      
    if (!handled) {
      msg(prefix(item, isMultiple) + NOT_HERE(char, item));
    }
    return false;
  }
  return true;
};




cmdRules.isHeldNotWornRule = function(char, item, isMultiple) {
  if (!item.worn && item.isAtLoc(char.name)) {
    return true;
  }

  if (item.isAtLoc(char.name)) {
    msg(prefix(item, isMultiple) + WEARING(char, item));
    return false;
  }

  if (item.loc) {
    const holder = w[item.loc];
    if (holder.npc || holder.player) {
      msg(prefix(item, isMultiple) + CHAR_HAS_IT(holder, item));
      return false;
    }
  }
    
  msg(prefix(item, isMultiple) + NOT_CARRYING(char, item));
  return false;
};

cmdRules.isWornRule = function(char, item, isMultiple) {
  if (item.worn && item.isAtLoc(char.name)) {
    return true;
  }

  if (item.isAtLoc(char.name)) {
    msg(prefix(item, isMultiple) + NOT_WEARING(char, item));
    return false;
  }
  
  if (item.loc) {
    const holder = w[item.loc];
    if (holder.npc || holder.player) {
      msg(prefix(item, isMultiple) + CHAR_HAS_IT(holder, item));
      return false;
    }
  }
    
  msg(prefix(item, isMultiple) + NOT_CARRYING(char, item));
  return false;
};

cmdRules.isHeldRule = function(char, item, isMultiple) {
  if (item.isAtLoc(char.name)) {
    return true;
  }
    
  if (item.loc) {
    const holder = w[item.loc];
    if (holder.npc || holder.player) {
      msg(prefix(item, isMultiple) + CHAR_HAS_IT(holder, item));
      return false;
    }
  }
    
  msg(prefix(item, isMultiple) + NOT_CARRYING(char, item));
  return false;
};

cmdRules.isHereRule = function(char, item, isMultiple) {
  if (item.isAtLoc(char.loc)) {
    return true;
  }

  if (item.loc) {
    const holder = w[item.loc];
    if (holder.npc || holder.player) {
      // Has a specific location and held by someone
      msg(prefix(item, isMultiple) + CHAR_HAS_IT(holder, item));
      return false;
    }
  }
  
  if (item.scopeStatus === REACHABLE) {
    return true;
  }

  msg(prefix(item, isMultiple) + NOT_HERE(char, item));
  return false;
};