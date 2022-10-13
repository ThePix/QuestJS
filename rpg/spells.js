"use strict";


//-------  ELEMENTAL ATTACK SPELLS  -----------
// Spells that cause instant damage to the target


new SpellElementalAttack("Ice shard", 'frost', '2d6', 'A shard of ice')

new SpellElementalAttack("Ice spear", 'frost', '5d6', 'An icicle bristling with frost magic')

new SpellElementalAttack("Firedart", 'fire', '3d4', 'A small ball of fire')

new SpellElementalAttack("Spark", 'storm', '4', 'A spark of electricity')

new SpellElementalAttack("Shock", 'storm', 'd12', 'An arc of electricity')

new SpellElementalAttack("Lightning bolt", 'storm', '3d12', 'A bolt of lightning')

new SpellElementalAttack("Void ball", 'shadow', '2d4+2', 'A glob of utter darkness')

new SpellElementalAttack("Void vomit", 'shadow', '3d6+4', 'A splurge of utter darkness')

new SpellElementalAttack("Light ball", 'rainbow', 'd12', 'A ball of intense light')

new SpellElementalAttack("Rainbow blast", 'rainbow', '4d12', 'A great dazzling ball of rainbow colour')








new Spell("Fireball", {
  noTarget:true,
  level:4,
  description:"A ball of fire engulfs the room.",
  tactical:"Targets all in the location except you; on a successful hit, target takes 2d6.",
  damage:'2d6',
  tooltip:"A fireball that fills the room (but does not affect you!)",
  primarySuccess:"{nv:target:reel:true} from the explosion.",
  primaryFailure:"{nv:target:ignore:true} it.",
  getPrimaryTargets:rpg.getAll,
  modifyOutgoingAttack:function(attack) {
    attack.element = "fire";
    attack.msg("The room is momentarily filled with fire.", 1)
  },
})

new Spell("Psi-blast", {
  level:5,
  regex:/^(psi|psi\-blast|psiblast)$/,
  description:"A blast of pure mental energy blasts your target.",
  tactical:"On a successful hit, target takes 3d6; ignores armour. This spell is entirely mental, so can be cast without anyone knowing, even with no hands or voice.",
  damage:'3d6',
  activityType:'castSpellMind',
  suppressAntagonise:true,
  icon:'psi-blast',
  tooltip:"A blast of mental energy (ignores armour)",
  primarySuccess:"A blast of raw psi-energy sends {nm:target:the} reeling.",
  primaryFailure:"A blast of raw psi-energy... is barely noticed by {nm:target:the}.",
  modifyOutgoingAttack:function(attack) {
    attack.armourMultiplier = 0
  },
})

new Spell("Lightning blast", {
  level:5,
  description:"A blast of lightning leaps to your target - and perhaps his comrades too.",
  tactical:"On a successful hit, target takes 3d6 and his allies take 2d6.",
  damage:'3d6',
  element:'storm',
  secondaryDamage:'2d6',
  icon:'lightning',
  tooltip:"A lightning bolt jumps from your out-reached hand to you foe!",
  primarySuccess:"A lightning bolt jumps from {nms:attacker:the} out-reached hand to {nm:target:the}!",
  secondarySuccess:"A smaller bolt jumps {nms:attacker:the} target to {nm:target:the}!",
  primaryFailure:"A lightning bolt jumps from {nms:attacker:the} out-reached hand to {nm:target:the}, fizzling out before it can actually do anything.",
  secondaryFailure:"A smaller bolt jumps {nms:attacker:the} target, but entirely misses {nm:target:the}!",
  getSecondaryTargets:rpg.getFoesBut,
  modifyOutgoingAttack:function(attack) {
    attack.element = "storm";
  },
  afterPrimaryFailure:function(attack) {
    attack.secondaryTargets = []
  },
})


