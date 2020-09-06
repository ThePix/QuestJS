"use strict";


createRoom("hints", {
})


createItem("h_gettheletter", {
  loc:"hints",
  examine:"Pick up something and the house will allow you in...",
})


createItem("h_find_animate_corpse", {
  loc:"hints",
  examine:"You are going to need some muscle later on. Can you find anyone suitable? Or animate someone suitable...<br/>There are other things you can do too, so explore a bit.",
})


createItem("h_animate_corpse1", {
  loc:"hints",
  examine:function() {
    msg ("So you have found a corpse, all ready to be brought to life by some mad scientist. All you need is..?")
    this.passed = true
  },
})


createItem("h_animate_corpse2", {
  loc:"hints",
  examine:function() {
    msg ("So you have found a corpse, all ready to be brought to life by some mad scientist. All you need is a spark of electricity, or more specifically a bolt of lightning.")
    this.passed = true
  },
})


createItem("h_animate_corpse3", {
  loc:"hints",
  examine:function() {
    msg ("So you have found a corpse, all ready to be brought to life by some mad scientist. All you need is a spark of electricity, or more specifically a bolt of lightning. There is a reel of wire, just apply lightning to the other end.")
    this.passed = true
  },
})


createItem("h_animate_corpse4", {
  loc:"hints",
  examine:"So you have found a corpse, all ready to be brought to life by some mad scientist. All you need is a spark of electricity, or more specifically a bolt of lightning. There is a reel of wire, just apply lightning to the other end. To do that, head up, and then up again. And attach it...",
})


createItem("h_animate_corpse5", {
  loc:"hints",
  examine:"Now you have some muscle, you just need to get it to follow you.",
})


createItem("h_animate_corpse6", {
  loc:"hints",
  examine:function() {
    msg ("Patch wants to follow you, but won't. Why not?")
    this.passed = true
  },
})


createItem("h_animate_corpse7", {
  loc:"hints",
  examine:"Patch needs something on his feet. Better search around for some footwear. Big footwear.",
})


createItem("h_animate_corpse8", {
  loc:"hints",
  examine:"You need to get those boots repaired before Patch will put them on.",
})


createRoom("environment", {
})


createItem("e_room", {
  loc:"environment",
  scenery:true,
})


createItem("generic_window", {
  loc:"e_room",
  scenery:true,
  examine:function() {
      if (!typeof w.player.parent.windowsface === "string") {
        error ("ERROR: Room has no windowsface set")
      }
      if (w.player.parent.windowsface === "none") {
        Print ("The room felt rather claustrophic with no windows in it.")
      }
      else if (w.generic_window.bricked_up) {
        if (w.player.parent === this.roomsmashed || this.noted) {
          Print ("Mandy looked at the bricked up window. No way was she getting out that way.")
        }
        else {
          Print ("Mandy looked at the bricked up window. No way was she getting out that way. Wait. The window she had smashed was in the " + LCase(this.roomsmashed.byname({})) + ". Why was this window bricked up too?")
          this.noted = true
        }
      }
      else if (w.player.parent.windowsface === "north") {
        Print ("Mandy looked out the window at the countryside; fields, trees, and there was her home, a barn converstion her parents had purchased three years ago. But how could that be? No way was her home visible from this house; Highfield Lane twisted around far too much for that.")
      }
      else {
        Print ("Mandy looked out the window at the countryside; fields, trees, and there was her home, a barn converstion her parents had purchased three years ago. But how could that be? This window faced " + w.player.parent.windowsface + " and her home was to the north.")
      }
  },
})


createItem("e_outside", {
  loc:"environment",
  scenery:true,
})


createRoom("nowhere", {
  down:new Exit(""),
})


createItem("glass_shards", {
  loc:"nowhere",
  pronouns:lang.pronouns.plural,
  examine:function() {
    Print ("The shards were the remains of the window. Jagged pieces of glass, some as long as her arm, some almost too small to see.")
  },
})


createItem("glass_shard", {
  loc:"nowhere",
  scenery:true,
  examine:function() {
    Print ("Mandy carefully looked at shard of glass. Through it she could still see the countryside near her home. She turned it over, and there it was again, but from this side the view was reversed, as though seen through a mirror.")
  },
})


createItem("yellow_balloon_remains", {
  loc:"nowhere",
  pronouns:lang.pronouns.plural,
  examine:"A ragged piece of yellow rubber.",
})


createItem("patch", NPC(false), {
  loc:"nowhere",
  scenery:true,
  examine:function() {
    if (this.state === 0) {
      let s = "Mandy looked at the creature she had bought to life. It was about two and a half meters tall, and very solidly built. Patches of it were hairy, other patches were dark skined, some light skinned. Its face was not attractive, it too was a mishmash of parts. Mandy really did not want to know where all the parts came from. However, it needed a name... 'I'll call you Patch,' she said. It nodded it head, possibly in acknowledgement."
    }
    else {
      s = "Mandy looked at Patch, the creature she had bought to life. He was about two and a half meters tall, and very solidly built. Patches of him were hairy, other patches were dark skined, some light skinned. His face was not attractive, it too was a mishmash of parts. Mandy really did not want to know where all the parts came from."
    }
    if (w.boots.isAtLoc("w.patch")) {
      if (w.boots.lacedup) {
        s += " He was wearing a pair of boots, neatly laced up.")
      }
      else {
        s += " He was wearing a pair of boots, unlaced.")
      }
    }
  },
})


createRoom("zone_external", {
})


createRoom("highfield_lane", {
  loc:"zone_external",
  desc:function() {
    Print ("Mandy was standing, feeling a little anxious, on the pavement outside The House, which stood in a neatly kept garden to the east. The road continued north, through the countryside, towards her home, and then onwards to Hedlington, while southward, Highfield Lane made its way back into town.")
    if ((w.letter.parent === this) && letter.scenery) {
      msg (" ")
      Print ("She could see a letter lying on the ground.")
    }
  },
  beforeFirstEnter:function() {
  },
  east:new Exit("garden_location"),
  south:new Exit("nowhere"),
  north:new Exit("nowhere"),
  west:new Exit("mine"),
})


createItem("player", {
  loc:"highfield_lane",
  examine:"Mandy was just an ordinary 15 year old girl, with dark shoulder-length hair and a nose she felt was too big.",
})


createItem("school_bag", {
  loc:"player",
  examine:"Once more Mandy looked at her bag with disgust. She had had it since she was thirteen, when she had really been into One Direction. God, what had she been thinking? She had been asking her dad to get her a new one for like six months. It still had Zayn on it!",
})


createItem("mobile_phone", {
  loc:"school_bag",
  scenery:true,
})


createItem("pen", {
  loc:"school_bag",
})


