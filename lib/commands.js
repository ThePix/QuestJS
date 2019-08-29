// A command has an arbitrary name, a regex or pattern, 
// and a script as a minimum.
// regex           A regex to match against
// objects         An array of matches in the regex (see wiki)
// script          This will be run on a successful match
// attName         If there is no script, then this attribute on the object will be used
// nothingForAll   If the player uses ALL and there is nothing there, use this error message
// noTurnscripts   Set to true to prevent turnscripts firing even when this command is successful

"use strict";







const commands = [
  // ----------------------------------
  // Single word commands
  
  // Cannot just set the script to helpScript as we need to allow the
  // author to change it in code.js, which is loaded after this.
  new Cmd('Help', {
    regex:/^help$|^\?$/,
    script:function() { helpScript(); },
  }),    
  new Cmd('Credits', {
    regex:/^about$|^credit$|^credits\?$/,
    script:function() { aboutScript(); },
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
      if (typeof INTRO === "string") msg(INTRO);
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
  
  new Cmd('Transcript', {
    regex:/^transcript|script$/,
    script:function() {
      metamsg("The TRANSCRIPT or SCRIPT command can be used to handle saving the input and output.");
      metamsg("Use SCRIPT ON to turn on recording and SCRIPT OFF to turn it off. Use SCRIPT SHOW to display it. To empty the file, use SCRIPT CLEAR.");
      metamsg("You can add options to the SCRIPT SHOW to hide various types of text. Use M to hide meta-information (like this), I to hide your input, P to hide parser errors (when the parser says it has no clue what you mean), E to hide programming errors and D to hide debugging messages. These can be combined, so SCRIPT SHOW ED will hide programming errors and debugging messages, and SCRIPT SHOW EDPID will show only the output game text.");
      metamsg("Everything gets saved to memory, and will be lost if you go to another web page or close your browser, but should be saved when you save your game. You can only have one transcript dialog window open at a time.");
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('TranscriptOn', {
    regex:/^transcript on|script on$/,
    script:function() {
      if (game.transcript) {
        metamsg("Transcript is already turned on.");
        return FAILED
      }
      game.scriptStart();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('TranscriptOff', {
    regex:/^transcript off|script off$/,
    script:function() {
      if (!game.transcript) {
        metamsg("Transcript is already turned off.");
        return FAILED
      }
      game.scriptEnd();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('TranscriptClear', {
    regex:/^transcript clear|script clear|transcript delete|script delete$/,
    script:function() {
      game.scriptClear();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('TranscriptShow', {
    regex:/^transcript show|script show$/,
    script:function() {
      game.scriptShow();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('TranscriptShowWithOptions', {
    regex:/^(transcript|script) show (\w+)$/,
    script:function(arr) {
      game.scriptShow(arr[0]);
      return SUCCESS_NO_TURNSCRIPTS;
    },
    objects:[
      {ignore:true},
      {text:true},
    ]
  }),
  
  new Cmd('Undo', {
    regex:/^undo$/,
    script:function() {
      if (MAX_UNDO === 0) {
        metamsg("Sorry, UNDO is not enabled in this game.");
        return FAILED;
      }
      if (game.gameState.length < 2) {
        metamsg("There are no saved game-states to UNDO back to.");
        return FAILED;
      }
      game.gameState.pop();
      const gameState = game.gameState[game.gameState.length - 1];
      metamsg("Undoing...");
      saveLoad.loadTheWorld(gameState);
      if (ROOM_HEADINGS) heading(4, sentenceCase(game.room.alias));
      w[game.player.loc].description();
      //return LOOK_COUNTS_AS_TURN ? SUCCESS : SUCCESS_NO_TURNSCRIPTS;
    },
  }),


  
  
  
  new Cmd('Look', {
    regex:/^l$|^look$/,
    script:function() {
      game.room.description();
      return LOOK_COUNTS_AS_TURN ? SUCCESS : SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Exits', {
    regex:/^exits$/,
    script:function() {
      msg("You think you can go {exits}.");
      return LOOK_COUNTS_AS_TURN ? SUCCESS : SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Wait', {
    regex:/^wait$|^z$/,
    script:function() {
      msg("You wait one turn.");
      return SUCCESS;
    },
  }),
  new Cmd('TopicsNote', {
    regex:/^topics?$/,
    script:function() {
      metamsg("Use TOPICS FOR [name] to see a list of topic suggestions to ask a character about (if implemented in this game).");
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  
  new Cmd('Inv', {
    regex:/^inventory$|^inv$|^i$/,
    script:function() {
      const listOfOjects = scope(isHeldListed);
      msg("You are carrying " + formatList(listOfOjects, {article:INDEFINITE, lastJoiner:LIST_AND, modified:true, nothing:LIST_NOTHING, loc:game.player.name}) + ".");
      return LOOK_COUNTS_AS_TURN ? SUCCESS : SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Map', {
    regex:/^map$/,
    script:function() {
      io.map();
      return LOOK_COUNTS_AS_TURN ? SUCCESS : SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Smell', {
    regex:/^smell$|^sniff$/,
    script:function() {
      if (game.room.onSmell) {
        printOrRun(game.player, game.room, "onSmell");
      }
      else {
        msg(NO_SMELL(game.player));
      }
      return SUCCESS;
    },
  }),
  new Cmd('Listen', {
    regex:/^listen$/,
    script:function() {
      if (game.room.onListen) {
        printOrRun(game.player, game.room, "onListen");
      }
      else {
        msg(NO_LISTEN(game.player));
      }
      return SUCCESS;
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
    ],
    defmsg:DEFAULT_EXAMINE,
  }),
  new Cmd('Look at', {  // used for NPCs
    regex:/^(look at|look) (.+)$/,
    attName:'examine',
    objects:[
      {ignore:true},
      {scope:isPresentOrMe}
    ],
    defmsg:DEFAULT_EXAMINE,
  }),
  new Cmd('Look out', {
    rules:[cmdRules.isHereRule],
    regex:/^(look out of|look out) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent}
    ],
    attName:"lookout",
    defmsg:CANNOT_LOOK_OUT,
  }),
  new Cmd('Look behind', {
    rules:[cmdRules.isHereRule],
    regex:/^(look behind|check behind) (.+)$/,
    attName:"lookbehind",
    objects:[
      {ignore:true},
      {scope:isPresent}
    ],
    defmsg:NOTHING_THERE,
  }),
  new Cmd('Look under', {
    rules:[cmdRules.isHereRule],
    regex:/^(look under|check under) (.+)$/,
    attName:"lookunder",
    objects:[
      {ignore:true},
      {scope:isPresent}
    ],
    defmsg:NOTHING_THERE,
  }),  
  new Cmd('Look inside', {
    rules:[cmdRules.isHereRule],
    regex:/^(look inside) (.+)$/,
    attName:"lookinside",
    objects:[
      {ignore:true},
      {scope:isPresent}
    ],
    defmsg:NOTHING_INSIDE,
  }),  
  new Cmd('Search', {
    rules:[cmdRules.isHereRule],
    regex:/^(search) (.+)$/,
    attName:"search",
    objects:[
      {ignore:true},
      {scope:isPresent}
    ],
    defmsg:NOTHING_THERE,
  }),  
  
  new Cmd('Take', {
    npcCmd:true,
    rules:[cmdRules.isHereRule, cmdRules.isReachableRule, cmdRules.charCanManipulateRule],
    regex:/^(take|get|pick up) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHereOrContained, multiple:true},
    ],
    defmsg:CANNOT_TAKE,
  }),
  new Cmd('Drop', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWornRule, cmdRules.charCanManipulateRule],
    regex:/^(drop) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    defmsg:NOT_CARRYING,
  }),
  new Cmd('Wear2', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWornRule, cmdRules.isHeldRule, cmdRules.charCanManipulateRule],
    regex:/^put (my |your |his |her |)(.+) on$/,
    attName:"wear",
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    defmsg:CANNOT_WEAR,
  }),
  new Cmd('Wear', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWornRule, cmdRules.isHeldRule, cmdRules.charCanManipulateRule],
    regex:/^(wear|don|put on) (my |your |his |her |)(.+)$/,
    objects:[
      {ignore:true},
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    defmsg:CANNOT_WEAR,
  }),
  new Cmd('Remove', {
    npcCmd:true,
    rules:[cmdRules.isWornRule, cmdRules.charCanManipulateRule],
    regex:/^(remove|doff|take off) (my |your |his |her |)(.+)$/,
    objects:[
      {ignore:true},
      {ignore:true},
      {scope:isWorn, multiple:true},
    ],
    defmsg:NOT_WEARING,
  }),
  new Cmd('Remove2', {
    npcCmd:true,
    rules:[cmdRules.isWornRule, cmdRules.charCanManipulateRule],
    regex:/^take (my |your |his |her |)(.+) off$/,
    attName:"remove",
    objects:[
      {ignore:true},
      {scope:isWorn, multiple:true},
    ],
    defmsg:NOT_WEARING,
  }),
  new Cmd('Read', {
    npcCmd:true,
    regex:/^(read) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    defmsg:CANNOT_READ,
  }),
  new Cmd('Eat', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWornRule, cmdRules.charCanManipulateRule],
    regex:/^(eat) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    defmsg:CANNOT_EAT,
  }),
  new Cmd('Smash', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(smash|break|destroy) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    defmsg:CANNOT_SMASH,
  }),
  new Cmd('Switch on', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(turn on|switch on) (.+)$/,
    attName:"switchon",
    cmdCategory:"SwitchOn",
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    defmsg:CANNOT_SWITCH_ON,
  }),
  new Cmd('Switch on2', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(turn|switch) (.+) on$/,
    attName:"switchon",
    cmdCategory:"SwitchOn",
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    defmsg:CANNOT_SWITCH_ON,
  }),
  
  new Cmd('Switch off2', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(turn|switch) (.+) off$/,
    attName:"switchoff",
    cmdCategory:"SwitchOff",
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    defmsg:CANNOT_SWITCH_OFF,
  }),
  new Cmd('Switch off', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(turn off|switch off) (.+)$/,
    attName:"switchoff",
    cmdCategory:"SwitchOff",
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
    defmsg:CANNOT_SWITCH_OFF,
  }),
  
  new Cmd('Open', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(open) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    defmsg:CANNOT_OPEN,
  }),
  
  new Cmd('Close', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(close) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    defmsg:CANNOT_CLOSE,
  }),
  
  new Cmd('Lock', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(lock) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    defmsg:CANNOT_LOCK,
  }),
  
  new Cmd('Unlock', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(unlock) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    defmsg:CANNOT_UNLOCK,
  }),
  
  new Cmd('Push', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(push|press) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent},
    ],
    defmsg:NOTHING_USEFUL,
  }),

  new Cmd('Pull', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(pull) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent},
    ],
    defmsg:NOTHING_USEFUL,
  }),
  new Cmd('Fill', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(fill) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent},
    ],
    defmsg:CANNOT_FILL,
  }),
  new Cmd('Empty', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(empty) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent},
    ],
    defmsg:CANNOT_EMPTY,
  }),

  new Cmd('Eat', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(eat|feed on|feed|partake of|partake|dine on|dine) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent},
    ],
    defmsg:CANNOT_EAT,
  }),
  new Cmd('Drink', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(drink|imbibe|quaff|guzzle|knock back|swig|swill) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent},
    ],
    defmsg:CANNOT_DRINK,
  }),
  new Cmd('Ingest', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(consume|swallow|ingest) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent},
    ],
    defmsg:CANNOT_INGEST,
  }),

  new Cmd('SitOn', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.charCanPostureRule],
    regex:/^(sit on|sit upon|sit) (.+)$/,
    attName:"siton",
    objects:[
      {ignore:true},
      {scope:isHere},
    ],
    defmsg:CANNOT_SIT_ON,
  }),
  new Cmd('StandOn', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.charCanPostureRule],
    regex:/^(stand on|stand upon|stand) (.+)$/,
    attName:"standon",
    objects:[
      {ignore:true},
      {scope:isHere},
    ],
    defmsg:CANNOT_STAND_ON,
  }),
  new Cmd('ReclineOn', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.charCanPostureRule],
    regex:/^(recline on|recline upon|recline|lie on|lie upon|lie) (.+)$/,
    attName:"reclineon",
    objects:[
      {ignore:true},
      {scope:isHere},
    ],
    defmsg:CANNOT_RECLINE_ON,
  }),
  new Cmd('GetOff', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.charCanPostureRule],
    regex:/^(get off|off) (.+)$/,
    attName:"getoff",
    cmdCategory:"Posture",
    objects:[
      {ignore:true},
      {scope:isHere},
    ],
    defmsg:ALREADY,
  }),

  new Cmd('Use', {
    npcCmd:true,
    rules:[cmdRules.charCanManipulateRule],
    regex:/^(use) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    defmsg:CANNOT_USE,
  }),
  
  new Cmd('Talk to', {
    regex:/^(talk to|talk|speak to|speak|converse with|converse) (.+)$/,
    rules:[cmdRules.charCanTalkRule],
    attName:"talkto",
    objects:[
      {ignore:true},
      {scope:isNpcAndHere},
    ],
    default:function(item) {
      msg("You chat to " + item.byname({article:DEFINITE}) + " for a few moments, before releasing that " + pronounVerb(item, "'be") + " not about to reply.");
      return false;
    },
  }),

  new Cmd('Topics', {
    regex:/^topics? (?:for )?(.+)$/,
    attName:"topics",
    objects:[
      {scope:isNpcAndHere},
    ],
    default:function(item) {
      metamsg("That's not something that will reply if you ask about anything.");
      return false;
    },
  }),

  
  // ----------------------------------
  // Complex commands
  
  new Cmd('Stand', {
    regex:/^stand$|^stand up$|^get up$/,
    script:function() {
      if (!game.player.posture) {
        msg(ALREADY(game.player));
        return FAILED;
      }
      if (!game.player.canPosture()) {
        return FAILED;
      }
      if (game.player.posture) {
        msg(STOP_POSTURE(game.player))
        return SUCCESS;
      }  
    },
  }),
  new Cmd('NpcStand1', {
    regex:/^(.+), ?(stand|stand up|get up)$/,
    cmdCategory:"Posture",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
    ],
    script:handleStandUpNpc,
  }),
  new Cmd('NpcStand2', {
    regex:/^tell (.+) to (stand|stand up|get up)$/,
    cmdCategory:"Posture",
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
    cmdCategory:"FillWith",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isLiquid},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        msg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleFillWithLiquid(npc, objects);
    },
  }),
  new Cmd('NpcFillWith2', {
    regex:/^tell (.+) to (fill) (.+) (with) (.+)$/,
    cmdCategory:"FillWith",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isLiquid},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        msg(NOT_NPC(npc));
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
    cmdCategory:"PutIn",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isPresent, attName: "container"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        msg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handlePutInContainer(npc, objects);
    },
  }),
  new Cmd('NpcPutIn2', {
    regex:/^tell (.+) to (put|place|drop) (.+) (in to|into|in|on to|onto|on) (.+)$/,
    cmdCategory:"PutIn",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isPresent, attName: "container"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        msg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handlePutInContainer(npc, objects);
    },
  }),

  new Cmd('TakeOut', {
    regex:/^(take|get|remove) (.+) (from|out of|out|off of|off) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isContained, multiple:true},
      {ignore:true},
      {scope:isPresent, attName: "container"},
    ],
    script:function(objects) {
      return handleTakeFromContainer(game.player, objects);
    },
  }),
  
  new Cmd('NpcTakeOut1', {
    regex:/^(.+), ?(take|get|remove) (.+) (from|out of|out|off of|off) (.+)$/,
    cmdCategory:"TakeOut",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isContained, multiple:true},
      {ignore:true},
      {scope:isPresent, attName: "container"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        msg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleTakeFromContainer(npc, objects);
    },
  }),
  new Cmd('NpcTakeOut2', {
    regex:/^tell (.+) to (take|get|remove) (.+) (from|out of|out|off of|off) (.+)$/,
    cmdCategory:"TakeOut",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isContained, multiple:true},
      {ignore:true},
      {scope:isPresent, attName: "container"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        msg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleTakeFromContainer(npc, objects);
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
    cmdCategory:"Give",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isPresentOrMe, attName: "npc"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        msg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleGiveToNpc(npc, objects);
    },
  }),
  new Cmd('NpcGiveTo2', {
    regex:/^tell (.+) to ?(give) (.+) (to) (.+)$/,
    cmdCategory:"Give",
    objects:[
      {scope:isHere, attName:"npc"},
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isPresent, attName: "npc"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        msg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleGiveToNpc(npc, objects);
    },
  }),
  

  
  

  new Cmd('AskAbout', {
    regex:/^(ask) (.+) (about) (.+)$/,
    script:function(arr) {
      if (!game.player.canTalk()) {
        return false;
      }
      if (!arr[0][0].askabout) {
        msg("You can ask " + this.pronouns.objective + " about " + arr[1] + " all you like, but " + pronounVerb(this, "'be") + " not about to reply.");
        return false;
      }
      const success = arr[0][0].askabout(arr[1]);
      return success ? SUCCESS : FAILED; 
    },
    objects:[
      {ignore:true},
      {scope:isNpcAndHere},
      {ignore:true},
      {text:true},
    ]
  }),
  new Cmd('TellAbout', {
    regex:/^(tell) (.+) (about) (.+)$/,
    script:function(arr) {
      if (!game.player.canTalk()) {
        return false;
      }
      if (!arr[0][0].askabout) {
        msg("You can tell " + this.pronouns.objective + " about " + arr[1] + " all you like, but " + pronounVerb(this, "'be") + " not paying any attention.");
        return false;
      }
      const success = arr[0][0].tellabout(arr[1]);
      return success ? SUCCESS : FAILED; 
    },
    objects:[
      {ignore:true},
      {scope:isNpcAndHere},
      {ignore:true},
      {text:true},
    ]
  }),
  
  






