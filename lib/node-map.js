"use strict"


const map = {
  toggle:true,
  defaults:{
    mapCellSize:20,
    mapScale:25,
    mapLocationColour:'yellow',
    mapBorderColour:'black',
    mapTextColour:'black',
    mapExitColour:'#444',
    mapExitWidth:3,
    mapLabelOffset:15,
    mapLabelColour:'black',
  }
}
map.defaultStyle = {position:'fixed', display:'block'}  // !!!!!!!!!!!!!!
io.modulesToUpdate.push(map)
io.modulesToInit.push(map)

// Authors can override this so there are several starting locations if there are isolated regions
map.getStartingLocations = function() {
  const starts = settings.mapAutomapFrom ? settings.mapAutomapFrom.map(el => w[el]) : [w[player.loc]]
  let count = 0
  for (let start of starts) {
    start.mapX = 0
    start.mapY = 0
    start.mapZ = 0
    start.mapRegion = count
    count++
  }
  return starts
}



map.transitUpdate = function(location, transitButton, callEvent) {
  location.mapCurrentConnection = location.locations.findIndex(el => el.connectedRoom.name === transitButton.transitDest)
  if (location.mapCurrentConnection === -1) {
    errormsg('Failed to find a location called "' + transitButton.transitDest + '"')
    console.log(location.locations)
    return
  }
  const loc = location.locations[location.mapCurrentConnection]
  
  // set these so we can get the player location
  location.mapX = loc.mapX
  location.mapY = loc.mapY
  location.mapZ = loc.mapZ
  location.mapRegion = loc.mapRegion
}



map.init = function() {
  // First set up the HTMP page
  Object.assign(document.querySelector('#quest-map').style, map.defaultStyle, settings.mapStyle)
  //document.querySelector("<style>")
  //    .prop("type", "text/css")
  //    .innerHTML = ".map-text " + util.dictionaryToCss(settings.mapLabelStyle, true)
  //    .appendTo("head")
  //document.querySelector('.map-text').style.color = 'red'
  settings.mapHeight = parseInt(settings.mapStyle.height)
  settings.mapWidth = parseInt(settings.mapStyle.width)
  
  // Set the default values for settings
  for (let key in map.defaults) {
    if (!settings[key]) settings[key] = map.defaults[key]
  }  
  
  // rooms is a list of rooms to be mapped
  // set it up with some seed rooms
  const rooms = settings.mapGetStartingLocations ? settings.mapGetStartingLocations() : map.getStartingLocations()
  
  // go through each room in the list
  while (rooms.length > 0) {
    // get the next room
    const room = rooms.shift()
    
    
    // go through each exit
    for (let dir of lang.exit_list) {
      // we are only interested in compass and vertical, and if the exit exists
      if (dir.type !== 'compass' && dir.type !== 'vertical') continue
      if (!room.hasExit(dir.name)) continue
      
      // For this exit, skip if flagged to ignore or points to non-room
      const exit = room[dir.name]
      if (exit.mapIgnore) continue
      if (exit.name === '_') continue
      
      // For the exit destination, skip if flagged to ignore
      // otherwise map it
      const exitRoom = w[exit.name]
      if (!exitRoom) throw new Error("Mapping to unknown exit: " + exit.name)
      if (exitRoom.mapIgnore) {
        exit.mapIgnore = true
        continue
      }
      if (exitRoom.mapMoveableLoc || room.mapMoveableLoc) {
        exit.mapMoveableLoc = true
        map.mapMultiRoomFromExit(room, exitRoom, exit, dir)
      }
      else {
        map.mapRoomFromExit(room, exitRoom, exit, dir, rooms)
      }
      if (exitRoom.mapMoveableLoc && !exitRoom.mapDraw) {
        exitRoom.mapDraw = map.moveableLocDraw
      }
    }
  }

  map.layers = [
    // rooms on other levels
    {name:'otherLevels', attrs:'stroke="' + settings.mapBorderColour + '" stroke-width="1" fill="' + settings.mapLocationColour + '" opacity="0.2" pointer-events="none"'},
    // exits
    {name:'exits', attrs:'style="stroke:' + settings.mapExitColour + ';stroke-width:' + settings.mapExitWidth + 'px;fill:' + settings.mapExitColour + '"'},
    // rooms on this level
    {name:'base', attrs:'stroke="' + settings.mapBorderColour + '" stroke-width="1" fill="' + settings.mapLocationColour + '"'},
    // features (anything the author might want to add)
    {name:'features', attrs:''},
    // labels
    {name:'labels', attrs:'pointer-events="none" fill="' + settings.mapLabelColour + '" text-anchor="middle"'},
  ]

}

