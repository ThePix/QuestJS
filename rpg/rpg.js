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
  TIMID:1,
  FEARFUL:2,
  
  // These attitudes go to BELLIGERENT_HOSTILE on attack
  FRIENDLY:101,
  NEUTRAL:102,
  
  // These attitudes go to +100 on attack
  PROTECTIVE:201,
  BELLIGERENT:202,
  AGGRESSIVE:203,
  
  // The character will attack
  HOSTILE:300,  // boundary marker, do not set attitude to this
  PROTECTIVE_HOSTILE:301,
  BELLIGERENT_HOSTILE:302,
  AGGRESSIVE_HOSTILE:303,
  
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
  
  findSkill:function(skillName) {
    return this.list.find(el => skillName === el.name)
  },
  

  findEffect:function(name) {
    return this.effectsList.find(el => name === el.name)
  },

  defaultSkillTestUseable:function(char) { return true },
  defaultSkillAfterUse:function(attack, count) { },

  defaultSpellTestUseable:function(char) { return true },
  defaultSpellAfterUse:function(attack, count) { },

  broadcast:function(group, message, source) {
    for (const key in w) {
      const o = w[key]
      if (o.signalGroups && o.signalGroups.includes(group)) {
        if (o.signalResponses[message]) {
          o.signalResponses[message].bind(o)(source)
        }
        else if (rpg.signalResponses[message]) {
          rpg.signalResponses[message].bind(o)(source)
        }
        else {
          log('WARNING: No response for ' + message)
        }
      }
    }
  },
  signalResponses:{
    test:function(source) { msg("{nv:npc:receive:true} a message from {show:source}.", {npc:this, source:source})},
    alert:function() { this.alert = true },
    wake:function() { this.asleep = false },
    attack:function() { if (this.attitude < rpg.BELLIGERENT_HOSTILE) this.attitude = rpg.BELLIGERENT_HOSTILE },
  },


  // These are only suitable for attacks the player (and allies) uses; do not use for foes, they will target each other!

  // Get a list of foes in the current room, with target first (whether a foe or not)
  getFoes:function(target) {
    const l = scopeHereListed().filter(function(el) {
      return el.npc && el.isHostile() && el !== target;
    });
    if (target !== undefined) l.unshift(target);
    return l
  },

  // Get a list of NPCs in the current room, with target first
  getAll:function(target) {
    const l = scopeHereListed().filter(function(el) {
      return el.npc && el !== target;
    });
    if (target !== undefined) l.unshift(target);
    return l
  },

  // Get a list of foes in the current room, excluding target
  getFoesBut:function(target) {
    const l = scopeHereListed().filter(function(el) {
      return el.npc && el.isHostile() && el !== target;
    });
    return l
  },

  // Get a list of NPCs in the current room, excluding target
  getAllBut:function(target) {
    const l = scopeHereListed().filter(function(el) {
      return el.npc && el !== target;
    });
    return l
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
  return true
}



agenda.ongoingAttack = function(npc, arr) {
  return agenda.basicAttack(npc, arr)
}

agenda.singleAttack = function(npc, arr) {
  agenda.basicAttack(npc, arr)
  return true
}

agenda.basicAttack = function(npc, arr) {
  if (arr.length > 0) {
    if (arr[0] === 'player') {
      npc.target = player.name
    }
    else if (arr[0] !== 'target') {
      npc.target = arr[0]
    }
    arr.shift()
  }
  const target = w[npc.target]
  if (target.dead) return true

  const skill = arr.length > 0 ? rpg.findSkill(random.fromArray(arr)) : undefined
  Attack.createAttack(npc, player, skill).apply().output()
  return target.dead
}

  


