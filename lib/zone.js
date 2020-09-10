"use strict";




const zoneExit = function(char, dir) {
  const newX = char.positionX + this.data.x
  const newY = char.positionY + this.data.y
  
  // Exits to other places
  for (let el of this.origin.exits) {
    if (char.positionX === el.x && char.positionY === el.y && dir === el.dir) {
      const tpParams = {char:char, dir:dir}
      if (el.blocking) {
        msg(el.blockedmsg || lang.not_that_way, tpParams)
        return false
      }
      if (el.isLocked) {
        msg(el.lockedmsg || lang.locked_exit, tpParams)
        return false
      }
      //console.log(this)
      msg(el.msg || lang.go_successful, tpParams)
      this.origin.onZoneExit(dir)
      world.setRoom(char, el.dest)
      return true
    }
  }


  // If the direction is "in", "up", or "down", just say no
  if (this.origin.defaultToBlocked || this.data.type !== 'compass') {
    msg('You can\'t go ' + dir)
    return false
  }
  
 
  // Check if a feature blocks the way
  for (let name in w) {
    const o = w[name]
    if (o.zone === this.origin.name && newX === o.x && newY === o.y && o.featureNoExit) {
      msg(o.featureNoExit.replace('#', dir))
      return false
    }
  }
  
  // Check if this would cross a border
  for (let el of this.origin.getBorders()) {
    if (el.border(newX, newY)) {
      msg(el.borderMsg.replace('#', dir))
      return false
    }
  }
  
  // Handle objects at the old location
  this.origin.onZoneExit(dir)
  
  // More the player
  char.positionX = newX
  char.positionY = newY
  msg(lang.stop_posture(char));
  msg(lang.go_successful, {char:char, dir:dir});
  world.setRoom(char, this.origin.name, false, true)
  
  return true;
};

