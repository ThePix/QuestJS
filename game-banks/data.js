"use strict"


createRoom("nowhere", {
});


  
createItem("me", PLAYER(), { 
  loc:"stasis_pod_room", 
  regex:/^(me|myself|player)$/, 
  status:100, 
  bonus:0, 
  baseOxygeUse:6,
  oxygenUseModifier:1,
  oxygenUse:function() {
    return this.baseOxygeUse * this.oxygenUseModifier
  },
  examine:function() {
    msg("You feel fine...")
  },
  testMove:function(ex) {
    let room1 = w[this.loc]
    if (typeof room1.vacuum === "string") room1 = w[room1.vacuum]
    if (ex.name === '_') return true
    let room2 = w[ex.name]
    if (typeof room2.vacuum === "string") room2 = w[room2.vacuum]
    
    if (room1.vacuum === room2.vacuum) return true
    
    if (room2.name === 'space') return falsemsg("The external airlock door cannot be opened while the airlock is pressurised.")
    
    msg("The door to " + lang.getName(room2, {article:DEFINITE}) + " will not open while it is " + (room1.vacuum ? 'pressurised' : 'depressurised') + " and " + lang.getName(room1, {article:DEFINITE}) + " is not.")
    return false
  },
  spray:function(char) {
    msg("You spray sealant on yourself.")
  },
})



createItem("your_jumpsuit", WEARABLE(2, ["body"]), {
  alias:"jumpsuit",
  loc:"stasis_pod_drawer",
  defArticle:"your",
  indefArticle:"your",
  examine:"Your jumpsuit is tight, but comfortable; a dark grey colour, with a slight metallic sheen.",
  afterMove:function(options) {
    if (options.fromLoc === "stasis_pod_drawer") {
      w.stasis_pod_drawer.closed = true
      msg("The stasis pod drawer slides shut.");
    }
  },
  sprayCount:2,
  spray:function(char) {
    msg("")
  },
});

createItem("your_underwear", WEARABLE(1, ["body"]), {
  alias:"underwear",
  loc:"me",
  worn:true,
  defArticle:"your",
  indefArticle:"your",
  examine:"Your underwear is standard issue; white and functional.",
  spray:function(char) {
    msg("")
  },
});


//-----------------------------------------------------
// STARBOARD POD

createRoom("stasis_bay", {
  deckName:'layer1',
  svgId:'rect2756',
  alias:"stasis bay",
  pressure:true, // give priority to press/depress
  desc:'There are six stasis pods here (despite only five crew members), four on one side and two on the other. {stasis_pod_status} Above each pod is a diagnostics screen, and behind them the various pipes that keep the occupant alive. Besides the pods, there is also a large locker at the back of the room. {ifHere:pile_of_vomit:There is some vomit on the floor by your stasis pod. }The exits are to port and aft.',
  tpStatus:function() {
    const arr = [];
    for (let npc of NPCS) {
      if (npc.status === "stasis") {
        arr.push(npc);
      }
    }
    switch (arr.length) {
      case 0: return "All pods are currently open.";
      case 4: return "Currently only your pod and the spare pod are open.";
      case 1: return lang.getName(arr[0], {possessive:true}) + " stasis pod is closed.";
      default: return "The stasis pods of " + formatList(arr) + " are closed.";
    }
  },
  vacuum:false,
  port:new Exit('hallway'),
  aft:new Exit('cargo_bay'),
  in:new Exit('stasis_pod_room', { msg:"You climb into the stasis pod.", } ),
});

createItem("pile_of_vomit", {
  scenery:true,
  regex:/vomit|sick/,
  examine:"A large splat of vomit, it stinks. You decide not to look too closely. You already know what you ate last, so what is the point?",
  spray:function(char) {
    msg("")
  },
});

createItem("stasis_pod", {
  alias:"pod",
  regex:/^(stasis )?pods?$/,
  scenery:true,
  loc:"stasis_bay",
  examine:"Externally, the pods are rather less like coffins, as the sides are thick with the stasis equipment, and flared towards the floor. Each stasis pod is about waist height. {stasis_pod_status}{ifHere:pile_of_vomit: One has a slight splattering of vomit.}",
  spray:function(char) {
    msg("")
  },
});

