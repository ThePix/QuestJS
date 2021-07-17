"use strict"

settings.title = "No Compass"
settings.author = "The Pixie"
settings.version = "0.1"
settings.thanks = []
settings.warnings = "No warnings have been set for this game."
settings.playMode = "dev"

settings.compassPane = false

settings.setup = function() {
  let html = '<div></div>'
  createPaneBox(2, "Go to", html, 'directions')
  settings.updateCustomUI()
}

settings.updateCustomUI = function() {
  let html = ''
  for (const ex of currentLocation.getExits({excludeLocked:true})) {
    const dest = w[ex.name]
    html += '<div style="margin-bottom: 10px;"><p class="item" onclick="runCmd(\'' + ex.dir + '\')">' + dest.headingAlias + '</p></div>'
  }
  $('#directions').html(html)
}

