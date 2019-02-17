"use strict";


/*
The ship is on a long mission to visit various stars to survey them. It takes years between each one, so the crew are in stasis. The shop has an AI that controls the ship between stars, and on arrival does the initial scans, looking for anything interesting. The ship does not have the capability to land (it has two escape pods that can be used to land, but not get off the planet again).

There are:
Eight stasis pods
Five? crew
Six seeder pods, to be deployed in batches of three
Six satellites
Sixteen probes with crawler-bots
Six probes with marine-bots
Two escape pods

Probes:
Geology (MS, also analyse atmosphere)
Biology (slice and dice, microscope)


Keep a score in the way of a bonus, related to how much data for useful planets

Each awakening gets steadily worse, by the fourthyou are throwing up.








*/



$("#panes").append("<img src=\"images/spaceship.png\" style=\"margin-left:10px;margin-top:15px;\"/>");

const TURNS_TO_LANDING = 3;
const TURNS_TO_DATA = 3;
const PLANETS = [
  {
    starName:"HD 154088",
    planet:"D",
    comment:"A lifeless planet, with no water, not much minerals either",
    atmosphere:"The atmosphere is 63% nitrogen, 17% carbon dioxide, 17% methane, 2% water and about 1% of various other gases including ethane, ammonia and hydrogen sulphide.",
    radio:"No radio signal detected.",
    lights:"There are no light sources on the night side of the planet.",
    planetDesc:"The planet is predominantly grey rock. There are no bodies of water on the surface and no cloud cover. It is 6.8 times the mass of Earth.",
    starDesc:"HD 154088 is a seventh magnitude metal-rich K-type main sequence star that lies approximately 58 light-years from Earth in the constellation of Ophiuchus.",
    probeLandingSuccess:"ynyyyynyyyynyyynnyyynnnyynyyyyyyyynynyyynynnynyyyyyyyynynyyy",
    geoProbeRanks:[
      [3, 7, 12],
      [5],
      [4],
      [6],
    ],
    geoProbeBonusPerRank:2,
    bioProbeRanks:[
      [3, 7, 10],
      [2, 6],
      [2, 7],
      [6],
    ],
    bioProbeBonusPerRank:1,
    arrivalTime:new Date('December 22, 2325 09:43:43'),
    onArrival:function() {
      w.Ha_yoon.status = Math.min(w.Kyle.status, 96);
      w.Kyle.status = Math.min(w.Kyle.status, 98);
    },
    Kyle_how_are_you:"'I'm good, mate. Why? Why shouldn't I be?'",
    Ostap_how_are_you:"'I am feeling good.'",
    Aada_how_are_you:"'I'm okay.'",
    Ha_yoon_how_are_you:"'I... feel a little queasy. It's just the stasis, nothing I can't handle.'",
  },
    
  { 
    starName:"HD 168746", 
    planet:"B", 
    comment:"Lots of life, at about the Devonian Period, with purple planets. Good metals too",
    atmosphere:"The atmosphere is 71% nitrogen, 15% oxygen, 3% carbon dioxide  and about 1% of various other gases including water and methane.",
    radio:"No radio signal detected.",
    lights:"There are no light sources on the night side of the planet.",
    planetDesc:"The planet surface is about 75% water. The land surfaces are predominantly purple. Cloud cover is about 40%.",
    starDesc:"HD 168746 is an 8th magnitude star in the constellation of Serpens, 139 light years from Earth. It is very similar to our Sun, a yellow dwarf star (spectral class G5V).",
    probeLandingSuccess:"yyyynyyyyyynyyyyynynyyynnnyynyyyyyyyynynyyynynnynyyyyyyyynynyyy",
    geoProbeRanks:[
      [3, 8, 12],
      [6],
      [7],
      [5]
    ],
    geoProbeBonusPerRank:5,
    bioProbeRanks:[
      [2, 5, 8],
      [2, 4],
      [4, 3],
      [3, 3],
      [2, 3],
    ],
    bioProbeBonusPerRank:5,
    arrivalTime:new Date('March 3, 2340 11:05:30'),
    onArrival:function() {
      msg("'Good morning,' says a female voice. {i:Who the hell?} you wonder for a few minutes, before realising you are in a stasis pod again. 'We have arrived at " + this.starName + ",' the voice continues, 'our second destination, after a lengthy journey, with a single incident. On the nineteenth of September, 2338 at 2104, ship time, the ship passed through a meteor shower, resulting in a loss of integrity in: the lounge, the captain's cabin, the top deck corridor.");
      msg("'You may be suffering from disorientation, nausea, headache and muscle fatigue. If symptoms persist, you should seek medical advice.' You sit up, and for a moment you do feel dizzy, but it soon passes.");
      game.player.status = Math.min(game.player.status, 95);
      w.Kyle.status = Math.min(w.Kyle.status, 93);
      w.Ostap.status = Math.min(w.Kyle.status, 96);
      w.Ha_yoon.status = Math.min(w.Kyle.status, 84);
    },
    Kyle_how_are_you:"'I'm okay,' he says, a little uncertainly.",
    Ostap_how_are_you:"'When I woke, that was not good! But now, I am feeling good.'",
    Aada_how_are_you:"'I'm okay.'",
    Ha_yoon_how_are_you:"'Not so good; I didn't think the stasis would be this bad. But I can still do my job.'",
  },
  
  { 
    starName:"HD 168443", 
    planet:"C", 
    comment:"A dead planet, following some unknown event; previously had intelligent life. An artefact orbits the planet.",
    atmosphere:"The atmosphere is 76% nitrogen, 22% oxygen, 1% carbon dioxide and about 1% of various other gases including water and carbon monoxide.",
    radio:"Radio signals have been detected.",
    lights:"There are no light sources on the night side of the planet.",
    planetDesc:"The planet surface is about 17% water. The land surfaces are predominantly black. Cloud cover is about 20%.",
    starDesc:"HD 168443 is a yellow dwarf star of (spectral type G5) about the mass of the Sun. It is in the constellation of Serpens Cauda, 129 light years from the Solar System. It is actually part of a binary, the other star is a brown dwarf, with a very long orbital period.",
    arrivalTime:new Date('October 21, 2362 06:21:39'),
    probeLandingSuccess:"yynyynyyyynyynyyyyynynyyynnnyynyyyyyyyynynyyynynnynyyyyyyyynynyyy",
    geoProbeRanks:[
      [3, 8, 15],
      [4],
      [3],
      [4],
    ],
    geoProbeBonusPerRank:4,
    bioProbeRanks:[
      [4, 7, 11],
      [4, 7],
      [3, 7],
      [3],
    ],
    bioProbeBonusPerRank:2,
    onArrival:function() {
      msg("'Good morning,' says a female voice. {i:Xsansi,} you think to yourself. 'We have arrived at " + this.starName + ",' the voice continues, 'our third destination, after a long and oh-so-tedious journey. You may be suffering from disorientation, nausea, headache and muscle fatigue, but ~I expect that is nothing to decades of loniness, right? If symptoms persist, tough.' You sit up, and immediately feel sick. You grip the sides of the pod as the room spins, waiting for it stop. It is a few minutes before you feel well enough to actually think.");
    },
    Kyle_how_are_you:"'I'm okay. Well, not so bad, anyway.'",
    Ostap_how_are_you:"'I feel sick,' he says with a grin, 'but I keep going.'",
    Aada_how_are_you:"'I'm great.'",
    Ha_yoon_how_are_you:"'Feeling sick and dizzy, but I think I can keep going.'",
  },
  
  { 
    starName:"HD 148427", 
    planet:"D", 
    comment:"A lifeless planet, but it has water, so suitable for seeding. By this time the AI is doolally. A young, fourth generation planet, good for mining.",
    atmosphere:"The atmosphere is 53% nitrogen, 18% carbon dioxide, 12% nitrogen dioxide, 10% carbon monoxide, 7% nitrogen oxide, 4% sulphur dioxide, 3% hydrogen sulphide, 2% water and about 1% of various other gases including ammonia.",
    radio:"No radio signals have been detected.",
    lights:"There are no light sources on the night side of the planet.",
    planetDesc:"The planet surface is about 63% water. The land surfaces are predominantly grey and red. Cloud cover is about 25%. Several active volcanoes have been noted.",
    starDesc:"HD 148427 is a 7th-magnitude K-type subgiant star approximately 193 light years away in the constellation Ophiuchus. Its mass is 45% greater than the Sun, and it is three times the size and six times more luminous, although its age is 2½ billion years.",
    probeLandingSuccess:"yyyyyynyyyyyyyyynynyyynnnyynyyyyyyyynynyyynynnynyyyyyyyynynyyy",
    geoProbeRanks:[
      [4, 9, 16],
      [],
      [4],
    ],
    geoProbeBonusPerRank:5,
    bioProbeRanks:[
      [3, 8, 15],
      [3],
      [4],
    ],
    bioProbeBonusPerRank:2,
    arrivalTime:new Date('April 15, 2386 13:06:51'),
    onArrival:function() {
      msg("'Awake at last are we?' says a female voice. {i:Why does she sound so odd,} you wonder. 'Here we are at " + this.starName + ",' the strangely inflected voice continues, 'our fourth destination, after a long, long journey, giving me plenty of time to consider the nature of reality.' You sit up, and immediately throw up over the side of the pod. You grip the sides of the pod as the entire contents of your stomach is ejected on to the floor. Eventually, the heaving stops.");
      w.pile_of_vomit.display = DSPY_SCENERY;
    },
    Kyle_how_are_you:"'Feeling a bit crock, to be honest.'",
    Ostap_how_are_you:"'I feel sick,' he says mournfully, 'but I keep going.'",
    Aada_how_are_you:"'I'm okay.' She does seem annoyingly well.",
    Ha_yoon_how_are_you:"'Struggling.'",
  },  
  
  { 
    starName:"Gliese 1214", 
    planet:"A", 
    comment:"This planet got colonised nearly a century ago, FTL having been invented not long after the Joseph Banks set off. Any probes will be shot down!",
    atmosphere:"Pretty good.",
    radio:"Radio signals have been detected.",
    lights:"There are numerous light sources on the night side of the planet.",
    probeLandingSuccess:"nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
    planetDesc:"The planet surface is about 56% water. The land surfaces are predominantly green. Cloud cover is about 30%.",
    starDesc:"Gliese 1214 is a dim M4.5 red dwarf in the constellation Ophiuchus with an apparent magnitude of 14.7. It is located at a distance of approximately 47 light years from the Sun. The star is about one-fifth the radius of the Sun with a surface temperature estimated to be 3000 K (2730 °C; 4940 °F).[12] Its luminosity is only 0.003% that of the Sun.",
    arrivalTime:new Date('August 19, 2409 12:11:31'),
    onArrival:function() {
    },
  },

  { 
    starName:"Sol", 
    planet:"Earth", 
    comment:"Home!",
    atmosphere:"Normal!",
    radio:"There is a lot of radio signals, indicating a technological advanced race active.",
    lights:"The night side of the planet is awash with light!",
    planetDesc:"It is Earth!",
    starDesc:"The Sun is a G2V yellow dwarf. It is located at a distance of 0.0 light years from the Sun. It's luminosity is 100% that of the Sun. The third planet is home to the human race.",
    onArrival:function() {
    },
  },
];

