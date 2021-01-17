"use strict"


createRoom("room", {
  alias:"bridge",
  beforeEnter:function() {
  },
  afterFirstEnter:function() {
  msg ("'Welcome to the SS Star Quest, Sir,' says the yeoman as you sit in the command chair. 'The Admiralty have prepared a list of offices for your selection.' She hands you a PAGE.")
  },
})



createItem("ship", {
  dateTime:0,
  getDateTime:function() { 
    const n = this.dateTime + 63 * 24 + 5
    return "854." + Math.floor(n / 24) + "." + (n % 24) 
  },
  hullIntegrity:100,
  shields:'Down',
  currentLocation:'stardock',
  alert:2,
  alerts:['grey', 'Blue', 'Yellow', 'Orange', 'Red'],
  getAlert:function() {
    const c = this.alerts[this.alert]
    return this.alert ? '<span style="background-color:' + c + ';">&nbsp;' + c + '&nbsp;</span>' : '-'
  },
  postLoad:function() {
    if (w.ship.arrivedAtSector) {
      // load missions
    }
  },
})  
  