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
