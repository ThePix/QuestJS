"use strict"

register('flora', {
  book:'A Midsummer Night\'s Dream',
  uniform:'a green and purple school uniform that feels strangely comfortable, even if it looks appalling',
  smell:'The room smells quite nice, full of blossoms and springtime.',
  listen:'If she strains, Mandy can hear a quiet humming, like a bee maybe.',
  floor:"The floor is a lattice of wrought iron, painted white, and flaking in a few places.",
  walls:"The walls are windows, in white frames.",
  ceiling:"The roof is way over Mandy\'s head, forming an arch of windows.",
})











createRoom("greenhouse_west", {
  windowsface:'north',
  alias:'west end of the greenhouse',
  headingAlias:'The Greenhouse (West)',
  seenFlag:false,
  desc:"{floraDesc}She is standing on an east-west path between two wide flowerbeds. All manner of plants are growing, but it seems the gardener has made some selections, as all the flowers are red. Mandy cannot identify many of them, but can see poppies, marigolds and chrysanthemums. No carnations, as far as she can see. {once:Mandy remembers the roses in the garden; odd that they never flower, and yet here nearly everything is in flower. }Even the trees have red flowers. She recognises a bottlebush tree, though much bigger than the one her father has and not currently in bloom.{floraFlowerBed} Nearby, bolted to the west wall, left of the doorway, is a huge metal box that stretches up about three storeys.",
  west:new Exit("steam_hall"),
  east:new Exit("greenhouse_east"),
  up:new Exit("_", {
    alsoDir:['climb'],
    isHidden() { return (w.grown_tamarind_tree.growthTime < 9) },
    simpleUse:function(char) {
      if (char === w.Patch) {
        if (w.grown_tamarind_tree.growthTime < 9) return falsemsg("Patch looks around, confused, wondering what he should be climbing.")
        if (w.Patch.huggingTree) return falsemsg("'Climb the stupid tree,' says Mandy. Patch looks forlornly up the tree he is hugging.")
        let s = "Patch eyes up "
        if (w.grown_tamarind_tree.seedsPlanted === 1) {
          s += "the tamarind tree"
        }
        else {
          s += "one of the tamarind trees"
        }
          
        s += " , then steps closer, putting both arms round it. He pauses, and looks up, then down again, then up again. Apparently, climbing is not his thing."
        msg(s)
        w.Patch.huggingTree = true
        w.Patch.goUpDirection = 'up'
        return true
      }
      
      if (w.grown_tamarind_tree.seedsPlanted === 0) return falsemsg("Mandy looks around, but there is nothing suitable to climb here.")
      if (w.hourglass.active) return falsemsg("Mandy looks at the rapidly grow tamarind plant thoughtfully. If she grabs on to it now, it will take her up with it as it grows! Steps closer, and her foot starts to blur, and feel numb. A moment later she is feeling nauseated. She steps back, trying to catch her breath. Perhaps not such a great idea...")
      if (w.grown_tamarind_tree.growthTime < 9) return falsemsg("Mandy looks at the {nm:item:false:false:count_this} thoughtfully. If {nv:item:were} more substantial, she could climb {ob:item}.", {item:w.grown_tamarind_tree, count_this:'seedsPlanted'})
      if (w.grown_tamarind_tree.growthTime < 12) {
        msg("Mandy appraises the tree. It has been a while, but she can climb that. She grabs a lower branch, and hauls herself up.")
        player.moveChar(new Exit('up_a_tree', this))
        return true
      }
      if (w.Patch.isHere() && w.Patch.huggingTree) {
        msg("Mandy appraises the tree, with Patch still hugging it. She could use Patch to get up it. 'Er, just, hold still,' she tells him, as she grabs his solid arm, and starts to haul herself up. 'And keep looking downwards!' She pulls herself up onto his shoulder, and from there she grabs a lower branch, and hauls herself up.")
        player.moveChar(new Exit('up_a_tall_tree', this))
        return true
      }
      if (w.grown_tamarind_tree.seedsPlanted > 5) {
        msg("Mandy appraises the tangle of trees... The way they have knotted together should make climbing them, well, not exactly easy, but possible. She grabs a trunk that has bend almost horizontal, and pulls herself up. From there, she can reach another, not quite so flat, and up further into the trees.")
        player.moveChar(new Exit('up_a_tall_tree', this))
        return true
      }
      
      if (w.grown_tamarind_tree.seedsPlanted > 1) return falsemsg("Mandy looks up at the trees; they are certainly high enough that if she could climb them, she could reach across to the top of the metal box, but they are too tall to climb. The lowest branches are way out of reach.")
      return falsemsg("Mandy looks up at the tree; it is certainly high enough that if she could climb it, she could reach across to the top of the metal box, but it is too tall to climb. The lowest branches are way out of reach.")
    },

  }),
  scenery:[
    { alias:'marigolds', examine:'There are at least three cultivars of marigolds: one has flowers that are red with a yellow centre; another has red petals fringed with yellow; and a third is plain red.' },
    { alias:'chrysanthemums', examine:'As she looks closer, she wonders if these are actually carnations.' },
    { alias:'carnations', examine:'She cannot decide if they are chrysanthemums or carnations.' },
    { 
      alias:'bottlebush tree', 
      examine:'The bottlebush tree is about five metres tall; a straight trunk rising a metre or so to a mass of leaves and red flowers.',
      goUpItem:'The bottlebush tree is too small to climb - the trunk would probably snap if Mandy tried.',
    },
    { alias:['flower beds', 'flowerbeds', 'flowers'], examine:'Apart from one strangely bare patch, the flowerbeds are crammed with flowers and other plants, so much so that the edges are almost obscured.' },
    { alias:'framework', examine:'The metal framework extends all the way to the roof, and Mandy suspects all the way to the floor, though it is hidden by the metal box. She guesses the lift runs inside it.' },
    { alias:['catwalk'], examine:'The catwalk over Mandy\'s head follows the path she is on, east to west, and looks to be suspended from the roof. It is painted white.', },
    { alias:['plants', 'bushes'], examine:'The plants fill out the entire flowerbeds on either side of the path, except for one patch. There must be dozens of varieties; all that are in bloom have red flowers, but many are not. It would be cool if when the red ones dies, the next ones to flower would be yellow, muses Mandy - it would be like a very slow traffic light. Except there are no green flowers.', },
    { alias:['trees'], examine:'There are various species of tree, the only one she recognises is the bottlebush tree.'},
  ],
})
createItem("poppies", {
  loc:"greenhouse_west",
  synonyms:['poppy'],
  scenery:true,
  smell:"Mandy wonders how the poppies smell, and is about to take a sniff when she remembers that scene in the Wizard of Oz. Probably better not to risk it.",
  pronouns:lang.pronouns.plural,
  examine:'There is a large flowerbed with poppies growing. They look slightly past their prime; a little wilted.' ,
})
tp.addDirective("floraFlowerBed", function(arr, params) {
  if (w.grown_tamarind_tree.growthTime === 0) {
    let s = " Mandy can see a patch of bare earth"
    if (arr[0]) s += " down below"
    s += ", with a pedestal beside it."
    if (w.hourglass.loc === 'pedestal') s += " There is {select:hourglass:size:::::a tiny:an:a large:} hourglass on the pedestal."
    return s
  }

  let s = " Mandy can see {nm:item:count:false:count_this} growing in the previously bare patch of earth"
  if (arr[0]) s += " down below"
  s += ", with a pedestal beside it."
  if (w.hourglass.loc === 'pedestal') s += " There is {select:hourglass:size:::::a tiny:an:a large:} hourglass on the pedestal."
  if (w.grown_tamarind_tree.seedsPlanted > 5) {
    if (w.grown_tamarind_tree.growthTime > 8) {
      s += ' The trees have become tangled together, and look a like freaky mutants to Mandy.'
    }
    else if (w.grown_tamarind_tree.growthTime > 5) {
      s += ' The plants are entwined around each other.'
    }
  }
  return processText(s, {item:w.grown_tamarind_tree, count_this:'seedsPlanted'}) 
})
tp.addDirective("floraDesc", function(arr, params) {
  if (w.greenhouse_west.seenFlag) return ''
  w.greenhouse_west.seenFlag = true
  return 'Just for a moment, Mandy thinks she is outside -- all she can see is trees, bushes and plants. But no, above there is a roof, and walls can be seen all around her; this is a greenhouse. Or perhaps a conservatory or orangery, as it is attached to the house. Mandy looks around. In her mind, she will call it a greenhouse, she decides. '
})
tp.addDirective("tamarind", function(arr, params) {
  return w.bare_earth.seedsPlanted > 1 ?  arr[1] : arr[0]
})
createItem("metal_box", {
  isLocatedAt:function(loc) { return loc === 'greenhouse_west' || loc === 'greenhouse_catwalk_west' },
  alias:'metal box',
  scenery:true,
  examine:"Looking closer, Mandy can see that the metal box is brass plating around a mechanism or device of some sort. It is quite smooth for about four metres of its height, but above that she can see the open framework.{if:lift:getTransitDestLocation:steam_control_room: She can see some kind of platform, a lift maybe, inside it, way above her head.}"
})
createItem("lift_fake_flora", {
  alias:'lift',
  synonyms:['elevator', 'platform', 'device', 'mechanism'],
  isLocatedAt:function(loc) {
    if (loc === "greenhouse_catwalk_west" || loc === "greenhouse_west") return true
    return false
  },
  examine:'Mandy realises the metal box is a lift-shaft. The lift itself must be accessed from the room to the west.',
  scenery:true,
  calllift:function() {
    msg("Mandy can see no way to call the lift, but given the door in on the other side of the shaft, that is no surprise.")
  },
  standon:'The lift is too far away for Mandy to stand on.',
})

