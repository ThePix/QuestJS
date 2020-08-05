"use strict";


// A region cannot be changed!
// Must have at least one square
class Region {
  constructor(name, colour, x, ys) {
    const points = ys.split(' ')
    this.x = x
    this.froms = []
    this.tos = []
    this.cities = []
    this.name = name
    this.colour = colour
    this.count = 0
    this.minX = x
    this.maxX = x - 1
    for (let el of points) {
      const pair = el.split(',')
      const from = parseInt(pair[0])
      const to = parseInt(pair[1])
      if (from > to) console.log("WARNING: Numbers reversed in region (" + from + " is greater than " + to + ")")
      this.froms.push(from)
      this.tos.push(to)
      this.count += to - from + 1
      this.maxX++
      if (this.minY === undefined) {
        this.minY = from
        this.maxY = to
      }
      else {
        if (this.minY > from) this.minY = from
        if (this.maxY < to) this.maxY = to
      }
    }
  }    

  contains(x, y) {
    x -= this.x
    if (this.froms[x] === undefined) return false
    if (y < this.froms[x]) return false
    if (y > this.tos[x]) return false
    return true
  }
  
  overlaps(reg) {
    if (this.maxX < reg.minX) return false
    if (this.minX > reg.maxX) return false
    if (this.maxY < reg.minY) return false
    if (this.minY > reg.maxY) return false
    for (let x = this.minX; x <= this.maxX; x++) {
      for (let y = this.minY; y <= this.maxY; y++) {
        if (this.contains(x, y) && reg.contains(x, y)) return true
      }
    }
    return false
  }
  
  addCity(name, x, y, desc) {
    this.cities.push({name:name, x:x, y:y, pop:1, desc:desc})
  }
  
  cityAt(x, y) {
    for (let el of this.cities) {
      if (el.x === x && el.y === y) return true
    }
    return false 
  }
}

/*
const region = new Region(7, '4,5 3,7 2,8 2,8 3,8 3,7 5,6')
console.log(region.count)
console.log(region.minX + ' to ' + region.maxX)
console.log(region.minY + ' to ' + region.maxY)



console.log(region.contains(7,4))
console.log(region.contains(7,5))
console.log(region.contains(13,5))
console.log(region.contains(13,6))

console.log(region.contains(6,4))
console.log(region.contains(7,3))
console.log(region.contains(7,6))
console.log(region.contains(13,4))
console.log(region.contains(13,7))
console.log(region.contains(14,5))


const r1 = new Region(17, '4,5 3,7 2,8 2,8 3,8 3,7 5,6')
const r2 = new Region(7, '6,9 8,10 11,14 9,12 9,12 8,9 7,9')
const r3 = new Region(7, '6,9 7,10 11,14 9,12 9,12 8,9 7,9')

console.log(region.overlaps(r1))
console.log(region.overlaps(r2))
console.log(region.overlaps(r3))
*/




const nation = {
  size:31,
  map:[]
}
/*nation.cities = [
]
nation.factions = [
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

nation.resources = [
  {name:'basic food', },
  {name:'fine food', },
  {name:'base metals', },
  {name:'precious metals', },
]*/


nation.regions = [
  new Region('Bunnitonia', 'orange', 7, '4,5 3,7 2,8 2,8 3,8 3,7 5,6'),
]


nation.regions[0].addCity('Bunniton', 11, 5)

nation.resources = [
  {name:'carrots', desc:'Rabbits eat carrots.', spoilage:0.07},
  {name:'wheat', desc:'Used to make pasta', spoilage:0.11},
  {name:'pasta', desc:'Bears eat pasta, often with honey.', spoilage:0.03},
  {name:'honey', desc:'Bears like honey', spoilage:0.01},

]


nation.plants = [
  {name:'Carrot farm', script:function(nation) {
    nation.carrots += nation.carrot_farm_count
  }},
  {name:'Rabbits', script:function(nation) {
    nation.carrots -= nation.population_rabbits
  }},
  {name:'Mines', script:function(nation) {
    nation.base_metal += nation.mine_count
  }},
  {name:'Spoilage', script:function(nation) {
    for (let el of resources) {
      if (el.spoilage) nation[el.name] *= (1 - el.spoilage)
    }
  }},
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
const riverSet = function(x, y, w, values) {
  values = values.split(' ').map(el => parseInt(el))
  let left = true
  for (let k = 0; k < values.length; k++) {
    const width = w * (values.length - k) / values.length
    if (left) {
      for (let i = 0; i < values[k]; i++) {
        x--
        setRiver(x, y, 'left', width)
      }
      x--
      y--
    }
    else {
      for (let i = 0; i < values[k]; i++) {
        y++
        setRiver(x, y, 'right',  width)
      }
      y++
      x++
    }
    left = !left
  }
}
nation.map[17][3].colour = 'blue'
nation.map[16][3].colour = 'blue'
nation.map[16][2].colour = 'blue'
nation.map[15][3].colour = 'blue'
riverSet(15, 4, 5, '3 5 2 3 5 3 2')


nation.map[27][13].colour = 'blue'
nation.map[27][14].colour = 'blue'
nation.map[27][15].colour = 'blue'
riverSet(27, 15, 4, '0 5 3 2 4 1')

nation.map[22][8].colour = 'blue'
nation.map[21][9].riverRight = 5
nation.map[21][10].riverLeft = 5
nation.map[20][10].riverLeft = 5
nation.map[19][10].riverLeft = 5
nation.map[18][10].riverRight = 5
nation.map[18][11].riverLeft = 2
nation.map[18][11].riverRight = 2
riverSet(19, 11, 2, '0 3 2 4 2 1 3 2 4 2 3 1')
riverSet(18, 11, 2, '4 3 3 2 3 2 1')

// on confluence
nation.map[18][11].colour = 'grey'


// top
nation.map[11][21].colour = 'grey'


// left
//nation.map[11][5].colour = 'grey'

// right
nation.map[26][15].colour = 'grey'


const toggleregion = function() {
  board.settings.showRegions = !board.settings.showRegions
  board.update()
}






const takeATurn = function() {
  msg("Time passes...")
}






/*
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
*/






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
