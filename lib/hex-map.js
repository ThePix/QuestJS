"use strict"





function createHex(x, y, data) {
  const name = map.coordToCellName(x, y)
  if (w[name]) {
    if (settings.mapReportRepeats) log('Already got a ' + name)
    return null
  }
  const o = createRoom(name, data)

  o.mapX = x
  o.mapY = y

  o.getExit = function(dir) {
    if (this[dir]) return this[dir]
    if (!map.vectors[dir]) return null
    const x = this.mapX + map.vectors[dir][0]
    const y = this.mapY + map.vectors[dir][1]
    log(map.vectors[dir])
    log(map.coordToCellName(x, y))
    return new Exit(map.coordToCellName(x, y), {origin:this, dir:dir})
  }
  
  o.hasExit = function(dir, options) {
    if (options === undefined) options = {};
    if (!this[dir]) return this.hasHexExit(dir, options);
    if (options.excludeAlsoDir && this[dir].isAlsoDir) return false;
    if (options.excludeLocked && this[dir].isLocked()) return false;
    if (options.excludeScenery && this[dir].scenery) return false;
    return !this[dir].isHidden();
  }
  
  // can change later to limit... or allow authotr to
  o.hasHexExit = function(dir, options) {
    if (!map.vectors[dir]) return false
    if (this[dir + 'Prohibited']) return false
    const x = this.mapX + map.vectors[dir][0]
    const y = this.mapY + map.vectors[dir][1]
    if (w[map.coordToCellName(x, y)]) return true
    return false
  }
  
  if (settings.mapDefaultAlias && !data.alias) settings.mapDefaultAlias(o)
  
  return o
}


function createBiome(x, y, biomeChar, data = {}) {
  if (biomeChar === ' ') return null
  if (!settings.mapBiomes[biomeChar]) {
    log("No biome for " + biomeChar)
    return null
  }
  const o = createHex(x, y, data)
  if (!o) return null
  o.biome = settings.mapBiomes[biomeChar]
  o.getHexColour = function() { return this.biome.colour }
  if (!o.desc) o.desc = o.biome.name
  return o
}


const map = {
  toggle:true,
  defaults:{
    mapTextColour:'black',
    mapLabelOffset:15,
    mapLabelColour:'black',
    mapHexStroke:'grey',
    mapDefaultColour:'lightgrey',
    mapHexStrokeWidth:4,
    mapRiverColour:'dodgerblue',
    allowRoaming:false,
    mapScrolling:true,
    mapXOffset1:12,
    mapXOffset2:25,
    mapYOffset:20,
    mapClick:function(x, y) {},
  },
  coordToCellName:function(x, y) { return 'hex_' + map.numberToString(x) + '_' + map.numberToString(y) },
  numberToString:function(n) { return n < 0 ? 'm' + (-n) : '' + n },
  stringToNumber:function(s) { return s.startsWith('m') ? -parseInt(s.substring(1)) : parseInt(s) },
  cellNameToCoord:function(s) {
    if (!s) return null
    if (typeof s !== 'string') s = s.name
    const md = s.match(/hex_([m0-9]+)_([m0-9]+)/)
    if (!md) return null
    return [
      map.stringToNumber(md[1]),
      map.stringToNumber(md[2]),
    ]
  },
  vectors:{
    north:[0,1],
    northeast:[1,0],
    southeast:[1,-1],
    south:[0, -1],
    southwest:[-1,0],
    northwest:[-1,1],
  },
}
map.defaultStyle = {position:'fixed', display:'block'}  // !!!!!!!!!!!!!!

io.modulesToUpdate.push(map)
io.modulesToInit.push(map)






