"use strict"

findCmd('Inv').script = function() {
  const listOfOjects = player.getContents(world.INVENTORY)
  msg(lang.inventory_prefix + " " + formatList(listOfOjects, {article:INDEFINITE, lastSep:lang.list_and, modified:true, nothing:lang.list_nothing, loc:player.name}) + ".", {char:player})
  
  const options = {item:w.mouth.content(), char:player}
  if (options.item) msg("{nv:char:have:true} {nm:item:a} in {pa:char} mouth.", options)
  return settings.lookCountsAsTurn ? world.SUCCESS : world.SUCCESS_NO_TURNSCRIPTS
}


/*
new Cmd('Spit', {
  regex:/^spit(?: out|) (.+?)(?: out|)$/,
  objects:[
    {scope:parser.isPresent, attName:"spittable"}
  ],
  script:function(objects) {
    const item = objects[0][0]
    if (item.loc !== 'mouth') return failedmsg("You can't spit something that is not in your mouth")
    msg("You spit out {nm:item:the}.", {item:item})
    item.loc = player.loc
    return world.SUCCESS
  },
})*/
new Cmd('Spit', {
  regex:/^spit(?: out|) (.+?)(?: out|)$/,
  objects:[
    {scope:parser.isPresent, attName:"spittable"}
  ],
  defmsg:"That's not something you can spit.",
})



const SPITTABLE = function() {
  const res = Object.assign({}, TAKEABLE_DICTIONARY)
  res.spittable = true
  res.spit = function(options) {
    if (!this.isInMouth(player)) return failedmsg("You can't spit something that is not in your mouth")
    msg("{nv:char:spit:true} out {nm:item:the}.", options)
    this.loc = player.loc
    return true
  }
  res.isInMouth = function(char) {
    return this.loc === char.name && this.inMouth
  }
  res.afterCreation = function(o) {
    o.verbFunctions.push(function(o, list) {
      list.push(o.isAtLoc(player.name) ? lang.verbs.drop : lang.verbs.take)
      if (o.isInMouth(player)) {
        list.push("Spit out")
      }
    })
    o.nameModifierFunctions.push(function(o, list) {
      if (o.inMouth) list.push("in mouth")
    })
  }
  return res
}




function shootGunAt(options) {
  if (options.comment) metamsg('(' + options.comment + ')')
    log(options)
  
  if (!options.char.getAgreement("Shoot", options)) return false
  if (!options.item.gun) return failedmsg("Can't shoot anything with {nm:item:the}.", options)
  if (!options.item.isHeldBy(options.char)) return failedmsg("{nv:char:don't:true} have {nm:item:the}.", options)
  if (!options.item.ammo) return failedmsg("{nv:item:have:true} no ammo.", options)
  if (!options.target.isHereOrHeldBy(options.char)) return failedmsg("{nv:target:be:true} not here.", options)
    log(options.target)
  if (!options.target.shoot) return failedmsg(options.target.npc ? "{nv:target:be:true} not going to appreciate it if {nv:char:shoot} {ob:target}." : "No need to go shooting up the place.", options)
  
  //msg("{nv:char:shoot:true} {nm:item:the}  at {nm:target:the}.", options)

  const flag = options.target.shoot(options)
  if (flag) options.item.ammo--
  return flag ? world.SUCCESS : world.FAILED
}


new Cmd('ShootGunAtTarget', {
  regexes:[
    /^(?:shoot|fire) (.+) at (.+)$/,
   { regex:/shoot (.+) with (.+)/, mod:{reverse:true}},
   /^use (.+?) (?:to shoot|shoot) (.+)$/,
  ],
  objects:[
    {scope:parser.isHeld, attName:'gun'},
    {scope:parser.isNpcAndHere},
  ],
  script:function(objects) {
    return shootGunAt({char:player, item:objects[0][0], target:objects[1][0]})
  },
})


new Cmd('ShootGun', {
  regex:/^(?:shoot|fire) (.+)$/,
  objects:[
    {scope:parser.isPresent},
  ],
  script:function(objects) {
    log(objects)
    if (objects[0][0].gun) {
      const npcs = scopeNpcHere()
      log(npcs)
      if (npcs.length === 0) return failedmsg("No one here to shoot!")
      if (npcs.length > 1) return failedmsg("Who do you want to shoot?")
      return shootGunAt({char:player, item:objects[0][0], target:npcs[0], comment:'At ' + lang.getName(npcs[0])})
    }
    else {
      const loadedGuns = scopeBy(el => el.isHeld() && el.gun && el.ammo)
      const guns = scopeBy(el => el.isHeld() && el.gun)
      if (guns.length === 0) return failedmsg("You have no gun!")
      const gun = loadedGuns.length > 0 ? loadedGuns[0] : guns[0]
      
      return shootGunAt({char:player, item:gun, target:objects[0][0], comment:'With ' + lang.getName(guns[0])})
    }

  },
})




