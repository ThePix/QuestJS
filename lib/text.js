"use strict";

function processtext(str, params) {
  if (params === undefined) {
    params = {};
  }
  if (typeof str !== "string") {
    str = "" + str;
  }
  params.tpOriginalString = str;
  if (tp.usedStrings.includes(str)) {
    params.tpFirstTime = false;
  }
  else {
    tp.usedStrings.push(str);
    params.tpFirstTime = true;
  }
  //try {
    return tp.processtext(str, params);
  //} catch (err) {
  //  errormsg("Text processor string caused an error, returning unmodified (reported error: " + err + ")");
  //  return str;
  //}
}





const tp = {};

tp.usedStrings = [];


// Use this to add you custom text processor
// Should take a string array as a parameter (the input text,
// excluding the curly braces, name and colon),
// and return a string.
tp.addDirective = function(name, fn) {
  tp.text_processors[name] = fn;
};



tp.processtext = function(str, params) {
  const s = tp.findFirstToken(str);
  if (s) {
    const arr = s.split(":");
    const left = arr.shift();
    if (typeof tp.text_processors[left] !== "function") {
      errormsg("Attempting to use unknown text processor directive '" + name + "' (<i>" + params.tpOriginalString + "</i>)");
      return str;
    }
    str = str.replace("{" + s + "}", tp.text_processors[left](arr, params));
    str = tp.processtext(str, params);
  }
  return str;
};

// Find the first token. This is the first to end, so
// we get nested.
tp.findFirstToken = function (s) {
  const end = s.indexOf("}");
  if (end === -1) { return false; }
  const start = s.lastIndexOf("{", end);
  if (start === -1) {
    errormsg("Failed to find starting curly brace in text processor (<i>" + params.tpOriginalString + "</i>)");
    return false;
  }
  return s.substring(start + 1, end);
};



tp.text_processors = {
  i:function(arr, params) { return "<i>" + arr.join(":") + "</i>"; },
  b:function(arr, params) { return "<b>" + arr.join(":") + "</b>"; },
  u:function(arr, params) { return "<u>" + arr.join(":") + "</u>"; },
  s:function(arr, params) { return "<strike>" + arr.join(":") + "</strike>"; },

  colour:function(arr, params) {
    const c = arr.shift();
    return '<span style="color:' + c + '">' + arr.join(":") + "</span>"; 
  },

  color:function(arr, params) {
    const c = arr.shift();
    return '<span style="color:' + c + '">' + arr.join(":") + "</span>"; 
  },

  back:function(arr, params) {
    const c = arr.shift();
    return '<span style="background-color:' + c + '">' + arr.join(":") + "</span>"; 
  },

  random:function(arr, params) {
    return arr[Math.floor(Math.random()*arr.length)];
  },

  show:function(arr, params) {
    let name = arr.shift();
    const obj = name === "player" ? player : w[name];
    if (!obj) {
      errormsg("Failed to find object '" + name + "' in text processor (<i>" + params.tpOriginalString + "</i>)");
      return false;
    }
    name = arr.shift();
    const val = obj[name];
    if (typeof val === "function") {
      return val();
    } else {      
      return val;
    }
  },
  
  if:function(arr, params) {
    let name = arr.shift();
    const obj = name === "player" ? game.player : w[name];
    if (!obj) {
      errormsg("Failed to find object '" + name + "' in text processor (<i>" + params.tpOriginalString + "</i>)");
      return false;
    }
    name = arr.shift();
    return (obj[name] ? arr[0] : (arr[1] ? arr[1] : ""));
  },
  
  else:function(arr, params) {
    let name = arr.shift();
    const obj = name === "player" ? game.player : w[name];
    if (!obj) {
      errormsg("Failed to find object '" + name + "' in text processor (<i>" + params.tpOriginalString + "</i>)");
      return false;
    }
    name = arr.shift();
    return (obj[name] ? (arr[1] ? arr[1] : "") : arr[0]);
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
  
  param:function(arr, params) {
    if (arr.length === 2) {
      return w[params[arr[0]]][arr[1]];
    }
    else {
      return params[arr[0]];
    }
  },
  
  objectshere:function(arr, params) {
    const listOfOjects = scope(isHereListed);
    return listOfOjects.length === 0 ? "" : arr.join(":");
  },
  
  
};