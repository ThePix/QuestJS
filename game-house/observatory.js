"use strict"



register('observatory', {
  book:'Comedy of Errors',
  uniform:'a curious white dress that buttons at the front; more like a lab coat really',
  smell:'The room smells slightly of oil.',
  listen:'Mandy can hear nothing.',
  floor:"The floor is wood.",
  walls:"The walls are all painted white.",
  ceiling:"The ceiling is domed.",
})






createRoom("observatory", {
  windowsface:'none',
  desc:"The room is dominated, filled even, by a telescope and its supporting mechanism, which is not difficult, as the room is not big. There are some controls on the wall, and the only exit is the stairs she has just come up.{if telescope.roofOpen: A section of roof is open on the west side of the dome.}{if:spike:alias:mangled metal: There is a black line along the floor marking where the wire had been before the lightning strike.}",
  down:new Exit("great_gallery"),
  up:new Exit("observatory_up", {alsoDir:['climb'], msg:'She clambers up the telescope.'}),
  afterEnter:function() {
    if (w.uniform.wet === 4) { 
      w.uniform.wet = 3
      msg("She is dripping water on to the floor.")
    }
  },
  examine_ceiling:function() {
    let s = "The observatory is a domed roof, perhaps made of wood, painted an off-white colour."
    if (w.telescope.roofOpen) {
      s += " There is a vertical slot open in the roof through which someone using the telescope could observe the stars."
      if (w.telescope.azimuth !== 6) {
        s += " All Mandy can see through the slot is a dark and threatening sky."
      }
      else if (player.loc === 'observatory') {
        s += " All Mandy can see through the slot is a dark and threatening sky and the top of a weather vane."
      }
      else {
        s += " All Mandy can see through the slot is a dark and threatening sky and a weather vane on a nearby roof."
      }
    }
    msg(s)
  },
})

createItem("slot", {
  isLocatedAt:function(loc) { return ["observatory", "observatory_up", "telescope_end"].includes(loc) },
  scenery:true,
  synonyms:['opening'],
  examine:function() {
    let s = ""
    if (w.telescope.roofOpen) {
      s += " There is a vertical slot open in the roof through which someone using the telescope could observe the stars."
      if (w.telescope.azimuth !== 6) {
        s += " All Mandy can see through the slot is a dark and threatening sky."
      }
      else if (player.loc === 'observatory') {
        s += " All Mandy can see through the slot is a dark and threatening sky and the top of a weather vane."
      }
      else {
        s += " All Mandy can see through the slot is a dark and threatening sky and a weather vane on a nearby roof."
      }
    }
    msg(s)
  },
})

