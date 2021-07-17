"use strict"

/*
commands.unshift(new Cmd('Charge', {
  npcCmd:true,
  regex:/^(?:charge|power) (.+)$/,
  objects:[
    {scope:parser.isHeld}
  ],
  defmsg:"{pv:item:'be:true} not something you can charge.",
}))
*/


tp.addDirective("charger_state", function() {
  if (w.charger_compartment.closed) {
    return "The compartment is closed"
  }
  const contents = w.charger_compartment.getContents()
  if (contents.length === 0) {
    return "The compartment is empty"
  }
  return "The compartment contains " + formatList(contents, {article:INDEFINITE, lastJoiner:'and'})
})


parser.isRoom =function(o) { return o.room }

commands.unshift(new Cmd('GoTo', {
  npcCmd:true,
  regex:/^(?:go to|go) (.+)$/,
  objects:[
    {scope:parser.isRoom}
  ],
  script:function(objects) {
    const room = objects[0][0]
    log(room)
    if (room === currentLocation) return failedmsg("As if by magic, you are suddenly... where you already were.")
    if (!room.room) return failedmsg("{pv:item:be:true} not a destination.", {item:room})
    for (const ex of currentLocation.getExits({excludeLocked:true})) {
      log(ex.name)
      if (room.name === ex.name) {
        log(ex.dir)
        return currentLocation[ex.dir].use(player, ex) ? world.SUCCESS : world.FAILED
      }
    }
    return failedmsg("{pv:item:be:true} not a destination you can get to from here.", {item:room})
  },
}))