createItem("shakespeare_book", {
  loc:"school_bag",
  examine:function() {
          if (this.state === 0 && this.byname({}) = "\"Antony and Cleopatra\"") {
            Print ("Mandy glanced at her copy of Antony and Cleopatra. She really should get around to actually reading it some time, what with an exam on it in just a few weeks.")
          }
          else {
            if (this.state === 0) {
              this.state = 1
              Print ("Mandy glanced at her copy of \"Antony and Cleopatra\". Wait, this was not the same book! This was " + this.byname({}) + ". What had happened to \"Antony and Cleopatra\"? Ms Coulter would be furious.")
            }
            else {
              Print ("Mandy looked at the book she now had. " + this.byname({}) + ". She wondered if it would be any less boring than \"Antony and Cleopatra\". Probably not worth risking finding out.")
            }
            if (w.clockwork_thespian.state > 1 && this.byname({}) === "\"Hamlet\"") {
              Print ("Then she remembered the Clockwork Thespian. The soul of wit. Hamlet, act 2, scene 2. Quickly she thumbed through. Brevity! Brevity is the soul of wit.")
              this.state = 2
              w.clockwork_thespian.state = 101
            }
          }
  },
})


createItem("folder", {
  loc:"school_bag",
  scenery:true,
})


createItem("uniform", {
  loc:"player",
  scenery:true,
  examine:function() {
        Print ("Mandy was wearing " + w.player.parent.parent.w.uniform + ".")
        if (!w.player.parent.parent === w.zone_external && not player.uniformnoted) {
          w.player.uniformnoted = true
          Print ("That was definitely not the uniform of Kyderbrook High School that she had been wearing when she had entered the house!")
        }
  },
})


createItem("letter", {
  loc:"highfield_lane",
  scenery:true,
  examine:function() {
      Print ("Mandy turned the letter over. It was addressed to \"Dr Winfield Malovich, 23 Highfield Lane, Westleigh\". <i>That must be who lives in The House,</i> she thought. Perhaps she should deliver it. She felt a lttle terrified at the thought, but that was ridiculous - it was only a house. Mrs Davenport was always saying you should confront your fears head-on in Personal Development lessons.")
      this.addressread = true
  },
})


createItem("house", {
  loc:"highfield_lane",
  scenery:true,
  examine:"Mandy could never decide what was so sinister about the house. It was two stories high, a door in the centre of the lower floor, with bay windows either side, typical of many middle-class houses built aroud the turn of the century.",
})


createItem("other_houses", {
  loc:"highfield_lane",
  scenery:true,
  examine:"The other houses on the steet looked just like number 23. Just... not evil.",
})


createRoom("garden_location", {
  loc:"zone_external",
  desc:function() {
    Print ("The garden was simple, but well maintained. A gravel path curved from the road, to the west, to The House, to the east. On either side, the lawn was lush and well-trimmed. The garden was bordered by a hedge to north and south. To the west there were rose bushes, though Mandy had never seen them have flowers.")
    if (w.door.isopen) {
      if (exit_to_house.knocked) {
        let s = "Mandy was sure it had been closed when she had knocked on it."
      }
      else {
        s = "Had it been open when she first looked? Mandy could not remember."
      }
      Print ("The door to the house was open. " + s + " Her heart was starting to pound. She could not decide if this was a good idea or not.")
      this.flag = true
    }
  },
  west:new Exit("highfield_lane"),
  east:new Exit("front_hall"),
})


createItem("door", {
  loc:"garden_location",
  scenery:true,
  examine:function() {
      let s = "The door was tall, and made of panelled wood painted black, set into a white doorframe with a transom above."
      if (w.door.isopen) {
        s += " It stood open, inviting..."
      }
      P (s)
  },
})


createItem("s_roses", {
  loc:"zone_external",
  scenery:true,
  examine:"The only reason Mandy knew they were roses was that they were prickly. Her grandmother had some, and they had the same prickles - a bit like a sharkfin. Unlike these, her grandmother's rose blossomed every year.",
})


createItem("s_path", {
  loc:"zone_external",
  scenery:true,
  examine:"The gravel path curved gently to the right, then back to the left up to the front door.",
})


createItem("s_road", {
  loc:"zone_external",
  scenery:true,
  examine:"The road was tarmacked with pavements either side - like pretty much every road in Westleigh.",
})


createItem("s_pavement", {
  loc:"zone_external",
  scenery:true,
  examine:"The pavement was set with flagstones. At one time - not so many years ago - Mandy would would studiously avoid the cracks between the flags. She was too old for that now, of course.",
})


createItem("s_grass", {
  loc:"zone_external",
  scenery:true,
  examine:"The grass was green, and proverbially boring to watch grow.",
})


createItem("transom", {
  loc:"zone_external",
  scenery:true,
  examine:"The transom was a low, but wide window is a half-oval shape, above the door. The glass was dirty, but it was too high up to see though anyway.",
})


createRoom("zone_victorian", {
})


createRoom("front_hall", {
  loc:"zone_victorian",
  scenery:true,
  desc:function() {
    Print ("The hall was bigger than Mandy had expected, quite an impressive room really. There were doors to the north and south, while the east wall displayed a number of painting. The walls and ceiling were panelled with dark wood, the foor was tiled in a geometric design that was vaguely unnerving.")
  },
  afterFirstEnter:function() {
    msg (" ")
    Print ("The door slammed shut, making Mandy jump.")
    w.h_gettheletter.passed = true
  },
  west:new Exit("garden_location"),
  north:new Exit("brass_dining_room"),
  south:new Exit("gallery"),
})


createItem("front_hall_floor", {
  loc:"front_hall",
  scenery:true,
  examine:function() {
      Print ("The design on the floor was like one of those pictures Mandy's father liked; if you stared at it in just the right way a three-dimensional image emerged. Mandy was not sure why, but she really did not want to see that image.")
  },
})


createItem("inside_door", {
  loc:"front_hall",
  scenery:true,
  examine:"Mandy tried the door; it was definitely locked shut.",
})


createItem("paintings", {
  loc:"front_hall",
  scenery:true,
  pronouns:lang.pronouns.plural,
  examine:"There were five paints on the back wall, all portraits. To the left, an elderly gentleman, a little plump, in military attire. Next to him, a lady in a blue dress. The central portrait was a youngish man in academic attire; a mortar and gown. Next to him, another lady, perhaps in her thirties, and on the far right, a rather dapper young man in a burgundy suit.",
})


createRoom("brass_dining_room", {
  loc:"zone_victorian",
  scenery:true,
  desc:function() {
    let s = "This room was dominated by an elegant, dark wood table, well polished, with brass legs shaped like a lion's, and laid out with eight dinner settings. Eight chairs, in matching style, surrounded it.  At the table, "
    msg (" ")
    if (this.mannequin_count < 9) {
      s += toWords(this.mannequin_count) + " mannequins were sat, dressed up in clothes and wig."
    }
    else if (this.mannequin_count === 9) {
      s += "eight mannequins were sat, dressed up in clothes and wig; a nineth was stood behind one of the chairs."
    }
    else {
      s += "eight mannequins were sat, dressed up in clothes and wig; " + ToWords(this.mannequin_count - 8) + " more were was stood as though waiting to take their place."
    }
    s += " The north wall had a window, with dark wood cabinets on either side, and there were doors to the east, south and west."
    P (s)
  },
  beforeEnter:function() {
    this.mannequin_count += 1
  },
  afterEnter:function() {
  },
  afterFirstEnter:function() {
    if (!w.front_hall.notedasweird) {
      Print ("That's weird, thought Mandy, there should be a window in the west wall, looking towards the street. Where could the door possibly go?")
      w.front_hall.notedasweird = true
    }
  },
  south:new Exit("gallery"),
  west:new Exit("great_hall"),
  east:new Exit("steam_corridor"),
  north:new Exit("some_gothic_room"),
})


