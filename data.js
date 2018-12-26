"use strict";

const SPELL = {
  spellVerbs:['Examine', 'Cast'],
  cast:function(self) {
    msg('You cast <i>' + self.name + '</i>.');
  },
  icon:function() {
    return ('<img src="images/spell12.png" />');
  },
}

const WEAPON = {
  icon:function() {
    return ('<img src="images/weapon12.png" />');
  }  
}

  
  createItem("me", [
    PLAYER,
    { loc:"lounge", alt:["me", "myself", "player"], examine:function(item) {
      msg("A " + (item.isFemale ? "chick" : "guy") + " called " + item.alias);
      },
    }
  ]);

  createRoom("kitchen", [{
    desc:'A clean room.',
    west:"lounge",
    north:new Exit("garden", { locked:true, lockedmsg:"It seems to be locked." }),
    afterEnterFirst:function() {
      msg("A fresh smell here!");
    }
  }]);
  

  createRoom("lounge", [{
    desc:'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
    east:'kitchen'
  }]);

  createRoom("garden", [{
    desc:'A wild and over-grown garden.',
    south:function(room) {
      msg("You head back inside.");
      setRoom('kitchen');
    },
    onExit:function() {
      msg("You leave the garden.");
    }
  }]);

  createObject("spellbook", [{
    examine:'A ancient tomb.',
  }]);

  createItem("charm", [
    SPELL,
    {loc:'spellbook', examine:"Charm will make the target think you are his or her friend.",}
  ]);




  
  createItem("book", [
    TAKABLE,
    { loc:"lounge", examine:"A leather-bound book.", heldVerbsX:["Read"], read:function(item) {
        if (isHeld(item)) {
          msg ("It is not in a language you understand.");
          return true;
        }          
        else {
          msg ("You're not holding it.");
          return false;
        }          
      }
    }
  ]);
  

  
  createItem("boots", [
    TAKABLE,
    WEARABLE,
    { loc:"lounge", pronouns:PRONOUNS.plural, examine:"Some old boots.", }
  ]);
  

  
  createItem("knife", [
    TAKABLE,
    WEAPON,
    { loc:"lounge", sharp:false, examine:function(item) {
      if (item.sharp) {
        msg("A really sharp knife.");
      }
      else {
        msg("A blunt knife.");
      } },
    }
  ]);


  createItem("glass_cabinet", [
    CONTAINER,
    { loc:"lounge", alias:"glass cabinet", examine:"A cabinet with a glass front", locked:true, transparent:true, }
  ]);


  createItem("cardboard_box", [
    CONTAINER,
    { loc:"lounge", alias:"cardboard box", examine:"A big cardboard box.", closed:false, hereVerbs:['Examine', 'Close'], }
  ]);


  createItem("ornate_doll", [
    TAKABLE,
    { loc:"glass_cabinet", alias:"ornate doll", examine:"A fancy doll, eighteenth century." }
  ]);



  createItem("camera", [
    TAKABLE,
    { loc:"lounge", examine:"A cheap digital camera.", alias:"hat", listalias:"microscope" }
  ]);

  createItem("flashlight", [
    TAKABLE,
    SWITCHABLE,
    { loc:"lounge", examine:"A smal black torch.", alt:["torch"], 
      byname:function(def){
        var res = this.alias;
        if (def) { res = def + " " + this.alias; }
        if (this.switchedon) { res += " (providing light)"; }
        return res;
      },
      lighting:function() {
        return this.switchedon ? LIGHT_FULL : LIGHT_NONE;
      }
    },
  ]);

  
  
  createItem("Mary", [
    NPC_OBJECT(true),
    { loc:"lounge", examine:"An attractive young lady.", properName:true, askoptions:{
      house:"'I like it,' says Mary.",
      garden:"'Needs some work,' Mary says with a sign.",
    } }
  ]);

  createItem("Mary_The_Garden", [
    TOPIC(true),
    { loc:"Mary", alias:"What's the deal with the garden?", nowShow:["Mary_The_Garden_Again"],
      script:function() {
        msg("You ask May about the garden, but she's not talking.");
      },
    }
  ]);

  createItem("Mary_The_Garden_Again", [
    TOPIC(false),
    { loc:"Mary", alias:"Seriously, what's the deal with the garden?",
      script:function() {
        msg("You ask May about the garden, but she's STILL not talking.");
      },
    }
  ]);

  createItem("Mary_The_Weather", [
    TOPIC(true),
    { loc:"Mary", alias:"The weather",
      script:function() {
        msg("You talk to Mary about the weather.");
      },
    }
  ]);

  createItem("TS_Test", [
    TURNSCRIPT(true, function(self) {
      msg('Turn script!');
    }),
  ]);

 
  createItem("coin", [
    TAKABLE,
    { loc:"lounge", examine: "A gold coin."  }
  ]);