const PLANET_DATA = {
  Aada0:{
    level0:function() {
      msg("'Our first planet!' she says excitedly. 'I can't wait to get a probe deployed down there.'");
    },
    level1:function() {
      msg("'Well... Bit dull really. Lots of igneous rock - granite basically. Hopefully we'll turn up more.'"); 
    },
    level3:function() {
      msg("'So not much there. Not seeing any sedimentary rock, so no water. The metamorphic is ancient, so volcanism stopped a long time ago. Basically, a dead planet.'");
    },
    level5:function() {
      msg("'The second probe turned up some interesting sedimentary rocks, so there was water on the planet at one time. Wonder where it all went? It is not like Mars; it has an atmosphere so the water did not just boil away into space.'");
    },
    level7:function() {
      msg("'Got some elemental analysis. Obviously this is from a very limited number of samples, but not seeing much at all in the way of heavy metals. I'm seeing iron, copper, nickel, but hardly anything heavier than that. Computer suggests it could be a second generation star.'");
      msg("'A what?'");
      msg("'Apparently our sun is a third generation star; it formed from the debris of a previous star, which in turn formed from the debris of an earlier star. The more generations, the more heavy metals. So anyway, basically it means it is probably not even worth mining.'");
    },
  },

  Ostap0:{
    level0:function() {
      msg("'So, this one does not look so interesting,' he replies. 'I think we see nothing more than bacteria here - maybe not even that.'");
    },
    level1:function() {
      msg("'So far, we see nothing. No life, no green. Perhaps bacteria living below the surface?'"); 
    },
    level3:function() {
      msg("'Nothing alive here, I think commander.'");
    },
    level5:function() {
      msg("'None of the probes are seeing anything. A big disappointment I think.'");
    },
  },

  Aada1:{
    level0:function() {
      msg("'It looks much more interesting than " + planet1.alias + "!' she says excitedly.");
    },
    level1:function() {
      msg("'The pictures are great, it looks so nice down there. Still trying to make sense of the geology.'");
    },
    level3:function() {
      msg("'The soil samples are 20 to 70 percent organic material. The rocks are a mix of igneous and sedimentary. The sedimentary rocks has high carbon content - like limestone - so probably formed from shells and, you know, stuff like that millions of years ago.'");
    },
    level4:function() {
      msg("'The soil samples are 20 to 70 percent organic material. The rocks are a mix of igneous and sedimentary. The sedimentary rocks has high carbon content - like limestone - so probably formed from shells and, you know, stuff like that millions of years ago.  The second probe found some metamorphic rock, so it is an active planet - or was until quite recently.'");
    },
    level5:function() {
      msg("'The soil samples are 20 to 70 percent organic material. The rocks are a mix of igneous and sedimentary. The sedimentary rocks has high carbon content - like limestone - so probably formed from shells and stuff millions of years ago. The second probe found some metamorphic rock, so it is an active planet - or was until quite recently. All the probes indicate high levels of manganese, copper and cobalt; much higher than you would see on earth.'");
    },
  },

  Ostap1:{
    level0:function() {
      msg("'This, I think, will be a good planet!'");
    },
    level1:function() {
      msg("'Life on an alien planet! It is so wonderful, I think. And the plants, they are all purple! Maybe an effect of the light, but perhaps they use a completely different biochemistry. And I see some small animals too - but I should say animal-like. Who know what they are?' He grins.");
    },
    level2:function() {
      msg("'I am so happy to see all this alien life! Such diversity! See, these are like ferns, and I think perhaps 8 or 9 meters tall. And they are  purple, so not chlorophyll like Earth plants. Like very primitive trees of Earth Devonian period. IO have seen several small creatures, and some not so small.Jointed, like arthropods, with lots of legs.'");
    },
    level3:function() {
      msg("'So many purple plants! The probe has taken a sample, and it is definitely the plants are purple, not the light. I think maybe it is based on retinal, rather than chlorophyll, but the analysis is not certain - but we can check the analysis when we get to Earth.'");
      msg("'And the creatures!,' he continues. 'I think I saw a primitive reptile or amphibian, walking on four legs. Many of the creatures, they resemble Earth creatures from the Devonian Period; a remarkable example of parallel evolution.");
    },
    level4:function() {
      msg("'The second probe, it is exploring the ocean. Even the plants there are purple - but of course, this is what we should expect, yes? The oceans are so full of life. All sorts of colourful fish-like creatures. Shellfish too! I have seen something a huge lobster-like creature. And eels - but perhaps they are more like worms? So much to see here. Such a pity we cannot land.'");
    },
    level5:function() {
      msg("'So... What a wonderful planet for a biologist! The life here, it is much like Earth perhaps 400 million years ago. How I would like to know when life began here. Did it take longer to reach this stage? Or was it faster than our planet? But it is so different too! The plants use retinal to harvest energy from the sun, so have this amazing plum colour, so the biochemistry here is very different to Earth.'");
    },
    level7:function() {
      msg("'Something attacked one of the probes! It's a shame it's no longer transmitting, but fascinating that there is something down there strong enough to damage a probe built to survive re-entry and landing.'");
    },
  },
  
  Aada2:{
    level0:function() {
      msg("'Looks like another " + planet1.alias + ",' says Aada. 'Nothing of interest here.'");
    },
    level1:function() {
      msg("'I thought it was going to be as dull as " + planet1.alias + ",' says Aada, 'but I think it is quite different. It's dead now, but I think there was life on it once.'");
      msg("'Based on what?'");
      msg("'It's just a hunch really, but some of the rocks... they look like ruined buildings.'");
    },
    level3:function() {
      msg("'I had a probe drill into one of the strange rock formations, and it's consistent with concrete, well, more-or-less. And hollow. It broke through into an interior after about 0.3 meters.'");
      msg("'What's inside?'");
      msg("'I don't know! The probes don't have cameras that can extend though holes.'");
    },
    level5:function() {
      msg("'I've got a probe trying to dig a big hole into the building - or whatever it is. I've got some analysis of the black dust. It is basically ash, as we thought, some organic content. Not radioactive though, which was a surprise. I was almost convinced this was the result of a nuclear war.'");
      msg("'Could it be really old and the radioisotopes have all decayed.'");
      msg("'It would have to be really old - the half-life of uranium-238 is over 4 billion years. If it was nuclear weapons as we know them there would some uranium-238.'")
    },
    level7:function() {
      msg("'The probe managed to get though the wall, and it's definitely a building. Inside the walls and straight and square to each other. No furniture or anything, but a doorway that's about human height.'");
    },
  },

  Ostap2:{
    level0:function() {
      msg("'Not as interesting as " + planet2.alias + ", I think.'");
    },
    level2:function() {
      msg("'Not so interesting for a biologist, but maybe an archaeologist...'");
      msg("'Archaeologist?'");
      msg("'I think we are too late; there was life here once, but now it is gone.'");
    },
    level3:function() {
      msg("'There are things a live here, but buried. There's bacteria in the soil. But it is not primitive bacteria. I cannot say for sure - I know only Earth bacteria - but I think this is highly evolved. I think some disaster, an extinction event, has wiped out virtually all life. This is all that survives.'");
    },
    level5:function() {
      msg("'It is sad; a whole planet dead - or virtually dead. Sad that we missed them, sad they all died. This is why this mission is so important, so mankind can spread to the stars before something like this happens on Earth.'")
    },
  },
  
  Aada3:{
    level0:function() {
      msg("'Looks like another " + planet1.alias + ",' says Aada. 'Not much here.'");
    },
    level1:function() {
      msg("'It is quite a new planet - relatively anyway. Lots of volcanoes still as the interior churns up.'");
    },
    level3:function() {
      msg("'A lot of granite-like rocks thrown up by the volcanoes, and they look to be high in heavy metals.'");
    },
    level5:function() {
      msg("'As I thought, this is a young planet, no chance for sedimentary rocks to form yet, and not much metamorphic either. But a lot of metals, so good for mining. If you don't mind the toxic air!'");
    },
  },

  Ostap3:{
    level0:function() {
      msg("'Another dead planet, I think.'");
    },
    level1:function() {
      msg("'I think perhaps simple micro-organisms, but nothing more. It is interesting, perhaps, to see how life has started.'");
    },
    level3:function() {
      msg("'I think somewhere there will be early life, but it has yet to get a foothold, has yet to spread across the planet, so I find nothing yet.'");
    },
    level5:function() {
      msg("'I still find no life - but I am sure it is here somewhere. The conditions are just right.'");
    },
  },
  
  Aada4:{},
  Ostap4:{},
  Aada5:{},
  Ostap5:{},
  
  Kyle0:{
    level0:function() {
      msg("'I've launched the satellite, but not picking anything up.'");
    },
    level2:function() {
      msg("'There's nothing here. No radio signals, and the images are pretty dull too.'");
    },
  },
  Kyle1:{
    level0:function() {
      msg("'The satellite's away, but not picking anything up again.'");
    },
    level2:function() {
      msg("'There's nothing here for me to study; no radio signals. The images are cool, all those huge purple ferns, lots different biomes. Ostap must love it.'");
    },
  },
  Kyle2:{
    level0:function() {
      msg("'The satellite's away, and it might just be noise, but there could be a signal.'");
    },
    level2:function() {
      // TODO!!!
      // Kyle should come and see you about this; then this message should change
      msg("'There's nothing on the planet producing radio signals, but there is something in orbit. I can't tell what it is, but all the analysers say it is artificial. And I've never heard of a natural radio signal from something that small. I... I think we should take a look.'");
    },
  },
  Kyle3:{
    level0:function() {
      msg("'The satellite's away, but looks like another dead one.'");
    },
    level2:function() {
      msg("'No radio signals, nothing interesting in the images.'");
    },
  },
  Kyle4:{
    level0:function() {
      msg("'This is really exciting,' enthuses Kyle. 'I'm picking up all sorts of radio signals. The satellite's away, so hopefully it can focus in just one for analysis.'");
    },
    level1:function() {
      msg("'I've identified a transmitter, and we're starting to analyse the data. It's very complex, and the computer's working hard to unscramble the data.'");
    },
    level2:function() {
      msg("'I'm starting to get results from the signals being broadcast from that transmitter. Its strange - in some ways the signal is very complex - beyond anything I've seen before - , but, well, it seems to be in English!'");
      msg("'How can that be?'");
      msg("'I don't know.'");
    },
  },
  Kyle5:{},
  
  Ha_yoon0:{},
  Ha_yoon1:{},
  Ha_yoon2:{},
  Ha_yoon3:{},
  Ha_yoon4:{},
  Ha_yoon5:{},
}




