// ============  Output  =======================================

"use strict";

// Various output functions
// The idea is that you can have them display different - or not at all
// So error messages can be displayed in red, meta-data (help., etc)
// is grey, and debug messages can be turned on and off as required
// Note that debug and error messages need a number first
function msg(s, params, cssClass) {
  if (cssClass === undefined) {
    $("#output").append('<p id="n' + io.nextid + '">' + processtext(s, params) + "</p>");
  }
  else {
    $("#output").append('<p id="n' + io.nextid + '" class="' + cssClass + '">' + processtext(s, params) + "</p>");
  }
  io.nextid++;
};
function metamsg(s) {
  $("#output").append('<p id="n' + io.nextid + '" class="meta">' + s + "</p>");
  io.nextid++;
};
function errormsg(errno, s) {
  if (s === undefined) {
    s = errno;
    errno = 0;
  }
  $("#output").append('<p id="n' + io.nextid + '" class="error error' + errno + '">' + s + '</p>');
  io.nextid++;
};
function debugmsg(dbgno, s) {
  if (s === undefined) {
    s = dbgno;
    dbgno = 0;
  }
  if (DEBUG) {
    $("#output").append('<p id="n' + io.nextid + '" class="debug debug' + dbgno + '">' + s + '</p>');
    io.nextid++;
  }
};
function heading(level, s) {
  $("#output").append('<h' + level + ' id="n' + io.nextid + '">' + s + '</h' + level + '>');
  io.nextid++;
};





// If the given attribute is a string it is printed, if it is a
// function it is called. Otherwise an error is generated.
// It isMultiple is true, the object name is prefixed.
// TODO: test array with function
function printOrRun(item, attname, isMultiple, participant) {
  if (!participant) { participant = game.player; }
  if (Array.isArray(item[attname])) {
    debugmsg(0, "Array: " + attname);
    var flag = true;
    for (var i = 0; i < item[attname].length; i++) {
      flag = printOrRun(item, item[attname][i], isMultiple, participant) && flag;
    }
    return flag;
  }
  if (Array.isArray(attname)) {
    var flag = true;
    for (var i = 0; i < attname.length; i++) {
      flag = printOrRun(item, attname[i], isMultiple, participant) && flag;
    }
    return flag;
  }
  else if (!item[attname]) {
    if (typeof attname === "function"){
      return attname(item, isMultiple, participant);
    }
    else {
      msg(attname);
      return true;
    }
  }  
  else if (typeof item[attname] === "string") {
    msg(prefix(item, isMultiple) + item[attname]);
    return true;
  }
  else if (typeof item[attname] === "function"){
    return item[attname](isMultiple, participant);
  }
  else {
    errormsg(ERR_GAME_BUG, ERROR_MSG_OR_RUN);
    return false;
  }
};




// Clears the screen
function clearScreen() {
  for (var i = 0; i < io.nextid; i++) {
    $('#n' + i).remove();
  }
};


// Use like this:
//      showMenu('What is your favourite color?', ['Blue', 'Red', 'Yellow', 'Pink'], function(result) {
//        msg("You picked " + result + ".");
//      });
function showMenu(title, options, fn) {
  io.menuStartId = io.nextid;
  io.menuFn = fn;
  io.menuOptions = options;
  io.inputDisabled = true;
  $('#textbox').prop('disabled', true);
  msg(title, 'menutitle');
  for (var s, i = 0; i < options.length; i++) {
    s = '<a class="menuoption" onclick="io.menuResponse(' + i + ')">';
    s += (typeof options[i] === "string" ? options[i] : options[i].alias);
    s += '</a>';
    msg(s);
  }
};





// This should be called after each turn to ensure we are at the end of the page and the text box has the focus
function endTurnUI() {
  // set the EXITS
  for (var i = 0; i < EXITS.length; i++) {
    if (hasExit(game.room, EXITS[i].name) || ['Look', 'Help', 'Wait'].includes(EXITS[i].name)) {
      $('#exit' + EXITS[i].name).show();
    }
    else {
      $('#exit' + EXITS[i].name).hide();
    }
  }
  io.updateStatus();
  // scroll to end
  setTimeout("window.scrollTo(0,document.getElementById('main').scrollHeight);",1);
  // give focus to command bar
  if (TEXT_INPUT) { $('#textbox').focus(); }
}







