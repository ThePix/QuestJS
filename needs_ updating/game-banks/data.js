'use strict'

world.createItem('nowhere', {
})

('me',
  templates.PLAYER(),
  {
    loc: 'stasis_pod_room',
    regex: /^(me|myself|player)$/,
    status: 100,
    bonus: 0,
    examine: function (isMultiple) {
      io.msg(util.util.prefix(this, isMultiple) + 'You feel fine...')
    },
    canMove: function (ex) {
      let room1 = w[this.loc]
      if (typeof room1.vacuum === 'string') room1 = w[room1.vacuum]
      let room2 = w[ex.name]
      if (typeof room2.vacuum === 'string') room2 = w[room2.vacuum]
      if (room1.vacuum === room2.vacuum) return true
      io.msg('The door to ' + room2.byname({ article: util.DEFINITE }) + ' will not open while it is ' + (room1.vacuum ? 'pressurised' : 'depressurised') + ' and ' + room1.byname({ article: util.DEFINITE }) + ' is not.')
      return false
    }
  }
)

('your_jumpsuit', templates.WEARABLE(2, ['body']), {
  alias: 'jumpsuit',
  loc: 'stasis_pod_drawer',
  defArticle: 'your',
  indefArticle: 'your',
  examine: 'Your jumpsuit is tight, but comfortable; a dark grey colour, with a slight metallic sheen.',
  onMove: function (toLoc, fromLoc) {
    if (fromLoc === 'stasis_pod_drawer') {
      delete w.stasis_pod_drawer.loc
      io.msg('The stasis pod drawer slides shut.')
    }
  }
})

('your_underwear', templates.WEARABLE(1, ['body']), {
  alias: 'underwear',
  loc: 'me',
  worn: true,
  defArticle: 'your',
  indefArticle: 'your',
  examine: 'Your underwear is standard issue; white and functional.'
})

// -----------------------------------------------------
// STARBOARD POD

world.createItem('stasis_bay', {
  alias: 'stasis bay',
  desc: 'There are six stasis pods here (despite only five crew members), four on one side and two on the other. {podStatus} Above each pod is a diagnostics screen, and behind them the various pipes that keep the occupant alive. Besides the pods, there is also a large locker at the back of the room. {ifHere:pile_of_vomit:There is some vomit on the floor by your stasis pod. }The exits are to port and aft.',
  tpStatus: function () {
    const arr = []
    for (let i = 0; i < NPCS.length; i++) {
      if (NPCS[i].status === 'stasis') {
        arr.push(NPCS[i])
      }
    }
    switch (arr.length) {
      case 0: return 'All pods are currently open.'
      case 4: return 'Currently only your pod and the spare pod are open.'
      case 1: return arr[0].byname({ possessive: true }) + "'s stasis pod is closed."
      default: return 'The stasis pods of ' + util.formatList(arr) + ' are closed.'
    }
  },
  vacuum: false,
  port: new world.Exit('hallway'),
  aft: new world.Exit('cargo_bay'),
  in: new world.Exit('stasis_pod_room', { io.msg: 'You climb into the stasis pod.' })
})

('pile_of_vomit', {
  scenery: true,
  regex: /vomit|sick/,
  examine: 'A large splat of vomit, it stinks. You decide not to look too closely. You do know what you ate last, so what is the point?'
})

('stasis_pod', {
  alias: 'pod',
  regex: /^(stasis )?pods?$/,
  scenery: true,
  loc: 'stasis_bay',
  examine: 'Externally, the pods are rather less like coffins, as the sides are thick with the stasis equipment, and flared towards the floor. Each stasis pod is about waist height. {stasis_pod_status}.{ifHere:pile_of_vomit: One has a slight splattering of vomit.}'
})

('stasis_pod_drawer', misc.CONTAINER(false), {
  alias: 'drawer',
  // scenery:true,
  loc: 'stasis_bay',
  closed: false,
  examine: 'The drawer extends out from the foot of the pod; it is white and quite shallow, and almost the width of the pod.{ifHere:pile_of_vomit: Fortunately, it is well away from the vomit.}'
})

