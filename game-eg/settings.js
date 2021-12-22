"use strict";

settings.title = "A First Step..."
settings.author = "The Pixie"
settings.version = "1.2"
settings.thanks = ["Kyle", "Lara"]

settings.noTalkTo = false
settings.noAskTell = false

settings.tests = true
settings.playMode = 'dev'
settings.reportAllSvg = true

settings.textEffectDelay = 100

settings.imagesFolder = 'images/'
settings.libraries.push('zone')
settings.libraries.push('quest')
settings.styleFile = 'style'


//settings.libraries.push('item_links')

//settings.localStorageDisabled = true

settings.textEffectDelay = 100

settings.symbolsForCompass = true

settings.fluids = ['water', 'honey', 'lemonade']

settings.status = [
  "hitpoints",
  function() { return "<td>Spell points:</td><td>3</td>"; },
  function() { return "<td>Health points:</td><td>" + player.hitpoints + "</td>"; },
  function() { return '<td colspan="2">' + player.status + "</td>"; },
]

settings.intro = "This is a quick example of what can be done in Quest 6.|Your objective is to turn on the light in the basement, but there are, of course, numerous hoops to jump through.|If you are successful, see if you can do it again, but getting {popup:Kyle:This is an example of a pop-up.} to do everything. It is {dateTime}. You should find that you can tell an NPC to do pretty much anything (except look at things for you and talk to people for you).|There is now a sizeable desert to the west you can explore too.|Learn more about Quest 6 {link:here:https://github.com/ThePix/QuestJS/wiki}."

settings.mapDrawLabels=true

// This function will be called at the start of the game, so can be used
// to introduce your game.
settings.setup = function() {
  player.hitpoints = 20;
  player.status = "You are feeling fine";
  io.updateStatus()
}

//settings.libraries.push('item_links')


settings.mapStyle = {right:'0', top:'200px', width:'300px', height:'300px', 'background-color':'yellow' }
settings.mapLabelStyle = {'font-size':'8pt', 'font-weight':'bold', color:'blue'}

settings.funcForDynamicConv = 'showMenuDiag'