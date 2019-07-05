"use strict";

// Should all be language neutral



const NPC = function(isFemale) {
  // A whole bunch of defaults are the same as the player
  const res = PLAYER();
  
  // These from the player need adjusting
  res.player = undefined;
  res.npc = true;
  res.pronouns = isFemale ? PRONOUNS.female : PRONOUNS.male;
  
  res.talktoCount = 0;
  res.askoptions = [];
  res.telloptions = [];
  res.agenda = [];
  res.followers = [];
  res.excludeFromAll = true;
  res.reactions = NULL_FUNC;
  res.display = DSPY_DISPLAY;
  res.canReachThrough = () => false;
  res.suspended = false;
  res.runTurnscript = () => true;
  res.getVerbs = () => [VERBS.lookat, VERBS.talkto];
  res.icon = () => '<img src="images/npc12.png" />';
  
  res.heading = function(dir) {
    return NPC_HEADING(this, dir);
  };

  res.getHolding = function() {
    return this.getContents(true).filter(function(el) { return !el.worn; });
  };
  
  res.getWearing = function() {
    return this.getContents(true).filter(function(el) { return el.worn; });
  };
  
  // This does not work properly, it just gets all clothing!!!
  res.getWearingVisible = function() {
    return this.getContents(true).filter(function(el) { return el.worn; });
  };
  
  res.getTopics = npc_utilities.getTopics;
  
  res.isHere = function() {
    return this.isAtLoc(game.player.loc);
  }
  
  res.msg = function(s) {
    if (this.isHere()) msg(s);
  }
  
  res.byname = function(options) {
    if (options === undefined) options = {};
    if (options.group && this.followers.length > 0) {
      options.group = false;
      options.lastJoiner = LIST_AND;
      this.followers.unshift(this);
      const s = formatList(this.followers, options);
      this.followers.shift();
      return s;
    }
    
    let s = this.alias;
    if (options.article === DEFINITE) {
      s = addDefiniteArticle(this) + this.alias;
    }
    if (options.article === INDEFINITE) {
      s = addIndefiniteArticle(this) + this.alias;
    }
    //debugmsg(this.getContents()[0].name);
    if (this.getContents().length === 0 || !options.modified) {
      return s;
    }
    if (this.getHolding().length === 0) {
      return s + " (wearing " + formatList(this.getWearing(), {article:INDEFINITE, lastJoiner:LIST_AND, modified:true, nothing:LIST_NOTHING, loc:this.name}) + ")";
    }
    if (this.getWearingVisible().length === 0) {
      return s + " (holding " + formatList(this.getHolding(), {article:INDEFINITE, lastJoiner:LIST_AND, modified:true, nothing:LIST_NOTHING, loc:this.name}) + ")";
    }
    s += " (holding " + formatList(this.getHolding(), {article:INDEFINITE, lastJoiner:LIST_AND, nothing:LIST_NOTHING, loc:this.name}) + ", and ";
    s += "wearing " + formatList(this.getWearing(), {article:INDEFINITE, lastJoiner:LIST_AND, nothing:LIST_NOTHING, loc:this.name}) + ")";
    return s;
  };
  
  res.templatePreSave = function() {
    if (this.agenda) this.customSaveAgenda = this.agenda.join("^");
    this.preSave();
  };

  res.templatePostLoad = function() {
    if (this.customSaveAgenda) this.agenda = this.customSaveAgenda.split("^");
    delete this.customSaveAgenda;
    if (this.leaderName) w[this.leaderName].followers.push(this);
    this.postLoad();
  };
  
  
  res.setLeader = function(npc) {
    this.leaderName = npc.name;
    npc.followers.push(this);
  }
  
  res.pause = function() {
    //debugmsg("pausing " + this.name);
    if (this.leaderName) {
      w[this.leaderName].pause();
    }
    else {
      this.paused = true;
    }
  };
  
  res.doEvent = function() {
    if (this.isHere()) {
      if (typeof this.reactions === "function") {
        this.reactions();
      }
      else {
        for (let key in this.reactions) {
          console.log("key:" + key);
          if (this.reactionFlags.split(" ").includes(key)) continue;
          if (this.reactions[key].test()) {
            this.reactions[key].action();
            this.reactionFlags += " " + key;
            if (this.reactions[key].override) this.reactionFlags += " " + this.reactions[key].override;
            console.log("this.reactionFlags:" + this.reactionFlags);
          }
          
        }
      }
    }
    if (this.paused || this.suspended || this.agenda.length === 0) return;

    // If this NPC has followers, we fake it so it seems to be the group
    if (this.followers.length !== 0) {
      this.savedPronouns = this.pronouns;
      this.savedAlias = this.alias
      this.pronouns = PRONOUNS.plural;
      this.followers.unshift(this);
      this.alias = formatList(this.followers, {lastJoiner:LIST_AND});
      this.followers.shift();
    }

    const arr = this.agenda[0].split(":");
    const fn = arr.shift();
    if (typeof agenda[fn] !== "function") {
      errormsg("Unknown function `" + fn + "' in agenda for " + this.name);
      return;
    }
    const flag = agenda[fn](this, arr);
    if (flag) this.agenda.shift();
    
    // If we are faking the group, reset
    if (this.savedPronouns) {
      this.pronouns = this.savedPronouns;
      this.alias = this.savedAlias
      delete this.savedPronouns;
    }
  };

  // Use this to move the NPC to tell the player
  // it is happening - if the player is somewhere that it can be seen
  res.moveWithDescription = function(dest) {
    if (typeof dest === "object") dest = dest.name;
    const origin = this.loc;

    npcLeavingMsg(this, dest);
    
    // Move NPC (and followers)
    this.loc = dest;
    for (let i = 0; i < this.followers.length; i++) this.followers[i].loc = dest;
    
    npcEnteringMsg(this, origin);
  };
  
  
  res.getOuterWearable = world.getOuterWearable;
  

  res.askabout = function(text) {
    if (!game.player.canTalk(this)) {
      return false;
    }
    if (NO_ASK_TELL !== false) {
      metamsg(NO_ASK_TELL);
      return false;
    }
    msg(ASK_ABOUT_INTRO(this, text));
    for (let i = 0; i < this.askoptions.length; i++) {
      if (this.askoptions[i].regex.test(text)) {
        if (typeof this.askoptions[i].response === "function") {
          this.askoptions[i].response(this);
        }
        else {
          msg(this.askoptions[i].response);
        }
        this.pause();
        return true;
      }
    }
    msg(NPC_NOTHING_TO_SAY_ABOUT(this));
    return false;
  };
  res.tellabout = function(text) {
    if (!game.player.canTalk(this)) {
      return false;
    }
    if (NO_ASK_TELL !== false) {
      metamsg(NO_ASK_TELL);
      return false;
    }
    msg(TELL_ABOUT_INTRO(this, text));
    for (let i = 0; i < this.telloptions.length; i++) {
      if (this.telloptions[i].regex.test(text)) {
        if (typeof this.askoptions[i].response === "function") {
          this.askoptions[i].response(this);
        }
        else {
          msg(this.askoptions[i].response);
        }
        this.pause();
        return true;
      }
    }
    msg(NPC_NO_INTEREST_IN(this));
    return false;
  };

  res.talkto = npc_utilities.talkto;
  
  res.topics = function() {
    if (this.askoptions.length === 0 && this.telloptions.length === 0) {
      metamsg("This character has no ASK/ABOUT or TELL/ABOUT options set up.");
    }
    let flag = false;
    let arr = [];
    for (let i = 0; i < this.askoptions.length; i++) {
      if (this.askoptions[i].name !== undefined) {
        arr.push(this.askoptions[i].name);
      }
    }
    if (arr.length !== 0) {
      metamsg("Some suggestions for what to ask " + this.byname({article:DEFINITE}) + " about: " + arr.sort().join("; ") + ".");
      flag = true;
    }

    arr = [];
    for (let i = 0; i < this.telloptions.length; i++) {
      if (this.telloptions[i].name !== undefined) {
        arr.push(this.telloptions[i].name);
      }
    }
    if (arr.length === 0 && !flag) {
      metamsg("No suggestions for what to ask or tell " + this.byname({article:DEFINITE}) + " available.");
    }
    else if (arr.length !== 0) {
      metamsg("Some suggestions for what to tell " + this.byname({article:DEFINITE}) + " about: " + arr.sort().join("; ") + " (other topics may also be available).");
    }
    return SUPPRESS_ENDTURN;
  }    
  
  return res;
};



