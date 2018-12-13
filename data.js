function SpellItem(name, hash) {
  Item.call(this, name, hash);
}
SpellItem.prototype.spellVerbs = ['Examine', 'Cast'];
SpellItem.prototype.cast = function(self) {
  msg('You cast <i>' + self.name + '</i>.');
}






var data = [
  
  new Player("me", {
    loc:"lounge",
  }),

  new Room("kitchen", {
    examine:'A clean room.',
    west:"lounge",
    north:new Exit('garden'),
  }),

  new Room("lounge", {
    examine:'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
    east:'kitchen'
  }),

  new Room("garden", {
    examine:'A wild and over-grown garden.',
    south:function(self) {
      msg("You head back inside.");
      setRoom('kitchen');
    },
  }),

  new Room("spellbook", {
    examine:'A ancient tomb.',
  }),

  new SpellItem("charm", {
    loc:'spellbook',
    spellVerbs:["Cast"],
    examine:'Charm will make the target thonk you are his or her friend.',
  }),

  new TakableItem("ball", {
    loc:'Held',
    examine:'A red ball.',
    drop:function(self) {
      msg('You drop the stupid ' + self.name + '.');
      self['loc'] = "lounge"
    },
  }),

  new WearableItem("red hat", {
    loc:'Held',
    examine:'A red bobble hat.'
  }),
  
  new WearableItem("blue hat", {
    loc:'Worn',
    examine:'A blue bobble hat.'
  }),
  
  new TakableItem("teapot", {
    loc:"lounge",
    alt:['kettle'],
    examine:function(self) {
      msg('A nasty blue teapot. It is broken.');
    },
  }),
  
  new Item("chest", {
    container:true,
    loc:"lounge",
  }),
  
  new TakableItem("boots", {
    loc:"lounge",
    pronouns:PRONOUNS.plural,
    examine:"Some old boots.",
  }),
  
  new TakableItem("knife", {
    loc:"lounge",
    sharp:false,
    examine:function(item) {
      if (item.sharp) {
        msg("A really sharp knife.");
      }
      else {
        msg("A blunt knife.");
      }
    },
  }),
  
  new UseableItem("chair", {
    loc:"lounge",
    examine:'A cheap plastic chair.'
  }),

  new Item("glass cabinet", {
    container:true,
    closed:true,
    locked:true,
    transparent:true,
    loc:"kitchen",
    examine:'A cabinet with a glass front'
  }),

  new UseableItem("open box", {
    container:true,
    loc:"kitchen",
    examine:'A big cardboard box.'
  }),

  new UseableItem("ornate doll", {
    loc:"glass cabinet",
    examine:'A fancy doll, eighteenth century.'
  }),

  new UseableItem("camera", {
    loc:"open box",
    examine:'A cheap digital camera.'
  }),

  
  
  new FemaleNpcItem("Mary", {
    loc:"lounge",
    examine:'An attractive young lady.'
  }),

  new UseableTakableItem("device", {
    loc:"lounge",
    display:'not here',
    examine:function(self) {
      msg('A nasty blue device. It is broken.');
    },
  }),

  new Turnscript("TS_Test", {
    run:function(self) {
      msg('Turn script!');
    },
  }),
  
];