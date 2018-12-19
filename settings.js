const TITLE = "A First Step...";

// UI options
const PANES = 'Left';  //Can be set to Left, Right or None.
const COMPASS = true;
const TEXT_INPUT = true;
const CURSOR = ">";
const LANG_FILENAME = "lang-en.js";  // set to the language file of your choice
const PRE_RELEASE = true;  // Some extra testing is done on start up when this is true





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
setup = function() {
  msg('This is a test of what we can do.');
  parser.parse("ask mary about house");
  //parser.parse("ask mary about basement");
  //parser.parse("ask coin about house");
}


const DISABLED = true;
var professions = [
  {name:"Agricultural labourer", bonus:"strength"},
  {name:"Software engineer", bonus:"intelligence"},
  {name:"Exotic dancer", bonus:"agility"},
  {name:"Salesman", bonus:"charisma"},
];

$(function() {
  if (DISABLED) {
    var p = getPlayer();
    p.job = professions[0];
    p.isFemale = true;
    p.fullname = "Mary Tester";
    return; 
  }
  var diag = $("#dialog");
  diag.prop("title", "Who are you?");
  var s;
  s = '<p>Name: <input id="namefield" type="text" value="Gal Axy" /></p>';
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