('stasis_locker', misc.CONTAINER(true), {
  alias: 'locker',
  scenery: true,
  loc: 'stasis_bay',
  examine: function (isMultiple) {
    if (this.closed) {
      io.msg(util.util.prefix(this, isMultiple) + 'This metal locker is taller than you, and just as wide; it is where spacesuits are stored{once: (if there is an emergency, you want the spacesuits by the stasis pods)}.')
    } else {
      io.msg(util.util.prefix(this, isMultiple) + 'This metal locker is taller than you, and just as wide; it is where util.spacesuits are stored. Inside you can see ' + util.formatList(this.getContents(util.display.LOOK), { lastJoiner: ' and ', article: util.INDEFINITE }) + '.')
    }
  }
})

('your_util.spacesuit', templates.WEARABLE(2, ['body']), {
  alias: 'util.spacesuit',
  loc: 'stasis_locker',
  defArticle: 'your',
  indefArticle: 'your',
  examine: 'Your util.spacesuit is a pale grey colour, with bright yellow flashes on the arms and legs for visibility.'
})

('other_util.spacesuit', {
  alias: 'spare util.spacesuit',
  loc: 'stasis_locker',
  examine: 'The other util.spacesuit is identical to your own.'
})

world.createItem('stasis_pod_room', {
  alias: 'stasis pod',
  desc: 'The stasis pod is shaped uncomfortably like a coffin, and is a pale grey colour. The lid is in the raised position.',
  vacuum: 'stasis_bay',
  out: new world.Exit('stasis_bay', {
    use: function () {
      io.msg('You climb out of the stasis pod.')
      world.setRoom(game.player, this.name, 'out')
      if (w.your_jumpsuit.loc === 'stasis_pod_drawer') {
        w.stasis_pod_drawer.loc = 'stasis_bay'
        io.msg('A drawer under the pod slides open to reveal your jumpsuit.')
      }
      return true
    }
  })
})

('stasis_pod_interior',
  OPENABLE(true),
  {
    alias: 'stasis pod',
    regex: /^(stasis pod|pod|lid)$/,
    scenery: true,
    loc: 'stasis_pod_room',
    closed: false,
    examine: 'Externally, the pods are rather less like coffins, as the sides are thick with the stasis equipment, and flared towards the floor. Each stasis pod is about waist height. {stasis_pod_status}.{ifHere:pile_of_vomit: One has a slight splattering of vomit.}',
    close: function (isMultiple, char) {
      if (w.Kyle.deploySatelliteAction < 5) {
        io.msg("You give pod lid a pull, and it starts to descend for a moment, before stopping. 'Commander,' says Xsensi, 'closing the lid of a stasis pod will put you back in stasis. That is not permitted until the satellite is deployed, and not advised until probes have been deployed and data collected.' The lid rises to its fully open position.")
        return false
      }
      if (w.your_jumpsuit.loc === game.player.name) {
        io.msg("You give pod lid a pull, and it starts to descend for a moment, before stopping. 'Commander,' says Xsensi, 'your jumpsuit should be left outside the pod when going into stasis.' The lid rises to its fully open position.")
        return false
      }

      w.your_jumpsuit.loc = 'stasis_pod_drawer'
      w.stasis_pod_drawer.scenery = true
      io.msg('You give pod lid a pull, and it starts to descend, sealing you in. You feel a sharp pain in your shoulder, and almost immediately you start to feel sleepy... so sleepy you cannot keep your eyes open.')
      arrival()
      // MORE STUFF HERE ???
      return true
    }
  }
)

world.createItem('cargo_bay', {
  desc: "The cargo bay is a large,open area, with numerous [crates:crate], several with their own stasis fields. Yellow lines on the floor indicate access ways to be kept clear. The ship's airlock is to port, whilst engineering is aft. The stasis bay is forward, and to starboard, stairs lead up to the top deck, where the living quarters are.",
  vacuum: false,
  forward: new world.Exit('stasis_bay'),
  port: new world.Exit('top_deck_aft', {
    io.msg: 'You walk up the narrow stair way to the top deck.',
    alsoDir: ['up']
  }),
  starboard: new world.Exit('airlock'),
  aft: new world.Exit('engineering3')
})

