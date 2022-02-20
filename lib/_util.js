"use strict";

// ============  Utilities  =================================

// Should all be language neutral





const INDEFINITE = 1
const DEFINITE = 2
const COUNT = 3

const NULL_FUNC = function() {}


const test = {};
test.testing = false;

//@DOC
// ## General Utility Functions
//@UNDOC



// If we try to do anything fancy with log we get this line number not the calling line
const log = console.log
const debuglog = (s) => { if(settings.playMode === 'dev' || settings.playMode === 'beta'){ log(s)} }
const parserlog = (s) => { if(parser.debug){ log(s)} }


//@DOC
// Runs the given string as though the player typed it, including recording it in the output
function runCmd(cmd) {
  io.msgInputText(cmd)
  parser.parse(cmd)
}


function doOnce(o, s) {
  if (s === undefined) s = 'unspecifiedDoOnceFlag'
  if (o[s]) return false
  o[s] = true
  return true
}








//@DOC
// If the given attribute is a string it is printed, if it is a
// function it is called. Otherwise an error is generated.
// If options.multiple is true, the object name is prefixed.
function printOrRun(char, item, attname, options) {
  if (options === undefined) options = {};

  if (typeof item[attname] === "string") {
    // The attribute is a string
    let s = item[attname]
    if (item[attname + 'Addendum']) s += item[attname + 'Addendum'](char)
    msg(s, {char:char, item:item});
    return true;
  }
  else if (typeof item[attname] === "function"){
    // The attribute is a function
    const res = item[attname](options);
    return res;
  }
  else {
    const s = "Unsupported type for printOrRun (" + attname + " is a " + (typeof item[attname]) + ")."
    errormsg(s + " F12 for more.")
    throw new Error(s)
  }
}



function verbify(s) { return s.toLowerCase().replace(/[^a-zA-Z0-9_]/g, '') }



// ============  Random Utilities  =======================================
//@DOC
// ## Random Functions
//@UNDOC

const random = {
  buffer:[],
}

//@DOC
// Returns a random number from 0 to n1, or n1 to n2, inclusive.
random.int = function(n1, n2) {
  if (this.buffer.length > 0) return this.buffer.shift()
  if (n2 === undefined) {
    n2 = n1;
    n1 = 0;
  }
  return Math.floor(Math.random() * (n2 - n1 + 1)) + n1;
}



//@DOC
// Returns true 'percentile' times out of 100, false otherwise.
random.chance = function(percentile) {
  return random.int(99) < percentile;
}



//@DOC
// Returns a random element from the array, or null if it is empty
// If the second parameter is true, then the selected value is also deleted from the array,
// preventing it from being selected a second time.
// If sent a string instead of an array, the string will be broken into an array on |.
random.fromArray = function(arr, deleteEntry) {
  if (typeof arr === 'string') arr.split('|')
  if (arr.length === 0) return null;
  const index = random.int(arr.length - 1);
  const res = arr[index];
  if (deleteEntry) arr.splice(index, 1)
  return res;
}



//@DOC
// Returns the given array, in random order using the Fisher-Yates algorithm
random.shuffle = function(arr) {
  if (typeof arr === "number") arr = [...Array(arr).keys()]
  const res = []
  while (arr.length > 0) {
    res.push(random.fromArray(arr, true))
  }
  return res;
}


//@DOC
// Returns a random number based on the standard RPG dice notation.
// For example 2d6+3 means roll two six sided dice and add three.
// Returns he number if sent a number.
// It can cope with complex strings such as 2d8-3d6
// You can also specify unusual dice, i.e., not a sequence from one to n, by separating each value with a colon,
// so d1:5:6 rolls a three sided die, with 1, 5 and 6 on the sides.
// It will cope with any number of parts, so -19+2d1:5:6-d4 will be fine.
random.dice = function(s) {
  if (typeof s === 'number') return s
  s = s.replace(/ /g, '').replace(/\-/g, '+-')
  let total = 0

  for (let dice of s.split("+")) {
    if (dice === '') continue
    let negative = 1
    if (/^\-/.test(dice)) {
      dice = dice.substring(1)
      negative = -1
    }
    if (/^\d+$/.test(dice)) {
      total += parseInt(dice)
    }
    else {
      if (/^d/.test(dice)) {
        dice = "1" + dice
      }
      const parts = dice.split("d")
      if (parts.length === 2 && /^\d+$/.test(parts[0]) && /^[0-9\:]+$/.test(parts[1])) {
        const number = parseInt(parts[0]) 
        for (let i = 0; i < number; i++) {
          if (/^\d+$/.test(parts[1])) {
            total += negative * random.int(1, parseInt(parts[1]))
          }
          else {
            total += negative * parseInt(random.fromArray(parts[1].split(':')))
          
          }
        }
      }
      else {
        console.log("Can't parse dice type (but will attempt to use what I can): " + dice)
        errormsg ("Can't parse dice type (but will attempt to use what I can): " + dice)
      }
    }
  }
  return total
}

