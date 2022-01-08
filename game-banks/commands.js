"use strict"



/*
commands.push(new Cmd('Kick', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  regex:/^(kick) (.+)$/,
  objects:[
    {special:'ignore'},
    {scope:parser.isPresent}
  ],
  default:function(item, char, options) {
    msg("{pv:char:kick:true} {ob:item:the}, but nothing happens.", options);
    return false;
  },
}));

commands.push(new Cmd('Move', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  regex:/^(move) (.+)$/,
  objects:[
    {special:'ignore'},
    {scope:parser.isHere}
  ],
  default:function(item, char, options) {
    msg("{pv:char:be:true} not something you can move.", options);
    return false;
  },
}));
*/


// kyle, in stasis

commands.push(new Cmd('Get in pod1', {
  regex:/^(.+), ?(?:get in|go in|in) (?:stasis pod|stasis|pod)$/,
  npcCmd:true,
  attName:"stasis",
  objects:[
    {scope:parser.isHere, attName:"npc"},
  ],
  defmsg:"That's not about to get in a stasis!",
}));
commands.push(new Cmd('Get in pod2', {
  regex:/^(?:tell|ask|instruct) (.+) to (?:get in|go in|in) (?:stasis pod|stasis|pod)$/,
  npcCmd:true,
  attName:"stasis",
  objects:[
    {scope:parser.isHere, attName:"npc"},
  ],
  defmsg:"That's not about to get in a stasis!",
}));

commands.push(new Cmd('Stop1', {
  regex:/^(.+), (?:stop|halt|forget it)$/,
  npcCmd:true,
  attName:"stopAgenda",
  objects:[
    {scope:parser.isHere, attName:"npc"},
  ],
  defmsg:"That's not doing anything!",
}));
commands.push(new Cmd('Stop2', {
  regex:/^(?:tell|ask|instruct) (.+) to (?:stop|halt|forget it)$/,
  npcCmd:true,
  attName:"stopAgenda",
  objects:[
    {scope:parser.isHere, attName:"npc"},
  ],
  defmsg:"That's not doing anything",
}));


commands.push(new Cmd('Launch', {
  regex:/^(?:launch|deploy) (.+)$/,
  npcCmd:true,
  objects:[
    {scope:parser.isInWorld},
  ],
  defmsg:"You can't launch that!",
}));

commands.push(new Cmd('Revive', {
  regex:/^(?:revive|wake|awaken) (.+)$/,
  npcCmd:true,
  objects:[
    {scope:parser.isInWorld},
  ],
  defmsg:"You can't revive that!",
}));



commands.push(new Cmd('Spray', {
  regex:/^(?:spray) (.+)$/,
  rules:[
    function(cmd, char, item, multiple) {
      if (w.spray_sealant.loc !== char.name) {
        return falsemsg("{nv:char:do:true} not have the sealant spray.", {char:char})
      }
      if (w.spray.uses <= 0) {
        return falsemsg("{nv:char:aim:true} the spray can at {nm:item}, but it is empty.", {char:char, item:item})
      }
      w.spray.uses--
      return true
    }
  ],
  //npcCmd:true, // ???
  objects:[
    {scope:parser.isHere},
  ],
  defmsg:"You can't spray that!",
}));

