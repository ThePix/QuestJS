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
settings.files = ["code", "commands", "crew", "page", "data", "stars", "missions"]
settings.tests = true
settings.noTalkTo = false

settings.onView = function(item) { return w.ship.onView === item.name }
settings.inventoryPane = [
  {name:'Items Held', alt:'itemsHeld', test:settings.isHeldNotWorn, getLoc:function() { return player.name; } },
  {name:'People Here', alt:'itemsHere', test:settings.isHere, getLoc:function() { return player.loc; } },
  {name:'On Viewscreen', alt:'itemsView', test:settings.onView },
]




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


settings.setup = function() {
  msg("You step on to the bridge. 'Welcome aboard, sir,' says a blonde woman in a red uniform, handing you a PAGE. 'I'm Yeoman Rand, I've been designated as your aide. The ship is all set, sir. We just need to to appoint the bridge officers. I believe Command has prepared a short list on your PAGE.'")
  msg("'Thank you, yeoman.'")
  msg("'Can I ask what our mission is, sir?'")
  msg("'We're being sent to Sector 7 Iota.'")
  msg("'That's a long way out, sir. What do they want us to do there? Anything to do with the Brakk?'")
  msg("'I was just told to report to the Starbase. Beyond that... you know as much as I do, yeoman. Hopefully we'll not be close enough to the border to encounter any Brakk ships.'")
  if (settings.playMode !== 'dev') wait()
  
  metamsg("Assemble your crew by assigning candidates to posts on the bridge using your PAGE. Then ask the helmsman to lay in a course for sector 7 Iota. You will need a helmsman, but other posts can be left empty if you wish. You can assign officers to multiple roles, but will be less effective in both roles. Some candidates are better suited to a post than others, but it is up to you; if you want to appoint people to posts that will be poor at, go for it! Note that once you set off for Sector 7 Iota you cannot change assignments.")
  metamsg('The crew will call you "Sir". If you prefer "Ma\'am", tell the yeoman.')
  metamsg("Once you arrive at Sector 7 Iota, you will get a list of missions. You will need to prioritize. In most cases it takes about a day to travel between locations in the sector, but some locations are further out and will take longer; this will be noted in the mission. Obviously it will take a similar time to get back to a location in the central cluster.")
  metamsg("As captain, your job is to tell others what to do - you are too value to the ship to risk on away missions.")
  metamsg("If your screen is wide enough, you will see a star man on the right, but you do not need it to play the game. When you arrive in sector 7 Iota you will be able to toggle between  map of the stars in the sector and the star system you are currently at.")
  metamsg("Any similarity to a certain series from the sixties... and several other decades... is entirely coincidental. Honest.")
  if (settings.playMode !== 'dev') wait()
  stars.draw('stardock')
}


settings.startingDialogTitle = "Crew Roster"
settings.startingDialogWidth = 500
settings.startingDialogHeight = 480
settings.startingDialogOnClick = function() {
  // ...
}
settings.startingDialogInit = function() {
  //$('#namefield').focus()
}

settings.startingDialogOnClick = function() {
  settings.startingDialogEnabled = true
  const npc = w[$("#diag-name").val()]

  for (let role of roster.data) {
    const assignedNpc = roster.getOfficer(role.name)
    log(assignedNpc)
    if (assignedNpc && assignedNpc !== npc) continue
    if ($("#diag-" + role.name).is(':checked')) {
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
    msg("You assign " + formatList(roles) + " " + npc.alias + ".")
  }
  if (roles.length === 0 && npc.loc) {
    npc.loc = false
    msg(npc.leaving, {char:npc})
    io.updateUIItems()
  }
  if (roles.length !== 0 && !npc.loc) {
    npc.loc = 'room'
    msg(npc.entering, {char:npc})
    io.updateUIItems()
  }
}        