const npc_utilities = {
  talkto:function() {
    if (!game.player.canTalk(this)) {
      return false;
    }
    if (NO_TALK_TO !== false) {
      metamsg(NO_TALK_TO);
      return false;
    }
    
    const topics = this.getTopics(this);
    
    topics.push(NEVER_MIND);
    if (USE_DROPDOWN_FOR_CONV) {
      showDropDown(SPEAK_TO_MENU_TITLE(this), topics, function(result) {
        if (result !== NEVER_MIND) {
          result.runscript();
        }
      });
    }
    else {
      showMenu(SPEAK_TO_MENU_TITLE(this), topics, function(result) {
        if (result !== NEVER_MIND) {
          result.runscript();
        }
      });
    }
    
    return SUPPRESS_ENDTURN;
  },
  
  getTopics:function() {
    const list = [];
    for (let key in w) {
      if (w[key].isAtLoc(this.name) && w[key].isTopicVisible()) {
        list.push(w[key]);
      }
    }
    return list;
  },
 
}



const agenda = {
  // print the array as text if the player is here
  // otherwise this will be skipped
  // Used by several other functions, so this applies to them too
  text:function(npc, arr) {
    if (typeof npc[arr[0]] === "function") {
      const fn = arr.shift();
      const res = npc[fn](arr);
      return (typeof res === "boolean" ? res : true);
    }
    
    if (npc.here()) {
      for (let i = 0; i < arr.length; i++) {
        msg(arr[i]);
      }
    }
    return true;
  },
  
  // sets one attribute on the given item
  // it will guess if Boolean, integer or string
  setItemAtt:function(npc, arr) {
    //debugmsg("Setting item att...");
    const item = arr.shift();
    const att = arr.shift();
    const value = arr.shift();
    if (!w[item]) errormsg("Item '" + item + "' not recognised in the agenda of " + npc.name);
    if (value === "true") value = true;
    if (value === "false") value = false;
    if (/^\d+$/.test(value)) parseInt(value);
    w[item][att] = value;
    this.text(npc, arr);
    return true;
  },

  // Wait n turns
  wait:function(npc, arr) {
    if (arr.length === 0) return true;
    if (isNaN(arr[0])) errormsg("Expected wait to be given a number in the agenda of '" + npc.name + "'");
    const count = parseInt(arr.shift());
    if (npc.agendaWaitCounter !== undefined) {
      npc.agendaWaitCounter++;
      if (npc.agendaWaitCounter >= count) {
        this.text(npc, arr);
        return true;
      }
      return false;
    }
    npc.agendaWaitCounter = 1;
    return false;
  },

  // Wait until ...
  // This may be repeated any number of times
  waitFor:function(npc, arr) {
    let name = arr.shift();
    if (typeof npc[name] === "function") {
      if (npc[name](arr)) {
        return true;
      }
      else {
        return false;;
      }
    }
    else {
      if (name === "player") name = game.player.name;
      if (npc.here()) {
        this.text(npc, arr);
        return true;
      }
      else {
        return false;;
      }
    }
  },
  
  joinedBy:function(npc, arr) {
    const followerName = arr.shift();
    w[followerName].setLeader(npc);
    this.text(npc, arr);
    return true;
  },
  
  joining:function(npc, arr) {
    const leaderName = arr.shift();
    npc.setLeader(w[followerName]);
    this.text(npc, arr);
    return true;
  },
  
  disband:function(npc, arr) {
    for (let i = 0; i < npc.followers.length; i++) {
      delete npc.followers[i].leader;
    }
    npc.followers = [];
    this.text(npc, arr);
    return true;
  },
  
  // Move the given item directly to the given location, then print the rest of the array as text
  // Do not use for items with a funny location, such as COUNTABLES
  moveItem:function(npc, arr) {
    //debugmsg("Moving item...");
    const item = arr.shift();
    const dest = arr.shift();
    //debugmsg("dest:" + dest);
    if (!w[item]) errormsg("Item '" + item + "' was not recognised in the agenda of " + npc.name);
    if (!w[dest]) errormsg("Location '" + dest + "' was not recognised in the agenda of " + npc.name);
    item.moveToFrom(dest, item.loc);
    this.text(npc, arr);
    return true;
  },

  // Move directly to the given location, then print the rest of the array as text
  // Use "player" to go directly to the room the player is in.
  // Use an item (i.e., an object not flagged as a room) to have the NPC move
  // to the room containing the item.
  moveTo:function(npc, arr) {
    //debugmsg("Moving...");
    const dest = arr.shift();
    //debugmsg("dest:" + dest);
    if (dest === "player") dest = game.player.loc;
    if (!w[dest]) debugmsg("Location '" + dest + "' not recognised in the agenda of " + npc.name);
    if (!w[dest].room) dest = dest.loc;
    if (!w[dest]) errormsg("Location '" + dest + "' not recognized in the agenda of " + npc.name);
    npc.moveWithDescription(dest);
    this.text(npc, arr);
    return true;
  },
  
  patrol:function(npc, arr) {
    if (npc.patrolCounter === undefined) npc.patrolCounter = -1;
    npc.patrolCounter = (npc.patrolCounter + 1) % arr.length;
    this.moveTo(npc, [arr[npc.patrolCounter]]);
    return false;
  },

  // Move to another room via a random, unlocked exit, then print the rest of the array as text
  walkRandom:function(npc, arr) {
    //debugmsg("Moving random...");
    const exit = w[npc.loc].getRandomExit(true);
    if (exit === null) {
      this.text(npc, arr);
      return true;
    }
    if (!w[exit.name]) errormsg("Location '" + exit.name + "' not recognised in the agenda of " + npc.name);
    npc.moveWithDescription(exit.name);
    return false;
  },

  // Move to the given location, using available, unlocked exits, one room per turn
  // then print the rest of the array as text
  // Use "player" to go to the room the player is in (if the player moves, the NPC will head
  // to the new position, but will be omniscient!).
  // Use an item (i.e., an object not flagged as a room) to have the NPC move
  // to the room containing the item.
  // This may be repeated any number of turns
  walkTo:function(npc, arr) {
    //debugmsg("Walking...");
    let dest = arr.shift();
    //debugmsg("dest:" + dest);
    if (dest === "player") dest = game.player.loc;
    if (w[dest] === undefined) {
      errormsg("Location '" + dest + "' not recognised in the agenda of " + npc.name);
      return true;
    }
    if (!w[dest].room) {
      dest = w[dest].loc;
      if (w[dest] === undefined) {
        errormsg("Object location '" + dest + "' not recognised in the agenda of " + npc.name);
        return true;
      }
    }
    if (npc.isAtLoc(dest)) {
      this.text(npc, arr);
      return true;
    }
    else {
      const route = agenda.findPath(w[npc.loc], w[dest]);
      if (!route) errormsg("Location '" + dest + "' not reachable in the agenda of " + npc.name);
      //debugmsg(formatList(route));
      npc.moveWithDescription(route[0]);
      if (npc.isAtLoc(dest)) {
        this.text(npc, arr);
        return true;
      }
      else {
        return false;
      }
    }
  },

  
}




