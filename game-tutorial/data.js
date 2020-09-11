"use strict"

createItem("me", PLAYER(), {
  loc:"lounge",
  regex:/^(me|myself|player)$/,
  examine: "Just a regular guy.",
  hitpoints:100,
  hints:10,
})

createItem("usb_stick", {
  alias:'USB stick',
  examine:"A plain black USB stick; you can download the files on to this.",
  loc:'me'
})

createItem("fist", {
  alias:'fist',
  regex:/fist|hand|arm/,
  examine:"That funny shaped thing on the end of your arm.",
  isAtLoc:function(loc, situation) {
    if (typeof loc !== 'string') loc = loc.name
    return situation === world.PARSER && loc === 'me'
  }
})



createRoom("lounge", {
  desc:"The lounge is pleasant, if rather bare. There is a{if:kitchen_door:locked: locked} door to the north. A door to the west leads to the lift.",
  afterFirstEnter:function() {
    msg("The man you need to find is upstairs, but the lift does not work - it has no power. How can you get to him?") 
    tmsg("This is the first room, and the text is telling you about it. If there were things here, you would probably be told about them in the room description, but we will come on to that later. You will also usually be told of any exits. This room has an exit north, but it is currently locked.")
    tmsg("We will get to the lift later.")
    tmsg("Before going any further, we should look at what is on the screen. Below this text, you should see a cursor. In this game it is a > sign, but other games might use different symbols or have a box. You type commands in there. Try it now by typing WAIT (I am going to write commands for you to type in capitals to diffentiate them; you do not need to).")
  },
  north:new Exit("kitchen"),
  west:new Exit("lift", { isLocked:function() { return !w.reactor_room.reactorRunning }}),
  eventPeriod:1,
  eventActive:true,
  eventCount:0,
  eventScript:function() {
    this.eventCount++
    switch (this.eventCount) {
      case 1:
        tmsg("Typing WAIT made time pass in the game, while the player-character did nothing. You can also just type Z, which is a shortcut for WAIT.")
        tmsg("Look to the left, and you will see a panel; you can perform a lot of actions here without typing anything at all. In some games it is on the right, and many do not have it at all, so we will mostly ignore it, but for now click the \"Z\" to again wait one turn.")
        break
      case 2:
        tmsg("Some games have commands that tell you about the game or set it up differently to suit the player. In Quest 6 (but not necessarily other games) none of these count as a turn, so try a couple, and when you are done, do WAIT again.")
        tmsg("Type DARK to toggle dark mode; some users find if easier to see light text on a dark background. Type SPOKEN to toggle hearing the text read out. Type SILENT to toggle the sounds and music (not that there are any in this game).")
        tmsg("You can also type HELP to see some general instructions. You can also do ABOUT or CREDITS. Less common is the HINT command; if implemented it will give you a clue of what to do next. In this game, as it is a tutorial, it will tell you exactly what to do.")
        tmsg("For completeness, I will also mention TRANSCRIPT (or just SCRIPT), which will record your game session, and can be useful when testing someone's game. You can also use BRIEF, TERSE and VERBOSE to control how often room descriptions are shown, but I suggest we keep it VERBOSE for this tutorial.")
        break
      case 3:
        w.kitchen_door.locked = false
        tmsg("Time to move on. Something tells me that door to the north is not locked any more.")
        tmsg("You might want to look at the room again before we go. Type LOOK or just L. Hopefully it no longer says the door is locked. By the way, in some games you can use the EXITS commands to see what exits are available.")
        tmsg("Movement in adventure games is done following compass directions. To go north, type GO NORTH, or NORTH or just N.")
        tmsg("You can also use the compass rose at the top left, or, in Quest 6, if your computer has a number pad, ensure \"Num Lock\" is on, and press the up key (i.e., 8).")
        tmsg("So I will see you in the next room...")
        w.me.hints = 20
        break
    }
  },
})


createRoom("kitchen", {
  desc:"The kitchen looks clean and well-equipped.",
  afterFirstEnter:function() {
    tmsg("Great, we can move around!")
    tmsg("From here we can go back south to the lounge. Generally when you enter a room from one direction you will be able to go back that way, but not always.")
    tmsg("As well as going north, south, east and west, you can also go along the diagonals, as well as up and down, and in and out. This room has a basement you can go DOWN to and a larder you can go IN. Try moving with the compass rose; note how the buttons change depending on the available exits.")
    tmsg("The tutorial continues in the garden to the northeast (type NORTHEAST or just NE).")
    w.me.hints = 30
  },
  south:new Exit("lounge"),
  down:new Exit("basement"),
  in:new Exit("larder"),
  northeast:new Exit("garden"),
})


createItem("kitchen_door", LOCKED_DOOR([], "lounge", "kitchen"), {
  examine:"It is plain, wooden door, painted white.",
})