createItem("stasis_pod_drawer", CONTAINER(true), {
  alias:"drawer",
  scenery:true,
  loc:"stasis_bay",
  closed:false,
  examine:"{if:stasis_pod_drawer:closed:The drawer is flush with the stasis pod, almost invisible.:The drawer extends out from the foot of the pod; it is white and quite shallow, and almost the width of the pod. You can see {contents:stasis_pod_drawer:,:and:nothing} stored in it.{ifHere:pile_of_vomit: Fortunately, it is well away from the vomit.}}",
});

createItem("stasis_locker", CONTAINER(true), {
  alias:"locker",
  scenery:true,
  loc:"stasis_bay",
  examine:function() {
    if (this.closed) {
      msg("This metal locker is taller than you, and just as wide; it is where spacesuits are stored{once: - if there is an emergency, you want the spacesuits by the stasis pods}.");
    }
    else {
      msg("This metal locker is taller than you, and just as wide; it is where spacesuits are stored. You can see {contents:stasis_locker:,:and:nothing} stored in it.")
    }
  },
  spray:function(char) {
    msg("")
  },
});


createItem("your_spacesuit", WEARABLE(2, ["body"]), {
  alias:"spacesuit",
  loc:"stasis_locker",
  defArticle:"your",
  indefArticle:"your",
  examine:"Your spacesuit is a pale grey colour, with bright yellow flashes on the arms and legs for visibility. It says \"{show:player:alias}\" on the back.",
  spray:function(char) {
    msg("")
  },
  testRemove:function(char) {
    if (isRoomPressured(w[char.loc])) return true
    msg("{nv:char:start:true} to unseal {pa:char} spacesuit... There is a hissing sound, and suddenly {nv:char:be} struggling for breath. Quickly, {nv:char:seal:true} it up again. Perhaps taking a spacesuit off in a vacuum is not such a good idea?")
    return false
  }
})

createItem("other_spacesuit", WEARABLE(2, ["body"]), {
  alias:"spare spacesuit",
  loc:"stasis_locker",
  parserPriority:-10,
  examine:"The other spacesuit is identical to your own, except it does not have your name on the back.",
  spray:function(char) {
    msg("")
  },
});

createItem("spray_sealant", TAKEABLE(), {
  alias:"sealant spray",
  loc:"stasis_locker",
  uses:5,
  examine:"A spray can; the label says \"No-Leak Sealant\" and there is some other writing on it.",
  read:"You read the label on the can: \"No-Leak Sealant is a high performance foam sealant suitable for emergency use in space. It can be used to seal holes up to 30 mm side and 200 mm long, and is designed to maintain integrity for up to 24 hours. Typically one can is sufficient for five holes. WARNING: Highly flammable. Do not ingest. Do not breath fumes.\"",
  spray:function(char) {
    metamsg("Spray the spray with the spray? Not going to happen.")
    this.uses++
    return world.FAILED
  },
});








createRoom("stasis_pod_room", {
  deckName:'layer1',
  svgId:'rect2756',
  alias:"stasis pod",
  desc:'The stasis pod is shaped uncomfortably like a coffin, and is a pale grey colour. The lid is in the raised position.',
  vacuum:"stasis_bay",
  out:new Exit('stasis_bay', {
    use:function() {
      msg("You climb out of the stasis pod.");
      player.moveChar(this);
      if (w.your_jumpsuit.loc === "stasis_pod_drawer") {
        w.stasis_pod_drawer.loc = "stasis_bay";
        msg("A drawer under the pod slides open to reveal your jumpsuit.");
      }
      return true;
    }      
  }),
  afterDropIn:function(options) {
    log(options)
    options.item.loc = "stasis_bay"
  }
});

