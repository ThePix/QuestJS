"use strict";



createRoom("nowhere", {
});


  
createItem("me",
  PLAYER(),
  { loc:"stasis_pod_room", regex:/^me|myself|player$/, status:100, bonus:0, examine:function() {
    msg("A " + (this.isFemale ? "chick" : "guy") + " called " + this.alias);
    },
  }
);



createItem("your_jumpsuit", WEARABLE(2, ["body"]), {
  alias:"jumpsuit",
  loc:"stasis_pod_drawer",
  defArticle:"your",
  indefArticle:"your",
  examine:"Your jumpsuit is tight, but comfortable; a dark grey colour, with a slight metallic sheen.",
  moveFromTo:function(fromLoc, toLoc) {
    if (!w[fromLoc]) errormsg("The location name `" + fromLoc + "`, does not match anything in the game.");
    if (!w[toLoc]) errormsg("The location name `" + toLoc + "`, does not match anything in the game.");
    this.loc = toLoc; 
    w[fromLoc].itemTaken(this);
    w[toLoc].itemDropped(this);
    if (fromLoc === "stasis_pod_drawer") {
      w.stasis_pod_drawer.display = DSPY_NOT_HERE;
      msg("The stasis pod drawer slides shut.");
    }
  },
});

createItem("your_underwear", WEARABLE(1, ["body"]), {
  alias:"underwear",
  loc:"me",
  worn:true,
  defArticle:"your",
  indefArticle:"your",
  examine:"Your underwear is standard issue; white and functional.",
});


//-----------------------------------------------------
// STARBOARD POD

createRoom("stasis_bay", {
  alias:"stasis bay",
  desc:'There are six stasis pods here, four on one side and two on the other. {podStatus} That is actually more than there are crew members. Above each pod is a diagnostics screen, and behind them the various pipes that keep the occupant aline. Besides the pods, there is also a large locker at the back of the room. {ifHere:pile_of_vomit:There is some vomit on the floor by your stasis pod. }The exits are to port and aft.',
  tpStatus:function() {
    const arr = [];
    for (let i = 0; i < NPCS.length; i++) {
      if (NPCS[i].status === "stasis") {
        arr.push(NPCS[i]);
      }
    }
    switch (arr.length) {
      case 0: return "All pods are currently open.";
      case 4: return "Currently only your pod and the spare pod are open.";
      case 1: return arr[0].byname() + "'s stasis pod is closed.";
      default: return "The stasis pods of " + formatList(arr) + " are closed.";
    }
  },
  port:new Exit('hallway'),
  aft:new Exit('cargo_bay'),
  in:new Exit('stasis_pod_room', { msg:"You climb into the stasis pod.", } ),
  beforeFirstEnter:function() {
    msg("There is an odd smell.");
    wait (function() {
      world.enterRoomAfterScripts();
    } );
  }
});

createItem("pile_of_vomit", {
  display:DSPY_HIDDEN,
  regex:/vomit|sick/,
  examine:"A large splat of vomit, it stinks. You decide not to look too closely. You do know what you ate last, so what is the point?",
});

createItem("stasis_pod", {
  alias:"pod",
  regex:/^(stasis )?pods?$/,
  display:DSPY_SCENERY,
  loc:"stasis_bay",
  examine:"Externally, the pods are rather less like coffins, as the sides are thick with the stasis equipment, and flared towards the floor. Each stasis pod is about waist height. {stasis_pod_status}.{ifHere:pile_of_vomit: One has a slight splattering of vomit.}",
});

createItem("stasis_pod_drawer", CONTAINER(false), {
  alias:"drawer",
  //display:DSPY_SCENERY,
  loc:"nowhere",
  closed:false,
  examine:"The drawer extends out from the foot of the pod; it is white and quite shallow, and almost the width of the pod.{ifHere:pile_of_vomit: Fortunately, it is well away from the vomit.}",
});

