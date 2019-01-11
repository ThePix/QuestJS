"use strict";

// Should all be language neutral



const DEFAULT_ROOM = {
  room:true,
  beforeEnter:NULL_FUNC,
  beforeEnterFirst:NULL_FUNC,
  afterEnter:NULL_FUNC,
  afterEnterFirst:NULL_FUNC,
  onExit:NULL_FUNC,
  visited:0,
  
  lightSource:function() { return LIGHT_FULL; },

  description:function() {
    if (game.dark) {
      printOrRun(game.player, this, "darkDesc");
      return true;
    }
    for (var i = 0; i < ROOM_TEMPLATE.length; i++) {
      if (ROOM_TEMPLATE[i] === "%") {
        printOrRun(game.player, this, "desc");
      }
      else {
        msg(ROOM_TEMPLATE[i]);
      }
    }
    return true;
  },
  
  darkDescription:function() {
    msg("It is dark.");
  },
  
  getContents:function() {
    var list = [];
    for (var key in w) {
      if (w[key].isAtLoc(this.name) && w[key].display >= DSPY_SCENERY) {
        list.push(w[key]);
      }
    }
    return list;
  },
};


const DEFAULT_ITEM = {
  display:DSPY_DISPLAY,
  
  pronouns:PRONOUNS.thirdperson,
  
  // Used in speak to
  isTopicVisible:function() { return false; },
  lightSource:function() { return LIGHT_NONE; },
  testKeys:function(char, toLock) { return false; },

  icon:function() {
    return "";
  },
  
  getVerbs:function() {
    return [VERBS.examine];
  },
};


const TAKEABLE_DICTIONARY = {
  getVerbs:function() {
    if (this.isAtLoc(game.player.name)) {
      return [VERBS.examine, VERBS.drop];
    }
    else {
      return [VERBS.examine, VERBS.take];
    }
  },

  takeable:true,
  
  drop:function(isMultiple, char) {
    msg(prefix(this, isMultiple) + CMD_DROP_SUCCESSFUL(char, this));
    this.loc = w[char.loc].name;
    return true;
  },
  
  take:function(isMultiple, char) {
    if (this.isAtLoc(char.name)) {
      msg(prefix(this, isMultiple) + CMD_ALREADY_HAVE(char, this));
      return false;
    }

    msg(prefix(this, isMultiple) + CMD_TAKE_SUCCESSFUL(char, this));
    this.loc = char.name;
    if (this.display === DSPY_SCENERY) {
      this.display = DSPY_DISPLAY;
    }
    return true;
  },
  
};


const TAKEABLE = function() {
  return TAKEABLE_DICTIONARY;
}



