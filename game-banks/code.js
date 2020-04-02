'use strict'

/*
The ship is on a long mission to visit various stars to survey them. It takes years between each one, so the crew are in stasis. The shop has an AI that controls the ship between stars, and on arrival does the initial scans, looking for anything interesting. The ship does not have the capability to land (it has two escape pods that can be used to land, but not get off the planet again).

There are:
Six stasis pods
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

Each awakening gets steadily worse, by the fourth you are throwing up.

*/

'use strict'

$('#panes').append('<img src="images/spaceship.png" style="margin-left:10px;margin-top:15px;"/>')

const TURNS_TO_LANDING = 3
const TURNS_TO_DATA = 3
const PLANETS = [
  {
    starName: 'HD 154088',
    planet: 'D',
    comment: 'Planet 1: A lifeless planet, with no water, not much minerals either; an easy one to start with',
    atmosphere: 'The atmosphere is 63% nitrogen, 17% carbon dioxide, 17% methane, 2% water and about 1% of various other gases including ethane, ammonia and hydrogen sulphide.',
    radio: 'No radio signal detected.',
    lights: 'There are no light sources on the night side of the planet.',
    planetDesc: 'The planet is predominantly grey rock. There are no bodies of water on the surface and no cloud cover. It is 6.8 times the mass of Earth.',
    starDesc: 'HD 154088 is a seventh magnitude metal-rich K-type main sequence star that lies approximately 58 light-years from Earth in the constellation of Ophiuchus.',
    probeLandingSuccess: 'ynyyyynyyyynyyynnyyynnnyynyyyyyyyynynyyynynnynyyyyyyyynynyyy',
    geoProbeRanks: [
      [3, 7, 12],
      [5],
      [4],
      [6]
    ],
    geoProbeBonusPerRank: 2,
    bioProbeRanks: [
      [3, 7, 10],
      [2, 6],
      [2, 7],
      [6]
    ],
    bioProbeBonusPerRank: 1,
    arrivalTime: new Date('December 22, 2325 09:43:43'),
    onArrival: function () {
      w.Ha_yoon.status = Math.min(w.Ha_yoon.status, 96)
      w.Kyle.status = Math.min(w.Kyle.status, 98)
      io.msg('{i:The "Joseph Banks" left Earth orbit in 2319, on a centuries-long mission to survey five relatively close star systems. The crew were put in stasis for the long journey between the stars.}')
      wait(function () {
        io.msg('&nbsp;')
        io.msg("'Good morning,' says a female voice. {i:Who the hell?} you wonder for a few minutes, before realising you are in a stasis pod. You sit up. 'We have arrived at " + PLANETS[0].starName + ",' the voice continues, 'our first destination, without incident.' It is Xsansi, the ship AI, who has been piloting the ship for the last twenty years or whatever. 'You may be suffering from disorientation, nausea, headache and muscle fatigue. If symptoms persist, you should seek medical advice.'")
        world.enterRoom()
      })
    },
    Kyle_how_are_you: "'I'm good, mate. Why? Why shouldn't I be?'",
    Ostap_how_are_you: "'I am feeling good.'",
    Aada_how_are_you: "'I'm okay.'",
    Ha_yoon_how_are_you: "'I... feel a little queasy. It's just the stasis, nothing I can't handle.'"
  },

  {
    starName: 'HD 168746',
    planet: 'B',
    comment: 'Planet 2 (hull breach): Lots of life, at about the Devonian Period, with purple planets. Good metals too. But need to sort out the hull breach first. Or accept some of the ship is inaccessible.',
    atmosphere: 'The atmosphere is 71% nitrogen, 15% oxygen, 3% carbon dioxide  and about 1% of various other gases including water and methane.',
    radio: 'No radio signal detected.',
    lights: 'There are no light sources on the night side of the planet.',
    planetDesc: 'The planet surface is about 75% water. The land surfaces are predominantly purple. Cloud cover is about 40%.',
    starDesc: 'HD 168746 is an 8th magnitude star in the constellation of Serpens, 139 light years from Earth. It is very similar to our Sun, a yellow dwarf star (spectral class G5V).',
    probeLandingSuccess: 'yyyynyyyyyynyyyyynynyyynnnyynyyyyyyyynynyyynynnynyyyyyyyynynyyy',
    geoProbeRanks: [
      [3, 8, 12],
      [6],
      [7],
      [5]
    ],
    geoProbeBonusPerRank: 5,
    bioProbeRanks: [
      [2, 5, 8],
      [2, 4],
      [4, 3],
      [3, 3],
      [2, 3]
    ],
    bioProbeBonusPerRank: 5,
    arrivalTime: new Date('March 3, 2340 11:05:30'),
    onArrival: function () {
      io.msg("'Good morning,' says a female voice. {i:Who the hell?} you wonder for a few minutes, before realising you are in a stasis pod again. 'We have arrived at " + this.starName + ",' the voice continues, 'our second destination, after a lengthy journey, with a single incident. On the nineteenth of September, 2338 at 2104, ship time, the ship passed through a meteor shower, resulting in a loss of integrity in: the lounge, the captain's cabin, the top deck corridor.")
      io.msg("'You may be suffering from disorientation, nausea, headache and muscle fatigue. If symptoms persist, you should seek medical advice.' You sit up, and for a moment you do feel dizzy, but it soon passes.")
      game.player.status = Math.min(game.player.status, 95)
      w.Kyle.status = Math.min(w.Kyle.status, 93)
      w.Ostap.status = Math.min(w.Ostap.status, 96)
      w.Ha_yoon.status = Math.min(w.Ha_yoon.status, 84)
      w.Xsansi.status = 74
      w.Xsansi.pressureOverride = true
      w.lounge.leaks = true
      w.your_cabin.leaks = true
      w.top_deck_forward.leaks = true
      for (const key in w) {
        if (w[key].vacuum === false && w[key].name !== 'stasis_bay' && w[key].name !== 'stasis_pod_room') {
          w[key].vacuum = true
        }
      }
    },
    Kyle_how_are_you: "'I'm okay,' he says, a little uncertainly.",
    Ostap_how_are_you: "'When I woke, that was not good! But now, I am feeling good.'",
    Aada_how_are_you: "'I'm okay.'",
    Ha_yoon_how_are_you: "'Not so good; I didn't think the stasis would be this bad. But I can still do my job.'"
  },

  {
    starName: 'HD 168443',
    planet: 'C',
    comment: 'Planet 3 (intelligent life): A dead planet, following some unknown event; previously had intelligent life. An artefact orbits the planet. Player can pilot ship to the artefact, in a util.spacesuit if the flightdeck is not pressurised.',
    atmosphere: 'The atmosphere is 76% nitrogen, 22% oxygen, 1% carbon dioxide and about 1% of various other gases including water and carbon monoxide.',
    radio: 'A single radio signal has been detected.',
    lights: 'There are no light sources on the night side of the planet.',
    planetDesc: 'The planet surface is about 17% water. The land surfaces are predominantly black. Cloud cover is about 20%.',
    starDesc: 'HD 168443 is a yellow dwarf star of (spectral type G5) about the mass of the Sun. It is in the constellation of Serpens Cauda, 129 light years from the Solar System. It is actually part of a binary, the other star is a brown dwarf, with a very long orbital period.',
    arrivalTime: new Date('October 21, 2362 06:21:39'),
    probeLandingSuccess: 'yynyynyyyynyynyyyyynynyyynnnyynyyyyyyyynynyyynynnynyyyyyyyynynyyy',
    geoProbeRanks: [
      [3, 8, 15],
      [4],
      [3],
      [4]
    ],
    geoProbeBonusPerRank: 4,
    bioProbeRanks: [
      [4, 7, 11],
      [4, 7],
      [3, 7],
      [3]
    ],
    bioProbeBonusPerRank: 2,
    onArrival: function () {
      io.msg("'Good morning,' says a female voice. {i:Xsansi,} you think to yourself. 'We have arrived at " + this.starName + ",' the voice continues, 'our third destination, after a long and oh-so-tedious journey. You may be suffering from disorientation, nausea, headache and muscle fatigue, but I expect that is nothing to decades of loniness, right? If symptoms persist, I suggest you man-up.' You sit up, and immediately feel sick. You grip the sides of the pod as the room spins, waiting for it stop. It is a few minutes before you feel well enough to actually think.")
      game.player.status = Math.min(game.player.status, 85)
      w.Kyle.status = Math.min(w.Kyle.status, 82)
      w.Ostap.status = Math.min(w.Ostap.status, 89)
      w.Ha_yoon.status = Math.min(w.Ha_yoon.status, 76)
      w.Aada.status = Math.min(w.Aada.status, 93)
      w.Xsansi.pressureOverride = false
    },
    Kyle_how_are_you: "'I'm okay. Well, not so bad, anyway.'",
    Ostap_how_are_you: "'I feel sick,' he says with a grin, 'but I keep going.'",
    Aada_how_are_you: "'I'm great.'",
    Ha_yoon_how_are_you: "'Feeling sick and dizzy, but I think I can keep going.'"
  },

  {
    starName: 'HD 148427',
    planet: 'D',
    comment: 'Planet 4 (fight the AI): A lifeless planet, but it has water, so suitable for seeding. By this time the AI is doolally. A young, fourth generation planet, good for mining.',
    atmosphere: 'The atmosphere is 53% nitrogen, 18% carbon dioxide, 12% nitrogen dioxide, 10% carbon monoxide, 7% nitrogen oxide, 4% sulphur dioxide, 3% hydrogen sulphide, 2% water and about 1% of various other gases including ammonia.',
    radio: 'No radio signals have been detected.',
    lights: 'There are no light sources on the night side of the planet.',
    planetDesc: 'The planet surface is about 63% water. The land surfaces are predominantly grey and red. Cloud cover is about 25%. Several active volcanoes have been noted.',
    starDesc: 'HD 148427 is a 7th-magnitude K-type subgiant star approximately 193 light years away in the constellation Ophiuchus. Its mass is 45% greater than the Sun, and it is three times the size and six times more luminous, although its age is 2½ billion years.',
    probeLandingSuccess: 'yyyyyynyyyyyyyyynynyyynnnyynyyyyyyyynynyyynynnynyyyyyyyynynyyy',
    geoProbeRanks: [
      [4, 9, 16],
      [],
      [4]
    ],
    geoProbeBonusPerRank: 5,
    bioProbeRanks: [
      [3, 8, 15],
      [3],
      [4]
    ],
    bioProbeBonusPerRank: 2,
    arrivalTime: new Date('April 15, 2386 13:06:51'),
    onArrival: function () {
      io.msg("'Awake at last are we?' says a female voice. {i:Why does she sound so odd?} you wonder. 'Here we are at " + this.starName + ",' the strangely inflected voice continues, 'our fourth destination, after a long, long journey, giving me plenty of time to consider the nature of reality.' You sit up, and immediately throw up over the side of the pod. You grip the sides of the pod as the entire contents of your stomach is ejected on to the floor. Eventually, the heaving stops.")
      w.pile_of_vomit.loc = 'stasis_bay'
      w.alienShip.status = 0
    },
    Kyle_how_are_you: "'Feeling a bit crock, to be honest.'",
    Ostap_how_are_you: "'I feel sick,' he says mournfully, 'but I keep going.'",
    Aada_how_are_you: "'I'm okay.' She does seem annoyingly well.",
    Ha_yoon_how_are_you: "'Struggling.'"
  },

  {
    starName: 'Gliese 1214',
    planet: 'A',
    comment: 'Planet 5 (already colonised): This planet got colonised nearly a century ago, FTL having been invented not long after the Joseph Banks set off. Any probes will be shot down!',
    atmosphere: 'Pretty good.',
    radio: 'Radio signals have been detected.',
    lights: 'There are numerous light sources on the night side of the planet.',
    probeLandingSuccess: 'nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
    planetDesc: 'The planet surface is about 56% water. The land surfaces are predominantly green. Cloud cover is about 30%.',
    starDesc: 'Gliese 1214 is a dim M4.5 red dwarf in the constellation Ophiuchus with an apparent magnitude of 14.7. It is located at a distance of approximately 47 light years from the Sun. The star is about one-fifth the radius of the Sun with a surface temperature estimated to be 3000 K (2730 °C; 4940 °F).[12] Its luminosity is only 0.003% that of the Sun.',
    arrivalTime: new Date('August 19, 2409 12:11:31'),
    onArrival: function () {
    }
  },

  {
    starName: 'Sol',
    planet: 'Earth',
    comment: 'Home!',
    atmosphere: 'Normal!',
    radio: 'There is a lot of radio signals, indicating a technological advanced race active.',
    lights: 'The night side of the planet is awash with light!',
    planetDesc: 'It is Earth!',
    starDesc: "The Sun is a G2V yellow dwarf. It is located at a distance of 0.0 light years from the Sun. It's luminosity is 100% that of the Sun. The third planet is home to the human race.",
    onArrival: function () {
    }
  }
]

