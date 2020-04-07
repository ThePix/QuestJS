/* eslint-disable */
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import html from '@rollup/plugin-html'
import image from '@rollup/plugin-image'
import multi from '@rollup/plugin-multi-entry'
/* eslint-enable */

/*
This is the config file for the Rollup-Bundler.
It will need adjustments down the line as the projects needs evolve. But for now it's good to go.
It includes some basic plugins, but there are a lot more i want to take a look at.
To build the Bundle you can run the "build" task in the Package.json.
It will also start a Wather, that will automatically rebuild the bundle as soon as aa change to
any of the sourcefiles is detected.
You can start it ba using `npm run build` on the command line.
more info: https://rollupjs.org/guide/en/
*/

export default {
  input: [
    './src/main.js'
  ],
  plugins: [
    commonjs(),
    nodeResolve(),
    json(),
    multi()
  ],
  cache: true,
  inlineDynamicImports: false,
  onwarn: ({ loc, frame, message }) => {
    if (loc) {
      console.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`)
      if (frame) console.warn(frame)
    } else {
      console.warn(message)
    }
  },
  preserveModules: false,
  experimentalCacheExpiry: 10,
  perf: true,
  output: {
    file: './dist/QuestJS.umd.js',
    format: 'umd',
    name: 'QuestJS',
    plugins: [

    ],
    compact: false,
    extend: true,
    interop: true,
    sourcemap: true,
    sourcemapExcludeSources: false,
    treeshake: true
  }
}

/*
this next object isn't used it just serves for reference.
it's a little messy but i think it contains the most vital notes.
*/
// eslint-disable-next-line
const ref = Object.freeze({
  inputOptions: {
    // core input options
    external: [], // dependencies that should not be bundled
    input: [ // main entry point
      '../src/main.js', // core files
      '../game-eg/game-eg.js' // additions to natively bundle,
      // eg:
      // game libs
      // themes
      // native plugins
    ],
    plugins: [ // === plugins[] in config
      // list of output plugins to use.
      // call plugin as a function: eg: `commonjs()` not ´commonjs´
      // falsy plugins will be ignored.
      // this way you can ieasily (de-)activate plugins
      // con only use plugins that only use hooks during bundle.generate() or bundle.write()
    ],
    // advanced input options
    cache: true, // load bundle and plaugins into a cach. speets up subsequent builds
    inlineDynamicImports: false, // This will inline dynamic imports instead of
    // creating new chunks to create a single bundle. Only possible if a single input is provided,
    manualChunks: { // allows creating custom shared dependancy-Chunks
      // usefull for node-resolve for deep inports
      // eg: `lodash: ['lodash']`
    },
    onwarn: ({ loc, frame, message }) => { // eventlistener
      if (loc) {
        console.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`)
        if (frame) console.warn(frame)
      } else {
        console.warn(message)
      }
    },

    preserveModules: false,

    // danger zone
    // context: thisArg
    // moduleContext: {moduleID: thisArgPerModule},
    // -review:  this preserveSymlinks,

    // experimental
    experimentalCacheExpiry: 10,
    perf: true
  },
  outputOptions: {
    // core output options
    dir: '../dist',
    // required if multiple chunks are generated
    file: '../dist/index',
    // can only be used if a sinle chunk is generated
    format: 'umd',
    // required, decides what kind of bundle to generate
    // 'umd' --> usable in NodeJS AND Browser
    globals: {
      // `id: variable` pairs nescessary for external imports in UMD/iife
      // eg:
      // `jquery: '$'` to match `import $ from 'jquery'` in a script
      // to reference local file that won't be bundled:
      // at top of file
      // -  add `const [someID] = path.resolve(__dirname, '[workspace/path/to/someFile]')`
      // and reference here with:
      // `[someID]: "[someVariable]"`
    },
    name: 'QuestJS',
    // required for iife/umd that has exports,
    // this is then used as the global variable name the bundle
    // can be referenced by. eg: `import {QuestJS} from '[(path/to/)someBundle]'`
    plugins: [ // === output.plugins[] in config
      // list of output plugins to use.
      // call plugin as a function: eg: `commonjs()` not ´commonjs´
      // falsy plugins will be ignored.
      // this way you can ieasily (de-)activate plugins
      // con only use plugins that only use hooks during bundle.generate() or bundle.write()
    ],

    // advanced output options

    assetFileNames: '', // takes a patterstring with placeholders, can use "/" for directories
    //  [extname]: The file extension of the asset including a leading dot, e.g. .css.
    //  [ext]: The file extension without a leading dot, e.g. css.
    //  [hash]: A hash based on the name and content of the asset.
    //  [name]: The file name of the asset excluding any extension.
    banner: '', // eg `/* my-library version ' + version + ' */`,
    chunkFileNames: '', // pattern for naming shared chunks when codesplitting
    // [format]: The rendering format defined in the output options, e.g. es or cjs.
    // [hash]: A hash based on the content of the chunk and the content of all its dependencies.
    // [name]: The name of the chunk.
    compact: false, // note: will only minify the wrapper code generated by rollup
    entryFileNames: '',
    // [format]: The rendering format defined in the output options, e.g. es or cjs.
    // [hash]: A hash based on the content of the entry point and the content of all its dependencies.
    // [name]: The file name (without extension) of the entry point, unless the object form of input was used to define a different name.
    extend: true, // extend global variable defined by `option.name`
    footer: '', // eg: `/* follow me on Twitter! @rich_harris */`
    // hoistTransitiveImports,
    interop: true, // interop between bundle and external deps
    intro: '', // prepend **inside** of wrapper
    outro: '', // append*
    paths: {}, // `someID: somepathpath` see: https://rollupjs.org/guide/en/#outputpaths
    sourcemap: true, //  boolean | 'inline' | 'hidden'
    sourcemapExcludeSources: false,
    sourcemapFile: '', // path to bundle
    sourcemapPathTransform: () => {} // postprocess to use on each path

    // danger zone
    // exports
    // -review namespaceToStringTag,
    // -review noConflict,
  },
  watchOptions: {
    //   ...inputOptions,
    //   output: [outputOptions],
    watch: {
      // -review chokidar,
      // clearScreen,
      exclude: 'node_modules/**',
      include: 'src/**'
    }
  }
})