map.init = function() {
  // Set the default values for settings
  for (let key in map.defaults) {
    if (!settings[key]) settings[key] = map.defaults[key]
  }  

  // Set up the HTML page
  Object.assign(document.querySelector('#quest-map').style, map.defaultStyle, settings.mapStyle)
  settings.mapHeight = parseInt(settings.mapStyle.height)
  settings.mapWidth = parseInt(settings.mapStyle.width)

  map.xFactor = settings.mapXOffset1 + settings.mapXOffset2
  map.yFactor = settings.mapYOffset * 2    
  


  map.layers = [
    // rooms on this level
    {name:'base', attrs:'stroke="' + settings.mapBorderColour + '" stroke-width="1" fill="' + settings.mapLocationColour + '"'},
    // borders
    {name:'borders', attrs:''},
    // symbols (anything the author might want to add)
    {name:'symbols', attrs:''},
    // labels
    {name:'labels', attrs:'pointer-events="none" fill="' + settings.mapLabelColour + '" text-anchor="middle"'},
  ]
  map.update()
}



// Draw the map
// It collects all the SVG in five lists, which are effectively layers.
// This means all the hexs appear in one layer, all the labels in another
map.update = function() {
  // check we are ready to draw the map
  if (!map.layers) return

  // grab the current room x and y position as an array
  // or give up if not that sort of location
  
  const playerCoord = map.cellNameToCoord(currentLocation)
  if (!playerCoord) return
  
  
  
  // Stuff gets put in any of several layers, which will be displayed in this order
  const lists = {}
  for (let el of map.layers) lists[el.name] = ['', '<g id="' + el.name + '-layer" ' + el.attrs + '>']

  // set up some values; these are all in hex units
  const mapXOffset = settings.mapScrolling ? -playerCoord[0] : 0
  const mapYOffset = settings.mapScrolling ? -playerCoord[1] : 0
  const hexWidth = Math.floor(parseInt(settings.mapStyle.width) / (settings.mapXOffset1 + settings.mapXOffset2) + 1)
  const hexHeight = Math.floor(parseInt(settings.mapStyle.height) / settings.mapYOffset / 2 + hexWidth / 2 + 1)
  const hexStartX = Math.floor(-hexWidth / 2 - mapXOffset)
  const hexStartY = Math.floor(-hexHeight / 2 - mapYOffset)
  
  // Loop through every cell
  for (let x = hexStartX; x <= hexStartX + hexWidth; x++) {
    for (let y = hexStartY * 2; y <= hexStartY + hexHeight; y++) {
      const cell = w[map.coordToCellName(x, y)] || {}   // get data for cell or default
      // We loop over all cells in a parallelogram because the x axis is rising,
      // but can ignore the top and bottom ones
      if (y + x/2 > hexStartY + hexHeight + 1) continue
      if (y + x/2 < hexStartY - 1) continue
      map.mapDraw(lists, cell, x, y)
    }
  }

  // Add it all together
  const result = settings.mapDefs ? settings.mapDefs() : []
  for (let key in lists) {
    for (let el of lists[key]) result.push(el)
    result.push('</g>')
  }
  // Author can add extras to go over the top
  if (settings.mapExtras) result.push(...settings.mapExtras())
  // Add the player position marker
  result.push(settings.mapMarker ? settings.mapMarker(w[player.loc]) : map.marker())
  log(result)
  
  // The image will be draweing using these coordinates (in pixels)
  const x = -settings.mapWidth / 2 - mapXOffset * map.xFactor
  const y = -settings.mapHeight / 2 - (-mapYOffset - mapXOffset / 2) * map.yFactor
  draw(settings.mapWidth, settings.mapHeight, result, {destination:'quest-map', x:x, y:y})
}

// Points aroud the hexagon, starting from ten o'clock, and going clockwise
// last point is repeated to make borders easier
map.hexPoints = [
  [-1,  0, -1],
  [ 1,  0, -1],
  [ 0,  1,  0],
  [ 1,  0,  1],
  [-1,  0,  1],
  [ 0, -1,  0],
  [-1,  0, -1],
]


// The default draw function for a room
// Puts the various bits in the appropriate lists

