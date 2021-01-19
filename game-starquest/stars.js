"use strict"


const stars = {
  // track ship location with currentLocation, and work out the system from that
  getLocation:function(name) { return this.getSystemOrLocation(true, name) },
  getSystem:function(name) { return this.getSystemOrLocation(false, name) },
  getSystemOrLocation:function(isLocation, name) {
    if (name === undefined) name = w.ship.currentLocation
    for (let el of this.data) {
      for (let el2 of el.locations) {
        if (el2.name === name) return isLocation ? el2 : el
      }
    }
    log("ERROR: Failed to find " + (isLocation ? 'location' : 'system') + " with name " + name)
  },
  add:function(data) {
    this.data.push(data)
    
    pageData.push({name:data.alias, 
      t:data.desc,
      type:'star',
    })
    if (data.start) w.PAGE.starActiveOptions.push(data.alias)
    for (let el of data.locations) {
      pageData.push({name:el.alias, 
        t:el.desc,
        type:'star',
      })
      if (data.start) w.PAGE.starActiveOptions.push(el.alias)
    }
  },
  data:[],
  arriveAtSector:function() {
    w.ship.arrivedAtSector = true
    w.ship.currentSystem = 'cyrennis'
    w.ship.datetime += 9 * 24 + 3
    w.ship.currentLocation = 'starbase'
    w.ship.onView = 'nagoshima'
    log(w.ship)

    missions.start('asteroid')
    missions.start('deploy_probes')
    missions.start('mining_colony')
    missions.start('cruise_ship')
    missions.start('protect_ship')
    missions.start('piracy')
  },
}

stars.add({
  name:'sol',
  alias:'Sol',
  start:true,
  locations:[
    {
      name:'stardock',
      alias:'Stardock 83',
      desc:'One of numerous star docks in the solar system, 83 is in Earth orbit at L4.',
    }
  ]
})

stars.add({
  name:'cyrennis',
  alias:'Cyrennis Minima',
  start:true,
  locations:[
    {
      name:'starbase',
      alias:'Starbase 142',
      desc:"Starbase 142 is a type 7-gamma base, with limited facilities. It is currently under the command of Commander Nagoshima.|For historical reasons, Starbase 142 is in orbit around Cyrennis Minima, a star with no habitable planets. When it was established, all of the planets in the sector were independant and none wanted a Starbase in their sky. Although the political situation has changed significantly, Starbase 142 has remained in the same position.",
    }
  ]
})