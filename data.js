"use strict";


commands.push(new Cmd('Kick', {
  npcCmd:true,
  rules:[cmdRules.isNotWithOtherCharRule, cmdRules.isHereRule],
  regex:/^(kick) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isPresent}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(this, isMultiple) + pronounVerb(char, "kick", true) + " " + this.pronouns.objective + ", but nothing happens.");
    return false;
  },
}));



commands.push(new Cmd('Charge', {
  npcCmd:true,
  rules:[cmdRules.isNotWithOtherCharRule, cmdRules.isHeld],
  regex:/^(charge) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isHeld}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(item, isMultiple) + pronounVerb(item, "'be", true) + " not something you can charge.");
    return false;
  },
}));


commands.push(new Cmd('Move', {
  npcCmd:true,
  rules:[cmdRules.isNotWithOtherCharRule, cmdRules.isHereRule],
  regex:/^(move) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isHere}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(item, isMultiple) + pronounVerb(item, "'be", true) + " not something you can move.");
    return false;
  },
}));




  
createItem("me",
  PLAYER,
  { loc:"lounge", regex:/^me|myself|player$/, examine:function() {
    msg("A " + (this.isFemale ? "chick" : "guy") + " called " + this.alias);
    },
  }
);

createItem("knife",
  TAKEABLE(),
  { loc:"me", sharp:false,
    examine:function() {
      if (this.sharp) {
        msg("A really sharp knife.");
      }
      else {
        msg("A blunt knife.");
      }
    },
    chargeResponse:function(participant) {
      msg("There is a loud bang, and the knife is destroyed.");
      this.display = DSPY_DELETED;
      return false;
    },
  }
);






createRoom("lounge", {
  desc:'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
  east:'kitchen',
  west:"dining_room",
});





createRoom("dining_room_on_stool", {
  desc:'Stod on a stool, in an old-fashioned room.',
  east:'lounge',
  down:"dining_room",
  alias:"dining room (on a stool)",
  loc:"dining_room",
});


createRoom("hole", {
  desc:'An old-fashioned room.',
});





createItem("book", 
  TAKEABLE(),
  { loc:"lounge", examine:"A leather-bound book.", heldVerbsX:["Read"], read:function(isMultiple, char) {
    if (cmdRules.isHeldRule(char, this, isMultiple)) {
      msg (prefix(this, isMultiple) + "It is not in a language " + pronounVerb(char, "understand") + ".");
      return true;
    }          
    else {
      return false;
    }
  }}
);



createItem("book_cover",
  COMPONENT("book"),
  { examine:"The book cover is very fancy.", }
);


createItem("boots", 
  WEARABLE(),
  { loc:"lounge", pronouns:PRONOUNS.plural, examine:"Some old boots.", }
);






createItem("glass_cabinet",
  CONTAINER(false),
  LOCKED_WITH("cabinet_key"),
  { loc:"lounge", alias:"glass cabinet", examine:"A cabinet with a glass front.", transparent:true, altLocs:["dining_room"]}
);

createItem("jewellery_box",
  TAKEABLE(),
  CONTAINER(true),
  { loc:"glass_cabinet", alias:"jewellery box", examine:"A nice box.", }
);

createItem("ring",
  TAKEABLE(),
  { loc:"jewellery_box", examine:"A ring.", }
);

createItem("cardboard_box",
  CONTAINER(false),
  { loc:"lounge", alias:"cardboard box", examine:"A big cardboard box.", closed:false, }
);


createItem("ornate_doll",
  TAKEABLE(),
  { loc:"glass_cabinet", alias:"ornate doll", examine:"A fancy doll, eighteenth century." }
);




createItem("coin",
  TAKEABLE(),
  { loc:"lounge", examine: "A gold coin.", take:function(isMultiple, participant) {
    msg(prefix(this, isMultiple) + pronounVerb(participant, "try", true) + " to pick up the coin, but it just will not budge.");
    return false;
  },}
);


createItem("cabinet_key",
  TAKEABLE(),
  { loc:"lounge", examine: "A small key.", alias: "small key"  }
);


