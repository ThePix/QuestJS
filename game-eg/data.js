'use strict'
import { io, templates, util, npc, world, commands, cmdRules, w, lang, game, defaults } from '../lib/main'

('me', templates.PLAYER(), {
  loc: 'lounge',
  regex: /^(me|myself|player)$/,
  money: 10,
  examine: function (isMultiple) {
    io.msg(util.util.prefix(this, isMultiple) + 'A ' + (this.isFemale ? 'chick' : 'guy') + ' called ' + this.alias)
  }
})

('knife',
  templates.TAKEABLE(),
  {
    loc: 'me',
    sharp: false,
    examine: function (isMultiple) {
      if (this.sharp) {
        io.msg(util.util.prefix(this, isMultiple) + 'A really sharp knife.')
      } else {
        io.msg(util.util.prefix(this, isMultiple) + 'A blunt knife.')
      }
    },
    chargeResponse: function (participant) {
      io.msg('There is a loud bang, and the knife is destroyed.')
      delete this.loc
      return false
    }
  }
)

world.createItem('lounge', {
  desc: 'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
  east: new world.Exit('kitchen'),
  west: new world.Exit('dining_room'),
  south: new world.Exit('conservatory'),
  up: new world.Exit('bedroom'),
  hint: 'There is a lot in this room! The bricks can be picked up by number (try GET 3 BRICKS). The book can be read. The coin is stuck to the floor. There are containers too. Kyle is an NPC; you can tell him to do nearly anything the player character can do (everything except looking and talking).'
})

world.createItem('dining_room_on_stool', {
  desc: 'Stood on a stool, in an old-fashioned room.',
  east: new world.Exit('lounge'),
  down: new world.Exit('dining_room'),
  alias: 'dining room (on a stool)'
  // loc:"dining_room",
})

world.createItem('hole', {
  desc: 'An old-fashioned room.'
})

('book',
  templates.TAKEABLE(),
  {
    loc: 'lounge',
    examine: 'A leather-bound book.',
    heldVerbsX: ['Read'],
    read: function (isMultiple, char) {
      if (cmdRules.isHeld(null, char, this, isMultiple)) {
        if (char === w.Lara) {
          io.msg("'Okay.' Lara spends a few minutes reading the book.")
          io.msg("'I meant, read it to me.'")
          io.msg("'All of it?'")
          io.msg("'Quick summary.'")
          io.msg("'It is all about carrots. The basic gist is that all carrots should be given to me.' You are not entirely sure you believe her.")
        } else {
          io.msg(util.prefix(this, isMultiple) + 'It is not in a language ' + lang.pronounVerb(char, 'understand') + '.')
        }
        return true
      } else {
        return false
      }
    },
    lookinside: 'The book has pages and pages of text, but you do not even recongise the text.'
  }
)

('book_cover',
  templates.COMPONENT('book'),
  { examine: 'The book cover is very fancy.' }
)

('boots',
  templates.WEARABLE(),
  { loc: 'lounge', pronouns: lang.pronouns.plural, examine: 'Some old boots.' }
)

('waterskin',
  templates.TAKEABLE(),
  {
    examine: function (isMultiple) { io.msg(util.prefix(item, isMultiple) + 'The waterskin is ' + Math.floor(this.full / this.capacity * 100) + '% full.') },
    capacity: 10,
    full: 3,
    loc: 'lounge',
    fill: function (isMultiple) {
      if (game.player.loc !== 'garage') {
        io.msg(util.util.prefix(this, isMultiple) + 'There is nothing to charge the torch with here.')
        return false
      } else {
        io.msg(util.util.prefix(this, isMultiple) + 'You charge the torch - it should last for hours now.')
        this.power = 20
        return true
      }
    }
  }
)

('glass_cabinet',
  defaults.CONTAINER(true),
  templates.lockedWith('cabinet_key'),
  {
    alias: 'glass cabinet',
    examine: 'A cabinet with a glass front.',
    transparent: true,
    isAtLoc: function (loc) {
      if (typeof loc !== 'string') loc = loc.name
      return (loc === 'lounge' || loc === 'dining_room')
    }
  }
)

('jewellery_box',
  templates.TAKEABLE(),
  defaults.CONTAINER(true),
  { loc: 'glass_cabinet', alias: 'jewellery box', examine: 'A nice box.', closed: false }
)

