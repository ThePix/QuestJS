"use strict";

//@DOC
// ## Parser Functions
//
// Most of these are only for internal use! See here details of how it all works.
// https://github.com/ThePix/QuestJS/wiki/The-Parser#technical-notes
//
//@UNDOC




const parser = {};

parser.currentCommand;
// Stores the current values for it, him, etc.
parser.pronouns = {}
parser.specialText = {}
parser.debug = false
parser.BAD_SPECIAL = -4
parser.DISALLOWED_MULTIPLE = -3
parser.NO_MATCH = -2
parser.NO_OBJECT = -1


//@DOC
// The "parse" function should be sent either the text the player typed or null.
// If sent null it will continue to work with the current values in currentCommand.
// This allows us to keep trying to process a single command until all the
//  disambiguations have been resolved.
parser.parse = function(inputText) {

  // This allows the command system to be temporarily overriden,
  // say if the game asks a question
  if (parser.override) {
    parser.msg("Parser overriden");
    parser.override(inputText)
    delete parser.override
    return
  }

  parser.inputTexts = inputText.split(lang.command_split_regex)
  while (parser.inputTexts.length > 0) {
    parser.parseSingle(parser.inputTexts.shift())
  }
}

parser.abort = function() {
  if (parser.inputTexts.length === 0) return
  parsermsg("Abandoning later commands: " + parser.inputTexts.join('; '))
  parser.inputTexts = []
}

parser.parseSingle = function(inputText) {
  parser.msg("Input string: " + inputText);
  
  if (inputText) {
    const res = parser.convertInputTextToCommandCandidate(inputText)
    if (typeof res === "string") {
      parsermsg(res)
      parser.abort()
      world.endTurn(world.PARSER_FAILURE)
      return
    }
    if (res.score < 0) {
      parsermsg(res.error)
      parser.abort()
      world.endTurn(world.PARSER_FAILURE)
      return
    }
    parser.currentCommand = res;
  }
  
  // Need to disambiguate, until each of the lowest level lists has exactly one member
  let needToDisAmbigFlag = false
  for (let i = 0; i < parser.currentCommand.objects.length; i++) {
    if (!Array.isArray(parser.currentCommand.objects[i])) continue
    for (let j = 0; j < parser.currentCommand.objects[i].length; j++) {
      if (parser.currentCommand.objects[i][j] instanceof Array) {
        if (parser.currentCommand.objects[i][j].length === 1) {
          parser.currentCommand.objects[i][j] = parser.currentCommand.objects[i][j][0];
        }
        else {
          needToDisAmbigFlag = true;
          parser.currentCommand.disambiguate1 = i;
          parser.currentCommand.disambiguate2 = j;
          const fn = io.menuFunctions[settings.funcForDisambigMenu]
          fn(lang.disambig_msg, parser.currentCommand.objects[i][j], function(result) {
            parser.currentCommand.objects[parser.currentCommand.disambiguate1][parser.currentCommand.disambiguate2] = result
            parser.parseSingle(null)
          }, function(input) {
            parser.parse(input)
          });
        }
      }
    }
  }
  
  if (!needToDisAmbigFlag) {
    parser.execute();
  }
};

//@DOC
// You can use this to bypass the parser altogether, for the next input the player types.
// Instead, the given function will be used, sent the text the player typed.
//
// Used by askQuestion in io.
parser.overrideWith = function(fn) {
  parser.override = fn
}


// Do it!
parser.execute = function() {
  parser.inspect();
  let inEndTurnFlag = false
  try {
    // save objects for pronouns
    if (parser.currentCommand.objects.length > 0 && Array.isArray(parser.currentCommand.objects[0]) && !parser.currentCommand.all) {
      for (let obj of parser.currentCommand.objects[0]) {
        parser.pronouns[obj.pronouns.objective] = obj
      }
    }
    const outcome = parser.currentCommand.cmd.script(parser.currentCommand.objects, parser.currentCommand.matches)
    inEndTurnFlag = true
    world.endTurn(outcome)
  } catch (err) {
    if (inEndTurnFlag) {
      console.error("Hit a coding error trying to process world.endTurn after that command.")
    }
    else {
      console.error("Hit a coding error trying to process the command `" + parser.currentCommand.cmdString + "'.")
    }
    console.log('Look through the trace below to find the offending code. It is probably the first entry in the list, but may not be.')
    console.log(err)
    io.print({tag:'p', cssClass:"error", text:lang.error})
  }
};   


