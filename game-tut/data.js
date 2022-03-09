"use strict"

createItem("me", PLAYER(), {
  loc:"lounge",
  synonyms:['me', 'myself'],
  examine: "Just a regular guy.",
})

createRoom("lounge", {
  east:new Exit("kitchen"),
  desc:"A smelly room with an old settee and a tv.",
})

createItem("coin", TAKEABLE(),  {
  loc:"lounge",
  examine: "A gold coin.",
})

createItem("glass_cabinet", CONTAINER(), {
  loc:"lounge",
  transparent:true,
   examine:"A cabinet with a glass front",
})

createItem("ornate_doll", TAKEABLE(), LOCKED_WITH("cabinet_key"), {
  loc:"glass_cabinet",
  examine:"A fancy doll, eighteenth century.",
})

createItem("boots", WEARABLE(), {
  loc:"lounge",
  pronouns:lang.pronouns.plural,
  examine:"Some old boots.",
})

createItem("Lara", NPC(true), {
  loc:"lounge",
  examine:"A normal-sized rabbit.",
})

createItem("torch", TAKEABLE(), SWITCHABLE(false, 'providing light'), {
  loc:"lounge",
  examine:"A small black torch.",
  synonyms:["flashlight"],
  lightSource:function() {
    return this.switchedon ? world.LIGHT_FULL : world.LIGHT_NONE
  },
  eventPeriod:1,
  eventIsActive:function() {
    return this.switchedon
  },
  eventScript:function() {
    this.power--;
    if (this.power === 2) {
      msg("The torch flickers.")
    }
    if (this.power < 0) {
      msg("The torch flickers and dies.{once: Perhaps there is a charger in the garage?}");
      this.doSwitchoff()
    }
  },
  testSwitchOn () {
    if (this.power < 0) {
      msg("The torch is dead.")
      return false
    }
    return true
  },
  power:3,
  charge:function(options) {
    if (options.char.loc != "garage") return falsemsg("There is nothing to charge the torch with here.")

    msg("{pv:char:charge:true} the torch - it should last for hours now.", options)
    this.power = 20
    return true
  },
})


createItem("garage_key", KEY(), {
  loc:"lounge",
  examine: "A big key.",
})







createRoom("kitchen", {
  desc:'A clean room, a clock hanging on the wall. There is a sink in the corner.',
  west:new Exit("lounge"),
  down:new Exit('basement', {
    isHidden:function() { return w.trapdoor.closed; },
  }),
  north:new Exit("garage"),
  afterFirstEnter:function() {
    msg("A fresh smell here!");
  },
})

createItem("trapdoor", OPENABLE(false), {
  loc:"kitchen",
  examine:"A small trapdoor in the floor.",
})







createRoom("garage", {
  desc:'An empty garage.',
  south:new Exit('kitchen'),
})

createItem("cabinet_key", KEY(), { 
  loc:"garage",
  examine: "A small brass key."
})

createItem("garage_door", LOCKED_DOOR("garage_key", "kitchen", "garage"), {
  examine: "The door to the garage.",
})

createItem("charger", {
  loc:"garage",
  examine: "A device bigger than a washing machine to charge a torch? It has a compartment and a button. {charger_state}.", 
})

createItem("charger_compartment", COMPONENT("charger"), CONTAINER(true), {
  alias:"compartment",
  examine:"The compartment is just the right size for the torch. It is {if:charger_compartment:closed:closed:open}.",
  testDropIn:function(options) {
    const contents = w.charger_compartment.getContents();
    if (contents.length > 0) return falsemsg("The compartment is full.")

    return true
  },
})

createItem("charger_button", COMPONENT("charger"), {
  examine:"A big red button.",
  alias:"button",
  push:function(options) {
    if (!w.charger_compartment.closed || w.torch.loc !== "charger_compartment") return falsemsg("{pv:char:push:true} the button, but nothing happens.", options)

    msg("{pv:char:push:true} the button. There is a brief hum of power, and a flash.", options)
    w.torch.power = 20
    return true
  },
})








createRoom("basement", {
  desc:"A dank room, with piles of crates everywhere.",
  darkDesc:"It is dark, but you can just see the outline of the trapdoor above you.",
  up:new Exit('kitchen'),
  lightSource:function() {
    return w.light_switch.switchedon ? world.LIGHT_FULL : world.LIGHT_NONE;
  },
})

createItem("light_switch", SWITCHABLE(false), { 
  loc:"basement",
  alias:"light switch",
  examine:"A switch, presumably for the light.",
})