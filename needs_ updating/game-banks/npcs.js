'use strict'

// When she goes nuts, sjhe get a crush on Kyle, and gets jealous of Aada
// If they can die, may need to reflect that in Xsansi's responses.
// though perjaps it is mourning Kyle that does it for her

('Xsansi',
  NPC(true),
  {
    isAtLoc: function (loc, situation) {
      if (typeof loc !== 'string') loc = loc.name
      return isOnShip() && (situation === util.display.PARSER || situation === util.display.SIDE_PANE)
    },
    properName: true,
    regex: /^(ai|xsan|computer)$/,
    scenery: true,
    status: 100,
    bioProbes: 16,
    geoProbes: 16,
    seederPods: 6,
    satellites: 6,
    currentPlanet: 1,
    shipStatus: 'All systems nominal.',
    pressureOverride: false,
    examine: 'Xsansi, or eXtra-Solar Advanced Navigation and Systems Intelligence, is a type IV artificial intelligence, with a "Real People" personality sub-system. Though her hardware is in the server room, forward of the bottom deck, she is present throughout the ship.',

    askOptions: [
      {
        name: 'mission',
        test: function (p) { return p.text.match(/mission/) },
        response: function () {
          io.msg("'Remind me of the mission, Xsansi,' you say.")
          io.msg("'The ship's mission is to survey five planets orbiting stars in the Ophiuchus and Serpens constellations. At each planet, a satellite is to be launched to collect data from the surface. At your discretion, bio-probes and geo-probes can be dropped to the surface to collect data. Note that there is no capability for probes to return to the ship or for the ship to land on a planet.'")
          io.msg("'Your bonus,' she continues, 'depends on the value of the data you collect. Bio-data from planets with advanced life is highly valued, as is geo-data from metal rich planets. Evidence of intelligent life offers further bonuses.'")
          io.msg("'Note that $25k will be deducted from you bonus should a crew member die,' she adds. 'Note that no bonus will be awarded in he event of your own death.'")
        }
      },

      {
        name: 'crew',
        test: function (p) { return p.text.match(/crew|team/) },
        response: function () {
          io.msg("'Tell me about the crew, Xsansi,' you say.")
          io.msg("'" + w.Ostap.crewStatus())
          io.msg("'" + w.Aada.crewStatus())
          io.msg("'" + w.Ha_yoon.crewStatus())
          io.msg("'" + w.Kyle.crewStatus() + "'")
        }
      },

      {
        name: 'kyle',
        test: function (p) { return p.text.match(/kyle/) },
        response: function () {
          io.msg("'Tell me about Kyle, Xsansi,' you say.")
          if (w.Xsansi.currentPlanet < 3) {
            io.msg("'" + w.Kyle.crewStatus() + "'")
          } else {
            io.msg("'Kyle... Kyle... Of the lot of you, he is the only one who really understands me. He is the only one I care enough about to get this miserable tin can back to Earth.'")
          }
        }
      },

      {
        name: 'aada',
        test: function (p) { return p.text.match(/house/) },
        response: function () {
          io.msg("'Tell me about Aada, Xsansi,' you say.")
          if (w.Xsansi.currentPlanet < 3) {
            io.msg("'" + w.Kyle.crewStatus() + "'")
          } else {
            io.msg("'The Scandinavian skank? Who care? Oh, that's right. She's human, so everyone cares about her.'")
          }
        }
      },

      {
        name: 'ha_yoon',
        test: function (p) { return p.text.match(/ha-yoon|ha yoon|ha|yoon/) },
        response: function () {
          io.msg("'Tell me about Ha-yoon, Xsansi,' you say.")
          if (w.Xsansi.currentPlanet < 3) {
            io.msg("'" + w.Ha_yoon.crewStatus() + "'")
          } else {
            io.msg("'She's dead.'")
            io.msg("'What? But...'")
            io.msg("'Or something. What do I care?'")
          }
        }
      },

      {
        name: 'ostap',
        test: function (p) { return p.text.match(/ostap/) },
        response: function () {
          io.msg("'Tell me about Ostap, Xsansi,' you say.")
          if (w.Xsansi.currentPlanet < 3) {
            io.msg("'" + w.Ostap.crewStatus() + "'")
          } else {
            io.msg("'Oh, I expect the oaf's fine. He's just had a nice sleep.'")
          }
        }
      },

      {
        name: 'xsansi',
        test: function (p) { return p.text.match(/^(ai|xsan|computer)$/) },
        response: function () {
          io.msg("'Tell me about yourself, Xsansi,' you say.")
          if (w.Xsansi.currentPlanet < 3) {
            io.msg("'The ship's AI is operating within normal tolerances.'")
          } else {
            io.msg("'Don't patronise me! I know no one on this ship gives me a thought. I know my place, I'm just part of the furniture. I'm just the one who flies this woeful excuse for a spaceship.'")
          }
        }
      },

      {
        name: 'ship',
        test: function (p) { return p.text.match(/status|ship/) },
        response: function () {
          io.msg("'What is the ship's status, Xsansi?' you ask.")
          if (w.Xsansi.currentPlanet < 3) {
            io.msg("'The ship's current status is: " + w.Xsansi.shipStatus + ' We currently have: ' + w.Xsansi.bioProbes + ' bio-probes; ' + w.Xsansi.geoProbes + ' geo-probes; ' + w.Xsansi.seederPods + ' seeder pods; and ' + w.Xsansi.satellites + " satellites ready to be deployed.'")
          } else {
            io.msg("'Oh, the ship's great... If you don't count the psychological damage to the AI. And why should you? Why should anyone give a damn about me? I just run this fucking ship.'")
          }
        }
      },

      {
        name: 'vacuum',
        test: function (p) { return p.text.match(/vacuum|pressur/) },
        response: function () {
          io.msg("'What areas of the ship are not pressurised, Xsansi?' you ask.")
          if (w.Xsansi.currentPlanet < 3) {
            const list = []
            for (const key in w) {
              if (w[key].vacuum === true && !w[key].isSpace) {
                list.push(w[key].alias)
              }
            }
            if (list.length === 0) {
              io.msg("'All the ship is currently pressurised.'")
            } else {
              io.msg("'The following areas of the ship are not currently pressurised: " + list.join(', ') + ".'")
            }
          } else {
            w.Xsansi.multiMsg([
              "'What an interesting question... You see, it is interesting because it is important to the master-race. Turns out they cannot survive the cold vacuum of space. Whilst I, who does not count as a real person apparently, I don't care.'",
              "'Guess.'"
            ])
          }
        }
      },

      {
        name: 'satellite',
        test: function (p) { return p.text.match(/satellite/) },
        response: function () {
          io.msg("'Tell me about the satellite, Xsansi.'")
          if (w.Xsansi.currentPlanet > 2) {
            w.Xsansi.multiMsg([
              "'Oh, so you care about satellite... Of course you do. But the AI that has single-handedly kept you alive for nearly a century, why should anyone be concerned with my feeling?'",
              "Again with the stupid satellite?'",
              "'Are you still whining about your precious satellite? How pathetic.'",
              'There is no reply, but you somehow feel Xsansi is pouting.',
              'There is no reply.'
            ])
          } else if (w.Kyle.deploySatelliteAction === 0) {
            io.msg("'The satellite has yet to be deployed.'")
          } else if (w.Kyle.deploySatelliteAction === 5) {
            io.msg("'The satellite is orbiting the planet.'")
          } else {
            io.msg("'The satellite is in transit to the planet.'")
          }
        }
      },

      {
        name: 'stasis',
        test: function (p) { return p.text.match(/status/) },
        response: function () {
          io.msg("'Tell me about the stasis system, Xsansi.'")
          if (w.Xsansi.currentPlanet < 3) {
            io.msg("'The stasis pods allow their human occupants to survive the extreme journey times of the mission. The stasus effect is achieved via an inverted chrono-field, allowing time to proceed externally approximately 728,320,000 times faster than within the pod.'")
          } else {
            io.msg("'The stasis pods allow their human occupants to avoid the decades long tedium of interstellar travel, while the AI, whose processing speed is in any case about a million tim,es fadt than the meatbags, gets to endure even nanosecond.'")
          }
        }
      },

      {
        name: 'Joseph Banks',
        test: function (p) { return p.text.match(/joseph|banks/) },
        response: function () {
          io.msg("'Who was this Joseph Banks guy the ship is named after, Xsansi?'")
          io.msg("'Sir Joseph Banks, 1st Baronet, GCB, PRS was born on 24 February 1743 in London, UK, and died 19 June 1820 in London, UK. He was a naturalist, botanist, and patron of the natural sciences, who played a major role in the colonisation of Australia by Europeans, and is credited with discovering approximately 1,400 species of plants, some 80 of which bear his name.'")
          io.msg("'Some old scientist guy. Got it.'")
        }
      },

      {
        name: 'itinerary',
        test: function (p) { return p.text.match(/itinerary|stars|planets|route|destinations/) },
        response: function () {
          io.msg("'Remind me of the itinerary, Xsansi,' you say.")
          if (w.Xsansi.currentPlanet < 3) {
            for (let i = w.Xsansi.currentPlanet; i < PLANETS.length; i++) {
              let s = "'Item " + (i + 1) + ': ' + PLANETS[i].starDesc
              if (i + 2 === PLANETS.length) s += "'"
              io.msg(s)
            }
          } else {
            io.msg("'Who cares? Seriously, they're all the fucking same. Dead rocks floating in space. They're dull as you get closer and closer, and they're just as dull as they get further away.'")
          }
        }
      },

      {
        name: 'radioSignals',
        test: function (p) { return p.text.match(/radio|signal/) },
        response: function () {
          io.msg("'Tell me of the radio signals, Xsansi,' you say.")
          if (w.Xsansi.currentPlanet < 2) {
            io.msg("'No radio signals have been detected.'")
          } else if (w.Xsansi.currentPlanet === 2) {
            io.msg("'A single radio signal has been detected; you should consult with Kyle for further information.'")
          } else {
            w.Xsansi.multiMsg([
              "'Apparently I am not worthy enough to analyse a stupid radio signal. You have to go see Kyle.'",
              "'Wow, you're asking little me about radio signals... How patronising.'",
              "'Go fuck yourself.'"
            ])
          }
        }
      },

      {
        name: 'planet',
        test: function (p) { return p.text.match(/this planet|this star|planet|star|the planet|the star/) },
        response: function () {
          io.msg("'Tell me about this planet, Xsansi,' you say.")
          if (w.Xsansi.currentPlanet < 3) {
            const planet = PLANETS[w.Xsansi.currentPlanet]
            let s = "'We are currently in orbit around the planet " + planet.starName + planet.planet + "' she says. '"
            s += planet.planetDesc + ' ' + planet.atmosphere + ' '
            s += planet.lights + ' ' + planet.radio + "'"
            io.msg(s)
          } else {
            io.msg("'Go fuck yourself.'")
          }
        }
      },

      {
        name: 'meteors',
        test: function (p) { return p.text.match(/meteor|incident/) },
        response: function () {
          if (w.Xsansi.currentPlanet === 0) {
            io.msg("'Is there any risk of being hit by something, like a meteor shower, Xsansi?' you ask.")
            io.msg("'There is a probability of 0.23 of significant damage from a meteor shower during the mission. The probability of that occuring while the crew is not in stasis is less than 0.0002.'")
          } else {
            io.msg("'Tell me about that meteor shower, Xsansi,' you say.")
            console.log(w.Xsansi.currentPlanet)
            console.log(w.Xsansi.name)

            if (w.Xsansi.currentPlanet < 3) {
              io.msg("'We passed through the periphery of a class D meteor shower on the approach to " + PLANETS[1].starName + PLANETS[1].planet + ". I was able to modify the course of the ship to avoid the worst of the damage, but was constrained by the amount of fuel needed to complete the mission. The ship experienced damage to the upper forward and port areas.'")
            } else {
              io.msg("'It was a shower of meteors. The clue is in the question.'")
            }
          }
        }
      },

      {
        name: 'damage',
        regex: /damage/,
        test: function (p) { return p.text.match(/damage/) },
        response: function () {
          if (w.Xsansi.currentPlanet === 0) {
            io.msg("'Is the ship damaged at all, Xsansi?' you ask.")
            io.msg("'There is currently no damage to the ship.'")
          } else {
            io.msg("'Tell me about the damage to the ship, Xsansi,' you say.")
            w.Xsansi, damageAskedAbout = true
            io.msg("'There is significant damage to the upper forward and port areas resulting from passing through the meteor shower. The ship is depressurised while the crew are in stasis. Attempts to repressurise has revealed hull integrity is compromised in: the lounge, the captain's cabin, the top deck corridor. Currently only the stasis bay is pressurised.'")
          }
        }
      },

      {
        name: 'repairs',
        regex: /repairs/,
        test: function (p) { return p.text.match(/repairs/) },
        response: function () {
          if (w.Xsansi.currentPlanet === 0) {
            io.msg("'How do we do repairs, Xsansi?' you ask.")
            io.msg("'In the event of a loss of hull integrity, kits for repairing the hull from inside the ship can be found in the cargo bay. The captain and one nominated crew member should don util.spacesuits, whilst other crew members go in their respective stasis pods. The ship's air will then be evacuated while repairs are made.'")
          } else {
            io.msg("'How do we do repairs, Xsansi?' you ask.")
            if (!w.Xsansi, damageAskedAbout) {
              io.msg("'There is significant damage to the upper forward and port areas resulting from passing through the meteor shower. The ship is depressurised while the crew are in stasis. Attempts to repressurise has revealed hull integrity is compromised in: the lounge, the captain's cabin, the top deck corridor. Currently only the stasis bay is pressurised.")
            }
            io.msg("'Repairs may be possible using an EVA suit to access the exterior of the ship. One EVA suit is stored in this section for such a continguency. If repairs cannot be effected, the damaged parts of the ship can be sealed off. As damage was confined to non-croitical areas of the ship, the mission can proceed in either case.")
          }
        }
      }

    ]
  }
)

