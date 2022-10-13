
rpg.weapons = [
  {name:"Dagger", damage:"d6", atts:"msFT", desc:"Can be concealed"},
  {name:"Short sword", damage:"2d6", atts:"msF", desc:"Use if you want to go first; bonus to initiative"},
  {name:"Broad sword", damage:"2d8", atts:"ms", desc:"Also sword, etc. Good general purpose weapon"},
  {name:"Falchion", damage:"4d4", atts:"ms", desc:"Good for unarmoured foes"},
  {name:"Sabre", damage:"3d6", atts:"ms", desc:"Also scimitar, etc. Good for unarmoured foes"},
  {name:"Rapier", damage:"d10", atts:"mp", desc:"A light weapon, good for slipping past armour"},
  {name:"Claymore", damage:"3d8", atts:"MsX", desc:"Requires skill, but does good damage, especially to unarmed foes"},

  {name:"Wood axe", damage:"d8", atts:"maST", desc:"Cheap and readily available!"},
  {name:"Battle axe", damage:"d10", atts:"maS", desc:"Good against armoured foes, but slow"},
  {name:"Great axe", damage:"2d10", atts:"MaSX", desc:"Requires skill, but does good damage, especially to unarmed foes"},

  {name:"Club", damage:"2d4", atts:"mb", desc:"Includes improvised weapons"},
  {name:"Mace", damage:"d10", atts:"mb", desc:"Good against armed foes"},
  {name:"Flanged mace", damage:"d12", atts:"mb", desc:"Good against armed foes"},
  {name:"Morning star", damage:"2d8", atts:"mb", desc:"All round weapon"},
  {name:"Flail", damage:"d12", atts:"MbXY", desc:"Requires skill, especially good against armoured foes with shields"},
  {name:"Quarterstaff", damage:"2d4", atts:"MbD", desc:"Good for defense"},
  {name:"Warhammer", damage:"2d10", atts:"mbS", desc:"Slow but good damage"},
  {name:"Two-handed hammer", damage:"2d12", atts:"MbSX", desc:"Lots of damage, but slow and requires skill"},
  
  {name:"Spear", damage:"2d8", atts:"PpR2XST", desc:"Extra reach, can be used as a thrown weapon too (also javelin or trident)"},
  {name:"Polearm", damage:"3d8", atts:"PpR2XS", desc:"Extra reach"},
  {name:"Halberd", damage:"3d6", atts:"PpR2XSH", desc:"Extra reach, and can be used to hook a foe"},
  
  {name:"Whip", damage:"4d4", atts:"msR2XS", desc:"Requires skill, but good against unarmed and extra reach"},
  {name:"Bull whip", damage:"4d4", atts:"msR3XS]", desc:"As whip, but even more reach"},  
  
  {name:"Sling", damage:"2d4", atts:"tbL0", desc:"Cheap ammo", ammo:'rock'},
  {name:"Short bow", damage:"2d6", atts:"bpL0X", desc:"Fast reload", ammo:'arrow'},
  {name:"Long bow", damage:"3d6", atts:"bpFL0X", desc:"Takes a minor action to reload, but decent damage against unarmoured", ammo:'arrow'},
  {name:"Light crossbow", damage:"d12", atts:"bpL0X", desc:"Takes a minor action to reload, but decent against armoured foes", ammo:'crossbow bolt'},
  {name:"Heavy crossbow", damage:"d20", atts:"bpL1X", desc:"Takes a full standard action to reload, but good against armoured foes", ammo:'crossbow bolt'},
  {name:"Flintlock", damage:"2d12", atts:"fpL2", desc:"Very noisy. Takes two full standard actions to reload, and expensive to use.", ammo:'lead ball'},
  {name:"Musket", damage:"2d20", atts:"FpL2", desc:"Very noisy. Takes two full standard actions to reload, and expensive to use, but look at all the damage!", ammo:'lead ball'},
]


