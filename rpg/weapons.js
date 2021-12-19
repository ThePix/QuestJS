
const weapons = [
  {name:"Dagger", damage:"d6", atts:"msFT", desc:"Can be concealed"},
  {name:"Short sword", damage:"2d6", atts:"msF", desc:"Use if you want to go first; bonus to initiative"},
  {name:"Broad sword", damage:"2d8", atts:"ms", desc:"Also sword, etc. Good general purpose weapon"},
  {name:"Sabre", damage:"3d6", atts:"ms", desc:"Also scimitar, etc. Good for unarmoured foes"},
  {name:"Two-handed sword", damage:"3d8", atts:"ms2X", desc:"Requires skill, but does good damage, especially to unarmed foes"},
  {name:"Wood axe", damage:"d8", atts:"mcST", desc:"Cheap and readily available!"},
  {name:"Battle axe", damage:"d10", atts:"mcS", desc:"Good against armoured foes, but slow"},
  {name:"Great axe", damage:"2d10", atts:"mc2SX", desc:"Requires skill, but does good damage, especially to unarmed foes"},
  {name:"Club", damage:"2d4", atts:"mb", desc:"Includes improvised weapons"},
  {name:"Mace", damage:"d10", atts:"mb", desc:"Good against armed foes"},
  {name:"Morning star", damage:"2d8", atts:"mb", desc:"All round weapon"},
  {name:"Flail", damage:"d12", atts:"MbXY", desc:"Requires skill, especially good against armoured foes with shields"},
  {name:"Quarterstaff", damage:"2d4", atts:"MbD", desc:"Good for defense"},
  {name:"Warhammer", damage:"2d10", atts:"mbS", desc:"Slow but good damage"},
  {name:"Two-handed hammer", damage:"2d12", atts:"MbSX", desc:"Lots of damage, but slow and requires skill"},
  {name:"Spear", damage:"2d8", atts:"MpR2XST", desc:"Extra reach, can be used as a thrown weapon too (also javelin or trident)"},
  {name:"Polearm", damage:"3d8", atts:"MpR2XS", desc:"Extra reach"},
  {name:"Halberd", damage:"3d6", atts:"MpR2XSH", desc:"Extra reach, and can be used to hook a foe"},
  {name:"Whip", damage:"4d4", atts:"msR2XS", desc:"Requires skill, but good against unarmed and extra reach"},
  {name:"Bull whip", damage:"4d4", atts:"msR3XS]", desc:"As whip, but even more reach"},
  
  
  {name:"Thrown rock", damage:"d4", atts:"tb", desc:"Or anything of a decent size and weight to throw"},
  {name:"Sling", damage:"2d4", atts:"tbM", desc:"Cheap ammo"},
  {name:"Short bow", damage:"2d6", atts:"bpFX", desc:"Fast reload"},
  {name:"Long bow", damage:"3d6", atts:"bpFMX", desc:"Takes a minor action to reload, but decent damage against unarmoured"},
  {name:"Light crossbow", damage:"d12", atts:"bpMX", desc:"Takes a minor action to reload, but decent against armoured foes"},
  {name:"Heavy crossbow", damage:"d20", atts:"bpL1X", desc:"Takes a full standard action to reload, but good against armoured foes"},
  {name:"Flintlock", damage:"2d12", atts:"fpL2", desc:"Very noisy. Takes two full standard actions to reload, and expensive to use."},
  {name:"Musket", damage:"2d20", atts:"FpL2", desc:"Very noisy. Takes two full standard actions to reload, and expensive to use, but look at all the damage!"},
]


for (const data of weapons) {
  const name = data.name.toLowerCase().replace(/ |\-/g, '_') + '_prototype'
  const weapon = createItem(name, WEAPON(data.damage))
  
}