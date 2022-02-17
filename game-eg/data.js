"use strict";

  



createItem("knife",
  TAKEABLE(),
  { loc:"Buddy", sharp:false,
    examine:function(options) {
      if (this.sharp) {
        msg("A really sharp knife.");
      }
      else {
        msg("A blunt knife.");
      }
    },
    chargeResponse:function(options) {
      msg("There is a loud bang, and the knife is destroyed.")
      this.loc = false
      return false
    },
  }
)






createRoom("lounge", {
  desc:'A smelly room with an old settee and a tv. There is a tatty rug on the floor.{if:player:name:piggy_suu: This is Piggy-Suu\'s favourite room.}',
  mapColour:'silver',
  east:new Exit('kitchen'),
  west:new Exit("dining_room"),
  south:new Exit("conservatory"),
  up:new Exit("bedroom"),
  hint:"There is a lot in this room! The bricks can be picked up by number (try GET 3 BRICKS). The book can be read. The coin is stuck to the floor. There are containers too. Kyle is an NPC; you can tell him to do nearly anything the player character can do (everything except looking and talking).",
  scenery:[
    'tv',
    {alias:['old settee', 'couch', 'sofa']},
    {alias:'rug', examine:'It might have been blue at one time. Maybe.'},
  ],
});



createItem("Buddy", NPC(false), { 
  loc:"lounge",
  money:10,
  properNoun:true,
  examine:'An orangutan!',
  talkto:function() {
    const res = quest.getState('A carrot for Buddy', this)
    console.log(res)
    if (!res.status) {
      msg("'Hey, Buddy,' you say.")
      msg("'Hey yourself! Say, could you get me a carrot?'")
      quest.start('A carrot for Buddy')
    }
    else {
      msg("'Hey, Buddy,' you say.")
      msg("'Hey yourself! Where is that carrot?'")
    }
  },
  receiveItems:[
    {
      test:function() { return true },
      f:function(options) { 
        msg("{multi}Done.", options)
        options.item.loc = this.name
      }
    },
  ],
})
util.changePOV(w.Buddy)





createRoom("dining_room_on_stool", {
  desc:'Stood on a stool, in an old-fashioned room.',
  east:new Exit('lounge', {mapIgnore:true}),
  down:new Exit("dining_room", {mapIgnore:true}),
  alias:"dining room (on a stool)",
  //loc:"dining_room",
});


createRoom("hole", {
  desc:'An old-fashioned room.',
});





createItem("book", TAKEABLE(), READABLE(true), { 
  loc:"lounge",
  examine:"A leather-bound book.",
  read:function(options) {
    if (cmdRules.isHeld(null, options)) {
      if (options.char === w.Lara) {
        msg ("'Okay.' Lara spends a few minutes reading the book.");
        msg ("'I meant, read it to me.'");
        msg ("'All of it?'");
        msg ("'Quick summary.'");
        msg ("'It is all about carrots. The basic gist is that all carrots should be given to me.' You are not entirely sure you believe her.")
      }
      else {
        msg ("It is not in a language {pv:char:understand}.", options)
      }
      parser.abort()
      return true;
    }          
    else {
      return false;
    }
  },
  lookinside:"The book has pages and pages of text, but you do not even recognise the alphabet.",
  watchedStringAttribute:'yellow',
  watchedNumberAttribute:5,
})

util.addChangeListener(w.book, "watchedStringAttribute", function(o, current, previous) {
  msg("watchedStringAttribute changed from " + previous + " to " + current)
})
util.addChangeListener(w.book, "watchedNumberAttribute", function(o, current, previous) {
  msg("watchedNumberAttribute changed from " + previous + " to " + current)
}, function(o, current, previous) {
  return current > 10 && current !== previous
})



createItem("book_cover", COMPONENT("book"), { 
  examine:"The book cover is very fancy.",
  parserPriority:-20,
});


createItem("boots", WEARABLE(), {
  loc:"lounge", 
  pronouns:lang.pronouns.plural, 
  examine:"Some old boots.",
  special_att_3:'three',
})



