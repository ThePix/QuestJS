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
want three rivers, one or two branching
with five cities along them, including a port and a capital
*/



const setRiver = function(x, y, side, n) {
  if (x < 0 || y < 0 || x >= nation.size || y >= nation.size) return
  if (side.startsWith('l')) nation.map[x][y].riverLeft = n
  if (side.startsWith('r')) nation.map[x][y].riverRight = n
}    
  
const riverRight = function(x, y, count) {
  x--
  for (let j = count; j > 0; j--) {
    for (let i = 0; i < random.int(4) + 2; i++) {
      y++
      setRiver(x, y, 'right', j)
    }
    y++
    x++
    for (let i = 0; i < random.int(4) + 1; i++) {
      x--
      setRiver(x, y, 'left', j)
    }
    x--
    y--
  }
}
const riverLeft = function(x, y, count) {
  y++
  for (let j = count; j > 0; j--) {
    for (let i = 0; i < random.int(4) + 2; i++) {
      x--
      setRiver(x, y, 'left', j)
    }
    x--
    y--
    for (let i = 0; i < random.int(4) + 1; i++) {
      y++
      setRiver(x, y, 'right', j)
    }
    y++
    x++
  }
}
nation.map[27][13].colour = 'blue'
riverRight(27, 13, random.int(3) + 2)
nation.map[17][3].colour = 'blue'
riverLeft(17, 3, random.int(3) + 2)

nation.map[22][8].colour = 'blue'
nation.map[21][9].riverRight = 5
nation.map[21][10].riverLeft = 5
nation.map[20][10].riverLeft = 5
nation.map[19][10].riverLeft = 5
nation.map[18][10].riverRight = 5
nation.map[18][11].colour = 'grey'
nation.map[21][10].colour = 'grey'
nation.map[18][11].riverLeft = 2
nation.map[18][11].riverRight = 2
riverRight(19, 11, 2)
riverLeft(18, 10, 2)









const takeATurn = function() {
  msg("Time passes...")
}










const word = {}
word.start = ['', '', 'b', 'c', 'ch', 'd', 'c', 'ch', 'd', 'f', 'fl', 'fr', 'g', 'l', 'm', 'n', 'p', 'pl', 'pr', 'r', 's', 'sl', 'st', 'sh', 't', 'tr', 'v', 'y']
word.middle = ['a', 'aa', 'ai', 'e', 'ea', 'ei', 'i', 'ie', 'o', 'oa', 'oe', 'ou', 'oo', 'u', 'ui', 'ue']
word.end = ['', '', 'b', 'mb', 'ck', 'ch', 'rk', 'd', 'nd', 'rd', 'gg', 'ng', 'gh', 'l', 'll', 'm', 'n', 'pp', 'mp', 'r', 'ss', 'sh', 't', 'rt', 'th']
word.syllable = function() { return random.fromArray(this.start) + random.fromArray(this.middle) + random.fromArray(this.end) }
word.word = function() {
  let s = ''
  for (let i = random.int(2,4); i > 0; i--) s += this.syllable()
  return s
}
  

for (let i = 0; i < 20; i++) console.log(word.word())







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