const COUNTABLE = function(countableLocs) {
  var res = $.extend({}, TAKEABLE_DICTIONARY);
  //var res = TAKEABLE_DICTIONARY;
  res.countable = true;
  res.countableLocs = countableLocs;
  
  res.extractNumber = function() {
    var md = /^(\d+)/.exec(this.cmdMatch);
    if (!md) { return false; }
    return parseInt(md[1]);
  };
  
  res.customSave = function() {
    var l = [];
    for (var key in this.countableLocs) {
      l.push(key + "=" + this.countableLocs[key]);
    }
    this.customSaveCountableLocs = l.join(",");
  };

  res.customLoad = function() {
    var l = this.customSaveCountableLocs.split(",");
    this.countableLocs = {};
    for (var i = 0; i < l.length; i++) {
      var parts = l[i].split("=");
      this.countableLocs[parts[0]] = parseInt(parts[1]);
    }
    delete this.customSaveCountableLocs;
  };

  res.byname = function(options) {
    var s = "";
    var count = options.loc ? this.countAtLoc(options.loc) : false;
    if (options.count) {
      count = options.count;
      s = toWords(count) + " ";
    }
    else if (options.article === DEFINITE) {
      s = "the ";
    }
    else if (options.article === INDEFINITE) {
      if (count) {
        s = count === 1 ? "a " : toWords(count) + " ";
      }
      else {
        s = "some ";
      }
    }
    if (count === 1) {
      s += this.alias;
    }
    else if (this.pluralAlias) {
      s += this.pluralAlias;
    }
    else {
      s += this.alias + "s";
    }
    return s;
  };
  
  res.getListAlias = function(loc) {
    return (this.pluralAlias ? this.pluralAlias : this.listalias + "s") + " (" + this.countAtLoc(loc) + ")";
  };
  
  res.isAtLoc = function(loc) {
    if (!this.countableLocs[loc]) { return false; }
    return (this.countableLocs[loc] > 0);
  };

  res.countAtLoc = function(loc) {
    if (!this.countableLocs[loc]) { return 0; }
    return this.countableLocs[loc];
  };
  
  res.resolveNames = function() {
    if (!this.alt) { this.alt = []; }
    if (!this.pluralAlias) { this.pluralAlias = this.alias + "s"; }
    if (!this.alt.includes(this.pluralAlias)) {
      this.alt.push(this.pluralAlias);
    }
  };
  
  res.moveFromTo = function(fromLoc, toLoc, count) {
    if (!count) { count = this.extractNumber(); }
    this.takeFrom(fromLoc, count);
    this.giveTo(toLoc, count);
  };
  
  res.takeFrom = function(loc, count) {
    this.countableLocs[loc] -= count;
    if (this.countableLocs[loc] <= 0) { delete this.countableLocs[loc]; }
  };
  
  res.giveTo = function(loc, count) {
    if (!this.countableLocs[loc]) { this.countableLocs[loc] = 0; }
    this.countableLocs[loc] += count;
  };
  
  res.take = function(isMultiple, char) {
    var sourceLoc = findSource(this, char.loc);
    if (!sourceLoc) {
      msg(prefix(this, isMultiple) + CMD_NONE_THERE(char, this));
      return false;
    }
    var n = this.extractNumber();
    var m = this.countAtLoc(sourceLoc);
    //if (m === 0) {
    //  msg(prefix(this, isMultiple) + CMD_NONE_THERE(char, this));
    //  return false;
    //}

    if (!n) { n = m; }  // no number specified
    if (n > m)  { n = m; }  // too big number specified
    
    msg(prefix(this, isMultiple) + CMD_TAKE_SUCCESSFUL(char, this, n));
    this.takeFrom(sourceLoc, n);
    this.giveTo(char.name, n);
    if (this.display === DSPY_SCENERY) {
      this.display = DSPY_DISPLAY;
    }
    return true;
  };

  res.drop = function(isMultiple, char) {
    var n = this.extractNumber();
    var m = this.countAtLoc(char.name);
    if (m === 0) {
      msg(prefix(this, isMultiple) + CMD_NONE_HELD(char, this));
      return false;
    }

    if (!n) { n = m; }  // no number specified
    if (n > m)  { n = m; }  // too big number specified
    
    msg(prefix(this, isMultiple) + CMD_DROP_SUCCESSFUL(char, this, n));
    this.takeFrom(char.name, n);
    this.giveTo(char.loc, n);
    return true;
  };

  return res;
};



const WEARABLE = function(layer, slots) {
  var res = $.extend({}, TAKEABLE_DICTIONARY);
  //var res = TAKEABLE_DICTIONARY;
  res.wearable = true;
  res.layer = layer ? layer : false;
  res.slots = slots && layer ? slots: [];
  
  res.getVerbs = function() {
    if (this.isAtLoc(game.player.name)) {
      return this.worn ? [VERBS.examine, VERBS.remove] : [VERBS.examine, VERBS.drop, VERBS.wear];
    }
    else {
      return [VERBS.examine, VERBS.take];
    }
  };

  res.icon = function() {
    return ('<img src="images/garment12.png" />');
  };
  
  res.canWearRemove = function(char, toWear) {
    if (!this.layer) { return true; }
    for (var i = 0; i < slots.length; i++) {
      var outer = getOuterWearable(char, slots[i]);
      if (outer && outer !== this && outer.layer >= this.layer) {
        if (toWear) {
          msg(CMD_CANNOT_WEAR_OVER(char, this, outer));
        }
        else {
          msg(CMD_CANNOT_REMOVE_UNDER(char, this, outer));
        }
        return false;
      }
    }
    return true;
  };
  
  res.wear = function(isMultiple, char) {
    if (!this.canWearRemove(char, true)) { return false; }
    msg(prefix(this, isMultiple) + CMD_WEAR_SUCCESSFUL(char, this));
    this.loc = char.name;
    this.worn = true;
    return true;
  };
  
  res.remove = function(isMultiple, char) {
    if (!this.canWearRemove(char, false)) { return false; }
    msg(prefix(this, isMultiple) + CMD_REMOVE_SUCCESSFUL(char, this));
    this.loc = char.name;
    this.worn = false;
    return true;
  };

  res.byname = function(options) {
    if (!options) { options = {}; }
    var s = "";
    if (options.article === DEFINITE) {
      s = _itemThe(this);
    }
    if (options.article === INDEFINITE) {
      s = _itemA(this);
    }
    s += this.alias;
    if (this.worn && options.modified && (this.isAtLoc(game.player.name))) { s += " (worn)"; }
    return s;
  };

  return res;
};




