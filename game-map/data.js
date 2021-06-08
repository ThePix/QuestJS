"use strict"

createItem("me", PLAYER(), {
  loc:"lounge",
  regex:/^(me|myself|player)$/,
  examine: "Just a regular guy.",
  hitpoints:100,
})

createRoom("lounge", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
  west:new Exit('dining_room'),
  south:new Exit('hall'),
  mapColour:'red',
  mapWidth:45,
  mapHeight:45,
})

createRoom("kitchen", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
  west:new Exit('garden_east'),
  north:new Exit('dining_room'),
  east:new Exit('hall'),
})

createRoom("dining_room", {
  desc:"The dining room is boring, the author really needs to put stuff in it.",
  east:new Exit('lounge'),
  west:new Exit('garden_east', {mapOffsetY:-1,  mapDrawBase:function(fromRoom, toRoom) {
    return map.bezier(fromRoom, [[-15, 0], [-35, 0], [-35, 25]], 'fill:none')
      + map.polygon(toRoom, [[0, -20], [-5, -30], [5, -30]], 'stroke:none')
    return s
  }}),
  south:new Exit('kitchen'),
  mapLabel:'D-Room',
})

createRoom("hall", {
  desc:"The hall is boring, the author really needs to put stuff in it.",
  up:new Exit('landing'),
  west:new Exit('kitchen'),
  north:new Exit('lounge'),
  east:new Exit('street_middle'),
  south:new Exit('conservatory', {mapOffsetX:-0.5}),
  mapWidth:25,
})

createRoom("conservatory", {
  desc:"The conservatory is boring, the author really needs to put stuff in it.",
  north:new Exit('hall', {mapOffsetX:0.5}),
  west:new Exit('shed'),
  mapColour:'#88f',
})

createRoom("shed", {
  desc:"The shed is boring, the author really needs to put stuff in it.",
  east:new Exit('conservatory'),
  north:new Exit('garden_east', {mapOffsetX:-0.5}),
})

createItem("Lara", NPC(true), {
  loc:'shed',
  properNoun:true,
  agenda:['walkRandom'],
  mapDrawBase:function() { return map.rectangle(w[this.loc], [[-5,-5], [10, 10]], 'fill:red;stroke:black') }
})

createItem("Kyle", NPC(false), {
  loc:'shed',
  properNoun:true,
  agenda:['walkRandom'],
  mapDrawBase:function() { return map.rectangle(w[this.loc], [[0,0], [10, 10]], 'fill:blue;stroke:black') }
})

createItem("Robot", NPC(false), {
  loc:'street_north',
  agenda:['patrol:street_middle:street_south:street_middle:street_north'],
  mapDrawBase:function() { return map.rectangle(w[this.loc], [[-10,-10], [10, 10]], 'fill:silver;stroke:black') }
})


createRoom("garden_east", {
  desc:"The east end of the garden is boring, the author really needs to put stuff in it.",
  east:new Exit('kitchen'),
  west:new Exit('garden_west'),
  south:new Exit('shed', {mapOffsetX:0.5}),
  mapDrawBase:function() {
    return map.rectRoom(this, [[-25, -16], [41, 32]], 'stroke:none;fill:#8f8')
      + map.polyline(this, [[-25, -16], [16, -16], [16, 16], [-25, 16]], 'stroke:black;fill:none')
  },
})

createRoom("garden_west", {
  desc:"The west end of the garden is boring, the author really needs to put stuff in it.",
  east:new Exit('garden_east'),
  south:new Exit('fairy_grotto', {mapOffsetY:-2, mapDrawBase:function(fromRoom, toRoom) {
    return map.bezier(fromRoom, [[0, 15], [30, 50], [-30, 10], [0, 65]], 'fill:none')
  }}),
  mapDrawBase:function() {
    return map.rectRoom(this, [[-16, -16], [41, 32]], 'stroke:none;fill:#8f8')
      + map.polyline(this, [[25, -16], [-16, -16], [-16, 16], [25, 16]], 'stroke:black;fill:none')
  },
})

createRoom("fairy_grotto", {
  desc:"The fairy grotto is amazing! But the author really needs to put stuff in it.",
  north:new Exit('garden_west', {mapIgnore:true}),
  mapDrawBase:function() {
    return map.polyroom(this, [[0, 20], [20, 0], [0, -20], [-20, 0]], 'stroke:black;fill:#cfc')
  },
})




