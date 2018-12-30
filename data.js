"use strict";


commands.push(new Cmd('Kick', {
  regex:/^(kick) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isPresent}
  ]
}));

DEFAULT_ITEM.kick = function(isMultiple) {
  msg(prefix(this, isMultiple) + "You kick " + this.pronouns.objective + ", but nothing happens.");
  return false;
}



commands.push(new Cmd('Charge', {
  regex:/^(charge) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isHeld}
  ]
}));

DEFAULT_ITEM.charge = function(isMultiple) {
  msg(prefix(this, isMultiple) + pronounVerb(this, "'be", true) + " not something you can charge.");
  return false;
}





const SPELL = {
  spellVerbs:['Examine', 'Cast'],
  cast:function(self) {
    msg('You cast <i>' + self.name + '</i>.');
  },
  icon:function() {
    return ('<img src="images/spell12.png" />');
  },
  getVerbs:function() {
    return (this.loc == "spellbook" ? ["About", "Cast"] : ["About", "Learn"]);
  },
}

const LASTING_SPELL = function() {
  var res = SPELL;
  return res;
}  

const INSTANT_SPELL = function() {
  var res = SPELL;
  return res;
}  

const WEAPON = function() {
  var res = TAKABLE;
  res.icon = function() {
    return ('<img src="images/weapon12.png" />');
  };
  return res;
}  

const MONSTER = function() {
  var res = {};
  return res;
}  
const MULTI_MONSTER = function() {
  var res = {};
  return res;
}  
const MONSTER_ATTACK = function() {
  var res = {};
  return res;
}  


  
createItem("me",
  PLAYER,
  { loc:"lounge", alt:["me", "myself", "player"], examine:function() {
    msg("A " + (this.isFemale ? "chick" : "guy") + " called " + this.alias);
    },
  }
);

createRoom("kitchen", {
  desc:'A clean room.',
  west:"lounge",
  down:new Exit('basement', {isHidden:function() { return w.trapdoor.closed; } }),
  north:new Exit("garage", {use:useWithDoor, door:"garage_door", doorName:"garage door"},),
  afterEnterFirst:function() {
    msg("A fresh smell here!");
  }
});


createRoom("lounge", {
  desc:'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
  east:'kitchen'
});

createRoom("garage", {
  desc:'An empty garage.',
  south:new Exit("kitchen", {use:useWithDoor, door:"garage_door", doorName:"kitchen door"},),
});

createRoom("basement", {
  desc:"A dank room",
  darkDesc:"It is dark, but you can just see the outline of the trapdoor above you.",
  up:new Exit('kitchen', {isHidden:function() { return false; } }),
  lightSource:function() {
    return w.light_switch.switchedon ? LIGHT_FULL : LIGHT_NONE;
  }
});

createObject("spellbook", {
  examine:'A ancient tomb.',
});

createItem("charm", 
  SPELL,
  {loc:'spellbook', examine:"Charm will make the target think you are his or her friend.",}
);





createItem("book", 
  TAKABLE(),
  { loc:"lounge", examine:"A leather-bound book.", heldVerbsX:["Read"], read:function() {
      if (isHeld(this)) {
        msg ("It is not in a language you understand.");
        return true;
      }          
      else {
        msg ("You're not holding it.");
        return false;
      }          
    }
  }
);



createItem("boots", 
  WEARABLE(),
  { loc:"lounge", pronouns:PRONOUNS.plural, examine:"Some old boots.", }
);



createItem("knife",
  TAKABLE(),
  WEAPON,
  { loc:"lounge", sharp:false, examine:function() {
    if (this.sharp) {
      msg("A really sharp knife.");
    }
    else {
      msg("A blunt knife.");
    } },
  }
);


createItem("glass_cabinet",
  CONTAINER(false),
  LOCKED_WITH("cabinet_key"),
  { loc:"lounge", alias:"glass cabinet", examine:"A cabinet with a glass front", transparent:true, }
);


createItem("cardboard_box",
  CONTAINER(false),
  { loc:"lounge", alias:"cardboard box", examine:"A big cardboard box.", closed:false, }
);


createItem("ornate_doll",
  TAKABLE(),
  { loc:"glass_cabinet", alias:"ornate doll", examine:"A fancy doll, eighteenth century." }
);

createItem("trapdoor",
  OPENABLE(false),
  { loc:"kitchen", examine:"A small trapdoor in the floor.", }
);



createItem("camera",
  TAKABLE(),
  { loc:"lounge", examine:"A cheap digital camera.", alias:"hat", listalias:"microscope" }
);

createItem("flashlight",
  TAKABLE(),
  SWITCHABLE(false),
  { loc:"lounge", examine:"A small black torch.", alt:["torch"], 
    byname:function(def, modified){
      var res = this.alias;
      if (def) { res = def + " " + this.alias; }
      if (this.switchedon && modified) { res += " (providing light)"; }
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
      if (this.power == 2) {
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
    power:1,
    charge:function(isMultiple) {
      if (game.player.loc != "garage") {
        msg(prefix(this, isMultiple) + "There is nothing to charge the torch with here.");
        return false;
      }
      else {
        msg(prefix(this, isMultiple) + "You charge the torch - it should last for hours now.");
        this.power = 20;;
        return true;
      }
    },
  },
);



createItem("light_switch",
  SWITCHABLE(false),
  { loc:"basement", examine:"A switch, presumably for the light.", alias:"light switch", },
);




createItem("Mary",
  NPC(true),
  { loc:"lounge", examine:"An attractive young lady.", properName:true, askoptions:{
    house:"'I like it,' says Mary.",
    garden:"'Needs some work,' Mary says with a sign.",
  } }
);

createItem("Mary_The_Garden",
  TOPIC(true),
  { loc:"Mary", alias:"What's the deal with the garden?", nowShow:["Mary_The_Garden_Again"],
    script:function() {
      msg("You ask May about the garden, but she's not talking.");
    },
  }
);

createItem("Mary_The_Garden_Again",
  TOPIC(false),
  { loc:"Mary", alias:"Seriously, what's the deal with the garden?",
    script:function() {
      msg("You ask May about the garden, but she's STILL not talking.");
    },
  }
);

createItem("Mary_The_Weather",
  TOPIC(true),
  { loc:"Mary", alias:"The weather",
    script:function() {
      msg("You talk to Mary about the weather.");
    },
  }
);

createItem("TS_Test",
  TURNSCRIPT(true, function(self) {
    msg('Turn script!');
  }),
);


createItem("coin",
  TAKABLE(),
  { loc:"lounge", examine: "A gold coin."  }
);

createItem("garage_key",
  TAKABLE(),
  { loc:"lounge", examine: "A big key.", alias: "garage key"  }
);

createItem("cabinet_key",
  TAKABLE(),
  { loc:"lounge", examine: "A small key.", alias: "small key"  }
);

createItem("garage_door",
  OPENABLE(false),
  LOCKED_WITH("garage_key"),
  { loc:"kitchen", examine: "The door to the garage.", alias: "garage door", altLocs:["garage"] }
);

createItem("charger",
  { loc:"garage", examine: "A device bigger than a washing machine to charge a torch?", mended:false,
    use:function() {
      metamsg("To use the charge, type CHARGE followed by the name of the item you want to charge.");
    }
  }
);

