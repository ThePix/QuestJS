"use strict";

// Should all be language neutral



const NPC = function(isFemale) {
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
  res.getVerbs = () => no_talk_to ? [lang.verbs.lookat] : [lang.verbs.lookat, lang.verbs.talkto];
  res.icon = () => '<img src="images/npc12.png" />';

  res.isAtLoc = function(loc, situation) {
    if (situation === display.LOOK && this.scenery) return false;
    return (this.loc === loc);
  };
  
  res.heading = function(dir) {
    return npc_heading(this, dir);
  };

  // This does not work properly, it just gets all clothing!!!
  // But authors could replace as required
  res.getWearingVisible = function() {
    return this.getWearing();
  };
  
  res.getTopics = npc_utilities.getTopics;
  
  res.isHere = function() {
    return this.isAtLoc(game.player.loc);
  }
  
  res.msg = function(s, params) {
    if (this.isHere()) msg(s, params);
  }
  
  res.multiMsg = function(ary) {
    if (!this.isHere()) return;
    const counter = ary[0].replace(/[^a-z]/ig, '');
    if (this[counter] === undefined) this[counter] = -1;
    this[counter]++;
    if (this[counter] >= ary.length) this[counter] = ary.length - 1;
    if (ary[this[counter]]) msg(ary[this[counter]]);
  }
  
  
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
    this.sayTakeTurn()
    this.doReactions();
    if (!this.paused && !this.suspended && this.agenda.length > 0) this.doAgenda();
  };
  
  res.doReactions = function() {
    if (this.isHere() || NPC_REACTIONS_AWAYS) {
      if (typeof this.reactions === "function") {
        this.reactions();
      }
      else {
        if (!this.reactionFlags) this.reactionFlags = "";
        for (let key in this.reactions) {
          //console.log("key:" + key);
          if (this.reactionFlags.split(" ").includes(key)) continue;
          if (this.reactions[key].test()) {
            this.reactions[key].action();
            this.reactionFlags += " " + key;
            if (this.reactions[key].override) this.reactionFlags += " " + this.reactions[key].override;
            //console.log("this.reactionFlags:" + this.reactionFlags);
          }
          
        }
      }
    }
  };
  
  res.doAgenda = function() {
    // If this NPC has followers, we fake it so it seems to be the group
    if (this.followers.length !== 0) {
      this.savedPronouns = this.pronouns;
      this.savedAlias = this.alias
      this.pronouns = lang.pronouns.plural;
      this.followers.unshift(this);
      this.alias = formatList(this.followers, {lastJoiner:lang.list_and});
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

    lang.npcLeavingMsg(this, dest);
    
    // Move NPC (and followers)
    this.loc = dest;
    for (let follower of this.followers) follower.loc = dest;
    
    lang.npcEnteringMsg(this, origin);
  };
  

  res.talkto = npc_utilities.talkto;
  
  res.topics = function() {
    if (this.askOptions.length === 0 && this.tellOptions.length === 0) {
      metamsg(lang.topics_no_ask_tell);
      return SUPPRESS_ENDTURN;
    }

    let flag = false;
    for (let action of ['ask', 'tell']) {
      const arr = getResponseList({actor:this, action:action}, this[action + 'Options']);
      if (arr.length !== 0) {
        metamsg(lang['topics_' + action + '_list'](this, arr.sort()));
        flag = true;
      }
    }

    if (!flag) {
      metamsg(lang.topics_none_found(this));
    }
    
    return SUPPRESS_ENDTURN;
  }    

  res.sayBonus = 0;
  res.sayPriority = 0;
  res.sayState = 0;
  res.sayUsed = " ";
  res.sayResponse = function(s) {
    if (!this.sayResponses) return false;
    for (let res of this.sayResponses) {
      if (res.id && this.sayUsed.includes(" " + res.id + " ")) continue;
      if (!res.regex.test(s)) continue;
      res.response();
      if (res.id) this.sayUsed += res.id + " "
      return true;
    }
    return false;
  };
  res.sayCanHear = function(actor, verb) {
    return actor.loc === this.loc;
  };
  res.askQuestion = function(questionName) {
    if (typeof questionName !== "string") questionName = questionName.name;
    this.sayQuestion = questionName
    this.sayQuestionCountdown = TURNS_QUESTIONS_LAST_TURN
    this.sayBonus = 100
  };
  res.sayTakeTurn = function(questionName) {
    if (this.sayQuestionCountdown <= 0) return;
    this.sayQuestionCountdown--;
    if (this.sayQuestionCountdown > 0) return;
    delete this.sayQuestion;
    this.sayBonus = 0;
  };

  return res;
};



