'use strict'

('me', templates.PLAYER(), {
  loc: 'lounge',
  regex: /^me|myself|player$/,
  examine: 'Just a regular guy.',
  hitpoints: 100
})

world.createItem('lounge', {
  desc: 'The lounge is boring, you really need to put stuff in it.',
  locs: ['one', 'two', 'three']
})
