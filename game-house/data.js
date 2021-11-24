"use strict"




createItem("player", PLAYER(), {
  loc:"highfield_lane",
  alias:'Mandy',
  regex:/^(me|myself|player|mandy|amanda|her)$/,
  pronouns:lang.pronouns.female,
  examine:"Mandy is just an ordinary 15 year old girl, with dark shoulder-length hair and a nose she feels is too big. {if:currentLocation:zone:external:She is wearing the uniform of Kyderbrook High School.:She is wearing a uniform, but not the one she put on this morning...}{if:floppy_hat:loc:player: She is also wearing a floppy hat.}",
  silverSpotted:0,
  parserPriority:-50,
  throwAtPodTries:0,
  getSharp:function() {
    if (w.glass_shard.loc === player.name) return w.glass_shard
    if (w.crocodile_tooth.loc === player.name) return w.crocodile_tooth
    return null
  },
  talkto:function() {
    if (currentLocation.zone === 'external') {
      msg("'Can I really just go in that scary house?' Mandy asks herself.|'Of course I can!' she replies confidently.|'Yeah, well, it's not you doing it.'|'Well, obviously it is, because I'm you. You're talking to yourself, stupid!'|'Well, yes, I guess...'")
    }
    else if (currentLocation.zone === 'normality') {
      msg("'So I did it, I escaped the scary house,' Mandy says herself.|'Of course you did!' she replies. 'I never had a doubt!'|'Well I did, and that means you did, because you are me.'|'Err...'|Mandy grins in triumph; at last she had won an argument with herself.")
    }
    else {
      msg("'Will I ever escape this scary house?' Mandy asks herself.|'Of course you will!' she replies confidently. 'You just have to believe in yourself!'|'Don't give me that bullshit, you're as scared as I am.'|'Of course I'm scared - it's a scary house. But still sure we can get out of here.'|Mandy smiles uncertainly.")
    }
    return true
  },    
  receiveItems:[
    {
      item:w.boots, 
      f:function() { 
        options.item.loc = player.name
        options.item.worn = false
        options.char.animated = false
        msg("'Give me the boots,' says Mandy.")
        msg("{nv:char:look:true} at her in surprise, then sadness. Forlornly he sits on the floor, and slowly pulls off the boots, before handing them to Mandy. Mandy cannot look at his face without feeling guilty.", options)
      }
    },
    {
      test:function(options) { return options.char === w.Patch },
      f:function(options) {
        msg("'Give me {nm:item:the},' says Mandy.|{nv:char:look:true} at {nm:item:the} in his hand, then at Mandy. After a moment's deep thought, he hands her {ob:item}.", options)      
        options.item.loc = player.name
      }
    },
    {
      test:function() { return true },
      f:function(options) { 
        msg("{multi}Done.", options)
        options.item.loc = this.name
      }
    },
  ],
})


createItem("school_bag", CONTAINER(), {
  loc:"player",
  synonyms:['satchel'],
  examine:"Once more Mandy looks at her bag with disgust. She has had it since she was thirteen, when she had really been into One Direction. God, what has she been thinking? She has been asking her dad to get her a new one for like six months. It still has Zayn on it!",
  drop:"Mandy thinks she should hang on to her bag -- despite the faces of Harry, Niall, Liam,  Zayn and Louis plastered over it.",
})


createItem("mobile_phone", SIZE_CHANGING(), {
  loc:"school_bag",
  synonyms:['cell phone', 'buttons'],
  parserPriority:-20,
  use:function() {
    if (this.size === 5) {
      msg("{once:Mandy looks at her phone. 'Shit.' No charge left. She only charged it last night... No, wait, she had found it on her bedroom floor this morning. 'Shit,' she says again.}{notOnce:Mandy looks at her phone, but it stubbornly refuses to have any change.}")
      return true
    }
    else if (this.size === 4) {
      msg("Mandy looks at her shrunken phone. Maybe it was a bit optimistic thinking it would now be charged, just because it is so much smaller.")
      return true
    }
    else if (this.size > 5) {
      msg("Her stupid phone is now too big to use!")
      return false
    }
    else {
      msg("Her stupid phone is now too small to use!")
      return false
    }
  },
  open:'Mandy thinks about opening the phone and taking the battery out and then... Hmm, perhaps that is not such a good idea.',
  switchon:function() { this.use() },
  desc5:"Mandy looks at her phone. It is soooo old. It even has buttons!",
  desc4:"Mandy's phone is now tiny.",
  desc3:"Mandy's phone is so small she could hardly see it.",
  desc6:"Mandy's phone is now not only way out of date, but also too big to easily carry.",
})


