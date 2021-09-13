"use strict";

// Comment necessary for require in QEdit




const settings = {
  

  
  // Also title, author, thanks (option; array)
  
  // Files
  lang:"lang-en",      // Set to the language file of your choice
  customExits:false,      // Set to true to use custom exits, in exits.js
  files:["code", "data"], // Additional files to load
  libraries:["_saveload", "_text", "_io", "_command", "_defaults", "_templates", "_world", "_npc", "_parser", "_commands"],  // util already loaded
  customLibraries:[],
  imagesFolder:'assets/images/',
  iconsFolder:'assets/icons/',
  soundsFolder:'assets/audio/',
  videosFolder:'assets/video/',
  cssFolder:'assets/css/',
  themes:['sans-serif'],
  soundsFileExt:'.mp3',
  

  // The side panes
  panes:'left',           //Can be set to Left, Right or None (setting PANES to None will more than double the speed of your game!)
  panesCollapseAt:700,
  compassPane:true,           // Set to true to have a compass world.
  symbolsForCompass:true,
  statusPane:"Status",    // Title of the panel; set to false to turn off
  statusWidthLeft:120,    // How wide the left column is in the status pane
  statusWidthRight:40,    // How wide the right column is in the status pane
  status:[
    function() { return "<td>Health points:</td><td>" + player.hitpoints + "</td>"; },
  ],
  customPaneFunctions:{},

  // Functions for the side panes lists
  isHeldNotWorn:function(item) {
    return item.isAtLoc(player.name, world.SIDE_PANE) && world.ifNotDark(item) && !item.getWorn();
  },
  isHere:function(item) {
    return item.isAtLoc(player.loc, settings.sceneryInSidePane ? world.PARSER : world.SIDE_PANE) && world.ifNotDark(item);
  },
  isWorn:function(item) {
    return item.isAtLoc(player.name, world.SIDE_PANE) && world.ifNotDark(item) && item.getWorn();
  },


  // Other UI settings
  textInput:true,         // Allow the player to type commands
  cursor:">",             // The cursor, obviously
  cmdEcho:true,           // Commands are printed to the screen
  textEffectDelay:25,
  roomTemplate:[
    "#{cap:{hereName}}",
    "{terse:{hereDesc}}",
    "{objectsHere:You can see {objects} here.}",
    "{exitsHere:You can go {exits}.}",
    "{ifNot:settings:playMode:play:{ifExists:currentLocation:todo:{class:todo:{show:currentLocation:todo}}}}",
  ],
  silent:false,
  walkthroughMenuResponses:[],
  startingDialogEnabled:false,
  darkModeActive:false,   // setting to true is a bad idea (use io.toggleDarkMode)
  plainFontModeActive:false,   // setting to true is a bad idea (use io.togglePlainFontMode)
  mapAndImageCollapseAt:1200,
  funcForDisambigMenu:'showMenuWithNumbers',
  eventFunctions:{},
  timerInterval:1000,  // For timer events, in milliseconds



  // Conversations settings
  noTalkTo:"TALK TO is not a feature in this game.",
  noAskTell:"ASK/TELL ABOUT is not a feature in this game.",
  npcReactionsAlways:false,
  turnsQuestionsLast:5,
  givePlayerSayMsg:true,
  givePlayerAskTellMsg:true,
  funcForDynamicConv:'showMenu',

  // Other game play settings
  failCountsAsTurn:false,
  lookCountsAsTurn:false,
  beforeEnter:function () {},
  afterEnter:function () {},

  // When save is disabled, objects can be created during game play
  saveDisabled:false,

  // Date and time settings
  dateTime:{
    year:"numeric",
    month:"short",
    day:"2-digit",
    hour:"2-digit",
    minute:"2-digit",
    secondsPerTurn:60,
    locale:'en-GB',
    start:new Date('February 14, 2019 09:43:00'),
  },


  // Other settings
  // The parser will convert "two" to 2" in player input (can slow down the game)
  convertNumbersInParser:true,
  tests:false,
  maxUndo:10,
  moneyFormat:"$!",
  questVersion:'0.8',
  mapStyle:{right:'0', top:'200px', width:'300px', height:'300px', 'background-color':'beige' },
  openQuotation:"'",
  closeQuotation:"'",
  fluids:[],
  getDefaultRoomHeading:function(item) { return sentenceCase(lang.addDefiniteArticle(item) + item.alias) },
  afterTurn:[],
  afterFinish:[],
  roomSetList:{},



  saveLoadExcludedAtts:[
    "name", "ensembleMembers", "clonePrototype", "saveLoadExcludedAtts",  "startTime",
    "verbFunctions", "pronouns", "nameModifierFunctions",
    "afterEnterIf", "askOptions", "tellOptions", "regex",
    "reactions", "receiveItems",
  ],




  statsData:[
    {name:'Objects', test:function(o) { return true }},
    {name:'Locations', test:function(o) { return o.room }},
    {name:'Items', test:function(o) { return !o.room }},
    {name:'Takeables', test:function(o) { return o.takeable }},
    {name:'Scenery', test:function(o) { return o.scenery }},
    {name:'NPCs', test:function(o) { return o.npc && !o.player }},
  ],


  // This is split out for io.showInTab to use
  writeCssFiles:function() {
    let html = ''
    html += '<link rel="shortcut icon" type="image/png" id="favicon" href="' + settings.favicon + '"/>'
    html += '<link rel="stylesheet" href="' + settings.cssFolder + 'default.css"/>'
    for (let file of settings.themes) {
      html += '<link rel="stylesheet" href="' + settings.cssFolder + file + '.css"/>'
    }
    if (settings.styleFile) {
      html += '<link rel="stylesheet" href="' + settings.folder + settings.styleFile + '.css"/>'
    }
    return html
  },

  writeScript:function(folder) {
    settings.folder = folder ? folder + '/' : ''
    if (!settings.favicon) settings.favicon = settings.iconsFolder + 'favicon.png'
    document.writeln(settings.writeCssFiles())
    
    if (settings.tests && settings.playMode === 'dev') {
      document.writeln('<script src="lib/test-lib.js"></scr' + "ipt>"); 
      document.writeln('<script src="' + settings.folder + 'tests.js"></scr' + "ipt>"); 
    }
    document.writeln('<script src="' + (folder ? 'lang/' : '' ) + settings.lang + '.js"></scr' + "ipt>");
    if (settings.customExits) {
      document.writeln('<script src="' + settings.folder + settings.customExits + '.js"></scr' + "ipt>"); 
    }
    for (let file of settings.libraries) {
      document.writeln('<script src="' + (folder ? 'lib/' : '' ) + file + '.js"></scr' + "ipt>"); 
    }
    for (let lib of settings.customLibraries) {
      for (let file of lib.files) {
        document.writeln('<script src="' + (folder ? lib.folder + '/' : '') + file + '.js"></scr' + "ipt>"); 
      }
    }
    for (let file of settings.files) {
      document.writeln('<script src="' + settings.folder + file + '.js"></scr' + "ipt>"); 
    }    
  }
}









