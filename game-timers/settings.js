"use strict"

settings.title = "Your new game"
settings.author = "Your name here"
settings.version = "0.1"
settings.thanks = []
settings.warnings = "No warnings have been set for this game."
settings.playMode = "dev"

settings.symbolsForCompass = true
settings.themes = ['sans-serif']

settings.eventFunctions = {
  sayNow:function() {
    msg("Now!")
    io.scrollToEnd()
  },

  sayThen:function() {
    msg("Then!")
    io.scrollToEnd()
  },

  sayOften:function() {
    if (!game.player.count) game.player.count = 0
    game.player.count++
    msg("Often! " + game.player.count)
    io.scrollToEnd()
    if (game.player.count > 3) return true
  },
}

settings.setup = function() {
  util.registerTimerEvent("sayNow", 2, 2)
  util.registerTimerEvent("sayThen", 10)
  util.registerTimerEvent("sayOften", 3, 3)
}