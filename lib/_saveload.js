"use strict";

// Should all be language neutral


/*

The game state is saved as a name-value pair.

The value is the game state, with each segment separated by an exclamation mark. The first four segments are the header, the rest are the body. The header consists of the title, version, comment and timestamp. Each segment of the body is an object in the game.

An object is saved as its name followed by an equals sign followed by either "Object" or by "Clone:" and the name of the clone's prototype, followed by an equals sign, and then the data. Each datam is separated by a semi-colon. Each datum consists of the name, the type and the value, separated by colons.

If a datum is an object, and has a name attribute, the name is saved as type qobject.

If the datam is an array and the first element is a string, it is assumed that all the elements are strings, and it is saved as an array. Other arrays are not saved.

If the datam is a number, a string or true it is saved as such.

Any other objects or values will not be saved.


*/


const saveLoad = {

  getName:function(filename) {
    return "QJS:" + settings.title + ":" + filename
  },

  saveGame:function(filename, overwrite) {
    if (filename === undefined) {
      errormsg(sl_no_filename);
      return false;
    }
    
    if (localStorage.getItem(this.getName(filename)) && !overwrite) {
      metamsg(lang.sl_already_exists)
      return
    }
    const comment = settings.saveComment ? settings.saveComment() : "-"
    const s = saveLoad.saveTheWorld(comment)
    //console.log(s)
    localStorage.setItem(this.getName(filename), s)
    metamsg(lang.sl_saved, {filename:filename, toFile:false})
    if (settings.afterSave) settings.afterSave(filename)
    return true;
  },

  saveGameAsFile:function(filename) {
    const comment = settings.saveComment ? settings.saveComment() : "-"
    const s = saveLoad.saveTheWorld(comment)
    const myFile = new File([s], filename+".q6save", {type: "text/plain;charset=utf-8"})
    saveAs(myFile)
    metamsg(lang.sl_saved, {filename:filename, toFile:true})
    if (settings.afterSave) settings.afterSave(filename, true)
    return true
  },

  saveTheWorld:function(comment) {
    return saveLoad.getSaveHeader(comment) + saveLoad.getSaveBody();
  },

  getHeader:function(s) {
    const arr = s.split("!");
    return { title:saveLoad.decodeString(arr[0]), version:saveLoad.decodeString(arr[1]), comment:saveLoad.decodeString(arr[2]), timestamp:arr[3] };
  },

  getSaveHeader:function(comment) {
    const currentdate = new Date();
    let s = saveLoad.encodeString(settings.title) + "!";
    s += saveLoad.encodeString(settings.version) + "!";
    s += saveLoad.encodeString(comment) + "!";
    s += currentdate.toLocaleString() + "!";
    return s;
  },

  getSaveBody:function() {
    const l = [tp.getSaveString(), game.getSaveString(), util.getChangeListenersSaveString()]
    for (let key in w) {
      l.push(key + "=" + w[key].getSaveString())
    }
    return l.join("!")
  },
  

  
  
  
  // LOAD
  
  // This function will be attached to #fileDialog as its "onchange" event
  loadGameAsFile:function() {
		const fileInput = document.querySelector("#fileDialog")
		const fileIn = fileInput.files
		
		const reader = new FileReader()
		reader.readAsText(fileIn[0])
		reader.onload = function(){
			saveLoad.loadGame(fileIn[0].name, reader.result)
			const el = document.querySelector("#fileDialogForm")
			el.reset()
		}
		reader.onerror = function(){
			log(reader.error)
		}
  },

  loadGameFromLS:function(filename) {
    //log(">" + filename + "<")
    const contents = localStorage.getItem(this.getName(filename));
    this.loadGame(filename, contents)
  },

  loadGame:function(filename, contents) {
    if (!contents) {
      metamsg(lang.sl_file_not_found);
    }
    else if (!contents.startsWith(settings.title + '!')) {
      const encodedTitle = contents.substr(0, contents.indexOf('!')); 
      metamsg(lang.sl_bad_format, {title:saveLoad.decodeString(encodedTitle)})
    }
    else {
      saveLoad.loadTheWorld(contents, 4)
      clearScreen()
      metamsg(lang.sl_file_loaded, {filename:filename})
      if (settings.afterLoad) settings.afterLoad(filename)
      currentLocation.description()
    }
  },



  loadTheWorld:function(s, removeHeader) {
    const arr = s.split("!");
    if (removeHeader !== undefined) {
      arr.splice(0, removeHeader);
    }
    
    // Eliminate all clones
    for (let key in w) {
      if (w[key].clonePrototype) delete w[key]
    }
    
    tp.setLoadString(arr.shift())
    game.setLoadString(arr.shift())
    util.setChangeListenersLoadString(arr.shift())
    for (let el of arr) {
      this.setLoadString(el);
    }
    world.update()
    endTurnUI(true)
  },



  setLoadString:function(s) {
    const parts = s.split("=");
    if (parts.length !== 3) {
      errormsg("Bad format in saved data (" + s + ")");
      return;
    }
    const name = parts[0];
    const saveType = parts[1]
    const arr = parts[2].split(";");
    
    if (saveType.startsWith("Clone")) {
      const clonePrototype = saveType.split(":")[1];
      if (!w[clonePrototype]) {
        errormsg("Cannot find prototype '" + clonePrototype + "'");
        return;
      }
      const obj = cloneObject(w[clonePrototype]);
      this.setFromArray(obj, arr);
      w[obj.name] = obj;
      obj.afterLoadForTemplate();
      return
    }
    
    if (saveType === "Object") {
      if (!w[name]) {
        errormsg("Cannot find object '" + name + "'");
        return;
      }
      const obj = w[name];
      this.setFromArray(obj, arr);
      obj.afterLoadForTemplate();
      return
    }
    
    errormsg("Unknown save type for object '" + name + "' (" + hash.saveType + ")");
  },
  
  

  
  
  // UTILs  
  
  decode:function(hash, str) {
    if (str.length === 0) return false
    const parts = str.split(":")
    const key = parts[0]
    const attType = parts[1]
    const s = parts[2]
    
    if (attType === "boolean") {
      hash[key] = (s === "true")
    }

    else if (attType === "number") {
      hash[key] = parseFloat(s)
    }
    
    else if (attType === "string") {
      hash[key] = saveLoad.decodeString(s)
    }
    
    else if (attType === "array") {
      hash[key] = saveLoad.decodeArray(s)
    }
    
    else if (attType === "numberarray") {
      hash[key] = saveLoad.decodeNumberArray(s)
    }
    
    else if (attType === "emptyarray") {
      hash[key] = []
    }
    
    else if (attType === "emptystring") {
      hash[key] = ''
    }
    
    else if (attType === "qobject") {
      // this will cause an issue if it points to a clone that has not been done yet !!!
      hash[key] = w[s]
    }
    
    return key
  },
  
  encode:function(key, value) {
    if (value === 0) return key + ":number:0;"
    if (value === false) return key + ":boolean:false;"
    if (value === '') return key + ":emptystring;"
    if (!value) return ''
    let attType = typeof value;
    if (Array.isArray(value)) {
      try {
        if (value.length === 0) return key + ":emptyarray;";
        if (typeof value[0] === 'string') return key + ":array:" + saveLoad.encodeArray(value) + ";";
        if (typeof value[0] === 'number') return key + ":numberarray:" + saveLoad.encodeNumberArray(value) + ";";
        return '';
      } catch (error) {
        // Add the name of the attribute to the error message
        //console.trace()
        log(value)
        throw "Error encountered with attribute \"" + key + "\": " + error + ". More here: https://github.com/ThePix/QuestJS/wiki/Save-Load#save-errors"
      }
    }
    if (value instanceof Exit) {
      return '';
    }
    if (attType === "object") {
      if (value.name) return key + ":qobject:" + value.name + ";";
      return '';
    }
    if (attType === "string") {
      return key + ":string:" + saveLoad.encodeString(value) + ";";
    }
    return key + ":" + attType + ":" + value + ";";
  },


  replacements:[
    { unescaped:':', escaped:'cln'},
    { unescaped:';', escaped:'scln'},
    { unescaped:'!', escaped:'exm'},
    { unescaped:'=', escaped:'eqs'},
    { unescaped:'~', escaped:'tld'},
  ],


  encodeString:function(s) {
    for (let d of saveLoad.replacements) {
      if (typeof s !== 'string') throw "Found type \"" + (typeof s) + "\" in array - should be only strings."
      s = s.replace(new RegExp(d.unescaped, "g"), "@@@" + d.escaped + "@@@");
    }
    return s;
  },

  decodeString:function(s) {
    //if (typeof s !== 'string') {
    //  console.log("Expecting a string there, but found this instead (did you add an object to a list rather than its name?):")
    //  console.log(s)
    ///}
    for (let d of saveLoad.replacements) {
      s = s.replace(new RegExp("@@@" + d.escaped + "@@@", "g"), d.unescaped);
    }
    return s;
  },

  encodeArray:function(ary) {
    return ary.map(el => saveLoad.encodeString(el)).join('~');
  },

  decodeArray:function(s) {
    return s.split('~').map(el => saveLoad.decodeString(el));
  },

  encodeNumberArray:function(ary) {
    return ary.map(el => {
      if (typeof el !== 'number') throw "Found type \"" + (typeof el) + "\" in array - should be only numbers."
      return el.toString()
    }).join('~');
  },

  decodeNumberArray:function(s) {
    return s.split('~').map(el => parseFloat(el));
  },

  decodeExit:function(s) {
    return s.split('~').map(el => saveLoad.decodeString(el));
  },

  
  lsTest:function() {
    const test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
  },

  
  
  
  // Other functions
  
  deleteGame:function(filename) {
    localStorage.removeItem(this.getName(filename));
    metamsg(lang.sl_deleted);
  },

  dirGame:function() {
    const arr0 = lang.sl_dir_headings.map(el => '<th>' + el + '</th>')
    if (!settings.saveComment) arr0.pop()
    let s = arr0.join('')
    for (let key in localStorage) {
      if (!key.startsWith('QJS:')) continue
      const arr1 = key.split(':')
      const arr2 = localStorage[key].split('!')
      log(arr2.slice(1, 4))
      s += "<tr>"
      s += "<td>" + arr1[2] + "</td>"
      s += "<td>" + arr1[1] + "</td>"
      s += "<td>" + arr2[1] + "</td>"
      s += "<td>" + arr2[3] + "</td>"
      if (settings.saveComment) s += "<td>" + arr2[2] + "</td>"
      s += "</tr>"
    }  
    _msg(s, {}, {cssClass:"meta", tag:'table'})
    metamsg(lang.sl_dir_msg)
  },
    
  testExistsGame:function(filename) {
    const data = localStorage[this.getName(filename)]
    return data !== undefined
  },
  
  getSummary:function(filename) {
    const data = localStorage[this.getName(filename)]
    if (!data) return null
    const arr = data.split('!')
    return arr.slice(1, 4)
  },

  setFromArray:function(obj, arr) {
    const keys = Object.keys(obj).filter(e => !obj.saveLoadExclude(e))
    for (let el of keys) delete obj[el]
    for (let el of arr) saveLoad.decode(obj, el)
  },



  // ------------------------------------------------------------------------------------------
  //    TRANSCRIPTS
  //
  // Here because it uses localStorage. That said, there are two independant systems, the second
  // records commands to create a walk-through, and is saved in an array, this.transcriptWalkthrough
  // because only the author should ever use it. 

  transcript:false,  // Set to true when recording
  transcriptName:"QJST:" + settings.title + ":transcript",

  transcriptStart:function() {
    this.transcript = true
    this.transcriptWalkthrough = []
    metamsg(lang.transcript_on)
    this.transcriptWrite(lang.transcriptStart())
  },

  transcriptEnd:function() {
    this.transcriptWrite(lang.transcriptEnd())
    this.transcript = false
    metamsg(lang.transcript_off)
  },

  transcriptAppend:function(data) {
    if (!this.transcript) return
    if (data.cssClass === 'menu') {
      let previous = this.transcriptWalkthrough.pop()
      if (previous) {
        previous = previous.replace(/\,$/, '').trim()
        this.transcriptWalkthrough.push('    {cmd:' + previous + ', menu:' + data.n + '},')
      }
    }
    this.transcriptWrite('<p class="' + data.cssClass + '">' + data.text + '</p>')
  },

  // Used internally to write to the file, appending it to the existing text.
  transcriptWrite:function(html) {
    let s = localStorage.getItem(this.transcriptName)
    if (!s) s = ''
    s += '\n\n' + html
    localStorage.setItem(this.transcriptName, s)
  },

  transcriptClear:function(data) {
    localStorage.removeItem(this.transcriptName)
    metamsg(lang.transcript_cleared)
  },

  // Is there a transcript saved?
  transcriptExists:function(data) {
    return localStorage.getItem(this.transcriptName) !== undefined
  },

  transcriptShow:function() {
    const s = localStorage.getItem(this.transcriptName)
    if (!s) {
      metamsg(lang.transcript_none)
      return false
    }
    
    let html = ''
    html += '<div id="main"><div id="inner"><div id="output">'
    html += lang.transcriptTitle()
    html += s
    html += '</div></div></div>'
    io.showInTab(html, 'QuestJS Transcript: ' + settings.title)
    metamsg(lang.done_msg)
  },

  transcriptWalk:function() {
    let html = ''
    html += '<div id="main"><div id="inner"><div id="output">'
    html += '<br/><h2>Generated QuestJS Walk-through</h2><br/><br/>'
    html += '<p>Copy-and-paste the code below into code.js. You can quickly run the walk-though with [Ctrl][Enter].</p>'
    html += '<p>If you already have a walk-through, you will need to just copy-and-paste the right bit - probably all but the first and last lines, and insert just before the curly brace at the end. You may need to rename it too.</p>'
    html += '<pre>\n\n\nconst walkthroughs = {\n  c:[\n'
    html += this.transcriptWalkthrough.join('\n')
    html += '\n  ],\n}</pre>'
    html += '</div></div></div>'
    io.showInTab(html, 'QuestJS Transcript: ' + settings.title)
  },
  
  achievementsKey:'__achievement__list__for__this__game__',
  
  setAchievement(s) {
    const achievementsJSON = localStorage.getItem(this.achievementsKey)
    const achievements = achievementsJSON ? JSON.parse(achievementsJSON) : {}
    
    if (achievements[s]) return
    
    achievements[s] = Date.now()
    _msg(lang.ach_got_one, {text:s, date:achievements[s]}, {cssClass:"meta achieve", tag:'p'})
    localStorage.setItem(this.achievementsKey, JSON.stringify(achievements))
  },
  
  listAchievements() {
    const achievementsJSON = localStorage.getItem(this.achievementsKey)
    const achievements = achievementsJSON ? JSON.parse(achievementsJSON) : {}

    if (Object.keys(achievements).length === 0) {
      _msg(lang.ach_none_yet, {}, {cssClass:"meta achieve", tag:'p'})
      return
    }
    _msg(lang.ach_list_intro, {count:Object.keys(achievements).length}, {cssClass:"meta achieve", tag:'p'})
    for (const key in achievements) {
      _msg(lang.ach_list_item, {text:key, date:achievements[key]}, {cssClass:"meta achieve", tag:'p'})
    }
    if (lang.ach_list_outro) _msg(lang.ach_list_outro, {count:Object.keys(achievements).length}, {cssClass:"meta achieve", tag:'p'})
  },
  

  
  resetAchievements() {
    localStorage.removeItem(this.achievementsKey)
  },
  
}