createItem("canteen", TAKEABLE(), VESSEL(), { 
  examine:"The canteen is {ifExists:canteen:containedFluidName:full:empty}.",
  loc:"lounge",
})





createItem("glass_cabinet", CONTAINER(true), LOCKED_WITH(["cabinet_key", "small_key"]), {
  examine:"A cabinet with a glass front.",
  transparent:true,
  isLocatedAt:function(loc) { return (loc == "lounge" || loc == "dining_room") }
})


createItem("cabinet_key", KEY(), { 
  loc:"garage",
  examine: "A small brass key."
})



createItem("jewellery_box",
  TAKEABLE(),
  CONTAINER(true),
  { loc:"glass_cabinet", alias:"jewellery box", examine:"A nice box.", }
);

createItem("ring",
  TAKEABLE(),
  { loc:"jewellery_box", examine:"A ring.", }
);

createItem("cardboard_box", TAKEABLE(), CONTAINER(true), { 
  loc:"lounge",
  alias:"cardboard box",
  regex:/cardboard/,
  examine:"A big cardboard box.",
  closed:false,
});

createItem("ham_and_cheese_sandwich", EDIBLE(false), {
  pattern:'egg|mayo',
  loc:"lounge",
  afterIngest:function() { msg("That was great!"); },
})


createItem("ornate_doll", TAKEABLE(), {
  loc:"glass_cabinet", 
  alias:"ornate doll", 
  examine:"A fancy doll, eigthteenth century.",
})




createItem("coin", TAKEABLE(), {
  loc:"lounge",
  examine: "A gold coin.",
  take2:function(options) {
    return falsemsg("{pv:char:try:true} to pick up the coin, but it just will not budge.", options)
  },
  take:"{pv:char:try:true} to pick up the coin, but it just will not budge.",
})


createItem("small_key", KEY(), { 
  loc:"lounge", examine: "A small key.", alias: "small key",
})


createItem("flashlight", TAKEABLE(), SWITCHABLE(false, 'providing light'), {
  loc:"lounge",
  examine:"A small red torch.",
  regex:/^torch$/, 
  lightSource:function() {
    return this.switchedon ? world.LIGHT_FULL : world.LIGHT_NONE
  },
  eventPeriod:1,
  eventIsActive:function() {
    return this.switchedon
  },
  eventScript:function() {
    this.power--;
    if (this.power === 2) {
      msg("The torch flickers.")
    }
    if (this.power < 0) {
      msg("The torch flickers and dies.{once: Perhaps there is a charger in the garage?}");
      this.doSwitchoff()
    }
  },
  testSwitchOn () {
    if (this.power < 0) {
      msg("The torch is dead.")
      return false
    }
    return true
  },
  power:2,
  chargeResponse:function(options) {
    msg("{nv:char:push:true} the button. There is a brief hum of power, and a flash.", options)
    w.flashlight.power = 20
    return true
  },
})






createRoom("dining_room", {
  desc:'An old-fashioned room.',
  east:new Exit('lounge'),
  west:new Exit('lift'),
  up:new Exit("dining_room_on_stool", {mapIgnore:true}),
  alias:"dining room",
  hint:"This room features an NPC who will sometimes do as you ask. Compliment her, and she will go to another room, and with then pick things up and drop them (but not bricks). Also not that the glass cabinet is in this room as well as the lounge.",
});


createItem("lift_item", { 
  alias:'lift',
  loc:"dining_room",
  examine:"An old-fashioned lift.",
  scenery:true,
  goInDirection:'west',
})

createItem("chair", FURNITURE({sit:true}), {
  loc:"dining_room", examine:"A wooden chair.",
  afterPostureOn:function(options) {
    msg("The chair makes a strange noise when {nv:char:sit} on it.", options)
  },
})



createRoom("lift", TRANSIT("east"), {
  desc:'A curious lift.',
  east:new Exit('dining_room'),
  transitMenuPrompt:'Where do you want to go?',
})