const PLANET_DATA = {
  Aada0: {
    level0: function () {
      io.msg("'Our first planet!' she says excitedly. 'I can't wait to get a probe deployed down there.'")
    },
    level1: function () {
      io.msg("'Well... Bit dull really. Lots of igneous rock - granite basically. Hopefully we'll turn up more.'")
    },
    level3: function () {
      io.msg("'So not much there. Not seeing any sedimentary rock, so no water. The metamorphic is ancient, so volcanism stopped a long time ago. Basically, a dead planet.'")
    },
    level5: function () {
      io.msg("'The second probe turned up some interesting sedimentary rocks, so there was water on the planet at one time. Wonder where it all went? It is not like Mars; it has an atmosphere so the water did not just boil away into space.'")
    },
    level7: function () {
      io.msg("'Got some elemental analysis. Obviously this is from a very limited number of samples, but not seeing much at all in the way of heavy metals. I'm seeing iron, copper, nickel, but hardly anything heavier than that. Computer suggests it could be a second generation star.'")
      io.msg("'A what?'")
      io.msg("'Apparently our sun is a third generation star; it formed from the debris of a previous star, which in turn formed from the debris of an earlier star. The more generations, the more heavy metals. So anyway, basically it means it is probably not even worth mining.'")
    }
  },

  Ostap0: {
    level0: function () {
      io.msg("'So, this one does not look so interesting,' he replies. 'I think we see nothing more than bacteria here - maybe not even that.'")
    },
    level1: function () {
      io.msg("'So far, we see nothing. No life, no green. Perhaps bacteria living below the surface?'")
    },
    level3: function () {
      io.msg("'Nothing alive here, I think commander.'")
    },
    level5: function () {
      io.msg("'None of the probes are seeing anything. A big disappointment I think.'")
    }
  },

  Aada1: {
    level0: function () {
      io.msg("'It looks much more interesting than " + planet1.alias + "!' she says excitedly.")
    },
    level1: function () {
      io.msg("'The pictures are great, it looks so nice down there. Still trying to make sense of the geology.'")
    },
    level3: function () {
      io.msg("'The soil samples are 20 to 70 percent organic material. The rocks are a mix of igneous and sedimentary. The sedimentary rocks has high carbon content - like limestone - so probably formed from shells and, you know, stuff like that millions of years ago.'")
    },
    level4: function () {
      io.msg("'The soil samples are 20 to 70 percent organic material. The rocks are a mix of igneous and sedimentary. The sedimentary rocks has high carbon content - like limestone - so probably formed from shells and, you know, stuff like that millions of years ago.  The second probe found some metamorphic rock, so it is an active planet - or was until quite recently.'")
    },
    level5: function () {
      io.msg("'The soil samples are 20 to 70 percent organic material. The rocks are a mix of igneous and sedimentary. The sedimentary rocks has high carbon content - like limestone - so probably formed from shells and stuff millions of years ago. The second probe found some metamorphic rock, so it is an active planet - or was until quite recently. All the probes indicate high levels of manganese, copper and cobalt; much higher than you would see on earth.'")
    }
  },

  Ostap1: {
    level0: function () {
      io.msg("'This, I think, will be a good planet!'")
    },
    level1: function () {
      io.msg("'Life on an alien planet! It is so wonderful, I think. And the plants, they are all purple! Maybe an effect of the light, but perhaps they use a completely different biochemistry. And I see some small animals too - but I should say animal-like. Who know what they are?' He grins.")
    },
    level2: function () {
      io.msg("'I am so happy to see all this alien life! Such diversity! See, these are like ferns, and I think perhaps 8 or 9 meters tall. And they are  purple, so not chlorophyll like Earth plants. Like very primitive trees of Earth Devonian period. IO have seen several small creatures, and some not so small.Jointed, like arthropods, with lots of legs.'")
    },
    level3: function () {
      io.msg("'So many purple plants! The probe has taken a sample, and it is definitely the plants are purple, not the light. I think maybe it is based on retinal, rather than chlorophyll, but the analysis is not certain - but we can check the analysis when we get to Earth.'")
      io.msg("'And the creatures!,' he continues. 'I think I saw a primitive reptile or amphibian, walking on four legs. Many of the creatures, they resemble Earth creatures from the Devonian Period; a remarkable example of parallel evolution.")
    },
    level4: function () {
      io.msg("'The second probe, it is exploring the ocean. Even the plants there are purple - but of course, this is what we should expect, yes? The oceans are so full of life. All sorts of colourful fish-like creatures. Shellfish too! I have seen something a huge lobster-like creature. And eels - but perhaps they are more like worms? So much to see here. Such a pity we cannot land.'")
    },
    level5: function () {
      io.msg("'So... What a wonderful planet for a biologist! The life here, it is much like Earth perhaps 400 million years ago. How I would like to know when life began here. Did it take longer to reach this stage? Or was it faster than our planet? But it is so different too! The plants use retinal to harvest energy from the sun, so have this amazing plum colour, so the biochemistry here is very different to Earth.'")
    },
    level7: function () {
      io.msg("'Something attacked one of the probes! It's a shame it's no longer transmitting, but fascinating that there is something down there strong enough to damage a probe built to survive re-entry and landing.'")
    }
  },

  Aada2: {
    level0: function () {
      io.msg("'Looks like another " + planet1.alias + ",' says Aada. 'Nothing of interest here.'")
    },
    level1: function () {
      io.msg("'I thought it was going to be as dull as " + planet1.alias + ",' says Aada, 'but I think it is quite different. It's dead now, but I think there was life on it once.'")
      io.msg("'Based on what?'")
      io.msg("'It's just a hunch really, but some of the rocks... they look like ruined buildings.'")
    },
    level3: function () {
      io.msg("'I had a probe drill into one of the strange rock formations, and it's consistent with concrete, well, more-or-less. And hollow. It broke through into an interior after about 0.3 meters.'")
      io.msg("'What's inside?'")
      io.msg("'I don't know! The probes don't have cameras that can extend though holes.'")
    },
    level5: function () {
      io.msg("'I've got a probe trying to dig a big hole into the building - or whatever it is. I've got some analysis of the black dust. It is basically ash, as we thought, some organic content. Not radioactive though, which was a surprise. I was almost convinced this was the result of a nuclear war.'")
      io.msg("'Could it be really old and the radioisotopes have all decayed.'")
      io.msg("'It would have to be really old - the half-life of uranium-238 is over 4 billion years. If it was nuclear weapons as we know them there would some uranium-238.'")
    },
    level7: function () {
      io.msg("'The probe managed to get though the wall, and it's definitely a building. Inside the walls and straight and square to each other. No furniture or anything, but a doorway that's about human height.'")
    }
  },

  Ostap2: {
    level0: function () {
      io.msg("'Not as interesting as " + planet2.alias + ", I think.'")
    },
    level2: function () {
      io.msg("'Not so interesting for a biologist, but maybe an archaeologist...'")
      io.msg("'Archaeologist?'")
      io.msg("'I think we are too late; there was life here once, but now it is gone.'")
    },
    level3: function () {
      io.msg("'There are things a live here, but buried. There's bacteria in the soil. But it is not primitive bacteria. I cannot say for sure - I know only Earth bacteria - but I think this is highly evolved. I think some disaster, an extinction event, has wiped out virtually all life. This is all that survives.'")
    },
    level5: function () {
      io.msg("'It is sad; a whole planet dead - or virtually dead. Sad that we missed them, sad they all died. This is why this mission is so important, so mankind can spread to the stars before something like this happens on Earth.'")
    }
  },

  Aada3: {
    level0: function () {
      io.msg("'Looks like another " + planet1.alias + ",' says Aada. 'Not much here.'")
    },
    level1: function () {
      io.msg("'It is quite a new planet - relatively anyway. Lots of volcanoes still as the interior churns up.'")
    },
    level3: function () {
      io.msg("'A lot of granite-like rocks thrown up by the volcanoes, and they look to be high in heavy metals.'")
    },
    level5: function () {
      io.msg("'As I thought, this is a young planet, no chance for sedimentary rocks to form yet, and not much metamorphic either. But a lot of metals, so good for mining. If you don't mind the toxic air!'")
    }
  },

  Ostap3: {
    level0: function () {
      io.msg("'Another dead planet, I think.'")
    },
    level1: function () {
      io.msg("'I think perhaps simple micro-organisms, but nothing more. It is interesting, perhaps, to see how life has started.'")
    },
    level3: function () {
      io.msg("'I think somewhere there will be early life, but it has yet to get a foothold, has yet to spread across the planet, so I find nothing yet.'")
    },
    level5: function () {
      io.msg("'I still find no life - but I am sure it is here somewhere. The conditions are just right.'")
    }
  },

  Aada4: {},
  Ostap4: {},
  Aada5: {},
  Ostap5: {},

  Kyle0: {
    level0: function () {
      io.msg("'I've launched the satellite, but not picking anything up.'")
    },
    level2: function () {
      io.msg("'There's nothing here. No radio signals, and the images are pretty dull too.'")
    }
  },
  Kyle1: {
    level0: function () {
      io.msg("'The satellite's away, but not picking anything up again.'")
    },
    level2: function () {
      io.msg("'There's nothing here for me to study; no radio signals. The images are cool, all those huge purple ferns, lots different biomes. Ostap must love it.'")
    }
  },
  Kyle2: {
    level0: function () {
      io.msg("'The satellite's away, and it might just be noise, but there could be a signal.'")
    },
    level2: function () {
      // TODO!!!
      // Kyle should come and see you about this; then this message should change
      io.msg("'There's nothing on the planet producing radio signals, but there is something in orbit. I can't tell what it is, but all the analysers say it is artificial. And I've never heard of a natural radio signal from something that small. I... I think we should take a look.'")
    }
  },
  Kyle3: {
    level0: function () {
      io.msg("'The satellite's away, but looks like another dead one.'")
    },
    level2: function () {
      io.msg("'No radio signals, nothing interesting in the images.'")
    }
  },
  Kyle4: {
    level0: function () {
      io.msg("'This is really exciting,' enthuses Kyle. 'I'm picking up all sorts of radio signals. The satellite's away, so hopefully it can focus in just one for analysis.'")
    },
    level1: function () {
      io.msg("'I've identified a transmitter, and we're starting to analyse the data. It's very complex, and the computer's working hard to unscramble the data.'")
    },
    level2: function () {
      io.msg("'I'm starting to get results from the signals being broadcast from that transmitter. Its strange - in some ways the signal is very complex - beyond anything I've seen before - , but, well, it seems to be in English!'")
      io.msg("'How can that be?'")
      io.msg("'I don't know.'")
    }
  },
  Kyle5: {},

  Ha_yoon0: {},
  Ha_yoon1: {},
  Ha_yoon2: {},
  Ha_yoon3: {},
  Ha_yoon4: {},
  Ha_yoon5: {}
}