('ring',
  templates.TAKEABLE(),
  { loc: 'jewellery_box', examine: 'A ring.' }
)

('cardboard_box',
  templates.TAKEABLE(),
  defaults.CONTAINER(true),
  { loc: 'lounge', alias: 'cardboard box', examine: 'A big cardboard box.', closed: false }
)

('sandwich',
  defaults.EDIBLE(false),
  { loc: 'lounge', examine: 'A tasty looking thing.', onIngesting: function () { io.msg('That was Great!') } }
)

('ornate_doll',
  templates.TAKEABLE(),
  { loc: 'glass_cabinet', alias: 'ornate doll', examine: 'A fancy doll, eighteenth century.' }
)

('coin',
  templates.TAKEABLE(),
  {
    loc: 'lounge',
    examine: 'A gold coin.',
    take: function (isMultiple, participant) {
      io.msg(util.util.prefix(this, isMultiple) + lang.pronounVerb(participant, 'try', true) + ' to pick up the coin, but it just will not budge.')
      return false
    }
  }
)

('small_key',
  templates.TAKEABLE(),
  { loc: 'lounge', examine: 'A small key.', alias: 'small key' }
)

('flashlight', templates.TAKEABLE(), templates.SWITCHABLE(false), {
  loc: 'lounge',
  examine: 'A small red torch.',
  regex: /^torch$/,
  byname: function (options) {
    let res = this.alias
    if (options.article) { res = (options.article === util.DEFINITE ? 'the' : 'a') + ' ' + this.alias }
    if (this.switchedon && options.modified) { res += ' (providing light)' }
    return res
  },
  lightSource: function () {
    return this.switchedon ? util.LIGHT_FULL : util.LIGHT_none
  },
  eventPeriod: 1,
  eventIsActive: function () {
    return this.switchedon
  },
  eventScript: function () {
    this.power--
    if (this.power === 2) {
      io.msg('The torch flickers.')
    }
    if (this.power < 0) {
      io.msg('The torch flickers and dies.{once: Perhaps there is a charger in the garage?}')
      this.doSwitchoff()
    }
  },
  checkCanSwitchOn () {
    if (this.power < 0) {
      io.msg('The torch is dead.')
      return false
    }
    return true
  },
  power: 2,
  chargeResponse: function (participant) {
    io.msg(lang.pronounVerb(participant, 'push', true) + ' the button. There is a brief hum of power, and a flash.')
    w.flashlight.power = 20
    return true
  }
})

world.createItem('dining_room', {
  desc: 'An old-fashioned room.',
  east: new world.Exit('lounge'),
  west: new world.Exit('lift'),
  canViewLocs: ['garden'],
  canViewPrefix: 'Through the window you can see ',
  up: new world.Exit('dining_room_on_stool'),
  alias: 'dining room',
  hint: 'This room features an NPC who will sometimes do as you ask. Compliment her, and she will go to another room, and with then pick things up and drop them (but not bricks). Also not that the glass cabinet is in this room as well as the lounge.'
})

('chair',
  templates.FURNITURE({ sit: true }),
  {
    loc: 'dining_room',
    examine: 'A wooden chair.',
    onsitting: function (char) {
      io.msg('The chair makes a strange noise when ' + lang.nounVerb(char, 'sit') + ' on it.')
    }
  }
)

world.createItem('lift',
  world.createItem('east'),
  {
    desc: 'A curious lift.',
    east: new world.Exit('dining_room'),
    transitMenuPrompt: 'Where do you want to go?'
    // afterEnter:transitOfferMenu,
    // transitAutoMove:true,
    // transitOnMove:function(toLoc, fromLoc) { io.debugmsg("MOVING to " + toLoc + " from " + fromLoc); },
    // transitCheck:function() {
    //  io.msg("The lift is out of order");
    //  return false;
    // },
  }
)

// calling it button_0 make it appear before button_1 in lists
('button_0',
  world.createItem('lift'),
  {
    alias: 'Button: G',
    examine: 'A button with the letter G on it.',
    transitDest: 'dining_room',
    transitDestAlias: 'Ground Floor',
    transitAlreadyHere: "You're lang.already there mate!",
    transitGoToDest: 'The old man presses the button....'

  }
)

('button_1',
  world.createItem('lift'),
  {
    alias: 'Button: 1',
    examine: 'A button with the letter 1 on it.',
    transitDest: 'bedroom',
    transitDestAlias: 'The Bedroom',
    transitAlreadyHere: 'You press the button; nothing happens.',
    transitGoToDest: 'You press the button; the door closes and the lift heads to the first floor. The door opens again.'

  }
)

