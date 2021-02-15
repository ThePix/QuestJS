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
    const s = saveLoad.saveTheWorld(comment);
    //console.log(s)
    localStorage.setItem(this.getName(filename), s);
    metamsg(lang.sl_saved, {filename:filename});
    if (settings.afterSave) settings.afterSave(filename)
    return true;
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
    const l = ["tpUsedStrings=" + tp.getSaveString()]
    for (let key in w) {
      l.push(key + "=" + w[key].getSaveString())
    }
    return l.join("!")
  },
  

  
  
  
  // LOAD
  
  loadGame:function(filename) {
    const s = localStorage.getItem(this.getName(filename));
    if (s != null) {
      saveLoad.loadTheWorld(s, 4)
      clearScreen()
      metamsg("Loaded file \"" + filename + "\"")
      if (settings.afterLoad) settings.afterLoad(filename)
      game.room.description()
    }
    else {
      metamsg(lang.sl_file_not_found);
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
    for (let el of arr) {
      this.setLoadString(el);
    }
    game.update()
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
      obj.templatePostLoad();
      return
    }
    
    if (saveType === "Object") {
      if (!w[name]) {
        errormsg("Cannot find object '" + name + "'");
        return;
      }
      const obj = w[name];
      this.setFromArray(obj, arr);
      obj.templatePostLoad();
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
      if (value.length === 0) return key + ":emptyarray;";
      if (typeof value[0] === 'string') return key + ":array:" + saveLoad.encodeArray(value) + ";";
      if (typeof value[0] === 'number') return key + ":numberarray:" + saveLoad.encodeNumberArray(value) + ";";
      return '';
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
      s = s.replace(new RegExp(d.unescaped, "g"), "@@@" + d.escaped + "@@@");
    }
    return s;
  },

  decodeString:function(s) {
    if (typeof s !== 'string') {
      console.log("Expecting a string there, but found this instead (did you add an object to a list rather than its name?):")
      console.log(s)
    }
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
    return ary.map(el => el.toString()).join('~');
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
  
  

  setFromArray:function(obj, arr) {
    const keys = Object.keys(obj).filter(e => typeof obj[e] !== 'function' && !settings.saveLoadExcludedAtts.includes(e) && !obj.saveLoadExcludedAtts.includes(e) && !(obj[e] instanceof Exit))
    for (let el of keys) delete obj[el]
    for (let el of arr) saveLoad.decode(obj, el)
  },

  

};