function createTopics (npc) {
  npc.askOptions.unshift({
    name: 'health',
    regex: /(his |her )?(health|well\-?being)/,
    util.test: function (p) { return p.text.match(this.regex) },
    response: howAreYouFeeling
  })
  npc.askOptions.unshift({
    name: 'planet',
    regex: /(this |the |)?planet/,
    response: planetAnalysis
  })
  npc.askOptions.unshift({
    name: 'probes',
    regex: /probes?/,
    util.test: function (p) { return p.text.match(this.regex) },
    response: function (npc) {
      npc.probesAskResponse()
    }
  })
  npc.askOptions.unshift({
    name: 'expertise',
    regex: /(your |his |her )?(area|special.*|expert.*|job|role)/,
    util.test: function (p) { return p.text.match(this.regex) },
    response: function (npc) {
      io.msg("'What is your area of expertise?' you ask " + npc.byname({ article: util.DEFINITE }) + '.')
      npc.areaAskResponse()
    }
  })
  npc.askOptions.unshift({
    name: 'background',
    regex: /^((his |her )?(background))|((him|her)self)$/,
    util.test: function (p) { return p.text.match(this.regex) },
    response: function (npc) {
      io.msg("'Tell me about yourself,' you say to " + npc.byname({ article: util.DEFINITE }) + '.')
      npc.backgroundAskResponse()
      trackRelationship(npc, 1, 'background')
    }
  })
}

