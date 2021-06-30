"use strict";


settings.saveLoadExcludedAtts.push("zoneExits")
settings.saveLoadExcludedAtts.push("zoneDescs")

const zoneExit = function(char, exit) {
  if (!exit) exit = this
  const newX = char.positionX + this.data.x
  const newY = char.positionY + this.data.y
  const dir = exit.dir
  
  // zoneExits to other places
  for (let el of this.origin.zoneExits) {
    if (char.positionX === el.x && char.positionY === el.y && dir === el.dir) {
      const tpParams = {char:char, dir:dir}
      if (el.blocking) return falsemsg(el.blockedmsg || lang.not_that_way, tpParams)
      if (el.isLocked) return falsemsg(el.lockedmsg || lang.locked_exit, tpParams)
      msg(el.msg || lang.go_successful, tpParams)
      this.origin.afterZoneEixit(dir)
      char.moveChar(new Exit(el.dest, exit))
      return true
    }
  }

  // If the direction is "in", "up", or "down", just say no
  if (this.origin.defaultToBlocked || this.data.type !== 'compass') return failedmsg(lang.not_that_way, {char:char, dir:this.dir})
  
 
  // Check if a feature blocks the way
  for (let name in w) {
    const o = w[name]
    if (o.zone === this.origin.name && newX === o.x && newY === o.y && o.featureNoExit) return falsemsg(o.featureNoExit.replace('#', dir))
  }
  
  // Check if this would cross a border
  for (let el of this.origin.getBorders()) {
    if (el.border(newX, newY)) return falsemsg(el.borderMsg.replace('#', dir))
  }
  
  // Handle objects at the old location
  this.origin.afterZoneEixit(dir)
  
  // More the player
  char.positionX = newX
  char.positionY = newY
  msg(lang.stop_posture(char));
  msg(lang.go_successful, {char:char, dir:dir});
  char.moveChar(new Exit(this.origin.name, exit))
  
  return true;
};

const ZONE = function(defaultToBlocked) {
  const res = {
    zoneExits:[],
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
  }
  
  for (let ex of lang.exit_list) {
    if (ex.type === 'nocmd') continue
    res[ex.name] = new Exit("_", {use:zoneExit, data:ex})
  }
  
  res.getExitObjs = function(options) {
    const zoneExits = []
    for (let ex of lang.exit_list) {
      if (ex.type !== 'nocmd' && this.hasExit(ex.name, options)) zoneExits.push(ex)
    }
    return zoneExits
  }
  
  res.hasExit = function(dir, options) {
    if (options === undefined) options = {};
    if (!this[dir]) return false;
    
    // Check for special exit
    for (let el of this.zoneExits) {
      if (player.positionX === el.x && player.positionY === el.y && dir === el.dir) {
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
    const newX = player.positionX + this[dir].data.x
    const newY = player.positionY + this[dir].data.y
    for (let el of this.getBorders()) {
      if (el.borderMsg !== undefined) continue
      if (el.border(newX, newY)) {
        return false
      }
    }
    
    return true
  }
  
  res.desc = function() {
    for (let el of this.zoneDescs) {
      if (el.when !== undefined) {
        if (el.when(player.positionX, player.positionY)) return this.getDesc(el)
      }
      else if (el.x !== undefined) {
        if (el.x === player.positionX && el.y === player.positionY) return this.getDesc(el)
      }
      else {
        //console.log(el)
        return this.getDesc(el)
      }
    }
    return "ERROR: No description found for zone at x=" + player.positionX + ", y=" + player.positionY
  }
  
  res.getDesc = function(el) {
    return (typeof el.desc === 'function' ? el.desc() : el.desc) + this.getFeatureDescs()
  }
  
  res.afterZoneEixit = function(dir) {
    for (let name in w) {
      const o = w[name]
      if (o.loc === this.name && o !== player) {
        o.loc = false
        o.positionX = player.positionX
        o.positionY = player.positionY
        o.zoneElsewhere = this.name
      }
    }
  }
  
  res.getFeatureDescs = function() {
    let s = ''
    for (let name in w) {
      const el = w[name]
      if (el.zone !== this.name || el.zoneBorder) continue
      if (player.positionX === el.positionX && player.positionY === el.positionY && el.featureLookHere) {
        s += ' ' + el.featureLookHere
      }
      else {
        const d = this.getDirection(player, el.positionX, el.positionY, el.range)
        if (d) s += ' ' + el.featureLook.replace('#', d)
      }
    }
    for (let el of this.getBorders()) {
      if (el.isAdjacentTo(player) && el.borderDesc) s += ' ' + el.borderDesc
    }
    return s
  }
  
  res.beforeEnter = function() {
    if (player.positionX === undefined) player.positionX = 0
    if (player.positionY === undefined) player.positionY = 0
    for (let name in w) {
      const o = w[name]
      if (o.zoneElsewhere === this.name && o.positionX === player.positionX && o.positionY === player.positionY) {
        o.loc = this.name
        o.zoneElsewhere = false
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

    const x2 = (this.size + player.positionX) * this.cellSize
    const y2 = (this.size - player.positionY) * this.cellSize
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
    isLocatedAt:function(loc) {
      return this.isAdjacentTo(player)
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
    isLocatedAt:function(loc) {
      if (adjacent) {
        return loc === this.zone && Math.abs(player.positionX - this.x) < 2 && Math.abs(player.positionY -this.y) < 2
      }
      else {  
        return loc === this.zone && player.positionX === this.x && player.positionY === this.y
      }
    }
  };
  return res;
}