// This will return a dictionary, with these keys:
// .inputString    the initial string
// .cmdString      the sanitised string
// .cmd            the matched command object
// .objects        a list (of a list of a list), one member per capture group in the command regex
// .objects[0]     a list (of a list), one member per object name given by the player for capture group 0
// .objects[0][0]  a list of possible object matches for each object name given by the player for the
//                      first object name in capture group 0
parser.convertInputTextToCommandCandidate = function(inputText) {
  
  // remove multiple spaces, and any from the ends
  let cmdString = inputText.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // convert numbers in words to digits
  if (settings.convertNumbersInParser) {
    cmdString = lang.convertNumbers(cmdString);
  }
  
  // Get a list of candidate commands that match the regex
  const candidates = []
  for (const el of commands) {
    if (!Array.isArray(el.regexes)) console.log(el)  // it will crash in the next line!
    for (let regex of el.regexes) {
      if (regex instanceof RegExp) {
        if (regex.test(cmdString)) candidates.push({cmd:el, regex:regex, mod:{}})
      }
      else {
        if (regex.regex.test(cmdString)) candidates.push({cmd:el, regex:regex.regex, mod:regex.mod})
      }
    }
  }    
  
  if (candidates.length === 0) {
    return lang.not_known_msg;
  }
  parser.msg("Number of commands that have a regex match:" + candidates.length)

  // We now want to match potential objects
  // This will help us narrow down the candidates (maybe)
  // matchedCandidates is an array of dictionaries,
  // each one containing a command and some matched objects if applicable
  let error = lang.general_obj_error;
  const matchedCandidates = [];
  
  for (const el of candidates) {
    // matchItemsToCmd will attempt to fit the objects, returns a dictionary if successful
    // or an error message otherwise. Could have more than one object,
    // either because multiple were specified or because it was ambiguous (or both)
    // We just keep the last error message as hopefully the most relevant.
    // NB: Inside function so cannot use 'this'
    parser.msg("* Looking at candidate: " + el.cmd.name);
    const res = parser.matchItemsToCmd(cmdString, el)
    if (!res) {
      parser.msg("No result!");
      error = "Res is " + res;
      return error
    }
    parser.msg("Result score is: " + res.score);
    if (res.score < 0) {
      error = res.error;
    }
    else {
      parser.msg("Candidate accepted!");
      matchedCandidates.push(res);
    }
  }
  
  parser.msg("Number of candidates accepted: " + matchedCandidates.length);
  if (matchedCandidates.length === 0) {
    parser.msg("No matches, returning error: " + error);
    return error;
  }
  // pick between matchedCandidates based on score
  let command = matchedCandidates[0];
  if (matchedCandidates.length > 1) {
    parser.msg("Need to pick just one; start with the first (score " + command.score + ").");
    for (let candidate of matchedCandidates) {
      // give preference to earlier commands
      if (command.score < candidate.score) {
        parser.msg("This one is better:" + command.cmd.name + " (score " + candidate.score + ")");
        command = candidate;
      }
    }
  }
  if (!command) console.log(inputText)
  command.string = inputText;
  command.cmdString = cmdString;
  parser.msg("This is the one:" + command.cmd.name);
  return command;
};



