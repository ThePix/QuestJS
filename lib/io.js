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
  const processed = processText(s, params).trim();
  if (processed === "") return;
  
  if (test.testing) {
    test.testOutput.push(processed);
    return;
  }
  const lines = processed.split(SPLIT_LINES_ON);
  for (let i = 0; i < lines.length; i++) {
    if (cssClass === undefined) {
      io.outputRaw('<p id="n' + io.nextid + '">' + lines[i] + "</p>");
    }
    else {
      io.outputRaw('<p id="n' + io.nextid + '" class="' + cssClass + '">' + lines[i] + "</p>");
    }
    io.nextid++;
    if (game.spoken) io.speak(lines[i]);
  }
}




// Output a meta-message - a message to inform the player about something outside the game world,
// such as hints and help messages.
// The string will first be passed through the text processor.
// Additional data can be put in the optional params dictionary.
// During unit testing, messages will be saved and tested
function metamsg(s, params) {
  const processed = processText(s, params);
  if (test.testing) {
    test.testOutput.push(processed);
    return;
  }
  io.outputRaw('<p id="n' + io.nextid + '" class="meta">' + processed + "</p>");
  io.nextid++;
  if (game.spoken) io.speak(processed);
}

// Output an error message.
// Use for when something has gone wrong, but not when the player types something odd -
// if you see this during play, there is a bug in your game (or my code!)
// During unit testing, error messages will be saved and tested.
// Does not use the text processor.
function errormsg(s) {
  if (test.testing) {
    test.testOutput.push(s);
    return;
  }
  io.outputRaw('<p id="n' + io.nextid + '" class="error">' + s + '</p>');
  io.nextid++;
  if (game.spoken) io.speak("Error: " + s);
}

// Output a message from the parser indicating the input text could not be parsed.
// During unit testing, messages will be saved and tested.
// Does not use the text processor.
function parsermsg(s) {
  if (test.testing) {
    test.testOutput.push(s);
    return;
  }
  io.outputRaw('<p id="n' + io.nextid + '" class="parser">' + s + '</p>');
  io.nextid++;
  if (game.spoken) io.speak("Parser error: " + s);
}

// Output a debug message.
// Debug messages are ignored if DEBUG is false
// and are printed normally during unit testing.
// Does not use the text processor.
// Does not get spoken allowed
function debugmsg(s) {
  if (DEBUG) {
    io.outputRaw('<p id="n' + io.nextid + '" class="debug">' + s + '</p>');
    io.nextid++;
  }
}

// Output using HTML headings. The number is required, and should be from 1 to 6
// with 1 being the top most heading.
// The string will first be passed through the text processor.
// Headings are ignored during unit testing.
function heading(level, s, params) {
  const processed = processText(s, params);
  if (!test.testing) {
    io.outputRaw('<h' + level + ' id="n' + io.nextid + '">' + processed + '</h' + level + '>');
    io.nextid++;
  }
  if (game.spoken) io.speak(s);
}





// If the given attribute is a string it is printed, if it is a
// function it is called. Otherwise an error is generated.
// It isMultiple is true, the object name is prefixed.
// TODO: test array with function
function printOrRun(char, item, attname, isMultiple) {
  let flag, i;
  if (!char) { char = game.player; }
  if (Array.isArray(item[attname])) {
    // the attribute is an array
    //debugmsg(0, "Array: " + attname);
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
    const res = item[attname](isMultiple, char);
    return res;
  }
  else {
    errormsg("Unsupported type for printOrRun");
    return false;
  }
}




// Clears the screen
function clearScreen() {
  for (let i = 0; i < io.nextid; i++) {
    $('#n' + i).remove();
  }
}


function wait(fn) {
  if (test.testing) {
    // If this is part of a unit test, do not wait, just do the function.
    fn();
    return; 
  }
  if (io.waitFns.length === 0) {
    io.disable();
    io.clickToContinueLink();
  }
  io.waitFns.push(fn);
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
    if (test.menuResponseNumber === undefined || test.menuResponseNumber >= options.length) {
      debugmsg("Error when testing menu (possibly due to disambiguation?), test.menuResponseNumber = " + test.menuResponseNumber);
    }
    else {
      io.menuResponse(test.menuResponseNumber);
    }
    return; 
  }
  
  io.disable();
  msg(title, {}, 'menutitle');
  for (let i = 0; i < options.length; i++) {
    let s = '<a class="menuoption" onclick="io.menuResponse(' + i + ')">';
    s += (typeof options[i] === "string" ? options[i] : options[i].alias);
    s += '</a>';
    msg(s);
  }
}




