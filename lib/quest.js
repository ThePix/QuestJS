"use strict"


const quest = {
  INITIAL:0,
  ACTIVE:1,
  MOOT:2,
  FAILED:3,
  SUCCESS:4,
  data:[],
  statusNames:['', 'Active', 'Moot', 'Failed', 'Success'],
}




quest.create = function(name, stages, data) {
  if (!data) data = {}
  data.name = name
  data.stages = stages
  if (!data.alias) data.alias = name.replace(/_/g, ' ')
  quest.data.push(data)
}



quest.getState = function(name, char) {
  result = {}
  result.quest = typeof name === 'string' ? quest.data.find(el => el.name === name) : name
  if (!result.quest) {
    console.error("Failed to find a quest called " + name)
    console.log('Giving up...')
  }
  result.stateName = 'quest_state_' + name
  result.statusName = 'quest_status_' + name
  result.state = char[result.stateName]
  result.status = char[result.statusName]
  return result
}

quest.comment = function(q, n, s) {
  metamsg (s + ": {i:" + q.alias + "}")
  if (n !== false) metamsg (q.stages[n].text)
}

quest.start = function(name) {
  const data = quest.getState(name, game.player)
  if (result.status !== undefined) return false // quest already started
  game.player[result.statusName] = quest.ACTIVE
  game.player[result.stateName] = 0
  quest.comment(result.quest, 0, "Quest started")
  return true
}

quest.restart = function(name, n) {
  const data = quest.getState(name, game.player)
  if (result.status === quest.ACTIVE) return false // quest already started
  game.player[result.statusName] = quest.ACTIVE
  game.player[result.stateName] = n ? n : 0
  quest.comment(result.quest, 0, "Quest started")
  return true
}

quest.next = function(name) {
  const data = quest.getState(name, game.player)
  if (result.status !== quest.ACTIVE) return false
  game.player[result.stateName]++
  if (quest.stages.length >= game.player[result.stateName]) return quest.complete(data.quest)
  quest.comment(result.quest, result.stateName, "Quest progress")
  return true
}

quest.complete = function(name) {
  const data = quest.getState(name, game.player)
  if (result.status !== quest.ACTIVE) return false
  game.player[result.statusName] = quest.SUCCESS
  delete game.player[result.stateName]
  quest.comment(result.quest, false, "Quest completed")
  return true
}

quest.fail = function(name) {
  const data = quest.getState(name, game.player)
  if (result.status !== quest.ACTIVE) return false
  game.player[result.statusName] = quest.FAILED
  delete game.player[result.stateName]
  quest.comment(result.quest, false, "Quest failed")
  return true
}

quest.moot = function(name) {
  const data = quest.getState(name, game.player)
  if (result.status !== quest.ACTIVE) return false
  game.player[result.statusName] = quest.MOOT
  delete game.player[result.stateName]
  quest.comment(result.quest, false, "Quest moot")
  return true
}

quest.set = function(name, n) {
  const data = quest.getState(name, game.player)
  if (result.status !== quest.ACTIVE) return false
  if (result.state <= n) return false
  game.player[result.stateName] = n
  quest.comment(result.quest, result.stateName, "Quest progress")
  return true
}





quest.status = function(name, all) {
  const data = quest.getState(name, game.player)
  if (result.status === undefined) return false
  if (result.status !== quest.ACTIVE && all) return false
  metamsg(data.alias + ', {i:' + quest.statusNames[result.status] + '}')
  if (result.status === quest.ACTIVE) metamsg(data.quest.stages[result.stateName].text) 
  return true
}










quest.list = function(all) {
  metamsg(all ? 'Active Quests' : 'All Quests')
  let flag = false
  for (let q of quest.data) {
    flag = flag || quest.getStatus(q, all)
  }
  if (!flag) metamsg ("None")
  if (!all) metamsg ("[Do QUESTS ALL to include completed and failed quests]")
}

commands.unshift(new Cmd('MetaQuests', {
  rules:[cmdRules.isHere],
  regex:/^(?:quest|quests|q)$/,
  objects:[
  ],
  script:function(item) {
    quest.list(false)
  },
}))

commands.unshift(new Cmd('MetaQuestsAll', {
  rules:[cmdRules.isHere],
  regex:/^(?:quest|quests|q) all$/,
  objects:[
  ],
  script:function(item) {
    quest.list(true)
  },
}))
  
  
