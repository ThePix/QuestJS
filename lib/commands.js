// A command has an arbitrary name, a regex or pattern, 
// and a script as a minimum.
// regex           A regex to match against
// pattern         An alternative to a regex, will be converted to a regex at runtime
//                 A command must have either a pattern or a regex
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
    regex:/^help|\?$/,
    script:helpScript,
  }),    
  new Cmd('Look', {
    regex:/^l|look$/,
    script:function() {
      game.room.description();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Wait', {
    pattern:'wait;z',
    script:function() {
      return SUCCESS;
    },
  }),
  new Cmd('Brief', {
    pattern:'brief',
    script:function() {
      game.verbosity = BRIEF;
      metamsg("Game mode is now 'brief'; no room descriptions (except with LOOK).");
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Terse', {
    pattern:'terse',
    script:function() {
      game.verbosity = TERSE;
      metamsg("Game mode is now 'terse'; room descriptions only shown on first entering and with LOOK.");
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Verbose', {
    pattern:'verbose',
    script:function() {
      game.verbosity = VERBOSE;
      metamsg("Game mode is now 'verbose'; room descriptions shown everytme you enter a room.");
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Inv', {
    regex:/^inventory|inv|i$/,
    script:function() {
      var listOfOjects = scope(isHeld);
      msg("You are carrying " + formatList(listOfOjects, {def:"a", lastJoiner:" and", modified:true, nothing:"nothing"}) + ".");
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
  new Cmd('test', {
    pattern:'test',
    script:function() {
      metamsg(JSON.stringify(w.background));
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
    script:function(cmd, arr) {
      saveLoad.saveGame(arr[0]);
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {ignore:true},
      {text:true},
    ]
  }),
  new Cmd('Load', {
    regex:/^reload|load$/,
    script:saveLoadScript,
  }),
  new Cmd('Load game', {
    regex:/^(load|reload) (.+)$/,
    script:function(cmd, arr) {
      saveLoad.loadGame(arr[0]);
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {ignore:true},
      {text:true},
    ]
  }),
  new Cmd('Dir', {
    regex:/^dir|directory$/,
    script:function() {
      saveLoad.dirGame();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Delete game', {
    regex:/^(delete|del) (.+)$/,
    script:function(cmd, arr) {
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
    regex:/^(take|get|pick up) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHere, multiple:true},
    ],
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_TAKE(item));
      return false;
    },
  }),
  new Cmd('Drop', {
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
    regex:/^(wear|don|put on) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_WEAR(item));
      return false;
    },
  }),
  new Cmd('Remove', {
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
    regex:/^(read) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_READ(item));
      return false;
    },
  }),
  new Cmd('Eat', {
    regex:/^(eat) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_EAT(item));
      return false;
    },
  }),
  new Cmd('Turn on', {
    regex:/^(turn on|switch on) (.+)$/,
    attName:"switchon",
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_SWITCH_ON(item));
      return false;
    },
  }),
  
  new Cmd('Turn off', {
    regex:/^(turn off|switch off) (.+)$/,
    attName:"switchoff",
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_SWITCH_OFF(item));
      return false;
    },
  }),
  
  new Cmd('Open', {
    regex:/^(open) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_OPEN(item));
      return false;
    },
  }),
  
  new Cmd('Close', {
    regex:/^(close) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_CLOSE(item));
      return false;
    },
  }),
  
  new Cmd('Lock', {
    regex:/^(lock) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_LOCK(item));
      return false;
    },
  }),
  
  new Cmd('Unlock', {
    regex:/^(unlock) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_UNLOCK(item));
      return false;
    },
  }),
  
  new Cmd('Use', {
    regex:/^(use) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_USE(item));
      return false;
    },
  }),
  
  new Cmd('Talk to', {
    regex:/^(talk to|talk|speak to|speak|converse with|converse) (.+)$/,
    attName:"talkto",
    objects:[
      {ignore:true},
      {scope:isHere},
    ],
    default:function(item) {
      msg("You chat to " + item.byname("the") + " for a few moments, before releasing that " + pronounVerb(item, "'be") + " not about to reply");
      return false;
    },
  }),

  
  // ----------------------------------
  // Complex commands
  
  
  new Cmd('Put/in', {
    regex:/^(put|place|drop) (.+) (in to|into|in|on to|onto|on) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isPresent},
    ],
    script:function(objects) {
      var success = false;
      var container = objects[1][0];
      if (!container.container) {
        errormsg(ERR_PLAYER, CMD_NOT_CONTAINER(container));
        return FAILED; 
      }
      for (var i = 0; i < objects[0].length; i++) {
        var flag = true;
        if (container.checkCapacity) {
          flag = container.checkCapacity(objects[0][i]);
        }
        if (flag) {
          if (objects[0][i].loc !== game.player.name) {
            CMD_NOT_CARRYING(game.player, objects[0][i]);
          }
          else {
            objects[0][i].loc = container.name;
            msg(prefix(objects[0][i], objects[0].length > 1 || parser.currentCommand.all) + CMD_DONE);
            success = true;
          }
        }
      }
      if (success) { game.update(); }
      return success ? SUCCESS : FAILED; 
    },
  }),
  


  new Cmd('Ask/about', {
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
      {scope:isHere},
      {ignore:true},
      {text:true},
    ]
  }),
  new Cmd('Tell/about', {
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
      {scope:isHere},
      {ignore:true},
      {text:true},
    ]
  }),
  
  
  new NpcCmd('NpcTake', {
    regex:/^(.+), (take|get|pick up) (.+)$/,
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHere, multiple:true},
    ],
    attName:"take",
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_TAKE(item));
      return false;
    },
  }),

  new NpcCmd('NpcDrop', {
    regex:/^(.+), (drop|put down) (.+)$/,
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeldByNpc, multiple:true},
    ],
    attName:"drop",
    default:function(item, isMultiple) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_DROP(item));
      return false;
    },
  }),

  
  new Cmd('Inspect', {
    regex:/^(inspect) (.+)$/,
    script:function(arr) {
      if (DEBUG) {
        var item = arr[0][0];
        debugmsg(0, "Name: " + item.name);
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
             debugmsg(0, "--" + key + ": " + item[key]);
          }
        }        
      }
      else {
        errormsg(ERR_PLAYER, "Debug commands are not available.");
      }
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {ignore:true},
      {scope:isInWorld},
    ],
  }),
];

    


