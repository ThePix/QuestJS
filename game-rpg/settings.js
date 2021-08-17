"use strict";

settings.title = "A First RPG...";
settings.author = "The Pixie"
settings.version = "1.1";
settings.thanks = ["Kyle", "Lara"];

settings.libraries.push('rpg')

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
  player.hitpoints = 20;
  player.status = "You are feeling fine";
  player.skillsLearnt = ["Double attack", "Fireball"]
  settings.updateCustomUI()
  w.rabbit.setLeader(player)
}




settings.customUI = function() {
  document.writeln('<div id="rightpanel" class="side-panes side-panes-right">');
  document.writeln('<div id="rightstatus">');
  document.writeln('<table align="center">');
  document.writeln('<tr><td width="120"><b>Current weapon</b></td></tr>');
  document.writeln('<tr><td id="weapon-td"><img id="weaponImage" onclick="skillUI.chooseWeapon();"/></td></tr>');
  document.writeln('<tr><td><b>Health</b></td></tr>');
  document.writeln('<tr><td style="border: thin solid black;background:white;text-align:left;\" title="Your current hits" id="hits-td"><span id="hits-indicator" style="background-color:green;padding-right:100px;"></span></td></tr>');
  document.writeln('<tr><td><b>Spell points</b></td></tr>');
  document.writeln('<tr><td style="border: thin solid black;background:white;text-align:left;\" title="Your current PP" id="pp-td"><span id="pp-indicator" style="background-color:blue;padding-right:100px;"></span></td></tr>');
  document.writeln('<tr><td><b>Armour</b></td></tr>');
  document.writeln('<tr><td style="border: thin solid black;background:white;text-align:left;\" title="Your current armour" id="armour-td"><span id="armour-indicator" style="background-color:red;padding-right:100px;"></span></td></tr>');
  document.writeln('</table>');
  document.writeln('</div>');

  document.writeln('<div style="text-align:center"><input type="button" id="castButton" text="Cast" value="Cast" onclick="skillUI.castButtonClick()" style="width: 80px" disabled="yes"/></div>');

  document.writeln('<table align="center">');
  for (let row = 0; row < 8; row++) {
    document.writeln('  <tr>');
    for (let col = 0; col < 3; col++) {
      document.write(`    <td id="cell${row * 3 + col}" width="40"></td>`);
    }
    document.writeln('  </tr>');
  }
  document.writeln('</table>');
  document.writeln('</div>');
  
  document.writeln('<div id="choose-weapon-div" title="Select a weapon">');
  document.writeln('<select id="weapon-select"></select>');
  document.writeln('</div>');
  //document.onreadystatechange = function() {  // !!!!!  I think this will overwrite the main one !!!!
    /*document.querySelector( "#choose-weapon-div" ).dialog({    !!!!!!!!!!!!!
      autoOpen: false,  
      buttons: {
        OK: function() { skillUI.chosenWeapon() }
      },
    });*/
  //}
};  


settings.updateCustomUI = function() {
  document.querySelector('#weaponImage').setAttribute('src', settings.imagesFolder + 'icon-' + player.getEquippedWeapon().image + '.png');
  document.querySelector('#weapon-td').setAttribute('title', "Weapon: " + player.getEquippedWeapon().alias);
  
  document.querySelector('#hits-indicator').style.paddingRight = (120 * player.health / player.maxHealth) + 'px'
  document.querySelector('#hits-td').setAttribute('title', "Hits: " + player.health + "/" + player.maxHealth);

  document.querySelector('#pp-indicator').style.paddingRight = (120 * player.pp / player.maxPP) + 'px'
  document.querySelector('#pp-td').setAttribute('title', "Power points: " + player.pp + "/" + player.maxPP);

  document.querySelector('#armour-indicator').style.paddingRight = (120 * player.armour / player.maxArmour) + 'px'
  document.querySelector('#armour-td').setAttribute('title', "Armour: " + player.armour + "/" + player.maxArmour);

  //console.log(document.querySelector('#hits-td').setAttribute('title'));


  //console.log(player.skillsLearnt)
  skillUI.removeAllButtons()
  for (let skill of skills.list) {
    //console.log(skill.name)
    if (player.skillsLearnt.includes(skill.name)) {
      skillUI.setButton(skill)
    }
  }
  for (let key in w) {
    if (w[key].health !== undefined && w[key].maxHealth === undefined) {
      w[key].maxHealth = w[key].health;
    }
  }
};






