"use strict"



register('steampunk', {
  book:'Love\'s Labour\'s Lost',
  uniform:'a brown uniform, with gold-coloured trim',
  smell:'The house smells old and musty, like it never gets any fresh air at all.',
  listen:'Mandy can hear a quiet humming and rhythmic pounding of distant machinery.',
  floor:"The floor is wooden, and well-polished.",
  walls:"The walls are all panelled in wood.",
  door:"The door is wood; panelled and unpainted.",
  ceiling:"The ceiling is white, with simple decorations along each edge.",
})




createRoom("steam_hall", ROOM_SET("steam hall"), {
  windowsface:'south',
  in:new Exit('lift', {
    alsoDir:['southeast'],
    msg:'She steps into the lift.',
    simpleUse:function(char) {
      if (w.lift.getTransitDestLocation() !== this.origin) {
        return util.defaultSimpleExitUse(char, new Exit('lift_shaft', {origin:this.origin, dir:this.dir, msg:"She heads through the doorway."}))
      }
      return util.defaultSimpleExitUse(char, this)
    },
  }),
  desc:"This large room is dominated by a huge engine, turning a giant flywheel from two cylinders connected to beams way over Mandy's head. Every second or so there is a puff of steam from a piston, making the room very hot and humid. There is a gallery above, and numerous pipes of different sizes going everywhere, but especially heading down a corridor to the west. The doorway east {if:greenhouse_west:visited:0:looks like it might head outside - Mandy can see plants out there:heads to the greenhouse}. There is a smaller door to the southeast.",
  west:new Exit("steam_corridor"),
  east:new Exit("greenhouse_west"),
  scenery:[
    {
      alias:'gallery',
      examine:"The gallery above Mandy's head runs around three sides of the hall. Made of metal, and very solid-looking.",
    },
    {
      alias:'pistons',
      examine:"There are two huge pistons, inside the two huge cylinders, pounding in and out.",
    },
    {
      alias:'pipes',
      examine:"The pipes are all brass; some as thin as her fingers, some big enough to crawl through - if there was a way into them. And they were not full of steam.",
    },
    {
      alias:'engine',
      examine:"Each of the two huge cylinders pushes out the piston lifting the beam above it, then gasps out a puff of steam as the piston drops again.",
    },
    {
      alias:['flywheel', 'fly wheel'],
      examine:"The flywheel is arranged vertically and is taller than Mandy; it is spinning furiously, but does not seem to be achieving anything. Why is it not connected to a generator or something?",
    },
    {
      alias:'beams',
      examine:"Each beam is connected to a piston on one side and the flywheel on the other. As the piston goes up and down, the beam rocks up and down.",
    },
    {
      alias:'cylinders',
      examine:"The two steam cylinders are almost as tall as Mandy, standing upright on the ground. Each has an impressive array of tubes attached - though not enough to account for all the pipework in the room.",
    },
  ],
})

createItem("lift_fake_lower", {
  alias:'lift',
  loc:'steam_hall',
  synonyms:['elevator', 'controls', 'buttons', 'shaft'],
  isLocatedAt:function(loc) {
    return loc === this.loc && w.lift.getTransitDestLocation() !== this.loc
  },
  goInDirection:'in',
  examine:'Mandy feels there should be a lift here, not just an empty shaft.',
  scenery:true,
  calllift:function() {
    msg("Mandy frowns, unable to see any way to call the lift.")
  },
})

createRoom("lift_shaft", {
  windowsface:'none',
  liftNoted:false,
  out:new Exit('steam_hall', { alsoDir:['west', 'northwest']}),
  up:new Exit("_", {use:util.cannotUse, msg:'If she was only Peter Parker, she could get up there.{once: There must be lots of spiders, if she can only work out which is radioactive. And get it to bite her. Yeah, maybe not such a great idea, she decides.}'}),
  desc:function() {
    let s = "{once:A small room, with a strangely high roof. Looking up, Mandy realises she:Mandy} is standing at the bottom of a lift shaft. "
    s += w.lift.getTransitDestLocation() === w.upper_steam_hall ? 
      'The lift itself must be the ceiling of the room, on the floor above.' :
      'The lift itself is way over her head; she can see another doorway above the one she came through that must be the floor above.'
    s += ' There are rails on both side walls, with a rack between them, presumably for a pinion to engage.'
    if (!this.liftNoted) {
      s += "|It occurs to Mandy that if the lift is up there, someone must have ridden up in it, and he is likely still there. That is where she needs to get to! She just has to work out how..."
      this.liftNoted = true
    }
    return s + ' The only way out is back northwest.'
  },
  scenery:[
    { alias:['racks','teeth'], examine:'The rack is a long metal rail, with teeth -- effectively a cogwheel laid out flat. It is bolted to the wall.' },
    { alias:['rails'], examine:'There are two rails either side of each rack, bolted to the wall.' },
    { alias:['cogs','pinions'], examine:'The pinion is presumably in the mechanism on the lift itself, and so not visible from here.' },
  ],
})

createItem("lift_shaft_item", {
  alias:'lift shaft',
  loc:'lift_shaft',
  synonyms:['elevator shaft'],
  goInDirection:'up',
  scenery:true,
})






createRoom("steam_corridor", {
  windowsface:'north',
  alias:"a corridor",
  properNoun:true,
  desc:"The corridor runs from east to west, with three windows along the north side. Various brass pipes run the length of the south wall, while others turn abruptly to dive into the wall above a {if:grating:scenery:grating:vent} in the wall. All seem to converge at the east end of the corridor, above the doorway there. Water is dripping from one of the larger pipes, high up on the south side{if:chamber_pot:underLeak:, into a chamber pot}{if:chamber_pot:flipped:. There is an upturned chamber pot near where the water is dripping}.{if:Silver:active:|There is a silver humanoid here, looking very startled at Mandy's sudden appearance!}",
  east:new Exit("steam_hall"),
  west:new Exit("brass_dining_room", {simpleUse:function(char) {
    if (w.brass_dining_room.blocked()) return falsemsg("Mandy starts heading west, but the dining room is now so full of mannequins, she cannot get into it.")
    return util.defaultSimpleExitUse(char, this)
  }}),
  south:new Exit("steam_corridor_duct", {
    alsoDir:['in'],
    simpleUse:function(char) {
      if (w.grating.scenery) return falsemsg("It works in Hollywood... Mandy gives the grating a good pull... It is stuck solid. No way is she getting into the vents without something sharp and strong to prise the grating off the wall.")
      return util.defaultSimpleExitUse(char, this)
    },
    msg:"Following a fine tradition of Hollywood movies, Mandy climbs into the vent. What can possibly go wrong?",
  }),
  beforeEnter:function(exit) {
    if (w.chamber_pot.underLeakState > 4) {
      if (w.chamber_pot.underLeakState < 10) {
        if (exit.origin !== w.steam_corridor_duct) {
          this.tmp = "Mandy notices a silver person half way down the corridor. He - or it maybe - kicks over the chamber pot, spilling the water on the floor. Before Mandy can react, the jerk runs off "
          this.tmp += (exit.origin === w.steam_hall ? "west" : "east") + ", down the other end of the corridor."
        }
      }
      w.chamber_pot.underLeakState = 0
      w.chamber_pot.underLeak = false
      w.chamber_pot.flipped = true
    }
    if (exit.origin === w.steam_corridor_duct && w.Silver.active) {
      w.Silver.agenda = ['wait', 'run:agendaFlee']
    }
  },
  afterEnter:function() {
    if (this.tmp) {
      msg(this.tmp)
      delete this.tmp
    }
  },  
})

