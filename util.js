// ============  Utilities  =======================================



sentenceCase = function(str) {
  return str.replace(/[a-z]/i, function (letter) {
    return letter.toUpperCase();
  }).trim();
};





// This is a method to allow the Array.find method to use it
isPlayer = function(item) {
  return item.player;
};


findInData = function(name) {
  var found = data.find(function(element) {
    return element.name == name;
  });
  return found;
};


setRoom = function(roomName) {
  room = findInData(roomName);
  if (room === undefined) {
    return "Failed to find room '" + roomName + "'.";
  }
  //clearScreen();
  player.loc = room.name;
  heading(4, room.name);
  itemAction(room, "examine");
  updateUIExits(room);
  updateUIItems();
};


itemAction = function(item, action) {
  if (!(action in item)) {
    errormsg(1, "Unsupported verb '" + action + "' for object");
  }
  else if (typeof item[action] == "string") {
    msg(item[action]);
  }
  else if (typeof item[action] === "function"){
    var fn = item[action];
    fn(item);
    updateHtml();
  }
  else {
    errormsg(1, "Unsupported type for verb");
  }
};


isPresent = function(item) {
  return item.loc == player.loc || item.loc == player.name;
};
isHeldOrWorn = function(item) {
  return item.loc == player.name;
};
isHeld = function(item) {
  return (item.loc == player.name) && !item.worn;
};
isHere = function(item) {
  return (item.loc == player.loc);
};
isWorn = function(item) {
  return (item.loc == player.name) && item.worn;
};

isNotNotHere = function(item) {
  return item.display != "not here";
};

// To use, do something like this:
// var listOfOjects = scope(isHeld);
scope = function(fn) {
  return data.filter(isNotNotHere).filter(fn);
}


formatList = function(itemArray) {
  var s = itemArray.map(function(el) { return el.name; }).join(", ");

  var lastIndex = s.lastIndexOf(",");
  if (lastIndex === -1) { return s; }
  
  return s.substring(0, lastIndex) + " and" + s.substring(lastIndex + 1);
}
  





var player;


init = function() {
  debugmsg(5, "Beginning startGame");
  // Housekeeping...
  player = data.find(isPlayer);
  if (typeof player == "undefined") {
    errormsg(9, "No player object found. This will not go well...");
  }
  currentRoom = findInData(player.loc);
  if (typeof currentRoom == "undefined") {
    errormsg(9, "No room object found (looking for '" + player.loc + "'). This will not go well...");
  }
  data.forEach(function (el) {
    if (!el.alias) {
      el.alias = el.name;
    }
    el.name = el.name.replace(/\W/g, "");
    if (el.loc == "Held") {
      el.loc = player.name;
    }
    else if (el.loc == "Worn") {
      el.loc = player.name;
      el.worn = true;
    }
  });
  debugmsg(5, "Done");
};




endTurn = function(result) {
  debugmsg(5, "... done (failed=" + result.commandFailed + ")");
  if (!result.suppressTurnScripts && !result.commandFailed) {
    RunTurnScripts();
  }
  setTimeout("window.scrollTo(0,document.getElementById('main').scrollHeight);",1);
};


RunTurnScripts = function() {
  debugmsg(5, "Running turnscripts");
  for (var i = 0; i < data.length; i++) {
    if (typeof data[i]["run"] === "function"){
      if ((("loc" in data[i]) && IsPresent(data[i])) || !("loc" in data[i])) {
        data[i]["run"]();
      }
    }
  }
  debugmsg(5, "... turnscripts done");
};