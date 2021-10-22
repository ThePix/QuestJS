"use strict"

settings.title = "Star Quest"
settings.author = "The Pixie"
settings.version = "0.1"
settings.thanks = []
settings.warnings = "No warnings have been set for this game."
settings.playMode = "dev"

settings.compassPane = false
settings.panesCollapseAt = 0
settings.themes = ['sans-serif']
settings.styleFile = 'style'
settings.files = ["code", "data", "crew", "page", "stars", "missions"]
settings.tests = true
settings.noTalkTo = false
settings.iconsFolder = false

settings.onView = function(item) { return w.ship.onView === item.name && currentLocation === w.bridge }
settings.pageOption = function(item) { return item.pageOption }
settings.inventoryPane = [
//  {name:'Items Held', alt:'itemsHeld', test:settings.isHeldNotWorn, getLoc:function() { return player.name; } },
  {name:'On Viewscreen', alt:'itemsView', test:settings.onView },
  {name:'Your PAGE', alt:'pageOptions', test:settings.pageOption },
  {name:'People Here', alt:'itemsHere', test:settings.isHere, getLoc:function() { return player.loc; } },
]

settings.favicon = 'assets/icons/sq.png'

settings.funcForDynamicConv = 'showMenuDiag'

settings.status = [
  function() { return "<td>Stardate:</td><td>" + w.ship.getDateTime() + "</td>"; },
  function() { return "<td>Alert:</td><td>" + w.ship.getAlert() + "</td>"; },
  function() { return "<td>System:</td><td>" + stars.getSystem().alias + "</td>"; },
  function() { return "<td>Location:</td><td>" + stars.getLocation().alias + "</td>"; },
  function() { return "<td>Hull:</td><td>" + w.ship.hullIntegrity + "%</td>"; },
  function() { return "<td>Shields:</td><td>" + w.ship.getShields() + "</td>"; },
]

settings.libraries.push('image-pane')
settings.imageStyle = {
  right:'0',
  top:'200px',
  width:'400px',
  height:'400px',
  'background-color':'#111', 
  border:'3px black solid',
}

settings.roomCreateFunc = function(o) {
  if (o.dests) {
    for (const ex of o.dests) {
      ex.origin = o
      ex.dir = 'to ' + (o.dirAlias ? o.dirAlias : o.alias)
    }
  }
}

settings.setup = function() {
  
  createAdditionalPane(1, "Go to", 'directions', function() {
    let html = ''
    for (const ex of currentLocation.dests) {
      const dest = w[ex.name]
      html += '<div style="margin-bottom: 10px;"><p class="item" onclick="runCmd(\'go to ' + dest.alias.toLowerCase() + '\')">' + dest.headingAlias + '</p></div>'
    }
    return html
  })
  
  
  msg("You step on to the bridge. 'Welcome aboard, sir,' says a blonde woman in a red uniform, handing you a PAGE. 'I'm Yeoman Rand, I've been designated as your aide. The ship is all set, sir. We just need to to appoint the bridge officers. I believe Command has prepared a short list on your PAGE.'")
  msg("'Thank you, yeoman.'")
  msg("'Can I ask what our mission is, sir?'")
  msg("'We're being sent to Sector 7 Iota.'")
  msg("'That's a long way out, sir. What do they want us to do there? Anything to do with the Brakk?'")
  msg("'I was just told to report to the Starbase. Beyond that... you know as much as I do, yeoman. Hopefully we'll not be close enough to the border to encounter any Brakk ships.'")
  if (settings.playMode !== 'dev') wait()
  
  metamsg("If this is your first play through - or you just want a reminder of how to get going - you might want to look at the {cmd:intro1:introductory text}, see {cmd:intro2:how to start} or look at the {cmd:intro3:further notes}.")
  if (settings.playMode !== 'dev') wait()
  stars.draw('stardock')
}



settings.updateCustomUI = function() {
  const encyc = Array.from(document.getElementsByClassName('item')).filter(el => el.innerHTML === 'Encyclopedia')[0]
  encyc.onclick = function() { askDiag("Search the web", w.encyclopedia.askDiag, "Submit") }
  
}



settings.startingDialogTitle = "Crew Roster"
settings.startingDialogWidth = 500
settings.startingDialogHeight = 480
settings.startingDialogOnClick = function() {
  // ...
}
settings.startingDialogInit = function() {
  //document.querySelector('#namefield').focus()
}

settings.startingDialogOnClick = function() {
  settings.startingDialogEnabled = true
  if (settings.dialogType === 'crew roster' && !w.ship.arrivedAtSector) {
    const npc = w[document.querySelector("#diag-name").value]

    for (let role of roster.data) {
      const assignedNpc = roster.getOfficer(role.name)
      //log(assignedNpc)
      if (assignedNpc && assignedNpc !== npc) continue
      if (document.querySelector("#diag-" + role.name).checked) {
        w.ship[role.name] = npc.name
      }
      else {
        w.ship[role.name] = false
      }
    }
    const roles = roster.getRoles(npc)
    if (roles.length === 0) {
      msg("You assign no positions to " + npc.alias + ".")
    }
    else {
      msg("You assign " + formatList(roles) + " to " + npc.alias + ".")
    }
    if (roles.length === 0 && npc.loc) {
      npc.loc = false
      msg(npc.leaving, {char:npc})
      io.updateUIItems()
    }
    if (roles.length !== 0 && !npc.loc) {
      npc.loc = 'bridge'
      msg(npc.entering, {char:npc})
      io.updateUIItems()
    }
    delete settings.dialogType
  }
}        

