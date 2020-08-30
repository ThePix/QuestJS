"use strict"

createItem("me", PLAYER(), {
  loc:"lounge",
  regex:/^(me|myself|player)$/,
  examine: "Just a regular guy.",
  hitpoints:100,
  hints:10,
})

createRoom("lounge", {
  desc:"The lounge is pleasant, if rather bare. There is a{if:kitchen_door:locked: locked} door to the north",
  afterFirstEnter:function() {
    tmsg("This is the first room, and the text is telling you about it. If there were things here, you would probably be told about, but we will come on to that later. You will also be told of any exits. This room has an exit north but it is currently locked.")
    tmsg("Before going any further, we should look at what is on the screen. Below this text, you should see a cursor. In this game it is a > sign, but other games might use different symbols or have a box. You type commands in there. Try it now by typing WAIT (I am going to put command for you to type in capitals; you do not need to).")
  },
  north:new Exit("kitchen"),
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
        tmsg("Type DARK to toggle dark mode; some users find if easier to see light text on a dark background. Type SPOKEN to toggle hearing the text read out. Type SILENT to toggle the sounds and music.")
        tmsg("You can also type HELP to see some general instructions (but you are doing the tutorial, so no point in this game. You can also do ABOUT or CREDITS. Less common is the HINT common; if implemented it will give you a clue of what to do next. In this game, as it is a tutorial, it will tell you exactly what to do.")
        break
      case 3:
        w.kitchen_door.locked = false
        tmsg("Time to move on. Something tells me that door to the north is not locked any more.")
        tmsg("You might want to look at the room again before we going. Just type LOOK or just L. Hopefully it no longer says the door is locked.")
        tmsg("Movement in adventure games is done following compass directions. To go north, type GO NORTH, or just NORTH or just N.")
        tmsg("You can also use the compass rose at the top left, or, in Quest 6, if your computer has a number pad, ensure \"Num Lock\" is on, and press the up key (i.e., 8).")
        tmsg("So I will see you in the next room...")
        w.me.hints = 20
        break
    }
  },
})