createItem("pen", SIZE_CHANGING(), {
  loc:"school_bag",
  desc5:'{once:At the start of the week, Mandy had three black pens, two blue and one green. Now she only has this stupid green one. Where did they all go?}{notOnce:A stupid green pen.}',
  desc4:"Mandy's pen is now tiny.",
  desc6:"And now she has a {i:huge} stupid green pen.",
})



createItem("shakespeare_book", {
  loc:"school_bag",
  alias:"copy of \"Antony and Cleopatra\"",
  listAlias:"Antony and Cleopatra",
  synonyms:["shakespeare book"],
  parserPriority:-5,
  state:0,
  zone:'external',
  saveLoadExcludedAtts:['names'],
  testTake:function() { return falsemsg(this.take) },
  take:"Mandy definitely does not want to lose the book; Ms Coulter would be furious if she lost it! Best to leave it in the bag.",
  names:{},
  drop:"Mandy definitely does not want to drop the book; Ms Coulter would be furious if she lost it!",
  read:function() {
    this.examine()
    return true
  },
  examine:function() {
    if (this.state === 0 && this.listAlias === "Antony and Cleopatra") {
      msg("Mandy glances at her copy of \"Antony and Cleopatra\". She really should get around to actually reading it some time, what with an exam on it in just a few weeks.")
    }
    else if (currentLocation === w.lounge) {
      msg("Mandy looks at her book; hopefully it is \"Antony and Cleopatra\" again...|'Fuck.' The title on the front is \"All's Well That Ends Well\". 'Is that supposed to be funny?' she demands of the house. There is no reply, but as she looks at it, the book changes to \"Much Ado about Nothing\".|'Stupid house,' mutters Mandy.")
      this.setAlias("copy of \"Much Ado about Nothing\"", {listAlias:"Much Ado about Nothing"})
    }
    else if (this.state === 0) {
      this.state = 1
      msg("Mandy glances at her copy of \"Antony and Cleopatra\". Wait, this is not the same book! This is {nm:item:a}. What has happened to \"Antony and Cleopatra\"? Ms Coulter will be furious.", {item:this})
    }
    else {
      msg("Mandy looks at the book she now has. {nm:item:a:true}. She wonders if it would be any less boring than \"Antony and Cleopatra\". Probably not worth risking finding out.", {item:this})
    }
    if (w.clockwork_thespian.state > 1 && this.alias === "copy of \"Hamlet\"") {
      msg("Then she remembers the Clockwork Thespian. The soul of wit. Hamlet, act 2, scene 2. Quickly she thumbs through. Brevity! Brevity is the soul of wit.")
      this.state = 2
      w.clockwork_thespian.state = 101
    }
  },
  afterCarry:function() {
    if (this.zone !== currentLocation.zone) {
      this.zone = currentLocation.zone
      this.setAlias("copy of \"" + this.names[this.zone] + "\"", {listAlias:this.names[this.zone]})
      if (w.uniform.wet > 0) w.uniform.wet--
    }
  },
})


createItem("folder", {
  loc:"school_bag",
  scenery:true,
})


