'use strict'

('me',
  templates.PLAYER(),
  {
    loc: 'lounge',
    regex: /^(me|myself|player)$/,
    examine: function (isMultiple) {
      io.msg(util.util.prefix(this, isMultiple) + 'A ' + (this.isFemale ? 'chick' : 'guy') + ' called ' + this.alias)
    }
  }
)

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
  up: new world.Exit('bedroom'),
  hint: 'There is a lot in this room! The bricks can be picked up by number (try GET 3 BRICKS). The book can be read. The coin is stuck to the floor. There are containers too. Kyle is an NPC; you can tell him to do nearly anything the player character can do (everything except looking and talking).'
})
