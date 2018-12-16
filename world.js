// ============  World model classes  =======================================
  
function Item(name, hash) {
  this.name = name;
  this.display = "visible";
  this.hereVerbs = ['Examine'];
  this.pronouns = PRONOUNS.thirdperson;
  for (var key in DEFAULT_RESPONSES) {
    this[key] = DEFAULT_RESPONSES[key];
  }
  
  for (var key in hash) {
    this[key] = hash[key];
  }


  this.icon = function() {
    return "";
  }
  
  this.drop = function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_NOT_CARRYING(item));
    return false;
  }
  
  this.take = function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_CANNOT_TAKE(item));
    return false;
  }

  this.wear = function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_CANNOT_WEAR(item));
    return false;
  }
  
  this.remove = function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_NOT_WEARING(item));
    return false;
  }
  
  this.open = function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_CANNOT_OPEN(item));
    return false;
  }

  this.close = function(item, isMultiple) {
    msg(prefix(item, isMultiple) + CMD_CANNOT_CLOSE(item));
    return false;
  }
  
  this.setPropertyIfNew = function(name, value) {
    if (!this[name]) {
      this[name] = value;
    }
  }
}



function Player(name, hash) {
  Item.call(this, name, hash);
  this.pronouns = PRONOUNS.secondperson;
  this.display = "invisible";
  this.player = true;
}



function Exit(name, hash) {
  Item.call(this, name, hash);
  this.use = function(self) {
    if ('msg' in self) {
      msg(self.msg);
    }
    setRoom(self.name);
  }
}



function Room(name, hash) {
  Item.call(this, name, hash);
};



function Turnscript(name, hash) {
  Item.call(this, name, hash);
  this.runTurnscript = true;
  this.display = "invisible";
};





function NpcItem(name, hash) {
  Item.call(this, name, hash);
  this.hereVerbs = ['Look at'];
  this.icon = function() {
    return ('<img src="images/npc12.png" />');
  }
};

function MaleNpcItem(name, hash) {
  NpcItem.call(this, name, hash);
  this.pronouns = PRONOUNS.male;
};

function FemaleNpcItem(name, hash) {
  NpcItem.call(this, name, hash);
  this.pronouns = PRONOUNS.female;
};




function UseableItem(name, hash) {
  Item.call(this, name, hash);
  this.hereVerbs = ['Examine', 'Use'];
};

function TakableItem(name, hash) {
  Item.call(this, name, hash);
  this.heldVerbs = ['Examine', 'Drop'];
  this.hereVerbs = ['Examine', 'Take'];
  this.takable = true;
  
  this.drop = function(item, isMultiple) {
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
  }
  
  this.take = function(item, isMultiple) {
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
  }
};

function UseableTakableItem(name, hash) {
  TakableItem.call(this, name, hash);
  this.heldVerbs = ['Examine', 'Drop', 'Use'];
  this.hereVerbs = ['Examine', 'Take', 'Use'];
};

function WearableItem(name, hash) {
  TakableItem.call(this, name, hash);
  this.heldVerbs = ['Examine', 'Drop', 'Wear'];
  this.wornVerbs = ['Examine', 'Remove'];
  this.wearable = true;
  this.icon = function() {
    return ('<img src="images/garment12.png" />');
  }
  
  this.wear = function(item, isMultiple) {
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
    item.loc = getObject(player.loc).name;
    item.worn = true;
    updateUIItems();
    return true;
  }
  
  this.remove = function(item, isMultiple) {
    if (!item.worn) {
      msg(prefix(item, isMultiple) + CMD_NOT_WEARING(item));
      return false;
    }
    msg(prefix(item, isMultiple) + CMD_REMOVE_SUCCESSFUL(item));
    item.loc = player.name;
    item.worn = false;
    updateUIItems();
    return true;
  }
};


function Container(name, hash) {
  Item.call(this, name, hash);
  this.hereVerbs = ['Examine', 'Open'];
  this.container = true,
  this.closed = true,
  
  this.open = function(item, isMultiple) {
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
  }
  
  this.close = function(item, isMultiple) {
    if (item.closed) {
      msg(prefix(item, isMultiple) + CMD_ALREADY(item));
      return false;
    }
    item.hereVerbs = ['Examine', 'Open'];
    item.closed = true;
    msg(prefix(item, isMultiple) + CMD_CLOSE_SUCCESSFUL(item));
    return true;
  }
  
  this.icon = function() {
    return ('<img src="images/' + (this.closed ? 'closed' : 'opened') + '12.png" />');
  }
};




function SwitchableItem(name, hash) {
  Item.call(this, name, hash);
  this.hereVerbs = ['Examine', 'Turn on'];
  this.switchon = function(self) {
    msg('You turn the ' + self.name + ' on.');
    self['switchedon'] = true;
    self['hereVerbs'] = ['Examine', 'Turn off'];
  };
  this.switchoff = function(self) {
    msg('You turn the ' + self.name + ' off.');
    self['switchedon'] = false;
    self['hereVerbs'] = ['Examine', 'Turn on'];
  };
};

function SwitchableTakableItem(name, hash) {
  TakableItem.call(this, name, hash);
  this.heldVerbs = ['Examine', 'Drop', 'Turn on'];
  this.hereVerbs = ['Examine', 'Take', 'Turn off'];
  this.switchon = function(self) {
    msg('You turn the ' + self.name + ' on.');
    self['switchedon'] = true;
    self['hereVerbs'] = ['Examine', 'Turn off'];
  };
  this.switchoff = function(self) {
    msg('You turn the ' + self.name + ' off.');
    self['switchedon'] = false;
    self['hereVerbs'] = ['Examine', 'Turn on'];
  };
};

function EdibleItem(name, hash) {
  TakableItem.call(this, name, hash);
  this.heldVerbs = ['Examine', 'Drop', 'Eat'];
  this.eat = function(self) {
    msg('You eat the ' + self.name + ".");
    self['loc'] = null;
  };
};