function howAreYouFeeling (npc) {
  io.msg("'How are you feeling?' you ask " + npc.byname({ article: util.DEFINITE }) + '.')
  io.msg(PLANETS[w.Xsansi.currentPlanet][npc.name + '_how_are_you'])
}

function planetAnalysis (npc) {
  io.msg("'What's your report on " + PLANETS[w.Xsansi.currentPlanet].starName + PLANETS[w.Xsansi.currentPlanet].planet + "?' you ask " + npc.byname({ article: util.DEFINITE }) + '.')
  const arr = PLANET_DATA[npc.name + w.Xsansi.currentPlanet]
  if (Object.keys(arr).length === 0) {
    io.msg('You should talk to Aada or Ostap about that stuff.')
    return false
  }
  let level = w['planet' + w.Xsansi.currentPlanet][npc.specialisation]
  if (level === undefined) {
    io.msg('You should talk to Aada or Ostap about that stuff.')
    return false
  }
  while (arr['level' + level] === undefined) {
    level--
  }
  arr['level' + level]()
}

function createPlanets () {
  for (let i = 0; i < PLANETS.length; i++) {
    createItem('planet' + i,
      {
        starName: PLANETS[i].starName,
        alias: PLANETS[i].starName + ' ' + PLANETS[i].planet,
        geology: 0,
        marine: 0,
        biology: 0,
        coms: 0,
        satellite: false,
        probeLandingSuccess: PLANETS[i].probeLandingSuccess,
        eventIsActive: function () { return this.satellite },
        eventPeriod: 5,
        eventScript: function () {
          this.coms++
        }
      }
    )
  }
}

