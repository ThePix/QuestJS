
createRoom('room_prototype', EXIT_FAKER(), {
  desc:'none!',

  paintedOnDoor:function(char) {
    char.msg(lang.stop_posture(char))
    msg("You try the door to the " + this.dir + " but it is just painted on!")
    return false
  },

})




const dungeon = {
  clutter:[],
  exitObjects:[],
  prototypeItems:[],
  roomDressingItems:[],
  backdropItems:[],
  roomTypeData:{},  
  decorators:{},  

  
  exitDescriptions:[
    'large iron door', 
  ],
  
  attsToCopyAcross:['alias', 'descriptor', 'rev_descriptor', 'scenery', 'tpNow', 'synonyms', 'desc', 'apply', 'applyExit'],

  createDungeonItem:function(data, addToClutter) {
    let name = "r_" +  verbify(data.alias)
    if (data.type) name += '_' + data.type
    if (data.flag) name += '_' + data.flag
    name = util.findUniqueName(name)

    const template = data.template ? data.template : TAKEABLE()
    
    const merch_template = data.price ? MERCH(data.price) : {}
    
    const item = createItem(name, template, merch_template, {
      flag:data.flag,
      roomType:data.type,
      room_flag:data.flag,
      func:data.f,
      text:data.t,
      
      examine:function(options) {
        let s = this.text
        if (currentLocation && currentLocation[this.alias + 'Addendum']) s += ' ' + currentLocation[this.alias + 'Addendum']
        msg(s, options)
      }  
    })
    if (data.isLocatedAt) item.isLocatedAt = data.isLocatedAt
    if (data.data) {
      for (const key in data.data) item[key] = data.data[key]
    }
    for (const key of this.attsToCopyAcross) item[key] = data[key]
    if (data.apply) dungeon.clutter.push(item)
    if (data.applyExit) dungeon.exitObjects.push(item)
  },


  createDungeonStuff:function(stuff) {
    for (const key in stuff) {
      this.roomTypeData[key] = stuff[key].data
      this.decorators[key] = stuff[key].decorator
    
      for (const data of stuff[key].backdropItems) {
        data.roomType = key
        data.template = {}
        data.scenery = true
        data.isLocatedAt = function(loc, situation) { return w[loc].roomType === data.roomType }
        const item = dungeon.createDungeonItem(data)
      }

      for (const data of stuff[key].roomDressingItems) {
        data.roomType = key
        data.template = {}
        data.scenery = true
        data.isLocatedAt = function(loc, situation) { return w[loc]['r_' + data.room_flag] }
        data.apply = function(room) {
          room['r_' + data.flag] = true
          if (this.func) this.func(room)
          if (this.desc) room.desc += ' ' + this.desc
        }

        const item = dungeon.createDungeonItem(data)
      }

      for (const data of stuff[key].exitItems) {
        data.roomType = key
        data.template = {}
        data.scenery = true
        data.isLocatedAt = function(loc, situation) { return w[loc]['r_' + this.room_flag] }
        data.applyExit = function(room1, room2, dir) {
          const reverse = lang.exit_list.find(el => el.opp === dir).name
          room1['exit_' + dir] = room2.name
          room1['r_' + this.flag] = true
          room1['exit_msg_' + dir] = this.msg
          if (this.descriptor) room1['exit_descriptor_' + dir] = this.descriptor
          if (this.func) this.func(room1)
          if (this.desc) room1.desc += ' ' + this.desc

          room2['exit_' + reverse] = room1.name
          room2['exit_msg_' + reverse] = this.rev_msg ? this.rev_msg : this.msg
          room2['r_' + this.flag] = true
          if (this.rev_descriptor) {
            room2['exit_descriptor_' + reverse] = this.rev_descriptor
          }
          else if (this.descriptor) {
            room2['exit_descriptor_' + reverse] = this.descriptor
          }
          if (this.func) this.func(room2, true)
          if (this.desc) room2.desc += ' ' + this.desc
        }

        const item = dungeon.createDungeonItem(data)
      }

      for (const data of stuff[key].prototypeItems) {
        data.roomType = key
        data.template = data.template ? data.template : TAKEABLE()
        data.scenery = data.desc ? true : false
        data.apply = function(room) {
          const obj = cloneObject(this, room.name)
          if (typeof obj.price === 'string') obj.price = random.dice(obj.price)
          if (this.desc) room.desc += '{if:' + obj.name + ':scenery: ' + this.desc + '}'
          if (this.tpNow) {
            obj.text = processText(obj.text)
          }
        }

        const item = dungeon.createDungeonItem(data)
      }
    }
  },
  
  addRandomClutter:function(room, chance = 100) {
    if (random.chance(chance)) {
      const array = dungeon.clutter.filter(el => el.roomType === room.roomType)
      if (array.length === 0) return
      const obj = random.fromArray()
      obj.apply(room)
    }
  },
  
  createExit:function(room1, room2, dir) {
    const reverse = lang.exit_list.find(el => el.opp === dir).name
    if (room1[dir]) {
      // There is already one going to the new room, so just create a simple one back again
      room2['exit_' + reverse] = room1.name   
    }
    else if (random.chance(20)) {
      random.fromArray(dungeon.exitObjects).applyExit(room1, room2, dir)
    }
    else {
      room1['exit_' + dir] = room2.name
      room2['exit_' + reverse] = room1.name
    }
  },

  generate:function() {
    const number_of_clone_rooms = 5
    const generatedRooms = []

     // where we are jumping off from, needs an exit to the first generated room
    let lastRoom = w.practice_room
    w.practice_room.north = new Exit('clone_room1', {dir:'north', origin:w.practice_room})
    endTurnUI(true)

    // generate a set of rooms, with exits
    for (let i = 1; i <= number_of_clone_rooms; i++) {
      lastRoom = dungeon.generateRoom('clone_room' + i, lastRoom, 'north')
      generatedRooms.push(lastRoom)
    }
    // now decorate the rooms, according to the "dungeon" room type.
    dungeon.dressRooms(generatedRooms, "dungeon")
  },  
      
  generateRoom:function(name, fromRoom, dir) {
    const clone = cloneObject(w.room_prototype, undefined, name)
    dungeon.createExit(fromRoom, clone, dir)
    return clone
  },  
      
  dressRooms:function(rooms, roomType) {
    for (const room of rooms) {
      room.roomType = roomType
      dungeon.decorators[roomType](room, dungeon.roomTypeData[roomType])
    }
  },
    
  
  exitsIntro:[
    ['The only way you can go is back', 'The only exit is'],
    ['You can also go', 'There is also an exit'],
    ['You can go', 'There are exits'],
    ['You can also go', 'There are also exits'],
  ],
  
  randomText:function(room, source, roomType) {
    if (!roomType) roomType = room.roomType
    // log(roomType)
    // log(source)
    // log(dungeon.roomTypeData)
    // log(dungeon.roomTypeData[roomType])
    const s = random.fromArray(dungeon.roomTypeData[roomType][source])
    if (typeof s === 'string') return s
    s.f(room)
    return s.t
  }
    
  
}


  tp.addDirective("?", function(arr, params) {
    const source = arr[0]
    return dungeon.randomText(params.room, source, arr[1])
  })
    
  
  tp.addDirective("r_exits", function(arr, params) {
    const exits = currentLocation.getExits()
    log(exits)
    let strs = []

    const specialExits = exits.filter(el => el.descriptor)
    log(specialExits)
    for (const el of specialExits) {
      strs.push(el.descriptor.replace('#', el.dir))
    }

    const plainExitDirs = exits.filter(el => !el.descriptor).map(el => el.dir)
    log(plainExitDirs)
    let introIndex = 0
    if (specialExits.length > 0) introIndex += 1
    if (plainExitDirs.length > 1) introIndex += 2
    const intro = random.fromArray(dungeon.exitsIntro[introIndex])
    log(currentLocation.name)
    log(introIndex)
    
    if (plainExitDirs.length === 1) {
      strs.push(intro + ' ' + formatList(plainExitDirs, {lastSep:lang.list_or, nothing:lang.list_nowhere}) + '.')
    }
    else if (plainExitDirs.length > 1) {
      strs.push(intro + ' ' + formatList(plainExitDirs, {lastSep:lang.list_or, nothing:lang.list_nowhere}) + '.')
    }

    return strs.join(" ")
  })





