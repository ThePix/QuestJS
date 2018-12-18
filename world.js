const DEFAULT_ITEM = {
  display:"visible",
  
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
  
  askabout:function(text) {
    msg("You can ask " + this.pronouns.objective + " about " + text + " all you like, but " + pronounVerb(this, "'be") + " not about to reply.");
    return false;
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
  
  open:function(item, isMultiple) {
    if (!item.closed) {
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
    if (item.closed) {
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
  display:"invisible",
  player:true,
}

const TURNSCRIPT = function(isRunning, fn) {
  res = {
    display:"invisible",
  }
  res.runTurnscript = isRunning;
  res.turnscript = fn;
  return res;
};



const NPC_OBJECT = function(isFemale) {
  res = {
    hereVerbs:['Examine', 'Talk to'],
    icon:function() {
      return ('<img src="images/npc12.png" />');
    },
  };
  res.pronouns = isFemale ? PRONOUNS.female : PRONOUNS.male;
  res.askabout = function(text) {
    msg("You ask " + this.name + " about " + text + ".");
    if (this.askoptions[text]) {
      msgOrRun(this.askoptions, text);
      return true;
    }
    else {
      msg(nounVerb(this, "have", true) + " nothing to say on the subject.");
      return false;
    }
  }
  return res;
};




// Use this to create a new item (as opposed to a room).
// It adds various defaults that apply only to items
createItem = function (name, listOfHashes) {
  listOfHashes.unshift(DEFAULT_ITEM);
  return createObject(name, listOfHashes);
}



createObject = function (name, listOfHashes) {
  item = {};
  item.name = name;
  for (var i = 0; i < listOfHashes.length; i++) {
    for (var key in listOfHashes[i]) {
      item[key] = listOfHashes[i][key];
    }
  }
  return item;
}


