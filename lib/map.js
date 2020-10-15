"use strict"


const map = {
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
map.defaultStyle = {position:'fixed', display:'block'}
map.zoneDispacement = 10000
io.modulesToUpdate.push(map)
io.modulesToInit.push(map)

// Authors can override this so thgere are several starting locations if there are isolated regions
map.getStartingLocations = function() {
  const starts = settings.mapAutomapFrom ? settings.mapAutomapFrom.map(el => w[el]) : [w[game.player.loc]]
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

map.init = function() {
  $('#quest-map').css(map.defaultStyle)
  $('#quest-map').css(settings.mapStyle)
  $("<style>")
      .prop("type", "text/css")
      .html(".map-text " + map.dictionaryToCss(settings.mapLabelStyle))
      .appendTo("head")
  $('.map-text').css('color', 'red')
  settings.mapHeight = parseInt(settings.mapStyle.height)
  settings.mapWidth = parseInt(settings.mapStyle.width)
  
  for (let key in map.defaults) {
    if (!settings[key]) settings[key] = map.defaults[key]
  }  
  
  if (!settings.mapDoNotAutomap) {
    const rooms = settings.mapGetStartingLocations ? settings.mapGetStartingLocations() : map.getStartingLocations()
    
    // get room from rooms (terminate if none left)
    let count = settings.mapMaxRooms ? settings.mapMaxRooms : 1000
    while (rooms.length > 0 && count) {
      count--
      const room = rooms.shift()
      //console.log("Mapping room: " + room.name)
      
      for (let dir of lang.exit_list) {
        if (dir.type !== 'compass' && dir.type !== 'vertical') continue
        if (!room.hasExit(dir.name)) continue
        //console.log("Mapping direction: " + dir.name)
        //console.log(room)
        const exit = room[dir.name]
        //console.log(exit)
        //console.log("Mapping exit to: " + exit.name)
        if (exit.mapIgnore) continue
        if (exit.name === '_') continue
        const exitRoom = w[exit.name]
        if (!exitRoom) throw new Error("Mapping to unknown exit: " + exit.name)
        if (exitRoom.mapIgnore) {
          exit.mapIgnore = true
          continue
        }
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
            rooms.push(exitRoom)
          }
          //console.log(exitRoom)
        }
        else {
          // if done, check coords and alert if dodgy
          if (exitRoom.mapX !== room.mapX + offsetX) console.log("WARNING: Mapping exit from " + room.name + " to " + exit.name + " - funny X offset")
          if (exitRoom.mapY !== room.mapY - offsetY) console.log("WARNING: Mapping exit from " + room.name + " to " + exit.name + " - funny Y offset (" + exitRoom.mapY + " vs " + (room.mapY + offsetY) + ")")
          if (exitRoom.mapZ !== room.mapZ + offsetZ) console.log("WARNING: Mapping exit from " + room.name + " to " + exit.name + " - funny Z offset")
        }
      }
      //console.log("--- " + rooms.length + " ---")
    }
    
    //follow exits from each room to each room
    //flag as each gets done (do we need to flag each exit? Is that a problem?)
    
    
  }
}