('button_2',
  world.createItem('lift'),
  {
    alias: 'Button: 2',
    examine: 'A button with the letter 2 on it.',
    transitDest: 'attic',
    transitDestAlias: 'The Attic',
    locked: true,
    transitAlreadyHere: 'You press the button; nothing happens.',
    transitGoToDest: 'You press the button; the door closes and the lift heads to the second floor. The door opens again.',
    transitLocked: 'That does nothing, the button does not work.'
  }
)

world.createItem('attic', {
  desc: 'An spooky attic.',
  west: new world.Exit('lift')
})

world.createItem('kitchen', {
  desc: 'A clean room{if:clock:scenery:, a clock hanging on the wall}. There is a sink in the corner.',
  west: new world.Exit('lounge'),
  down: new world.Exit('basement', {
    isHidden: function () { return w.trapdoor.closed },
    msg: function (isMultiple, char) {
      if (char === game.player) {
        io.msg('You go through the trapdoor, and down the ladder.')
      } else {
        io.msg('You watch ' + char.byname({ article: util.DEFINITE }) + ' disappear through the trapdoor.')
      }
    }
  }),
  north: new world.Exit('garage', { use: commands.useWithDoor, door: 'garage_door', doorName: 'garage door' }),
  afterFirstEnter: function () {
    io.msg('A fresh smell here!')
  },
  hint: 'This room features two doors that open and close. The garage door needs a key.',
  source: 'water'
})

('clock',
  templates.TAKEABLE(),
  { loc: 'kitchen', scenery: true, examine: 'A white clock.' }
)

('trapdoor',
  templates.OPENABLE(false),
  { loc: 'kitchen', examine: 'A small trapdoor in the floor.' }
)

('camera',
  templates.TAKEABLE(),
  { loc: 'kitchen', examine: 'A cheap digital camera.', regex: /^picture box$/ }
)

('big_kitchen_table',
  templates.SURFACE(),
  { loc: 'kitchen', examine: 'A Formica table.' }
)

('garage_door',
  templates.OPENABLE(false),
  templates.lockedWith('garage_key'),
  {
    examine: 'The door to the garage.',
    alias: 'garage door',
    isAtLoc: function (loc) {
      if (typeof loc !== 'string') loc = loc.name
      return (loc === 'kitchen' || loc === 'garage')
    }
  }
)

('jug', templates.VESSEL(4), templates.TAKEABLE(), {
  loc: 'big_kitchen_table',
  examine: 'A small jug, stripped blue and white.'
})

('kitchen_sink', {
  loc: 'kitchen',
  scenery: true,
  examine: 'A dirty sink.',
  isSourceOf: function (subst) { return subst === 'water' || subst === 'lemonade' }
})

('water', templates.LIQUID(), {
})

('honey', templates.LIQUID(), {
})

('lemonade', templates.LIQUID(), {
})

world.createItem('basement', {
  desc: 'A dank room, with piles of crates everywhere.',
  darkDesc: 'It is dark, but you can just see the outline of the trapdoor above you.',
  up: new world.Exit('kitchen', { isHidden: function () { return false } }),
  lightSource: function () {
    return w.light_switch.switchedon ? util.LIGHT_FULL : util.LIGHT_none
  },
  hint: 'The basement illustrates light and dark. There is a torch in the lounge that may be useful.'
})

('light_switch',
  templates.SWITCHABLE(false),
  {
    loc: 'basement',
    examine: 'A switch, presumably for the light.',
    alias: 'light switch',
    checkCanSwitchOn: function () {
      if (!w.crates.moved) {
        io.msg('You cannot reach the light switch, without first moving the crates.')
        return false
      } else {
        return true
      }
    }
  }
)

('crates',
  {
    loc: 'basement',
    examine: 'A bunch of old crates.',
    move: function () {
      io.msg('You move the crates, so the light switch is accessible.')
      this.moved = true
      return true
    }
  }
)

world.createItem('garage', {
  desc: 'An empty garage.',
  south: new world.Exit('kitchen', { use: commands.useWithDoor, door: 'garage_door', doorName: 'kitchen door' }),
  hint: 'The garage features a complex mechanism, with two components.'
})

