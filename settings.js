    const IGNORED_WORDS = ["", "the", "a", "an"];
    
    const PANES = 'Right';  //Can be set to Left, Right or None.
    const COMPASS = false;
    
    // Change the abbrev values to suit your game (or language)
    const exits = [
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
    const inventories = [
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