// Mapping from room to exitRoom, exit is the exit linking the two, dir is an object from lang.exit_list
map.mapRoomFromExit = function(room, exitRoom, exit, dir, rooms) {
  //console.log(exit)
  const offsetX = (exit.mapOffsetX ? exit.mapOffsetX : dir.x) * settings.mapScale
  const offsetY = (exit.mapOffsetY ? exit.mapOffsetY : dir.y) * settings.mapScale
  const offsetZ = (exit.mapOffsetZ ? exit.mapOffsetZ : dir.z)
  //console.log('' + offsetX + ', ' + offsetY + ', ' + offsetZ)
  if (exitRoom.mapX === undefined) {
    // if room not done, set coords, add to rooms
    if (!exitRoom.mapIgnore) {
      exitRoom.mapX = room.mapX + offsetX
      exitRoom.mapY = room.mapY - offsetY
      exitRoom.mapZ = room.mapZ + offsetZ
      exitRoom.mapRegion = room.mapRegion
      if (rooms) rooms.push(exitRoom)
      //console.log("Rooms: " + rooms.map(el => el.name).join(', '))
    }
    //console.log(exitRoom)
  }
  else {
    // if done, check coords and alert if dodgy
    if (exitRoom.mapX !== room.mapX + offsetX) {
      console.log("WARNING: Mapping exit from " + room.name + " to " + exit.name + " - funny X offset (" + exitRoom.mapX + " vs " + (room.mapX + offsetX) + ")")
      console.log(room)
      console.log(exitRoom)
      console.log(exit.mapOffsetX)
      console.log(dir.x)
      console.log('' + offsetX + ', ' + offsetY + ', ' + offsetZ)
    }
    if (exitRoom.mapY !== room.mapY - offsetY) console.log("WARNING: Mapping exit from " + room.name + " to " + exit.name + " - funny Y offset (" + exitRoom.mapY + " vs " + (room.mapY + offsetY) + ")")
    if (exitRoom.mapZ !== room.mapZ + offsetZ) console.log("WARNING: Mapping exit from " + room.name + " to " + exit.name + " - funny Z offset")
  }
}




// Mapping from room to exitRoom, exit is the exit linking the two, dir is an object from lang.exit_list
// Use when exitRoom is multi-location, so is not to be added to the room list, and needs to know each location
map.mapMultiRoomFromExit = function(room, exitRoom, exit, dir) {
  //console.log(exit)
  const offsetX = (exit.mapOffsetX ? exit.mapOffsetX : dir.x) * settings.mapScale
  const offsetY = (exit.mapOffsetY ? exit.mapOffsetY : dir.y) * settings.mapScale
  const offsetZ = (exit.mapOffsetZ ? exit.mapOffsetZ : dir.z)
  //console.log('' + offsetX + ', ' + offsetY + ', ' + offsetZ)
  if (exitRoom.locations === undefined) exitRoom.locations = []
  exitRoom.mapRegion = true
  const loc = {}
  if (!exitRoom.mapIgnore) {
    loc.mapX = room.mapX + offsetX
    loc.mapY = room.mapY - offsetY
    loc.mapZ = room.mapZ + offsetZ
    loc.mapRegion = room.mapRegion
    loc.connectedRoom = room
    //loc.connection = exit
    exitRoom.locations.push(loc)
  }
}



