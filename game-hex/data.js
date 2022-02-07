"use strict"

createItem("me", PLAYER(), {
  loc:"hex_0_0",
  regex:/^(me|myself|player)$/,
  examine: "Just a regular guy.",
  hitpoints:100,
})







createBiome(5, -4, 'G', {
  desc:"The market square is the centre of the city, and is teeming with people.  In the southeast corner you see the magnificent entrance of Estalia Manor.|In the centre of the square, a golden statue of Stratos and Geo embracing while looking north to the Great Temple stands on a stone plinth; their presence blesses all who pass through.",
  getHexSymbol:function() { return 'assets/icons/houseicon.png' },
  getHexSymbolOffset:function() { return [-8, -8] },
  in:new Exit('tower'),
})

createRoom("tower", {
  desc:'In a tower', 
  out:new Exit(map.coordToCellName(5, -4)),
})


map.generate(-5, 8, [
  '    ss  ',
  '  sssms  ',
  '  sDDGms',
  ' ssGDGms',
  ' sGGGmms',
  'ssddGGms',
  'sdddGGms',
  'sdddGGCms',
  'sddddGCms',
  ' sddddCmss',
  '  sdddmssms',
  '   sddmssGms',
  '    smmsssss',
  '    smss',
  '     ss',
])


map.river(-1, 4, 5, 5)
map.river(0, 5, 0, 2, 3)
map.river(0, 4, 0, 3, 3)
map.river(0, 3, 5, 4)

map.river(1, 5, 0, 2, 2)
map.river(1, 4, 2)
map.river(1, 2, 4, 4, 4)
map.river(1, 1, 0, 4, 4)
map.river(1, 1, 0, 4, 4)
map.river(1, 0, 0, 4, 2)
map.river(1, -1, 0, 2, 2)
map.river(1, -1, 0, 2)

map.river(2, -1, 2, 2)

map.river(5, -4, 0, 2)


