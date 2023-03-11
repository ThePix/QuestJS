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


const commands = []


  // ----------------------------------
  // Single word commands
  
  // Cannot just set the script to helpScript as we need to allow the
  // author to change it in code.js, which is loaded after this.
  new Cmd('MetaHello', {
    script:lang.helloScript,
  }),    
  new Cmd('MetaHelp', {
    script:lang.helpScript,
  }),    
  new Cmd('MetaHint', {
    script:function() {
      if (settings.hintResponses) {
        respond({char:{msg:function(s) { settings.hintResponsesInGame ? msg(s) : metamsg(s)}}}, settings.hintResponses)
        return world.SUCCESS_NO_TURNSCRIPTS

      }
      if (settings.hintSheetData) {
        io.showHintSheet()
        return world.SUCCESS_NO_TURNSCRIPTS
      }
      if (settings.hintInvisiClues) {
        metamsg(lang.linkHintInvisiClues)
        return world.SUCCESS_NO_TURNSCRIPTS
      }
      return lang.hintScript()
    },
  }),
  new Cmd('MetaCredits', {
    script:lang.aboutScript,
  }),
  new Cmd('MetaDarkMode', {
    script:io.toggleDarkMode,
  })
  new Cmd('MetaNarrowMode', {
    script:io.toggleNarrowMode,
  })
  new Cmd('MetaAutoScrollMode', {
    script:io.toggleAutoScrollMode,
  })
  new Cmd('MetaPlainFontMode', {
    script:io.togglePlainFontMode,
  })
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
  })
  new Cmd('MetaWarnings', {
    script:lang.warningsScript,
  })
  
  
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
  })
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
  })
  new Cmd('MetaBrief', {
    script:function() {
      settings.verbosity = world.BRIEF
      metamsg(lang.mode_brief)
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
  new Cmd('MetaTerse', {
    script:function() {
      settings.verbosity = world.TERSE
      metamsg(lang.mode_terse)
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
  new Cmd('MetaVerbose', {
    script:function() {
      settings.verbosity = world.VERBOSE
      metamsg(llang.mode_verbose)
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
  
  new Cmd('MetaTranscript', {
    script:lang.transcriptScript,
  })
  new Cmd('MetaTranscriptStart', {
    script:function() {
      if (saveLoad.transcript) {
        metamsg(lang.transcript_already_on)
        return world.FAILED
      }
      saveLoad.transcriptClear()
      saveLoad.transcriptStart()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
  new Cmd('MetaTranscriptOn', {
    script:function() {
      if (saveLoad.transcript) {
        metamsg(lang.transcript_already_on)
        return world.FAILED
      }
      saveLoad.transcriptStart()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
  new Cmd('MetaTranscriptOff', {
    script:function() {
      if (!saveLoad.transcript) {
        metamsg(lang.transcript_already_off)
        return world.FAILED
      }
      saveLoad.transcriptEnd()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
  new Cmd('MetaTranscriptClear', {
    script:function() {
      saveLoad.transcriptClear()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
  new Cmd('MetaTranscriptShow', {
    script:function() {
      saveLoad.transcriptShow()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
  new Cmd('MetaUserComment', {
    script:function(arr) {
      commentmsg("Comment: " + arr[0])
      return world.SUCCESS_NO_TURNSCRIPTS
    },
    objects:[
      {special:'text'},
    ]
  })
  
  // ----------------------------------
  // File system commands
  new Cmd('MetaSave', {
    script:lang.saveLoadScript,
  })
  new Cmd('MetaSaveOverwriteGame', {
    script:function(arr) {
      saveLoad.saveGame(arr[0], true)
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects:[
      {special:'text'},
    ]
  })
  new Cmd('MetaSaveGame', {
    script:function(arr) {
      if (settings.localStorageDisabled) {
        saveLoad.saveGameAsFile(arr[0])
      }
      else {
        saveLoad.saveGame(arr[0])
      }
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects:[
      {special:'text'},
    ]
  })
  new Cmd('MetaFileSaveGame', {
    script:function(arr) {
      saveLoad.saveGameAsFile(arr[0])
      return world.SUCCESS_NO_TURNSCRIPTS;
    },
    objects:[
      {special:'text'},
    ]
  })
  new Cmd('MetaLoad', {
    script:function(arr) {
      if (settings.localStorageDisabled) {
        document.getElementById('fileDialog').click()
      }
      else {
        lang.saveLoadScript()
      }
      return world.SUCCESS_NO_TURNSCRIPTS
    },
    objects:[
    ]
  })
  new Cmd('MetaLoadGame', {
    script:function(arr) {
      saveLoad.loadGameFromLS(arr[0])
      return world.SUCCESS_NO_TURNSCRIPTS
    },
    objects:[
      {special:'text'},
    ]
  })
  new Cmd('MetaFileLoadGame', {
    script:function(arr) {
      document.getElementById('fileDialog').click()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
    objects:[
      {special:'text'},
    ]
  })
  new Cmd('MetaDir', {
    script:function() {
      saveLoad.dirGame()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
  new Cmd('MetaDeleteGame', {
    script:function(arr) {
      saveLoad.deleteGame(arr[0])
      return world.SUCCESS_NO_TURNSCRIPTS
    },
    objects:[
      {special:'text'},
    ]
  })


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
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
  new Cmd('MetaAgain', {
    script:function() {
      return io.againOrOops(true)
    },
  })
  new Cmd('MetaOops', {
    script:function() {
      return io.againOrOops(false)
    },
  })
  new Cmd('MetaRestart', {
    script:function() {
      askText(lang.restart_are_you_sure, function(result) {
        if (result.match(lang.yes_regex)) {
          location.reload()
        }
        else {
          metamsg(lang.restart_no)
        }
      });
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
  new Cmd('MetaPronouns', {
    script:function() {
      metamsg('See the developer console (F12) for the current pronouns')
      console.log(parser.pronouns)
    },
  })
  new Cmd('MetaScore', {
    script:function() {
      metamsg(lang.scores_not_implemented)
    },
  })
  new Cmd('MetaTopicsNote', {
    script:lang.topicsScript,
  })


  
  // These are kind of meta-commands - perhaps free commands is a better term.
  // I see them as jogging the user's mind about the game world, rather than
  // doing something in the game world, so by default
  // no ttime passes.
  // Set settings.lookCountsAsTurn to true if you disagree!
  new Cmd('Look', {
    script:function() {
      currentLocation.description(true);
      return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
    },
    score:50,
  })
  new Cmd('Exits', {
    script:function() {
      msg(lang.can_go, {char:player});
      return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
    },
  })
  new Cmd('Inv', {
    script:function() {
      const listOfOjects = player.getContents(world.INVENTORY);
      msg(lang.inventory_prefix + " " + formatList(listOfOjects, {article:INDEFINITE, lastSep:lang.list_and, modified:true, nothing:lang.list_nothing, loc:player.name}) + ".", {char:player});
      return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS;
    },
  })
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
  })
  new Cmd('Topics', {
    attName:"topics",
    objects:[
      {scope:parser.isNpcAndHere},
    ],
    defmsg:lang.no_topics,
  })



  new Cmd('Wait', {
    script:function() {
      msg(lang.wait_msg);
      return world.SUCCESS;
    },
  })
  new Cmd('Smell', {
    script:function() {
      if (currentLocation.smell) {
        printOrRun(player, currentLocation, "smell");
      }
      else if (currentLocation._region && regions[currentLocation._region].smell) {
        msg(regions[currentLocation._region].smell)
      }
      else {
        msg(lang.no_smell, {char:player});
      }
      return world.SUCCESS;
    },
  })
  new Cmd('Listen', {
    script:function() {
      if (currentLocation.listen) {
        printOrRun(player, currentLocation, "listen");
      }
      else if (currentLocation._region && regions[currentLocation._region].listen) {
        msg(regions[currentLocation._region].listen)
      }
      else {
        msg(lang.no_listen, {char:player});
      }
      return world.SUCCESS;
    },
  })
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
  })
  

  // Out of convenient order as it needs to be before TAKE
  new Cmd('GetFluid', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    objects:[
      {special:'fluid'},
    ],
    score:5,
    script:function(objects) {
      const options = {char:player, fluid:objects[0]}
      if (!util.findSource(options)) return failedmsg(lang.no_fluid_here, options)
      return failedmsg(lang.cannot_get_fluid, options)
    },
  })


  
  // ----------------------------------
  // Verb-object commands
  new Cmd('Examine', {
    npcCmd:true,
    objects:[
      {scope:parser.isPresent, multiple:true}
    ],
    defmsg:lang.default_examine,
  })
  new Cmd('LookAt', {  // used for NPCs
    npcCmd:true,
    attName:'examine',
    objects:[
      {scope:parser.isPresentOrMe}
    ],
    defmsg:lang.default_examine,
  })
  new Cmd('LookOut', {
    npcCmd:true,
    rules:[cmdRules.isPresent],
    objects:[
      {scope:parser.isPresent}
    ],
    attName:"lookout",
    defmsg:lang.cannot_look_out,
  })
  new Cmd('LookBehind', {
    npcCmd:true,
    rules:[cmdRules.isPresent],
    attName:"lookbehind",
    objects:[
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_there,
  })
  new Cmd('LookUnder', {
    npcCmd:true,
    rules:[cmdRules.isPresent],
    attName:"lookunder",
    objects:[
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_there,
  })
  new Cmd('LookThrough', {
    npcCmd:true,
    rules:[cmdRules.isPresent],
    attName:"lookthrough",
    objects:[
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_there,
  })
  new Cmd('LookInside', {
    npcCmd:true,
    rules:[cmdRules.isPresent],
    attName:"lookinside",
    objects:[
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_inside,
  })
  new Cmd('Search', {
    npcCmd:true,
    rules:[cmdRules.isPresent],
    attName:"search",
    objects:[
      {scope:parser.isPresent}
    ],
    defmsg:lang.nothing_there,
  })

  new Cmd('Take', {
    npcCmd:true,
    rules:[cmdRules.isHereAlready, cmdRules.testManipulate],
    objects:[
      {scope:parser.isHereOrContained, allScope:parser.isHereOrLocationContained, multiple:true},
    ],
    defmsg:lang.cannot_take,
  })
  new Cmd('Drop', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.testManipulate],
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    default:function(options) { falsemsg(options.item.isAtLoc(options.char) ? lang.cannot_drop : lang.not_carrying, options) },
  })
  new Cmd('Wear2', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.isHeld, cmdRules.testManipulate],
    attName:"wear",
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    default:function(options) { falsemsg(options.item.ensemble ? lang.cannot_wear_ensemble : lang.cannot_wear, options) },
  })
  new Cmd('Wear', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.testManipulate],
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    default:function(options) { falsemsg(options.item.ensemble ? lang.cannot_wear_ensemble : lang.cannot_wear, options) },
  })
  new Cmd('Remove', {
    npcCmd:true,
    rules:[cmdRules.isWorn, cmdRules.testManipulate],
    objects:[
      {scope:parser.isWorn, multiple:true},
    ],
    default:function(options) { falsemsg(options.item.ensemble ? lang.cannot_wear_ensemble : lang.not_wearing, options) },
  })
  new Cmd('Remove2', {
    npcCmd:true,
    rules:[cmdRules.isWorn, cmdRules.testManipulate],
    attName:"remove",
    objects:[
      {scope:parser.isWorn, multiple:true},
    ],
    default:function(options) { falsemsg(options.item.ensemble ? lang.cannot_wear_ensemble : lang.not_wearing, options) },
  })
  new Cmd('Read', {
    npcCmd:true,
    rules:[cmdRules.isPresent],
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_read,
  })
  new Cmd('Purchase', {
    npcCmd:true,
    rules:[cmdRules.testManipulate],
    objects:[
      {scope:parser.isForSale},
    ],
    defmsg:lang.cannot_purchase_here,
  })
  new Cmd('Sell', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.testManipulate],
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_sell_here,
  })
  new Cmd('Smash', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresent],
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_smash,
  })
  new Cmd('Turn', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isHere},
    ],
    defmsg:lang.cannot_turn,
  })
  new Cmd('TurnLeft', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isHere},
    ],
    defmsg:lang.cannot_turn,
  })
  new Cmd('TurnRight', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isHere},
    ],
    defmsg:lang.cannot_turn,
  })
  new Cmd('SwitchOn', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    attName:"switchon",
    cmdCategory:"SwitchOn",
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_switch_on,
  })
  new Cmd('SwitchOn2', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    attName:"switchon",
    cmdCategory:"SwitchOn",
    objects:[
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_switch_on,
  })
  
  new Cmd('SwitchOff2', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    attName:"switchoff",
    cmdCategory:"SwitchOff",
    objects:[
      {scope:parser.isHeld, multiple:true, attName:"switchon"},
    ],
    defmsg:lang.cannot_switch_off,
  })
  new Cmd('SwitchOff', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    attName:"switchoff",
    cmdCategory:"SwitchOff",
    objects:[
      {scope:parser.isHeld, multiple:true, attName:"switchoff"},
    ],
    defmsg:lang.cannot_switch_off,
  })
  
  new Cmd('Open', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isPresent, multiple:true, attName:"open"},
    ],
    defmsg:lang.cannot_open,
  })
  new Cmd('OpenWith', {
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isPresent, multiple:true, attName:"open"},
      {scope:parser.isHeld, multiple:true},
    ],
    defmsg:lang.cannot_open_with,
  })
  
  new Cmd('Close', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isPresent, multiple:true, attName:"close"},
    ],
    defmsg:lang.cannot_close,
  })
  
  new Cmd('Lock', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isPresent, multiple:true, attName:"lock"},
    ],
    defmsg:lang.cannot_lock,
  })
  new Cmd('LockWith', {
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isPresent, attName:"lock"},
      {scope:parser.isHeld, attName:'key'},
    ],
    defmsg:lang.cannot_lock_with,
  })
  
  new Cmd('Unlock', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isPresent, multiple:true, attName:"unlock"},
    ],
    defmsg:lang.cannot_unlock,
  })
  new Cmd('UnlockWith', {
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isPresent, attName:"unlock"},
      {scope:parser.isHeld, attName:'key'},
    ],
    defmsg:lang.cannot_unlock_with,
  })
  
  new Cmd('Push', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isPresent},
    ],
    defmsg:lang.nothing_useful,
  })

  new Cmd('Pull', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isPresent},
    ],
    defmsg:lang.nothing_useful,
  })
  new Cmd('Fill', {
    npcCmd:true,
    rules:[cmdRules.testManipulate],
    objects:[
      {scope:parser.isPresent},
    ],
    defmsg:lang.cannot_fill,
  })
  new Cmd('Empty', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isPresent},
    ],
    defmsg:lang.cannot_empty,
  })

  new Cmd('SmellItem', {
    npcCmd:true,
    attName:"smell",
    objects:[
      {scope:parser.isPresent, attName:"smell"},
    ],
    defmsg:lang.cannot_smell,
  })
  new Cmd('ListenToItem', {
    npcCmd:true,
    attName:"listen",
    objects:[
      {scope:parser.isPresent, attName:"listen"},
    ],
    defmsg:lang.cannot_listen,
  })

  new Cmd('Eat', {
    npcCmd:true,
    rules:[cmdRules.isHeldNotWorn, cmdRules.testManipulate],
    objects:[
      {special:'text'},
      {scope:parser.isHeld, multiple:true, attName:"ingest"},
    ],
    defmsg:lang.cannot_eat,
  })
  new Cmd('Drink', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    objects:[
      {special:'text'},
      {scope:parser.isPresent, attName:"ingest"},
    ],
    defmsg:lang.cannot_drink,
  })
  new Cmd('Ingest', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    objects:[
      {special:'text'},
      {scope:parser.isPresent, attName:"ingest"},
    ],
    defmsg:lang.cannot_ingest,
  })

  new Cmd('Sit', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.testPosture],
    attName:"siton",
    objects:[],
    script:function() {
      const objs = scopeBy(el => el.siton && el.isAtLoc(player.loc))
      log(objs)
      if (objs.length === 0) return failedmsg(lang.no_sit_object)
      return objs[0].siton({char:player, item:objs[0]}) ? world.SUCCESS : world.FAILED
    },
  })
  new Cmd('Recline', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.testPosture],
    attName:"reclineon",
    objects:[],
    script:function() {
      const objs = scopeBy(el => el.reclineon && el.isAtLoc(player.loc))
      log(objs)
      if (objs.length === 0) return failedmsg(lang.no_recline_object)
      return objs[0].reclineon({char:player, item:objs[0]}) ? world.SUCCESS : world.FAILED
    },
  })
  new Cmd('SitOn', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.testPosture, cmdRules.isHere],
    attName:"siton",
    objects:[
      {scope:parser.isHere, attName:"assumePosture"},
    ],
    defmsg:lang.cannot_sit_on,
  })
  new Cmd('StandOn', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.testPosture, cmdRules.isHere],
    attName:"standon",
    objects:[
      {scope:parser.isHere, attName:"assumePosture"},
    ],
    defmsg:lang.cannot_stand_on,
  })
  new Cmd('ReclineOn', {
    npcCmd:true,
    cmdCategory:"Posture",
    rules:[cmdRules.testPosture, cmdRules.isHere],
    attName:"reclineon",
    objects:[
      {scope:parser.isHere, attName:"assumePosture"},
    ],
    defmsg:lang.cannot_recline_on,
  })
  new Cmd('GetOff', {
    npcCmd:true,
    cmdCategory:"Posture",
    score:5, // to give priority over TAKE
    rules:[cmdRules.testPosture, cmdRules.isHere],
    attName:"getoff",
    cmdCategory:"Posture",
    objects:[
      {scope:parser.isHere, attName:"assumePosture"},
    ],
    defmsg:lang.already,
  })

  new Cmd('Use', {
    npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresentOrContained],
    objects:[
      {scope:parser.isPresent},
    ],
    script:function(objects) {
      const obj = objects[0][0]
      const options = {char:player, item:obj, verb:'use'}
      
      // Use this to bypass the rules, say if the object could be in a strange place
      if (obj.useFunction) {
        const result = obj.useFunction(options)
        return result ? world.SUCCESS : world.FAILED
      }

      if (obj.use) {
        const result = this.processCommand(options)
        return result ? world.SUCCESS : world.FAILED
      }
      
      if (obj.useDefaultsTo) {
        const cmd = findCmd(obj.useDefaultsTo(player))
        if (cmd) {
          const result = cmd.processCommand(options);
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
  })
  
  new Cmd('TalkTo', {
    rules:[cmdRules.canTalkTo],
    attName:"talkto",
    objects:[
      {scope:parser.isNpcAndHere},
    ],
    defmsg:lang.cannot_talk_to,
  })




  
  
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
        if (chr.sayQuestion && chr.respondToAnswer(arr[1])) return world.SUCCESS;
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
  })
  
  
  new Cmd('Stand', {
    rules:[cmdRules.testPosture],
    script:handleStandUp,
  })
  new Cmd('NpcStand', {
    rules:[cmdRules.testPosture],
    cmdCategory:"Posture",
    objects:[
      {scope:parser.isHere, attName:"npc"},
    ],
    script:handleStandUp,
  })
  
  
  


  new Cmd('Make', {
    objects:[
      {scope:parser.isUnconstructed, extendedScope:true},
    ],
    script:function(objects) {
      const obj = objects[0][0]
      return obj.build({char:player, item:obj}) ? world.SUCCESS : world.FAILED
    },
  })
  new Cmd('MakeWith', {
    objects:[
      {scope:parser.isUnconstructed, extendedScope:true},
      {scope:parser.isHere, multiple:true},
    ],
    script:function(objects) {
      const obj = objects[0][0]
      const options = {char:player, item:obj}
      if (!obj.testComponents(objects[1], options)) return world.FAILED
      return obj.build(options) ? world.SUCCESS : world.FAILED
    },
  })
  new Cmd('NpcMake', {
    objects:[
      {scope:parser.isUnconstructed},
    ],
    script:function(objects) {
      const npc = objects[0][0]
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift()
      const obj = objects[0][0]
      return obj.build({char:npc, item:obj}) ? world.SUCCESS : world.FAILED
    },
  })
  new Cmd('NpcMakeWith', {
    objects:[
      {scope:parser.isUnconstructed},
      {scope:parser.isHere, multiple:true},
    ],
    script:function(objects) {
      const npc = objects[0][0]
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift()
      const obj = objects[0][0]
      const options = {char:npc, item:obj}
      if (!obj.testComponents(objects[1], options)) return world.FAILED
      return obj.build(options) ? world.SUCCESS : world.FAILED
    },
  })

  

  new Cmd('FillWith', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isHeld},
      {special:'fluid'},
    ],
    script:function(objects) {
      return handleFillFromUnknown(player, objects[0][0], objects[1]);
    },
  })
  new Cmd('NpcFillWith', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
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
  })
  new Cmd('EmptyInto', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isHeld},
      {scope:parser.isPresent},
    ],
    script:function(objects) {
      return handleFillFromVessel(player, objects[0][0], objects[1][0], undefined);
    },
  })
  new Cmd('NpcEmptyInto', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
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
  })
  new Cmd('EmptyFluidInto', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    objects:[
      {special:'fluid'},
      {scope:parser.isPresent},
    ],
    script:function(objects) {
      return handleEmptyFluidInto(player, objects[1][0], objects[0]);
    },
  })
  new Cmd('NpcEmptyFluidInto', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
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
  })
  new Cmd('PutFluidIn', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    objects:[
      {special:'fluid'},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      return handleFillFromUnknown(player, objects[1][0], objects[0])
    },
  })
  


  new Cmd('PutIn', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isHeld, multiple:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      return handleInOutContainer(player, objects, "drop", handleSingleDropInContainer)
    },
  })
  
  new Cmd('NpcPutIn', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
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
  })

  new Cmd('TakeOut', {
    rules:[cmdRules.testManipulate, cmdRules.isPresent],
    objects:[
      {scope:parser.isContained, multiple:true},
      {scope:parser.isPresent, attName: "container"},
    ],
    script:function(objects) {
      return handleInOutContainer(player, objects, "take", handleSingleTakeOutContainer)
    },
  })
  
  new Cmd('NpcTakeOut', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
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
  })

  new Cmd('GiveTo', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    objects:[
      {scope:parser.isHeld, multiple:true},
      {scope:parser.isPresent, attName: "npc"},
    ],
    script:function(objects) {
      return handleGiveToNpc(player, objects)
    },
  })
  new Cmd('NpcGiveTo', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
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
  })

  new Cmd('Give', {
    antiRegexes:[lang.regex.GiveTo],
    matchItems:function(s) {
      if (!this._test(s)) return
      if (!this._testNot(s)) return
      
      parser.msg("---------------------------------------------------------");
      parser.msg("* Looking at candidate: " + this.name);
      
      // this is a temporary set of data used while we parser one input
      this.tmp.objectTexts = [],
      this.tmp.objects = [],
      this.tmp.score = this.score ? this.score : 10
      this.tmp.error = undefined
      
      let arr = this.tmp.regex.exec(s)
      arr.shift()  // first element is the whole match, so discard

      const scope = world.scope
      const npcs = scope.filter(el => (el.npc && el !== player))
      const items = array.fromTokens(arr[0].split(' '), scope)
      if (!items) return this.setError(parser.NO_OBJECT, lang.object_unknown_msg(arr[0]))
      
      // The first item could be the NPC to give it to,
      // and we want to pull that out.
      // Disambiguation makes this tricky...
      if (items[0].length === 1) {
        // No need to disambig, only one item matched
        if (items[0][0].npc) {
          this.tmp.objects[1] = items[0]
          items.shift()
          this.tmp.objects[0] = items
        }
        else {
          if (npcs.length === 0) return this.setError(parser.NO_OBJECT, lang.object_unknown_msg(arr[0]))
          this.tmp.objects[1] = npcs
          this.tmp.objects[0] = items
        }
      }
      else {
        // At least two items matched
        // NPCs will take priority
        const npcList = items[0].filter(el => el.npc)
        if (npcList.length === 0) {
          if (npcs.length === 0) return this.setError(parser.NO_OBJECT, lang.no_receiver)
          this.tmp.objects[1] = npcs
          this.tmp.objects[0] = items
        }
        else if (npcList.length === 1) {
          this.tmp.objects[1] = [npcList[0]]
          items.shift()
          this.tmp.objects[0] = items
        }
        else {
          this.tmp.objects[1] = [npcList]
          items.shift()
          this.tmp.objects[0] = items
        }
      }
      
      // pre-disambig items in this.tmp.objects[0]
      for (let i = 0; i < this.tmp.objects[0].length; i++) {
        const el = this.tmp.objects[0][i]
        if (el.length === 1) {
          this.tmp.objects[0][i] = el[0]
        }
        else {
          const held = el.filter(el => el.loc === player.name)
          if (held.length === 1) {
            this.tmp.objects[0][i] = held[0]
          }
          else if (held.length > 1) {
            this.tmp.objects[0][i] = held
          }
          // otherwise, stick we hat we have
        }
      }
      
      this.tmp.score = 10
      parser.msg("..Base score: " + this.tmp.score)
    },

    script:function(objects) {
      return handleGiveToNpc(player, objects)
    },
  })

  new Cmd('NpcGive', {
    antiRegexes:lang.regex.NpcGiveTo,
    matchItems:function(s) {
      if (!this._test(s)) return
      if (!this._testNot(s)) return
      
      parser.msg("---------------------------------------------------------")
      parser.msg("* Looking at candidate: " + this.name)
      
      // this is a temporary set of data used while we parse one input
      this.tmp.objectTexts = [],
      this.tmp.objects = [],
      this.tmp.score = this.score ? this.score : 10
      this.tmp.error = undefined
      
      let arr = this.tmp.regex.exec(s)
      arr.shift()  // first element is the whole match, so discard
      const scope = world.scope
      
      // Which NPC are we asking to do this?
      let char
      const charString = arr.shift()
      const possibleChars = parser.findInList(charString, scope, {})
      if (possibleChars.length === 0) return this.setError(parser.NO_OBJECT, lang.object_unknown_msg(charString))
      if (possibleChars.length === 1) {
        char = possibleChars[0]
      }
      else {
        const actualChars = possibleChars.filter(el => ((el.npc || el.player) && el !== char))
        if (possibleChars.length === 0) {
          char = possibleChars
        }
        else if (possibleChars.length === 1) {
          char = possibleChars[0]
        }
        else {
          char = possibleChars
        }
      }
      
      // npcs is a list of people we could be asking the character to give to
      const npcs = scope.filter(el => ((el.npc || el.player) && el !== char))
      const items = array.fromTokens(arr[0].split(' '), scope)
      if (!items) return this.setError(parser.NO_OBJECT, lang.object_unknown_msg(arr[0]))
      
      // The first item could be the NPC to give it to,
      // and we want to pull that out.
      // Disambiguation makes this tricky...
      if (items[0].length === 1) {
        // No need to disambig, only one item matched
        if (items[0][0].npc || items[0][0] === player) {
          this.tmp.objects[1] = items[0]
          items.shift()
          this.tmp.objects[0] = items
        }
        else {
          if (npcs.length === 0) return this.setError(parser.NO_OBJECT, lang.object_unknown_msg(arr[0]))
          this.tmp.objects[1] = npcs
          this.tmp.objects[0] = items
        }
      }
      else {
        // At least two items matched
        // NPCs will take priority
        const npcList = items[0].filter(el => el.npc || el.player)
        if (npcList.length === 0) {
          if (npcs.length === 0) return this.setError(parser.NO_OBJECT, lang.no_receiver)
          this.tmp.objects[1] = npcs
          this.tmp.objects[0] = items
        }
        else if (npcList.length === 1) {
          this.tmp.objects[1] = [npcList[0]]
          items.shift()
          this.tmp.objects[0] = items
        }
        else {
          this.tmp.objects[1] = [npcList]
          items.shift()
          this.tmp.objects[0] = items
        }
      }
      
      // pre-disambig items in this.tmp.objects[0]
      for (let i = 0; i < this.tmp.objects[0].length; i++) {
        const el = this.tmp.objects[0][i]
        if (el.length === 1) {
          this.tmp.objects[0][i] = el[0]
        }
        else {
          const held = el.filter(el => el.loc === char.name)
          if (held.length === 1) {
            this.tmp.objects[0][i] = held[0]
          }
          else if (held.length > 1) {
            this.tmp.objects[0][i] = held
          }
          // otherwise, stick we hat we have
        }
      }
      this.tmp.objects.unshift([char])
      
      this.tmp.score = 10
      parser.msg("..Base score: " + this.tmp.score)
    },

    script:function(objects) {
      const char = objects[0][0]
      objects.shift()
      return handleGiveToNpc(char, objects)
    },
  })




  new Cmd('LookExit', {
    script:function(objects) {

      const dirName = getDir(objects[0])
      const attName = 'look_' + dirName
      const exit = currentLocation[dirName]
      const tpParams = {char:player, dir:dirName, exit:exit}
      
      if (typeof currentLocation[attName] === "function") {
        const res = currentLocation[attName](tpParams);
        return res ? world.SUCCESS : world.FAILED;
      }
      
      if (!exit || exit.isHidden()) return failedmsg(lang.no_look_that_way, tpParams)
      if (exit.isLocked()) return failedmsg(lang.locked_exit, {char:player, exit:exit})
      
      tpParams.dest = w[exit.name]
      if (currentLocation[attName]) {
        msg(currentLocation[attName], tpParams)
      }
      else if (typeof exit.look === "function") {
        return exit.look(tpParams)
      }
      else if (exit.look) {
        msg(exit.look, tpParams)
      }
      else {
        msg(lang.default_look_exit, tpParams)
        return world.SUCCESS_NO_TURNSCRIPTS
      }
      return world.SUCCESS
    },
    objects:[
      {special:'text'},
    ]
  })


  new Cmd('PushExit', {
    rules:[cmdRules.testManipulate, cmdRules.isHere],
    cmdCategory:"Push",
    script:function(objects) {
      return handlePushExit(player, objects);
    },
    objects:[
      {special:'text'},
      {scope:parser.isHere, attName:"shiftable"},
      {special:'text'},
    ]
  })
  new Cmd('NpcPushExit', {
    rules:[cmdRules.testManipulate, cmdRules.isHere],
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
  })





  new Cmd('TieUp', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory:"Tie",
    objects:[
      {scope:parser.isHeld, attName:"rope"},
    ],
    script:function(objects) {
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope, char:player})
      return rope.handleTieTo(player) 
    },
  })
  new Cmd('TieTo', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory:"Tie",
    objects:[
      {scope:parser.isHeld, attName:"rope"},
      {scope:parser.isHere, attName:"attachable"},
    ],
    script:function(objects) {
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope, char:player})
      return rope.handleTieTo(player, objects[1][0]) 
    },
  })
  new Cmd('NpcTieUp', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory:"Tie",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift();
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope, char:npc})
      return rope.handleTieTo(npc) 
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHeld, attName:"rope"},
    ]
  })
  new Cmd('NpcTieTo', {
    rules:[cmdRules.testManipulate, cmdRules.isHeld],
    cmdCategory:"Tie",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift();
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope, char:npc})
      return rope.handleTieTo(npc, objects[1][0]) 
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHeld, attName:"rope"},
      {scope:parser.isHere, attName:"attachable"},
    ]
  })

  new Cmd('Untie', {
    rules:[cmdRules.testManipulate, cmdRules.isPresent],
    cmdCategory:"Untie",
    objects:[
      {scope:parser.isHere, attName:"rope"},
    ],
    script:function(objects) {
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope, char:player})
      return rope.handleUntieFrom(player) 
    },
  })
  new Cmd('NpcUntie', {
    rules:[cmdRules.testManipulate, cmdRules.isPresent],
    cmdCategory:"Tie",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift();
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope, char:npc})
      return rope.handleUntieFrom(npc) 
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHeld, attName:"rope"},
    ]
  })

  new Cmd('UntieFrom', {
    rules:[cmdRules.testManipulate, cmdRules.isPresent],
    cmdCategory:"Untie",
    objects:[
      {scope:parser.isHere, attName:"rope"},
      {scope:parser.isHere, attName:"attachable"},
    ],
    script:function(objects) {
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope, char:npc})
      return rope.handleUntieFrom(player, objects[1][0]) 
    },
  })
  new Cmd('NpcUntieFrom', {
    rules:[cmdRules.testManipulate, cmdRules.isPresent],
    cmdCategory:"Tie",
    script:function(objects) {
      const npc = objects[0][0];
      if (!npc.npc) return failedmsg(lang.not_npc, {char:player, item:npc})
      objects.shift();
      const rope = objects[0][0]
      if (!rope.rope) return failedmsg(lang.rope_not_attachable, {rope:rope, char:npc})
      return rope.handleUntieFrom(npc, objects[1][0]) 
    },
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHere, attName:"rope"},
      {scope:parser.isHere, attName:"attachable"},
    ]
  })


  new Cmd('UseWith', {
    //npcCmd:true,
    rules:[cmdRules.testManipulate, cmdRules.isPresent],
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
  })
  





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
  })

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
  })
  

  new Cmd('AskAbout', {
    rules:[cmdRules.canTalkTo],
    script:function(arr) {
      if (!player.testTalk()) return false
      if (!arr[0][0].askabout) return failedmsg(lang.cannot_ask_about, {char:player, item:arr[0][0], text:arr[2]})

      return arr[0][0].askabout(arr[2], arr[1]) ? world.SUCCESS : world.FAILED
    },
    objects:[
      {scope:parser.isNpcAndHere},
      {special:'text'},
      {special:'text'},
    ]
  })
  new Cmd('TellAbout', {
    rules:[cmdRules.canTalkTo],
    script:function(arr) {
      if (!player.testTalk()) return false
      if (!arr[0][0].tellabout) return failedmsg(cannot_tell_about, {char:player, item:arr[0][0], text:arr[1]})

      return arr[0][0].tellabout(arr[2], arr[1]) ? world.SUCCESS : world.FAILED
    },
    objects:[
      {scope:parser.isNpcAndHere},
      {special:'text'},
      {special:'text'},
    ]
  })
  new Cmd('TalkAbout', {
    rules:[cmdRules.canTalkTo],
    //score:1, // to override TALK TO
    script:function(arr) {
      if (!player.testTalk()) return false
      if (!arr[0][0].tellabout && !arr[0][0].askabout) return failedmsg(cannot_tell_about, {char:player, item:arr[0][0], text:arr[1]})

      return arr[0][0].talkabout(arr[2], arr[1]) ? world.SUCCESS : world.FAILED
    },
    objects:[
      {scope:parser.isNpcAndHere},
      {special:'text'},
      {special:'text'},
    ]
  })




