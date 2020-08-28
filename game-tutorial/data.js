"use strict"

createItem("me", PLAYER(), {
  loc:"lounge",
  regex:/^(me|myself|player)$/,
  examine: "Just a regular guy.",
  hitpoints:100,
})

createRoom("lounge", {
  desc:"This is the first room, and this text is telling you about it. If there were things here, you would probably be told about, but we will come on to that later. You will also be told of any exits. This room has an exit north{if:kitchen_door:locked:, but it is currently locked}.",
  afterFirstEnter:function() {
    metamsg("Before going any further, we should look at what is on the screen. Below this text, you should see a cursor. In this game it is a > sign, but other games might use different symbols or have a box. You type commands in there. Try it now by typing WAIT (I am going to put command for you to type in capitals; you do not need to).")
  },
  north:new Exit("kitchen"),
  eventPeriod:1,
  eventActive:true,
  eventCount:0,
  eventScript:function() {
    this.eventCount++
    switch (this.eventCount) {
      case 1:
        metamsg("Typing WAIT made time pass in the game, while the player-character did nothing. You can also just type Z, which is a shortcut for WAIT.")
        metamsg("Look to the left, and you will see a panel; you can perform a lot of actions here without typing anything at all. In some games it is on the right, and many do not have it at all, so we will mostly ignore it, but for now click the \"Z\" to again wait one turn.")
        break
      case 2:
        metamsg("Some games have commands that tell you about the game or set it up differently to suit the player. In Quest 6 (but not necessarily other games) none of these count as a turn, so try a couple, and when you are done, do WAIT again.")
        metamsg("Type DARK to toggle dark mode; some users find if easier to see light text on a dark background. Type SPOKEN to toggle hearing the text read out. Type SILENT to toggle the sounds and music.")
        metamsg("You can also type HELP to see some general instructions (but you are doing the tutorial, so no point in this game. You can also do ABOUT or CREDITS.")
        break
      case 3:
        w.kitchen_door.locked = false
        metamsg("Time to move on. Something tells me that door to the north is not locked any more.")
        metamsg("You might want to look at the room again before we going. Just type LOOK or just L. Hopefully it no longer says the door is locked.")
        metamsg("Movement in adventure games is done following compass directions. To go north, type GO NORTH, or just NORTH or just N.")
        metamsg("You can also use the compass rose at the top left, or, in Quest 6, if your computer has a number pad, ensure \"Nu, Lock\" is on, and press the up key (i.e., 8).")
        metamsg("So I will see you in the next room...")
        break
    }
  },
})


createRoom("kitchen", {
  desc:"This is the second room.",
  afterFirstEnter:function() {
    metamsg("Great, we can move around!")
    metamsg("From here we can go back south to the lounge. General in yuou enter a room from one direction you will be able to go back that way, but not always.")
    metamsg("As well as going north, south, east and west, you can also go along the diagonals, as well as up and down, and in and out. The room has a basement you can go DOWN to and a larder you can go IN. Try moving with the compass rose; note how the buttons change depending on the available exits.")
    metamsg("The tutorial continues in the garden to the northeast (type NORTHEAST or just NE).")
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
  desc:"The basement is dark and full of cobwebs. The only way out is back up the ladder.",
  up:new Exit("kitchen"),
})

createRoom("larder", {
  desc:"Oh, dear, the larder is empty!",
  out:new Exit("kitchen"),
})


createRoom("garden", {
  desc:"The garden is basically a few square feet of grass.",
  southwest:new Exit("kitchen"),
  afterFirstEnter:function() {
    metamsg("Let's interact with something!")
    metamsg("There is a hat here. You know that because the description tells you, and also it is listed in the panel at the left. To get the hat, type GET HAT or TAKE HAT. Once you are carrying it, type WEAR HAT to put it on (or PUT ON HAT or DON HAT, as you prefer)")
  },
})

createItem("hat", WEARABLE(), {
  examine:"It is straw boater, somewhat the worse for wear.",
  loc:"garden",
  afterWear:function() {
    if (!this.flag) {
      metamsg("You look very fetching in that hat!")
      metamsg("You should see the hat listed as worn in the panel to the left now.")
      metamsg("It is always worthwhile examining an object as it might give you a clue about what it is for. You can examine the hat by typing EXAMINE HAT, LOOK AT HAT or just X HAT. Or click on it in the panel, and select \"Examine\" from the menu.")
      metamsg("You don't need to pick something up to look at it, and there may be things hidden in the location description that can be examined (or even picked up). The description for this room mentioned the grass, what happens if you examine that?")
    }
    this.flag = true
  },
})


createItem("grass", {
  examine:function() {
    msg("The grass is green, and recently cut.")
    if (!this.flagged) {
      metamsg("To be honest, you will come across things mentioned in descriptions that the author has not implemented, and the game will just tell you it does not know what you are talking about (like the cobwebs in the basement), but in an ideal world you will be able to examine everything.")
      msg("A large wooden box falls from the sky! Miraculously, it sees to have survived in tact.")
      metamsg("The box is a container, which means you can put thinks inside it. You can put the hat in it by typing PUT HAT IN BOX. You will need to take the hat off first...")
      w.box.loc = "garden"
    }
  },
  loc:"garden",
  scenery:true,
})


createItem("box", CONTAINER(true), {
  examine:"It is large, wooden box. It does not look very substantial, but it survived the fall nevertheless.",
  loc:"garden",
  putInResponse:function() {
    if (!this.flag && w.hat.loc === 'box') {
      metamsg("Cool... Wait, does that mean you're now naked?")
    }
    this.flag = true
  },
})
