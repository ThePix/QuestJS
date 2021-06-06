"use strict"


const cloakHere = function() {
  if (w.cloak.isAtLoc('me')) return true
  if (w.cloak.isHere()) return true
  if (w.cloak.isAtLoc('hook') && player.isAtLoc('cloakroom')) return true
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



commands.push(new Cmd('HangUp', {
  regex:/^(?:hang up|hang) (.+)$/,
  objects:[
    {scope:parser.isHeld},
  ],
  script:function(objects) {
    if (!objects[0][0].isAtLoc(player)) {
      return failedmsg ("You're not carrying {sb:obj}.", {obj:objects[0][0]})
    }
    else if (objects[0][0].worn) {
      return failedmsg ("Not while you're wearing {sb:obj}!", {obj:objects[0][0]})
    }
    else if (!player.isAtLoc('cloakroom')) {
      return failedmsg ("Hang {sb:obj} where, exactly?", {obj:objects[0][0]})
    }
    else {
      objects[0][0].moveToFrom(player, w.hook)
      msg ("You hang {nm:obj:the} on the hook.", {obj:objects[0][0]})
      return world.SUCCESS
    }
  }  
}))



commands.push(new Cmd('HangUp', {
  regex:/^(?:hang up|hang) (.+) on (?:|the )hook$/,
  objects:[
    {scope:parser.isHeld},
  ],
  script:function(objects) {
    const options = {char:player, toLoc:'hook', item:objects[0][0]}
    if (!objects[0][0].isAtLoc(player)) return failedmsg ("You're not carrying {sb:item}.", options)
    if (objects[0][0].worn) return failedmsg ("Not while you're wearing {sb:item}!", options)
    if (!player.isAtLoc('cloakroom')) return failedmsg ("Hang {sb:item} where, exactly?", options)

    objects[0][0].moveToFrom(options, w.hook)
    msg ("You hang {nm:item:the} on the hook.", options)
    return world.SUCCESS
  }  
}))


