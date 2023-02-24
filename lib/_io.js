"use strict"

// This is at the top of the file so authors know to ignore stack trace enties for lines 1 to 15 in _io.js
const printError = function(msg, err, suppressTrace) {
  console.error("ERROR: " + msg)
  if (world.isCreated) {
    io.print({tag:'p', cssClass:"error", text:lang.error})
    saveLoad.transcriptAppend({ cssClass:'error', text:msg, stack:err.stack, })
    io.reset()  // ensure the interface is still useable!
  }
  if (suppressTrace) return false
  console.log('Look through the trace below to find the offending code. The first entry in the list may be "errormsg" in the file "_io.js", which is me so can be ignored. The next will the code that detected the error and called the "errormsg" message. You may need to look further down to find the root cause, especially for a text process issue.')
  if (settings.playMode !== 'dev') console.log("If this is uploaded, it might be worth doing [Crtl]-[Shft]-R to reload the page. You will lose any progress, but it will clear the browser cache and ensure you are using the latest version of the game files.")
  console.log(err)
  return false;
}











if (settings.playMode !== 'dev') {
  window.onbeforeunload = function(event) { 
    event.returnValue = "Are you sure?"; 
  }
}




settings.mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
settings.autoscroll = !settings.mediaQuery.matches





// ============  Output  =======================================
 

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
  if (options.cssClass === undefined) options.cssClass = 'default-' + options.tag.toLowerCase();
  let processed = params ? processText(s, params).trim() : s.trim();
  if (processed === "" && !options.printBlank) return;
  
  for (let line of processed.split('|')) {
    for (const el in io.escapeCodes) {
      line = line.replace(RegExp('@@@' + el + '@@@', 'ig'), io.escapeCodes[el])
    }
    if (settings.convertDoubleDash && !test.testing) line = line.replace(/ -- /g, ' &mdash; ')
    const data = {}
    Object.assign(data, options)  // need to do it this way as options may be same object
    data.text = line
    if (!data.action) data.action = 'output'
    
    if (test.testing) {
      if (test.ignoreHTML) line = line.replace(/(<([^>]+)>)/gi, '')
      if (test.fullOutputData) {
        test.testOutput.push(data)
      }
      else {
        test.testOutput.push(line)
      }
    }
    else {
      io.addToOutputQueue(data)
    }
  }
}


//@DOC
// Adds the given string to the print queue.
// This allows you to add any HTML you want to the output queue.
function rawPrint(s) {
  _msg(s, false, {})
}