// calling it button_0 make it appear before button_1 in lists
createItem("button_0",
  TRANSIT_BUTTON("lift"),
  {
    alias:"Button: G",
    examine:"A button with the letter G on it.",
    scenery:true,
    transitDest:"dining_room",
    transitDestAlias:"Ground Floor",
    transitAlreadyHere:"You're already there mate!",
    transitGoToDest:"The old man presses the button....",
    
  }
);

createItem("button_1",
  TRANSIT_BUTTON("lift"),
  {
    alias:"Button: 1",
    examine:"A button with the letter 1 on it.",
    transitDest:"bedroom",
    scenery:true,
    transitDestAlias:"The Bedroom",
    transitAlreadyHere:"You press the button; nothing happens.",
    transitGoToDest:"You press the button; the door closes and the lift heads to the first floor. The door opens again.",
    
  }
);

createItem("button_2",
  TRANSIT_BUTTON("lift"),
  {
    alias:"Button: 2",
    examine:"A button with the letter 2 on it.",
    transitDest:"attic",
    scenery:true,
    transitDestAlias:"The Attic",
    locked:true,
    transitAlreadyHere:"You press the button; nothing happens.",
    transitGoToDest:"You press the button; the door closes and the lift heads to the second floor. The door opens again.",
    transitLocked:"That does nothing, the button does not work.",
  }
);





createRoom("attic", {
  desc:'An spooky attic.',
  west:new Exit('lift'),
});





createRoom("kitchen", {
  desc:'A clean room{if:clock:scenery:, a clock hanging on the wall}. There is a sink in the corner.',
  west:new Exit("lounge"),
  down:new Exit('basement', {
    isHidden:function() { return w.trapdoor.closed; },
    msg:"You go through the trapdoor, and down the ladder.",
    npcLeaveMsg:function(char) {
      msg("{nv:char:disappear:true} through the trapdoor.", {char:char});
    },
    npcEnterMsg:function(char) {
      msg("{nv:char:come:true} through the trapdoor, and {cj:char:climb} down the ladder to join you in the basement.", {char:char});
    },
  }),
  north:new Exit("garage"),
  afterFirstEnter:function() {
    msg("A fresh smell here!");
  },
  hint:"This room features two doors that open and close. The garage door needs a key.",
  source:"water",
})

createItem("clock", TAKEABLE(), {
  loc:"kitchen", 
  scenery:true, 
  examine:"A white clock.",
})

createItem("trapdoor", OPENABLE(false), {
  loc:"kitchen",
  examine:"A small trapdoor in the floor.",
  goThroughDirection:'down',
})

createItem("camera", TAKEABLE(), {
  loc:"kitchen", 
  examine:"A cheap digital camera.",
  regex:/^picture box$/,
})

createItem("big_kitchen_table", SURFACE(), {
  loc:"kitchen",
  examine: "A Formica table.",
})

createItem("jug", TAKEABLE(), VESSEL(), {
  loc:"big_kitchen_table",
  examine:"A small jug, stripped blue and white.",
})

createItem("honey_pot", {
  scenery:true,
  examine:"A pot of honey.",
})

createItem("kitchen_sink", {
  loc:"kitchen",
  scenery:true, 
  examine:"A dirty sink.",
  isSourceOf:function(fluid) {
    return fluid === "water" 
  },
  sink:function(fluid, char, vessel) {
    msg("{nv:char:empty:true} {nm:item:the} into the dirty sink.", {char:char, item:vessel} )
  },
})








createRoom("basement", {
  desc:"A dank room, with piles of crates everywhere.",
  darkDesc:"It is dark, but you can just see the outline of the trapdoor above you.",
  up:new Exit('kitchen', {isHidden:function() { return false; } }),
  lightSource:function() {
    return w.light_switch.switchedon ? world.LIGHT_FULL : world.LIGHT_NONE;
  },
  hint:"The basement illustrates light and dark. There is a torch in the lounge that may be useful.",
})

createItem("light_switch", SWITCHABLE(false), {
  loc:"basement", 
  examine:"A switch, presumably for the light.", 
  alias:"light switch",
  testSwitchOn:function() {
    if (!w.crates.moved) {
      msg("You cannot reach the light switch, without first moving the crates.");
      return false;
    }
    else {
      return true;
    }
  }
})


