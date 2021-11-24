"use strict"



register('medieval', {
  book:'Hamlet',
  uniform:'a startling blue and red uniform that is especially uncomfortable',
  smell:'The room does not smell good; there is a definitely odour of dung.',
  listen:'Mandy can hear nothing.',
  floor:"The floor is rough wood.",
  walls:"The walls are all rough-cut stone.",
  door:"The door is wood; panelled and unpainted.",
  ceiling:"The ceiling is wood, like the floor, supported by thick beams.",
})





createRoom("great_gallery", {
  windowsface:'north',
  examine_ceiling:function() { msg("The stone bricks of the walls curve over to form a vaulted roof to the room.") },
  desc:"The great gallery is a wooden platform that overlooks the great hall, running along the north and east sides of it. A wide flight of wooden stairs leads back down to the hall, while a narrow spiral staircase goes further upwards. The walls are of rough-cut stone. There is a rather low doorway north, and further exits east, south and west.{if:spike:alias:mangled metal: There is a black line running from the observatory, down to the Great Hall.}",
  down:new Exit("great_hall"),
  south:new Exit("solar"),
  north:new Exit("nursery", {msg:'Mandy has to stoop to get through the narrow door to the north.'}),
  east:new Exit("brass_dining_room", {simpleUse:function(char) {
    if (w.brass_dining_room.blocked()) return falsemsg("Mandy starts heading east, but the dining room is now so full of mannequins, she cannot get into it.")
    return util.defaultSimpleExitUse(char, this)
  }}),
  up:new Exit("observatory"),
  west:new Exit("greenhouse_catwalk_east"),
  afterEnter:function() {
    if (w.uniform.wet === 4) { 
      w.uniform.wet = 2
    }
  },
  scenery:[
    { alias:['balustrade', 'banister', 'handrail'], examine:'A study, but rough-cut balustrade runs the length of the gallery.'},
    { alias:'stairs', examine:'The stairs look old and well-used.'},
  ],
  silverSighting:{
    8:'Mandy sees a silver figure in the great hall below her. It seems to be sniffing the floor, but then it looks up at Mandy, skitters away, heading west.',
    14:'Mandy can see another silver figure on the floor below. Again it seems to be studying the floor, before running off.',
  },
  afterEnter() {
    if (this.silverSighting[this.visited % 15]) msg(this.silverSighting[this.visited % 15])
  },   
})




createRoom("great_hall", {
  windowsface:'north',
  desc:"The great hall is an impressive size. It looks older than the rest of the house, a lot older, being built of rough-cut stone. There are large double doors to the west, and a wooden staircase leads up to a wooden gallery that runs along the west side of the hall. To the south, a doorway leads to a flight of steps heading downwards.{if:spike:alias:mangled metal: There is a black line running from the gallery, down to the lab.}",
  examine_ceiling:function() { msg("The stone bricks of the walls curve over to form a vaulted roof to the room, up above the gallery.") },
  up:new Exit("great_gallery"),
  down:new Exit("mad_science_lab"),
  south:new Exit("mad_science_lab"),
  west:new Exit("greenhouse_east"),
  afterEnter(exit) {
    if (this.visited === 9) {
      if (exit.origin === w.greenhouse_east) {
        msg("Mandy sees a flash of silver as a figure darts up the stairs at the other end of the room.")
      }
      else {
        msg("Mandy sees a flash of silver as a figure darts out the doors at the other end of the room, heading into the greenhouse.")
      }
    }
  },   
})

createItem("great_hall_floor", {
  scenery:true,
  alias:"floor",
  loc:"great_hall",
  synonyms:["ground",'flagstones'],
  examine:function() { 
    msg("The floor is composed of flagstones, of the same mid-grey as the walls. It looks a little uneven in places.") 
    if (w.great_gallery.visited > 7) {
      msg("Remembering the interest the silver figure had in the floor, Mandy examines that patch of it especially well, but it looks as boring as the rest.")
    }
  },
  smell:function() { 
    if (w.great_gallery.visited > 7) {
      msg("Mandy thinks about the silver figure sniffing the floor. Most of the flagstones just smell somewhat musty, but there is one - more or less when the silver was sniffing - that smells distinctly of lavender.")
    }
    else {
      msg("The floor smells vaguely unpleasant; kind of musty.")
    }
  },
})




createRoom("solar", {
  windowsface:'south',
  desc:"The solar. Mandy knows the name from history class; this is where the lord of the castle would sleep. None too comfortable to Mandy's eyes, but possibly the height of luxury a thousand years ago. A large bed, crudely built of wood; a tapestry hung from one wall{if:chamber_pot:scenery:; a chamber pot under the bed}.",
  north:new Exit("great_gallery"),
  scenery:[
    {alias:'bed', examine:'The bed is a four-poster, but not ornate at all, and surprisingly small; probably a bit wider than her own bed, but not as long.'},
    {alias:'tapestry', examine:'The tapestry has a rather impressive image of a knight fighting a dragon, though time has muted the colours.'},  
  ],
})

createItem("chamber_pot", SIZE_CHANGING(), VESSEL(), {
  loc:"solar",
  synonyms:['chamberpot'],
  scenery:true,
  underLeakState:0,
  underLeak:false,
  underTree:false,
  flipped:false,
  msgTake:"Mandy takes the chamber pot, trying desperately not to think about what it has been used for. At least it is empty...",
  desc5:'A chamber pot, useful for... something?{chamber_pot}',
  desc4:'A tiny chamber pot, probably not useful for anything.{chamber_pot}',
  desc6:'A huge chamber pot, useful for... She decides she would rather not think about that!{chamber_pot}',
  desc7:'An enormous chamber pot, almost big enough to use as a boat!{chamber_pot}',
  desc8:'A gigantic chamber pot; it is probable as big as her bedroom inside.',
  testFill:function(options) {
    if (this.size > 5) {
      msg("Mandy thinks about filling the chamber pot with " + options.fluid + ", but it is so big, she would never be able to lift it.")
      return false
    }
    if (options.fluid === 'water' && player.loc === 'beach') {
      msg("Mandy thinks about filling the chamber pot with water from the sea, but just the sight of those bodies in it is making her feel nauseous. No way is she going near that water.")
      return false
    }
    if (w.chamber_pot.underLeakState > 0) {
      msg('Mandy empties the tiny bit of oily water out of the chamber pot.')
      w.chamber_pot.underLeakState = 0
    }
    return true
  },
  nameModifierFunction:function(list) {
    if (this.containedFluidName) list.push('full of ' + this.containedFluidName)
  },
  testCarry:function() {
    if (this.loc === player.name && this.size === 7 && this.containedFluidName) return falsemsg('Mandy starts to the door, but the weight of the enormous chamber pot full of {show:fluid} is just too much for her to lug around.', {fluid:this.containedFluidName})
    return true
  },
  afterMove:function() {
    this.msgTake = lang.take_successful
    this.underLeak = false
    this.underTree = false
    this.flipped = false
  },
  use:function() {
    msg("Mandy looks at the chamber pot. She could actually do with a wee, but the thought of using that... No, she can wait.")
  },
  eventPeriod:1,
  eventIsActive:function() {
    return this.underLeak
  },
  eventScript:function() { 
    this.underLeakState++
    if (this.underLeakState > 20) this.containedFluidName = "water"
  }
})
tp.addDirective("chamber_pot", function(arr, params) {
  if (w.chamber_pot.underLeakState > 0) return ' It has a tiny bit of oily water in it.'
  if (w.chamber_pot.flipped) return ' It is upside down.'
  if (!w.chamber_pot.containedFluidName) return ''
  return ' It is full of ' + w.chamber_pot.containedFluidName + '.'
})