//@DOC
// Output a standard message, as an HTML paragraph element (P).
// The string will first be passed through the text processor.
// Additional data can be put in the optional params dictionary.
// You can specify a CSS class to use.
// During unit testing, messages will be saved and tested
// If the string starts with a hash and no cssClass is given the line will be printed as a level 4 heading.
// A vertical bar will be taken as a line break. 
function msg(s, params, cssClass) {
  if (!params) params = {}
  if (typeof s !== 'string') {
    console.error("Trying to print with \"msg\", but got this instead of a string:")
    console.error(s)
    const err = new Error();
    log(err.stack)
    throw "Bad string for msg()"
  }

  if (/^#/.test(s) && !cssClass) {
    s = s.replace(/^#/, '')
    _msg(s, params, {cssClass:'default-h default-h4', tag:'h4'})
  }
  else {
    _msg(s, params, {cssClass:cssClass, tag:'p'})
  }
}


//@DOC
// Output a standard message, as an HTML pre-formaed element (PRE).
// The string will first be passed through the text processor.
// Additional data can be put in the optional params dictionary.
// During unit testing, messages will be saved and tested
function msgPre(s, params, cssClass) {
  if (!params) params = {}
  if (typeof s !== 'string') {
    console.error("Trying to print with \"msgPre\", but got this instead of a string:")
    console.error(s)
    console.trace()
    throw "Bad string for msgPre()"
  }
  _msg(s, params, {cssClass:cssClass, tag:'pre'})
}

//@DOC 
//Output a standard message, but it makes the NEXT message appear on the same line as the current message. Note that the next message will not have its own params or cssClass. 
function OutputTextNoBr(s, params, cssClass) {
    if(s.startsWith(' ')) {
        s = "&nbsp;" + s.substring(1, s.length);
    }
    if(s.endsWith(' ')) {
        s = s.substring(0, (s.length - 1)) + "&nbsp;"
    }
   msg("@@OUTPUTTEXTNOBR@@" + s, params, cssClass);
}
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
function msgList(arr, ordered, params, cssClass) {
  let s = ''
  for (let item of arr) {
    s += '  <li>' + item + "</li>\n"
  }
  _msg(s, params || {}, {cssClass:cssClass, tag:ordered ? 'ol' : 'ul'})
}



//@DOC
// As `msg`, but handles an array of arrays of strings in a list. This is laid out in an HTML table.
// If `headings` is present, this array of strings is used as the column headings.
function msgTable(arr, headings, params, cssClass) {
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
      s += "    <td>" + processText(item, params).trim() + "</td>\n"
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
  _msg(s, params || {}, {tag:'h' + level, cssClass:'default-h default-h' + level})
}





//@DOC
// Output a picture, as an HTML image element (IMG).
// If width and height are omitted, the size of the image is used.
// If height is omitted, the height will be proportional to the given width.
// The file name should include the path. For a local image, that would probably be the images folder,
// but it could be the web address of an image hosted elsewhere.
function picture(filename, width, height) {
  const src = filename.includes('/') ? filename : settings.imagesFolder + filename
  _msg('', {}, {action:'output', width:width, height:height, tag:'img', src:src, printBlank:true})
}



function image(filename, width, height) {
  const src = filename.includes('/') ? filename : settings.imagesFolder + filename
  _msg('', {}, {action:'output', width:width, height:height, tag:'img', src:src, cssClass:'centred', printBlank:true, destination:'quest-image'})
}





//@DOC
// Plays a sound. The filename must include the extension, and the file should be in the folder specified by audioFolder (defaults to the game folder).
function sound(filename) {
  //console.log(settings.ssFolder)
  _msg('Your browser does not support the <code>audio</code> element.', {}, {action:'sound', name:filename})
}
function ambient(filename, volume) {
  //console.log(settings.ssFolder)
  _msg('Your browser does not support the <code>audio</code> element.', {}, {action:'ambient', name:filename, volume:volume})
}


//@DOC
// Plays a video. The filename must include the extension, and the file should be in the folder specified by audioFolder (defaults to the game folder).
// There are some issues about codecs and formats; use at your discretion.
function video(filename) {
  //console.log(settings.ssFolder)
  _msg('Your browser does not support the <code>video</code> element.', {}, {action:'output', autoplay:true, tag:'video', src:settings.videoFolder + '/' + filename})
}


//@DOC
// Draw an image in the main window, embedded in the text.
// This uses SVG, which is a standard web drawing system.
// The first and second parameters are the width and height of the image.
// The third parameter is an array of strings, each element being an SVG primitive.
// The image will be added to the output queue in the same way text is.
function draw(width, height, data, options) {
  if (!options) options = {}
  //console.log(options)
  let s = '<svg width="' + width + '" height="' + height + '" viewBox="'
  s += options.x !== undefined ? ('' + options.x + ' ' + options.y) : '0 0'
  s += ' ' + width + ' ' + height + '" '
  if (options.background) s += 'style="background:' + options.background + '" '
  s += 'xmlns="http://www.w3.org/2000/svg">'
  s += data.join('') + '</svg>'
  if (settings.reportAllSvg) console.log(s.replace(/></g, '>\n<'))
  if (options.destination) {
    document.querySelector('#' + options.destination).innerHTML = s
  } 
  else {
    rawPrint(s)
  }
}




//@DOC
// Just the same as msg, but adds the "failed" CSS class. This allows failed command responses to be differentiated.
// Returns the value FAILED, allowing commands to give a message and give up
//     if (notAllowed) return failedmsg("That is not allowed.")
function failedmsg(s, params) {
  _msg(s, params || {}, {cssClass:"default-p failed", tag:'p'});
  return world.FAILED;
}



//@DOC
// Just the same as msg, but adds the "failed" CSS class. This allows failed command responses to be differentiated.
// Returns the value false, allowing commands to give a message and give up
//     if (notAllowed) return falsemsg("That is not allowed.")
function falsemsg(s, params) {
  _msg(s, params || {}, {cssClass:"default-p failed", tag:'p'});
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
// Output a message from the user
// Does not use the text processor.
function commentmsg(s) {
  _msg(s, false, {cssClass:"comment", tag:'p'});
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
function errormsg(s, suppressTrace) {
  if (test.errorOutput !== undefined) {
    // This is an expected error in a unit test
    test.errorOutput.push(s)
    return false
  }
  
  printError(s, new Error('error state caught by QuestJS runtime'), suppressTrace)

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
  if (settings.playMode === 'dev' || settings.playMode === 'meta') {
    io.print({tag:'pre', cssClass:"debug", text:s, id:io.nextid})
    io.nextid++
  }
}








//@DOC
// Adds a blank line to the output.
function blankLine() {
  rawPrint('&nbsp;')
}

//@DOC
// Adds a horizontal rule to the output.
function hr() {
  rawPrint('<hr/>')
}

//@DOC
// Clears the screen.
function clearScreen() {
  io.addToOutputQueue({action:'clear'})
}

//@DOC
// Stops outputting whilst waiting for the player to click.
function wait(delay, text, func) {
  if (test.testing || settings.walkthroughInProgress) return
  if (delay === undefined) {
    io.addToOutputQueue({action:'wait', text:text, cssClass:'continue', func:func})
  }
  else {
    io.addToOutputQueue({action:'delay', delay:delay, text:text, cssClass:'continue', func:func})
  }
}



//@DOC
// Clears the screen.
function trigger(func) {
  io.addToOutputQueue({action:'func', func:func})
}




//@DOC
// Use like this:
//      showMenu('What is your favourite color?', ['Blue', 'Red', 'Yellow', 'Pink'], function(result) {
//        msg("You picked " + result + ".");
//      });
function showMenu(title, options, fn) {
  const opts = {article:DEFINITE, capital:true, noLinks:true}
  io.input(title, options, false, fn, function(options) {
    for (let i = 0; i < options.length; i++) {
      let s = '<a class="menu-option" onclick="io.menuResponse(' + i + ')">';
      s += (typeof options[i] === 'string' ? options[i] : lang.getName(options[i], opts))
      s += '</a>';
      msg(s);
    }
  })
}



function showMenuNumbersOnly(title, options, fn) {
  const opts = {article:DEFINITE, capital:true, noLinks:true}
  parser.overrideWith(function(s) {io.menuResponse(s)})
  const disableTextFunction = function(disable) {
    if (disable) {
      io.disable(3)
      // add a keypress event handler to capture keypresses directly
      io.keydownFunctions.push(io.keydownForMenuFunction)
    }
    else {
      io.enable()
    }
  }
  io.input(title, options, disableTextFunction, fn, function(options) {
    for (let i = 0; i < options.length; i++) {
      let s = (i + 1) + '. <a class="menu-option" onclick="io.menuResponse(' + i + ')">';
      s += (typeof options[i] === 'string' ? options[i] : lang.getName(options[i], opts))
      s += '</a>';
      msg(s);
    }
  })
}


function showMenuWithNumbers(title, options, fn) {
  const opts = {article:DEFINITE, capital:true, noLinks:true}
  parser.overrideWith(function(s) {io.menuResponse(s)})
  const disableTextFunction = function(disable) {
    if (disable) {
      io.disable(2)
    }
    else {
      io.enable()
      io.doNotSaveInput = false
    }
  }
  const failFunction = function(input) {
    msg("I do not understand: " + input)
    runCmd(input)
    io.savedCommands.push(input)
  }
  io.doNotSaveInput = true
  io.input(title, options, disableTextFunction, fn, function(options) {
    for (let i = 0; i < options.length; i++) {
      let s = (i + 1) + '. <a class="menu-option" onclick="io.menuResponse(' + i + ')">';
      s += (typeof options[i] === 'string' ? options[i] : lang.getName(options[i], opts))
      s += '</a>';
      msg(s);
    }
  }, failFunction)
}




function showDropDown(title, options, fn) {
  const opts = {article:DEFINITE, capital:true, noLinks:true}
  io.input(title, options, false, fn, function(options) {
    let s = '<select id="menu-select" class="custom-select" style="width:400px;" ';
    s += 'onchange=\"io.menuResponse(io.getDropDownText(\'menu-select\'))\">';
    s += '<option value="-1">-- Select one --</option>';
    for (let i = 0; i < options.length; i++) {
      s += '<option value="' + (i+1) + '">';
      s += (typeof options[i] === 'string' ? options[i] : lang.getName(options[i], opts))
      s += '</option>';
    }
    msg(s + "</select>");
    //document.querySelector('#menu-select').selectmenu();
    document.querySelector('#menu-select').focus();
  })
}


function showMenuDiag(title, options, fn, cssClass) {
  io.showMenuDiagTitle = title
  const opts = {article:DEFINITE, capital:true, noLinks:true}
  const disableTextFunction = function(disable) {
    if (disable) {
      io.disable(3)
    }
    else {
      io.enable()
      if (!test.testing) {
        const el = document.querySelector('#sidepane-menu')
        if (el) el.remove() // may not exist in walk-through
      }
    }
  }

  const displayFunction = function(options) {
    let s = '<div id="sidepane-menu"'
    if (cssClass) s += ' class="' + cssClass + '"'
    s += '>'
    if (typeof io.showMenuDiagTitle === 'string') {
      s += '<p class="sidepane-menu-title">' + io.showMenuDiagTitle + '</p>'
    }
    else {
      s += '<h4 class="sidepane-menu-title">' + io.showMenuDiagTitle.title + '</h4>'
      s += '<p class="sidepane-menu-title">' + io.showMenuDiagTitle.text + '</p>'
    }
    for (let i = 0; i < options.length; i++) {
      s += '<p value="' + i + '" onclick="io.menuResponse(' + i + ')" class="sidepane-menu-option">'
      s += (typeof options[i] === 'string' ? options[i] : lang.getName(options[i], opts))
      s += '</p>';
    }
    s += '</div>'
    document.querySelector('body').innerHTML += s
  }

  io.input(false, options, disableTextFunction, fn, displayFunction)

  return world.SUCCESS_NO_TURNSCRIPTS
}



function showYesNoMenu(title, fn) {
  showMenu(title, lang.yesNo, fn)
}

function showYesNoMenuWithNumbers(title, fn) {
  showMenuWithNumbers(title, lang.yesNo, fn)
}

function showYesNoDropDown(title, fn) {
  showDropDown(title, lang.yesNo, fn)
}



function askText(title, fn) {
  io.menuFns.push(fn)
  msg(title)
  io.disable(2)
  document.querySelector('#input').style.display = 'block'

  parser.overrideWith(function(result) {
    io.enable()
    if (!settings.textInput) document.querySelector('#input').style.display = 'none'
    io.savedCommands.pop()
    if (io.savedCommandsPos > io.savedCommands.length) io.savedCommandsPos = io.savedCommands.length
    const fn = io.menuFns.pop()
    fn(result)
  })
}

function showDiag(title, text, submitButton) {
  if (!submitButton) return errormsg("Trying to use showDiag with no button")
  askDiag({title:title, text:text, width:400, height:'auto'}, null, submitButton)
}



function askDiag(title, fn, submitButton) {
  io.menuFns.push(fn)
  io.showMenuDiagTitle = title
  io.showMenuDiagSubmit = submitButton
  const disableTextFunction = function(disable) {
    if (disable) {
      io.disable(3)
    }
    else {
      io.enable()
      const el = document.querySelector('#sidepane-text')
      // el will not exist if walk-through
      if (el) el.remove()
    }
  }

  const displayFunction = function() {
    let s = '<div id="sidepane-menu"'
    if (title.width) s += ' style="width:' + title.width + 'px;top:100px;"'
    s += '>'

    if (typeof title === 'string') {
      s += '<p class="sidepane-menu-title">' + io.showMenuDiagTitle + '</p>'
    }
    else {
      s += '<h4 class="sidepane-menu-title">' + io.showMenuDiagTitle.title + '</h4>'
      s += '<p class="sidepane-menu-title">' + io.showMenuDiagTitle.text + '</p>'
    }
    if (fn) s += '<input type="text" id="text-dialog" class="sidepane-menu-option">'
    if (io.showMenuDiagSubmit) {
      s += '<div id="dialog-footer" style="text-align:right"><hr>'
      s += '<input type="button" onclick="io.textResponse()" value="' + io.showMenuDiagSubmit + '" class="sidepane-menu-button"></div>'
    }
    s += '</div>'
    document.querySelector('body').innerHTML += s
    

    if (fn) {
      const el = document.getElementById("text-dialog")
      el.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          io.textResponse()
        }
      })
      el.focus()
      io.menuFns.pop()
    }
  }

  io.input(false, [], disableTextFunction, fn, displayFunction)

  return world.SUCCESS_NO_TURNSCRIPTS
}






