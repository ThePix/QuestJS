"use strict"

createItem("me", PLAYER(), {
  loc:"hex_0_0",
  regex:/^(me|myself|player)$/,
  examine: "Just a regular guy.",
  hitpoints:100,
})

createRoom("street_of_the_gods", {
  desc:"The street rises to north up to the High Temple, and drops south to the market square. It is lined with stone-built buildings reaching three or even four storeys into the sky, with towers, turrets and spires reaching even higher. Grandest of all is the temple itself, standing on a platform that raises it high above the rest of the city, accessed via a wide flight of steps, but you also see the Museum of Curios to the west and the House of Elil to the southeast, with the condensers of the Aether and Flux Company behind it.",
  mapX:0,
  mapY:1,
})



createHex(0, 0, {
  desc:"The market square is the centre of the city, and is teeming with people.  In the southeast corner you see the magnificent entrance of Estalia Manor.|In the centre of the square, a golden statue of Stratos and Geo embracing while looking north to the Great Temple stands on a stone plinth; their presence blesses all who pass through.",
  getHexColour:function() { return 'red' },
  getHexBorder0:function() { return 'pink' },
  getHexBorder1:function() { return 'red' },
  getHexBorder2:function() { return 'darkred' },
  getHexBorder3:function() { return 'darkred' },
  getHexBorder4:function() { return 'red' },
  getHexBorder5:function() { return 'pink' },
})


createHex(0, -1, {
  desc:"The market square is the centre of the city, and is teeming with people.  In the southeast corner you see the magnificent entrance of Estalia Manor.|In the centre of the square, a golden statue of Stratos and Geo embracing while looking north to the Great Temple stands on a stone plinth; their presence blesses all who pass through.",
  getHexColour:function() { return 'yellow' },
  getHexLabel:function() { return 'yellow' },
  northeastProhibited:true,
})

createHex(1, -1, {
  desc:"The market square is the centre of the city, and is teeming with people.  In the southeast corner you see the magnificent entrance of Estalia Manor.|In the centre of the square, a golden statue of Stratos and Geo embracing while looking north to the Great Temple stands on a stone plinth; their presence blesses all who pass through.",
  getHexColour:function() { return 'green' },
  getHexSymbol:function() { return 'assets/icons/houseicon.png' },
  getHexSymbolOffset:function() { return [-8, -8] },
  in:new Exit('tower'),
})

createRoom("tower", {
  desc:'In a tower', 
  out:new Exit(map.coordToCellName(1, -1)),
})
