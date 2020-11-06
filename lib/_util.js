"use strict";

// ============  Utilities  =================================

// Should all be language neutral





const INDEFINITE = 1;
const DEFINITE = 2;

const INFINITY = 9999;

const NULL_FUNC = function() {};


const test = {};
test.testing = false;

//@DOC
// ## General Utility Functions
//@UNDOC


//@DOC
// This is an attempt to mimic the firsttime functionality of Quest 5. Unfortunately, JavaScript does not
// lend itself well to that!
// If this is the first time the give `id` has been encountered, the `first` function will be run.
// Otherwise the `other` function will be run, if given.
//
//     firstime(342, function() {
//       msg("This was the first time.")
//     }, function() {
//       msg("This was NOT the first time.")
//     }, function() {
//
function firsttime(id, first, other) {
  if (firsttimeTracker.includes(id)) {
    if (other) other()
  }
  else {
    firsttimeTracker.push(id)
    first()
  }
}
const firsttimeTracker = []




//@DOC
// If the given attribute is a string it is printed, if it is a
// function it is called. Otherwise an error is generated.
// It isMultiple is true, the object name is prefixed.
// TODO: test array with function
function printOrRun(char, item, attname, options) {
  if (options === undefined) options = {};

  if (typeof item[attname] === "string") {
    // The attribute is a string
    let s = prefix(item, options.multi) + item[attname]
    if (item[attname + 'Addendum']) s += item[attname + 'Addendum'](char)
    msg(s, {char:char, item:item});
    return true;
  }
  else if (typeof item[attname] === "function"){
    // The attribute is a function
    const res = item[attname](options.multi, char, options);
    return res;
  }
  else {
    const s = "Unsupported type for printOrRun (" + attname + " is a " + (typeof item[attname]) + ")."
    errormsg(s + " F12 for more.")
    throw new Error(s)
  }
}




function printOrRun2(char, item, attname, options) {
  if (options === undefined) options = {};
  let flag, i;
  if (Array.isArray(item[attname])) {
    // the attribute is an array
    //debugmsg(0, "Array: " + attname);
    flag = true;
    for (i = 0; i < item[attname].length; i++) {
      flag = printOrRun(char, item, item[attname][i], options) && flag;
    }
    return flag;
  }
  if (Array.isArray(attname)) {
    // The value is an array
    flag = true;
    for (i = 0; i < attname.length; i++) {
      flag = printOrRun(char, item, attname[i], options) && flag;
    }
    return flag;
  }
  else if (!item[attname]) {
    // This is not an attribute
    if (typeof attname === "function"){
      return attname(item, options.multi, char, options);
    }
    else {
      msg(attname, {char:char, item:item});
      return true;
    }
  }  
  else if (typeof item[attname] === "string") {
    // The attribute is a string
    msg(prefix(item, options.multi) + item[attname], {char:char, item:item});
    return true;
  }
  else if (typeof item[attname] === "function"){
    // The attribute is a function
    const res = item[attname](options.multi, char, options);
    return res;
  }
  else {
    errormsg("Unsupported type for printOrRun");
    return false;
  }
}



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
  for (let el of ary) this.buffer.push(el)
}




// ============  String Utilities  =======================================
//@DOC
// ## String Functions
//@UNDOC

//@DOC
// Returns the string with the first letter capitalised
function sentenceCase(str) {
  return str.replace(/[a-z]/i, letter => letter.toUpperCase()).trim();
}



//@DOC
// Returns a string with the given number of hard spaces. Browsers collapse multiple white spaces to just show
// one, so you need to use hard spaces (NBSPs) if you want several together.
function spaces(n) {
  return "&nbsp;".repeat(n)
}
  


//@DOC
// If isMultiple is true, returns the item name, otherwise nothing. This is useful in commands that handle
// multiple objects, as you can have this at the start of the response string. For example, if the player does GET BALL,
// the response might be "Done". If she does GET ALL, then the response for the ball needs to be "Ball: Done".
// In the command, you can have `msg(prefix(item, isMultiple) + "Done"), and it is sorted.
function prefix(item, isMultiple) {
  if (!isMultiple) { return ""; }
  return sentenceCase(item.alias) + ": ";
}