createItem("ladder", {
  loc:"basement",
  examine:"A ladder, fixed to the wall, leading to the trapdoor.",
  goUpDirection:'up',
})
createItem("crates", {
  loc:"basement",
  examine:"A bunch of old crates.",
  move:function() {
    msg("You move the crates, so the light switch is accessible.");
    this.moved = true;
    return true;
  }
})





createRoom("garage", {
  desc:'An empty garage.',
  south:new Exit("kitchen"),
  hint:"The garage features a complex mechanism, with two components.",
});

createItem("garage_door", LOCKED_DOOR("garage_key", "kitchen", "garage"), {
  examine: "The door to the garage.",
});

createItem("garage_key", KEY(), {
  loc:"lounge",
  examine: "A big key.",
});


createItem("charger", {
  loc:"garage", 
  examine: "A device bigger than a washing machine to charge a torch? It has a compartment and a button. {charger_state}.", 
  mended:false,
  use:function() {
    metamsg("To use the charge, you need to put the torch in the compartment and press the button.");
  }
})


createItem("charger_compartment", COMPONENT("charger"), CONTAINER(true), {
  alias:"compartment",
  examine:"The compartment is just the right size for the torch. It is {if:charger_compartment:closed:closed:open}.",
  testDropIn:function() {
    const contents = w.charger_compartment.getContents(world.LOOK)
    if (contents.length > 0) {
      msg("The compartment is full.")
      return false
    }
    return true
  },
})



createItem("charger_button", COMPONENT("charger"), BUTTON(), {
  examine:"A big red button.",
  alias:"button",
  push:function(options) {
    const contents = w.charger_compartment.getContents(world.ALL)[0]
    if (!w.charger_compartment.closed || !contents) return falsemsg("{pv:char:push:true} the button, but nothing happens.", options)
    if (!contents.chargeResponse) return falsemsg("{pv:char:push:true} the button. There is a brief hum of power, but nothing happens.", options)
    return contents.chargeResponse(options)
  }
})






createRoom("bedroom", {
  desc:"A large room, with a big bed and a wardrobe.",
  down:new Exit("lounge"),
  in:new Exit("wardrobe"),
  west:new Exit('lift'),
  hint:"The bedroom has a variety of garments that can be put on - in the right order.",
})

createItem("wardrobe", DEFAULT_ROOM, {
  out:new Exit("bedroom"),
  loc:"bedroom",
  examine:"It is so big you could probably get inside it.",
  desc:"Oddly empty of fantasy worlds.",
})

createItem("bed", FURNITURE({sit:true, recline:true}), {
  loc:"bedroom",
  scenery:true,
  examine:"What would a bedroom be without a bed?",
})


createItem("underwear", 
  WEARABLE(1, ["lower"]),
  { 
    loc:"bedroom",
    pronouns:lang.pronouns.massnoun,
    examine:"Clean!",
  }
);

createItem("jeans", 
  WEARABLE(2, ["lower"]),
  { loc:"bedroom", pronouns:lang.pronouns.plural, examine:"Clean!", }
);

createItem("shirt", 
  WEARABLE(2, ["upper"]),
  { loc:"bedroom", examine:"Clean!", }
);

createItem("coat", 
  WEARABLE(3, ["upper"]),
  { loc:"bedroom", examine:"Clean!", }
);

createItem("jumpsuit", 
  WEARABLE(2, ["upper", "lower"]),
  { loc:"bedroom", examine:"Clean!", }
);






createItem("suit_trousers", 
  WEARABLE(2, ["lower"]),
  { loc:"wardrobe", examine:"The trousers.", pronouns:lang.pronouns.plural}
);

createItem("jacket", 
  WEARABLE(3, ["upper"]),
  { loc:"wardrobe", examine:"The jacket", }
);

createItem("waistcoat", 
  WEARABLE(2, ["upper"]),
  { loc:"wardrobe", examine:"The waistcoat", }
);

createEnsemble("suit", [w.suit_trousers, w.jacket, w.waistcoat],
  { examine:"A complete suit.", regex:/xyz/}
);



