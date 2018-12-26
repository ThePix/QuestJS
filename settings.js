"use strict";

const TITLE = "A First Step...";

// UI options
const PANES = 'Left';  //Can be set to Left, Right or None.
const COMPASS = true;
const STATUS_PANE = "Status";  // Set to false to turn off
const STATUS_WIDTH_LEFT = 120; // How wide the columns are in the status pane
const STATUS_WIDTH_RIGHT = 40;
const TEXT_INPUT = true;
const CURSOR = ">";
const LANG_FILENAME = "lang-en.js";  // set to the language file of your choice
const DEBUG = true;

const ROOM_TEMPLATE = [
  "%",
  "You can see {objects}.",
  "You can go {exits}.",
]



var STATUS = [
  "hitpoints",
  function() { return "<td>Spell points:</td><td>3</td>"; },
  function() { return "<td>Health points:</td><td>" + player.hitpoints + "</td>"; },
  function() { return '<td rowspan="2">' + player.status + "</td>"; },
];


// Change the name values to alter how items are displayed
// You can add (or remove) inventories too
const INVENTORIES = [
  {name:'Items Held', alt:'itemsHeld', verbs:'heldVerbs', test:isHeld },
  {name:'Items Worn', alt:'itemsWorn', verbs:'wornVerbs', test:isWorn },
  {name:'Spells known', alt:'spells', verbs:'spellVerbs', 
    test:function(item) {
      return item.loc == "spellbook";
    }
  },
  {name:'Items Here', alt:'itemsHere', verbs:'hereVerbs', test:isHere },
];












// This function will be called at the start of the game, so can be used
// to introduce your game.
 function setup() {
  msg('This is a test of what we can do.');
  //parser.parse("ask mary about house");
  player.hitpoints = 20;
  player.status = "You are feeling fine";
  //parser.parse("talk to mary");
  
  //showStartDiag();
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
          p.job = professions.find(function(el) { return el.name == job; });
          p.isFemale = $("#female").is(':checked');
          p.fullname = $("#namefield").val();
          if (TEXT_INPUT) { $('#textbox').focus(); }
        }
      }
    ]
  });
});

*/





const para0Opts = [
  "a tiny village",
  "a provincial town",
  "the slums",
  "the merchant's quarter"
];

const para1Opts = [
  "loving the outdoors",
  "appreciating the finer things in life",
  "always hungry",
  "isolated from children of your own age"
];

const para2Opts = [
  "introspective",
  "precocious",
  "attractive",
  "curious",
];

const para3Opts = [
  "boy",
  "girl"
];

const para4Opts = [
  "getting into trouble",
  "with your nose in a book",
  "stealing things",
  "getting into fights",
  "arguing with the local priest"
];

const para5Opts = [
  "potion brewing",
  "crystal magic",
  "shadow magic",
  "nature magic"
];

const para6Opts = [
  "raven black",
  "dark brown",
  "brunette",
  "dark blond",
  "blond",
  "platinum blond",
  "ginger",
  "electric blue",
  "shocking pink",
];

const para7Opts = [
  "brown",
  "green",
  "hazel",
  "blue",
  "aquamarine"
];

const para8Opts = [
  "blue",
  "green",
  "orange",
  
];



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
  if (typeof paraPositions[paraNumber] != 'number') {
    var list = eval('para' + paraNumber + 'Opts');
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
  var p = getPlayer();
  p.alias = $('#name_input').val();
  p.isFemale = !wizardMale;
  p.background = $('#para4').html();
  p.magic = $('#para5').html();
  p.hairColour = $('#para6').html();
  p.eyeColour = $('#para7').html();
  p.spellColour = $('#para8').html();
  msg(p.alias);
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
  s = 'Name: <input type="text" id="name_input" value="Skybird"/><br/><br/>'
  s += '<div id="diag-inner">Born in <span id="para0" class="scrolling" onclick="scrollPara(this)"></span>, you grew up <span id="para1" class="scrolling" onclick="scrollPara(this)"></span>. '
  s += 'You were a <span id="para2" class="scrolling" onclick="scrollPara(this)"></span> <span id="para3" class="scrolling" onclick="scrollPara(this)"></span>, '
  s += 'always <span id="para4" class="scrolling" onclick="scrollPara(this)"></span>.'
  s += 'At the age of seven, you caught the eye of <span id="wizardname" class="scrolling" onclick="scrollWizard();">Master Shalazin</span>, '
  s += 'a <span id="wizardwitch">wizard</span> '
  s += 'who specialises in <span id="para5" class="scrolling" onclick="scrollPara(this)"></span>. '
  s += 'Perhaps <span id="wizardhe">he</span> recognised potential in you, or just a pair of hands willing to work for next to nothing; may be just liked your '
  s += '<span id="para6" class="scrolling" onclick="scrollPara(this)"></span> hair and <span id="para7" class="scrolling" onclick="scrollPara(this)"></span> eyes. '
  s += 'Either way, you slowly learnt the basics of magic, and have recently learnt how to turn yourself <span id="para8" class="scrolling" onclick="scrollPara(this)"></span>. '
  s += 'Perhaps more importantly, you have also learnt how to turn yourself back.</div>'

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
