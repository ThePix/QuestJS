

// For disambig we need to be able to halt the process part way through, ask a question, then come back to it.
// This means saving the state we have got to, in cmd


// NOTES AND LIMITATIONS
// This can only handle single commands
// Lists of multiple objects must be separated by JOINER_REGEX (i.e., "and" or comma)
// Item names cannot include the word "and" or commas
// Commands look in their specified scope first, then isPresent as the fallback.
// It will try to match the beginning of a word to the object name given.
//    If the player does GET H, then it will disambiguate between any objects beginning with H
// A match is scored by whether the objects are in the right place (+2), wrong place but here (+1).
// You can also give a command a score attribute to boost (or reduce) its success.

var parser = {};


  // The "parse" function should be sent either the text the player typed or,
  // if just asked to disambig, an object?
  parser.parse = function(inputText) {
    var res;
    if (typeof inputText == "string") {
      res = this.convertInputTextToCommandCandidate(inputText);
      if (typeof res == "string") {
        errormsg(0, res);
        return;
      }
    }
    else {
      res = inputText;
    }
    // At this point we have a dictionary, res, with the inital string, "string", the modified string, "cmdString", and
    // a dictionary, "command". We need to go though the objects in the dictionary to see how well
    // res.inputString    the initial string
    // res.cmdString      the sanitised string
    // res.cmd            the matched command
    // res.objects        a list (of a list of a list), one member per capture group in the regex
    // res.objects[0]     a list (of a list), one member per object name given by the player for capture group 0
    // res.objects[0][0]  a list of possible object matches for each object name given by the player for the first object name in capture group 0
    
    // Need to disambiguate, until each of the lowest level lists has exactly one member
    var flag;
    //for (var i = 0; i < res.objects.length; i++) {
    //  for (var j = 0; j < res.objects[i].length; j++) {
    //    if (res.objects[i][j].length > 1) {
    //      res.disambiguate1 = i;
    //      res.disambiguate2 = j;
    //      disambiguate(res.objects[i][j]) {
    msg("----");
    msg(res);
    msg(res.inputString);
    msg(res.cmdString);
    msg(res.cmd.name);
    msg(res.objects.length);
    msg(res.objects[0].name);
    msg(res.objects[0][0].name);
    msg(res.objects[0][0][0].name);

    
  };


  parser.convertInputTextToCommandCandidate = function(inputText) {
    var s = inputText.toLowerCase().split(' ').filter(el => !IGNORED_WORDS.includes(el)).join(' ');
    var cmdString = s;
    
    // Get a list of candidate commands that match the regex
    var candidates = commands.filter(function(el) {
      return el.regex.test(s);
    });
    if (candidates.length == 0) {
      return "I don't even know where to begin with that.";
    }

    // We now want to match potential objects
    // This will help us narrow down the candidates (maybe)
    //matchedCandidates is an array of dictionaries,
    //each one containing a command and some matched objects if applicable
    var error = "So I kind of get what you want to do, but not what you want to do it with.";
    var matchedCandidates = [];
    candidates.forEach(function(el) {
      // matchItemsToCmd will attempt to fit the objects, returns a dictionary if successful
      // or an error message otherwise. Could have more than one object,
      // either because multiple were specified or because it was ambiguous (or both)
      // We just keep the last error message as hopefully the most relevant.
      // NB: Inside function so cannot use 'this'
      res = parser.matchItemsToCmd(cmdString, el);
      //msg("... done "  + res.score);
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
    for (var i = 1; i < arr.length; i++) {
      var score = 0;
      res.objectTexts.push(arr[i]);
      if (typeof cmd.matchUps[i - 1] == "string") {
        res.objects.push([]);
        score = 1;
      }
      else {
        //msg("Looking for: " + arr[i] + ", scope:" + cmd.matchUps[i - 1].name);
        var objectNames = arr[i].split(JOINER_REGEX).map(function(el){ return el.trim() });
        var scope1 = scope(cmd.matchUps[i - 1]);
        var scope2 = scope(isPresent);
        var objs = [];
        var obs2;
        for (var j = 0; j < objectNames.length; j++) {
          [objs2, n] = this.findInScope(objectNames[j], [scope1, scope2]);
          if (n == 0) {
            res.error = cmd.noobjecterror ? cmd.noobjecterror : "Not finding any object '" + objectNames[j] + "'.";
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
    //msg("[" + s + "]");
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
    // TODO: may want to check alts too
    if (s == item.name) {
      return 3;
    }
    if (new RegExp("\\b" + s).test(item.name)) {
      return 1;
    }
    return -1;
  }

//}

// A command has an arbitrary name, a regex or pattern
// and a script as a minimum.



function Cmd(name, hash) {
  this.name = name;
  this.matchUps = [];
  for (var key in hash) {
    this[key] = hash[key];
  }
}

function VerbCmd(name, hash) {
  Cmd.call(this, name, hash);
  this.verb = true;
}

function AltCmd(name, altcmd, regex) {
  Cmd.call(this, name, {});
  this.altcmd = name;
  this.regex = regex;
}

function AltVerbCmd(name, altcmd, pattern) {
  Cmd.call(this, name, {});
  this.altcmd = name;
  this.pattern = pattern;
  this.verb = true;
}



var commands = [
  new Cmd('Look', {
    regex:/^look$/,
    script:function() {
      itemAction(room, 'examine');
      suppressTurnScripts = true;
    },
  }),
  new Cmd('Wait', {
    pattern:'wait;z',
    script:function() {
      itemAction(room, 'examine');
      suppressTurnScripts = true;
    },
  }),
  new Cmd('Take', {
    pattern:'take #object#',
    script:function(object, text) {
      itemAction(object, 'take');
    },
    matchUps:[isHere]
  }),
  new Cmd('Take/from', {
    pattern:'take #object1# from #object2#',
    script:function(object, text) {
      itemAction(object, 'take');
    },
    matchUps:[isHere, isHere]
  }),
//  new AltVerbCmd('Get', 'Take', 'get'),
//  new VerbCmd('Drop', {
//    pattern:'drop',
//    script:function(object, text) {
//      itemAction(object, 'drop');
//    },
//    matchUps:[isHeld]
//  }),
  new Cmd('Ask/about', {
    pattern:'ask #object# about #text#',
    script:function(object, text) {
      itemAction(room, 'examine');
      suppressTurnScripts = true;
    },
    matchUps:[isHere, 'text']
  }),
];

    
// Should be called during the initialisation process
// Any patterns are converted to RegExp objects.      
initCommands = function() {
  commands.forEach(function(el) {
    if (el.verb) {
      el.regex = el.regex + " #object#";
    }
    if (typeof el.pattern == 'string') {
      el.regex = _pattern2Regexp(el.pattern);
    }
    if (!(el.regex instanceof RegExp)) {
      alert("No regex for " + el.name);
    }
  });  
}

// Convert a pattern in the form:
// ask #object# about #text#
// to a regex like:
// ^ask (?<object>.*) about (?<text>.*)$
_pattern2Regexp = function(s) {
  var ary = s.split(';');
  var ary2 = [];
  ary.forEach(function(el) {
    s = '^' + el.trim() + '$';
    //s = s.replace(/#([object|text]\w*)#/g, "(?<$1>.*)");
    s = s.replace(/#([object|text]\w*)#/g, "(.+)");
    ary2.push(s);
  });
  return new RegExp(ary2.join('|'));
}

initCommands();