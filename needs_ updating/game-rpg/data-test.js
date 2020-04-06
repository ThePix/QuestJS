'use strict'

('me',
  templates.PLAYER(),
  { loc: 'lounge', regex: /^(me|myself|player)$/, examine: 'Just some guy.' }
)

// This is for the player
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
    }
  }
)

world.createItem('lounge', {
  desc: 'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
  east: new world.Exit('kitchen'),
  west: new world.Exit('dining_room'),
  up: new world.Exit('bedroom')
}
)

world.createItem('kitchen', {
  desc: 'A nice room.',
  east: new world.Exit('lounge', {
    locked: true,
    use: function () {
      io.msg('No cannot.')
    }
  }
  ),
  west: new world.Exit('lounge')
}
)