//@DOC
// Loads up a buffer with the given number or array of numbers.
// The random.int function will grab the first number from the buffer and return that instead of a random
// number, if there is anything in the buffer. Note that the other random functions all use random.int,
// so you can use random.prime to force any of them to return a certain value. Note that there is no
// checking, so random.int(4) could return 7 or even "seven". It is up to you to ensure the numbers you
// prime the buffer with make sense.
// This is most useful when testing, as you know in advance what the random number will be.
random.prime = function(ary) {
  if (typeof ary === 'number') ary = [ary]
  this.buffer = ary
}



// ============  String Utilities  =======================================
//@DOC
// ## String Functions
//@UNDOC

//@DOC
// Returns the string with the first letter capitalised
function sentenceCase(str) {
  if (str.length === 0) return ''
  return str.replace(str[0], str[0].toUpperCase())
}

//@DOC
// Returns the string with the first letter of each word capitalised
function titleCase(str) {
  return str.toLowerCase().split(' ').map(el => el.replace(el[0], el[0].toUpperCase())).join(' ')
}


//@DOC
// Returns a string with the given number of hard spaces. Browsers collapse multiple white spaces to just show
// one, so you need to use hard spaces (NBSPs) if you want several together.
function spaces(n) {
  return "&nbsp;".repeat(n)
}
  


//@DOC
// If multiple is true, returns the item name, otherwise nothing. This is useful in commands that handle
// multiple objects, as you can have this at the start of the response string. For example, if the player does GET BALL,
// the response might be "Done". If she does GET ALL, then the response for the ball needs to be "Ball: Done".
// In the command, you can have `msg("Done"), and it is sorted.
function prefix(item, options) {
  if (!options.multiple) { return ""; }
  return sentenceCase(item.alias) + ": ";
}



//@DOC
// Creates a string from an array. If the array element is a string, that is used, if it is an item, `lang.getName` is used (and passed the `options`). Items are sorted alphabetically, based on the "name" attribute.
//
// Options:
//
// * article:    DEFINITE (for "the") or INDEFINITE (for "a"), defaults to none (see `lang.getName`)
// * sep:        separator (defaults to comma)
// * lastJoiner: separator for last two items (just separator if not provided); you should not include any spaces
// * modified:   item aliases modified (see `lang.getName`) (defaults to false)
// * nothing:    return this if the list is empty (defaults to empty string)
// * count:      if this is a number, the name will be prefixed by that (instead of the article)
// * doNotSort   if true the list is not sorted
// * separateEnsembles:  if true, ensembles are listed as the separate items
//
// For example:
//
// ```
// formatList(listOfOjects, {article:INDEFINITE, lastJoiner:"and"})
// -> "a hat, Mary and some boots"
//
// formatList(list, {lastJoiner:"or", nothing:"nowhere");
// -> north, east or up
// ```
//
function formatList(itemArray, options) {
  if (options === undefined) { options = {}; }

  if (itemArray.length === 0) {
    return options.nothing ? options.nothing : "";
  }

  if (!options.sep) options.sep = ","
  
  
  if (!options.separateEnsembles) {
    const toRemove = [];
    const toAdd = [];
    for (let item of itemArray) {
      if (item.ensembleMaster && item.ensembleMaster.isAllTogether()) {
        toRemove.push(item);
        if (!toAdd.includes(item.ensembleMaster)) toAdd.push(item.ensembleMaster);
      }
    }
    itemArray = array.subtract(itemArray, toRemove);
    itemArray = itemArray.concat(toAdd);
  }
  
  // sort the list alphabetically on name
  if (!options.doNotSort) {
    itemArray.sort(function(a, b){
      if (a.name) a = a.name;
      if (b.name) b = b.name;
      return a.localeCompare(b)
    });
  }
  
  const l = itemArray.map(el => {
    //if (el === undefined) return "[undefined]";
    return typeof el === "string" ? el : lang.getName(el, options)
  })
  
  
  let s = "";
  if (settings.oxfordComma && l.length === 2 && options.lastJoiner) return l[0] + ' ' + options.lastJoiner + ' ' + l[1]
  do {
    s += l.shift()
    if (l.length === 1 && options.lastJoiner) {
      if (settings.oxfordComma) s += options.sep
      s += ' ' + options.lastJoiner + ' '
    } else if (l.length > 0) s += options.sep + ' '
  } while (l.length > 0);
  
  return s;
}



//@DOC
// Lists the properties of the given object; useful for debugging only.
// To inspect an object use JSON.stringify(obj)
function listProperties(obj) {
  return Object.keys(obj).join(", ");
}



const arabic = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
const roman = "M;CM;D;CD;C;XC;L;XL;X;IX;V;IV;I".split(";");