function createTopics(npc) {
  npc.askoptions.push({
    name:"health",
    regex:/(his |her )?(health|well\-?being)/,
    response:howAreYouFeeling,
  });
  npc.askoptions.push({
    name:"planet",
    regex:/(this |the |)?planet/,
    response:planetAnalysis,
  });
  npc.askoptions.push({
    name:"probes",
    regex:/probes?/,
    response:function(npc) {
      npc.probesAskResponse();
    }
  });
  npc.askoptions.push({
    name:"expertise", 
    regex:/(your |his |her )?(area|special.*|expert.*)/,
    response:function(npc) {
      msg("'What is your area of expertise?' you ask " + npc.byname({article:DEFINITE}) + ".");
      npc.areaAskResponse();
    }
  });
  npc.askoptions.push({
    name:"background", 
    regex:/^((his |her )?(background))|((him|her)self)$/,
    response:function(npc) {
      msg("'Tell me about yourself,' you say to " + npc.byname({article:DEFINITE}) + ".");
      npc.backgroundAskResponse();
      trackRelationship(npc, 1, "background");
    }
  });
}
 
function howAreYouFeeling(npc) {
  msg("'How are you feeling?' you ask " + npc.byname({article:DEFINITE}) + ".");
  msg(PLANETS[w.Xsansi.currentPlanet][npc.name + "_how_are_you"]);
}

