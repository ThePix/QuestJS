// Language support
const CMD_IGNORED_WORDS = ["", "the", "a", "an"];
const CMD_JOINER_REGEX = /\,|\band\b/;
const CMD_ALL_REGEX = /^(all|everything)$/;
const CMD_ALL_EXCLUDE_REGEX = /^((all|everything) (but|except)\b)/;
const CMD_GO = "go to |goto |go |head |"

const CMD_ECHO = true;
const CMD_NOT_KNOWN_MSG = "I don't even know where to begin with that.";
const CMD_OBJECT_UNKNOWN_MSG = "Not finding any object '%'.";
const CMD_DISAMBIG_MSG = "Which do you mean?";
const CMD_NO_MULTIPLES = "You cannot use multiple objects with that command.";
const CMD_NOTHING = "Nothing there to do that with.";
const CMD_NO_ATT_ERROR = "It does not work like that.";
const CMD_NOT_THAT_WAY = "You can't go that way.";
const CMD_UNSUPPORTED_DIR = "Unsupported type for direction";
const CMD_GENERAL_OBJ_ERROR = "So I kind of get what you want to do, but not what you want to do it with.";
const CMD_NOT_CONTAINER = "That's not a container";
const CMD_NOT_CARRYING = "You're not carrying it";
const CMD_DONE = "Done";

const CMD_MSG_OR_RUN_ERROR = "Unsupported type for msgOrRun"
const CMD_FAILED_TO_FIND_ROOM = "Failed to find room"

const BUG_PANE_CMD_NOT_FOUND = "Cannot find that command. This is a bug; please alert the creator.";
const BUG_PANE_ITEM_NOT_FOUND = "Cannot find that item. This is a bug; please alert the Quest coders.";

// UI options
const PANES = 'Left';  //Can be set to Left, Right or None.
const COMPASS = true;
const TEXT_INPUT = true;

const SUCCESS = 1;
const SUCCESS_NO_TURNSCRIPTS = 2;
const FAILED = -1;

const ERR_QUEST_BUG = 21;   // A bug in Quest I need to sort out
const ERR_GAME_BUG = 22;    // A bug in the game the creator needs to sort out
const ERR_PARSER = 23;      // Player is typing something unintelligible
const ERR_PLAYER = 24;      // Player is typing something not allowed
const DBG_PARSER = 21;      // Debug message from the parser


const THIRD_PERSON = {subjective:"it", objective:"it", possessive: "its"};
const MALE = {subjective:"he", objective:"him", possessive: "his"};
const FEMALE = {subjective:"she", objective:"her", possessive: "her"};
const PLURAL = {subjective:"they", objective:"them", possessive: "their"};
const FIRST_PERSON = {subjective:"I", objective:"me", possessive: "my"};
const SECOND_PERSON = {subjective:"you", objective:"you", possessive: "your"};

const DEFAULT_RESPONSES = {
  take:"You can't take it.",
  examine:"It's not important.",
  wear:"That's not something you can wear.",
};


// Change the abbrev values to suit your game (or language)
const exits = [
  {name:'northwest', abbrev:'NW'}, 
  {name:'north', abbrev:'N'}, 
  {name:'northeast', abbrev:'NE'}, 
  {name:'in', abbrev:'In'}, 
  {name:'up', abbrev:'U'},
  
  {name:'west', abbrev:'W'}, 
  {name:'Look', abbrev:'Lk', nocmd:true}, 
  {name:'east', abbrev:'E'}, 
  {name:'out', abbrev:'Out'}, 
  {name:'down', abbrev:'Dn'}, 

  {name:'southwest', abbrev:'SW'}, 
  {name:'south', abbrev:'S'}, 
  {name:'southeast', abbrev:'SE'}, 
  {name:'Wait', abbrev:'Z', nocmd:true}, 
  {name:'Help', abbrev:'?', nocmd:true}, 
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

helpScript = function() {
  metamsg('This is an experiment in using JavaScript (and a little jQuery) to create a text game. Currently all interactions are via the pane on the right.');
  metamsg('Use the compass rose at the top to move around. Click "Lk" to look at you current location, "Z" to wait or "?" for help.');
  metamsg('Click an item to interact with it, then click the buttons to select an interaction.');
  return SUCCESS_NO_TURNSCRIPTS;
};


const CONJUGATIONS_I = [
  { name:"be", value:"am"},
  { name:"_be", value:"'m"},
];
const CONJUGATIONS_YOU = [
  { name:"be", value:"are"},
  { name:"_be", value:"'re"},
];
const CONJUGATIONS_WE = [
  { name:"be", value:"are"},
  { name:"_be", value:"'re"},
];
const CONJUGATIONS_THEY = [
  { name:"be", value:"are"},
  { name:"_be", value:"'re"},
];
const CONJUGATIONS_IT = [
  { name:"be", value:"is"},
  { name:"have", value:"has"},
  { name:"can", value:"can"},
  { name:"mould", value:"moulds"},
  { name:"*ould", value:"ould"},
  { name:"must", value:"must"},
  { name:"can_t", value:"can't"},
  { name:"won_t", value:"won't"},
  { name:"cannot", value:"cannot"},
  { name:"@n_t", value:"n't"},
  { name:"_ve", value:"'s"},
  { name:"_be", value:"'s"},
  { name:"*ay", value:"ays"},
  { name:"*oy", value:"oys"},
  { name:"*ey", value:"eys"},
  { name:"*y", value:"ies"},
  { name:"*ss", value:"sses"},
  { name:"*s", value:"sses"},
  { name:"*sh", value:"shes"},
  { name:"*ch", value:"ches"},
  { name:"*o", value:"oes"},
  { name:"*x", value:"xes"},
  { name:"*z", value:"zes"},
  { name:"*", value:"s"},
];




conjugate = function(item, verb) {
  var gender = item.pronouns.subjective;
  if (gender == "he" || genders == "she") { gender = "it" };
  arr = window["CONJUGATIONS_" + gender.toUpperCase()];

  if (!arr) {errormsg(ERR_QUEST_BUG, "No conjugations found: CONJUGATIONS_" + gender.toUpperCase();
  
            if (DictionaryContains (dict, verb)) {
                return (DictionaryItem (dict, verb))
            }
            foreach (ending, dict) {
                if (Left (ending, 1) = "@" and EndsWith (verb, Mid (ending, 2))) {
                  return (Conjugate (obj, Left (verb, LengthOf(verb) - LengthOf(ending) + 1)) + DictionaryItem (dict, ending))
                }
                else if (Left (ending, 1) = "*" and EndsWith (verb, Mid (ending, 2))) {
                    return (Left (verb, LengthOf(verb) - LengthOf(ending) + 1) + DictionaryItem (dict, ending))
                }
            }
        }
    return (verb)
};






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
  parser.parse("take blue hat, teapot and ball from chair");
  //parser.parse("ask ball about hats");
  //parser.parse("take all but kettle and chair");
msg("--" + DEFAULT_RESPONSES.examine);
}

