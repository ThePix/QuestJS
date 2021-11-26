"use strict"

/*
The biggest zone?

*/


register('victorian', {
  book:'Othello',
  uniform:'a rather dowdy grey school uniform that makes her look about fifty',
  smell:'There is a faint musty smell, with just a hint of polish.',
  listen:'Mandy listens, but can hear nothing. It is eerily quiet...',
  floor:"The floor is wooden, and well-polished.",
  door:"The door is wood; panelled and unpainted.",
  walls:"The walls are all panelled in wood.",
  ceiling:"The ceiling is white, with simple decorations along each side.",
  panelling:true,
})



createRoom("front_hall", {
  alias:"hall",
  windowsface:'west',
  exitState:0,
  desc:function() {
    return "The hall is bigger than Mandy expected. Quite an impressive room, really. There are doors to the north and south, while the east wall is adorned with a number of paintings. The walls are panelled with dark wood; the floor is tiled in a {if:front_hall_floor:state:2:simple back and white check:geometric design that is vaguely unnerving}."
  },
  afterFirstEnter:function() {
    msg("The door slams shut, making Mandy jump.")
  },
  west:new Exit("_", { alsoDir:['out'], use:util.cannotUse, msg:'Mandy tries to go back outside, but that way is now mysteriously locked. It looks like she will have to head further into the house. It is strange, but now she is trapped inside the house, she does not feel so scared.'}),
  north:new Exit("brass_dining_room", {use:function(char) {
    if (w.front_hall.exitState < 2) w.front_hall.exitState = 1
    return util.defaultExitUse(char, this)
  }}),
  south:new Exit("gallery", {use:function(char) {
    if (w.front_hall.exitState < 2) w.front_hall.exitState = 2
    return util.defaultExitUse(char, this)
  }}),
  scenery:[
    {
      alias:['portraits', 'pictures', 'paintings'],
      examine:"There are five paintings on the back wall, all portraits. To the left, a plump gentleman in military attire. Next to him, an elderly lady in a blue dress. The central portrait is a youngish man in academic mortar and gown. Next to him, another lady, perhaps in her thirties, and on the far right, a rather dapper young man in a burgundy suit.",
      lookbehind:'Mandy looks behind each of the paintings. There is no safe hidden there; it seems modern media lied to her.',
    },
    {
      alias:['plump gentleman', 'military man', 'sword'],
      examine:"Mandy looks closer at the far left painting. The guy looks to be about sixty, with an impressive moustache and quite the paunch. He is wearing a red uniform covered in metals, and is brandishing a sword. Mandy has a feeling the uniform is that of the British army in the nineteenth century.",
    },
    {
      alias:['elderly lady', 'elderly woman', 'dress'],
      examine:"Mandy looks closer at the middle left painting. The woman depicted is around sixty, she guesses, but would have been quite pretty when she was younger, with flowing black hair, and a friendly smile. The blue dress is clearly more for a younger woman, but to Mandy's eye she just about gets away with it. She wonders whether that is the skill of the artist. ",
    },
    {
      alias:['young academic man', 'scroll', 'mortar board', 'certificate'],
      examine:"Mandy looks closer at the middle painting. This man has medium brown hair and a chubby face. He is wearing a black suit, with a red academic gown over the top, and a mortar board on his head. He has a scroll - presumably his degree certificate - in his hand.",
    },
    {
      alias:['young lady', 'young woman', 'thirties'],
      examine:"Mandy looks closer at the middle right painting. The woman in the painting is around thirty, and has blonde hair arranged in a bun. She is wearing a severe black dress. As far as Mandy can see she is doing her best to look fifty. Or maybe she is fifty, and the artist has painted her looking younger.",
    },
    {
      alias:['dapper young man', 'burgundy suit'],
      examine:"Mandy looks closer at the far right painting. This man has almost black hair, is wearing a burgundy suit, with a black shirt and a blue tie. She wonders when it might have been painted; the colours suggest maybe the seventies or later, but it is the same artistic style as the others, which look nineteenth century.",
    },
  ],
})

createItem("inside_door", {
  loc:"front_hall",
  alias:'door',
  scenery:true,
  examine:"Mandy tries the door; it is definitely locked shut.",
  open:"Mandy tries the door; it is definitely locked shut.",
})




createItem("front_hall_floor", {
  loc:"front_hall",
  alias:'floor',
  synonyms:['image', 'design'],
  scenery:true,
  state:0,
  examine:function() {
    if (this.state === 0) {
      msg("The design on the floor is like one of those pictures her father likes; if you stare at them in just the right way a three-dimensional image emerges. Mandy is not sure why, but she really does not want to see what the image in the floor might be. She shudders involuntarily.")
    }
    else if (this.state === 1) {
      msg("Mandy gingerly looks at the design on the floor again... It has gone! It is just a simple black and white check. How can that be?")
      this.state = 2
    }
    else {
      msg("The floor is tiled, a simple black and white check design.")
    }
  },
  stareat:function() {
    if (this.state === 0) {
      msg("'Pull yourself together,' Mandy says to herself 'It's just a floor, for Christ's sake.' She stares at it, but nothing happens. She tries slowly walking round the peculiar design, whilst staring at it, but nothing.|Wait, her father always says to stare {i:beyond} it. She stands staring at an imaginary point about a metre below the floor...|Suddenly the image pops into view -- a huge mouth, like a snake's or dragon's -- wide open, and about to snap shut around her. She shrieks as she jumps back in shock, and as suddenly as it appears, the giant mouth disappears. As her pounding heart slows, she quickly looks round, thankful no one was around to witness that.")
      this.state = 1
    }
    else if (this.state === 1) {
      msg("Mandy gingerly looks at the design on the floor again... It has gone! It is just a simple black and white check. How can that be?")
      this.state = 2
    }
    else {
      msg("Mandy stares at the black and white checks on the floor, but nothing happens. Not even when she stares at an imaginary point about a metre below the floor.")
    }
  },
})





