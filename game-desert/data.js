"use strict";



  
createItem("me", PLAYER(), { 
  loc:"bus_front",
  regex:/^(me|myself|player)$/,
  money:10,
  positionX:-1,
  positionY:0,
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
  desc:'You are sat on a bus that has crashed somewhere is Nevada. Out of the window you can see desert, and not a lot else.',
  up:new Exit("bus"),
  alias:"Sat on the Bus",
});





createRoom("bus", {
  desc:'You are stood up in the aisle of the bus, beside your seat. At the front (to the east), you can see the windscreen is broken.',
  east:new Exit('bus_front'),
  down:new Exit("bus_seat"),
  alias:"Stood up on the Bus",
});




createRoom("bus_front", {
  desc:'From the front of the bus, you can see the car the bus crashed into - or at least the half that has not gone under the bus.',
  west:new Exit('bus'),
  north:new Exit('desert'),
  out:new Exit('desert'),
  alias:"Front of the Bus",
});



/*
createRoom("outside_bus", {
  desc:'You are stood on the side of the road somewhere in the Nevada desert. The road heads east and west, disappearing into the heat haze in both directions. You can see a gas station a short way to the east,\nSouth is the bus, and to the southeast the car that crashed into it.',
  south:new Exit('bus_front'),
  north:new Exit('desert'),
  up:new Exit("bus_front"),
  alias:"Outside the Bus",
});
*/



/*

The road runs along the y=0 line
The gas station is at 0,0
The bus is at -1,0
Can get up to 5 away

Use barrierHere to determine if the barrier can be examined
Is it a visible fence?

*/



 


// isAtLoc looks suspect, makes assumptions!
createItem("huge_rock", ZONE_FEATURE('desert', 2, -3, 3, true), {
  featureNoExit:"There is a big rock stopping you going #.",
  featureLook:"To the #, you can see a huge rock.",
  examine:"An outcropping of sandstone; it does not look like you could climb it.",
});

createItem("cactus", ZONE_FEATURE('desert', -1, 4, 2), {
  featureLook:"There is a big cactus to the #.",
  featureLookHere:"There is a big cactus here; it looks strangely like a hand giving you the finger.",
  examine:"The only thing to thrive in the desert is this solitary cactus. It looks to be a saguaro, one of the bigger species of cacti. It is strange to see one this far north.",
});







createItem("barrier", ZONE_BORDER('desert'), {
  examine:"It is invisible!",
  scenery:true,
  border:function(x, y) {
    return (x * x + y * y > 25)
  },
  borderMsg:"You try to head #, but hit an invisible barrier.",
  borderDesc:"The air seems to kind of shimmer.",
});




createRoom("desert", ZONE(), {
  exits:[
    {x:-1, y:0, dir:'in', dest:'bus_front', msg:'You climb up into the bus.'},
    {x:-1, y:0, dir:'south', dest:'bus_front', msg:'You climb up into the bus.'},
    {x:0, y:0, dir:'north', dest:'gas_station', msg:'You walk inside the gas station office.'},
    {x:0, y:0, dir:'in', dest:'gas_station', msg:'You walk inside the gas station office.'},
    {x:-1, y:0, dir:'in', dest:'kitchen', msg:'You walk inside the back of the gas station.'},
    {x:-1, y:0, dir:'south', dest:'kitchen', msg:'You walk inside the back of the gas station.'},
  ],
  desc:function() {
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


