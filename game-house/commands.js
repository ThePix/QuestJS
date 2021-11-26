"use strict"




const showMap = function() { return failedmsg(lang.no_map) }


findCmd('MetaHint').script = function() {
  metamsg("Hints can be found on {link:this page:" + folder + "/hints.html}, in the form of InvisiClues, so you can avoid seeing spoilers you do want to see. The page will open in a new tab, so will not affect your playing of the game.")
  return world.SUCCESS_NO_TURNSCRIPTS
},

/*
findCmd('MetaHelp').script = function() {
  metamsg("Enter commands to navigate the world. Use the compass directions, plus {colour:blue:UP}, {colour:blue:DOWN}, {colour:blue:IN}, {colour:blue:OUT} to move around. Use commands like {colour:blue:GET LETTER} and {colour:blue:DROP PEN} to pick things up and drop them. Use {colour:blue:INVENTORY} (or just {colour:blue:I}) to see what you are carrying.")
  metamsg("It is often important to examine items; use {colour:blue:LOOK AT LETTER} or {colour:blue:EXAMINE BAG} or just {colour:blue:X HOUSE}. Look at descriptions carefully to see what items are there - sometimes it may not be obvious.")
  metamsg("Should you encounter people, you can try commands like {colour:blue:TALK TO LARA} or {colour:blue:ASK KYLE ABOUT GARDEN}. You can also tell people to do something, by using the standard command, but with the person's name followed by a comma at the start, for example, {colour:blue:LARA, EAST} or {colour:blue:KYLE, GET HAT}. Also useful; {colour:blue:LARA, FOLLOW ME} and {colour:blue:KYLE, WAIT}. Of course, they will often decide not to...")
  metamsg("For more details go to {link:this page:https://github.com/ThePix/QuestJS/wiki/How-To-Play-Interactive-Fiction}, which will open in a new tab.")
  metamsg("If you are stuck, use {colour:blue:HINTS}.")
  return world.SUCCESS_NO_TURNSCRIPTS
},
*/



lang.exit_list.push({name:'climb', alt:'climb up', abbrev:'Cl', niceDir:"above", type:'vertical', x:0 ,y:0, z:1, opp:'down', not_that_way:'Nothing to climb here.'},)
lang.exit_list.push({name:'climb_down', alt:'climb down', abbrev:'CD', niceDir:"below", type:'vertical', x:0 ,y:0, z:-1, opp:'climb', not_that_way:'Nothing to climb down here.'},)
lang.exit_list.push({name:'swim', abbrev:'Swim', niceDir:"above", type:'vertical', x:0 ,y:0, z:1, opp:'down', not_that_way:'Nothing to swim here.'},)




// I don't even know where to begin with that.






lang.createVerb('Touch')
lang.createVerb('Play', {words:'play in|play'})
lang.createVerb('Kick')
lang.createVerb('Tighten')
lang.createVerb('Beat', {words:'beat|flog'})
lang.createVerb('Ride', {words:'ride|mount'})
lang.createVerb('Clean', {words:'clean|brush|sweep'})
lang.createVerb('Roll', {words:'roll up|roll'})
lang.createVerb('Shake', {ing:'Shaking'})
lang.createVerb('Flip', {ing:'flipping'})
lang.createVerb('Dig', {ing:'digging'})
lang.createVerb('Hug', {words:'hug|embrace|cuddle', ing:'Hugging'})
lang.createVerb('KnockOn', {words:'knock on|knock up|knock|rap|rap on|tap|tap on', defmsg:"{pv:item:be:true} not something Mandy can knock on."})
lang.createVerb('Repair', {words:'fix|mend|repair|tighten', defmsg:"{pv:item:be:true} not broken."})
lang.createVerb('SetClock', {words:'set|reset|change', defmsg:true})
lang.createVerb('CallLift', {words:'call|summon', defmsg:true})
lang.createVerb('WindUp', {words:'wind up|wind', defmsg:"{pv:item:'be:true} not something you can wind up."})
lang.createVerb('Kill', {words:'kill|slaughter|murder|attack', defmsg:"{pv:item:be:true} is not something worth killing."})
lang.createVerb('WaveAt', {words:'wave at', defmsg:"Mandy spends a few minutes waving at {nm:item:the}. Then wonders why she did."})
lang.createVerb('Catch', {defmsg: "Catching {nm:item:the} is not going to achieve much -- have you tried just taking it?"})
lang.createVerb('StareAt', {words:'stare at|stare', defmsg:"Mandy stares at {nm:item:the} for a few minutes, not sure quite what she expects it to do."})