new Cmd('NpcShootGunAtTarget', {
  regexes:[
    /^(.+), ?(?:shoot|fire) (.+) at (.+)$/,
   { regex:/(.+), ?shoot (.+) with (.+)/, mod:{reverseNotFirst:true}},
   /^(.+), ?use (.+?) (?:to shoot|shoot) (.+)$/,
    /^tell (.+) to (?:shoot|fire) (.+) at (.+)$/,
   { regex:/tell (.+) to shoot (.+) with (.+)/, mod:{reverseNotFirst:true}},
   /^tell (.+) to use (.+?) (?:to shoot|shoot) (.+)$/,
  ],
  objects:[
    {scope:parser.isNpcAndHere},
    {scope:parser.isHeld, attName:'gun'},
    {scope:parser.isNpcAndHere},
  ],
  script:function(objects) {
    const npc = objects[0][0]
    if (!npc.npc) {
      failedmsg(lang.not_npc, {char:player, item:npc})
      return world.FAILED 
    }
    objects.shift()
    
    return shootGunAt({char:npc, item:objects[0][0], target:objects[1][0]})
  },
})


new Cmd('NpcShootGun', {
  regexes:[
    /^(.+), ?(?:shoot|fire) (.+)$/,
    /^tell (.+) to (?:shoot|fire) (.+)$/,
  ],
  objects:[
    {scope:parser.isNpcAndHere},
    {scope:parser.isPresent},
  ],
  script:function(objects) {
    const npc = objects[0][0]
    if (!npc.npc) {
      failedmsg(lang.not_npc, {char:player, item:npc})
      return world.FAILED 
    }
    objects.shift()

    if (objects[0][0].gun) {
      const npcs = scopeNpcHere()
      array.remove(npcs, npc)
      log(npcs)
      if (npcs.length === 0) return failedmsg("No one here to shoot!")
      if (npcs.length > 1) return failedmsg("Who do you want {nm:char:the} to shoot?", {char:npc})
      return shootGunAt({char:npc, item:objects[0][0], target:npcs[0], comment:'At ' + lang.getName(npcs[0])})
    }
    else {
      const loadedGuns = scopeBy(el => el.isHeldBy(npc) && el.gun && el.ammo)
      const guns = scopeBy(el => el.isHeldBy(npc) && el.gun)
      if (guns.length === 0) return failedmsg("{nv:char:have:true} no gun!", {char:npc})
      const gun = loadedGuns.length > 0 ? loadedGuns[0] : guns[0]
      
      return shootGunAt({char:npc, item:gun, target:objects[0][0], comment:'With ' + lang.getName(guns[0])})
    }

  },
})



new Cmd('NpcShootGunAtSelf', {
  regexes:[
    /^(.+), ?(?:shoot|fire) (.+) at (?:your|him|her)self$/,
   { regex:/(.+), ?shoot (.+) with (?:your|him|her)self/, mod:{reverseNotFirst:true}},
   /^(.+), ?use (.+?) (?:to shoot|shoot) (?:your|him|her)self$/,
    /^tell (.+) to (?:shoot|fire) (.+) at (?:your|him|her)self$/,
   { regex:/tell (.+) to shoot (.+) with (?:your|him|her)self/, mod:{reverseNotFirst:true}},
   /^tell (.+) to use (.+?) (?:to shoot|shoot) (?:your|him|her)self$/,
  ],
  objects:[
    {scope:parser.isNpcAndHere},
    {scope:parser.isHeld, attName:'gun'},
  ],
  script:function(objects) {
    const npc = objects[0][0]
    if (!npc.npc) {
      failedmsg(lang.not_npc, {char:player, item:npc})
      return world.FAILED 
    }
    objects.shift()
    
    return shootGunAt({char:npc, item:objects[0][0], target:npc})
  },
})


