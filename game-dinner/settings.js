"use strict"

settings.title = "The Dinner Party"
settings.author = "The Pixie"
settings.version = "0.1"
settings.thanks = []
settings.warnings = "This is about eating dinner, so those with food issue might want to be careful, though it does not go into much detail about the food; it is really about the people."
settings.playMode = "dev"

settings.symbolsForCompass = true

settings.setup = function() {
  console.log(w.dinner_timetable.steps)
  console.log(w.dinner_timetable.steps.length)
  util.verifyResponses(w.dinner_timetable.steps)
}

settings.toolbar = {
  content:function() { return `Hitpoints : 100` },
  roomdisplay: true,
  buttons:[
    { title: "About", icon: "fa-info", cmd: "about" },
    { id: "about", title: "About", icon: "fa-info", cmd: "about", href: "#" },
    { id: "save", title: "Save", icon: "fa-save", cmd: "save saved_game", href: "#" },
    { id: "print", title: "Print", icon: "fa-print", onclick: "#", href: "#" },
  ],
}
