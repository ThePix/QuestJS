



parse = function(inputText) {
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
  var error = "So I kind of get what you want to do, but not what you want to do it with.";
  candidates.forEach(function(el) {
    // matchItemsToCmd will atempt to fit the objects, returns a dictionary if successful
    // or an error message otherwise. Could have more than one object
    // We just keep the last error message as hopefully the most relevant.
    res = matchItemsToCmd(el);
    if (typeof res == "string") {
      error = res;
    }
    else {
      cmd.candidates.push(matchItemsToCmd(el));
    }
  };
  if (cmd.candidates.length == 0) {
    errormsg(0, error);
    return;
  }
  if (cmd.candidates.length > 1) {
    l = cmd.candidates.map(function(el)) return el.name; );
    errormsg(0, "I cannot decide quite what you mean, torn between " + l.join(", ")toLowerCase() + " (if you can inform the coders, hopefully this can be resolved in an update sometime).");
    return;
  }
  
    
  return {cmd:el};
});

  
  cmd.command = found;
  msg(cmd.command.regex.exec(s));
  cmd.command.script();
}

// A command has an arbitrary name, a regex or pattern
// and a script as a minimum.



function Cmd(name, hash) {
  this.name = name;
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
    matchUps:[]
  }),
  new Cmd('Wait', {
    pattern:'wait;z',
    script:function() {
      itemAction(room, 'examine');
      suppressTurnScripts = true;
    },
    matchUps:[]
  }),
  new Cmd('Take', {
    pattern:'take #object#',
    script:function(object, text) {
      itemAction(object, 'take');
    },
    matchUps:[
      {name:'object', find:function(name) {} },
    ]
  }),
  new AltVerbCmd('Get', 'Take', 'get'),
  new VerbCmd('Drop', {
    pattern:'drop',
    script:function(object, text) {
      itemAction(object, 'drop');
    },
    matchUps:[
      {name:'object', find:function(name) {} },
    ]
  }),
  new Cmd('Ask/about', {
    pattern:'ask #object# about #text#',
    script:function(object, text) {
      itemAction(room, 'examine');
      suppressTurnScripts = true;
    },
    matchUps:[
      {name:'object'},
      {name:'text'}
    ]
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
    s = s.replace(/#([object|text]\w*)#/g, "(?<$1>.*)");
    ary2.push(s);
  });
  return new RegExp(ary2.join('|'));
}

initCommands();