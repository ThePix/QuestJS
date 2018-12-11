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
  
  this.drop = function(item, isMultiple) {
    if (item.worn) {
      msg(prefix(item, isMultiple) + "You're wearing " + item.pronoun.subjective + ".");
      return false;
    }
    if (item.loc != player.name) {
      msg(prefix(item, isMultiple) + "You don't have " + item.pronoun.subjective + ".");
      return false;
    }
    msg(prefix(item, isMultiple) + "You drop " + itemNameWithThe(item) + ".");
    item.loc = currentRoom.name;
    updateUIItems();
    return true;
  }
  
  this.take = function(item, isMultiple) {
    if (!isPresent(item)) {
      msg(prefix(item, isMultiple) + sentenceCase(item.pronoun.subjective) + "'s not here.");
      return false;
    }
    if (!item.takable) {
      msg(prefix(item, isMultiple) + "You can't take " + item.pronoun.subjective + ".");
      return false;
    }
    if (item.loc == player.name) {
      msg(prefix(item, isMultiple) + "You already have " + item.pronoun.subjective + ".");
      return false;
    }      
    msg(prefix(item, isMultiple) + "You take " + itemNameWithThe(item) + ".");
    item.loc = player.name;
    updateUIItems();
    return true;
  }

  this.wear = function(item, isMultiple) {
    if (!isPresent(item)) {
      msg(prefix(item, isMultiple) + sentenceCase(item.pronoun.subjective) + "'s not here.");
      return false;
    }
    if (!item.takable) {
      msg(prefix(item, isMultiple) + "You can't take " + item.pronoun.subjective + ".");
      return false;
    }
    if (item.worn) {
      msg(prefix(item, isMultiple) + "You're already wearing " + item.pronoun.subjective + ".");
      return false;
    }
    if (item.loc != player.name) {
      msg(prefix(item, isMultiple) + "You don't have " + item.pronoun.subjective + ".");
      return false;
    }
    msg(prefix(item, isMultiple) + "You put on " + itemNameWithThe(item) + ".");
    item.loc = currentRoom.name;
    item.worn = true;
    updateUIItems();
    return true;
  }
  
  this.remove = function(item, isMultiple) {
    if (!item.worn) {
      msg(prefix(item, isMultiple) + "You're not wearing " + item.pronoun.subjective + ".");
      return false;
    }
    msg(prefix(item, isMultiple) + "You take " + itemNameWithThe(item) + " off.");
    item.loc = player.name;
    item.worn = false;
    updateUIItems();
    return true;
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