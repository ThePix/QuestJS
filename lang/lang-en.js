"use strict";

// Language support




const lang = {


  //----------------------------------------------------------------------------------------------
  // Regular expressions for commands
  
  // Meta commands
  MetaHelp:/^help$|^\?$/,
  MetaHint:/^hints?$/,
  MetaCredits:/^about$|^credits?$/,
  MetaDarkMode:/^(?:dark|dark mode|toggle dark|toggle dark mode)$/,
  MetaWarnings:/^warn(?:ing|ings|)$/,
  MetaSilent:/^(?:sh|silent)$/,
  MetaSpoken:/^spoken$/,
  MetaIntro:/^intro$/,
  MetaUnspoken:/^unspoken$/,
  MetaBrief:/^brief$/,
  MetaTerse:/^terse$/,
  MetaVerbose:/^verbose$/,
  MetaTranscript:/^transcript$|^script$/,
  MetaTranscriptOn:/^transcript on$|^script on$/,
  MetaTranscriptOff:/^transcript off$|^script off$/,
  MetaTranscriptClear:/^transcript clear$|^script clear$|^transcript delete$|^script delete$/,
  MetaTranscriptShow:/^transcript show$|^script show$/,
  MetaTranscriptShowWithOptions:/^(?:transcript|script) show (\w+)$/,
  MetaPlayerComment:/^\*(.+)$/,
  MetaSave:/^save$/,
  MetaSaveGame:/^(?:save) (.+)$/,
  MetaLoad:/^reload$|^load$/,
  MetaLoadGame:/^(?:load|reload) (.+)$/,
  MetaDir:/^dir$|^directory$/,
  MetaDeleteGame:/^(?:delete|del) (.+)$/,
  
  // Misc
  Undo:/^undo$/,
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
  LookAt:/^(?:look at|look) (.+)$/,
  LookOut:/^(?:look out of|look out) (.+)$/,
  LookBehind:/^(?:look behind|check behind) (.+)$/,
  LookUnder:/^(?:look under|check under) (.+)$/,
  LookInside:/^(?:look inside) (.+)$/,
  Search:/^(?:search) (.+)$/,
  Take:/^(?:take|get|pick up) (.+)$/,
  Drop:/^(?:drop) (.+)$/,
  Wear2:/^put (?:my |your |his |her |)(.+) on$/,
  Wear:/^(?:wear|don|put on) (?:my |your |his |her |)(.+)$/,
  Remove:/^(?:remove|doff|take off) (?:my |your |his |her |)(.+)$/,
  Remove2:/^take (?:my |your |his |her |)(.+) off$/,
  Read:/^(?:read) (.+)$/,
  Eat:/^(?:eat) (.+)$/,
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
  NpcStand1:/^(.+), ?(?:stand|stand up|get up)$/,
  NpcStand2:/^tell (.+) to (?:stand|stand up|get up)$/,
  FillWith:/^(?:fill) (.+) (?:with) (.+)$/,
  NpcFillWith1:/^(.+), ?(?:fill) (.+) (?:with) (.+)$/,
  NpcFillWith2:/^tell (.+) to (?:fill) (.+) (?:with) (.+)$/,
  PutIn:/^(?:put|place|drop) (.+) (?:in to|into|in|on to|onto|on) (.+)$/,
  NpcPutIn1:/^(.+), ?(?:put|place|drop) (.+) (?:in to|into|in|on to|onto|on) (.+)$/,
  NpcPutIn2:/^tell (.+) to (?:put|place|drop) (.+) (?:in to|into|in|on to|onto|on) (.+)$/,
  TakeOut:/^(?:take|get|remove) (.+) (?:from|out of|out|off of|off) (.+)$/,
  NpcTakeOut1:/^(.+), ?(?:take|get|remove) (.+) (?:from|out of|out|off of|off) (.+)$/,
  NpcTakeOut2:/^tell (.+) to (?:take|get|remove) (.+) (?:from|out of|out|off of|off) (.+)$/,
  GiveTo:/^(?:give) (.+) (?:to) (.+)$/,
  NpcGiveTo1:/^(.+), ?(?:give) (.+) (?:to) (.+)$/,
  NpcGiveTo2:/^tell (.+) to ?(?:give) (.+) (?:to) (.+)$/,
  PushExit:/^(push|pull|move|shift) (.+) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/,
  NpcPushExit1:/^(.+), ?(push|pull|move|shift) (.+) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/,
  NpcPushExit2:/^tell (.+) to (push|pull|move|shift) (.+) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/,
  AskAbout:/^(?:ask) (.+) (about|what|who|how|why|where|when) (.+)$/,
  TellAbout:/^(?:tell) (.+) (about|what|who|how|why|where|when) (.+)$/,
  DebugWalkThrough:/^wt (.+)$/,
  DebugInspect:/^inspect (.+)$/,
  DebugInspectByName:/^inspect2 (.+)$/,
  DebugTest:/^test$/,
  DebugInspectCommand:/^(?:cmd) (.+)$/,
  DebugListCommands:/^cmds$/,
  DebugListCommands2:/^cmds2$/,
  DebugParserToggle:/^parser$/,

  // Moving  
  GoNorthwest:/^(go to |goto |go |head |)(northwest|nw)$/,
  NpcGoNorthwest1:/^(.+), ?(go to |goto |go |head |)(northwest|nw)$/,
  NpcGoNorthwest2:/^tell (.+) to (go to |goto |go |head |)(northwest|nw)$/,
  GoNorth:/^(go to |goto |go |head |)(north|n)$/,
  NpcGoNorth1:/^(.+), ?(go to |goto |go |head |)(north|n)$/,
  NpcGoNorth2:/^tell (.+) to (go to |goto |go |head |)(north|n)$/,
  GoNortheast:/^(go to |goto |go |head |)(northeast|ne)$/,
  NpcGoNortheast1:/^(.+), ?(go to |goto |go |head |)(northeast|ne)$/,
  NpcGoNortheast2:/^tell (.+) to (go to |goto |go |head |)(northeast|ne)$/,
  GoIn:/^(go to |goto |go |head |)(in|in|enter|i)$/,
  NpcGoIn1:/^(.+), ?(go to |goto |go |head |)(in|in|enter|i)$/,
  NpcGoIn2:/^tell (.+) to (go to |goto |go |head |)(in|in|enter|i)$/,
  GoUp:/^(go to |goto |go |head |)(up|u)$/,
  NpcGoUp1:/^(.+), ?(go to |goto |go |head |)(up|u)$/,
  NpcGoUp2:/^tell (.+) to (go to |goto |go |head |)(up|u)$/,
  GoWest:/^(go to |goto |go |head |)(west|w)$/,
  NpcGoWest1:/^(.+), ?(go to |goto |go |head |)(west|w)$/,
  NpcGoWest2:/^tell (.+) to (go to |goto |go |head |)(west|w)$/,
  GoEast:/^(go to |goto |go |head |)(east|e)$/,
  NpcGoEast1:/^(.+), ?(go to |goto |go |head |)(east|e)$/,
  NpcGoEast2:/^tell (.+) to (go to |goto |go |head |)(east|e)$/,
  GoOut:/^(go to |goto |go |head |)(out|out|exit|o)$/,
  NpcGoOut1:/^(.+), ?(go to |goto |go |head |)(out|out|exit|o)$/,
  NpcGoOut2:/^tell (.+) to (go to |goto |go |head |)(out|out|exit|o)$/,
  GoDown:/^(go to |goto |go |head |)(down|dn|d)$/,
  NpcGoDown1:/^(.+), ?(go to |goto |go |head |)(down|dn|d)$/,
  NpcGoDown2:/^tell (.+) to (go to |goto |go |head |)(down|dn|d)$/,
  GoSouthwest:/^(go to |goto |go |head |)(southwest|sw)$/,
  NpcGoSouthwest1:/^(.+), ?(go to |goto |go |head |)(southwest|sw)$/,
  NpcGoSouthwest2:/^tell (.+) to (go to |goto |go |head |)(southwest|sw)$/,
  GoSouth:/^(go to |goto |go |head |)(south|s)$/,
  NpcGoSouth1:/^(.+), ?(go to |goto |go |head |)(south|s)$/,
  NpcGoSouth2:/^tell (.+) to (go to |goto |go |head |)(south|s)$/,
  GoSoutheast:/^(go to |goto |go |head |)(southeast|se)$/,
  NpcGoSoutheast1:/^(.+), ?(go to |goto |go |head |)(southeast|se)$/,
  NpcGoSoutheast2:/^tell (.+) to (go to |goto |go |head |)(southeast|se)$/,



  //----------------------------------------------------------------------------------------------
  // SUCCESSFUL Messages

  take_successful:function(char, item, count) {
    return lang.nounVerb(char, "take", true) + " " + item.byname({article:DEFINITE, count:count}) + ".";
  },
  drop_successful:function(char, item, count) {
    return lang.nounVerb(char, "drop", true) + " " + item.byname({article:DEFINITE, count:count}) + ".";
  },
  wear_successful:function(char, item) {
    return lang.nounVerb(char, "put", true) + " on " + item.byname({article:DEFINITE}) + ".";
  },
  remove_successful:function(char, item) {
    return lang.nounVerb(char, "take", true) + " " + item.byname({article:DEFINITE}) + " off.";
  },
  open_successful:function(char, item) {
    return lang.nounVerb(char, "open", true) + " " + item.byname({article:DEFINITE}) + ".";
  },
  close_successful:function(char, item) {
    return lang.nounVerb(char, "close", true) + " " + item.byname({article:DEFINITE}) + ".";
  },
  lock_successful:function(char, item) {
    return lang.nounVerb(char, "lock", true) + "k " + item.byname({article:DEFINITE}) + ".";
  },
  unlock_successful:function(char, item) {
    return lang.nounVerb(char, "unlock", true) + " " + item.byname({article:DEFINITE}) + ".";
  },
  fill_successful:function(char, item) {
    return lang.nounVerb(char, "fill", true) + " " + item.byname({article:DEFINITE}) + ".";
  },
  empty_successful:function(char, item) {
    return lang.nounVerb(char, "empty", true) + " " + item.byname({article:DEFINITE}) + ".";
  },
  turn_on_successful:function(char, item) {
    return lang.nounVerb(char, "switch", true) + " " + item.byname({article:DEFINITE}) + " on.";
  },
  turn_off_successful:function(char, item) {
    return lang.nounVerb(char, "switch", true) + " " + item.byname({article:DEFINITE}) + " off.";
  },
  sit_on_successful:function(char, item) {
    return lang.nounVerb(char, "sit", true) + " on " + item.byname({article:DEFINITE}) + ".";
  },
  stand_on_successful:function(char, item) {
    return lang.nounVerb(char, "stand", true) + " on " + item.byname({article:DEFINITE}) + ".";
  },
  recline_on_successful:function(char, item) {
    return lang.nounVerb(char, "lie", true) + " down on " + item.byname({article:DEFINITE}) + ".";
  },
  eat_successful:function(char, item) {
    return lang.nounVerb(char, "eat", true) + " " + item.byname({article:DEFINITE}) + ".";
  },
  drink_successful:function(char, item) {
    return lang.nounVerb(char, "drink", true) + " " + item.byname({article:DEFINITE}) + ".";
  },
  purchase_successful:function(char, item, amt) {
    return lang.nounVerb(char, "buy", true) + " " + item.byname({article:DEFINITE}) + " for " + displayMoney(amt) + ".";
  },
  sell_successful:function(char, item, amt) {
    return lang.nounVerb(char, "sell", true) + " " + item.byname({article:DEFINITE}) + " for " + displayMoney(amt) + ".";
  },
  push_exit_successful:function(char, item, dir, destRoom) {
    return lang.nounVerb(char, "push", true) + " " + item.byname({article:DEFINITE}) + " " + dir + ".";
  },

  go_successful:function(char, dir) {
    return lang.nounVerb(char, "head", true) + " " + dir + ".";
  },





  //----------------------------------------------------------------------------------------------
  // Cannot Messages

  cannot_take:function(char, item) {
    return lang.nounVerb(char, "can't", true) + " take " + item.pronouns.objective + ".";
  },
  cannot_wear:function(char, item) {
    return lang.nounVerb(char, "can't", true) + " wear " + item.pronouns.objective + ".";
  },
  cannot_wear_ensemble:function(char, item) {
    return "Individual parts of an ensemble must be worn and removed separately.";
  },
  cannot_switch_on:function(char, item) {
    return lang.nounVerb(char, "can't", true) + " turn " + item.pronouns.objective + " on.";
  },
  cannot_switch_off:function(char, item) {
    return lang.nounVerb(char, "can't", true) + " turn " + item.pronouns.objective + " off.";
  },
  cannot_open:function(char, item) {
    return lang.nounVerb(item, "can't", true) + " be opened.";
  },
  cannot_close:function(char, item) {
    return lang.nounVerb(item, "can't", true) + " be closed.";
  },
  cannot_lock:function(char, item) {
    return lang.nounVerb(char, "can't", true) + "t lock " + item.pronouns.objective + ".";
  },
  cannot_unlock:function(char, item) {
    return lang.nounVerb(char, "can't", true) + " unlock " + item.pronouns.objective + ".";
  },
  cannot_read:function(char, item) {
    return "Nothing worth reading there.";
  },

  cannot_purchase:function(char, item) {
    return lang.nounVerb(char, "can't", true) + " buy " + item.pronouns.objective + ".";
  },
  cannot_purchase_here:function(char, item) {
    if (item.doNotClone && item.isAtLoc(char.name)) {
      return lang.nounVerb(char, "can't", true) + " buy " + item.byname({article:DEFINITE}) + " here - probably because " + lang.nounVerb(char, "be") + " already holding " + item.pronouns.objective + ".";
    }
    else {
      return lang.nounVerb(char, "can't", true) + " buy " + item.byname({article:DEFINITE}) + " here.";
    }
  },
  cannot_afford:function(char, item, amt) {
    return lang.nounVerb(char, "can't", true) + " afford " + item.byname({article:DEFINITE}) + " (need " + displayMoney(amt) + ").";
  },
  cannot_sell:function(char, item, amt) {
    return lang.nounVerb(char, "can't", true) + " sell " + item.pronouns.objective + ".";
  },
  cannot_sell_here:function(char, item, amt) {
    return lang.nounVerb(char, "can't", true) + " sell " + item.byname({article:DEFINITE}) + " here.";
  },

  cannot_use:function(char, item) {
    return "No obvious way to use " + item.pronouns.objective + ".";
  },
  cannot_smash:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not something you can break.";
  },
  cannot_fill:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not something you can fill.";
  },
  cannot_mix:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not something you can mix liquids in.";
  },
  cannot_empty:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not something you can empty.";
  },
  cannot_look_out:function(char, item) {
    lang.pronounVerb(char, "can't", true) + " look out of " + item.pronouns.objective + ".";
  },
  cannot_stand_on:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not something you can stand on.";
  },
  cannot_sit_on:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not something you can sit on.";
  },
  cannot_recline_on:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not something you can lie on.";
  },

  cannot_eat:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not something you can eat.";
  },
  cannot_drink:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not something you can drink.";
  },
  cannot_ingest:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not something you can ingest.";
  },
  cannot_push:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not something you can move around like that.";
  },
  cannot_push_up:function(char, item) {
    return lang.pronounVerb(char, "'be", true) + " not getting " + item.byname({article:DEFINITE}) + " up there!";
  },
  cannot_ask_about:function(char, item, text) {
    return "You can ask " + item.pronouns.objective + " about " + text + " all you like, but " + lang.pronounVerb(item, "'be") + " not about to reply.";
  },
  cannot_tell_about:function(char, item, text) {
    return "You can tell " + item.pronouns.objective + " about " + text + " all you like, but " + lang.pronounVerb(item, "'be") + " not interested.";
  },
  cannot_talk_to:function(char, item) {
    return "You chat to " + item.byname({article:DEFINITE}) + " for a few moments, before releasing that " + lang.pronounVerb(item, "'be") + " not about to reply.";
  },


  //----------------------------------------------------------------------------------------------
  // General command messages

  not_known_msg:"I don't even know where to begin with that.",
  disambig_msg:"Which do you mean?",
  no_multiples_msg:"You cannot use multiple objects with that command.",
  nothing_msg:"Nothing there to do that with.",
  general_obj_error:"So I kind of get what you want to do, but not what you want to do it with.",
  done_msg:"Done.",
  nothing_for_sale:"Nothing for sale here.",
  wait_msg:"You wait one turn.",
  no_map:"Sorry, no map available.",
  inventoryPreamble:"You are carrying",




  no_smell:function(char) {
    return lang.nounVerb(char, "can't", true) + " smell anything here.";
  },
  no_listen:function(char) {
    return lang.nounVerb(char, "can't", true) + " hear anything of note here.";
  },
  nothing_there:function(char) {
    return lang.nounVerb(char, "be", true) + " sure there's nothing there.";
  },
  nothing_inside:function(char) {
    return "There's nothing to see inside.";
  },
  not_that_way:function(char, dir) {
    return lang.nounVerb(char, "can't", true) + " go " + dir + ".";
  },
  object_unknown_msg:function(name) {
    return lang.nounVerb(game.player, "can't", true) + " see anything you might call '" + name + "' here.";
  },

  not_here:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not here.";
  },
  char_has_it:function(char, item) {
    return lang.nounVerb(char, "have", true) + " " + item.pronouns.objective + ".";
  },
  none_here:function(char, item) {
    return "There's no " + item.pluralAlias + " here.";
  },
  none_held:function(char, item) {
    return pronoun(char, "have", true) + " no " + item.pluralAlias + ".";
  },
  take_not_push:function(char, item) {
    return "Just pick the thing up already!";
  },

  nothing_useful:function(char, item) {
    return "That's not going to do anything useful.";
  },
  already:function(item) {
    return sentenceCase(item.pronouns.subjective) + " already " + lang.conjugate (item, "be") + ".";
  },
  default_examine:function(char, item) {
    return lang.pronounVerb(item, "be", true) + " just your typical, every day " + item.byname() + ".";
  },
  no_topics:function(char, target) {
    return lang.nounVerb(char, "have", true) + " nothing to talk to " + target.byname({article:DEFINITE}) + " about.";
  },
  say_no_one_here:function(char, verb, text) {
    return lang.nounVerb(char, verb, true) + ", '" + sentenceCase(text) + ",' but no one notices.";
  },
  say_no_response:function(char, verb, text) {
    return "No one seemed interested in what you say.";
  },
  say_no_response_full:function(char, verb, text) {
    return lang.nounVerb(char, verb, true) + ", '" + sentenceCase(text) + ",' but no one seemed interested in what you say.";
  },
  
  container_recursion:function(char, container, item) {
    return "What? You want to put " + item.byname({article:DEFINITE}) + " in " + container.byname({article:DEFINITE}) + " when " + container.byname({article:DEFINITE}) + " is already in " + item.byname({article:DEFINITE}) + "? That's just too freaky for me.";
  },


  //----------------------------------------------------------------------------------------------
  // Specific command messages

  not_npc:function(item) {
    return lang.nounVerb(game.player, "can", true) + " tell " + item.byname({article:DEFINITE}) + " to do what you like, but there is no way " + lang.pronounVerb(item, "'ll") + " do it.";
  },
  not_npc_for_give:function(char, item) {
    return "Realistically, " + lang.nounVerb(item, "be") + " not interested in anything " + char.pronouns.subjective + " might give " + item.pronouns.objective + ".";
  },
  not_able_to_hear:function(char, item) {
    return "Doubtful " + lang.nounVerb(item, "will") + " be interested in anything " + char.pronouns.subjective + " has to say.";
  },
  not_container:function(char, item) {
    return sentenceCase(item.byname({article:DEFINITE})) + " is not a container.";
  },
  not_vessel:function(char, item) {
    return sentenceCase(item.byname({article:DEFINITE})) + " is not a vessel.";
  },

  not_carrying:function(char, item) {
    return lang.pronounVerb(char, "don't", true) + " have " + item.pronouns.objective + ".";
  },
  not_inside:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " not inside that.";
  },
  wearing:function(char, item) {
    return lang.pronounVerb(char, "'be", true) + " wearing " + item.pronouns.objective + ".";
  },
  not_wearing:function(char, item) {
    return lang.pronounVerb(char, "'be", true) + " not wearing " + item.pronouns.objective + ".";
  },
  cannot_wear_over:function(char, item, outer) {
    return lang.pronounVerb(char, "can't", true) + " put " + item.byname({article:INDEFINITE}) + " on over " + char.pronouns.poss_adj + " " + outer.byname() + ".";
  },
  cannot_remove_under:function(char, item, outer) {
    return lang.pronounVerb(char, "can't", true) + " take off " + char.pronouns.poss_adj + " " + item.byname() + " whilst wearing " + char.pronouns.poss_adj + " " + outer.byname() + ".";
  },
  already_have:function(char, item) {
    return lang.pronounVerb(char, "'ve", true) + " got " + item.pronouns.objective + " already.";
  },
  already_wearing:function(char, item) {
    return lang.pronounVerb(char, "'ve", true) + " already wearing " + item.pronouns.objective + ".";
  },
  cannot_take_component:function(char, item) {
    return lang.nounVerb(char, "can't", true) + " take " + item.pronouns.objective + "; " + lang.pronounVerb(item, "'be") + " part of " + w[item.loc].byname({article:DEFINITE}) + ".";
  },
  container_closed:function(char, item) {
    return lang.nounVerb(item, "be", true) + " closed.";
  },
  inside_container:function(char, item, cont) {
    return lang.pronounVerb(item, "be", true) + " inside " + cont.byname({article:DEFINITE}) + ".";
  },
  look_inside:function(char, item) {
    const l = formatList(item.getContents(world.LOOK), {article:INDEFINITE, lastJoiner:" and ", nothing:"nothing"});
    return "Inside " + item.byname({article:DEFINITE}) + " " + lang.pronounVerb(char, "can") + " see " + l + ".";
  },
  stop_posture:function(char) {
    if (!char.posture || char.posture === "standing") return "";
    let s;
    // You could split up sitting, standing and lying
    if (char.postureFurniture) {
      s = lang.nounVerb(char, "get", true) + " off " + w[char.postureFurniture].byname({article:DEFINITE}) + ".";
    }
    else {
      s = lang.nounVerb(char, "stand", true) + " up.";
    }
    char.posture = undefined;
    char.postureFurniture = undefined;
    return s;
  },
  can_go:function() {
    return "You think you can go {exits}."
  },



  //----------------------------------------------------------------------------------------------
  // NPC messages

  npc_nothing_to_say_about:function(char) {
    return lang.nounVerb(char, "have", true) + " nothing to say on the subject.";
  },
  npc_no_interest_in:function(char) {
    return lang.nounVerb(char, "have", true) + " no interest in that subject.";
  },



  // If the player does SPEAK TO MARY and Mary has some topics, this will be the menu title.
  speak_to_menu_title:function(char) {
    return "Talk to " + char.byname({article:DEFINITE}) + " about:";
  },
  // If the player does TELL MARY ABOUT HOUSE this will appear before the response.
  tell_about_intro:function(char, text1, text2) {
    return "You tell " + char.byname({article:DEFINITE}) + " " + text2 + " " + text1 + ".";
  },
  // If the player does ASK MARY ABOUT HOUSE this will appear before the response.
  ask_about_intro:function(char, text1, text2) {
    return "You ask " + char.byname({article:DEFINITE}) + " " + text2 + " " + text1 + ".";
  },
  // This will be added to the start of the regex of a command to make an NPC command
  // The saved capture group is the NPC's name
  tell_to_prefixes:{
    1:'(?:tell|ask) (.+) to ',   // TELL KYLE TO GET SPOON
    2:'(.+), ?',                 // KYLE, GET SPOON
  },


  //----------------------------------------------------------------------------------------------
  // Door and lock fails

  locked:function(char, item) {
    return lang.pronounVerb(item, "'be", true) + " locked.";
  },
  no_key:function(char, item) {
    return lang.nounVerb(char, "do", true) + " have the right key.";
  },
  locked_exit:function(char, exit) {
    return "That way is locked.";
  },
  open_and_enter:function(char, doorName) {
    return lang.nounVerb(char, "open", true) + " the " + doorName + " and walk through.";
  },
  unlock_and_enter:function(char, doorName) {
    return lang.nounVerb(char, "unlock", true) + " the " + doorName + ", open it and walk through.";
  },
  try_but_locked:function(char, doorName) {
    return lang.nounVerb(char, "try", true) + " the " + doorName + ", but it is locked.";
  },


  // Use when the NPC leaves a room; will give a message if the player can observe it
  npcLeavingMsg:function(npc, dest) {
    let s = "";
    let flag = false;
    if (w[game.player.loc].canViewLocs && w[game.player.loc].canViewLocs.includes(npc.loc)) {
      s = w[game.player.loc].canViewPrefix;
      flag = true;
    }
    if (flag || npc.inSight()) {
      s += lang.nounVerb(npc, "leave", !flag) + " " + w[npc.loc].byname({article:DEFINITE});
      const exit = w[npc.loc].findExit(dest);
      if (exit) s += ", heading " + exit.dir;
      s += ".";
      msg(s);
    }
  },



  // the NPC has already been moved, so npc.loc is the destination
  npcEnteringMsg:function(npc, origin) {
    let s = "";
    let flag = false;
    if (w[game.player.loc].canViewLocs && w[game.player.loc].canViewLocs.includes(npc.loc)) {
      // Can the player see the location the NPC enters, from another location?
      s = w[game.player.loc].canViewPrefix;
      flag = true;
    }
    if (flag || npc.inSight()) {
      s += lang.nounVerb(npc, "enter", !flag) + " " + w[npc.loc].byname({article:DEFINITE});
      const exit = w[npc.loc].findExit(origin);
      if (exit) s += " from " + util.niceDirections(exit.dir);
      s += ".";
      msg(s);
    }
  },



  //----------------------------------------------------------------------------------------------
  // Save/load messages

  sl_dir_headings:"<tr><th>Filename</th><th>Ver</th><th>Timestamp</th><th>Comment</th></tr>",
  sl_dir_msg:"Ver is the version of the game that was being played when saved. Loading a save game from a different version may or may not work. You can delete a file with the DEL command.",
  sl_no_filename:"Trying to save with no filename",



  //----------------------------------------------------------------------------------------------
  // Meta-messages

  topics_no_ask_tell:"This character has no ASK/ABOUT or TELL/ABOUT options set up.",
  topics_none_found:function(char) {
    return "No suggestions for what to ask or tell " + char.byname({article:DEFINITE}) + " available."
  },
  topics_ask_list:function(char, arr) {
    return "Some suggestions for what to ask " + char.byname({article:DEFINITE}) + " about: " + arr.join("; ") + "."
  },
  topics_tell_list:function(char, arr) {
    return "Some suggestions for what to tell " + char.byname({article:DEFINITE}) + " about: " + arr.join("; ") + "."
  },

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



  helpScript:function() {
    if (settings.textInput) {
      metamsg("Type commands in the command bar to interact with the world.");      
      metamsg("{b:Movement:} To move, use the eight compass directions (or just 'n', 'ne', etc.). Up/down and in/out may be options too. When \"Num Lock\" is on, you can use the number pad for all eight compass directions, and + and - for UP and DOWN.");
      metamsg("{b:Other commands:} You can also LOOK, HELP or WAIT. Other commands are generally of the form GET HAT or PUT THE BLUE TEAPOT IN THE ANCIENT CHEST. Experiment and see what you can do!");
      metamsg("{b:Using items: }You can use ALL and ALL BUT with some commands, for example TAKE ALL, and PUT ALL BUT SWORD IN SACK. You can also use pronouns, so LOOK AT MARY, then TALK TO HER. The pronoun will refer to the last subject in the last successful command, so after PUT HAT AND FUNNY STICK IN THE DRAWER, 'IT' will refer to the funny stick (the hat and the stick are subjects of the sentence, the drawer was the object).");
      metamsg("{b:Characters: }If you come across another character, you can ask him or her to do something. Try things like MARY,PUT THE HAT INTHE BOX, or TELL MARY TO GET ALL BUT THE KNIFE. Depending on the game you may be able to TALK TO a character, to ASK or TELL a character ABOUT a topic, or just SAY something and they will respond..");
      metamsg("{b:Meta-commands:} Type ABOUT to find out about the author, SCRIPT to learn about transcripts or SAVE to learn about saving games. You can also use BRIEF/TERSE/VERBOSE to control room descriptions. Use WARNINGS to see any applicable sex, violence or trigger warnings, type DARK to toggle dark mode or SILENT to prevent sounds/music (if implemented).")
      metamsg("{b:Shortcuts:}You can often just type the first few characters of an item's name and Quest will guess what you mean.  If fact, if you are in a room with Brian, who is holding a ball, and a box, Quest should be able to work out that B,PUT B IN B mean you want Brian to put the ball in the box.")
      metamsg("You can use the up and down arrows to scroll back though your previous commands - especially useful if you realise you spelled something wrong.")
    }
    if (settings.panes !== "None") {
      metamsg("{b:User Interface:} To interact with an object, click on its name in the side pane, and a set of possible actions will appear under it. Click on the appropriate action.");
      if (settings.compass) {
        metamsg("You can also use the compass rose at the top to move around. Click 'Lk' to look at you current location, 'Z' to wait or '?' for help.");
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
    metamsg("{i:{param:settings:title} version {param:settings:version}} was written by {param:settings:author} using Quest 6.", {settings:settings});
    if (settings.thanks && settings.thanks.length > 0) {
      metamsg("Thanks to " + formatList(settings.thanks, {lastJoiner:lang.list_and}) + ".");
    }
    return world.SUCCESS_NO_TURNSCRIPTS;
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
    metamsg("To save your progress, type SAVE followed by the name to save with.");
    metamsg("To load your game, refresh/reload this page in your browser, then type LOAD followed by the name you saved with.");
    metamsg("To see a list of save games, type DIR.");
    return world.SUCCESS_NO_TURNSCRIPTS;
  },

  transcriptScript:function() {
    metamsg("The TRANSCRIPT or SCRIPT command can be used to handle saving the input and output.");
    metamsg("Use SCRIPT ON to turn on recording and SCRIPT OFF to turn it off. Use SCRIPT SHOW to display it. To empty the file, use SCRIPT CLEAR.");
    metamsg("You can add options to the SCRIPT SHOW to hide various types of text. Use M to hide meta-information (like this), I to hide your input, P to hide parser errors (when the parser says it has no clue what you mean), E to hide programming errors and D to hide debugging messages. These can be combined, so SCRIPT SHOW ED will hide programming errors and debugging messages, and SCRIPT SHOW EDPID will show only the output game text.");
    metamsg("Everything gets saved to memory, and will be lost if you go to another web page or close your browser, but should be saved when you save your game. You can only have one transcript dialog window open at a time.");
    metamsg("You can add a comment to the transcript by starting your text with a *.")
    return world.SUCCESS_NO_TURNSCRIPTS;
  },

  topicsScript:function() {
    metamsg("Use TOPICS FOR [name] to see a list of topic suggestions to ask a character about (if implemented in this game).");
    return world.SUCCESS_NO_TURNSCRIPTS;
  },

  //----------------------------------------------------------------------------------------------
  //                                   DATA

  // Misc

  list_and:" and ",
  list_nothing:"nothing",
  list_or:" or ",
  list_nowhere:"nowhere",
  never_mind:"Never mind.",
  default_description:"It's just scenery.",
  click_to_continue:"Click to continue...",
  buy:"Buy", // used in the command link in the purchase table
  buy_headings:["Item", "Cost", ""],
  current_money:"Current money",




  article_filter_regex:/^(?:the |an |a )?(.+)$/,
  joiner_regex:/\,|\band\b/,
  all_regex:/^(all|everything)$/,
  all_exclude_regex:/^((all|everything) (but|bar|except)\b)/,
  go_pre_regex:"go to |goto |go |head |",

  yesNo:['Yes', 'No'],

  contentsForData:{
    surface:{prefix:'with ', suffix:' on it'},
    container:{prefix:'containing ', suffix:''},
  },

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
  },


  // Change the abbrev values to suit your game (or language)
  // You may want to do that in settings, which is loaded first
  exit_list:[
    {name:'northwest', abbrev:'NW', niceDir:"the northwest", type:'compass', key:103, x:-1 ,y:1, z:0, opp:'southeast'}, 
    {name:'north', abbrev:'N', niceDir:"the north", type:'compass', key:104, x:0 ,y:1, z:0, opp:'south'}, 
    {name:'northeast', abbrev:'NE', niceDir:"the northeast", type:'compass', key:105, x:1 ,y:1, z:0, opp:'southwest'}, 
    {name:'in', abbrev:'In', alt:'enter|i', niceDir:"inside", type:'inout', opp:'out'}, 
    {name:'up', abbrev:'U', niceDir:"above", type:'vertical', key:107, x:0 ,y:0, z:1, opp:'down'},
    
    {name:'west', abbrev:'W', niceDir:"the west", type:'compass', key:100, x:-1 ,y:0, z:0, opp:'east'}, 
    {name:'Look', abbrev:'Lk', type:'nocmd', key:101}, 
    {name:'east', abbrev:'E', niceDir:"the east", type:'compass', key:102, x:1 ,y:0, z:0, opp:'west'}, 
    {name:'out', abbrev:'Out', alt:'exit|o', niceDir:"outside", type:'inout', opp:'in'}, 
    {name:'down', abbrev:'Dn', alt:'d', niceDir:"below", type:'vertical', key:109, x:0 ,y:0, z:-1, opp:'up'}, 

    {name:'southwest', abbrev:'SW', niceDir:"the southwest", type:'compass', key:97, x:-1 ,y:-1, z:0, opp:'northeast'}, 
    {name:'south', abbrev:'S', niceDir:"the south", type:'compass', key:98, x:0 ,y:-1, z:0, opp:'north'}, 
    {name:'southeast', abbrev:'SE', niceDir:"the southeast", type:'compass', key:99, x:1 ,y:-1, z:0, opp:'northwest'}, 
    {name:'Wait', abbrev:'Z', type:'nocmd', key:110}, 
    {name:'Help', abbrev:'?', type:'nocmd'}, 
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















  //----------------------------------------------------------------------------------------------
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
    if (item === game.player) {
      return lang.pronounVerb(item, verb, capitalise);
    }
    let s = item.byname({article:DEFINITE}) + " " + lang.conjugate (item, verb);
    s = s.replace(/ +\'/, "'");  // yes this is a hack!
    return capitalise ? sentenceCase(s) : s;
  },

  verbNoun:function(item, verb, capitalise) {
    if (item === game.player) {
      return lang.pronounVerb(item, verb, capitalise);
    }
    let s = lang.conjugate (item, verb) + " " + item.byname({article:DEFINITE});
    s = s.replace(/ +\'/, "'");  // yes this is a hack!
    return capitalise ? sentenceCase(s) : s;
  },






};








// Used by the editor
try { util; }
catch (e) {
  module.exports = { lang:lang }
}