createRoom("brass_dining_room", {
  alias:"dining room",
  windowsface:'north',
  mannequinCount:4,
  blocked:function() {
    if (this.mannequinCount < 15) return false
    if (w.large_key.loc === 'clock') return false
    if (w.wire.locs.includes('brass_dining_room')) return false
    for (const key in w) {
      if (w[key].loc === 'brass_dining_room' && !w[key].scenery) return false
    }
    return true
  },
  seenMannequins:false,
  desc:function() {
    let s = ''
    if (!this.seenMannequins) {
      s = "'What? Sorry, I thought...' Mandy starts to apologise to the people sat at the table, before realising none are moving - they are just mannequins. Creepy!|"
      this.seenMannequins = true
    }
    s += "This room is dominated by an elegant, dark wood table, well-polished, with brass legs shaped like a lion's, and laid out with eight dinner settings. Eight chairs, in matching style, surround it. At the table, "
    msg (" ")
    if (this.mannequinCount > 0) {
      if (this.mannequinCount === 1) {
        s += "A single mannequin is sat at the table."
      }
      else if (this.mannequinCount < 9) {
        s += lang.toWords(this.mannequinCount) + " mannequins are sitting, dressed up in clothes and wigs."
      }
      else if (this.mannequinCount === 9) {
        s += "eight mannequins are sitting, dressed up in clothes and wigs; a ninth is standing behind one of the chairs."
      }
      else {
        s += "eight mannequins are sitting, dressed up in clothes and wigs; " + lang.toWords(this.mannequinCount - 8) + " more are standing as though waiting to take their place."
      }
      if (this.mannequinCount > 12) s += " It is getting crowded in here!"
    }
    s += " The north wall has a window, with dark wood cabinets on either side, and there is a grand marble fireplace directly opposite the window, with a large clock on the mantelpiece. There are doors to the east, south and west."
    if (this.mannequinCount === 0 && !this.mannequinsNoted) {
      this.mannequinsNoted = true
      s += "|The absence of mannequins makes the room much more pleasant!"
    }
    return s
  },
  beforeEnter:function() { this.mannequinCount++ },
  afterFirstEnter:function() {
    if (!w.front_hall.notedasweird) {
      msg("{i:That's weird,} thinks Mandy, {i:where could the door to the west go?} The front garden must be the other side of the door, but there was no door visible there from the garden, just a window. ")
      w.front_hall.notedasweird = true
    }
  },
  south:new Exit("gallery", {use:function(char) {
    if (w.front_hall.exitState === 1) {
      msg("Mandy walks south... {i:Wait, this isn't the hall,} she thinks to herself. She is positive this is the doorway she came through before, so why is she not in the hall?")
      w.front_hall.exitState = 5
    }
    else {
      msg("Mandy heads south.")
    }
    char.moveChar(this)
    return true
  }}),
  west:new Exit("great_gallery"),
  east:new Exit("steam_corridor"),
  colours:[
    'russet and lilac',
    'russet and lilac',
    'russet, lilac and plum',
    'russet, lilac and plum',
    'russet, lilac, plum and burgundy',
    'russet, lilac, plum and burgundy',
    'russet, lilac, plum, burgundy and cerise',
    'russet, lilac, plum, burgundy and cerise',
    'russet, lilac, plum, burgundy, cerise and olive',
    'russet, lilac, plum, burgundy, cerise and olive',
    'russet, lilac, plum, burgundy, cerise, olive and lavender',
    'russet, lilac, plum, burgundy, cerise, olive and lavender',
    'russet, lilac, plum, burgundy, cerise, olive, lavender and salmon pink',
    'russet, lilac, plum, burgundy, cerise, olive, lavender and salmon pink',
    'russet, lilac, plum, burgundy, cerise, olive, lavender, salmon pink and fawn',
  ],
  scenery:[
    {
      alias:['mantel','grate','mantelpiece','chimney piece',"fireplace"],
      examine:"The fireplace is of a classical style, with two columns either side that are very similar to the museum in the market square; Mandy can vaguely remember being told the museum is Victorian, so perhaps the fireplace is that old too. She cannot imagine it is actually from ancient Greece! There is a large, old-fashioned clock on the mantelpiece.",
    },
    {
      alias:'cabinets',
      examine:"The two cabinets are identical. Made of dark wood, with two ornate doors at the front, they stand on four stubby legs.",
      open:"The doors do not open -- though there is no sign of a keyhole.",
    },
    {
      alias:"table",
      examine:"The table top is made of the same dark wood as the chairs. The legs are rather ornate, and shaped like the legs of a lion; the brass is not as clean as you might hope for a dining room table.",
    },
    {
      alias:"legs",
      examine:"The table legs are rather ornate, and shaped like the legs of a lion; the brass is not as clean as you might hope for a dining room table.",
    },
    {
      alias:["dresses","clothes"],
      examine:"The dresses on the mannequins are a variety of colours; Mandy can see {selectEnd:brass_dining_room:colours:visited}.",
      take:"Mandy tries to take some of the clothing from a mannequin, but it seems to be very firmly fixed.",
    },
    {
      alias:["suits", "trousers", "shirts", "bowties", "bow ties"],
      examine:"The suits on the mannequins all the same; black trousers, jackets and bow ties; with a white dress shirt.",
      take:"Mandy tries to take some of the clothing from a mannequin, but it seems to be very firmly fixed.",
    },
    {
      alias:"wigs",
      examine:"The wigs are a mix of raven black and platinum blonde; the male wigs represent very neat, short haircuts, the female wigs are more varied, with considerably longer hair.",
      take:"Mandy thinks about taking a wig from a mannequin... Does she really want to be carrying one if them around? What if it is made from human hair... from someone who has been dead for a hundred years?",
    },
    {
      alias:["settings", "plates", "napkins", "cutlery", "spoons", "knives", "forks", "knife"],
      examine:"Each table setting consists of a large white plate, with three knives to the right, three forks to the left, and a fork and spoon above. A red napkin folded into something resembling the Sydney Opera House is on each plate.",
      take:"Mandy puts her hands out to swipe a table setting, wondering if it is solid silver, when a chill goes down her spine. Are the mannequins suddenly looking at her? She withdraws her hand, and they definitely turn their heads, no longer looking at her. She reaches out again, and gets the chills again, as they turn to look at her. She decides she does not need a table setting after all.",
    },
  ],
})