createRoom("kitchen", {
  desc:"This is the second room.",
  afterFirstEnter:function() {
    tmsg("Great, we can move around!")
    tmsg("From here we can go back south to the lounge. General in you enter a room from one direction you will be able to go back that way, but not always.")
    tmsg("As well as going north, south, east and west, you can also go along the diagonals, as well as up and down, and in and out. The room has a basement you can go DOWN to and a larder you can go IN. Try moving with the compass rose; note how the buttons change depending on the available exits.")
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


w.kitchen_door.locked = false


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
      tmsg("Great, at last we can see down here. And it turns out there there is a light switch, but we needed the torch to see the switch.")
      tmsg("It is quite common for torch batteries to run out after so many turns, and then you have to re-charge it or find a battery. Hopefully that will not happen here, but it would be a good idea to save the battery just in case, so turn the light on, and turn off the torch.")
      this.flag1 = true
      w.me.hints = 140
    }
    if (!w.flashlight.switchedon && w.light_switch.switchedon && !this.flag2) {
      tmsg("So we have managed to turn on a light!")
      tmsg("A lot of adventure games are like this in that you need to do A, but to do that you need to do B, but you cannot do B without doing C first, and so on. And often - as here - you do not know what A even is. So we turned a light on? So what? Where has that got us?")
      tmsg("Well, we can now see those crates. Perhaps we should investigate them.")
      this.flag2 = true
      w.me.hints = 150
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
    if (!this.takeflag) {
      tmsg("So we cannot take the crates with us, but trying to do so was useful because the response gave us a clue as to what we can do - we can move them.")
      this.takeflag = true
      w.me.hints = 160
    }
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








createRoom("larder", {
  desc:"Oh, dear, the larder is empty!",
  out:new Exit("kitchen"),
})


createRoom("garden", {
  desc:"The garden is basically a few square feet of grass, but there are some roses in the corner.",
  southwest:new Exit("kitchen"),
  afterFirstEnter:function() {
    tmsg("Sometimes it is worth doing SMELL or LISTEN in a location. There are roses here, perhaps you can smell them.")
    w.me.hints = 35
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
  smell:function() {
    msg("You can smell the roses.")
    tmsg("You can also smell specific items, so SMELL ROSES would have also worked.")
    tmsg("Let's interact with something!")
    tmsg("There is a hat here. You know that because the description tells you, and also it is listed in the panel at the left. To get the hat, type GET HAT or TAKE HAT.")
    w.me.hints = 40
  },
})

createItem("hat", WEARABLE(), {
  examine:"It is straw boater, somewhat the worse for wear.",
  loc:"garden",
  onMove:function(toLoc) {
    if (!this.flag1 && toLoc === 'me') {
      tmsg("You will be picking up things a lot in text adventures. You should see the hat listed as worn in the panel to the left now. Some games have limits, so be might only be able to pick up eight items, or whatever.")
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
      tmsg("You can check what you are carrying at any time wth the INVENTORY command - or just type INV or I.")
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
      msg("A large wooden box falls from the sky! Miraculously, it sees to have survived in tact.")
      tmsg("The box is a container, which means you can put things inside it and maybe find things already in it. Perhaps we should start by looking at it.")
      w.box.loc = "garden"
      w.me.hints = 70
    }
  },
  loc:"garden",
  scenery:true,
})




createItem("roses", {
  examine:function() {
    msg("The roses are in full bloom - beautiful and red.")
    if (!this.flagged) {
      tmsg("To be honest, you will come across things mentioned in descriptions that the author has not implemented, and the game will just tell you it does not know what you are talking about (like the cobwebs in the basement!), but in an ideal world you will be able to examine everything.")
      msg("A large wooden box falls from the sky! Miraculously, it sees to have survived in tact.")
      tmsg("The box is a container, which means you can put things inside it and maybe find things already in it. Perhaps we should start by looking at it.")
      w.box.loc = "garden"
      w.me.hints = 70
    }
  },
  smell:function() {
    msg("The roses smell wonderful!")
    tmsg("You can also try just SMELL on its own.")
    tmsg("Let's interact with something!")
    tmsg("There is a hat here. You know that because the description tells you, and also it is listed in the panel at the left. To get the hat, type GET HAT or TAKE HAT.")
    w.me.hints = 40
  },
  loc:"garden",
  scenery:true,
})



createItem("box", CONTAINER(true), LOCKED_WITH([]), {
  examine:function() {
    msg("It is large, wooden box. It does not look very substantial, but it survived the fall nevertheless. There is a label on the {ifNot:box:closed:open }lid.")
    if (!this.closed) msg(lang.look_inside(w.me, this))
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
      tmsg("One of the problems when playing - and when authoring - a text adventurer is deciding how a command should be phrased (a problem known as \"guess the verb\". Are we going to CROWBAR THE SHED or LEVER OPEN THE DOOR or what? Sometimes it takes some experimenting, though sometimes the text will give you a hint.")
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
    // !!!
  },
})

createItem("shed_door", {
  examine:"The shed is metal, a kind of beige colour{if:shed_door:locked:; the door is padlocked... but the padlock does not look that strong}.",
  loc:"garden",
  locked:true,
  scenery:true,
  crowbar:function() {
    if (!this.locked) return failedmsg("The padlock is already off the lock.")
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
  east:new Exit("garden", { alsoDir:['out']}),
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
      tmsg("Now we have a torch, we could take a proper look in the basement.")
      tmsg("The torch can  be turned on and off, with TURN ON TORCH or SWITCH FLASHLIGHT OFF or...")
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
    tmsg("Different systems have different ways to handle saving and loading 9and some games may not support it at all), but a good start is to type SAVE.")
    w.me.hints = 180
  },
  east:new Exit("basement"),
  west:new Exit("laboratory"),
})








createRoom("laboratory", {
  desc:"This is a laboratory of some sort. The room is full of screen and instruments, but you cannot tell what sort of science is being done here. There is a big steel door {ifNot:lab_door:locked:lying open }to the north{if:lab_door:locked:; you feel pretty sure it will be too heavy for you to open}.",
  afterFirstEnter:function() {
    if (w.me.hints < 200) {
      tmsg("Okay, so not bothering with saving...")
    }
    tmsg("The robot is a non-player character, or NPC. NPCs are common in adventure games, and may be implemented in various ways. At the simplest, the NPC will be part of the background, perhaps saying a few words to you, but not really interacting. But we can interact with the robot. We will start by talking to it.")
    tmsg("There are two approaches to conversations. We will try TALK TO with another character. Here we will do ASK and TELL. Start by asking the robot about the laboratory.")
    w.me.hints = 210
  },
  lab_door_locked:true,
  east:new Exit("secret_passage"),
  west:new Exit("office"),
  north:new Exit("reactor_room", {use:function(char) {
    if (char === w.me && w.lab_door.closed) return falsemsg("The door is too heavy for you to move.")
    if (char === w.me && w.reactor_room.reactorRunning) {
      msg("You start walking through the door to the north, but the robot stops you. 'The zeta-reactor is currently running,' he says. 'It would be dangerous for an organic person to approach it.'")
      if (w.me.hints < 250) {
        tmsg("Bother! But wait... the robot is not organic. We can send him in there to turn off the reactor.")
        tmsg("You might want to do TOPIC ROBOT at this point - you will see \"reactor\" is a new topic. You could also ASK ROBOT ABOUT REACTOR.")
        w.me.hints = 250
      }
      return false
    }
    if (char === w.robot) {
      if (w.lab_door.closed) {
        msg("The robot opens the heavy door with ease.")
        w.lab_door.closed = false
      }
      world.setRoom(w.robot, "reactor_room", "north")
      if (w.me.hints < 260) {
        msg("'I am now in the reactor room,' says the robot, his voice coming from a speaker on the wall.")
        msg("'Oh, can you hear me? describe the room.'")
        msg("'The reactor room,' says the robot. '" + w.reactor_room.desc() + "'")
        tmsg("Okay, so the robot is in the other room and apparently we can communicate with him, so we can tell him what to do.")
        w.me.hints = 260
      }
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
      msg(prefix(this, isMultiple) + lang.already(this))
      return false;
    }
    if (char.strong) {
      this.closed = false;
      this.openMsg(isMultiple, char)
      tmsg("Great, the robot could do it no trouble. Now we are on our way again.")
      w.me.hints = 240
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
    return "The reactor room is dominated by a huge zeta-reactor, extending from a sunken area some five foot below floor level, up to the ceiling. Pipes and cables of varying sizes are connected to it{if:reactor_room:reactorRunning:, and the reactor is humming with power}."
  },
  reactorRunning:true,
  south:new Exit("laboratory"),
})



createRoom("reactor", {
  examine:function() {
    return "The reactor is composed of a series of rings, hoops and cylinder arranged on a vertical axis. Some are shiny metal, other dull black, but you have no idea of the significant of any of them.{if:reactor_room:reactorRunning: An intense blue light spills ouyt from various points up it length.}"
  },
  scenery:true,
  loc:'reactor_room',
})








createRoom("office", {
  desc:function() {
    return "The office is a fair-size, dominated by a large desk, with an elderly computer sat on it. Sat behind the desk is Professor Kleinscope."
  },
  east:new Exit("laboratory"),
  afterFirstEnter:function() {
    if (w.me.hints < 200) {
      tmsg("Okay, so not bothering with saving...")
    }
    tmsg("You could tell the robot to do something and, being a robot, it would just do it. Professor Kleinscope will not.")
    tmsg("However, you can chat with him, just type TALK TO PROFESSOR KLEINSCOPE.")
    tmsg("Actually, you only need to TALK TO PROF or even just TALK TO K; Quest 6 will guess what you are referring to the Professor, as he is the only thing here beginning with a K (and in fact Quest 6 will guess it is a person you want to talk to, so as long as he is the only person with a name starting with K you will be good.")
    w.me.hints = 210
  },
})