// This should be called after each turn to ensure we are at the end of the page and the text box has the focus
function endTurnUI(update) {
  if (!currentLocation) return errormsg("currentLocation not set (" + (player ? 'but player is' : 'nor is player') + ")")
  if (settings.panes !== 'none' && update) {
    // set the lang.exit_list
    for (let exit of lang.exit_list) {
      const el = document.querySelector('#exit-' + exit.name)
      if (!el) continue
      if (currentLocation.hasExit(exit.name, {excludeScenery:true}) || exit.type === 'nocmd') {
        el.style.display = 'block'
      }
      else {
        el.style.display = 'none'
      }
    }
    io.updateStatus()
  }
  for (let o of io.modulesToUpdate) {
    o.update(update)
  }
  io.updateUIItems()
  if (settings.updateCustomUI) settings.updateCustomUI()

  io.scrollToEnd()
  // give focus to command bar
  if (settings.textInput) { document.querySelector('#textbox').focus(); }
}



function createAdditionalPane(position, title, id, func) {
  const el = document.querySelector("#panes")
 
  const div = document.createElement('div');
  div.id = id + '-outer'
  div.classList.add("pane-div");
  div.innerHTML = io.getSidePaneHeadingHTML(title) + '<div id="' + id + '">' + func() + '</div>'
  el.insertBefore(div, el.children[position])
  settings.customPaneFunctions[id] = func
}








// ============  Hidden from creators!  =======================================




const io = {

  // Each line that is output is given an id, n plus an id number.
  nextid:0,
  // A list of names for items currently world. in the inventory panes
  currentItemList:[],

  modulesToUpdate:[],
  modulesToInit:[],
  modulesToDisable:[],
  modulesToEnable:[],
  spoken:false,
  //False for normal function, true if things should be printed to the same paragraph 
  otnb:false, 
  sameLine:false,
  slID:"output",
  menuFns:[],
  keydownFunctions:[],
  
  
  escapeCodes:{
    colon:':',
    lcurly:'{',
    rcurly:'}',
    lsquare:'[',
    rsquare:']',
    vert:'|',
    hash:'#',
  },  
  
  menuFunctions:{
    showMenu:showMenu,
    showDropDown:showDropDown,
    showMenuNumbersOnly:showMenuNumbersOnly,
    showMenuWithNumbers:showMenuWithNumbers,
    showMenuDiag:showMenuDiag,
  },

  showInTab:function(html, title = "Quest JS Tab") {
    const path = location.protocol + '//' + location.pathname.replace('index.html', '')
    const tab = window.open('about:blank', '_blank')
    if (!tab) {
      metamsg(lang.new_tab_failed)
      return false
    }
    
    settings.loadCssFiles(tab.document, path)
    
    const myScript = tab.document.createElement("script")
    myScript.setAttribute("src", path + 'lib/_transcript.js')
    tab.document.head.appendChild(myScript)
    tab.document.body.innerHTML = html
    tab.document.title = title
    tab.document.head.setAttribute('data-favicon', settings.favicon)
    tab.document.head.setAttribute('data-path', path)

    const link = tab.document.createElement('link')
    link.id = 'dynamic-favicon'
    link.rel = 'shortcut icon'
    link.href = path + settings.favicon
    tab.document.head.appendChild(link)
  },

}





