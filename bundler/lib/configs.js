/* eslint-disable */
import path from 'path'
import jsonc  from 'jsonc';
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import html from 'rollup-plugin-generate-html-template'
import generatePkg from 'rollup-plugin-generate-package-json'
import gzip from 'rollup-plugin-gzip'
import rebase from 'rollup-plugin-rebase'
import image from '@rollup/plugin-image'
import {cwd} from 'process'
import {readdir} from 'fs'
import {log} from './rollup.script'
import findUp from 'find-up'
import pkgDir from 'pkg-dir'
/* eslint-enable */

// list of defaults for each option
const defaultOptions = {
  bundlerc: {},
  rollupConfig: {}
}

// options required for the custom bundler
const forcedOptions = {
  bundlerc: {},
  rollupConfig: {}
}

const fileNameMap = {
  bundler: '.bundlerc',
  rollupConfig: 'rollupConfig'
}

// custom config
const bundlerc = {
  sourceDir: '/src',
  assetDir: '/assets',
  entryFile: 'game.js',
  templateHTML: 'index.html',
  name: '/name',
  outDir: '/dist',
  imageDir: '/images'
}

// input.plugins
const plugins = [
  commonjs(),
  nodeResolve(),
  json(),
  html(getConfigHTML()),
  rebase(getRebaseConfig()), // TODO: add version injector
  image(/* {include: [], exctlude:[]} */)
]

// input
const inputOptions = {
  external: 'QuestJS',
  input: bundlerc.entryFile,
  plugins: plugins,
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
  perf: true
}

// input.output
const outputOptions = {
  dir: bundlerc.outDir,
  format: 'umd',
  name: bundlerc.name,
  compact: false,
  extend: true,
  interop: true,
  sourcemap: true,
  sourcemapExcludeSources: false,
  treeshake: true
}

// input.watch
const watchOptions = {
  ...inputOptions,
  output: [outputOptions],
  watch: {
    chokidar: '',
    clearScreen: '',
    skipWrite: '',
    exclude: '',
    include: ''
  }
}

// plugin configs
function getRebaseConfig () {
  return {
    assetFolder: bundlerc.assetDir,
    keepName: false,
    verbose: false
    // include:
    // exclude:
  }
}

function getConfigHTML () {
  return {
    template: bundlerc.templateHTML,
    target: 'index.html',
    attrs: [],
    replaceVars: {}
  }
}

export async function getConfigs (callback = (bundlerc, inputOptions = {}, outputOptions = {}, watchOptions = {}) => {}) {
  const config = {}
  // get package root directory
  const pkgRoot = await pkgDir()
  // check if the cwd is inside a package and abort if not.
  if (!pkgRoot) {
    console.error('directory doesn\'t appear to be in a package.\nuse `npm init` to create a package in the current working directory')
    process.exit(0)
  }
  // look for any user config files in the package
  // get every Options Object from the default Options and process them individually
  for (const optionsKey in defaultOptions) {
    // the find-up function findUp can execute a clallback on
    // every directory it's seraching up the tree
    const pathToFile = findUp(directory => {
      const fileList = readdir(directory)
      if (fileList[fileNameMap[optionsKey]]) {
        return path.join(pkgRoot, fileList[fileNameMap[optionsKey]])
      } else if (directory === pkgDir) {
        return findUp.stop
      }
    })
    // preprocessor fetching defaults and enforcing certain oprions
    preProcess(optionsKey, pathToFile)
    Object.assign(config, optionsKey)
  }
  postProcess(config, (bundlerc, inputOptions, outputOptions, watchOptions) => {
    callback(bundlerc, inputOptions, outputOptions, watchOptions)
  })
  // callback
}

// preprocessor fetching defaults and enforcing certain oprions
function preProcess (options, pathToFile) {
  const OptionObject = options
  let userOptions = {}
  // overwrite with user configs if there are any
  if (pathToFile) {
    userOptions = import(pathToFile)
  }

  // force some options that are required for the custom bundler
  for (const key in userOptions) {
    if (forcedOptions[options.name][key]) {
      log.newEntry('forcedOption', key)
    }
  }
  // write properties to object. Object.assign(target, ...source)
  // if the key already exists, sources to the right will take priority
  Object.assign(OptionObject, userOptions, forcedOptions[options.name])
}

// postprocesser to get the values ready to be used by the rollup
function postProcess (config, callback = (bundlerc, inputOptions, outputOptions, watchOptions) => {}) {
  const bundlerc = config.bundlerc
  const inputOptions = config.input
  const outputOptions = config.input.output
  const watchOptions = config.input.watch
  delete inputOptions.output
  callback(bundlerc, inputOptions, outputOptions, watchOptions)
}