('charger',
  {
    loc: 'garage',
    examine: 'A device bigger than a washing machine to charge a torch? It has a compartment and a button. {charger_state}.',
    mended: false,
    use: function () {
      io.metamsg('To use the charge, you need to put the torch in the compartment and press the button.')
    }
  }
)

('charger_compartment',
  templates.COMPONENT('charger'),
  defaults.CONTAINER(true),
  {
    alias: 'compartment',
    examine: 'The compartment is just the right size for the torch. It is {if:charger_compartment:closed:closed:open}.',
    testRestrictions: function (item) {
      const contents = w.charger_compartment.getContents(util.display.LOOK)
      if (contents.length > 0) {
        io.msg('The compartment is full.')
        return false
      }
      return true
    }
  }
)

('charger_button',
  templates.COMPONENT('charger'),
  {
    examine: 'A big red button.',
    alias: 'button',
    push: function (isMultiple, participant) {
      const contents = w.charger_compartment.getContents(util.display.ALL)[0]
      if (!w.charger_compartment.closed || !contents) {
        io.msg(lang.pronounVerb(participant, 'push', true) + ' the button, but nothing happens.')
        return false
      } else if (!contents.chargeResponse) {
        io.msg(lang.pronounVerb(participant, 'push', true) + ' the button. There is a brief hum of power, but nothing happens.')
        return false
      } else {
        return contents.chargeResponse(participant)
      }
    }
  }
)

world.createItem('bedroom', {
  desc: 'A large room, with a big [bed] and a wardrobe.',
  down: new world.Exit('lounge'),
  in: new world.Exit('wardrobe'),
  west: new world.Exit('lift'),
  hint: 'The bedroom has a variety of garments that can be put on - in the right order.'
})

('wardrobe',
  world.DEFAULT_ROOM,
  {
    out: new world.Exit('bedroom'),
    loc: 'bedroom',
    examine: 'It is so big you could probably get inside it.',
    desc: 'Oddly empty of fantasy worlds.'
  }
)

('underwear',
  templates.WEARABLE(1, ['lower']),
  {
    loc: 'bedroom',
    pronouns: lang.pronouns.massnoun,
    examine: 'Clean!'
  }
)

('jeans',
  templates.WEARABLE(2, ['lower']),
  { loc: 'bedroom', pronouns: lang.pronouns.plural, examine: 'Clean!' }
)

('shirt',
  templates.WEARABLE(2, ['upper']),
  { loc: 'bedroom', examine: 'Clean!' }
)

('coat',
  templates.WEARABLE(3, ['upper']),
  { loc: 'bedroom', examine: 'Clean!' }
)

('jumpsuit',
  templates.WEARABLE(2, ['upper', 'lower']),
  { loc: 'bedroom', examine: 'Clean!' }
)

('suit_trousers',
  templates.WEARABLE(2, ['lower']),
  { loc: 'wardrobe', examine: 'The trousers.', pronouns: lang.pronouns.plural }
)

('jacket',
  templates.WEARABLE(3, ['upper']),
  { loc: 'wardrobe', examine: 'The jacket' }
)

('waistcoat',
  templates.WEARABLE(2, ['upper']),
  { loc: 'wardrobe', examine: 'The waistcoat' }
)

templates.createEnsemble('suit', [w.suit_trousers, w.jacket, w.waistcoat],
  { examine: 'A complete suit.', regex: /xyz/ }
)

world.createItem('conservatory', {
  desc: 'A light airy room.',
  north: new world.Exit('lounge'),
  west: new world.Exit('garden'),
  hint: 'The conservatory features a pro-active NPC.'
})

('crate',
  templates.FURNITURE({ stand: true }), templates.SHIFTABLE(),
  { loc: 'conservatory', examine: 'A large wooden crate, probably strong enough to stand on.' }
)

('broken_chair',
  { loc: 'conservatory', examine: 'A broken chair.' }
)

world.createItem('garden', {
  desc: 'Very overgrown. The garden backs onto a shop to the west, whilst the conservatory is east.',
  east: new world.Exit('conservatory'),
  west: new world.Exit('shop')
})

world.createItem('far_away', {
  north: new world.Exit('lounge')
})