createItem("stasis_pod_interior",
  OPENABLE(true),
  {
    alias:"stasis pod",
    regex:/^(stasis pod|pod|lid)$/,
    scenery:true,
    loc:"stasis_pod_room",
    closed:false,
    examine:"Externally, the pods are rather less like coffins, as the sides are thick with the stasis equipment, and flared towards the floor. Each stasis pod is about waist height. {stasis_pod_status}.{ifHere:pile_of_vomit: One has a slight splattering of vomit.}",
    close:function(char) {
      if (w.Kyle.deployProbeAction < 5) {
        msg("You give pod lid a pull, and it starts to descend for a moment, before stopping. 'Commander,' says Xsensi, 'closing the lid of a stasis pod will put you back in stasis. That is not permitted until the satellite is deployed, and not advised until probes have been deployed and data collected.' The lid rises to its fully open position.");
        return false;
      }
      if (w.your_jumpsuit.loc === player.name) {
        msg("You give pod lid a pull, and it starts to descend for a moment, before stopping. 'Commander,' says Xsensi, 'your jumpsuit should be left outside the pod when going into stasis.' The lid rises to its fully open position.");
        return false;
      }
      
      w.your_jumpsuit.loc = "stasis_pod_drawer";
      w.stasis_pod_drawer.scenery = true;
      msg("You give pod lid a pull, and it starts to descend, sealing you in. You feel a sharp pain in your shoulder, and almost immediately you start to feel sleepy... so sleepy you cannot keep your eyes open.")
      hr()
      arrival()
      // MORE STUFF HERE ???
      return true
    },
  }
);





createRoom("cargo_bay", {
  deckName:'layer1',
  svgId:'rect2758',
  desc:"The cargo bay is a large, open area, with numerous crates, several with their own stasis fields. Yellow lines on the floor indicate access ways to be kept clear. The ship's airlock is to starboard, whilst engineering is aft. The stasis bay is forward, and to port, stairs lead up to the top deck, where the living quarters are.",
  vacuum:false,
  forward:new Exit("stasis_bay"),
  port:new Exit("top_deck_aft", {
    msg:"You walk up the narrow stair way to the top deck.",
    alsoDir:["up"],
  }),
  starboard:new Exit("airlock"),
  aft:new Exit("engineering3"),
  scenery:[
    {alias:'crates', examine:'Each crate is a standard size, 1 m by 2 m by 1 m; they are all a pale grey colour, with a white sealing band, and identity patches on the sides.'},
  ],
});

createRoom("airlock", TRANSIT("starboard"), {
  deckName:'layer1',
  svgId:'rect2770',
  desc:"The airlock is just big enough for two persons wearing spacesuits, and is featureless besides the doors, port and starboard, and the controls.",
  vacuum:false,
  port:new Exit("cargo_bay"),
  starboard:new Exit("space", { locked:true, alsoDir:["out"]}),
});








//-----------------------------------------------------
// CENTRAL AXIS



createRoom("hallway", {
  deckName:'layer1',
  svgId:'rect2768',
  desc:"This is, in a sense, the central nexus of the ship. The flight-deck is forward, the stasis bay to starboard, the labs to port. A ladder goes up to the living quarters and down to the probe hangers.",
  vacuum:false,
  starboard:new Exit("stasis_bay"),
  port:new Exit("biolab"),
  up:new Exit("top_deck_forward"),
  down:new Exit("probes_forward"),
  forward:new Exit("flightdeck"),
  aft:new Exit("service_passage", {
    isHidden:function() { return true; },
  }),
});


createRoom("service_passage", {
  deckName:'layer1',
  svgId:'rect16',
  desc:"A narrow passage running along the spine of the ship, the walls are covered in piping, conduits and cabling.",
  vacuum:false,
  forward:new Exit("hallway", {
    isHidden:function() { return true; },
  }),
  aft:new Exit("engineering2", {
    isHidden:function() { return true; },
  }),
});




createRoom("flightdeck", {
  deckName:'layer1',
  svgId:'path841',
  alias:"flight-deck",
  desc:"The flight deck is semi-circular, with windows looking out in all directions. In the centre is the command chair, and there are four other chairs at the various workstations. The flight-deck can be used as an escape capsule, and can be landed on a suitable planet (but cannot be used to get back to space). The only exit is aft.",
  vacuum:false,
  aft:new Exit("hallway"),
});








//-----------------------------------------------------
// LABS


createRoom("biolab", {
  deckName:'layer1',
  svgId:'rect2752',
  alias:"Bio-lab",
  desc:"The bio-lab is really just a large office, with two chairs, a desk and lots of compuer screens.",
  vacuum:false,
  starboard:new Exit("hallway"),
  aft:new Exit("geolab"),
});




createRoom("geolab", {
  deckName:'layer1',
  svgId:'rect2754',
  alias:"Geo-lab",
  desc:"The geo-lab is really just a large office, with two chairs, a desk and lots of compuer screens.",
  vacuum:false,
  forward:new Exit("biolab"),
  down:new Exit("probes_aft", {
    msg:"You walk down the narrow stair way to the bottom deck.",
    alsoDir:["starboard"],
  }),
  aft:new Exit("engineering1"),
});





