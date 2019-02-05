"use strict";



  
createItem("me",
  PLAYER(),
  { loc:"stasis_pod", regex:/^me|myself|player$/, examine:function() {
    msg("A " + (this.isFemale ? "chick" : "guy") + " called " + this.alias);
    },
  }
);





//-----------------------------------------------------
// STARBOARD POD

createRoom("stasis_bay", {
  alias:"stasis bay",
  desc:'There are eight stasis pods here, in two neat rows of six. That is actually more than there are crew members; you are not sure if some are redundent or if the ship is under-manned. Above each pod is a diagnostics screen, and behind them the various pipes that keep the occupant aline. The exit in to port.',
  out:new Exit('stasis_bay'),
  port:new Exit('hallway'),
  aft:new Exit('cargo_bay'),
});

createRoom("stasis_pod", {
  alias:"stasis pod",
  desc:'The stasis pod is shaped uncomfortably like a coffin, and is a pale grey colour. The lid is in the raised position.',
  out:new Exit('stasis_bay'),
});




createRoom("cargo_bay", {
  desc:"The cargo bay is a large,open area, with numerous crate, several with their own stasis fields. Yellow lines on the floor indicate accessways to be kept clear. The ship's airlock is to port, whilt enginnering is aft. The stasis bay if forward, and to starboard, stairs lead up to the top deck, where the living quarters are.",
  forward:new Exit("stasis_bay"),
  port:new Exit("top_deck_aft"),
  up:new Exit("top_deck_aft"),
  starboard:new Exit("airlock"),
  aft:new Exit("engineering3"),
});

createRoom("airlock", {
  desc:"",
  port:new Exit("cargo_bay"),
});






//-----------------------------------------------------
// CENTRAL AXIS



createRoom("hallway", {
  desc:"This is, in a sense, the central nexus of the ship. The flightdeck is forward, the stasis bay to starboard, the labs to port. A ladder goes up to the living quarters and down to the probe hangers.",
  starboard:new Exit("stasis_bay"),
  port:new Exit("lab2"),
  up:new Exit("top_deck_forward"),
  down:new Exit("probes_forward"),
  forward:new Exit("flightdeck"),
  aft:new Exit("service_passage", {
    isHidden:function() { return true; },
  }),
});


createRoom("service_passage", {
  desc:"",
  forward:new Exit("hallway", {
    isHidden:function() { return true; },
  }),
  aft:new Exit("engineering2", {
    isHidden:function() { return true; },
  }),
});




createRoom("flightdeck", {
  desc:"The flight deck is semi-circular, with windows looking out in all directions. In the centre is the command chair, and there are four other chairs at the various workstations. The flightdeck can be used as an escape capsule, and can be landed on a suitable planet (but cannot be used to get back to space). The only exit is aft.",
  aft:new Exit("hallway"),
});








//-----------------------------------------------------
// LABS

createRoom("lab1", {
  desc:"",
  starboard:new Exit("lab2"),
  aft:new Exit("lab3"),
});


createRoom("lab2", {
  alias:"Bio-lab",
  desc:"",
  starboard:new Exit("hallway"),
  port:new Exit("lab1"),
  aft:new Exit("lab4"),
});


createRoom("lab3", {
  desc:"",
  forward:new Exit("lab1"),
  starboard:new Exit("lab4"),
});


createRoom("lab4", {
  alias:"Geo-lab",
  desc:"",
  forward:new Exit("lab2"),
  port:new Exit("lab3"),
  starboard:new Exit("probes_aft"),
  down:new Exit("probes_aft"),
  aft:new Exit("engineering1"),
});





//-----------------------------------------------------
// ENGINEERING



createRoom("engineering1", {
  desc:"",
  starboard:new Exit("engineering2"),
  forward:new Exit("lab4"),
});


createRoom("engineering2", {
  desc:"",
  starboard:new Exit("engineering3"),
  port:new Exit("engineering1"),
  forward:new Exit("service_passage", {
    isHidden:function() { return true; },
  }),
});


createRoom("engineering3", {
  desc:"",
  port:new Exit("engineering2"),
  forward:new Exit("cargo_bay"),
});





//-----------------------------------------------------
// LOWER DECK

createRoom("probes_forward", {
  alias:"Probe hanger 1",
  desc:"The forward probe hanger is where the satellites are stored ready for deployment. The six satellites are kept in a dust-free environment on the starboard side of the hanger, each on a cradle. A robot arm is available to pick them up and eject them through a hatch in the floor.|On the port side, the seeder pods are stored. Each pod contains a variety of simple lifeforms, such as algae, which, it is hoped, will kickstart life on a suitable planet. It is a long term plan. There are six pods, three to be deployed at distant locations on a planet.| There is a control console to handle it all, though it can also be done remotely.",
  up:new Exit("hallway"),
  aft:new Exit("probes_aft"),
});

createRoom("probes_aft", {
  alias:"Probe hanger 2",
  desc:"The aft probe hanger has the scientific probes. Each probe is contained in a crate, and needs unpacking before deployment. On the port side there is a deluvery system into which a probe can be placed, to be sent to the planet. Various types of probes are available.",
  up:new Exit("lab4"),
  port:new Exit("lab4"),
  forward:new Exit("probes_forward"),
});





//-----------------------------------------------------
// UPPER DECK


createRoom("lounge", {
  desc:"",
  aft:new Exit("top_deck_forward"),
});




createRoom("top_deck_forward", {
  desc:"",
  down:new Exit("hallway"),
  starboard:new Exit("canteen"),
  port:new Exit("your_cabin"),
  aft:new Exit("top_deck_aft"),
  forward:new Exit("lounge"),
});


createRoom("top_deck_aft", {
  desc:"",
  down:new Exit("cargo_bay"),
  port:new Exit("guys_cabin"),
  aft:new Exit("girls_cabin"),
  starboard:new Exit("cargo_bay"),
  forward:new Exit("top_deck_forward"),
});



createRoom("canteen", {
  desc:"",
  port:new Exit('top_deck_forward'),
});




createRoom("your_cabin", {
  desc:"",
  starboard:new Exit("top_deck_forward"),
});

createRoom("guys_cabin", {
  desc:"",
  starboard:new Exit("top_deck_aft"),
});

createRoom("girls_cabin", {
  desc:"",
  forward:new Exit("top_deck_aft"),
});







createItem("probe_prototype",
  { 
    alias:"Probe X",
    loc:"canteen",
    launched:false,
    launchCounter:0,
    status:"Unused",
    eventIsActive:function() { return this.launched; },
    eventScript:function() {
      this.launchCounter++;
      if (this.launchCounter < TURNS_TO_LANDING) {
        this.status = "In flight";
      }
      if (this.launchCounter === TURNS_TO_LANDING) {
        this.status = "Landing";
        shipAlert(this.name + " is landing.");
      }
      
    },
  }
);





