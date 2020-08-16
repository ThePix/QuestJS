"use strict";



/*
Have one prototype dungeon room with six exits, and disable exits as appropriate
Have themes and regions
Whether an exit is present is set by exit_???, and its type by exit_???_type

*/

const dungeon = {
  size:6,
  cellSize:50,
  mapSize:550,
  mapOffset:50,
  mapOptions:{showUpDown:true, showYouAreHere:true, show:false},
  cellpercentage:80,
  exitpercentage:80,
  themescount:10,
  dirs:[
    lang.exit_list.find(el => el.name === 'north'),
    lang.exit_list.find(el => el.name === 'east'),
    lang.exit_list.find(el => el.name === 'south'),
    lang.exit_list.find(el => el.name === 'west'),
  ],
  shapes:[
    {
      name:'ew rectangle',
      descs:['A fair-sized east-west room.', 'This room is retangular.'],
      adjective:'rectangular',
      draw:function(x, y, fill) {
        return '<rect x="' + (x + 5) + '" y="' + (y + 15) + '" width="40" height="20" stroke="none" fill="' + fill + '"/>'
      },
    },
    {
      name:'ns rectangle',
      descs:['This rectangular room goes north-south.', 'An oblong room, going north-south.'],
      adjective:'rectangular',
      draw:function(x, y, fill) {
        return '<rect x="' + (x + 15) + '" y="' + (y + 5) + '" width="20" height="40" stroke="none" fill="' + fill + '"/>'
      },
    },
    {
      name:'circle',
      descs:['A circular room.', 'This is a smaller room, the walls forming a circle.'],
      adjective:'circular',
      draw:function(x, y, fill) {
        return '<circle cx="' + (x + 25) + '" cy="' + (y + 25) + '" r="15" stroke="none" fill="' + fill + '"/>'
      },
    },
    {
      name:'square',
      descs:['A square room.', 'This room looks square.'],
      adjective:'square',
      draw:function(x, y, fill) {
        return '<rect x="' + (x + 5) + '" y="' + (y + 5) + '" width="40" height="40" stroke="none" fill="' + fill + '"/>'
      },
    },
    {
      name:'small square',
      descs:['A small, square room.', 'Small and square.'],
      adjective:'square',
      draw:function(x, y, fill) {
        return '<rect x="' + (x + 10) + '" y="' + (y + 10) + '" width="30" height="30" stroke="none" fill="' + fill + '"/>'
      },
    },
    {
      name:'octagon',
      descs:['This eight-sided room is pretty large.', 'An sizable, octagonal room.'],
      adjective:'octagonal',
      draw:function(x, y, fill) {
        let s = '<polygon points="'
        s += (x + 5) + ',' + (y + 17) + ' '
        s += (x + 5) + ',' + (y + 33) + ' '
        s += (x + 17) + ',' + (y + 45) + ' '
        s += (x + 33) + ',' + (y + 45) + ' '
        s += (x + 45) + ',' + (y + 33) + ' '
        s += (x + 45) + ',' + (y + 17) + ' '
        s += (x + 33) + ',' + (y + 5) + ' '
        s += (x + 17) + ',' + (y + 5) + ' '
        s += '" stroke="none" fill="' + fill + '"/>'
        return s
      }
    }
  ],
  corridor:{
    name:'corridor',
    draw:function(x, y, fill) {
      return '<rect x="' + (x + 20) + '" y="' + (y + 20) + '" width="10" height="10" stroke="none" fill="blue"/>'
    }
  },
    
}  



//  Master function to generate the whole level.
dungeon.generateLevel = function(from_room) {
  console.log('About to generate...')
  const limit = (dungeon.size - 1) / 2
  const level = from_room.level + 1
  let theme
  if (3 > level) {
    theme = 'e_dungeon'
  }
  else if (random.chance(50)) {
    theme = from_room.theme
  }
  else if (random.chance(50)) {
    theme = 'e_dungeon'
  }
  else {
    theme = random.fromArray(['e_dungeon'])
  }
  dungeon.generateBasicRooms(level, theme)
  console.log('Rooms created')
  dungeon.setUpCentreRoom(level, from_room)
  const levellist = dungeon.checkConnectivity(level)
  const waydown = dungeon.setWayDown(levellist)
  console.log('About to decorate ' + levellist.length)
  for (let room of levellist) {
    dungeon.decorateRoom(room)
  }
  //list remove (levellist, waydown)
  //Populate (levellist, level)
}