createItem("pipes", {
  loc:"steam_corridor",
  scenery:true,
  pronouns:lang.pronouns.plural,
  examine:"The pipes are brass, and polished to a shine, though as she looks more closely Mandy can see the more hidden bits are not so well cared for. Some are too hot to touch, others feel very cold.",
})

createItem("vent", {
  loc:"steam_corridor",
  scenery:true,
  synonyms:['duct'],
  pronouns:lang.pronouns.plural,
  examine:"{if:grating:scenery:The vent behind the grating looks dark:The vent is about half a metre wide and a little higher. There are pipes running through it at the top. It is too dark to see far into it}.",
})

createItem("grating", TAKEABLE(), {
  loc:"steam_corridor",
  scenery:true,
  synonyms:['grate'],
  examine:"The grating is metal and about half a metre square{if:grating:scenery:, and fitted over a duct in the south wall of the corridor. It feels a bit warm: and somewhat bent out of shape}.",
  openwith:function(options) {
    const item = options.secondItem
    if (item !== w.crocodile_tooth) return falsemsg("Mandy wonders if she could open the grating with {nm:item:the}. She shakes her head - no, that will not work.", {item:item})
    return this.take(options)
  },
  testTake:function(options) {
    if (!this.scenery) return true
    if (options.char === w.Patch) {
      this.msgTake = "'Patch, see if you can get that grating off there,' says Mandy.|Patch gives her a curious glance, but then kneels in front of the grating, and gives it a good pull, yanking it away from the wall. He proudly holds the grating as he stands up."
      return true
    }
    if (w.crocodile_tooth.loc === player.name && w.crocodile_tooth.size > 5) {
      this.msgTake = "Mandy jams the enlarged crocodile tooth into the small gap between the grating and the wall, then gives it a wiggle. The grating moves slight. She jams the tooth in further, and gives it another wriggle. Then moves it to another position, and does the same. Slowly but surely the grating is levered away from the wall, until at last it clatters to the floor. 'Yes!' says Mandy triumphantly, as she picks it up."
      return true
    }

    if (w.crocodile_tooth.loc === player.name) return falsemsg("Mandy looks at the crocodile tooth. If that was bigger, she might be able to use it to lever the grating off the wall.")

    return falsemsg("Mandy gives the grating a good pull, but it is not moving. If she was stronger... or had something to use as a lever...")
  },
  afterMove:function(options) {
    this.msgTake = lang.take_successful
  },
  open:function(options) { return this.take(options) },
})

createItem("leaking_pipe", {
  loc:"steam_corridor",
  synonyms:['flanges', 'water', 'drips'],
  scenery:true,
  parserPriority:-10,
  examine:"Mandy follows the descending column of drips up to a join somewhat above her head, where two wide pipes meet. Water is seeping from between the flanges.",
  repair:"{i:If I had a spanner,} thinks Mandy, {i:I could fix that leak... if it were the right size... and I could reach that high... and I were strong enough... and I could see any point to doing so...}",
})

createRoom("steam_corridor_duct", {
  windowsface:'none',
  alias:"vent duct",
  properNoun:true,
  noFollow:true,
  desc:"Mandy is in a duct way just slightly wider than she is. It is dark, and unpleasantly warm. To the north is the steam corridor, to the south only a few metres away, two very solid bars prevent further access.{once: {i:Hollywood, you've let me down!} she thinks to herself. {i:All I've done is great a place to hide while watching water drip...}}",
  north:new Exit("steam_corridor", {
    alsoDir:['out'], 
    msg:'{if:Silver:active:Mandy quickly scrambles out of the duct:Mandy climbs out of the vent, and brushes off her hands on her skirt}.',
  }),
  afterEnter:function() {
    if (w.chamber_pot.underLeak) {
      log('here')
      delete w.Silver.agendaWaitCounter
      w.Silver.agenda = w.Patch.loc === 'steam_corridor' ? ['wait:4','run:agendaPatch'] : ['wait:2','run:agendaArrive', 'run:agendaUpendPot', 'run:agendaLeave']
    }
  },
})




createItem("Silver", NPC(), {
  pronouns:lang.pronouns.thirdperson,
  synonyms:['silver man', 'silver humanoid', 'silver figure'],
  scenery:true,
  active:false,
  consultable:false,
  isLocatedAt:function(loc) { return this.active && (loc === "steam_corridor_duct" || loc === "steam_corridor") },
  parserPriority:10,
  examine:"The figure is human-shaped, but not human, Mandy realises. It's skin is silver, it has clothes or hair, but also no sexual characteristics. It looks to be slightly shorter than her.",
  'catch':function(options) { return this.take(options) },
  take:function() {
    w.brass_dining_room.mannequinCount = 0
    this.active = false
    const s = "|'Got you,' she yells triumphantly.Its skin feels disturbingly cold; soft like flesh, and yet somehow still hard like metal.|The silver twitches, trying to free itself, but Mandy has got both hands on it now. 'You're not going anywhere,' she says.|Suddenly it is gone and she is holding fresh air. 'Fuck!'"
    if (player.loc !== 'steam_corridor') {
      msg("Mandy quickly pulls herself out of the vent, and throws herself at the Silver, wildly trying to grab it. The creature looks up, startled, and looks left and right, perhaps trying to decide which way to run. That moment of indecision gives Mandy the opportunity to grab its ankle." + s)
      player.loc = 'steam_corridor'
      world.update()
      world.enterRoom(new Exit('steam_corridor', {dir:'north', origin:w.steam_corridor_duct}))
    }
    else {
      msg("Mandy makes a grab for the Silver, tackling it rugby-style, and knocking it to the ground." + s)
    }
  },
  agendaPatch:function() {
    if (currentLocation === w.steam_corridor_duct) msg("There is no sign of a Silver; Mandy wonders if Patch is scaring them off.")
  },
  agendaArrive:function() {
    log('here')
    if (currentLocation === w.steam_corridor_duct && w.chamber_pot.underLeak) {
      msg("From the duct, Mandy watches as a silver figure cautiously edges down the corridor from the dining room.")
      this.loc = 'steam_corridor'
      this.active = true
    }
  },
  agendaUpendPot:function() {
    if (currentLocation === w.steam_corridor_duct && w.chamber_pot.underLeak) {
      msg("The Silver in the corridor kicks the chamber pot over, spilling the small amount of water on the floor.")
      w.chamber_pot.underLeak = false
      w.chamber_pot.flipped = true
      w.chamber_pot.underLeakState = 0
    }
  },
  agendaLeave:function() {
    if (currentLocation === w.steam_corridor_duct && w.chamber_pot.flipped) {
      msg("The Silver walks off, towards the dining room.")
      this.active = false
    }
  },
  agendaFlee:function() {
    if (!this.active) return
    if (currentLocation === w.steam_corridor_duct || currentLocation === w.steam_corridor) {
      msg("The Silver dashes off, towards the dining room.")
    }
    this.active = false
  },
})