// Only when raining
new Spell("Call lightning", {
  level:3,
  description:"A bolt of thunder is called down from the clouds to blast your target.",
  tactical:"On a successful hit, target takes 3d6, but can only be used when outside, in the rain.",
  damage:'3d6',
  element:'storm',
  icon:'lightning',
  tooltip:"A lightning bolt jumps from your out-reached hand to you foe!",
  primarySuccess:"A lightning bolt comes down from the sky, to strike {nm:target:the}!",
  primaryFailure:"A lightning bolt comes down from the sky, towards {nm:target:the}, but fizzles out before it can actually do anything.",
  modifyOutgoingAttack:function(attack) {
    attack.element = "storm"
    if (player.currentWeatherDisabled) return
    const weather = weatherTypes[player.currentWeatherName]
    if (!weather.outside()) {
      attack.abort("The <i>Call lightning</i> spell can only be used outside.")
    }
    if (weather.wetness < 1) {
      attack.abort("The <i>Call lightning</i> spell can only be used when it is raining.")
    }
  },
})



for (const el of rpg.elements.list) {
  new SpellSelf("Attune to " + el.name, {
    level:1,
    description:"Allows you to attune to the element of " + el.name + ".",
    primarySuccess:"{nv:target:be:true} now attuned to the element of " + el.name + ".",
    effect:{
      attunedElement:el.name,
      doNotList:true,
      category:'elemental_attunement',
      modifyOutgoingAttack:function(attack) {
        if (attack.skill.type === 'spell' && attack.element && attack.element !== this.attunedElement ) attack.abort("That spell cannot be cast whilst attuned to the element of " + this.attunedElement + ".")
      },
      start:function(target) { target.attunedElement = this.attunedElement },
    },
  })
}


new Effect("Not attuned", {
  category:'elemental_attunement',
  doNotList:true,
  modifyOutgoingAttack:function(attack) {
    if (attack.skill.type === 'spell' && attack.element) attack.abort("That spell cannot be cast whilst not attuned to the element of " + attack.element + ".")
  },
  suppressFinishMsg:true,
})


//-------  ARMOUR SPELLS  -----------
// Spells that have an ongoing effect on attacks against the target

new Spell("Cursed armour", {
  level:3,
  description:"Can be cast on a foe to reduce the protection armour gives.",
  tactical:"Target loses 2 from their armour, to a minimum of zero.",
  primarySuccess:"{nms:target:the:true} armour is reduced.",
  icon:'unarmour',
  effect:{
    css:'curse',
    category:'armour',
    modifyOutgoingAttack:function(attack) {
      attack.armourModifier = (attack.armourModifier > 2 ? attack.armourModifier - 2 : 0)
    },
  },
})

new SpellSelf("Barkskin", {
  level:2,
  element:'earthmight',
  description:"Can be cast on yourself to give protection to all physical and many elemental attacks.",
  tactical:"Adds 1 to your armour.",
  primarySuccess:"Your skin becomes as hard as bark - and yet still just as flexible.",
  effect:{
    category:'armour',
    modifyIncomingAttack:function(attack) {
      attack.armourModifier += 1
    },
  },
})

new SpellSelf("Stoneskin", {
  level:2,
  element:'earthmight',
  description:"Can be cast on yourself to give protection to all physical and many elemental attacks.",
  tactical:"Adds 2 to your armour.",
  primarySuccess:"Your skin becomes as hard as stone - and yet still just as flexible.",
  effect:{
    category:'armour',
    modifyIncomingAttack:function(attack) {
      attack.armourModifier += 2
    },
  },
})

new SpellSelf("Steelskin", {
  level:4,
  element:'earthmight',
  description:"Can be cast on yourself to give protection to all physical and many elemental attacks.",
  tactical:"Adds 3 to your armour.",
  primarySuccess:"Your skin becomes as hard as steel - and yet still just as flexible.",
  duration:3,
  effect:{
    category:'armour',
    modifyIncomingAttack:function(attack) {
      attack.armourModifier += 3
    },
  },
})




//-------  ATTACK-MODIFYING SPELLS  -----------
// Spells that have an ongoing effect on attacks made by the target

