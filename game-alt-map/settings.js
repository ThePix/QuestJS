"use strict"

settings.title = "The City of Halmuth"
settings.author = "The Pixie"
settings.version = "0.1"
settings.thanks = []
settings.warnings = "No warnings have been set for this game."
settings.playMode = "dev"
//settings.reportAllSvg = true
settings.symbolsForCompass = true

settings.libraries.push('image-map')

settings.mapImages = [
  {
    name:'Halmuth',
    file:'game-alt-map/map.png',
    width:1000,
    height:1000,
  },
  {
    name:'Small scale',
    file:'game-alt-map/map.png',
    width:1000,
    height:1000,
  },
]

settings.mapScrollSpeed = 1
settings.mapStyle = {
  right:'0',
  top:'200px',
  width:'400px',
  height:'400px',
  'background-color':'#ddd', 
  border:'3px black solid',
}
settings.mapArrowsStyle = {
  fill:'red', 
  stroke:'#000000', 
  'stroke-width':'0.264583px',
  'stroke-linecap':'butt',
  'stroke-linejoin':'miter', 
  'stroke-opacity':0.5, 
  opacity:0.5
}
settings.mapMarker = function(loc) {
  return map.polygon(loc, [
    [0,0], [-5,-25], [-7, -20], [-18, -45], [-20, -40], [-25, -42], [-10, -18], [-15, -20]
  ], 'stroke:none;fill:black;pointer-events:none;opacity:0.5')
}


settings.mapPointsOfInterest = [
  {mapX:100, mapY:100, fill:'red', text:'Here is one thing'},
  {mapX:200, mapY:200, fill:'red', text:'Here is another thing'},
  {mapX:300, mapY:300, fill:'blue', text:'Here is something else', isActive:function() {return true }},
]