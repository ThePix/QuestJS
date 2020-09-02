"use strict";




comands.unshift(new Cmd('wait3', {
  regex:/^^wait$|^z$$/,
  objects:[
    {ignore:true},
    {scope:parser.isHere},
  ],
  script:
          if (game.invaded) {
            msg ("'Well, get going, Jenina,' says the painting. 'You're not going to sort this out just standing their like a bewildered sheep.'")
          }
          else {
            msg ("'Shape yourself, Jenina,' says the painting. 'You've lots to do.'")
          }
        }))

comands.unshift(new Cmd('wait2', {
  regex:/^^wait$|^z$$/,
  objects:[
    {ignore:true},
    {scope:parser.isHere},
  ],
  script:
      if (game.invaded) {
        msg ("No time for hanging around...")
      }
      else {
        msg ("Time passes...")
      }
    }))