createRoom("mad_science_lab", {
  windowsface:'none',
  alias:"mad science laboratory",
  smell:function() { 
    if (w.spike.alias === 'mangled metal') {
      msg("There is a strong smell burnt flesh -- disturbingly like barbecue -- and ozone.") 
    }
    else {
      msg("Mandy warily sniffs the air; it is not a pleasant smell. Acrid, a bit like vinegar, but not quite.") 
    }
  },
  examine_floor:function() { msg("The floor is packed earth; there are patches that look darker, where something might have been spilt perhaps.") },
  examine_ceiling:function() { msg("The stone bricks of the walls curve over to form a vaulted roof to the room.")},
  desc:function() {
    let s = "This appears to be some kind of laboratory, though nothing like the ones at school. While they have their own distinctive smell, this room is "
    s += w.spike.alias === 'mangled metal' ? 'altogether worse, with a strong smell of burnt rubber' : 'different, though Mandy is not sure what it is'
    s += ". The room is dominated by a very solid wooden bench"
    if (w.patchwork_body.isHere("this")) {
      if (w.patchwork_body.loc || w.Patch.state === 0) {
        s += ", with a corpse on it; is it there to be dissected?"
      }
      else {
        s += ", with a patchwork body on it."
      }
      s += " A strange device stands at the head of the table, connected to the body by a number of thick wires"
    }
    else {
      s += ". At one end of the bench a strange device stands with wires dangling from it"
    }
    if (w.wire.scenery) {
      s += ", and a coil of wire sits on the floor beside it"
    }
    s += ". Above the table, a crocodile is suspended."
    if (w.mad_science_journal.scenery) {
      s += " Mandy can also see a journal lying in a corner, as though tossed there in anger."
    }
    return s
  },
  afterEnter:function() {
    if (w.wire.tiedTo2 === 'spike') {
      msg("Suddenly there is a crack of thunder, so loud Mandy can hear it even down here. Mandy shrieks in shock at a bright flash that she thinks at first is the lightning, but then realises is the wire suddenly, and very briefly, glowing white-hot.")
      msg("There is a smell of ozone and burnt flesh and, as her pounding heart slows again, she sees that smoke is coming from the strange device.")
      msg("Then she notices the body on the bench twitching. It raises its right arm, and looks at it. 'It's alive!' Mandy cackles, because, really, what else is one supposed to do after animating a body with lightning?")
      w.spike.setAlias('mangled metal')
      delete w.wire.tiedTo2
      delete w.wire.loc
      w.patchwork_body.transform(w.Patch)
    }
  },
  up:new Exit("great_hall"),
  north:new Exit("great_hall"),
})

createItem("stuffed_crocodile", TAKEABLE(), CONTAINER(true), { // cannot get taken to size change rooms
  loc:"mad_science_lab",
  scenery:true,
  parserPriority:50,
  examine:"The crocodile is a little over a metre long, and hanging from the ceiling on four wires. It looks like it is stuffed, and it is kind of creepy imagining that once it had been alive.{ifNot:stuffed_crocodile:closed: Its mouth is wide open, and one tooth {if:crocodile_tooth:loc:stuffed_crocodile:looks lose:is missing}.}",
  testTake:function(options) {
    if (!this.scenery) return true
    if (options.char.postureFurniture === "mad_science_bench" && options.char.posture === "standing") {
      this.msgTake = 'Mandy can just about reach the crocodile from the bench. She reaches up, and gives it a good pull, yanking the fixing from the ceiling in a shower of dust.'
      return true
    }
    if (options.char !== w.Patch) return falsemsg('The crocodile is too high for {nm:char:the} to reach.', {char:options.char})
    return true
  },
  msgTake:'Patch looks up at the crocodile for a moment. He reaches up, and gives it a good pull, yanking the fixing from the ceiling in a shower of dust.',
  afterMove:function(options) {
    this.msgTake = lang.take_successful
  },
  testCarry:function(options) {
    if (options.char === player) return falsemsg("Mandy thinks about heading off... She hoists up the crocodile to get the better grip, but it is just too big! No way is she going anywhere whilst carrying this thing.")
  },
  testDropIn:function(options) {
    if (options.item === w.crocodile_tooth) return falsemsg("The tooth does not seem to want to go back into the crocodile's mouth. Mandy shrugs; no big deal.")
    falsemsg("Mandy contemplates putting {nm:item:the} in the mouth of the crocodile. People have handbags made out of crocodiles, right? It suddenly occurs to her that the crocodile will be skinned, and its leather used to make the bag, rather than putting things down the corpse's gullet.", options)
  },
  testOpen:function(options) { return this.testTake(options) },
})

createItem("crocodile_tooth", SIZE_CHANGING(), {
  loc:"stuffed_crocodile",
  sharp:true,
  desc5:"The tooth is a couple of centimetres long, and very sharp.",
  desc6:"The tooth is huge - about as long as Mandy's arm - and very sharp.",
  testTake:function(options) {
    if (this.loc !== "stuffed_crocodile" || !w.stuffed_crocodile.scenery) return true
    if (options.char.postureFurniture === "mad_science_bench" && options.char.posture === "standing") return true
    if (options.char !== w.Patch && this.loc === "stuffed_crocodile" && w.stuffed_crocodile.scenery) return falsemsg('The crocodile is too high for {nm:char:the} to reach.', {char:options.char})
    return true
  },
})


