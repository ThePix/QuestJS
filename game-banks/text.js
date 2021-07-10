"use strict"

tp.addDirective("stasis_pod_status", function(arr, params) {
  return w.stasis_bay.tpStatus()
})

tp.addDirective("status", function(arr, params) {
  if (typeof params.char.status === "string") {
    return params.char.status === 'stasis' ? 'In stasis' : 'Deceased'
  }
  else {
    return settings.intervalDescs[util.getByInterval(settings.intervals, params.char.status)]
  }
})

tp.addDirective("table_desc", function(arr, params) {
  return w.canteen_table.tpDesc()
})


tp.addDirective("planet", function(arr, params) {
  return PLANETS[w.Xsansi.currentPlanet].starName + PLANETS[w.Xsansi.currentPlanet].planet
})

tp.addDirective("star", function(arr, params) {
  return PLANETS[w.Xsansi.currentPlanet].starName
})