createItem("flashlight",
  TAKEABLE(),
  SWITCHABLE(false),
  { loc:"lounge", examine:"A small black torch.", regex:/^torch$/, 
    byname:function(def, modified){
      var res = this.alias;
      if (options.article) { res = options.article + " " + this.alias; }
      if (this.switchedon && options.modified) { res += " (providing light)"; }
      return res;
    },
    lightSource:function() {
      return this.switchedon ? LIGHT_FULL : LIGHT_NONE;
    },
    runTurnscript:function() {
      return this.switchedon;
    },
    turnscript:function() {
      this.power--;
      if (this.power === 2) {
        msg("The torch flickers.");
      }
      if (this.power < 0) {
        msg("The torch flickers and dies.{once: Perhaps there is a charger in the garage?}");
        this.doSwitchoff();
      }
    },
    checkCanSwitchOn () {
      if (this.power < 0) {
        msg("The torch is dead.");
        return false;
      }
      return true;
    },
    power:2,
    chargeResponse:function(participant) {
      msg(pronounVerb(participant, "push", true) + " the button. There is a brief hum of power, and a flash.");
      w.flashlight.power = 20;;
      return true;
    },
    
  },
);






createRoom("dining_room", {
  desc:'An old-fashioned room.',
  east:'lounge',
  up:"dining_room_on_stool",
  alias:"dining room",
});






createRoom("kitchen", {
  desc:'A clean room.',
  west:"lounge",
  down:new Exit('basement', {isHidden:function() { return w.trapdoor.closed; }, msg:function(isMultiple, char) {
    if (char === game.player) {
      msg("You go through the trapdoor, and down the ladder.");
    } else {
      msg("You watch " + char.byname({article:"the"}) + " disappear through the trapdoor.");
    }
  }}),
  north:new Exit("garage", {use:useWithDoor, door:"garage_door", doorName:"garage door"},),
  afterEnterFirst:function() {
    msg("A fresh smell here!");
  }
});

createItem("trapdoor",
  OPENABLE(false),
  { loc:"kitchen", examine:"A small trapdoor in the floor.", }
);

createItem("camera",
  TAKEABLE(),
  { loc:"kitchen", examine:"A cheap digital camera.", regex:/^picture box$/ }
);

createItem("big_kitchen_table",
  SURFACE(),
  { loc:"kitchen", examine: "A Formica table."  }
);

createItem("garage_door",
  OPENABLE(false),
  LOCKED_WITH("garage_key"),
  { loc:"kitchen", examine: "The door to the garage.", alias: "garage door", altLocs:["garage"] }
);







createRoom("basement", {
  desc:"A dank room, with piles of crates everywhere.",
  darkDesc:"It is dark, but you can just see the outline of the trapdoor above you.",
  up:new Exit('kitchen', {isHidden:function() { return false; } }),
  lightSource:function() {
    return w.light_switch.switchedon ? LIGHT_FULL : LIGHT_NONE;
  }
});

createItem("light_switch",
  SWITCHABLE(false),
  { loc:"basement", examine:"A switch, presumably for the light.", alias:"light switch",
    checkCanSwitchOn:function() {
      if (!w.crates.moved) {
        msg("You cannot reach the light switch, without first moving the crates.");
        return false;
      }
      else {
        return true;
      }
    }
  },
);


createItem("crates", 
  { loc:"basement", examine:"A bunch of old crates.",
    move:function() {
      msg("You move the crates, so the light switch is accessible.");
      this.moved = true;
      return true;
    }
  }
  
);





createRoom("garage", {
  desc:'An empty garage.',
  south:new Exit("kitchen", {use:useWithDoor, door:"garage_door", doorName:"kitchen door"},),
});

createItem("charger",
  { loc:"garage", examine: "A device bigger than a washing machine to charge a torch? It has a compartment and a button. {charger_state}.", mended:false,
    use:function() {
      metamsg("To use the charge, you need to put the torch in the compartment and press the button.");
    }
  }
);

createItem("charger_compartment",
  COMPONENT("charger"),
  CONTAINER(false),
  { alias:"compartment", examine:"The compartment is just the right size for the torch. It is {if:charger_compartment:closed:closed:open}.", 
    testRestrictions:function(item) {
      var contents = w.charger_compartment.getContents();
      if (contents.length > 0) {
        msg("The compartment is full.");
        return false;
      }
      return true;
    },
  }
);

