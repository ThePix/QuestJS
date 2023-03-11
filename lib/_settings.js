"use strict";

// Comment necessary for require in QEdit


const settings = {
  performanceLogStartTime:performance.now(),

  
  // Also title, author, thanks (option; array)
  
  // Files
  lang:"lang-en",      // Set to the language file of your choice
  customExits:false,      // Set to true to use custom exits, in exits.js
  files:["code", "data"], // Additional files to load
  libraries:["_file_saver", "_saveload", "_text", "_io", "_command", "_defaults", "_templates", "_world", "_npc", "_parser", "_commands"],  // util already loaded
  customLibraries:[],
  imagesFolder:'assets/images/',
  iconsFolder:'assets/icons/',
  soundsFolder:'assets/audio/',
  videosFolder:'assets/video/',
  cssFolder:'assets/css/',
  themes:['sans-serif'],
  styleFile:'style',
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
  narrowMode:0,
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
  questVersion:'1.4.0',
  mapStyle:{right:'0', top:'200px', width:'300px', height:'300px', 'background-color':'beige' },
  openQuotation:"'",
  closeQuotation:"'",
  fluids:[],
  getDefaultRoomHeading:function(item) { return sentenceCase(lang.addDefiniteArticle(item, {ignorePossessive:'noLink'}) + item.alias) },
  afterFinish:[],
  roomSetList:{},
  placeholderLocations:[],
  modulesToEndTurn:[],


  saveLoadExcludedAtts:[
    "name", "ensembleMembers", "clonePrototype", "saveLoadExcludedAtts",  "startTime",
    "verbFunctions", "pronouns", "nameModifierFunctions",
    "afterEnterIf", "askOptions", "tellOptions", "regex",
    "reactions", "receiveItems", "scopeStatus",
  ],


  getLocationDescriptionAttName:function() {
    return game.dark ? "darkDesc" : "desc"
  },



  statsData:[
    {name:'Objects', test:function(o) { return true }},
    {name:'Locations', test:function(o) { return o.room }},
    {name:'Items', test:function(o) { return !o.room }},
    {name:'Takeables', test:function(o) { return o.takeable }},
    {name:'Scenery', test:function(o) { return o.scenery }},
    {name:'NPCs', test:function(o) { return o.npc && !o.player }},
  ],

  performanceLog:function() { },

  // This is split out for io.showInTab to use
  loadCssFiles:function(doc = document, path = '') {
    settings.loadCssFile(settings.cssFolder + 'default.css', doc, path)
    for (let file of settings.themes) {
      settings.loadCssFile(settings.cssFolder + file + '.css', doc, path)
    }
    settings.loadCssFile(settings.folder + settings.styleFile + '.css', doc, path)
  },


  loadCssFile:function(filename, doc = document, path = '') {
    const link = document.createElement( "link" )
    link.href = path + filename
    link.type = "text/css"
    link.rel = "stylesheet"
    link.media = "screen,print"
    doc.head.appendChild(link)
  },
  
  loadFavicon:function() {
    if (!settings.favicon) settings.favicon = settings.iconsFolder + 'favicon.png'
    const link = document.createElement('link')
    link.id = 'dynamic-favicon'
    link.rel = 'shortcut icon'
    link.href = settings.favicon
    const oldLink = document.getElementById('dynamic-favicon')
    if (oldLink) document.head.removeChild(oldLink)
    document.head.appendChild(link)
  },  

  scriptLoading:undefined,
  scriptToLoad:[],
  scriptLoadLogging:false,
  scriptDoc:undefined,
  
  loadScript:function(filename, doc = document) {
    settings.scriptDoc = doc
    settings.scriptToLoad.push(filename)
    if (!settings.scriptLoading) settings.scriptOnLoad()
  },
  
  scriptOnLoad:function() {
    if (settings.scriptLoading && settings.scriptLoadLogging) console.log('Loaded ' + settings.scriptLoading)
    if (settings.scriptToLoad.length === 0) {
      if (settings.scriptLoadLogging) console.log('All script files loaded')
      settings.performanceLog('Scripts loaded')

      // This is currently untested !!!!
      if (settings.soundFiles) {
        const main = document.querySelector('#main')
        for (let el of settings.soundFiles) {
          const audio = document.createElement('audio')
          audio.seAttribute('id', el)
          audio.seAttribute('src',settings.soundsFolder + el + settings.soundsFileExt)
          main.appendChild(audio)
        }
        settings.performanceLog('Audio loaded')
      }

      world.init()
      settings.performanceLog('World initiated')
      io.init()
      settings.performanceLog('io.init completed')
      return
    }
    settings.scriptLoading = settings.scriptToLoad.shift()
    if (settings.scriptLoadLogging) console.log('Loading ' + settings.scriptLoading)
    const myScript = settings.scriptDoc.createElement("script")
    myScript.setAttribute("src", settings.scriptLoading)
    myScript.onload = settings.scriptOnLoad
    myScript.onerror = function() {
      console.log("Failed to load file \"" + settings.scriptLoading + "\".")
      console.log("Check the file and folder actually exist.")
    }
    settings.scriptDoc.head.appendChild(myScript)
  },

  writeScript:function(folder) {
    settings.folder = folder ? folder + '/' : ''
    
    settings.performanceLog('Load CSS files')
    settings.loadCssFiles()
    settings.loadFavicon()
    
    settings.performanceLog('Queue files')
    if (settings.tests && settings.playMode === 'dev') {
      settings.loadScript('lib/test-lib.js')
      settings.loadScript(settings.folder + 'tests.js')
    }
    settings.loadScript((folder ? 'lang/' : '' ) + settings.lang + '.js')
    if (settings.customExits) {
      settings.loadScript(settings.folder + settings.customExits + '.js')
    }
    for (let file of settings.libraries) {
      settings.loadScript((folder ? 'lib/' : '' ) + file + '.js')
    }
    for (let lib of settings.customLibraries) {
      for (let file of lib.files) {
        settings.loadScript((folder ? lib.folder + '/' : '') + file + '.js')
      }
    }
    for (let file of settings.files) {
      settings.loadScript(settings.folder + file + '.js')
    }
    settings.performanceLog('Files queued')
  }
}