map.mapDraw = function(lists, cell, x_, y_) {
  const y = (-y_ - x_ / 2) * map.yFactor
  const x = x_ * map.xFactor


  let s = '<polygon points="'
  for (let i = 0; i < 6; i++) {
    s += (x + settings.mapXOffset1 * map.hexPoints[i][0] + settings.mapXOffset2 * map.hexPoints[i][1]) + ',' + (y + settings.mapYOffset * map.hexPoints[i][2]) + ' '
  }
  
  s += '" onclick="settings.mapClick(' + x_ + ', ' + y_ + ')" stroke="' + settings.mapHexStroke + '" fill="'
  s += cell.getHexColour ? cell.getHexColour() : settings.mapDefaultColour
  s += '"/>'
  //console.log(s)
  lists.base.push(s)
  
  for (let i = 0; i < 6; i++) {
    map.mapDrawBorder(lists, cell, x, y, i)
  }  
  map.mapDrawLabel(lists, cell, x, y)
  map.mapDrawSymbol(lists, cell, x, y)
}



map.mapDrawBorder = function(lists, cell, x, y, side) {
  if (!cell['getHexBorder' + side]) return
  const style = cell['getHexBorder' + side](side)
  if (!style) return
  let s = '<line x1="'
  s += (x + settings.mapXOffset1 * map.hexPoints[side][0] + settings.mapXOffset2 * map.hexPoints[side][1])
  s += '" y1="' + (y + settings.mapYOffset * map.hexPoints[side][2])
  s += '" x2="'
  s += (x + settings.mapXOffset1 * map.hexPoints[side+1][0] + settings.mapXOffset2 * map.hexPoints[side+1][1])
  s += '" y2="' + (y + settings.mapYOffset * map.hexPoints[side+1][2])
  if (typeof style === 'string') {
    s += '" stroke="' + style + '" stroke-width="' + settings.mapHexStrokeWidth + 'px'
  }
  else {
    for (const key in style) {
      s += '" ' + key + '="' + style[key]
    }   
  }
  s += '"/>'
  lists.borders.push(s)
}


map.mapDrawLabel = function(lists, cell, x, y) {
  if (!cell.getHexLabel) return
  const label = cell.getHexLabel()
  if (!label) return

  let s = '<text class="map-text" x="'
  s += x
  s += '" y="'
  s += (y - settings.mapLabelOffset)
  if (settings.mapLabelRotate) s += '" transform="rotate(' + settings.mapLabelRotate + ',' + x + ',' + (y - settings.mapLabelOffset) + ')'
  s += '" pointer-events="none">'
  s += label
  s += '</text>'
  lists.labels.push(s)
}



map.mapDrawSymbol = function(lists, cell, x, y) {
  if (!cell.getHexSymbol) return
  const symbol = cell.getHexSymbol()
  if (!symbol) return

  const offset = cell.getHexSymbolOffset ? cell.getHexSymbolOffset() : [0,0]
  let s = '<image class="map-image" x="'
  s += (x + offset[0])
  s += '" y="'
  s += (y + offset[1])
  s += '" href="'
  s += symbol
  s += '" pointer-events="none"/>'
  lists.symbols.push(s)
}




map.marker = function() {
  const coord = map.cellNameToCoord(currentLocation)
  if (!coord) return
  const y = (-coord[1] - coord[0] / 2) * map.yFactor
  const x = coord[0] * map.xFactor
  let s = '<circle cx="'
  s += x
  s += '" cy="'
  s += y
  s += '" r="5" stroke="black" fill="blue" pointer-events="none"/>'
  return s
}



map.river = function(x, y, ...data) {
  map.border(x, y, settings.mapRiverColour, ...data)
}  
  
  
map.border = function(x, y, colour, ...data) {
  const hex = w[map.coordToCellName(x, y)]
  if (!hex) {
    log('Failed to add river to ' + map.coordToCellName(x, y))
    return
  }
  log(hex.name)
  for (const index in data) {
    if (!data[index]) continue
    hex['hexBorderWidth' + index] = data[index]
    hex['hexBorderColour' + index] = colour
    hex['getHexBorder' + index] = function(side) { return {
      stroke:this['hexBorderColour' + side], 
      'stroke-width':this['hexBorderWidth' + side], 
      'stroke-linecap':"round",
    } }
  }
  log(hex)
}




map.generate = function(x, y, data) {
  let row = y
  let col
  for (const s of data) {
    row--
    col = x
    for (const c of s) {
      col++
      
      createBiome(col, row, c)
    }
  }
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