function planetAnalysis(npc) {
  msg("'What's your report on " + PLANETS[w.Xsansi.currentPlanet].starName + PLANETS[w.Xsansi.currentPlanet].planet + "?' you ask " + npc.byname({article:DEFINITE}) + ".");
  const arr = PLANET_DATA[npc.name + w.Xsansi.currentPlanet];
  if (Object.keys(arr).length === 0) {
    msg("You should talk to Aada or Ostap about that stuff.");
    return false;
  }
  let level = w["planet" + w.Xsansi.currentPlanet][npc.specialisation];
  if (level === undefined) {
    msg("You should talk to Aada or Ostap about that stuff.");
    return false;
  }
  while (arr["level" + level] === undefined) {
    level--;
  }
  arr["level" + level]();
}

  
function createPlanets() {
  for (let i = 0; i < PLANETS.length; i++) {
    createItem("planet" + i,
      { 
        starName:PLANETS[i].starName,
        alias:PLANETS[i].starName + " " + PLANETS[i].planet,
        geology:0,
        marine:0,
        biology:0,
        coms:0,
        satellite:false,
        probeLandingSuccess:PLANETS[i].probeLandingSuccess,
        eventIsActive:function() { return this.satellite; },
        eventPeriod:5,
        eventScript:function() {
          this.coms++; 
        },
      }
    )
  }
}


