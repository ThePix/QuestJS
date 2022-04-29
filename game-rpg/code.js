"use strict"

tp.addDirective("armour", function(arr, params) {
  return (params[arr[0] ? arr[0] : 'item'].armour / settings.armourScaling).toFixed(1)
})


tp.addDirective("lore", function(arr, params) {
  return player.activeEffects.includes('Lore') ?  arr[1] : arr[0]
})



rpg.signalResponse_destroy = function() {
  this.msg("{nv:item:be:true} dispelled.", {item:this})
  rpg.destroy(this)
}