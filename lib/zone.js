"use strict";




const zoneExit = function(char, dir) {
  msg(dir)
  debugmsg("At " + char.positionX + "," + char.positionY)
  debugmsg("Going " + this.moveX + "," + this.moveY)
  const newX = char.positionX + this.moveX
  const newY = char.positionY + this.moveY
  
  // Exits to other places
  for (let el of this.origin.exits) {
    if (char.positionX === el.x && char.positionY === el.y && dir === el.dir) {
      msg(el.msg)
      if (el.blocking) return false
      console.log(this)
      this.origin.onZoneExit(dir)
      world.setRoom(char, el.dest)
      return true
    }
  }


  // If the direction is "in", "up", or "down", just say no
  if (dir === 'in' || dir === 'up' || dir === 'down') {
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
  msg("You walk " + dir + ".")
  world.setRoom(char, this.origin.name, false, true)
  
  debugmsg("Now at " + char.positionX + "," + char.positionY)
  return true;
};

const ZONE = function() {
  const res = {
    exits:[],
  };
  for (let ex of lang.exit_list) {
    if (ex.x === undefined) continue
    res[ex.name] = new Exit("", {use:zoneExit, moveX:ex.x, moveY:ex.y})
  }
  res.in = new Exit("", {use:zoneExit, moveX:0, moveY:0},)
  res.up = new Exit("", {use:zoneExit, moveX:0, moveY:0},)
  res.down = new Exit("", {use:zoneExit, moveX:0, moveY:0},)
  
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
  },
  
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
    if (char.positionX === undefined) char.positionX = 0
    if (char.positionY === undefined) char.positionY = 0
    for (let name in w) {
      const o = w[name]
      if (o.zoneElsewhere === this.name && o.positionX === game.player.positionX && o.positionY === game.player.positionY) {
        o.loc = this.name
        delete o.zoneElsewhere
      }
    }
  }
  
  // Gets the compass direction from that char to the given co-ordinate
  // If range is given, will return false oif the istance is greater than that
  // No guarantee what will hapen if the char is at at the coordinates
  // (because of the way floats are handled it may not be accurate/reliable)
  res.getDirection = function(char, objX, objY, range) {
    const x = objX - char.positionX
    const y = objY - char.positionY
    const r = Math.sqrt(x * x + y * y)
    if (range && r > range) return false
    const theta = Math.atan(y / x) * 180 / Math.PI
    if (x > 0 && theta <= 22.5 && theta >= -22.5) return "east"
    if (x > 0 && theta <= 67.5 && theta >= 22.5) return "northeast"
    if (x > 0 && theta >= -67.5 && theta <= -22.5) return "southeast"
    
    if (x < 0 && theta <= 22.5 && theta >= -22.5) return "west"
    if (x < 0 && theta <= 67.5 && theta >= 22.5) return "southwest"
    if (x < 0 && theta >= -67.5 && theta <= -22.5) return "northwest"

    return y > 0 ? "north" : "south"
  }

  res.getBorders = function() {
    const borders = []
    for (name in w) {
      if (w[name].zoneBorder && w[name].zone === this.name) borders.push(w[name])
    }
    return borders
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

