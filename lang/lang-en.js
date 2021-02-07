"use strict";

// Language support




const lang = {

    regex:{
    //----------------------------------------------------------------------------------------------
    // Regular Expressions for Commands
    
    // Meta commands
    MetaHelp:/^help$|^\?$/,
    MetaHint:/^(?:hint|clue)s?$/,
    MetaCredits:/^(?:about|credits|version|info)$/,
    MetaDarkMode:/^(?:dark|dark mode|toggle dark|toggle dark mode)$/,
    MetaWarnings:/^warn(?:ing|ings|)$/,
    MetaImages:/^images$/,
    MetaSilent:/^(?:sh|silent)$/,
    MetaSpoken:/^spoken$/,
    MetaIntro:/^intro$/,
    MetaBrief:/^brief$/,
    MetaTerse:/^terse$/,
    MetaVerbose:/^verbose$/,
    MetaTranscript:/^transcript$|^script$/,
    MetaTranscriptOn:/^transcript on$|^script on$/,
    MetaTranscriptOff:/^transcript off$|^script off$/,
    MetaTranscriptClear:/^transcript clear$|^script clear$|^transcript delete$|^script delete$/,
    MetaTranscriptShow:/^transcript show$|^script show$/,
    MetaTranscriptShowWithOptions:/^(?:transcript|script) show (\w+)$/,
    MetaTranscriptToWalkthrough:/^(?:transcript|script) (?:w|wt|walk|walkthrough)$/,
    MetaPlayerComment:/^\*(.+)$/,
    MetaSave:/^save$/,
    MetaSaveGame:/^(?:save) (.+)$/,
    MetaSaveOverwriteGame:/^(?:save) (.+) (?:overwrite|ow)$/,
    MetaLoad:/^(?:reload|load|restore)$/,
    MetaLoadGame:/^(?:load|reload|restore) (.+)$/,
    MetaDir:/^dir$|^directory$|^ls$|^save ls$|^save dir$/,
    MetaDeleteGame:/^(?:delete|del) (.+)$/,
    MetaUndo:/^undo$/,
    MetaAgain:/^(?:again|g)$/,
    MetaOops:/^(?:oops)$/,
    MetaRestart:/^restart$/,
    MetaScore:/^score$/,
    MetaPronouns:/^pronouns$/,
    
    // Misc
    Look:/^l$|^look$/,
    Exits:/^exits$/,
    Wait:/^wait$|^z$/,
    TopicsNote:/^topics?$/,
    Inv:/^inventory$|^inv$|^i$/,
    Map:/^map$/,
    Smell:/^smell$|^sniff$/,
    Listen:/^listen$/,
    PurchaseFromList:/^buy$|^purchase$/,
    
    // Use item
    Examine:/^(?:examine|exam|ex|x) (.+)$/,
    LookAt:/^(?:look at|look|l) (.+)$/,
    LookOut:/^(?:look out of|look out) (.+)$/,
    LookBehind:/^(?:look behind|check behind) (.+)$/,
    LookUnder:/^(?:look under|check under) (.+)$/,
    LookInside:/^(?:look inside) (.+)$/,
    Search:/^(?:search) (.+)$/,
    Take:/^(?:take|get|pick up|t) (.+)$/,
    Drop:/^(?:drop|d) (.+)$/,
    Wear2:/^put (?:my |your |his |her |)(.+) on$/,
    Wear:/^(?:wear|don|put on) (?:my |your |his |her |)(.+)$/,
    Remove:/^(?:remove|doff|take off) (?:my |your |his |her |)(.+)$/,
    Remove2:/^take (?:my |your |his |her |)(.+) off$/,
    Read:/^(?:read|r) (.+)$/,
    SmellItem:/^(?:smell|sniff) (.+)$/,
    ListenToItem:/^(?:listen to|listen) (.+)$/,
    Purchase:/^(?:purchase|buy) (.+)$/,
    Sell:/^(?:sell) (.+)$/,
    Smash:/^(?:smash|break|destroy) (.+)$/,
    SwitchOn:/^(?:turn on|switch on) (.+)$/,
    SwitchOn2:/^(?:turn|switch) (.+) on$/,
    SwitchOff2:/^(?:turn|switch) (.+) off$/,
    SwitchOff:/^(?:turn off|switch off) (.+)$/,
    Open:/^(?:open) (.+)$/,
    Close:/^(?:close) (.+)$/,
    Lock:/^(?:lock) (.+)$/,
    Unlock:/^(?:unlock) (.+)$/,
    Push:/^(?:push|press) (.+)$/,
    Pull:/^(?:pull) (.+)$/,
    Fill:/^(?:fill) (.+)$/,
    Empty:/^(?:empty) (.+)$/,
    Eat:/^(eat|feed on|feed|partake of|partake|dine on|dine) (.+)$/,
    Drink:/^(drink|imbibe|quaff|guzzle|knock back|swig|swill|sip|down|chug) (.+)$/,
    Ingest:/^(consume|swallow|ingest) (.+)$/,
    SitOn:/^(?:sit on|sit upon|sit) (.+)$/,
    StandOn:/^(?:stand on|stand upon|stand) (.+)$/,
    ReclineOn:/^(?:recline on|recline upon|recline|lie on|lie upon|lie) (.+)$/,
    GetOff:/^(?:get off|off) (.+)$/,
    Use:/^(?:use) (.+)$/,
    TalkTo:/^(?:talk to|talk|speak to|speak|converse with|converse) (.+)$/,
    Topics:/^topics? (?:for )?(.+)$/,
    
    // Misc again
    Say:/^(say|shout|whisper) (.+)$/,
    Stand:/^stand$|^stand up$|^get up$/,
    NpcStand:[/^(.+), ?(?:stand|stand up|get up)$/, /^tell (.+) to (?:stand|stand up|get up)$/],
    FillWith:/^(?:fill) (.+) (?:with) (.+)$/,
    NpcFillWith:[/^(.+), ?(?:fill) (.+) (?:with) (.+)$/, /^tell (.+) to (?:fill) (.+) (?:with) (.+)$/],
    PutIn:/^(?:put|place|drop) (.+) (?:in to|into|in|on to|onto|on) (.+)$/,
    NpcPutIn:[/^(.+), ?(?:put|place|drop) (.+) (?:in to|into|in|on to|onto|on) (.+)$/, /^tell (.+) to (?:put|place|drop) (.+) (?:in to|into|in|on to|onto|on) (.+)$/],
    TakeOut:/^(?:take|get|remove) (.+) (?:from|out of|out|off of|off) (.+)$/,
    NpcTakeOut:[/^(.+), ?(?:take|get|remove) (.+) (?:from|out of|out|off of|off) (.+)$/, /^tell (.+) to (?:take|get|remove) (.+) (?:from|out of|out|off of|off) (.+)$/],
    GiveTo:/^(?:give) (.+) (?:to) (.+)$/,
    NpcGiveTo:[/^(.+), ?(?:give) (.+) (?:to) (.+)$/, /^tell (.+) to ?(?:give) (.+) (?:to) (.+)$/],

    TieTo:/^(?:tie|fasten|attach) (.+) (?:to) (.+)$/,
    NpcTieTo:[/^(.+), ?(?:tie|fasten|attach) (.+) (?:to) (.+)$/, /^tell (.+) to ?(?:tie|fasten|attach) (.+) (?:to) (.+)$/],
    Untie:/^(?:untie|unfasten|detach) (.+)$/,
    NpcUntie:[/^(.+), ?(?:untie|unfasten|detach) (.+)$/, /^tell (.+) to ?(?:untie|unfasten|detach) (.+)$/],
    UntieFrom:/^(?:untie|unfasten|detach) (.+) (?:from) (.+)$/,
    NpcUntieFrom:[/^(.+), ?(?:untie|unfasten|detach) (.+) (?:frm) (.+)$/, /^tell (.+) to ?(?:untie|unfasten|detach) (.+) (?:from) (.+)$/],
    UseWith:/^(?:use) (.+) (?:with|on) (.+)$/,


    PushExit:/^(push|pull|move|shift) (.+) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/,
    NpcPushExit:[
      /^(.+), ?(push|pull|move|shift) (.+) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/,
      /^tell (.+) to (push|pull|move|shift) (.+) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/,
    ],
    AskAbout:/^(?:ask) (.+) (about|what|who|how|why|where|when) (.+)$/,
    TellAbout:/^(?:tell) (.+) (about|what|who|how|why|where|when) (.+)$/,
    
    //Debug
    DebugWalkThrough:/^wt (.+)$/,
    DebugInspect:/^inspect (.+)$/,
    DebugInspectByName:/^inspect2 (.+)$/,
    DebugTest:/^test$/,
    DebugInspectCommand:/^(?:cmd) (.+)$/,
    DebugListCommands:/^cmds$/,
    DebugListCommands2:/^cmds2$/,
    DebugParserToggle:/^parser$/,
  },

  // This will be added to the start of the regex of a command to make an NPC command
  // The saved capture group is the NPC's name
  tell_to_prefixes:{
    1:'(?:tell|ask) (.+) to ',   // TELL KYLE TO GET SPOON
    2:'(.+), ?',                 // KYLE, GET SPOON
  },



  //----------------------------------------------------------------------------------------------
  // Standard Responses



  // TAKEABLE
  take_successful:"{nv:char:take:true} {nm:item:the}.",
  //take_successful_counted:"{nv:char:take:true} {number:count} {nm:item}.",
  //take_successful_counted_plural:"{nv:char:take:true} {number:count} {nm:item}.",
  drop_successful:"{nv:char:drop:true} {nm:item:the}.",
  //drop_successful_counted:"{nv:char:drop:true} {number:count} {nm:item}.",
  cannot_take:"{pv:char:can't:true} take {ob:item}.",
  cannot_drop:"{pv:char:can't:true} drop {ob:item}.",
  not_carrying:"{pv:char:don't:true} have {ob:item}.",
  already_have:"{pv:char:'ve:true} got {ob:item} already.",
  cannot_take_component:"{pv:char:can't:true} take {ob:item}; {pv:item:'be} part of {nm:whole:the}.",


  // EDIBLE
  eat_successful:"{nv:char:eat:true} {nm:item:the}.",
  drink_successful:"{nv:char:drink:true} {nm:item:the}.",
  cannot_eat:"{nv:item:'be:true} not something you can eat.",
  cannot_drink:"{nv:item:'be:true} not something you can drink.",
  //cannot_ingest:"{nv:item:'be:true} not something you can ingest.",


  // WEARABLE
  wear_successful:"{nv:char:put:true} on {nm:garment:the}.",
  remove_successful:"{nv:char:take:true} {nm:garment:the} off.",
  cannot_wear:"{nv:char:can't:true} wear {ob:item}.",
  cannot_wear_ensemble:"Individual parts of an ensemble must be worn and removed separately.",
  //wearing:"{nv:char:'be:true} wearing {ob:garment}.",  // I do not think this is used at all
  not_wearing:"{nv:char:'be:true} not wearing {ob:item}.",
  cannot_wear_over:"{nv:char:can't:true} put {nm:garment:the} on over {pa:char} {nm:outer}.",
  cannot_remove_under:"{nv:char:can't:true} take off {pa:char} {nm:garment} whilst wearing {pa:char} {nm:outer}.",
  already_wearing:"{nv:char:'be:true} already wearing {ob:garment}.",
  invWearingPrefix:"wearing",
  invHoldingPrefix:"holding",


  // CONTAINER, etc.
  open_successful:"{nv:char:open:true} {nm:container:the}.",
  close_successful:"{nv:char:close:true} {nm:container:the}.",
  lock_successful:"{nv:char:lock:true} {nm:container:the}.",
  unlock_successful:"{nv:char:unlock:true} {nm:container:the}.",
  close_and_lock_successful:"{nv:char:close:true} {nm:container:the} and {cj:char:lock} {sb:container}.",
  cannot_open:"{nv:item:can't:true} be opened.",
  cannot_close:"{nv:item:can't:true} be closed.",
  cannot_lock:"{nv:char:can't:true} lock {ob:item}.",
  cannot_unlock:"{nv:char:can't:true} unlock {ob:item}.",
  not_container:"{nv:container:be:true} not a container.",
  container_recursion:"What? You want to put {nm:item:the} in {nm:container:the} when {nm:container:the} is already in {nm:item:the}? That's just too freaky for me.",
  not_inside:"{nv:item:'be:true} not inside that.",
  locked:"{nv:container:be:true} locked.",
  no_key:"{nv:char:do:true} have the right key.",
  locked_exit:"That way is locked.",
  open_and_enter:"{nv:char:open:true} the {param:doorName} and walk through.",
  unlock_and_enter:"{nv:char:unlock:true} the {param:doorName}, open it and walk through.",
  try_but_locked:"{nv:char:try:true} the {param:doorName}, but it is locked.",
  container_closed:"{nv:container:be:true} closed.",
  inside_container:"{nv:item:be:true} inside {nm:container:the}.",
  look_inside:"Inside {nm:container:the} {nv:char:can} see {param:list}.",
  
  
  // MECHANDISE
  purchase_successful:"{nv:char:buy:true} {nm:item:the} for {money:money}.",
  sell_successful:"{nv:char:sell:true} {nm:item:the} for {money:money}.",
  cannot_purchase_again:"{nv:char:can't:true} buy {nm:item:the} here - probably because {pv:char:be} already holding {ob:item}.",
  cannot_purchase_here:"{nv:char:can't:true} buy {nm:item:the} here.",
  cannot_afford:"{nv:char:can't:true} afford {nm:item:the} (need {money:money}).",
  cannot_sell_here:"{nv:char:can't:true} sell {nm:item:the} here.",


  // FURNITURE
  sit_on_successful:"{nv:char:sit:true} on {nm:item:the}.",
  stand_on_successful:"{nv:char:stand:true} on {nm:item:the}.",
  recline_on_successful:"{nv:char:lie:true} down on {nm:item:the}.",
  cannot_stand_on:"{nv:item:'be:true} not something you can stand on.",
  cannot_sit_on:"{nv:item:'be:true} not something you can sit on.",
  cannot_recline_on:"{nv:item:'be:true} not something you can lie on.",


  // SWITCHABLE
  turn_on_successful:"{nv:char:switch:true} {nm:item:the} on.",
  turn_off_successful:"{nv:char:switch:true} {nm:item:the} off.",
  cannot_switch_on:"{nv:char:can't:true} turn {ob:item} on.",
  cannot_switch_off:"{nv:char:can't:true} turn {ob:item} off.",

/*
  // VESSEL
  fill_successful:"{nv:char:fill:true} {nm:container:the}.",
  empty_successful:"{nv:char:empty:true} {nm:container:the}.",
  cannot_fill:"{nv:container:'be:true} not something you can fill.",
  cannot_mix:"{nv:container:'be:true} not something you can mix liquids in.",
  cannot_empty:"{nv:container:'be:true} not something you can empty.",
  not_vessel:"{pv:container:be:true} is not a vessel.",
*/

  // NPC
  not_npc:"{nv:char:can:true} tell {nm:item:the} to do what you like, but there is no way {pv:item:'ll} do it.",
  not_npc_for_give:"Realistically, {nv:item:be} not interested in anything {sb:char} might give {ob:item}.",

  cannot_ask_about:"You can ask {ob:item} about {param:text} all you like, but {pv:item:'be} not about to reply.",
  cannot_tell_about:"You can tell {ob:item} about {param:text} all you like, but {pv:item:'be} not interested.",
  topics_no_ask_tell:"This character has no ASK/ABOUT or TELL/ABOUT options set up.",
  topics_none_found:"No suggestions for what to ask or tell {nm:item:the} available.",
  topics_ask_list:"Some suggestions for what to ask {nm:item:the} about: {param:list}.",
  topics_tell_list:"Some suggestions for what to tell {nm:item:the} about: {param:list}.",
  cannot_talk_to:"You chat to {nm:item:the} for a few moments, before releasing that {pv:item:'be} not about to reply.",
  no_topics:"{nv:char:have:true} nothing to talk to {nm:item:the} about.",
  not_able_to_hear:"Doubtful {nv:item:will} be interested in anything {sb:char} has to say.",
  npc_no_interest_in:"{nv:actor:have:true} no interest in that subject.",


  // BUTTON
  push_button_successful:"{nv:char:push:true} {nm:item:the}.",

  // SHIFTABLE
  push_exit_successful:"{nv:char:push:true} {nm:item:the} {param:dir}.",
  cannot_push:"{pv:item:'be:true} not something you can move around like that.",
  cannot_push_up:"{pv:char:'be:true} not getting {nm:item:the} up there!",
  take_not_push:"Just pick the thing up already!",


  // ROPE
  rope_examine_attached_both_ends:" It is {rope.attachedVerb} to both {nm:obj1:the} and {nm:obj2:the}.",
  rope_examine_attached_one_end:" It is {rope.attachedVerb} to {nm:obj1:the}.",
  rope_attach_verb:'tie',
  rope_attached_verb:'tied',
  rope_detach_verb:'untie',
  rope_one_end:'One end',
  rope_other_end:'The other end',
  rope_examine_end_attached:'is {rope.attachedVerb} to {nm:obj:the}.',
  rope_examine_end_held:'is held by {nm:holder:the}.',
  rope_examine_end_headed:'heads into {nm:loc:the}.',
    


  // Movement
  go_successful:"{nv:char:head:true} {param:dir}.",
  not_that_way:"{nv:char:can't:true} go {param:dir}.",
  can_go:"You think you can go {exits}.",


  // General cannot Messages
  cannot_read:"Nothing worth reading there.",
  cannot_use:"No obvious way to use {ob:item}.",
  cannot_smash:"{nv:item:'be:true} not something you can break.",
  cannot_look_out:"Not something you can look out of.",
  cannot_smell:"{nv:item:have:true} no smell.",
  cannot_listen:"{nv:item:be:true} not making any noise.",


  // General command messages
  not_known_msg:"I don't even know where to begin with that.",
  disambig_msg:"Which do you mean?",
  no_multiples_msg:"You cannot use multiple objects with that command.",
  nothing_msg:"Nothing there to do that with.",
  general_obj_error:"So I kind of get what you want to do, but not what you want to do it with.",
  done_msg:"Done.",
  nothing_for_sale:"Nothing for sale here.",
  wait_msg:"Time passes...",
  no_map:"Sorry, no map available.",
  inventory_prefix:"{nv:char:be:true} carrying",


  // General command fails
  no_smell:"{pv:char:can't:true} smell anything here.",
  no_listen:"{pv:char:can't:true} hear anything of note here.",
  nothing_there:"{nv:char:be:true} sure there's nothing there.",
  nothing_inside:"There's nothing to see inside.",
  it_is_empty:"{pv:container:be:true} empty.",
  not_here:"{pv:item:'be:true} not here.",
  char_has_it:"{nv:holder:have:true} {ob:item}.",
  none_here:"There's no {nm:item} here.",
  none_held:"{nv:char:have:true} no {nm:item}.",
  nothing_useful:"That's not going to do anything useful.",
  already:"{sb:item:true} already {cj:item:be}.",
  default_examine:"{pv:item:'be:true} just your typical, every day {nm:item}.",
  
  error:"Oh dear, I seem to have hit an error trying to handle that (F12 for more details).",

  //----------------------------------------------------------------------------------------------
  // Complex responses (requiring functions)

  // Used deep in the parser, so prefer to use function, rather than string
  object_unknown_msg:function(name) {
    return lang.nounVerb(game.player, "can't", true) + " see anything you might call '" + name + "' here.";
  },


  // For furniture
  stop_posture:function(char) {
    if (!char.posture) return ""
    if (!char.postureFurniture && char.posture === "standing") return ""
    let s
    // You could split up sitting, standing and lying
    if (char.postureFurniture) {
      s = lang.nounVerb(char, "get", true) + " off " + lang.getName(w[char.postureFurniture], {article:DEFINITE}) + "."
    }
    else {
      s = lang.nounVerb(char, "stand", true) + " up."
    }
    char.posture = false
    char.postureFurniture = false
    return s
  },



  // use (or potentially use) different verbs in the responses, so not simple strings
  say_no_one_here:function(char, verb, text) {
    return lang.nounVerb(char, verb, true) + ", '" + sentenceCase(text) + ",' but no one notices.";
  },
  say_no_response:function(char, verb, text) {
    return "No one seemed interested in what you say.";
  },
  say_no_response_full:function(char, verb, text) {
    return lang.nounVerb(char, verb, true) + ", '" + sentenceCase(text) + ",' but no one seemed interested in what you say.";
  },

  // If the player does SPEAK TO MARY and Mary has some topics, this will be the menu title.
  speak_to_menu_title:function(char) {
    return "Talk to " + lang.getName(char, {article:DEFINITE}) + " about:";
  },
  // If the player does TELL MARY ABOUT HOUSE this will appear before the response.
  tell_about_intro:function(char, text1, text2) {
    return "You tell " + lang.getName(char, {article:DEFINITE}) + " " + text2 + " " + text1 + ".";
  },
  // If the player does ASK MARY ABOUT HOUSE this will appear before the response.
  ask_about_intro:function(char, text1, text2) {
    return "You ask " + lang.getName(char, {article:DEFINITE}) + " " + text2 + " " + text1 + ".";
  },
  
  // Use when the NPC leaves a room; will give a message if the player can observe it
  npc_leaving_msg:function(npc, dest) {
    let s = "";
    let flag = false;
    if (w[game.player.loc].canViewLocs && w[game.player.loc].canViewLocs.includes(npc.loc)) {
      s = w[game.player.loc].canViewPrefix;
      flag = true;
    }
    if (flag || npc.inSight()) {
      s += lang.nounVerb(npc, "leave", !flag) + " " + lang.getName(w[npc.loc], {article:DEFINITE});
      const exit = w[npc.loc].findExit(dest);
      if (exit) s += ", heading " + exit.dir;
      s += ".";
      msg(s);
    }
  },

  // the NPC has already been moved, so npc.loc is the destination
  npc_entering_msg:function(npc, origin) {
    let s = "";
    let flag = false;
    if (w[game.player.loc].canViewLocs && w[game.player.loc].canViewLocs.includes(npc.loc)) {
      // Can the player see the location the NPC enters, from another location?
      s = w[game.player.loc].canViewPrefix;
      flag = true;
    }
    if (flag || npc.inSight()) {
      s += lang.nounVerb(npc, "enter", !flag) + " " + lang.getName(w[npc.loc], {article:DEFINITE});
      const exit = w[npc.loc].findExit(origin);
      if (exit) s += " from " + exit.nice();
      s += ".";
      msg(s);
    }
  },

  //----------------------------------------------------------------------------------------------
  // Meta-command responses


  // Save/load messages

  sl_dir_headings:['Filename', 'Game', 'Ver', 'Timestamp', 'Comment'],
  sl_dir_msg:"Ver is the version of the game that was being played when saved. Loading a save game from a different version may or may not work. You can delete a file with the DEL command.",
  sl_no_filename:"Trying to save with no filename",




  spoken_on:"Game mode is now 'spoken'. Type INTRO to hear the introductory text.",
  spoken_off:"Game mode is now 'unspoken'.",
  mode_brief:"Game mode is now 'brief'; no room descriptions (except with LOOK).",
  mode_terse:"Game mode is now 'terse'; room descriptions only shown on first entering and with LOOK.",
  mode_verbose:"Game mode is now 'verbose'; room descriptions shown every time you enter a room.",
  mode_silent_on:"Game is now in silent mode.",
  mode_silent_off:"Silent mode off.",
  transcript_already_on:"Transcript is already turned on.",
  transcript_already_off:"Transcript is already turned off.",
  undo_disabled:"Sorry, UNDO is not enabled in this game.",
  undo_not_available:"There are no saved game-states to UNDO back to.",
  undo_done:"Undoing...",
  again_not_available:"There are no previous commands to repeat.",
  scores_not_implemented:'Scores are not a part of this game.',
  restart_are_you_sure:'Do you really want to restart the game? {b:[Y/N]}',
  restart_no:'Restart cancelled',
  yes_regex:/^(y|yes)$/i,
  



  helpScript:function() {
    if (settings.textInput) {
      metamsg("Type commands in the command bar to interact with the world. Using the arrow keys you can scroll up and down though your previous commands.");      
      metamsg("{b:Movement:} To move, use the eight compass directions (or just N, NE, etc.). Up/down and in/out may be options too. When \"Num Lock\" is on, you can use the number pad for all eight compass directions, - and + for UP and DOWN, / and * for IN and OUT.");
      metamsg("{b:Other commands:} You can also LOOK (or just L or 5 on the number pad), HELP (or ?) or WAIT (or Z or the dot on the number pad). Other commands are generally of the form GET HAT or PUT THE BLUE TEAPOT IN THE ANCIENT CHEST. Experiment and see what you can do!");
      metamsg("{b:Using items: }You can use ALL and ALL BUT with some commands, for example TAKE ALL, and PUT ALL BUT SWORD IN SACK. You can also use pronouns, so LOOK AT MARY, then TALK TO HER. The pronoun will refer to the last subject in the last successful command, so after PUT HAT AND FUNNY STICK IN THE DRAWER, 'IT' will refer to the funny stick (the hat and the stick are subjects of the sentence, the drawer was the object).");
      metamsg("{b:Characters: }If you come across another character, you can ask him or her to do something. Try things like MARY,PUT THE HAT IN THE BOX, or TELL MARY TO GET ALL BUT THE KNIFE. Depending on the game you may be able to TALK TO a character, to ASK or TELL a character ABOUT a topic, or just SAY something and they will respond..");
      metamsg("{b:Meta-commands:} Type ABOUT to find out about the author, SCRIPT to learn about transcripts or SAVE to learn about saving games. Use WARNINGS to see any applicable sex, violence or trigger warnings.")
      let s = "You can also use BRIEF/TERSE/VERBOSE to control room descriptions. Type DARK to toggle dark mode or SILENT to toggle sounds and music (if implemented)."
      if (typeof map !== "undefined") s += " Use MAP to toggle/show the map."
      if (typeof imagePane !== "undefined") s += " Use IMAGES to toggle/show the iage pane."
      metamsg(s)
      metamsg("{b:Shortcuts:}You can often just type the first few characters of an item's name and Quest will guess what you mean.  If fact, if you are in a room with Brian, who is holding a ball, and a box, Quest should be able to work out that B,PUT B IN B mean you want Brian to put the ball in the box.")
      metamsg("You can use the up and down arrows to scroll back though your previous typed commands - especially useful if you realise you spelled something wrong. If you do not have arrow keys, use OOPS to retrieve the last typed command so you can edit it. Use AGAIN or just G to repeat the last typed command.")
    }
    if (settings.panes !== "none") {
      metamsg("{b:User Interface:} To interact with an object, click on its name in the side pane, and a set of possible actions will appear under it. Click on the appropriate action.");
      if (settings.compassPane) {
        if (settings.symbolsForCompass) {
          metamsg("You can also use the compass rose at the top to move around. Click the eye symbol, &#128065;, to look at you current location, the pause symbol, &#9208;, to wait or &#128712; for help.");
        }
        else {
          metamsg("You can also use the compass rose at the top to move around. Click 'Lk' to look at you current location, 'Z' to wait or '?' for help.");
        }
      }
    }
    if (settings.additionalHelp !== undefined) {
      for (let s of settings.additionalHelp) metamsg(s)
    }
    return world.SUCCESS_NO_TURNSCRIPTS;
  },

  hintScript:function() {
    metamsg("Sorry, no hints available.")
    return world.SUCCESS_NO_TURNSCRIPTS;
  },

  aboutScript:function() {
    metamsg("{i:{param:settings:title} version {param:settings:version}} was written by {param:settings:author} using Quest 6 AKA Quest JS version {param:settings:questVersion}.", {settings:settings})
    if (settings.ifdb) metamsg("IFDB number: " + settings.ifdb)
    if (settings.thanks && settings.thanks.length > 0) {
      metamsg("Thanks to " + formatList(settings.thanks, {lastJoiner:lang.list_and}) + ".")
    }
    if (settings.additionalAbout !== undefined) {
      for (let s of settings.additionalAbout) metamsg(s)
    }
    return world.SUCCESS_NO_TURNSCRIPTS
  },

  warningsScript:function() {
    switch (typeof settings.warnings) {
      case 'undefined' : metamsg('No warning have been set for this game.'); break;
      case 'string' : metamsg(settings.warnings); break;
      default: for (let el of settings.warnings) metamsg(el)
    }
    return world.SUCCESS_NO_TURNSCRIPTS;
  },

  saveLoadScript:function() {
    metamsg("To save your progress, type SAVE [filename]. By default, if you have already saved the game, you will not be permitted to save with the same filename, to prevent you accidentally saving when you meant to load. However, you can overwrite a file with the same name by using SAVE [filename] OVERWRITE or just SAVE [filename] OV.");
    metamsg("To load your game, refresh/reload this page in your browser, then type LOAD [filename].");
    metamsg("To see a list of all your QuestJS save games, type DIR or LS. You can delete a saved file with DELETE [filename] or DEL [filename].");
    metamsg("Games are saved on your computer in a special area for the browser called \"localStorage\".");
    return world.SUCCESS_NO_TURNSCRIPTS;
  },

  transcriptScript:function() {
    metamsg("The TRANSCRIPT or SCRIPT command can be used to handle saving the input and output. This can be very useful when testing a game, as the author can go back through it and see exactly what happened, and how the player got there.");
    metamsg("Use SCRIPT ON to turn on recording and SCRIPT OFF to turn it off. Use SCRIPT SHOW to display it (it will appear in a new tab; you will not lose your place in the game). To empty the file, use SCRIPT CLEAR.");
    metamsg("You can add options to the SCRIPT SHOW to hide various types of text. Use M to hide meta-information (like this), I to hide your input, P to hide parser errors (when the parser says it has no clue what you mean), E to hide programming errors and D to hide debugging messages. These can be combined, so SCRIPT SHOW ED will hide programming errors and debugging messages, and SCRIPT SHOW EDPID will show only the output game text.");
    metamsg("You can add a comment to the transcript by starting your text with an asterisk (*).")
    metamsg("You can do TRANSCRIPT WALKTHROUGH or just SCRIPT W to copy the transcript to the clipboard formatted for a walk-through. You can then paste it straight into the code.")
    metamsg("Everything gets saved to memory, and will be lost if you go to another web page or close your browser. The transcript is not saved when you save your game (but will not be lost when you load a game). If you complete the game the text input will disappear, however if you have a transcript a link will be available to access it.");
    metamsg("Transcript is currently: " + (io.transcript ? 'on' : 'off'))
    return world.SUCCESS_NO_TURNSCRIPTS;
  },

  topicsScript:function() {
    metamsg("Use TOPICS FOR [name] to see a list of topic suggestions to ask a character about (if implemented in this game).");
    return world.SUCCESS_NO_TURNSCRIPTS;
  },
  
  betaTestIntro:function() {
    metamsg("This version is for beta-testing (" + settings.version + "). A transcript will be automatically recorded. When you finish, do Ctrl-Enter or type SCRIPT SHOW to open the transcript in a new tab; it can then be copy-and-pasted into an e-mail.")
    if (settings.textInput) metamsg("You can add your own comments to the transcript by starting a command with *.")
    io.scriptStart()
  },
  
  game_over_html:'<p>G<br/>A<br/>M<br/>E<br/>/<br/>O<br/>V<br/>E<br/>R</p>',




  //----------------------------------------------------------------------------------------------
  //  Language Data

  // Misc

  list_and:"and",
  list_nothing:"nothing",
  list_or:"or",
  list_nowhere:"nowhere",
  never_mind:"Never mind.",
  default_description:"It's just scenery.",
  click_to_continue:"Click to continue...",
  buy:"Buy", // used in the command link in the purchase table
  buy_headings:["Item", "Cost", ""],
  current_money:"Current money",
  inside:"inside",
  on_top:"on top",
  carrying:"carrying",



  article_filter_regex:/^(?:the |an |a )?(.+)$/,
  joiner_regex:/\band\b|\, ?and\b|\,/,
  all_regex:/^(all|everything)$/,
  all_exclude_regex:/^((all|everything) (but|bar|except)\b)/,
  go_pre_regex:"go to |goto |go |head |",

  yesNo:['Yes', 'No'],




  //----------------------------------------------------------------------------------------------
  // Language constructs

  pronouns:{
    thirdperson:{subjective:"it", objective:"it", possessive: "its", poss_adj: "its", reflexive:"itself"},
    massnoun:{subjective:"it", objective:"it", possessive: "its", poss_adj: "its", reflexive:"itself"},
    male:{subjective:"he", objective:"him", possessive: "his", poss_adj: "his", reflexive:"himself"},
    female:{subjective:"she", objective:"her", possessive: "hers", poss_adj: "her", reflexive:"herself"},
    plural:{subjective:"they", objective:"them", possessive: "theirs", poss_adj: "their", reflexive:"themselves"},
    firstperson:{subjective:"I", objective:"me", possessive: "mine", poss_adj: "my", reflexive:"myself", possessive_name:'my'},
    secondperson:{subjective:"you", objective:"you", possessive: "yours", poss_adj: "your", reflexive:"yourself", possessive_name:'your'},
  },


  // Display verbs used in the side panel
  verbs:{
    examine:"Examine",
    use:"Use",
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
    read:"Read",
    push:"Push",
    equip:"Equip",
    unequip:"Unequip",
    attack:"Attack",
    sitOn:"Sit on",
    standOn:"Stand on",
    reclineOn:"Lie on",
    getOff:"Get off",
  },
  
  // Flag the state of an item in a list
  invModifiers:{
    worn:"worn",
    open:"open",
    equipped:"equipped",
    dead:"dead",
  },


  // Change the abbrev values to suit your game (or language)
  // You may want to do that in settings, which is loaded first
  exit_list:[
    {name:'northwest', abbrev:'NW', niceDir:"the northwest", type:'compass', key:103, x:-1 ,y:1, z:0, opp:'southeast', symbol:'fa-arrow-left', rotate:45}, 
    {name:'north', abbrev:'N', niceDir:"the north", type:'compass', key:104, x:0 ,y:1, z:0, opp:'south', symbol:'fa-arrow-up'}, 
    {name:'northeast', abbrev:'NE', niceDir:"the northeast", type:'compass', key:105, x:1 ,y:1, z:0, opp:'southwest', symbol:'fa-arrow-up', rotate:45}, 
    {name:'in', abbrev:'In', alt:'enter|i', niceDir:"inside", type:'inout', key:111, opp:'out', symbol:'fa-sign-in-alt'}, 
    {name:'up', abbrev:'U', niceDir:"above", type:'vertical', key:109, x:0 ,y:0, z:1, opp:'down', symbol:'fa-arrow-up'},
    
    {name:'west', abbrev:'W', niceDir:"the west", type:'compass', key:100, x:-1 ,y:0, z:0, opp:'east', symbol:'fa-arrow-left'}, 
    {name:'Look', abbrev:'L', type:'nocmd', key:101, symbol:'fa-eye'}, 
    {name:'east', abbrev:'E', niceDir:"the east", type:'compass', key:102, x:1 ,y:0, z:0, opp:'west', symbol:'fa-arrow-right'}, 
    {name:'out', abbrev:'Out', alt:'exit|o', niceDir:"outside", type:'inout', key:106,opp:'in', symbol:'fa-sign-out-alt'}, 
    {name:'down', abbrev:'Dn', alt:'d', niceDir:"below", type:'vertical', key:107, x:0 ,y:0, z:-1, opp:'up', symbol:'fa-arrow-down'}, 

    {name:'southwest', abbrev:'SW', niceDir:"the southwest", type:'compass', key:97, x:-1 ,y:-1, z:0, opp:'northeast', symbol:'fa-arrow-down', rotate:45}, 
    {name:'south', abbrev:'S', niceDir:"the south", type:'compass', key:98, x:0 ,y:-1, z:0, opp:'north', symbol:'fa-arrow-down'}, 
    {name:'southeast', abbrev:'SE', niceDir:"the southeast", type:'compass', key:99, x:1 ,y:-1, z:0, opp:'northwest', symbol:'fa-arrow-right', rotate:45}, 
    {name:'Wait', abbrev:'Z', type:'nocmd', key:110, symbol:'fa-pause'}, 
    {name:'Help', abbrev:'?', type:'nocmd', symbol:'fa-info'}, 
  ],

  numberUnits:"zero;one;two;three;four;five;six;seven;eight;nine;ten;eleven;twelve;thirteen;fourteen;fifteen;sixteen;seventeen;eighteen;nineteen;twenty".split(";"),
  numberTens:"twenty;thirty;forty;fifty;sixty;seventy;eighty;ninety".split(";"),

  ordinalReplacements:[
    {regex:/one$/, replace:"first"},
    {regex:/two$/, replace:"second"},
    {regex:/three$/, replace:"third"},
    {regex:/five$/, replace:"fifth"},
    {regex:/eight$/, replace:"eighth"},
    {regex:/nine$/, replace:"ninth"},
    {regex:/twelve$/, replace:"twelfth"},
    {regex:/y$/, replace:"ieth"},
  ],



  conjugations:{
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
  },

  contentsForData:{
    surface:{prefix:'with ', suffix:' on it'},
    container:{prefix:'containing ', suffix:''},
  },


  //----------------------------------------------------------------------------------------------
  //                                   LANGUAGE FUNCTIONS

//@DOC
// ## Language Functions
//@UNDOC


  //@DOC
  // Returns "the " if appropriate for this item.
  // If the item has 'defArticle' it returns that; if it has a proper name, returns an empty string.
  addDefiniteArticle:function(item) {
    if (item.defArticle) {
      return item.defArticle + " ";
    }
    return item.properName ? "" : "the ";
  },

  //@DOC
  // Returns "a " or "an " if appropriate for this item.
  // If the item has 'indefArticle' it returns that; if it has a proper name, returns an empty string.
  // If it starts with a vowel, it returns "an ", otherwise "a ".
  addIndefiniteArticle:function(item) {
    if (item.indefArticle) {
      return item.indefArticle + " ";
    }
    if (item.properName) {
      return "";
    }
    if (item.pronouns === lang.pronouns.plural) {
      return "some ";
    }
    if (item.pronouns === lang.pronouns.massnoun) {
      return "";
    }
    if (/^[aeiou]/i.test(item.alias)) {
      return "an ";
    }
    return "a ";
  },

  getName(item, options) {
    if (!options) options = {}
    if (!item.alias) item.alias = item.name
    let s = ''
    let count = options[item.name + '_count'] ? options[item.name + '_count'] : false
    if (!count && options.loc && item.countable) count = item.countAtLoc(options.loc)

    if (item.pronouns === lang.pronouns.firstperson || item.pronouns === lang.pronouns.secondperson) {
      s = options.possessive ? item.pronouns.poss_adj : item.pronouns.subjective;
    }

    else {    
      if (count && count > 1) {
        s += lang.toWords(count) + ' '
      }
      else if (options.article === DEFINITE) {
        s += lang.addDefiniteArticle(item)
      }
      else if (options.article === INDEFINITE) {
        s += lang.addIndefiniteArticle(item, count)
      }
      if (item.getAdjective) {
        s += item.getAdjective()
      }
      if (!count || count === 1) {
        s += (options.enhanced && item.enhancedAlias ? item.enhancedAlias : item.alias)
      }
      else if (item.pluralAlias) {
        s += item.pluralAlias
      }
      else {
        s += item.alias + "s"
      }
      if (options.possessive) {
        if (s.endsWith('s')) {
          s += "'"
        }
        else { 
          s += "'s"
        }
      }
    }
    s += util.getNameModifiers(item, options)

    return (options && options.capital ? sentenceCase(s) : s)
  },


  //@DOC
  // Returns the given number in words, so 19 would be returned as 'nineteen'.
  // Numbers uner -2000 and over 2000 are returned as a string of digits,
  // so 2001 is returned as '2001'.
  toWords:function(number) {
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
        s = s + lang.numberUnits[hundreds] + " hundred ";
        if (number > 0) {
          s = s + "and ";
        }
      }
      if (number < 20) {
        if (number !== 0 || s === "") {
          s = s + lang.numberUnits[number];
        }
      }
      else {
        let units = number % 10;
        let tens = Math.floor(number / 10) % 10;
        s = s + lang.numberTens[tens - 2];
        if (units !== 0) {
          s = s + lang.numberUnits[units];
        }
      }
    }
    else {
      s = number.toString();
    }
    return (s);
  },


  //@DOC
  // Returns the given number in words as the ordinal, so 19 would be returned as 'nineteenth'.
  // Numbers uner -2000 and over 2000 are returned as a string of digits with 'th' appended,
  // so 2001 is returned as '2001th'.
  toOrdinal:function(number) {
    if (typeof number !== "number") {
      errormsg ("toOrdinal can only handle numbers");
      return number;
    }
    
    let s = lang.toWords(number);
    for (let or of lang.ordinalReplacements) {
      if (or.regex.test(s)) {
        return s.replace(or.regex, or.replace);
      }
    }
    return (s + "th");
  },

  convertNumbers:function(s) {
    for (let i = 0; i < lang.numberUnits.length; i++) {
      let regex = new RegExp("\\b" + lang.numberUnits[i] + "\\b");
      if (regex.test(s)) s = s.replace(regex, "" + i);
    }
    return s;
  },















  // Conjugating




  //@DOC
  // Returns the verb properly conjugated for the item, so "go" with a ball would return
  // "goes", but "go" with the player (if using second person pronouns).
  conjugate:function(item, verb) {
    let gender = item.pronouns.subjective;
    if (gender === "he" || gender === "she") { gender = "it"; }
    const arr = lang.conjugations[gender.toLowerCase()];

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
        return lang.conjugate (item, verb.substring(0, verb.length - name.length + 1)) + value;
      }
      else if (name.startsWith("*") && verb.endsWith(name.substring(1))) {
        return item, verb.substring(0, verb.length - name.length + 1) + value;
      }
    }
    return verb;
  },



  //@DOC
  // Returns the pronoun for the item, followed by the conjugated verb,
  // so "go" with a ball would return "it goes", but "go" with the player (if using second person pronouns)
  // would return "you go".
  // The first letter is capitalised if 'capitalise' is true.
  pronounVerb:function(item, verb, capitalise) {
    let s = item.pronouns.subjective + " " + lang.conjugate (item, verb);
    s = s.replace(/ +\'/, "'");  // yes this is a hack!
    return capitalise ? sentenceCase(s) : s;
  },

  pronounVerbForGroup:function(item, verb, capitalise) {
    let s = item.groupPronouns().subjective + " " + lang.conjugate (item.group(), verb);
    s = s.replace(/ +\'/, "'");  // yes this is a hack!
    return capitalise ? sentenceCase(s) : s;
  },

  verbPronoun:function(item, verb, capitalise) {
    let s = lang.conjugate (item, verb) + " " + item.pronouns.subjective;
    s = s.replace(/ +\'/, "'");  // yes this is a hack!
    return capitalise ? sentenceCase(s) : s;
  },

  //@DOC
  // Returns the name for the item, followed by the conjugated verb,
  // so "go" with a ball would return "the ball goes", but "go" with 
  // a some bees would return "the bees go". For the player, (if using second person pronouns)
  // would return the pronoun "you go".
  // The first letter is capitalised if 'capitalise' is true.
  nounVerb:function(item, verb, capitalise) {
    if (item === game.player && !game.player.useProperName) {
      return lang.pronounVerb(item, verb, capitalise);
    }
    let s = lang.getName(item, {article:DEFINITE}) + " " + lang.conjugate (item, verb);
    s = s.replace(/ +\'/, "'");  // yes this is a hack!
    return capitalise ? sentenceCase(s) : s;
  },

  verbNoun:function(item, verb, capitalise) {
    if (item === game.player) {
      return lang.pronounVerb(item, verb, capitalise);
    }
    let s = lang.conjugate (item, verb) + " " + lang.getName(item, {article:DEFINITE});
    s = s.replace(/ +\'/, "'");  // yes this is a hack!
    return capitalise ? sentenceCase(s) : s;
  },

}








// Used by the editor
try { util; }
catch (e) {
  module.exports = { lang:lang }
}