lang.createVerbWith('Open', {held:true})




commands.unshift(new Cmd('Rude', {
  regex:/^(?:fuck|shag|shit|crap|damn|wank|frig)/,
  objects:[],
  script:function() { 
    parsermsg("Well, I <i>certainly</i> don't even know where to begin with <i>that</i>. Honestly, what were you thinking!") 
    return world.FAILED
  },
}))


commands.unshift(new Cmd('Xyzzy', {
  regex:/^(?:say |)xyzzy$/,
  objects:[],
  script:function() { 
    msg("Mandy starts to hum \"Story of life\" while you try to work out what to do. Odd to think it is five years when that came out, she muses. She was just starting at Kyderbrook High, and she when she heard Marcy Dillons singing it, and found she was a fellow Directioner, they had become good friends.")
    return world.FAILED
  },
}))
commands.unshift(new Cmd('Dance', {
  regex:/^dance$/,
  objects:[],
  script:function() {
    if (player.loc === 'stage') {
      msg("Mandy dances across the stage for a few minutes, wondering what it would be like to be a professional dancer, watched by hundreds as you perform.")
      if (w.clockwork_thespian.state > 0) {
        msg("'Not bad,' notes the clockwork thespian. 'Needs some practice, not to say some music of course, but I see the potential.'")
      }
      return world.SUCCESS
    }
    else {
      msg("Mandy starts to dance... Why is she dancing? It is like something -- or someone -- is controlling her! With a great effort of will power, she stops. She has to stand for a moment while she catches her breath. It was scary losing control of her body like that.")
      if (w.Patch.isHere()) msg("Patch gives her a strange look.")
      if (w.tiny_man.isHere()) msg("'You're a rum 'un, and no mistake,' says the tiny man.")
      if (w.Winfield_Malewicz.isHere()) msg("'The ways of young people were decidedly odd in my day,' says Malewicz. 'I see the situation has only deteriorated.'")
      if (w.clockwork_thespian.isHere()) msg("'Ah, the artistic soul,' muses the clockwork thespian.")
    }
    return world.FAILED
  },
}))
commands.unshift(new Cmd('Sing', {
  regex:/^sing$/,
  objects:[
  ],
  script:function() {
    if (player.loc === 'stage') {
      msg("Mandy looks around the stage thoughtfully. An ideal place to make her singing debut! She grabs an imaginary microphone, and starts singing {i:Give Me All Your Love}, tentatively at first, but then with gusto.")
      if (w.clockwork_thespian.state > 0) {
        msg("'I am not familiar with that work,' says the clockwork thespian. 'Is it supposed to sound like that?'")
        msg("'Of course!'")
      }
      return world.SUCCESS
    }
    else {
      msg("Mandy starts to sing \"Steal my girl.\" She has not heard that for years, she muses, why did it pop into her head now?")
    }
    return world.FAILED
  },
}))
commands.unshift(new Cmd('Act', {
  regex:/^act$/,
  objects:[
  ],
  script:function() {
    if (player.loc === 'stage') {
      let s = "Ms Coulter says Shakespeare only really works on the stage, and here Mandy is standing on a stage. She takes out her book"
      if (w.shakespeare_book.state === 0) {
        s += "... Wait. This is not \"Antony and Cleopatra\". This is \"Twelfth Night\"! What has happened to \"Antony and Cleopatra\"? Ms Coulter will be furious. Then again, a book is a book."
        this.state = 1
      }
      else {
        s += ', now inexplicably \"Twelfth Night\".'
      }
      s += "|She starts to read... 'If music be the food of love, play on, Give me excess of it that, surfeiting, The appetite may sicken and so die.' She stops. 'Surfeiting the appetite? What the fuck does that mean?'"
      if (w.clockwork_thespian.state > 0) {
        msg("'It means Orsino wants to be rid for his appetite for love,' says the clockwork thespian, 'and he hopes music will allay it if he has a excess of it.'")
        msg("'Right...' Mandy quietly puts the book back in her bag.")
      }
      return world.SUCCESS
    }
    else {
      msg("Mandy has a sudden urge to act. She successfully resists it.")
    }
    return world.FAILED
  },
}))
commands.unshift(new Cmd('Jump', {
  regexes:[
    /^jump$/,
    /^jump (?:off|from)(?: the catwalk| catwalk|)$/,
  ],
  objects:[
  ],
  script:function() {
    if (player.loc.startsWith('greenhouse_catwalk')) {
      msg("Mandy looks over the side of the catwalk, and has a sudden urge to jump down. She shudders. That would not end well.")
      return world.FAILED
    }
    else {
      return failedmsg("Mandy jumps into the air... and quickly returns to the ground. Had to be worth a try. It would be annoying to discover this was a dream and she could have just flown everywhere.")
    }
    return world.FAILED
  },
}))
commands.unshift(new Cmd('Shout', {
  regex:/^(?:shout|yell|holler|cry out)$/,
  objects:[
  ],
  script:function() {
    msg("'Hey!' shouts Mandy. 'Any one here?'")

    return world.FAILED
  },
}))