//@DOC
// Returns the given number as a string in Roman numerals. 
function toRoman(number) {
  if (typeof number !== "number") {
    errormsg ("toRoman can only handle numbers");
    return number;
  }

  let result = "";
  //var a, r;
  for (let i = 0; i < 13; i++) {
    while (number >= arabic[i]) {
      result = result + roman[i];
      number = number - arabic[i];
    }
  }
  return result;
}





//@DOC
// Returns the given number as a string formatted as money. The formatting is defined by settings.moneyFormat.
function displayMoney(n) {
  if (typeof settings.moneyFormat === "undefined") {
    errormsg ("No format for money set (set settings.moneyFormat in settings.js).");
    return "" + n;
  }
  const ary = settings.moneyFormat.split("!");
  if (ary.length === 2) {
    return settings.moneyFormat.replace("!", "" + n);
  }
  else if (ary.length === 3) {
    const negative = (n < 0)
    n = Math.abs(n);
    let options = ary[1]
    const showsign = options.startsWith("+")
    if (showsign) {
      options = options.substring(1);
    }
    let number = displayNumber(n, options)
    if (negative) {
      number = "-" + number;
    }
    else if (n !== 0 && showsign) {
      number = "+" + number;
    }
    return (ary[0] + number + ary[2]);
  }
  else if (ary.length === 4) {
    const options = n < 0 ? ary[2] : ary[1];
    return ary[0] + displayNumber(n, options) + ary[3];
  }
  else {
    errormsg ("settings.moneyFormat in settings.js expected to have either 1, 2 or 3 exclamation marks.")
    return "" + n;
  }
}



//@DOC
// Returns the given number as a string formatted as per the control string.
// The control string is made up of five parts.
// The first is a sequence of characters that are not digits that will be added to the start of the string, and is optional.
// The second is a sequence of digits and it the number of characters left of the decimal point; this is padded with zeros to make it longer.
// The third is a single non-digit character; the decimal marker.
// The fourth is a sequence of digits and it the number of characters right of the decimal point; this is padded with zeros to make it longer.
// The fifth is a sequence of characters that are not digits that will be added to the end of the string, and is optional.
function displayNumber(n, control) {
  n = Math.abs(n);  // must be positive
  const regex = /^(\D*)(\d+)(\D)(\d*)(\D*)$/;
  if (!regex.test(control)) {
    errormsg ("Unexpected format in displayNumber (" + control + "). Should be a number, followed by a single character separator, followed by a number.");
    return "" + n;
  }
  const options = regex.exec(control);
  const places = parseInt(options[4]);                      // eg 2
  let padding = parseInt(options[2]);             // eg 3
  if (places > 0) {
    // We want a decimal point, so the padding, the total length, needs that plus the places
    padding = padding + 1 + places;               // eg 6
  }
  const factor = Math.pow (10, places)            // eg 100
  const base = (n / factor).toFixed(places);      // eg "12.34"
  const decimal = base.replace(".", options[3])   // eg "12,34"
  return (options[1] + decimal.padStart(padding, "0") + options[5])   // eg "(012,34)"
}


//@DOC
// Converts the string to the standard direction name, so "down", "dn" and "d" will all return "down".
// Uses the EXITS array, so language neutral.
function getDir(s) {
  for (let exit of lang.exit_list) {
    if (exit.type === 'nocmd') continue;
    if (exit.name === s) return exit.name;
    if (exit.abbrev.toLowerCase() === s) return exit.name;
    if (new RegExp("^(" + exit.alt + ")$").test(s)) return exit.name;
  }
  return false;
}







// ============  Array Utilities  =======================================
//@DOC
// ## Array (List) Functions
//@UNDOC


const array = {}

//@DOC
// Returns a new array, derived by subtracting each element in b from the array a.
// If b is not an array, then b itself will be removed.
// Unit tested.
array.subtract = function(a, b) {
  if (!Array.isArray(b)) b = [b]
  const res = []
  for (let i = 0; i < a.length; i++) {
    if (!b.includes(a[i])) res.push(a[i]);
  }
  return res;
}



//@DOC
// Returns true if the arrays a and b are equal. They are equal if both are arrays, they have the same length,
// and each element in order is the same.
// Assumes a is an array, but not b.
// Unit tested
array.compare = function(a, b) {
  if (!Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (b[i] !== a[i]) return false;
  }
  return true;
}



//@DOC
// Returns true if each element in a matches the elements in b, but not necessarily in the same order
// (assumes each element is unique; repeated elements may give spurious results).
// Assumes a is an array, but not b.
// Unit tested
array.compareUnordered = function(a, b) {
  if (!Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let el of a) {
    if (!b.includes(el)) return false;
  }
  return true;
}



