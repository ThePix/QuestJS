"use strict"


createItem("wall", BACKSCENE(), { 
  alias:"walls",
  shoot:function(options) {
    msg('{nv:char:shoot:true} the wall, leaving a hole. Someone is going to be annoyed...', options)
    if (!currentLocation.wall_shoot_count) currentLocation.wall_shoot_count = 0
    currentLocation.wall_shoot_count++
    if (currentLocation.wall_shoot_count === 1) {
      currentLocation.addendum_examine_wall = 'There is a gun shot hole in the wall.'
    }
    else {
      currentLocation.addendum_examine_wall = 'There are {number:currentLocation:wall_shoot_count} gun shot holes in the wall.'
    }
  },
})

createItem("floor", BACKSCENE(), {
  synonyms:["ground"],
})

createItem("ceiling", BACKSCENE(), {
})



setRegion('house', {
  smell:'There is a faint musty smell, with just a hint of polish.',
  listen:'It is eerily quiet...',
  floor:"The floor is wooden, and well-polished.",
  wall:"The walls are all paneled in wood.",
  ceiling:"The ceiling is white, with simple decorations along each side.",  
})




createItem("me", PLAYER(), {
  loc:"hall",
  synonyms:['me', 'myself'],
  examine: "Just a regular guy.",
  shoot:function(options) {
    msg("{nv:char:shoot:true} you{ifPlayer:char:rself} in the head. It hurts, but not for long.|Game over...", options)
    log(game.turnCount)
    game.turnCount++
    log(game.turnCount)
    io.finish(true)
  },
})

createRoom("lounge", {
  desc:"The lounge is boring, the author really needs to put stuff in it. A door is painted on the wall to the north.",
  north:new NonExit('The door is painted on!'),
  east:new BarredExit('That way is permanently locked.'),
  west:new Exit('hall', {alsoDir:['up']}),
})



createRoom("hall", {
  alias:"hall (north)",
  desc:"The hall is also boring, the author really needs to put stuff in it.",
  east:new Exit('lounge'),
  south:new Exit('hall_south'),
})


createRoom("hall_south", {
  alias:"hall (south)",
  desc:"The south end of the hall is also boring, the author really needs to put stuff in it.",
  north:new Exit('hall'),
  //visibleFrom:['hall'],
  //visibleFromPrefix:'At the other end of the hall',
  visibleFrom:function(room, request) {
    if (currentLocation.name !== 'hall') return false
    return function(str, npc) {
      msg("At the end of the hall you see " + str.replace('s{!:verb}', 'ing'), {npc:npc})
    }
  },
})


createItem("mouth", COMPONENT('me'), CONTAINER(), {
  loc:"me",
  owner:'me',
  examine: "Teeth and a tongue.",
  content:function() {
    const contents = this.getContents()
    return contents.length > 0 ? contents[0] : null
  },
  testDropIn:function(options) {
    if (options.item.loc !== options.char.name) {
      return falsemsg("{nv:char:don't:true} have {nm:item:the}.", options)
    }
    if (!options.item.spittable) {
      return falsemsg("{nv:char:cannot:true} put {nm:item:the} in your mouth.", options)
    }

    if (options.item.loc === 'mouth') {
      return falsemsg("{pv:item:be:true} already.", options)
    }

    options.otherItem = this.content()
    if (options.otherItem) {
      return falsemsg("{nv:char:have:true} {nm:otherItem:the} in {pa:char} mouth already.", options)
    }

    return true
  },
  afterDropIn:function(options) {
    options.item.loc = options.char.name
    options.item.inMouth = true
  },
})

createItem("gum", SPITTABLE(), {
  loc:"lounge",
  //spittable:true,
  examine: "Just some gum",
  pronouns:lang.pronouns.massnoun,
})

createItem("marble", TAKEABLE(), {
  loc:"lounge",
  spittable:true,
  examine: "A blue marble",
})

createItem("doobry", TAKEABLE(), {
  loc:"lounge",
  examine: "Just an unspecified thing you can pick up.",
})

createItem("pistol", TAKEABLE(), {
  loc:"Lara",
  synonyms:['gun'],
  gun:true,
  ammo:6,
  examine: "Just a regular pistol with {number:item:ammo} bullets in it.",
  shoot:function(options) {
    return falsemsg("{nv:char:spend:true} ten minutes trying to get the gun to point at itself, but it seems to be made of metal and just too stiff to bend that way.", options)
  },    
})

