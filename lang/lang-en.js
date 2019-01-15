// Language support

// I originally thought to make these constants, but really there is no particular reason they should be
// and making them variables does allow authors to change them more easily.
// However, I have left them in uppercase, so they re kind of constant-like.

"use strict";









//----------------------------------------------------------------------------------------------
//  ERROR Messages

function ERR_NO_DEFAULT(name) {
  return "No default set for command '" + name + "'.";
}

var ERROR_NO_PLAYER = "No player object found. This will not go well...";
var ERROR_MSG_OR_RUN = "Unsupported type for printOrRun";
var ERROR_NO_ROOM = "Failed to find room";
var ERROR_INIT_BACKGROUND = "It looks like an item has been named 'background`, but is not set as the background item. If you intended to do this, ensure the background property is set to true.";
var ERR_ROMAN_NUMBERS_ONLY = "toRoman can only handle numbers";


const ERROR_NO_PLAYER_FOUND = "No player object found. This is probably due to an error in data.js. Do [Ctrl][Shft]-I to open the developer tools, and go to the console tab, and look at the first error in the list (if it mentions jQuery, skip it and look at the second one). It should tell you exactly which line in which file. But also check one object is actually flagged as the player.";

function ERROR_INIT_REPEATED_NAME(name) {
  return "Attempting to use the name `" + name + "`, there there is already an item with that name in the world.";
}
function ERROR_INIT_DISALLOWED_NAME(name) {
  return "Attempting to use the disallowed name `" + name + "`; a name can only include letters and digits - no spaces or accented characters. Use the 'alias' attribute to give an item a name with other characters.";
}
function ERROR_USING_CREATE_OBJECT(name) {
  return "Attempting to use createObject with `" + name + "` after set up. To ensure games save properly you should use cloneObject to create ites during play.";
}
function ERROR_INIT_UNKNOWN_LOC(item) {
  return "The item `" + item.name + "` is in an unknown location (" + item.loc + ")";
}
function ERROR_INIT_UNKNOWN_EXIT(dir, room, loc) {
  return "The exit `" + dir + "` in room '" + room.name + "' is to an unknown location (" + loc + ")";
}
function ERROR_UNKNOWN_KEY(name) {
  return "The key name for this container, `" + name + "`, does not match any key in the game.";
}

// Text processor errors
function ERR_TP_NO_OBJECT(name, params) {
  return "Failed to find object '" + name + "' in text processor (<i>" + params.tpOriginalString + "</i>)";
}
function ERR_TP_NO_START_BRACE(params) {
  return "Failed to find starting curly brace in text processor (<i>" + params.tpOriginalString + "</i>)";
}
function ERR_TP_UNKNOWN_DIRECTIVE(name, params) {
  return "Attempting to use unknown text processor directive '" + name + "' (<i>" + params.tpOriginalString + "</i>)";
}
function ERR_TP_EXCEPTION(err) {
  return "Text processor string caused an error, returning unmodified (reported error: " + err + ")";
}


// Command errors
function ERR_CMD_RULE_NOT_FUNCTION(cmd, n) {
  return "Failed to process command '" + cmd.name + "' as one of its rules (" + n + ") is not a function.";
}
function ERR_CMD_NO_DOOR(cmd) {
  return "Not found an object called '" + cmd.door + "'. Any exit that uses the 'useWithDoor' function must also set a 'door' attribute.";
}





//----------------------------------------------------------------------------------------------
// SUCCESSFUL Messages