const CONTAINER = function(openable) {
  var res = {};
  res.container = true;
  res.closed = openable;
  res.openable = openable;
  res.listContents = contentsForContainer,
  
  res.getVerbs = function() {
    var arr = [VERBS.examine];
    if (this.takeable) {
      arr.push(this.isAtLoc(game.player.name) ? VERBS.drop : VERBS.take);
    }
    arr.push(this.closed ? VERBS.open : VERBS.close);
    return arr;
  };

  res.byname = function(options) {
    var prefix = "";
    if (options.article === DEFINITE) {
      prefix = _itemThe(this);
    }
    if (options.article === INDEFINITE) {
      prefix = _itemA(this);
    }
    var contents = this.getContents();
    if (contents.length === 0 || !options.modified) {
      return prefix + this.alias;
    }
    else {
      return prefix + this.alias + " (" + this.listContents(contents) + ")";
    }
  };
  
  res.getContents = function() {
    var list = [];
    for (var key in w) {
      if (w[key].isAtLoc(this.name) && w[key].display >= DSPY_SCENERY) {
        list.push(w[key]);
      }
    }
    return list;
  };
  
  res.open = function(isMultiple, char) {
    if (!this.openable) {
      msg(prefix(this, isMultiple) + CMD_CANNOT_OPEN(char, this));
      return false;
    }
    else if (!this.closed) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(char, this));
      return false;
    }
    if (this.locked) {
      if (this.testKeys(char)) {
        this.closed = false;
        msg(prefix(this, isMultiple) + CMD_UNLOCK_SUCCESSFUL(char, this));
        msg(prefix(this, isMultiple) + CMD_OPEN_SUCCESSFUL(char, this));
        return true;
      }
      else {
        msg(prefix(this, isMultiple) + CMD_LOCKED(char, this));
        return false;
      }
    }
    this.closed = false;
    msg(prefix(this, isMultiple) + CMD_OPEN_SUCCESSFUL(char, this));
    return true;
  };
  
  res.close = function(isMultiple, char) {
    if (!this.openable) {
      msg(prefix(this, isMultiple) + CMD_CANNOT_CLOSE(char, this));
      return false;
    }
    else if (this.closed) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(char, this));
      return false;
    }
    this.hereVerbs = ['Examine', 'Open'];
    this.closed = true;
    msg(prefix(this, isMultiple) + CMD_CLOSE_SUCCESSFUL(char, this));
    return true;
  };
  
  res.icon = function() {
    return ('<img src="images/' + (this.closed ? 'closed' : 'opened') + '12.png" />');
  };
  
  res.canReachThrough = function() { return !this.closed; };
  res.canSeeThrough = function() { return !this.closed || this.transparent; };

  return res;
};


const SURFACE = function() {
  var res = {};
  res.container = true;
  res.byname = CONTAINER().byname;
  res.getContents = CONTAINER().getContents;
  res.listContents = contentsForSurface;
  res.contentsAsString = function() { return true; };
  res.canReachThrough = function() { return true; };
  res.canSeeThrough = function() { return true; };
  return res;
};


const OPENABLE = function(alreadyOpen) {
  var res = {};
  res.container = true;
  res.closed = !alreadyOpen;
  res.openable = true;
  
  res.getVerbs = function() {
    var arr = [VERBS.examine];
    if (this.takeable) {
      arr.push(this.isAtLoc(game.player.name) ? VERBS.drop : VERBS.take);
    }
    arr.push(this.closed ? VERBS.open : VERBS.close);
    return arr;
  };

  res.byname = function(options) {
    var s = "";
    if (options.article === DEFINITE) {
      s = _itemThe(this);
    }
    if (options.article === INDEFINITE) {
      s = _itemA(this);
    }
    s += this.alias;
    if (!this.closed && options.modified) { s += " (open)"; }
    return s;
  };

  res.open = CONTAINER().open;
  res.close = CONTAINER().close;
  return res;
};