createItem("charger_button",
  COMPONENT("charger"),
  { examine:"A big red button.", alias:"button",
    push:function(isMultiple, participant) {
      var contents = w.charger_compartment.getContents()[0];
      if (!w.charger_compartment.closed || !contents) {
        msg(pronounVerb(participant, "push", true) + " the button, but nothing happens.");
        return false;
      }
      else if (!contents.chargeResponse) {
        msg(pronounVerb(participant, "push", true) + " the button. There is a brief hum of power, but nothing happens.");
        return false;
      }
      else {
        return contents.chargeResponse(participant);
      }
    }
  }
);






createItem("Kyle",
  NPC(false),
  { loc:"lounge", examine:"A grizzly bear. But cute.", properName:true,
    askoptions:[
      {regex:/house/, response:"'I like it,' says Kyle.", },
      {regex:/garden/, response:"'Needs some work,' Kyle says with a sign.", },
    ],
    speakto:function() {
      switch (this.speaktoCount) {
        case 0 : msg("You say 'Hello,' to Kyle, and she replies in kind."); break;
        case 1 : msg("You ask Kyle how to get upstairs. 'You know,' she replies, 'I have no idea.'"); break;
        case 2 : msg("'Where do you sleep?' you ask Kyle."); msg("'What's \"sleep\"?'"); break;
        default: msg("You wonder what you can talk to Kyle about."); break;
      }
    },
  }
);

createItem("straw_boater",
  WEARABLE(false),
  { loc:"Kyle", examine: "A straw boater.", worn:true }
);

createItem("Kyle_The_Garden",
  TOPIC(true),
  { loc:"Kyle", alias:"What's the deal with the garden?", nowShow:["Mary_The_Garden_Again"],
    script:function() {
      msg("You ask Kyle about the garden, but he's not talking.");
    },
  }
);

createItem("Kyle_The_Garden_Again",
  TOPIC(false),
  { loc:"Kyle", alias:"Seriously, what's the deal with the garden?",
    script:function() {
      msg("You ask Kyle about the garden, but he's STILL not talking.");
    },
  }
);

createItem("Kyle_The_Weather",
  TOPIC(true),
  { loc:"Kyle", alias:"The weather",
    script:function() {
      msg("You talk to Kyle about the weather.");
    },
  }
);





createItem("Lara",
  NPC(true),
  { loc:"dining_room", examine:"A normal-sized bunny.", properName:true,
    giveReaction:function(item, multiple, char) {
      if (item === w.ring) {
        msg("'Oh, my,' says Lara. 'How delightful.' She slips the ring on her finger, then hands you a key.");
        w.ring.loc = "Lara";
        w.ring.worn = true;
        w.garage_key.loc = char.name;
      }
      else {
        msg("'Why would I want {i:that}?'");
      }
    },
  }
);

createItem("garage_key",
  TAKEABLE(),
  { loc:"lounge", examine: "A big key.", alias: "garage key"  }
);

createItem("Lara_garage_key",
  TOPIC(true),
  { loc:"Lara", alias:"Can I have the garden key?",
    script:function() {
      msg("You ask May about the garage key; she agrees to give it to you if you give her a ring. Perhaps there is one in the glass cabinet?");
    },
  }
);



createItem("walls",
  { examine:"They're walls, what are you expecting?", regex:/^wall$/, display:DSPY_SCENERY,
    isAtLoc:function(loc) { return true; }
  }
);


createItem("brick",
  COUNTABLE({lounge:7, kitchen:1}),
    { examine:"A brick is a brick.", }
);

createItem("TS_Test",
  TURNSCRIPT(true, function(self) {
    msg('Turn script!');
    this.count++;
  }), {count:0},
);


tp.addDirective("charger_state", function(){
  if (w.charger_compartment.closed) {
    return "The compartment is closed";
  }
  var contents = w.charger_compartment.getContents();
  if (contents.length === 0) {
    return "The compartment is empty";
  }
  return "The compartment contains " + formatList(contents, {article:"a"});
});
