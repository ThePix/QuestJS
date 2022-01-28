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
  width:'390px',
  height:'400px',
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
settings.mapLabelColour = 'blue'
settings.mapLabelOffset = 15
settings.mapLabelRotate = -20