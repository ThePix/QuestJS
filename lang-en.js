// Language support

// I originally thought to make these constants, but really there is no particular reason they should be
// and making them variables does allow authors to change them more easily.
// However, I have left them in uppercase, so they re kind of constant-like.

"use strict";

var CMD_IGNORED_WORDS = ["", "the", "a", "an"];
var CMD_JOINER_REGEX = /\,|\band\b/;
var CMD_ALL_REGEX = /^(all|everything)$/;
var CMD_ALL_EXCLUDE_REGEX = /^((all|everything) (but|except)\b)/;
var CMD_GO = "go to |goto |go |head |"

var CMD_NOT_KNOWN_MSG = "I don't even know where to begin with that.";
var CMD_OBJECT_UNKNOWN_MSG = "Not finding any object '%'.";
var CMD_DISAMBIG_MSG = "Which do you mean?";
var CMD_NO_MULTIPLES = "You cannot use multiple objects with that command.";
var CMD_NOTHING = "Nothing there to do that with.";
var CMD_NO_ATT_ERROR = "It does not work like that.";
var CMD_NOT_THAT_WAY = "You can't go that way.";
var CMD_UNSUPPORTED_DIR = "Unsupported type for direction";
var CMD_GENERAL_OBJ_ERROR = "So I kind of get what you want to do, but not what you want to do it with.";
var CMD_PANE_CMD_NOT_FOUND = "I don't know that command - and obviously I should as you just clicked it. Please alert the game author about this bug."
var CMD_PANE_ITEM_NOT_FOUND = "I don't know that object - and obviously I should as it was listed. Please alert this as a bug in Quest."
var CMD_DONE = "Done";




function CMD_NOT_CONTAINER(item) {
  return sentenceCase(item.byname("the")) + " is not a container";
};



function CMD_NOT_CARRYING(item) {
  return "You're not carrying " + item.pronouns.objective + ".";
};
function CMD_WEARING(item) {
  return "You're wearing " + item.pronouns.objective + ".";
};
function CMD_NOT_HERE(item) {
  return sentenceCase(item.pronouns.subjective) + "'s not here.";
};
function CMD_NOT_WEARING(item) {
  return "You not wearing " + item.pronouns.objective + ".";
};
function CMD_CANNOT_TAKE(item) {
  return "You can't take " + item.pronouns.objective + ".";
};
function CMD_CANNOT_WEAR(item) {
  return "You can't wear " + item.pronouns.objective + ".";
};
function CMD_CANNOT_OPEN(item) {
  return "You can't open " + item.pronouns.objective + ".";
};
function CMD_CANNOT_CLOSE(item) {
  return "You can't close " + item.pronouns.objective + ".";
};
function CMD_CANNOT_LOCK(item) {
  return "You can't lock " + item.pronouns.objective + ".";
};
function CMD_CANNOT_UNLOCK(item) {
  return "You can't unlock " + item.pronouns.objective + ".";
};
function CMD_CANNOT_READ(item) {
  return "Nothing worth reading there.";
};
function CMD_CANNOT_EAT(item) {
  return pronounVerb(item, "'be") + " not something you can eat.";
};

function CMD_ALREADY_HAVE(item) {
  return "You already have " + item.pronouns.objective + ".";
};
function CMD_ALREADY_WEARING(item) {
  return "You're already wearing " + item.pronouns.objective + ".";
};
function CMD_ALREADY(item) {
  return sentenceCase(item.pronouns.subjective) + " already " + conjugate(item, "be") + ".";
};
function CMD_LOCKED(item) {
  return sentenceCase(item.pronouns.subjective) + " " + conjugate(item, "'be") + " locked.";
};
var CMD_LOCKED_EXIT = "That way is locked.";