createItem("pedestal", SURFACE(), {
  loc:'greenhouse_west',
  scenery:true,
  examine:function() {
    let s = 'The pedestal is made of pale grey stone, and is about waist height.'
    const contents = this.getContents()
    if (contents.length !== 0) {
      msg(s + ' There {cj:item:be} {nm:item:a} on it.', {item:contents[0]})
    }
    else {
      msg(s)
    }
  },
  testDropIn:function(options) {
    const contents = this.getContents()
    if (contents.length === 0) return true
    return falsemsg("Mandy thought about putting {nm:o1:the} on the pedestal. Of course, she would have to take {nm:o2:the} off it first.", {o1:options.item, o2:contents[0]})
  },
})

createItem("hourglass", SIZE_CHANGING(), {
/*
Can vary in size from 4 to 7; can be filled when 7 but not taken
fillState can be from 1 to 5, how much sand in total is in there
state can be from 0 to 100, how much sand is in the upper bulb
max number of grow turns is 13
*/
  loc:'pedestal',
  synonyms:['bulb'],
  fillState:1,  // max is 5
  state:0,
  indefArticle:'an',
  afterSizeChange:function() { this.indefArticle = this.alias.startsWith('hour') ? 'an' : 'a' },
  getIncrement:function() { 
    if (this.size === 4) return 100
    if (this.size === 5) return 100 / (this.fillState / 3 + 1)
    if (this.size === 6) return 100 / (this.fillState * 2 + 2)
  },
  
  desc4:"The hourglass has two connected glass bulbs, with a small amount of sand in the lower one, inside a delicate wooden frame. It is about the size of a thimble.",
  desc5:"The hourglass has two connected glass bulbs, with a small amount of sand in the lower one, inside a wooden frame, and is about as tall as her hand is long. There is a small protrusion on one bulb, near where they join. {hourglass}",
  desc6:"The hourglass, which comes up to about her waist, has two connected glass bulbs, with a small amount of sand in the lower one, inside a sturdy wooden frame. One bulb has a small opening near where the bulbs join, with a tap. {hourglass}",
  desc7:"The hourglass towers over Mandy; each bulb is as tall as she is. The lower bulbs has a large opening at the top, with a tap.{hourglass}",
  desc8:"The hourglass is the size of a skyscraper! {hourglass}",
  examine:function(options) {
    if (this.size < 4) {
      msg("{nv:item:be:true} too tiny to see properly!", {item:this})
    }
    else if (this.size > 7) {
      msg("{nv:item:be:true} of gigantic proportions!", {item:this})
    }
    else {
      msg(this['desc' + this.size])
    }
    return true
  },
  protrusionDescriptions:[
    '','','','',
    'Mandy can just about feel there is something there; a slight point on the otherwise smooth surface of the tiny glass bulb.',
    'The protrusion on the hourglass bulb is a tiny tap.',
    'The protrusion on the hourglass bulb is a small opening with a simple tap.',
    'The protrusion is a large opening in the bulb of the hourglass. There is a simple tap to open and close it.{ifNot:protrusion:closed: The tap is open.}',
  ],
  smash:"Feeling increasing frustrated, Mandy feels an urge to smash the stupid hourglass. She takes a deep breath. Best not to, she decides, just in case it is important.",
  msgDropIn:function(options) {
    if (options.container === w.pedestal) {
      msg("Mandy feels a slight jolt, like static electricity, as she places the hourglass on the pedestal.")
    }
    else {
      msg(lang.done_msg)
    }
    
  },
  afterMove:function(options) {
    if (options.fromLoc === "pedestal") {
      w.grown_tamarind_tree.magicGrowthEnd()
    }
    if (options.toLoc === "pedestal" && this.state > 0) {
      this.activate()
    }
    else {
      this.active = false
    }
  },
  testFill:function(options) {
    if (this.fillState > 4) return falsemsg("The lower chamber of the hourglass is already full.")
    if (w.chamber_pot.loc === player.name && w.chamber_pot.containedFluidName === 'sand') return true
    if (w.chamber_pot.loc === player.name && w.chamber_pot.containedFluidName === 'water') return falsemsg("Mandy thinks about pouring water into the hourglass; that would probably stop it working altogether, and it would be impossible to get the water out again. She decides not to.")
    if (options.fluid === 'water') return falsemsg("Mandy thinks about pouring water into the hourglass; that would probably stop it working altogether, and it would be impossible to get the water out again. She decides not to.")
      
    
    if (currentLocation === w.beach || currentLocation === w.rocky_beach) return falsemsg('Mandy considers filling the hourglass -- but she would need something to put the sand in first.')
    return falsemsg("Mandy wonder how she can fill the hourglass.")
  },
  fill:function(options) {
    if (!util.findSource(options)) return falsemsg(lang.no_generic_fluid_here, {item:this})
    options.item = this
    if (this.testFill && !this.testFill(options)) return false
    return this.sink(options.fluid, options.char, options.source)
  },
  flip:function() { this.turn() },
  turn:function() {
    if (this.size > 6) {
      msg("Mandy looks at the giant hourglass. No way is she turning that over!")
      return false
    }
    if (w.Patch.huggingTree) {
      msg("Patch steps away from the tree, perhaps sensing something is about to happen.")
      w.Patch.huggingTree = false
      delete w.Patch.goUpDirection
    }
    if (w.grown_tamarind_tree.growthTime > 0) {
      let s
      if (w.paper_funnel.loc === 'protrusion') {
        w.paper_funnel.loc = player.name
        w.protrusion.closed = true
        s = "Mandy takes the paper funnel out of the hourglass, checks the tap is closed, then picks it up to turn it over."
      }
      else if (w.protrusion.closed) {
        s = "Mandy picks up the hourglass to turn it over."
      }
      else {
        w.protrusion.closed = true
        s = "Mandy closes the tap of the hourglass, picks it up to turn it over."
      }
      s += " As she does, {nv:item:wither} away to nothing."
      if (doOnce(this, 'flagWithered')) s += " 'Shit...' she mutters in disappointment."
      s += " She turns the hourglass over, and puts it down again."
      w.grown_tamarind_tree.seedsPlanted = 0
      w.grown_tamarind_tree.growthTime = 0
      msg(s, {item:w.grown_tamarind_tree})
    }
    else {
      if (w.protrusion.closed) {
        msg("Mandy turns the hourglass over.")
      }
      else {
        w.protrusion.closed = true
        msg("Mandy closes the tap of the hourglass, then turns it over.")
      }
    }
    this.state = 100 - this.state + this.getIncrement()
    if (this.loc === 'pedestal') this.activate()
    return true
  },
  activate:function() {
    this.active = true
    w.grown_tamarind_tree.seedsPlanted = w.tamarind_seed.countAtLoc("bare_earth")
    w.grown_tamarind_tree.update()
    w.tamarind_seed.takeFrom("bare_earth", w.grown_tamarind_tree.seedsPlanted)
  },
  reporting:function() {
    if (this.loc === player.loc) return true
    if (this.loc === player.name) return true
    if (this.loc === 'pedestal' && player.loc === 'greenhouse_west') return true
    return false
  },
  eventPeriod:1,
  eventIsActive:function() { return this.state > 0 },
  eventScript:function() {
    this.state -= this.getIncrement()
    const roundedState = Math.round(this.state)
    if (roundedState > 0) {
      if (this.reporting()) {
        if (roundedState > 99) {
           msg("All the sand is in the upper bulb in the hourglass.")
        }
        else {
           msg("As time passes, sand falls from the upper bulb of the hourglass; it now has about " + roundedState + "% of the sand left in it.")
        }
      }
      if (this.loc === "pedestal") w.grown_tamarind_tree.magicGrowth()
    }
    else {
      if (this.reporting()) msg("As time passes, sand falls from the upper bulb of the hourglass; it is now empty.")
      this.active = false
      if (this.state < 0) this.state = 0
      //w.grown_tamarind_tree.magicGrowthEnd()
    }
  },
  //vessel:true,
  sink:function(fluid, char, vessel) {
    if (this.size < 7 && w.paper_funnel.loc !== 'protrusion') return falsemsg("Mandy thinks about getting the sand into the hourglass... There is no way she is getting it though that narrow opening.")
    if (this.size < 5 && w.paper_funnel.loc === 'protrusion') return falsemsg("Mandy thinks about getting the sand into the hourglass... There is no way she is getting it though that narrow opening, even with the paper funnel.")
    if (this.size < 5) return falsemsg("Mandy thinks about getting the sand into the hourglass... There is no way she is getting it though that narrow opening.")
      
    delete vessel.containedFluidName

    if (w.chamber_pot.size > 4) this.fillState += w.chamber_pot.size === 5 ? 1 : 5
    if (this.fillState > 5) this.fillState = 5
    let s
    if (w.protrusion.closed) {
      s = "Mandy opens the tap, and carefully empties {nm:item:the} into the huge hourglass."
      w.protrusion.closed = false
    }
    else {
      s = "Mandy carefully empties {nm:item:the} into the huge hourglass."
    }
    if (this.fillState === 5) {
      s += " The lower bulb looks to be full."
    }
    else {
      s += " The lower bulb looks to be about " + lang.toWords(this.fillState) + " fifths full to Mandy's eye."
    }
    msg(s, {item:vessel} )
    return true
  },
  handleInOutContainer:function(options, objects) {
    return handleInOutContainer(options.char, [objects, [w.protrusion]], "drop", handleSingleDropInContainer)
  },
  open:function(options) { w.protrusion.open(options) },
  close:function(options) { w.protrusion.close(options) },
})
w.hourglass.maxsize = 7
createItem("protrusion", COMPONENT("hourglass"), CONTAINER(true), {
  examine:"{select:hourglass:protrusionDescriptions:size}",
  synonyms:['tap', 'opening'],
  msgOpen:'Mandy opens the tap on the side of the hourglass bulb.',
  msgClose:'Mandy closes the tap on the side of the hourglass bulb.',
  containerIgnoreClosed:true,
  switchon:function(options) { return this.open(options) },
  switchoff:function(options) { return this.close(options) },
  testDropIn:function(options) {
    if (options.item !== w.paper_funnel) return falsemsg("Mandy cannot put {nm:item:the} in the hourglass.", options)
    // okay if pf.s === hg.s + 1
    if (w.paper_funnel.size > this.size + 1) return falsemsg("The paper funnel is too big to fit in the tap of the hourglass.")
    if (w.paper_funnel.size < this.size + 1) return falsemsg("The paper funnel is too small to fit in the tap of the hourglass.")
    return true
  },
  openMsg:function(options) {
    options.list = this.listContents(world.LOOK)
    msg(this.msgOpen, options)
  },
})
tp.addDirective("hourglass", function(arr, params) {
  let s
  if (w.hourglass.state > 0) {
    s = "The upper bulb in the hourglass is about " + Math.round(w.hourglass.state) + "% full."
  }
  else if (w.hourglass.fillState === 5) {
    s = "The upper bulb in the hourglass is empty, the bottom full."
  }
  else if (w.hourglass.fillState === 1) {
    s = "The upper bulb in the hourglass is empty, but even so the lower bulb is only about a fifth full."
  }
  else {
    s = "The upper bulb in the hourglass is empty, but even so the lower bulb is only " + lang.toWords(w.hourglass.fillState) + " fifths full."
  }
  if (w.paper_funnel.loc === 'protrusion') s += ' There is a paper funnel in it.'
  return s
})

