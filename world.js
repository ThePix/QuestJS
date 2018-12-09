// ============  World model classes  =======================================
  
function Item(name, hash) {
  this.name = name;
  this.display = "visible";
  for (var key in DEFAULT_RESPONSES) {
    this[key] = DEFAULT_RESPONSES[key];
  }
  for (var key in hash) {
    this[key] = hash[key];
  }
}

function Player(name, hash) {
  Item.call(this, name, hash);
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
  this.drop = function(self) {
    msg('You drop the ' + self.name + '.');
    self['loc'] = currentRoom.name;
    updateUIItems();
    return SUCCESS;
  }
  this.take = function(self) {
    msg('You take the ' + self.name + '.');
    self['loc'] = player.name;
    updateUIItems();
    return SUCCESS;
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
  this.wear = function(self) {
    msg('You put on the ' + self.name + '.');
    self['worn'] = true;
  };
  this.remove = function(self) {
    msg('You take off the ' + self.name + '.');
    self['worn'] = false;
  };
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
    msg('You eat the ' + self.name + '.');
    self['loc'] = null;
  };
};