//@DOC
// Removes the element el from the array, ary.
// Unlike array.subtract, no new array is created; the original array is modified, and nothing is returned.
array.remove = function(ary, el) {
  let index = ary.indexOf(el)
  if (index !== -1) {
    ary.splice(index, 1)
  }
}



//@DOC
// Returns a new array containing all the elements that are in both the given arrays.
// Assumes no duplicates in the arrays
array.intersection = function(ary1, ary2) {
  return ary1.filter(function(x) {
    // checking second array contains the element "x"
    if(ary2.indexOf(x) != -1)
      return true;
    else
      return false;
  })
}




//@DOC
// Returns a new array based on ary, but including only those objects for which the attribute attName is equal to value.
// To filter for objects that do not have the attribute you can filter for the value undefined.
array.filterByAttribute = function(ary, attName, value) {
  return ary.filter(el => el[attName] === value)
}






//@DOC
// Returns the next element after el from the array, ary.
// If el is present more than once, it goes with the first.
// If el is the last element, and circular is true it return the fist element and false otherwise.
array.next = function(ary, el, circular) {
  let index = ary.indexOf(el) + 1
  if (index === 0) return false
  if (index === ary.length) return circular ? ary[0] : false
  return ary[index]
}



//@DOC
// Returns the next element after el from the array, ary, for which the attribute, att, is true.
// If el is present more than once, it goes with the first.
// If el is the last element, and circular is true it return the fist element and false otherwise.
array.nextFlagged = function(ary, el, att, circular) {
  let o = el
  let count = ary.length
  while (o && !o[att] && count > 0) {
    o = array.next(ary, o, circular)
    count = count - 1
  }
  if (!o || !o[att]) return false
  return (o)
}


//@DOC
// Returns a copy of the given array. Members of the array are not cloned.
array.clone = function(ary, options) {
  if (!options) options = {}
  let newary = options.compress ? [...new Set(ary)] : [...ary]
  if (options.value) newary = newary.map(el => el[options.value])
  if (options.function) newary = newary.map(el => el[options.function]())
  if (options.attribute) newary = newary.map(el => typeof el[options.attribute] === 'function' ? el[options.attribute]() : el[options.attribute])
  return options.reverse ? newary.reverse() : newary
}



//@DOC
// Returns true if any member of the array matches the string.
// It is a match if the element is also a string and they are the same or
// if the elem,ent is a regex and the pattern matches
array.hasMatch = function(ary, s) {
  for (let e of ary) {
    if (typeof e === 'string' && e === s) return true
    if (e instanceof RegExp && s.match(e)) return true
  }
  return false
}


//@DOC
// Returns an array of combinations based on the given array
// Combinations have between one and three elements from the original array
// and will be in the original order.
// Each combination is a string with the elements separated with a space.
// Used by the parser (in case it seems obscure and pointless!)
array.combos = function(ary, sep=' ') {
  const res = []
  for (let i = 0; i < ary.length; i++) {
    res.push(ary[i])
    for (let j = i + 1; j < ary.length; j++) {
      res.push(ary[i] + sep + ary[j])
      for (let k = j + 1; k < ary.length; k++) {
        res.push(ary[i] + sep + ary[j] + sep + ary[k])
      }
    }
  }    
  return res
}



array.fromTokens = function(ary, scope, cmdParams) {
  const items = []
  while (ary.length > 0) {
    const res = array.oneFromTokens(ary, scope, cmdParams)
    if (!res) return null
    items.push(res)
  }
  return items
}

array.oneFromTokens = function(ary, scope, cmdParams = {}) {
  for (let i = ary.length; i > 0; i--) {
    const s = ary.slice(0, i).join(' ')
    const items = parser.findInList(s, scope, cmdParams)
    if (items.length > 0) {
      for (let j = 0; j < i; j++) ary.shift()
      return items
    }
  }
  return null
}


array.value = function(ary, index, opt) {
  if (index >= ary.length || index < 0) {
    if (opt === 'none') return ''
    if (opt === 'wrap') return ary[index % ary.length]
    if (opt === 'end') return ary[ary.length - 1]
    if (opt === 'start') return ary[0]
  }
  return ary[index]
}



// ============  Scope Utilities  =======================================


//@DOC
// ## Scope Functions
//@UNDOC



//@DOC
// Returns an array of objects the player can currently reach and see.
function scopeReachable() {
  const list = [];
  for (let key in w) {
    if (w[key].scopeStatus.canReach && world.ifNotDark(w[key])) {
      list.push(w[key]);
    }
  }
  return list;
}

//@DOC
// Returns an array of objects held by the given character.
function scopeHeldBy(chr = player, situation = world.PARSER) {
  return chr.getContents(situation)
}

//@DOC
// Returns an array of objects at the player's location that can be seen.
function scopeHereListed() {
  const list = [];
  for (let key in w) {
    const o = w[key]
    if (!o.player && o.isAtLoc(player.loc, world.LOOK) && world.ifNotDark(o)) {
      list.push(o);
    }
  }
  return list;
}