createRoom("upper_steam_hall", ROOM_SET("steam hall"), {
  headingAlias:'The Steam Hall (Upper)',
  windowsface:'north',
  desc:"This is a catwalk that overlooks the main steam hall, perhaps to give maintenance access to the upper parts of the great engine. Built of very solid metal, it hugs the north, east and west walls of the hall, and is about level with the beams that are pounding up and down on top of the engine in the centre of the hall. From here, she could go in the lift to get to the upper or lower levels, or head north or east.",
  in:new Exit('lift', {
    alsoDir:['southeast'],
    msg:'She steps into the lift.',
    simpleUse:function(char) {
      if (w.lift.getTransitDestLocation() !== this.origin) {
        if (char === player) {
          msg("Mandy is about to step through the doorway, when she realises there is nothing there! This is, she guesses a lift shaft, minus the lift.")
        }
        else {
          msg("Mandy is about to send {nm:char:the} through the doorway, when she realises there is nothing there! This is, she guesses a lift shaft, minus the lift.", {char:char})
        }
        if (!w.lift_shaft.liftNoted) {
          msg("It occurs to Mandy that if the lift is up there, someone must have ridden up in it, and he is likely still there. That is where she needs to get to! She just has to work out how...")
          w.lift_shaft.liftNoted = true
        }

        return false
      }
      return util.defaultSimpleExitUse(char, this)
    },
  }),
  scenery:[
    {
      alias:'pipes',
      examine:"The pipes are all brass; some as thin as her fingers, some big enough to crawl through - if there was a way into them. And they were not full of steam.",
    },
    {
      alias:'engine',
      examine:"Each of the two huge cylinders pushes out the piston lifting the beam above it, then gasps out a puff of steam as the piston drops again.",
    },
    {
      alias:['flywheel', 'fly wheel'],
      examine:"The flywheel is arranged vertically and is taller than Mandy; it is spinning furiously, but does not seem to be achieving anything. Why is it not connected to a generator or something?",
    },
    {
      alias:'pistons',
      examine:"There are two huge pistons, inside the two huge cylinders, pounding in and out.",
    },
    {
      alias:'beams',
      examine:"The beams are approximately level with Mandy; each is connected to a piston on one side and the flywheel on the other, down below. As the piston goes up and down, the beam rocks up and down.",
    },
    {
      alias:'cylinders',
      examine:"Mandy looks down on the two steam cylinders, watching the pistons go up and down.",
    },
  ],
  east:new Exit("greenhouse_catwalk_west"),
  north:new Exit("gallery_south"),
  silverSighting:{
    6:'Mandy sees a silver figure, staring at the lift shaft. It looks at Mandy, then jumps down the lift shaft. A monent later she sees it running out the other side of the steam hall on the lower level.',
    12:'Mandy can see another silver figure on the floor below. It looks up at Mandy, before dashing off into the greenhouse.',
    16:'There is a silver figure stood at the lift shaft. Mandy tries to edge close, but it hears her, and runs off.',
    19:'Another of those silver figures skitters across the lower floor of the steam hall has Mandy enters the upper hall.',
  },
  afterEnter() {
    if (this.silverSighting[this.visited % 20]) msg(this.silverSighting[this.visited % 20])
  },   
})



createItem("lift_fake_upper", {
  alias:'lift',
  synonyms:['elevator', 'controls', 'buttons', 'liftshaft', 'shaft'],
  isLocatedAt:function(loc) {
    return loc === this.loc && w.lift.getTransitDestLocation() !== this.loc
  },
  loc:"upper_steam_hall",
  goInDirection:'in',
  //climb:'Mandy looks at the liftshaft - could she climb it? Doubtful. And there is the matter of the lift blocking the shaft.',
  examine:'Mandy feels there should be a lift here, not just an empty shaft.',
  scenery:true,
  calllift:function() {
    msg("Mandy frowns, unable to see any way to call the lift.")
  },
})


createRoom("lift", TRANSIT('out'), {
  windowsface:'none',
  desc:"The lift is little more than a platform on vertical rails{once:, the proper exit from which is to the northwest, into the control room above the steam hall. Now inside it, :. }Mandy can see three buttons on a plinth, connected to the mechanism; a motor of some sorts at the back of the lift that turns cogs - or rather pinions - on a rack on each side.{once: That would mean the weight of the lift is held on just one tooth of each pinion; hmm, perhaps best not to think about that too much.} It is currently at {transitDest:lift}. The only exit is northwest.",
  out:new Exit("steam_control_room", {alsoDir:['west', 'northwest']}),
  testTransit:function(player, options) {
    if (w.Patch.loc !== this.name) return true
    if (this[this.transitDoorDir].name === 'steam_control_room') return true
    if (this[this.transitDoorDir].name === 'upper_steam_hall' && options.button.transitDest !== 'steam_control_room') return true
    if (this[this.transitDoorDir].name === 'steam_hall' && options.button.transitDest === 'steam_hall') return true
    msg("Mandy presses the button for \"{show:item:title}\". The motor shudders and groans, and the lift shakes for a few moments, without actually getting anywhere, before the motor gives up, and falls silent.{once: Mandy looks at Patch, and wonders how much he weighs...}", {item:options.button})
    return false
  },
  scenery:[
    {
      alias:['motor','engine'],
      examine:'The lift motor is about the size of a large suitcase; a mass of cogs and gears that is slowly leaking oil.',
    },
    {
      alias:'oil',
      examine:'The oil is black and looks disgusting. She not going anywhere near that.',
    },
    {
      alias:'lift',
      examine:'The lift is a metal platform that runs on two vertical rails.',
      goOutDirection:'out',
    },
    {
      alias:['buttons', 'plinth'],
      examine:'There are three buttons, arranged vertically on a plinth, one for each floor: Steam Hall, Upper Steam Hall and Control Room.',
      push:'Mandy wonders which button to press...',
    },
    { alias:['racks','teeth'], examine:'The rack is a long metal rail, with teeth -- effectively a cogwheel laid out flat. It is bolted to the wall.' },
    { alias:['cogs','pinions'], examine:'The pinion is presumably in the mechanism, and sadly not visible from here.' },
  ],
})
const liftDests = ['steam_hall', 'upper_steam_hall', 'steam_control_room']
const liftDestNames = ['Steam Hall', 'Upper Steam Hall', "Control Room"]
const seeFromFloras = ['at the bottom', 'in the middle', 'at the top']
for (let i = liftDests.length-1; i >= 0; i--) {
  createItem("button_" + (i+1), TRANSIT_BUTTON("lift"), {
    alias:"Button: " + (i+1) + ' (' + liftDestNames[i] + ')',
    examine:"A button with the number " + (i+1) + " on it.",
    transitDest:liftDests[i],
    title:'Floor ' + (i+1) + ': ' + liftDestNames[i],
    seeFromFlora:seeFromFloras[i],
    scenery:true,
    parserPriority:15,
    transitAlreadyHere:"Mandy presses the button marked " + (i+1) + "; nothing happens. Perhaps the lift is already there?",
    transitGoToDest:"Mandy presses the button marked " + (i+1) + "; the motor on the floor of the lift comes to life. A few moments later she is at the " + liftDestNames[i] + " floor.",
  })
}






