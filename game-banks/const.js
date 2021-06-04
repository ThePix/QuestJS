"use strict"



const TURNS_TO_LANDING = 3
const TURNS_TO_ORBIT = 2
const TURNS_TO_DATA = 3
const PLANETS = [
  {
    // star 0
    starName:"HD 154088",
    planet:"D",
    comment:"Planet 1: A lifeless planet, with no water, not much minerals either; an easy one to start with",
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
      w.Ha_yoon.status = Math.min(w.Ha_yoon.status, 96);
      w.Kyle.status = Math.min(w.Kyle.status, 98);
      msg("{i:The \"Joseph Banks\" left Earth orbit in 2319, on a centuries-long mission to survey five relatively close star systems. The crew were put in stasis for the long journey between the stars. As the captain, it is up to you to decide what probes to send to the surface to maximise your bonus - and to keep the crew happy and safe.}");
      //wait()
      msg("&nbsp;");
      msg("'Good morning,' says a female voice. {i:Who the hell?} you wonder for a few minutes, before realising you are in a stasis pod. You sit up. 'We have arrived at {star},' the voice continues, 'our first destination, without incident.' It is Xsansi, the ship AI, who has been piloting the ship for the last twenty years or whatever. 'You may be suffering from disorientation, nausea, headache and muscle fatigue. If symptoms persist, you should seek medical advice. Following standard procedure, Crewman Kyle will soon launch a satellite, which will give us basic data about the planet, allowing you to decide how many probes to send to the surface.'");
      //world.enterRoom();
    },
    Kyle_how_are_you:"'I'm good, mate. Why? Why shouldn't I be?'",
    Ostap_how_are_you:"'I am feeling good.'",
    Aada_how_are_you:"'I'm okay.'",
    Ha_yoon_how_are_you:"'I... feel a little queasy. It's just the stasis, nothing I can't handle.'",
  },
    
  { 
    // star 1
    starName:"HD 168746", 
    planet:"B", 
    comment:"Planet 2 (hull breach): Lots of life, at about the Devonian Period, with purple plants. Good metals too. But need to sort out the hull breach first. Or accept some of the ship is inaccessible.",
    atmosphere:"The atmosphere is 71% nitrogen, 15% oxygen, 3% carbon dioxide and about 1% of various other gases including water and methane.",
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
      msg("'Good morning,' says a female voice. {i:Who the hell?} you wonder for a few minutes, before again realising you are in a stasis pod. 'We have arrived at " + this.starName + ",' the voice continues, 'our second destination, after a lengthy journey, with a single incident. On the nineteenth of September, 2338 at 2104, ship time, the ship passed through a meteor shower, resulting in a loss of integrity in: the lounge, the captain's cabin, the top deck corridor.");
      msg("'You may be suffering from disorientation, nausea, headache and muscle fatigue. If symptoms persist, you should seek medical advice.' You sit up, and for a moment you do feel dizzy, but it soon passes.");
      player.status = Math.min(player.status, 95);
      w.Kyle.status = Math.min(w.Kyle.status, 93);
      w.Ostap.status = Math.min(w.Ostap.status, 96);
      w.Ha_yoon.status = Math.min(w.Ha_yoon.status, 84);
      w.Xsansi.status = 74;
      w.Xsansi.pressureOverride = true;
      w.lounge.leaks = true;
      w.your_cabin.leaks = true;
      w.top_deck_forward.leaks = true;
      for (let key in w) {
        if (w[key].vacuum === false && w[key].name !== "stasis_bay" &&  w[key].name !== "stasis_pod_room") {
          w[key].vacuum = true;
        }
      }
    },
    Kyle_how_are_you:"'I'm okay,' he says, a little uncertainly.",
    Ostap_how_are_you:"'When I woke, that was not good! But now, I am feeling good.'",
    Aada_how_are_you:"'I'm okay.'",
    Ha_yoon_how_are_you:"'Not so good; I didn't think the stasis would be this bad. But I can still do my job.'",
  },
  
  { 
    // star 2
    starName:"HD 168443", 
    planet:"C", 
    comment:"Planet 3 (intelligent life): A dead planet, following some unknown event; previously had intelligent life. An artefact orbits the planet. Player can pilot ship to the artefact, in a spacesuit if the flightdeck is not pressurised.",
    atmosphere:"The atmosphere is 76% nitrogen, 22% oxygen, 1% carbon dioxide and about 1% of various other gases including water and carbon monoxide.",
    radio:"A single radio signal has been detected.",
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
      [4, 8],
      [3, 7],
      [3],
    ],
    bioProbeBonusPerRank:2,
    onArrival:function() {
      msg("'Good morning,' says a female voice. {i:Xsansi,} you think to yourself. 'We have arrived at " + this.starName + ",' the voice continues, 'our third destination, after a long and oh-so-tedious journey. You may be suffering from disorientation, nausea, headache and muscle fatigue, but I expect that is nothing to decades of loniness, right? If symptoms persist, I suggest you man-up.' You sit up, and immediately feel sick. You grip the sides of the pod as the room spins, waiting for it stop. It is a few minutes before you feel well enough to actually think.");
      player.status = Math.min(player.status, 85);
      w.Kyle.status = Math.min(w.Kyle.status, 82);
      w.Ostap.status = Math.min(w.Ostap.status, 89);
      w.Ha_yoon.status = Math.min(w.Ha_yoon.status, 76);
      w.Aada.status = Math.min(w.Aada.status, 93);
      w.Xsansi.pressureOverride = false;
    },
    Kyle_how_are_you:"'I'm okay. Well, not so bad, anyway.'",
    Ostap_how_are_you:"'I feel sick,' he says with a grin, 'but I keep going.'",
    Aada_how_are_you:"'I'm great.'",
    Ha_yoon_how_are_you:"'Feeling sick and dizzy, but I think I can keep going.'",
  },
  
  { 
    // star 3
    starName:"HD 148427", 
    planet:"D", 
    comment:"Planet 4 (fight the AI): A lifeless planet, but it has water, so suitable for seeding. By this time the AI is doolally. A young, fourth generation planet, good for mining.",
    atmosphere:"The atmosphere is 53% nitrogen, 18% carbon dioxide, 12% nitrogen dioxide, 10% carbon monoxide, 7% nitrogen oxide, 4% sulphur dioxide, 3% hydrogen sulphide, 2% water and about 1% of various other gases including ammonia.",
    radio:"No radio signals have been detected.",
    lights:"There are no light sources on the night side of the planet.",
    planetDesc:"The planet surface is about 63% water. The land surfaces are predominantly grey and red. Cloud cover is about 25%. Several active volcanoes have been noted.",
    starDesc:"HD 148427 is a 7th-magnitude K-type sub-giant star approximately 193 light years away in the constellation Ophiuchus. Its mass is 45% greater than the Sun, and it is three times the size and six times more luminous, although its age is 2½ billion years.",
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
      msg("'Awake at last are we?' says a female voice. {i:Why does she sound so odd?} you wonder. 'Here we are at " + this.starName + ",' the strangely inflected voice continues, 'our fourth destination, after a long, long journey, giving me plenty of time to consider the nature of reality.' You sit up, and immediately throw up over the side of the pod. You grip the sides of the pod as the entire contents of your stomach is ejected on to the floor. Eventually, the heaving stops.");
      w.pile_of_vomit.loc = "stasis_bay";
      w.alienShip.status = 0;
    },
    Kyle_how_are_you:"'Feeling a bit crock, to be honest.'",
    Ostap_how_are_you:"'I feel sick,' he says mournfully, 'but I keep going.'",
    Aada_how_are_you:"'I'm okay.' She does seem annoyingly well.",
    Ha_yoon_how_are_you:"'Struggling.'",
  },  
  
  { 
    // star 4
    starName:"Gliese 1214", 
    planet:"A", 
    comment:"Planet 5 (already colonised): This planet got colonised nearly a century ago, FTL having been invented not long after the Joseph Banks set off. Any probes will be shot down!",
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

];