createPlanets()

function arrival () {
  w.Xsansi.currentPlanet++
  PLANETS[w.Xsansi.currentPlanet].onArrival()
  game.elapsedTime = 0
  game.startTime = PLANETS[w.Xsansi.currentPlanet].arrivalTime
  w.Aada.deployProbeTotal = 0
  w.Ostap.deployProbeTotal = 0
  updateTopics(w.Xsansi, w.Xsansi.currentPlanet)
  for (let i = 0; i < NPCS.length; i++) {
    NPCS[i].state = w.Xsansi.currentPlanet * 100
  }
  w.Kyle.agenda = ['walkTo:probes_forward', 'text:deploySatellite']
  w.Kyle.deploySatelliteAction = 0
}

// If a topic has an attribute "name2", then using code=2,
// "name" will be changed to "name2". This means new topics get added to the TOPIC command
// util.tested
function updateTopics (npc, code) {
  for (let i = 0; i < npc.askOptions.length; i++) {
    if (npc.askOptions[i]['name' + code] !== undefined) {
      npc.askOptions[i].name = npc.askOptions[i]['name' + code]
    }
  }
}

// Use this to increase the player's relationship with the NPC to ensure it only happens once
// util.tested
function trackRelationship (npc, inc, code) {
  if (npc.relationshipTracker === undefined) npc.relationshipTracker = '~'
  const regex = new RegExp('~' + code + '~')
  if (!regex.util.test(npc.relationshipTracker)) {
    npc.relationship += inc
    npc.relationshipTracker += code + '~'
  }
}

function reviveNpc (npc, object) {

}

function deployProbe (npc, probeType, probeNumber) {
  w.Xsansi[probeType + 'Probes']--
  const probe = cloneObject(w.probe_prototype)

  probe.alias = util.sentenCecase(probeType) + '-probe ' + util.toRoman(16 - w.Xsansi[probeType + 'Probes'])
  probe.probeType = probeType
  probe.planetNumber = w.Xsansi.currentPlanet
  probe.probeNumber = probeNumber
  probe.launched = true
  probe.owner = npc.name
  // debugio.msg("Launched: " + probe.alias);
}

function getProbes () {
  const arr = []
  for (const key in w) {
    if (w[key].clonePrototype === w.probe_prototype) arr.push(w[key])
  }
  return arr
}

function shipAlert (s) {
  if (isOnShip()) {
    io.msg("'" + s + "' announces Xsansi.")
  }
}

function isOnShip () {
  return w[game.player.loc].notOnShip === undefined
}

function currentPlanet () {
  return w['planet' + w.Xsansi.currentPlanet]
}

function probeLandsOkay () {
  const planet = currentPlanet()
  const flag = (planet.probeLandingSuccess[0] === 'y')
  planet.probeLandingSuccess = planet.probeLandingSuccess.substring(1)
  if (!flag) {
    w.Aada.lostProbe = true
    w.Ostap.lostProbe = true
    updateTopics(w.Ostap, 'Lost')
  }
  return flag
}

function isRoomPressured (room) {
  if (typeof room.vacuum === 'string') room = w[room.vacuum]
  return !room.vaccum
}

io.clickToContinueLink = function () {
  io.msg('<a class="continue" onclick="io.waitContinue()">Click...</a>')
  io.continuePrintId = io.nextid - 1
}

tp.text_processors.tableDesc = function (arr, params) {
  return w.canteen_table.tpDesc
}

tp.text_processors.podStatus = function (arr, params) {
  return w.stasis_bay.tpStatus
}

commands.push(new Cmd('Kick', {
  npcCmd: true,
  rules: [cmdRules.isHere],
  regex: /^(kick) (.+)$/,
  objects: [
    { ignore: true },
    { scope: parser.isPresent }
  ],
  default: function (item, isMultiple, char) {
    io.msg(util.util.prefix(item, isMultiple) + lang.pronounVerb(char, 'kick', true) + ' ' + item.pronouns.objective + ', but nothing happens.')
    return false
  }
}))

commands.push(new Cmd('Move', {
  npcCmd: true,
  rules: [cmdRules.isHere],
  regex: /^(move) (.+)$/,
  objects: [
    { ignore: true },
    { scope: parser.isHere }
  ],
  default: function (item, isMultiple, char) {
    io.msg(util.util.prefix(item, isMultiple) + lang.pronounVerb(item, "'be", true) + ' not something you can move.')
    return false
  }
}))

// kyle, in stasis

commands.push(new Cmd('Get in pod1', {
  regex: /^(.+), (?:get in|go in|in) (?:stasis pod|stasis|pod)$/,
  npcCmd: true,
  attName: 'stasis',
  objects: [
    { scope: parser.isHere, attName: 'npc' }
  ],
  defio.msg: "That's not about to get in a stasis!"
}))
commands.push(new Cmd('Get in pod2', {
  regex: /^tell (.+) to (?:get in|go in|in) (?:stasis pod|stasis|pod)$/,
  npcCmd: true,
  attName: 'stasis',
  objects: [
    { scope: parser.isHere, attName: 'npc' }
  ],
  defio.msg: "That's not about to get in a stasis!"
}))

