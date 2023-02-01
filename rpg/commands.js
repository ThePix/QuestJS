"use strict";

findCmd('MetaHelp').script = function() {
  metamsg("{b:User Interface:} To interact with an object, click on its name in the side pane to the left, and a set of possible actions will appear under it. Click on the appropriate action.")
  metamsg("You can use the compass rose at the top to move around. Click the eye symbol, &#128065;, to look at you current location, the clock symbol to wait.")
  metamsg("Looking now at the right, the set of buttons at the top are for meta-controls; UNDO, HELP, ABOUT, DARK MODE, SAVE and LOAD.")
  metamsg("The pane below that shows your character's status, and the pane below that any current effect currently active.")
  metamsg("The lower panel has all the attacks available to your character. Those that are yellow are spells. Any in italics need a target to be set - select from the list on the left, and choose \"Target\". Any attacks that require a weapon will be shown in pink; you need a weapon equipped to use the attack. Select a weapon from the left panes, and click on \"Click\". Your current target and equipped weapon will be shown in the status area")
  metamsg("You can click on the eye symbol by the pane titles to toggle them being visible. This may be useful if there is a lot there, and entries are disappearing off the bottom of your screen, though you may miss that something is here if you are not careful!")
  metamsg("Items you are holding can be stowed in your pack - this can help keep the interface less cluttered. To stow an item, select it, and click \"Stow\". To retrieve items - or just check what you have packed away - click the suitcase by the compass, and a list will be presented. Select the items you want to retrieve. If you select none, no time will pass in the game.")
  return world.SUCCESS_NO_TURNSCRIPTS
}


 
TAKEABLE_DICTIONARY.stow = function(options) {
  if (this.testStow && !this.testStow(options)) return false
  msg(this.msgStow || lang.msgStow, options)
  this.moveToFrom(options, "_storage", "name")
  return true
}  
  
TAKEABLE_DICTIONARY.retrieve = function(options) {
  if (this.loc !== "_storage") return falsemsg(lang.notStowed, options)
  if (player.unableToRetrieveFromStorage) return failedmsg(player.unableToRetrieveFromStorage)
  msg(this.msgRetrieve || lang.msgRetrieve, options)
  this.moveToFrom(options, "name", "_storage")
  return true
}




new Cmd('Target', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {scope:parser.isPresent}
  ],
  script:function(objects) {
    // test TDO !!!
    player.target = objects[0][0].name
    if (settings.msgWhenTargeting) metamsg(lang.targeting, {char:player, target:player.target})
    io.updateStatus()
    return world.SUCCESS_NO_TURNSCRIPTS
  },
  defmsg:lang.notAFoe
})

new Cmd('Attack', {
  rules:[cmdRules.isPresent],
  objects:[
    {scope:parser.isPresent}
  ],
  defmsg:lang.notAFoe
})


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

new Cmd('Equip', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  objects:[
    {scope:parser.isHeld}
  ],
  defmsg:lang.notEquippable,
})


new Cmd('Unequip', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  objects:[
    {scope:parser.isHeld}
  ],
  defmsg:lang.notEquippable,
})


new Cmd('Stow', {
  npcCmd:true,
  rules:[cmdRules.isHeld],
  objects:[
    {scope:parser.isHeld}
  ],
  defmsg:lang.notStowable,
})

parser.isStowed = function(item) {
  return item.isAtLoc('_storage')
}
new Cmd('Retrieve', {
  npcCmd:true,
  objects:[
    {scope:parser.isStowed, extendedScope:true}
  ],
  defmsg:lang.notStowable,
})



