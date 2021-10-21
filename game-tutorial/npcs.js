"use strict"

createItem("robot", NPC(false), {
  loc:"laboratory",
  examine:"The robot is approximately man-shaped, if a little squat. It looks a little... clunky, like might have been designed in the fifties.",
  strong:true,
  attachable:true,
/*  eventIsActive:function() { w.me.loc === 'laboratory' },
  eventPeriod:1,
  eventScript:function() {
    if (w.me.hints < 250 && this.loc === 'reactor_room') {
      msg("You noti.")
      tmsg("Of course, there may be other topics you can ask about, so you might want to experiment. But that does NOT mean you should start asking about every rude word you can think of.")
      w.me.hints = 220
    }
  },*/

  isLocatedAt:function(loc, situation) {
    if (situation === world.PARSER && w.me.loc === 'laboratory') return true
  },
  
  getAgreementGo:function(ex) {
    if (w.rope.isAttachedTo(this)) {
      msg("'I cannot move while tied to the rope.'");
      if (!this.ropeMoveFlag) {
        this.ropeMoveFlag = true
        tmsg("Let's be honest here, ropes are tricky to code. Be thankful you can tie it to the robot and forget about him walking around dragging the rope behind him.")
      }
      return false;
    }
    return true;
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
        msg("'Zeta-particles were discovered in Atlantis over 3000 years ago, but knowledge of them was lost when that great city disappeared. They offer unlimited power and a cure for all diseases,' says the robot.")
        if (w.me.hints < 230) {
          tmsg("Great, you are having a conversation with someone. But it is Professor Kleinscope we want to talk to, so let's take the lift up to him.")
          w.me.hints = 230
        }
      }
    },
    {
      name:'reactor',
      test:function(p) { return p.text.match(/\b(reactor)\b/) && w.me.hints >= 250 },
      script:function() {
        msg("'How do I turn on the reactor?' you ask the robot. 'And where is it, anyway?'")
        msg("'The control rod must be placed in the reactor core,' says the robot. 'The reactor is through the door to the north.'")
        if (w.me.hints < 270) {
          tmsg("So we need to head north, but that door is too heavy to open yourself; you need to get the robot to do it. We can tell the robot to do something with TELL ROBOT TO. followed by the usual command, or just ROBOT, (note the comma). Once the door is open, head to the reactor.")
          w.me.hints = 270
        }
      }
    },
    {
      name:'lift',
      test:function(p) { return p.text.match(/\b(lift|elevator)\b/) && w.lift.visited > 0 },
      script:function() {
        msg("'What's the deal with the lift?' you ask the robot.")
        if (w.reactor_room.reactorRunning) {
          msg("'The zeta-lift - or zeta-elevator - is operating normally,' says the robot.")
        }
        else {
          msg("'The zeta-lift - or zeta-elevator - is powered by the zeta-reactor, which is currently not running,' says the robot.")
        }
        if (w.me.hints < 260) {
          tmsg("We need to So we need the reactor to be running. Better ask the robot about that.")
          w.me.hints = 260
        }
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
  ],
  tellOptions:[
    {
      name:'vomit',
      test:function(p) {
        return p.text.match(/\b(vomit|puke|sick)\b/) && w.vomit.loc === 'reactor_room'  
      },
      script:function() {
        msg("'Er, so it looks like there might be some vomit over there,' you say, a little sheepishly.")
        msg("'I suppose you expect me to clean it up?' he replies.")
        msg("'Well, you are a robot...'")
        msg("'And therefore subservient?'")
        msg("'No, no... Er, and therefore you have no sense of smell.'")
        msg("'Hmm. I will deal with the erstwhile contents of your stomach in a bit.'")
      },
      failed:true,
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
  ],
})



createItem("Professor_Kleinscope", NPC(false), {
  loc:"office",
  examine:"The Professor is a slim tall man, perhaps in his forties, dressed, inevitably in a lab coat. Curiously his hair is neither white nor wild.{ifNot:Professor_Kleinscope:flag: He is sat at he desk, engrossed in his work.}",
  talk:function() {
    if (!this.flag) {
      msg("You say 'Hello,' to Professor Kleinscope.")
      msg("He looks up, apparently seeing you for the first time. 'Hello,yes?'")
      msg("'Your dinner is ready.'")
      msg("'What? Already? Well, I better get downstairs then!' He gets to his feet.")
      tmsg("Maybe now he is not sitting there we can use the computer.")
      this.flag = true
      w.me.hints = 410
      this.setAgenda([
        "text:The Professor locks his computer.", 
        "text:Professor Kleinscope heads to the lift.", 
        "moveTo:lounge:Professor Kleinscope emerges from the lift, and glances round the room as though it is unfamiliar to him.",
        "waitFor:player:'Now what was I doing?' says Professor Kleinscope to himself.",
        "text:Professor Kleinscope heads to the kitchen.",
        "moveTo:kitchen:Professor Kleinscope enters the kitchen.",
        "waitFor:player:'Oh, you're here too,' says Professor Kleinscope.",
        "text:'Now, where's my dinner?' says Professor Kleinscope. 'Are you sure you got the message right?'",
      ])
    }
    else {
      msg("'Professor?'");
      msg("'Not now, my boy,' he says. He looks at you again. 'You are a boy, aren't you? Important appointment with my dinner!'");
    }
  },
 getAgreement:function() {
    msg("'I'm far to busy to do that!' says Kleinscope indignantly.");
    return false;
  },
})


