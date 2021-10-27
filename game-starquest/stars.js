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

  getLocationNames:function() {
    const system = stars.getSystem(w.ship.currentSystem)
    return system.locations.map(el => el.alias)
  },
  getStarNames:function() {
    return stars.data.map(el => el.alias)
  },
  add:function(data) {
    this.data.push(data)
    let locs = []
    
    for (let el of data.locations) {
      encyclopedia[el.alias] = 'In the [[' + data.alias + ']] system.|' + el.desc
      locs.push(el.alias)
    }
    encyclopedia[data.alias] = 'A type ' + data.type + ' star in the ' + data.sector + ' sector.|Significant locations include: [[' + locs.join(']], [[') + ']]'
  },
  data:[],
  arriveAtSector:function() {
    w.ship.arrivedAtSector = true
    w.ship.currentSystem = 'cyrennis'
    w.ship.datetime += 9 * 24 + 3
    w.ship.currentLocation = 'starbase'
    w.ship.onView = 'nagoshima'

    player.mission_assemble_crew = 1001
    player.mission_sector_7_iota = 1001
    missions.init()
    stars.draw()
  },
  draw:function(name) {
    const system = this.getSystem(name)
    let svg = []
    if (w.ship.showStarMap) {
      for (let el of stars.data) {
        if (!el.x) continue
        if (el.sector !== system.sector) continue
        svg.push('<circle cx="' + el.x + '" cy="' + el.y + '" r="' + (el.size/4) + '" fill="' + el.colour + '" stroke="none"/>')
        svg.push('<text class="map-text" x="' + (el.x-3) + '" y="' + (el.y-5) + '" fill="white">' + el.alias + '</text>')
      }
      svg.push('<text class="map-text" x="0" y="12" fill="silver">Sector ' + system.sector + '</text>')
    }
    else {
      svg.push('<circle cx="200" cy="200" r="' + system.size + '" fill="' + system.colour + '" stroke="white"/>')
      for (let el of system.locations) {
        svg.push('<ellipse cx="200" cy="200" rx="' + el.radius + '" ry="' + (el.radius/2) + '" fill="none" stroke="silver"/>')
        const x = 200 + Math.sin(el.angle * Math.PI / 180) * el.radius
        const y = 200 + Math.cos(el.angle * Math.PI / 180) * el.radius / 2
        svg.push('<circle cx="' + x + '" cy="' + y + '" r="3" fill="grey" stroke="white"/>')
        svg.push('<text class="map-text" x="' + (x-3) + '" y="' + (y-5) + '" fill="white">' + el.alias + '</text>')
      }
      svg.push('<text class="map-text" x="0" y="12" fill="silver">' + (system.system ? system.system : system.alias + ' system') + '</text>')
    }
    if (w.ship.arrivedAtSector) svg.push('<text class="map-text" x="353" y="12" fill="silver" onclick="stars.toggleStarMap(' + w.ship.showStarMap + ')">Toggle</text>')
    svg.push('<text class="map-text" x="0" y="398" fill="silver">Quicksilver Starmaps</text>')
    svg.push('<text class="map-text" x="313" y="398" fill="silver">Not to scale</text>')
    draw(400, 400, svg, {destination:'quest-image'})
  },
  toggleStarMap(flag) {
    w.ship.showStarMap = !flag
    this.draw()
  },

}

/*
Star attributes
name           string              required  Single word identifier
alias          string              required  Title
system         string              optional  Title of the system
start          Boolean             optional  If true, this mission is there from arrival
colour         string (colour)     required  HTML colour for drawing the star
size           number              required  Size of the star on the map (Sol is 8)
type           string              required  The spectral classification
locations      array of stars      required  The planets and other locations in the system


Location attributes
name           string              required  Single word identifier
alias          string              required  Title
desc           string              required  Description for encyclopedia
radius         number              required  Major radius of the orbit (Earth is 180)
angle          number              required  Place on the orbit in degrees; zero is at the bottom, and it goes anti-clockwise

Planet classification

G Gas giant; predominantly hydrogen atmosphere
L Less than habitable; atmosphere is only just breathable (implies life is present to generate oxygen) (Mercury, Pluto, the asteroids are all L)
M Habitable; atmosphere is breathable (implies life is present to generate oxygen) (Earth is M)
N Little or no atmosphere; less than 0.01 atm (before terraforming, Mars was borderline N)
R Reducing; a significant atmosphere that is more than 1% carbon dioxide (before terraforming, Venus was R)
P Toxic; a significant atmosphere containing components toxic to humans


D Desert world; less than 5% of the surface is water
F Frozen, surface water is frozen, even at the equator
W Water world; less than 5% of the surface is land

C Colonised
T Undergoing terraforming
X Indigenous population, pre-space
Y Indigenous population, space capable
Z Planet believed to have had an Indigenous population


*/
stars.add({
  name:'sol',
  alias:'Sol',
  system:'Solar system',
  start:true,
  colour:'yellow',
  size:8,
  type:'G2',
  sector:'1 Alpha',
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
  colour:'red',
  type: 'M2',
  size:12,
  x:200,
  y:200,
  sector:'7 Iota',
  locations:[
    {
      name:'starbase',
      alias:'Starbase 142',
      desc:"Starbase 142 is a type 7-gamma base, with limited facilities. It is currently under the command of Commander Nagoshima.|For historical reasons, Starbase 142 is in orbit around Cyrennis Minima, a star with no habitable planets. When it was established, all of the planets in the sector were independant and none wanted a Starbase in their sky. Although the political situation has changed significantly, Starbase 142 has remained in the same position.",
      radius:140,
      angle:220,
    }
  ]
})