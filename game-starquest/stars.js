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
  draw:function(name) {
    const system = this.getSystem(name)
    let svg = []
    log(system)
    svg.push('<circle cx="200" cy="200" r="' + system.size + '" fill="' + system.colour + '" stroke="white"/>')
    for (let el of system.locations) {
      svg.push('<ellipse cx="200" cy="200" rx="' + el.radius + '" ry="' + (el.radius/2) + '" fill="none" stroke="silver"/>')
      log(el.angle)
      log(el.radius)
      const x = 200 + Math.sin(el.angle * Math.PI / 180) * el.radius
      log(x)
      const y = 200 + Math.cos(el.angle * Math.PI / 180) * el.radius / 2
      svg.push('<circle cx="' + x + '" cy="' + y + '" r="3" fill="grey" stroke="white"/>')
      
      svg.push('<text class="map-text" x="' + (x-3) + '" y="' + (y-5) + '" fill="white">' + el.alias + '</text>')
    }
    svg.push('<text class="map-text" x="0" y="12" fill="silver">' + (system.system ? system.system : system.alias + ' system') + '</text>')
    svg.push('<text class="map-text" x="0" y="398" fill="silver">Quicksilver Starmaps</text>')
    svg.push('<text class="map-text" x="313" y="398" fill="silver">Not to scale</text>')
    draw(400, 400, svg, {destination:'quest-image'})
  },

}

stars.add({
  name:'sol',
  alias:'Sol',
  system:'Solar system',
  start:true,
  colour:'yellow',
  size:8,
  locations:[
    {
      name:'stardock',
      alias:'Stardock 83',
      desc:'One of numerous star docks in the solar system, 83 is in Earth orbit at L4.',
      radius:180,
      angle:200,
    },
    {
      name:'earth',
      alias:'Earth',
      desc:'The cradle of mankind.',
      radius:180,
      angle:130,
    },
    {
      name:'venus',
      alias:'Venus',
      desc:'Terraforming has turned Venus into a tropical paradise.',
      radius:90,
      angle:0,
    },
    {
      name:'mars',
      alias:'Mars',
      desc:'Limited terraforming to support an industrial planet.',
      radius:280,
      angle:20,
    },
  ],
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