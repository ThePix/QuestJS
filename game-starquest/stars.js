"use strict"


const stars = {
  getLocation:function(name) { return this.getSystemOrLocation(true, name) },
  getSystem:function(name) { return this.getSystemOrLocation(false, name) },
  getSystemOrLocation:function(isLocation, name) {
    if (name === undefined) name = w.ship.currentLocation
    for (let el of this.data) {
      log(el)
      for (let el2 of el.locations) {
        if (el2.name === name) return isLocation ? el2 : el
      }
    }
  },
  add:function(data) {
    this.data.push(data)
    
    addToEncyclopaedia("star_" + data.name, {
      alias:data.alias,
      examine:data.desc,
      type:'star',
    })
    for (let el of data.locations) {
      addToEncyclopaedia("location_" + data.name, {
        alias:el.alias + ', ' + data.alias,
        examine:el.desc,
        type:'star',
      })
    }
  },
  data:[],
}

stars.add({
  name:'sol',
  alias:'Sol',
  locations:[
    {
      name:'stardock',
      alias:'Star Dock 83',
      desc:'One of numerous star docks in the solar system, 83 is in Earth orbit at L4.',
    }
  ]
})

stars.add({
  name:'cyrennis',
  alias:'Cyrennis Minima',
  locations:[
    {
      name:'starbase',
      alias:'Starbase 142',
      desc:"Starbase 142 is a type 7-gamma base, with limited facilities. It is currently under the command of Commander Nagoshima.|For historical reasons, Starbase 142 is in orbit around Cyrennis Minima, a star with no habitable planets. When it was established, all of the planets in the sector were independant and none wanted a Starbase in their sky. Although the political situation has changed significantly, Starbase 142 has remained in the same position.",
    }
  ]
})