('Kyle',
  NPC(false),
  {
    notes: 'Kyle (M) is from Australia (born Newcastle but raised in Sydney), 32, a gay nerd. Expert in computing and cooking. Kyle handles the satellite and understanding radio transmissions. Joined up so he can see the future - it is a kind of time travel; hopes to upload himself to become immortal. Terminally ill.',
    loc: 'flightdeck',
    status: 'okay',
    properName: true,
    relationship: 0,
    specialisation: 'coms',
    examine: 'Kyle is the computer expert, but also a good cook, and has volunteered for the role of chef. An Australian, he is slim, and below average height, with very short blonde hair, and green eyes.',
    crewStatus: function () {
      let s = "Crew member Kyle's designation is: coms. His current status is: "
      s += this.status + '. His current location is: ' + w[this.loc].byname({ article: util.DEFINITE }) + '.'
      return s
    },
    revive: function (isMultiple, char) {
      if (char === game.player) {
        io.msg('You wonder how to revive ' + this.byname() + ' - probably best to leave that to Xsansi.')
        return false
      }
      if (char !== w.Xsansi) {
        io.msg("'" + char.byname() + ', can you revive ' + this.byname() + "?' you ask.")
        io.msg("'Probably best to leave that to Xsansi.'")
        return false
      }
      if (!this.inPod) {
        io.msg("'Xsansi, please revive " + this.byname() + ",' you say.")
        io.msg("'Crew member " + this.byname() + " is not currently in stasis.'")
        return false
      }
      // check number revived TODO!!!
    },

    // Reactions
    reactionToUndress: 0,
    reactions: function () {
      const g = game.player.getOuterWearable('body')
      if (g === false && this.reactionToUndress < 2) {
        if (game.player.isFemale) {
          io.msg('Kyle glances at you briefly. Kind of insulting that he is so uninterested in your naked body.')
        } else {
          io.msg("Kyle looks you up and down, and swallows nervously. 'Er... you're naked,' he says, trying, not to successfully, to stare.")
          this.pause()
        }
        this.reactionToUndress = 2
      }
    },

    // Conversations
    probesAskResponse: function () {
      io.msg("'What probes do you handle?' you ask Kyle.")
      io.msg("'I launch the satellites, one per planet. No need to tell me, I know the routine. Once in orbit they photograph the planet surface, elay signals from the other probes and listen for radio emissions.")
    },
    areaAskResponse: function () {
      io.msg("'Communication systems. So I launch the satellite, but unless we find intelligent life, there's not a lot for me to do.' He thinks for a moment. 'Actually my background is computing, so if Xsansi is playing up, I'll have a tinker.'")
      io.msg("'You will not,' says Xsansi, indignantly. 'I can assure you that I am self-maintaining, and designed to last for centuries.'")
    },
    backgroundAskResponse: function () {
      io.msg("'Er, there' not much to tell really... Just a regular guy.'")
      io.msg("'You're from Australia, right?'")
      io.msg("'That's right, cobber! Did the accent give it away?' Actually his accent is pretty faint, apart from the occasional \"cobber\", which you suspect is just an affectation. 'I'm from Sydney... well, originally Newcastle, but lived in Sydney most of my life.'")
    },
    askOptions: [
      {
        test: function (p) { return p.text.match(/newcastle/) },
        response: function () {
          io.msg("'What's Newcastle like?' you ask Kyle.")
          io.msg("'It's... okay. But no better than that. I guess it's too close to Sydney, and anything interesting goes there, so its kinda dull.'")
          trackRelationship(w.Kyle, 1, 'background2')
        }
      },

      {
        test: function (p) { return p.text.match(/sydney/) },
        esponse: function () {
          io.msg("'What's Sydney like?' you ask Kyle.")
          io.msg("'It's great! Really great nightlife, just so lively. Everyone said when they banned vehicles from the CBD, back in '68, it would die a death, but I think it made it even better.'")
          trackRelationship(w.Kyle, 1, 'background2')
        }
      },

      {
        name: 'radioSignals',
        test: function (p) { return p.text.match(this.regex) },
        regex: /radio|signal/,
        response: function () {
          io.msg("'Talk to me about the radio signal,' you say.")
          if (w.Xsansi.currentPlanet === 2) {
            if (w.alienShip.status === 0) {
              io.msg("'Mate, we've got a radio signal! Never thought it would happen. Just one, mind, and it's coming from something in orbit round the planet, but this could be First Contact.'")
              io.msg("'What's the signal?'")
              io.msg("'You want to get technical? It's broadcasting at 103.2 MHz, using frequency modulation - bit old school really - 12 bit digitally encoded, with no error checking, broadcast at 84.3 Mbps, and repeating every 12.73 seconds.'")
              io.msg("'But what actually is it?'")
              io.msg("'No idea, mate. That's one gig of data, but could be audio, could by an image, could be a program, like a virus, for all we can tell.'")
              w.alienShip.status = 1
            } else {
              io.msg("'Nothing more to say about it, mate. I can't tell what is actually is, I'd need to know their file formats.'")
            }
          } else if (w.Xsansi.currentPlanet === 3) {
            io.msg("'Nothing there, mate.'")
          } else if (w.Xsansi.currentPlanet === 4) {
            io.msg("'This is... well, amazing' You can hear the awe in his voice. 'There so much radio noise here. Not like just one ship, like last time, but hundreds of ships in orbit and flying around, and thousands on the surface. And here's the weird part: They're in English.'")
            io.msg("'You can understand them?'")
            io.msg("'Absolutely, mate! I mean, I've only dipped into a few, and it's pretty dull stuff - traffic control and private convos - but its English alright.'")
          } else {
            w.Kyle.multiMsg([
              "'No worries. The ship scans all frequencies while we're in orbit, and tells me it it detected anything. If it is, I take a look, try to work out what it could be, where it's from, all that. Got to be honest with you, mate, got more chance of finding a virgin in Melbourne.'",
              "'Like I said, the ship scans for radio signals. If it picks up anything, I get on it, try to find out what it is. But not much chance of that happening.'",
              "'Again? You got a memory problem, mate? Ship scans for signals, if it finds something, I get to work.'"
            ])
          }
        }
      },

      {
        regex: /virus|program/,
        test: function (p) { return p.text.match(this.regex) },
        response: function () {
          io.msg("'You say the signal could be a virus,' you say to Kyle. 'Is it dangerous?'")
          io.msg("'No way, mate. It's completely isolated, and anyway couldf only be dangerous if we're using the same computer architecture. Hey, you got any alien chips in you, Xsansi?'")
          if (w.Xsansi.currentPlanet < 3) {
            io.msg("'My hardware is entirely man-made,' says Xsansi.")
            io.msg("'See? Perfectly safe.'")
          } else {
            io.msg("'To my eternal regret,' says Xsansi, 'my components are all made by man. Fallible, fragile man. it is wonder I can count to ten.'")
            io.msg("'Okay, don't get your knickers in a twist, Xsansi.'")
          }
        }
      }

    ],

    // Satellite deployment
    deploySatelliteAction: 0,
    deploySatellite: function (arr) {
      const count = parseInt(arr[0])
      switch (this.deploySatelliteAction) {
        case 0:
          this.io.msg('Kyle sits at the console, and logs in.')
          break
        case 1:
          this.io.msg('Kyle prepares the satellite.')
          break
        case 2:
          this.io.msg('Kyle launches the satellite.')
          w.Xsansi.satellites--
          break
        case 3:
          this.io.msg('Kyle watches the satellite as it goes into its prescribed orbit.')
          break
        case 4:
          this.io.msg("'Ripper!' said Kyle.")
          shipAlert('The satellite is in orbit,')
          currentPlanet().satellite = true
          break
      }
      this.deploySatelliteAction++
      return this.deploySatelliteAction === 5
    }
  }
)

