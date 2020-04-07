'use strict'

('me',
  RPG_templates.PLAYER(), {
    loc: 'lounge',
    regex: /^(me|myself|player)$/,
    equipped: 'weapon_unarmed',
    health: 20,
    maxHealth: 100,
    pp: 40,
    maxPP: 40,
    maxArmour: 20,
    armour: 10,
    examine: function (isMultiple) {
      io.msg(util.util.prefix(this, isMultiple) + 'A ' + (this.isFemale ? 'chick' : 'guy') + ' called ' + this.alias)
    }
  }
)

('weapon_unarmed',
  WEAPON(), {
    image: 'fist',
    damage: 'd4',
    bonus: -2,
    alias: 'unarmed'
  }
)

('knife',
  WEAPON(), {
    loc: 'me',
    image: 'knife',
    damage: 'd4+2',
    bonus: -2,
    sharp: true,
    examine: function (isMultiple) {
      if (this.sharp) {
        io.msg(util.util.prefix(item, isMultiple) + 'A really sharp knife.')
      } else {
        io.msg(util.util.prefix(item, isMultiple) + 'A blunt knife.')
      }
    }
  }
)

('flail',
  WEAPON(), {
    loc: 'me',
    image: 'flail',
    damage: '2d10+4',
    sharp: true,
    examine: function (isMultiple) {
      if (this.sharp) {
        io.msg(util.util.prefix(item, isMultiple) + 'A really sharp knife.')
      } else {
        io.msg(util.util.prefix(item, isMultiple) + 'A blunt knife.')
      }
    }
  }
)

world.createItem('lounge', {
  desc: 'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
  hint: 'There is a lot in this room! The bricks can be picked up by number (try GET 3 BRICKS). The book can be read. The coin is stuck to the floor. There are containers too. Kyle is an NPC; you can tell him to do nearly anything the player character can do (everything except looking and talking).'
})

('goblin',
  RPG_NPC(false), {
    loc: 'lounge',
    damage: '3d6',
    health: 40
  }
)

('orc',
  RPG_NPC(false), {
    loc: 'lounge',
    damage: '2d10+4',
    health: 60
  }
)

('snotling',
  RPG_NPC(false), {
    loc: 'lounge',
    damage: '2d4',
    health: 20
  }
)

('friend',
  RPG_NPC(false), {
    loc: 'lounge',
    damage: '2d4',
    health: 20,
    isHostile: function () { return false }
  }
)

('chest',
  misc.CONTAINER(true), {
    loc: 'lounge'
  }
)
