"use strict"


map.getStartingLocations = function() {
    const start1 = w.lounge
    start1.mapX = 0
    start1.mapY = 0
    start1.mapZ = 0
    const start2 = w.glade
    start2.mapX = 1000
    start2.mapY = 0
    start2.mapZ = 0
    return [start1, start2]
}

map.marker = function(x, y) {
  let s = '<line x1="'
  s += (x - 15)
  s += '" y1="'
  s += (y - 40)
  s += '" x2="'
  s += (x - 5)
  s += '" y2="'
  s += (y - 15)
  s += '" stroke="#000" stroke-width="5" marker-end="url(#arrowbig)" />'
  console.log(s)
  return s
}