createItem("telescope", {
  loc:"observatory",
  scenery:true,
  alias:"telescope",
  synonyms:['mechanism'],
  roofOpen:false,
  azimuth:1,
  azimuthAsDegrees:45,
  altitude:5,
  altitudes:[
    'horizontal',
    'nearly horizontal',
    'slightly raised',
    'somewhat raised',
    'diagonal',
    'raised up',
    'raised high',
    'nearly vertical',
  ],
  azimuths:['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'],
  shardTime:7,
  shardReversed:false,
  shardViews:[
    "There is just blackness. Is this before she was born?",
    "This is a view in a hospital; her mother is in a bed, clearly in pain.{once: Mandy cannot remember her mother being in hospital, when was this? Then she notices the huge belly. This is Mandy's birth!} She watches in fascination as her mother silently screams with each push, as the baby Mandy emerges into the world.{once: Mandy revises her plan to have a large family...}",
    "A room... The lounge in her house, she realises, and the toddler -- stood, holding on to the chair -- must be her aged about one. The little girl lets go of the chair, takes two hesitant steps, then falls to ground. But undeterred, she crawls back to the chair, uses it to stand, and takes a few more steps.",
    "There she is again, in a school playground. That is back in primary school; she is playing with Holly. As she watches, Holly pushes the younger Mandy, who stumbles back, falling over someone's bag. The Mandy in the image starts crying silently; she broke her arm then Mandy recalls.{once: And Holly always claimed she never touched her. 'The bitch pushed me,' says Mandy indignantly.}",
    "Again Mandy can see her house, but it is a little different to before; most of the trees are smaller, but there is another one there now. Again, someone emerges from the house; herself, but aged eleven. Her mother follows her out of he door, to wave her off. This was her first day at Kyderbrook.",
    "A playground, and four girls too old to play there now. Herself, with Marcy, Neesha and Amy. That was March 25th, last year - the day Zayn announced he was leaving One Direction, and they were crying of each others shoulders. Strange it had felt like such a big deal.",
    "She can see her house, and as she watches, someone emerges from it. It is herself! She is wearing her school uniform, and carrying her One Direction bag. As Mandy watches, the Mandy in the image turns and locks the door, before walking away, presumably to school.",
    "She can see herself, looking through the telescope.{once: She shakes her foot, and can see her left foot shake through the telescope. This is the present.}",
    "Where's this? The sports hall at school, but set out with desks. Exam day! A shudder goes through her. There is future-Mandy, staring at the paper, looking dumbfounded. It is English literature, she can even see the question. \"Discuss loyalty and betrayal with respect to the character Enobarbus\". 'Jesus, no wonder I look so lost,' mutter Mandy. But wait... If that is going to be on the paper, she can look it up before the exam.|Future Mandy smiles, and starts writing, while this Mandy carefully memorises the rest of the paper.",
    "The sports hall again, another exam. She can see herself, working hard. This is biology, and the paper has a lot about the cell cycle; another section is on evolution. Again, Mandy carefully memorises the questions.|{i:Is this cheating?} she wonders. Perhaps the important point is that future-Mandy clear knows her stuff, and to avoid time-loops, she will have to use this information whether she likes it or not. She grins to herself.",
    "Another exam. This is French, and the exam questions revolve around a scenario in a restaurant.",
    "A playground; she looks different, a little more self-assured, and her hair is much shorter. Every thing seems a little fuzzy too. She is with a guy; not someone she recognises, but future-Mandy clearly likes him; they are holding hands. He turns to look at her, and gives her a kiss. Mandy's first kiss! ",
    "A car, rammed full of luggage; this is fuzzy too, more than the playground. Mandy and her father step out of the car, and walk to a nearby building. \"Longfenton Halls of Residence\" it calls itself.{once: Is this a university? Her first day, perhaps.}",
    "Much more fuzzy now; she can see a woman, she guesses herself, but it is hard to tell, in a smart skirt and jacket. Her first day at work, Mandy thinks for a moment, but no, future-Mandy is telling everyone else what to do.{once: What sort of business is this? Does she own it? It is too fuzzy to see.}",
    "It is all too fuzzy to see anything now.{once: Perhaps the future is not set in stone, and this has yet to be decided.}",
  ],
  examine:function() {
    let s = "The telescope itself is about four metres long. It is held in place by a complicated mechanism, involving cogs and gears, and the whole thing is made of brass, giving it a strange beauty.{if:observatory_up:visited:0: Mandy wonders idly if she could climb up it.}"
    s += " It is currently " + this.altitudes[this.altitude] + ","
    s += " and pointing " + this.azimuths[this.azimuth] + "ward."
    msg(s)
  },
  use:function() {
    if (this.azimuth === 4 && this.altitude === 0 && w.glass_shard.loc === 'controls') {
      if (w.glass_shard.size === 7) {
        this.shardTime += (this.shardReversed ? 1 : -1)
        this.shardTime = Math.min(Math.max(this.shardTime, 0), this.shardViews.length - 1)
        if (this.shardTime === 8) player.easterEgg = true
        msg("Mandy looks though the eyepiece at the side of the base of the telescope, now it is pointed directly at the glass shard... ")
        msg(this.shardViews[this.shardTime])
      }
      else {
        msg("Mandy looks though the eyepiece at the side of the base of the telescope, hoping to see the glass shard through it... But all she can see is {if:telescope:roofOpen:the sky:the dome of the roof}. She would need the telescope to go even lower. Or have a bigger shard.")
      }
    }
    else if (w.telescope.roofOpen) {
      msg("Mandy looks though the eyepiece at the side of the base of the telescope. For a moment, all she can see is the reflection of her eyelashes, but she opens her eye wide, and can see... clouds. And they look pretty much the same as they do without a telescope.")
    }
    else {
      msg("Mandy looks though the eyepiece at the side of the base of the telescope, but all she can see is a uniform off-white. Exactly the same colour as the ceiling...")
    }
    return true
  },
  lookthrough:function() { return this.use() },
  lookin:function() { return this.use() },
  climbverb:function(options) {
    return currentLocation.up.use(options.char)
  },
  goUpDirection:'up',
})

createItem("controls", SURFACE(), {
  loc:"observatory",
  scenery:true,
  synonyms:['panel', 'slim box'],
  alias:"controls",
  examine:"The controls consist of two wheels, one on the left, one on the right, and a lever, all set into a slim box, all in brass, fixed to the wall on the south side of the room.",
})

