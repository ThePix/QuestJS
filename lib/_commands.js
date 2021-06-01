// A command has an arbitrary name, a regex or pattern, 
// and a script as a minimum.
// regex           A regex to match against
// objects         An array of matches in the regex (see wiki)
// script          This will be run on a successful match
// attName         If there is no script, then this attribute on the object will be used
// nothingForAll   If the player uses ALL and there is nothing there, use this error message
// noobjecterror   If the player specifies an object
// noTurnscripts   Set to true to prevent turnscripts firing even when this command is successful

"use strict";




const cmdDirections = []
for (let exit of lang.exit_list) {
  if (exit.type === 'nocmd') continue
  cmdDirections.push(exit.name)
  cmdDirections.push(exit.abbrev.toLowerCase())
  if (exit.alt) cmdDirections.push(exit.alt)
}



const commands = [
  // ----------------------------------
  // Single word commands
  
  // Cannot just set the script to helpScript as we need to allow the
  // author to change it in code.js, which is loaded after this.
  new Cmd('MetaHelp', {
    script:lang.helpScript,
  }),    
  new Cmd('MetaHint', {
    script:lang.hintScript,
  }),
  new Cmd('MetaCredits', {
    script:lang.aboutScript,
  }),
  new Cmd('MetaDarkMode', {
    script:io.toggleDarkMode,
  }),
  new Cmd('MetaPlainFontMode', {
    script:io.togglePlainFontMode,
  }),
  new Cmd('MetaSilent', {
    script:function() {
      if (settings.silent) {
        metamsg(lang.mode_silent_off)
        settings.silent = false
      }
      else {
        metamsg(lang.mode_silent_on)
        settings.silent = true
        ambient()
      }
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  new Cmd('MetaWarnings', {
    script:lang.warningsScript,
  }),
  
  
  new Cmd('MetaSpoken', {
    script:function() {
      if (io.spoken) {
        io.spoken = false
        metamsg(lang.spoken_off)
      }
      else {
        io.spoken = true
        metamsg(lang.spoken_on)
      }
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  new Cmd('MetaIntro', {
    script:function() {
      io.spoken = true;
      if (typeof settings.intro === "string") {
        msg(settings.intro)
      }
      else {
        for (let el of settings.intro) msg(el)
      }
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  new Cmd('MetaBrief', {
    script:function() {
      settings.verbosity = world.BRIEF
      metamsg(lang.mode_brief)
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  new Cmd('MetaTerse', {
    script:function() {
      settings.verbosity = world.TERSE
      metamsg(lang.mode_terse)
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  new Cmd('MetaVerbose', {
    script:function() {
      settings.verbosity = world.VERBOSE
      metamsg(llang.mode_verbose)
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  
  new Cmd('MetaTranscript', {
    script:lang.transcriptScript,
  }),
  new Cmd('MetaTranscriptOn', {
    script:function() {
      if (io.transcript) {
        metamsg(lang.transcript_already_on)
        return world.FAILED
      }
      io.scriptStart()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  new Cmd('MetaTranscriptOff', {
    script:function() {
      if (!io.transcript) {
        metamsg(lang.transcript_already_off)
        return world.FAILED
      }
      io.scriptEnd()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  new Cmd('MetaTranscriptClear', {
    script:function() {
      io.scriptClear()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  new Cmd('MetaTranscriptShow', {
    script:function() {
      io.scriptShow()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  new Cmd('MetaTranscriptShowWithOptions', {
    script:function(arr) {
      io.scriptShow(arr[0])
      return world.SUCCESS_NO_TURNSCRIPTS
    },
    objects:[
      {special:'text'},
    ]
  }),
  new Cmd('MetaTranscriptToWalkthrough', {
    script:function() {
      io.scriptShow('w')
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  new Cmd('MetaUserComment', {
    script:function(arr) {
      metamsg("Comment: " + arr[0])
      return world.SUCCESS_NO_TURNSCRIPTS
    },
    objects:[
      {special:'text'},
    ]
  }),
  
  // ----------------------------------
  // File system commands
  new Cmd('MetaSave', {
    script:lang.saveLoadScript,
  }),
  new Cmd('MetaSaveOverwriteGame', {
    script:function(arr) {
      saveLoad.saveGame(arr[0], true)
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects:[
      {special:'text'},
    ]
  }),
  new Cmd('MetaSaveGame', {
    script:function(arr) {
      saveLoad.saveGame(arr[0])
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects:[
      {special:'text'},
    ]
  }),
  new Cmd('MetaLoad', {
    script:lang.saveLoadScript,
  }),
  new Cmd('MetaLoadGame', {
    script:function(arr) {
      saveLoad.loadGame(arr[0])
      return world.SUCCESS_NO_TURNSCRIPTS
    },
    objects:[
      {special:'text'},
    ]
  }),
  new Cmd('MetaDir', {
    script:function() {
      saveLoad.dirGame()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  new Cmd('MetaDeleteGame', {
    script:function(arr) {
      saveLoad.deleteGame(arr[0])
      return world.SUCCESS_NO_TURNSCRIPTS
    },
    objects:[
      {special:'text'},
    ]
  }),


  new Cmd('MetaUndo', {
    script:function() {
      if (settings.maxUndo === 0) {
        metamsg(lang.undo_disabled)
        return world.FAILED
      }
      if (world.gameState.length < 2) {
        metamsg(lang.undo_not_available)
        return world.FAILED
      }
      world.gameState.pop()
      const gameState = world.gameState[world.gameState.length - 1]
      metamsg(lang.undo_done)
      saveLoad.loadTheWorld(gameState)
      w[game.player.loc].description()
    },
  }),
  new Cmd('MetaAgain', {
    script:function() {
      return io.againOrOops(true)
    },
  }),
  new Cmd('MetaOops', {
    script:function() {
      return io.againOrOops(false)
    },
  }),
  new Cmd('MetaRestart', {
    script:function() {
      askQuestion(lang.restart_are_you_sure, function(result) {
        if (result.match(lang.yes_regex)) {
          location.reload()
        }
        else {
          metamsg(lang.restart_no)
        }
      });
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }),
  new Cmd('MetaPronouns', {
    script:function() {
      metamsg('See the developer console (F12) for the current pronouns')
      console.log(parser.pronouns)
    },
  }),
  new Cmd('MetaScore', {
    script:function() {
      metamsg(lang.scores_not_implemented)
    },
  }),
  new Cmd('MetaTopicsNote', {
    script:lang.topicsScript,
  }),


  
  // These are kind of meta-commands - perhaps free commands is a better term.
  // I see them as jogging the user's mind about the game world, rather than
  // doing something in the game world, so by default
  // no ttime passes.
  // Set settings.lookCountsAsTurn to true if you disagree!
  new Cmd('Look', {
    script:function() {
      currentLocation.description();
      return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Exits', {
    script:function() {
      msg(lang.can_go);
      return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Inv', {
    script:function() {
      const listOfOjects = game.player.getContents(world.INVENTORY);
      msg(lang.inventory_prefix + " " + formatList(listOfOjects, {article:INDEFINITE, lastJoiner:lang.list_and, modified:true, nothing:lang.list_nothing, loc:game.player.name}) + ".", {char:game.player});
      return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Map', {
    script:function() {
      if (typeof showMap !== 'undefined') {
        showMap();
        return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
      }
      else {
        const zone = w[game.player.loc]
        if (!zone.zone) {
          return failedmsg(lang.no_map);
        }
        else {
          const flag = zone.drawMap()
          if (!flag) return failedmsg(lang.no_map);
          return world.SUCCESS_NO_TURNSCRIPTS
        }
      }
    },
  }),
  new Cmd('Topics', {
    attName:"topics",
    objects:[
      {scope:parser.isNpcAndHere},
    ],
    default:function(item) {
      return failedmsg(lang.no_topics, {char:game.player, item:item});
    },
  }),



  new Cmd('Wait', {
    script:function() {
      msg(lang.wait_msg);
      return world.SUCCESS;
    },
  }),
  new Cmd('Smell', {
    script:function() {
      if (currentLocation.onSmell) {
        printOrRun(game.player, currentLocation, "onSmell");
      }
      else {
        msg(lang.no_smell, {char:game.player});
      }
      return world.SUCCESS;
    },
  }),
  new Cmd('Listen', {
    script:function() {
      if (currentLocation.onListen) {
        printOrRun(game.player, currentLocation, "onListen");
      }
      else {
        msg(lang.no_listen, {char:game.player});
      }
      return world.SUCCESS;
    },
  }),
  new Cmd('PurchaseFromList', {
    script:function() {
      const l = [];
      for (let key in w) {
        if (parser.isForSale(w[key])) {
          const price = w[key].getBuyingPrice(game.player)
          const row = [sentenceCase(w[key].getName()), world.Money(price)]
          row.push(price > game.player.money ? "-" : "{cmd:buy " + w[key].alias + ":" + buy + "}")
          l.push(row)
        }
      }
      if (l.length === 0) {
        return failedmsg(lang.nothing_for_sale);
      }
      msg(current_money + ": " + world.Money(game.player.money));
      msgTable(l, buy_headings)
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  

  // Out of convenient order as it needs to be before TAKE
  new Cmd('GetFluid', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {special:'fluid'},
    ],
    score:5,
    script:function(objects) {
      const tpParams = {char:player, fluid:objects[0]}
      const [source, tmp] = util.findSource(player, objects[0])
      if (!source) return failedmsg(lang.no_fluid_here, tpParams);
      return failedmsg(lang.cannot_get_fluid, tpParams)
    },
  }),


  
  // ----------------------------------
  // Verb-object commands
  new Cmd('Examine', {
    npcCmd:true,
    objects:[
      {scope:parser.isPresent, multiple:true}
    ],
    defmsg:lang.default_examine,
  }),
  new Cmd('LookAt', {  // used for NPCs
    npcCmd:true,
    attName:'examine',
    objects:[
      {scope:parser.isPresentOrMe}
    ],
    defmsg:lang.default_examine,
  }),
  new Cmd('LookOut', {
    npcCmd:true,
    rules:[cmdRules.isHere],
    objects:[
      {scope:parser.isPresent}
    ],
    attName:"lookout",
    defmsg:lang.cannot_look_out,
  }),
  new Cmd('LookBehind', {
    npcCmd:true,
    rules:[cmdRules.isHere],
    attName:"lookbehind",
    objects:[
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_there,
  }),
  new Cmd('LookUnder', {
    npcCmd:true,
    rules:[cmdRules.isHere],
    attName:"lookunder",
    objects:[
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_there,
  }),  
  new Cmd('LookThrough', {
    npcCmd:true,
    rules:[cmdRules.isHere],
    attName:"lookthrough",
    objects:[
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_there,
  }),  
  new Cmd('LookInside', {
    npcCmd:true,
    rules:[cmdRules.isHere],
    attName:"lookinside",
    objects:[
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_inside,
  }),  
  new Cmd('Search', {
    npcCmd:true,
    rules:[cmdRules.isHere],
    attName:"search",
    objects:[
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_there,
  }),  

  new Cmd('Take', {
    npcCmd:true,
    rules:[cmdRules.isHereNotHeldAlready, cmdRules.canManipulate],
    objects:[
      {scope:parser.isHereOrContained, allScope:parser.isHereOrLocationContained, multiple:true},
    ],
    defmsg:lang.cannot_take,
  }),
  new Cmd('Drop', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.canManipulate],
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:function(char, item) {
      if (item.isAtLoc(char)) return lang.cannot_drop
      return lang.not_carrying
    }
  }),
  new Cmd('Wear2', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.isHeld, cmdRules.canManipulate],
    attName:"wear",
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:function(char, item) {
      return item.ensemble ? lang.cannot_wear_ensemble : lang.cannot_wear;
    },
  }),
  new Cmd('Wear', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.canManipulate],
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:function(char, item) {
      return item.ensemble ? lang.cannot_wear_ensemble : lang.cannot_wear;
    },
  }),
  new Cmd('Remove', {
    npcCmd:true,
    rules:[cmdRules.isWorn, cmdRules.canManipulate],
    objects:[
      {scope:parser.isWorn, multiple:true},
    ],
    defmsg:function(char, item) {
      return item.ensemble ? lang.cannot_wear_ensemble : lang.not_wearing;
    },
  }),
  new Cmd('Remove2', {
    npcCmd:true,
    rules:[cmdRules.isWorn, cmdRules.canManipulate],
    attName:"remove",
    objects:[
      {scope:parser.isWorn, multiple:true},
    ],
    defmsg:function(char, item) {
      return item.ensemble ? lang.cannot_wear_ensemble : lang.not_wearing;
    },
  }),
  new Cmd('Read', {
    npcCmd:true,
    rules:[cmdRules.isHere],
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_read,
  }),
  new Cmd('Purchase', {
    npcCmd:true,
    rules:[cmdRules.canManipulate],
    objects:[
      {scope:parser.isForSale},
    ],
    defmsg:lang.cannot_purchase_here,
  }),
  new Cmd('Sell', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.canManipulate],
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_sell_here,
  }),
  new Cmd('Smash', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_smash,
  }),
  new Cmd('Turn', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isHere},
    ],
    defmsg:lang.cannot_turn,
  }),
  new Cmd('TurnLeft', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isHere},
    ],
    defmsg:lang.cannot_turn,
  }),
  new Cmd('TurnRight', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isHere},
    ],
    defmsg:lang.cannot_turn,
  }),
  new Cmd('SwitchOn', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    attName:"switchon",
    cmdCategory:"SwitchOn",
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_switch_on,
  }),
  new Cmd('SwitchOn2', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    attName:"switchon",
    cmdCategory:"SwitchOn",
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_switch_on,
  }),
  
  new Cmd('SwitchOff2', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    attName:"switchoff",
    cmdCategory:"SwitchOff",
    objects:[
      {scope:parser.isHeld, multiple:true, attName:"switchon"},
    ],
    defmsg:lang.cannot_switch_off,
  }),
  new Cmd('SwitchOff', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    attName:"switchoff",
    cmdCategory:"SwitchOff",
    objects:[
      {scope:parser.isHeld, multiple:true, attName:"switchoff"},
    ],
    defmsg:lang.cannot_switch_off,
  }),
  
  new Cmd('Open', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isPresent, multiple:true, attName:"open"},
    ],
    defmsg:lang.cannot_open,
  }),
  
  new Cmd('Close', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isPresent, multiple:true, attName:"close"},
    ],
    defmsg:lang.cannot_close,
  }),
  
  new Cmd('Lock', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isPresent, multiple:true, attName:"lock"},
    ],
    defmsg:lang.cannot_lock,
  }),
  
  new Cmd('Unlock', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isPresent, multiple:true, attName:"unlock"},
    ],
    defmsg:lang.cannot_unlock,
  }),
  
  new Cmd('Push', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isPresent},
    ],
    defmsg:lang.nothing_useful,
  }),

  new Cmd('Pull', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isPresent},
    ],
    defmsg:lang.nothing_useful,
  }),
  new Cmd('Fill', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isPresent},
    ],
    defmsg:lang.cannot_fill,
  }),
  new Cmd('Empty', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isPresent},
    ],
    defmsg:lang.cannot_empty,
  }),

  new Cmd('SmellItem', {
    npcCmd:true,
    attName:"smell",
    objects:[
      {scope:parser.isPresent, attName:"smell"},
    ],
    defmsg:lang.cannot_smell,
  }),
  new Cmd('ListenToItem', {
    npcCmd:true,
    attName:"listen",
    objects:[
      {scope:parser.isPresent, attName:"listen"},
    ],
    defmsg:lang.cannot_listen,
  }),

  new Cmd('Eat', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.canManipulate],
    objects:[
      {special:'text'},
      {scope:parser.isHeld, multiple:true, attName:"ingest"},
    ],
    defmsg:lang.cannot_eat,
  }),
  new Cmd('Drink', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {special:'text'},
      {scope:parser.isPresent, attName:"ingest"},
    ],
    defmsg:lang.cannot_drink,
  }),
  new Cmd('Ingest', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {special:'text'},
      {scope:parser.isPresent, attName:"ingest"},
    ],
    defmsg:lang.cannot_ingest,
  }),

  new Cmd('SitOn', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.canPosture, cmdRules.isHereNotHeld],
    attName:"siton",
    objects:[
      {scope:parser.isHere, attName:"assumePosture"},
    ],
    defmsg:lang.cannot_sit_on,
  }),
  new Cmd('StandOn', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.canPosture, cmdRules.isHereNotHeld],
    attName:"standon",
    objects:[
      {scope:parser.isHere, attName:"assumePosture"},
    ],
    defmsg:lang.cannot_stand_on,
  }),
  new Cmd('ReclineOn', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.canPosture, cmdRules.isHereNotHeld],
    attName:"reclineon",
    objects:[
      {scope:parser.isHere, attName:"assumePosture"},
    ],
    defmsg:lang.cannot_recline_on,
  }),
  new Cmd('GetOff', {
    npcCmd:true,
    cmdCategory:"Posture",
    score:5, // to give priority over TAKE
    rules:[cmdRules.canPosture, cmdRules.isHereNotHeld],
    attName:"getoff",
    cmdCategory:"Posture",
    objects:[
      {scope:parser.isHere, attName:"assumePosture"},
    ],
    defmsg:lang.already,
  }),

  new Cmd('Use', {
    npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isPresent},
    ],
    script:function(objects) {
      const obj = objects[0][0]
      
      if (obj.use) {
        const result = this.processCommand(game.player, obj, false, 'use')
        return result ? world.SUCCESS : world.FAILED
      }
      
      if (obj.useDefaultsTo) {
        const cmd = findCmd(obj.useDefaultsTo())
        if (cmd) {
          const result = cmd.processCommand(game.player, obj, false, 'use');
          return result ? world.SUCCESS : world.FAILED
        }
        else {
          throw new Error("USE command defaulting to unknown command " + obj.useDefaultsTo)
        }
      }

      this.default(obj, false, game.player)
      return world.FAILED; 
    },
    defmsg:lang.cannot_use,
  }),
  
  new Cmd('TalkTo', {
    rules:[cmdRules.canTalkTo],
    attName:"talkto",
    objects:[
      {scope:parser.isNpcAndHere},
    ],
    default:function(item) {
      return failedmsg(lang.cannot_talk_to, {char:game.player, item:item});
    },
  }),


  
  // ----------------------------------
  // Complex commands
  
  
  
  new Cmd('Say', {
    script:function(arr) {
      const l = [];
      for (let key in w) {
        if (w[key].sayCanHear && w[key].sayCanHear(game.player, arr[0])) l.push(w[key]);
      }
      l.sort(function(a, b) { return (b.sayPriority + b.sayBonus) - (a.sayPriority + b.sayBonus); });
      if (l.length === 0) {
        msg(lang.say_no_one_here(game.player, arr[0], arr[1]));
        return world.SUCCESS;
      }

      if (settings.givePlayerSayMsg) msg(lang.nounVerb(game.player, arr[0], true) + ", '" + sentenceCase(arr[1]) + ".'");
      for (let chr of l) {
        if (chr.sayQuestion && w[chr.sayQuestion].sayResponse(chr, arr[1])) return world.SUCCESS;
        if (chr.sayResponse && chr.sayResponse(arr[1], arr[0])) return world.SUCCESS;
      }
      if (settings.givePlayerSayMsg) {
        msg(lang.say_no_response(game.player, arr[0], arr[1]));
      }
      else {      
        msg(lang.say_no_response_full(game.player, arr[0], arr[1]));
      }
      return world.SUCCESS;
    },
    objects:[
      {special:'text'},
      {special:'text'},
    ]
  }),
  
  
  new Cmd('Stand', {
    rules:[cmdRules.canPosture],
    script:handleStandUp,
  }),
  new Cmd('NpcStand', {
    rules:[cmdRules.canPosture],
    cmdCategory:"Posture",
    objects:[
      {scope:parser.isHere, attName:"npc"},
    ],
    script:handleStandUp,
  }),
  
  
  
  

  new Cmd('FillWith', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isHeld},
      {special:'fluid'},
    ],
    script:function(objects) {
      return handleFillWithFluid(game.player, objects[0][0], objects[1]);
    },
  }),
  new Cmd('NpcFillWith', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"Fill",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHeld},
      {special:'fluid'},
    ],
    script:function(objects) {
      const npc = objects[0][0]
      if (!npc.npc) return failedmsg(lang.not_npc, {char:game.player, item:npc})
      objects.shift()
      return handleFillWithFluid(npc, objects[0][0], objects[1])
    },
  }),
  new Cmd('EmptyInto', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isHeld},
      {scope:parser.isPresent},
    ],
    script:function(objects) {
      return handleEmptyInto(game.player, objects[0][0], objects[1][0]);
    },
  }),
  new Cmd('NpcEmptyInto', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"Fill",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHeld},
      {scope:parser.isPresent},
    ],
    script:function(objects) {
      const npc = objects[0][0]
      if (!npc.npc) return failedmsg(lang.not_npc, {char:game.player, item:npc})
      objects.shift()
      return handleEmptyInto(npc, objects[0][0], objects[1][0])
    },
  }),


  new Cmd('PutIn', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isHeld, multiple:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      return handleInOutContainer(game.player, objects, "drop", handleSingleDropInContainer)
    },
  }),
  
  new Cmd('NpcPutIn', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"Drop/in",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHeldByNpc, multiple:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      const npc = objects[0][0]
      if (!npc.npc) return failedmsg(lang.not_npc, {char:game.player, item:npc})
      objects.shift()
      return handleInOutContainer(npc, objects, "drop", handleSingleDropInContainer)
    },
  }),

  new Cmd('TakeOut', {
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isContained, multiple:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      return handleInOutContainer(game.player, objects, "take", handleSingleTakeOutContainer)
    },
  }),
  
  new Cmd('NpcTakeOut', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"Take",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isContained, multiple:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      const npc = objects[0][0]
      if (!npc.npc) return failedmsg(lang.not_npc, {char:game.player, item:npc})
      objects.shift()
      return handleInOutContainer(npc, objects, "take", handleSingleTakeOutContainer)
    },
  }),

  new Cmd('GiveTo', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isHeld, multiple:true},
      {scope:parser.isPresent, attName: "npc"},
    ],
    script:function(objects) {
      return handleGiveToNpc(game.player, objects)
    },
  }),
  new Cmd('NpcGiveTo', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"Give",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHeldByNpc, multiple:true},
      {scope:parser.isPresentOrMe, attName: "npc"},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:game.player, item:npc})
      objects.shift()
      return handleGiveToNpc(npc, objects)
    },
  }),
  new Cmd('NpcGiveToMe', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"Give",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHeldByNpc, multiple:true},
    ],
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:game.player, item:npc})
      objects.shift()
      objects.push([game.player])
      return handleGiveToNpc(npc, objects)
    },
  }),



  new Cmd('PushExit', {
    rules:[cmdRules.canManipulate, cmdRules.isHereNotHeld],
    cmdCategory:"Push",
    script:function(objects) {
      return handlePushExit(game.player, objects);
    },
    objects:[
      {special:'text'},
      {scope:parser.isHere, attName:"shiftable"},
      {special:'text'},
    ]
  }),
  new Cmd('NpcPushExit', {
    rules:[cmdRules.canManipulate, cmdRules.isHereNotHeld],
    cmdCategory:"Push",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:game.player, item:npc})
      objects.shift();
      return handlePushExit(npc, objects);
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {special:'text'},
      {scope:parser.isHere, attName:"shiftable"},
      {special:'text'},
    ]
  }),





  new Cmd('TieTo', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"Tie",
    objects:[
      {scope:parser.isHeld, attName:"rope"},
      {scope:parser.isHere, attName:"attachable"},
    ],
    script:function(objects) { return handleTieTo(game.player, objects[0][0], objects[1][0]) },
  }),
  new Cmd('NpcTieTo', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"Tie",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:game.player, item:npc})
      objects.shift();
      return handleTieTo(npc, objects[0][0], objects[1][0])
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {special:'text'},
      {scope:parser.isHere, attName:"shiftable"},
      {special:'text'},
    ]
  }),

  new Cmd('Untie', {
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    cmdCategory:"Untie",
    objects:[
      {scope:parser.isHere, attName:"rope"},
    ],
    script:function(objects) { handleUntieFrom(game.player, objects[0][0]) },
  }),
  new Cmd('NpcUntie', {
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    cmdCategory:"Tie",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:game.player, item:npc})
      objects.shift();
      return handleUntieFrom(npc, objects[0][0], objects[1][0])
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {special:'text'},
      {scope:parser.isHere, attName:"shiftable"},
      {special:'text'},
    ]
  }),

  new Cmd('UntieFrom', {
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    cmdCategory:"Untie",
    objects:[
      {scope:parser.isHere, attName:"rope"},
      {scope:parser.isHere, attName:"attachable"},
    ],
    script:function(objects) { handleUntieFrom(game.player, objects[0][0], objects[1][0]) },
  }),
  new Cmd('NpcUntieFrom', {
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    cmdCategory:"Tie",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:game.player, item:npc})
      objects.shift()
      return handleUntieFrom(npc, objects[0][0], objects[1][0])
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {special:'text'},
      {scope:parser.isHere, attName:"shiftable"},
      {special:'text'},
    ]
  }),


  new Cmd('UseWith', {
    //npcCmd:true,
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    objects:[
      {scope:parser.isPresent},
      {scope:parser.isPresent},
    ],
    script:function(objects) {
      const obj = objects[0][0]
      const obj2 = objects[1][0]
      
      if (obj.useWith) {
        const result = obj.useWith(game.player, obj2)
        return result ? world.SUCCESS : world.FAILED
      }
      if (obj2.withUse) {
        const result = obj2.withUse(game.player, obj)
        return result ? world.SUCCESS : world.FAILED
      }
      
      if (obj.useWithDefaultsTo) {
        const cmd = findCmd(obj.useWithDefaultsTo())
        if (cmd) {
          const result = cmd.script(objects)
          return result ? world.SUCCESS : world.FAILED
        }
        else {
          throw new Error("USE command defaulting to unknown command " + obj.useWithDefaultsTo)
        }
      }
      if (obj2.withUseDefaultsTo) {
        const cmd = findCmd(obj2.withUseDefaultsTo())
        if (cmd) {
          const result = cmd.script(objects)
          return result ? world.SUCCESS : world.FAILED
        }
        else {
          throw new Error("USE command defaulting to unknown command " + obj2.withUseDefaultsTo)
        }
      }

      this.default(obj, false, game.player)
      return world.FAILED; 
    },
    defmsg:lang.cannot_use,
  }),
  





  new Cmd('FollowMe', {
    objects:[
      {scope:parser.isHere, attName:"npc"},
    ],
    script:function(objects) {
      const obj = objects[0][0]
      const tpParams = {char:player, npc:obj}
      if (!obj.npc) return falsemsg(lang.cannot_follow, tpParams)
      if (!obj.getAgreement("Follow")) return false
      return obj.startFollow() ? world.SUCCESS : world.FAILED
    },
  }),

  new Cmd('WaitHere', {
    objects:[
      {scope:parser.isHere, attName:"npc"},
    ],
    script:function(objects) {
      const obj = objects[0][0]
      const tpParams = {item:obj}
      if (!obj.npc) return falsemsg(lang.cannot_wait, tpParams)

      return obj.endFollow() ? world.SUCCESS : world.FAILED
    },
  }),
  

  new Cmd('AskAbout', {
    rules:[cmdRules.canTalkTo],
    script:function(arr) {
      if (!game.player.canTalk()) return false
      if (!arr[0][0].askabout) return failedmsg(lang.cannot_ask_about, {char:game.player, item:arr[0][0], text:arr[2]})

      return arr[0][0].askabout(arr[2], arr[1]) ? world.SUCCESS : world.FAILED
    },
    objects:[
      {scope:parser.isNpcAndHere},
      {special:'text'},
      {special:'text'},
    ]
  }),
  new Cmd('TellAbout', {
    rules:[cmdRules.canTalkTo],
    script:function(arr) {
      if (!game.player.canTalk()) return false
      if (!arr[0][0].tellabout) return failedmsg(cannot_tell_about, {char:game.player, item:arr[0][0], text:arr[1]})

      return arr[0][0].tellabout(arr[2], arr[1]) ? world.SUCCESS : world.FAILED
    },
    objects:[
      {scope:parser.isNpcAndHere},
      {special:'text'},
      {special:'text'},
    ]
  }),
  
]




