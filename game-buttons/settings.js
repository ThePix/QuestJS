"use strict"

settings.title = "Buttons, buttons, buttons"
settings.author = "The Pixie"
settings.version = "0.1"
settings.thanks = []
settings.warnings = "No warnings have been set for this game."
settings.playMode = "dev"

settings.noTalkTo = false
settings.styleFile = 'style'



settings.roomCreateFunc = function(o) {
  if (o.dests) {
    for (const ex of o.dests) {
      ex.origin = o
      ex.dir = 'to ' + (o.dirAlias ? o.dirAlias : o.alias)
    }
  }
}

settings.afterEnter = function() {
  if (player.onPhoneTo && w[player.onPhoneTo].loc === player.loc) {
    w.phone.hangUp()
  }
}



// For items
settings.inventoryPane = [
  {name:'You are holding...', alt:'itemsHeld', test:settings.isHeldNotWorn, getLoc:function() { return player.name; }, noContent:'Nothing' },
  {name:'You are wearing...', alt:'itemsWorn', test:settings.isWorn, getLoc:function() { return player.name; }, noContent:'Nothing' },
  {name:'You can see...', alt:'itemsHere', test:settings.isHere, getLoc:function() { return player.loc; }, noContent:'Nothing' },
  {name:'You are on the phone to', alt:'onPhoneTo', test:function(item) { return item.name === player.onPhoneTo  }, noContent:'No one'  }
]





// For directions
settings.compassPane = false
settings.setup = function() {
  createAdditionalPane(0, "Go to", 'directions', function() {
    const exitList = currentLocation.getExits({excludeLocked:true})
    let s = '<p class="item-class"><span class="item-name">You can go:</span>'
    for (let ex of exitList) {
      s += ' <span class="item-action-button" onclick="io.clickExit(\'' + ex.dir + '\')">'
      s += ex.dir
      s += '</span>'
    }
    s += '</p>'
    return s    
  })
  settings.updateCustomUI()
}


settings.updateCustomUI = function() {
  // For items
  for (const el of document.querySelectorAll('.item-action')) {
    el.style.display = 'block'
    log(el.innerHTML)
  }

  //el.previousSibling.innerHTML = currentLocation.headingAlias
}




