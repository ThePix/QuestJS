"use strict"

createItem("me", PLAYER(), {
  loc:"lounge",
  regex:/^(me|myself|player)$/,
  examine: "Just a regular guy.",
  hitpoints:100,
  hintCounter:0,
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
  isLocatedAt:function(loc, situation) {
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
        tmsg("Look to the left, and you will see a panel; you can perform a lot of actions here without typing anything at all. In some games it is on the right, and many do not have it at all, so we will mostly ignore it, but for now click the clock icon to again wait one turn.")
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
        hint.now('northToKitchen')
        break
    }
  },
})


createRoom("kitchen", {
  desc:"The kitchen looks clean and well-equipped.",
  afterFirstEnter:function() {
    hint.now('neToGarden')
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
  eventPeriod:1,
  eventIsActive:function() {
    return (w.me.loc === this.name)
  },
  eventScript:function() {
    if (w.flashlight.switchedon && !this.flag1) hint.now('turnOnLight')
    if (!w.flashlight.switchedon && w.light_switch.switchedon && !this.flag2) hint.now('getAll')
    if (parser.currentCommand.all && hint.before('moveCrates')) hint.now('moveCrates')
  }
});

createItem("light_switch", SWITCHABLE(false), {
  loc:"basement",
  examine:"A switch, presumably for the light.",
  regex:/^light|switch/,
})

createItem("crates", {
  loc:"basement", 
  examine:"A bunch of old crates.",
  pronouns:lang.pronouns.plural,
  move:function() {
    if (!this.moved) {
      msg("You move the crates... And find a passage was hidden behind them.")
      hint.now("enterPassage")
      this.moved = true
      return true
    }
    else {
      msg("You feel pretty sure moving the crates again will not reveal any more hidden doors.")
      return false
    }
  },
  take:function(options) {
    msg('The crates are too heavy to pick... But you might be able to move them.')
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
  take:function(options) {
    msg('The cobwebs just disintegrate when you try to take them.')
    return false
  },    
  scenery:true,
});

createItem("old_newspaper", TAKEABLE(), READABLE(), {
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
    hint.now('getHat')
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
        w.me.moveChar(this)
        return true
      }
    },
  }),
  smell:function() {
    msg("You can smell the freshly-cut grass!")
    if (hint.before('xBox')) {
      tmsg("You can also smell specific items, so SMELL GRASS would have also worked.")
      msg("A large wooden box falls from the sky! Miraculously, it seems to have survived intact.")
      tmsg("The box is a container, which means you can put things inside it and maybe find things already in it. Perhaps we should start by looking at it.")
      w.box.loc = "garden"
      hint.now('xBox')
    }
  },
})

createItem("hat", WEARABLE(), {
  examine:"It is straw boater, somewhat the worse for wear.",
  loc:"garden",
  afterMove:function(options) {
    if (!this.flag1 && options.toLoc === 'me') hint.now('wearHat')
  },
  afterWear:function() {
    if (!this.flag2) hint.now('xGrass')
  },
})


createItem("grass", {
  examine:function() {
    msg("The grass is green, and recently cut.")
    hint.now('smell')
  },
  loc:"garden",
  scenery:true,
  smell:function() {
    msg("You can smell the grass; it has just been cut!")
    if (hint.before('xBox')) {
      tmsg("You can also smell the whole location, so just SMELL would have also worked.")
      msg("A large wooden box falls from the sky! Miraculously, it seems to have survived intact.")
      tmsg("The box is a container, which means you can put things inside it and maybe find things already in it. Perhaps we should start by looking at it.")
      w.box.loc = "garden"
      hint.now('xBox')
    }
  },
})








