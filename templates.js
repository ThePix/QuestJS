"use strict";

const DEFAULT_ROOM = {
  beforeEnter:function() {},
  beforeEnterFirst:function() {},
  afterEnter:function() {},
  afterEnterFirst:function() {},
  onExit:function() {},
  visited:0,
  
  description:function() {
    for (var i = 0; i < ROOM_TEMPLATE.length; i++) {
      if (ROOM_TEMPLATE[i] == "%") {
        printOrRun(this, "desc");
      }
      else {
        msg(ROOM_TEMPLATE[i]);
      }
    }
    return true;
  }
};


const DEFAULT_ITEM = {
  display:DSPY_DISPLAY,
  
  hereVerbs:['Examine'],
  
  pronouns:PRONOUNS.thirdperson,

  icon:function() {
    return "";
  },
  
  drop:function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_NOT_CARRYING(item));
    return false;
  },
  
  take:function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_CANNOT_TAKE(item));
    return false;
  },

  wear:function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_CANNOT_WEAR(item));
    return false;
  },
  
  remove:function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_NOT_WEARING(item));
    return false;
  },
  
  open:function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_CANNOT_OPEN(item));
    return false;
  },

  close:function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_CANNOT_CLOSE(item));
    return false;
  },
  
  read:function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_CANNOT_READ(item));
    return false;
  },
  
  eat:function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_CANNOT_EAT(item));
    return false;
  },
  
  askabout:function(text) {
    msg("You can ask " + this.pronouns.objective + " about " + text + " all you like, but " + pronounVerb(this, "'be") + " not about to reply.");
    return false;
  },
  
  speakto:function(item) {
    msg("You chat to " + item.byname("the") + " for a few moments, before releasing that " + pronounVerb(this, "'be") + " not about to reply");
    return false;
  },
  
  // Used in speak to
  isTopicVisible:function() {
    return false;
  },
  
  lighting:function() {
    return LIGHT_NONE;
  }
};


const TAKABLE = {
  heldVerbs:['Examine', 'Drop'],
  
  hereVerbs:['Examine', 'Take'],
  
  takable:true,
  
  drop:function(item, isMultiple) {
    if (item.worn) {
      msg(prefix(item, isMultiple) + CMD_WEARING(item));
      return false;
    }
    if (item.loc != player.name) {
      msg(prefix(item, isMultiple) + CMD_NOT_CARRYING(item));
      return false;
    }
    msg(prefix(item, isMultiple) + CMD_DROP_SUCCESSFUL(item));
    item.loc = getObject(player.loc).name;
    updateUIItems();
    return true;
  },
  
  take:function(item, isMultiple) {
    if (!isPresent(item)) {
      msg(prefix(item, isMultiple) + CMD_NOT_HERE(item));
      return false;
    }
    if (!item.takable) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_TAKE(item));
      return false;
    }
    if (item.loc == player.name) {
      msg(prefix(item, isMultiple) + CMD_ALREADY_HAVE(item));
      return false;
    }      
    msg(prefix(item, isMultiple) + CMD_TAKE_SUCCESSFUL(item));
    item.loc = player.name;
    updateUIItems();
    return true;
  },
};


const WEARABLE = {
  heldVerbs:['Examine', 'Drop', 'Wear'],
  
  wornVerbs:['Examine', 'Remove'],
  
  wearable:true,
  
  icon:function() {
    return ('<img src="images/garment12.png" />');
  },
  
  wear:function(item, isMultiple) {
    if (!isPresent(item)) {
      msg(prefix(item, isMultiple) + CMD_NOT_HERE(item));
      return false;
    }
    if (!item.takable) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_TAKE(item));
      return false;
    }
    if (item.worn) {
      msg(prefix(item, isMultiple) + CMD_ALREADY_WEARING(item.pronoun.subjective));
      return false;
    }
    if (item.loc != player.name) {
      msg(prefix(item, isMultiple) + CMD_NOT_CARRYING(item));
      return false;
    }
    msg(prefix(item, isMultiple) + CMD_WEAR_SUCCESSFUL(item));
    item.loc = player.name;
    item.worn = true;
    updateUIItems();
    return true;
  },
  
  remove:function(item, isMultiple) {
    if (!item.worn) {
      msg(prefix(item, isMultiple) + CMD_NOT_WEARING(item));
      return false;
    }
    msg(prefix(item, isMultiple) + CMD_REMOVE_SUCCESSFUL(item));
    item.loc = player.name;
    item.worn = false;
    updateUIItems();
    return true;
  },
};