new SpellSelf("Strength", {
  level:3,
  description:"The target of this spell is made much stronger, able to do far more damage in non-magical attacks.",
  tactical:"Target will do twice the normal damage when making non-spell attacks",
  primarySuccess:"{nms:target:the:true} strength is enhanced.",
  effect:{
    category:'enhancement',
    modifyOutgoingAttack:function(attack) {
      if (attack.skill.type !== 'spell') attack.damageModifier *= 2
    },
  },
})

new Spell("Weakness", {
  level:3,
  description:"The target of this spell is made much weaker, doing far less damage in non-magical attacks.",
  tactical:"Target will do half the normal damage when making non-spell attacks",
  primarySuccess:"{nms:target:the:true} strength is reduced.",
  effect:{
    category:'enhancement',
    modifyOutgoingAttack:function(attack) {
      if (attack.skill.type !== 'spell') attack.damageModifier /= 2
    },
  },
})

new SpellSelf("Focus", {
  level:3,
  description:"The target of this spell can cast attack spells better.",
  tactical:"Gives a +3 bonus to attack rolls for spells.",
  primarySuccess:"{nms:target:the:true} mental acuity is enhanced.",
  effect:{
    category:'enhancement',
    modifyOutgoingAttack:function(attack) {
      if (attack.skill.type !== 'spell') attack.offensiveBonus += 3
    },
  },
})

new Spell("Befuddle", {
  level:3,
  description:"The target of this spell will cast attack spells poorly.",
  tactical:"Gives a -3 penalty to attack rolls for spells.",
  primarySuccess:"{nms:target:the:true} mental acuity is reduced.",
  effect:{
    category:'enhancement',
    modifyOutgoingAttack:function(attack) {
      if (attack.skill.type !== 'spell') attack.offensiveBonus -= 3
    },
  },
})






//-------  ENHANCING SPELLS  -----------
// These spells give the cast an ability, but only in terms of adding the active effect. It is up to authors
// to create the world so this is meaningful.

new SpellSelf("Lore", {
  level:2,
  description:"While this spell is active, you will gain new insights into items and creatures you look at.",
  primarySuccess:"You feel enlightened.",
  effect:{
    category:'enhancement',
  },
})

new SpellSelf("Walk On Water", {
  level:2,
  description:"While this spell is active, you can walk on water!",
  primarySuccess:"You feel lighter.",
  effect:{
    category:'enhancement',
  },
})

new SpellSelf("Featherfall", {
  level:2,
  description:"While this spell is active, you can fall from a great height without harm (as long as it is not into lava!).",
  primarySuccess:"You feel lighter.",
  effect:{
    category:'enhancement',
  },
})







//-------  ELEMENTAL PROTECTION SPELLS  -----------
// These spells give the target protection (or vulnerability) to an element for a while


for (const el of ['Fire', 'Frost', 'Storm', 'Rainbow', 'Shadow']) {
  new SpellSelf("Protection From " + el, {
    level:4,
    description:"Can be cast on yourself to give protection to all " + el + "-based attacks.",
    tactical:"Your take one third damage from all " + el + "-based attacks.",
    primarySuccess:"You take only a third damage from " + el.toLowerCase() + "-based attacks for six turns.",
    duration:6,
    element:el.toLowerCase(),
    effect:{
      category:'protection',
      modifyIncomingAttack:function(attack) {
        if (attack.element !== this.element) return
        attack.damageMultiplier /= 3
      },
    },
  })

  new Spell("Vulnerability To " + el, {
    level:4,
    description:"Can be cast on a target to give vulnerability to all " + el + "-based attacks.",
    tactical:"Target takes three times damage from all " + el + "-based attacks.",
    primarySuccess:"Target takes triple damage from " + el.toLowerCase() + "-based attacks for six turns.",
    duration:6,
    element:el.toLowerCase(),
    effect:{
      category:'protection',
      modifyIncomingAttack:function(attack) {
        if (attack.element !== this.element) return
        attack.damageMultiplier *= 3
      },
    },
  })

  new SpellSelf("Immunity To " + el, {
    level:4,
    description:"Can be cast on yourself to give immunity to all " + el + "-based attacks.",
    primarySuccess:"You take no damage from " + el.toLowerCase() + "-based attacks for six turns.",
    duration:6,
    element:el.toLowerCase(),
    effect:{
      category:'protection',
      modifyIncomingAttack:function(attack) {
        if (attack.element !== this.element) return
        attack.damageMultiplier *= 0
      },
    },
  })
}




