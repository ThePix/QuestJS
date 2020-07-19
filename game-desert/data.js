"use strict";



  
createItem("me", PLAYER(), { 
  loc:"bus_front",
  regex:/^(me|myself|player)$/,
  money:10,
  positionX:-1,
  positionY:-2,
  examine:function(isMultiple) {
    msg(prefix(this, isMultiple) + "A " + (this.isFemale ? "chick" : "guy") + " called " + this.alias);
  },
});



createItem("knife",
  TAKEABLE(),
  { loc:"me", sharp:false,
    examine:function(isMultiple) {
      if (this.sharp) {
        msg(prefix(this, isMultiple) + "A really sharp knife.");
      }
      else {
        msg(prefix(this, isMultiple) + "A blunt knife.");
      }
    },
  }
);





createRoom("bus_seat", {
  desc:'You are sat on a bus somewhere is Nevada. Out of the window you can see desert, and not a lot else.{once: You have not arrived at Salt Lake City, that is for sure!}',
  up:new Exit("bus"),
  alias:"Sat on the Bus",
});





createRoom("bus", {
  desc:'You are stood up in the aisle of the bus, beside your seat.',
  east:new Exit('bus_front'),
  down:new Exit("bus_seat"),
  alias:"Stood up on the Bus",
});




createRoom("bus_front", {
  desc:'From the front of the bus, you can see the road ahead, heading east for many, many miles of straight road.{once: There is no sign of the driver.}',
  west:new Exit('bus'),
  north:new Exit('desert'),
  out:new Exit('desert'),
  alias:"Front of the Bus",
});




 


// isAtLoc looks suspect, makes assumptions!
createItem("huge_rock", ZONE_FEATURE('desert', 2, -5, 3, true), {
  featureNoExit:"There is a big rock stopping you going #.",
  featureLook:"To the #, you can see a huge rock.",
  examine:"An outcropping of sandstone; it does not look like you could climb it.",
  zoneMapName:'Huge rock',
});

createItem("cactus", ZONE_FEATURE('desert', -1, 3, 2), {
  featureLook:"There is a big cactus to the #.",
  zoneColour:'green',
  zoneMapName:'Strange cactus',
  featureLookHere:"There is a big cactus here; it looks strangely like a hand giving you the finger.",
  examine:"The only thing to thrive in the desert is this solitary cactus. It looks to be a saguaro, one of the bigger species of cacti. It is strange to see one this far north.",
});

createItem("gas_station", ZONE_FEATURE('desert', 1, 0, 6), {
  featureLook:"The gas station is # of you.",
  zoneColour:'transparent',
  zoneMapName:'Gas station',
  north:new Exit('desert'),
});







createItem("barrier", ZONE_BORDER('desert'), {
  examine:"It is invisible!",
  scenery:true,
  border:function(x, y) {
    return (x * x + y * y > 85)
  },
  borderMsg:"You try to head #, but hit an invisible barrier.",
  borderDesc:"The air seems to kind of shimmer.",
});

createItem("barrier2", ZONE_BORDER('desert'), {
  examine:"It is a gas station",
  scenery:true,
  border:function(x, y) {
    return (y === 0 && (x === 0 || x === 1))
  },
  borderMsg:"You try to head #, but hit an invisible barrier.",
});




createRoom("gas_station_interior", {
  desc:'You are stood up inside the gas station.',
  east:new Exit('kitchen'),
  south:new Exit("desert"),
  alias:"Inside the gas station",
  beforeEnter:function() {
    game.player.positionX = 0
    game.player.positionY = -1
  },
});

createRoom("kitchen", {
  desc:'You are stood up in the kitchen.',
  east:new Exit('gas_station_interior'),
  north:new Exit("desert"),
  alias:"Kitchen",
  beforeEnter:function() {
    game.player.positionX = 1
    game.player.positionY = 1
  },
});