createMale("Henry", {
  loc:"lounge",
  examine: "Just a regular guy.",
  agenda:[
    "moveTo:hall",
    "moveTo:hall_south",
    "text:Henry looks{!:verb} at his watch.",
    "moveTo:hall",
    "moveTo:hall_south",
    "text:Henry looks{!:verb} at his watch.",
    "moveTo:hall",
    "moveTo:hall_south",
    "text:Henry looks{!:verb} at his watch.",
    "moveTo:hall",
    "moveTo:hall_south",
    "text:Henry looks{!:verb} at his watch.",
  ],
  shoot:function(options) {
    msg("{nv:char:shoot:true} Henry, and he dies, a patch of blood spreading across the floor.", options)
    w.Henry.transform(w.Henrys_corpse)
    w.Henry.agenda = []
    return true
  },
  getAgreementDefault:function() {
    return falsemsg("'I'm not doing that,' exclaims Henry.")
  },
})

createFemale("Lara", {
  loc:"hall",
  examine: "Just a regular psychotic woman.",
  shoot:function(options) {
    msg("Why would anyone shoot Lara?", options)
    return false
  },    
  getAgreementDefault:function() {
    return falsemsg("'I'm not doing that,' exclaims Henry.")
  },
  getAgreementShoot:function(options) {
    //if (options.target === w.Henry) return true
    //return falsemsg("'I'm not happy about doing that,' says Lara.")
      
    
    if (options.target === w.Lara) return falsemsg("'I'm not about to shoot myself!' says Lara.")
    //if (options.target === player) return falsemsg("'You really want me to shoot you?' asks Lara. 'Who's going to pay me then?'")
    return true
  },
  interviewTopics:{
    t:"'Hi,' says Lara, 'have you got my carrots?'",
    options:{
      "Yes":{
        t:"'Yes,' you reply, 'got them right here.'",
        script:function() { log('Done 1') },
      },
      "No":{
        t:"'No,' you reply, 'still looking.'|'Oh... Well when will you have them?",
        options:{
          "Soon... Probably":{
            options:{
              "Never":true,
              "I'll do it now":"'Okay, I'll do it now.'",
            },
            t:"Soon... Probably,' you reassure the hungry rabbit.|'But when?' she asks. 'Fading away bunny!'",
          },
          "Never":{
            t:"'It's really not going to happen.'|Lara looks disappointed with you. And very angry. 'Why not?'",
            question:{
              t:"'{show:result},' you say.|'Not good enough!'",
              script:function(options) { log(options) },
              options:{
                "Never":true,
                "OK, I'll do it now":"'Okay, I'll do it now.'",
              },
            },
          },
        },
      },
    },
  },
})


const processInterviewTopics = function(npc, data) {
  for (const key in data) {
    //log(key)
    if (data[key] === true) continue
    const entry = typeof data[key] === 'string' ? {t:data[key]} : data[key]
    const topic = createItem(npc.name + '_' + verbify(key), TOPIC(), {
      loc:npc.name,
      alias:key,
      interviewMsg:entry.t,
      interviewScript:entry.script,
    })
    if (entry.options) {
      //log(entry.options)
      topic.optionNames = Object.keys(entry.options).map(el => npc.name + '_' + verbify(el))
      //log(topic.optionNames)
      processInterviewTopics(npc, entry.options)
      topic.script = function(options) {
        if (options.topic.interviewScript) options.topic.interviewScript(options)
        if (options.topic.interviewMsg) msg(options.topic.interviewMsg, options)
        const opts = options.topic.optionNames.map(el => w[el])
        options.char.askTopics("Response?", ...opts)
      }
    }
    else if (entry.question) {
      //log(entry.question)
      topic.question = entry.question
      processInterviewTopics(npc, {question:entry.question})
      topic.script = function(options) {
        if (options.topic.interviewScript) options.topic.interviewScript(options)
        if (options.topic.interviewMsg) msg(options.topic.interviewMsg, options)
        askText("Response?", function(result) {
          msg("You typed " + result + ".")
          options.result = result
          options.char.questionAnswer = result
          log(options)

          if (options.topic.interviewScript) options.topic.interviewScript(options)
          if (options.topic.interviewMsg) msg(options.topic.interviewMsg, options)

          
          
          const nextTopicName = options.char.name + '_question'
          log(nextTopicName)
          //w[nextTopicName].runscript()
        })
      }
    }
    else {
      topic.script = function(options) {
        if (options.topic.interviewScript) options.topic.interviewScript(options)
        if (options.topic.interviewMsg) msg(options.topic.interviewMsg, options)
      }
    }
  }
  
  
}

processInterviewTopics(w.Lara, {start:w.Lara.interviewTopics})
w.Lara_start.show()


createItem("Henrys_corpse", NPC(), {
  alias:"Henry's corpse",
  examine: "Just a regular guy, brutally murdered in the prime of his life.",
  shoot:function(options) {
    return falsemsg("He is already dead.")
  },    
})