const skillUI = {
  skills:[],
  selected:false,
  
  setButton:function(skill) {
    if (!skill.icon) skill.icon = skill.name.toLowerCase()
    const cell = document.querySelector('#cell' + skillUI.skills.length)
    let s = '<div class="skill-container" title="' + skill.tooltip + '" >'
    s += '<img class="skill-image" src="' + settings.imagesFolder + 'icon-' + skill.icon + '.png"/>'
    if (skill.spell) s += '<img class="skill-image" src="' + settings.imagesFolder + 'flag-spell.png"/>'
    s += '</div>'
    cell.innerHTML = s
    cell.click(skillUI.buttonClickHandler)
    cell.style.backgroundColor = 'black'
    cell.style.padding = '2px'
    cell.setAttribute("name", skill.name)
    skillUI.skills.push(skill)
  },

  resetButtons:function() {
    //console.log('reset')
    for (let i = 0; i < skillUI.skills.length; i++) {
      document.querySelector('#cell' + i).style.backgroundColor = 'black'
    }
    document.querySelector('#castButton').setAttribute('disabled', true)
    skillUI.selected = false
  },


  removeAllButtons:function() {
    for (let i = 0; i < skillUI.skills.length; i++) {
      document.querySelector('#cell' + i).innerHTML = ""
    }
    skillUI.skills = []
    document.querySelector('#castButton').setAttribute('disabled', true)
    skillUI.selected = false
  },

  buttonClickHandler:function(event) {
    console.log(event)
    skillUI.resetButtons()
    
    const n = parseInt(event.currentTarget.id.replace('cell', ''))
    console.log(n)
    skillUI.selected = n
    const cell = document.querySelector("#cell" + n)
    cell.style.backgroundColor = 'yellow'
    const skill = skillUI.skills[n]
    if (skill.noTarget) document.querySelector('#castButton').setAttribute('disabled', false)
  },

  getSkillFromButtons:function() {
    return skillUI.selected ? skillUI.skills[skillUI.selected] : null
  },
  
  castButtonClick:function() {
    console.log("CKLOICK!!!")
    console.log("CKLOICK!!! " + skillUI.selected)
    console.log("CKLOICK!!! " + skillUI.skills)
    console.log("CKLOICK!!! " + skillUI.skills[skillUI.selected].name)
  },


  chooseWeapon:function() {
    console.log("in chooseWeapon");
    const weapons = [];
    for (let o in w) {
      if (w[o].isAtLoc(player, world.SCOPING) && w[o].weapon) {
        console.log(o);
        weapons.push('<option value="'+ o +'">' + w[o].listAlias + '</option>');
      }
    }
    const s = weapons.join('');
    console.log(s);

    document.querySelector('#weapon-select').innerHTML = s
    
    document.querySelector("#choose-weapon-div").dialog("open")
  },

  chosenWeapon:function() {
    document.querySelector("#choose-weapon-div").dialog("close")
    const selected = document.querySelector("#weapon-select").value
    console.log("in chosenWeapon: " + selected)
    w[selected].equip(false, player)
    world.endTurn(world.SUCCESS)
  },

}




settings.startingDialogEnabled  = true;

settings.maxPoints = 10
settings.skills = [
  "Athletics",
  "Lore",
  "Manipulation",
  "Subterfuge",
]
settings.professions = [
  {name:"Farm hand", bonus:"strength"},
  {name:"Scribe", bonus:"intelligence"},
  {name:"Exotic dancer", bonus:"agility"},
  {name:"Merchant", bonus:"charisma"},
]
settings.startingDialogTitle = "Who are you?"
settings.startingDialogWidth = 500
settings.startingDialogHeight = 480
settings.startingDialogButton = 'OK'

settings.startingDialogHtml = '<p>Name: <input id="namefield" type="text" value="Zoxx" /></p>'

settings.startingDialogHtml += '<p>Male: <input type="radio" id="male" name="sex" value="male">&nbsp;&nbsp;&nbsp;&nbsp;'
settings.startingDialogHtml += 'Female<input type="radio" id="female" name="sex" value="female" checked></p>'

settings.startingDialogHtml += '<p>Background: <select id="job">'
for (const s of settings.professions) {
  settings.startingDialogHtml += '<option value="' + s.name + '">' + s.name + '</option>'
}
settings.startingDialogHtml += '</select></p>'

settings.startingDialogHtml += '<p>Magic vs combat: <input type="range" id="magic" name="magic" value="50" min="0" max="100" oninput="settings.updateMagic()"></p>'
settings.startingDialogHtml += '<p>Magic: <span id="sliderMagic">50</span> Combat: <span id="sliderCombat">50</span></p>'

settings.startingDialogHtml += '<table>'
for (const s of settings.skills) {
  settings.startingDialogHtml += '<tr><td>' + s + '</td><td id="points-' + s + '">0</td><td>'
  settings.startingDialogHtml += '<input type="button" value="-" onclick="settings.pointsAdjust(\'' + s + '\', false)" />'
  settings.startingDialogHtml += '<input type="button" value="+" onclick="settings.pointsAdjust(\'' + s + '\', true)" />'
  settings.startingDialogHtml += '</td></tr>'
}
settings.startingDialogHtml += '<tr><td>Total</td><td id="points-total">0/' + settings.maxPoints + '</td><td>'
settings.startingDialogHtml += '</td></tr>'
settings.startingDialogHtml += '</table>'


settings.pointsAdjust = function(skill, up) {
  if (player[skill] === undefined) {
    for (const s of settings.skills) player[s] = 0
  }
  let n = 0
  for (const s of settings.skills) n += player[s]

  if (up && n < settings.maxPoints) {
    player[skill]++
    n++
  }
  if (!up && player[skill] > 0) {
    player[skill]--
    n--
  }

  document.querySelector('#points-' + skill).innerHTML = player[skill]
  document.querySelector('#points-total').innerHTML = n + '/' + settings.maxPoints
}

settings.updateMagic = function() {
  player.magic = parseInt(document.querySelector("#magic").value)
  player.combat = 100 - player.magic
  document.querySelector('#sliderMagic').innerHTML = player.magic
  document.querySelector('#sliderCombat').innerHTML = player.combat
}

settings.startingDialogOnClick = function() {
  player.class = document.querySelector("#job").value
  player.isFemale = document.querySelector("#female").checked
  player.setAlias(document.querySelector("#namefield").value)
}
settings.startingDialogInit = function() {
  document.querySelector('#namefield').focus()
}
settings.startingDialogAlt = function() {
  for (const s of settings.skills) player[s] = Math.floor(settings.maxPoints / settings.skills.length)
  player.magic = 50
  player.combat = 50
  player.class = 'Merchant'
  player.setAlias('Zoxx')
}