createItem("uniform", {
  loc:"player",
  scenery:true,
  alias:"school uniform",
  wet:0,
  getWorn:function() { return true },
  wetWords:['dry', 'damp', 'damp', 'wet', 'soaking wet', 'dripping wet'],
  uniforms:{
    external:'her grey and blue Kyderbrook High School uniform',
    victorian:'a rather dowdy grey school uniform that makes her look about fifty',
    flora:'a green and purple school uniform that feels strangely comfortable, even if it looks appalling',
    central:'a deep red school uniform that does not look to bad',
    medieval:'a startling blue and red uniform that is especially uncomfortable',
    steampunk:'a brown uniform, with gold-coloured trim',
    gothic:'a jet black uniform, that looks quite chic',
    subterrenea:'a dark green and yellow uniform that is just about on the cool side of nauseous',
    battlefield:'a red uniform, that looks disturbing like the military uniform of the dead soldiers',
  },
  remove:function() {
    if (!this.removeFlag) {
      msg("Mandy gives you a hard stare. 'It is not that sort of game,' she says.|'Wait, are you breaking the fourth wall?' you ask her.|'Don't get pissy with me. I'm not the one asking a sixteen year old girl to undress. Now, I suggest we just move on, and pretend this never happened, okay?'"),
      this.removeFlag = true
    }
    else {
      msg("Mandy just shakes her head, looking very disappointed.")
    }
  },
  examine:function() {
    let s = "Mandy is wearing " + this.uniforms[w[player.loc].zone] + "."
    if (this.wet) s += " It is " + this.wetWords[this.wet] + "."
    if (w.Winfield_Malewicz.dead) s += " It is splatted with Winfield Malewicz's blood."
    msg(s)
    if (w[player.loc].zone !== 'external' && !player.uniformnoted) {
      player.uniformnoted = true
      msg("That is definitely not the uniform of Kyderbrook High School that she was wearing when she entered the house!")
    }
  },
  nameModifierFunction:function(list) {
    list.push('worn')
  },
})





//  ----------- GENERIC ITEMS ---------------------------


const GENERIC = function() {
  return {
    scenery:true,
    parserPriority:-15,
    isLocatedAt:function(loc, situation) {
      const room = w[loc]
      if (!room.zone) return false
      if (w[loc + '_' + this.alias]) return false
      if (zones[room.zone][this.alias]) return true
      return false
    },
    examine:function() {
      const room = w[player.loc]
      if (typeof room['examine_' + this.alias] === 'function') {
        room['examine_' + this.alias]()
      }
      else if (typeof room['examine_' + this.alias] === 'string') {
        msg(room['examine_' + this.alias])
      }
      else {
        msg(zones[room.zone][this.alias])
      }
    }  
  }  
}

createItem("generic_wall", GENERIC(), {
  alias:"walls",
  smash:function() {
    return falsemsg("Mandy wonders about breaking the wall... They look well built, she thinks as she looks at one, then another and then the next, but what about that one? Got to be worth a try.|She looks right at you. 'So? What's going on? How do I get out of here?' She waits a moment for you to reply, then: 'Jesus, you're as clueless as I am.'")
  }
})

createItem("generic_floor", GENERIC(), {
  alias:"floor",
  synonyms:["ground"],
})

createItem("generic_door", GENERIC(), {
  alias:"door",
  open:function() { 
    metamsg("You do not need to open or close any any doors in the game. Just give a direction, like NORTH or IN, and Mandy will head that way, negotiating any doors on the way on her own.") 
    return false
  },
  close:function() {
    metamsg("You do not need to open or close any any doors in the game. Just give a direction, like NORTH or IN, and Mandy will head that way, negotiating any doors on the way on her own.") 
    return false
  },
})

createItem("generic_ceiling", GENERIC(), {
  alias:"ceiling",
  synonyms:['roof', 'dome'],
  touch:function() {
    if (currentLocation.name !== 'telescope_end') return falsemsg("Mandy tries to reach the ceiling, but it is too high.")
    msg("Mandy reaches over and touches the curved roof of the observatory -- just because it was such a struggle to be able to do.")
    return true
  },
})


createItem("generic_panelling", GENERIC(), {
  alias:"panelling",
  synonyms:['panels', 'paneling'],
  isLocatedAt:function(loc) {
    if (!w[loc].zone) return false
    return zones[w[loc].zone].panelling || w[loc].panelling
  },
  examine:function() {
    if (!w.generic_panelling.examinedIn) {
      w.generic_panelling.examinedIn = currentLocation.name
      w.wooden_panel.loc = currentLocation.name
      msg("Mandy carefully examines the wood panelling, something that has been a long time fascination for her, ever since her parents first dragged her to a stately home. She can still remember the panelling in the drawing room of Pattersleigh House... But that was nine years ago. This is, to be honest, rather inferior. The wood is coarser, the contours rather poorly defined. And one panel is loose!")
    }
    else {
      const room = w[w.hole_in_wall.loc]
      if (currentLocation !== room) {
        msg("More panelling, just like in {nm:room:the}.", {room:room})
      }
      else if (w.wooden_panel.scenery) {
        msg("Mandy carefully examines the wood panelling again, running her fingers over it. The wood may be course and the contours rather poorly defined, but it is still wonderful! And that one panel is still loose!")
      }
      else {      
        msg("Mandy carefully examines the wood panelling again, running her fingers over it. The wood may be course and the contours rather poorly defined, but it is still wonderful! She tries to ignore the hole where the panel is missing...")
      }
    }
  },
})