createItem("mannequins", {
  loc:"brass_dining_room",
  scenery:true,
  examine:"Mandy looks closer at the mannequins. Their skin is a speckled grey that feels cool to the touch, and sounds like wood when knocked. Their faces are only half formed; slight depression to suggest eyes, a vague nose, but no mouth. Some are dressed as men, some as women though there is no indication of gender other than that. The female ones are wearing long dresses, the male ones are in black suits; they all look like extras from {i:Downton Abbey} -- apart from the grey complexions.|{once:Did that one just turn its head? Mandy looks again, maybe not.:They are not moving at the moment...}",
  smash:function() {
    if (!this.smashed) {
      this.smashed = true
      msg("Mandy looks at the mannequins - the perfect opponents in a fight; they cannot fight back.|She swings a punch at one dressed in a suit, knocking its head off in a most satisfying way. It looks even more creepy with its head lying on the table in front of it...|A movement behind her makes Mandy look round, so see two people entering the dining room... Are they people? There are silver all over, including their faces. Mandy backs away as they rush towards her, one casually knocking her aside, sending her slamming into the wall.|As she warily gets to her feet, she watches as they reattach the head, their arms a blur of speed. And they they leave the room, as fast as they entered it.")
    }
    else {
      msg("Mandy contemplates smashing another mannequin. She rubs her sore ribs where the silver hit her, and decides not to.")
    }
  },
})

createItem("clock", CONTAINER(false), {
  loc:"brass_dining_room",
  scenery:true,
  alias:"clock",
  synonyms:['time'],
  setTimeCount:0,
  setclock:function() {
    if (this.setTimeCount < 2) {
      msg("Mandy decides to set the clock. She is not sure quite what the time is, but it has to be around four o'clock, she guesses. Ten minutes out is better than five hours. She fiddles at the back, finding the control, and sets the hands to five to four.")
      this.setTimeCount = 1
    }
    else if (this.setTimeCount === 2) {
      msg("Mandy notices the clock says twenty past nine. 'I thought I set that.' She fiddles at the back, finding the control, and sets the hands to five to four.")
    }
    else {
      msg("Mandy decides to set the clock {i:again}. She fiddles at the back, finding the control, and sets the hands to five to four.")
    }
    if (this.setTimeCount % 2 === 0) this.setTimeCount++
  },
  testDropIn(options) {
    if (options.item !== w.large_key) return falsemsg("That is not something you can put in a clock.")
    if (w.large_key.size > 5) return falsemsg("The key is too large for the clock.")
    if (w.large_key.size < 5) return falsemsg("The key is too small for the clock.")
    return true
  },
  examine:function() {
    let s = "This is a large, old-fashioned clock. A dark wood case houses the ticking mechanism. Roman numerals run round the clock face, "
    let extra = ''
    if (this.setTimeCount === 1) extra = ' What the fuck? She just set it to four o\'clock!'
    if (this.setTimeCount > 2 && this.setTimeCount % 2 === 1) extra = ' Again!'
    if (typeof this.lookturn === "number") {
      if (this.lookturn > (game.turn - 10)) {
        s += "which indicate the time is now twenty past nine." + extra
      }
      else {
        s += "which indicate the time is still twenty past nine." + extra + " It is ticking, so has clearly not stopped; why is the time not changing?"
      }
    }
    else {
      s += "which indicate the time is now twenty past nine." + extra + " That is so wrong, Mandy cannot decide if it is slow or fast."
      this.lookturn = game.turn
    }
    if (w.large_key.isAtLoc(this.name)) {
      s += " She can see the key for winding the clock up is in the side of the clock."
    }
    if (this.setTimeCount % 2 === 1) this.setTimeCount++
    msg(s)
  },
  windup:function() {
    if (w.large_key.loc === player.name || w.large_key.loc === this.name) {
      return w.clock.dowindup()
    }
    else {
      return falsemsg("Mandy has nothing to wind the clock up with.")
    }
  },
  dowindup:function() {
    if (w.large_key.size < 5) {
      return falsemsg("Mandy looks at the hole in the back of the inanimate figure; a square peg. Like it would fit the key she has -- only much much bigger.")
    }
    if (w.large_key.size > 5) {
      return falsemsg("Mandy looks at the hole in the back of the inanimate figure; a square peg. Like it would fit the key she has -- if not {i:that} big.")
    }
    msg("Mandy puts the key in the clock, and gives it a couple of turns. It continues to tick...")
    if (w.large_key.loc === this.name) {
      msg("She decides to hang on to the key.")
      w.large_key.loc = player.name
      w.large_key.scenery = false
    }
    return true
  },
})

createItem("large_key", SIZE_CHANGING(), {
  loc:"clock",
  scenery:true,
  alias:"clock key",
  desc4:"The key is tiny.",
  desc5:"This key is about an inch across, and would be for turning a mechanism with a square peg.",
  desc6:"This key is about a foot across, and would be for turning a mechanism with a square peg. A big square peg.",
  desc7:"The key is huge.",
  turn:function(options) { return this.useFunction(options) },
  windup:function(options) { return this.useFunction(options) },
  useFunction:function(options) {
    if (player.loc === 'theatre_stage') {
      w.clockwork_thespian.dowindup()
    }
    else if (player.loc === 'brass_dining_room') {
      w.clock.dowindup()
    }
    else {
      return falsemsg("Mandy wonders what she could use the clock key for. Besides winding up the clock, that is.")
    }
    return true
  },
  useWith:function(char, obj) {
    if (obj.dowindup) {
      return obj.dowindup()
    }
    else {
      return falsemsg("Mandy wonders what she could use the clock key for. Besides winding up the clock, that is.")
    }
  },
})

createItem("dining_room_chair", FURNITURE({sit:true}), {
  loc:"brass_dining_room",
  scenery:true,
  alias:"chair",
  synonym:['chairs'],
  examine:"The chair is made of dark wood, with a high back and a padded seat.",
  testPostureOn:function() {
    if (w.brass_dining_room.mannequinCount > 7) return falsemsg("Mandy looks at the chairs; all are occupied by mannequins, preventing her from sitting on any of them.")
    return true
  },
  afterPostureOn:function() { msg("It is nice to get the weight off her feet for a moment!") },
})