createItem("mad_science_bench", FURNITURE({recline:true, sit:true, stand:true}), {
  loc:"mad_science_lab",
  synonyms:['table'],
  scenery:true,
  alias:"bench",
  examine:"The wood of the bench has black rings and circles scorched into it, testament to years of use. Or perhaps a week of use by an inept experimenter, Mandy muses.",
  take:'The bench is far to heavy for Mandy to pick up.',
  testPostureOn:function(options) {
    let phrase = ''
    if (options.posture === 'reclining') phrase = 'lying down'
    if (options.posture === 'sitting') phrase = 'sitting down'
    if (options.posture === 'standing') phrase = 'standing up on the bench'
    let s = "The thought of " + phrase + " next to a body assembled from numerous corpses makes Mandy feel sick."
    
    if (w.patchwork_body.loc === "mad_science_lab") return falsemsg(s)
    if (w.Patch.isHere() && !w.boots.isAtLoc("Patch")) return falsemsg(s + " The fact that said body is now moving makes the prospect no more appealing.")
    return true
  },
})

createItem("patchwork_body", {
  loc:"mad_science_lab",
  alias:"patchwork body",
  synonyms:['corpse'],
  scenery:true,
  state:0,
  examine:function() {
    this.state = 1
    msg("Mandy gingerly inspects the corpse on the table. It is naked, but nothing to suggest it is either male or female. Mandy decides she does not want to look too closely at {i:that} situation. As she looks closer, she can see stitch marks, and with a growing sense of nausea, she realises it is not a corpse, but the stitched together parts of {i:several} corpses.")
  },
  take:'Mandy thinks about picking up the body... Not going to happen.',
  shift:'Mandy thinks about shifting the body off the table. She would have to touch it to do that. And really, why would she want to?',
})
createItem("patchwork_body_stiches", COMPONENT("patchwork_body"), {
  alias:"stitches",
  synonyms:['marks', 'parts'],
  examine:'Mandy looks closer at the stitching holding the patchwork body together. She has to acknowledge that the needlework is good quality - and presumably all done by hand. She remembers her own efforts at making oven gloves at school, and that was with a machine. Not good.',
})


createItem("Patch", NPC(false), {
  alias:"animated corpse",
  synonyms:['patch', 'patchwork body', 'animated corpse'],
  state:0,
  afterMove:function() { 
    this.huggingTree = false
    delete this.goUpDirection
  },
  hug:"He might be made from a collection of disparate body parts, but there is something quite endearing about Patch. Mandy gives him a big hug, and he grins at her.",
  examine:function() {
    let s
    if (this.state === 0) {
      s = "Mandy looks at the creature she bought to life. It is about two and a half metres tall, and very solidly built. Patches of it are hairy, other patches are dark skinned, some light skinned. Its face is not attractive, it too is a mishmash of parts. Mandy really does not want to know where all the parts came from. However, it needs a name... 'I'll call you Patch,' she says. It nods it head, possibly in acknowledgement."
      this.setAlias("Patch")
      this.state = 1
    }
    else {
      s = "Mandy looks at Patch, the creature she bought to life. He is about two and a half metres tall, and very solidly built. Patches of him are hairy, other patches are dark skinned, some light skinned. His face is not attractive, it too is a mishmash of parts. Mandy really does not want to know where all the parts came from."
    }
    if (w.boots.isAtLoc("Patch")) {
      s += " He is wearing a pair of boots."
    }
    const held = scopeHeldBy(w.Patch)
    array.remove(held, w.boots)
    array.remove(held, w.boots_toe)
    if (held.length > 0) s += ' He is holding ' + formatList(held, {article:INDEFINITE, lastJoiner:'and'}) + '.'
    if (this.huggingTree) s += '|He is currently hugging a tree.'
    msg(s)
  },
  talktoOptions:[
    "'So, do you come here often?' Mandy asks Patch. He gave no indication either way.",
    "'Tell me about yourself!' says Mandy to Patch. His silence suggested there is not much to tell. Or he is unable to talk.",
    "'Where now, do you think?' Mandy asks Patch. Patch seems as stumped as Mandy.",
  ],
  kill:'Mandy contemplates killing Patch... Would it be murder, given he is made up of dead bodies anyway? And she game him life, so that must mean she has the right to take it away; she is sure she has heard people say that about God. On the other hand, if she did kill him, would that be considered a massacre, given he is made up all numerous bodies -- would she get blamed for killing all them? She decides it is not worth the legal nightmare that would ensue.',
  talkto:function() {
    if (this.state === 0) {
      msg ("'I shall call you \"Patch\",' declares Mandy.")
      msg ("The animated body seems to stand a little taller, Mandy thinks, proud to have a name.")
      this.setAlias("Patch")
      this.state = 1
    }
    else {
      msg(this.talktoOptions[random.int(2)])
    }
    return true
  },
  getAgreement:function() {
    if (w.boots.loc !== 'Patch') return falsemsg("Patch looks mournfully at his feet. His bare feet.")
    return true
  },
  endFollow:function() {
    msg("'Wait here,' says Mandy to {nm:npc:the}.", {npc:this})
    if (!this.leaderName) return falsemsg("{nv:npc:look:true} at Mandy in confusion.", {npc:this})
    this.setLeader()
    msg("{nv:npc:nod:true} his head.", {npc:this})
    return true
  },
  startFollow:function() {
    msg("'Follow me,' says Mandy to {nm:npc:the}.", {npc:this})
    if (this.leaderName) return falsemsg("{nv:npc:look:true} at Mandy in confusion.", {npc:this})
    if (w.boots.loc !== 'Patch') return falsemsg("Patch looks mournfully at his feet. His bare feet.")
    
    this.setLeader(player)
    msg("{nv:npc:nod:true} his head.", {npc:this})
    return true
  },
  testFollowTo:function(room) {
    if (room && !room.noFollow) return true
    msg("Mandy realises Patch is no longer following her.")
    this.setLeader()
    return false
  },
  hasPod:function() {
    const l = scopeHeldBy(this)
    for (const el of l) {
      if (el.name.startsWith('tamarind_pod_prototype')) return true
    }
    return false
  },
  receiveItemsFailMsg:function(options) {
    options.item.loc = this.loc
    return falsemsg("Mandy gives {nm:item:the} to {nm:Patch:the}. {nv:Patch:look} at {sb:item} in confusion, before dropping {sb:item} to the floor.", options)
  },
  receiveItems:[
    {
      item:w.boots,
      f:function(options) {
        if (w.boots.size < 5) {
          options.item.loc = this.loc
          return falsemsg("Mandy gives the boots to {nm:npc:the}. He looks at the tiny footwear in confusion, before dropping them on the floor.", options)
        }
        if (!w.boots.mended) {
          options.item.loc = this.loc
          w.boots.rejectedForHole = true
          return falsemsg("Mandy gives the boots to {nm:npc:the}. He looks at the footwear at first with a big smile, which turns into a forlorn frown when he finds the right boot is coming apart. With a glum expression, he drops them on the floor.", options)
        }
        if (w.secret_recipe.loc === 'boots_room') {
          options.item.loc = this.loc
          msg("Mandy gives the boots to {nm:npc:the}. He looks at the footwear with a big smile, then proceeds to pull on the left boot... Suddenly his grin turns to a frown, and he pulls off the boot, dropping both on the floor.", options)
          if (w.boots.rejectedForHole = true) {
            msg("'For fuck's sake,' mutters Mandy, 'now what? Is there a stone in it or something?'")
          }
          else {
            msg("'What the...' mutters Mandy, 'Is there a stone in it or something?'")
          }
          w.boots.rejectedForStone = true
          return false
        }
        options.item.loc = this.name
        options.item.worn = true
        this.animated = true
        msg("Mandy gives the boots to {nm:npc:the}. He looks at the footwear with a big smile, then proceeds to pull on the left boot... Then the right. He looks at them, now on his feet, for a moment, before getting off the bench, and standing upright, ripping of all the wires connecting him to the strange device.", options)
      },
    },
  ],
  askOptions:[
    { // boots
      test:function(p) { return p.text.match(/boot/) },
      script:function(p) {
        msg("'What's the big deal about the boots?' asks Mandy. Patch just stares at her.")
      }
    },
    {
      test:function(p) { return true },
      script:function(p) {
        msg("'Tell me about " + p.text + ",' says Mandy. Patch just stares at her")
      }
    },
  ],
  tellOptions:[
    {
      test:function(p) { return true },
      script:function(p) {
        msg("Mandy starts to tell Patch about " + p.text + ". He looks at her intensely, but she gets the feeling he has no idea what she is saying.")
      }
    },
  ],
})
w.Patch.nameModifierFunctions[0] = function(item, l) {
  if (w.boots.loc === 'Patch') l.push('wearing a pair of boots')
  const held = scopeHeldBy(w.Patch)
  array.remove(held, w.boots)
  array.remove(held, w.boots_toe)
  if (held.length > 0) l.push('holding ' + formatList(held, {article:INDEFINITE, lastJoiner:'and'}))
  if (w.Patch.huggingTree) l.push('hugging a tree')
}

