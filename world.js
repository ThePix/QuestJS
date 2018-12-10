// ============  World model classes  =======================================
  
function Item(name, hash) {
  this.name = name;
  this.display = "visible";
  this.hereVerbs = ['Examine'];
  this.pronouns = THIRD_PERSON;
  for (var key in DEFAULT_RESPONSES) {
    this[key] = DEFAULT_RESPONSES[key];
  }
  for (var key in hash) {
    this[key] = hash[key];
  }
}

function Player(name, hash) {
  Item.call(this, name, hash);
  this.pronouns = SECOND_PERSON;
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
      msg(prefix(item, isMultiple) + "You're wearing it.");
      return false;
    }
    if (item.loc != player.name) {
      msg(prefix(item, isMultiple) + "You don't have it.");
      return false;
    }
    msg(prefix(item, isMultiple) + "You drop the " + item.name + ".");
    item.loc = currentRoom.name;
    updateUIItems();
    return true;
  }
  this.take = function(item, isMultiple) {
    if (item.loc == player.name) {
      msg(prefix(item, isMultiple) + "You already have it.");
      return false;
    }      
    msg(prefix(item, isMultiple) + "You take the " + item.name + ".");
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
  this.wear = function(item, isMultiple) {
    if (item.worn) {
      msg(prefix(item, isMultiple) + "You're already wearing it.");
      return false;
    }
    if (item.loc != player.name) {
      msg(prefix(item, isMultiple) + "You don't have it.");
      return false;
    }
    msg(prefix(item, isMultiple) + "You put on the " + item.name + ".");
    item.loc = currentRoom.name;
    item.worn = true;
    updateUIItems();
    return true;
  }
  this.remove = function(item, isMultiple) {
    if (!item.worn) {
      msg(prefix(item, isMultiple) + "You're not wearing it.");
      return false;
    }
    msg(prefix(item, isMultiple) + "You take off the " + item.name + ".");
    item.loc = player.name;
    item.worn = false;
    updateUIItems();
    return true;
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