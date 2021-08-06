"use strict"


// mission state is saved on the player as a number prefixed with mission_
// if not defined, it is not yet given
// if over 1000 it is completed or otherwise can no longer be pursued
const missions = {
  getMission(name) { return this.data.find(el => el.name === name) },
  getState(name) { return player['mission_' + name] },
  isActive(name) { return this.getState(name) !== undefined },
  getStatus(name) { return this.isActive(name) ? this.getMission(name).steps[this.getState(name) - 1].alias : 'n/a' },
  getList:function() {
    let s = 'Missions:'
    for (let el of this.data) {
      if (this.isActive(el.name)) {
        s += '|' + el.alias + ': ' + this.getStatus(el.name)
      }
    }
    return s
  },

  add:function(data) {
    this.data.push(data)
    if (data.star) stars.add(data.star)
    if (data.stars) {
      for (let star of data.stars) stars.add(star)
    }
    if (data.encyc) {
      for (let el of data.encyc) {
        pageData.push({name:el.alias, t:el.t, type:'lookUp'})
        if (el.add === 'start') w.PAGE.add(e.alias, 'lookUp')
      }
    }
  },

  start:function(name) {
    const mission = this.getMission(name)
    player['mission_' + name] = 1
    player['missionStart_' + name] = w.ship.dateTime
    if (mission.star) {
      w.PAGE.add(mission.star.alias, 'star')
      for (let el of mission.star.locations) w.PAGE.add(el.alias, 'star')
    }
    if (mission.stars) {
      for (let star of mission.stars) {
        w.PAGE.add(star.alias, 'star')
        for (let el of star.locations) w.PAGE.add(el.alias, 'star')
      }
    }
  },

  data:[],
}

/*
A mission's attributes:

name           string              required  Single word identifier
alias          string              required  Title
start          Boolean             optional  If true, this mission is there from arrival
brief          string              required  A description of what is required
steps          array of steps      required  Details each step of the mission (in progress)
events         array of events     required  Details each step of the mission (in progress)
star           star                optional  A single star to be added to support this mission
stars          array of stars      optional  A set of stars to be added to support this mission
encyc          array of entries    optional  A set of entries to be added to support this mission




*/


missions.add({
  // If you go early you can deflect the asteroid. A good science office will allow you to do it a bit later. Otherwise evaculate. And that means infestation?
  name:'asteroid',
  alias:'Asteroid heading for Chloris V',
  start:true,
  brief:'An asteroid has been detecting heading for Chloris V. It will impact in ten standard days. The planet supports a small agricultural community (population 243) and a science facility (population 9). Neither have the facilities to get off-planet, let alone deflect the asteroid.|Your mission is, ideally, to deflect the asteroid, and if that proves impossible to evacuate the planet. Evacuees should be brought here to Star Base 142.|Chloris is three days from the main cluster at warp 6.',
  steps:[
    {
      alias:'Get to Chloris',
      state:2,
    },
  ],
  events:[
  ],
  star:{
    name:'chloris',
    alias:'Chloris',
    colour:'orange',
    size:6,
    x:80,
    y:40,
    sector:'7 Iota',
    locations:[
      {
        name:'chloris5',
        alias:'Chloris V',
        desc:'A desolate planet that barely supports human life. At last count, the population was 262.'
      }
    ],
  },
  encyc:[
    {
      alias:'Asteroid',
      t:'Asteroids are basically rocks in space. Occasionally they fall into the gravity well of a planet. Smaller ones just burn up in the atmosphere, larger ones are catastrophic - for example the asteroid that wiped out the dinosaurs 66 million years ago.',
      add:'mission',
    },  
  ]
})




