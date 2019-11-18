// NOTES AND LIMITATIONS
// This can only handle single commands
// Lists of multiple objects must be separated by JOINER_REGEX (i.e., "and" or comma)
// Item names cannot include the word "and" or commas
// Commands look in their specified scope first, then isVisible as the fallback.
// It will try to match the beginning of a word to the object name given.
//    If the player does GET H, then it will disambiguate between any objects beginning with H
// A match is scored by whether the objects are in the right place (+2), wrong place but here (+1).
// You can also give a command a score attribute to boost (or reduce) its success.

// Should all be language neutral (except the inspect function, which is just for debugging)


"use strict";

const parser = {};

  parser.currentCommand;
  // Stores the current values for it, him, etc.
  // put hat in box
  // x it
  parser.pronouns = {};
  parser.debug = false;

  // The "parse" function should be sent either the text the player typed or null.
  // If sent null it will continue to work with the current values in currentCommand.
  // This allows us to keep trying to process a single command until all the
  //  disambiguations have been resolved.
  parser.parse = function(inputText) {
    parser.msg("Input string: " + inputText);
    if (inputText) {
      const res = parser.convertInputTextToCommandCandidate(inputText);
      if (typeof res === "string") {
        parsermsg(res);
        world.endTurn(PARSER_FAILURE);
        return;
      }
      parser.currentCommand = res;
    }

    // Need to disambiguate, until each of the lowest level lists has exactly one member
    let flag = false;
    for (let i = 0; i < parser.currentCommand.objects.length; i++) {
      for (let j = 0; j < parser.currentCommand.objects[i].length; j++) {
        if (parser.currentCommand.objects[i][j] instanceof Array) {
          if (parser.currentCommand.objects[i][j].length === 1) {
            parser.currentCommand.objects[i][j] = parser.currentCommand.objects[i][j][0];
          }
          else {
            flag = true;
            parser.currentCommand.disambiguate1 = i;
            parser.currentCommand.disambiguate2 = j;
            showMenu(DISAMBIG_MSG, parser.currentCommand.objects[i][j], function(result) {
              parser.currentCommand.objects[parser.currentCommand.disambiguate1][parser.currentCommand.disambiguate2] = result;
              parser.parse(null);
            });
          }
        }
      }
    }
    if (!flag) {
      parser.execute();
    }
  };
  
  // You can use this to bypass all the text matching when you know what the object and command are
  // Used by the panes when the player clicks on a verb for an item
  parser.quickCmd = function(cmd, item) {
    parser.msg("quickCmd: " + cmd.name)
    parser.currentCommand = {
      cmdString:(item ? cmd.name + " " + item.name : cmd.name),
      cmd:cmd,
      objects:(item ? [[item]] : []),
      matches:(item ? [[item.alias]] : []),
    };
    parser.execute();
  };

  // Do it!
  parser.execute = function() {
    parser.inspect();
    
    if (parser.currentCommand.objects.length > 0 && typeof parser.currentCommand.objects[0] === "object") {
      for (let i = 0; i < parser.currentCommand.objects[0].length; i++) {
        parser.pronouns[parser.currentCommand.objects[0][i].pronouns.objective] = parser.currentCommand.objects[0][i];
      }
    }
    const outcome = parser.currentCommand.cmd.script(parser.currentCommand.objects, parser.currentCommand.matches);
    world.endTurn(outcome);
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
    //let s = inputText.toLowerCase().split(' ').filter(function(el) { return !IGNORED_WORDS.includes(el); }).join(' ');
    
    // remove multiple spaces, and any from the ends
    let cmdString = inputText.toLowerCase().trim().replace(/\s+/g, ' ');
    
    // convert numbers in weords to digits
    if (CONVERT_NUMBERS_IN_PARSER) {
      cmdString = convertNumbers(cmdString);
    }
    
    // Get a list of candidate commands that match the regex
    const candidates = commands.filter(function(el) {
      return el.regex.test(cmdString);
    });
    if (candidates.length === 0) {
      return NOT_KNOWN_MSG;
    }
    parser.msg("Number of commands that have a regex match:" + candidates.length)

    // We now want to match potential objects
    // This will help us narrow down the candidates (maybe)
    // matchedCandidates is an array of dictionaries,
    // each one containing a command and some matched objects if applicable
    let error = GENERAL_OBJ_ERROR;
    const matchedCandidates = [];
    candidates.forEach(function(el) {
      // matchItemsToCmd will attempt to fit the objects, returns a dictionary if successful
      // or an error message otherwise. Could have more than one object,
      // either because multiple were specified or because it was ambiguous (or both)
      // We just keep the last error message as hopefully the most relevant.
      // NB: Inside function so cannot use 'this'
      parser.msg("* Looking at candidate: " + el.name);
      const res = parser.matchItemsToCmd(cmdString, el);
      if (!res) {
        parser.msg("No result!");
        error = "Res is " + res;
      }
      parser.msg("Result score is: " + res.score);
      if (res.score === -1) {
        error = res.error;
      }
      else {
        parser.msg("Candidate accepted!");
        matchedCandidates.push(res);
      }
    });
    parser.msg("Number of candidates accepted: " + matchedCandidates.length);
    if (matchedCandidates.length === 0) {
      return error;
    }
    // pick between matchedCandidates based on score
    let command = matchedCandidates[0];
    if (matchedCandidates.length > 1) {
      parser.msg("Need to pick just one; start with the first (score " + command.score + ").");
      for (let i = 1; i < matchedCandidates.length; i++) {
        // give preference to earlier commands
        if (command.score < matchedCandidates[i].score) {
          parser.msg("This one is better:" + command.cmd.name + " (score " + matchedCandidates[i].score + ")");
          command = matchedCandidates[i];
        }
      }
    }
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
  parser.matchItemsToCmd = function(s, cmd) {
    const res = {cmd:cmd, objectTexts:[], objects:[], matches:[]};
    res.score = cmd.score ? cmd.score : 0; 
    const arr = cmd.regex.exec(s);
    const fallbackScope = parser.scope(parser.isVisible);
    arr.shift();  // first element is the whole match, so discard
    
    parser.msg("..Base score: " + res.score);

    for (let i = 0; i < arr.length; i++) {
      if (!cmd.objects[i]) {
        errormsg("That command seems to have an error. It has more capture groups than there are elements in the 'objects' attribute.");
        return false;
      }
      if (cmd.objects[i].ignore) {
        // this capture group has been flagged to be ignored
        continue;
      }
      let objectNames, score = 0;
      res.objectTexts.push(arr[i]);
      if (cmd.objects[i].text) {
        // this capture group has been flagged to be text
        res.objects.push(arr[i]);
        score = 1;
      }
      
      else if (ALL_REGEX.test(arr[i]) || ALL_EXCLUDE_REGEX.test(arr[i])) {
        // Handle ALL and ALL BUT
        let list = cmd.objects[i].scope ? parser.scope(cmd.objects[i].scope) : fallbackScope;
        let exclude = [game.player];
        
        // anything flagged as scenery should be excluded
        for (let j = 0; j < list.length; j++) {
          if (list[j].scenery || list[j].excludeFromAll) {
            exclude.push(list[j]);
          }
        }
        
        if (list.length === 0) {
          res.error = cmd.nothingForAll ? cmd.nothingForAll : NOTHING_MSG;
          res.score = -1;
          return res;
        }
        if (ALL_EXCLUDE_REGEX.test(arr[i])) {
          // if this is ALL BUT we need to remove some things from the list
          // excludes must be in isVisible
          // if it is ambiguous or not recognised it does not get added to the list
          let s = arr[i].replace(ALL_EXCLUDE_REGEX, "").trim();
          objectNames = s.split(JOINER_REGEX).map(function(el){ return el.trim(); });
          for (j = 0; j < objectNames.length; j++) {
            items = parser.findInList(objectNames[j], fallbackScope);
            if (items.length === 1) {
              exclude.push(items[0]);
            }
          }
        }
        list = list.filter(function(el) { return !exclude.includes(el); });
        if (list.length > 1 && !cmd.objects[i].multiple) {
          res.error = NO_MULTIPLES_MSG;
          res.score = -1;
          return res;
        }
        score = 2;
        res.objects.push(list.map(function(el) { return [el]; }));
        res.matches.push(arr[i]);
        res.all = true;
      }
      
      else {
        objectNames = arr[i].split(JOINER_REGEX).map(function(el){ return el.trim() });
        if (objectNames.length > 1 && !cmd.objects[i].multiple) {
          res.error = NO_MULTIPLES_MSG;
          res.score = -1;
          return res;
        }
        let scopes = cmd.objects[i].scope ? [parser.scope(cmd.objects[i].scope), fallbackScope] : [fallbackScope];
        
        let objs = [], matches = [];
        let objs2, n;
        for (let j = 0; j < objectNames.length; j++) {
          const objNameMatch = ARTICLE_FILTER_REGEX.exec(objectNames[j]);
          if (objNameMatch === null) {
            errormsg("Failed to match to ARTICLE_FILTER_REGEX with '" + objectNames[j] + "', - probably an error in ARTICLE_FILTER_REGEX!");
            return null;
          }
          [objs2, n] = this.findInScope(objNameMatch[1], scopes, cmd.objects[i]);
          if (n === 0) {
            res.error = (cmd.noobjecterror ? cmd.noobjecterror : OBJECT_UNKNOWN_MSG(objectNames[j]));
            res.score = -1;
            return res;
          }
          else {
            if (n > score) { score = n; }
            objs.push(objs2);
            matches.push(objectNames[j]);
          }
        }
        res.objects.push(objs);
        res.matches.push(matches);
      }
      parser.msg("..Adding to the score: " + score);
      res.score += score;
    }
    return res;
  };


  // Tries to match objects to the given string
  // It will return a list of matching objects (to be disambiguated if more than 1),
  // plus the score, depending on which list the object(s) was found in
  // (if there are three lists, the score will be 3 if found in the first list, 2 in the second,
  // or 1 if in the third list).
  // If not found the score will be 0, and an empty array returned.
  parser.findInScope = function(s, listOfLists, cmdParams) {
    // First handle IT etc.
    for (let key in PRONOUNS) {
      if (s === PRONOUNS[key].objective && parser.pronouns[PRONOUNS[key].objective]) {
        return [parser.pronouns[PRONOUNS[key].objective], 1];
      }
    }
        
    for (let i = 0; i < listOfLists.length; i++) {
      let objs = this.findInList(s, listOfLists[i], cmdParams);
      if (objs.length > 0) {
        return [objs, listOfLists.length - i];
      }
    }
    return [[], 0];
  };



  // Tries to match an object to the given string
  // But if there are more than 1 with the same score, it returns them all
  // s is the string to match
  // list is an array of items to match again
  parser.findInList = function(s, list, cmdParams) {
    parser.msg("..Looking for a match for: " + s)
    let res = [];
    let score = 0;
    let n;
    for (let i = 0; i < list.length; i++) {
      n = this.scoreObjectMatch(s, list[i], cmdParams);
      if (n >=0 ) parser.msg("....Considering: " + list[i].name + " (score " + n + ")")
      if (n > score) {
        res = [];
        score = n;
      }
      if (n >= score) {
        res.push(list[i]);
      }
    }
    parser.msg(res.length > 1 ? "Cannot decide between: " + res.map(el => el.name).join(", ") : (res.length === 1 ? "..Going with: " + res[0].name : "Found no suitable objects"))
    return res;
  };


  parser.scoreObjectMatch = function(s, item, cmdParams) {
    if (!item.parserOptionsSet) {
      // Do we need to do this when the saved game is reloaded???
      item.parserOptionsSet = true;
      item.parserItemName = item.alias.toLowerCase();
      item.parserItemNameParts = item.parserItemName.split(' ');
      if (item.pattern) {
        if (!item.regex) item.regex = new RegExp("^(" + item.pattern + ")$") 
        if (!item.parserAltNames) item.parserAltNames = item.pattern.split('|');
      }
      if (item.parserAltNames) {
        item.parserAltNames.forEach(function (el) {
          if (el.includes(' ')) {
            item.parserItemNameParts = item.parserItemNameParts.concat(el.split(' '))
          }
        })
      }
    }
    const itemName = item.alias.toLowerCase();
    let res = -1;
    if (cmdParams.items && cmdParams.items.includes(item.name)) {
      // The command specifically mentions this item, so highest priority
      res = 100;
    }
    else if (s === item.parserItemName) {
      // The player has used the exact alias
      res = 70;
    }
    else if (item.regex && item.regex.test(s)) {
      // The player has used the exact string allowed in the regex
      res = 60;
    }
    else if (item.parserItemNameParts && item.parserItemNameParts.some(function(el) { return el === s})) {
      // The player has matched a complete word, but not the full phrase
      res = 50;
    }
    else if (item.parserItemName.startsWith(s)) {
      // the player has used a string that matches the start of the alias
      res = s.length + 15;
    }
    else if (item.parserAltNames && item.parserAltNames.some(function(el) { return el.startsWith(s)})) {
      // the player has used a string that matches the start of an alt name
      res = s.length + 10;
    }
    else if (item.parserItemNameParts && item.parserItemNameParts.some(function(el) { return el.startsWith(s)})) {
      // the player has used a string that matches the start of an alt name
      res = s.length;
    }
    else {
      return -1;
    }

    if (item[cmdParams.attName]) res += 6;
    if (item.parsePriority) res += item.parsePriority;

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
    for (let i = 0; i < parser.currentCommand.objects.length; i++) {
      if (typeof parser.currentCommand.objects[i] === "string") {
        s += "&nbsp;&nbsp;&nbsp;&nbsp;Text: " + parser.currentCommand.objects[i] + "<br/>";
      }
      else {
        s += "&nbsp;&nbsp;&nbsp;&nbsp;Objects:" + parser.currentCommand.objects[i].map(function(el) { return el.name; }).join(", ") + "<br/>";
      }
    }
    debugmsg(s);
  };
  

  parser.msg = function(...ary) {
    if (parser.debug) {
      for (let i = 0; i < ary.length; i++) {
        debugmsg("PARSER&gt; " + ary[i])
      }
    }
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
  return item.scopeStatus === REACHABLE && world.ifNotDark(item);
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
  return item.isAtLoc(game.player.name, display.PARSER) && world.ifNotDark(item) && !item.getWorn();
}
parser.isHeld = function(item) {
  return item.isAtLoc(game.player.name, display.PARSER) && world.ifNotDark(item);
}
parser.isForSale = function(item) {
  return item.isForSale && item.isForSale(game.player.loc) && world.ifNotDark(item);
}

parser.isHeldByNpc = function(item) {
  const npcs = parser.scope(parser.isReachable).filter(el => el.npc);
  for (let i = 0; i < npcs.length; i++) {
    if (item.isAtLoc(npcs[i].name, display.PARSER)) return true;
  }
  return false;
}

parser.isHere = function(item) {
  return item.isAtLoc(game.player.loc, display.PARSER) && world.ifNotDark(item);
}
parser.isNpcOrHere = function(item) {
  return (item.isAtLoc(game.player.loc, display.PARSER) && world.ifNotDark(item)) || item.npc || item.player;
}
parser.isNpcAndHere = function(item) {
  return item.isAtLoc(game.player.loc, display.PARSER) && (item.npc || item.player);
}
parser.isHere = function(item) {
  return item.isAtLoc(game.player.loc, display.PARSER) && world.ifNotDark(item);
}
//parser.isWorn = function(item) {
//  return item.isAtLoc(game.player.name, display.PARSER) && world.ifNotDark(item) && item.getWorn();
//}
//parser.isWornBy = function(item, options) {
//  return item.isAtLoc(options.npc.name, display.PARSER) && item.getWorn() && !item.ensemble;
//}

//parser.isInside = function(item, options) {
//  return item.isAtLoc(options.container.name, display.PARSER) && world.ifNotDark(item);
//}

//parser.isRoom = function(item) {
//  return item.room;
//}

parser.isContained = function(item) {
  const containers = parser.scope(parser.isReachable).filter(el => el.container);
  for (let i = 0; i < containers.length; i++) {
    if (containers[i].closed) continue;
    if (item.isAtLoc(containers[i].name, display.PARSER)) return true;
  }
  return false;
}
parser.isHereOrContained = function(item) {
  if (parser.isHere(item)) return true;
  if (parser.isContained(item)) return true;
  return false;
}

parser.isLiquid = function(item, options) {
  return item.liquid;
}