createItem("left_wheel", {
  // azimuth
  loc:"observatory",
  scenery:true,
  alias:"left wheel",
  examine:"The left wheel is about seven centimetres across, and made of brass. There is a set of numbers on dials, like a gas meter, just above the wheel, showing {show:telescope:azimuthAsDegrees}.",
  turn:"Mandy looks at the wheel, wondering if she wants to turn the left wheel left or turn it right...",
  turnleft:function() { return this.doTurn(-1) },
  turnright:function() { return this.doTurn(1) },
  doTurn:function(inc) { 
    w.telescope.azimuth += inc
    if (w.telescope.azimuth >= w.telescope.azimuths.length) w.telescope.azimuth = 0
    if (w.telescope.azimuth < 0) w.telescope.azimuth = w.telescope.azimuths.length - 1
    w.telescope.azimuthAsDegrees = w.telescope.azimuth * 45 + (w.telescope.azimuths[w.telescope.azimuth].length % 5 + 1)
    msg("{if:params:inc:-1:With a grunt of effort, }Mandy turns the left wheel a full rotation {if:params:inc:-1:anti-}clockwise{if:params:inc:-1: -- it is hard work! As:, and as} she does the entire telescope, and the mechanism holding it, {if:params:inc:-1:rotates, with a painful grinding noise:smoothly rotates}. At the same time, the ceiling also turns{if:telescope:roofOpen:{if:telescope:azimuth:6:, and she can just see the roof of the great hall through the slot}}.", {inc:inc})
    return true
  },
})

createItem("right_wheel", {
  // altitude
  loc:"observatory",
  scenery:true,
  alias:"right wheel",
  examine:"The right wheel is about seven centimetres across, and made of brass. There is a set of numbers on dials, like a gas meter, just above the wheel, showing {show:telescope:altitude}0.",
  turn:"Mandy looks at the wheel, wondering if she wants to turn the right wheel left or turn it right...",
  turnright:function() {
    if (w.telescope.altitude === w.telescope.altitudes.length - 1) {
      msg("Mandy tries to move the right wheel clockwise, but it will not turn any more.")
      return false
    }
    w.telescope.altitude++
    msg("Mandy turns the right wheel a full rotation clockwise, and as she does the telescope rises.")
    return true
  },
  turnleft:function() { 
    if (w.telescope.altitude === 0) {
      msg("Mandy tries to move the right wheel anti-clockwise, but it will not turn any more.")
      return false
    }
    w.telescope.altitude--
    msg("Mandy turns the right wheel a full rotation anti-clockwise, and as she does the telescope lowers.")
    return true
  },
})

createItem("lever", {
  loc:"observatory",
  scenery:true,
  examine:"A small brass level, currently in the {if:telescope:roofOpen:down}{ifNot:telescope:roofOpen:up} position.",
  push:function(options) {
    const verb = parser.currentCommand.name.toLowerCase()
    if (w.telescope.roofOpen) {
      msg("{nv:char:" + verb + ":true} the lever up, and the slot in the ceiling slides closed.", options)
      w.telescope.roofOpen = false
    }
    else {
      if (!this.used) {
        msg("{nv:char:" + verb + ":true} the lever down, and a huge slot in the ceiling opens up, directly in front of the telescope, allowing anyone using the telescope to actually see the sky.{if:telescope:azimuth:6: She can just see the roof of the great hall from here.}|{nv:char:glance:true} outside; the sky looks threatening. It had been quite nice before she entered the house.", options)
        this.used = true
      }
      else {
        msg("{nv:char:" + verb + ":true} the lever down, and the huge slot in the ceiling opens up.{if:telescope:azimuth:6: She can just see the roof of the great hall from here.}", options)
      }
      w.telescope.roofOpen = true
    }
    return true
  },
  pull:function(options) { return this.push(options) },
  flip:function(options) { return this.push(options) },
})




createRoom("observatory_up", {
  windowsface:'none',
  alias:'up on the telescope',
  headingAlias:"The Observatory (On The Telescope)",
  noFollow:true,
  desc:function() {
    let s = "Mandy clings to the top of the mechanism that supports the telescope. From here she can... Not do a lot. The domed roof is too far to touch, and the eyepiece of the telescope is back on the ground.{ifLessThan:telescope:altitude:5: She could perhaps edge {select:telescope:azimuths:azimuth} along the telescope itself.}"
    return s
  },
  afterEnter:function() {
    if (w.uniform.wet === 5) { 
      w.uniform.wet = 4
      msg("At least she is out of the rain now!")
    }
  },
  down:new Exit("observatory", {alsoDir:['climb_down']}),
  examine_ceiling:function() { w.observatory.examine_ceiling() },
  afterDropIn:function(item) { item.loc = 'observatory' }
})