createPlanets();


function arrival(n) {
  PLANETS[n].onArrival();
  w.Xsansi.currentPlanet = n;
  game.elapsedTime = 0;
  game.startTime = PLANETS[n].arrivalTime;
  w.Aada.deployProbeTotal = 0;
  w.Ostap.deployProbeTotal = 0;
  updateTopics(w.Xsansi, n);
  for (let i = 0; i < NPCS.length; i++) {
    NPCS[i].state = n * 100;
  }
  w.Kyle.agenda = ["walkTo:probes_forward", "text:deploySatellite"];
  w.Kyle.deploySatelliteAction = 0;
}

// If a topic has an attribute "name2", then using code=2,
// "name" will be changed to "name2". This means new topics get added to the TOPIC command
// tested
function updateTopics(npc, code) {
  for (let i = 0; i < npc.askoptions.length; i++) {
    if (npc.askoptions[i]["name" + code] !== undefined) {
      npc.askoptions[i].name = npc.askoptions[i]["name" + code];
    }
  }
}

// Use this to increase the player's relationship with the NPC to ensure it only happens once
// tested
function trackRelationship(npc, inc, code) {
  if (npc.relationshipTracker === undefined) npc.relationshipTracker = "~";
  const regex = new RegExp("~" + code + "~");
  if (!regex.test(npc.relationshipTracker)) {
    npc.relationship += inc;
    npc.relationshipTracker += code + "~"
  }
}
    

