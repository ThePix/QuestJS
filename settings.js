const TITLE = "A First Step...";

// UI options
const PANES = 'Left';  //Can be set to Left, Right or None.
const COMPASS = true;
const TEXT_INPUT = true;
const CURSOR = ">";
const LANG_FILENAME = "lang-en.js";  // set to the language file of your choice
const PRE_RELEASE = true;  // Some extra testing is done on start up when this is true





// Change the name values to alter how items are displayed
// You can add (or remove) inventories too
const INVENTORIES = [
  {name:'Items Held', alt:'itemsHeld', verbs:'heldVerbs', test:isHeld },
  {name:'Items Worn', alt:'itemsWorn', verbs:'wornVerbs', test:isWorn },
  {name:'Spells known', alt:'spells', verbs:'spellVerbs', 
    test:function(item) {
      return item.loc == "spellbook";
    }
  },
  {name:'Items Here', alt:'itemsHere', verbs:'hereVerbs', test:isHere },
];




// This function will be called at the start of the game, so can be used
// to introduce your game.
setup = function() {
  msg('This is a test of what we can do.');
  parser.parse("ask mary about house");
  parser.parse("ask mary about basement");
  parser.parse("ask coin about house");
}