createItem("strange_device", {
  loc:"mad_science_lab",
  alias:"strange device",
  synonyms:['strange machine'],
  scenery:true,
  switchon:'Mandy tries to turn on the strange device, but there seems to be no power to it.',
  switchoffn:'It is already off.',
  examine:function() {
    let s = "The machine at the head of the table is about a metre and a half tall; a wooden cabinet, with brass fittings. On the front are a series of dials and knobs. "
    let body
    if (w.patchwork_body.isAtLoc("mad_science_lab")) {
      body = w.patchwork_body
      s += " About a dozen wires run from the machine to the body, each attached to its own brass bolt on the machine, and to a clip on the torso."
    }
    else if (!w.Patch.animated) {
      body = w.Patch
      s += " About a dozen wires run from the machine to {nm:item:the}, each attached to its own brass bolt on the machine, and to a clip on his torso."
    }
    else {
      s += " About a dozen wires hang down from the machine, each attached to its own brass bolt on the machine."
    }
    if (w.spike.alias === 'mangled metal') s += ' There is smoke coming from the back of it.'
    msg(s, {item:body})
  },
  use:"Mandy gives the knobs on the strange device a twist, but nothing happens. She gives it a kick, but that is no more successful.",
  attachable:true,
  testAttach:function(options) {
    return falsemsg("Mandy thinks about attaching the wire to the the strange device... But the other end is already soldered to it, and she decides having one end fixed to it is enough.")
  },
})

createItem("device_controls", COMPONENT("strange_device"), {
  scenery:true,
  synonyms:['dials', 'knobs'],
  examine:"There are three black knobs, each set to about half way between zero and ten. Each has a dial above, each reading exactly zero.",
  parserPriority:-10,
  use:function() {
    msg("Mandy looks at the complicated controls on the strange device. She probably should not mess with them.")
    msg("'Ah, what the hell...' She turns the knob on the left clockwise a bit, then a bit more. Then all of them as far as they can go, and then turns them all the other way as far as they can go. Nothing happens.")
    return false
  },
  turn:function() { return this.use() },
  attachable:true,
  testAttach:function(options) {
    return falsemsg("Mandy thinks about attaching the wire to the the strange device... But the other end is already soldered to it, and she decides having one end fixed to it is enough.")
  },
})
createItem("bolts", COMPONENT("strange_device"), {
  synonyms:['pads', 'wires'],
  examine:"There are twelve bolts on the strange device, in a row under the control panel. {ifExists:patchwork_body:loc:Each has a wire that runs to a pad on the patchwork body:Each has a wire dangling from it}.",
  attachable:true,
  rope:true,
  parserPriority:15,
  testAttach:function(options) {
    return falsemsg("Mandy thinks about attaching the wire to the the strange device... But the other end is already soldered to it, and she decides having one end fixed to it is enough.")
  },
  handleUntieFrom:function() {
    return failedmsg('Mandy thinks about detaching the wires, but decides to leave it alone. {ifExists:patchwork_body:loc:Just has a weird feeling it is important that they stay attached to the body:They are no use to her, and not doing any harm just dangling there}.')
  },
})

createItem("wire", ROPE(8, "strange_device"), {
  loc:"mad_science_lab",
  alias:"wire",
  synonyms:['coil of wires', 'wires','cable'],
  pronouns:lang.pronouns.massnoun,
  indefArticle:'some',
  scenery:true,
  parserPriority:10,
  msgUnwind:"The wire trails behind as Mandy unwinds it.",
  msgWind:"Mandy coils up the wire.",
  msgTake:"She takes the coil of wire.",
  examine:function() {
    let s = "The wire is about a millimetre thick, and "
    let length = this.locs.length
    if (this.isHeld()) length--
    if (length === 1) {
      s += "she guesses there is about " + lang.toWords(5 * this.ropeLength) + " metres of it, the end of which is soldered to the side of the machine at the head of the table."
    }
    else if (length === 2) {
      s += "she guesses there is about twenty metres of it on the spindle, which is also metal, and more heading down the stairs to the laboratory."
    }
    else if (length === this.ropeLength - 1) {
      s += "there is not much left."
    }
    else if (length === this.ropeLength) {
      s += "she is holding just the end of it."
    }
    else {
      s += "she guesses there is about " + lang.toWords(5 * (this.ropeLength - length)) + " metres of it in a coil; more is heading back to the laboratory."
    }
    this.examined = true
    msg(s)
  },

  suppessMsgs:true,
  attachTo:function(char, item) {
    if (this.locs[this.locs.length - 1] === player.name) this.locs.pop()
    this.locs.push(item.name)
    this.tiedTo2 = item.name
    if (item === w.spike) {
      msg("Mandy wraps the wire from the spindle around the letter E on the weather vane, then lets the spindle drop, happy that it is secure.")
      if (w.sky.state < 5) { 
        w.sky.state = 5
        msg("A brief flash of lightning lights up the weather vane, and a few seconds later Mandy hears the thunder.")
      }
    }
    else {
      msg("Mandy attaches the wire from the spindle to {nm:item:true}, then lets the spindle drop.", {item:item})
    }
  },
  detachFrom:function(char, item) {
    if (!this.tiedTo2) return falsemsg("Mandy looks at where the wire is soldered to the strange device. That is not coming of there.")

    this.tiedTo2 = false
    this.locs.pop()
    this.locs.push(player.name)
    if (item === w.spike) {
      msg("Mandy unwraps the wire from the spindle around the letter E on the weather vane.")
    }
    else {
      msg("Mandy detaches the wire from {nm:item:true}.", {item:item})
    }
  },  
  
  afterMove:function() {
    if (!this.examined) {
      this.examined = true
      msg("Mandy realises one end of the wire on the spindle is soldered to the strange machine.")
    }
    if (!this.moved) this.moved = true
  },
})



