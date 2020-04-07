'use strict'
// -fixme: serious namespace pollution.
import { msg, metamsg, prefix, display, LIGHT_none, LIGHT_FULL, DEFINITE, NPC, QUESTION, TOPIC, game, w, Exit, createItem, createRoom, lang, cmdRules, useWithDoor, DEFAULT_ROOM, PLAYER, TAKEABLE, COMPONENT, WEARABLE, TRANSIT, TRANSIT_BUTTON, CONTAINER, OPENABLE, VESSEL, locked_WITH, SURFACE, LIQUID, EDIBLE, SHIFTABLE, COUNTABLE, SWITCHABLE, createEnsemble, MERCH, FURNITURE } from '../main.js'

createItem('me', PLAYER(), {
  loc: 'lounge',
  regex: /^(me|myself|player)$/,
  money: 10,
  examine: function (isMultiple) {
    msg(prefix(this, isMultiple) + 'A ' + (this.isFemale ? 'chick' : 'guy') + ' called ' + this.alias)
  }
})

createItem('knife',
  TAKEABLE(),
  {
    loc: 'me',
    sharp: false,
    examine: function (isMultiple) {
      if (this.sharp) {
        msg(prefix(this, isMultiple) + 'A really sharp knife.')
      } else {
        msg(prefix(this, isMultiple) + 'A blunt knife.')
      }
    },
    chargeResponse: function (participant) {
      msg('There is a loud bang, and the knife is destroyed.')
      delete this.loc
      return false
    }
  }
)

createRoom('lounge', {
  desc: 'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
  east: new Exit('kitchen'),
  west: new Exit('dining_room'),
  south: new Exit('conservatory'),
  up: new Exit('bedroom'),
  hint: 'There is a lot in this room! The bricks can be picked up by number (try GET 3 BRICKS). The book can be read. The coin is stuck to the floor. There are containers too. Kyle is an NPC; you can tell him to do nearly anything the player character can do (everything except looking and talking).'
})

createRoom('dining_room_on_stool', {
  desc: 'Stood on a stool, in an old-fashioned room.',
  east: new Exit('lounge'),
  down: new Exit('dining_room'),
  alias: 'dining room (on a stool)'
  // loc:"dining_room",
})

createRoom('hole', {
  desc: 'An old-fashioned room.'
})

createItem('book',
  TAKEABLE(),
  {
    loc: 'lounge',
    examine: 'A leather-bound book.',
    heldVerbsX: ['Read'],
    read: function (isMultiple, char) {
      if (cmdRules.isHeld(null, char, this, isMultiple)) {
        if (char === w.Lara) {
          msg("'Okay.' Lara spends a few minutes reading the book.")
          msg("'I meant, read it to me.'")
          msg("'All of it?'")
          msg("'Quick summary.'")
          msg("'It is all about carrots. The basic gist is that all carrots should be given to me.' You are not entirely sure you believe her.")
        } else {
          msg(prefix(this, isMultiple) + 'It is not in a language ' + lang.pronounVerb(char, 'understand') + '.')
        }
        return true
      } else {
        return false
      }
    },
    lookinside: 'The book has pages and pages of text, but you do not even recongise the text.'
  }
)

createItem('book_cover',
  COMPONENT('book'),
  { examine: 'The book cover is very fancy.' }
)

createItem('boots',
  WEARABLE(),
  { loc: 'lounge', pronouns: lang.pronouns.plural, examine: 'Some old boots.' }
)

createItem('waterskin',
  TAKEABLE(),
  {
    examine: function (isMultiple) { msg(prefix(item, isMultiple) + 'The waterskin is ' + Math.floor(this.full / this.capacity * 100) + '% full.') },
    capacity: 10,
    full: 3,
    loc: 'lounge',
    fill: function (isMultiple) {
      if (game.player.loc !== 'garage') {
        msg(prefix(this, isMultiple) + 'There is nothing to charge the torch with here.')
        return false
      } else {
        msg(prefix(this, isMultiple) + 'You charge the torch - it should last for hours now.')
        this.power = 20
        return true
      }
    }
  }
)

