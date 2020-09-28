"use strict";




settings.title = "The Voyages of The Joseph Banks"
settings.author = "The Pixie"
settings.version = "0.1"
settings.thanks = ["Kyle", "Lara"]
settings.warnings = 'This game does have swearing (including the F-word); it is possible to romance crew mates of either gender, but nothing graphic.'

// UI options
settings.customExits = 'shipwise'
settings.files = ["const", "code", "commands", "text", "data", "npcs"]
settings.noTalkTo = "You can talk to an NPC using either {color:red:ASK [name] ABOUT [topic]} or {color:red:TELL [name] ABOUT [topic]}."
settings.noAskTell = false
settings.givePlayerAskTellMsg = false



settings.tests = true

settings.dateTime.start = new Date('April 14, 2387 09:43:00')
settings.roomTemplate = [
  "{hereDesc}",
  "{objectsHere:You can see {objects} here.}",
]

settings.status = [
  function() { return "<td colspan=\"3\" style=\"border:black solid 1px;\" align=\"center\">" + getDateTime() + "</td>"; },
  function() { return "<td width=\"100px\"><b><i>Bonus:</i></b></td><td width=\"30px\" align=\"right\"><b>$" + game.player.bonus + "k</b></td><td></td>"; },
  function() { return settings.statusReport(game.player) },
  function() { return settings.statusReport(w.Xsansi) },
  function() { return settings.statusReport(w.Ha_yoon) },
  function() { return settings.statusReport(w.Kyle) },
  function() { return settings.statusReport(w.Ostap) },
  function() { return settings.statusReport(w.Aada) },
  //function() { return settings.oxygenReport() },
];


settings.colours = ['red', 'yellow', 'blue', 'lime', 'lime']
settings.intervals = [25,50,25,1, 1000]
settings.intervalDescs = ['worrying', 'fair', 'good', 'perfect']
settings.statusReport = function(obj) {
  let s, colour
  if (typeof obj.status === "string") {
    s = obj.status
    colour = s === 'stasis' ? 'grey' : 'black'
  }
  else {
    s = obj.status.toString() + '%'
    colour = settings.colours[util.getByInterval(settings.intervals, obj.status)]
  }
  return "<td><i>" + obj.alias + ":</i></td><td style=\"border:black solid 2px; background:" + colour + "\">&nbsp;</td><td align=\"right\">" + s + "</td>";
}
settings.oxygenReport = function(obj) {
  console.log(w.ship.oxygen)
  console.log(util.getByInterval(settings.intervals, w.ship.oxygen / 10))
  const colour = settings.colours[util.getByInterval(settings.intervals, w.ship.oxygen / 10)]
  return "<td><i>Oxygen:</i></td><td style=\"border:black solid 2px; background:" + colour + "\">&nbsp;</td><td align=\"right\">" + w.ship.oxygen + "</td>";
}

settings.inventoryPane = false

settings.setup = function() {
  arrival()
}






settings.customUI = function() {
  let s = '<div class="pane-div" style="position: relative;height:290px;width140px" id="map">'
  s += '<img src="' + settings.imagesFolder + '/spaceship.png" style="margin-left:10px;margin-top:15px;"/>'
  s += '<div style="position:absolute; top:5px; left:52px">Forward</div>'
  s += '<div style="position:absolute; top:278px; left:68px">Aft</div>'
  s += '<div style="position:absolute; top:70px; left:5px; writing-mode:vertical-lr">Port</div>'
  s += '<div style="position:absolute; top:70px; left:138px; writing-mode:vertical-lr">Starboard</div>'
  
  s += '</div>'
  $("#panes").append(s)
}





const professions = [
  {name:"Engineer", bonus:"mech"},
  {name:"Scientist", bonus:"science"},
  {name:"Medical officer", bonus:"medicine"},
  {name:"Soldier", bonus:"combat"},
  {name:"Computer specialist", bonus:"computers"},
  {name:"Dancer", bonus:"agility"},
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


let s = "<p>You are on a mission to survey planets around five stars, the captain of a crew of five (including yourself). There is also a computer system, Xsansi (you can also use \"AI\" or \"computer\"), that you can talk to anywhere on the ship. </p><p>Your objective is to maximise your bonus. Collecting data will give a bonus, but geo-data about planets suitable for mining and bio-data about planets suitable for colonisation will give higher bonuses. Evidence of alien intelligence will be especially rewarding!</p><p>You have just arrived at your first destination after years in a \"stasis\" pod in suspended animation. ASK AI ABOUT MISSION or CREW might be a good place to start, once you have created your character. Later you want to try OSTAP, LAUNCH PROBE or ASK AADA ABOUT PLANET. You can also use HELP if you want more details.";

s += '<p>Name: <input id="namefield" type="text" value="Ariel" /></p>';
s += '<p>Male: <input type="radio" id="male" name="sex" value="male">&nbsp;&nbsp;&nbsp;&nbsp;';
s += 'Female<input type="radio" id="female" name="sex" value="female" checked></p>';
s += '<p>Profession: <select id="job">'
for (let prof of professions) {
  s += '<option value="' + prof.name + '">' + prof.name + '</option>';
}
s += '</select></p>'
s += '<p>Background: <select id="background">'
for (let back of backgrounds) {
  s += '<option value="' + back.name + '">' + back.name + '</option>';
}
s += '</select></p>';


//settings.startingDialogEnabled = true
settings.startingDialogTitle = "To start with..."
settings.startingDialogWidth = 555
settings.startingDialogHeight = 565
settings.startingDialogHtml = s
settings.startingDialogOnClick = function() {
  let p = game.player;
  const jobName = $("#job").val();
  const job = professions.find(function(el) { return el.name === jobName; });
  w.me.job = job.name;
  w.me.jobBonus = job.bonus;
  const backgroundName = $("#background").val()
  const background = backgrounds.find(function(el) { return el.name === backgroundName; });
  w.me.background = background.name;
  w.me.backgroundBonus = background.bonus;
  w.me.isFemale = $("#female").is(':checked');
  w.me.alias = $("#namefield").val();
}
settings.startingDialogInit = function() {
  $('#namefield').focus();
}
settings.startingDialogAlt = function() {
  w.me.job = professions[0].name;
  w.me.jobBonus = professions[0].bonus;
  w.me.isFemale = true;
  w.me.alias = "Shaala";
}