//@DOC
// Returns an array of objects at the player's location that can be seen.
function scopeHereParser() {
  const list = [];
  for (let key in w) {
    const o = w[key]
    if (!o.player && o.isAtLoc(player.loc, world.PARSER)) {
      list.push(o);
    }
  }
  return list;
}


//@DOC
// Returns an array of NPCs at the player's location (excludes those flagged as scenery).
function scopeNpcHere(ignoreDark) {
  const list = [];
  for (let key in w) {
    const o = w[key]
    if (o.isAtLoc(player.loc, world.LOOK) && o.npc && (world.ifNotDark(o) || ignoreDark)) {
      list.push(o);
    }
  }
  return list;
}


//@DOC
// Returns an array of NPCs at the player's location (includes those flagged as scenery).
function scopeAllNpcHere(ignoreDark) {
  const list = [];
  for (let key in w) {
    const o = w[key]
    if (o.isAtLoc(player.loc, world.PARSER) && o.npc && (world.ifNotDark(o) || ignoreDark)) {
      list.push(o);
    }
  }
  return list;
}


//@DOC
// Returns an array of objects for which the given function returns true.
function scopeBy(func) {
  const list = [];
  for (let key in w) {
    if (func(w[key])) {
      list.push(w[key]);
    }
  }
  return list;
}


const util = {}







util.getContents = function(situation) {
  const list = [];
  for (let key in w) {
    if (w[key].isAtLoc(this.name, situation)) {
      list.push(w[key]);
    }
  }
  return list;
}

// Is this container already inside the given object, and hence
// putting the object in the container will destroy the universe
util.testForRecursion = function(char, item) {
  let contName = this.name;
  while (w[contName]) {
    if (w[contName].loc === item.name) return falsemsg(lang.container_recursion, {char:char, container:this, item:item})
    contName = w[contName].loc
  }
  return true;
}

util.nameModifierFunctionForContainer = function(o, list) {
  //console.log("here")
  const contents = o.getContents(world.LOOK);
  //console.log(contents)
  if (contents.length > 0 && (!o.closed || o.transparent)) {
    list.push(lang.contentsForData[o.contentsType].prefix + o.listContents(world.LOOK) + lang.contentsForData[o.contentsType].suffix)
  }
  //console.log(list)
}





//@DOC
// Returns the given number, num, but restricted to lie
// between min and max; i.e., if number is less than min,
// then min will be returned instead.
util.clamp = function(num, min, max) {
  return num <= min ? min : (num >= max  ? max : num)
}




util.registerTimerFunction = function(eventName, func) {
  if (world.isCreated && !settings.saveDisabled) {
    errormsg("Attempting to use registerEvent after set up.")
    return
  }
  settings.eventFunctions[eventName] = func;
}
util.registerTimerEvent = function(eventName, triggerTime, interval) {
  if (!settings.eventFunctions[eventName]) errormsg("A timer is trying to call event '" + eventName + "' but no such function is registered.")
  game.timerEventNames.push(eventName)
  game.timerEventTriggerTimes.push(triggerTime)
  game.timerEventIntervals.push(interval ? interval : -1)
}




util.findTopic = function(alias, char, n = 1) {
  if (w[alias]) return w[alias]
  for (const key in w) {
    const o = w[key]
    if (o.conversationTopic && (!char || o.belongsTo(char.name)) && o.alias === alias) {
      n--
      if (n === 0) return o
    }
  }
  if (char) {
    errormsg("Trying to find topic " + n + " called \"" + alias + "\" for " + char.name + " and came up empty-handed!")
  }
  else {
    errormsg("Trying to find topic " + n + " called \"" + alias + "\" for anyone and came up empty-handed!")
  }
}





util.changeListeners = []

// This is used in world.endTurn, before turn events are run, and after too (just once if no turn events). Also after timer events if one fired
util.handleChangeListeners = function() {
  for (let el of util.changeListeners) {
    if (el.test(el.object, el.object[el.attName], el.oldValue, el.attName)) {
      el.func(el.object, el.object[el.attName], el.oldValue, el.attName)
    }
    el.oldValue = el.object[el.attName]
  }
}

util.defaultChangeListenerTest = function(object, currentValue, oldValue, attName) {
  return currentValue !== oldValue
}

util.addChangeListener = function(object, attName, func, test = util.defaultChangeListenerTest) {
  if (world.isCreated && !settings.saveDisabled) {
    errormsg("Attempting to use addChangeListener after set up.")
    return
  }
  util.changeListeners.push({object:object, attName:attName, func:func, test:test, oldValue:object[attName]})
}