createRoom("gallery", ROOM_SET("gallery"), {
  windowsface:'west',
  alias:'north end of the gallery',
  headingAlias:"The Gallery (North)",
  desc:"{roomSet:Mandy is standing at the north end of a long and rather gloomy corridor -- at least this end has a couple of windows, the southern end looks even darker. There are paintings on the east wall.:The north end of the gallery is much like the south, if a little lighter with the window; again there are paintings along the east wall.}  Doors lead north and east. A small table with a chess board set in it stands against the west wall, under the window.",
  afterFirstEnter:function() {
    if (!w.front_hall.notedasweird) {
      msg("{i:That's weird,} thinks Mandy, {i:where could the door to the west go?} The front garden must be the other side of the door, but there was no door visible there from the garden, just a window. And this room is so long, surely the far end must be in number 21!")
      w.front_hall.notedasweird = true
    }
  },
  north:new Exit("brass_dining_room", {use:function(char) {
    if (w.brass_dining_room.blocked()) return falsemsg("Mandy starts heading north, but the dining room is now so full of mannequins, she cannot get into it.")
    if (w.front_hall.exitState === 2) {
      msg("Mandy walks north... {i:Wait, this isn't the hall,} she thinks to herself. She is positive this is the doorway she came through before, so why is she not in the hall?")
      w.front_hall.exitState = 5
    }
    else {
      msg("Mandy heads north.")
    }
    char.moveChar(this)
    return true
  }}),
  south:new Exit("gallery_south", {msg:'Mandy heads to the other end of the gallery; the floorboards squeak under her feet.'}),
  east:new Exit("_", {simpleUse:function(char) {
    if (!w.room_big.accessedFrom) w.room_big.accessedFrom = 'gallery_south'
    const dest = w.room_big.accessedFrom === 'gallery' ? w.room_big : w.room_small
    return util.defaultSimpleExitUse(char, new Exit(dest, {origin:this.origin, dir:this.dir}))
  }}),
  scenery:[
    {
      alias:['portraits', 'pictures', 'paintings'],
      examine:"The paintings are all oil on canvas, and to Mandy's inexpert eye the same style, though they vary in subject matter. Several are portraits, but there is a Greek temple and a rather beautiful sunset. The biggest painting, opposite the chess set, is of a cavalry man in red uniform, astride a great white stallion, sabre in hand. All around him are infantry soldiers in blue -- presumably the enemy.",
    },
    {
      alias:['sunset'],
      examine:"The painting of the sunset is a riot of colour, and really quite striking; it would benefit from better lighting.",
    },
    {
      alias:['stallion'],
      examine:"The great white stallion is great and white. And a stallion. Some girls are really in to horses, but it was never Mandy's thing.",
    },
    {
      alias:['sabre'],
      examine:"The sable is long and curved.",
    },
    {
      alias:['greek temple'],
      examine:"The Greek temple in the painting is little more than a circle of pillars on a base, with a roof. It is sat on a hill, and surrounded by trees.",
    },
    {
      alias:['cavalry man'],
      examine:"The man on the horse is wearing a red uniform and is brandishing a sabre. He has a broad chest, raven black hair and a rather small moustache.{ifMoreThan:battlefield:visited:0: Mandy realises the uniforms are the same as the dead soldiers on the beach were wearing.}",
    },
    {
      alias:["chess set","chess board","chessboard", "table"],
      examine:"The chess board is set into the small table, sixty four squares of ivory and mahogany, in a circular top. The board is in mid-game, and half a dozen pieces have already been taken, mostly white's. Mandy tries to pick up one of the pawns, and finds she cannot -- it seems to be glued to the table. She tries a couple more pieces -- they all seem very solidly in place, even the ones that have been taken.",
      play:'Mandy thinks about playing chess... but there is no one to play against. And the pieces seem to be glued down.',
    },  
    {
      alias:["game"],
      examine:"Mandy looks more closely at the game in progress. Though white has lost more pieces, black's king looks exposed, and might be about to lose.",
    },  
  ],
})

createItem("chess_pieces", {
  loc:"gallery",
  scenery:true,
  parserPriority:-10,
  alias:"chess pieces",
  synonyms:['king', 'queen', 'rook', 'castle', 'bishop', 'pawn'],
  examine:"The chess pieces are all wooden and exquisitely carved. The queen looks like a warrior woman in armour, the pawns hold pikes. White pieces seem to be carved from ivory, whilst black are wooden, but they are otherwise identical.",
  turn:function() {
    msg("Mandy tries to turn a few of the chess pieces, but none of them moved at all.")
    this.gluedDownNoted = true
  },
  take:function() {
    msg("The chess pieces seem glued in place; she cannot shift them.")
    this.gluedDownNoted = true
  },
})

createItem("white_knight", {
  loc:"gallery",
  scenery:true,
  alias:"white knight",
  synonyms:['horse'],
  examine:function() {
    if (this.active) {
      msg("Mandy looks at the white knight. She had not spotted there is only one before, perhaps that is why white is losing. She is not that clear on the game.")
    }
    else {
      msg(w.chess_pieces.examine)
    }
  },
  turn:function() {
    if (this.active) {
      if (w.Patch.leaderName) w.Patch.setLeader()
      msg("Mandy gives the white knight a twist -- and suddenly the room is changing around her...")
      player.loc = 'battlefield'
      world.update()
      world.enterRoom()
    }
    else {
      w.chess_pieces.turn
    }
  }
})





createRoom("gallery_south", ROOM_SET("gallery"), {
  windowsface:'none',
  alias:'south end of the gallery',
  headingAlias:"The Gallery (South)",
  desc:"{roomSet:Mandy is standing at the south end of a long and rather gloomy corridor -- though the far end looks a little lighter; there is at least a window at that end. There are paintings on the east wall.:The south end of the gallery is much like the north, if a little darker without the windows; again there are paintings along the east wall.} {once: Why would anyone hang paintings where it is so dark?} The wooden panelling on the walls has warped, and shows sign of damp. There are doors to the south, east and west.",
  west:new Exit("theatre"),
  north:new Exit("gallery", {msg:'The floorboards squeak beneath her, as she heads to the north end.'}),
  east:new Exit("room_small"),
  south:new Exit("upper_steam_hall"),
  east:new Exit("_", {simpleUse:function(char) {
    if (!w.room_big.accessedFrom) w.room_big.accessedFrom = 'gallery'
    const dest = w.room_big.accessedFrom === 'gallery' ? w.room_small : w.room_big
    return util.defaultSimpleExitUse(char, new Exit(dest, {origin:this.origin, dir:this.dir}))
  }}),
  examine_walls:"The walls are panelled with dark wood, but some patches are discoloured, and the wood has warped.",
  afterEnter:function() {
    if (!this.silverFlag1 && w.beach.visited > 0) {
      this.silverFlag1 = true
      msg("A sudden movement at the other end of the gallery catches her eye. A figure, all in silver, looks at her, before disappearing through the door at the far end.")
      player.silverSpotted++
    }
    if (this.silverFlag1 && !this.silverFlag2 && w.hourglass.fillState === 5) {
      this.silverFlag2 = true
      msg("She notices a silver figure at the other end of the gallery, studying the chessboard. She remembers seeing one there before. This one seems unaware of her, she thinks. Then it glances her way, and suddenly dashes for the door to the dining room.")
      player.silverSpotted++
    }
  },
  scenery:[
    {
      alias:['portraits', 'pictures', 'paintings'],
      examine:"The most striking of the paintings is a family portrait, which must be about life size, despite the subjects being painted full length. Mandy can see a father, in suit and top hat, and a mother, together with three young children.",
      lookbehind:'Mandy looks behind each of the paintings. There is no safe hidden there; it seems modern media lied to her.',
    },
    {
      alias:['father'],
      examine:"The man Mandy guesses is the father has very black hair, and a moustache. He is wearing a dark grey suit.",
    },
    {
      alias:['mother'],
      examine:"The woman is quite attractive with long, flowing black hair. She is wearing a dark red dress with a very full skirt; probably Victorian, thinks Mandy, though there is something exotic about her that makes her look perhaps eastern European.",
    },
    {
      alias:['young children', 'girl', 'boys'],
      examine:"There are three children in the painting; two boys and an older girl. The girl is maybe twelve, and wearing a blue Gingham dress; her dark hair is in two plaits. The boys, who might be eight and ten, are in dark grey suits; the younger looks a little chubby.",
    },
  ],
})