// DEBUG commands

if (settings.playMode === 'dev') {
  commands.push(new Cmd('DebugWalkThrough', {
    objects:[
      {special:'text'},
    ],
    script:function(objects) {
      if (typeof walkthroughs === "undefined") return errormsg("No walkthroughs set")
      const wt = walkthroughs[objects[0]]
      if (wt === undefined) return errormsg("No walkthrough found called " + objects[0])
      for (let el of wt) {
        if (typeof el === "string") {
          io.msgInputText(el)
          parser.parse(el)
        }
        else {
          settings.walkthroughMenuResponses = Array.isArray(el.menu) ? el.menu : [el.menu]
          io.msgInputText(el.cmd)
          parser.parse(el.cmd)
          settings.walkthroughMenuResponses = []
        }
      }
    },
  })) 

  commands.push(new Cmd('DebugInspect', {
    script:function(arr) {
      const item = arr[0][0];
      debugmsg("See the console for details on the object " + item.name + " (press F12 to world. the console)");
      console.log(item);
      return world.SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {scope:parser.isInWorld},
    ],
  }))

  commands.push(new Cmd('DebugInspectByName', {
    script:function(arr) {
      const item_name = arr[0]
      if (!w[item_name]) {
        debugmsg("No object called " + item_name);
        return world.FAILED;
      }
       
      debugmsg("See the console for details on the object " + item_name + " (press F12 to world. the console)");
      console.log(w[item_name]);
      return world.SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {special:'text'},
    ],
  }))

  commands.push(new Cmd('DebugTest', {
    script:function() {
      if (!settings.tests) {
        metamsg('The TEST command is for unit testing during game development, and is not activated (F12 for more).')
        console.log('To activate testing in your game, set settings.tests to true. More details here: https://github.com/ThePix/QuestJS/wiki/Unit-testing')
        return world.SUCCESS_NO_TURNSCRIPTS;
      }
      if (typeof test.runTests !== 'function') {
        console.log(test)
        return world.FAILED
      }
      test.runTests();
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
  }))

  commands.push(new Cmd('DebugInspectCommand', {
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
      return world.SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {special:'text'},
    ],
  }))

  commands.push(new Cmd('DebugListCommands', {
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
      return world.SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
    ],
  }))

  commands.push(new Cmd('DebugListCommands2', {
    script:function(arr) {
      let count = 0;
      for (let cmd of commands) {
        let s = cmd.name + " (" + cmd.regex + ")"
        debugmsg(s);
        count++;
      }        
      debugmsg("... Found " + count + " commands.");
      return world.SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
    ],
  }))

  commands.push(new Cmd('DebugParserToggle', {
    script:function(arr) {
      if (parser.debug) {
        parser.debug = false
        debugmsg ("Parser debugging messages are off.");
      }
      else {
        parser.debug = true
        debugmsg ("Parser debugging messages are on.");
      }
      return world.SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
    ],
  }))

  commands.push(new Cmd('DebugStats', {
    script:function(arr) {
      for (const el of settings.statsData) el.count = 0
      for (const key in w) {
        for (const el of settings.statsData) {
          if (el.test(w[key])) el.count++
        }
      }
      for (const el of settings.statsData) {
        debugmsg(el.name + ": " + el.count)
      }
      return world.SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
    ],
  }))
}







    
// Functions used by commands 
// (but not in the commands array)