createItem("telescope_while_on_it", {
  loc:"observatory_up",
  scenery:true,
  alias:"telescope",
  examine:function() { w.telescope.examine() },
  use:function() { return falsemsg("She cannot use the telescope while climbing on it.") },
  lookthrough:function() { return falsemsg("She cannot look though the telescope while climbing on it.") },
  climbdownverb:function(options) {
    return currentLocation.down.use(options.char)
  },
  goDownDirection:'down',
})


createItem("roof_from_telescrope", {
  isLocatedAt:function(loc) {
    if (loc !== "observatory_up") return false
    if (!w.telescope.roofOpen) return false
    if (w.telescope.azimuth !== 6) return false
    return true
  },
  scenery:true,
  alias:"roof",
  examine:"Through the open slot in the domed roof, Mandy can see the peaked roof of the Great Hall, and on it a weather vane. {ifMoreThan:telescope:altitude:4:If the telescope was lower, she might be able to reach the roof:She wonders if she could go west along the telescope, and get onto the roof}.",
})



createRoom("telescope_end", {
  windowsface:'none',
  alias:'end of the telescope',
  headingAlias:"The Observatory (End Of The Telescope)",
  noFollow:true,
  desc:function() {
    let s = "Mandy sits -- somewhat precariously -- straddling the telescope."
    if (w.telescope.roofOpen) {
      s += " The open slot in the ceiling is just in front of her, and beyond that,"
      if (w.telescope.azimuth === 6) {
        s += " she can see the roof of the great hall. It looks close enough she might be able to head west, climbing across."
     }
     else {
        s += " the open sky -- and a long drop down."
     }
   
    }
    else {
      s += " From here she could touch the ceiling, if she really want to."
    }
    return s
  },
})

for (const dir of w.telescope.azimuths) {
  w.observatory_up[dir] = new Exit("telescope_end", {
    isHidden:function() {
      return (this.dir !== w.telescope.azimuths[w.telescope.azimuth])
    },
    simpleUse:function(char) {
      if (this.dir !== w.telescope.azimuths[w.telescope.azimuth]) return falsemsg(lang.not_that_way, {char:char, dir:this.dir})
      if (w.telescope.altitude > 4) return falsemsg("Mandy looks at the end of the telescope; if it were not so steep and smooth, she could edge along it{if:telescope:azimuth:6:, and perhaps get out onto the roof to the west}.")
      return util.defaultSimpleExitUse(char, this)
    },
    msg:"Mandy cautiously edges along the telescope to the very end.",
  })
  w.telescope_end[dir] = new Exit("observatory_up", {
    isHidden:function() {
      if (this.dir === w.telescope.azimuths[w.telescope.azimuth]) return false
      if (w.telescope.roofOpen && this.dir === 'west' && w.telescope.azimuth === 6) return false
      return (this.dir !== w.telescope.azimuths[(w.telescope.azimuth + 4) % 8])
    },
    simpleUse:function(char) {
      // if we are here, altitude must be okay
      // catch early for special message
      if (!w.telescope.roofOpen && this.dir === w.telescope.azimuths[w.telescope.azimuth]) return falsemsg("Mandy looks at the slot in the ceiling, just beyond the end of the telescope. If that were open, she might be able to get out through it, she muses.")
      if (w.telescope.roofOpen && this.dir !== "west" && this.dir === w.telescope.azimuths[w.telescope.azimuth]) return falsemsg("Mandy considers for a moment a leap of faith from the end of the telescope, out through the slot in the ceiling... No, not a good idea.")


      if (this.isHidden()) return falsemsg(lang.not_that_way, {char:char, dir:this.dir})
      if (this.dir === w.telescope.azimuths[(w.telescope.azimuth + 4) % 8]) return util.defaultSimpleExitUse(char, this)

      // should only be west, with telescope pointing west by this point
      return util.defaultSimpleExitUse(char, new Exit('roof_location_east', {origin:this.origin, dir:this.dir, msg:"Mandy reaches over to the opening in the roof. She climbs through, and for a moment is balanced precariously on the bottom of the slot, before she jumps onto the adjacent roof, heart pounding in her chest."})
   )
    },
    msg:"Mandy cautiously edges back along the telescope to where it is supported, and clings to the mechanism, feeling decidedly safer.",
  })
}


