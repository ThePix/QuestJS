// ============  Output  =======================================

"use strict";

//@DOC
// ##Output functions
//
// The idea is that you can have them display differently - or not at all -
// so error messages can be displayed in red, meta-data (help., etc)
// is grey, and debug messages can be turned on and off as required.
//
// Note that not all use the text processor (so if there is an issue with
// the text processor, we can use the others to report it). Also unit tests
// capture output with msg and errormsg, but not debugmsg or headings.
//
// Should all be language neutral
//@UNDOC


//@DOC
// Output a standard message, as an HTML paragraph element (P).
// The string will first be passed through the text processor.
// Additional data can be put in the optional params dictionary.
// You can specify a CSS class to use.
// During unit testing, messages will be saved and tested
function msg(s, params, cssClass) {
  if (cssClass === undefined) cssClass = 'defaultP';
  const processed = processText(s, params).trim();
  if (processed === "") return;
  
  if (test.testing) {
    test.testOutput.push(processed);
    return;
  }
  const lines = processed.split('|');
  for (let line of lines) {
    const tag = (/^#/.test(line) ? 'h4' : 'p')
    line = line.replace(/^#/, '')
    if (settings.typewriter) {
      typeWriter.write(tag, line);
    }
    else {
      io.outputRaw('<' + tag + ' id="n' + io.nextid + '" class="' + cssClass + '">' + line + "</" + tag + ">");
      io.nextid++;
    }
    if (game.spoken) io.speak(line);
    if (game.transcript) game.scriptAppend("-" + line);
  }
}



function msgUnscramble(s, params, cssClass) {
  if (cssClass === undefined) cssClass = 'defaultP';
  const processed = processText(s, params).trim();
  if (processed === "") return;
  
  if (test.testing) {
    return;
  }
  const lines = processed.split('|');
  for (let i = 0; i < lines.length; i++) {
    unscrambler.write('p', lines[i]);
    if (game.spoken) io.speak(lines[i]);
    if (game.transcript) game.scriptAppend("-" + lines[i]);
  }
}




function msgFunction(f) {
  if (settings.typewriter) {
    typeWriter.write('f', f);
  }
  else {
    f();
  }
}



//@DOC
// As `msg`, but handles an array of strings. Each string is put in its own HTML paragraph,
// and the set is put in an HTML division (DIV). The cssClass is applied to the division.
function msgDiv(arr, params, cssClass) {
  if (test.testing) return
  io.outputRaw('<div class="' + cssClass + '">');
  for (let item of arr) {
    const processed = processText(item, params).trim();
    if (processed === "") continue;
    io.outputRaw('<p>' + processed + "</p>");
    if (game.spoken) io.speak(processed);
    if (game.transcript) game.scriptAppend("~" + processed);
  }
  io.outputRaw('</div>');
}



//@DOC
// As `msg`, but handles an array of strings in a list. Each string is put in its own HTML list item (LI),
// and the set is put in an HTML order list (OL) or unordered list (UL), depending on the value of `ordered`.
function msgList(arr, ordered, params) {
  if (test.testing) return
  io.outputRaw(ordered ? '<ol>' : '<ul>');
  for (let item of arr) {
    const processed = processText(item, params).trim();
    if (processed === "") continue;
    io.outputRaw('<li>' + processed + "</li>");
    if (game.spoken) io.speak(processed);
    if (game.transcript) game.scriptAppend("*" + processed);
  }
  io.outputRaw(ordered ? '</ol>' : '</ul>');
}



//@DOC
// As `msg`, but handles an array of arrays of strings in a list. This is laid out in an HTML table.
// If `headings` is present, this array of strings is used as the column headings.
function msgTable(arr, headings, params) {
  if (test.testing) return
  io.outputRaw('<table>');
  if (headings) {
    io.outputRaw('<tr>');
    for (let item of headings) {
      const processed = processText(item, params).trim();
      io.outputRaw("<th>" + processed + "</th>");
      if (game.spoken) io.speak(processed);
      if (game.transcript) game.scriptAppend("|" + processed);
    }
    io.outputRaw('</tr>');
  }
  for (let row of arr) {
    io.outputRaw('<tr>');
    for (let item of row) {
      const processed = processText(item, params).trim();
      io.outputRaw("<td>" + processed + "</td>");
      if (game.spoken) io.speak(processed);
      if (game.transcript) game.scriptAppend("|" + processed);
    }
    io.outputRaw("</tr>");
  }
  io.outputRaw('</table>');
}



//@DOC
// As `msg`, but the string is presented as an HTML heading (H1 to H6).
// The level of the heading is determined by `level`, with 1 being the top, and 6 the bottom.
// Headings are ignored during unit testing.
function msgHeading(s, level, params) {
  const processed = processText(s, params);
  if (!test.testing) {
    if (settings.typewriter) {
      typeWriter.write('h' + level, processed);
    }
    else {
      io.outputRaw('<h' + level + ' id="n' + io.nextid + '">' + processed + '</h' + level + '>');
      io.nextid++;
    }
  }
  if (game.spoken) io.speak(s);
  if (game.transcript) game.scriptAppend(level.toString() + s);
}


//@DOC
// Output a picture, as an HTML image element (IMG).
// If width and height are omitted, the size of the image is used.
// If height is omitted, the height will be proportional to the given width.
// The file name should include the path. For a local image, that would probably be the images folder,
// but it could be the web address of an image hosted elsewhere.
function picture(filename, width, height) {
  let s = '<img src="' + filename + '"'
  if (width) s += ' width="' + width + '"'
  if (height) s += ' height="' + height + '"'
  s += '>'
  io.outputRaw(s);
  io.nextid++;
}



//@DOC
// Just the same as msg, but adds the "failed" CSS class. This allows failed command responses to be differentiated.
// Returns the value FAILED, allowing commands to give a message and give up
//     if (notAllowed) return failedmsg("That is not allowed.")
function failedmsg(s, params) {
  msg(s, params, "failed");
  return FAILED;
}



//@DOC
// Just the same as msg, but adds the "failed" CSS class. This allows failed command responses to be differentiated.
// Returns the value false, allowing commands to give a message and give up
//     if (notAllowed) return falsemsg("That is not allowed.")
function falsemsg(s, params) {
  msg(s, params, "failed");
  return false;
}



//@DOC
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
  if (game.transcript) game.scriptAppend("M" + processed);
}



//@DOC
// Output an error message.
// Use for when something has gone wrong, but not when the player types something odd -
// if you see this during play, there is a bug in your game (or my code!), it is not the player
// to blame.
// During unit testing, error messages will be saved and tested.
// Does not use the text processor (as it could be an error in there!).
function errormsg(s) {
  if (test.testing) {
    test.testOutput.push(s);
    return;
  }
  io.outputRaw('<p id="n' + io.nextid + '" class="error">' + s + '</p>');
  io.nextid++;
  if (game.spoken) io.speak("Error: " + s);
  if (game.transcript) game.scriptAppend("E" + s);
  return false;
}



//@DOC
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
  if (game.transcript) game.scriptAppend("P" + s);
  return false;
}