// Draw the map
// It collects all the SVG in five lists, which are effectively layers.
// This means all the exits appear in one layer, all the labels in another
// and so labels are always on top of exits
map.update = function() {
  // grab the current room region and level. If the room is missing either, give up now!
  const level = w[player.loc].mapZ
  const region = w[player.loc].mapRegion
  if (level === undefined || region === undefined) return
  if (w[player.loc].mapIgnore) return
  
  // Stuff gets put in any of several layers, which will be displayed in this order
  const lists = {}
  for (let el of map.layers) lists[el.name] = ['', '<g id="' + el.name + '-layer" ' + el.attrs + '>']

  // Loop through every room
  for (let key in w) {
    const room = w[key]
    // Do not map if in another region (if region is true, the room can handle it)
    // Only show if visited unless mapShowNotVisited
    if (room.mapRegion !== region && room.mapRegion !== true) continue
    if (!settings.mapShowNotVisited && !room.visited) continue
    // Call mapDraw on the room if it has that, otherwise the default version
    (room.mapDraw ? room : map).mapDraw(lists, region, level, room)
  }

  // Add it all together
  const result = settings.mapDefs ? settings.mapDefs() : []
  for (let key in lists) {
    for (let el of lists[key]) result.push(el)
    result.push('</g>')
  }
  //console.log(result)
  if (settings.mapExtras) result.push(...settings.mapExtras())
  result.push(settings.mapMarker ? settings.mapMarker(w[player.loc]) : map.marker(w[player.loc].mapX, w[player.loc].mapY))

  // Centre the view on the player, and draw it
  const x = w[player.loc].mapX - settings.mapWidth/2
  const y = -settings.mapHeight/2 + w[player.loc].mapY
  draw(settings.mapWidth, settings.mapHeight, result, {destination:'quest-map', x:x, y:y})
}
    

// The default draw function for a room
// Puts the various bits in the appropriate lists
map.mapDraw = function(lists, region, level, room) {

  // Location itself
  const destinationLayer = room.mapZ === level ? lists.base : lists.otherLevels
  if (room.mapDrawString) {
    destinationLayer.push(room.mapDrawString)
  }
  else if (room.mapDrawBase) {
    const s = room.mapDrawBase()
    if (!room.mapRedrawEveryTurn) room.mapDrawString = s
    destinationLayer.push(s)
  }
  else {
    destinationLayer.push(map.mapDrawDefault(room))
  }
  
  if (room.mapZ !== level) return

  // Exits
  for (let dir of lang.exit_list) {
    if (dir.type !== 'compass') continue
    if (!room.hasExit(dir.name)) continue
    const exit = room[dir.name]
    if (exit.mapIgnore) continue
    if (exit.name === '_') continue
    const exitRoom = w[exit.name]
    if (exit.mapDrawString) {
      lists.exits.push(exit.mapDrawString)
    }
    else if (exit.mapDrawBase) {
      lists.exits.push(exit.mapDrawBase(room, exitRoom, region, level))
    }
    else if (exit.mapMoveableLoc) {
      // For an exit going TO a mapMoveableLoc, 
      // assume a straight exit
      //console.log('here ' + room.name + ' ' + dir.name)
      let s = '<line x1="' + room.mapX + '" y1="' + room.mapY
      s += '" x2="' + (room.mapX + dir.x * settings.mapScale / 2) + '" y2="' + (room.mapY - dir.y * settings.mapScale / 2)
      if (exit.mapStyle) s += '" style="' + exit.mapStyle
      s += '"/>'
      exit.mapDrawString = s
      //console.log(s)
      lists.exits.push(s)
    }
    else {
      let s = '<line x1="' + room.mapX + '" y1="' + room.mapY
      s += '" x2="' + (exitRoom.mapX + room.mapX) / 2 + '" y2="' + (exitRoom.mapY + room.mapY) / 2
      if (exit.mapStyle) s += '" style="' + exit.mapStyle
      s += '"/>'
      if (!exit.mapRedrawEveryTurn) exit.mapDrawString = s
      lists.exits.push(s)
    }
  }
  
  // Features
  if (room.mapDrawFeatures) lists.features.push(room.mapDrawFeatures())
  
  // Labels
  if (!settings.mapDrawLabels) return 
  if (room.mapDrawLabelString) {
    lists.labels.push(room.mapDrawLabelString)
  }
  else if (room.mapDrawLabel) {
    const s = room.mapDrawLabel(region, level)
    if (!room.mapRedrawEveryTurn) room.mapDrawLabelString = s
    lists.labels.push(s)
  }
  else {
    lists.labels.push(map.mapDrawLabelDefault(room))
  }
}




