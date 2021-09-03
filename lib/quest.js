"use strict"


const quest = {
  INITIAL:0,
  ACTIVE:1,
  MOOT:2,
  FAILED:3,
  SUCCESS:4,
  data:[],
  progressNames:['', 'Active', 'Moot', 'Failed', 'Success'],
}




quest.create = function(name, stages, data) {
  if (!data) data = {}
  data.name = name
  data.stages = stages
  data.key = name.replace(/ /g, '_').replace(/[^a-zA-Z0-9_]/g, '')
  quest.data.push(data)
}



quest.getState = function(name, char) {
  if (!char) char = player
  const result = {}
  result.quest = typeof name === 'string' ? quest.data.find(el => el.name === name) : name
  if (!result.quest) {
    console.error("Failed to find a quest called " + name)
    console.log('Giving up...')
  }
  result.stateName = 'quest_state_' + result.quest.key
  result.progressName = 'quest_progress_' + result.quest.key
  console.log(char)
  console.log(result.stateName)
  console.log(char[result.stateName])
  result.state = char[result.stateName]
  result.progress = char[result.progressName]
  console.log(result)
  return result
}

quest.comment = function(q, n, s) {
  metamsg(s + ": {i:" + q.name + "}")
  if (n !== false) metamsg(q.stages[n].text)
}

quest.start = function(name) {
  console.log(name)
  const result = quest.getState(name, player)
  if (result.progress !== undefined) return false // quest already started
  player[result.progressName] = quest.ACTIVE
  player[result.stateName] = 0
  quest.comment(result.quest, 0, "Quest started")
  return true
}

quest.restart = function(name, n) {
  const data = quest.getState(name, player)
  if (result.progress === quest.ACTIVE) return false // quest already started
  player[result.progressName] = quest.ACTIVE
  player[result.stateName] = n ? n : 0
  quest.comment(result.quest, 0, "Quest started")
  return true
}

quest.next = function(name) {
  const data = quest.getState(name, player)
  if (result.progress !== quest.ACTIVE) return false
  player[result.stateName]++
  if (quest.stages.length >= player[result.stateName]) return quest.complete(data.quest)
  quest.comment(result.quest, result.stateName, "Quest progress")
  return true
}

quest.complete = function(name) {
  const data = quest.getState(name, player)
  if (result.progress !== quest.ACTIVE) return false
  player[result.progressName] = quest.SUCCESS
  player[result.stateName] = false
  quest.comment(result.quest, false, "Quest completed")
  return true
}

quest.fail = function(name) {
  const data = quest.getState(name, player)
  if (result.progress !== quest.ACTIVE) return false
  player[result.progressName] = quest.FAILED
  player[result.stateName] = false
  quest.comment(result.quest, false, "Quest failed")
  return true
}

quest.moot = function(name) {
  const data = quest.getState(name, player)
  if (result.progress !== quest.ACTIVE) return false
  player[result.progressName] = quest.MOOT
  player[result.stateName] = false
  quest.comment(result.quest, false, "Quest moot")
  return true
}

quest.set = function(name, n) {
  const data = quest.getState(name, player)
  if (result.progress !== quest.ACTIVE) return false
  if (result.state <= n) return false
  player[result.stateName] = n
  quest.comment(result.quest, result.stateName, "Quest progress")
  return true
}





quest.progress = function(name, all) {
  const data = quest.getState(name, player)
  if (result.progress === undefined) return false
  if (result.progress !== quest.ACTIVE && all) return false
  metamsg(data.name + ', {i:' + quest.progressNames[result.progress] + '}')
  if (result.progress === quest.ACTIVE) metamsg(data.quest.stages[result.stateName].text) 
  return true
}










quest.list = function(all) {
  metamsg(all ? 'Active Quests' : 'All Quests')
  let flag = false
  for (let q of quest.data) {
    flag = flag || quest.getStatus(q, all)
  }
  if (!flag) metamsg("None")
  if (!all) metamsg("[Do QUESTS ALL to include completed and failed quests]")
}

commands.unshift(new Cmd('MetaQuests', {
  rules:[cmdRules.isPresent],
  regex:/^(?:quest|quests|q)$/,
  objects:[
  ],
  script:function(item) {
    quest.list(false)
  },
}))

commands.unshift(new Cmd('MetaQuestsAll', {
  rules:[cmdRules.isPresent],
  regex:/^(?:quest|quests|q) all$/,
  objects:[
  ],
  script:function(item) {
    quest.list(true)
  },
}))
  
  