commands.unshift(new Cmd('ThrowAtPod', {
  regexes:[
    /^(?:throw|lob|hurl) (.+) at (?:pods?|tree)$/,
    /^(?:hit|knock) (?:pods?|tree) with (.+)$/,
  ],
  objects:[
    {scope:parser.isHeld},
  ],
  responses:{
    pen:'Mandy lobs her pen at the pods on the tree. It bounces off one of them.',
    wooden_panel:'A little worried her precious panel might be damaged, Mandy throws it up at the pods on the tree... It misses, and comes cluttering to the ground.',
    glass_shard:'Mandy lobs the glass shard at the pods on the tree. It bounces off one of them.',
    paper_funnel:'Mandy throws the paper funnel at the tree... it gets about an arms length away, then flutters gently to the ground.',
    letter:'Mandy throws the letter at the tree... it gets about an arms length away, then flutters gently to the ground.',
    large_key:'Mandy lobs the key at the pods on the tree. It bounces off one of them.',
    boots:'Mandy hurls the boots at the tree... Well, that general direction. They miss the tree altogether.',
    secret_recipe:'Mandy throws the sheet of paper at the tree... it gets about an arms length away, then flutters gently to the ground.',
    chamber_pot:'Mandy hurls the chamber pot at the tree... Well, that general direction. It misses, falling with a huge clang.',
    stuffed_crocodile:'Mandy tries to throw the crocodile at the tree. Not the easiest thinhg to throw, she realises, as she misses the tree completely.',
    mad_science_journal:'Mandy throws the journal at the tree... it gets about an arms length away, then flutters gently to the ground.',
    grating:'Mandy the grating up at the pods on the tree... It misses, and comes cluttering to the ground.',
    floppy_hat:'Mandy throws the floppy hat at the tree... it bounces off the pods, then tumbles gently to the ground.',
  },  
  script(objects) {
    if (player.loc !== 'greenhouse_east' && player.loc !== 'greenhouse_catwalk_east') return failedmsg('Mandy would have to be holding {nm:item:the} to do that.', {item:obj})

    const obj = objects[0][0]
    if (!obj.isHeld) return failedmsg('Mandy would have to be holding {nm:item:the} to do that.', {item:obj})
    
    if (obj === w.mobile_phone) return failedmsg('Mandy thinks about chucking her crappy phone at the pod, but if she does ever get out of here, she want a phone that is {i:not} smashed.')
    if (obj === w.school_bag) return failedmsg('Mandy thinks about throwing her bag at the pod, but decides she should hang on to it.')
    if (obj === w.hourglass) return failedmsg('Mandy thinks about throwing the hourglass at the pod... She has a feeling it might be important, and is unlikely to survive its arboreal journey.')
    if (obj === w.china_doll) return failedmsg('Mandy thinks about throwing the china doll at the pod... Somehow she cannot bring herself to do it - seeing her smash would be too awful')
    if (obj.size && obj.size > 5) return failedmsg('Mandy thinks about hurling {nm:item:the} at the tree. Perhaps if {pv:item:was} not so big...', {item:obj})
      
    const s = this.responses[obj.name]
    if (!s) return failedmsg('Mandy thinks about throwing {nm:item:the} at the pod, but decides she should hang on to {sb:item}.', {item:obj})
      
    player.throwAtPodTries++
    obj.moveToFrom({item:obj, char:player}, "greenhouse_east")
    return failedmsg(s + '{ifMoreThan:player:throwAtPodTries:2:She starts to wonder if chucking things at the pod is going to work. Perhaps she needs another idea.}')
  }
}))




