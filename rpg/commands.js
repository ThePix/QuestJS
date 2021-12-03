"use strict";

 


commands.push(new Cmd('Attack', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {scope:parser.isPresent}
  ],
  defmsg:"No point attacking {nm:item:the}."
}))


commands.push(new Cmd('Search', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {scope:parser.isPresent}
  ],
  defmsg:"No point attacking {nm:item:the}."
}))

commands.push(new Cmd('Equip', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  objects:[
    {scope:parser.isHeld}
  ],
  defmsg:"{nv:item:be:true} not something you can equip.",
}))


commands.push(new Cmd('Unequip', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  objects:[
    {scope:parser.isHeld}
  ],
  defmsg:"{nv:item:be:true} not something you can equip.",
}))





commands.push(new Cmd('LearnSpell', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {special:'text'}
  ],
  script:function(objects) {
    const spell = rpg.find(objects[0])
    if (!spell || !spell.spell) return failedmsg("There is no spell called " + objects[0] + ".")
      
    const source = rpg.isSpellAvailable(player, spell)
    if (!source) return failedmsg("You do not have anything you can learn {i:" + spell.name + "} from.")
    
    player.skillsLearnt.push(spell.name)
    msg("You learn {i:" + spell.name + "} from " + lang.getName(source, {article:DEFINITE}) + ".")
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
    if (!spell || !spell.spell) return failedmsg("There is no spell called " + objects[0] + ".")
      
    if (!player.skillsLearnt.includes(spell.name)) return failedmsg("You do not know the spell {i:" + spell.name + "}.")
    
    if (!spell.noTarget) return failedmsg("You need a target for the spell {i:" + spell.name + "}.")

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