('Arthur',
  templates.NPC(false),
  {
    loc: 'garden',
    examine: function (isMultiple) {
      if (this.suspended) {
        io.msg(util.util.prefix(item, isMultiple) + 'Arthur is asleep.')
      } else {
        io.msg(util.util.prefix(item, isMultiple) + 'Arthur is awake.')
      }
    },
    suspended: true,
    properName: true,
    agenda: [
      'text:Arthur stands up and stretches.',
      "text:'I'm going to find Lara, and show her the garden,' says Arthur.:'Whatever!'",
      "walkTo:Lara:'Hi, Lara,' says Arthur. 'Come look at the garden.'",
      "joinedBy:Lara:'Sure,' says Lara.",
      "walkTo:garden:inTheGardenWithLara:'Look at all the beautiful flowers,' says Arthur.:Through the window you see Arthur say something to Lara.",
      'text:Lara smells the flowers.'
    ],
    inTheGardenWithLara: function (arr) {
      if (this.here()) {
        io.msg(arr[0])
      }
      if (game.player.loc === 'dining_room') {
        io.msg(arr[1])
      }
    },
    talkto: function () {
      io.msg("'Hey, wake up,' you say to Arthur.")
      this.suspended = false
      this.pause()
      this.multiMsg([
        "'What?' he says, opening his eyes. 'Oh, it's you.'",
        "'I am awake!'",
        false,
        "'Stop it!'"
      ])
      return true
    }
  }
)

('Kyle', templates.NPC(false),
  {
    loc: 'lounge',
    examine: 'A grizzly bear. But cute.',
    properName: true,
    // agenda:["text:Hello", "wait:2:ending", "text:goodbye"],
    // agenda:["patrol:dining_room:lounge:kitchen:lounge"],
    askOptions: [
      {
        name: 'House',
        test: function (p) { return p.text.match(/house/) },
        msg: "'I like it,' says Kyle."
      },
      {
        name: 'Garden',
        test: function (p) { return p.text.match(/garden/) },
        responses: [
          {
            test: function (p) { return w.garden.fixed },
            msg: "'Looks much better now,' Kyle says with a grin."
          },
          {
            test: function (p) { return w.Kyle.needsWorkCount === 0 },
            msg: "'Needs some work,' Kyle says with a sign.",
            script: function (p) { w.Kyle.needsWorkCount++ }
          },
          {
            msg: "'I'm giving up hope of it ever getting sorted,' Kyle says."
          }
        ]
      },
      {
        test: function (p) { return p.text.match(/park/) },
        responses: [
          {
            name: 'Park',
            mentions: ['Swings'],
            msg: "'Going to the park sounds like fun,' Kyle says with a grin. 'We can go on the swings!'"
          }
        ]
      },
      {
        name: 'Fountain',
        test: function (p) { return p.text.match(/fountain/) && p.actor.specialFlag },
        msg: "'The fountain does not work.'"
      },
      {
        name: 'Swings',
        silent: true,
        test: function (p) { return p.text.match(/swing/) },
        msg: "'The swings are fun!'"
      },
      {
        msg: 'Kyle has no interest in that subject.',
        failed: true
      }
    ],
    needsWorkCount: 0,
    talkto: function () {
      switch (this.talktoCount) {
        case 0 : io.msg("You say 'Hello,' to Kyle, and he replies in kind."); break
        case 1 : io.msg("You ask Kyle how to get upstairs. 'You know,' he replies, 'I have no idea.'"); break
        case 2 : io.msg("'Where do you sleep?' you ask Kyle."); io.msg("'What's \"sleep\"?'"); break
        default: io.msg('You wonder what you can talk to Kyle about.'); break
      }
      this.pause()
      return true
    }
  })

('kyle_question', templates.QUESTION(), {
  responses: [
    {
      regex: /^(yes)$/,
      response: function () {
        io.msg("'Oh, cool,' says Kyle.")
      }
    },
    {
      regex: /^(no)$/,
      response: function () {
        io.msg("'Oh, well, Lara, this is Tester, he or she is util.testing Quest 6,' says Kyle.")
      }
    },
    {
      response: function () {
        io.msg("'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'")
        w.Kyle.askQuestion('kyle_question')
      }
    }
  ]
})

('straw_boater',
  templates.WEARABLE(false),
  { loc: 'Kyle', examine: 'A straw boater.', worn: true }
)

('Kyle_The_Garden',
  npc.createItem(true),
  {
    loc: 'Kyle',
    alias: "What's the deal with the garden?",
    nowShow: ['Mary_The_Garden_Again'],
    script: function () {
      io.msg("You ask Kyle about the garden, but he's not talking.")
    }
  }
)