map.update = function() {
  // grab the current room region and level. If the room is missing either, give up now!
  const level = w[game.player.loc].mapZ
  const region = w[game.player.loc].mapRegion
  if (level === undefined || region === undefined) return
  if (w[game.player.loc].mapIgnore) return
  
  // Stuff gets put in any of several layers, which will be displayed in this order
  // The first and last give the author the opportunity to add anything
  // The rest are added on a per room basid
  const mapDefs = settings.mapDefs ? settings.mapDefs() : []        // author's definitions
  const mapOtherLevels = []                                         // rooms on other levels
  const mapExits = []                                               // exits
  const mapBase = []                                                // rooms on this level
  const mapFeatures = []                                            // features (anything the author might want to add)
  const mapLabels = []                                              // labels
  const mapExtras = settings.mapExtras ? settings.mapExtras() : []  // author;s additions
  
  // Some styling can be applied to all elements in a layer here
  mapOtherLevels.push('<g id="other-levels-layer" stroke="' + settings.mapBorderColour + '" stroke-width="1" fill="' + settings.mapLocationColour + '" opacity="0.2" pointer-events="none">')
  mapExits.push('<g id="exit-layer" style="stroke:' + settings.mapExitColour + ';stroke-width:' + settings.mapExitWidth + 'px;fill:' + settings.mapExitColour + '">')
  mapBase.push('<g id="base-layer" stroke="' + settings.mapBorderColour + '" stroke-width="1" fill="' + settings.mapLocationColour + '">')
  mapFeatures.push('<g id="features-layer">')
  mapLabels.push('<g id="labels-layer" pointer-events="none" fill="' + settings.mapLabelColour + '" text-anchor="middle">')
  

  // Loop through every room
  for (let key in w) {
    const room = w[key]
    // Do not map these
    if (room.mapRegion !== region) continue
    if (!settings.mapShowNotVisited && !room.visited) continue

    // Location itself
    const destinationLayer = room.mapZ === level ? mapBase : mapOtherLevels
    if (room.mapDrawBaseString) {
      destinationLayer.push(room.mapDrawBaseString)
    }
    else if (room.mapDrawBase) {
      const s = room.mapDrawBase()
      if (!room.mapRedrawEveryTurn) room.mapDrawBaseString = s
      destinationLayer.push(s)
    }
    else {
      destinationLayer.push(map.mapDrawBaseDefault(room))
    }
    
    if (room.mapZ !== level) continue

    // Exits
    for (let dir of lang.exit_list) {
      if (dir.type !== 'compass') continue
      if (!room.hasExit(dir.name)) continue
      const exit = room[dir.name]
      if (exit.mapIgnore) continue
      if (exit.name === '_') continue
      const exitRoom = w[exit.name]
      if (exit.mapDrawString) {
        mapExits.push(exit.mapDrawString)
      }
      else if (exit.mapDraw) {
        mapExits.push(exit.mapDraw(room, exitRoom))
      }
      else {
        let s = '<line x1="' + room.mapX + '" y1="' + room.mapY
        s += '" x2="' + (exitRoom.mapX + room.mapX) / 2 + '" y2="' + (exitRoom.mapY + room.mapY) / 2
        s += '"/>'
        if (!exit.mapRedrawEveryTurn) exit.mapDrawString = s
        mapExits.push(s)
      }
    }
    
    // Features
    if (room.mapDrawFeatures) mapFeatures.push(room.mapDrawFeatures())
    
    // Labels
    if (!settings.mapDrawLabels) continue
    if (room.mapDrawLabelString) {
      mapLabels.push(room.mapDrawLabelString)
    }
    else if (room.mapDrawLabel) {
      const s = room.mapDrawLabel()
      if (!room.mapRedrawEveryTurn) room.mapDrawLabelString = s
      mapLabels.push(s)
    }
    else {
      mapLabels.push(map.mapDrawLabelDefault(room))
    }
  }

  // Close these off  
  mapOtherLevels.push('</g>')
  mapExits.push('</g>')
  mapBase.push('</g>')
  mapFeatures.push('</g>')
  mapLabels.push('</g>')
  
  // Add it all together
  const result = mapDefs.concat(mapOtherLevels, mapExits, mapBase, mapFeatures, mapExtras, mapLabels)
  // Add the "you are here" marker on top
  result.push(settings.mapMarker ? settings.mapMarker(w[game.player.loc]) : map.marker(w[game.player.loc].mapX, w[game.player.loc].mapY))
  
  // Centre the view on the player
  const x = w[game.player.loc].mapX - settings.mapWidth/2
  const y = -settings.mapHeight/2 + w[game.player.loc].mapY
  
  // Go draw it!
  draw(settings.mapWidth, settings.mapHeight, result, {destination:'quest-map', x:x, y:y})
}


map.mapDrawBaseDefault = function(o) {
  const w = o.mapWidth ? o.mapWidth : settings.mapCellSize
  const h = o.mapHeight ? o.mapHeight : settings.mapCellSize
  let s = '<rect x="'
  s += o.mapX - w/2
  s += '" y="'
  s += o.mapY - h/2
  s += '" width="' + w + '" height="' + h
  if (o.mapColour) s += '" fill="' + o.mapColour
  s += '"' + map.getClickAttrs(o) + '/>'
  return s
}

map.getClickAttrs = function(o) {
  if (!settings.mapClick) return ''
  return ' onclick="settings.mapClick(\'' + o.name + '\')" cursor="pointer"'
}

map.mapDrawLabelDefault = function(o) {
  let s = '<text class="map-text" x="'
  s += o.mapX
  s += '" y="'
  s += o.mapY - settings.mapLabelOffset
  if (settings.mapLabelRotate) s += '" transform="rotate(' + settings.mapLabelRotate + ',' + o.mapX + ',' + (o.mapY - settings.mapLabelOffset) + ')'
  s += '">'
  s += o.mapLabel ? o.mapLabel : sentenceCase(o.alias)
  s += '</text>'
  return s
}

map.dictionaryToCss = function(d) {
  const ary = []
  for (let key in d) ary.push(key + ':' + d[key])
  return '{' + ary.join(';') + '}'
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

map.text = function(room, st, points, attrs) {
  let s = '<text x="' + (room.mapX + points[0]) + '" y="' + (room.mapY + points[1]) + '"'
  if (attrs) s += ' style="' + attrs + '"'
  s += ' text-anchor="middle">' + st + '</text>'
  console.log(s)
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
  commands.unshift(new Cmd('DebugMap', {
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
  }))
}



findCmd('Map').script = function() {
  if (settings.hideMap) {
    $('#quest-map').show()
    delete settings.hideMap
  }
  else {
    $('#quest-map').hide()
    settings.hideMap = true
  }
  msg(lang.done_msg)
}