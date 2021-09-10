"use strict"

tp.addDirective("armour", function(arr, params) {
  return (params[arr[0] ? arr[0] : 'item'].armour / settings.armourScaling).toFixed(1)
})


tp.addDirective("lore", function(arr, params) {
  return player.activeEffects.includes('Lore') ?  arr[1] : arr[0]
})



lang.defaultEffectExpires = "The {i:{show:effect:alias}} effect on {nm:target:the} expires."
lang.communeWithAnimalSpell = 'Commune with animal'
lang.cannotTalkToBeast = "You spend a few minutes telling {nm:item:the} about your life, but it does not seem interested. Possibly because it is just a dumb beast."

