"use strict";














new Cmd('TestInput', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  regex:/^inp/,
  script:function() {
    msg("First some preamble...")
    showMenu("What colour?", [w.book, w.coin, w.Kyle, 'None of them'], function(result) {
      if (typeof result === 'string') {
        msg("You picked " + result + ".");
      }
      else {
        msg("You picked " + lang.getName(result, {article:DEFINITE}) + ".");
      }
    })
/*    askText("What colour?", function(result) {
      msg("You picked " + result + ".");
      showYesNoMenu("Are you sure?", function(result) {
        msg("You said " + result + ".")
      })
    })*/
  }
})



new Cmd('TextReveal', {
  regex:/^reveal$/,
  script:function() {
    msg("Some text")
    msg("More")
    _msg("The characters will appear randomly from dots.", {}, {action:'effect', tag:'p', effect:io.unscrambleEffect, randomPlacing:true, pick:function() {return '.' }})
    wait()
    _msg("Or appears as though typed.", {}, {action:'effect', tag:'p', effect:io.typewriterEffect})
    _msg("The real message is revealed!!", {}, {action:'effect', tag:'pre', effect:io.unscrambleEffect, randomPlacing:true, incSpaces:true, pick:function(i) {return 'At first this message is shown'.charAt(i) }})
    wait()
    clearScreen()
    msg("Some more text.")
    wait(3, "Wait three seconds...")
    msg("... and done!")/**/
  },
})
  
new Cmd('Image', {
  regex:/^img$/,
  script:function() {
    msg("Some more text.")
    picture('favicon.png')
  },
})
  
new Cmd('Audio', {
  regex:/^beep$/,
  script:function() {
    msg("Can you hear this?")
    sound('hrn06.wav')
  },
})
  



new Cmd('Alpha', {
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
})




new Cmd('DialogTest', {
  npcCmd:true,
  regex:/^(?:dialog) (.*)$/,
  objects:[
    {special:'text'},
  ],
  script:function(objects) {
    const funcName = parser.currentCommand.tmp.string.replace(/dialog /i, '')
    console.log("Testing dialog: " + funcName)
    const choices = ['red', 'yellow', 'blue']
    io.menuFunctions[funcName]('Pick a colour?', choices, function(result) {
      msg("You picked " + result)
    })
    return world.SUCCESS_NO_TURNSCRIPTS
  },
})



new Cmd('TextTest', {
  npcCmd:true,
  regex:/^(?:text)$/,
  objects:[
  ],
  script:function(objects) {
    askDiag("What colour?", function(result) {
      msg("You picked " + result + ".");
    }, "Go")
    return world.SUCCESS_NO_TURNSCRIPTS
  },
})




new Cmd('EgKick', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  regex:/^(kick) (.+)$/,
  objects:[
    {special:'ignore'},
    {scope:parser.isPresent}
  ],
  defmsg:"{pv:char:kick:true} {ob:item}, but nothing happens.",
})



new Cmd('EgCharge', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  regex:/^(?:charge|power) (.+)$/,
  objects:[
    {scope:parser.isHeld}
  ],
  defmsg:"{pv:item:'be:true} not something you can charge.",
})


new Cmd('EgMove', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  regex:/^(move) (.+)$/,
  objects:[
    {special:'ignore'},
    {scope:parser.isHere}
  ],
  defmsg:"{pv:item:'be:true} not something you can move.",
})



const cmd = findCmd("OneWord")
cmd.regexes.push(/^(act)$/)
cmd.regexes.push(/^(perform)$/)
lang.no_act = "You do a quick scene from Hamlet because... it seems a good idea?"
lang.oneWordSubsts.perform = 'act'



/*
findCmd('MetaHint').script = function() {
  if (w[player.loc].hint) {
    metamsg(w[player.loc].hint);
  }
  else {
    return lang.hintScript()
  }
}
  


const clues = [
  {
    question:'How do I get the hat?',
    clues: [
      'What is the lamp for?',
      'What happens if you rub the lamp?',
      'Rub the lamp, and ask the genie.',
    ],
  },
  {
    question:'Where is the bear?',
    clues: [
      'In the lounge, where you started.',
    ],
  },
]


// How to save???
findCmd('MetaHint').script = function() {
  for (let clue of clues) {
    if (clue.count === undefined) clue.count = 0
    metamsg(clue.question)
    for (let i = 0; i < clue.clues.length; i++) {
      if (i < clue.count) {
        metamsg(clue.clues[i])
      }
      else {
        // hidden!!!
        metamsg(clue.clues[i])
      }
    }
  }
}
 */


settings.hintSheetData = [
  {q:'Stuck in the library?', a:'kill goblin'},
  {q:'Stuck at the dorm courtyard?', a:'pull the torch'},
  {q:'Bothered by the witch?', a:'wear the pearl necklace'},
]
                





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



lang.createVerbWith("Slice", {held:true, ing:'Slicing'})

/*
// This is not a properly written command, it is just to test the item order can be reversed.
new Cmd('SliceCarrot', {
  rules:[cmdRules.isHeld],
  regexes:[/^use (.+) to slice (.+)$/, /^use (.+) slice (.+)$/, {regex:/slice (.+) with (.+)/, mod:{reverse:true}}],
  objects:[
    {scope:parser.isPresent},
    {scope:parser.isPresent},
  ],
  script:function(objects) {
    msg("You slice {nm:ob1:the} with {nm:ob2:the}.", {ob1:objects[1][0], ob2:objects[0][0]})
    return world.SUCCESS
  },
  defmsg:"Not going to happen.",
}));*/