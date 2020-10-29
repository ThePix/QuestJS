"use strict"

createItem("me", PLAYER(), {
  loc:"street_of_the_gods",
  regex:/^(me|myself|player)$/,
  examine: "Just a regular guy.",
  hitpoints:100,
})

createRoom("street_of_the_gods", {
  desc:"The street is boring, the author really needs to put stuff in it.",
  west:new Exit('museum_of_curios'),
  south:new Exit('market_square'),
  mapX:400,
  mapY:450,
  //mapRegion:'Halmuth',
})


createRoom("museum_of_curios", {
  desc:"The museum is boring, the author really needs to put stuff in it.",
  east:new Exit('street_of_the_gods'),
  up:new Exit('museum_of_curios_upstairs'),
  mapX:300,
  mapY:480,
})

createRoom("museum_of_curios_upstairs", {
  desc:"The upper level of the museum is boring, the author really needs to put stuff in it.",
  down:new Exit('museum_of_curios'),
})


createRoom("market_square", {
  desc:"The market square is boring, the author really needs to put stuff in it.",
  north:new Exit('street_of_the_gods'),
  west:new Exit('western_way'),
  mapX:390,
  mapY:535,
})


createRoom("western_way", {
  desc:"The Western Way is boring, the author really needs to put stuff in it. Further west takes you out of the city.",
  east:new Exit('market_square'),
  west:new Exit('western_way_2'),
  mapX:250,
  mapY:535,
  mapRegion:'Halmuth',
})

createRoom("western_way_2", {
  desc:"The Western Way is boring, the author really needs to put stuff in it. To the east is the city of Halbuth",
  east:new Exit('western_way'),
  mapX:380,
  mapY:520,
  mapRegion:'Small scale',
})