// These two functions use values in settings, so have to be set later
settings.inventoryPane = [
  {name:'Items Held', alt:'itemsHeld', test:settings.isHeldNotWorn, getLoc:function() { return player.name; } },
  {name:'Items Worn', alt:'itemsWorn', test:settings.isWorn, getLoc:function() { return player.name; } },
  {name:'Items Here', alt:'itemsHere', test:settings.isHere, getLoc:function() { return player.loc; } },
]

settings.setUpDialog = function() {
  const diag = document.querySelector("#dialog")
  document.querySelector("#dialog-title").innerHTML = settings.startingDialogTitle
  document.querySelector("#dialog-content").innerHTML = settings.startingDialogHtml
  if (settings.startingDialogButton) document.querySelector("#dialog-button").innerHTML = settings.startingDialogButton
  document.querySelector("#dialog-button").addEventListener('click', function() {
    settings.startingDialogEnabled = false
    settings.startingDialogOnClick()
    world.begin()
    if (settings.textInput) { document.querySelector('#textbox').focus(); }
    document.querySelector("#dialog").style.display = 'none'
  })

  diag.showModal()
  diag.style.display = 'block'
  diag.style.width = settings.startingDialogWidth + 'px'
  diag.style.height = settings.startingDialogHeight + 'px'
}



// Used by the editor
try { util; }
catch (e) {
  module.exports = { settings:settings }
}
