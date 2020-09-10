"use strict"











const cloakHere = function() {
  if (w.cloak.isAtLoc('me')) return true
  if (w.cloak.isHere()) return true
  if (w.cloak.isAtLoc('hook') && game.player.isAtLoc('cloakroom')) return true
  return false
}


lang.no_smell = "It smells slightly musty."

lang.no_listen = "It is quiet as the grave..."


tp.addDirective("cloakHere", function(arr, params) {
  return cloakHere() ? arr[0] : arr[1]
});

findCmd('MetaCredits').script = function() {
  metamsg('This game was created by The Pixie, following the Cloak of Darkness specification by Roger Firth.')
}

findCmd('MetaHelp').script = function() {
  metamsg('Just type stuff at the prompt!')
}






createItem("me", PLAYER(), {
  loc:"lobby",
  regex:/^(me|myself|player)$/,
  examine: "Just a regular guy.",
})


createItem('cloak', WEARABLE(), {
  examine:'The cloak is black... Very black... So black it seems to absorb light.',
  worn:true,
  loc:'me'
})





createRoom("lobby", {
  desc:"There is something oppressive about the {cloakHere:dark:dingy} {once:room}{notOnce:foyer}; a presence in the air that almost suffocates you. It's former glory has all but faded; the walls still sport old posters from productions that ended over twenty years ago. Paint is peeling, dust is everywhere and it smells decidedly musty. You can see doors to the north, west and south.",
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
  onSmell:'It smells of damp and neglect in here.',
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
  regex:/^peg$/,
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
  onExit:function() {
    w.message.count = 0
  },
  north:new Exit('lobby'),
  onSmell:'There is a musty smell, but behind that, something else, something that reminds you of the zoo, perhaps?',
  onListen:'Is there something moving?',
})


createItem('message', {
  regex:/writing|note/,
  count:0,
  disturbed:0,
  scenery:true,
  loc:'bar',
  examine:function() {
    if (cloakHere()) {
      msg ("You cannot see any message, it is too dark.")
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
  eventIsActive:function() { return game.player.isAtLoc('bar') && !this.finished },
  eventScript:function() { 
    this.count++
    if (this.count > 1) {
      if (this.disturbed === 0) {
        msg ("You think it might be a bad idea to disturb things in the dark.")
      }
      else {
        if (!game.player.suppress_background_sounds) {
          msg ("You can hear {random:scratching:something moving in the dark:rasping breathing}.")
        }
      }
      this.disturbed++
    }
  },
})









createItem('walls', {
  examine:function() {
    if (cloakHere() && game.player.isAtLoc('bar')) {
      msg("It is too dark to see the walls.")
    }
    else {
      msg("The walls are covered in a faded red and gold wallpaper, that is showing signs of damp.")
    }    
  },
  isAtLoc:function(loc, situation) {
    if (typeof loc !== "string") loc = loc.name
    return w[loc].room && situation === world.PARSER; 
  },
})

createItem('ceiling', {
  examine:function() {
    if (cloakHere() && game.player.isAtLoc('bar')) {
      msg("It is too dark to see the ceiling.")
    }
    else {
      msg("The ceiling is - or was - white. Now it is a dirty grey.")
    }    
  },
  isAtLoc:function(loc, situation) {
    if (typeof loc !== "string") loc = loc.name
    return w[loc].room && situation === world.PARSER; 
  },
})

createItem('floor', {
  regex:/^carpet$/,
  examine:function() {
    if (cloakHere() && game.player.isAtLoc('bar')) {
      msg("It is too dark to see the floor.")
    }
    else {
      msg("A red carpet covers the floor, worn almost though in places.")
    }    
  },
  isAtLoc:function(loc, situation) {
    if (typeof loc !== "string") loc = loc.name
    return w[loc].room && situation === world.PARSER; 
  },
})

createItem('doors', {
  regex:/^carpet$/,
  examine:function() {
    if (cloakHere() && game.player.isAtLoc('bar')) {
      msg("It is too dark to see the door properly.")
    }
    else {
      msg("All the doors are wooden, and painted white.")
    }    
  },
  isAtLoc:function(loc, situation) {
    if (typeof loc !== "string") loc = loc.name
    return w[loc].room && situation === world.PARSER; 
  },
})




commands.push(new Cmd('HangUp', {
  regex:/^(hang up|hang) (.+)$/,
  objects:[
    {ignore:true},
    {scope:parser.isHeld},
  ],
  script:function(objects) {
    if (!objects[0][0].isAtLoc(game.player)) {
      return failedmsg ("You're not carrying {sb:obj}.", {obj:objects[0][0]})
    }
    else if (objects[0][0].worn) {
      return failedmsg ("Not while you're wearing {sb:obj}!", {obj:objects[0][0]})
    }
    else if (!game.player.isAtLoc('cloakroom')) {
      return failedmsg ("Hang {sb:obj} where, exactly?", {obj:objects[0][0]})
    }
    else {
      objects[0][0].moveToFrom('hook')
      msg ("You hang {nm:obj:the} on the hook.", {obj:objects[0][0]})
      return world.SUCCESS
    }
  }  
}))



commands.push(new Cmd('HangUp', {
  regex:/^(hang up|hang) (.+) on (|the )hook$/,
  objects:[
    {ignore:true},
    {scope:parser.isHeld},
    {ignore:true},
  ],
  script:function(objects) {
    if (!objects[0][0].isAtLoc(game.player)) {
      return failedmsg ("You're not carrying {sb:obj}.", {obj:objects[0][0]})
    }
    else if (objects[0][0].worn) {
      return failedmsg ("Not while you're wearing {sb:obj}!", {obj:objects[0][0]})
    }
    else if (!game.player.isAtLoc('cloakroom')) {
      return failedmsg ("Hang {sb:obj} where, exactly?", {obj:objects[0][0]})
    }
    else {
      objects[0][0].moveToFrom('hook')
      msg ("You hang {nm:obj:the} on the hook.", {obj:objects[0][0]})
      return world.SUCCESS
    }
  }  
}))








