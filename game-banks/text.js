"use strict"

tp.addDirective("stasis_pod_status", function(arr, params) {
  return w.stasis_bay.tpStatus()
})

tp.addDirective("status", function(arr, params) {
  if (typeof params.actor.status === "string") {
    return params.actor.status === 'stasis' ? 'In stasis' : 'Deceased'
  }
  else {
    return settings.intervalDescs[util.getByInterval(settings.intervals, params.actor.status)]
  }
})

tp.addDirective("table_desc", function(arr, params) {
  return w.canteen_table.tpDesc()
})