const LOCKED_WITH = function(keyNames) {
  if (typeof keyNames === "string") { keyNames = [keyNames]; }
  if (keyNames === undefined) { keyNames = []; }
  var res = {
    keyNames:keyNames,
    locked:true,
    lock:function(isMultiple, char) {
      if (this.locked) {
        msg(CMD_ALREADY(char, this));
        return false;
      }
      if (!this.testKeys(char, true)) {
        msg(CMD_NO_KEY(char, this));
        return false;
      }
      if (!this.closed) {
        this.closed = true;
        msg(CMD_CLOSE_SUCCESSFUL(char, this));
      }      
      msg(CMD_LOCK_SUCCESSFUL(char, this));
      this.locked = true;
      return true;
    },
    unlock:function(isMultiple, char) {
      if (!this.locked) {
        msg(CMD_ALREADY(char, this));
        return false;
      }
      if (!this.testKeys(char, false)) {
        msg(CMD_NO_KEY(char, this));
        return false;
      }
      msg(CMD_UNLOCK_SUCCESSFUL(char, this));
      this.locked = false;
      return true;
    },
    testKeys:function(char, toLock) {
      for (var i = 0; i < keyNames.length; i++) {
        if (!w[keyNames[i]]) {
          errormsg(ERR_GAME_BUG, ERROR_UNKNOWN_KEY(keyNames[i]));
          return false;
        }
        if (w[keyNames[i]].isAtLoc(char.name)) { 
          return true; 
        }
      }
      return false;
    }
  };
  return res;
};


const SWITCHABLE = function(alreadyOn) {
  var res = {};
  res.switchedon = alreadyOn;
  
  res.getVerbs = function() {
    var arr = [VERBS.examine];
    if (this.takeable) {
      arr.push(this.isAtLoc(game.player.name) ? VERBS.drop : VERBS.take);
    }
    arr.push(this.switchedon ? VERBS.switchoff : VERBS.switchon);
    return arr;
  };

  res.switchon = function(isMultiple, char) {
    if (this.switchedon) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(char, this));
      return false;
    }
    if (!this.checkCanSwitchOn()) {
      return false;
    }
    msg(CMD_TURN_ON_SUCCESSFUL(char, this));
    this.doSwitchon();
    return true;
  };
  
  res.doSwitchon = function() {
    var lighting = game.dark;
    this.switchedon = true;
    game.update();
    if (lighting !== game.dark) {
      game.room.description();
    }
  };
  
  res.checkCanSwitchOn = function() { return true; };
  
  res.switchoff = function(isMultiple, char) {
    if (!this.switchedon) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(char, this));
      return false;
    }
    msg(CMD_TURN_OFF_SUCCESSFUL(char, this));
    this.doSwitchoff();
    return true;
  };
  
  res.doSwitchoff = function() {
    var lighting = game.dark;
    this.switchedon = false;
    game.update();
    if (lighting !== game.dark) {
      game.room.description();
    }
  };

  return res;
};


// Ideally Quest will check components when doing a command for the whole
// I think?

const COMPONENT = function(nameOfWhole) {
  var res = {
    display:DSPY_SCENERY,
    component:true,
    loc:nameOfWhole,
    takeable:true, // Set this as it has its own take attribute
    isAtLoc:function(loc) {
      var cont = w[this.loc];
      if (cont.isAtLoc(loc)) { return true; }
      return cont.isAtLoc(loc);
    },
    take:function(isMultiple, char) {
      msg(prefix(this, isMultiple) + CMD_CANNOT_TAKE_COMPONENT(char, this));
      return false;
    },
  };
  return res;
};


const PLAYER = {
  pronouns:PRONOUNS.secondperson,
  display:DSPY_SCENERY,
  player:true,
  canReachThrough:function() { return true; },
  canSeeThrough:function() { return true; },
  getAgreement:function() { return true; },
  getContents:CONTAINER().getContents,
};

const TURNSCRIPT = function(isRunning, fn) {
  var res = {
    display:DSPY_HIDDEN,
    runTurnscript:function() { return this.isRunning; },
    isRunning:isRunning,
    turnscript:fn,
  };
  return res;
};



