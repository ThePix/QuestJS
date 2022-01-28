"use strict";

settings.title = "A First RPG...";
settings.author = "The Pixie"
settings.version = "1.1";
settings.thanks = ["Kyle", "Lara"];

settings.customLibraries.push({folder:'rpg', files:["lang-en", "rpg", "skill", "attack", "item_templates", "npc_templates", "commands", "spells", "weapons"]})
settings.files.push('weather')

settings.statusPane = false;
settings.tests = true
settings.playMode = 'dev'
settings.attackOutputLevel = 10
settings.armourScaling = 10
settings.noTalkTo = false
settings.output = function(report) {
  for (let el of report) {
    if (el.level <= settings.attackOutputLevel) {
      if (el.level === 1) {
        msg(el.t)
      }
      else {
        metamsg(el.t)
      }
    }
  }
}





settings.dateTime = {
  startTime:1000000000,
  data:[
    { name:'second', number:60 },
    { name:'minute', number:60 },
    { name:'hour', number:24 },
    { name:'day', number:365 },
    { name:'year', number:999999 },
  ],
  months:[
    { name:'January', n:31},
    { name:'February', n:28},
    { name:'March', n:31},
    { name:'April', n:30},
    { name:'May', n:31},
    { name:'June', n:30},
    { name:'July', n:31},
    { name:'August', n:31},
    { name:'September', n:30},
    { name:'October', n:31},
    { name:'November', n:30},
    { name:'December', n:31},
  ],
  days:['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  formats:{
    def:'%dayOfWeek% %dayOfYear%, %year%, %hour%:%minute% %ampm%',
    time:'%hour%:%minute% %ampm%',
  },
  functions:{
    dayOfWeek:function(dict) { 
      return settings.dateTime.days[(dict.day + 365 * dict.year) % settings.dateTime.days.length] 
    },
    dayOfYear:function(dict) {
      let day = dict.day
      for (let el of settings.dateTime.months) {
        if (el.n > day) return (day + 1) + ' ' + el.name
        day -= el.n
      }
      return 'failed'
    },
    year:function(dict) { return 'AD ' + (dict.year + 1000) },
    hour:function(dict) { return dict.hour < 13 ? dict.hour : (dict.hour - 12) },
    minute:function(dict) { return dict.minute < 10 ? '0' + dict.minute : dict.minute },
    ampm:function(dict) {
      if (dict.minute === 0 && dict.hour === 0) return 'midnight'
      if (dict.minute === 0 && dict.hour === 12) return 'noon'
      return dict.hour < 12 ? 'am' : 'pm'
    },
  },
}


// This function will be called at the start of the game, so can be used
// to introduce your game.
settings.setup = function() {
  player.skillsLearnt = ["Double attack", "Fireball"]
  createAdditionalPane(1, "Spells", 'spells-known', function() {
    let html = ''
    for (const name of player.skillsLearnt) {
      html += '<p class="item" onclick="runCmd(\'cast ' + name + '\')" >' + name + '</p><br/>'
    }
    return html
  })

  player.hitpoints = 20
  player.status = "You are feeling fine"
  player.skillsLearnt = ["Double attack", "Fireball"]
  //settings.updateCustomUI()
  w.rabbit.setLeader(player)
}