// Cannot handle multiple vessels
function handleFillWithFluid(char, vessel, fluid) {
  const tpParams = {char:char, container:vessel, fluid:fluid}
  if (!vessel.vessel) return failedmsg(lang.not_vessel, tpParams);
  if (vessel.closed) return  failedmsg(lang.container_closed, tpParams);
  if (!char.canManipulate(vessel, "fill")) return world.FAILED;
  if (!char.getAgreement("Fill", vessel, fluid)) return world.FAILED;
  if (!vessel.isAtLoc(char.name)) return failedmsg(lang.not_carrying, {char:char, item:obj});
  const [source, tmp] = vessel.findSource(char, fluid)
  if (!source) return failedmsg(lang.no_fluid_here, tpParams);
  return vessel.doFill(false, char, source, fluid) ? world.SUCCESS: world.FAILED;
}

function handleEmptyInto(char, vessel, sink) {
  const tpParams = {char:char, container:vessel, fluid:vessel.containedFluidName, sink:sink}
  if (!vessel.vessel) return failedmsg(lang.not_vessel, tpParams);
  if (vessel.closed) return  failedmsg(lang.container_closed, tpParams);
  if (!char.canManipulate(vessel, "fill")) return world.FAILED;
  if (!char.getAgreement("Fill", vessel)) return world.FAILED;
  if (!vessel.isAtLoc(char.name)) return failedmsg(lang.not_carrying, {char:char, item:obj});
  return vessel.doEmpty(false, char, sink) ? world.SUCCESS: world.FAILED;
}





