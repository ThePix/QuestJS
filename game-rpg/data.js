"use strict";



  
createItem("me",
  PLAYER(), {
    loc:"lounge",
    regex:/^me|myself|player$/,
    equipped:"weapon_unarmed",
    health:20,
    maxHealth:100,
    examine:function() {
      msg("A " + (this.isFemale ? "chick" : "guy") + " called " + this.alias);
    },
  }
);

createItem("weapon_unarmed",
  WEAPON(), {
    image:"fist",
  }
);

createItem("knife",
  WEAPON(), {
    loc:"me",
    image:"knife",
    sharp:true,
    examine:function() {
      if (this.sharp) {
        msg("A really sharp knife.");
      }
      else {
        msg("A blunt knife.");
      }
    },
  }
);

createItem("flail",
  WEAPON(), {
    loc:"me",
    image:"flail",
    sharp:true,
    examine:function() {
      if (this.sharp) {
        msg("A really sharp knife.");
      }
      else {
        msg("A blunt knife.");
      }
    },
  }
);






createRoom("lounge", {
  desc:'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
  hint:"There is a lot in this room! The bricks can be picked up by number (try GET 3 BRICKS). The book can be read. The coin is stuck to the floor. There are containers too. Kyle is an NPC; you can tell him to do nearly anything the player character can do (everything except looking and talking).",
});