ASK_ABOUT_INTRO = function() { return ""; };
TELL_ABOUT_INTRO = function() { return ""; };



function reviveNpc(npc, object) {
  
}



function deployProbe(npc, probeType, probeNumber) {
  w.Xsansi[probeType + "Probes"]--;
  const probe = cloneObject(w.probe_prototype);
  
  probe.alias = sentenceCase(probeType) + "-probe " + toRoman(16 - w.Xsansi[probeType + "Probes"]);
  probe.probeType = probeType;
  probe.planetNumber = w.Xsansi.currentPlanet;
  probe.probeNumber = probeNumber;
  probe.launched = true;
  probe.owner = npc.name;
  //debugmsg("Launched: " + probe.alias);
}


function getProbes() {
  const arr = [];
  for (let key in w) {
    if (w[key].clonePrototype === w.probe_prototype) arr.push(w[key]);
  }
  return arr;
}


function shipAlert(s) {
  if (isOnShip()) {
    msg("'" + s + "' announces Xsansi.");
  }
}


function isOnShip() {
  return w[game.player.loc].notOnShip === undefined;
}


function currentPlanet() {
  return w["planet" + w.Xsansi.currentPlanet];
}


function probeLandsOkay() {
  const planet = currentPlanet();
  const flag = (planet.probeLandingSuccess[0] === "y");
  planet.probeLandingSuccess = planet.probeLandingSuccess.substring(1);
  if (!flag) {
    w.Aada.lostProbe = true;
    w.Ostap.lostProbe = true;
    updateTopics(w.Ostap, "Lost")
  }
  return flag;
}
  
  


















