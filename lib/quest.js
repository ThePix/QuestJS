"use strict"



quest.next(char, questname)
quest.set(char, questname, const or stepname)


quest.create('Apple_for_Mary', {
  
})



const quest = {
  ACTIVE:1,
  MOOT:2,
  FAILED:3,
  SUCCESS:4,
  date:[],
}




quest.create(name, data) {
  data.name = name
  if (!data.alias) data.alias = name.replace(/_/g, ' ')
  data.status = 'initial'


}


quest.set = function(char, questname, x) {
  const q = quest.data.find(el => el.name === questname)
  if (!q) return falsemsg("Failed to find a quest called " + questname)
  const q_state = char['quest_state_' + questname]
  const q_status = char['quest_status_' + questname]
  if (typeof x === 'number') {
    if (q.status !== x) {
      q.status = 
      if (x = "Success") {
        msg ("Quest completed: {i:" + obj.alias + "}")
        obj.parent = successful_quests
      }
      else if (x = "Failed") {
        msg ("Quest failed: {i:" + obj.alias + "}")
        obj.parent = failed_quests
      }
      else if (x = "Start") {
        msg ("Quest started: {i:" + obj.alias + "}")
        obj.parent = current_quests
      }
      else {
        msg ("Quest updated: {i:" + obj.alias + "}")
        obj.parent = current_quests
      }
    }
  }
}
  
quest.QuestSummary = function(obj) {
  return (Spaces(4) + "{i:" + obj.alias + ":} " + obj.status)
}
  
quest.QuestNext = function(obj, s) {
    Quest (obj, s, "Next")
  }
  
quest.QuestEnd = function(obj, s) {
    Quest (obj, s, "Success")
  }
  
quest.QuestFail = function(obj, s) {
    Quest (obj, s, "Failed")
  }
  
quest.QuestStart = function(obj, s) {
    Quest (obj, s, "Start")
  }
  
quest.QuestStatus = function(quest) {
    QuestInit
    if (quest.parent = current_quests) {
      return ("Active")
    }
    else if (quest.parent = successful_quests) {
      return ("Successful")
    }
    else if (quest.parent = failed_quests) {
      return ("Failed")
    }
    else {
      return ("Inactive")
    }
  }
  






quest.list = function(status) {
  metamsg(sentenceCase(status) + " quests:")
  let flag = true
  for (let o of quest.data) {
    const playerStatus = game.player['questStatus_' + o.name].status
    if (playerStatus === status) {
      metamsg (o.summary(playerStatus))
      flag = false
  }
  if (flag) metamsg ("None")
}

commands.unshift(new Cmd('MetaQuest', {
  rules:[cmdRules.isHere],
  regex:/^(?:quest|quests|q)$/,
  objects:[
  ],
  script:function(item) {
    metamsg ("Type QUEST &lt;name&gt; to see detailed information on the named quest.")
    metamsg ("Type QUEST LIST or Q L to see a list of active quests, QUEST COMPLETED or Q C to see a list of successfully completed quests, QUEST FAILED or Q F for a list of failed quests")
  },
}))

commands.unshift(new Cmd('MetaQuestList', {
  rules:[cmdRules.isHere],
  regex:/^(?:quest|quests|q) (?:list|l)$/,
  objects:[
  ],
  script:function(item) {
    quest.list('active')
  },
}))

commands.unshift(new Cmd('MetaQuestCompleted', {
  rules:[cmdRules.isHere],
  regex:/^(?:quest|quests|q) (?:complete|completed|c)$/,
  objects:[
  ],
  script:function(item) {
    quest.list('completed')
  },
}))
  
commands.unshift(new Cmd('MetaQuestFailed', {
  rules:[cmdRules.isHere],
  regex:/^(?:quest|quests|q) (?:fail|failed|f)$/,
  objects:[
  ],
  script:function(item) {
    quest.list('failed')
  },
}))
  
  