createItem("roof_seen_from_telescope", {
  scenery:true,
  alias:'roof',
  isLocatedAt:function(loc) { return loc === 'telescope_end' && w.telescope.roofOpen },
  examine:'The roof of the great hall can be seen though the slot in the roof. It has a definite gothic vibe going on, with pointy bits at either end -- the further one sporting a weather vane --  and an ornate metal ridge between them.',
})







register('roof', {
  book:'The Tempest',
  uniform:'a midnight blue uniform that is actually not that bad',
  smell:'The air is certainly fresh up here!',
  listen:'Mandy can hear the wind howling around her.',
  floor:"There is no floor, just the roof of the Great Hall.",
  walls:"There are no walls here.",
  ceiling:"The ceiling is the clouds... No, seriously, there is no ceiling here.",
})





createRoom("roof_location_east", {
  alias:'east end of the roof',
  headingAlias:"On A High Roof",
  desc:"Mandy is standing -- rather nervously -- on the apex of a roof{once:. She is far above the ground. Not just scary far but also does-not-make-sense far above the ground. It is a two-story house! Then again, she is pretty sure number 23 does not have an observatory at the back.|As she looks harder, she realises she cannot see the Ash Tree Estate, instead there are only fields. Perhaps no bad thing, she thinks, but then she notices that there is no modern housing at all. This is what the town would have looked like before the war. Possibly before the first world war.|:, far above the ground. }As for the roof itself, it is slate, with a rusty iron decorative ridge to which Mandy is clinging. There is a weather vane at one end{ifIs:wire:tiedTo2:spike:, with wire wrapped round the letter E}.",
  afterEnter:function() {
    if (w.wire.isAtLoc(player) && w.sky.state < 3) { 
      w.sky.state = 3
      msg("Suddenly the rain starts. 'Shit,' she screams at the sky, as she is quickly soaked to the skin. It was supposed to be sunny today!")
      w.uniform.wet = 5
    }
    if (w.wire.tiedTo2 === 'spike' && w.sky.state < 6) { 
      w.sky.state = 6
      msg("Is the rain getting worse? She did not think that was possible.")
    }
  },
  east:new Exit("telescope_end", {msg:'Mandy nervously jumps back on to the sill of the opening in the observatory roof. After a moment to catch her breath, she reaches across, to grab the telescope, and straddle the end of it.'}),
  testDropIn:function() { return falsemsg("It occurs to Mandy that anything she drops here will fall down the roof, and will be lost forever.") },
})


createItem("roof", {
  loc:"roof_location_east",
  synonyms:['ridge', 'tiles', 'slates', 'mold', 'ridge tiles'],
  scenery:true,
  examine:"The roof is slate, and slopes down to the north and south. Many of the slates have mould growing on them, or are chipped or crooked, suggesting the roof has not been repaired for a long time. Then again, this is the first roof Mandy has seen so close-up -- maybe this is normal. ",
})


createItem("spike", {
  loc:"roof_location_east",
  alias:'weather vane',
  synonyms:['weather vane', 'raven', 'weathervane'],
  scenery:true,
  attachable:true,
  examine:function() {
    if (this.alias === 'mangled metal') {
      msg("The weather vane is a twisted lump of black metal. Two rods stick out, with \"N\" and \"W\" of them, the only hint of what it used to be.")
      return
    }
    let s = "The weather vane is made of black metal. Above the traditional compass points, a flat raven, sat on an arrow, swings round with each gust of wind."
    if (w.wire.tiedTo2 === this.name) {
      s += " A metal wire is attached to the letter E."
    }
    msg(s)
  },
})


/*
 2  start
 3  roof east with wire, starts to rain
 4  roof west with wire, lightning
 5  wire tied on (but could later get untied)
 6  roof east, wire tied on


20  all done, clear skies
*/

createItem("sky", {
  isLocatedAt:function(loc) { return loc.startsWith("roof_location") },
  scenery:true,
  state:2,
  examine:function() {
    switch (this.state) {
      case 20:
        msg("The sky is blue, with the odd fluffy cloud.")
        break
      case 2:
        msg("The dark clouds threatened rain at any moment.")
        break
      default:
        msg("The sky is looking thundery; rain is pouring hard.")
        break
    }
  },
})







