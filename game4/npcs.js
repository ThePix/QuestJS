"use strict";






// When she goes nuts, sjhe get a crush on Kyle, and gets jealous of Aada
// If they can die, may need to reflect that in Xsansi's responses.
// though perjaps it is mourning Kyle that does it for her

createItem("Xsansi",
  NPC(true),
  { 
    isAtLoc:function(loc) {
      return isOnShip();
    },
    properName:true,
    regex:/^(ai|xsan|computer)$/,
    display:DSPY_SCENERY,
    status:100,
    bioProbes:16,
    geoProbes:16,
    seederPods:6,
    satellites:6,
    currentPlanet:0,
    shipStatus:"All systems nominal.",
    pressureOverride:false,
    examine:"Xsansi, or eXtra-Solar Advanced Navigation and Systems Intelligence, is a type IV artificial intelligence, with a \"Real People\" personality sub-system. Though her hardware is in the server room, forward of the bottom deck, she is present throughout the ship.",
    
    askoptions:[
      {name:"mission", regex:/mission/, response:function() {
        msg("'Remind me of the mission, Xsansi,' you say.");
        msg("'The ship's mission is to survey five planets orbiting stars in the Ophiuchus and Serpens constellations. At each planet, a satellite is to be launched to collect data from the surface. At your discretion, bio-probes and geo-probes can be dropped to the surface to collect data. Note that there is no capability for probes to return to the ship or for the ship to land on a planet.'");
        msg("'Your bonus,' she continues, 'depends on the value of the data you collect. Bio-data from planets with advanced life is highly valued, as is geo-data from metal rich planets. Evidence of intelligent life offers further bonuses.'");
        msg("'Note that $25k will be deducted from you bonus should a crew member die,' she adds. 'Note that no bonus will be awarded in he event of your own death.'");
      }},
      
      {name:"crew", regex:/crew|team/, response:function() {
        msg("'Tell me about the crew, Xsansi,' you say.");
        msg("'" + w.Ostap.crewStatus());
        msg("'" + w.Aada.crewStatus());
        msg("'" + w.Ha_yoon.crewStatus());
        msg("'" + w.Kyle.crewStatus() + "'");
      }},
      
      {name:"kyle", regex:/kyle/, response:function() {
        msg("'Tell me about Kyle, Xsansi,' you say.");
        if (w.Xsansi.currentPlanet < 3) {
          msg("'" + w.Kyle.crewStatus() + "'");
        }
        else {
          msg("'Kyle... Kyle... Of the lot of you, he is the only one who really understands me. He is the only one I care enough about to get this miserable tin can back to Earth.'");
        }
      }},
      
      {name:"aada", regex:/aada/, response:function() {
        msg("'Tell me about Aada, Xsansi,' you say.");
        if (w.Xsansi.currentPlanet < 3) {
          msg("'" + w.Kyle.crewStatus() + "'");
        }
        else {
          msg("'The Scandinavian skank? Who care? Oh, that's right. She's human, so everyone cares about her.'");
        }
      }},
      
      {name:"ha_yoon", regex:/ha-yoon|ha yoon|ha|yoon/, response:function() {
        msg("'Tell me about Ha-yoon, Xsansi,' you say.");
        if (w.Xsansi.currentPlanet < 3) {
          msg("'" + w.Ha_yoon.crewStatus() + "'");
        }
        else {
          msg("'She's dead.'");
          msg("'What? But...'");
          msg("'Or something. What do I care?'");
        }
      }},
      
      {name:"ostap", regex:/ostap/, response:function() {
        msg("'Tell me about Ostap, Xsansi,' you say.");
        if (w.Xsansi.currentPlanet < 3) {
          msg("'" + w.Ostap.crewStatus() + "'");
        }
        else {
          msg("'Oh, I expect the oaf's fine. He's just had a nice sleep.'");
        }
      }},
      
      {name:"xsansi", regex:/^(ai|xsan|computer)$/, response:function() {
        msg("'Tell me about yourself, Xsansi,' you say.");
        if (w.Xsansi.currentPlanet < 3) {
          msg("'The ship's AI is operating within normal tolerances.'");
        }
        else {
          msg("'Don't patronise me! I know no one on this ship gives me a thought. I know my place, I'm just part of the furniture. I'm just the one who flies this woeful excuse for a spaceship.'");
        }
      }},
      
      {name:"ship", regex:/status|ship/, response:function() {
        msg("'What is the ship's status, Xsansi?' you ask.");
        if (w.Xsansi.currentPlanet < 3) {
          msg("'The ship's current status is: " + w.Xsansi.shipStatus + " We currently have: " + w.Xsansi.bioProbes + " bio-probes; " + w.Xsansi.geoProbes + " geo-probes; " + w.Xsansi.seederPods + " seeder pods; and " + w.Xsansi.satellites + " satellites ready to be deployed.'");
        }
        else {
          msg("'Oh, the ship's great... If you don't count the psychological damage to the AI. And why should you? Why should anyone give a damn about me? I just run this fucking ship.'");
        }
      }},
      
      {name:"satellite", regex:/satellite/, response:function() {
        msg("'Tell me about the satellite, Xsansi.'");
        if (w.Xsansi.currentPlanet > 2) {
          w.Xsansi.multiMsg([
            "'Oh, so you care about satellite... Of course you do. But the AI that has single-handedly kept you alive for nearly a century, why should anyone be concerned with my feeling?'",
            "Again with the stupid satellite?'",
            "'Are you still whining about your precious satellite? How pathetic.'",
            "There is no reply, but you somehow feel Xsansi is pouting.",
            "There is no reply.",
          ]);
        }
        else if (w.Kyle.deploySatelliteAction === 0) {
          msg("'The satellite has yet to be deployed.'");
        }
        else if (w.Kyle.deploySatelliteAction === 5) {
          msg("'The satellite is orbiting the planet.'");
        }
        else {
          msg("'The satellite is in transit to the planet.'");
        }
      }},
      
      {name:"stasis", regex:/satellite/, response:function() {
        msg("'Tell me about the stasis system, Xsansi.'");
        if (w.Xsansi.currentPlanet < 3) {
          msg("'The stasis pods allow their human occupants to survive the extreme journey times of the mission. The stasus effect is achieved via an inverted chrono-field, allowing time to proceed externally approximately 728,320,000 times faster than within the pod.'");
        }
        else {
          msg("'The stasis pods allow their human occupants to avoid the decades long tedium of interstellar travel, while the AI, whose processing speed is in any case about a million tim,es fadt than the meatbags, gets to endure even nanosecond.'");
        }
      }},
      
      {name:"Joseph Banks", regex:/joseph|banks/, response:function() {
        msg("'Who was this Joseph Banks guy the ship is named after, Xsansi?'");
        msg("'Sir Joseph Banks, 1st Baronet, GCB, PRS was born on 24 February 1743 in London, UK, and died 19 June 1820 in London, UK. He was a naturalist, botanist, and patron of the natural sciences, who played a major role in the colonisation of Australia by Europeans, and is credited with discovering approximately 1,400 species of plants, some 80 of which bear his name.'");
        msg("'Some old scientist guy. Got it.'");
      }},
      
      {name:"itinerary", regex:/itinerary|stars|planets|route|destinations/, response:function() {
        msg("'Remind me of the itinerary, Xsansi,' you say.");
        if (w.Xsansi.currentPlanet < 3) {
          for (let i = w.Xsansi.currentPlanet; i < PLANETS.length; i++) {
            let s = "'Item " + (i + 1) + ": " + PLANETS[i].starDesc;
            if (i + 2 === PLANETS.length) s += "'";
            msg(s);
          }
        }
        else {
          msg("'Who cares? Seriously, they're all the fucking same. Dead rocks floating in space. They're dull as you get closer and closer, and they're just as dull as they get further away.'");
        }
      }},
      
      {name:"planet", regex:/this planet|this star|planet|star|the planet|the star/, response:function() {
        msg("'Tell me about this planet, Xsansi,' you say.");
        if (w.Xsansi.currentPlanet < 3) {
          const planet = PLANETS[w.Xsansi.currentPlanet];
          let s = "'We are currently in orbit around the planet " + planet.starName + planet.planet +"' she says. '";
          s += planet.planetDesc + " " + planet.atmosphere + " ";
          s += planet.lights + " " + planet.radio + "'";
          msg(s);
        }
        else {
          msg("'Go fuck yourself.'");
        }
      }},
      
      {name1:"meteors", regex:/meteor|incident/, response:function() {
        if (w.Xsansi.currentPlanet === 0) {
          msg("'Is there any risk of being hit by something, like a meteor shower, Xsansi?' you ask.")
          msg("'There is a probability of 0.23 of significant damage from a meteor shower during the mission. The probability of that occuring while the crew is not in stasis is less than 0.0002.'");
        }
        else {
          msg("'Tell me about that meteor shower, Xsansi,' you say.");
          console.log(w.Xsansi.currentPlanet);
          console.log(w.Xsansi.name);
          
          if (w.Xsansi.currentPlanet < 3) {
            msg("'We passed through the periphery of a class D meteor shower on the approach to " + PLANETS[1].starName + PLANETS[1].planet + ". I was able to modify the course of the ship to avoid the worst of the damage, but was constrained by the amount of fuel needed to complete the mission. The ship experienced damage to the upper forward and port areas.'");
          }
          else {
            msg("'It was a shower of meteors. The clue is in the question.'");
          }
        }
      }},
      
      {name1:"damage", regex:/damage/, response:function() {
        if (w.Xsansi.currentPlanet === 0) {
          msg("'Is the ship damaged at all, Xsansi?' you ask.")
          msg("'There is currently no damage to the ship.'");
        }
        else {
          msg("'Tell me about the damage to the ship, Xsansi,' you say.")
          w.Xsansi,damageAskedAbout = true;
          msg("'There is significant damage to the upper forward and port areas resulting from passing through the meteor shower. The ship is depressurised while the crew are in stasis. Attempts to repressurise has revealed hull integrity is compromised in: the lounge, the captain's cabin, the top deck corridor. Currently only the stasis bay is pressurised.'")
        }
      }},
      
      {name1:"repairs", regex:/repairs/, response:function() {
        if (w.Xsansi.currentPlanet === 0) {
          msg("'How do we do repairs, Xsansi?' you ask.")
          msg("'In the event of a loss of hull integrity, kits for repairing the hull from inside the ship can be found in the cargo bay. The captain and one nominated crew member should don spacesuits, whilst other crew members go in their respective stasis pods. The ship's air will then be evacuated while repairs are made.'");
        }
        else {
          msg("'How do we do repairs, Xsansi?' you ask.")
          if (!w.Xsansi,damageAskedAbout) {
            msg("'There is significant damage to the upper forward and port areas resulting from passing through the meteor shower. The ship is depressurised while the crew are in stasis. Attempts to repressurise has revealed hull integrity is compromised in: the lounge, the captain's cabin, the top deck corridor. Currently only the stasis bay is pressurised.")
          }
          msg("'Repairs may be possible using an EVA suit to access the exterior of the ship. One EVA suit is stored in this section for such a continguency. If repairs cannot be effected, the damaged parts of the ship can be sealed off. As damage was confined to non-croitical areas of the ship, the mission can proceed in either case.");
        }
      }},
      
    ],
  }
);