createItem("bare_earth", CONTAINER(), {
  loc:'greenhouse_west',
  scenery:true,
  seedsPlanted:0,
  synonyms:['ground', 'patch of bare earth'],
  parserPriority:-10,
  examine:"{floraFlowerBed}",
  testDropIn:function(options) {
    if (options.item.alias === 'tamarind pod') return falsemsg('Mandy wonders if burying the tamarind pod is going to achieve anything. She has a feeling she really needs to get the seeds out first.')
    if (options.item.name !== 'tamarind_seed') return falsemsg('Mandy wonders if burying {nm:item:the} is going to achieve anything. Probably not.', {item:options.item})
    if (w.hourglass.active) return falsemsg('Mandy starts to put another {nm:item:} in the ground, but as her hands get near, they start to blur, and feel numb. Perhaps not such a good idea when the hourglass is running.', {item:options.item, item_count:options.count})
    return true
  },
  testTakeOut:function(options) {
    if (w.hourglass.active) return falsemsg('Mandy starts to dig {nm:item:the} from the ground, but as her hands get near, they start to blur, and feel numb. Perhaps not such a good idea when the hourglass is running.', {item:options.item, item_count:options.count})
    return true
  },
  dig:"Mandy puts her fingers into the bare earth, feeling its moist texture on her fingers, and through it a strange, primordial connection to the entire world, the entire cosmos even. 'I, like, really dig this bare earth, Man!' she says.|She shakes her head. 'What the... Am I becoming a hippy? This place is really screwing with me.'",
})