//-----------------------------------------------------
// ENGINEERING



createRoom("engineering1", {
  deckName:'layer1',
  svgId:'path2760',
  desc:"This is where the fusion micro-reactor stands, a vaguely cylindrical device about a meter across, and stretching from floor to ceiling. Cables run to a small console nearby.",
  alias:"Engineering (port)",
  properNoun:true,
  vacuum:"engineering2",
  starboard:new Exit("engineering2"),
  forward:new Exit("geolab"),
});


createRoom("engineering2", {
  deckName:'layer1',
  svgId:'path4106',
  desc:"The main engineers are here, five huge light-drives that project out the rear of the ship.",
  alias:"Engineering (aft)",
  properNoun:true,
  vacuum:false,
  starboard:new Exit("engineering3"),
  port:new Exit("engineering1"),
  forward:new Exit("service_passage", {
    isHidden:function() { return true; },
  }),
});


createRoom("engineering3", {
  deckName:'layer1',
  svgId:'path4108',
  desc:"The various life-support machinery is housed on this side of engineering, including the CO2 scrubbers and water recycler.",
  properNoun:true,
  alias:"Engineering (starboard)",
  vacuum:"engineering2",
  port:new Exit("engineering2"),
  forward:new Exit("cargo_bay"),
});





//-----------------------------------------------------
// LOWER DECK

createRoom("probes_forward", {
  deckName:'layer3',
  svgId:'rect3634',
  alias:"Forward probe hanger",
  desc:"The forward probe hanger is where the satellites are stored ready for deployment. The six satellites are kept in a dust-free environment on the starboard side of the hanger, each on a cradle. A robot arm is available to pick them up and eject them through a hatch in the floor.|On the port side, the seeder pods are stored. Each pod contains a variety of simple lifeforms, such as algae, which, it is hoped, will kick-start life on a suitable planet. It is a long term plan. There are six pods, three to be deployed at distant locations on a planet.| There is a control console to handle it all, though it can also be done remotely.",
  vacuum:false,
  up:new Exit("hallway"),
  aft:new Exit("probes_aft"),
  forward:new Exit("server_room"),
});

createRoom("probes_aft", {
  deckName:'layer3',
  svgId:'rect3638',
  alias:"Aft probe hanger",
  desc:"The aft probe hanger has the scientific probes. Each probe is contained in a crate, and needs unpacking before deployment. On the port side there is a delivery system into which a probe can be placed, to be sent to the planet. Various types of probes are available.",
  vacuum:false,
  up:new Exit("geolab", {
    msg:"You walk up the narrow stair way to the middle deck.",
    alsoDir:["port"],
  }),
  forward:new Exit("probes_forward"),
});

createRoom("server_room", {
  deckName:'layer3',
  svgId:'path3619',
  desc:"The heart of the IT systems, including Xsansi, This room holds three racks of processors, each rack having four shelves and each shelf having eight units. The room is kept cool and smells slightly of ozone.",
  vacuum:false,
  aft:new Exit("probes_forward"),
});





//-----------------------------------------------------
// UPPER DECK


createRoom("lounge", {
  deckName:'layer4',
  svgId:'path3973',
  desc:"The lounge has five well-padded seats, all facing the large windows that curve round the front of the ship, and over the ceiling too.",
  vacuum:false,
  aft:new Exit("top_deck_forward"),
});




createRoom("top_deck_forward", {
  deckName:'layer4',
  svgId:'rect4090',
  desc:function() {
    if (!w.top_deck_aft.meFirst) {
      this.meFirst = true;
      return w.top_deck_aft.descStart + this.descThis + w.top_deck_aft.descFinish
    }
    else {
      return this.descThis;
    }
  },
  descThis: "You are standing at the forward end of a narrow corridor, with your cabin to port, and the canteen to starboard. Ahead, is the lounge.",
  vacuum:false,
  down:new Exit("hallway"),
  starboard:new Exit("canteen"),
  port:new Exit("your_cabin"),
  aft:new Exit("top_deck_aft"),
  forward:new Exit("lounge"),
});


