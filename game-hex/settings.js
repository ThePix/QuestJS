"use strict"

settings.title = "The City of Halmuth"
settings.author = "The Pixie"
settings.version = "0.1"
settings.thanks = []
settings.warnings = "No warnings have been set for this game."
settings.playMode = "dev"
//settings.reportAllSvg = true
settings.symbolsForCompass = true

settings.libraries.push('hex-map')
settings.tests = true

settings.status = [
  function() { return '<td>Health points:</td><td>' + player.hitpoints + '</td>' },
  function() { return '<td colspan="2">' + util.getDateTime() + '</td>' },
]

settings.roomTemplate = [
  "#{cap:{hereName}}",
  "{hereDesc}",
  "{objectsHere:You can see {objects} here.}",
]

settings.mapAndImageCollapseAt = 1000



settings.mapStyle = {
  right:'0',
  top:'0',
  width:'500px',
  height:'500px',
  //width:'100px',
  //height:'100px',
  border:'3px black solid',
}



settings.mapDefaultAlias = function(o) {
  o.setAlias('Hex-grid ' + o.mapX + ', ' + o.mapY )
  o.headingAlias = o.alias
}

settings.mapClick = function(x, y) {
  log(x + ',' + y)
}




settings.mapDrawLabels = true
//settings.mapLabelColour = 'blue'
settings.mapLabelOffset = -8
settings.mapLabelRotate = -10

settings.mapXOffset1 = 8
settings.mapXOffset2 = 16
settings.mapYOffset = 14
settings.mapHexStroke = '#fff'
settings.mapHexStrokeWidth = 4
settings.mapDefaultColour = 'deepskyblue'
settings.mapRiverColour = 'dodgerblue'


settings.mapReportRepeats = true

settings.mapBiomes = {
  G:{name:'grassland', colour:'palegreen',},
  S:{name:'savanna', colour:'yellowgreen',},
  D:{name:'deciduous forest', colour:'olivedrab',},
  C:{name:'coniferous forest', colour:'darkgreen',},
  R:{name:'rain forest', colour:'olive',},
  M:{name:'marsh', colour:'teal',},
  C:{name:'chaparral', colour:'burlywood',},
  H:{name:'heath', colour:'sandybrown',},

  s:{name:'sea', colour:'powderblue',},
  m:{name:'mountains', colour:'darkgrey',},
  l:{name:'lavafield', colour:'orange',},
  d:{name:'desert', colour:'khaki',},
  t:{name:'tundra', colour:'blanchedalmond',},
  a:{name:'artic', colour:'white',},
  r:{name:'reef', colour:'pink',},
}


