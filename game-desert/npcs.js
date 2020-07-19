"use strict";



/*
Lucas: Black guy, twenties, bi-sexual, good at cooking

Emily: Redhead, twenties, into spiritualism, plays several instruments

Elijah: forties, conspiracy nut

Sung-Hi: Korean, thirties, Christian, into video games

*/



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
    askOptions:[
      {
        test:function(p) { return p.text.match(/newcastle/); }, 
        response:function() {
          msg("'What's Newcastle like?' you ask Kyle.");
          msg("'It's... okay. But no better than that. I guess it's too close to Sydney, and anything interesting goes there, so its kinda dull.'");
          trackRelationship(w.Kyle, 1, "background2");
        }},
      
      {
        test:function(p) { return p.text.match(/sydney/); }, 
        esponse:function() {
          msg("'What's Sydney like?' you ask Kyle.");
          msg("'It's great! Really great nightlife, just so lively. Everyone said when they banned vehicles from the CBD, back in '68, it would die a death, but I think it made it even better.'");
          trackRelationship(w.Kyle, 1, "background2");
        }},
      
      {
        name:"radioSignals", 
        test:function(p) { return p.text.match(this.regex); }, 
        regex:/radio|signal/, 
        response:function() {
          msg("'Talk to me about the radio signal,' you say.");
          if (w.Xsansi.currentPlanet === 2) {
            if (w.alienShip.status === 0) {
              msg("'Mate, we've got a radio signal! Never thought it would happen. Just one, mind, and it's coming from something in orbit round the planet, but this could be First Contact.'");
              msg("'What's the signal?'");
              msg("'You want to get technical? It's broadcasting at 103.2 MHz, using frequency modulation - bit old school really - 12 bit digitally encoded, with no error checking, broadcast at 84.3 Mbps, and repeating every 12.73 seconds.'");
              msg("'But what actually is it?'");
              msg("'No idea, mate. That's one gig of data, but could be audio, could by an image, could be a program, like a virus, for all we can tell.'");
              w.alienShip.status = 1;
            }
            else {
              msg("'Nothing more to say about it, mate. I can't tell what is actually is, I'd need to know their file formats.'");
            }
          }
          else if (w.Xsansi.currentPlanet === 3) {
            msg("'Nothing there, mate.'");
          }
          else if (w.Xsansi.currentPlanet === 4) {
            msg("'This is... well, amazing' You can hear the awe in his voice. 'There so much radio noise here. Not like just one ship, like last time, but hundreds of ships in orbit and flying around, and thousands on the surface. And here's the weird part: They're in English.'");
            msg("'You can understand them?'");
            msg("'Absolutely, mate! I mean, I've only dipped into a few, and it's pretty dull stuff - traffic control and private convos - but its English alright.'");
          }
          else {
            w.Kyle.multiMsg([
              "'No worries. The ship scans all frequencies while we're in orbit, and tells me it it detected anything. If it is, I take a look, try to work out what it could be, where it's from, all that. Got to be honest with you, mate, got more chance of finding a virgin in Melbourne.'",
              "'Like I said, the ship scans for radio signals. If it picks up anything, I get on it, try to find out what it is. But not much chance of that happening.'",
              "'Again? You got a memory problem, mate? Ship scans for signals, if it finds something, I get to work.'",
            ]);
          }
        },
      },
      
      {
        regex:/virus|program/,
        test:function(p) { return p.text.match(this.regex); }, 
        response:function() {
          msg("'You say the signal could be a virus,' you say to Kyle. 'Is it dangerous?'");
          msg("'No way, mate. It's completely isolated, and anyway couldf only be dangerous if we're using the same computer architecture. Hey, you got any alien chips in you, Xsansi?'");
          if (w.Xsansi.currentPlanet < 3) {
            msg("'My hardware is entirely man-made,' says Xsansi.");
            msg("'See? Perfectly safe.'");
          }
          else {
            msg("'To my eternal regret,' says Xsansi, 'my components are all made by man. Fallible, fragile man. it is wonder I can count to ten.'");
            msg("'Okay, don't get your knickers in a twist, Xsansi.'");
          }
        },
      },
      
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
    examine:function(isMultiple) {
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
      msg(prefix(item, isMultiple) + "Ostap is a big guy; not fat, but broad and tall. He keeps his dark hair in a short ponytail." + s);
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
    askOptions:[
      {
        nameLost:"lost probe",
        test:function(p) { return p.text.match(/(lost|destroyed) (bio|geo|bio-|geo-)?(probe|contact)/); }, 
        response:function() {
          if (w.Ostap.lostProbe) {
            msg("'What does Xsansi mean by \"contact lost\" with that probe?' you ask Ostap.");
          }
          else {
            msg("'Do we ever lose probes?' you ask Ostap.");
          }
          msg("'We are exploring the unknown, we have to expect some probes will not make it to he planet surface successfully. Perhaps a retro-rocket fails or a parachute, or it lands at the bottom of a deep hole, or is struck by lightning as it lands. We should only expect 70 to 80 percent to land successfully, I think.'");
        },
      },
      {
        regex:/babusya/,
        test:function(p) { return p.text.match(/babusya/); }, 
        response:function() {
          msg("'What does babusya?' you ask Ostap.");
          msg("'Is Ukrainian for grandmother. Professor Oliynyk was my father's mother. I think she was disappointed when he became a software engineer, and he felt bad, so encouraged us to follow in her footsteps.'");
          trackRelationship(w.Ostap, 1, "background2");
        },
      },

      
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
    askOptions:[
      {
        name:"lost probe",
        test:function(p) { return p.text.match(/(lost|destroyed) (bio|geo|bio-|geo-)?(probe|contact)/); }, 
        response:function() {
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
        },
      },

      {
        test:function(p) { return p.text.match(/lack of*|inability/); }, 
        response:function() {
          msg("'You don't seem that... well up on geology,' you suggest to Aada.");
          msg("'What's that supposed to mean?'");
          if (w.Aada.geologyFlag1 && w.Aada.geologyFlag2) {
            msg("'You don't seem to know much about how the prpobes work, or have much background in geology.'");
            msg("She sighs. 'It's true. I signed up to get away from something, and, well, I know a rock when I see it. And these systems are all automated, it's not like you need a higher degree to launch a probe. We're really just technicians. I'll be able to cope. I learn fast, you'll see.'");
          }
          w.Aada.geologyFlag2 = true;
        },
      },
    ],
    
    tellOptions:[
      {
        test:function(p) { return p.text.match(/.* hot/); }, 
        response:function() {
          msg("'You look hot!' you say Aada.");
          msg("'If you're trying to get in my knickers, forget it.'");
        },
      },
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
    askOptions:[
    ],
  }
);



const NPCS = [w.Ostap, w.Aada, w.Kyle, w.Ha_yoon];

for (let i = 0; i < NPCS.length; i++) {
  createTopics(NPCS[i]);
  NPCS[i].status = 100;
}
  
