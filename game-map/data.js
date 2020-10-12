"use strict"

createItem("me", PLAYER(), {
  loc:"lounge",
  regex:/^(me|myself|player)$/,
  examine: "Just a regular guy.",
  hitpoints:100,
})

createRoom("lounge", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
  west:new Exit('dining_room'),
  south:new Exit('hall'),
  mapColour:'red',
})

createRoom("kitchen", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
  west:new Exit('garden_east'),
  north:new Exit('dining_room'),
  east:new Exit('hall'),
})

createRoom("dining_room", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
  east:new Exit('lounge'),
  south:new Exit('kitchen'),
  mapLabel:'D-Room',
})

createRoom("hall", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
  up:new Exit('landing'),
  west:new Exit('kitchen'),
  north:new Exit('lounge'),
  east:new Exit('street_middle'),
})



createRoom("garden_east", {
  desc:"The east end of the garden is boring, the author really needs to put stuff in it.",
  east:new Exit('kitchen'),
  west:new Exit('garden_west'),
  mapDrawBase:function(o) {
    let s = '<rect x="'
    s += this.mapX - 25
    s += '" y="'
    s += this.mapY - 16
    s += '" width="41" height="32" stroke="none" fill="#8f8"/>'
    s += map.polyline([
      [this.mapX - 25, this.mapY - 16],
      [this.mapX + 16, this.mapY - 16],
      [this.mapX + 16, this.mapY + 16],
      [this.mapX - 25, this.mapY + 16],
    ], 'stroke="black"')
    console.log(s)
    return s
  },
})

createRoom("garden_west", {
  desc:"The west end of the garden is boring, the author really needs to put stuff in it.",
  east:new Exit('garden_east'),
  mapDrawBase:function(o) {
    let s = '<rect x="'
    s += this.mapX - 16
    s += '" y="'
    s += this.mapY - 16
    s += '" width="41" height="32" stroke="none" fill="#8f8"/>'
    s += map.polyline([
      [this.mapX + 25, this.mapY - 16],
      [this.mapX - 16, this.mapY - 16],
      [this.mapX - 16, this.mapY + 16],
      [this.mapX + 25, this.mapY + 16],
    ], 'stroke="black"')
    return s
  },
})



createRoom("landing", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
  down:new Exit('hall'),
  west:new Exit('bedroom'),
})

createRoom("bedroom", {
  desc:"The lounge is boring, the author really needs to put stuff in it. There is a portal you go go in.",
  east:new Exit('landing'),
  in:new Exit('glade'),
})



createRoom("street_middle", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
  west:new Exit('hall'),
  north:new Exit('street_north'),
  south:new Exit('street_south'),
  mapDrawBase:function(o) {
    let s = '<rect x="'
    s += this.mapX - 16
    s += '" y="'
    s += this.mapY - 66
    s += '" width="32" height="132" stroke="black" fill="silver" onclick="map.click(\'' + this.name + '\')"/>'
    return s
  },
})

createRoom("street_north", {
  desc:"The street_north is boring, the author really needs to put stuff in it.",
  south:new Exit('street_middle'),
  mapDrawBase:function(o) { return '' },
  afterFirstEnter:function() { w.street_middle.visited++ },
})

createRoom("street_south", {
  desc:"The street_south is boring, the author really needs to put stuff in it.",
  north:new Exit('street_middle'),
  mapDrawBase:function(o) { return '' },
})




createRoom("glade", {
  desc:"The glade is boring, the author really needs to put stuff in it. There is a portal you go go in.",
  east:new Exit('forest'),
  in:new Exit('bedroom'),
})

createRoom("forest", {
  desc:"The forest is boring, the author really needs to put stuff in it. There is a portal you go go in.",
  west:new Exit('glade'),
})

