"use strict"

createItem("me", PLAYER(), {
  loc:"street_of_the_gods",
  regex:/^(me|myself|player)$/,
  examine: "Just a regular guy.",
  hitpoints:100,
})

createRoom("street_of_the_gods", {
  desc:"The street heads north to the High Temple, and south to the market square, and is lined with stone-built buildings reach three or even four storeys into the sky, with towers, turrets ans spires reaching even higher. Grandest of all is the temple itself, standing on a platform that raises it above the rest of the city, accessed via a wide flight of steps.",
  west:new Exit('museum_of_curios'),
  south:new Exit('market_square'),
  north:new Exit('high_temple'),
  mapX:400,
  mapY:450,
  //mapRegion:'Halmuth',
})




createRoom("market_square", {
  desc:"The market square is the centre of the city, and is teeming with people. There are dozens of stalls, selling everything from mushrooms to mallets, from songbirds to shawls.",
  north:new Exit('street_of_the_gods'),
  west:new Exit('western_way_halmuth'),
  east:new Exit('wheat_road'),
  south:new Exit('merchants_street'),
  mapX:390,
  mapY:535,
})



createRoom("wheat_road", {
  desc:"The east side of Halmuth is the poorer side of the city. The tenement blocks on either are run down.",
  northeast:new Exit('estalia_manor'),
  west:new Exit('market_square'),
  south:new Exit('quayside_east'),
  east:new Exit('granite_bridge'),
  mapX:666,
  mapY:532,
  mapRegion:'Halmuth',
})


createRoom("merchants_street", {
  desc:"Merchant's Street is boring, the author really needs to put stuff in it.",
  north:new Exit('market_square'),
  south:new Exit('quayside_west'),
  mapX:385,
  mapY:650,
})

createRoom("quayside_west", {
  desc:"The west end of the Quayside is boring, the author really needs to put stuff in it.",
  north:new Exit('merchants_street'),
  east:new Exit('quayside'),
  mapX:380,
  mapY:770,
})

createRoom("quayside", {
  desc:"The Quayside is boring, the author really needs to put stuff in it.",
  west:new Exit('quayside_west'),
  east:new Exit('quayside_east'),
  south:new Exit('wharf'),
  mapX:550,
  mapY:763,
})

createRoom("quayside_east", {
  desc:"The west end of the Quayside is boring, the author really needs to put stuff in it.",
  west:new Exit('quayside'),
  north: new Exit('wheat_road'),
  mapX:720,
  mapY:750,
})

createRoom("wharf", {
  desc:"The wharf is boring, the author really needs to put stuff in it.",
  north:new Exit('quayside'),
  mapX:560,
  mapY:900,
})


createRoom("western_way_halmuth", {
  desc:"The Western Way is boring, the author really needs to put stuff in it. Further west takes you out of the city.",
  east:new Exit('market_square'),
  west:new Exit('western_way_1'),
  mapX:250,
  mapY:535,
  mapRegion:'Halmuth',
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




createRoom("high_temple", {
  desc:"The High Temple is boring, the author really needs to put stuff in it.",
  south:new Exit('street_of_the_gods'),
  mapX:414,
  mapY:306,
})

createRoom("leviathon", {
  desc:"The Leviathon is boring, the author really needs to put stuff in it.",
  southeast:new Exit('quayside_west'),
  mapX:300,
  mapY:706,
})

createRoom("estalia_manor", {
  desc:"Estalia Manor is boring, the author really needs to put stuff in it.",
  southwest:new Exit('wheat_road'),
  mapX:755,
  mapY:477,
})














createRoom("western_way_1", {
  desc:"The Western Way is boring, the author really needs to put stuff in it. To the east is the city of Halbuth",
  east:new Exit('western_way_halmuth'),
  west:new Exit('western_way_2'),
  mapX:706,
  mapY:641,
  mapRegion:'Small scale',
})

createRoom("western_way_2", {
  desc:"The Western Way is boring, the author really needs to put stuff in it. To the east is the city of Halbuth",
  east:new Exit('western_way_1'),
  west:new Exit('western_way_3'),
  mapX:572,
  mapY:659,
  mapRegion:'Small scale',
})

createRoom("western_way_3", {
  desc:"The Western Way is boring, the author really needs to put stuff in it. To the east is the city of Halbuth",
  east:new Exit('western_way_2'),
  //west:new Exit('western_way_1'),
  mapX:461,
  mapY:646,
  mapRegion:'Small scale',
})


createRoom("granite_bridge", {
  desc:"The Granite Bridge is boring, the author really needs to put stuff in it. To the east is the city of Halbuth",
  //east:new Exit('western_way_2'),
  west:new Exit('wheat_road'),
  mapX:774,
  mapY:617,
  mapRegion:'Small scale',
})

