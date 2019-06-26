"use strict";


createItem("me",
  PLAYER(),
    { loc:"bridge", regex:/^me|myself|player$/, examine: "Just a regular guy.", }
);


createRoom("bridge",
    { desc: "This is w.", }
);
