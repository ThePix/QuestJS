parse = function(s) {
  cmd = {string:s};
  var found = commands.find(function(element) {
    return element.regex.test(s);
  });
  if (typeof found == 'undefined') {
    errormsg(0, "Command not recognised");
    return;
  }
  cmd.command = found;
  msg(cmd.command.regex.exec(s));
  cmd.command.script();
}

// A command has an arbitrary name, a regex or pattern
// and a script as a minimum.

var commands = [
  {
    name:'Look',
    regex:/^look$/,
    script:function() {
      itemAction(room, 'examine');
      suppressTurnScripts = true;
    },
    matchUps:[]
  },
  {
    name:'Wait',
    pattern:'wait;z',
    script:function() {
      itemAction(room, 'examine');
      suppressTurnScripts = true;
    },
    matchUps:[]
  },
  {
    name:'Take',
    pattern:'take #object#;get #object#',
    script:function(object, text) {
      itemAction(object, 'take');
    },
    matchUps:[
      {name:'object', find:function(name) {} },
    ]
  },
  {
    name:'Ask/about',
    pattern:'ask #object# about #text#',
    script:function(object, text) {
      itemAction(room, 'examine');
      suppressTurnScripts = true;
    },
    matchUps:[
      {name:'object'},
      {name:'text'}
    ]
  },
];

    
// Should be called during the initialisation process
// Any patterns are converted to RegExp objects.      
initCommands = function() {
  commands.forEach(function(el) {
    if (!(el.regex instanceof RegExp)) {
      el.regex = _pattern2Regexp(el.pattern);
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