"use strict"





register('battlefield', {
  book:'The Taming of the Shrew',
  uniform:'a red uniform, that looks disturbing like the military uniform of the dead soldiers',
  smell:'Mandy tries her best not to smell anything, but the stench of death and rotting meat is everywhere.',
  listen:'Mandy can hear nothing except the buzzing of the flies.',
})



createRoom("battlefield", {
  headingAlias:'An Unknown Battlefield',
  south:new Exit("beach", {msg:"Mandy picks her way carefully around the corpses, to the beach."}),
  desc:'Mandy is standing on a small rise overlooking a battlefield, next to a dead horse. All around her there are corpses, some in red uniforms, some in blue uniforms; all are covered in blood and mud and flies. To the south is a beach, and beyond that a sea that looks strangely peaceful after the horrors all around here.',
  afterFirstEnter:function() {
    msg("'Shit,' mutters Mandy. This is certainly outside the house, but she has no idea where she is. Or even when; how long is it since horses were used in a war, or uniforms like that?")
    w.clockwork_thespian.state = 201
  },
  afterEnter:function() {
    if (this.visited === 2) {
      msg("Chess is supposed to be based on warfare or a metaphor or something, thinks Mandy. Perhaps that was why moving the horse on the chessboard brought her here.")
    }
    if (this.visited === 4) {
      msg("If the chessboard is a metaphor for this battle, and there is some kind of mystical link between then two, it occurs to Mandy that the knight she turned back in the house might be similarly linked to this dead horse.")
    }
  },
  scenery:[
    {alias:['corpses', 'body','bodies','soldiers'], examine:'There must be hundreds or even thousands of dead soldiers here. Mandy wonders how long ago the battle was; her forensic skills are not that great, but it cannot be more than a week or so; the bodies do not seem to have decayed at all.', parserPriority:10},
    {alias:['red uniforms','red soldiers'], examine:'The soldiers in red are armed with muskets; many have bayonets fitted. As well red jackets, they have white belts and helmets and black trousers and boots.'},
    {alias:['blue uniforms','blue soldiers'], examine:'The soldiers in blue are armed with muskets; many have bayonets fitted. As well blue jackets and trousers, they have black belts and boots, and blue hats that look like upturned flowerpots.'},
    {alias:'flies', examine:'The flies seem to be the big winner of this battle.'},
    {alias:'blood', examine:'There is blood everywhere! All the soldiers are covered in it, it is all over the ground. And where there is no blood, there is mud.'},
    {alias:'mud', examine:'There is mud everywhere! All the soldiers are covered in it, it is all over the ground. And where there is no mud, there is blood.'},
    {alias:'beach', examine:'The beach to the south looks like the sort of place that would be quite nice, if it were not for the corpses.'},
  ],
})

createItem("dead_horse", {
  loc:"battlefield",
  scenery:true,
  examine:"{once:Mandy looks at the dead horse rather gingerly, slightly worried at what she will see. }There are no obvious wounds on the horse that she can see, but it is not breathing, and feels cold. It looks relatively small to Mandy's inexpert eye.",
  beat:"Mandy hits the equine corpse, then does it again and again and again. After some time she realises it is have no effect. 'I'm flogging a dead horse,' she says.",
  shift:"The horse is to heavy to move.",
  ride:"Mandy straddles the dead horse, and gives it's rump a good slap. 'Giddy up,' she says. The horse does not move, so she stands again.",
  withUse:function(char, obj) {
    if (obj !== w.oar) return falsemsg("Mandy wonder how she ould use {nm:item:the} on the horse.", {item:obj})
    return this.turn()
  },
  turn:function() {
    if (!w.oar.isHeld()) {
      msg("{i:This can't be right,} thinks Mandy, as she tries to push the rump of the dead horse, to get it to turn. 'Shit!' It is too heavy to move. If she had a lever...")
      return false
    }
    else {
      msg("{once:{i:This can't be right,} thinks Mandy. }She puts the oar under the rump of the dead horse. With a grunt, she jerks it up, and the hindquarters of the horse move a bit. With a shrug, she does it again, and again, slowly inching the back end of the horse round the front end...")
      msg("She lets go of the oar, and stands to take a breath, and suddenly the world dissolves around here.")
      msg("She is back in the house.")
      w.oar.loc = "battlefield"
      player.loc = 'gallery'
      world.update()
      world.enterRoom()
      return true
    }
  },
})




