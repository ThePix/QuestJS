"use strict";

const TITLE = "The Voyages of The Joseph Banks";
const AUTHOR = "The Pixie"
const VERSION = "1.1";
const THANKS = ["Kyle", "Lara"];

// UI options
const PANES = 'Left';  //Can be set to Left, Right or None.
// Setting PANES to None will more than double the speed of your game!
const COMPASS = true;
const DIVIDER = "div4.png";

const STATUS_PANE = "Status";  // Set to false to turn off
const STATUS_WIDTH_LEFT = 120; // How wide the columns are in the status pane
const STATUS_WIDTH_RIGHT = 40;

const USE_DROPDOWN_FOR_CONV = true;

const FAILS_COUNT_AS_TURNS = false;
const LOOK_COUNTS_AS_TURN = false;

const TEXT_INPUT = true;
const CURSOR = ">";
const CMD_ECHO = true;               // echo commands to the screen
const CONVERT_NUMBERS_IN_PARSER = true;

const LANG_FILENAME = "lang-en.js";  // set to the language file of your choice
const DEBUG = true;                  // set to false when releasing
const CUSTOM_EXITS = true;
const FILES = ["code", "data", "npcs"];
const MAX_UNDO = 10;
const ROOM_HEADINGS = true;
const NO_TALK_TO = "You can talk to an NPC using either {color:red:ASK [name] ABOUT [topic]} or {color:red:TELL [name] ABOUT [topic]}.";
const NO_ASK_TELL = false;
const MONEY_FORMAT = "$!";

const PARSER_DEBUG = false;      // If true, will report the data the parser outputs
const SPLIT_LINES_ON = "|";   // Strings sent to msg will be broken into separate lines

const SAVE_DISABLED = false;

const SECONDS_PER_TURN = 60;
const DATE_TIME_LOCALE = 'en-GB';
const DATE_TIME_START = new Date('April 14, 2387 09:43:00');
const DATE_TIME_OPTIONS = {};
DATE_TIME_OPTIONS.year = "numeric";
DATE_TIME_OPTIONS.month = "short";
DATE_TIME_OPTIONS.day = "2-digit";
DATE_TIME_OPTIONS.hour = "2-digit";
DATE_TIME_OPTIONS.minute = "2-digit";

const ROOM_TEMPLATE = [
  "%",
  "{objectsHere:You can see {objects} here.}",
]




const STATUS = [
  function() { return "<td colspan=\"2\" align=\"center\">" + getDateTime() + "</td>"; },
  function() { return "<td width=\"100px\"><b><i>Bonus:</i></b></td><td width=\"30px\" align=\"right\"><b>$" + game.player.bonus + "k</b></td>"; },
  function() { return "<td colspan=\"2\" align=\"center\"> </td>"; },
  function() { return "<td><i>You:</i></td><td align=\"right\">" + game.player.status + "%</td>"; },
  function() { return "<td><i>Ship:</i></td><td align=\"right\">" + w.Xsansi.status + "%</td>"; },
  function() { return "<td><i>Ha-yoon:</i></td><td align=\"right\">" + displayStatus(w.Ha_yoon) + "</td>"; },
  function() { return "<td><i>Kyle:</i></td><td align=\"right\">" + displayStatus(w.Kyle) + "</td>"; },
  function() { return "<td><i>Ostap:</i></td><td align=\"right\">" + displayStatus(w.Ostap) + "</td>"; },
  function() { return "<td><i>Aada:</i></td><td align=\"right\">" + displayStatus(w.Aada) + "</td>"; },
];



function displayStatus(obj) {
  if (typeof obj.status === "string") return obj.status;
  return obj.status + "%";
}

// Change the name values to alter how items are displayed
// You can add (or remove) inventories too
const INVENTORIES = [
//  {name:'Items Held', alt:'itemsHeld', test:util.isHeldNotWorn, getLoc:function() { return game.player.name; } },
//  {name:'Items Here', alt:'itemsHere', test:util.isHere, getLoc:function() { return game.player.loc; } },
];




