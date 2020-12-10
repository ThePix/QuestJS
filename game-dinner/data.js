"use strict"

createItem("me", PLAYER(), {
  loc:"lounge",
  regex:/^(me|myself|player)$/,
  examine: "Just a regular guy.",
  hitpoints:100,
})

createRoom("lounge", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
})


createItem("Kyle", NPC(), {
  loc:"lounge",
  examine: "A slightly larger than normal sized bear in a Flash costume.",
})

createItem("soup_can", TAKEABLE(), {
  loc:"lounge",
  examine: "A large can of tomato soup.",
})

createItem("bowls", TAKEABLE(), {
  loc:"lounge",
  state:0,
  examine: "A set of matching bowls.",
})