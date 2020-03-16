"use strict";


//@DOC
// ## The Text Processor Function
//@UNDOC



//@DOC
// Returns a string in which all the text processor directives have been resolved, using the optionasl parameters.
// More details [here(https://github.com/ThePix/QuestJS/wiki/The-Text-Processor).
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



// Most of the text processors are set up in text.js; these are the language specific ones.
const tp = {
  text_processors:{},
};




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
    let arr = s.split(":");
    let left = arr.shift();
    if (typeof tp.text_processors[left] !== "function") {
      if (left === "player") {
        arr.unshift(game.player.name);
        left = "show";
      }
      else if (w[left]) {
        arr.unshift(left);
        left = "show";
      }
      else if (arr.length === 0) {
        arr = left.split(".");
        left = "show";
      }
      else {
        errormsg("Attempting to use unknown text processor directive '" + left + "' (<i>" + params.tpOriginalString + "</i>)");
        return str;
      }
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
tp.text_processors.sup = function(arr, params) { return "<sup>" + arr.join(":") + "</sup>"; };
tp.text_processors.sub = function(arr, params) { return "<sub>" + arr.join(":") + "</sub>"; };
tp.text_processors.huge = function(arr, params) { return '<span style="font-size:2em">' + arr.join(":") + '</span>'; };
tp.text_processors.big = function(arr, params) { return '<span style="font-size:1.5em">' + arr.join(":") + '</span>'; };
tp.text_processors.small = function(arr, params) { return '<span style="font-size:0.8em">' + arr.join(":") + '</span>'; };
tp.text_processors.tiny = function(arr, params) { return '<span style="font-size:0.6em">' + arr.join(":") + '</span>'; };
tp.text_processors.smallcaps = function(arr, params) { return '<span style="font-variant:small-caps">' + arr.join(":") + '</span>'; };

tp.text_processors.rainbow = function(arr, params) {
  const s = arr.pop()
  const colours = arr.length === 0 ? COLOURS : arr
  let result = ''
  for (let i = 0; i < s.length; i++) {
    result += '<span style="color:' + randomFromArray(colours) + '">' + s.charAt(i) + '</span>'
  }
  return result
};



tp._charSwap = function(c, upper, lower) {
  if (c.match(/[A-Z]/)) return String.fromCharCode(c.charCodeAt(0) - 'A'.charCodeAt(0) + upper)
  if (c.match(/[a-z]/)) return String.fromCharCode(c.charCodeAt(0) - 'a'.charCodeAt(0) + lower)
  return c
}

// Try 391:3AC for Greek, 402:431 for Cyrillic, 904:904 for Devanagari
tp.text_processors.encode = function(arr, params) {
  const upper = parseInt(arr.shift(), 16)
  const lower = parseInt(arr.shift(), 16)
  const s = arr.shift()
  console.log(upper)
  console.log(lower)
  console.log(s)
  let result = ''
  for (let i = 0; i < s.length; i++) {
    result += tp._charSwap(s.charAt(i), upper, lower)
  }
  return result
};

tp.text_processors.rainbow = function(arr, params) {
  const s = arr.pop()
  const colours = arr.length === 0 ? COLOURS : arr
  let result = ''
  for (let i = 0; i < s.length; i++) {
    result += '<span style="color:' + randomFromArray(colours) + '">' + s.charAt(i) + '</span>'
  }
  return result
};



tp.text_processors.font = function(arr, params) {
  const f = arr.shift();
  return '<span style="font-family:' + f + '">' + arr.join(":") + "</span>"; 
};

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

tp._findObject = function(name, params) {
  if (params && params[name]) return typeof params[name] === 'string' ? w[params[name]] : params[name]
  if (name === "player") return game.player
  return w[name]
}
  

tp.text_processors.show = function(arr, params) {
  let name = arr.shift();
  const obj = tp._findObject(name, params)
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
  
tp.text_processors.money = function(arr, params) {
  let name = arr.shift();
  if (!name.match(/^\d+$/)) {
  const obj = tp._findObject(name, params)
    if (!obj) {
      errormsg("Failed to find object '" + name + "' in text processor (<i>" + params.tpOriginalString + "</i>)");
      return false;
    }
    if (obj.loc === game.player.name && obj.getSellingPrice) {
      return displayMoney(obj.getSellingPrice(game.player))
    }
    if (obj.loc === game.player.name && obj.getBuyingPrice) {
      return displayMoney(obj.getBuyingPrice(game.player))
    }
    if (obj.getPrice) {
      return displayMoney(obj.getPrice())
    }
    if (obj.price) {
      return displayMoney(obj.price)
    }
    if (obj.money) {
      return displayMoney(obj.money)
    }
    errormsg("Failed to find a price for object '" + name + "' in text processor (<i>" + params.tpOriginalString + "</i>)");
    return false;
  }
  return displayMoney(parseInt(name))
};
tp.text_processors['$'] = tp.text_processors.money
 
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
  const obj = tp._findObject(name, params)
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
  const obj = tp._findObject(name, params)
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
  const obj = tp._findObject(name, params)
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
    return io.cmdLink(arr[0], arr[0]);
  }
  else {
    return io.cmdLink(arr[0], arr[1]);
  }
};

