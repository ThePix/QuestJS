"use strict";

settings.title = "Blood Witch"
settings.author = "The Pixie"
settings.version = "1.2"
settings.thanks = ["Kyle", "Lara"]
settings.dscription = ["The Great Citadel holds a terrible secret. Unbeknownst to anyone, one of the king's concubines is a Blood Witch!", "And it is you!"]

settings.noTalkTo = false
settings.noAskTell = false

//settings.tests = true

settings.textEffectDelay = 100

settings.imagesFolder = 'images'

settings.status = [
  "hitpoints",
  function() { return "<td>Spell points:</td><td>3</td>"; },
  function() { return "<td>Health points:</td><td>" + game.player.hitpoints + "</td>"; },
  function() { return '<td colspan="2">' + game.player.status + "</td>"; },
]

settings.intro = "."



// This function will be called at the start of the game, so can be used
// to introduce your game.
settings.setup = function() {
  game.player.hitpoints = 20;
  game.player.status = "You are feeling fine";
  io.updateStatus()
}


//settings.panes = 'none'

settings.roomTemplate = [
  "#{cap:{hereName}}",
  "{hereDesc}",
  "{objectsHere:You can see {objects} here.}",
]