('Kyle_The_Garden_Again',
  npc.createItem(false),
  {
    loc: 'Kyle',
    alias: "Seriously, what's the deal with the garden?",
    script: function () {
      io.msg("You ask Kyle about the garden, but he's STILL not talking.")
    }
  }
)

('Kyle_The_Weather',
  npc.createItem(true),
  {
    loc: 'Kyle',
    alias: 'The weather',
    script: function () {
      io.msg('You talk to Kyle about the weather.')
    }
  }
)

('Lara',
  templates.NPC(true),
  {
    loc: 'dining_room',
    examine: 'A normal-sized bunny.',
    properName: true,
    happy: false,
    giveReaction: function (item, multiple, char) {
      if (item === w.ring) {
        io.msg("'Oh, my,' says Lara. 'How delightful.' She slips the ring on her finger, then hands you a key.")
        w.ring.loc = 'Lara'
        w.ring.worn = true
        w.garage_key.loc = char.name
      }
      if (item === w.book) {
        io.msg("'Hmm, a book about carrots,' says Lara. 'Thanks.'")
        w.book.loc = 'Lara'
      } else {
        io.msg("'Why would I want {i:that}?'")
      }
    },
    getAgreementTake: function (item) {
      if (item === w.brick) {
        io.msg("'I'm not picking up any bricks,' says Lara indignantly.")
        return false
      }
      return true
    },
    getAgreementGo: function (dir) {
      if (!this.happy) {
        io.msg("'I'm not going " + dir + ",' says Lara indignantly. 'I don't like that room.'")
        return false
      }
      return true
    },
    getAgreementDrop: function () {
      return true
    },
    getAgreementStand: function () {
      return true
    },
    getAgreementRead: function () {
      return true
    },
    getAgreementPosture: function () {
      if (!this.happy) {
        io.msg("'I don't think so!' says Lara indignantly.")
        return false
      }
      return true
    },
    getAgreement () {
      io.msg("'I'm not doing that!' says Lara indignantly.")
      return false
    },
    canTalkPlayer: function () { return true },

    sayPriority: 3,
    sayResponses: [
      {
        regex: /^(hi|hello)$/,
        id: 'hello',
        response: function () {
          io.msg("'Oh, hello there,' replies Lara.")
          if (w.Kyle.isHere()) {
            io.msg("'Have you two met before?' asks Kyle.")
            w.Kyle.askQuestion('kyle_question')
          }
        }
      }
    ]
  }
)

('garage_key',
  templates.TAKEABLE(),
  { loc: 'lounge', examine: 'A big key.', alias: 'garage key' }
)

('Lara_garage_key',
  npc.createItem(true),
  {
    loc: 'Lara',
    alias: 'Can I have the garden key?',
    script: function () {
      io.msg('You ask Lara about the garage key; she agrees to give it to you if you give her a ring. Perhaps there is one in the glass cabinet?')
    }
  }
)

('Lara_very_attractive',
  npc.createItem(true),
  {
    loc: 'Lara',
    alias: "You're very attractive",
    script: function () {
      io.msg("You tell Lara she looks very attractive. 'Why thank you!' she replies, smiling at last.")
      w.Lara.happy = true
    }
  }
)

('walls',
  {
    examine: "They're walls, what are you expecting?",
    regex: /^wall$/,
    scenery: true,
    isAtLoc: function (loc, situation) {
      if (typeof loc !== 'string') loc = loc.name
      return w[loc].room && situation === util.display.PARSER
    }
  }
)

('brick',
  templates.COUNTABLE({ lounge: 7, dining_room: 1 }),
  { examine: 'A brick is a brick.', regex: /^(\d+ )?bricks?$/ }
)

world.createItem('shop', {
  desc: 'A funny little shop.',
  east: new world.Exit('garden'),
  willBuy: function (obj) {
    return (obj === w.trophy)
  }
})

('carrot', templates.TAKEABLE(), templates.MERCH(2, ['shop']), {
  examine: "It's a carrot!"
})

('honey_pasta', templates.TAKEABLE(), templates.MERCH(5, ['shop']), {
  examine: "It's pasta. With honey on it."
})

('trophy', templates.TAKEABLE(), templates.MERCH(15, 'shop'), {
  examine: 'It is a unique trophy!',
  doNotClone: true
})