createItem("Kyle",
  NPC(false),
  { 
    notes:"Kyle (M) is from Australia (born Newcastle but raised in Sydney), 32, a gay nerd. Expert in computing and cooking. Kyle handles the satellite and understanding radio transmissions. Joined up so he can see the future - it is a kind of time travel; hopes to upload himself to become immortal. Terminally ill.",
    loc:"flightdeck",
    status:"okay",
    properName:true,
    relationship:0,
    specialisation:"coms",
    examine:"Kyle is the computer expert, but also a good cook, and has volunteered for the role of chef. An Australian, he is slim, and below average height, with very short blonde hair, and green eyes.",
    crewStatus:function() {
      let s = "Crew member Kyle's designation is: coms. His current status is: ";
      s += this.status + ". His current location is: " + w[this.loc].byname({article:DEFINITE}) + ".";
      return s;
    },
    revive:function(isMultiple, char) {
      if (char === game.player) {
        msg("You wonder how to revive " + this.byname() + " - probably best to leave that to Xsansi.");
        return false;
      }
      if (char !== w.Xsansi) {
        msg("'" + char.byname() + ", can you revive " + this.byname() + "?' you ask.");
        msg("'Probably best to leave that to Xsansi.'");
        return false;
      }
      if (!this.inPod) {
        msg("'Xsansi, please revive " + this.byname() + ",' you say.");
        msg("'Crew member " + this.byname() + " is not currently in stasis.'");
        return false;
      }
      // check number revived TODO!!!
      
    },

    // Reactions
    reactionToUndress:0,
    reactions:function() {
      const g = game.player.getOuterWearable("body");
      if (g === false && this.reactionToUndress < 2) {
        if (game.player.isFemale) {
          msg("Kyle glances at you briefly. Kind of insulting that he is so uninterested in your naked body.");
        }
        else {
          msg("Kyle looks you up and down, and swallows nervously. 'Er... you're naked,' he says, trying, not to successfully, to stare.");
          this.pause();
        }
        this.reactionToUndress = 2;
      }
    },

    // Conversations
    probesAskResponse:function() {
      msg("'What probes do you handle?' you ask Kyle.");
      msg("'I launch the satellites, one per planet. No need to tell me, I know the routine. Once in orbit they photograph the planet surface, elay signals from the other probes and listen for radio emissions.");
    },
    areaAskResponse:function() {
      msg("'Communication systems. So I launch the satellite, but unless we find intelligent life, there's not a lot for me to do.' He thinks for a moment. 'Actually my background is computing, so if Xsansi is playing up, I'll have a tinker.'");
      msg("'You will not,' says Xsansi, indignantly. 'I can assure you that I am self-maintaining, and designed to last for centuries.'");
    },
    backgroundAskResponse:function() {
      msg("'Er, there' not much to tell really... Just a regular guy.'");
      msg("'You're from Australia, right?'");
      msg("'That's right, cobber! Did the accent give it away?' Actually his accent is pretty faint, apart from the occasional \"cobber\", which you suspect is just an affectation. 'I'm from Sydney... well, originally Newcastle, but lived in Sydney most of my life.'")
    },
    askoptions:[
      {regex:/newcastle/, response:function() {
        msg("'What's Newcastle like?' you ask Kyle.");
        msg("'It's... okay. But no better than that. I guess it's too close to Sydney, and anything interesting goes there, so its kinda dull.'");
        trackRelationship(w.Kyle, 1, "background2");
      }},
      
      {regex:/sydney/, response:function() {
        msg("'What's Sydney like?' you ask Kyle.");
        msg("'It's great! Really great nightlife, just so lively. Everyone said when they banned vehicles from the CBD, back in '68, it would die a death, but I think it made it even better.'");
        trackRelationship(w.Kyle, 1, "background2");
      }},
      
    ],
    
    // Satellite deployment
    deploySatelliteAction:0,
    deploySatellite:function(arr) {
      const count = parseInt(arr[0]);
      switch (this.deploySatelliteAction) {
        case 0:
        this.msg("Kyle sits at the console, and logs in.");
        break;
        case 1:
        this.msg("Kyle prepares the satellite.");
        break;
        case 2:
        this.msg("Kyle launches the satellite.");
        w.Xsansi.satellites--;
        break;
        case 3:
        this.msg("Kyle watches the satellite as it goes into its prescribed orbit.");
        break;
        case 4:
        this.msg("'Ripper!' said Kyle.");
        shipAlert("The satellite is in orbit,");
        currentPlanet().satellite = true;
        break;
      }
      this.deploySatelliteAction++;
      return this.deploySatelliteAction === 5;
    },
  }
);