// This is used by the various menu functions (not showMenuDiag).
io.input = function(title, options, disableTextFunction, reactFunction, displayFunction, failFunction) {
  // Store the values so we can use them later in io.menuResponse
  io.menuStartId = io.nextid
  io.menuFns.push(reactFunction)
  io.menuFailFn = failFunction
  io.menuOptions = options
  io.disableTextFunction = disableTextFunction ? disableTextFunction : function(disable) {
    if (disable) io.disable(3)
    if (!disable) io.enable()
  }
  
  // Skip if unit-testing
  if (test.testing) {
    if (test.menuResponseNumber === undefined) {
      debugmsg("Error when testing menu (possibly due to disambiguation?), test.menuResponseNumber = " + test.menuResponseNumber)
    }
    else {
      let n
      if (Array.isArray(test.menuResponseNumber)) {
        n = test.menuResponseNumber.shift()
        if (test.menuResponseNumber.length === 0) {
          delete test.menuResponseNumber
        }
      }
      else {
        n = test.menuResponseNumber
        delete test.menuResponseNumber
      }
      // Sort out the menuResponseNumber before hand in case the response also
      // uses it - we want it done before that
      io.menuResponse(n)
    }
    return; 
  }
  
  // Skip if walk-through
  if (settings.walkthroughMenuResponses.length > 0) {
    const response = settings.walkthroughMenuResponses.shift()
    if (typeof response === 'number') {
      io.menuResponse(response)
    }
    else {
      io.textResponse(response)
    }
    return; 
  }
  
  io.disableTextFunction(true)
  if (title) msg(title, {}, 'menu-title');
  displayFunction(options)
}







// The output system is quite complicated...
// https://github.com/ThePix/QuestJS/wiki/The-Output-Queue

io.outputQueue = []
io.outputSuspended = false


// Stops the current pause immediately (no effect if not paused)
io.unpause = function() {
  document.querySelector('.continue').remove()
  io.textBecamesOld()
  io.outputSuspended = false
  io.outputFromQueue()
  if (settings.textInput) document.querySelector('#textbox').focus();
}

io.addToOutputQueue = function(data) {
  data.id = io.nextid
  io.outputQueue.push(data)
  io.nextid++
  io.outputFromQueue()
}

io.forceOutputFromQueue = function() {
  io.outputSuspended = false
  io.outputFromQueue()
}


io.outputFromQueue = function() {
  if (io.outputSuspended) return
  if (io.outputQueue.length === 0) {
    if (!io.disableTextFunction) io.enable()
    return
  }
  
  //if (settings.textInput) document.querySelector('#input').style.display = 'block'
  const data = io.outputQueue.shift()
  if (data.action === 'wait' && (!settings.disableWaitInDevMode || settings.playMode !== 'dev')) {
    io.disable()
    io.outputSuspended = true
    //if (settings.textInput) document.querySelector('#input').style.display = 'none'
    data.tag = 'p'
    data.onclick="io.unpause()"
    if (!data.text) data.text = lang.click_to_continue
    io.print(data)
  }
  if (data.action === 'delay' && (!settings.disableWaitInDevMode || settings.playMode !== 'dev')) {
    log('here')
    io.disable()
    io.outputSuspended = true
    if (data.text) {
      data.tag = 'p'
      io.print(data)
    }
    setTimeout(io.unpause, data.delay * 1000)
  }
  if (data.action === 'output') {
    const html = io.print(data)
    io.speak(data.text);
    saveLoad.transcriptAppend(data);
    io.outputFromQueue()
  }
  if (data.action === 'func') {
    if (data.func()) io.outputFromQueue()
  }
  if (data.action === 'effect') {
    io.disable()
    // need a way to handle spoken and transcript here
    data.effect(data)
  }
  if (data.action === 'clear') {
    document.querySelector('#output').textContent = "";
    io.outputFromQueue()
  }
  if (data.action === 'sound') {
    if (!settings.silent) {
      const el = document.getElementById(data.name)
      el.currentTime = 0
      el.play()
    }
  }
  if (data.action === 'ambient') {
    for (let el of document.getElementsByTagName('audio')) el.pause()
    if (!settings.silent && data.name) {
      const el = document.getElementById(data.name)
      el.currentTime = 0
      el.loop = true
      el.play()
      if (data.volume) el.volume = data.volume / 10
    }
  }
  
  io.scrollToEnd()
  if (settings.textInput) document.querySelector('#textbox').focus()
}


io.allowedHtmlAttrs = ['width', 'height', 'onclick', 'src', 'autoplay' ]

io.print = function(data) {
  let html
  let keepSL 
  let slID 
  if (typeof data === 'string') {
    html = data
  }
  
  if (data.html) {
    html = data.html
  } 
  else if (io.sameLine == false){
    html = '<' + data.tag + ' id="n' + data.id + '"'
    if (data.cssClass) html += ' class="' + data.cssClass + '"'
    for (let s of io.allowedHtmlAttrs) if (data[s]) html += ' ' + s + '="' + data[s] + '"'
    html += '>' + data.text + "</" + data.tag + '>'
  }
  else {
      html = data.text 
  }
  if (data.destination) {
    document.querySelector("#" + data.destination).innerHTML = html
  }
  else {
      
      let keepSL = (html.indexOf("@@OUTPUTTEXTNOBR@@") > -1)
      let slID = "n" + (data.id-1) 
      if(keepSL == true) {
          html = html.replace("@@OUTPUTTEXTNOBR@@", "");
      }
      if(io.sameLine == true) { 
        let last = document.getElementById(slID)
        last.innerHTML = last.innerHTML + html
        io.sameLine = false 
      }
      else {
        document.querySelector("#output").innerHTML += html
      }
      io.sameLine = keepSL; 
      
  }
  return html
}


io.typewriterEffect = function(data) {
  if (!data.position) {
    document.querySelector("#output").innerHTML += '<' + data.tag + ' id="n' + data.id + '" class=\"typewriter\"></' + data.tag + '>'
    data.position = 0
    data.text = processText(data.text, data.params)
  }
  const el = document.querySelector('#n' + data.id)
  el.innerHTML = data.text.slice(0, data.position) + "<span class=\"typewriter-active\">" + data.text.slice(data.position, data.position + 1) + "</span>"
  data.position++
  if (data.position <= data.text.length) {
    io.outputQueue.unshift(data)
    io.outputSuspended = true
  }
  setTimeout(io.forceOutputFromQueue, settings.textEffectDelay)
}