createItem('glass_cabinet',
  CONTAINER(true),
  locked_WITH('cabinet_key'),
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

createItem('jewellery_box',
  TAKEABLE(),
  CONTAINER(true),
  { loc: 'glass_cabinet', alias: 'jewellery box', examine: 'A nice box.', closed: false }
)

createItem('ring',
  TAKEABLE(),
  { loc: 'jewellery_box', examine: 'A ring.' }
)

createItem('cardboard_box',
  TAKEABLE(),
  CONTAINER(true),
  { loc: 'lounge', alias: 'cardboard box', examine: 'A big cardboard box.', closed: false }
)

createItem('sandwich',
  EDIBLE(false),
  { loc: 'lounge', examine: 'A tasty looking thing.', onIngesting: function () { msg('That was Great!') } }
)

createItem('ornate_doll',
  TAKEABLE(),
  { loc: 'glass_cabinet', alias: 'ornate doll', examine: 'A fancy doll, eighteenth century.' }
)

createItem('coin',
  TAKEABLE(),
  {
    loc: 'lounge',
    examine: 'A gold coin.',
    take: function (isMultiple, participant) {
      msg(prefix(this, isMultiple) + lang.pronounVerb(participant, 'try', true) + ' to pick up the coin, but it just will not budge.')
      return false
    }
  }
)

createItem('small_key',
  TAKEABLE(),
  { loc: 'lounge', examine: 'A small key.', alias: 'small key' }
)

createItem('flashlight', TAKEABLE(), SWITCHABLE(false), {
  loc: 'lounge',
  examine: 'A small red torch.',
  regex: /^torch$/,
  byname: function (options) {
    let res = this.alias
    if (options.article) { res = (options.article === DEFINITE ? 'the' : 'a') + ' ' + this.alias }
    if (this.switchedon && options.modified) { res += ' (providing light)' }
    return res
  },
  lightSource: function () {
    return this.switchedon ? LIGHT_FULL : LIGHT_none
  },
  eventPeriod: 1,
  eventIsActive: function () {
    return this.switchedon
  },
  eventScript: function () {
    this.power--
    if (this.power === 2) {
      msg('The torch flickers.')
    }
    if (this.power < 0) {
      msg('The torch flickers and dies.{once: Perhaps there is a charger in the garage?}')
      this.doSwitchoff()
    }
  },
  checkCanSwitchOn () {
    if (this.power < 0) {
      msg('The torch is dead.')
      return false
    }
    return true
  },
  power: 2,
  chargeResponse: function (participant) {
    msg(lang.pronounVerb(participant, 'push', true) + ' the button. There is a brief hum of power, and a flash.')
    w.flashlight.power = 20
    return true
  }
})

createRoom('dining_room', {
  desc: 'An old-fashioned room.',
  east: new Exit('lounge'),
  west: new Exit('lift'),
  canViewLocs: ['garden'],
  canViewPrefix: 'Through the window you can see ',
  up: new Exit('dining_room_on_stool'),
  alias: 'dining room',
  hint: 'This room features an NPC who will sometimes do as you ask. Compliment her, and she will go to another room, and with then pick things up and drop them (but not bricks). Also not that the glass cabinet is in this room as well as the lounge.'
})

createItem('chair',
  FURNITURE({ sit: true }),
  {
    loc: 'dining_room',
    examine: 'A wooden chair.',
    onsitting: function (char) {
      msg('The chair makes a strange noise when ' + lang.nounVerb(char, 'sit') + ' on it.')
    }
  }
)

createRoom('lift',
  TRANSIT('east'),
  {
    desc: 'A curious lift.',
    east: new Exit('dining_room'),
    transitMenuPrompt: 'Where do you want to go?'
    // afterEnter:transitOfferMenu,
    // transitAutoMove:true,
    // transitOnMove:function(toLoc, fromLoc) { debugmsg("MOVING to " + toLoc + " from " + fromLoc); },
    // transitCheck:function() {
    //  msg("The lift is out of order");
    //  return false;
    // },
  }
)

// calling it button_0 make it appear before button_1 in lists
createItem('button_0',
  TRANSIT_BUTTON('lift'),
  {
    alias: 'Button: G',
    examine: 'A button with the letter G on it.',
    transitDest: 'dining_room',
    transitDestAlias: 'Ground Floor',
    transitAlreadyHere: "You're already there mate!",
    transitGoToDest: 'The old man presses the button....'

  }
)

createItem('button_1',
  TRANSIT_BUTTON('lift'),
  {
    alias: 'Button: 1',
    examine: 'A button with the letter 1 on it.',
    transitDest: 'bedroom',
    transitDestAlias: 'The Bedroom',
    transitAlreadyHere: 'You press the button; nothing happens.',
    transitGoToDest: 'You press the button; the door closes and the lift heads to the first floor. The door opens again.'

  }
)

createItem('button_2',
  TRANSIT_BUTTON('lift'),
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

createRoom('attic', {
  desc: 'An spooky attic.',
  west: new Exit('lift')
})

createRoom('kitchen', {
  desc: 'A clean room{if:clock:scenery:, a clock hanging on the wall}. There is a sink in the corner.',
  west: new Exit('lounge'),
  down: new Exit('basement', {
    isHidden: function () { return w.trapdoor.closed },
    msg: function (isMultiple, char) {
      if (char === game.player) {
        msg('You go through the trapdoor, and down the ladder.')
      } else {
        msg('You watch ' + char.byname({ article: DEFINITE }) + ' disappear through the trapdoor.')
      }
    }
  }),
  north: new Exit('garage', { use: useWithDoor, door: 'garage_door', doorName: 'garage door' }),
  afterFirstEnter: function () {
    msg('A fresh smell here!')
  },
  hint: 'This room features two doors that open and close. The garage door needs a key.',
  source: 'water'
})

createItem('clock',
  TAKEABLE(),
  { loc: 'kitchen', scenery: true, examine: 'A white clock.' }
)

createItem('trapdoor',
  OPENABLE(false),
  { loc: 'kitchen', examine: 'A small trapdoor in the floor.' }
)

createItem('camera',
  TAKEABLE(),
  { loc: 'kitchen', examine: 'A cheap digital camera.', regex: /^picture box$/ }
)

createItem('big_kitchen_table',
  SURFACE(),
  { loc: 'kitchen', examine: 'A Formica table.' }
)

createItem('garage_door',
  OPENABLE(false),
  locked_WITH('garage_key'),
  {
    examine: 'The door to the garage.',
    alias: 'garage door',
    isAtLoc: function (loc) {
      if (typeof loc !== 'string') loc = loc.name
      return (loc === 'kitchen' || loc === 'garage')
    }
  }
)

createItem('jug', VESSEL(4), TAKEABLE(), {
  loc: 'big_kitchen_table',
  examine: 'A small jug, stripped blue and white.'
})

createItem('kitchen_sink', {
  loc: 'kitchen',
  scenery: true,
  examine: 'A dirty sink.',
  isSourceOf: function (subst) { return subst === 'water' || subst === 'lemonade' }
})

createItem('water', LIQUID(), {
})

createItem('honey', LIQUID(), {
})

createItem('lemonade', LIQUID(), {
})

createRoom('basement', {
  desc: 'A dank room, with piles of crates everywhere.',
  darkDesc: 'It is dark, but you can just see the outline of the trapdoor above you.',
  up: new Exit('kitchen', { isHidden: function () { return false } }),
  lightSource: function () {
    return w.light_switch.switchedon ? LIGHT_FULL : LIGHT_none
  },
  hint: 'The basement illustrates light and dark. There is a torch in the lounge that may be useful.'
})

createItem('light_switch',
  SWITCHABLE(false),
  {
    loc: 'basement',
    examine: 'A switch, presumably for the light.',
    alias: 'light switch',
    checkCanSwitchOn: function () {
      if (!w.crates.moved) {
        msg('You cannot reach the light switch, without first moving the crates.')
        return false
      } else {
        return true
      }
    }
  }
)

createItem('crates',
  {
    loc: 'basement',
    examine: 'A bunch of old crates.',
    move: function () {
      msg('You move the crates, so the light switch is accessible.')
      this.moved = true
      return true
    }
  }
)

createRoom('garage', {
  desc: 'An empty garage.',
  south: new Exit('kitchen', { use: useWithDoor, door: 'garage_door', doorName: 'kitchen door' }),
  hint: 'The garage features a complex mechanism, with two components.'
})

createItem('charger',
  {
    loc: 'garage',
    examine: 'A device bigger than a washing machine to charge a torch? It has a compartment and a button. {charger_state}.',
    mended: false,
    use: function () {
      metamsg('To use the charge, you need to put the torch in the compartment and press the button.')
    }
  }
)

createItem('charger_compartment',
  COMPONENT('charger'),
  CONTAINER(true),
  {
    alias: 'compartment',
    examine: 'The compartment is just the right size for the torch. It is {if:charger_compartment:closed:closed:open}.',
    testRestrictions: function (item) {
      const contents = w.charger_compartment.getContents(display.LOOK)
      if (contents.length > 0) {
        msg('The compartment is full.')
        return false
      }
      return true
    }
  }
)

createItem('charger_button',
  COMPONENT('charger'),
  {
    examine: 'A big red button.',
    alias: 'button',
    push: function (isMultiple, participant) {
      const contents = w.charger_compartment.getContents(display.ALL)[0]
      if (!w.charger_compartment.closed || !contents) {
        msg(lang.pronounVerb(participant, 'push', true) + ' the button, but nothing happens.')
        return false
      } else if (!contents.chargeResponse) {
        msg(lang.pronounVerb(participant, 'push', true) + ' the button. There is a brief hum of power, but nothing happens.')
        return false
      } else {
        return contents.chargeResponse(participant)
      }
    }
  }
)

createRoom('bedroom', {
  desc: 'A large room, with a big [bed] and a wardrobe.',
  down: new Exit('lounge'),
  in: new Exit('wardrobe'),
  west: new Exit('lift'),
  hint: 'The bedroom has a variety of garments that can be put on - in the right order.'
})

createItem('wardrobe',
  DEFAULT_ROOM,
  {
    out: new Exit('bedroom'),
    loc: 'bedroom',
    examine: 'It is so big you could probably get inside it.',
    desc: 'Oddly empty of fantasy worlds.'
  }
)

createItem('underwear',
  WEARABLE(1, ['lower']),
  {
    loc: 'bedroom',
    pronouns: lang.pronouns.massnoun,
    examine: 'Clean!'
  }
)

createItem('jeans',
  WEARABLE(2, ['lower']),
  { loc: 'bedroom', pronouns: lang.pronouns.plural, examine: 'Clean!' }
)

createItem('shirt',
  WEARABLE(2, ['upper']),
  { loc: 'bedroom', examine: 'Clean!' }
)

createItem('coat',
  WEARABLE(3, ['upper']),
  { loc: 'bedroom', examine: 'Clean!' }
)

createItem('jumpsuit',
  WEARABLE(2, ['upper', 'lower']),
  { loc: 'bedroom', examine: 'Clean!' }
)

createItem('suit_trousers',
  WEARABLE(2, ['lower']),
  { loc: 'wardrobe', examine: 'The trousers.', pronouns: lang.pronouns.plural }
)

createItem('jacket',
  WEARABLE(3, ['upper']),
  { loc: 'wardrobe', examine: 'The jacket' }
)

createItem('waistcoat',
  WEARABLE(2, ['upper']),
  { loc: 'wardrobe', examine: 'The waistcoat' }
)

createEnsemble('suit', [w.suit_trousers, w.jacket, w.waistcoat],
  { examine: 'A complete suit.', regex: /xyz/ }
)

createRoom('conservatory', {
  desc: 'A light airy room.',
  north: new Exit('lounge'),
  west: new Exit('garden'),
  hint: 'The conservatory features a pro-active NPC.'
})

createItem('crate',
  FURNITURE({ stand: true }), SHIFTABLE(),
  { loc: 'conservatory', examine: 'A large wooden crate, probably strong enough to stand on.' }
)

createItem('broken_chair',
  { loc: 'conservatory', examine: 'A broken chair.' }
)

createRoom('garden', {
  desc: 'Very overgrown. The garden backs onto a shop to the west, whilst the conservatory is east.',
  east: new Exit('conservatory'),
  west: new Exit('shop')
})

createRoom('far_away', {
  north: new Exit('lounge')
})

createItem('Arthur',
  NPC(false),
  {
    loc: 'garden',
    examine: function (isMultiple) {
      if (this.suspended) {
        msg(prefix(item, isMultiple) + 'Arthur is asleep.')
      } else {
        msg(prefix(item, isMultiple) + 'Arthur is awake.')
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
        msg(arr[0])
      }
      if (game.player.loc === 'dining_room') {
        msg(arr[1])
      }
    },
    talkto: function () {
      msg("'Hey, wake up,' you say to Arthur.")
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

createItem('Kyle', NPC(false),
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
        case 0 : msg("You say 'Hello,' to Kyle, and he replies in kind."); break
        case 1 : msg("You ask Kyle how to get upstairs. 'You know,' he replies, 'I have no idea.'"); break
        case 2 : msg("'Where do you sleep?' you ask Kyle."); msg("'What's \"sleep\"?'"); break
        default: msg('You wonder what you can talk to Kyle about.'); break
      }
      this.pause()
      return true
    }
  })

createItem('kyle_question', QUESTION(), {
  responses: [
    {
      regex: /^(yes)$/,
      response: function () {
        msg("'Oh, cool,' says Kyle.")
      }
    },
    {
      regex: /^(no)$/,
      response: function () {
        msg("'Oh, well, Lara, this is Tester, he or she is testing Quest 6,' says Kyle.")
      }
    },
    {
      response: function () {
        msg("'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'")
        w.Kyle.askQuestion('kyle_question')
      }
    }
  ]
})

createItem('straw_boater',
  WEARABLE(false),
  { loc: 'Kyle', examine: 'A straw boater.', worn: true }
)

createItem('Kyle_The_Garden',
  TOPIC(true),
  {
    loc: 'Kyle',
    alias: "What's the deal with the garden?",
    nowShow: ['Mary_The_Garden_Again'],
    script: function () {
      msg("You ask Kyle about the garden, but he's not talking.")
    }
  }
)

createItem('Kyle_The_Garden_Again',
  TOPIC(false),
  {
    loc: 'Kyle',
    alias: "Seriously, what's the deal with the garden?",
    script: function () {
      msg("You ask Kyle about the garden, but he's STILL not talking.")
    }
  }
)

createItem('Kyle_The_Weather',
  TOPIC(true),
  {
    loc: 'Kyle',
    alias: 'The weather',
    script: function () {
      msg('You talk to Kyle about the weather.')
    }
  }
)

createItem('Lara',
  NPC(true),
  {
    loc: 'dining_room',
    examine: 'A normal-sized bunny.',
    properName: true,
    happy: false,
    giveReaction: function (item, multiple, char) {
      if (item === w.ring) {
        msg("'Oh, my,' says Lara. 'How delightful.' She slips the ring on her finger, then hands you a key.")
        w.ring.loc = 'Lara'
        w.ring.worn = true
        w.garage_key.loc = char.name
      }
      if (item === w.book) {
        msg("'Hmm, a book about carrots,' says Lara. 'Thanks.'")
        w.book.loc = 'Lara'
      } else {
        msg("'Why would I want {i:that}?'")
      }
    },
    getAgreementTake: function (item) {
      if (item === w.brick) {
        msg("'I'm not picking up any bricks,' says Lara indignantly.")
        return false
      }
      return true
    },
    getAgreementGo: function (dir) {
      if (!this.happy) {
        msg("'I'm not going " + dir + ",' says Lara indignantly. 'I don't like that room.'")
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
        msg("'I don't think so!' says Lara indignantly.")
        return false
      }
      return true
    },
    getAgreement () {
      msg("'I'm not doing that!' says Lara indignantly.")
      return false
    },
    canTalkPlayer: function () { return true },

    sayPriority: 3,
    sayResponses: [
      {
        regex: /^(hi|hello)$/,
        id: 'hello',
        response: function () {
          msg("'Oh, hello there,' replies Lara.")
          if (w.Kyle.isHere()) {
            msg("'Have you two met before?' asks Kyle.")
            w.Kyle.askQuestion('kyle_question')
          }
        }
      }
    ]
  }
)

createItem('garage_key',
  TAKEABLE(),
  { loc: 'lounge', examine: 'A big key.', alias: 'garage key' }
)

createItem('Lara_garage_key',
  TOPIC(true),
  {
    loc: 'Lara',
    alias: 'Can I have the garden key?',
    script: function () {
      msg('You ask Lara about the garage key; she agrees to give it to you if you give her a ring. Perhaps there is one in the glass cabinet?')
    }
  }
)

createItem('Lara_very_attractive',
  TOPIC(true),
  {
    loc: 'Lara',
    alias: "You're very attractive",
    script: function () {
      msg("You tell Lara she looks very attractive. 'Why thank you!' she replies, smiling at last.")
      w.Lara.happy = true
    }
  }
)

createItem('walls',
  {
    examine: "They're walls, what are you expecting?",
    regex: /^wall$/,
    scenery: true,
    isAtLoc: function (loc, situation) {
      if (typeof loc !== 'string') loc = loc.name
      return w[loc].room && situation === display.PARSER
    }
  }
)

createItem('brick',
  COUNTABLE({ lounge: 7, dining_room: 1 }),
  { examine: 'A brick is a brick.', regex: /^(\d+ )?bricks?$/ }
)

createRoom('shop', {
  desc: 'A funny little shop.',
  east: new Exit('garden'),
  willBuy: function (obj) {
    return (obj === w.trophy)
  }
})

createItem('carrot', TAKEABLE(), MERCH(2, ['shop']), {
  examine: "It's a carrot!"
})

createItem('honey_pasta', TAKEABLE(), MERCH(5, ['shop']), {
  examine: "It's pasta. With honey on it."
})

createItem('trophy', TAKEABLE(), MERCH(15, 'shop'), {
  examine: 'It is a unique trophy!',
  doNotClone: true
})
