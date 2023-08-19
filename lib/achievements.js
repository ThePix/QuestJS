// Data is stored somewhat permanently in LocalStorage using JSON. We store the name, the date/time it was achieved and the after details.
// Also need to main a list of achievements in JS that can include the condition to test for

"use strict"

function createAchievement(ach) {
  if (!ach.name || typeof ach.name !== 'string') errormsg("Achievement created without name.")
  if (!ach.alias || typeof ach.alias !== 'string') ach.alias = ach.name
  if (!ach.details || typeof ach.details !== 'string') errormsg(`Achievement ${ach.name}: created without details.`)
  if (!ach.afterDetails || typeof ach.afterDetails !== 'string') ach.afterDetails = ach.details
  //if (!ach.condition || typeof ach.condition !== 'function') errormsg(`Achievement ${ach.name}: created without condition.`)
    
  const data = achievements.achievements
  if (data.achievements[ach.name]) {
    ach.achieved = data.achievements[ach.name].achieved
    ach.afterDetails = data.achievements[ach.name].afterDetails
  }
  data.achievements[ach.name] = ach
  return ach
}


class AchievementList {
  constructor() {
    const achievementsJSON = localStorage.getItem(this.achievementsKey)
    this.achievements = achievementsJSON ? JSON.parse(achievementsJSON) : {}
  }
  
  store() {
    this.achievements
    localStorage.setItem(this.achievementsKey, JSON.stringify(this.achievements))
  }
  
  // Probably only useful during game development  
  reset() {
    localStorage.setItem(this.achievementsKey, JSON.stringify({}))
    this.achievements = {}
  }
  
  status(name) {
    if (!this.achievements[name]) return false
    return this.achievements[name].achieved
  }
  
  sort(data) {
    if (!Array.isArray(data)) data = Object.values(data)
    return data.sort(function (a, b) {
      if (!a.achieved && !!b.achieved) return 1
      if (!b.achieved && !!a.achieved) return -1
      if (!!a.achieved && !!b.achieved) return a.achieved - b.achieved
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    })
  }
  
  filter(achieved) {
    const result = {}
    for (const key in this.achievements) {
      const ach = this.achievements[key]
      if ((achieved && ach.achieved) || (!achieved && !ach.achieved)) result[key] = ach
    }
    return this.sort(result)
  }
  
  toArray() {
    return this.sort(this.achievements)
  }
  
  set(name, afterDetails) {
    const ach = this.achievements[name]
    
    if (!ach && !afterDetails) return errormsg("Trying to set achievement called " + name + " but no achievement with that name is known and no details are provided to create a new one.")
    
    if (!ach) {
      const ach = createAchievement({name:name, details:afterDetails})
      ach.achieved = Date.now()
      this.achievements[name] = ach
      this.store()
      achievements.setMsg(ach)
    }

    else if (ach.achieved) {
      return
    }
    
    else {
      ach.achieved = Date.now()
      if (afterDetails) ach.afterDetails = afterDetails
      this.store()
      achievements.setMsg(ach)
    }
  }

  endTurn() {
    for (const key in this.achievements) {
      const ach = this.achievements[key]
      if (ach.achieved) continue
      if (ach.condition && ach.condition()) {
        ach.achieved = Date.now()
        this.store()
        achievements.setMsg(ach)
      }
    }
  }
}



const achievements = {
  achievements:new AchievementList(),
  
  achievementsKey: "QJS:" + settings.title + ":achievements",  
  
  get(achieved) {
    return this.achievements.filter(achieved)
  },

  getAll() {
    return this.achievements.toArray()
  },

  list(achievements) {
    achievements.forEach(ach => {
      _msg(`${ach.achieved ? "&#9745;" : "&#9744;"} ${ach.alias} - ${ach.achieved ? ach.afterDetails : ach.details}${ach.achieved ? " - " + new Date(ach.achieved).toDateString() : ''}`, {}, {cssClass:"meta achieve", tag:'p'})
    })
  },

  set(name, afterDetails) {
    this.achievements.set(name, afterDetails)
  },

  status(name) {
    return this.achievements.status(name)
  },

  setMsg(achievement) {
    _msg(lang.ach_got_one_with_details, {ach:achievement}, {cssClass:"meta achieve", tag:'p'})
  },

  endTurn() {
    this.achievements.endTurn()
  },

}

settings.modulesToEndTurn.push(achievements)




findCmd('MetaAchievements').script = function(objects) {
  const s = objects[0]
  if (s.length === 0 || s === ' all') {
    const list = achievements.getAll()
    if (list.length === 0) {
      _msg(lang.ach_none, {}, {cssClass:"meta achieve", tag:'p'})
    }
    else {
      achievements.list(list)
    }
    return world.SUCCESS_NO_TURNSCRIPTS
  }
  else if (s.startsWith(' com')) {
    const list = achievements.get(true)
    if (list.length === 0) {
      _msg(lang.ach_no_com, {}, {cssClass:"meta achieve", tag:'p'})
    }
    else {
      achievements.list(list)
    }
    return world.SUCCESS_NO_TURNSCRIPTS
  }
  else if (s.startsWith(' out')) {
    const list = achievements.get(false)
    if (list.length === 0) {
      _msg(lang.ach_no_out, {}, {cssClass:"meta achieve", tag:'p'})
    }
    else {
      achievements.list(list)
    }
    return world.SUCCESS_NO_TURNSCRIPTS
  }
  else {
    metamsg(lang.ach_explain)
  }
  return world.SUCCESS_NO_TURNSCRIPTS
  
}



