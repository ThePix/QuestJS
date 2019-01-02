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
      game.update();
      return (this.noTurnscripts ? SUCCESS_NO_TURNSCRIPTS : SUCCESS);
    }
    else {
      return FAILED; 
    }
  };
  this.processCommand = function(char, item, multi) {
    for (var i = 0; i < this.rules.length; i++) {
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
    var multi = (objects[0].length > 1 || parser.currentCommand.all);
    for (var i = 0; i < objects[0].length; i++) {
      if (!npc.getAgreement(this, objects[1][i])) {
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
      game.update();
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
        setRoom(ex);
        return SUCCESS;
      }
      else if (typeof ex === "function"){
        ex(game.room);
        return SUCCESS;
      }
      else if (typeof ex === "object"){
        var fn = ex.use;
        return fn(ex, this.name);
      }
      else {
        errormsg(ERR_GAME_BUG, CMD_UNSUPPORTED_DIR);
        return FAILED;
      }
    }
    
  };
}

var useWithDoor = function(ex, char) {
  var obj = w[ex.door];
  var doorName = ex.doorName ? ex.doorName : "door"
  if (!obj.closed) {
    setRoom(ex.name);
    return SUCCESS;
  }
  if (!obj.locked) {
    obj.closed = false;
    msg("You open the " + doorName + " and walk through.");
    setRoom(ex.name);
    return SUCCESS;
  }
  if (obj.testKeys(char)) {
    obj.closed = false;
    obj.locked = false;
    msg("You unlock the " + doorName + ", open it and walk through.");
    setRoom(ex.name);
    return SUCCESS;
  }        
  msg("You try the " + doorName + ", but it is locked.");
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
        regex:new RegExp("^(.+), " + regexAsStr),
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
    }
  });
}


var cmdRules = {};

cmdRules.isReachableRule = function(char, item, isMultiple) {
  if (!item.isReachable()) {
    msg(prefix(item, isMultiple) + CMD_NOT_HERE(char, item));
    return false;
  }
  return true;
}

cmdRules.isTakableRule = function(char, item, isMultiple) {
  if (!item.takable) {
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