createItem("grown_tamarind_tree", {
  alias:'tamarind tree',
  isLocatedAt:function(loc) { return loc === 'greenhouse_west' && this.seedsPlanted > 0 && this.growthTime > 0 },
  seedsPlanted:0,
  growthTime:0,
  synonyms:['tamarind plants', 'tamarind seedlings', 'tamarind trees'],
  saveLoadExcludedAtts:['growDescs', 'examineDescs'],
  parserPriority:50,
  goUpDirection:'up',
  examine:function() {
    let s = "Mandy can see {nm:item:count:false:count_this}."
    if (this.seedsPlanted > 5) {
      if (this.growthTime > 8) {
        s += ' The trees have become tangled together, and look a like freaky mutants to Mandy.'
      }
      else if (this.growthTime > 5) {
        s += ' The plants are entwined around each other.'
      }
    }
    msg(s, {item:w.grown_tamarind_tree, count_this:'seedsPlanted'}) 
  },
  countable:true,
  getDescId:function() {
    let n = this.seedsPlanted - 1
    if (this.seedsPlanted > 3) n = 2
    if (this.seedsPlanted > 5) n = 3
    return 4 * this.growthTime + n - 4
  },
  getHeight:function() {
    const n = Number(Math.pow(2, this.growthTime/1.3).toPrecision(1))
    let s = n >= 100 ? lang.toWords(n / 100) + ' metre' : lang.toWords(n) + ' centimetre'
    if (n !== 1 && n !== 100) s += 's'
    return s
  },
  afterLoad:function() {
    this.update()
  },
  update:function() {
    this.pronouns = this.seedsPlanted === 1 ? lang.pronouns.thirdperson  : lang.pronouns.plural
    w.grown_tamarind_tree_from_catwalk.pronouns = this.seedsPlanted === 1 ? lang.pronouns.thirdperson  : lang.pronouns.plural
    let alias = this.growthTime < 4 ? 'shoot' : (this.growthTime < 9 ? 'plant' : 'tree')
    this.setAlias(alias)
  },
  magicGrowth:function() {
    if (this.seedsPlanted === 0) return
    this.growthTime++
    this.update()
    if (player.loc === 'greenhouse_west') msg("Mandy watches as {nv:item:grow:false:count_this}; {nv:item:be:false:suppressCount} now about {show:grown_tamarind_tree:getHeight} high.", {item:w.grown_tamarind_tree, count_this:'seedsPlanted', suppressCount:'seedsPlanted'})
  },
  magicGrowthEnd:function() {
    if (this.seedsPlanted === 0) return
    msg("{nv:item:wither:true:suppressCount} away to nothing.", {item:w.grown_tamarind_tree, suppressCount:'seedsPlanted'})
    this.seedsPlanted = 0
    this.growthTime = 0
  },
  climbverb:function(options) {
    return currentLocation.up.use(options.char)
  },
  hug:function(options) {
    if (options.char === player) {
      msg("Mandy gives the tree a hug, because maybe showing it some love will encourage it to drop a pod.|It does not.")
      return true  
    }
    if (options.char === w.Patch) {
      msg("Patch gives Mandy a quizzical look, but then goes to the tamarind tree, and gives it a big hug.")
      w.Patch.huggingTree = true
      w.Patch.goUpDirection = 'up'
      return true  
    }
    return falsemsg("{nv:char:be:true} not about to do that!", {char:options.char})
  },
})