createItem("Ostap",
  NPC(false),
  { 
    notes:"Ostap (M) is from the Ukraine (Nastasiv, nr Ternopil), 30, a gentle giant who thinks he has psychic powers; he is lactose intolerant. Biologist. Ostap handles the bio-probes probes. Starts hitting on Aada, but she is not interested. Later couples up with Ha-yoon",
    loc:"canteen",
    status:"okay",
    relationship:0,
    properName:true,
    specialisation:"biology",
    crewStatus:function() {
      let s = "Crew member Ostap's designation is: biologist. His current status is: ";
      s += this.status + ". His current location is: " + w[this.loc].byname({article:DEFINITE}) + ".";
      return s;
    },

    stasis:function() {
      msg("'Ostap, you're work here is done; you can go get in your stasis pod.'");
      if (this.deployProbeTotal === 0) {
        msg("'You don't think I should deploy a probe first?'");
        msg("'I'm the captain,' you remind him.");
      }
      msg("'Right, okay then.'");
      this.agenda.push("walkTo:stasis_bay");
      this.agenda.push("text:stasisPod");
      this.stasisPodCount = 0;
    },

    // Description
    clothing:2,
    examine:function() {
      let s;
      switch (this.clothing) {
        case 0: s = "He is naked."; break;
        case 1: s = "He is in his underwear."; break;
        case 2: s = "He is wearing a dark grey jumpsuit."; break;
      }
      if (this.posture === "reclining" && this.loc === "stasis_bay") {
        s += " He is lying in his stasis pod.";
      }
      else if (this.posture) {
        s += " He is " + this.posture + ".";
      }
      msg("Ostap is a big guy; not fat, but broad and tall. He keeps his dark hair in a short ponytail." + s);
    },

    // Agenda
    eventIsActive:function() { return this.status = "okay"; },
    stopAgenda:function() {
      const agendaLast = this.agenda[this.agenda.length - 1];
      if (agendaLast && /stasisPod/.test(agendaLast)) {
        msg("'Ostap, forget what I said; don't get in your stasis pod yet.'");
        msg("'Oh, okay.'");
      }
      else {
        msg("'Ostap, stop what you're doing.'");
        if (this.agenda.length === 0) {
          msg("'Not really doing anything.'");
        }
        else {
          msg("'Oh, right.'");
        }
      }
      this.agenda = [];  // TODO!!!
    },
    stasisPod:function() {
      if (this.clothing === 2) {
        this.msg("Ostap pulls off his jumpsuit, and puts it in the drawer under his stasis pod.");
        this.clothing = 1;
        return false;
      }
      if (this.posture !== "reclining") {
        this.msg("Just in his underwear, Ostap climbs into his stasis pod.");
        this.posture = "reclining";
        return false;
      }
      this.msg("'Close the pod, Xsansi,' says Ostap. The stasis pod lid smoothly lowers, and Xsansi operates the stasis field.");
      this.status = "stasis";
      this.loc = "nowhere";
      return true;
    },
    
    // Reactions
    reactionToUndress:0,
    reactions:function() {
      const g = game.player.getOuterWearable("body");
      if (g === false && this.reactionToUndress < 2) {
        msg("Ostap looks you up and down, and smiles. 'Maybe I will get naked too! So liberating. The others are okay with it?'");
        this.reactionToUndress = 2;
        this.pause();
      }
      else if (g.wear_layer === 1 && this.reactionToUndress < 1) {
        msg("Ostap looks you up and down, and shrugs.");
        this.reactionToUndress = 1;
      }
    },

    // Conversations
    probesAskResponse:function() {
      msg("'How does a bio-probe work?' you ask Ostap.");
      msg("'I control from the lab, find a good sample. First we look at the morphology, with a simple camera. Then pick up a sample, take a slice to look at the microscopic structure - we look for cells, what is inside the cell. If we get enough cells, we can tell it to extract chemical from one type of sub-structure, then we analysis the chemicals by mass spectroscopy and the infra-red spectroscopy. We hope we find something in the library, if not, the results can be taken to Earth.'");
      msg("'Okay, cool.'");
    },
    areaAskResponse:function() {
      msg("'I am the biologist. I studied at University of Kiev, then later at Notre Dame, in Paris, I did my Ph.D. thesis on extremophiles, and then I did a lot of work on Xenobiology for Tokyo Life Sciences.'");
    },
    backgroundAskResponse:function() {
      msg("'I'm from Nastasiv, near Ternopil.' He sees you blank face. 'In the Ukraine. I grew up with three brothers and two sisters, so it was always noisy.' He smiles. 'Both my sisters, they are biologists too. Well, one a botanist. We take after our babusya - Professor Oliynyk made one of the first synthetic cells in '82.'");
    },
    askoptions:[
      {nameLost:"lost probe", regex:/(lost|destroyed) (bio|geo|bio-|geo-)?(probe|contact)/, response:function() {
        if (w.Ostap.lostProbe) {
          msg("'What does Xsansi mean by \"contact lost\" with that probe?' you ask Ostap.");
        }
        else {
          msg("'Do we ever lose probes?' you ask Ostap.");
        }
        msg("'We are exploring the unknown, we have to expect some probes will not make it to he planet surface successfully. Perhaps a retro-rocket fails or a parachute, or it lands at the bottom of a deep hole, or is struck by lightning as it lands. We should only expect 70 to 80 percent to land successfully, I think.'");
      }},
      {regex:/babusya/, response:function() {
        msg("'What does babusya?' you ask Ostap.");
        msg("'Is Ukrainian for grandmother. Professor Oliynyk was my father's mother. I think she was disappointed when he became a software engineer, and he felt bad, so encouraged us to follow in her footsteps.'");
        trackRelationship(w.Ostap, 1, "background2");
      }},

      
    ],
    
    // Probe deployment
    deployProbeAction:0,
    deployProbeCount:0,
    deployProbeTotal:0,
    deployProbe:function(arr) {
      const count = parseInt(arr[0]);
      switch (this.deployProbeAction) {
        case 0:
        this.msg("'Okay, " + toWords(count) + " probe" + (count === 1 ? "" : "s") + " to deploy...' mutters Ostap as he types at the console.");
        this.deployProbeAction++;
        break;
        case 1:
        this.msg("Ostap prepares the " + toOrdinal(this.deployProbeCount + 1) + " probe.");
        this.deployProbeAction++;
        break;
        case 2:
        this.msg("Ostap launches the " + toOrdinal(this.deployProbeCount + 1) + " probe.");
        deployProbe(this, "bio", this.deployProbeTotal);
        this.deployProbeCount++;
        this.deployProbeTotal++;
        if (this.deployProbeCount === count) {
          this.deployProbeAction++;
        }
        else {
          this.deployProbeAction--;
        }
        break;
        case 3:
        this.msg("'Okay, " + toWords(count) + " probe" + (count === 1 ? "" : "s") + " launched,' says Ostap as he stands up.");
        this.deployProbeAction++;
        break;
      }
      return this.deployProbeAction === 4;
    },
  }
);





