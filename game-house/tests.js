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
  test.assertCmd("e", /She cannot go east/)

  w.telescope.azimuth = 0
  test.assertCmd("n", ["Mandy cautiously edges along the telescope to the very end.", "The Observatory (End Of The Telescope)", "Mandy sits -- somewhat precariously -- straddling the telescope. From here she could touch the ceiling, if she really want to."])
  test.assertCmd("n", "Mandy looks at the slot in the ceiling, just beyond the end of the telescope. If that were open, she might be able to get out through it, she muses.")
  w.telescope.roofOpen = true
  test.assertCmd("n", "Mandy considers for a moment a leap of faith from the end of the telescope, out through the slot in the ceiling... No, not a good idea.")
  test.assertCmd("w", /She cannot go west/)
  test.assertCmd("s", ["Mandy cautiously edges back along the telescope to where it is supported, and clings to the mechanism, feeling decidedly safer.", "The Observatory (On The Telescope)", "Mandy clings to the top of the mechanism that supports the telescope. From here she can... Not do a lot. The domed roof is too far to touch, and the eyepiece of the telescope is back on the ground. She could perhaps edge north along the telescope itself."])
  
  w.telescope.altitude = 7
  test.assertCmd("n", "Mandy looks at the end of the telescope; if it were not so steep and smooth, she could edge along it.")
  
  w.telescope.azimuth = 6
  w.telescope.altitude = 2
  w.telescope.roofOpen = false
  test.assertCmd("w", ["Mandy cautiously edges along the telescope to the very end.", "The Observatory (End Of The Telescope)", "Mandy sits -- somewhat precariously -- straddling the telescope. From here she could touch the ceiling, if she really want to."])
  test.assertCmd("n", /She cannot go north/)
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
  world.update()
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




  /**/

    
}