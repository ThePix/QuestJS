"use strict"

createItem("me", PLAYER(), {
  loc:"lounge",
  synonyms:['me', 'myself'],
  examine: "Just a regular guy.",
})

createRoom("lounge", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
})