commands.push(new Cmd('Pressurise', {
  regex:/^(?:pressuri[sz]e|pres) (.+)$/,
  attName:'pressure',
  objects:[
    {scope:isRoomScope, extendedScope:true},
  ],
  script:function(objects) { return handlePressurise(player, objects, true) },
  defmsg:'Not something you can pressurise.',
}));
commands.push(new Cmd('Depressurise', {
  regex:/^(?:depressuri[sz]e|evacuate|depres) (.+)$/,
  attName:'pressure',
  objects:[
    {scope:isRoomScope, extendedScope:true},
  ],
  script:function(objects) { return handlePressurise(player, objects, false) },
  defmsg:'Not something you can evacuate.',
}));
commands.push(new Cmd('NpcPressurise1', {
  regex:/^(.+), ?(?:pressuri[sz]e|pres) (.+)$/,
  attName:'pressure',
  objects:[
    {scope:parser.isHere, attName:"npc"},
    {scope:isRoomScope, extendedScope:true},
  ],
  script:function(objects) {
    var npc = objects[0][0];
    npc.actedThisTurn = true;
    if (!npc.npc) {
      msg(CMD_not_npc(npc));
      return world.FAILED; 
    }
    objects.shift();
    return handlePressurise(npc, objects, true);
  },
}));
commands.push(new Cmd('NpcPressurise2', {
  regex:/^(?:tell|ask|instruct) (.+) to (?:pressuri[sz]e|pres) (.+)$/,
  attName:'pressure',
  objects:[
    {scope:parser.isHere, attName:"npc"},
    {scope:isRoomScope, extendedScope:true},
  ],
  script:function(objects) {
    var npc = objects[0][0];
    npc.actedThisTurn = true;
    if (!npc.npc) {
      msg(CMD_not_npc(npc));
      return world.FAILED; 
    }
    objects.shift();
    return handlePressurise(npc, objects, true);
  },
}));
commands.push(new Cmd('NpcDepressurise1', {
  regex:/^(.+), ?(?:depressuri[sz]e|evacuate|depres|evac) (.+)$/,
  attName:'pressure',
  objects:[
    {scope:parser.isHere, attName:"npc"},
    {scope:isRoomScope, extendedScope:true},
  ],
  script:function(objects) {
    var npc = objects[0][0]
    npc.actedThisTurn = true
    if (!npc.npc) {
      msg(CMD_not_npc(npc))
      return world.FAILED
    }
    objects.shift()
    return handlePressurise(npc, objects, false)
  },
}))
commands.push(new Cmd('NpcDepressurise2', {
  regex:/^(?:tell|ask|instruct) (.+) to (?:depressuri[sz]e|evacuate|depres) (.+)$/,
  attName:'pressure',
  objects:[
    {scope:parser.isHere, attName:"npc"},
    {scope:isRoomScope, extendedScope:true},
  ],
  script:function(objects) {
    var npc = objects[0][0]
    npc.actedThisTurn = true
    if (!npc.npc) {
      msg(CMD_not_npc(npc))
      return world.FAILED
    }
    objects.shift()
    return handlePressurise(npc, objects, false)
  },
}))


function handlePressurise(char, objects, pressurise) {
  const baseRoom = objects[0][0]
  if (!baseRoom.room) {
    msg("You can't " + (pressurise ? pressurise : depressurise) + " that.")
    return world.FAILED
  }
  if (char === player) {
    metamsg("You need to ask Xsansi to pressurise or depressurise any part of the ship.")
    return world.FAILED
  }
  
  // I am counting these as successes as the player has successfully made the request, even if it was refused
  if (char.name !== "Xsansi") {
    msg("'{nm:char}, {if:pressurise:pressurise:depressurise} {nm:baseRoom:the},' you say.", {char:char, pressurise:pressurise, baseRoom:baseRoom})
    msg("'You need to ask Xsansi to pressurise or depressurise any part of the ship.'")
    return world.SUCCESS
  }
  msg("'Xsansi, {if:pressurise:pressurise:depressurise} {nm:baseRoom:the},' you say.", {pressurise:pressurise, baseRoom:baseRoom})
  if (baseRoom.isSpace) {
    if (pressurise) {
      msg("'Scientists estimates the volume of space to be infinite. The ship does not have sufficient air to pressure space.'")
    }
    else {
      msg("'Space is already depressurised.'")
    }
    return world.SUCCESS
  }
  const mainRoom = (typeof baseRoom.vacuum === "string" ? w[baseRoom.vacuum] : baseRoom)
  if (mainRoom.vacuum !== pressurise) {
    msg("'" + sentenceCase(lang.getName(mainRoom, {article:DEFINITE})) + " is already " + (pressurise ? 'pressurised' : 'depressurised') + ".")
    return world.SUCCESS
  }
  if (!w.Xsansi.pressureOverride && mainRoom.name !== "airlock" && !pressurise) {
    msg("'Safety interlocks prevent depressurising parts of the ship while the crew are active.'")
    return world.SUCCESS
  }
  // !!! Note that this assumes crew members never go in the airlock
  if (mainRoom.name === "airlock" && !pressurise && player.loc === "airlock" && !w.your_spacesuit.worn) {
    msg("'Safety interlocks prevent depressurising the airlock whilst personnel are inside it without spacesuits.'")
    return world.SUCCESS
  }
  if (!pressurise) {
    msg("'Evacuating " + lang.getName(mainRoom, {article:DEFINITE}) + "... Room is now under vacuum.'")
    mainRoom.vacuum = true;
    return world.SUCCESS
  }
  if (mainRoom.leaks) {
    msg("'Pressurising " + lang.getName(mainRoom, {article:DEFINITE}) + "... Pressurisation failed.'")
    return world.SUCCESS
  }

  msg("'Pressurising " + lang.getName(mainRoom, {article:DEFINITE}) + "... Room is now pressurised.'")
  mainRoom.vacuum = false;
  return world.SUCCESS
}



