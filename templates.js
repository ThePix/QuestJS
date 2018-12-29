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
      printOrRun(this, "darkDesc");
      return true;
    }
    for (var i = 0; i < ROOM_TEMPLATE.length; i++) {
      if (ROOM_TEMPLATE[i] == "%") {
        printOrRun(this, "desc");
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

  icon:function() {
    return "";
  },
  
  getVerbs:function() {
    return ['Examine'];
  },
  
  drop:function(isMultiple) {
    msg(prefix(this, isMultiple) + CMD_NOT_CARRYING(this));
    return false;
  },
  
  take:function(isMultiple) {
    msg(prefix(this, isMultiple) + CMD_CANNOT_TAKE(this));
    return false;
  },

  wear:function(isMultiple) {
    msg(prefix(this, isMultiple) + CMD_CANNOT_WEAR(this));
    return false;
  },
  
  remove:function(isMultiple) {
    msg(prefix(this, isMultiple) + CMD_NOT_WEARING(this));
    return false;
  },
  
  open:function(isMultiple) {
    msg(prefix(this, isMultiple) + CMD_CANNOT_OPEN(this));
    return false;
  },

  close:function(isMultiple) {
    msg(prefix(this, isMultiple) + CMD_CANNOT_CLOSE(this));
    return false;
  },
  
  lock:function() {
    msg(prefix(this, isMultiple) + CMD_CANNOT_LOCK(this));
    return false;
  }
  unlock:function() {
    msg(prefix(this, isMultiple) + CMD_CANNOT_UNLOCK(this));
    return false;
  }

    read:function(isMultiple) {
    msg(prefix(this, isMultiple) + CMD_CANNOT_READ(this));
    return false;
  },
  
  eat:function(isMultiple) {
    msg(prefix(this, isMultiple) + CMD_CANNOT_EAT(this));
    return false;
  },
  
  askabout:function(text) {
    msg("You can ask " + this.pronouns.objective + " about " + text + " all you like, but " + pronounVerb(this, "'be") + " not about to reply.");
    return false;
  },
  
  speakto:function() {
    msg("You chat to " + this.byname("the") + " for a few moments, before releasing that " + pronounVerb(this, "'be") + " not about to reply");
    return false;
  },
  
};


const TAKABLE_DICTIONARY = {
  getVerbs:function() {
    if (this.loc == game.player.name) {
      return ['Examine', 'Drop'];
    }
    else {
      return ['Examine', 'Take'];
    }
  },

  takable:true,
  
  drop:function(isMultiple) {
    if (this.worn) {
      msg(prefix(this, isMultiple) + CMD_WEARING(this));
      return false;
    };
    if (this.loc != game.player.name) {
      msg(prefix(this, isMultiple) + CMD_NOT_CARRYING(this));
      return false;
    };
    msg(prefix(this, isMultiple) + CMD_DROP_SUCCESSFUL(this));
    this.loc = w[game.player.loc].name;
    updateUIItems();
    return true;
  },
  
  take:function(isMultiple) {
    if (!isReachable(this)) {
      msg(prefix(this, isMultiple) + CMD_NOT_HERE(this));
      return false;
    };
    if (!this.takable) {
      msg(prefix(this, isMultiple) + CMD_CANNOT_TAKE(this));
      return false;
    };
    if (this.loc == game.player.name) {
      msg(prefix(this, isMultiple) + CMD_ALREADY_HAVE(this));
      return false;
    };   
    msg(prefix(this, isMultiple) + CMD_TAKE_SUCCESSFUL(this));
    this.loc = game.player.name;
    if (this.display == DSPY_SCENERY) {
      this.display = DSPY_DISPLAY;
    }
    updateUIItems();
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
    if (this.loc == game.player.name) {
      return this.worn ? ['Examine', 'Remove'] : ['Examine', 'Drop', 'Wear'];
    }
    else {
      return ['Examine', 'Take'];
    }
  },

  res.icon = function() {
    return ('<img src="images/garment12.png" />');
  };
  
  res.wear = function(isMultiple) {
    if (!isVisible(this)) {
      msg(prefix(this, isMultiple) + CMD_NOT_HERE(this));
      //return false;
    }
    if (!this.takable) {
      msg(prefix(this, isMultiple) + CMD_CANNOT_TAKE(this));
      return false;
    }
    if (this.worn) {
      msg(prefix(this, isMultiple) + CMD_ALREADY_WEARING(this));
      return false;
    }
    if (this.loc != game.player.name) {
      msg(prefix(this, isMultiple) + CMD_NOT_CARRYING(this));
      return false;
    }
    msg(prefix(this, isMultiple) + CMD_WEAR_SUCCESSFUL(this));
    this.loc = game.player.name;
    this.worn = true;
    updateUIItems();
    return true;
  };
  
  res.remove = function(isMultiple) {
    if (!this.worn) {
      msg(prefix(this, isMultiple) + CMD_NOT_WEARING(this));
      return false;
    }
    msg(prefix(this, isMultiple) + CMD_REMOVE_SUCCESSFUL(this));
    this.loc = game.player.name;
    this.worn = false;
    updateUIItems();
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
      arr.push(this.loc == game.player.name ? 'Drop' : 'Take');
    }
    arr.push(this.closed ? 'Open' : 'Close');
    return arr;
  },

  res.byname = function(def, modified) {
    var prefix = "";
    if (def == "the") {
      prefix = _itemThe(this);
    }
    if (def == "a") {
      prefix = _itemA(this);
    }
    var contents = this.getContents();
    if (contents.length == 0 || !modified) {
      return this.alias
    }
    else {
      return prefix + this.alias + " (" + this.listPrefix + formatList(contents, {def:"a", joiner:" and", modified:true, nothing:"nothing"}) + this.listSuffix + ")";
    }
  };
  
  res.getContents = function() {
    return scope(isInside, {container:this});
  };
  
  res.open = function(isMultiple) {
    if (!this.openable) {
      msg(prefix(this, isMultiple) + CMD_CANNOT_OPEN(this));
      return false;
    }
    else if (!this.closed) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(this));
      return false;
    }
    if (this.locked) {
      msg(prefix(this, isMultiple) + CMD_LOCKED(this));
      return false;
    }
    this.closed = false;
    msg(prefix(this, isMultiple) + CMD_OPEN_SUCCESSFUL(this));
    return true;
  };
  
  res.close = function(isMultiple) {
    if (!this.openable) {
      msg(prefix(this, isMultiple) + CMD_CANNOT_CLOSE(this));
      return false;
    }
    else if (this.closed) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(this));
      return false;
    }
    this.hereVerbs = ['Examine', 'Open'];
    this.closed = true;
    msg(prefix(this, isMultiple) + CMD_CLOSE_SUCCESSFUL(this));
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
      arr.push(this.loc == game.player.name ? 'Drop' : 'Take');
    }
    arr.push(this.closed ? 'Open' : 'Close');
    return arr;
  },

  res.byname = function(def, modified) {
    var s = "";
    if (def == "the") {
      s = _itemThe(this);
    }
    if (def == "a") {
      s = _itemA(this);
    }
    s += this.alias;
    if (!closed && modified) { s += " (open)"; }
    return s;
  };
  res.open = CONTAINER().open;
  res.close = CONTAINER().close;
  return res;
}