for (const s of ['In', 'Out', 'Up', 'Down', 'Through']) {
  new Cmd('Go' + s + 'Item', {
    objects:[{scope:parser.isHere, attName:"go" + s + "Direction"}],
    dirType:s,
    script:function(objects) {
      if (typeof objects[0][0]["go" + this.dirType + "Item"] === 'string') {
        return failedmsg(objects[0][0]["go" + this.dirType + "Item"], {char:player, item:objects[0][0]})
      }
      return currentLocation.goItem(objects[0][0], this.dirType) 
    },
  })
  new Cmd('NpcGo' + s + 'Item', {
    objects:[
      {scope:parser.isHere, attName:"npc"},
      {scope:parser.isHere, attName:"go" + s + "Direction"},
    ],
    dirType:s,
    script:function(objects) { 
      if (typeof objects[1][0]["go" + this.dirType + "Item"] === 'string') {
        return failedmsg(objects[1][0]["go" + this.dirType + "Item"], {char:objects[0][0], item:objects[1][0]})
      }
      return currentLocation.goItem(objects[1][0], this.dirType, objects[0][0]) 
    },
  })
}




for (const el of lang.questions) {
  new Cmd('Question' + verbify(el.q), {
    regex:new RegExp('^' + el.q + '\\??$'),
    objects:[],
    script:el.script,
  })
}