createRoom("basement", {
  desc:"A dank room, with a whole load of crates piled {ifNot:crates:moved:against the west wall}{if:crates:moved:up in the middle of the room. There is a door to the west}. Cobwebs hang from every beam.",
  darkDesc:"The basement is dark and full of cobwebs. The only way out is back up the ladder.",
  up:new Exit('kitchen', {isHidden:function() { return false; } }),
  west:new Exit('secret_passage', {isHidden:function() { return !w.crates.moved || (!w.light_switch.switchedon && !w.flashlight.switchedon); } }),
  lightSource:function() {
    return w.light_switch.switchedon ? world.LIGHT_FULL : world.LIGHT_NONE
  },
  hint:"The basement illustrates light and dark. There is a torch in the lounge that may be useful.",
  eventPeriod:1,
  eventIsActive:function() {
    return (w.me.loc === this.name)
  },
  eventScript:function() {
    if (w.flashlight.switchedon && !this.flag1) {
      tmsg("Great, at last we can see down here. And it turns out there is a light switch, but we needed the torch to see the switch.")
      tmsg("It is quite common for torch batteries to run out after so many turns, and then you have to re-charge it or find a battery. Hopefully that will not happen here, but it would be a good idea to save the battery just in case, so turn the light on, and turn off the torch.")
      this.flag1 = true
      w.me.hints = 140
    }
    if (!w.flashlight.switchedon && w.light_switch.switchedon && !this.flag2) {
      tmsg("So we have managed to turn on a light!")
      tmsg("A lot of adventure games are like this in that you need to do A, but to do that you need to do B, but you cannot do B without doing C first, and so on. And often - as here - you do not know what A even is.")
      tmsg("There are a few things down here that we might want to grab. Most adventure games understand the word ALL, so we can just do GET ALL to pick up the lot.")
      this.flag2 = true
      w.me.hints = 150
    }
    if (parser.currentCommand.all && w.me.hints < 160) {
      tmsg("Great, you used ALL!")
      tmsg("Note that ALL will not include items that are scenery, so not the cobwebs (which are actual objects now, honest - try TAKE COBWEBS), and there are some objected we could not pick up.")
      tmsg("You also DROP ALL, WEAR ALL, etc. though some commands will not like it. You could also try DROP ALL BUT ROPE.")
      tmsg("You might also want to try eating the apple or reading the newspaper.")
      tmsg("When you are done, on with the plot! We cannot take the crates with us, but trying to do so was useful because the response gave us a clue as to what we can do - we can move them.")
      w.me.hints = 160
    }
  }
});

createItem("light_switch", SWITCHABLE(false), {
  loc:"basement",
  examine:"A switch, presumably for the light.",
  regex:/light|switch/,
})

createItem("crates", {
  loc:"basement", 
  examine:"A bunch of old crates.",
  pronouns:lang.pronouns.plural,
  move:function() {
    if (!this.moved) {
      msg("You move the crates... And find a door was hidden behind them.")
      tmsg("Now we are getting somewhere!")
      this.moved = true
      w.me.hints = 170
      return true
    }
    else {
      msg("You feel pretty sure moving the crates again will not reveal any more hidden doors.")
      return false
    }
  },
  take:function(isMultiple, char) {
    msg(prefix(this, isMultiple) + 'The crates are too heavy to pick... But you might be able to move them.')
    return false
  },    
})

createItem("cobwebs", {
  examine:function() {
    msg("There are a lot! You wonder if it is worse if there are a thousand spiders down here... Or just one very big one.")
    if (!this.flag) {
      tmsg("I felt embarrassed about the cobwebs not being implemented, now you can look at them to your heart's content.")
      this.flag = true
    }
  },
  take:function(isMultiple, char) {
    msg(prefix(this, isMultiple) + 'The cobwebs just disintegrate when you try to take them.')
    return false
  },    
  scenery:true,
});

createItem("old_newspaper", TAKEABLE(), {
  examine:'A newspaper from the eighties; yellow with age.',
  read:'You spend a few minutes reading about what happens on the day 14th June 1987 (or perhaps the day before). A somewhat mocking article about an archaeologist, Dr Ruudhorn, and Atlantis catches your eye.',
  loc:'basement',
});

createItem("rope", ROPE(false), {
  examine:'About 25 foot long; it looks old, but serviceable.',
  loc:'basement',
  ropeLength:5,
});

createItem("apple", EDIBLE(), {
  examine:'A rosy red apple.',
  loc:'basement',
});








createRoom("larder", {
  desc:"Oh, dear, the larder is empty!",
  out:new Exit("kitchen"),
})


createRoom("garden", {
  desc:"The garden is basically a few square feet of grass.",
  southwest:new Exit("kitchen"),
  afterFirstEnter:function() {
    tmsg("Let's interact with something!")
    tmsg("There is a hat here. You know that because the description tells you, and also it is listed in the panel at the left. To get the hat, type GET HAT or TAKE HAT.")
    w.me.hints = 40
  },
  east:new Exit("shed", {
    alsoDir:['in'],
    use:function() {
      if (w.shed_door.locked) {
        msg('You shed door is padlocked. If only you have something to break it off...')
        return false
      }
      else {
        msg('You walk into the shed.')
        world.setRoom(w.me, "shed")
        return true
      }
    },
  }),
  onSmell:function() {
    msg("You can smell the freshly-cut grass!")
    if (w.me.hints < 70) {
      tmsg("You can also smell specific items, so SMELL GRASS would have also worked.")
      msg("A large wooden box falls from the sky! Miraculously, it seems to have survived intact.")
      tmsg("The box is a container, which means you can put things inside it and maybe find things already in it. Perhaps we should start by looking at it.")
      w.box.loc = "garden"
      w.me.hints = 70
    }
  },
})

