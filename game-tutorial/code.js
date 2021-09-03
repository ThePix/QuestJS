"use strict";

function tmsg(s, params) {
  _msg(s, params || {}, {cssClass:"tutorial", tag:'p'});
}

const hint = {}

hint.data = [
  { name:'waitAtStart', hint:'Just type WAIT to get to the next stage.'},
  { name:'northToKitchen', hint:'Type NORTH to go into the kitchen.'},
  { name:'neToGarden', hint:'Type NORTHEAST to go into the garden.', tutorial:"Great, we can move around!|From here we can go back south to the lounge. Generally when you enter a room from one direction you will be able to go back that way, but not always.|As well as going north, south, east and west, you can also go along the diagonals, as well as up and down, and in and out. This room has a basement you can go DOWN to and a larder you can go IN. Try moving with the compass rose; note how the buttons change depending on the available exits.|The tutorial continues in the garden to the northeast (type NORTHEAST or just NE)."},
  { name:'getHat', hint:'Pick up the hat (GET HAT), and put it on (WEAR HAT).', tutorial:'Let\'s interact with something!|There is a hat here. You know that because the description tells you, and also it is listed in the panel at the left. To get the hat, type GET HAT or TAKE HAT.'},
  { name:'wearHat', hint:'Put the hat on (WEAR HAT).', tutorial:"You will be picking up things a lot in text adventures. You should see the hat listed as held in the panel to the left now. Some games have limits on how much can be held, so we might only be able to pick up eight items, or whatever.|It is always worthwhile examining an object as it might give you a clue about what it is for. You can examine the hat by typing EXAMINE HAT, LOOK AT HAT or just X HAT. Or click on it in the panel, and select \"Examine\" from the menu.|Most commands in a text adventure will be of the form &lt;verb&gt; &lt;verb&gt;.|Hats can be worn, so let's put it on! You can type WEAR HAT or DON HAT or PUT HAT ON or PUT ON HAT as you prefer."},
  { name:'xGrass', hint:'Type LOOK AT GRASS to progress.', tutorial:"You look very fetching in that hat!|You can check what you are carrying at any time with the INVENTORY command - or just type INV or I.|You don't need to pick something up to look at it, and there may be things hidden in the location description that can be examined (or even picked up). The description for this room mentioned the grass, what happens if you examine that?"},
  { name:'smell', hint:'Do SMELL or SMELL GRASS.', tutorial:"To be honest, you will come across things mentioned in descriptions that the author has not implemented, and the game will just tell you it does not know what you are talking about (like the cobwebs in the basement!), but in an ideal world you will be able to examine everything.|Sometimes you can SMELL or LISTEN. Can you smell the grass?"},
  { name:'xBox', hint:'Look at the box (X BOX).', tutorial:""},
  { name:'readBox', hint:'Read the writing on the box (READ BOX)', tutorial:"There is something written on the label, so we should try READ BOX (or READ LABEL; I think that will work in this game, but it can be worth trying alternatives when one noun fails)."},
  { name:'openBox', hint:'OPEN THE BOX and then GET THE CROWBAR.', tutorial:"Okay, so that is kind of odd, but we will roll with it. Time to open the box. Hopefully by now you will have guessed you need to say OPEN BOX. On the off-chance that there is a crowbar in there, pick it up (was that a spoiler?)."},
  { name:'hatInBox', hint:'REMOVE THE HAT and then PUT IT IN THE BOX, then CLOSE BOX.', tutorial:"I am guessing the Hat and Crowbar Company are expecting a hat back now, better put the hat in the box. Can you guess how?|The clue was in the question: PUT THE HAT IN THE BOX.|You will need to REMOVE the hat first. And once the hat is in there, close the box. Quest will understand IT to the last thing you referred to, so you could say REMOVE HAT and then PUT IT IN THE BOX.|You might want to see if anything happens if you close the box while it is empty first..."},
  { name:'crowbar', hint:'CROWBAR THE SHED DOOR and then GO EAST.', tutorial:"Cool... Wait, does that mean you're now naked? Let's assume not! So we have a crowbar, we can get into the shed.|Up to now we have been using commands that pretty much every game will understand, but games will usually have their own set of commands unique to them, as required by the plot. This game is no different.|One of the problems when playing - and when authoring - a text adventure is deciding how a command should be phrased (a problem known as \"guess the verb\"). Are we going to CROWBAR THE SHED or LEVER OPEN THE DOOR or what? Often it takes some experimenting, though sometimes the text will give you a hint - always worth trying any verb that is used in the text (at least you can be sure the author knows that word).|Often the generic USE will work, so is worth a try. See if you can get into that shed."},
  { name:'getTorch', hint:'GET TORCH.', tutorial:"This room has a torch, but it is described in the room description as part of the scenery, so not as obvious as the hat. But you can still pick it up just the same. And if you then drop it again, you will see it is just an ordinary item (though that may not be the case in all games).|Incidentally, you can call it a flashlight if you prefer. Oh, and you need to be somewhere light to turn it on, so switch it on {i:before} going into the basement."},
  { name:'torchOn', hint:'TURN ON TORCH, then head to the basement (out, southwest, then down). If you are in the basement and it is dark, you will need to go back up, and then turn the torch on before coming back down.', tutorial:"Now it is calling it a flashlight? So anyway, we have a torch, we can now take a proper look in the basement (go down from the kitchen).|The torch can  be turned on and off, with TURN ON TORCH or SWITCH FLASHLIGHT OFF or whatever."},
  { name:'turnOnLight', hint:'SWITCH ON THE LIGHT, and then TURN OFF THE TORCH (in that order!).', tutorial:"Great, at last we can see down here. And it turns out there is a light switch, but we needed the torch to see the switch.|It is quite common for torch batteries to run out after so many turns, and then you have to re-charge it or find a battery. Hopefully that will not happen here, but it would be a good idea to save the battery just in case, so turn the light on, and turn off the torch."},
  { name:'getAll', hint:'Try GET ALL to pick up everything.', tutorial:"So we have managed to turn on a light!|A lot of adventure games are like this in that you need to do A, but to do that you need to do B, but you cannot do B without doing C first, and so on. And often - as here - you do not know what A even is.|There are a few things down here that we might want to grab. Most adventure games understand the word ALL, so we can just do GET ALL to pick up the lot."},
  { name:'moveCrates', hint:'You cannot take the crates, but you might be able to MOVE CRATES.', tutorial:"Great, you used ALL!|Note that ALL will not include items that are scenery, so not the cobwebs (which are actual objects now, honest - try TAKE COBWEBS), and there are some objected we could not pick up.|You also DROP ALL, WEAR ALL, etc. though some commands will not like it. You could also try DROP ALL BUT ROPE.|You might also want to try eating the apple or reading the newspaper.|When you are done, on with the plot! We cannot take the crates with us, but trying to do so was useful because the response gave us a clue as to what we can do - we can move them."},
  { name:'enterPassage', hint:'Head WEST.', tutorial:"Now we are getting somewhere!"},
  { name:'save', hint:'Type SAVE.', tutorial:"Not much in this room, so let's pause for a moment. It is a good idea to save occasionally whilst playing, just in case you die (not possible in this game) or lose the connection to the server (not an issue for Quest 6) or your PC crashes or you just have some else to do and want to return later. You really do not want to have to start from the beginning, so save your game.|Different systems have different ways to handle saving and loading (and some games may not support it at all), but a good start is to type SAVE."},
  { name:'saveGame', hint:'Type SAVE TUTORIAL (or some other name).', tutorial:"So in Quest 6 SAVE just tells you how to save your game. You need to add a file name to actually save. Do that now! You can call it whatever you want; how about \"tutorial\"?"},
  { name:'westRobot', hint:'Head WEST.',},
  { name:'robot', hint:'ASK THE ROBOT ABOUT THE LABORATORY.', tutorial:"The robot is a non-player character, or NPC. NPCs are common in adventure games, and may be implemented in various ways. At the simplest, the NPC will be part of the background, perhaps saying a few words to you, but not really interacting. But we can interact with the robot. We will start by talking to it.|There are two approaches to conversations. We will try TALK TO with another character. Here we will do ASK and TELL. Start by asking the robot about the laboratory."},
  { name:'', hint:'ASK THE ROBOT ABOUT THE LABORATORY.', tutorial:""},
  { name:'', hint:'ASK ROBOT ABOUT ZETA-PARTICLES.', tutorial:""},
  { name:'', hint:'Go WEST to the lift.', tutorial:""},
  { name:'press3', hint:'Try PRESS 3 to operate the lift.', tutorial:"The lift (or elevator) is a special location in that it moves. You probably already knew that! To get it to go, just press one of the buttons."},
  { name:'askRLift', hint:'Go back to the laboratory, and ASK ROBOT ABOUT LIFT.', tutorial:"Something is wrong... Perhaps we should ask the robot about it?"},
  { name:'', hint:'ASK THE ROBOT ABOUT THE ZETA_REACTOR.', tutorial:""},
  { name:'', hint:'Ask the robot to open the door with ROBOT,OPEN DOOR, then head through it, N.', tutorial:""},
  { name:'northToReactor', hint:'Head NORTH.', tutorial:"Great, the robot could do it no trouble. Now we are on our way again."},
  { name:'getRod', hint:'GET ROD.', tutorial:"It is quite common for a game to have a \"timed\" challenge - you have to complete it within a set number of turns (or even within an actual time limit). As this is a tutorial, you are perfectly safe, though you will get messages saying death is getting more imminent each turn (and will be negative once the time limit expires).|Hey, maybe we'll get some superpower from all that zeta-exposure! No, but seriously kids, zeta-particles are very dangerous, and to be avoided.|In Quest 6, a turn will not pass if you try a command that is not recognised or for meta-commands like HINT; that may not be the case in every game system.|It is a good idea to save before doing a timed challenge, by the way (we saved recently, so no need for us to save now).|Now, get that control rod!"},
  { name:'backToRobot', hint:'Go back SOUTH.', tutorial:"Well that's a bother! But there must be some way around. We need to use the lift, and to do that we need to get the reactor going. Given the author has gone to trouble to set this up, there must be some way to get the control rod.|We can get the robot to do it!|You will need to go back to the other room, get the robot to come here, then tell the robot to pick up the control rod."},
  { name:'rGoNorth', hint:'Tell the robot to go north (ROBOT,N), then go NORTH yourself and tell the robot to get the rod (ROBOT,GET ROD).', tutorial:"You can tell the robot to do something by prefixing a normal command with either TELL ROBOT TO or just ROBOT and a comma. To have it go north, them, you could do TELL ROBOT TO GO NORTH or ROBOT,N."},
  { name:'rGetRod', hint:'Tell the robot to get the rod (ROBOT,GET ROD).', tutorial:"Great, now we can tell the robot to get the rod. By the way, Quest 6 is pretty good at guessing nouns, and often you only need to type a few letters, or even just one letter if there is nothing else here it might be confused with. Try R,GET R. Quest will realise the first R is a character, so will assume you mean robot, while the second R is something in the location that can be picked up."},
  { name:'rRInR', hint:'Tell the robot to put the rod i the reactor (ROBOT,PUT ROD IN REACT).', tutorial:"Now you need to tell the robot to put the rod in the reactor. Try R,PUT R IN R and see how it fares!"},
  { name:'', hint:'Tell the robot to get the rod (ROBOT,GET ROD).', tutorial:""},
  { name:'', hint:'Tell the robot to put the rod in the reactor (ROBOT,PUT ROD IN REACTOR).', tutorial:""},
  { name:'useLift', hint:function() {
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
  }, tutorial:"Now we are getting somewhere. At last the lift that we saw in the lounge right at the start is working, and we can use it to get to the top of the house."},
  { name:'eastOffice', hint:'GO EAST.', tutorial:"Hopefully when we exit the lift we will be somewhere new..."},
  { name:'useComputer', hint:'Try to USE THE COMPUTER.', tutorial:"Great we must be nearly done! Just use the computer..."},
  { name:'talkProf', hint:'TALK TO PROF.', tutorial:"Bother! We need to shift the professor. You could tell the robot to do something and, being a robot, it would just do it. Professor Kleinscope will not. In fact, you cannot ASK or TELL him stuff either. To converse with the Professor, you need to TALK TO him. Let's see what happens..."},
  { name:'', hint:'Wait until the professor goes, then try to USE COMPUTER again.', tutorial:""},
  { name:'findCode', hint:'Look for the code for the computer. Try LOOK BEHIND PAINTING, then read what you find. Once you have the number, try to USE THE COMPUTER again.', tutorial:"Oh heck!|Just occasionally a game will ask you for some specific text, which it will understand to be different to a command. In this case it is wanting a specific six-digit number (by the way, that number was randomly generated when you started the game, so you cannot cheat by asking someone on the internet what it is).|But worry not! This guy is a professor, therefore he necessarily must be absent-minded, therefore he will have the number written down somewhere. We just need to find it.|By the way, this is a small example of a \"Babel fish puzzle\". The name comes from the Hitch-Hiker's Guide to the Galaxy, and is when you have a seemingly simple task, but there is an obstacle; each time you resolve one obstacle a new one is apparent."},
  { name:'smashWindow', hint:'You need to escape, and the only way out is through the window. What happens if you SMASH THE WINDOW?', tutorial:""},
  { name:'wrapFist', hint:'You need to escape, and the only way out is through the window, but you need to wrap your hand in something first. How about that old newspaper (WRAP FIST IN NEWSPAPER)?', tutorial:""},
  { name:'smashWindow2', hint:'You need to escape, and the only way out is through the window. What happens if you SMASH THE WINDOW now your fist is wrapped in newspaper?', tutorial:""},
  { name:'out', hint:'You need to escape, and the only way out is through the broken window. What happens if you try OUT?', tutorial:""},
  { name:'climbOut', hint:'You need to escape, and the only way out is through the broken window, but it is a long way down and you will need to use the rope. To do that, TIE ROPE TO DESK, then THROW ROPE OUT WINDOW.',},
  { name:'', hint:'No hints, you have finished the game!', tutorial:""},
]

