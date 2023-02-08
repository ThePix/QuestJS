"use strict";


//@DOC
// ## The Text Processor Function
//@UNDOC



//@DOC
// Returns a string in which all the text processor directives have been resolved, using the optionasl parameters.
// More details [here(https://github.com/ThePix/QuestJS/wiki/The-Text-Processor).
function processText(str, params) {
  if (params === undefined) {
    params = {tpNoParamsPassed:true};
  }
  if (typeof str !== "string") {
    str = "" + str;
  }
  params.tpOriginalString = str;
  if (params.count) params.item_count = params.count
  //log(params)
  if (tp.usedStrings.includes(str)) {
    params.tpFirstTime = false;
  }
  else {
    tp.usedStrings.push(str);
    params.tpFirstTime = true;
  }
    return tp.processText(str, params);
}



// Most of the text processors are set up in text.js; these are the language specific ones.
const tp = {
  text_processors:{},
  setLoadString:function(s) {
    const parts = s.split("=");
    if (parts.length !== 2) return errormsg("Bad format in saved data (" + s + ")")
    if (parts[0] !== "TPUsedStrings") return errormsg("Expected TP to be first")
    tp.usedStrings = saveLoad.decodeArray(parts[1])
  },
  getSaveString:function() {
    let s = "TPUsedStrings=" + saveLoad.encodeArray(tp.usedStrings);
    return s;
  },
}




tp.usedStrings = [];

tp.colours = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']



// Use this to add you custom text processor
// Should take a string array as a parameter (the input text,
// excluding the curly braces, name and colon),
// and return a string.
tp.addDirective = function(name, fn) {
  tp.text_processors[name] = fn;
};



tp.comparisons = {
  '=':'if',
  '==':'if',
  '!=':'ifNot',
  '!==':'ifNot',
  '<>':'ifNot',
  '<':'ifLessThan',
  '>':'ifMoreThan',
  '<=':'ifLessThanOrEqual',
  '>=':'ifMoreThanOrEqual',
}