createRoom("up_a_tree", {
  alias:'a tamarind tree',
  headingAlias:'Up A Tamarind Tree',
  properNoun:true,
  noFollow:true,
  windowsface:'none',
  desc:"Mandy is up a tamarind tree. She is almost up as high as the catwalk... And well short of the top of the metal box.",
  down:new Exit("greenhouse_west", {msg:'Mandy carefully climbs back down.'}),
})

createRoom("up_a_tree_item", {
  alias:'tamarind tree',
  loc:"up_a_tree",
  examine:"The tree is a few metres tall, but the higher branches are too think to support Mandy.",
  goDownDirection:'down',
})

createRoom("up_a_tall_tree", {
  alias:'a tall tamarind tree',
  headingAlias:'Up A Tall Tamarind Tree',
  properNoun:true,
  noFollow:true,
  windowsface:'none',
  desc:"Mandy is up a tall tamarind tree. She is higher than the catwalk, to the north, and could probably reach the top of the metal box to the southwest.",
  down:new Exit("greenhouse_west", {msg:'Mandy carefully climbs back down, dropping the last couple of metres to the ground.'}),
  north:new Exit("greenhouse_catwalk_west", {msg:'Mandy gingers edges along a stout branch. It starts to drop alarmingly, but she manages to grab the catwalk, and scramble onto the walkway.'}),
  southwest:new Exit("lift", {
    msg:'Mandy looks at the top of the metal box.. She can do this. She edges along a sturdy looking branch, and reaches out, triumphantly grabbing a metal bar that runs across the top of the box. The branch starts to sag alarmingly, and she quickly hauls herself onto the platform.',
    isHidden:function() { return w.lift.getTransitDestLocation() !== w.steam_control_room },
    simpleUse:function(char) {
      if (w.lift.getTransitDestLocation() !== w.steam_control_room) return falsemsg("Mandy looks at the top of the metal box, and realises the lift is not there. It would be a bad idea heading that way, she decides.")
      return util.defaultSimpleExitUse(char, this)
    },
  }),
})

createRoom("up_a_tall_tree_item", {
  alias:'tamarind tree',
  loc:"up_a_tree",
  examine:"The substantial tree is several metres tall, strong enough to support Mandy even this far up.",
  goDownDirection:'down',
})