createRoom("room_big", {
  windowsface:'none',
  alias:"drawing room",
  noFollow:true,
  desc:function() {
    let s = "The drawing room is rather well appointed with wood panelling on the walls, and an ornate ceiling. A fireplace to the east has portraits on either side, and above it a painting of a battle."
    if (w.mahogany_cabinet.moved) {
      s += " The mahogany bureau has been pulled out from the north wall. There is a thick rug on the floor."
    }
    else {
      s += " There is a mahogany bureau on the north wall and a thick rug on the floor."
    }
    s += " The only way out is the door to the west."
    return s
  },
  roll:"Mandy wonders if she could roll up the rug, and carry it that way. Does she really want to be lugging the thing around everywhere? Maybe not.",
  beforeEnter:function() {
    for (let key in w) {
      const item = w[key]
      if (item.size_changing && ['room_small', 'drawing_room_south', 'drawing_room_north'].includes(item.loc)) {
        item.shrink()
        item.oldLoc = item.loc
        item.loc = "room_big"
      }
    }
  },
  west:new Exit("_", {simpleUse:function(char) {
    const dest = w.room_big.accessedFrom === 'gallery' ? w.gallery : w.gallery_south
    return util.defaultSimpleExitUse(char, new Exit(dest, {origin:this.origin, dir:this.dir}))
  }}),
  scenery:[
    {
      alias:'fireplace',
      examine:'The fireplace is dark metal with ornate scrolling, and decorated with tiles with a floral design down either side.',
    },
    {
      alias:'rug',
      examine:'The rug is not quite as big as the room, a really thick pile that Mandy almost feels bad walking on. There is a geometric design around the outside, and that could be the signs of the zodiac in the middle.',
    },
    {
      alias:['signs', 'zodiac'],
      examine:'In the centre of the rug there is a depiction of something like a clock face - though without hands - with each sign of the zodiac instead of numbers. She sees Leo - her sign - at the nine o\'clock position.',
    },
    {
      alias:['leo', 'lion'],
      examine:'Mandy looks closer at her star sign; Leo is depicted as the stylised head of a lion.',
    },
    {
      alias:['aries', 'ram', 'taurus', 'bull', 'gemini', 'twins', 'cancer', 'crab', 'virgo	maiden', 'libra	scales', 'scorpio	scorpion', 'sagittarius	archer', 'centaur', 'capricorn', 'goat', 'aquarius	water-bearer', 'pisces', 'fish'],
      examine:'Mandy glances at the other signs, but without paying much attention. Like all Leo\'s, she knows it is all nonsense.',
    },
    {
      alias:['geometric design',],
      examine:'Mandy studies the design around the outside of the rug... Perhaps there is a message encoded there? After fifteen minutes she decides there is not.',
    },
    {
      alias:['skirting board',],
      examine:'The skirting board looks to go all round the room, as is the nature of skirting boards everywhere.',
    },
    {
      alias:'tiles',
      examine:'There are three tiles on each side of the grate. All six have the floral design -- red elongated flowers, knobbly brown pods and bright green leaves composed of well over a dozen long, slim leaflets.{once: A tamarind plant, Mandy realises.}',
    },
    {
      alias:'romans',
      examine:'The Roman soldiers are wearing bronze armour and red tunics... Mandy has a feeling they should be wearing iron, so maybe they are not Romans. Or the artist got it wrong.',
    },
    {
      alias:'opponents',
      examine:'The other combatants are wearing animal skins, and fighting with spears. They have blue paint on their faces, which is a curious fashion choice, but maybe that was the look back then.',
    },
    {
      alias:'surface',
      examine:'The surface of the bureau is smooth and polished.',
    },
    {
      alias:'back',
      examine:'The back of the bureau is wood, but has been carved to resemble a castle wall.',
    },
    {
      alias:'towers',
      examine:'The fake towers on either side of the bureau are wood; each has two drawers.',
    },
    {
      alias:'crenelations',
      examine:'The crenelation on the fake towers and the back of the bureau are carved from wood. The edge has been picked out in gilt.',
    },
  ],  
})

createItem("mahogany_cabinet", OPENABLE(true), {
  loc:"room_big",
  scenery:true,
  alias:"mahogany bureau",
  synonyms:['mahogany cabinet', 'desk'],
  shiftable:true,
  examine:function() {
    let s = "The mahogany bureau looks like it came straight out of \"Antiques Roadshow\". {if:mahogany_cabinet:closed:It has a single door that is lifted up to close it.:The door at the front is pulled down to form a surface to write on, and reveals a curious section at the back with two small drawers on the left and another two on the right, decorated to resemble the towers of a castle with crenelation along the top, and extending across the back of the bureau.}"
    if (this.moved) {
      s += " It is standing a little way from the wall and Mandy can just see a hole in the wall behind it a few inches wide."
    }
    msg(s)
  },
  push:function() {
    if (this.moved) return falsemsg("Mandy looks at the bureau. 'No, not shifting that thing again.'")
    msg("Not sure if she should be moving furniture in someone else's house, Mandy grabs a hold of the bureau, and heaves it away from the wall, revealing a hole in the wall, a few inches high, just above the skirting board.")
    this.moved = true
    return world.SUCCESS
  },
  pull:function() { return this.push() },
  shift:function() { return this.push() },
  lookbehind:function() {
    if (this.moved) {
      msg("Mandy can see a hole in the wall behind the bureau a few inches wide, just over the skirting board, surrounded by cracks, as though someone has smashed it with a sledge hammer.")
    }
    else {
      msg("The bureau is too close to the wall to see behind it; she would have to shift it to see.")
    }
  },
})

