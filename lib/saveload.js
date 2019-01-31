"use strict";

// Should all be language neutral


// Each object is saved as a string in the format [object]=[name1]:[value1];[name2]:[value2]
// There can be as many name/value pairs as required.
// One name/pair should be the "saveType", which can be "Object", "Clone" or a custom value
// Each object is separated by a vertical bar.

// Customise by giving an object its own getSaveString function, which should include the custom
// type as the "saveType". Then add your custom loader, named "load" plus the "saveType" to the
// saveLoad object. It should accept a name and a hash. So far untested, so good luck!

// For more limited customisation, give your object customSave and customLoad functions.
// The customeSave function getscalled before saving, so could be used to convert an odd attribute
// into a string to be saved. Te customLoad is called after loading, so could convert that string
// back to the odd attribute.
 

const saveLoad = {

  saveGame:function(filename, comment) {
    if (filename === undefined) {
      errormsg(SL_NO_FILENAME);
      return false;
    }
    if (comment === undefined) { comment = "-"; }
    const s = saveLoad.saveTheWorld(comment);
    localStorage.setItem(TITLE + ": " + filename, s);
    metamsg("Saved");
    return true;
  },

  saveTheWorld:function(comment) {
    return saveLoad.getSaveHeader(comment) + saveLoad.getSaveBody();
  },

  getHeader:function(s) {
    const arr = s.split("|");
    return { title:arr[0], version:arr[1], comment:arr[2], timestamp:arr[3] };
  },

  getSaveHeader:function(comment) {
    const currentdate = new Date();
    let s = replaceAll(TITLE, "|", "") + "|";
    s += replaceAll(VERSION, "|", "") + "|";
    s += (comment ? replaceAll(comment, "|", "") : "-") + "|";
    s += currentdate.toLocaleString() + "|";
    return s;
  },

  getSaveBody:function() {
    const l = [];
    for (let key in w) {
      l.push(key + "=" + w[key].getSaveString());
    }
    return l.join("|");
  },
  

  
  
  
  // LOAD
  
  loadGame:function(filename) {
    const s = localStorage.getItem(TITLE + ": " + filename);
    saveLoad.loadTheWorld(s);
    metamsg("Loaded");
  },

  loadTheWorld:function(s) {
    const arr = s.split("|");
    arr.splice(0, 4);
    
    // Eliminate all clones
    // Reset followers
    for (let key in w) {
      if (w[key].followers) w[key].followers = [];
      if (w[key].clonePrototype) delete w[key];
    }
    
    for (let i = 0; i < arr.length; i++) {
      this.setLoadString(arr[i]);
    }
    game.update();
  },

  setLoadString:function(s) {
    const parts = s.split("=");
    if (parts.length !== 2) {
      errormsg("Bad format in saved data (" + s + ")");
      return;
    }
    const name = parts[0];
    const arr = parts[1].split(";");
    let obj, hash = {};
    for (let i = 0; i < arr.length; i++) {
      let parts = arr[i].split(":");
      hash[parts[0]] = saveLoad.decode(parts[1]);
    }
    
    if (!hash.saveType) {
      errormsg("Cannot find save type for object '" + name + "'");
      return;
    }
    
    if (hash.saveType === "Clone") {
      if (!w[hash.clonePrototype]) {
        errormsg("Cannot find prototype '" + hash.clonePrototype + "'");
        return;
      }
      obj = cloneObject(w[hash.clonePrototype]);
      setFromHash(obj, hash);
      w[obj.name] = obj;
      if (obj.customLoad) {
        obj.customLoad();
      }
      return
    }
    
    if (hash.saveType === "Object") {
      if (!w[name]) {
        errormsg("Cannot find object '" + name + "'");
        return;
      }
      obj = w[name];
      setFromHash(obj, hash);
      if (obj.customLoad) {
        obj.customLoad();
      }
      return
    }
    
    if (saveLoad["load" + hash.saveType]) {
      saveLoad["load" + hash.saveType](name, hash);
      return;
    }
    
    errormsg("Unknown save type for object '" + name + "' (" + hash.saveType + ")");
  },
  
  

  
  
  // UTILs  
  
  decode:function(s) {
    if (s === "true") return true;
    if (s === "false") return false;
    if (!/^\"/.test(s)) return parseInt(s);
    return saveLoad.unescape(s);
  },
  
  encode:function(key, value) {
    return key + ":" + saveLoad.escape(value) + ";";
  },

  escape:function(s) {
    if (typeof s !== "string") {
      return s;
    }
    s = replaceAll(s, /\{/g, "@@@ocb@@@");
    s = replaceAll(s, /\}/g, "@@@ccb@@@");
    s = replaceAll(s, /\:/g, "@@@cln@@@");
    s = replaceAll(s, /\;/g, "@@@sc@@@");
    s = replaceAll(s, /\"/g, "@@@dq@@@");
    s = replaceAll(s, /\|/g, "@@@vb@@@");
    s = replaceAll(s, /\=/g, "@@@eqs@@@");
    return '"' + s + '"';
  },

  unescape:function(s) {
    s = replaceAll(s, /\"/g, "");
    s = replaceAll(s, /@@@ocb@@@/g, "{");
    s = replaceAll(s, /@@@ccb@@@/g, "}");
    s = replaceAll(s, /@@@cln@@@/g, ":");
    s = replaceAll(s, /@@@sc@@@/g, ";");
    s = replaceAll(s, /@@@dq@@@/g, '"');
    s = replaceAll(s, /@@@vb@@@/g, '|');
    s = replaceAll(s, /@@@eqs@@@/g, '=');
    return s;
  },

  

  
  
  
  // Other functions
  
  deleteGame:function(filename) {
    localStorage.removeItem(TITLE + ": " + filename);
    metamsg("Deleted");
  },

  dirGame:function() {
    let s = "<table class=\"meta\">" + SL_DIR_HEADINGS;
    $.each(localStorage, function(key, value){
      //debugmsg("key=" + key);
      const regex = new RegExp("^" + TITLE + ": ");
      const name = key.replace(regex, "");
      if (regex.test(key)) {
        const dic = saveLoad.getHeader(value);
        s += "<tr><td>" + name + "</td>";
        s += "<td>" + dic.version + "</td>";
        s += "<td>" + dic.timestamp + "</td>";
        s += "<td>" + dic.comment + "</td></tr>";
      }
    });  
    s += "</table>";
    metamsg(s);
    metamsg(SL_DIR_MSG);
  },
  
  

};