commands.unshift(new Cmd('TurnWithOar', {
  regexes:[
    /^(?:turn|shift|rotate|move) (.+) (?:with|using) oar$/,
    /^use oar to (?:turn|shift|rotate|move) (.+)$/,
  ],
  objects:[
    {scope:parser.isHere, attName:'turn'},
  ],
  attName:'turn',
  defmsg:"Touching {nm:item:the} is not going to achieve much.",
}))

/*
commands.unshift(new Cmd('OpenWith', {
  regexes:[
    /^(?:open|remove|get) (.+) (?:with|using) (.+)$/,
    {regex:/^use (.+) to (?:open|remove|get) (.+)$/, mod:{reverse:true}},
  ],
  objects:[
    {scope:parser.isHere, items:['grating']},
    {scope:parser.isHeld},
  ],
  script(objects) {
    if (objects[0][0] === w.grating) return w.grating.openWith(objects[1][0]) ? world.SUCCESS : world.FAILED
    if (objects[0][0].name.startsWith('tamarind_pod')) return objects[0][0].openWith(objects[1][0]) ? world.SUCCESS : world.FAILED
    return falsemsg("That is not something Mandy can open like that.")
  }
}))*/


commands.unshift(new Cmd('GrindUnderHeel', {
  regexes:[
    /^(?:grind) (.+?) (?:under|into) (?:heel|your heel|foot|your foot|ground|the ground)$/,
    /^(?:grind) (.+?)$/,
  ],
  attName:'grind',
  objects:[
    {scope:parser.isHere},
  ],
  defmsg:"Grinding {nm:item:the} is not going to achieve much.",
}))



  

const helpStrs1 = ['help', 'lift', 'boost']
const helpStrs2 = ['help *climb', 'give *leg up', 'give *boost']
let helpStr = helpStrs1.join('|') + '|' + helpStrs1.join(' me|') + ' me|' + helpStrs1.join(' mandy|') + ' mandy'
for (const s of helpStrs2) {
  helpStr += '|' + s.replace('*', '')
  helpStr += '|' + s.replace('*', 'me ')
  helpStr += '|' + s.replace('*', 'mandy ')
}

commands.unshift(new Cmd('NpcHelp', {
  regexes:[
      new RegExp('^(.+), ?(?:' + helpStr + ')$'),
      new RegExp('^(?:tell|ask|instruct) (.+) to (?:' + helpStr + ')$'),
  ],
  objects:[
      {scope:parser.isHere, attName:"npc"},
  ],
  script:function(objects) {
    const obj = objects[0][0]
    if (!obj.npc) return falsemsg("'Give me a hand, here,' says Mandy to {nm:item:the}. {pv:item:do:true} not do anything.", {item:obj})
    if (obj !== w.Patch) return falsemsg("'Give me a hand, here,' says Mandy to {nm:item:the}.|'What do you think I can do?' {pv:item:say:true}. Mandy shrugs, not sure herself.", {item:obj})
    
    msg("'Give me a hand, here,' says Mandy to Patch. He looks at her in confusion.")
    if (currentLocation.name === "greenhouse_east" || (currentLocation.name === "greenhouse_west" && w.grown_tamarind_tree.growthTime > 8))
    msg("Okay, so he is not so bright, but if she was more specific... She cannot just climb up him, but what if he was hugging the tree? Could she then climb the tree?")
  },
}))










