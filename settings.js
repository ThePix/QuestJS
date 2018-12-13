const TITLE = "A First Step...";

// UI options
const PANES = 'Left';  //Can be set to Left, Right or None.
const COMPASS = true;
const TEXT_INPUT = true;
const CURSOR = ">";
const LANG_FILENAME = "lang-en.js";  // set to the language file of your choice

const SUCCESS = 1;
const SUCCESS_NO_TURNSCRIPTS = 2;
const FAILED = -1;

const ERR_QUEST_BUG = 21;   // A bug in Quest I need to sort out
const ERR_GAME_BUG = 22;    // A bug in the game the creator needs to sort out
const ERR_PARSER = 23;      // Player is typing something unintelligible
const ERR_PLAYER = 24;      // Player is typing something not allowed
const DBG_PARSER = 21;      // Debug message from the parser




// Change the name values to alter how items are displayed
// You can add (or remove) inventories too
const INVENTORIES = [
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
  heading(2, TITLE);
  document.title = TITLE;
  msg('This is a test of what we can do.');
  //[objs, score] = findInScope("ch", [scope(isHere), scope(isPresent)]);
  //msg(objs.length);
  //msg(score);
  //parser.parse("take red hat, teapot and chair");
  //parser.parse("x it");
  //parser.parse("take hat, teapot2 and ball");
  //parser.parse("take blue hat, teapot and ball from chair");
  //parser.parse("ask ball about hats");
  parser.parse("put ball in chest");
  //_scopeReport("ornate doll");
  //_scopeReport("camera");
  //_scopeReport("blue hat");
  //_scopeReport("red hat");
}
