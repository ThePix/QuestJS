"use strict";

settings.armourScaling = 10
settings.maxNumberOfRings = 2
settings.damagePerLevel = 3
settings.targetVerb = true
settings.msgWhenTargeting = true


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








class Effect {
  constructor(name, data, extra = {}) {
    this.name = name
    for (let key in data) this[key] = data[key]
    if (!this.alias) this.alias = name
    if (!this.css) this.css = 'generic'
    for (const name of rpg.copyToEffect) {
      if (extra[name]) this[name] = extra[name]
    }
    if (rpg.findEffect(this.name)) throw new Error("Effect name collision: " + this.name)
    rpg.effectsList.push(this)
  }
  
  // should be called by rpg.applyEffect only
  apply(target, attack, duration) {
    if (this.start) {
      const s = this.start(target)
      if (s) attack.msg(this.start(target), 1)
    }
    if (this.flags) {
      for (const s of this.flags) {
        target[s] = true
      }
    }
    if (duration) target['countdown_' + this.name] = duration
    if (!target.activeEffects.includes(this.name)) target.activeEffects.push(this.name)
  }  

  // should be called by rpg.applyEffect only
  // assumes the effect is already on the target
  extend(target, attack, duration) {
    if (duration) target['countdown_' + this.name] += duration
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



function spawn(name, loc, options = {}) {
  if (!name.endsWith('_prototype')) name += '_prototype'
  if (!loc) loc = player.loc
  const proto = w[name]
  if (!proto) return errormsg("Failed to find a prototype for " + name)
  const count = options.count ? options.count : 1
  let o
  for (let i = 0; i < count; i++) {
    o = cloneObject(proto, loc)
    if (options.package) options.package(o)
    if (o.mutate) o.mutate(options)
    if (options.target) {
      o.hostile = true
      o.target = options.target
    }
  }
  return o
}





const rpg = {
  list:[],
  effectsList:[],
  copyToEffect:['element','visage'],
  
  situations:['blinded', 'stunned', 'petrified', 'asleep', 'mute', 'befuddled', 'immobilised', 'paralysed', 'unhanded', 'nullified'],
  
  activities:[
    {name:'posture', allow_dumb:true, allow_unhanded:true, allow_nullified:true},
    {name:'move', allow_dumb:true, allow_unhanded:true, allow_nullified:true},
    {name:'manipulate', allow_dumb:true, allow_immobilised:true, allow_nullified:true},
    {name:'talk', allow_blinded:true, allow_unhanded:true, allow_immobilised:true, allow_nullified:true},
    {name:'castSpell', allow_immobilised:true},
    {name:'castSpellSelf', allow_immobilised:true, allow_blinded:true},
    {name:'castSpellMind', allow_immobilised:true, allow_dumb:true, allow_unhanded:true},
    {name:'weapon', allow_dumb:true, allow_immobilised:true, allow_nullified:true},
    {name:'natural', allow_dumb:true, allow_immobilised:true, allow_nullified:true},
    {name:'breath', allow_dumb:true, allow_unhanded:true, allow_immobilised:true, allow_nullified:true},  // eg for dragon breath
  ],
    
  
  
  add:function(skill) {
    //this.list.push(skill)
  },
  
  find:function(skillName) {
    skillName = skillName.toLowerCase()
    return this.list.find(el => skillName.match(el.regex)) 
  },
  
  findSkill:function(skillName, suppressErrorMsg) {
    const skill = this.list.find(el => skillName === el.name)
    if (!skill && !suppressErrorMsg) return errormsg("Failed to find skill/spell: '" + skillName + "'")
    return skill
  },
  

  findEffect:function(name) {
    return this.effectsList.find(el => name === el.name)
  },
  
  applyEffect:function(name, target, attack, duration) {
    const effect = rpg.findEffect(name)
    if (!target.hasEffect(effect)) {
      if (effect.category) {
        for (let name of target.activeEffects) {
          const eff = rpg.findEffect(name)
          if (eff.category === effect.category) {
            if (attack) {
              attack.msg(eff.terminate(target))
            }
            else {
              msg(eff.terminate(target))
            }              
          }
        }
      }
      effect.apply(target, attack, duration)
    }
    else {
      effect.extend(target, attack, duration)
    }
    rpg.setEffectFlags(target)
  },
  
  // Go through the effects on the target and determine which situation flags still apply.
  // Only "dead" will be preserved if not in an effect.
  setEffectFlags:function(target) {
    const flags = new Set()
    for (let name of target.activeEffects) {
      const eff = rpg.findEffect(name)
      if (eff.flags) {
        for (const s of eff.flags) flags.add(s)
      }
    }
    if (target.dead) flags.add('dead')
    for (const s of rpg.situations) target[s] = flags.has(s)
  },


  // if the player, will give a message, otherwise not
  defaultSkillTestUseable:function(char) {
    if (!this.doesNotRequireManipulate && !char.testManipulate()) return false
    return true 
  },
  defaultSkillAfterUse:function(attack, count) { },

  defaultSpellTestUseable:function(char) {
    if (!this.doesNotRequireTalk && !char.testTalk()) return false
    return true 
  },
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
    for (const key in w) {
      const o = w[key]
      if (o.signalGroups && source.signalGroups && array.intersection(o.signalGroups, source.signalGroups).length) {
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
    this.hostile = true
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
    //this.delayAttack = true
    return true
  },

  isSpellAvailable:function(char, spell) {
    for (const key in w) {
      const o = w[key]
      if (!o.spellsAvailableToLearn) continue
      if (!o.spellsCanBeLearnt()) continue
      if (o.spellsAvailableToLearn.includes(spell.name)) {
        return o
      }
    }
    return falsemsg(lang.noSourceForSpell, {spell:spell})
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
      {name:'fire', opposed:'frost', effect:'burning'},
      {name:'frost', opposed:'fire', effect:'frozen'},

      {name:'storm', opposed:'earthmight', effect:'shocked'},
      {name:'earthmight', opposed:'storm'},

      {name:'shadow', opposed:'rainbow', effect:'stunned'},
      {name:'rainbow', opposed:'shadow', effect:'dazzled'},

//      {name:'divine', opposed:'necrotic'},
//      {name:'necrotic', opposed:'divine'},

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
    
    isElement:function(s) {
      const element = this.list.find(el => el.name === s.toLowerCase())
      return element !== undefined
    },
  },
}




io.modulesToInit.push(rpg)

rpg.init = function() {
  for (const key in w) {
    const o = w[key]
    if (o.npc && !o.rpgCharacter) log("WARNING: " + o.name + " is an NPC, but does not have the proper template for an RPG.")
    if (o.player && !o.rpgCharacter) log("WARNING: " + o.name + " is a player, but does not have the proper template for an RPG.")
    if (o.rpgCharacter && o.weapon) {
      const weapon = w[o.weapon]
      if (!weapon) {
        log("WARNING: weapon " + o.weapon + " not found for " + o.name)
        continue
      }
      if (weapon.name.endsWith('_prototype')) {
        const clone = spawn(weapon.name, o.name, o.weaponData)
        delete o.weaponData
        o.weapon = clone.name
      }
      else {
        if (weapon.loc && weapon.loc !== o.name) {
          log("WARNING: weapon " + weapon.name + " seems to have 'loc' set to " + weapon.loc + ", but is assigned to " + o.name)
          continue
        }
        weapon.loc = o.name
      }
    }
    if (o.rpgCharacter && o.shield) {
      const shield = w[o.shield]
      if (!shield) {
        log("WARNING: shield " + o.shield + " not found for " + o.name)
        continue
      }
      if (shield.name.endsWith('_prototype')) {
        const clone = spawn(shield.name, o.name, o.shieldData)
        delete o.shieldData
        o.shield = clone.name
      }
      else {
        if (shield.loc && shield.loc !== o.name) {
          log("WARNING: shield " + shield.name + " seems to have 'loc' set to " + shield.loc + ", but is assigned to " + o.name)
          continue
        }
        shield.loc = o.name
      }
    }
    if (o.takeable && settings.storage) {
      o.verbFunctions.push(function(o, verbList) {
        if (o.isAtLoc(player.name)) {
          verbList.push(lang.verbs.stow)
        }
      })
    }
  }
  io.updateUIItems() // changed diplay verbs, so need to update
}


// Need to have an end of turn that will be used after all objects have done their stuff, but
// before the UI is updated, so hjacking world.resetPauses even though it is a bit hacky
world.resetPauses = function() {
  for (const key in w) {
    const obj = w[key]

    if (obj.paused) obj.paused = false

    // handle end-of-turn effects
    if (obj.applyActiveEffects) obj.applyActiveEffects('endOfTurn')

    // handle limited duration active effects
    if (obj.activeEffects) {
      for (let name of obj.activeEffects) {
        if (obj['countdown_' + name]) {
          obj['countdown_' + name]--
          if (obj['countdown_' + name] <= 0) {
            msg(rpg.findEffect(name).terminate(obj))
            rpg.setEffectFlags(obj)
          }
        }
      }
    }

    // handle limited duration summoned creatures
    let flag = true
    if (obj.summonedCountdown) {
      obj.summonedCountdown--
      if (obj.summonedCountdown <= 0) {
        if (obj.isHere() || obj.isHeld()) msg("{nv:item:disappear:true}.", {item:obj})
        rpg.destroy(obj)
      flag = false
      }
    }
    
    if (flag && obj.rpgCharacter) obj.checkHealth()
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
}










util.defaultExitUse = function(char, exit) {
  if (!exit) exit = this
  if (char.testMove && !char.testMove(exit)) return false
  const guards = exit.isGuarded()
  if (guards) {
    for (const guard of guards) {
      if (guard.guardingComment) msg(guard.guardingComment, {char:char, exit:this})
      if (guard.guardingReaction) guard.guardingReaction(char, this)
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


util.defaultExitIsGuarded = function() {
  const guards = []
  const list = this.origin[this.dir + '_guardedBy']
  //log(this)
  if (!list) return false
  for (const s of list) {
    const guard = w[s]
    if (guard.isGuarding && guard.isGuarding(this)) guards.push(guard)
  }
  this.guardedBy = guards.map(el => el.name)
  if (guards.length === 0) return false
  return guards
}



//@DOC
// Just the same as falsemsg, but the message goes to the console, not the screen
//     if (notAllowed) return falselog("That is not allowed.")
util.returnAndLog = function(val, s) {
  log(s)
  return val
}



if (settings.storage) {
  settings.placeholderLocations.push('_storage')
  rpg.listStowed = function() { return scopeBy(el => el.loc === '_storage') }
  lang.exit_list[14] = {name:'Retrieve', abbrev:'R', type:'nocmd', symbol:'fa-suitcase'}
}




tp.addDirective("lore", function(arr, params) {
  return player.activeEffects.includes('Lore') ?  arr[1] : arr[0]
})

tp.addDirective("armour", function(arr, params) {
  const name = arr.shift() || 'player'
  const obj = tp._findObject(name, params, arr)
  return (obj.armour / settings.armourScaling).toFixed(1)
})



rpg.getAtts = function(ary) {
  const atts = []
  for (const el of ary) {
    for (const key of Object.keys(el)) {
      if (!atts.includes(key)) atts.push(key)
    }
  }
  log(atts)
}





// support for when the player gets blinded
// May not prevent getting items through the command line

tp.text_processors.hereDesc = function(arr, params) {
  if (player.blind) return lang.blindedMsg
  let s
  const attName = settings.getLocationDescriptionAttName()
  if (typeof currentLocation[attName] === 'string') {
    s = currentLocation[attName]
  }
  else if (typeof currentLocation[attName] === 'function') {
    s = currentLocation[attName]()
    if (s === undefined) {
      log("This location description is not set up properly. It has a '" + attName + "' function that does not return a string. The location is \"" + currentLocation.name + "\".")
      return "[Bad description, F12 for details]"
    }
  }
  else {
    return "This is a location in dire need of a description."
  }
  delete params.tpFirstTime
  return processText(s, params)
}

DEFAULT_ROOM.description = function() {
  if (player.blinded) {
    msg(lang.blindedMsg)
  }
  else {
    for (let line of settings.roomTemplate) msg(line)
  }
  return true;
}

DEFAULT_ROOM.hasExit = function(dir, options) {
  if (player.blinded) return false
  if (options === undefined) options = {}
  if (!this[dir]) return false
  if (options.excludeAlsoDir && this[dir].isAlsoDir) return false
  if (options.excludeLocked && this[dir].isLocked()) return false
  if (options.excludeScenery && this[dir].scenery) return false
  return !this[dir].isHidden()
}

settings.isHere = function(item) {
  if (player.blinded) return false
  return item.isAtLoc(player.loc, settings.sceneryInSidePane ? world.PARSER : world.SIDE_PANE) && world.ifNotDark(item);
}
// already set (as less author does it), so set again
settings.inventoryPane[2].test = settings.isHere