rpg.weaponTypeMapping = {
  m:'1H melee',
  M:'2H melee',
  t:'Thrown',
  b:'Bow',
  f:'1H firearm',
  F:'2H firearm',
  P:'Polearm',
}

rpg.weaponDamageMapping = {
  s:'Slash',
  b:'Bash',
  p:'Pierce',
  //c:'Crush',
  a:'Axe',    // using weight to create bloody wound
}

rpg.weaponFlags = {
  R2:'longReach',
  R3:'veryLongReach',
  L0:'quickReload',
  L1:'longReload',
  L2:'veryLongReload',
  X:'requiresSkill',
  H:'hook',
  T:'thrownable',
  S:'slow',
  F:'fast',
  D:'defensive',
}

rpg.createWeapon = function(data) {
  const name = data.name.toLowerCase().replace(/ |\-/g, '_') + '_prototype'
  const weapon = createItem(name, WEAPON(data.damage))
  weapon.alias = data.name.toLowerCase()
  weapon.abstract = true
  weapon.weaponType = rpg.weaponTypeMapping[data.atts[0]]
  if (!weapon.weaponType) log("Weapon type not recognised for " + name + ": " + data.atts)
  weapon.damageType = rpg.weaponDamageMapping[data.atts[1]]
  if (!weapon.damageType) log("Weapon damage type not recognised for " + name + ": " + data.atts)
  for (const key in rpg.weaponFlags) {
    if (data.atts.substring(2).includes(key)) weapon[rpg.weaponFlags[key]] = true
  }
  if (weapon.ammo) {
    weapon.ammo = data.ammo
    weapon.activeEffects.push(typeof ammo === 'number' ? "Ammo tracker" : "Ammo consumer")
  }
  
  if (weapon.damageType === 'Axe') {
    weapon.weaponClass = 'Axe'
  }
  else if (data.atts[0].toLowerCase() === 'f') {
    weapon.weaponClass = 'Firearm'
  }
  else if (data.atts[0].toLowerCase() === 'm') {
    if (weapon.damageType === 'Bash') {
      weapon.weaponClass = 'Crushing'
    }
    else {
      weapon.weaponClass = 'Blade'
    }
  }
  else {
    weapon.weaponClass = weapon.weaponType
  }

  //log(weapon)
  return weapon
}

for (const data of rpg.weapons) {
  rpg.createWeapon(data)
}
log("Added " + rpg.weapons.length + " basic weapons")


rpg.shields = [
  {name:"target", size:1, desc:"A small target shield."},
  {name:"small", size:2, desc:"A small shield."},
  {name:"full", size:3, desc:"A full shield."},
  {name:"wall", size:4, desc:"A wall shield."},
]


for (const data of rpg.shields) {
  createItem(data.name + "_shield_prototype", SHIELD(data.size), {
    examine:data.desc,
    alias:data.name + ' shield',
  })
}
log("Added " + rpg.shields.length + " basic shields")



createItem("fire_sword_prototype", WEAPON("6d6"), {
  image:"sword",
  alias:'the Flaming Sword of Fire',
  element:'fire',
  spellAlias:'fire sword',
  examine:"A sword made of raw, elemental fire!",
  activeEffects:["Flaming weapon"],
})

createItem("ice_spear_prototype", WEAPON("6d6"), {
  image:"spear",
  alias:'the Chilling Spear of Frost',
  element:'frist',
  spellAlias:'ice spear',
  examine:"A spear made of raw, elemental frost!",
  activeEffects:["Chilling weapon"],
})

createItem("earth_club_prototype", WEAPON("6d12"), {
  image:"club",
  alias:'the Bludgeoning Club of Earthmight',
  element:'earthmight',
  spellAlias:'earth club',
  examine:"A club, at first glance made of granite, but then maybe quartz or rouygh marble; each tme you look, it is different, but you never see it change.",
});