function CMD_TAKE_SUCCESSFUL(char, item, count) {
  return nounVerb(char, "take", true) + " " + item.byname({article:DEFINITE, count:count}) + ".";
}
function CMD_DROP_SUCCESSFUL(char, item, count) {
  return nounVerb(char, "drop", true) + " " + item.byname({article:DEFINITE, count:count}) + ".";
}
function CMD_WEAR_SUCCESSFUL(char, item) {
  return nounVerb(char, "put", true) + " on " + item.byname({article:DEFINITE}) + ".";
}
function CMD_REMOVE_SUCCESSFUL(char, item) {
  return nounVerb(char, "take", true) + " " + item.byname({article:DEFINITE}) + " off.";
}
function CMD_OPEN_SUCCESSFUL(char, item) {
  return nounVerb(char, "open", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function CMD_CLOSE_SUCCESSFUL(char, item) {
  return nounVerb(char, "close", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function CMD_LOCK_SUCCESSFUL(char, item) {
  return nounVerb(char, "lock", true) + "k " + item.byname({article:DEFINITE}) + ".";
}
function CMD_UNLOCK_SUCCESSFUL(char, item) {
  return nounVerb(char, "unlock", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function CMD_TURN_ON_SUCCESSFUL(char, item) {
  return nounVerb(char, "switch", true) + " " + item.byname({article:DEFINITE}) + " on.";
}
function CMD_TURN_OFF_SUCCESSFUL(char, item) {
  return nounVerb(char, "switch", true) + " " + item.byname({article:DEFINITE}) + " off.";
}
function CMD_SIT_ON_SUCCESSFUL(char, item) {
  return nounVerb(char, "sit", true) + " on " + item.byname({article:DEFINITE}) + ".";
}
function CMD_STAND_ON_SUCCESSFUL(char, item) {
  return nounVerb(char, "stand", true) + " on " + item.byname({article:DEFINITE}) + ".";
}
function CMD_RECLINE_ON_SUCCESSFUL(char, item) {
  return nounVerb(char, "lie", true) + " down on " + item.byname({article:DEFINITE}) + ".";
}

function NPC_HEADING(char, dir) {
  return nounVerb(char, "head", true) + " " + dir + ".";
}





//----------------------------------------------------------------------------------------------
// CANNOT Messages

function CMD_CANNOT_TAKE(char, item) {
  return nounVerb(char, "can't", true) + " take " + item.pronouns.objective + ".";
}
function CMD_CANNOT_WEAR(char, item) {
  return nounVerb(char, "can't", true) + " wear " + item.pronouns.objective + ".";
}
function CMD_CANNOT_SWITCH_ON(char, item) {
  return nounVerb(char, "can't", true) + " turn " + item.pronouns.objective + " on.";
}
function CMD_CANNOT_SWITCH_OFF(char, item) {
  return nounVerb(char, "can't", true) + " turn " + item.pronouns.objective + " off.";
}
function CMD_CANNOT_OPEN(char, item) {
  return nounVerb(char, "can't", true) + " open " + item.pronouns.objective + ".";
}
function CMD_CANNOT_CLOSE(char, item) {
  return nounVerb(char, "can't", true) + "t close " + item.pronouns.objective + ".";
}
function CMD_CANNOT_LOCK(char, item) {
  return nounVerb(char, "can't", true) + "t lock " + item.pronouns.objective + ".";
}
function CMD_CANNOT_UNLOCK(char, item) {
  return nounVerb(char, "can't", true) + " unlock " + item.pronouns.objective + ".";
}
function CMD_CANNOT_READ(char, item) {
  return "Nothing worth reading there.";
}
function CMD_CANNOT_USE(char, item) {
  return "No obvious way to use " + item.pronouns.objective + ".";
}
function CMD_CANNOT_EAT(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can eat.";
}
function CMD_CANNOT_STAND_ON(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can stand on.";
}
function CMD_CANNOT_SIT_ON(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can sit on.";
}
function CMD_CANNOT_RECLINE_ON(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can lie on.";
}




//----------------------------------------------------------------------------------------------
// General command messages

var CMD_NOT_KNOWN_MSG = "I don't even know where to begin with that.";
var CMD_DISAMBIG_MSG = "Which do you mean?";
var CMD_NO_MULTIPLES = "You cannot use multiple objects with that command.";
var CMD_NOTHING = "Nothing there to do that with.";
var CMD_NO_ATT_ERROR = "It does not work like that.";
var CMD_UNSUPPORTED_DIR = "Unsupported type for direction";
var CMD_GENERAL_OBJ_ERROR = "So I kind of get what you want to do, but not what you want to do it with.";
var CMD_DONE = "Done.";


function CMD_PANE_CMD_NOT_FOUND(s) {
  return "I don't know that command (" + s + ") - and obviously I should as you just clicked it. Please alert the game author about this bug.";
}
function CMD_PANE_ITEM_NOT_FOUND(s) {
  return "I don't know that object (" + s + ")- and obviously I should as it was listed. Please alert this as a bug in Quest.";
}


function CMD_NOT_THAT_WAY(char, dir) {
  return nounVerb(char, "can't", true) + " go " + dir + ".";
}
function CMD_OBJECT_UNKNOWN_MSG(name) {
  return nounVerb(game.player, "can't", true) + " see anything you might call '" + name + "'.";
}

function CMD_NOT_HERE(char, item) {
  return pronounVerb(item, "'be", true) + " not here.";
}
function CMD_CHAR_HAS_IT(char, item) {
  return nounVerb(char, "have", true) + " " + item.pronouns.objective + ".";
}
function CMD_NONE_THERE(char, item) {
  return "There's no " + item.pluralAlias + " here.";
}
function CMD_NONE_HELD(char, item) {
  return pronoun(char, "have", true) + " no " + item.pluralAlias + ".";
}

function CMD_NOTHING_USEFUL(char, item) {
  return "That's not going to do anything useful.";
}
function CMD_ALREADY(char, item) {
  return sentenceCase(item.pronouns.subjective) + " already " + conjugate(item, "be") + ".";
}


//----------------------------------------------------------------------------------------------
// Specific command messages

function CMD_NOT_NPC(item) {
  return nounVerb(game.player, "can", true) + " tell " + item.byname({article:DEFINITE}) + " to do what you like, but there is no way " + pronounVerb(item, "'ll") + " do it.";
}
function CMD_NOT_NPC_FOR_GIVE(char, item) {
  return "Realistically, " + nounVerb(item, "be") + " not interesting in anything " + char.pronouns.subjective + " might give " + item.pronouns.objective + ".";
}
function CMD_NOT_CONTAINER(char, item) {
  return sentenceCase(item.byname({article:DEFINITE})) + " is not a container";
}

function CMD_NOT_CARRYING(char, item) {
  return pronounVerb(char, "don't", true) + " have " + item.pronouns.objective + ".";
}
function CMD_WEARING(char, item) {
  return pronounVerb(char, "'be", true) + " wearing " + item.pronouns.objective + ".";
}
function CMD_NOT_WEARING(char, item) {
  return pronounVerb(char, "'be", true) + " not wearing " + item.pronouns.objective + ".";
}
function CMD_CANNOT_WEAR_OVER(char, item, outer) {
  return pronounVerb(char, "can't", true) + " put " + item.byname({article:INDEFINITE}) + " on over " + char.pronouns.poss_adj + " " + outer.byname() + ".";
}
function CMD_CANNOT_REMOVE_UNDER(char, item, outer) {
  return pronounVerb(char, "can't", true) + " take off " + char.pronouns.poss_adj + " " + item.byname() + " whilst wearing " + char.pronouns.poss_adj + " " + outer.byname() + ".";
}
function CMD_ALREADY_HAVE(char, item) {
  return pronounVerb(char, "'ve", true) + " got " + item.pronouns.objective + " already.";
}
function CMD_ALREADY_WEARING(char, item) {
  return pronounVerb(char, "'ve", true) + " already wearing " + item.pronouns.objective + ".";
}
function CMD_CANNOT_TAKE_COMPONENT(char, item) {
  return nounVerb(char, "can't", true) + " take " + item.pronouns.objective + "; " + pronounVerb(item, "'be") + " part of " + w[item.loc].byname({article:DEFINITE}) + ".";
}
function CMD_CONTAINER_CLOSED(char, item) {
  return nounVerb(item, "be", true) + " closed.";
}
function CMD_INSIDE_CONTAINER(char, item, cont) {
  return pronounVerb(item, "be", true) + " inside " + cont.byname({article:DEFINITE}) + ".";
}
function CMD_STOP_POSTURE(char) {
  if (!char.posture) return "";
  // You could split up sitting, standing and lying
  return nounVerb(char, "get", true) + " off " + char.postureFurniture.byname({article:DEFINITE}) + ".";
}




//----------------------------------------------------------------------------------------------
// NPC messages

function CMD_NPC_NOTHING_TO_SAY_ABOUT(char) {
  return nounVerb(char, "have", true) + " nothing to say on the subject.";
}
function CMD_NPC_NO_INTEREST_IN(char) {
  return nounVerb(char, "have", true) + " no interest in that subject.";
}



// If the player does SPEAK TO MARY and Mary has some topics, this will be the menu title.
function CMD_SPEAK_TO_MENU_TITLE(char) {
  return "Talk to " + char.byname({article:DEFINITE}) + " about:";
}
// If the player does TELL MARY ABOUT HOUSE this will appear before the response.
function CMD_TELL_ABOUT_INTRO(char, text) {
  return "You tell " + char.byname({article:DEFINITE}) + " about " + text + ".";
}
// If the player does ASK MARY ABOUT HOUSE this will appear before the response.
function CMD_ASK_ABOUT_INTRO(char, text) {
  return "You ask " + char.byname({article:DEFINITE}) + " about " + text + ".";
}



//----------------------------------------------------------------------------------------------
// Door and lock fails

function CMD_LOCKED(char, item) {
  return pronounVerb(item, "'be", true) + " locked.";
}
function CMD_NO_KEY(char, item) {
  return nounVerb(char, "do", true) + " have the right key.";
}
function CMD_LOCKED_EXIT(char, exit) {
  return "That way is locked.";
}
function CMD_OPEN_AND_ENTER(char, doorName) {
  return nounVerb(char, "open", true) + " the " + doorName + " and walk through.";
}
function CMD_UNLOCK_AND_ENTER(char, doorName) {
  return nounVerb(char, "unlock", true) + " the " + doorName + ", open it and walk through.";
}
function CMD_TRY_BUT_LOCKED(char, doorName) {
  return nounVerb(char, "try", true) + " the " + doorName + ", but it is locked.";
}









//----------------------------------------------------------------------------------------------
// Save/load messages

var SL_DIR_HEADINGS = "<tr><th>Filename</th><th>Ver</th><th>Timestamp</th><th>Comment</th></tr>";
var SL_DIR_MSG = "Ver is the version of the game that was being played when saved. Loading a save game from a different version may or may not work. You can delete a file with the DEL command.";
var SL_NO_FILENAME = "Trying to save with no filename";
function SL_CANNOT_FIND_OBJ(name) {
  return "Cannot find object '" + name + "'";
}
function SL_CANNOT_FIND_PROTOTYPE(name) {
  return "Cannot find prototype '" + name + "'";
}
function SL_UNKNOWN_SAVE_TYPE(name, saveType) {
  return "Unknown save type for object '" + name + "' (" + saveType + ")";
}
function SL_CANNOT_FIND_TYPE(name) {
  return "Cannot find save type for object '" + name + "'";
}
function SL_BAD_FORMAT(name) {
  return "Bad format in saved data (" + name + ")";
}



//----------------------------------------------------------------------------------------------


var CMD_IGNORED_WORDS = ["", "the", "a", "an"];
var CMD_JOINER_REGEX = /\,|\band\b/;
var CMD_ALL_REGEX = /^(all|everything)$/;
var CMD_ALL_EXCLUDE_REGEX = /^((all|everything) (but|except)\b)/;
var CMD_GO = "go to |goto |go |head |";


var LIST_AND = " and ";
var LIST_NOTHING = "nothing";


var NEVER_MIND = "Never mind.";

var DEFAULT_DESCRIPTION = "It's just scenery.";


//----------------------------------------------------------------------------------------------
// Language constructs

var PRONOUNS = {
  thirdperson:{subjective:"it", objective:"it", possessive: "its", poss_adj: "its", reflexive:"itself"},
  massnoun:{subjective:"it", objective:"it", possessive: "its", poss_adj: "its", reflexive:"itself"},
  male:{subjective:"he", objective:"him", possessive: "his", poss_adj: "his", reflexive:"himself"},
  female:{subjective:"she", objective:"her", possessive: "hers", poss_adj: "her", reflexive:"herself"},
  plural:{subjective:"they", objective:"them", possessive: "theirs", poss_adj: "their", reflexive:"themselves"},
  firstperson:{subjective:"I", objective:"me", possessive: "mine", poss_adj: "my", reflexive:"myself"},
  secondperson:{subjective:"you", objective:"you", possessive: "yours", poss_adj: "your", reflexive:"yourself"},
};


var VERBS = {
  examine:"Examine",
  take:"Take",
  drop:"Drop",
  open:"Open",
  close:"Close",
  switchon:"Switch on",
  switchoff:"Switch off",
  wear:"Wear",
  remove:"Remove",
  lookat:"Look at",
  speakto:"Speak to",
};


// Change the abbrev values to suit your game (or language)
var EXITS = [
  {name:'northwest', abbrev:'NW'}, 
  {name:'north', abbrev:'N'}, 
  {name:'northeast', abbrev:'NE'}, 
  {name:'in', abbrev:'In', alt:'enter'}, 
  {name:'up', abbrev:'U'},
  
  {name:'west', abbrev:'W'}, 
  {name:'Look', abbrev:'Lk', nocmd:true}, 
  {name:'east', abbrev:'E'}, 
  {name:'out', abbrev:'Out', alt:'exit'}, 
  {name:'down', abbrev:'Dn', alt:'d'}, 

  {name:'southwest', abbrev:'SW'}, 
  {name:'south', abbrev:'S'}, 
  {name:'southeast', abbrev:'SE'}, 
  {name:'Wait', abbrev:'Z', nocmd:true}, 
  {name:'Help', abbrev:'?', nocmd:true}, 
];







function addDefiniteAritcle(item) {
  return item.properName ? "" : "the ";
}

function addIndefiniteAritcle(item) {
  if (item.indefArticle) {
    return item.indefArticle + " ";
  }
  if (item.properName) {
    return "";
  }
  if (item.pronouns === PRONOUNS.plural) {
    return "some ";
  }
  if (item.pronouns === PRONOUNS.massnoun) {
    return "";
  }
  if (/^[aeiou]/i.test(item.alias)) {
    return "an ";
  }
  return "a ";
}





const numberUnits = "zero;one;two;three;four;five;six;seven;eight;nine;ten;eleven;twelve;thirteen;fourteen;fifteen;sixteen;seventeen;eighteen;nineteen;twenty".split(";");
const numberTens = "twenty;thirty;forty;fifty;sixty;seventy;eighty;ninety".split(";");


function toWords(number) {
  if (typeof number !== "number") {
    errormsg ("toWords can only handle numbers");
    return number;
  }
  
  var s = "";
  if (number < 0) {
    s = "minus ";
    number = -number;
  }
  if (number < 2000) {
    var hundreds = Math.floor(number / 100);
    number = number % 100;
    if (hundreds > 0) {
      s = s + numberUnits[hundreds] + " hundred ";
      if (number > 0) {
        s = s + "and ";
      }
    }
    if (number < 20) {
      if (number !== 0 || s === "") {
        s = s + numberUnits[number];
      }
    }
    else {
      var units = number % 10;
      var tens = Math.floor(number / 10) % 10;
      s = s + numberTens[tens - 2];
      if (units !== 0) {
        s = s + numberUnits[units];
      }
    }
  }
  else {
    s = "" + number;
  }
  return (s);
}



function contentsForSurface(contents) {
  return "with " + formatList(contents, {article:INDEFINITE, lastJoiner:LIST_AND, modified:true, nothing:LIST_NOTHING, loc:this.name}) + " on it";
}

function contentsForContainer(contents) {
  return "containing " + formatList(contents, {article:INDEFINITE, lastJoiner:LIST_AND, modified:true, nothing:LIST_NOTHING, loc:this.name});
}





tp.text_processors.objects =function(arr, params) {
  var listOfOjects = scope(isHereListed);
  return formatList(listOfOjects, {article:INDEFINITE, lastJoiner:LIST_AND, modified:true, nothing:LIST_NOTHING, loc:game.player.loc});
};

  
tp.text_processors.exits = function(arr, params) {
  var list = [];
  for (var i = 0; i < EXITS.length; i++) {
    if (hasExit(game.room, EXITS[i].name)) {
      list.push(EXITS[i].name);
    }
  }
  return formatList(list, {lastJoiner:" or ", nothing:"nowhere"});
};







//----------------------------------------------------------------------------------------------
// Conjugating



var CONJUGATIONS = {
  i:[
    { name:"be", value:"am"},
    { name:"'be", value:"'m"},
  ],
  you:[
    { name:"be", value:"are"},
    { name:"'be", value:"'re"},
  ],
  we:[
    { name:"be", value:"are"},
    { name:"'be", value:"'re"},
  ],
  they:[
    { name:"be", value:"are"},
    { name:"'be", value:"'re"},
  ],
  it:[
    { name:"be", value:"is"},
    { name:"have", value:"has"},
    { name:"can", value:"can"},
    { name:"mould", value:"moulds"},
    { name:"*ould", value:"ould"},
    { name:"must", value:"must"},
    { name:"don't", value:"doesn't"},
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
  if (gender === "he" || gender === "she") { gender = "it"; }
  var arr = CONJUGATIONS[gender.toLowerCase()];

  if (!arr) {
    errormsg(ERR_QUEST_BUG, "No conjugations found: CONJUGATIONS_" + gender.toLowerCase());
    return verb;
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name === verb) {
      return arr[i].value;
    }
  }
  
  for (i = 0; i < arr.length; i++) {
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
}


function pronounVerb(item, verb, capitalise) {
  var s = item.pronouns.subjective + " " + conjugate(item, verb);
  s = s.replace(/ +\'/, "'");  // yes this is a hack!
  return capitalise ? sentenceCase(s) : s;
}

function nounVerb(item, verb, capitalise) {
  if (item === game.player) {
    return pronounVerb(item, verb, capitalise);
  }
  var s = item.byname({article:DEFINITE}) + " " + conjugate(item, verb);
  s = s.replace(/ +\'/, "'");  // yes this is a hack!
  return capitalise ? sentenceCase(s) : s;
}






//----------------------------------------------------------------------------------------------
// Meta-messages

function helpScript() {
  metamsg("This is an experiment in using JavaScript (and a little jQuery) to create a text game.");
  if (PANES !== "None") {
    if (COMPASS) {
      metamsg("Use the compass rose at the top to move around. Click 'Lk' to look at you current location, 'Z' to wait or '?' for help.");
    }
    metamsg("To interact with an object, click on it, and a set of possible actions will appear under it. Click on the appropriate action.");
  }
  if (TEXT_INPUT) {
    metamsg("Type commands in the command bar to interact with the world. To move, use the eight compass directions (or just 'n', 'ne', etc.). Up/down and in/out may be options too. You can also LOOK, HELP or WAIT. Other commands are generally of the form GET HAT or PUT THE BLUE TEAPOT IN THE ANCIENT CHEST. Experiment and see what you can do!");
    metamsg("You can use ALL and ALL BUT with some commands, for example TAKE ALL, and PUT ALL BUT SWORD IN SACK. You can also use pronouns, so LOOK AT MARY, then TALK TO HER. The pronoun will refer to the last subject in the last successful command, so after PUT HAT AND FUNNY STICK IN THE DRAWER, 'IT' will refer to the funny stick (the hat and the stick are subjects of the sentence, the drawer was the object). ");
    metamsg("You can use the up and down arrows to scroll back though your previous commands - especially useful if you realise you spelled something wrong. You can use [SHIFT] with the arrow keys to move north, south, east or west, or use the number pad for all eight compass directions (when number lock is on).");
    metamsg("If you come across another character, you can ask him or her to do something. Try things like MARY,PUT THE HAT INTHE BOX, or TELL MARY TO GET ALL BUT THE KNIFE. Other characters will not respond to the TALK TO/SPEAK TO command or EXAMINE/LOOK AT command.");
  }
  return SUCCESS_NO_TURNSCRIPTS;
}


function aboutScript() {
  metamsg("{i:" + TITLE + " version " + VERSION + "} was written by " + AUTHOR + " using Quest 6.");
  if (THANKS.length > 0) {
    metamsg("Thanks to " + formatList(THANKS, {lastJoiner:LIST_AND}) + ".");
  }
}



function saveLoadScript() {
  metamsg("To save your progress, type SAVE followed by the name to save with.");
  metamsg("To load your game, refresh/reload this page in your browser, then type LOAD followed by the name you saved with.");
  metamsg("To see a list of save games, type DIR.");
  return SUCCESS_NO_TURNSCRIPTS;
}

