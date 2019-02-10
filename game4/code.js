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








Ship

The mission assumes only a day at each planet, so there are supplies for two weeks, held in stasis. There is water and oxygen for a month. In fact, there is more, as the ship is under-manned.

Has no weapons, besides light arms for the crew (e-locked)




*/



$("#panes").append("<img src=\"images/spaceship.png\" style=\"margin-left:10px;margin-top:15px;\"/>");

const TURNS_TO_LANDING = 3;
const TURNS_TO_DATA = 3;
const PLANETS = [
  {
    starName:"HD 154088",
    planet:"D",
    atmosphere:"The atmosphere is 63% nitrogen, 17% carbon dioxide, 17% methane, 2% water and about 1% of various other gases including ethane, ammonia and hydrogen sulphide.",
    radio:"No radio signal detected.",
    lights:"There are no light sources on the night side of the planet.",
    planetDesc:"The planet is predominantly grey rock. There are no bodies of water on the surface and no cloud cover. It is 6.8 times the mass of Earth.",
    starDesc:"HD 154088 is a seventh magnitude metal-rich K-type main sequence star that lies approximately 58 light-years from Earth in the constellation of Ophiuchus.",
    comment:"A lifeless planet, with no water.",
    arrivalTime:new Date('December 22, 2325 09:43:43'),
    onArrival:function() {},
    Kyle_how_are_you:"'I'm good, mate.'",
    Ostap_how_are_you:"'I am feeling good.'",
    Aada_how_are_you:"'I'm okay.'",
    Ha_yoon_how_are_you:"'I... feel a little queasy. It's just the stasis, nothing I can't handle.'",
  },
    
  { 
    starName:"HD 168746", 
    planet:"B", 
    atmosphere:"The atmosphere is 71% nitrogen, 15% oxygen, 3% carbon dioxide  and about 1% of various other gases including water and methane.",
    radio:"No radio signal detected.",
    lights:"There are no light sources on the night side of the planet.",
    planetDesc:"The planet surface is about 75% water. The land surfaces are predominantly purple. Cloud cover is about 40%.",
    starDesc:"HD 168746 is an 8th magnitude star in the constellation of Serpens, 139 light years from Earth. It is very similar to our Sun, a yellow dwarf star (spectral class G5V).",
    comment:"Lots of life, at about the Devonian Period, with purple planets.",
    arrivalTime:new Date('March 3, 2340 11:05:30'),
    onArrival:function() {
      msg("'Good morning,' says a female voice. {i:Who the hell?} you wonder for a few minutes, before realising you are in a stasis pod again. 'We have arrived at " + this.starName + ",' the voice continues, 'our second destination, after a length journey without incident. You may be suffering from disorientation, nausea, headache and muscle fatigue. If symptoms persist, you should seek medical advice.' You sit up, and for a moment you do feel dizzy, but it soon passes.");
    },
    Kyle_how_are_you:"'I'm okay,' he says, a little uncertainly.",
    Ostap_how_are_you:"'When I woke, that was not good! But now, I am feeling good.'",
    Aada_how_are_you:"'I'm okay.'",
    Ha_yoon_how_are_you:"'Not so good; I didn't think the stasis would be this bad. But I can still do my job.'",
  },
  
  { 
    starName:"HD 168443", 
    planet:"C", 
    atmosphere:"The atmosphere is 76% nitrogen, 22% oxygen, 1% carbon dioxide and about 1% of various other gases including water and carbon monoxide.",
    radio:"Radio signals have been detected.",
    lights:"There are no light sources on the night side of the planet.",
    planetDesc:"The planet surface is about 17% water. The land surfaces are predominantly black. Cloud cover is about 20%.",
    starDesc:"HD 168443 is a yellow dwarf star of (spectral type G5) about the mass of the Sun. It is in the constellation of Serpens Cauda, 129 light years from the Solar System. It is actually part of a binary, the other star is a brown dwarf, with a very long orbital period.",
    comment:"A dead planet, following some unknown event; previously had intelligent life. An artefact orbits the planet.",
    arrivalTime:new Date('October 21, 2362 06:21:39'),
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
    atmosphere:"The atmosphere is 53% nitrogen, 18% carbon dioxide, 12% nitrogen dioxide, 10% carbon monoxide, 7% nitrogen oxide, 4% sulphur dioxide, 3% hydrogen sulphide, 2% water and about 1% of various other gases including ammonia.",
    radio:"No radio signals have been detected.",
    lights:"There are no light sources on the night side of the planet.",
    planetDesc:"The planet surface is about 63% water. The land surfaces are predominantly grey and red. Cloud cover is about 25%. Several active volcanoes have been noted.",
    starDesc:"HD 148427 is a 7th-magnitude K-type subgiant star approximately 193 light years away in the constellation Ophiuchus. Its mass is 45% greater than the Sun, and it is three times the size and six times more luminous, although its age is 2½ billion years.",
    comment:"A lifeless planet, but it has water, so suitable for seeding. By this time the AI is doolally.",
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
    atmosphere:"Pretty good.",
    radio:"Radio signals have been detected.",
    lights:"There are numerous light sources on the night side of the planet.",
    planetDesc:"The planet surface is about 56% water. The land surfaces are predominantly green. Cloud cover is about 30%.",
    starDesc:"Gliese 1214 is a dim M4.5 red dwarf in the constellation Ophiuchus with an apparent magnitude of 14.7. It is located at a distance of approximately 47 light years from the Sun. The star is about one-fifth the radius of the Sun with a surface temperature estimated to be 3000 K (2730 °C; 4940 °F).[12] Its luminosity is only 0.003% that of the Sun.",
    comment:"This planet got colonised nearly a century ago, FTL having been invented not long after the Joseph Banks set off.",
    arrivalTime:new Date('August 19, 2409 12:11:31'),
    onArrival:function() {
    },
  },

  { 
    starName:"Sol", 
    planet:"Earth", 
    atmosphere:"Normal!",
    radio:"There is a lot of radio signals, indicating a technological advanced race active.",
    lights:"The night side of the planet is awash with light!",
    planetDesc:"It is Earth!",
    starDesc:"The Sun is a G2V yellow dwarf. It is located at a distance of 0.0 light years from the Sun. It's luminosity is 100% that of the Sun. The third planet is home to the human race.",
    comment:"Home!",
    onArrival:function() {
    },
  },
];