//@DOC
// Output a debug message.
// Debug messages are ignored if DEBUG is false
// and are printed normally during unit testing.
// You should also consider using `console.log` when debugging; it gives a message in the console,
// and outputs objects and array far better.
// Does not use the text processor.
// Does not get spoken allowed.
function debugmsg(s) {
  if (settings.debug) {
    io.outputRaw('<p id="n' + io.nextid + '" class="debug">' + s + '</p>');
    io.nextid++;
    if (game.transcript) game.scriptAppend("D" + s);
  }
}




//@DOC
// If the given attribute is a string it is printed, if it is a
// function it is called. Otherwise an error is generated.
// It isMultiple is true, the object name is prefixed.
// TODO: test array with function
function printOrRun(char, item, attname, options) {
  if (options === undefined) options = {};
  let flag, i;
  if (Array.isArray(item[attname])) {
    // the attribute is an array
    //debugmsg(0, "Array: " + attname);
    flag = true;
    for (i = 0; i < item[attname].length; i++) {
      flag = printOrRun(char, item, item[attname][i], options) && flag;
    }
    return flag;
  }
  if (Array.isArray(attname)) {
    // The value is an array
    flag = true;
    for (i = 0; i < attname.length; i++) {
      flag = printOrRun(char, item, attname[i], options) && flag;
    }
    return flag;
  }
  else if (!item[attname]) {
    // This is not an attribute
    if (typeof attname === "function"){
      return attname(item, options.multi, char, options);
    }
    else {
      msg(attname, {char:char, item:item});
      return true;
    }
  }  
  else if (typeof item[attname] === "string") {
    // The attribute is a string
    msg(prefix(item, options.multi) + item[attname], {char:char, item:item});
    return true;
  }
  else if (typeof item[attname] === "function"){
    // The attribute is a function
    const res = item[attname](options.multi, char, options);
    return res;
  }
  else {
    errormsg("Unsupported type for printOrRun");
    return false;
  }
}



