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
      options.list = formatList(equipped, {article:DEFINITE, joiner:lang.list_and})
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
  


const WEAPON = function(damage, weaponType) {
  const res = Object.assign({}, EQUIPPABLE())
  res.weapon = true
  res.weaponType = weaponType
  res.damage = damage
  res.match = function(item) { return item.weapon }
  res.icon = () => 'weapon12'
  return res;
}  





const LIMITED_AMMO_WEAPON = function(damage, weaponType, ammo) {
  const res = Object.assign({}, WEAPON(damage, weaponType))
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
      attack.msg("Out of ammo!", 1)
      attack.abort = true
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
      attack.msg("Out of ammo!", 1)
      attack.abort = true
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
      attack.msg("Out of ammo!")
      attack.abort = true
    }
    else {
      attack.weapon.ammo--
    }
  },
}))
*/

const SHIELD = function(bonus) {
  const res = Object.assign({}, EQUIPPABLE())
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
  res.reportText = lang.castSpellFrom
  res.msgDestroy = 'The scroll crumbles to dust.'
  return res 
}


const POTION = function(spellName) {
  const res = Object.assign({}, ONE_USE_ITEM(spellName, false))
  res.reportText = lang.drinkPotion
  res.drink = function(options) { return this.use(options) }
  res.ingest = function(options) { return this.use(options) }
  return res 
}






createItem("weapon_unarmed", WEAPON(), {
  image:"fist",
  damage:"d4",
  offensiveBonus:-2,
  alias:"unarmed",
  scenery:true,
  isLocatedAt:function(loc, situation) {
    return (situation === world.PARSER || situation === world.ALL) && loc === player.name
  },
})