createRoom("beach", {
  headingAlias:'A Sandy Beach',
  paddleFlag:false,
  isSourceOf:function(fluid) {
    return fluid === "sand" || fluid === "water"
  },
  north:new Exit("battlefield", {msg:"Mandy heads back up the small rise, carefully stepping around the corpses."}),
  southwest:new Exit("rocky_beach"),
  south:new Exit("_", {alsoDir:['swim'], use:function(char) {
    msg('Mandy is about to paddle in the sea, when she sees a corpse floating nearby, surrounded by clouds of red. And another over there. And... lots of corpses. Perhaps the sea is not so inviting.')
    w.beach.paddleFlag = true
    return false
  }}),
  in:new Exit("_", {isHidden:function() { return w.chamber_pot.loc !== 'sea' }, use:function(char) {
    msg("Mandy carefully steps into her chamber pot boat... Which promptly capsizes! 'Shit,' she screams, now drenched in the filthy water. 'Well that was a fucking stupid idea,' she mutters to herself, as she steps back on dry land, dragging the chamber-pot-that-is-definitely-not-a-boat behind her.")
     w.chamber_pot.loc = 'beach'
    return false
  }}),
  desc:'The beach would be nice if it were not the dead soldiers; there seem to be more blue-uniformed ones here than red. The sand looks fine and almost white, {ifNot:beach:paddleFlag:and the sea to the south looks very inviting}{if:beach:paddleFlag:though the sea full of corpses is not exactly inviting}. There might be a way along the beach through the bodies to the southwest, or she could go back north to the dead horse.{if:sand_item:sandcastleBuilt: There is an impressive sandcastle in the middle of a relative corpse-free area.}',
  scenery:[
    {alias:'corpses', examine:'There must be hundreds or even thousands of dead soldiers here. Mandy wonders how long ago the battle was; her forensic skills are not that great, but it cannot be more than a week or so; the bodies do not seem to have decayed at all.'},
    {alias:'red uniforms', examine:'The soldiers in red are armed with muskets; many have bayonets fitted. As well red jackets, they have white belts and helmets and black trousers and boots.'},
    {alias:'blue soldiers', examine:'The soldiers in blue are armed with muskets; many have bayonets fitted. As well blue jackets and trousers, they have black belts and boots, and red hats that look like upturned flowerpots.'},
    {alias:'flies', examine:'The flies seem to be the big winner of this battle.'},
  ],
})

createItem("sea", CONTAINER(), {
  loc:"beach",
  scenery:true,
  examine:"The sea looks nice from a distance, but now she almost has her toes in it, Mandy can see the bits of mutilated bodies in it; not so enticing.",
  testDropIn:function(options) {
    if (options.item !== w.chamber_pot || w.chamber_pot.size !== 7) return falsemsg("The thought of putting anything in that filthy water makes Mandy's stomach turn.")
    if (w.chamber_pot.containedFluidName) return falsemsg("Mandy wonders if the chamber pot would make a boat. Not while it is full of {show:fluid} of course.", {fluid:w.chamber_pot.containedFluidName})
    msg("Mandy carefully puts the enormous chamber pot into the water; it floats!")
    w.chamber_pot.loc = "sea"
  },
})

