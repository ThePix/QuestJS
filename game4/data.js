"use strict";



  
createItem("me",
  PLAYER(),
  { loc:"stasis_pod", regex:/^me|myself|player$/, status:100, bonus:0, examine:function() {
    msg("A " + (this.isFemale ? "chick" : "guy") + " called " + this.alias);
    },
  }
);





//-----------------------------------------------------
// STARBOARD POD

createRoom("stasis_bay", {
  alias:"stasis bay",
  desc:'There are six stasis pods here, four on one side and two on the other. That is actually more than there are crew members. Above each pod is a diagnostics screen, and behind them the various pipes that keep the occupant aline. {ifHere:pile_of_vomit:There is some vomit on the floor by your stasis pod. }The exits are to port and aft.',
  port:new Exit('hallway'),
  aft:new Exit('cargo_bay'),
  in:new Exit('stasis_pod', { msg:"You climb into the stasis pod.", } ),
});

createItem("pile_of_vomit", {
  display:DSPY_HIDDEN,
  regex:/vomit|sick/,
  examine:"A large splat of vomit, it stinks. You decide not to look too closely. You do know what you ate last, so what is the point?",
});



createRoom("stasis_pod", {
  alias:"stasis pod",
  desc:'The stasis pod is shaped uncomfortably like a coffin, and is a pale grey colour. The lid is in the raised position.',
  out:new Exit('stasis_bay', { msg:"You climb out of the stasis pod.", } ),
});




createRoom("cargo_bay", {
  desc:"The cargo bay is a large,open area, with numerous crate, several with their own stasis fields. Yellow lines on the floor indicate access ways to be kept clear. The ship's airlock is to port, whilst engineering is aft. The stasis bay if forward, and to starboard, stairs lead up to the top deck, where the living quarters are.",
  forward:new Exit("stasis_bay"),
  port:new Exit("top_deck_aft", {
    msg:"You walk up the narrow stair way to the top deck.",
    alsoDir:["up"],
  }),
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
  starboard:new Exit("probes_aft", {
    msg:"You walk down the narrow stair way to the bottom deck.",
    alsoDir:["down"],
  }),
  aft:new Exit("engineering1"),
});





//-----------------------------------------------------
// ENGINEERING



createRoom("engineering1", {
  desc:"",
  alias:"Engineering (port)",
  properName:true,
  starboard:new Exit("engineering2"),
  forward:new Exit("lab4"),
});


createRoom("engineering2", {
  desc:"",
  alias:"Engineering",
  properName:true,
  starboard:new Exit("engineering3"),
  port:new Exit("engineering1"),
  forward:new Exit("service_passage", {
    isHidden:function() { return true; },
  }),
});


createRoom("engineering3", {
  desc:"",
  properName:true,
  alias:"Engineering (starboard)",
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
  forward:new Exit("server_room"),
});

createRoom("probes_aft", {
  alias:"Probe hanger 2",
  desc:"The aft probe hanger has the scientific probes. Each probe is contained in a crate, and needs unpacking before deployment. On the port side there is a delivery system into which a probe can be placed, to be sent to the planet. Various types of probes are available.",
  port:new Exit("lab4", {
    msg:"You walk up the narrow stair way to the middle deck.",
    alsoDir:["up"],
  }),
  forward:new Exit("probes_forward"),
});

createRoom("server_room", {
  desc:"The heart of the IT systems, including Xsansi, This room holds three racks of processors, each rack having four shelves and each shelf having eight units. The roomis kept cool and smells slighty of ozone.",
  aft:new Exit("probes_forward"),
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
  port:new Exit("guys_cabin"),
  aft:new Exit("girls_cabin"),
  starboard:new Exit("cargo_bay", {
    msg:"You walk down the narrow stair way to the middle deck.",
    alsoDir:["down"],
  }),
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
    regex:/^(bio-|geo-|bio|geo)?probe$/,
    function(isMultiple, char) {
      if (char === w.Aada) {
        msg("'Launch a bio-probe,' you say to Aada.");
        w.Aada.agenda["walkTo:probes_aft:Aada goes to the probe deployment console.", "text:deployProbe"];
      }
      else if (char === w.Ostap) {
        msg("'Launch a bio-probe,' you say to Ostap.");
        w.Ostap.agenda["walkTo:probes_aft:Ostap goes to the probe deployment console.", "text:deployProbe"];
      }
      else {
        msg("To launch a probe, see either Aada or Ostap.");
      }
    },
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


