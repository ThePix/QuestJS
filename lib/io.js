// ============  Output  =======================================

"use strict";

//@DOC
// ##Output functions
//
// The idea is that you can have them world. differently - or not at all -
// so error messages can be world.ed in red, meta-data (help., etc)
// is grey, and debug messages can be turned on and off as required.
//
// Note that not all use the text processor (so if there is an issue with
// the text processor, we can use the others to report it). Also unit tests
// capture output with msg and errormsg, but not debugmsg or headings.
//
// Should all be language neutral
//@UNDOC





/*
tag   required
action  required
cssClass
printBlank
*/

function _msg(s, params, options) {
  if (options.tag === undefined) options.tag = 'p'
  if (options.cssClass === undefined) options.cssClass = 'default' + options.tag.toUpperCase();
  const processed = params ? processText(s, params).trim() : s.trim();
  if (processed === "" && !options.printBlank) return;
  
  if (test.testing) {
    test.testOutput.push(processed);
    return;
  }
  const lines = processed.split('|');
  for (let line of lines) {
    // can add effects
    const data = options
    data.text = line
    if (!data.action) data.action = 'output'
    io.addToOutputQueue(data)
  }
}





//@DOC
// Output a standard message, as an HTML paragraph element (P).
// The string will first be passed through the text processor.
// Additional data can be put in the optional params dictionary.
// You can specify a CSS class to use.
// During unit testing, messages will be saved and tested
function msg(s, params, cssClass) {
  //if (!params) params = {}
  const lines = s.split('|');
  for (let line of lines) {
    const tag = (/^#/.test(line) ? 'h4' : 'p')
    line = line.replace(/^#/, '')
    _msg(line, params || {}, {cssClass:cssClass, tag:tag})
  }
}



//@DOC
// As `msg`, but the string is presented as an HTML heading (H1 to H6).
// The level of the heading is determined by `level`, with 1 being the top, and 6 the bottom.
// Headings are ignored during unit testing.
function msgBlankLine() {
  _msg('', false, {tag:'p', printBlank:true})
}


//@DOC
// As `msg`, but handles an array of strings. Each string is put in its own HTML paragraph,
// and the set is put in an HTML division (DIV). The cssClass is applied to the division.
function msgDiv(arr, params, cssClass) {
  let s = ''
  for (let item of arr) {
    s += '  <p>' + item + "</p>\n"
  }
  _msg(s, params || {}, {cssClass:cssClass, tag:'div'})
}



//@DOC
// As `msg`, but handles an array of strings in a list. Each string is put in its own HTML list item (LI),
// and the set is put in an HTML order list (OL) or unordered list (UL), depending on the value of `ordered`.
function msgList(arr, ordered, params) {
  let s = ''
  for (let item of arr) {
    s += '  <li>' + item + "</li>\n"
  }
  _msg(s, params || {}, {cssClass:cssClass, tag:ordered ? '</ol>' : '</ul>'})
}



//@DOC
// As `msg`, but handles an array of arrays of strings in a list. This is laid out in an HTML table.
// If `headings` is present, this array of strings is used as the column headings.
function msgTable(arr, headings, params) {
  let s = ''
  if (headings) {
    s += '  <tr>\n'
    for (let item of headings) {
      s += "    <th>" + item + "</th>\n"
    }
    s += '  </tr>\n'
  }
  for (let row of arr) {
    s += '  <tr>\n'
    for (let item of row) {
      s += "    <td>" + processed + "</td>\n"
    }
    s += "  </tr>\n"
  }
  _msg(s, params || {}, {cssClass:cssClass, tag:'table'})
}



//@DOC
// As `msg`, but the string is presented as an HTML heading (H1 to H6).
// The level of the heading is determined by `level`, with 1 being the top, and 6 the bottom.
// Headings are ignored during unit testing.
function msgHeading(s, level, params) {
  _msg(s, params || {}, {tag:'h' + level})
}





//@DOC
// Output a picture, as an HTML image element (IMG).
// If width and height are omitted, the size of the image is used.
// If height is omitted, the height will be proportional to the given width.
// The file name should include the path. For a local image, that would probably be the images folder,
// but it could be the web address of an image hosted elsewhere.
function picture(filename, width, height) {
  _msg('', {}, {action:'output', width:width, height:height, tag:'img', src:settings.imagesFolder + '/' + filename, printBlank:true})
}






//@DOC
// Plays a sound. The filename must include the extension, and the file should be in the folder specified by audioFolder (defaults to the game folder).
function sound(filename) {
  //console.log(settings.ssFolder)
  _msg('Your browser does not support the <code>audio</code> element.', {}, {action:'output', autoplay:true, tag:'audio', src:settings.audioFolder + '/' + filename})
}


//@DOC
// Plays a video. The filename must include the extension, and the file should be in the folder specified by audioFolder (defaults to the game folder).
// There are some issues about codecs and formats; use at your discretion.
function video(filename) {
  //console.log(settings.ssFolder)
  _msg('Your browser does not support the <code>video</code> element.', {}, {action:'output', autoplay:true, tag:'video', src:settings.videoFolder + '/' + filename})
}





//@DOC
// Just the same as msg, but adds the "failed" CSS class. This allows failed command responses to be differentiated.
// Returns the value FAILED, allowing commands to give a message and give up
//     if (notAllowed) return failedmsg("That is not allowed.")
function failedmsg(s, params) {
  _msg(s, params || {}, {cssClass:"failed", tag:'p'});
  return world.FAILED;
}



//@DOC
// Just the same as msg, but adds the "failed" CSS class. This allows failed command responses to be differentiated.
// Returns the value false, allowing commands to give a message and give up
//     if (notAllowed) return falsemsg("That is not allowed.")
function falsemsg(s, params) {
  _msg(s, params || {}, {cssClass:"failed", tag:'p'});
  return false;
}



//@DOC
// Output a meta-message - a message to inform the player about something outside the game world,
// such as hints and help messages.
// The string will first be passed through the text processor.
// Additional data can be put in the optional params dictionary.
// During unit testing, messages will be saved and tested
function metamsg(s, params) {
  _msg(s, params || {}, {cssClass:"meta", tag:'p'});
}

//@DOC
// Output a message from the parser indicating the input text could not be parsed.
// During unit testing, messages will be saved and tested.
// Does not use the text processor.
function parsermsg(s) {
  _msg(s, false, {cssClass:"parser", tag:'p'});
  return false;
}






//@DOC
// Output an error message.
// Use for when something has gone wrong, but not when the player types something odd -
// if you see this during play, there is a bug in your game (or my code!), it is not the player
// to blame.
//
// This bypasses the normal output system. It will not wait for other text to be output (for example
// after wait). During unit testing, error messages will be output to screen as they occur.
// It does not use the text processor.
function errormsg(s) {
  io.print({tag:'p', cssClass:"error", text:s})
  return false;
}






//@DOC
// Output a debug message.
// Debug messages are ignored if DEBUG is false.
// You should also consider using `console.log` when debugging; it gives a message in the console,
// and outputs objects and array far better.
//
// This bypasses the normal output system. It will not wait for other text to be output (for example
// after wait). During unit testing, error messages will be output to screen as they occur.
// It does not use the text processor.
function debugmsg(s) {
  if (settings.debug) {
    io.print({tag:'p', cssClass:"debug", text:s})
  }
}











//@DOC
// Clears the screen.
function clearScreen() {
  io.outputQueue.push({action:'clear'})
}



//@DOC
// Stops outputting whilst waiting for the player to click.
function wait(delay, text) {
  if (test.testing) return
  //io.outputSuspended = true
  if (delay === undefined) {
    io.addToOutputQueue({action:'wait', disable:true, text:text, cssClass:'continue'})
  }
  else {
    io.addToOutputQueue({action:'delay', disable:true, delay:delay, text:text, cssClass:'continue'})
  }
}










function askQuestion(title, fn) {
  msg(title);
  parser.overrideWith(fn)
}




//@DOC
// Use like this:
//      showMenu('What is your favourite color?', ['Blue', 'Red', 'Yellow', 'Pink'], function(result) {
//        msg("You picked " + result + ".");
//      });
function showMenu(title, options, fn) {
  io.input(title, options, fn, function(options) {
    for (let i = 0; i < options.length; i++) {
      let s = '<a class="menuoption" onclick="io.menuResponse(' + i + ')">';
      s += (options[i].byname ? sentenceCase(options[i].byname({article:DEFINITE})) : options[i]);
      s += '</a>';
      msg(s);
    }
  })
}

function showDropDown(title, options, fn) {
  io.input(title, options, fn, function(options) {
    let s = '<select id="menu-select" class="custom-select" style="width:400px;" ';
    s += 'onchange=\"io.menuResponse($(\'#menu-select\').find(\':selected\').val())\">';
    s += '<option value="-1">-- Select one --</option>';
    for (let i = 0; i < options.length; i++) {
      s += '<option value="' + i + '">';
      s += (options[i].byname ? sentenceCase(options[i].byname({article:DEFINITE})) : options[i]);
      s += '</option>';
    }
    msg(s + "</select>");
    //$('#menu-select').selectmenu();
    $('#menu-select').focus();
  })
}

function showYesNoMenu(title, fn) {
  showMenu(title, lang.yesNo, fn)
}

function showYesNoDropDown(title, fn) {
  showDropDown(title, lang.yesNo, fn)
}




// This should be called after each turn to ensure we are at the end of the page and the text box has the focus
function endTurnUI(update) {
  //debugmsg("In endTurnUI");
  if (settings.panes !== 'None' && update) {
    // set the lang.exit_list
    for (let exit of lang.exit_list) {
      if (game.room.hasExit(exit.name, {excludeScenery:true}) || exit.nocmd) {
        $('#exit' + exit.name).show();
      }
      else {
        $('#exit' + exit.name).hide();
      }
    }
    io.updateStatus();
    if (typeof ioUpdateCustom === "function") ioUpdateCustom();
    io.updateUIItems();
  }

  // scroll to end
  setTimeout(io.scrollToEnd,1);
  // give focus to command bar
  if (settings.textInput) { $('#textbox').focus(); }
}








// ============  Hidden from creators!  =======================================




const io = {};


io.input = function(title, options, reactFunction, displayFunction) {
  io.menuStartId = io.nextid;
  io.menuFn = reactFunction;
  io.menuOptions = options;
  
  if (test.testing) {
    if (test.menuResponseNumber === undefined) {
      debugmsg("Error when testing menu (possibly due to disambiguation?), test.menuResponseNumber = " + test.menuResponseNumber);
    }
    else {
      io.menuResponse(test.menuResponseNumber);
      test.menuResponseNumber = undefined
    }
    return; 
  }
  
  io.disable();
  msg(title, {}, 'menutitle');
  displayFunction(options)
}

io.outputQueue = []
io.outputSuspended = false


// Stops the current pause immediately (no effect if not paused)
io.unpause = function() {
  io.outputSuspended = false
  io.outputFromQueue()
}

io.addToOutputQueue = function(data) {
  data.id = io.nextid
  io.outputQueue.push(data)
  io.nextid++
  io.outputFromQueue()
}

io.outputFromQueue = function() {
  if (io.outputQueue.length === 0) {
    io.enable()
    return
  }
  if (io.outputSuspended) return
  
  if (io.continuePrintId) {
    // this is in case we have a timed delay with a prompt to get rid of the prompt
    const el = document.getElementById('n' + io.continuePrintId)
    el.style.display = 'none'
    delete io.continuePrintId
  }

  const data = io.outputQueue.shift()
  if (data.disable) io.disable()
  if (data.action === 'wait') {
    io.outputSuspended = true
    io.continuePrintId = data.id
    data.tag = 'p'
    data.onclick="io.waitContinue()"
    if (!data.text) data.text = lang.click_to_continue
    io.print(data)
  }
  if (data.action === 'delay') {
    if (data.text) {
      io.continuePrintId = data.id
      data.tag = 'p'
      io.print(data)
    }
    setTimeout(io.outputFromQueue, data.delay * 1000)
  }
  if (data.action === 'output') {
    const html = io.print(data)
    if (game.spoken) io.speak(html);
    if (game.transcript) game.scriptAppend(html);
    io.outputFromQueue()
  }
  if (data.action === 'effect') {
    // need a way to handle spoken and transcript here
    data.effect(data)
  }
  if (data.action === 'clear') {
    $('#output').empty();
    io.outputFromQueue()
  }
 
  window.scrollTo(0, document.getElementById('main').scrollHeight)  
}


io.print = function(data) {
  let html
  if (typeof data === 'string') {
    html = data
  }
  else {
    html = '<' + data.tag + ' id="n' + data.id + '"'
    if (data.cssClass) html += ' class="' + data.cssClass + '"'
    if (data.width) html += ' width="' + data.width + '"'
    if (data.height) html += ' height="' + data.height + '"'
    if (data.onclick) html += ' onclick="' + data.onclick + '"'
    if (data.src) html += ' src="' + data.src + '"'
    if (data.autoplay) html += ' autoplay="' + data.autoplay + '"'
    html += '>' + data.text + "</" + data.tag + '>'
  }
  $("#output").append(html)
  return html
}


io.waitContinue = function() {
  io.unpause()
};

io.typewriterEffect = function(data) {
  if (!data.position) {
    $("#output").append('<' + data.tag + ' id="n' + data.id + '" class=\"typewriter\"></' + data.tag + '>');
    data.position = 0
    data.text = processText(data.text, data.params)
  }
  const el = $('#n' + data.id)
  el.html(data.text.slice(0, data.position) + "<span class=\"typewriter-active\">" + data.text.slice(data.position, data.position + 1) + "</span>");
  data.position++
  if (data.position <= data.text.length) io.outputQueue.unshift(data)
  setTimeout(io.outputFromQueue, settings.textEffectDelay)
}

io.unscrambleEffect = function(data) {
  // Set it the system
  if (!data.count) {
    $("#output").append('<' + data.tag + ' id="n' + data.id + '" class="unscrambler"></' + data.tag + '>');
    data.count = 0
    data.text = processText(data.text, data.params)
    if (!data.pick) data.pick = io.unscamblePick
    data.mask = ''
    data.scrambled = ''
    for (let i = 0; i < data.text.length; i++) {
      if (data.text.charAt(i) === ' ' && !data.incSpaces) {
        data.scrambled += ' '
        data.mask += ' '
      }
      else {
        data.scrambled += data.pick(i)
        data.mask += 'x'
        data.count++
      }
    }
  }
  
  if (data.randomPlacing) {
    let pos = random.int(0, data.count - 1)
    let newMask = ''
    for (let i = 0; i < data.mask.length; i++) {
      if (data.mask.charAt(i) === ' ') {
        newMask += ' '
      }
      else if (pos === 0) {
        newMask += ' '
        pos--
      }
      else {
        newMask += 'x'
        pos--
      }
    }
    data.mask = newMask
  }
  else {
    data.mask = data.mask.replace('x', ' ')
  }
  data.count--
  $("#n" + data.id).html(io.unscambleScramble(data))
  if (data.count > 0) io.outputQueue.unshift(data)
  setTimeout(io.outputFromQueue, settings.textEffectDelay)
}

io.unscamblePick = function() {
  let c = String.fromCharCode(random.int(33, 125))
  return c === '<' ? '~' : c
}

io.unscambleScramble = function(data) {
  let s = ''
  for (let i = 0; i < data.text.length; i++) {
    s += (data.mask.charAt(i) === ' ' ? data.text.charAt(i) : data.pick(i))
  }
  return s
}




io.cmdLink = function(command, str) {
  return '<a class="cmdlink" onclick="parser.parse(\'' + command + '\')">' + str + "</a>";
}



io.scrollToEnd = function() {
   window.scrollTo(0,document.getElementById('main').scrollHeight);  
};



/*

io.rect = function(x, y, w, h, c) {
  return '<rect width="' + w + '" height="' + h + '" x="' + x + '" y="' + y + '" style="fill:' + c + ';stroke-width:1;stroke:black" />';
};
io.circle = function(x, y, r, c) {
  return '<circle r="' + r + '" cx="' + x + '" cy="' + y + '" style="fill:' + c + ';stroke-width:1;stroke:black" />';
};*/


// Each line that is output is given an id, n plus an id number.
io.nextid = 0;
// This is used by showMenu to prevent the user ignoring the menu
io.inputIsDisabled = false;
// Also used by showMenu
io.menuStartId;
io.menuFn;
io.menuOptions;
// A list of names for items currently world. in the inventory panes
io.currentItemList = [];

io.setTitle = function(s) {
  document.title = s;
};


io.disable = function(stillAllowText) {
  if (io.inputIsDisabled) return
  io.inputIsDisabled = true;
  if (!stillAllowText) $('#input').css('world.', "none");
  $('.compassbutton').css('color', '#808080');
  $('.item').css('color', '#808080');
  $('.itemaction').css('color', '#808080');
};

io.enable = function() {
  if (!io.inputIsDisabled) return
  io.inputIsDisabled = false;
  $('#input').css('world.', "block");
  $('.compassbutton').css('color', io.textColour);
  $('.item').css('color', io.textColour);
  $('.itemaction').css('color', io.textColour);
};


io.updateUIItems = function() {
  if (settings.panes === 'None') { return; }

  for (let inv of settings.inventories) {
    $('#' + inv.alt).empty();
  }
  
  io.currentItemList = [];
  for (let key in w) {
    const item = w[key];
    for (let inv of settings.inventories) {
      const loc = inv.getLoc();
      if (inv.test(item) && !item.inventorySkip) {
        io.appendItem(item, inv.alt, loc);
      }
    }
  }
  io.clickItem('');
};


io.updateStatus = function() {
  if (!settings.statusPane) return;
  
  $("#status-pane").empty();
  for (let st of settings.status) {
    if (typeof st === "string") {
      if (game.player[st] !== undefined) {
        let s = '<tr><td width="' + settings.statusWidthLeft + '">' + sentenceCase(st) + "</td>";
        s += '<td width="' + settings.statusWidthRight + '">' + game.player[st] + "</td></tr>";
        $("#status-pane").append(s);
      }
    }
    else if (typeof st === "function") {
      $("#status-pane").append("<tr>" + st() + "</tr>");
    }
  }
};






io.menuResponse = function(n) {
  io.enable();
  $('#input').css('world.', "block");
  for (let i = io.menuStartId; i < io.nextid; i++) {
    $('#n' + i).remove();
  }
  if (n === undefined) {
    io.menuFn(n)
  }
  else if (n !== -1) {
    io.menuFn(io.menuOptions[n]);
  }
  endTurnUI(true);
  if (settings.textInput) $('#textbox').focus();
};

io.clickExit = function(dir) {
  if (io.inputIsDisabled) return;

  let failed = false;
  io.msgInputText(dir);
  let cmd = io.getCommand("Go" + sentenceCase(dir))
  if (!cmd) cmd = io.getCommand(sentenceCase(dir))
  if (!cmd) cmd = io.getCommand("Meta" + sentenceCase(dir))
  parser.quickCmd(cmd);
};

io.clickItem = function(itemName) {
  if (io.inputIsDisabled) return;

  for (let item of io.currentItemList) {
    if (item === itemName) {
      $('.' + item + '-actions').toggle();
    }
    else {
      $('.' + item + '-actions').hide();
    }
  }
};

io.clickItemAction = function(itemName, action) {
  if (io.inputIsDisabled) return;

  const item = w[itemName];
  action = action.split(' ').map(el => sentenceCase(el)).join('')
  const cmd = io.getCommand(action);
  if (cmd === undefined) {
    errormsg("I don't know that command (" + action + ") - and obviously I should as you just clicked it. Please alert the game author about this bug (F12 for more).");
    console.log("Click action failed")
    console.log("Action: " + action)
    console.log("Item: " + itemName)
    console.log("Click actions in the side pane by-pass the usual parsing process because it is considered safe to say they will already match a command and an item. This process assumes there are commands with that exact name (case sensitive). In this case you need a command called \"" + action + "\" (with only one element in its actions list).")
    console.log("One option would be to create a new command just to catch the side pane click, and give it a nonsense regex so it never gets used when the player types a command.")
  }
  else if (cmd.objects.filter(el => !el.ignore).length !== 1) {
    errormsg("That command (" + action + ") cannot be used with an action in the side pane. Please alert the game author about this bug (F12 for more).");
    console.log("Click action failed")
    console.log("Action: " + action)
    console.log("Item: " + itemName)
    console.log("Click actions in the side pane by-pass the usual parsing process because it is considered safe to say they will already match a command and an item. This process assumes a command with exactly one entry in the objects list, and will fail if that is not the case.")
    console.log("If you think this is already the case, it may be worth checking that there are not two (or more) commands with the same name.")
    console.log("One option would be to create a new command just to catch the side pane click, and give it a nonsense regex so it never gets used when the player types a command.")
  }
  else if (item === undefined) {
    errormsg("I don't know that object (" + itemName + ") - and obviously I should as it was listed. Please alert this as a bug in Quest.");
  }
  else {
    io.msgInputText(action + " " + item.alias);
    parser.quickCmd(cmd, item);
  }
};


// Add the item to the DIV named htmlDiv
// The item will be given verbs from its attName attribute
io.appendItem = function(item, htmlDiv, loc, isSubItem) {
  if (typeof item.icon !== 'function') {
    console.log("No icon function for:")
    console.log(item)
  }
  $('#' + htmlDiv).append('<p class="item' + (isSubItem ? ' subitem' : '') + '" onclick="io.clickItem(\'' + item.name + '\')">' + item.icon() + item.getListAlias(loc) + "</p>");
  io.currentItemList.push(item.name);
  const verbList = item.getVerbs(loc);
  if (verbList === undefined) { errormsg("No verbs for " + item.name); console.log(item); }
  for (let verb of verbList) {
    let s = '<div class="' + item.name + '-actions itemaction" onclick="io.clickItemAction(\'' + item.name + '\', \'' + verb + '\')">';
    s += verb;
    s += '</div>';
    $('#' + htmlDiv).append(s);
  }
  if (item.container && !item.closed) {
    if (typeof item.getContents !== 'function') {
      console.log("item flagged as container but no getContents function:");
      console.log(item);
    }
    const l = item.getContents(world.SIDE_PANE);
    for (let el of l) {
      io.appendItem(el, htmlDiv, item.name, true);
    }
  }
};

// Creates the panes on the left or right
// Should only be called once, when the page is first built
io.createPanes = function() {
  $('#input').html(settings.cursor + '<input type="text" name="textbox" id="textbox"  autofocus/>')

  if (settings.panes === 'None') { return; }
  document.writeln('<div id="panes" class="sidepanes sidepanes' + settings.panes + '">');

  if (settings.compass) {
    if (settings.divider) document.writeln('<img src="images/' + settings.divider + '" />');
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

  if (settings.statusPane) {
    if (settings.divider) document.writeln('<img src="images/' + settings.divider + '" />');
    document.writeln('<div class="paneDiv">');
    document.writeln('<h4>' + settings.statusPane + ':</h4>');
    document.writeln('<table id="status-pane">');
    document.writeln('</table>');
    document.writeln('</div>');
  }
  
  for (let inv of settings.inventories) {
    if (settings.divider) document.writeln('<img src="images/' + settings.divider + '" />');
    document.writeln('<div class="paneDiv">');
    document.writeln('<h4>' + inv.name + ':</h4>');
    document.writeln('<div id="' + inv.alt + '">');
    document.writeln('</div>');
    document.writeln('</div>');
  }
  if (settings.divider) document.writeln('<img src="images/' + settings.divider + '" />');
  document.writeln('</div>');

  if (typeof ioCreateCustom === "function") ioCreateCustom();
  
};


io.writeExit = function(n) {
  document.writeln('<td class="compassbutton">');
  document.writeln('<span class="compassbutton" id="exit' + lang.exit_list[n].name + '" onclick="io.clickExit(\'' + lang.exit_list[n].name + '\')">' + lang.exit_list[n].abbrev + '</span>');
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
  if (!settings.cmdEcho) return;
  $("#output").append('<p id="n' + io.nextid + '" class="inputtext">&gt; ' + s + "</p>");
  io.nextid++;
  if (game.spoken) io.speak(s, true);
  if (game.transcript) game.scriptAppend("I" + s);
};

io.savedCommands = ['help'];
io.savedCommandsPos = 0;
$(document).ready(function() {
  $('#textbox').keydown(function(event){
    const keycode = (event.keyCode ? event.keyCode : event.which);
      for (let exit of lang.exit_list) {
        if (exit.key && exit.key === keycode) {
          io.msgInputText(exit.name);
          parser.parse(exit.name);
          $('#textbox').val('');
          event.stopPropagation();
          event.preventDefault();
          console.log("Caught")
          return false;
        }
      }
      if(keycode === 13){
        // enter
        const s = $('#textbox').val();
        io.msgInputText(s);
        if (s) {
          if (io.savedCommands[io.savedCommands.length - 1] !== s) {
            io.savedCommands.push(s);
          }
          io.savedCommandsPos = io.savedCommands.length;
          parser.parse(s);
          $('#textbox').val('');
        }
      }
      if(keycode === 38){
        // up arrow
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
      if(keycode === 40){
        // down arrow
        io.savedCommandsPos += 1;
        if (io.savedCommandsPos >= io.savedCommands.length) { io.savedCommandsPos = io.savedCommands.length - 1; }
        $('#textbox').val(io.savedCommands[io.savedCommandsPos]);
      }
      if(keycode === 27){
        // ESC
        $('#textbox').val('');
      }
      if(keycode === 96 && settings.debug){
        parser.parse("test");
        setTimeout(function() { $('#textbox').val(''); }, 1);
      }
  });    
  io.textColour = $(".sidepanes").css("color");
  game.initialise();

  endTurnUI(true);
  game.begin()
});


io.synth = window.speechSynthesis;
io.voice = null;
io.voice2 = null;
 
io.speak = function(str, altVoice){
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


io.dialogShowing = false;
//@DOC
// Appends an HTML DIV, with the given title and content,
// and shows it as a dialog. Used by the transcript
// (and really only useful for world.ing data).
io.showHtml = function(title, html) {
  if (io.dialogShowing) return false;
  $('body').append('<div id="showHtml" title="' + title + '">' + html + '</div>');
  io.dialogShowing = true;
  $("#showHtml").dialog({
    width: 860,
    close:function() { $("#showHtml").remove(); io.dialogShowing = false; },
  });
  return true;
}