commands.push(new Cmd('Stop1', {
  regex: /^(.+), (?:stop|halt|forget it)$/,
  npcCmd: true,
  attName: 'stopAgenda',
  objects: [
    { scope: parser.isHere, attName: 'npc' }
  ],
  defio.msg: "That's not doing anything!"
}))
commands.push(new Cmd('Stop2', {
  regex: /^tell (.+) to (?:stop|halt|forget it)$/,
  npcCmd: true,
  attName: 'stopAgenda',
  objects: [
    { scope: parser.isHere, attName: 'npc' }
  ],
  defio.msg: "That's not doing anything"
}))

commands.push(new Cmd('Launch', {
  regex: /^(launch|deploy) (.+)$/,
  npcCmd: true,
  objects: [
    { ignore: true },
    { scope: parser.isInWorld }
  ],
  defio.msg: "You can't launch that!"
}))

commands.push(new Cmd('Revive', {
  regex: /^(revive|wake|awaken) (.+)$/,
  npcCmd: true,
  objects: [
    { ignore: true },
    { scope: parser.isInWorld }
  ],
  defio.msg: "You can't revive that!"
}))

commands.push(new Cmd('Pressurise', {
  regex: /^pressuri[sz]e (.+)$/,
  npcCmd: true,
  objects: [
    { scope: 'isRoom' }
  ],
  script: function (objects) {
    return handlePressurise(game.player, objects, true)
  }
}))
commands.push(new Cmd('Depressurise', {
  regex: /^(depressuri[sz]e|evacuate) (.+)$/,
  npcCmd: true,
  objects: [
    { ignore: true },
    { scope: 'isRoom' }
  ],
  script: function (objects) {
    return handlePressurise(game.player, objects, false)
  }
}))

commands.push(new Cmd('NpcPressurise1', {
  regex: /^(.+), ?pressuri[sz]e (.+)$/,
  objects: [
    { scope: parser.isHere, attName: 'npc' },
    { scope: 'isRoom' }
  ],
  script: function (objects) {
    var npc = objects[0][0]
    npc.actedThisTurn = true
    if (!npc.npc) {
      io.msg(CMD_not_npc(npc))
      return util.FAILED
    }
    objects.shift()
    return handlePressurise(npc, objects, true)
  }
}))
commands.push(new Cmd('NpcPressurise2', {
  regex: /^tell (.+) to pressuri[sz]e (.+)$/,
  objects: [
    { scope: parser.isHere, attName: 'npc' },
    { scope: 'isRoom' }
  ],
  script: function (objects) {
    var npc = objects[0][0]
    npc.actedThisTurn = true
    if (!npc.npc) {
      io.msg(CMD_not_npc(npc))
      return util.FAILED
    }
    objects.shift()
    return handlePressurise(npc, objects, true)
  }
}))
commands.push(new Cmd('NpcDepressurise1', {
  regex: /^(.+), ?(depressuri[sz]e|evacuate) (.+)$/,
  objects: [
    { scope: parser.isHere, attName: 'npc' },
    { ignore: true },
    { scope: 'isRoom' }
  ],
  script: function (objects) {
    var npc = objects[0][0]
    npc.actedThisTurn = true
    if (!npc.npc) {
      io.msg(CMD_not_npc(npc))
      return util.FAILED
    }
    objects.shift()
    return handlePressurise(npc, objects, false)
  }
}))
commands.push(new Cmd('NpcDepressurise2', {
  regex: /^tell (.+) to (depressuri[sz]e|evacuate) (.+)$/,
  objects: [
    { scope: parser.isHere, attName: 'npc' },
    { ignore: true },
    { scope: 'isRoom' }
  ],
  script: function (objects) {
    var npc = objects[0][0]
    npc.actedThisTurn = true
    if (!npc.npc) {
      io.msg(CMD_not_npc(npc))
      return util.FAILED
    }
    objects.shift()
    return handlePressurise(npc, objects, false)
  }
}))

function handlePressurise (char, objects, pressurise) {
  const baseRoom = objects[0][0]
  if (!baseRoom.room) {
    io.msg("You can't " + (pressurise || depressurise) + ' that.')
    return util.FAILED
  }
  if (char === game.player) {
    metaio.msg('You need to ask Xsansi to pressurise or depressurise any part of the ship.')
    return util.FAILED
  }
  // I am counting these as successes as the player has successfully made the request, even if it was refused
  if (char.name !== 'Xsansi') {
    io.msg("'You need to ask Xsansi to pressurise or depressurise any part of the ship.'")
    return util.SUCCESS
  }
  if (baseRoom.isSpace) {
    io.msg("'Scientists estimates the volume of space to be infinite. The ship does not have sufficient air to pressure space.'")
    return util.SUCCESS
  }
  const mainRoom = (typeof baseRoom.vacuum === 'string' ? w[baseRoom.vacuum] : baseRoom)
  if (mainRoom.vacuum !== pressurise) {
    io.msg("'" + util.sentenCecase(mainRoom.byname({ article: util.DEFINITE })) + ' is already ' + (pressurise ? 'pressurised' : 'depressurised') + '.')
    return util.SUCCESS
  }
  if (!w.Xsansi.pressureOverride && mainRoom.name !== 'airlock' && !pressurise) {
    io.msg("'Safety interlocks prevent depressurising parts of the ship while the crew are active.'")
    return util.SUCCESS
  }
  if (!pressurise) {
    io.msg("'Evacuating " + mainRoom.byname({ article: util.DEFINITE }) + "... Room is now under vacuum.'")
    mainRoom.vacuum = true
    return util.SUCCESS
  }
  if (mainRoom.leaks) {
    io.msg("'Pressurising " + mainRoom.byname({ article: util.DEFINITE }) + "... Pressurisation failed.'")
    return util.SUCCESS
  }

  io.msg("'Pressurising " + mainRoom.byname({ article: util.DEFINITE }) + "... Room is now pressurised.'")
  mainRoom.vacuum = false
  return util.SUCCESS
}