dungeon.decorateRoom = function(room, level, theme) {
  room.theme = theme
  const exits = room.getExits()
  if ((room.x === 0 && room.y === 0) || (exits.length === 1) || random.chance(25) || room.exit_down) {
    room.roomType = random.fromArray(dungeon.shapes)
    room.desc = random.fromArray(room.roomType.descs)
    
    if (exits.length === 1) {
      room.desc += ' The only exit is ' +  arrayAtts(exits) + '.'
    }
    else {
      room.desc += ' There are exits '
      room.desc += formatList(arrayAtts(exits), {lastJoiner:" and "})
      room.desc += '.'
    }
  }
  else {
    room.roomType = dungeon.corridor
    if (exits.length === 4) {
      room.desc = 'Two tunnels meet and cross.'
    }
    if (exits.length === 3) {
      if (!room.exit_north) room.desc = 'A tunnel from the south meets one going east to west.'
      if (!room.exit_east) room.desc = 'You are at a junction between a tunnel from the west and another going north to south.'
      if (!room.exit_south) room.desc = 'A tunnel going east to west has a side passage to the north.'
      if (!room.exit_west) room.desc = 'This is an intersection between a tunnel from the east and another going north to south.'
    }
    if (exits.length === 2) {
      if (room.exit_north && room.exit_south) {
        room.desc = 'You are stood in a passage going north to south.'
      }
      else if (room.exit_east && room.exit_west) {
        room.desc = 'You are stood in a tunnel that runs from east to west.'
      }
      else
        room.desc = 'The tunnel turns a corner here, going ' + formatList(room.getExits().map(el => el.name), {def:"a", joiner:" and"}) + '.'
    }
    
  }
}



// Creates each room of the level.
// Rooms are created in a grid, with a random chance of being there depending
// on the distance from the centre.
dungeon.generateBasicRooms = function(level, theme) {
  for (let x = -dungeon.size; x <= dungeon.size; x++) {
    for (let y = -dungeon.size; y <= dungeon.size; y++) {
      //console.log('x=' + x + ' y=' + y + ' p=' + (100 - dungeon.cellpercentage * dungeon.fromCentre(x, y) / dungeon.size))
      if (random.chance(100 - dungeon.cellpercentage * dungeon.fromCentre(x, y) / dungeon.size)) {
        dungeon.generateBasicRoom(level, x, y, theme)
      }
    }
  }
}


// Creates a single room with default values.
// Also creates exits to south and west if there is a room there and at random.
dungeon.generateBasicRoom = function(level, x, y, theme) {
  const name = dungeon.getRoomName(x, y, level)
  //console.log(name)
  const name_west = dungeon.getRoomName(x - 1, y, level)
  const name_south = dungeon.getRoomName(x, y - 1, level)
  const room = cloneObject("dungeon_cell_prototype", undefined, name)
  //console.log(room)
  room.accessible = false
  room.alias = "Lost in a dungeon"
  room.level = level
  room.x = x
  room.y = y
  const room_west = w[name_west]
  if (room_west !== undefined && random.chance(dungeon.exitpercentage)) {
    room.exit_west = true
    room_west.exit_east = true
    room_west.exit_east_type = room.exit_west_type = random.int(dungeon.themescount)
  }
  const room_south = w[name_south]
  if (room_south !== undefined && random.chance(dungeon.exitpercentage)) {
    room.exit_south = true
    room_south.exit_north = true
    room_south.exit_north_type = room.exit_south_type = random.int(dungeon.themescount)
  }
  w[name] = room
}