const npc_utilities = {
  talkto:function() {
    if (!game.player.canTalk(this)) {
      return false;
    }
    if (no_talk_to !== false) {
      metamsg(no_talk_to);
      return false;
    }
    
    const topics = this.getTopics(this);
    if (topics.length === 0) return failedmsg(lang.no_topics(game.player, this));
    
    topics.push(lang.never_mind);
    if (DROPDOWN_FOR_CONV) {
      showDropDown(lang.speak_to_menu_title(this), topics, function(result) {
        if (result !== lang.never_mind) {
          result.runscript();
        }
      });
    }
    else {
      showMenu(lang.speak_to_menu_title(this), topics, function(result) {
        if (result !== lang.never_mind) {
          result.runscript();
        }
      });
    }
    
    return SUPPRESS_ENDTURN;
  },
  
  getTopics:function() {
    const list = [];
    for (let key in w) {
      if (w[key].isTopicVisible && w[key].isTopicVisible(this)) {
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
      for (let item of arr) {
        msg(item);
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
    for (let follower of npc.followers) {
      delete follower.leader;
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
    w[item].moveToFrom(dest);
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
    for (let room of currentList) {
      exits = room.getExits(true);
      for (let exit of exits) {
        dest = w[exit.name];
        if (dest === undefined) errormsg("Dest is undefined: " + exit.name);
        if (dest.pathfinderNote && dest.pathfinderNote.id === game.pathID) continue;
        dest.pathfinderNote = { jumpFrom:room, id:game.pathID };
        if (dest === end) return agenda.extractPath(start, end);
        nextList.push(dest);
      }
    }
    currentList = nextList;
  }
  return false;
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



const CONSULTABLE = function() {
  const res = {}

  res.askabout = function(text) { return this.asktellabout(text, lang.ask_about_intro, this.askOptions, "ask"); },
  res.tellabout = function(text) { return this.asktellabout(text, lang.tell_about_intro, this.tellOptions, "tell"); },
  res.asktellabout = function(text, intro, list, action) {
    if (!game.player.canTalk(this)) {
      return false;
    }
    if (no_ask_tell !== false) {
      metamsg(no_ask_tell);
      return false;
    }
    if (GIVE_PLAYER_ASK_TELL_MSG) msg(intro(this, text));
    
    const params = {
      text:text,
      actor:this,
      action:action,      
    }
    return respond(params, list, this.asktelldone);
  };
  res.asktelldone = function(params, response) {
    if (!response) {
      msg(npc_no_interest_in(params.actor))
      return;
    }
    params.actor.pause();
  } 

  return res;
};



const QUESTION = function() {
  const res = {
    sayResponse:function(actor, s) {
      for (let res of this.responses) {
        if (!res.regex || res.regex.test(s)) {
          actor.sayBonus = 0;
          delete actor.sayQuestion;
          res.response(s);
          return true;
        }
      }
      return false
    },
  }
  return res;
};


const TOPIC = function(fromStart) {
  const res = {
    conversationTopic:true,
    showTopic:fromStart,
    hideTopic:false,
    hideAfter:true,
    nowShow:[],
    nowHide:[],
    count:0,
    isAtLoc:() => false,
    runscript:function() {
      let obj = w[this.loc];
      obj.pause();
      this.hideTopic = this.hideAfter;
      this.script(obj);
      if (typeof this.nowShow === "string") errormsg("nowShow for topic " + this.nname + " is a string.");
      for (let s of this.nowShow) {
        obj = w[s];
        if (obj === undefined) errormsg("No topic called " + s + " found.");
        obj.showTopic = true;
      }
      if (typeof this.nowHide === "string") errormsg("nowHide for topic " + this.nname + " is a string.");
      for (let s of this.nowHide) {
        obj = w[s];
        if (obj === undefined) errormsg("No topic called " + s + " found.");
        obj.hideTopic = true;
      }
      this.count++;
      world.endTurn(SUCCESS);
    },
    isTopicVisible:function(char) {
      return this.showTopic && !this.hideTopic && char.name === this.loc;
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