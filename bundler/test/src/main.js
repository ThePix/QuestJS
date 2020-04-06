/*
this file serves as a module aggregate to make all the exports of the package available under a single import.
It's standard to name it `index.js` or `main.js` often refering to wether the package uses CJS or ESM.
some packages provide both, as they can be individually specified in the package.json for maximum plugability.

Currently the entire namespace is excessively polluted by how many things are exposed.
But this doesn't afect the enduserand can be gradually tidied up.
*/
export * from '../lang/lang-en.js'
export * from './command.js'
export * from './npc.js'
export * from './parser.js'
export * from './saveload.js'
export * from './settings.js'
export * from './templates.js'
export * from './text.js'
export * from './util.js'
export * from './defaults.js'
export * from './world.js'
export * from './io.js'
export * from './commands.js'
export * from './test-lib.js'

// export * from './games/game.js'