createRoom("landing", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
  down:new Exit('hall'),
  west:new Exit('bedroom'),
})

createRoom("bedroom", {
  desc:"The lounge is boring, the author really needs to put stuff in it. There is a portal you go go in.",
  east:new Exit('landing'),
  in:new Exit('glade'),
})



createRoom("street_middle", {
  desc:"The lounge is boring, the author really needs to put stuff in it.",
  west:new Exit('hall'),
  north:new Exit('street_north'),
  south:new Exit('street_south'),
  mapDrawBase:function() {
    return map.rectRoom(this, [[-16, -66], [32, 132]], 'stroke:black;fill:grey')
    return s
  },
})

createRoom("street_north", {
  desc:"The street_north is boring, the author really needs to put stuff in it.",
  south:new Exit('street_middle'),
  north:new Exit('bus'),
  mapDrawBase:function() { return '' },
  afterFirstEnter:function() { w.street_middle.visited++ },
})

createRoom("street_south", {
  desc:"The street_south is boring, the author really needs to put stuff in it.",
  north:new Exit('street_middle'),
  mapDrawBase:function() { return '' },
})




createRoom("glade", {
  desc:"The glade is boring, the author really needs to put stuff in it. There is a portal you go go in.",
  east:new Exit('forest'),
  north:new Exit('bus'),
  in:new Exit('bedroom'),
})

createRoom("forest", {
  desc:"The forest is boring, the author really needs to put stuff in it.",
  west:new Exit('glade'),
})