createItem("mannequins", {
  loc:"brass_dining_room",
  scenery:true,
  examine:"Mandy looked closer at the mannequins. Their skin was a speckled grey, that felt cool to the touch, and sounded like wood when knocked. Their faces were only half formed; slight depressed to suggest eyes, a vague nose, but no mouth.",
})


createItem("clock", SURFACE(open), {
  loc:"brass_dining_room",
  scenery:true,
  examine:function() {
          s = "This was a large, old-fashioned clock. A dark wood case housed the ticking mechanism. Roman numerals ran round the clock face, "
      if (typeof this.lookturn === "number") {
        if (this.lookturn > (game.turn - 10)) {
          s += "which indicated the time was now twenty past nine."
          break
        else {
          s += "which indicated the time was still twenty past nine. It was ticking, so had clearly not stopped; why was the time not changing?"
        }
      }
      else {
        s += "which indicated the time was now twenty past nine. That was so wrong, Mandy could not decide if it was slow or fast."
        this.lookturn = game.turn
      }
      if (w.large_key.isAtLoc("this")) {
        s += " Mandy could see the key for winding the clock up was in the side of the clock."
      }
      Print (s)
  },
})


createItem("large_key", {
  loc:"clock",
  scenery:true,
})


createItem("vic_chair", {
  loc:"brass_dining_room",
  scenery:true,
  examine:"The chair was made of dark wood, with a high back and a padded seat.",
})


createItem("vic_table", {
  loc:"brass_dining_room",
  examine:"The table was made of the same dark wood as the chairs.",
})


createRoom("theatre", {
  loc:"zone_victorian",
  scenery:true,
  desc:"This was a large room, with perhaps two dozen chairs arranged facing a pair of curtains - presumably hiding a stage - to the west. The lower half of the walls were wood panelled, while the upper walls were painted a yellow-brown.",
  afterEnter:function() {
  },
  west:new Exit("theatre_stage"),
  east:new Exit("gallery"),
})


createRoom("theatre_stage", {
  loc:"zone_victorian",
  scenery:true,
  desc:function() {
    Print ("This is even smaller than the stage at Kyderbrook, thought Mandy. There was barely room for both her and the inanimate figure stood to the side. The only way to go was back through the curtains to the south.")
  },
  beforeFirstEnter:function() {
    Print ("Mandy pushed the curtain aside and looked beyond. She was startled for a moment to see a figure there, but it was quite inanimate.")
    msg (" ")
  },
  east:new Exit("theatre"),
})


createItem("clockwork_thespian", {
  loc:"theatre_stage",
  examine:function() {
      if (w.clockwork_thespian.state === 0) {
        Print ("The figure seemed to have been manufactured to resemble a man of impressive proportions, in height, but also in the girth of his chest. And its groin too, Mandy noticed with a wry smile. It, or he, was constructed of brass, and looked to be jointed. He was clothed in a frilly off-white shirt, and dark baggy trousers, as well as a floppy hat. Mandy noticed there was a hole in the back of his shirt, and a corresponding hole in his back, where a simple, if large, key might fit.")
      }
      else {
        Print ("The clockwork thespian seemed to have been manufactured to resemble a man of impressive proportions, in height, but also in the girth of his chest. And his groin too, Mandy noticed with a wry smile. He was constructed of brass, and looked to be jointed. He was clothed in a frilly off-white shirt, and dark baggy trousers, as well as a floppy hat.")
      }
  },
})


createRoom("gallery", {
  loc:"zone_victorian",
  scenery:true,
  desc:"Mandy was stood at the end of a long gallery running south. There were doors west, east and north. A small table had a chessboard on it, and there were painting down the two long walls.",
  afterFirstEnter:function() {
    if (!w.front_hall.notedasweird) {
      msg (" ")
      Print ("That's weird, thought Mandy, surely the door to the west would go back into the garden? And this room was so long, surely the house was not this wide...")
      w.front_hall.notedasweird = true
    }
  },
  north:new Exit("brass_dining_room"),
  west:new Exit("theatre"),
  south:new Exit("gallery_south"),
  east:new Exit("room_big"),
})


createItem("gallery_n_paintings", {
  loc:"gallery",
  scenery:true,
  examine:"The paintings were all oil on canvas, and to Mandy's inexpert eye the same style, though they varied in subject matter. Several were portraits, but there was a Greek temple, a huge painting of a sea battle and beautiful sunset.",
})


createItem("chessset", {
  loc:"gallery",
  scenery:true,
  examine:"The chess board was set into the small table, sixty four squares of ivory and mahogany, in a circular top. The board was in mid-game, and half a dozen pieces had already been taken, mostly white's. Mandy tried to pick up one of taken pawns, and found she could not - it seemed to be glued to the table. She tried a couple more pieces - they all seemed very solidly in place.",
})


createItem("chess_pieces", {
  loc:"gallery",
  scenery:true,
  examine:"The chess pieces were all wooden and exquisitely carved. The queen looked like a warrior woman in armour, the pawns held pikes. White pieces seemed to be carved from ivory, whilst black were wooden, but they were otherwise identical.",
})


createItem("white_knight", {
  loc:"gallery",
  scenery:true,
  examine:function() {
      if (this.active) {
        Print ("Mandy looked at the white knight. She had not spotted there was only one, perhaps that was why white was losing.")
      }
      else {
        Print ("The chess pieces were all wooden and exquisitely carved. The queen looked like a warrior woman in armour, the pawns held pikes. White pieces seemed to be carved from ivory, whilst black were wooden, but they were otherwise identical.")
      }
  },
})


createRoom("gallery_south", {
  loc:"zone_victorian",
  scenery:true,
  desc:"The south end of the gallery was much like the north, with more paintings on the long walls. There was a door at the south end, and also a door to the east.",
  north:new Exit("gallery"),
  east:new Exit("room_small"),
  south:new Exit("some_gothic_room"),
})


createItem("gallery_s_paintings", {
  loc:"gallery_south",
  scenery:true,
  examine:"The most striking of the paintings was a family portrait, which must have been about life size, despite the subjects being painted full length. Mandy could see a father, in suit and top hat, and a mother, together with three young children.",
})


createRoom("room_big", {
  loc:"zone_victorian",
  scenery:true,
  desc:function() {
    let s = "The drawing room was rather well appointed with wood paneling on the walls, and an ornate ceiling. A window to the east had portraits on either side, whilst the fireplace to the south had a painting of a battle above the mantleplace."
    if (w.mahogany_cabinet.moved) {
      s += " The mahogany cabinet had been pulled out from the north wall."
    }
    else {
      s += " There was a mahogany cabinet on the north wall."
    }
    Print (s)
  },
  beforeEnter:function() {
    foreach (itm, GetDirectChildren(w.room_small)) {
      if (DoesInherit(itm, "sizechangeobject")) {
        itm.shrink()
        itm.parent = this
      }
    }
    foreach (itm, GetDirectChildren(w.drawing_room_south)) {
      if (DoesInherit(itm, "sizechangeobject")) {
        itm.shrink()
        itm.parent = this
      }
    }
    foreach (itm, GetDirectChildren(w.drawing_room_north)) {
      if (DoesInherit(itm, "sizechangeobject")) {
        itm.shrink()
        itm.parent = this
      }
    }
  },
  west:new Exit("gallery"),
  north:new Exit("nowhere"),
})


createItem("mahogany_cabinet", {
  loc:"room_big",
  scenery:true,
  examine:function() {
      let s = "The mahogany cabinet looked like it came straight out of \"Antiques Roadshow\". Two doors at the front, a curious section on top at the back with four small draws that looks suggestive of a castle wall, with towers at each end."
      if (w.mahogany_cabinet.moved) {
        s += " It was standing a little way from the wall and Mandy could just see a hole in the wall behind it a few inches across."
      }
      P (s)
  },
})


createItem("small_rug", {
  loc:"room_big",
  scenery:true,
  examine:"The rug had a depiction of two overs kissing, with a geometric pattern around the edge.",
})


createRoom("room_small", {
  loc:"zone_victorian",
  scenery:true,
  desc:"This was a drawing room of immense size. Perhaps a hundred meters above her, Mandy could see the ornate ceiling. The walls, panelled in wood, stretched an even greater distance. Huge painting, way about Mandy's head, hung from the walls. In the centre of the room was a thick rug, about the size of a football pitch. The pile was so great, it would stop Mandy going across it. She could, however go round the sides, to the northeast or southeast. The door to the west looked very much out of place, being normal height in such a huge wall.",
  beforeEnter:function() {
    foreach (itm, GetDirectChildren(w.room_big)) {
      if (DoesInherit(itm, "sizechangeobject")) {
        itm.grow()
        if (itm.dest === "north") {
          itm.parent = w.drawing_room_north
        }
        else if (itm.dest === "south") {
          itm.parent = w.drawing_room_south
        }
        else {
          itm.parent = this
        }
      }
    }
  },
  west:new Exit("gallery_south"),
  northeast:new Exit("drawing_room_north"),
  southeast:new Exit("drawing_room_south"),
})


createRoom("drawing_room_south", {
  loc:"zone_victorian",
  scenery:true,
  beforeEnter:function() {
    if (w.boots.parent === this && boots.size = 1) {
      exit_in_to_boots.visible = true
    }
    else {
      exit_in_to_boots.visible = false
    }
  },
  northwest:new Exit("room_small"),
  in:new Exit("boots"),
})


createRoom("drawing_room_north", {
  loc:"zone_victorian",
  scenery:true,
  desc:function() {
    let s = "Mandy was stood on a narrow strip of wooden floor, between the colossal wall to the north, and the forest-like carpet to the south. To the east, the rug was flush against the wall, so that was not an option, but she could head south west, back to the door."
    if (w.mahogany_cabinet.moved) {
      s += " Above her towered a huge mahogany cabinet, standing proud of the wall. Behind it, to the north, was a large hole in the otherwise perfect wall."
    }
    else {
      s += " Above her towered a huge mahogany cabinet, standing against the wall. Peering behind it, at the gap above the skirting board, Mandy thought there might be a hole in the wall."
    }
    Print (s)
  },
  southwest:new Exit("room_small"),
  north:new Exit("secret_room"),
})


createItem("huge_cabinet", {
  loc:"drawing_room_north",
  scenery:true,
  examine:function() {
      let s = "The mahogany cabinet towered over Mandy; it had to be higher than the science block at Kyderbrook High."
      if (w.mahogany_cabinet.moved) {
        s += " It was standing a little way from the wall - like about 10 foot - and Mandy could see a hole in the wall behind it."
      }
      else {
        s += " Mandy could just see a hole in the wall behind it."
      }
      P (s)
  },
})


createRoom("secret_room", {
  loc:"zone_victorian",
  scenery:true,
  desc:function() {
    let s = "After the opulence of the other roooms, this one was decidedly bare - but at least it of reasonable proportions. More or less square, the walls were white, or had been  at one time. The floor and ceiling were wood."
    if (!w.boots.pickedup) {
      s += " The only feature of note was a large pair of boots in one corner."
    }
    P (s)
  },
  south:new Exit("drawing_room_north"),
})


createItem("boots", {
  loc:"secret_room",
  scenery:true,
  examine:function() {
      switch (this.size) {
        case 0:
          let s = (this.intdesc)
          break
        case -1:
          s = (this.smalldesc)
          break
        case 1:
          s = (this.bigdesc)
          break
        case -2:
          s = (this.vsmalldesc)
          break
        case 2:
          s = (this.vbigdesc)
          break
        default:
          if (this.size > 0) {
            s = ("The " + LCase(this.byname({})) + " was of gigantic proportions!")
            break
          else {
            s = ("The " + LCase(this.byname({})) + " was too tiny to see properly.")
          }
        }
      }
      if (!this.mended) {
        s += " The left boot was in a sorry, with a large hole in the sole."
      }
      else {
        s += " The tiny man had done a good job mending the left boot, Mandy could hardly see where the hole had been."
      }
      P (s)
  },
  out:new Exit("drawing_room_south"),
})


createItem("victorian_floor", {
  loc:"zone_victorian",
  scenery:true,
  examine:"The floor was wooden, and well-polished.",
})


createItem("victorian_walls", {
  loc:"zone_victorian",
  scenery:true,
  examine:"The walls were all panelled in wood.",
})


createItem("victorian_ceiling", {
  loc:"zone_victorian",
  scenery:true,
  examine:function() {
    if (w.player.stoodon === null) {
      Print ("The ceiling was white, with simple decorations along each side.")
    }
    else {
      Print ("The ceiling turned out to be no more interesting from up here. Mandy wondered why she had bothered stabding on the " + w.player.stoodon.byname({}) + ".")
    }
  },
})


createItem("floor", {
  loc:"zone_victorian",
  scenery:true,
  examine:"Mandy was not quite sure what it was about the tiles. They did not depict a demon or murder or anything really; they just had a strange effect on her eyes that was... disturbing.",
})


createRoom("zone_flora", {
})


createItem("flora_floor", {
  loc:"zone_flora",
  scenery:true,
  examine:"The floor was a lattice of wrought iron, painted white, and flaking in a few places.",
})


createItem("flora_walls", {
  loc:"zone_flora",
  examine:"The walls were windows, in white frames.",
})


createItem("flora_ceiling", {
  loc:"zone_flora",
  scenery:true,
  examine:"The walls arched over to form the ceiling.",
})


createRoom("greenhouse_west", {
  loc:"zone_flora",
  scenery:true,
  west:new Exit("steam_hall"),
  east:new Exit("greenhouse_east"),
})


createRoom("greenhouse_east", {
  loc:"zone_flora",
  scenery:true,
  west:new Exit("greenhouse_west"),
  east:new Exit("great_hall"),
})


createRoom("greenhouse_catwalk_west", {
  loc:"zone_flora",
  scenery:true,
  west:new Exit("upper_steam_hall"),
  east:new Exit("greenhouse_catwalk_east"),
})


createRoom("greenhouse_catwalk_east", {
  loc:"zone_flora",
  scenery:true,
  west:new Exit("greenhouse_catwalk_west"),
  east:new Exit("great_gallery"),
})


createRoom("zone_central", {
})


createItem("central_floor", {
  loc:"zone_central",
  scenery:true,
  examine:"The floor was wooden, and well-polished.",
})


createItem("central_walls", {
  loc:"zone_central",
  scenery:true,
  examine:"The walls were all panelled in wood.",
})


createItem("central_ceiling", {
  loc:"zone_central",
  examine:"The ceiling was white, with simple decorations along each side.",
})


createRoom("central_control", {
  loc:"zone_central",
  scenery:true,
  west:new Exit("some_gothic_room"),
})


createItem("winfield_malovich", {
  loc:"central_control",
})


createItem("wm_hello", TOPIC(true), {
  loc:"winfield_malovich",
  runscript:function() {
    msg("");
    msg("'Who are you?' Mandy asked the man at te desk.");
    msg("");
    msg("'Me? I'm Winfield Malovich. This is my house. Who are you?'");
    msg("");
    msg("'I was just passing the house.. and I kind of got trapped here.'");
    msg("");
    msg("'<i>Story of my life</i>! This was my house once,' he said. 'I built the analytical machine you see before you. Now, well, I think it belongs to itself now. You can talk to it, you know. Only thing that keeps me sane, oh the <i>midnight memories</i> we've shared.' Mandy felt unconvinced it had kept him sane.");

            this.songlist = Split("Story of my life|Midnight memories", "|")
          
  },
})


createItem("wm_what_happened", TOPIC(false), {
  loc:"winfield_malovich",
  runscript:function() {
    msg("");
    msg("'What... happened?'");
    msg("");
    msg("'It came alive. My fault really. I suppose there really are things that man should not mess with.'");
    msg("");
    msg("'Bullshit. What about iPods and Facebook and XBox; where would they be if mankind took that attitude?'");
    msg("");
    msg("'I... have no idea what you are talking about.'");
    msg("");
    msg("'No, you don't, which is kind the point really. So just tell me what happened.'");
    msg("");
    msg("'It got sick. The silvers, I don't know where they came from, but they infected it like a virus. They wanted to infect other houses, <i>more than this</i> one.");

            list add (this.songlist, "More than this")
            if (analytical_engine.state = 1) {
              do (wm_same_question, "show")
            }
          
  },
})


createItem("wm_no_way_out", TOPIC(false), {
  loc:"winfield_malovich",
  runscript:function() {
    msg("");
    msg("'Is there no way out?'");
    msg("");
    msg("'None. The walls might as well be made of <i>steel, my girl</i>.'");

            list add (this.songlist, "Steal my girl")
          
  },
})


createItem("wm_same_question", TOPIC(false), {
  loc:"winfield_malovich",
  runscript:function() {
    msg("");
    msg("'It keeps asking the same question. What direction?'");
    msg("");
    msg("'I'm sorry, I can't help you. I rather think it's <i>gotta be you</i>, you see. You have to solve this <i>one thing</i>.'");

            list add (this.songlist, "Gotta be you")
            list add (this.songlist, "One thing")
          
  },
})


createItem("wm_i_dont_know", TOPIC(false), {
  loc:"winfield_malovich",
  runscript:function() {
    msg("");
    msg("'I don't know what to do!'");
    msg("");
    msg("'Well, you have to do it, <i>one way or another</i>. Otherwise <i>you and I</i> are here for a very long time.'");

            list add (this.songlist, "One way or another")
            list add (this.songlist, "You and I")
          
  },
})


createItem("wm_i_will_think", TOPIC(false), {
  loc:"winfield_malovich",
  runscript:function() {
    msg("");
    msg("'I'll have a good think.'");
    msg("");
    msg("'Don't take too long. The <i>night changes</i> things around. And not for the better. Some nights the silvers try to <i>drag me down</i> to their lair; oh, you need your wits about you once it gets dark.'");

            list add (this.songlist, "Night changes")
            list add (this.songlist, "Drag me down")
          
  },
})


createItem("wm_how_long", TOPIC(false), {
  loc:"winfield_malovich",
  runscript:function() {
    msg("");
    msg("'How long have you been here?'");
    msg("");
    msg("'A long time. It feels like several years, but I suspect considerably longer has passed on the outside.Your mode of dress looks quite alien to me, for <i>one thing</i<>; the colours are garnish, the thread I cannot guess at. <i>More than this</i>, your hemline is, well, it would be considered scandalous in 1911. And yet I suppose they are common in your time?'");
    msg("");
    msg("Mandy glaned down at her uniform, now inexplicably red and hot pink. 'I was wearing grey and navy when I entered the house. But yeah, its 2016.'");
    msg("");
    msg("'Over a hundred years...'");

            list add (this.songlist, "One thing")
            list add (this.songlist, "More than this")
          
  },
})


createItem("wm_1911", TOPIC(false), {
  loc:"winfield_malovich",
  runscript:function() {
    msg("");
    msg("'You have been here since 1911?'");
    msg("");
    msg("'The King was due to have his Delhi Durbar in a few weeks.'");
    msg("");
    msg("'Er, which king was that?'");
    msg("");
    msg("'George V. I suppose he is just <history</i> to you. Who's king now?'");
    msg("");
    msg("'Queen. Queen Elizabeth II.'");
    msg("");
    msg("'A queen? Jolly good. England became great under Queen Victoria.'");
  },
})


createItem("wm_what_happened7", TOPIC(false), {
  loc:"winfield_malovich",
})


createItem("analytical_engine", {
  loc:"central_control",
})


createRoom("zone_medieval", {
})


createItem("medieval_floor", {
  loc:"zone_medieval",
  scenery:true,
  examine:"The floor was rough wood.",
})


createItem("medieval_walls", {
  loc:"zone_medieval",
  scenery:true,
  examine:"The walls were all rough-cut stone.",
})


createItem("medieval_ceiling", {
  loc:"zone_medieval",
  scenery:true,
  examine:"The ceiling was wood, like the floor, supported by thick beams.",
})


createRoom("great_gallery", {
  loc:"zone_medieval",
  scenery:true,
  desc:"The great gallery was a wooden platform that overlooked the great hall. A flight of wooden stairs led back down to the hall, while a narrow spiral staircase led further upwards. The walls were of rough cut stone, and the window to the east was small and arched. Doorways led south and west.",
  down:new Exit("great_hall"),
  south:new Exit("solar"),
  up:new Exit("observatory"),
  west:new Exit("greenhouse_catwalk_east"),
})


createRoom("great_hall", {
  loc:"zone_medieval",
  scenery:true,
  desc:"The great hall was an impressive size. It looked older than the rest of the house, a lot older, being built of rough cut stone. There were doors to east and west, and a wooden staircase led up to a wooden gallery that ran along the west side of the hall. To the south, a doorway led to a flight of steps heading downwards.",
  east:new Exit("brass_dining_room"),
  up:new Exit("great_gallery"),
  down:new Exit("alchemy_lab"),
  south:new Exit("alchemy_lab"),
  west:new Exit("greenhouse_east"),
})


createRoom("alchemy_lab", {
  loc:"zone_medieval",
  scenery:true,
  desc:function() {
    let s = "This appeared to be some kind of laboratory, though nothing like the ones at school. While they had their own distinctive smell, this room was altogether worse,with an almost over-powering smell of rotten eggs. Visually, the room was dominated by a very solid wooden bench"
    if (w.patchwork_body.isAtLoc("this")) {
      if (w.patchwork_body.state === 0) {
        s += ", with a corpse on it; was it there to be dissected?"
      }
      else {
        s += ", with a patchwork body on it."
      }
      s += " The body was connected to some strange device stood at the head of the table by a number of thick wires."
    }
    else {
      s += ". At one end of the bench a strange device stood with wires dangling from it."
    }
    if ((w.reel.parent === this) && reel.scenery) {
      s += " A reel of wire sat on the floor, one end attached to the device")
    }
    s += " A shelf held a bizarre hotch-potch of glassware on it. A layer of dust suggested it had not been used for some time. Above the table, a crocodile was suspended."
    Print (s)
  },
  afterFirstEnter:function() {
    w.h_find_animate_corpse.passed = true
  },
  up:new Exit("great_hall"),
  north:new Exit("great_hall"),
})


