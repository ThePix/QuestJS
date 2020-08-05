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
    cellSize:20,
    size:nation.size,
    height:400,
    width:1000,
    angle:75,
    offsetX:20,
    offsetY:25,
    baseHeight:100,
    compass:true,
    title:'The Game!',
    showRegions:false,
    titleStyle:'font: 20pt bold',
    defs:function() {
      let s = '  <filter id="displacementFilter"><feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence"/>'
      s += '<feDisplacementMap in2="turbulence" in="SourceGraphic" scale="50" xChannelSelector="R" yChannelSelector="G"/></filter>'
      s += ' <animate xlink:href="#displacementFilter" id="anim-dialiate" attributeName="scale" from="40" to="0" dur="3s" fill="freeze"/>'
      return s
    },
    extras:function() {
      let s = '<circle cx="820" cy="70" r="12" fill="'
      s += (this.showRegions ? 'orange' : 'green') + '" onclick="toggleregion()"/>'
      s += '<text x="850" y="80" fill="black">Click to toggle region display</text>'
      s += '<circle cx="820" cy="140" r="30" fill="yellow" style="filter: url(#displacementFilter)"/>'
      return s
    },
    getColourAt:function(x, y) {
      if (this.showRegions) {
        for (let el of nation.regions) {
          if (el.contains(x, y)) return el.colour
        }
      }
      else {
        for (let el of nation.regions) {
          if (el.cityAt(x, y)) return 'grey'
        }
      }
      return nation.map[x][y].colour
    },
    getFeaturesAt:function(x, y) {
      if (x === 3 && y === 7) return ['black']
      if (x === 8 && y === 1) return ['yellow', 'green']
      if (x === 0 && y === 0) return ['go']
      return []
    },
    getLeftBorder:function(x, y) {
      if (nation.map[x][y].riverLeft) return 'stroke="blue" stroke-width="' + nation.map[x][y].riverLeft + '"'
      return false
    },
    getRightBorder:function(x, y) {
      if (nation.map[x][y].riverRight) return 'stroke="blue" stroke-width="' + nation.map[x][y].riverRight + '"'
      return false
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
  }
  
  // need to add:
  // three rivers, going from 0,size to size,0
  // sea filling size,0 corner
  // forest area
  // desert area
  // mountain area filling 0,size corner
  // four towns and one city, some on rivers
  
  board.setup(boardSettings)
  
  msg('So here you are in your own throne room...')
  msg('Becoming the ruler was quite a surprise, but after the goblin hoard wiped out the entire royal family, you were next in line. Your realm is one of the smallest kingdoms on the continent, and it is still reeling from a goblin invasion, so it will be no easy task. Oh, and some of your subjects are demanding a republic...')
  metamsg('This game is about ruling you kingdom wisely - or not. You will need to talk to your advisors to learn what needs doing, and give them orders to get it done. They are not all necessarily to be trusted...')
  metamsg('Use the SLEEP command in your bedroom to have time pass (i.e., tale a turn). You may want to use the HELP command too.')
  metamsg('Good luck, your majesty.')
}