createItem("wooden_panel", SIZE_CHANGING(), {
  synonyms:['loose panel'],
  scenery:true,
  desc5:"{if:wooden_panel:scenery:Mandy looks at the loose panel thoughtfully. Would anyone notice if she just took it? Well, admittedly it would leave a large square patch of bare wall, so they probably would. But she had always wanted a wooden wall panel -- and not a stupid MDF one like her parents had tried to fob her off with.:Mandy looks at the wall panel... {i:her} wall panel with pride. It is a little over half a metre on each side, and almost certainly made of oak.}",
  desc4:"Mandy looks at the wall panel... {i:her} wall panel with pride. Admittedly, it is a rather small wall panel now, which is kind of disappointing.",
  desc6:"Mandy looks at the wall panel... {i:her} wall panel with pride. And it is huge! How cool is that!",
  afterMove() {
    if (!this.moveFlag) {
      this.moveFlag = true
      msg("There is now a hole in the wall, where the panel used to be.")
      w.hole_in_wall.loc = player.loc
      w.rods.loc = player.loc
      w.brackets.loc = player.loc
    }
  },
})

createItem("hole_in_wall", {
  scenery:true,
  examine:"There is a hole, a little over a metre square, in the wall, when a panel has been removed. The hole is not deep; only about the length of her hand, though it extends behind the panels to left and right. There are seven metal rods running across the back of it, and every now and again, one moves, jumping a few centimetres to the left or to the right.",
})
createItem("rods", {
  scenery:true,
  synonym:['mechanism'],
  examine:"The rods that run behind the panels are circular in cross-section and look to be made of steel. There are supports on metal brackets.",
  take:"She gives one of the rods a good tug, but it is not moving.{once:.. And then suddenly it does, jerking to the left, making her squeal in surprise. Maybe she should just leave it; it could be vital to... something?}"
})
createItem("brackets", {
  scenery:true,
  examine:"The brackets are aligned horizontally, and are almost as high as the panels. Each has ten protrusions for carrying a rod, though only the lower seven are used.",
})

tp.text_processors.hereDesc = function(arr, params) {
  const room = w[player.loc];
  let s
  if (typeof room.desc === 'string') {
    s = room.desc
  }
  else if (typeof room.desc === 'function') {
    s = room.desc()
    if (s === undefined) {
      errormsg("This room description is not set up properly. It has a 'desc' function that does not return a string. The room is \"" + room.name + "\".", true)
      return "[Bad description]"
    }
  }
  else {
    return "This is a room in dire need of a description."
  }
  if (w.hole_in_wall.loc === currentLocation.name) {
    s += " There is a panel missing in one wall; some kind of mechanism is visible."
  }
  delete params.tpFirstTime
  return processText(s, params)
}



