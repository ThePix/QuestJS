"use strict"















createItem("me", PLAYER(), {
  loc:"lobby",
  synonyms:["me", "myself", "player"],
  examine: "Just a regular guy.",
})


createItem('cloak', WEARABLE(), {
  examine:'The cloak is black... Very black... So black it seems to absorb light.',
  worn:true,
  loc:'me'
})





createRoom("lobby", {
  desc:"There is something oppressive about the {cloakHere:dark:dingy} {once:room:foyer}; a presence in the air that almost suffocates you. It's former glory has all but faded; the walls still sport old posters from productions that ended over twenty years ago. Paint is peeling, dust is everywhere and it smells decidedly musty. You can see doors to the north, west and south.",
  beforeFirstEnter:function() {
    msg ("You hurry through the night, keen to get out of the rain. Ahead, you can see the old opera house, a brightly-lit beacon of safety.")
    msg ("Moments later you are pushing though the doors into the foyer. Now that you are here it does not seem so bright. The doors close behind you with an ominous finality...")
    msg ("")
  },
  north:new Exit('lobby', { use:function() {
    msg('You try the doors out of the opera house, but they are locked. {once:{i:How did that happen?} you wonder.}')
    return false
  }}),
  west:new Exit('cloakroom'),
  south:new Exit('bar'),
  smell:'It smells of damp and neglect in here.',
})


createItem('posters', {
  examine:'The posters are ripped and peeling off the wall.',
  read:'You spend a few minutes reading about the shows they put on twenty-odd years ago.... {i:Die Zauberflöte}... {i:Guillaume Tell}... {i:A Streetcar Named Desire}. Wasn\'t that a play?',
  scenery:true,
  plural:true,
  loc:'lobby'
})






createRoom("cloakroom", {
  desc:function() {
    let s = "The cloakroom is {cloakHere:dimly:brightly} lit, and is little more than a cupboard. "
    if (w.cloak.isAtLoc('hook')) {
      s = s + "Your cloak is hung from the only hook."
    }
    else if (w.cloak.isAtLoc(this)) {
      s = s + "There is a single hook, which apparently was not good enough for you, to judge from the cloak on the floor."
    }
    else {
      s = s + "There is a single hook, which strikes you as strange for a cloakroom."
    }
    return s + " The only way out is back to the east. "
  },
  east:new Exit('lobby'),
})


createItem('hook', SURFACE(), {
  synonyms:["peg"],
  hookable:true,
  scenery:true,
  examine:function() {
    if (w.cloak.isAtLoc('hook')) {
      msg("An ornate brass hook, with a cloak hanging from it.")
    }
    else {
      msg("An ornate brass hook, ideal for hanging cloaks on.")
    }
  },
  loc:'cloakroom'
})







createRoom("bar", {
  desc:function() {
    if (cloakHere()) {
      return "It is too dark to see anything except the door to the north."
    }
    else {
      return "The bar is dark, and somehow brooding. It is also thick with dust. So much so that someone has scrawled a message in the dust on the floor. The only exit is north."
    }
  },
  beforeEnter:function() {
    w.message.visible = !cloakHere()
  },
  afterExit:function() {
    w.message.count = 0
  },
  north:new Exit('lobby'),
  smell:'There is a musty smell, but behind that, something else, something that reminds you of the zoo, perhaps?',
  listen:'Is there something moving?',
})


createItem('message', {
  synonyms:["writing", "note", "dust"],
  count:0,
  disturbed:0,
  scenery:true,
  loc:'bar',
  examine:function() {
    if (cloakHere()) {
      msg ("You cannot see any message, it is too dark.")
      return
    }
    if (this.disturbed < 3) {
      msg ("The message in the dust says 'You have won!'")
    }
    else {
      msg ("The message in the dust says 'You have lost!'")
    }
    io.finish()
  },
  read:function() { this.examine() },
  eventPeriod:1,
  eventIsActive:function() { return player.isAtLoc('bar') && !io.finished },
  eventScript:function() { 
    this.count++
    if (this.count > 1) {
      if (this.disturbed === 0) {
        msg ("You think it might be a bad idea to disturb things in the dark.")
      }
      else {
        if (!player.suppress_background_sounds) {
          msg ("You can hear {random:scratching:something moving in the dark:rasping breathing}.")
        }
      }
      this.disturbed++
    }
  },
})









createItem('walls', {
  examine:function() {
    if (cloakHere() && player.isAtLoc('bar')) {
      msg("It is too dark to see the walls.")
    }
    else {
      msg("The walls are covered in a faded red and gold wallpaper, that is showing signs of damp.")
    }    
  },
  scenery:true,
  isLocatedAt:function(loc) { return w[loc].room },
})

createItem('ceiling', {
  examine:function() {
    if (cloakHere() && player.isAtLoc('bar')) {
      msg("It is too dark to see the ceiling.")
    }
    else {
      msg("The ceiling is - or was - white. Now it is a dirty grey.")
    }    
  },
  scenery:true,
  isLocatedAt:function(loc) { return w[loc].room },
})

createItem('floor', {
  synonyms:["carpet"],
  examine:function() {
    if (cloakHere() && player.isAtLoc('bar')) {
      msg("It is too dark to see the floor.")
    }
    else {
      msg("A red carpet covers the floor, worn almost though in places.")
    }    
  },
  scenery:true,
  isLocatedAt:function(loc) { return w[loc].room },
})

createItem('doors', {
  examine:function() {
    if (cloakHere() && player.isAtLoc('bar')) {
      msg("It is too dark to see the door properly.")
    }
    else {
      msg("All the doors are wooden, and painted white.")
    }    
  },
  scenery:true,
  isLocatedAt:function(loc) { return w[loc].room },
})