createItem("hat", WEARABLE(), {
  examine:"It is straw boater, somewhat the worse for wear.",
  loc:"garden",
  onMove:function(toLoc) {
    if (!this.flag1 && toLoc === 'me') {
      tmsg("You will be picking up things a lot in text adventures. You should see the hat listed as held in the panel to the left now. Some games have limits on how much can be held, so be might only be able to pick up eight items, or whatever.")
      tmsg("It is always worthwhile examining an object as it might give you a clue about what it is for. You can examine the hat by typing EXAMINE HAT, LOOK AT HAT or just X HAT. Or click on it in the panel, and select \"Examine\" from the menu.")
      tmsg("Most commands in a text adventure will be of the form &lt;verb&gt; &lt;verb&gt;.")
      tmsg("Hats can be worn, so let's put it on! You can type WEAR HAT or DON HAT or PUT HAT ON or PUT ON HAT as you prefer.")
      w.me.hints = 50
    }
    this.flag1 = true
  },
  afterWear:function() {
    if (!this.flag2) {
      tmsg("You look very fetching in that hat!")
      tmsg("You can check what you are carrying at any time with the INVENTORY command - or just type INV or I.")
      tmsg("You don't need to pick something up to look at it, and there may be things hidden in the location description that can be examined (or even picked up). The description for this room mentioned the grass, what happens if you examine that?")
      w.me.hints = 60
    }
    this.flag2 = true
  },
})


createItem("grass", {
  examine:function() {
    msg("The grass is green, and recently cut.")
    if (!this.flagged) {
      tmsg("To be honest, you will come across things mentioned in descriptions that the author has not implemented, and the game will just tell you it does not know what you are talking about (like the cobwebs in the basement!), but in an ideal world you will be able to examine everything.")
      tmsg("Sometimes you can SMELL or LISTEN. Can you smell the grass?")
      w.me.hints = 65
    }
  },
  loc:"garden",
  scenery:true,
  smell:function() {
    msg("You can smell the grass; it has just been cut!")
    if (w.me.hints < 70) {
      tmsg("You can also smell the whole location, so just SMELL would have also worked.")
      msg("A large wooden box falls from the sky! Miraculously, it seems to have survived intact.")
      tmsg("The box is a container, which means you can put things inside it and maybe find things already in it. Perhaps we should start by looking at it.")
      w.box.loc = "garden"
      w.me.hints = 70
    }
  },
})








createItem("box", CONTAINER(true), LOCKED_WITH([]), {
  examine:function() {
    const tpParams = {char:game.player, container:this}
    tpParams.list = this.listContents(world.LOOK)
    msg("It is large, wooden box. It does not look very substantial, but it survived the fall nevertheless. There is a label on the {ifNot:box:closed:open }lid.")
    if (!this.closed) msg(lang.look_inside, tpParams)
    if (!this.flag2) {
      tmsg("There is something written on the label, so we should try READ BOX (or READ LABEL; I think that will work in this game, but it can be worth trying alternatives when one noun fails).")
      w.me.hints = 80
      this.flag2 = true
    }
  },
  regex:/crate|label|lid/,
  read:function() {
    msg("The label says: \"The Hat and Crowbar Company - exchanging hats for crowbars since 2020.\"")
    tmsg("Okay, so that is kind of odd, but we will roll with it. Time to open the box. Hopefully by now you will have guessed you need to say OPEN BOX. On the off-chance that there is a crowbar in there, pick it up (was that a spoiler?).")
    this.locked = false
    w.me.hints = 90
  },
  closeMsg:function() {
    if (!this.flag && w.hat.loc === 'box' && w.crowbar.loc !== 'box') {
      msg("You close the lid. 'Thank you for your custom!' says the box. It starts to shake violently then leaps into the air, rapidly disappearing from sight.")
      tmsg("Cool... Wait, does that mean you're now naked? Let's assume not! So we have a crowbar, we can get into the shed.")
      tmsg("Up to now we have been using commands that pretty much every game will understand, but games will usually have their own set of commands unique to them, as required by the plot. This game is no different.")
      tmsg("One of the problems when playing - and when authoring - a text adventurer is deciding how a command should be phrased (a problem known as \"guess the verb\"). Are we going to CROWBAR THE SHED or LEVER OPEN THE DOOR or what? Often it takes some experimenting, though sometimes the text will give you a hint - always worth trying any verb that is used in the text (at least you can be sure the author knows that word).")
      tmsg("Often the generic USE will work, so is worth a try.")
      w.me.hints = 110
      this.flag = true
      delete this.loc
    }
    else {
      msg("'Hey!' exclaims a voice from the box, 'where's my hat?' The lid flips back open.")
      this.closed = false
    }
  },
})


