// ============  Output  =======================================

"use strict";

// Various output functions
// The idea is that you can have them display different - or not at all
// So error messages can be displayed in red, meta-data (help., etc)
// is grey, and debug messages can be turned on and off as required
// Note that debug and error messages like a number first
// Note that only msg uses the text processor (so if there is an issue with
// the text processor, we can use the others to report it)
// Note that test captures output with msg and errormsg, but not debugmsg

// Should all be language neutral



// Output a standard message
// The string will first be passed through the text processor.
// Additional data can be put in the optional params dictionary.
// You can specify a CSS class to use.
// During unit testing, messages will be saved and tested
function msg(s, params, cssClass) {
  var processed = processtext(s, params).trim();
  if (processed === "") return;
  
  if (test.testing) {
    test.testOutput.push(processed);
    return;
  }
  if (cssClass === undefined) {
    $("#output").append('<p id="n' + io.nextid + '">' + processed + "</p>");
  }
  else {
    $("#output").append('<p id="n' + io.nextid + '" class="' + cssClass + '">' + processed + "</p>");
  }
  io.nextid++;
}

// Output a meta-message - a message to inform the player about something outside the game world,
// such as hints and help messages.
// The string will first be passed through the text processor.
// Additional data can be put in the optional params dictionary.
// During unit testing, messages will be saved and tested
function metamsg(s, params) {
  var processed = processtext(s, params);
  if (test.testing) {
    test.testOutput.push(processed);
    return;
  }
  $("#output").append('<p id="n' + io.nextid + '" class="meta">' + processed + "</p>");
  io.nextid++;
}

// Output an error message.
// Use for when something has gone wrong, but not when the player types something odd.
// Can have a number to indicate the type of error (see util.js).
// During unit testing, error messages will be saved and tested.
// Does not use the text processor.
function errormsg(errno, s) {
  if (s === undefined) {
    s = errno;
    errno = 0;
  }
  if (test.testing) {
    test.testOutput.push(s);
    return;
  }
  $("#output").append('<p id="n' + io.nextid + '" class="error error' + errno + '">' + s + '</p>');
  io.nextid++;
}

// Output a debug message.
// Debug messages are ignored if DEBUG is false
// and are printed normally during unit testing.
// Does not use the text processor.
function debugmsg(s) {
  if (DEBUG) {
    $("#output").append('<p id="n' + io.nextid + '" class="debug">' + s + '</p>');
    io.nextid++;
  }
}

// Output using HTML headings. The number is required, and should be from 1 to 6
// with 1 being the top most heading.
// The string will first be passed through the text processor.
// Headings are ignored during unit testing.
function heading(level, s, params) {
  var processed = processtext(s, params);
  if (!test.testing) {
    $("#output").append('<h' + level + ' id="n' + io.nextid + '">' + processed + '</h' + level + '>');
    io.nextid++;
  }
}





// If the given attribute is a string it is printed, if it is a
// function it is called. Otherwise an error is generated.
// It isMultiple is true, the object name is prefixed.
// TODO: test array with function
function printOrRun(char, item, attname, isMultiple) {
  var flag, i;
  if (!char) { char = game.player; }
  if (Array.isArray(item[attname])) {
    // the attribute is an array
    debugmsg(0, "Array: " + attname);
    flag = true;
    for (i = 0; i < item[attname].length; i++) {
      flag = printOrRun(char, item, item[attname][i], isMultiple) && flag;
    }
    return flag;
  }
  if (Array.isArray(attname)) {
    // The value is an array
    flag = true;
    for (i = 0; i < attname.length; i++) {
      flag = printOrRun(char, item, attname[i], isMultiple) && flag;
    }
    return flag;
  }
  else if (!item[attname]) {
    // This is not an attribute
    if (typeof attname === "function"){
      return attname(item, isMultiple, char);
    }
    else {
      msg(attname);
      return true;
    }
  }  
  else if (typeof item[attname] === "string") {
    // The attribute is a string
    msg(prefix(item, isMultiple) + item[attname]);
    return true;
  }
  else if (typeof item[attname] === "function"){
    // The attribute is a function
    return item[attname](isMultiple, char);
  }
  else {
    errormsg(ERR_GAME_BUG, ERROR_MSG_OR_RUN);
    return false;
  }
}




