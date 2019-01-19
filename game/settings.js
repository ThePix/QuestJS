"use strict";

const TITLE = "A First Step...";
const AUTHOR = "The Pixie"
const VERSION = "1.0";
const THANKS = ["Kyle", "Lara"];

// UI options
const PANES = 'Left';  //Can be set to Left, Right or None.
// Setting PANES to None will more than double the speed of your game!
const COMPASS = true;
const DIVIDER = "div.png";

const STATUS_PANE = "Status";  // Set to false to turn off
const STATUS_WIDTH_LEFT = 120; // How wide the columns are in the status pane
const STATUS_WIDTH_RIGHT = 40;

const TEXT_INPUT = true;
const CURSOR = ">";
const CMD_ECHO = true;               // echo commands to the screen

const LANG_FILENAME = "lang-en.js";  // set to the language file of your choice
const DEBUG = true;                  // set to false when releasing

const PARSER_DEBUG = false;      // If true, will report the data the parser outputs
const SPLIT_LINES_ON = "<br>";   // Strings sent to msg will be broken into separate lines

const ROOM_TEMPLATE = [
  "%",
  "You can see {objects} here.",
  "You can go {exits}.",
];



var STATUS = [
  "hitpoints",
  function() { return "<td>Spell points:</td><td>3</td>"; },
  function() { return "<td>Health points:</td><td>" + game.player.hitpoints + "</td>"; },
  function() { return '<td colspan="2">' + game.player.status + "</td>"; },
];


// Change the name values to alter how items are displayed
// You can add (or remove) inventories too
const INVENTORIES = [
  {name:'Items Held', alt:'itemsHeld', test:isHeldNotWorn, getLoc:function() { return game.player.name; } },
  {name:'Items Worn', alt:'itemsWorn', test:isWorn, getLoc:function() { return game.player.name; } },
  {name:'Items Here', alt:'itemsHere', test:isHere, getLoc:function() { return game.player.loc; } },
];






function intro() {
  msg("This is a quick example of what can be done in Quest 6.");
  msg("Your objective is to turn on the light in the basement, but there are, of course, numerous hoops to jump through.");
  msg("If you are successful, see if you can do it again, but getting Kyle to do everything. You should find that you can tell an PC to do pretty much anything (except look at things for you and talk to people for you).");
}




// This function will be called at the start of the game, so can be used
// to introduce your game.
function setup() {
  intro();
  game.player.hitpoints = 20;
  game.player.status = "You are feeling fine";
  world.scopeSnapshot();

  //parser.parse("spoken");
//  parser.parse("l");
   
  //showStartDiag();
  
  
  
  

  /*
  parser.parse("get small key");
  parser.parse("open cabinet");
  parser.parse("get ring");
  parser.parse("w");
  parser.parse("give ring to lara");
  parser.parse("e");
  parser.parse("get torch");
  parser.parse("e");
  parser.parse("open garage");
  parser.parse("n");/*
  parser.parse("open compartment");
  parser.parse("put torch in compartment");
  parser.parse("press button");
  parser.parse("get torch");
  parser.parse("s");
  parser.parse("open trapdoor");
  parser.parse("d");
  parser.parse("turn on torch");
  parser.parse("move crates");
  parser.parse("turn on light");*/
  
/*  parser.parse("kyle,get small key");
  parser.parse("kyle,open cabinet");
  parser.parse("kyle,get ring");
  parser.parse("kyle,w");
  parser.parse("w");
  parser.parse("kyle,give ring to lara");
  parser.parse("kyle,e");
  parser.parse("e");
  parser.parse("kyle,get torch");
  parser.parse("kyle,e");
  parser.parse("e");
  parser.parse("kyle,open garage");
  parser.parse("kyle,n");
  parser.parse("n");
  parser.parse("kyle,open compartment");
  parser.parse("kyle,put torch in compartment");
  parser.parse("kyle,press button");
  parser.parse("kyle,get torch");
  parser.parse("kyle,s");
  parser.parse("s");
  parser.parse("kyle,open trapdoor");/*
  parser.parse("kyle,d");
  parser.parse("d");
  parser.parse("kyle,turn on torch");
  parser.parse("kyle,move crates");
  parser.parse("kyle,turn on light");*/
}

















/*
const DISABLED = true;
var professions = [
  {name:"Farm hand", bonus:"strength"},
  {name:"Scribe", bonus:"intelligence"},
  {name:"Exotic dancer", bonus:"agility"},
  {name:"Merchant", bonus:"charisma"},
];

$(function() {
  if (DISABLED) {
    var p = getPlayer();
    p.job = professions[0];
    p.isFemale = true;
    p.fullname = "Shaala";
    return; 
  }
  var diag = $("#dialog");
  diag.prop("title", "Who are you?");
  var s;
  s = '<p>Name: <input id="namefield" type="text" value="Zoxx" /></p>';
  s += '<p>Male: <input type="radio" id="male" name="sex" value="male">&nbsp;&nbsp;&nbsp;&nbsp;';
  s += 'Female<input type="radio" id="female" name="sex" value="female" checked></p>';
  s += '<p>Job:<select id="job">'
  for (var i = 0; i < professions.length; i++) {
    s += '<option value="' + professions[i].name + '">' + professions[i].name + '</option>';
  }
  s += '</select></p>';
  
  diag.html(s);
  diag.dialog({
    modal:true,
    dialogClass: "no-close",
    width: 400,
    height: 300,
    buttons: [
      {
        text: "OK",
        click: function() {
          $(this).dialog("close");
          var p = getPlayer();
          job = $("#job").val();
          p.job = professions.find(function(el) { return el.name === job; });
          p.isFemale = $("#female").is(':checked');
          p.fullname = $("#namefield").val();
          if (TEXT_INPUT) { $('#textbox').focus(); }
        }
      }
    ]
  });
});

*/





