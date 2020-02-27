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





function firstTimeTesting() {
  firsttime(232646, function() {
    msg(spaces(5)+ "{font:trade winds:Te first time 10{sup:2} CH{sub:4} Er {smallcaps:This is small caps}.}")
  }, function() {
    msg("Every {huge:other} {big:time} betweeb {small:is} {tiny:very small} notmasl.")
  });
  const a = ["one", "two", "three"]
  console.log(a)
  arrayRemove(a, "two")
  console.log(a)
  arrayRemove(a, "three")
  console.log(a)
  arrayRemove(a, "three")
  console.log(a)
  arrayRemove(a, "one")
  console.log(a)
}






commands.unshift(  new Cmd('Alpha', {
  regex:/^alpha$/,
  script:function() {
    msg("Some text in Greek: {encode:391:3AC:The quick brown fox jumped over the lazy dog}.")
    msg("Some text in Cyrillic: {encode:402:431:The quick brown fox jumped over the lazy dog}.")
    msg("Some text in Armenian {encode:531:561:The quick brown fox jumped over the lazy dog}.")

    msg("Some text in Devanagari: {encode:904:904:The quick brown fox jumped over the lazy dog}.")
    msg("Some text in Thai {encode:E01:E01:The quick brown fox jumped over the lazy dog}.")
    msg("Some text in Tibetan {encode:F20:F20:The quick brown fox jumped over the lazy dog}.")
    msg("Some text in Khmer {encode:1780:1780:The quick brown fox jumped over the lazy dog}.")
    msg("Some text in Javan {encode:A985:A985:The quick brown fox jumped over the lazy dog}.")
    msg("Some text in Nko {encode:7C1:7C1:The quick brown fox jumped over the lazy dog}.")
  },
}));
  





commands.unshift(new Cmd('EgKick', {
  npcCmd:true,
  rules:[cmdRules.isHere],
  regex:/^(kick) (.+)$/,
  objects:[
    {ignore:true},
    {scope:parser.isPresent}
  ],
  default:function(item, isMultiple, char) {
    return failedmsg(prefix(this, isMultiple) + lang.pronounVerb(char, "kick", true) + " " + this.pronouns.objective + ", but nothing happens.");
  },
}));



commands.unshift(new Cmd('EgCharge', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  regex:/^(charge) (.+)$/,
  objects:[
    {ignore:true},
    {scope:parser.isHeld}
  ],
  default:function(item, isMultiple, char) {
    return failedmsg(prefix(item, isMultiple) + lang.pronounVerb(item, "'be", true) + " not something you can charge.");
  },
}));


commands.unshift(new Cmd('EgMove', {
  npcCmd:true,
  rules:[cmdRules.isHere],
  regex:/^(move) (.+)$/,
  objects:[
    {ignore:true},
    {scope:parser.isHere}
  ],
  default:function(item, isMultiple, char) {
    return failedmsg(prefix(item, isMultiple) + lang.pronounVerb(item, "'be", true) + " not something you can move.");
  },
}));


commands.unshift(  new Cmd('EgHint', {
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
  



commands.unshift(  new Cmd('EgPrint', {
    regex:/^print$/,
    script:function() {
      typeWriter.write('p', 'The first line.');
      typeWriter.write('p', '2');
      typeWriter.write('p', '');
      typeWriter.write('f', function() { console.log('here') } );
      typeWriter.write('p', 'Third line');
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