//-------  ELEMENTAL WEAPON ENHANCEMENTS  -----------
// Cast on a weapon to give it a bonus

new SpellInanimate("Earthmight Smasher", {
  level:2,
  description:"The Earthmight Smasher spell will temporarily enchant any crushing weapon to do extra Earthmight-based damage.",
  tactical:"Can be cast on any crushing weapon the player is holding. The weapon will then do Earthmight damage, and an additional 6 damage.",
  getTargets:function(attack) { return scopeHeldBy().filter(el => el.weaponClass === 'Crushing' && el.loc === attack.attacker.name) },
  targetEffect:function(attack, item) {
    attack.msg(processText("{nm:item:the:true} now has earthmight pounding in it.", {item:item}), 1)
  },
  effect:{
    modifyOutgoingAttack:function(attack) {
      attack.element = "earthmight"
      attack.damageBonus += 6
    },
  },
  msgNoTarget:"You have no crush weapon for this spell.",
})

new SpellInanimate("Storm Bow", {
  level:2,
  description:"The Storm Bow spell will temporarily enchant any bow to do extra Storm-based damage.",
  tactical:"Can be cast on any bow the player is holding. The weapon will then do Storm damage, and an additional 6 damage.",
  getTargets:function(attack) { return scopeHeldBy().filter(el => el.weaponClass === 'Bow' && el.loc === attack.attacker.name) },
  targetEffect:function(attack, item) {
    attack.msg(processText("{nm:item:the:true} now fizzles with electrical energy.", {item:item}), 1)
  },
  effect:{
    modifyOutgoingAttack:function(attack) {
      attack.element = "storm"
      attack.damageBonus += 6
    },
  },
  msgNoTarget:"You have no bow for this spell.",
})

new SpellInanimate("Ice Spear", {
  level:2,
  description:"The Ice Spear spell will temporarily enchant any polearm to do extra Fros-based damage.",
  tactical:"Can be cast on any polearm the player is holding. The weapon will then do frost damage, and the damage dice type will be increased by 3 (so a d6 will become d9).",
  getTargets:function(attack) { return scopeHeldBy().filter(el => el.weaponClass === 'Polearm' && el.loc === attack.attacker.name) },
  targetEffect:function(attack, item) {
    attack.msg(processText("{nm:item:the:true} has frost over it.", {item:item}), 1)
  },
  effect:{
    modifyOutgoingAttack:function(attack) {
      attack.element = "frost"
      attack.damageSides += 3
    },
  },
  msgNoTarget:"You have no bow for this spell.",
})

new SpellInanimate("Flaming Blade", {
  level:2,
  description:"The Flaming Blade spell will temporarily enchant any bladed weapon to do extra Fire-based damage.",
  tactical:"Can be cast on any blade the player is holding. The weapon will then do fire damage, and the number of damage dice type will be increased by 1.",
  getTargets:function(attack) { return scopeHeldBy().filter(el => el.weaponClass === 'Blade' && el.loc === attack.attacker.name) },
  targetEffect:function(attack, item) {
    attack.msg(processText("{nm:item:the:true} now has fire along its blade.", {item:item}), 1)
  },
  effect:{
    modifyOutgoingAttack:function(attack) {
      attack.element = "fire"
      attack.damageNumber++
    },
  },
  msgNoTarget:"You have no bladed weapon for this spell.",
})

new SpellInanimate("Axe of Shadows", {
  level:3,
  description:"The Axe of Shadows spell will temporarily enchant any bladed weapon to do extra Shadow-based damage.",
  tactical:"Can be cast on any axe the player is holding. The weapon will then do shadow damage, and the number of damage dice type will be increased by 1.",
  getTargets:function(attack) { return scopeHeldBy().filter(el => el.weaponClass === 'Axe' && el.loc === attack.attacker.name) },
  targetEffect:function(attack, item) {
    attack.msg(processText("{nm:item:the:true} now has void-shadows dancing along its blade.", {item:item}), 1)
  },
  effect:{
    modifyOutgoingAttack:function(attack) {
      attack.element = "shadow"
      attack.damageNumber++
    },
  },
  msgNoTarget:"You have no axe for this spell.",
})

