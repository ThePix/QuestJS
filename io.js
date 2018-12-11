// ============  Output  =======================================

// Various output functions
// The idea is that you can have them display different - or not at all
// So error messages can be displayed in red, meta-data (help., etc)
// is grey, and debug messages can be turned on and off as required
// Note that debug and error messages need a number first
msg = function(s, cssClass) {
  if (cssClass == undefined) {
    $("#output").append('<p id="n' + io.nextid + '">' + s + "</p>");
  }
  else {
    $("#output").append('<p id="n' + io.nextid + '" class="' + cssClass + '">' + s + "</p>");
  }
  io.nextid++;
};
metamsg = function(s) {
  $("#output").append('<p id="n' + io.nextid + '" class="meta">' + s + "</p>");
  io.nextid++;
};
errormsg = function(errno, s) {
  $("#output").append('<p id="n' + io.nextid + '" class="error"><span class="error' + errno + '">' + s + '</span></p>');
  io.nextid++;
};
debugmsg = function(dbgno, s) {
  $("#output").append('<p id="n' + io.nextid + '" class="debug"><span class="debug' + dbgno + '">' + s + '</span></p>');
  io.nextid++;
};
heading = function(level, s) {
  $("#output").append('<h' + level + ' id="n' + io.nextid + '">' + s + '</h' + level + '>');
  io.nextid++;
};


// Clears the screen
clearScreen = function() {
  for (var i = 0; i < io.nextid; i++) {
    $('#n' + i).remove();
  }
};


// Use like this:
//      showMenu('What is your favourite color?', ['Blue', 'Red', 'Yellow', 'Pink'], function(result) {
//        msg("You picked " + result + ".");
//      });
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





// This should be called after each turn to ensure we are at the end of the page and the text box has the focus
endTurnUI = function() {
  // set the EXITS
  room = getObject(player.loc);
  for (var i = 0; i < EXITS.length; i++) {
    if (EXITS[i].name in room || ['Look', 'Help', 'Wait'].includes(EXITS[i].name)) {
      $('#exit' + EXITS[i].name).show();
    }
    else {
      $('#exit' + EXITS[i].name).hide();
    }
  }
  // scroll to end
  setTimeout("window.scrollTo(0,document.getElementById('main').scrollHeight);",1);
  // give focus to command bar
  if (TEXT_INPUT) { $('#textbox').focus(); }
}



updateUIItems = function() {
  for (var i = 0; i < INVENTORIES.length; i++) {
    $('#' + INVENTORIES[i].alt).empty();
  }

  io.currentItemList = [];
  for (var j = 0; j < data.length; j++) {
    if (data[j].display == "visible") {
      for (var i = 0; i < INVENTORIES.length; i++) {
        if (INVENTORIES[i].test(data[j])) {
          io.appendItem(data[j], INVENTORIES[i].verbs, INVENTORIES[i].alt);
        }
      }
    }
  }
  io.clickItem('');
};



// ============  Hidden from creators!  =======================================




var io = {};

// Each line that is output is given an id, n plus an id number.
io.nextid = 0;
// This is used by showMenu to prevent the user ignoring the menu
io.inputDisabled = false;
// Also used by showMenu
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

io.clickExit = function(dir) {
  if (io.inputDisabled) { return };

  var failed = false;
  msg(dir);
  parser.quickCmd(getCommand(dir));
}

