// Language support

// I originally thought to make these constants, but really there is no particular reason they should be
// and making them variables does allow authors to change them more easily.
// However, I have left them in uppercase, so they re kind of constant-like.

"use strict";

const tp = {
  text_processors:{},
};


//----------------------------------------------------------------------------------------------
// SUCCESSFUL Messages

function take_successful(char, item, count) {
  return nounVerb(char, "take", true) + " " + item.byname({article:DEFINITE, count:count}) + ".";
}
function drop_successful(char, item, count) {
  return nounVerb(char, "drop", true) + " " + item.byname({article:DEFINITE, count:count}) + ".";
}
function wear_successful(char, item) {
  return nounVerb(char, "put", true) + " on " + item.byname({article:DEFINITE}) + ".";
}
function remove_successful(char, item) {
  return nounVerb(char, "take", true) + " " + item.byname({article:DEFINITE}) + " off.";
}
function open_successful(char, item) {
  return nounVerb(char, "open", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function close_successful(char, item) {
  return nounVerb(char, "close", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function lock_successful(char, item) {
  return nounVerb(char, "lock", true) + "k " + item.byname({article:DEFINITE}) + ".";
}
function unlock_successful(char, item) {
  return nounVerb(char, "unlock", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function fill_successful(char, item) {
  return nounVerb(char, "fill", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function empty_successful(char, item) {
  return nounVerb(char, "empty", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function turn_on_successful(char, item) {
  return nounVerb(char, "switch", true) + " " + item.byname({article:DEFINITE}) + " on.";
}
function turn_off_successful(char, item) {
  return nounVerb(char, "switch", true) + " " + item.byname({article:DEFINITE}) + " off.";
}
function sit_on_successful(char, item) {
  return nounVerb(char, "sit", true) + " on " + item.byname({article:DEFINITE}) + ".";
}
function stand_on_successful(char, item) {
  return nounVerb(char, "stand", true) + " on " + item.byname({article:DEFINITE}) + ".";
}
function recline_on_successful(char, item) {
  return nounVerb(char, "lie", true) + " down on " + item.byname({article:DEFINITE}) + ".";
}
function eat_successful(char, item) {
  return nounVerb(char, "eat", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function drink_successful(char, item) {
  return nounVerb(char, "drink", true) + " " + item.byname({article:DEFINITE}) + ".";
}
function purchase_successful(char, item, amt) {
  return nounVerb(char, "buy", true) + " " + item.byname({article:DEFINITE}) + " for " + displayMoney(amt) + ".";
}
function sell_successful(char, item, amt) {
  return nounVerb(char, "sell", true) + " " + item.byname({article:DEFINITE}) + " for " + displayMoney(amt) + ".";
}
function push_exit_successful(char, item, dir, destRoom) {
  return nounVerb(char, "push", true) + " " + item.byname({article:DEFINITE}) + " " + dir + ".";
}

function NPC_HEADING(char, dir) {
  return nounVerb(char, "head", true) + " " + dir + ".";
}





//----------------------------------------------------------------------------------------------
// CANnot Messages

function cannot_take(char, item) {
  return nounVerb(char, "can't", true) + " take " + item.pronouns.objective + ".";
}
function cannot_wear(char, item) {
  return nounVerb(char, "can't", true) + " wear " + item.pronouns.objective + ".";
}
function cannot_wear_ensemble(char, item) {
  return "Individual parts of an ensemble must be worn and removed separately.";
}
function cannot_switch_on(char, item) {
  return nounVerb(char, "can't", true) + " turn " + item.pronouns.objective + " on.";
}
function cannot_switch_off(char, item) {
  return nounVerb(char, "can't", true) + " turn " + item.pronouns.objective + " off.";
}
function cannot_open(char, item) {
  return nounVerb(item, "can't", true) + " be opened.";
}
function cannot_close(char, item) {
  return nounVerb(item, "can't", true) + " be closed.";
}
function cannot_lock(char, item) {
  return nounVerb(char, "can't", true) + "t lock " + item.pronouns.objective + ".";
}
function cannot_unlock(char, item) {
  return nounVerb(char, "can't", true) + " unlock " + item.pronouns.objective + ".";
}
function cannot_read(char, item) {
  return "Nothing worth reading there.";
}

function cannot_purchase(char, item) {
  return nounVerb(char, "can't", true) + " buy " + item.pronouns.objective + ".";
}
function cannot_purchase_here(char, item) {
  if (item.doNotClone && item.isAtLoc(char.name)) {
    return nounVerb(char, "can't", true) + " buy " + item.byname({article:DEFINITE}) + " here - probably because " + nounVerb(char, "be") + " already holding " + item.pronouns.objective + ".";
  }
  else {
    return nounVerb(char, "can't", true) + " buy " + item.byname({article:DEFINITE}) + " here.";
  }
}
function cannot_afford(char, item, amt) {
  return nounVerb(char, "can't", true) + " afford " + item.byname({article:DEFINITE}) + " (need " + displayMoney(amt) + ").";
}
function cannot_sell(char, item, amt) {
  return nounVerb(char, "can't", true) + " sell " + item.pronouns.objective + ".";
}
function cannot_sell_here(char, item, amt) {
  return nounVerb(char, "can't", true) + " sell " + item.byname({article:DEFINITE}) + " here.";
}

function cannot_use(char, item) {
  return "No obvious way to use " + item.pronouns.objective + ".";
}
function cannot_smash(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can break.";
}
function cannot_fill(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can fill.";
}
function cannot_mix(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can mix liquids in.";
}
function cannot_empty(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can empty.";
}
function cannot_look_out(char, item) {
  pronounVerb(char, "can't", true) + " look out of " + item.pronouns.objective + ".";
}
function cannot_stand_on(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can stand on.";
}
function cannot_sit_on(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can sit on.";
}
function cannot_recline_on(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can lie on.";
}

function cannot_eat(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can eat.";
}
function cannot_drink(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can drink.";
}
function cannot_ingest(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can ingest.";
}
function cannot_push(char, item) {
  return pronounVerb(item, "'be", true) + " not something you can move around like that.";
}
function cannot_push_up(char, item) {
  return pronounVerb(char, "'be", true) + " not getting " + item.byname({article:DEFINITE}) + " up there!";
}



//----------------------------------------------------------------------------------------------
// General command messages

const not_known_msg = "I don't even know where to begin with that.";
const disambig_msg = "Which do you mean?";
const no_multiples_msg = "You cannot use multiple objects with that command.";
const nothing_msg = "Nothing there to do that with.";
const general_obj_error = "So I kind of get what you want to do, but not what you want to do it with.";
const done_msg = "Done.";




function no_smell(char) {
  return nounVerb(char, "can't", true) + " smell anything here.";
}
function no_listen(char) {
  return nounVerb(char, "can't", true) + " hear anything of note here.";
}
function nothing_there(char) {
  return nounVerb(char, "be", true) + " sure there's nothing there.";
}
function nothing_inside(char) {
  return "There's nothing to see inside.";
}
function not_that_way(char, dir) {
  return nounVerb(char, "can't", true) + " go " + dir + ".";
}
function object_unknown_msg(name) {
  return nounVerb(game.player, "can't", true) + " see anything you might call '" + name + "' here.";
}

function not_here(char, item) {
  return pronounVerb(item, "'be", true) + " not here.";
}
function char_has_it(char, item) {
  return nounVerb(char, "have", true) + " " + item.pronouns.objective + ".";
}
function none_here(char, item) {
  return "There's no " + item.pluralAlias + " here.";
}
function none_held(char, item) {
  return pronoun(char, "have", true) + " no " + item.pluralAlias + ".";
}
function TAKE_not_push(char, item) {
  return "Just pick the thing up already!";
}

function nothing_useful(char, item) {
  return "That's not going to do anything useful.";
}
function already(item) {
  return sentenceCase(item.pronouns.subjective) + " already " + conjugate(item, "be") + ".";
}
function default_examine(char, item) {
  return pronounVerb(item, "be", true) + " just your typical, every day " + item.byname() + ".";
}
function no_topics(char, target) {
  return nounVerb(char, "have", true) + " nothing to talk to " + target.byname({article:DEFINITE}) + " about.";
}
function container_recursion(char, container, item) {
  return "What? You want to put " + item.byname({article:DEFINITE}) + " in " + container.byname({article:DEFINITE}) + " when " + container.byname({article:DEFINITE}) + " is already in " + item.byname({article:DEFINITE}) + "? That's just too freaky for me.";
}


//----------------------------------------------------------------------------------------------
// Specific command messages

function not_npc(item) {
  return nounVerb(game.player, "can", true) + " tell " + item.byname({article:DEFINITE}) + " to do what you like, but there is no way " + pronounVerb(item, "'ll") + " do it.";
}
function not_npc_for_give(char, item) {
  return "Realistically, " + nounVerb(item, "be") + " not interested in anything " + char.pronouns.subjective + " might give " + item.pronouns.objective + ".";
}
function not_able_to_hear(char, item) {
  return "Doubtful " + nounVerb(item, "will") + " be interested in anything " + char.pronouns.subjective + " has to say.";
}
function not_container(char, item) {
  return sentenceCase(item.byname({article:DEFINITE})) + " is not a container.";
}
function not_vessel(char, item) {
  return sentenceCase(item.byname({article:DEFINITE})) + " is not a vessel.";
}

function not_carrying(char, item) {
  return pronounVerb(char, "don't", true) + " have " + item.pronouns.objective + ".";
}
function not_inside(char, item) {
  return pronounVerb(item, "'be", true) + " not inside that.";
}
function wearing(char, item) {
  return pronounVerb(char, "'be", true) + " wearing " + item.pronouns.objective + ".";
}
function not_wearing(char, item) {
  return pronounVerb(char, "'be", true) + " not wearing " + item.pronouns.objective + ".";
}
function cannot_wear_over(char, item, outer) {
  return pronounVerb(char, "can't", true) + " put " + item.byname({article:INDEFINITE}) + " on over " + char.pronouns.poss_adj + " " + outer.byname() + ".";
}
function cannot_remove_under(char, item, outer) {
  return pronounVerb(char, "can't", true) + " take off " + char.pronouns.poss_adj + " " + item.byname() + " whilst wearing " + char.pronouns.poss_adj + " " + outer.byname() + ".";
}
function already_have(char, item) {
  return pronounVerb(char, "'ve", true) + " got " + item.pronouns.objective + " already.";
}
function already_wearing(char, item) {
  return pronounVerb(char, "'ve", true) + " already wearing " + item.pronouns.objective + ".";
}
function cannot_take_component(char, item) {
  return nounVerb(char, "can't", true) + " take " + item.pronouns.objective + "; " + pronounVerb(item, "'be") + " part of " + w[item.loc].byname({article:DEFINITE}) + ".";
}
function container_closed(char, item) {
  return nounVerb(item, "be", true) + " closed.";
}
function inside_container(char, item, cont) {
  return pronounVerb(item, "be", true) + " inside " + cont.byname({article:DEFINITE}) + ".";
}
function look_inside(char, item) {
  const l = formatList(item.getContents(display.LOOK), {article:INDEFINITE, lastJoiner:" and ", nothing:"nothing"});
  return "Inside " + item.byname({article:DEFINITE}) + " " + pronounVerb(char, "can") + " see " + l + ".";
}
function stop_posture(char) {
  if (!char.posture || char.posture === "standing") return "";
  let s;
  // You could split up sitting, standing and lying
  if (char.postureFurniture) {
    s = nounVerb(char, "get", true) + " off " + w[char.postureFurniture].byname({article:DEFINITE}) + ".";
  }
  else {
    s = nounVerb(char, "stand", true) + " up.";
  }
  char.posture = undefined;
  char.postureFurniture = undefined;
  return s;
}




//----------------------------------------------------------------------------------------------
// NPC messages

function npc_nothing_to_say_about(char) {
  return nounVerb(char, "have", true) + " nothing to say on the subject.";
}
function npc_no_interest_in(char) {
  return nounVerb(char, "have", true) + " no interest in that subject.";
}



// If the player does SPEAK TO MARY and Mary has some topics, this will be the menu title.
function speak_to_menu_title(char) {
  return "Talk to " + char.byname({article:DEFINITE}) + " about:";
}
// If the player does TELL MARY ABOUT HOUSE this will appear before the response.
function tell_about_intro(char, text) {
  return "You tell " + char.byname({article:DEFINITE}) + " about " + text + ".";
}
// If the player does ASK MARY ABOUT HOUSE this will appear before the response.
function ask_about_intro(char, text) {
  return "You ask " + char.byname({article:DEFINITE}) + " about " + text + ".";
}



//----------------------------------------------------------------------------------------------
// Door and lock fails

function locked(char, item) {
  return pronounVerb(item, "'be", true) + " locked.";
}
function no_key(char, item) {
  return nounVerb(char, "do", true) + " have the right key.";
}
function locked_exit(char, exit) {
  return "That way is locked.";
}
function open_and_enter(char, doorName) {
  return nounVerb(char, "open", true) + " the " + doorName + " and walk through.";
}
function unlock_and_enter(char, doorName) {
  return nounVerb(char, "unlock", true) + " the " + doorName + ", open it and walk through.";
}
function try_but_locked(char, doorName) {
  return nounVerb(char, "try", true) + " the " + doorName + ", but it is locked.";
}

//----------------------------------------------------------------------------------------------
// Misc

const list_and = " and ";
const list_nothing = "nothing";
const never_mind = "Never mind.";
const default_description = "It's just scenery.";
const click_to_continue = "Click to continue...";
const buy = "Buy"; // used in the command link in the purchase table
const buy_headings = ["Item", "Cost", ""];
const current_money = "Current money";
const nothing_for_sale = "Nothing for sale here."






//----------------------------------------------------------------------------------------------
// Save/load messages

const sl_dir_headings = "<tr><th>Filename</th><th>Ver</th><th>Timestamp</th><th>Comment</th></tr>";
const sl_dir_msg = "Ver is the version of the game that was being played when saved. Loading a save game from a different version may or may not work. You can delete a file with the DEL command.";
const sl_no_filename = "Trying to save with no filename";



//----------------------------------------------------------------------------------------------


//const IGnored_words = ["", "the", "a", "an"];
const article_filter_regex = /^(?:the |an |a )?(.+)$/;
const joiner_regex = /\,|\band\b/;
const all_regex = /^(all|everything)$/;
const all_exclude_regex = /^((all|everything) (but|bar|except)\b)/;
const go_pre_regex = "go to |goto |go |head |";


//----------------------------------------------------------------------------------------------
// Language constructs

const pronouns = {
  thirdperson:{subjective:"it", objective:"it", possessive: "its", poss_adj: "its", reflexive:"itself"},
  massnoun:{subjective:"it", objective:"it", possessive: "its", poss_adj: "its", reflexive:"itself"},
  male:{subjective:"he", objective:"him", possessive: "his", poss_adj: "his", reflexive:"himself"},
  female:{subjective:"she", objective:"her", possessive: "hers", poss_adj: "her", reflexive:"herself"},
  plural:{subjective:"they", objective:"them", possessive: "theirs", poss_adj: "their", reflexive:"themselves"},
  firstperson:{subjective:"I", objective:"me", possessive: "mine", poss_adj: "my", reflexive:"myself", possessive_name:'my'},
  secondperson:{subjective:"you", objective:"you", possessive: "yours", poss_adj: "your", reflexive:"yourself", possessive_name:'your'},
};


const verbs = {
  examine:"Examine",
  use:"use",
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
  eat:"Eat",
  drink:"Drink",
  read:"read",
};


// Change the abbrev values to suit your game (or language)
// You may want to do that in settings, which is loaded first
// One time we need var rather than const/let!
let exit_list = [
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
  if (item.pronouns === pronouns.plural) {
    return "some ";
  }
  if (item.pronouns === pronouns.massnoun) {
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
  for (let or of ordinalReplacements) {
    if (or.regex.test(s)) {
      return s.replace(or.regex, or.replace);
    }
  }
  return (s + "th");
}



function convertNumbers(s) {
  for (let i = 0; i < numberUnits.length; i++) {
    let regex = new RegExp("\\b" + numberUnits[i] + "\\b");
    if (regex.test(s)) s = s.replace(regex, "" + i);
  }
  return s;
}



function contentsForSurface(contents) {
  return "with " + formatList(contents, {article:INDEFINITE, lastJoiner:list_and, modified:true, nothing:list_nothing, loc:this.name}) + " on it";
}

function contentsForContainer(contents) {
  return "containing " + formatList(contents, {article:INDEFINITE, lastJoiner:list_and, modified:true, nothing:list_nothing, loc:this.name});
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
  const dirObj = exit_list.find(function(el) { return el.name === dir; });
  return dirObj.niceDir ? dirObj.niceDir : dirObj.name;
}
  

// the NPC has already been moved, so npc.loc is the destination
function npcEnteringMsg(npc, origin) {
  let s = "";
  let flag = false;
  if (w[game.player.loc].canViewLocs && w[game.player.loc].canViewLocs.includes(npc.loc)) {
    // Can the player see the location the NPC enters, from another location?
    s = w[game.player.loc].canViewPrefix;
    flag = true;
  }
  if (flag || npc.here()) {
    s += nounVerb(npc, "enter", !flag) + " " + w[npc.loc].byname({article:DEFINITE});
    const exit = w[npc.loc].findExit(origin);
    if (exit) s += " from " + niceDirections(exit.dir);
    s += ".";
    msg(s);
  }
}


function exitList() {
  const list = [];
  for (let exit of exit_list) {
    if (game.room.hasExit(exit.name)) {
      list.push(exit.name);
    }
  }
  return list;
}

tp.text_processors.objects = function(arr, params) {
  const listOfOjects = scopeHereListed();
  return formatList(listOfOjects, {article:INDEFINITE, lastJoiner:list_and, modified:true, nothing:list_nothing, loc:game.player.loc});
};
  
tp.text_processors.exits = function(arr, params) {
  const list = exitList();
  return formatList(list, {lastJoiner:" or ", nothing:"nowhere"});
};

tp.text_processors.exitsHere = function(arr, params) {
  const list = exitList();
  return list.length === 0 ? "" : arr.join(":");
};











//----------------------------------------------------------------------------------------------
// Conjugating



const conjugations = {
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
    { name:"*uy", value:"uys"},
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
  const arr = conjugations[gender.toLowerCase()];

  if (!arr) {
    errormsg("No conjugations found: conjugations_" + gender.toLowerCase());
    return verb;
  }
  for (let conj of arr) {
    if (conj.name === verb) {
      return conj.value;
    }
  }
  
  for (let conj of arr) {
    const name = conj.name;
    const value = conj.value;
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

function verbPronoun(item, verb, capitalise) {
  let s = conjugate(item, verb) + " " + item.pronouns.subjective;
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

function verbNoun(item, verb, capitalise) {
  if (item === game.player) {
    return pronounVerb(item, verb, capitalise);
  }
  let s = conjugate(item, verb) + " " + item.byname({article:DEFINITE});
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
  return SUCCESS_no_turnscripts;
};


let aboutScript = function() {
  metamsg("{i:" + TITLE + " version " + VERSION + "} was written by " + AUTHOR + " using Quest 6.");
  if (THANKS.length > 0) {
    metamsg("Thanks to " + formatList(THANKS, {lastJoiner:list_and}) + ".");
  }
  return SUCCESS_no_turnscripts;
};



function saveLoadScript() {
  metamsg("To save your progress, type SAVE followed by the name to save with.");
  metamsg("To load your game, refresh/reload this page in your browser, then type LOAD followed by the name you saved with.");
  metamsg("To see a list of save games, type DIR.");
  return SUCCESS_no_turnscripts;
}








try { SUCCESS; }
catch (e) {
  module.exports = { exit_list: exit_list, pronouns: pronouns }
}