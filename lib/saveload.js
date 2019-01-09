"use strict";

// Should all be language neutral


var saveLoad = {

  saveGame:function(filename, comment) {
    if (filename === undefined) {
      errormsg(ERR_GAME_BUG, SL_NO_FILENAME);
      return false;
    }
    if (comment === undefined) { comment = "-"; }
    var s = saveLoad.saveTheWorld(comment);
    localStorage.setItem(TITLE + ": " + filename, s);
    metamsg("Saved");
    return true;
  },

  loadGame:function(filename) {
    var s = localStorage.getItem(TITLE + ": " + filename);
    saveLoad.loadTheWorld(s);
    metamsg("Loaded");
  },

  deleteGame:function(filename) {
    localStorage.removeItem(TITLE + ": " + filename);
    metamsg("Deleted");
  },

  dirGame:function() {
    var s = "<table class=\"meta\">" + SL_DIR_HEADINGS;
    $.each(localStorage, function(key, value){
      //debugmsg(0, "key=" + key);
      var regex = new RegExp("^" + TITLE + ": ");
      var name = key.replace(regex, "");
      if (regex.test(key)) {
        var dic = saveLoad.getHeader(value);
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

  saveTheWorld:function(comment) {
    return saveLoad.getSaveHeader(comment) + saveLoad.getSaveBody();
  },

  loadTheWorld:function(s) {
    var arr = s.split("|");
    arr.splice(0, 4);
    
    for (var i = 0; i < arr.length; i++) {
      var parts = arr[i].split("=");
      var obj = w[parts[0]];
      if (obj === undefined) {
        errormsg(ERR_SAVE_LOAD, SL_CANNOT_FIND_OBJ(parts[0]));
      }
      else {
        this.setLoadString(obj, parts[1]);
      }
    }
    game.update();
  },

  getHeader:function(s) {
    var arr = s.split("|");
    return { title:arr[0], version:arr[1], comment:arr[2], timestamp:arr[3] };
  },

  getSaveHeader:function(comment) {
    var currentdate = new Date();
    var s = replaceAll(TITLE, "|", "") + "|";
    s += replaceAll(VERSION, "|", "") + "|";
    s += (comment ? replaceAll(comment, "|", "") : "-") + "|";
    s += currentdate.toLocaleString() + "|";
    return s;
  },

  getSaveBody:function() {
    var s = "";
    for (var key in w) {
      s += key + "=" + this.getSaveString(w[key]) + "|";
    }
    return s;
  },
  
  decode:function(s) {
    if (s === "true") return true;
    if (s === "false") return false;
    if (!/^\"/.test(s)) return parseInt(s);
    return unescape(s);
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
    return '"' + s + '"';
  },

  
  getSaveString:function(item) {
    if (item.customSave) {
      item.customSave();
    }
    var s = "";
    for (var key in item) {
      if (typeof item[key] !== "function" && typeof item[key] !== "object") {
        if (key !== "desc" && key !== "examine" && key !== "name") {
          s += saveLoad.encode(key, item[key]);
        }
        if (key === "desc" && item.mutableDesc) {
          s += saveLoad.encode(key, item[key]);
        }
        if (key === "examine" && item.mutableExamine) {
          s += saveLoad.encode(key, item[key]);
        }
      }
    }
    return s;
  },

  setLoadString:function(item, s) {
    var arr = s.split(";");
    for (var i = 0; i < arr.length; i++) {
      var parts = arr[i].split(":");
      item[parts[0]] = saveLoad.decode(parts[1]);
    }
    if (item.customLoad) {
      item.customLoad();
    }
  },
  
};
