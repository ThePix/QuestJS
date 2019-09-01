"use strict";

function processText(str, params) {
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
    return tp.processText(str, params);
  //} catch (err) {
  //  errormsg("Text processor string caused an error, returning unmodified (reported error: " + err + ")");
  //  return str;
  //}
}





tp.usedStrings = [];


// Use this to add you custom text processor
// Should take a string array as a parameter (the input text,
// excluding the curly braces, name and colon),
// and return a string.
tp.addDirective = function(name, fn) {
  tp.text_processors[name] = fn;
};



tp.processText = function(str, params) {
  const s = tp.findFirstToken(str);
  if (s) {
    const arr = s.split(":");
    const left = arr.shift();
    if (typeof tp.text_processors[left] !== "function") {
      errormsg("Attempting to use unknown text processor directive '" + left + "' (<i>" + params.tpOriginalString + "</i>)");
      return str;
    }
    str = str.replace("{" + s + "}", tp.text_processors[left](arr, params));
    str = tp.processText(str, params);
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
    errormsg("Failed to find starting curly brace in text processor (<i>" + s + "</i>)");
    return false;
  }
  return s.substring(start + 1, end);
};



tp.text_processors.i = function(arr, params) { return "<i>" + arr.join(":") + "</i>"; };
tp.text_processors.b = function(arr, params) { return "<b>" + arr.join(":") + "</b>"; };
tp.text_processors.u = function(arr, params) { return "<u>" + arr.join(":") + "</u>"; };
tp.text_processors.s = function(arr, params) { return "<strike>" + arr.join(":") + "</strike>"; };

tp.text_processors.colour = function(arr, params) {
    const c = arr.shift();
    return '<span style="color:' + c + '">' + arr.join(":") + "</span>"; 
  };

tp.text_processors.color = tp.text_processors.colour;

tp.text_processors.back = function(arr, params) {
    const c = arr.shift();
    return '<span style="background-color:' + c + '">' + arr.join(":") + "</span>"; 
  };

tp.text_processors.random = function(arr, params) {
    return arr[Math.floor(Math.random()*arr.length)];
  };

tp.text_processors.show=function(arr, params) {
    let name = arr.shift();
    const obj = name === "player" ? game.player : w[name];
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
  };
  
tp.text_processors.if = function(arr, params) {
    return this.handleIf(arr, params, false);
  };
  
tp.text_processors.ifNot = function(arr, params) {
    return this.handleIf(arr, params, true);
  };
  
tp.text_processors.ifHere = function(arr, params) {
    return this.handleIfHere(arr, params, false);
  };
  
tp.text_processors.ifNotHere = function(arr, params) {
    return this.handleIfHere(arr, params, true);
  };
  
tp.text_processors.ifLessThan = function(arr, params) {
    return this.handleIf(arr, params, false);
  };
  
tp.text_processors.ifMoreThan = function(arr, params) {
    return this.handleIf(arr, params, true);
  };
  
tp.text_processors.handleIf = function(arr, params, reverse) {
    let name = arr.shift(), flag;
    const obj = name === "player" ? game.player : w[name];
    if (!obj) {
      errormsg("Failed to find object '" + name + "' in text processor (<i>" + params.tpOriginalString + "</i>)");
      return false;
    }
    name = arr.shift();
    if (obj[name] === undefined || typeof obj[name] === "boolean") {
      flag = obj[name];
      if (flag === undefined) flag = false;
    }
    else {
      let value = arr.shift();
      if (typeof obj[name] === "number") {
        if (isNaN(value)) {
          errormsg("Trying to compare a numeric attribute, '" + name + "' with a string.");
          return false;
        }
        value = parseInt(value);
      }
      flag = (obj[name] === value);
    }
    if (reverse) flag = !flag;
    return (flag ? arr[0] : (arr[1] ? arr[1] : ""));
  };
  
tp.text_processors.handleIfHere = function(arr, params, reverse) {
    const name = arr.shift();
    const obj = w[name];
    if (!obj) {
      errormsg("Failed to find object '" + name + "' in text processor (<i>" + params.tpOriginalString + "</i>)");
      return false;
    }
    let flag = obj.isAtLoc(game.player.loc) && object.getDisplay() >= DSPY_SCENERY;
    if (reverse) flag = !flag;
    return (flag ? arr[0] : (arr[1] ? arr[1] : ""));
  };
  
tp.text_processors.handleIfLessMoreThan = function(arr, params, moreThan) {
    let name = arr.shift(), flag;
    const obj = name === "player" ? game.player : w[name];
    if (!obj) {
      errormsg("Failed to find object '" + name + "' in text processor (<i>" + params.tpOriginalString + "</i>)");
      return false;
    }
    name = arr.shift();
    if (typeof obj[name] !== "number") {
      errormsg("Trying to use ifLessThan with a non-numeric (or nonexistent) attribute, '" + name + "'.");
      return false;
    }
    let value = arr.shift();
    if (isNaN(value)) {
      errormsg("Trying to compare a numeric attribute, '" + name + "' with a string.");
      return false;
    }
    value = parseInt(value);
    flag = moreThan ? (obj[name] > value) : (obj[name] < value);
    return (flag ? arr[0] : (arr[1] ? arr[1] : ""));
  };
  
tp.text_processors.img = function(arr, params) {
    return '<img src="images/' + arr[0] + '" title="' + arr[1] + '" alt="' + arr[2] + '"/>'; 
  };
  
tp.text_processors.once = function(arr, params) {
    return params.tpFirstTime ? arr.join(":") : "";
  };
  
tp.text_processors.notOnce = function(arr, params) {
    return params.tpFirstTime ? "" : arr.join(":");
  };
  
tp.text_processors.cmd = function(arr, params) {
    if (arr.length === 1) {
      return cmdLink(arr[0], arr[0]);
    }
    else {
      return cmdLink(arr[0], arr[1]);
    }
  };
  
tp.text_processors.command = function(arr, params) {
    if (arr.length === 1) {
      return cmdLink(arr[0], arr[0]);
    }
    else {
      return cmdLink(arr[0], arr[1]);
    }
  };
  
tp.text_processors.param = function(arr, params) {
    if (arr.length === 2) {
      return w[params[arr[0]]][arr[1]];
    }
    else {
      return params[arr[0]];
    }
  };
  
tp.text_processors.objectsHere = function(arr, params) {
    const listOfOjects = scope(isHereListed);
    return listOfOjects.length === 0 ? "" : arr.join(":");
  };
  