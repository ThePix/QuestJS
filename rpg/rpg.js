"use strict";





// Authors can overide as desired
settings.attackOutputLevel = 10
settings.output = function(reportTexts) {
  for (let el of reportTexts) {
    if (el.level <= settings.attackOutputLevel) {
      if (el.level === 1) {
        msg(el.t)
      }
      else  if (el.level === 2) {
        metamsg(el.t)
      }
      else {
        msgPre(el.t)
      }
    }
  }
}



settings.afterTurn.push(function() {
  for (const key in w) {
    const obj = w[key]
    
    

    // handle limited duration active effects
    if (obj.activeEffects) {
      for (let name of obj.activeEffects) {
        if (obj['countdown_' + name]) {
          obj['countdown_' + name]--
          if (obj['countdown_' + name] <= 0) {
            msg(rpg.findEffect(name).terminate(obj))
          }
        }
      }
    }

    // handle limited duration summoned creatures
    if (obj.summonedCountdown) {
      obj.summonedCountdown--
      if (obj.summonedCountdown <= 0) {
        if (obj.isHere()) msg("{nv:item:disappear:true}.", {item:obj})
        rpg.destroy(obj)
      }
    }
  }

  // Determine lighting and fog/smoke in room
  currentLocation.rpgLighting = game.dark ? rpg.DARK : rpg.LIGHT
  if (!currentLocation.rpgFog) currentLocation.rpgFog = 0
  let targetFog = currentLocation.defaultFog ? currentLocation.defaultFog : 0
  if (currentLocation.activeEffects) {
    for (const effectName of currentLocation.activeEffects) {
      const effect = rpg.findEffect(effectName)
      if (effect.fogEffect) targetFog *= effect.fogEffect
      if (effect.lightEffect) {
        if (effect.lightEffect === rpg.UTTERLIGHT) currentLocation.rpgLighting = rpg.UTTERLIGHT
        if (effect.lightEffect === rpg.UTTERDARK && currentLocation.rpgLighting !== rpg.UTTERLIGHT) currentLocation.rpgLighting = rpg.UTTERDARK
        if (effect.lightEffect === rpg.LIGHT && currentLocation.rpgLighting !== rpg.UTTERLIGHT && currentLocation.rpgLighting !== rpg.UTTERDARK) currentLocation.rpgLighting = rpg.DARK
        if (effect.lightEffect === rpg.LIGHT && currentLocation.rpgLighting !== rpg.UTTERLIGHT && currentLocation.rpgLighting !== rpg.UTTERDARK && currentLocation.rpgLighting !== rpg.LIGHT) currentLocation.rpgLighting = rpg.DARK
      }
    }
    game.dark = (currentLocation.rpgLighting === rpg.UTTERDARK || currentLocation.rpgLighting === rpg.DARK) // !!! This could have bad consequences!
  }
  if (targetFog > currentLocation.rpgFog) currentLocation.rpgFog++
  if (targetFog < currentLocation.rpgFog) currentLocation.rpgFog--
  
})








class Effect {
  constructor(name, data, extra = {}) {
    this.name = name
    for (let key in data) this[key] = data[key]
    if (!this.alias) this.alias = name
    for (const name of rpg.copyToEffect) {
      if (extra[name]) this[name] = extra[name]
    }
    if (rpg.findEffect(this.name)) throw new Error("Effect name collision: " + this.name)
    rpg.effectsList.push(this)
  }
  
  apply(attack, target, duration) {
    if (this.start) attack.msg(this.start(target), 1)
    if (duration) target['countdown_' + this.name] = duration
    if (!target.activeEffects.includes(this.name)) target.activeEffects.push(this.name)
  }  

  terminate(target) {
    array.remove(target.activeEffects, this.name)
    delete target['countdown_' + this.name]
    let s
    if (this.finish) s = this.finish(target)
    if (this.suppressFinishMsg) return ''
    if (!s) s = lang.defaultEffectExpires
    return processText(s, {effect:this, target:target})
  }
}





