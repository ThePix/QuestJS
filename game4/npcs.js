"use strict";








createItem("Xsansi",
  NPC(true),
  { 
    isAtLoc:function(loc) {
      return true;
    },
    regex:/^(ai|xsan|computer)$/,
    display:DSPY_SCENERY,
    bioProbes:16,
    geoProbes:6,
    seederPods:6,
    satellites:6,
    shipStatus:"All systems nominal.",
    examine:"Xsansi, or eXtra-Solar Advanced Navigation and Systems Intelligence, is a type IV artificial intelligence, with a \"Real People\" personality sub-system. Thoughher hardware is in the server room on deck 2, she is present throughout the ship.",
  }
);

createItem("Xsansi_status",
  TOPIC(true),
  { loc:"Xsansi", alias:"What is our status?",
    script:function() {
      msg("'What is the ship's status?' you ask Xsansi.");
      msg("'The ship's current status is: " + w.Xsansi.shipStatus + " We currently have: " + w.Xsansi.bioProbes + " bio-probes; " + w.Xsansi.geoProbes + " geo-probes; " + w.Xsansi.seederPods + " seeder pods; and " + w.Xsansi.satellites + " satellites.'");
    },
  }
);

createItem("Xsansi_mission",
  TOPIC(true),
  { loc:"Xsansi", alias:"What is the mission?",
    script:function() {
      msg("'Remind me of the mission, Xsansi,' you say.");
      msg("'The ship's mission is to survey five planets orbiting stars in the Ophiuchus and Serpens constellations. At each planet, a satellite is to be launched to collect data from the surface. At your discretion, bio-probes and geo-probes can be dropped to the surface to collect data. Note that there is no capability for probes to return to the ship or for the ship to land on a planet.'");
    },
  }
);

createItem("Xsansi_itinery",
  TOPIC(true),
  { loc:"Xsansi", alias:"What is the itinery?",
    script:function() {
      msg("'Remind me of the itinery, Xsansi,' you say.");
      for (let i = 0; i < PLANETS.length; i++) {
        msg("'Item " + (i + 1) + ": " + PLANETS[i].starDesc + "'");
      }
    },
  }
);


createItem("Kyle",
  NPC(false),
  { 
    loc:"canteen",
    examine:"Kyle is the computer expert, but also a good cook, and has volunteered for the role of chef. An Australian, he is slim, and below average height, with very short blonde hair, and green eyes.",
    notes:"Kyle (M) is from Australia (born Newcastle but raised in Sydney), 32, a gay nerd. Expert in computing and cooking. Kyle handles the satellite and understanding radio transmissions. Joined up so he can see the future - it is a kind of time travel; hopes to upload himself to become immortal.",
  }
);


createItem("Ostap",
  NPC(false),
  { 
    loc:"canteen",
    examine:"Ostap is a big guy; not fat, but broad and tall. He keeps his dark hair in a ponytail. He is a biologist from the Ukraine.",
    notes:"Ostap (M) is from the Ukraine (Nastasiv, nr Ternopil), 30, a gentle giant who thinks he has psychic powers; he is lactose intolerant. Biologist. Ostap handles the bio-probes probes.",
  }
);


createItem("Aada",
  NPC(false),
  { 
    loc:"canteen",
    examine:"Aada is a Finnish woman with features so ideal you suspect genetic engineering. Tall, with a perfect figure, she keeps her blonde hair short. She is a bit vague about her background, but has some military experience.",
    notes:"Aada (F) is from Finland (Oulu), 35, father genetically engineered her, planning to create a dynasty. Her older sister (effectively a lone) rebelled, so the father kept a very tight rein on this one (ef Miranda's sister). Drinks vodka a lot. Signed on as geologist, but not really her speciality - the corp was desperate and so was she. Aada handles the geo-probes.",
  }
);

createItem("Ha_yoon",
  NPC(false),
  { 
    alias:"Ha-yoon",
    loc:"canteen",
    examine:"Ha-yoon is a well-respected Korean engineer, making her possibly the most important member of the crew for ensuring the ship gets back to Earth. She is the shortest of the crew, but perhaps the loudest. She has long, raven=black hair, that falls to her waist, and dark eyes.",
    notes:"Ha-yoon (F) is from Korean (Seoul), 28, and is on the run, after killing a couple of guys. She hopes that after all the time in space her crimes will be forgotten. Engineer.",
  }
);





