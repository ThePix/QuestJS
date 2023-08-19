"use strict";

settings.title = "A First RPG..."
settings.author = "The Pixie"
settings.version = "1.1"
settings.thanks = ["Kyle", "Lara"]


settings.customLibraries.push({folder:'rpg', files:["lang-en", "rpg", "skill", "attack", "item_templates", "npc_templates", "commands", "weapons", "monsters", "agenda", "spells", "quest", "weather"]})

settings.files.push('weather')
settings.files.push("random-dungeon")

settings.status = [
  "<td width=\"30%\">Health:</td><td width=\"70%\">{show:player:health}/{show:player:maxHealth}</td>",
  //"<td>Mana:</td><td>{show:player:mana}</td>",
  "<td>Armour:</td><td>{show:player:getArmour}</td>",
  "<td>Weapon:</td><td>{showOrNot:player:none:getEquippedWeapon:listAlias}</td>",
  "<td>Shield:</td><td>{showOrNot:player:none:getEquippedShield:listAlias}</td>",
  "<td>Element:</td><td>{ifExists:player:attunedElement:{cap:{show:player:attunedElement}}:none}</td>",
  "<td>Target:</td><td>{ifExists:player:target:{cap:{show:player:target:listAlias}}:none}</td>",
]


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

settings.storage = true


settings.getLocationDescriptionAttName = function() {
  return player.apocalypse && currentLocation.apocDesc ? "apocDesc" : "desc"
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
  player.skillsLearnt = ["Double attack", "Fireball", "Stoneskin", "Animate statues", "Ice shard", "Immunity To Frost"]
  createAdditionalPane(1, "Attacks and Spells", 'spells-known', function() {
    let html = ''
    for (const name of player.skillsLearnt) {
      const spell = rpg.list.find(el => el.name === name)
      if (!spell) log("No spell found called: " + name)

      html += '<p class="item" style="'
      if (spell.type === "spell") {
        html += 'background-color:lemonchiffon;'
      }
      else if (spell.type === "natural") {
        html += 'background-color:palegreen;'
      }
      else {
        html += 'background-color:pink;'
      }
      if (!spell.noTarget) {
        html += 'font-style:italic;'
      }
      if (spell.type === "spell") {
        html += '" onclick="runCmd(\'cast '
      }
      else {
        html += '" style="background-color:pink" onclick="runCmd(\'use '
      }
      html += name + '\')" title="' + spell.tooltip + '">' + name + '</p><br/>'
    }
    return html
  })
  
  createAdditionalPane(1, "Active Effects", 'active-effects', function() {
    let html = ''
    for (const name of player.activeEffects) {
      const effect = rpg.findEffect(name)
      if (effect.doNotList) continue
      html += '<p class="item effect-' + effect.css + '" title="' + effect.tooltip + '">' + name + '</p><br/>'
    }
    return html
  })
  
  const div = document.body.querySelector('#right-pane')
  div.appendChild(document.body.querySelector('#active-effects-outer'))
  div.appendChild(document.body.querySelector('#spells-known-outer'))


  const main = document.body.querySelector('#main')
  main.style.marginRight = '190px'
  const inner = document.body.querySelector('#inner')
  inner.style.marginLeft = 'auto'
  inner.style.marginRight = 'auto'
  

  dungeon.generate()


  //settings.updateCustomUI()
  w.rabbit.setLeader(player)
}


settings.collapsibleSidePanes = true

settings.panesCollapseAt = 0
settings.mapAndImageCollapseAt = 0

settings.buttons = [
  { title: "Undo", icon: "fa-backward", cmd: "undo" },
  { title: "Help", icon: "fa-question", cmd: "help" },
  { title: "About", icon: "fa-info", cmd: "about" },
  { title: "Dark mode", icon: "fa-moon", cmd: "dark" },
  { title: "Save", icon: "fa-download", cmd: "save game ow" },
  { title: "Load", icon: "fa-upload", cmd: "load game" },
]