createItem("mad_science_journal", SIZE_CHANGING(), {
  loc:"mad_science_lab",
  scenery:true,
  read:"Mandy leafs though the {if:mad_science_journal:size:4:tiny }{if:mad_science_journal:size:6:huge }journal, scanning the pages. Most of it makes as little sense as her \"Chemistry in Context\" text book, and the handwriting does not help. What the hell is a homunculus? The last third of the journal is empty, but the last entry says: \"I am so near, all I need is the vital spark. Weather vane on the Great Hall?\"",

  desc4:"The journal is about the size of a postage stamp; it looks like various things have been spilled on it, including acid, given the entire bottom right corner is missing. It looks old too -- or at least old-fashioned -- and is bound in leather.",
  desc5:"The journal is in a bad condition; it looks like various things have been spilled on it, including acid, given the entire bottom right corner is missing. It looks old too -- or at least old-fashioned -- and is bound in leather.",
  desc6:"The journal is as big as a table, and its bad condition is even more apparent; it looks like various things have been spilled on it, including acid, given the entire bottom right corner is missing. It looks old too -- or at least old-fashioned -- and is bound in leather.",

})












/*


This room resets when the balloon touches the floor

The player needs to:
enter
open doll's house
talk to man
give boots to man
wait
get boots

get balloon, touch, move, knock, etc. heads it up,



*/



createRoom("nursery", {
  windowsface:'north',
  noFollow:true,
  desc:"This seems to be a nursery, or at least what a nursery might have looked like a century ago. {if:china_doll:scenery:A china doll sits on a chair, and there is a doll's house near them:On the far side of the room, there is a chair and a doll's house}. Mandy can also see a cream-painted cot near the window{ifExists:yellow_balloon:loc:, and a balloon..}. The only way out is back south.",
  afterEnter:function() {
    w.yellow_balloon.state = 0
  },
  afterExit:function() {
    w.yellow_balloon.reset()
  },
  south:new Exit("great_gallery", {msg:"Mandy ducks down to go out the door, and as she does a sudden flash of light momentarily disorientates her."}),
  hereish:function(o) {
    return ['nursery', 'dollshouse', 'tiny_man'].includes(o.loc)
  }
})

createItem("nursery_chair", FURNITURE({sit:true}), {
  alias:'chair',
  loc:"nursery",
  scenery:true,
  examine:'A simple wooden chair; small, as though for a child.',
})

createItem("nursery_cot", FURNITURE({sit:true, recline:true}), {
  alias:'cot',
  loc:"nursery",
  scenery:true,
  examine:'A simple cot, of unpainted wood.',
  testPostureOn:function() { return falsemsg("Mandy looks at the cot, and decides it is too small for her.") },
})


createItem("china_doll", SIZE_CHANGING(), {
  scenery:true,
  loc:"nursery",
  alive:true,
  parserPriority:5,
  testTake:function() {
    if (this.alive) return falsemsg("Mandy tries to grab the china doll, but she is a bit more tricky to grab hold off now she is a live. There is also the moral question of whether Mandy should be picking up a living person too.")
    return true
  },
  msgTake:"{if:china_doll:scenery:Mandy picks up the china doll because you never know when a creepy toy is going to come in useful. The body is soft and floppy, and the contrast with the head is a little disturbing.|'Help me!' says a tiny voice. Was that the doll speaking?:Mandy picks up the china doll.}",
  desc5:"The doll is about forty centimetres tall, or would be if she was standing upright -- she clearly is supposed to be female. Her head and shoulders are glazed porcelain, including her dark hair and blue eyes; she has very rosy cheeks. She is wearing quite a fancy burnt umber dress, with belt and buttons. There is something creepy about her.",
  desc4:"The doll is small enough to fit comfortably in Mandy's palm. Her head and shoulders are glazed porcelain, including her dark hair and blue eyes; she has very rosy cheeks. She is wearing quite a fancy burnt umber dress, with belt and buttons. She is decidedly less creepy this size.",
  desc3:"The china doll is so small, Mandy can hardly see it.",
  desc6:"The doll would be considerably taller than Mandy if she were standing upright. Her head and shoulders are glazed porcelain, including her dark hair and blue eyes; she has very rosy cheeks. She is wearing quite a fancy burnt umber dress, with belt and buttons. Definitely creepy.",
})


createItem("china_doll_dress", COMPONENT("china_doll"), {
  scenery:true,
  alias:'dress',
  examine:'The reddish brown dress is quite fancy, if old fashioned, and equipped with all the accessories of a proper dress albeit in miniature. {ifMoreThan:china_doll:size:5: Well, not in miniature now, but it was when she first saw it.} There seems to be no way to get the dress off the doll, in fact, Mandy suspects the doll\'s torso is just stuffing inside the dress.'
})


