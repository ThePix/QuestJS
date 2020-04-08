"use strict";

 
createItem("me",
  PLAYER(),
  { 
    loc:"lounge",
    regex:/^(me|myself|player)$/,
    examine:function(isMultiple) {
      msg(prefix(this, isMultiple) + "A " + (this.isFemale ? "chick" : "guy") + " called " + this.alias);
    },
  }
);


createItem("knife",
  TAKEABLE(),
  { 
    loc:"me",
    sharp:false,
    examine:function(isMultiple) {
      if (this.sharp) {
        msg(prefix(this, isMultiple) + "A really sharp knife.");
      }
      else {
        msg(prefix(this, isMultiple) + "A blunt knife.");
      }
    },
    chargeResponse:function(participant) {
      msg("There is a loud bang, and the knife is destroyed.");
      delete this.loc;
      return false;
    },
  }
);







createRoom("lounge", {
  desc:'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
  east:new Exit('kitchen'),
  west:new Exit("dining_room"),
  up:new Exit("bedroom"),
  hint:"There is a lot in this room! The bricks can be picked up by number (try GET 3 BRICKS). The book can be read. The coin is stuck to the floor. There are containers too. Kyle is an NPC; you can tell him to do nearly anything the player character can do (everything except looking and talking).",
});
