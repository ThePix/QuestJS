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