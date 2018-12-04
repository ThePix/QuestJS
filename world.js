// ============  World model functions  ====================================




// ============  World model classes  =======================================

function Item(name, hash) {
  this.name = name;
  this.display = "visible";
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
}
Exit.prototype.use = function(self) {
  if ('msg' in self) {
    msg(self['msg']);
  }
  setRoom(self['name']);
}

function Room(name, hash) {
  Item.call(this, name, hash);
}

function Turnscript(name, hash) {
  Item.call(this, name, hash);
}


function UseableItem(name, hash) {
  Item.call(this, name, hash);
}
UseableItem.prototype.hereVerbs = ['Examine', 'Use'];

function TakableItem(name, hash) {
  Item.call(this, name, hash);
}
TakableItem.prototype.heldVerbs = ['Examine', 'Drop'];
TakableItem.prototype.hereVerbs = ['Examine', 'Take'];
TakableItem.prototype.drop = function(self) {
  msg('You drop the ' + self.name + '.');
  self['loc'] = currentRoom.name;
}
TakableItem.prototype.take = function(self) {
  msg('You take the ' + self.name + '.');
  self['loc'] = player.name;
}

function UseableTakableItem(name, hash) {
  Item.call(this, name, hash);
}
UseableTakableItem.prototype = Object.create(TakableItem.prototype);
UseableTakableItem.prototype.heldVerbs = ['Examine', 'Drop', 'Use'];
UseableTakableItem.prototype.hereVerbs = ['Examine', 'Take', 'Use'];


function WearableItem(name, hash) {
  Item.call(this, name, hash);
}
WearableItem.prototype = Object.create(TakableItem.prototype);
WearableItem.prototype.heldVerbs = ['Examine', 'Drop', 'Wear'];
WearableItem.prototype.wornVerbs = ['Examine', 'Remove'];
WearableItem.prototype.wear = function(self) {
  msg('You put on the ' + self.name + '.');
  self['worn'] = true;
}
WearableItem.prototype.remove = function(self) {
  msg('You take off the ' + self.name + '.');
  self['worn'] = false;
}

function SwitchableItem(name, hash) {
  Item.call(this, name, hash);
}
SwitchableItem.prototype.hereVerbs = ['Examine', 'Turn on'];
SwitchableItem.prototype.switchon = function(self) {
  msg('You turn the ' + self.name + ' on.');
  self['switchedon'] = true;
  self['hereVerbs'] = ['Examine', 'Turn off'];
}
SwitchableItem.prototype.switchoff = function(self) {
  msg('You turn the ' + self.name + ' off.');
  self['switchedon'] = false;
  self['hereVerbs'] = ['Examine', 'Turn on'];
}

function SwitchableTakableItem(name, hash) {
  Item.call(this, name, hash);
}
SwitchableTakableItem.prototype = Object.create(TakableItem.prototype);
SwitchableTakableItem.prototype.heldVerbs = ['Examine', 'Drop', 'Turn on'];
SwitchableTakableItem.prototype.hereVerbs = ['Examine', 'Take', 'Turn off'];
SwitchableItem.prototype.switchon = function(self) {
  msg('You turn the ' + self.name + ' on.');
  self['switchedon'] = true;
  self['hereVerbs'] = ['Examine', 'Turn off'];
}
SwitchableItem.prototype.switchoff = function(self) {
  msg('You turn the ' + self.name + ' off.');
  self['switchedon'] = false;
  self['hereVerbs'] = ['Examine', 'Turn on'];
}


function EdibleItem(name, hash) {
  Item.call(this, name, hash);
}
EdibleItem.prototype = Object.create(TakableItem.prototype);
EdibleItem.prototype.heldVerbs = ['Examine', 'Drop', 'Eat'];
EdibleItem.prototype.eat = function(self) {
  msg('You eat the ' + self.name + '.');
  self['loc'] = null;
}



// ============  Data  =======================================

var simpleCommands = {
  look:function() {
    itemAction(room, 'examine');
    return {suppressTurnScript:true};
  },
  help:function() {
    metamsg('This is an experiment in using JavaScript (and a little jQuery) to create a text game. Currently all interactions are via the pane on the right.');
    metamsg('Use the compass rose at the top to move around. Click "Lk" to look at you current location, "Z" to wait or "?" for help.');
    metamsg('Click an item to interact with it, then click the buttons to select an interaction.');
    return {suppressTurnScript:true};
  },    
  wait:function() {
    msg('You wait... nothing happens.');
    return {};
  },
};


