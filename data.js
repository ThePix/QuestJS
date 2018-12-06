var data = [
  new Room("lounge", {
    examine:'A smelly room.',
    east:'kitchen'
  }),

  new Room("kitchen", {
    examine:'A clean room.',
    west:'lounge',
    north:new Exit('Garden'),
  }),

  new Room("garden", {
    examine:'A wild and over-grown garden.',
    south:function(self) {
      msg("You head back inside.");
      setRoom('kitchen');
    },
  }),

  new TakableItem("ball", {
    loc:'Held',
    examine:'A red ball.',
    drop:function(self) {
      msg('You drop the stupid ' + self.name + '.');
      self['loc'] = 'lounge'
    },
  }),

  new WearableItem("red hat", {
    loc:'Held',
    examine:'A red bobble hat.'
  }),
  
  new WearableItem("blue hat", {
    loc:'Held',
    examine:'A blue bobble hat.'
  }),
  
  new TakableItem("teapot", {
    loc:'lounge',
    alt:['kettle'],
    examine:function(self) {
      msg('A nasty blue teapot. It is broken.');
    },
  }),
  
  new TakableItem("cup", {
    loc:'lounge',
    examine:'A nasty blue cupteapot.',
  }),
  
  new TakableItem("lamp", {
    loc:'lounge',
    examine:'A broken lamp.',
  }),
  
  new TakableItem("knife", {
    loc:'lounge',
    examine:function(self) {
      msg('A sharp knife.');
    },
  }),
  
  new UseableItem("chair", {
    loc:'lounge',
    examine:'A cheap plastic chair.'
  }),

  new UseableTakableItem("device", {
    loc:'lounge',
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
  
  new Player("me", {
    loc:'lounge',
  }),
];