world.createItem('airlock', {
  desc: 'The airlock is just big enough for two persons wearing util.spacesuits, and is featureless besides the doors, port and starboard, and the [controls].',
  vacuum: false,
  port: new world.Exit('cargo_bay'),
  starboard: new world.Exit('space', { locked: true })
})

// -----------------------------------------------------
// CENTRAL AXIS

world.createItem('hallway', {
  desc: 'This is, in a sense, the central nexus of the ship. The flight-deck is forward, the stasis bay to starboard, the labs to port. A ladder goes up to the living quarters and down to the probe hangers.',
  vacuum: false,
  starboard: new world.Exit('stasis_bay'),
  port: new world.Exit('lab2'),
  up: new world.Exit('top_deck_forward'),
  down: new world.Exit('probes_forward'),
  forward: new world.Exit('flightdeck'),
  aft: new world.Exit('service_passage', {
    isHidden: function () { return true }
  })
})

world.createItem('service_passage', {
  desc: '',
  vacuum: false,
  forward: new world.Exit('hallway', {
    isHidden: function () { return true }
  }),
  aft: new world.Exit('engineering2', {
    isHidden: function () { return true }
  })
})

world.createItem('flightdeck', {
  alias: 'flight-deck',
  desc: 'The flight deck is semi-circular, with windows looking out in all directions. In the centre is the command chair, and there are four other chairs at the various workstations. The flight-deck can be used as an escape capsule, and can be landed on a suitable planet (but cannot be used to get back to space). The only exit is aft.',
  vacuum: false,
  aft: new world.Exit('hallway')
})

// -----------------------------------------------------
// LABS

world.createItem('lab1', {
  desc: '',
  vacuum: false,
  starboard: new world.Exit('lab2'),
  aft: new world.Exit('lab3')
})

world.createItem('lab2', {
  alias: 'Bio-lab',
  desc: '',
  vacuum: false,
  starboard: new world.Exit('hallway'),
  port: new world.Exit('lab1'),
  aft: new world.Exit('lab4')
})

world.createItem('lab3', {
  desc: '',
  vacuum: false,
  forward: new world.Exit('lab1'),
  starboard: new world.Exit('lab4')
})

world.createItem('lab4', {
  alias: 'Geo-lab',
  desc: '',
  vacuum: false,
  forward: new world.Exit('lab2'),
  port: new world.Exit('lab3'),
  starboard: new world.Exit('probes_aft', {
    io.msg: 'You walk down the narrow stair way to the bottom deck.',
    alsoDir: ['down']
  }),
  aft: new world.Exit('engineering1')
})

// -----------------------------------------------------
// ENGINEERING

world.createItem('engineering1', {
  desc: '',
  alias: 'Engineering (port)',
  properName: true,
  vacuum: 'engineering2',
  starboard: new world.Exit('engineering2'),
  forward: new world.Exit('lab4')
})

world.createItem('engineering2', {
  desc: '',
  alias: 'Engineering',
  properName: true,
  vacuum: false,
  starboard: new world.Exit('engineering3'),
  port: new world.Exit('engineering1'),
  forward: new world.Exit('service_passage', {
    isHidden: function () { return true }
  })
})

world.createItem('engineering3', {
  desc: '',
  properName: true,
  alias: 'Engineering (starboard)',
  vacuum: 'engineering2',
  port: new world.Exit('engineering2'),
  forward: new world.Exit('cargo_bay')
})

// -----------------------------------------------------
// LOWER DECK