const PLANET_DATA = {
  geology0:[
    { level:0, fn:function() {
      msg("'Our first planet!' she says excitedly. 'I can't wait to get a probe deployed down there.'");
    },},
    { level:1, fn:function() {
      msg("'Well... Bit dull really. Lots of igneous rock - granite basically. Hopefully we'll turn up more.'"); 
    },},
    { level:3, fn:function() {
      msg("'So not much there. Not seeing any sedimentary rock, so no water. The metamorphic is ancient, so volcanism stopped a long time ago. Basically, a dead planet.'");
    },},
    { level:5, fn:function() {
      msg("'The second probe turned up some interesting sedimentary rocks, so there was water on the planet at one time. Wonder where it all went? It is not like Mars; it has an atmosphere so the water did not just boil away into space.'");
    },},
    { level:7, fn:function() {
      msg("'Got some elemental analysis. Obviously this is from a very limited number of samples, but not seeing much at all in the way of heavy metals. I'm seeing iron, copper, nickel, but hardly anythng heavier than that. Computer suggests it could be a second generation star.'");
      msg("'A what?'");
      msg("'Apparently our sun is a third generation star; it formed from the debris of a previous star, which in turn formed from the debris of an earlier star. The more generations, the more heavy metals. So anyway, basically it means it is probably not even worth mining.'");
    },},
  ],

  biology0:[
    { level:0, fn:function() {
      msg("'So, this one does not look so interesting,' he replies. 'I think we see nothing more than bacteria here - maybe not even that.'");
    },},
    { level:1, fn:function() {
      msg("'So far, we see nothing. No life, no green. Perhaps bacteria living below the surface?'"); 
    },},
    { level:3, fn:function() {
      msg("'Nothing alive here, I think commander.'");
    },},
    { level:5, fn:function() {
      msg("'None of the probes are seeing anything. A big disappointment I think.'");
    },},
  ],

  geology1:[
    { level:0, fn:function() {
      msg("'It looks much more interesting than " + planet1.alias + "!' she says excitedly.");
    },},
    { level:1, fn:function() {
      msg("'The pictures are great, it looks so nice down there. Still trying to make sense of the geology.'");
    },},
    { level:3, fn:function() {
      msg("'The soil samples are 20 to 70 percent organic material. The rocks are a mix of igneous and sedimentary. The sedimentary rocks has high carbon content - like limestone - so probably formed from shells and, you know, stuff like that millions of years ago.'");
    },},
    { level:4, fn:function() {
      msg("'The soil samples are 20 to 70 percent organic material. The rocks are a mix of igneous and sedimentary. The sedimentary rocks has high carbon content - like limestone - so probably formed from shells and, you know, stuff like that millions of years ago.  The second probe found some metamorphic rock, so it is an active planet - or was until quite recently.'");
    },},
    { level:5, fn:function() {
      msg("'The soil samples are 20 to 70 percent organic material. The rocks are a mix of igneous and sedimentary. The sedimentary rocks has high carbon content - like limestone - so probably formed from shells and stuff millions of years ago. The second probe found some metamorphic rock, so it is an active planet - or was until quite recently. All the probes indicate high levels of manganese, copper and cobalt; much higher than you would see on earth.'");
    },},
  ],

  biology1:[
    { level:0, fn:function() {
      msg("'This, I think, will be a good planet!'");
    },},
    { level:1, fn:function() {
      msg("'Life on an alien planet! It is so wonderful, I think. And the plants, they are all purple! Maybe an effect of the light, but perhaps they use a completely different biochemistry. And I see some small animals too - but I should say animal-like. Who know what they are?' He grins.");
    },},
    { level:2, fn:function() {
      msg("'I am so happy to see all this alien life! Such diversity! See, these are like ferns, and I think perhaps 8 or 9 meters tall. And they are  purple, so not chlorophyll like Earth plants. Like very primitive trees of Earth Devonian period. IO have seen several small creatures, and some not so small.Jointed, like arthropods, with lots of legs.'");
    },},
    { level:3, fn:function() {
      msg("'So many purple plants! The probe has taken a sample, and it is definitely the plants are purple, not the light. I think maybe it is based on retinal, rather than chlorophyll, but the analysis is not certain - but we can check the analysis when we get to Earth.'");
      msg("'And the creatures!,' he continues. 'I think I saw a primitive reptile or amphibian, walking on four legs. Many of the creatures, they resemble Earth creatures from the Devonian Period; a remarkable example of parallel evolution.");
    },},
    { level:4, fn:function() {
      msg("'The second probe, it is exploring the ocean. Even the plants there are purple - but of course, this is what we should expect, yes? The oceans are so full of life. All sorts of colourful fish-like creatures. Shellfish too! I have seen something a huge lobster-like creature. And eels - but perhaps they are more like worms? So much to see here. Such a pity we cannot land.'");
    },},
    { level:5, fn:function() {
      msg("'So... What a wonderful planet for a biologist! The life here, it is much like Earth perhaps 400 million years ago. How I would like to know when life began here. Did it take longer to reach this stage? Or was it faster than our planet? But it is so different too! The plants use retinal to harvest energy from the sun, so have this amazing plum colour, so the biochemistry here is very different to Earth.'");
    },},
    { level:7, fn:function() {
      msg("'Something attacked one of the probes! It's a shame it's no longer transmitting, but fascinating that there is something down there strong enough to damage a probe built to survive re-entry and landing.'");
    },},
  ],
  
  geology2:[
    { level:0, fn:function() {
      msg("'Looks like another " + planet1.alias + ",' says Adaa. 'Nothing of interest here.'");
    },},
    { level:1, fn:function() {
      msg("'I thought it was going to be as dull as " + planet1.alias + ",' says Adaa, 'but I think it is quite different. It's dead now, but I think there was life on it once.'");
      msg("'Based on what?'");
      msg("'It's just a hunch really, but some of the rocks... they look like ruined buildings.'");
    },},
    { level:3, fn:function() {
      msg("'I had a probe drill into one of the strange rock formations, and it's consistent with concrete, well, more-or-less. And hollow. It broke through into an interior after about 0.3 meters.'");
      msg("'What's inside?'");
      msg("'I don't know! The probes don't have cameras that can extend though holes.'");
    },},
    { level:5, fn:function() {
      msg("'I've got a probe trying to dig a big hole into the building - or whatever it is. I've got some analysis of the black dust. It is basically ash, as we thought, some organic content. Not radioactive though, which was a surprise. I was almost convinced this was the result of a nuclear war.'");
      msg("'Could it be really old and the radioisotopes have all decayed.'");
      msg("'It would have to be really old - the half-life of uranium-238 is over 4 billion years. If it was nuclear weapons as we know them there would some uranium-238.'")
    },},
    { level:7, fn:function() {
      msg("'The probe managed to get though the wall, and it's definitely a building. Inside the walls and straight and square to each other. No furniture or anything, but a doorway that's about human height.'");
    },},
  ],

  biology2:[
    { level:0, fn:function() {
      msg("'Not as interesting as " + planet2.alias + ", I think.'");
    },},
    { level:2, fn:function() {
      msg("'Not so interesting for a biologist, but maybe an archaeologist...'");
      msg("'Archaeologist?'");
      msg("'I think we are too late; there was life here once, but now it is gone.'");
    },},
    { level:3, fn:function() {
      msg("'There are things a live here, but buried. There's bacteria in the soil. But it is not primitive bacteria. I cannot say for sure - I know only Earth bacteria - but I think this is highly evolved. I think some disaster, an extinction event, has wiped out virtually all life. This is all that survives.'");
    },},
    { level:5, fn:function() {
      msg("'It is sad; a whole planet dead - or virtually dead. Sad that we missed them, sad they all died. This is why this mission is so important, so mankind can spread to the stars before something like this happens on Earth.'")
    },},
  ],
  
  geology3:[
    { level:0, fn:function() {
      msg("'Looks like another " + planet1.alias + ",' says Adaa. 'Not much here.'");
    },},
    { level:1, fn:function() {
      msg("'It is quite a new planet - relatively anyway. Lots of volcanoes still as the interior churns up.'");
    },},
    { level:3, fn:function() {
      msg("'A lot of granite-like rocks thrown up by the volcanoes, and they look to be high in heavy metals.'");
    },},
    { level:5, fn:function() {
      msg("'As I thoughtm this is ayoung planet, no chance for sedimentary rocks to form yet, and not much metamorphic either. But a lot of metals, so good for mining. If you don't mind the toxic air!'");
    },},
  ],

  biology3:[
    { level:0, fn:function() {
      msg("'Another dead planet, I think.'");
    },},
    { level:1, fn:function() {
      msg("'I think perhaps simple micro-organisms, but nothing more. It is interesting, perhaps, to see how life has started.'");
    },},
    { level:3, fn:function() {
      msg("'I think somewhere there will be early life, but it has yet to get a foothold, has yet to spread across the planet, so I find nothing yet.'");
    },},
    { level:5, fn:function() {
      msg("'I still find no life - but I am sure it is here somewhere. The conditions are just right.'")
    },},
  ],
  
  geology4:[],
  biology4:[],
  geology5:[],
  biology5:[],
}