createRoom("bus", TRANSIT("south"), {
  desc:"The bus is boring, the author really needs to put stuff in it.",
  south:new Exit('street_north'),
  mapColour:'red',
  busSvg:'M 129.27804,338.45161 C 126.69532,337.531 122.67537,334.96481 120.34481,332.74894 C 100.2604,313.65296 117.70112,280.53965 144.46203,286.95949 C 155.62149,289.63661 164.8738,301.52866 164.8738,313.19487 C 164.8738,319.94706 161.25054,327.79447 155.82306,332.79735 C 148.06919,339.94462 138.92874,341.8916 129.27804,338.45161 z M 146.7906,322.14862 C 149.62093,319.3183 150.33267,317.54629 150.33267,313.33005 C 150.33267,310.42796 149.53645,306.91677 148.56329,305.52738 C 144.25935,299.38265 133.76736,298.90036 128.41183,304.60105 C 126.12886,307.03118 125.49157,309.03334 125.49157,313.77563 C 125.49157,318.9197 126.00835,320.28624 128.89149,322.76621 C 133.98403,327.14664 142.07165,326.86758 146.7906,322.14862 z M 334.13715,338.47621 C 323.43325,334.65872 316.41928,324.42129 316.3705,312.54446 C 316.33729,304.45544 318.75186,299.26016 325.38708,293.14403 C 342.28037,277.57234 369.60815,289.82268 369.60815,312.96721 C 369.60815,331.38005 351.2527,344.58039 334.13715,338.47621 z M 351.39175,321.9622 C 359.38568,313.96826 354.31365,300.24372 343.36547,300.24372 C 331.0767,300.24372 325.40114,314.80208 334.65448,322.58825 C 340.01014,327.09473 346.50204,326.8519 351.39175,321.9622 z M 49.436815,321.75247 C 45.491935,318.75686 44.909485,313.64658 44.909485,282.0306 L 44.909485,250.64586 L 48.377025,246.66548 L 51.844565,242.68509 L 53.259015,211.17931 C 55.426365,162.90316 55.306015,163.60821 61.840555,160.90836 C 63.934705,160.04313 122.39644,159.74445 246.66765,159.9641 L 428.43177,160.28536 L 434.49057,163.07389 C 442.156,166.60187 447.75858,171.95418 451.86636,179.67353 L 455.09051,185.73233 L 455.09051,242.50886 L 455.09051,299.28539 L 416.31416,311.26946 C 394.98717,317.8607 377.18055,323.25661 376.7439,323.26035 C 376.30725,323.26411 376.23786,320.09254 376.58969,316.21244 C 378.45911,295.59609 362.92304,278.43203 342.39268,278.43203 C 333.884,278.43203 326.03799,281.90924 319.26576,288.68147 C 311.39833,296.54891 308.49529,304.44677 309.3871,315.55686 L 310.00601,323.26717 L 239.78177,323.26717 L 169.55752,323.26717 L 170.47468,320.54071 C 172.21368,315.37115 171.25975,304.54857 168.55861,298.80214 C 158.68054,277.78745 132.63033,272.4453 115.09798,287.83891 C 107.91442,294.14616 104.89164,301.67731 104.89164,313.26769 L 104.89164,323.26225 L 78.161575,323.26471 C 58.645915,323.26651 50.893135,322.85836 49.436815,321.75247 z M 94.671345,302.62461 C 96.935655,301.41279 97.015205,299.50862 97.015205,246.52009 C 97.015205,205.47456 96.649235,191.30399 95.561085,190.21585 C 94.664695,189.31946 90.265745,188.76174 84.091995,188.76174 C 75.333575,188.76174 73.915075,189.06433 72.786315,191.17343 C 71.913595,192.80412 71.605475,211.06598 71.834865,247.56515 C 72.126545,293.97691 72.428945,301.70618 73.991745,302.69354 C 76.443455,304.24248 91.743595,304.19149 94.671345,302.62461 z M 186.19474,234.68142 C 188.25961,232.39979 188.50313,230.11209 188.50313,212.99695 C 188.50313,195.88182 188.25961,193.59412 186.19474,191.31248 C 183.95748,188.84032 182.88681,188.76174 151.44318,188.76174 C 124.10654,188.76174 118.71162,189.05011 117.16788,190.59385 C 114.48333,193.2784 113.58306,201.74613 114.25293,218.01114 C 115.10952,238.80969 112.04891,237.23217 151.54443,237.23217 C 182.88512,237.23217 183.95782,237.1532 186.19474,234.68142 z M 269.76244,235.51303 C 271.93049,233.92848 272.11463,232.18829 272.11463,213.28366 C 272.11463,197.68172 271.71663,192.2934 270.45156,190.76758 C 268.97936,188.99197 265.05018,188.76174 236.21931,188.76174 C 205.26582,188.76174 203.52991,188.88196 201.22662,191.18526 C 199.00791,193.40397 198.8031,195.22446 198.8031,212.72733 C 198.8031,228.06991 199.17565,232.37778 200.68945,234.53902 C 202.55882,237.20792 202.86766,237.23217 234.99302,237.23217 C 261.06961,237.23217 267.87034,236.89591 269.76244,235.51303 z M 352.31568,234.59742 C 355.02436,232.05274 355.12024,231.28872 355.12024,212.24856 C 355.12024,193.25022 355.02246,192.46595 352.42709,190.64809 C 350.15867,189.05923 344.80775,188.76174 318.49779,188.76174 C 278.8402,188.76174 282.10522,186.55905 282.63528,212.95569 C 282.97335,229.79152 283.30286,232.44967 285.32886,234.68513 C 287.55966,237.14655 288.67715,237.23217 318.57419,237.23217 C 348.67011,237.23217 349.58736,237.16054 352.31568,234.59742 z M 438.05715,234.53902 C 440.91849,230.45387 440.74457,203.05729 437.82104,197.34683 C 433.76709,189.42836 430.76458,188.76174 399.15342,188.76174 L 371.04903,188.76174 L 368.53756,191.95456 C 366.25181,194.86041 366.02609,196.77131 366.02609,213.21545 C 366.02609,230.78316 366.10845,231.36589 369.00041,234.25784 L 371.97473,237.23217 L 404.07276,237.23217 C 435.86828,237.23217 436.18856,237.20678 438.05715,234.53902 z',
  mapDrawBase:function(level, el) {
    let s = '  <path style="fill:#888" d="' + this.busSvg + '" id="bus-path" transform="translate('
    s += (el.mapX-25) + ' ' + (el.mapY-25)
    s += ') scale(0.1 0.1)"' + (el.mapZ === level ? map.getClickAttrs(this) : '') + 'n/>'
    return s
  },
})



createItem("button_street", TRANSIT_BUTTON("bus"), {
  alias:"Button: Street",
  examine:'A button with the word "High Street" on it.',
  transitDest:"street_north",
  transitDestAlias:"High Street",
  transitAlreadyHere:"You're already there mate!",
  transitGoToDest:"The drive puts the bus in gear, and sets off.",
})

createItem("button_glade", TRANSIT_BUTTON("bus"), {
  alias:"Button: Glade",
  examine:'A button with the word "Hidden Glade" on it.',
  transitDest:"glade",
  transitDestAlias:"Hidden Glade",
  transitAlreadyHere:"You're already there mate!",
  transitGoToDest:"The drive puts the bus in gear, and sets off.",
})



