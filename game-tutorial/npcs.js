"use strict"

createItem("robot", NPC(false), {
  loc:"laboratory",
  examine:"The robot is approximately man-shaped, if a little squat. It looks a little... clunky, like might have been designed in the fifties.",
  strong:true,

  eventActive:function() { w.me.loc === 'laboratory' },
  eventPeriod:1,
  eventScript:function() {
    if (w.me.hints < 250 && this.loc === 'reactor_room') {
      msg("You noti.")
      tmsg("Of course, there may be other topics you can ask about, so you might want to experiment. But that does NOT mean you should start asking about every rude word you can think of.")
      w.me.hints = 220
    }
  },

  isAtLoc:function(loc, situation) {
    if (situation === world.PARSER && w.me.loc === 'laboratory') return true
    return (this.loc === loc)
  },

  askOptions:[
    {
      name:'laboratory',
      test:function(p) {
        return p.text.match(/\b(lab|laboratory)\b/) 
      },
      script:function() {
        msg("'What sort of lab is this?' you ask the robot.")
        msg("'This is Professor Kleinscope's zeta-particle laboratory,' says the robot grandly.")
        if (w.me.hints < 220) {
          tmsg("When you ask about one topic, you might learn about others. If you are stuck, try the TOPICS command. In Quest 6, topics are determined according to the character, so you need to specific that, i.e., TOPICS FOR ROBOT.")
          tmsg("Of course, there may be other topics you can ask about, so you might want to experiment. But that does NOT mean you should start asking about every rude word you can think of.")
          w.me.hints = 220
        }
      }
    },
    {
      name:'Professor Kleinscope',
      test:function(p) { return p.text.match(/\b(professor|kleinscope)\b/) },
      script:function() {
        msg("'Who is Professor Kleinscope?' you ask the robot.")
        msg("'Professor Kleinscope is the pre-eminent authority on zeta-particles,' says the robot, not to helpfully.")
        msg("'Okay... go on.'")
        msg("'Oh. Professor Kleinscope graduated from Keele University with a B.Sc. in physics, and later from Alabama Evangelical Bible College with a Ph.D. in an unspecified subject. Since then, he has been engaged in important post-graduate work under the Tutorial House.'")
      }
    },
    {
      name:'Zeta-particles',
      test:function(p) { return p.text.match(/\b(zeta)\b/) },
      script:function() {
        msg("'What is a zeta-particle?' you ask the robot.")
        msg("'Zeta-particles were discovered in Atlantis over 300 years ago, but knowledge of them was lost when that great city disappeared. They offer unlimited power and a cure for all diseases,' says the robot.")
        if (w.me.hints < 230) {
          tmsg("Great, you are having a conversation with someone. Now we know all about zeta-particles, let's see if we can get him to do something, like open the door to the north. You can try ASK ROBOT TO OPEN THE DOOR or ROBOT,OPEN DOOR.")
          w.me.hints = 230
        }
      }
    },
    {
      name:'reactor',
      test:function(p) { return p.text.match(/\b(reactor)\b/) && w.me.hints >= 250 },
      script:function() {
        msg("'How do I turn off the reactor?' you ask the robot.")
        msg("'The control rod must be removed from the core and placed in the repository,' says the robot.")
      }
    },
    {
      test:function(p) { return p.text.match(/atlantis/) },
      script:function() {
        msg("'Did you say Atlantis? What is that about?'")
        msg("'Atlantis is the name of a technologically-advanced city that disappeared 2954 years ago,'  says the robot. 'It supposedly sunk, but Professor Kleinscope believes it actually moved into another dimension, using zeta-particles.'")
      }
    },
    {
      test:function(p) { return p.text.match(/fuck|shit|crap|wank|cunt|masturabat|tit|cock|pussy|dick/) },
      script:function() {
        msg("The robot certainly has no interest in {i:that}!")
        if (!this.flag) {
          tmsg("I'm not angry.")
          tmsg("Just disappointed.")
          this.flag = true
        }
      },
      failed:true,
    },
    {
      msg:"The robot has no interest in that.",
      failed:true,
    }
  ]    
})



createItem("Professor_Kleinscope", NPC(false), {
  loc:"laboratory",
  examine:"The Professor is a slim tall man, perhaps in his forties, dressed, inevitably in a lab coat. Curiously his hair is neither white nor wild.",
  talkto:function() {
    switch (this.talktoCount) {
      case 0 : msg("You say 'Hello,' to Professor Kleinscope, and he replies in kind."); break;
      case 1 : msg("You ask Mary how to get upstairs. 'You know,' she replies, 'I have no idea.'"); break;
      case 2 : msg("'Where do you sleep?' you ask Mary."); msg("'What's \"sleep\"?'"); break;
      default: msg("You wonder what you can talk to Mary about."); break;
    }
  },
})