world.createItem('probes_forward', {
  alias: 'Forward probe hanger',
  desc: 'The forward probe hanger is where the satellites are stored ready for deployment. The six satellites are kept in a dust-free environment on the starboard side of the hanger, each on a cradle. A robot arm is available to pick them up and eject them through a hatch in the floor.|On the port side, the seeder pods are stored. Each pod contains a variety of simple lifeforms, such as algae, which, it is hoped, will kick-start life on a suitable planet. It is a long term plan. There are six pods, three to be deployed at distant locations on a planet.| There is a control console to handle it all, though it can also be done remotely.',
  vacuum: false,
  up: new world.Exit('hallway'),
  aft: new world.Exit('probes_aft'),
  forward: new world.Exit('server_room')
})

world.createItem('probes_aft', {
  alias: 'Aft probe hanger',
  desc: 'The aft probe hanger has the scientific probes. Each probe is contained in a crate, and needs unpacking before deployment. On the port side there is a delivery system into which a probe can be placed, to be sent to the planet. Various types of probes are available.',
  vacuum: false,
  port: new world.Exit('lab4', {
    io.msg: 'You walk up the narrow stair way to the middle deck.',
    alsoDir: ['up']
  }),
  forward: new world.Exit('probes_forward')
})

world.createItem('server_room', {
  desc: 'The heart of the IT systems, including Xsansi, This room holds three racks of processors, each rack having four shelves and each shelf having eight units. The room is kept cool and smells slightly of ozone.',
  vacuum: false,
  aft: new world.Exit('probes_forward')
})

// -----------------------------------------------------
// UPPER DECK

world.createItem('lounge', {
  desc: '',
  vacuum: false,
  aft: new world.Exit('top_deck_forward')
})

world.createItem('top_deck_forward', {
  desc: function () {
    if (!w.top_deck_aft.meFirst) {
      this.meFirst = true
      io.msg(w.top_deck_aft.descStart + this.descThis + w.top_deck_aft.descFinish)
    } else {
      io.msg(this.descThis)
    }
  },
  descThis: 'You are stood at the forward end of a narrow corridor, with your cabin to port, and the canteen to starboard. Ahead, is the lounge.',
  vacuum: false,
  down: new world.Exit('hallway'),
  starboard: new world.Exit('canteen'),
  port: new world.Exit('your_cabin'),
  aft: new world.Exit('top_deck_aft'),
  forward: new world.Exit('lounge')
})

world.createItem('top_deck_aft', {
  descStart: 'The top deck is where the living quarters - such as they are - are accessed. ',
  descFinish: ' The corridor is very utilitarian, with a metal floor and ceiling. The sides are mostly covered in white plastic panels, as a small concession to aesthetics.',
  desc: function () {
    if (!w.top_deck_forward.meFirst) {
      this.meFirst = true
      return w.top_deck_aft.descStart + this.descThis + w.top_deck_aft.descFinish
    } else {
      return this.descThis
    }
  },
  descThis: "You are stood at the aft end of a narrow corridor, with the women's cabin behind you, the men's to port. To starboard, steps lead down to the cargo bay on the lower deck.",
  vacuum: 'top_deck_forward',
  port: new world.Exit('guys_cabin'),
  aft: new world.Exit('girls_cabin'),
  starboard: new world.Exit('cargo_bay', {
    io.msg: 'You walk down the narrow stair way to the middle deck.',
    alsoDir: ['down']
  }),
  forward: new world.Exit('top_deck_forward')
})

world.createItem('canteen', {
  desc: 'The canteen, like everything else of the ship, is pretty small. There is a table, with one short side against the wall, and five plastic [chairs:chair] around it.{tableDesc} At the back is the food preparation area; a work surface across the width of the room, with a sink on the right and a hob on the left.',
  vacuum: false,
  port: new world.Exit('top_deck_forward')
})

('canteen_table',
  SURFACE(),
  {
    alias: 'table',
    loc: 'canteen',
    scenery: true,
    tpDesc: ' The table is bare.',
    examine: 'The table is plastic, attached to the wall at one end, and held up by a single leg at the other end.{tableDesc}'
  }
)