const CONTAINER = {
  hereVerbs:['Examine', 'Open'],
  container:true,
  closed:true,
  openable:true,
  listPrefix:"containing ",
  listSuffix:"",
  
  byname:function(def) {
    var prefix = "";
    if (def == "the") {
      prefix = _itemThe(this);
    }
    if (def == "a") {
      prefix = _itemA(this);
    }
    var contents = this.getContents();
    if (contents.length == 0) {
      return this.alias
    }
    else {
      return prefix + this.alias + " (" + this.listPrefix + formatList(contents, "a") + this.listSuffix + ")";
    }
  },
  
  getContents:function() {
    return scope(isInside, this);
  },
  
  open:function(item, isMultiple) {
    if (!item.openable) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_OPEN(item));
      return false;
    }
    else if (!item.closed) {
      msg(prefix(item, isMultiple) + CMD_ALREADY(item));
      return false;
    }
    if (item.locked) {
      msg(prefix(item, isMultiple) + CMD_LOCKED(item));
      return false;
    }
    item.hereVerbs = ['Examine', 'Close'];
    item.closed = false;
    msg(prefix(item, isMultiple) + CMD_OPEN_SUCCESSFUL(item));
    return true;
  },
  
  close:function(item, isMultiple) {
    if (!item.openable) {
      msg(prefix(item, isMultiple) + CMD_CANNOT_CLOSE(item));
      return false;
    }
    else if (item.closed) {
      msg(prefix(item, isMultiple) + CMD_ALREADY(item));
      return false;
    }
    item.hereVerbs = ['Examine', 'Open'];
    item.closed = true;
    msg(prefix(item, isMultiple) + CMD_CLOSE_SUCCESSFUL(item));
    return true;
  },
  
  icon:function() {
    return ('<img src="images/' + (this.closed ? 'closed' : 'opened') + '12.png" />');
  },
};



const SWITCHABLE = {
  hereVerbs:['Examine', 'Turn on'],
  switchedon:false,
  
  switchon:function(item, isMultiple) {
    if (item.switchedon) {
      msg(prefix(item, isMultiple) + CMD_ALREADY(item));
      return false;
    }
    msg('You turn the ' + item.name + ' on.');
    item.switchedon = true;
    item.hereVerbs = ['Examine', 'Turn off'];
    return true;
  },
  
  switchoff:function(item, isMultiple) {
    if (!item.switchedon) {
      msg(prefix(item, isMultiple) + CMD_ALREADY(item));
      return false;
    }
    msg('You turn the ' + item.name + ' off.');
    item.switchedon = false;
    item.hereVerbs = ['Examine', 'Turn on'];
    return true;
  },
};


const PLAYER = {
  pronouns:PRONOUNS.secondperson,
  display:DSPY_SCENERY,
  player:true,
}

const TURNSCRIPT = function(isRunning, fn) {
  var res = {
    display:DSPY_HIDDEN,
  }
  res.runTurnscript = isRunning;
  res.turnscript = fn;
  return res;
};



const NPC_OBJECT = function(isFemale) {
  var res = {
    hereVerbs:['Look at', 'Talk to'],
    icon:function() {
      return ('<img src="images/npc12.png" />');
    },
  };
  res.pronouns = isFemale ? PRONOUNS.female : PRONOUNS.male;
  res.askabout = function(text) {
    if (checkCannotSpeak(item)) {
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
    var topics = scope(isInside, this).filter(el => el.isTopicVisible());
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
        var obj = getObject(this.nowShow[i]);
        obj.showTopic = true;
      };
      for (var i = 0; i < this.nowHide.length; i++) {
        var obj = getObject(this.nowHide[i]);
        obj.hideTopic = true;
      };
    },
    isTopicVisible:function() {
      return this.showTopic && !this.hideTopic;
    }
  };
  return res;
};