createItem("cabinet_drawer", {
  alias:'drawers',
  synonym:['left drawer', 'right drawer'],
  isLocatedAt:function(loc) { return loc === "room_big" && !w.mahogany_cabinet.closed },
  scenery:true,
  examine:'The drawers are small, perhaps used for keeping pens in.',
  open:'Mandy tries a drawer, only to find it is locked. Odd that there is no keyhole.',
})



createItem("cabinet_hole", {
  alias:'hole',
  isLocatedAt:function(loc) { return loc === "room_big" && w.mahogany_cabinet.moved },
  scenery:true,
  examine:'With the bureau pulled out, Mandy can now see the hole in the wall; it is about the size of her hand, just above the skirting board. The cracks in the wall suggest it was the result of an impact.',
})

createItem("portraits_big", {
  loc:"room_big",
  synonyms:['portraits', 'pictures', 'paintings'],
  scenery:true,
  flag:false,
  examine:function(options) {
    msg("There are two portraits of girls, one about eight years old, the other maybe twelve. They look alike, perhaps sisters. The other painting is of a great battle in ancient times. The armoured soldiers look like they might be Roman, and have shields and short swords, whilst their opponents have long swords and axes, but no armour. The Romans seem to be winning.")
    if (w.portraits_west.flag && w.portraits_north.flag && w.portraits_south.flag) {
      msg("She realises these are the same three pictures she saw in the drawing room -- just not as big. In fact, everything in this room is identical to that room, just in here it is normal size.")
    }
  },
})




createRoom("room_small", {
  windowsface:'none',
  alias:'giant drawing room',
  headingAlias:"The Drawing Room (Giant)",
  noFollow:true,
  desc:"This is a drawing room of immense size. Perhaps a hundred metres above her, Mandy can see the ornate ceiling. The walls, panelled in wood, stretch an even greater distance crossways. Huge paintings, way above Mandy's head, hang from the wall, above and either side of an enormous fireplace. In the centre of the room is a thick rug, about the size of a football pitch. The pile is so great, it would stop Mandy going across it. She can, however go round the sides, to the northeast or southeast. The door to the west looks very much out of place, being normal height in such a huge wall.",
  beforeEnter:function() {
    for (let key in w) {
      const item = w[key]
      if (item.size_changing && item.loc === "room_big") {
        item.grow()
        item.loc = item.oldLoc ? item.oldLoc : "room_small"
      }
    }
  },
  west:new Exit("_", {
    simpleUse:function(char) {
      const dest = w.room_big.accessedFrom === 'gallery' ? w.gallery_south : w.gallery
      return util.defaultSimpleExitUse(char, new Exit(dest, {origin:this.origin, dir:this.dir}))
    },
  }),
  northeast:new Exit("drawing_room_north"),
  southeast:new Exit("drawing_room_south"),
  in:new Exit("boots_room", {
    isHidden:function() { return w.boots.loc !== "room_small" || w.boots.size < 6 },
    simpleUse:function(char) {
      if (w.boots.loc !== "room_small" || w.boots.size < 6) return falsemsg(lang.not_that_way, {char:char, dir:this.dir})
      return util.defaultSimpleExitUse(char, this)
    },
    msg:"Mandy crawls inside the left boot.",
  }),
  scenery:[
    {
      alias:'mess',
      examine:"Mandy studies that third painting again, and realises that there is a real picture. It looks like a battle, with swords and shields. Now she can see it, she wonders how she could not before.",
    },
    {
      alias:'fireplace',
      examine:'The enormous fireplace is dark metal with ornate scrolling, and decorated with tiles with a floral design down either side.',
    },
    {
      alias:'rug',
      examine:'The rug is so big it is more like a corn field, the tufts standing so tall they come up to her chest, and too thick to get through. She can tell there is a design on it, but she cannot tell what from this angle.',
    },
    {
      alias:'design',
      examine:'Mandy ties again to see the design on the rug; she definitely cannot tell what it is from this angle.',
    },
    {
      alias:'scrolling',
      examine:'The scrolling on the fireplace is all curves and flourishes.',
    },
    {
      alias:['skirting board',],
      examine:'The skirting board looks to go all round the room, as is the nature of skirting boards everywhere. It is about a metre high, which is less common.',
    },
  ],
})

createItem("portraits_west", {
  loc:"room_small",
  synonyms:['portraits', 'pictures', 'paintings'],
  scenery:true,
  flag:false,
  examine:function(options) {
    options.item.flag = true
    if (w.portraits_west.flag && w.portraits_north.flag && w.portraits_south.flag) {
      msg("Mandy looks at the three paintings. Having looked from three angles, she can see that there are two portraits of girls, one about eight years old, the other maybe twelve. They look alike, perhaps sisters. The other painting is of a great battle in ancient times. The armoured soldiers look like they might be Roman, and have shields and short swords, whilst their opponents have long swords and axes, but no armour. The Romans seem to be winning.")
      if (w.room_big.visited > 0) {
        msg("She realises these are the same three pictures she saw in the drawing room -- just much, much big. In fact, everything in this room is identical to that room, just in here it is giant size.")
      }
    }
    else {
      msg("Mandy looks at the three paintings; two look to be portraits, the other is just a confusing mess. It is hard to see them properly from so far away, and a bad angle.")
    }
  },
})

createItem("portraits_south", {
  loc:"drawing_room_south",
  synonyms:['portraits', 'pictures', 'paintings'],
  scenery:true,
  flag:false,
  examine:function(options) { return w.portraits_west.examine(options) },
})

createItem("portraits_north", {
  loc:"drawing_room_north",
  synonyms:['portraits', 'pictures', 'paintings'],
  scenery:true,
  flag:false,
  examine:function(options) { return w.portraits_west.examine(options) },
})