// USE!!!!
createItem("crowbar", TAKEABLE(), {
  examine:"A cheap plastic crowbar; it is red, white, blue and yellow.",
  loc:"box",
  onMove:function(toLoc) {
    if (!this.flag1 && toLoc === 'me') {
      tmsg("I am guessing the Hat and Crowbar Company are expecting a hat back now, better put the hat in the box. Can you guess how?")
      tmsg("The clue was in the question: PUT THE HAT IN THE BOX.")
      tmsg("You will need to REMOVE the hat first. And once the hat is in there, close the box. Quest will understand IT to the last thing you referred to, so you could say REMOVE HAT and then PUT IT IN THE BOX.")
      tmsg("You might want to see if anything happens if you close the box while it is empty first...")
      w.me.hints = 100
    }
    this.flag1 = true
  },
  use:function(isMultiple, char) {
    if (char.loc === 'laboratory' && w.lab_door.locked) {
      msg("The crowbar is not going to help open that door.")
      tmsg("Nice try, but you have to get the robot to open this door, not the crowbar.")
      return false
    }
    if (!char.loc === 'garden') return falsemsg("There is nothing to use the crowbar on here.")
    return w.shed_door.crowbar()
  },
})

createItem("shed_door", {
  examine:"The shed is metal, a kind of beige colour{if:shed_door:locked:; the door is padlocked... but the padlock does not look that strong}.",
  loc:"garden",
  locked:true,
  scenery:true,
  crowbar:function() {
    if (!this.locked) return falsemsg("The padlock is already off the lock.")
    msg("You put the crowbar to the padlock, and give a pull. The padlock breaks.")
    this.locked = false
    return true
  },
})








createRoom("shed", {
  desc:"The shed is disappointingly empty{if:flashlight:scenery:, apart from a torch in the far corner}.",
  afterFirstEnter:function() {
    tmsg("This room has a torch, but it is described in the room description as part of the scenery, so not as obvious as the hat. But you can still pick it up just the same. And if you then drop it again, you will see it is just an ordinary item (though that may not be the case in all games).")
    tmsg("Incidentally, you can call it a flashlight if you prefer.")
    w.me.hints = 120
  },
  west:new Exit("garden", { alsoDir:['out']}),
})



createItem("flashlight", TAKEABLE(), SWITCHABLE(false), {
  loc:"shed",
  scenery:true,
  examine:"A small red torch.",
  regex:/^torch$/, 
  byname:function(options) {
    let res = this.alias;
    if (options.article) { res = (options.article === DEFINITE ? "the" : "a") + " " + this.alias; }
    if (this.switchedon && options.modified) { res += " (providing light)"; }
    return res;
  },
  lightSource:function() {
    return this.switchedon ? world.LIGHT_FULL : world.LIGHT_NONE;
  },
  onMove:function(toLoc) {
    if (!this.flag1 && toLoc === 'me') {
      tmsg("Now it is calling it a flashlight? So anyway, we have a torch, we can now take a proper look in the basement.")
      tmsg("The torch can  be turned on and off, with TURN ON TORCH or SWITCH FLASHLIGHT OFF or whatever.")
      w.cobwebs.loc = 'basement'
      w.me.hints = 130
    }
    this.flag1 = true
  },
});






createRoom("secret_passage", {
  desc:"The passage heads west.",
  afterFirstEnter:function() {
    tmsg("Not much in this room, so let's pause for a moment. It is a good idea to save occasionally whilst playing, just in case you die (not possible in this game) or lose the connection to the server (not an issue for Quest 6) or your PC crashes or you just have some else to do and want to return later. You really do not want to have to start from the beginning, so save your game.")
    tmsg("Different systems have different ways to handle saving and loading (and some games may not support it at all), but a good start is to type SAVE.")
    w.me.hints = 180
  },
  east:new Exit("basement"),
  west:new Exit("laboratory"),
})








createRoom("laboratory", {
  desc:"This is a laboratory of some sort. The room is full of screens and instruments, but you cannot tell what sort of science is being done here. There is a big steel door {ifNot:lab_door:closed:lying open }to the north{if:lab_door:closed:; you feel pretty sure it will be too heavy for you to open}.",
  afterFirstEnter:function() {
    if (w.me.hints < 200) {
      tmsg("Okay, so not bothering with saving...")
    }
    tmsg("The robot is a non-player character, or NPC. NPCs are common in adventure games, and may be implemented in various ways. At the simplest, the NPC will be part of the background, perhaps saying a few words to you, but not really interacting. But we can interact with the robot. We will start by talking to it.")
    tmsg("There are two approaches to conversations. We will try TALK TO with another character. Here we will do ASK and TELL. Start by asking the robot about the laboratory.")
    w.me.hints = 210
  },
  afterEnter:function() {
    if (w.me.hints === 310) {
      tmsg("You can tell the robot to do something by prefixing a normal command with either TELL ROBOT TO or just ROBOT and a comma. To have it go north, them, you could do TELL ROBOT TO GO NORTH or ROBOT,N.")
      w.me.hints = 315
    }
  },
  
  lab_door_locked:true,
  east:new Exit("secret_passage"),
  west:new Exit("lift"),
  north:new Exit("reactor_room", {use:function(char) {
    if (char === w.me && w.lab_door.closed) return falsemsg("The door is too heavy for you to move.")
    if (char === w.robot) {
      if (w.lab_door.closed) {
        msg("The robot opens the heavy door with ease.")
        w.lab_door.closed = false
      }
      world.setRoom(w.robot, "reactor_room", "north")
      return true
    }
    world.setRoom(w.me, "reactor_room", "north")
    return true
  }}),
})

