// Language support

// I originally thought to make these constants, but really there is no particular reason they should be
// and making them variables does allow authors to change them more easily.
// However, I have left them in uppercase, so they re kind of constant-like.

"use strict";











//----------------------------------------------------------------------------------------------
// SUCCESSFUL Messages

function TAKE_SUCCESSFUL(char, item, count) {
  return nounVerb(char, "take", true) + " " + item.byname({article:DEFINITE, count:count}) + ".";
}
function DROP_SUCCESSFUL(char, item, count) {
  return nounVerb(char, "drop", true) + " " + item.byname({article:DEFINITE, count:count}) + ".";
}
function WEAR_SUCCESSFUL(char, item) {
  return nounVerb(char, "put", true) + " on " + item.byname({article:DEFINITE}) + ".";
}
function REMOVE_SUCCESSFUL(char, item) {
  return nounVerb(char, "take", true) + " " + item.byname({article:DEFINITE}) + " off.";
}
function OPEN_SUCCESSFUL(char, item) {
  return nounVerb(char, "open", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function CLOSE_SUCCESSFUL(char, item) {
  return nounVerb(char, "close", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function LOCK_SUCCESSFUL(char, item) {
  return nounVerb(char, "lock", true) + "k " + item.byname({article:DEFINITE}) + ".";
}
function UNLOCK_SUCCESSFUL(char, item) {
  return nounVerb(char, "unlock", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function FILL_SUCCESSFUL(char, item) {
  return nounVerb(char, "fill", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function EMPTY_SUCCESSFUL(char, item) {
  return nounVerb(char, "empty", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function TURN_ON_SUCCESSFUL(char, item) {
  return nounVerb(char, "switch", true) + " " + item.byname({article:DEFINITE}) + " on.";
}
function TURN_OFF_SUCCESSFUL(char, item) {
  return nounVerb(char, "switch", true) + " " + item.byname({article:DEFINITE}) + " off.";
}
function SIT_ON_SUCCESSFUL(char, item) {
  return nounVerb(char, "sit", true) + " on " + item.byname({article:DEFINITE}) + ".";
}
function STAND_ON_SUCCESSFUL(char, item) {
  return nounVerb(char, "stand", true) + " on " + item.byname({article:DEFINITE}) + ".";
}
function RECLINE_ON_SUCCESSFUL(char, item) {
  return nounVerb(char, "lie", true) + " down on " + item.byname({article:DEFINITE}) + ".";
}

function NPC_HEADING(char, dir) {
  return nounVerb(char, "head", true) + " " + dir + ".";
}





//----------------------------------------------------------------------------------------------
// CANNOT Messages

function CANNOT_TAKE(char, item) {
  return nounVerb(char, "can't", true) + " take " + item.pronouns.objective + ".";
}
function CANNOT_WEAR(char, item) {
  return nounVerb(char, "can't", true) + " wear " + item.pronouns.objective + ".";
}
function CANNOT_SWITCH_ON(char, item) {
  return nounVerb(char, "can't", true) + " turn " + item.pronouns.objective + " on.";
}
function CANNOT_SWITCH_OFF(char, item) {
  return nounVerb(char, "can't", true) + " turn " + item.pronouns.objective + " off.";
}
function CANNOT_OPEN(char, item) {
  return nounVerb(char, "can't", true) + " open " + item.pronouns.objective + ".";
}
function CANNOT_CLOSE(char, item) {
  return nounVerb(char, "can't", true) + "t close " + item.pronouns.objective + ".";
}
function CANNOT_LOCK(char, item) {
  return nounVerb(char, "can't", true) + "t lock " + item.pronouns.objective + ".";
}
function CANNOT_UNLOCK(char, item) {
  return nounVerb(char, "can't", true) + " unlock " + item.pronouns.objective + ".";
}
function CANNOT_READ(char, item) {
  return "Nothing worth reading there.";
}
function CANNOT_USE(char, item) {
  return "No obvious way to use " + item.pronouns.objective + ".";
}
function CANNOT_EAT(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can eat.";
}
function CANNOT_SMASH(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can break.";
}
function CANNOT_FILL(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can fill.";
}
function CANNOT_EMPTY(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can empty.";
}
function CANNOT_LOOK_OUT(char, item) {
  pronounVerb(char, "can't", true) + " look out of " + item.pronouns.objective + ".";
}
function CANNOT_STAND_ON(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can stand on.";
}
function CANNOT_SIT_ON(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can sit on.";
}
function CANNOT_RECLINE_ON(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can lie on.";
}




//----------------------------------------------------------------------------------------------
// General command messages

const NOT_KNOWN_MSG = "I don't even know where to begin with that.";
const DISAMBIG_MSG = "Which do you mean?";
const NO_MULTIPLES_MSG = "You cannot use multiple objects with that command.";
const NOTHING_MSG = "Nothing there to do that with.";
const GENERAL_OBJ_ERROR = "So I kind of get what you want to do, but not what you want to do it with.";
const DONE_MSG = "Done.";




function NO_SMELL(char) {
  return nounVerb(char, "can't", true) + " smell anything here.";
}
function NO_LISTEN(char) {
  return nounVerb(char, "can't", true) + " hear anything of note here.";
}
function NOTHING_THERE(char) {
  return nounVerb(char, "be", true) + " sure there's nothing there.";
}
function NOT_THAT_WAY(char, dir) {
  return nounVerb(char, "can't", true) + " go " + dir + ".";
}
function OBJECT_UNKNOWN_MSG(name) {
  return nounVerb(game.player, "can't", true) + " see anything you might call '" + name + "' here.";
}

function NOT_HERE(char, item) {
  return pronounVerb(item, "'be", true) + " not here.";
}
function CHAR_HAS_IT(char, item) {
  return nounVerb(char, "have", true) + " " + item.pronouns.objective + ".";
}
function NONE_THERE(char, item) {
  return "There's no " + item.pluralAlias + " here.";
}
function NONE_HELD(char, item) {
  return pronoun(char, "have", true) + " no " + item.pluralAlias + ".";
}

function NOTHING_USEFUL(char, item) {
  return "That's not going to do anything useful.";
}
function ALREADY(item) {
  return sentenceCase(item.pronouns.subjective) + " already " + conjugate(item, "be") + ".";
}
function DEFAULT_EXAMINE(char, item) {
  return pronounVerb(item, "be", true) + " just your typical, every day " + item.byname() + ".";
}


//----------------------------------------------------------------------------------------------
// Specific command messages

function NOT_NPC(item) {
  return nounVerb(game.player, "can", true) + " tell " + item.byname({article:DEFINITE}) + " to do what you like, but there is no way " + pronounVerb(item, "'ll") + " do it.";
}
function NOT_NPC_FOR_GIVE(char, item) {
  return "Realistically, " + nounVerb(item, "be") + " not interesting in anything " + char.pronouns.subjective + " might give " + item.pronouns.objective + ".";
}
function NOT_CONTAINER(char, item) {
  return sentenceCase(item.byname({article:DEFINITE})) + " is not a container";
}

function NOT_CARRYING(char, item) {
  return pronounVerb(char, "don't", true) + " have " + item.pronouns.objective + ".";
}
function WEARING(char, item) {
  return pronounVerb(char, "'be", true) + " wearing " + item.pronouns.objective + ".";
}
function NOT_WEARING(char, item) {
  return pronounVerb(char, "'be", true) + " not wearing " + item.pronouns.objective + ".";
}
function CANNOT_WEAR_OVER(char, item, outer) {
  return pronounVerb(char, "can't", true) + " put " + item.byname({article:INDEFINITE}) + " on over " + char.pronouns.poss_adj + " " + outer.byname() + ".";
}
function CANNOT_REMOVE_UNDER(char, item, outer) {
  return pronounVerb(char, "can't", true) + " take off " + char.pronouns.poss_adj + " " + item.byname() + " whilst wearing " + char.pronouns.poss_adj + " " + outer.byname() + ".";
}
function ALREADY_HAVE(char, item) {
  return pronounVerb(char, "'ve", true) + " got " + item.pronouns.objective + " already.";
}
function ALREADY_WEARING(char, item) {
  return pronounVerb(char, "'ve", true) + " already wearing " + item.pronouns.objective + ".";
}
function CANNOT_TAKE_COMPONENT(char, item) {
  return nounVerb(char, "can't", true) + " take " + item.pronouns.objective + "; " + pronounVerb(item, "'be") + " part of " + w[item.loc].byname({article:DEFINITE}) + ".";
}
function CONTAINER_CLOSED(char, item) {
  return nounVerb(item, "be", true) + " closed.";
}
function INSIDE_CONTAINER(char, item, cont) {
  return pronounVerb(item, "be", true) + " inside " + cont.byname({article:DEFINITE}) + ".";
}
function STOP_POSTURE(char) {
  if (!char.posture) return "";
  // You could split up sitting, standing and lying
  const s = nounVerb(char, "get", true) + " off " + char.postureFurniture.byname({article:DEFINITE}) + ".";
  char.posture = null;
  char.postureFurniture = null;
  return s;
}




//----------------------------------------------------------------------------------------------
// NPC messages

function NPC_NOTHING_TO_SAY_ABOUT(char) {
  return nounVerb(char, "have", true) + " nothing to say on the subject.";
}
function NPC_NO_INTEREST_IN(char) {
  return nounVerb(char, "have", true) + " no interest in that subject.";
}



// If the player does SPEAK TO MARY and Mary has some topics, this will be the menu title.
function SPEAK_TO_MENU_TITLE(char) {
  return "Talk to " + char.byname({article:DEFINITE}) + " about:";
}
// If the player does TELL MARY ABOUT HOUSE this will appear before the response.
function TELL_ABOUT_INTRO(char, text) {
  return "You tell " + char.byname({article:DEFINITE}) + " about " + text + ".";
}
// If the player does ASK MARY ABOUT HOUSE this will appear before the response.
function ASK_ABOUT_INTRO(char, text) {
  return "You ask " + char.byname({article:DEFINITE}) + " about " + text + ".";
}



//----------------------------------------------------------------------------------------------
// Door and lock fails

function LOCKED(char, item) {
  return pronounVerb(item, "'be", true) + " locked.";
}
function NO_KEY(char, item) {
  return nounVerb(char, "do", true) + " have the right key.";
}
function LOCKED_EXIT(char, exit) {
  return "That way is locked.";
}
function OPEN_AND_ENTER(char, doorName) {
  return nounVerb(char, "open", true) + " the " + doorName + " and walk through.";
}
function UNLOCK_AND_ENTER(char, doorName) {
  return nounVerb(char, "unlock", true) + " the " + doorName + ", open it and walk through.";
}
function TRY_BUT_LOCKED(char, doorName) {
  return nounVerb(char, "try", true) + " the " + doorName + ", but it is locked.";
}

//----------------------------------------------------------------------------------------------
// Misc

const LIST_AND = " and ";
const LIST_NOTHING = "nothing";
const NEVER_MIND = "Never mind.";
const DEFAULT_DESCRIPTION = "It's just scenery.";







//----------------------------------------------------------------------------------------------
// Save/load messages

const SL_DIR_HEADINGS = "<tr><th>Filename</th><th>Ver</th><th>Timestamp</th><th>Comment</th></tr>";
const SL_DIR_MSG = "Ver is the version of the game that was being played when saved. Loading a save game from a different version may or may not work. You can delete a file with the DEL command.";
const SL_NO_FILENAME = "Trying to save with no filename";



//----------------------------------------------------------------------------------------------


//const IGNORED_WORDS = ["", "the", "a", "an"];
const ARTICLE_FILTER_REGEX = /^(?:the |an |a )?(.+)$/;
const JOINER_REGEX = /\,|\band\b/;
const ALL_REGEX = /^(all|everything)$/;
const ALL_EXCLUDE_REGEX = /^((all|everything) (but|bar|except)\b)/;
const GO_PRE_REGEX = "go to |goto |go |head |";


//----------------------------------------------------------------------------------------------
// Language constructs

const PRONOUNS = {
  thirdperson:{subjective:"it", objective:"it", possessive: "its", poss_adj: "its", reflexive:"itself"},
  massnoun:{subjective:"it", objective:"it", possessive: "its", poss_adj: "its", reflexive:"itself"},
  male:{subjective:"he", objective:"him", possessive: "his", poss_adj: "his", reflexive:"himself"},
  female:{subjective:"she", objective:"her", possessive: "hers", poss_adj: "her", reflexive:"herself"},
  plural:{subjective:"they", objective:"them", possessive: "theirs", poss_adj: "their", reflexive:"themselves"},
  firstperson:{subjective:"I", objective:"me", possessive: "mine", poss_adj: "my", reflexive:"myself"},
  secondperson:{subjective:"you", objective:"you", possessive: "yours", poss_adj: "your", reflexive:"yourself"},
};


const VERBS = {
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
  talkto:"Talk to",
};


// Change the abbrev values to suit your game (or language)
// You may want to do that in settings, which is loaded first
// One time we need var rather than const/let!
if (EXITS === undefined) {
  EXITS = [
    {name:'northwest', abbrev:'NW', niceDir:"the northwest"}, 
    {name:'north', abbrev:'N', niceDir:"the north"}, 
    {name:'northeast', abbrev:'NE', niceDir:"the northeast"}, 
    {name:'in', abbrev:'In', alt:'enter|i', niceDir:"inside"}, 
    {name:'up', abbrev:'U', niceDir:"above"},
    
    {name:'west', abbrev:'W', niceDir:"the west"}, 
    {name:'Look', abbrev:'Lk', nocmd:true}, 
    {name:'east', abbrev:'E', niceDir:"the east"}, 
    {name:'out', abbrev:'Out', alt:'exit|o', niceDir:"outside"}, 
    {name:'down', abbrev:'Dn', alt:'d', niceDir:"below"}, 

    {name:'southwest', abbrev:'SW', niceDir:"the southwest"}, 
    {name:'south', abbrev:'S', niceDir:"the south"}, 
    {name:'southeast', abbrev:'SE', niceDir:"the southeast"}, 
    {name:'Wait', abbrev:'Z', nocmd:true}, 
    {name:'Help', abbrev:'?', nocmd:true}, 
  ];
}






function addDefiniteArticle(item) {
  if (item.defArticle) {
    return item.defArticle + " ";
  }
  return item.properName ? "" : "the ";
}

function addIndefiniteArticle(item) {
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

const ordinalReplacements = [
  {regex:/one$/, replace:"first"},
  {regex:/two$/, replace:"second"},
  {regex:/three$/, replace:"third"},
  {regex:/five$/, replace:"fifth"},
  {regex:/eight$/, replace:"eighth"},
  {regex:/nine$/, replace:"ninth"},
  {regex:/twelve$/, replace:"twelfth"},
  {regex:/y$/, replace:"ieth"},
]

function toWords(number) {
  if (typeof number !== "number") {
    errormsg ("toWords can only handle numbers");
    return number;
  }
  
  let s = "";
  if (number < 0) {
    s = "minus ";
    number = -number;
  }
  if (number < 2000) {
    let hundreds = Math.floor(number / 100);
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
      let units = number % 10;
      let tens = Math.floor(number / 10) % 10;
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

function toOrdinal(number) {
  if (typeof number !== "number") {
    errormsg ("toWords can only handle numbers");
    return number;
  }
  
  let s = toWords(number);
  for (let i = 0; i < ordinalReplacements.length; i++) {
    if (ordinalReplacements[i].regex.test(s)) {
      return s.replace(ordinalReplacements[i].regex, ordinalReplacements[i].replace);
    }
  }
  return (s + "th");
}




function contentsForSurface(contents) {
  return "with " + formatList(contents, {article:INDEFINITE, lastJoiner:LIST_AND, modified:true, nothing:LIST_NOTHING, loc:this.name}) + " on it";
}

function contentsForContainer(contents) {
  return "containing " + formatList(contents, {article:INDEFINITE, lastJoiner:LIST_AND, modified:true, nothing:LIST_NOTHING, loc:this.name});
}



// Use when the NPC leaves a room; will give a message if the player can observe it
function npcLeavingMsg(npc, dest) {
  let s = "";
  let flag = false;
  if (w[game.player.loc].canViewLocs && w[game.player.loc].canViewLocs.includes(npc.loc)) {
    s = w[game.player.loc].canViewPrefix;
    flag = true;
  }
  if (flag || npc.here()) {
    s += nounVerb(npc, "leave", !flag) + " " + w[npc.loc].byname({article:DEFINITE});
    const exit = w[npc.loc].findExit(dest);
    if (exit) s += ", heading " + exit.dir;
    s += ".";
    msg(s);
  }
};


function niceDirections (dir) {
  const dirObj = EXITS.find(function(el) { return el.name === dir; });
  return dirObj.niceDir;
}
  


function npcEnteringMsg(npc, origin) {
  let s = "";
  let flag = false;
  if (w[game.player.loc].canViewLocs && w[game.player.loc].canViewLocs.includes(npc.loc)) {
    s = w[game.player.loc].canViewPrefix;
    flag = true;
  }
  if (flag || npc.here()) {
    s += nounVerb(npc, "enter", !flag) + " " + w[npc.loc].byname({article:DEFINITE});
    const exit = w[origin].findExit(npc.loc);
    if (exit) s += " from " + niceDirections(exit.dir);
    s += ".";
    msg(s);
  }
}





tp.text_processors.objects =function(arr, params) {
  const listOfOjects = scope(isHereListed);
  return formatList(listOfOjects, {article:INDEFINITE, lastJoiner:LIST_AND, modified:true, nothing:LIST_NOTHING, loc:game.player.loc});
};

  
tp.text_processors.exits = function(arr, params) {
  const list = [];
  for (let i = 0; i < EXITS.length; i++) {
    if (game.room.hasExit(EXITS[i].name)) {
      list.push(EXITS[i].name);
    }
  }
  return formatList(list, {lastJoiner:" or ", nothing:"nowhere"});
};












//----------------------------------------------------------------------------------------------
// Conjugating



const CONJUGATIONS = {
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
  let gender = item.pronouns.subjective;
  if (gender === "he" || gender === "she") { gender = "it"; }
  const arr = CONJUGATIONS[gender.toLowerCase()];

  if (!arr) {
    errormsg("No conjugations found: CONJUGATIONS_" + gender.toLowerCase());
    return verb;
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === verb) {
      return arr[i].value;
    }
  }
  
  for (let i = 0; i < arr.length; i++) {
    const name = arr[i].name;
    const value = arr[i].value;
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
  let s = item.pronouns.subjective + " " + conjugate(item, verb);
  s = s.replace(/ +\'/, "'");  // yes this is a hack!
  return capitalise ? sentenceCase(s) : s;
}

function pronounVerbForGroup(item, verb, capitalise) {
  let s = item.groupPronouns().subjective + " " + conjugate(item.group(), verb);
  s = s.replace(/ +\'/, "'");  // yes this is a hack!
  return capitalise ? sentenceCase(s) : s;
}

function nounVerb(item, verb, capitalise) {
  if (item === game.player) {
    return pronounVerb(item, verb, capitalise);
  }
  let s = item.byname({article:DEFINITE}) + " " + conjugate(item, verb);
  s = s.replace(/ +\'/, "'");  // yes this is a hack!
  return capitalise ? sentenceCase(s) : s;
}






//----------------------------------------------------------------------------------------------
// Meta-messages

let helpScript = function() {
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
};


let aboutScript = function() {
  metamsg("{i:" + TITLE + " version " + VERSION + "} was written by " + AUTHOR + " using Quest 6.");
  if (THANKS.length > 0) {
    metamsg("Thanks to " + formatList(THANKS, {lastJoiner:LIST_AND}) + ".");
  }
  return SUCCESS_NO_TURNSCRIPTS;
};



function saveLoadScript() {
  metamsg("To save your progress, type SAVE followed by the name to save with.");
  metamsg("To load your game, refresh/reload this page in your browser, then type LOAD followed by the name you saved with.");
  metamsg("To see a list of save games, type DIR.");
  return SUCCESS_NO_TURNSCRIPTS;
}