commands.push(new Cmd('Approach', {
  regex:/^approach (.+)$/,
  objects:[
    {scope:'isShip'},
  ],
  script:function(objects) {
    if (!objects[0][0].isShip) {
      metamsg("The APPROACH command is for piloting the ship to a specific destination; a satellite or vessel for example.")
      return world.FAILED
    }
    if (player.loc !== "flightdeck") {
      msg("You need to be on the flight-deck to pilot the ship.")
      return world.FAILED
    }
    if (w.alienShip.status === 0) {
      msg("There is no ship detected.")
      return world.FAILED
    }
    if (w.alienShip.status > 1) {
      msg("The {i:Joseph Banks} is already adjacent to the unidentified vessel.'")
      return world.FAILED
    }
    msg("You sit at the controls, and unlock the console. You type the co-ordinates into the system, and feel a noticeable pull as the ship accelerates to the target. At the half way point, the ship swings around, so the rockets are firing towards the target, slowing the ship down, so it comes to a stop, relative to the other ship.");
    w.alienShip.status = 2;
    return world.SUCCESS
  },
}));

commands.push(new Cmd('Scan', {
  regex:/^scan (.+)$/,
  objects:[
    {scope:'isShip'},
  ],
  script:function(objects) {
    if (!objects[0][0].isShip) {
      metamsg("The SCAN command is for scanning a target nearby in space, having approached it; a satellite or vessel for example.")
      return world.FAILED
    }
    if (player.loc !== "flightdeck") {
      msg("You need to be on the flight-deck to scan the ship.")
      return world.FAILED
    }
    if (w.alienShip.status === 0) {
      msg("There is no ship detected.")
      return world.FAILED
    }
    if (w.alienShip.status === 1) {
      msg("The source of the radio signal is too far away to be properly scanned.")
      return world.FAILED
    }
    msg("Sat at the controls, you initiate a scan of the unknown ship...")
    msg("While you await the results, you look at the image on the screen. It is not big, less than half the length of the Joseph Banks, and a dull grey colour. It is all curves, without a straight edge anywhere, but it nevertheless looks lumpy rather than sleek. There is no obvious propulsion system, but you can see what might be an opening. There are no marking as far as you can see, and  no obvious weapons.")
    msg("The results of the scan appear on the screen. Unsurprisingly, the ship is not in the database. An XDR scan of the hull indicates it is made of an unknown intermetallic alloy of aluminium, nickel and arsenic.")
    msg("A look at the infrared camera shows the ship is radiating low level thermal energy, especially from the aft area (relative to the Joseph Banks). The radio signal is emanating from a point lower port forward section.")
    msg("There are no other electromagnetic emissions detected, and no significant magnetic, electrical or gravity fields detected.")
    w.alienShip.status = 2
    return world.SUCCESS
  },
}))

function isShip(item) {
  return item.isShip
}




commands.push(new Cmd('ProbeStatus', {
  regex:/^probes?$/,
  script:function() {
    const arr = getProbes();
    metamsg("Found " + arr.length + " probes");
    for (let probe of arr) {
      metamsg("------------------");
      metamsg("Probe:" + probe.alias);
      metamsg("Status:" + probe.status);
      metamsg("launchCounter:" + probe.launchCounter);
      metamsg("probeType:" + probe.probeType);
      metamsg("planetNumber:" + probe.planetNumber);
    }
    metamsg("------------------");
    metamsg("Geology:" + currentPlanet().geology);
    metamsg("Biology:" + currentPlanet().biology);
    metamsg("Radio:" + currentPlanet().coms);
    metamsg("Satellite:" + currentPlanet().satellite);
    metamsg("Active:" + currentPlanet().eventIsActive());
    return world.SUCCESS_NO_TURNSCRIPTS;
  },
}));





commands.unshift(new Cmd('MapUpdate', {
  regex:/^map?$/,
  script:function() {
    updateMap()
    metamsg("Done")
    return world.SUCCESS_NO_TURNSCRIPTS
  },
}));