createItem("lab_door", OPENABLE(false), {
  examine:"A very solid, steel door.",
  loc:'laboratory',
  open:function(isMultiple, char) {
    if (!this.closed) {
      msg(prefix(this, isMultiple) + lang.already, {item:this})
      return false;
    }
    if (char.strong) {
      this.closed = false;
      this.openMsg(isMultiple, {char:char, container:this})
      if (w.me.hints < 280) {
        tmsg("Great, the robot could do it no trouble. Now we are on our way again.")
        w.me.hints = 280
      }
      return true
    }
    else {
      msg(prefix(this, isMultiple) + 'The door is too heavy to open.')
      return false
    }
  },
})

createItem("screens", {
  examine:"There are six smaller screens attached to different instruments, each displaying graphs and numbers that are slowly evolving over time. A larger screen shows another room, with some huge device sitting in a sunked area in the middle of it. Pipes are cables seem to feed it.{if:robot:loc:reactor_room: You can see the robot in the room.}",
  loc:'laboratory',
  scenery:true,
})

createItem("instruments", {
  examine:"The instruments are essentially oddly-shaped boxes. They are a mix of pale grey, light brown and white, and have various pipe and cable connections at at various points. They all have a brand badge on the front, but no other markings.",
  loc:'laboratory',
  scenery:true,
})

createItem("brand_badges", COMPONENT("instruments"), {
  examine:function() {
    msg("The badges on the various instruments are all the same; \"Zeta Industries\". They appear to be hand-drawn.")
    if (!this.flag1) {
      tmsg("Cool, you are using your initiative to look deeper. This can be vital in some games.")
      tmsg("But not this one.")
    }
    this.flag1 = true
  },
  regex:/badge/,
  loc:'laboratory',
  scenery:true,
})







createRoom("reactor_room", {
  desc:function() {
    return "The reactor room is dominated by a huge zeta-reactor, extending from a sunken area some five foot below floor level, up to the ceiling. Pipes and cables of varying sizes are connected to it{if:reactor_room:reactorRunning:, and the reactor is humming with power}.{ifHere:vomit: There is vomit in the corner.}"
  },
  reactorRunning:false,
  south:new Exit("laboratory"),
  eventPeriod:1,
  eventIsActive:function() { return w.me.loc === "reactor_room" },
  countdown:6,
  eventScript:function() {
    this.countdown--
    msg("A recorded voice echoes round the room: 'Warning: Zeta-particle levels above recommended safe threshold. Death expected after approximately {reactor_room.countdown} minutes of exposure.'")
    switch (this.countdown) {
      case 5:
        tmsg("It is quite common for a game to have a \"timed\" challenge - you have to complete it within a set number of turns (or even within an actual time limit). As this is a tutorial, you are perfectly safe, though you will get messages saying death is getting more imminent each turn (and will be negative once the time limit expires).")
        tmsg("Hey, maybe we'll get some superpower from all that zeta-exposure! No, but seriously kids, zeta-particles are very dangerous, and to be avoided.")
        tmsg("In Quest 6, a turn will not pass if you try a command that is not recognised or for meta-commands like HINT; that may not be the case in every game system.")
        tmsg("It is a good idea to save before doing a timed challenge, by the way (we saved recently, so no need for us to save now).")
        tmsg("Now, get that control rod!")
        w.me.hints = 300
        break
      case 4:
        msg("You are feeling a little nauseous.")
        break
      case 3:
        msg("You start to get a headache.")
        break
      case 2:
        msg("You are feeling very nauseous.")
        break
      case 1:
        msg("You throw up, feeling very weak.")
        w.vomit.loc = this.name
        break
      case 0:
        msg("You have died.")
        tmsg("Don't worry, you are not really dead; this is just a tutorial. Unfortunately, that does mean the next warning will say you will die in minus one minute, as the countdown goes below zero.")
        break
    }
    if (w.me.hints < 320 && w.robot.loc === this.name) {
      tmsg("Great, now we can tell the robot to get the rod. By the way, Quest 6 is pretty good at guessing nouns, and often you only need to type a few letters, or even just one letter if there is nothing else here it might be confused with. Try R,GET R. Quest will realise the first R is a character, so will assume you mean robot, while the second R is something in the location that can be picked up.")
      w.me.hints = 320
    }
  }  
})