// We want to see if this command is a good match to the string
// This will involve trying to matching objects, according to the
// values in the command
// Returns a dictionary containing:
// cmd - the command
// objectTexts - the matched object names from the player input
// objects - the matched objects (lists of lists ready to be disabiguated)
// score - a rating of how good the match is
// error - a string to report why it failed, if it did!
//
// objects will be an array for each object role (so PUT HAT IN BOX is two),
// of arrays for each object listed (so GET HAT, TEAPOT AND GUN is three),
// of possible object matches (so GET HAT is four if there are four hats in the room)
//
// The parameter mod allows us to change how this is done, eg if the nouns are reversed
parser.matchItemsToCmd = function(s, candidate) {
  const cmd = candidate.cmd
  const res = {
    cmd:cmd,
    objectTexts:[],
    objects:[],
    score:cmd.score ? cmd.score : 10,
  }
  
  // Array of item positions corresponding to capture groups in the regex
  let arr = candidate.regex.exec(s)
  arr.shift()  // first element is the whole match, so discard
  if (candidate.mod.reverse) arr = arr.reverse()
  if (candidate.mod.func) arr = candidate.mod.func(arr)
  
  const fallbackScope = parser.scope(parser.isVisible)
  
  parser.msg("..Base score: " + res.score);

  for (let i = 0; i < arr.length; i++) {
    const cmdParams = cmd.objects[i]
    if (!cmdParams) {
      errormsg("That command seems to have an error. It has more capture groups than there are elements in the 'objects' attribute.");
      return false;
    }
//    if (cmdParams.ignore) {
      // this capture group has been flagged to be ignored
//      continue;
//    }
    let score = 0;
    res.objectTexts.push(arr[i])
    
    if (cmdParams.special) {
      // this capture group has been flagged to be special
      const specialError = parser.specialText[cmdParams.special].error(arr[i], cmdParams)
      if (!specialError) {
        const special = parser.specialText[cmdParams.special].exec(arr[i], cmdParams)
        if (special !== false) res.objects.push(special)
        score = 1
      }
      else {
        res.error = specialError 
        res.score = parser.BAD_SPECIAL 
      }
    }
    
    else if (lang.all_regex.test(arr[i]) || lang.all_exclude_regex.test(arr[i])) {
      // Handle ALL and ALL BUT
      res.all = true
      if (!cmdParams.multiple) {
        res.error = lang.no_multiples_msg;
        res.score = parser.DISALLOWED_MULTIPLE;
        return
      }

      if (!cmdParams.scope) console.log("WARNING: Command without scope - " + cmd.name)
      
      let scope = parser.getScope(cmdParams, fallbackScope)
      let exclude = [game.player];
      
      // anything flagged as scenery should be excluded
      for (let item of scope) {
        if (item.scenery || item.excludeFromAll) {
          exclude.push(item);
        }
      }
      
      if (lang.all_exclude_regex.test(arr[i])) {
        // if this is ALL BUT we need to remove some things from the list
        // excludes must be in isVisible
        // if it is ambiguous or not recognised it does not get added to the list
        let s = arr[i].replace(all_exclude_regex, "").trim();
        const objectNames = s.split(joiner_regex).map(function(el){ return el.trim(); });
        for (let s in objectNames) {
          items = parser.findInList(s, fallbackScope);
          if (items.length === 1) {
            exclude.push(items[0]);
          }
        }
      }
      scope = scope.filter(function(el) { return !exclude.includes(el); });
      if (scope.length > 1 && !cmdParams.multiple) {
        res.error = lang.no_multiples_msg;
        res.score = -1;
        return res;
      }
      if (scope.length === 0) {
        res.error = cmd.nothingForAll ? cmd.nothingForAll : lang.nothing_msg;
        res.score = -1;
        return res;
      }
      score = 2;
      res.objects.push(scope.map(function(el) { return [el]; }))
    }
    
    else {
      if (!cmdParams.scope) {
        console.warning("No scope found in command. This may be because the scope specified does not exist; check the spelling. The command in question is:")
        log(cmd)
        return null
      }
      const scope = parser.getScopes(cmdParams, fallbackScope)
      parser.matchToNames(arr[i], scope, cmdParams, res)
      if (res.score === parser.NO_MATCH) return null
      if (res.score === parser.NO_OBJECT) {
        res.error = cmd.noobjecterror(res.error_s, i)
        return res
      }
    }
    parser.msg("...Adding to the score: " + score);
    res.score += score;
  }
  return res;
};





parser.matchToNames = function(s, scopes, cmdParams, res) {
  // Within this item position, break the substring into each item section
  // For PUT HAT, CUP IN BOX, the first will be ['hat', 'cup']
  const objectNames = s.split(lang.joiner_regex).map(function(el){ return el.trim() })
  
  let objectWordList = [], score = 0
  for (let s of objectNames) {
    const n = parser.matchToName(lang.article_filter_regex.exec(s)[1], scopes, cmdParams, objectWordList)
    if (n < 0) {
      res.score = n
      res.error_s = s
      return
    }
    if (n > score) score = n
  }

  if (objectWordList.length > 1 && !cmdParams.multiple) {
    res.error = lang.no_multiples_msg;
    res.score = parser.DISALLOWED_MULTIPLE;
    return
  }

  res.objects.push(objectWordList)
  res.score += score;
  return
}  