new SpellInanimate("Rainbow gun", {
  level:5,
  description:"The Rainbow gun spell will temporarily enchant any firearm to do extra Rainbow-based damage.",
  tactical:"Can be cast on any firearm the player is holding. The weapon will then do Rainbow damage, and the damage will be increased by 5.",
  getTargets:function(attack) { return scopeHeldBy().filter(el => el.weaponClass === 'Firearm' && el.loc === attack.attacker.name) },
  targetEffect:function(attack, item) {
    attack.msg(processText("{nm:item:the:true} is now glowing.", {item:item}), 1)
  },
  effect:{
    modifyOutgoingAttack:function(attack) {
      attack.element = "rainbow"
      attack.damageBonus++
    },
  },
  msgNoTarget:"You have no firearm for this spell.",
})





new SpellSummon(w.fire_sword_prototype, 7, 6, {})

new SpellSummon(w.ice_spear_prototype, 7, 6, {})

new SpellSummon(w.earth_club_prototype, 7, 6, {})





//-------  VISAGE SPELLS  -----------
// Change the player's appearance

new SpellSelf("Kobold Glamour", {
  level:1,
  description:"After casting this spell, the caster will resemble a kobold.",
  tactical:"Visage spells are purely visual - there is no change in the caster's stats or general size, and caster will not sound any different.",
  duration:5,
  visage:'kobold',
  regex:/kobold/,
  effect:{
    category:'visage',
    start:function(target) {
      target.visage === this.visage
      return "{nv:target:have:true} now has a long, crocodilian snout, and green scales."
    },
    finish:function(target) {
      delete target.visage
      return "{nms:target:the:true} appearance returns to normal."
    },
  },
})





const visages = [
  {name:'Azure', colour:'blue', skin:'sky blue', hair:'royal blue', eyes:'pale blue'},
  {name:'Vermilion', colour:'red', skin:'blood red', hair:'blood red', eyes:'pink'},
  {name:'Viridescent', colour:'green', skin:'deep green', hair:'emerald', eyes:'pale green'},

]

for (const visage of visages) {
  new SpellSelf(visage.name + " Visage", {
    visage:visage.colour,
    description:"After casting this spell, the caster will be " + visage.colour + ".",
    tactical:"Visage spells are purely visual - there is no change in the caster's stats or general size, and caster will not sound any different.",
    regex:new RegExp(visage.name.toLowerCase()),
    effect: {
      category:'visage',
      visageData:visage,
      start:function(target) {
        if (target.visage === this.visage) {
          return "{nv:target:have:true} still got " + this.visageData.skin + " skin and " + this.visageData.hair + " hair."
        }
        target.visage = this.visage
        target.visageSkin = this.visageData.skin
        target.visageHair = this.visageData.hair
        target.visageEyes = this.visageData.eyes
        return "{nv:target:have:true} now got " + this.visageData.skin + " skin and " + this.visageData.hair + " hair."
      },
      finish:function(target) {
        delete target.visage
        delete target.visageSkin
        delete target.visageHair
        delete target.visageEyes
        return "{nms:target:the:true} appearance returns to normal."
      },
    },
  })
}





new SpellSelf("Truesight", {
  targetEffect:function(attack) {
    const room = w[attack.attacker.loc]
    let flag = false
    for (const o of scopeReachable()) {
      if (typeof o.truesight === "function") {
        flag = flag || o.truesight()
      }
    }
    if (!flag) attack.msg("It would seem there are no illusions here.", 1)
  },
})

new SpellSelf("Cleanse", {
  targetEffect:function(attack) {
    const room = w[attack.attacker.loc]
    let flag = false
    for (const o of scopeReachable()) {
      if (typeof o.cleanse === "function") {
        flag = flag || o.cleanse()
      }
    }
    if (!flag) attack.msg("Nothing here needs cleaning.", 1)
  },
})