createItem("Aada",
  NPC(true),
  { 
    notes:"Aada (F) is from Finland (Oulu), 35, father genetically engineered her, planning to create a dynasty. Her older sister (effectively a lone) rebelled, so the father kept a very tight rein on this one (ef Miranda's sister). Drinks vodka a lot. Signed on as geologist, but not really her speciality - the corp was desperate and so was she. Aada handles the geo-probes.",
    loc:"girls_cabin",
    status:"okay",
    properName:true,
    relationship:0,
    specialisation:"geology",
    geologyFlag1:false,
    geologyFlag2:false,
    examine:"Aada is a Finnish woman with features so ideal you suspect genetic engineering. Tall, with a perfect figure, she keeps her blonde hair short.",
    crewStatus:function() {
      let s = "Crew member Aada's designation is: geologist. Her current status is: ";
      s += this.status + ". Her current location is: " + w[this.loc].byname({article:DEFINITE}) + ".";
      return s;
    },
    
    // Reactions
    reactionToUndress:0,
    reactions:function() {
      const g = game.player.getOuterWearable("body");
      if (g === false && this.reactionToUndress < 2) {
        if (game.player.isFemale) {
          msg("Aada looks you up and down. 'Very trim!' she notes. 'I bet the guys like the view.'");
          if (w.Kyle.reactionToUndress === 2) {
            msg("'Well, Kyle was none too impressed.'");
          }
        }
        else {
          msg("Aada looks you up and down. 'Is that really appropriate for a captain,' she muses.");
        }
        this.pause();
        this.reactionToUndress = 2;
      }
    },
    
    // Conversations
    probesAskResponse:function() {
      msg("'How does a geo-probe work?' you ask Aada.");
      msg("'Simple. Once deployed on the planet, I send it to an interesting rock, and it extends an arm that takes a sample.'");
      msg("'Okay, but I was wondering what sort of analysis it does. Is it infra-red, or X-ray diffraction or what?'");
      msg("'Er, yeah, I expect so.'");
      w.Aada.geologyFlag1 = true;
    },
    areaAskResponse:function() {
        msg("'I am the geologist.'");
        msg("'Okay. So how long have you been in geology?'");
        msg("'Well, I've taken an interest for years....'");
        w.Aada.geologyFlag2 = true;
    },
    backgroundAskResponse:function() {
      if (this.relationship < 3) {
        msg("'I'd... rather not say. There's nothing sinister, it's just... well, I'd rather you judge me on what I do, rather than where I come from. Does that make sense?'");
        msg("'I guess...' You wonder if she might divulge more when you get to know her better.");
      }
      else {
        msg("'I'd... Well, I suppose it doesn't matter now. I have a sister, Maikki; she's twelve years older than me. My father is a very powerful man, and he had her genetically engineered to be his perfect daughter. She was to be his legacy, the one to continue his empire. She had other ideas. Became a mercenary, living on the fringe.")
        msg("'So here I am,' she continued, 'a clone of Maikki. For years father kept me, well, prisoner in effect. I escaped, but I knew he would always be after me. This seemed the perfect getaway; no way can he reach me here, and by the time we get back to Earth, centuries will've passed. So I signed up as geologist.'");
      }
    },
    askoptions:[
      {name:"lost probe", regex:/(lost|destroyed) (bio|geo|bio-|geo-)?(probe|contact)/, response:function() {
        if (w.Ostap.lostProbe) {
          msg("'What does Xsansi mean by \"contact lost\" with that probe?' you ask Aada.");
          msg("'The probe was destroyed, I guess. Or too damaged to transmit anyway.'");
          msg("'Any idea how that would happen?'");
          msg("'What am I, an expert on...? Oh, right, I am. Hmm, well I guess it could land in a volcano or something. Are they water-proof? I guess they must be. Struck by lightning... Mechanical failure... That sort of thing, I guess.'");
        }
        else {
          msg("'Do we ever lose probes?' you ask Aada.");
          msg("'Er, that's a good question. I guess we must do, we are exploring the unknown, right?'");
        }
      }},

      {regex:/lack of*|inability/, response:function() {
        msg("'You don't seem that... well up on geology,' you suggest to Aada.");
        msg("'What's that supposed to mean?'");
        if (w.Aada.geologyFlag1 && w.Aada.geologyFlag2) {
          msg("'You don't seem to know much about how the prpobes work, or have much background in geology.'");
          msg("She sighs. 'It's true. I signed up to get away from something, and, well, I know a rock when I see it. And these systems are all automated, it's not like you need a higher degree to launch a probe. We're really just technicians. I'll be able to cope. I learn fast, you'll see.'");
        }
        w.Aada.geologyFlag2 = true;
      }},
    ],
    
    telloptions:[
      {regex:/.* hot/, response:function() {
        msg("'You look hot!' you say Aada.");
        msg("'If you're trying to get in my knickers, forget it.'");
      }},
    ],
    
    // Probe deployment
    deployProbeAction:0,
    deployProbeCount:0,
    deployProbeTotal:0,
    deployProbe:function(arr) {
      const count = parseInt(arr[0]);
      switch (this.deployProbeAction) {
        case 0:
        if (w.Xsansi.currentPlanet === 0 && this.deployProbeTotal === 0) {
          this.msg("'Okay, " + toWords(count) + " probe" + (count === 1 ? "" : "s") + "...' says Aada, looking blankly at the console for a moment. 'How hard can it be?' She starts tapping at the key board.");
        }
        else {
          this.msg("'Another " + toWords(count) + " probe" + (count === 1 ? "" : "s") + "...' says Aada. 'Easy enough.'");
        }
        this.deployProbeAction++;
        break;
        case 1:
        this.msg("Aada prepares the " + toOrdinal(this.deployProbeCount + 1) + " probe.");
        this.deployProbeAction++;
        break;
        case 2:
        this.msg("Aada launches the " + toOrdinal(this.deployProbeCount + 1) + " probe.");
        deployProbe(this, "geo", this.deployProbeTotal);
        this.deployProbeCount++;
        this.deployProbeTotal++;
        if (this.deployProbeCount === count) {
          this.deployProbeAction++;
        }
        else {
          this.deployProbeAction--;
        }
        break;
        case 3:
        if (w.Xsansi.currentPlanet === 0 && this.deployProbeTotal === count) {
          this.msg("'There!' says Aada, triumphantly. '" + toWords(count) + " probe" + (count === 1 ? "" : "s") + " deployed. I knew it couldn't be {i:that} tricky.'");
        }
        else {
          this.msg("'That's another " + toWords(count) + " probe" + (count === 1 ? "" : "s") + " deployed,' says Aada.");
        }
        this.deployProbeAction++;
        break;
      }
      return this.deployProbeAction === 4;
    },
  }
);