const ooc_intro = "<p>You are on a mission to survey planets around five stars, the captain of a crew of five (including yourself). There is also a computer system, Xsansi (you can also use \"AI\" or \"computer\"), that you can talk to anywhere on the ship. </p><p>Your objective is to maximise your bonus. Collecting data will give a bonus, but geo-data about planets suitable for mining and bio-data about planets suitable for colonisation will give higher bonuses. Evidence of alien intelligence will be especially rewarding!</p><p>You have just arrived at your first destination after years in a \"stasis\" pod in suspended animation. ASK AI ABOUT MISSION or CREW might be a good place to start, once you have created your character. Later you want to try OSTAP, LAUNCH PROBE or ASK AADA ABOUT PLANET.";



// This function will be called at the start of the game, so can be used
// to introduce your game.
function setup() {

  //parser.parse("spoken");
  //  parser.parse("l");
   
  //showStartDiag();
 
  //console.log(getDateTime());
  
  //for(let key in w) {
  //  debugmsg(key);
  //}
  arrival();  
  
}


















const DISABLED = true;
const professions = [
  {name:"Engineer", bonus:"mech"},
  {name:"Scientist", bonus:"science"},
  {name:"Medical officer", bonus:"medicine"},
  {name:"Soldier", bonus:"combat"},
  {name:"Computer specialist", bonus:"computers"},
  {name:"Dancer", bonus:"agility"},
  {name:"Advertising exec", bonus:"deceit"},
  {name:"Urban poet", bonus:"deceit"},
];

const backgrounds = [
  {name:"Bored dilettante", bonus:"mech"},
  {name:"Wannabe explorer", bonus:"science"},
  {name:"Fame-seeker", bonus:"medicine"},
  {name:"Debtor", bonus:"combat"},
  {name:"Criminal escaping justice", bonus:"computers"},
];


$(function() {
  if (DISABLED) {
    w.me.job = professions[0].name;
    w.me.jobBonus = professions[0].bonus;
    w.me.isFemale = true;
    w.me.fullname = "Shaala";
    return; 
  }
  const diag = $("#dialog");
  diag.prop("title", "Who are you?");
  let s = ooc_intro;
  s += '<p>Name: <input id="namefield" type="text" value="Ariel" /></p>';
  s += '<p>Male: <input type="radio" id="male" name="sex" value="male">&nbsp;&nbsp;&nbsp;&nbsp;';
  s += 'Female<input type="radio" id="female" name="sex" value="female" checked></p>';
  s += '<p>Profession: <select id="job">'
  for (let i = 0; i < professions.length; i++) {
    s += '<option value="' + professions[i].name + '">' + professions[i].name + '</option>';
  }
  s += '</select></p>';
  //s += '<p>Background: <select id="background">'
  //for (let i = 0; i < backgrounds.length; i++) {
  //  s += '<option value="' + backgrounds[i].name + '">' + backgrounds[i].name + '</option>';
  //}
  s += '</select></p>';
  
  diag.html(s);
  diag.dialog({
    modal:true,
    dialogClass: "no-close",
    width: 560,
    height: 550,
    buttons: [
      {
        text: "OK",
        click: function() {
          $(this).dialog("close");
          let p = game.player;
          const jobName = $("#job").val();
          const job = professions.find(function(el) { return el.name === jobName; });
          w.me.job = job.name;
          w.me.jobBonus = job.bonus;
          //w.me.background = backgrounds.find(function(el) { return el.name === background; });
          w.me.isFemale = $("#female").is(':checked');
          w.me.fullname = $("#namefield").val();
          if (TEXT_INPUT) { $('#textbox').focus(); }
        }
      }
    ]
  });
  setTimeout(function() { 
    $('#namefield').focus();
  }, 10);
});