// Want to match items from scopes to this string fragment s
// matches will go in objectWordList and matches, the score is returned
// objectWordList is a list of lists of objects and corresponds to an item name typed by the user
parser.matchToName = function(s, scopes, cmdParams, objectWordList) {
  // objDisambigList is a list of objects that are in the given scope(s) and match the string fragment
  let [objDisambigList, n] = this.findInScope(s, scopes, cmdParams)
  if (n === 0) return parser.NO_OBJECT

  // So create a new list that will contain objects in objDisambigList not already in objectWordList
  // This can happen for an object like "Ham and cheese sandwich", which will be split up
  // as "ham" and "cheese sandwich"
  const objDisambigList2 = []
  // Go though objDisambigList
  for (const el of objDisambigList) {
    let flag = false
    for (const el1 of objectWordList) {
      for (const el2 of el1) {
        if (el2.name === el.name) flag = true
      }
    }
    if (flag) {
      parser.msg("..Skipping duplicate: " + el.name)
    }
    else {
      objDisambigList2.push(el)
    }
  }
  if (objDisambigList2.length > 0) objectWordList.push(objDisambigList2)
  return n

}          


// Tries to match objects to the given string
// It will return a list of matching objects (to be disambiguated if more than 1),
// plus the score, depending on which list the object(s) was found in
// (if there are three lists, the score will be 3 if found in the first list, 2 in the second,
// or 1 if in the third list).
// If not found the score will be 0, and an empty array returned.
parser.findInScope = function(s, scopes, cmdParams) {
  parser.msg("Now matching: " + s)
  // First handle IT etc.
  for (const key in lang.pronouns) {
    if (s === lang.pronouns[key].objective && parser.pronouns[lang.pronouns[key].objective]) {
      return [[parser.pronouns[lang.pronouns[key].objective]], 1];
    }
  }
      
  for (let i = 0; i < scopes.length; i++) {
    parser.msg("..Looking for a match for: " + s + " (scope " + (i + 1) + ")")
    const objList = this.findInList(s, scopes[i], cmdParams);
    if (objList.length > 0) {
      return [objList, scopes.length - i];
    }
  }
  return [[], 0];
};



// Tries to match an object to the given string
// But if there are more than 1 with the same score, it returns them all
// s is the string to match
// list is an array of items to match again
parser.findInList = function(s, list, cmdParams) {
  let res = [];
  let score = 0;
  let n;
  for (let item of list) {
    //log(item)
    parser.msg("-> Considering: " + item.name)
    n = this.scoreObjectMatch(s, item, cmdParams);
    if (n >=0 ) parser.msg(item.name + " scores " + n)
    if (n > score) {
      res = [];
      score = n;
    }
    if (n >= score) {
      res.push(item);
    }
  }
  parser.msg(res.length > 1 ? "Cannot decide between: " + res.map(el => el.name).join(", ") : (res.length === 1 ? "..Going with: " + res[0].name : "Found no suitable objects"))
  return res
}



// Override to skip quotes in aliases
parser.itemSetup = function(item) {
  item.parserOptionsSet = true;
  item.parserItemName = item.alias.toLowerCase();
  item.parserItemNameParts = array.combos(item.parserItemName.split(' '))
  if (item.pattern) {
    if (!item.regex) item.regex = new RegExp("^(" + item.pattern + ")$") 
    if (!item.parserAltNames) item.parserAltNames = item.pattern.split('|');
  }
  if (item.parserAltNames) {
    if (!Array.isArray(item.parserAltNames)) throw 'Expected "parserAltNames" to be an array for ' + item.name
    item.parserAltNames.forEach(function (el) {
      if (el.includes(' ')) {
        item.parserItemNameParts = item.parserItemNameParts.concat(el.split(' '))
      }
    })
  }
}

