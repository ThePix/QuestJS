'use strict'
import { io, template, npc, world } from './main.js'

template.createItem('me',
  template.PLAYER(),
  { loc: 'sickbay', regex: /^(me|myself|player)$/, examine: 'Just a regular guy.' }
)

template.createItem('all_tool',
  {
    loc: 'me',
    alias: 'AllTool',
    getVerbs: function () { return ['Examine', 'Use'] },
    examine: 'Your AllTool is a high-spec version of the device. You can use it to access numerous databases and IT systems, as well as controlling certain drones and make cyber attacks. For reasons that I am sure are obvious, you would need to go to a terminal to read your e-mails.|[Do USE ALLTOOL to look things up on it.]',
    getTopics: npc.npcUtilities.getTopics,
    use: npc.npcUtilities.talkto,
    pause: function () {}
  }
)

template.createItem('consult_brittany',
  npc.createItem(true),
  {
    loc: 'all_tool',
    alias: 'Ship: Brittany',
    nowShow: ['consult_fastness', 'consult_fastness_council'],
    script: function () {
      io.msg('{b:Ship: Brittany}|The SS Brittany was a frigate of the Systems Accord fleet, fitted with specialised stealth and exploration equipment It was lost in a battle with the Gith six months ago.')
    }
  }
)

template.createItem('consult_accord',
  npc.createItem(true),
  {
    loc: 'all_tool',
    alias: 'Organisation: Systems Accord',
    nowShow: ['consult_fastness', 'consult_fastness_council'],
    script: function () {
      io.msg('{b:Organisation: Systems Accord}|The Accord is an agreement between Earth and most human colony worlds. It involves trade agreements, defence agreements and a common legal system. it was established in 2465, and now includes over sixty worlds, howabout at least twenty human colonies are not part of the Accord, feeling it to be too restrictive.')
    }
  }
)

template.createItem('consult_garmr',
  npc.createItem(true),
  {
    loc: 'all_tool',
    alias: 'Organisation: GARMR',
    nowShow: ['consult_fastness', 'consult_fastness_council'],
    script: function () {
      io.msg('{b:Organisation: GARMR}|GARMR is a para-milirary organisation that hold to human supremacy at the expense of other species. Due to their disregard for the lives of alien species in their activities, they are considered a terrorist organisation by both the Systems Accord and the Fastness Council.|GARMR stands for Guardian Agent Response for Mankind Required. That it is als the name of the guarddog of Hell in Norse mythology is just coincidence...')
    }
  }
)

template.createItem('consult_fastness',
  npc.createItem(false),
  {
    loc: 'all_tool',
    alias: 'Station: Fastness',
    script: function () {
      io.msg('{b:Station: Fastness}|The Fastness is a huge, deep-space orbital, built eons ago. As an independent site, it has become a meeting place of all the great space-faring aliens, and is the home of the Fastness Council|It is definitely not a trap.')
    }
  }
)

template.createItem('consult_fastness_council',
  npc.createItem(false),
  {
    loc: 'all_tool',
    alias: 'Organisation: Fastness Council',
    script: function () {
      io.msg('{b:Organisation: Fastness Council}|The council is the body responsibly for resolving inter-species disputes, and is run by the more important space-faring races (in their opinion anyway).')
    }
  }
)

world.createItem('brittany_lift',
  world.createItem('north'),
  {
    desc: 'The lift is large and well l;it, with a set of buttons at the back.',
    north: new world.Exit('flight_deck')
  }
)
template.createItem('button_1',
  world.createItem('brittany_lift'),
  {
    alias: 'Button: 1',
    examine: 'A button with the number 1 on it.',
    transitDest: 'captains_room',
    transitAlreadyHere: 'You press the button; nothing happens.',
    transitGoToDest: 'You press the button; the door closes  and the lift goes to level 1.'
  }
)
template.createItem('button_2',
  world.createItem('brittany_lift'),
  {
    alias: 'Button: 2',
    examine: 'A button with the number 2 on it.',
    transitDest: 'flight_deck',
    transitAlreadyHere: 'You press the button; nothing happens.',
    transitGoToDest: 'You press the button; the door closes  and the lift goes to level 2.'
  }
)
template.createItem('button_3',
  world.createItem('brittany_lift'),
  {
    alias: 'Button: 3',
    examine: 'A button with the number 3 on it.',
    transitDest: 'mess',
    transitAlreadyHere: 'You press the button; nothing happens.',
    transitGoToDest: 'You press the button; the door closes  and the lift goes to level 3.'
  }
)

world.createItem('captains_room',
  {
    desc: '.',
    south: world.Exit('brittany_lift')
  }
)

world.createItem('flight_deck',
  {
    desc: 'From here, you cmmand the ship. Forward is the galaxy map, a huge holographic util.display you can use to plot a destination. Beyond, is the cockpit, where the pilot sits.',
    south: world.Exit('brittany_lift'),
    north: world.Exit('cockpit'),
    west: world.Exit('armoury'),
    east: world.Exit('laboratory')
  }
)

world.createItem('cockpit',
  {
    desc: 'This is where Jester sits... {once:All the time. Seriously, it is like he eats and sleeps here. Does he never go to the bathroom? Jester is sat in a contour chair, and is surrounded by screens, giving an all arouund view of outside of the ship. {once:About half of the are filled with Lambda Station.}',
    south: new world.Exit('flight_deck')
  }
)

world.createItem('armoury',
  {
    desc: '.',
    east: new world.Exit('flight_deck')
  }
)

world.createItem('laboratory',
  {
    desc: '.',
    west: new world.Exit('flight_deck')
  }
)

world.createItem('mess',
  {
    desc: '.',
    south: new world.Exit('britanny_lift'),
    north: new world.Exit('guns_battery'),
    east: new world.Exit('sickbay'),
    west: new world.Exit('malinda_office'),
    afterFirstEnter: function () {
      io.msg("A man steps up to you. 'Commander Herdsman, it's an honour to finally meet you.' He is dressed in a military uniform - the insignia is GARMR. 'I'm James Couturier. I'm the weapons specialist assigned to the Brittany. You can usually find me in the armoury, but when I heard you were awake, I just had to come and talk to the greatesrt man ever.'")
    }
  }
)

world.createItem('guns_battery',
  {
    desc: '.',
    south: new world.Exit('mess')
  }
)

world.createItem('sickbay',
  {
    desc: 'The sickbay is small, with just two beds on one side, and a desk on the other. Nevertheless, it looks very well equipped, with various monitors and devices surrounding each bed.',
    west: new world.Exit('mess')
  }
)

template.createItem('quechua',
  npc.NPC(true),
  {
    alias: 'Dr Quechua',
    regex: /doctor|quechua|dr/,
    loc: 'sickbay',
    examine: 'Dr Quechua is much as you remember her, if perhaps a little greyer. She is slim, and a little on the short side. She has grey, caring eyes, and a warm smile. She is wearing a white lab coat with a GARMR logo on it.'
  }
)

template.createItem('quechua_what_was_wrong',
  npc.createItem(true),
  {
    loc: 'quechua',
    alias: 'What was wrong with me?',
    // nowShow: ["consult_fastness", "consult_fastness_council"],
    script: function () {
      io.msg('.')
    }
  }
)

world.createItem('malinda_office',
  {
    desc: '.',
    east: new world.Exit('mess')
  }
)
