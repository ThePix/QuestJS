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
for (let exit of lang.exit_list) {
  if (exit.nocmd) continue;
  cmdDirections.push(exit.name);
  cmdDirections.push(exit.abbrev.toLowerCase());
  if (exit.alt) cmdDirections.push(exit.alt);
}



const commands = [
  // ----------------------------------
  // Single word commands
  
  // Cannot just set the script to helpScript as we need to allow the
  // author to change it in code.js, which is loaded after this.
  new Cmd('Help', {
    regex:/^help$|^\?$/,
    script:lang.helpScript,
  }),    
  new Cmd('Credits', {
    regex:/^about$|^credit$|^credits\?$/,
    script:lang.aboutScript,
  }),
  
  
  new Cmd('Spoken', {
    regex:/^spoken$/,
    script:function() {
      game.spoken = true;
      metamsg(lang.spoken_on);
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
      metamsg(lang.spoken_off);
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Brief', {
    regex:/^brief$/,
    script:function() {
      game.verbosity = BRIEF;
      metamsg(lang.mode_brief);
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Terse', {
    regex:/^terse$/,
    script:function() {
      game.verbosity = TERSE;
      metamsg(lang.mode_terse);
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Verbose', {
    regex:/^verbose$/,
    script:function() {
      game.verbosity = VERBOSE;
      metamsg(llang.mode_verbose);
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  
  new Cmd('Transcript', {
    regex:/^transcript|script$/,
    script:lang.transcriptScript,
  }),
  new Cmd('TranscriptOn', {
    regex:/^transcript on|script on$/,
    script:function() {
      if (game.transcript) {
        metamsg(lang.transcript_already_on);
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
        metamsg(lang.transcript_already_off);
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
        metamsg(lang.undo_disabled);
        return FAILED;
      }
      if (game.gameState.length < 2) {
        metamsg(lang.undo_not_available);
        return FAILED;
      }
      game.gameState.pop();
      const gameState = game.gameState[game.gameState.length - 1];
      metamsg(lang.undo_done);
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
      msg(lang.can_go());
      return LOOK_COUNTS_AS_TURN ? SUCCESS : SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Wait', {
    regex:/^wait$|^z$/,
    script:function() {
      msg(lang.wait_msg);
      return SUCCESS;
    },
  }),
  new Cmd('TopicsNote', {
    regex:/^topics?$/,
    script:lang.topicsScript,
  }),
  
  new Cmd('Inv', {
    regex:/^inventory$|^inv$|^i$/,
    script:function() {
      const listOfOjects = game.player.getContents(display.ALL);
      msg("You are carrying " + formatList(listOfOjects, {article:INDEFINITE, lastJoiner:lang.list_and, modified:true, nothing:lang.list_nothing, loc:game.player.name}) + ".");
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
        msg(no_smell(game.player));
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
        msg(no_listen(game.player));
      }
      return SUCCESS;
    },
  }),
  new Cmd('PurchaseFromList', {
    regex:/^buy$|^purchase$/,
    script:function() {
      const l = [];
      for (let key in w) {
        if (parser.isForSale(w[key])) {
          const price = w[key].getBuyingPrice(game.player)
          const row = [sentenceCase(w[key].byname()), displayMoney(price)]
          row.push(price > game.player.money ? "-" : "{cmd:buy " + w[key].alias + ":" + buy + "}")
          l.push(row)
        }
      }
      if (l.length === 0) {
        failedmsg(nothing_for_sale);
        return FAILED;
      }
      msg(current_money + ": " + displayMoney(game.player.money));
      msgTable(l, buy_headings)
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  
  // ----------------------------------
  // File system commands
  new Cmd('Save', {
    regex:/^save$/,
    script:lang.saveLoadScript,
  }),
  new Cmd('SaveGame', {
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
    script:lang.saveLoadScript,
  }),
  new Cmd('LoadGame', {
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
  new Cmd('DeleteGame', {
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
      {scope:parser.isPresent, multiple:true}
    ],
    defmsg:lang.default_examine,
  }),
  new Cmd('LookAt', {  // used for NPCs
    regex:/^(look at|look) (.+)$/,
    attName:'examine',
    objects:[
      {ignore:true},
      {scope:parser.isPresentOrMe}
    ],
    defmsg:lang.default_examine,
  }),
  new Cmd('LookOut', {
    rules:[cmdRules.isHere],
    regex:/^(look out of|look out) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent}
    ],
    attName:"lookout",
    defmsg:lang.cannot_look_out,
  }),
  new Cmd('LookBehind', {
    rules:[cmdRules.isHere],
    regex:/^(look behind|check behind) (.+)$/,
    attName:"lookbehind",
    objects:[
      {ignore:true},
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_there,
  }),
  new Cmd('LookUnder', {
    rules:[cmdRules.isHere],
    regex:/^(look under|check under) (.+)$/,
    attName:"lookunder",
    objects:[
      {ignore:true},
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_there,
  }),  
  new Cmd('LookInside', {
    rules:[cmdRules.isHere],
    regex:/^(look inside) (.+)$/,
    attName:"lookinside",
    objects:[
      {ignore:true},
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_inside,
  }),  
  new Cmd('Search', {
    rules:[cmdRules.isHere],
    regex:/^(search) (.+)$/,
    attName:"search",
    objects:[
      {ignore:true},
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_there,
  }),  
  
  new Cmd('Take', {
    npcCmd:true,
    rules:[cmdRules.isHereNotHeld, cmdRules.canManipulate],
    regex:/^(take|get|pick up) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isHereOrContained, multiple:true},
    ],
    defmsg:lang.cannot_take,
  }),
  new Cmd('Drop', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.canManipulate],
    regex:/^(drop) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.not_carrying,
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
      return item.ensemble ? lang.cannot_wear_ensemble(char, item) : lang.cannot_wear(char, item);
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
      return item.ensemble ? lang.cannot_wear_ensemble(char, item) : lang.cannot_wear(char, item);
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
      return item.ensemble ? lang.cannot_wear_ensemble(char, item) : lang.not_wearing(char, item);
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
      return item.ensemble ? lang.cannot_wear_ensemble(char, item) : lang.not_wearing(char, item);
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
    defmsg:lang.cannot_read,
  }),
  new Cmd('Eat', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.canManipulate],
    regex:/^(eat) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true, attName:"ingest"},
    ],
    defmsg:lang.cannot_eat,
  }),
  new Cmd('Purchase', {
    npcCmd:true,
    rules:[cmdRules.canManipulate],
    regex:/^(purchase|buy) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isForSale},
    ],
    defmsg:lang.cannot_purchase,
  }),
  new Cmd('Sell', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.canManipulate],
    regex:/^(sell) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_sell,
  }),
  new Cmd('Smash', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(smash|break|destroy) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_smash,
  }),
  new Cmd('SwitchOn', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(turn on|switch on) (.+)$/,
    attName:"switchon",
    cmdCategory:"SwitchOn",
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_switch_on,
  }),
  new Cmd('SwitchOn2', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(turn|switch) (.+) on$/,
    attName:"switchon",
    cmdCategory:"SwitchOn",
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_switch_on,
  }),
  
  new Cmd('SwitchOff2', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(turn|switch) (.+) off$/,
    attName:"switchoff",
    cmdCategory:"SwitchOff",
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true, attName:"switchon"},
    ],
    defmsg:lang.cannot_switch_off,
  }),
  new Cmd('SwitchOff', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(turn off|switch off) (.+)$/,
    attName:"switchoff",
    cmdCategory:"SwitchOff",
    objects:[
      {ignore:true},
      {scope:parser.isHeld, multiple:true, attName:"switchoff"},
    ],
    defmsg:lang.cannot_switch_off,
  }),
  
  new Cmd('Open', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(open) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, multiple:true, attName:"open"},
    ],
    defmsg:lang.cannot_open,
  }),
  
  new Cmd('Close', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(close) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, multiple:true, attName:"close"},
    ],
    defmsg:lang.cannot_close,
  }),
  
  new Cmd('Lock', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(lock) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, multiple:true, attName:"lock"},
    ],
    defmsg:lang.cannot_lock,
  }),
  
  new Cmd('Unlock', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(unlock) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, multiple:true, attName:"unlock"},
    ],
    defmsg:lang.cannot_unlock,
  }),
  
  new Cmd('Push', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(push|press) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent},
    ],
    defmsg:lang.nothing_useful,
  }),

  new Cmd('Pull', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(pull) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent},
    ],
    defmsg:lang.nothing_useful,
  }),
  new Cmd('Fill', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    regex:/^(fill) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent},
    ],
    defmsg:lang.cannot_fill,
  }),
  new Cmd('Empty', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    regex:/^(empty) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent},
    ],
    defmsg:lang.cannot_empty,
  }),

  new Cmd('Eat', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    regex:/^(eat|feed on|feed|partake of|partake|dine on|dine) (.+)$/,
    objects:[
      {text:true},
      {scope:parser.isPresent, attName:"ingest"},
    ],
    defmsg:lang.cannot_eat,
  }),
  new Cmd('Drink', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    regex:/^(drink|imbibe|quaff|guzzle|knock back|swig|swill|sip|down|chug) (.+)$/,
    objects:[
      {text:true},
      {scope:parser.isPresent, attName:"ingest"},
    ],
    defmsg:lang.cannot_drink,
  }),
  new Cmd('Ingest', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    regex:/^(consume|swallow|ingest) (.+)$/,
    objects:[
      {text:true},
      {scope:parser.isPresent, attName:"ingest"},
    ],
    defmsg:lang.cannot_ingest,
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
    defmsg:lang.cannot_sit_on,
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
    defmsg:lang.cannot_stand_on,
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
    defmsg:lang.cannot_recline_on,
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
    defmsg:lang.already,
  }),

  new Cmd('Use', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    regex:/^(use) (.+)$/,
    objects:[
      {ignore:true},
      {scope:parser.isPresent, multiple:true},
    ],
    defmsg:lang.cannot_use,
  }),
  
  new Cmd('TalkTo', {
    regex:/^(talk to|talk|speak to|speak|converse with|converse) (.+)$/,
    rules:[cmdRules.canTalkTo],
    attName:"talkto",
    objects:[
      {ignore:true},
      {scope:parser.isNpcAndHere},
    ],
    default:function(item) {
      return failedmsg(cannot_talk_to(game.player, item));
    },
  }),

  new Cmd('Topics', {
    regex:/^topics? (?:for )?(.+)$/,
    attName:"topics",
    objects:[
      {scope:parser.isNpcAndHere},
    ],
    default:function(item) {
      return failedmsg(no_topics(game.player, item));
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
        msg(lang.say_no_one_here(game.player, arr[0], arr[1]));
        return SUCCESS;
      }

      if (GIVE_PLAYER_SAY_MSG) msg(lang.nounVerb(game.player, arr[0], true) + ", '" + sentenceCase(arr[1]) + ".'");
      for (let chr of l) {
        if (chr.sayQuestion && w[chr.sayQuestion].sayResponse(chr, arr[1])) return SUCCESS;
        if (chr.sayResponse && chr.sayResponse(arr[1], arr[0])) return SUCCESS;
      }
      if (GIVE_PLAYER_SAY_MSG) {
        msg(lang.say_no_response(game.player, arr[0], arr[1]));
      }
      else {      
        msg(lang.say_no_response_full(game.player, arr[0], arr[1]));
      }
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
      {scope:parser.isHeld},
      {ignore:true},
      {scope:parser.isLiquid},
    ],
    script:function(objects) {
      return handleFillWithLiquid(game.player, objects[0][0], objects[1][0]);
    },
  }),
  new Cmd('NpcFillWith1', {
    regex:/^(.+), ?(fill) (.+) (with) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"FillWith",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {ignore:true},
      {scope:parser.isHeld},
      {ignore:true},
      {scope:parser.isLiquid},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(lang.not_npc(npc));
        return FAILED; 
      }
      objects.shift();
      return handleFillWithLiquid(npc, objects[0][0], objects[1][0]);
    },
  }),
  new Cmd('NpcFillWith2', {
    regex:/^tell (.+) to (fill) (.+) (with) (.+)$/,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"FillWith",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {ignore:true},
      {scope:parser.isHeld},
      {ignore:true},
      {scope:parser.isLiquid},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(lang.not_npc(npc));
        return FAILED; 
      }
      objects.shift();
      return handleFillWithLiquid(npc, objects[0][0], objects[1][0]);
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
        failedmsg(lang.not_npc(npc));
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
        failedmsg(lang.not_npc(npc));
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
        failedmsg(lang.not_npc(npc));
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
        failedmsg(lang.not_npc(npc));
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
        failedmsg(lang.not_npc(npc));
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
        failedmsg(lang.not_npc(npc));
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
        failedmsg(lang.not_npc(npc));
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
        failedmsg(lang.not_npc(npc));
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
      if (!game.player.canTalk()) return false;
      if (!arr[0][0].askabout) return failedmsg(cannot_ask_about(game.player, arr[0][0], arr[1]));

      return arr[0][0].askabout(arr[1]) ? SUCCESS : FAILED; 
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
      if (!game.player.canTalk()) return false;
      if (!arr[0][0].tellabout) return failedmsg(cannot_tell_about(game.player, arr[0][0], arr[1]));

      return arr[0][0].tellabout(arr[1]) ? SUCCESS : FAILED; 
    },
    objects:[
      {ignore:true},
      {scope:parser.isNpcAndHere},
      {ignore:true},
      {text:true},
    ]
  }),
  
];