// Clears the screen
function clearScreen() {
  for (var i = 0; i < io.nextid; i++) {
    $('#n' + i).remove();
  }
}


// Use like this:
//      showMenu('What is your favourite color?', ['Blue', 'Red', 'Yellow', 'Pink'], function(result) {
//        msg("You picked " + result + ".");
//      });
function showMenu(title, options, fn) {
  io.menuStartId = io.nextid;
  io.menuFn = fn;
  io.menuOptions = options;
  
  if (test.testing) {
    io.menuResponse(test.menuResponseNumber);
    return; 
  }
  
  io.disable();
  msg(title, {}, 'menutitle');
  for (var s, i = 0; i < options.length; i++) {
    s = '<a class="menuoption" onclick="io.menuResponse(' + i + ')">';
    s += (typeof options[i] === "string" ? options[i] : options[i].alias);
    s += '</a>';
    msg(s);
  }
}




// This should be called after each turn to ensure we are at the end of the page and the text box has the focus
function endTurnUI(update) {
  if (PANES !== 'None' && update) {
    // set the EXITS
    for (var i = 0; i < EXITS.length; i++) {
      if (hasExit(game.room, EXITS[i].name) || EXITS[i].nocmd) {
        $('#exit' + EXITS[i].name).show();
      }
      else {
        $('#exit' + EXITS[i].name).hide();
      }
    }
    io.updateStatus();
  }

  // scroll to end
  setTimeout(io.scrollToEnd,1);
  // give focus to command bar
  if (TEXT_INPUT) { $('#textbox').focus(); }
}







function cmdLink(command, str) {
  return '<a class="cmdlink" onclick="parser.parse(\'' + command + '\')">' + str + "</a>";
}


// ============  Hidden from creators!  =======================================




var io = {};

io.scrollToEnd = function() {
   window.scrollTo(0,document.getElementById('main').scrollHeight);  
};

io.mapHeight = 200;
io.mapWidth = 300;

io.map = function() {
  var s = '<svg width="' + io.mapWidth + '" height="' + io.mapHeight + '">';
  s += io.rect(0, 0, io.mapWidth, io.mapHeight, "#f0f0f0");
  s += io.rect(20, 20, 40, 40, "red");
  s += io.circle(60, 60, 40, "yellow");
  
  
  s += "</svg>";
  msg(s); 
};


io.rect = function(x, y, w, h, c) {
  return '<rect width="' + w + '" height="' + h + '" x="' + x + '" y="' + y + '" style="fill:' + c + ';stroke-width:1;stroke:black" />';
};
io.circle = function(x, y, r, c) {
  return '<circle r="' + r + '" cx="' + x + '" cy="' + y + '" style="fill:' + c + ';stroke-width:1;stroke:black" />';
};


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



io.disable = function() {
  io.inputDisabled = true;
  $('#input').css('display', "none");
  $('.compassbutton').css('color', '#808080');
  $('.item').css('color', '#808080');
  $('.itemaction').css('color', '#808080');
};

io.enable = function() {
  io.inputDisabled = false;
  $('#input').css('display', "block");
  $('.compassbutton').css('color', io.textColour);
  $('.item').css('color', io.textColour);
  $('.itemaction').css('color', io.textColour);
};


io.updateUIItems = function() {
  if (PANES === 'None') { return; }

  for (var i = 0; i < INVENTORIES.length; i++) {
    $('#' + INVENTORIES[i].alt).empty();
  }
  
  io.currentItemList = [];
  for (var key in w) {
    var item = w[key];
    if (item.display >= DSPY_LIST_EXCLUDE) {
      for (i = 0; i < INVENTORIES.length; i++) {
        var loc = INVENTORIES[i].getLoc();
        if (INVENTORIES[i].test(item)) {
          io.appendItem(item, INVENTORIES[i].alt, loc);
        }
      }
    }
  }
  io.clickItem('');
};


io.updateStatus = function() {
  if (!STATUS_PANE) return;
  
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
  io.enable();
  $('#input').css('display', "block");
  //$('#textbox').prop('disabled', false);
  for (var i = io.menuStartId; i < io.nextid; i++) {
    $('#n' + i).remove();
  }
  io.menuFn(io.menuOptions[n]);
};

io.clickExit = function(dir) {
  if (io.inputDisabled) return;

  var failed = false;
  if (CMD_ECHO) { io.msgInputText(dir); }
  parser.quickCmd(io.getCommand(dir));
};