function handleInOutContainer(char, objects, verb, func) {
  let success = false;
  const container = objects[1][0];
  const multiple = objects[0].length > 1 || parser.currentCommand.all;
  const tpParams = {char:char, container:container}
  
  if (!container.container) return failedmsg(lang.not_container, {container:container})
  if (container.closed) return failedmsg(lang.container_closed, tpParams)
  if (!char.canManipulate(objects[0], verb)) return world.FAILED

  for (const obj of objects[0]) {
    const count = obj.countable ? obj.extractNumber() : undefined
    const flag = func(char, container, obj, multiple, count)
    success = success || flag
  }
  if (success === world.SUCCESS) char.pause();
  return success ? world.SUCCESS : world.FAILED;
}

function handleSingleDropInContainer(char, container, obj, multiple, count) {
  if (!char.getAgreement("Drop/in", obj, container)) return
  if (!container.testForRecursion(char, obj)) return false
  if (obj.testDropRestrictions && !obj.testDropRestrictions(char, multiple, container)) return false
  if (container.testDropInRestrictions && !container.testDropInRestrictions(char, multiple, obj)) return false
  if (!obj.isAtLoc(char.name)) return failedmsg(prefix(obj, multiple) + lang.not_carrying, {char:char, item:obj})

  obj.moveToFrom(container.name, char.name)
  msg(prefix(obj, multiple) + obj.getDropInMsg(char, container), {char:char, item:obj, item_count:count, container:container})
  return true;
}

