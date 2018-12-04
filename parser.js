

// For disambig we need to be able to halt the process part way through, ask a question, then come back to it.
// This means saving the state we have got to, in cmd

var cmd;


// The "parse" function should be sent either the text the player typed or,
// if just asked to disambig, an object?
parse = function(inputText) {
  if (typeof inputText == "string") {
    cmd = {string:inputText};
    var s = inputText.toLowerCase().split(' ').filter(el => !IGNORED_WORDS.includes(el)).join(' ');
    cmd.cmdString = s;
    var candidates = commands.filter(function(el) {
      return el.regex.test(s);
    });
    if (candidates.length == 0) {
      errormsg(0, "I don't even know where to begin with that.");
      return;
    }
    

    // We now want to match potential objects
    // This will help us narrow down the candidates (maybe)
    var error = "So I kind of get what you want to do, but not what you want to do it with.";
    
    //matchedCandidates is an array of dictionaries,
    //each one containing a command and some matched objects if applicable
    var matchedCandidates = [];
    candidates.forEach(function(el) {
      // matchItemsToCmd will attempt to fit the objects, returns a dictionary if successful
      // or an error message otherwise. Could have more than one object,
      // either because multiple were specified or because it was ambiguous (or both)
      // We just keep the last error message as hopefully the most relevant.
      res = matchItemsToCmd(cmd.cmdString, el);
      if (typeof res == "string") {
        error = res;
      }
      else {
        matchedCandidates.push(matchItemsToCmd(el));
      }
    });
    if (matchedCandidates.length == 0) {
      errormsg(0, error);
      return;
    }
    
    // pick between matchedCandidates based on score
    cmd.command = matchedCandidates[0];
    if (matchedCandidates.length > 1) {
      for (var i = 1; i < matchedCandidates.length; i++) {
        // give preference to later commands
        if (cmd.command.score <= matchedCandidates.score) {
          cmd.command = matchedCandidates;
        }
      }
    }
  
    // At this point we have cmd with the inital string, "string", the modified string, "cmdString", and
    // a dictionary, "command". We need to go though the objects in the dictionary to see how well
    // they match items.
  }

  
};


// We want to see if this command is a good match to the string
// This will involve trying to matching objects, according to the
// values in the command
// If matching fails, we return a command specific error
// If it succeeds we return a dictionary containing:
// - the command
// - the matched objects
// - a rating of how good the match is

matchItemsToCmd = function(s, cmd) {
  msg("matchItemsToCmd: " + cmd.name);
  arr = cmd.regex.exec(s);
  for (var i = 1; i < arr.length; i++) {
    if (typeof cmd.matchUps[i - 1] == "string") {
      msg("Not looking for: " + arr[i]);
    }
    else {
      msg("Looking for: " + arr[i] + ", scope:" + cmd.matchUps[i - 1].name);
    }
  }
  return "Some error";
};







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
  new AltVerbCmd('Get', 'Take', 'get'),
  new VerbCmd('Drop', {
    pattern:'drop',
    script:function(object, text) {
      itemAction(object, 'drop');
    },
    matchUps:[isHeld]
  }),
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
    s = s.replace(/#([object|text]\w*)#/g, "(.*)");
    ary2.push(s);
  });
  return new RegExp(ary2.join('|'));
}

initCommands();