function createAnalysisTopics(npc, area) {
  for (let i = 0; i < PLANETS.length; i++) {
    const data = PLANET_DATA[area + i];
    for (let j = 0; j < data.length; j++) {
      createItem(npc.name + "_planet" + i + "_" + j,
        TOPIC(false),
        { 
          loc:npc.name, 
          npc:npc.alias,
          alias:"Report on planet " + PLANETS[i].starName + " " + PLANETS[i].planet,
          area:area,
          planet:i,
          level:j,
          response:data[j].fn,
          script:function() {
            const planet = w["planet" + this.planet];
            const data = PLANET_DATA[this.area + this.planet];
            msg("'What's your report on " + planet.alias + "?' you ask " + this.npc + ".");
            this.response();
          },
        }
      );
    }
  }
}


function createHowAreYouTopics(npc) {
  for (let i = 0; i < PLANETS.length; i++) {
    createItem(npc.name + "_how_are_you_" + i,
      TOPIC(false),
      { 
        loc:npc.name,
        npc:npc.alias,
        alias:"How are you feeling?",
        response:PLANETS[i][npc.name + "_how_are_you"],
        script:function() {
          msg("'How are you feeling?' you ask " + this.npc + ".");
          msg(this.response());
        },
      }
    );
  }
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
        radio:0,
        satellite:false,
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
  
  for (let i = 0; i < NPCS.length; i++) {
    if (n > 0) w[NPCS[i].name + "_how_are_you_" + (n - 1)].hideTopic;
    w[NPCS[i].name + "_how_are_you_" + n].showTopic;
  }
}



