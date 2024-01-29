"use strict"

createItem("me", PLAYER(), {
  loc:"lounge",
  synonyms:['me', 'myself'],
  examine: "Just a regular guy.",
})

createRoom("lounge", {
  desc:"Welcome, your majesty...",
})


createItem("home", {
  progress:0,  // i.e., turn
  population:100,
  food:100,
  money:100,
  happiness:'contented',
  
  initTurn:function() {
    this.output = []
  },

  beforeTurn:function() {
    this.progress += 1
  },
  
  doTurn:function() {
    // handle discoveries
    for (const key in w) {
      const o = w[key]
      if (!o.discovery) continue
      if (o.discovered) continue
      log(o.name + ' (' + o.discoverAt + ')')
      const owner = w[o.belongsTo]
      log('- ' + owner.name + ' (' + owner.progress + ')')
      if (!owner) {
        return errormsg('The "belongsTo" attribute of ' + o.name + ' is wrong or missing:' + o.belongsTo)
      }
      if (o.discoverAt <= owner.progress) {
        o.discovered = true
        home.output.push(o.discovery)
      }
    }
  },
})

// for convenience
const home = w.home

// progress tracks how far we have got in each aspect
// efficiency allows us to tweak how well we do each turn
// bonus is an in-game modifier


createItem("agriculture", {
  foodBySeason:[0, 15, 50, 135],
  foodCommentBySeason:['No food produced in winter', 'Hunters have found limited food across the spring.', 'Hunters have found plenty of food across the summer.', 'Food has been harvested from the fields'],
  foodFactor:0.4,        // one person eats this much food each turn
  populationGrowth:0.02, // pop increases by this each turn unless starving
  starvationFactor:2,    // how quickly people die when starving
  efficiency:1,          // how well farms do

  initTurn:function() {
    this.bonus = 0
  },
  
  doTurn:function() {
    log("Bonus: " + this.bonus)
    const season = home.progress % 4
    home.output.push(this.foodCommentBySeason[season])
    home.food += this.foodBySeason[season] * this.efficiency * (100 + this.bonus) / 100

    const foodConsumption = this.foodFactor * home.population
    if (foodConsumption > home.food) {
      home.population -= Math.floor((foodConsumption - home.food) / this.starvationFactor)
      home.food = 0
      home.output.push('People are starving!')
    }
    else {
      home.population += Math.floor(home.population * this.populationGrowth)
      home.food -= foodConsumption
    }
  },
})




createItem("science", PROGRESSABLE(), {
  alias:'Science Minister',
  dept:true,
  efficiency:1,
  examine:"Science is important to any nation; it can lead to more efficient agriculure, new industries and better weapons. And no good ruler wants anyone to think his kingdom is a technologcal backwater.",
  discovered:true,  // known from the start
  
  
})



createDiscovery("crop_rotation", {
  discovery:'"Your magesty, our neighbours are getting better yields from the land using a system called crop rotation, whereby a field is used for grain one year, legumes the next and left fallow for livesock the next. Perhaps you might discuss with the miniser for the land."',
  belongsTo:'science',
  discoverAt:2,
  bonusValue:20,
  bonusTo:'agriculture',
  question:"Implement crop rotation?",
})



createItem("druids", PROGRESSABLE(), {
  alias:'Druid representative',
  dept:true,
  efficiency:1,
  examine:"Druids worship the earth mother, at a sacred grove in the forest.",
  
  belongsTo:'home',
  discoverAt:7,
  discovery:'"Your magesty, a group of druids have found a sacred grove in the forest, and wish to use it in their arcane rituals."',
})



createDiscovery("arcane_rituals", {
  discovery:'"Your majesty, the earth goddess has indicated she wishes us to perform certain rituals. I can assure you that if you will permit us to perform these sacred duties properly, crops will be even more bountiful"."',
  alias:'Fertility rituals',
  belongsTo:'druids',
  discoverAt:1,
  bonusValue:20,
  bonusTo:'agriculture',
  question:"Allow the druids to perform arcane rituals?",
})



createDiscovery("moonlight_dancing", {
  discovery:'"Your majesty, the earth goddess has indicated she wishes us to perform certain rituals in a more natural form under the light of the full moon, but the yokels object to our naked dancing. I can assure you that if you will permit us to perform these sacred duties properly, crops will be even more bountiful"."',
  alias:'Fertility rituals 2',
  supercedes:"arcane_rituals",
  belongsTo:'druids',
  discoverAt:4,
  bonusValue:20,
  bonusTo:'agriculture',
  beforeTurn:function() {
    if (this.active === 2) w[this.bonusTo].bonus += this.bonusValue
    if (this.active === 1) w[this.bonusTo].bonus += w[this.supercedes].bonusValue
  },
  question:"Allow the druids to perform naked rituals under the moonlight at the risk of alienating locals?",
  choices:[
    {
      alias:'Allow naked moonlit rituals',
      properNoun:true,
      script:function() {
        w[options.topic.discoveryName].active = 2
        msg(options.topic.alias + ": Naked/moonlit")
      }
    },      
    {
      alias:'Allow basic rituals only',
      properNoun:true,
      script:function() {
        w[options.topic.discoveryName].active = 1
        msg(options.topic.alias + ": Basic")
      }
    },      
    {
      alias:'Forbid rituals',
      properNoun:true,
      script:function() {
        w[options.topic.discoveryName].active = 0
        msg(options.topic.alias + ": Disabled")
      }
    },      
  ],

})



  
