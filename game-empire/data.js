"use strict"

createItem("me", PLAYER(), {
  loc:"lounge",
  regex:/^me|myself|player$/,
  examine: "Just a regular guy.",
  hitpoints:100,
})

createRoom("lounge", {
  desc:"The lounge is boring, you really need to put stuff in it.",
  locs:["one", "two", "three"]
})