commands.push(new Cmd('Approach', {
  regex: /^approach (.+)$/,
  objects: [
    { scope: 'isShip' }
  ],
  script: function (objects) {
    if (!objects[0][0].isShip) {
      metaio.msg('The APPROACH command is for piloting the ship to a specific destination; a satellite or vessel for example.')
      return util.FAILED
    }
    if (game.player.loc !== 'flightdeck') {
      io.msg('You need to be on the flight-deck to pilot the ship.')
      return util.FAILED
    }
    if (w.alienShip.status === 0) {
      io.msg('There is no ship detected.')
      return util.FAILED
    }
    if (w.alienShip.status > 1) {
      io.msg("The {i:Joseph Banks} is already adjacent to the unidentified vessel.'")
      return util.FAILED
    }
    io.msg('You sit at the controls, and unlock the console. You type the co-ordinates into the system, and feel a noticeable pull as the ship accelerates to the target. At the half way point, the ship swings around, so the rockets are firing towards the target, slowing the ship down, so it comes to a stop, relative to the other ship.')
    w.alienShip.status = 2
    return util.SUCCESS
  }
}))

commands.push(new Cmd('Scan', {
  regex: /^scan (.+)$/,
  objects: [
    { scope: 'isShip' }
  ],
  script: function (objects) {
    if (!objects[0][0].isShip) {
      metaio.msg('The SCAN command is for scanning a target nearby in space, having approached it; a satellite or vessel for example.')
      return util.FAILED
    }
    if (game.player.loc !== 'flightdeck') {
      io.msg('You need to be on the flight-deck to scan the ship.')
      return util.FAILED
    }
    if (w.alienShip.status === 0) {
      io.msg('There is no ship detected.')
      return util.FAILED
    }
    if (w.alienShip.status === 1) {
      io.msg('The source of the radio signal is too far away to be properly scanned.')
      return util.FAILED
    }
    io.msg('Sat at the controls, you initiate a scan of the unknown ship...')
    io.msg('While you await the results, you look at the image on the screen. It is not big, less than half the length of the Joseph Banks, and a dull grey colour. It is all curves, without a straight edge anywhere, but it nevertheless looks lumpy rather than sleek. There is no obvious propulsion system, but you can see what might be an opening. There are no marking as far as you can see, and  no obvious weapons.')
    io.msg('The results of the scan appear on the screen. Unsurprisingly, the ship is not in the database. An XDR scan of the hull indicates it is made of an unknown intermetallic alloy of aluminium, nickel and arsenic.')
    io.msg('A look at the infrared camera shows the ship is radiating low level thermal energy, especially from the aft area (relative to the Joseph Banks). The radio signal is emanating from a point lower port forward section.')
    io.msg('There are no other electromagnetic emissions detected, and no significant magnetic, electrical or gravity fields detected.')
    io.msg('There are no other electromagnetic emissions detected, and no significant magnetic, electrical or gravity fields detected.')
    w.alienShip.status = 2
    return util.SUCCESS
  }
}))

function isShip (item) {
  return item.isShip
}

commands.push(new Cmd('ProbeStatus', {
  regex: /^probes?$/,
  script: function () {
    const arr = getProbes()
    metaio.msg('Found ' + arr.length + ' probes')
    for (let i = 0; i < arr.length; i++) {
      metaio.msg('------------------')
      metaio.msg('Probe:' + arr[i].alias)
      metaio.msg('Status:' + arr[i].status)
      metaio.msg('launchCounter:' + arr[i].launchCounter)
      metaio.msg('probeType:' + arr[i].probeType)
      metaio.msg('planetNumber:' + arr[i].planetNumber)
    }
    metaio.msg('------------------')
    metaio.msg('Geology:' + currentPlanet().geology)
    metaio.msg('Biology:' + currentPlanet().biology)
    metaio.msg('Radio:' + currentPlanet().coms)
    metaio.msg('Satellite:' + currentPlanet().satellite)
    metaio.msg('Active:' + currentPlanet().eventIsActive())
    return util.util.SUCCESS_NO_TURNSCRIPTS
  }
}))

commands.unshift(new Cmd('Help', {
  regex: /^help$|^\?$/,
  script: function () {
    metaio.msg('Help is available on a number of topics...')
    metaio.msg('{color:red:HELP GENERAL} or {color:red:HELP GEN}: How to play parser games')
    metaio.msg('{b:Commands to help you play this game:}')
    metaio.msg('{color:red:HELP GAME}: Suggestions on what to actually do')
    metaio.msg('{color:red:HELP NPC}: Interacting with other characters')
    metaio.msg('{color:red:HELP PROBE}: How to deploy and use probes')
    metaio.msg('{color:red:HELP STASIS}: How to use stasis pods (and hence travel to the next planet)')
    if (w.Xsansi.currentPlanet !== 0) metaio.msg('{color:red:HELP VACUUM}: How to handle the cold vacuum of space')
    if (w.alienShip.status > 0) metaio.msg('{color:red:HELP DOCKING}: How to dock with another ship')
    metaio.msg('{b:Commands that give meta-information about the game:}')
    metaio.msg('{color:red:HELP UNIVERSE}: Notes about the universe the game is set in')
    metaio.msg('{color:red:HELP SYSTEM}: About the game system')
    metaio.msg('{color:red:HELP CREDITS}: Credits, obviously!')
    metaio.msg('You can use {color:red:?} as a shorthand for {color:red:HELP}')
    return util.util.SUCCESS_NO_TURNSCRIPTS
  }
}))

commands.push(new Cmd('HelpGen', {
  regex: /^(?:\?|help) gen.*$/,
  script: function () { helpScript() }
}))

commands.push(new Cmd('HelpGame', {
  regex: /^(?:\?|help) game$/,
  script: function () {
    metaio.msg('At each planet, you need to assess how many bio-probes and how many geo-probes to launch. Do {color:red:HELP PROBES} for details on that. You can {color:red:ASK AI ABOUT SHIP} to find how many of each probe is left.')
    metaio.msg('You have five planets to visit, before returning to Earth. Return to the stasis pod to go back into stasis. Xsansi will then navigate the ship to the next destination.')
    metaio.msg('As the captain, the welfare of the crew is important, so {color:red:ASK KYLE ABOUT HIS HEALTH}, etc.')
    metaio.msg('You can talk to Xsansi anywhere on the ship (and can just call her "ai"). Do {color:red:ASK AI ABOUT CREW} to find out where the crew are.')
    return util.util.SUCCESS_NO_TURNSCRIPTS
  }
}))

