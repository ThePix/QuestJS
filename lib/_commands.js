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
      w[player.loc].description()
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
      msg(lang.can_go, {char:player});
      return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Inv', {
    script:function() {
      const listOfOjects = player.getContents(world.INVENTORY);
      msg(lang.inventory_prefix + " " + formatList(listOfOjects, {article:INDEFINITE, lastJoiner:lang.list_and, modified:true, nothing:lang.list_nothing, loc:player.name}) + ".", {char:player});
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
        const zone = w[player.loc]
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
    defmsg:lang.no_topics,
  }),



  new Cmd('Wait', {
    script:function() {
      msg(lang.wait_msg);
      return world.SUCCESS;
    },
  }),
  new Cmd('Smell', {
    script:function() {
      if (currentLocation.smell) {
        printOrRun(player, currentLocation, "smell");
      }
      else {
        msg(lang.no_smell, {char:player});
      }
      return world.SUCCESS;
    },
  }),
  new Cmd('Listen', {
    script:function() {
      if (currentLocation.listen) {
        printOrRun(player, currentLocation, "listen");
      }
      else {
        msg(lang.no_listen, {char:player});
      }
      return world.SUCCESS;
    },
  }),
  new Cmd('PurchaseFromList', {
    script:function() {
      const l = [];
      for (let key in w) {
        if (parser.isForSale(w[key])) {
          const price = w[key].getBuyingPrice(player)
          const row = [sentenceCase(w[key].getName()), world.Money(price)]
          row.push(price > player.money ? "-" : "{cmd:buy " + w[key].alias + ":" + buy + "}")
          l.push(row)
        }
      }
      if (l.length === 0) {
        return failedmsg(lang.nothing_for_sale);
      }
      msg(current_money + ": " + world.Money(player.money));
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
    default:function(options) { falsemsg(options.item.isAtLoc(options.char) ? lang.cannot_drop : lang.not_carrying, options) },
  }),
  new Cmd('Wear2', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.isHeld, cmdRules.canManipulate],
    attName:"wear",
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    default:function(options) { falsemsg(options.item.ensemble ? lang.cannot_wear_ensemble : lang.cannot_wear, options) },
  }),
  new Cmd('Wear', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.canManipulate],
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    default:function(options) { falsemsg(options.item.ensemble ? lang.cannot_wear_ensemble : lang.cannot_wear, options) },
  }),
  new Cmd('Remove', {
    npcCmd:true,
    rules:[cmdRules.isWorn, cmdRules.canManipulate],
    objects:[
      {scope:parser.isWorn, multiple:true},
    ],
    default:function(options) { falsemsg(options.item.ensemble ? lang.cannot_wear_ensemble : lang.not_wearing, options) },
  }),
  new Cmd('Remove2', {
    npcCmd:true,
    rules:[cmdRules.isWorn, cmdRules.canManipulate],
    attName:"remove",
    objects:[
      {scope:parser.isWorn, multiple:true},
    ],
    default:function(options) { falsemsg(options.item.ensemble ? lang.cannot_wear_ensemble : lang.not_wearing, options) },
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
        const result = this.processCommand({char:player, item:obj, verb:'use'})
        return result ? world.SUCCESS : world.FAILED
      }
      
      if (obj.useDefaultsTo) {
        const cmd = findCmd(obj.useDefaultsTo(player))
        if (cmd) {
          const result = cmd.processCommand({char:player, item:obj, verb:'use'});
          return result ? world.SUCCESS : world.FAILED
        }
        else {
          throw new Error("USE command defaulting to unknown command " + obj.useDefaultsTo())
        }
      }

      this.default({char:player, item:obj})
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
    defmsg:lang.cannot_talk_to,
  }),


  new Cmd('GoInItem', {
    regex:/^(?:enter|go in|in|inside|go inside) (.+)$/,
    objects:[
      {scope:parser.isHere},
    ],
    script:function(objects) {
      const obj = objects[0][0]
      log(obj.name)
      log(obj.goInDirection)
      if (!obj.goInDirection) return failedmsg(lang.cannot_go_in, {item:obj})
      return currentLocation[obj.goInDirection].use(player)
    }
  }),
  new Cmd('GoThroughItem', {
    regex:/^(?:go through|walk through) (.+)$/,
    objects:[
      {scope:parser.isHere},
    ],
    script:function(objects) {
      const obj = objects[0][0]
      if (!obj.goThroughDirection) return failedmsg(lang.cannot_go_through, {item:obj})
      return currentLocation[obj.goThroughDirection].use(player)
    }
  }),
  
  // ----------------------------------
  // Complex commands
  
  
  
  new Cmd('Say', {
    script:function(arr) {
      const l = [];
      for (let key in w) {
        if (w[key].sayCanHear && w[key].sayCanHear(player, arr[0])) l.push(w[key]);
      }
      l.sort(function(a, b) { return (b.sayPriority + b.sayBonus) - (a.sayPriority + b.sayBonus); });
      if (l.length === 0) {
        msg(lang.say_no_one_here(player, arr[0], arr[1]));
        return world.SUCCESS;
      }
      
      const options = {char:player, text: sentenceCase(arr[1])}
      if (settings.givePlayerSayMsg) msg(lang.say_something, options)
      for (let chr of l) {
        if (chr.sayQuestion && w[chr.sayQuestion].sayResponse(chr, arr[1])) return world.SUCCESS;
        if (chr.sayResponse && chr.sayResponse(arr[1], arr[0])) return world.SUCCESS;
      }
      if (settings.givePlayerSayMsg) {
        msg(lang.say_no_response, options);
      }
      else {      
        msg(lang.say_no_response_full, options);
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
      return handleFillFromUnknown(player, objects[0][0], objects[1]);
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
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift()
      return handleFillFromUnknown(npc, objects[0][0], objects[1])
    },
  }),
  new Cmd('EmptyInto', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isHeld},
      {scope:parser.isPresent},
    ],
    script:function(objects) {
      return handleFillFromVessel(player, objects[0][0], objects[1][0], undefined);
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
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift()
      return handleFillFromVessel(npc, objects[0][0], objects[1][0], undefined)
    },
  }),
  new Cmd('EmptyFluidInto', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {special:'fluid'},
      {scope:parser.isPresent},
    ],
    script:function(objects) {
      return handleEmptyFluidInto(player, objects[1][0], objects[0]);
    },
  }),
  new Cmd('NpcEmptyFluidInto', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"Fill",
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {special:'fluid'},
      {scope:parser.isPresent},
    ],
    script:function(objects) {
      const npc = objects[0][0]
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift()
      return handleEmptyFluidInto(npc, objects[1][0], objects[0])
    },
  }),
  new Cmd('PutFluidIn', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {special:'fluid'},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      return handleFillFromUnknown(player, objects[1][0], objects[0])
    },
  }),
  


  new Cmd('PutIn', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isHeld, multiple:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      return handleInOutContainer(player, objects, "drop", handleSingleDropInContainer)
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
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
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
      return handleInOutContainer(player, objects, "take", handleSingleTakeOutContainer)
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
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
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
      return handleGiveToNpc(player, objects)
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
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
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
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift()
      objects.push([player])
      return handleGiveToNpc(npc, objects)
    },
  }),



  new Cmd('PushExit', {
    rules:[cmdRules.canManipulate, cmdRules.isHereNotHeld],
    cmdCategory:"Push",
    script:function(objects) {
      return handlePushExit(player, objects);
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
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
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
    script:function(objects) {
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope})
      return rope.handleTieTo(player, objects[1][0]) 
    },
  }),
  new Cmd('NpcTieTo', {
    rules:[cmdRules.canManipulate, cmdRules.isHeld],
    cmdCategory:"Tie",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift();
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope})
      return rope.handleTieTo(npc, objects[1][0]) 
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHeld, attName:"rope"},
      {scope:parser.isHere, attName:"attachable"},
    ]
  }),

  new Cmd('Untie', {
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    cmdCategory:"Untie",
    objects:[
      {scope:parser.isHere, attName:"rope"},
    ],
    script:function(objects) {
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope})
      return rope.handleUntieFrom(player) 
    },
  }),
  new Cmd('NpcUntie', {
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    cmdCategory:"Tie",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift();
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope})
      return rope.handleUntieFrom(npc) 
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHeld, attName:"rope"},
    ]
  }),

  new Cmd('UntieFrom', {
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    cmdCategory:"Untie",
    objects:[
      {scope:parser.isHere, attName:"rope"},
      {scope:parser.isHere, attName:"attachable"},
    ],
    script:function(objects) {
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope})
      return rope.handleUntieFrom(player, objects[1][0]) 
    },
  }),
  new Cmd('NpcUntieFrom', {
    rules:[cmdRules.canManipulate, cmdRules.isHere],
    cmdCategory:"Tie",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift();
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope})
      return rope.handleUntieFrom(npc, objects[1][0]) 
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHere, attName:"rope"},
      {scope:parser.isHere, attName:"attachable"},
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
        const result = obj.useWith(player, obj2)
        return result ? world.SUCCESS : world.FAILED
      }
      if (obj2.withUse) {
        const result = obj2.withUse(player, obj)
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

      this.default({char:player, item:obj})
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
      if (!obj.npc) return failedmsg(lang.cannot_follow, tpParams)
      if (!obj.getAgreement("Follow")) return world.FAILED
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
      if (!player.canTalk()) return false
      if (!arr[0][0].askabout) return failedmsg(lang.cannot_ask_about, {char:player, item:arr[0][0], text:arr[2]})

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
      if (!player.canTalk()) return false
      if (!arr[0][0].tellabout) return failedmsg(cannot_tell_about, {char:player, item:arr[0][0], text:arr[1]})

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
      if (typeof walkthroughs === "undefined") return failedmsg("No walkthroughs set")
      const wt = walkthroughs[objects[0]]
      if (wt === undefined) return failedmsg("No walkthrough found called " + objects[0])
      for (let el of wt) {
        if (typeof el === "string") {
          runCmd(el)
        }
        else {
          settings.walkthroughMenuResponses = Array.isArray(el.menu) ? el.menu : [el.menu]
          runCmd(el.cmd)
          settings.walkthroughMenuResponses = []
        }
      }
      return world.SUCCESS_NO_TURNSCRIPTS
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
          const res = el.test(w[key])
          if (res === true) el.count++
          if (typeof res === 'number') el.count += res
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
// want to transfer a fluid from a source to a sink

function handleFillFromUnknown(char, sink, fluid) {
  // fluid can be undefined
  const options = {fluid:fluid}
  if (!util.findSource(options)) return failedmsg(fluid ? lang.no_fluid_here : lang.no_fluid_here_at_all, options)
  if (options.source.vessel) return handleFillFromVessel(char, options.source, sink, options.fluid)
  return handleFillFromSource(char, options.source, sink, options.fluid)
}

function handleFillFromVessel(char, source, sink, fluid) {
  // fluid can be undefined
  if (!fluid) fluid = source.containedFluidName
  const options = {char:char, item:source, fluid:fluid, obj:sink}
  
  if (!source.vessel) return failedmsg(lang.not_vessel, options)
  if (source.closed) return  failedmsg(lang.container_closed, options)
  if (!source.containedFluidName) return failedmsg(lang.already_empty, options)
  if (!sink.vessel && !sink.sink) return failedmsg(lang.not_sink, options)
  if (sink.vessel && sink.containedFluidName) return failedmsg(lang.already_full, options)
  if (!char.canManipulate(source, "fill")) return world.FAILED
  if (!char.getAgreement("Fill", source, sink, fluid)) return world.FAILED
  if (!source.isAtLoc(char.name)) return failedmsg(lang.not_carrying, options)
  if (source.containedFluidName !== fluid) return failedmsg(lang.no_fluid_here, options);
  return source.doEmpty(options) ? world.SUCCESS: world.FAILED;
}


function handleFillFromSource(char, source, sink, fluid) {
  const options = {char:char, item:source, fluid:fluid, obj:sink}
  log(options)
  
  if (!source.isSourceOf) return failedmsg(lang.not_source, options)
  if (source.closed) return  failedmsg(lang.container_closed, options)
  if (!sink.vessel) return failedmsg(lang.not_vessel, options)
  if (sink.containedFluidName) return failedmsg(lang.already_full, options)
  if (!char.canManipulate(sink, "fill")) return world.FAILED
  if (!char.getAgreement("Fill", source, sink, fluid)) return world.FAILED
  // if the source is the room itself, we assume it is here
  if (!source.room && !source.isAtLoc(char.loc)) return failedmsg(lang.not_here, options)
  if (!source.isSourceOf(fluid)) return failedmsg(lang.no_fluid_here, options)
  return sink.doFill(options) ? world.SUCCESS: world.FAILED;
}

function handleEmptyFluidInto(char, sink, fluid) {
  for (const key in w) {
    const o = w[key]
    if (o.vessel && o.containedFluidName === fluid && o.loc === char.name) {
      return handleFillFromVessel(char, o, sink, fluid)
    }
  }
  return failedmsg(lang.not_carrying_fluid, {char:char, fluid:fluid});
}





function handleInOutContainer(char, objects, verb, func) {
  let success = false;
  const container = objects[1][0];
  const options = {char:char, container:container, verb:verb, multiple:objects[0].length > 1 || parser.currentCommand.all}
  
  if (container.handleInOutContainer) return container.handleInOutContainer(options, objects[0])
  
  if (!container.container) return failedmsg(lang.not_container, options)
  if (container.closed) return failedmsg(lang.container_closed, options)

  for (const obj of objects[0]) {
    if (!char.canManipulate(obj, verb)) return world.FAILED
    options.count = obj.countable ? obj.extractNumber() : undefined
    options.item = obj
    if (options.count) options[obj.name + '_count'] = options.count  // for the text processor
    const flag = func(char, container, obj, options)
    success = success || flag
  }
  if (success) char.pause();
  return success ? world.SUCCESS : world.FAILED;
}

function handleSingleDropInContainer(char, container, obj, options) {
  options.fromLoc = char.name
  options.toLoc = container.name
  if (!char.getAgreement("Drop/in", obj, container)) return
  if (!container.testForRecursion(char, obj)) return false
  if (obj.testDrop && !obj.testDrop(options)) return false
  if (!obj.msgDropIn) return falsemsg(lang.cannot_drop, options)
  if (container.testDropIn && !container.testDropIn(options)) return false
  if (!obj.isAtLoc(char.name)) return failedmsg(lang.not_carrying, {char:char, item:obj})
  if (obj.getTakeDropCount) obj.getTakeDropCount(options, char.name)

  obj.moveToFrom(options)
  if (typeof obj.msgDropIn === 'function') {
    obj.msgDropIn(options)
  }
  else {
    msg(obj.msgDropIn, options)
  }
  return true;
}

function handleSingleTakeOutContainer(char, container, obj, options) {
  options.toLoc = char.name
  options.fromLoc = container.name
  if (!char.getAgreement("Take", obj)) return false
  if (!obj.isAtLoc(container.name)) return failedmsg(lang.not_inside(container, obj))
  if (obj.getTakeDropCount) obj.getTakeDropCount(options, container.name)
  if (obj.testTake && !obj.testTake(options)) return false
  if (container.testTakeOut && !container.testTakeOut(options)) return false

  obj.moveToFrom(options)
  msg(obj.msgTakeOut, options)
  return true
}



function handleGiveToNpc(char, objects) {
  let success = false;
  const npc = objects[1][0];
  const multiple = objects[0].length > 1 || parser.currentCommand.all;
  if (!npc.npc && npc !== player) return failedmsg(lang.not_npc_for_give, {char:char, item:npc})
    
  for (const obj of objects[0]) {
    const flag = handleSingleGiveToNpc(char, npc, obj, {multiple:multiple, item:obj})
    success = success || flag
  }
  if (success === world.SUCCESS) char.pause();
  return success ? world.SUCCESS : world.FAILED;
}
// char is giving obj to npc
function handleSingleGiveToNpc(char, npc, obj, options) {
  options.item = obj
  options.char = char
  options.npc = npc
  options.toLoc = npc.name
  options.fromLoc = char.name
  if (!obj.isAtLoc(char.name)) return falsemsg(lang.not_carrying, options)
  if (!char.getAgreement("Give", obj, npc)) return false
  if (!char.canManipulate(obj, "give")) return false
  if (npc.testGive && !npc.testGive(options)) return false

  if (char.giveItem) {
    char.giveItem(options)
  }
  else {
    msg(lang.done_msg, options)
    obj.moveToFrom(options)
  }
  if (npc.afterGive) return npc.afterGive(options)
  if (obj.afterBeingGiven) return obj.afterBeingGiven(options)

  return true
}





function handleStandUp(objects) {
  let char
  if (objects.length === 0) {
    char = player
  }
  else {
    const npc = objects[0][0]
    if (!npc.npc) {
      failedmsg(lang.not_npc, {char:player, item:npc});
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
  obj.moveToFrom({char:char, toLoc:dest, item:obj});
  char.loc = dest;
  tpParams.dest = w[dest]
  msg(lang.push_exit_successful, tpParams);
  return world.SUCCESS;
}