const ZONE = function(defaultToBlocked) {
  const res = {
    exits:[],
    zone:true,
    defaultToBlocked:defaultToBlocked,
    // The below are all defaults for map drawing
    insideColour:'yellow',
    outsideColour:'silver',
    featureColour:'blue',
    playerColour:'black',
    mapCells:[],
    mapFeatures:[],
    mapLabels:[],
    cellSize:16,
    mapBorder:true,
    mapFont:'12px sans-serif',
  };
  for (let ex of lang.exit_list) {
    if (ex.type === 'nocmd') continue
    res[ex.name] = new Exit("", {use:zoneExit, data:ex})
  }
  
  res.getExits = function(options) {
    const exits = []
    for (let ex of lang.exit_list) {
      if (ex.type !== 'nocmd' && this.hasExit(options)) exits.push(ex)
    }
    return exits
  }
  
  res.hasExit = function(dir, options) {
    //console.log("looking " + dir+ " at " + game.player.positionX + "," + game.player.positionY)
    if (options === undefined) options = {};
    if (!this[dir]) return false;
    
    // Check for special exit
    for (let el of this.exits) {
      //console.log("checking " + el.dest + " dir=" + el.dir + " (" + el.x + "," + el.y + ")")
      if (game.player.positionX === el.x && game.player.positionY === el.y && dir === el.dir) {
        //console.log("found special")
        if (el.blocking) return false
        if (options.excludeLocked && el.isLocked) return false
        if (options.excludeScenery && el.scenery) return false
        //console.log("it is good")
        return true
      }
    }
    
    // Non-compass directions not allowed
    if (this.defaultToBlocked || this[dir].data.type !== 'compass') {
      return false
    }
    
    // Check if this would cross a border
    const newX = game.player.positionX + this[dir].data.x
    const newY = game.player.positionY + this[dir].data.y
    for (let el of this.getBorders()) {
      if (el.borderMsg !== undefined) continue
      if (el.border(newX, newY)) {
        return false
      }
    }
    
    return true
  }
  
  res.desc = function() {
    for (let el of this.descs) {
      if (el.when !== undefined) {
        if (el.when(game.player.positionX, game.player.positionY)) return this.getDesc(el)
      }
      else if (el.x !== undefined) {
        if (el.x === game.player.positionX && el.y === game.player.positionY) return this.getDesc(el)
      }
      else {
        //console.log(el)
        return this.getDesc(el)
      }
    }
    return "ERROR: No description found for zone at x=" + game.player.positionX + ", y=" + game.player.positionY
  }
  
  res.getDesc = function(el) {
    return (typeof el.desc === 'function' ? el.desc() : el.desc) + this.getFeatureDescs()
  }
  
  res.onZoneExit = function(dir) {
    for (let name in w) {
      const o = w[name]
      if (o.loc === this.name && o !== game.player) {
        delete o.loc
        o.positionX = game.player.positionX
        o.positionY = game.player.positionY
        o.zoneElsewhere = this.name
      }
    }
  }
  
  res.getFeatureDescs = function() {
    let s = ''
    for (let name in w) {
      const el = w[name]
      if (el.zone !== this.name || el.zoneBorder) continue
      if (game.player.positionX === el.positionX && game.player.positionY === el.positionY && el.featureLookHere) {
        s += ' ' + el.featureLookHere
      }
      else {
        const d = this.getDirection(game.player, el.positionX, el.positionY, el.range)
        if (d) s += ' ' + el.featureLook.replace('#', d)
      }
    }
    for (let el of this.getBorders()) {
      if (el.isAdjacentTo(game.player) && el.borderDesc) s += ' ' + el.borderDesc
    }
    return s
  }
  
  res.beforeEnter = function() {
    if (game.player.positionX === undefined) game.player.positionX = 0
    if (game.player.positionY === undefined) game.player.positionY = 0
    for (let name in w) {
      const o = w[name]
      if (o.zoneElsewhere === this.name && o.positionX === game.player.positionX && o.positionY === game.player.positionY) {
        o.loc = this.name
        delete o.zoneElsewhere
      }
    }
  }
  
  // Gets the compass direction from that char to the given co-ordinate
  // If range is given, will return false if the distance is greater than that
  // No guarantee what will happen if the char is at at the coordinates
  // (because of the way floats are handled it may not be accurate/reliable)
  res.getDirection = function(char, objX, objY, range) {
    const x = objX - char.positionX
    const y = objY - char.positionY
    const r = Math.sqrt(x * x + y * y)
    if (range && r > range) return false
    const theta = Math.atan(y / x) * 180 / Math.PI
    if (x > 0 && theta <= 22.5 && theta >= -22.5) return lang.exit_list[7].name
    if (x > 0 && theta <= 67.5 && theta >= 22.5) return lang.exit_list[2].name
    if (x > 0 && theta >= -67.5 && theta <= -22.5) return lang.exit_list[12].name
    
    if (x < 0 && theta <= 22.5 && theta >= -22.5) return lang.exit_list[5].name
    if (x < 0 && theta <= 67.5 && theta >= 22.5) return lang.exit_list[10].name
    if (x < 0 && theta >= -67.5 && theta <= -22.5) return lang.exit_list[0].name

    return y > 0 ? lang.exit_list[1].name : lang.exit_list[11].name
  }

  res.getBorders = function() {
    const borders = []
    for (name in w) {
      if (w[name].zoneBorder && w[name].zone === this.name) borders.push(w[name])
    }
    return borders
  }
  
  res.getBorderAt = function(x, y) {
    for (let el of this.getBorders()) {
      if (el.border(x, y)) {
        return el
      }
    }
    return false
  }

  res.getFeatureAt = function(x, y) {
    for (let name in w) {
      const el = w[name]
      if (el.zone !== this.name || el.zoneBorder) continue
      if (x === el.positionX && y === el.positionY) {
        return el
      }
    }
    return false
  }
  
  res.drawMap = function() {
    if (this.size === undefined) return false
    const cells = []
    const features = []
    const labels = []
    for (let x = -this.size; x <= this.size; x++) {
      for (let y = -this.size; y <= this.size; y++) {
        const x2 = (this.size + x) * this.cellSize
        const y2 = (this.size - y) * this.cellSize
        if (this.getBorderAt(x, y)) {
          cells.push('<rect x="' + x2 + '" y="' + y2 + '" width="' + this.cellSize + '" height="' + this.cellSize + '" stroke="none" fill="' + this.outsideColour + '"/>')
        }
        else {
          cells.push('<rect x="' + x2 + '" y="' + y2 + '" width="' + this.cellSize + '" height="' + this.cellSize + '" stroke="none" fill="' + this.insideColour + '"/>')
        }
        const feature = this.getFeatureAt(x, y)
        if (feature) {
          const colour = feature.zoneColour || this.featureColour
          features.push('<circle cx="' + (x2+this.cellSize/2) + '" cy="' + (y2+this.cellSize/2) + '" r="' + (this.cellSize/2 - 1) + '" stroke="none" fill="' + colour + '"/>')
          if (feature.zoneMapName) labels.push('<text x="' + (x2+this.cellSize) + '" y="' + (y2+5) + '" style="font: ' + this.mapFont + '; fill: black;">' + feature.zoneMapName + '</text>')
        }
      }
    }

    const map = cells.concat(this.mapCells, features, this.mapFeatures, labels, this.mapLabels)

    const x2 = (this.size + game.player.positionX) * this.cellSize
    const y2 = (this.size - game.player.positionY) * this.cellSize
    map.push('<rect x="' + (x2+4) + '" y="' + (y2+4) + '" width="' + (this.cellSize-8) + '" height="' + (this.cellSize-8) + '" stroke="none" fill="' + this.playerColour + '"/>')
    
    const svgSize = (this.size * 2 + 1) * this.cellSize
    if (this.mapBorder) map.push('<rect x="0" y="0" width="' + svgSize + '" height="' + svgSize + '" stroke="black" fill="none"/>')
    draw(svgSize, svgSize, map)
    return true
  }  
  
  return res;
}



const ZONE_BORDER = function(loc) {
  const res = {
    zoneBorder:true,
    zone:loc,
    isAtLoc:function(loc, situation) {
      if (situation === world.LOOK && this.scenery) return false;
      if (situation === world.SIDE_PANE && this.scenery) return false;
      return this.isAdjacentTo(game.player)
    },
    isAdjacentTo:function(char) {
      if (char.loc !== this.zone) return false
      for (let x = char.positionX - 1; x <= char.positionX + 1; x++) {
        for (let y = char.positionY - 1; y <= char.positionY + 1; y++) {
          if (this.border(x, y)) return true
        }
      }
      return false
    },
  };
  return res;
}

const ZONE_ITEM = function(loc, x, y) {
  const res = {positionX:x, positionY:y, zoneElsewhere:loc,};
  return res;
}

const ZONE_FEATURE = function(loc, x, y, range, adjacent) {
  const res = {
    positionX:x, positionY:y, range:range, adjacent:adjacent, zone:loc, scenery:true,
    isAtLoc:function(loc, situation) {
      if (situation === world.LOOK && this.scenery) return false;
      if (situation === world.SIDE_PANE && this.scenery) return false;
      if (typeof loc !== "string") loc = loc.name
      if (adjacent) {
        return loc === this.zone && Math.abs(game.player.positionX - this.x) < 2 && Math.abs(game.player.positionY -this.y) < 2
      }
      else {  
        return loc === this.zone && game.player.positionX === this.x && game.player.positionY === this.y
      }
    }
  };
  return res;
}

