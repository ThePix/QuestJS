"use strict";

// Should all be language neutral (except the inspect function, which is just for debugging)

function Cmd(name, hash) {
  this.name = name;
  this.objects = [];
  this.rules = [];
  this.default = function() { errormsg(ERR_GAME_BUG, ERR_NO_DEFAULT(this.name)); };
  // This is the default script for commands
  this.script = function(objects) {
    var success = false;
    var multi = objects[0].length > 1 || parser.currentCommand.all;
    for (var i = 0; i < objects[0].length; i++) {
      if (!objects[0][i][this.attName]) {
        this.default(objects[0][i], multi, game.player);
      }
      else {
        var result = this.processCommand(game.player, objects[0][i], multi);
        success = result || success;
      }
    }
    if (success) {
      return (this.noTurnscripts ? SUCCESS_NO_TURNSCRIPTS : SUCCESS);
    }
    else {
      return FAILED; 
    }
  };
  this.processCommand = function(char, item, multi) {
    for (var i = 0; i < this.rules.length; i++) {
      if (typeof this.rules[i] !== "function") {
        errormsg(ERR_GAME_BUG, ERR_CMD_RULE_NOT_FUNCTION(this, i));
      }
      if (!this.rules[i](char, item, multi)) {
        return false;
      }
    }
    return printOrRun(char, item, this.attName, multi);
  };
  for (var key in hash) {
    this[key] = hash[key];
  }
  this.attName = this.attName ? this.attName : this.name.toLowerCase();
  for (key in this.objects) {
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
    var npc = objects[0][0];
    if (!npc.npc) {
      msg(CMD_NOT_NPC(npc));
      return FAILED; 
    }
    var success = false, handled;
    var multi = (objects[1].length > 1 || parser.currentCommand.all);
    for (var i = 0; i < objects[1].length; i++) {
      if (npc["getAgreement" + this.shortName] && !npc["getAgreement" + this.shortName](objects[1][i])) {
        continue;
      }
      if (!npc["getAgreement" + this.shortName] && npc.getAgreement && !npc.getAgreement()) {
        continue;
      }
      if (!objects[1][i][this.attName]) {
        this.default(objects[1][i], multi, npc);
      }
      else {
        var result = this.processCommand(npc, objects[1][i], multi);
        success = result || success;
      }
    }
    if (success) {
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
  this.objects = [{ignore:true}, {ignore:true}, ],
  this.script = function(objects) {
    if (!hasExit(game.room, this.name)) {
      msg(CMD_NOT_THAT_WAY(game.player, this.name));
      return FAILED;
    }
    else {
      var ex = game.room[this.name];
      if (typeof ex !== "object"){
        errormsg(ERR_GAME_BUG, CMD_UNSUPPORTED_DIR);
        return FAILED;
      }        
      var flag = ex.use(game.player, this.name);
      return flag ? SUCCESS : FAILED;
    }
  };
}

function NpcExitCmd(name, hash, dir) {
  Cmd.call(this, name, hash);
  this.exitCmd = true;
  this.dir = dir;
  this.objects = [{scope:isNpcHere, attName:"npc"}, {ignore:true}, {ignore:true}, ],
  this.script = function(objects) {
    var npc = objects[0][0];
    var handled = false;
    if (!hasExit(game.room, this.dir)) {
      msg(CMD_NOT_THAT_WAY(npc, this.dir));
      return FAILED;
    }
    if (npc.getAgreementGo && !npc.getAgreementGo(dir)) {
      return FAILED;
    }
    if (!npc.getAgreementGo && npc.getAgreement && !npc.getAgreement()) {
      return FAILED;
    }
    var ex = game.room[this.dir];
    if (typeof ex !== "object"){
      errormsg(ERR_GAME_BUG, CMD_UNSUPPORTED_DIR);
      return FAILED;
    }
    return ex.use(npc, this.dir);
  };
}

var useWithDoor = function(char, dir) {
  var obj = w[this.door];
  if (obj === undefined) {
    errormsg(ERR_GAME_BUG, ERR_CMD_NO_DOOR(this));
  }
  var doorName = this.doorName ? this.doorName : "door";
  if (!obj.closed) {
    setRoom(char, this.name, dir);
    return SUCCESS;
  }
  if (!obj.locked) {
    obj.closed = false;
    msg(CMD_OPEN_AND_ENTER(char, doorName));
    setRoom(char, this.name, false);
    return SUCCESS;
  }
  if (obj.testKeys(char)) {
    obj.closed = false;
    obj.locked = false;
    msg(CMD_UNLOCK_AND_ENTER(char, doorName));
    setRoom(char, this.name, false);
    return SUCCESS;
  }        
  msg(CMD_TRY_BUT_LOCKED(char, doorName));
  return FAILED;
};



  // Should be called during the initialisation process
function initCommands(EXITS) {
  var newCmds = [];
  commands.forEach(function(el) {
    if (el.verb) {
      el.regex = el.regex + " #object#";
    }
    if (!(el.regex instanceof RegExp)) {
      alert("No regex for " + el.name);
    }
    if (el.npcCmd) {
      var regexAsStr = el.regex.source.substr(1);
      var objects = el.objects.slice();
      objects.unshift({scope:isNpcHere, attName:"npc"});
      
      var cmd = new NpcCmd("Npc" + el.name + "1", {
        regex:new RegExp("^(.+), ?" + regexAsStr),
        objects:objects,
        attName:el.attName,
        default:el.default,
        rules:el.rules,
        shortName:el.shortName ? el.shortName : el.name,
      });
      newCmds.push(cmd);
      
      cmd = new NpcCmd("Npc" + el.name + "2", {
        regex:new RegExp("^tell (.+) to " + regexAsStr),
        objects:objects,
        attName:el.attName,
        default:el.default,
        rules:el.rules,
        shortName:el.shortName ? el.shortName : el.name,
      });
      newCmds.push(cmd);
    }
  });
  
  commands.push.apply(commands, newCmds);
  
  EXITS.forEach(function(el) {
    if (!el.nocmd) {
      var regex = "^(" + CMD_GO + ")(" + el.name + "|" + el.abbrev.toLowerCase();
      if (el.alt) { regex += "|" + el.alt; }
      regex += ")$";
      var cmd = new ExitCmd(el.name, {
        regex:new RegExp(regex),
      });
      commands.push(cmd);
      
      regex = "^(.+), ?(" + CMD_GO + ")(" + el.name + "|" + el.abbrev.toLowerCase();
      if (el.alt) { regex += "|" + el.alt; }
      regex += ")$";
      cmd = new NpcExitCmd("Npc" + el.name + "1", {
        regex:new RegExp(regex),
      }, el.name);
      commands.push(cmd);
      
      regex = "^tell (.+) to (" + CMD_GO + ")(" + el.name + "|" + el.abbrev.toLowerCase();
      if (el.alt) { regex += "|" + el.alt; }
      regex += ")$";
      cmd = new NpcExitCmd("Npc" + el.name + "2", {
        regex:new RegExp(regex),
      }, el.name);
      commands.push(cmd);
      
    }
  });
}


var cmdRules = {};

cmdRules.isReachableRule = function(char, item, isMultiple) {
  if (item.scopeStatus !== REACHABLE) {
    var handled = false;
    if (item.loc) {
      var cont = w[item.loc];
      if (cont.scopeStatus === REACHABLE && cont.closed) {
        msg(prefix(item, isMultiple) + CMD_INSIDE_CONTAINER(char, item, cont));
        handled = true;
      }
    }      
    if (!handled) {
      msg(prefix(item, isMultiple) + CMD_NOT_HERE(char, item));
    }
    return false;
  }
  return true;
};

cmdRules.isTakeableRule = function(char, item, isMultiple) {
  if (!item.takeable) {
    msg(prefix(item, isMultiple) + CMD_CANNOT_TAKE(char, item));
    return false;
  }
  return true;
};
    


cmdRules.isHeldNotWornRule = function(char, item, isMultiple) {
  if (!item.worn && item.isAtLoc(char.name)) {
    return true;
  }

  if (item.isAtLoc(char.name)) {
    msg(prefix(item, isMultiple) + CMD_WEARING(char, item));
    return false;
  }

  if (item.loc) {
    var holder = w[item.loc];
    if (holder.npc || holder.player) {
      msg(prefix(item, isMultiple) + CMD_CHAR_HAS_IT(holder, item));
      return false;
    }
  }
    
  msg(prefix(item, isMultiple) + CMD_NOT_CARRYING(char, item));
  return false;
};

cmdRules.isWornRule = function(char, item, isMultiple) {
  if (item.worn && item.isAtLoc(char.name)) {
    return true;
  }

  if (item.isAtLoc(char.name)) {
    msg(prefix(item, isMultiple) + CMD_NOT_WEARING(char, item));
    return false;
  }
  
  if (item.loc) {
    var holder = w[item.loc];
    if (holder.npc || holder.player) {
      msg(prefix(item, isMultiple) + CMD_CHAR_HAS_IT(holder, item));
      return false;
    }
  }
    
  msg(prefix(item, isMultiple) + CMD_NOT_CARRYING(char, item));
  return false;
};

cmdRules.isHeldRule = function(char, item, isMultiple) {
  if (item.isAtLoc(char.name)) {
    return true;
  }
    
  if (item.loc) {
    var holder = w[item.loc];
    if (holder.npc || holder.player) {
      msg(prefix(item, isMultiple) + CMD_CHAR_HAS_IT(holder, item));
      return false;
    }
  }
    
  msg(prefix(item, isMultiple) + CMD_NOT_CARRYING(char, item));
  return false;
};

cmdRules.isHereRule = function(char, item, isMultiple) {
  if (item.isAtLoc(char.loc)) {
    return true;
  }

  if (item.loc) {
    var holder = w[item.loc];
    if (holder.npc || holder.player) {
      // Has a specific location and held by someone
      msg(prefix(item, isMultiple) + CMD_CHAR_HAS_IT(holder, item));
      return false;
    }
  }
  
  if (item.scopeStatus === REACHABLE) {
    return true;
  }

  msg(prefix(item, isMultiple) + CMD_NOT_HERE(char, item));
  return false;
};