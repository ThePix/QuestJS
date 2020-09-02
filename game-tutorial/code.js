"use strict";

function tmsg(s, params) {
  _msg(s, params || {}, {cssClass:"tutorial", tag:'p'});
}


findCmd('MetaHint').script = function() {
  switch (w.me.hints) {
    case 10:
      metamsg("Just type WAIT to get to the next stage.")
      break
    case 20:
      metamsg("Type NORTH to go into the kitchen.")
      break
    case 30:
      metamsg("Type NORTHEAST to go into the garden.")
      break
    case 35:
      metamsg("Do SMELL or SMELL ROSES.")
      break
    case 40:
      metamsg("Pick up the hat (GET HAT), and put it on (WEAR HAT).")
      break
    case 50:
      metamsg("Put the hat on (WEAR HAT).")
      break
    case 60:
      metamsg("Type LOOK AT GRASS to progress.")
      break
    case 70:
      metamsg("Look at the box (X BOX).")
      break
    case 80:
      metamsg("Read the writing on the box (READ BOX)")
      break
    case 90:
      metamsg("OPEN THE BOX and then GET THE CROWBAR.")
      break
    case 100:
      metamsg("REMOVE THE HAT and then PUT IT IN THE BOX, then CLOSE BOX.")
      break
    case 110:
      metamsg("CROWBAR THE SHED DOOR.")
      break
    case 120:
      metamsg("GET TORCH.")
      break
    case 130:
      metamsg("TURN ON TORCH, then head to the basement (out, southwest, then down). If you are in the basement and it is dark, you will need to go back up, and then turn the torch on before coming back down.")
      break
    case 140:
      metamsg("SWITCH ON THE LIGHT, and then TURN OFF THE TORCH (in that order!).")
      break
    case 150:
      metamsg("Try GET ALL to pick up everything.")
      break
    case 160:
      metamsg("You cannot take the crates, but you might be able to MOVE CRATES.")
      break
    case 170:
      metamsg("Head WEST.")
      break
    case 180:
      metamsg("Type SAVE.")
      break
    case 190:
      metamsg("Type SAVE TUTORIAL (or some other name).")
      break
    case 200:
      metamsg("Head WEST.")
      break
    case 210:
      metamsg("ASK THE ROBOT ABOUT THE LABORATORY.")
      break
    case 220:
      metamsg("ASK ROBOT ABOUT ZETA-PARTICLES.")
      break
    case 230:
      metamsg("Go WEST to the lift.")
      break
    case 240:
      metamsg("Try PRESS 3 to operate the lift.")
      break
    case 250:
      metamsg("Go back to the laboratory, and ASK ROBOT ABOUT LIFT.")
      break
    case 260:
      metamsg("ASK THE ROBOT ABOUT THE ZETA_REACTOR.")
      break
    case 270:
      metamsg("Ask the robot to open the door with ROBOT,OPEN DOOR, then head through it, N.")
      break
    case 280:
      metamsg("Head NORTH.")
      break
    case 300:
      metamsg("GET ROD.")
      break
    case 310:
      metamsg("Go back SOUTH, tell the robot to go north (ROBOT,N), then go NORTH yourself and tell the robot to get the rod (ROBOT,GET ROD).")
    case 320:
      metamsg("Tell the robot to get the rod (ROBOT,GET ROD).")
      break
    case 330:
      metamsg("Tell the robot to put the rod i the reactor (ROBOT,PUT ROD IN REACT).")
      break
    case 340:
      metamsg("Tell the robot to get the rod (ROBOT,GET ROD).")
      break
    case 350:
      metamsg("Tell the robot to put the rod in the reactor (ROBOT,PUT ROD IN REACTOR).")
      break
    case 370:
      if (w.me.loc === 'reactor_room') {
        metamsg("Head SOUTH, then WEST, then once in the lift, PRESS 3.")
      }
      else if (w.me.loc === 'laboratory' || w.me.loc === 'lounge') {
        metamsg("Head WEST, then once in the lift, PRESS 3.")
      }
      else if (w.me.loc === 'lift') {
        metamsg("PRESS 3.")
      }
      else {
        metamsg("Head to either the lounge or the laboratory, then go WEST, then once in the lift, PRESS 3.")
      }
      break
    case 380:
      metamsg("GO EAST.")
      break
    case 400:
      metamsg("TALK TO PROF.")
      break
    case 500:
      metamsg("No hints, you have finished the game!")
      break
    default:
      errormsg("No hint for: " + w.me.hints)
  }
  return world.SUCCESS_NO_TURNSCRIPTS;
}



// eat, purchase/sell, switch on/off, unlock, look behind/under/etc, push/pull

const walkthroughs = {
  a:[
    "z", "hint",
    "z", "hint",
    "z", "hint",
    "n", "hint",
    "ne", "hint",
    "get hat", "hint",
    "wear hat", "hint",
    "x grass", "hint",
    "x box", "hint",
    "read label", "hint",
    "open box", "hint",
    "get crowbar", "hint",
    "remove hat", "hint",
    "put it in box", "hint",
    "close lid", "hint",
    "crowbar shed", "hint",
    "east", "hint",
    "get torch", "hint",
    "out", "hint",
    "sw", "hint",
    "turn on torch", "hint",
    "down", "hint",
    "turn on light", "hint",
    "turn off torch", "hint",
    "get all", "hint",
    "move crates", "hint",
    "w", "hint",
    "save", "hint",
    "save Tutorial", "hint",
    "w", "hint",
    "ask robot about the laboratory", "hint",
    "topics for robot",
    "ask robot about zeta-particles", "hint",
    "w", "hint",
    "press 3", "hint",
    "e", "hint",
    "ask robot about lift", "hint",
    "ask robot about reactor", "hint",
    "ask robot to open door", "hint",
    "n", "hint",
    "get rod", "hint",
    "s", "hint",
    "robot,n", "hint",
    "n", "hint",
    "r,get r", "hint",
    "r,put r in r", "hint",
    "s", "hint",
    "w", "hint",
    "press 3", "hint",
    "e", "hint",
    "sit on chair", "hint",
    "look out window", "hint",
    "talk to prof",
   /*  */
  ]
}


findCmd('MetaSave').script = function() {
  script:lang.saveLoadScript()
  if (w.me.hints = 180) {
    tmsg("So in Quest 6 SAVE just tells you how to save your game. You need to add a file name to actually save. Do that now! You can call it whatever you want; how about \"tutorial\"?")
    w.me.hints = 190
  }
  return world.SUCCESS_NO_TURNSCRIPTS;
}



commands.push(new Cmd('Crowbar', {
  regex:/^(crowbar|level) (.+)$/,
  objects:[
    {ignore:true},
    {scope:parser.isHere},
  ],
  default:function(item) {
    msg("That's not something you can crowbar open.")
    return world.FAILED
  },
}));


commands.unshift(new Cmd('Move', {
  npcCmd:true,
  rules:[cmdRules.isHere],
  regex:/^(move) (.+)$/,
  objects:[
    {ignore:true},
    {scope:parser.isHere}
  ],
  default:function(item, isMultiple, char) {
    return failedmsg(prefix(item, isMultiple) + lang.pronounVerb(item, "'be", true) + " not something you can move.");
  },
}));



commands.push(new Cmd('Tutorial', {
  regex:/^tutorial$/,
  objects:[
  ],
  script:function() {
    $('body').toggleClass("hidden")
    msg(lang.done_msg)
    return world.SUCCESS_NO_TURNSCRIPTS
  },
}));


