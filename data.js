// ============  Data  =======================================

// Each entry should be an Item object, or sub-class.
// These all take a name and a dictionary.
// The dictionary probably needs a "loc" key for items,
// which is the name of the start location, or "held" or "worn".
// Items and rooms can have any number of other attributes, either
// a string or a function (like a script in Quest).


// The "display" attribute controls how an item is displayed.
// By default it is "visible".
// Set to "invisible" to exclude from descriptions, but still present.
// Set to "scenery" to
// Set to "not here" to have the item not here

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

  new WearableItem("hat", {
    loc:'Held',
    examine:'A black bobble hat.'
  }),
  
  new TakableItem("teapot", {
    loc:'Held',
    examine:function(self) {
      msg('A nasty blue teapot. It is broken.');
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