settings.customUI = function() {

  const div = document.createElement('div')
  div.id = 'right-pane'
  div.className = 'side-panes side-panes-right'

  let s = '<div id="right-status" class="pane-div">'
  for (let el of settings.buttons) {
    const js = el.cmd ? "runCmd('" + el.cmd + "')" : el.onclick
    s += ` <a class="link" onclick="if (!io.disableLevel) ${js}"><i class="fas ${el.icon}" title="${el.title}"></i></a>`;
  }
  s += '</div>'

  div.innerHTML = s
  document.body.appendChild(div)
  
  const divs = document.body.querySelectorAll('.pane-div')
  
  //div.appendChild(divs[0])
  div.appendChild(divs[1])
}

settings.indicators = []
settings.indicatorWidth = 140

settings.createIndicator = function(name, colour) {
  settings.indicators.push(name)
  let s = ''
  s += '<tr><td style="text-align:left;\"><b>' + name + '</b></td></tr>'
  s += '<tr><td style="text-align:left;\">'
  s += '<span id="' + name + '-indicator" style="display:inline-block;height:15px;background-color:' + colour + '">'
  s += '</span>'
  s += '<span id="' + name + '-indicator2" style="display:inline-block;height:2px;background-color:silver">'
  s += '</span>'
  s += '</td></tr>'
  return s  
}

settings.updateIndicators = function() {
  for (const el of settings.indicators) {
    const val = player[el.toLowerCase()] / player['max' + el] * settings.indicatorWidth
    document.body.querySelector('#' + el + '-indicator').style.width = val + 'px'
    document.body.querySelector('#' + el + '-indicator2').style.width = (settings.indicatorWidth - val) + 'px'
  }
}


settings.updateCustomUI = function() {
  //settings.updateIndicators()
}





settings.pointsPerLevel = 2

settings.levelUp = function() {
  player.level++
  player.points += settings.pointsPerLevel
  for (const s of settings.skills) player[s + '_old'] = player[s]

  let html = settings.getPointsTable()
  document.body.querySelector('#dialog-title').innerHTML = 'Level up!'
  document.body.querySelector('#dialog-content').innerHTML = html
  io.disable()
  const diag = document.querySelector("#dialog")


  settings.startingDialogOnClick = function() {
    settings.startingDialogEnabled = true
  }

  settings.dialogMode = 'level'
  diag.show()
  diag.style.display = 'block'
  diag.style.width = '200px'

}









//settings.startingDialogEnabled  = true

settings.maxPoints = 12
settings.skills = [
  "Athletics",
  "Strength",
  "Subterfuge",
  "Magic",
]
settings.professions = [
  {name:"Farming", bonus:"strength", text:"You grew up in an isolated farming community; you know farming well, but not much of the world outside your local area."},
  {name:"Craft guild", bonus:"intelligence", text:"You are the child of a master craftsman, who lives in a big."},
  {name:"Noble house", bonus:"agility", text:"Your parents are minor nobles, who are thoroughly mired in court politics."},
  {name:"Merchants", bonus:"charisma", text:"Your family are merchants; they have a caravan of packhorses and wagons, journeying between the major cities a few times a year."},
  {name:"Musicians and players", bonus:"charisma", text:"You are part of an extended family - more of a troupe - who travel the lands entertaining people with music, acting, etc."},
  {name:"Sun temple", bonus:"charisma", text:"You are the child of the high priest of the sun god, and have lived in the temple almost exclusively."},
  {name:"Moon temple", bonus:"charisma", text:"You are the child of the high priestess of the moon goddess, and have lived in the temple almost exclusively."},
  {name:"Thieves' guild", bonus:"charisma", text:"Orphaned at an earlier age, you took to petty theft just to survive. Refusing to join the guild was not an option."},
  {name:"Military", bonus:"charisma", text:"With both parents as career soldiers, it was natural you too would follow in their footsteps."},
  {name:"Academic", bonus:"charisma", text:"Your bookish parents left you pretty much to yourself - meaning you could read any book you liked!"},
  {name:"Barbarian", bonus:"intelligence", text:"A member of a fierce warrior tribe that values honour highly, but treats magic with deep suspicion."},
  {name:"Dwarf", bonus:"charisma", text:"Dwarves like drinking, mining and gold. But surey there is more to them than that?"},
  {name:"High elf", bonus:"charisma", text:"High elves live in wondrous cities, and usually keep themselves to themselves. Some call them aloof and arrogant..."},
  {name:"Wood elf", bonus:"charisma", text:"Wood elves live in enchanted woods, and will go to any length to protect them."},
  {name:"Dark elf", bonus:"charisma", text:"Dark elves live in underground cities, but are otherwise like high elves... which is to say aloof and arrogant."},
]