io.clickItem = function(itemName) {
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

io.clickItemAction = function(itemName, action) {
  if (io.inputDisabled) { return };

  var failed = false;
  var item = getObject(itemName, true);
  var cmd = getCommand(action);
  if (cmd == undefined) {
    errormsg(ERR_GAME_BUG, CMD_PANE_CMD_NOT_FOUND);
  }
  else if (item == undefined) {
    errormsg(ERR_GAME_BUG, CMD_PANE_ITEM_NOT_FOUND);
  }
  else {
    debugmsg(4, item.name);
    debugmsg(4, cmd.name);
    parser.quickCmd(cmd, item);
  }
};

io.appendItem = function(item, attName, htmlDiv) {
  $('#' + htmlDiv).append('<p class="item" onclick="io.clickItem(\'' + item.htmlName + '\')">' + item.name + "</p>");
  io.currentItemList.push(item.htmlName);
  if (item[attName]) {
    for (var j = 0; j < item[attName].length; j++) {
      $('#' + htmlDiv).append('<div class="' + item.htmlName + '-actions"><p class="itemaction" onclick="io.clickItemAction(\'' + item.htmlName + '\', \'' + item[attName][j] + '\')">' + item[attName][j] + '</p></div>');
    }
  }
  else {
    errormsg(ERR_GAME_BUG, "No " + attName + " for " + item.name );
  }
};

io.createPanes = function() {
  document.writeln('<div id="panes" class="sidenav' + PANES + '">');

  writeExit = function(n) {
    document.writeln('<td class="compassbutton">');
    document.writeln('<span class="compassbutton" id="exit' + EXITS[n].name + '" onclick="io.clickExit(\'' + EXITS[n].name + '\')">' + EXITS[n].abbrev + '</span>');
    document.writeln('</td>');
  };

  if (COMPASS) {
    document.writeln('<table>');
    for (var i = 0; i < 3; i++) {
      document.writeln('<tr>');
      writeExit(0 + 5 * i);
      writeExit(1 + 5 * i);
      writeExit(2 + 5 * i);
      document.writeln('<td></td>');
      writeExit(3 + 5 * i);
      writeExit(4 + 5 * i);
      document.writeln('</tr>');
    }
    document.writeln('</table>');
  }

  for (var i = 0; i < INVENTORIES.length; i++) {
    document.writeln('<hr/>');
    document.writeln('<h6>' + INVENTORIES[i].name + ':</h6>');
    document.writeln('<div id="' + INVENTORIES[i].alt + '">');
    document.writeln('</div>');
  }

  document.writeln('</div>');
};





io.savedCommands = ['help'];
io.savedCommandsPos = 0;

$( document ).ready(function() {
  $('#textbox').keydown(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      var s = $('#textbox').val();
      if (CMD_ECHO) { msg(s); }
      io.savedCommands.push(s);
      io.savedCommandsPos = io.savedCommands.length;
      parser.parse(s);
      $('#textbox').val('');
    }
    if(keycode == '37'){
      // left arrow
      if (event.shiftKey) {
        if (CMD_ECHO) { msg("west"); }
        parser.parse("west");
        $('#textbox').val('');
      }
    }
    if(keycode == '38'){
      // up arrow
      if (event.shiftKey) {
        if (CMD_ECHO) { msg("north"); }
        parser.parse("north");
        $('#textbox').val('');
      }
      else {
        io.savedCommandsPos -= 1;
        if (io.savedCommandsPos < 0) { io.savedCommandsPos = 0; }
        $('#textbox').val(io.savedCommands[io.savedCommandsPos]);
      }
    }
    if(keycode == '39'){
      // right arrow
      if (event.shiftKey) {
        if (CMD_ECHO) { msg("east"); }
        parser.parse("east");
        $('#textbox').val('');
      }
    }
    if(keycode == '40'){
      // down arrow
      if (event.shiftKey) {
        if (CMD_ECHO) { msg("south"); }
        parser.parse("south");
        $('#textbox').val('');
      }
      else {
        io.savedCommandsPos += 1;
        if (io.savedCommandsPos >= io.savedCommands.length) { io.savedCommandsPos = io.savedCommands.length - 1; }
        $('#textbox').val(io.savedCommands[io.savedCommandsPos]);
      }
    }
    if(keycode == '27'){
      // ESC
      $('#textbox').val('');
    }
  });    
  init();
  setup();
  setRoom(player.loc, false);
});