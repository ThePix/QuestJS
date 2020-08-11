"use strict";



/*
Have one prototype dungeon room with six exits, and disable exits as appropriate
Have themes and regions

*/

const dungeon = {
  levelsize:7,
  cellpercentage:80,
  exitpercentage:80,
}

//  Master function to generate the whole level.
dungeon.generateLevel(from_room) {
  const limit = (dungeon.levelsize - 1) / 2
  const level = from_room.level + 1
  let theme
  if (3 > level) {
    theme = 'e_dungeon'
  }
  else if (random.chance(50)) {
    theme = from_room.theme
  }
  else if (random.chance(50)) {
    theme = 'e_dungeon'
  }
  else {
    theme = random.fromArray(['e_dungeon'])
  }
  dungeon.generateBasicRooms(level, limit, theme)
  const centreroom = dungeon.setUpCentreRoom(level, from_room)
  const levellist = dungeon.checkConnectivity(level, limit, centreroom)
  const waydown = dungeon.setWayDown(levellist)
  for (let room of levellist) {
    //dungeon.decorateRoom(room)
  }
  //list remove (levellist, waydown)
  //Populate (levellist, level)
}


// Creates each room of the level.
// Rooms are created in a grid, with a random chance of being there depending
// on the distance from the centre.
dungeon.generateBasicRooms(level, limit, theme) {
  for (let x = -limit; x <= limit; i++) {
    for (let y = -limit; y <= limit; y++) {
      if (random.chance(100 - dungeon.cellpercentage * dungeon.fromCentre(x, y) / dungeon.levelsize)) {
        dungeon.generateBasicRoom(level, x, y, theme)
      }
    }
  }
}


// Creates a single room with default values.
// Also creates exits to south and west if there is a room there and at random.
dungeon.generateBasicRoom(level, x, y, theme) {
  const name = "cell_" + x + "_" + y + "_" + level
  const name_west = "cell_" + (x-1) + "_" + y + "_" + level
  const name_south = "cell_" + x + "_" + (y-1) + "_" + level
  const room = cloneObject("DungeonCell", name)
  room.accessible = false
  room.level = level
  //room.data = null_data
  room.theme = theme
  room.corridor = false
  room.alias = "Lost in a dungeon"
  room.x = x
  room.y = y
  const room_west = w[name_west]
  if (room_west !== undefined && random.chance(dungeon.exitpercentage)) {
    room.exitWest = name_west
    room_west.exitEast = name
    const type = random.int(0, 9)
    room.exitWestType = type
    room_west.exitEastType = type
  }
  const room_south = s[name_south]
  if (room_south !== undefined && random.chance(dungeon.exitpercentage)) {
    room.exitSouth = name_south
    room_south.exitNorth = name
    const type = random.int(0, 9)
    room.exitSouthType = type
    room_south.exitNorthType = type
  }
}



// Checks all rooms are connected, deleting any that are not.
dungeon.checkConnectivity(level, limit, centreroom) {
  // loop through each room, flagging those that are connected
  // keep going until no new ones are flagged
  let flag = FlagAdjacent(centreroom)
  while (flag) {
    flag = false
    for (x, -limit, limit) {
      for (y, -limit, limit) {
        name = "cell_" + x + "_" + y + "_" + level
        room = GetObject(name)
        if (not room = null) {
          if (room.accessible) {
            flag = flag or FlagAdjacent(room)
          }
        }
      }
    }
  }
  //
  // now delete rooms that are not accessible
  // and pick the way to next level
  levellist = NewObjectList()
  for (x, -limit, limit) {
    for (y, -limit, limit) {
      name = "cell_" + x + "_" + y + "_" + level
      room = GetObject(name)
      if (not room = null) {
        if (not room.accessible) {
          destroy (room.name)
        }
        else {
          list add (levellist, room)
        }
      }
    }
  }
  return (levellist)
]]></function>
  
  
  
<!--
Picks a room to be the way down.
-->  
<function name="SetWayDown" parameters="levellist" type="object"><![CDATA[
  sublist = NewObjectList()
  dist = 7
  while (ListCount(sublist) = 0) {
    foreach(o, levellist) {
      if (FromCentre(o.x, o.y) > dist) {
        list add (sublist, o)
      }
    }
    dist = dist - 1
    //msg(dist)
  }
  waydown = PickOneObject(sublist)
  waydown.iswaydown = true
  return (waydown)
]]></function>


  <function name="FromCentre" parameters="x, y" type="int">
    return (abs(x) + abs(y))
  </function>



// Attempts to flag the room in the given direction as accessible.
// Returns false if there is no room, or if it is already flagged, true otherwise.
dungeon.flagAdjacentOne(room, dir) {
  exit_name = GetExitByName (room, dir)
  if (exit_name = null) {
    return (false)
  }
  else {
    ex = GetObject(exit_name)
    to = ex.to
    if (to.accessible) {
      return (false)
    }
    else {
      to.accessible = true
      return (true)
    }
  }
</function>

