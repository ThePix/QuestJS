(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('postscribe')) :
  typeof define === 'function' && define.amd ? define(['exports', 'postscribe'], factory) :
  (global = global || self, factory(global.QuestJS = global.QuestJS || {}, global.postscribe));
}(this, (function (exports, postscribe) { 'use strict';

  postscribe = postscribe && Object.prototype.hasOwnProperty.call(postscribe, 'default') ? postscribe['default'] : postscribe;

  // Language support

  const lang = {

    // ----------------------------------------------------------------------------------------------
    // Regular expressions for commands

    // Meta commands
    MetaHelp: /^help$|^\?$/,
    MetaCredits: /^about$|^credits?$/,
    MetaSpoken: /^spoken$/,
    MetaIntro: /^intro$/,
    MetaUnspoken: /^unspoken$/,
    MetaBrief: /^brief$/,
    MetaTerse: /^terse$/,
    MetaVerbose: /^verbose$/,
    MetaTranscript: /^transcript|script$/,
    MetaTranscriptOn: /^transcript on|script on$/,
    MetaTranscriptOff: /^transcript off|script off$/,
    MetaTranscriptClear: /^transcript clear|script clear|transcript delete|script delete$/,
    MetaTranscriptShow: /^transcript show|script show$/,
    MetaTranscriptShowWithOptions: /^(?:transcript|script) show (\w+)$/,
    MetaSave: /^save$/,
    MetaSaveGame: /^(?:save) (.+)$/,
    MetaLoad: /^reload$|^load$/,
    MetaLoadGame: /^(?:load|reload) (.+)$/,
    MetaDir: /^dir$|^directory$/,
    MetaDeleteGame: /^(?:delete|del) (.+)$/,

    // Misc
    Undo: /^undo$/,
    Look: /^l$|^look$/,
    Exits: /^exits$/,
    Wait: /^wait$|^z$/,
    TopicsNote: /^topics?$/,
    Inv: /^inventory$|^inv$|^i$/,
    Map: /^map$/,
    Smell: /^smell$|^sniff$/,
    Listen: /^listen$/,
    PurchaseFromList: /^buy$|^purchase$/,

    // Use item
    Examine: /^(?:examine|exam|ex|x) (.+)$/,
    LookAt: /^(?:look at|look) (.+)$/,
    LookOut: /^(?:look out of|look out) (.+)$/,
    LookBehind: /^(?:look behind|check behind) (.+)$/,
    LookUnder: /^(?:look under|check under) (.+)$/,
    LookInside: /^(?:look inside) (.+)$/,
    Search: /^(?:search) (.+)$/,
    Take: /^(?:take|get|pick up) (.+)$/,
    Drop: /^(?:drop) (.+)$/,
    Wear2: /^put (?:my |your |his |her |)(.+) on$/,
    Wear: /^(?:wear|don|put on) (?:my |your |his |her |)(.+)$/,
    Remove: /^(?:remove|doff|take off) (?:my |your |his |her |)(.+)$/,
    Remove2: /^take (?:my |your |his |her |)(.+) off$/,
    Read: /^(?:read) (.+)$/,
    Purchase: /^(?:purchase|buy) (.+)$/,
    Sell: /^(?:sell) (.+)$/,
    Smash: /^(?:smash|break|destroy) (.+)$/,
    SwitchOn: /^(?:turn on|switch on) (.+)$/,
    SwitchOn2: /^(?:turn|switch) (.+) on$/,
    SwitchOff2: /^(?:turn|switch) (.+) off$/,
    SwitchOff: /^(?:turn off|switch off) (.+)$/,
    Open: /^(?:open) (.+)$/,
    Close: /^(?:close) (.+)$/,
    Lock: /^(?:lock) (.+)$/,
    Unlock: /^(?:unlock) (.+)$/,
    Push: /^(?:push|press) (.+)$/,
    Pull: /^(?:pull) (.+)$/,
    Fill: /^(?:fill) (.+)$/,
    Empty: /^(?:empty) (.+)$/,
    Eat: /^(eat|feed on|feed|partake of|partake|dine on|dine) (.+)$/,
    Drink: /^(drink|imbibe|quaff|guzzle|knock back|swig|swill|sip|down|chug) (.+)$/,
    Ingest: /^(consume|swallow|ingest) (.+)$/,
    SitOn: /^(?:sit on|sit upon|sit) (.+)$/,
    StandOn: /^(?:stand on|stand upon|stand) (.+)$/,
    ReclineOn: /^(?:recline on|recline upon|recline|lie on|lie upon|lie) (.+)$/,
    GetOff: /^(?:get off|off) (.+)$/,
    Use: /^(?:use) (.+)$/,
    TalkTo: /^(?:talk to|talk|speak to|speak|converse with|converse) (.+)$/,
    Topics: /^topics? (?:for )?(.+)$/,

    // Misc again
    Say: /^(say|shout|whisper) (.+)$/,
    Stand: /^stand$|^stand up$|^get up$/,
    NpcStand1: /^(.+), ?(?:stand|stand up|get up)$/,
    NpcStand2: /^tell (.+) to (?:stand|stand up|get up)$/,
    FillWith: /^(?:fill) (.+) (?:with) (.+)$/,
    NpcFillWith1: /^(.+), ?(?:fill) (.+) (?:with) (.+)$/,
    NpcFillWith2: /^tell (.+) to (?:fill) (.+) (?:with) (.+)$/,
    PutIn: /^(?:put|place|drop) (.+) (?:in to|into|in|on to|onto|on) (.+)$/,
    NpcPutIn1: /^(.+), ?(?:put|place|drop) (.+) (?:in to|into|in|on to|onto|on) (.+)$/,
    NpcPutIn2: /^tell (.+) to (?:put|place|drop) (.+) (?:in to|into|in|on to|onto|on) (.+)$/,
    TakeOut: /^(?:take|get|remove) (.+) (?:from|out of|out|off of|off) (.+)$/,
    NpcTakeOut1: /^(.+), ?(?:take|get|remove) (.+) (?:from|out of|out|off of|off) (.+)$/,
    NpcTakeOut2: /^tell (.+) to (?:take|get|remove) (.+) (?:from|out of|out|off of|off) (.+)$/,
    GiveTo: /^(?:give) (.+) (?:to) (.+)$/,
    NpcGiveTo1: /^(.+), ?(?:give) (.+) (?:to) (.+)$/,
    NpcGiveTo2: /^tell (.+) to ?(?:give) (.+) (?:to) (.+)$/,
    PushExit: /^(push|pull|move|shift) (.+) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/,
    NpcPushExit1: /^(.+), ?(push|pull|move|shift) (.+) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/,
    NpcPushExit2: /^tell (.+) to (push|pull|move|shift) (.+) (northwest|nw|north|n|northeast|ne|in|in|enter|i|up|u|west|w|east|e|out|out|exit|o|down|dn|d|southwest|sw|south|s|southeast|se)$/,
    AskAbout: /^(?:ask) (.+) (about|what|who|how|why|where|when) (.+)$/,
    TellAbout: /^(?:tell) (.+) (about|what|who|how|why|where|when) (.+)$/,
    DebugWalkThrough: /^wt (.+)$/,
    DebugInspect: /^inspect (.+)$/,
    DebugInspectByName: /^inspect2 (.+)$/,
    DebugTest: /^test$/,
    DebugInspectCommand: /^(?:cmd) (.+)$/,
    DebugListCommands: /^cmds$/,
    DebugListCommands2: /^cmds2$/,
    DebugParserToggle: /^parser$/,

    // Moving
    GoNorthwest: /^(go to |goto |go |head |)(northwest|nw)$/,
    NpcGoNorthwest1: /^(.+), ?(go to |goto |go |head |)(northwest|nw)$/,
    NpcGoNorthwest2: /^tell (.+) to (go to |goto |go |head |)(northwest|nw)$/,
    GoNorth: /^(go to |goto |go |head |)(north|n)$/,
    NpcGoNorth1: /^(.+), ?(go to |goto |go |head |)(north|n)$/,
    NpcGoNorth2: /^tell (.+) to (go to |goto |go |head |)(north|n)$/,
    GoNortheast: /^(go to |goto |go |head |)(northeast|ne)$/,
    NpcGoNortheast1: /^(.+), ?(go to |goto |go |head |)(northeast|ne)$/,
    NpcGoNortheast2: /^tell (.+) to (go to |goto |go |head |)(northeast|ne)$/,
    GoIn: /^(go to |goto |go |head |)(in|in|enter|i)$/,
    NpcGoIn1: /^(.+), ?(go to |goto |go |head |)(in|in|enter|i)$/,
    NpcGoIn2: /^tell (.+) to (go to |goto |go |head |)(in|in|enter|i)$/,
    GoUp: /^(go to |goto |go |head |)(up|u)$/,
    NpcGoUp1: /^(.+), ?(go to |goto |go |head |)(up|u)$/,
    NpcGoUp2: /^tell (.+) to (go to |goto |go |head |)(up|u)$/,
    GoWest: /^(go to |goto |go |head |)(west|w)$/,
    NpcGoWest1: /^(.+), ?(go to |goto |go |head |)(west|w)$/,
    NpcGoWest2: /^tell (.+) to (go to |goto |go |head |)(west|w)$/,
    GoEast: /^(go to |goto |go |head |)(east|e)$/,
    NpcGoEast1: /^(.+), ?(go to |goto |go |head |)(east|e)$/,
    NpcGoEast2: /^tell (.+) to (go to |goto |go |head |)(east|e)$/,
    GoOut: /^(go to |goto |go |head |)(out|out|exit|o)$/,
    NpcGoOut1: /^(.+), ?(go to |goto |go |head |)(out|out|exit|o)$/,
    NpcGoOut2: /^tell (.+) to (go to |goto |go |head |)(out|out|exit|o)$/,
    GoDown: /^(go to |goto |go |head |)(down|dn|d)$/,
    NpcGoDown1: /^(.+), ?(go to |goto |go |head |)(down|dn|d)$/,
    NpcGoDown2: /^tell (.+) to (go to |goto |go |head |)(down|dn|d)$/,
    GoSouthwest: /^(go to |goto |go |head |)(southwest|sw)$/,
    NpcGoSouthwest1: /^(.+), ?(go to |goto |go |head |)(southwest|sw)$/,
    NpcGoSouthwest2: /^tell (.+) to (go to |goto |go |head |)(southwest|sw)$/,
    GoSouth: /^(go to |goto |go |head |)(south|s)$/,
    NpcGoSouth1: /^(.+), ?(go to |goto |go |head |)(south|s)$/,
    NpcGoSouth2: /^tell (.+) to (go to |goto |go |head |)(south|s)$/,
    GoSoutheast: /^(go to |goto |go |head |)(southeast|se)$/,
    NpcGoSoutheast1: /^(.+), ?(go to |goto |go |head |)(southeast|se)$/,
    NpcGoSoutheast2: /^tell (.+) to (go to |goto |go |head |)(southeast|se)$/,

    // ----------------------------------------------------------------------------------------------
    // SUCCESSFUL Messages

    take_successful: function (char, item, count) {
      return lang.nounVerb(char, 'take', true) + ' ' + item.byname({ article: DEFINITE, count: count }) + '.'
    },
    drop_successful: function (char, item, count) {
      return lang.nounVerb(char, 'drop', true) + ' ' + item.byname({ article: DEFINITE, count: count }) + '.'
    },
    wear_successful: function (char, item) {
      return lang.nounVerb(char, 'put', true) + ' on ' + item.byname({ article: DEFINITE }) + '.'
    },
    remove_successful: function (char, item) {
      return lang.nounVerb(char, 'take', true) + ' ' + item.byname({ article: DEFINITE }) + ' off.'
    },
    open_successful: function (char, item) {
      return lang.nounVerb(char, 'open', true) + ' ' + item.byname({ article: DEFINITE }) + '.'
    },
    close_successful: function (char, item) {
      return lang.nounVerb(char, 'close', true) + ' ' + item.byname({ article: DEFINITE }) + '.'
    },
    lock_successful: function (char, item) {
      return lang.nounVerb(char, 'lock', true) + 'k ' + item.byname({ article: DEFINITE }) + '.'
    },
    unlock_successful: function (char, item) {
      return lang.nounVerb(char, 'unlock', true) + ' ' + item.byname({ article: DEFINITE }) + '.'
    },
    fill_successful: function (char, item) {
      return lang.nounVerb(char, 'fill', true) + ' ' + item.byname({ article: DEFINITE }) + '.'
    },
    empty_successful: function (char, item) {
      return lang.nounVerb(char, 'empty', true) + ' ' + item.byname({ article: DEFINITE }) + '.'
    },
    turn_on_successful: function (char, item) {
      return lang.nounVerb(char, 'switch', true) + ' ' + item.byname({ article: DEFINITE }) + ' on.'
    },
    turn_off_successful: function (char, item) {
      return lang.nounVerb(char, 'switch', true) + ' ' + item.byname({ article: DEFINITE }) + ' off.'
    },
    sit_on_successful: function (char, item) {
      return lang.nounVerb(char, 'sit', true) + ' on ' + item.byname({ article: DEFINITE }) + '.'
    },
    stand_on_successful: function (char, item) {
      return lang.nounVerb(char, 'stand', true) + ' on ' + item.byname({ article: DEFINITE }) + '.'
    },
    recline_on_successful: function (char, item) {
      return lang.nounVerb(char, 'lie', true) + ' down on ' + item.byname({ article: DEFINITE }) + '.'
    },
    eat_successful: function (char, item) {
      return lang.nounVerb(char, 'eat', true) + ' ' + item.byname({ article: DEFINITE }) + '.'
    },
    drink_successful: function (char, item) {
      return lang.nounVerb(char, 'drink', true) + ' ' + item.byname({ article: DEFINITE }) + '.'
    },
    purchase_successful: function (char, item, amt) {
      return lang.nounVerb(char, 'buy', true) + ' ' + item.byname({ article: DEFINITE }) + ' for ' + displayMoney(amt) + '.'
    },
    sell_successful: function (char, item, amt) {
      return lang.nounVerb(char, 'sell', true) + ' ' + item.byname({ article: DEFINITE }) + ' for ' + displayMoney(amt) + '.'
    },
    push_exit_successful: function (char, item, dir, destRoom) {
      return lang.nounVerb(char, 'push', true) + ' ' + item.byname({ article: DEFINITE }) + ' ' + dir + '.'
    },

    npc_heading: function (char, dir) {
      return lang.nounVerb(char, 'head', true) + ' ' + dir + '.'
    },

    // ----------------------------------------------------------------------------------------------
    // Cannot Messages

    cannot_take: function (char, item) {
      return lang.nounVerb(char, "can't", true) + ' take ' + item.pronouns.objective + '.'
    },
    cannot_wear: function (char, item) {
      return lang.nounVerb(char, "can't", true) + ' wear ' + item.pronouns.objective + '.'
    },
    cannot_wear_ensemble: function (char, item) {
      return 'Individual parts of an ensemble must be worn and removed separately.'
    },
    cannot_switch_on: function (char, item) {
      return lang.nounVerb(char, "can't", true) + ' turn ' + item.pronouns.objective + ' on.'
    },
    cannot_switch_off: function (char, item) {
      return lang.nounVerb(char, "can't", true) + ' turn ' + item.pronouns.objective + ' off.'
    },
    cannot_open: function (char, item) {
      return lang.nounVerb(item, "can't", true) + ' be opened.'
    },
    cannot_close: function (char, item) {
      return lang.nounVerb(item, "can't", true) + ' be closed.'
    },
    cannot_lock: function (char, item) {
      return lang.nounVerb(char, "can't", true) + 't lock ' + item.pronouns.objective + '.'
    },
    cannot_unlock: function (char, item) {
      return lang.nounVerb(char, "can't", true) + ' unlock ' + item.pronouns.objective + '.'
    },
    cannot_read: function (char, item) {
      return 'Nothing worth reading there.'
    },

    cannot_purchase: function (char, item) {
      return lang.nounVerb(char, "can't", true) + ' buy ' + item.pronouns.objective + '.'
    },
    cannot_purchase_here: function (char, item) {
      if (item.doNotClone && item.isAtLoc(char.name)) {
        return lang.nounVerb(char, "can't", true) + ' buy ' + item.byname({ article: DEFINITE }) + ' here - probably because ' + lang.nounVerb(char, 'be') + ' already holding ' + item.pronouns.objective + '.'
      } else {
        return lang.nounVerb(char, "can't", true) + ' buy ' + item.byname({ article: DEFINITE }) + ' here.'
      }
    },
    cannot_afford: function (char, item, amt) {
      return lang.nounVerb(char, "can't", true) + ' afford ' + item.byname({ article: DEFINITE }) + ' (need ' + displayMoney(amt) + ').'
    },
    cannot_sell: function (char, item, amt) {
      return lang.nounVerb(char, "can't", true) + ' sell ' + item.pronouns.objective + '.'
    },
    cannot_sell_here: function (char, item, amt) {
      return lang.nounVerb(char, "can't", true) + ' sell ' + item.byname({ article: DEFINITE }) + ' here.'
    },

    cannot_use: function (char, item) {
      return 'No obvious way to use ' + item.pronouns.objective + '.'
    },
    cannot_smash: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not something you can break.'
    },
    cannot_fill: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not something you can fill.'
    },
    cannot_mix: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not something you can mix liquids in.'
    },
    cannot_empty: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not something you can empty.'
    },
    cannot_look_out: function (char, item) {
      return lang.pronounVerb(char, "can't", true) + ' look out of ' + item.pronouns.objective + '.'
    },
    cannot_stand_on: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not something you can stand on.'
    },
    cannot_sit_on: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not something you can sit on.'
    },
    cannot_recline_on: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not something you can lie on.'
    },

    cannot_eat: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not something you can eat.'
    },
    cannot_drink: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not something you can drink.'
    },
    cannot_ingest: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not something you can ingest.'
    },
    cannot_push: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not something you can move around like that.'
    },
    cannot_push_up: function (char, item) {
      return lang.pronounVerb(char, "'be", true) + ' not getting ' + item.byname({ article: DEFINITE }) + ' up there!'
    },
    cannot_ask_about: function (char, item, text) {
      return 'You can ask ' + item.pronouns.objective + ' about ' + text + ' all you like, but ' + lang.pronounVerb(item, "'be") + ' not about to reply.'
    },
    cannot_tell_about: function (char, item, text) {
      return 'You can tell ' + item.pronouns.objective + ' about ' + text + ' all you like, but ' + lang.pronounVerb(item, "'be") + ' not interested.'
    },
    cannot_talk_to: function (char, item) {
      return 'You chat to ' + item.byname({ article: DEFINITE }) + ' for a few moments, before releasing that ' + lang.pronounVerb(item, "'be") + ' not about to reply.'
    },

    // ----------------------------------------------------------------------------------------------
    // General command messages

    not_known_msg: "I don't even know where to begin with that.",
    disambig_msg: 'Which do you mean?',
    no_multiples_msg: 'You cannot use multiple objects with that command.',
    nothing_msg: 'Nothing there to do that with.',
    general_obj_error: 'So I kind of get what you want to do, but not what you want to do it with.',
    done_msg: 'Done.',
    nothing_for_sale: 'Nothing for sale here.',
    wait_msg: 'You wait one turn.',
    no_map: 'Sorry, no map available.',
    inventoryPreamble: 'You are carrying',

    no_smell: function (char) {
      return lang.nounVerb(char, "can't", true) + ' smell anything here.'
    },
    no_listen: function (char) {
      return lang.nounVerb(char, "can't", true) + ' hear anything of note here.'
    },
    nothing_there: function (char) {
      return lang.nounVerb(char, 'be', true) + " sure there's nothing there."
    },
    nothing_inside: function (char) {
      return "There's nothing to see inside."
    },
    not_that_way: function (char, dir) {
      return lang.nounVerb(char, "can't", true) + ' go ' + dir + '.'
    },
    object_unknown_msg: function (name) {
      return lang.nounVerb(game.player, "can't", true) + " see anything you might call '" + name + "' here."
    },

    not_here: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not here.'
    },
    char_has_it: function (char, item) {
      return lang.nounVerb(char, 'have', true) + ' ' + item.pronouns.objective + '.'
    },
    none_here: function (char, item) {
      return "There's no " + item.pluralAlias + ' here.'
    },
    none_held: function (char, item) {
      return pronoun(char, 'have', true) + ' no ' + item.pluralAlias + '.'
    },
    TAKE_not_push: function (char, item) {
      return 'Just pick the thing up already!'
    },

    nothing_useful: function (char, item) {
      return "That's not going to do anything useful."
    },
    already: function (item) {
      return sentenceCase(item.pronouns.subjective) + ' already ' + lang.conjugate(item, 'be') + '.'
    },
    default_examine: function (char, item) {
      return lang.pronounVerb(item, 'be', true) + ' just your typical, every day ' + item.byname() + '.'
    },
    no_topics: function (char, target) {
      return lang.nounVerb(char, 'have', true) + ' nothing to talk to ' + target.byname({ article: DEFINITE }) + ' about.'
    },
    say_no_one_here: function (char, verb, text) {
      return lang.nounVerb(char, verb, true) + ", '" + sentenceCase(text) + ",' but no one notices."
    },
    say_no_response: function (char, verb, text) {
      return 'No one seemed interested in what you say.'
    },
    say_no_response_full: function (char, verb, text) {
      return lang.nounVerb(char, verb, true) + ", '" + sentenceCase(text) + ",' but no one seemed interested in what you say."
    },

    container_recursion: function (char, container, item) {
      return 'What? You want to put ' + item.byname({ article: DEFINITE }) + ' in ' + container.byname({ article: DEFINITE }) + ' when ' + container.byname({ article: DEFINITE }) + ' is already in ' + item.byname({ article: DEFINITE }) + "? That's just too freaky for me."
    },

    // ----------------------------------------------------------------------------------------------
    // Specific command messages

    not_npc: function (item) {
      return lang.nounVerb(game.player, 'can', true) + ' tell ' + item.byname({ article: DEFINITE }) + ' to do what you like, but there is no way ' + lang.pronounVerb(item, "'ll") + ' do it.'
    },
    not_npc_for_give: function (char, item) {
      return 'Realistically, ' + lang.nounVerb(item, 'be') + ' not interested in anything ' + char.pronouns.subjective + ' might give ' + item.pronouns.objective + '.'
    },
    not_able_to_hear: function (char, item) {
      return 'Doubtful ' + lang.nounVerb(item, 'will') + ' be interested in anything ' + char.pronouns.subjective + ' has to say.'
    },
    not_container: function (char, item) {
      return sentenceCase(item.byname({ article: DEFINITE })) + ' is not a container.'
    },
    not_vessel: function (char, item) {
      return sentenceCase(item.byname({ article: DEFINITE })) + ' is not a vessel.'
    },

    not_carrying: function (char, item) {
      return lang.pronounVerb(char, "don't", true) + ' have ' + item.pronouns.objective + '.'
    },
    not_inside: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' not inside that.'
    },
    wearing: function (char, item) {
      return lang.pronounVerb(char, "'be", true) + ' wearing ' + item.pronouns.objective + '.'
    },
    not_wearing: function (char, item) {
      return lang.pronounVerb(char, "'be", true) + ' not wearing ' + item.pronouns.objective + '.'
    },
    cannot_wear_over: function (char, item, outer) {
      return lang.pronounVerb(char, "can't", true) + ' put ' + item.byname({ article: INDEFINITE }) + ' on over ' + char.pronouns.poss_adj + ' ' + outer.byname() + '.'
    },
    cannot_remove_under: function (char, item, outer) {
      return lang.pronounVerb(char, "can't", true) + ' take off ' + char.pronouns.poss_adj + ' ' + item.byname() + ' whilst wearing ' + char.pronouns.poss_adj + ' ' + outer.byname() + '.'
    },
    already_have: function (char, item) {
      return lang.pronounVerb(char, "'ve", true) + ' got ' + item.pronouns.objective + ' already.'
    },
    already_wearing: function (char, item) {
      return lang.pronounVerb(char, "'ve", true) + ' already wearing ' + item.pronouns.objective + '.'
    },
    cannot_take_component: function (char, item) {
      return lang.nounVerb(char, "can't", true) + ' take ' + item.pronouns.objective + '; ' + lang.pronounVerb(item, "'be") + ' part of ' + w[item.loc].byname({ article: DEFINITE }) + '.'
    },
    container_closed: function (char, item) {
      return lang.nounVerb(item, 'be', true) + ' closed.'
    },
    inside_container: function (char, item, cont) {
      return lang.pronounVerb(item, 'be', true) + ' inside ' + cont.byname({ article: DEFINITE }) + '.'
    },
    look_inside: function (char, item) {
      const l = formatList(item.getContents(display.LOOK), { article: INDEFINITE, lastJoiner: ' and ', nothing: 'nothing' });
      return 'Inside ' + item.byname({ article: DEFINITE }) + ' ' + lang.pronounVerb(char, 'can') + ' see ' + l + '.'
    },
    stop_posture: function (char) {
      if (!char.posture || char.posture === 'standing') return ''
      let s;
      // You could split up sitting, standing and lying
      if (char.postureFurniture) {
        s = lang.nounVerb(char, 'get', true) + ' off ' + w[char.postureFurniture].byname({ article: DEFINITE }) + '.';
      } else {
        s = lang.nounVerb(char, 'stand', true) + ' up.';
      }
      char.posture = undefined;
      char.postureFurniture = undefined;
      return s
    },
    can_go: function () {
      return 'You think you can go {exits}.'
    },

    // ----------------------------------------------------------------------------------------------
    // NPC messages

    npc_nothing_to_say_about: function (char) {
      return lang.nounVerb(char, 'have', true) + ' nothing to say on the subject.'
    },
    npc_no_interest_in: function (char) {
      return lang.nounVerb(char, 'have', true) + ' no interest in that subject.'
    },

    // If the player does SPEAK TO MARY and Mary has some topics, this will be the menu title.
    speak_to_menu_title: function (char) {
      return 'Talk to ' + char.byname({ article: DEFINITE }) + ' about:'
    },
    // If the player does TELL MARY ABOUT HOUSE this will appear before the response.
    tell_about_intro: function (char, text1, text2) {
      return 'You tell ' + char.byname({ article: DEFINITE }) + ' ' + text2 + ' ' + text1 + '.'
    },
    // If the player does ASK MARY ABOUT HOUSE this will appear before the response.
    ask_about_intro: function (char, text1, text2) {
      return 'You ask ' + char.byname({ article: DEFINITE }) + ' ' + text2 + ' ' + text1 + '.'
    },
    // This will be added to the start of the regex of a command to make an NPC command
    // The saved capture group is the NPC's name
    tell_to_prefixes: {
      1: '(?:tell|ask) (.+) to ', // TELL KYLE TO GET SPOON
      2: '(.+), ?' // KYLE, GET SPOON
    },

    // ----------------------------------------------------------------------------------------------
    // Door and lock fails

    locked: function (char, item) {
      return lang.pronounVerb(item, "'be", true) + ' locked.'
    },
    no_key: function (char, item) {
      return lang.nounVerb(char, 'do', true) + ' have the right key.'
    },
    locked_exit: function (char, exit) {
      return 'That way is locked.'
    },
    open_and_enter: function (char, doorName) {
      return lang.nounVerb(char, 'open', true) + ' the ' + doorName + ' and walk through.'
    },
    unlock_and_enter: function (char, doorName) {
      return lang.nounVerb(char, 'unlock', true) + ' the ' + doorName + ', open it and walk through.'
    },
    try_but_locked: function (char, doorName) {
      return lang.nounVerb(char, 'try', true) + ' the ' + doorName + ', but it is locked.'
    },

    // Use when the NPC leaves a room; will give a message if the player can observe it
    npcLeavingMsg: function (npc, dest) {
      let s = '';
      let flag = false;
      if (w[game.player.loc].canViewLocs && w[game.player.loc].canViewLocs.includes(npc.loc)) {
        s = w[game.player.loc].canViewPrefix;
        flag = true;
      }
      if (flag || npc.here()) {
        s += lang.nounVerb(npc, 'leave', !flag) + ' ' + w[npc.loc].byname({ article: DEFINITE });
        const exit = w[npc.loc].findExit(dest);
        if (exit) s += ', heading ' + exit.dir;
        s += '.';
        msg(s);
      }
    },

    // the NPC has already been moved, so npc.loc is the destination
    npcEnteringMsg: function (npc, origin) {
      let s = '';
      let flag = false;
      if (w[game.player.loc].canViewLocs && w[game.player.loc].canViewLocs.includes(npc.loc)) {
        // Can the player see the location the NPC enters, from another location?
        s = w[game.player.loc].canViewPrefix;
        flag = true;
      }
      if (flag || npc.here()) {
        s += lang.nounVerb(npc, 'enter', !flag) + ' ' + w[npc.loc].byname({ article: DEFINITE });
        const exit = w[npc.loc].findExit(origin);
        if (exit) s += ' from ' + util.niceDirections(exit.dir);
        s += '.';
        msg(s);
      }
    },

    // ----------------------------------------------------------------------------------------------
    // Save/load messages

    sl_dir_headings: '<tr><th>Filename</th><th>Ver</th><th>Timestamp</th><th>Comment</th></tr>',
    sl_dir_msg: 'Ver is the version of the game that was being played when saved. Loading a save game from a different version may or may not work. You can delete a file with the DEL command.',
    sl_no_filename: 'Trying to save with no filename',

    // ----------------------------------------------------------------------------------------------
    // Meta-messages

    topics_no_ask_tell: 'This character has no ASK/ABOUT or TELL/ABOUT options set up.',
    topics_none_found: function (char) {
      return 'No suggestions for what to ask or tell ' + char.byname({ article: DEFINITE }) + ' available.'
    },
    topics_ask_list: function (char, arr) {
      return 'Some suggestions for what to ask ' + char.byname({ article: DEFINITE }) + ' about: ' + arr.join('; ') + '.'
    },
    topics_tell_list: function (char, arr) {
      return 'Some suggestions for what to tell ' + char.byname({ article: DEFINITE }) + ' about: ' + arr.join('; ') + '.'
    },

    spoken_on: "Game mode is now 'spoken'. Type INTRO to hear the introductory text.",
    spoken_off: "Game mode is now 'unspoken'.",
    mode_brief: "Game mode is now 'brief'; no room descriptions (except with LOOK).",
    mode_terse: "Game mode is now 'terse'; room descriptions only shown on first entering and with LOOK.",
    mode_verbose: "Game mode is now 'verbose'; room descriptions shown every time you enter a room.",
    transcript_already_on: 'Transcript is already turned on.',
    transcript_already_off: 'Transcript is already turned off.',
    undo_disabled: 'Sorry, UNDO is not enabled in this game.',
    undo_not_available: 'There are no saved game-states to UNDO back to.',
    undo_done: 'Undoing...',

    helpScript: function () {
      if (settings.textInput) {
        metamsg('Type commands in the command bar to interact with the world.');
        metamsg("You can often just type the first few characters of an item's name and Quest will guess what you mean. You can use the up and down arrows to scroll back though your previous commands - especially useful if you realise you spelled something wrong.");
        metamsg("{b:Movement:} To move, use the eight compass directions (or just 'n', 'ne', etc.). Up/down and in/out may be options too. When \"Num Lock\" is on, you can use the number pad for all eight compass directions, and + and - for UP and DOWN.");
        metamsg('{b:Using items:} You can also LOOK, HELP or WAIT. Other commands are generally of the form GET HAT or PUT THE BLUE TEAPOT IN THE ANCIENT CHEST. Experiment and see what you can do!');
        metamsg("{b:Language: }You can use ALL and ALL BUT with some commands, for example TAKE ALL, and PUT ALL BUT SWORD IN SACK. You can also use pronouns, so LOOK AT MARY, then TALK TO HER. The pronoun will refer to the last subject in the last successful command, so after PUT HAT AND FUNNY STICK IN THE DRAWER, 'IT' will refer to the funny stick (the hat and the stick are subjects of the sentence, the drawer was the object).");
        metamsg('{b:Characters: }If you come across another character, you can ask him or her to do something. Try things like MARY,PUT THE HAT INTHE BOX, or TELL MARY TO GET ALL BUT THE KNIFE. Depending on the game you may be able to TALK TO a character, to ASK or TELL a character ABOUT a topic, or just SAY something and they will respond..');
      }
      if (settings.panes !== 'None') {
        if (settings.compass) {
          metamsg("Use the compass rose at the top to move around. Click 'Lk' to look at you current location, 'Z' to wait or '?' for help.");
        }
        metamsg('To interact with an object, click on it, and a set of possible actions will appear under it. Click on the appropriate action.');
      }
      return SUCCESS_NO_TURNSCRIPTS
    },

    aboutScript: function () {
      metamsg('{i:{param:settings:title} version {param:settings:version}} was written by {param:settings:author} using Quest 6.', { settings: settings });
      if (settings.thanks && settings.thanks.length > 0) {
        metamsg('Thanks to ' + formatList(settings.thanks, { lastJoiner: lang.list_and }) + '.');
      }
      return SUCCESS_NO_TURNSCRIPTS
    },

    saveLoadScript: function () {
      metamsg('To save your progress, type SAVE followed by the name to save with.');
      metamsg('To load your game, refresh/reload this page in your browser, then type LOAD followed by the name you saved with.');
      metamsg('To see a list of save games, type DIR.');
      return SUCCESS_NO_TURNSCRIPTS
    },

    transcriptScript: function () {
      metamsg('The TRANSCRIPT or SCRIPT command can be used to handle saving the input and output.');
      metamsg('Use SCRIPT ON to turn on recording and SCRIPT OFF to turn it off. Use SCRIPT SHOW to display it. To empty the file, use SCRIPT CLEAR.');
      metamsg('You can add options to the SCRIPT SHOW to hide various types of text. Use M to hide meta-information (like this), I to hide your input, P to hide parser errors (when the parser says it has no clue what you mean), E to hide programming errors and D to hide debugging messages. These can be combined, so SCRIPT SHOW ED will hide programming errors and debugging messages, and SCRIPT SHOW EDPID will show only the output game text.');
      metamsg('Everything gets saved to memory, and will be lost if you go to another web page or close your browser, but should be saved when you save your game. You can only have one transcript dialog window open at a time.');
      return SUCCESS_NO_TURNSCRIPTS
    },

    topicsScript: function () {
      metamsg('Use TOPICS FOR [name] to see a list of topic suggestions to ask a character about (if implemented in this game).');
      return SUCCESS_NO_TURNSCRIPTS
    },

    // ----------------------------------------------------------------------------------------------
    //                                   DATA

    // Misc

    list_and: ' and ',
    list_nothing: 'nothing',
    list_or: ' or ',
    list_nowhere: 'nowhere',
    never_mind: 'Never mind.',
    default_description: "It's just scenery.",
    click_to_continue: 'Click to continue...',
    buy: 'Buy', // used in the command link in the purchase table
    buy_headings: ['Item', 'Cost', ''],
    current_money: 'Current money',

    article_filter_regex: /^(?:the |an |a )?(.+)$/,
    joiner_regex: /,|\band\b/,
    all_regex: /^(all|everything)$/,
    all_exclude_regex: /^((all|everything) (but|bar|except)\b)/,
    go_pre_regex: 'go to |goto |go |head |',

    yesNo: ['Yes', 'No'],

    contentsForData: {
      surface: { prefix: 'with ', suffix: ' on it' },
      container: { prefix: 'containing ', suffix: '' }
    },

    // ----------------------------------------------------------------------------------------------
    // Language constructs

    pronouns: {
      thirdperson: { subjective: 'it', objective: 'it', possessive: 'its', poss_adj: 'its', reflexive: 'itself' },
      massnoun: { subjective: 'it', objective: 'it', possessive: 'its', poss_adj: 'its', reflexive: 'itself' },
      male: { subjective: 'he', objective: 'him', possessive: 'his', poss_adj: 'his', reflexive: 'himself' },
      female: { subjective: 'she', objective: 'her', possessive: 'hers', poss_adj: 'her', reflexive: 'herself' },
      plural: { subjective: 'they', objective: 'them', possessive: 'theirs', poss_adj: 'their', reflexive: 'themselves' },
      firstperson: { subjective: 'I', objective: 'me', possessive: 'mine', poss_adj: 'my', reflexive: 'myself', possessive_name: 'my' },
      secondperson: { subjective: 'you', objective: 'you', possessive: 'yours', poss_adj: 'your', reflexive: 'yourself', possessive_name: 'your' }
    },

    // Display verbs used in the side panel
    verbs: {
      examine: 'Examine',
      use: 'Use',
      take: 'Take',
      drop: 'Drop',
      open: 'Open',
      close: 'Close',
      switchon: 'Switch on',
      switchoff: 'Switch off',
      wear: 'Wear',
      remove: 'Remove',
      lookat: 'Look at',
      talkto: 'Talk to',
      eat: 'Eat',
      drink: 'Drink',
      read: 'Read'
    },

    // Change the abbrev values to suit your game (or language)
    // You may want to do that in settings, which is loaded first
    // One time we need var rather than const/let!
    exit_list: [
      { name: 'northwest', abbrev: 'NW', niceDir: 'the northwest', key: 103 },
      { name: 'north', abbrev: 'N', niceDir: 'the north', key: 104 },
      { name: 'northeast', abbrev: 'NE', niceDir: 'the northeast', key: 105 },
      { name: 'in', abbrev: 'In', alt: 'enter|i', niceDir: 'inside' },
      { name: 'up', abbrev: 'U', niceDir: 'above', key: 107 },

      { name: 'west', abbrev: 'W', niceDir: 'the west', key: 100 },
      { name: 'Look', abbrev: 'Lk', nocmd: true, key: 101 },
      { name: 'east', abbrev: 'E', niceDir: 'the east', key: 102 },
      { name: 'out', abbrev: 'Out', alt: 'exit|o', niceDir: 'outside' },
      { name: 'down', abbrev: 'Dn', alt: 'd', niceDir: 'below', key: 109 },

      { name: 'southwest', abbrev: 'SW', niceDir: 'the southwest', key: 97 },
      { name: 'south', abbrev: 'S', niceDir: 'the south', key: 98 },
      { name: 'southeast', abbrev: 'SE', niceDir: 'the southeast', key: 99 },
      { name: 'Wait', abbrev: 'Z', nocmd: true, key: 110 },
      { name: 'Help', abbrev: '?', nocmd: true }
    ],

    numberUnits: 'zero;one;two;three;four;five;six;seven;eight;nine;ten;eleven;twelve;thirteen;fourteen;fifteen;sixteen;seventeen;eighteen;nineteen;twenty'.split(';'),
    numberTens: 'twenty;thirty;forty;fifty;sixty;seventy;eighty;ninety'.split(';'),

    ordinalReplacements: [
      { regex: /one$/, replace: 'first' },
      { regex: /two$/, replace: 'second' },
      { regex: /three$/, replace: 'third' },
      { regex: /five$/, replace: 'fifth' },
      { regex: /eight$/, replace: 'eighth' },
      { regex: /nine$/, replace: 'ninth' },
      { regex: /twelve$/, replace: 'twelfth' },
      { regex: /y$/, replace: 'ieth' }
    ],

    conjugations: {
      i: [
        { name: 'be', value: 'am' },
        { name: "'be", value: "'m" }
      ],
      you: [
        { name: 'be', value: 'are' },
        { name: "'be", value: "'re" }
      ],
      we: [
        { name: 'be', value: 'are' },
        { name: "'be", value: "'re" }
      ],
      they: [
        { name: 'be', value: 'are' },
        { name: "'be", value: "'re" }
      ],
      it: [
        { name: 'be', value: 'is' },
        { name: 'have', value: 'has' },
        { name: 'can', value: 'can' },
        { name: 'mould', value: 'moulds' },
        { name: '*ould', value: 'ould' },
        { name: 'must', value: 'must' },
        { name: "don't", value: "doesn't" },
        { name: "can't", value: "can't" },
        { name: "won't", value: "won't" },
        { name: 'cannot', value: 'cannot' },
        { name: "@n't", value: "n't" },
        { name: "'ve", value: "'s" },
        { name: "'be", value: "'s" },
        { name: '*ay', value: 'ays' },
        { name: '*uy', value: 'uys' },
        { name: '*oy', value: 'oys' },
        { name: '*ey', value: 'eys' },
        { name: '*y', value: 'ies' },
        { name: '*ss', value: 'sses' },
        { name: '*s', value: 'sses' },
        { name: '*sh', value: 'shes' },
        { name: '*ch', value: 'ches' },
        { name: '*o', value: 'oes' },
        { name: '*x', value: 'xes' },
        { name: '*z', value: 'zes' },
        { name: '*', value: 's' }
      ]
    },

    // ----------------------------------------------------------------------------------------------
    //                                   LANGUAGE FUNCTIONS

    // @DOC
    // ## Language Functions
    // @UNDOC

    // @DOC
    // Returns "the " if appropriate for this item.
    // If the item has 'defArticle' it returns that; if it has a proper name, returns an empty string.
    addDefiniteArticle: function (item) {
      if (item.defArticle) {
        return item.defArticle + ' '
      }
      return item.properName ? '' : 'the '
    },

    // @DOC
    // Returns "a " or "an " if appropriate for this item.
    // If the item has 'indefArticle' it returns that; if it has a proper name, returns an empty string.
    // If it starts with a vowel, it returns "an ", otherwise "a ".
    addIndefiniteArticle: function (item) {
      if (item.indefArticle) {
        return item.indefArticle + ' '
      }
      if (item.properName) {
        return ''
      }
      if (item.pronouns === lang.pronouns.plural) {
        return 'some '
      }
      if (item.pronouns === lang.pronouns.massnoun) {
        return ''
      }
      if (/^[aeiou]/i.test(item.alias)) {
        return 'an '
      }
      return 'a '
    },

    // @DOC
    // Returns the given number in words, so 19 would be returned as 'nineteen'.
    // Numbers uner -2000 and over 2000 are returned as a string of digits,
    // so 2001 is returned as '2001'.
    toWords: function (number) {
      if (typeof number !== 'number') {
        errormsg('toWords can only handle numbers');
        return number
      }

      let s = '';
      if (number < 0) {
        s = 'minus ';
        number = -number;
      }
      if (number < 2000) {
        const hundreds = Math.floor(number / 100);
        number = number % 100;
        if (hundreds > 0) {
          s = s + lang.numberUnits[hundreds] + ' hundred ';
          if (number > 0) {
            s = s + 'and ';
          }
        }
        if (number < 20) {
          if (number !== 0 || s === '') {
            s = s + lang.numberUnits[number];
          }
        } else {
          const units = number % 10;
          const tens = Math.floor(number / 10) % 10;
          s = s + lang.numberTens[tens - 2];
          if (units !== 0) {
            s = s + lang.numberUnits[units];
          }
        }
      } else {
        s = number.toString();
      }
      return (s)
    },

    // @DOC
    // Returns the given number in words as the ordinal, so 19 would be returned as 'nineteenth'.
    // Numbers uner -2000 and over 2000 are returned as a string of digits with 'th' appended,
    // so 2001 is returned as '2001th'.
    toOrdinal: function (number) {
      if (typeof number !== 'number') {
        errormsg('toOrdinal can only handle numbers');
        return number
      }

      const s = lang.toWords(number);
      for (const or of lang.ordinalReplacements) {
        if (or.regex.test(s)) {
          return s.replace(or.regex, or.replace)
        }
      }
      return (s + 'th')
    },

    convertNumbers: function (s) {
      for (let i = 0; i < lang.numberUnits.length; i++) {
        const regex = new RegExp('\\b' + lang.numberUnits[i] + '\\b');
        if (regex.test(s)) s = s.replace(regex, '' + i);
      }
      return s
    },

    // ----------------------------------------------------------------------------------------------
    // Conjugating

    // @DOC
    // Returns the verb properly conjugated for the item, so "go" with a ball would return
    // "goes", but "go" with the player (if using second person pronouns).
    conjugate: function (item, verb) {
      let gender = item.pronouns.subjective;
      if (gender === 'he' || gender === 'she') { gender = 'it'; }
      const arr = lang.conjugations[gender.toLowerCase()];

      if (!arr) {
        errormsg('No conjugations found: conjugations_' + gender.toLowerCase());
        return verb
      }
      for (const conj of arr) {
        if (conj.name === verb) {
          return conj.value
        }
      }

      for (const conj of arr) {
        const name = conj.name;
        const value = conj.value;
        if (name.startsWith('@') && verb.endsWith(name.substring(1))) {
          return lang.conjugate(item, verb.substring(0, verb.length - name.length + 1)) + value
        } else if (name.startsWith('*') && verb.endsWith(name.substring(1))) {
          return verb.substring(0, verb.length - name.length + 1) + value
        }
      }
      return verb
    },

    // @DOC
    // Returns the pronoun for the item, followed by the conjugated verb,
    // so "go" with a ball would return "it goes", but "go" with the player (if using second person pronouns)
    // would return "you go".
    // The first letter is capitalised if 'capitalise' is true.
    pronounVerb: function (item, verb, capitalise) {
      let s = item.pronouns.subjective + ' ' + lang.conjugate(item, verb);
      s = s.replace(/ +'/, "'"); // yes this is a hack!
      return capitalise ? sentenceCase(s) : s
    },

    pronounVerbForGroup: function (item, verb, capitalise) {
      let s = item.groupPronouns().subjective + ' ' + lang.conjugate(item.group(), verb);
      s = s.replace(/ +'/, "'"); // yes this is a hack!
      return capitalise ? sentenceCase(s) : s
    },

    verbPronoun: function (item, verb, capitalise) {
      let s = lang.conjugate(item, verb) + ' ' + item.pronouns.subjective;
      s = s.replace(/ +'/, "'"); // yes this is a hack!
      return capitalise ? sentenceCase(s) : s
    },

    // @DOC
    // Returns the name for the item, followed by the conjugated verb,
    // so "go" with a ball would return "the ball goes", but "go" with
    // a some bees would return "the bees go". For the player, (if using second person pronouns)
    // would return the pronoun "you go".
    // The first letter is capitalised if 'capitalise' is true.
    nounVerb: function (item, verb, capitalise) {
      if (item === game.player) {
        return lang.pronounVerb(item, verb, capitalise)
      }
      let s = item.byname({ article: DEFINITE }) + ' ' + lang.conjugate(item, verb);
      s = s.replace(/ +'/, "'"); // yes this is a hack!
      return capitalise ? sentenceCase(s) : s
    },

    verbNoun: function (item, verb, capitalise) {
      if (item === game.player) {
        return lang.pronounVerb(item, verb, capitalise)
      }
      let s = lang.conjugate(item, verb) + ' ' + item.byname({ article: DEFINITE });
      s = s.replace(/ +'/, "'"); // yes this is a hack!
      return capitalise ? sentenceCase(s) : s
    }
  };

  // Used by the editor
  // try { SUCCESS } catch (e) {
  //   module.exports = { lang: lang }
  // }

  // Should all be language neutral (except the inspect function, which is just for debugging)

  function Cmd (name, hash) {
    this.name = name;
    this.objects = [];
    this.rules = [];
    this.default = function (item, isMultiple, char) {
      if (typeof this.defmsg === 'string') {
        failedmsg(prefix(item, isMultiple) + this.defmsg);
      } else if (typeof this.defmsg === 'function') {
        failedmsg(prefix(item, isMultiple) + this.defmsg(char, item));
      } else {
        errormsg("No default set for command '" + this.name + "'.");
      }
      return false
    };

    // This is the default script for commands
    // Assumes a verb and an object; the verb may or may not be the first object
    this.script = function (objects, matches) {
      let success = false;
      let suppressEndturn = false;
      let verb;
      if (objects.length > 1) verb = objects.shift();
      const multi = objects[0].length > 1 || parser.currentCommand.all;
      for (let i = 0; i < objects[0].length; i++) {
        if (!objects[0][i][this.attName]) {
          this.default(objects[0][i], multi, game.player);
        } else {
          let result = this.processCommand(game.player, objects[0][i], multi, matches[0][i], verb);
          if (result === SUPPRESS_ENDTURN) {
            suppressEndturn = true;
            result = true;
          }
          success = result || success;
        }
      }
      if (success) {
        return (this.noTurnscripts || suppressEndturn ? SUCCESS_NO_TURNSCRIPTS : SUCCESS)
      } else {
        return FAILED
      }
    };

    this.processCommand = function (char, item, multi, match, verb) {
      for (const rule of this.rules) {
        if (typeof rule !== 'function') {
          errormsg("Failed to process command '" + this.name + "' as one of its rules is not a function (see console).");
          console.log('Failed:');
          console.log(this);
          console.log(rule);
        }
        if (!rule(this, char, item, multi)) {
          return false
        }
      }
      let result = printOrRun(char, item, this.attName, { multi: multi, match: match, verb: verb });
      if (typeof result !== 'boolean' && result !== SUPPRESS_ENDTURN) {
        // Assume the author wants to return true from './main.js'
        result = true;
      }
      return result
    };

    for (const key in hash) {
      this[key] = hash[key];
    }
    this.attName = this.attName ? this.attName : this.name.toLowerCase();
    for (const key in this.objects) {
      if (!this.objects[key].attName) {
        this.objects[key].attName = this.attName;
      }
    }
    if (!this.regex) this.regex = lang[this.name];
  }

  // Use only for NPC commands that you are not giving your
  // own custom script attribute. Commands must be an order to a single
  // NPC in the form verb-object.
  function NpcCmd (name, hash) {
    Cmd.call(this, name, hash);
    if (!this.cmdCategory) this.cmdCategory = name;
    this.script = function (objects) {
      const npc = objects[0][0];
      if (!npc.npc) {
        failedmsg(lang.not_npc(npc));
        return FAILED
      }
      let success = false;    if (objects.length !== 2) {
        errormsg('The command ' + name + ' is trying to use a facility for NPCs to do it, but there is no object list; this facility is only for commands in the form verb-object.');
        return FAILED
      }
      const multi = (objects[1].length > 1 || parser.currentCommand.all);
      for (const obj of objects[1]) {
        if (npc['getAgreement' + this.cmdCategory] && !npc['getAgreement' + this.cmdCategory](obj, this.name)) {
          // The getAgreement should give the response
          continue
        }
        if (!npc['getAgreement' + this.cmdCategory] && npc.getAgreement && !npc.getAgreement(this.cmdCategory, obj)) {
          continue
        }
        if (!obj[this.attName]) {
          this.default(obj, multi, npc);
        } else {
          let result = this.processCommand(npc, obj, multi);
          if (result === SUPPRESS_ENDTURN) {
            result = true;
          }
          success = result || success;
        }
      }
      if (success) {
        npc.pause();
        return (this.noTurnscripts ? SUCCESS_NO_TURNSCRIPTS : SUCCESS)
      } else {
        return FAILED
      }
    };
  }

  function ExitCmd (name, dir, hash) {
    Cmd.call(this, name, hash);
    this.exitCmd = true;
    this.dir = dir;
    this.objects = [{ ignore: true }, { ignore: true }];
    this.script = function (objects) {
      if (!game.room.hasExit(this.dir)) {
        failedmsg(lang.not_that_way(game.player, this.dir));
        return FAILED
      } else {
        const ex = game.room[this.dir];
        if (typeof ex === 'object') {
          if (!game.player.canMove(ex, this.dir)) {
            return FAILED
          }
          const flag = ex.use(game.player, this.dir);
          if (typeof flag !== 'boolean') {
            errormsg('Exit failed to return a Boolean value, indicating success of failure; assuming success');
            return SUCCESS
          }
          return flag ? SUCCESS : FAILED
        } else {
          errormsg('Unsupported type for direction');
          return FAILED
        }
      }
    };
  }

  function NpcExitCmd (name, dir, hash) {
    Cmd.call(this, name, hash);
    this.exitCmd = true;
    this.dir = dir;
    this.objects = [{ scope: parser.isHere, attName: 'npc' }, { ignore: true }, { ignore: true }];
    this.script = function (objects) {
      const npc = objects[0][0];
      if (!game.room.hasExit(this.dir)) {
        failedmsg(lang.not_that_way(npc, this.dir));
        return FAILED
      }
      if (!npc.canMove(game.room[this.dir], this.dir)) {
        return FAILED
      }
      if (npc.getAgreementGo && !npc.getAgreementGo(dir)) {
        return FAILED
      }
      if (!npc.getAgreementGo && npc.getAgreement && !npc.getAgreement('Go', dir)) {
        return FAILED
      } else {
        const ex = game.room[this.dir];
        if (typeof ex === 'object') {
          const flag = ex.use(npc, this.dir);
          if (flag) npc.pause();
          return flag ? SUCCESS : FAILED
        } else {
          errormsg('Unsupported type for direction');
          return FAILED
        }
      }
    };
  }

  function useWithDoor (char, dir) {
    const obj = w[this.door];
    if (obj === undefined) {
      errormsg("Not found an object called '" + this.door + "'. Any exit that uses the 'useWithDoor' function must also set a 'door' attribute.");
    }
    const doorName = this.doorName ? this.doorName : 'door';
    if (!obj.closed) {
      world.setRoom(char, this.name, dir);
      return true
    }
    if (!obj.locked) {
      obj.closed = false;
      msg(lang.open_and_enter(char, doorName));
      world.setRoom(char, this.name, false);
      return true
    }
    if (obj.testKeys(char)) {
      obj.closed = false;
      obj.locked = false;
      msg(lang.unlock_and_enter(char, doorName));
      world.setRoom(char, this.name, false);
      return true
    }
    msg(lang.try_but_locked(char, doorName));
    return false
  }
  // Should be called during the initialisation process
  function initCommands () {
    const newCmds = [];
    commands.forEach(function (el) {
      if (el.verb) {
        el.regex = el.regex + ' #object#';
      }
      if (!(el.regex instanceof RegExp)) {
        alert('No regex for ' + el.name);
      }
      if (el.npcCmd) {
        // console.log("creating NPC command for " + el.name)
        const regexAsStr = el.regex.source.substr(1); // lose the ^ at the start, as we will prepend to it
        const objects = el.objects.slice();
        objects.unshift({ scope: parser.isHere, attName: 'npc' });

        const data = {
          objects: objects,
          attName: el.attName,
          default: el.default,
          defmsg: el.defmsg,
          rules: el.rules,
          score: el.score,
          cmdCategory: el.cmdCategory ? el.cmdCategory : el.name,
          forNpc: true
        };

        for (const key in lang.tell_to_prefixes) {
          const cmd = new NpcCmd('Npc' + el.name + key, data);
          cmd.regex = new RegExp('^' + lang.tell_to_prefixes[key] + regexAsStr);
          if (el.useThisScriptForNpcs) cmd.script = el.script;
          newCmds.push(cmd);
        }
      }
    });

    commands.push.apply(commands, newCmds);

    lang.exit_list.forEach(function (el) {
      if (!el.nocmd) {
        let regex = '^(' + lang.go_pre_regex + ')(' + el.name + '|' + el.abbrev.toLowerCase();
        if (el.alt) { regex += '|' + el.alt; }
        regex += ')$';
        let cmd = new ExitCmd('Go' + sentenceCase(el.name), el.name, {
          regex: new RegExp(regex)
        });
        commands.push(cmd);

        regex = '^(.+), ?(' + lang.go_pre_regex + ')(' + el.name + '|' + el.abbrev.toLowerCase();
        if (el.alt) { regex += '|' + el.alt; }
        regex += ')$';
        cmd = new NpcExitCmd('NpcGo' + sentenceCase(el.name) + '1', el.name, {
          regex: new RegExp(regex)
        });
        commands.push(cmd);

        regex = '^tell (.+) to (' + lang.go_pre_regex + ')(' + el.name + '|' + el.abbrev.toLowerCase();
        if (el.alt) { regex += '|' + el.alt; }
        regex += ')$';
        cmd = new NpcExitCmd('NpcGo' + sentenceCase(el.name) + '2', el.name, {
          regex: new RegExp(regex)
        });
        commands.push(cmd);
      }
    });
  }

  // Useful in a command's script when handling NPCs as well as the player
  function extractChar (cmd, objects) {
    let char;
    if (cmd.forNpc) {
      char = objects[0][0];
      if (!char.npc) {
        failedmsg(lang.not_npc(char));
        return FAILED
      }
      objects.shift();
    } else {
      char = game.player;
    }
    return char
  }

  const cmdRules = {};

  // Item's location is the char and it is not worn
  cmdRules.isHeldNotWorn = function (cmd, char, item, isMultiple) {
    if (!item.getWorn() && item.isAtLoc(char.name, display.PARSER)) {
      return true
    }

    if (item.isAtLoc(char.name, display.PARSER)) {
      failedmsg(prefix(item, isMultiple) + lang.wearing(char, item));
      return false
    }

    if (item.loc) {
      const holder = w[item.loc];
      if (holder.npc || holder.player) {
        failedmsg(prefix(item, isMultiple) + lang.char_has_it(holder, item));
        return false
      }
    }

    failedmsg(prefix(item, isMultiple) + lang.not_carrying(char, item));
    return false
  };

  // Item's location is the char and it is worn
  cmdRules.isWorn = function (cmd, char, item, isMultiple) {
    if (item.getWorn() && item.isAtLoc(char.name, display.PARSER)) {
      return true
    }

    if (item.isAtLoc(char.name, display.PARSER)) {
      failedmsg(prefix(item, isMultiple) + lang.not_wearing(char, item));
      return false
    }

    if (item.loc) {
      const holder = w[item.loc];
      if (holder.npc || holder.player) {
        failedmsg(prefix(item, isMultiple) + lang.char_has_it(holder, item));
        return false
      }
    }

    failedmsg(prefix(item, isMultiple) + lang.not_carrying(char, item));
    return false
  };

  // Item's location is the char
  cmdRules.isHeld = function (cmd, char, item, isMultiple) {
    if (item.isAtLoc(char.name, display.PARSER)) {
      return true
    }

    if (item.loc) {
      const holder = w[item.loc];
      if (holder.npc || holder.player) {
        failedmsg(prefix(item, isMultiple) + lang.char_has_it(holder, item));
        return false
      }
    }

    failedmsg(prefix(item, isMultiple) + lang.not_carrying(char, item));
    return false
  };

  // Item's location is the char's location or the char
  // or item is reachable, but not held by someone else
  cmdRules.isHere = function (cmd, char, item, isMultiple) {
    if (item.isAtLoc(char.loc, display.PARSER)) return true
    if (item.isAtLoc(char.name, display.PARSER)) return true

    if (item.loc) {
      const holder = w[item.loc];
      if (holder.npc || holder.player) {
        // Has a specific location and held by someone
        failedmsg(prefix(item, isMultiple) + lang.char_has_it(holder, item));
        return false
      }
    }

    if (item.scopeStatus === REACHABLE) {
      return true
    }

    failedmsg(prefix(item, isMultiple) + lang.not_here(char, item));
    return false
  };

  // Item's location is the char's location or the char
  // or item is reachable, but not held by someone else
  cmdRules.isHereNotHeld = function (cmd, char, item, isMultiple) {
    // console.log("here")
    if (item.isAtLoc(char.loc, display.PARSER)) return true

    if (item.loc) {
      const holder = w[item.loc];
      if (holder.npc || holder.player) {
        // Has a specific location and held by someone
        failedmsg(prefix(item, isMultiple) + lang.char_has_it(holder, item));
        return false
      }
    }

    if (item.scopeStatus === REACHABLE) {
      return true
    }

    console.log('here2');
    console.log(item.scopeStatus);
    failedmsg(prefix(item, isMultiple) + lang.not_here(char, item));
    return false
  };

  cmdRules.canManipulate = function (cmd, char, item) {
    if (!char.canManipulate(item, cmd.name)) {
      return false
    }
    return true
  };

  cmdRules.canTalkTo = function (cmd, char, item) {
    if (!char.canTalk(item)) {
      return false
    }
    if (!item.npc) {
      failedmsg(prefix(item, isMultiple) + lang.not_able_to_hear(char, item));
      return false
    }
    return true
  };

  cmdRules.canPosture = function (cmd, char, item) {
    if (!char.canPosture(cmd.name)) {
      return false
    }
    return true
  };

  // Should all be language neutral

  const NPC = function (isFemale) {
    // A whole bunch of defaults are the same as the player
    const res = Object.assign({}, PLAYER(), CONSULTABLE());

    // These from the player need adjusting
    delete res.player;
    res.npc = true;
    res.isFemale = isFemale;
    res.pronouns = isFemale ? lang.pronouns.female : lang.pronouns.male;

    res.talktoCount = 0;
    res.askOptions = [];
    res.tellOptions = [];
    res.agenda = [];
    res.followers = [];
    res.excludeFromAll = true;
    res.reactions = NULL_FUNC;
    res.canReachThrough = () => false;
    res.suspended = false;
    res.getVerbs = () => settings.noTalkTo ? [lang.verbs.lookat] : [lang.verbs.lookat, lang.verbs.talkto];
    res.icon = () => '<img src="images/npc12.png" />';

    res.isAtLoc = function (loc, situation) {
      if (situation === display.LOOK && this.scenery) return false
      return (this.loc === loc)
    };

    res.heading = function (dir) {
      return lang.npc_heading(this, dir)
    };

    // This does not work properly, it just gets all clothing!!!
    // But authors could replace as required
    res.getWearingVisible = function () {
      return this.getWearing()
    };

    res.getTopics = npc_utilities.getTopics;

    res.isHere = function () {
      return this.isAtLoc(game.player.loc)
    };

    res.msg = function (s, params) {
      if (this.isHere()) msg(s, params);
    };

    res.multiMsg = function (ary) {
      if (!this.isHere()) return
      const counter = ary[0].replace(/[^a-z]/ig, '');
      if (this[counter] === undefined) this[counter] = -1;
      this[counter]++;
      if (this[counter] >= ary.length) this[counter] = ary.length - 1;
      if (ary[this[counter]]) msg(ary[this[counter]]);
    };

    res.templatePreSave = function () {
      if (this.agenda) this.customSaveAgenda = this.agenda.join('^');
      this.preSave();
    };

    res.templatePostLoad = function () {
      if (this.customSaveAgenda) this.agenda = this.customSaveAgenda.split('^');
      delete this.customSaveAgenda;
      if (this.leaderName) w[this.leaderName].followers.push(this);
      this.postLoad();
    };

    res.setLeader = function (npc) {
      this.leaderName = npc.name;
      npc.followers.push(this);
    };

    res.pause = function () {
      // debugmsg("pausing " + this.name);
      if (this.leaderName) {
        w[this.leaderName].pause();
      } else {
        this.paused = true;
      }
    };

    res.doEvent = function () {
      this.sayTakeTurn();
      this.doReactions();
      if (!this.paused && !this.suspended && this.agenda.length > 0) this.doAgenda();
    };

    res.doReactions = function () {
      if (this.isHere() || settings.npcReactionsAlways) {
        if (typeof this.reactions === 'function') {
          this.reactions();
        } else {
          if (!this.reactionFlags) this.reactionFlags = '';
          for (const key in this.reactions) {
            // console.log("key:" + key);
            if (this.reactionFlags.split(' ').includes(key)) continue
            if (this.reactions[key].test()) {
              this.reactions[key].action();
              this.reactionFlags += ' ' + key;
              if (this.reactions[key].override) this.reactionFlags += ' ' + this.reactions[key].override;
              // console.log("this.reactionFlags:" + this.reactionFlags);
            }
          }
        }
      }
    };

    res.doAgenda = function () {
      // If this NPC has followers, we fake it so it seems to be the group
      if (this.followers.length !== 0) {
        this.savedPronouns = this.pronouns;
        this.savedAlias = this.alias;
        this.pronouns = lang.pronouns.plural;
        this.followers.unshift(this);
        this.alias = formatList(this.followers, { lastJoiner: lang.list_and });
        this.followers.shift();
      }

      const arr = this.agenda[0].split(':');
      const fn = arr.shift();
      if (typeof agenda[fn] !== 'function') {
        errormsg('Unknown function `' + fn + "' in agenda for " + this.name);
        return
      }
      const flag = agenda[fn](this, arr);
      if (flag) this.agenda.shift();

      // If we are faking the group, reset
      if (this.savedPronouns) {
        this.pronouns = this.savedPronouns;
        this.alias = this.savedAlias;
        delete this.savedPronouns;
      }
    };

    // Use this to move the NPC to tell the player
    // it is happening - if the player is somewhere that it can be seen
    res.moveWithDescription = function (dest) {
      if (typeof dest === 'object') dest = dest.name;
      const origin = this.loc;

      lang.npcLeavingMsg(this, dest);

      // Move NPC (and followers)
      this.loc = dest;
      for (const follower of this.followers) follower.loc = dest;

      lang.npcEnteringMsg(this, origin);
    };

    res.talkto = npc_utilities.talkto;

    res.topics = function () {
      if (this.askOptions.length === 0 && this.tellOptions.length === 0) {
        metamsg(lang.topics_no_ask_tell);
        return SUPPRESS_ENDTURN
      }

      let flag = false;
      for (const action of ['ask', 'tell']) {
        const arr = getResponseList({ actor: this, action: action }, this[action + 'Options']);
        const arr2 = [];
        for (const res of arr) {
          if (res.silent && !game.player.mentionedTopics.includes(res.name)) continue
          arr2.push(res.name);
        }
        if (arr2.length !== 0) {
          metamsg(lang['topics_' + action + '_list'](this, arr2.sort()));
          flag = true;
        }
      }

      if (!flag) {
        metamsg(lang.topics_none_found(this));
      }

      return SUPPRESS_ENDTURN
    };

    res.sayBonus = 0;
    res.sayPriority = 0;
    res.sayState = 0;
    res.sayUsed = ' ';
    res.sayResponse = function (s) {
      if (!this.sayResponses) return false
      for (const res of this.sayResponses) {
        if (res.id && this.sayUsed.includes(' ' + res.id + ' ')) continue
        if (!res.regex.test(s)) continue
        res.response();
        if (res.id) this.sayUsed += res.id + ' ';
        return true
      }
      return false
    };
    res.sayCanHear = function (actor, verb) {
      return actor.loc === this.loc
    };
    res.askQuestion = function (questionName) {
      if (typeof questionName !== 'string') questionName = questionName.name;
      this.sayQuestion = questionName;
      this.sayQuestionCountdown = settings.turnsQuestionsLast;
      this.sayBonus = 100;
    };
    res.sayTakeTurn = function (questionName) {
      if (this.sayQuestionCountdown <= 0) return
      this.sayQuestionCountdown--;
      if (this.sayQuestionCountdown > 0) return
      delete this.sayQuestion;
      this.sayBonus = 0;
    };

    return res
  };

  const npc_utilities = {
    talkto: function () {
      if (!game.player.canTalk(this)) {
        return false
      }
      if (settings.noTalkTo !== false) {
        metamsg(settings.noTalkTo);
        return false
      }

      const topics = this.getTopics(this);
      if (topics.length === 0) return failedmsg(lang.no_topics(game.player, this))

      topics.push(lang.never_mind);
      if (settings.dropdownForConv) {
        showDropDown(lang.speak_to_menu_title(this), topics, function (result) {
          if (result !== lang.never_mind) {
            result.runscript();
          }
        });
      } else {
        showMenu(lang.speak_to_menu_title(this), topics, function (result) {
          if (result !== lang.never_mind) {
            result.runscript();
          }
        });
      }

      return SUPPRESS_ENDTURN
    },

    getTopics: function () {
      const list = [];
      for (const key in w) {
        if (w[key].isTopicVisible && w[key].isTopicVisible(this)) {
          list.push(w[key]);
        }
      }
      return list
    }

  };

  const agenda = {
    // print the array as text if the player is here
    // otherwise this will be skipped
    // Used by several other functions, so this applies to them too
    text: function (npc, arr) {
      if (typeof npc[arr[0]] === 'function') {
        const fn = arr.shift();
        const res = npc[fn](arr);
        return (typeof res === 'boolean' ? res : true)
      }

      if (npc.here()) {
        for (const item of arr) {
          msg(item);
        }
      }
      return true
    },

    // sets one attribute on the given item
    // it will guess if Boolean, integer or string
    setItemAtt: function (npc, arr) {
      // debugmsg("Setting item att...");
      const item = arr.shift();
      const att = arr.shift();
      let value = arr.shift();
      if (!w[item]) errormsg("Item '" + item + "' not recognised in the agenda of " + npc.name);
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      if (/^\d+$/.test(value)) ;
      w[item][att] = value;
      this.text(npc, arr);
      return true
    },

    // Wait n turns
    wait: function (npc, arr) {
      if (arr.length === 0) return true
      if (isNaN(arr[0])) errormsg("Expected wait to be given a number in the agenda of '" + npc.name + "'");
      const count = parseInt(arr.shift());
      if (npc.agendaWaitCounter !== undefined) {
        npc.agendaWaitCounter++;
        if (npc.agendaWaitCounter >= count) {
          this.text(npc, arr);
          return true
        }
        return false
      }
      npc.agendaWaitCounter = 1;
      return false
    },

    // Wait until ...
    // This may be repeated any number of times
    waitFor: function (npc, arr) {
      let name = arr.shift();
      if (typeof npc[name] === 'function') {
        if (npc[name](arr)) {
          return true
        } else {
          return false
        }
      } else {
        if (name === 'player') name = game.player.name;
        if (npc.here()) {
          this.text(npc, arr);
          return true
        } else {
          return false
        }
      }
    },

    joinedBy: function (npc, arr) {
      const followerName = arr.shift();
      w[followerName].setLeader(npc);
      this.text(npc, arr);
      return true
    },

    joining: function (npc, arr) {
      const leaderName = arr.shift();
      npc.setLeader(w[leaderName]);
      this.text(npc, arr);
      return true
    },

    disband: function (npc, arr) {
      for (const follower of npc.followers) {
        delete follower.leader;
      }
      npc.followers = [];
      this.text(npc, arr);
      return true
    },

    // Move the given item directly to the given location, then print the rest of the array as text
    // Do not use for items with a funny location, such as COUNTABLES
    moveItem: function (npc, arr) {
      // debugmsg("Moving item...");
      const item = arr.shift();
      const dest = arr.shift();
      // debugmsg("dest:" + dest);
      if (!w[item]) errormsg("Item '" + item + "' was not recognised in the agenda of " + npc.name);
      if (!w[dest]) errormsg("Location '" + dest + "' was not recognised in the agenda of " + npc.name);
      w[item].moveToFrom(dest);
      this.text(npc, arr);
      return true
    },

    // Move directly to the given location, then print the rest of the array as text
    // Use "player" to go directly to the room the player is in.
    // Use an item (i.e., an object not flagged as a room) to have the NPC move
    // to the room containing the item.
    moveTo: function (npc, arr) {
      // debugmsg("Moving...");
      let dest = arr.shift();
      // debugmsg("dest:" + dest);
      if (dest === 'player') dest = game.player.loc;
      if (!w[dest]) debugmsg("Location '" + dest + "' not recognised in the agenda of " + npc.name);
      if (!w[dest].room) dest = dest.loc;
      if (!w[dest]) errormsg("Location '" + dest + "' not recognized in the agenda of " + npc.name);
      npc.moveWithDescription(dest);
      this.text(npc, arr);
      return true
    },

    patrol: function (npc, arr) {
      if (npc.patrolCounter === undefined) npc.patrolCounter = -1;
      npc.patrolCounter = (npc.patrolCounter + 1) % arr.length;
      this.moveTo(npc, [arr[npc.patrolCounter]]);
      return false
    },

    // Move to another room via a random, unlocked exit, then print the rest of the array as text
    walkRandom: function (npc, arr) {
      // debugmsg("Moving random...");
      const exit = w[npc.loc].getRandomExit(true);
      if (exit === null) {
        this.text(npc, arr);
        return true
      }
      if (!w[exit.name]) errormsg("Location '" + exit.name + "' not recognised in the agenda of " + npc.name);
      npc.moveWithDescription(exit.name);
      return false
    },

    // Move to the given location, using available, unlocked exits, one room per turn
    // then print the rest of the array as text
    // Use "player" to go to the room the player is in (if the player moves, the NPC will head
    // to the new position, but will be omniscient!).
    // Use an item (i.e., an object not flagged as a room) to have the NPC move
    // to the room containing the item.
    // This may be repeated any number of turns
    walkTo: function (npc, arr) {
      // debugmsg("Walking...");
      let dest = arr.shift();
      // debugmsg("dest:" + dest);
      if (dest === 'player') dest = game.player.loc;
      if (w[dest] === undefined) {
        errormsg("Location '" + dest + "' not recognised in the agenda of " + npc.name);
        return true
      }
      if (!w[dest].room) {
        dest = w[dest].loc;
        if (w[dest] === undefined) {
          errormsg("Object location '" + dest + "' not recognised in the agenda of " + npc.name);
          return true
        }
      }
      if (npc.isAtLoc(dest)) {
        this.text(npc, arr);
        return true
      } else {
        const route = agenda.findPath(w[npc.loc], w[dest]);
        if (!route) errormsg("Location '" + dest + "' not reachable in the agenda of " + npc.name);
        // debugmsg(formatList(route));
        npc.moveWithDescription(route[0]);
        if (npc.isAtLoc(dest)) {
          this.text(npc, arr);
          return true
        } else {
          return false
        }
      }
    }

  };

  // start and end are the objects, not their names!
  agenda.findPath = function (start, end, maxlength) {
    if (start === end) return []

    if (!game.pathID) game.pathID = 0;
    if (maxlength === undefined) maxlength = 999;
    game.pathID++;
    let currentList = [start];
    let length = 0;
    let nextList, dest, exits;
    start.pathfinderNote = { id: game.pathID };

    // At each iteration we look at the rooms linked from the previous one
    // Any new rooms go into nextList
    // Each room gets flagged with "pathfinderNote"
    while (currentList.length > 0 && length < maxlength) {
      nextList = [];
      length++;
      for (const room of currentList) {
        exits = room.getExits(true);
        for (const exit of exits) {
          dest = w[exit.name];
          if (dest === undefined) errormsg('Dest is undefined: ' + exit.name);
          if (dest.pathfinderNote && dest.pathfinderNote.id === game.pathID) continue
          dest.pathfinderNote = { jumpFrom: room, id: game.pathID };
          if (dest === end) return agenda.extractPath(start, end)
          nextList.push(dest);
        }
      }
      currentList = nextList;
    }
    return false
  };

  agenda.extractPath = function (start, end) {
    const res = [end];
    let current = end;
    let count = 0;

    do {
      current = current.pathfinderNote.jumpFrom;
      res.push(current);
      count++;
    } while (current !== start && count < 99)
    res.pop(); // The last is the start location, which we do not ned
    return res.reverse()
  };

  const CONSULTABLE = function () {
    const res = {};

    res.askabout = function (text1, text2) { return this.asktellabout(text1, text2, lang.ask_about_intro, this.askOptions, 'ask') };
    res.tellabout = function (text1, text2) { return this.asktellabout(text1, text2, lang.tell_about_intro, this.tellOptions, 'tell') };
    res.asktellabout = function (text1, text2, intro, list, action) {
      if (!game.player.canTalk(this)) {
        return false
      }
      if (settings.noAskTell !== false) {
        metamsg(settings.noAskTell);
        return false
      }
      if (settings.givePlayerAskTellMsg) msg(intro(this, text1, text2));

      const params = {
        text: text1,
        text2: text2,
        actor: this,
        action: action
      };
      return respond(params, list, this.asktelldone)
    };
    res.asktelldone = function (params, response) {
      if (!response) {
        msg(lang.npc_no_interest_in(params.actor));
        return
      }
      if (response.mentions) {
        for (const s of response.mentions) {
          if (!game.player.mentionedTopics.includes(s)) game.player.mentionedTopics.push(s);
        }
      }
      params.actor.pause();
    };

    return res
  };

  const QUESTION = function () {
    const res = {
      sayResponse: function (actor, s) {
        for (const res of this.responses) {
          if (!res.regex || res.regex.test(s)) {
            actor.sayBonus = 0;
            delete actor.sayQuestion;
            res.response(s);
            return true
          }
        }
        return false
      }
    };
    return res
  };

  const TOPIC = function (fromStart) {
    const res = {
      conversationTopic: true,
      showTopic: fromStart,
      hideTopic: false,
      hideAfter: true,
      nowShow: [],
      nowHide: [],
      count: 0,
      isAtLoc: () => false,
      runscript: function () {
        let obj = w[this.loc];
        obj.pause();
        this.hideTopic = this.hideAfter;
        this.script(obj);
        if (typeof this.nowShow === 'string') errormsg('nowShow for topic ' + this.nname + ' is a string.');
        for (const s of this.nowShow) {
          obj = w[s];
          if (obj === undefined) errormsg('No topic called ' + s + ' found.');
          obj.showTopic = true;
        }
        if (typeof this.nowHide === 'string') errormsg('nowHide for topic ' + this.nname + ' is a string.');
        for (const s of this.nowHide) {
          obj = w[s];
          if (obj === undefined) errormsg('No topic called ' + s + ' found.');
          obj.hideTopic = true;
        }
        this.count++;
        world.endTurn(SUCCESS);
      },
      isTopicVisible: function (char) {
        return this.showTopic && !this.hideTopic && char.name === this.loc
      },
      show: function () {
        return this.showTopic = true
      },
      hide: function () {
        return this.hideTopic = true
      }
    };
    return res
  };

  // notes AND LIMITATIONS
  // @DOC
  // ## Parser Functions
  //
  // Most of these are only for internal use!
  // @UNDOC

  const parser = {};
  // Stores the current values for it, him, etc.
  // put hat in box
  // x it
  parser.pronouns = {};
  parser.debug = false;

  // @DOC
  // The "parse" function should be sent either the text the player typed or null.
  // If sent null it will continue to work with the current values in currentCommand.
  // This allows us to keep trying to process a single command until all the
  //  disambiguations have been resolved.
  parser.parse = function (inputText) {
    parser.msg('Input string: ' + inputText);

    // This allows the command system to be temporarily overriden,
    // say if the game asks a question
    if (parser.override) {
      parser.msg('Parser overriden');
      parser.override(inputText);
      delete parser.override;
      return
    }

    if (inputText) {
      const res = parser.convertInputTextToCommandCandidate(inputText);
      if (typeof res === 'string') {
        parsermsg(res);
        world.endTurn(PARSER_FAILURE);
        return
      }
      parser.currentCommand = res;
    }

    // Need to disambiguate, until each of the lowest level lists has exactly one member
    let flag = false;
    for (let i = 0; i < parser.currentCommand.objects.length; i++) {
      for (let j = 0; j < parser.currentCommand.objects[i].length; j++) {
        if (parser.currentCommand.objects[i][j] instanceof Array) {
          if (parser.currentCommand.objects[i][j].length === 1) {
            parser.currentCommand.objects[i][j] = parser.currentCommand.objects[i][j][0];
          } else {
            flag = true;
            parser.currentCommand.disambiguate1 = i;
            parser.currentCommand.disambiguate2 = j;
            showMenu(lang.disambig_msg, parser.currentCommand.objects[i][j], function (result) {
              parser.currentCommand.objects[parser.currentCommand.disambiguate1][parser.currentCommand.disambiguate2] = result;
              parser.parse(null);
            });
          }
        }
      }
    }
    if (!flag) {
      parser.execute();
    }
  };

  // @DOC
  // You can use this to bypass all the text matching when you know what the object and command are.
  // Limited to commands with one object.
  //
  // Used by the panes when the player clicks on a verb for an item
  parser.quickCmd = function (cmd, item) {
    parser.msg('quickCmd: ' + cmd.name);
    parser.currentCommand = {
      cmdString: (item ? cmd.name + ' ' + item.name : cmd.name),
      cmd: cmd,
      objects: (item ? [[item]] : []),
      matches: (item ? [[item.alias]] : [])
    };
    parser.execute();
  };

  // Do it!
  parser.execute = function () {
    parser.inspect();

    if (parser.currentCommand.objects.length > 0 && typeof parser.currentCommand.objects[0] === 'object') {
      for (const obj of parser.currentCommand.objects[0]) {
        parser.pronouns[obj.pronouns.objective] = obj;
      }
    }
    const outcome = parser.currentCommand.cmd.script(parser.currentCommand.objects, parser.currentCommand.matches);
    world.endTurn(outcome);
  };

  // This will return a dictionary, with these keys:
  // .inputString    the initial string
  // .cmdString      the sanitised string
  // .cmd            the matched command object
  // .objects        a list (of a list of a list), one member per capture group in the command regex
  // .objects[0]     a list (of a list), one member per object name given by the player for capture group 0
  // .objects[0][0]  a list of possible object matches for each object name given by the player for the
  //                      first object name in capture group 0
  parser.convertInputTextToCommandCandidate = function (inputText) {
    // let s = inputText.toLowerCase().split(' ').filter(function(el) { return !IGnored_words.includes(el); }).join(' ');

    // remove multiple spaces, and any from the ends
    let cmdString = inputText.toLowerCase().trim().replace(/\s+/g, ' ');

    // convert numbers in weords to digits
    if (settings.convertNumbersInParser) {
      cmdString = lang.convertNumbers(cmdString);
    }

    // Get a list of candidate commands that match the regex
    const candidates = commands.filter(function (el) {
      return el.regex.test(cmdString)
    });
    if (candidates.length === 0) {
      return lang.not_known_msg
    }
    parser.msg('Number of commands that have a regex match:' + candidates.length);

    // We now want to match potential objects
    // This will help us narrow down the candidates (maybe)
    // matchedCandidates is an array of dictionaries,
    // each one containing a command and some matched objects if applicable
    let error = lang.general_obj_error;
    const matchedCandidates = [];
    candidates.forEach(function (el) {
      // matchItemsToCmd will attempt to fit the objects, returns a dictionary if successful
      // or an error message otherwise. Could have more than one object,
      // either because multiple were specified or because it was ambiguous (or both)
      // We just keep the last error message as hopefully the most relevant.
      // NB: Inside function so cannot use 'this'
      parser.msg('* Looking at candidate: ' + el.name);
      const res = parser.matchItemsToCmd(cmdString, el);
      if (!res) {
        parser.msg('No result!');
        error = 'Res is ' + res;
      }
      parser.msg('Result score is: ' + res.score);
      if (res.score === -1) {
        error = res.error;
      } else {
        parser.msg('Candidate accepted!');
        matchedCandidates.push(res);
      }
    });
    parser.msg('Number of candidates accepted: ' + matchedCandidates.length);
    if (matchedCandidates.length === 0) {
      return error
    }
    // pick between matchedCandidates based on score
    let command = matchedCandidates[0];
    if (matchedCandidates.length > 1) {
      parser.msg('Need to pick just one; start with the first (score ' + command.score + ').');
      for (const candidate of matchedCandidates) {
        // give preference to earlier commands
        if (command.score < candidate.score) {
          parser.msg('This one is better:' + command.cmd.name + ' (score ' + candidate.score + ')');
          command = candidate;
        }
      }
    }
    if (!command) console.log(inputText);
    command.string = inputText;
    command.cmdString = cmdString;
    parser.msg('This is the one:' + command.cmd.name);
    return command
  };

  // We want to see if this command is a good match to the string
  // This will involve trying to matching objects, according to the
  // values in the command
  // Returns a dictionary containing:
  // cmd - the command
  // objectTexts - the matched object names from the player input
  // objects - the matched objects (lists of lists ready to be disabiguated)
  // score - a rating of how good the match is
  // error - a string to report why it failed, if it did!
  //
  // objects will be an array for each object role (so PUT HAT IN BOX is two),
  // of arrays for each object listed (so GET HAT, TEAPOT AND GUN is three),
  // of possible object matches (so GET HAT is four if there are four hats in the room)
  parser.matchItemsToCmd = function (s, cmd) {
    const res = { cmd: cmd, objectTexts: [], objects: [], matches: [] };
    res.score = cmd.score ? cmd.score : 0;
    const arr = cmd.regex.exec(s);
    const fallbackScope = parser.scope(parser.isVisible);
    arr.shift(); // first element is the whole match, so discard

    parser.msg('..Base score: ' + res.score);

    for (let i = 0; i < arr.length; i++) {
      if (!cmd.objects[i]) {
        errormsg("That command seems to have an error. It has more capture groups than there are elements in the 'objects' attribute.");
        return false
      }
      if (cmd.objects[i].ignore) {
        // this capture group has been flagged to be ignored
        continue
      }
      let objectNames; let score = 0;
      res.objectTexts.push(arr[i]);
      if (cmd.objects[i].text) {
        // this capture group has been flagged to be text
        res.objects.push(arr[i]);
        score = 1;
      } else if (lang.all_regex.test(arr[i]) || lang.all_exclude_regex.test(arr[i])) {
        // Handle ALL and ALL BUT
        let list = cmd.objects[i].scope ? parser.scope(cmd.objects[i].scope) : fallbackScope;
        const exclude = [game.player];

        // anything flagged as scenery should be excluded
        for (const item of list) {
          if (item.scenery || item.excludeFromAll) {
            exclude.push(item);
          }
        }

        if (list.length === 0) {
          res.error = cmd.nothingForAll ? cmd.nothingForAll : lang.nothing_msg;
          res.score = -1;
          return res
        }
        if (lang.all_exclude_regex.test(arr[i])) {
          // if this is ALL BUT we need to remove some things from the list
          // excludes must be in isVisible
          // if it is ambiguous or not recognised it does not get added to the list
          const s = arr[i].replace(lang.all_exclude_regex, '').trim();
          objectNames = s.split(lang.joiner_regex).map(function (el) { return el.trim() });
          for (const s in objectNames) {
            items = parser.findInList(s, fallbackScope);
            if (items.length === 1) {
              exclude.push(items[0]);
            }
          }
        }
        list = list.filter(function (el) { return !exclude.includes(el) });
        if (list.length > 1 && !cmd.objects[i].multiple) {
          res.error = lang.no_multiples_msg;
          res.score = -1;
          return res
        }
        score = 2;
        res.objects.push(list.map(function (el) { return [el] }));
        res.matches.push(arr[i]);
        res.all = true;
      } else {
        objectNames = arr[i].split(lang.joiner_regex).map(function (el) { return el.trim() });
        if (objectNames.length > 1 && !cmd.objects[i].multiple) {
          res.error = lang.no_multiples_msg;
          res.score = -1;
          return res
        }
        const scopes = cmd.objects[i].scope ? [parser.scope(cmd.objects[i].scope), fallbackScope] : [fallbackScope];

        const objs = []; const matches = [];
        let objs2, n;
        for (const s of objectNames) {
          const objNameMatch = lang.article_filter_regex.exec(s);
          if (objNameMatch === null) {
            errormsg("Failed to match to article_filter_regex with '" + s + "', - probably an error in article_filter_regex!");
            return null
          }
          [objs2, n] = this.findInScope(objNameMatch[1], scopes, cmd.objects[i]);
          if (n === 0) {
            res.error = (cmd.noobjecterror ? cmd.noobjecterror : lang.object_unknown_msg(s));
            res.score = -1;
            return res
          } else {
            if (n > score) { score = n; }
            objs.push(objs2);
            matches.push(s);
          }
        }
        res.objects.push(objs);
        res.matches.push(matches);
      }
      parser.msg('..Adding to the score: ' + score);
      res.score += score;
    }
    return res
  };

  // Tries to match objects to the given string
  // It will return a list of matching objects (to be disambiguated if more than 1),
  // plus the score, depending on which list the object(s) was found in
  // (if there are three lists, the score will be 3 if found in the first list, 2 in the second,
  // or 1 if in the third list).
  // If not found the score will be 0, and an empty array returned.
  parser.findInScope = function (s, listOfLists, cmdParams) {
    // First handle IT etc.
    for (const key in lang.pronouns) {
      if (s === lang.pronouns[key].objective && parser.pronouns[lang.pronouns[key].objective]) {
        return [parser.pronouns[lang.pronouns[key].objective], 1]
      }
    }

    for (let i = 0; i < listOfLists.length; i++) {
      const objs = this.findInList(s, listOfLists[i], cmdParams);
      if (objs.length > 0) {
        return [objs, listOfLists.length - i]
      }
    }
    return [[], 0]
  };

  // Tries to match an object to the given string
  // But if there are more than 1 with the same score, it returns them all
  // s is the string to match
  // list is an array of items to match again
  parser.findInList = function (s, list, cmdParams) {
    parser.msg('..Looking for a match for: ' + s);
    let res = [];
    let score = 0;
    let n;
    for (const item of list) {
      n = this.scoreObjectMatch(s, item, cmdParams);
      if (n >= 0) parser.msg('....Considering: ' + item.name + ' (score ' + n + ')');
      if (n > score) {
        res = [];
        score = n;
      }
      if (n >= score) {
        res.push(item);
      }
    }
    parser.msg(res.length > 1 ? 'Cannot decide between: ' + res.map(el => el.name).join(', ') : (res.length === 1 ? '..Going with: ' + res[0].name : 'Found no suitable objects'));
    return res
  };

  parser.scoreObjectMatch = function (s, item, cmdParams) {
    if (!item.parserOptionsSet) {
      // Do we need to do this when the saved game is reloaded???
      item.parserOptionsSet = true;
      item.parserItemName = item.alias.toLowerCase();
      item.parserItemNameParts = item.parserItemName.split(' ');
      if (item.pattern) {
        if (!item.regex) item.regex = new RegExp('^(' + item.pattern + ')$');
        if (!item.parserAltNames) item.parserAltNames = item.pattern.split('|');
      }
      if (item.parserAltNames) {
        item.parserAltNames.forEach(function (el) {
          if (el.includes(' ')) {
            item.parserItemNameParts = item.parserItemNameParts.concat(el.split(' '));
          }
        });
      }
    }
    const itemName = item.alias.toLowerCase();
    let res = -1;
    if (cmdParams.items && cmdParams.items.includes(item.name)) {
      // The command specifically mentions this item, so highest priority
      res = 100;
    } else if (s === item.parserItemName) {
      // The player has used the exact alias
      res = 70;
    } else if (item.regex && item.regex.test(s)) {
      // The player has used the exact string allowed in the regex
      res = 60;
    } else if (item.parserItemNameParts && item.parserItemNameParts.some(function (el) { return el === s })) {
      // The player has matched a complete word, but not the full phrase
      res = 50;
    } else if (item.parserItemName.startsWith(s)) {
      // the player has used a string that matches the start of the alias
      res = s.length + 15;
    } else if (item.parserAltNames && item.parserAltNames.some(function (el) { return el.startsWith(s) })) {
      // the player has used a string that matches the start of an alt name
      res = s.length + 10;
    } else if (item.parserItemNameParts && item.parserItemNameParts.some(function (el) { return el.startsWith(s) })) {
      // the player has used a string that matches the start of an alt name
      res = s.length;
    } else {
      return -1
    }

    if (item[cmdParams.attName]) res += 6;
    if (item.parsePriority) res += item.parsePriority;

    // note what we matched against in case a command wants to use it later
    // This is a little risky as at this point it is only a suggestion,
    // but I cannot think of a situation where it would fail.
    // Used by COUNTABLE
    item.cmdMatch = s;
    return res
  };

  // For debugging only
  // Prints details about the parser.currentCommand so you can
  // see what the parser has made of the player's input
  parser.inspect = function () {
    if (!parser.debug) return

    let s = 'PARSER RESULT:<br/>';
    s += 'Input text: ' + parser.currentCommand.string + '<br/>';
    s += 'Matched command: ' + parser.currentCommand.cmd.name + '<br/>';
    s += 'Matched regex: ' + parser.currentCommand.cmd.regex + '<br/>';
    s += 'Match score: ' + parser.currentCommand.score + '<br/>';
    if (parser.currentCommand.all) { s += 'Player typed ALL<br/>'; }
    s += 'Objects/texts (' + parser.currentCommand.objects.length + '):' + '<br/>';
    for (const obj of parser.currentCommand.objects) {
      if (typeof obj === 'string') {
        s += '&nbsp;&nbsp;&nbsp;&nbsp;Text: ' + obj + '<br/>';
      } else {
        s += '&nbsp;&nbsp;&nbsp;&nbsp;Objects:' + obj.map(function (el) { return el.name }).join(', ') + '<br/>';
      }
    }
    debugmsg(s);
  };

  parser.msg = function (...ary) {
    if (parser.debug) {
      for (const s of ary) debugmsg('PARSER&gt; ' + s);
    }
  };

  parser.scope = function (fn, options) {
    const list = [];
    for (const key in w) {
      if (fn(w[key], options)) {
        list.push(w[key]);
      }
    }
    return list
  };

  // This set is used in the objects attribute of commands
  // The "is" functions are for looking at a specific place

  // Anywhere in the world
  parser.isInWorld = function (item) {
    return true
  };
  // Anywhere in the world
  parser.isReachable = function (item) {
    return item.scopeStatus === REACHABLE && world.ifNotDark(item)
  };
  // Anywhere in the location (used by the parser for the fallback)
  parser.isVisible = function (item) {
    return item.scopeStatus && world.ifNotDark(item)
  };
  // Held or here, but not in a container
  parser.isPresent = function (item) {
    return parser.isHere(item) || parser.isHeld(item)
  };
  // Used by examine, so the player can X ME, even if something called metalhead is here.
  parser.isPresentOrMe = function (item) {
    return parser.isHere(item) || parser.isHeld(item) || item === game.player
  };
  // ... but not in a container
  parser.isHeldNotWorn = function (item) {
    return item.isAtLoc(game.player.name, display.PARSER) && world.ifNotDark(item) && !item.getWorn()
  };
  parser.isHeld = function (item) {
    return item.isAtLoc(game.player.name, display.PARSER) && world.ifNotDark(item)
  };
  parser.isForSale = function (item) {
    return item.isForSale && item.isForSale(game.player.loc) && world.ifNotDark(item)
  };

  parser.isHeldByNpc = function (item) {
    const npcs = parser.scope(parser.isReachable).filter(el => el.npc);
    for (const npc of npcs) {
      if (item.isAtLoc(npc.name, display.PARSER)) return true
    }
    return false
  };

  parser.isNpcOrHere = function (item) {
    return (item.isAtLoc(game.player.loc, display.PARSER) && world.ifNotDark(item)) || item.npc || item.player
  };
  parser.isNpcAndHere = function (item) {
    return item.isAtLoc(game.player.loc, display.PARSER) && (item.npc || item.player)
  };
  parser.isHere = function (item) {
    return item.isAtLoc(game.player.loc, display.PARSER) && world.ifNotDark(item)
  };
  // parser.isWorn = function(item) {
  //  return item.isAtLoc(game.player.name, display.PARSER) && world.ifNotDark(item) && item.getWorn();
  // }
  // parser.isWornBy = function(item, options) {
  //  return item.isAtLoc(options.npc.name, display.PARSER) && item.getWorn() && !item.ensemble;
  // }

  // parser.isInside = function(item, options) {
  //  return item.isAtLoc(options.container.name, display.PARSER) && world.ifNotDark(item);
  // }

  // parser.isRoom = function(item) {
  //  return item.room;
  // }

  parser.isContained = function (item) {
    const containers = parser.scope(parser.isReachable).filter(el => el.container);
    for (const container of containers) {
      if (container.closed) continue
      if (item.isAtLoc(container.name, display.PARSER)) return true
    }
    return false
  };
  parser.isHereOrContained = function (item) {
    if (parser.isHere(item)) return true
    if (parser.isContained(item)) return true
    return false
  };

  parser.isLiquid = function (item, options) {
    return item.liquid
  };

  const saveLoad = {

    saveGame: function (filename, comment) {
      if (filename === undefined) {
        errormsg(lang.sl_no_filename);
        return false
      }
      if (comment === undefined) { comment = '-'; }
      const s = saveLoad.saveTheWorld(comment);
      console.log(s);
      localStorage.setItem(settings.title + ': ' + filename, s);
      metamsg('Saved');
      return true
    },

    saveTheWorld: function (comment) {
      return saveLoad.getSaveHeader(comment) + saveLoad.getSaveBody()
    },

    getHeader: function (s) {
      const arr = s.split('!');
      return { title: saveLoad.decodeString(arr[0]), version: saveLoad.decodeString(arr[1]), comment: saveLoad.decodeString(arr[2]), timestamp: arr[3] }
    },

    getSaveHeader: function (comment) {
      const currentdate = new Date();
      let s = saveLoad.encodeString(settings.title) + '!';
      s += saveLoad.encodeString(settings.version) + '!';
      s += (comment ? saveLoad.encodeString(comment) : '-') + '!';
      s += currentdate.toLocaleString() + '!';
      return s
    },

    getSaveBody: function () {
      const l = [];
      for (const key in w) {
        l.push(key + '=' + w[key].getSaveString());
      }
      return l.join('!')
    },

    // LOAD

    loadGame: function (filename) {
      const s = localStorage.getItem(settings.title + ': ' + filename);
      if (s != null) {
        saveLoad.loadTheWorld(s, 4);
        metamsg('Loaded');
      } else {
        metamsg('Load failed: File not found');
      }
    },

    loadTheWorld: function (s, removeHeader) {
      const arr = s.split('!');
      if (removeHeader !== undefined) {
        arr.splice(0, removeHeader);
      }

      // Eliminate all clones
      // Reset followers
      for (const key in w) {
        if (w[key].followers) w[key].followers = [];
        if (w[key].clonePrototype) delete w[key];
      }

      for (const el of arr) {
        this.setLoadString(el);
      }
      game.update();
      endTurnUI(true);
    },

    setLoadString: function (s) {
      const parts = s.split('=');
      if (parts.length !== 3) {
        errormsg('Bad format in saved data (' + s + ')');
        return
      }
      const name = parts[0];
      const saveType = parts[1];
      const arr = parts[2].split(';');

      if (saveType.startsWith('Clone')) {
        const clonePrototype = saveType.split(':')[1];
        if (!w[clonePrototype]) {
          errormsg("Cannot find prototype '" + clonePrototype + "'");
          return
        }
        const obj = cloneObject(w[clonePrototype]);
        this.setFromArray(obj, arr);
        w[obj.name] = obj;
        obj.templatePostLoad();
        return
      }

      if (saveType === 'Object') {
        if (!w[name]) {
          errormsg("Cannot find object '" + name + "'");
          return
        }
        const obj = w[name];
        this.setFromArray(obj, arr);
        obj.templatePostLoad();
        return
      }

      /*
      if (saveLoad["load" + hash.saveType]) {
        saveLoad["load" + hash.saveType](name, hash);
        return;
      } */

      errormsg("Unknown save type for object '" + name + "' (" + hash.saveType + ')');
    },

    // UTILs

    decode: function (hash, str) {
      const parts = str.split(':');
      const key = parts[0];
      const attType = parts[1];
      const s = parts[2];

      if (attType === 'boolean') {
        hash[key] = (s === 'true');
        return
      }

      if (attType === 'number') {
        hash[key] = parseFloat(s);
        return
      }

      if (attType === 'string') {
        hash[key] = saveLoad.decodeString(s);
        return
      }

      if (attType === 'array') {
        hash[key] = saveLoad.decodeArray(s);
        return
      }

      if (attType === 'exit') {
        // console.log(key)
        // console.log(hash[key])
        // console.log(hash)
        hash[key].locked = (parts[3] === 'l');
        hash[key].hidden = (parts[4] === 'h');
        return
      }

      if (attType === 'qobject') {
        hash[key] = w[s];
      } // this will cause an issue if it points to a clone that has not been done yet !!!
    },

    encode: function (key, value) {
      if (!value) return ''
      const attType = typeof value;
      if (Array.isArray(value)) {
        if (typeof value[0] === 'string') return key + ':array:' + saveLoad.encodeArray(value) + ';'
        return ''
      }
      if (value instanceof Exit) {
        if (value.name) return key + ':exit:' + value.name + ':' + (value.locked ? 'l' : 'u') + ':' + (value.hidden ? 'h' : 'v') + ';'
        return ''
      }
      if (attType === 'object') {
        if (value.name) return key + ':qobject:' + value.name + ';'
        return ''
      }
      if (attType === 'string') return key + ':string:' + saveLoad.encodeString(value) + ';'
      return key + ':' + attType + ':' + value + ';'
    },

    replacements: [
      { unescaped: ':', escaped: 'cln' },
      { unescaped: ';', escaped: 'scln' },
      { unescaped: '!', escaped: 'exm' },
      { unescaped: '=', escaped: 'eqs' },
      { unescaped: '~', escaped: 'tld' }
    ],

    encodeString: function (s) {
      for (const d of saveLoad.replacements) {
        s = s.replace(new RegExp(d.unescaped, 'g'), '@@@' + d.escaped + '@@@');
      }
      return s
    },

    decodeString: function (s) {
      for (const d of saveLoad.replacements) {
        s = s.replace(new RegExp('@@@' + d.escaped + '@@@', 'g'), d.unescaped);
      }
      return s
    },

    encodeArray: function (ary) {
      return ary.map(el => saveLoad.encodeString(el)).join('~')
    },

    decodeArray: function (s) {
      return s.split('~').map(el => saveLoad.decodeString(el))
    },

    decodeExit: function (s) {
      return s.split('~').map(el => saveLoad.decodeString(el))
    },

    lsTest: function () {
      const test = 'test';
      try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true
      } catch (e) {
        return false
      }
    },

    // Other functions

    deleteGame: function (filename) {
      localStorage.removeItem(settings.title + ': ' + filename);
      metamsg('Deleted');
    },

    dirGame: function () {
      let s = '<table class="meta">' + lang.sl_dir_headings;
      $.each(localStorage, function (key, value) {
        // debugmsg("key=" + key);
        const regex = new RegExp('^' + settings.title + ': ');
        const name = key.replace(regex, '');
        if (regex.test(key)) {
          const dic = saveLoad.getHeader(value);
          s += '<tr><td>' + name + '</td>';
          s += '<td>' + dic.version + '</td>';
          s += '<td>' + dic.timestamp + '</td>';
          s += '<td>' + dic.comment + '</td></tr>';
        }
      });
      s += '</table>';
      metamsg(s);
      metamsg(lang.sl_dir_msg);
    },

    setFromArray: function (obj, arr) {
      for (const el of arr) {
        saveLoad.decode(obj, el);
      }
    }

  };

  const settings = {

    // Functions for the side panes lists
    isHeldNotWorn: function (item) {
      return item.isAtLoc(game.player.name, display.SIDE_PANE) && world.ifNotDark(item) && !item.getWorn()
    },
    isHere: function (item) {
      return item.isAtLoc(game.player.loc, display.SIDE_PANE) && world.ifNotDark(item)
    },

    isWorn: function (item) {
      return item.isAtLoc(game.player.name, display.SIDE_PANE) && world.ifNotDark(item) && item.getWorn()
    },

    // Also title, author, thanks (option; array)

    // Files
    lang: 'lang-en', // Set to the language file of your choice
    customExits: false, // Set to true to use custom exits, in exits.js
    files: ['code', 'data'], // Additional files to load
    libraries: ['saveload', 'text', 'io', 'command', 'defaults', 'templates', 'world', 'npc', 'parser', 'commands'], // util and saveload already loaded
    customLibraries: [],

    // The side panes
    panes: 'left', // Can be set to Left, Right or None (setting PANES to None will more than double the speed of your game!)
    compass: true, // Set to true to have a compass display
    divider: false, // Image used to divide the panes at the side; set to false if not used
    statusPane: 'Status', // Title of the panel; set to false to turn off
    statusWidthLeft: 120, // How wide the left column is in the status pane
    statusWidthRight: 40, // How wide the right column is in the status pane
    status: [
      function () { return '<td>Health points:</td><td>' + game.player.hitpoints + '</td>' }
    ],

    // Other UI settings
    roomHeadings: true, // Print the room name as a title when the player enters a room
    textInput: true, // Allow the player to type commands
    cursor: '>', // The cursor, obviously
    cmdEcho: true, // Commands are printed to the screen
    textEffectDelay: 25,
    roomTemplate: [
      '#{cap:{hereName}}',
      '{terse:{hereDesc}}',
      '{objectsHere:You can see {objects} here.}',
      '{exitsHere:You can go {exits}.}'
    ],

    // Conversations settings
    dropdownForConv: true, // Dynamic (TALK TO) conversations will present as a drop-down if true, hyperlinks otherwise
    noTalkTo: 'TALK TO is not a feature in this game.',
    noAskTell: 'ASK/TELL ABOUT is not a feature in this game.',
    npcReactionsAlways: false,
    turnsQuestionsLast: 5,
    givePlayerSayMsg: true,
    givePlayerAskTellMsg: true,

    // Other game play settings
    failCountsAsTurn: false,
    lookCountsAsTurn: false,

    // When save is disabled, objects can be created during game play
    saveDisabled: false,

    // Date and time settings
    dateTime: {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      secondsPerTurn: 60,
      locale: 'en-GB',
      start: new Date('February 14, 2019 09:43:00')
    },

    // Other settings
    // The parser will convert "two" to 2" in player input (can slow down the game)
    convertNumbersInParser: true,
    debug: true, // set to false when releasing to disable debugging commands
    tests: false,
    maxUndo: 10,
    moneyFormat: '$!',
    version: '1.0',
    author: 'Anonymous',
    title: 'My New Game Needs A Title',

    writeScript: function (folder) {
      settings.folder = folder;
      document.writeln('<link rel="stylesheet" href="src/style.css"/>');
      document.writeln('<link rel="stylesheet" href="' + settings.folder + '/style.css"/>');
      if (settings.tests) {
        document.writeln('<script src="lib/test-lib.js"></scr' + 'ipt>');
        document.writeln('<script src="' + settings.folder + '/tests.js"></scr' + 'ipt>');
      }
      document.writeln('<script src="lang/' + settings.lang + '.js"></scr' + 'ipt>');
      if (settings.customExits) {
        document.writeln('<script src="' + settings.folder + '/' + settings.exits + '.js"></scr' + 'ipt>');
      }
      for (const file of settings.libraries) {
        document.writeln('<script src="lib/' + file + '.js"></scr' + 'ipt>');
      }
      for (const lib of settings.customLibraries) {
        for (const file of lib.files) {
          document.writeln('<script src="' + lib.folder + '/' + file + '.js"></scr' + 'ipt>');
        }
      }
      for (const file of settings.files) {
        document.writeln('<script src="' + settings.folder + '/' + file + '.js"></scr' + 'ipt>');
      }
    }
  };

  settings.inventories = [
    { name: 'Items Held', alt: 'itemsHeld', test: settings.isHeldNotWorn, getLoc: function () { return game.player.name } },
    { name: 'Items Worn', alt: 'itemsWorn', test: settings.isWorn, getLoc: function () { return game.player.name } },
    { name: 'Items Here', alt: 'itemsHere', test: settings.isHere, getLoc: function () { return game.player.loc } }
  ];

  // Used by the editor
  // try { SUCCESS } catch (e) {
  //   module.exports = { settings: settings }
  // }

  //  PLAYER, items, cloneObject

  // Should all be language neutral

  const TAKEABLE_DICTIONARY = {
    getVerbs: function () {
      const verbList = this.use === undefined ? [lang.verbs.examine] : [lang.verbs.examine, lang.verbs.use];
      if (this.isAtLoc(game.player.name)) {
        verbList.push(lang.verbs.drop);
      } else {
        verbList.push(lang.verbs.take);
      }
      if (this.read) verbList.push(lang.verbs.read);
      return verbList
    },

    takeable: true,

    drop: function (isMultiple, char) {
      msg(prefix(this, isMultiple) + lang.drop_successful(char, this));
      this.moveToFrom(char.loc);
      return true
    },

    take: function (isMultiple, char) {
      if (this.isAtLoc(char.name)) {
        msg(prefix(this, isMultiple) + lang.already_have(char, this));
        return false
      }
      if (!char.canManipulate(this, 'take')) return false
      msg(prefix(this, isMultiple) + lang.take_successful(char, this));
      this.moveToFrom(char.name);
      if (this.scenery) delete this.scenery;
      return true
    }

  };

  const TAKEABLE = () => TAKEABLE_DICTIONARY;

  const SHIFTABLE = function () {
    const res = {
      shiftable: true
    };
    return res
  };

  const createEnsemble = function (name, members, dict) {
    const res = createItem(name, dict);
    res.ensemble = true;
    res.members = members;
    res.parsePriority = 10;
    res.inventorySkip = true;
    res.takeable = true;
    res.getWorn = function (situation) { return this.isAtLoc(this.members[0].loc, situation) && this.members[0].getWorn() };

    res.byname = function (options) {
      if (!options) options = {};
      let s = '';
      if (options.article === DEFINITE) {
        s = lang.addDefiniteArticle(this);
      }
      if (options.article === INDEFINITE) {
        s = lang.addIndefiniteArticle(this);
      }
      s += this.alias;
      if (options && options.possessive) s += "'s";
      if (this.members[0].getWorn() && options.modified && this.isAllTogether()) { s += ' (worn)'; }
      if (options && options.capital) s = sentenceCase(s);
      // console.log(s)
      return s
    };

    // Tests if all parts are n the same location and either all are worn or none are worn
    // We can use this to determine if the set is together or not too
    res.isAtLoc = function (loc, situation) {
      if (situation !== display.PARSER && situation !== display.SCOPING) return false
      const worn = this.members[0].getWorn();
      for (const member of this.members) {
        if (member.loc !== loc) return false
        if (member.getWorn() !== worn) return false
      }
      return true
    };

    // Tests if all parts are together
    res.isAllTogether = function () {
      const worn = this.members[0].getWorn();
      const loc = this.members[0].loc;
      for (const member of this.members) {
        if (member.loc !== loc) return false
        if (member.breakEnsemble && member.breakEnsemble()) return false
        if (member.getWorn() !== worn) return false
      }
      return true
    };

    res.drop = function (isMultiple, char) {
      msg(prefix(this, isMultiple) + lang.drop_successful(char, this));
      for (const member of this.members) {
        member.moveToFrom(char.loc);
      }
      return true
    };

    res.take = function (isMultiple, char) {
      if (this.isAtLoc(char.name)) {
        msg(prefix(this, isMultiple) + lang.already_have(char, this));
        return false
      }

      if (!char.canManipulate(this, 'take')) return false
      msg(prefix(this, isMultiple) + lang.take_successful(char, this));
      for (const member of this.members) {
        member.moveToFrom(char.name);
        if (member.scenery) delete member.scenery;
      }
      return true
    };

    for (const member of members) {
      member.ensembleMaster = res;
    }
    return res
  };

  const MERCH = function (value, locs) {
    const res = {
      price: value,
      getPrice: function () { return this.price },

      // The price when the player sells the item
      // By default, half the "list" price
      //
      getSellingPrice: function (char) {
        if (w[char.loc].buyingValue) {
          return Math.round(this.getPrice() * (w[char.loc].buyingValue) / 100)
        }
        return Math.round(this.getPrice() / 2)
      },

      // The price when the player buys the item
      // Uses the sellingDiscount, as te shop is selling it!
      getBuyingPrice: function (char) {
        if (w[char.loc].sellingDiscount) {
          return Math.round(this.getPrice() * (100 - w[char.loc].sellingDiscount) / 100)
        }
        return this.getPrice()
      },

      isForSale: function (loc) {
        if (this.doNotClone) return (this.salesLoc === loc)
        return (this.salesLocs.includes(loc))
      },

      canBeSoldHere: function (loc) {
        return w[loc].willBuy && w[loc].willBuy(this)
      },

      purchase: function (isMultiple, char) {
        if (!this.isForSale(char.loc)) return failedmsg(prefix(this, isMultiple) + lang.cannot_purchase_here(char, this))
        const cost = this.getBuyingPrice(char);
        if (char.money < cost) return failedmsg(prefix(this, isMultiple) + lang.cannot_afford(char, this, cost))
        this.purchaseScript(isMultiple, char, cost);
      },

      purchaseScript: function (isMultiple, char, cost) {
        char.money -= cost;
        msg(prefix(this, isMultiple) + lang.purchase_successful(char, this, cost));
        if (this.doNotClone) {
          this.moveToFrom(char.name, char.loc);
          delete this.salesLoc;
        } else {
          cloneObject(this, char.name);
        }
        return SUCCESS
      },

      sell: function (isMultiple, char) {
        if (!this.canBeSoldHere(char.loc)) {
          return failedmsg(prefix(this, isMultiple) + lang.cannot_sell_here(char, this))
        }
        const cost = this.getSellingPrice(char);
        char.money += cost;
        msg(prefix(this, isMultiple) + lang.sell_successful(char, this, cost));
        if (this.doNotClone) {
          this.moveToFrom(char.loc, char.name);
          this.salesLoc = char.loc;
        }
        delete this.loc;
        return SUCCESS
      }
    };
    if (!Array.isArray(locs)) {
      res.doNotClone = true;
      res.salesLoc = locs;
    } else {
      res.salesLocs = locs;
    }
    return res
  };

  // countableLocs should be a dictionary, with the room name as the key, and the number there as the value
  const COUNTABLE = function (countableLocs) {
    const res = $.extend({}, TAKEABLE_DICTIONARY);
    res.countable = true;
    res.countableLocs = countableLocs;
    res.infinity = 'uncountable';

    res.extractNumber = function () {
      const md = /^(\d+)/.exec(this.cmdMatch);
      if (!md) { return false }
      return parseInt(md[1])
    };

    res.templatePreSave = function () {
      const l = [];
      for (const key in this.countableLocs) {
        l.push(key + '=' + this.countableLocs[key]);
      }
      this.customSaveCountableLocs = l.join(',');
      this.preSave();
    };

    res.templatePostLoad = function () {
      const l = this.customSaveCountableLocs.split(',');
      this.countableLocs = {};
      for (const el of l) {
        const parts = el.split('=');
        this.countableLocs[parts[0]] = parseInt(parts[1]);
      }
      delete this.customSaveCountableLocs;
      this.postLoad();
    };

    res.byname = function (options) {
      if (!options) options = {};
      let s = '';
      let count = options.loc ? this.countAtLoc(options.loc) : false;
      if (options.count) {
        count = options.count;
        s = (count === INFINITY ? this.infinity : lang.toWords(count)) + ' ';
      } else if (options.article === DEFINITE) {
        s = 'the ';
      } else if (options.article === INDEFINITE) {
        if (count) {
          switch (count) {
            case 1: s = 'a '; break
            case INFINITY: s = this.infinity + ' '; break
            default: s = lang.toWords(count) + ' ';
          }
        } else {
          s = 'some ';
        }
      }
      if (count === 1) {
        s += this.alias;
      } else if (this.pluralAlias) {
        s += this.pluralAlias;
      } else {
        s += this.alias + 's';
      }
      if (options && options.possessive) s += "'s";
      if (options && options.capital) s = sentenceCase(s);
      return s
    };

    res.getListAlias = function (loc) {
      return sentenceCase(this.pluralAlias ? this.pluralAlias : this.listalias + 's') + ' (' + this.countAtLoc(loc) + ')'
    };

    res.isAtLoc = function (loc, situation) {
      if (!this.countableLocs[loc]) { return false }
      if (situation === display.LOOK && this.scenery) return false
      if (situation === display.SIDE_PANE && this.scenery) return false
      return (this.countableLocs[loc] > 0)
    };

    res.countAtLoc = function (loc) {
      if (!this.countableLocs[loc]) { return 0 }
      return this.countableLocs[loc]
    };

    res.moveToFrom = function (toLoc, fromLoc, count) {
      if (!count) count = this.extractNumber();
      if (!count) count = this.countAtLoc(fromLoc);
      this.takeFrom(fromLoc, count);
      this.giveTo(toLoc, count);
    };

    res.takeFrom = function (loc, count) {
      if (this.countableLocs[loc] !== INFINITY) this.countableLocs[loc] -= count;
      if (this.countableLocs[loc] <= 0) { delete this.countableLocs[loc]; }
      w[loc].itemTaken(this, count);
    };

    res.giveTo = function (loc, count) {
      if (!this.countableLocs[loc]) { this.countableLocs[loc] = 0; }
      if (this.countableLocs[loc] !== INFINITY) this.countableLocs[loc] += count;
      w[loc].itemDropped(this, count);
    };

    res.findSource = function (sourceLoc, tryContainers) {
      // some at the specific location, so use them
      if (this.isAtLoc(sourceLoc)) {
        return sourceLoc
      }

      if (tryContainers) {
        const containers = scopeReachable().filter(el => el.container);
        for (const container of containers) {
          if (container.closed) continue
          if (this.isAtLoc(container.name)) return container.name
        }
      }

      return false
    };

    res.take = function (isMultiple, char) {
      const sourceLoc = this.findSource(char.loc, true);
      if (!sourceLoc) {
        msg(prefix(this, isMultiple) + lang.none_here(char, this));
        return false
      }
      let n = this.extractNumber();
      const m = this.countAtLoc(sourceLoc);
      // if (m === 0) {
      //  msg(prefix(this, isMultiple) + lang.none_here(char, this));
      //  return false;
      // }

      if (!n) { n = m; } // no number specified
      if (n > m) { n = m; } // too big number specified

      msg(prefix(this, isMultiple) + lang.take_successful(char, this, n));
      this.takeFrom(sourceLoc, n);
      this.giveTo(char.name, n);
      if (this.scenery) delete this.scenery;
      return true
    };

    res.drop = function (isMultiple, char) {
      let n = this.extractNumber();
      const m = this.countAtLoc(char.name);
      if (m === 0) {
        msg(prefix(this, isMultiple) + lang.none_held(char, this));
        return false
      }

      if (!n) { m === INFINITY ? 1 : n = m; } // no number specified
      if (n > m) { n = m; } // too big number specified

      msg(prefix(this, isMultiple) + lang.drop_successful(char, this, n));
      this.takeFrom(char.name, n);
      this.giveTo(char.loc, n);
      return true
    };

    return res
  };

  const WEARABLE = function (wear_layer, slots) {
    const res = $.extend({}, TAKEABLE_DICTIONARY);
    res.wearable = true;
    res.wear_layer = wear_layer || false;
    res.slots = slots && wear_layer ? slots : [];

    res.getSlots = function () { return this.slots };
    res.getWorn = function () { return this.worn };

    res.getVerbs = function () {
      if (!this.isAtLoc(game.player.name)) {
        return [lang.verbs.examine, lang.verbs.take]
      } else if (this.getWorn()) {
        if (this.getWearRemoveBlocker(game.player, false)) {
          return [lang.verbs.examine]
        } else {
          return [lang.verbs.examine, lang.verbs.remove]
        }
      } else {
        if (this.getWearRemoveBlocker(game.player, true)) {
          return [lang.verbs.examine, lang.verbs.drop]
        } else {
          return [lang.verbs.examine, lang.verbs.drop, lang.verbs.wear]
        }
      }
    };

    res.icon = () => '<img src="images/garment12.png" />';

    res.getWearRemoveBlocker = function (char, toWear) {
      if (!this.wear_layer) { return false }
      const slots = this.getSlots();
      for (const slot of slots) {
        const outer = char.getOuterWearable(slot);
        if (outer && outer !== this && (outer.wear_layer >= this.wear_layer || outer.wear_layer === 0)) {
          return outer
        }
      }
      return false
    };

    res.canWearRemove = function (char, toWear) {
      const garment = this.getWearRemoveBlocker(char, toWear);
      if (garment) {
        if (toWear) {
          msg(lang.cannot_wear_over(char, this, garment));
        } else {
          msg(lang.cannot_remove_under(char, this, garment));
        }
        return false
      }
      return true
    };

    // Assumes the item is already held
    res.wear = function (isMultiple, char) {
      if (!this.canWearRemove(char, true)) { return false }
      if (!char.canManipulate(this, 'wear')) { return false }
      msg(prefix(this, isMultiple) + this.wearMsg(char, this), { garment: this, actor: char });
      this.worn = true;
      if (this.afterWear) this.afterWear(char);
      return true
    };
    res.wearMsg = lang.wear_successful;

    // Assumes the item is already held
    res.remove = function (isMultiple, char) {
      if (!this.canWearRemove(char, false)) { return false }
      if (!char.canManipulate(this, 'remove')) { return false }
      msg(prefix(this, isMultiple) + this.removeMsg(char, this), { garment: this, actor: char });
      this.worn = false;
      if (this.afterRemove) this.afterRemove(char);
      return true
    };
    res.removeMsg = lang.remove_successful;

    res.byname = function (options) {
      if (!options) options = {};
      let s = '';
      if (options.article === DEFINITE) {
        s = lang.addDefiniteArticle(this);
      }
      if (options.article === INDEFINITE) {
        s = lang.addIndefiniteArticle(this);
      }
      s += this.alias;
      if (options && options.possessive) s += "'s";
      if (this.worn && options.modified && (this.isAtLoc(game.player.name))) { s += ' (worn)'; }
      if (options && options.capital) s = sentenceCase(s);
      return s
    };

    return res
  };

  const CONTAINER = function (openable) {
    const res = CONTAINER_BASE;
    res.closed = openable;
    res.openable = openable;
    res.contentsType = 'container';
    res.listContents = util.listContents;
    res.transparent = false;

    res.getVerbs = function () {
      const arr = [lang.verbs.examine];
      if (this.takeable) {
        arr.push(this.isAtLoc(game.player.name) ? lang.verbs.drop : lang.verbs.take);
      }
      if (this.openable) {
        arr.push(this.closed ? lang.verbs.open : lang.verbs.close);
      }
      return arr
    };

    res.byname = function (options) {
      if (!options) options = {};
      let prefix = '';
      if (options.article === DEFINITE) {
        prefix = lang.addDefiniteArticle(this);
      }
      if (options.article === INDEFINITE) {
        prefix = lang.addIndefiniteArticle(this);
      }
      const contents = this.getContents(display.LOOK);
      let s = prefix + this.alias;
      if (options && options.possessive) s += "'s";
      if (contents.length > 0 && options.modified && (!this.closed || this.transparent)) {
        s += ' (' + lang.contentsForData[this.contentsType].prefix + this.listContents(contents) + lang.contentsForData[this.contentsType].suffix + ')';
      }
      if (options && options.capital) s = sentenceCase(s);
      return s
    };

    res.lookinside = function (isMultiple, char) {
      if (this.closed && !this.transparent) {
        msg(prefix(this, isMultiple) + lang.nothing_inside(char));
        return false
      }
      msg(prefix(this, isMultiple) + lang.look_inside(char, this));
      return true
    };

    res.open = function (isMultiple, char) {
      if (!this.openable) {
        msg(prefix(this, isMultiple) + lang.cannot_open(char, this));
        return false
      } else if (!this.closed) {
        msg(prefix(this, isMultiple) + lang.already(this));
        return false
      }
      if (this.locked) {
        if (this.testKeys(char)) {
          this.closed = false;
          msg(prefix(this, isMultiple) + lang.unlock_successful(char, this));
          this.openMsg(isMultiple, char);
          return true
        } else {
          msg(prefix(this, isMultiple) + lang.locked(char, this));
          return false
        }
      }
      this.closed = false;
      this.openMsg(isMultiple, char);
      return true
    };

    res.openMsg = function (isMultiple, char) {
      msg(prefix(this, isMultiple) + lang.open_successful(char, this));
    };

    res.close = function (isMultiple, char) {
      if (!this.openable) {
        msg(prefix(this, isMultiple) + lang.cannot_close(char, this));
        return false
      } else if (this.closed) {
        msg(prefix(this, isMultiple) + lang.already(this));
        return false
      }
      this.hereVerbs = ['Examine', 'Open'];
      this.closed = true;
      this.closeMsg(isMultiple, char);
      return true
    };

    res.closeMsg = function (isMultiple, char) {
      msg(prefix(this, isMultiple) + lang.close_successful(char, this));
    };

    res.icon = function () {
      return ('<img src="images/' + (this.closed ? 'closed' : 'opened') + '12.png" />')
    };

    res.canReachThrough = function () { return !this.closed };
    res.canSeeThrough = function () { return !this.closed || this.transparent };

    return res
  };

  const SURFACE = function () {
    const res = CONTAINER_BASE;
    res.closed = false;
    res.openable = false;
    res.byname = CONTAINER().byname;
    res.listContents = util.listContents;
    res.contentsType = 'surface';
    res.canReachThrough = () => true;
    res.canSeeThrough = () => true;
    return res
  };

  const OPENABLE = function (alreadyOpen) {
    const res = {};
    res.closed = !alreadyOpen;
    res.openable = true;

    res.getVerbs = function () {
      const arr = [lang.verbs.examine];
      if (this.takeable) {
        arr.push(this.isAtLoc(game.player.name) ? lang.verbs.drop : lang.verbs.take);
      }
      arr.push(this.closed ? lang.verbs.open : lang.verbs.close);
      return arr
    };

    res.byname = function (options) {
      if (!options) options = {};
      let s = '';
      if (options.article === DEFINITE) {
        s = lang.addDefiniteArticle(this);
      }
      if (options.article === INDEFINITE) {
        s = lang.addIndefiniteArticle(this);
      }
      s += this.alias;
      if (options && options.possessive) s += "'s";
      if (!this.closed && options.modified) { s += ' (open)'; }
      return s
    };

    const c = CONTAINER();
    res.open = c.open;
    res.close = c.close;
    res.openMsg = c.openMsg;
    res.closeMsg = c.closeMsg;
    return res
  };

  const locked_WITH = function (keyNames) {
    if (typeof keyNames === 'string') { keyNames = [keyNames]; }
    if (keyNames === undefined) { keyNames = []; }
    const res = {
      keyNames: keyNames,
      locked: true,
      lock: function (isMultiple, char) {
        if (this.locked) {
          msg(already(this));
          return false
        }
        if (!this.testKeys(char, true)) {
          msg(no_key(char, this));
          return false
        }
        if (!this.closed) {
          this.closed = true;
          msg(close_successful(char, this));
        }
        msg(lock_successful(char, this));
        this.locked = true;
        return true
      },
      unlock: function (isMultiple, char) {
        if (!this.locked) {
          msg(already(this));
          return false
        }
        if (!this.testKeys(char, false)) {
          msg(no_key(char, this));
          return false
        }
        msg(unlock_successful(char, this));
        this.locked = false;
        return true
      },
      testKeys: function (char, toLock) {
        for (const s of keyNames) {
          if (!w[s]) {
            errormsg('The key name for this container, `' + s + '`, does not match any key in the game.');
            return false
          }
          if (w[s].isAtLoc(char.name)) {
            return true
          }
        }
        return false
      }
    };
    return res
  };

  const FURNITURE = function (options) {
    const res = {
      testForPosture: (char, posture) => true,
      getoff: function (isMultiple, char) {
        if (!char.posture) {
          char.msg(already(char));
          return false
        }
        if (char.posture) {
          char.msg(lang.stop_posture(char)); // stop_posture handles details
          return true
        }
      }
    };
    res.assumePosture = function (isMultiple, char, posture, success_msg, adverb) {
      if (char.posture === posture && char.postureFurniture === this.name) {
        char.msg(already(char));
        return false
      }
      if (!this.testForPosture(char, posture)) {
        return false
      }
      if (char.posture) {
        char.msg(stop_posture(char));
      }
      char.posture = posture;
      char.postureFurniture = this.name;
      char.postureAdverb = adverb === undefined ? 'on' : adverb;
      char.msg(success_msg(char, this));
      if (typeof this['on' + posture] === 'function') this['on' + posture](char);
      return true
    };
    if (options.sit) {
      res.siton = function (isMultiple, char) {
        return this.assumePosture(isMultiple, char, 'sitting', lang.sit_on_successful)
      };
    }
    if (options.stand) {
      res.standon = function (isMultiple, char) {
        return this.assumePosture(isMultiple, char, 'standing', lang.stand_on_successful)
      };
    }
    if (options.recline) {
      res.reclineon = function (isMultiple, char) {
        return this.assumePosture(isMultiple, char, 'reclining', lang.recline_on_successful)
      };
    }

    return res
  };

  const SWITCHABLE = function (alreadyOn) {
    const res = {};
    res.switchedon = alreadyOn;

    res.getVerbs = function () {
      const arr = [lang.verbs.examine];
      if (this.takeable) {
        arr.push(this.isAtLoc(game.player.name) ? lang.verbs.drop : lang.verbs.take);
      }
      arr.push(this.switchedon ? lang.verbs.switchoff : lang.verbs.switchon);
      return arr
    };

    res.switchon = function (isMultiple, char) {
      if (this.switchedon) {
        char.msg(prefix(this, isMultiple) + lang.already(this));
        return false
      }
      if (!this.checkCanSwitchOn()) {
        return false
      }
      char.msg(lang.turn_on_successful(char, this));
      this.doSwitchon();
      return true
    };

    res.doSwitchon = function () {
      const lighting = game.dark;
      this.switchedon = true;
      game.update();
      if (lighting !== game.dark) {
        game.room.description();
      }
    };

    res.checkCanSwitchOn = () => true;

    res.switchoff = function (isMultiple, char) {
      if (!this.switchedon) {
        char.msg(prefix(this, isMultiple) + lang.already(this));
        return false
      }
      char.msg(lang.turn_off_successful(char, this));
      this.doSwitchoff();
      return true
    };

    res.doSwitchoff = function () {
      const lighting = game.dark;
      this.switchedon = false;
      game.update();
      if (lighting !== game.dark) {
        game.room.description();
      }
    };

    return res
  };

  // Ideally Quest will check components when doing a command for the whole
  // I think?

  const COMPONENT = function (nameOfWhole) {
    const res = {
      scenery: true,
      component: true,
      loc: nameOfWhole,
      takeable: true, // Set this as it has its own take attribute
      isAtLoc: function (loc, situation) {
        if (typeof loc !== 'string') loc = loc.name;
        if (situation !== display.PARSER) return false
        const cont = w[this.loc];
        if (cont.isAtLoc(loc)) { return true }
        return cont.isAtLoc(loc)
      },
      take: function (isMultiple, char) {
        msg(prefix(this, isMultiple) + lang.cannot_take_component(char, this));
        return false
      }
    };
    if (!w[nameOfWhole]) debugmsg('Whole is not define: ' + nameOfWhole);
    w[nameOfWhole].componentHolder = true;
    return res
  };

  const EDIBLE = function (isLiquid) {
    const res = $.extend({}, TAKEABLE_DICTIONARY);
    res.isLiquid = isLiquid;
    res.eat = function (isMultiple, char) {
      if (this.isLiquid) {
        msg(prefix(this, isMultiple) + lang.cannot_eat(char, this));
        return false
      }
      msg(prefix(this, isMultiple) + lang.eat_successful(char, this));
      this.loc = null;
      if (this.onIngesting) this.onIngesting(char);
      return true
    };
    res.drink = function (isMultiple, char) {
      if (!this.isLiquid) {
        msg(prefix(this, isMultiple) + lang.cannot_drink(char, this));
        return false
      }
      msg(prefix(this, isMultiple) + lang.drink_successful(char, this));
      this.loc = null;
      if (this.onIngesting) this.onIngesting(char);
      return true
    };
    res.ingest = function (isMultiple, char) {
      if (this.isLiquid) {
        return this.drink(isMultiple, char)
      } else {
        return this.eat(isMultiple, char)
      }
    };
    res.getVerbs = function () {
      const arr = [lang.verbs.examine];
      if (this.isAtLoc(game.player.name)) {
        return [lang.verbs.examine, lang.verbs.drop, this.isLiquid ? lang.verbs.drink : lang.verbs.eat]
      } else {
        return [lang.verbs.examine, lang.verbs.take]
      }
    };
    return res
  };

  const VESSEL = function (capacity) {
    const res = {};
    res.vessel = true;
    res.containedLiquidName = false;
    res.volumeContained = 0;
    res.capacity = capacity;

    res.byname = function (options) {
      if (!options) options = {};
      let s = '';
      if (options.article === DEFINITE) {
        s = lang.addDefiniteArticle(this);
      }
      if (options.article === INDEFINITE) {
        s = lang.addIndefiniteArticle(this);
      }
      s += this.alias;
      if (options && options.possessive) s += "'s";
      if (options.modified && this.volumeContained && this.volumeContained > 0) {
        if (this.volumeContained >= this.capacity) {
          s += ' (full of ' + this.containedLiquidName + ')';
        } else {
          s += ' (' + this.volumeContained + ' ' + VOLUME_UNITS + ' ' + this.containedLiquidName + ')';
        }
      }
      if (options && options.capital) s = sentenceCase(s);
      return s
    };

    res.fill = function (isMultiple, char, liquid) {
      if (this.testRestrictions && !this.testRestrictions(liquid, char)) return false
      const source = liquid.source(char);
      if (!source) return falsemsg(lang.none_here(char, liquid))
      if (!this.mix && this.containedLiquidName !== liquid.name && this.volumeContained > 0) return falsemsg(lang.cannot_mix(char, this))
      if (this.volumeContained >= this.capacity) return falsemsg(prefix(this, isMultiple) + lang.already(this))

      let volumeAdded = this.capacity - this.volumeContained;
      // limited volume available?
      if (source.getVolume) {
        const volumeAvailable = source.getVoume(liquid);
        if (volumeAvailable < volumeAdded) {
          volumeAdded = volumeAvailable;
        }
      }
      if (this.mix && liquid.name !== this.containedLiquidName !== liquid.name) {
        this.mix(liquid, volumeAdded);
      } else {
        this.volumeContained += volumeAdded;
        // Slight concerned that JavaScript using floats for everything means you could have a vessel 99.99% full, but that
        // does not behave as a full vessel, so if the vessel is pretty much full set the volume contained to the capacity
        if (this.volumeContained * 1.01 > this.capacity) this.volumeContained = this.capacity;
        this.containedLiquidName = liquid.name;
        msg(prefix(this, isMultiple) + lang.fill_successful(char, this));
        if (this.putInResponse) this.putInResponse();
      }
      return true
    };

    res.empty = function (isMultiple, char) {
      if (this.volumeContained >= this.capacity) {
        msg(prefix(this, isMultiple) + lang.already(this));
        return false
      }
      // check if liquid available
      msg(prefix(this, isMultiple) + lang.empty_successful(char, this));
      return true
    };

    return res
  };

  // If locs changes, that changes are not saved!!!

  // A room or item can be a source of one liquid by giving it a "isSourceOf" function:
  // room.isSourceOf("water")
  //

  const LIQUID = function (locs) {
    const res = EDIBLE(true);
    res.liquid = true;
    res.pronouns = lang.pronouns.massnoun;
    res.pluralAlias = '*';
    res.drink = function (isMultiple, char, options) {
      msg(prefix(this, isMultiple) + 'drink: ' + options.verb + ' char: ' + char.name);
    };
    res.sourcedAtLoc = function (loc) {
      if (typeof loc !== 'string') loc = loc.name;
      return w[loc].isSourceOf(this.name)
    };
    res.source = function (chr) {
      if (chr === undefined) chr = game.player;
      // Is character a source?
      if (chr.isSourceOf && chr.isSourceOf(this.name)) return chr
      // Is the room a source?
      if (w[chr.loc].isSourceOf && w[chr.loc].isSourceOf(this.name)) return w[chr.loc]
      const items = scopeHeldBy(chr).concat(scopeHeldBy(chr.loc));
      for (const obj of items) {
        if (obj.isSourceOf && obj.isSourceOf(this.name)) return obj
      }
      return false
    };
    res.isAtLoc = function (loc) { return false };
    return res
  };

  const TRANSIT_BUTTON = function (nameOfTransit) {
    const res = {
      loc: nameOfTransit,
      transitButton: true,
      getVerbs: function () { return [lang.verbs.examine, 'Push'] },
      push: function () {
        const transit = w[this.loc];
        const exit = transit[transit.transitDoorDir];
        if (this.locked) {
          printOrRun(game.player, this, 'transitLocked');
          return false
        } else if (exit.name === this.transitDest) {
          printOrRun(game.player, this, 'transitAlreadyHere');
          return false
        } else {
          printOrRun(game.player, this, 'transitGoToDest');
          if (typeof w[this.loc].transitOnMove === 'function') w[this.loc].transitOnMove(this.transitDest, exit.name);
          exit.name = this.transitDest;
          return true
        }
      }
    };
    return res
  };

  // This is for rooms
  const TRANSIT = function (exitDir) {
    const res = {
      saveExitDests: true,
      transitDoorDir: exitDir,
      beforeEnter: function () {
        this[this.transitDoorDir].name = game.player.previousLoc;
      },
      getTransitButtons: function (includeHidden, includeLocked) {
        return this.getContents(display.LOOK).filter(function (el) {
          if (!el.transitButton) return false
          if (!includeHidden && el.hidden) return false
          if (!includeLocked && el.locked) return false
          return true
        })
      }
    };
    return res
  };

  // This function is useful only to the TRANSIT template so is here
  function transitOfferMenu () {
    if (typeof this.transitCheck === 'function' && !this.transitCheck()) {
      if (this.transitAutoMove) world.setRoom(game.player, game.player.previousLoc, this.transitDoorDir);
      return false
    }
    const buttons = this.getTransitButtons(true, false);
    const transitDoorDir = this.transitDoorDir;
    const room = this;
    showMenu(this.transitMenuPrompt, buttons.map(el => el.transitDestAlias), function (result) {
      for (const button of buttons) {
        if (buttons[i].transitDestAlias === result) {
          if (room[transitDoorDir].name === button.transitDest) {
            printOrRun(game.player, button, 'transitAlreadyHere');
          } else {
            printOrRun(game.player, button, 'transitGoToDest');
            if (typeof room.transitOnMove === 'function') room.transitOnMove(button.transitDest, room[transitDoorDir].name);
          }

          room[transitDoorDir].name = button.transitDest;
          if (room.transitAutoMove) world.setRoom(game.player, button.transitDest, room[transitDoorDir]);
        }
      }
    });
  }

  const PLAYER = function () {
    const res = {
      pronouns: lang.pronouns.secondperson,
      player: true,
      // The following are used also by NPCs, so we can use the same functions for both
      canReachThrough: () => true,
      canSeeThrough: () => true,
      getAgreement: () => true,
      getContents: CONTAINER_BASE.getContents,
      pause: NULL_FUNC,
      canManipulate: () => true,
      canMove: () => true,
      canTalk: () => true,
      canPosture: () => true,
      canTakeDrop: () => true,
      mentionedTopics: [],

      getHolding: function () {
        return this.getContents(display.LOOK).filter(function (el) { return !el.getWorn() })
      },

      getWearing: function () {
        return this.getContents(display.LOOK).filter(function (el) { return el.getWorn() && !el.ensemble })
      },

      getStatusDesc: function () {
        if (!this.posture) return false
        return this.posture + ' ' + this.postureAdverb + ' ' + w[this.postureFurniture].byname({ article: DEFINITE })
      },

      isAtLoc: function (loc, situation) {
        if (situation === display.LOOK) return false
        if (situation === display.SIDE_PANE) return false
        if (typeof loc !== 'string') loc = loc.name;
        return (this.loc === loc)
      },

      getOuterWearable: function (slot) {
        /*
        console.log("---------------------------")
        console.log(this.name);
        console.log(scope(isWornBy, {npc:this}));
        console.log(scope(isWornBy, {npc:this}).filter(el => el.getSlots().includes(slot)));
        */

        const clothing = this.getWearing().filter(function (el) {
          if (typeof el.getSlots !== 'function') {
            console.log('Item with worn set to true, but no getSlots function');
            console.log(el);
          }
          return el.getSlots().includes(slot)
        });

        if (clothing.length === 0) { return false }
        let outer = clothing[0];
        for (const garment of clothing) {
          if (garment.wear_layer > outer.wear_layer) {
            outer = garment;
          }
        }
        return outer
      },

      // Also used by NPCs, so has to allow for that
      msg: function (s, params) {
        msg(s, params);
      },
      byname: function (options) {
      // console.log("npc byname " + this.name)
        if (options === undefined) options = {};

        if (this.pronouns === lang.pronouns.firstperson || this.pronouns === lang.pronouns.secondperson) {
          let s = options.possessive ? this.pronouns.poss_adj : this.pronouns.subjective;
          if (options.capital) {
            s = sentenceCase(s);
          }
          return s
        }

        if (options.group && this.followers.length > 0) {
          options.group = false;
          options.lastJoiner = lang.list_and;
          this.followers.unshift(this);
          let s = formatList(this.followers, options);
          this.followers.shift();
          if (options && options.possessive) s += "'s";
          if (options && options.capital) s = sentenceCase(s);
          return s
        }

        let s = this.alias;
        if (options.article === DEFINITE) {
          s = lang.addDefiniteArticle(this) + this.alias;
        }
        if (options.article === INDEFINITE) {
          s = lang.addIndefiniteArticle(this) + this.alias;
        }

        const state = this.getStatusDesc();
        const held = this.getHolding();
        const worn = this.getWearingVisible();
        if (options.modified) {
          const list = [];
          if (state) {
            list.push(state);
          }
          if (held.length > 0) {
            list.push('holding ' + formatList(held, { article: INDEFINITE, lastJoiner: lang.list_and, modified: false, nothing: lang.list_nothing, loc: this.name, npc: true }));
          }
          if (worn.length > 0) {
            list.push('wearing ' + formatList(worn, { article: INDEFINITE, lastJoiner: lang.list_and, modified: false, nothing: lang.list_nothing, loc: this.name, npc: true }));
          }
          if (list.length > 0) s += ' (' + formatList(list, { lastJoiner: ';' + lang.list_and, sep: ';' }) + ')';
        }

        if (options && options.possessive) {
          if (this.pronouns.possessive_name) {
            s = this.pronouns.possessive_name;
          } else {
            s += "'s";
          }
        }
        if (options && options.capital) s = sentenceCase(s);
        return s
      }

    };
    return res
  };

  // @DOC
  // ## The Text Processor Function
  // @UNDOC

  // @DOC
  // Returns a string in which all the text processor directives have been resolved, using the optionasl parameters.
  // More details [here(https://github.com/ThePix/QuestJS/wiki/The-Text-Processor).
  function processText (str, params) {
    if (params === undefined) {
      params = {};
    }
    if (typeof str !== 'string') {
      str = '' + str;
    }
    params.tpOriginalString = str;
    if (tp.usedStrings.includes(str)) {
      params.tpFirstTime = false;
    } else {
      tp.usedStrings.push(str);
      params.tpFirstTime = true;
    }
    // console.log(params)
    // try {
    return tp.processText(str, params)
    // } catch (err) {
    //  errormsg("Text processor string caused an error, returning unmodified (reported error: " + err + ")");
    //  return str;
    // }
  }

  // Most of the text processors are set up in text.js; these are the language specific ones.
  const tp = {
    text_processors: {}
  };

  tp.usedStrings = [];

  // Use this to add you custom text processor
  // Should take a string array as a parameter (the input text,
  // excluding the curly braces, name and colon),
  // and return a string.
  tp.addDirective = function (name, fn) {
    tp.text_processors[name] = fn;
  };

  tp.processText = function (str, params) {
    const s = tp.findFirstToken(str);
    if (s) {
      let arr = s.split(':');
      let left = arr.shift();
      if (typeof tp.text_processors[left] !== 'function') {
        if (left === 'player') {
          arr.unshift(game.player.name);
          left = 'show';
        } else if (w[left]) {
          arr.unshift(left);
          left = 'show';
        } else if (arr.length === 0) {
          arr = left.split('.');
          left = 'show';
        } else {
          errormsg("Attempting to use unknown text processor directive '" + left + "' (<i>" + params.tpOriginalString + '</i>)');
          return str
        }
      }
      str = str.replace('{' + s + '}', tp.text_processors[left](arr, params));
      str = tp.processText(str, params);
    }
    return str
  };

  // Find the first token. This is the first to end, so
  // we get nested.
  tp.findFirstToken = function (s) {
    const end = s.indexOf('}');
    if (end === -1) { return false }
    const start = s.lastIndexOf('{', end);
    if (start === -1) {
      errormsg('Failed to find starting curly brace in text processor (<i>' + s + '</i>)');
      return false
    }
    return s.substring(start + 1, end)
  };

  tp.text_processors.i = function (arr, params) { return '<i>' + arr.join(':') + '</i>' };
  tp.text_processors.b = function (arr, params) { return '<b>' + arr.join(':') + '</b>' };
  tp.text_processors.u = function (arr, params) { return '<u>' + arr.join(':') + '</u>' };
  tp.text_processors.s = function (arr, params) { return '<strike>' + arr.join(':') + '</strike>' };
  tp.text_processors.sup = function (arr, params) { return '<sup>' + arr.join(':') + '</sup>' };
  tp.text_processors.sub = function (arr, params) { return '<sub>' + arr.join(':') + '</sub>' };
  tp.text_processors.huge = function (arr, params) { return '<span style="font-size:2em">' + arr.join(':') + '</span>' };
  tp.text_processors.big = function (arr, params) { return '<span style="font-size:1.5em">' + arr.join(':') + '</span>' };
  tp.text_processors.small = function (arr, params) { return '<span style="font-size:0.8em">' + arr.join(':') + '</span>' };
  tp.text_processors.tiny = function (arr, params) { return '<span style="font-size:0.6em">' + arr.join(':') + '</span>' };
  tp.text_processors.smallcaps = function (arr, params) { return '<span style="font-variant:small-caps">' + arr.join(':') + '</span>' };

  tp.text_processors.rainbow = function (arr, params) {
    const s = arr.pop();
    const colours = arr.length === 0 ? COLOURS : arr;
    let result = '';
    for (let i = 0; i < s.length; i++) {
      result += '<span style="color:' + randomFromArray(colours) + '">' + s.charAt(i) + '</span>';
    }
    return result
  };

  tp._charSwap = function (c, upper, lower) {
    if (c.match(/[A-Z]/)) return String.fromCharCode(c.charCodeAt(0) - 'A'.charCodeAt(0) + upper)
    if (c.match(/[a-z]/)) return String.fromCharCode(c.charCodeAt(0) - 'a'.charCodeAt(0) + lower)
    return c
  };

  // Try 391:3AC for Greek, 402:431 for Cyrillic, 904:904 for Devanagari
  tp.text_processors.encode = function (arr, params) {
    const upper = parseInt(arr.shift(), 16);
    const lower = parseInt(arr.shift(), 16);
    const s = arr.shift();
    console.log(upper);
    console.log(lower);
    console.log(s);
    let result = '';
    for (let i = 0; i < s.length; i++) {
      result += tp._charSwap(s.charAt(i), upper, lower);
    }
    return result
  };

  tp.text_processors.rainbow = function (arr, params) {
    const s = arr.pop();
    const colours = arr.length === 0 ? COLOURS : arr;
    let result = '';
    for (let i = 0; i < s.length; i++) {
      result += '<span style="color:' + randomFromArray(colours) + '">' + s.charAt(i) + '</span>';
    }
    return result
  };

  tp.text_processors.font = function (arr, params) {
    const f = arr.shift();
    return '<span style="font-family:' + f + '">' + arr.join(':') + '</span>'
  };

  tp.text_processors.colour = function (arr, params) {
    const c = arr.shift();
    return '<span style="color:' + c + '">' + arr.join(':') + '</span>'
  };

  tp.text_processors.color = tp.text_processors.colour;

  tp.text_processors.back = function (arr, params) {
    const c = arr.shift();
    return '<span style="background-color:' + c + '">' + arr.join(':') + '</span>'
  };

  tp.text_processors.random = function (arr, params) {
    return arr[Math.floor(Math.random() * arr.length)]
  };

  tp._findObject = function (name, params) {
    if (params && params[name]) return typeof params[name] === 'string' ? w[params[name]] : params[name]
    if (name === 'player') return game.player
    return w[name]
  };

  tp.text_processors.show = function (arr, params) {
    let name = arr.shift();
    const obj = tp._findObject(name, params);
    if (!obj) {
      errormsg("Failed to find object '" + name + "' in text processor 'show' (<i>" + params.tpOriginalString + '</i>)');
      return false
    }
    name = arr.shift();
    const val = obj[name];
    if (typeof val === 'function') {
      return val()
    } else {
      return val
    }
  };

  tp.text_processors.money = function (arr, params) {
    const name = arr.shift();
    if (!name.match(/^\d+$/)) {
      const obj = tp._findObject(name, params);
      if (!obj) {
        errormsg("Failed to find object '" + name + "' in text processor 'money' (<i>" + params.tpOriginalString + '</i>)');
        return false
      }
      if (obj.loc === game.player.name && obj.getSellingPrice) {
        return displayMoney(obj.getSellingPrice(game.player))
      }
      if (obj.loc === game.player.name && obj.getBuyingPrice) {
        return displayMoney(obj.getBuyingPrice(game.player))
      }
      if (obj.getPrice) {
        return displayMoney(obj.getPrice())
      }
      if (obj.price) {
        return displayMoney(obj.price)
      }
      if (obj.money) {
        return displayMoney(obj.money)
      }
      errormsg("Failed to find a price for object '" + name + "' in text processor (<i>" + params.tpOriginalString + '</i>)');
      return false
    }
    return displayMoney(parseInt(name))
  };
  tp.text_processors.$ = tp.text_processors.money;

  tp.text_processors.if = function (arr, params) {
    return this.handleIf(arr, params, false)
  };

  tp.text_processors.ifNot = function (arr, params) {
    return this.handleIf(arr, params, true)
  };

  tp.text_processors.ifHere = function (arr, params) {
    return this.handleIfHere(arr, params, false)
  };

  tp.text_processors.ifNotHere = function (arr, params) {
    return this.handleIfHere(arr, params, true)
  };

  tp.text_processors.ifLessThan = function (arr, params) {
    return this.handleIf(arr, params, false)
  };

  tp.text_processors.ifMoreThan = function (arr, params) {
    return this.handleIf(arr, params, true)
  };

  tp.text_processors.handleIf = function (arr, params, reverse) {
    let name = arr.shift(); let flag;
    const obj = tp._findObject(name, params);
    if (!obj) {
      errormsg("Failed to find object '" + name + "' in text processor 'if' (<i>" + params.tpOriginalString + '</i>)');
      return false
    }
    name = arr.shift();
    if (obj[name] === undefined || typeof obj[name] === 'boolean') {
      flag = obj[name];
      if (flag === undefined) flag = false;
    } else {
      let value = arr.shift();
      if (typeof obj[name] === 'number') {
        if (isNaN(value)) {
          errormsg("Trying to compare a numeric attribute, '" + name + "' with a string.");
          return false
        }
        value = parseInt(value);
      }
      flag = (obj[name] === value);
    }
    if (reverse) flag = !flag;
    return (flag ? arr[0] : (arr[1] ? arr[1] : ''))
  };

  tp.text_processors.handleIfHere = function (arr, params, reverse) {
    const name = arr.shift();
    const obj = tp._findObject(name, params);
    if (!obj) {
      errormsg("Failed to find object '" + name + "' in text processor 'ifHere' (<i>" + params.tpOriginalString + '</i>)');
      return false
    }
    let flag = obj.isAtLoc(game.player.loc, display.ALL);
    if (reverse) flag = !flag;
    return (flag ? arr[0] : (arr[1] ? arr[1] : ''))
  };

  tp.text_processors.handleIfLessMoreThan = function (arr, params, moreThan) {
    let name = arr.shift();
    let flag = {};
    const obj = tp._findObject(name, params);
    if (!obj) {
      errormsg("Failed to find object '" + name + "' in text processor 'ifLessMoreThan' (<i>" + params.tpOriginalString + '</i>)');
      return false
    }
    name = arr.shift();
    if (typeof obj[name] !== 'number') {
      errormsg("Trying to use ifLessThan with a non-numeric (or nonexistent) attribute, '" + name + "'.");
      return false
    }
    let value = arr.shift();
    if (isNaN(value)) {
      errormsg("Trying to compare a numeric attribute, '" + name + "' with a string.");
      return false
    }
    value = parseInt(value);
    flag = moreThan ? (obj[name] > value) : (obj[name] < value);
    return (flag ? arr[0] : (arr[1] ? arr[1] : ''))
  };

  tp.text_processors.img = function (arr, params) {
    return '<img src="images/' + arr[0] + '" title="' + arr[1] + '" alt="' + arr[2] + '"/>'
  };

  tp.text_processors.once = function (arr, params) {
    return params.tpFirstTime ? arr.join(':') : ''
  };

  tp.text_processors.notOnce = function (arr, params) {
    return params.tpFirstTime ? '' : arr.join(':')
  };

  tp.text_processors.cmd = function (arr, params) {
    if (arr.length === 1) {
      return io.cmdLink(arr[0], arr[0])
    } else {
      return io.cmdLink(arr[0], arr[1])
    }
  };

  tp.text_processors.command = function (arr, params) {
    if (arr.length === 1) {
      return io.cmdLink(arr[0], arr[0])
    } else {
      return io.cmdLink(arr[0], arr[1])
    }
  };

  tp.text_processors.param = function (arr, params) {
    const x = params[arr[0]];
    if (x === undefined) {
      // errormsg("In text processor param, could not find a value with the key '" + arr[0] + "'. Check the console (F12) to see what params is. [" + params.tpOriginalString + "]");
      console.log('params:');
      console.log(params);
      return false
    } else if (arr.length === 1) {
      return x
    } else {
      const att = (typeof x === 'string' ? w[x][arr[1]] : x[arr[1]]);
      if (typeof att !== 'function') return att
      const arr2 = [];
      arr.shift();
      arr.shift();
      for (const el of arr) arr2.push(params[el] ? params[el] : el);
      return att(...arr2)
    }
  };

  tp.text_processors.terse = function (arr, params) {
    if ((game.verbosity === TERSE && game.room.visited === 0) || game.verbosity === VERBOSE) {
      return sentenceCase(arr.join(':'))
    } else {
      return ''
    }
  };

  tp.text_processors.cap = function (arr, params) {
    return sentenceCase(arr.join(':'))
  };

  tp.text_processors.hereDesc = function (arr, params) {
    const room = w[game.player.loc];
    if (typeof room.desc === 'function') return room.desc()
    if (typeof room.desc === 'string') return room.desc
    return 'This is a room in dire need of a description.'
  };

  tp.text_processors.hereName = function (arr, params) {
    const room = w[game.player.loc];
    return room.byname({ article: DEFINITE })
  };

  tp.text_processors.objectsHere = function (arr, params) {
    const listOfOjects = scopeHereListed();
    return listOfOjects.length === 0 ? '' : arr.join(':')
  };

  tp.text_processors.exitsHere = function (arr, params) {
    const list = util.exitList();
    return list.length === 0 ? '' : arr.join(':')
  };

  tp.text_processors.objects = function (arr, params) {
    const listOfOjects = scopeHereListed();
    return formatList(listOfOjects, { article: INDEFINITE, lastJoiner: lang.list_and, modified: true, nothing: lang.list_nothing, loc: game.player.loc })
  };

  tp.text_processors.exits = function (arr, params) {
    const list = util.exitList();
    return formatList(list, { lastJoiner: lang.list_or, nothing: lang.list_nowhere })
  };

  // Then {nv:char:try} to get

  tp.findSubject = function (arr, params) {
    let subject;
    if (params[arr[0]]) {
      subject = params[arr[0]];
      if (typeof subject === 'string') subject = w[subject];
      if (subject === undefined) {
        errormsg("In text processor findSubject, could not find a subject with '" + arr[0] + "'. Check the console (F12) to see what params is. [" + params.tpOriginalString + ']');
        console.log('params:');
        console.log(params);
        console.fdjkh.fkgh.fdkyh = 3;
        return false
      }
    } else {
      subject = w[arr[0]];
      if (subject === undefined) {
        errormsg("In text processor findSubject, could not find a key called '" + arr[0] + "'. [" + params.tpOriginalString + ']');
        console.log(arr[0]);
        console.log('params:');
        console.log(params);
        console.fdjkh.fkgh.fdkyh = 3;
        return false
      }
    }
    return subject
  };

  tp.text_processors.nm = function (arr, params) {
    const subject = tp.findSubject(arr, params);
    if (!subject) return false
    const opt = {};
    if (arr[1] === 'the') opt.article = DEFINITE;
    if (arr[1] === 'a') opt.article = INDEFINITE;
    return arr[2] === 'true' ? sentenceCase(subject.byname(opt)) : subject.byname(opt)
  };

  tp.text_processors.nms = function (arr, params) {
    const subject = tp.findSubject(arr, params);
    if (!subject) return false
    const opt = { possessive: true };
    if (arr[1] === 'the') opt.article = DEFINITE;
    if (arr[1] === 'a') opt.article = INDEFINITE;
    return arr[2] === 'true' ? sentenceCase(subject.byname(opt)) : subject.byname(opt)
  };

  // {name:subject:verb:capitalise}

  tp.text_processors.nv = function (arr, params) {
    const subject = tp.findSubject(arr, params);
    if (!subject) return false
    return lang.nounVerb(subject, arr[1], arr[2] === 'true')
  };

  tp.text_processors.pv = function (arr, params) {
    const subject = tp.findSubject(arr, params);
    if (!subject) return false
    return lang.pronounVerb(subject, arr[1], arr[2] === 'true')
  };

  tp.text_processors.vn = function (arr, params) {
    const subject = tp.findSubject(arr, params);
    if (!subject) return false
    return lang.verbNoun(subject, arr[1], arr[2] === 'true')
  };

  tp.text_processors.vp = function (arr, params) {
    const subject = tp.findSubject(arr, params);
    if (!subject) return false
    return lang.verbPronoun(subject, arr[1], arr[2] === 'true')
  };

  tp.text_processors.cj = function (arr, params) {
    const subject = tp.findSubject(arr, params);
    if (!subject) return false
    return arr[2] === 'true' ? sentenceCase(lang.conjugate(subject, arr[1])) : lang.conjugate(subject, arr[1])
  };

  // {name:subject:article:capitalise}

  tp.handlePronouns = function (arr, params, pronoun) {
    const subject = tp.findSubject(arr, params);
    if (!subject) return false
    return arr[2] === 'true' ? sentenceCase(subject.pronouns[pronoun]) : subject.pronouns[pronoun]
  };

  tp.text_processors.pa = function (arr, params) {
    return tp.handlePronouns(arr, params, 'poss_adj')
  };

  tp.text_processors.ob = function (arr, params) {
    return tp.handlePronouns(arr, params, 'objective')
  };

  tp.text_processors.sb = function (arr, params) {
    return tp.handlePronouns(arr, params, 'subjective')
  };
  tp.text_processors.ps = function (arr, params) {
    return tp.handlePronouns(arr, params, 'possessive')
  };
  tp.text_processors.rf = function (arr, params) {
    return tp.handlePronouns(arr, params, 'reflexive')
  };

  // {pa2:chr1:chr2}
  tp.text_processors.pa2 = function (arr, params) {
    const chr1 = tp.findSubject(arr, params);
    if (!chr1) return false
    arr.shift();
    const chr2 = tp.findSubject(arr, params);
    if (!chr2) return false

    if (chr1.pronouns === chr2.pronouns) {
      const opt = { article: DEFINITE, possessive: true };
      return arr[1] === 'true' ? sentenceCase(chr1.byname(opt)) : chr1.byname(opt)
    }

    return arr[1] === 'true' ? sentenceCase(chr1.pronouns.poss_adj) : chr1.pronouns.poss_adj
  };

  // {pa3:chr1:chr2}
  tp.text_processors.pa3 = function (arr, params) {
    const chr1 = tp.findSubject(arr, params);
    if (!chr1) return false
    arr.shift();
    const chr2 = tp.findSubject(arr, params);
    if (!chr2) return false

    if (chr1 !== chr2) {
      const opt = { article: DEFINITE, possessive: true };
      return arr[1] === 'true' ? sentenceCase(chr1.byname(opt)) : chr1.byname(opt)
    }

    return arr[1] === 'true' ? sentenceCase(chr1.pronouns.poss_adj) : chr1.pronouns.poss_adj
  };

  // ============  Utilities  =================================

  // Should all be language neutral

  // A command should return one of these
  // (but a verb will return true or false, so the command that uses it
  // can in turn return one of these - a verb is an attribute of an object)

  const SUCCESS = 1;
  const SUCCESS_NO_TURNSCRIPTS = 2;
  const SUPPRESS_ENDTURN = 3;
  const FAILED = -1;
  const PARSER_FAILURE = -2;
  const ERROR = -3;

  const BRIEF = 1;
  const TERSE = 2;
  const VERBOSE = 3;

  const TEXT_COLOUR = $('.sidepanes').css('color');

  // A bug in Quest I need to sort out
  const ERR_QUEST_BUG = 21;
  // A bug in the game the creator needs to sort out
  const ERR_GAME_BUG = 22;
  const ERR_TP = 25;
  const ERR_SAVE_LOAD = 26;
  const ERR_DEBUG_CMD = 27;

  const display = {
    ALL: 0,
    LOOK: 1,
    PARSER: 2,
    INVENTORY: 3,
    SIDE_PANE: 4,
    SCOPING: 5
  };

  // const PARSER = 1

  const LIGHT_none = 0;
  const LIGHT_SELF = 1;
  const LIGHT_MEAGRE = 2;
  const LIGHT_FULL = 3;
  const LIGHT_EXTREME = 4;

  const VISIBLE = 1;
  const REACHABLE = 2;

  const INDEFINITE = 1;
  const DEFINITE = 2;

  const INFINITY = 9999;
  // const INFINITY = {infinity:true};

  const NULL_FUNC = function () {};

  const COLOURS = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'];

  const test = {};
  test.testing = false;

  // @DOC
  // ## General Utility Functions
  // @UNDOC

  // @DOC
  // This is an attempt to mimic the firsttime functionality of Quest 5. Unfortunately, JavaScript does not
  // lend itself well to that!
  // If this is the first time the give `id` has been encountered, the `first` function will be run.
  // Otherwise the `other` function will be run, if given.
  //
  //     firstime(342, function() {
  //       msg("This was the first time.")
  //     }, function() {
  //       msg("This was NOT the first time.")
  //     }, function() {
  //
  function firsttime (id, first, other) {
    if (firsttimeTracker.includes(id)) {
      if (other) other();
    } else {
      firsttimeTracker.push(id);
      first();
    }
  }
  const firsttimeTracker = [];

  // ============  Random Utilities  =======================================
  // @DOC
  // ## Random Functions
  // @UNDOC

  // @DOC
  // Returns a random number from 0 to n1, or n1 to n2, inclusive.
  function randomInt (n1, n2) {
    if (n2 === undefined) {
      n2 = n1;
      n1 = 0;
    }
    return Math.floor(Math.random() * (n2 - n1 + 1)) + n1
  }

  // @DOC
  // Returns true 'percentile' times out of 100, false otherwise.
  function randomChance (percentile) {
    return randomInt(99) < percentile
  }

  // @DOC
  // Returns a random element from the array, or null if it is empty
  // If the second parameter is true, then the selected value is also deleted from the array,
  // preventing it from being selected a second time
  function randomFromArray (arr, deleteEntry) {
    if (arr.length === 0) return null
    const index = Math.floor(Math.random() * arr.length);
    const res = arr[index];
    if (deleteEntry) arr.splice(index, 1);
    return res
  }

  // @DOC
  // Returns a random number based on the standard RPG dice notation.
  // For example 2d6+3 means roll two six sided dice and add three.
  // Returns he number if sent a number.
  // It can cope with complex strings such as 2d8-3d6
  // You can also specify unusual dice, i.e., not a sequence from one to n, by separating each value with a colon,
  // so d1:5:6 rolls a three sided die, with 1, 5 and 6 on the sides.
  // It will cope with any number of parts, so -19+2d1:5:6-d4 will be fine.
  function diceRoll (s) {
    if (typeof s === 'number') return s
    s = s.replace(/ /g, '').replace(/-/g, '+-');
    let total = 0;

    console.log(s);
    for (let dice of s.split('+')) {
      if (dice === '') continue
      let negative = 1;
      if (/^-/.test(dice)) {
        dice = dice.substring(1);
        negative = -1;
      }
      if (/^\d+$/.test(dice)) {
        total += parseInt(dice);
      } else {
        if (/^d/.test(dice)) {
          dice = '1' + dice;
        }
        const parts = dice.split('d');
        if (parts.length === 2 && /^\d+$/.test(parts[0]) && /^[0-9:]+$/.test(parts[1])) {
          const number = parseInt(parts[0]);
          for (let i = 0; i < number; i++) {
            if (/^\d+$/.test(parts[1])) {
              total += negative * randomInt(1, parseInt(parts[1]));
            } else {
              total += negative * parseInt(randomFromArray(parts[1].split(':')));
            }
          }
        } else {
          console.log("Can't parse dice type (but will attempt to use what I can): " + dice);
          errormsg("Can't parse dice type (but will attempt to use what I can): " + dice);
        }
      }
    }
    console.log(total);
    return total
  }

  // ============  String Utilities  =======================================
  // @DOC
  // ## String Functions
  // @UNDOC

  // @DOC
  // Returns the string with the first letter capitalised
  function sentenceCase (str) {
    return str.replace(/[a-z]/i, letter => letter.toUpperCase()).trim()
  }

  // @DOC
  // Returns a string with the given number of hard spaces. Browsers collapse multiple white spaces to just show
  // one, so you need to use hard spaces (NBSPs) if you want several together.
  function spaces (n) {
    return '&nbsp;'.repeat(n)
  }

  // @DOC
  // If isMultiple is true, returns the item name, otherwise nothing. This is useful in commands that handle
  // multiple objects, as you can have this at the start of the response string. For example, if the player does GET BALL,
  // the response might be "Done". If she does GET ALL, then the response for the ball needs to be "Ball: Done".
  // In the command, you can have `msg(prefix(item, isMultiple) + "Done"), and it is sorted.
  function prefix (item, isMultiple) {
    if (!isMultiple) { return '' }
    return sentenceCase(item.name) + ': '
  }

  // @DOC
  // Creates a string from an array. If the array element is a string, that is used, if it is an item, its byname is used (and passed the `options`). Items are sorted alphabetically, based on the "name" attribute.
  //
  // Options:
  //
  // * article:    DEFINITE (for "the") or INDEFINITE (for "a"), defaults to none (see byname)
  // * sep:        separator (defaults to comma)
  // * lastJoiner: separator for last two items (just separator if not provided); you should include any spaces (this allows you to have a comma and "and", which is obviously wrong, but some people like it)
  // * modified:   item aliases modified (see byname) (defaults to false)
  // * nothing:    return this if the list is empty (defaults to empty string)
  // * count:      if this is a number, the name will be prefixed by that (instead of the article)
  // * doNotSort   if true the list isnot sorted
  // * separateEnsembles:  if true, ensembles are listed as the separate items
  //
  // For example:
  //
  // ```
  // formatList(listOfOjects, {def:"a", joiner:" and"})
  // -> "a hat, Mary and some boots"
  //
  // formatList(list, {joiner:" or", nothing:"nowhere");
  // -> north, east or up
  // ```
  //
  // Note that you can add further options for your own game, and then write your own byname function that uses it.
  function formatList (itemArray, options) {
    if (options === undefined) { options = {}; }

    if (itemArray.length === 0) {
      return options.nothing ? options.nothing : ''
    }

    if (!options.sep) { options.sep = ', '; }
    if (!options.lastJoiner) { options.lastJoiner = options.sep; }

    if (!options.separateEnsembles) {
      const toRemove = [];
      const toAdd = [];
      for (const item of itemArray) {
        if (item.ensembleMaster && item.ensembleMaster.isAllTogether()) {
          toRemove.push(item);
          if (!toAdd.includes(item.ensembleMaster)) toAdd.push(item.ensembleMaster);
        }
      }
      itemArray = arraySubtract(itemArray, toRemove);
      itemArray = itemArray.concat(toAdd);
    }

    // sort the list alphabetically on name
    if (!options.doNotSort) {
      itemArray.sort(function (a, b) {
        if (a.name) a = a.name;
        if (b.name) b = b.name;
        return a.localeCompare(b)
      });
    }
    // console.log(itemArray)
    const l = itemArray.map(el => {
      if (el === undefined) return '[undefined]'
      if (typeof el === 'string') return el
      if (el.byname) return el.byname(options)
      if (el.name) return el.name
      return '[' + (typeof el) + ']'
    });
    // console.log(l)
    let s = '';
    do {
      s += l.shift();
      if (l.length === 1) { s += options.lastJoiner; }
      if (l.length > 1) { s += options.sep; }
    } while (l.length > 0)

    return s
  }

  // @DOC
  // Lists the properties of the given object; useful for debugging only.
  // To inspect an object use JSON.stringify(obj)
  function listProperties (obj) {
    return Object.keys(obj).join(', ')
  }

  const arabic = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const roman = 'M;CM;D;CD;C;XC;L;XL;X;IX;V;IV;I'.split(';');

  // @DOC
  // Returns the given number as a string in Roman numerals.
  function toRoman (number) {
    if (typeof number !== 'number') {
      errormsg('toRoman can only handle numbers');
      return number
    }

    let result = '';
    // var a, r;
    for (let i = 0; i < 13; i++) {
      while (number >= arabic[i]) {
        result = result + roman[i];
        number = number - arabic[i];
      }
    }
    return result
  }

  // @DOC
  // Returns the game time as a string. The game time is game.elapsedTime seconds after game.startTime.
  function getDateTime () {
    const time = new Date(game.elapsedTime * 1000 + game.startTime.getTime());
    // console.log(time);
    return time.toLocaleString(settings.dateTime.locale, settings.dateTime)
  }

  // @DOC
  // Returns the given number as a string formatted as money. The formatting is defined by settings.moneyFormat.
  function displayMoney (n) {
    if (typeof settings.moneyFormat === 'undefined') {
      errormsg('No format for money set (set settings.moneyFormat in settings.js).');
      return '' + n
    }
    const ary = settings.moneyFormat.split('!');
    if (ary.length === 2) {
      return settings.moneyFormat.replace('!', '' + n)
    } else if (ary.length === 3) {
      const negative = (n < 0);
      n = Math.abs(n);
      let options = ary[1];
      const showsign = options.startsWith('+');
      if (showsign) {
        options = options.substring(1);
      }
      let number = displayNumber(n, options);
      if (negative) {
        number = '-' + number;
      } else if (n !== 0 && showsign) {
        number = '+' + number;
      }
      return (ary[0] + number + ary[2])
    } else if (ary.length === 4) {
      const options = n < 0 ? ary[2] : ary[1];
      return ary[0] + displayNumber(n, options) + ary[3]
    } else {
      errormsg('settings.moneyFormat in settings.js expected to have either 1, 2 or 3 exclamation marks.');
      return '' + n
    }
  }

  // @DOC
  // Returns the given number as a string formatted as per the control string.
  // The control string is made up of five parts.
  // The first is a sequence of characters that are not digits that will be added to the start of the string, and is optional.
  // The second is a sequence of digits and it the number of characters left of the decimal point; this is padded with zeros to make it longer.
  // The third is a single non-digit character; the decimal marker.
  // The fourth is a sequence of digits and it the number of characters right of the decimal point; this is padded with zeros to make it longer.
  // The fifth is a sequence of characters that are not digits that will be added to the end of the string, and is optional.
  function displayNumber (n, control) {
    n = Math.abs(n); // must be positive
    const regex = /^(\D*)(\d+)(\D)(\d*)(\D*)$/;
    if (!regex.test(control)) {
      errormsg('Unexpected format in displayNumber (' + control + '). Should be a number, followed by a single character separator, followed by a number.');
      return '' + n
    }
    const options = regex.exec(control);
    const places = parseInt(options[4]); // eg 2
    let padding = parseInt(options[2]); // eg 3
    if (places > 0) {
      // We want a decimal point, so the padding, the total length, needs that plus the places
      padding = padding + 1 + places; // eg 6
    }
    const factor = Math.pow(10, places); // eg 100
    const base = (n / factor).toFixed(places); // eg "12.34"
    const decimal = base.replace('.', options[3]); // eg "12,34"
    return (options[1] + decimal.padStart(padding, '0') + options[5]) // eg "(012,34)"
  }

  // @DOC
  // Converts the string to the standard direction name, so "down", "dn" and "d" will all return "down".
  // Uses the EXITS array, so language neutral.
  function getDir (s) {
    for (const exit of lang.exit_list) {
      if (exit.nocmd) continue
      if (exit.name === s) return exit.name
      if (exit.abbrev.toLowerCase() === s) return exit.name
      if (new RegExp('^(' + exit.alt + ')$').test(s)) return exit.name
    }
    return false
  }

  // ============  Array Utilities  =======================================
  // @DOC
  // ## Array (List) Functions
  // @UNDOC

  // @DOC
  // Returns a new array, derived by subtracting each element in b from the array a.
  // If b is not an array, then b itself will be removed.
  // Unit tested.
  function arraySubtract (a, b) {
    if (!Array.isArray(b)) b = [b];
    const res = [];
    for (let i = 0; i < a.length; i++) {
      if (!b.includes(a[i])) res.push(a[i]);
    }
    return res
  }

  // @DOC
  // Returns true if the arrays a and b are equal. They are equal if both are arrays, they have the same length,
  // and each element in order is the same.
  // Assumes a is an array, but not b.
  // Unit tested
  function arrayCompare (a, b) {
    if (!Array.isArray(b)) return false
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (b[i] !== a[i]) return false
    }
    return true
  }

  // @DOC
  // Removes the element el from the array, ary.
  // Unlike arraySubtract, no new array is created; the original aray is modified, and nothing is returned.
  function arrayRemove (ary, el) {
    const index = ary.indexOf(el);
    if (index !== -1) {
      ary.splice(index, 1);
    }
  }

  // @DOC
  // Returns a new array based on ary, but including only those objects for which the attribute attName is equal to value.
  // To filter for objects that do not have the attribute you can filter for the value undefined.
  function arrayFilterByAttribute (ary, attName, value) {
    return ary.filter(el => el[attName] === value)
  }

  // ============  Scope Utilities  =======================================

  // @DOC
  // ## Scope Functions
  // @UNDOC

  // @DOC
  // Returns an array of objects the player can currently reach and see.
  function scopeReachable () {
    const list = [];
    for (const key in w) {
      if (w[key].scopeStatus === REACHABLE && world.ifNotDark(w[key])) {
        list.push(w[key]);
      }
    }
    return list
  }

  // @DOC
  // Returns an array of objects held by the given character.
  function scopeHeldBy (chr) {
    const list = [];
    for (const key in w) {
      if (w[key].isAtLoc(chr)) {
        list.push(w[key]);
      }
    }
    return list
  }

  // @DOC
  // Returns an array of objects at the player's location that can be seen.
  function scopeHereListed () {
    const list = [];
    for (const key in w) {
      if (w[key].isAtLoc(game.player.loc, display.LOOK) && world.ifNotDark(w[key])) {
        list.push(w[key]);
      }
    }
    return list
  }

  const util = {};

  // ============  Response Utilities  =======================================

  // @DOC
  // ## The Respond Function
  // @UNDOC

  // @DOC
  // Searchs the given list for a suitable response, according to the given params, and runs that response.
  // This is a big topic, see [here](https://github.com/ThePix/QuestJS/wiki/The-respond-function) for more.
  function respond (params, list, func) {
    // console.log(params)
    // if (!params.action) throw "No action in params"
    // if (!params.actor) throw "No action in params"
    // if (!params.target) throw "No action in params"
    const response = util.findResponse(params, list);
    if (!response) {
      if (func) func(params);
      errormsg('Failed to find a response (F12 for more)');
      console.log('Failed to find a response');
      console.log(params);
      console.log(list);
      return false
    }
    // console.log(response)
    if (response.script) response.script(params);
    if (response.msg) params.actor.msg(response.msg, params);
    if (func) func(params, response);
    return !response.failed
  }

  function getResponseList (params, list, result) {
    if (!result) result = [];
    for (const item of list) {
      if (item.name) {
        params.text = item.name.toLowerCase();
        // console.log("check item: " + item.name)
        if (item.test) {
          if (!result.includes(item) && item.test(params)) result.push(item);
        } else {
          if (!result.includes(item)) result.push(item);
        }
        // console.log("item is good: " + item.name)
      }
      if (item.responses) result = getResponseList(params, item.responses, result);
      // console.log("done")
    }
    return result
  }

  util.findResponse = function (params, list) {
    for (const item of list) {
      // console.log("check item: " + item.name)
      if (item.test && !item.test(params)) continue
      // console.log("item is good: " + item.name)
      if (item.responses) return util.findResponse(params, item.responses)
      // console.log("done")
      return item
    }
    return false
  };

  util.addResponse = function (route, data, list) {
    util.addResponseToList(route, data, list);
  };

  util.addResponseToList = function (route, data, list) {
    const sublist = util.getResponseSubList(route, list);
    sublist.unshift(data);
  };

  util.getResponseSubList = function (route, list) {
    const s = route.shift();
    if (s) {
      const sublist = list.find(el => el.name === s);
      if (!sublist) throw 'Failed to add sub-list with ' + s
      return util.getResponseSubList(route, sublist.responses)
    } else {
      return list
    }
  };

  util.verifyResponses = function (list) {
    //  console.log(list)

    if (list[list.length - 1].test) {
      console.log('WARNING: Last entry has a test condition:');
      console.log(list);
    }
    for (const item of list) {
      if (item.responses) {
        // console.log(item.name)
        if (item.responses.length === 0) {
          console.log('Zero responses for: ' + item.name);
        } else {
          util.verifyResponses(item.responses);
        }
      }
    }
  };

  util.listContents = function (contents) {
    return formatList(this.getContents(), { article: INDEFINITE, lastJoiner: lang.list_and, modified: true, nothing: lang.list_nothing, loc: this.name })
  };

  util.niceDirections = function (dir) {
    const dirObj = lang.exit_list.find(function (el) { return el.name === dir });
    return dirObj.niceDir ? dirObj.niceDir : dirObj.name
  };

  util.exitList = function () {
    const list = [];
    for (const exit of lang.exit_list) {
      if (game.room.hasExit(exit.name)) {
        list.push(exit.name);
      }
    }
    return list
  };

  // Should all be language neutral

  const DEFAULT_OBJECT = {
    byname: function (options) {
      let s;
      if (options && options.article === DEFINITE) {
        s = lang.addDefiniteArticle(this) + this.alias;
      } else if (options && options.article === INDEFINITE) {
        s = lang.addIndefiniteArticle(this) + this.alias;
      } else {
        s = this.alias;
      }
      if (options && options.possessive) {
        if (this.pronouns.possessive_name) {
          s = this.pronouns.possessive_name;
        } else {
          s += "'s";
        }
      }
      if (options && options.capital) s = sentenceCase(s);
      return s
    },
    pronouns: lang.pronouns.thirdperson,

    isAtLoc: function (loc, situation) {
      if (typeof loc !== 'string') loc = loc.name;
      if (!w[loc]) errormsg('The location name `' + loc + '`, does not match anything in the game.');
      if (this.complexIsAtLoc) {
        if (!this.complexIsAtLoc(loc, situation)) return false
      } else {
        if (this.loc !== loc) return false
      }
      if (situation === undefined) return true
      if (situation === display.LOOK && this.scenery) return false
      if (situation === display.SIDE_PANE && this.scenery) return false
      return true
    },

    isHere: function () {
      return this.isAtLoc(game.player.loc)
    },

    isHeld: function () {
      return this.isAtLoc(game.player.name)
    },

    isHereOrHeld: function () {
      return this.isHere() || this.isHeld()
    },

    countAtLoc: function (loc) {
      if (typeof loc !== 'string') loc = loc.name;
      return this.isAtLoc(loc) ? 1 : 0
    },

    scopeSnapshot: function (visible) {
      if (this.scopeStatus) { return } // already done this one

      this.scopeStatus = visible ? VISIBLE : REACHABLE; // set the value

      if (!this.getContents && !this.componentHolder) { return } // no lower levels so done

      let l;
      if (this.getContents) {
        // this is a container, so get the contents
        if (!this.canSeeThrough() && !this.scopeStatusForRoom) { return } // cannot see or reach contents
        if (!this.canReachThrough() && this.scopeStatusForRoom !== REACHABLE) { visible = true; } // can see but not reach contents
        l = this.getContents(display.SCOPING);
      } else {
        // this has components, so get them
        l = [];
        for (const key in w) {
          if (w[key].loc === this.name) l.push(w[key]);
        }
      }
      for (const el of l) {
        // go through them
        el.scopeSnapshot(visible);
      }
    },

    canReachThrough: () => false,
    canSeeThrough: () => false,
    itemTaken: NULL_FUNC,
    itemDropped: NULL_FUNC,
    canTalkPlayer: () => false,
    getExits: function () { return {} },
    hasExit: dir => false,
    getWorn: () => false,

    moveToFrom: function (toLoc, fromLoc) {
      if (fromLoc === undefined) fromLoc = this.loc;
      if (fromLoc === toLoc) return

      if (!w[fromLoc]) errormsg('The location name `' + fromLoc + '`, does not match anything in the game.');
      if (!w[toLoc]) errormsg('The location name `' + toLoc + '`, does not match anything in the game.');
      this.loc = toLoc;
      w[fromLoc].itemTaken(this);
      w[toLoc].itemDropped(this);
      if (this.onMove !== undefined) this.onMove(toLoc, fromLoc);
    },

    postLoad: NULL_FUNC,

    templatePostLoad: function () {
      this.postLoad();
    },

    preSave: NULL_FUNC,

    templatePreSave: function () {
      this.preSave();
    },

    getSaveString: function () {
      this.templatePreSave();
      let s = 'Object=';
      for (const key in this) {
        if (typeof this[key] !== 'function') {
          if (key !== 'name' && key !== 'gameState') {
            s += saveLoad.encode(key, this[key]);
          }
        }
      }
      return s
    },

    eventActive: false,
    eventCountdown: 0,
    eventIsActive: () => false, // this.eventActive, // -fixme:  'this.eventActive' is undefined. changed to 'false'

    doEvent: function (turn) {
      // debugmsg("this=" + this.name);
      // Not active, so stop
      if (!this.eventIsActive()) return
      // Countdown running, so stop
      if (this.eventCountdown > 1) {
        this.eventCountdown--;
        return
      }
      // If there is a condition and it is not met, stop
      if (this.eventCondition && !this.eventCondition(turn)) return
      this.eventScript(turn);
      if (typeof this.eventPeriod === 'number') {
        this.eventCountdown = this.eventPeriod;
      } else {
        this.eventActive = false;
      }
    }
  };

  const CONTAINER_BASE = {
    container: true,

    getContents: function (situation) {
      const list = [];
      for (const key in w) {
        if (w[key].isAtLoc(this.name, situation)) {
          list.push(w[key]);
        }
      }
      return list
    },

    // Is this container already inside the given object, and hence
    // putting the object in the container will destroy the universe
    testForRecursion: function (char, item) {
      let contName = this.name;
      while (w[contName]) {
        if (w[contName].loc === item.name) return falsemsg(lang.container_recursion(char, this, item))
        contName = w[contName].loc;
      }
      return true
    }

  };

  const DEFAULT_ROOM = {
    room: true,
    beforeEnter: NULL_FUNC,
    beforeFirstEnter: NULL_FUNC,
    afterEnter: NULL_FUNC,
    afterEnterIf: [],
    afterEnterIfFlags: '',
    afterFirstEnter: NULL_FUNC,
    onExit: NULL_FUNC,
    visited: 0,

    lightSource: () => LIGHT_FULL,

    description: function () {
      if (game.dark) {
        printOrRun(game.player, this, 'darkDesc');
        return true
      }
      for (const line of settings.roomTemplate) {
        msg(line);
      }
      return true
    },

    darkDescription: () => msg('It is dark.'),

    getContents: CONTAINER_BASE.getContents,

    getExits: function (options) {
      const list = [];
      for (const exit of lang.exit_list) {
        if (this.hasExit(exit.name, options)) {
          list.push(this[exit.name]);
        }
      }
      return list
    },

    // returns null if there are no exits
    getRandomExit: options => randomFromArray(1), // this.getExits(options)), // -fixme:  this.getExits() is undefined, changed to 1

    hasExit: function (dir, options) {
      // console.log(this.name)
      // console.log(dir)
      if (options === undefined) options = {};
      if (!this[dir]) return false
      // console.log(this[dir])
      if (options.excludeLocked && this[dir].isLocked()) return false
      if (options.excludeScenery && this[dir].scenery) return false
      return !this[dir].isHidden()
    },

    findExit: function (dest, options) {
      if (typeof dest === 'object') dest = dest.name;
      for (const exit of lang.exit_list) {
        if (this.hasExit(exit.name, options) && this[exit.name].name === dest) {
          return this[exit.name]
        }
      }
      return null
    },

    // Lock or unlock the exit indicated
    // Returns false if the exit does not exist or is not an Exit object
    // Returns true if successful
    setExitLock: function (dir, locked) {
      if (!this[dir]) { return false }
      const ex = this[dir];
      this[dir].locked = locked;
      return true
    },

    // Hide or unhide the exit indicated
    // Returns false if the exit does not exist or is not an Exit object
    // Returns true if successful
    setExitHide: function (dir, hidden) {
      if (!this[dir]) { return false }
      this[dir].hidden = hidden;
      return true
    },

    templatePreSave: function () {
      /* for (let i = 0; i < lang.exit_list.length; i++) {
        const dir = lang.exit_list[i].name;
        if (this[dir] !== undefined) {
          this["customSaveExit" + dir] = (this[dir].locked ? "locked" : "");
          this["customSaveExit" + dir] += "/" + (this[dir].hidden ? "hidden" : "");
          if (this.saveExitDests) this["customSaveExitDest" + dir] = this[dir].name;
        }
      } */
      this.preSave();
    },

    templatePostLoad: function () {
      for (const exit of lang.exit_list) {
        const dir = exit.name;
        if (this['customSaveExit' + dir]) {
          this[dir].locked = /locked/.test(this['customSaveExit' + dir]);
          this[dir].hidden = /hidden/.test(this['customSaveExit' + dir]);
          delete this['customSaveExit' + dir];
          if (this.saveExitDests) {
            this[dir].name = this['customSaveExitDest' + dir];
            // console.log("Just set " + dir + " in " + this.name + " to " + this["customSaveExitDest" + dir])
            delete this['customSaveExitDest' + dir];
          }
        }
      }
      this.postLoad();
    }

  };

  const DEFAULT_ITEM = {
    lightSource: () => LIGHT_none,
    icon: () => '',
    testKeys: (char, toLock) => false,
    here: function () { return this.isAtLoc(game.player.loc) },
    getVerbs: function () {
      return this.use === undefined ? [lang.verbs.examine] : [lang.verbs.examine, lang.verbs.use]
    }
  };

  // This is where the world exist!
  const w = {};

  // @DOC
  // ## World Functions
  //
  // These are functions for creating objects in the game world
  // @UNDOC

  // @DOC
  // Use this to create a new item (as opposed to a room).
  // It adds various defaults that apply only to items.
  // The first argument should be a string - a unique name for this object, composed only of letters, numbers and underscores.
  // It will than take any number of dictionaries that will be combined to set the properties.
  // Generally objects should not be created during play as they will not be saved properly.
  // Either keep the object hodden until required or clone existing objects.
  function createItem () {
    const args = Array.prototype.slice.call(arguments);
    const name = args.shift();
    args.unshift(DEFAULT_ITEM);
    return createObject(name, args)
  }

  // @DOC
  // Use this to create a new room (as opposed to an item).
  // It adds various defaults that apply only to items
  // The first argument should be a string - a unique name for this object, composed only of letters, numbers and underscores.
  // It will than take any number of dictionaries that will be combined to set the properties.
  // Generally objects should not be created during play as they will not be saved properly.
  // Either keep the object hodden until required or clone existing objects.
  function createRoom () {
    const args = Array.prototype.slice.call(arguments);
    const name = args.shift();
    args.unshift(DEFAULT_ROOM);
    return createObject(name, args)
  }

  // @DOC
  // Use this to create new items during play. The given item will be cloned at the given location.
  // The `newName` isoptional, one will be generated if not supplied. If you do supply one bear inmid that
  // every clone must have a unique name.
  function cloneObject (item, loc, newName) {
    if (item === undefined) { console.log('Item is not defined.'); }
    const clone = {};
    for (const key in item) {
      clone[key] = item[key];
    }
    clone.name = newName === undefined ? world.findUniqueName(item.name) : newName;
    if (!clone.clonePrototype) {
      clone.clonePrototype = item;
    }
    if (loc !== undefined) {
      clone.loc = loc;
    }

    clone.getSaveString = function (item) {
      this.templatePreSave();
      let s = 'Clone:' + this.clonePrototype.name + '=';
      for (const key in this) {
        if (typeof this[key] !== 'function' && typeof this[key] !== 'object') {
          if (key !== 'desc' && key !== 'examine' && key !== 'name') {
            s += saveLoad.encode(key, this[key]);
          }
          if (key === 'desc' && this.mutableDesc) {
            s += saveLoad.encode(key, this[key]);
          }
          if (key === 'examine' && this.mutableExamine) {
            s += saveLoad.encode(key, this[key]);
          }
        }
      }
      return s
    };
    w[clone.name] = clone;
    return clone
  }

  // @DOC
  // Creates a basic object. Generally it is better to use CreateItem or CreateRoom.
  function createObject (name, listOfHashes) {
    if (world.isCreated && !settings.saveDisabled) {
      console.log('Attempting to use createObject with `' + name + '` after set up. To ensure games save properly you should use cloneObject to create ites during play.');
      errormsg('Attempting to use createObject with `' + name + '` after set up. To ensure games save properly you should use cloneObject to create ites during play.');
      return null
    }

    if (/\W/.test(name)) {
      console.log('Attempting to use the disallowed name `' + name + "`; a name can only include letters and digits - no spaces or accented characters. Use the 'alias' attribute to give an item a name with other characters.");
      errormsg('Attempting to use the disallowed name `' + name + "`; a name can only include letters and digits - no spaces or accented characters. Use the 'alias' attribute to give an item a name with other characters.");
      return null
    }
    if (w[name]) {
      console.log('Attempting to use the name `' + name + '` when there is already an item with that name in the world.');
      errormsg('Attempting to use the name `' + name + '` when there is already an item with that name in the world.');
      return null
    }

    listOfHashes.unshift(DEFAULT_OBJECT);

    const item = {
      name: name
    };

    for (const hash of listOfHashes) {
      for (const key in hash) {
        item[key] = hash[key];
      }
    }

    // Give every object an alias and list alias (used in the inventories)
    if (!item.alias) item.alias = item.name.replace(/_/g, ' ');
    if (!item.listalias) item.listalias = sentenceCase(item.alias);
    if (!item.getListAlias) item.getListAlias = function (loc) { return this.listalias };
    if (!item.pluralAlias) item.pluralAlias = item.alias + 's';
    if (item.pluralAlias === '*') item.pluralAlias = item.alias;

    // world.data.push(item);
    w[name] = item;
    return item
  }

  const world = {
    isCreated: false,
    exits: [],

    findUniqueName: function (s) {
      if (!w[s]) {
        return (s)
      } else {
        const res = /(\d+)$/.exec(s);
        if (!res) {
          return world.findUniqueName(s + '0')
        }
        const n = parseInt(res[0]) + 1;
        return world.findUniqueName(s.replace(/(\d+)$/, '' + n))
      }
    },

    init: function () {
      // Sort out the player
      let player;
      for (const key in w) {
        if (w[key].player) { player = w[key]; }
      }
      if (!player) {
        errormsg('No player object found. This is probably due to an error in data.js. Do [Ctrl][Shft]-I to open the developer tools, and go to the console tab, and look at the first error in the list (if it mentions jQuery, skip it and look at the second one). It should tell you exactly which line in which file. But also check one object is actually flagged as the player.');
        return
      }
      game.update(player);

      // Create a background item if it does not exist
      // This handles the player wanting to interact with things in room descriptions
      // that are not implemented by changing its regex when a room is entered.
      if (w.background === undefined) {
        w.background = createItem('background', {
          scenery: true,
          examine: lang.default_description,
          background: true,
          name: 'default_background_object',
          lightSource: function () { return LIGHT_none },
          isAtLoc: function (loc, situation) {
            if (typeof loc !== 'string') loc = loc.name;
            if (!w[loc]) errormsg('Unknown location: ' + loc);
            return w[loc] && w[loc].room && situation === display.PARSER
          }
        });
      }
      if (!w.background.background) {
        errormsg("It looks like an item has been named 'background`, but is not set as the background item. If you intended to do this, ensure the background property is set to true.");
      }

      for (const key in w) {
        world.initItem(w[key]);
      }
      this.isCreated = true;

      // Go through each command
      initCommands();

      // Set up the UI
      // endTurnUI();
      msgHeading(settings.title, 2);
      if (settings.subtitle) msgHeading(settings.subtitle, 3);
      io.setTitle(settings.title);

      game.ticker = setInterval(game.gameTimer, 1000);
    },

    // Every item or room should have this called for them.
    // That will be done at the start, but you need to do it yourself
    // if creating items on the fly.
    initItem: function (item) {
      if (item.loc && !w[item.loc]) {
        errormsg('The item `' + item.name + '` is in an unknown location (' + item.loc + ')');
      }
      for (const exit of lang.exit_list) {
        const ex = item[exit.name];
        if (ex) {
          ex.origin = item;
          ex.dir = exit.name;
          world.exits.push(ex);
          if (ex.alsoDir) {
            for (const dir in ex.alsoDir) {
              item[dir] = new Exit(ex.name, ex);
              item[dir].scenery = true;
            }
          }
        }
      }
    },

    // Call after the player takes a turn, sending it a result, SUCCESS, SUCCESS_NO_TURNSCRIPTS or FAILED
    endTurn: function (result) {
      // debugmsg("endTurn=" + result);
      if (result === true) debugmsg("That command returned 'true', rather than the proper result code.");
      if (result === false) debugmsg("That command returned 'false', rather than the proper result code.");
      if (result === SUCCESS || (settings.failCountsAsTurn && result === FAILED)) {
        game.turnCount++;
        game.elapsedTime += settings.dateTime.secondsPerTurn;
        // events.runEvents();
        for (const key in w) {
          w[key].doEvent();
        }
        world.resetPauses();
        game.update();
        game.saveGameState();
        endTurnUI(true);
      } else {
        endTurnUI(false);
      }
    },

    resetPauses: function () {
      for (const key in w) {
        if (w[key].paused) {
          delete w[key].paused;
        }
      }
    },

    // Returns true if bad lighting is not obscuring the item
    ifNotDark: function (item) {
      return (!game.dark || item.lightSource() > LIGHT_none)
    },

    // scopeStatus is used to track what the player can see and reach; it is a lot faster than working
    // it out each time, as this needs to be used several times every turn.
    scopeSnapshot: function () {
      // reset every object
      for (const key in w) {
        delete w[key].scopeStatus;
        delete w[key].scopeStatusForRoom;
      }

      // start from the current room
      let room = w[game.player.loc];
      if (room === undefined) {
        errormsg('Error in scopeSnapshot; the location assigned to the player does not exist.');
      }
      room.scopeStatusForRoom = REACHABLE;
      // crawl up the room hierarchy to the topmost visible
      while (room.loc && room.canReachThrough()) {
        room = w[room.loc];
        room.scopeStatusForRoom = REACHABLE;
      }
      // room is now the top level applicable, so now work downwards from here (recursively)

      room.scopeSnapshot(false);

      // Also want to go further upwards if room is transparent
      while (room.loc && room.canSeeThrough()) {
        room = w[room.loc];
        room.scopeStatusForRoom = VISIBLE;
      }
      // room is now the top level applicable

      room.scopeSnapshot(true);
    },

    // Sets the current room to the one named
    //
    // Can also be used to move an NPC, but just gives a message and set "loc"
    // however, this does make it char-neutral.
    // Suppress output (if done elsewhere) by sending false for dir
    setRoom: function (char, roomName, dir) {
      if (char !== game.player) {
        if (dir) {
          msg(lang.stop_posture(char));
          msg(lang.npc_heading(char, dir));
        }
        char.previousLoc = char.loc;
        char.loc = roomName;
        return true
      }

      if (game.player.loc === roomName) {
        // Already here, do nothing
        return false
      }
      const room = w[roomName];
      if (room === undefined) {
        errormsg('Failed to find room: ' + roomName + '.');
        return false
      }

      if (settings.clearScreenOnRoomEnter) clearScreen();

      game.room.onExit();

      char.previousLoc = char.loc;
      char.loc = room.name;
      game.update();
      world.setBackground();
      if (dir !== 'suppress') {
        world.enterRoom();
      }
      return true
    },

    // Runs the script and gives the description
    enterRoom: function () {
      if (game.room.beforeEnter === undefined) {
        errormsg('This room, ' + game.room.name + ", has no 'beforeEnter` function defined.  This is probably because it is not actually a room (it was not created with 'createRoom' and has not got the DEFAULT_ROOM template), but it an item. It is not clear what state the game will continue in.");
        return
      }
      game.room.beforeEnter();
      if (game.room.visited === 0) { game.room.beforeFirstEnter(); }
      world.enterRoomAfterScripts();
    },

    // Called when entering a new room, after beforeEnter and beforeFirstEnter re done
    enterRoomAfterScripts: function () {
      game.room.description();
      game.room.afterEnter();
      if (game.room.visited === 0) { game.room.afterFirstEnter(); }
      if (game.room.afterEnterIf) {
        for (const key in game.room.afterEnterIf) {
          if (game.room.afterEnterIfFlags.split(' ').includes(key)) continue
          if (game.room.afterEnterIf[key].test()) {
            game.room.afterEnterIf[key].action;
            game.room.afterEnterIfFlags += ' ' + key;
          }
        }
      }
      game.room.visited++;
    },

    // Call this when entering a new room
    // It will set the regex of the ubiquitous background object
    // to any objects highlighted in the room description.
    setBackground: function () {
      let md;
      if (typeof game.room.desc === 'string') {
        if (!game.room.backgroundNames) {
          game.room.backgroundNames = [];
          while (md = world.BACK_REGEX.exec(game.room.desc)) { // yes it is an assignment!
            const arr = md[0].substring(1, md[0].length - 1).split(':');
            game.room.desc = game.room.desc.replace(md[0], arr[0]);
            for (const el of arr) game.room.backgroundNames.push(el);
          }
        }
      }
      w.background.regex = (game.room.backgroundNames && game.room.backgroundNames.length > 0) ? new RegExp(game.room.backgroundNames.join('|')) : false;
    },

    BACK_REGEX: /\[.+?\]/

  };

  const game = createObject('game', [{
    verbosity: VERBOSE,
    transcript: false,
    transcriptText: [],
    spoken: false,
    turnCount: 0,
    elapsedTime: 0,
    elapsedRealTime: 0,
    startTime: settings.dateTime.start,
    gameState: [],
    name: 'built-in_game_object',
    isAtLoc: function () { return false },

    initialise: function () {
      world.init();
      game.update();
      game.saveGameState();
      world.setBackground();
    },

    begin: function () {
      if (typeof settings.intro === 'string') msg(settings.intro);
      if (typeof settings.setup === 'function') settings.setup();
      world.enterRoom();
    },

    // Updates the game world, specifically...
    // Sets game.player and game.room
    // Sets the scoping snapshot
    // Sets the light/dark
    update: function (player) {
      // debugmsg("update");
      if (player !== undefined) {
        this.player = player;
      }

      if (!this.player) {
        errormsg('No player object found. This will not go well...');
        return
      }
      if (!this.player.loc || !w[this.player.loc]) {
        errormsg('No player location set or set to location that does no exist. This will not go well...');
        errormsg("This is likely to be because of an error in one of the .js files. Press F12, and go to the 'Console' tab (if not already open), to see the error. Look at the vey first error (but ignore any that mentions 'jquery'). It should tell you the file and line number that is causing the problem.");
      }
      this.room = w[this.player.loc];
      // debugmsg("About to take snapshot");
      world.scopeSnapshot();

      let light = LIGHT_none;
      for (const key in w) {
        if (w[key].scopeStatus) {
          if (light < w[key].lightSource()) {
            light = w[key].lightSource();
          }
        }
      }
      this.dark = (light < LIGHT_MEAGRE);
      // endTurnUI();
      // io.updateUIItems();
    },

    // UNDO SUPPORT
    saveGameState: function () {
      if (settings.maxUndo > 0) {
        this.gameState.push(saveLoad.getSaveBody());
        if (this.gameState.length > settings.maxUndo) this.gameState.shift();
      }
    },

    // TRANSCRIPT SUPPORT
    scriptStart: function () {
      this.transcript = true;
      metamsg('Transcript is now on.');
    },
    scriptEnd: function () {
      metamsg('Transcript is now off.');
      this.transcript = false;
    },
    scriptShow: function (opts) {
      if (opts === undefined) opts = '';
      let html = '';
      for (const st of this.transcriptText) {
        const s = st.substring(1);
        switch (st[0]) {
          case '-': html += '<p>' + s + '</p>'; break
          case 'M': if (!opts.includes('m')) { html += '<p style="color:blue">' + s + '</p>'; } break
          case 'E': if (!opts.includes('e')) { html += '<p style="color:red">' + s + '</p>'; } break
          case 'D': if (!opts.includes('d')) { html += '<p style="color:grey">' + s + '</p>'; } break
          case 'P': if (!opts.includes('p')) { html += '<p style="color:magenta">' + s + '</p>'; } break
          case 'I': if (!opts.includes('i')) { html += '<p style="color:cyan">' + s + '</p>'; } break
          default : html += '<h' + st[0] + '>' + s + '</h' + st[0] + '>'; break
        }
      }
      io.showHtml('Transcript', html);
    },
    scriptClear: function () {
      this.transcriptText = [];
      metamsg('Transcript cleared.');
    },
    scriptAppend: function (s) {
      this.transcriptText.push(s);
    },

    timerEvents: [], // These will not get saved!!!
    eventFunctions: {},
    registerEvent: function (eventName, func) {
      this.eventFunctions[eventName] = func;
    },
    registerTimedEvent: function (eventName, triggerTime, interval) {
      this.timerEvents.push({ eventName: eventName, triggerTime: triggerTime + game.elapsedRealTime, interval: interval });
    },
    gameTimer: function () {
      // Note that this gets added to window by setInterval, so 'this' does not refer to the game object
      game.elapsedRealTime++;
      for (const el of game.timerEvents) {
        if (el.triggerTime && el.triggerTime < game.elapsedRealTime) {
          if (typeof (game.eventFunctions[el.eventName]) === 'function') {
            const flag = game.eventFunctions[el.eventName]();
            if (el.interval && !flag) {
              el.triggerTime += el.interval;
            } else {
              delete el.triggerTime;
            }
          } else {
            errormsg("A timer is trying to call event '" + el.eventName + "' but no such function is registered.");
            // console.log(game.eventFunctions);
          }
        }
      }
    },
    preSave: function () {
      const arr = [];
      for (const el of game.timerEvents) {
        if (el.triggerTime) {
          arr.push(el.eventName + '/' + el.triggerTime + '/' + (el.interval ? el.interval : '-'));
        }
      }
      game.timeSaveAttribute = arr.join(' ');
    },
    postLoad: function () {
      game.timerEvents = [];
      const arr = game.timeSaveAttribute.split(' ');
      for (const el of arr) {
        const params = el.split('/');
        const interval = params[2] === '-' ? undefined : parseInt(params[2]);
        game.timerEvents.push({ eventName: params[0], triggerTime: parseInt(params[1]), interval: interval });
      }
      delete game.timeSaveAttribute;
    }

  }]);

  function Exit (name, hash) {
    if (!hash) hash = {};
    this.name = name;
    this.use = function (char, dir) {
      if (char.testMobility && !char.testMobility()) {
        return false
      }
      if (this.isLocked()) {
        if (this.lockedmsg) {
          msg(this.lockedmsg);
        } else {
          msg(lang.locked_exit(char, this));
        }
        return false
      } else {
        msg(lang.stop_posture(char));
        if (this.msg) {
          printOrRun(char, this, 'msg');
        } else {
          msg(lang.npc_heading(char, dir));
        }
        world.setRoom(char, this.name, false);
        return true
      }
    };
    // These two will not be saved!!!
    this.isLocked = function () { return this.locked };
    this.isHidden = function () { return this.hidden || game.dark };
    for (const key in hash) {
      this[key] = hash[key];
    }
  }

  // ============  Output  =======================================
  // @DOC
  // ##Output functions
  //
  // The idea is that you can have them display differently - or not at all -
  // so error messages can be displayed in red, meta-data (help., etc)
  // is grey, and debug messages can be turned on and off as required.
  //
  // Note that not all use the text processor (so if there is an issue with
  // the text processor, we can use the others to report it). Also unit tests
  // capture output with msg and errormsg, but not debugmsg or headings.
  //
  // Should all be language neutral
  // @UNDOC

  // @DOC
  // Output a standard message, as an HTML paragraph element (P).
  // The string will first be passed through the text processor.
  // Additional data can be put in the optional params dictionary.
  // You can specify a CSS class to use.
  // During unit testing, messages will be saved and tested
  function msg (s, params, cssClass) {
    if (cssClass === undefined) cssClass = 'defaultP';
    const processed = processText(s, params).trim();
    if (processed === '') return

    if (test.testing) {
      test.testOutput.push(processed);
      return
    }
    const lines = processed.split('|');
    for (let line of lines) {
      const tag = (/^#/.test(line) ? 'h4' : 'p');
      line = line.replace(/^#/, '');
      if (settings.typewriter) {
        typeWriter.write(tag, line);
      } else {
        io.addToOutputQueue('<' + tag + ' @@@@ class="' + cssClass + '">' + line + '</' + tag + '>');
      }
      if (game.spoken) io.speak(line);
      if (game.transcript) game.scriptAppend('-' + line);
    }
  }

  function msgUnscramble (s, params, cssClass) {
    const processed = processText(s, params).trim();
    if (processed === '') return

    if (test.testing) {
      return
    }
    const lines = processed.split('|');
    for (let i = 0; i < lines.length; i++) {
      unscrambler.write('p', lines[i]);
      if (game.spoken) io.speak(lines[i]);
      if (game.transcript) game.scriptAppend('-' + lines[i]);
    }
  }

  // @DOC
  // As `msg`, but handles an array of strings. Each string is put in its own HTML paragraph,
  // and the set is put in an HTML division (DIV). The cssClass is applied to the division.
  function msgDiv (arr, params, cssClass) {
    if (test.testing) return
    let s = '<div class="' + cssClass + '" @@@@>\n';
    for (const item of arr) {
      const processed = processText(item, params).trim();
      if (processed === '') continue
      s += '  <p>' + processed + '</p>\n';
      if (game.spoken) io.speak(processed);
      if (game.transcript) game.scriptAppend('~' + processed);
    }
    io.addToOutputQueue(s + '</div>\n');
  }

  // @DOC
  // As `msg`, but handles an array of strings in a list. Each string is put in its own HTML list item (LI),
  // and the set is put in an HTML order list (OL) or unordered list (UL), depending on the value of `ordered`.
  function msgList (arr, ordered, params) {
    if (test.testing) return
    let s = ordered ? '<ol>\n' : '<ul @@@@>\n';
    for (const item of arr) {
      const processed = processText(item, params).trim();
      if (processed === '') continue
      s += '  <li>' + processed + '</li>\n';
      if (game.spoken) io.speak(processed);
      if (game.transcript) game.scriptAppend('*' + processed);
    }
    io.addToOutputQueue(s + (ordered ? '</ol>' : '</ul>\n'));
  }

  // @DOC
  // As `msg`, but handles an array of arrays of strings in a list. This is laid out in an HTML table.
  // If `headings` is present, this array of strings is used as the column headings.
  function msgTable (arr, headings, params) {
    if (test.testing) return
    let s = '<table @@@@>\n';
    if (headings) {
      s += '  <tr>\n';
      for (const item of headings) {
        const processed = processText(item, params).trim();
        s += '    <th>' + processed + '</th>\n';
        if (game.spoken) io.speak(processed);
        if (game.transcript) game.scriptAppend('|' + processed);
      }
      s += '  </tr>\n';
    }
    for (const row of arr) {
      s += '  <tr>\n';
      for (const item of row) {
        const processed = processText(item, params).trim();
        s += '    <td>' + processed + '</td>\n';
        if (game.spoken) io.speak(processed);
        if (game.transcript) game.scriptAppend('|' + processed);
      }
      s += '  </tr>\n';
    }
    io.addToOutputQueue(s + '</table>\n');
  }

  // @DOC
  // As `msg`, but the string is presented as an HTML heading (H1 to H6).
  // The level of the heading is determined by `level`, with 1 being the top, and 6 the bottom.
  // Headings are ignored during unit testing.
  function msgHeading (s, level, params) {
    const processed = processText(s, params);
    if (!test.testing) {
      if (settings.typewriter) {
        typeWriter.write('h' + level, processed);
      } else {
        io.addToOutputQueue('<h' + level + ' @@@@">' + processed + '</h' + level + '>\n');
      }
    }
    if (game.spoken) io.speak(s);
    if (game.transcript) game.scriptAppend(level.toString() + s);
  }

  // @DOC
  // Output a picture, as an HTML image element (IMG).
  // If width and height are omitted, the size of the image is used.
  // If height is omitted, the height will be proportional to the given width.
  // The file name should include the path. For a local image, that would probably be the images folder,
  // but it could be the web address of an image hosted elsewhere.
  function picture (filename, width, height) {
    let s = '<img src="' + filename + '"';
    if (width) s += ' width="' + width + '"';
    if (height) s += ' height="' + height + '"';
    s += ' @@@@>';
    io.addToOutputQueue(s);
  }

  // @DOC
  // Just the same as msg, but adds the "failed" CSS class. This allows failed command responses to be differentiated.
  // Returns the value FAILED, allowing commands to give a message and give up
  //     if (notAllowed) return failedmsg("That is not allowed.")
  function failedmsg (s, params) {
    msg(s, params, 'failed');
    return FAILED
  }

  // @DOC
  // Just the same as msg, but adds the "failed" CSS class. This allows failed command responses to be differentiated.
  // Returns the value false, allowing commands to give a message and give up
  //     if (notAllowed) return falsemsg("That is not allowed.")
  function falsemsg (s, params) {
    msg(s, params, 'failed');
    return false
  }

  // @DOC
  // Output a meta-message - a message to inform the player about something outside the game world,
  // such as hints and help messages.
  // The string will first be passed through the text processor.
  // Additional data can be put in the optional params dictionary.
  // During unit testing, messages will be saved and tested
  function metamsg (s, params) {
    const processed = processText(s, params);
    if (test.testing) {
      test.testOutput.push(processed);
      return
    }
    io.addToOutputQueue('<p @@@@ class="meta">' + processed + '</p>');
    if (game.spoken) io.speak(processed);
    if (game.transcript) game.scriptAppend('M' + processed);
  }

  // @DOC
  // Output an error message.
  // Use for when something has gone wrong, but not when the player types something odd -
  // if you see this during play, there is a bug in your game (or my code!), it is not the player
  // to blame.
  // During unit testing, error messages will be saved and tested.
  // Does not use the text processor (as it could be an error in there!).
  function errormsg (s) {
    if (test.testing) {
      test.testOutput.push(s);
      return
    }
    io.addToOutputQueue('<p @@@@ class="error">' + s + '</p>');
    if (game.spoken) io.speak('Error: ' + s);
    if (game.transcript) game.scriptAppend('E' + s);
    return false
  }

  // @DOC
  // Output a message from the parser indicating the input text could not be parsed.
  // During unit testing, messages will be saved and tested.
  // Does not use the text processor.
  function parsermsg (s) {
    if (test.testing) {
      test.testOutput.push(s);
      return
    }
    io.addToOutputQueue('<p @@@@ class="parser">' + s + '</p>');
    if (game.spoken) io.speak('Parser error: ' + s);
    if (game.transcript) game.scriptAppend('P' + s);
    return false
  }

  // @DOC
  // Output a debug message.
  // Debug messages are ignored if DEBUG is false
  // and are printed normally during unit testing.
  // You should also consider using `console.log` when debugging; it gives a message in the console,
  // and outputs objects and array far better.
  // Does not use the text processor.
  // Does not get spoken allowed.
  function debugmsg (s) {
    if (settings.debug) {
      io.addToOutputQueue('<p @@@@ class="debug">' + s + '</p>');
      if (game.transcript) game.scriptAppend('D' + s);
    }
  }

  // @DOC
  // If the given attribute is a string it is printed, if it is a
  // function it is called. Otherwise an error is generated.
  // It isMultiple is true, the object name is prefixed.
  // TODO: test array with function
  function printOrRun (char, item, attname, options) {
    if (options === undefined) options = {};
    let flag, i;
    if (Array.isArray(item[attname])) {
      // the attribute is an array
      // debugmsg(0, "Array: " + attname);
      flag = true;
      for (i = 0; i < item[attname].length; i++) {
        flag = printOrRun(char, item, item[attname][i], options) && flag;
      }
      return flag
    }
    if (Array.isArray(attname)) {
      // The value is an array
      flag = true;
      for (i = 0; i < attname.length; i++) {
        flag = printOrRun(char, item, attname[i], options) && flag;
      }
      return flag
    } else if (!item[attname]) {
      // This is not an attribute
      if (typeof attname === 'function') {
        return attname(item, options.multi, char, options)
      } else {
        msg(attname, { char: char, item: item });
        return true
      }
    } else if (typeof item[attname] === 'string') {
      // The attribute is a string
      msg(prefix(item, options.multi) + item[attname], { char: char, item: item });
      return true
    } else if (typeof item[attname] === 'function') {
      // The attribute is a function
      const res = item[attname](options.multi, char, options);
      return res
    } else {
      errormsg('Unsupported type for printOrRun');
      return false
    }
  }

  // @DOC
  // Clears the screen.
  function clearScreen () {
    for (let i = 0; i < io.nextid; i++) {
      $('#n' + i).remove();
    }
  }

  // @DOC
  // Stops outputting whilst waiting for the player to click.
  function wait (delay) {
    if (test.testing) return
    if (delay === undefined) {
      io.outputQueue.push({ action: 'wait', disable: true });
    } else {
      io.outputQueue.push({ action: 'delay', disable: true, delay: delay });
    }
  }

  function askQuestion (title, fn) {
    msg(title);
    parser.override = fn;
  }

  // @DOC
  // Use like this:
  //      showMenu('What is your favourite color?', ['Blue', 'Red', 'Yellow', 'Pink'], function(result) {
  //        msg("You picked " + result + ".");
  //      });
  function showMenu (title, options, fn) {
    io.input(title, options, fn, function (options) {
      for (let i = 0; i < options.length; i++) {
        let s = '<a class="menuoption" onclick="io.menuResponse(' + i + ')">';
        s += (options[i].byname ? sentenceCase(options[i].byname({ article: DEFINITE })) : options[i]);
        s += '</a>';
        msg(s);
      }
    });
  }

  function showDropDown (title, options, fn) {
    io.input(title, options, fn, function (options) {
      let s = '<select id="menu-select" class="custom-select" style="width:400px;" ';
      s += 'onchange=\"io.menuResponse($(\'#menu-select\').find(\':selected\').val())\">';
      s += '<option value="-1">-- Select one --</option>';
      for (let i = 0; i < options.length; i++) {
        s += '<option value="' + i + '">';
        s += (options[i].byname ? sentenceCase(options[i].byname({ article: DEFINITE })) : options[i]);
        s += '</option>';
      }
      msg(s + '</select>');
      // $('#menu-select').selectmenu();
      $('#menu-select').focus();
    });
  }

  function showYesNoMenu (title, fn) {
    showMenu(title, lang.yesNo, fn);
  }

  function showYesNoDropDown (title, fn) {
    showDropDown(title, lang.yesNo, fn);
  }

  // This should be called after each turn to ensure we are at the end of the page and the text box has the focus
  function endTurnUI (update) {
    // debugmsg("In endTurnUI");
    if (settings.panes !== 'None' && update) {
      // set the lang.exit_list
      for (const exit of lang.exit_list) {
        if (game.room.hasExit(exit.name, { excludeScenery: true }) || exit.nocmd) {
          $('#exit' + exit.name).show();
        } else {
          $('#exit' + exit.name).hide();
        }
      }
      io.updateStatus();
      if (typeof ioUpdateCustom === 'function') ioUpdateCustom();
      io.updateUIItems();
    }

    // scroll to end
    setTimeout(io.scrollToEnd, 1);
    // give focus to command bar
    if (settings.textInput) { $('#textbox').focus(); }
  }

  // ============  Hidden from creators!  =======================================

  const io = {};

  io.input = function (title, options, reactFunction, displayFunction) {
    io.menuStartId = io.nextid;
    io.menuFn = reactFunction;
    io.menuOptions = options;

    if (test.testing) {
      if (test.menuResponseNumber === undefined) {
        debugmsg('Error when testing menu (possibly due to disambiguation?), test.menuResponseNumber = ' + test.menuResponseNumber);
      } else {
        io.menuResponse(test.menuResponseNumber);
        test.menuResponseNumber = undefined;
      }
      return
    }

    io.disable();
    msg(title, {}, 'menutitle');
    displayFunction(options);
  };

  io.outputQueue = [];
  io.outputSuspended = false;

  // Stops the current pause immediately (no effect if not paused)
  io.unpause = function () {
    io.outputSuspended = false;
    io.outputFromQueue();
  };

  io.addToOutputQueue = function (s) {
    if (typeof s === 'string') {
      io.outputQueue.push({ html: s.replace('@@@@', 'id="n' + io.nextid + '"'), action: 'output', id: io.nextid });
    } else {
      s.id = io.nextid;
      io.outputQueue.push(s);
    }
    io.nextid++;
    io.outputFromQueue();
  };

  io.outputFromQueue = function () {
    if (io.outputQueue.length === 0) {
      return
    }
    if (io.outputSuspended) return

    const data = io.outputQueue.shift();
    if (data.disable) io.disable();
    if (data.action === 'wait') {
      io.outputSuspended = true;
      io.clickToContinueLink();
    }
    if (data.action === 'delay') {
      setTimeout(io.outputFromQueue, data.delay * 1000);
    }
    if (data.action === 'output') {
      $('#output').append(data.html);
      io.outputFromQueue();
    }
    if (data.action === 'effect') {
      data.effect(data);
    }
    window.scrollTo(0, document.getElementById('main').scrollHeight);
  };

  io.clickToContinueLink = function () {
    $('#output').append('<p id="n' + io.nextid + '"><a class="continue" onclick="io.waitContinue()">' + lang.click_to_continue + '</a></p>');
    io.continuePrintId = io.nextid;
    io.nextid++;
  };

  io.waitContinue = function () {
    const el = document.getElementById('n' + io.continuePrintId);
    el.style.display = 'none';
    io.unpause();
    //  io.enable();
  };

  io.typewriterEffect = function (data) {
    if (!data.position) {
      $('#output').append('<' + data.tag + ' id="n' + data.id + '" class=\"typewriter\"></' + data.tag + '>');
      data.position = 0;
      data.text = processText(data.text, data.params);
    }
    const el = $('#n' + data.id);
    el.html(data.text.slice(0, data.position) + '<span class="typewriter-active">' + data.text.slice(data.position, data.position + 1) + '</span>');
    data.position++;
    if (data.position <= data.text.length) io.outputQueue.unshift(data);
    setTimeout(io.outputFromQueue, settings.textEffectDelay);
  };

  io.unscrambleEffect = function (data) {
    // Set it the system
    if (!data.count) {
      $('#output').append('<' + data.tag + ' id="n' + data.id + '" class="unscrambler"></' + data.tag + '>');
      data.count = 0;
      data.text = processText(data.text, data.params);
      if (!data.pick) data.pick = io.unscamblePick;
      data.mask = '';
      data.scrambled = '';
      for (let i = 0; i < data.text.length; i++) {
        if (data.text.charAt(i) === ' ' && !data.incSpaces) {
          data.scrambled += ' ';
          data.mask += ' ';
        } else {
          data.scrambled += data.pick(i);
          data.mask += 'x';
          data.count++;
        }
      }
    }

    if (data.randomPlacing) {
      let pos = randomInt(0, data.count - 1);
      let newMask = '';
      for (let i = 0; i < data.mask.length; i++) {
        if (data.mask.charAt(i) === ' ') {
          newMask += ' ';
        } else if (pos === 0) {
          newMask += ' ';
          pos--;
        } else {
          newMask += 'x';
          pos--;
        }
      }
      data.mask = newMask;
    } else {
      data.mask = data.mask.replace('x', ' ');
    }
    data.count--;
    $('#n' + data.id).html(io.unscambleScramble(data));
    if (data.count > 0) io.outputQueue.unshift(data);
    setTimeout(io.outputFromQueue, settings.textEffectDelay);
  };

  io.unscamblePick = function () {
    const c = String.fromCharCode(randomInt(33, 125));
    return c === '<' ? '~' : c
  };

  io.unscambleScramble = function (data) {
    let s = '';
    for (let i = 0; i < data.text.length; i++) {
      s += (data.mask.charAt(i) === ' ' ? data.text.charAt(i) : data.pick(i));
    }
    return s
  };

  io.cmdLink = function (command, str) {
    return '<a class="cmdlink" onclick="parser.parse(\'' + command + '\')">' + str + '</a>'
  };

  io.scrollToEnd = function () {
    window.scrollTo(0, document.getElementById('main').scrollHeight);
  };

  io.rect = function (x, y, w, h, c) {
    return '<rect width="' + w + '" height="' + h + '" x="' + x + '" y="' + y + '" style="fill:' + c + ';stroke-width:1;stroke:black" />'
  };
  io.circle = function (x, y, r, c) {
    return '<circle r="' + r + '" cx="' + x + '" cy="' + y + '" style="fill:' + c + ';stroke-width:1;stroke:black" />'
  };

  // Each line that is output is given an id, n plus an id number.
  io.nextid = 0;
  // This is used by showMenu to prevent the user ignoring the menu
  io.inputIsDisabled = false;
  // A list of names for items currently display in the inventory panes
  io.currentItemList = [];

  io.setTitle = function (s) {
    document.title = s;
  };

  io.disable = function () {
    if (io.inputIsDisabled) return
    io.inputIsDisabled = true;
    $('#input').css('display', 'none');
    $('.compassbutton').css('color', '#808080');
    $('.item').css('color', '#808080');
    $('.itemaction').css('color', '#808080');
  };

  io.enable = function () {
    if (!io.inputIsDisabled) return
    io.inputIsDisabled = false;
    $('#input').css('display', 'block');
    $('.compassbutton').css('color', io.textColour);
    $('.item').css('color', io.textColour);
    $('.itemaction').css('color', io.textColour);
  };

  io.updateUIItems = function () {
    if (settings.panes === 'None') { return }

    for (const inv of settings.inventories) {
      $('#' + inv.alt).empty();
    }

    io.currentItemList = [];
    for (const key in w) {
      const item = w[key];
      for (const inv of settings.inventories) {
        const loc = inv.getLoc();
        if (inv.test(item) && !item.inventorySkip) {
          io.appendItem(item, inv.alt, loc);
        }
      }
    }
    io.clickItem('');
  };

  io.updateStatus = function () {
    if (!settings.statusPane) return

    $('#status-pane').empty();
    for (const st of settings.status) {
      if (typeof st === 'string') {
        if (game.player[st] !== undefined) {
          let s = '<tr><td width="' + settings.statusWidthLeft + '">' + sentenceCase(st) + '</td>';
          s += '<td width="' + settings.statusWidthRight + '">' + game.player[st] + '</td></tr>';
          $('#status-pane').append(s);
        }
      } else if (typeof st === 'function') {
        $('#status-pane').append('<tr>' + st() + '</tr>');
      }
    }
  };

  io.menuResponse = function (n) {
    io.enable();
    $('#input').css('display', 'block');
    for (let i = io.menuStartId; i < io.nextid; i++) {
      $('#n' + i).remove();
    }
    if (n === undefined) {
      io.menuFn(n);
    } else if (n !== -1) {
      io.menuFn(io.menuOptions[n]);
    }
    endTurnUI(true);
    if (settings.textInput) $('#textbox').focus();
  };

  io.clickExit = function (dir) {
    if (io.inputIsDisabled) return
    io.msgInputText(dir);
    let cmd = io.getCommand('Go' + sentenceCase(dir));
    if (!cmd) cmd = io.getCommand(sentenceCase(dir));
    parser.quickCmd(cmd);
  };

  io.clickItem = function (itemName) {
    if (io.inputIsDisabled) return

    for (const item of io.currentItemList) {
      if (item === itemName) {
        $('.' + item + '-actions').toggle();
      } else {
        $('.' + item + '-actions').hide();
      }
    }
  };

  io.clickItemAction = function (itemName, action) {
    if (io.inputIsDisabled) return

    const item = w[itemName];
    action = action.split(' ').map(el => sentenceCase(el)).join('');
    const cmd = io.getCommand(action);
    if (cmd === undefined) {
      errormsg("I don't know that command (" + action + ') - and obviously I should as you just clicked it. Please alert the game author about this bug (F12 for more).');
      console.log('Click action failed');
      console.log('Action: ' + action);
      console.log('Item: ' + itemName);
      console.log('Click actions in the side pane by-pass the usual parsing process because it is considered safe to say they will already match a command and an item. This process assumes there are commands with that exact name (case sensitive). In this case you need a command called "' + action + '" (with only one element in its actions list).');
      console.log('One option would be to create a new command just to catch the side pane click, and give it a nonsense regex so it never gets used when the player types a command.');
    } else if (cmd.objects.filter(el => !el.ignore).length !== 1) {
      errormsg('That command (' + action + ') cannot be used with an action in the side pane. Please alert the game author about this bug (F12 for more).');
      console.log('Click action failed');
      console.log('Action: ' + action);
      console.log('Item: ' + itemName);
      console.log('Click actions in the side pane by-pass the usual parsing process because it is considered safe to say they will already match a command and an item. This process assumes a command with exactly one entry in the objects list, and will fail if that is not the case.');
      console.log('If you think this is already the case, it may be worth checking that there are not two (or more) commands with the same name.');
      console.log('One option would be to create a new command just to catch the side pane click, and give it a nonsense regex so it never gets used when the player types a command.');
    } else if (item === undefined) {
      errormsg("I don't know that object (" + itemName + ') - and obviously I should as it was listed. Please alert this as a bug in Quest.');
    } else {
      io.msgInputText(action + ' ' + item.alias);
      parser.quickCmd(cmd, item);
    }
  };

  // Add the item to the DIV named htmlDiv
  // The item will be given verbs from its attName attribute
  io.appendItem = function (item, htmlDiv, loc, isSubItem) {
    if (typeof item.icon !== 'function') {
      console.log('No icon function for:');
      console.log(item);
    }
    $('#' + htmlDiv).append('<p class="item' + (isSubItem ? ' subitem' : '') + '" onclick="io.clickItem(\'' + item.name + '\')">' + item.icon() + item.getListAlias(loc) + '</p>');
    io.currentItemList.push(item.name);
    const verbList = item.getVerbs(loc);
    if (verbList === undefined) { errormsg('No verbs for ' + item.name); console.log(item); }
    for (const verb of verbList) {
      let s = '<div class="' + item.name + '-actions itemaction" onclick="io.clickItemAction(\'' + item.name + '\', \'' + verb + '\')">';
      s += verb;
      s += '</div>';
      $('#' + htmlDiv).append(s);
    }
    if (item.container && !item.closed) {
      if (typeof item.getContents !== 'function') {
        console.log('item flagged as container but no getContents function:');
        console.log(item);
      }
      const l = item.getContents(display.SIDE_PANE);
      for (const el of l) {
        io.appendItem(el, htmlDiv, item.name, true);
      }
    }
  };

  // Creates the panes on the left or right
  // Should only be called once, when the page is first built
  io.createPanes = function () {
    if (settings.panes === 'None') { return }
    document.writeln('<div id="panes" class="sidepanes sidepanes' + settings.panes + '">');

    if (settings.compass) {
      if (settings.divider) document.writeln('<img src="images/' + settings.divider + '" />');
      document.writeln('<div class="paneDiv">');
      document.writeln('<table id="compass-table">');
      for (let i = 0; i < 3; i++) {
        document.writeln('<tr>');
        io.writeExit(0 + 5 * i);
        io.writeExit(1 + 5 * i);
        io.writeExit(2 + 5 * i);
        document.writeln('<td></td>');
        io.writeExit(3 + 5 * i);
        io.writeExit(4 + 5 * i);
        document.writeln('</tr>');
      }
      document.writeln('</table>');
      document.writeln('</div>');
    }

    if (settings.statusPane) {
      if (settings.divider) document.writeln('<img src="images/' + settings.divider + '" />');
      document.writeln('<div class="paneDiv">');
      document.writeln('<h4>' + settings.statusPane + ':</h4>');
      document.writeln('<table id="status-pane">');
      document.writeln('</table>');
      document.writeln('</div>');
    }

    for (const inv of settings.inventories) {
      if (settings.divider) document.writeln('<img src="images/' + settings.divider + '" />');
      document.writeln('<div class="paneDiv">');
      document.writeln('<h4>' + inv.name + ':</h4>');
      document.writeln('<div id="' + inv.alt + '">');
      document.writeln('</div>');
      document.writeln('</div>');
    }
    if (settings.divider) document.writeln('<img src="images/' + settings.divider + '" />');
    document.writeln('</div>');

    if (typeof ioCreateCustom === 'function') ioCreateCustom();

    $('#input').html(settings.cursor + '<input type="text" name="textbox" id="textbox"  autofocus/>');
  };

  io.writeExit = function (n) {
    document.writeln('<td class="compassbutton">');
    document.writeln('<span class="compassbutton" id="exit' + lang.exit_list[n].name + '" onclick="io.clickExit(\'' + lang.exit_list[n].name + '\')">' + lang.exit_list[n].abbrev + '</span>');
    document.writeln('</td>');
  };

  // Gets the command with the given name
  io.getCommand = function (name) {
    const found = commands.find(function (el) {
      return el.name === name
    });
    return found
  };

  io.msgInputText = function (s) {
    if (!settings.cmdEcho) return
    $('#output').append('<p id="n' + io.nextid + '" class="inputtext">&gt; ' + s + '</p>');
    io.nextid++;
    if (game.spoken) io.speak(s, true);
    if (game.transcript) game.scriptAppend('I' + s);
  };

  io.savedCommands = ['help'];
  io.savedCommandsPos = 0;
  $(document).ready(function () {
    $('#textbox').keydown(function (event) {
      const keycode = (event.keyCode ? event.keyCode : event.which);
      for (const exit of lang.exit_list) {
        if (exit.key && exit.key === keycode) {
          io.msgInputText(exit.name);
          parser.parse(exit.name);
          $('#textbox').val('');
          event.stopPropagation();
          event.preventDefault();
          console.log('Caught');
          return false
        }
      }
      if (keycode === 13) {
        // enter
        const s = $('#textbox').val();
        io.msgInputText(s);
        if (s) {
          if (io.savedCommands[io.savedCommands.length - 1] !== s) {
            io.savedCommands.push(s);
          }
          io.savedCommandsPos = io.savedCommands.length;
          parser.parse(s);
          $('#textbox').val('');
        }
      }
      if (keycode === 38) {
        // up arrow
        io.savedCommandsPos -= 1;
        if (io.savedCommandsPos < 0) { io.savedCommandsPos = 0; }
        $('#textbox').val(io.savedCommands[io.savedCommandsPos]);
        // Get cursor to end of text
        const el = $('#textbox')[0];
        if (el.setSelectionRange) {
          setTimeout(function () { el.setSelectionRange(9999, 9999); }, 0);
        } else if (typeof el.selectionStart === 'number') {
          el.selectionStart = el.selectionEnd = el.value.length;
        } else if (typeof el.createTextRange !== 'undefined') {
          el.focus();
          var range = el.createTextRange();
          range.collapse(false);
          range.select();
        }
      }
      if (keycode === 40) {
        // down arrow
        io.savedCommandsPos += 1;
        if (io.savedCommandsPos >= io.savedCommands.length) { io.savedCommandsPos = io.savedCommands.length - 1; }
        $('#textbox').val(io.savedCommands[io.savedCommandsPos]);
      }
      if (keycode === 27) {
        // ESC
        $('#textbox').val('');
      }
      if (keycode === 96 && settings.debug) {
        parser.parse('test');
        setTimeout(function () { $('#textbox').val(''); }, 1);
      }
    });
    io.textColour = $('.sidepanes').css('color');
    game.initialise();

    endTurnUI(true);
    game.begin();
  });

  io.synth = window.speechSynthesis;
  io.voice = null;
  io.voice2 = null;

  io.speak = function (str, altVoice) {
    if (!io.voice) {
      io.voice = io.synth.getVoices().find(function (el) {
        return /UK/.test(el.name) && /Female/.test(el.name)
      });
      if (!io.voice) io.voice = io.synth.getVoices()[0];
    }
    if (!io.voice2) {
      io.voice2 = io.synth.getVoices().find(function (el) {
        return /UK/.test(el.name) && /Male/.test(el.name)
      });
      if (!io.voice2) io.voice2 = io.synth.getVoices()[0];
    }

    const utterThis = new SpeechSynthesisUtterance(str);
    utterThis.onend = function (event) {
      // console.log('SpeechSynthesisUtterance.onend');
    };
    utterThis.onerror = function (event) {
      // console.error('SpeechSynthesisUtterance.onerror: ' + event.name);
    };
    utterThis.voice = altVoice ? io.voice2 : io.voice;
    // I think these can vary from 0 to 2
    utterThis.pitch = 1;
    utterThis.rate = 1;
    io.synth.speak(utterThis);
  };

  io.dialogShowing = false;
  // @DOC
  // Appends an HTML DIV, with the given title and content,
  // and shows it as a dialog. Used by the transcript
  // (and really only useful for displaying data).
  io.showHtml = function (title, html) {
    if (io.dialogShowing) return false
    $('body').append('<div id="showHtml" title="' + title + '">' + html + '</div>');
    io.dialogShowing = true;
    $('#showHtml').dialog({
      width: 860,
      close: function () { $('#showHtml').remove(); io.dialogShowing = false; }
    });
    return true
  };

  // A command has an arbitrary name, a regex or pattern,

  const cmdDirections = [];
  for (const exit of lang.exit_list) {
    if (exit.nocmd) continue
    cmdDirections.push(exit.name);
    cmdDirections.push(exit.abbrev.toLowerCase());
    if (exit.alt) cmdDirections.push(exit.alt);
  }

  const commands = [
    // ----------------------------------
    // Single word commands

    // Cannot just set the script to helpScript as we need to allow the
    // author to change it in code.js, which is loaded after this.
    new Cmd('MetaHelp', {
      script: lang.helpScript
    }),
    new Cmd('MetaCredits', {
      script: lang.aboutScript
    }),

    new Cmd('MetaSpoken', {
      script: function () {
        game.spoken = true;
        metamsg(lang.spoken_on);
        return SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('MetaIntro', {
      script: function () {
        game.spoken = true;
        if (typeof settings.intro === 'string') msg(settings.intro);
        return SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('MetaUnspoken', {
      script: function () {
        game.spoken = false;
        metamsg(lang.spoken_off);
        return SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('MetaBrief', {
      script: function () {
        game.verbosity = BRIEF;
        metamsg(lang.mode_brief);
        return SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('MetaTerse', {
      script: function () {
        game.verbosity = TERSE;
        metamsg(lang.mode_terse);
        return SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('MetaVerbose', {
      script: function () {
        game.verbosity = VERBOSE;
        metamsg(lang.mode_verbose);
        return SUCCESS_NO_TURNSCRIPTS
      }
    }),

    new Cmd('MetaTranscript', {
      script: lang.transcriptScript
    }),
    new Cmd('MetaTranscriptOn', {
      script: function () {
        if (game.transcript) {
          metamsg(lang.transcript_already_on);
          return FAILED
        }
        game.scriptStart();
        return SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('MetaTranscriptOff', {
      script: function () {
        if (!game.transcript) {
          metamsg(lang.transcript_already_off);
          return FAILED
        }
        game.scriptEnd();
        return SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('MetaTranscriptClear', {
      script: function () {
        game.scriptClear();
        return SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('MetaTranscriptShow', {
      script: function () {
        game.scriptShow();
        return SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('MetaTranscriptShowWithOptions', {
      script: function (arr) {
        game.scriptShow(arr[0]);
        return SUCCESS_NO_TURNSCRIPTS
      },
      objects: [
        { text: true }
      ]
    }),

    // ----------------------------------
    // File system commands
    new Cmd('MetaSave', {
      script: lang.saveLoadScript
    }),
    new Cmd('MetaSaveGame', {
      script: function (arr) {
        saveLoad.saveGame(arr[0]);
        return SUCCESS_NO_TURNSCRIPTS
      },
      objects: [
        { text: true }
      ]
    }),
    new Cmd('MetaLoad', {
      script: lang.saveLoadScript
    }),
    new Cmd('MetaLoadGame', {
      script: function (arr) {
        saveLoad.loadGame(arr[0]);
        return SUCCESS_NO_TURNSCRIPTS
      },
      objects: [
        { text: true }
      ]
    }),
    new Cmd('MetaDir', {
      script: function () {
        saveLoad.dirGame();
        return SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('MetaDeleteGame', {
      script: function (arr) {
        saveLoad.deleteGame(arr[0]);
        return SUCCESS_NO_TURNSCRIPTS
      },
      objects: [
        { text: true }
      ]
    }),

    new Cmd('Undo', {
      script: function () {
        if (settings.maxUndo === 0) {
          metamsg(lang.undo_disabled);
          return FAILED
        }
        if (game.gameState.length < 2) {
          metamsg(lang.undo_not_available);
          return FAILED
        }
        game.gameState.pop();
        const gameState = game.gameState[game.gameState.length - 1];
        metamsg(lang.undo_done);
        saveLoad.loadTheWorld(gameState);
        w[game.player.loc].description();
      }
    }),

    new Cmd('Look', {
      script: function () {
        game.room.description();
        return settings.lookCountsAsTurn ? SUCCESS : SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('Exits', {
      script: function () {
        msg(lang.can_go());
        return settings.lookCountsAsTurn ? SUCCESS : SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('Wait', {
      script: function () {
        msg(lang.wait_msg);
        return SUCCESS
      }
    }),
    new Cmd('TopicsNote', {
      script: lang.topicsScript
    }),

    new Cmd('Inv', {
      script: function () {
        const listOfOjects = game.player.getContents(display.ALL);
        msg(lang.inventoryPreamble + ' ' + formatList(listOfOjects, { article: INDEFINITE, lastJoiner: lang.list_and, modified: true, nothing: lang.list_nothing, loc: game.player.name }) + '.');
        return settings.lookCountsAsTurn ? SUCCESS : SUCCESS_NO_TURNSCRIPTS
      }
    }),
    new Cmd('Map', {
      script: function () {
        if (typeof showMap !== 'undefined') {
          lang.showMap();
          return settings.lookCountsAsTurn ? SUCCESS : SUCCESS_NO_TURNSCRIPTS
        } else {
          return failedmsg(lang.no_map)
        }
      }
    }),
    new Cmd('Smell', {
      script: function () {
        if (game.room.onSmell) {
          printOrRun(game.player, game.room, 'onSmell');
        } else {
          msg(lang.no_smell(game.player));
        }
        return SUCCESS
      }
    }),
    new Cmd('Listen', {
      script: function () {
        if (game.room.onListen) {
          printOrRun(game.player, game.room, 'onListen');
        } else {
          msg(lang.no_listen(game.player));
        }
        return SUCCESS
      }
    }),
    new Cmd('PurchaseFromList', {
      script: function () {
        const l = [];
        for (const key in w) {
          if (parser.isForSale(w[key])) {
            const price = w[key].getBuyingPrice(game.player);
            const row = [sentenceCase(w[key].byname()), displayMoney(price)];
            row.push(price > game.player.money ? '-' : '{cmd:buy ' + w[key].alias + ':' + lang.buy + '}');
            l.push(row);
          }
        }
        if (l.length === 0) {
          return failedmsg(lang.nothing_for_sale)
        }
        msg(lang.current_money + ': ' + displayMoney(game.player.money));
        msgTable(l, lang.buy_headings);
        return SUCCESS_NO_TURNSCRIPTS
      }
    }),

    // ----------------------------------
    // Verb-object commands
    new Cmd('Examine', {
      objects: [
        { scope: parser.isPresent, multiple: true }
      ],
      defmsg: lang.default_examine
    }),
    new Cmd('LookAt', { // used for NPCs
      attName: 'examine',
      objects: [
        { scope: parser.isPresentOrMe }
      ],
      defmsg: lang.default_examine
    }),
    new Cmd('LookOut', {
      rules: [cmdRules.isHere],
      objects: [
        { scope: parser.isPresent }
      ],
      attName: 'lookout',
      defmsg: lang.cannot_look_out
    }),
    new Cmd('LookBehind', {
      rules: [cmdRules.isHere],
      attName: 'lookbehind',
      objects: [
        { scope: parser.isPresent }
      ],
      defmsg: lang.nothing_there
    }),
    new Cmd('LookUnder', {
      rules: [cmdRules.isHere],
      attName: 'lookunder',
      objects: [
        { scope: parser.isPresent }
      ],
      defmsg: lang.nothing_there
    }),
    new Cmd('LookInside', {
      rules: [cmdRules.isHere],
      attName: 'lookinside',
      objects: [
        { scope: parser.isPresent }
      ],
      defmsg: lang.nothing_inside
    }),
    new Cmd('Search', {
      rules: [cmdRules.isHere],
      attName: 'search',
      objects: [
        { scope: parser.isPresent }
      ],
      defmsg: lang.nothing_there
    }),

    new Cmd('Take', {
      npcCmd: true,
      rules: [cmdRules.isHereNotHeld, cmdRules.canManipulate],
      objects: [
        { scope: parser.isHereOrContained, multiple: true }
      ],
      defmsg: lang.cannot_take
    }),
    new Cmd('Drop', {
      npcCmd: true,
      rules: [cmdRules.isHeldNotWorn, cmdRules.canManipulate],
      objects: [
        { scope: parser.isHeld, multiple: true }
      ],
      defmsg: lang.not_carrying
    }),
    new Cmd('Wear2', {
      npcCmd: true,
      rules: [cmdRules.isHeldNotWorn, cmdRules.isHeld, cmdRules.canManipulate],
      attName: 'wear',
      objects: [
        { scope: parser.isHeld, multiple: true }
      ],
      defmsg: function (char, item) {
        return item.ensemble ? lang.cannot_wear_ensemble(char, item) : lang.cannot_wear(char, item)
      }
    }),
    new Cmd('Wear', {
      npcCmd: true,
      rules: [cmdRules.isHeldNotWorn, cmdRules.canManipulate],
      objects: [
        { scope: parser.isHeld, multiple: true }
      ],
      defmsg: function (char, item) {
        return item.ensemble ? lang.cannot_wear_ensemble(char, item) : lang.cannot_wear(char, item)
      }
    }),
    new Cmd('Remove', {
      npcCmd: true,
      rules: [cmdRules.isWorn, cmdRules.canManipulate],
      objects: [
        { scope: parser.isWorn, multiple: true }
      ],
      defmsg: function (char, item) {
        return item.ensemble ? lang.cannot_wear_ensemble(char, item) : lang.not_wearing(char, item)
      }
    }),
    new Cmd('Remove2', {
      npcCmd: true,
      rules: [cmdRules.isWorn, cmdRules.canManipulate],
      attName: 'remove',
      objects: [
        { scope: parser.isWorn, multiple: true }
      ],
      defmsg: function (char, item) {
        return item.ensemble ? lang.cannot_wear_ensemble(char, item) : lang.not_wearing(char, item)
      }
    }),
    new Cmd('Read', {
      npcCmd: true,
      rules: [cmdRules.isHere],
      objects: [
        { scope: parser.isHeld, multiple: true }
      ],
      defmsg: lang.cannot_read
    }),
    new Cmd('Eat', {
      npcCmd: true,
      rules: [cmdRules.isHeldNotWorn, cmdRules.canManipulate],
      objects: [
        { scope: parser.isHeld, multiple: true, attName: 'ingest' }
      ],
      defmsg: lang.cannot_eat
    }),
    new Cmd('Purchase', {
      npcCmd: true,
      rules: [cmdRules.canManipulate],
      objects: [
        { scope: parser.isForSale }
      ],
      defmsg: lang.cannot_purchase
    }),
    new Cmd('Sell', {
      npcCmd: true,
      rules: [cmdRules.isHeldNotWorn, cmdRules.canManipulate],
      objects: [
        { scope: parser.isHeld, multiple: true }
      ],
      defmsg: lang.cannot_sell
    }),
    new Cmd('Smash', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      objects: [
        { scope: parser.isHeld, multiple: true }
      ],
      defmsg: lang.cannot_smash
    }),
    new Cmd('SwitchOn', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      attName: 'switchon',
      cmdCategory: 'SwitchOn',
      objects: [
        { scope: parser.isHeld, multiple: true }
      ],
      defmsg: lang.cannot_switch_on
    }),
    new Cmd('SwitchOn2', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      attName: 'switchon',
      cmdCategory: 'SwitchOn',
      objects: [
        { scope: parser.isHeld, multiple: true }
      ],
      defmsg: lang.cannot_switch_on
    }),

    new Cmd('SwitchOff2', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      attName: 'switchoff',
      cmdCategory: 'SwitchOff',
      objects: [
        { scope: parser.isHeld, multiple: true, attName: 'switchon' }
      ],
      defmsg: lang.cannot_switch_off
    }),
    new Cmd('SwitchOff', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      attName: 'switchoff',
      cmdCategory: 'SwitchOff',
      objects: [
        { scope: parser.isHeld, multiple: true, attName: 'switchoff' }
      ],
      defmsg: lang.cannot_switch_off
    }),

    new Cmd('Open', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      objects: [
        { scope: parser.isPresent, multiple: true, attName: 'open' }
      ],
      defmsg: lang.cannot_open
    }),

    new Cmd('Close', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      objects: [
        { scope: parser.isPresent, multiple: true, attName: 'close' }
      ],
      defmsg: lang.cannot_close
    }),

    new Cmd('Lock', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      objects: [
        { scope: parser.isPresent, multiple: true, attName: 'lock' }
      ],
      defmsg: lang.cannot_lock
    }),

    new Cmd('Unlock', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      objects: [
        { scope: parser.isPresent, multiple: true, attName: 'unlock' }
      ],
      defmsg: lang.cannot_unlock
    }),

    new Cmd('Push', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      objects: [
        { scope: parser.isPresent }
      ],
      defmsg: lang.nothing_useful
    }),

    new Cmd('Pull', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      objects: [
        { scope: parser.isPresent }
      ],
      defmsg: lang.nothing_useful
    }),
    new Cmd('Fill', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      objects: [
        { scope: parser.isPresent }
      ],
      defmsg: lang.cannot_fill
    }),
    new Cmd('Empty', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      objects: [
        { scope: parser.isPresent }
      ],
      defmsg: lang.cannot_empty
    }),

    new Cmd('Eat', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      objects: [
        { text: true },
        { scope: parser.isPresent, attName: 'ingest' }
      ],
      defmsg: lang.cannot_eat
    }),
    new Cmd('Drink', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      objects: [
        { text: true },
        { scope: parser.isPresent, attName: 'ingest' }
      ],
      defmsg: lang.cannot_drink
    }),
    new Cmd('Ingest', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      objects: [
        { text: true },
        { scope: parser.isPresent, attName: 'ingest' }
      ],
      defmsg: lang.cannot_ingest
    }),

    new Cmd('SitOn', {
      npcCmd: true,
      cmdCategory: 'Posture',
      rules: [cmdRules.canPosture, cmdRules.isHereNotHeld],
      attName: 'siton',
      objects: [
        { scope: parser.isHere, attName: 'assumePosture' }
      ],
      defmsg: lang.cannot_sit_on
    }),
    new Cmd('StandOn', {
      npcCmd: true,
      cmdCategory: 'Posture',
      rules: [cmdRules.canPosture, cmdRules.isHereNotHeld],
      attName: 'standon',
      objects: [
        { scope: parser.isHere, attName: 'assumePosture' }
      ],
      defmsg: lang.cannot_stand_on
    }),
    new Cmd('ReclineOn', {
      npcCmd: true,
      cmdCategory: 'Posture',
      rules: [cmdRules.canPosture, cmdRules.isHereNotHeld],
      attName: 'reclineon',
      objects: [
        { scope: parser.isHere, attName: 'assumePosture' }
      ],
      defmsg: lang.cannot_recline_on
    }),
    new Cmd('GetOff', {
      npcCmd: true,
      cmdCategory: 'Posture',
      rules: [cmdRules.canPosture, cmdRules.isHereNotHeld],
      attName: 'getoff',
      objects: [
        { scope: parser.isHere, attName: 'assumePosture' }
      ],
      defmsg: lang.already
    }),

    new Cmd('Use', {
      npcCmd: true,
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      objects: [
        { scope: parser.isPresent, multiple: true }
      ],
      defmsg: lang.cannot_use
    }),

    new Cmd('TalkTo', {
      rules: [cmdRules.canTalkTo],
      attName: 'talkto',
      objects: [
        { scope: parser.isNpcAndHere }
      ],
      default: function (item) {
        return failedmsg(lang.cannot_talk_to(game.player, item))
      }
    }),

    new Cmd('Topics', {
      attName: 'topics',
      objects: [
        { scope: parser.isNpcAndHere }
      ],
      default: function (item) {
        return failedmsg(lang.no_topics(game.player, item))
      }
    }),

    // ----------------------------------
    // Complex commands

    new Cmd('Say', {
      script: function (arr) {
        const l = [];
        for (const key in w) {
          if (w[key].sayCanHear && w[key].sayCanHear(game.player, arr[0])) l.push(w[key]);
        }
        l.sort(function (a, b) { return (b.sayPriority + b.sayBonus) - (a.sayPriority + b.sayBonus) });
        if (l.length === 0) {
          msg(lang.say_no_one_here(game.player, arr[0], arr[1]));
          return SUCCESS
        }

        if (settings.givePlayerSayMsg) msg(lang.nounVerb(game.player, arr[0], true) + ", '" + sentenceCase(arr[1]) + ".'");
        for (const chr of l) {
          if (chr.sayQuestion && w[chr.sayQuestion].sayResponse(chr, arr[1])) return SUCCESS
          if (chr.sayResponse && chr.sayResponse(arr[1], arr[0])) return SUCCESS
        }
        if (settings.givePlayerSayMsg) {
          msg(lang.say_no_response(game.player, arr[0], arr[1]));
        } else {
          msg(lang.say_no_response_full(game.player, arr[0], arr[1]));
        }
        return SUCCESS
      },
      objects: [
        { text: true },
        { text: true }
      ]
    }),

    new Cmd('Stand', {
      rules: [cmdRules.canPosture],
      script: handleStandUp
    }),
    new Cmd('NpcStand1', {
      rules: [cmdRules.canPosture],
      cmdCategory: 'Posture',
      objects: [
        { scope: parser.isHere, attName: 'npc' }
      ],
      script: handleStandUp
    }),
    new Cmd('NpcStand2', {
      rules: [cmdRules.canPosture],
      cmdCategory: 'Posture',
      objects: [
        { scope: parser.isHere, attName: 'npc' }
      ],
      script: handleStandUp
    }),

    new Cmd('FillWith', {
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      objects: [
        { scope: parser.isHeld },
        { scope: parser.isLiquid }
      ],
      script: function (objects) {
        return handleFillWithLiquid(game.player, objects[0][0], objects[1][0])
      }
    }),
    new Cmd('NpcFillWith1', {
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      cmdCategory: 'FillWith',
      objects: [
        { scope: parser.isHere, attName: 'npc' },
        { scope: parser.isHeld },
        { scope: parser.isLiquid }
      ],
      script: function (objects) {
        const npc = objects[0][0];
        if (!npc.npc) {
          failedmsg(lang.not_npc(npc));
          return FAILED
        }
        objects.shift();
        return handleFillWithLiquid(npc, objects[0][0], objects[1][0])
      }
    }),
    new Cmd('NpcFillWith2', {
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      cmdCategory: 'FillWith',
      objects: [
        { scope: parser.isHere, attName: 'npc' },
        { scope: parser.isHeld },
        { scope: parser.isLiquid }
      ],
      script: function (objects) {
        const npc = objects[0][0];
        if (!npc.npc) {
          failedmsg(lang.not_npc(npc));
          return FAILED
        }
        objects.shift();
        return handleFillWithLiquid(npc, objects[0][0], objects[1][0])
      }
    }),

    new Cmd('PutIn', {
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      objects: [
        { scope: parser.isHeld, multiple: true },
        { scope: parser.isPresent, attName: 'container' }
      ],
      script: function (objects) {
        return handlePutInContainer(game.player, objects)
      }
    }),

    new Cmd('NpcPutIn1', {
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      cmdCategory: 'PutIn',
      objects: [
        { scope: parser.isHere, attName: 'npc' },
        { scope: parser.isHeld, multiple: true },
        { scope: parser.isPresent, attName: 'container' }
      ],
      script: function (objects) {
        const npc = objects[0][0];
        if (!npc.npc) {
          failedmsg(lang.not_npc(npc));
          return FAILED
        }
        objects.shift();
        return handlePutInContainer(npc, objects)
      }
    }),
    new Cmd('NpcPutIn2', {
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      cmdCategory: 'PutIn',
      objects: [
        { scope: parser.isHere, attName: 'npc' },
        { scope: parser.isHeld, multiple: true },
        { scope: parser.isPresent, attName: 'container' }
      ],
      script: function (objects) {
        const npc = objects[0][0];
        if (!npc.npc) {
          failedmsg(lang.not_npc(npc));
          return FAILED
        }
        objects.shift();
        return handlePutInContainer(npc, objects)
      }
    }),

    new Cmd('TakeOut', {
      rules: [cmdRules.canManipulate, cmdRules.isHere],
      objects: [
        { scope: parser.isContained, multiple: true },
        { scope: parser.isPresent, attName: 'container' }
      ],
      script: function (objects) {
        return handleTakeFromContainer(game.player, objects)
      }
    }),

    new Cmd('NpcTakeOut1', {
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      cmdCategory: 'TakeOut',
      objects: [
        { scope: parser.isHere, attName: 'npc' },
        { scope: parser.isContained, multiple: true },
        { scope: parser.isPresent, attName: 'container' }
      ],
      script: function (objects) {
        const npc = objects[0][0];
        if (!npc.npc) {
          failedmsg(lang.not_npc(npc));
          return FAILED
        }
        objects.shift();
        return handleTakeFromContainer(npc, objects)
      }
    }),
    new Cmd('NpcTakeOut2', {
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      cmdCategory: 'TakeOut',
      objects: [
        { scope: parser.isHere, attName: 'npc' },
        { scope: parser.isContained, multiple: true },
        { scope: parser.isPresent, attName: 'container' }
      ],
      script: function (objects) {
        const npc = objects[0][0];
        if (!npc.npc) {
          failedmsg(lang.not_npc(npc));
          return FAILED
        }
        objects.shift();
        return handleTakeFromContainer(npc, objects)
      }
    }),

    new Cmd('GiveTo', {
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      objects: [
        { scope: parser.isHeld, multiple: true },
        { scope: parser.isPresent, attName: 'npc' }
      ],
      script: function (objects) {
        return handleGiveToNpc(game.player, objects)
      }
    }),
    new Cmd('NpcGiveTo1', {
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      cmdCategory: 'Give',
      objects: [
        { scope: parser.isHere, attName: 'npc' },
        { scope: parser.isHeld, multiple: true },
        { scope: parser.isPresentOrMe, attName: 'npc' }
      ],
      script: function (objects) {
        const npc = objects[0][0];
        if (!npc.npc) {
          failedmsg(lang.not_npc(npc));
          return FAILED
        }
        objects.shift();
        return handleGiveToNpc(npc, objects)
      }
    }),
    new Cmd('NpcGiveTo2', {
      rules: [cmdRules.canManipulate, cmdRules.isHeld],
      cmdCategory: 'Give',
      objects: [
        { scope: parser.isHere, attName: 'npc' },
        { scope: parser.isHeld, multiple: true },
        { scope: parser.isPresent, attName: 'npc' }
      ],
      script: function (objects) {
        const npc = objects[0][0];
        if (!npc.npc) {
          failedmsg(lang.not_npc(npc));
          return FAILED
        }
        objects.shift();
        return handleGiveToNpc(npc, objects)
      }
    }),

    new Cmd('PushExit', {
      rules: [cmdRules.canManipulate, cmdRules.isHereNotHeld],
      cmdCategory: 'Push',
      script: function (objects) {
        return handlePushExit(game.player, objects)
      },
      objects: [
        { text: true },
        { scope: parser.isHere, attName: 'shiftable' },
        { text: true }
      ]
    }),
    new Cmd('NpcPushExit1', {
      rules: [cmdRules.canManipulate, cmdRules.isHereNotHeld],
      cmdCategory: 'Push',
      script: function (objects) {
        const npc = objects[0][0];
        if (!npc.npc) {
          failedmsg(lang.not_npc(npc));
          return FAILED
        }
        objects.shift();
        return handlePushExit(npc, objects)
      },
      objects: [
        { scope: parser.isHere, attName: 'npc' },
        { text: true },
        { scope: parser.isHere, attName: 'shiftable' },
        { text: true }
      ]
    }),
    new Cmd('NpcPushExit2', {
      rules: [cmdRules.canManipulate, cmdRules.isHereNotHeld],
      cmdCategory: 'Push',
      script: function (objects) {
        const npc = objects[0][0];
        if (!npc.npc) {
          failedmsg(lang.not_npc(npc));
          return FAILED
        }
        objects.shift();
        return handlePushExit(npc, objects)
      },
      objects: [
        { scope: parser.isHere, attName: 'npc' },
        { text: true },
        { scope: parser.isHere, attName: 'shiftable' },
        { text: true }
      ]
    }),

    new Cmd('AskAbout', {
      rules: [cmdRules.canTalkTo],
      script: function (arr) {
        if (!game.player.canTalk()) return false
        if (!arr[0][0].askabout) return failedmsg(lang.cannot_ask_about(game.player, arr[0][0], arr[1]))

        return arr[0][0].askabout(arr[2], arr[1]) ? SUCCESS : FAILED
      },
      objects: [
        { scope: parser.isNpcAndHere },
        { text: true },
        { text: true }
      ]
    }),
    new Cmd('TellAbout', {
      rules: [cmdRules.canTalkTo],
      script: function (arr) {
        if (!game.player.canTalk()) return false
        if (!arr[0][0].tellabout) return failedmsg(lang.cannot_tell_about(game.player, arr[0][0], arr[1]))

        return arr[0][0].tellabout(arr[2], arr[1]) ? SUCCESS : FAILED
      },
      objects: [
        { scope: parser.isNpcAndHere },
        { text: true },
        { text: true }
      ]
    })

  ];

  // DEBUG commands

  if (settings.debug) {
    commands.push(new Cmd('DebugWalkThrough', {
      objects: [
        { text: true }
      ],
      script: function (objects) {
        const wt = walkthroughs[objects[0]];
        if (wt === undefined) {
          debugmsg('No walkthought found called ' + objects[0]);
          return
        }
        for (const el of wt) {
          debugmsg(el);
          parser.parse(el);
        }
      }
    }));

    commands.push(new Cmd('DebugInspect', {
      script: function (arr) {
        const item = arr[0][0];
        debugmsg('See the console for details on the object ' + item.name + ' (press F12 to display the console)');
        console.log(item);
        return SUCCESS_NO_TURNSCRIPTS
      },
      objects: [
        { scope: parser.isInWorld }
      ]
    }));

    commands.push(new Cmd('DebugInspectByName', {
      script: function (arr) {
        const item_name = arr[0];
        if (!w[item_name]) {
          debugmsg('No object called ' + item_name);
          return FAILED
        }

        debugmsg('See the console for details on the object ' + item_name + ' (press F12 to display the console)');
        console.log(w[item_name]);
        return SUCCESS_NO_TURNSCRIPTS
      },
      objects: [
        { text: true }
      ]
    }));

    commands.push(new Cmd('DebugTest', {
      script: function () {
        test.runTests();
        return SUCCESS_NO_TURNSCRIPTS
      }
    }));

    commands.push(new Cmd('DebugInspectCommand', {
      script: function (arr) {
        debugmsg('Looking for ' + arr[0]);
        for (const cmd of commands) {
          if (cmd.name.toLowerCase() === arr[0] || (cmd.cmdCategory && cmd.cmdCategory.toLowerCase() === arr[0])) {
            debugmsg('Name: ' + cmd.name);
            for (const key in cmd) {
              if (cmd.hasOwnProperty(key)) {
                debugmsg('--' + key + ': ' + cmd[key]);
              }
            }
          }
        }
        return SUCCESS_NO_TURNSCRIPTS
      },
      objects: [
        { text: true }
      ]
    }));

    commands.push(new Cmd('DebugListCommands', {
      script: function (arr) {
        let count = 0;
        for (const cmd of commands) {
          if (!cmd.name.match(/\d$/)) {
            let s = cmd.name + ' (' + cmd.regex;

            let altCmd;
            let n = 2;
            do {
              altCmd = commands.find(el => el.name === cmd.name + n);
              if (altCmd) s += ' or ' + altCmd.regex;
              n++;
            } while (altCmd)
            s += ')';

            const npcCmd = commands.find(el => el.name === 'Npc' + cmd.name + '2');
            if (npcCmd) s += ' - NPC too';
            debugmsg(s);
            count++;
          }
        }
        debugmsg('... Found ' + count + ' commands.');
        return SUCCESS_NO_TURNSCRIPTS
      },
      objects: [
      ]
    }));

    commands.push(new Cmd('DebugListCommands2', {
      script: function (arr) {
        let count = 0;
        for (const cmd of commands) {
          const s = cmd.name + ' (' + cmd.regex + ')';
          debugmsg(s);
          count++;
        }
        debugmsg('... Found ' + count + ' commands.');
        return SUCCESS_NO_TURNSCRIPTS
      },
      objects: [
      ]
    }));

    commands.push(new Cmd('DebugParserToggle', {
      script: function (arr) {
        if (parser.debug) {
          parser.debug = false;
          debugmsg('Parser debugging messages are off.');
        } else {
          parser.debug = true;
          debugmsg('Parser debugging messages are on.');
        }
        return SUCCESS_NO_TURNSCRIPTS
      },
      objects: [
      ]
    }));
  }

  // Functions used by commands
  // (but not in the commands array)

  // Cannot handle multiple vessels
  function handleFillWithLiquid (char, vessel, liquid) {
    if (!vessel.vessel) return failedmsg(lang.not_vessel(char, vessel))
    if (vessel.closed) return failedmsg(lang.container_closed(char, vessel))
    if (!char.canManipulate(vessel, 'fill')) return FAILED
    if (!char.getAgreement('Fill', vessel)) return FAILED
    if (!vessel.isAtLoc(char.name)) return failedmsg(lang.not_carrying(char, vessel))

    return vessel.fill(false, char, liquid) ? SUCCESS : FAILED
  }

  function handlePutInContainer (char, objects) {
    let success = false;
    const container = objects[1][0];
    const multiple = objects[0].length > 1 || parser.currentCommand.all;
    if (!container.container) {
      failedmsg(lang.not_container(char, container));
      return FAILED
    }
    if (container.closed) {
      failedmsg(lang.container_closed(char, container));
      return FAILED
    }
    if (!char.canManipulate(objects[0], 'put')) {
      return FAILED
    }
    for (const obj of objects[0]) {
      let flag = true;
      if (!char.getAgreement('Put/in', obj)) {
        // The getAgreement should give the response
        continue
      }
      if (!container.testForRecursion(char, obj)) {
        flag = false;
      }
      if (container.testRestrictions) {
        flag = container.testRestrictions(obj, char);
      }
      if (flag) {
        if (!obj.isAtLoc(char.name)) {
          failedmsg(prefix(obj, multiple) + lang.not_carrying(char, obj));
        } else {
          obj.moveToFrom(container.name, char.name);
          msg(prefix(obj, multiple) + lang.done_msg);
          success = true;
        }
      }
    }
    if (success && container.putInResponse) container.putInResponse();
    if (success === SUCCESS) char.pause();
    return success ? SUCCESS : FAILED
  }

  function handleTakeFromContainer (char, objects) {
    let success = false;
    const container = objects[1][0];
    const multiple = objects[0].length > 1 || parser.currentCommand.all;
    if (!container.container) {
      failedmsg(lang.not_container(char, container));
      return FAILED
    }
    if (container.closed) {
      failedmsg(lang.container_closed(char, container));
      return FAILED
    }
    if (!char.canManipulate(objects[0], 'get')) {
      return FAILED
    }
    for (const obj of objects[0]) {
      if (!char.getAgreement('Take', obj)) {
        // The getAgreement should give the response
        continue
      }
      {
        if (!obj.isAtLoc(container.name)) {
          failedmsg(prefix(obj, multiple) + lang.not_inside(container, obj));
        } else {
          obj.moveToFrom(char.name, container.name);
          msg(prefix(obj, multiple) + lang.done_msg);
          success = true;
        }
      }
    }
    // This works for put in as this is the only way to do it, but not here
    // as TAKE can remove itsms from a container too.
    // if (success && container.putInResponse) container.putInResponse();
    if (success === SUCCESS) char.pause();
    return success ? SUCCESS : FAILED
  }

  function handleGiveToNpc (char, objects) {
    let success = false;
    const npc = objects[1][0];
    const multiple = objects[0].length > 1 || parser.currentCommand.all;
    if (!npc.npc && npc !== game.player) {
      failedmsg(lang.not_npc_for_give(char, npc));
      return FAILED
    }
    for (const obj of objects[0]) {
      let flag = true;
      if (!char.getAgreement('Give', obj)) ;
      if (npc.testRestrictions) {
        flag = npc.testRestrictions(obj);
      }
      if (!npc.canManipulate(obj, 'give')) {
        return FAILED
      }
      if (flag) {
        if (!obj.isAtLoc(char.name)) {
          failedmsg(prefix(obj, multiple) + lang.not_carrying(char, obj));
        } else {
          if (npc.giveReaction) {
            npc.giveReaction(obj, multiple, char);
          } else {
            msg(prefix(obj, multiple) + lang.done_msg);
            obj.moveToFrom(npc.name, char.name);
          }
          success = true;
        }
      }
    }
    if (success === SUCCESS) char.pause();
    return success ? SUCCESS : FAILED
  }

  function handleStandUp (objects) {
    const npc = objects.length === 0 ? game.player : objects[0][0];
    if (!npc.npc) {
      failedmsg(lang.not_npc(npc));
      return FAILED
    }
    if (!npc.posture) {
      failedmsg(lang.already(npc));
      return FAILED
    }
    if (npc.getAgreementPosture && !npc.getAgreementPosture('stand')) {
      // The getAgreement should give the response
      return FAILED
    } else if (!npc.getAgreementPosture && npc.getAgreement && !npc.getAgreement('Posture', 'stand')) {
      return FAILED
    }
    if (!npc.canPosture()) {
      return FAILED
    }
    if (npc.posture) {
      msg(lang.stop_posture(npc));
      npc.pause();
      return SUCCESS
    }
  }

  // we know the char can manipulate, we know the obj is here and not held
  function handlePushExit (char, objects) {
    const verb = getDir(objects[0]);
    const obj = objects[1][0];
    const dir = getDir(objects[2]);
    const room = w[char.loc];

    if (!obj.shiftable && obj.takeable) {
      msg(lang.TAKE_not_push(char, obj));
      return FAILED
    }
    if (!obj.shiftable) {
      msg(lang.cannot_push(char, obj));
      return FAILED
    }
    if (!room[dir] || room[dir].isHidden()) {
      msg(lang.not_that_way(char, dir));
      return FAILED
    }
    if (room[dir].isLocked()) {
      msg(lang.locked_exit(char, room[dir]));
      return FAILED
    }
    if (typeof room[dir].noShiftingMsg === 'function') {
      msg(room[dir].noShiftingMsg(char, item));
      return FAILED
    }
    if (typeof room[dir].noShiftingMsg === 'string') {
      msg(room[dir].noShiftingMsg);
      return FAILED
    }

    if (typeof obj.shift === 'function') {
      const res = obj.shift(char, dir, verb);
      return res ? SUCCESS : FAILED
    }

    // by default, objects cannot be pushed up
    if (dir === 'up') {
      msg(lang.cannot_push_up(char, obj));
      return FAILED
    }

    // not using moveToFrom; if there are
    const dest = room[dir].name;
    obj.moveToFrom(dest);
    char.loc = dest;
    msg(lang.push_exit_successful(char, obj, dir, w[dest]));
    return SUCCESS
  }

  // This is not language neutral, but should not be shipping with the game, so tough

  // Note that the test object was defined in util.js

  test.runTests = function () {
    const time = parseInt(Date.now());
    test.tests();
    test.results(time);
  };

  test.testOutput = [];
  test.totalCount = 0;
  test.failCount = 0;
  test.subCount = 0;
  test.currentTitle = 'Not specified';

  test.title = function (title) {
    test.subCount = 0;
    test.currentTitle = title;
  };

  test.printTitle = function () {
    debugmsg(test.currentTitle + ': Error (test ' + test.subCount + ')');
    test.failCount++;
  };

  test.assertCmd = function (cmdStr, expected, extraOutput) {
    test.totalCount++;
    test.subCount++;
    if (expected.constructor !== Array) {
      expected = [expected];
    }
    test.testing = true;
    test.testOutput = [];
    parser.parse(cmdStr);
    // world.endTurn();
    test.testing = false;

    if (test.testOutput.length === expected.length && test.testOutput.every(function (value, index) {
      if (typeof expected[index] === 'string') {
        return value === expected[index]
      } else {
        return expected[index].test(value)
      }
    })) ; else {
      test.printTitle();
      for (let i = 0; i < Math.max(test.testOutput.length, expected.length); i++) {
        if (typeof expected[i] === 'string') {
          if (expected[i] !== test.testOutput[i]) {
            debugmsg('Expected (A): ' + expected[i]);
            debugmsg('...Found (A): ' + test.testOutput[i]);
            if (extraOutput) {
              if (typeof expected[i] === 'string' && typeof test.testOutput[i] === 'string') {
                for (let j = 0; j < expected[i].length; j++) {
                  if (expected[i][j] !== test.testOutput[i][j]) {
                    console.log('Mismatch at position: ' + j);
                    console.log('Expected: ' + expected[i].charCodeAt(j));
                    console.log('Found: ' + test.testOutput[i].charCodeAt(j));
                  }
                }
              } else {
                console.log('Found: type mismatch');
                console.log(typeof expected[i]);
                console.log(typeof test.testOutput[i]);
              }
            }
          }
        } else if (expected[i] instanceof RegExp) {
          if (test.testOutput[i] === undefined || !expected[i].test(test.testOutput[i])) {
            debugmsg('Expected: ' + expected[i]);
            debugmsg('...Found: ' + test.testOutput[i]);
          }
        } else if (expected[i] === undefined) {
          debugmsg('Expected nothing');
          debugmsg('...Found: ' + test.testOutput[i]);
        } else {
          debugmsg('Found an unrecognised type for expected (should be string or regex): ' + (typeof expected[i]));
        }
      }
    }
  };

  test.assertEqual = function (expected, found, extraOutput) {
    test.totalCount++;
    test.subCount++;

    if (Array.isArray(expected)) {
      if (!arrayCompare(expected, found)) {
        test.printTitle();
        debugmsg('Expected (A): ' + expected);
        debugmsg('...Found (A): ' + found);
      }
    } else if (expected === found) ; else {
      test.printTitle();
      debugmsg('Expected: ' + expected);
      debugmsg('...Found: ' + found);
      if (extraOutput) {
        if (typeof expected === 'string' && typeof found === 'string') {
          for (let i = 0; i < expected.length; i++) {
            if (expected[i] !== found[i]) {
              console.log('Mismatch at position: ' + i);
              console.log('Expected: ' + expected.charCodeAt(i));
              console.log('Found: ' + found.charCodeAt(i));
            }
          }
        }
      }
    }
  };

  // Use only for numbers; expected must not be zero, as long as the found is within 0.1% of the expected, this is pass
  test.assertAlmostEqual = function (expected, found) {
    test.totalCount++;
    test.subCount++;

    if (Math.abs((found - expected) / expected) < 0.001) ; else {
      test.printTitle();
      debugmsg('Expected: ' + expected);
      debugmsg('...Found: ' + found);
    }
  };

  test.assertMatch = function (expected, found) {
    test.totalCount++;
    test.subCount++;
    if (expected.test(found)) ; else {
      test.printTitle();
      debugmsg('Expected: ' + expected);
      debugmsg('...Found: ' + found);
    }
  };

  test.fail = function (msg) {
    test.printTitle();
    debugmsg('Failure: ' + msg);
  };

  test.results = function (time) {
    const elapsed = parseInt(Date.now()) - time;
    debugmsg('Number of tests: ' + test.totalCount);
    debugmsg('Number of fails: ' + test.failCount);
    debugmsg('Elapsed time: ' + elapsed + ' ms (' + (Math.round(elapsed / test.totalCount * 10) / 10) + ' ms/test)');
  };

  test.padArray = function (arr, n) {
    for (let i = 0; i < n; i++) arr.push(/./);
    return arr
  };

  // You can use this in a test to move the player silently
  test.movePlayer = function (roomName) {
    game.player.loc = roomName;
    game.update();
    world.setBackground();
  };

  settings.title = 'A First Step...';
  settings.author = 'The Pixie';
  settings.version = '1.2';
  settings.thanks = ['Kyle', 'Lara'];

  settings.noTalkTo = false;
  settings.noAskTell = false;

  settings.tests = true;

  settings.textEffectDelay = 100;

  settings.status = [
    'hitpoints',
    function () { return '<td>Spell points:</td><td>3</td>' },
    function () { return '<td>Health points:</td><td>' + game.player.hitpoints + '</td>' },
    function () { return '<td colspan="2">' + game.player.status + '</td>' }
  ];

  settings.intro = 'This is a quick example of what can be done in Quest 6.|Your objective is to turn on the light in the basement, but there are, of course, numerous hoops to jump through.|If you are successful, see if you can do it again, but getting Kyle to do everything. You should find that you can tell an NPC to do pretty much anything (except look at things for you and talk to people for you).';

  // This function will be called at the start of the game, so can be used
  // to introduce your game.
  settings.setup = function () {
    msg('Some text');
    /*
    io.addToOutputQueue({text:"The real message is revealed!!", action:'effect', tag:'pre', effect:io.unscrambleEffect, randomPlacing:true, incSpaces:true, pick:function(i) {return 'At first this message is shown'.charAt(i) }})
    wait()
    io.addToOutputQueue({text:"If there are multiple lines of text...", action:'effect', tag:'p', effect:io.typewriterEffect})
    wait()
    msg("Even more text")
    wait(3) */

    game.player.hitpoints = 20;
    game.player.status = 'You are feeling fine';
    io.updateStatus();
  };

  function firstTimeTesting () {
    firsttime(232646, function () {
      msg(spaces(5) + '{font:trade winds:Te first time 10{sup:2} CH{sub:4} Er {smallcaps:This is small caps}.}');
    }, function () {
      msg('Every {huge:other} {big:time} betweeb {small:is} {tiny:very small} notmasl.');
    });
    const a = ['one', 'two', 'three'];
    console.log(a);
    arrayRemove(a, 'two');
    console.log(a);
    arrayRemove(a, 'three');
    console.log(a);
    arrayRemove(a, 'three');
    console.log(a);
    arrayRemove(a, 'one');
    console.log(a);
  }

  commands.unshift(new Cmd('Test input', {
    npcCmd: true,
    rules: [cmdRules.isHere],
    regex: /^inp/,
    script: function () {
      msg('First some preamble...');
      showMenu('What colour?', [w.book, w.coin, w.Kyle, 'None of them'], function (result) {
        if (typeof result === 'string') {
          msg('You picked ' + result + '.');
        } else {
          msg('You picked ' + result.byname({ article: DEFINITE }) + '.');
        }
      });
      /*    askQuestion("What colour?", function(result) {
        msg("You picked " + result + ".");
        showYesNoMenu("Are you sure?", function(result) {
          msg("You said " + result + ".")
        })
      }) */
    }
  }));

  commands.unshift(new Cmd('Alpha', {
    regex: /^alpha$/,
    script: function () {
      msg('Some text in Greek: {encode:391:3AC:The quick brown fox jumped over the lazy dog}.');
      msg('Some text in Cyrillic: {encode:402:431:The quick brown fox jumped over the lazy dog}.');
      msg('Some text in Armenian {encode:531:561:The quick brown fox jumped over the lazy dog}.');

      msg('Some text in Devanagari: {encode:904:904:The quick brown fox jumped over the lazy dog}.');
      msg('Some text in Thai {encode:E01:E01:The quick brown fox jumped over the lazy dog}.');
      msg('Some text in Tibetan {encode:F20:F20:The quick brown fox jumped over the lazy dog}.');
      msg('Some text in Khmer {encode:1780:1780:The quick brown fox jumped over the lazy dog}.');
      msg('Some text in Javan {encode:A985:A985:The quick brown fox jumped over the lazy dog}.');
      msg('Some text in Nko {encode:7C1:7C1:The quick brown fox jumped over the lazy dog}.');
    }
  }));

  commands.unshift(new Cmd('EgKick', {
    npcCmd: true,
    rules: [cmdRules.isHere],
    regex: /^(kick) (.+)$/,
    objects: [
      { ignore: true },
      { scope: parser.isPresent }
    ],
    default: function (item, isMultiple, char) {
      return failedmsg(prefix(this, isMultiple) + lang.pronounVerb(char, 'kick', true) + ' ' + this.pronouns.objective + ', but nothing happens.')
    }
  }));

  commands.unshift(new Cmd('EgCharge', {
    npcCmd: true,
    rules: [cmdRules.isHeld],
    regex: /^(charge) (.+)$/,
    objects: [
      { ignore: true },
      { scope: parser.isHeld }
    ],
    default: function (item, isMultiple, char) {
      return failedmsg(prefix(item, isMultiple) + lang.pronounVerb(item, "'be", true) + ' not something you can charge.')
    }
  }));

  commands.unshift(new Cmd('EgMove', {
    npcCmd: true,
    rules: [cmdRules.isHere],
    regex: /^(move) (.+)$/,
    objects: [
      { ignore: true },
      { scope: parser.isHere }
    ],
    default: function (item, isMultiple, char) {
      return failedmsg(prefix(item, isMultiple) + lang.pronounVerb(item, "'be", true) + ' not something you can move.')
    }
  }));

  commands.unshift(new Cmd('EgHint', {
    regex: /^hint$|^hints$/,
    script: function () {
      if (w[game.player.loc].hint) {
        metamsg(w[game.player.loc].hint);
      } else {
        metamsg('Sorry, no hints here.');
      }
    }
  }));

  tp.addDirective('charger_state', function () {
    if (w.charger_compartment.closed) {
      return 'The compartment is closed'
    }
    const contents = w.charger_compartment.getContents(display.LOOK);
    if (contents.length === 0) {
      return 'The compartment is empty'
    }
    return 'The compartment contains ' + formatList(contents, { article: INDEFINITE })
  });

  createItem('me', PLAYER(), {
    loc: 'lounge',
    regex: /^(me|myself|player)$/,
    money: 10,
    examine: function (isMultiple) {
      msg(prefix(this, isMultiple) + 'A ' + (this.isFemale ? 'chick' : 'guy') + ' called ' + this.alias);
    }
  });

  createItem('knife',
    TAKEABLE(),
    {
      loc: 'me',
      sharp: false,
      examine: function (isMultiple) {
        if (this.sharp) {
          msg(prefix(this, isMultiple) + 'A really sharp knife.');
        } else {
          msg(prefix(this, isMultiple) + 'A blunt knife.');
        }
      },
      chargeResponse: function (participant) {
        msg('There is a loud bang, and the knife is destroyed.');
        delete this.loc;
        return false
      }
    }
  );

  createRoom('lounge', {
    desc: 'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
    east: new Exit('kitchen'),
    west: new Exit('dining_room'),
    south: new Exit('conservatory'),
    up: new Exit('bedroom'),
    hint: 'There is a lot in this room! The bricks can be picked up by number (try GET 3 BRICKS). The book can be read. The coin is stuck to the floor. There are containers too. Kyle is an NPC; you can tell him to do nearly anything the player character can do (everything except looking and talking).'
  });

  createRoom('dining_room_on_stool', {
    desc: 'Stood on a stool, in an old-fashioned room.',
    east: new Exit('lounge'),
    down: new Exit('dining_room'),
    alias: 'dining room (on a stool)'
    // loc:"dining_room",
  });

  createRoom('hole', {
    desc: 'An old-fashioned room.'
  });

  createItem('book',
    TAKEABLE(),
    {
      loc: 'lounge',
      examine: 'A leather-bound book.',
      heldVerbsX: ['Read'],
      read: function (isMultiple, char) {
        if (cmdRules.isHeld(null, char, this, isMultiple)) {
          if (char === w.Lara) {
            msg("'Okay.' Lara spends a few minutes reading the book.");
            msg("'I meant, read it to me.'");
            msg("'All of it?'");
            msg("'Quick summary.'");
            msg("'It is all about carrots. The basic gist is that all carrots should be given to me.' You are not entirely sure you believe her.");
          } else {
            msg(prefix(this, isMultiple) + 'It is not in a language ' + lang.pronounVerb(char, 'understand') + '.');
          }
          return true
        } else {
          return false
        }
      },
      lookinside: 'The book has pages and pages of text, but you do not even recongise the text.'
    }
  );

  createItem('book_cover',
    COMPONENT('book'),
    { examine: 'The book cover is very fancy.' }
  );

  createItem('boots',
    WEARABLE(),
    { loc: 'lounge', pronouns: lang.pronouns.plural, examine: 'Some old boots.' }
  );

  createItem('waterskin',
    TAKEABLE(),
    {
      examine: function (isMultiple) { msg(prefix(item, isMultiple) + 'The waterskin is ' + Math.floor(this.full / this.capacity * 100) + '% full.'); },
      capacity: 10,
      full: 3,
      loc: 'lounge',
      fill: function (isMultiple) {
        if (game.player.loc !== 'garage') {
          msg(prefix(this, isMultiple) + 'There is nothing to charge the torch with here.');
          return false
        } else {
          msg(prefix(this, isMultiple) + 'You charge the torch - it should last for hours now.');
          this.power = 20;
          return true
        }
      }
    }
  );

  createItem('glass_cabinet',
    CONTAINER(true),
    locked_WITH('cabinet_key'),
    {
      alias: 'glass cabinet',
      examine: 'A cabinet with a glass front.',
      transparent: true,
      isAtLoc: function (loc) {
        if (typeof loc !== 'string') loc = loc.name;
        return (loc === 'lounge' || loc === 'dining_room')
      }
    }
  );

  createItem('jewellery_box',
    TAKEABLE(),
    CONTAINER(true),
    { loc: 'glass_cabinet', alias: 'jewellery box', examine: 'A nice box.', closed: false }
  );

  createItem('ring',
    TAKEABLE(),
    { loc: 'jewellery_box', examine: 'A ring.' }
  );

  createItem('cardboard_box',
    TAKEABLE(),
    CONTAINER(true),
    { loc: 'lounge', alias: 'cardboard box', examine: 'A big cardboard box.', closed: false }
  );

  createItem('sandwich',
    EDIBLE(false),
    { loc: 'lounge', examine: 'A tasty looking thing.', onIngesting: function () { msg('That was Great!'); } }
  );

  createItem('ornate_doll',
    TAKEABLE(),
    { loc: 'glass_cabinet', alias: 'ornate doll', examine: 'A fancy doll, eighteenth century.' }
  );

  createItem('coin',
    TAKEABLE(),
    {
      loc: 'lounge',
      examine: 'A gold coin.',
      take: function (isMultiple, participant) {
        msg(prefix(this, isMultiple) + lang.pronounVerb(participant, 'try', true) + ' to pick up the coin, but it just will not budge.');
        return false
      }
    }
  );

  createItem('small_key',
    TAKEABLE(),
    { loc: 'lounge', examine: 'A small key.', alias: 'small key' }
  );

  createItem('flashlight', TAKEABLE(), SWITCHABLE(false), {
    loc: 'lounge',
    examine: 'A small red torch.',
    regex: /^torch$/,
    byname: function (options) {
      let res = this.alias;
      if (options.article) { res = (options.article === DEFINITE ? 'the' : 'a') + ' ' + this.alias; }
      if (this.switchedon && options.modified) { res += ' (providing light)'; }
      return res
    },
    lightSource: function () {
      return this.switchedon ? LIGHT_FULL : LIGHT_none
    },
    eventPeriod: 1,
    eventIsActive: function () {
      return this.switchedon
    },
    eventScript: function () {
      this.power--;
      if (this.power === 2) {
        msg('The torch flickers.');
      }
      if (this.power < 0) {
        msg('The torch flickers and dies.{once: Perhaps there is a charger in the garage?}');
        this.doSwitchoff();
      }
    },
    checkCanSwitchOn () {
      if (this.power < 0) {
        msg('The torch is dead.');
        return false
      }
      return true
    },
    power: 2,
    chargeResponse: function (participant) {
      msg(lang.pronounVerb(participant, 'push', true) + ' the button. There is a brief hum of power, and a flash.');
      w.flashlight.power = 20;
      return true
    }
  });

  createRoom('dining_room', {
    desc: 'An old-fashioned room.',
    east: new Exit('lounge'),
    west: new Exit('lift'),
    canViewLocs: ['garden'],
    canViewPrefix: 'Through the window you can see ',
    up: new Exit('dining_room_on_stool'),
    alias: 'dining room',
    hint: 'This room features an NPC who will sometimes do as you ask. Compliment her, and she will go to another room, and with then pick things up and drop them (but not bricks). Also not that the glass cabinet is in this room as well as the lounge.'
  });

  createItem('chair',
    FURNITURE({ sit: true }),
    {
      loc: 'dining_room',
      examine: 'A wooden chair.',
      onsitting: function (char) {
        msg('The chair makes a strange noise when ' + lang.nounVerb(char, 'sit') + ' on it.');
      }
    }
  );

  createRoom('lift',
    TRANSIT('east'),
    {
      desc: 'A curious lift.',
      east: new Exit('dining_room'),
      transitMenuPrompt: 'Where do you want to go?'
      // afterEnter:transitOfferMenu,
      // transitAutoMove:true,
      // transitOnMove:function(toLoc, fromLoc) { debugmsg("MOVING to " + toLoc + " from " + fromLoc); },
      // transitCheck:function() {
      //  msg("The lift is out of order");
      //  return false;
      // },
    }
  );

  // calling it button_0 make it appear before button_1 in lists
  createItem('button_0',
    TRANSIT_BUTTON('lift'),
    {
      alias: 'Button: G',
      examine: 'A button with the letter G on it.',
      transitDest: 'dining_room',
      transitDestAlias: 'Ground Floor',
      transitAlreadyHere: "You're already there mate!",
      transitGoToDest: 'The old man presses the button....'

    }
  );

  createItem('button_1',
    TRANSIT_BUTTON('lift'),
    {
      alias: 'Button: 1',
      examine: 'A button with the letter 1 on it.',
      transitDest: 'bedroom',
      transitDestAlias: 'The Bedroom',
      transitAlreadyHere: 'You press the button; nothing happens.',
      transitGoToDest: 'You press the button; the door closes and the lift heads to the first floor. The door opens again.'

    }
  );

  createItem('button_2',
    TRANSIT_BUTTON('lift'),
    {
      alias: 'Button: 2',
      examine: 'A button with the letter 2 on it.',
      transitDest: 'attic',
      transitDestAlias: 'The Attic',
      locked: true,
      transitAlreadyHere: 'You press the button; nothing happens.',
      transitGoToDest: 'You press the button; the door closes and the lift heads to the second floor. The door opens again.',
      transitLocked: 'That does nothing, the button does not work.'
    }
  );

  createRoom('attic', {
    desc: 'An spooky attic.',
    west: new Exit('lift')
  });

  createRoom('kitchen', {
    desc: 'A clean room{if:clock:scenery:, a clock hanging on the wall}. There is a sink in the corner.',
    west: new Exit('lounge'),
    down: new Exit('basement', {
      isHidden: function () { return w.trapdoor.closed },
      msg: function (isMultiple, char) {
        if (char === game.player) {
          msg('You go through the trapdoor, and down the ladder.');
        } else {
          msg('You watch ' + char.byname({ article: DEFINITE }) + ' disappear through the trapdoor.');
        }
      }
    }),
    north: new Exit('garage', { use: useWithDoor, door: 'garage_door', doorName: 'garage door' }),
    afterFirstEnter: function () {
      msg('A fresh smell here!');
    },
    hint: 'This room features two doors that open and close. The garage door needs a key.',
    source: 'water'
  });

  createItem('clock',
    TAKEABLE(),
    { loc: 'kitchen', scenery: true, examine: 'A white clock.' }
  );

  createItem('trapdoor',
    OPENABLE(false),
    { loc: 'kitchen', examine: 'A small trapdoor in the floor.' }
  );

  createItem('camera',
    TAKEABLE(),
    { loc: 'kitchen', examine: 'A cheap digital camera.', regex: /^picture box$/ }
  );

  createItem('big_kitchen_table',
    SURFACE(),
    { loc: 'kitchen', examine: 'A Formica table.' }
  );

  createItem('garage_door',
    OPENABLE(false),
    locked_WITH('garage_key'),
    {
      examine: 'The door to the garage.',
      alias: 'garage door',
      isAtLoc: function (loc) {
        if (typeof loc !== 'string') loc = loc.name;
        return (loc === 'kitchen' || loc === 'garage')
      }
    }
  );

  createItem('jug', VESSEL(4), TAKEABLE(), {
    loc: 'big_kitchen_table',
    examine: 'A small jug, stripped blue and white.'
  });

  createItem('kitchen_sink', {
    loc: 'kitchen',
    scenery: true,
    examine: 'A dirty sink.',
    isSourceOf: function (subst) { return subst === 'water' || subst === 'lemonade' }
  });

  createItem('water', LIQUID(), {
  });

  createItem('honey', LIQUID(), {
  });

  createItem('lemonade', LIQUID(), {
  });

  createRoom('basement', {
    desc: 'A dank room, with piles of crates everywhere.',
    darkDesc: 'It is dark, but you can just see the outline of the trapdoor above you.',
    up: new Exit('kitchen', { isHidden: function () { return false } }),
    lightSource: function () {
      return w.light_switch.switchedon ? LIGHT_FULL : LIGHT_none
    },
    hint: 'The basement illustrates light and dark. There is a torch in the lounge that may be useful.'
  });

  createItem('light_switch',
    SWITCHABLE(false),
    {
      loc: 'basement',
      examine: 'A switch, presumably for the light.',
      alias: 'light switch',
      checkCanSwitchOn: function () {
        if (!w.crates.moved) {
          msg('You cannot reach the light switch, without first moving the crates.');
          return false
        } else {
          return true
        }
      }
    }
  );

  createItem('crates',
    {
      loc: 'basement',
      examine: 'A bunch of old crates.',
      move: function () {
        msg('You move the crates, so the light switch is accessible.');
        this.moved = true;
        return true
      }
    }
  );

  createRoom('garage', {
    desc: 'An empty garage.',
    south: new Exit('kitchen', { use: useWithDoor, door: 'garage_door', doorName: 'kitchen door' }),
    hint: 'The garage features a complex mechanism, with two components.'
  });

  createItem('charger',
    {
      loc: 'garage',
      examine: 'A device bigger than a washing machine to charge a torch? It has a compartment and a button. {charger_state}.',
      mended: false,
      use: function () {
        metamsg('To use the charge, you need to put the torch in the compartment and press the button.');
      }
    }
  );

  createItem('charger_compartment',
    COMPONENT('charger'),
    CONTAINER(true),
    {
      alias: 'compartment',
      examine: 'The compartment is just the right size for the torch. It is {if:charger_compartment:closed:closed:open}.',
      testRestrictions: function (item) {
        const contents = w.charger_compartment.getContents(display.LOOK);
        if (contents.length > 0) {
          msg('The compartment is full.');
          return false
        }
        return true
      }
    }
  );

  createItem('charger_button',
    COMPONENT('charger'),
    {
      examine: 'A big red button.',
      alias: 'button',
      push: function (isMultiple, participant) {
        const contents = w.charger_compartment.getContents(display.ALL)[0];
        if (!w.charger_compartment.closed || !contents) {
          msg(lang.pronounVerb(participant, 'push', true) + ' the button, but nothing happens.');
          return false
        } else if (!contents.chargeResponse) {
          msg(lang.pronounVerb(participant, 'push', true) + ' the button. There is a brief hum of power, but nothing happens.');
          return false
        } else {
          return contents.chargeResponse(participant)
        }
      }
    }
  );

  createRoom('bedroom', {
    desc: 'A large room, with a big [bed] and a wardrobe.',
    down: new Exit('lounge'),
    in: new Exit('wardrobe'),
    west: new Exit('lift'),
    hint: 'The bedroom has a variety of garments that can be put on - in the right order.'
  });

  createItem('wardrobe',
    DEFAULT_ROOM,
    {
      out: new Exit('bedroom'),
      loc: 'bedroom',
      examine: 'It is so big you could probably get inside it.',
      desc: 'Oddly empty of fantasy worlds.'
    }
  );

  createItem('underwear',
    WEARABLE(1, ['lower']),
    {
      loc: 'bedroom',
      pronouns: lang.pronouns.massnoun,
      examine: 'Clean!'
    }
  );

  createItem('jeans',
    WEARABLE(2, ['lower']),
    { loc: 'bedroom', pronouns: lang.pronouns.plural, examine: 'Clean!' }
  );

  createItem('shirt',
    WEARABLE(2, ['upper']),
    { loc: 'bedroom', examine: 'Clean!' }
  );

  createItem('coat',
    WEARABLE(3, ['upper']),
    { loc: 'bedroom', examine: 'Clean!' }
  );

  createItem('jumpsuit',
    WEARABLE(2, ['upper', 'lower']),
    { loc: 'bedroom', examine: 'Clean!' }
  );

  createItem('suit_trousers',
    WEARABLE(2, ['lower']),
    { loc: 'wardrobe', examine: 'The trousers.', pronouns: lang.pronouns.plural }
  );

  createItem('jacket',
    WEARABLE(3, ['upper']),
    { loc: 'wardrobe', examine: 'The jacket' }
  );

  createItem('waistcoat',
    WEARABLE(2, ['upper']),
    { loc: 'wardrobe', examine: 'The waistcoat' }
  );

  createEnsemble('suit', [w.suit_trousers, w.jacket, w.waistcoat],
    { examine: 'A complete suit.', regex: /xyz/ }
  );

  createRoom('conservatory', {
    desc: 'A light airy room.',
    north: new Exit('lounge'),
    west: new Exit('garden'),
    hint: 'The conservatory features a pro-active NPC.'
  });

  createItem('crate',
    FURNITURE({ stand: true }), SHIFTABLE(),
    { loc: 'conservatory', examine: 'A large wooden crate, probably strong enough to stand on.' }
  );

  createItem('broken_chair',
    { loc: 'conservatory', examine: 'A broken chair.' }
  );

  createRoom('garden', {
    desc: 'Very overgrown. The garden backs onto a shop to the west, whilst the conservatory is east.',
    east: new Exit('conservatory'),
    west: new Exit('shop')
  });

  createRoom('far_away', {
    north: new Exit('lounge')
  });

  createItem('Arthur',
    NPC(false),
    {
      loc: 'garden',
      examine: function (isMultiple) {
        if (this.suspended) {
          msg(prefix(item, isMultiple) + 'Arthur is asleep.');
        } else {
          msg(prefix(item, isMultiple) + 'Arthur is awake.');
        }
      },
      suspended: true,
      properName: true,
      agenda: [
        'text:Arthur stands up and stretches.',
        "text:'I'm going to find Lara, and show her the garden,' says Arthur.:'Whatever!'",
        "walkTo:Lara:'Hi, Lara,' says Arthur. 'Come look at the garden.'",
        "joinedBy:Lara:'Sure,' says Lara.",
        "walkTo:garden:inTheGardenWithLara:'Look at all the beautiful flowers,' says Arthur.:Through the window you see Arthur say something to Lara.",
        'text:Lara smells the flowers.'
      ],
      inTheGardenWithLara: function (arr) {
        if (this.here()) {
          msg(arr[0]);
        }
        if (game.player.loc === 'dining_room') {
          msg(arr[1]);
        }
      },
      talkto: function () {
        msg("'Hey, wake up,' you say to Arthur.");
        this.suspended = false;
        this.pause();
        this.multiMsg([
          "'What?' he says, opening his eyes. 'Oh, it's you.'",
          "'I am awake!'",
          false,
          "'Stop it!'"
        ]);
        return true
      }
    }
  );

  createItem('Kyle', NPC(false),
    {
      loc: 'lounge',
      examine: 'A grizzly bear. But cute.',
      properName: true,
      // agenda:["text:Hello", "wait:2:ending", "text:goodbye"],
      // agenda:["patrol:dining_room:lounge:kitchen:lounge"],
      askOptions: [
        {
          name: 'House',
          test: function (p) { return p.text.match(/house/) },
          msg: "'I like it,' says Kyle."
        },
        {
          name: 'Garden',
          test: function (p) { return p.text.match(/garden/) },
          responses: [
            {
              test: function (p) { return w.garden.fixed },
              msg: "'Looks much better now,' Kyle says with a grin."
            },
            {
              test: function (p) { return w.Kyle.needsWorkCount === 0 },
              msg: "'Needs some work,' Kyle says with a sign.",
              script: function (p) { w.Kyle.needsWorkCount++; }
            },
            {
              msg: "'I'm giving up hope of it ever getting sorted,' Kyle says."
            }
          ]
        },
        {
          test: function (p) { return p.text.match(/park/) },
          responses: [
            {
              name: 'Park',
              mentions: ['Swings'],
              msg: "'Going to the park sounds like fun,' Kyle says with a grin. 'We can go on the swings!'"
            }
          ]
        },
        {
          name: 'Fountain',
          test: function (p) { return p.text.match(/fountain/) && p.actor.specialFlag },
          msg: "'The fountain does not work.'"
        },
        {
          name: 'Swings',
          silent: true,
          test: function (p) { return p.text.match(/swing/) },
          msg: "'The swings are fun!'"
        },
        {
          msg: 'Kyle has no interest in that subject.',
          failed: true
        }
      ],
      needsWorkCount: 0,
      talkto: function () {
        switch (this.talktoCount) {
          case 0 : msg("You say 'Hello,' to Kyle, and he replies in kind."); break
          case 1 : msg("You ask Kyle how to get upstairs. 'You know,' he replies, 'I have no idea.'"); break
          case 2 : msg("'Where do you sleep?' you ask Kyle."); msg("'What's \"sleep\"?'"); break
          default: msg('You wonder what you can talk to Kyle about.'); break
        }
        this.pause();
        return true
      }
    });

  createItem('kyle_question', QUESTION(), {
    responses: [
      {
        regex: /^(yes)$/,
        response: function () {
          msg("'Oh, cool,' says Kyle.");
        }
      },
      {
        regex: /^(no)$/,
        response: function () {
          msg("'Oh, well, Lara, this is Tester, he or she is testing Quest 6,' says Kyle.");
        }
      },
      {
        response: function () {
          msg("'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'");
          w.Kyle.askQuestion('kyle_question');
        }
      }
    ]
  });

  createItem('straw_boater',
    WEARABLE(false),
    { loc: 'Kyle', examine: 'A straw boater.', worn: true }
  );

  createItem('Kyle_The_Garden',
    TOPIC(true),
    {
      loc: 'Kyle',
      alias: "What's the deal with the garden?",
      nowShow: ['Mary_The_Garden_Again'],
      script: function () {
        msg("You ask Kyle about the garden, but he's not talking.");
      }
    }
  );

  createItem('Kyle_The_Garden_Again',
    TOPIC(false),
    {
      loc: 'Kyle',
      alias: "Seriously, what's the deal with the garden?",
      script: function () {
        msg("You ask Kyle about the garden, but he's STILL not talking.");
      }
    }
  );

  createItem('Kyle_The_Weather',
    TOPIC(true),
    {
      loc: 'Kyle',
      alias: 'The weather',
      script: function () {
        msg('You talk to Kyle about the weather.');
      }
    }
  );

  createItem('Lara',
    NPC(true),
    {
      loc: 'dining_room',
      examine: 'A normal-sized bunny.',
      properName: true,
      happy: false,
      giveReaction: function (item, multiple, char) {
        if (item === w.ring) {
          msg("'Oh, my,' says Lara. 'How delightful.' She slips the ring on her finger, then hands you a key.");
          w.ring.loc = 'Lara';
          w.ring.worn = true;
          w.garage_key.loc = char.name;
        }
        if (item === w.book) {
          msg("'Hmm, a book about carrots,' says Lara. 'Thanks.'");
          w.book.loc = 'Lara';
        } else {
          msg("'Why would I want {i:that}?'");
        }
      },
      getAgreementTake: function (item) {
        if (item === w.brick) {
          msg("'I'm not picking up any bricks,' says Lara indignantly.");
          return false
        }
        return true
      },
      getAgreementGo: function (dir) {
        if (!this.happy) {
          msg("'I'm not going " + dir + ",' says Lara indignantly. 'I don't like that room.'");
          return false
        }
        return true
      },
      getAgreementDrop: function () {
        return true
      },
      getAgreementStand: function () {
        return true
      },
      getAgreementRead: function () {
        return true
      },
      getAgreementPosture: function () {
        if (!this.happy) {
          msg("'I don't think so!' says Lara indignantly.");
          return false
        }
        return true
      },
      getAgreement () {
        msg("'I'm not doing that!' says Lara indignantly.");
        return false
      },
      canTalkPlayer: function () { return true },

      sayPriority: 3,
      sayResponses: [
        {
          regex: /^(hi|hello)$/,
          id: 'hello',
          response: function () {
            msg("'Oh, hello there,' replies Lara.");
            if (w.Kyle.isHere()) {
              msg("'Have you two met before?' asks Kyle.");
              w.Kyle.askQuestion('kyle_question');
            }
          }
        }
      ]
    }
  );

  createItem('garage_key',
    TAKEABLE(),
    { loc: 'lounge', examine: 'A big key.', alias: 'garage key' }
  );

  createItem('Lara_garage_key',
    TOPIC(true),
    {
      loc: 'Lara',
      alias: 'Can I have the garden key?',
      script: function () {
        msg('You ask Lara about the garage key; she agrees to give it to you if you give her a ring. Perhaps there is one in the glass cabinet?');
      }
    }
  );

  createItem('Lara_very_attractive',
    TOPIC(true),
    {
      loc: 'Lara',
      alias: "You're very attractive",
      script: function () {
        msg("You tell Lara she looks very attractive. 'Why thank you!' she replies, smiling at last.");
        w.Lara.happy = true;
      }
    }
  );

  createItem('walls',
    {
      examine: "They're walls, what are you expecting?",
      regex: /^wall$/,
      scenery: true,
      isAtLoc: function (loc, situation) {
        if (typeof loc !== 'string') loc = loc.name;
        return w[loc].room && situation === display.PARSER
      }
    }
  );

  createItem('brick',
    COUNTABLE({ lounge: 7, dining_room: 1 }),
    { examine: 'A brick is a brick.', regex: /^(\d+ )?bricks?$/ }
  );

  createRoom('shop', {
    desc: 'A funny little shop.',
    east: new Exit('garden'),
    willBuy: function (obj) {
      return (obj === w.trophy)
    }
  });

  createItem('carrot', TAKEABLE(), MERCH(2, ['shop']), {
    examine: "It's a carrot!"
  });

  createItem('honey_pasta', TAKEABLE(), MERCH(5, ['shop']), {
    examine: "It's pasta. With honey on it."
  });

  createItem('trophy', TAKEABLE(), MERCH(15, 'shop'), {
    examine: 'It is a unique trophy!',
    doNotClone: true
  });

  exports.BRIEF = BRIEF;
  exports.COLOURS = COLOURS;
  exports.COMPONENT = COMPONENT;
  exports.CONSULTABLE = CONSULTABLE;
  exports.CONTAINER = CONTAINER;
  exports.CONTAINER_BASE = CONTAINER_BASE;
  exports.COUNTABLE = COUNTABLE;
  exports.Cmd = Cmd;
  exports.DEFAULT_ITEM = DEFAULT_ITEM;
  exports.DEFAULT_OBJECT = DEFAULT_OBJECT;
  exports.DEFAULT_ROOM = DEFAULT_ROOM;
  exports.DEFINITE = DEFINITE;
  exports.EDIBLE = EDIBLE;
  exports.ERROR = ERROR;
  exports.ERR_DEBUG_CMD = ERR_DEBUG_CMD;
  exports.ERR_GAME_BUG = ERR_GAME_BUG;
  exports.ERR_QUEST_BUG = ERR_QUEST_BUG;
  exports.ERR_SAVE_LOAD = ERR_SAVE_LOAD;
  exports.ERR_TP = ERR_TP;
  exports.Exit = Exit;
  exports.ExitCmd = ExitCmd;
  exports.FAILED = FAILED;
  exports.FURNITURE = FURNITURE;
  exports.INDEFINITE = INDEFINITE;
  exports.INFINITY = INFINITY;
  exports.LIGHT_EXTREME = LIGHT_EXTREME;
  exports.LIGHT_FULL = LIGHT_FULL;
  exports.LIGHT_MEAGRE = LIGHT_MEAGRE;
  exports.LIGHT_SELF = LIGHT_SELF;
  exports.LIGHT_none = LIGHT_none;
  exports.LIQUID = LIQUID;
  exports.MERCH = MERCH;
  exports.NPC = NPC;
  exports.NULL_FUNC = NULL_FUNC;
  exports.NpcCmd = NpcCmd;
  exports.NpcExitCmd = NpcExitCmd;
  exports.OPENABLE = OPENABLE;
  exports.PARSER_FAILURE = PARSER_FAILURE;
  exports.PLAYER = PLAYER;
  exports.QUESTION = QUESTION;
  exports.REACHABLE = REACHABLE;
  exports.SHIFTABLE = SHIFTABLE;
  exports.SUCCESS = SUCCESS;
  exports.SUCCESS_NO_TURNSCRIPTS = SUCCESS_NO_TURNSCRIPTS;
  exports.SUPPRESS_ENDTURN = SUPPRESS_ENDTURN;
  exports.SURFACE = SURFACE;
  exports.SWITCHABLE = SWITCHABLE;
  exports.TAKEABLE = TAKEABLE;
  exports.TAKEABLE_DICTIONARY = TAKEABLE_DICTIONARY;
  exports.TERSE = TERSE;
  exports.TEXT_COLOUR = TEXT_COLOUR;
  exports.TOPIC = TOPIC;
  exports.TRANSIT = TRANSIT;
  exports.TRANSIT_BUTTON = TRANSIT_BUTTON;
  exports.VERBOSE = VERBOSE;
  exports.VESSEL = VESSEL;
  exports.VISIBLE = VISIBLE;
  exports.WEARABLE = WEARABLE;
  exports.agenda = agenda;
  exports.arabic = arabic;
  exports.arrayCompare = arrayCompare;
  exports.arrayFilterByAttribute = arrayFilterByAttribute;
  exports.arrayRemove = arrayRemove;
  exports.arraySubtract = arraySubtract;
  exports.askQuestion = askQuestion;
  exports.clearScreen = clearScreen;
  exports.cloneObject = cloneObject;
  exports.cmdDirections = cmdDirections;
  exports.cmdRules = cmdRules;
  exports.commands = commands;
  exports.createEnsemble = createEnsemble;
  exports.createItem = createItem;
  exports.createObject = createObject;
  exports.createRoom = createRoom;
  exports.debugmsg = debugmsg;
  exports.diceRoll = diceRoll;
  exports.display = display;
  exports.displayMoney = displayMoney;
  exports.displayNumber = displayNumber;
  exports.endTurnUI = endTurnUI;
  exports.errormsg = errormsg;
  exports.extractChar = extractChar;
  exports.failedmsg = failedmsg;
  exports.falsemsg = falsemsg;
  exports.firstTimeTesting = firstTimeTesting;
  exports.firsttime = firsttime;
  exports.firsttimeTracker = firsttimeTracker;
  exports.formatList = formatList;
  exports.game = game;
  exports.getDateTime = getDateTime;
  exports.getDir = getDir;
  exports.getResponseList = getResponseList;
  exports.handleFillWithLiquid = handleFillWithLiquid;
  exports.handleGiveToNpc = handleGiveToNpc;
  exports.handlePushExit = handlePushExit;
  exports.handlePutInContainer = handlePutInContainer;
  exports.handleStandUp = handleStandUp;
  exports.handleTakeFromContainer = handleTakeFromContainer;
  exports.initCommands = initCommands;
  exports.io = io;
  exports.lang = lang;
  exports.listProperties = listProperties;
  exports.locked_WITH = locked_WITH;
  exports.metamsg = metamsg;
  exports.msg = msg;
  exports.msgDiv = msgDiv;
  exports.msgHeading = msgHeading;
  exports.msgList = msgList;
  exports.msgTable = msgTable;
  exports.msgUnscramble = msgUnscramble;
  exports.npc_utilities = npc_utilities;
  exports.parser = parser;
  exports.parsermsg = parsermsg;
  exports.picture = picture;
  exports.prefix = prefix;
  exports.printOrRun = printOrRun;
  exports.processText = processText;
  exports.randomChance = randomChance;
  exports.randomFromArray = randomFromArray;
  exports.randomInt = randomInt;
  exports.respond = respond;
  exports.roman = roman;
  exports.saveLoad = saveLoad;
  exports.scopeHeldBy = scopeHeldBy;
  exports.scopeHereListed = scopeHereListed;
  exports.scopeReachable = scopeReachable;
  exports.sentenceCase = sentenceCase;
  exports.settings = settings;
  exports.showDropDown = showDropDown;
  exports.showMenu = showMenu;
  exports.showYesNoDropDown = showYesNoDropDown;
  exports.showYesNoMenu = showYesNoMenu;
  exports.spaces = spaces;
  exports.test = test;
  exports.toRoman = toRoman;
  exports.tp = tp;
  exports.transitOfferMenu = transitOfferMenu;
  exports.useWithDoor = useWithDoor;
  exports.util = util;
  exports.w = w;
  exports.wait = wait;
  exports.world = world;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=QuestJS.umd.js.map
