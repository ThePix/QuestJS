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

  Object.assign(document.querySelector('#quest-image').style, imagePane.defaultStyle, settings.imageStyle)
  settings.imageHeight = parseInt(settings.imageStyle.height)
  settings.imageWidth = parseInt(settings.imageStyle.width)
  
  // Set the default values for settings
  for (let key in imagePane.defaults) {
    if (!settings[key]) settings[key] = imagePane.defaults[key]
  }
}

imagePane.hide = function() { document.querySelector('#quest-image').style.display = 'none' }
imagePane.show = function() { document.querySelector('#quest-image').style.display = 'block' }



new Cmd('MetaImages', {
  script:function() {
    if (settings.hideImagePane) {
      document.querySelector('#quest-images').style.display = 'block'
      delete settings.hideImagePane
    }
    else {
      document.querySelector('#quest-images').style.display = 'none'
      settings.hideImagePane = true
    }
    io.calcMargins()
    msg(lang.done_msg)
  },
})



