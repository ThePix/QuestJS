"use strict"



const map = {}
map.defaultStyle = {position:'fixed', display:'block'}
io.modulesToUpdate.push(map)
io.modulesToInit.push(map)

map.init = function() {
  $('#quest-map').css(map.defaultStyle)
  $('#quest-map').css(settings.mapStyle)
}



map.update = function() {
  let mapBase = []
  let mapFeatures = []
  let mapLabels = []
  for (let key in w) {
    if (!w[key].room) continue
    if (w[key].mapDrawBase) {
      mapBase.push(w[key].mapDrawBase())
    }
    if (w[key].mapDrawBaseString) {
      mapBase.push(w[key].mapDrawBaseString)
    }
    else {
      mapBase.push(map.mapDrawDefaultBase(w[key]))
    }
    if (w[key].mapDrawFeatures) mapFeatures.push(w[key].mapDrawFeatures())
    if (w[key].mapDrawLabels) mapLabels.push(w[key].mapDrawLabels())
  }   
  const result = mapBase.concat(this.mapCells, mapFeatures, mapLabels, settings.mapOverlay ? settings.mapOverlay : [])
  
  result.push('<rect x="10" y="40" width="20" height="20" stroke="black" fill="blue"/>')
  
  draw(parseInt(settings.mapStyle.width), parseInt(settings.mapStyle.height), result, 'quest-map')
}


map.mapDrawDefaultBase = function(o) {
  return ''
  let s = '<rect x="' + o.mapX + '" y="' + o.mapY + '" width="'
  s += o.mapWidth ? o.mapWidth : settings.mapCellWidth
  s += '" height="'
  s += o.mapHeight ? o.mapHeight : settings.mapCellHeight
  s += '" stroke="black" fill="none"/>'
  o.mapDrawBaseString = s
  return s
}