"use strict"

settings.title = "Quest 6 Map Demo"
settings.author = "The Pixie"
settings.version = "0.1"
settings.thanks = []
settings.warnings = "No warnings applicable to this game."
settings.playMode = "dev"

settings.libraries.push('map')
settings.mapShowNotVisited = true
settings.mapCellSize = 32
settings.mapScale = 50
settings.mapDrawLabels = true
settings.mapLabelStyle = {'font-size':'8pt', 'font-weight':'bold'}
settings.mapLabelColour = 'blue'
settings.mapLabelRotate = -20
settings.mapLabelOffset = -5
settings.mapStyle = {right:'0', top:'200px', width:'400px', height:'400px', 'background-color':'#ddd' }
settings.mapClick = function(name) {
  console.log("Map clicked: " + name)
}
settings.mapAutomapFrom = ['lounge', 'glade']
settings.mapMarker = function(loc) {
  return map.polygon(loc, [
    [0,0], [-5,-25], [-7, -20], [-18, -45], [-20, -40], [-25, -42], [-10, -18], [-15, -20]
  ], 'stroke:none;fill:black;pointer-events:none;opacity:0.3')
}
settings.mapExtras = function() {
  return [
    map.rectangle(w[w.Robot.loc], [[-10,-10], [10, 10]], 'fill:silver;stroke:black'),
    map.rectangle(w[w.Kyle.loc], [[-5,-5], [10, 10]], 'fill:blue;stroke:black'),
    map.rectangle(w[w.Lara.loc], [[0,0], [10, 10]], 'fill:red;stroke:black'),
  ]
}