//-------  ENVIRONMENTAL SPELLS  -----------
// Affect inanimate items in the location

new SpellInanimate("Identify", {
  level:2,
  description:"Any special items in this location will be identified.",
  getTargets:function(attack) { 
    const list = scopeReachable().filter(el => el.identify)    
    return list//.concat(scopeHeld().filter(el => el.identify))
  },
  targetEffect:function(attack, item) {
    msg(item.isAtLoc(player) ? "- {nm:item:a:true} held by {nm:player:the}: {show:item:identify}" : "- {nm:item:a:true}: {show:item:identify}", {item:item})
  },
  msgNoTarget:"{nv:attacker:cast:true} the {i:{nm:skill}} spell, but there is nothing here that it can find.",
})

new SpellInanimate("Unlock", {
  level:2,
  description:"All locks in this location will unlock.",
  getTargets:function(attack) { 
    const list = w[attack.attacker.loc].getExits().filter(el => el.isLocked()) 
    for (const key in w) {
      if (w[key].isHere() && w[key].locked) list.push(w[key])
    }
    return list
  },
  targetEffect:function(attack, ex) {
    if (ex instanceof Exit) {
      attack.msg("The door to " + ex.nice() + " unlocks.", 1)
      ex.setLock(false)
    }
    else {
      attack.msg(processText("{nv:item:unlock:true}.", {item:ex}), 1)
      ex.locked = false
    }
  },
  msgNoTarget:"{nv:attacker:cast:true} the {i:{nm:skill}} spell, but there are no locked doors.",
})

new SpellInanimate("Unillusion", {
  level:2,
  description:"All illusions in this location will disappear.",
  automaticSuccess:true,
  getTargets:function(attack) { 
    const list = scopeHereParser().filter(el => el.unillusion)
    if (currentLocation.unillusion) list.push(currentLocation)
    return list
  },
  targetEffect:function(attack, item) {
    item.unillusion(attack)
  },
  msgNoTarget:"{nv:attacker:cast:true} the {i:{nm:skill}} spell, but there are no illusions here.",
})

new SpellSelf("Annulment", {
  icon:'annul',
  description:"Cancels all spell (and other) effects on the caster, good or bad.",
  targetEffect:function(attack) {
    if (attack.target.activeEffects.length === 0) {
      attack.msg("The {i:Annulment} spell has no effect - no effects to annul!")
      return
    }
    for (const el of attack.target.activeEffects) {
      const s = rpg.findEffect(el).terminate(attack.target)
      attack.msg(s)
    }
    rpg.setEffectFlags(attack.target)
    return true
  },
})

new SpellSelf("Dispel", {
  icon:'annul',
  description:"Dispels all elementals across the entire world!",
  targetEffect:function(attack) {
    rpg.broadcast('elementals', 'destroy', player)
    return true
  },
})







new SpellSelf("Healing", {
  icon:'annul',
  description:"A standard healing spell.",
  tactical:"Gives up to 25 hit points (up to your maximum).",
  hits:25,
  targetEffect:function(attack) {
    attack.attacker.health += 25
    if (attack.attacker.health > attack.attacker.maxHealth) attack.attacker.health = attack.attacker.maxHealth
    attack.msg("{nv:attacker:have:true} {show:attacker:health} hits.")
    return true
  },
})

new Spell("Commune with animal", {
  level:1,
  description:"Can be cast on any beast to allow the caster to talk to it for a limited time.",
  icon:'commune',
  regex:/commune/,
  duration:5,
  automaticSuccess:true,
  suppressAntagonise:true,
  effect:{
    start:function(target) {
      return target.beast ? "{nv:attacker:can:true} now talk to {nm:target:the} for a short time." : "{nv:attacker:can:true} talk to {nm:target:the} for a short time (like before the spell...)."
    },
  },
})