hint.now = function(name) {
  const n = hint.data.findIndex(el => el.name === name)
  if (n === -1) throw "No hint found called " + name
  if (n > player.hintCounter) {
    player.hintCounter = n
    if (hint.data[n].tutorial) {
      for (let s of hint.data[n].tutorial.split('|')) tmsg(s)
    }
  }
}

hint.before = function(name) {
  const n = hint.data.findIndex(el => el.name === name)
  if (n === -1) throw "No hint found called " + name
  return (n > player.hintCounter) 
}


  

findCmd('MetaHint').script = function() {
  if (typeof hint.data[player.hintCounter].hint === 'string') {
    metamsg(hint.data[player.hintCounter].hint)
  }
  else if (typeof hint.data[player.hintCounter].hint === 'function') {
    hint.data[player.hintCounter].hint()
  }
  else {
    console.log(hint.data[player.hintCounter].name)
    console.log("hint.data[player.hintCounter].hint is a " + (typeof hint.data[player.hintCounter].hint))
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
    "save Tutorial ow", "hint",
    "w", "hint",
    "ask robot about the laboratory", "hint",
    "topics for robot",
    "ask robot about zeta-particles", "hint",
    "w", "hint",/*
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
    "press 3", "hint",/*
    "e", "hint",
    "sit on chair", "hint",
    "look out window", "hint",
    "use computer", "hint",
    "talk to prof", "hint",
    "use computer",
    "z",
    "use computer",
    "000000", "hint",
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
    "throw rope out window", "hint",/*
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
  if (hint.before('saveGame')) {
    hint.now('saveGame')
  }
  return world.SUCCESS_NO_TURNSCRIPTS;
}



commands.push(new Cmd('Crowbar', {
  regex:/^(crowbar|level) (.+)$/,
  objects:[
    {special:'ignore'},
    {scope:parser.isHere},
  ],
  defmsg:"That's not something you can crowbar open.",
}));


commands.unshift(new Cmd('Move', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  regex:/^(move) (.+)$/,
  objects:[
    {special:'ignore'},
    {scope:parser.isHere}
  ],
  defmsg:"{pv:item:'be:true} not something you can move.",
}));



commands.push(new Cmd('Tutorial', {
  regex:/^tutorial$/,
  objects:[
  ],
  script:function() {
    document.querySelector('body').toggleClass("hidden")
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
  hint.now('smashWindow2')
  return world.SUCCESS
}

const unwrapScript = function(obj1, obj2) {
  if (obj2 !== w.old_newspaper) return failedmsg("They are not wrapped together.")
  if (obj1 !== w.fist) return failedmsg("They are not wrapped together.")
  if (!obj2.fist_wrapped) return failedmsg("They are not wrapped together.")
  obj2.fist_wrapped = false
  msg("You carefully unwrap the old newspaper from around your fist.")
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
    msg("You strike the window with the crowbar, breaking the glass. You take a moment to knock away the remaining jagged shards in the frame.")
    if (w.Professor_Kleinscope.isHere()) msg("Strangely, Professor Kleinscope does not seem to notice.")
    w.office_window.smashed = true
    hint.now('out')
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




commands.unshift(new Cmd('TieUp', {
  // throw rope out window
  regex:/^(?:tie up|tie|bind) (.+?)$/,
  objects:[
    {scope:parser.isHere},
  ],
  script:function(objects) {
    const tpParams = {item:objects[0][0]}
    if (!w.rope.isAtLoc(player)) {
      return failedmsg("What were you thinking you could tie {ob:item} up with it exactly?", tpParams)
    }
    
    if (objects[0][0] === w.robot) {
      msg("'I am not into the kinky stuff,' says the robot. Despite its metallic face, you still feel it is looking at you with disapproval.")
    }
    else if (objects[0][0] === w.Professor_Kleinscope) {
      msg("'I don;t have time for that sort of thing now,' says the Professor irritably. He looks at yoi thoughtfully. 'Though maybe later...'")
    }
    else {
      msg("That's not going to achieve anything.")
    }
    return world.FAILED
  },
}));





commands.push(new Cmd('RudeCommand', {
  // throw rope out window
  regex:/^(?:fuck|facefuck|face-fuck|face fuck|bugger|shag|suck|suck off|assfuck|ass-fuck|ass fuck|rape|ass-rape|ass rape) (.+?)$/,
  objects:[
    {scope:parser.isHere},
  ],
  script:function(objects) {
    parsermsg(lang.not_known_msg)
    if (!w.me.rudeCmdFlag) {
      tmsg('You had to go there...')
      tmsg('There are games that cater to... well, people like you, but this is NOT one of them.')
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