// Checks all rooms are connected, deleting any that are not.
dungeon.checkConnectivity = function(level) {
  // loop through each room, flagging those that are connected
  // keep going until no new ones are flagged
  w[dungeon.getRoomName(0, 0, level)].accessible = true
  let flag = true
  while (flag) {
    console.log("LOOP")
    flag = false
    for (let x = -dungeon.size; x <= dungeon.size; x++) {
      for (let y = -dungeon.size; y <= dungeon.size; y++) {
        const room = w[dungeon.getRoomName(x, y, level)]
        if (room !== undefined && room.accessible) {
          flag = flag || dungeon.flagAllAdjacent(room)
        }
      }
    }
  }

  // now delete rooms that are not accessible
  // and pick the way to next level
  const levellist = []
  for (let x = -dungeon.size; x <= dungeon.size; x++) {
    for (let y = -dungeon.size; y <= dungeon.size; y++) {
      const room = w[dungeon.getRoomName(x, y, level)]
      if (room !== undefined) {
        if (!room.accessible) {
          delete w[room.name]
        }
        else {
          levellist.push(room)
        }
      }
    }
  }
  return levellist
}  
  
  
// Picks a room to be the way down.
dungeon.setWayDown = function(levellist) {
  const sublist = []
  let dist = 7
  while (sublist.length === 0) {
    for(let o of levellist) {
      if (dungeon.fromCentre(o.x, o.y) > dist) sublist.push(o)
    }
    dist--
    //msg(dist)
  }
  const waydown = random.fromArray(sublist)
  waydown.exit_down = true
  return (waydown)
}


dungeon.fromCentre = function(x, y) {
  return Math.abs(x) + Math.abs(y)
}


dungeon.getRoomName = function(x, y, level) {
  return "cell_" + x + "_" + y + "_" + level
}


dungeon.exitCount = function(room) {
  let count = 0
  for (let dir of dungeon.dirs) {
    if (room['exit_' + dir.name]) count++
  }
  return count
}    



dungeon.flagAllAdjacent = function(room) {
  let flag = false
  for (let dir of dungeon.dirs) flag = flag || dungeon.flagAdjacent(room, dir)
  return flag
}    

// Attempts to find the adjacent room in the given direction.
// Returns false if there is no room or if there is no exit from this room to that room.
// Expects dir to be a dictionary from lang.exit_list
dungeon.findAdjacent = function(room, dir) {
  if (!room['exit_' + dir.name]) return (false)
  return w[dungeon.getRoomName(room.x + dir.x, room.y + dir.y, room.level)]
}



// Attempts to flag the room in the given direction as accessible.
// Returns false if there is no room, or if it is already flagged, true otherwise.
// Expects dir to be a dictionary from lang.exit_list
dungeon.flagAdjacent = function(room, dir) {
  const adj = dungeon.findAdjacent(room, dir)
  if (!adj || adj.accessible) return false
  adj.accessible = true
  return true
}



//Mostly just creates an exit from the centre to the from_room.
dungeon.setUpCentreRoom = function(level, from_room) {
  const centreroom = w[dungeon.getRoomName(0, 0, level)]
  centreroom.exit_up = true
  from_room.exit_down = true
}




dungeon.drawMap = function() {
  if (!dungeon.mapOptions.show) {
    metamsg('You do not have a map.')
    return
  }
    
  const room = w[game.player.loc]
  console.log(room)
  if (!room.level) {
    metamsg('No map available here.')
    return
  }
  
  //if (w[this.getRoomName(0, 0, room.level)] === undefined) return false
  
  const map = []
  map.push('<defs><marker id="head" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="black" /></marker></defs>')
  
  
  map.push('<rect x="0" y="0" width="' + dungeon.mapSize + '" height="' + dungeon.mapSize + '" stroke="black" fill="none"/>')
  for (let x = -this.size; x <= this.size; x++) {
    for (let y = -this.size; y <= this.size; y++) {
      const r = w[this.getRoomName(x, y, room.level)]
      if (r === undefined) continue
      map.push(r.getSvg((x + this.size) * this.cellSize - dungeon.mapOffset, (this.size - y) * this.cellSize - dungeon.mapOffset))
    }
  }
  map.push('<text x="15" y="35" fill="black" font-size="2em">Level ' + room.level + '</text>')

  if (room.x !== undefined && dungeon.mapOptions.showYouAreHere) {
    map.push('<text x="75" y="' + (dungeon.mapSize - 20) + '" text-anchor="middle" fill="black" font-size="1.5em">You are here</text>')
    const x2 = (room.x + this.size + 0.3) * this.cellSize - dungeon.mapOffset
    const y2 = (this.size - room.y + 0.7) * this.cellSize - dungeon.mapOffset
    map.push('<line x1="75" y1="' + (dungeon.mapSize - 35) + '" x2="' + x2 + '" y2="' + y2 + '" stroke="black" marker-end="url(#head)"/>')
  }
  //if (this.mapBorder) 
  draw(dungeon.mapSize, dungeon.mapSize, map)
  return true
}  
  

