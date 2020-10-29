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
      'background-color':'#ddd', 
      border:'3px black solid',
    },
    mapArrowsStyle:{
      fill:'#ffff00', 
      stroke:'#000000', 
      'stroke-width':'0.264583px',
      'stroke-linecap':'butt',
      'stroke-linejoin':'miter', 
      'stroke-opacity':0.5, 
      opacity:0.5
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

map.arrows = `
    <path
       id="arrow1" data-x="-1"
       d="M 8.6666666e-7,10.583333 2.6458343,7.9374993 v 0 1.322917 l 3.9687504,-1.322916 -1.322917,2.6458327 1.322917,2.645833 -3.9687503,-1.322916 v 0 1.322916 z" />
    <path
       d="M 21.166668,10.583333 18.520834,7.9374993 v 0 1.322917 l -3.96875,-1.322916 1.322917,2.6458327 -1.322917,2.645833 3.96875,-1.322916 v 0 1.322916 z"
       id="arrow2"  data-x="1"/>
    <path
       id="arrow3"  data-y="1"
       d="M 10.583335,-1.6666667e-6 13.229169,2.6458333 v 0 h -1.322917 l 1.322915,3.96875 -2.645832,-1.322917 -2.6458333,1.322917 1.322915,-3.96875 v 0 h -1.322915 z" />
    <path
       d="M 10.583335,21.166667 7.9375007,18.520833 v 0 h 1.322917 l -1.322916,-3.96875 2.6458333,1.322917 2.645834,-1.322917 -1.322916,3.96875 v 0 h 1.322916 z"
       id="arrow4"  data-y="-1"/>
    <circle
       r="2.6458333"
       cy="10.583333"
       cx="10.583334"
       id="arrow5"  data-home="1"/>
    <path
       d="M 25.135418,-1.6666667e-6 27.781252,2.6458333 v 0 h -1.322917 l 1.322916,6.614583 -2.645833,-1.322916 -2.645833,1.322916 1.322915,-6.614583 v 0 h -1.322915 z"
       id="arrow6" data-z="1"/>
    <path
       id="arrow7" data-z="-1"
       d="m 25.135418,21.218869 2.645834,-2.645835 v 0 h -1.322917 l 1.322916,-6.614583 -2.645833,1.322916 -2.645833,-1.322916 1.322915,6.614583 v 0 h -1.322915 z" />
`





map.defaultStyle = {position:'fixed', display:'block'}
io.modulesToUpdate.push(map)
io.modulesToInit.push(map)

map.init = function() {
  // First set up the HTMP page
  $('#quest-map').css(map.defaultStyle)
  $('#quest-map').css(settings.mapStyle)
  $("<style>")
      .prop("type", "text/css")
      .html(".map-text " + util.dictionaryToCss(settings.mapLabelStyle, true))
      .appendTo("head")
  $('.map-text').css('color', 'red')
  settings.mapHeight = parseInt(settings.mapStyle.height)
  settings.mapWidth = parseInt(settings.mapStyle.width)
  
  // Set the default values for settings
  for (let key in map.defaults) {
    if (!settings[key]) settings[key] = map.defaults[key]
  }
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
map.redraw = function() {
  // grab the current room region and level. If the room is missing either, give up now!
  if (w[game.player.loc].mapX) game.player.mapX = w[game.player.loc].mapX / settings.mapScale
  if (w[game.player.loc].mapY) game.player.mapY = w[game.player.loc].mapY / settings.mapScale
  if (w[game.player.loc].mapRegion) game.player.mapRegion = w[game.player.loc].mapRegion
  
  if (!game.player.mapRegion) game.player.mapRegion = settings.mapImages[0].name
  const mapImage = settings.mapImages.find(el => el.name === game.player.mapRegion)
  if (!mapImage) return errormsg("Failed to find a map region called '" + game.player.mapRegion + "'")

  const result = ['<image width="' + (mapImage.width / settings.mapScale) + '" height="' + (mapImage.height / settings.mapScale) + '", x="0", y="0" href="' + mapImage.file + '"/>']
  result.push(settings.mapMarker(game.player))
  
  for (let point of settings.mapPointsOfInterest) {
    if (!point.mapRegion) point.mapRegion = settings.mapImages[0].name
    if (point.mapRegion !== game.player.mapRegion) continue
    if (!point.isActive || point.isActive()) result.push(settings.mapDrawPointOfInterest(point))  
  }
  
  let s = '<g style="' + util.dictionaryToCss(settings.mapArrowsStyle) + '" transform="translate('
  s += (game.player.mapX + settings.mapWidth/2 - 90 + settings.mapOffsetX) + ' ' + (game.player.mapY + settings.mapHeight/2 - 75 + settings.mapOffsetY)
  s += ') scale(3 3)" >' + map.arrows + '</g>'
  result.push(s)

  // Centre the view on the player, and draw it
  const x = game.player.mapX - settings.mapWidth/2 + settings.mapOffsetX
  const y = game.player.mapY - settings.mapHeight/2 + settings.mapOffsetY
  draw(settings.mapWidth, settings.mapHeight, result, {destination:'quest-map', x:x, y:y})

  for (let i = 1; i < 8; i++) document.getElementById('arrow' + i).onmousedown = map.onmousedown
  for (let i = 1; i < 8; i++) document.getElementById('arrow' + i).onmouseup = map.onmouseup
}




map.checkMouse = function() {
  if (!map.currentClick) return
  if (map.currentClick.home) {
    settings.mapOffsetX = 0
    settings.mapOffsetY = 0
    settings.mapScale = 1
  }
  else {
    if (map.currentClick.x) settings.mapOffsetX += parseInt(map.currentClick.x) * settings.mapScale * settings.mapScrollSpeed
    if (map.currentClick.y) settings.mapOffsetY -= parseInt(map.currentClick.y) * settings.mapScale * settings.mapScrollSpeed
    if (map.currentClick.z) {
       settings.mapScale = (map.currentClick.z === "1" ? settings.mapScale /= 1.5 : settings.mapScale *= 1.5)
       delete map.currentClick
    }
  }
  map.redraw()
}


map.onmousedown = function(e) { map.currentClick = e.srcElement.dataset }
map.onmouseup = function(e) { delete map.currentClick }


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

setInterval(map.checkMouse, 50);

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