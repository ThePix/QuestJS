"use strict";



  
createItem("me",
  RPG_PLAYER(), {
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
    damage:"d4",
    bonus:-2,
  }
);

createItem("knife",
  WEAPON(), {
    loc:"me",
    image:"knife",
    damage:"d4+2",
    bonus:-2,
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
    damage:"2d10+4",
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




createItem("goblin",
  RPG_NPC(false), {
    loc:"lounge",
    damage:"3d6",
    health:40,
  }
);

createItem("orc",
  RPG_NPC(false), {
    loc:"lounge",
    damage:"2d10+4",
    health:60,
  }
);

createItem("snotling",
  RPG_NPC(false), {
    loc:"lounge",
    damage:"2d4",
    health:20,
  }
);

createItem("friend",
  RPG_NPC(false), {
    loc:"lounge",
    damage:"2d4",
    health:20,
    isHostile:function() { return false; }
  }
);


createItem("chest",
  CONTAINER(true), {
    loc:"lounge",
  }
);