createRoom("conservatory", {
  desc:"A light airy room.",
  north:new Exit("lounge"),
  west:new Exit("garden"),
  hint:"The conservatory features a pro-active NPC.",
});


createItem("crate", FURNITURE({stand:true}), SHIFTABLE(), {
  loc:"conservatory", 
  examine:"A large wooden crate, probably strong enough to stand on.",
})

createItem("broken_chair", { 
  loc:"conservatory", 
  examine:"A broken chair.",
  attachable:true,
})

createItem("rope", ROPE(3), { 
  loc:"conservatory",
  examine:"The rope is about 40' long.",
})



createRoom("garden", {
  desc:"Very overgrown. The garden opens onto a road to the west, whilst the conservatory is east. There is a hook on the wall.",
  mapColour:'green',
  east:new Exit("conservatory"),
  west:new Exit("road"),
  visibleFrom:["dining_room"],
  visibleFromPrefix:"Through the window you can see",
})

createItem("hook", { 
  loc:"garden", 
  scenery:true,
  examine:"A rusty hook, on the wall of the house.",
  attachable:true,
})

createRoom("far_away", {
  north:new Exit("lounge"),
});



createItem("Arthur",
  NPC(false),
  { 
    loc:"garden",
    examine:function() {
      if (this.suspended) {
        msg("Arthur is asleep.");
      }
      else {
        msg("Arthur is awake.");
      }
    },
    suspended:true,
    properNoun:true,
    agenda:[
      "text:Arthur stands up and stretches.", 
      "text:'I'm going to find Lara, and show her the garden,' says Arthur.:'Whatever!'", 
      "walkTo:Lara:'Hi, Lara,' says Arthur. 'Come look at the garden.'",
      "joinedBy:Lara:'Sure,' says Lara.",
      "walkTo:garden:inTheGardenWithLara:'Look at all the beautiful flowers,' says Arthur.:Through the window you see Arthur say something to Lara.",
      "run:inTheGardenWithLara:Lara smells the flowers.:You notice Lara is smelling the flowers in the garden.",
      "walkTo:conservatory",
      "walkTo:garden",
    ],
    inTheGardenWithLara:function(arr) {
      if (this.isHere()) {
        msg(arr[0]);
      }
      if (player.loc === "dining_room") {
        msg(arr[1]);
      }
    },
    talkto:function() {
      msg("'Hey, wake up,' you say to Arthur.");
      this.suspended = false;
      this.pause();
      this.multiMsg([
        "'What?' he says, opening his eyes. 'Oh, it's you.'",
        "'I am awake!'",
        false,
        "'Stop it!'",
      ])
      return true;
    }
  }
);





createItem("ball", {
  //loc:"Kyle",
  examine:"Some old boots.",
});