new Spell("Befriend", {
  level:4,
  description:"Can be cast on any character; the character will see the player as his or her friend, and may, therefore, see former friends as foes.",
  icon:'befriend',
  regex:/befriend/,
  automaticSuccess:true,
  suppressAntagonise:true,
  effect:{
    start:function(target) {
      target.allegiance = 'friend'
      target.hostile = false
      return "{nv:target:will:true} now regard {nm:attacker:the} as a friend."
    },
  },
})

new Spell("Calm", {
  level:2,
  description:"Can be cast on any character; the character will stopping attacking, at least for now.",
  icon:'befriend',
  regex:/calm/,
  automaticSuccess:true,
  suppressAntagonise:true,
  effect:{
    start:function(target) {
      target.hostile = false
      return "{nv:target:be:true} no longer hostile."
    },
  },
})

new Spell("Enrage", {
  level:2,
  description:"Can be cast on any character; the character will attack you and no longer consider you a friend! Use with caution.",
  icon:'enrage',
  regex:/enrage/,
  automaticSuccess:true,
  effect:{
    start:function(target) {
      target.hostile = true
      target.target = player.name
      if (target.allegiance === 'friend') target.allegiance = 'foe'
      return "{nv:target:look:true} angry at you."
    },
  },
})


new Spell("Mute", {
  level:4,
  description:"After casting this spell, the target will be unable to speak.",
  tactical:"Whilst muted, the target will be unable to cast most spells. Lasts five turns.",
  regex:/mute/,
  duration:5,
  effect: {
    category:'enhancement',
    flags:['mute'],
    start:function(target) {
      return "{nv:target:can:true} no longer talk."
    },
    finish:function(target) {
      return "{nv:target:can:true} talk again."
    },
  },
})

new Spell("Blind", {
  level:7,
  description:"After casting this spell, the target will be unable to see.",
  tactical:"Whilst blinded, the target will be unable to cast most spells or attack. Lasts five turns.",
  duration:5,
  effect: {
    category:'enhancement',
    flags:['blinded'],
    start:function(target) {
      return "{nv:target:can:true} no longer see."
    },
    finish:function(target) {
      return "{nv:target:can:true} see again."
    },
  },
})


new SpellSelf("Mage Light", {
  level:1,
  description:"The caster glows, illuminating the location.",
  duration:5,
  regex:/light/,
  automaticSuccess:true,
  effect:{
    start:function(target) {
      target.isLight = true
      return "{nv:target:be:true} shines brightly."
    },
    finish:function(target) {
      target.isLight = false
      return "{nv:target:stop:true} shining."
    },
  },
})

new SpellSelf("Way of the Merchant", {
  level:1,
  description:"The caster gains knowledge of how much items are worth and how much others are prepared to pay for them.",
  tactical:"Gives a +5 bonus to the trading skill.",
  duration:5,
  regex:/light/,
  automaticSuccess:true,
  effect:{
    start:function(target) {
      target.tradeSkill += 5
      return "{nv:target:be:true} gains trading skill."
    },
    finish:function(target) {
      target.tradeSkill -= 5
      return "{nv:target:stop:true} loses trading skill."
    },
  },
})

new SpellSelf("Returning", {
  icon:'moving',
  description:"Casting this spell instantly moves the caster to the location of the Stone of Returning.",
  item:'Stone_of_Returning',
  targetEffect:function(attack) {
    msg("The air swirls around you, and everything blurs...")
    rpg.teleport(attack.target, w[this.item].loc)
    return true
  },
})

new SpellSelf("Teleport", {
  icon:'moving',
  description:"Casting this spell instantly moves the caster to a location previously stored with the <i>Mark</i> spell.",
  testUseable:function(char) {
    if (!char.activeTeleportLocation) {
      if (char === player) msg("The {i:Teleport} spell can only be used once a location has been marked!")
      return false
    }
    return rpg.defaultSpellTestUseable(char)
  },
  targetEffect:function(attack) {
    msg(attack.target === player ? "The air swirls around {nm:char:the}, and everything blurs..." : "The air swirls around {nm:char:the}, and {pv:char:disappear}...", {char:attack.target})
    rpg.teleport(attack.target, attack.target.activeTeleportLocation)
    return true
  },
})