createItem("reel", {
  loc:"alchemy_lab",
  examine:function() {
      let s = "The wire was about a millimeter thick, and "
      if (this.count === 0) {
        s += "she guessed there was over twenty meters of wire, the end of which was soldered to the side of the machine at the head of the table on the wall. The spindle was also made of metal."
      }
      else if (this.count === 1) {
        s += "she guessed there was about twenty meters of wire on the spindle (which was also metal), and more heading down the stairs to the laboratory."
      }
      else if (this.count === 1 && w.player.parent = w.great_gallery) {
        s += "she guessed there was about fifteen meters of wire on the spindle (which was also metal), and more dropping down to the hall below and heading down the stairs to the laboratory."
      }
      else if (this.count === 5) {
        s += "now it had run out she could see this end was soldered to the spindle, which was also metal."
      }
      else {
        s += "she guessed there was about " + (25 - 5 * this.count) + " meters of wire on the spindle (which was also metal), and more heading elsewhere."
      }
      Print (s)
      this.lookedat = true
  },
})


createItem("stuffed_crocodile", {
  loc:"alchemy_lab",
  scenery:true,
  examine:"The crocodile was a little over a meter long, and hanging from the ceiling on four wires. It looked like it was stuffed, and it was kind of creeping imagining that once it had been alive.",
})


