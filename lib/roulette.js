
"use strict"


/*
See:
https://github.com/ThePix/QuestJS/wiki/Roulette!
*/



const roulette = {
  cells:[],
  value:0,
  columnCount:settings.rouletteColumns || 2,
  rowCount:settings.rouletteRows || 10,
  rollInterval:40,
  drawInterval:50,
}

settings.roulette = {}


roulette.defaultStyle = {
  position:'fixed',
  display:'block',
  right:'10px',
  top:'200px',
  width:'90px',
  height:'450px',
  'background-color':'#ddd',
  border:'3px black solid',
  display:'grid',
  'grid-template-columns':'1fr 1fr',
  'grid-template-rows':'1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
  'row-gap':'0px',
  'column-gap':'5px',
  'padding':'3px',
  'padding-top':'5px',
}

io.modulesToInit.push(roulette)

roulette.init = function() {
  document.body.insertAdjacentHTML("beforeend", '<div id="roulette"></div>')
  roulette.div = document.querySelector('#roulette')
  roulette.size = roulette.columnCount * roulette.rowCount

  Object.assign(roulette.div.style, roulette.defaultStyle, settings.rouletteStyle)
 
  /*
  // Set the default values for settings
  for (let key in roulette.defaults) {
    if (!settings[key]) settings[key] = roulette.defaults[key]
  }*/
}

roulette.hide = function() { roulette.div.style.display = 'none' }
roulette.show = function() { roulette.div.style.display = 'grid' }

roulette.getCell = function(n) {
  return this.cells[n]
}





roulette.setCell = function(n, cell) {
  cell.div.style.gridColumn = (n+1) % roulette.columnCount
  cell.div.style.gridRow = roulette.rowCount - Math.floor(n / roulette.columnCount)
  this.cells[n] = cell
}


roulette.redraw = function() {
  while (roulette.div.firstChild) roulette.div.firstChild.remove()
 
  for (const cell of roulette.cells) roulette.div.append(cell.div)
}

roulette.redrawSequence = function() {
  while (roulette.div.firstChild) roulette.div.firstChild.remove()

  if (roulette.interval) return errormsg("Trying to start a roulette sequence when one is already running.")
  roulette.intervalProgress = 0
  roulette.interval = setInterval(roulette.redrawing, roulette.drawInterval)
}


roulette.redrawing = function() {
  if (roulette.cells[roulette.intervalProgress]) {
    roulette.div.append(roulette.cells[roulette.intervalProgress].div)
  }
  roulette.intervalProgress++
  if (roulette.intervalProgress >= roulette.size) {
    clearInterval(roulette.interval)
    delete roulette.interval
  }
}



roulette.roll = function() {
  if (roulette.interval) return errormsg("Trying to start a roulette sequence when one is already running.")
  roulette.intervalProgress = roulette.size + random.int(0, roulette.size - 1)
  roulette.counter = 0
  roulette.interval = setInterval(roulette.rolling, roulette.rollInterval)
}

roulette.rolling = function() {
  roulette.counter++
  const pow = Math.max(1, 5 - roulette.intervalProgress.toString(2).length)
  const limit = 2 ** pow

  if (roulette.counter < limit) return
  roulette.counter = 0
  roulette.intervalProgress--

  roulette.cells[roulette.value].setAlive()
  roulette.value++
  if (roulette.value === roulette.size) roulette.value = 0
  roulette.cells[roulette.value].setHighlight()

  if (roulette.intervalProgress <= 0) {
    clearInterval(roulette.interval)
    delete roulette.interval
    setTimeout(function() {
      if (roulette.afterRoll) roulette.afterRoll(roulette.value)
      if (roulette.cells[roulette.value].afterRoll) roulette.cells[roulette.value].afterRoll(roulette.value)
    }, 1000)
  }
}




class Cell {
  constructor(c, s) {
    this.colour = c
    this.div = document.createElement('div')
    this.div.style.backgroundColor = this.colour
    this.div.style.width = "40px"
    this.div.style.height = "40px"
    this.div.style.display = "inline"
    this.div.style.border = "white 1px solid"
    if (s) this.div.innerHTML = s
  }
 
  setAlive() { this.div.style.backgroundColor = this.colour }
  setHighlight() { this.div.style.backgroundColor = 'white' }
 
}