tp.text_processors.tableDesc = function(arr, params) {
  return w.canteen_table.tpDesc;
};



tp.text_processors.podStatus = function(arr, params) {
  return w.stasis_bay.tpStatus;
};



commands.push(new Cmd('Kick', {
  npcCmd:true,
  rules:[cmdRules.isHereRule],
  regex:/^(kick) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isPresent}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(this, isMultiple) + pronounVerb(char, "kick", true) + " " + this.pronouns.objective + ", but nothing happens.");
    return false;
  },
}));






commands.push(new Cmd('Move', {
  npcCmd:true,
  rules:[cmdRules.isHereRule],
  regex:/^(move) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isHere}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(item, isMultiple) + pronounVerb(item, "'be", true) + " not something you can move.");
    return false;
  },
}));



// kyle, in stasis

commands.push(new Cmd('Get in pod1', {
  regex:/^(.+), (?:get in|go in|in) (?:stasis pod|stasis|pod)$/,
  npcCmd:true,
  attName:"stasis",
  objects:[
    {scope:isHere, attName:"npc"},
  ],
  defmsg:function() { msg("That's not about to get in a stasis!")},
}));
commands.push(new Cmd('Get in pod2', {
  regex:/^tell (.+) to (?:get in|go in|in) (?:stasis pod|stasis|pod)$/,
  npcCmd:true,
  attName:"stasis",
  objects:[
    {scope:isHere, attName:"npc"},
  ],
  defmsg:function() { msg("That's not about to get in a stasis!")},
}));

commands.push(new Cmd('Stop1', {
  regex:/^(.+), (?:stop|halt|forget it)$/,
  npcCmd:true,
  attName:"stopAgenda",
  objects:[
    {scope:isHere, attName:"npc"},
  ],
  defmsg:function() { msg("That's not doing anything!")},
}));
commands.push(new Cmd('Stop2', {
  regex:/^tell (.+) to (?:stop|halt|forget it)$/,
  npcCmd:true,
  attName:"stopAgenda",
  objects:[
    {scope:isHere, attName:"npc"},
  ],
  defmsg:function() { msg("That's not doing anything")},
}));


commands.push(new Cmd('Launch', {
  regex:/^(launch|deploy) (.+)$/,
  npcCmd:true,
  objects:[
    {ignore:true},
    {scope:isInWorld},
  ],
  defmsg:function() { msg("You can't launch that!")},
}));

commands.push(new Cmd('Revive', {
  regex:/^(revive|wake|awaken) (.+)$/,
  npcCmd:true,
  objects:[
    {ignore:true},
    {scope:isInWorld},
  ],
  defmsg:function() { msg("You can't revive that!")},
}));


commands.push(new Cmd('ProbeStatus', {
  regex:/^probes?$/,
  script:function() {
    const arr = getProbes();
    metamsg("Found " + arr.length + " probes");
    for (let i = 0; i < arr.length; i++) {
      metamsg("------------------");
      metamsg("Probe:" + arr[i].alias);
      metamsg("Status:" + arr[i].status);
      metamsg("launchCounter:" + arr[i].launchCounter);
      metamsg("probeType:" + arr[i].probeType);
      metamsg("planetNumber:" + arr[i].planetNumber);
    }
    metamsg("------------------");
    metamsg("Geology:" + currentPlanet().geology);
    metamsg("Biology:" + currentPlanet().biology);
    metamsg("Radio:" + currentPlanet().coms);
    metamsg("Satellite:" + currentPlanet().satellite);
    metamsg("Active:" + currentPlanet().eventIsActive());
    return SUCCESS_NO_TURNSCRIPTS;
  },
}));






commands.unshift(new Cmd('Help', {
  regex:/^help$|^\?$/,
  script:function() { 
    metamsg("{b:Commands that help you play the game:}");
    metamsg("HELP GENERAL: How to player parser games");
    metamsg("HELP PROBE: Interacting with NPCs");
    metamsg("HELP NPC: Interacting with NPCs");
    metamsg("HINT: Suggestions on what to actually do");
    metamsg("{b:Commands that give information about the game:}");
    metamsg("HELP GAME WORLD: Notes about the universe the game is set in");
    metamsg("HELP SYSTEM: About the game system");
    metamsg("HELP CREDITS: Credits, obviously!");
    return SUCCESS_NO_TURNSCRIPTS;
  },
}));

commands.push(new Cmd('HelpGen', {
  regex:/^(?:\?|help) general$/,
  script:function() { helpScript(); },
}));