createItem("alchemy_bench", {
  loc:"alchemy_lab",
  examine:"The wood of the bench had black rings and circles scorched into it, testament to years of use. Or perhaps week of use by an inept experimenter, Mandy mused.",
})


createItem("scorch_marks", {
  loc:"alchemy_lab",
  scenery:true,
  examine:"Mandy could not tell if the scorch marks were caused by heat or acid.",
})


createItem("glass_apparatus", {
  loc:"alchemy_lab",
  scenery:true,
  examine:"Mandy took a better look at the glass apparatus. Mr Turnbill had once set up a distillation in chemistry, and she tried to remember what it had looked like it. She had a feeling nothing like this, but she seemed to remember spending the lesson passing notes to Finley O'Donnell, trying to convince him that Claire Grossman fancied him.",
})


createItem("patchwork_body", {
  loc:"alchemy_lab",
  examine:function() {
      this.state = 1
      Print ("Mandy gingerly inspected the corpse on the table. It was naked, but nothing to suggest it was either male or female. As she looked closer, she could see stitch marks, and with a growing sense of nausea, she relaised it was not a corpse, but the stitched together parts of several corpses.")
  },
})


createItem("alchemy_device", {
  loc:"alchemy_lab",
  examine:function() {
      let s = "The machine at the head of the table was about a meter and a half tall, a wooden cabinet, with  brass fittings. On the front were a series of dials and knobs. "
      if (w.patchwork_body.isAtLoc("w.alchemy_lab")) {
        s += "About a dozen wires ran from the machine to the body, each attached to its own brass bolt on the machine, and to a clip on the body."
      }
      else {
        s += "About a dozen wires hung down from the machine, each attached to its own brass bolt on the machine."
      }
      Print (s)
  },
})


