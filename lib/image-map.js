"use strict"


const map = {
  toggle:true,
  defaults:{
    mapScale:1,
    mapOffsetX:0,
    mapOffsetY:0,
    mapTextColour:'black',
    mapLabelColour:'black',
    mapScrollSpeed:1,
    mapPointsOfInterest:[],
    mapStyle:{
      right:'0',
      top:'200px',
      width:'400px',
      height:'400px',
      'background-color':'black', 
      border:'3px black solid',
    },
    mapMarker:function(loc) {
      return map.polygon(loc, [
        [0,0], [-5,-25], [-7, -20], [-18, -45], [-20, -40], [-25, -42], [-10, -18], [-15, -20]
      ], 'stroke:none;fill:black;pointer-events:none;opacity:0.5')
    },
    mapDrawPointOfInterest:function(point) {
      let s = '<g>'
      s += '<text x="' + (point.mapX/settings.mapScale+18) + '" y="' + (point.mapY/settings.mapScale-23) + '" fill="' + point.fill + '">'
      s += point.text + '</text>'
      s +=  map.polygon({
          mapX:point.mapX/settings.mapScale,
          mapY:point.mapY/settings.mapScale,
        }, [
        [0,0], [5,-12], [7, -10], [18, -22], [20, -20], [25, -21], [10, -9], [15, -10]
      ], 'stroke:none;fill:black;pointer-events:none;opacity:0.5')
      s += '</g>'
      return s
    },
  }
}





map.defaultStyle = {position:'fixed', display:'block'}
io.modulesToUpdate.push(map)
io.modulesToInit.push(map)

map.init = function() {
  // First set up the HTML page
  // !!!!!!!
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
  
  map.questMapDiv = document.getElementById("quest-map")
  map.questMapDiv.addEventListener("mouseup", map.mouseDoneEvent)
  map.questMapDiv.addEventListener("mouseleave", map.mouseDoneEvent)
  map.questMapDiv.addEventListener("wheel", function(e) {
    e.preventDefault()
    settings.mapScale -= e.deltaY * -0.01 * settings.mapScale / 4;
    settings.mapScale = Math.min(Math.max(.2, settings.mapScale), 2.5);
    map.redraw()
  })
  map.questMapDiv.addEventListener("mousedown", function(e) {
    map.mouseX = e.offsetX
    map.mouseY = e.offsetY
    map.mouseMoving = true
  })
  map.questMapDiv.addEventListener("mousemove", function(e) {
    if (!map.mouseMoving) return
    //console.log('@' + (e.offsetX - map.mouseX) + ',' + (e.offsetY - map.mouseY))
    map.redraw(map.mouseX - e.offsetX, map.mouseY - e.offsetY)
  })
}

map.mouseDoneEvent = function(e) {
  if (!map.mouseMoving) return
  map.mouseMoving = false
  //console.log('#' + (e.offsetX - map.mouseX) + ',' + (e.offsetY - map.mouseY))
  settings.mapOffsetX += map.mouseX - e.offsetX 
  settings.mapOffsetY += map.mouseY - e.offsetY
  map.redraw()
}

map.update = function() {
  settings.mapOffsetX = 0
  settings.mapOffsetY = 0
  settings.mapScale = 1
  map.redraw()
}  
  
// Draw the map
// It collects all the SVG in five lists, which are effectively layers.
// This means all the exits appear in one layer, all the labels in another
// and so labels are always on top of exits
map.redraw = function(offX, offY) {
  // grab the current room region and level. If the room is missing either, give up now!
  if (w[player.loc].mapX) player.mapX = w[player.loc].mapX / settings.mapScale
  if (w[player.loc].mapY) player.mapY = w[player.loc].mapY / settings.mapScale
  if (w[player.loc].mapRegion) player.mapRegion = w[player.loc].mapRegion
  
  if (!player.mapRegion) player.mapRegion = settings.mapImages[0].name
  const mapImage = settings.mapImages.find(el => el.name === player.mapRegion)
  if (!mapImage) return errormsg("Failed to find a map region called '" + player.mapRegion + "'")

  const result = []
  result.push('<g id="map-top">')
  result.push('<image width="' + (mapImage.width / settings.mapScale) + '" height="' + (mapImage.height / settings.mapScale) + '", x="0", y="0" href="' + mapImage.file + '"/>')
  result.push(settings.mapMarker(player))
  
  for (let point of settings.mapPointsOfInterest) {
    if (!point.mapRegion) point.mapRegion = settings.mapImages[0].name
    if (point.mapRegion !== player.mapRegion) continue
    if (!point.isActive || point.isActive()) result.push(settings.mapDrawPointOfInterest(point))  
  }
  result.push('</g>')

  let offsetX = settings.mapOffsetX - settings.mapWidth/2
  if (offX) offsetX += offX
  let offsetY = settings.mapOffsetY - settings.mapHeight/2
  if (offY) offsetY += offY

  // Centre the view on the player, and draw it
  const x = player.mapX + offsetX
  const y = player.mapY + offsetY
  draw(settings.mapWidth, settings.mapHeight, result, {destination:'quest-map', x:x, y:y, background:'black'})
}





map.polygon = function(room, points, attrs) { return map.polyany('polygon', room, points, attrs) }
map.polyline = function(room, points, attrs) { return map.polyany('line', room, points, attrs) }

map.polyany = function(type, room, points, attrs) {
  let s = '<poly' + (type === 'line' ? 'line' : 'gon') + ' points="'
  s += points.map(el => '' + (room.mapX + el[0]) + ',' + (room.mapY + el[1])).join(' ')
  s += '" '
  if (attrs) s += ' style="' + attrs + '"'
  s += '/>'
  //console.log(s)
  return s
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