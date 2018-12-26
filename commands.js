// A command has an arbitrary name, a regex or pattern, 
// and a script as a minimum.
// regex           A regex to match against
// pattern         An alternative to a regex, will be converted to a regex at runtime
//                 A command must have either a pattern or a regex
// objects         An array of matches in the regex (see wiki)
// script          This will be run on a successful match
// att             If there is no script, then this attribute on the object will be used
// nothingForAll   If the player uses ALL and there is nothing there, use this error message
// noTurnscripts   Set to true to prevent turnscripts firing even when this command is successful

"use strict";

function Cmd(name, hash) {
  this.name = name;
  this.objects = [];
  // This is the default script for commands
  this.script = function(cmd, objects) {
    var attName = cmd.att ? cmd.att : cmd.name.toLowerCase();
    debugmsg(0, "attName=" + attName);
    var success = false;
    for (var i = 0; i < objects[0].length; i++) {
      if (!objects[0][i][attName]) {
        errormsg(ERR_GAME_BUG, CMD_NO_ATT_ERROR + " (" + objects[0][i].name + ").");
      }
      else {
    debugmsg(0, "name=" + objects[0][i].name);
        var result = printOrRun(objects[0][i], attName, (objects[0].length > 1 || parser.currentCommand.all));
    debugmsg(0, "result=" + result);
        success = result || success;
      }
    }
    if (success) {
      return (cmd.noTurnscripts ? SUCCESS_NO_TURNSCRIPTS : SUCCESS);
    }
    else {
      return FAILED; 
    }
  };
  for (var key in hash) {
    this[key] = hash[key];
  }
}

function ExitCmd(name, hash) {
  Cmd.call(this, name, hash);
  this.exitCmd = true;
  this.objects = [{ignore:true}, {ignore:true}, ],
  this.script = function(cmd, objects) {
    var currentRoom = getCurrentRoom();

    if (!hasExit(currentRoom, cmd.name)) {
      errormsg(ERR_PLAYER, CMD_NOT_THAT_WAY);
      return FAILED;
    }
    else {
      var ex = currentRoom[cmd.name];
      if (typeof ex == "string") {
        setRoom(ex)
        return SUCCESS;
      }
      else if (typeof ex === "function"){
        ex(currentRoom);
        return SUCCESS;
      }
      else if (typeof ex === "object"){
        var fn = ex.use;
        fn(ex, cmd.name);
        return SUCCESS;
      }
      else {
        errormsg(ERR_GAME_BUG, CMD_UNSUPPORTED_DIR);
        return FAILED;
      }
    }
    
  };
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
  new Cmd('Help', {
    regex:/^help|\?$/,
    script:helpScript,
  }),    
  
  new Cmd('Look', {
    regex:/^l|look$/,
    script:function() {
      getCurrentRoom().description();
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('Wait', {
    pattern:'wait;z',
    script:function() {
      metamsg("Still to be implemented");
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),
  new Cmd('test', {
    pattern:'test',
    script:function() {
      background = getObject("background");
      metamsg(JSON.stringify(background));
      return SUCCESS_NO_TURNSCRIPTS;
    },
  }),

  new Cmd('Examine', {
    regex:/^(examine|exam|ex|x) (.+)$/,
    att:'examine',
    objects:[
      {ignore:true},
      {scope:isPresent}
    ]
  }),
  new Cmd('Look at', {
    regex:/^(look at|look) (.+)$/,
    att:'examine',
    objects:[
      {ignore:true},
      {scope:isPresent}
    ]
  }),
  
  new Cmd('Take', {
    regex:/^(take|get|pick up) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHere, multiple:true},
    ],
  }),
  
  new Cmd('Drop', {
    regex:/^(drop) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
  }),
  
  new Cmd('Wear', {
    regex:/^(wear|don|put on) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
  }),
  
  new Cmd('Remove', {
    regex:/^(remove|doff|take off) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
  }),
  
  new Cmd('Read', {
    regex:/^(read) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
  }),
  
  new Cmd('Eat', {
    regex:/^(eat) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
    ],
  }),
  
  new Cmd('Put/in', {
    regex:/^(put|place|drop) (.+) (in to|into|in) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isHeld, multiple:true},
      {ignore:true},
      {scope:isPresent},
    ],
    script:function(cmd, objects) {
      var success = false;
      var container = objects[1][0];
      if (!container.container) {
        errormsg(ERR_PLAYER, CMD_NOT_CONTAINER(container));
        return FAILED; 
      }
      for (var i = 0; i < objects[0].length; i++) {
        var flag = true;
        if (container.checkCapacity) {
          flag = container.checkCapacity(objects[0][i]);
        }
        if (flag) {
          if (objects[0][i].loc != player.name) {
            CMD_NOT_CARRYING(objects[0][i]);
          }
          else {
            objects[0][i].loc = container.name;
            msg(prefix(objects[0][i], objects[0].length > 1 || parser.currentCommand.all) + CMD_DONE);
            success = true;
          }
        }
      }
      if (success) { updateUIItems(); }
      return success ? SUCCESS : FAILED; 
    },
  }),
  
  new Cmd('Open', {
    regex:/^(open) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    script:function(cmd, objects) {
      var success = false;
      var isMultiple = objects[0].length > 1 || parser.currentCommand.all;
      for (var i = 0; i < objects[0].length; i++) {
        success = success || objects[0][i].open(objects[0][i], isMultiple);
      }
      if (success) { updateUIItems(); }
      return success ? SUCCESS : FAILED; 
    },
  }),
  
  new Cmd('Close', {
    regex:/^(close) (.+)$/,
    objects:[
      {ignore:true},
      {scope:isPresent, multiple:true},
    ],
    script:function(cmd, objects) {
      var success = false;
      var isMultiple = objects[0].length > 1 || parser.currentCommand.all;
      for (var i = 0; i < objects[0].length; i++) {
        success = success || objects[0][i].close(objects[0][i], isMultiple);
      }
      if (success) { updateUIItems(); }
      return success ? SUCCESS : FAILED; 
    },
  }),
  
  new Cmd('Take/from', {
    pattern:'take #object1# from #object2#',
    script:function(object, text) {
      printOrRun(object, 'take');
    },
    objects:[
      {scope:isHere, multiple:true},
      {scope:isHere},
    ]
  }),
//  new AltVerbCmd('Get', 'Take', 'get'),
//  new VerbCmd('Drop', {
//    pattern:'drop',
//    script:function(object, text) {
//      printOrRun(object, 'drop');
//    },
//    objects:[{scope:isHeld, multiple:true}]
//  }),


  new Cmd('Ask/about', {
    regex:/^(ask) (.+) (about) (.+)$/,
    script:function(cmd, arr) {
      success = arr[0][0].askabout(arr[1]);
//      msg("You ask " + arr[0][0].name + " about " + arr[1] + ".*");
      return success ? SUCCESS : FAILED; 
    },
    objects:[
      {ignore:true},
      {scope:isHere},
      {ignore:true},
      {text:true},
    ]
  }),
  
  
  new Cmd('Inspect', {
    regex:/^(inspect) (.+)$/,
    script:function(cmd, arr) {
      if (DEBUG) {
        var item = arr[0][0];
        debugmsg(0, "Name: " + item.name);
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
             debugmsg(0, "--" + key + ": " + item[key]);
          }
        }        
      }
      else {
        errormsg(ERR_PLAYER, "Debug commands are not available.");
      }
      return SUCCESS_NO_TURNSCRIPTS; 
    },
    objects:[
      {ignore:true},
      {scope:isPresent},
    ]
  }),
];

    