function cmdLink(command, str) {
  return '<a class="cmdlink" onclick="parser.parse(\'' + command + '\')">' + str + "</a>";
}


// ============  Hidden from creators!  =======================================




var io = {};

io.mapHeight = 200;
io.mapWidth = 300;

io.map = function() {
  var s = '<svg width="' + io.mapWidth + '" height="' + io.mapHeight + '">';
  s += io.rect(0, 0, io.mapWidth, io.mapHeight, "#f0f0f0");
  s += io.rect(20, 20, 40, 40, "red");
  s += io.circle(60, 60, 40, "yellow");
  
  
  s += "</svg>";
  msg(s); 
}


io.rect = function(x, y, w, h, c) {
  return '<rect width="' + w + '" height="' + h + '" x="' + x + '" y="' + y + '" style="fill:' + c + ';stroke-width:1;stroke:black" />'
}
io.circle = function(x, y, r, c) {
  return '<circle r="' + r + '" cx="' + x + '" cy="' + y + '" style="fill:' + c + ';stroke-width:1;stroke:black" />'
}


// Each line that is output is given an id, n plus an id number.
io.nextid = 0;
// This is used by showMenu to prevent the user ignoring the menu
io.inputDisabled = false;
// Also used by showMenu
io.menuStartId;
io.menuFn;
io.menuOptions;
// A list of names for items currently display in the inventory panes
io.currentItemList = [];


io.updateUIItems = function() {
  for (var i = 0; i < INVENTORIES.length; i++) {
    $('#' + INVENTORIES[i].alt).empty();
  }
  
  io.currentItemList = [];
  for (var key in w) {
    var item = w[key];
    if (item.display >= DSPY_LIST_EXCLUDE) {
      for (var i = 0; i < INVENTORIES.length; i++) {
        if (INVENTORIES[i].test(item)) {
          io.appendItem(item, INVENTORIES[i].alt);
        }
      }
    }
  }
  io.clickItem('');
};


io.updateStatus = function() {
  $("#status-pane").empty();
  for (var i = 0; i < STATUS.length; i++) {
    if (typeof STATUS[i] === "string") {
      if (game.player[STATUS[i]]) {
        var s = '<tr><td width="' + STATUS_WIDTH_LEFT + '">' + sentenceCase(STATUS[i]) + "</td>";
        s += '<td width="' + STATUS_WIDTH_RIGHT + '">' + game.player[STATUS[i]] + "</td></tr>";
        $("#status-pane").append(s);
      }
    }
    else if (typeof STATUS[i] === "function") {
      $("#status-pane").append("<tr>" + STATUS[i]() + "</tr>");
    }
  }
};



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
  if (CMD_ECHO) { io.msgInputText(dir); }
  parser.quickCmd(io.getCommand(dir));
}

