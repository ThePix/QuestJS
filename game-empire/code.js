"use strict";

const nation = {
  size:31,
  map:[]
}
const cities = [
]
const factions = [
  {name:'alchemists', desc:'Workers of magical powers, this also includes wizards, demonologists, etc.'},
  {name:'artisans', desc:'Craftsmen, usually with a workshop in a city.'},
  {name:'artists', desc:'A small number of artists, musicians, composers and writers who create culture and prestige in the nation.'},
  {name:'land owners', desc:'The landed gentry; very wealthy and so influential.'},
  {name:'military', desc:'Soldiers and sailors of all ranks.'},
  {name:'miners', desc:'As the name says.'},
  {name:'nautical workers', desc:'Dock workers, fishermen and other sailors.'},
  {name:'priests', desc:'As they claim to talk to the gods, they often have a lot of influence.'},
  {name:'rural workers', desc:'People who work the land, mostly on farms owned by someone else.'},
  {name:'service workers', desc:'Couriers, scribes, waiters/waitresses, barber, etc.'},
]

const resources = [
  {name:'basic food', },
  {name:'fine food', },
  {name:'base metals', },
  {name:'precious metals', },
]

for (let x = 0; x < nation.size; x++) {
  const row = []
  for (let y = 0; y < nation.size; y++) {
    row.push({colour:x - y > 14 ? 'blue' : 'green'})
  }
  nation.map.push(row)
}
  
/*
high x and low y is sea


*/

const takeATurn = function() {
  msg("Time passes...")
}















settings.startingDialogDisabled = true;

settings.professions = [
  "Alchemist",
  "Baronet",
  "Farm hand",
  "Glass blower",
  "Merchant",
  "Priest",
  "Prostitute",
];

$(function() {
  if (settings.startingDialogDisabled) {
    const p = game.player;
    p.job = "Merchant";
    p.isFemale = true;
    p.alias = "Shaala";
    return; 
  }
  const diag = $("#dialog");
  diag.prop("title", "Who are you?");
  let s;
  s = '<p>Name: <input id="namefield" type="text" value="Zoxx" /></p>';
  s += '<p>King: <input type="radio" id="male" name="sex" value="male">&nbsp;&nbsp;&nbsp;&nbsp;';
  s += 'Queen<input type="radio" id="female" name="sex" value="female" checked></p>';
  s += '<p>Background:<select id="job">'
  for (let profession of settings.professions) {
    s += '<option value="' + profession + '">' + profession + '</option>';
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
          const p = game.player;
          p.job = $("#job").val();
          p.isFemale = $("#female").is(':checked');
          p.alias = $("#namefield").val();
          if (settings.textInput) { $('#textbox').focus(); }
          console.log(p)
        }
      }
    ]
  });
});




commands.push(new Cmd('Sleep', {
  regex:/^sleep$/,
  script:function() {
    if (game.player.loc === 'royal_bedroom') {
      takeATurn()
      return world.SUCCESS
    }
    else {
      metamsg("You can only sleep in the bedroom");
      return world.FAILURE
    }
  },
}));