function handleSingleTakeOutContainer(char, container, obj, multiple, count) {
  if (!char.getAgreement("Take", obj)) return false
  if (!obj.isAtLoc(container.name)) return failedmsg(prefix(obj, multiple) + lang.not_inside(container, obj))
  if (container.testTakeOutRestrictions && !container.testTakeOutRestrictions(char, multiple, obj)) return false

  obj.moveToFrom(char.name, container.name)
  msg(prefix(obj, multiple) + obj.getTakeOutMsg(char, container), {char:char, item:obj, item_count:count, container:container})
  return true
}



function handleGiveToNpc(char, objects) {
  let success = false;
  const npc = objects[1][0];
  const multiple = objects[0].length > 1 || parser.currentCommand.all;
  if (!npc.npc && npc !== game.player) return failedmsg(lang.not_npc_for_give, {char:char, item:npc})
    
  for (const obj of objects[0]) {
    const flag = handleSingleGiveToNpc(char, npc, obj, multiple)
    success = success || flag
  }
  if (success === world.SUCCESS) char.pause();
  return success ? world.SUCCESS : world.FAILED;
}
// char is giving obj to npc
function handleSingleGiveToNpc(char, npc, obj, multiple) {
  if (!char.getAgreement("Give", obj, npc)) return false
  if (npc.testGiveRestrictions && !npc.testGiveRestrictions(char, multiple, obj)) return false
  if (!npc.canManipulate(obj, "give")) return false
  if (!obj.isAtLoc(char.name)) return falsemsg(prefix(obj, multiple) + lang.not_carrying, {char:char, item:obj})

  if (npc.giveToReaction) return npc.giveToReaction(obj, multiple, char)

  if (char.giveFromReaction) return char.giveFromReaction(obj, multiple, npc)

  if (obj.giveItemReaction) return obj.giveItemReaction(multiple, char, npc)

  msg(prefix(obj, multiple) + lang.done_msg)
  obj.moveToFrom(npc.name, char.name)
  return true
}