createItem("Kyle", NPC(false),
{ 
  loc:"lounge",
  //alias:'Bobby',
  examine:"A grizzly bear. But cute.",
  receiveItems:[
    {
      item:w.book, 
      f:function() { 
        msg("'Oh!' says Kyle. 'Is this a book?'")
        w.book.loc = this.name
        return true
      }
    },
    {
      test:function() { return true },
      f:function(options) { 
        msg("{multi}Done.", options)
        options.item.loc = this.name
        return true
      }
    },
  ],
  askOptions:[
    {
      test:function(p) { return p.text.match(/kyle|himself/); }, 
      script:function() { msg("'Oh!' says Kyle. 'I suppose I would say: " + this.examine + "'") },
    },
    {
      name:'House',
      test:function(p) { return p.text.match(/house/); }, 
      msg:"'I like it,' says Kyle.",
    },
    {
      name:'Garden',
      test:function(p) { return p.text.match(/garden/) },
      responses:[
        {
          test:function(p) { return w.garden.fixed; },
          msg:"'Looks much better now,' Kyle says with a grin.",
        },
        {
          test:function(p) { return w.Kyle.needsWorkCount === 0; },
          msg:"'Needs some work,' Kyle says with a sign.",
          script:function(p) { w.Kyle.needsWorkCount++; },
        },
        {
          msg:"'I'm giving up hope of it ever getting sorted,' Kyle says.",
        },
      ],
    },
    {
      test:function(p) { return p.text.match(/park/) },
      responses:[
        {
          name:'Park',
          mentions:['Swings'],
          msg:"'Going to the park sounds like fun,' Kyle says with a grin. 'We can go on the swings!'",
        },
      ],
    },
    {
      name:'Fountain',
      test:function(p) { return p.text.match(/fountain/) && p.char.specialFlag },
      msg:"'The fountain does not work.'",
    },
    {
      name:'Swings',
      silent:true,
      test:function(p) { return p.text.match(/swing/) },
      msg:"'The swings are fun!'",
    },
    {
      msg:"Kyle has no interest in that subject.",
      failed:true,
    },
  ],
  needsWorkCount:0,
  talkto2:function() {
    switch (this.talkto_count) {
      case 0 : msg("You say 'Hello,' to Kyle, and he replies in kind."); break;
      case 1 : msg("You ask Kyle how to get upstairs. 'You know,' he replies, 'I have no idea.'"); break;
      case 2 : msg("'Where do you sleep?' you ask Kyle."); msg("'What's \"sleep\"?'"); break;
      default: msg("You wonder what you can talk to Kyle about."); break;
    }
    this.pause();
    return true;
  },
  
  convTopics:[
    {
      showTopic:true,
      alias:"What's the deal with the garden?",
      nowShow:["Seriously, what's the deal with the garden?"],
      script:function() {
        msg("You ask Kyle about the garden, but he's not talking.")
      },
    },
    {
      alias:"Seriously, what's the deal with the garden?",
      msg:"You ask Kyle about the garden, but he's STILL not talking.",
    },
    {
      showTopic:true,
      alias:"The weather",
      script:function() {
        msg("You talk to " + this.alias + " about the weather; he asks your opinion...")
        this.askTopics("Tell Kyle your view on the weather...", w.kyle_response_good, w.kyle_response_bad)
      },
    },
    {
      alias:"The weather is good",
      name:'kyle_response_good',
      script:function() {
        msg("You tell Kyle you think the weather is good.")
      },
    },
    {
      alias:"The weather is bad",
      name:'kyle_response_bad',
      script:function() {
        msg("You tell " + this.alias + " the weather is bad; he shakes his head sadly.")
      },
    },
    {
      alias:"Lead me to the garden",
      showTopic:true,
      name:'kyle_to_garden',
      script:function() {
        msg("'Can you show me where the garden is?'")
        msg("'No problem,' says Kyle.")
        w.Kyle.agenda = [
          "leadTo:garden",
          "waitFor:player:'So here we are,' says Kyle.",
        ]
      },
    },
  ],

  
});


createItem("kyle_question", QUESTION(), {
  responses:[
    {
      regex:/^(yes)$/,
      response:function() {
        msg("'Oh, cool,' says Kyle.");
      }
    },
    {
      regex:/^(no)$/,
      response:function() {
        msg("'Oh, well, Lara, this is Tester, he or she is testing Quest 6,' says Kyle.");
      }
    },
    {
      response:function() {
        msg("'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'");
        w.Kyle.askQuestion("kyle_question");
      }
    },
  ],
});  
  

createItem("straw_boater",
  WEARABLE(false),
  { loc:"Kyle", examine: "A straw boater.", worn:true }
);







