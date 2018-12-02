    // ============  User Interface data  =======================================

    // Change the abbrev values to suit your game (or language)
    var exits = [
      {name:'northwest', abbrev:'NW'}, 
      {name:'north', abbrev:'N'}, 
      {name:'northeast', abbrev:'NE'}, 
      {name:'in', abbrev:'In'}, 
      {name:'up', abbrev:'U'},
      
      {name:'west', abbrev:'W'}, 
      {name:'look', abbrev:'Lk'}, 
      {name:'east', abbrev:'E'}, 
      {name:'out', abbrev:'Out'}, 
      {name:'down', abbrev:'Dn'}, 

      {name:'southwest', abbrev:'SW'}, 
      {name:'south', abbrev:'S'}, 
      {name:'southeast', abbrev:'SE'}, 
      {name:'wait', abbrev:'Z'}, 
      {name:'help', abbrev:'?'}, 
    ];

    // Change the name values to alter how items are displayed
    // You can add (or remove) inventrories too
    var inventories = [
      {name:'Items Held', alt:'itemsHeld', verbs:'heldVerbs',
        test:function(item) {
          return item.loc == player.name && !item.worn;
        }
      },
      {name:'Items Worn', alt:'itemsWorn', verbs:'wornVerbs',
        test:function(item) {
          return item.loc == player.name && item.worn;
      }
      },
      {name:'Items Here', alt:'itemsHere', verbs:'hereVerbs',
        test:function(item) {
          return item.loc == player.loc;
        }
      },
    ];
    
    setup = function() {
      //$('#panes').hide();
      heading(2, 'A Simple Test');
      msg('This is a test of what we can do.');
    }


    // ============  World model classes  =======================================
    
    function Item(name, hash) {
      this.name = name;
      this.display = VISIBLE;
      for (var key in hash) {
        this[key] = hash[key];
      }
    }
    
    function Player(name, hash) {
      Item.call(this, name, hash);
      this.display = INVISIBLE;
      this.player = true;
    }


    function Exit(name, hash) {
      Item.call(this, name, hash);
    }
    Exit.prototype.use = function(self) {
      if ('msg' in self) {
        msg(self['msg']);
      }
      setRoom(self['name']);
    }

    function Room(name, hash) {
      Item.call(this, name, hash);
    }

    function Turnscript(name, hash) {
      Item.call(this, name, hash);
    }


    function UseableItem(name, hash) {
      Item.call(this, name, hash);
    }
    UseableItem.prototype.hereVerbs = ['Examine', 'Use'];

    function TakableItem(name, hash) {
      Item.call(this, name, hash);
    }
    TakableItem.prototype.heldVerbs = ['Examine', 'Drop'];
    TakableItem.prototype.hereVerbs = ['Examine', 'Take'];
    TakableItem.prototype.drop = function(self) {
      msg('You drop the ' + self.name + '.');
      self['loc'] = currentRoom.name;
    }
    TakableItem.prototype.take = function(self) {
      msg('You take the ' + self.name + '.');
      self['loc'] = player.name;
    }
    
    function UseableTakableItem(name, hash) {
      Item.call(this, name, hash);
    }
    UseableTakableItem.prototype = Object.create(TakableItem.prototype);
    UseableTakableItem.prototype.heldVerbs = ['Examine', 'Drop', 'Use'];
    UseableTakableItem.prototype.hereVerbs = ['Examine', 'Take', 'Use'];


    function WearableItem(name, hash) {
      Item.call(this, name, hash);
    }
    WearableItem.prototype = Object.create(TakableItem.prototype);
    WearableItem.prototype.heldVerbs = ['Examine', 'Drop', 'Wear'];
    WearableItem.prototype.wornVerbs = ['Examine', 'Remove'];
    WearableItem.prototype.wear = function(self) {
      msg('You put on the ' + self.name + '.');
      self['worn'] = true;
    }
    WearableItem.prototype.remove = function(self) {
      msg('You take off the ' + self.name + '.');
      self['worn'] = false;
    }

    function SwitchableItem(name, hash) {
      Item.call(this, name, hash);
    }
    SwitchableItem.prototype.hereVerbs = ['Examine', 'Turn on'];
    SwitchableItem.prototype.switchon = function(self) {
      msg('You turn the ' + self.name + ' on.');
      self['switchedon'] = true;
      self['hereVerbs'] = ['Examine', 'Turn off'];
    }
    SwitchableItem.prototype.switchoff = function(self) {
      msg('You turn the ' + self.name + ' off.');
      self['switchedon'] = false;
      self['hereVerbs'] = ['Examine', 'Turn on'];
    }

    function SwitchableTakableItem(name, hash) {
      Item.call(this, name, hash);
    }
    SwitchableTakableItem.prototype = Object.create(TakableItem.prototype);
    SwitchableTakableItem.prototype.heldVerbs = ['Examine', 'Drop', 'Turn on'];
    SwitchableTakableItem.prototype.hereVerbs = ['Examine', 'Take', 'Turn off'];
    SwitchableItem.prototype.switchon = function(self) {
      msg('You turn the ' + self.name + ' on.');
      self['switchedon'] = true;
      self['hereVerbs'] = ['Examine', 'Turn off'];
    }
    SwitchableItem.prototype.switchoff = function(self) {
      msg('You turn the ' + self.name + ' off.');
      self['switchedon'] = false;
      self['hereVerbs'] = ['Examine', 'Turn on'];
    }

    
    function EdibleItem(name, hash) {
      Item.call(this, name, hash);
    }
    EdibleItem.prototype = Object.create(TakableItem.prototype);
    EdibleItem.prototype.heldVerbs = ['Examine', 'Drop', 'Eat'];
    EdibleItem.prototype.eat = function(self) {
      msg('You eat the ' + self.name + '.');
      self['loc'] = null;
    }
    


    // ============  Data  =======================================
    
    var simpleCommands = {
      look:function() {
        itemAction(room, 'examine');
        suppressTurnScripts = true;
      },
      help:function() {
        metamsg('This is an experiment in using JavaScript (and a little jQuery) to create a text game. Currently all interactions are via the pane on the right.');
        metamsg('Use the compass rose at the top to move around. Click "Lk" to look at you current location, "Z" to wait or "?" for help.');
        metamsg('Click an item to interact with it, then click the buttons to select an interaction.');
        suppressTurnScripts = true;
      },    
      wait:function() {
        msg('You wait... nothing happens.');
      },
    };



    var data = [
      new Room("Lounge", {
        examine:'A smelly room.',
        east:'Kitchen'
      }),
    
      new Room("Kitchen", {
        examine:'A clean room.',
        west:'Lounge',
        north:new Exit('Garden'),
      }),
    
      new Room("Garden", {
        examine:'A wild and over-grown garden.',
        south:function(self) {
          msg("You head back inside.");
          setRoom('Kitchen');
        },
      }),
    
      new TakableItem("Ball", {
        loc:'Held',
        examine:'A red ball.',
        drop:function(self) {
          msg('You drop the stupid ' + self.name + '.');
          self['loc'] = 'Lounge'
        },
      }),

      new WearableItem("Hat", {
        loc:'Held',
        examine:'A black bobble hat.'
      }),
      
      new TakableItem("Teapot", {
        loc:'Held',
        examine:function(self) {
          msg('A nasty blue teapot. It is broken.');
        },
      }),
      
      new UseableItem("Chair", {
        loc:'Lounge',
        examine:'A cheap plastic chair.'
      }),

      new UseableTakableItem("Device", {
        loc:'Lounge',
        examine:function(self) {
          msg('A nasty blue device. It is broken.');
        },
      }),

      new Turnscript("TS_Test", {
        run:function(self) {
          msg('Turn script!');
        },
      }),
      
      new Player("Me", {
        loc:'Lounge',
      }),
    ];