// DEBUG commands

if (settings.playMode === 'dev') {
  new Cmd('DebugWalkThrough', {
    objects:[
      {special:'text'},
    ],
    script:function(objects) {
      if (typeof walkthroughs === "undefined") {
        metamsg("No walkthroughs set")
        return world.FAILED
      }
      const wt = walkthroughs[objects[0]]
      if (wt === undefined) return failedmsg("No walkthrough found called " + objects[0])
      settings.walkthroughInProgress = true
      for (let el of wt) {
        if (typeof el === "string") {
          runCmd(el)
        }
        else if (typeof el === "function") {
          el()
        }
        else {
          settings.walkthroughMenuResponses = Array.isArray(el.menu) ? el.menu : [el.menu]
          runCmd(el.cmd)
          settings.walkthroughMenuResponses = []
        }
      }
      settings.walkthroughInProgress = false
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }) 

  new Cmd('DebugInspect', {
    script:function(arr) {
      const item = arr[0][0];
      debugmsg("See the console for details on the object " + item.name + " (press F12 to world. the console)");
      console.log(item);
      return world.SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {scope:parser.isInWorld},
    ],
  })

  new Cmd('DebugInspectByName', {
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
  })

  new Cmd('DebugWarpName', {
    script:function(arr) {
      const o = w[arr[0]]
      if (!o) {
        debugmsg("No object called " + arr[0]);
        return world.FAILED;
      }

      if (o.room) {
        player.loc = o.name
        debugmsg("Moved to " + o.name)
      }
      else {
        o.loc = player.name
        delete o.scenery
        debugmsg("Retrieved " + o.name + " (as long as it uses the \"loc\" attribute normally)")
      }
      return world.SUCCESS
    },
    objects:[
      {special:'text'},
    ],
  })

  new Cmd('DebugTest', {
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
  })

  new Cmd('DebugInspectCommand', {
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
  })

  new Cmd('DebugListCommands', {
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
  })

  new Cmd('DebugListCommands2', {
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
  })

  new Cmd('DebugParserToggle', {
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
  })

  new Cmd('DebugStats', {
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
  })
  
  
  new Cmd('DebugHighlight', {
    script:function(arr) {
      for (const el of document.querySelectorAll('.parser')) {
        el.style.color = 'black'
        el.style.backgroundColor = 'yellow'
      }
      for (const el of document.querySelectorAll('.error')) {
        el.style.backgroundColor = 'yellow'
      }
      for (const el of document.querySelectorAll('.meta')) {
        el.style.color = 'black'
        el.style.backgroundColor = '#8f8'
      }
      debugmsg ("Previous parser and error messages are now highlighted.");
      return world.SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
    ],
  })
  
  
  new Cmd('MetaTranscriptWalkthrough', {
    script:function() {
      saveLoad.transcriptWalk()
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
 
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
  const options = {char:char, source:source, fluid:fluid, item:sink}
  
  if (!source.vessel) return failedmsg(lang.not_vessel, options)
  if (source.closed) return  failedmsg(lang.container_closed, options)
  if (!source.containedFluidName) return failedmsg(lang.already_empty, options)
  if (!sink.vessel && !sink.sink) return failedmsg(lang.not_sink, options)
  if (sink.vessel && sink.containedFluidName) return failedmsg(lang.already_full, options)
  if (!char.testManipulate(source, "fill")) return world.FAILED
  if (!char.getAgreement("Fill", {source:source, sink:sink, fluid:fluid})) return world.FAILED
  if (!source.isAtLoc(char.name)) return failedmsg(lang.not_carrying, options)
  if (source.containedFluidName !== fluid) return failedmsg(lang.no_fluid_here, options);
  return source.doEmpty(options) ? world.SUCCESS: world.FAILED;
}


function handleFillFromSource(char, source, sink, fluid) {
  const options = {char:char, source:source, fluid:fluid, item:sink}
  
  if (!source.isSourceOf) return failedmsg(lang.not_source, options)
  if (source.closed) return  failedmsg(lang.container_closed, options)
  if (!sink.vessel) return failedmsg(lang.not_vessel, options)
  if (sink.containedFluidName) return failedmsg(lang.already_full, options)
  if (!char.testManipulate(sink, "fill")) return world.FAILED
  if (!char.getAgreement("Fill", {source:source, sink:sink, fluid:fluid})) return world.FAILED
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
  if (container.closed) {
    if (container.containerAutoOpen) {
      if (!container.open({char:char, item:container})) return false
    }
    else if (!container.containerIgnoreClosed) {
      return failedmsg(lang.container_closed, options)
    }
  }

  for (const obj of objects[0]) {
    if (!char.testManipulate(obj, verb)) return world.FAILED
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
  if (!char.getAgreement("Drop/in", {item:obj, container:container})) return
  if (!container.testForRecursion(char, obj)) return false
  if (obj.testDrop && !obj.testDrop(options)) return false
  if (!obj.msgDropIn) return falsemsg(lang.cannot_drop, options)
  if (container.testDropIn && !container.testDropIn(options)) return false
  if (!obj.isAtLoc(char.name)) return failedmsg(lang.not_carrying, {char:char, item:obj})
  if (obj.getTakeDropCount) obj.getTakeDropCount(options, char.name)

  if (typeof obj.msgDropIn === 'function') {
    obj.msgDropIn(options)
  }
  else {
    msg(obj.msgDropIn, options)
  }
  obj.moveToFrom(options)
  return true;
}

function handleSingleTakeOutContainer(char, container, obj, options) {
  options.toLoc = char.name
  options.fromLoc = container.name
  if (!char.getAgreement("Take", {item:obj})) return false
  if (!obj.isAtLoc(container.name)) return failedmsg(lang.not_inside, {container:container, item:obj})
  if (obj.getTakeDropCount) obj.getTakeDropCount(options, container.name)
  if (obj.testTake && !obj.testTake(options)) return false
  if (container.testTakeOut && !container.testTakeOut(options)) return false

  msg(obj.msgTakeOut, options)
  obj.moveToFrom(options)
  return true
}



function handleGiveToNpc(char, objects) {
  let success = false;
  const npc = objects[1][0];
  const multiple = objects[0].length > 1 || parser.currentCommand.all;
  if (!npc.npc && npc !== player) return failedmsg(lang.not_npc_for_give, {char:char, item:npc})
  if (!npc.handleGiveTo) log(npc)
    
  for (const obj of objects[0]) {
    const flag = npc.handleGiveTo({char:char, npc:npc, multiple:multiple, item:obj, toLoc:npc.name, fromLoc:char.name})
    success = success || flag
  }
  if (success === world.SUCCESS) char.pause();
  return success ? world.SUCCESS : world.FAILED;
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
    if (!npc.getAgreement("Posture", {posture:"stand"})) {
      // The getAgreement should give the response
      return world.FAILED;
    }
    char = npc
  }  
  
  if (!char.testPosture()) {
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
  if (room[dir].isLocked()) return failedmsg(lang.locked_exit, {char:char, exit:room[dir]})
  if (typeof room[dir].noShiftingMsg === "function") return failedmsg(room[dir].noShiftingMsg(char, item))
  if (typeof room[dir].noShiftingMsg === "string") return failedmsg(room[dir].noShiftingMsg)
  if (!char.getAgreement("Push", {item:obj, dir:dir})) return false
  
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






