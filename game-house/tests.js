"use strict"

test.resetOnCompletion = false
test.ignoreHTML = true
//test.logCommand = function(s) { log('"' + s + '",') }
test.afterFinish = function(success) {
  if (success) {
    debugmsg("Hurrah!")
  }
  else {
    debugmsg("Oh dear...")
  }
}

test.tests = function() {
  

  test.title("Grow a tree")
  w.grown_tamarind_tree.seedsPlanted = 3
  w.grown_tamarind_tree.growthTime = 1
  w.grown_tamarind_tree.update()
  test.assertEqual("Mandy watches as four shoots grow.", processText("Mandy watches as {nv:item:grow:false:grown_tamarind_tree_count}.", {item:w.grown_tamarind_tree, grown_tamarind_tree_count:4}))
  test.assertEqual("Mandy can see four shoots.", processText("Mandy can see {nm:item:count}.", {item:w.grown_tamarind_tree, grown_tamarind_tree_count:4}))
  test.assertEqual("Mandy watches as three shoots grow; the shoots are now about two centimetres high.", processText("Mandy watches as {nv:item:grow:false:count_this}; {nv:item:be:false:count_this:suppressCount} now about {show:grown_tamarind_tree:getHeight} high.", {item:w.grown_tamarind_tree, count_this:'seedsPlanted', suppressCount:'seedsPlanted'}))
  test.assertEqual("Mandy can see three shoots.", processText("Mandy can see {nm:item:count:false:count_this}.", {item:w.grown_tamarind_tree, count_this:'seedsPlanted'}))
  test.assertEqual("Mandy watches as three shoots grow; the shoots are now about two centimetres high.", processText("Mandy watches as {nv:item:grow:false:count_this}; {nv:item:be:false:count_this:suppressCount} now about {show:grown_tamarind_tree:getHeight} high.", {item:w.grown_tamarind_tree, count_this:'seedsPlanted', suppressCount:'seedsPlanted'}))


  w.grown_tamarind_tree.seedsPlanted = 1
  w.grown_tamarind_tree.growthTime = 6
  w.grown_tamarind_tree.update()
  test.assertEqual("Mandy watches as the plant grows.", processText("Mandy watches as {nv:item:grow:false:grown_tamarind_tree_count}.", {item:w.grown_tamarind_tree, grown_tamarind_tree_count:1}))
  test.assertEqual("Mandy can see one plant.", processText("Mandy can see {nm:item:count}.", {item:w.grown_tamarind_tree, grown_tamarind_tree_count:1}))
  test.assertEqual("Mandy watches as the plant grows; the plant is now about twenty centimetres high.", processText("Mandy watches as {nv:item:grow:false:count_this}; {nv:item:be} now about {show:grown_tamarind_tree:getHeight} high.", {item:w.grown_tamarind_tree, count_this:'seedsPlanted'}))
  
  w.grown_tamarind_tree.seedsPlanted = 0
  w.grown_tamarind_tree.growthTime = 0
  w.grown_tamarind_tree.update()
  
  
  
  test.title("Plurals")
  let s_in, s_out
  s_in = "Mandy watches as {nv:item:grow:false:count_this}; {nv:item:be:false:suppressCount} now about {show:grown_tamarind_tree:getHeight} high."
  
  w.grown_tamarind_tree.seedsPlanted = 1
  w.grown_tamarind_tree.update()
  s_out = processText(s_in, {item:w.grown_tamarind_tree, count_this:'seedsPlanted', suppressCount:'seedsPlanted'})
  test.assertEqual("Mandy watches as the shoot grows; the shoot is now about one centimetre high.", s_out)
  s_out = processText("{nv:item:wither:true:suppressCount} away to nothing.", {item:w.grown_tamarind_tree, suppressCount:'seedsPlanted'})
  test.assertEqual("The shoot withers away to nothing.", s_out)


  w.grown_tamarind_tree.seedsPlanted = 3
  w.grown_tamarind_tree.update()
  test.assertEqual("the shoots", lang.getName(w.grown_tamarind_tree, {article:2, suppressCount:'seedsPlanted'}))
  s_out = processText(s_in, {item:w.grown_tamarind_tree, count_this:'seedsPlanted', suppressCount:'seedsPlanted'})
  test.assertEqual("Mandy watches as three shoots grow; the shoots are now about one centimetre high.", s_out)
  
  s_out = processText("{nv:item:wither:true:suppressCount} away to nothing.", {item:w.grown_tamarind_tree, count_this:'seedsPlanted', suppressCount:'seedsPlanted'})
  test.assertEqual("The shoots wither away to nothing.", s_out)
  
  
  w.grown_tamarind_tree.seedsPlanted = 0
  



  test.title("Shrink/grow phone")
  test.assertEqual(true, w.mobile_phone.size_changing)
  test.assertEqual(7, w.mobile_phone.maxsize)
  test.assertEqual(2, w.mobile_phone.minsize)
  w.mobile_phone.shrink()
  test.assertEqual('small mobile phone', w.mobile_phone.alias)
  test.assertOut(["Mandy's phone is now tiny."], function() {
    w.mobile_phone.examine(player, {})
  })
  test.assertOut(["Mandy looks at her shrunken phone. Maybe it was a bit optimistic thinking it would now be charged, just because it is so much smaller."], function() {
    w.mobile_phone.use(player, {})
  })
  w.mobile_phone.shrink()
  test.assertEqual('tiny mobile phone', w.mobile_phone.alias)
  test.assertOut(["Her stupid phone is now too small to use!"], function() {
    w.mobile_phone.use(player, {})
  })
  w.mobile_phone.grow()
  w.mobile_phone.grow()
  test.assertEqual('mobile phone', w.mobile_phone.alias)
  test.assertOut(["Mandy looks at her phone. 'Shit.' No charge left. She only charged it last night... No, wait, she had found it on her bedroom floor this morning. 'Shit,' she says again."], function() {
    w.mobile_phone.use(player, {})
  })
  w.mobile_phone.grow()
  test.assertEqual('big mobile phone', w.mobile_phone.alias)
  test.assertOut(["Her stupid phone is now too big to use!"], function() {
    w.mobile_phone.use(player, {})
  })
  w.mobile_phone.shrink()
  
  
  test.title("Book")
  test.assertCmd("x book", ["Mandy glances at her copy of \"Antony and Cleopatra\". She really should get around to actually reading it some time, what with an exam on it in just a few weeks."])
  test.assertCmd("x Antony", /Mandy glances at her copy of /)
  test.assertCmd("x Antony and Cleopatra", /Mandy glances at her copy of /)
  w.highfield_lane.zone = 'steampunk'
  w.shakespeare_book.afterCarry()

  test.assertCmd("x book", ["Mandy glances at her copy of \"Antony and Cleopatra\". Wait, this is not the same book! This is a copy of \"Love's Labour's Lost\". What has happened to \"Antony and Cleopatra\"? Ms Coulter will be furious."])
  test.assertCmd("x book", ["Mandy looks at the book she now has. A copy of \"Love's Labour's Lost\". She wonders if it would be any less boring than \"Antony and Cleopatra\". Probably not worth risking finding out."])
  test.assertCmd("x othello", /Mandy looks at the book she now has/)
  test.assertCmd("x Antony", /Mandy looks at the book she now has/)


  w.highfield_lane.zone = 'external'
  w.shakespeare_book.afterCarry()








  test.title("Telescope")
  test.movePlayer('observatory')

  test.title("Telescope basics and ceiling")
  test.assertCmd("x tel", ["The telescope itself is about four metres long. It is held in place by a complicated mechanism, involving cogs and gears, and the whole thing is made of brass, giving it a strange beauty. Mandy wonders idly if she could climb up it. It is currently raised up, and pointing northeastward.",])
  test.assertCmd("use tel", ["Mandy looks though the eyepiece at the side of the base of the telescope, but all she can see is a uniform off-white. Exactly the same colour as the ceiling...",])
  test.assertCmd("push lever", ["She pushes the lever down, and a huge slot in the ceiling opens up, directly in front of the telescope, allowing anyone using the telescope to actually see the sky.","She glances outside; the sky looks threatening. It had been quite nice before she entered the house.",])
  test.assertCmd("look through t", ["Mandy looks though the eyepiece at the side of the base of the telescope. For a moment, all she can see is the reflection of her eyelashes, but she opens her eye wide, and can see... clouds. And they look pretty much the same as they do without a telescope.",])
  test.assertCmd("pull lever", ["She pulls the lever up, and the slot in the ceiling slides closed."])
  test.assertCmd("pull lever", ["She pulls the lever down, and the huge slot in the ceiling opens up."])  


  test.title("Telescope azimuth")
  test.assertCmd("turn left left", "With a grunt of effort, Mandy turns the left wheel a full rotation anti-clockwise -- it is hard work! As she does the entire telescope, and the mechanism holding it, rotates, with a painful grinding noise. At the same time, the ceiling also turns.")
  test.assertEqual(0, w.telescope.azimuth)
  test.assertCmd("turn left left", "With a grunt of effort, Mandy turns the left wheel a full rotation anti-clockwise -- it is hard work! As she does the entire telescope, and the mechanism holding it, rotates, with a painful grinding noise. At the same time, the ceiling also turns.")
  test.assertEqual(7, w.telescope.azimuth)
  test.assertCmd("turn left right", "Mandy turns the left wheel a full rotation clockwise, and as she does the entire telescope, and the mechanism holding it, smoothly rotates. At the same time, the ceiling also turns.")
  test.assertEqual(0, w.telescope.azimuth)
  test.assertCmd("x tel", "The telescope itself is about four metres long. It is held in place by a complicated mechanism, involving cogs and gears, and the whole thing is made of brass, giving it a strange beauty. Mandy wonders idly if she could climb up it. It is currently raised up, and pointing northward.")
  test.assertCmd("turn left left", "With a grunt of effort, Mandy turns the left wheel a full rotation anti-clockwise -- it is hard work! As she does the entire telescope, and the mechanism holding it, rotates, with a painful grinding noise. At the same time, the ceiling also turns.")
  test.assertCmd("turn left left", "With a grunt of effort, Mandy turns the left wheel a full rotation anti-clockwise -- it is hard work! As she does the entire telescope, and the mechanism holding it, rotates, with a painful grinding noise. At the same time, the ceiling also turns, and she can just see the roof of the great hall through the slot.")
  test.assertEqual(6, w.telescope.azimuth)
  test.assertCmd("pull lever", ["She pulls the lever up, and the slot in the ceiling slides closed."])  
  test.assertCmd("turn left left", "With a grunt of effort, Mandy turns the left wheel a full rotation anti-clockwise -- it is hard work! As she does the entire telescope, and the mechanism holding it, rotates, with a painful grinding noise. At the same time, the ceiling also turns.")
  test.assertCmd("turn left right", "Mandy turns the left wheel a full rotation clockwise, and as she does the entire telescope, and the mechanism holding it, smoothly rotates. At the same time, the ceiling also turns.")
  test.assertCmd("x left", "The left wheel is about seven centimetres across, and made of brass. There is a set of numbers on dials, like a gas meter, just above the wheel, showing 275.")

  
  test.title("Telescope altitude")
  test.assertEqual(5, w.telescope.altitude)

  test.assertCmd("turn right right", "Mandy turns the right wheel a full rotation clockwise, and as she does the telescope rises.")
  test.assertCmd("turn right right", "Mandy turns the right wheel a full rotation clockwise, and as she does the telescope rises.")

  test.assertCmd("turn right right", "Mandy tries to move the right wheel clockwise, but it will not turn any more.")
  test.assertEqual(7, w.telescope.altitude)
  test.assertCmd("turn right left", "Mandy turns the right wheel a full rotation anti-clockwise, and as she does the telescope lowers.")
  test.assertCmd("turn right left", "Mandy turns the right wheel a full rotation anti-clockwise, and as she does the telescope lowers.")
  test.assertCmd("turn right left", "Mandy turns the right wheel a full rotation anti-clockwise, and as she does the telescope lowers.")
  test.assertCmd("x right", "The right wheel is about seven centimetres across, and made of brass. There is a set of numbers on dials, like a gas meter, just above the wheel, showing 40.")
  test.assertEqual(4, w.telescope.altitude)
  test.assertCmd("x tel", ["The telescope itself is about four metres long. It is held in place by a complicated mechanism, involving cogs and gears, and the whole thing is made of brass, giving it a strange beauty. Mandy wonders idly if she could climb up it. It is currently diagonal, and pointing westward.",])

  test.title("Telescope Climb")
  test.assertCmd("climb", ["She clambers up the telescope.", "The Observatory (On The Telescope)", "Mandy clings to the top of the mechanism that supports the telescope. From here she can... Not do a lot. The domed roof is too far to touch, and the eyepiece of the telescope is back on the ground. She could perhaps edge west along the telescope itself."])
  test.assertCmd("e", "She can't go east.")

  w.telescope.azimuth = 0
  test.assertCmd("n", ["Mandy cautiously edges along the telescope to the very end.", "The Observatory (End Of The Telescope)", "Mandy sits -- somewhat precariously -- straddling the telescope. From here she could touch the ceiling, if she really want to."])
  test.assertCmd("n", "Mandy looks at the slot in the ceiling, just beyond the end of the telescope. If that were open, she might be able to get out through it, she muses.")
  w.telescope.roofOpen = true
  test.assertCmd("n", "Mandy considers for a moment a leap of faith from the end of the telescope, out through the slot in the ceiling... No, not a good idea.")
  test.assertCmd("w", "She can't go west.")
  test.assertCmd("s", ["Mandy cautiously edges back along the telescope to where it is supported, and clings to the mechanism, feeling decidedly safer.", "The Observatory (On The Telescope)", "Mandy clings to the top of the mechanism that supports the telescope. From here she can... Not do a lot. The domed roof is too far to touch, and the eyepiece of the telescope is back on the ground. She could perhaps edge north along the telescope itself."])
  
  w.telescope.altitude = 7
  test.assertCmd("n", "Mandy looks at the end of the telescope; if it were not so steep and smooth, she could edge along it.")
  
  w.telescope.azimuth = 6
  w.telescope.altitude = 2
  w.telescope.roofOpen = false
  test.assertCmd("w", ["Mandy cautiously edges along the telescope to the very end.", "The Observatory (End Of The Telescope)", "Mandy sits -- somewhat precariously -- straddling the telescope. From here she could touch the ceiling, if she really want to."])
  test.assertCmd("n", "She can't go north.")
  test.assertCmd("w", "Mandy looks at the slot in the ceiling, just beyond the end of the telescope. If that were open, she might be able to get out through it, she muses.")
  test.assertCmd("e", ["Mandy cautiously edges back along the telescope to where it is supported, and clings to the mechanism, feeling decidedly safer.", "The Observatory (On The Telescope)", "Mandy clings to the top of the mechanism that supports the telescope. From here she can... Not do a lot. The domed roof is too far to touch, and the eyepiece of the telescope is back on the ground. She could perhaps edge west along the telescope itself."])
  test.assertCmd("w", ["Mandy cautiously edges along the telescope to the very end.", "The Observatory (End Of The Telescope)", "Mandy sits -- somewhat precariously -- straddling the telescope. From here she could touch the ceiling, if she really want to."])
  w.telescope.roofOpen = true
  test.assertCmd("w", ["Mandy reaches over to the opening in the roof. She climbs through, and for a moment is balanced precariously on the bottom of the slot, before she jumps onto the adjacent roof, heart pounding in her chest.", "On A High Roof", /Mandy is standing/, /./, /./])
  test.assertCmd("e", ["Mandy nervously jumps back on to the sill of the opening in the observatory roof. After a moment to catch her breath, she reaches across, to grab the telescope, and straddle the end of it.", "The Observatory (End Of The Telescope)", "Mandy sits -- somewhat precariously -- straddling the telescope. The open slot in the ceiling is just in front of her, and beyond that, she can see the roof of the great hall. It looks close enough she might be able to head west, climbing across."])















  test.title("Hourglass")
  test.movePlayer('greenhouse_west')

  // hourglass.state, .fillState
  // tamarind_seed.countableLocs

  test.title("Plant seeds")
  test.assertEqual(0, w.grown_tamarind_tree.seedsPlanted)
  w.tamarind_seed.countableLocs[player.name] = 5
  test.assertCmd("plant 2 seeds in ground", ["Mandy carefully plants two tamarind seeds in the bare earth.",])
  test.assertCmd("put three seeds in earth", ["Mandy carefully plants three tamarind seeds in the bare earth.",])
  test.assertCmd("put phone in earth", ["Mandy wonders if burying the mobile phone is going to achieve anything. Probably not.",])
  test.assertCmd("get 5 seeds", ["She takes five tamarind seeds.",])
  test.assertCmd("plant 2 seed", ["Mandy carefully plants two tamarind seeds in the bare earth.",])
  
  
  
  test.title("Cannot plant/get seed while hourglass active")
  w.hourglass.active = true
  test.assertCmd("plant 3 seeds", ["Mandy starts to put another three tamarind seeds in the ground, but as her hands get near, they start to blur, and feel numb. Perhaps not such a good idea when the hourglass is running.",])
  test.assertCmd("get seed", ["Mandy starts to dig the tamarind seed from the ground, but as her hands get near, they start to blur, and feel numb. Perhaps not such a good idea when the hourglass is running.",])
  w.hourglass.active = false
  test.assertCmd("plant seed", ["Mandy carefully plants one tamarind seed in the bare earth.",])
  test.assertEqual(3, w.tamarind_seed.countAtLoc('bare_earth'))
  
  
  test.title("Turn hourglass")
  test.assertCmd("turn ho", ["Mandy turns the hourglass over.","All the sand is in the upper bulb in the hourglass.","Mandy watches as three shoots grow; the shoots are now about two centimetres high.",])
  test.assertEqual(true, w.hourglass.active)

  test.title("Take hourglass while sand falling")
  test.assertCmd("get ho", ["She takes the hourglass.","The shoots wither away to nothing.","As time passes, sand falls from the upper bulb of the hourglass; it now has about 25% of the sand left in it."])
  test.assertEqual(false, w.hourglass.active)
  w.hourglass.state = 0
  test.assertCmd("turn ho", ["Mandy turns the hourglass over.","All the sand is in the upper bulb in the hourglass.",])
  test.assertEqual(false, w.hourglass.active)
  
  test.title("Place hourglass while sand falling")
  w.tamarind_seed.countableLocs.bare_earth = 3
  test.assertEqual(3, w.tamarind_seed.countAtLoc('bare_earth'))
  test.assertCmd("put ho on ped", ["Mandy feels a slight jolt, like static electricity, as she places the hourglass on the pedestal.","As time passes, sand falls from the upper bulb of the hourglass; it now has about 25% of the sand left in it.","Mandy watches as three shoots grow; the shoots are now about two centimetres high.",])
  test.assertEqual(3, w.grown_tamarind_tree.seedsPlanted)
  test.assertEqual(false, w.tamarind_seed.countableLocs.bare_earth)
  test.assertEqual(true, w.hourglass.active)
  test.assertCmd("Wait", ["Time passes...","As time passes, sand falls from the upper bulb of the hourglass; it is now empty.",])

  test.title("Take and lace hourglass while sand not falling")
  test.assertCmd("get ho", ["She takes the hourglass.","The shoots wither away to nothing."])
  test.assertCmd("put ho on ped", ["Mandy feels a slight jolt, like static electricity, as she places the hourglass on the pedestal."])

    

  test.title("Make funnel")
  test.assertCmd("make funnel", ["She needs a piece of paper to build a paper funnel.",])
  w.secret_recipe.loc = player.name
  test.assertCmd("make funnel", ["She builds a paper funnel from the piece of paper.",])
  test.assertEqual(undefined, w.secret_recipe.loc)
  test.assertEqual(player.name, w.paper_funnel.loc)
  w.secret_recipe.loc = player.name
  world.update()
  test.assertCmd("make funnel", ["The paper funnel has already been made.",])

  test.title("Make funnel With")
  delete w.paper_funnel.loc
  w.secret_recipe.loc = player.name
  world.update()
  test.assertCmd("make funnel with paper", ["She builds a paper funnel from the piece of paper.",])
  
  delete w.paper_funnel.loc
  w.secret_recipe.loc = player.name
  world.update()
  test.assertCmd("make funnel with bag", ["She cannot make a paper funnel from a school bag.",])



  
/*  
  
  test.title("Turn hourglass with seeds")
  test.assertEqual(3, w.grown_tamarind_tree.seedsPlanted)
  test.assertEqual(0, w.tamarind_seed.countAtLoc('bare_earth'))
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 25% full.","Mandy watches as three shoots grow; the shoot are now about three centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is now empty.",])
  test.assertEqual(false, w.hourglass.active)
  test.assertCmd("climb tree", ["Mandy looks at the three shoots thoughtfully. If the shoot were more substantial, she could climb they."])

/*  test.assertCmd("Wait", ["Time passes...",])
  test.assertCmd("plant 1 seed", ["Mandy carefully plants one tamarind seed in the bare earth.",])
  test.assertCmd("get ho", ["She takes the hourglass.","The shoot wither away to nothing.",])
  test.assertCmd("turn ho", ["Mandy turns the hourglass over.","The upper bulb in the hourglass is about 100% full.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 25% full.",])
  test.assertCmd("turn ho", ["Mandy turns the hourglass over.","The upper bulb in the hourglass is about 75% full.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is now empty.",])
  
  
  test.title("Fill hourglass")
  test.assertCmd("west", ["She heads west.","The Steam Hall",/This large room is dominated by a huge engine/,])
  test.assertCmd("west", ["She heads west.","A Corridor","The corridor runs from east to west, with three windows along the north side. Various brass pipes run the length of the south wall, while others turn abruptly to dive into the wall on either side of the room. All seem to converge on the east end of the corridor.",])
  test.assertCmd("west", ["She heads west.","The Dining Room","This room is dominated by an elegant, dark wood table, well-polished, with brass legs shaped like a lion's, and laid out with eight dinner settings. Eight chairs, in matching style, surrounded it. At the table, seven mannequins are sat, dressed up in clothes and wigs. The north wall has a window, with dark wood cabinets on either side, and there is a grand marble fireplace directly opposite the window, with a large clock on the mantelpiece. There are doors to the east, south and west.",])
  test.assertCmd("south", ["Mandy heads south.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("east", ["She heads east.","The Drawing Room (Giant)",/This is a drawing room of immense size/,])
  test.assertCmd("west", ["She heads west.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("east", ["She heads east.","The Drawing Room",/The drawing room is/,])
  test.assertCmd("drop pot", ["She drops the chamber pot.",])
  test.assertEqual(5, w.chamber_pot.size)
  test.assertCmd("drop h", ["She drops the hourglass.",])
  test.assertCmd("west", ["She heads west.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("north", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("east", ["She heads east.","The Drawing Room (Giant)",/This is a drawing room of immense size/,"She can see a big chamber pot (full of sand) and an big hourglass here.",])
  test.assertEqual(6, w.chamber_pot.size)
  test.assertCmd("get all", ["She takes the big hourglass.","She takes the big chamber pot.",])
  test.assertCmd("west", ["She heads west.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("east", ["She heads east.","The Drawing Room",/The drawing room is/,])
  test.assertCmd("drop ho", ["She drops the big hourglass.",])
  test.assertCmd("drop pot", ["She drops the big chamber pot.",])
  test.assertEqual(6, w.chamber_pot.size)
  test.assertCmd("west", ["She heads west.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("north", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("east", ["She heads east.","The Drawing Room (Giant)",/This is a drawing room of immense size/,"She can see a huge chamber pot (full of sand) and an huge hourglass here.",])
  test.assertEqual(7, w.chamber_pot.size)
  test.assertCmd("get po", ["She takes the huge chamber pot.",])
  test.assertEqual(7, w.chamber_pot.size)
  
  
  
  test.assertCmd("pour sand into ho", ["She empties the huge chamber pot into the huge hourglass.",])
  test.assertEqual(7, w.chamber_pot.size)
  test.assertCmd("pour sand into ho", ["She is not carrying anything with sand in it.",])
  test.assertCmd("pour po into ho", ["The huge chamber pot is already empty.",])
  test.assertCmd("west", ["She heads west.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("east", ["She heads east.","The Drawing Room",/The drawing room is/,"She can see an big hourglass here.",])
  test.assertCmd("get ho", ["She takes the big hourglass.",])
  test.assertCmd("west", ["She heads west.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("north", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("north", ["Mandy heads north.","The Dining Room","This room is dominated by an elegant, dark wood table, well-polished, with brass legs shaped like a lion's, and laid out with eight dinner settings. Eight chairs, in matching style, surrounded it. At the table, eight mannequins are sat, dressed up in clothes and wigs. The north wall has a window, with dark wood cabinets on either side, and there is a grand marble fireplace directly opposite the window, with a large clock on the mantelpiece. There are doors to the east, south and west.",])
  test.assertCmd("east", ["She heads east.","A Corridor","The corridor runs from east to west, with three windows along the north side. Various brass pipes run the length of the south wall, while others turn abruptly to dive into the wall on either side of the room. All seem to converge on the east end of the corridor.",])
  test.assertCmd("east", ["She heads east.","The Steam Hall",/This large room is dominated by a huge engine/,])
  test.assertCmd("east", ["She heads east.","The Greenhouse (West)",/All manner of plants are growing/,])


  test.title("Plant seed and get short tree")
  test.assertCmd("climb", ["Nothing to climb here."])
  test.assertEqual(1, w.tamarind_seed.countAtLoc('bare_earth'))
  test.assertCmd("turn ho", ["Mandy closes the tap of the hourglass, then turns it over.","The upper bulb in the hourglass is about 100% full."])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 92% full.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 83% full.",])
  test.assertEqual(1, w.tamarind_seed.countAtLoc('bare_earth'))
  test.assertCmd("put ho on ped", ["Done.","The upper bulb in the hourglass is about 75% full.","Mandy watches as the shoot grows; the shoot is now about two centimetres high."])
  test.assertEqual(0, w.tamarind_seed.countAtLoc('bare_earth'))
  test.assertEqual(1, w.grown_tamarind_tree.seedsPlanted)
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 67% full.","Mandy watches as the shoot grows; the shoot is now about three centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 58% full.","Mandy watches as the shoot grows; the shoot is now about five centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 50% full.","Mandy watches as the plant grows; the plant is now about eight centimetres high.",])
  test.assertCmd("climb tree", ["Mandy looks at the rapidly grow tamarind plant thoughtfully. If she grabs on to it now, it will take her up with it as it grows! Steps closer, and her foot starts to blur, and feel numb. A moment later she is feeling nauseated. She steps back, trying to catch her breath. Perhaps not such a great idea..."])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 42% full.","Mandy watches as the plant grows; the plant is now about ten centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 33% full.","Mandy watches as the plant grows; the plant is now about twenty centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 25% full.","Mandy watches as the plant grows; the plant is now about forty centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 17% full.","Mandy watches as the plant grows; the plant is now about seventy centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 8% full.","Mandy watches as the tree grows; the tree is now about one metre high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 0% full.","Mandy watches as the tree grows; the tree is now about two metres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is now empty.",])
  test.assertCmd("up", ["Mandy appraises the tree. It has been a while, but she can climb that. She grabs a lower branch, and hauls herself up.","Up A Tamarind Tree","Mandy is up a tamarind tree. She is almost up as high as the catwalk... And well short of the top of the metal box.",])
  test.assertCmd("d", ["Mandy carefully climbs back down.","The Greenhouse (West)",/All manner of plants are growing/,"She can see a tree here.",])

  
  test.title("Plant seed and get short tree")
  test.assertCmd("plant 2 seeds", ["Mandy carefully plants two tamarind seeds in the bare earth.",])
  test.assertCmd("turn ho", ["Mandy picks up the hourglass to turn it over. As she does, the tree withers away to nothing. 'Shit...' she mutters in disappointment. She turns the hourglass over, and puts it down again.","The upper bulb in the hourglass is about 100% full.","Mandy watches as two shoots grow; the shoot are now about two centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 92% full.","Mandy watches as two shoots grow; the shoot are now about three centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 83% full.","Mandy watches as two shoots grow; the shoot are now about five centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 75% full.","Mandy watches as two plants grow; the plant are now about eight centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 67% full.","Mandy watches as two plants grow; the plant are now about ten centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 58% full.","Mandy watches as two plants grow; the plant are now about twenty centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 50% full.","Mandy watches as two plants grow; the plant are now about forty centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 42% full.","Mandy watches as two plants grow; the plant are now about seventy centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 33% full.","Mandy watches as two trees grow; the tree are now about one metre high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 25% full.","Mandy watches as two trees grow; the tree are now about two metres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 17% full.","Mandy watches as two trees grow; the tree are now about four metres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 8% full.","Mandy watches as two trees grow; the tree are now about six metres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 0% full.","Mandy watches as two trees grow; the tree are now about ten metres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is now empty.",]) 
  
  



















/*
  
  test.title("Garden")
  test.assertCmd("north", ["The road ahead looks inviting, and she thinks of home. And yet... And yet she feels there is something she has to do.",])
  test.assertCmd("south", ["Mandy looks back down the road she has just walked up. No point going that way.",])
  test.assertCmd("east", ["She heads east.","The Front Garden",/The garden is simple/,])
  test.assertCmd("knock on door", ["Mandy knocks gingerly on the open door, not sure she really wants to disturb anyone. Then again, a bit harder, but still no reply.",])
  test.assertCmd("knock on door", ["Mandy knocks on the door again, but still no signs of life in the house.",])
  test.assertCmd("look through door", ["Mandy spends a few moments trying to look through a solid door. If she was eight foot tall she might be able to see through the small window above it, but not otherwise.",])
  test.assertCmd("e", ["Mandy looks at the door to the house. Can she really just walk in? She tries the handle -- its locked. So, no, she cannot just walk in.",])
  test.assertCmd("w", ["She heads west.","Highfield Lane","Mandy is standing, feeling a little anxious, on the pavement outside The House, which stands in a neatly kept garden to the east. The road continues north, through the countryside, towards home, and then onwards to Hedlington, while southward, Highfield Lane makes its way back into town.","She can see a letter lying on the ground.",])


  test.title("The letter")
  test.assertCmd("get letter", ["She takes the letter.",])
  test.assertCmd("drop letter", ["Mandy decides she will hang on to the letter.",])
  test.assertCmd("read letter", [/Mandy turns the letter over/,])
  test.assertCmd("open letter", [/Mandy wonders what the letter contains/,])
  test.assertCmd("put letter in bag", ["Done.",])


  test.title("Garden with letter")
  test.assertCmd("e", ["She heads east.","The Front Garden",/The garden is simple/,])
  test.assertCmd("x door", ["The door is tall, and made of panelled wood painted green, set into a white doorframe with a transom above. It stands open, inviting...",])
  test.assertCmd("look through door", ["Mandy looks through the open door, into the house. It is dark, but she can see a hallway with a tiled floor and wood panelled walls; are there painting on the far wall?",])
  test.assertCmd("e", ["Heart beating furiously, Mandy steps slowly through the open door. 'Anyone home?' she calls. After a moment's hesitation, she steps further inside, and calls again...","The Hall",/The hall is bigger than Mandy expected/,"The door slams shut, making Mandy jump.",])
  
  
  test.title("Hall")
  test.assertEqual('Othello', w.shakespeare_book.listAlias)
  test.assertEqual('copy of "Othello"', w.shakespeare_book.alias)



  test.title("Victorian room anomaly")
  test.assertCmd("s", [
    "She heads south.",
    "The Gallery (North)",
    /gloomy corridor/,
    "That's weird, thinks Mandy, surely the door to the west would go back into the garden? And this room is so long, surely the house is not this wide...",
  ])
  test.assertCmd("n", [
    "Mandy walks north... Wait, this isn't the hall, she thinks to herself. She is positive this is the doorway she came through before, so why is she not in the hall?",
    "The Dining Room",
    /This room is dominated by an elegant, dark wood table, well-polished, with brass legs shaped like a lion's, and laid out with eight dinner settings. Eight chairs, in matching style, surrounded it. At the table, four mannequins are sat/,
  ])
  test.assertCmd("s", [
    "Mandy heads south.",
    "The Gallery (North)",
    /gloomy corridor/,
  ])
  
  
  test.assertCmd("n", [
    "Mandy heads north.",
    "The Dining Room",
    /This room is dominated by an elegant, dark wood table, well-polished, with brass legs shaped like a lion's, and laid out with eight dinner settings. Eight chairs, in matching style, surrounded it. At the table, five mannequins are sat/,
  ])
  test.assertCmd("x fireplace", ["The fireplace is of a classical style, with two columns either side that are very similar to the museum in the market square; Mandy can vaguely remember being told the museum is Victorian, so perhaps the fireplace is that old too. She cannot imagine it is actually from ancient Greece! There is a large, old-fashioned clock on the mantelpiece."])
  test.assertCmd("x clock", ["This is a large, old-fashioned clock. A dark wood case houses the ticking mechanism. Roman numerals ran round the clock face, which indicate the time is now twenty past nine. That is so wrong, Mandy cannot decide if it is slow or fast. Mandy can see the key for winding the clock up is in the side of the clock."])
  test.assertCmd("x key", ["This key is about an inch across, and would be for turning a mechanism with a square peg."])
  test.assertCmd("get key", ["She takes the clock key."])
  


  test.title("Smash window")
  test.assertCmd("south", ["Mandy heads south.","The Gallery (North)",/gloomy corridor/,])
  test.assertCmd("x win", "Mandy looks out the window at the countryside; fields, trees, and there is her home, a barn conversion her parents purchased three years ago. But how could that be? This window faces west and her home is to the north.")
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("x window", ["There doesn't seem to be anything you might call 'window' here.",])
  test.assertCmd("smash window", ["There doesn't seem to be anything you might call 'window' here.",])
  test.assertCmd("n", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,])
  test.assertCmd("smash window", [/gingerly/,/void/,/metal/,])
  test.assertCmd("l", ["The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("get shard", ["Mandy carefully picks up one of the shards of glass.",])
  test.assertCmd("x window", ["Mandy looks at the bricked-up window. No way is she getting out that way.",])  
  
  
  
  test.title("Get boots")
  test.assertCmd("east", ["She heads east.","The Drawing Room (Giant)",/This is a drawing room of immense size/,])
  test.assertCmd("northeast", ["She heads northeast.","The Drawing Room (Giant, North)","Mandy stands on a narrow strip of wooden floor, between the colossal wall to the north, and the forest-like carpet to the south. To the east, the rug is flush against the wall, so that is not an option, but she can head south west, back to the door. Above her towers a huge mahogany cabinet, standing against the wall. There are cracks in the wall behind it, just above the skirting board.",])
  test.assertCmd("x cab", ["The mahogany cabinet towers over Mandy; it has to be higher than the science block at Kyderbrook High. Is there something behind it?",])
  test.assertCmd("x cracks", ["Looking up behind the giant cabinet, Mandy can see that the cracks lead to a hole in the wall -- probably large enough to climb though, if not for the cabinet.",])
  test.assertCmd("north", ["No way can Mandy get between the wall and the giant cabinet to go that way.",])
  test.assertCmd("southwest", ["She heads southwest.","The Drawing Room (Giant)",/This is a drawing room of immense size/,])
  test.assertCmd("west", ["She heads west.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("east", ["She heads east.","The Drawing Room",/The drawing room is rather well appointed/,])
  test.assertCmd("x cab", ["The mahogany cabinet looks like it came straight out of \"Antiques Roadshow\". Two doors at the front, a curious section on top at the back with four small draws that looks suggestive of a castle wall, with towers at each end.",])
  test.assertCmd("shift cab", ["Not sure if she should be moving furniture in someone else's house, Mandy grabs a hold of the cabinet, and heaves it away from the wall, revealing a hole in the wall, a few inches high, just above the skirting board.",])
  test.assertCmd("west", ["She heads west.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("north", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])
  test.assertCmd("east", ["She heads east.","The Drawing Room (Giant)",/This is a drawing room of immense size/,])
  test.assertCmd("northeast", ["She heads northeast.","The Drawing Room (Giant, North)","Mandy stands on a narrow strip of wooden floor, between the colossal wall to the north, and the forest-like carpet to the south. To the east, the rug is flush against the wall, so that is not an option, but she can head south west, back to the door. Above her towers a huge mahogany cabinet, standing proud of the wall. Behind it, to the north, is a large hole in the otherwise perfect wall.",])
  test.assertCmd("x cab", ["The mahogany cabinet towers over Mandy; it has to be higher than the science block at Kyderbrook High. It is standing a little way from the wall -- like about 10 foot -- and Mandy can see a hole in the wall behind it.",])
  test.assertCmd("x cracks", ["The cracks in the wall surround a hole big enough to climb through.",])
  test.assertCmd("north", ["She heads north.","A Secret Room","After the opulence of the other rooms, this one is decidedly bare -- but at least it of reasonable proportions. More or less square, the walls are white, or had been at one time. The floor and ceiling are wood. The only feature of note is a large pair of boots in one corner.",])
  test.assertCmd("get boots", ["She takes the pair of boots.",])
  test.assertCmd("s", ["She heads south.","The Drawing Room (Giant, North)","Mandy stands on a narrow strip of wooden floor, between the colossal wall to the north, and the forest-like carpet to the south. To the east, the rug is flush against the wall, so that is not an option, but she can head south west, back to the door. Above her towers a huge mahogany cabinet, standing proud of the wall. Behind it, to the north, is a large hole in the otherwise perfect wall.",])
  test.assertCmd("southwest", ["She heads southwest.","The Drawing Room (Giant)",/This is a drawing room of immense size/,])
  


  test.assertCmd("drop boots", ["She drops the pair of boots.",])
  test.assertCmd("west", ["She heads west.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("east", ["She heads east.","The Drawing Room",/The drawing room is/,"She can see a small pair of boots here.",])
  test.assertCmd("get boots", ["She takes the small pair of boots.",])
  test.assertCmd("west", ["She heads west.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("north", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("south", ["She heads south.","The Steam Hall (Upper)",/overlooks the main steam hall/,])
  test.assertCmd("x win", ["Mandy looks at the bricked-up window. No way is she getting out that way. Wait. The window she smashed is in the north end of the gallery. Why is this window bricked-up too?",])

  
  test.title("Nursery and balloon")
  test.assertCmd("east", ["She heads east.","The Greenhouse (West, On Catwalk)",/bushes and plants/,])
  test.assertCmd("east", ["She heads east.","The Greenhouse (East, On Catwalk)","She is standing on a catwalk that skirts the north side of the great greenhouse. Even from here, the huge oak tree towers over her.","Is there someone down below? He -- or she for all Mandy can tell -- is wearing a silver shell-suit like it is 1996 or something. 'Hey!' calls Mandy. The figure looks up for a moment, and Mandy can see his face is silver too, before darting off to the east."])
  test.assertCmd("east", ["She heads east.","The Great Gallery",/great gallery/,])
  test.assertCmd("x boots", ["The boots are tiny, suitable for a doll maybe. The toe of the right boot is coming away from the sole.",])
  test.assertCmd("north", ["Mandy has to stoop to get through the narrow door to the north.","The Nursery","This seems to be a nursery, or at least what a nursery might have looks like a century ago. A china doll is sat on a chair, and there is a doll's house near them. Mandy can also see a cream-painted cot near the window, and a balloon...",'The balloon is near the ceiling, but seems to be falling...'])

  test.assertCmd("ask man about house", ["There doesn't seem to be anything you might call 'man' here.",])
  test.assertCmd("open dolls", ["She opens the doll's house. Inside, the house is a perfectly furnished, complete with a little man, sat on a chair.", "The little man looks at Mandy, a look of surprise on his face. 'Cor blimey, you're a big 'un!'  Apparently he is alive!","The balloon, gently falling from the ceiling, is at about head height.",])
  test.assertCmd("x dolls", ["Like the room, the doll's house is old fashioned. Made of wood, the roof looks like maybe it has been carved to look like it is thatched. The walls are white, the window frames are metal, and it stands on a base painted green. The back is opened up, and inside Mandy can see a tiny man.","The balloon has drifted down to about waist height.",])
  test.assertCmd("x man", ["The man is only about ten centimetres tall, but looks normally proportioned. He is dressed in blue overalls, and has dark hair, that is going grey. He seems to be making a pair of shoes.","The balloon is at knee height, floating downwards."])
  test.assertCmd("get balloon", ["Mandy tries to grab the balloon, but it bounces upwards, out of reach.","The balloon is near the ceiling, but seems to be falling...",])
  test.assertCmd("talk to man", ["Mandy wonders what topics she could ask the tiny man about...",])
  test.assertCmd("ask man about boots", ["Mandy asks the little man about boots.","'What the..?' he replies, 'Ask me about a topic what I know about.'","The balloon, gently falling from the ceiling, is at about head height."])
  test.assertCmd("ask man about shoes", ["'Are you making those shoes or mending them?'", "'Mending 'em. Be good as new when I've done with 'em.'", "The balloon has drifted down to about waist height."])
  test.assertCmd("give boots to man", ["Mandy gives the small pair of boots to the tiny man. 'What'd I want something like that?' he asks."])


  test.title("Nursery and boots")
  test.assertCmd("ask man about boots", ["'Could you mend some boots?' Mandy showed him the boots.","'I should think so. Toss 'em over here, and I'll 'ave a go.'","The balloon is at knee height, floating downwards."])
  test.assertCmd("get balloon", ["Mandy tries to grab the balloon, but it bounces upwards, out of reach.","The balloon is near the ceiling, but seems to be falling...",])
  test.assertCmd("give boots to man", ["Mandy gives the boots to the tiny man. 'I'll get on that as soon as I've done these,' he says.", "Mandy glances at the balloon. 'I don't suppose you could do it now?' She smiles sweetly at him, making him jump back from his seat in horror.", "'Okay, okay, giant-lady! Whatever you say!' He drops the shoes, and starts to examine the hole in the boot.", "The balloon, gently falling from the ceiling, is at about head height."])
  test.assertCmd("Wait", ["Time passes...","The balloon has drifted down to about waist height.",])
  test.assertCmd("Wait", ["Time passes...","The balloon has drifted down to about waist height.",])
  test.assertCmd("get balloon", ["Mandy tries to grab the balloon, but it bounces upwards, out of reach.","'Okay, there you go,' says the tiny man, putting the boots on the floor in from of himself. 'Good as new! Well, nearly.'", "The balloon is near the ceiling, but seems to be falling...",])
  test.assertCmd("get boots", ["She takes the small pair of boots.", "The balloon, gently falling from the ceiling, is at about head height."])
  test.assertCmd("x boots", ["The boots are tiny, suitable for a doll maybe. They look in good condition, now they have been mended.", "The balloon has drifted down to about waist height."])
  test.assertCmd("s", ["Mandy ducks down to go out the door, and as she does a sudden flash of light momentarily disorientates here.", "The Great Gallery", /The great gallery is a wooden platform that overlook/])

  

  
  
  


  test.title("Head to patch")
  test.assertCmd("down", ["She heads down.","The Great Hall",/The great hall is an impressive size/,])
  test.assertCmd("down", ["She heads down.","The Mad Science Laboratory","This appears to be some kind of laboratory, though nothing like the ones at school. While they have their own distinctive smell, this room is different, though Mandy is not sure what it is. The room is dominated by a very solid wooden bench, with a corpse on it; is it there to be dissected? A strange device that stands at the head of the table, connected to the body by a number of thick wires, and a coil of wire sits on the floor beside it. Above the table, a crocodile is suspended. Mandy can also see a journal lying in a corner, as though tossed there in anger.",])
  
  test.assertCmd("x coil", ["The wire is about a millimetre thick, and she guesses there is about thirtyfive metres of it, the end of which is soldered to the side of the machine at the head of the table on the wall.",])
  test.assertCmd("get wire", ["She takes the coil of wire.",])
  test.assertCmd("x wire", ["The wire is about a millimetre thick, and she guesses there is about thirtyfive metres of it, the end of which is soldered to the side of the machine at the head of the table on the wall.",])
  test.assertCmd("u", ["She heads up.","The Great Hall",/The great hall is an impressive size/,"The wire trails behind as Mandy unwinds it."])
  
  test.assertCmd("up", ["She heads up.","The Great Gallery",/The great gallery is a wooden platform that overlook/,"The wire trails behind as Mandy unwinds it.",])
  test.assertCmd("south", ["She heads south.","The Solar","The solar. Mandy knows the name from history class; this is where the lord of the castle would sleep. None too comfortable to Mandy's eyes, but possibly the height of luxury a thousand years ago. A large bed, crudely built of wood; a tapestry hung from one wall; a chamber pot under the bed.","The wire trails behind as Mandy unwinds it.",])
  test.assertEqual(5, w.chamber_pot.size)
  test.assertCmd("get pot", ["Mandy takes the chamber pot, trying desperately not to think about what it has been used for. At least it is empty...",])
  test.assertCmd("x pot", ["A chamber pot, useful for... something?",])
  test.assertEqual(5, w.chamber_pot.size)
  
 
  test.assertCmd("l", ["The Solar","The solar. Mandy knows the name from history class; this is where the lord of the castle would sleep. None too comfortable to Mandy's eyes, but possibly the height of luxury a thousand years ago. A large bed, crudely built of wood; a tapestry hung from one wall.","She can see some wire here."])
  test.assertCmd("n", ["She heads north.","The Great Gallery",/The great gallery is a wooden platform that overlook/,"She can see some wire here.", "Mandy coils up the wire.",])  
  test.assertCmd("up", ["She heads up.","The Observatory","The room is dominated, filled even, by a telescope and its supporting mechanism, which is not difficult, as the room is not big. There are some controls on the wall, and the only exit is the stairs she has just come up.","The wire trails behind as Mandy unwinds it.",])



  test.title("Telescope")
  test.assertCmd("x tel", ["The telescope itself is about four metres long. It is held in place by a complicated mechanism, involving cogs and gears, and the whole thing is made of brass, giving it a strange beauty. It is currently nearly vertical, and pointing northeastward.",])
  test.assertCmd("use tel", ["Mandy looks though the eyepiece at the side of the base of the telescope, but all she can see a uniform off-white. Exactly the same colour as the ceiling...",])
  test.assertCmd("push lever", ["She pushes the lever down, and a huge slot in the ceiling opens up, directly in front of the telescope, allowing anyone using the telescope to actually see the sky.","She glances outside; the sky looks threatening. It had been quite nice before she entered the house.",])
  test.assertCmd("look through t", ["Mandy looks though the eyepiece at the side of the base of the telescope. For a moment, all she can see is the reflection of her eyelashes, but she opens her eyes wide, and can see... clouds. And they look pretty much the same as they do without a telescope.",])
  test.assertCmd("pull lever", ["She pulls the lever up, and the slot in the ceiling slides closed."])  
  test.assertCmd("pull lever", ["She pulls the lever down, and the huge slot in the ceiling opens up."])  


  test.title("Telescope wheels")
  test.assertCmd("turn left left", "With a grunt of effort, Mandy turns the left wheel a full rotation anti-clockwise -- it is hard work! As she does the entire telescope, and the mechanism holding it, rotates, with a painful grinding noise. At the same time, the ceiling also turns.")
  test.assertEqual(0, w.telescope.azimuth)
  test.assertCmd("turn left left", "With a grunt of effort, Mandy turns the left wheel a full rotation anti-clockwise -- it is hard work! As she does the entire telescope, and the mechanism holding it, rotates, with a painful grinding noise. At the same time, the ceiling also turns.")
  test.assertEqual(7, w.telescope.azimuth)
  test.assertCmd("turn left right", "Mandy turns the left wheel a full rotation clockwise, and as she does the entire telescope, and the mechanism holding it, smoothly rotates. At the same time, the ceiling also turns.")
  test.assertEqual(0, w.telescope.azimuth)
  test.assertCmd("x tel", "The telescope itself is about four metres long. It is held in place by a complicated mechanism, involving cogs and gears, and the whole thing is made of brass, giving it a strange beauty. It is currently nearly vertical, and pointing northward.")
  test.assertCmd("turn left left", "With a grunt of effort, Mandy turns the left wheel a full rotation anti-clockwise -- it is hard work! As she does the entire telescope, and the mechanism holding it, rotates, with a painful grinding noise. At the same time, the ceiling also turns.")
  test.assertCmd("turn left left", "With a grunt of effort, Mandy turns the left wheel a full rotation anti-clockwise -- it is hard work! As she does the entire telescope, and the mechanism holding it, rotates, with a painful grinding noise. At the same time, the ceiling also turns.")
  test.assertEqual(6, w.telescope.azimuth)
  test.assertEqual(7, w.telescope.altitude)
  test.assertCmd("turn right right", "Mandy tries to move the right wheel anti-clockwise, but it will not turn any more.")
  test.assertEqual(7, w.telescope.altitude)
  test.assertCmd("turn right left", "Mandy turns the right wheel a full rotation clockwise, and as she does the telescope lowers.")
  test.assertCmd("turn right left", "Mandy turns the right wheel a full rotation clockwise, and as she does the telescope lowers.")
  test.assertCmd("turn right left", "Mandy turns the right wheel a full rotation clockwise, and as she does the telescope lowers.")
  test.assertEqual(4, w.telescope.altitude)


  
  test.title("Climb")
  test.assertCmd("climb", ["She clambers up the telescope.", "The Observatory (On The Telescope)", "Mandy stands -- somewhat precariously -- on the top of the mechanism that supports the telescope.", "The wire trails behind as Mandy unwinds it."])
  test.assertCmd("e", "She can't go east.")
  test.assertCmd("w", ["Mandy cautiously edges along the telescope to the very end, then reaches over to the opening the roof. She climbs though, and for a moment is balanced precariously on the botton of the slot, before she jumps onto the adjacent roof.", "On A High Roof (East)", /Mandy/, /scary far/, /Ash Tree Estate/, "Suddenly the rain starts. 'Shit,' she screams at the sky, as she is quickly soaked to the skin. It was supposed to be sunny today!", "The wire trails behind as Mandy unwinds it."])
  test.assertCmd("drop pot", "It occurs to Mandy that anything she drops here will fall down the roof, and will be lost forever.")



  test.title("Weather vane")
  test.assertCmd("w", [/Mandy starts to edge along the roof/, "On A High Roof (West)", /a weather vane/, "Mandy sees lightning in the hills to the north -- somewhere around her home, she supposes. A few seconds later she can hear the thunder. It occurs to her that being up on the roof holding something metal is not the safest of things to do. Maybe some haste is in order.", "The wire trails behind as Mandy unwinds it."])

  test.assertCmd("tie wire to vane", ["Mandy wraps the wire from the spindle around the letter E on the weather vane, then lets the spindle drop, happy that it is secure.", "A brief flash of lightning lights up the weather vane, and a few seconds later Manda hears the thunder."])
  test.assertCmd("e", ["Mandy crawls back along the apex of the roof, towards the dome of the observatory.", "On A High Roof (East)", "Mandy is standing -- rather nervously -- on the apex of a roof.", "Is the rain getting worse? She did not think that was possible."])
  test.assertCmd("e", ["Mandy nervously jumps back on to the sill of the opening in the observatory roof. After a moment to catch her breath, she reaches across, to grab the telescope, and then edges back, to stand on the mechanism.", "The Observatory (On The Telescope)", "Mandy stands -- somewhat precariously -- on the top of the mechanism that supports the telescope.", "At least she is out of the rain now!", "Suddenly there is a huge crack of thunder and a flash of light, making Mandy shriek in shock."])
  test.assertCmd("d", ["She heads down.", "The Observatory", "The room is dominated, filled even, by a telescope and its supporting mechanism, which is not difficult, as the room is not big. There are some controls on the wall, and the only exit is the stairs she has just come up. A section of roof is open on the west side of the dome. There is a black line along the floor marking where the wire had been before the lightning strike.", "She is dripping water on to the floor."])
  test.assertCmd("down", ["She heads down.","The Great Gallery",/There is a black line running from the observatory/,])
  
  test.assertCmd("down", ["She heads down.","The Great Hall",/The great hall is an impressive size/,])


  test.title("Animated")
  test.assertCmd("down", ["She heads down.","The Mad Science Laboratory","This appears to be some kind of laboratory, though nothing like the ones at school. While they have their own distinctive smell, this room is altogether worse, with a strong smell of burnt rubber. The room is dominated by a very solid wooden bench. At one end of the bench a strange device stands with wires dangling from it. Above the table, a crocodile is suspended. Mandy can also see a journal lying in a corner, as though tossed there in anger.","She can see an animated corpse here.","Mandy notices the body on the bench twitching, then it raises its right arm, and looks at it. 'It's alive!' she cackles, because, really, what else is one supposed to do after animating a body with lightning?"])
  
  test.assertCmd("Look at animated corpse", "Mandy looks at the creature she bought to life. It is about two and a half metres tall, and very solidly built. Patches of it are hairy, other patches are dark skinned, some light skinned. Its face is not attractive, it too is a mishmash of parts. Mandy really does not want to know where all the parts came from. However, it needs a name... 'I'll call you Patch,' she says. It nods it head, possibly in acknowledgment.")
  test.assertCmd("give boots to patch", ["Mandy gives the boots to Patch. He looks at the tiny footwear in confusion, before dropping them on the floor.",])
  test.assertCmd("get boots", ["She takes the small pair of boots.",])
  test.assertCmd("up", ["She heads up.","The Great Hall",/The great hall is an impressive size/,])
  test.assertCmd("up", ["She heads up.","The Great Gallery",/The great gallery is a wooden platform that overlook/,])
  test.assertCmd("west", ["She heads west.","The Greenhouse (East, On Catwalk)","She is standing on a catwalk that skirts the north side of the great greenhouse. Even from here, the huge oak tree towers over her.",])
  test.assertCmd("x tree", "The single tamarind tree is a big one, reaching almost to roof of the great greenhouse. From here, Mandy could reach out and touch the leaves of the tree, though the many seed pods are further away.")
  test.assertCmd("get pod", "The tamarind pods are out of reach.")
  test.assertCmd("west", ["She heads west.","The Greenhouse (West, On Catwalk)",/catwalk/,])
  test.assertCmd("west", ["She heads west.","The Steam Hall (Upper)",/overlooks the main steam hall/,])
  test.assertCmd("north", ["She heads north.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("east", ["She heads east.","The Drawing Room",/The drawing room is/,])




  test.title("Big boots")
  test.assertCmd("drop boots", ["She drops the small pair of boots.",])
  test.assertCmd("west", ["She heads west.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("north", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])
  test.assertCmd("east", ["She heads east.","The Drawing Room (Giant)",/This is a drawing room of immense size/,"She can see a pair of boots here.",])
  test.assertCmd("get boots", ["She takes the pair of boots.",])
  test.assertCmd("west", ["She heads west.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("east", ["She heads east.","The Drawing Room",/The drawing room is/,])
  test.assertCmd("x boots", ["The boots are big, like a size fifteen or something, Mandy reckons. Her dad has big feet, but not like these. They look in good condition, now they have been mended.",])
  test.assertCmd("drop boots", ["She drops the pair of boots.",])
  test.assertCmd("west", ["She heads west.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("north", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])
  test.assertCmd("east", ["She heads east.","The Drawing Room (Giant)",/This is a drawing room of immense size/,"She can see a big pair of boots here.",])
  test.assertCmd("in", ["Mandy crawls inside the left boot.","Inside a left boot","The interior of the boot is no more pleasant than the exterior; just darker. It looks like there is a huge sheet of thick card, folded into two, wedged in the toe.",])
  test.assertCmd("get card", ["She takes the piece of paper.",])
  test.assertCmd("x card", ["A huge sheet of thick card, folded in two; Mandy can see giant writing on one side.",])
  test.assertCmd("read card", [/Mandy opens up the huge sheet of card/,])
  test.assertCmd("l", ["Inside a left boot","The interior of the boot is no more pleasant than the exterior; just darker.",])


  test.title("Boots to Patch")
  test.assertCmd("out", ["Mandy climbs out of the giant boot, thankful to be out of there.","The Drawing Room (Giant)",/This is a drawing room of immense size/,"She can see a big pair of boots here.",])
  test.assertCmd("drop card", ["She drops the piece of paper.",])
  test.assertCmd("west", ["She heads west.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("east", ["She heads east.","The Drawing Room",/The drawing room is/,"She can see a pair of boots and a sheet of card here.",])
  test.assertCmd("take boots", ["She takes the pair of boots.",])
  test.assertCmd("take paper", ["She takes the sheet of card.",])
  test.assertCmd("x paper", ["A large sheet of thick card, folded in two; Mandy can see writing on one side.",])
  test.assertCmd("west", ["She heads west.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("south", ["She heads south.","The Steam Hall (Upper)",/overlooks the main steam hall/,])
  test.assertCmd("east", ["She heads east.","The Greenhouse (West, On Catwalk)",/catwalk/,])
  test.assertCmd("east", ["She heads east.","The Greenhouse (East, On Catwalk)","She is standing on a catwalk that skirts the north side of the great greenhouse. Even from here, the huge oak tree towers over her.",])
  test.assertCmd("east", ["She heads east.","The Great Gallery",/The great gallery is a wooden platform that overlook/,])
  test.assertCmd("down", ["She heads down.","The Great Hall",/The great hall is an impressive size/,])
  test.assertCmd("down", ["She heads down.","The Mad Science Laboratory","This appears to be some kind of laboratory, though nothing like the ones at school. While they have their own distinctive smell, this room is altogether worse, with a strong smell of burnt rubber. The room is dominated by a very solid wooden bench. At one end of the bench a strange device stands with wires dangling from it. Above the table, a crocodile is suspended. Mandy can also see a journal lying in a corner, as though tossed there in anger.","She can see Patch here.",])
  test.assertCmd("x device", "The machine at the head of the table is about a metre and a half tall; a wooden cabinet, with brass fittings. On the front are a series of dials and knobs. About a dozen wires run from the machine to Patch, each attached to its own brass bolt on the machine, and to a clip on his torso. There is smoke coming from the back of it.")
  test.assertCmd("give boots to patch", ["Mandy gives the boots to Patch. He looks at the footwear with a big smile, then proceeds to pull on the left boot... Then the right. He looks at them, now on his feet, for a moment, before getting off the bench, and standing upright, ripping of all the wires connecting him to the strange device.",])
  test.assertCmd("x device", "The machine at the head of the table is about a metre and a half tall; a wooden cabinet, with brass fittings. On the front are a series of dials and knobs. About a dozen wires hang down from the machine, each attached to its own brass bolt on the machine. There is smoke coming from the back of it.")
  
  
  test.title("Seed")
  test.assertCmd("p,follow", ["'Follow me,' says Mandy to Patch.","Patch nods his head.",])
  test.assertCmd("up", ["She heads up.","The Great Hall",/The great hall is an impressive size/,/Patch enters/])
  
  test.assertCmd("up", ["She heads up.","The Great Gallery",/The great gallery is a wooden platform that overlook/,/Patch enters/])
  test.assertCmd("west", ["She heads west.","The Greenhouse (East, On Catwalk)","She is standing on a catwalk that skirts the north side of the great greenhouse. Even from here, the huge oak tree towers over her.",/Patch enters/])
  test.assertCmd("west", ["She heads west.","The Greenhouse (West, On Catwalk)",/She is standing on a catwalk/,/Patch enters/])
  test.assertCmd("west", ["She heads west.","The Steam Hall (Upper)","This is a catwalk that overlooks the main steam hall, perhaps to give maintenance access to the upper parts of the great engine. From here, she could go in the lift to get to the upper or lower levels, or head north or east.",/Patch enters/])
  test.assertCmd("in", ["Mandy is about to step through the doorway, when she realises there is nothing there! This is, she guesses a lift shaft, minus the lift."])
  test.assertCmd("east", ["She heads east.","The Greenhouse (West, On Catwalk)",/She is standing on a catwalk/,"Patch enters the west end of the greenhouse catwalk from the west.",])
  test.assertCmd("east", ["She heads east.","The Greenhouse (East, On Catwalk)","She is standing on a catwalk that skirts the north side of the great greenhouse. Even from here, the huge oak tree towers over her.","Patch enters the east end of the greenhouse catwalk from the west.",])
  test.assertCmd("east", ["She heads east.","The Great Gallery","The great gallery is a wooden platform that overlooks the great hall, running along the north and east sides of it. A wide flight of wooden stairs leads back down to the hall, while a narrow spiral staircase goes further upwards. The walls are of rough-cut stone. Doorways are east, south and west; together with a a rather low doorway north. There is a black line running from the observatory, down to the Great Hall.","Patch enters the great gallery from the west.",])
  test.assertCmd("down", ["She heads down.","The Great Hall","The great hall is an impressive size. It looks older than the rest of the house, a lot older, being built of rough-cut stone. There are doors to east and west, and a wooden staircase leads up to a wooden gallery that ran along the west side of the hall. To the south, a doorway leads to a flight of steps heading downwards. There is a black line running from the gallery, down to the lab.","Patch enters the great hall from above.",])
  test.assertCmd("west", ["She heads west.","The Greenhouse (East)","Ma.","Patch enters the east end of the greenhouse from the east.",])
  
  
  test.assertCmd("patch,wait", ["'Wait here,' says Mandy to Patch.","Patch nods his head.",])
  test.assertCmd("west", ["She heads west.","The Greenhouse (West)",/All manner of plants are growing/,])
  test.assertCmd("west", ["She heads west.","The Steam Hall",/This large room is dominated by a huge engine/,])
  test.assertCmd("in", ["She heads through the doorway.","The Lift Shaft","Mandy is standing at the bottom of a small room, with a high roof -- a lift shaft she realises. The lift itself is way over her head; she can see another doorway above the one she came through that must be the floor above. There are rails on both side walls, with a rack between them, presumably for a pinion to engage.",])
  test.assertCmd("out", ["She heads out.","The Steam Hall",/This large room is dominated by a huge engine/,])
  test.assertCmd("east", ["She heads east.","The Greenhouse (West)",/All manner of plants are growing/,])
  test.assertCmd("east", ["She heads east.","The Greenhouse (East)","Ma.","She can see Patch (wearing a pair of boots) here.",])
  test.assertCmd("east", ["She heads east.","The Great Hall","The great hall is an impressive size. It looks older than the rest of the house, a lot older, being built of rough-cut stone. There are doors to east and west, and a wooden staircase leads up to a wooden gallery that ran along the west side of the hall. To the south, a doorway leads to a flight of steps heading downwards. There is a black line running from the gallery, down to the lab.",])
  test.assertCmd("up", ["She heads up.","The Great Gallery","The great gallery is a wooden platform that overlooks the great hall, running along the north and east sides of it. A wide flight of wooden stairs leads back down to the hall, while a narrow spiral staircase goes further upwards. The walls are of rough-cut stone. Doorways are east, south and west; together with a a rather low doorway north. There is a black line running from the observatory, down to the Great Hall.",])
  test.assertCmd("east", ["She heads east.","The Dining Room","This room is dominated by an elegant, dark wood table, well-polished, with brass legs shaped like a lion's, and laid out with eight dinner settings. Eight chairs, in matching style, surrounded it. At the table, six mannequins are sat, dressed up in clothes and wigs. The north wall has a window, with dark wood cabinets on either side, and there is a grand marble fireplace directly opposite the window, with a large clock on the mantelpiece. There are doors to the east, south and west.",])
 
  
  
  
  test.title("The key")
  test.assertCmd("south", ["Mandy heads south.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("west", ["She heads west.","Backstage",/narrow room full of junk/,])
  test.assertCmd("nw", ["Mandy heads northwest, through the side-left wing, onto the stage.","'Oh, what? Hey!' She is startled for a moment to see a figure standing on the stage. She is about to say something more articulate when she realises it is not moving.","The Theatre Stage",/The curtain is up and bright lights/,"She can see a theatre mannequin here.",])
  test.assertCmd("west", ["Mandy heads west, towards the edge of the stage, intending to jump down into the stalls, but somehow cannot do it. As she gets nearer to the edge her steps get heavier and heavier -- it is almost like those bright lights are pushing her back."])
  test.assertCmd("x man", ["The figure seems to have been manufactured to resemble a man of impressive proportions, in height, but also in the girth of his chest. And its groin too, Mandy notices with a wry smile. It, or he, is constructed of brass, and looks to be jointed. He is clothed in a frilly off-white shirt, and dark baggy trousers, as well as a floppy hat. Mandy notices there is a hole in the back of his shirt, and a corresponding hole in his back, where a simple, if large, key might fit.",])
  test.assertCmd("use key", ["Mandy looks at the hole in the back of the inanimate figure; a square peg. Like it would fit the key she has -- only much much bigger.",])
  test.assertCmd("se", ["Mandy heads southeast, through the side-right wing, to the backstage area.","Backstage",/narrow room full of junk/,])
  test.assertCmd("east", ["She heads east.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("get phone from bag", ["Done.",])
  test.assertCmd("east", ["She heads east.","The Drawing Room",/The drawing room is/,])
  test.assertCmd("drop phone", ["She drops the mobile phone.",])
  test.assertCmd("drop key", ["She drops the clock key.",])
  test.assertCmd("west", ["She heads west.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("north", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])
  test.assertCmd("east", ["She heads east.","The Drawing Room (Giant)",/This is a drawing room of immense size/,"She can see a big clock key and a big mobile phone here.",])
  test.assertCmd("x key", ["This key is about a foot across, and would be for turning a mechanism with a square peg. A big square peg.",])
  test.assertCmd("x phone", ["Mandy's phone is now not only way out of date, but also too big to easily carry.",])
  test.assertEqual('big mobile phone', w.mobile_phone.alias)
  test.assertOut(["Her stupid phone is now too big to use!"], function() {
    w.mobile_phone.use()
  })
  test.assertCmd("get all", ["She takes the big mobile phone.","She takes the big clock key.",])


  test.title("Wind up")
  test.assertCmd("west", ["She heads west.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("west", ["She heads west.","Backstage",/narrow room full of junk/,])
  test.assertCmd("sw", ["Mandy heads southwest, through the side-right wing, onto the stage.","The Theatre Stage",/The curtain is up and bright lights/,"She can see a theatre mannequin here.",])
  test.assertCmd("x man", ["The figure seems to have been manufactured to resemble a man of impressive proportions, in height, but also in the girth of his chest. And its groin too, Mandy notices with a wry smile. It, or he, is constructed of brass, and looks to be jointed. He is clothed in a frilly off-white shirt, and dark baggy trousers, as well as a floppy hat. Mandy notices there is a hole in the back of his shirt, and a corresponding hole in his back, where a simple, if large, key might fit.",])
  test.assertCmd("use key", ["Mandy looks at the hole in the back of the inanimate figure; a square peg. She puts the large key over it, and finds it is a good fit. What are the odds? She give it half a turn, with some effort. Another turn, and another, until it will turn no more.","Suddenly, the figure moves, and Mandy jumps back, even though that is exactly what she is hoping for. He looks at her. 'Good day. I see you are a fellow thespian!' in a fruity voice."])
  test.assertCmd("talk to man", [
    "'So...' says Mandy, 'I don;t suppose you can tell mne how to get out of here?'",
    "'I seek to know what the soul of wit is. If you can tell me what that is, then I shall help you as far as I am able.'",
    "'The soul of wit? I've no idea what you're talking about.'",
    /it is a simple question/,
    "No feigning here, thinks Mandy. The bard, that has to be Shakespeare. She wishes she had actually read some of that stupid book. Then again, she had a feeling he wrote quite a few plays. 'So, remind me which play it was again.'",
    "'Why, Hamlet of course, as you well know. Act 2, scene 2. Now quickly girl, answer the question, and we shall be done here.'"
  ])


  test.assertCmd("ne", ["Mandy heads northeast, through the side-left wing, to the backstage area.","Backstage",/narrow room full of junk/,])
  test.assertCmd("east", ["She heads east.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("south", ["She heads south.","The Steam Hall (Upper)","This is a catwalk that overlooks the main steam hall, perhaps to give maintenance access to the upper parts of the great engine. From here, she could go in the lift to get to the upper or lower levels, or head north or east.",])
  test.assertCmd("east", ["She heads east.","The Greenhouse (West, On Catwalk)",/suspended from the ceiling by metal rods/,])
  test.assertCmd("east", ["She heads east.","The Greenhouse (East, On Catwalk)","She is standing on a catwalk that skirts the north side of the great greenhouse. Even from here, the huge oak tree towers over her.",])
  test.assertCmd("east", ["She heads east.","The Great Gallery","The great gallery is a wooden platform that overlooks the great hall, running along the north and east sides of it. A wide flight of wooden stairs leads back down to the hall, while a narrow spiral staircase goes further upwards. The walls are of rough-cut stone. Doorways are east, south and west; together with a a rather low doorway north. There is a black line running from the observatory, down to the Great Hall.",])
  test.assertCmd("x hamlet", ["Mandy looks at the book she now has. A copy of \"Hamlet\". She wondered if it would be any less boring than \"Antony and Cleopatra\". Probably not worth risking finding out.","Then she remembered the Clockwork Thespian. The soul of wit. Hamlet, act 2, scene 2. Quickly she thumbs through. Brevity! Brevity is the soul of wit."])
  test.assertEqual(101, w.clockwork_thespian.state)

 test.assertCmd("west", ["She heads west.","The Greenhouse (East, On Catwalk)","She is standing on a catwalk that skirts the north side of the great greenhouse. Even from here, the huge oak tree towers over her.",])
  test.assertCmd("west", ["She heads west.","The Greenhouse (West, On Catwalk)",/suspended from the ceiling by metal rods/,])
  test.assertCmd("west", ["She heads west.","The Steam Hall (Upper)","This is a catwalk that overlooks the main steam hall, perhaps to give maintenance access to the upper parts of the great engine. From here, she could go in the lift to get to the upper or lower levels, or head north or east.",])
  test.assertCmd("north", ["She heads north.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("west", ["She heads west.","Backstage",/narrow room full of junk/,])
  test.assertCmd("nw", ["Mandy heads northwest, through the side-left wing, onto the stage.", "The Theatre Stage", /The curtain is up and bright lights/,"She can see a clockwork thespian here.",])

  test.assertCmd("talk to man", [
    "'I've found it, the answer,' says Mandy triumphantly. 'It's \"Brevity\"!'",
    "'Perfect! Indeed it is. I knew you would find it. And now I will tell you how to escape this house. Outside this small theatre is a long gallery, with a chess set on a table.'",
    "'I saw it. All the pieces are glued down.'",
    "'Not all of them. The white knight changes the room if you twist it, takes you outside the house.'",
  ])
  test.assertCmd("ne", ["Mandy heads northeast, through the side-left wing, to the backstage area.","Backstage",/narrow room full of junk/,])
  test.assertCmd("east", ["She heads east.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("north", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])
  test.assertCmd("turn king", ["Mandy tries to turn a few of the chess pieces, but none of them moved at all.",])
  test.assertCmd("turn knight", [/white knight/,/a small rise overlooking a battlefield/,"'Shit,' mutters Mandy. This is certainly outside the house, but she has no idea where she is. Or even when; how long is it since horses were used in a war, or uniforms like that?",])
  
  
  test.title("Battlefield")
  test.assertCmd("turn horse", ["This can't be right, thinks Mandy, as she tries to push the rump of the dead horse, to get it to turn. 'Shit!' It is too heavy to move. If she had a lever...",])
  test.assertCmd("fill pot", ["There's nothing to fill it with here.",])
  test.assertCmd("s", ["Mandy picks her way carefully around the corpses, to the beach.","A Sandy Beach","The beach would be nice if it were not the dead soldiers; there seems to be more blue-uniformed one here than red. The sand looks fine and almost white, and the sea to the south looks very inviting. There might be a way along the beach through the bodies to the southwest, or she could go back north to the dead horse.",])
  
  test.assertCmd("fill pot", ["She fills the chamber pot.",])
  test.assertCmd("s", ["Mandy is about to paddle in the sea, when she sees a corpse floating nearby, surrounded by clouds of red. And another over there. And... lots of corpses. Perhaps the sea is not so inviting.",])
  test.assertCmd("x pot", ["A chamber pot, useful for... something? It is full of sand.",])
  test.assertEqual(5, w.chamber_pot.size)
  test.assertCmd("sw", ["She heads southwest.","A Rocky Beach",/The beach is all rocks here/,])
  test.assertCmd("x boat", ["The boat is a wreck -- really just bits of broken wood -- but might have been about four metres long, with perhaps two or three sets of rowers. It looks like only one of the oars has survived.",])
  test.assertCmd("x oar", ["The oar is made of solid wood, and about a metre long.",])
  test.assertCmd("get oar", ["She takes the oar.",])
  test.assertCmd("ne", ["She heads northeast.","A Sandy Beach","The beach would be nice if it were not the dead soldiers; there seems to be more blue-uniformed one here than red. The sand looks fine and almost white, and the sea to the south looks very inviting. There might be a way along the beach through the bodies to the southwest, or she could go back north to the dead horse.",])
  test.assertCmd("n", ["Mandy heads back up the small rise, carefully stepping around the corpses.",/a small rise overlooking a battlefield/,])
  test.assertCmd("turn horse", ["This can't be right, thinks Mandy. She puts the oar under the rump of the dead horse. With a grunt, she jerks it up, and the hindquarters of the horse move a bit. With a shrug, she does it again, and again, slowly inching the back end of the horse round the front end...","She lets go of the oar, and stands to take a breath, and suddenly the world dissolves around here.","She is back in the house. A sudden movement at the other end of the gallery catches her eye. A figure, all in silver, looks at her, before disappearing into the theatre.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here."])  


  test.title("Tamarind pod")
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("south", ["She heads south.","The Steam Hall (Upper)",/overlooks the main steam hall/,])
  test.assertCmd("east", ["She heads east.","The Greenhouse (West, On Catwalk)",/She is standing on a catwalk/,])
  test.assertCmd("east", ["She heads east.","The Greenhouse (East, On Catwalk)","She is standing on a catwalk that skirts the north side of the great greenhouse. Even from here, the huge oak tree towers over her.",])
  
  test.assertCmd("get pod", ["The tamarind pods are out of reach.",])
  test.assertCmd("get tree", ["Mandy leans over the rail, and grabs a solid-looking leaf on the tamarind tree. She gives it a good tug, then another and another, until a ripe pod is dislodged. The pod falls...","... To be caught with surprising dexterity by Patch, who is standing below.",])
  test.assertCmd("get tree", ["Mandy leans over the rail, and grabs a solid-looking leaf on the tamarind tree. She gives it a good tug, then another and another, until a ripe pod is dislodged. The pod falls...","Patch looks very confused as he stares at the pod in his hand, then the pod on the ground, then the pod in his hand again. Then suddenly a silvery figure appears from the west, quickly scoops up the pod from the floor, and runs back west.",])
  test.assertCmd("east", ["She heads east.","The Great Gallery",/The great gallery is a wooden platform that overlook/,])
  test.assertCmd("down", ["She heads down.","The Great Hall",/The great hall is an impressive size/,])
  test.assertCmd("west", ["She heads west.","The Greenhouse (East)","Ma.","She can see Patch (wearing a pair of boots; holding a tamarind pod) here.","Mandy sees movement up on the catwalk. A silver figure, running round it, and then down the section to the west, before disappearing from view."])
  test.assertCmd("patch,open pod", ["The tamarind pod can't be opened.",])
  test.assertCmd("patch,give me pod", ["'Give me the tamarind,' says Mandy.","Patch looks at the pod in his hand, then at Mandy. After a moment's deep thought, he hands her the pod.",])
  test.assertCmd("west", ["She heads west.","The Greenhouse (West)",/All manner of plants are growing/,])
  random.prime(10)
  test.assertCmd("open pod", ["Using the shard of glass, Mandy cuts the pod open. Inside she finds ten seeds, which she quickly extracts, throwing away the useless husk."])

  test.title("Plant seed and fail")
  test.assertEqual(0, w.grown_tamarind_tree.seedsPlanted)
  test.assertCmd("plant 2 seeds in ground", ["Mandy carefully plants two tamarind seeds in the bare earth.",])
  test.assertCmd("put three seeds in earth", ["Mandy carefully plants three tamarind seeds in the bare earth.",])
  test.assertCmd("put phone in earth", ["Mandy wonders if burying the big mobile phone is going to achieve anything. Probably not.",])
  test.assertCmd("get seeds", ["She takes five tamarind seeds.",])
  test.assertCmd("plant 2 seed", ["Mandy carefully plants two tamarind seeds in the bare earth.",])
  w.hourglass.active = true
  test.assertCmd("plant 3 seeds", ["Mandy starts to put another three tamarind seeds in the ground, but as her hands get near, they start to blur, and feel numb. Perhaps not such a good idea when the hourglass is running.",])
  test.assertCmd("get seed", ["Mandy starts to dig two tamarind seeds from the ground, but as her hands get near, they start to blur, and feel numb. Perhaps not such a good idea when the hourglass is running.",])
  w.hourglass.active = false


  test.title("Plant seed and fail")
  test.assertCmd("climb tree", ["It's not something you can climb."])
  test.assertCmd("plant seed", ["Mandy carefully plants one tamarind seed in the bare earth.",])
  test.assertEqual(3, w.tamarind_seed.countAtLoc('bare_earth'))
  test.assertCmd("turn ho", ["Mandy turns the hourglass over.","The upper bulb in the hourglass is about 100% full.","Mandy watches as three shoots grow; the shoot are now about two centimetres high.",])
  
  
  
  test.assertEqual(true, w.hourglass.active)
  test.assertEqual(3, w.grown_tamarind_tree.seedsPlanted)
  test.assertEqual(0, w.tamarind_seed.countAtLoc('bare_earth'))
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 25% full.","Mandy watches as three shoots grow; the shoot are now about three centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is now empty.",])
  test.assertEqual(false, w.hourglass.active)
  test.assertCmd("climb tree", ["Mandy looks at the three shoots grow thoughtfully. If the shoot were more substantial, she could climb they."])

  test.assertCmd("Wait", ["Time passes...",])
  test.assertCmd("plant 1 seed", ["Mandy carefully plants one tamarind seed in the bare earth.",])
  test.assertCmd("get ho", ["She takes the hourglass.","The shoot wither away to nothing.",])
  test.assertCmd("turn ho", ["Mandy turns the hourglass over.","The upper bulb in the hourglass is about 100% full.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 25% full.",])
  test.assertCmd("turn ho", ["Mandy turns the hourglass over.","The upper bulb in the hourglass is about 75% full.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is now empty.",])
  
  
  test.title("Fill hourglass")
  test.assertCmd("west", ["She heads west.","The Steam Hall",/This large room is dominated by a huge engine/,])
  test.assertCmd("west", ["She heads west.","A Corridor","The corridor runs from east to west, with three windows along the north side. Various brass pipes run the length of the south wall, while others turn abruptly to dive into the wall on either side of the room. All seem to converge on the east end of the corridor.",])
  test.assertCmd("west", ["She heads west.","The Dining Room","This room is dominated by an elegant, dark wood table, well-polished, with brass legs shaped like a lion's, and laid out with eight dinner settings. Eight chairs, in matching style, surrounded it. At the table, seven mannequins are sat, dressed up in clothes and wigs. The north wall has a window, with dark wood cabinets on either side, and there is a grand marble fireplace directly opposite the window, with a large clock on the mantelpiece. There are doors to the east, south and west.",])
  test.assertCmd("south", ["Mandy heads south.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("east", ["She heads east.","The Drawing Room (Giant)",/This is a drawing room of immense size/,])
  test.assertCmd("west", ["She heads west.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("east", ["She heads east.","The Drawing Room",/The drawing room is/,])
  test.assertCmd("drop pot", ["She drops the chamber pot.",])
  test.assertEqual(5, w.chamber_pot.size)
  test.assertCmd("drop h", ["She drops the hourglass.",])
  test.assertCmd("west", ["She heads west.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("north", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("east", ["She heads east.","The Drawing Room (Giant)",/This is a drawing room of immense size/,"She can see a big chamber pot (full of sand) and an big hourglass here.",])
  test.assertEqual(6, w.chamber_pot.size)
  test.assertCmd("get all", ["She takes the big hourglass.","She takes the big chamber pot.",])
  test.assertCmd("west", ["She heads west.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("east", ["She heads east.","The Drawing Room",/The drawing room is/,])
  test.assertCmd("drop ho", ["She drops the big hourglass.",])
  test.assertCmd("drop pot", ["She drops the big chamber pot.",])
  test.assertEqual(6, w.chamber_pot.size)
  test.assertCmd("west", ["She heads west.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("north", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("east", ["She heads east.","The Drawing Room (Giant)",/This is a drawing room of immense size/,"She can see a huge chamber pot (full of sand) and an huge hourglass here.",])
  test.assertEqual(7, w.chamber_pot.size)
  test.assertCmd("get po", ["She takes the huge chamber pot.",])
  test.assertEqual(7, w.chamber_pot.size)
  
  
  
  test.assertCmd("pour sand into ho", ["She empties the huge chamber pot into the huge hourglass.",])
  test.assertEqual(7, w.chamber_pot.size)
  test.assertCmd("pour sand into ho", ["She is not carrying anything with sand in it.",])
  test.assertCmd("pour po into ho", ["The huge chamber pot is already empty.",])
  test.assertCmd("west", ["She heads west.","The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("south", [/Mandy heads to the other end of the gallery/,"The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("east", ["She heads east.","The Drawing Room",/The drawing room is/,"She can see an big hourglass here.",])
  test.assertCmd("get ho", ["She takes the big hourglass.",])
  test.assertCmd("west", ["She heads west.","The Gallery (South)",/south end of the gallery/,])
  test.assertCmd("north", [/she heads to the north end/,"The Gallery (North)",/gloomy corridor/,"She can see some shards of glass under the bricked-up window here.",])
  test.assertCmd("north", ["Mandy heads north.","The Dining Room","This room is dominated by an elegant, dark wood table, well-polished, with brass legs shaped like a lion's, and laid out with eight dinner settings. Eight chairs, in matching style, surrounded it. At the table, eight mannequins are sat, dressed up in clothes and wigs. The north wall has a window, with dark wood cabinets on either side, and there is a grand marble fireplace directly opposite the window, with a large clock on the mantelpiece. There are doors to the east, south and west.",])
  test.assertCmd("east", ["She heads east.","A Corridor","The corridor runs from east to west, with three windows along the north side. Various brass pipes run the length of the south wall, while others turn abruptly to dive into the wall on either side of the room. All seem to converge on the east end of the corridor.",])
  test.assertCmd("east", ["She heads east.","The Steam Hall",/This large room is dominated by a huge engine/,])
  test.assertCmd("east", ["She heads east.","The Greenhouse (West)",/All manner of plants are growing/,])


  test.title("Plant seed and get short tree")
  test.assertCmd("climb", ["Nothing to climb here."])
  test.assertEqual(1, w.tamarind_seed.countAtLoc('bare_earth'))
  test.assertCmd("turn ho", ["Mandy closes the tap of the hourglass, then turns it over.","The upper bulb in the hourglass is about 100% full."])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 92% full.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 83% full.",])
  test.assertEqual(1, w.tamarind_seed.countAtLoc('bare_earth'))
  test.assertCmd("put ho on ped", ["Done.","The upper bulb in the hourglass is about 75% full.","Mandy watches as the shoot grows; the shoot is now about two centimetres high."])
  test.assertEqual(0, w.tamarind_seed.countAtLoc('bare_earth'))
  test.assertEqual(1, w.grown_tamarind_tree.seedsPlanted)
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 67% full.","Mandy watches as the shoot grows; the shoot is now about three centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 58% full.","Mandy watches as the shoot grows; the shoot is now about five centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 50% full.","Mandy watches as the plant grows; the plant is now about eight centimetres high.",])
  test.assertCmd("climb tree", ["Mandy looks at the rapidly grow tamarind plant thoughtfully. If she grabs on to it now, it will take her up with it as it grows! Steps closer, and her foot starts to blur, and feel numb. A moment later she is feeling nauseated. She steps back, trying to catch her breath. Perhaps not such a great idea..."])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 42% full.","Mandy watches as the plant grows; the plant is now about ten centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 33% full.","Mandy watches as the plant grows; the plant is now about twenty centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 25% full.","Mandy watches as the plant grows; the plant is now about forty centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 17% full.","Mandy watches as the plant grows; the plant is now about seventy centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 8% full.","Mandy watches as the tree grows; the tree is now about one metre high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 0% full.","Mandy watches as the tree grows; the tree is now about two metres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is now empty.",])
  test.assertCmd("up", ["Mandy appraises the tree. It has been a while, but she can climb that. She grabs a lower branch, and hauls herself up.","Up A Tamarind Tree","Mandy is up a tamarind tree. She is almost up as high as the catwalk... And well short of the top of the metal box.",])
  test.assertCmd("d", ["Mandy carefully climbs back down.","The Greenhouse (West)",/All manner of plants are growing/,"She can see a tree here.",])

  
  test.title("Plant seed and get short tree")
  test.assertCmd("plant 2 seeds", ["Mandy carefully plants two tamarind seeds in the bare earth.",])
  test.assertCmd("turn ho", ["Mandy picks up the hourglass to turn it over. As she does, the tree withers away to nothing. 'Shit...' she mutters in disappointment. She turns the hourglass over, and puts it down again.","The upper bulb in the hourglass is about 100% full.","Mandy watches as two shoots grow; the shoot are now about two centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 92% full.","Mandy watches as two shoots grow; the shoot are now about three centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 83% full.","Mandy watches as two shoots grow; the shoot are now about five centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 75% full.","Mandy watches as two plants grow; the plant are now about eight centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 67% full.","Mandy watches as two plants grow; the plant are now about ten centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 58% full.","Mandy watches as two plants grow; the plant are now about twenty centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 50% full.","Mandy watches as two plants grow; the plant are now about forty centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 42% full.","Mandy watches as two plants grow; the plant are now about seventy centimetres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 33% full.","Mandy watches as two trees grow; the tree are now about one metre high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 25% full.","Mandy watches as two trees grow; the tree are now about two metres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 17% full.","Mandy watches as two trees grow; the tree are now about four metres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 8% full.","Mandy watches as two trees grow; the tree are now about six metres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is about 0% full.","Mandy watches as two trees grow; the tree are now about ten metres high.",])
  test.assertCmd("Wait", ["Time passes...","The upper bulb in the hourglass is now empty.",]) 
  
  
  
  //test.assertCmd("climb", ["Nothing to climb here."]) !!!

  test.title("Get to control room")
  test.assertCmd("east", ["She heads east.","The Greenhouse (East)","Ma.","She can see Patch (wearing a pair of boots; holding a tamarind pod) here.",])
  test.assertCmd("east", ["She heads east.","The Great Hall","The great hall is an impressive size. It looks older than the rest of the house, a lot older, being built of rough-cut stone. There are doors to east and west, and a wooden staircase leads up to a wooden gallery that ran along the west side of the hall. To the south, a doorway leads to a flight of steps heading downwards. There is a black line running from the gallery, down to the lab.",])
  test.assertCmd("up", ["She heads up.","The Great Gallery","The great gallery is a wooden platform that overlooks the great hall, running along the north and east sides of it. A wide flight of wooden stairs leads back down to the hall, while a narrow spiral staircase goes further upwards. The walls are of rough-cut stone. Doorways are east, south and west; together with a a rather low doorway north. There is a black line running from the observatory, down to the Great Hall.",])
  test.assertCmd("west", ["She heads west.","The Greenhouse (East, On Catwalk)","She is standing on a catwalk that skirts the north side of the great greenhouse. Even from here, the huge oak tree towers over her.",])
  test.assertCmd("west", ["She heads west.","The Greenhouse (West, On Catwalk)",/suspended from the ceiling by metal rods/,])

  test.assertCmd("southwest", ["Mandy looks at the tall tamarind tree. From below it looked like the catwalk was close. Now... not so much. She climbs over the balustrade, and looks down. 'Shit.' It is a long way to fall. She takes a moment to calm her nerves, then reaches across, grabbing a branch she hopes will be strong enough. She pulls it closer, and then grabs it with her other hand. She shrieks as the branch sags under her weight, but it does not break, and she can climb up, into the relative safety of the heart of the tree.","Up A Tall Tamarind Tree",/Mandy is up a tall tamarind tree/,])
  test.assertCmd("southwest", ["Mandy looks at the top of the metal box.. She can do this. She edges along a sturdy looking branch, and reaches out, triumphantly grabbing a metal bar that runs across the top of the box. The branch starts to sag alarmingly, and she quickly hauls herself onto the platform.","The Lift",/The lift is little more than a cage on vertical rails/,])




  test.title("Control room")
  test.assertCmd("out", ["She heads out.","The Control Room",/control room/,"She can see Winfield Malewicz here.","'Good day, miss,' says the man. 'I'm Malewicz; Dr Winfield Malewicz. It's such a delight to actually meet someone after all this time.' This is the guy the letter is for, Mandy realises.",])
  test.assertCmd("ask mal about escape", ["'Is there no way out?'","'None. The walls might as well be made of steel, my girl.'",])
  test.assertCmd("talk to mal", ["Mandy wonders what topics she could ask Dr Malewicz about...",])
  test.assertCmd("get letter from bag", ["Done.",])
  test.assertCmd("give letter to mal", ["Mandy gives the letter to Dr Malewicz 'This is for you; it was in the street.'","'A letter?' He turns it over, inspecting the address. 'It is for me! This is most unusual.'","'I know, right? Who sends letters nowadays?'",/Malewicz proceeds to open the envelope/,/Thirteenth of May/,/And the centenary/])
  test.assertCmd("x i", ["The wedding invitation is printed in black, on off-white card, with very ornate handwriting. Mandy wonders if she dares to read it...",])
  test.assertCmd("ask mal about einstein", ["Mandy asks Dr Malewicz about einstein.","'I'm sorry my dear,' he replies, 'I have no idea what you're talking about. Is there some other topic you'd like to discuss?'",])
  test.assertCmd("read i", ["Mandy tries to casually read the invitation without appearing to...\"My very good friend and his companion are cordially invited to the wedding of Albert Einstein to Elsa Löwenthal, on the Second of June, 1919, at the Oranienbergerstrasse Synagogue in Berlin.\" Wait, the Albert Einstein?",])
  test.assertCmd("ask mal about einstein", ["'So, er, you know Einstein?'","'What makes you say that?'","'Er...' She does not want him to know she read the invite. 'This seems like the sort of stuff he would be into.'","'You're familiar with his work? I always suspected his research would go down in history.'","'Sure. Relativity and... that... stuff.'",])
  test.assertCmd("north", ["She heads north.","A Weird Room","This is a room in dire need of a description.","She can see a house man here.","Dr Malewicz follows Mandy into the strange room.","She glances at it quickly, the windows that seem to be laughing at her. How was that even possible? There are four windows, all rectangular and all different sizes. They look nothing like eyes, and yet somehow she knows they are laughing at her. No, that's was wrong, she says to herself. They're not windows, they really are eyes, and there's only two of them!","'A mere girl,' says the house... No, says the man, Mandy tells herself. 'A mere girl thinks she can solve a riddle that has stumped poor Malewicz for over a century?'","'Over a century?' says Dr Malewicz. 'Can it really be that long?'","'Actually I never claimed to be able to solve anything,' Mandy pointed out. 'So if you could let me out, I'll just be on my way..?'","'No one leaves the house!' the man shouts. Then, in a quieter, but no more pleasant voice; 'It's just not possible. Now, that riddle... would you like to hear it.'","Mandy shrugs. 'I guess.'","'What direction?'","'That's it? What sort of riddle is that? That's as lame as \"what have I got in my pocket?\"'","'Fiendishly tricky.'","'Lame.'","'Nevertheless, you will not leave until you solve it.'",])
  test.assertCmd("say north", ["Mandy says 'north.'","'Wrong!' says the house, gleefully.","'Yes, yes, I've tried all the compass directions,' says Dr Malewicz. 'It's nothing as obvious as that I'm afraid.'",])
  test.assertCmd("say in", ["Mandy says 'in.'","'Wrong!' says the house, gleefully.","'Yes, and I've tried all the non-compass directions too,' says Dr Malewicz.",])
  test.assertCmd("say fkgjgh", ["Mandy says 'fkgjgh.'","'Wrong!' says the house, gleefully.","'I'm not sure I follow your reasoning,' says Dr Malewicz. 'Is that a direction?'",])
  

  test.assertCmd("say one", ["Mandy thinks about what makes her special. Then looks at her bag. Her One Direction bag. And then there were some of the things Dr Malewicz had said, like History and Steal my girl. Had he been channelling the answer in some way?","'One Direction?' she says, tentatively.","The scornful face of the man-house darkens in anger for a moment, before he collapsed before her eyes in a shower of tiny bricks. For a moment nothing happens, but then the bricks start swirling around, rebuilding the figure. 'Oh, God, not again,' mutters Mandy. But the man-house thing looks different. He is no longer laughing at her.","'Thank you,' he says, even as he slowly fades away. 'You saved me. I must apologise for my earlier behaviour, I was not quite myself.'","'What..?' says Mandy, feeling utterly bewildered...","The Lounge","This is a cosy room.","She can see Winfield Malewicz here.",])
  test.assertCmd("west", ["Mandy steps out of the house, and into the garden. She has escaped at last. Now all she has to worry about is exams in two weeks. Assuming it is still the thirteen of May, 2016...",/./,/T H E/,])

  /**/

    
}