util.getChangeListenersSaveString = function() {
  if (util.changeListeners.length === 0) return "NoChangeListeners"
  const strings = util.changeListeners.map(el => el.oldValue.toString())
  const s = "ChangeListenersUsedStrings=" + saveLoad.encodeArray(strings);
  return s;
}

util.setChangeListenersLoadString = function(s) {
  if (s === "NoChangeListeners") return
  const parts = s.split("=");
  if (parts.length !== 2) return errormsg("Bad format in saved data (" + s + ")")
  if (parts[0] !== "ChangeListenersUsedStrings") return errormsg("Expected ChangeListenersUsedStrings to be first")
  const strings = saveLoad.decodeArray(parts[1])
  for (let i = 0; i < strings.length; i++) {
    util.changeListeners[i].oldValue = strings[i].match(/^\d+$/) ? parseInt(strings[i]) : strings[i]
  }
}




// ============  Response Utilities  =======================================


//@DOC
// ## The Respond Function
//@UNDOC



//@DOC
// Searchs the given list for a suitable response, according to the given params, and runs that response.
// This is a big topic, see [here](https://github.com/ThePix/QuestJS/wiki/The-respond-function) for more.
function respond(params, list, func) {
  if (settings.responseDebug) log(params)
  const response = util.findResponse(params, list)
  if (!response) {
    if (func) func(params)
    errormsg("Failed to find a response. ASK/TELL or some other system using the respond function was given a list of options that did not have a default. Below the stack trace, you should see the parameters sent and the list of responses. The last response should have no test function (or a test function that always returns true).")
    console.log(params)
    console.log(list)
    return false
  }
  //console.log(params)
  if (response.script) response.script.bind(params.char)(params)
  if (response.msg) {
    if (params.char) {
      params.char.msg(response.msg, params)
    }
    else {
      msg(response.msg, params)
    }
  }
  if (!response.script && !response.msg && !response.failed) {
    errormsg("No script or msg for response")
    console.log(response)
  }
  if (func) func(params, response)
  return !response.failed
}








function getResponseList(params, list, result) {
  if (!result) result = []
  for (let item of list) {
    if (item.name) {
      params.text = item.name.toLowerCase()
      //console.log("check item: " + item.name)
      if (item.test) {
        if (!result.includes(item) && item.test(params)) result.push(item)
      }
      else {
        if (!result.includes(item)) result.push(item)
      }
      //console.log("item is good: " + item.name)
    }
    if (item.responses) result = getResponseList(params, item.responses, result)
    //console.log("done")
  }
  return result
}

util.findResponse = function(params, list) {
  for (let item of list) {
    if (item.test && !item.test(params)) continue
    if (item.responses) return util.findResponse(params, item.responses)
    return item
  }
  return false
}
  
util.addResponse = function(route, data, list) {
  util.addResponseToList(route, data, list)
}

util.addResponseToList = function(route, data, list) {
  const sublist = util.getResponseSubList(route, list)
  sublist.unshift(data)
}

util.getResponseSubList = function(route, list) {
  const s = route.shift()
  if (s) {
    const sublist = list.find(el => el.name === s)
    if (!sublist) throw "Failed to add sub-list with " + s
    return util.getResponseSubList(route, sublist.responses)
  }
  else {
    return list
  }
}

util.verifyResponses = function(list, level) {
  //  console.log(list)
  if (level === undefined) level = 1
  if (list[list.length - 1].test) {
    console.log("WARNING: Last entry at depth " + level + " has a test condition:")
    console.log(list)
  }
  for (let item of list) {
    if (item.responses) {
      //console.log(item.name)
      if (item.responses.length === 0) {
        console.log("Zero responses at depth " + level + " for: " + item.name)
      }
      else {
        util.verifyResponses(item.responses, level + 1)
      }
    }
  }
}


// This should be assigned to an object, and then used from there
util.listContents = function(situation, modified = true) {
  return formatList(this.getContents(situation), {article:INDEFINITE, lastJoiner:lang.list_and, modified:modified, nothing:lang.list_nothing, loc:this.name})
}



//@DOC
// Returns the number of the internal the given number falls in
// For example, if intervals
// Unit tested.
util.getByInterval = function(intervals, n) {
  let count = 0
  while (count < intervals.length) {
    if (n < intervals[count]) return count
    n -= intervals[count]
    count++
  }
  return false
}




util.guessMyType = function(value) {
  if (value.match(/^\d+$/)) value = parseInt(value)
  if (value === 'true') value = true
  if (value === 'false') value = false
  if (value === 'undefined') value = undefined
  return value
}




//@DOC
// Returns a string formatted in CSS from the given dictionary.
// If includeCurlyBraces is true, you get curly braces too.
util.dictionaryToCss = function(d, includeCurlyBraces) {
  const ary = []
  for (let key in d) ary.push(key + ':' + d[key])
  return includeCurlyBraces ? '{' + ary.join(';') + '}' : ary.join(';')
}