io.clickItem = function(itemName) {
  if (io.inputDisabled) return;

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
  if (io.inputDisabled) return;

  var failed = false;
  var item = w[itemName];
  var cmd = io.getCommand(action);
  if (cmd === undefined) {
    errormsg(ERR_GAME_BUG, CMD_PANE_CMD_NOT_FOUND(action));
  }
  else if (item === undefined) {
    errormsg(ERR_GAME_BUG, CMD_PANE_ITEM_NOT_FOUND(itemName));
  }
  else {
    if (CMD_ECHO) { io.msgInputText(action + " " + item.alias); }
    parser.quickCmd(cmd, item);
  }
};


// Add the item to the DIV named htmlDiv
// The item will be given verbs from its attName attribute
io.appendItem = function(item, htmlDiv, loc, isSubItem) {
  $('#' + htmlDiv).append('<p class="item' + (isSubItem ? ' subitem' : '') + '" onclick="io.clickItem(\'' + item.name + '\')">' + item.icon() + item.getListAlias(loc) + "</p>");
  io.currentItemList.push(item.name);
  var verbs = item.getVerbs(loc);
  for (var j = 0; j < verbs.length; j++) {
    var s = '<div class="' + item.name + '-actions itemaction" onclick="io.clickItemAction(\'' + item.name + '\', \'' + verbs[j] + '\')">';
    s += verbs[j];
    s += '</div>';
    $('#' + htmlDiv).append(s);
  }
  if (item.container && !item.closed) {
    var l = scope(isInside, {container:item});
    for (var i = 0; i < l.length; i++) {
      io.appendItem(l[i], htmlDiv, loc, true);
    }
  }
};

// Creates the panes on the left or right
// Should only be called once, when the page is first built
io.createPanes = function() {
  if (PANES === 'None') { return; }
  document.writeln('<div id="panes" class="sidepanes sidepanes' + PANES + '">');

  if (COMPASS) {
    document.writeln((typeof DIVIDER !== 'undefined') ? '<img src="images/' + DIVIDER + '" />' : '<hr/>');
    document.writeln('<table id="compass-table">');
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
    document.writeln((typeof DIVIDER !== 'undefined') ? '<img src="images/' + DIVIDER + '" />' : '<hr/>');
    document.writeln('<h4>' + STATUS_PANE + ':</h4>');
    document.writeln('<table id="status-pane">');
    document.writeln('</table>');
  }
  
  for (i = 0; i < INVENTORIES.length; i++) {
    document.writeln((typeof DIVIDER !== 'undefined') ? '<img src="images/' + DIVIDER + '" />' : '<hr/>');
    document.writeln('<h4>' + INVENTORIES[i].name + ':</h4>');
    document.writeln('<div id="' + INVENTORIES[i].alt + '">');
    document.writeln('</div>');
  }
  document.writeln((typeof DIVIDER !== 'undefined') ? '<img src="images/' + DIVIDER + '" />' : '<hr/>');
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
};

io.keycodes = {
  97:EXITS[10].name,
  98:EXITS[11].name,
  99:EXITS[12].name,
  100:EXITS[5].name,
  101:EXITS[6].name,
  102:EXITS[7].name,
  103:EXITS[0].name,
  104:EXITS[1].name,
  105:EXITS[2].name,  
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
        if (CMD_ECHO) { io.msgInputText(EXITS[5].name); }
        parser.parse(EXITS[5].name);
        $('#textbox').val('');
      }
    }
    if(keycode === 38){
      // up arrow
      if (event.shiftKey) {
        if (CMD_ECHO) { io.msgInputText(EXITS[1].name); }
        parser.parse(EXITS[1].name);
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
        if (CMD_ECHO) { io.msgInputText(EXITS[7].name); }
        parser.parse(EXITS[7].name);
        $('#textbox').val('');
      }
    }
    if(keycode === 40){
      // down arrow
      if (event.shiftKey) {
        if (CMD_ECHO) { io.msgInputText(EXITS[11].name); }
        parser.parse(EXITS[11].name);
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
  io.textColour = $(".sidepanes").css("color");
  game.update();
  world.setBackground();
  setup();
  enterRoom(game.room);
  endTurnUI(true);
});