ASK_ABOUT_INTRO = function() { return ""; };
TELL_ABOUT_INTRO = function() { return ""; };


/* Before sending a probe:
Are there radio signals?
Are there lights on the dark side?
Are there bodies of water and/or clouds?



  
*/


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



commands.push(new Cmd('Charge', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  regex:/^(charge) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isHeld}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(item, isMultiple) + pronounVerb(item, "'be", true) + " not something you can charge.");
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


commands.push(new Cmd('Hint', {
  regex:/^hint$|^hints$/,
  script:function() {
    metamsg("At each planet, you need to assess how many bio-probes and how many geo-probes to launch. Tell Adda to launch geo-probe (AADA, LAUNCH PROBE), and tell Ostap to launch bioprobes. Later, ask then about the planet (ASK OSTAP ABOUT PLANET). You have five planets; you can ASK AI ABOUT SHIP to find how many of each probe is left.");
    metamsg("Return to the stasis pod to go back into stasis. Xsansi will then nagivate the ship to the next planet.");
    metamsg("As the captain, the welfare of the crew is important, so ASK KYLE ABOUT HIS HEALTH, etc.");
  },
}));



commands.push(new Cmd('Launch', {
  regex:/^(launch) (.+)$/,
  npcCmd:true,
  objects:[
    {ignore:true},
    {scope:isInWorld},
  ],
  defmsg:function() { msg("You can't launch that!")},
}));






tp.addDirective("charger_state", function(){
  if (w.charger_compartment.closed) {
    return "The compartment is closed";
  }
  var contents = w.charger_compartment.getContents();
  if (contents.length === 0) {
    return "The compartment is empty";
  }
  return "The compartment contains " + formatList(contents, {article:INDEFINITE});
});