new SpellSelf("Mark", {
  description:"Casting this spell marks a location for later use with the <i>Teleport</i> spell.",
  icon:'moving',
  targetEffect:function(attack) {
    attack.msg("This location is marked for future use.")
    attack.target.activeTeleportLocation = attack.target.loc
    return true
  },
})

new SpellSelf("Call rain", {
  description:"Casting this spell will cause it to rain.",
  icon:'weather',
  modifyOutgoingAttack:function(attack) {
    if (player.currentWeatherDisabled) return
    const weather = weatherTypes[player.currentWeatherName]
    if (!weather.outside()) {
      attack.abort("The <i>Call rain</i> spell can only be used outside.")
    }
    if (weather.wetness > 0) {
      attack.abort("The <i>Call rain</i> spell is only going to work if it is not already raining.")
    }
  },
  targetEffect:function(attack) {
    const currentName = 'rain'
    const current = weatherTypes[currentName]
    player.currentWeatherName = currentName
    player.currentWeatherCount = 0
    player.currentWeatherTotal = current.getNumberOfTurns()
    if (current.start) current.start(this.name)
    return true
  },
})

new SpellSelf("Cloudbusting", {
  description:"Casting this spell will clear the sky of all clouds, at least for a while.",
  icon:'weather',
  modifyOutgoingAttack:function(attack) {
    if (player.currentWeatherDisabled) return
    const weather = weatherTypes[player.currentWeatherName]
    if (!weather.outside()) {
      attack.abort("The <i>Cloudbusting</i> spell can only be used outside.")
    }
    if (weather.name === 'hot') {
      attack.abort("The <i>Cloudbusting</i> spell is only going to work if there are clouds around")
    }
  },
  targetEffect:function(attack) {
    const currentName = 'clearingToHot'
    const current = weatherTypes[currentName]
    player.currentWeatherName = currentName
    player.currentWeatherCount = 0
    player.currentWeatherTotal = current.getNumberOfTurns()
    if (current.start) current.start(this.name)
    return true
  },
})






new SpellSelf("Demon shape", {
  description:"Can be cast on yourself to give yourself the attributes of a demon.",
  tactical:"Adds 2 to your armour.",
  primarySuccess:"Your skin becomes as hard as stone - and yet as flexible as it was.",
  effect:{
    category:'armour',
    modifyIncomingAttack:function(attack) {
      attack.armourModifier += 2
    },
  },
})





new SpellTransformInanimate("Animate statues", {
  level:2,
  description:"Targeted statue will become a stone golem.",
  prototype:'stone_golem',
  msgNoTarget:"{nv:attacker:cast:true} the {i:{nm:skill}} spell, but there are no statues here.",
})






log("Added " + rpg.list.filter(el => el.type === 'spell').length + " spells")



/*

Lighting and fog


we need to give each item responsibility for deciding if it is reachable and/or seeable.
we need to check the light situation before hand.




utterlight - no darkness, no shadows
daylight - destoyrs vampires
interior light or bright night
dim light - invisible with shadows
complete darkness - can see with dark vision
utterdark - extinguishes all lights except utterlight


illusions
invisible
fog


need to consider ambient light

10 utterlight - no darkness, no shadows
9 bright sunlight
8 normal sunlight
7 bright day
6 dark daylight
5 twilight
4 moonlit night
3 dark night
2 very dark, interior with no lights
1 complete darkness - can see with dark vision
0 utterdark - extinguishes all lights except utterlight


each room has a getAmbientLighting function
also consider each item inb the room - this is already done somewhere (_world.js?)


need to consider each character's relationship with an item
is the item held or in a container held?
is it lit?
is fog obscuring vision?
is it invisible?
is it an illusion?
is it hidden by an illusion?




True sight
Darkness
Light
Utterdark
Utterlight
Invisibility
Shadows
Visage
Phantom
Darkvision
Utterdark vision
Fog
*/




/*
Summon weapon/shield

Merchant's tongue

Extinguish

Command

Sleep

Beast form

Breathe under water

Create or raise undead

Repel undead

Web

Status effects
Shocked/burning/stunned/frozen/weakened/strengthen/

Curse/remove curse

*/