commands.unshift(new Cmd('Plant', {
  regexes:[
    /^(?:plant|bury) (.+) in (?:earth|ground|soil|bare earth|bare ground)$/,
    /^(?:plant|bury) (.+)$/,
  ],
  objects:[
    {scope:parser.isHeld},
  ],
  script:function(objects) {
	  if (player.loc !== "greenhouse_west") return failedmsg("There is no where for Mandy to plant anything here.")
    const obj = objects[0][0]
    if (obj.name.startsWith('tamarind_pod_prototype')) return failedmsg("Mandy thinks about burying the pod, but she is pretty sure her dad would take the seeds out first, and plant them, rather than the pods.")
    if (obj !== w.tamarind_seed) return failedmsg("{pv:item:'be:true} not something Mandy really wants to bury.", {item:obj})

    objects.push([w.bare_earth])
    return handleInOutContainer(player, objects, "drop", handleSingleDropInContainer)
  },
}))

commands.unshift(new Cmd('Shift', {
  regex:/^(?:shift|move) (.+)$/,
  objects:[
    {scope:parser.isHere},
  ],
  script:function(objects) {
    const obj = objects[0][0]
    const tpParams = {item:obj, char:player}
    
    if (!obj.shiftable && obj.takeable) return failedmsg(lang.take_not_push, tpParams)
    if (!obj.shiftable) return failedmsg(lang.cannot_push, tpParams)

    return obj.shift() ? world.SUCCESS : world. FAILED
  },
}))

commands.unshift(new Cmd('Invert', {
  regexes:[
    /^(?:invert|turn over) (.+)$/,
    /^turn (.+) over$/,
  ],    
  objects:[
    {scope:parser.isPresent, attName:'turn'},
  ],
  script:function(objects) {
    const obj = objects[0][0]
    if (!obj.turn) return failedmsg("Mandy thinks about turning {nm:item:the} upside-down, but decides it is fine the way it is.", {item:obj})
    return obj.turn() ? world.SUCCESS : world. FAILED
  },
}))

commands.unshift(new Cmd('BurstBalloon', {
  rules:[cmdRules.isHeld],
  regexes:[
    /^use (.+) to (?:burst|break|cut|puncture|pierce|stab|pop) (.+)$/,
    { regex:/(?:burst|break|cut|puncture|pierce|stab|pop) (.+) (?:with|using) (.+)/, mod:{reverse:true}},
  ],
  objects:[
    {scope:parser.isHeld},
    {scope:parser.isHere},
  ],
  script:function(objects) {
    if (!objects[0][0].sharp) return failedmsg("Mandy's not going to pierce anything with that!")
    if (objects[1][0].name.startsWith('tamarind_pod_prototype')) return objects[1][0].open(false, player)
    // any other objects that are cuttable???
    if (objects[1][0] === w.yellow_balloon) return w.yellow_balloon.burst() ? world.SUCCESS: world.FAILED
    
    return failedmsg("Mandy takes a few stabs at {nm:item:the} with {nm:item2:the}, but does not achieve anything", {item:objects[1][0], item2:objects[0][0]})
  },
}))

