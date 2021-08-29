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
map.defaultStyle = {position:'fixed', display:'block'}
io.modulesToUpdate.push(map)
io.modulesToInit.push(map)






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

  map.layers = [
    // rooms on other levels
    {name:'terrain', attrs:'stroke="' + settings.mapBorderColour + '" stroke-width="1" fill="' + settings.mapLocationColour + '"'},
    // features (anything the author might want to add)
    {name:'features', attrs:'pointer-events="none"'},
    // labels
    {name:'labels', attrs:'pointer-events="none" fill="' + settings.mapLabelColour + '" text-anchor="middle"'},
  ]

  map.hex = {
   '999-1001':'hills', 
   '1000-1000':'forest', 
   '1000-1001':'forest', 
   '1000-1002':'grassland',
   '1001-999':'desert',
   '1001-1000':'desert',
   '1001-1001':'mountain',
   '1001-1002':'mountains',
   '1001-1003':'mountains',
   '1002-999':'desert',
   '1002-999':'oasis',
   '1002-1000':'desert',
   '1002-1001':'volcano',
   '1002-1002':'mountain',
   '1003-1001':'lava',

   '1005-1005':'jungle', 
   '1005-1006':'jungle', 
  }
}


// Draw the map
// It collects all the SVG in five lists, which are effectively layers.
// This means all the exits appear in one layer, all the labels in another
// and so labels are always on top of exits
map.update = function() {
  log('here')
  // grab the current room region and level. If the room is missing either, give up now!
  const level = w[player.loc].mapZ
  const region = w[player.loc].mapRegion
  //if (level === undefined || region === undefined) return
  //if (w[player.loc].mapIgnore) return
  
  // Stuff gets put in any of several layers, which will be displayed in this order
  const lists = {}
  for (let el of map.layers) lists[el.name] = ['', '<g id="' + el.name + '-layer" ' + el.attrs + '>']
  log(lists)

  // Loop through every room
  for (let key in map.hex) {
    const ary = key.split('-').map(el => parseInt(el))
    map.mapHex(lists, ary[0], ary[1], map.hex[key])
  }

  // Add it all together
  const result = settings.mapDefs ? settings.mapDefs() : []
  for (let key in lists) {
    for (let el of lists[key]) result.push(el)
    result.push('</g>')
  }
  //console.log(result)
  if (settings.mapExtras) result.push(...settings.mapExtras())
  //result.push(settings.mapMarker ? settings.mapMarker(w[player.loc]) : map.marker(w[player.loc].mapX, w[player.loc].mapY))

  // Centre the view on the player, and draw it
  const x = w[player.loc].mapX - settings.mapWidth/2
  const y = -settings.mapHeight/2 + w[player.loc].mapY
  log(result)
  draw(settings.mapWidth, settings.mapHeight, result, {destination:'quest-map', x:0, y:0})
}

map.hexXCoords = [0, 100, 150, 100,   0, -50]
map.hexYCoords = [0,   0,  75, 150, 150,  75]
map.scale = 6
map.offsetX = 100
map.offsetY = 100

map.legend = {
  desert:{colour:'khaki'},
  oasis:{colour:'khaki', symbol:'oasis'}, 
  
  mountain:{colour:'silver', symbol:'mountain'}, 
  mountains:{colour:'silver', symbol:'mountains'}, 
  volcano:{colour:'silver', symbol:'volcano'}, 
  lava:{colour:'darkgrey', symbol:'lava'},
  rocky:{colour:'darkgrey', symbol:'rock'},
  rocklake:{colour:'darkgrey', symbol:'lake'},
  
  forest:{colour:'lime', symbol:'tree_mixed'},
  hills:{colour:'lime', symbol:'hills'},
  jungle:{colour:'lime', symbol:'jungle'},
  lake:{colour:'lime', symbol:'lake'},
  grassland:{colour:'lime'}, 
  
  icelake:{colour:'white', symbol:'lake'},
  tundra:{colour:'white', symbol:'tree_mixed'},
  arctic:{colour:'white'},
  
}

map.mapHex = function(list, x, y, data) {
  x -= 1000
  y -= 1000
  log(x)
  log(y)
  log(data)
  let s = '<polygon points="'
  for (let i = 0; i < 6; i++) {
    const xPos = (x * 150 + map.hexXCoords[i]) / map.scale + map.offsetX
    const yPos = (y * 150 + x * 75 + map.hexYCoords[i]) / map.scale + map.offsetY
    s += ' ' + xPos + ',' + yPos
  }
  s += '" '
  //if (attrs) s += ' style="' + attrs + '"'
  s += ' style="stroke:grey;fill:' + map.legend[data].colour
  s += '" onclick="alert(\'You have clicked the circle.\')"  >'
  s += '<title>' + data + '</title>'
  s += '</polygon>'
  list.terrain.push(s)

  if (map.legend[data].symbol) {
    s = '<image href="game-further/' + map.legend[data].symbol + '.png" height="25" width="30"'
    s += ' x="' + ((x * 150 - 45) / map.scale + map.offsetX)
    s += '" y="' + ((y * 150 + x * 75 + 0) / map.scale + map.offsetY)
    s += '"/>'
    
    list.features.push(s)
  }
}