// NOTES AND LIMITATIONS
// This can only handle single commands
// Lists of multiple objects must be separated by JOINER_REGEX (i.e., "and" or comma)
// Item names cannot include the word "and" or commas
// Commands look in their specified scope first, then isVisible as the fallback.
// It will try to match the beginning of a word to the object name given.
//    If the player does GET H, then it will disambiguate between any objects beginning with H
// A match is scored by whether the objects are in the right place (+2), wrong place but here (+1).
// You can also give a command a score attribute to boost (or reduce) its success.

"use strict";

var parser = {};

  parser.currentCommand;
  // Stores the current values for it, him, etc.
  // put hat in box
  // x it
  parser.pronouns = {};

  // The "parse" function should be sent either the text the player typed or null.
  // If sent null it will continue to work with the current vales in currentCommand.
  // This allows us to keep trying to process a single command until all the
  //  disambiguations have been resolved.
  parser.parse = function(inputText) {
    //msg("Input=" + inputText);
    if (inputText) {
      var res = parser.convertInputTextToCommandCandidate(inputText);
      if (typeof res == "string") {
        errormsg(ERR_PARSER, res);
        endTurn(FAILED)
        return;
      }
      parser.currentCommand = res;
    }

    // Need to disambiguate, until each of the lowest level lists has exactly one member
    var flag = false;
    for (var i = 0; i < parser.currentCommand.objects.length; i++) {
      for (var j = 0; j < parser.currentCommand.objects[i].length; j++) {
        if (parser.currentCommand.objects[i][j] instanceof Array) {
          if (parser.currentCommand.objects[i][j].length == 1) {
            parser.currentCommand.objects[i][j] = parser.currentCommand.objects[i][j][0];
          }
          else {
            flag = true;
            parser.currentCommand.disambiguate1 = i;
            parser.currentCommand.disambiguate2 = j;
            showMenu(CMD_DISAMBIG_MSG, parser.currentCommand.objects[i][j], function(result) {
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
    parser.currentCommand = {
      cmdString:(item ? cmd.name + " " + item.name : cmd.name),
      cmd:cmd,
      objects:(item ? [[item]] : []),
    }
    parser.execute();
  }

  // Do it!
  parser.execute = function() {
    //parser.inspect();
    if (parser.currentCommand.objects.length > 0) {
      for (var i = 0; i < parser.currentCommand.objects[0].length; i++) {
        parser.pronouns[parser.currentCommand.objects[0][i].pronouns.objective] = parser.currentCommand.objects[0][i];
      }
    }
    var outcome = parser.currentCommand.cmd.script(parser.currentCommand.cmd, parser.currentCommand.objects);
    //debugmsg(DBG_PARSER, "Result=" + outcome);
    endTurn(outcome);
  }    
  

  // This will return a dictionary, with these keys:
  // .inputString    the initial string
  // .cmdString      the sanitised string
  // .cmd            the matched command object
  // .objects        a list (of a list of a list), one member per capture group in the command regex
  // .objects[0]     a list (of a list), one member per object name given by the player for capture group 0
  // .objects[0][0]  a list of possible object matches for each object name given by the player for the
  //                      first object name in capture group 0
  parser.convertInputTextToCommandCandidate = function(inputText) {
    var s = inputText.toLowerCase().split(' ').filter(el => !CMD_IGNORED_WORDS.includes(el)).join(' ');
    var cmdString = s;
    
    // Get a list of candidate commands that match the regex
    var candidates = commands.filter(function(el) {
      return el.regex.test(s);
    });
    if (candidates.length == 0) {
      return CMD_NOT_KNOWN_MSG;
    }

    // We now want to match potential objects
    // This will help us narrow down the candidates (maybe)
    //matchedCandidates is an array of dictionaries,
    //each one containing a command and some matched objects if applicable
    var error = CMD_GENERAL_OBJ_ERROR;
    var matchedCandidates = [];
    candidates.forEach(function(el) {
      // matchItemsToCmd will attempt to fit the objects, returns a dictionary if successful
      // or an error message otherwise. Could have more than one object,
      // either because multiple were specified or because it was ambiguous (or both)
      // We just keep the last error message as hopefully the most relevant.
      // NB: Inside function so cannot use 'this'
      var res = parser.matchItemsToCmd(cmdString, el);
      if (res.score == -1) {
        error = res.error;
      }
      else {
        matchedCandidates.push(res);
      }
    });
    if (matchedCandidates.length == 0) {
      return error;
    }
    
    // pick between matchedCandidates based on score
    var command = matchedCandidates[0];
    if (matchedCandidates.length > 1) {
      for (var i = 1; i < matchedCandidates.length; i++) {
        // give preference to later commands
        if (command.score <= matchedCandidates.score) {
          command = matchedCandidates;
        }
      }
    }
    command.string = inputText;
    command.cmdString = s;
    return command;
  }



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
    var res = {cmd:cmd, objectTexts:[], objects:[]};
    res.score = cmd.score ? cmd.score : 0; 
    var arr = cmd.regex.exec(s);
    var fallbackScope = scope(isVisible);
    

    for (var i = 1; i < arr.length; i++) {
      if (cmd.objects[i - 1].ignore) {
        continue;
      }
      var score = 0;
      res.objectTexts.push(arr[i]);
      if (cmd.objects[i - 1].text) {
        res.objects.push(arr[i]);
        score = 1;
      }
      
      else if (CMD_ALL_REGEX.test(arr[i]) || CMD_ALL_EXCLUDE_REGEX.test(arr[i])) {
        // Handle ALL and ALL BUT
        var list = cmd.objects[i - 1].scope ? scope(cmd.objects[i - 1].scope) : fallbackScope;
        var exclude = [game.player];
        if (list.length == 0) {
          res.error = cmd.nothingForAll ? cmd.nothingForAll : CMD_NOTHING;
          res.score = -1;
          return res;
        }
        if (CMD_ALL_EXCLUDE_REGEX.test(arr[i])) {
          // if this is ALL BUT we need to remove some things from the list
          // excludes must be in isVisible
          // if it is ambiguous or not recognised it does not get added to the list
          var s = arr[i].replace(CMD_ALL_EXCLUDE_REGEX, "").trim();
          var objectNames = s.split(CMD_JOINER_REGEX).map(function(el){ return el.trim() });
          for (var j = 0; j < objectNames.length; j++) {
            items = parser.findInList(objectNames[j], fallbackScope);
            if (items.length == 1) {
              exclude.push(items[0]);
            }
          }
        }
        list = list.filter(function(el) { return !exclude.includes(el); });
        if (list.length > 1 && !cmd.objects[i - 1].multiple) {
          res.error = CMD_NO_MULTIPLES;
          res.score = -1;
          return res;
        }
        score = 2;
        res.objects.push(list.map(function(el) {return [el]}));
        res.all = true;
      }
      
      else {
        var objectNames = arr[i].split(CMD_JOINER_REGEX).map(function(el){ return el.trim() });
        if (objectNames.length > 1 && !cmd.objects[i - 1].multiple) {
          res.error = CMD_NO_MULTIPLES;
          res.score = -1;
          return res;
        }
        var scopes = cmd.objects[i - 1].scope ? [scope(cmd.objects[i - 1].scope), fallbackScope] : scopes = [fallbackScope];
        var objs = [];
        var objs2, n;
        for (var j = 0; j < objectNames.length; j++) {
          [objs2, n] = this.findInScope(objectNames[j], scopes);
          if (n == 0) {
            res.error = (cmd.noobjecterror ? cmd.noobjecterror : CMD_OBJECT_UNKNOWN_MSG).replace('%', objectNames[j]);
            res.score = -1;
            return res;
          }
          else {
            if (n > score) { score = n; }
            objs.push(objs2);
          }
        }
        res.objects.push(objs);
      }
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
  parser.findInScope = function(s, listOfLists) {
    // First handle IT etc.
    for (var key in PRONOUNS) {
      if (s == PRONOUNS[key].objective && parser.pronouns[PRONOUNS[key].objective]) {
        return [parser.pronouns[PRONOUNS[key].objective], 1];
      }
    }
        
    var objs;
    for (var i = 0; i < listOfLists.length; i++) {
      objs = this.findInList(s, listOfLists[i]);
      if (objs.length > 0) {
        return [objs, listOfLists.length - i];
      }
    }
    return [[], 0];
  }



  // Tries to match objects to the given string
  // It will return a list of matching objects
  // It will return a list of exact matches if there any any.
  parser.findInList = function(s, list) {
    var res = [];
    var score = 0;
    var n;
    for (var i = 0; i < list.length; i++) {
      n = this.scoreObjectMatch(s, list[i]);
      if (n > score) {
        res = [];
        score = n;
      }
      if (n >= score) {
        res.push(list[i]);
      }
    }
    return res;
  }


  parser.scoreObjectMatch = function(s, item) {
    var itemName = item.alias.toLowerCase();
    if (s == itemName) {
      return 3;
    }
    if (item.alt.includes(s)) {
      return 3;
    }
    if (new RegExp("\\b" + s).test(itemName)) {
      return 1;
    }
    for (var i = 0; i < item.alt.length; i++) {
      if (new RegExp("\\b" + s).test(item.alt[i])) {
        return 1;
      }
    }
    return -1;
  }

  // For debugging only
  // Prints details about the parser.currentCommand so you can
  // see what the parser has made of the player's input
  parser.inspect = function() {
    var s = "PARSER RESULT:<br/>";
    s += "Input text: " + parser.currentCommand.string + "<br/>";
    s += "Matched command: " + parser.currentCommand.cmd.name + "<br/>";
    s += "Matched regex: " + parser.currentCommand.cmd.regex + "<br/>";
    s += "Match score: " + parser.currentCommand.score + "<br/>";
    if (parser.currentCommand.all) { s += "Player typed ALL<br/>"; }
    s += "Objects/texts (" + parser.currentCommand.objects.length + "):" + "<br/>";
    for (var i = 0; i < parser.currentCommand.objects.length; i++) {
      if (typeof parser.currentCommand.objects[i] == "string") {
        s += "&nbsp;&nbsp;&nbsp;&nbsp;Text: " + parser.currentCommand.objects[i] + "<br/>";
      }
      else {
        s += "&nbsp;&nbsp;&nbsp;&nbsp;Objects:" + parser.currentCommand.objects[i].map(function(el) { return el.name }).join(", ") + "<br/>";
      }
    }
    debugmsg(DBG_PARSER, s);
  }

  // Should be called during the initialisation process
  // Any patterns are converted to RegExp objects.      
  parser.initCommands = function(EXITS) {
    commands.forEach(function(el) {
      if (el.verb) {
        el.regex = el.regex + " #object#";
      }
      if (typeof el.pattern == "string") {
        el.regex = parser.pattern2Regexp(el.pattern);
      }
      if (!(el.regex instanceof RegExp)) {
        alert("No regex for " + el.name);
      }
    });
    EXITS.forEach(function(el) {
      if (!el.nocmd) {
        var regex = "^(" + CMD_GO + ")(" + el.name + "|" + el.abbrev.toLowerCase() + ")$";
        var cmd = new ExitCmd(el.name, {
          regex:new RegExp(regex),
        });
        commands.push(cmd);
      }
    });
  }

  // Convert a pattern in the form:
  // ask #object# about #text# to a regex.
  // Cannot cope with multiple options
  parser.pattern2Regexp = function(s) {
    var ary = s.split(';');
    var ary2 = [];
    ary.forEach(function(el) {
      s = '^' + el.trim() + '$';
      s = s.replace(/#([object|text]\w*)#/g, "(.+)");
      ary2.push(s);
    });
    return new RegExp(ary2.join('|'));
  }

