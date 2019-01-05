"use strict";


function Cmd(name, hash) {
  this.name = name;
  this.objects = [];
  this.rules = [];
  this.default = function() { errormsg(ERR_GAME_BUG, CMD_NO_DEFAULT(this.name)); }
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
        errormsg(ERR_GAME_BUG, "Failed to process command as one of its rules (" + i + ") is not a function.");
      }
      if (!this.rules[i](char, item, multi)) {
        return false;
      }
    }
    return printOrRun(char, item, this.attName, multi)
  };
  for (var key in hash) {
    this[key] = hash[key];
  }
  this.attName = this.attName ? this.attName : this.name.toLowerCase();
  for (key in this.objects) {
    if (!this.objects[key].attName) {
      this.objects[key].attName = this.attName;
    }
  };
}

// Use only for NPC commands that you are not giving your
// own custom script attribute. Commands must be an order to a single
// NPC in the form verb-object.
function NpcCmd(name, hash) {
  Cmd.call(this, name, hash);
  this.script = function(objects) {
    var npc = objects[0][0];
    if (!npc.npc) {
      msg(CMD_NOT_NPC(npc));
      return FAILED; 
    }
    var success = false;
    var multi = (objects[1].length > 1 || parser.currentCommand.all);
    for (var i = 0; i < objects[1].length; i++) {
      if (!npc.getAgreement(this.name, objects[1][i])) {
        // The getAgreement should give the response
      }
      else if (!objects[1][i][this.attName]) {
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
      errormsg(ERR_PLAYER, CMD_NOT_THAT_WAY);
      return FAILED;
    }
    else {
      var ex = game.room[this.name];
      if (typeof ex === "string") {
        setRoom(game.player, ex, this.dir);
        return SUCCESS;
      }
      else if (typeof ex === "function"){
        ex(game.player);
        return SUCCESS;
      }
      else if (typeof ex === "object"){
        var flag = ex.use(game.player, this.dir);
        return flag ? SUCCESS : FAILED;
        //return ex.use(game.player, this.dir);
      }
      else {
        errormsg(ERR_GAME_BUG, CMD_UNSUPPORTED_DIR);
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
    var npc = objects[0][0];
    if (!hasExit(game.room, this.dir)) {
      errormsg(ERR_PLAYER, CMD_NOT_THAT_WAY);
      return FAILED;
    }
    else if (!npc.getAgreement(this.name)) {
      return FAILED;
    }
    else {
      var ex = game.room[this.dir];
      if (typeof ex === "string") {
        npc.loc = ex;
        msg(npc.heading(this.dir));
        return SUCCESS;
      }
      else if (typeof ex === "function"){
        ex(npc);
        return SUCCESS;
      }
      else if (typeof ex === "object"){
        return ex.use(npc, this.dir);
      }
      else {
        errormsg(ERR_GAME_BUG, CMD_UNSUPPORTED_DIR);
        return FAILED;
      }
    }
    
  };
}

var useWithDoor = function(char, dir) {
  var obj = w[this.door];
  if (obj === undefined) {
    errormsg(ERR_GAME_BUG, "Not found an object called '" + this.door + "'. Any exit that uses the 'useWithDoor' function must also set a 'door' attribute.");
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
}



  // Should be called during the initialisation process
  // Any patterns are converted to RegExp objects.      
function initCommands(EXITS) {
  var newCmds = [];
  commands.forEach(function(el) {
    if (el.verb) {
      el.regex = el.regex + " #object#";
    }
    if (typeof el.pattern === "string") {
      el.regex = parser.pattern2Regexp(el.pattern);
    }
    if (!(el.regex instanceof RegExp)) {
      alert("No regex for " + el.name);
    }
    if (el.npcCmd) {
      var regexAsStr = el.regex.source.substr(1);
      var objects = el.objects.slice();
      objects.unshift({scope:isHere, attName:"npc"});
      
      var cmd = new NpcCmd("Npc" + el.name + "1", {
        regex:new RegExp("^(.+), ?" + regexAsStr),
        objects:objects,
        attName:el.attName,
        default:el.default,
        rules:el.rules,
      });
      newCmds.push(cmd);
      
      var cmd = new NpcCmd("Npc" + el.name + "2", {
        regex:new RegExp("^tell (.+) to " + regexAsStr),
        objects:objects,
        attName:el.attName,
        default:el.default,
        rules:el.rules,
      });
      newCmds.push(cmd);
    }
  });
  commands.push.apply(commands, newCmds)
  EXITS.forEach(function(el) {
    if (!el.nocmd) {
      var regex = "^(" + CMD_GO + ")(" + el.name + "|" + el.abbrev.toLowerCase()
      if (el.alt) { regex += "|" + el.alt; }
      regex += ")$";
      var cmd = new ExitCmd(el.name, {
        regex:new RegExp(regex),
      });
      commands.push(cmd);
      
      regex = "^(.+), ?(" + CMD_GO + ")(" + el.name + "|" + el.abbrev.toLowerCase()
      if (el.alt) { regex += "|" + el.alt; }
      regex += ")$";
      var cmd = new NpcExitCmd("Npc" + el.name + "1", {
        regex:new RegExp(regex),
      }, el.name);
      commands.push(cmd);
      
      regex = "^tell (.+) to (" + CMD_GO + ")(" + el.name + "|" + el.abbrev.toLowerCase()
      if (el.alt) { regex += "|" + el.alt; }
      regex += ")$";
      var cmd = new NpcExitCmd("Npc" + el.name + "2", {
        regex:new RegExp(regex),
      }, el.name);
      commands.push(cmd);
      
    }
  });
}


var cmdRules = {};

cmdRules.isReachableRule = function(char, item, isMultiple) {
  if (!item.isReachable()) {
    var handled = false;
    if (item.loc) {
      var cont = w[item.loc];
      if (cont.isReachable() && cont.closed) {
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
}

cmdRules.isTakeableRule = function(char, item, isMultiple) {
  if (!item.takeable) {
    msg(prefix(item, isMultiple) + CMD_CANNOT_TAKE(char, item));
    return false;
  }
  return true;
}
    
cmdRules.isNotWornRule = function(char, item, isMultiple) {
  if (item.worn && item.loc === char.name) {
    msg(prefix(item, isMultiple) + CMD_WEARING(char, item));
    return false;
  };
  return true;
}

cmdRules.isWornRule = function(char, item, isMultiple) {
  if (!item.worn || item.loc !== char.name) {
    msg(prefix(item, isMultiple) + CMD_NOT_WEARING(char, item));
    return false;
  };
  return true;
}

cmdRules.isHeldRule = function(char, item, isMultiple) {
  if (item.loc !== char.name) {
    msg(prefix(item, isMultiple) + CMD_NOT_CARRYING(char, item));
    return false;
  };
  return true;
}

cmdRules.isHereRule = function(char, item, isMultiple) {
  if (item.loc !== char.loc) {
    msg(prefix(item, isMultiple) + CMD_NOT_HERE(char, item));
    return false;
  };
  return true;
}

cmdRules.isNotHeldRule = function(char, item, isMultiple) {
  if (item.loc === char.name) {
    msg(prefix(item, isMultiple) + CMD_CHAR_HAS_IT(char, item));
    return false;
  };
  return true;
}

cmdRules.isNotWithOtherCharRule = function(char, item, isMultiple) {
  if (!item.loc) {
    return true;
  }
  var holder = w[item.loc];
  if (holder !== char && (holder.npc || holder === game.player)) {
    msg(prefix(item, isMultiple) + CMD_CHAR_HAS_IT(holder, item));
    return false;
  };
  return true;
}

