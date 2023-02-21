"use strict"

const log = console.log



const LIST1 = "North;Northeast;East;Southeast;South;Southwest;West;NorthWest;Up;Down;In;Out".split(";")
const LIST2 = "South;Southwest;West;NorthWest;North;Northeast;East;Southeast;Down;Up;Out;In".split(";")
const JOINER = '~'


const jsReplacements = [
  {asl: '\r', js: ''},

  {asl: / and /, js: ' && '},
  {asl: / or /, js: ' || '},
  {asl: /\bnot /, js: '!'},
  {asl: / \<\> /, js: ' !== '},
  {asl: /do ?\(([a-zA-Z0-9_.]+), ([a-zA-Z_]+)\)/, js: '$1[$2]()'},
  {asl: /do ?\(([a-zA-Z0-9_.]+), ~\)/, js: '$1[~]()'},
  {asl: /foreach \(([a-zA-Z0-9_]+), ([a-zA-Z0-9_.()]+)\)/, js: 'for (let $1 of $2)'},
  {asl: /otherwise/, js: 'else'},
  
  {asl: /game.pov/, js: 'player'},

  {asl: /HasString ?\(([a-zA-Z0-9_.]+), ([a-zA-Z0-9_]+)\)/g, js: 'typeof $1[$2] === "string"'},
  {asl: /HasInt ?\(([a-zA-Z0-9_.]+), ([a-zA-Z0-9_]+)\)/g, js: 'typeof $1[$2] === "number"'},
  {asl: /HasBoolean ?\(([a-zA-Z0-9_.]+), ([a-zA-Z0-9_]+)\)/g, js: 'typeof $1[$2] === "boolean"'},
  {asl: /HasScript ?\(([a-zA-Z0-9_.]+), ([a-zA-Z0-9_]+)\)/g, js: 'typeof $1[$2] === "function"'},
  {asl: /GetBoolean ?\(([a-zA-Z0-9_.]+), ([a-zA-Z0-9_]+)\)/g, js: '$1[$2]'},
  {asl: /HasString ?\(([a-zA-Z0-9_.]+), ~\)/g, js: 'typeof $1[~] === "string"'},
  {asl: /HasInt ?\(([a-zA-Z0-9_.]+), ~\)/g, js: 'typeof $1[~] === "number"'},
  {asl: /HasBoolean ?\(([a-zA-Z0-9_.]+), ~\)/g, js: 'typeof $1[~] === "boolean"'},
  {asl: /HasScript ?\(([a-zA-Z0-9_.]+), ~\)/g, js: 'typeof $1[~] === "function"'},
  {asl: /GetBoolean ?\(([a-zA-Z0-9_.]+), ~\)/g, js: '$1[~]'},


  {asl: /if \(([a-zA-Z_]+)\.parent = ([a-zA-Z_]+)\)/, js: 'if ($1.isAtLoc("$2"))'},

  {asl: /([a-zA-Z_.]+) = $1 \+ /g, js: '$1 += '},
  {asl: /([a-zA-Z_.]+) = $1 \- /g, js: '$1 -= '},

  {asl: /GetDisplayName ?\(([a-zA-Z0-9_.]+)\)/g, js: 'lang.getName($1,{})'},
  {asl: /GetDisplayAlias ?\(([a-zA-Z0-9_.]+)\)/g, js: 'lang.getName($1,{})'},
  {asl: /([a-zA-Z0-9_]+)\.alias/g, js: 'lang.getName($1,{})'},
  {asl: /([a-zA-Z0-9_]+)\.article/g, js: '$1.pronouns.objective'},
  {asl: /([a-zA-Z0-9_]+)\.gender/g, js: '$1.pronouns.subjective'},

  {asl: /ToInt ?\(([0-9a-zA-Z_."]+)\)/g, js: 'parseInt($1)'},
  {asl: /TypeOf ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/g, js: 'typeof $1.$2'},
  {asl: /TypeOf ?\(([0-9a-zA-Z_."]+), ~\)/g, js: 'typeof $1[~]'},
  {asl: /TypeOf ?\(([0-9a-zA-Z_."]+)\)/g, js: 'typeof $1'},
  {asl: /ClearScreen ?()/, js: 'clearScreen()'},
  {asl: /DisplayList ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, js: 'msgList($1, $2)'},
  {asl: /msg ?\(([0-9a-zA-Z_."]+)\)/, js: 'msg($1)'},
  {asl: /picture ?\(([0-9a-zA-Z_."]+)\)/, js: 'picture($1)'},
  {asl: /\bfinish\b/, js: 'io.finish()'},
  {asl: /\.parent\b/g, js: '.loc'},
  {asl: / \=\> \{/, js: ' = function() {'},

  // Lists
  {asl: /list add ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, js: '$1.push($2)'},
  {asl: /list add ?\(([0-9a-zA-Z_.]+), ~\)/, js: '$1.push(~)'},
  {asl: /list remove ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, js: 'array.remove($1, $2)'},
  {asl: /FilterByAttribute ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, js: '$1.filter(el => el[$2] === $3)'},
  {asl: /FilterByNotAttribute ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, js: '$1.filter(el => el[$2] !== $3)'},
  {asl: /IndexOf ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, js: '$1.indexOf($2)'},
  {asl: /IndexOf ?\(([0-9a-zA-Z_."]+), ~\)/, js: '$1.indexOf(~)'},
  {asl: /([0-9a-zA-Z_.]+) = ListCombine ?(list1, list2)/, js: '$1 = list1.concat(list2)'},
  {asl: /ListContains ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, js: '$1.includes($2)'},
  {asl: /ListContains ?\(([0-9a-zA-Z_.]+), ~\)/, js: '$1.includes(~)'},
  {asl: /ListCompact/, js: '[...new Set(array)]'},
  {asl: /ListCount ?\(([0-9a-zA-Z_.]+)\)/, js: '$1.length'},
  {asl: /ListExclude ?\(([0-9a-zA-Z_.]+, [0-9a-zA-Z_.]+)/, js: 'array.subtract($1, $2)'},
  {asl: /([0-9a-zA-Z_.]+) = NewList ?()/, js: 'const $1 = []'},
  {asl: /([0-9a-zA-Z_.]+) = NewObjectList ?()/, js: 'const $1 = []'},
  {asl: /([0-9a-zA-Z_.]+) = NewStringList ?()/, js: 'const $1 = []'},
  {asl: /([0-9a-zA-Z_.]+) = ObjectListCompact ?()/, js: '[...new Set(array)]'},
  {asl: /(?:[a-zA-Z]*)ListItem ?\(([0-9a-zA-Z_.]+), ([0-9]+)\)/, js: '$1[$2]'},
  {asl: /(?:[a-zA-Z]*)ListItem ?\(([0-9a-zA-Z_.]+), ([a-zA-Z_][0-9a-zA-Z_.]*)\)/, js: '$1[$2]'},
  {asl: /StringListSort ?\(([0-9a-zA-Z_."]+)\)/, js: '$1.sort()'},

  // Dictionaries
  {asl: /dictionary add ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, js: '$1[$2] = $3'},
  {asl: /dictionary add ?\(([0-9a-zA-Z_.]+), ~, ([0-9a-zA-Z_.]+)\)/, js: '$1[~] = $2'},
  {asl: /dictionary add ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+), ~\)/, js: '$1[$2] = ~'},
  {asl: /dictionary add ?\(([0-9a-zA-Z_.]+), ~, ~\)/, js: '$1[~] = ~'},
  {asl: /dictionary remove ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_.]+)\)/, js: 'delete $1[$2]'},
  {asl: /dictionary remove ?\(([0-9a-zA-Z_."]+), ~\)/, js: 'delete $1.~'},
  {asl: /DictionaryAdd ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, js: '$1[$2] = $3'},
  {asl: /DictionaryAdd ?\(([0-9a-zA-Z_.]+), ~, ([0-9a-zA-Z_.]+)\)/, js: '$1[~] = $2'},
  {asl: /DictionaryAdd ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+), ~\)/, js: '$1[$2] = ~'},
  {asl: /DictionaryAdd ?\(([0-9a-zA-Z_.]+), ~, ~\)/, js: '$1[~] = ~'},
  {asl: /DictionaryContains ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, js: '$1.includes($2)'},
  {asl: /DictionaryContains ?\(([0-9a-zA-Z_.]+), ~\)/, js: '$1.includes(~)'},
  {asl: /DictionaryCount ?\(([0-9a-zA-Z_.]+)\)/, js: 'Object.keys($1).length'},
  {asl: /(?:[a-zA-Z]*)DictionaryItem ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, js: '$1[$2]'},
  {asl: /(?:[a-zA-Z]*)DictionaryItem ?\(([0-9a-zA-Z_.]+), ~\)/, js: '$1.~'},
  {asl: /DictionaryRemove ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, js: 'delete $1[$2]'},
  {asl: /DictionaryRemove ?\(([0-9a-zA-Z_.]+), ~\)/, js: 'delete $1.~'},
  {asl: /([0-9a-zA-Z_.]+) = New(?:[a-zA-Z]*)Dictionary ?()/, js: 'const $1 = {}'},
  {asl: /([0-9a-zA-Z_.]+) = QuickParams ?\(~, ([0-9a-zA-Z_."]+)\)/, js: 'const $1 = {~ => $2}'},

  // Strings
  {asl: /CapFirst ?\(([0-9a-zA-Z_."]+)\)/g, js: 'sentenceCase($1)'},
  {asl: /DisplayMoney ?\(([0-9a-zA-Z_."]+)\)/, js: 'displayMoney($1)'},
  {asl: /DisplayNumber ?\(([0-9a-zA-Z_."]+)\)/, js: 'displayNumber($1)'},
  {asl: /EndsWith ?\(([0-9a-zA-Z_."]+), ~\)/, js: '$1.endsWith(~)'},
  {asl: /FormatList ?\(([0-9a-zA-Z_."]+), ~, ~, ~\)/, js: 'formatList($1, {sep:~, lastJoiner:~, nothing:~})'},
  {asl: /Instr ?\(([0-9a-zA-Z_."]+), ~\)/, js: '$1.indexOf(~)'},
  {asl: /InstrRev ?\(([0-9a-zA-Z_."]+), ~\)/, js: '$1.lastIndexOf(~)'},
  {asl: /IsNumeric ?\(([0-9a-zA-Z_."]+)\)/, js: '!Number.isNaN($1)'},
  {asl: /IsRegexMatch ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, js: '$1.match($2)'},
  {asl: /Join ?\(([0-9a-zA-Z_."]+), ~\)/, js: '$1.join(~)'},
  {asl: /LCase ?\(([0-9a-zA-Z_."]+)\)/, js: '$1.toLowerCase()'},
  {asl: /LengthOf ?\(([0-9a-zA-Z_."]+)\)/, js: '$1.length'},
  {asl: /Mid ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, js: '$1.substr($2)'},
  {asl: /Mid ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, js: '$1.substr($2, $3)'},
  {asl: /PadString ?\(([0-9a-zA-Z_."]+), ~\)/, js: '$1.padStart(~)'},
  {asl: /ProcessText ?\(([0-9a-zA-Z_."]+)\)/, js: 'processText($1)'},
  {asl: /Replace ?\(([0-9a-zA-Z_."]+), ~, ~\)/, js: '$1.replace(~, ~)'},
  {asl: /Spaces ?\(([0-9a-zA-Z_."]+)\)/, js: 'spaces($1)'},
  {asl: /Split ?\(([0-9a-zA-Z_."]+), ~\)/, js: '$1.split(~)'},
  {asl: /StartsWith ?\(([0-9a-zA-Z_."]+), ~\)/, js: '$1.startsWith(~)'},
  {asl: /ToRoman ?\(([0-9a-zA-Z_."]+)\)/, js: 'toRoman($1)'},
  {asl: /ToWords ?\(([0-9a-zA-Z_."]+)\)/, js: 'toWords($1)'},
  {asl: /Trim ?\(([0-9a-zA-Z_."]+)\)/, js: '$1.trim()'},
  {asl: /UCase ?\(([0-9a-zA-Z_."]+)\)/, js: '$1.toUpperCase()'},
  
  // Random
  {asl: /DiceRoll ?\(([0-9a-zA-Z_."]+)\)/, js: 'random.dice($1)'},
  {asl: /GetRandomInt ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, js: 'random.int($1, $2)'},
  {asl: /PickOneObject ?\(([0-9a-zA-Z_."]+)\)/, js: 'random.fromArray($1)'},
  {asl: /PickOneString ?\(([0-9a-zA-Z_."]+)\)/, js: 'random.fromArray($1)'},
  {asl: /RandomChance ?\(([0-9a-zA-Z_."]+)\)/, js: 'random.chance($1)'},
  
  
  {asl: /OutputText ?\(([0-9a-zA-Z_."]+)\)/, js: 'msg($1)'},
  {asl: /OutputTextNoBr ?\(([0-9a-zA-Z_."]+)\)/, js: 'msg($1)'},
  {asl: /OutputTextRaw ?\(([0-9a-zA-Z_."]+)\)/, js: 'msg($1)'},
  {asl: /OutputTextRawNoBr ?\(([0-9a-zA-Z_."]+)\)/, js: 'msg($1)'},

  {asl: /Set(Alignment|BackgroundColour|BackgroundImage|BackgroundOpacity|FontName|FontSize|ForegroundColour|WebFontName)(.*)/, js: '// Set$1$2'},
  {asl: /TextFX_Typewriter ?\(([a-zA-Z_."]+), ([a-zA-Z_."]+)\)/, js: 'msg($1)  // Was Typewriter, time=$2'},
  {asl: /TextFX_Unscramble ?\(([a-zA-Z_."]+), ([a-zA-Z_."]+), ([a-zA-Z_."]+)\)/, js: 'msg($1)  // Was Unscramble, time=$2, reveal=$3'},

  {asl: /Conjugate ?\(([0-9a-zA-Z_."]+), ~\)/, js: 'conjugate($1, ~)'},
  {asl: /WriteVerb ?\(([0-9a-zA-Z_."]+), ~\)/, js: 'nounVerb($1, ~)'},
]
  
const tpReplacements = [
  {asl: /\{if ([a-zA-Z0-9]+)\.([a-zA-Z0-9]+) ?>= ?/, js: '{ifMoreThanOrEqual:$1:$2:'},
  {asl: /\{if ([a-zA-Z0-9]+)\.([a-zA-Z0-9]+) ?> ?/, js: '{ifMoreThan:$1:$2:'},
  {asl: /\{if ([a-zA-Z0-9]+)\.([a-zA-Z0-9]+) ?<= ?/, js: '{ifLessThanOrEqual:$1:$2:'},
  {asl: /\{if ([a-zA-Z0-9]+)\.([a-zA-Z0-9]+) ?< ?/, js: '{ifLessThan:$1:/2:'},
  {asl: /\{if not ([a-zA-Z0-9]+)\./, js: '{ifNot:$1:'},
  {asl: /\{if not /, js: '{ifNot:'},
  {asl: /\{if ([a-zA-Z0-9]+)\./, js: '{if:$1:'},
  //{asl: /\{if /, js: '{if:'},
  {asl: /\{notfirst:/, js: '{notOnce:'},
]


const q5 = ["look", "description",
  "beforefirstenter", "beforeenter", "enter", "firstenter", "onexit",
  "implementation_notes",
  "nomovement", "nomanipulation", "novision", "nosound", "novoice",
  "healedmsg",
  "alt",
]
const q6 = ["examine", "desc",
  "beforeFirstEnter", "beforeEnter", "afterEnter", "afterFirstEnter", "onExit",
  "notes",
  "nomovement", "nomanipulation", "novision", "nosound", "novoice",
  "healedmsg",
  "synonyms",
]


const convert_line = function(s, indent, objectList, variables) {
  s = s.slice(indent)
  
  // Start by handling strings. We do not want string touched
  const ary = s.split('"')
  let code
  const texts = []
  let count = 0
  let inString = false
  let continuation = false
  for (const el of ary) {
    if (inString) {
      if (continuation) {
        texts[texts.length - 1] += '"' + el
      }
      else {
        texts.push(el)
      }

      if (el.endsWith('\\')) {
        continuation = true
        inString = true
        //texts[texts.length - 1] = texts[texts.length - 1].slice(0, -1)
      }
      else {
        continuation = false
        inString = false
      }
    }
    else if (continuation) {
      log('here')
      texts[texts.length - 1] += '"' + el
    }
    else {
      if (code) {
        code += '~' + el
      }
      else {
        code = el
      }
      continuation = false
      inString = true
    }
  }
  
  // Do code substitutions
  for (const el of jsReplacements) {
    code = code.replace(el.asl, el.js)
  }
  
  // Do TP substituions
  const newtexts = []
  for (let s of texts) {
    for (const el of tpReplacements) {
      s = s.replace(el.asl, el.js)
    }
    newtexts.push(s)
  }
  
  // Change object names to w.
  for (const el of objectList) {
    code = code.replace(el.regex, el.w_name)
  }
  
  // equals
  if (code.match(/^\s*(else|if)/)) {
    code = code.replace(" = ", " === ")
    code = code.replace(" == ", " === ")
    code = code.replace(" != ", " !== ")
    code = code.replace(" <> ", " !== ")
  }
  
  // Any new variables here?
  const md = code.match(/ ([a-zA-Z_][a-zA-Z_0-9]*) = /)
  if (md && !variables.includes(md[1])) {
    code = code.replace(" " + md[1] + " =", " let " + md[1] + " =")
    variables.push(md[1])
  }

  // convert obj["name"] to obj.name
  code = code.replace(/\[\"([a-z][a-zA-Z0-9_]*)\"\]/, '.$1')
  
  while (newtexts.length > 0) {
    code = code.replace(JOINER, '"' + newtexts.shift() + '"')
  }
  
  return code
}



const convert_script = function(s, variables = [], indent) {
  const objectList = []
  for (const el of objects) {
    objectList.push({regex: /\b#{el.name}\b/, w_name: "w." + el.name, name: el.name })
  }

  const code = s.startsWith('<![CDATA[') ? s.substring(9, -1) : s
  const lines = ["function(" + variables.join(', ') + ") {", "    // CONVERTER: Check this code!!!"]
  let varFlag = false
  let inCase = false

  const sourceLines = code.split("\n")
  while (sourceLines[0].length === 0) sourceLines.shift()
  const firstIndent = sourceLines[0].search(/\S|$/)
  
  // We want line indenting to be indent for the function, so the lines of code want start from indent+2
  // They are already firstIndent so need to have spaces removed:
  const indent2 = firstIndent - indent - 2
  
  for (const line of sourceLines) {
    if (line.match(/^\s*$/)) continue
    
    if (line.endsWith("firsttime {")) {
      const spaces = line.length - 15
      lines.push(" " * spaces + "if (this.firstTimeFlag) {")
      lines.push(" " * spaces + "  this.firstTimeFlag = true")
    }
    else if (line.match(/case/)) {
      inCase = true
      lines.push(line.replace(/    case \((.*)\) {$/, 'case $1:'))
    }
    else if (line.match(/default/)) {
      inCase = true
      lines.push(line.replace(/    default {$/, 'default:'))
      }
    else if (inCase && line.match(/^\s*}$/)) {
    //p 'here'
      lines.push(line.replace('  }', 'break'))
      inCase = false
    }
    else {
      s = convert_line(line, indent2, objectList, variables)
      if (s) lines.push(s)
    }
  }
  lines.push(' '.repeat(indent) + '}')
  return lines.join("\n")
}
  



const objects = []
const functions = []
const commands = []
const settings = []
const styles = []
  

const matchesToArray = function(s) {
  const regex = RegExp("\"(.+?)\"", 'g')
  const ary = []
  let array1
  while ((array1 = regex.exec(s)) !== null) {
    ary.push(array1[1])
  }
  return ary
}


const handle_element = function(el) {
  const type = el.getAttribute("type").toString()
  if (!el.text) return false 
  text = el.text.startsWith('<![CDATA[') ? el.text.substring(9, -1) : el.text
  
  if (type == "script") {
    return {asl: text}
  }
  else {//text
    return "\"" + text.replace(/\"/g, "\\\"") + "\""
  }
}


const iterate = function(el, parent) {
  for (const thing of el.childNodes) {
    if (thing.nodeName === "#text") continue
    if (thing.tagName === "include") continue
    if (thing.tagName === "walkthrough") continue  // !!! todo
    if (thing.tagName === "turnscript") continue  // !!! todo

    const ary = matchesToArray(thing.outerHTML)
    
    if (thing.tagName === "game") {
      new Setting(thing, parent)
    }
    else if (thing.tagName === "command") {
      new Command(thing, parent)
    }
    else if (thing.tagName === "function") {
      new Function(thing)
    }
    else if (thing.tagName === "object") {
      new Obj(thing, parent)
    }
    else if (thing.tagName === "exit") {
      if (!parent.addExit) {
        log('No addExit for:')
        log(el)
        log(parent)
      }
      parent.addExit(thing)
    }
    else if (thing.tagName === "inherit") {
      const typeName = ary.shift()
      parent.templates.push(typeName)
    }
    else if (thing.tagName === "attr") {
      const tagName = ary.shift()
      convertType(parent, thing, tagName, ary[0] || 'string')
    }
    else if (q5.includes(thing.tagName)) {
      const index = q5.indexOf(thing.tagName)
      const tagName = q6[index]
      convertType(parent, thing, tagName, ary[0] || 'string')
    }
    else if (parent) {
      convertType(parent, thing, thing.tagName, ary[0] || 'string')
    }
    else {
      log("Unsupported type: " + thing.tagName)
      log(thing)
    }
  }
}

const iterateForExit = function(el, parent) {
  for (const thing of el.childNodes) {
    const ary = matchesToArray(thing.outerHTML)
    if (thing.nodeName === "#text") continue
    if (thing.tagName === "inherit") continue
    
    if (thing.tagName === "attr") {
      const tagName = ary.shift()
      convertType(parent, thing, tagName, ary[0] || 'string')
    }
    else if (q5.includes(thing.tagName)) {
      const index = q5.indexOf(thing.tagName)
      const tagName = q6[index]
      convertType(parent, thing, tagName, ary[0] || 'string')
    }
    else if (parent) {
      convertType(parent, thing, thing.tagName, ary[0] || 'string')
    }
    else {
      log("Unsupported type: " + thing.tagName)
      log(thing)
    }
  }
}

const convertType = function(parent, thing, tagName, type) {
  if (!thing.outerHTML) log(thing)
  if (thing.outerHTML.match(/\/\>/)) {
    parent[tagName] = true
  }
  else if (type.match(/int/)) {
    parent[tagName] = parseInt(thing.textContent)
  }
  else if (type.match(/boolean/)) {
    parent[tagName] = thing.textContent === 'true'
  }
  else if (type.match(/stringlist/)) {
    parent[tagName] = []
    for (const el of thing.childNodes) {
      parent[tagName].push(el.textContent)
    }
  }
  else if (type.match(/script/)) {
    parent[tagName] = { type:'script', value:thing.textContent }
  }
  else {
    parent[tagName] = thing.textContent.trim()
  }
}



function output(data) {
  objects.length = 0
  functions.length = 0
  commands.length = 0
  settings.length = 0
  styles.length = 0
  
  try {
    const parser = new DOMParser()
    const doc1 = parser.parseFromString(document.querySelector('#text-in').value, "application/xml")
    const things = doc1.childNodes[1].childNodes
    iterate(doc1.childNodes[1])


    let s = ''
    for (const el of data) s += el.to_js()
    document.querySelector('#comment').innerHTML = data.length > 0 ? data[0]._ : 'None found'
    document.querySelector('#text-out').value = s
  } catch(e) {
    if (document.querySelector('#text-in').value.length === 0) {
      document.querySelector('#comment').innerHTML = 'Hmm, something went wrong there. You do need to paste something into the upper box...'
    }
    if (document.querySelector('#text-in').value.length < 100) {
      document.querySelector('#comment').innerHTML = 'Hmm, something went wrong there. You do need to paste an actual Quest 5 game into the upper box rather than just random text...'
    }
    else {
      document.querySelector('#comment').innerHTML = 'Hmm, something went wrong there. Perhaps you missed part of it. You need everything from "<!--Saved by Quest " to "</asl>"'
    }
    log(e)
  }
}




class Setting {
  constructor(obj) {
    this.name = obj.getAttribute("name")
    this._ = 'This needs to go into the settings.js file. Delete everything that is currently there, and paste this in over the top. Only a selection of settings are copied over. If you have hyperlinks or use the map you will have to set that yourself.'
    iterate(obj, this)
    settings.push(this)
    styles.push(new Style(this))
  }

  to_js() {
    let s = '"use strict"\n\n'

    s += 'settings.title = "' + (this.name || 'Your name') + '",\n'
    if (this.subtitle)s += 'settings.subtitle = "' + this.subtitle + '",\n'
    s += 'settings.author = "' + (this.author || 'Your name') + '",\n'
    s += 'settings.version = "0.1"\n'
    s += 'settings.thanks = []\n'
    s += 'settings.warnings = "No warnings have been set for this game."\n'
    s += 'settings.playMode = "dev"\n\n'

    if (this.description) {
      s += "// NOTE: QuestJS does not use the description; this is copied over to preserve the text but will need to be manually added to the site you uploads your game to. Got to be honest, not many settings are transferred over and the font may need checking."
      s += "settings.description = " + this.description + "\n"
    }
    if (this.start) {
      s += "settings.setup = script:"
      s += convert_script("      " + this.start.value, [], 0)
      s += ",\n\n"
    }
    s += "settings.panes = " + (this.showpanes ? 'right' : 'none') + "\n"
    s += "settings.textInput = " + this.showcommandbar + "\n"
    return s
  }
}



class Style {
  constructor(setting) {
    this.setting = setting
    this._ = 'This needs to go into the style.css file which is empty by default. Only a selection of settings are copied over.'
  }

  to_js() {
    let s = ''

    if (this.setting.defaultwebfont) s += "@import url('https://fonts.googleapis.com/css2?family=" + this.setting.defaultwebfont + "&display=swap');\n\n"

    
    s += 'body {\n'
    if (this.setting.defaultwebfont) s += '  font-family:' + this.setting.defaultwebfont + ';\n'
    if (this.setting.defaultforeground) s += '  color:' + this.setting.defaultforeground + ';\n'
    if (this.setting.defaultbackground) s += '  background-color:' + this.setting.defaultforeground + ';\n'

    s += '}'
    return s
  }
}



class Command {
  constructor(obj) {
    this.name = obj.getAttribute("name").toString().replace(/ /g, '_').replace(/\W/g, '')
    iterate(obj, this)
    if (this.pattern.match('#object')) {
      this.pattern = this.pattern.replace(/#object\d?#/g, '(.+)').replace(/;/g, '|')
      this.hasObjectInPattern
    }
    this.pattern = this.pattern.replace(/;/g, '|')
    this.pattern = this.pattern.replace(/\?/g, '\\?')
    this._ = 'Paste this into the code.js file, together with the functions. If there is nothing here, then you have no custom commands. Check each script; Quest 5 usually uses "object" as the variable, you will probably need to change that to objects[0][0] or add "const object = objects[0][0]" at the top of the script.'
    commands.push(this)
  }

  to_js() {
    let s = "\n\nnew Cmd('" + this.name + "', {\n"
    s += "  // CONVERTER: Check this!!!\n"
    s += "  regex:/(?:" + this.pattern + ")"
    if (this.hasObjectInPattern) s += " (.+)"
    s += "$/,\n"
    s += "  objects:[\n"
    s += "    {scope:parser.isHere},\n"
    s += "  ],\n"
    s += "  script:"
    s += convert_script("      " + this.script, ['objects'], 2)
    s += ",\n"
    s += "})"
    return s
  }
}



// need to extrtact type, params attribute plus content
class Function {
  constructor(obj) {
    this.name = obj.getAttribute("name").toString().replace(/ /g, '_').replace(/\W/g, '')
    const paramStr = obj.getAttribute("parameters")
    this.params = paramStr ? paramStr.toString().split(', ') : []
    this.script = obj.textContent
    this._ = 'Paste this into the code.js file, together with the commands. If there is nothing here, then you have no custom functions. I would advise checking the code in each function.'
    functions.push(this)
  }

  to_js(objects) {
    return "\n\nconst " + this.name + " = " + convert_script(this.script, this.params, 0)// + "}"
  }
}

//const typelist = []

class Obj {

  // obj is an XML object
  constructor(obj, parent) {
    this.name = obj.getAttribute("name").toString().replace(/ /g, '_').replace(/\W/g, '')
    this.templates = []
    iterate(obj, this)
    objects.push(this)
    this._ = 'Paste this into the data.js file, but first delete the two default objects - everything except the first line. All the values should be transferred across, even if they make no sense in QuestJS.'
  }
  
  addExit(exit) {
    const regex = RegExp('\"(.+?)\"', 'g');
    const dir = regex.exec(exit.outerHTML)[1]
    const to = regex.exec(exit.outerHTML)[1]
    this[dir] = {type:'exit', to:to}
    iterateForExit(exit, this[dir])
  }
  
  inside() {
    this.inside = true
  }

  to_js(objects) {
    let s = ""
    if (this.templates.includes("editor_room")) {
      s += "createRoom(\"" + this.name + "\","
    }
    else {
      s += "createItem(\"" + this.name + "\","
    }
    if (this.templates.includes("namedmale") || this.templates.includes("male")) {
      s += " NPC(false),"
    }
    if (this.templates.includes("namedfemale") || this.templates.includes("female")) {
      s += " NPC(true),"
    }
    if (this.templates.includes("startingtopic")) {
      s += " TOPIC(true),"
    }
    else if (this.templates.includes("topic")) {
      s += " TOPIC(),"
    }
    if (this.templates.includes("editor_player")) {
      s += " PLAYER(),"
    }
    if (this.templates.includes("surface")) {
      s += " SURFACE(),"
    }
    if (this.templates.includes("container")) {
      s += " CONTAINER(),"
    }

    if (this.templates.includes("lastingspell")) {
      s += " LASTING_SPELL(),"
    }
    if (this.templates.includes("nonattackspell")) {
      s += " INSTANT_SPELL(),"
    }
    if (this.templates.includes("spell")) {
      s += " SPELL,"
    }

    if (this.templates.includes("weapon")) {
      s += " WEAPON(),"
    }

    if (this.templates.includes("monster")) {
      s += " MULTI_MONSTER(),"
    }
    if (this.templates.includes("monster")) {
      s += " MONSTER(),"
    }
    if (this.templates.includes("monster")) {
      s += " MONSTER_ATTACK(),"
    }
    
    s += " {\n"
    
    if (this.templates.includes("plural")) s += "  pronouns:lang.pronouns.plural,\n"
    
    for (const key in this) {
      if (['templates', 'name', '_'].includes(key)) continue
      if (key.startsWith('feature_')) continue
      s += "  " + key + ":"
      if (typeof this[key] === 'string') {
        s += '"' + this[key] + '",\n'
      }
      else if (Array.isArray(this[key])) {
        s += '[\n'
        for (const el of this[key]) {
          if (el.match(/\w/)) s += '    "' + el + '",\n'
        }
        s += '  ],\n'
      }
      else if (typeof this[key] !== 'object') {
        s += this[key] + ",\n"
      }
      else if (this[key].type === 'script') {
        s += convert_script(this[key].value, [], 2)
        s += ",\n"
      }
      else if (this[key].type === 'exit') {
        s += "new Exit(\"" + this[key].to + "\"),\n"
      }
      else {
        log('unknown object')
        log(this[key])
      }
    }
    s += "})\n\n\n"
    return s
  }
}



