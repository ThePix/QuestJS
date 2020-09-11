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
    case 40:
      metamsg("Pick up the hat (GET HAT), and put it on (WEAR HAT).")
      break
    case 50:
      metamsg("Put the hat on (WEAR HAT).")
      break
    case 60:
      metamsg("Type LOOK AT GRASS to progress.")
      break
    case 65:
      metamsg("Do SMELL or SMELL GRASS.")
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
      metamsg("CROWBAR THE SHED DOOR and then GO EAST.")
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
      metamsg("Go back SOUTH.")
      break
    case 315:
      metamsg("Tell the robot to go north (ROBOT,N), then go NORTH yourself and tell the robot to get the rod (ROBOT,GET ROD).")
      break
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
    case 390:
      metamsg("Try to USE THE COMPUTER.")
      break
    case 400:
      metamsg("TALK TO PROF.")
      break
    case 410:
      metamsg("Wait until the professor goes, then try to USE COMPUTER again.")
      break
    case 420:
      metamsg("Look for the code for the computer. Try LOOK BEHIND PAINTING, then read what you find. Once you have the number, try to USE THE COMPUTER again.")
      break
    case 430:
      metamsg("You need to escape, and the only way out is through the window. What happens if you SMASH THE WINDOW?")
      break
    case 440:
      metamsg("You need to escape, and the only way out is through the window, but you need to wrap your hand in something first. How about that old newspaper (WRAP FIST IN NEWSPAPER)?")
      break
    case 450:
      metamsg("You need to escape, and the only way out is through the window. What happens if you SMASH THE WINDOW now your fist is wrapped in newspaper?")
      break
    case 460:
      metamsg("You need to escape, and the only way out is through the broken window. What happens if you try OUT?")
      break
    case 470:
      metamsg("You need to escape, and the only way out is through the broken window, but it is a long way down and you will need to use the rope. To do that, TIE ROPE TO DESK, then THROW ROPE OUT WINDOW.")
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
    "smell", "hint",
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
    "use computer", "hint",
    "talk to prof", "hint",
    "use computer",
    "z",
    "use computer",
    "000000", "hint",//*
    "look behind painting", "hint",
    "x post-it", "hint",
    "use computer",
    w.computer.code, "hint",
    "smash window", "hint",
    "wrap fist in newspaper",
    "wrap newspaper round hand",
    "hint",
    "open window", "hint",
    "use apple to smash window",
    "smash window with newspaper",
    "smash computer with crowbar",
    "smash window with crowbar",
    "smash window", "hint",
    "out", "hint",
    "x rope",
    "throw rope out window", "hint",
    "tie rope to computer", "hint",
    "tie rope to desk", "hint",
    "x rope",
    "throw rope out window", "hint",
    "out",
   /*  */
  ]
}



  tp.addDirective("rope", function(arr, params) {
    return '<span style="font-family:Montserrat">' + arr.join(":") + "</span>"; 
  });



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


const wrapScript = function(obj1, obj2) {
  if (obj2 !== w.old_newspaper) return failedmsg("You cannot wrap that round anything.")
  if (obj1 !== w.fist) return failedmsg("You don't think that will achieve anything.")
  if (obj2.fist_wrapped) return failedmsg("It already is.")
  obj2.fist_wrapped = true
  msg("You carefully wrap the old newspaper around your fist.")
  if (w.me.hints < 450) w.me.hints = 450
  return world.SUCCESS
}

const unwrapScript = function(obj1, obj2) {
  if (obj2 !== w.old_newspaper) return failedmsg("They are not wrapped together.")
  if (obj1 !== w.fist) return failedmsg("They are not wrapped together.")
  if (!obj2.fist_wrapped) return failedmsg("They are not wrapped together.")
  obj2.fist_wrapped = false
  msg("You carefully unwrap the old newspaper from around your fist.")
  if (w.me.hints = 450) w.me.hints = 440
  return world.SUCCESS
}


commands.unshift(new Cmd('Wrap1', {
  // wrap fist in newspaper
  regex:/^(?:wrap|cover) (.+) (?:with|in) (.+)$/,
  objects:[
    {scope:parser.isHeld},
    {scope:parser.isHeld},
  ],
  script:function(objects) { wrapScript(objects[0][0], objects[1][0]) },
}));

