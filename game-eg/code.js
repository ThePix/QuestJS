"use strict";




function intro() {
  msg("This is a quick example of what can be done in Quest 6.");
  msg("Your objective is to turn on the light in the basement, but there are, of course, numerous hoops to jump through.");
  msg("If you are successful, see if you can do it again, but getting Kyle to do everything. You should find that you can tell an NPC to do pretty much anything (except look at things for you and talk to people for you).");
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



commands.push(new Cmd('Tes2', {
  regex:/^(tst)$/,
  objects:[
    {ignore:true},
  ],
  script:function(arr) {
    console.log(scope(isReachable));
    console.log("Reachable: " + isReachable(w.brick));
    console.log("Here: " + isHere(w.brick));
    console.log("Contained: " + isContained(w.brick));
    console.log("Either: " + isHereOrContained(w.brick));
    return SUCCESS_NO_TURNSCRIPTS; 
  },
}));


commands.push(new Cmd('Kick', {
  npcCmd:true,
  rules:[cmdRules.isHereRule],
  regex:/^(kick) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isPresent}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(this, isMultiple) + pronounVerb(char, "kick", true) + " " + this.pronouns.objective + ", but nothing happens.");
    return false;
  },
}));



commands.push(new Cmd('Charge', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  regex:/^(charge) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isHeld}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(item, isMultiple) + pronounVerb(item, "'be", true) + " not something you can charge.");
    return false;
  },
}));


commands.push(new Cmd('Move', {
  npcCmd:true,
  rules:[cmdRules.isHereRule],
  regex:/^(move) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isHere}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(item, isMultiple) + pronounVerb(item, "'be", true) + " not something you can move.");
    return false;
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




tp.addDirective("charger_state", function(){
  if (w.charger_compartment.closed) {
    return "The compartment is closed";
  }
  const contents = w.charger_compartment.getContents();
  if (contents.length === 0) {
    return "The compartment is empty";
  }
  return "The compartment contains " + formatList(contents, {article:INDEFINITE});
});
