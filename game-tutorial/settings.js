"use strict";

// About your game
settings.title = "How To Play Text Adventures";
settings.author = "The Pixie"
settings.version = "0.1";
settings.thanks = [];
settings.warnings = 'No warning relevant for this game.'
settings.files = ["code", "data", "npcs"];
settings.debug = true
settings.noTalkTo = false
settings.noAskTell = false
settings.givePlayerAskTellMsg  = false
settings.shortcutCommand = 'wt a'

settings.afterSave = function(filename) {
  if (w.me.hints = 190) {
    if (filename === 'tutorial') {
      tmsg("Great, we have saved the game - and you even followed my advice for the name. Now let's continue west down this passage.")
    }
    else {
      tmsg("Great, we have saved the game - though I am, a bit disappointed that you didn't followed my advice for the name... Oh, well, I guess we better continue west down this passage.")
    }
    w.me.hints = 200
  }
}

settings.afterLoad = function() {
  if (w.me.hints > 190) {
    tmsg("Great, you not only saved the game, you loaded it too! I suggest you use the HINT command to see what to do next, and then you can get going with the tutorial again.")
  }
}

settings.intro = [
  "Welcome to... The Tutorial House. Can you find the odd mystery beneath this seemingly ordinary house?",
]

settings.setup = function() {
  tmsg("This is a simple introduction to text adventures; comments like this will lead you by the hand as you do most of the common things in a text adventures.")
  tmsg("Text adventures are also known as interactive fiction, and there are numerous formats. This is about parser-based game, which is to say, games where the player types commands, and the game attempts to parse the command, and update the game world accordingly.")
  tmsg("There is also a huge variety of parser-based games, but most start with some introductory text, as above, and then place the player in a starting location, so let's see where we are...")
}

settings.roomTemplate = [
  "#{cap:{hereName}}",
  "{terse:{hereDesc}}",
  "{objectsHere:You can see {objects} here.}",
]
