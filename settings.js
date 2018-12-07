// Language support
const CMD_IGNORED_WORDS = ["", "the", "a", "an"];
const CMD_JOINER_REGEX = /\,|\band\b/;
const CMD_ALL_REGEX = /^(all|everything)$/;
const CMD_ALL_EXCLUDE_REGEX = /^((all|everything) (but|except)\b)/;

const CMD_ECHO = true;
const CMD_NOT_KNOWN_MSG = "I don't even know where to begin with that.";
const CMD_OBJECT_UNKNOWN_MSG = "Not finding any object '%'.";
const CMD_DISAMBIG_MSG = "Which do you mean?";
const CMD_NO_MULTIPLES = "You cannot use multiple objects with that command.";
const CMD_NOTHING = "Nothing there to do that with.";

const BUG_PANE_CMD_NOT_FOUND = "Cannot find that command. This is a bug; please alert the creator.";
const BUG_PANE_ITEM_NOT_FOUND = "Cannot find that item. This is a bug; please alert the Quest coders.";

// UI options
const PANES = 'Left';  //Can be set to Left, Right or None.
const COMPASS = true;
const TEXT_INPUT = true;

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
// You can add (or remove) inventories too
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
  {name:'Spells known', alt:'spells', verbs:'spellVerbs',
    test:function(item) {
      return item.loc == "spellbook";
    }
  },
  {name:'Items Here', alt:'itemsHere', verbs:'hereVerbs',
    test:function(item) {
      return item.loc == player.loc;
    }
  },
];

// This function will be called at the start of the game, so can be used
// to give a title and introduce your game.
setup = function() {
  heading(2, 'A Simple Test');
  msg('This is a test of what we can do.');
  //[objs, score] = findInScope("ch", [scope(isHere), scope(isPresent)]);
  //msg(objs.length);
  //msg(score);
  //parser.parse("take red hat, teapot and chair");
  //parser.parse("take hat, teapot2 and ball");
  parser.parse("take hat, teapot and ball from chair");
  //parser.parse("ask ball about hats");
  //parser.parse("take all but kettle and chair");
}