createRoom("greenhouse_catwalk_west", {
  alias:'west end of the greenhouse catwalk',
  headingAlias:'The Greenhouse (West, On Catwalk)',
  windowsface:'none',
  desc:"{floraDesc}She is standing on a catwalk, suspended from the ceiling by metal rods. From here she can reach out and touch the leaves of the trees, and look down on the beautiful red flowers below. The catwalk continues to the east; the only other direction is the door to the west.{floraFlowerBed:true} Against the west wall, there is a huge metal box, with some kind of framework above it.{ifMoreThan:grown_tamarind_tree:growthTime:8: Southwest of the catwalk there {tamarind:is a tall tamarind tree:are some tall tamarind trees}.}",
  west:new Exit("upper_steam_hall"),
  east:new Exit("greenhouse_catwalk_east"),
  southwest:new Exit("up_a_tall_tree", {
    isHidden() { return (w.grown_tamarind_tree.growthTime < 9) },
    alsoDir:['climb'],
    msg:"Mandy looks at the tall tamarind tree. {once:From below it looked like the catwalk was close. Now... not so much. She climbs over the balustrade, and looks down. 'Shit.' It is a long way to fall. She takes a moment to calm her nerves, then reaches across, grabbing a branch she hopes will be strong enough. She pulls it closer, and then grabs it with her other hand. She shrieks as the branch sags under her weight, but it does not break, and she can climb up, into the relative safety of the heart of the tree.:Wondering why she is risking her life doing this again, Mandy climbs over the balustrade, then reaches across, grabbing a branch she hopes will be strong enough. She pulls it closer, then closes her eyes as she grabs with the other hand, and for a moment is falling as the branch sags under her weight. She quickly climbs up into the heart of the tree.}",
  }),
  scenery:[
    { alias:['poppies', 'poppy'], examine:'Down below, there is a large flowerbed with poppies growing.' },
    { alias:'marigolds', examine:'From this high up, the marigolds just looks like a sea of red. A very small sea, she thinks to herself.' },
    { alias:['chrysanthemums', 'carnations'], examine:'The chrysanthemums, or perhaps carnations, look beautiful.' },
    { alias:'bottlebush tree', examine:'From this vantage point, Mandy can see the blossoms of the bottlebush tree in detail, and appreciate why it is so called.' },
    { alias:'blossoms', examine:'The blossoms on the bottlebrush resemble a bottlebrush.' },
    { alias:['flower beds', 'flowerbeds', 'flowers', 'plants', 'bushes'], examine:'The flowerbeds below are crammed with flowers and other plants, so much so that the edges are almost obscured.' },
    { alias:'framework', examine:'The metal framework extends all the way to the roof, and Mandy suspects all the way to the floor, though it is hidden by the metal box. She guesses the lift runs inside it.' },
  ],
})

createItem("pedestal_from_catwalk", SURFACE(), {
  alias:'pedestal',
  loc:"greenhouse_catwalk_west",
  scenery:true,
  examine:'From up here, Mandy cannot see much of the pedestal; perhaps if she was down below she could see it better.',
  testDropIn:function(options) {
    return falsemsg("Mandy cannot reach the pedastal from up here.")
  },
})



createItem("hourglass_from_catwalk", {
  alias:'hourglass',
  isLocatedAt:function(loc) {
    if (loc !== "greenhouse_catwalk_west") return false
    if (w.hourglass.loc !== 'pedestal') return false
    return true
  },
  scenery:true,
  examine:"Besides the fact that it is an hourglass, Mandy cannot see much else about it from up here.",
  take:'Mandy tries to reach down, but her arms would have to be about four metres long to get the hourglass from here.',
  flip:'Mandy tries to reach down, but her arms would have to be about four metres long to get the hourglass from here.',
  turn:'Mandy tries to reach down, but her arms would have to be about four metres long to get the hourglass from here.',
  fill:'Mandy tries to reach down, but her arms would have to be about four metres long to get the hourglass from here.',
  smash:'Mandy tries to reach down, but her arms would have to be about four metres long to get the hourglass from here.',
})

createItem("bare_earth_from_catwalk", {
  alias:'bare earth',
  loc:'greenhouse_catwalk_west',
  scenery:true,
  synonyms:['ground', 'patch of bare earth'],
  parserPriority:-10,
  examine:"{floraFlowerBed:yes}",
})

createItem("grown_tamarind_tree_from_catwalk", {
  alias:'tamarind tree',
  isLocatedAt:function(loc) { return loc === 'greenhouse_catwalk_west' && w.grown_tamarind_tree.growthTime > 8 },
  scenery:true,
  parserPriority:10,
  goUpDirection:'southwest',
  examine:"The brand new tamarind {tamarind:tree rises:trees rise} up towards the roof of the greenhouse. On the catwalk, Mandy is about level with the lower branches; she might be able to climb on to {tamarind:it:one of them} from here.",
})











createRoom("greenhouse_east", {
  alias:'east end of the greenhouse',
  desc:"{floraDesc}This is a large, circular room, the circumference is made up of flowerbeds, thick with vegetation. In the centre of the room there is a further flowerbed, the most prominent feature of which is a tamarind tree.{once: Her father has tried to grow tamarind, among other exotic bushes, and Mandy is a little surprised she was paying attention enough to recognise this one.} It is considerably larger than any of her father's, which are little more than bushes.{chamberPotUnderTree}{if:greenhouse_east:sandy: Sand is scattered across the floor.}|A catwalk circumnavigates the tree a few metres above Mandy's head, but there is no obvious way to access it. There is a door to the east, and the greenhouse extends westward.",
  headingAlias:'The Greenhouse (East)',
  windowsface:'north',
  west:new Exit("greenhouse_west"),
  east:new Exit("great_hall"),
  afterEnterIf:[
    {
      test:function() { return w.greenhouse_east.visited === 3 },
      action:function() {
        msg("Mandy sees movement up on the catwalk. A silver figure, running round it, and then down the section to the west, before disappearing from view.")
        player.silverSpotted++
      },
    },
  ],
  up:new Exit("_", {
    alsoDir:['climb'],
    simpleUse:function(char) {
      log(char)
      if (char === w.Patch) {
        if (w.Patch.huggingTree) return falsemsg("'Climb the stupid tree,' says Mandy. Patch looks forlornly up the tree he is hugging.")
        msg("'Climb the tree, Patch,' says Mandy. Patch eyes up the tamarind tree , then steps closer, putting both arms round it. He pauses, and looks up, then down again, then up again. Apparently, climbing is not his thing.")
        w.Patch.huggingTree = true
        w.Patch.goUpDirection = 'up'
        return true
      }
      
      if (w.Patch.isHere() && w.Patch.huggingTree) {
        msg("Mandy appraises the tree, with Patch still hugging it. She could use Patch to get up it. 'Er, just, hold still,' she tells him, as she grabs his solid arm, and starts to haul herself up. 'And keep looking downwards!' She pulls herself up onto his shoulder, and from there she grabs a lower branch, and hauls herself up.")
        player.moveChar(new Exit('up_a_tall_tree_east', this))
        return true
      }
      return falsemsg("Mandy looks up at the tamarind tree; it is too tall to climb. The lowest branches are way out of reach.")
    },
  }),
  scenery:[
    { alias:['leaf', 'leaves'], examine:'The bright green tamarind leaves are composed of maybe a score or so long, thin leaflets in an alternating arrangement.' },
    { alias:'branches', examine:'Mandy looks again. The branches are definitely too high to reach.' },
    { alias:'pods', examine:'The pods are pale brown, knobbly and about as long as her hand.' },
    { alias:'seeds', examine:'Mandy assumes there are seeds in the pods hanging from the tree.' },
    { alias:['flower beds', 'flowerbeds', 'flowers', 'plants', 'bushes'], examine:'The flowerbeds are crammed with flowers and other plants, so much so that the edges are almost obscured.' },
  ],
})