const typeWriter = {
  buffer:[],
  tagBuffer:[],
  pos:0,
  active:false,

  //@DOC
  // To output text one character at a time, use `typewriter.write(tag, s)`.
  // The `tag` s the name of the HTML element to use, and will normally be 'p'.
  // Each successive line of text will wait until the previous has completed before it begins.
  write:function(tag, s) {
    this.tagBuffer.push(tag)
    this.buffer.push(s)
    if (!this.active) {
      this.print();
    }
  },
  print:function() {
    typeWriter.active = true;
    if (typeWriter.pos === 0) {
      if (typeWriter.buffer.length === 0) {
        typeWriter.active = false;
        return;
      }
      typeWriter.line = typeWriter.buffer.shift();
      const tag = typeWriter.tagBuffer.shift();
      if (tag === "f") {
        typeWriter.line();
        typeWriter.line = "";
      }
      else {
        io.outputRaw('<' + tag + ' id="n' + io.nextid + '"></' + tag + '>');
        typeWriter.ioid = io.nextid
        io.nextid++;
      }
    }
    $("#n" + typeWriter.ioid).html(typeWriter.line.slice(0, typeWriter.pos) + "<span class=\"typewriter\">" + typeWriter.line.slice(typeWriter.pos, typeWriter.pos+ 1) + "</span>");
    typeWriter.pos++;
    if (typeWriter.pos > typeWriter.line.length) {
      typeWriter.pos = 0;
      setTimeout(typeWriter.print, settings.typewriterDelayLine);
    }
    else {
      setTimeout(typeWriter.print, settings.typewriterDelay);
    }
  }
}



const unscrambler = {
  entries:[],
  active:false,

  pick:function() {
    let c = String.fromCharCode(randomInt(33, 125))
    return c === '<' ? '~' : c
  },
  
  scramble:function(data) {
    let s = ''
    for (let i = 0; i < data.s.length; i++) {
      s += (data.mask.charAt(i) === ' ' ? data.s.charAt(i) : unscrambler.pick())
    }
    return s
  },
    
  //@DOC
  // To output scrambled text that is revealed one character at a time, use `unscrambler.write(tag, s)`.
  // The `tag` s the name of the HTML element to use, and will normally be 'p'.
  // If there are multiple lines of text they will all be unscrambled at the same time (though longer lines will finish later).
  write:function(tag, s) {
    let scrambled = ''
    let mask = ''
    let count = 0
    for (let i = 0; i < s.length; i++) {
      if (s.charAt(i) === ' ') {
        scrambled += ' '
        mask += ' '
      }
      else {
        scrambled += unscrambler.pick()
        mask += 'x'
        count++
      }
    }
    io.outputRaw('<' + tag + ' id="n' + io.nextid + '">' + scrambled + '</' + tag + '>');

    unscrambler.entries.push({
      s:s,
      tag:tag,
      count:count,
      id:io.nextid,
      scrambled:scrambled,
      mask:mask,
    })

    io.nextid++;
    if (!unscrambler.active) {
      unscrambler.print()
    }
  },
  
  print:function() {
    unscrambler.active = true

    for (let entry of unscrambler.entries) {
      entry.mask = entry.mask.replace('x', ' ')
      entry.count--
      $("#n" + entry.id).html(unscrambler.scramble(entry))
    }
    if (unscrambler.entries[0].count <= 0) unscrambler.entries.shift()    
    if (unscrambler.entries.length > 0) {
      setTimeout(unscrambler.print, 100);
    }
    else {
      unscrambler.active = false
    }
  }
}




