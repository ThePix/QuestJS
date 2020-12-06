"use strict";

settings.title = "Desert"
settings.author = "The Pixie"
settings.version = "1.0"
settings.thanks = ["Kyle", "Lara"]

settings.noTalkTo = false
settings.noAskTell = false

settings.tests = true

settings.textEffectDelay = 100

settings.imagesFolder = 'images/'
settings.files = ["code", "data", "npcs"]

settings.panes = 'left'
settings.statusPane = false

settings.roomTemplate = [
  "{hereDesc}",
  "{objectsHere:You can see {objects} here.}",
]

settings.intro = "You wake up, and realise the bus has stopped."

settings.libraries.push('zone')