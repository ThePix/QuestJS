// A command has an arbitrary name, a regex or pattern, 
// and a script as a minimum.
// regex           A regex to match against
// objects         An array of matches in the regex (see wiki)
// script          This will be run on a successful match
// attName         If there is no script, then this attribute on the object will be used
// nothingForAll   If the player uses ALL and there is nothing there, use this error message
// noTurnscripts   Set to true to prevent turnscripts firing even when this command is successful

"use strict";




const cmdDirections = []
for (let i = 0; i < EXITS.length; i++) {
  if (EXITS[i].nocmd) continue;
  cmdDirections.push(EXITS[i].name);
  cmdDirections.push(EXITS[i].abbrev.toLowerCase());
  if (EXITS[i].alt) cmdDirections.push(EXITS[i].alt);
}



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
      if (ROOM_HEADINGS) msgHeading(sentenceCase(game.room.alias), 4);
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
      const listOfOjects = game.player.getContents(display.ALL);
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
  new Cmd('Purchase from list', {
    regex:/^buy$|^purchase$/,
    script:function() {
      const l = [];
      for (let key in w) {
        if (parser.isForSale(w[key])) {
          const price = w[key].getBuyingPrice(game.player)
          const row = [sentenceCase(w[key].byname()), displayMoney(price)]
          row.push(price > game.player.money ? "-" : "{cmd:buy " + w[key].alias + ":" + BUY + "}")
          l.push(row)
        }
      }
      if (l.length === 0) {
        failedmsg(NOTHING_FOR_SALE);
        return FAILED;
      }
      msg(CURRENT_MONEY + ": " + displayMoney(game.player.money));
      msgTable(l, BUY_HEADINGS)
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
      {scope:parser.isPresent}
    ],
    defmsg:DEFAULT_EXAMINE,
  }),
  new Cmd('Look at', {  // used for NPCs
    regex:/^(look at|look) (.+)$/,
    attName:'examine',
    objects:[
      {ignore:true},
      {scope:parser.isPresentOrMe}
    ],
    defmsg:DEFAULT_EXAMINE,
  }),
  new Cmd('Look out', {
    rules:[cmdRules.isHere],
    regex:/^(look out of|look out) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent}
    ],
    attName:"lookout",
    defmsg:CANNOT_LOOK_OUT,
  }),
  new Cmd('Look behind', {
    rules:[cmdRules.isHere],
    regex:/^(look behind|check behind) (.+)$/,
    attName:"lookbehind",
    objects:[
      {ignore:true},
      {scope:parser.isPresent}
    ],
    defmsg:NOTHING_THERE,
  }),
  new Cmd('Look under', {
    rules:[cmdRules.isHere],
    regex:/^(look under|check under) (.+)$/,
    attName:"lookunder",
    objects:[
      {ignore:true},
      {scope:parser.isPresent}
    ],
    defmsg:NOTHING_THERE,
  }),  
  new Cmd('Look inside', {
    rules:[cmdRules.isHere],
    regex:/^(look inside) (.+)$/,
    attName:"lookinside",
    objects:[
      {ignore:true},
      {scope:parser.isPresent}
    ],
    defmsg:NOTHING_INSIDE,
  }),  
  new Cmd('Search', {
    rules:[cmdRules.isHere],
    regex:/^(search) (.+)$/,
    attName:"search",
    objects:[
      {ignore:true},
      {scope:parser.isPresent}
    ],
    defmsg:NOTHING_THERE,
  }),  
  
  new Cmd('Take', {
    npcCmd:true,
    rules:[cmdRules.isHereNotHeld, cmdRules.canManipulate],
    regex:/^(take|get|pick up) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isHereOrContained, multiple:true},
    ],
    defmsg:CANNOT_TAKE,
  }),
  new Cmd('Drop', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.canManipulate],
    regex:/^(drop) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:NOT_CARRYING,
  }),
  new Cmd('Wear2', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.isHeld, cmdRules.canManipulate],
    regex:/^put (my |your |his |her |)(.+) on$/,
    attName:"wear",
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:function(char, item) {
      return item.ensemble ? CANNOT_WEAR_ENSEMBLE(char, item) : CANNOT_WEAR(char, item);
    },
  }),
  new Cmd('Wear', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.canManipulate],
    regex:/^(wear|don|put on) (my |your |his |her |)(.+)$/,
    objects:[
      {ignore:true},
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:function(char, item) {
      return item.ensemble ? CANNOT_WEAR_ENSEMBLE(char, item) : CANNOT_WEAR(char, item);
    },
  }),
  new Cmd('Remove', {
    npcCmd:true,
    rules:[cmdRules.isWorn, cmdRules.canManipulate],
    regex:/^(remove|doff|take off) (my |your |his |her |)(.+)$/,
    objects:[
      {ignore:true},
      {ignore:true},
      {scope:parser.isWorn, multiple:true},
    ],
    defmsg:function(char, item) {
      return item.ensemble ? CANNOT_WEAR_ENSEMBLE(char, item) : NOT_WEARING(char, item);
    },
  }),
  new Cmd('Remove2', {
    npcCmd:true,
    rules:[cmdRules.isWorn, cmdRules.canManipulate],
    regex:/^take (my |your |his |her |)(.+) off$/,
    attName:"remove",
    objects:[
      {ignore:true},
      {scope:parser.isWorn, multiple:true},
    ],
    defmsg:function(char, item) {
      return item.ensemble ? CANNOT_WEAR_ENSEMBLE(char, item) : NOT_WEARING(char, item);
    },
  }),
  new Cmd('Read', {
    npcCmd:true,
    rules:[cmdRules.isHere],
    regex:/^(read) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:CANNOT_READ,
  }),
  new Cmd('Eat', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.canManipulate],
    regex:/^(eat) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true, attName:"ingest"},
    ],
    defmsg:CANNOT_EAT,
  }),
  new Cmd('Purchase', {
    npcCmd:true,
    rules:[cmdRules.canManipulate],
    regex:/^(purchase|buy) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isForSale},
    ],
    defmsg:CANNOT_PURCHASE,
  }),
  new Cmd('Sell', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.canManipulate],
    regex:/^(sell) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:CANNOT_SELL,
  }),
  new Cmd('Smash', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(smash|break|destroy) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:CANNOT_SMASH,
  }),
  new Cmd('Switch on', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(turn on|switch on) (.+)$/,
    attName:"switchon",
    cmdCategory:"SwitchOn",
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:CANNOT_SWITCH_ON,
  }),
  new Cmd('Switch on2', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(turn|switch) (.+) on$/,
    attName:"switchon",
    cmdCategory:"SwitchOn",
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:CANNOT_SWITCH_ON,
  }),
  
  new Cmd('Switch off2', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(turn|switch) (.+) off$/,
    attName:"switchoff",
    cmdCategory:"SwitchOff",
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true, attName:"switchon"},
    ],
    defmsg:CANNOT_SWITCH_OFF,
  }),
  new Cmd('Switch off', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(turn off|switch off) (.+)$/,
    attName:"switchoff",
    cmdCategory:"SwitchOff",
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true, attName:"switchoff"},
    ],
    defmsg:CANNOT_SWITCH_OFF,
  }),
  
  new Cmd('Open', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(open) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, multiple:true, attName:"open"},
    ],
    defmsg:CANNOT_OPEN,
  }),
  
  new Cmd('Close', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(close) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, multiple:true, attName:"close"},
    ],
    defmsg:CANNOT_CLOSE,
  }),
  
  new Cmd('Lock', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(lock) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, multiple:true, attName:"lock"},
    ],
    defmsg:CANNOT_LOCK,
  }),
  
  new Cmd('Unlock', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(unlock) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, multiple:true, attName:"unlock"},
    ],
    defmsg:CANNOT_UNLOCK,
  }),
  
  new Cmd('Push', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(push|press) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent},
    ],
    defmsg:NOTHING_USEFUL,
  }),

  new Cmd('Pull', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(pull) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent},
    ],
    defmsg:NOTHING_USEFUL,
  }),
  new Cmd('Fill', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    regex:/^(fill) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent},
    ],
    defmsg:CANNOT_FILL,
  }),
  new Cmd('Empty', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    regex:/^(empty) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent},
    ],
    defmsg:CANNOT_EMPTY,
  }),

  new Cmd('Eat', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    regex:/^(eat|feed on|feed|partake of|partake|dine on|dine) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, attName:"ingest"},
    ],
    defmsg:CANNOT_EAT,
  }),
  new Cmd('Drink', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    regex:/^(drink|imbibe|quaff|guzzle|knock back|swig|swill) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, attName:"ingest"},
    ],
    defmsg:CANNOT_DRINK,
  }),
  new Cmd('Ingest', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    regex:/^(consume|swallow|ingest) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, attName:"ingest"},
    ],
    defmsg:CANNOT_INGEST,
  }),

  new Cmd('SitOn', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.canPosture, cmdRules.isHereNotHeld],
    regex:/^(sit on|sit upon|sit) (.+)$/,
    attName:"siton",
    objects:[
      {ignore:true},
      {scope:parser.isHere, attName:"assumePosture"},
    ],
    defmsg:CANNOT_SIT_ON,
  }),
  new Cmd('StandOn', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.canPosture, cmdRules.isHereNotHeld],
    regex:/^(stand on|stand upon|stand) (.+)$/,
    attName:"standon",
    objects:[
      {ignore:true},
      {scope:parser.isHere, attName:"assumePosture"},
    ],
    defmsg:CANNOT_STAND_ON,
  }),
  new Cmd('ReclineOn', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.canPosture, cmdRules.isHereNotHeld],
    regex:/^(recline on|recline upon|recline|lie on|lie upon|lie) (.+)$/,
    attName:"reclineon",
    objects:[
      {ignore:true},
      {scope:parser.isHere, attName:"assumePosture"},
    ],
    defmsg:CANNOT_RECLINE_ON,
  }),
  new Cmd('GetOff', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.canPosture, cmdRules.isHereNotHeld],
    regex:/^(get off|off) (.+)$/,
    attName:"getoff",
    cmdCategory:"Posture",
    objects:[
      {ignore:true},
      {scope:parser.isHere, attName:"assumePosture"},
    ],
    defmsg:ALREADY,
  }),

  new Cmd('Use', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(use) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, multiple:true},
    ],
    defmsg:CANNOT_USE,
  }),
  
  new Cmd('Talk to', {
    regex:/^(talk to|talk|speak to|speak|converse with|converse) (.+)$/,
    rules:[cmdRules.canTalkTo],
    attName:"talkto",
    objects:[
      {ignore:true},
      {scope:parser.isNpcAndHere},
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
      {scope:parser.isNpcAndHere},
    ],
    default:function(item) {
      metamsg("That's not something that will reply if you ask about anything.");
      return false;
    },
  }),

  
  // ----------------------------------
  // Complex commands
  
  
  
  new Cmd('Say', {
    regex:/^(say|shout|whisper) (.+)$/,
    script:function(arr) {
      const l = [];
      for (let key in w) {
        if (w[key].sayCanHear && w[key].sayCanHear(game.player, arr[0])) l.push(w[key]);
      }
      l.sort(function(a, b) { return (b.sayPriority + b.sayBonus) - (a.sayPriority + b.sayBonus); });
      if (l.length === 0) {
        msg(nounVerb(game.player, arr[0], true) + ", '" + sentenceCase(arr[1]) + ",' but no one notices.");
        return SUCCESS;
      }

      msg(nounVerb(game.player, arr[0], true) + ", '" + sentenceCase(arr[1]) + ".'");
      for (let chr of l) {
        if (chr.sayResponse && chr.sayResponse(arr[1], arr[0])) return SUCCESS;
      }
      msg("No one seemed interested in what you say.")
      return SUCCESS;
    },
    objects:[
      {text:true},
      {text:true},
    ]
  }),
  
  
  new Cmd('Stand', {
    regex:/^stand$|^stand up$|^get up$/,
    rules:[cmdRules.canPosture],
    script:handleStandUp,
  }),
  new Cmd('NpcStand1', {
    regex:/^(.+), ?(stand|stand up|get up)$/,
    rules:[cmdRules.canPosture],
    cmdCategory:"Posture",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {ignore:true},
    ],
    script:handleStandUp,
  }),
  new Cmd('NpcStand2', {
    regex:/^tell (.+) to (stand|stand up|get up)$/,
    rules:[cmdRules.canPosture],
    cmdCategory:"Posture",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {ignore:true},
    ],
    script:handleStandUp,
  }),
  
  
  
  
  new Cmd('FillWith', {
    regex:/^(fill) (.+) (with) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
      {ignore:true},
      {scope:parser.isLiquid},
    ],
    script:function(objects) {
      return handleFillWithLiquid(game.player, objects);
    },
  }),
  new Cmd('NpcFillWith1', {
    regex:/^(.+), ?(fill) (.+) (with) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"FillWith",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
      {ignore:true},
      {scope:parser.isLiquid},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleFillWithLiquid(npc, objects);
    },
  }),
  new Cmd('NpcFillWith2', {
    regex:/^tell (.+) to (fill) (.+) (with) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"FillWith",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
      {ignore:true},
      {scope:parser.isLiquid},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleFillWithLiquid(npc, objects);
    },
  }),


  new Cmd('PutIn', {
    regex:/^(put|place|drop) (.+) (in to|into|in|on to|onto|on) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
      {ignore:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      return handlePutInContainer(game.player, objects);
    },
  }),
  
  new Cmd('NpcPutIn1', {
    regex:/^(.+), ?(put|place|drop) (.+) (in to|into|in|on to|onto|on) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"PutIn",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
      {ignore:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handlePutInContainer(npc, objects);
    },
  }),
  new Cmd('NpcPutIn2', {
    regex:/^tell (.+) to (put|place|drop) (.+) (in to|into|in|on to|onto|on) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"PutIn",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
      {ignore:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handlePutInContainer(npc, objects);
    },
  }),

  new Cmd('TakeOut', {
    regex:/^(take|get|remove) (.+) (from|out of|out|off of|off) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {ignore:true},
      {scope:parser.isContained, multiple:true},
      {ignore:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      return handleTakeFromContainer(game.player, objects);
    },
  }),
  
  new Cmd('NpcTakeOut1', {
    regex:/^(.+), ?(take|get|remove) (.+) (from|out of|out|off of|off) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"TakeOut",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {ignore:true},
      {scope:parser.isContained, multiple:true},
      {ignore:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleTakeFromContainer(npc, objects);
    },
  }),
  new Cmd('NpcTakeOut2', {
    regex:/^tell (.+) to (take|get|remove) (.+) (from|out of|out|off of|off) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"TakeOut",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {ignore:true},
      {scope:parser.isContained, multiple:true},
      {ignore:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleTakeFromContainer(npc, objects);
    },
  }),

  new Cmd('GiveTo', {
    regex:/^(give) (.+) (to) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
      {ignore:true},
      {scope:parser.isPresent, attName: "npc"},
    ],
    script:function(objects) {
      return handleGiveToNpc(game.player, objects);
    },
  }),
  new Cmd('NpcGiveTo1', {
    regex:/^(.+), ?(give) (.+) (to) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"Give",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
      {ignore:true},
      {scope:parser.isPresentOrMe, attName: "npc"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleGiveToNpc(npc, objects);
    },
  }),
  new Cmd('NpcGiveTo2', {
    regex:/^tell (.+) to ?(give) (.+) (to) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"Give",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
      {ignore:true},
      {scope:parser.isPresent, attName: "npc"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handleGiveToNpc(npc, objects);
    },
  }),



  new Cmd('PushExit', {
    regex:new RegExp("^(push|pull|move|shift) (.+) (" + cmdDirections.join("|") + ")$"),
    rules:[cmdRules.canManipulate, cmdRules.isHereNotHeld],
    cmdCategory:"Push",
    script:function(objects) {
      return handlePushExit(game.player, objects);
    },
    objects:[
      {text:true},
      {scope:parser.isHere, attName:"shiftable"},
      {text:true},
    ]
  }),
  new Cmd('NpcPushExit1', {
    regex:new RegExp("^(.+), ?(push|pull|move|shift) (.+) (" + cmdDirections.join("|") + ")$"),
    rules:[cmdRules.canManipulate, cmdRules.isHereNotHeld],
    cmdCategory:"Push",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handlePushExit(npc, objects);
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {text:true},
      {scope:parser.isHere, attName:"shiftable"},
      {text:true},
    ]
  }),
  new Cmd('NpcPushExit2', {
    regex:new RegExp("^tell (.+) to (push|pull|move|shift) (.+) (" + cmdDirections.join("|") + ")$"),
    rules:[cmdRules.canManipulate, cmdRules.isHereNotHeld],
    cmdCategory:"Push",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(NOT_NPC(npc));
        return FAILED; 
      }
      objects.shift();
      return handlePushExit(npc, objects);
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {text:true},
      {scope:parser.isHere, attName:"shiftable"},
      {text:true},
    ]
  }),
  




  
  

  new Cmd('AskAbout', {
    regex:/^(ask) (.+) (about) (.+)$/,
    rules:[cmdRules.canTalkTo],
    script:function(arr) {
      if (!game.player.canTalk()) {
        return false;
      }
      if (!arr[0][0].askabout) {
        failedmsg("You can ask " + this.pronouns.objective + " about " + arr[1] + " all you like, but " + pronounVerb(this, "'be") + " not about to reply.");
        return false;
      }
      const success = arr[0][0].askabout(arr[1]);
      return success ? SUCCESS : FAILED; 
    },
    objects:[
      {ignore:true},
      {scope:parser.isNpcAndHere},
      {ignore:true},
      {text:true},
    ]
  }),
  new Cmd('TellAbout', {
    regex:/^(tell) (.+) (about) (.+)$/,
    rules:[cmdRules.canTalkTo],
    script:function(arr) {
      if (!game.player.canTalk()) {
        return false;
      }
      if (!arr[0][0].askabout) {
        failedmsg("You can tell " + this.pronouns.objective + " about " + arr[1] + " all you like, but " + pronounVerb(this, "'be") + " not paying any attention.");
        return false;
      }
      const success = arr[0][0].tellabout(arr[1]);
      return success ? SUCCESS : FAILED; 
    },
    objects:[
      {ignore:true},
      {scope:parser.isNpcAndHere},
      {ignore:true},
      {text:true},
    ]
  }),
  
  