/*
    backdropItems
    alias    The alias, as normal. The name will be generated from this
    type     The room type this item is found in
    t        The description to use for EXAMINE
    data     Optional. A dictionary of other values to be added to the item


    roomDressingItems
    alias    The alias, as normal. The name will be generated from this
    flag     Any room with this flag (prepended with "r_" will have this item present
    type     Optional. The room type this item might be found in
    t        The descrition to use for EXAMINE
    f        Optional. If present, when the apply function is used, this will be called, and passed the room object.
    data     Optional. A dictionary of other values to be added to the item


    prototypeItems
    alias    The alias, as normal. The name will be generated from this
    type     The room type this item might be found in
    t        The descrition to use for EXAMINE
    tpNow    Optional. If true, the text processor will be run when this item is created. This can be useful for giving variety to clones.
    desc     Optional. If present, this item will be scenery and this text will be added to the room description. 
             It will be inserted into a text processor directive that will handle when the text shold be seen.
    data     Optional. A dictionary of other values to be added to the item
    price    Optional. The value of the item. Note that this should be a string, andyou can use stand RPG dice conventrions to add variety (eg "2d6+5")


    exitItems
    alias    The alias, as normal. The name will be generated from this
    flag     Any room with this flag (prepended with "r_" will have this item present
    type     Optional. The room type this item might be found in
    t        The descrition to use for EXAMINE
    msg      Message printed when the exit is used
    rev_msg  Optional. Message printed when the exit is used in the reverse direction (msg used if not present)
    f        Optional. If present, when the apply function is used, this will be called, and passed the room object and the direction.
    data     Optional. A dictionary of other values to be added to the item
*/


