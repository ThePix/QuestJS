"use strict";

const DEFAULT_ROOM = {
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
};


const DEFAULT_ITEM = {
  display:DSPY_DISPLAY,
  
  pronouns:PRONOUNS.thirdperson,
  
  // Used in speak to
  isTopicVisible:function() { return false; },
  lightSource:function() { return LIGHT_NONE; },
  isBlocking:function(visible) { return false; },
  testKeys:function(char, toLock) { return false; },

  icon:function() {
    return "";
  },
  
  getVerbs:function() {
    return ['Examine'];
  },
};


const TAKABLE_DICTIONARY = {
  getVerbs:function() {
    if (this.loc === game.player.name) {
      return ['Examine', 'Drop'];
    }
    else {
      return ['Examine', 'Take'];
    }
  },

  takable:true,
  
  drop:function(isMultiple, char) {

    msg(prefix(this, isMultiple) + CMD_DROP_SUCCESSFUL(char, this));
    this.loc = w[char.loc].name;
    game.update();
    return true;
  },
  
  take:function(isMultiple, char) {
    /*if (!isReachable(this)) {
      msg(prefix(this, isMultiple) + CMD_NOT_HERE(char, this));
      return false;
    };
    if (!this.takable) {
      msg(prefix(this, isMultiple) + CMD_CANNOT_TAKE(char, this));
      return false;
    };*/
    if (this.loc === char.name) {
      msg(prefix(this, isMultiple) + CMD_ALREADY_HAVE(char, this));
      return false;
    };

    msg(prefix(this, isMultiple) + CMD_TAKE_SUCCESSFUL(char, this));
    this.loc = char.name;
    if (this.display === DSPY_SCENERY) {
      this.display = DSPY_DISPLAY;
    }
    game.update();
    return true;
  },
  
};


const TAKABLE = function() {
  return TAKABLE_DICTIONARY;
}


const WEARABLE = function() {
  var res = $.extend({}, TAKABLE_DICTIONARY);
  //var res = TAKABLE_DICTIONARY;
  res.wearable = true;
  
  res.getVerbs = function() {
    if (this.loc === game.player.name) {
      return this.worn ? ['Examine', 'Remove'] : ['Examine', 'Drop', 'Wear'];
    }
    else {
      return ['Examine', 'Take'];
    }
  },

  res.icon = function() {
    return ('<img src="images/garment12.png" />');
  };
  
  res.wear = function(isMultiple, char) {
    msg(prefix(this, isMultiple) + CMD_WEAR_SUCCESSFUL(char, this));
    this.loc = char.name;
    this.worn = true;
    game.update();
    return true;
  };
  
  res.remove = function(isMultiple, char) {
    msg(prefix(this, isMultiple) + CMD_REMOVE_SUCCESSFUL(char, this));
    this.loc = char.name;
    this.worn = false;
    game.update();
    return true;
  };
  return res;
};




const CONTAINER = function(alreadyOpen) {
  var res = {};
  res.container = true;
  res.closed = !alreadyOpen;
  res.openable = true;
  res.listPrefix = "containing ";
  res.listSuffix = "";
  
  res.getVerbs = function() {
    var arr = ['Examine'];
    if (this.takable) {
      arr.push(this.loc === game.player.name ? 'Drop' : 'Take');
    }
    arr.push(this.closed ? 'Open' : 'Close');
    return arr;
  },

  res.byname = function(def, modified) {
    var prefix = "";
    if (def === "the") {
      prefix = _itemThe(this);
    }
    if (def === "a") {
      prefix = _itemA(this);
    }
    var contents = this.getContents();
    if (contents.length === 0 || !modified) {
      return prefix + this.alias
    }
    else {
      return prefix + this.alias + " (" + this.listPrefix + formatList(contents, {def:"a", lastJoiner:" and", modified:true, nothing:"nothing"}) + this.listSuffix + ")";
    }
  };
  
  res.getContents = function() {
    return scope(isInside, {container:this});
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
  
  // Does this
  res.isBlocking = function(visible) {
    if (!this.closed) { return false; }
    if (!visible) { return true; }
    return !this.transparent;
  }

  return res;
};


const SURFACE = function() {
  var res = {};
  res.container = true;
  res.listPrefix = "holding ";
  res.listSuffix = "";
  res.byname = CONTAINER().byname;
  res.getContents = CONTAINER().getContents;
  res.listPrefix = "with ";
  res.listSuffix = " on it";
  return res;
}


const OPENABLE = function(alreadyOpen) {
  var res = {};
  res.container = true;
  res.closed = !alreadyOpen;
  res.openable = true;
  res.listPrefix = "containing ";
  res.listSuffix = "";
  
  res.getVerbs = function() {
    var arr = ['Examine'];
    if (this.takable) {
      arr.push(this.loc === game.player.name ? 'Drop' : 'Take');
    }
    arr.push(this.closed ? 'Open' : 'Close');
    return arr;
  },

  res.byname = function(def, modified) {
    var s = "";
    if (def === "the") {
      s = _itemThe(this);
    }
    if (def === "a") {
      s = _itemA(this);
    }
    s += this.alias;
    if (!this.closed && modified) { s += " (open)"; }
    return s;
  };
  res.open = CONTAINER().open;
  res.close = CONTAINER().close;
  return res;
}


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
        if (w[keyNames[i]].loc === char.name) { 
          return true; 
        }
      }
      return false;
    }
  };
  return res;
}