createRoom("steam_control_room", {
  alias:"control room",
  windowsface:'none',
  north:new Exit("weird_room", {msg:'A little nervous, Mandy steps into the pool of darkness...'}),
  in:new Exit('lift', {
    alsoDir:['southeast'],
    msg:'She steps into the lift.',
  }),
  desc:"The control room is a masterpiece in wood and brass. Every surface is wood, and every piece of wood is littered with brass switches, knobs and dials. There is a rather grand chair in the middle of it all{if:Winfield_Malewicz:loc:steam_control_room:, with an old man sitting on it}. A doorway to the southeast goes back to the lift, while a strange pool of darkness might be another exit to the north.{if:invite:scenery: There is a wedding invitation on the desk.}",
  smell:'{ifMoreThan:steampunk_controls:count:4:The room smells of burning wood.:There is a slight smell of lubricating oil.}',
  afterFirstEnter:function() {
    msg("'Good day, miss,' says the man. 'I'm Malewicz; Dr Winfield Malewicz. It's such a delight to actually meet someone after all this time.' This is the guy the letter is for, Mandy realises.")
    w.Winfield_Malewicz.loc = "steam_control_room"
  },
  afterEnter:function() {
    if (w.Winfield_Malewicz.loc === undefined || w.Winfield_Malewicz.loc === this.name || w.Winfield_Malewicz.dead) return
    if (w.Winfield_Malewicz.loc === 'weird_room') {
      msg("Dr Malewicz follows Mandy out of the strange room. '{random:I hate that place:Always gives me the willies going in there:Loathsome man}', he says.") 
    }
    else {
      msg("Dr Malewicz follows Mandy into the control room.") 
    }
    w.Winfield_Malewicz.loc = this.name
  },
  scenery:[
    {alias:'chair', examine:'The chair at first glance looks like a golden throne, but Mandy realises it is brass, which is not quite so impressive. It does have red padding on it, though.'},
    {alias:['wood','surface'], examine:"The wood looks to be walnut to Mandy's eye."},
  ],
})

createItem("steampunk_controls", {
  alias:'controls',
  count:0,
  pronouns:lang.pronouns.plural,
  loc:"steam_control_room",
  synonyms:['knobs','dials', 'switches'],
  examine:'There is a myriad of knobs, switches and dials, with no obvious pattern.{ifMoreThan:steampunk_controls:count:4: There is smoke coming from the panel.}',
  pull:function(options) { this.interact(options, 'pull') },
  push:function(options) { this.interact(options, 'push') },
  turn:function(options) { this.interact(options, 'turn') },
  flip:function(options) { this.interact(options, 'flip') },
  interact:function(options, verb) { 
    if (!w.Winfield_Malewicz.dead) {
      msg("Mandy reaches out to " + verb + " one of the controls. 'Please don't touch any of them,' says Dr Malewicz.{once: 'They are all carefully set to maintain the balance of the house.'}")
      return false
    }
    this.count++
    if (this.count === 5) {
      msg("Mandy " + verb + "s one of the controls at random. There is a grinding noise from below it, and smoke starts to gently waft up from behind it. It does not smell good.")
    }
    else if (this.count > 5) {
      msg("Mandy " + verb + "s one of the controls at random. Smoke continues to fill the room.")
    }
    else {
      msg("Mandy " + verb + "s one of the controls at random. Nothing happens.")
    }
    return true
  },
})

createItem("Winfield_Malewicz_corpse", {
  alias:'Winfield Malewicz\'s corpse',
  synonyms:['man', 'body', 'corpse'],
  examine:'After all the corpses on the beach, Mandy should be used to bodies, but knowing this one is dead at her hand gives it a fresh horror. She decides she would rather not look at it.',
  take:"The thought of picking up Malewicz's corpse makes Mandy feel sick. And she really does not want more blood on her.",
})

createItem("bloody_brick", SIZE_CHANGING(), {
  desc4:'The bloody brick is a very small house brick, with "London Brick Company" stamped into it, and covered in the blood of Dr Malewicz.{once: It occurs to Mandy that the murder weapon will be easier to dispose of now...}',
  desc5:'The bloody brick - or murder weapon - is an ordinary house brick, with "London Brick Company" stamped into it, and covered in the blood of Dr Malewicz.',
  desc6:'The bloody brick - or murder weapon - is a huge house brick, with "London Brick Company" stamped into it, and covered in a disturbing amount of blood.',
})