// DEBUG commands

if (DEBUG) {
  commands.unshift(new Cmd('DebugWalkThrough', {
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
      for (el of wt) {
        debugmsg(el);
        parser.parse(el);
      }
    },
  })) 

  commands.unshift(new Cmd('DebugInspect', {
    regex:/^inspect (.+)$/,
    script:function(arr) {
      const item = arr[0][0];
      debugmsg("See the console for details on the object " + item.name + " (press F12 to display the console)");
      console.log(item);
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {scope:parser.isInWorld},
    ],
  }))

  commands.unshift(new Cmd('DebugInspectByName', {
    regex:/^inspect2 (.+)$/,
    script:function(arr) {
      const item_name = arr[0]
      if (!w[item_name]) {
        debugmsg("No object called " + item_name);
        return FAILED;
      }
       
      debugmsg("See the console for details on the object " + item_name + " (press F12 to display the console)");
      console.log(w[item_name]);
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {text:true},
    ],
  }))

  commands.unshift(new Cmd('DebugTest', {
    regex:/^test$/,
    script:function() {
      test.runTests();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }))

  commands.unshift(new Cmd('DebugInspectCommand', {
    regex:/^(cmd) (.+)$/,
    script:function(arr) {
      debugmsg ("Looking for " + arr[0]);
      for (let cmd of commands) {
        if (cmd.name.toLowerCase() === arr[0] || (cmd.cmdCategory && cmd.cmdCategory.toLowerCase() === arr[0])) {
          debugmsg("Name: " + cmd.name);
          for (let key in cmd) {
            if (cmd.hasOwnProperty(key)) {
               debugmsg("--" + key + ": " + cmd[key]);
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

  commands.unshift(new Cmd('DebugListCommands', {
    regex:/^cmds$/,
    script:function(arr) {
      let count = 0;
      for (let cmd of commands) {
        if (!cmd.name.match(/\d$/)) {
          let s = cmd.name + " (" + cmd.regex
          
          let altCmd
          let n = 2
          do {
            altCmd = commands.find(el => el.name === cmd.name + n)
            if (altCmd) s += " or " + altCmd.regex
            n++
          } while (altCmd)
          s += ")"
        
          const npcCmd = commands.find(el => el.name === "Npc" + cmd.name + "2")
          if (npcCmd) s += " - NPC too"
          debugmsg(s);
          count++;
        }
      }        
      debugmsg("... Found " + count + " commands.");
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
    ],
  }))

  commands.unshift(new Cmd('DebugParserToggle', {
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


// Cannot handle multiple vessels
function handleFillWithLiquid(char, vessel, liquid) {
  if (!vessel.vessel) return failedmsg(lang.not_vessel(char, vessel));
  if (vessel.closed) return  failedmsg(lang.container_closed(char, vessel));
  if (!char.canManipulate(vessel, "fill")) return FAILED;
  if (!char.getAgreement("Fill", vessel)) return FAILED;
  if (!vessel.isAtLoc(char.name)) return failedmsg(lang.not_carrying(char, vessel));

  return vessel.fill(false, char, liquid) ? SUCCESS: FAILED;
}

function handlePutInContainer(char, objects) {
  let success = false;
  const container = objects[1][0];
  const multiple = objects[0].length > 1 || parser.currentCommand.all;
  if (!container.container) {
    failedmsg(lang.not_container(char, container));
    return FAILED; 
  }
  if (container.closed) {
    failedmsg(lang.container_closed(char, container));
    return FAILED; 
  }
  if (!char.canManipulate(objects[0], "put")) {
    return FAILED;
  }
  for (let obj of objects[0]) {
    let flag = true;
    if (!char.getAgreement("Put/in", obj)) {
      // The getAgreement should give the response
      continue;
    }
    if (!container.testForRecursion(char, obj)) {
      flag = false;
    }
    if (container.testRestrictions) {
      flag = container.testRestrictions(obj, char);
    }
    if (flag) {
      if (!obj.isAtLoc(char.name)) {
        failedmsg(prefix(obj, multiple) + lang.not_carrying(char, obj));
      }
      else {
        obj.moveToFrom(container.name, char.name);
        msg(prefix(obj, multiple) + lang.done_msg);
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
    failedmsg(lang.not_container(char, container));
    return FAILED; 
  }
  if (container.closed) {
    failedmsg(lang.container_closed(char, container));
    return FAILED; 
  }
  if (!char.canManipulate(objects[0], "get")) {
    return FAILED;
  }
  for (let obj of objects[0]) {
    let flag = true;
    if (!char.getAgreement("Take", obj)) {
      // The getAgreement should give the response
      continue;
    }
    if (flag) {
      if (!obj.isAtLoc(container.name)) {
        failedmsg(prefix(obj, multiple) + lang.not_inside(container, obj));
      }
      else {
        obj.moveToFrom(char.name, container.name);
        msg(prefix(obj, multiple) + lang.done_msg);
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
    failedmsg(lang.not_npc_for_give(char, npc));
    return FAILED; 
  }
  for (let obj of objects[0]) {
    let flag = true;
    if (!char.getAgreement("Give", obj)) {
      // The getAgreement should give the response
    }
    if (npc.testRestrictions) {
      flag = npc.testRestrictions(obj);
    }
    if (!npc.canManipulate(obj, "give")) {
      return FAILED;
    }
    if (flag) {
      if (!obj.isAtLoc(char.name)) {
        failedmsg(prefix(obj, multiple) + lang.not_carrying(char, obj));
      }
      else {
        if (npc.giveReaction) {
          npc.giveReaction(obj, multiple, char);
        }
        else {
          msg(prefix(obj, multiple) + lang.done_msg);
          obj.moveToFrom(npc.name, char.name);
        }
        success = true;
      }
    }
  }
  if (success === SUCCESS) char.pause();
  return success ? SUCCESS : FAILED;
}


function handleStandUp(objects) {
  console.log("here")
  const npc = objects.length === 0 ? game.player : objects[0][0];
  if (!npc.npc) {
    failedmsg(lang.not_npc(npc));
    return FAILED; 
  }
  if (!npc.posture) {
    failedmsg(lang.already(npc));
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
    msg(lang.stop_posture(npc))
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
    msg(lang.TAKE_not_push(char, obj));
    return FAILED;
  }
  if (!obj.shiftable) {
    msg(lang.cannot_push(char, obj));
    return FAILED;
  }
  if (!room[dir] || room[dir].isHidden()) {
    msg(lang.not_that_way(char, dir));
    return FAILED;
  }
  if (room[dir].isLocked()) {
    msg(lang.locked_exit(char, room[dir]));
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
    msg(lang.cannot_push_up(char, obj));
    return FAILED;
  }
  
  // not using moveToFrom; if there are 
  const dest = room[dir].name;
  obj.moveToFrom(dest);
  char.loc = dest;
  msg(lang.push_exit_successful(char, obj, dir, w[dest]));
  return SUCCESS;
}