createItem("stasis_locker", CONTAINER(true), {
  alias:"locker",
  display:DSPY_SCENERY,
  loc:"stasis_bay",
  examine:function() {
    if (this.closed) {
      msg("This metal locker is taller than you, and just as wide; it is where spacesuits are stored{once: (if there is an emergency, you want the spacesuits by the stasis pods)}.");
    }
    else {
      msg("This metal locker is taller than you, and just as wide; it is where spacesuits are stored. Inside you can see " + formatList(this.getContents(), {lastJoiner:" and ", article:INDEFINITE}) + ".");
    }
  },
});


createItem("your_spacesuit", WEARABLE(2, ["body"]), {
  alias:"spacesuit",
  loc:"stasis_locker",
  defArticle:"your",
  indefArticle:"your",
  examine:"Your spacesuit is a pale grey colour, with bright yellow flashes on the arms and legs for visibility.",
});

createItem("other_spacesuit", {
  alias:"spare spacesuit",
  loc:"stasis_locker",
  examine:"The other spacesuit is identical to your own.",
});








createRoom("stasis_pod_room", {
  alias:"stasis pod",
  desc:'The stasis pod is shaped uncomfortably like a coffin, and is a pale grey colour. The lid is in the raised position.',
  out:new Exit('stasis_bay', {
    use:function() {
      msg("You climb out of the stasis pod.");
      world.setRoom(game.player, this.name, "out");
      if (w.your_jumpsuit.loc === "stasis_pod_drawer") {
        w.stasis_pod_drawer.loc = "stasis_bay";
        msg("A drawer under the pod slides open to reveal your jumpsuit.");
      }
      return true;
    }      
  }),
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
  starboard:new Exit("space"),
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
  alias:"Forward probe hanger",
  desc:"The forward probe hanger is where the satellites are stored ready for deployment. The six satellites are kept in a dust-free environment on the starboard side of the hanger, each on a cradle. A robot arm is available to pick them up and eject them through a hatch in the floor.|On the port side, the seeder pods are stored. Each pod contains a variety of simple lifeforms, such as algae, which, it is hoped, will kickstart life on a suitable planet. It is a long term plan. There are six pods, three to be deployed at distant locations on a planet.| There is a control console to handle it all, though it can also be done remotely.",
  up:new Exit("hallway"),
  aft:new Exit("probes_aft"),
  forward:new Exit("server_room"),
});

createRoom("probes_aft", {
  alias:"Aft probe hanger",
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
  desc:function() {
    if (!w.top_deck_aft.meFirst) {
      this.meFirst = true;
      msg(w.top_deck_aft.descStart + this.descThis + w.top_deck_aft.descFinish);
    }
    else {
      msg(this.descThis);
    }
  },
  descThis: "You are stood at the forward end of a narrow corridor, with your cabin to port, and the canteen to starboard. Ahead, is the lounge.",
  down:new Exit("hallway"),
  starboard:new Exit("canteen"),
  port:new Exit("your_cabin"),
  aft:new Exit("top_deck_aft"),
  forward:new Exit("lounge"),
});


createRoom("top_deck_aft", {
  descStart:"The top deck is where the living quarters - such as they are - are accessed. ",
  descFinish:" The corridor is very utilitarian, with a metal floor and ceiling. The sides are mostly covered in white plastic panels, as a small concession to aesthetics.",
  desc:function() {
    if (!w.top_deck_forward.meFirst) {
      this.meFirst = true;
      msg(w.top_deck_aft.descStart + this.descThis + w.top_deck_aft.descFinish);
    }
    else {
      msg(this.descThis);
    }
  },
  descThis: "You are stood at the aft end of a narrow corridor, with the women's cabin behind you, the men's to port. To starboard, steps lead down to the cargo bay on the lower deck.",
  port:new Exit("guys_cabin"),
  aft:new Exit("girls_cabin"),
  starboard:new Exit("cargo_bay", {
    msg:"You walk down the narrow stair way to the middle deck.",
    alsoDir:["down"],
  }),
  forward:new Exit("top_deck_forward"),
});