createRoom("drawing_room_south", {
  windowsface:'none',
  alias:'south side of the giant drawing room',
  headingAlias:"The Drawing Room (Giant, South)",
  northwest:new Exit("room_small"),
  desc:'Mandy is standing in a narrow strip between the wall to the south and the rug-forest to the north. The south side of the giant room is notable for how dusty it is -- and how big the particles of dust are; about the size of marbles. Probably the way she can go from here is back northwest.',
  scenery:[
    {
      alias:'mess',
      examine:"Mandy studies that third painting again, and realises that there is a real picture. It looks like a battle, with swords and shields. Now she can see it, she wonders how she could not before.",
    },
    {
      alias:'fireplace',
      examine:'The enormous fireplace is dark metal with ornate scrolling, and decorated with tiles with a floral design down either side.',
    },
    {
      alias:'dust',
      examine:'Conscious that dust is about ninety percent dead skin, Mandy decides not to study it too closely.',
      take:'She can\'t take it.|Well, okay, she {i:could}, but she is not about to.',
      clean:"Someone really needs to dust this place,' think Mandy. Somone other than her, obviously.",
    },
    {
      alias:'rug',
      examine:'The rug is so big it is more like a corn field, the tufts standing so tall they come up to her chest, and too thick to get through. She can tell there is a design on it, but she cannot tell what from this angle.',
    },
    {
      alias:'design',
      examine:'Mandy ties again to see the design on the rug; she definitely cannot tell what it is from this angle.',
    },
    {
      alias:'scrolling',
      examine:'The scrolling on the fireplace is all curves and flourishes.',
    },
    {
      alias:['skirting board',],
      examine:'The skirting board looks to go all round the room, as is the nature of skirting boards everywhere. It is about a metre high, which is less common.',
    },
  ],
})




createRoom("drawing_room_north", {
  windowsface:'none',
  alias:'north side of the giant drawing room',
  headingAlias:"The Drawing Room (Giant, North)",
  desc:function() {
    let s = "Mandy stands on a narrow strip of wooden floor, between the colossal wall to the north, and the forest-like carpet to the south. To the east, the rug is flush against the wall, so that is not an option, but she can head southwest, back to the door."
    if (w.mahogany_cabinet.moved) {
      s += " Above her towers a huge mahogany bureau, standing some way out from the wall. Behind it, to the north, is a large hole in the otherwise perfect wall."
    }
    else {
      s += " Above her towers a huge mahogany bureau, standing against the wall. There are cracks in the wall behind it, just above the skirting board."
    }
    return s
  },
  southwest:new Exit("room_small"),
  north:new Exit("secret_room", {
    isHidden:function() { return !w.mahogany_cabinet.moved },
    simpleUse:function(char) {
      if (!w.mahogany_cabinet.moved) {
        msg("No way can Mandy get between the wall and the giant bureau to go that way.")
        return false
      }
      return util.defaultSimpleExitUse(char, this)
    },
    alsoDir:['in'],
  }),
  scenery:[
    {
      alias:'mess',
      examine:"Mandy studies that third painting again, and realises that there is a real picture. It looks like a battle, with swords and shields. Now she can see it, she wonders how she could not before.",
    },
    {
      alias:'fireplace',
      examine:'The enormous fireplace is dark metal with ornate scrolling, and decorated with tiles with a floral design down either side.',
    },
    {
      alias:'rug',
      examine:'The rug is so big it is more like a corn field, the tufts standing so tall they come up to her chest, and too thick to get through. She can tell there is a design on it, but she cannot tell what from this angle.',
    },
    {
      alias:'design',
      examine:'Mandy ties again to see the design on the rug; she definitely cannot tell what it is from this angle.',
    },
    {
      alias:'scrolling',
      examine:'The scrolling on the fireplace is all curves and flourishes.',
    },
    {
      alias:['skirting board',],
      examine:'The skirting board looks to go all round the room, as is the nature of skirting boards everywhere. It is about a metre high, which is less common.',
    },
  ],
})

createItem("cracks_in_the_wall", {
  loc:"drawing_room_north",
  synonyms:['hole'],
  scenery:true,
  goInDirection:'north',
  examine:function() {
    if (w.mahogany_cabinet.moved) {
      msg("The cracks in the wall surround a hole big enough to climb through.")
    }
    else {
      msg("Looking up behind the giant bureau, Mandy can see that the cracks lead to a hole in the wall -- probably large enough to climb though, if not for the bureau.")
    }
  },
})

createItem("huge_cabinet", {
  alias:'huge bureau',
  loc:"drawing_room_north",
  open:'Mandy wonders what sort of crane she would need to open the bureau.',
  scenery:true,
  synonyms:['drawers', 'cabinet'],
  examine:function() {
    let s = "The mahogany bureau towers over Mandy; it has to be higher than the science block at Kyderbrook High. {if:mahogany_cabinet:closed:Its doors are closed:It has two doors that are open, through it is hard to see what is beyond them from this angle -- it looks strangely like a castle}."
    if (w.mahogany_cabinet.moved) {
      s += " It is standing a little way from the wall -- like about 10 foot -- and Mandy can see a hole in the wall behind it."
    }
    else {
      s += " Is there something behind the bureau?"
    }
    msg(s)
  },
  push:function() {
    return falsemsg("Mandy looks at the bureau. The one that is higher than the science block at Kyderbrook High. 'That's not going to budge.'")
  },
  pull:function() { return this.push() },
  shift:function() { return this.push() },
  goUpItem:'Mandy wonders if she could climb up the giant bureau. The ornate legs look easy enough, but above them, the cabinet itself would be impossible. She decides that is not an option.',
  lookbehind:function() {
    if (this.moved) {
      msg("Mandy can just see a hole in the wall behind it a few inches wide, just over the skirting board.")
    }
    else {
      msg("There are cracks in the wall behind the bureau, and looking closer, Mandy can see there is actually a hole there. Probably big enough to crawl through if the bureau was not there.")
    }
  },
})




createRoom("secret_room", {
  windowsface:'none',
  headingAlias:"A Secret Room",
  desc:"After the opulence of the other rooms, this one is decidedly bare -- but at least it is of reasonable proportions. More or less square, the walls are white, or had been at one time. The floor and ceiling are wood.{if:boots:scenery: The only feature of note is a large pair of boots in one corner.}",
  south:new Exit("drawing_room_north", {alsoDir:['out']}),
})