createItem("yellow_balloon", {
  loc:"nursery",
  scenery:true,
  alias:"yellow balloon",
  states:[
    'The balloon is near the ceiling, but seems to be falling...',
    'The balloon, gently falling from the ceiling, is at about head height.',
    'The balloon has drifted down to about waist height.',
    'The balloon is at knee height, floating downwards.',
    'Mandy watches the balloon as it drifts down, to touch the floor...',
  ],
  state:0,
  eventPeriod:1,
  eventIsActive:function() { return player.loc === 'nursery' && this.loc === 'nursery' },
  eventScript:function() {
    msg(this.states[this.state])
    this.state++
    if (this.state === this.states.length) {
      msg("Suddenly everything goes white...")
      msg(w.great_gallery.north.msg)
      this.reset()
      msg(this.states[0])
      this.state++      
      for (const s of settings.roomTemplate) msg(s)
    }
  },
  reset:function() {
    // balloon burst, so no reset
    if (w.yellow_balloon_remains.loc) return

    this.state = 0

    // wire
    // either the wire is not here OR the player is holding it OR it is in the room
    // either the player is in the nursery or great_gallery
    if (w.wire.isAtLoc('nursery')) {
      log('sort wire')
      if (w.wire.locs[w.wire.locs.length - 1] === 'player') w.wire.locs.pop()
      if (w.wire.locs[w.wire.locs.length - 1] === 'nursery') w.wire.locs.pop()
      log(w.wire.locs)
      if (player.loc === 'nursery') {
        log('nursery')
        w.wire.locs.push('nursery')
      }
      w.wire.locs.push('player')
      log(w.wire.locs)
    }

    // dollshouse
    w.dollshouse.closed = true
    w.dollshouse.hasBeenOpened = false
    // china doll
    for (const el of [w.china_doll, w.nursery_cot, w.nursery_chair]) {
      el.scenery = true
      el.loc = "nursery"
    }
    // tiny man
    w.tiny_man.state = 0
    if (w.tiny_man.breakingIntoPod) {
      w[w.tiny_man.breakingIntoPod].loc = player.name
      delete w.tiny_man.breakingIntoPod
    }
    delete w.tiny_man.agenda
    
    // boots not mended if in the room
    if (w.nursery.hereish(w.boots)) w.boots.mended = false

    for (const key in w) {
      const o = w[key]
      // not interested in rooms, scenery or player
      if (o.room || o.scenery || o.player) continue
      // anything else in the nursery goes back to player inventory
      if (w.nursery.hereish(o)) o.loc = player.name
    }
  },
  examine:"The balloon is bright yellow, and pretty much spherical, except for the bit where it is blown up.",
  take:function() {
    msg("Mandy tries to grab the balloon, but it bounces upwards, out of reach.")
    this.state = 0
  },
  'catch':function() {
    msg("Mandy tries to catch the balloon, but it bounces upwards, out of reach.")
    this.state = 0
  },
  smash:function() {
    msg("Mandy tries to burst the stupid balloon, but it bounces out of reach, rising up to the ceiling.")
    this.state = 0
  },
  knockon:function() {
    msg("Mandy knocks the balloon, sending it up to the ceiling.")
    this.state = 0
  },
  kick:function() {
    msg("Mandy kicks the balloon, making it rise up to the ceiling.")
    this.state = 0
  },
  burst:function() {
    const sharp = player.getSharp()
    if (!sharp) return falsemsg("Mandy jabs her finger at the balloon, and it just bounces off. She jabs again, and then again, but does no better. she needs something sharp.")

    msg("Mandy jabs at the balloon with {nm:item:the}, and it just bounces off. She jabs again, and then again, and finally the balloon pops! The remains drop to the floor. She resists the urge to grind the limp yellow remnants under her heel.", {item:sharp})
    this.transform(w.yellow_balloon_remains)
  },
})


createItem("yellow_balloon_remains", {
  pronouns:lang.pronouns.plural,
  alias:"remains of a yellow balloon",
  synonyms:['remnants'],
  examine:"A ragged piece of yellow rubber.",
  take:'Mandy wonders if the remains of a very annoying balloon are worth picking up. She decides they are not.',
  grind:"'Fuck it,' said Mandy, 'I {i:am} going to do it.' She stands over the remains of the yellow balloon, puts her heel down on it, and {i:grinds}. It feels good!",
  repair:'Realistically, the yellow balloon is beyond repair.',
})


createItem("dollshouse", CONTAINER(true), {
  loc:"nursery",
  scenery:true,
  hasBeenOpened:false,
  openCount:0,
  alias:"doll's house",
  synonyms:['dollshouse', 'dollhouse', 'dolls house', 'doll house', 'doll\'s house', 'back,'],
  examine:function() {
    let s = "Like the room, the doll's house is old fashioned. Made of wood, the roof looks like maybe it has been carved to look like it is thatched. The walls are white, the window frames are metal, and it stands on a base painted green. "
    if (this.closed) {
      s += "It looks like the back would open up."
    }
    else {
      s += "The back is opened up, and inside Mandy can see a tiny man."
    }
    msg(s)
  },
  openMsg:function() {
    if (this.hasBeenOpened) {
      msg("She opens the doll's house. There is the little man; he looks at Mandy. 'You again, eh?'")
    }
    else {
      msg("She opens the doll's house. Inside, the house is perfectly furnished, complete with a little man, sat on a chair.")
      let s = "The little man looks at Mandy, a look of surprise on his face. 'Cor blimey, you're a big 'un!' "
      switch (this.openCount) {
        case 0: s += " Apparently he is alive!"; break;
        case 1: s += " Apparently he is alive! Mandy has a strange feeling of déjà vu..."; break;
        case 2: s += " Apparently he is alive! Mandy has a strange feeling of déjà vu, then a feeling of déjà vu about the feeling of déjà vu!"; break;
        case 3: s += " Apparently he is alive! Why is that not a surprise?"; break;
        default: s += " He is alive, just as she expected."; break;
      }
      msg(s)
      this.openCount++
      this.hasBeenOpened = true
    }
  },
  testDropIn:function(options) {
    log(options)
    log(w.china_doll)
    if (options.item === w.china_doll && w.china_doll.size === 4) return true
    if (options.item === w.china_doll) return falsemsg("Mandy thinks about putting the china doll in the doll's house, but she is too big.")
    return falsemsg("Mandy thinks about putting {nm:item:the} in the doll's house, but maybe now is not the time to be playing in it.")
  },
  afterDropIn:function(options) {
    if (options.item === w.china_doll) {
      msg("After a moment, the china doll suddenly comes to life! She sits up, and looks around, then gets to her feet.")
      msg("'Blow me,' says the tiny man, 'you found me a friend, lady-giant! Mind, if you could get me one a bit less creepy next time, that would be even better.'")
      w.china_doll.alive = true
    }
  },
})