new Cmd('NpcShootSelf', {
  regexes:[
    /^(.+), ?(?:shoot|fire) (?:your|him|her)self$/,
    /^tell (.+) to (?:shoot|fire) (?:your|him|her)self$/,
  ],
  objects:[
    {scope:parser.isNpcAndHere},
  ],
  script:function(objects) {
    const npc = objects[0][0]
    if (!npc.npc) {
      failedmsg(lang.not_npc, {char:player, item:npc})
      return world.FAILED 
    }
    objects.shift()

    const loadedGuns = scopeBy(el => el.isHeldBy(npc) && el.gun && el.ammo)
    const guns = scopeBy(el => el.isHeldBy(npc) && el.gun)
    if (guns.length === 0) return failedmsg("{nv:char:have:true} no gun!", {char:npc})
    const gun = loadedGuns.length > 0 ? loadedGuns[0] : guns[0]
    
    return shootGunAt({char:npc, item:gun, target:npc, comment:'With ' + lang.getName(guns[0])})

  },
})


tp.addDirective("title", function(arr, params) {
  const npc = tp._findObject(arr[0], params, arr)
  if (!npc) errormsg("Failed to find object '" + name + "' in text processor 'title' (" + params.tpOriginalString + ")")
  if (npc.title) return npc.title
  return npc.isFemale ? 'Ms' : 'Mr'
})


tp.text_processors.tnm = function(arr, params) { return tp.text_processors.title(arr, params) + ' ' + tp.nameFunction(arr, params, false) }



settings.widgetRadioMax = 3


new Cmd('Query', {
  regexes:[
    /^q$/,
  ],
  objects:[
  ],
  script:function(objects) {
    /*askDiag("What colour?", function(result) {
      msg("You picked " + result + ".");
    }, {
      submit:'Go',
      filter:function(key) { return key.match(/\d/) },
      validator:function(s) { return s.length > 0 },
      comment:'You can only use digits. Any other characters will be ignore - apart from an annoying flash of red.'
    })*/
    
    /*askText("What colour?", function(result) {
      msg("You picked " + result + ".");
    })*/

    const quest = {
      title:'Retrieve the inheritance',
      level:1,
      desc:'Simply go to the old farm house and collect the goodies.',
      run:function() {
        log('// do stuff')
      }
    }
    questDialog(quest)
    
    return world.SUCCESS
  },
})



new Cmd('DialogTest', {
  npcCmd:true,
  regex:/^(?:dialog) (.*)$/,
  objects:[
  {special:'text'},
  ],
  script:function(objects) {
    const funcName = parser.currentCommand.tmp.string.replace(/dialog /i, '')
    log(funcName)
    const choices = ['red', 'yellow', 'blue']
    io.menuFunctions[funcName]('Pick a colour?', choices, function(result) {
      msg("You picked " + result)
    })
    return world.SUCCESS_NO_TURNSCRIPTS
  },
})



const questWidgets = {
  title:'Quest!',
  widgets:[
    { type:'dropdownPlus', title:'Quest', name:'quest', lines:4, data:[
      {name:'inheritance', title:'Get inheritance from farm', text:'Go to the badlands, search the farm, grab anything useful, get back.'},
      {name:'spider', title:'Defeat the giant spider', text:'The spider lives in a tower in the foothills. Must either kill it or persuade it to leave the area.'},
    ]},
    { type:'checkbox', title:'Sceduling', name:'night', data:'Go at night time?'},
    { type:'range', title:'Defensive', name:'defRatio', comment:'When in combat, how much emphasise on defence, rather than attack?'},
    { type:'number', title:'Try how many times before giving up?', name:'tries', data:'Go at night time?', opts:'min="1" max="5"'},
    { type:'text', title:'Name this adventure...', name:'name'},
    { type:'colour', title:'Wave this colour flag', name:'flag'},
    { type:'auto', title:'Prioritise', name:'priority', data:{compan:"Companions' well-being", magic:"Magical power", money:"Accumulating money"}},
    { type:'auto', title:'Strategy', name:'strategy', data:{assault:"All-out assault", stealth:"Stealth (where possible)", negotiation:"Negotiation (where possible)", tactical:'Tacital', mind:'Use mind tricks'}, checked:2},
  ],
  okayScript:function(results) {
    for (const key in results) {
      player['quest_' + key] = results[key]
    }
    player.currentQuest.run()
  },
  cancelScript:function(results) {
    msg('She considers starting the "' + player.currentQuest.title + '" quest, but decides she is not quite ready yet.')
  },
}

const questDialog = function(data) {
  player.currentQuest = data
  questWidgets.html = '<h4>' + data.title + '</h4><p>' + data.desc + '</p><p>This is a level ' + data.level + ' quest.</p>'
  io.dialog(questWidgets)
}









