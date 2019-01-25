// A command has an arbitrary name, a regex or pattern, 
// and a script as a minimum.
// regex           A regex to match against
// objects         An array of matches in the regex (see wiki)
// script          This will be run on a successful match
// attName         If there is no script, then this attribute on the object will be used
// nothingForAll   If the player uses ALL and there is nothing there, use this error message
// noTurnscripts   Set to true to prevent turnscripts firing even when this command is successful

"use strict";







var commands = [
  // ----------------------------------
  // Single word commands
  new Cmd('Help', {
    regex:/^help$|^\?$/,
    script:helpScript,
  }),    
  new Cmd('Credits', {
    regex:/^about$|^credit$|^credits\?$/,
    script:aboutScript,
  }),
  
  
  new Cmd('Spoken', {
    regex:/^spoken$/,
    script:function() {
      game.spoken = true;
      metamsg("Game mode is now 'spoken'. Type INTRO to hear the introductory text.");
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Intro', {
    regex:/^intro$/,
    script:function() {
      game.spoken = true;
      intro();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Unspoken', {
    regex:/^unspoken$/,
    script:function() {
      game.spoken = false;
      metamsg("Game mode is now 'unspoken'.");
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Brief', {
    regex:/^brief$/,
    script:function() {
      game.verbosity = BRIEF;
      metamsg("Game mode is now 'brief'; no room descriptions (except with LOOK).");
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Terse', {
    regex:/^terse$/,
    script:function() {
      game.verbosity = TERSE;
      metamsg("Game mode is now 'terse'; room descriptions only shown on first entering and with LOOK.");
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Verbose', {
    regex:/^verbose$/,
    script:function() {
      game.verbosity = VERBOSE;
      metamsg("Game mode is now 'verbose'; room descriptions shown every time you enter a room.");
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  
  
  
  new Cmd('Look', {
    regex:/^l$|^look$/,
    script:function() {
      game.room.description();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Wait', {
    regex:/^wait$|^z$/,
    script:function() {
      return SUCCESS;
    },
  }),
  new Cmd('Inv', {
    regex:/^inventory$|^inv$|^i$/,
    script:function() {
      var listOfOjects = scope(isHeld);
      msg("You are carrying " + formatList(listOfOjects, {article:INDEFINITE, lastJoiner:LIST_AND, modified:true, nothing:LIST_NOTHING, loc:game.player.name}) + ".");
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Map', {
    regex:/^map$/,
    script:function() {
      io.map();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  
  // ----------------------------------
  // File system commands
  new Cmd('Save', {
    regex:/^save$/,
    script:saveLoadScript,
  }),
  new Cmd('Save game', {
    regex:/^(save) (.+)$/,
    script:function(arr) {
      saveLoad.saveGame(arr[0]);
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {ignore:true},
      {text:true},
    ]
  }),
  new Cmd('Load', {
    regex:/^reload$|^load$/,
    script:saveLoadScript,
  }),
  new Cmd('Load game', {
    regex:/^(load|reload) (.+)$/,
    script:function(arr) {
      saveLoad.loadGame(arr[0]);
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {ignore:true},
      {text:true},
    ]
  }),
  new Cmd('Dir', {
    regex:/^dir$|^directory$/,
    script:function() {
      saveLoad.dirGame();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Delete game', {
    regex:/^(delete|del) (.+)$/,
    script:function(arr) {
      saveLoad.deleteGame(arr[0]);
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {ignore:true},
      {text:true},
    ]
  }),
  
  
  // ----------------------------------
  // Verb-object commands
  new Cmd('Examine', {
    regex:/^(examine|exam|ex|x) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent}
    ]
  }),
  new Cmd('Look at', {  // used for NPCs
    regex:/^(look at|look) (.+)$/,
    attName:'examine',
    objects:[
      {ignore:true},
      {scope:isPresent}
    ]
  }),
  new Cmd('About', {   //used for spells
    regex:/^(about) (.+)$/,
    attName:'examine',
    objects:[
      {ignore:true},
      {scope:isPresent}
    ]
  }),
  
  
  new Cmd('Take', {
    npcCmd:true,
    rules:[cmdRules.isHereRule, cmdRules.isReachableRule, cmdRules.isTakeableRule, ],
    regex:/^(take|get|pick up) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHere, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_TAKE(char, item));
      return false;
    },
  }),
  new Cmd('Drop', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWornRule],
    regex:/^(drop) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_NOT_CARRYING(char, item));
      return false;
    },
  }),
  new Cmd('Wear', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWornRule, cmdRules.isHeldRule],
    regex:/^(wear|don|put on) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_WEAR(char, item));
      return false;
    },
  }),
  new Cmd('Remove', {
    npcCmd:true,
    rules:[cmdRules.isWornRule],
    regex:/^(remove|doff|take off) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isWorn, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_NOT_WEARING(char, item));
      return false;
    },
  }),
  new Cmd('Read', {
    npcCmd:true,
    regex:/^(read) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_READ(char, item));
      return false;
    },
  }),
  new Cmd('Eat', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWornRule],
    regex:/^(eat) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_EAT(char, item));
      return false;
    },
  }),
  new Cmd('TurnOn', {
    npcCmd:true,
    regex:/^(turn on|switch on) (.+)$/,
    attName:"switchon",
    shortName:"SwitchOn",
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_SWITCH_ON(char, item));
      return false;
    },
  }),
  new Cmd('TurnOn2', {
    npcCmd:true,
    regex:/^(turn|switch) (.+) on$/,
    attName:"switchon",
    shortName:"SwitchOn",
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_SWITCH_ON(char, item));
      return false;
    },
  }),
  
  new Cmd('TurnOff2', {
    npcCmd:true,
    regex:/^(turn|switch) (.+) off$/,
    attName:"switchoff",
    shortName:"SwitchOff",
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_SWITCH_OFF(char, item));
      return false;
    },
  }),
  new Cmd('TurnOff', {
    npcCmd:true,
    regex:/^(turn off|switch off) (.+)$/,
    attName:"switchoff",
    shortName:"SwitchOff",
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_SWITCH_OFF(char, item));
      return false;
    },
  }),
  
  new Cmd('Open', {
    npcCmd:true,
    regex:/^(open) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_OPEN(char, item));
      return false;
    },
  }),
  
  new Cmd('Close', {
    npcCmd:true,
    regex:/^(close) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_CLOSE(char, item));
      return false;
    },
  }),
  
  new Cmd('Lock', {
    npcCmd:true,
    regex:/^(lock) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_LOCK(char, item));
      return false;
    },
  }),
  
  new Cmd('Unlock', {
    npcCmd:true,
    regex:/^(unlock) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_UNLOCK(char, item));
      return false;
    },
  }),
  
  new Cmd('Push', {
    npcCmd:true,
    regex:/^(push|press) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent},
    ],
    default:function(item, isMultiple, char) {
      msg(CMD_NOTHING_USEFUL(char, item));
      return false;
    },
  }),

  new Cmd('Pull', {
    npcCmd:true,
    regex:/^(pull) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent},
    ],
    default:function(item, isMultiple, char) {
      msg(CMD_NOTHING_USEFUL(char, item));
      return false;
    },
  }),
  new Cmd('Fill', {
    npcCmd:true,
    regex:/^(fill) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent},
    ],
    default:function(item, isMultiple, char) {
      msg(CMD_CANNOT_FILL(char, item));
      return false;
    },
  }),
  new Cmd('Empty', {
    npcCmd:true,
    regex:/^(empty) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent},
    ],
    default:function(item, isMultiple, char) {
      msg(CMD_CANNOT_EMPTY(char, item));
      return false;
    },
  }),

  new Cmd('SitOn', {
    npcCmd:true,
    regex:/^(sit on|sit upon|sit) (.+)$/,
    attName:"siton",
    objects:[
      {ignore:true},
      {scope:isHere},
    ],
    default:function(item, isMultiple, char) {
      msg(CMD_CANNOT_SIT_ON(char, item));
      return false;
    },
  }),
  new Cmd('StandOn', {
    npcCmd:true,
    regex:/^(stand on|stand upon|stand) (.+)$/,
    attName:"standon",
    objects:[
      {ignore:true},
      {scope:isHere},
    ],
    default:function(item, isMultiple, char) {
      msg(CMD_CANNOT_STAND_ON(char, item));
      return false;
    },
  }),
  new Cmd('ReclineOn', {
    npcCmd:true,
    regex:/^(recline on|recline upon|recline|lie on|lie upon|lie) (.+)$/,
    attName:"reclineon",
    objects:[
      {ignore:true},
      {scope:isHere},
    ],
    default:function(item, isMultiple, char) {
      msg(CMD_CANNOT_RECLINE_ON(char, item));
      return false;
    },
  }),
  new Cmd('GetOff', {
    npcCmd:true,
    regex:/^(get off|off) (.+)$/,
    attName:"getoff",
    shortName:"Stand",
    objects:[
      {ignore:true},
      {scope:isHere},
    ],
    default:function(item, isMultiple, char) {
      msg(CMD_ALREADY(char));
      return false;
    },
  }),

  new Cmd('Use', {
    npcCmd:true,
    regex:/^(use) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    default:function(item, isMultiple, char) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_USE(char, item));
      return false;
    },
  }),
  
  new Cmd('Talk to', {
    regex:/^(talk to|talk|speak to|speak|converse with|converse) (.+)$/,
    attName:"talkto",
    objects:[
      {ignore:true},
      {scope:isNpcHere},
    ],
    default:function(item) {
      msg("You chat to " + item.byname({article:DEFINITE}) + " for a few moments, before releasing that " + pronounVerb(item, "'be") + " not about to reply");
      return false;
    },
  }),

  
  // ----------------------------------
  // Complex commands
  
  new Cmd('Stand', {
    regex:/^stand$|^stand up$|^get up$/,
    script:function() {
      if (!game.player.posture) {
        msg(CMD_ALREADY(game.player));
        return FAILED;
      }
      if (game.player.posture) {
        msg(CMD_STOP_POSTURE(game.player))
        return SUCCESS;
      }  
    },
  }),
  new Cmd('NpcStand1', {
    regex:/^(.+), ?(stand|stand up|get up)$/,
    shortName:"Stand",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
    ],
    script:handleStandUpNpc,
  }),
  new Cmd('NpcStand2', {
    regex:/^tell (.+) to (stand|stand up|get up)$/,
    shortName:"Stand",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
    ],
    script:handleStandUpNpc,
  }),
  
  
  
  
  new Cmd('FillWith', {
    regex:/^(fill) (.+) (with) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isLiquid},
    ],
    script:function(objects) {
      return handleFillWithLiquid(game.player, objects);
    },
  }),
  new Cmd('NpcFillWith1', {
    regex:/^(.+), ?(fill) (.+) (with) (.+)$/,
    shortName:"FillWith",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isLiquid},
    ],
    script:function(objects) {
      var npc = objects[0][0];
      npc.actedThisTurn = true;
      if (!npc.npc) {
        msg(CMD_NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleFillWithLiquid(npc, objects);
    },
  }),
  new Cmd('NpcFillWith2', {
    regex:/^tell (.+) to (fill) (.+) (with) (.+)$/,
    shortName:"FillWith",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isLiquid},
    ],
    script:function(objects) {
      var npc = objects[0][0];
      npc.actedThisTurn = true;
      if (!npc.npc) {
        msg(CMD_NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleFillWithLiquid(npc, objects);
    },
  }),


  new Cmd('PutIn', {
    regex:/^(put|place|drop) (.+) (in to|into|in|on to|onto|on) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isPresent, attName: "container"},
    ],
    script:function(objects) {
      return handlePutInContainer(game.player, objects);
    },
  }),
  
  new Cmd('NpcPutIn1', {
    regex:/^(.+), ?(put|place|drop) (.+) (in to|into|in|on to|onto|on) (.+)$/,
    shortName:"PutIn",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isPresent, attName: "container"},
    ],
    script:function(objects) {
      var npc = objects[0][0];
      npc.actedThisTurn = true;
      if (!npc.npc) {
        msg(CMD_NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handlePutInContainer(npc, objects);
    },
  }),
  new Cmd('NpcPutIn2', {
    regex:/^tell (.+) to (put|place|drop) (.+) (in to|into|in|on to|onto|on) (.+)$/,
    shortName:"PutIn",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isPresent, attName: "container"},
    ],
    script:function(objects) {
      var npc = objects[0][0];
      npc.actedThisTurn = true;
      if (!npc.npc) {
        msg(CMD_NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handlePutInContainer(npc, objects);
    },
  }),

  new Cmd('GiveTo', {
    regex:/^(give) (.+) (to) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isPresent, attName: "npc"},
    ],
    script:function(objects) {
      return handleGiveToNpc(game.player, objects);
    },
  }),
  new Cmd('NpcGiveTo1', {
    regex:/^(.+), ?(give) (.+) (to) (.+)$/,
    shortName:"Give",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isPresent, attName: "npc"},
    ],
    script:function(objects) {
      var npc = objects[0][0];
      npc.actedThisTurn = true;
      if (!npc.npc) {
        msg(CMD_NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleGiveToNpc(npc, objects);
    },
  }),
  new Cmd('NpcGiveTo2', {
    regex:/^tell (.+) to ?(give) (.+) (to) (.+)$/,
    shortName:"Give",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isPresent, attName: "npc"},
    ],
    script:function(objects) {
      var npc = objects[0][0];
      npc.actedThisTurn = true;
      if (!npc.npc) {
        msg(CMD_NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleGiveToNpc(npc, objects);
    },
  }),
  

  
  

  new Cmd('AskAbout', {
    regex:/^(ask) (.+) (about) (.+)$/,
    script:function(arr) {
      if (!arr[0][0].askabout) {
        msg("You can ask " + this.pronouns.objective + " about " + arr[1] + " all you like, but " + pronounVerb(this, "'be") + " not about to reply.");
        return false;
      }
      var success = arr[0][0].askabout(arr[1]);
      return success ? SUCCESS : FAILED; 
    },
    objects:[
      {ignore:true},
      {scope:isNpcHere},
      {ignore:true},
      {text:true},
    ]
  }),
  new Cmd('TellAbout', {
    regex:/^(tell) (.+) (about) (.+)$/,
    script:function(arr) {
      if (!arr[0][0].askabout) {
        msg("You can tell " + this.pronouns.objective + " about " + arr[1] + " all you like, but " + pronounVerb(this, "'be") + " not paying any attention.");
        return false;
      }
      var success = arr[0][0].tellabout(arr[1]);
      return success ? SUCCESS : FAILED; 
    },
    objects:[
      {ignore:true},
      {scope:isNpcHere},
      {ignore:true},
      {text:true},
    ]
  }),
  
  






