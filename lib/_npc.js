"use strict";

// Should all be language neutral



const NPC = function(isFemale) {
  // A whole bunch of defaults are the same as the player
  const res = Object.assign({}, CHARACTER(), CONSULTABLE(), AGENDA_FOLLOWER());
  
  res.npc = true;
  res.isFemale = isFemale
  res.pronouns = isFemale ? lang.pronouns.female : lang.pronouns.male
  
  res.askOptions = [];
  res.tellOptions = [];
  res.excludeFromAll = true;
  res.reactions = []
  res.receiveItems = [
    {
      msg:lang.not_interested_for_give,
      failed:true,
    },
  ],
  res.followers = []
  res.canReachThroughThis = () => false;
  res.icon = () => 'npc12'

  // This does not work properly, it just gets all clothing!!!
  // But authors could replace as required
  res.getWearingVisible = function() {
    return this.getWearing();
  };
  
  res.isHere = function() {
    return this.isAtLoc(player.loc);
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
  
  



  // can we see the NPC from here?
  // do we need a prefix?
  res.inSight = function(room) {
    if (!this.loc) return false
    if (!room) room = w[this.loc]
    if (player.loc === room.name) return true
    if (room.visibleFrom === undefined) return false
    if (typeof room.visibleFrom === 'function') return room.visibleFrom(currentLocation)
    if (Array.isArray(room.visibleFrom)) {
      if (room.visibleFrom.includes(currentLocation.name)) return room.visibleFromPrefix ? room.visibleFromPrefix : true
    }
    return false
  }
  
  res.setLeader = function(npc) {
    if (typeof npc === 'string') npc = w[npc]
    if (this.leaderName) array.remove(w[this.leaderName].followers, this.name)
    if (npc) {
      npc.followers.push(this.name)
      this.leaderName = npc.name
    }
    else {
      delete this.leaderName
    }
  }
  
  res.getFollowers = function() {
    return this.followers.map(el => w[el])
  }

  // Used by commands
  res.startFollow = function() {
    if (this.leaderName) return falsemsg(lang.already_following, {npc:this})
    this.setLeader(player)
    msg("{nv:npc:nod:true} his head.", {npc:this})
    return true
  },
  res.endFollow = function() {
    if (!this.leaderName) return falsemsg(lang.already_waiting, {npc:this})
    this.setLeader()
    msg("{nv:npc:nod:true} his head.", {npc:this})
    return true
  },

  res.endTurn = function(turn) {
    if (this.dead) return
    this.sayTakeTurn()
    this.doReactions()
    if (!this.paused && !this.suspended && this.agenda && this.agenda.length > 0) this.doAgenda()
    this.doEvent(turn)
  }
  
  res.doReactions = function() {
    if (this.player) return   // needed for POV swapping
    if (!this.isHere() && !settings.npcReactionsAlways) return
    if (!this.reactionFlags) this.reactionFlags = []

    const params = {
      char:this,
      noResponseNotError:true,
      afterScript:function(params, response) {
        if (!response) return
        if (response.name) params.char.reactionFlags.push(response.name)
        if (!response.noPause) params.char.pause()
        if (response.override) params.char.reactionFlags = params.char.reactionFlags.concat(response.override)
      },
      extraTest:function(params, response, ) {
        return !response.name || !params.char.reactionFlags.includes(response.name)
      },
    }
    respond(params, this.reactions)
  }
  
  for (const key in npc_utilities) res[key] = npc_utilities[key]
  
  // For ASK/TELL
  res.topics = function() {
    if (this.askOptions.length === 0 && this.tellOptions.length === 0) {
      metamsg(lang.topics_no_ask_tell);
      return world.SUCCESS_NO_TURNSCRIPTS;
    }

    let flag = false;
    for (let action of ['ask', 'tell']) {
      const arr = getResponseList({char:this, action:action}, this[action + 'Options']);
      const arr2 = []
      for (let res of arr) {
        if (res.silent && !player.mentionedTopics.includes(res.name)) continue
        arr2.push(res.name)
      }
      if (arr2.length !== 0) {
        metamsg(lang['topics_' + action + '_list'], {item:this, list:arr2.sort().join('; ')});
        flag = true;
      }
    }

    if (!flag) {
      metamsg(lang.topics_none_found, {item:this})
    }
    
    return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS
  }
  
  res.sayBonus = 0;
  res.sayPriority = 0;
  res.sayState = 0;
  res.sayUsed = " ";
  res.sayResponse = function(s) {
    if (!this.sayResponses) return false

    const params = {
      text:s,
      char:this,
      extraTest:function(params, response) {
        if (!response.regex) return true
        if (response.id && params.char.sayUsed.match(new RegExp('\\b' + response.id + '\\b'))) return false
        return response.regex.test(params.text)
      },
      afterScript:function(params, response) {
        if (!response) return
        if (this.oldQuestion) {
          delete this.oldQuestion
        }
        else {
          params.char.sayBonus = 0
          params.char.sayQuestion = false
        }
        if (response.id) params.char.sayUsed += response.id + " "
      },
      noResponseNotError:true,
    }
    return respond(params, this.sayResponses)
  }
  
  res.sayCanHear = function(char, verb) {
    return char.loc === this.loc;
  }

  res.askQuestion = function(questionName) {
    if (typeof questionName !== "string") questionName = questionName.name
    if (this.sayQuestion) this.oldQuestion = this.sayQuestion
    const q = util.questionList[questionName]
    if (!q) return errormsg("Trying to set a question that does not exist, " + questionName + ", for " + this.name)
    
    this.sayQuestion = questionName
    this.sayQuestionCountdown = q.countdown
    this.sayBonus = 100
  }
  
  res.respondToAnswer = function(s) {
    const q = util.questionList[this.sayQuestion]
    return q.sayResponse(this, s)
  }
  
  res.sayTakeTurn = function() {
    if (!this.sayQuestion) return
    this.sayQuestionCountdown--
    if (this.sayQuestionCountdown > 0) return
    const q = util.questionList[this.sayQuestion]
    this.sayQuestion = false
    this.sayBonus = 0
    if (q.expiredScript) q.expiredScript(this)
  }

  return res;
};



const npc_utilities = {
  findTopic:function(alias, n = 1) {
    return util.findTopic(alias, this, n)
  },
  showTopic:function(alias, n = 1) {
    util.findTopic(alias, this, n).show()
  },
  hideTopic:function(alias, n = 1) {
    util.findTopic(alias, this, n).hide()
  },


  talkto:function() {
    if (settings.noTalkTo !== false) {
      metamsg(settings.noTalkTo);
      return false;
    }
    
    if (!player.testTalk(this)) return false
    if (this.testTalk && !this.testTalk()) return false
    
    // handle non-dynamic talkto 
    if (typeof this.talk === 'string') {
      msg(this.talk, {char:this})
      return true
    }
    if (typeof this.talk === 'function') {
      return this.talk()
    }

    // handle dynamic talkto    
    const topics = this.getTopics()
    player.conversingWithNpc = this
    if (topics.length === 0) return failedmsg(this.no_topics ? this.no_topics : lang.no_topics, {char:player, item:this});
    
    if (this.greeting) {
      printOrRun(this, this, "greeting");
    }
    topics.push(lang.never_mind)
    
    const fn = io.menuFunctions[settings.funcForDynamicConv]
    fn(lang.speak_to_menu_title(this), topics, function(result) {
      if (result !== lang.never_mind) {
        result.runscript();
      }
    })
    
    return world.SUCCESS_NO_TURNSCRIPTS;
  },
  
  askTopics:function(...topics) {
    const title = topics.shift()
    const fn = io.menuFunctions[settings.funcForDynamicConv]
    fn(title, topics, function(result) {
      result.runscript();
    })
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



const AGENDA_FOLLOWER = function() {
  const res = {}
  res.agenda = []
  res.suspended = false
  res.followers = []
  res.inSight = function() { return false }
  res.endTurn = function(turn) {
    if (!this.paused && !this.suspended && this.agenda.length > 0) this.doAgenda()
    this.doEvent(turn)
  }
  
  res.setAgenda = function(agenda) {
    this.agenda = agenda
    this.suspended = false
    this.agendaWaitCounter = false
    this.patrolCounter = false
  }
  
  res.doAgenda = function() {
    // If this NPC has followers, we fake it so it seems to be the group
    if (this.followers.length !== 0) {
      this.savedPronouns = this.pronouns;
      this.savedAlias = this.alias
      this.pronouns = lang.pronouns.plural;
      this.followers.unshift(this.name);
      this.alias = formatList(this.getFollowers(), {lastSep:lang.list_and});
      this.followers.shift();
    }

    if (!Array.isArray(this.agenda)) throw "Agenda is not a list for " + this.name
    if (typeof this.agenda[0] !== 'string') throw "Next agenda item is not a string for " + this.name
    const arr = this.agenda[0].split(":");
    const functionName = arr.shift();
    if (typeof agenda[functionName] !== "function") {
      errormsg("Unknown function `" + functionName + "' in agenda for " + this.name);
      return;
    }
    const flag = agenda[functionName](this, arr)
    if (flag) this.agenda.shift()
    if (flag === 'next') this.doAgenda()
    
    // If we are faking the group, reset
    if (this.savedPronouns) {
      this.pronouns = this.savedPronouns
      this.alias = this.savedAlias
      this.savedPronouns = false
    }
  }
  
  res.pause = function() {
    //debugmsg("pausing " + this.name);
    if (this.leaderName) {
      w[this.leaderName].pause();
    }
    else {
      this.paused = true;
    }
  }
  
  return res
}


const agenda = {
  debug:function(s, npc, arr) {
    if (settings.agendaDebugging && settings.playMode === 'dev') debugmsg('AGENDA for ' + npc.name + ': ' + s + '; ' + formatList(arr, {doNotSort:true}))
  },
  debugS:function(s) {
    if (settings.agendaDebugging && settings.playMode === 'dev') debugmsg('AGENDA comment: ' + s)
  },

  
  // wait one turn
  pause:function(npc, arr) {
    return true;
  },

  // print the array as text if the player is here
  // otherwise this will be skipped
  // Used by several other functions, so this applies to them too
  text:function(npc, arr) {
    if (typeof npc[arr[0]] === "function") {
      this.debug("text (function)", npc, arr);
      const fn = arr.shift();
      const res = npc[fn](arr);
      return (typeof res === "boolean" ? res : true);
    }
    this.debug("text (string)", npc, arr);
    
    if (npc.inSight()) msg(arr.join(':'))
    return true;
  },

  msg:function(npc, arr) {
    this.debug("msg (string)", npc, arr)
    msg(arr.join(':'))
    return true
  },
  
  // Alias for text
  run:function(npc, arr) { return this.text(npc, arr) },
  
  // sets one attribute on the given item
  // it will guess if Boolean, integer or string
  setItemAtt:function(npc, arr) {
    return this._setItemAtt(npc, arr, false) 
  },

  // sets one attribute on the given item
  // it will guess if Boolean, integer or string
  setItemAttThen:function(npc, arr) {
    return this._setItemAtt(npc, arr, true) 
  },


  // sets one attribute on the given item
  // it will guess if Boolean, integer or string
  _setItemAtt:function(npc, arr, next) {
    this.debug("setItemAtt", npc, arr)
    const item = arr.shift()
    const att = arr.shift()
    let value = arr.shift()
    if (!w[item]) errormsg("Item '" + item + "' not recognised in the agenda of " + npc.name)
    if (value === "true") value = true
    if (value === "false") value = false
    if (/^\d+$/.test(value)) value = parseInt(value)
    w[item][att] = value
    this.text(npc, arr)
    return next ? 'next' : true
  },

  // delete one attribute on the given item
  deleteItemAtt:function(npc, arr) {
    this.debug("deleteItemAtt", npc, arr)
    const item = arr.shift()
    const att = arr.shift()
    if (!w[item]) errormsg("Item '" + item + "' not recognised in the agenda of " + npc.name)
    delete w[item][att]
    this.text(npc, arr)
    return true
  },

  // Wait n turns
  wait:function(npc, arr) {
    this.debug("wait", npc, arr);
    if (arr.length === 0) return true;
    if (isNaN(arr[0])) errormsg("Expected wait to be given a number in the agenda of '" + npc.name + "'");
    const count = parseInt(arr.shift());
    if (npc.agendaWaitCounter !== undefined) {
      npc.agendaWaitCounter++;
      if (npc.agendaWaitCounter >= count) {
        this.debugS("Pass")
        this.text(npc, arr);
        return true;
      }
      return false;
    }
    npc.agendaWaitCounter = 0;
    return false;
  },

  // Wait until ...
  // This may be repeated any number of times
  waitFor:function(npc, arr) { return this.handleWaitFor(npc, arr, false) },
  waitForNow:function(npc, arr) { return this.handleWaitFor(npc, arr, true) },
    
  handleWaitFor:function(npc, arr, immediate) {
    this.debug("waitFor", npc, arr);
    let name = arr.shift();
    if (typeof npc[name] === "function") {
      if (npc[name](arr)) {
        this.text(npc, arr)
        this.debugS("Pass")
        return (immediate ? 'next' : true)
      }
      else {
        return false
      }
    }
    else {
      if (name === "player") name = player.name;
      if (npc.loc === w[name].loc) {
        this.text(npc, arr)
        this.debugS("Pass")
        return (immediate ? 'next' : true)
      }
      else {
        return false
      }
    }
  },

  waitUntil:function(npc, arr) { return agenda.handleWaitUntilWhile(npc, arr, true) },
  waitUntilNow:function(npc, arr) { return agenda.handleWaitUntilWhile(npc, arr, true, true) },
    
  waitWhile:function(npc, arr) { return agenda.handleWaitUntilWhile(npc, arr, false) },
  waitWhileNow:function(npc, arr) { return agenda.handleWaitUntilWhile(npc, arr, false, true) },
    
  handleWaitUntilWhile:function(npc, arr, reverse, immediate) {
    const item = arr[0] === 'player' ? player : w[arr[0]]
    arr.shift()
    const attName = arr.shift()
    const value = util.guessMyType(arr.shift())
    let flag = item[attName] === value
    if (reverse) flag = !flag
    if (flag) return false
    msg(arr.join(':'))
    return immediate ? 'next' : true
  },
  
  joinedBy:function(npc, arr) {
    this.debug("joinedBy", npc, arr);
    const followerName = arr.shift();
    w[followerName].setLeader(npc);
    this.text(npc, arr);
    return true;
  },
  
  joining:function(npc, arr) {
    this.debug("joining", npc, arr);
    const leaderName = arr.shift();
    npc.setLeader(w[leaderName]);
    this.text(npc, arr);
    return true;
  },
  
  disband:function(npc, arr) {
    this.debug("disband", npc, arr)
    for (let s of npc.followers) {
      const follower = w[s]
      follower.leader = false
    }
    npc.followers = []
    this.text(npc, arr)
    return true
  },
  
  // Move the given item directly to the given location, then print the rest of the array as text
  // Do not use for items with a funny location, such as COUNTABLES
  moveItem:function(npc, arr) {
    this.debug("moveItem", npc, arr)
    const item = arr.shift()
    let dest = arr.shift()
    if (dest === "player") {
      dest = player.name
    }
    else if (dest === "_") {
      dest = false
    }
    else {
      if (!w[dest]) return errormsg("Location '" + dest + "' not recognized in the agenda of " + npc.name)
    }
    w[item].moveToFrom({char:npc, toLoc:dest, item:item})
    this.text(npc, arr)
    return true
  },

  // Move directly to the given location, then print the rest of the array as text
  // Use "player" to go directly to the room the player is in.
  // Use an item (i.e., an object not flagged as a room) to have the NPC move
  // to the room containing the item.
  // None of the usual reactions will be performed, so items carried with not react to
  // moving, any followers will be left behind, etc.
  jumpTo:function(npc, arr) {
    let dest = arr.shift()
    if (dest === "player") {
      dest = player.loc
    }
    else if (dest === "_") {
      dest = undefined
      this.text(npc, arr)
    }
    else {
      if (!w[dest]) return errormsg("Location '" + dest + "' not recognised in the agenda of " + npc.name)
      if (!w[dest].room) dest = dest.loc  // go to the room the item is in
      if (!w[dest]) return errormsg("Location '" + dest + "' not recognized in the agenda of " + npc.name)
    }
    npc.loc = dest
    this.text(npc, arr)
    return true
  },
  
  // Move to the given location, then print the rest of the array as text.
  // There must be an exit from the current room to that room.
  moveTo:function(npc, arr) {
    let dest = arr.shift()
    if (!w[dest]) return errormsg("Location '" + dest + "' not recognised in the agenda of " + npc.name)
    if (!w[dest].room) dest = dest.loc  // go to the room the item is in
    const exit = w[npc.loc].findExit(dest)
    if (!exit)return errormsg("Could not find an exit to location '" + dest + "' in the agenda of " + npc.name)
    //log("Move " + npc.name + " to " + dest)
    npc.movingMsg(exit) 
    npc.moveChar(exit)
    this.text(npc, arr)
    return true
  },
  
  patrol:function(npc, arr) {
    this.debug("patrol", npc, arr);
    if (npc.patrolCounter === undefined) npc.patrolCounter = -1;
    npc.patrolCounter = (npc.patrolCounter + 1) % arr.length;
    this.moveTo(npc, [arr[npc.patrolCounter]]);
    return false;
  },

  // Move to another room via a random, unlocked exit, then print the rest of the array as text
  walkRandom:function(npc, arr) {
    this.debug("walkRandom", npc, arr);
    const exit = w[npc.loc].getRandomExit({excludeLocked:true, excludeScenery:true});
    if (exit === null) {
      this.text(npc, arr);
      return true;
    }
    if (!w[exit.name]) errormsg("Location '" + exit.name + "' not recognised in the agenda of " + npc.name)
    npc.movingMsg(exit) 
    npc.moveChar(exit)
    return false;
  },

  // Move to the given location, using available, unlocked exits, one room per turn
  // then print the rest of the array as text
  // Use "player" to go to the room the player is in (if the player moves, the NPC will head
  // to the new position, but will be omniscient!).
  // Use an item (i.e., an object not flagged as a room) to have the NPC move
  // to the room containing the item.
  // This may be repeated any number of turns
  leadTo:function(npc, arr) {
    this.debug("leadTo", npc, arr)
    if (npc.loc !== player.loc) return false
    return this.walkTo(npc, arr)
  },
  walkTo:function(npc, arr) {
    this.debug("walkTo", npc, arr)
    let dest = arr.shift();
    if (dest === "player") dest = player.loc;
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
      if (!route) errormsg("Location '" + dest + "' not reachable in the agenda of " + npc.name)
      const exit = w[npc.loc].findExit(route[0])
      npc.movingMsg(exit) 
      npc.moveChar(exit)
      if (npc.isAtLoc(dest)) {
        this.text(npc, arr);
        return true;
      }
      else {
        return false;
      }
    }
  },
  
  // Initiate a conversation, with this topic
  showTopic:function(npc, arr) {
    let alias = arr.shift()
    npc.showTopic(alias)
    this.text(npc, arr)
    return true
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
      exits = room.getExits({npc:true});
      for (let exit of exits) {
        if (exit.name === '_') continue
        dest = w[exit.name];
        if (dest === undefined) {
          errormsg("Dest is undefined: " + exit.name + ' (room ' + room.name + '). Giving up.');
          console.log(this)
          return false
        }
        if (dest.pathfinderNote && dest.pathfinderNote.id === game.pathID) continue;
        dest.pathfinderNote = { jumpFrom:room, id:game.pathID };
        if (dest === end) return agenda.extractPath(start, end);
        nextList.push(dest);
      }
    }
    currentList = nextList;
  }
  return false
  /*console.error("Path-finding failed: " + (currentList.length === 0 ? 'list is empty' : 'exceeded maximum length'))
  log("start: " + start.name)
  log("end: " + end.name)
  log("maxlength: " + maxlength)
  console.trace()
  throw("Path-finding failed, see comments above.")*/
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
  res.consultable = true

  res.askabout = function(text1, text2) { 
    return this.asktellabout(text1, text2, lang.ask_about_intro, this.askOptions, "ask")
  }
  res.tellabout = function(text1, text2) {
    return this.asktellabout(text1, text2, lang.tell_about_intro, this.tellOptions, "tell")
  }

  res.talkabout = function(text1, text2) {
    let data = this.talkOptions
    if (!this.talkOptions) data = this.tellOptions ? this.tellOptions.concat(this.askOptions) : this.askOptions
    return this.asktellabout(text1, text2, lang.talk_about_intro, data, "talk"); 
  }


  res.asktellabout = function(text1, text2, intro, list, action) {
    if (settings.noAskTell !== false) {
      metamsg(settings.noAskTell);
      return false;
    }

    if (!player.testTalk(this)) return false
    if (this.testTalk && !this.testTalk(text1, action)) return false

    if (!list || list.length === 0) {
      metamsg(settings.noAskTell);
      return errormsg("No " + action + "Options set for " + this.name + " and I think there should at least be default saying why.")
    }
    if (settings.givePlayerAskTellMsg) msg(intro(this, text1, text2), {char:player});
    
    const params = {
      text:text1,
      text2:text2,
      char:this,
      action:action,
      extraTest:function(params, response) {
        if (!response.regex) return true
        return response.regex.test(params.text)
      },
      afterScript:this.askTellDone
    }
    return respond(params, list)
  }
  res.askTellDone = function(params, response) {
    if (!response) {
      msg(lang.npc_no_interest_in, params)
      return
    }
    if (response.mentions) {
      for (let s of response.mentions) {
        if (!player.mentionedTopics.includes(s)) player.mentionedTopics.push(s)
      }
    }
    if (params.char.pause) params.char.pause()
  } 

  return res;
};


class Question {
  constructor(name, responses) {
    this.name = name
    this.responses = responses
    this.countdown = settings.turnsQuestionsLast
  }
  
  sayResponse(char, s) {
    const params = {
      text:s,
      char:char,
      question:this,
      extraTest:function(params, response) {
        if (!response.regex) return true
        return response.regex.test(params.text)
      },
      afterScript:function(params, response) {
        if (this.oldQuestion) {
          delete this.oldQuestion
        }
        else {
        //if (!response || response.disableReset) return
          params.char.sayBonus = 0
          params.char.sayQuestion = false
          delete params.char.questionExpiredFunction
        }
        if (params.question.afterScript) {
          params.question.afterScript(params, response)
        }
      },
      noResponseNotError:true,
    }
    return respond(params, this.responses)
  }
}

util.questionList = {}
util.createQuestion = function(name, responses, options = {}) {
  const q = new Question(name, responses)
  for (const key in options) q[key] = options[key]
  util.questionList[name] = q
  return q
}
  
  
  

const TOPIC = function(fromStart) {
  const res = {
    conversationTopic:true,
    showTopic:fromStart,
    hideTopic:false,
    hideAfter:true,
    properNoun:true, // we do not want "the" prepended
    nowShow:[],
    nowHide:[],
    count:0,
    isVisible:() => true,
    isAtLoc:() => false,
    belongsTo:function(loc) { return this.loc === loc },
    eventPeriod:1,
    eventIsActive:function() { this.showTopic && !this.hideTopic && this.countdown },
    eventScript:function() { 
      this.countdown--
      if (this.countdown < 0) this.hide()
    },
    runscript:function() {
      let obj = player.conversingWithNpc
      if (obj === undefined) return errormsg("No conversing NPC called " + player.conversingWithNpc + " found.")
      obj.pause()
      this.hideTopic = this.hideAfter
      if (!this.script && !this.msg) return errormsg("Topic " + this.name + " has neither script nor msg attributes.")
      if (this.script) {
        if (typeof this.script !== "function") return errormsg("script for topic " + this.name + " is not a function.")
        this.script.bind(obj)({char:obj, player:player, topic:this})
      }
      if (this.msg) {
        if (typeof this.msg !== "string") return errormsg("msg for topic " + this.name + " is not a string.")
        msg(this.msg, {char:obj, topic:this})
      }
      this.showHideList(this.nowShow, true)
      this.showHideList(this.nowHide, false)
      this.count++
      world.endTurn(world.SUCCESS)
    },
    isTopicVisible:function(char) {
      return this.showTopic && !this.hideTopic && this.belongsTo(char.name) && this.isVisible(char)
    },
    showHideList:function(list, isShow) {
      if (typeof list === "string") {
        log("WARNING: " + (isShow ? "nowShow" : "nowHide") + " for topic " + this.name + " is a string.")
        return
      }
      for (let s of list) {
        const t = util.findTopic(s)
        if (t) {
         t[isShow ? 'showTopic' : 'hideTopic'] = true
        }
        else {
          log("WARNING: Topic " + this.name + " wants to now show/hide a non-existent topic, " + s)
        }
      }
    },
    show:function() {
      return this.showTopic = true
    },
    hide:function() {
      return this.hideTopic = true
    },
  };
  return res;
};