parser.scoreObjectMatch = function(s, item, cmdParams) {
  if (!item.parserOptionsSet) parser.itemSetup(item)
  const itemName = item.alias.toLowerCase();
  let res = -1;
  if (cmdParams.items && cmdParams.items.includes(item.name)) {
    // does this pay any attention to what the player typed????
    parser.msg('The command specifically mentions this item, so highest priority, score 100')
    res = 100;
  }
  else if (s === item.parserItemName) {
    parser.msg('The player has used the exact alias, score 60')
    res = 60;
  }
  else if (item.regex && item.regex.test(s)) {
    parser.msg('The player has used the exact string allowed in the regex, score 55')
    parser.msg('' + item.regex)
    parser.msg('>' + s + '<')
    res = 55;
  }
  else if (item.parserItemNameParts && item.parserItemNameParts.some(function(el) { return el === s})) {
    parser.msg('The player has matched a complete word, but not the full phrase, score 50')
    res = 50;
  }
  else if (item.parserItemName.startsWith(s)) {
    parser.msg('the player has used a string that matches the start of the alias, score length + 15')
    res = s.length + 15;
  }
  else if (item.parserAltNames && item.parserAltNames.some(function(el) { return el.startsWith(s)})) {
    parser.msg('the player has used a string that matches the start of an alt name, score length + 10')
    res = s.length + 10;
  }
  else if (item.parserItemNameParts && item.parserItemNameParts.some(function(el) { return el.startsWith(s)})) {
    parser.msg('the player has used a string that matches the start of an alt name, score length')
    res = s.length;
  }
  else {
    return -1;
  }

  if (item[cmdParams.attName]) {
    parser.msg('bonus 20 as item has attribute ' + cmdParams.attName)
    res += 20;
  }
  if (item.parsePriority) {
    parser.msg('item.parsePriority is ' + item.parsePriority)
    res += item.parsePriority;
  }


  // note what we matched against in case a command wants to use it later
  // This is a little risky as at this point it is only a suggestion,
  // but I cannot think of a situation where it would fail.
  // Used by COUNTABLE
  item.cmdMatch = s;
  return res;
};













// For debugging only
// Prints details about the parser.currentCommand so you can
// see what the parser has made of the player's input
parser.inspect = function() {
  if (!parser.debug) return;
  
  let s = "PARSER RESULT:<br/>";
  s += "Input text: " + parser.currentCommand.string + "<br/>";
  s += "Matched command: " + parser.currentCommand.cmd.name + "<br/>";
  s += "Matched regex: " + parser.currentCommand.cmd.regex + "<br/>";
  s += "Match score: " + parser.currentCommand.score + "<br/>";
  if (parser.currentCommand.all) { s += "Player typed ALL<br/>"; }
  s += "Objects/texts (" + parser.currentCommand.objects.length + "):" + "<br/>";
  for (let obj of parser.currentCommand.objects) {
    if (typeof obj === "string") {
      s += "&nbsp;&nbsp;&nbsp;&nbsp;Text: " + obj + "<br/>";
    }
    else if (Array.isArray(obj)) {
      s += "&nbsp;&nbsp;&nbsp;&nbsp;Objects:" + obj.map(function(el) { return el.name; }).join(", ") + "<br/>";
    }
    else if (obj.name) {
      s += "&nbsp;&nbsp;&nbsp;&nbsp;Something called :" + obj + "<br/>";
    }
    else {
      s += "&nbsp;&nbsp;&nbsp;&nbsp;Something else:" + obj + "<br/>";
    }
  }
  debugmsg(s);
};

parser.specialText.ignore = {
  error:function(text) {
    return false
  },
  exec:function(text) {
    return false
  },
}

parser.specialText.text = {
  error:function(text) {
    return false
  },
  exec:function(text) {
    //log(text)
    return text
  },
}

parser.specialText.fluid = {
  error:function(text) {
    if (settings.fluids.includes(text)) return false
    return processText(lang.not_a_fluid_here, {text:text})
  },
  exec:function(text) {
    return text
  },
}

parser.msg = function(...ary) {
  if (parser.debug) {
    for (let s of ary) debugmsg("P&gt; " + s)
  }
}

// One scope for ALL
parser.getScope = function(cmdParams, fallbackScope) {
  if (!cmdParams.scope) {
    console.log("WARNING: No scope (or scope not found) in command")
    return fallbackScope
  }
  
  const scope = parser.scope(cmdParams.allScope ? cmdParams.allScope : cmdParams.scope)
  //console.log(scope)
  return scope
}