tp.addDirective("chamberPotUnderTree", function(arr, params) {
  if (!w.chamber_pot.underTree) return ''
  if (w.chamber_pot.flipped) return ' There is an upturned chamber pot under the tree.'
  return ' There is a chamber pot under the tree to catch falling pods.'
})


createItem("tamarind_tree_from_ground", {
  alias:'tamarind tree',
  loc:"greenhouse_east",
  scenery:true,
  parserPriority:-20,
  examine:"The tamarind tree is tall, its thick trunk rises almost twice Mandy's height before branches spread out.",
  goUpDirection:'up',
  shake:function(options) {
    if (options.char === player) return falsemsg("Mandy tries to shake the tree, but the trunk is too thick; it does not budge. If only she were higher up...")
      
    msg("'Give that tree a good shake,' says Mandy.|Patch looks at it for a moment, then walks over to it. He puts two arms round it, and, with a grunt, gives it a good shake.|A tamarind pod falls to the ground, and Mandy grins in delight. 'At last!'")
    cloneObject(w.tamarind_pod_prototype, "greenhouse_east")
    return true    
  },
  kick:function(options) {
    if (options.char === player) return falsemsg("Mandy kicks the stupid tree in frustration.")
      
    msg("'Give that tree a good kick,' says Mandy.|Patch looks at it for a moment, then walks over to it. He stands right next to it, and, with a grunt, gives it a good kick.|A tamarind pod falls to the ground, and Mandy grins in delight. 'At last!'")
    cloneObject(w.tamarind_pod_prototype, "greenhouse_east")
    return true    
  },
  take:'The tree is far too heavy for Mandy to pick up, and would probably be rather awkward to carry.',
  hug:function(options) {
    if (options.char === player) {
      msg("Mandy gives the tree a hug, because maybe showing it some love will encourage it to drop a pod.|It does not.")
      return true  
    }
    if (options.char === w.Patch) {
      msg("Patch gives Mandy a quizzical look, but then goes to the tamarind tree, and gives it a big hug.")
      w.Patch.huggingTree = true
      w.Patch.goUpDirection = 'up'
      return true  
    }
    return falsemsg("{nv:char:be:true} not about to do that!", {char:options.char})
  },
})

createItem("sand_greenhouse", {
  scenery:true,
  alias:'sand',
  examine:'The sand is scattered across the floor.',
  take:function(options) {
    msg('Mandy tries to scoop up some of the sand, but it is spead too thinly to get more than a few grains.')
    return false
  },
})



createRoom("up_a_tall_tree_east", {
  alias:'a tamarind tree',
  headingAlias:'Up A Tamarind Tree',
  properNoun:true,
  windowsface:'none',
  desc:"Mandy is up a tamarind tree, up higher than the catwalk, hopefully in easy reach of a tamarind pod.",
  down:new Exit("greenhouse_east", {msg:'Mandy carefully climbs back down.'}),
  noFollow:true,
})

createItem("tamarind_pod_up_tree", {
  loc:'up_a_tall_tree_east',
  alias:'tamarind pod',
  scenery:true,
  parserPriority:-10,
  examine:'The tree is all leaves and branches. And pods, she can actually get a pod from here.',
  goDownDirection:'down',
  take:function() {
    msg("Mandy reaches out and grabs a tamarind pod.")
    cloneObject(w.tamarind_pod_prototype, player.name)
    return true    
  },
})


createRoom("greenhouse_catwalk_east", {
  alias:'east end of the greenhouse catwalk',
  headingAlias:'The Greenhouse (East, On Catwalk)',
  windowsface:'north',
  desc:"{floraDesc}She is standing on a catwalk that circumnavigates the east end of the greenhouse, and is suspended from the roof by steel struts. Looking down she has a wonderful view of the numerous plants and bushes, but especially the huge tamarind tree in the centre of the room, that rises up even higher than the catwalk. From here, Mandy can head west into the other section of the greenhouse or leave the greenhouse altogether by going east.",
  west:new Exit("greenhouse_catwalk_west"),
  east:new Exit("great_gallery"),
  afterFirstEnter:function() {
    msg("Is there someone down below? He -- or she for all Mandy can tell -- is wearing a silver shell-suit like it is 1996 or something. 'Hey!' calls Mandy. The figure looks up for a moment, and Mandy can see his face is silver too, before he darts off to the east.")
    player.silverSpotted++
  },
  scenery:[
    { 
      alias:['leaf', 'leaves'],
      examine:'The bring green tamarind leaves are composed of maybe a score or so long, thing leaflets in an alternating arrangement.',
      take:function() { return w.tamarind_tree.take() },
      pull:function() { return w.tamarind_tree.take() },
    },
    { alias:'pods', examine:'The pods are pale brown, knobbly and about as long as her hand.' },
    { alias:'seeds', examine:'Mandy assumes there are seeds in the pods hanging from the tree.' },
    { alias:['flower beds', 'flowerbeds', 'flowers', 'plants', 'bushes'], examine:'The flowerbeds down below are crammed with flowers and other plants, so much so that the edges are almost obscured.' },
  ],
})