//settings.scriptLoadLogging = true
settings.performanceLogStart = function() {
  settings.performanceLogStartTime = performance.now()
}
settings.performanceLog = function(s) {
  if (!settings.performanceLogging) return
  const dur = Math.round(performance.now() - settings.performanceLogStartTime).toString().padStart(4)
  console.log(s.padEnd(32) + dur)
}






// These two functions use values in settings, so have to be set later
settings.inventoryPane = [
  {name:'Items Held', alt:'itemsHeld', test:settings.isHeldNotWorn, getLoc:function() { return player.name; } },
  {name:'Items Worn', alt:'itemsWorn', test:settings.isWorn, getLoc:function() { return player.name; } },
  {name:'Items Here', alt:'itemsHere', test:settings.isHere, getLoc:function() { return player.loc; } },
]

settings.setUpDialogClick = function() {
  settings.startingDialogEnabled = false
  io.enable()
  settings.startingDialogOnClick()
  world.begin()
  if (settings.textInput) { document.querySelector('#textbox').focus(); }
  document.querySelector("#dialog").style.display = 'none'
}

settings.setUpDialog = function() {
  const diag = document.querySelector("#dialog")
  document.querySelector("#dialog-title").innerHTML = settings.startingDialogTitle
  document.querySelector("#dialog-content").innerHTML = settings.startingDialogHtml
  if (settings.startingDialogButton) document.querySelector("#dialog-button").innerHTML = settings.startingDialogButton
  document.querySelector("#dialog-button").addEventListener('click', settings.setUpDialogClick)

  io.disable()
  diag.show()
  diag.style.display = 'block'
  diag.style.width = settings.startingDialogWidth + 'px'
  diag.style.height = 'auto'
  diag.style.top = '100px'
}



// Used by the editor
try { util; }
catch (e) {
  module.exports = { settings:settings }
}