new Cmd('RetrieveMenu', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {special:'text'}
  ],
  script:function(objects) {
    const objs = rpg.listStowed()
    //log(document.querySelector("#dialog-button").innerHTML)
    //log(objs)
    if (objs.length === 0) return failedmsg(lang.nothingStored)
    if (player.unableToRetrieveFromStorage) return failedmsg(player.unableToRetrieveFromStorage)
    

    let html = ''
    const noCols = Math.floor(objs.length / 16) + 1
    if (noCols === 1) {
      for (const o of objs) {
        html += '<input type="checkbox" id="retrive_' + o.name + '" name="retrive_' + o.name + '" value="' + o.name + '"><label for="retrive_' + o.name + '">&nbsp;&nbsp;' + o.listAlias + '</label><br>'
      }
    }
    else {
      html += '<table>'
      let col = 1
      for (const o of objs) {
        if (col === 1) html += '<tr>'
        html += '<td with="33%"><input type="checkbox" id="retrive_' + o.name + '" name="retrive_' + o.name + '" value="' + o.name + '"><label for="retrive_' + o.name + '">&nbsp;&nbsp;' + o.listAlias + '</label></td>'
        if (col === noCols) {
          html += '</tr>'
          col = 1
        }
        else {
          col++
        }
      }
      html += '</table>'
    }



    document.body.querySelector('#dialog-title').innerHTML = 'Select items to retrieve'
    document.body.querySelector('#dialog-content').innerHTML = html
    io.disable()
    const diag = document.querySelector("#dialog")
    document.querySelector("#dialog-button").onclick = function() {
      //log('clicked')
      //settings.startingDialogEnabled = true
      const nodes = document.querySelectorAll('#dialog-content input[type=checkbox]')
      const objs = []
      for (const node of nodes) {
        if (node.checked) {
          log(node.value)
          objs.push(w[node.value])
        }
      }
      if (objs.length) {
        for (const o of objs) {
          o.moveToFrom({char:player, item:o}, "name", "_storage")
        }
        msg(lang.msgBulkRetrieve, {char:player, list:objs})
        world.endTurn(world.SUCCESS)
      }
      document.querySelector("#dialog").style.display = 'none'
      io.enable()
      if (settings.textInput) document.querySelector('#textbox').focus()
    }
    diag.style.width = (80 + 120 * noCols) + 'px'
    diag.style.display = 'block'
    diag.style.position = 'fixed'
    diag.style.top =  '50%'
    diag.style.left = '50%'
    diag.style.transform = 'translate(-50%, -50%)'
    //log(document.querySelector("#dialog-button").innerHTML)
    return world.SUCCESS_NO_TURNSCRIPTS
  },
})



new Cmd('LearnSpell', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {special:'text'}
  ],
  script:function(objects) {
    const spell = rpg.find(objects[0])
    if (!spell || spell.type !== 'spell') return failedmsg(lang.noSpellCalled, {text:objects[0]})
      
    // is there a spell book or whatever at hand to learn the spell from
    const source = rpg.isSpellAvailable(player, spell)
    if (!source) return world.FAILED
    
    // are there are other restrictions, such as level?
    if (player.isSpellLearningAllowed && !player.isSpellLearningAllowed(spell, source)) return world.FAILED
    
    player.skillsLearnt.push(spell.name)
    msg(lang.learnSpell, {spell:spell, item:source})
    return world.SUCCESS
  },
})



new Cmd('CastSpell', {
  npcCmd:true,
  rules:[cmdRules.isPresent],
  objects:[
    {special:'text'}
  ],
  script:function(objects) {
    const spell = rpg.find(objects[0])
    if (!spell || spell.type !== 'spell') return failedmsg(lang.noSpellCalled, {text:objects[0]})
      
    if (!player.skillsLearnt.includes(spell.name)) return failedmsg(lang.doNotKnowSpell, {spell:spell})
    
    // are there are other restrictions, such as enough mana
    if (player.isSpellCastingAllowed && !player.isSpellCastingAllowed(spell)) return world.FAILED
    
    let target
    if (spell.noTarget) {
      target = player
    }
    else {
      if (!player.target) return failedmsg(lang.needTargetForSpell, {spell:spell})
      target = w[player.target]
      if (player.loc !== target.loc) return failedmsg(lang.targetNotHere, {spell:spell, target:player.target})
    }

    const attack = Attack.createAttack(player, target, spell)
    if (!attack) return world.FAILED
    attack.apply().output()
    return world.SUCCESS
  },
})





new Cmd('CastSpellAt', {
  npcCmd:true,
  //antiRegexes:lang.regex.CastSpellAtAntiRegex,
  rules:[cmdRules.isPresent],
  objects:[
    {special:'text'},
    {scope:parser.isPresent},
  ],
  script:function(objects) {
    const spell = rpg.find(objects[0])
    if (!spell || spell.type !== 'spell') return failedmsg(lang.noSpellCalled, {text:objects[0]})
    if (!player.skillsLearnt.includes(spell.name)) return failedmsg(lang.doNotKnowSpell, {spell:spell})

    const target = objects[1][0]
    if (spell.noTarget && target !== player) return failedmsg(lang.needNoTargetForSpell, {spell:spell})
    if (spell.damage && target.health === undefined) return failedmsg("You can't attack that.")

    const attack = Attack.createAttack(player, target, spell)
    if (!attack) return world.FAILED
    attack.apply().output()
    return world.SUCCESS
  },
})


new Cmd('DebugRPG', {
  regex:/^rpg$/,
  objects:[
  ],
  script:function(objects) {
    settings.attackOutputLevel = 10
    metamsg("All output from attacks will now be seen.");
    return world.SUCCESS_NO_TURNSCRIPTS
  },
})