createItem("sand_item", {
  loc:"beach",
  scenery:true,
  alias:'sand',
  examine:'The sand looks great for playing in. Mandy remembers building sandcastles and just digging holes in sand like this when she was kid.',
  kick:function(options) { return this.smash(options) },
  build:function(options) { return this.play(options) },
  dig:function(options) { return this.play(options) },
  smash:function(options) {
    msg("Mandy spends a few minutes kicking sand. It does not achieve anything, but she feels better for it.")
    return true
  },
  play:function(options) {
    if (w.sandcastle.loc) return falsemsg("Mandy looks at her sandcastle. Perhaps that is enough playing for now.")
    return w.sandcastle.build()
  },
  take:function(options) {
    if (!w.chamber_pot.isHeld()) return falsemsg('Mandy scoops up some sand in her hand, and watches as it slowly falls through her fingers.')
    if (w.chamber_pot.containedFluidName === 'sand') return falsemsg('Mandy things about getting more sand, but chamber pot is already full, she will not be able to carry more.')
    if (w.chamber_pot.containedFluidName) return falsemsg('Mandy thinks about getting some sand, but the chamber pot is already full; she would need to empty it first.')
    
    msg('Mandy scoops up a load of sand into the chamber pot.')
    w.chamber_pot.containedFluidName = 'sand'
    return true
  },
})


createItem("sandcastle", CONSTRUCTION(), {
  synonyms:['sand castle'],
  buildAtLocation:true,
  examine:'The sandcastle looks pretty good, to Mandy\'s eye; four squat towers, connected by thick walls and surrounded by a moat. Well, a ditch that will {i:become} a moat when the tide comes in.',
  msgConstruction:"Mandy wonders if she has time to play in the sand. She gives a shrug. She is on a beach in the nineteenth century. It will be over a century until she is born! She finds a patch of beach that is relatively free of blood and bodies, and where the sand is just slightly damp, and sits down. She spends the best part of an hour building a sandcastle. It is not as easy as she remembers - but she is just using her hands, rather than bucket and spade.|She stands up to inspect her work. Pretty damn good!",
  kick:function(options) { return this.smash(options) },
  buildPrecheck:function(options) {
    if (this.loc) return falsemsg(lang.construction_already, options)
    if (options.char.loc !== 'beach') return falsemsg("Mandy laments that she is not on a sandy beach, and is therefore unable build a sandcastle.")
    return true
  },
  smash:function(options) {
    msg("With a big grin, Mandy kicks the sandcastle, again and again, until no trace is left.")
    delete this.loc
    return true
  },
})





createRoom("rocky_beach", {
  headingAlias:'A Rocky Beach',
  northeast:new Exit("beach"),
  desc:'The beach is all rocks here, close to the headland, further from the shoreline. On the plus side, there are definitely fewer corpses here.{once: Mandy wonders if the blue army arrived by sea, landing where the beach is sandy, and getting shot as they disembarked, before pushing the reds back.} She can see the battered remains of a boat here.',
  scenery:[
    {alias:'corpses', examine:'There must be hundreds or even thousands of dead soldiers here. Mandy wonders how long ago the battle was; her forensic skills are not that great, but it cannot be more than a week or so; the bodies do not seem to have decayed at all.'},
    {alias:'red uniforms', examine:'The soldiers in red are armed with muskets; many have bayonets fitted. As well red jackets, they have white belts and helmets and black trousers and boots.'},
    {alias:'blue soldiers', examine:'The soldiers in blue are armed with muskets; many have bayonets fitted. As well blue jackets and trousers, they have black belts and boots, and red hats that look like upturned flowerpots.'},
    {alias:'flies', examine:'The flies seem to be the big winner of this battle.'},
    {alias:'rocks', examine:'The rocks are rocks.'},
  ],
})

createItem("battered_boat", {
  loc:"rocky_beach",
  scenery:true,
  examine:"The boat is a wreck -- really just bits of broken wood -- but might have been about four metres long, with perhaps two or three sets of rowers.{if:oar:scenery: It looks like only one of the oars has survived.}",
})

createItem("oar", TAKEABLE(), {  // cannot get taken to size change rooms
  loc:"rocky_beach",
  scenery:true,
  examine:"The oar is made of solid wood, and about a metre long.",
  use:function() {
    if (player.loc === "battlefield") {
      return w.dead_horse.turn()
    }
    else {
      msg("Mandy wonders how she can use the oar... Perhaps she can find a boat?")
      return false
    }
  },
  repair:"Mandy takes a good look at the boat; it is beyond repair she decides.",
})