const LOCKED_WITH = function(keyNames) {
  if (typeof keyNames == "string") { keyNames = [keyNames];
  if (keyNames == undefined) { keyNames = [];
  var res = {
    keyNames:keynames,
    locked:true,
    lock:function() {
      
    }
    unlock:function() {
      
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
      arr.push(this.loc == game.player.name ? 'Drop' : 'Take');
    }
    arr.push(this.switchedon ? 'Turn off' : 'Turn on');
    return arr;
  };

  res.switchon = function(isMultiple) {
    if (this.switchedon) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(this));
      return false;
    }
    msg(CMD_TURN_ON_SUCCESSFUL(this));
    this.doSwitchon();
  };
  res.doSwitchon = function() {
    var lighting = game.dark;
    this.switchedon = true;
    game.update();
    if (lighting != game.dark) {
      game.room.description();
    }
    return true;
  };
  
  res.switchoff = function(isMultiple) {
    if (!this.switchedon) {
      msg(prefix(this, isMultiple) + CMD_ALREADY(this));
      return false;
    }
    msg(CMD_TURN_OFF_SUCCESSFUL(this));
    this.doSwitchoff();
  };
  res.doSwitchoff = function() {
    var lighting = game.dark;
    this.switchedon = false;
    game.update();
    if (lighting != game.dark) {
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
    pronouns:isFemale ? PRONOUNS.female : PRONOUNS.male,
    
    getVerbs:function() {
      return ['Look at', 'Talk to'];
    },
    
    icon:function() {
      return ('<img src="images/npc12.png" />');
    },
  };
  res.askabout = function(text) {
    if (checkCannotSpeak(this)) {
      return false;
    }
    msg("You ask " + this.name + " about " + text + ".");
    if (this.askoptions[text]) {
      printOrRun(this.askoptions, text);
      return true;
    }
    else {
      msg(nounVerb(this, "have", true) + " nothing to say on the subject.");
      return false;
    }
  };
  res.speakto = function() {
    debugmsg(0, "HERE-----------------");
    if (checkCannotSpeak(this)) {
      return false;
    }
    var topics = scope(isInside, {container:this}).filter(el => el.isTopicVisible());
    //for (var i = 0; i < topics.length; i++) {
    //  debugmsg(0, topics[i].name + " - " + topics[i].conversationTopic);
    //}
    debugmsg(0, "HERE " + topics.length);
    topics.push(NEVER_MIND);
    showMenu("Talk to " + this.byname("the") + " about:", topics, function(result) {
      if (result != NEVER_MIND) {
        result.runscript();
      }
    });
    
    return false;
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