"use strict"


createRoom("room", {
  alias:"bridge",
  desc:"This is the the brains of the Star Quest; this is where everything across the rest of the ship is controlled. In the centre is the command chair, surrounded by the workstations for each of the bridge officers. At the front, the view screen gives a panoramic view  of {if:ship:arrivedAtSector:space:the inside of the stardock}.",
})



createItem("ship", {
  dateTime:0,
  getDateTime:function(add) { 
    let n = (854 * 360 + 63) * 24 + 5
    if (add) {
      if (typeof add === 'string') add = parseInt(add)
      n += add
    }
    else {
      n += this.dateTime
    }
    return Math.floor(n / 24 / 360) + "." + (Math.floor(n / 24) % 360) + "." + (n % 24)
  },
  hullIntegrity:100,
  shields:0,
  getShields:function() {
    if (this.shields <= 0) return '<b>Failed</b>'
    if (this.shields === 101) return '<i>Off</i>'
    return this.shields + '%'
  },
  //currentSystem:'sol',
  currentLocation:'stardock',
  alert:2,
  alerts:['grey', 'Yellow', 'Orange', 'Red'],
  getAlert:function() {
    const c = this.alerts[this.alert]
    return this.alert ? '<span style="border:black 1px solid;background-color:' + c + ';">&nbsp;' + c + '&nbsp;</span>' : '-'
  },
  postLoad:function() {
    if (w.ship.arrivedAtSector) {
      // load missions
    }
  },
})  
  