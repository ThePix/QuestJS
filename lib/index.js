// Set options as a parameter, environment variable, or rc file.

// initialise EmacScriptModule loader for backwards compatability
// eslint-disable-next-line no-global-assign
require = require('esm')(module/* , options */)
module.exports = require('./main.js')
module.exports = require('../game-eg/game-eg')
