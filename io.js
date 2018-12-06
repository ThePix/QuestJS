// ============  Output  =======================================

var nextid = 0;
msg = function(s, cssClass) {
  if (cssClass == undefined) {
    $('#output').append('<p id="n' + nextid + '">' + s + '</p>');
  }
  else {
    $('#output').append('<p id="n' + nextid + '" class="' + cssClass + '">' + s + '</p>');
  }
  nextid++;
};
metamsg = function(s) {
  $('#output').append('<p id="n' + nextid + '" class="meta">' + s + '</p>');
  nextid++;
};
errormsg = function(errno, s) {
  $('#output').append('<p id="n' + nextid + '" class="error"><span class="error' + errno + '">' + s + '</span></p>');
  nextid++;
};
debugmsg = function(dbgno, s) {
  $('#output').append('<p id="n' + nextid + '" class="debug"><span class="debug' + dbgno + '">' + s + '</span></p>');
  nextid++;
};
heading = function(level, s) {
  $('#output').append('<h' + level + ' id="n' + nextid + '">' + s + '</h' + level + '>');
  nextid++;
};




// ============  Input  =======================================







var clicksDisabled = false;

clickExit = function(dir) {
  if (clicksDisabled) { return };

  var failed = false;      
  dir = dir.toLowerCase();
  if (['look', 'help', 'wait'].includes(dir)) {
    simpleCommands[dir]();
  }
  else {
    msg("Heading " + dir);
    currentRoom = findInData(player.loc);

    if (!(dir in currentRoom)) {
      errormsg(1, "Unsupported direction '" + dir + "' for location");
      failed = true;
    }
    else {
      ex = currentRoom[dir];
      if (typeof ex == 'string') {
        setRoom(ex)
      }
      else if (typeof ex === "function"){
        ex(currentRoom);
      }
      else if (typeof ex === "object"){
        var fn = ex['use'];
        fn(ex);
      }
      else {
        errormsg(1, "Unsupported type for direction");
      failed = true;
      }
    }
  }
  endTurn({commandFailed:failed});
};

clickAction = function(action) {
  if (clicksDisabled) { return };

  var failed = false;
  debugmsg(3, "Trying to do " + action)
  if (typeof simpleCommands[action] === "function"){
    simpleCommands[action]();
  }
  else {
    errormsg(1, "Unsupported action");
    failed = true;
  }
  endTurn({commandFailed:failed});
};

clickItem = function(itemName) {
  if (clicksDisabled) { return };

  for (var i = 0; i < currentItemList.length; i++) {
    if (currentItemList[i] == itemName) {
      $('.' + currentItemList[i] + '-actions').toggle();
    }
    else {
      $('.' + currentItemList[i] + '-actions').hide();
    }
  }
};

clickItemAction = function(itemName, action) {
  if (clicksDisabled) { return };

  var failed = false;
  var item = findInData(itemName);
  action = action.toLowerCase();
  if (!(action in item)) {
    errormsg(1, "Unsupported verb '" + action + "' for object")
    failed = true;
  }
  else if (typeof item[action] == 'string') {
    msg(item[action]);
  }
  else if (typeof item[action] === "function"){
    var fn = item[action];
    fn(item);
    updateUIItems();
  }
  else {
    errormsg(1, "Unsupported type for verb");
    failed = true;
  }
  endTurn({commandFailed:failed});
};



// These will probably disappear and become part of the parser, but currently handle button clicks.

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


// ============  UI  =======================================

var currentItemList = [];


updateUIItems = function() {
  for (var i = 0; i < inventories.length; i++) {
    $('#' + inventories[i].alt).empty();
  }

  currentItemList = [];
  for (var j = 0; j < data.length; j++) {
    if (data[j].display == "visible") {
      for (var i = 0; i < inventories.length; i++) {
        if (inventories[i].test(data[j])) {
          _appendItem(data[j], inventories[i].verbs, inventories[i].alt);
        }
      }
    }
  }
  clickItem('');
};

_appendItem = function(item, attName, htmlDiv) {
  $('#' + htmlDiv).append('<p class="item" onclick="clickItem(\'' + item.name + '\')">' + item.name + '</p>');
  currentItemList.push(item.name);
  if (item[attName]) {
    for (var j = 0; j < item[attName].length; j++) {
      $('#' + htmlDiv).append('<div class="' + item.name + '-actions"><p class="itemaction" onclick="clickItemAction(\'' + item.name + '\', \'' + item[attName][j] + '\')">' + item[attName][j] + '</p></div>');
    }
  }
  else {
    errormsg(1, "No " + attName + " for " + item.name );
  }
};



updateUIExits = function(room) {
  for (var i = 0; i < exits.length; i++) {
    if (exits[i].name in room || ['look', 'help', 'wait'].includes(exits[i].name)) {
      $('#exit' + exits[i].name).show();
    }
    else {
      $('#exit' + exits[i].name).hide();
    }
  }
};


// This should be called after each turn to ensure we are at the end of the page and the text box has the focus
endTurnUI = function() {
  setTimeout("window.scrollTo(0,document.getElementById('main').scrollHeight);",1);
  if (TEXT_INPUT) { $('#textbox').focus(); }
}



var menuStartId;
var menuFn;
var menuOptions;

  //showMenu('What is your favourite color?', ['Blue', 'Red', 'Yellow', 'Pink'], function(result) {
  //  msg("You picked " + result + ".");
  //});


showMenu = function(title, options, fn) {
  menuStartId = nextid;
  menuFn = fn;
  menuOptions = options;
  clicksDisabled = true;
  $('#textbox').prop('disabled', true);
  msg(title, 'menutitle');
  for (var s, i = 0; i < options.length; i++) {
    s = '<a class="menuoption" onclick="menuResponse(' + i + ')">';
    s += (typeof options[i] == "string" ? options[i] : options[i].name);
    s += '</a>';
    msg(s);
  }
};

menuResponse = function(n) {
  clicksDisabled = false;
  $('#textbox').prop('disabled', false);
  for (var i = menuStartId; i < nextid; i++) {
    $('#n' + i).remove();
  }
  menuFn(menuOptions[n]);
};


clearScreen = function() {
  for (var i = 0; i < nextid; i++) {
    $('#n' + i).remove();
  }
};