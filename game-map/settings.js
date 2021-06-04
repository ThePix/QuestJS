"use strict"

settings.title = "Quest 6 Map Demo"
settings.author = "The Pixie"
settings.version = "0.1"
settings.thanks = []
settings.warnings = "No warnings applicable to this game."
settings.playMode = "dev"
settings.reportAllSvg = true

settings.libraries.push('node-map')
settings.mapAndImageCollapseAt = 1000
settings.mapShowNotVisited = true
settings.mapCellSize = 32
settings.mapScale = 50
settings.mapDrawLabels = true
settings.mapLabelStyle = {'font-size':'8pt', 'font-weight':'bold'}
settings.mapLabelColour = 'blue'
settings.mapLabelRotate = -20
settings.mapLabelOffset = -5
settings.mapStyle = {right:'0', top:'200px', width:'400px', height:'400px', 'background-color':'#ddd', border:'3px black solid', 'background-image':'url(game-map/paper.jpg)' }
settings.mapClick = function(name) {
  metamsg("You clicked on " + w[name].alias)
}
settings.mapAutomapFrom = ['street_middle', 'glade']
settings.mapMarker = function(loc) {
  return map.polygon(loc, [
    [0,0], [-5,-25], [-7, -20], [-18, -45], [-20, -40], [-25, -42], [-10, -18], [-15, -20]
  ], 'stroke:none;fill:black;pointer-events:none;opacity:0.3')
}
settings.mapExtras = function() {
  const result = []
  const room = w[player.loc]
  /*for (let o of [w.Robot, w.Lara, w.Kyle]) {
    if (w[o.loc].mapZ !== room.mapZ || w[o.loc].mapRegion !== room.mapRegion) continue
    result.push(o.mapDrawBase())
  }*/
  result.push(map.polygon(room, [
    [150, 100],
    [147, 117],
    [130, 120],
    [147, 123],
    [150, 160],
    [153, 123],
    [170, 120],
    [153, 117],
  ], 'stroke:black;fill:yellow;'))
  result.push(map.text(room, 'N', [150, 100], 'fill:black;font-size:14pt'))
  return result
}