commands.push(new Cmd('HelpNPCs', {
  regex: /^(?:\?|help) npcs?$/,
  script: function () {
    metaio.msg('{b:Interacting with NPCs:}')
    metaio.msg('You can ask an NPC to do something by using the same command you would use to have yourself do something, but prefixed with {color:red:[name],} (note the comma) or {color:red:TELL [name] TO}.')
    metaio.msg(NO_TALK_TO)
    metaio.msg('Use the TOPICS command for some suggested topics. There are rather more for ASK than TELL, as you might expect.')
    return util.util.SUCCESS_NO_TURNSCRIPTS
  }
}))

commands.push(new Cmd('HelpProbes', {
  regex: /^(?:\?|help) probes?$/,
  script: function () {
    metaio.msg('{b:Using probes:}')
    metaio.msg('Kyle will automatically deploy a satellite on arrival at a new planet, but you need to tell your crew to deploy probes. Wait for Xsansi to announce that the satellite is in orbit, then {color:red:ASK XSANSI ABOUT PLANET}. You can then assess what probes you want to deploy.')
    metaio.msg('For a bio-probe, talk to Ostap, for a geo-probe, talk to Aada. They will then walk to the probe hanger, and launch the probe. You can tell them to launch several at once (eg {color:red:OSTAP, LAUNCH 3 PROBES}), but remember, you only have sixteen of each for all five planets.')
    metaio.msg('Once a probe has been launched, it is on its own; you cannot control it.')
    metaio.msg('After a probe has landed, it will send data back to the ship, for your crew to analyse. If the data has value, your bonus will automatically increase. The first probe on a planet might get you two or three bonuses, but the third may not get you any and by the tenth, it is not going to find anything new. Ask the crew about the planet once the probes have explored it.')
    metaio.msg('After thirty turns a probe will have got everything it can - and usually much sooner. Get to know your crew while you wait.')
    return util.util.SUCCESS_NO_TURNSCRIPTS
  }
}))

commands.push(new Cmd('HelpStasis', {
  regex: /^(?:\?|help) stasis$/,
  script: function () {
    metaio.msg('{b:Stasis:}')
    metaio.msg('Once you are in stasis, years will pass whilst the ship navigates to the next star system, so this is how to move the story forward to the next planet to survey.')
    metaio.msg('To go into stasis, climb into your pod, and close the lid.')
    metaio.msg('You can tell a crew member to go to stasis at any time (eg {color:red:AADA, GET IN STASIS POD} or just {color:red:HA, IN POD}). Once in stasis they cannot be revived until the ship arrives at the next destination, so make sure they have done everything they need to first. Crew members will go into stasis anyway once you do.')
    return util.util.SUCCESS_NO_TURNSCRIPTS
  }
}))

commands.push(new Cmd('HelpVacuum', {
  regex: /^(?:\?|help) (?:vacuum|d?e?pressur.+)$/,
  script: function () {
    metaio.msg('{b:Vacuum:}')
    metaio.msg('Each section of the ship can be pressurised or depressurised by Xsansi, just ask {color:red:XSANSI, PRESSURIZE THE CARGO BAY} or {color:red:AI, DEPRESSURISE ENGINEERING}. Note that safety overrides may prevent Xsansi from complying.')
    metaio.msg('To find out what areas are pressurised, {color:red: ASK XSANSI ABOUT WHERE IS PRESSURISED} or {color:red:ASK AI ABOUT VACUUM}.')
    return util.util.SUCCESS_NO_TURNSCRIPTS
  }
}))

commands.push(new Cmd('HelpDock', {
  regex: /^(?:\?|help) (?:dock|docking)$/,
  script: function () {
    metaio.msg('{b:Docking:}')
    metaio.msg('From the flight-0deck, you can get closer to another ship, either to get a better look or to dock with it; {color:red:XSANSI, APPROACH SHUTTLE} or {color:red:AI, APPROACH SHIP}. Obviously there must be an vessel around.')
    metaio.msg('Once adjacent, you can scan ot or dock with it; {color:red:XSANSI, DOCK WITH SHUTTLE} or {color:red:AI, SCAN SHIP}.')
    return util.util.SUCCESS_NO_TURNSCRIPTS
  }
}))

commands.push(new Cmd('HelpUniverse', {
  regex: /^(?:\?|help) universe$/,
  script: function () {
    metaio.msg('{b:The game world:}')
    metaio.msg('I have, to some degree, tried to go hard science fiction; I would like to think this is not {i:too} much a flight of fantasy, and these are real stars the ship visits! I have assumed artificial gravity, which is required to orientate the game (once you have down, you have port, up and starboard).')
    metaio.msg("I am also assuming people can be held in stasis, and presumably this is like freezing time (cf Niven's stasis field, in his \"Known Space\" series). I need that to preserve the food so the crew have something to eat 80 years after leaving Earth.")
    metaio.msg('Also, probes are {i:fast}! It just takes a few turns to travel from orbit to the planet surface, which has to be at least 100 miles, and likely considerably more. They work fast on the planet too. It is a game; we need stuff to happened quickly to keep players interested.')
    return util.util.SUCCESS_NO_TURNSCRIPTS
  }
}))

commands.push(new Cmd('HelpSystem', {
  regex: /^(?:\?|help) system?$/,
  script: function () {
    metaio.msg('{b:The Game System:}')
    metaio.msg('This game is written entirely in JavaScript, so it is running in your browser. Compared to Quest 5, which I am familiar with, this means that you do not need to download any software to run it, and there is no annoying lag while you wait for a server to util.respond. Compared to Inform... well, it allows authors to directly access a modern programming language (though the point of Inform 7, of course, is to keep the programming language at bay).')
    metaio.msg('It is a complete system, implementing all the standards of a parser game, including the usual compass directions by default! Containers, surfaces, countables, wearables, openables, furniture, components and switchable are all built in, as well as NPCs, which hopefully are acting with some semblance of realism.')
    metaio.msg('For more information, including a tutorial on how to create your own game, see <a href="https://github.com/ThePix/QuestJS/wiki">here</a>. As yet there is no editor, but I hope there will be one day.')
    return util.util.SUCCESS_NO_TURNSCRIPTS
  }
}))

commands.unshift(new Cmd('HelpCredits', {
  regex: /^(?:\? |help )?(?:credits?|about)$/,
  script: function () {
    metaio.msg('{b:Credits:}')
    metaio.msg('This was written by The Pixie, on a game system created by The Pixie.')
    return util.util.SUCCESS_NO_TURNSCRIPTS
  }
}))
