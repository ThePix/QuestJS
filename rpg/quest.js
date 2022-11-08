"use strict"


function questmsg(s, params) {
  _msg(s, params || {}, {cssClass:"quest", tag:'p'});
}


const quest = {
  INITIAL:0,
  ACTIVE:1,
  MOOT:2,
  FAILED:3,
  SUCCESS:4,
  data:[],
  stateNames:['', 'Active', 'Moot', 'Failed', 'Success'],
  endTurn:function() {
    // only doing current player
    for (const q of this.data) {
      if (player[q.stateName] === quest.ACTIVE) {
        const stage = q.stages[player[q.progressName]]
        if (stage.test) {
          const flag = stage.test(player)
          if (flag) q.next()
        }
      }
    }
  },
}

settings.modulesToEndTurn.push(quest)


class Quest {
  constructor(name, data) {
    this.name = name
    this.key = name.replace(/ /g, '_').replace(/[^a-zA-Z0-9_]/g, '')
    for (const key in data) { this[key] = data[key] }
    this.stateName = 'quest_state_' + this.key
    this.progressName = 'quest_progress_' + this.key
    const already = quest.get(this.key)
    if (already) return errormsg("Name collision for Quest: " + name)
    quest.data.push(this)
  }


  comment(char, s) {
    questmsg((s ? s : quest.stateNames[char[this.stateName]]) + ": {i:" + this.name + "}")
    const state = char[this.stateName]
    const progress = char[this.progressName]
    if (state && this.stages[progress]) questmsg(this.stages[progress].text)
  }

  start(char, restart) {
    if (!char) char = player
    if (char[this.stateName] && !restart) return false // quest already started
    char[this.stateName] = quest.ACTIVE
    char[this.progressName] = 0
    this.comment(char, "Quest started")
    return true
  }

  state(char) {
    if (!char) char = player
    return char[this.stateName]
  }

  stage(char) {
    if (!char) char = player
    if (char[this.stateName] !== quest.ACTIVE) return false
    return this.stages[char[this.progressName]]
  }

  next(char, label) {
    if (typeof char === 'string' && !label) {
      label = char
      char = player
    }
    else if (!char) {
      char = player
    }
    
    if (char[this.stateName] !== quest.ACTIVE) return false
    if (label === undefined) {
      char[this.progressName]++
    }
    else {
      const stageIndex = this.stages.findIndex(el => el.label === label) + 1
      if (stageIndex === -1) return errormsg('Could not find stage with label "' + label + '" in quest :' + this.name)
      char[this.progressName] = stageIndex
    }
    if (this.stages.length <= char[this.progressName]) return this.complete(char)
    this.comment(char, "Quest progress")
    const stage = this.stage(char)
    if (stage && stage.intro) questmsg(stage.intro)
    return true
  }


  complete(char) { return this.terminate(char, quest.SUCCESS, "Quest completed") }
  fail(char) { return this.terminate(char, quest.FAILED, "Quest failed") }
  moot(char) { return this.terminate(char, quest.MOOT, "Quest now moot") }
    
  terminate(char, state, comment) {
    if (!char) char = player
    if (char[this.stateName] !== quest.ACTIVE) return false
    char[this.stateName] = state
    this.comment(char, comment)
    return true
  }

}


quest.create = function(name, stages, data = {}) {
  data.stages = stages
  new Quest(name, data)
}


quest.get = function(name) {
  return quest.data.find(el => el.name === name || el.key === name)
}


quest.listAll = function() {
  questmsg('All Quests')
  let flag = false
  for (const q of quest.data) {
    if (player[q.stateName]) {
      q.comment(player)
      flag = true
    }
  }
  if (!flag) questmsg("None")
}

quest.listActive = function() {
  questmsg('Active Quests')
  let flag = false
  for (const q of quest.data) {
    if (player[q.stateName] === quest.ACTIVE) {
      q.comment(player)
      flag = true
    }
  }
  if (!flag) questmsg("None")
  questmsg("[Do QUESTS ALL to include completed and failed quests]")
}

new Cmd('MetaQuests', {
  rules:[cmdRules.isPresent],
  regex:/^(?:quest|quests|q)$/,
  objects:[
  ],
  script:function(item) {
    quest.listActive()
    return world.SUCCESS_NO_TURNSCRIPTS
  },
})

new Cmd('MetaQuestsAll', {
  rules:[cmdRules.isPresent],
  regex:/^(?:quest|quests|q) all$/,
  objects:[
  ],
  script:function(item) {
    quest.listAll()
    return world.SUCCESS_NO_TURNSCRIPTS
  },
})
  
  