const SWITCHABLE = function(alreadyOn) {
  var res = {};
  res.switchedon = alreadyOn;
  
  res.getVerbs = function() {
    var arr = ['Examine'];
    if (this.takable) {
      arr.push(this.loc === game.player.name ? 'Drop' : 'Take');
    }
    arr.push(this.switchedon ? 'Turn off' : 'Turn on');
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
  };
  res.doSwitchon = function() {
    var lighting = game.dark;
    this.switchedon = true;
    game.update();
    if (lighting !== game.dark) {
      game.room.description();
    }
    return true;
  };
  res.checkCanSwitchOn = function() { return true; }
  
  res.switchoff = function(isMultiple, char) {
    if (!this.switchedon) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(char, this));
      return false;
    }
    msg(CMD_TURN_OFF_SUCCESSFUL(char, this));
    this.doSwitchoff();
  };
  res.doSwitchoff = function() {
    var lighting = game.dark;
    this.switchedon = false;
    game.update();
    if (lighting !== game.dark) {
      game.room.description();
    }
    return true;
  };

  return res;
};


const PLAYER = {
  pronouns:PRONOUNS.secondperson,
  display:DSPY_SCENERY,
  player:true,
}

const TURNSCRIPT = function(isRunning, fn) {
  var res = {
    display:DSPY_HIDDEN,
    runTurnscript:function() { return this.isRunning; },
    isRunning:isRunning,
    turnscript:fn,
  }
  return res;
};



const NPC = function(isFemale) {
  var res = {
    npc:true,
    pronouns:isFemale ? PRONOUNS.female : PRONOUNS.male,
    speaktoCount:0,
    askoptions:[],
    telloptions:[],
    
    getVerbs:function() {
      return ['Look at', 'Talk to'];
    },
    
    icon:function() {
      return ('<img src="images/npc12.png" />');
    },
  };

  res.getAgreement = function(cmd, item) {
    return true;
  };

  //res.getContents = CONTAINER.getContents;
  res.getContents = function() {
    return scope(isInside, {container:this});
  };

  res.getHolding = function() {
    return this.getContents().filter(function(el) { return !el.worn; });
  };
  
  res.getWearing = function() {
    return this.getContents().filter(function(el) { return el.worn; });
  };
  
  
  res.byname = function(def, modified) {
    var s = this.alias;
    if (def === "the") {
      s = _itemThe(this) + this.alias;
    }
    if (def === "a") {
      s = _itemA(this) + this.alias;
    }
    if (this.getContents().length === 0 || !modified) {
      return s;
    }
    if (this.getHolding().length === 0 || !modified) {
      return s + " (wearing " + formatList(this.getWearing(), {def:"a", lastJoiner:" and", modified:true, nothing:"nothing"}) + ")";
    }
    if (this.getWearing().length === 0 || !modified) {
      return s + " (holding " + formatList(this.getHolding(), {def:"a", lastJoiner:" and", modified:true, nothing:"nothing"}) + ")";
    }
    s += " (holding " + formatList(this.getHolding(), {def:"a", lastJoiner:" and", modified:true, nothing:"nothing"}) + ", and ";
    s += " wearing " + formatList(this.getWearing(), {def:"a", lastJoiner:" and", modified:true, nothing:"nothing"}) + ")";
    return s;
  };
  
  res.askabout = function(text) {
    if (checkCannotSpeak(this)) {
      return false;
    }
    msg("You ask " + this.name + " about " + text + ".");
    for (var i = 0; i < this.askoptions.length; i++) {
      if (this.askoptions[i].regex.test(text)) {
        printOrRun(game.player, this, this.askoptions[i].response);
        return true;
      }
    }
    msg(nounVerb(this, "have", true) + " nothing to say on the subject.");
    return false;
  };
  res.tellabout = function(text) {
    if (checkCannotSpeak(this)) {
      return false;
    }
    msg("You tell " + this.name + " about " + text + ".");
    for (var i = 0; i < this.telloptions.length; i++) {
      if (this.telloptions[i].regex.test(text)) {
        printOrRun(game.player, this, this.telloptions[i].response);
        return true;
      }
    }
    msg(nounVerb(this, "have", true) + " no interest in that subject.");
    return false;
  };

  res.speakto = function() {
    if (checkCannotSpeak(this)) {
      return false;
    }
    var topics = scope(isInside, {container:this}).filter(el => el.isTopicVisible());
    topics.push(NEVER_MIND);
    showMenu("Talk to " + this.byname("the") + " about:", topics, function(result) {
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
      this.script();
      this.hideTopic = this.hideAfter;
      for (var i = 0; i < this.nowShow.length; i++) {
        var obj = w[this.nowShow[i]];
        obj.showTopic = true;
      };
      for (var i = 0; i < this.nowHide.length; i++) {
        var obj = w[this.nowHide[i]];
        obj.hideTopic = true;
      };
    },
    isTopicVisible:function() {
      return this.showTopic && !this.hideTopic;
    }
  };
  return res;
};