function showDropDown(title, options, fn) {
  io.menuStartId = io.nextid;
  io.menuFn = fn;
  io.menuOptions = options;
  
  if (test.testing) {
    io.menuResponse(test.menuResponseNumber);
    return; 
  }
  debugmsg("options.length=" + options.length);
  io.disable();
  msg(title, {}, 'menutitle');
  let s = '<select id="menu-select" class="custom-select" style="width:400px;" ';
  s += 'onchange=\"io.menuResponse($(\'#menu-select\').find(\':selected\').val())\">';
  s += '<option value="-1">-- Select one --</option>';
  for (let i = 0; i < options.length; i++) {
    s += '<option value="' + i + '">';
    s += (typeof options[i] === "string" ? options[i] : options[i].alias);
    s += '</option>';
  }
  msg(s + "</select>");
  //$('#menu-select').selectmenu();
  $('#menu-select').focus();
}



// This should be called after each turn to ensure we are at the end of the page and the text box has the focus
function endTurnUI(update) {
  //debugmsg("In endTurnUI");
  if (PANES !== 'None' && update) {
    // set the EXITS
    for (let i = 0; i < EXITS.length; i++) {
      if (game.room.hasExit(EXITS[i].name, {excludeScenery:true}) || EXITS[i].nocmd) {
        $('#exit' + EXITS[i].name).show();
      }
      else {
        $('#exit' + EXITS[i].name).hide();
      }
    }
    io.updateStatus();
    io.updateUIItems();
    if (typeof ioUpdateCustom === "function") ioUpdateCustom();
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




const io = {};

io.outputRaw = function(s) {
  $("#output").append(s);
}



io.scrollToEnd = function() {
   window.scrollTo(0,document.getElementById('main').scrollHeight);  
};




io.mapHeight = 200;
io.mapWidth = 300;

io.map = function() {
  let s = '<svg width="' + io.mapWidth + '" height="' + io.mapHeight + '">';
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
io.inputIsDisabled = false;
// Also used by showMenu
io.menuStartId;
io.menuFn;
io.menuOptions;
// A list of names for items currently display in the inventory panes
io.currentItemList = [];

io.setTitle = function(s) {
  document.title = s;
};


io.disable = function() {
  io.inputIsDisabled = true;
  $('#input').css('display', "none");
  $('.compassbutton').css('color', '#808080');
  $('.item').css('color', '#808080');
  $('.itemaction').css('color', '#808080');
};

io.enable = function() {
  io.inputIsDisabled = false;
  $('#input').css('display', "block");
  $('.compassbutton').css('color', io.textColour);
  $('.item').css('color', io.textColour);
  $('.itemaction').css('color', io.textColour);
};



io.updateUIItems = function() {
  if (PANES === 'None') { return; }

  for (let i = 0; i < INVENTORIES.length; i++) {
    $('#' + INVENTORIES[i].alt).empty();
  }
  
  io.currentItemList = [];
  for (let key in w) {
    const item = w[key];
    if (item.display >= DSPY_LIST_EXCLUDE) {
      for (let i = 0; i < INVENTORIES.length; i++) {
        const loc = INVENTORIES[i].getLoc();
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
  for (let i = 0; i < STATUS.length; i++) {
    if (typeof STATUS[i] === "string") {
      if (game.player[STATUS[i]] !== undefined) {
        let s = '<tr><td width="' + STATUS_WIDTH_LEFT + '">' + sentenceCase(STATUS[i]) + "</td>";
        s += '<td width="' + STATUS_WIDTH_RIGHT + '">' + game.player[STATUS[i]] + "</td></tr>";
        $("#status-pane").append(s);
      }
    }
    else if (typeof STATUS[i] === "function") {
      $("#status-pane").append("<tr>" + STATUS[i]() + "</tr>");
    }
  }
};


io.waitFns = [];

io.clickToContinueLink = function() {
  msg('<a class="continue" onclick="io.waitContinue()">' + CLICK_TO_CONTINUE + '</a>');
  io.continuePrintId = io.nextid - 1;
}

io.waitContinue = function() {
  const fn = io.waitFns.shift();
  $('#n' + io.continuePrintId).remove();
  fn();
  if (io.waitFns.length > 0) {
    io.clickToContinueLink();
  }  
  else {
    io.enable();
  }
};



io.menuResponse = function(n) {
  //console.log("Found=" + n);
  io.enable();
  $('#input').css('display', "block");
  //$('#textbox').prop('disabled', false);
  for (let i = io.menuStartId; i < io.nextid; i++) {
    $('#n' + i).remove();
  }
  //console.log("Found=" + io.menuOptions[n]);
  if (n !== -1) io.menuFn(io.menuOptions[n]);
  if (TEXT_INPUT) $('#textbox').focus();
};

io.clickExit = function(dir) {
  if (io.inputIsDisabled) return;

  let failed = false;
  io.msgInputText(dir);
  parser.quickCmd(io.getCommand(dir));
};

io.clickItem = function(itemName) {
  if (io.inputIsDisabled) return;

  for (let i = 0; i < io.currentItemList.length; i++) {
    if (io.currentItemList[i] === itemName) {
      $('.' + io.currentItemList[i] + '-actions').toggle();
    }
    else {
      $('.' + io.currentItemList[i] + '-actions').hide();
    }
  }
};

io.clickItemAction = function(itemName, action) {
  if (io.inputIsDisabled) return;

  let failed = false;
  const item = w[itemName];
  const cmd = io.getCommand(action);
  if (cmd === undefined) {
    errormsg("I don't know that command (" + action + ") - and obviously I should as you just clicked it. Please alert the game author about this bug.");
  }
  else if (item === undefined) {
    errormsg("I don't know that object (" + itemName + ")- and obviously I should as it was listed. Please alert this as a bug in Quest.");
  }
  else {
    io.msgInputText(action + " " + item.alias);
    parser.quickCmd(cmd, item);
  }
};


// Add the item to the DIV named htmlDiv
// The item will be given verbs from its attName attribute
io.appendItem = function(item, htmlDiv, loc, isSubItem) {
  $('#' + htmlDiv).append('<p class="item' + (isSubItem ? ' subitem' : '') + '" onclick="io.clickItem(\'' + item.name + '\')">' + item.icon() + item.getListAlias(loc) + "</p>");
  io.currentItemList.push(item.name);
  const verbs = item.getVerbs(loc);
  for (let j = 0; j < verbs.length; j++) {
    let s = '<div class="' + item.name + '-actions itemaction" onclick="io.clickItemAction(\'' + item.name + '\', \'' + verbs[j] + '\')">';
    s += verbs[j];
    s += '</div>';
    $('#' + htmlDiv).append(s);
  }
  if (item.container && !item.closed) {
    const l = scope(isInside, {container:item});
    for (let i = 0; i < l.length; i++) {
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
    if (typeof DIVIDER !== 'undefined') document.writeln('<img src="images/' + DIVIDER + '" />');
    document.writeln('<div class="paneDiv">');
    document.writeln('<table id="compass-table">');
    for (let i = 0; i < 3; i++) {
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
    document.writeln('</div>');
  }

  if (STATUS_PANE) {
    if (typeof DIVIDER !== 'undefined') document.writeln('<img src="images/' + DIVIDER + '" />');
    document.writeln('<div class="paneDiv">');
    document.writeln('<h4>' + STATUS_PANE + ':</h4>');
    document.writeln('<table id="status-pane">');
    document.writeln('</table>');
    document.writeln('</div>');
  }
  
  for (let i = 0; i < INVENTORIES.length; i++) {
    if (typeof DIVIDER !== 'undefined') document.writeln('<img src="images/' + DIVIDER + '" />');
    document.writeln('<div class="paneDiv">');
    document.writeln('<h4>' + INVENTORIES[i].name + ':</h4>');
    document.writeln('<div id="' + INVENTORIES[i].alt + '">');
    document.writeln('</div>');
    document.writeln('</div>');
  }
  if (typeof DIVIDER !== 'undefined') document.writeln('<img src="images/' + DIVIDER + '" />');
  document.writeln('</div>');

  if (typeof ioCreateCustom === "function") ioCreateCustom();
};


io.writeExit = function(n) {
  document.writeln('<td class="compassbutton">');
  document.writeln('<span class="compassbutton" id="exit' + EXITS[n].name + '" onclick="io.clickExit(\'' + EXITS[n].name + '\')">' + EXITS[n].abbrev + '</span>');
  document.writeln('</td>');
};



// Gets the command with the given name
io.getCommand = function(name) {
  const found = commands.find(function(el) {
    return el.name === name;
  });
  return found;
};


io.msgInputText = function(s) {
  if (!CMD_ECHO) return;
  $("#output").append('<p id="n' + io.nextid + '" class="inputtext">&gt; ' + s + "</p>");
  io.nextid++;
  if (game.spoken) io.speak(s, true);
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
    const keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === 13){
      const s = $('#textbox').val();
      io.msgInputText(s);
      if (s) {
        io.savedCommands.push(s);
        io.savedCommandsPos = io.savedCommands.length;
        parser.parse(s);
        $('#textbox').val('');
      }
    }
    if(io.keycodes[keycode]){
      io.msgInputText(io.keycodes[keycode]);
      setTimeout(function() { $('#textbox').val(''); }, 1);
      parser.parse(io.keycodes[keycode]);
    }
    if(keycode === 37){
      // left arrow
      if (event.ctrlKey) {
        io.msgInputText(EXITS[5].name);
        parser.parse(EXITS[5].name);
        $('#textbox').val('');
      }
    }
    if(keycode === 38){
        console.log("up arrow");
      // up arrow
      if (event.ctrlKey) {
        io.msgInputText(EXITS[1].name);
        parser.parse(EXITS[1].name);
        $('#textbox').val('');
      }
      else {
        io.savedCommandsPos -= 1;
        if (io.savedCommandsPos < 0) { io.savedCommandsPos = 0; }
        $('#textbox').val(io.savedCommands[io.savedCommandsPos]);
        // Get cursor to end of text
        const el = $('#textbox')[0]
        if (el.setSelectionRange) {
          setTimeout(function() {el.setSelectionRange(9999, 9999); }, 0);  
        }
        else if (typeof el.selectionStart == "number") {
          el.selectionStart = el.selectionEnd = el.value.length;
        }
        else if (typeof el.createTextRange != "undefined") {
          el.focus();
          var range = el.createTextRange();
          range.collapse(false);
          range.select();
        }
      }
    }
    if(keycode === 39){
      // right arrow
      if (event.ctrlKey) {
        io.msgInputText(EXITS[7].name);
        parser.parse(EXITS[7].name);
        $('#textbox').val('');
      }
    }
    if(keycode === 40){
      // down arrow
      if (event.ctrlKey) {
        io.msgInputText(EXITS[11].name);
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
    if(keycode === 96 && DEBUG){
      parser.parse("test");
      setTimeout(function() { $('#textbox').val(''); }, 1);
    }
  });    
  world.init();
  io.textColour = $(".sidepanes").css("color");
  game.update();
  world.setBackground();
  intro();
  setup();
  // Only do the room if we are not waiting
  // If we are waiting, the author needs to call world.enterRoom()
  if (io.waitFns.length === 0) {
    world.enterRoom();
  }
  endTurnUI(true);
});


io.synth = window.speechSynthesis;
io.voice = null;
io.voice2 = null;
 
io.speak = function(str, altVoice){
  
/*  let voices = io.synth.getVoices()
  for (let i = 0; i < voices.length; i++) {
    debugmsg(voices[i].name);
    debugmsg(/Female/.test(voices[i].name));
    debugmsg(/UK/.test(voices[i].name));
  }*/

  if (!io.voice) {
    io.voice = io.synth.getVoices().find(function(el) {
      return /UK/.test(el.name) && /Female/.test(el.name);
    });
    if (!io.voice) io.voice = io.synth.getVoices()[0];
  }
  if (!io.voice2) {
    io.voice2 = io.synth.getVoices().find(function(el) {
      return /UK/.test(el.name) && /Male/.test(el.name);
    });
    if (!io.voice2) io.voice2 = io.synth.getVoices()[0];
  }
  
  
  //if (io.synth.speaking) {
  //  console.error('speechSynthesis.speaking');
  //  return;
  //}
  const utterThis = new SpeechSynthesisUtterance(str);
  utterThis.onend = function (event) {
    //console.log('SpeechSynthesisUtterance.onend');
  }
  utterThis.onerror = function (event) {
    //console.error('SpeechSynthesisUtterance.onerror: ' + event.name);
  }
  utterThis.voice = altVoice ? io.voice2 : io.voice;
  // I think these can vary from 0 to 2
  utterThis.pitch = 1;
  utterThis.rate = 1;
  io.synth.speak(utterThis);
};