world.createItem('your_cabin', {
  desc: '',
  vacuum: false,
  starboard: new world.Exit('top_deck_forward')
})

world.createItem('guys_cabin', {
  desc: '',
  vacuum: false,
  starboard: new world.Exit('top_deck_aft')
})

world.createItem('girls_cabin', {
  desc: '',
  vacuum: false,
  forward: new world.Exit('top_deck_aft')
})

// -----------------------------------------------------
// EXTERIOR

world.createItem('space', {
  desc: '',
  vacuum: true,
  isSpace: true,
  port: new world.Exit('airlock'),
  notOnShip: true
})

// status
// 0 not detected
// 1 detected
// 2 approached
// 3 docked

('alienShip', {
  regex: /^alien ship|alien vessel|ship|vessel$/,
  desc: '',
  isShip: true,
  status: 0
})

// -----------------------------------------------------
// SPECIAL ITEMS

('probe_prototype', COUNTABLE([]),
  {
    alias: 'Probe X',
    regex: /^(\d+ )?(bio-|geo-|bio|geo)?probes?$/,
    launch: function (isMultiple, char) {
      let type
      if (char === w.Aada) {
        type = 'geo'
      } else if (char === w.Ostap) {
        type = 'bio'
      } else {
        io.msg('To launch a probe, see either Aada or Ostap.')
        return false
      }

      let number = this.extractNumber()
      if (!number) number = 1
      const available = w.Xsansi[type + 'Probes']

      if (number === 1) {
        io.msg("'Launch a " + type + "-probe,' you say to " + char.byname({ article: util.DEFINITE }) + '.')
      } else {
        io.msg("'Launch " + number + ' ' + type + "-probes,' you say to " + char.byname({ article: util.DEFINITE }) + '.')
      }
      if (number > available) {
        io.msg("'We only have " + available + " and we should save some for the other planets on our itinerary.'")
        return false
      }

      if (number > (5 - char.deployProbeTotal)) {
        io.msg("'Are you sure? Protocol says we should deploy no more than five on a single planets.'")
        io.msg("'Hey, I'm the captain. It's my bonus on the line here. Get those probes deployed.'")
      }

      if (char.deployProbeAction === 0 || char.deployProbeAction === 4) {
        io.msg("'Okay captain.'")
        char.agenda = ['walkTo:probes_aft:' + char.byname({ article: util.DEFINITE }) + ' goes to the probe deployment console.', 'text:deployProbe:' + number]
        char.deployProbeAction = 0
        char.deployProbeCount = 0
      } else {
        // lang.already part way through launching
        // skip walking there, skip first deploy action
        // the old number should be replaced
        io.msg("'Okay captain.'")
        char.agenda = ['text:deployProbe:' + number]
        char.deployProbeAction = 1
      }
      return true
    },
    launched: false,
    launchCounter: 0,
    status: 'Unused',
    countAtLoc: function (loc) { return 0 },
    eventIsActive: function () { return this.launched },
    eventScript: function () {
      this.launchCounter++
      if (this.launchCounter < TURNS_TO_LANDING) {
        this.status = 'In flight'
      }
      if (this.launchCounter === TURNS_TO_LANDING) {
        if (probeLandsOkay()) {
          this.status = 'Landing'
          shipAlert(this.alias + ' has successfully landed on the planet.')
        } else {
          shipAlert('Contact with ' + this.alias + ' has been lost as it attempted to land on the planet.')
          this.launched = false
          this.status = 'Destroyed'
        }
      }
      if (this.launchCounter === TURNS_TO_LANDING + 1) {
        this.status = 'Exploring'
      }
      const arr = PLANETS[this.planetNumber][this.probeType + 'ProbeRanks'][this.probeNumber]

      if (arr !== undefined && arr.includes(this.launchCounter - TURNS_TO_LANDING)) {
        w['planet' + this.planetNumber][this.probeType + 'logy']++
        game.player.bonus += PLANETS[this.planetNumber][this.probeType + 'ProbeBonusPerRank']
      }
    }
  }
)
