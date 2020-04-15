"use strict";

// Comment necessary for require in QEdit




const settings = {
  
  // Functions for the side panes lists
  isHeldNotWorn:function(item) {
    return item.isAtLoc(game.player.name, world.SIDE_PANE) && world.ifNotDark(item) && !item.getWorn();
  },
  isHere:function(item) {
    return item.isAtLoc(game.player.loc, world.SIDE_PANE) && world.ifNotDark(item);
  },

  isWorn:function(item) {
    return item.isAtLoc(game.player.name, world.SIDE_PANE) && world.ifNotDark(item) && item.getWorn();
  },

  
  // Also title, author, thanks (option; array)
  
  // Files
  lang:"lang-en",      // Set to the language file of your choice
  customExits:false,      // Set to true to use custom exits, in exits.js
  files:["code", "data"], // Additional files to load
  libraries:["saveload", "text", "io", "command", "defaults", "templates", "world", "npc", "parser", "commands"],  // util and saveload already loaded
  customLibraries:[],

  // The side panes
  panes:'left',           //Can be set to Left, Right or None (setting PANES to None will more than double the speed of your game!)
  compass:true,           // Set to true to have a compass world.
  divider:false,          // Image used to divide the panes at the side; set to false if not used
  statusPane:"Status",    // Title of the panel; set to false to turn off
  statusWidthLeft:120,    // How wide the left column is in the status pane
  statusWidthRight:40,    // How wide the right column is in the status pane
  status:[
    function() { return "<td>Health points:</td><td>" + game.player.hitpoints + "</td>"; },
  ],


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
  ],


  // Conversations settings
  dropdownForConv:true,   // Dynamic (TALK TO) conversations will present as a drop-down if true, hyperlinks otherwise
  noTalkTo:"TALK TO is not a feature in this game.",
  noAskTell:"ASK/TELL ABOUT is not a feature in this game.",
  npcReactionsAlways:false,
  turnsQuestionsLast:5,
  givePlayerSayMsg:true,
  givePlayerAskTellMsg:true,


  // Other game play settings
  failCountsAsTurn:false,
  lookCountsAsTurn:false,

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
  debug:true,                      // set to false when releasing to disable debugging commands
  tests:false,
  maxUndo:10,
  moneyFormat:"$!",
  version:'1.0',
  author:'Anonymous',
  title:'My New Game Needs A Title',


  writeScript:function(folder) {
    settings.folder = folder
    if (settings.imagesFolder) {
      settings.imagesFolder = folder + '/' + settings.imagesFolder
    }
    else {
      settings.imagesFolder = folder
    }
    if (settings.videoFolder) {
      settings.videoFolder = folder + '/' + settings.videoFolder
    }
    else {
      settings.videoFolder = folder
    }
    if (settings.audioFolder) {
      settings.audioFolder = folder + '/' + settings.audioFolder
    }
    else {
      settings.audioFolder = folder
    }
    document.writeln('<link rel="stylesheet" href="lib/style.css"/>');
    document.writeln('<link rel="stylesheet" href="' + settings.folder + '/style.css"/>');
    if (settings.tests) {
      document.writeln('<script src="lib/test-lib.js"></scr' + "ipt>"); 
      document.writeln('<script src="' + settings.folder + '/tests.js"></scr' + "ipt>"); 
    }
    document.writeln('<script src="lang/' + settings.lang + '.js"></scr' + "ipt>");
    if (settings.customExits) {
      document.writeln('<script src="' + settings.folder + '/' + settings.exits + '.js"></scr' + "ipt>"); 
    }
    for (let file of settings.libraries) {
      document.writeln('<script src="lib/' + file + '.js"></scr' + "ipt>"); 
    }
    for (let lib of settings.customLibraries) {
      for (let file of lib.files) {
        document.writeln('<script src="' + lib.folder + '/' + file + '.js"></scr' + "ipt>"); 
      }
    }
    for (let file of settings.files) {
      document.writeln('<script src="' + settings.folder + '/' + file + '.js"></scr' + "ipt>"); 
    }    
  }
}


settings.inventories = [
  {name:'Items Held', alt:'itemsHeld', test:settings.isHeldNotWorn, getLoc:function() { return game.player.name; } },
  {name:'Items Worn', alt:'itemsWorn', test:settings.isWorn, getLoc:function() { return game.player.name; } },
  {name:'Items Here', alt:'itemsHere', test:settings.isHere, getLoc:function() { return game.player.loc; } },
]




// Used by the editor
try { util; }
catch (e) {
  module.exports = { settings:settings }
}