createRoom("observatory", {
  loc:"zone_medieval",
  scenery:true,
  desc:"The room was dominated, filled even, by a telescope and its supporting mechanism, which was not difficult, as the room was not big. There were some controls on the wall, and the only exit was the stairs she had just come up.{if telescope.roofopen: A section of roof was open on the west side of the dome.}",
  down:new Exit("great_gallery"),
  up:new Exit("observatory_up"),
  climb:new Exit("observatory_up"),
})


createItem("telescope", {
  loc:"observatory",
  scenery:true,
  examine:function() {
      let s = "The telescope itself was about two meters long. It was held in place by a complicated mechanism, involving cogs and gears, and the whole thing was made of brass, giving it a strange beauty."
      switch (w.left_wheel.state) {
        case 1:
          s += " It was currently almost vertically,"
          break
        case 3:
          s += " It was currently angled about thirty degrees above the horizontal,"
          break
        default:
          s += " It was currently angled about sixty degrees above the horizontal,"
          break
      }
      switch (w.middle_wheel.state) {
        case 0:
          s += " and pointing to the east."
          break
        case 1:
          s += " and pointing southward."
          break
        case 2:
          s += " and pointing westward."
          break
        case 3:
          s += " and pointing northward."
          break
        case 4:
          s += " and pointing eastward."
          break
      }
      Print (s)
  },
})


createItem("left_wheel", {
  loc:"observatory",
  scenery:true,
  examine:"The left wheel was about seven centimeters across, and made of brass.",
})


createItem("middle_wheel", {
  loc:"observatory",
  scenery:true,
  examine:"The midde wheel was about seven centimeters across, and made of brass.",
})


createItem("right_wheel", {
  loc:"observatory",
  scenery:true,
  examine:"The right wheel was about seven centimeters across, and made of brass.",
})


createItem("controls", {
  loc:"observatory",
  scenery:true,
  examine:"The controls comsisted of three wheels, one on the left, one in the middle, one on the right, set into a panel, all in brass.",
})


createRoom("solar", {
  loc:"zone_medieval",
  scenery:true,
  desc:"The solar. Mandy knew the name from history class; this is where the lord of the castle would sleep. None to comfoortable to Mandy's eyes, but possibly the height of luxury a thousand years ago. A large bed, crudely built of wood, a tapestry hung from one wall, a chamber pot under the bed.",
  north:new Exit("great_gallery"),
})