function CMD_TAKE_SUCCESSFUL(item) {
  return "You take " + item.byname("the") + ".";
};
function CMD_DROP_SUCCESSFUL(item) {
  return "You drop " + item.byname("the") + ".";
};
function CMD_WEAR_SUCCESSFUL(item) {
  return "You put on " + item.byname("the") + ".";
};
function CMD_REMOVE_SUCCESSFUL(item) {
  return "You take " + item.byname("the") + " off.";
};
function CMD_OPEN_SUCCESSFUL(item) {
  return "You open " + item.byname("the") + ".";
};
function CMD_CLOSE_SUCCESSFUL(item) {
  return "You close " + item.byname("the") + ".";
};
function CMD_LOCK_SUCCESSFUL(item) {
  return "You lock " + item.byname("the") + ".";
};
function CMD_UNLOCK_SUCCESSFUL(item) {
  return "You unlock " + item.byname("the") + ".";
};
function CMD_TURN_ON_SUCCESSFUL(item) {
  return "You switch " + item.byname("the") + " on.";
};
function CMD_TURN_OFF_SUCCESSFUL(item) {
  return "You switch " + item.byname("the") + " off.";
};



var ERROR_NO_PLAYER = "No player object found. This will not go well...";
var ERROR_MSG_OR_RUN = "Unsupported type for printOrRun";
var ERROR_NO_ROOM = "Failed to find room";
var ERROR_INIT_BACKGROUND = "It looks like an item has been named 'background`, but is not set as the background item. If you intended to do this, ensure the background property is set to true.";
function ERROR_INIT_REPEATED_NAME(name) {
  return "Attempting to use the name `" + name + "`, there there is already an item with that name in the world.";
};
function ERROR_INIT_DISALLOWED_NAME(name) {
  return "Attempting to use the disallowed name `" + name + "`; a name can only include letters and digits - no spaces or accented characters. Use the 'alias' attribute to give an item a name with other characters.";
};
function ERROR_USING_CREATE_OBJECT(name) {
  return "Attempting to use createObject with `" + name + "` after set up. To ensure games save properly you should use cloneObject to create ites during play.";
};
function ERROR_INIT_UNKNOWN_LOC(item) {
  return "The item `" + item.name + "` is in an unknown location (" + item.loc + ")";
};
function ERROR_INIT_UNKNOWN_EXIT(dir, room, loc) {
  return "The exit `" + dir + "` in room '" + room.name + "' is to an unknown location (" + loc + ")"
};


var NEVER_MIND = "Never mind.";

var DEFAULT_DESCRIPTION = "It's just scenery.";

var PRONOUNS = {
  thirdperson:{subjective:"it", objective:"it", possessive: "its", poss_adj: "its", reflexive:"itself"},
  male:{subjective:"he", objective:"him", possessive: "his", poss_adj: "his", reflexive:"himself"},
  female:{subjective:"she", objective:"her", possessive: "hers", poss_adj: "her", reflexive:"herself"},
  plural:{subjective:"they", objective:"them", possessive: "theirs", poss_adj: "their", reflexive:"theirselves"},
  firstperson:{subjective:"I", objective:"me", possessive: "mine", poss_adj: "my", reflexive:"myself"},
  secondperson:{subjective:"you", objective:"you", possessive: "yours", poss_adj: "your", reflexive:"yourself"},
};



// Change the abbrev values to suit your game (or language)
var EXITS = [
  {name:'northwest', abbrev:'NW'}, 
  {name:'north', abbrev:'N'}, 
  {name:'northeast', abbrev:'NE'}, 
  {name:'in', abbrev:'In'}, 
  {name:'up', abbrev:'U'},
  
  {name:'west', abbrev:'W'}, 
  {name:'Look', abbrev:'Lk', nocmd:true}, 
  {name:'east', abbrev:'E'}, 
  {name:'out', abbrev:'Out'}, 
  {name:'down', abbrev:'Dn', alt:'d'}, 

  {name:'southwest', abbrev:'SW'}, 
  {name:'south', abbrev:'S'}, 
  {name:'southeast', abbrev:'SE'}, 
  {name:'Wait', abbrev:'Z', nocmd:true}, 
  {name:'Help', abbrev:'?', nocmd:true}, 
];