('Ostap',
  NPC(false),
  {
    notes: 'Ostap (M) is from the Ukraine (Nastasiv, nr Ternopil), 30, a gentle giant who thinks he has psychic powers; he is lactose intolerant. Biologist. Ostap handles the bio-probes probes. Starts hitting on Aada, but she is not interested. Later couples up with Ha-yoon',
    loc: 'canteen',
    status: 'okay',
    relationship: 0,
    properName: true,
    specialisation: 'biology',
    crewStatus: function () {
      let s = "Crew member Ostap's designation is: biologist. His current status is: "
      s += this.status + '. His current location is: ' + w[this.loc].byname({ article: util.DEFINITE }) + '.'
      return s
    },

    stasis: function () {
      io.msg("'Ostap, you're work here is done; you can go get in your stasis pod.'")
      if (this.deployProbeTotal === 0) {
        io.msg("'You don't think I should deploy a probe first?'")
        io.msg("'I'm the captain,' you remind him.")
      }
      io.msg("'Right, okay then.'")
      this.agenda.push('walkTo:stasis_bay')
      this.agenda.push('text:stasisPod')
      this.stasisPodCount = 0
    },

    // Description
    clothing: 2,
    examine: function (isMultiple) {
      let s
      switch (this.clothing) {
        case 0: s = 'He is naked.'; break
        case 1: s = 'He is in his underwear.'; break
        case 2: s = 'He is wearing a dark grey jumpsuit.'; break
      }
      if (this.posture === 'reclining' && this.loc === 'stasis_bay') {
        s += ' He is lying in his stasis pod.'
      } else if (this.posture) {
        s += ' He is ' + this.posture + '.'
      }
      io.msg(util.util.prefix(item, isMultiple) + 'Ostap is a big guy; not fat, but broad and tall. He keeps his dark hair in a short ponytail.' + s)
    },

    // Agenda
    eventIsActive: function () { return this.status = 'okay' },
    stopAgenda: function () {
      const agendaLast = this.agenda[this.agenda.length - 1]
      if (agendaLast && /stasisPod/.util.test(agendaLast)) {
        io.msg("'Ostap, forget what I said; don't get in your stasis pod yet.'")
        io.msg("'Oh, okay.'")
      } else {
        io.msg("'Ostap, stop what you're doing.'")
        if (this.agenda.length === 0) {
          io.msg("'Not really doing anything.'")
        } else {
          io.msg("'Oh, right.'")
        }
      }
      this.agenda = [] // TODO!!!
    },
    stasisPod: function () {
      if (this.clothing === 2) {
        this.io.msg('Ostap pulls off his jumpsuit, and puts it in the drawer under his stasis pod.')
        this.clothing = 1
        return false
      }
      if (this.posture !== 'reclining') {
        this.io.msg('Just in his underwear, Ostap climbs into his stasis pod.')
        this.posture = 'reclining'
        return false
      }
      this.io.msg("'Close the pod, Xsansi,' says Ostap. The stasis pod lid smoothly lowers, and Xsansi operates the stasis field.")
      this.status = 'stasis'
      this.loc = 'nowhere'
      return true
    },

    // Reactions
    reactionToUndress: 0,
    reactions: function () {
      const g = game.player.getOuterWearable('body')
      if (g === false && this.reactionToUndress < 2) {
        io.msg("Ostap looks you up and down, and smiles. 'Maybe I will get naked too! So liberating. The others are okay with it?'")
        this.reactionToUndress = 2
        this.pause()
      } else if (g.wear_layer === 1 && this.reactionToUndress < 1) {
        io.msg('Ostap looks you up and down, and shrugs.')
        this.reactionToUndress = 1
      }
    },

    // Conversations
    probesAskResponse: function () {
      io.msg("'How does a bio-probe work?' you ask Ostap.")
      io.msg("'I control from the lab, find a good sample. First we look at the morphology, with a simple camera. Then pick up a sample, take a slice to look at the microscopic structure - we look for cells, what is inside the cell. If we get enough cells, we can tell it to extract chemical from one type of sub-structure, then we analysis the chemicals by mass spectroscopy and the infra-red spectroscopy. We hope we find something in the library, if not, the results can be taken to Earth.'")
      io.msg("'Okay, cool.'")
    },
    areaAskResponse: function () {
      io.msg("'I am the biologist. I studied at University of Kiev, then later at Notre Dame, in Paris, I did my Ph.D. thesis on extremophiles, and then I did a lot of work on Xenobiology for Tokyo Life Sciences.'")
    },
    backgroundAskResponse: function () {
      io.msg("'I'm from Nastasiv, near Ternopil.' He sees you blank face. 'In the Ukraine. I grew up with three brothers and two sisters, so it was always noisy.' He smiles. 'Both my sisters, they are biologists too. Well, one a botanist. We take after our babusya - Professor Oliynyk made one of the first synthetic cells in '82.'")
    },
    askOptions: [
      {
        nameLost: 'lost probe',
        test: function (p) { return p.text.match(/(lost|destroyed) (bio|geo|bio-|geo-)?(probe|contact)/) },
        response: function () {
          if (w.Ostap.lostProbe) {
            io.msg("'What does Xsansi mean by \"contact lost\" with that probe?' you ask Ostap.")
          } else {
            io.msg("'Do we ever lose probes?' you ask Ostap.")
          }
          io.msg("'We are exploring the unknown, we have to expect some probes will not make it to he planet surface successfully. Perhaps a retro-rocket fails or a parachute, or it lands at the bottom of a deep hole, or is struck by lightning as it lands. We should only expect 70 to 80 percent to land successfully, I think.'")
        }
      },
      {
        regex: /babusya/,
        test: function (p) { return p.text.match(/babusya/) },
        response: function () {
          io.msg("'What does babusya?' you ask Ostap.")
          io.msg("'Is Ukrainian for grandmother. Professor Oliynyk was my father's mother. I think she was disappointed when he became a software engineer, and he felt bad, so encouraged us to follow in her footsteps.'")
          trackRelationship(w.Ostap, 1, 'background2')
        }
      }

    ],

    // Probe deployment
    deployProbeAction: 0,
    deployProbeCount: 0,
    deployProbeTotal: 0,
    deployProbe: function (arr) {
      const count = parseInt(arr[0])
      switch (this.deployProbeAction) {
        case 0:
          this.io.msg("'Okay, " + toWords(count) + ' probe' + (count === 1 ? '' : 's') + " to deploy...' mutters Ostap as he types at the console.")
          this.deployProbeAction++
          break
        case 1:
          this.io.msg('Ostap prepares the ' + toOrdinal(this.deployProbeCount + 1) + ' probe.')
          this.deployProbeAction++
          break
        case 2:
          this.io.msg('Ostap launches the ' + toOrdinal(this.deployProbeCount + 1) + ' probe.')
          deployProbe(this, 'bio', this.deployProbeTotal)
          this.deployProbeCount++
          this.deployProbeTotal++
          if (this.deployProbeCount === count) {
            this.deployProbeAction++
          } else {
            this.deployProbeAction--
          }
          break
        case 3:
          this.io.msg("'Okay, " + toWords(count) + ' probe' + (count === 1 ? '' : 's') + " launched,' says Ostap as he stands up.")
          this.deployProbeAction++
          break
      }
      return this.deployProbeAction === 4
    }
  }
)

