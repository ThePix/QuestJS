"use strict";

settings.title = "A First Step..."
settings.author = "The Pixie"
settings.version = "1.2"
settings.thanks = ["Kyle", "Lara"]

settings.noTalkTo = false
settings.noAskTell = false

settings.tests = true

settings.textEffectDelay = 100

settings.imagesFolder = 'images'

settings.status = [
  "hitpoints",
  function() { return "<td>Spell points:</td><td>3</td>"; },
  function() { return "<td>Health points:</td><td>" + game.player.hitpoints + "</td>"; },
  function() { return '<td colspan="2">' + game.player.status + "</td>"; },
]

settings.intro = "This is a quick example of what can be done in Quest 6.|Your objective is to turn on the light in the basement, but there are, of course, numerous hoops to jump through.|If you are successful, see if you can do it again, but getting Kyle to do everything. You should find that you can tell an NPC to do pretty much anything (except look at things for you and talk to people for you).|There is now a sizeable desert to the west you can explore too."



// This function will be called at the start of the game, so can be used
// to introduce your game.
settings.setup = function() {
  game.player.hitpoints = 20;
  game.player.status = "You are feeling fine";
  io.updateStatus()
}