createItem("solar_bed", {
  loc:"solar",
})


createItem("solar_tapestry", {
  loc:"solar",
})


createItem("chamber_pot", {
  loc:"solar",
})


createRoom("observatory_up", {
  loc:"zone_medieval",
  desc:function() {
    let s = "Mandy was stood on the top of the mechanism that supported the telescope. "
    if (w.telescope.roofopen) {
      s += "If she reached, she could probably pull herself up onto the roof from her, she thought."
    }
    else {
      s += "If she reached, she could probably touch the ceiling from her, she thought."
    }
    Print (s)
  },
  up:new Exit("roof_location"),
  down:new Exit("observatory"),
  climb:new Exit("roof_location"),
})


createItem("ceiling", {
  loc:"observatory_up",
  scenery:true,
})


createItem("telescope_up", {
  loc:"observatory_up",
  scenery:true,
  examine:"From here, with her arms and legs wrapped around it, the telescope was a brass cylinder of security to cling to.",
})


createRoom("roof_location", {
  loc:"zone_medieval",
  scenery:true,
  desc:"The roof was a metal dome, made of eight sections, about three meters of each side, and did not offer as much grip as Mandy would have liked. The only way down was back through the opening. At the apex there was a black metal spike, pointing skywards. Below her, Mandy could see the house, but it was hard to properly make out, kind of like it was misty, but not quite. It looked a long way down - how could she be so high up, it was only a two story house! Further a field she could see the town of Westleigh to the south.",
  beforeFirstEnter:function() {
    Print ("At last Mandy was outside! And about a hundred meters up...")
  },
  beforeEnter:function() {
  },
  afterFirstEnter:function() {
    Print ("As she looked harder, she realised she could not see the Ash Tree Estate, instead there were only fields. Perhaps no bad thing, she thought, but then she noticed that there was no modern housing at all. This was what the town had looked like before the war.")
  },
  down:new Exit("observatory_up"),
})


createItem("roof", {
  loc:"roof_location",
  scenery:true,
  examine:"The roof was an octagonal pyramid, covered in slates, which made no sense giving the inside was a metal dome, but Mandy was getting used to that. The opening in the dome was an oddly-shaped skylight from this side. At the apex of the roof was a metal spike.",
})


createItem("spike", {
  loc:"roof_location",
  scenery:true,
  examine:function() {
      if (this.wireattached) {
        Print ("The spike was made of black metal, and was straight apart from a single loop, to which a wire was attached.")
      }
      else {
        Print ("The spike was made of black metal, and was straight apart from a single loop.")
      }
  },
})


createItem("sky", {
  loc:"roof_location",
  scenery:true,
  examine:function() {
      switch (this.state) {
        case 0:
          Print ("The sky was blue, with the odd fluffy cloud.")
          break
        case 1:
          Print ("The sky was blue, with the odd fluffy cloud.")
          break
        case 2:
          Print ("Mandy looked at the sky. There were definitely more clouds.")
          break
        case 3:
          Print ("It was pretty cloudy now, Mandy noticed.")
          break
        case 4:
          Print ("The clouds were a dirty dark grey.")
          break
        case 5:
          Print ("The dark clouds threatened rain at any moment.")
          break
        default:
          Print ("The sky was looking thundery.")
          break
      }
  },
})


createRoom("zone_steampunk", {
})


createItem("steampunk_floor", {
  loc:"zone_steampunk",
  scenery:true,
  examine:"The floor was wooden, and well-polished.",
})


createItem("steampunk_walls", {
  loc:"zone_steampunk",
  scenery:true,
  examine:"The walls were all panelled in wood.",
})


createItem("steampunk_ceiling", {
  loc:"zone_steampunk",
  scenery:true,
  examine:"The ceiling was white, with simple decorations along each edge.",
})


createRoom("steam_hall", {
  loc:"zone_steampunk",
  scenery:true,
  south:new Exit("lift"),
  west:new Exit("steam_corridor"),
  east:new Exit("greenhouse_west"),
})


createRoom("lower_steam_hall", {
  loc:"zone_steampunk",
  scenery:true,
  south:new Exit("lift"),
  east:new Exit("mine"),
})


createItem("giant_spider", {
  loc:"lower_steam_hall",
  examine:"The giant spider was big, black and hairy. It was a couple of meters across, and each of it five eyes were staring at Mandy. And it was holding a shovel.",
})


createRoom("steam_corridor", {
  loc:"zone_steampunk",
  scenery:true,
  east:new Exit("steam_hall"),
  west:new Exit("brass_dining_room"),
})


createRoom("upper_steam_hall", {
  loc:"zone_steampunk",
  scenery:true,
  south:new Exit("lift"),
  west:new Exit("nursery"),
  east:new Exit("greenhouse_catwalk_west"),
})


createRoom("lift", {
  loc:"zone_steampunk",
  scenery:true,
  north:new Exit("steam_hall"),
})


createItem("top_lift_button", {
  loc:"lift",
  scenery:true,
})


createItem("middle_lift_button", {
  loc:"lift",
})


createItem("bottom_lift_button", {
  loc:"lift",
})


createRoom("nursery", {
  loc:"zone_steampunk",
  scenery:true,
  desc:"This seemed to be a nursery, or at least what a nursery might have looked like a century ago. Two china dolls were stood on a chair, and there was a dolls house near them. A cream-painted cot stood near the window.",
  beforeEnter:function() {
  },
  afterEnter:function() {
    // If the balloon is here
    if (w.yellow_balloon.isAtLoc("w.nursery")) {
      // each toime she goes in the room is apparently the first
      // reset the count
      // record every item she is holding, && every item in her bag, and every item in the room
      Print ("Mandy noticed a yellow balloon gently floating down from the ceiling, near the centre of the room.")
      w.nursery.count = 0
      const game.nurseryheld = []()
      foreach (itm, GetDirectChildren(w.player)) {
        game.nurseryheld.push(itm)
      }
      const game.nurserybag = []()
      foreach (itm, GetDirectChildren(w.school_bag)) {
        game.nurserybag.push(itm)
      }
      const game.nurseryfloor = []()
      foreach (itm, GetDirectChildren(w.nursery)) {
        game.nurseryfloor.push(itm)
      }
      ConvReset
    }
  },
  east:new Exit("upper_steam_hall"),
})


createItem("yellow_balloon", {
  loc:"nursery",
  scenery:true,
  examine:"The balloon was bright yellow, and pretty much spherical, except for the bit where it was blown up.",
})


createItem("dollshouse", {
  loc:"nursery",
  scenery:true,
  examine:function() {
      let s = "Like the room, the dolls house was old fashioned. Made of wood, the roof looked like maybe it had been carved to look like it was thatched. The walls were white, the window frames were metal, and it stood on a base painted green. "
      if (!this.isopen) {
        s += "It looked like the back would open up."
      }
      else {
        s += "The back was opened up, and inside Mandy could see a tiny man."
      }
      Print (s)
  },
})


