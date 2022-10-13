"use strict";







const EQUIPPABLE = function() {
  const res = Object.assign({}, TAKEABLE_DICTIONARY);
  
  res.equippable = true;
  res.activeEffects = [],
  res.hasEffect = function(name) { return this.activeEffects.includes(name) }
  
  res.getObstructing = function(char) {
    return scopeHeldBy(char).filter(el => el.equipped && this.match(el))
  }
  
  res.oldRpgOnCreation = res.afterCreation
  res.afterCreation = function(o) {
    o.oldRpgOnCreation(o)
    o.verbFunctions.push(function(o, verbList) {
      if (o.isAtLoc(player)) {
        verbList.push(o.equipped ? lang.verbs.unequip : lang.verbs.equip)
      }
    })
    o.nameModifierFunctions.push(function(o, list) {
      if (o.equipped && o.isAtLoc(player.name)) list.push(lang.invModifiers.equipped)
    })
  }


  res.drop = function(options) {
    if (this.equipped) this.equipped = false
    msg(lang.drop_successful, options);
    this.moveToFrom(options, "loc", "name");
    return true;
  }
  
  res.equip = function(options) {
    const equipped = this.getObstructing(options.char)
    if (equipped.includes(this)) return falsemsg(lang.already, options)
    if (equipped.length === 0) {
      msg(lang.equip, options)
    }
    else {
      options.list = formatList(equipped, {article:DEFINITE, lastSep:lang.list_and})
      msg(lang.unequipAndEquip, options)
      for (let el of equipped) el.equipped = false
    }
    this.equipped = true
    return true;
  }

  res.unequip = function(options) {
    if (!this.equipped) return falsemsg(lang.already, options)
    this.equipped = false
    msg(lang.unequip, options)
    return true;
  }
  
  return res;
}  
  


const WEAPON = function(damage) {
  const res = Object.assign({}, EQUIPPABLE())
  res.weapon = true
  res.damage = damage
  res.match = function(item) { return item.weapon }
  res.icon = () => 'weapon12'
  return res;
}  





const LIMITED_AMMO_WEAPON = function(damage, ammo) {
  const res = Object.assign({}, WEAPON(damage))
  res.ammo = ammo
  res.activeEffects.push(typeof ammo === 'number' ? "Ammo tracker" : "Ammo consumer")
  return res;
}  

 

new Effect("Ammo consumer", {
  modifyOutgoingAttack:function(attack, source) {
    if (!source.equipped) return
    const item = w[source.ammo]
    if (!item) return errormsg("The weapon " + source.name + " has an unknown ammo set: " + source.ammo)
    if (item.countAtLoc(player.name) < 1) {
      attack.abort(lang.outOfAmmo)
    }
    else {
      item.takeFrom(player.name, 1)
    }
  },
})



new Effect("Ammo tracker", {
  modifyOutgoingAttack:function(attack, source) {
    if (!source.equipped) return
    if (attack.weapon.ammo === 0) {
      attack.abort(lang.outOfAmmo)
    }
    else {
      attack.weapon.ammo--
    }
  },
})


/*
rpg.add(new Effect("Deteriorating", {
  // really needs to be on success only
  modifyOutgoingAttack:function(attack) {
    if (attack.weapon.ammo === 0) {
      attack.abort(lang.outOfAmmo)
    }
    else {
      attack.weapon.ammo--
    }
  },
}))
*/


const RING = function() {
  const res = WEARABLE()
  res.ring = true
  //res.icon = () => 'ring12'
  res.testWear = function(options) {
    if (!this.testWearForRing(options)) return false
    return true
  }
  res.testWearForRing = function(options) {
    options.count = 0
    for (const key in w) {
      const o = w[key]
      if (o.ring && o.loc === options.char.name && o.worn) options.count++
    }
    if (options.count < options.char.maxNumberOfRings) return true
    msg(lang.ringTooMany, options)
    return false
  }
  return res;
}

