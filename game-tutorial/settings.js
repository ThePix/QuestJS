"use strict";

// About your game
settings.title = "Professor Kleinscope";
settings.author = "The Pixie"
settings.version = "1.4";
settings.additionalAbout = {'Thanks to':'Pertex and R2T1 for beta-testing.'}
settings.warnings = 'No warning relevant for this game.'
settings.files = ["data", "code", "npcs"];
settings.playMode = 'dev'
settings.noTalkTo = false
settings.noAskTell = false
settings.givePlayerAskTellMsg  = false
settings.symbolsForCompass = true
settings.ifid = '3749B11B-0AAA-494B-B2C7-19E0A8E6EBCE'

settings.afterSave = function(filename) {
  if (hint.before('save')) {
    tmsg("Okay, we were not going to do saving until later, but whatever...")
    w.me.alreadySaved = true
  }
  else if (hint.before('westRobot')) {
    if (filename.toLowerCase() === 'tutorial') {
      tmsg("Great, we have saved the game - and you even followed my advice for the name. Now let's continue west down this passage.")
    }
    else {
      tmsg("Great, we have saved the game - though I am, a bit disappointed that you didn't followed my advice for the name... Oh, well, I guess we better continue west down this passage.")
    }
    hint.now('westRobot')
  }
}

settings.afterLoad = function() {
  if (!hint.before('westRobot')) {
    tmsg("Great, you not only saved the game, you loaded it too! I suggest you use the HINT command to see what to do next, and then you can get going with the tutorial again.")
  }
}

settings.intro = [
  "Your mission is to retrieve some files from the computer of Professor Kleinscope. His office is upstairs, but getting there will not be easy.",
]

settings.setup = function() {
  tmsg("This is a simple introduction to text adventures; comments like this will lead you by the hand as you do most of the common things in a text adventures (you can toggle these comments on and off with the TUTORIAL command).")
  tmsg("Text adventures are also known as interactive fiction, and there are numerous formats. This is about parser-based game, which is to say, a game where the user types commands, and the game attempts to parse the command, and update the game world accordingly.")
  tmsg("There is also a huge variety of parser-based games, but most start with some introductory text, as above, and then place the player in a starting location, so let's see where we are...")
  tmsg("I suggest you type WAIT now (by he way, I will give commands you type in capitals; you can use upper or lower case as you prefer -input is not case sensitive).")
}

settings.roomTemplate = [
  "#{cap:{hereName}}",
  "{terse:{hereDesc}}",
  "{objectsHere:You can see {objects} here.}",
]
