"use strict";

function processtext(str, params) {
  if (params === undefined) {
    params = {};
  }
  params.tpOriginalString = str;
  if (tp.usedStrings.includes(str)) {
    params.tpFirstTime = false;
  }
  else {
    tp.usedStrings.push(str);
    params.tpFirstTime = true;
  }
  return tp.processtext(str, params);
}





var tp = {};

tp.usedStrings = [];


// Use this to add you custom text processor
// Should take a string array as a parameter (the input text,
// excluding the curly braces, name and colon),
// and return a string.
tp.addDirective = function(name, fn) {
  tp.text_processors[name] = fn;
}



tp.processtext = function(str, params) {
  var s = tp.findFirstToken(str);
  if (s) {
    var arr = s.split(":");
    var left = arr.shift();
    if (typeof tp.text_processors[left] !== "function") {
      errormsg(ERR_TP, "Attempting to use unknown text processor directive '" + left + "' (<i>" + params.tpOriginalString + "</i>)");
      return false;
    }
    str = str.replace("{" + s + "}", tp.text_processors[left](arr, params));
    str = tp.processtext(str, params);
  }
  return str;
}

// Find the first token. This is the first to end, so
// we get nested.
tp.findFirstToken = function (s) {
  var end = s.indexOf("}");
  if (end === -1) { return false; }
  var start = s.lastIndexOf("{", end);
  if (start === -1) {
    errormsg(ERR_TP, "Failed to find starting curly brace in text processor (<i>" + params.tpOriginalString + "</i>)");
    return false;
  }
  return s.substring(start + 1, end);
}



tp.text_processors = {
  i:function(arr, params) { return "<i>" + arr.join(":") + "</i>"; },
  b:function(arr, params) { return "<b>" + arr.join(":") + "</b>"; },
  u:function(arr, params) { return "<u>" + arr.join(":") + "</u>"; },
  s:function(arr, params) { return "<strike>" + arr.join(":") + "</strike>"; },

  colour:function(arr, params) {
    var c = arr.shift();
    return '<span style="color:' + c + '">' + arr.join(":") + "</span>"; 
  },

  color:function(arr, params) {
    var c = arr.shift();
    return '<span style="color:' + c + '">' + arr.join(":") + "</span>"; 
  },

  back:function(arr, params) {
    var c = arr.shift();
    return '<span style="background-color:' + c + '">' + arr.join(":") + "</span>"; 
  },

  random:function(arr, params) {
    return arr[Math.floor(Math.random()*arr.length)];
  },

  show:function(arr, params) {
    var name = arr.shift();
    var obj = name === "player" ? player : w[name];
    if (!obj) {
      errormsg(ERR_TP, "Failed to find object '" + name + "' in text processor (<i>" + params.tpOriginalString + "</i>)");
      return false;
    }
    name = arr.shift();
    var val = obj[name];
    if (typeof val === "function") {
      return val();
    } else {      
      return val;
    }
  },
  
  if:function(arr, params) {
    var name = arr.shift();
    var obj = name === "player" ? game.player : w[name];
    if (!obj) {
      errormsg(ERR_TP, "Failed to find object '" + name + "' in text processor (<i>" + params.tpOriginalString + "</i>)");
      return false;
    }
    name = arr.shift();
    return obj[name] ? arr[0] : arr[1];
  },
  
  else:function(arr, params) {
    var name = arr.shift();
    var obj = name === "player" ? game.player : w[name];
    if (!obj) {
      errormsg(ERR_TP, "Failed to find object '" + name + "' in text processor (<i>" + params.tpOriginalString + "</i>)");
      return false;
    }
    name = arr.shift();
    return obj[name] ? arr[1] : arr[0];
  },
  
  img:function(arr, params) {
    return '<img src="images/' + arr[0] + '" title="' + arr[1] + '" alt="' + arr[2] + '"/>'; 
  },
  
  once:function(arr, params) {
    return params.tpFirstTime ? arr.join(":") : "";
  },
  
  notonce:function(arr, params) {
    return params.tpFirstTime ? "" : arr.join(":");
  },
  
  cmd:function(arr, params) {
    if (arr.length === 1) {
      return cmdLink(arr[0], arr[0]);
    }
    else {
      return cmdLink(arr[0], arr[1]);
    }
  },
  command:function(arr, params) {
    if (arr.length === 1) {
      return cmdLink(arr[0], arr[0]);
    }
    else {
      return cmdLink(arr[0], arr[1]);
    }
  },
  
  objects:function(arr, params) {
    var listOfOjects = scope(isHereListed);
    return formatList(listOfOjects, {def:"a", lastJoiner:" and", modified:true, nothing:"nothing"});
  },
  
  exits:function(arr, params) {
    var list = [];
    for (var i = 0; i < EXITS.length; i++) {
      if (hasExit(game.room, EXITS[i].name)) {
        list.push(EXITS[i].name);
      }
    }
    return formatList(list, {lastJoiner:" or", nothing:"nowhere"});
  },
  
  
  
}