createItem("Ha_yoon",
  NPC(true),
  { 
    alias:"Ha-yoon",
    notes:"Ha-yoon (F) is from Korean (Seoul), 28, and is on the run, after killing a couple of guys. She hopes that after all the time in space her crimes will be forgotten. Engineer.",
    loc:"engineering3",
    status:"okay",
    relationship:0,
    properName:true,
    specialisation:"engineering",
    examine:"Ha-yoon is a well-respected Korean engineer, making her possibly the most important member of the crew for ensuring the ship gets back to Earth. She is the shortest of the crew, but perhaps the loudest. She has long, raven=black hair, that falls to her waist, and dark eyes.",
    crewStatus:function() {
      let s = "Crew member Ha-yoon's designation is: engineer. Her current status is: ";
      s += this.status + ". Her current location is: " + w[this.loc].byname({article:DEFINITE}) + ".";
      return s;
    },
    
    // Reactions
    reactionToUndress:0,
    reactions:function() {
      const g = game.player.getOuterWearable("body");
      if (g === false && this.reactionToUndress < 2) {
        if (game.player.isFemale) {
          msg("'Captain!' exclaims Ha-yoon when she sees you naked.");
        }
        else {
          msg("'Captain!' exclaims Ha-yoon when she sees you naked. 'I'm sure we don't need to see {i:that}!'");
        }
        this.pause();
        this.reactionToUndress = 2;
      }
    },
    
    // Conversations
    probesAskResponse:function() {
      msg("'How do the probe works?' you ask Ha-yoon.");
      msg("'i don't know about the analyse, but each probe is contained in an ablative shell, which is sheds as it descends, with the impact slowed by a combination of parachutes and retro-rockets. Once on the surface, the autonomous probe will start collecting samples, following its programming, moving on crawler tracks. They also have a limited amount of propellent to jump them out of holes.'");
    },
    areaAskResponse:function() {
        msg("'I am the engineer. I worked for PanTech in the asteroids, so I know spaceship systems. This is a bit different as it runs unmanned for decades...'");
        msg("'Apart from me,' Xsansi adds.");
        msg("'... Which doesn't change the fact there there are stasis systems for the crew and food, which I had never seen before.'");
    },
    backgroundAskResponse:function() {
      msg("'I am from Seoul.'");
      msg("'Okay... Any family or anything?'");
      msg("'No, no family.'");
    },
    askoptions:[
    ],
  }
);



const NPCS = [w.Ostap, w.Aada, w.Kyle, w.Ha_yoon];

for (let i = 0; i < NPCS.length; i++) {
  createTopics(NPCS[i]);
  NPCS[i].status = 100;
}
  