// The default draw function for a multi-location room
// Puts the various bits in the appropriate lists
map.moveableLocDraw = function(lists, region, level, room) {
  for (let el of this.locations) {
    if (el.mapRegion !== region) continue
    // Location itself
    const destinationLayer = el.mapZ === level ? lists.base : lists.otherLevels
    // if a multi-location room, give it the special draw function
    destinationLayer.push(room.mapDrawBase ? room.mapDrawBase(level, el) : map.mapDrawDefault(room, el))

    // Exits
    for (let dir of lang.exit_list) {
      if (dir.type !== 'compass') continue
      if (!room.hasExit(dir.name)) continue
      const exit = room[dir.name]
      if (exit.mapIgnore) continue
      if (exit.name === '_') continue
      const exitRoom = w[exit.name]

      if (exit.mapDrawBase) {
        lists.exits.push(exit.mapDrawBase(room, exitRoom, region, level))
      }
      else if (dir.name === room.transitDoorDir) {
        // For an exit going FROM a mapMoveableLoc, 
        for (let el of room.locations) {
          if (el.mapZ !== level || el.mapRegion !== region) continue
        let s = '<line x1="' + el.mapX + '" y1="' + el.mapY
        s += '" x2="' + (el.mapX + dir.x * settings.mapScale / 2) + '" y2="' + (el.mapY - dir.y * settings.mapScale / 2)
        s += '"/>'
        lists.exits.push(s)
        }
      }
      else {
        let s = '<line x1="' + el.mapX + '" y1="' + room.mapY
        s += '" x2="' + (exitRoom.mapX + el.mapX) / 2 + '" y2="' + (exitRoom.mapY + el.mapY) / 2
        s += '"/>'
        lists.exits.push(s)
      }
    }
    
    // Features
    if (room.mapDrawFeatures) lists.features.push(room.mapDrawFeatures())
    
    // Labels
    if (!settings.mapDrawLabels || el.mapZ !== level) return 
    if (room.mapDrawLabelString) {
      lists.labels.push(room.mapDrawLabelString)
    }
    else if (room.mapDrawLabel) {
      const s = room.mapDrawLabel(region, level)
      if (!room.mapRedrawEveryTurn) room.mapDrawLabelString = s
      lists.labels.push(s)
    }
    else {
      lists.labels.push(map.mapDrawLabelDefault(room, el))
    }
  }
}





// loc has the coordinates, but defaults to o
// (used by moveableLocDraw)
map.mapDrawDefault = function(o, loc) {
  if (loc === undefined) loc = o
  const w = o.mapWidth ? o.mapWidth : settings.mapCellSize
  const h = o.mapHeight ? o.mapHeight : settings.mapCellSize
  let s = '<rect x="'
  s += loc.mapX - w/2
  s += '" y="'
  s += loc.mapY - h/2
  s += '" width="' + w + '" height="' + h
  if (o.mapColour) s += '" fill="' + o.mapColour
  s += '"' + map.getClickAttrs(o) + '/>'
  return s
}

map.getClickAttrs = function(o) {
  if (!settings.mapClick) return ''
  return ' onclick="settings.mapClick(\'' + o.name + '\')" cursor="pointer" role="button"'
}