createRoom("reactor", CONTAINER(false), {
  examine:function() {
    return "The reactor is composed of a series of rings, hoops and cylinders arranged on a vertical axis. Some are shiny metal, other dull black, but you have no idea of the significant of any of them.{if:reactor_room:reactorRunning: An intense blue light spills out from various points up it length.}"
  },
  scenery:true,
  loc:'reactor_room',
  testRestrictions:function(object, char) {
    if (object === w.control_rod) return true
    msg("That cannot go in there!")
    return false
  },
  itemDropped:function(item) {
    if (w.control_rod.loc === this.name) {
      msg("The reactor starts to glow with a blue light, and you can hear it is now buzzing.")
      w.reactor_room.reactorRunning = true
      if (w.me.hints < 370) {
        tmsg("Now we are getting somewhere. At last the lift that we saw in the lounge right at the start is working, and we can use it to get to the top of the house.")
        w.me.hints = 370
      }
      
      
    }
  },
})

createRoom("vomit", {
  examine:"You decide against looking too closely at the vomit, but it occurs to you that perhaps you should tell the robot about it.",
  scenery:true,
})

createItem("control_rod", TAKEABLE(), {
  examine:"The control rod is about two foot long, and a dull black colour.",
  take:function(isMultiple, char) {
    const tpParams = {char:char, item:this}
    if (this.isAtLoc(char.name)) {
      msg(prefix(this, isMultiple) + lang.already_have, tpParams);
      return false;
    }
    if (!char.canManipulate(this, "take")) return false;
    
    if (char === w.me) {
      msg("As you go to grab the control rod, a recorded message says: 'Warning: Control rod is highly zeta-active. Handling will result in instant death.' You decide upon reflection that you do not want to pick it up that much.")
      if (!this.flag1) {
        tmsg("Well that's a bother! But there must be some way around. We need to use the lift, and to do that we need to get the reactor going. Given the author has gone to trouble to set this up, there must be some way to get the control rod.")
        tmsg("We can get the robot to do it!")
        tmsg("You will need to go back to the other room, get the robot to come here, then tell the robot to pick up the control rod.")
        w.me.hints = 310
      }
      this.flag1 = true
      return false 
    }
    let flag = (this.loc === "reactor")
    msg(prefix(this, isMultiple) + lang.take_successful, tpParams)
    this.moveToFrom(char.name)
    if (flag) {
      msg("The blue light in the reactor winks out and the buzz dies.")
      w.reactor_room.reactorRunning = false
    }
    if (w.me.hints < 350) {
      tmsg("Now you need to tell the robot to put the rod in the reactor. Try R,PUT R IN R and see how it fares!")
      w.me.hints = 350
    }
    return true
  },
  loc:'control_rod_repository',
})

createItem("control_rod_repository", SURFACE(), {
  examine:"The control rod repository is a cross between a shelf and a cradle; it is attached to the wall like a shelf, but shaped like a cradle to hold the control rod.",
  loc:'reactor_room',
})





createRoom("office", {
  desc:function() {
    return "The office is a fair-size, dominated by a large desk. {ifNot:Professor_Kleinscope:flag:Sat behind the desk is Professor Kleinscope. }There is an elderly computer sat on the desk {once:- this must be the computer with the files on it; getting the files will not be possible while the Professor is sat there, however}. Behind the desk is a large window, and on the wall to the right is an odd painting."
  },
  west:new Exit("lift", { use:function() {
    if (w.office.lift_exit_locked) return falsemsg("The lift door is closed. You suspect Professor Kleinscope is in he lift and on his way up right now.")
    msg("You walk back into the lift.")
    world.setRoom(w.me, this.name, this.dir)
  }}),
  out:new Exit("garden", {
    use:function() {
      if (!w.office_window.smashed) falsemsg("There is a pane of glass in the way.")
      if (!w.rope.locs.includes('outside')) {
        msg("You look out the window. If is a long way down to the ground, and there are no handholds. You need a way to climb down.")
        if (w.me.hints < 470) w.me.hints = 470
        return false
      }
      msg("You climb out the window, and down the rope, quickly reaching the ground. You jump in your SUV, and drive away. A job well done.")
      msg(" ")
      msg("Congratulations, you have won!")
      msg(" ")
      tmsg("So this is where we say good bye; you have completed the game, and hopefully now have a pretty good idea of how to play parser-based adventure games (and perhaps even write some too).")
      io.finish()
      return true
    },
    isHidden:function() { return !w.office_window.smashed },
  }),
  afterFirstEnter:function() {
    tmsg("Great we must be nearly done! Just use the computer...")
    w.me.hints = 390
  },
})