createItem("boots", SIZE_CHANGING(), {
  loc:"secret_room",
  scenery:true,
  mended:false,
  parserPronouns:lang.pronouns.plural,
  alias:"pair of boots",
  desc5:"The boots are big, like a size fifteen or something, Mandy reckons. Her dad has big feet, but not like these.",
  desc4:"The boots are tiny, suitable for a doll maybe.",
  //desc3:"The boots are almost too small to see.",
  wear:function() {
    msg("The boots are too " + (this.size > 4 ? "big" : "small") + " for Mandy, and she is not entirely sure she wants to put her feet in smelly old boots anyway!")
  },
  smell:"Mandy gives the boots a cautious sniff. 'Oh, God!' she exclaims. Not good...",
  examine:function() {
    if (w.boots.rejectedForStone) {
      w.boots.rejectedForStone = false
      msg("Mandy tips up the left boot, hoping something will fall out -- no such luck. She puts her hand inside it, hoping to feel something. There {i:is} something there, she can just touch it with her fingertips. Something thin, stuck right up in the toe. Try as she might, however, she cannot get her hand in far enough to get a grip on it, whatever it is, to pull it out.")
      return true
    }
    if (this.size === this.minsize) {
      msg("{nv:item:be:true} too tiny to see properly!", {item:this})
    }
    else if (this.size === this.maxsize) {
      msg("The boots are so huge she could probably get inside them! Certainly too big to pick up.")
    }
    else {
      msg(this['desc' + this.size] + (this.mended ? ' They look in good condition, now they have been mended.' : ' The toe of the right boot is coming away from the sole.'))
    }
    return true
  },
  enteritem:function() {
    if (w.boots.size < 6) return falsemsg("The boots are too small for Mandy to get inside.")
    return util.defaultSimpleExitUse(player, w.room_small.in)
  },
  afterSizeChange:function() {
    this.goInDirection = this.size === this.maxsize ? 'in' : undefined
  },
  repair:function(options) {
    if (this.mended) return falsemsg("Mandy looks at the boots -- they are probably as mended as they will ever be.")
    if (options.char === player) return falsemsg("Mandy looks at the boots. If she had some suitable materials, she could fix them. And the the right tools, of course. And some clue about what to do. Hmm, maybe she should find someone else to do it.")
    if (options.char !== w.tiny_man) falsemsg("Mandy wonders if she could ask {nm:char:the} to fix the boots. She decides there is no points.")

    this.doRepair()
    return true
  },
  doRepair:function() {
    if (w.boots.loc === player.name) {
      msg("'Could you mend some boots?' Mandy shows him the boots.")
      if (w.boots.size > 4) {
        msg("'Are you kidding me? They're enormous! 'Ow can I get a needle through leather that thick?'")
      }
      else {
        msg("'I should think so. Toss 'em over here, and I'll 'ave a go.'")
        w.tiny_man.state = 1
      }
    }
    else if (w.boots.loc === "tiny_man") {
      msg("'How are you doing with those boots?'|'Nearly done,' he says, not looking up.")
    }
    else {
      msg("'Could you mend boots?' Mandy asks.|He shrugs. 'I guess.'")
    }
  },
})

createItem("boots_toe", COMPONENT("boots"), {
  alias:'toe of boot',
  examine:"The toe of the boot has come away from the sole completely.",
})




createRoom("boots_room", {
  out:new Exit("room_small", {msg:"Mandy climbs out of the giant boot, thankful to be out of there."}),
  alias:'inside a boot',
  headingAlias:"Inside a left boot",
  afterFirstEnter:function() {
    w.secret_recipe.size = 6
  },
  desc:"The interior of the boot is no more pleasant than the exterior; just darker.{if:secret_recipe:scenery: It looks like there is a huge sheet of thick card, folded into two, wedged in the toe.}",
})


createItem("boots_from_inside", {
  loc:"boots_room",
  scenery:true,
  alias:'boot',
  examine:function() { msg(w.boots_room.desc) },
  goOutDirection:'out',
})


createItem("secret_recipe", SIZE_CHANGING(), {
  alias:"piece of paper",
  synonyms:['huge sheet of card', 'tiny sheet of paper', 'notes'],
  loc:"boots_room",
  scenery:true,
  desc3:"A tiny sheet of folded paper, with writing on one side.",
  desc4:"This sheet of paper has boon folded in two, and has writing on the inside.",
  desc5:"A large sheet of thick card, folded in two; Mandy can see writing on one side.",
  desc6:"A huge sheet of thick card, folded in two; Mandy can see giant writing on one side.",
  alias3:'tiny sheet of paper',
  alias4:'sheet of paper',
  alias5:'sheet of card',
  alias6:'huge sheet of card',
  parserPriority:-10,
  read:function() {
    if (this.size < 5) return falsemag("The writing is too small to read.")
    let s = ''
    if (this.size === 6) {
      s += "Mandy opens up the huge sheet of card, and reads the giant letters..."
    }
    else {
      s += "Mandy opens up the sheet of paper, and reads the text..."
    }
    s += "\"Notes on the Hourglass of Temporal Hastening. The power of the hourglass can be channelled through a specially prepared conduit -- to wit, the pedestal -- into a suitable medium. Once the hourglass has stopped, the organism maintains its state, but only while the hourglass remains in place -- once the hourglass is removed, the organism very quickly withers and dies. This is a severe limitation to its practical utility, and needs to be resolved. I have resolved not to use it on a living creature until then.\""
    this.hasBeenRead = true
    msg(s)
  },

  shrink:function() {
    this.size--
    this.setAlias(this['alias' + this.size])
  },

  grow:function() {
    this.size++
    this.setAlias(this['alias' + this.size])
  },

})




createItem("victorian_floor", {
  scenery:true,
  alias:"floor",
  examine:"The floor is wooden, and well-polished.",
})

createItem("victorian_walls", {
  scenery:true,
  alias:"wall",
  examine:"The walls are all panelled in wood.",
})

createItem("victorian_ceiling", {
  scenery:true,
  alias:"ceiling",
  examine:function() {
    if (player.standson === null) {
      msg("The ceiling is white, with simple decorations along each side.")
    }
    else {
      msg("The ceiling turns out to be no more interesting from up here. Mandy wonders why she bothered standing on the {nm:item}.", {item:w[player.standson]})
    }
  },
})

createItem("floor", {
  scenery:true,
  alias:"Floor",
  examine:"Mandy is not quite sure what it is about the tiles. They does not depict a demon or murder or anything really; they just has a strange effect on her eyes that is... disturbing.",
})