const showMap = function() {
  dungeon.drawMap()
}


createRoom('entrance', {
  level:0,
  theme:0,
  desc:'The stairs go down...',
  down:new Exit(dungeon.getRoomName(0, 0, 1)),
  afterFirstEnter:function() {
    dungeon.generateLevel(this)
  },
})


dungeon.exitScript = function(char, dirName) {
  const origin = w[char.loc]
  if (!origin.hasExit(dirName)) {
    msg('You can\'t go ' + dirName)
    return false
  }

  const dir = lang.exit_list.find(el => el.name === dirName)
  
  // up and down are different!!!
  const dest = w[dungeon.getRoomName(origin.x + dir.x, origin.y + dir.y, origin.level)]
    
  msg(lang.stop_posture(char));
  msg(lang.go_successful(char, dirName));
  world.setRoom(char, dest)
  return true
}


createRoom('dungeon_cell_prototype', {
  level:0,
  theme:0,
  desc:'The stairs go down...',
  down:new Exit('entrance', {use:dungeon.exitScript}),
  up:new Exit('entrance', {use:dungeon.exitScript}),
  north:new Exit('entrance', {use:dungeon.exitScript}),
  south:new Exit('entrance', {use:dungeon.exitScript}),
  east:new Exit('entrance', {use:dungeon.exitScript}),
  west:new Exit('entrance', {use:dungeon.exitScript}),
  afterFirstEnter:function() {
    if (this.exit_down) {
      dungeon.generateLevel(this)
    }
  },

  getExits:function(options) {
    const exits = []
    for (let ex of lang.exit_list) {
      if (ex.type !== 'nocmd' && this.hasExit(ex.name, options)) {
        exits.push(ex)
      }
    }
    return exits
  },
  
  hasExit:function(dir, options) {
    if (!this[dir]) return false;
    return this['exit_' + dir]
  },

  getSvg:function(x, y) {
    const fill = (this.exit_up || this.exit_down) && dungeon.mapOptions.showUpDown ? 'yellow' : 'red'
    //const fill = this.accessible ? 'yellow' : 'red'
    let s = ''
    if (this.exit_south) s += '<rect x="' + (x + 20) + '" y="' + (y + 30) + '" width="10" height="20" stroke="none" fill="blue"/>'
    if (this.exit_east) s += '<rect x="' + (x + 30) + '" y="' + (y + 20) + '" width="20" height="10" stroke="none" fill="blue"/>'
    if (this.exit_north) s += '<rect x="' + (x + 20) + '" y="' + (y) + '" width="10" height="20" stroke="none" fill="blue"/>'
    if (this.exit_west) s += '<rect x="' + (x) + '" y="' + (y + 20) + '" width="20" height="10" stroke="none" fill="blue"/>'
    s += this.roomType.draw(x, y, fill)
    if (dungeon.mapOptions.showUpDown) {
      if (this.exit_up) s += '<text text-anchor="middle" x="' + (x + dungeon.cellSize/2) + '" y="' + (y + 30) + '" fill="black">Up</text>'
      if (this.exit_down) s += '<text text-anchor="middle" x="' + (x + dungeon.cellSize/2) + '" y="' + (y + 30) + '" fill="black">Down</text>'
    }
    return s
  },    
})