function helpScript() {
  metamsg("This is an experiment in using JavaScript (and a little jQuery) to create a text game.");
  if (PANES != "None") {
    if (COMPASS) {
      metamsg("Use the compass rose at the top to move around. Click 'Lk' to look at you current location, 'Z' to wait or '?' for help.");
    }
    metamsg("To interact with an object, click on it, and a set of possible actions will appear under it. Click on the appropriate action.");
  }
  if (TEXT_INPUT) {
    metamsg("Type commands in the command bar to interact with the world. To move, use the eight compass directions (or just 'n', 'ne', etc.). Up/down and in/out may be options too. You can also LOOK, HELP or WAIT. Other commands are generally of the form GET HAT or PUT THE BLUE TEAPOT IN THE ANCIENT CHEST. Experiment and see what you can do!");
    metamsg("You can use ALL and ALL BUT with some commands, for example TAKE ALL, and PUT ALL BUT SWORD IN SACK. You can also use pronouns, so LOOK AT MARY, then TALK TO HER. The pronoun will refer to the last subject in the last successful command, so after PUT HAT AND FUNNY STICK IN THE DRAWER, 'IT' will refer to the funny stick (the hat and the stick are subjects of the sentence, the drawer was the object). ");
    metamsg("You can use the up and down arrows to scroll back though your previous commands - especially useful if you realise you spelled something wrong. You can use [SHIFT] with the arrow keys to move north, south, east or west, or use the number pad for all eight copmpass directions (when number lock is on).");
  }
  return SUCCESS_NO_TURNSCRIPTS;
};


function saveLoadScript() {
  metamsg("To save your progress, type SAVE followed by the name to save with.");
  metamsg("To load your game, refresh/reload this page in your browser, then type LOAD followed by the name you saved with.");
  metamsg("To see a list of save games, type DIR.");
  return SUCCESS_NO_TURNSCRIPTS;
}


var CONJUGATIONS = {
  i:[
    { name:"be", value:"am"},
    { name:"_be", value:"'m"},
  ],
  you:[
    { name:"be", value:"are"},
    { name:"_be", value:"'re"},
  ],
  we:[
    { name:"be", value:"are"},
    { name:"_be", value:"'re"},
  ],
  they:[
    { name:"be", value:"are"},
    { name:"_be", value:"'re"},
  ],
  it:[
    { name:"be", value:"is"},
    { name:"have", value:"has"},
    { name:"can", value:"can"},
    { name:"mould", value:"moulds"},
    { name:"*ould", value:"ould"},
    { name:"must", value:"must"},
    { name:"can't", value:"can't"},
    { name:"won't", value:"won't"},
    { name:"cannot", value:"cannot"},
    { name:"@n't", value:"n't"},
    { name:"'ve", value:"'s"},
    { name:"'be", value:"'s"},
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
  ],
};




function conjugate(item, verb) {
  var gender = item.pronouns.subjective;
  if (gender == "he" || gender == "she") { gender = "it" };
  var arr = CONJUGATIONS[gender.toLowerCase()];

  if (!arr) {
    errormsg(ERR_QUEST_BUG, "No conjugations found: CONJUGATIONS_" + gender.toLowerCase());
    return verb;
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name == verb) {
      return arr[i].value;
    }
  }
  
  for (var i = 0; i < arr.length; i++) {
    var name = arr[i].name;
    var value = arr[i].value;
    if (name.startsWith("@") && verb.endsWith(name.substring(1))) {
      return conjugate(item, verb.substring(0, verb.length - name.length + 1)) + value;
    }
    else if (name.startsWith("*") && verb.endsWith(name.substring(1))) {
      return item, verb.substring(0, verb.length - name.length + 1) + value;
    }
  }
  return verb;
};


function pronounVerb(item, verb, capitalise) {
  var s = item.pronouns.subjective + " " + conjugate(item, verb);
  s = s.replace(" '", "'");  // yes this is a hack!
  return capitalise ? sentenceCase(s) : s;
};

function nounVerb(item, verb, capitalise) {
  var s = item.alias + " " + conjugate(item, verb);
  return capitalise ? sentenceCase(s) : s;
};





function _itemThe(item) {
  return item.properName ? "" : "the ";
}

function _itemA(item) {
  if (item.indefArticle) {
    return item.indefArticle + " ";
  }
  if (item.properName) {
    return "";
  }
  if (item.pronouns == PRONOUNS.plural) {
    return "some ";
  }
  if (/^[aeiou]/i.test(item.alias)) {
    return "an ";
  }
  return "a ";
}