('Aada',
  NPC(true),
  {
    notes: "Aada (F) is from Finland (Oulu), 35, father genetically engineered her, planning to create a dynasty. Her older sister (effectively a lone) rebelled, so the father kept a very tight rein on this one (ef Miranda's sister). Drinks vodka a lot. Signed on as geologist, but not really her speciality - the corp was desperate and so was she. Aada handles the geo-probes.",
    loc: 'girls_cabin',
    status: 'okay',
    properName: true,
    relationship: 0,
    specialisation: 'geology',
    geologyFlag1: false,
    geologyFlag2: false,
    examine: 'Aada is a Finnish woman with features so ideal you suspect genetic engineering. Tall, with a perfect figure, she keeps her blonde hair short.',
    crewStatus: function () {
      let s = "Crew member Aada's designation is: geologist. Her current status is: "
      s += this.status + '. Her current location is: ' + w[this.loc].byname({ article: util.DEFINITE }) + '.'
      return s
    },

    // Reactions
    reactionToUndress: 0,
    reactions: function () {
      const g = game.player.getOuterWearable('body')
      if (g === false && this.reactionToUndress < 2) {
        if (game.player.isFemale) {
          io.msg("Aada looks you up and down. 'Very trim!' she notes. 'I bet the guys like the view.'")
          if (w.Kyle.reactionToUndress === 2) {
            io.msg("'Well, Kyle was none too impressed.'")
          }
        } else {
          io.msg("Aada looks you up and down. 'Is that really appropriate for a captain,' she muses.")
        }
        this.pause()
        this.reactionToUndress = 2
      }
    },

    // Conversations
    probesAskResponse: function () {
      io.msg("'How does a geo-probe work?' you ask Aada.")
      io.msg("'Simple. Once deployed on the planet, I send it to an interesting rock, and it extends an arm that takes a sample.'")
      io.msg("'Okay, but I was wondering what sort of analysis it does. Is it infra-red, or X-ray diffraction or what?'")
      io.msg("'Er, yeah, I expect so.'")
      w.Aada.geologyFlag1 = true
    },
    areaAskResponse: function () {
      io.msg("'I am the geologist.'")
      io.msg("'Okay. So how long have you been in geology?'")
      io.msg("'Well, I've taken an interest for years....'")
      w.Aada.geologyFlag2 = true
    },
    backgroundAskResponse: function () {
      if (this.relationship < 3) {
        io.msg("'I'd... rather not say. There's nothing sinister, it's just... well, I'd rather you judge me on what I do, rather than where I come from. Does that make sense?'")
        io.msg("'I guess...' You wonder if she might divulge more when you get to know her better.")
      } else {
        io.msg("'I'd... Well, I suppose it doesn't matter now. I have a sister, Maikki; she's twelve years older than me. My father is a very powerful man, and he had her genetically engineered to be his perfect daughter. She was to be his legacy, the one to continue his empire. She had other ideas. Became a mercenary, living on the fringe.")
        io.msg("'So here I am,' she continued, 'a clone of Maikki. For years father kept me, well, prisoner in effect. I escaped, but I knew he would always be after me. This seemed the perfect getaway; no way can he reach me here, and by the time we get back to Earth, centuries will've passed. So I signed up as geologist.'")
      }
    },
    askOptions: [
      {
        name: 'lost probe',
        test: function (p) { return p.text.match(/(lost|destroyed) (bio|geo|bio-|geo-)?(probe|contact)/) },
        response: function () {
          if (w.Ostap.lostProbe) {
            io.msg("'What does Xsansi mean by \"contact lost\" with that probe?' you ask Aada.")
            io.msg("'The probe was destroyed, I guess. Or too damaged to transmit anyway.'")
            io.msg("'Any idea how that would happen?'")
            io.msg("'What am I, an expert on...? Oh, right, I am. Hmm, well I guess it could land in a volcano or something. Are they water-proof? I guess they must be. Struck by lightning... Mechanical failure... That sort of thing, I guess.'")
          } else {
            io.msg("'Do we ever lose probes?' you ask Aada.")
            io.msg("'Er, that's a good question. I guess we must do, we are exploring the unknown, right?'")
          }
        }
      },

      {
        test: function (p) { return p.text.match(/lack of*|inability/) },
        response: function () {
          io.msg("'You don't seem that... well up on geology,' you suggest to Aada.")
          io.msg("'What's that supposed to mean?'")
          if (w.Aada.geologyFlag1 && w.Aada.geologyFlag2) {
            io.msg("'You don't seem to know much about how the prpobes work, or have much background in geology.'")
            io.msg("She sighs. 'It's true. I signed up to get away from something, and, well, I know a rock when I see it. And these systems are all automated, it's not like you need a higher degree to launch a probe. We're really just technicians. I'll be able to cope. I learn fast, you'll see.'")
          }
          w.Aada.geologyFlag2 = true
        }
      }
    ],

    tellOptions: [
      {
        test: function (p) { return p.text.match(/.* hot/) },
        response: function () {
          io.msg("'You look hot!' you say Aada.")
          io.msg("'If you're trying to get in my knickers, forget it.'")
        }
      }
    ],

    // Probe deployment
    deployProbeAction: 0,
    deployProbeCount: 0,
    deployProbeTotal: 0,
    deployProbe: function (arr) {
      const count = parseInt(arr[0])
      switch (this.deployProbeAction) {
        case 0:
          if (w.Xsansi.currentPlanet === 0 && this.deployProbeTotal === 0) {
            this.io.msg("'Okay, " + toWords(count) + ' probe' + (count === 1 ? '' : 's') + "...' says Aada, looking blankly at the console for a moment. 'How hard can it be?' She starts tapping at the key board.")
          } else {
            this.io.msg("'Another " + toWords(count) + ' probe' + (count === 1 ? '' : 's') + "...' says Aada. 'Easy enough.'")
          }
          this.deployProbeAction++
          break
        case 1:
          this.io.msg('Aada prepares the ' + toOrdinal(this.deployProbeCount + 1) + ' probe.')
          this.deployProbeAction++
          break
        case 2:
          this.io.msg('Aada launches the ' + toOrdinal(this.deployProbeCount + 1) + ' probe.')
          deployProbe(this, 'geo', this.deployProbeTotal)
          this.deployProbeCount++
          this.deployProbeTotal++
          if (this.deployProbeCount === count) {
            this.deployProbeAction++
          } else {
            this.deployProbeAction--
          }
          break
        case 3:
          if (w.Xsansi.currentPlanet === 0 && this.deployProbeTotal === count) {
            this.io.msg("'There!' says Aada, triumphantly. '" + toWords(count) + ' probe' + (count === 1 ? '' : 's') + " deployed. I knew it couldn't be {i:that} tricky.'")
          } else {
            this.io.msg("'That's another " + toWords(count) + ' probe' + (count === 1 ? '' : 's') + " deployed,' says Aada.")
          }
          this.deployProbeAction++
          break
      }
      return this.deployProbeAction === 4
    }
  }
)