tp.processText = function(str, params) {
  const s = tp.findFirstToken(str);
  if (s) {
    let arr = s.split(":");
    let left = arr.shift();
    if (typeof tp.text_processors[left] !== "function") {
      if (left.startsWith('if ')) {
        const data = /if (not |)(\w+)\.(\w+) *([<>=!]{0,3}) *(.*)/.exec(left)
        if (data[4] === '') {
          arr.unshift(data[3])
          arr.unshift(data[2])
          left = data[1] === 'not ' ? 'ifNot' : 'if'
        }
        else {
          arr.unshift(data[5])
          arr.unshift(data[3])
          arr.unshift(data[2])
          left = tp.comparisons[data[4]]
        }
      }
      else if (left.match(/^(not)?here /)) {
        const ary = left.split(' ')
        ary.shift()
        left = left.startsWith('here') ? 'ifHere' : 'ifNotHere'
        for (const el of ary.reverse()) arr.unshift(el)
      }
      else if (left === "player") {
        arr.unshift(player.name);
        left = "show";
      }
      else if (left === "currentLocation") {
        arr.unshift(currentLocation.name);
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
        errormsg("Attempting to use unknown text processor directive '" + left + "' (" + params.tpOriginalString + ")");
        return str;
      }
    }
    str = str.replace("{" + s + "}", tp.text_processors[left](arr, params));
    str = tp.processText(str, params);
  }
  return str
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
tp.text_processors.code = function(arr, params) { return "<code>" + arr.join(":") + "</code>"; };
tp.text_processors.sup = function(arr, params) { return "<sup>" + arr.join(":") + "</sup>"; };
tp.text_processors.sub = function(arr, params) { return "<sub>" + arr.join(":") + "</sub>"; };
tp.text_processors.huge = function(arr, params) { return '<span style="font-size:2em">' + arr.join(":") + '</span>'; };
tp.text_processors.big = function(arr, params) { return '<span style="font-size:1.5em">' + arr.join(":") + '</span>'; };
tp.text_processors.small = function(arr, params) { return '<span style="font-size:0.8em">' + arr.join(":") + '</span>'; };
tp.text_processors.tiny = function(arr, params) { return '<span style="font-size:0.6em">' + arr.join(":") + '</span>'; };
tp.text_processors.smallcaps = function(arr, params) { return '<span style="font-variant:small-caps">' + arr.join(":") + '</span>'; };
tp.text_processors.cap = function(arr, params) {
  return sentenceCaseForHTML(arr.join(":"))
}
tp.text_processors.title = function(arr, params) {
  return titleCaseForHTML(arr.join(":"))
}
tp.text_processors.upper = function(arr, params) {
  return arr.join(":").toUpperCase()
}
tp.text_processors.lower = function(arr, params) {
  return arr.join(":").toLowerCase()
}

tp.text_processors.rainbow = function(arr, params) {
  const s = arr.pop()
  const colours = arr.length === 0 ? tp.colours : arr
  let result = ''
  for (let i = 0; i < s.length; i++) {
    result += '<span style="color:' + random.fromArray(colours) + '">' + s.charAt(i) + '</span>'
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
  let result = ''
  for (let i = 0; i < s.length; i++) {
    result += tp._charSwap(s.charAt(i), upper, lower)
  }
  return result
};

tp.text_processors.rainbow = function(arr, params) {
  const s = arr.pop()
  const colours = arr.length === 0 ? tp.colours : arr
  let result = ''
  for (let i = 0; i < s.length; i++) {
    result += '<span style="color:' + random.fromArray(colours) + '">' + s.charAt(i) + '</span>'
  }
  return result
};



tp.text_processors.blur = function(arr, params) {
  const n = arr.shift();
  return '<span style="color:transparent;text-shadow: 0 0 ' + n + 'px rgba(0,0,0,1);">' + arr.join(":") + "</span>"; 
};

tp.text_processors.font = function(arr, params) {
  const f = arr.shift();
  return '<span style="font-family:' + f + '">' + arr.join(":") + "</span>"; 
};

tp.text_processors.class = function(arr, params) { 
  const c = arr.shift()
  return '<span class="' + c + '">' + arr.join(":") + '</span>'
} 


tp.text_processors.colour = function(arr, params) {
  const c = arr.shift();
  return '<span style="color:' + c + '">' + arr.join(":") + "</span>"; 
};

tp.text_processors.color = tp.text_processors.colour;

tp.text_processors.back = function(arr, params) {
  const c = arr.shift();
  return '<span style="background-color:' + c + '">' + arr.join(":") + "</span>"; 
};

tp.text_processors.dialogue = function(arr, params) {
  let prefix = "<span";
  const style = arr.shift()
  if (arr.length < 1) errormsg("Failed to find enough parts in text processor 'dialog' (" + params.tpOriginalString + ")")

  if (style.startsWith('.')) {
    prefix += ' class="' + style.replace('.', '') + '"'
  }
  else if (params[style]) {
    prefix += ' style="' + params[style].dialogueStyle + '"'
  }
  else {
    if (arr.length < 2) errormsg("Failed to find enough parts in text processor 'dialog' without a class (" + params.tpOriginalString + ")")
    const colour = arr.shift()
    prefix += ' style="'
    if (style.includes('i')) prefix += "font-style:italic;"
    if (style.includes('b')) prefix += "font-weight:bold;"
    if (style.includes('u')) prefix += "text-decoration:underline;"
    if (colour != "") {
      prefix += "color:" + colour
    }
    prefix += '"'
  }
  prefix += '>'
  return prefix + settings.openQuotation + arr.join() + settings.closeQuotation + "</span>"
}

tp.text_processors.random = function(arr, params) {
  return arr[random.int(0, arr.length - 1)];
};

tp.text_processors.select = function(arr, params) { return tp.select(arr, params, 'none') }
tp.text_processors.selectNone = function(arr, params) { return tp.select(arr, params, 'none') }
tp.text_processors.selectWrap = function(arr, params) { return tp.select(arr, params, 'wrap') }
tp.text_processors.selectStart = function(arr, params) { return tp.select(arr, params, 'start') }
tp.text_processors.selectEnd = function(arr, params) { return tp.select(arr, params, 'end') }
  
tp.text_processors.cycle = function(arr, params) { return tp.select(arr, params, 'none', true) }
tp.text_processors.cycleNone = function(arr, params) { return tp.select(arr, params, 'none', true) }
tp.text_processors.cycleWrap = function(arr, params) { return tp.select(arr, params, 'wrap', true) }
tp.text_processors.cycleStart = function(arr, params) { return tp.select(arr, params, 'start', true) }
tp.text_processors.cycleEnd = function(arr, params) { return tp.select(arr, params, 'end', true) }

tp.select = function(arr, params, opt, cycling) {
  let name = arr.shift()
  if (name.match(/\./)) {
    const ary = name.split('.')
    name = ary[0]
    arr.unshift(ary[1])
  }
  const o = tp._findObject(name, params, arr)
  if (!o) errormsg('Failed to find an object called "' + name + '" in text processor select.')
  const l = o[arr[0]]
  if (l === undefined && !cycling) errormsg('Failed to find an attribute called "' + arr[0] + '" for "' + name + '" in text processor "select" directive.')
  if (Array.isArray(l)) {
    let n = o[arr[1]]
    if (cycling) {
      if (typeof n !== 'number') {
        n = 0
        o[arr[1]] = 0
      }
      o[arr[1]]++
    }
    if (!l) errormsg('Failed to find a secondary attribute called "' + arr[1] + '" for "' + name + '" in text processor "select" directive.')
    return array.value(l, Math.round(n), opt)
  }
  if (typeof l === 'number') {
    if (cycling) o[arr[0]]++
    arr.shift()
    return array.value(arr, Math.round(l), opt)
  }
  if (l === undefined && cycling) {
    o[arr[0]] = 1
    arr.shift()
    return array.value(arr, 0, opt)
  }
  errormsg('Failed to do anything with the attribute called "' + arr[1] + '" for "' + name + '" in text processor select - neither an array or an integer.')
};



tp._findObject = function(name, params, arr) {
  if (params && params[name]) return typeof params[name] === 'string' ? w[params[name]] : params[name]
  if (name === "player") return player
  if (name === "currentLocation") return currentLocation
  if (name === "settings") return settings
  if (name === "params") return params
  if (w[name]) return w[name]
  const ary = name.split('.')
  if (ary.length === 1) return undefined
  if (ary.length > 2) {
    console.log("The text process cannot handle attributes of attributes, so failed to deal with: " + name)
    console.log(ary)
    return undefined
  }
  arr.unshift(ary[1])
  return w[ary[0]]
}


tp.text_processors.multi = function(arr, params) {
  if (!params.multiple) return ''
  return sentenceCase(params.item.alias) + ": "
}



tp.text_processors.show = function(arr, params) {
  let name = arr.shift()
  return tp.handleShow(arr, name, null, params)
}

tp.text_processors.showOrNot = function(arr, params) {
  let name = arr.shift()
  let def = arr.shift()
  return tp.handleShow(arr, name, def, params)
}

tp.handleShow = function(arr, name, def, params) {
  if (params[name] !== undefined) {
    if (typeof params[name] === 'object') return tp.getWhatever(params[name][arr[0]], params, params[name], def, arr)
    return tp.getWhatever(params[name], params, undefined, def, arr)
  }
  const obj = tp._findObject(name, params, arr)
  if (!obj) return errormsg("Failed to find object '" + name + "' in text processor 'show' (" + params.tpOriginalString + ")")
  return tp.getWhatever(obj[arr[0]], params, obj, def, arr)
}
tp.text_processors.object = tp.text_processors.show

tp.getWhatever = function(val, params, obj, def, arr) {
  if (val === undefined || val === null) return def ? def : ''
  if (val === false) return lang.tp_false
  if (val === true) return lang.tp_true
  if (val === undefined) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number') return val.toString()
  if (val && typeof val === 'object') {  // because null is an object!
    if (!arr[0]) return errormsg("Got an object, but no attribute in show for: " + val.name)
    if (!val[arr[0]]) return errormsg("Got an object, but no attribute valled " + arr[0] + " in show for: " + val.name)
    return val[arr[0]].toString()
  }
  if (typeof val !== 'function') return errormsg("Got a value of a type I was not expecting in show: " + (typeof val))
  const func = val.bind(obj)
  arr.shift()  // consume the function name
  return tp.getWhatever(func(params), params, obj, def, arr)
}
  



tp.text_processors.contents = function(arr, params) {
  let name = arr.shift()
  const obj = typeof params[name] === 'object' ? params[name] : tp._findObject(name, params, arr)
  if (!obj) return errormsg("Failed to find object '" + name + "' in text processor 'contents' (" + params.tpOriginalString + ")")
  return formatList(obj.getContents(world.LOOK), {article:INDEFINITE, sep:arr[0], lastSep:arr[1], nothing:arr[2]})
}



tp.text_processors.rndalt = function(arr, params) {
  let name = arr.shift()
  if (params[name]) {
    if (typeof params[name] === 'string') return params[name]
    if (typeof params[name] === 'number') return params[name].toString()
    if (arr.length > 0) return params[name][arr[0]]
  }
  const obj = tp._findObject(name, params, arr)
  if (!obj) return errormsg("Failed to find object '" + name + "' in text processor 'show' (" + params.tpOriginalString + ")")
  if (obj.alt) return random.fromArray(obj.alt)
  return obj.alias
}



tp.text_processors.number = function(arr, params) {
  let name = arr.shift()
  if (name.match(/^\d+$/)) return lang.toWords(parseInt(name))
  if (typeof params[name] === 'number') return lang.toWords(params[name], arr[0])
  const obj = tp._findObject(name, params, arr)
  if (!obj) return errormsg("Failed to find object '" + name + "' in text processor 'number' (" + params.tpOriginalString + ")")
  const att = arr.shift()
  if (typeof obj[att] === 'number') return lang.toWords(obj[att], arr[0])
  return errormsg("Failed to find a number for object '" + name + "' in text processor (" + params.tpOriginalString + ")")
}

tp.text_processors.ordinal = function(arr, params) {
  let name = arr.shift()
  if (name.match(/^\d+$/)) return lang.toOrdinal(parseInt(name))
  if (typeof params[name] === 'number') return lang.toOrdinal(params[name])
  const obj = tp._findObject(name, params, arr)
  if (!obj) return errormsg("Failed to find object '" + name + "' in text processor 'number' (" + params.tpOriginalString + ")")
  if (typeof obj[arr[0]] === 'number') return lang.toOrdinal(obj[arr[0]])
  return errormsg("Failed to find a number for object '" + name + "' in text processor (" + params.tpOriginalString + ")")
};

tp.text_processors.money = function(arr, params) {
  let name = arr.shift()
  if (name.match(/^\d+$/)) return displayMoney(parseInt(name))
  if (typeof params[name] === 'number') return displayMoney(params[name])
  const obj = tp._findObject(name, params, arr)
  if (!obj) return errormsg("Failed to find object '" + name + "' in text processor 'money' (" + params.tpOriginalString + ")")
  if (obj.loc === player.name && obj.getSellingPrice) {
    return displayMoney(obj.getSellingPrice(player))
  }
  if (obj.loc === player.name && obj.getBuyingPrice) {
    return displayMoney(obj.getBuyingPrice(player))
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
  return errormsg("Failed to find a price for object '" + name + "' in text processor (" + params.tpOriginalString + ")")
};
tp.text_processors['$'] = tp.text_processors.money
 

tp.text_processors.dateTime = function(arr, params) {
  const options = {format:arr[0]}
  if (!isNaN(arr[1])) options.is = parseInt(arr[1])
  if (!isNaN(arr[2])) options.add = parseInt(arr[2])
  return util.getDateTime(options)
};

// Specifically for use with achievements
tp.text_processors.date = function(arr, params) {
  return new Date(params[arr[0]]).toLocaleString()
}

tp.text_processors.transitDest = function(arr, params) {
  const transit = arr[0] ? w[arr[0]] : w[player.loc]
  if (!transit.transitDoorDir) return errormsg("Trying to use the 'transitDest' text process directive when the player is not in a transit location (" + params.tpOriginalString + ").")
  if (transit.currentButtonName) { 
    const button = w[transit.currentButtonName]
    if (button.title) return button.title
  }
  const destName = transit[transit.transitDoorDir].name
  return lang.getName(w[destName], {capital:true})
};

tp.text_processors.img = function(arr, params) {
  const src = arr[0].includes('/') ? arr[0] : settings.imagesFolder + arr[0]
  return '<img src="' + src + '" title="' + arr[1] + '" alt="' + arr[2] + '"/>'; 
}


tp.once = function(params, s1, s2) {
  if (params.tpFirstTime && s1) return s1
  if (!params.tpFirstTime && s2) return s2
  return ''
}
tp.text_processors.once = function(arr, params) { return tp.once(params, arr[0], arr[1]) }
tp.text_processors.first = tp.text_processors.once
tp.text_processors.notOnce = function(arr, params) { return tp.once(params, arr[1], arr[0]) }
tp.text_processors.notfirst = tp.text_processors.notOnce


tp.text_processors.cmd = function(arr, params) {
  if (arr.length === 1) {
    return io.cmdlink(arr[0], arr[0])
  }
  else {
    return io.cmdlink(arr[0], arr[1])
  }
}

tp.text_processors.command = function(arr, params) {
  if (arr.length === 1) {
    return io.cmdlink(arr[0], arr[0]);
  }
  else {
    return io.cmdlink(arr[0], arr[1]);
  }
}

tp.text_processors.exit = tp.text_processors.command
tp.text_processors.page = tp.text_processors.command


tp.text_processors.hour = function(arr, params) {
  const hour = util.getDateTimeDict().hour
  if (hour < arr[0]) return ''
  if (hour >= arr[1]) return ''
  return arr[2]
}



tp.text_processors.link = function(arr, params) {
  let s1 = arr.shift()
  let s2 = arr.join(':')
  return '<a href=\"' + s2 + '\" target="_blank">' + s1 + '</a>'
}


tp.text_processors.popup = function(arr, params) {
  let s1 = arr.shift()
  let s2 = arr.join(':')
  let id = s1.replace(/[^a-zA-Z_]/, '') + random.int(0, 999999999)
  const html = '<div id=\"' + id + '\" class=\"popup\" onclick=\"io.toggleDisplay(\'' + id + '\')"><p>' + s2 + '</p></div>'
  document.querySelector('#main').innerHTML += html
  return '<span class=\"popup-link\" onclick=\"io.toggleDisplay(\'#' + id + '\')">' + s1 + '</span>'
}



tp.text_processors.roomSet = function(arr, params) {
  const n = currentLocation.roomSetOrder - 1
  return n < arr.length ? arr[n] : ''
}




//-----------  CONDITIONALS  --------------------

tp.text_processors.if = function(arr, params) { return tp.handleIf(arr, params, false) }
tp.text_processors.ifNot = function(arr, params) { return tp.handleIf(arr, params, true) }
tp.handleIf = function(arr, params, reverse) {
  let name = arr.shift(), flag
  
  if (typeof params[name] === 'boolean') return (params[name] ? arr[0] : (arr[1] ? arr[1] : ""))
  
  const obj = tp._findObject(name, params, arr)
  if (!obj) return errormsg("Failed to find object '" + name + "' in text processor 'if/ifNot' (" + params.tpOriginalString + ")")
  name = arr.shift();
  let attValue = typeof obj[name] === 'function' ? obj[name](params) : obj[name]
  if (typeof attValue === 'object') attValue = attValue.name
  if (attValue === undefined) attValue = false
  if (typeof attValue === "boolean") {
    flag = attValue
  }
  else {
    let value = arr.shift()
    if (typeof attValue === "number") {
      if (isNaN(value)) return errormsg("Trying to compare a numeric attribute, '" + name + "' with a string (" + params.tpOriginalString + ").")
      value = parseInt(value)
    }
    flag = (attValue === value)
  }
  if (reverse) flag = !flag
  return (flag ? arr[0] : (arr[1] ? arr[1] : ""))
}



tp.text_processors.ifIs = function(arr, params) { return tp.handleIfIs(arr, params, false) }
tp.text_processors.ifNotIs = function(arr, params) { return tp.handleIfIs(arr, params, true) }

tp.handleIfIs = function(arr, params, reverse) {
  let name = arr.shift(), flag;
  const obj = tp._findObject(name, params, arr)
  if (!obj) return errormsg("Failed to find object '" + name + "' in text processor 'if/ifNot' (" + params.tpOriginalString + ")")
  name = arr.shift();
  let attValue = typeof obj[name] === 'function' ? obj[name](params) : obj[name]
  if (typeof attValue === 'object') attValue = attValue.name
  const value = util.guessMyType(arr.shift())
  flag = (attValue === value)
  if (reverse) flag = !flag
  return (flag ? arr[0] : (arr[1] ? arr[1] : ""))
}



tp.text_processors.ifExists = function(arr, params) { return tp.handleIfExists(arr, params, false) }
tp.text_processors.ifNotExists = function(arr, params) { return tp.handleIfExists(arr, params, true) }
tp.handleIfExists = function(arr, params, reverse) {
  let name = arr.shift(), flag
  const obj = tp._findObject(name, params, arr)
  if (!obj) return errormsg("Failed to find object '" + name + "' in text processor 'if/ifNotExists' (" + params.tpOriginalString + ")")
  name = arr.shift()
  flag = obj[name] !== undefined
  if (reverse) flag = !flag
  return (flag ? arr[0] : (arr[1] ? arr[1] : ""))
}


tp.text_processors.ifLessThan = function(arr, params) { return tp.handleIfLessMoreThan(arr, params, false, false) }
tp.text_processors.ifMoreThan = function(arr, params) { return tp.handleIfLessMoreThan(arr, params, true, false) }
tp.text_processors.ifLessThanOrEqual = function(arr, params) { return tp.handleIfLessMoreThan(arr, params, false, true) }
tp.text_processors.ifMoreThanOrEqual = function(arr, params) { return tp.handleIfLessMoreThan(arr, params, true, true) }
tp.handleIfLessMoreThan = function(arr, params, moreThan, orEqual) {
  let name = arr.shift(), flag
  const obj = tp._findObject(name, params, arr)
  if (!obj) return errormsg("Failed to find object '" + name + "' in text processor 'ifLessMoreThan' (" + params.tpOriginalString + ")")
  name = arr.shift()
  let attValue = typeof obj[name] === 'function' ? obj[name](params) : obj[name]
  if (typeof attValue !== "number") return errormsg("Trying to use ifLessThan with a non-numeric (or nonexistent) attribute, '" + name + "' (" + params.tpOriginalString + ").")
  let value = arr.shift()
  if (isNaN(value)) return errormsg("Trying to compare a numeric attribute, '" + name + "' with a string (" + params.tpOriginalString + ").")
  value = parseInt(value)
  flag = moreThan ? (orEqual ? (attValue >= value) : (attValue > value)) : (orEqual ? (attValue <= value) : (attValue < value))
  return (flag ? arr[0] : (arr[1] ? arr[1] : ""))
}


tp.text_processors.ifHere = function(arr, params) { return tp.handleIfHere(arr, params, false, 'loc') }
tp.text_processors.ifNotHere = function(arr, params) { return tp.handleIfHere(arr, params, true, 'loc') }
tp.text_processors.ifHeld = function(arr, params) { return tp.handleIfHere(arr, params, false, 'name') }
tp.text_processors.ifNotHeld = function(arr, params) { return tp.handleIfHere(arr, params, true, 'name') }
tp.handleIfHere = function(arr, params, reverse, locAtt) {
  const name = arr.shift();
  const obj = tp._findObject(name, params, arr)
  if (!obj) return errormsg("Failed to find object '" + name + "' in text processor 'ifHere' (" + params.tpOriginalString + ")")
  let flag = obj.isAtLoc(player[locAtt], world.ALL)
  if (reverse) flag = !flag
  return (flag ? arr[0] : (arr[1] ? arr[1] : ""))
}


tp.text_processors.ifPlayer = function(arr, params) { return tp.handleIfPlayer(arr, params, false) }
tp.text_processors.ifNotPlayer = function(arr, params) { return tp.handleIfPlayer(arr, params, true) }
tp.handleIfPlayer = function(arr, params, reverse) {
  let name = arr.shift(), flag
  const obj = tp._findObject(name, params, arr)
  if (!obj) return errormsg("Failed to find object '" + name + "' in text processor 'if/ifNotPlayer' (" + params.tpOriginalString + ")")
  flag = obj === player
  if (reverse) flag = !flag
  return (flag ? arr[0] : (arr[1] ? arr[1] : ""))
}















//---------------  SUPPORT  FOR  ROOM  TEMPLATES  ------------------------------------

tp.text_processors.terse = function(arr, params) {
  if ((settings.verbosity === world.TERSE && currentLocation.visited === 0) || settings.verbosity === world.VERBOSE || params.fullDescription) {
    return sentenceCase(arr.join(":"))
  }
  else {
    return ''
  }
}



// Need to do some hackery here...
// It is assumed this is only used in the room template, and therefore should be safe
// The issue is that the text for every room is {hereDesc}, so the "once" directive
// would only work the first time. In the second room, {hereDesc} has already been done, so once fails.
// The hack then is to pre-process the room text in here
tp.text_processors.hereDesc = function(arr, params) {
  let s
  const attName = settings.getLocationDescriptionAttName()
  if (typeof currentLocation[attName] === 'string') {
    s = currentLocation[attName]
  }
  else if (typeof currentLocation[attName] === 'function') {
    s = currentLocation[attName]()
    if (s === undefined) {
      log("This location description is not set up properly. It has a '" + attName + "' function that does not return a string. The location is \"" + currentLocation.name + "\".")
      return "[Bad description, F12 for details]"
    }
  }
  else {
    s = "This is a location in dire need of a description."
  }
  for (const el of scopeHereParser()) {
    if (typeof el.scenery === 'string') s += (settings.sceneryOnNewLine ? '|' : ' ') + el.scenery
  }
  delete params.tpFirstTime
  return processText(s, params)
}

tp.text_processors.hereName = function(arr, params) {
  return currentLocation.headingAlias
};

tp.text_processors.objectsHere = function(arr, params) {
  const listOfOjects = scopeHereListed();
  return listOfOjects.length === 0 ? "" : arr.join(":");
};

tp.text_processors.exitsHere = function(arr, params) {
  const list = currentLocation.getExitDirs()
  return list.length === 0 ? "" : arr.join(":");
};

tp.text_processors.objects = function(arr, params) {
  const listOfOjects = scopeHereListed();
  return formatList(listOfOjects, {article:INDEFINITE, lastSep:lang.list_and, modified:true, nothing:lang.list_nothing, loc:player.loc});
}
  
tp.text_processors.exits = function(arr, params) {
  const list = currentLocation.getExitDirs()
  return formatList(list, {lastSep:lang.list_or, nothing:lang.list_nowhere});
}




//----------------  PARAMS  AND  NEUTRAL  LANGUAGE  SUPPORT  ---------------------------
// Then {nv:char:try} to get





/*
The name functions could readily be expanded. You can add further parameters and Quest will then grab those and pass them to lang.getName. Thus, if we have this:

msg("You see {nm:item:the:false:x_count}.", {item:w.terror_cat, x_count:4})

Then the options passed to lang.getName will include x_count set to 4.
*/

// {function:character:article:capitalise}
tp.text_processors.nm = function(arr, params) { return tp.nameFunction(arr, params, false) }
tp.text_processors.nms = function(arr, params) { return tp.nameFunction(arr, params, true) }
tp.text_processors.list = function(arr, params) { return tp.nameFunction(arr, params, false, true) }
tp.nameFunction = function(arr, params, isPossessive, isList) {

  const name = arr.shift()
  let subject
  if (isList) {
    subject = params[name]
    if (!subject) {
      errormsg("Cannot find parameter for list text processor directive:" + name)
      return false
    }
    if (!Array.isArray(subject)) {
      errormsg("Parameter for list text processor directive is not a list:" + name)
      return false
    }
  }
  else {
    subject = tp._findObject(name, params, arr)
    if (!subject) return false;
  }
  
  const options = {possessive:isPossessive};
  if (arr[0] === 'THE') { options.article = DEFINITE; ignorePossessive:true }
  if (arr[0] === 'the') options.article = DEFINITE
  if (arr[0] === 'the-pa') {options.article = DEFINITE; options.possAdj = true }
  if (arr[0] === 'A') { options.article = INDEFINITE; ignorePossessive:true }
  if (arr[0] === 'a') options.article = INDEFINITE
  if (arr[0] === 'a-pa') {options.article = INDEFINITE; options.possAdj = true }
  if (arr[2] && options.possAdj) {
    options.possAdj = tp._findObject(arr[2], params, [])
  }
  if (arr[0] === 'count') options.article = COUNT
  if (params[subject.name + '_count']) options[subject.name + '_count'] = params[subject.name + '_count']
  if (params[name + '_count']) options[subject.name + '_count'] = params[name + '_count']
  if (params[subject.name + '_count_loc']) options['loc'] = params[subject.name + '_count_loc']
  let n = 2
  while (arr[n]) {
    options[arr[n]] = params[arr[n]]
    n++
  }
  options.lastSep = lang.list_and
  options.othing = lang.list_nothing

  const s = isList ? formatList(subject, options) :lang.getName(subject, options)
  
  return arr[1] === 'true' ? sentenceCase(s) : s;
}









// {function:character:verb:capitalise}
tp.text_processors.nv = function(arr, params) { return tp.conjugations(lang.nounVerb, arr, params) }
tp.text_processors.pv = function(arr, params) { return tp.conjugations(lang.pronounVerb, arr, params) }
tp.text_processors.vn = function(arr, params) { return tp.conjugations(lang.verbNoun, arr, params) }
tp.text_processors.vp = function(arr, params) { return tp.conjugations(lang.verbPronoun, arr, params) }
tp.text_processors.cj = function(arr, params) { return tp.conjugations(lang.conjugate, arr, params) }
tp.conjugations = function(func, arr, params) {
  const name = arr.shift()
  const subject = tp._findObject(name, params, arr)
  if (!subject) return false
  const options = {capitalise:arr[1] === 'true'}
  let n = 2
  while (arr[n]) {
    options[arr[n]] = params[arr[n]]
    n++
  }
  return func(subject, arr[0], options)
}


// {function:item:capitalise}
tp.handlePronouns = function(arr, params, pronoun) {
  const name = arr.shift()
  const subject = tp._findObject(name, params, arr)
  if (!subject) return false;
  return arr[0] === 'true' ? sentenceCase(subject.pronouns[pronoun]) : subject.pronouns[pronoun];
};
tp.text_processors.pa = function(arr, params) {
  return tp.handlePronouns(arr, params, "possAdj");
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
  const name1 = arr.shift()
  const chr1 = tp._findObject(name1, params, arr)
  if (!chr1) return false;
  const name2 = arr.shift()
  const chr2 = tp._findObject(name2, params, arr)
  if (!chr2) return false;
  
  if (chr1.pronouns === chr2.pronouns && chr1 !== chr2) {
    const opt = {article:DEFINITE, possessive:true};
    return arr[0] === 'true' ? sentenceCase(lang.getName(chr1, opt)) : lang.getName(chr1, opt)
  }
  
  return arr[0] === 'true' ? sentenceCase(chr1.pronouns.possAdj) : chr1.pronouns.possAdj;
};

// {pa3:chr1:chr2}
tp.text_processors.pa3 = function(arr, params) {
  const name1 = arr.shift()
  const chr1 = tp._findObject(name1, params, arr)
  if (!chr1) return false;
  const name2 = arr.shift()
  const chr2 = tp._findObject(name2, params, arr)
  if (!chr2) return false;
  
  if (chr1 !== chr2) {
    const opt = {article:DEFINITE, possessive:true};
    return arr[0] === 'true' ? sentenceCase(lang.getName(subject, opt)) : lang.getName(subject, opt);
  }
  
  return arr[0] === 'true' ? sentenceCase(chr1.pronouns.possAdj) : chr1.pronouns.possAdj;
};