createRoom("desert", ZONE(), {
  exits:[
    {x:-1, y:-2, dir:'in', dest:'bus_front', msg:'You climb up into the bus.'},
    {x:0, y:-1, dir:'north', dest:'gas_station_interior', msg:'You walk inside the gas station office.'},
    {x:0, y:-1, dir:'in', dest:'gas_station_interior', msg:'You walk inside the gas station office.'},
    {x:1, y:1, dir:'in', dest:'kitchen', msg:'You walk inside the back of the gas station.'},
    {x:1, y:1, dir:'south', dest:'kitchen', msg:'You walk inside the back of the gas station.'},
  ],
  size:10,
  mapCells:[
    '<rect x="0" y="194" width="336" height="12" stroke="none" fill="#aaa"/>',
    '<rect x="162" y="172" width="12" height="32" stroke="none" fill="#aaa"/>',
    '<rect x="160" y="160" width="32" height="16" stroke="none" fill="#666"/>',
  ],
  outsideColour:'lemonchiffon',
  descs:[
    {
      x:-1, y:-2,
    desc: 'You are stood on the road, beside the bus. The road stretches east and west for miles before disappearing in the heat haze, but there is a gas station just ahead.{once: Has the driver gone there? There is literally nothing else here. Perhaps it would be best to get back in the bus, and wait for him to get back.}',
    },
    {
      x:0, y:-2,
      desc: 'The only feature on the long straight road you are stood on is a gas station at the end of a very short side road to the north.',
    },
    {
      x:0, y:-1,
      desc: 'The gas station forecourt has two pumps, under a small awning that extends from the building to the north. It all looks a bit run down, but you cannot imagine they get much custom way out in the middle of nowhere.',
    },
    {
      x:-1, y:0,
      desc: 'You are stood outside the gas station, a single storey building, with a single window on this side, to the east.',
    },
    {
      x:0, y:1,
      desc: 'The back of the gas station, and it looks no less run down back here.',
    },
    {
      x:1, y:1,
      desc: 'Behind the gas station, or rather the small house attached to it. There is a door to the south.',
    },
    {
      x:2, y:0,
      desc: 'On the east side of the gas station.',
    },
    {
      x:1, y:-1,
      desc: 'You are stood in front of the gas station, or rather, the house attached to it. There is no door, presumably access is via the shop (or the back perhaps).',
    },
    {
      when:function(x, y) { return y === -2 && x < -1 },
      desc: 'You are stood on the road, to the east you can see the bus.',
    },
    {
      when:function(x, y) { return y === -2 },
      desc: 'You are stood on the road, to the west you can see the gas station.',
    },
    {
      when:function(x, y) { return y > -2 },
      desc: 'You are stood in the desert, north of the road.',
    },
    {
      desc: 'You are stood in the desert, sorth of the road.',
    },
  ],
  desc2:function() {
    let s = ''
    if (game.player.positionY === 0) {
      if (game.player.positionX === 0) {
        return 'You are stood on the road, by a gas station.'
      }
      if (game.player.positionX === -1) {
        return 'You are stood on the side of the road somewhere in the Nevada desert. The road heads east and west, disappearing into the heat haze in both directions. You can see a gas station a short way to the east,\nSouth is the bus, and to the southeast the car that crashed into it.'
      }
      if (game.player.positionX < -1) {
        s = 'You are stood on the road, to the east you can see the bus.'
      }
      else {
        s = 'You are stood on the road, to the west you can see the gas station.'
      }
    }
    else if (game.player.positionY > 0) {
      s = 'You are stood in the desert, north of the road.'
    }
    else {
      s = 'You are stood in the desert, south of the road.'
    }

    return s + this.getFeatureDescs()
  },
});



createItem("silver_coin", TAKEABLE(), ZONE_ITEM('desert', -2, 4), {
  examine:"A curious silver coin; you do not recognise it. It says it is worth two dollars.",
});


createItem("gas_pump", TAKEABLE(), ZONE_ITEM('desert', 0, -1), {
  scenery:true,
  examine:"There are two gas pumps, white and slim. They are labelled \"SkyChief\", by Texaco, and look ancient - so old the displays are rotating drums rather than digital. The price is $1.49; surely gas has not been that cheap since the nineties?",
});

