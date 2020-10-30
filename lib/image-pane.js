"use strict"




const imagePane = {
  toggle:true,
  defaults:{
    imageStyle:{
      right:'0',
      top:'200px',
      width:'400px',
      height:'400px',
      'background-color':'#ddd', 
      border:'3px black solid',
    },
  }
}



imagePane.defaultStyle = {position:'fixed', display:'block'}
io.modulesToInit.push(imagePane)

imagePane.init = function() {
  // First set up the HTMP page
  $('#quest-image').css(imagePane.defaultStyle)
  $('#quest-image').css(settings.imageStyle)
  settings.imageHeight = parseInt(settings.imageStyle.height)
  settings.imageWidth = parseInt(settings.imageStyle.width)
  
  // Set the default values for settings
  for (let key in imagePane.defaults) {
    if (!settings[key]) settings[key] = imagePane.defaults[key]
  }
}

imagePane.hide = function() { $('#quest-image').hide() }
imagePane.show = function() { $('#quest-image').show() }



commands.unshift(new Cmd('MetaImages', {
  script:function() {
    if (settings.hideImagePane) {
      $('#quest-images').show()
      delete settings.hideImagePane
    }
    else {
      $('#quest-images').hide()
      settings.hideImagePane = true
    }
    msg(lang.done_msg)
  },
}))



