"use strict"


class Option extends Exit {
  constructor(alias, hash = {}) {
    super(verbify(alias), hash)
    if (!hash.alias) this.alias = alias
    this.use = function(char, exit) {
      log('here')
      if (!exit) exit = this
      
      for (const el of document.querySelectorAll('.cmd-link')) {
        el.style.display = 'none'
      }
      
      for (const el of char.getCarrying()) {
        if (el.testCarry && !el.testCarry({char:char, item:el, exit:exit})) return false
      }

      const room = util.getObj(exit.name)
      player.previousPassage = player.passage

      if (settings.clearScreenOnRoomEnter) clearScreen();
      currentPassage.afterExit(exit)
      player.passage = room.name
      currentPassage = w[player.passage]
      world.update()
      world.enterRoom(exit)

      if (this.afterChoice) this.afterChoice(exit)
      if (player.afterChoice) player.afterChoice(exit)
      log(currentPassage)
    }

  }
  
  getCmd(s) {
    return '{cmd:' + this.dir + ':' + (s ? s : this.alias) + '}'
  }
}






settings.panes = 'none'
lang.go_successful = false
settings.textInput = false
settings.cmdEcho = false
settings.saveLoadExcludedAtts.push("options")
settings.maxOptions = 9
settings.getDefaultRoomHeading = function(item) { return titleCase(item.alias) }
settings.includeChoices = true

let currentPassage

settings.roomTemplate = []
if (settings.includeHeading) settings.roomTemplate.push("#{cap:{passageName}}")
if (settings.includeLocation) settings.roomTemplate.push("{hereDesc}")
settings.roomTemplate.push("{passageDesc}")
if (settings.includeObjects) settings.roomTemplate.push("{objectsHere:You can see {objects} here.}")
if (settings.includeChoices) settings.roomTemplate.push("{choices}")


io.modulesToInit.push({
  init:function() {
    currentPassage = w[player.passage]

    for (const el of commands) {
      if (!el.exitCmd) continue

      el.script = function() {
        log('here')
        if (!currentPassage.hasExit(this.dir)) {
          return failedmsg(lang.not_that_way, {char:player, dir:this.dir})
        }
        else {
          const ex = currentPassage.getExit(this.dir)
          log(ex)
          if (typeof ex.use !== 'function') return errormsg("Exit's 'use' attribute is not a function (or does not exist).")
          ex.use(player, ex);
          if (ex.extraTime) game.elapsedTime += ex.extraTime
          return world.SUCCESS
        }
      }
    }

  },    
})




function createChoice(alias, hash = {}) {
  if (hash.options) {
    for (let i = 1; i <= settings.maxOptions && i < hash.options.length + 1; i++) {
      hash['c' + i] = hash.options[i - 1]
    }
  }
  const o = createRoom(verbify(alias), hash)
  if (!hash.alias) o.setAlias(alias)
  return o
}




lang.exit_list = []
for (let i = 1; i <= settings.maxOptions; i++) {
  lang.exit_list.push({name:'c' + i, abbrev:'c' + i, niceDir:'c' + i, type:'compass', key:96 + i})
}





tp.text_processors.choices = function(arr, params) {
  const list = currentPassage.getExits({excludeLocked:true})
  const choices = []
  for (const el of list) {
    if (el.doNotList) continue
    choices.push(el.getCmd())
  }
  return choices.join('|')
}

tp.text_processors.option = function(arr, params) {
  const exitDir = arr.shift()
  const exit = currentPassage[exitDir]
  if (arr.length === 0) return exit.getCmd()
  return exit.getCmd(arr.join(':'))
}

tp.text_processors.passageDesc = function(arr, params) {
  let s
  if (typeof currentPassage.desc === 'string') {
    s = currentPassage.desc
  }
  else if (typeof currentPassage[attName] === 'function') {
    s = currentPassage.desc()
    if (s === undefined) {
      log("This location description is not set up properly. It has a 'desc' function that does not return a string. The location is \"" + currentPassage.name + "\".")
      return "[Bad description, F12 for details]"
    }
  }
  else {
    return "This is a location in dire need of a description."
  }
  delete params.tpFirstTime
  return processText(s, params)
}

tp.text_processors.passageName = function(arr, params) {
  return currentPassage.headingAlias
}