createItem("Lara", NPC(true), {
  loc:"dining_room", 
  examine:"A normal-sized bunny.",
  properNoun:true, 
  happy:false,
  receiveItemsFailMsg:"'That's not a carrot,' Lara points out.",
  receiveItems:[
    {
      item:w.knife, 
      f:function() { 
        msg("'A knife?' says Lara. 'I guess I could use that... for something?'")
        w.knife.loc = this.name
      }
    },
    {
      test:function(options) {
        return options.item.name.startsWith('carrot')
      },
      f:function(options) { 
        msg("'A carrot!' says Lara with delight, before stuffing it in her mouth. 'So, do you have any more?'")
        delete options.item.loc
      }
    },
    {
      item:w.ring,
      f:function(options) { 
        msg("'Oh, my,' says Lara. 'How delightful.' She slips the ring on her finger, then hands you a key.")
        w.ring.loc = "Lara"
        w.ring.worn = true
        w.garage_key.loc = options.char.name
      }
    },
    {
      item:w.book,
      f:function(options) { 
        msg("'Hmm, a book about carrots,' says Lara. 'Thanks.'")
        w.book.loc = "Lara"
      }
    },
  ],
  getAgreementTake:function(item) {
    if (item === w.brick) {
      msg("'I'm not picking up any bricks,' says Lara indignantly.")
      return false
    }
    return true
  },
  getAgreementGo:function(ex) {
    if (!this.happy) {
      msg("'I'm not going " + ex.dir + ",' says Lara indignantly. 'I don't like that room.'")
      return false
    }
    return true
  },
  getAgreementDrop:function() {
    return true
  },
  getAgreementRead:function() {
    return true
  },
  getAgreementPosture:function() {
    if (!this.happy) {
      msg("'I don't think so!' says Lara indignantly.")
      return false
    }
    return true
  },
  getAgreementDefault() {
    msg("'I'm not doing that!' says Lara indignantly.")
    return false
  },
  testTalkPlayer:function() { return true; },
  
  sayPriority:3,
  sayResponses:[
    {
      regex:/^(hi|hello)$/,
      id:"hello",
      response:function() {
        msg("'Oh, hello there,' replies Lara.")
        if (w.Kyle.isHere()) {
          msg("'Have you two met before?' asks Kyle.")
          w.Kyle.askQuestion("kyle_question")
        }
      },
    }
  ],
  greeting: function() {
    if (this.talkto_count === 0) {
      msg("'Hello,' says Lara.");
    } else {
      msg("'You again?' says Lara.");
    }
  }  
})

createItem("Lara_garage_key",
  TOPIC(true),
  { loc:"Lara", alias:"Can I have the garden key?",
    script:function() {
      msg("You ask Lara about the garage key; she agrees to give it to you if you give her a ring. Perhaps there is one in the glass cabinet?");
    },
  }
);


createItem("Lara_very_attractive",
  TOPIC(true),
  { loc:"Lara", alias:"You're very attractive",
    script:function() {
      msg("You tell Lara she looks very attractive. 'Why thank you!' she replies, smiling at last.");
      w.Lara.happy = true;
    },
  }
);

createItem("Lara_carrots",
  TOPIC(true),
  { loc:"Lara", alias:"I hear you like carrots",
    script:function() {
      msg("'Need carrots!' she says with feeling. 'Fading away bunny!' She looks mournfully at her ample tummy.");
      w.Lara.happy = true;
    },
  }
);



createItem("walls", {
  examine:"They're walls, what are you expecting?",
  regex:/^wall$/,
  scenery:true,
  isLocatedAt:function(loc) { return w[loc].room },
})


createItem("brick", COUNTABLE({lounge:7, dining_room:1}), {
  examine:"A brick is a brick.",
  //regex:/^(\d+ )?bricks?$/,
})


createRoom("shop", {
  desc:"A funny little shop.",
  south:new Exit("road"),
  willBuy:function(obj) {
    return (obj === w.trophy);
  }
});

createRoom("road", {
  desc:"A road heading west over a bridge. You can see a shop to the north.",
  east:new Exit("garden"),
  west:new Exit("bridge"),
  north:new Exit("shop"),
});

createItem("carrot", TAKEABLE(), MERCH(2, ["shop"]), {
  examine:"It's a carrot!",
  slice:function(options) {
    if (options.with === undefined) {
      if (w.knife.loc !== player.name) {
        return falsemsg("Going to need a knife to do that.")
      }
    }
    else if (options.with !== w.knife) {
      return falsemsg("You can't cut a carrot with {nm:with:the}.", {with:options.with})
    }
    // do stuff
    msg('Done.')
    return true
  },
})

createItem("honey_pasta",  TAKEABLE(), MERCH(5, ["shop"]),{
  examine:"It's pasta. With honey on it.",
});