// Multiple scopes when not ALL
parser.getScopes = function(cmdParams, fallbackScope) {
  const baseScope = parser.scope(cmdParams.scope)
  const scopes = [baseScope, fallbackScope]
  //console.log(scopes)
  return scopes
}  
  
  

parser.scope = function(fn, options) {
  const list = [];
  for (let key in w) {
    if (fn(w[key], options)) {
      list.push(w[key]);
    }
  }
  return list;
}


// This set is used in the objects attribute of commands
// The "is" functions are for looking at a specific place

// Anywhere in the world
parser.isInWorld = function(item) {
  return true;
}
// Anywhere in the world
parser.isReachable = function(item) {
  return item.scopeStatus === world.REACHABLE && world.ifNotDark(item);
}
// Anywhere in the location (used by the parser for the fallback)
parser.isVisible = function(item) {
  return item.scopeStatus && world.ifNotDark(item);
}
// Held or here, but not in a container
parser.isPresent = function(item) {
  return parser.isHere(item) || parser.isHeld(item);
}
// Used by examine, so the player can X ME, even if something called metalhead is here.
parser.isPresentOrMe = function(item) {
  return parser.isHere(item) || parser.isHeld(item) || item === game.player;
}
// ... but not in a container
parser.isHeldNotWorn = function(item) {
  return item.isAtLoc(game.player.name, world.PARSER) && world.ifNotDark(item) && !item.getWorn();
}
parser.isHeld = function(item) {
  return item.isAtLoc(game.player.name, world.PARSER) && world.ifNotDark(item);
}
parser.isHeldByNpc = function(item) {
  const npcs = parser.scope(parser.isReachable).filter(el => el.npc);
  for (let npc of npcs) {
    if (item.isAtLoc(npc.name, world.PARSER)) return true;
  }
  return false;
}
parser.isWorn = function(item) {
  return item.isAtLoc(game.player.name, world.PARSER) && world.ifNotDark(item) && item.getWorn();
}
parser.isWornByNpc = function(item) {
  const npcs = parser.scope(parser.isReachable).filter(el => el.npc);
  for (let npc of npcs) {
    if (item.isAtLoc(npc.name, world.PARSER) && item.getWorn()) return true;
  }
  return false;
}

parser.isNpcOrHere = function(item) {
  return (item.isAtLoc(game.player.loc, world.PARSER) && world.ifNotDark(item)) || item.npc || item.player;
}
parser.isNpcAndHere = function(item) {
  return item.isAtLoc(game.player.loc, world.PARSER) && (item.npc || item.player);
}
parser.isHere = function(item) {
  return item.isAtLoc(game.player.loc, world.PARSER) && world.ifNotDark(item);
}

parser.isForSale = function(item) {
  return item.isForSale && item.isForSale(game.player.loc) && world.ifNotDark(item);
}

//parser.isInside = function(item, options) {
//  return item.isAtLoc(options.container.name, world.PARSER) && world.ifNotDark(item);
//}

//parser.isRoom = function(item) {
//  return item.room;
//}

// Is in a container that is reachable
parser.isContained = function(item) {
  const containers = parser.scope(parser.isReachable).filter(el => el.container);
  for (let container of containers) {
    if (container.closed) continue;
    if (item.isAtLoc(container.name, world.PARSER)) return true;
  }
  return false;
}
// Is in a container that is reachable, not held by player
parser.isLocationContained = function(item) {
  const containers = parser.scope(parser.isReachable).filter(el => el.container)
  for (let container of containers) {
    if (container.closed) continue
    if (container.isUltimatelyHeldBy(game.player)) continue
    if (item.isAtLoc(container.name, world.PARSER)) return true
  }
  return false;
}
// In this location, or in a container (used by TAKE)
parser.isHereOrContained = function(item) {
  if (parser.isHere(item)) return true;
  if (parser.isContained(item)) return true;
  return false;
}
// In this location, or in a container not held by the player (used by TAKE ALL)
parser.isHereOrLocationContained = function(item) {
  if (parser.isHere(item)) return true;
  if (parser.isLocationContained(item)) return true;
  return false;
}