function handleStandUp(objects) {
  let char
  if (objects.length === 0) {
    char = game.player
  }
  else {
    const npc = objects[0][0]
    if (!npc.npc) {
      failedmsg(lang.not_npc, {char:game.player, item:npc});
      return world.FAILED; 
    }
    if (!npc.posture) {
      failedmsg(lang.already, {item:npc});
      return world.FAILED;
    }
    if (!npc.getAgreement("Posture", "stand")) {
      // The getAgreement should give the response
      return world.FAILED;
    }
    char = npc
  }  
  
  if (!char.canPosture()) {
    return world.FAILED;
  }
  if (char.posture) {
    msg(lang.stop_posture(char))
    char.pause();
    return world.SUCCESS;
  }  
}

// we know the char can manipulate, we know the obj is here and not held
function handlePushExit(char, objects) {
  const verb = objects[0]
  const obj = objects[1][0];
  const dir = getDir(objects[2]);
  const room = w[char.loc]
  const tpParams = {char:char, item:obj, dir:dir}
  
  if (!obj.shiftable && obj.takeable) return failedmsg(lang.take_not_push, tpParams)
  if (!obj.shiftable) return failedmsg(lang.cannot_push, tpParams)
  if (!room[dir] || room[dir].isHidden()) return failedmsg(lang.not_that_way, tpParams)
  if (room[dir].isLocked()) return failedmsg(lang.locked_exit(char, room[dir]))
  if (typeof room[dir].noShiftingMsg === "function") return failedmsg(room[dir].noShiftingMsg(char, item))
  if (typeof room[dir].noShiftingMsg === "string") return failedmsg(room[dir].noShiftingMsg)
  if (!char.getAgreement("Push", obj, dir)) return false
  
  if (typeof obj.shift === "function") {
    const res = obj.shift(char, dir, verb);
    return res ? world.SUCCESS : world.FAILED;
  }
  
  // by default, objects cannot be pushed up
  if (dir === "up") {
    msg(lang.cannot_push_up, tpParams);
    return world.FAILED;
  }
  
  // not using moveToFrom; if there are 
  const dest = room[dir].name;
  obj.moveToFrom(dest);
  char.loc = dest;
  tpParams.dest = w[dest]
  msg(lang.push_exit_successful, tpParams);
  return world.SUCCESS;
}