const rpg = {
  list:[],
  effectsList:[],
  copyToEffect:['element','visage'],
  add:function(skill) {
    //this.list.push(skill)
  },
  
  find:function(skillName) {
    skillName = skillName.toLowerCase()
    return this.list.find(el => skillName === el.name.toLowerCase() || (el.regex && skillName.match(el.regex))) 
  },
  
  findSkill:function(skillName, suppressErrorMsg) {
    const skill = this.list.find(el => skillName === el.name)
    if (!skill && !suppressErrorMsg) return errormsg("Failed to find skill/spell: '" + skillName + "'")
    return skill
  },
  

  findEffect:function(name) {
    return this.effectsList.find(el => name === el.name)
  },

  defaultSkillTestUseable:function(char) { return true },
  defaultSkillAfterUse:function(attack, count) { },

  defaultSpellTestUseable:function(char) { return true },
  defaultSpellAfterUse:function(attack, count) { },

  broadcast:function(group, message, source, other) {
    for (const key in w) {
      const o = w[key]
      if (o.signalGroups && o.signalGroups.includes(group)) {
        rpg.broadcastCommunication(o, message, source, other)
      }
    }
  },
  broadcastAll:function(message, source, other) {
    log(source.name)
    for (const key in w) {
      const o = w[key]
      if (o.signalGroups && source.signalGroups && array.intersection(o.signalGroups, source.signalGroups).length) {
        log(o.name)
        rpg.broadcastCommunication(o, message, source, other)
      }
    }
  },
  broadcastCommunication:function(npc, message, source, other) {
    const name = 'signalResponse_' + message
    if (npc[name]) {
      npc[name].bind(npc)(source, other)
    }
    else if (rpg[name]) {
      rpg[name].bind(npc)(source, other)
    }
    else {
      log('WARNING: No response for ' + message)
    }
  },  
  
  signalResponse_test:function(source) { msg("{nv:npc:receive:true} a message from {show:source}.", {npc:this, source:source})},
  signalResponse_alert:function() { this.alert = true },
  signalResponse_wake:function() { this.asleep = false },
  signalResponse_attack:function(source, target) {
    this.aggressive = true
    this.target = target ? target.name : player.name
  },





  // These are only suitable for attacks the player (and allies) uses; do not use for foes, they will target each other!

  // Get a list of foes in the current room.
  // A foe is any NPC whose allegiance is NOT friend
  getFoes:function(target) { return rpg.handleGetting(target, function(o) { return o.allegiance !== 'friend' }, true) },
  getFoesBut:function(target) { return rpg.handleGetting(target, function(o) { return o.allegiance !== 'friend' }, false) },

  // Get a list of hostiles in the current room.
  // May not work without a parameter to isHostile.
  getHostiles:function(target) { return rpg.handleGetting(target, function(o) { return o.isHostile() }, true) },
  getHostilesBut:function(target) { return rpg.handleGetting(target, function(o) { return o.isHostile() }, false) },

  // Get a list of NPCs in the current room
  getAll:function(target) { return rpg.handleGetting(target, function() { return true }, true) },
  getAllBut:function(target) { return rpg.handleGetting(target, function() { return true }, false) },


  handleGetting:function(target, fn, includeTarget) {
    const l = scopeHereListed().filter(function(el) {
      return el.npc && fn(el) && el !== target;
    })
    if (target !== undefined && includeTarget) l.unshift(target)
    return l
  },


  pursueToAttack:function(target) {
    const exit = w[this.loc].findExit(target.loc)
    if (!exit) return false  // not in adjacent room, so give up
    // may want to check NPC can use that exit
    
    //log("Move " + npc.name + " to " + dest)
    this.movingMsg(exit) 
    this.moveChar(exit)
    return true
  },

  isSpellAvailable:function(char, spell) {
    for (let el of scopeHeldBy(char)) {
      if (el.spellsAvailableToLearn && el.spellsAvailableToLearn.includes(spell.name)) {
        return el
      }
    }
    return false
  },


  teleport:function(char, loc) {
    const oldLocation = w[char.loc]
    char.loc = loc
      
    if (char === player) {
      world.update()
      world.enterRoom(new Exit(loc, {origin:oldLocation, dir:'teleport', msg:lang.teleport}))
    }
  },

  destroy:function(obj) {
    if (obj.clonePrototype) {
      delete w[obj.name]
    }
    else {
      delete obj.loc
    }
  },
  
  hasEffect:function(obj, effect) {
    if (!obj.activeEffects) return false
    if (typeof effect !== 'string') effect = effect.name
    return obj.activeEffects.includes(effect)
  },


  elements:{
    list:[
      {name:'fire', opposed:'frost'},
      {name:'frost', opposed:'fire'},

      {name:'storm', opposed:'earthmight'},
      {name:'earthmight', opposed:'storm'},

      {name:'shadow', opposed:'rainbow'},
      {name:'rainbow', opposed:'shadow'},

      {name:'divine', opposed:'necrotic'},
      {name:'necrotic', opposed:'divine'},

      {name:'chaos', opposed:'law'},
      {name:'law', opposed:'chaos'},

      {name:'life', opposed:'corruption'},
      {name:'corruption', opposed:'life'},
    ],
    
    opposed:function(s) {
      if (!s) errormsg("elements.opposed was sent something that evaluates to false (type is " + (typeof s) + ")")
      for (let el of this.list) {
        if (el.name === s) return el.opposed
      }
      errormsg("elements.opposed was sent an unrecognised element: " + s)
      return null
    },
  },
}