createItem("trophy",  TAKEABLE(), MERCH(15, "shop"),{
  examine:"It is a unique trophy!",
  doNotClone:true,
});









createItem("cactus", ZONE_FEATURE('desert', 1, -2, 3), {
  featureLook:"There is a big cactus to the #.",
  zoneColour:'green',
  zoneMapName:'Strange cactus',
  examine:"Prickly!",
});

createItem("tower", ZONE_FEATURE('desert', -1, 3, 4), {
  featureLook:"There is a tower to the #.",
  featureLookHere:"There is a tall stone tower here.",
  zoneMapName:'Ancient tower',
  examine:"The tower looks ancient, but in a fair state of repair. It is about four storeys high.",
});



createItem("barrier", ZONE_BORDER('desert'), {
  examine:"It is invisible!",
  scenery:true,
  border:function(x, y) {
    return (x * x + y * y > 55)
  },
  borderMsg:"You try to head #, but hit an invisible barrier.",
  borderDesc:"The air seems to kind of shimmer.",
});

createItem("canyon", ZONE_BORDER('desert'), {
  examine:"It looks very deep!",
  scenery:true,
  border:function(x, y) {
    return (x - y > 5)
  },
  //borderMsg:"You cannot go #, the canyon is too wide to jump and too steep to climb.",
  borderDesc:"There is a deep canyon southeast of you, running from the southwest to the northeast.",
});



createRoom("desert", ZONE(), {
  zoneExits:[
    {x:-1, y:3, dir:'in', dest:'inside_tower', msg:'You step inside the tower, and climb the step, spiral staircase to the top.'},
    {x:5, y:0, dir:'east', dest:'bridge', msg:'You start across the bridge.'},
  ],
  zoneDescs:[
    {
      x:5, y:0,
      desc: 'You are standing on a road heading west through a desert, and east over a bridge.'
    },
    {
      when:function(x, y) { return y === 0 },
      desc:'You are standing on a road running east to west through a desert.',
    },
    {
      when:function(x, y) { return y > 0 },
      desc:'You are standing in the desert, north of the road.',
    },
    {
      desc:'You are standing in the desert, south of the road.',
    },
  ],
  size:8,
  outsideColour:'transparent',  // Locations the player cannot access
  mapBorder:false,              // Hide the map border
  featureColour:'blue',         // Default colour for features
  playerColour:'black',         // Colour of the player
  cellSize:20,                  // The size of each location, if less than 10 the player will disappear!
  mapFont:'italic 10px serif',   // Style of the labels for features
  mapCells:[
    '<rect x="0" y="162" width="336" height="16" stroke="none" fill="#999"/>'
  ],
})



createItem("silver_coin", TAKEABLE(), ZONE_ITEM('desert', 1, 1), {
  examine:"A curious silver coin; you do not recognise it. It says it is worth two dollars.",
})





createRoom("bridge", {
  desc:'From the bridge you can just how deep the canyon is.',
  west:new Exit('desert'),
  east:new Exit('road'),
  beforeEnter:function() {
    player.positionX = 5
    player.positionY = 0
  },
})

createRoom("inside_tower", {
  desc:"A tower, looking out over the desert. To the south is the road, heading east back to your house. To the north is a magic portal, going who knows where.",
  down:new Exit("desert"),
  north:new Exit("shop"),
  alias:'Inside the tower',
  properNoun:true,
  beforeEnter:function() {
    player.positionX = -1
    player.positionY = 3
  },
})



createItem("piggy_suu", NPC(true), { 
  loc:"bridge",
  alias:'Piggy-suu',
  money:10,
  examine:'Piggy-suu is a pig.',
  receiveItems:[
    {
      test:function() { return true },
      f:function(options) { 
        msg(lang.done_msg, options)
        options.item.loc = this.name
        return true
      }
    },
  ],
})

createItem("Boris", NPC(), { 
})


createItem("timetable", AGENDA_FOLLOWER(), {
  counter:0,
  script:function(n) {
    this.counter += (n[0] ? parseInt(n[0]) : 1) 
  },
  check:function() { return this.flag },
})