const AMULET = function() {
  const res = WEARABLE(0, ['amulet'])
  return res;
}  



const SHIELD = function(bonus) {
  const res = EQUIPPABLE()
  res.shield = true
  res.shieldBonus = bonus
  res.match = function(item) { return item.shield }
  res.modifyIncomingAttack = function(attack) {
    if (!this.equipped) return
    attack.offensiveBonus -= this.shieldBonus
  }
  res.icon = () => 'shield12'
  return res;
}  


const SPELLBOOK = function(list) {
  const res = Object.assign({}, TAKEABLE_DICTIONARY)
  res.spellbook = true
  res.spellsAvailableToLearn = list
  res.spellsCanBeLearnt = function() { return this.loc === player.name }
  res.examineX = ''
  res.examine = function() {
    msg(this.examineX + ' It contains the spells ' + formatList(this.spellsAvailableToLearn.map(el => '<i>' + el + '</i>'), {lastJoiner:lang.list_and}) + '.')
  }
  res.icon = () => 'spell12'
  if (!res.identify) res.identify = function() { 
    const list = formatList(this.spellsAvailableToLearn, {lastSep:lang.list_and})
    return lang.spellbookIdentifyTemplate.replace('#', list)
  }
  return res 
}



const SPELLFONT = function(list) {
  const res = {}
  res.spellfont = true
  res.spellsAvailableToLearn = list
  res.spellsCanBeLearnt = function() { return this.loc === player.loc }
  res.examineX = ''
  res.examine = function() {
    msg(this.examineX + ' It contains the spells ' + formatList(this.spellsAvailableToLearn.map(el => '<i>' + el + '</i>'), {lastJoiner:lang.list_and}) + '.')
  }
  res.icon = () => 'spell12'
  return res 
}



const ONE_USE_ITEM = function(spellName, requiresTarget) {
  const res = Object.assign({}, TAKEABLE_DICTIONARY)
  res.spellName = spellName
  res.requiresTarget = requiresTarget
  res.use = function(options) {
    if (this.requiresTarget) return falsemsg("You need to specify a target when using this item.")
    if (this.loc !== options.char.name) return falsemsg("You need to be holding {nm:item:the} when using {sb:item}.", options)
      
    const attack = Attack.createAttack(options.char, null, rpg.findSkill(this.spellName), this)
    attack.apply().output()
    if (this.msgDestroy) msg(this.msgDestroy)
    rpg.destroy(this)
    return true
  }
  res.useWith = function(char, target) {
    if (!this.requiresTarget) return falsemsg("You should not specify a target when using this item.")
    if (this.loc !== char.name) return falsemsg("You need to be holding {nm:item:the} when using {sb:item}.", {item:this})
      
    const attack = Attack.createAttack(char, target, rpg.findSkill(this.spellName), this)
    attack.apply().output()
    if (this.msgDestroy) msg(this.msgDestroy)
    rpg.destroy(this)
    return true
  }
  return res 
}



const SCROLL = function(spellName, requiresTarget) {
  const res = Object.assign({}, ONE_USE_ITEM(spellName, requiresTarget))
  res.msgAttack = lang.castSpellFrom
  res.msgDestroy = 'The scroll crumbles to dust.'
  return res 
}


const POTION = function(spellName) {
  const res = Object.assign({}, ONE_USE_ITEM(spellName, false))
  res.msgAttack = lang.drinkPotion
  res.drink = function(options) { return this.use(options) }
  res.ingest = function(options) { return this.use(options) }
  return res 
}




/*

createItem("weapon_unarmed", WEAPON(), {
  image:"fist",
  damage:"d4",
  offensiveBonus:-2,
  alias:"unarmed",
  scenery:true,
  abstract:true,
  isLocatedAt:function(loc, situation) {
    return (situation === world.PARSER || situation === world.ALL) && loc === player.name
  },
})

*/