"use strict"

settings.title = "Nation!"
settings.author = "The Pixie"
settings.version = "0.1"
settings.thanks = []
settings.warnings = "No warnings have been set for this game."
settings.playMode = "dev"

settings.disableChecks = true

settings.compassPane = false
settings.textInput = false
settings.cmdEcho = settings.playMode === 'dev'
settings.suppressTitle = true
settings.roomTemplate = []

settings.noTalkTo = false
settings.funcForDynamicConv = 'showMenuDiag'

settings.seasons = ['winter', 'spring', 'summer', 'autumn']
settings.startYear = 327


settings.toolbar = [
  {content:function() { return 'It is ' + settings.seasons[home.progress % 4] + ', ' + Math.floor(settings.startYear + home.progress / 4)  }},
  {title:true},
  {buttons:[
      { title: "Dark mode", icon: "fa-moon", cmd: "dark" },
      { title: "Save", icon: "fa-upload", cmd: "save game ow" },
      { title: "Load", icon: "fa-download", cmd: "load game" },
      { title: "About", icon: "fa-info-circle", cmd: "about" },
  ]},
]


settings.inventoryPane = [
  {name:'Departments', alt:'depts', test:function(o) { return o.dept && o.invShow() } },
  {name:'Factions', alt:'factions', test:function(o) { return o.faction && o.invShow() } },
  {name:'Neigbours', alt:'nations', test:function(o) { return o.nation && o.invShow() } },
]



settings.statusPane = "Status"
settings.statusWidthLeft = 120
settings.statusWidthRight = 40
settings.status = [
  function() { return "<td>Population</td><td>" + Math.floor(home.population) + "</td>" },
  function() { return "<td>Treasury</td><td>" + Math.floor(home.money) + "</td>" },
  function() { return "<td>Food</td><td>" + Math.floor(home.food) + "</td>" },
  function() { return "<td>Attitude</td><td>" + home.happiness + "</td>" },
]


settings.setup = function() {
  createAdditionalPane(1, "Time", 'next-turn', function() {
    let html = '<input type="button" onclick="runCmd(\'wait\')" value="Next turn" />'
    return html
  })

  msg("Welcome...")
}


