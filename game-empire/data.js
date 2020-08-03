"use strict"

createItem("me", PLAYER(), {
  loc:"throne_room",
  regex:/^me|myself|player$/,
  examine: "Just a regular guy.",
  hitpoints:100,
})

createRoom("throne_room", {
  desc:"The throne room is nice. But could be better.",
  north:new Exit('royal_bedroom'),
  south:new Exit('great_hall'),
  east:new Exit('balcony'),
})


createRoom("royal_bedroom", {
  desc:"The royal bedroom got rather damaged in the goblin raids. But the bed looks okay.",
  south:new Exit('royal_bedroom'),
})

createRoom("balcony", {
  desc:"The royal bedroom got rather damaged in the goblin raids. But the bed looks okay.",
  west:new Exit('throne_room'),
})


createRoom("great_hall", {
  desc:"The great hall saw a lot of fighting when the goblins attacked, and is in a sorry state.",
  north:new Exit('throne_room'),
  south:new Exit('chapel'),
  west:new Exit('laboratory'),
  //east:new Exit('gallery'),
})


createRoom("chapel", {
  desc:"The royal bedroom got rather damaged in the goblin raids. But the bed looks okay.",
  north:new Exit('great_hall'),
})

createRoom("laboratory", {
  desc:"The royal bedroom got rather damaged in the goblin raids. But the bed looks okay.",
  east:new Exit('great_hall'),
})