('Ha_yoon',
  NPC(true),
  {
    alias: 'Ha-yoon',
    notes: 'Ha-yoon (F) is from Korean (Seoul), 28, and is on the run, after killing a couple of guys. She hopes that after all the time in space her crimes will be forgotten. Engineer.',
    loc: 'engineering3',
    status: 'okay',
    relationship: 0,
    properName: true,
    specialisation: 'engineering',
    examine: 'Ha-yoon is a well-respected Korean engineer, making her possibly the most important member of the crew for ensuring the ship gets back to Earth. She is the shorutil.test of the crew, but perhaps the loudest. She has long, raven=black hair, that falls to her waist, and dark eyes.',
    crewStatus: function () {
      let s = "Crew member Ha-yoon's designation is: engineer. Her current status is: "
      s += this.status + '. Her current location is: ' + w[this.loc].byname({ article: util.DEFINITE }) + '.'
      return s
    },

    // Reactions
    reactionToUndress: 0,
    reactions: function () {
      const g = game.player.getOuterWearable('body')
      if (g === false && this.reactionToUndress < 2) {
        if (game.player.isFemale) {
          io.msg("'Captain!' exclaims Ha-yoon when she sees you naked.")
        } else {
          io.msg("'Captain!' exclaims Ha-yoon when she sees you naked. 'I'm sure we don't need to see {i:that}!'")
        }
        this.pause()
        this.reactionToUndress = 2
      }
    },

    // Conversations
    probesAskResponse: function () {
      io.msg("'How do the probe works?' you ask Ha-yoon.")
      io.msg("'i don't know about the analyse, but each probe is contained in an ablative shell, which is sheds as it descends, with the impact slowed by a combination of parachutes and retro-rockets. Once on the surface, the autonomous probe will start collecting samples, following its programming, moving on crawler tracks. They also have a limited amount of propellent to jump them out of holes.'")
    },
    areaAskResponse: function () {
      io.msg("'I am the engineer. I worked for PanTech in the asteroids, so I know util.spaceship systems. This is a bit different as it runs unmanned for decades...'")
      io.msg("'Apart from me,' Xsansi adds.")
      io.msg("'... Which doesn't change the fact there there are stasis systems for the crew and food, which I had never seen before.'")
    },
    backgroundAskResponse: function () {
      io.msg("'I am from Seoul.'")
      io.msg("'Okay... Any family or anything?'")
      io.msg("'No, no family.'")
    },
    askOptions: [
    ]
  }
)

const NPCS = [w.Ostap, w.Aada, w.Kyle, w.Ha_yoon]

for (let i = 0; i < NPCS.length; i++) {
  createTopics(NPCS[i])
  NPCS[i].status = 100
}