// start and end are the objects, not their names!
agenda.findPath = function(start, end, maxlength) {
  if (start === end) return [];
  
  if (!game.pathID) game.pathID = 0;
  if (maxlength === undefined) maxlength = 999;
  game.pathID++;
  let currentList = [start];
  let length = 0;
  let nextList, dest, exits;
  start.pathfinderNote = { id:game.pathID };
  
  // At each iteration we look at the rooms linked from the previous one
  // Any new rooms go into nextList
  // Each room gets flagged with "pathfinderNote"
  while (currentList.length > 0 && length < maxlength) {
    nextList = [];
    length++;
    for (let i = 0; i < currentList.length; i++) {
      exits = currentList[i].getExits(true);
      //debugmsg(formatList(exits));
      for (let j = 0; j < exits.length; j++) {
        //debugmsg(j + "/" + exits.length);
        dest = w[exits[j].name];
        if (dest === undefined) errormsg("Dest is undefined: " + exits[j].name);
        if (dest.pathfinderNote && dest.pathfinderNote.id === game.pathID) continue;
        dest.pathfinderNote = { jumpFrom:currentList[i], id:game.pathID };
        if (dest === end) return agenda.extractPath(start, end);
        nextList.push(dest);
      }
    }
    currentList = nextList;
  }
  return null;
}
    