createItem("box", READABLE(), CONTAINER(true), LOCKED_WITH([]), {
  examine:function() {
    const tpParams = {char:player, container:this}
    tpParams.list = this.listContents(world.LOOK)
    msg("It is large, wooden box. It does not look very substantial, but it survived the fall nevertheless. There is a label on the {ifNot:box:closed:open }lid.")
    if (!this.closed) msg(lang.look_inside_it, tpParams)
    if (!this.flag2) hint.now('readBox')
  },
  regex:/crate|label|lid/,
  read:function() {
    msg("The label says: \"The Hat and Crowbar Company - exchanging hats for crowbars since 2020.\"")
    hint.now('openBox')
    this.locked = false
  },
  msgClose:"You close the lid.",
  afterClose:function() {
    if (this.loc && w.hat.loc === 'box' && w.crowbar.loc !== 'box') {
      msg(" 'Thank you for your custom!' says the box. It starts to shake violently then leaps into the air, rapidly disappearing from sight.")
      hint.now("crowbar")
      this.loc = false
    }
    else {
      msg("'Hey!' exclaims a voice from the box, 'where's my hat?' The lid flips back open.")
      this.closed = false
    }
  },
})


createItem("crowbar", TAKEABLE(), {
  examine:"A cheap plastic crowbar; it is red, white, blue and yellow.",
  loc:"box",
  afterMove:function(options) {
    if (options.toLoc === 'me') hint.now("hatInBox")
  },
  use:function(options) {
    if (options.char.loc === 'laboratory' && w.lab_door.locked) {
      msg("The crowbar is not going to help open that door.")
      tmsg("Nice try, but you have to get the robot to open this door, not the crowbar.")
      return false
    }
    if (options.char.loc === 'office' && w.lab_door.locked) {
      msg("Use it on what?")
      return false
    }
    if (options.char.loc !== 'garden') return falsemsg("There is nothing to use the crowbar on here.")
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
    hint.now("getTorch")
  },
  west:new Exit("garden", { alsoDir:['out']}),
})



createItem("flashlight", TAKEABLE(), SWITCHABLE(false, 'providing light'), {
  loc:"shed",
  scenery:true,
  examine:"A small red torch.",
  synonyms:['torch'],
  lightSource:function() {
    return this.switchedon ? world.LIGHT_FULL : world.LIGHT_NONE;
  },
  afterMove:function(options) {
    if (!this.flag1 && options.toLoc === 'me') {
      hint.now("torchOn")
      w.cobwebs.loc = 'basement'
    }
    this.flag1 = true
  },
});






createRoom("secret_passage", {
  desc:"The passage heads west.",
  afterFirstEnter:function() {
    if (w.me.alreadySaved) {
      tmsg("I {i:was} going to go though saving and loading at this point, but you've done that already, so we'll just press on.")
      hint.now('westRobot')
    }
    else {
      hint.now('save')
    }
  },
  east:new Exit("basement"),
  west:new Exit("laboratory"),
})








createRoom("laboratory", {
  desc:"This is a laboratory of some sort. The room is full of screens and instruments, but you cannot tell what sort of science is being done here. There is a big steel door {ifNot:lab_door:closed:lying open }to the north{if:lab_door:closed:; you feel pretty sure it will be too heavy for you to open}.",
  afterFirstEnter:function() {
    if (hint.before('saveGame')) tmsg("Okay, so not bothering with saving...")
    hint.now("robot")
  },
  afterEnter:function() {
    //hint.now("rGoNorth")
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
      w.robot.moveChar(this)
      return true
    }
    w.me.moveChar(this)
    return true
  }}),
})