missions.add({
  // Yeoman should point out they need to do the pick if player tries to go there first.
  // Better science allows better deployment - or even an initial scan that shows it is no good, too unstable or intelligent life?    
  name:'deploy_probes',
  alias:'Deploy probes on Calufrax',
  start:true,
  brief:'The planet Calufrax has been noted as a possibility for terro-forming, but further data is required.|Deploy six multi-probes on the surface at appropriate positions. Deploy a satellite for further data. The preliminary data should be retrieved after a minimum of 7 days, but the probes and satellite should be left in place to collect further data.|Hardware to be collected from the star port on Ecros.',
  steps:[
    {
      name:'Pick up probes',
      state:2,
    },
  ],
  star:{
    name:'alphastego',
    alias:'alpha-Stego',
    colour:'white',
    size:6,
    x:190,
    y:340,
    sector:'7 Iota',
    locations:[
      {
        name:'calufrax',
        alias:'Calufrax',
        desc:'Flagged as suitable for terraforming. No other data.',
      }
    ]
  },
})

    
missions.add({
  name:'mining_colony',
  // The colony has awoken a sleeping star beast. All the personal have joined its hive-mind.
  alias:'Investigate Mining Colony',
  start:true,
  brief:'There is a considerable asteroid mining operation orbiting Proxima Major. The last supply ship was due back four days ago, and attempts to raise the colony on subspace have been unsuccessful.|Investigate the colony, and take action as appropriate. Be careful of possible Brakk involvement.|The asteroids are particular rich in trans-uranics, and it is important that the mining operation is running as soon as possible.',
  steps:[
    {
      name:'Go to Proxima Major',
      state:2,
    },
  ],
  star:{
    name:'proxima',
    alias:'Proxima Major',
    colour:'red',
    size:9,
    x:240,
    y:130,
    sector:'7 Iota',
    locations:[
      {
        name:'astoid326',
        alias:'Aastoid 326',
        desc:'',
      }
    ]
  },
})

    
missions.add({
  // The ship picked up some spiders, and they are controlling the crew and passengers. Possibly the spiders put them in a state of ecstacy, and they are all happy like that. Do you rescue them?
  name:'cruise_ship',
  alias:'The Magestic Skies',
  start:true,
  brief:'The Majestic Skies is a starship offering leisure cruises. Occasional cruises include Logopolis, the only city in Sector 7 Iota that has any interest to tourists, and the blue crystal caves on Metabelis III. It was supposed to arrive at Logopolis, on Olympus, two days ago, having departed Metabelis III four days earlier, but never appeared.|Locate the Majestic Skies, and take appropriate action. Use discretion as the tourist industry, meager though it is, provides important income.',
  steps:[
    {
      name:'Locate the Magestic Skies',
      state:2,
    },
  ],
  star:{
    name:'metabelis',
    alias:'Metabelis',
    colour:'white',
    size:3,
    x:140,
    y:180,
    sector:'7 Iota',
    locations:[
      {
        name:'metabelis3',
        alias:'Metabelis III',
        desc:"The third planet of the Metabelis is a pleasant world, know for it blue crystal caves, said to have mind-enhancing properties. This has allowed some minor tourism to develop, though the colony is mostly agricultural and mining.",
      }
    ]
  },
})

    
missions.add({
  // Obviously pirates will attack. When they flee, do you follow to get to their base? A good science officer might be able to work out where the base is is anyway.
  name:'protect_ship',
  alias:'Protect the Dogged Plodder',
  start:true,
  brief:'The cargo vessel Dogged Plodder is due to head from Morestra to Star Base 142 in seven days time. It will be transporting high value chips, and is almost certain to be targeted by pirates.|The Dogged Plodder must be protected for the entirety of its journey.|The vessel is only capable of warp 3, so the journey will take four days.',
  steps:[
    {
      name:'Go to Morestra',
      state:2,
    },
  ],
})

    
missions.add({
  // Need to check timing to make sure this is doable with other priorities as it will require travelling.
  // Disguising the ship would be a good idea. A good armsman could suggest it. A good engineer or science could implement it.
  name:'piracy',
  alias:'Clandestine attack',
  start:true,
  brief:'A Brakk vessel will pass through the sector in twelve days. It would be unfortunate if it fell victim to the numerous pirates known to operate in the area.|Obviously the Admiralty cannot support any attack on the vessel.',
  steps:[
    {
      name:'',
      state:2,
    },
  ],
})

    
missions.add({
  // It may not be an infection at all, but an attack (cybermats!)
  name:'medical_supplies',
  alias:'Medical emergency',
  brief:'The colony on Peladon has sent an urgent request for medical help, following an outbreak of some highly contagious infection. The exact nature of the infection is unclear, as no one on the colony has been able to perform any tests - despte there being two doctors in the colony.|Investigate the situation and provide such assistance as you can. It may be necessary to quanrantine the planet, and the Star Quest depending on the risk.',
  steps:[
    {
      name:'',
      state:2,
    },
  ],
})

    
missions.add({
  // Need to check timing to make sure this is doable with other priorities as it will require travelling.
  // Disguising the ship would be a good idea. A good armsman could suggest it. A good engineer or science could implement it.
  name:'diplomacy',
  alias:'Bandraginus V Diplomacy',
  brief:'Bandraginus V is an independant planet that has traditionally kept itself apart from the rest of mankind. Recently a political faction has appeared that is interested in uniting. As yet they are in the minority, but they are growing.|Meet the leaders of the United Humanity Party, and see what can be done to help them.',
  steps:[
    {
      name:'',
      state:2,
    },
  ],
})