dungeon.createDungeonStuff({
  dungeon:{
    data:{
      descriptors:[
        'dank', 'chilly', 'large', 'oddly-shaped', 'sloping', 'dark', 'long, thin', 'circular', 'octangonal',

        {t:'bad-smelling', f:function(room) { room.smell = 'It smells of sulphur.' } },
      ],

      nouns:[
        'hallway', 'chamber', 'passage', 'corridor', 'gallery', 'hall', 'open area',
      ],
      one_exit_room_script:function(room, dir) {
        room.text = 'A room with one exit ' + dir + '.'
      },
      multi_exit_room_script:function(room, dirs) {
        room.text = 'A room with many exits.'
      },
    },
    
    
    decorator:function(room, data) {

        
      const exits = room.getExitDirs()
      if (room.iswayup) {
        room.text = room.enviro.wayupdesc + " %exits%"
      }
      else if (exits.length === 1) {
        data.one_exit_room_script(room, exits[0])
      }
      else if (exits.length === 2 && !room.iswaydown) {
        if (exits.includes("north") && exits.includes("south")) {
          room.text = "You are in a north-south passage."
        }
        else if (exits.includes("east") && exits.includes("west")) {
          room.text = "You are in a passage that runs east-west."
        }
        else {
          room.text = "You are at a corner in the passage."
        }
        room.corridor = true
      }
      else if (exits.length === 3 && random.chance(50) && !room.iswaydown) {
        if (!exits.includes("north")) {
          room.text = "A passage branches south from the east-west passage."
        }
        if (!exits.includes("south")) {
          room.text = "A passage north meets an east-west passage."
        }
        if (!exits.includes("west")) {
          room.text = "You are in a north-south passage, at a junction with a passage to the east."
        }
        if (!exits.includes("east")) {
          room.text = "A side passage from the north-south passage heads west."
        }
        room.corridor = true
      }
      else {
        data.multi_exit_room_script(room, exits)
      }
      
      //log(data)
      
      room.alias = processText("{?:descriptors} {?:nouns}", {room:room})
      room.headingAlias = (room.alias.match(/^[aeiou]/) ? 'An ' : 'A ') + room.alias
      room.desc = processText(room.headingAlias + ', with {random:high windows:a vaulted ceiling:arcane glyphs on the walls:an odd smell:a disturbing statue}.')
      room.desc += room.text
      room.desc += ' {r_exits}'
      room.exit_attributes = ['msg', 'npcLeaveMsg', 'npcEnterMsg', 'descriptor']
      dungeon.addRandomClutter(room, 30)
      dungeon.addRandomClutter(room, 30)
      
      
      
    },

    
    backdropItems:[
      { alias:'walls', t:'The walls are stone blocks, roughly cut.'},
      { alias:'floor', t:'The floor is hard-packed earth.', synonyms:['ground']},
      { alias:'ceiling', t:'The walls arch up to form a vaulted ceiling above you.'},
    ],

    roomDressingItems:[
      {
        alias:'slime', flag:'slime',
        t:'The slime is clear, but tinted green.',
        desc:'There is slime running down the walls.',
        f2:function(room) {
          room.desc += ' There is slime running down the walls.'
          room.wallAddendum = ' There is slime running down them.'
        },
      },
      {
        alias:'glyphs', flag:'glyphs',
        t:'The glyphs are written in blood....',
        f:function(room) {
          room.desc += ' There are arcane glyphs written on the walls.'
          room.wallsAddendum = ' There are arcane glyphs written on them.'
        },
        data:{read:'You try to read the glyphs, but it just causes you to feel dizzy. Perhaps they are not meant for mortal minds...'},
      },
    ],

    prototypeItems:[
      { alias:'bone', t:'Just a bone, probably {random:human:orc:goblin:elf}. Junk.', tpNow:true},
      { alias:'rusty sword', template:WEAPON('d4'), t:'An old short sweord; not ay use as a weapon now.', desc:'A rusty sword lies in the corner.'},
      { alias:'ring', price:'d10 + 10', t:'Just a cheap ring, worth maybe {money:item:price}.'},
      
    ],

    exitItems:[
      { alias:'arch', t:'An archway, made of black stone. Well, very dark grey.', tpNow:true, msg:'You head though the nearly black archway.', descriptor:'There is a black archway to the #.',},  
    ],
  },
  
  
  
  caves:{
    backdropItems:[
      { alias:'walls', t:'The sides of the cave are smooth, and slightky damp.'},
      { alias:'floor', t:'The ground is uneven an strewn with rocks.', synonyms:['ground']},
      { alias:'ceiling', t:'The rock arches above your head to form a roof to the cave.'},
    ],

    roomDressingItems:[
      {
        alias:'slime', flag:'slime',
        t:'The slime is clear, but tinted green.',
        desc:'There is slime running down the side of the cave.',
        f2:function(room) {
          room.desc += ' There is slime running down the sides of the cave.'
          room.wallAddendum = ' There is slime running down them.'
        },
      },
      {
        alias:'glyphs', flag:'glyphs',
        t:'The glyphs are written in blood....',
        f:function(room) {
          room.desc += ' There are arcane glyphs written on the sides of the cave.'
          room.wallsAddendum = ' There are arcane glyphs written on them.'
        },
        data:{read:'You try to read the glyphs, but it just causes you to feel dizzy. Perhaps they are not meant for mortal minds...'},
      },
    ],

    prototypeItems:[
      { alias:'bone', t:'Just a bone, probably {random:human:orc:goblin:elf}. Junk.', tpNow:true},
      { alias:'curious dagger', template:WEAPON('d4'), t:'An old dagger; not ay use as a weapon now.', desc:'A rusty sword lies in the corner.'},
      { alias:'amulet', price:'2d10 + 15', t:'Just a cheap amulet, worth maybe {money:item:price}.'},
      
    ],

    exitItems:[
      { alias:'arch', t:'An archway, made of black stone. Well, very dark grey.', tpNow:true, msg:'You head though the nearly black archway.', descriptor:'There is a black archway to the #.',},  
    ],
  },
})


