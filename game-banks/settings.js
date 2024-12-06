"use strict";


settings.playMode = 'dev'


settings.title = "The Voyages of The Joseph Banks"
settings.author = "The Pixie"
settings.version = "0.1"
settings.thanks = ["Kyle", "Lara"]
settings.warnings = 'This game does have swearing (including the F-word); it is possible to romance crew mates of either gender, but nothing graphic.'

// UI options
settings.libraries.push('shipwise')
settings.files = ["const", "code", "commands", "text", "data", "npcs", "map"]
settings.styleFile = 'style'
settings.noTalkTo = "You can talk to an NPC using either {color:red:ASK [name] ABOUT [topic]} or {color:red:TELL [name] ABOUT [topic]}."
settings.noAskTell = false
settings.givePlayerAskTellMsg = false
settings.symbolsForCompass  = true
settings.disableWaitInDevMode = true

settings.tests = true
settings.dateTime.start = new Date('April 14, 2387 09:43:00')

settings.roomTemplate = [
  "#{cap:{hereName}}",
  "{terse:{hereDesc}}",
  "{objectsHere:You can see {objects} here.}",
]


settings.saveLoadExcludedAtts.push("data")






settings.status = [
  function() { return '<td width="55px" title="You receive a bonus for collecting good data"><b>Bonus:</b></td><td width="20px"></td><td align="right"><b>$' + player.bonus + 'k</b></td>' },
  function() { return settings.statusReport(player) },
  function() { return settings.statusReport(w.Xsansi) },
  function() { return settings.statusReport(w.Ha_yoon) },
  function() { return settings.statusReport(w.Kyle) },
  function() { return settings.statusReport(w.Ostap) },
  function() { return settings.statusReport(w.Aada) },
  function() { return '<td colspan="3" style="border:black solid 1px" align="center" title="The current date and time (adjusted for relativistic effects)">' + util.getDateTime() + '</td>' },
  function() { return settings.oxygenReport() },
];


settings.colours = ['red', 'yellow', 'blue', 'lime', 'lime', 'grey', 'black']
settings.colourNotes = ['Red indicates something is seriously wrong; action should be taken to avoid death', 'Yellow indicates cause for concern', 'Blue indicates less than excellent, but probably no cause for concern', 'Green indicates excellent', 'lime', 'Grey indicates the crewman is in stasis', 'Black indicates the crewman is dead']
settings.intervals = [25,50,25,1, 1000]
settings.intervalDescs = ['worrying', 'fair', 'good', 'perfect']
settings.statusReport = function(obj) {
  let s, colourCode, tooltip
  tooltip = obj.alias + ' is '
  if (!obj.crewman) tooltip += obj.player ? 'the captain of the ship (i.e., you)' : 'the ship AI'
  if (typeof obj.status === "string") {
    s = obj.status
    colourCode = s === 'stasis' ? 5 : 6
    if (obj.crewman) tooltip += (s === 'stasis' ? 'in stasis' : 'dead')
  }
  else {
    s = obj.status.toString() + '%'
    colourCode = util.getByInterval(settings.intervals, obj.status)
    if (obj.crewman) tooltip += 'in ' + w[obj.loc].alias
  }
  return '<td title="' + tooltip + '"><i>' + obj.alias + ':</i></td>' + settings.warningLight(colourCode) + '<td align="right">' + s + '</td>'
}
settings.oxygenReport = function(obj) {
  // 0.84 kg O2  per day
  // https://ntrs.nasa.gov/citations/20040012725
  // so 0.58 g/m
  //console.log(w.ship.oxygen)
  //console.log(util.getByInterval(settings.intervals, w.ship.oxygen / 50))
  const colourCode = util.getByInterval(settings.intervals, w.ship.oxygen / 10)
  return '<td title="The ship has a limited amount of oxygen; an adult uses about 6 g every minute, but none while in stasis"><b>Oxygen:</b></td>' + settings.warningLight(colourCode) + '<td align="right"><span style="font-size:0.8em">' + (Math.round(w.ship.oxygen) / 1000).toFixed(3) + ' kg</span></td>'
}

settings.warningLight = function(colourCode) {
  let s = '<td title="' + settings.colourNotes[colourCode] + '">'
  s += '<svg height="12" width="10">'
  s += '<circle cx="5" cy="5" r="5" stroke="black" stroke-width="1" fill="' + settings.colours[colourCode] + '" />'
  s += '</svg>'
  s += '</td>'
  return s
}