const handleTieTo = function(char, rope, obj2) {
  if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope})
  if (!obj2.attachable) return failedmsg(lang.rope_not_attachable_to, {rope:rope, item:obj2})
  
  if (rope.tiedTo1 === obj2.name) return failedmsg(lang.already, {item:rope})
  if (rope.tiedTo2 === obj2.name) return failedmsg(lang.already, {item:rope})
  if (rope.tiedTo1 && rope.tiedTo2) return failedmsg(lang.rope_tied_both_ends_already, {rope:w[rope.tiedTo1], obj1:w[rope.tiedTo2], obj2:w[rope.tiedTo2]})

  rope.attachTo(char, obj2)
  if (rope.attachMsg === true) return world.SUCCESS
  const s = rope.attachMsg ? rope.attachMsg : lang.rope_attach_success
  msg(s, {char:char, rope:rope, obj2:obj2})
  return world.SUCCESS
}

const handleUntieFrom = function(char, rope, obj2) {
  if (rope !== w.rope) return failedmsg(lang.rope_not_detachable, {rope:rope})
  if (obj2 === undefined) {
    // obj2 not set; can we guess it?
    if (!rope.tiedTo1 && !rope.tiedTo2) return failedmsg(lang.rope_not_attached, {rope:rope})
    if (rope.tiedTo1 && !rope.tiedTo2) {
      obj2 = w[rope.tiedTo1]
    }
    else if (!rope.tiedTo1 && rope.tiedTo2) {
      obj2 = w[rope.tiedTo2]
    } 
    else if (w[rope.tiedTo1].isHere() && !w[rope.tiedTo2].isHere()) {
      obj2 = w[rope.tiedTo1]
    } 
    else if (!w[rope.tiedTo1].isHere() && w[rope.tiedTo2].isHere()) {
      obj2 = w[rope.tiedTo2]
    } 
    else {
      return failedmsg(lang.rope_detach_end_ambig, {rope:rope})
    }
  }
  else {
    if (rope.tiedTo1 !== obj2.name && rope.tiedTo2 !== obj2.name) {
      return failedmsg(lang.rope_not_attached_to, {rope:rope, obj2:obj2})
    }
  }
  if (obj2 === rope.tiedTo1 && rope.tethered) return failedmsg(lang.rope_tethered, {char:char, rope:rope, obj2:obj2})

  rope.detachFrom(char, obj2)
  if (rope.detachMsg === true) return world.SUCCESS
  const s = rope.detachMsg ? rope.detachMsg : lang.rope_detach_success
  msg(s, {char:char, rope:rope, obj2:obj2})
  return world.SUCCESS
}