map.mapDrawLabelDefault = function(o, loc) {
  if (loc === undefined) loc = o
  let s = '<text class="map-text" x="'
  s += loc.mapX
  s += '" y="'
  s += loc.mapY - settings.mapLabelOffset
  if (settings.mapLabelRotate) s += '" transform="rotate(' + settings.mapLabelRotate + ',' + loc.mapX + ',' + (loc.mapY - settings.mapLabelOffset) + ')'
  s += '">'
  s += o.mapLabel ? o.mapLabel : sentenceCase(o.alias)
  s += '</text>'
  return s
}



map.polygon = function(room, points, attrs) { return map.polyany('polygon', room, points, attrs) }
map.polyline = function(room, points, attrs) { return map.polyany('line', room, points, attrs) }
map.polyroom = function(room, points, attrs) { return map.polyany('room', room, points, attrs) }

map.polyany = function(type, room, points, attrs) {
  let s = '<poly' + (type === 'line' ? 'line' : 'gon') + ' points="'
  s += points.map(el => '' + (room.mapX + el[0]) + ',' + (room.mapY + el[1])).join(' ')
  s += '" '
  if (attrs) s += ' style="' + attrs + '"'
  if (type === 'room') s += map.getClickAttrs(room)
  s += '/>'
  //console.log(s)
  return s
}


map.rectRoom = function(room, points, attrs) { return map.rect(true, room, points, attrs) }
map.rectangle = function(room, points, attrs) { return map.rect(false, room, points, attrs) }

map.rect = function(isRoom, room, points, attrs) {
  let s = '<rect x="' + (room.mapX + points[0][0]) + '" y="' + (room.mapY + points[0][1])
  s += '" width="' + points[1][0] + '" height="' + points[1][1] + '"'
  if (attrs) s += ' style="' + attrs + '"'
  if (isRoom) s += map.getClickAttrs(room)
  s += '/>'
  return s
}

map.ellipse = function(isRoom, room, points, attrs) {
  let s = '<ellipse cx="' + (room.mapX + points[0][0]) + '" cy="' + (room.mapY + points[0][1])
  s += '" rx="' + points[1][0] + '" ry="' + points[1][1] + '"'
  if (attrs) s += ' style="' + attrs + '"'
  if (isRoom) s += map.getClickAttrs(room)
  s += '/>'
  return s
}

map.text = function(room, st, points, attrs) {
  let s = '<text x="' + (room.mapX + points[0]) + '" y="' + (room.mapY + points[1]) + '"'
  if (attrs) s += ' style="' + attrs + '"'
  s += ' text-anchor="middle">' + st + '</text>'
  //console.log(s)
  return s
}

map.bezier = function(room, points, attrs) {
  let s = '<path d="M '
  s += (room.mapX + points[0][0]) + ' ' + (room.mapY + points[0][1])
  points.shift()
  s += points.length === 2 ? ' q ' : ' c '
  s += points.map(el => '' + el[0] + ' ' + el[1]).join(' ')
  s += '" '
  if (attrs) s += ' style="' + attrs + '"'
  s += '/>'
  //console.log(s)
  return s
}




map.marker = function(x, y) {
  let s = '<circle cx="'
  s += x
  s += '" cy="'
  s += y
  s += '" r="5" stroke="black" fill="blue"/>'
  return s
}


if (settings.playMode === 'dev') {
  new Cmd('DebugMap', {
    regex:/^debug map$/,
    objects:[
    ],
    script:function() {
      for (let key in w) {
        if (w[key].mapZ == undefined) continue
        metamsg(w[key].name + ': ' + w[key].mapX + ', ' + w[key].mapY + ', ' + w[key].mapZ + ' Region=' + w[key].mapRegion)
      }
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  })
}



findCmd('Map').script = function() {
  if (settings.hideMap) {
    document.querySelector('#quest-map').style.display = 'block'
    delete settings.hideMap
  }
  else {
    document.querySelector('#quest-map').style.display = 'none'
    settings.hideMap = true
  }
  io.calcMargins()
  msg(lang.done_msg)
  return world.SUCCESS_NO_TURNSCRIPTS
}