const dialogeOptions = {
  para0Opts:[
    "a tiny village",
    "a provincial town",
    "the slums",
    "the merchant's quarter"
  ],

  para1Opts:[
    "loving the outdoors",
    "appreciating the finer things in life",
    "always hungry",
    "isolated from children of your own age"
  ],

  para2Opts:[
    "introspective",
    "precocious",
    "attractive",
    "curious",
  ],

  para3Opts:[
    "boy",
    "girl"
  ],

  para4Opts:[
    "getting into trouble",
    "with your nose in a book",
    "stealing things",
    "getting into fights",
    "arguing with the local priest"
  ],

  para5Opts:[
    "potion brewing",
    "crystal magic",
    "shadow magic",
    "nature magic"
  ],

  para6Opts:[
    "raven black",
    "dark brown",
    "brunette",
    "dark blond",
    "blond",
    "platinum blond",
    "ginger",
    "electric blue",
    "shocking pink",
  ],

para7Opts:[
  "brown",
  "green",
  "hazel",
  "blue",
  "aquamarine"
],

para8Opts:[
  "blue",
  "green",
  "orange",
],
};



var paraOpts = [];

var paraPositions = [];

function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

var wizardMale = true;

function scrollWizard() {
  wizardMale = !wizardMale;
  $('#wizardname').html(wizardMale ? 'Master Shalazin' :  'Mistress Shalazin');
  $('#wizardwitch').html(wizardMale ? 'wizard' :  'witch');
  $('#wizardhe').html(wizardMale ? 'he' :  'she');
}

function scrollPara(element) {
  var paraNumber = parseInt(element.id.replace('para', ''));
  if (isNaN(paraNumber)) { return; }
  var para = $('#para' + paraNumber);
  if (typeof paraPositions[paraNumber] !== 'number') {
    var list = dialogeOptions['para' + paraNumber + 'Opts'];
    paraOpts[paraNumber] = list;
    paraPositions[paraNumber] = getRandomInt(0, list.length - 1);
  }
  paraPositions[paraNumber]++;
  if (paraPositions[paraNumber] >= paraOpts[paraNumber].length) {
    paraPositions[paraNumber] = 0;
  }
  para.html(paraOpts[paraNumber][paraPositions[paraNumber]]);
}    

function setValues() {
  game.player.alias = $('#name_input').val();
  game.player.isFemale = !wizardMale;
  game.player.background = $('#para4').html();
  game.player.magic = $('#para5').html();
  game.player.hairColour = $('#para6').html();
  game.player.eyeColour = $('#para7').html();
  game.player.spellColour = $('#para8').html();
  msg(game.player.alias);
  msg($("#diag-inner").text());
}

/*
$(document).ready(function () {
      $('.scrolling').each(function() {
        scrollPara(this);
      });
      that = $("#dialog_window_1");
      $('#dialog_window_1').dialog({
         height: 400,
         width: 640,
         buttons: {
            "Done": function() { setValues();}
        }
      });
      $("button[title='Close']")[0].style.display = 'none';
});
*/
function scrollWizard() {
  wizardMale = !wizardMale;
  $('#wizardname').html(wizardMale ? 'Master Shalazin' :  'Mistress Shalazin');
  $('#wizardwitch').html(wizardMale ? 'wizard' :  'witch');
  $('#wizardhe').html(wizardMale ? 'he' :  'she');
}

function showStartDiag() {

  var diag = $("#dialog");
  diag.prop("title", "Who are you?");
  var s;
  s = 'Name: <input type="text" id="name_input" value="Skybird"/><br/><br/>';
  s += '<div id="diag-inner">Born in <span id="para0" class="scrolling" onclick="scrollPara(this)"></span>, you grew up <span id="para1" class="scrolling" onclick="scrollPara(this)"></span>. ';
  s += 'You were a <span id="para2" class="scrolling" onclick="scrollPara(this)"></span> <span id="para3" class="scrolling" onclick="scrollPara(this)"></span>, ';
  s += 'always <span id="para4" class="scrolling" onclick="scrollPara(this)"></span>.';
  s += 'At the age of seven, you caught the eye of <span id="wizardname" class="scrolling" onclick="scrollWizard();">Master Shalazin</span>, ';
  s += 'a <span id="wizardwitch">wizard</span> ';
  s += 'who specialises in <span id="para5" class="scrolling" onclick="scrollPara(this)"></span>. ';
  s += 'Perhaps <span id="wizardhe">he</span> recognised potential in you, or just a pair of hands willing to work for next to nothing; may be just liked your ';
  s += '<span id="para6" class="scrolling" onclick="scrollPara(this)"></span> hair and <span id="para7" class="scrolling" onclick="scrollPara(this)"></span> eyes. ';
  s += 'Either way, you slowly learnt the basics of magic, and have recently learnt how to turn yourself <span id="para8" class="scrolling" onclick="scrollPara(this)"></span>. ';
  s += 'Perhaps more importantly, you have also learnt how to turn yourself back.</div>';

  diag.html(s);
  $('.scrolling').each(function() {
    scrollPara(this);
  });
  diag.dialog({
    modal:true,
    dialogClass: "no-close",
    width: 600,
    height: 600,
    buttons: [
      {
        text: "OK",
        click: function() {
          $(this).dialog("close");
          setValues(this);
          if (TEXT_INPUT) { $('#textbox').focus(); }
        }
      }
    ]
  });

}