settings.getPointsTable = function() {
  let flag = false
  let s = '<table>'
  for (const sk of settings.skills) {
    s += '<tr><td width="60">' + sk + '</td><td width="30" id="points-' + sk + '">'
    s += typeof player === 'object' ? player[sk+ '_old'] : 0
    s += '</td><td width="60">'
    s += '<input type="button" value="-" onclick="settings.pointsAdjust(\'' + sk + '\', false)" />'
    s += '<input type="button" value="+" onclick="settings.pointsAdjust(\'' + sk + '\', true)" />'
    s += '</td>'
    if (!flag) {
      flag = true
      s += '<td width="120" rowspan="' + settings.skills.length + '">Click the buttons to assign points to different skill areas. You have ' + settings.maxPoints + ' points to spend in total.</td>'
    }
    s += '</tr>'
  }
  s += '<tr><td>Total</td><td id="points-total">0/' + (typeof player === 'object' ? player.points : settings.maxPoints) + '</td><td>'
  s += '</td></tr>'
  s += '</table>'
  return s
}  



settings.startingDialogTitle = "Who are you?"
settings.startingDialogWidth = 300
settings.startingDialogHeight = 'auto'
settings.startingDialogButton = 'OK'

settings.startingDialogHtml = '<p>Name: <input id="namefield" type="text" value="Zoxx" /></p>'

settings.startingDialogHtml += '<p>Male: <input type="radio" id="male" name="sex" value="male">&nbsp;&nbsp;&nbsp;&nbsp;'
settings.startingDialogHtml += 'Female<input type="radio" id="female" name="sex" value="female" checked></p>'

settings.startingDialogHtml += '<p>Background or race: <select id="job" onChange="settings.updateJobText()">'
for (const s of settings.professions) {
  settings.startingDialogHtml += '<option value="' + s.name + '">' + s.name + '</option>'
}
settings.startingDialogHtml += '</select></p>'
settings.startingDialogHtml += '<div style="height:100px"><p id="background-text"></p></div>'

settings.startingDialogHtml += settings.getPointsTable()






settings.pointsAdjust = function(skill, up) {
  let n = 0
  for (const s of settings.skills) n += player[s]

  if (up && n < player.points) {
    player[skill]++
    n++
  }
  if (!up && player[skill] > player[skill + '_old']) {
    player[skill]--
    n--
  }

  document.querySelector('#points-' + skill).innerHTML = player[skill]
  document.querySelector('#points-total').innerHTML = n + '/' + player.points
}

settings.startingDialogOnClick = function() {
  // character creation
  player.class = document.querySelector("#job").value
  player.isFemale = document.querySelector("#female").checked
  player.setAlias(document.querySelector("#namefield").value)
}
settings.startingDialogInit = function() {
  //if (player[skill] === undefined) {
  for (const s of settings.skills) {
    player[s] = 0
    player[s + '_old'] = 0
  }
  //}
  settings.updateJobText()
  player.points = settings.maxPoints
  document.querySelector('#namefield').focus()
}
settings.updateJobText = function() {
  document.querySelector('#background-text').innerHTML = settings.professions.find(el => el.name === document.querySelector("#job").value).text
}
settings.startingDialogAlt = function() {
  for (const s of settings.skills) player[s] = Math.floor(settings.maxPoints / settings.skills.length)
  player.class = 'Merchant'
  player.setAlias('Zoxx')
  player.points = settings.maxPoints
}