createItem("office_window", {
  examine:"The control rod repository is a cross between a shelf and a cradle; it is attached to the wall like a shelf, but shaped like a cradle to hold the control rod.",
  loc:'office',
  scenery:true,
  outside:[],
  lookout:function() {
    let s = 'Out of the window you can see the street at the front of the house. Your black SUV is parked at the side on the road.'
    if (this.outside.length > 0) s += ' On the street below the house you can see ' + formatList(this.outside, {article:DEFINITE, lastJoiner:' and '}) + '.'
    msg(s)
  },
  smash:function() {
    if (this.smashed) {
      return falsemsg("The window is already smashed.")
    }
    else if (w.old_newspaper.fist_wrapped) {
      msg("With your fist wrapped in the old newspaper, you punch it through the window, breaking the glass. You take a moment to knock away the remaining jagged shards in the frame.")
      this.smashed = true
      if (w.me.hints < 460) w.me.hints = 460
      return true
    }
    else {
      msg("You are about to put your fist through the window when it occurs to you that your hand will get ripped to shreds by the glass fragments, and you really do not want to leave DNA evidence here. It is definitely not that you hate the sight of blood.")
      if (w.me.hints < 440) w.me.hints = 440
      return false
    }
  },
  isThrowThroughable:function(item) {
    if (this.smashed) return true
    return falsemsg("You can't throw anything out of the window, it is closed.")
  },
  throwThrough:function(item) {
    if (item !== w.rope) {
      msg("You lob {nm:item:the} out the window; it lands on the street below.")
      delete item.loc
      office_window.outside.push(item)
      return true
    }
    if (!item.tiedTo1 && !item.tiedTo2) return falsemsg("You are about to heave the rope out the window when it occurs to you that it might be useful to tie one end to something first.")
    if (item.tiedTo1 && item.tiedTo2) falsedmsg("The rope is tied to both {nm:obj1:the} and {nm:obj2:the}; which end were you hoping to throw out?", {obj1:w[rope.tiedTo1], obj2:w[rope.tiedTo2]})

    msg("You throw the end of the rope out the window.")
    if (item.tiedTo1) {
      item.locs.push("outside")
    }
    else {
      item.locs.unshift("outside")
    }
  },
  open:function() {
    return falsemsg("The window does not open.")
  },
})

createItem("painting", {
  examine:"The painting at first glance is abstract, but after staring at it for a few minutes, you realise is is actually a portrait of a woman in a blue dress with a bizarre hat.",
  loc:'office',
  scenery:true,
  lookbehind:function() {
    if (w.Professor_Kleinscope.loc === 'office') {
      msg("'Please don't touch that,' says the Professor as you reach out, 'it's very expensive.'")
    }
    else {
      msg('You look behind the painting, but inexplicably there is no safe there. But there is a post-it note stuck to the back of the picture.')
    }
  },
})


createItem("postit_note", TAKEABLE(), {
  alias:'post-it note',
  examine:"The sticky yellow note has something written on it; the number {show:computer:code}.",
  read:"The post-it note just has six digits written on it: {show:computer:code}.",
  loc:'office',
  scenery:true,
})



createItem("chair", FURNITURE({sit:true, stand:true}), {
  examine:"This is an elegant, white office chair in good condition.",
  loc:'office',
  scenery:true,
  onsitting:function(char) {
    if (w.Professor_Kleinscope.loc === 'office') {
      msg("'Making yourself at home, I see...' notes Professor Kleinscope.")
    }
  },
  onstanding:function(char) {
    if (w.Professor_Kleinscope.loc === 'office') {
      msg("'I'd rather you kept your feet {i:off} the furniture,' says Professor Kleinscope crossly.")
    }
  },
  testForPosture:function(char, posture) {
    if (w.Professor_Kleinscope.flag) return true
    msg("You think about " + posture + " on the chair, but are unsure how Professor Kleinscope feel about it - given he is already sat on it.")
    return false
  },
})



createItem("desk", {
  examine:"The desk is artfully curved, and made of a pale wood.",
  loc:'office',
  scenery:true,
  attachable:true,
})



