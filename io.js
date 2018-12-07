// ============  Output  =======================================


msg = function(s, cssClass) {
  if (cssClass == undefined) {
    $('#output').append('<p id="n' + io.nextid + '">' + s + '</p>');
  }
  else {
    $('#output').append('<p id="n' + io.nextid + '" class="' + cssClass + '">' + s + '</p>');
  }
  io.nextid++;
};
metamsg = function(s) {
  $('#output').append('<p id="n' + io.nextid + '" class="meta">' + s + '</p>');
  io.nextid++;
};
errormsg = function(errno, s) {
  $('#output').append('<p id="n' + io.nextid + '" class="error"><span class="error' + errno + '">' + s + '</span></p>');
  io.nextid++;
};
debugmsg = function(dbgno, s) {
  $('#output').append('<p id="n' + io.nextid + '" class="debug"><span class="debug' + dbgno + '">' + s + '</span></p>');
  io.nextid++;
};
heading = function(level, s) {
  $('#output').append('<h' + level + ' id="n' + io.nextid + '">' + s + '</h' + level + '>');
  io.nextid++;
};



clearScreen = function() {
  for (var i = 0; i < io.nextid; i++) {
    $('#n' + i).remove();
  }
};

//showMenu('What is your favourite color?', ['Blue', 'Red', 'Yellow', 'Pink'], function(result) {
//  msg("You picked " + result + ".");
//});
  
showMenu = function(title, options, fn) {
  io.menuStartId = io.nextid;
  io.menuFn = fn;
  io.menuOptions = options;
  io.inputDisabled = true;
  $('#textbox').prop('disabled', true);
  msg(title, 'menutitle');
  for (var s, i = 0; i < options.length; i++) {
    s = '<a class="menuoption" onclick="io.menuResponse(' + i + ')">';
    s += (typeof options[i] == "string" ? options[i] : options[i].name);
    s += '</a>';
    msg(s);
  }
};

// ============  Input  =======================================




var io = {};


io.nextid = 0;
io.inputDisabled = false;

io.menuStartId;
io.menuFn;
io.menuOptions;

// A list of htmlNames for items currently display in the inventory panes
io.currentItemList = [];


io.menuResponse = function(n) {
  io.inputDisabled = false;
  $('#textbox').prop('disabled', false);
  for (var i = io.menuStartId; i < io.nextid; i++) {
    $('#n' + i).remove();
  }
  io.menuFn(io.menuOptions[n]);
};



clickExit = function(dir) {
  if (io.inputDisabled) { return };

  var failed = false;      
  dir = dir.toLowerCase();
  if (['look', 'help', 'wait'].includes(dir)) {
    simpleCommands[dir]();
  }
  else {
    msg("Heading " + dir);
    currentRoom = getObject(player.loc);

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
  if (io.inputDisabled) { return };

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
  if (io.inputDisabled) { return };

  for (var i = 0; i < io.currentItemList.length; i++) {
    if (io.currentItemList[i] == itemName) {
      $('.' + io.currentItemList[i] + '-actions').toggle();
    }
    else {
      $('.' + io.currentItemList[i] + '-actions').hide();
    }
  }
};

clickItemAction = function(itemName, action) {
  if (io.inputDisabled) { return };

  var failed = false;
  var item = getObject(itemName, true);
  var cmd = getCommand(action);
  if (cmd == undefined) {
    errormsg(10, BUG_PANE_CMD_NOT_FOUND);
  }
  else if (item == undefined) {
    errormsg(10, BUG_PANE_ITEM_NOT_FOUND);
  }
  else {
    debugmsg(4, item.name);
    debugmsg(4, cmd.name);
    parser.quickCmd(cmd, item);
  }
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



updateUIItems = function() {
  for (var i = 0; i < inventories.length; i++) {
    $('#' + inventories[i].alt).empty();
  }

  io.currentItemList = [];
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
  $('#' + htmlDiv).append('<p class="item" onclick="clickItem(\'' + item.htmlName + '\')">' + item.name + '</p>');
  io.currentItemList.push(item.htmlName);
  if (item[attName]) {
    for (var j = 0; j < item[attName].length; j++) {
      $('#' + htmlDiv).append('<div class="' + item.htmlName + '-actions"><p class="itemaction" onclick="clickItemAction(\'' + item.htmlName + '\', \'' + item[attName][j] + '\')">' + item[attName][j] + '</p></div>');
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