commands.unshift(new Cmd('BurstBalloonOnly', {
  regex:/^(?:burst|break|cut|puncture|pierce|stab|pop) (.+?)$/,
  objects:[
    {scope:parser.isPresent, attName:'burst'},
  ],
  script:function(objects) {
    const obj = objects[0][0]
    //if (obj.name.startsWith('tamarind_pod_prototype')) return obj.open() ? world.SUCCESS: world.FAILED
    if (obj === w.yellow_balloon) return w.yellow_balloon.burst() ? world.SUCCESS: world.FAILED
    if (obj.smash) return objects[0][0].smash({item:obj, char:player}) ? world.SUCCESS: world.FAILED

    return failedmsg("Mandy takes a few stabs at {nm:item:the}, but does not achieve anything", {item:obj})
  },
}))

commands.unshift(new Cmd('WakeUp', {
  regex:/^(?:wake|wake up|awaken)$/,
  objects:[
  ],
  script:function(objects) {
    return failedmsg("This must be a dream, thinks Mandy. Like Alice in Wonderland, she will wake up in a shower of playing cards or something; she cannot quite remember how that ended. She pinches herself, but nothing happens, other than a painful sensation in her arm. Damn.")
  },
}))


commands.unshift(new Cmd('Fly', {
  regex:/^(?:try to fly|fly)$/,
  objects:[
  ],
  script:function(objects) {
    return failedmsg("Mandy jumps into the air... and quickly returns to the ground. Had to be worth a try. It would be annoying to discover this was a dream and she could have just flown everywhere.")
  },
}))


commands.unshift(new Cmd('ConfrontFears', {
  regex:/^confront (?:her |your |my |)fears?$/,
  objects:[
  ],
  script:function(objects) {
    if (currentLocation.zone === 'external') {
      msg("{i:Right,} thinks Mandy, {i:I can do this. All I have to do is go in the house, and hand over the letter.} She looks at the house again, trying to convince herself it is not laughing at her.")
    }
    else if (currentLocation.name === 'lounge') {
      msg("{i:I did it,} thinks Mandy, {i:I confronted my fears, and solved a mystery over a century old.}.")
    }
    else {
      msg("Mandy takes a deep calming breath. She must not let the horror of this place get to her. It is not even {i:that} horrid, if she is honest. It is not like it is full of spiders or even werewolves. It is not even that dirty.")
    }
    return world.SUCCESS;
  },
}))




commands.unshift(new Cmd('PhoneAFriend', {
  regex:/^(?:phone|call) (?:someone|a friend|friend|police|cops|parents|her parents)$/,
  objects:[
  ],
  script:function(objects) {
    w.mobile_phone.use()
    return world.FAILED;
  },
}))




commands.unshift(new Cmd('PutUnder', {
  regex:/^(?:put|place|drop) (.+) (?:under|beneath|below) (.+)$/,
  rules:[cmdRules.testManipulate, cmdRules.isHeld],
  objects:[
    {scope:parser.isHeld, items:['chamber_pot']},
    {scope:parser.isPresent, items:["leaking_pipe", "tamarind_tree_from_ground"]},
  ],
  script:function(objects) {
    if (objects[1][0] === w.leaking_pipe) {
      if (objects[0][0] !== w.chamber_pot) return falsemsg("Mandy thinks about putting {nm:item:the} under the leak... Then again, {pv:item:will} just get wet, so maybe not such a good idea.", {item:objects[0][0]})
      if (w.chamber_pot.containedFluidName) return falsemsg("The chamber pot is already full of " + w.chamber_pot.containedFluidName + " - there is not much point using it to catch drips.")
      msg("Mandy puts the chamber pot under the leaking pipe, when it will catch the drips.|Drip... drip... drip... It will take a while before the pot is full!")
      w.chamber_pot.loc = player.loc
      w.chamber_pot.underLeakState = 1
      w.chamber_pot.underLeak = true
      w.chamber_pot.flipped = false
      w.chamber_pot.scenery = true
      return world.SUCCESS
    }

    if (objects[1][0] === w.tamarind_tree_from_ground) {
      if (objects[0][0] !== w.chamber_pot) return falsemsg("Mandy thinks about putting {nm:item:the} under the tamarind tree... but decides that is not going to achieve anything.", {item:objects[0][0]})
      msg("Mandy puts the chamber pot under the tamarind tree - hopefully any falling pods will end up in there.")
      w.chamber_pot.loc = player.loc
      w.chamber_pot.underTree = true
      w.chamber_pot.flipped = false
      w.chamber_pot.scenery = true
      return world.SUCCESS
    }

    else {
      return falsemsg("Putting stuff under {nm:item:the} is not going to achieve anything.", {item:objects[1][0]})
    }
  },
}))






