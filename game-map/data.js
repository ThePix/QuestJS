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
  mapWidth:45,
  mapHeight:45,
})

createRoom("kitchen", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
  west:new Exit('garden_east'),
  north:new Exit('dining_room'),
  east:new Exit('hall'),
})

createRoom("dining_room", {
  desc:"The dining room is boring, the author really needs to put stuff in it.",
  east:new Exit('lounge'),
  west:new Exit('garden_east', {mapOffsetY:-1,  mapDraw:function(fromRoom, toRoom) {
    return map.bezier(fromRoom, [[-15, 0], [-35, 0], [-35, 25]], 'fill:none')
      + map.polyline(toRoom, [[0, -20], [-5, -30], [5, -30]], 'stroke:none')
    return s
  }}),
  south:new Exit('kitchen'),
  mapLabel:'D-Room',
})

createRoom("hall", {
  desc:"The hall is boring, the author really needs to put stuff in it.",
  up:new Exit('landing'),
  west:new Exit('kitchen'),
  north:new Exit('lounge'),
  east:new Exit('street_middle'),
  south:new Exit('conservatory', {mapOffsetX:-0.5}),
  mapWidth:25,
})

createRoom("conservatory", {
  desc:"The conservatory is boring, the author really needs to put stuff in it.",
  north:new Exit('hall', {mapOffsetX:0.5}),
  west:new Exit('shed'),
  mapColour:'#88f',
})

createRoom("shed", {
  desc:"The shed is boring, the author really needs to put stuff in it.",
  east:new Exit('conservatory'),
  north:new Exit('garden_east', {mapOffsetX:-0.5}),
})

createItem("Lara", NPC(true), {
  loc:'shed',
  properNoun:true,
  agenda:['walkRandom'],
})

createItem("Kyle", NPC(false), {
  loc:'shed',
  properNoun:true,
  agenda:['walkRandom'],
})

createItem("Robot", NPC(false), {
  loc:'street_north',
  agenda:['patrol:street_middle:street_south:street_middle:street_north'],
})


createRoom("garden_east", {
  desc:"The east end of the garden is boring, the author really needs to put stuff in it.",
  east:new Exit('kitchen'),
  west:new Exit('garden_west'),
  south:new Exit('shed', {mapOffsetX:0.5}),
  mapDrawBase:function(o) {
    return map.rectRoom(this, [[-25, -16], [41, 32]], 'stroke:none;fill:#8f8')
      + map.polyline(this, [[-25, -16], [16, -16], [16, 16], [-25, 16]], 'stroke:black;fill:none')
  },
})

createRoom("garden_west", {
  desc:"The west end of the garden is boring, the author really needs to put stuff in it.",
  east:new Exit('garden_east'),
  south:new Exit('fairy_grotto', {mapOffsetY:-2, mapDraw:function(fromRoom, toRoom) {
    return map.bezier(fromRoom, [[0, 15], [30, 50], [-30, 10], [0, 65]], 'fill:none')
  }}),
  mapDrawBase:function(o) {
    return map.rectRoom(this, [[-16, -16], [41, 32]], 'stroke:none;fill:#8f8')
      + map.polyline(this, [[25, -16], [-16, -16], [-16, 16], [25, 16]], 'stroke:black;fill:none')
  },
})

createRoom("fairy_grotto", {
  desc:"The fairy grotto is amazing! But the author really needs to put stuff in it.",
  north:new Exit('garden_west', {mapIgnore:true}),
  mapDrawBase:function(o) {
    return map.polyroom(this, [[0, 20], [20, 0], [0, -20], [-20, 0]], 'stroke:black;fill:#cfc')
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
    return map.rectRoom(this, [[-16, -66], [32, 132]], 'stroke:black;fill:silver')
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

