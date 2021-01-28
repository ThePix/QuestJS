"use strict"

tp.addDirective("armour", function(arr, params) {
  return (params[arr[0] ? arr[0] : 'item'].armour / settings.armourScaling).toFixed(1)
})