createItem("computer", {
  examine:"The computer is so old it is beige.",
  loc:'office',
  scenery:true,
  code:random.int(10000, 999999).toString(),
  use:function() {
    if (!w.Professor_Kleinscope.flag) {
      msg("You cannot use the computer while Professor Kleinscope is sat there using it himself!")
      if (w.me.hints < 400) {
        tmsg("Bother! We need to shift the professor. You could tell the robot to do something and, being a robot, it would just do it. Professor Kleinscope will not. In fact, you cannot ASK or TELL him stuff either. To converse with the Professor, you need to TALK TO him. Let's see what happens...")
        w.me.hints = 400
      }
    }
    else if (w.Professor_Kleinscope.loc === 'office') {
      msg("You reach a hand out to the keyboard. 'Hands off!' insists the Professor.{once: 'I have some very important files on there, and I don't want the likes of you messing with them.'}")
      tmsg("I have a feeling if we just wait a few turns Kleinscope will head off and look for his dinner.")
    }
    else {
      msg("You press a key on the keyboard, and a message appears on the screen: 'Please input your six digit PIN.'")
      askQuestion("PIN?", function(result) {
        if (result === w.computer.code) {
          msg("You type \"" + result + "\", and unlock the computer. You put in your USB stick, and download the files... It takes nearly twenty minutes; this is one slow computer.")
          if (w.me.hints < 430) {
            tmsg("Cool, you found the number without any prompting from me.")
          }
          msg("As you remove the USB stick, an alarm sounds, and you hear a voice: 'Warning: Illegal access to USB port detected. Warning: Illegal access to USB port detected.'")
          tmsg("Who knew such an old computer would be protected like that? The Professor will be here soon, coming up the lift. You need to find another way out. How about the window?")
          tmsg("I've held you hand for long enough, let's see if you can do this on your own - but remember, you can use the HINT command if you are stuck.")
          if (w.old_newspaper.loc !== 'me' && w.rope.isAtLoc('me') && w.old_newspaper.loc !== 'office' && !w.rope.isAtLoc('office')) {
            tmsg("That said, I see you lost the newspaper and the rope somewhere. First rule of playing adventure games; never leave anything behind unless you have to. Through the magical power of Tutorial-Guy, I will summon them here for you, just on the off-chance they will be needed.")
            w.old_newspaper.loc = 'office'
            w.rope.locs = ['office']
          }
          else if (w.old_newspaper.loc !== 'me' && w.old_newspaper.loc !== 'office') {
            tmsg("That said, I see you lost the newspaper somewhere. First rule of playing adventure games; never leave anything behind unless you have to. Through the magical power of Tutorial-Guy, I will summon it here for you, just on the off-chance it will be needed.")
            w.old_newspaper.loc = 'office'
          }
          else if (!w.rope.isAtLoc('me') && !w.rope.isAtLoc('office')) {
            tmsg("That said, I see you lost the rope somewhere. First rule of playing adventure games; never leave anything behind unless you have to. Through the magical power of Tutorial-Guy, I will summon it here for you, just on the off-chance it will be needed.")
            w.rope.locs = ['office']
          }
          
          w.me.hints = 430
          w.office.lift_exit_locked = true
        }
        else {
          msg("You type \"" + result + "\", but it fails to unlock the computer.")
          if (w.me.hints < 420) {
            tmsg("Oh heck!")
            tmsg("Just occasionally a game will ask you for some specific text, which it will understand to be different to a command. In this case it is wanting a specific six-digit number (by the way, that number was randomly generated when you started the game, so you cannot cheat by asking someone on the internet what it is).")
            tmsg("But worry not! This guy is a professor, therefore he necessarily must be absent-minded, therefore he will have the number written down somewhere. We just need to find it.")
            tmsg("By the way, this is a small example of a \"Babel fish puzzle\". The name comes from the Hitch-Hiker's Guide to the Galaxy, and is when you have a seemingly simple task, but there is an obstacle; each time you resolve one obstacle a new one is apparent.")
            w.me.hints = 420
          }
        }
      })
    }
  },
})



createRoom("lift", TRANSIT("east"), {
  desc:function() {
    return "The lift is small; according the plaque it is limited to just three people."
  },
  alias:'elevator',
  east:new Exit("laboratory"),
  afterFirstEnter:function() {
    tmsg("The lift (or elevator) is a special location in that it moves. You probably already knew that! To get it to go, just press one of the buttons.")
    w.me.hints = 240
  },
  transitCheck:function() {
    if (!w.reactor_room.reactorRunning) {
      msg("The lift does not seem to be working.")
      if (w.me.hints < 250) {
        tmsg("Something is wrong... Perhaps we should ask the robot about it?")
        w.me.hints = 250
      }
      return false
    }
    if (w.rope.locs.includes("lift") && w.rope.locs.length > 2) {
      msg("The lift door closes... gets stopped by the rope, and then opens again.")
      if (!this.ropeFlag) {
        tmsg("What have you done? I said nothing about tying the rope to something! I've got a bad feeling about this...")
        this.ropeFlag
      }
      return false
    }
    return true;
  },
  transitOnMove:function(transitDest, exitName) {
    if (w.me.hints < 380 && transitDest === 'office') {
      w.me.hints = 380
      tmsg("Hopefully when we exit the lift we will be somewhere new...")
    }
  }
})

createItem("button_1", TRANSIT_BUTTON("lift"), {
  alias:"Button: 1",
  examine:"A button with the letter 1 on it.",
  transitDest:"laboratory",
  transitAlreadyHere:"You press the button; nothing happens.",
  transitGoToDest:"You press the button; the door closes and the lift ascends.",
})

createItem("button_2", TRANSIT_BUTTON("lift"), {
  alias:"Button: 2",
  examine:"A button with the letter 2 on it.",
  transitDest:"lounge",
  transitAlreadyHere:"You press the button; nothing happens.",
  transitGoToDest:"You press the button; the door closes and the lift moves.",
})

createItem("button_3", TRANSIT_BUTTON("lift"), {
  alias:"Button: 3",
  examine:"A button with the letter 3 on it.",
  transitDest:"office",
  transitAlreadyHere:"You press the button; nothing happens.",
  transitGoToDest:"You press the button; the door closes and the lift descends.",
})