util.defaultExitUse = function(char, exit) {
  if (!exit) exit = this
  if (char.testMove && !char.testMove(exit)) return false
  const guards = exit.isGuarded()
  if (guards && guards.length > 0) {
    msg(lang.wayGuarded, {exit:exit})
    for (const guard of guards) {
      if (guard.guardingComment) msg(guard.guardingComment, {char:char})
      if (guard.guardingReaction) msg(guard.guardingReaction(char, this))
    }
    return false
  }
  
  if (exit.isLocked()) {
    return falsemsg(exit.lockedmsg ? exit.lockedmsg : lang.locked_exit, {char:char, exit:exit})
  }
  if (exit.testExit && !exit.testExit(char, exit)) return false
  for (const el of char.getCarrying()) {
    if (el.testCarry && !el.testCarry({char:char, item:el, exit:exit})) return false
  }
  return this.simpleUse ? this.simpleUse(char) : util.defaultSimpleExitUse(char, exit)
}






// do we need a dead attribute? is it an attribute of NPC? yes and no



agenda.ping = function() { log('ping'); return false }

agenda.guardExit = function(npc, arr) {
  npc.setGuardFromAgenda(arr)
  return false
}

agenda.guardScenery = function(npc, arr) {
  const item = w[arr.shift()]
  if (item.scenery) return false
  msg(arr.join(':'))
  if (item.loc && w[item.loc] && (w[item.loc].npc || w[item.loc].player)) npc.target = item.loc
  npc.antagonise(player)
  npc.delayAgendaAttack = true
  return true
}
agenda.guardSceneryNow = function(npc, arr) {
  const item = w[arr.shift()]
  if (item.scenery) return false
  msg(arr.join(':'))
  if (item.loc && w[item.loc] && (w[item.loc].npc || w[item.loc].player)) npc.target = item.loc
  npc.antagonise(player)
  return true
}

agenda.antagonise = function(npc, arr) {
  if (arr.length === 0) {
    npc.antagonise(player)
  }
  else if (arr[0] === 'player') {
    npc.antagonise(player)
  }
  else if (arr[0] === 'target') {
    npc.antagonise(w[npc.target])
  }
  else {
    const target = w[arr[0]]
    if (!target) return errormsg("Unknown target set for `antagonise` agenda item: " + arr[0])
    npc.antagonise(target)
  }
  return true
}





agenda.ongoingAttack = function(npc, arr) {
  const attack = npc.performAttack(arr)
  return typeof attack === 'boolean' ? attack : attack.target.dead
}

agenda.singleAttack = function(npc, arr) {
  npc.performAttack(arr)
  return true
}


  


