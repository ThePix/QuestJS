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
  //console.log(params)
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
  let flag = obj.isAtLoc(game.player.loc, display.ALL);
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
  const x = params[arr[0]]
  if (x === undefined) {
    //errormsg("In text processor param, could not find a value with the key '" + arr[0] + "'. Check the console (F12) to see what params is. [" + params.tpOriginalString + "]");
    console.log("params:");
    console.log(params);
    return false;
  }
  else if (arr.length === 1) {
    return x;
    
  }
  else {
    const att = (typeof x === "string" ? w[x][arr[1]] : x[arr[1]]);
    if (typeof att !== "function") return att;
    const arr2 = []
    for (let i = 2; i < arr.length; i++) {
      arr2.push(params[arr[i]] ? params[arr[i]] : arr[i])
    }
    return att(...arr2)
  }
};

tp.text_processors.objectsHere = function(arr, params) {
  const listOfOjects = scopeHereListed();
  return listOfOjects.length === 0 ? "" : arr.join(":");
};



// Then {nv:char:try} to get


tp.findSubject = function(arr, params) {
  let subject
  if (params[arr[0]]) {
    subject = params[arr[0]]
    if (typeof subject === "string") subject = w[subject]
    if (subject === undefined) {
      errormsg("In text processor findSubject, could not find a subject with '" + arr[0] + "'. Check the console (F12) to see what params is. [" + params.tpOriginalString + "]");
      console.log("params:");
      console.log(params);
      console.fdjkh.fkgh.fdkyh = 3
      return false;
    }
  }
  else {
    subject = w[arr[0]]
    if (subject === undefined) {
      errormsg("In text processor findSubject, could not find a key called '" + arr[0] + "'. [" + params.tpOriginalString + "]");
      console.log("params:");
      console.log(params);
      console.fdjkh.fkgh.fdkyh = 3
      return false;
    }
  }
  return subject;
}

tp.text_processors.nm = function(arr, params) {
  const subject = tp.findSubject(arr, params);
  if (!subject) return false;
  const opt = {};
  if (arr[1] === 'the') opt.article = DEFINITE;
  if (arr[1] === 'a') opt.article = INDEFINITE;
  return arr[2] === 'true' ? sentenceCase(subject.byname(opt)) : subject.byname(opt);
};

// {name:subject:article:capitalise}

tp.text_processors.nv = function(arr, params) {
  const subject = tp.findSubject(arr, params);
  if (!subject) return false;
  return nounVerb(subject, arr[1], arr[2] === 'true');
};

tp.text_processors.pv = function(arr, params) {
  const subject = tp.findSubject(arr, params);
  if (!subject) return false;
  return pronounVerb(subject, arr[1], arr[2] === 'true');
};

tp.text_processors.cj = function(arr, params) {
  const subject = tp.findSubject(arr, params);
  if (!subject) return false;
  return arr[2] === 'true' ? sentenceCase(conjugate(subject, arr[1])) : conjugate(subject, arr[1]);
};


// {name:subject:article:capitalise}

tp.handlePronouns = function(arr, params, pronoun) {
  const subject = tp.findSubject(arr, params);
  if (!subject) return false;
  return arr[2] === 'true' ? sentenceCase(subject.pronouns[pronoun]) : subject.pronouns[pronoun];
};

tp.text_processors.pa = function(arr, params) {
  return tp.handlePronouns(arr, params, "poss_adj");
};

tp.text_processors.ob = function(arr, params) {
  return tp.handlePronouns(arr, params, "objective");
};

tp.text_processors.sb = function(arr, params) {
  return tp.handlePronouns(arr, params, "subjective");
};
tp.text_processors.ps = function(arr, params) {
  return tp.handlePronouns(arr, params, "possessive");
};
tp.text_processors.rf = function(arr, params) {
  return tp.handlePronouns(arr, params, "reflexive");
};


// {poss:chr1:chr2}
tp.text_processors.pa2 = function(arr, params) {
  const chr1 = tp.findSubject(arr, params);
  if (!chr1) return false;
  arr.shift()
  const chr2 = tp.findSubject(arr, params);
  if (!chr2) return false;
  
  if (chr1.pronouns === chr2.pronouns) {
    const opt = {article:DEFINITE, possessive:true};
    return arr[1] === 'true' ? sentenceCase(chr1.byname(opt)) : chr1.byname(opt);
  }
  
  return arr[1] === 'true' ? sentenceCase(chr1.pronouns.poss_adj) : chr1.pronouns.poss_adj;
};