createItem("tiny_man", NPC(false), {
  loc:"dollshouse",
  scenery:true,
  examine:function() {
        let s = "The man was only about ten centimeters tall, but looked normally proportioned. He was dressed in blue overalls, and had dark hair, that was going grey. "
        if (this.state < 10) {
          s += "He seemed to be making a pair of shoes."
        }
        else if (this.state < 20) {
          s += "He was mending the boots Mandy had given him."
        }
        else {
          s += "He was once again making a pair of shoes."
        }
        P (s)
  },
})


createItem("tinyman_hello", TOPIC(false), {
  loc:"tiny_man",
  runscript:function() {
    msg("");
    msg("'Er, hi,' Mandy said to the little man.");
    msg("");
    msg("He looked up from his work. 'Hello, miss,' he said in a high-pitched voice.");
  },
})


createItem("tinyman_live_here", TOPIC(false), {
  loc:"tiny_man",
  runscript:function() {
    msg("");
    msg("'Do you live here?'");
    msg("");
    msg("'No, no. I'm just 'ere quick-like to use the tools. Er, this this your 'ouse? You looks a bit big for it.'");
    msg("");
    msg("'No. I live about half a mile that way.' She pointed northwards. 'I think. Things seem a bit twisted around here.'");
  },
})


createItem("tinyman_what_doing", TOPIC(false), {
  loc:"tiny_man",
  runscript:function() {
    msg("");
    msg("'What are you doing?'");
    msg("");
    msg("'I'm making meself some shoes. So 'ard to find any me size, so I 'aves to make me own, see. I've gotten quite good over the years, if I say so meself.'");

              if (boots.parent = player) {
                if (boots.size = 0) {
                  do (tinyman_mend_boots_normal, "show")
                }
                if (boots.size = -1) {
                  do (tinyman_mend_boots_small, "show")
                }
              }
            
  },
})


createItem("tinyman_mend_boots_normal", TOPIC(false), {
  loc:"tiny_man",
  runscript:function() {
    msg("");
    msg("'Could you mend some boots?' Mandy showed him the boots.");
    msg("");
    msg("'Are you kidding me? They're enormous! 'ow could I get a needle through leather that thick?'");

            
  },
})


createItem("tinyman_mend_boots_small", TOPIC(false), {
  loc:"tiny_man",
  runscript:function() {
    msg("");
    msg("'Could you mend some boots?' Mandy showed him the boots.");
    msg("");
    msg("'I should think so. Toss 'em over here, and I'll 'ave a go.'");

              tiny_man.state = 1
            
  },
})


createItem("tinyman_where_live", TOPIC(false), {
  loc:"tiny_man",
  runscript:function() {
    msg("");
    msg("'So where <i>do </i>you live?'");
    msg("");
    msg("'14 Clarence Street. Least, that's where I lived before I come in 'ere.'");
    msg("");
    msg("'Clarence Street? I know that road, Charlene Porter lives there.' It was a terrace house, built in the later ninettenth century, near the centre of town.");
    msg("");
    msg("'I don't know no Charlene. French is she?'");
  },
})


createItem("tinyman_very_small", TOPIC(false), {
  loc:"tiny_man",
  runscript:function() {
    msg("");
    msg("'I can't help noticing...,' said Mandy wondering how she say this, 'that you quite... well, small.'");
    msg("");
    msg("'Or maybe you're freakishly tall.'");
    msg("");
    msg("'Well, maybe. But this room looks to me like a nursery for people my  size, and you're in a toy house.'");
    msg("");
    msg("'Ah, you got me. Yeah, it's me. I'm small. Never used to be; used to tower over me old mum, I did. Then I got trapped in this 'ouse, see. Went exploring, trying to find a way out, like, walked in room, big as normal, came out like this! '");
  },
})


createRoom("zone_gothic", {
})


createItem("gothic_floor", {
  loc:"zone_gothic",
  scenery:true,
  examine:"The floor was wooden, and well-polished.",
})


createItem("gothic_walls", {
  loc:"zone_gothic",
  examine:"The walls were all panelled in wood.",
})


createItem("gothic_ceiling", {
  loc:"zone_gothic",
  examine:"The ceiling was white, with simple decorations along each side.",
})


createRoom("some_gothic_room", {
  loc:"zone_gothic",
  scenery:true,
  south:new Exit("brass_dining_room"),
  north:new Exit("gallery_south"),
  east:new Exit("central_control"),
  west:new Exit("library"),
})


createItem("library", {
  loc:"zone_gothic",
  scenery:true,
  east:new Exit("some_gothic_room"),
})


createRoom("zone_subterrenea", {
})


createItem("subterrenea_floor", {
  loc:"zone_subterrenea",
  scenery:true,
  examine:"The floor was rock, strewn with loose stones and pebbles.",
})


createItem("subterrenea_walls", {
  loc:"zone_subterrenea",
  scenery:true,
  examine:"The walls were rock, some looked like it was coal.",
})


createItem("subterrenea_ceiling", {
  loc:"zone_subterrenea",
  scenery:true,
  examine:"The ceiling, like the walls, was rock.",
})


createRoom("mine", {
  loc:"zone_subterrenea",
  scenery:true,
  west:new Exit("lower_steam_hall"),
  southeast:new Exit("deeper_mine"),
})


createRoom("deeper_mine", {
  loc:"zone_subterrenea",
  scenery:true,
  desc:function() {
    let s = "It was dark and cold in the coal mine, and Mandy felt she could sense the tonnes of rock above her head, even though logically she had only come a short, and was hardly deep underground."
    if (this.state === 3) {
      s += " There were bits of coal and rock strewn across the floor, and Patch was busy adding to them."
    }
    else if (this.state === 4) {
      s += " The floor was ankle deep in coal and rock, and Patch was busy adding to them."
    }
    else if (this.state === 5) {
      s += " The floor was knee deep in coal and rock, and the tunnel now continued some way to the southeast. Mandy could heard Patch still working down there."
    }
    Print (s)
  },
  beforeEnter:function() {
  },
  afterEnter:function() {
    if (this.state === 3) {
      this.state = 4
    }
    else if (this.state === 4) {
      this.state = 5
    }
    else if (this.state === 5) {
      exit_to_even_deeper_mine.visible = true
      w.patch.parent = w.even_deeper_mine
    }
  },
  northwest:new Exit("mine"),
  southeast:new Exit("even_deeper_mine"),
})


createItem("pickaxe", {
  loc:"deeper_mine",
  examine:"The pickaxe was like every other pickaxe Mandy had seen; a wooden handle, a metal head.",
})


createItem("coal", {
  loc:"deeper_mine",
  scenery:true,
  pronouns:lang.pronouns.plural,
  examine:"As Mandy looked closely, she could see there was definitely coal in the rockface here.",
})


createItem("sack", {
  loc:"deeper_mine",
})


createRoom("even_deeper_mine", {
  loc:"zone_subterrenea",
  northwest:new Exit("deeper_mine"),
})