createItem("Winfield_Malewicz", NPC(), {
  songlist:[],
  synonyms:['old man', 'doctor', 'dr'],
  parserPriority:10,
  endFollow:function() {
    msg("'Wait here,' says Mandy to {nm:npc:the}.", {npc:this})
    return falsemsg("'I wasn't going anywhere!'")
  },
  examine:'Dr Malewicz is a slim man, perhaps a little below average height, with a friendly smile. He might be about forty, and, unaccountably, his hair is very neat, and not at all what Mandy expects from a mad scientist. He is wearing a tweed jacket, with a burgundy tie.',
  startFollow:function() {
    msg("'Follow me,' says Mandy to {nm:npc:the}.", {npc:this})
    return falsemsg("'I doubt the house will let me. It has kept me here a very long time.'")
  },
  talkto:function() {
    msg("Mandy wonders what {i:topics} she could {i:ask Dr Malewicz about}...")
    return false
  },
  kill:function() {
    if (currentLocation === w.lounge) return falsemsg("Why would Mandy want to kill Dr Malewicz now?")

    msg("Mandy feels a sudden urge to kill Dr Malewicz. The brick in her hand will do nicely... She edges round the back of him, then brings the brick down hard on the back of his head. He crumples to the floor.")
    msg("Mandy looks at the body, then the brick. Both are covered in blood. 'Oh fuck,' she shrieks, 'what have I done?'")
    if (currentLocation === w.weird_room) {
      msg("'{smallcaps:You've killed him,}' says the house-man. '{smallcaps:Good job too. For over a century I've had to suffer his company. God, it boring. It's so dull! Constantly whining. I'm sure it'll be much for fun, just you and me.}'")
      msg("Mandy looks at the brick again. Where had that come from? 'You made me do it,' she accuses the house-man.")
      msg("'{smallcaps:No! I will admit to putting the brick in your hand, but you chose to do that. And now you get to live with the consequences. Look on the bright side - at least you do get to live with the consequences, unlike Malewicz.}'")
    }
    else {
      msg("After a while her heart rate returns to something like normal. She looks at the brick again. Where did that come from? She did not have that before.")
      this.deathToBeNoted = true
    }
    delete this.loc
    this.dead = true
    w.Winfield_Malewicz_corpse.loc = currentLocation.name
    w.bloody_brick.loc = player.name
  },
  receiveItemsFailMsg:"Mandy offer {nm:item:the} to Dr Malewicz, who looks at it with disdain. 'what's that for?' he asks.",
  receiveItems:[
    {
      item:w.letter,
      f:function(options) {
        msg("Mandy gives the letter to Dr Malewicz 'This is for you; it was in the street.'")
        msg("'A letter?' He turns it over, inspecting the address. 'It is for me! This is most unusual.'") 
        msg("'I know, right? Who sends letters nowadays?'")
        msg("Malewicz proceeds to open the envelope, and eagerly pulls out the letter. 'A wedding invitation! How delightful!' He thinks for a moment. 'What's the date?'")
        msg("'Thirteenth of May.... Er, 2016.'")
        msg("'Oh, it seems I have missed it then. And the centenary of it too, if it comes to that. How disappointing.' He throws the envelope away, but puts the invitation on the desk. 'He was married back in 1903, but I was aware it was not a happy marriage. His new wife is, I think, his cousin. I hope they'll be happy. Or were happy, I suppose should say.'")
        delete w.letter.loc
        w.invite.loc = 'steam_control_room'
        w.invite.scenery = true
        return true
      },
    },
  ],
  askOptions:[
    { name:'Himself',
      test:function(p) { return p.text.match(/himself|who he|doctor|winfield|malewicz|man/) || (p.text.match(/he is/) && p.text2 === 'who')},
      script:function() {
        msg("'Who exactly are you?' says Mandy.|'I'm Dr Winfield Malewicz, inventor and natural philosopher.' He pauses, and Mandy wonders if he has more to say. 'I was born in Coventry - my parents came from Poland many years ago - and studied at Cambridge University, and I have been studying the very nature of space and time. I read a very promising thesis by a promising student of Prof. Alfred Kleiner, and that led to me to certain experiments that, in hindsight, were a little ill-advised. But might I ask who you are?")
        msg("'I'm Amanda Kettleton, but everyone calls me Mandy. I was just passing the house... and I kind of got trapped here.'");
        msg("'{class:riddle:Story of my life!} This was my house once,' he says. 'I built the analytical machine you see before you. Now, well, I think it belongs to itself now. You can talk to it, you know.' He indicates the doorway to the north. 'Only thing that keeps me sane, oh the {class:riddle:midnight memories} we've shared.' Mandy is not entirely convinced it has kept him sane.");
        w.Winfield_Malewicz.songlist.push("Midnight memories")
        w.Winfield_Malewicz.songlist.push("Story of my life")
      }
    },
    { name:'What happened',
      test:function(p) { return p.text.match(/what happened|house/) || (p.text.match(/happen/) && p.text2 === 'what')}, 
      script:function() {
        if (currentLocation !== w.lounge) {
          msg("'What... happened?'")
          msg("'It came alive. The house, that is. My fault really. I suppose there really are things that man should not mess with.'");
          msg("'Bullshit. What about iPods and Facebook and XBox; where would they be if mankind took that attitude?'");
          msg("'I... have no idea what you are talking about.'");
          msg("'No, you don't, which is kind the point really. So just tell me what happened.'");
          msg("'It got sick. The silvers, I don't know where they came from, but they infected it like a virus. They wanted to infect other houses, {class:riddle:more than this} one.");
          w.Winfield_Malewicz.whatHappenedAsked = true
          w.Winfield_Malewicz.songlist.push("More than this")
        }
        else if (w.Winfield_Malewicz.whatHappenedAsked) {
          msg("'And again, what happened?'")
          msg("'I must confess I am not entirely certain. It is as though there were two minds at work; the evil house being dominant, but the good house that we briefly saw was good and trying to help us. It was the good house that posed the riddle, knowing the answer would end it all, and somehow tricked the evil house into asking it.'")
          if (!w.Winfield_Malewicz.riddleExplained) {
            w.Winfield_Malewicz.riddleExplained = true
            msg("'And the answer?'")
            msg("'Obvious in hindsight' say Dr Malewicz, 'Pass through time and space in one direction,  in a linear, orderly manner. But why you?'")
            msg("Mandy shrugged. 'I was into a boy-band called One Direction.'")
          }
        }
        else {
          msg("'What... happened?'")
          msg("'It came alive. The house, that is. My fault really. I suppose there really are things that man should not mess with.'");
          msg("'Bullshit. What about iPods and Facebook and XBox; where would they be if mankind took that attitude?'");
          msg("He looks at Mandy in confusion for a moment, before continuing. 'I must confess I am not entirely certain, but it appears there were two minds at work; the evil house being dominant, but the good house that we briefly saw was good and trying to help us. It was the good house that posed the riddle, knowing the answer would end it all, and somehow tricked the evil house into asking it.'")
          if (!w.Winfield_Malewicz.riddleExplained) {
            w.Winfield_Malewicz.riddleExplained = true
            msg("'And the answer?'")
            msg("'Obvious in hindsight' say Dr Malewicz, 'Pass through time and space in one direction,  in a linear, orderly manner. But why you?'")
            msg("Mandy shrugged. 'I was into a boy-band called One Direction.'")
          }
        }
      } 
    },
    { name:'Patch',
      test:function(p) { return p.text.match(/patch/) },
      script:function() {
        msg("'What's the deal with Patch?'");
        msg("'Patch?' Dr Malewicz looks confused.");
        msg("'The corpse you were trying to animate with lightning.'");
        msg("'I can assure that that is nothing to do with {i:me}. Yes, I had seen it, and I would {class:riddle:happily} destroy it if I thought I could. As though lightning can animate a body; quite the reverse in fact! It tends to be fatal.'");
        w.Winfield_Malewicz.songlist.push("Happily")
        if (w.Patch.loc === w.Winfield_Malewicz.loc) {
          msg("'He is literally standing right here.'")
          msg("'What? Oh. Oh, yes, I see. Well I suppose that puts it in a slightly different light.'")
          msg("'You hadn't noticed him?'")
          msg("'Of course I had, but a gentleman does not ask about that sort of thing. Or not in my day. I dare say these things have changed.'")
          msg("'Right...'")
        }
      }
    },
    { name:'Song Titles',
      test:function(p) { return p.text.match(/song/) && currentLocation === w.lounge && w.Winfield_Malewicz.songlist.length > 2 },
      script:function() {
        msg("'So how did you know those One D song titles?'");
        msg("'I'm not sure what you're talking about.'");
        let s = "'You were dropping me clues. "
        s += formatList(w.Winfield_Malewicz.songlist.map(el => "{i:" + el + "}"), {lastJoiner:'and'})
        s += ". They're all One Direction song titles.'"
        msg(s)
        msg("'I still don't know what you are talk about.'")
      }
    },
    { name:'Riddle',
      test:function(p) { return p.text.match(/riddle|question/) && w.weird_room.visited > 0 },
      script:function() {
        if (currentLocation !== w.lounge) {
          msg("'It keeps asking the same question. What direction?'");
          msg("'I'm sorry, I can't help you. I would {class:riddle:happily} do so if I could, but I rather think it's {class:riddle:gotta be you}, you see. You have to solve this {class:riddle:one thing}.'");
          msg("'But I don't know what to do!'");
          msg("'Well, you have to do it, {class:riddle:one way or another}. Otherwise {class:riddle:you and I} are here for a very long time.'");
          w.Winfield_Malewicz.songlist.push("One way or another")
          w.Winfield_Malewicz.songlist.push("You and I")
          w.Winfield_Malewicz.songlist.push("Gotta be you")
          w.Winfield_Malewicz.songlist.push("One thing")
        }
        else if (!w.Winfield_Malewicz.riddleExplained) {
          w.Winfield_Malewicz.riddleExplained = true
          msg("'So the riddle... Why was \"one\" the answer again?'")
          msg("'Obvious in hindsight' say Dr Malewicz, 'Pass through time and space in one direction,  in a linear, orderly manner. But surely you knew that? You were the one who got it right.'")
          msg("Mandy shrugged. 'I was into a boy-band called One Direction.'")
        }
        else {
          msg("'So the riddle... I mean, why?'")
          msg("'It is rather strange,' admits Dr Malewicz. 'It is as though the house's subconscious ws working to help us. I would love to do some more investigations...'")
          msg("'If you could wait until I am well away, that would be great.'")
        }
      }
    },
    { name:'How long here',
      test:function(p) { return p.text.match(/what happened/) || (p.text.match(/long/) && p.text.match(/here/) && p.text2 === 'how')}, 
      script:function() {
        msg("'How long have you been here?'");
        msg("'A long time. It feels like several years, but I suspect considerably longer have passed on the outside. Your mode of dress looks quite alien to me, for {class:riddle:one thing}; the colours are garnish, the thread I cannot guess at. {class:riddle:More than this}, your hemline is, well, it would be considered scandalous in 1911. And yet I suppose they are common in your time?'");
        if (currentLocation !== w.lounge) {
          msg("Mandy glanced down at her uniform, now inexplicably red and hot pink. 'I was wearing grey and navy when I entered the house. But yeah, its 2016.'")
        }
        else {
          msg("Mandy glanced down at her uniform, now back to its usual colours. 'Yeah, its 2016.'")
        }
        msg("'Over a hundred years...'");

        w.Winfield_Malewicz.songlist.push("One thing")
        w.Winfield_Malewicz.songlist.push("More than this")
      }
    },
    { name:'Escape',
      test:function(p) { return p.text.match(/escape|way out|get out/) },
      script:function() {
        msg("'Is there no way out?'");
        if (currentLocation === w.lounge) {
          msg("Dr Malewicz frowns. 'I was rather assuming we had solved it. Just step outside the door.'")
        }
        else {
          msg("'None. The walls might as well be made of {class:riddle:steel, my girl}.'");
          w.Winfield_Malewicz.songlist.push("Steal my girl")
        }
      }
    },
    { name:'Silvers',
      test:function(p) { return p.text.match(/silver/) },
      script:function() {
        msg("'What are the silver figures I keep seeing?'")
        if (currentLocation !== w.lounge) {
          msg("'Entities from another dimension. I think they slipped through when the house... changed. They're worse after dark - the {class:riddle:night changes} things around here; they'll try to {class:riddle:drag me down} to their lair. So far, I have managed to repel them. That is why I hide in the control room. With the lift up here, they can't reach me. It was peaceful until that strange room appeared and the house started to taunt me.'")
        }
        else {
          msg("'Entities from another dimension. I think they slipped through when the house... changed. They were worse after dark. That was why I took to hiding in the control room. With the lift up there, they couldn't reach me. It was peaceful until that strange room appeared and the house started to taunt me.'")
        }
        w.Winfield_Malewicz.songlist.push("Night changes")
        w.Winfield_Malewicz.songlist.push("Drag me down")
      }
    },
    { name:'Einstein',
      test:function(p) { return p.text.match(/(einstein|albert)/) },
      script:function() {
        msg("'So, er, you know Einstein?'")
        msg("'What makes you say that?'")
        msg("'Er...' She does not want him to know she read the invite. 'This seems like the sort of stuff he would be into.'")
        msg("'You're familiar with his work? I always suspected his research would go down in {class:riddle:history}.'")
        msg("'Sure. Relativity and... that... stuff.'")
        w.Winfield_Malewicz.songlist.push("History")
      }
    },
    { name:'Wedding Invitation',
      test:function(p) { return p.text.match(/(elsa|wedding|invitation)/) && w.invite.hasBeenRead },
      script:function() {
        msg("'Is that an invitation to Einstein's wedding?'")
        msg("'As it happens, yes. Not that it's any of your business.'")
        msg("'So you are friends with Einstein. Wow.'")
        msg("'I suppose I've missed it by now.'")
        msg("'By about a century!'")
        w.Winfield_Malewicz.songlist.push("History")
      }
    },
    { // toilets
      test:function(p) { return p.text.match(/toilet|piss|wee/) },
      script:function() {
        msg("'So where do you go to the toilet?' asks Mandy.")
        msg("'I beg your pardon?' He looks slightly aghast at the question.")
        msg("'Where do you go to the toilet?' asks Mandy. 'I've been all over this stupid house, and never seen a toilet.'")
        msg("'Oh, er, well I see. Well, as it happens, I've not had to use a toilet since all this happened.'")
        msg("'For over a century? Isn't that a bit odd?'")
        msg("'I've been trapped in a three bedroom house with a theatre and a castle inside for over a hundred years. I'm afraid \"a bit odd\" doesn't really cover it.'")
      }
    },
    { name:'Relativity',
      test:function(p) { return p.text.match(/relativity/) && w.invite.hasBeenRead },
      script:function() {
        msg("'I guess you know all about relativity?' She had to admit she had not paid that much attention in physics, but she was fairly sure that had not been on the syllabus.")
        msg("'I'm not exactly an expert. I'm what you might call a practical scientist, rather than theoretical. I'm afraid some of the maths is beyond me.'")
        msg("'Oh, God, yes!' says Mandy with feeling. If even Dr Malewicz struggles with maths, she does not feel so bad about doing so too.")
        msg("'The basic principle is that if you are on a train and it is a perfectly smooth ride, there is no way to tell if you are moving or stationary without looking outside, and therefore it is equally valid to say the train is stationary and the world is moving as it is to say the train is moving.'")
        msg("'That's all there is too it?'")
        msg("'Well, that's the starting point.'")
      }
    },
    { name:'family',
      test:function(p) { return p.text.match(/family/) && (w.gallery_south_scenery_portraits.examine_count || w.front_hall_scenery_portraits.examine_count) },
      script:function() {
        msg("'I saw all those paintings, are they your family?'")
        msg("'Paintings?'")
        if (w.front_hall_scenery_portraits.examine_count) {
          msg("'In the front hall, there are five. Old guy in uniform, old lady, woman, two other guys.'")
        }
        else {
          msg("'There's a painting I saw of a family; a man and woman, three kids.'")
        }
        msg("'Oh, yes. Well, as you surmise, they are indeed my family. My father and mother, and my older brother and sister." )
      }
    },
    { // father
      test:function(p) { return p.text.match(/father/) && (w.gallery_south_scenery_portraits.examine_count || w.front_hall_scenery_portraits.examine_count) },
      script:function() {
        msg("'What was your father like?'")
        msg("'A fine man! I always had a lot of respect for him. He brought my mother to England in 1863, when the uprising failed, then joined the British army to provide for her. He eventually became a captain.'")
        if (w.gallery_scenery_portraits) {
          msg("'So the man on the white stallion was him?'")
          msg("'Oh yes! Though I think the white stallion might be artist licence.'")
        }
        msg("'So did he fight a battle on a beach? Against soldiers in blue? And was that his horse that died?'")
        msg("He fought in a lot of battles, but yes, I do seem to remember him telling me about his horse dying under him while he was defending a beach against some incursion. I'm afraid the details have escaped me.'")
      }
    },
    { // mother
      test:function(p) { return p.text.match(/mother/) && (w.gallery_south_scenery_portraits.examine_count || w.front_hall_scenery_portraits.examine_count) },
      script:function() {
        msg("'What was your mother like?'")
        msg("'A very loving woman! It cannot have been easy for her when she came to England, not knowing anyone, hardly speaking the language, and my father away so much.'")
      }
    },
    { // sister
      test:function(p) { return p.text.match(/sister/) && (w.gallery_south_scenery_portraits.examine_count || w.front_hall_scenery_portraits.examine_count) },
      script:function() {
        msg("'What was your sister like?'")
        msg("'Dorothea... Though we were born in England, our parents were Polish, which to me is a source of pride, but she always seemed rather ashamed of the fact. '")
        if (w.front_hall_scenery_younglady.examine_count) {
          msg("Mandy thought about the painting of the blonde woman in the hall. 'Is that why she bleached her hair?'")
          msg("'What? Oh, well, yes, I suppose it was.'")
        }
      }
    },
    { // brother
      test:function(p) { return p.text.match(/brother|cecil/) && (w.gallery_south_scenery_portraits.examine_count || w.front_hall_scenery_portraits.examine_count) },
      script:function() {
        msg("'What was your brother like?'")
        msg("'A bit of a rogue, if I'm honest. Cecil always had a way with the women - quite the opposite to me - and delighted in leading them astray. And vice versa. He rather fancied himself as a thespian, but was never very successful, I'm afraid.'")
        w.Winfield_Malewicz.askedAboutBrother = true
      }
    },
    { // clockwork thespian, before
      name:'Clockwork thespian',
      test:function(p) { return p.text.match(/thespian|actor/) && currentLocation === w.lounge },
      script:function() {
        w.Winfield_Malewicz.askedAboutClockworkThespianBefore = true
        msg("'What's the deal with the clockwork thespian?'")
        if (!w.Winfield_Malewicz.askedAboutBrother) {
          msg("'Cecil... My brother. Rather fancied himself as an actor, but he could never get a part! Then the house sucked him... I tried to keep him wound up for months, but then I decided it was more of a mercy to just let him sleep, I'm afraid.'")
        }
        else {
          msg("'That's Cecil... I tried to keep him wound up for months, but then I decided it was more of a mercy to just let him sleep, I'm afraid.'")
        }
        msg("Mandy thinks back to her conversations with him. 'Wait, he said the \"Night Changes\", another One Direction song. And \"Perfect\". That was how he was getting me out of the house, clues to the riddle, not an excursion to a battlefield!'")
      }
    },
    { // clockwork thespian, after
      test:function(p) { return p.text.match(/thespian|actor/) },
      script:function() {
        if (w.Winfield_Malewicz.askedAboutClockworkThespianBefore) {
          msg("'So again, what's the deal with the clockwork thespian?'")
          msg("'Cecil? I hope he is returned to normal. I'm not sure quite how this works; he could be elsewhere in the house, or in a theatre somewhere? It is quite a mess, but at least it feels like a mess I can resolve!'")
        }
        else {
          if (!w.Winfield_Malewicz.askedAboutBrother) {
            msg("'Cecil... My brother. Rather fancied himself as an actor, but he could never get a part! Then the house sucked him... I tried to keep him wound up for months, but then I decided it was more of a mercy to just let him sleep, I'm afraid.'")
          }
          else {
            msg("'That's Cecil... I tried to keep him wound up for months, but then I decided it was more of a mercy to just let him sleep, I'm afraid.'")
          }
          msg("Mandy thinks back to her conversations with him. 'Wait, he said the \"Night Changes\", another One Direction song. And \"Perfect\". That was how he was getting me out of the house, clues to the riddle, not an excursion to a battlefield!'")
        }
      }
    },
    { // tiny man
      test:function(p) { return p.text.match(/bert|tiny man/) },
      script:function() {
        msg("'Who's the tiny man?'")
        msg("'Oh, yes, Big Bert,' says Dr Malewicz. 'The house's twisted sense of humour, I suppose. He came here delivering coal not long after it happened, the house got him. Sometimes I think it's a mercy he cannot remember just how long it's been. Later his wife came looking for him, and it got here too, but I'm not sure what happened to her.")
        msg("'Did she become the china doll?'")
        msg("'Oh, goodness, I hope not. That's even more disturbing.'")
      }
    },
    { // balloon
      test:function(p) { return p.text.match(/balloon/) },
      script:function() {
        msg("'Who's with that yellow balloon?' asks Mandy. 'It seems to rest the room.'")
        msg("'Yes, a fascinating phenomenon,' says Dr Malewicz. 'Unfortunately whenever I tried to study it I forgot where I was every few seconds.'")
        msg("'You could just keep it off the ground.'")
        msg("'What? No, no, that would upset the conditions. Einstein proposed that a huge mass would bend time, I wondered if the balloon was mocking him - something with negligible mass distorting time.'")
      }
    },
    { // lift
      test:function(p) { return p.text.match(/lift|elevator/) },
      script:function() {
        msg("'Why is it so hard to use the lift?' asks Mandy.")
        msg("'It's actually quite simple - there is a button corresponding to each floor.'")
        msg("'Right... But not much help when you're on a diufferent floor.'")
        msg("'Oh, I see what you mean. well that is deliberate. I removed the controls so the Silvers could not call the lift while I'm up here.'")
      }
    },
    { // hourglass
      test:function(p) { return p.text.match(/hourglass/) },
      script:function() {
        msg("'What's with the freaky hourglass?' asks Mandy.")
        msg("'Oh, a little project of mine. The greenhouse is so delightful I have developed an interest in botany. But I'm afraid I lack patience, and so used the hourglass. It's just an ordinary hourglass - the clever stuff is in the pedestal and buried in the ground. But each time I used it, the hourglass lost some sand. I fixed a tap, hoping to be able to fill it, but never found any sand.'")
      }
    },
    { name:'Mannequins',
      test:function(p) { return p.text.match(/mannequin/) && w.brass_dining_room.visited > 2 },
      msg:"'What's the deal with the mannequins in the dining room?'|'I'm not sure,' admits Dr Malewicz. 'I think they are connected to the Silvers, possibly acting as a gateway from their dimension to this. Sometimes there are so many it's impossible to get in the dining room, and that seems to be when they are most active. Other times there are just a couple sat at the table.'",
    },
    {
      script:function(p) {
        msg("Mandy asks Dr Malewicz about " + p.text + ".")
        msg("'I'm sorry my dear,' he replies, 'I have no idea what you're talking about. Is there some other topic you'd like to discuss?'")
      }
    },
  ],
  tellOptions:[
    {
      test:function(p) { return p.text.match(/house/) },
      script:function(p) {
        if (currentLocation === w.lounge) {
          msg("'It's kind of a shame, in a way,' muses Mandy. 'If it wasn't so fuck... messed up, it would be a great place to live. Its own theatre, the greenhouse, so many rooms. Any time you want to go to the beach, just turn a chess piece. I'm assuming no corpses on the beach, of course, and no shifting a dead horse to get back.'")
        }
        else {
          msg("'This house is seriously fucked up,' Mandy says to Dr Malewicz. He says nothing, and Mandy realises he is probably surprised at her choice of words. 'I mean screwed... er, messed up.'")
          msg("Yes, well, I agree it is {i:messed} up.'")
          msg("'I mean, what house has a steam engine ad a theatre in it and an observatory at the back, and its got way to many rooms for its size.'")
          msg("'Yes, had noticed that.'")
        }
      }
    },
    {
      test:function(p) { return p.text.match(/patch/) },
      script:function(p) {
        if (w.Patch.isHere()) {
          msg("'So it turns out I animated this monstrous amalgam of human body parts,' says Mandy, indicated Patch. 'He doesn't say much, but it's kind of sweet - in a grotesque way.'")
          msg("Dr Malewicz looks Patch up and down. 'Is it house trained?'")
          if (w.chamber_pot.loc === player.name) {
            msg("'Y...' She thinks. 'I don't know. I'm not sure he even eats. But now you mention it, I've been round this house about fifteen times, and have to find a toilet.' Apart from the chamber pot in her hand. 'Ewww.' She quickly drops it.")
            w.chamber_pot.loc = player.loc
          }
          else {
            msg("'Y...' She thinks. 'I don't know. I'm not sure he even eats. But now you mention it, I've been round this house about fifteen times, and have yet to find a toilet.' Apart from the chamber pot in her hand. 'Ewww.'")
          }
        }
      }
    },
    {
      test:function(p) { return p.text.match(/einstein/) },
      script:function(p) {
        msg("Mandy starts to tell the Dr Malewicz about Einstein, but wonders what she actually knows about the guy. There was that relativity thing. Did ho do anything else? Something about God not playing dice? Or is that an urban myth? 'He was dead famous, anyway,' she says, lamely.")
      }
    },
    {
      test:function(p) { return true },
      script:function(p) {
        msg("Mandy starts to tell Dr Malewicz about " + p.text + " but he does not seem interested.")
      }
    },
  ],
})



/*

createItem("wm_1911", TOPIC(false), {
  loc:"Winfield_Malewicz",
  alias:"You have been here since 1911?",
  script:function() {
    msg("'You have been here since 1911?'");
    msg("'The King is due to have his Delhi Durbar in a few weeks.'");
    msg("'Er, which king is that?'");
    msg("'George V. I suppose he is just {class:riddle:history} to you. Who's king now?'");
    msg("'Queen. Queen Elizabeth II.'");
    msg("'A queen? Jolly good. England became great under Queen Victoria.'");

    w.Winfield_Malewicz.songlist.push("History")
  },
})
*/

createItem("invite", {
  alias:"Wedding Invitation",
  synonyms:['invite', 'letter'],
  examine:"The wedding invitation is printed in black, on off-white card, with very ornate handwriting. Mandy wonders if she dares to read it...",
  read:function() {
    msg("Mandy tries to casually read the invitation without appearing to...\"My very good friend and his companion are cordially invited to the wedding of Albert Einstein to Elsa Löwenthal, on the Second of June, 1919, at the Oranienbergerstrasse Synagogue in Berlin.\" Wait, {i:the} Albert Einstein?")
    this.hasBeenRead = true
  }
})