util.getNameModifiers = function(item, options) {
  if (!options.modified) return ''
  const list = []
  for (let f of item.nameModifierFunctions) f(item, list, options)
  if (item.nameModifierFunction) item.nameModifierFunction(list, options)
  if (list.length === 0) return ''
  if (options.noBrackets) return ' ' + list.join('; ')
  return ' (' + list.join('; ') + ')'
}



//@DOC
// Returns the game time as a string. The game time is game.elapsedTime seconds after game.startTime.
util.getDateTime = function(options) {
  if (!settings.dateTime.formats) {
    const time = new Date(game.elapsedTime * 1000 + game.startTime.getTime())
    return time.toLocaleString(settings.dateTime.locale, settings.dateTime)
  }
  
  return util.getCustomDateTime(options)
}

util.getDateTimeDict = function(options) {
  if (!options) options = {}
  return settings.dateTime.formats ? util.getCustomDateTimeDict(options) : util.getStdDateTimeDict(options)
}

util.getStdDateTimeDict = function(options) {
  const dict = {}
  let timeInSeconds = game.elapsedTime
  if (options.add) timeInSeconds += options.add
  const time = new Date(timeInSeconds * 1000 + game.startTime.getTime())
  dict.second = time.getSeconds()
  dict.minute = time.getMinutes()
  dict.hour = time.getHours()
  dict.date = time.getDate()
  dict.weekday = time.toLocaleString('default', { weekday: 'long' })
  dict.month = time.toLocaleString('default', { month: 'long' })
  dict.year = time.getFullYear()

  return dict
}  

util.getCustomDateTimeDict = function(options) {
  const dict = {}
  let time = settings.dateTime.startTime + game.elapsedTime
  if (options.is) time = settings.dateTime.startTime + options.is
  if (options.add) time += options.add
  for (let el of settings.dateTime.data) {
    dict[el.name] = time % el.number
    time = Math.floor(time / el.number)
  }
  return dict
}  

util.getCustomDateTime = function(options) {
  if (!options) options = {}
  const dict = util.getCustomDateTimeDict(options)
  let s = options.format ? settings.dateTime.formats[options.format] : settings.dateTime.formats.def
  for (let key in settings.dateTime.functions) {
    s = s.replace('%' + key + '%', settings.dateTime.functions[key](dict))
  }
  return s
}

util.seconds = function(seconds, minutes = 0, hours = 0, days = 0) {
  if (settings.dateTime.convertSeconds) return settings.dateTime.convertSeconds(seconds, minutes, hours, days)
  return ((((days * 24) + hours) * 60) + minutes) * 60 + seconds
}

util.elapsed = function(seconds, minutes = 0, hours = 0, days = 0) {
  return util.seconds(seconds, minutes, hours, days) >= game.elapsedTime
}

util.isAfter = function(timeString) {
  if (typeof timeString === 'number') return game.elapsedTime > timeString

  if (timeString.match(/^\d\d\d\d$/)) {
    // This is a 24h clock time, so a daily
    const dict = util.getDateTimeDict()
    
    const hour = parseInt(timeString.substring(0, 2))
    const minute = parseInt(timeString.substring(2, 4))
    if (hour < dict.hour) return true
    if (hour > dict.hour) return false
    return (minute < dict.minute)
  }

  const nowTime = new Date(game.elapsedTime * 1000 + game.startTime.getTime())
  const targetTime = Date.parse(timeString)
  if (targetTime) return nowTime > targetTime
  return errormsg("Failed to parse date-time string: " + timeString)
}


util.changePOV = function(char, pronouns) {
  if (typeof char === 'string') {
    if (!w[char]) return errormsg("Failed to change POV, no object called '" + char + "'")
    char = w[char]
  }
  else if (!char) errormsg("Failed to change POV, char not defined.")

  if (player) {
    player.player = false
    player.pronouns = player.npcPronouns
    player.regex = new RegExp('^(' + (char.npcAlias ? char.npcAlias : char.alias) + ')$')
  }
  char.player = true
  char.npcPronouns = char.pronouns
  char.pronouns = pronouns ? pronouns : lang.pronouns.secondperson
  char.regex = new RegExp('^(me|myself|player|' + (char.npcAlias ? char.npcAlias : char.alias) + ')$')
  player = char
  player = char
  world.update()
}


util.getObj = function(name) {
  if (!name) return errormsg("Trying to find an object in util.getObj, but name is " + name)
  if (typeof name === 'string') {
    const room = w[name]
    if (room === undefined) throw new Error("Failed to find room: " + name + ".")
    return room
  }
  else {
    if (name.name === undefined) {
      throw "Not sure what to do with this room: " + name + " (a " + (typeof name) + ")."
    }
    return name
  }
}