createRoom("top_deck_aft", {
  deckName:'layer4',
  svgId:'rect3976',
  descStart:"The top deck is where the living quarters - such as they are - are accessed. ",
  descFinish:" The corridor is very utilitarian, with a metal floor and ceiling. The sides are mostly covered in white plastic panels, as a small concession to aesthetics.",
  desc:function() {
    if (!w.top_deck_forward.meFirst) {
      this.meFirst = true;
      return w.top_deck_aft.descStart + this.descThis + w.top_deck_aft.descFinish
    }
    else {
      return this.descThis
    }
  },
  descThis: "You are standing at the aft end of a narrow corridor, with the women's cabin behind you, the men's to port. To starboard, steps lead down to the cargo bay on the lower deck.",
  vacuum:"top_deck_forward",
  port:new Exit("guys_cabin"),
  aft:new Exit("girls_cabin"),
  starboard:new Exit("cargo_bay", {
    msg:"You walk down the narrow stair way to the middle deck.",
    alsoDir:["down"],
  }),
  forward:new Exit("top_deck_forward"),
});



createRoom("canteen", {
  deckName:'layer4',
  svgId:'rect3979',
  desc:"The canteen, like everything else of the ship, is pretty small. There is a table, with one short side against the wall, and five plastic chairs around it.{table_desc} At the back is the food preparation area; a work surface across the width of the room, with a sink on the right and a hob on the left.",
  vacuum:false,
  port:new Exit('top_deck_forward'),
});


createItem("canteen_table", SURFACE(), {
  alias:"table",
  loc:"canteen",
  scenery:true,
  tpDesc:function() { return " The table is bare." },
  examine:"The table is plastic, attached to the wall at one end, and held up by a single leg at the other end.{table_desc}",
})
createItem("canteen_chair", FURNITURE({sit:true}), {
  alias:"chair",
  loc:"canteen",
  scenery:true,
  examine:"The chaits are white and plastic and very basic.",
})



createRoom("your_cabin", {
  deckName:'layer4',
  svgId:'rect3981',
  desc:"This is you cabin, not much more than a bed and a locker.",
  vacuum:false,
  starboard:new Exit("top_deck_forward"),
});

createRoom("guys_cabin", {
  deckName:'layer4',
  svgId:'rect3983',
  desc:"Two bunk beds and two lockers pretty much sums up this room.",
  alias:"Men's cabin",
  vacuum:false,
  starboard:new Exit("top_deck_aft"),
});

createRoom("girls_cabin", {
  deckName:'layer4',
  svgId:'rect3985',
  desc:"Two bunk beds and two lockers pretty much sums up this room.",
  alias:"Women's cabin",
  vacuum:false,
  forward:new Exit("top_deck_aft"),
});



//-----------------------------------------------------
// EXTERIOR



createRoom("space", {
  desc:"You are floating in space, holding on to a handle on the side of the {i:Joseph Banks}. {once:You are very conscious of the fact that heading further out into space would be a {i:very bad idea}, as there would be no way to get back to the ship.} The view takes your breath away; the planet looming over head, and billions of stars. It is amazing to think that each is vastly bigger than the planet, and so far away your mind cannot really comprehend the distance.",
  vacuum:true,
  deckName:'space',
  isSpace:true,
  notOnShip:true,
  properNoun:true,
  port:new Exit("airlock", {alsoDir:["in"]}),
  starboard:new Exit("_", {alsoDir:["out"], use:function() {
    msg("You feel a sudden urge to be free, and push away from the ship... No! That would be a bad idea! You would drift forever. You cling desperately to the handle. What were you thinking?")
    return false
  }}),
});


createItem("alien_ship_interior", {
  regex:/^alien ship|alien vessel|ship|vessel$/,
  desc:"",
  isShip:true,
  status:0,
});




createItem("_button_alien_ship", TRANSIT_BUTTON("airlock"), {
  transitDest:"alien_ship_interior",
  isLocatedAt:function() { return false },
})

createItem("_button_space", TRANSIT_BUTTON("airlock"), {
  transitDest:"space",
  isLocatedAt:function() { return false },
})



// status
// 0 not detected
// 1 detected
// 2 approached
// 3 docked

createItem("alienShip", {
  regex:/^alien ship|alien vessel|ship|vessel$/,
  desc:"",
  isShip:true,
  status:0,
});