//@DOC
// Clears the screen.
function clearScreen() {
  for (let i = 0; i < io.nextid; i++) {
    $('#n' + i).remove();
  }
}



//@DOC
// Stops outputting whilst waiting for the player to click.
// The next thing to do must be the function, fn
function wait(fn) {
  if (test.testing) {
    // If this is part of a unit test, do not wait, just do the function.
    fn();
    return; 
  }
  game.update()
  if (io.waitFns.length === 0) {
    io.disable();
    io.clickToContinueLink();
  }
  io.waitFns.push(fn);
}


//@DOC
// Display a series of screens of text, waiting for the player to click "Continue"
// before showing the next. The pages parameter should be an array, each entry being one
// page (you can use | to break a page into paragraphs). In options, set "clearScreen"
// to true to have the screen clear between each page.
function displayPages(pages, options) {
  const first = pages.shift()
  io.waitAtStartUp = options.startUp
  if (options.clearScreen) clearScreen()
  msg(first)
  if (pages.length > 0) {
    wait(function () { displayPages(pages, options) })
  }
}
  



//@DOC
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

io.cmdLink = function(command, str) {
  return '<a class="cmdlink" onclick="parser.parse(\'' + command + '\')">' + str + "</a>";
}


io.outputRaw = function(s) {
  $("#output").append(s);
}



io.scrollToEnd = function() {
   window.scrollTo(0,document.getElementById('main').scrollHeight);  
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


io.waitFns = [];

io.clickToContinueLink = function() {
  msg('<a class="continue" onclick="io.waitContinue()">' + lang.click_to_continue + '</a>');
  io.continuePrintId = io.nextid - 1;
}

io.waitContinue = function() {
  const fn = io.waitFns.shift();
  $('#n' + io.continuePrintId).remove();
  fn();
  if (io.waitFns.length === 0) {
    io.enable();
    if (io.waitAtStartUp) world.enterRoom()
  }
};



io.menuResponse = function(n) {
  io.enable();
  $('#input').css('display', "block");
  for (let i = io.menuStartId; i < io.nextid; i++) {
    $('#n' + i).remove();
  }
  if (n !== -1) io.menuFn(io.menuOptions[n]);
  endTurnUI(true);
  if (settings.textInput) $('#textbox').focus();
};

io.clickExit = function(dir) {
  if (io.inputIsDisabled) return;

  let failed = false;
  io.msgInputText(dir);
  let cmd = io.getCommand("Go" + sentenceCase(dir))
  if (!cmd) cmd = io.getCommand(sentenceCase(dir))
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
    const l = item.getContents(display.SIDE_PANE);
    for (let el of l) {
      io.appendItem(el, htmlDiv, item.name, true);
    }
  }
};

// Creates the panes on the left or right
// Should only be called once, when the page is first built
io.createPanes = function() {
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
  
  $('#input').html(settings.cursor + '<input type="text" name="textbox" id="textbox"  autofocus/>')

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

  console.log("Nearly done")
  endTurnUI(true);
  console.log("All set up")
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
// (and really only useful for displaying data).
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