io.unscrambleEffect = function(data) {
  // Set up the system
  if (!data.count) {
    document.querySelector("#output").innerHTML += '<' + data.tag + ' id="n' + data.id + '" class="typewriter"></' + data.tag + '>'
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
  document.querySelector("#n" + data.id).innerHTML = io.unscambleScramble(data)
  if (data.count > 0) {
    io.outputQueue.unshift(data)
    io.outputSuspended = true
  }
  setTimeout(io.forceOutputFromQueue, settings.textEffectDelay)
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



io.cmdlink = function(command, str) {
  return `<a class="cmd-link" onclick="runCmd('${command}')">${str}</a>`;
}








io.setTitleAndInit = function(s) {
  document.title = s
  for (let o of io.modulesToInit) {
    o.init()
  }
  io.calcMargins()
}

io.calcMargins = function() {
  //How much space do we need for images and map?
  let mapImageWidth = 0
  if (typeof map !== 'undefined') {
    if (!settings.hideMap) mapImageWidth = settings.mapWidth
  }
  if (typeof imagePane !== 'undefined') {
    if (!settings.hideImagePane && settings.imageWidth > mapImageWidth) mapImageWidth = settings.imageWidth
  }
  document.querySelector('#main').style.marginLeft = '40px'
  document.querySelector('#main').style.marginRight = '40px'

  // Do we show the side panes?
  if (settings.panes !== 'none') {
    const margin = settings.panes === 'left' ? 'margin-left' : 'margin-right'
    if (io.resizePanesListener.matches) { // If media query matches
      // hide sidepane
      document.querySelector('#main').style[margin] = (io.mainGutter) + 'px'
      document.querySelector('#panes').style.display = 'none'
    } else {
      // show sidepane
      document.querySelector('#main').style[margin] = (io.panesWidth + io.mainGutter) + 'px'
      document.querySelector('#panes').style.display = 'block'
    }
  }
  
  // Note: As of Jan/22 this takes account of settings.hideMap - but not of whether
  // the image should be hidden
  let margin = settings.panes === 'right' ? 'margin-left' : 'margin-right'
  if (settings.mapImageSide) margin = settings.mapImageSide === 'left' ? 'margin-left' : 'margin-right'
  if (io.resizeMapImageListener.matches || settings.hideMap) { // If media query matches
    // hide image
    document.querySelector('#main').style[margin] = io.mainGutter + 'px'
    document.querySelector('#quest-image').style.display = 'none'
    document.querySelector('#quest-map').style.display = 'none'
  } else {
    // show image
    document.querySelector('#main').style[margin] = (mapImageWidth + io.mainGutter) + 'px'
    document.querySelector('#quest-image').style.display = 'block'
    document.querySelector('#quest-map').style.display = 'block'
  }
}

io.mainGutter = 20
io.panesWidth = 160
io.resizePanesListener = window.matchMedia('(max-width: ' + settings.panesCollapseAt + 'px)')
io.resizeMapImageListener = window.matchMedia('(max-width: ' + settings.mapAndImageCollapseAt + 'px)')
io.resizePanesListener.addListener(io.calcMargins) // Attach listener function on state changes
io.resizeMapImageListener.addListener(io.calcMargins) // Attach listener function on state changes



  
// 0: not disabled at all
// 1: disable until output is done
// 2: awaiting special input, eg from menu, including text
// 3: awaiting special input, eg from menu, excluding text
io.disableLevel = 0

io.disable = function(level) {
  if (!level) level = 1
  if (level <= io.disableLevel) return
  io.disableLevel = level
  if (level !== 2) document.querySelector('#input').style.display = 'none'
  io.setCssByClass('compass-button .dark-body', 'color', '#808080')
  io.setCssByClass('item', 'color', '#808080')
  io.setCssByClass('item-action', 'color', '#808080')
  for (let o of io.modulesToDisable) {
    o.ioDisable(level)
  }
}

io.enable = function() {
  //log('enable (' + io.disableLevel + ')')
  if (!io.disableLevel) return
  io.disableLevel = 0
  document.querySelector('#input').style.display = 'block'
  if (settings.panes !== 'none') {
    io.setCssByClass('compass-button .dark-body', 'color', io.textColour)
    io.setCssByClass('item', 'color', io.textColour)
    io.setCssByClass('item-action', 'color', io.textColour)
  }
  for (let o of io.modulesToEnable) {
    o.ioEnable()
  }
}

// Call this to reset the interface
// Used when an input is not recognised and when an error is encountered
// Ensures input is enabled
io.reset = function() {
  io.enable()
  io.menuFns = []
  io.keydownFunctions = []
}

io.startCommand = function() {
  io.textBecamesOld()
  // may want to do other stuff here
}
  
io.textBecamesOld = function() {
  io.addClassForClass("default-p", 'old-text')
  io.addClassForClass("default-h", 'old-text')
  io.addClassForClass("meta", 'old-text')
  io.addClassForClass("parser", 'old-text')
  io.addClassForClass("error", 'old-text')
}


io.addClassForClass = function(oldClass, newClass) {
  const collection = document.getElementsByClassName(oldClass)
  for (const el of collection) el.classList.add(newClass)
}


io.updateUIItems = function() {
  if (settings.panes === 'none' || !settings.inventoryPane) { return; }

  for (let inv of settings.inventoryPane) {
    document.querySelector('#' + inv.alt).textContent = ""
    inv.hasContent = false
  }
  
  io.currentItemList = [];
  for (let key in w) {
    const item = w[key];
    for (let inv of settings.inventoryPane) {
      const loc = inv.getLoc ? inv.getLoc() : null
      if (inv.test(item) && !item.inventorySkip) {
        io.appendItem(item, inv.alt, loc, false, inv.highlight ? inv.highlight(item) : 0);
        inv.hasContent = true
      }
    }
  }
  if (settings.additionalInv) settings.additionalInv()
  for (let inv of settings.inventoryPane) {
    if (!inv.hasContent && inv.noContent) {
      const s = processText(inv.noContent)
      document.querySelector('#' + inv.alt).innerHTML = '<div class="item-nothing">' + s + '</div>'
    }
  }
  for (const key in settings.customPaneFunctions) {
    const el = document.querySelector('#' + key)
    if (!el) return
    let html = settings.customPaneFunctions[key]()
    el.innerHTML = html
  }
  io.clickItem('')
};


io.updateStatus = function() {
  if (settings.panes !== 'none' && settings.statusPane) {
    //document.querySelector("#status-pane").textContent = ""
    let s = ''
    for (let st of settings.status) {
      if (typeof st === "string") {
        if (player[st] !== undefined) {
          s += '<tr><td width="' + settings.statusWidthLeft + '">' + sentenceCase(st) + "</td>"
          s += '<td width="' + settings.statusWidthRight + '">' + player[st] + "</td></tr>"
        }
        else {
          s += "<tr>" + processText(st) + "</tr>"
        }
      }
      else if (typeof st === "function") {
        s += "<tr>" + st() + "</tr>"
      }
    }
    document.querySelector("#status-pane").innerHTML = s
  }

  if (settings.toolbar) { 
    io.createToolbar()
  }

}





io.menuResponse = function(n) {
  let input = n
  if (typeof n === 'string' && n.match(/^\d+$/)) n = parseInt(n) - 1
  if (typeof n === 'string') {
    n = io.menuOptions.findIndex(el => typeof el === 'string' ? el.includes(n) : el.alias.includes(n) )
  }

  // stop disabling input
  io.disableTextFunction(false)
  delete io.disableTextFunction

  // stop overriding the parser
  parser.overrideWith()

  // remove choices from screen
  for (let i = io.menuStartId; i < io.nextid; i++) document.querySelector('#n' + i).remove()

  // handle bad number
  if (n === undefined || n >= io.menuOptions[n] || n === -1) {
    io.menuFailFn(input)
  }
  
  // handle good number
  else {
    saveLoad.transcriptAppend({cssClass:'menu', text:(io.menuOptions[n].alias ? io.menuOptions[n].alias : io.menuOptions[n]), n:n});
    const fn = io.menuFns.pop()
    fn(io.menuOptions[n])
  }
  endTurnUI(true);
  if (settings.textInput) document.querySelector('#textbox').focus()
};



io.textResponse = function(s) {
  if (s === undefined) {
    const el = document.querySelector('#text-dialog')
    if (el) s = el.value
  }
  const el = document.querySelector('#sidepane-menu')
  // in case walk-through
  if (el) el.remove()

  // stop disabling input
  io.enable()

  saveLoad.transcriptAppend({cssClass:'menu', text:s})
  if (io.menuFns.length) {
    const fn = io.menuFns.pop()
    if (fn) fn(s)
  }
  endTurnUI(true);
  if (settings.textInput) document.querySelector('#textbox').focus()
}


// Used by showMenuNumbersOnly to capture number presses and pass the right menu option to the parser
io.keydownForMenuFunction = function(e) {
  const n = parseInt(e.key)
  if (!isNaN(n) && n <= io.menuOptions.length && n !== 0) {
    io.menuResponse(n - 1)
  }
  // Just ignore other keypresses
  
  // stopping the typed character appearing in the text field is not easy...
  // stopPropagation and stopImmediatePropagation did not do it,
  // even though it seems to happen after this
  // so just delete it!
  setTimeout(function() { 
    document.querySelector('#textbox').value = ''
    document.querySelector('#textbox').focus() 
  }, 10)
}



io.clickExit = function(dir) {
  if (io.disableLevel) return
  let failed = false
  runCmd(dir)
}

io.clickItem = function(itemName) {
  if (io.disableLevel) return
  if (!itemName) return
 
  const o = w[itemName]
  if (o.sidebarButtonVerb) {
    runCmd(o.sidebarButtonVerb + ' ' + w[itemName].alias)
    return
  }
 
 if (io.disableLevel) return;
  // duplicated items would toggle twice
  const uniq = [...new Set(io.currentItemList)];
  
  for (let item of uniq) {
    for (const el of document.querySelectorAll('.' + item + '-actions')) {
      if (item === itemName) {
        el.style.display = el.style.display === 'none' ? 'block' : 'none'
      }
      else {
        el.style.display = 'none'
      }
    }
  }
};


io.clickItemAction = function(itemName, action) {
  if (io.disableLevel) return
  const item = w[itemName];
  const cmd = action.includes('%') ? action.replace('%', item.alias) : action + ' ' + item.alias
  runCmd(cmd)
}


// Add the item to the DIV named htmlDiv
// The item will be given verbs from its attName attribute
io.appendItem = function(item, htmlDiv, loc, isSubItem, highlight) {
  const el = document.querySelector('#' + htmlDiv)
  io.currentItemList.push(item.name)

  el.innerHTML += io.getItemHtml(item, loc, isSubItem, highlight)

  if (item.container && !item.closed) {
    if (typeof item.getContents !== 'function') {
      log("WARNING: item flagged as container but no getContents function:");
      log(item);
    }
    const l = item.getContents(world.SIDE_PANE);
    for (let el of l) {
      io.appendItem(el, htmlDiv, item.name, true);
    }
  }
}


io.getItemHtml = function(item, loc, isSubItem, highlight) {
  if (typeof item.getVerbs !== 'function') return errormsg("Item with bad getVerbs: " + item.name)
  const verbList = item.getVerbs(loc)
  if (verbList === undefined) { errormsg("No verbs for " + item.name); console.log(item); }

  let s = '<div id="' + item.name + '-item"><p class="item' + (isSubItem ? ' sub-item' : '') + (highlight ? ' highlight-item' + highlight : '') + '" onclick="io.clickItem(\'' + item.name + '\')">' + io.getIcon(item) + item.getListAlias(loc) + "</p></div>"
  for (let verb of verbList) {
    if (typeof verb === 'string') verb = {name:verb, action:verb}
    s += '<div class="' + item.name + '-actions item-action'
    if (verb.style) s += ' ' + verb.style
    s += '" onclick="io.clickItemAction(\'' + item.name + '\', \'' + verb.action + '\')" style="display: none;">';
    s += verb.name;
    s += '</div>';
  }
  return s
}

// Creates the panes on the left or right
// Should only be called once, when the page is first built
io.createPanes = function() {
  if (!['right', 'left', 'none'].includes(settings.panes)) {
    console.error('ERROR: Your settings.panes value is "' + settings.panes + '". It must be one of "right", "left" or "none" (all lower-case). It is probably set in the file setiings.js.')
    return
  }

  document.querySelector('#input').innerHTML = '<span id="cursor">' + settings.cursor + '</span><input type="text" name="textbox" id="textbox" autocomplete="off" />'
  if (!settings.textInput) document.querySelector('#input').style.display = 'none'

  if (settings.panes === 'none') return
  
  let html = ''

  if (settings.compassPane) {
    html += '<div class="pane-div">'
    html += '<table id="compass-table">'
    for (let i = 0; i < 3; i++) {
      html += '<tr>'
      html += io.writeExit(0 + 5 * i)
      html += io.writeExit(1 + 5 * i)
      html += io.writeExit(2 + 5 * i)
      html += '<td></td>'
      html += io.writeExit(3 + 5 * i);
      html += io.writeExit(4 + 5 * i);
      html += '</tr>'
    }
    html += '</table>'
    html += '</div>'
  }

  if (settings.statusPane) {
    html += '<div class="pane-div">'
    html += io.getSidePaneHeadingHTML(settings.statusPane)
    html += '<table id="status-pane">'
    html += '</table>'
    html += '</div>'
  }
  
  if (settings.inventoryPane) {
    for (let inv of settings.inventoryPane) {
      html += '<div class="pane-div">'
      html += io.getSidePaneHeadingHTML(inv.name)
      html += '<div class="item-list" id="' + inv.alt + '">'
      html += '</div>'
      html += '</div>'
    }
  }

  html += '<div class="pane-div-finished">'
  html += lang.game_over_html
  html += '</div>'
  html += '</div>'
  
  const el = document.createElement("div")
  el.innerHTML = html
  el.setAttribute("id", "panes")
  el.classList.add('side-panes')
  el.classList.add('side-panes-' + settings.panes)
  el.classList.add('panes-narrow')
  
  const referenceNode = document.querySelector('#main')
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling)



  io.panesWidth = document.querySelector('.side-panes').clientWidth

  if (settings.customUI) settings.customUI();
};



io.getSidePaneHeadingHTML = function(title) {
  if (!title) return ''
  const id = verbify(title) + '-side-pane-heading'
  let s = '<h4 class="side-pane-heading" id=' + id + '>' + title
  if (settings.collapsibleSidePanes) {
    s += ' <i class="fas fa-eye" onclick="io._clickSidePaneHeading(\'' + id + '\')"></i>'
  }
  s += '</h4>'
  return s
}

io._clickSidePaneHeading = function(id) {
  const el = document.querySelector("#" + id).nextElementSibling
  if (el.style.display === 'none') {
    el.style.display = 'block'
  }
  else {
    el.style.display = 'none'
  }
  
  //alert('here' + e.target.classList)
}




io.writeExit = function(n) {
  let html = '<td class="compass-button" title="' + sentenceCase(lang.exit_list[n].name) + '">'
  html += '<span class="compass-button" id="exit-' + lang.exit_list[n].name
  html += '" onclick="io.clickExit(\'' + lang.exit_list[n].name + '\')">'
  html += settings.symbolsForCompass ? io.displayIconsCompass(lang.exit_list[n]) : lang.exit_list[n].abbrev
  html += '</span></td>'
  return html
};



// Gets the command with the given name
io.getCommand = function(name) {
  const found = commands.find(function(el) {
    return el.name === name;
  });
  return found;
};


io.msgInputText = function(s) {
  if (saveLoad.transcript && !s.match(lang.noWalkthroughRegex)) saveLoad.transcriptWalkthrough.push('    "' + s + '",')
  if (!settings.cmdEcho || s === '') return
  document.querySelector("#output").innerHTML += '<p id="n' + io.nextid + '" class="input-text">&gt; ' + s + "</p>"
  io.nextid++
  io.speak(s, true)
}

io.savedCommands = ['help'];
io.savedCommandsPos = 0;


// Called from scriptOnLoad in _settings.js, if there are no more scripts to load
io.init = function() {
  settings.performanceLog('Start io.onload')
  io.createPanes()
  if (settings.playMode === 'play') window.oncontextmenu = function () { return false }
  document.querySelector("#fileDialog").onchange = saveLoad.loadGameAsFile
  
  document.addEventListener('keydown', function(event){
    if (io.keydownFunctions.length) {
      const fn = io.keydownFunctions.pop()
      fn(event)
      return
    }
    const keycode = (event.keyCode ? event.keyCode : event.which)
    if (keycode === 13){
      // enter
      if (event.ctrlKey && (settings.playMode === 'dev' || settings.playMode === 'beta')) {
        parser.parse("script show")
      }
      else {
        const s = document.querySelector('#textbox').value;
        io.msgInputText(s);
        if (s) {
          if (io.savedCommands[io.savedCommands.length - 1] !== s && !io.doNotSaveInput) {
            io.savedCommands.push(s)
          }
          io.savedCommandsPos = io.savedCommands.length;
          parser.parse(s);
          if (io.doNotEraseLastCommand) {
            io.doNotEraseLastCommand = false
          }
          else {
            document.querySelector('#textbox').value = ''
          }
        }
      }
    }
    if (keycode === 38){
      // up arrow
      io.savedCommandsPos -= 1;
      if (io.savedCommandsPos < 0) { io.savedCommandsPos = 0; }
      document.querySelector('#textbox').value = io.savedCommands[io.savedCommandsPos]
      // Get cursor to end of text
      const el = document.querySelector('#textbox')
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
    if (keycode === 40){
      // down arrow
      io.savedCommandsPos += 1;
      if (io.savedCommandsPos >= io.savedCommands.length) { io.savedCommandsPos = io.savedCommands.length - 1; }
      document.querySelector('#textbox').value = io.savedCommands[io.savedCommandsPos]
    }
    if (keycode === 27){
      // ESC
      document.querySelector('#textbox').value = ''
    }
    if (!io.disableLevel) {
      // disable most special keys - all but the enter key
      if (settings.customKeyResponses) {
        if (settings.customKeyResponses(keycode, event)) return false
      }
      for (let exit of lang.exit_list) {
        if (exit.key && exit.key === keycode) {
          io.msgInputText(exit.name);
          parser.parse(exit.name);
          document.querySelector('#textbox').value = ''
          event.stopPropagation();
          event.preventDefault();
          return false;
        }
      }
      if (keycode == 123 && settings.playMode === 'play') return false
      if (event.ctrlKey && event.shiftKey && keycode == 73 && settings.playMode === 'play') return false
      if (event.ctrlKey && event.shiftKey && keycode == 74 && settings.playMode === 'play') return false

      if (keycode === 96 && (settings.playMode === 'dev' || settings.playMode === 'beta')){
        if (event.ctrlKey && event.altKey) {
          parser.parse("wt b")
        }
        else if (event.altKey) {
          parser.parse("wt a")
        }
        else if (event.ctrlKey) {
          parser.parse("wt c")
        }
        else {
          parser.parse("test")
        }
        setTimeout(function() { document.querySelector('#textbox').value = '' }, 1);
      }
      if (keycode === 90 && event.ctrlKey) {
        parser.parse("undo")
      }
    }
  })
  if (settings.panes !== 'none') io.textColour = document.querySelector(".side-panes").style.color
  /*if (settings.soundFiles) {
    const main = document.querySelector('#main')
    for (let el of settings.soundFiles) {
      main.innerHTML += '<audio id="' + el + '" src="' + settings.soundsFolder + el + settings.soundsFileExt + '"/>'
    }
  }*/
  settings.performanceLog('UI built')
  endTurnUI(true)
  settings.performanceLog('endTurnUI completed')

  if (document.querySelector('#loading')) document.querySelector('#loading').remove()
  if (!settings.suppressTitle) msgHeading(settings.title, 2)
  if (settings.subtitle) msgHeading(settings.subtitle, 3)
  io.setTitleAndInit(settings.title)
  if (settings.playMode === 'beta') lang.betaTestIntro()
  settings.performanceLog('Title/intro printed')
  
  if (settings.startingDialogEnabled) {
    settings.setUpDialog()
    setTimeout(function() {
      if (settings.startingDialogInit) settings.startingDialogInit()
    }, 10)
  }
  else {
    if (settings.startingDialogAlt) settings.startingDialogAlt()
    settings.delayStart = false
    world.begin()
  }
  settings.performanceLog('End io.onload')
}


io.synth = window.speechSynthesis;
io.voice = null;
io.voice2 = null;
 
io.speak = function(str, altVoice){
  if (!io.spoken) return
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
  document.querySelector('body').innerHTML += '<div id="showHtml" title="' + title + '">' + html + '</div>'
  io.dialogShowing = true;
  document.querySelector("#showHtml").dialog({
    width: 860,
    close:function() { document.querySelector("#showHtml").remove(); io.dialogShowing = false; },
  });
  return true;
}


io.finish = function(giveOptions) {
  settings.finished = {
    textInput:settings.textInput,
    inputDisplay:document.querySelector('#input').style.display,
  }
  io.finished = true
  settings.textInput = false
  document.querySelector('#input').style.display = 'none'
  if (settings.panes !== 'none') {
    for (const el of document.querySelectorAll('.pane-div')) {
      el.style.display = 'none'
    }
    document.querySelector('.pane-div-finished').style.display = 'block'
  }
  for (const el of settings.afterFinish) el()
  if (settings.finishMetaComment) metamsg(settings.finishMetaComment)
  if (saveLoad.transcriptExists()) metamsg(lang.transcript_finish)
  if (giveOptions) metamsg(lang.finish_options)
}

io.unfinish = function() {
  settings.finished = {
    textInput:settings.textInput,
    inputDisplay:document.querySelector('#input').style.display,
  }
  io.finished = false
  settings.textInput = settings.finished.textInput
  document.querySelector('#input').style.display = settings.finished.inputDisplay
  if (settings.panes !== 'none') {
    for (const el of document.querySelectorAll('.pane-div')) {
      el.style.display = 'block'
    }
    document.querySelector('.pane-div-finished').style.display = 'none'
  }
  settings.finished = false
}




io.toggleDarkMode = function() {
  settings.darkModeActive = !settings.darkModeActive
  if (settings.darkModeActive) {
    document.querySelector('body').classList.add("dark-body")
  }
  else {
    document.querySelector('body').classList.remove("dark-body")
  }
  if (settings.afterDarkToggle) settings.afterDarkToggle()
  if (settings.panes !== 'none') io.textColour = document.querySelector(".side-panes").style.color
  metamsg(lang.done_msg)
  return world.SUCCESS_NO_TURNSCRIPTS
}


io.toggleAutoScrollMode = function() {
  settings.autoscroll = !settings.autoscroll
  if (settings.afterAutoScrollToggle) settings.afterAutoScrollToggle()
  metamsg(lang.done_msg)
  return world.SUCCESS_NO_TURNSCRIPTS
}




io.toggleNarrowMode = function() {
  settings.narrowMode = (settings.narrowMode + 1) % 3
  document.querySelector('body').classList.remove("narrow-body")
  document.querySelector('body').classList.remove("very-narrow-body")
  if (settings.narrowMode === 1) document.querySelector('body').classList.add("narrow-body")
  if (settings.narrowMode === 2) document.querySelector('body').classList.add("very-narrow-body")
  if (settings.afterNarrowChange) settings.afterNarrowChange()
  metamsg(lang.done_msg)
  return world.SUCCESS_NO_TURNSCRIPTS
}


io.togglePlainFontMode = function() {
  settings.plainFontModeActive = !settings.plainFontModeActive
  if (settings.plainFontModeActive) {
    document.querySelector('body').classList.add("plain-font-body")
  }
  else {
    document.querySelector('body').classList.remove("plain-font-body")
  }
  if (settings.afterPlainFontToggle) settings.afterPlainFontToggle()
  metamsg(lang.done_msg)
  return world.SUCCESS_NO_TURNSCRIPTS
}



// If the element starts off displayed, you will probably needs to explicitly set display to block for it
// otherwise this will assume it is not
io.toggleDisplay = function(el) {
  if (typeof el === 'string') el = document.querySelector(el)
  el.style.display = el.style.display === 'block' ? 'none' : 'block'
}



io.copyTextToClipboard = function(text) {
  // from: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
  const textArea = document.createElement("textarea")
  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Styling just in case it gets displayed to make is as unobstrusive as possible
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';

  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    metamsg('Copying text command was ' + (successful ? 'successful' : 'unsuccessful'));
  } catch (err) {
    metamsg('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}



io.getIcon = function(item) {
  if (settings.iconsFolder === false) return ''
  if (!item.icon) return ''
  if (item.icon() === '') return ''
  return '<img src="' + settings.iconsFolder + (settings.darkModeActive ? 'l_' : 'd_') + item.icon() + '.png" />'
}


io.againOrOops = function(isAgain) {
  if (io.savedCommands.length === 0) {
    metamsg(lang.again_not_available)
    return world.FAILED
  }
  io.savedCommands.pop() // do not save AGAIN/OOPS
  if (isAgain) {
    parser.parse(io.savedCommands[io.savedCommands.length - 1])
  }
  else {
    document.querySelector('#textbox').value = io.savedCommands[io.savedCommands.length - 1]
    io.doNotEraseLastCommand = true
  }
  return world.SUCCESS_NO_TURNSCRIPTS;
}



io.setCssByClass = function(name, prop, val) {
  for (const el of document.querySelectorAll('.' + name)) el.style[prop] = val
}



// Display Icons for compass
io.displayIconsCompass = function(exit) {
  const datatransform = exit.rotate ? ' style="transform: rotate(40deg)"' : ''
  return '<i class="fas ' + exit.symbol + '"' + datatransform + '></i>';
}



io.scrollToEnd = function() {
  if (settings.autoscroll) window.scrollTo(0,document.getElementById('main').scrollHeight);  
}


io.getDropDownText = function(name) {
  const el = document.querySelector('#' + name)
  const val = el.options[el.selectedIndex].text
  return val
}


// Create Toolbar
io.createToolbar = function() {
  let el = document.querySelector("#toolbar")
  if (!el) {
    const div = document.createElement('div')
    div.setAttribute("id", "toolbar")
    //div.classList.add('button')
    div.classList.add('toolbar')
    document.querySelector("body").insertBefore(div, document.querySelector("#main"))
    el = document.querySelector("#toolbar")
    document.querySelector("#main").style.paddingTop = '30px'
    document.querySelector("#panes").style.top = '36px'
  }

  let html = "";
  html += '<div class="left">' + io.getToolbarHTML(settings.toolbar[0]) + '</div>'
  html += '<div class="middle">' + io.getToolbarHTML(settings.toolbar[1]) + '</div>'
  html += '<div class="right">' + io.getToolbarHTML(settings.toolbar[2]) + '</div>'
  el.innerHTML = html
}


io.getToolbarHTML = function(data = {}) {
  if (data.room) return sentenceCase(lang.getName(w[player.loc], { article:DEFINITE }))
  if (data.title) return '<b><i>' + settings.title + '</i></b>'
  if (data.content) return data.content()
  if (data.buttons) {
    let s = ''
    for (let el of data.buttons) {
      const js = el.cmd ? "runCmd('" + el.cmd + "')" : el.onclick
      s += ` <a class="link" onclick="if (!io.disableLevel)${js}"><i class="fas ${el.icon}" title="${el.title}"></i></a>`;
    }
    return s
  }
  return ''
}

io.focus = function(el) {
  if (typeof el === 'string') el = document.querySelector('#' + el)
  if (el !== document.activeElement) el.focus()
}


io.showHintSheet = function() { 
  let html = '<div id="main"><div id="inner"><div id="output"><h2 class="default-h default-h2">' + lang.hintSheet + '</h2>'
  html += "<p class=\"default-p\">" + lang.hintSheetIntro + "</p>"

  const words = []
  for (const el of settings.hintSheetData) words.push(...el.a.split(' '))
  const uniqueWords = [...new Set(words)].sort()
    
  for (const el of settings.hintSheetData) {
    html += "<p class=\"default-p\"><i>" + el.q + '</i>&nbsp;&nbsp;&nbsp; ' + io.encodeWords(el.a, uniqueWords) + "</p>"
  }

  html += "<hr/><table><tr>"

  for (let i = 0; i < uniqueWords.length; i++) {
    html += "<td>" + i + " - " + uniqueWords[i] + "</td>"

    if (i % 6 === 5) html += "</tr><tr>"
  }

  html += '</tr><table></div></div></div>'
  io.showInTab(html, lang.hintSheet)
}

io.encodeWords = function(s, words) {
  const numbers = []
  for (const word of s.split(' ')) numbers.push(words.indexOf(word))
  return numbers.map(el => '' + el).join(' ')
}