createItem("generic_window", {
  isLocatedAt:function(loc) {
    return w[loc].windowsface !== undefined && w[loc].windowsface !== 'none'
  },
  alias:"window",
  synonyms:['windows'],
  scenery:true,
  roomsmashed:false,  // this will be the name of room where window is smashed
  examine:function() {
    const windowsface = w[player.loc].windowsface
    if (w.generic_window.roomsmashed) {
      if (player.loc === this.roomsmashed || this.noted) {
        msg("Mandy looks at the bricked-up window. No way is she getting out that way.")
      }
      else {
        msg("Mandy looks at the bricked-up window. No way is she getting out that way. Wait. The window she smashed is in {nm:room:the}. Why is this window bricked-up too?", {room:w[this.roomsmashed]})
        this.noted = true
      }
    }
    else if (windowsface === "north") {
      msg("Mandy looks out the window at the countryside; fields, trees, and there is her home, a barn conversion her parents purchased three years ago. But how could that be? No way is her home visible from this house; Highfield Lane twists around far too much for that.")
    }
    else {
      msg("Mandy looks out the window at the countryside; fields, trees, and there is her home, a barn conversion her parents purchased three years ago. But how could that be? This window faces " + windowsface + " and her home is to the north.")
    }
  },
  smash:function() {
    if (this.bricked_up) return falsemsg ("Mandy considered breaking a window again... Of course, smashing a bricked-up window is not something she is likely to be able to do.")

    msg ("{i:Fuck this,} thinks Mandy. {i:I'm getting out of here.} A little gingerly despite her resolve, Mandy knocks on the glass. Nothing happens, so she hits it hard. Smash! It shatters into thousands of pieces.")
    msg("Beyond is only blackness. For one vertiginous moment she stares into the void...")
    msg("Then suddenly a figure appears on the other side of the window. Human in shape -- more or less -- but silver-grey, as though made of stone or maybe metal, it works with blinding speed, placing brick after brick to seal up the window.")
    w.glass_shards.loc = player.loc
    this.bricked_up = true
    this.roomsmashed = player.loc
  },
  repair:function() {
    if (!this.roomsmashed) return falsemsg("The windows are not broken.")
    return falsemsg("The windows are bricked up -- a bit late to worry about repairing them.")
  },
  open:function() {
    if (this.bricked_up) return falsemsg("Mandy looks at the bricked up window. Doubtful that will open now.")
    return falsemsg("Mandy tries to open the window, but it is stuck hard. She is not going to be able to open that.") 
  },
  close:function() {
    if (this.bricked_up) return falsemsg("It is already closed. And bricked up.")
    return falsemsg("It is already closed.") 
  },
})

createItem("glass_shards", {
  pronouns:lang.pronouns.plural,
  alias:"shards of glass under the bricked-up window",
  examine:function() {
    msg("The shards are the remains of the window. Jagged pieces of glass, some as long as her arm, some almost too small to see. They seem to be reflecting the countryside outside the house somehow...")
  },
  parserPriority:-10,
  take:function(options) {
    if (w.glass_shard.loc) {
      msg("Mandy has already taken one glass shard; she decides she does not want to risk cut fingers by taking any more.")
      return false
    }
    if (!options.char.testManipulate(this, "take")) return false
    msg("Mandy carefully picks up one of the shards of glass.")
    w.glass_shard.moveToFrom(options, "name", "loc")
    return true
  },
})


// want to limit to one
createItem("glass_shard", SIZE_CHANGING(), {
  alias:"glass shard",
  sharp:true,
  desc5:"Mandy carefully looks at the shard of glass. Through it she can still see the countryside near her home. She turns it over, and there it is again, but from this side the view is reversed, as though seen through a mirror.",
  desc4:"The glass shard is so small she can hardly see it.",
  desc6:"Mandy carefully looks at the large shard of glass. Through it she can still see the countryside near her home. She turns it over, and there it is again, but from this side the view is reversed, as though seen through a mirror.",
  desc7:"Mandy carefully looks at the shard of glass, which is now bigger than the window it came from. Through it she can still see the countryside near her home. She turns it over, and there it is again, but from this side the view is reversed, as though seen through a mirror.",
  turn:function() {
    if (w.glass_shard.loc !== 'controls') return falsemsg("Mandy turns the shard of glass, hoping it looks more pretty in a better light. It does not.")
    w.telescope.shardReversed = !w.telescope.shardReversed
    msg("Mandy turns the shard on the control panel so the back is now facing her.")
  },
})



createItem("paper_funnel", SIZE_CHANGING(), CONSTRUCTION(["secret_recipe"]), {
  desc5:"It is a funnel, cunningly fashioned from a piece of card.",
  desc4:"It is a tiny funnel, cunningly fashioned from a piece of tissue paper.",
  desc4:"It is a small funnel, cunningly fashioned from a piece of paper.",
  desc6:"It is a large funnel, cunningly fashioned from a piece of thick card.",
  testConstruction:function(options) {
    if (w.secret_recipe.size > 6) return falsemsg("The card is too stiff to do origami with.")
    return true
  },
  afterConstruction:function(options) {
    this.size = w.secret_recipe.size
  },
})