settings.inventoryPane = false

settings.setup = function() {
  arrival()
  document.querySelector('#panes').innerHTML += '<div id="map" class="pane-div" style="text-align:center;">' + mapSVG + '</div>'
  updateMap()
}

settings.updateCustomUI = function() {
  updateMap()
}

settings.afterDarkToggle = function() {
  updateMap()
}


const professions = [
  {name:"Engineer", bonus:"mech"},
  {name:"Scientist", bonus:"science"},
  {name:"Medical officer", bonus:"medicine"},
  {name:"Soldier", bonus:"combat"},
  {name:"Computer specialist", bonus:"computers"},
  {name:"Exotic dancer", bonus:"agility"},
  {name:"Advertising exec", bonus:"deceit"},
  {name:"Urban poet", bonus:"social"},
];

const backgrounds = [
  {name:"Bored dilettante", bonus:"social"},
  {name:"Wannabe explorer", bonus:"science"},
  {name:"Fame-seeker", bonus:"none"},
  {name:"Debtor", bonus:"none"},
  {name:"Criminal escaping justice", bonus:"deceit"},
  {name:"Anti-social loner", bonus:"none"},
  {name:"Conspiracy crackpot", bonus:"none"},
  {name:"Religious fanatic", bonus:"none"},
];


let s = "<p>You are on a mission to survey planets around five stars; the captain of a crew of five, including yourself. There is also a computer system, Xsansi, that you can talk to anywhere on the ship. </p><p>The objective of the game is to maximise your bonus. Collecting data will give a bonus, but geo-data about planets suitable for mining and bio-data about planets suitable for colonisation will give higher bonuses. Evidence of alien intelligence will be especially rewarding!</p><p>You need to survive to collect the bonus! You should also keep your crew alive; as captain you get a bigger bonus than the crew, but it will be reduced if they do not survive.</p><p>You have just arrived at your first destination after years in a \"stasis\" pod in suspended animation. Once you have created your character, ASK AI ABOUT MISSION or CREW might be a good place to start. Later you may want to try commands like OSTAP, LAUNCH PROBE or ASK AADA ABOUT PLANET. Also see what happens when you hover the mouse over a name in the status pane. You can also use HELP if you want more details.</p>"

s += '<table>'
s += '<tr><td>Name:</td><td><input id="namefield" type="text" value="Ariel" style="width:300px" /></td></tr>'
s += '<tr><td>Sex:</td><td>Male: <input type="radio" id="male" name="sex" value="male">&nbsp;&nbsp;&nbsp;&nbsp;'
s += 'Female<input type="radio" id="female" name="sex" value="female" checked></td></tr>'
s += '<tr><td>Profession:</td><td><select id="job" style="width:300px">'
for (let prof of professions) {
  s += '<option value="' + prof.name + '">' + prof.name + '</option>'
}
s += '</select></td></tr>'
s += '<tr><td>Background:</td><td><select id="background" style="width:300px">'
for (let back of backgrounds) {
  s += '<option value="' + back.name + '">' + back.name + '</option>'
}
s += '</select></td></tr></table>'


settings.startingDialogEnabled = settings.playMode !== 'dev'
settings.startingDialogEnabled = true
settings.startingDialogTitle = "To start with..."
settings.startingDialogWidth = 500
settings.startingDialogHeight = 550
settings.startingDialogHtml = s
settings.startingDialogButton = 'OK'
settings.startingDialogOnClick = function() {
  let p = player;
  const jobName = document.querySelector("#job").value;
  const job = professions.find(function(el) { return el.name === jobName; });
  w.me.job = job.name;
  w.me.jobBonus = job.bonus;
  const backgroundName = document.querySelector("#background").value
  const background = backgrounds.find(function(el) { return el.name === backgroundName; })
  w.me.background = background.name
  w.me.backgroundBonus = background.bonus
  w.me.isFemale = document.querySelector("#female").checked
  w.me.alias = document.querySelector("#namefield").value
}
settings.startingDialogInit = function() {
  document.querySelector('#namefield').focus()
}
settings.startingDialogAlt = function() {
  w.me.job = professions[0].name;
  w.me.jobBonus = professions[0].bonus;
  w.me.isFemale = true;
  w.me.alias = "Shaala";
}