// DEBUG commands
  
  new Cmd('Inspect', {
    regex:/^(inspect) (.+)$/,
    script:function(arr) {
      if (!DEBUG) {
        errormsg("The INSPECT command is only available in debug mode.");
        return FAILED;
      }
      const item = arr[0][0];
      debugmsg("Name: " + item.name);
      for (let key in item) {
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
        errormsg("The TEST command is only available in debug mode.");
        return FAILED;
      }
      test.runTests();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),

  new Cmd('InspectCmd', {
    regex:/^(cmd) (.+)$/,
    script:function(arr) {
      if (!DEBUG) {
        errormsg("The CMD command is only available in debug mode.");
        return FAILED;
      }
      debugmsg ("Looking for " + arr[0]);
      for (let i = 0; i < commands.length; i++) {
        if (commands[i].name.toLowerCase() === arr[0] || (commands[i].cmdCategory && commands[i].cmdCategory.toLowerCase() === arr[0])) {
          debugmsg("Name: " + commands[i].name);
          for (let key in commands[i]) {
            if (commands[i].hasOwnProperty(key)) {
               debugmsg("--" + key + ": " + commands[i][key]);
            }
          }
        }
      }        
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {ignore:true},
      {text:true},
    ],
  }),




];











    
// Functions used by commands 
// (but not in the commands array)



function handleFillWithLiquid(char, objects) {
  let success = false;
  const container = objects[1][0];
  const multiple = objects[0].length > 1 || parser.currentCommand.all;
  if (!container.container) {
    msg(NOT_CONTAINER(char, container));
    return FAILED; 
  }
  if (container.closed) {
    msg(CONTAINER_CLOSED(char, container));
    return FAILED; 
  }
  if (!char.canManipulate()) {
    return FAILED;
  }
  for (let i = 0; i < objects[0].length; i++) {
    let flag = true;
    if (!char.getAgreement("Fill", objects[0][i])) {
      // The getAgreement should give the response
      continue;
    }
    if (container.testRestrictions) {
      flag = container.testRestrictions(objects[0][i], char);
    }
    if (flag) {
      if (!objects[0][i].isAtLoc(char.name)) {
        msg(prefix(objects[0][i], multiple) + NOT_CARRYING(char, objects[1][i]));
      }
      else {
        objects[0][i].moveToFrom(container.name, char.name);
        msg(prefix(objects[0][i], multiple) + DONE_MSG);
        success = true;
      }
    }
  }
  if (success && container.putInResponse) container.putInResponse();
  return success ? SUCCESS : FAILED;
}

function handlePutInContainer(char, objects) {
  let success = false;
  const container = objects[1][0];
  const multiple = objects[0].length > 1 || parser.currentCommand.all;
  if (!container.container) {
    msg(NOT_CONTAINER(char, container));
    return FAILED; 
  }
  if (container.closed) {
    msg(CONTAINER_CLOSED(char, container));
    return FAILED; 
  }
  if (!char.canManipulate()) {
    return FAILED;
  }
  for (let i = 0; i < objects[0].length; i++) {
    let flag = true;
    if (!char.getAgreement("Put/in", objects[0][i])) {
      // The getAgreement should give the response
      continue;
    }
    if (container.testRestrictions) {
      flag = container.testRestrictions(objects[0][i], char);
    }
    if (flag) {
      if (!objects[0][i].isAtLoc(char.name)) {
        msg(prefix(objects[0][i], multiple) + NOT_CARRYING(char, objects[1][i]));
      }
      else {
        objects[0][i].moveToFrom(container.name, char.name);
        msg(prefix(objects[0][i], multiple) + DONE_MSG);
        success = true;
      }
    }
  }
  if (success && container.putInResponse) container.putInResponse();
  if (success === SUCCESS) char.pause();
  return success ? SUCCESS : FAILED;
}

function handleTakeFromContainer(char, objects) {
  let success = false;
  const container = objects[1][0];
  const multiple = objects[0].length > 1 || parser.currentCommand.all;
  if (!container.container) {
    msg(NOT_CONTAINER(char, container));
    return FAILED; 
  }
  if (container.closed) {
    msg(CONTAINER_CLOSED(char, container));
    return FAILED; 
  }
  if (!char.canManipulate()) {
    return FAILED;
  }
  for (let i = 0; i < objects[0].length; i++) {
    let flag = true;
    if (!char.getAgreement("Take", objects[0][i])) {
      // The getAgreement should give the response
      continue;
    }
    if (flag) {
      if (!objects[0][i].isAtLoc(container.name)) {
        msg(prefix(objects[0][i], multiple) + NOT_INSIDE(container, objects[1][i]));
      }
      else {
        objects[0][i].moveToFrom(char.name, container.name);
        msg(prefix(objects[0][i], multiple) + DONE_MSG);
        success = true;
      }
    }
  }
  // This works for put in as this is the only way to do it, but not here
  // as TAKE can remove itsms from a container too.
  //if (success && container.putInResponse) container.putInResponse();
  if (success === SUCCESS) char.pause();
  return success ? SUCCESS : FAILED;
}



function handleGiveToNpc(char, objects) {
  let success = false;
  const npc = objects[1][0];
  const multiple = objects[0].length > 1 || parser.currentCommand.all;
  if (!npc.npc && npc !== game.player) {
    msg(NOT_NPC_FOR_GIVE(char, npc));
    return FAILED; 
  }
  for (let i = 0; i < objects[0].length; i++) {
    let flag = true;
    if (!char.getAgreement("Give", objects[0][i])) {
      // The getAgreement should give the response
    }
    if (npc.testRestrictions) {
      flag = npc.testRestrictions(objects[0][i]);
    }
    if (!npc.canManipulate()) {
      return FAILED;
    }
    if (flag) {
      if (!objects[0][i].isAtLoc(char.name)) {
        msg(prefix(objects[0][i], multiple) + NOT_CARRYING(char, objects[1][i]));
      }
      else {
        if (npc.giveReaction) {
          npc.giveReaction(objects[0][i], multiple, char);
        }
        else {
          msg(prefix(objects[0][i], multiple) + DONE_MSG);
          objects[0][i].moveToFrom(npc.name, char.name);
        }
        success = true;
      }
    }
  }
  if (success === SUCCESS) char.pause();
  return success ? SUCCESS : FAILED;
}


function handleStandUpNpc(objects) {
  const npc = objects[0][0];
  if (!npc.npc) {
    msg(NOT_NPC(npc));
    return FAILED; 
  }
  if (!npc.posture) {
    msg(ALREADY(npc));
    return FAILED;
  }
  if (npc.getAgreementPosture && !npc.getAgreementPosture("stand")) {
    // The getAgreement should give the response
    return FAILED;
  }
  else if (!npc.getAgreementPosture && npc.getAgreement && !npc.getAgreement("Posture", "stand")) {
    return FAILED;
  }
  if (!npc.canPosture()) {
    return FAILED;
  }
  if (npc.posture) {
    msg(STOP_POSTURE(npc))
    npc.pause();
    return SUCCESS;
  }  
}