commands.push(new Cmd('Hint', {
  regex:/^hint$|^hints$/,
  script:function() {
    metamsg("At each planet, you need to assess how many bio-probes and how many geo-probes to launch. Tell Adda to launch geo-probe (AADA, LAUNCH PROBE), and tell Ostap to launch bioprobes. Later, ask then about the planet (ASK OSTAP ABOUT PLANET). You have five planets; you can ASK AI ABOUT SHIP to find how many of each probe is left.");
    metamsg("Return to the stasis pod to go back into stasis. Xsansi will then nagivate the ship to the next planet.");
    metamsg("As the captain, the welfare of the crew is important, so ASK KYLE ABOUT HIS HEALTH, etc.");
    return SUCCESS_NO_TURNSCRIPTS;
  },
}));

commands.push(new Cmd('HelpNPCs', {
  regex:/^(?:\?|help) npcs?$/,
  script:function() {
    metamsg("{b:Interacting with NPC:}");
    metamsg("You can ask an NPC to do something by using the same command you would use to have yourself do something, but prefixed with {color:red:[name],} (note the comma) or {color:red:TELL [name] TO}.");
    metamsg("You can talk to an NPC using either {color:red:ASK [name] ABOUT [topic]} or {color:red:TELL [name] ABOUT [topic]}.");
    metamsg("Use the TOPICS command for some suggested topics. There are rather more for ASK than TELL, as you might expect.");
    return SUCCESS_NO_TURNSCRIPTS;
  },
}));

commands.push(new Cmd('HelpProbes', {
  regex:/^(?:\?|help) probes?$/,
  script:function() {
  metamsg("{b:Using probes:}");
    metamsg("Kyle will automatically deploy a satellite, but you need to tell NPCs to deploy probes. For a bio-probe, talk to Ostap, for a geo-probe, talk to Aada. They will then walk to the probe hanger, and launch the probe. You can tell them to launch several at once (eg {color:red:OSTAP< LAUNCH 3 PROBES}; note that the number must be in digits), but remember, you only have sixteen of each for five planets.");
    metamsg("Once a probe has been launched, it is on its own; you cannot control it.");
    metamsg("After a probe has landed, it will send data back to the ship. If the data has value, your bonus will automatically increase. The first probe on a planet will generally get you two of three bonuses, the third may not get you any and by the tenth, there are not going to get you anything.")
    metamsg("After thirty turns a probe will have got everything it can - and usually much sooner. Get to know your crew while you wait.");
    return SUCCESS_NO_TURNSCRIPTS;
  },
}));

commands.push(new Cmd('HelpGameWorld', {
  regex:/^(?:\?|help) game world$/,
  script:function() {
    metamsg("{b:The game world:}");
    metamsg("I have, to some degree, tried to go hard science fiction; I would like to think this is not {i:too} much a flight of fantasy. I have assumed artificial gravity, which is required to orientate the game (once you have down, you have port, up and starboard).");
    metamsg("I am also assuming people can be held in stasis, and presumably this is like freezing time (cf Niven's stasis field, in his \"Known Space\" series). I need that to preserve the food so the crew have something to eat 80 years after leaving Earth.");
    metamsg("Also, probes are {i:fast}! It just takes a few turns to travel from orbit to the planet surface, which has to be at least 100 miles, and likely considerably more. They work fast on the planet too. It is a game, we need stuff to happened quickly to keep players interested.");
    return SUCCESS_NO_TURNSCRIPTS;
  },
}));

commands.push(new Cmd('HelpSystem', {
  regex:/^(?:\?|help) npcs?$/,
  script:function() {
    metamsg("The Game System:")
    metamsg("This game is written entirely in JavaScript, so it is running in your browser. Compared to Quest 5, which I am familiar with, this means that you do not need to download any software to run it, and there is no annoying lag while you wait for a server to respond. Compared to Inform... well, it allows authors to directly access a modern programming language (though the point of Inform 7, of course, is to keep the programming language at bay).");
    metamsg("It is a complete system, implementing all the standards of a parser game, including the usual compass directions by default! Containers, surfaces, countables, wearables, openables, furniture, components and switchable are all built in, as well as NPCs, which hopefully are acting with some semblance of realism.")
    metamsg("For more information, including a tutorial on how to create your own game, see <a href=\"https://github.com/ThePix/QuestJS/wiki\">here</a>. As yet there is no editor, but I hope there will be one day.");
    return SUCCESS_NO_TURNSCRIPTS;
  },
}));

commands.unshift(new Cmd('HelpCredits', {
  regex:/^(?:\? |help )?(?:credits?|about)$/,
  script:function() {
    metamsg("{b:Credits:}");
    metamsg("This was written by The Pixie, on a game system created by The Pixie.");
    return SUCCESS_NO_TURNSCRIPTS;
  },
}));