"use strict";




function intro() {
  msg();
}




// This function will be called at the start of the game, so can be used
// to introduce your game.
function setup() {
  game.player.hitpoints = 20;
  game.player.status = "You are feeling fine";
}


/*
game.registerEvent("sayNow", function() {
  msg("Now! " + game.elapsedRealTime);
  setTimeout(io.scrollToEnd,1);
});

game.registerEvent("sayOften", function() {
  msg("Often! " + this.count);
  if (!this.count) this.count = 0;
  this.count++;
  if (this.count > 3) return true;
});


game.registerEvent("sayThen", function() {
  msg("Then!");
  setTimeout(io.scrollToEnd,1);
});

game.registerTimedEvent("sayOften", 2, 2);
game.registerTimedEvent("sayOften", 18, 3);
game.registerTimedEvent("sayThen", 10);
game.registerTimedEvent("sayNow", 6, 4);
game.registerTimedEvent("sayNow", 7, 7);
*/





commands.push(new Cmd('Kick', {
  npcCmd:true,
  rules:[cmdRules.isHere],
  regex:/^(kick) (.+)$/,
  objects:[
    {ignore:true},
    {scope:parser.isPresent}
  ],
  default:function(item, isMultiple, char) {
    return failedmsg(prefix(this, isMultiple) + pronounVerb(char, "kick", true) + " " + this.pronouns.objective + ", but nothing happens.");
  },
}));



commands.push(new Cmd('Charge', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  regex:/^(charge) (.+)$/,
  objects:[
    {ignore:true},
    {scope:parser.isHeld}
  ],
  default:function(item, isMultiple, char) {
    return failedmsg(prefix(item, isMultiple) + pronounVerb(item, "'be", true) + " not something you can charge.");
  },
}));


commands.push(new Cmd('Move', {
  npcCmd:true,
  rules:[cmdRules.isHere],
  regex:/^(move) (.+)$/,
  objects:[
    {ignore:true},
    {scope:parser.isHere}
  ],
  default:function(item, isMultiple, char) {
    return failedmsg(prefix(item, isMultiple) + pronounVerb(item, "'be", true) + " not something you can move.");
  },
}));


commands.push(  new Cmd('Hint', {
    regex:/^hint$|^hints$/,
    script:function() {
      if (w[game.player.loc].hint) {
        metamsg(w[game.player.loc].hint);
      }
      else {
        metamsg("Sorry, no hints here.");
      }
    },
  }));
  



commands.push(  new Cmd('print', {
    regex:/^print$/,
    script:function() {
      /*typeWriter.write('p', 'The first line.');
      typeWriter.write('p', '2');
      typeWriter.write('p', '');
      typeWriter.write('f', function() { console.log('here') } );
      typeWriter.write('p', 'Third line');*/
      msg('The first line.');
      msg('2');
      msg('');
      msgFunction(function() { console.log('here') } );
      msg('Third line');
    },
  }));
  



tp.addDirective("charger_state", function(){
  if (w.charger_compartment.closed) {
    return "The compartment is closed";
  }
  const contents = w.charger_compartment.getContents(display.LOOK);
  if (contents.length === 0) {
    return "The compartment is empty";
  }
  return "The compartment contains " + formatList(contents, {article:INDEFINITE});
});
