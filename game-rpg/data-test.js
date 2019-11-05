"use strict";

createItem("me",
  PLAYER(),
  { loc:"lounge", regex:/^(me|myself|player)$/, examine:"Just some guy." }
);

// This is for the player
createItem("knife",
  TAKEABLE(),
  { 
    loc:"me",
    sharp:false,
    examine:function() {
      if (this.sharp) {
        msg("A really sharp knife.");
        msg("A really sharp knife.");
        msg("A really sharp knife.");
        msg("A really sharp knife.");
      }
      else {
        msg("A blunt knife.");
      }
    },
  }
);




createRoom("lounge", {
    desc:'A smelly room with an [old settee:couch:sofa] and a [tv:telly].', east:new Exit('kitchen'),
    west:new Exit("dining_room"), up:new Exit("bedroom"), }
);



createRoom("kitchen", {
    desc:'A nice room.',
    east:new Exit('lounge', {
      locked:true,
      use:function() {
        msg("No cannot.");
      },
    }
    ),
    west:new Exit('lounge'),
  }
);