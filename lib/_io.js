// ============  Output  =======================================

"use strict"



if (settings.playMode !== 'dev') {
  window.onbeforeunload = function(event) { 
    event.returnValue = "Are you sure?"; 
  }
}

 

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
// Adds the given string to the print queue.
// This allows you to add any HTML you want to the output queue.
function rawPrint(s) {
  _msg(s, {}, {})
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
  _msg(s, params || {}, {tag:'h' + level})
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
  s += options.x ? ('' + options.x + ' ' + options.y) : '0 0'
  s += ' ' + width + ' ' + height + '" '
  if (options.background) s += 'style="background:' + options.background + '" '
  s += 'xmlns="http://www.w3.org/2000/svg">'
  s += data.join('') + '</svg>'
  if (settings.reportAllSvg) console.log(s.replace(/></g, '>\n<'))
  if (options.destination) {
    $('#' + options.destination).html(s)
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
  if (world.isCreated) {
    io.print({tag:'p', cssClass:"error", text:lang.error})
  }
  console.error("ERROR: " + s)
  console.log('Look through the trace below to find the offending code. The first entry in the list will be "errormsg", which is me, the next will the code that detected the error and called the "errormsg" message. You may need to look further down to find the root cause. If you get to the "jquery" lines you have gone too far.')
  console.trace()
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
  if (settings.playMode === 'dev' || settings.playMode === 'meta') {
    io.print({tag:'p', cssClass:"debug", text:s})
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
  //io.outputQueue.push({action:'clear'})
  io.addToOutputQueue({action:'clear'})
}

//@DOC
// Stops outputting whilst waiting for the player to click.
function wait(delay, text, func) {
  if (test.testing) return
  if (delay === undefined) {
    io.addToOutputQueue({action:'wait', text:text, cssClass:'continue', func:func})
  }
  else {
    io.addToOutputQueue({action:'delay', delay:delay, text:text, cssClass:'continue', func:func})
  }
}

function askQuestion(title, fn) {
  msg(title);
  parser.overrideWith(fn)
}

//@DOC
// Clears the screen.
function trigger(func) {
  //io.outputQueue.push({action:'clear'})
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

function showMenuWithNumbers(title, options, fn) {
  const opts = {article:DEFINITE, capital:true, noLinks:true}
  parser.overrideWith(function(s) {io.menuResponse(s)})
  io.input(title, options, true, fn, function(options) {
    for (let i = 0; i < options.length; i++) {
      let s = (i + 1) + '. <a class="menu-option" onclick="io.menuResponse(' + i + ')">';
      s += (typeof options[i] === 'string' ? options[i] : lang.getName(options[i], opts))
      s += '</a>';
      msg(s);
    }
  })
}

function showDropDown(title, options, fn) {
  const opts = {article:DEFINITE, capital:true, noLinks:true}
  io.input(title, options, false, fn, function(options) {
    let s = '<select id="menu-select" class="custom-select" style="width:400px;" ';
    s += 'onchange=\"io.menuResponse($(\'#menu-select\').find(\':selected\').val())\">';
    s += '<option value="-1">-- Select one --</option>';
    for (let i = 0; i < options.length; i++) {
      s += '<option value="' + (i+1) + '">';
      s += (typeof options[i] === 'string' ? options[i] : lang.getName(options[i], opts))
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

function showYesNoMenuWithNumbers(title, fn) {
  showMenuWithNumbers(title, lang.yesNo, fn)
}

function showYesNoDropDown(title, fn) {
  showDropDown(title, lang.yesNo, fn)
}




// This should be called after each turn to ensure we are at the end of the page and the text box has the focus
function endTurnUI(update) {
  if (settings.panes !== 'none' && update) {
    // set the lang.exit_list
    for (let exit of lang.exit_list) {
      if (game.room.hasExit(exit.name, {excludeScenery:true}) || exit.type === 'nocmd') {
        $('#exit-' + exit.name).show();
      }
      else {
        $('#exit-' + exit.name).hide();
      }
    }
    io.updateStatus();
    if (settings.updateCustomUI) settings.updateCustomUI()
  }
  for (let o of io.modulesToUpdate) {
    o.update(update)
  }
  io.updateUIItems()

  // scroll to end
  setTimeout(io.scrollToEnd,1);
  // give focus to command bar
  if (settings.textInput) { $('#textbox').focus(); }
}



function createPaneBox(position, title, content) 
{
    $("div.pane-div:nth-child(" + position + ")").before('<div class="pane-div"><h4 class="side-pane-heading">' + title + '</h4><div class="">' + content + '</div></div>');
}





// Create Toolbar
function createToolbar() {
  let html = "";
  html += '<div class="toolbar button" id="toolbar">';
  html += '<div class="status">';
  if (settings.toolbar.content) html += ' <div>' + settings.toolbar.content() + '</div>';
  html += '</div>';
  
  html += '<div class="room">';
  if (settings.toolbar.roomdisplay) {
    html += ' <div>' + sentenceCase(lang.getName(w[game.player.loc], { article:DEFINITE })) + '</div>';
  }
  html += '</div>';
    
  html += '<div class="links">'
  for (let link of settings.toolbar.buttons) {
    const js = link.cmd ? "runCmd('" + link.cmd + "')" : link.onclick
    html += ` <a class="link" onclick="${js}"><i class="fas ${link.icon}" title="${link.title}"></i></a>`;
  }
  html += '</div>';
  html += '</div>';
       
  $("#output").before(html);
}



// ============  Hidden from creators!  =======================================




const io = {

  // Each line that is output is given an id, n plus an id number.
  nextid:0,
  // A list of names for items currently world. in the inventory panes
  currentItemList:[],

  modulesToUpdate:[],
  modulesToInit:[],
  spoken:false,
  
  
  
  // TRANSCRIPT SUPPORT
  transcript:false,
  transcriptFlag:false,
  transcriptText:[],
  scriptStart:function() {
    this.transcript = true;
    this.transcriptFlag = true;
    metamsg("Transcript is now on.");
  },
  scriptEnd:function() {
    metamsg("Transcript is now off.");
    this.transcript = false;
  },
  scriptShow:function(opts) {
    if (opts === undefined) opts = '';
    if (opts === 'w') {
      const lines = []
      for (let el of this.transcriptText) {
        if (el.cssClass === 'input' && !el.text.match(/^(tran)?script/)) {
          lines.push('    "' + el.text + '",')
        }
        if (el.cssClass === 'menu') {
          const previous = lines.pop()
          if (typeof previous === 'string') {
            const d = {}
            d.cmd = /^ +\"(.+)\"/.exec(previous)[1]
            d.menu = [parseInt(el.n)]
            lines.push(d)
          }
          else {
            previous.menu.push(parseInt(el.n))
            lines.push(previous)
          }
        }
      }
      console.log(lines)
      const wt = lines.map(el => typeof el === 'string' ? el : '    ' + JSON.stringify(el) + ',').join('\n')
      io.copyTextToClipboard('  recorded:[\n' + wt + '\n  ],\n')
    }
    else {
      let html = '';
      html += '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Quest 6 Transcript for '
      html += settings.title
      html += '</title></head><body><h2>Quest 6 Transcript for "'
      html += settings.title + '" (version ' + settings.version
      html += ')</h2>'
      for (let el of this.transcriptText) {
        switch (el.cssClass) {
          case 'default-p': html += '<p>' + el.text + '</p>'; break;
          case 'meta': if (!opts.includes('m')) {html += '<p style="color:blue">' + el.text + '</p>';} break;
          case 'error': if (!opts.includes('e')) {html += '<p style="color:red">' + el.text + '</p>';} break;
          case 'debug': if (!opts.includes('d')) {html += '<p style="color:grey">' + el.text + '</p>';} break;
          case 'parser': if (!opts.includes('p')) {html += '<p style="color:magenta">' + el.text + '</p>';} break;
          case 'input': if (!opts.includes('i')) {html += '<p style="color:cyan">' + el.text + '</p>';} break;
          case 'menu': if (!opts.includes('o')) {html += '<p style="color:green">Menu option ' + el.n + ': ' + el.text + '</p>';} break;
          case 'html': html += el.text; break;
          default : html += '<' + el.tag + '>' + el.text + '</' + el.tag + '>'
        }
      }
      html += '</body></html>'
      const tab = window.open('about:blank', '_blank')
      tab.document.write(html)
      tab.document.close()
    }
  },
  scriptClear:function() {
    this.transcriptText = [];
    metamsg("Transcript cleared.");
  },
  scriptAppend:function(data) {
    this.transcriptText.push(data);
  },
};




io.input = function(title, options, allowText, reactFunction, displayFunction) {
  io.menuStartId = io.nextid;
  io.menuFn = reactFunction;
  io.menuOptions = options;
  
  if (test.testing) {
    if (test.menuResponseNumber === undefined) {
      debugmsg("Error when testing menu (possibly due to disambiguation?), test.menuResponseNumber = " + test.menuResponseNumber);
    }
    else {
      io.menuResponse(test.menuResponseNumber);
      delete test.menuResponseNumber
    }
    return; 
  }
  
  if (settings.walkthroughMenuResponses.length > 0) {
    const response = settings.walkthroughMenuResponses.shift() 
    console.log("Using response: " + response)
    console.log("settings.walkthroughMenuResponses.length: " + settings.walkthroughMenuResponses.length)
    io.menuResponse(response);
    return; 
  }
  
  io.disable(allowText ? 2 : 3);
  msg(title, {}, 'menu-title');
  displayFunction(options)
}







// The output system is quite complicated...
// https://github.com/ThePix/QuestJS/wiki/The-Output-Queue

io.outputQueue = []
io.outputSuspended = false


// Stops the current pause immediately (no effect if not paused)
io.unpause = function() {
  $('.continue').remove()
  io.outputSuspended = false
  io.outputFromQueue()
  if (settings.textInput) $('#textbox').focus();
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
    io.enable()
    return
  }
  
  //if (settings.textInput) $('#input').show()
  const data = io.outputQueue.shift()
  if (data.action === 'wait') {
    io.disable()
    io.outputSuspended = true
    //if (settings.textInput) $('#input').hide()
    data.tag = 'p'
    data.onclick="io.unpause()"
    if (!data.text) data.text = lang.click_to_continue
    io.print(data)
  }
  if (data.action === 'delay') {
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
    if (io.spoken) io.speak(html);
    if (io.transcript) io.scriptAppend(data);
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
    $('#output').empty();
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
  
  window.scrollTo(0, document.getElementById('main').scrollHeight)
  if (settings.textInput) $('#textbox').focus()
}


io.allowedHtmlAttrs = ['width', 'height', 'onclick', 'src', 'autoplay' ]

io.print = function(data) {
  let html
  if (typeof data === 'string') {
    html = data
  }
  if (data.html) {
    html = data.html
  }
  else {
    html = '<' + data.tag + ' id="n' + data.id + '"'
    if (data.cssClass) html += ' class="' + data.cssClass + '"'
    for (let s of io.allowedHtmlAttrs) if (data[s]) html += ' ' + s + '="' + data[s] + '"'
    html += '>' + data.text + "</" + data.tag + '>'
  }
  if (data.destination) {
    $("#" + data.destination).html(html)
  }
  else {
    $("#output").append(html)
  }
  return html
}


io.typewriterEffect = function(data) {
  if (!data.position) {
    $("#output").append('<' + data.tag + ' id="n' + data.id + '" class=\"typewriter\"></' + data.tag + '>');
    data.position = 0
    data.text = processText(data.text, data.params)
  }
  const el = $('#n' + data.id)
  el.html(data.text.slice(0, data.position) + "<span class=\"typewriter-active\">" + data.text.slice(data.position, data.position + 1) + "</span>");
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
    $("#output").append('<' + data.tag + ' id="n' + data.id + '" class="typewriter"></' + data.tag + '>');
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



io.scrollToEnd = function() {
   window.scrollTo(0,document.getElementById('main').scrollHeight);  
};





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

  $('#main').css('margin-left', '40px')
  $('#main').css('margin-right', '40px')

  // Do we show the side panes?
  if (settings.panes !== 'none') {
    const margin = settings.panes === 'left' ? 'margin-left' : 'margin-right'
    if (io.resizePanesListener.matches) { // If media query matches
      // hide sidepane
      $('#main').css(margin, (io.mainGutter) + 'px')
      $('#panes').css('display', 'none')
    } else {
      // show sidepane
      $('#main').css(margin, (io.panesWidth + io.mainGutter) + 'px')
      $('#panes').css('display', 'block')
    }
  }

  let margin = settings.panes === 'right' ? 'margin-left' : 'margin-right'
  if (settings.mapImageSide) margin = settings.mapImageSide === 'left' ? 'margin-left' : 'margin-right'
  if (io.resizeMapImageListener.matches) { // If media query matches
    // hide image
    $('#main').css(margin, (io.mainGutter) + 'px')
    $('#quest-image').css('display', 'none')
    $('#quest-map').css('display', 'none')
  } else {
    // show image
    $('#main').css(margin, (mapImageWidth + io.mainGutter) + 'px')
    $('#quest-image').css('display', 'block')
    $('#quest-map').css('display', 'block')
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
  if (level !== 2) $('#input').hide();
  $('.compass-button .dark-body').css('color', '#808080');
  $('.item').css('color', '#808080');
  $('.item-action').css('color', '#808080');
};

io.enable = function(level) {
  //console.log('enable ' + level + ' (' + io.disableLevel + ')')
  if (!level) level = 1
  if (!io.disableLevel || level < io.disableLevel) return
  io.disableLevel = 0
  $('#input').show();
  $('.compass-button').css('color', io.textColour);
  $('.item').css('color', io.textColour);
  $('.item-action').css('color', io.textColour);
};


io.updateUIItems = function() {
  if (settings.panes === 'none' || !settings.inventoryPane) { return; }

  for (let inv of settings.inventoryPane) {
    $('#' + inv.alt).empty();
  }
  
  io.currentItemList = [];
  for (let key in w) {
    const item = w[key];
    for (let inv of settings.inventoryPane) {
      const loc = inv.getLoc ? inv.getLoc() : null
      if (inv.test(item) && !item.inventorySkip) {
        io.appendItem(item, inv.alt, loc);
      }
    }
  }
  io.clickItem('');
};


io.updateStatus = function() {
  if (settings.statusPane) {
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
  }

  if (settings.toolbar) { 
    $("#toolbar").remove();
    createToolbar();
  }

}





io.menuResponse = function(n) {
  if (typeof n === 'string' && n.match(/^\d+$/)) n = parseInt(n) - 1
  if (typeof n === 'string') {
    const s = n
    n = io.menuOptions.findIndex(el => {
      console.log(el)
      if (typeof el === 'string') return el.includes(s)
      return el.name.includes(s)
    })
  }
  io.enable(5);
  parser.overrideWith()
  $('#input').css('world.', "block");
  for (let i = io.menuStartId; i < io.nextid; i++) $('#n' + i).remove()
  if (n === undefined) {
    io.menuFn()
  }
  else if (n !== -1) {
    if (io.transcript) io.scriptAppend({cssClass:'menu', text:(io.menuOptions[n].alias ? io.menuOptions[n].alias : io.menuOptions[n]), n:n});
    io.menuFn(io.menuOptions[n]);
  }
  endTurnUI(true);
  if (settings.textInput) $('#textbox').focus();
};



io.clickExit = function(dir) {
  if (io.disableLevel) return;

  let failed = false;
  io.msgInputText(dir);
  let cmd = io.getCommand("Go" + sentenceCase(dir))
  if (!cmd) cmd = io.getCommand(sentenceCase(dir))
  if (!cmd) cmd = io.getCommand("Meta" + sentenceCase(dir))
  parser.quickCmd(cmd);
};

io.clickItem = function(itemName) {
  if (io.disableLevel) return;

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
  if (io.disableLevel) return
  const item = w[itemName];
  const cmd = action.includes('%') ? action.replace('%', item.alias) : action + ' ' + item.alias
  io.msgInputText(cmd)
  parser.parse(cmd)
}


// Add the item to the DIV named htmlDiv
// The item will be given verbs from its attName attribute
io.appendItem = function(item, htmlDiv, loc, isSubItem) {
  $('#' + htmlDiv).append('<div id="' + item.name + '-item"><p class="item' + (isSubItem ? ' sub-item' : '') + '" onclick="io.clickItem(\'' + item.name + '\')">' + io.getIcon(item) + item.getListAlias(loc) + "</p></div>");
  io.currentItemList.push(item.name);
  const verbList = item.getVerbs(loc);
  if (verbList === undefined) { errormsg("No verbs for " + item.name); console.log(item); }
  for (let verb of verbList) {
    if (typeof verb === 'string') verb = {name:verb, action:verb}
    let s = '<div class="' + item.name + '-actions item-action" onclick="io.clickItemAction(\'' + item.name + '\', \'' + verb.action + '\')">';
    s += verb.name;
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
  if (!['right', 'left', 'none'].includes(settings.panes)) {
    console.error('ERROR: Your settings.panes value is "' + settings.panes + '". It must be one of "right", "left" or "none" (all lower-case). It is probably set in the file setiings.js.')
    return
  }

  $('#input').html('<span id="cursor">' + settings.cursor + '</span><input type="text" name="textbox" id="textbox"  autofocus/>')

  if (settings.panes === 'none') { return; }
  document.writeln('<div id="panes" class="side-panes side-panes' + settings.panes + ' panes-narrow">');

  if (settings.compassPane) {
    document.writeln('<div class="pane-div">');
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
    document.writeln('<div class="pane-div">');
    document.writeln('<h4 class="side-pane-heading">' + settings.statusPane + '</h4>');
    document.writeln('<table id="status-pane">');
    document.writeln('</table>');
    document.writeln('</div>');
  }
  
  if (settings.inventoryPane) {
    for (let inv of settings.inventoryPane) {
      document.writeln('<div class="pane-div">');
      document.writeln('<h4 class="side-pane-heading">' + inv.name + '</h4>');
      document.writeln('<div id="' + inv.alt + '">');
      document.writeln('</div>');
      document.writeln('</div>');
    }
  }

  document.writeln('<div class="pane-div-finished">');
  document.writeln(lang.game_over_html);
  document.writeln('</div>');
  document.writeln('</div>');

  if (settings.customUI) settings.customUI();
};


io.writeExit = function(n) {
  document.write('<td class="compass-button" title="' + lang.exit_list[n].name + '">')
  document.write('<span class="compass-button" id="exit-' + lang.exit_list[n].name)
  document.write('" onclick="io.clickExit(\'' + lang.exit_list[n].name + '\')">')
  document.write(settings.symbolsForCompass ? io.displayIconsCompass(lang.exit_list[n]) : lang.exit_list[n].abbrev);
  document.write('</span></td>');
};



// Gets the command with the given name
io.getCommand = function(name) {
  const found = commands.find(function(el) {
    return el.name === name;
  });
  return found;
};


io.msgInputText = function(s) {
  if (!settings.cmdEcho || s === '') return;
  $("#output").append('<p id="n' + io.nextid + '" class="input-text">&gt; ' + s + "</p>");
  io.nextid++;
  if (io.spoken) io.speak(s, true);
  if (io.transcript) io.scriptAppend({cssClass:'input', text:s});
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
          return false;
        }
      }
      if(keycode === 13){
        // enter
        if (event.ctrlKey && (settings.playMode === 'dev' || settings.playMode === 'beta')) {
          parser.parse("script show")
        }
        else {
          const s = $('#textbox').val();
          io.msgInputText(s);
          if (s) {
            if (io.savedCommands[io.savedCommands.length - 1] !== s) {
              io.savedCommands.push(s);
            }
            io.savedCommandsPos = io.savedCommands.length;
            parser.parse(s);
            if (io.doNotEraseLastCommand) {
              io.doNotEraseLastCommand = false
            }
            else {
              $('#textbox').val('');
            }
          }
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
      if(keycode === 96 && (settings.playMode === 'dev' || settings.playMode === 'beta')){
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
        setTimeout(function() { $('#textbox').val(''); }, 1);
      }
      if(keycode === 90 && event.ctrlKey) {
        parser.parse("undo")
      }
  });    
  io.textColour = $(".side-panes").css("color")
  if (settings.soundFiles) {
    const main = $('#main')
    for (let el of settings.soundFiles) {
      main.append('<audio id="' + el + '" src="' + settings.soundsFolder + el + settings.soundsFileExt + '"/>')
    }
  }
  game.initialise()
  endTurnUI(true)
  game.begin()
})


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


io.finish = function() {
  io.finished = true
  settings.textInput = false
  $('#input').hide()
  $('.pane-div').hide()
  $('.pane-div-finished').show()
  if (settings.onFinish) settings.onFinish()
  if (io.transcriptFlag) msg("To see the transcript, click {cmd:SCRIPT SHOW:here}.")
}



io.toggleDarkMode = function() {
  settings.darkModeActive = !settings.darkModeActive
  if (settings.darkModeActive) {
    $('body').addClass("dark-body")
  }
  else {
    $('body').removeClass("dark-body")
  }
  if (settings.onDarkToggle) settings.onDarkToggle()
  io.textColour = $(".side-panes").css("color")
  msg(lang.done_msg)
  return world.SUCCESS_NO_TURNSCRIPTS
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



io.addSlider = function(id, values, func) {
  if (!settings.sliders) settings.sliders = {}
  const name = sentenceCase(id.replace('-', ' '))
  const max = typeof values === 'number' ? values : values.length - 1
  settings.sliders[id] = {name:name, max:max, func:func}
  if (typeof values !== 'number') settings.sliders[id].values = values
  const slider = $('#' + id)
  slider.append('<p id="' + id + '-text">' + name + ': ' + (typeof values === 'number' ? 0 : values[0]) + '</p>')
  if (func) func(0)
  slider.append('<div id="' + id + '-slider"></div>')
  slider.css('padding-left', '10px')
  slider.css('padding-right', '10px')
  
  $('#' + id + '-slider').slider({max:max})
  $('#' + id + '-slider').slider({
    slide: function(event, ui) {
      const id = event.target.id.replace('-slider', '')
      const value = ui.value
      $('#' + id + '-text').html(settings.sliders[id].name + ': ' + (settings.sliders[id].values ? settings.sliders[id].values[value] : value))
      if (settings.sliders[id].func) {
        settings.sliders[id].func(value)
      }
      else {
        $('#' + id + '-text').html(settings.sliders[id].name + ': ' + (settings.sliders[id].values ? settings.sliders[id].values[value] : value))
      }
    }
  })
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
    $('#textbox').val(io.savedCommands[io.savedCommands.length - 1])
    io.doNotEraseLastCommand = true
  }
  return world.SUCCESS_NO_TURNSCRIPTS;
}



// Display Icons for compas
io.displayIconsCompass = function(exit) {
  const datatransform = exit.rotate ? ' style="transform: rotate(40deg)"' : ''
  return '<i class="fas ' + exit.symbol + '"' + datatransform + '></i>';
}