tp.text_processors.command = function(arr, params) {
  if (arr.length === 1) {
    return io.cmdLink(arr[0], arr[0]);
  }
  else {
    return io.cmdLink(arr[0], arr[1]);
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
    const arr2 = [];
    arr.shift();
    arr.shift();
    for (let el of arr) arr2.push(params[el] ? params[el] : el)
    return att(...arr2)
  }
};


tp.text_processors.terse = function(arr, params) {
  if ((game.verbosity === TERSE && game.room.visited === 0) || game.verbosity === VERBOSE) {
    return sentenceCase(arr.join(":"))
  }
  else {
    return ''
  }
}

tp.text_processors.cap = function(arr, params) {
  return sentenceCase(arr.join(":"))
}

tp.text_processors.hereDesc = function(arr, params) {
  const room = w[game.player.loc];
  if (typeof room.desc === 'function') return room.desc()
  if (typeof room.desc === 'string') return room.desc
  return "This is a room in dire need of a description."
  
};

tp.text_processors.hereName = function(arr, params) {
  const room = w[game.player.loc];
return room.byname({article:DEFINITE})
};

tp.text_processors.objectsHere = function(arr, params) {
  const listOfOjects = scopeHereListed();
  return listOfOjects.length === 0 ? "" : arr.join(":");
};

tp.text_processors.exitsHere = function(arr, params) {
  const list = util.exitList();
  return list.length === 0 ? "" : arr.join(":");
};

tp.text_processors.objects = function(arr, params) {
  const listOfOjects = scopeHereListed();
  return formatList(listOfOjects, {article:INDEFINITE, lastJoiner:lang.list_and, modified:true, nothing:lang.list_nothing, loc:game.player.loc});
}
  
tp.text_processors.exits = function(arr, params) {
  const list = util.exitList();
  return formatList(list, {lastJoiner:lang.list_or, nothing:lang.list_nowhere});
}




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
      console.log(arr[0]);
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

tp.text_processors.nms = function(arr, params) {
  const subject = tp.findSubject(arr, params);
  if (!subject) return false;
  const opt = {possessive:true};
  if (arr[1] === 'the') opt.article = DEFINITE;
  if (arr[1] === 'a') opt.article = INDEFINITE;
  return arr[2] === 'true' ? sentenceCase(subject.byname(opt)) : subject.byname(opt);
};

// {name:subject:verb:capitalise}

tp.text_processors.nv = function(arr, params) {
  const subject = tp.findSubject(arr, params);
  if (!subject) return false;
  return lang.nounVerb(subject, arr[1], arr[2] === 'true');
};

tp.text_processors.pv = function(arr, params) {
  const subject = tp.findSubject(arr, params);
  if (!subject) return false;
  return lang.pronounVerb(subject, arr[1], arr[2] === 'true');
};

tp.text_processors.vn = function(arr, params) {
  const subject = tp.findSubject(arr, params);
  if (!subject) return false;
  return lang.verbNoun(subject, arr[1], arr[2] === 'true');
};

tp.text_processors.vp = function(arr, params) {
  const subject = tp.findSubject(arr, params);
  if (!subject) return false;
  return lang.verbPronoun(subject, arr[1], arr[2] === 'true');
};

tp.text_processors.cj = function(arr, params) {
  const subject = tp.findSubject(arr, params);
  if (!subject) return false;
  return arr[2] === 'true' ? sentenceCase(lang.conjugate (subject, arr[1])) : lang.conjugate (subject, arr[1]);
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


// {pa2:chr1:chr2}
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

// {pa3:chr1:chr2}
tp.text_processors.pa3 = function(arr, params) {
  const chr1 = tp.findSubject(arr, params);
  if (!chr1) return false;
  arr.shift()
  const chr2 = tp.findSubject(arr, params);
  if (!chr2) return false;
  
  if (chr1 !== chr2) {
    const opt = {article:DEFINITE, possessive:true};
    return arr[1] === 'true' ? sentenceCase(chr1.byname(opt)) : chr1.byname(opt);
  }
  
  return arr[1] === 'true' ? sentenceCase(chr1.pronouns.poss_adj) : chr1.pronouns.poss_adj;
};