findCmd('MetaHelp').script = function() {
  metamsg("Help is available on a number of topics...")
  metamsg("Do {color:red:HELP GENERAL} or {color:red:? GEN} for general instructions on playing parser games")
  metamsg("{b:Commands to help you play this game:}")
  metamsg("Do {color:red:HELP GAME} for suggestions on what to actually do. You could also try {color:red:HELP NPC} for how to interacting with other characters, {color:red:HELP PROBE} to learn about deploying probes, and {color:red:HELP STASIS} for more on stasis pods (and hence travel to the next planet). You might want to try {color:red:HELP VACUUM} to discover how to handle the cold vacuum of space of {color:red:HELP SEALANT} for how to use the spray sealant.")
  if (w.alienShip.status > 0) metamsg("You could also do {color:red:HELP DOCKING}.")
  metamsg("{b:Meta-information about the game:}")
  metamsg("Do {color:red:HELP UNIVERSE} for some notes about the universe the game is set in, {color:red:HELP SYSTEM} to read about the game system, and {color:red:HELP CREDITS} for credits.")
  metamsg("NOTE: You can use {color:red:?} as a shorthand for {color:red:HELP}")
  return world.SUCCESS_NO_TURNSCRIPTS
}

commands.push(new Cmd('HelpSubject', {
  regex:/^(?:\?|help) (.*)$/,
  objects:[
    {special:'text'},
  ],
  script:function(objects) {
    for (let el of this.topics) {
      if (objects[0].match(el.regex)) {
        el.script()
        return world.SUCCESS_NO_TURNSCRIPTS
      }
    }
    metamsg("Sorry, no help topic found that matches \"" + objects[0] + "\"")
    return world.FAILED
  },
  topics:[
    {
      regex:/^gen.*$/,
      script:function() { lang.helpScript(); },
    },
    {
      regex:/^(credits?|about)$/,
      script:function() { lang.aboutScript(); },
    },
    {
      regex:/^game$/,
      script:function() {
        metamsg("At each planet, you need to assess how many bio-probes and how many geo-probes to launch. Do {color:red:HELP PROBES} for details on that. You can {color:red:ASK AI ABOUT SHIP} to find how many of each probe is left.")
        metamsg("You have five planets to visit, before returning to Earth. Return to the stasis pod to go back into stasis. Xsansi will then navigate the ship to the next destination.");
        metamsg("As the captain, the welfare of the crew is important, so {color:red:ASK KYLE ABOUT HIS HEALTH}, etc.")
        metamsg("You can talk to Xsansi anywhere on the ship (and can just call her \"ai\"). Do {color:red:ASK AI ABOUT CREW} to find out where the crew are. Do {color:red:ASK AI ABOUT KYLE}, for example, for more specific information; the last crew mate yoiu asked about will appear in blue on the map, helping you find him or her (until you meet, where the room will turn green for one turn).")
      },
    },
    {
      regex:/^npcs?$/,
      script:function() {
        metamsg("{b:Interacting with NPCs:}")
        metamsg("You can ask an NPC to do something by using the same command you would use to have yourself do something, but prefixed with {color:red:[name],} (note the comma) or {color:red:TELL [name] TO}.")
        metamsg(settings.noTalkTo)
        metamsg("Use the {color:red:TOPICS} command for some suggested topics. There are rather more for ASK than TELL, as you might expect.")
      },
    },
    {
      regex:/^probes?$/,
      script:function() {
      metamsg("{b:Using probes:}");
        metamsg("Kyle will automatically deploy a satellite on arrival at a new planet, but you need to tell your crew to deploy probes for the surface. Wait for Xsansi to announce that the satellite is in orbit, then {color:red:ASK XSANSI ABOUT PLANET}. You can then assess what probes you want to deploy.")
        metamsg("For a bio-probe, talk to Ostap, for a geo-probe, talk to Aada. They will then walk to the probe hanger, and launch the probe. You can tell them to launch several at once (eg {color:red:OSTAP, LAUNCH 3 PROBES}), but remember, you only have sixteen of each for all five planets.")
        metamsg("Once a probe has been launched, it is on its own; you cannot control it.")
        metamsg("After a probe has landed, it will send data back to the ship, for your crew to analyse. If the data has value, your bonus will automatically increase. The first probe on a planet might get you two or three bonuses, but the third may not get you any and by the tenth, it is not going to find anything new. Ask the crew about the planet once the probes have explored it. You may decide you want to launch more.")
        metamsg("After thirty turns a probe will have got everything it can - and usually much sooner. Why not get to know your crew while you wait?")
        metamsg("Note that probe success is predetermined; if a probe is lost, it will be lost every time you reload your game.")
      },
    },
    {
      regex:/^stasis$/,
      script:function() {
        metamsg("{b:Stasis:}")
        metamsg("Once you are in stasis, years will pass whilst the ship navigates to the next star system, so this is how to move the story forward to the next planet to survey.")
        metamsg("To go into stasis, climb into your pod, and close the lid.")
        metamsg("You can tell a crew member to go to stasis at any time (eg {color:red:AADA, GET IN STASIS POD} or just {color:red:HA, IN POD}). Once in stasis they cannot be revived until the ship arrives at the next destination, so make sure they have done everything they need to first. Crew members will automatically go into stasis anyway once you do.")
      },
    },
    {
      regex:/^(vacuum|d?e?pressur|evacuat)/,
      script:function() {
        metamsg("{b:Vacuum:}")
        metamsg("Each section of the ship can be pressurised or depressurised by Xsansi, just ask {color:red:XSANSI, PRESSURIZE THE CARGO BAY} or {color:red:AI, DEPRESSURISE ENGINEERING}. You can use {color:red:PRES} and {color:red:DEPRES} as shortcuts too. Note that safety overrides may prevent Xsansi from complying. You will be unable to depressurise any room other than the airlock whilst the crew are out of stasis, and you will be unable to depressurise the airlock whilst you are in it unless you have a spacesuit on.")
        metamsg("You will not be able to move from one area to another if one is pressurised and the other is not.")
        metamsg("To find out what areas are pressurised, {color:red: ASK XSANSI ABOUT WHERE IS PRESSURISED} or {color:red:ASK AI ABOUT VACUUM}.")
      },
    },
    {
      regex:/^seal/,
      script:function() {
        metamsg("{b:Sealant Spray:}")
        metamsg("The sealant spray can be used to temporarily fix leaks in the hull, just go to a room with a leak, and {color:red:SPRAY LEAK}. Once the leak is sealed, the room can be re-pressurised, and the engineer can put in a more permanent solution.")
        metamsg("The can has five charges. If you waste them spraying other things... you could be in trouble.")
      },
    },
    {
      regex:/^dock/,
      script:function() {
        metamsg("{b:Docking:}")
        metamsg("From the flight-deck, you can get closer to another ship, either to get a better look or to dock with it; {color:red:XSANSI, APPROACH SHUTTLE} or {color:red:AI, APPROACH SHIP}. Obviously there must be an vessel around.")
        metamsg("Once adjacent, you can scan it or dock with it; {color:red:XSANSI, DOCK WITH SHUTTLE} or {color:red:AI, SCAN SHIP}.")
      },
    },
    {
      regex:/^universe$/,
      script:function() {
        metamsg("{b:The game world:}")
        metamsg("I originally {i:tried} to go hard science fiction; these are real stars the ship visits! However, I have assumed artificial gravity, which is required to orientate the game (once you have down, you have port, up and starboard).")
        metamsg("I am also assuming people can be held in stasis, and presumably this is like freezing time (cf Niven's stasis field, in his \"Known Space\" series). I need that to preserve the food so the crew have something to eat 80 years after leaving Earth.")
        metamsg("Also, probes are {i:fast}! It just takes a few turns to travel from orbit to the planet surface, which has to be at least 100 miles, and likely considerably more. They work fast on the planet too. It is a game; we need stuff to happened quickly to keep players interested. So maybe not so hard science fiction after all.")
      },
    },
    {
      regex:/^system$/,
      script:function() {
        metamsg("{b:The Game System:}")
        metamsg("This game was written for Quest 6, which means it is running entirely in JavaScript in your browser. Compared to Quest 5 (which I am also familiar with) this means that you do not need to download any software to run it, and there is no annoying lag while you wait for a server to respond. Compared to Inform... well, it allows authors to directly access a modern programming language (though the point of Inform 7, of course, is to keep the programming language at bay).");
        metamsg("Quest 6 is a complete system, implementing all the standards of a parser game, including the usual compass directions by default! Containers, surfaces, countables, wearables, openables, furniture, components and switchable are all built in, as well as NPCs, who hopefully are acting with some semblance of realism.")
        metamsg("For more information, including a tutorial on how to create your own game, see {link:here:https://github.com/ThePix/QuestJS/wiki}. As yet there is no editor, but I hope there will be one day.");
      },
    },
  ]
}));
