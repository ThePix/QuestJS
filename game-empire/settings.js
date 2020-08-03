"use strict";

// About your game
settings.title = "Nation!";
settings.author = "The Pixie"
settings.version = "0.1";
settings.thanks = [];
settings.files = ["code", "data", "npcs"]
settings.libraries.push('board')




settings.setup = function() {
  const boardSettings = {
    cellSize:40,
    size:11,
    height:400,
    width:1000,
    angle:75,
    offsetX:20,
    offsetY:25,
    baseHeight:100,
    compass:true,
    title:'The Game!',
    titleStyle:'font: 20pt bold',
    getColourAt:function(x, y) {
      return this.map[x][y].colour
    },
    getFeaturesAt:function(x, y) {
      if (x === 3 && y === 7) return ['black']
      if (x === 8 && y === 1) return ['yellow', 'green']
      if (x === 0 && y === 0) return ['go']
      return []
    },
    features:{
      go:{width:30, height:30, flatFile:'square_one.png',},
      black:{width:30, height:60, x:0, y:-2, file:'icon_man.png',},
      blue:{width:30, height:60, x:5, y:0, file:'icon_man_blue.png',},
      red:{width:30, height:60, x:10, y:2, file:'icon_man_red.png',},
      yellow:{width:30, height:60, x:-5, y:4, file:'icon_man_yellow.png',},
      green:{width:30, height:60, x:-10, y:6, file:'icon_man_green.png',},
      text2:{text:'Something', style:"font-weight:bold", colour:"orange",},
      text:{width:30, height:60, script:function(x, y) {
        return '<text x="' + x + '" y="' + (y-5) + '" style="font-weight:bold;text-anchor:middle" fill="orange">Grumpy!</text>'
      }},
    },
    map:[],
  }
  
  for (let x = 0; x < boardSettings.size; x++) {
    const row = []
    for (let y = 0; y < boardSettings.size; y++) {
      row.push({colour:'green'})
    }
    boardSettings.map.push(row)
  }
  
  // need to add:
  // three rivers, going from 0,size to size,0
  // sea filling size,0 corner
  // forest area
  // desert area
  // mountain area filling 0,size corner
  // four towns and one city, some on rivers
  
  board.setup(boardSettings)
}



