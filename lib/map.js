"use strict"

// Options in settings
// Options to position map, including under or above text, moving margins
// mapShowNotVisited
// mapDoNotAutomap
// mapAutomapFrom
// mapMaxRooms
// mapCellSize
// mapScale
// mapLocationColour
// mapBorderColour

// Customisable functions in map
// getStartingLocations

// Room options
// mapRedrawEveryTurn
// mapIgnore
// mapDrawBaseString
// mapDrawBase
// mapDrawFeatures
// mapDrawLabels

// Exit options
// mapIgnore
// mapOffsetX, Y, Z



// rooms in several locations (eg transit)
// multilocations


const map = {
  defaults:{
    mapCellSize:20,
    mapScale:25,
    mapLocationColour:'yellow',
    mapBorderColour:'black',
    mapTextColour:'black',
    mapLabelOffset:15,
  }
}
map.defaultStyle = {position:'fixed', display:'block'}
io.modulesToUpdate.push(map)
io.modulesToInit.push(map)

// Authors can override this so thgere are several starting locations if there are isolated regions
map.getStartingLocations = function() {
    const start = settings.mapAutomapFrom ? w[settings.mapAutomapFrom] : w[game.player.loc]
    if (!start) throw new Error("Mapping from unknown location: " + (settings.mapAutomapFrom ? settings.mapAutomapFrom : game.player.loc))
    //console.log("Mapping starts from: " + start.name)
    start.mapX = 0
    start.mapY = 0
    start.mapZ = 0
    return [start]
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
    const rooms = map.getStartingLocations()
    
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
  const level = w[game.player.loc].mapZ
  console.log('level=' + level)
  if (level === undefined) return
  if (w[game.player.loc].mapIgnore) return
  const mapExits = []
  const mapBase = []
  const mapFeatures = []
  const mapLabels = []
  for (let key in w) {
    const room = w[key]
    if (room.mapZ !== level) continue
    if (!settings.mapShowNotVisited && !room.visited) continue

    // Exits
    for (let dir of lang.exit_list) {
      if (dir.type !== 'compass') continue
      if (!room.hasExit(dir.name)) continue
      const exit = room[dir.name]
      if (exit.mapIgnore) continue
      if (exit.name === '_') continue
      const exitRoom = w[exit.name]
      let s = '<line x1="' + room.mapX + '" y1="' + room.mapY
      s += '" x2="' + exitRoom.mapX + '" y2="' + exitRoom.mapY
      s += '" style="stroke:#444;stroke-width:3" />'
      
      mapExits.push(s)
    }
    
    // Location itself
    if (room.mapDrawBase) {
      mapBase.push(room.mapDrawBase())
    }
    else if (room.mapDrawBaseString) {
      mapBase.push(room.mapDrawBaseString)
    }
    else {
      mapBase.push(map.mapDrawBaseDefault(room))
    }
    
    if (room.mapDrawFeatures) mapFeatures.push(room.mapDrawFeatures())
    
    if (!settings.mapDrawLabels) continue
    if (room.mapDrawLabel) {
      mapLabels.push(room.mapDrawLabel())
    }
    else if (room.mapDrawLabelString) {
      mapLabels.push(room.mapDrawLabelString)
    }
    else {
      mapLabels.push(map.mapDrawLabelDefault(room))
    }
  }   
  const result = mapExits.concat(mapBase, mapFeatures, mapLabels, settings.mapOverlay ? settings.mapOverlay : [])
  
  const here = w[game.player.loc]
  let s = '<circle cx="'
  s += here.mapX
  s += '" cy="'
  s += here.mapY
  s += '" r="5" stroke="black" fill="blue"/>'
  result.push(s)
  
  const x = here.mapX - settings.mapWidth/2
  const y = -settings.mapHeight/2 + here.mapY
  
  draw(settings.mapWidth, settings.mapHeight, result, {destination:'quest-map', x:x, y:y})
}


map.mapDrawBaseDefault = function(o) {
  console.log(o)
  //return ''
  let s = '<rect x="'
  s += o.mapX - settings.mapCellSize/2
  s += '" y="'
  s += o.mapY - settings.mapCellSize/2
  s += '" width="'
  s += o.mapWidth ? o.mapWidth : settings.mapCellSize
  s += '" height="'
  s += o.mapHeight ? o.mapHeight : settings.mapCellSize
  s += '" stroke="'
  s += settings.mapBorderColour
  s += '" fill="'
  s += o.mapColour ? o.mapColour : settings.mapLocationColour
  s += '" onclick="map.click(\'' + o.name + '\')"/>'
  if (!o.mapRedrawEveryTurn) o.mapDrawBaseString = s
  return s
}


map.mapDrawLabelDefault = function(o) {
  console.log(o)
  //return ''
  let s = '<text class="map-text" x="'
  s += o.mapX
  s += '" y="'
  s += o.mapY - settings.mapLabelOffset
  if (settings.mapLabelColour) s += '" fill="' + settings.mapLabelColour
  if (settings.mapLabelRotate) s += '" transform="rotate(' + settings.mapLabelRotate + ',' + o.mapX + ',' + (o.mapY - settings.mapLabelOffset) + ')'
  s += '" text-anchor="middle" style="color:'
  s += o.mapTextColour ? o.mapTextColour : settings.mapTextColour
  s += '" onclick="map.click(\'' + o.name + '\')">'
  s += o.mapLabel ? o.mapLabel : sentenceCase(o.alias)
  s += '</text>'
  if (!o.mapRedrawEveryTurn) o.mapDrawLabelString = s
  return s
}

map.dictionaryToCss = function(d) {
  const ary = []
  for (let key in d) ary.push(key + ':' + d[key])
  return '{' + ary.join(';') + '}'
}



map.polyline = function(points, attrs) {
  let s = '<polyline points="'
  s += points.map(el => '' + el[0] + ',' + el[1]).join(' ')
  s += '" fill="none"'
  if (attrs) s += ' ' + attrs
  s += '/>'
  return s
}


map.click = function(name) {
  console.log("Map clicked: " + name)
  
}




if (settings.playMode === 'dev') {
  commands.unshift(new Cmd('DebugMap', {
    regex:/^debug map$/,
    objects:[
    ],
    script:function() {
      for (let key in w) {
        if (w[key].mapZ == undefined) continue
        metamsg(w[key].name + ': ' + w[key].mapX + ', ' + w[key].mapY + ', ' + w[key].mapZ)
        
      }
      return world.SUCCESS_NO_TURNSCRIPTS
    },
  }))
}