createItem("ship", {
  regex:/^ship|alien vessel|ship|vessel$/,
  desc:"",
  isShip:true,
  oxygen:9546,
  status:0,
  eventIsActive:function() { return true },
  eventPeriod:1,
  eventScript:function() {
    this.oxygen -= player.oxygenUse()  // player using it
    for (let npc of NPCS) {
      this.oxygen -= npc.oxygenUse()
    }
  },
});




//-----------------------------------------------------
// SPECIAL ITEMS


// Probes are cloned from this
//
createItem("probe_prototype", COUNTABLE([]), { 
  alias:"probe",
  regex:/^(\d+ )?(bio-|geo-|bio|geo)?(probe|satellite|satelite)s?$/,
  launch:function(char) {
    if (!char.probeType) return falsemsg("To launch a probe, see either Aada or Ostap. For a satellite see Kyle.")
    
    let number = this.extractNumber();
    if (!number) number = 1

    if (number === 1) {
      msg("'Launch a " + char.probeType + ",' you say to " + lang.getName(char, {article:DEFINITE}) + ".")
    }
    else {
      msg("'Launch " + number + " " + char.probeType + "s,' you say to " + lang.getName(char, {article:DEFINITE}) + ".")
    }
    if (number > char.probesRemaining) {
      return falsemsg("'We only have " + char.probesRemaining + " and we should save some for the other planets on our itinerary.'")
    }
    
    if (char.probeType === 'satellite') {
      if (number > (2 - char.deployProbeTotal)) {
        msg("'Are you sure? Protocol says we should deploy no more than two around a single planet.'");
        msg("'Hey, I'm the captain. It's my bonus on the line here. Get those satellites deployed.'");
      }
    }
    else if (number > (5 - char.deployProbeTotal)) {
      msg("'Are you sure? Protocol says we should deploy no more than five on a single planet.'");
      msg("'Hey, I'm the captain. It's my bonus on the line here. Get those probes deployed.'");
    }
    
    if (char.deployProbeAction === 0 || char.deployProbeAction ===4) {
      msg("'Okay captain.'");
      char.setAgenda(["walkTo:probes_aft:" + lang.getName(char, {article:DEFINITE}) + " goes to the probe deployment console.", "text:deployProbe:" + number])
      char.deployProbeAction = 0;
      char.deployProbeCount = 0;
    }
    else {
      // already part way through launching
      // skip walking there, skip first deploy action
      // the old number should be replaced
      msg("'Okay captain.'");
      char.setAgenda(["text:deployProbe:" + number])
      char.deployProbeAction = 1;
    }
    return true;
  },
  launchCounter:0,
  status:"In flight",
  countAtLoc:function(loc) { return 0; },
  eventIsActive:function() { return this.clonePrototype },
  cloneMe:function(owner) {
    const probe = cloneObject(this)
    probe.alias = sentenceCase(owner.probeType) + " " + toRoman(owner.deployProbeOverallTotal)
    probe.probeType = owner.probeType
    probe.planetNumber = w.Xsansi.currentPlanet
    probe.probeNumber = owner.deployProbeTotal
    probe.owner = owner.name
    probe.parserPriority  = -100
    probe.eventScript = (owner.probeType === 'satellite' ? this.satelliteEventScript : this.probeEventScript)
    return probe
  },
  
  probeEventScript:function() {
    this.launchCounter++
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
    const arr = PLANETS[this.planetNumber][this.probeType.substring(0, 3) + "ProbeRanks"][this.probeNumber - 1]
    if (arr !== undefined && arr.includes(this.launchCounter - TURNS_TO_LANDING)) {
      w[this.owner]["rank" + this.planetNumber]++
      player.bonus += PLANETS[this.planetNumber][this.probeType.substring(0, 3) + "ProbeBonusPerRank"]
    }
  },

  satelliteEventScript:function() {
    this.launchCounter++
    if (this.launchCounter === TURNS_TO_ORBIT) {
      this.status = "In orbit"
      shipAlert(this.alias + " has successfully entered orbit around the planet.")
    }
    if (this.launchCounter === TURNS_TO_ORBIT + 1) {
      this.status = "Scanning"
      w[this.owner].deployProbeAction++
    }
    if (this.launchCounter > TURNS_TO_ORBIT + 1 && this.launchCounter % 4 === 0) {
      player.bonus += 1
      w[this.owner].rank++
    }
  },
  
})