createRoom("canteen", {
  desc:"The canteen, like everything else of the ship, is pretty small. There is a table, with one short side against the wall, and five plastic [chairs:chair] around it.{tableDesc} At the back is the food preparation area; a work surface across the width of the room, with a sink on the right and a hob on the left.",
  port:new Exit('top_deck_forward'),
});


createItem("canteen_table",
  SURFACE(),
  {
    alias:"table",
    loc:"canteen",
    display:DSPY_SCENERY,
    tpDesc:" The table is bare.",
    examine:"The table is plastic, attached to the wall at one end, and held up by a single leg at the other end.{tableDesc}",
  }
);



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



//-----------------------------------------------------
// EXTERIOR



createRoom("space", {
  desc:"",
  port:new Exit("airlock"),
  notOnShip:true,
});







//-----------------------------------------------------
// SPECIAL ITEMS

createItem("probe_prototype", COUNTABLE([]),
  { 
    alias:"Probe X",
    regex:/^(\d+ )?(bio-|geo-|bio|geo)?probes?$/,
    launch:function(isMultiple, char) {
      let type;
      if (char === w.Aada) {
        type = "geo";
      }
      else if (char === w.Ostap) {
        type = "bio";
      }
      else {
        msg("To launch a probe, see either Aada or Ostap.");
        return false;
      }
      
      let number = this.extractNumber();
      if (!number) number = 1;
      const available = w.Xsansi[type + "Probes"];

      if (number === 1) {
        msg("'Launch a " + type + "-probe,' you say to " + char.byname({article:DEFINITE}) + ".");
      }
      else {
        msg("'Launch " + number + " " + type + "-probes,' you say to " + char.byname({article:DEFINITE}) + ".");
      }
      if (number > available) {
        msg("'We only have " + available + " and we should save some for the other planets on our itinerary.'");
        return false;
      }
      
      if (number > (5 - char.deployProbeTotal)) {
        msg("'Are you sure? Protocol says we should deploy no more than five on a single planets.'");
        msg("'Hey, I'm the captain. It's my bonus on the line here. Get those probes deployed.'");
      }
      
      if (char.deployProbeAction === 0 || char.deployProbeAction ===4) {
        msg("'Okay captain.'");
        char.agenda = ["walkTo:probes_aft:" + char.byname({article:DEFINITE}) + " goes to the probe deployment console.", "text:deployProbe:" + number];
        char.deployProbeAction = 0;
        char.deployProbeCount = 0;
      }
      else {
        // already part way through launching
        // skip walking there, skip first deploy action
        // the old number should be replaced
        msg("'Okay captain.'");
        char.agenda = ["text:deployProbe:" + number];
        char.deployProbeAction = 1;
      }
      return true;
    },
    launched:false,
    launchCounter:0,
    status:"Unused",
    countAtLoc:function(loc) { return 0; },
    eventIsActive:function() { return this.launched; },
    eventScript:function() {
      this.launchCounter++;
      if (this.launchCounter < TURNS_TO_LANDING) {
        this.status = "In flight";
      }
      if (this.launchCounter === TURNS_TO_LANDING) {
        if (probeLandsOkay()) {
          this.status = "Landing";
          shipAlert(this.alias + " has successfully landed on the planet.");
        }
        else {
          shipAlert("Contact with " + this.alias + " has been lost as it attempted to land on the planet.");
          this.launched = false;
          this.status = "Destroyed";
        }
      }
      if (this.launchCounter === TURNS_TO_LANDING + 1) {
        this.status = "Exploring";
      }
      const arr = PLANETS[this.planetNumber][this.probeType + "ProbeRanks"][this.probeNumber];
      
      if (arr !== undefined && arr.includes(this.launchCounter - TURNS_TO_LANDING)) {
        w["planet" + this.planetNumber][this.probeType + "logy"]++;
        game.player.bonus += PLANETS[this.planetNumber][this.probeType + "ProbeBonusPerRank"];
      }
    },
  }
);