createItem("lab_door", OPENABLE(false), {
  examine:"A very solid, steel door.",
  loc:'laboratory',
  open:function(options) {
    if (!this.closed) {
      msg(lang.already, {item:this})
      return false;
    }
    if (options.char.strong) {
      this.closed = false;
      msg(this.msgOpen, tpParams)
      hint.now("northToReactor")
      return true
    }
    else {
      msg('The door is too heavy to open.')
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
        hint.now("getRod")
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
    hint.now("rGetRod")
  }  
})



createRoom("reactor", CONTAINER(false), {
  examine:function() {
    return "The reactor is composed of a series of rings, hoops and cylinders arranged on a vertical axis. Some are shiny metal, other dull black, but you have no idea of the significant of any of them.{if:reactor_room:reactorRunning: An intense blue light spills out from various points up it length.}"
  },
  loc:'reactor_room',
  testDropIn:function(options) {
    if (options.item === w.control_rod) return true
    msg("That cannot go in there!")
    return false
  },
  afterDropIn:function(options) {
    if (w.control_rod.loc === this.name) {
      msg("The reactor starts to glow with a blue light, and you can hear it is now buzzing.")
      w.reactor_room.reactorRunning = true
      hint.now("useLift")
    }
  },
})

createItem("vomit", {
  examine:"You decide against looking too closely at the vomit, but it occurs to you that perhaps you should tell the robot about it.",
  scenery:true,
})

createItem("control_rod", TAKEABLE(), {
  examine:"The control rod is about two foot long, and a dull black colour.",
  take:function(options) {
    const tpParams = {char:char, item:this}
    if (this.isAtLoc(char.name)) {
      msg(lang.already_have, tpParams);
      return false;
    }
    if (!char.testManipulate(this, "take")) return false;
    
    if (char === w.me) {
      msg("As you go to grab the control rod, a recorded message says: 'Warning: Control rod is highly zeta-active. Handling will result in instant death.' You decide upon reflection that you do not want to pick it up that much.")
      hint.now("backToRobot")
      return false 
    }
    let flag = (this.loc === "reactor")
    msg(lang.take_successful, tpParams)
    this.moveToFrom(options, "name")
    if (flag) {
      msg("The blue light in the reactor winks out and the buzz dies.")
      w.reactor_room.reactorRunning = false
    }
    hint.now("rRInR")
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
    w.me.moveChar(this)
  }}),
  out:new Exit("garden", {
    use:function() {
      if (!w.office_window.smashed) falsemsg("There is a pane of glass in the way.")
      if (!w.rope.locs.includes('outside')) {
        msg("You look out the window. If is a long way down to the ground, and there are no hand-holds. You need a way to climb down.")
        hint.now('climbOut')
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
    hint.now("useComputer")
  },
})

createItem("office_window", {
  examine:function() {
    if (this.smashed) {
      msg("The window is tall and wide... and smashed.")
    }
    else {
      msg("The window is tall and wide; it does not look like it will open.")
    }
    if (!this.lookedout) {
      tmsg("You might want to try LOOK OUT WINDOW; may be more interesting than the window itself.")
      this.lookedout = true
    }
  },
  loc:'office',
  scenery:true,
  outside:[],
  lookout:function() {
    let s = 'Out of the window you can see the street at the front of the house. Your black SUV is parked at the side on the road.'
    if (this.outside.length > 0) s += ' On the street below the house you can see ' + formatList(this.outside, {article:DEFINITE, lastJoiner:lang.list_and}) + '.'
    msg(s)
  },
  smash:function() {
    if (this.smashed) {
      return falsemsg("The window is already smashed.")
    }
    else if (w.old_newspaper.fist_wrapped) {
      msg("With your fist wrapped in the old newspaper, you punch it through the window, breaking the glass. You take a moment to knock away the remaining jagged shards in the frame.")
      this.smashed = true
      hint.now('out')
      return true
    }
    else {
      msg("You are about to put your fist through the window when it occurs to you that your hand will get ripped to shreds by the glass fragments, and you really do not want to leave DNA evidence here. It is definitely not that you hate the sight of blood.")
      hint.now('wrapFist')
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
      item.loc = false
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


createItem("postit_note", TAKEABLE(), READABLE(), {
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
  afterPostureOn:function(options) {
    if (w.Professor_Kleinscope.loc === 'office' && options.posture === 'sit') {
      msg("'Making yourself at home, I see...' notes Professor Kleinscope.")
    }
  },
  testPostureOn:function(options) {
    if (w.Professor_Kleinscope.flag && options.posture === 'sit') return true
    if (options.posture === 'sit') return falsemsg("You think about " + options.posture + " on the chair, but are unsure how Professor Kleinscope feel about it - given he is already sat on it.")
    if (w.Professor_Kleinscope.loc === 'office' && options.posture === 'stand') {
      msg("'I'd rather you kept your feet {i:off} the furniture,' says Professor Kleinscope crossly.")
    }    
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
      hint.now("talkProf")
    }
    else if (w.Professor_Kleinscope.loc === 'office') {
      msg("You reach a hand out to the keyboard. 'Hands off!' insists the Professor.{once: 'I have some very important files on there, and I don't want the likes of you messing with them.'}")
      tmsg("I have a feeling if we just wait a few turns Kleinscope will head off and look for his dinner.")
    }
    else {
      msg("You press a key on the keyboard, and a message appears on the screen: 'Please input your six digit PIN.'")
      askText("PIN?", function(result) {
        if (result === w.computer.code) {
          msg("You type \"" + result + "\", and unlock the computer. You put in your USB stick, and download the files... It takes nearly twenty minutes; this is one slow computer.")
          if (hint.before('smashWindow')) {
            tmsg("Cool, you found the number without any prompting from me.")
          }
          msg("As you remove the USB stick, an alarm sounds, and you hear a voice: 'Warning: Illegal access to USB port detected. Warning: Illegal access to USB port detected.'")
          tmsg("Who knew such an old computer would be protected like that? The Professor will be here soon, coming up the lift. You need to find another way out. How about the window?")
          tmsg("I've held you hand for long enough, let's see if you can do this on your own - but remember, you can use the HINT command if you are stuck.")
          if (w.old_newspaper.loc !== 'me' && w.rope.isAtLoc('me') && w.old_newspaper.loc !== 'office' && !w.rope.isAtLoc('office')) {
            tmsg("That said, I see you lost the newspaper and the rope somewhere. First rule of playing adventure games; never leave anything behind unless you have to. Through the magical power of Tutorial-Guy, I will summon them here for you, just on the off-chance they will be needed.")
            w.old_newspaper.loc = 'office'
            w.rope.locs = ['office']
            w.rope.tiedTo1 = false
            w.rope.tiedTo2 = false
          }
          else if (w.old_newspaper.loc !== 'me' && w.old_newspaper.loc !== 'office') {
            tmsg("That said, I see you lost the newspaper somewhere. First rule of playing adventure games; never leave anything behind unless you have to. Through the magical power of Tutorial-Guy, I will summon it here for you, just on the off-chance it will be needed.")
            w.old_newspaper.loc = 'office'
          }
          else if (!w.rope.isAtLoc('me') && !w.rope.isAtLoc('office')) {
            tmsg("That said, I see you lost the rope somewhere. First rule of playing adventure games; never leave anything behind unless you have to. Through the magical power of Tutorial-Guy, I will summon it here for you, just on the off-chance it will be needed.")
            w.rope.locs = ['office']
            w.rope.tiedTo1 = false
            w.rope.tiedTo2 = false
          }
          
          hint.now('smashWindow')
          w.office.lift_exit_locked = true
        }
        else {
          msg("You type \"" + result + "\", but it fails to unlock the computer.")
          hint.now("findCode")
        }
      })
    }
  },
})



createRoom("lift", TRANSIT("east"), {
  regex:/elevator/,
  desc:function() {
    return "The lift is small; according the plaque it is limited to just three people. There are three buttons, labelled one to three. A label above indicates the lift is at \"{transitDest}\"."
  },
  east:new Exit("laboratory"),
  afterFirstEnter:function() {
    hint.now("press3")
  },
  testTransit:function() {
    if (!w.reactor_room.reactorRunning) {
      msg("The lift does not seem to be working.")
      hint.now("askRLift")
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
  afterTransitMove:function(transitDest, exitName) {
    if (transitDest === 'office') hint.now("eastOffice")
  }
})

createItem("button_3", TRANSIT_BUTTON("lift"), {
  alias:"Button: 3",
  examine:"A button with the letter 3 on it.",
  transitDest:"office",
  title:'Level 3: Office',
  transitAlreadyHere:"You press the button; nothing happens.",
  transitGoToDest:"You press the button; the door closes and the lift ascends.",
})

createItem("button_2", TRANSIT_BUTTON("lift"), {
  alias:"Button: 2",
  examine:"A button with the letter 2 on it.",
  title:'Level 2: Lounge',
  transitDest:"lounge",
  transitAlreadyHere:"You press the button; nothing happens.",
  transitGoToDest:"You press the button; the door closes and the lift moves.",
})

createItem("button_1", TRANSIT_BUTTON("lift"), {
  alias:"Button: 1",
  examine:"A button with the letter 1 on it.",
  title:'Level 1: Laboratory',
  transitDest:"laboratory",
  transitAlreadyHere:"You press the button; nothing happens.",
  transitGoToDest:"You press the button; the door closes and the lift descends.",
})