io.clickItem = function(itemName) {
  if (io.inputDisabled) { return };

  for (var i = 0; i < io.currentItemList.length; i++) {
    if (io.currentItemList[i] === itemName) {
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
  var item = w[itemName];
  var cmd = io.getCommand(action);
  if (cmd === undefined) {
    errormsg(ERR_GAME_BUG, CMD_PANE_CMD_NOT_FOUND);
  }
  else if (item === undefined) {
    errormsg(ERR_GAME_BUG, CMD_PANE_ITEM_NOT_FOUND);
  }
  else {
    if (CMD_ECHO) { io.msgInputText(action + " " + item.alias); }
    parser.quickCmd(cmd, item);
  }
};


// Add the item to the DIV named htmlDiv
// The item will be given verbs from its attName attribute
io.appendItem = function(item, htmlDiv, isSubItem) {
  $('#' + htmlDiv).append('<p class="item' + (isSubItem ? ' subitem' : '') + '" onclick="io.clickItem(\'' + item.name + '\')">' + item.icon() + item.listalias + "</p>");
  io.currentItemList.push(item.name);
  var verbs = item.getVerbs();
  for (var j = 0; j < verbs.length; j++) {
    var s = '<div class="' + item.name + '-actions itemaction" onclick="io.clickItemAction(\'' + item.name + '\', \'' + verbs[j] + '\')">';
    s += verbs[j];
    s += '</div>';
    $('#' + htmlDiv).append(s);
  }
  if (item.container && !item.closed) {
    var l = scope(isInside, {container:item});
    for (var i = 0; i < l.length; i++) {
      io.appendItem(l[i], htmlDiv, true);
    }
  }
};

// Creates the panes on the left or right
// Should only be called once, when the page is first built
io.createPanes = function() {
  document.writeln('<div id="panes" class="sidepanes sidepanes' + PANES + '">');

  if (COMPASS) {
    document.writeln('<table>');
    for (var i = 0; i < 3; i++) {
      document.writeln('<tr>');
      io.writeExit(0 + 5 * i);
      io.writeExit(1 + 5 * i);
      io.writeExit(2 + 5 * i);
      document.writeln('<td></td>');
      io.writeExit(3 + 5 * i);
      io.writeExit(4 + 5 * i);
      document.writeln('</tr>');
    }
    document.writeln('</table>');
  }

  if (STATUS_PANE) {
    document.writeln('<hr/>');
    document.writeln('<h4>' + STATUS_PANE + ':</h4>');
    document.writeln('<table id="status-pane">');
    document.writeln('</table>');
  }
  
  for (var i = 0; i < INVENTORIES.length; i++) {
    document.writeln('<hr/>');
    document.writeln('<h4>' + INVENTORIES[i].name + ':</h4>');
    document.writeln('<div id="' + INVENTORIES[i].alt + '">');
    document.writeln('</div>');
  }

  document.writeln('</div>');
};


io.writeExit = function(n) {
  document.writeln('<td class="compassbutton">');
  document.writeln('<span class="compassbutton" id="exit' + EXITS[n].name + '" onclick="io.clickExit(\'' + EXITS[n].name + '\')">' + EXITS[n].abbrev + '</span>');
  document.writeln('</td>');
};



// Gets the command with the given name
io.getCommand = function(name) {
  var found = commands.find(function(el) {
    return el.name === name;
  });
  return found;
};


io.msgInputText = function(s) {
  msg("> " + s, {}, "inputtext");
}

io.keycodes = {
  97:"southeast",
  98:"south",
  99:"southeast",
  100:"west",
  101:"look",
  102:"east",
  103:"northwest",
  104:"north",
  105:"northeast",  
};


io.savedCommands = ['help'];
io.savedCommandsPos = 0;
$(document).ready(function() {
  $('#textbox').keydown(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === 13){
      var s = $('#textbox').val();
      if (CMD_ECHO) { io.msgInputText(s); }
      if (s) {
        io.savedCommands.push(s);
        io.savedCommandsPos = io.savedCommands.length;
        parser.parse(s);
        $('#textbox').val('');
      }
    }
    if(io.keycodes[keycode]){
      if (CMD_ECHO) { io.msgInputText(io.keycodes[keycode]); }
      setTimeout(function() { $('#textbox').val(''); }, 1);
      parser.parse(io.keycodes[keycode]);
    }
    if(keycode === 37){
      // left arrow
      if (event.shiftKey) {
        if (CMD_ECHO) { io.msgInputText("west"); }
        parser.parse("west");
        $('#textbox').val('');
      }
    }
    if(keycode === 38){
      // up arrow
      if (event.shiftKey) {
        if (CMD_ECHO) { io.msgInputText("north"); }
        parser.parse("north");
        $('#textbox').val('');
      }
      else {
        io.savedCommandsPos -= 1;
        if (io.savedCommandsPos < 0) { io.savedCommandsPos = 0; }
        $('#textbox').val(io.savedCommands[io.savedCommandsPos]);
      }
    }
    if(keycode === 39){
      // right arrow
      if (event.shiftKey) {
        if (CMD_ECHO) { io.msgInputText("east"); }
        parser.parse("east");
        $('#textbox').val('');
      }
    }
    if(keycode === 40){
      // down arrow
      if (event.shiftKey) {
        if (CMD_ECHO) { io.msgInputText("south"); }
        parser.parse("south");
        $('#textbox').val('');
      }
      else {
        io.savedCommandsPos += 1;
        if (io.savedCommandsPos >= io.savedCommands.length) { io.savedCommandsPos = io.savedCommands.length - 1; }
        $('#textbox').val(io.savedCommands[io.savedCommandsPos]);
      }
    }
    if(keycode === 27){
      // ESC
      $('#textbox').val('');
    }
  });    
  init();
  setup();
  setRoom(game.player.loc);
  endTurnUI();
});