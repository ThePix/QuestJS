"use strict";

 


commands.push(new Cmd('Attack', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {scope:parser.isPresent}
  ],
  defmsg:lang.notAFoe
}))


findCmd('Search').script = function(objects) {
  const obj = objects[0][0]
  const options = {char:player, item:obj}
  
  if (!obj.rpgCharacter && !obj.search) {
    return failedmsg(lang.searchNothing, options)
  }
  else if (!obj.dead && !obj.asleep) {
    return failedmsg(lang.searchAlive, options)
  }
  else if (obj.searched) {
    msg(lang.searchNothingMore, options)
  }
  else if (obj.search) {
    obj.search(options)
    obj.searched = true
  }
  else if (settings.defaultSearch) {
    settings.defaultSearch(obj, options)
    obj.searched = true
  }
  else {
    return failedmsg(lang.searchNothing, options)
  }

  return world.SUCCESS 
}

commands.push(new Cmd('Equip', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  objects:[
    {scope:parser.isHeld}
  ],
  defmsg:lang.notEquippable,
}))


commands.push(new Cmd('Unequip', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  objects:[
    {scope:parser.isHeld}
  ],
  defmsg:lang.notEquippable,
}))





commands.push(new Cmd('LearnSpell', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {special:'text'}
  ],
  script:function(objects) {
    const spell = rpg.find(objects[0])
    if (!spell || !spell.spell) return failedmsg(lang.noSpellCalled, {text:objects[0]})
      
    // is there a spell book or whatever at hand to learn the spell from
    const source = rpg.isSpellAvailable(player, spell)
    if (!source) return world.FAILED
    
    // are there are other restrictions, such as level?
    if (player.isSpellLearningAllowed && !player.isSpellLearningAllowed(spell, source)) return world.FAILED
    
    player.skillsLearnt.push(spell.name)
    msg(lang.learnSpell, {spell:spell, item:source})
    return world.SUCCESS
  },
}))



commands.push(new Cmd('CastSpell', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {special:'text'}
  ],
  script:function(objects) {
    const spell = rpg.find(objects[0])
    if (!spell || !spell.spell) return failedmsg(lang.noSpellCalled, {text:objects[0]})
      
    if (!player.skillsLearnt.includes(spell.name)) return failedmsg(lang.doNotKnowSpell, {spell:spell})
    
    // are there are other restrictions, such as enough mana
    if (player.isSpellCastingAllowed && !player.isSpellCastingAllowed(spell)) return world.FAILED

    if (!spell.noTarget) return failedmsg(lang.needTargetForSpell, {spell:spell})

    const attack = Attack.createAttack(player, player, spell)
    if (!attack) return world.FAILED
    attack.apply().output()
    return world.SUCCESS
  },
}))





commands.push(new Cmd('CastSpellAt', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {special:'text'},
    {scope:parser.isPresent},
  ],
  script:function(objects) {
    const spell = rpg.find(objects[0])
    if (!spell || !spell.spell) return failedmsg("There is no spell called " + objects[0] + ".")
      
    if (!player.skillsLearnt.includes(spell.name)) return failedmsg("You do not know the spell {i:" + spell.name + "}.")
    
    const target = objects[1][0]

    // check target
    
    if (spell.damage && target.health === undefined) return failedmsg("You can't attack that.")

    const attack = Attack.createAttack(player, target, spell)
    if (!attack) return world.FAILED
    attack.apply().output()
    return world.SUCCESS
  },
}))


commands.push(new Cmd('DebugRPG', {
  regex:/^rpg$/,
  objects:[
  ],
  script:function(objects) {
    settings.attackOutputLevel = 10
    metamsg("All output from attacks will now be seen.");
    return world.SUCCESS_NO_TURNSCRIPTS
  },
}))