commands.unshift(new Cmd('Wrap2', {
  // wrap newspaper round fist
  regex:/^(?:wrap) (.+) (?:round|around) (.+)$/,
  objects:[
    {scope:parser.isHeld},
    {scope:parser.isHeld},
  ],
  script:function(objects) { wrapScript(objects[1][0], objects[0][0]) },
}));

commands.unshift(new Cmd('Unwrap1', {
  // unwrap fist
  regex:/^(?:unwrap|uncover) (.+)$/,
  objects:[
    {scope:parser.isHeld},
    {scope:parser.isHeld},
  ],
  script:function(objects) { unwrapScript(objects[0][0], w.old_newspaper) },
}));

commands.unshift(new Cmd('Unwrap2', {
  // take newspaper off fist
  regex:/^(?:take|remove) (.+) (?:off|from) (.+)$/,
  objects:[
    {scope:parser.isHeld},
    {scope:parser.isHeld},
  ],
  script:function(objects) { unwrapScript(objects[1][0], objects[0][0]) },
}));



commands.unshift(new Cmd('ThrowThrough', {
  // throw rope out window
  regex:/^(?:throw|chuck|hurl|toss|pitch|lob|heave) (.+) (?:out of|out|through) (.+)$/,
  objects:[
    {scope:parser.isHeld},
    {scope:parser.isHere, attName:'throwThrough'},
  ],
  script:function(objects) { 
    const item = objects[0][0]
    const dest = objects[1][0]
    if (!dest.isThrowThroughable) return failedmsg("You can't chuck stuff through {nm:dest:the}.", {dest:dest})
    if (!dest.isThrowThroughable(item)) return world.FAILED
    if (!item.isAtLoc("me")) return failedmsg("You are not holding {nm:item:the}.", {item:item})
    dest.throwThrough(item)
    return world.SUCCESS
  },
}));


const smashWithScript = function(item, dest) {
  if (dest !== w.office_window) return failedmsg("That's not something you can smash.")
  if (!item.isAtLoc("me")) return failedmsg("You are not holding {nm:item:the}.", {item:item})
  if (w.office_window.smashed) return falsemsg("The window is already smashed.")

  if (item === w.crowbar) {
    msg("You strke the window with the crowbar, breaking the glass. You take a moment to knock away the remaining jagged shards in the frame.")
    w.office_window.smashed = true
    if (w.me.hints < 460) w.me.hints = 460
    return world.SUCCESS
  }
  else {
    msg("You can't smash the window using {nm:item:the}.", {item:item})
    return world.FAILED
  }
}


commands.unshift(new Cmd('SmashWith', {
  // throw rope out window
  regex:/^(?:smash|break|destroy) (.+) (?:with|using) (.+)$/,
  objects:[
    {scope:parser.isHere, attName:'throwThrough'},
    {scope:parser.isHeld},
  ],
  script:function(objects) { 
    return smashWithScript(objects[1][0], objects[0][0])
  },
}));


commands.unshift(new Cmd('UseToSmash', {
  // throw rope out window
  regex:/^(?:use|using) (.+?) (?:to |)(?:smash|break|destroy) (.+)$/,
  objects:[
    {scope:parser.isHeld},
    {scope:parser.isHere, attName:'throwThrough'},
  ],
  script:function(objects) { 
    return smashWithScript(objects[0][0], objects[1][0])
  },
}));



commands.unshift(new Cmd('Attack', {
  // throw rope out window
  regex:/^(?:attack|kick|punch|hit|strike|kill) (.+?)$/,
  objects:[
    {scope:parser.isHere},
  ],
  script:function(objects) {
    if (objects[0][0].npc) {
      msg("You just need to get the data, not beat anyone up!")
      if (!w.me.killFlag) {
        tmsg('You will find most games will not let you attack the characters, and those that do will probably have combat as a large part of the game. That said, it is a good idea to try these things, you never know quite what will happen.')
        w.me.killFlag = true
      }
    }
    else {
      msg("That's not going to achieve anything.")
    }
    return world.FAILED
  },
}));




// use cx to smash y
// robot smash x


/*
commands.unshift(new Cmd('ThrowAt', {
  // throw computer at window
  regex:/^(?:wrap|cover) (.+) (?:with|in) (.+)$/,
  objects:[
    {scope:parser.isHeld},
    {scope:parser.isHeld},
  ],
  script:function(objects) { wrapScript(objects[0][0], objects[1][0]) },
}));
*/