// DEBUG commands
  
  new Cmd('Inspect', {
    regex:/^(inspect) (.+)$/,
    script:function(arr) {
      if (!DEBUG) {
        errormsg(ERR_DEBUG_CMD, "The INSPECT command is only available in debug mode.");
        return FAILED;
      }
      var item = arr[0][0];
      debugmsg("Name: " + item.name);
      for (var key in item) {
        if (item.hasOwnProperty(key)) {
           debugmsg("--" + key + ": " + item[key]);
        }
      }        
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {ignore:true},
      {scope:isInWorld},
    ],
  }),

  new Cmd('test', {
    regex:/^test$/,
    script:function() {
      if (!DEBUG) {
        errormsg(ERR_DEBUG_CMD, "The TEST command is only available in debug mode.");
        return FAILED;
      }
      test.runTests();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),




];











    
// Functions used by commands 
// (but not in the commands array)



function handleFillWithLiquid(char, objects) {
  var success = false;
  var container = objects[1][0];
  var multiple = objects[0].length > 1 || parser.currentCommand.all;
  if (!container.container) {
    msg(CMD_NOT_CONTAINER(char, container));
    return FAILED; 
  }
  if (container.closed) {
    msg(CMD_CONTAINER_CLOSED(char, container));
    return FAILED; 
  }
  for (var i = 0; i < objects[0].length; i++) {
    var flag = true;
    if (!char.getAgreement("Fill", objects[0][i])) {
      // The getAgreement should give the response
      continue;
    }
    if (container.testRestrictions) {
      flag = container.testRestrictions(objects[0][i], char);
    }
    if (flag) {
      if (!objects[0][i].isAtLoc(char.name)) {
        msg(prefix(objects[0][i], multiple) + CMD_NOT_CARRYING(char, objects[1][i]));
      }
      else {
        objects[0][i].moveFromTo(char.name, container.name);
        msg(prefix(objects[0][i], multiple) + CMD_DONE);
        success = true;
      }
    }
  }
  if (success && container.putInResponse) container.putInResponse();
  return success ? SUCCESS : FAILED;
}

function handlePutInContainer(char, objects) {
  var success = false;
  var container = objects[1][0];
  var multiple = objects[0].length > 1 || parser.currentCommand.all;
  if (!container.container) {
    msg(CMD_NOT_CONTAINER(char, container));
    return FAILED; 
  }
  if (container.closed) {
    msg(CMD_CONTAINER_CLOSED(char, container));
    return FAILED; 
  }
  for (var i = 0; i < objects[0].length; i++) {
    var flag = true;
    if (!char.getAgreement("Put/in", objects[0][i])) {
      // The getAgreement should give the response
      continue;
    }
    if (container.testRestrictions) {
      flag = container.testRestrictions(objects[0][i], char);
    }
    if (flag) {
      if (!objects[0][i].isAtLoc(char.name)) {
        msg(prefix(objects[0][i], multiple) + CMD_NOT_CARRYING(char, objects[1][i]));
      }
      else {
        objects[0][i].moveFromTo(char.name, container.name);
        msg(prefix(objects[0][i], multiple) + CMD_DONE);
        success = true;
      }
    }
  }
  if (success && container.putInResponse) container.putInResponse();
  return success ? SUCCESS : FAILED;
}



function handleGiveToNpc(char, objects) {
  var success = false;
  var npc = objects[1][0];
  var multiple = objects[0].length > 1 || parser.currentCommand.all;
  if (!npc.npc) {
    msg(CMD_NOT_NPC_FOR_GIVE(char, npc));
    return FAILED; 
  }
  for (var i = 0; i < objects[0].length; i++) {
    var flag = true;
    if (!char.getAgreement("Give", objects[0][i])) {
      // The getAgreement should give the response
    }
    if (npc.testRestrictions) {
      flag = npc.testRestrictions(objects[0][i]);
    }
    if (flag) {
      if (!objects[0][i].isAtLoc(char.name)) {
        msg(prefix(objects[0][i], multiple) + CMD_NOT_CARRYING(char, objects[1][i]));
      }
      else {
        if (npc.giveReaction) {
          npc.giveReaction(objects[0][i], multiple, char);
        }
        else {
          msg(prefix(objects[0][i], multiple) + CMD_DONE);
          objects[0][i].moveFromTo(char.name, npc.name);
        }
        success = true;
      }
    }
  }
  return success ? SUCCESS : FAILED;
}


function handleStandUpNpc(objects) {
  var npc = objects[0][0];
  npc.actedThisTurn = true;
  if (!npc.npc) {
    msg(CMD_NOT_NPC(npc));
    return FAILED; 
  }
  if (!npc.posture) {
    msg(CMD_ALREADY(npc));
    return FAILED;
  }
  if (npc.getAgreementStand && !npc.getAgreementStand()) {
    // The getAgreement should give the response
    return FAILED;
  }
  if (!npc.getAgreementStand && npc.getAgreement && !npc.getAgreement()) {
    return FAILED;
  }
  if (npc.posture) {
    msg(CMD_STOP_POSTURE(npc))
    return SUCCESS;
  }  
}