//@DOC
// Creates a string from an array. If the array element is a string, that is used, if it is an item, `lang.getName` is used (and passed the `options`). Items are sorted alphabetically, based on the "name" attribute.
//
// Options:
//
// * article:    DEFINITE (for "the") or INDEFINITE (for "a"), defaults to none (see `lang.getName`)
// * sep:        separator (defaults to comma)
// * lastJoiner: separator for last two items (just separator if not provided); you should include any spaces (this allows you to have a comma and "and", which is obviously wrong, but some people like it)
// * modified:   item aliases modified (see `lang.getName`) (defaults to false)
// * nothing:    return this if the list is empty (defaults to empty string)
// * count:      if this is a number, the name will be prefixed by that (instead of the article)
// * doNotSort   if true the list isnot sorted
// * separateEnsembles:  if true, ensembles are listed as the separate items
//
// For example:
//
// ```
// formatList(listOfOjects, {article:INDEFINITE, lastJoiner:" and "})
// -> "a hat, Mary and some boots"
//
// formatList(list, {lastJoiner:" or", nothing:"nowhere");
// -> north, east or up
// ```
//
function formatList(itemArray, options) {
  if (options === undefined) { options = {}; }

  if (itemArray.length === 0) {
    return options.nothing ? options.nothing : "";
  }

  if (!options.sep) { options.sep = ", "; }
  if (!options.lastJoiner) { options.lastJoiner = options.sep; }
  
  
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
  do {
  s += l.shift();
  if (l.length === 1) { s += options.lastJoiner; }
  if (l.length > 1) { s += options.sep; }
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
// Unlike array.subtract, no new array is created; the original aray is modified, and nothing is returned.
array.remove = function(ary, el) {
  let index = ary.indexOf(el)
  if (index !== -1) {
    ary.splice(index, 1)
  }
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








// ============  Scope Utilities  =======================================


//@DOC
// ## Scope Functions
//@UNDOC



//@DOC
// Returns an array of objects the player can currently reach and see.
function scopeReachable() {
  const list = [];
  for (let key in w) {
    if (w[key].scopeStatus === world.REACHABLE && world.ifNotDark(w[key])) {
      list.push(w[key]);
    }
  }
  return list;
}

//@DOC
// Returns an array of objects held by the given character.
function scopeHeldBy(chr, situation = world.PARSER) {
  return chr.getContents(situation)
}

//@DOC
// Returns an array of objects at the player's location that can be seen.
function scopeHereListed() {
  const list = [];
  for (let key in w) {
    if (w[key].isAtLoc(game.player.loc, world.LOOK) && world.ifNotDark(w[key])) {
      list.push(w[key]);
    }
  }
  return list;
}


//@DOC
// Returns an array of NPCs at the player's location.
function scopeNpcHere(ignoreDark) {
  const list = [];
  for (let key in w) {
    const o = w[key]
    if (o.isAtLoc(game.player.loc, world.LOOK) && o.npc && (world.ifNotDark(o) || ignoreDark)) {
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
    if (w[contName].loc === item.name) return falsemsg(container_recursion(char, this, item));
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







util.changeListeners = []

// This is used in world.endTurn, before turn events are run, and after too (just once if no turn events). Also after timer events if one fired
util.handleChangeListeners = function() {
  for (let el of util.changeListeners) {
    if (el.test(el.object, el.attName, el.oldValue)) el.func(el.object)
  }
}

util.defaultChangeListenerTest = function(object, attName, oldValue) {
  return object[attName] != oldValue
}

util.addChangeListener = function(object, attName, func, test = util.defaultChangeListenerTest) {
  if (world.isCreated && !settings.saveDisabled) {
    errormsg("Attempting to use addChangeListener after set up.")
    return
  }
  util.changeListeners.push({object:object, attName:attName, func:func, test:test, oldValue:object[attName]})
}





// ============  Response Utilities  =======================================


//@DOC
// ## The Respond Function
//@UNDOC



//@DOC
// Searchs the given list for a suitable response, according to the given params, and runs that response.
// This is a big topic, see [here](https://github.com/ThePix/QuestJS/wiki/The-respond-function) for more.
function respond(params, list, func) {
  //console.log(params)
  //if (!params.action) throw "No action in params"
  //if (!params.actor) throw "No action in params"
  //if (!params.target) throw "No action in params"
  const response = util.findResponse(params, list)
  if (!response) {
    if (func) func(params)
    errormsg("Failed to find a response (F12 for more)")
    console.log("Failed to find a response")
    console.log(params)
    console.log(list)
    return false
  }
  //console.log(response)
  if (response.script) response.script(params)
  if (response.msg) params.actor.msg(response.msg, params)
  if (!response.script && !response.msg) {
    errormsg("No script or msg for response (F12 for more)")
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

util.verifyResponses = function(list) {
  //  console.log(list)
  
  if (list[list.length - 1].test) {
    console.log("WARNING: Last entry has a test condition:")
    console.log(list)
  }
  for (let item of list) {
    if (item.responses) {
      //console.log(item.name)
      if (item.responses.length === 0) {
        console.log("Zero responses for: " + item.name)
      }
      else {
        util.verifyResponses(item.responses)
      }
    }
  }
}



util.listContents = function(situation, modified = true) {
  return formatList(this.getContents(situation), {article:INDEFINITE, lastJoiner:lang.list_and, modified:modified, nothing:lang.list_nothing, loc:this.name})
}

util.niceDirection = function(dir) {
  const dirObj = lang.exit_list.find(function(el) { return el.name === dir })
  return dirObj.niceDir ? dirObj.niceDir : dirObj.name
}

util.reverseDirection = function(dir) {
  const dirObj = lang.exit_list.find(function(el) { return el.name === dir })
  return dirObj.opp
}
    
util.reverseDirectionObj = function(dir) {
  return lang.exit_list.find(function(el) { return el.name === util.reverseDirection(dir) })
}

util.exitList = function(char = game.player) {
  const list = []
  const room = w[char.loc]
  for (let exit of lang.exit_list) {
    if (room.hasExit(exit.name)) {
      list.push(exit.name);
    }
  }
  return list;
}

util.defaultExitUse = function(char, dir) {
  if (char.testMobility && !char.testMobility()) {
    return false;
  }

  if (this.isLocked()) {
    if (this.lockedmsg) {
      msg(this.lockedmsg);
    }
    else {
      msg(lang.locked_exit(char, this));
    }
    return false;
  }

  for (let el of char.onGoCheckList) {
    if (!w[el].onGoCheck(char, this.name, dir)) return false
  }

  msg(lang.stop_posture(char));
  if (this.msg) {
    printOrRun(char, this, "msg");
  }
  else {
    msg(lang.go_successful, {char:char, dir:dir});
  }
  world.setRoom(char, this.name, false);
  return true;
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
  for (let f of item.nameModifierFunctions) f(item, list)
  if (item.nameModifierFunction) item.nameModifierFunction(list)
  if (list.length === 0) return ''
  return ' (' + list.join('; ') + ')'
}



//@DOC
// Returns the game time as a string. The game time is game.elapsedTime seconds after game.startTime.
util.getDateTime = function() {
  if (!settings.dateTime.format) {
    const time = new Date(game.elapsedTime * 1000 + game.startTime.getTime())
    return time.toLocaleString(settings.dateTime.locale, settings.dateTime)
  }
  
  let time = game.elapsedTime + settings.dateTime.startTime
  let s = '' + settings.dateTime.format
  for (let el of settings.dateTime.data) {
    console.log(time)
    const n = time % el.number
    time = Math.floor(time / el.number)
    s = s.replace('%' + el.name + '%', el.f ? el.f(n) : n)
    if (el.f2) s = s.replace('%' + el.name + '2%', el.f2(n, time))
  }
  return s  
  
}