findCmd('Smell').script = function() {
  if (currentLocation.smell) {
    printOrRun(player, currentLocation, "smell");
  }
  else {
    msg(zones[currentLocation.zone].smell)
  }
  return world.SUCCESS;
}

findCmd('Listen').script = function() {
  if (currentLocation.listen) {
    printOrRun(player, currentLocation, "listen");
  }
  else {
    msg(zones[currentLocation.zone].listen)
  }
  return world.SUCCESS;
}

findCmd('Say').script = function(objects) {
  const text = objects[1]
  if (currentLocation.name === 'theatre_stage') {
    if (text.match(/\bto be\b/)) {
      msg("'To be or not to be,' says Mandy in a grand voice. She always wanted to be an actor... Well, not enough to take drama at school, but she liked the idea of being one. It was a shame she could not remember any more of the quote. Something about a question?")
    }
    else if (text.match(/\bbrevity\b/)) {
      if (w.clockwork_thespian.state === 101) {
        w.clockwork_thespian.brevity()
        return world.SUCCESS
      }
      if (w.clockwork_thespian.state > 101) {
        msg("'It's brevity,' says Mandy triumphantly. 'The answer to your riddle is \"Brevity\"!'")
        msg("'Indeed it is, but I'm afraid I cannot help you every time you say the word.'")
      }
      if (w.clockwork_thespian.state < 101 && w.clockwork_thespian.state > 0) {
        msg("Mandy mutters under her breath.")
        msg("'What was that?' asks the clockwork thespian.")
        msg("'Oh, nothing, just thinking to myself.' {i:I really need to find that book,} she thinks, {i:and solve his stupid riddle for myself.}")
      }
    }
    else if ( w.clockwork_thespian.state > 0) {
      msg("Mandy says '" + text + "' out loud.")
      msg("'Is that from a play?' asks the clockwork thespian. 'I am not immediately familiar with it, but have at it, darling, have at it!'")
    }
    else {
      msg("Mandy says '" + text + "' out loud, then wonders why she is talking to herself.")
    }
    return world.FAILED
  }
  
  if (currentLocation.name === 'nursery') {
    if (text.match(/hello|hi/)) {
      msg("Mandy says '" + text + ".'|'Alright?' says the tiny man in reply. She wonders if she should ask the man about something if she wants to get anywhere.")
    }
    else {
      msg("Mandy says '" + text + ".' The tiny man looks at her in confusion. She wonders if she should ask the man about something if she wants to get anywhere.")
    }
    return world.FAILED
  }
  
  if (currentLocation.name === 'steam_control_room') {
    if (text.match(/hello|hi/)) {
      msg("Mandy says '" + text + ".'|'Hello to you, miss' says Dr Malewicz. She wonders if she should ask him about something if she wants to get anywhere.")
    }
    else {
      msg("Mandy says '" + text + ".'|'I'm not sure I follow,' says Dr Malewicz. She wonders if she should ask him about something if she wants to get anywhere.")
    }
    return world.FAILED
  }
  
  if (currentLocation.name === 'weird_room') {
    if (text.match(/\b(one|1|1d)\b/)) {
      if (w.Winfield_Malewicz.songlist.length === 0) {
        msg("Mandy thinks about what makes her special. Then looks at her bag. Her {i:One Direction} bag. 'One Direction?' she says, tentatively.")
      }
      else {
        const uniq = [...new Set(w.Winfield_Malewicz.songlist)];
        let s = "Mandy thinks about what makes her special. Then looks at her bag. Her {i:One Direction} bag. And then there were some of the things Dr Malewicz had said, like "
        s += formatList(uniq.map(el => "{class:riddle:" + el + "}"), {lastJoiner:'and'})
        s += ". Had he been channelling the answer in some way?|'One Direction?' she says, tentatively."
        msg(s)
      }
      msg("The scornful face of the man-house darkens in anger for a moment, before he collapses before her eyes in a shower of tiny bricks. For a moment nothing happens, but then the bricks start swirling around, rebuilding the figure. 'Oh, God, not again,' mutters Mandy. But the man-house thing looks different. He is no longer laughing at her.")
      msg("'{smallcaps:Thank you,}' he says, even as he slowly fades away. '{smallcaps:You saved me. I must apologise for my earlier behaviour; I was not quite myself.}'")
      if (w.Winfield_Malewicz.loc) {
        msg("'What..?' says Mandy, feeling utterly bewildered...")
        w.Winfield_Malewicz.loc = 'lounge'
      }
      player.loc = 'lounge'
      world.update()
      world.enterRoom()
      return world.SUCCESS
    }
    else if (text.match(/north|south|east|west/)) {
      msg("Mandy says '" + text + ".'|'{smallcaps:Wrong!}' says the house, gleefully.")
      if (w.Winfield_Malewicz.compassTried && w.Winfield_Malewicz.loc) {
        msg("'You think I somehow forgot that one?' says Dr Malewicz testily.")
      }
      else if (w.Winfield_Malewicz.nonCompassTried && w.Winfield_Malewicz.loc) {
        msg("'Yes, and I've tried all the compass directions too,' says Dr Malewicz.")
      }
      else if (w.Winfield_Malewicz.loc) {
        msg("'Yes, yes, I've tried all the compass directions,' says Dr Malewicz. 'It's nothing as obvious as that I'm afraid.'")
      }
      w.Winfield_Malewicz.compassTried = true
    }
    else if (text.match(/in|out|up|down|exit|enter|left|right|forward|back/)) {
      msg("Mandy says '" + text + ".'|'{smallcaps:Wrong!}' says the house, gleefully.")
      if (w.Winfield_Malewicz.nonCompassTried && w.Winfield_Malewicz.loc) {
        msg("'You think I somehow forgot that one?' says Dr Malewicz testily.")
      }
      else if (w.Winfield_Malewicz.compassTried && w.Winfield_Malewicz.loc) {
        msg("'Yes, and I've tried all the non-compass directions too,' says Dr Malewicz.")
      }
      else if (w.Winfield_Malewicz.loc) {
        msg("'Yes, yes, I've tried all the up-and-down, and in-and-out directions,' says Dr Malewicz. 'It's nothing as obvious as that I'm afraid.'")
      }
      w.Winfield_Malewicz.nonCompassTried = true
    }
    else {
      msg("Mandy says '" + text + ".'|'{smallcaps:Wrong!}' says the house, gleefully.")
      if (w.Winfield_Malewicz.loc) msg("'I'm not sure I follow your reasoning,' says Dr Malewicz. 'Is that a direction?'")
    }
    return world.SUCCESS
  }
  
  if (w.Patch.loc === player.loc) {
    if (text.match(/hello|hi/)) {
      msg("Mandy says '" + text + ".' {nv:npc:nod:true} at her. Clearly he is not much of a conversationalist; she might do better to tell him to do something useful.", {npc:w.Patch})
    }
    else {
      msg("Mandy says '" + text + ".' {nv:npc:look:true} at her in confusion. Clearly he is not much of a conversationalist; she might do better to tell him to do something useful.", {npc:w.Patch})
    }
    return world.FAILED
  }
 
  msg("Mandy says '" + text + "' out loud, then wonders why she is talking to herself.")
  if (w.tiny_man.isHere()) msg("'You're a rum 'un, and no mistake,' says the tiny man.")
  if (w.Winfield_Malewicz.isHere()) msg("'The ways of young people were decidedly odd in my day,' says Malewicz. 'I see the situation has only deteriorated.'")
  return world.FAILED
}



 