util.findUniqueName = function(s) {
  if (!w[s]) {
    return (s);
  }
  else {
    const res = /(\d+)$/.exec(s);
    if (!res) {
      return util.findUniqueName(s + "0");
    }
    const n = parseInt(res[0]) + 1;
    return util.findUniqueName(s.replace(/(\d+)$/, "" + n));
  }
}
  

util.findSource = function(options) {
  const fluids = options.fluid ? [options.fluid] : settings.fluids
  const chr = options.char ? options.char : player
  
  // Is character a source?
  if (chr.isSourceOf) {
    for (const s of fluids) {
      if (chr.isSourceOf(s)) {
        options.source = chr
        options.fluid = s
        return true
      }
    }
  }
  
  // Is the room a source?
  if (w[chr.loc].isSourceOf) {
    for (const s of fluids) {
      if (w[chr.loc].isSourceOf(s)) {
        options.source = w[chr.loc]
        options.fluid = s
        return true
      }
    }
  }

  // Is there some other source?
  const items = scopeReachable()
  for (const s of fluids) {
    for (let obj of items) {
      if (obj.isSourceOf && obj.isSourceOf(s)) {
        options.source = obj
        options.fluid = s
        return true
      }
      if (obj.containedFluidName && obj.containedFluidName === s) {
        options.source = obj
        options.fluid = s
        return true
      }
    }
  }
  return false
}



util.multiIsUltimatelyHeldBy = function(obj, objNames) {
  for (const objName of objNames) {
    if (!objName) continue
    let o = w[objName]
    if (o === obj) return true
    while (o.loc) {
      if (o.loc === obj.name) return true
      o = w[o.loc]
    }
  }
  return false
}


util.testAttribute = function(o, attName) {
  if (typeof o[attName] === 'function') {
    return o[attName]()
  }
  else {
    return o[attName]
  }
}

util.getLoc = function(options, loc, name) {
  if (!loc) return
  if (typeof loc === 'object') {
    options[name] = loc.name
  }
  else if (loc === 'char' || loc === 'name') {
    options[name] = options.char.name
  }
  else if (loc === 'loc' && options.container) {
    options[name] = options.container.name
  }
  else if (loc === 'loc' && options.holder) {
    options[name] = options.holder.name
  }
  else if (loc === 'loc') {
    options[name] = options.char.loc
  }
  else if (w[loc]) {
    options[name] = loc
  }
  else {
    errormsg("Unexpected location in util.setToFrom/util.getLoc: " + loc)
  }
}


util.setToFrom = function(options, toLoc, fromLoc) {
  util.getLoc(options, toLoc, "toLoc")
  util.getLoc(options, fromLoc, "fromLoc")
  return options
}


util.defaultExitUse = function(char, exit) {
  if (!exit) exit = this
  if (char.testMove && !char.testMove(exit)) return false
  if (exit.isLocked()) {
    return falsemsg(exit.lockedmsg ? exit.lockedmsg : lang.locked_exit, {char:char, exit:exit})
  }
  if (exit.testExit && !exit.testExit(char, exit)) return false
  for (const el of char.getCarrying()) {
    if (el.testCarry && !el.testCarry({char:char, item:el, exit:exit})) return false
  }
  return this.simpleUse ? this.simpleUse(char) : util.defaultSimpleExitUse(char, exit)
}



util.defaultSimpleExitUse = function(char, exit) {
  if (exit.name === '_') return errormsg("Trying to move character to location \"_\" from room " + exit.origin.name + ". This is probably a bug, as \"_\" is used to flag a destination that cannot be reached.")
  if (exit === undefined) exit = this

  char.msg(lang.stop_posture(char))
  char.movingMsg(exit) 
  char.moveChar(exit)
  return true  
}


// Helper function for exits.
// You must set "door" and can optionally set "doorName" in the exit attributes
util.useWithDoor = function(char) {
  const obj = w[this.door];
  if (obj === undefined) {
    errormsg("Not found an object called '" + this.door + "'. Any exit that uses the 'util.useWithDoor' function must also set a 'door' attribute.");
  }
  const tpParams = {char:char, doorName:this.doorName ? this.doorName : "door"}
  if (!obj.closed) {
    char.moveChar(this)
    return true
  }
  if (!obj.locked) {
    obj.closed = false
    msg(lang.open_and_enter, tpParams)
    char.moveChar(this)
    return true
  }
  if (obj.testKeys(char)) {
    obj.closed = false
    obj.locked = false
    msg(lang.unlock_and_enter, tpParams)
    char.moveChar(this)
    return true
  }        
  msg(lang.try_but_locked, tpParams)
  return false
}


// Helper function for exits.
// You can optionally set "msg" in the exit attributes
util.cannotUse = function(char, dir) {
  const tpParams = {char:char}
  msg(this.msg ? this.msg : lang.try_but_locked, tpParams)
  return false
}