// DEBUG commands
  




];




if (DEBUG) {
  commands.unshift(new Cmd('Walk Through', {
    regex:/^wt (.+)$/,
    objects:[
      {text:true},
    ],
    script:function(objects) {
      const wt = walkthroughs[objects[0]]
      if (wt === undefined) {
        debugmsg("No walkthought found called " + objects[0]);
        return;
      }
      for (let i = 0; i < wt.length; i++) {
        debugmsg(wt[i]);
        parser.parse(wt[i]);
      }
    },
  })) 


  commands.unshift(new Cmd('Inspect', {
    regex:/^(inspect) (.+)$/,
    script:function(arr) {
      const item = arr[0][0];
      debugmsg("See the console for details on the object " + item.name + " (press F12 to display the console)");
      console.log(item);
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {ignore:true},
      {scope:parser.isInWorld},
    ],
  }))

  commands.unshift(new Cmd('Test', {
    regex:/^test$/,
    script:function() {
      test.runTests();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }))

  commands.unshift(new Cmd('InspectCmd', {
    regex:/^(cmd) (.+)$/,
    script:function(arr) {
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
  }))

  commands.unshift(new Cmd('ParserDebug', {
    regex:/^parser$/,
    script:function(arr) {
      if (parser.debug) {
        parser.debug = false
        debugmsg ("Parser debugging messages are off.");
      }
      else {
        parser.debug = true
        debugmsg ("Parser debugging messages are on.");
      }
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
    ],
  }))
}







    
// Functions used by commands 
// (but not in the commands array)



function handleFillWithLiquid(char, objects) {
  let success = false;
  const container = objects[1][0];
  const multiple = objects[0].length > 1 || parser.currentCommand.all;
  if (!container.container) return failedmsg(NOT_CONTAINER(char, container));
  if (container.closed) {
    failedmsg(CONTAINER_CLOSED(char, container));
    return FAILED; 
  }
  if (!char.canManipulate(objects[0], "fill")) {
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
        failedmsg(prefix(objects[0][i], multiple) + NOT_CARRYING(char, objects[1][i]));
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
    failedmsg(NOT_CONTAINER(char, container));
    return FAILED; 
  }
  if (container.closed) {
    failedmsg(CONTAINER_CLOSED(char, container));
    return FAILED; 
  }
  if (!char.canManipulate(objects[0], "put")) {
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
        failedmsg(prefix(objects[0][i], multiple) + NOT_CARRYING(char, objects[1][i]));
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
    failedmsg(NOT_CONTAINER(char, container));
    return FAILED; 
  }
  if (container.closed) {
    failedmsg(CONTAINER_CLOSED(char, container));
    return FAILED; 
  }
  if (!char.canManipulate(objects[0], "get")) {
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
        failedmsg(prefix(objects[0][i], multiple) + NOT_INSIDE(container, objects[1][i]));
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
    failedmsg(NOT_NPC_FOR_GIVE(char, npc));
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
    if (!npc.canManipulate(objects[0], "give")) {
      return FAILED;
    }
    if (flag) {
      if (!objects[0][i].isAtLoc(char.name)) {
        failedmsg(prefix(objects[0][i], multiple) + NOT_CARRYING(char, objects[1][i]));
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


function handleStandUp(objects) {
  const npc = objects.length === 0 ? game.player : objects[0][0];
  if (!npc.npc) {
    failedmsg(NOT_NPC(npc));
    return FAILED; 
  }
  if (!npc.posture) {
    failedmsg(ALREADY(npc));
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

// we know the char can manipulate, we know the obj is here and not held
function handlePushExit(char, objects) {
  const verb = getDir(objects[0]);
  const obj = objects[1][0];
  const dir = getDir(objects[2]);
  const room = w[char.loc]
  
  if (!obj.shiftable && obj.takeable) {
    msg(TAKE_NOT_PUSH(char, obj));
    return FAILED;
  }
  if (!obj.shiftable) {
    msg(CANNOT_PUSH(char, obj));
    return FAILED;
  }
  if (!room[dir] || room[dir].isHidden()) {
    msg(NOT_THAT_WAY(char, dir));
    return FAILED;
  }
  if (room[dir].isLocked()) {
    msg(LOCKED_EXIT(char, room[dir]));
    return FAILED;
  }
  if (typeof room[dir].noShiftingMsg === "function") {
    msg(room[dir].noShiftingMsg(char, item));
    return FAILED;
  }
  if (typeof room[dir].noShiftingMsg === "string") {
    msg(room[dir].noShiftingMsg);
    return FAILED;
  }
  
  if (typeof obj.shift === "function") {
    const res = obj.shift(char, dir, verb);
    return res ? SUCCESS : FAILED;
  }
  
  // by default, objects cannot be pushed up
  if (dir === "up") {
    msg(CANNOT_PUSH_UP(char, obj));
    return FAILED;
  }
  
  // not using moveToFrom; if there are 
  const dest = room[dir].name;
  obj.moveToFrom(dest);
  char.loc = dest;
  msg(PUSH_EXIT_SUCCESSFUL(char, obj, dir, w[dest]));
  return SUCCESS;
}