createItem("tiny_man", NPC(false), {
  loc:"dollshouse",
  scenery:true,
  alias:"tiny man",
  synonyms:['little man', 'big bert', 'cuthbert'],
  state:0,
  inSight:function() {
    return player.loc === 'nursery' && !w.dollshouse.closed
  },
  agendaBootsDone:function() {
    msg("'Okay, there you go,' says the tiny man, putting the boots on the floor just outside the doll's house. 'Good as new! Well, nearly.'")
    w.tiny_man.state = 3
    w.boots.loc = 'nursery'
    w.boots.mended = true
  },
  agendaPodDone:function() {
    const count = random.int(3, 5)
    msg("'Nearly there,' says the tiny man with a cheerful grin. He gives the chisel another tap, and the pod splits open, to reveal " + count + " seeds.")
    if (!w.tamarind_seed.countableLocs[player.name]) w.tamarind_seed.countableLocs[player.name] = 0
    w.tamarind_seed.countableLocs[player.name] += count
    delete w[w.tiny_man.breakingIntoPod].loc
    delete w.tiny_man.breakingIntoPod
  },
  kill:'Mandy contemplates killing the little man. The guy is only ten centimetres, no court in the land would consider him an actual person, would it. Admittedly he does seem like a normal person. And what if he is normal-sized, and it is she who is a giant? No court in the land would find a giant innocent for the cold-bloodied murder of a man just trying to make a living mending shoes. Probably best to let him live, annoying though he is.',
  examine:function() {
    let s = "The man is only about ten centimetres tall, but looks normally proportioned. He is dressed in blue overalls, and has dark hair, that is going grey. "
    if (this.state < 2) {
      s += "He seems to be making a pair of shoes."
    }
    else if (this.state === 2) {
      s += "He is mending the boots Mandy has given him."
    }
    else if (this.breakingIntoPod) {
      s += "He is trying to break into a tamarind pod."
    }
    else {
      s += "He is once again making a pair of shoes."
    }
    msg(s)
  },
  msg:function(s, params) { msg(s, params) },  // override default for NPCs so we see it when he is in house
  endFollow:function() {
    msg("'Wait here,' says Mandy to {nm:npc:the}.", {npc:obj})
    return falsemsg("'I wasn't going nowhere!'")
  },
  startFollow:function() {
    msg("'Follow me,' says Mandy to {nm:npc:the}.", {npc:obj})
    return falsemsg("'If it's all the same to you, I'll stay here.'")
  },
  getAgreement:function(verb, item) {
   if (verb !== 'Repair') return falsemsg("'Sorry, lady-giant, I've got to much to do here. In fact I best get on.'")
    if (item !== w.boots && item !== w.tiny_shoes) return falsemsg("'Sorry, lady-giant, I can do shoes, maybe boots at a push, but... No, not that.'")
    return true
  },
  take:function() {
    return falsemsg("Mandy tries to grab the tiny man, because a four inch high man has to score a few views on Youtube, but he dodges out of the way. 'Ere, wot you playin' at?' he demands. 'You keep yer 'ands off!'")
  },
  askOptions:[
    { name:'Himself',
      test:function(p) { return p.text.match(/himself|who he|man/) || (p.text.match(/he is/) && p.text2 === 'who')}, 
      msg:"'Who are you?' says Mandy.|He shrugs. 'Name's Cuthbert, but most call me Big Bert.'|'Why do they call you \"Big Bert\"?'|'It's short for Cuthbert, see?'",
    },
    { name:'House',
      test:function(p) { return p.text.match(/doll\'?s?\'? ?house/) },
      msg:"'Nice house,' says Mandy politely. 'Is it your?'|'I should be so lucky! I'm just here mending some shoes. They've got some great tools.'",
    },
    { name:'Escape',
      test:function(p) { return p.text.match(/escape|way out|get out|house/) },
      msg:"'I don't suppose you know how I can get out of this stupid house?'|The little man looks around him at the doll's house, then at Mandy. 'You're not in it, love.'|'No, not that house, this one!' She points vaguely around the nursery.|'Wait, I'm in a house inside another house? Stone the crows! If that don't beat all!' Clearly he was not going to be much use in that regard.",
    },
    { name:'Shoes',
      test:function(p) { return p.text.match(/shoes/) },
      msg:"'Are you making those shoes or mending them?'|'Mending 'em. Be good as new when I've done with 'em.'|'Whose are they?'|'Mine! You think I go around mending random shoes? Strange hobby that would be!'",
      script:function() { w.tiny_man.askedAboutShoes = true },
    },
    { // Mannequins
      test:function(p) { return p.text.match(/mannequin/) && w.brass_dining_room.visited > 2 },
      msg:"'What's the deal with the mannequins in the dining room?'|The little man look through a doorway, into the dining room of the doll's house. 'Don't see no mannequins in there, love.'",
    },
    { name:'Silvers',
      test:function(p) { return p.text.match(/silver/) && player.silverSpotted > 0 },
      msg:"'What's the deal with the Silvers - the guy in silver I saw?'|'I don't know. Something weird about them, if you ask me. I just keep me head down when they're around.'",
    },
    {
      name:'Boots',
      test:function(p) { return p.text.match(/boot/) },
      script:function() {
        w.boots.doRepair()
      },
    },
    {
      test:function(p) { return p.text.match(/small|tiny/) },
      script:function() {
        msg("'I can't help noticing...,' says Mandy wondering how she say this, 'that you quite... well, small.'");
        msg("'Or maybe you're freakishly tall.'");
        msg("'Well, maybe. But this room looks to me like a nursery for people my  size, and you're in a toy house.'");
        msg("'Ah, that coz this 'ouse went big. Never used to be. I got trapped 'ere, see? In this 'ouse when it was normal-sized. Went exploring, trying to find a way out, like, walked in this room with all the signs of the zodiac on the rub. As I looked at, the whole house grew! Suddenly I `ad to walk miles to get anywhere. Eventually I found this place, what's a bit more my size, what with the {class:riddle:little things} in it.'");
        msg("`How long ago was that?' asks Mandy")
        msg("'Only about ten minutes, maybe twenty.' Mandy thinks about the balloon, and wonders how many years it has really been.")
        
      },
    },
    {
      test:function(p) { return p.text.match(/doctor|winfield|malewicz|man/) },
      script:function() {
        msg("'Do you know a Dr Winfield Malewicz?' says Mandy. 'I've got a letter for him.'|He looks Mandy up and down. 'I swear postmen get younger ever day! And bigger too. Yeah, I know the doctor. Weird guy, 'as an 'house on me route.'")
        msg("'Your route?'")
        msg("'Yeah, me route, when I'm deliverin' coal. Up Highfield Lane as I recalls. God knows what me customers are doing with no coal! Must be days now.'")
      }
    },
    {
      test:function(p) { return p.text.match(/balloon/) },
      script:function() {
        msg("'What's the deal with the balloon?' asks Mandy")
        msg("The tiny man looks out the window. 'Yeah, I saw that floating up there when I got here, like some great floaty yellow thing. Big ain't it?'")
        if (w.dollshouse.openCount > 3) {
          msg("'I was more concerned with the way it seems to rewind time when it hits the floor.'")
          msg("'You what? You on drugs on summit?' Being in the middle of it, he may not realise anything odd is happening, it occurs to Mandy.")
        }
      },
    },
    {
      test:function(p) { return p.text.match(/hamlet/) },
      script:function() {
        msg("'I don't suppose you know any Shakespeare?' asks Mandy. 'Hamlet in particular.'")
        msg("'Do I look like a toff?'")
      },
    },
    {
      test:function(p) { return p.text.match(/past|origin|career|job|deliver/) },
      script:function() {
        msg("'What did you do before you got trapped here?' asks Mandy")
        msg("'I'm a coal merchant. I was just 'ere bring round a sack of coal, when I kind of got sucked inside. {class:riddle:Drag me down,} it did! That was weeks ago. What's happened to my business?' Mandy decides not to tell him the entire coal industry is dead in England, and no one has coal fires any more.")
      },
    },
    {
      test:function(p) { return p.text.match(/letter/) },
      script:function() {
        msg("'You know anything about this letter?' asks Mandy")
        msg("'What am I, a postman?'")
      },
    },
    {
      test:function(p) { return p.text.match(/telescope|observatory/) },
      script:function() {
        msg("'What's the deal with the telescope in the observatory?' asks Mandy")
        msg("'Observatory? You 'aving a laugh! I bin delivering round here for years; and ?I can tell you, this is a 'ouse, ain't got no observatory. '")
        msg("'You must've noticed it's a lot bigger than it should be from the outside.'")
        msg("'Lot of 'ouses look big 'un there are. Clever use of furniture, that's the trick.'")
      },
    },
    {  // !!!
      test:function(p) { return p.text.match(/live/) && p.text2 === 'where' },
      alias:"So where do you live?",
      script:function() {
        msg("'So where {i:do} you live?'");
        msg("'14 Clarence Street. Least, that's where I lived before I come in 'ere.'");
        msg("'Clarence Street? I know that road, Charlene Porter lives there.' It is a terrace house, built in the later nineteenth century, near the centre of town.");
        msg("'I don't know no Charlene. French is she?'");
      },
    },
    {
      script:function(p) {
        w.tiny_man.badTopicCount++
        msg("Mandy asks the little man about " + p.text + ".")
        msg("'What the..?' he replies, 'Ask me about a topic what I know about.'")
        if (w.tiny_man.badTopicCount > 7) msg("'Do you know about anything?' asks Mandy getting increasingly frustrated.|'Not a lot, no.'")
      }
    },
  ],
  badTopicCount:0,
  tellOptions:[
    {
      test:function(p) { return true },
      script:function(p) {
        msg("Mandy starts to tell the tiny man about " + p.text + ".")
        msg("He looks at her, 'Listen giant-lady, I don't really care.{once: Maybe these things are important in the giant world, but not in mine.}'")
      }
    },
  ],
  receiveItemsFailMsg:"Mandy gives {nm:item:the} to the tiny man. 'What'd I want something like that for?' he asks.",
  receiveItems:[
    {
      item:w.boots,
      f:function(options) {
        if (w.boots.size !== 4) {
          return falsemsg("Mandy gives {nm:item:the} to the tiny man. 'What'd I want something like that for?' he asks.|'I thought you might be a cobbler elf.'|'A what? Are you taking the piss?'|'No! It's just you're quite... small.|'I'm normal size, I am. You're the freak, lady-giant. I can't fix no giant lady boots; I only do {i:normal-size} footwear.'", options)
        }

        if (w.tiny_man.state !== 1 || w.boots.size !== 4) {
          msg("Mandy gives the small boots to the tiny man. 'What'd I want something like that for?' he asks.|'I thought you might be a cobbler elf.'|'A what? Are you taking the piss?'|'No! It's just you're quite... small.|'I'm normal size, I am. You're the freak, lady-giant. Though I suppose I {i:could} fix them.' He starts to examine the hole in the boot.")
        }
        else {
          msg("Mandy gives the boots to the tiny man. 'I'll get on that as soon as I've done these,' he says.")
          msg("{ifExists:yellow_balloon:loc:Mandy glances at the balloon. }'I don't suppose you could do it now?' She smiles sweetly at him, making him jump back from his seat in horror.") 
          msg("'Okay, okay, giant-lady! Whatever you say!' He drops the shoes, and starts to examine the hole in the boot.")
        }
        w.boots.loc = 'tiny_man'
        w.tiny_man.bootsState = 2
        w.tiny_man.agenda = ['wait:3', 'run:agendaBootsDone']
      }
    },
    {
      test:function(options) { return options.item.name.startsWith('tamarind_pod_prototype') },
      f:function(options) {
        msg("Mandy gives the tamarind pod to the tiny man. 'What'd I want something like that for?' he asks.|'I thought you might be able to cut it open,' says Mandy. 'You know, with your little tools.'|'My what?'|'Er, your normal-sized tools?'")
        if (options.item.size > 4) {
          msg("He shrugs. 'Give it a go.' He grabs and hammer and chisel, and sets about trying to break into the pod.")
          w.tiny_man.breakingIntoPod = options.item.name
          w.tiny_man.agenda = ['wait', 'wait', "text:'It's a right tough one, this,' the tiny man notes, as he catches his breath, 'but I'll get into it, {class:riddle:one way or another}.' He starts banging the hammer on the chisel again. Mandy wonders if he should be using a mallet, but says nothing.", 'wait', 'run:agendaPodDone']
        }
        else {
          const count = random.int(3, 5)
          msg("He shrugs. 'Should be easy enough.' He grabs and hammer and chisel, and sets the chisel to the pod. He gives it a gentle tap, and the pod splits open, to reveal " + count + " seeds.")
          if (!w.tamarind_seed.countableLocs[player.name]) w.tamarind_seed.countableLocs[player.name] = 0
          w.tamarind_seed.countableLocs[player.name] += count
        }
        delete options.item.loc
      },
    },
  ],
  talkto:function() {
    msg("Mandy wonders what {i:topics} she could {i:ask the tiny man about}...")
    return false
  }
})





createItem("tiny_shoes", {
  loc:"nursery",
  scenery:true,
  examine:"The tiny shoes are brown; they lace up and are rather pointed at the toe.",
  take:"Mandy tries to grab the shoes, but the tiny man is too quick for her. 'They're not your!'",
  repair:function(options) {
    if (options.char === player) return falsemsg("With the best will in the world, Mandy is not going to be ablke to repair the shoes. Better leave it to the cobbler elf...")
    if (w.tiny_man.bootsState === 2) return falsemsg("'So can you fox those shoes?' asks Mandy.|'Not while I'm doin' this I can't.'")
    msg("'So can you fox those shoes?' asks Mandy.|'Reckon so!'")
    return true
  }
})