agenda.extractPath = function(start, end) {
  let res = [end];
  let current = end;
  let count = 0;

  do {
    current = current.pathfinderNote.jumpFrom;
    res.push(current);
    count++;
  } while (current !== start && count < 99);
  res.pop();  // The last is the start location, which we do not ned
  return res.reverse();
}






const TOPIC = function(fromStart) {
  const res = {
    conversationTopic:true,
    display:DSPY_HIDDEN,
    showTopic:fromStart,
    hideTopic:false,
    hideAfter:true,
    nowShow:[],
    nowHide:[],
    count:0,
    runscript:function() {
      let obj = w[this.loc];
      obj.pause();
      this.hideTopic = this.hideAfter;
      this.script(obj);
      if (typeof this.nowShow === "string") errormsg("nowShow for topic " + this.nname + " is a string.");
      for (let i = 0; i < this.nowShow.length; i++) {
        obj = w[this.nowShow[i]];
        if (obj === undefined) errormsg("No topic called " + this.nowShow[i] + " found.");
        obj.showTopic = true;
      }
      if (typeof this.nowHide === "string") errormsg("nowHide for topic " + this.nname + " is a string.");
      for (let i = 0; i < this.nowHide.length; i++) {
        obj = w[this.nowHide[i]];
        if (obj === undefined) errormsg("No topic called " + this.nowHide[i] + " found.");
        obj.hideTopic = true;
      }
      this.count++;
      world.endTurn(SUCCESS);
    },
    isTopicVisible:function() {
      return this.showTopic && !this.hideTopic;
    },
    show:function() {
      return this.showTopic = true;
    },
    hide:function() {
      return this.hideTopic = true;
    },
  };
  return res;
};