const NPC = function(isFemale) {
  var res = {
    npc:true,
    pronouns:isFemale ? PRONOUNS.female : PRONOUNS.male,
    speaktoCount:0,
    askoptions:[],
    telloptions:[],
    excludeFromAll:true,
    canReachThrough:function() { return false; },
    canSeeThrough:function() { return true; },
    getContents:CONTAINER().getContents,
    
    getVerbs:function() {
      return [VERBS.lookat, VERBS.speakto];
    },
    
    icon:function() {
      return ('<img src="images/npc12.png" />');
    },
  };

  res.getAgreement = function(cmdName, item) {
    return true;
  };
  
  res.heading = function(dir) {
    return NPC_HEADING(this, dir);
  };

  res.getHolding = function() {
    return this.getContents().filter(function(el) { return !el.worn; });
  };
  
  res.getWearing = function() {
    return this.getContents().filter(function(el) { return el.worn; });
  };
  
  
  res.byname = function(options) {
    var s = this.alias;
    if (options.article === DEFINITE) {
      s = _itemThe(this) + this.alias;
    }
    if (options.article === INDEFINITE) {
      s = _itemA(this) + this.alias;
    }
    if (this.getContents().length === 0 || !options.modified) {
      return s;
    }
    if (this.getHolding().length === 0 || !options.modified) {
      return s + " (wearing " + formatList(this.getWearing(), {article:INDEFINITE, lastJoiner:LIST_AND, modified:true, nothing:LIST_NOTHING, loc:this.name}) + ")";
    }
    if (this.getWearing().length === 0 || !options.modified) {
      return s + " (holding " + formatList(this.getHolding(), {article:INDEFINITE, lastJoiner:LIST_AND, modified:true, nothing:LIST_NOTHING, loc:this.name}) + ")";
    }
    s += " (holding " + formatList(this.getHolding(), {article:INDEFINITE, lastJoiner:LIST_AND, nothing:LIST_NOTHING, loc:this.name}) + ", and ";
    s += "wearing " + formatList(this.getWearing(), {article:INDEFINITE, lastJoiner:LIST_AND, nothing:LIST_NOTHING, loc:this.name}) + ")";
    return s;
  };
  
  res.askabout = function(text) {
    if (checkCannotSpeak(this)) {
      return false;
    }
    msg(askAboutIntro(this, text));
    for (var i = 0; i < this.askoptions.length; i++) {
      if (this.askoptions[i].regex.test(text)) {
        printOrRun(game.player, this, this.askoptions[i].response);
        return true;
      }
    }
    msg(CMD_NPC_NOTHING_TO_SAY_ABOUT(this));
    return false;
  };
  res.tellabout = function(text) {
    if (checkCannotSpeak(this)) {
      return false;
    }
    msg(tellAboutIntro(this, text));
    for (var i = 0; i < this.telloptions.length; i++) {
      if (this.telloptions[i].regex.test(text)) {
        printOrRun(game.player, this, this.telloptions[i].response);
        return true;
      }
    }
    msg(CMD_NPC_NO_INTEREST_IN(this));
    return false;
  };

  res.speakto = function() {
    if (checkCannotSpeak(this)) {
      return false;
    }
    var topics = this.getContents(this).filter(function(el) { return el.isTopicVisible(); });
    topics.push(NEVER_MIND);
    showMenu(talkToMenuTitle(this), topics, function(result) {
      if (result !== NEVER_MIND) {
        result.runscript();
      }
    });
    
    return false;
  };
  res.talkto = function() {
    printOrRun(game.player, this, "speakto");
    this.speaktoCount++;
  };
  return res;
};


const TOPIC = function(fromStart) {
  var res = {
    conversationTopic:true,
    display:DSPY_HIDDEN,
    showTopic:fromStart,
    hideTopic:false,
    hideAfter:true,
    nowShow:[],
    nowHide:[],
    runscript:function() {
      var obj;
      this.script();
      this.hideTopic = this.hideAfter;
      for (var i = 0; i < this.nowShow.length; i++) {
        obj = w[this.nowShow[i]];
        obj.showTopic = true;
      }
      for (i = 0; i < this.nowHide.length; i++) {
        obj = w[this.nowHide[i]];
        obj.hideTopic = true;
      }
    },
    isTopicVisible:function() {
      return this.showTopic && !this.hideTopic;
    }
  };
  return res;
};