createItem("tamarind_tree", {
  alias:'tamarind tree',
  loc:"greenhouse_catwalk_east",
  scenery:true,
  parserPriority:-20,
  examine:"The single tamarind tree is a big one, reaching almost to roof of the great greenhouse. From here, Mandy could reach out and touch the leaves of the tree, though the many seed pods are further away.",
  take:function() {
    msg("Mandy leans over the rail, and grabs a solid-looking leaf on the tamarind tree. She gives it a good tug, then another and another, until a ripe pod is dislodged. The pod falls...")
    if (w.chamber_pot.underTree) {
      msg("|...And lands neatly in the chamber pot. Mandy smiles in satisfaction.|Suddenly a silvery figure appears from the west, kicks over the chamber pot{ifExists:chamber_pot:containedFluidName: spilling the {show:chamber_pot:containedFluidName} everywhere}, scoops up the pod from the floor, and runs back west.|'Oh, for crying out loud!' Mandy exclaims.")
      if (w.chamber_pot.containedFluidName === 'sand') {
        w.greenhouse_east.sandy = true
        w.sand_greenhouse.loc = 'greenhouse_east'
      }
      delete w.chamber_pot.containedFluidName
      w.chamber_pot.flipped = true
      return false
    }
    if (w.Patch.loc === 'greenhouse_east' && w.Patch.hasPod()) return falsemsg("Patch looks very confused as he stares at the pod in his hand, then the pod on the ground, then the pod in his hand again. Then suddenly a silvery figure appears from the west, quickly scoops up the pod from the floor, and runs back west.")
    if (w.Patch.loc !== 'greenhouse_east') return falsemsg("Suddenly a silvery figure appears from the west, quickly scoops up the pod from the floor, and runs back west.{once: 'Shit,' mutters Mandy.}")
      
    msg("... To be caught with surprising dexterity by {nm:npc:the}, who is standing below.", {npc:w.Patch})
    cloneObject(w.tamarind_pod_prototype, 'Patch')
    return true
  },
  pull:function() { return w.tamarind_tree.take() },
  goUpItem:'Mandy looks how far down the ground is, then how flimsy the reachable branches look. She decides climbing the tamarind tree would be a bad idea.',
  shake:function(options) { this.take(options) },
})

createItem("tamarind_pod_on_tree", {
  alias:'tamarind pod',
  locList:['greenhouse_catwalk_east', 'greenhouse_east'],
  isLocatedAt:function(room_name) { return this.locList.includes(room_name) },
  alias:'tamarind pod',
  scenery:true,
  parserPriority:-10,
  examine:'The pods are pale brown, knobbly and about as long as her hand. They hang high up, but while the leaves spread out, they are clustered close to the trunk{if:player:loc:greenhouse_catwalk_east:, so out of reach from the catwalk}.',
  take:'The tamarind pods are out of reach.',
  open:function(options) {
    if (w.Patch.hasPod() && w.Patch.isHere()) {
      return falsemsg("Patch has the tamarind pod; Mandy wonders if she should ask him to give it to her so she can open it.")
    }
    return falsemsg("Mandy looks at the tamarind pods on the tree; she will have to get one down if she wants to open it.")
  }
})

createItem("tamarind_pod_prototype", SIZE_CHANGING(), {
  alias:'tamarind pod',
  openable:true,
  desc5:'The pod is pale brown, knobbly and about as long as her hand.',
  desc4:"The pod is tiny.",
  desc6:'The pod is pale brown, knobbly and about as long as her arm.',
  open:function(options) {
    let sharp
    
    if (options.secondItem === undefined) {
      sharp = player.getSharp()
      if (!sharp) return falsemsg('Mandy tries to open the tamarind pod, but it is too tough for her fingernails. She needs something a little sharper.')
    }
    else {
      if (options.secondItem.npc) return falsemsg("Mandy tries to open the pod with {nm:secondItem:the}, but {pv:secondItem:start} to get annoyed and moves away.", options)
      if (options.secondItem.loc !== player.name) return falsemsg("Mandy thinks about opening the pod with {nm:secondItem:the}... She would have to be holding it, of course.", options)
      if (!options.secondItem.sharp) return falsemsg("Mandy tries to open the pod with {nm:secondItem:the} for a few minutes before giving up in frustration.", options)
      sharp = options.secondItem
    }
    
    const count = random.int(3, 5)
    msg("Using {nm:item:the}, Mandy cuts the pod open. Inside she finds " + lang.toWords(count) + " seeds, which she quickly extracts, throwing away the useless husk.", {item:sharp})
    if (!w.tamarind_seed.countableLocs[player.name]) w.tamarind_seed.countableLocs[player.name] = 0
    w.tamarind_seed.countableLocs[player.name] += count
    delete this.loc
    return true
  },
  openwith:function(options) { this.open(options) },
  smash:function(options) { this.open(options) },
})

createItem("tamarind_seed", COUNTABLE(), {
  regex:/^(\d+ )?seeds?$/,
  defaultToAll:false,
  examine:'The tamarind seed is black and shiny; more like a pebble than a seed.',
  testDrop:function(options) { 
    if (options.container) return true
    return falsemsg('Mandy decides it is best not to drop any seeds here -- they might grow into a tree!') 
  },
  msgDropIn:"{ifNot:container:name:bare_earth:" + lang.drop_successful + ":Mandy carefully plants {nm:item:count} in the bare earth{ifIs:params:excess:true:, wishing she had a few more}.}",
})



