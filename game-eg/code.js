"use strict";







// This function will be called at the start of the game, so can be used
// to introduce your game.
settings.setup = function() {


  game.player.hitpoints = 20;
  game.player.status = "You are feeling fine";
  io.updateStatus()
}



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




commands.unshift(new Cmd('Test input', {
  npcCmd:true,
  rules:[cmdRules.isHere],
  regex:/^inp/,
  script:function() {
    msg("First some preamble...")
    showMenu("What colour?", [w.book, w.coin, w.Kyle, 'None of them'], function(result) {
      if (typeof result === 'string') {
        msg("You picked " + result + ".");
      }
      else {
        msg("You picked " + result.byname({article:DEFINITE}) + ".");
      }
    })
/*    askQuestion("What colour?", function(result) {
      msg("You picked " + result + ".");
      showYesNoMenu("Are you sure?", function(result) {
        msg("You said " + result + ".")
      })
    })*/
  }
}));



commands.unshift(  new Cmd('TextReveal', {
  regex:/^reveal$/,
  script:function() {
    msg("Some text")
    msg("More")
    _msg("The real message is revealed!!", {}, {action:'effect', tag:'pre', effect:io.unscrambleEffect, randomPlacing:true, incSpaces:true, pick:function(i) {return 'At first this message is shown'.charAt(i) }})
    wait()
    _msg("Or appears as though typed.", {}, {action:'effect', tag:'p', effect:io.typewriterEffect})
    _msg("The characters will appear randomly from dots.", {}, {action:'effect', tag:'p', effect:io.unscrambleEffect, randomPlacing:true, pick:function() {return '.' }})
    wait()
    clearScreen()
    msg("Some more text.")
    wait(3, "Wait three seconds...")
    msg("... and done!")
  },
}));
  
commands.unshift(  new Cmd('Image', {
  regex:/^img$/,
  script:function() {
    msg("Some more text.")
    picture('favicon.png')
  },
}));
  
commands.unshift(  new Cmd('Audio', {
  regex:/^beep$/,
  script:function() {
    msg("Can you hear this?")
    sound('hrn06.wav')
  },
}));
  



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
  





tp.addDirective("charger_state", function(){
  if (w.charger_compartment.closed) {
    return "The compartment is closed";
  }
  const contents = w.charger_compartment.getContents(world.LOOK);
  if (contents.length === 0) {
    return "The compartment is empty";
  }
  return "The compartment contains " + formatList(contents, {article:INDEFINITE});
});
