"use strict";





const board = {}



board.setup = function(settings) {
  this.settings = settings
  
  this.settings.cosAngle = Math.cos(this.settings.angle * Math.PI / 180)
  this.settings.sinAngle = Math.sin(this.settings.angle * Math.PI / 180)
  this.settings.sin2Angle = Math.sin(this.settings.angle * Math.PI / 90)
  this.settings.rootTwo = Math.sqrt(2)
  this.settings.cellPoly = [
    [-this.settings.sinAngle * this.settings.cellSize, 0],
    [0, -this.settings.cosAngle * this.settings.cellSize],
    [this.settings.sinAngle * this.settings.cellSize, 0],
    [0, this.settings.cosAngle * this.settings.cellSize],
  ]  
  
  const newDiv = document.createElement("div")
  newDiv.style.position = 'fixed'
  newDiv.style.bottom = '0px'
  newDiv.style.left = '0px'
  newDiv.style.zIndex = 10
  newDiv.style.width = (this.settings.width + this.settings.offsetX) + 'px'
  newDiv.style.height = this.settings.height + 'px'
  newDiv.innerHTML = 'This will be the board...'
  newDiv.setAttribute("id", "board")
  document.body.insertBefore(newDiv, document.querySelector('#dialog'))
  document.querySelector('#main').style.marginBottom = '420px'
  this.update()
}


board.update = function() {
  this.map = []
  this.labels = []
  
  this.map.push('<defs>')
  this.map.push('<linearGradient id="leftBaseGradient" gradientTransform="rotate(120)"><stop offset="0%"  stop-color="black" /><stop offset="30%" stop-color="white" /></linearGradient>')
  this.map.push('<linearGradient id="rightBaseGradient" gradientTransform="rotate(60)"><stop offset="45%"  stop-color="black" /><stop offset="80%" stop-color="white" /></linearGradient>')
  if (this.settings.defs) this.map.push(this.settings.defs())
  this.map.push('</defs>')
  
  
  if (this.settings.title) this.map.push(board.getTitle())
  
  // 0,0 is at the left, x increases towards the bottom, y to the top
  // 0,size is at the top; size,0 at the bottom; size,size at the right
  // Start at 0,size; then 0,size-1 and 1,size

  for (let i = 0; i < this.settings.size; i++) {
    for (let j = 0; j < i; j++) {
      const x = j
      const y = this.settings.size - i + j
      board.handleCell(x, y)
    }
  }
  for (let i = this.settings.size; i <= (2 * this.settings.size); i++) {
    for (let j = 0; j < (2 * this.settings.size - i); j++) {
      const x = j + i - this.settings.size
      const y = j
      board.handleCell(x, y)
    }
  }

  if (this.settings.baseHeight) this.map.push(board.getBase())
  if (this.settings.compassPane) this.map.push(board.getCompass(this.settings.compass.x, this.settings.compass.y))
  if (this.settings.switches) this.map.push(board.getSwitches())
  if (this.settings.extras) this.map.push(this.settings.extras())
  document.querySelector('#board').innerHTML = '<svg width="' + this.settings.width + '" height="' + this.settings.height + '" viewBox="0 0 ' + this.settings.width + ' ' + this.settings.height + '" xmlns="http://www.w3.org/2000/svg">' + this.map.join() + this.labels.join() + '</svg>'
  return true
}  


board.handleCell = function(x, y) {
  const [x2, y2] = board.getCoord(x, y)
  
  let s = '<polygon points="'
  for (let el of this.settings.cellPoly) {
    s += (x2 + el[0]) + ',' + (y2 + el[1]) + ' '
  }
  s += '" '
  s += board.settings.cellBorder ? board.settings.cellBorder(x, y) : 'stroke="none"'
  s += ' fill="' + this.settings.getColourAt(x, y)
  s += '"/>'
  
  const img = this.settings.getImageAt ? this.settings.getImageAt(x, y) : undefined
  if (img) {
    let s2 = ''
    
/*    s2 += '  <g transform="'
    s2 += ' translate(20, 280)'
    s2 += ' scale(1.2, ' + this.settings.sin2Angle + ')'
    s2 += ' rotate(45, ' + (x2 - this.settings.cellSize / 2) + ', ' + (y2 - this.settings.cellSize / 2 - 100) + ')'
    s2 += '">'
  */  
    s2 += '<image href="' + img + '.png" '
    
    s2 += 'transform="'
    s2 += ' translate(-280, 290)'
    s2 += ' scale(1.4, ' + this.settings.sin2Angle + ')'
    s2 += ' rotate(45, ' + (x2 - this.settings.cellSize / 2) + ', ' + (y2 - this.settings.cellSize / 2 - 100) + ')'
    s2 += '" '
    
    s2 += 'x="' + (x2 - this.settings.cellSize / 2) + '" y="' + (y2 - this.settings.cellSize / 2 - 100) + '" '
    s2 += 'height="' + this.settings.cellSize + '" width="' + this.settings.cellSize + '" />'
    s2 += '</g>'
    log(s2)
    s += s2
  }
  
  if (typeof this.settings.getLeftBorder === 'function') {
    const leftBorder = this.settings.getLeftBorder(x, y)
    if (leftBorder) {
      s += '<line x1="' + (x2 + this.settings.cellPoly[0][0]) + '" y1="' + (y2 + this.settings.cellPoly[0][1]) + '" '
      s += 'x2="' + (x2 + this.settings.cellPoly[3][0]) + '" y2="' + (y2 + this.settings.cellPoly[3][1]) + '" ' + leftBorder + '/>'
    }
    const rightBorder = this.settings.getRightBorder(x, y)
    if (rightBorder) {
      s += '<line x1="' + (x2 + this.settings.cellPoly[2][0]) + '" y1="' + (y2 + this.settings.cellPoly[2][1]) + '" '
      s += 'x2="' + (x2 + this.settings.cellPoly[3][0]) + '" y2="' + (y2 + this.settings.cellPoly[3][1]) + '" ' + rightBorder + '/>'
    }
  }
  
  for (let el of this.settings.getFeaturesAt(x, y)) {
    const feature = this.settings.features[el]
    if (feature === undefined) {
      console.log('WARNING: Failed to find a feature called "' + el + '" when drawing board')
      continue
    }
    if (feature.script) {
      if (feature.layer) {
        this[feature.layer].push(feature.script(x2, y2, x, y))
      }
      else {
        s += feature.script(x2, y2, x, y)
      }
    }
    else if (feature.text) {
      const s = '<text x="' + x2 + '" y="' + (y2+(feature.y ? feature.y : 0)) + '" style="text-anchor:middle;'
      if (feature.style) s += feature.style
      s += '" '
      if (feature.colour) s+= 'fill="' + feature.colour + '"'      
      s += '>' + feature.text + '</text>'
      this.labels.push(s)
    }
    else if (feature.file) {
      let x3 = x2-feature.width/2
      if (feature.x) x3 += feature.x
      let y3 = y2-feature.height
      if (feature.y) y3 += feature.y
      s += '<image href="' + settings.imagesFolder + feature.file + '" '
      s += 'width="' + feature.width + '" height="' + feature.height + '" '
      s += 'x="' + x3 + '" y="' + y3 + '"/>'
    }
    else if (feature.flatFile) {
      let x3 = x2-feature.width/2 + 18
      let y3 = y2-feature.height + 30.5 - 0.26 * this.settings.cellSize
      s += '<image href="' + settings.imagesFolder + feature.flatFile + '" '
      s += 'width="' + Math.round(this.settings.cellSize * this.settings.rootTwo) + '"'
      s += ' x="' + x3 + '" y="' + y3 + '" transform-origin="'
      s += x3 + 'px ' + y3 + 'px" transform="scale(1, '
      s += (this.settings.cosAngle/this.settings.sinAngle) + ') rotate(45)"/>'
    }
  }
  this.map.push(s)
}


board.getTitle = function() {
  const x = this.settings.titleX || 10
  const y = this.settings.titleY || (this.settings.height / 4)
  let s = '<text x="' + x + '" y="' + y
  if (this.settings.titleStyle) s += '" style="' + this.settings.titleStyle
  s += '">' + this.settings.title + '</text>'
  return s
}

board.getCompass = function(x, y) {
  let s = '<image href="' + settings.imagesFolder + 'compass45.png" width="160" height="159" x="' 
  s += x + '" y="' + y
  s += '" transform="scale(1, ' + (this.settings.cosAngle/this.settings.sinAngle) + ')" transform-origin="'
  s += x + 'px ' + y + 'px"/>'
  return s
}

board.getSwitches = function() {
  const x = this.settings.switchesPos.x || 800
  const y = this.settings.switchesPos.y || 100
  let s = ''
  if (this.settings.switchesWidth) {
    s += '<rect x="' + x + '" y="' + y + '" width="' + this.settings.switchesWidth + '" height="'
    s += (this.settings.switches.length * 18 + 14) + '" fill="#eee" stroke="black"/>'
  }
  let offset = 0
  for (let el of this.settings.switches) {
    s += '<circle cx="' + (x + 14) + '" cy="' + (y + 15 + offset) + '" r="8" fill="'
    s += (this.settings[el.att] ? el.on : el.off) + '" stroke="black" onclick="'
    s += el.customFunction ? el.customFunction : 'board.toggle(\'' + el.att + '\')'
    s += '"/>'
    s += '<text x="' + (x + 26) + '" y="' + (y + 20 + offset) + '" fill="black">' + el.text + '</text>'
    offset += 20
  }
  return s
}

board.getBase = function() {
  let s = '<polygon points="'
  s += (this.settings.offsetX + this.settings.cellPoly[0][0]) + ','
  s += (this.settings.height / 2 + this.settings.offsetY) + ' '
  
  s += (this.settings.offsetX + this.settings.sinAngle * this.settings.size * this.settings.cellSize + this.settings.cellPoly[0][0]) + ','
  s += (this.settings.height / 2 + this.settings.offsetY + this.settings.cosAngle * this.settings.size * this.settings.cellSize) + ' '
  
  s += (this.settings.offsetX + this.settings.sinAngle * this.settings.size * this.settings.cellSize + this.settings.cellPoly[0][0]) + ',' 
  s += (this.settings.height / 2 + this.settings.offsetY + this.settings.cosAngle * this.settings.size * this.settings.cellSize + this.settings.baseHeight) + ' '
  
  s += (this.settings.offsetX + this.settings.cellPoly[0][0]) + ','
  s += (this.settings.height / 2 + this.settings.offsetY + this.settings.baseHeight) + ' '
  s += '" stroke="none" fill="url(\'#leftBaseGradient\')"/>'
  
  
  s += '<polygon points="'
  s += (this.settings.offsetX + this.settings.sinAngle * this.settings.size * this.settings.cellSize * 2 + this.settings.cellPoly[0][0]) + ',' 
  s += (this.settings.height / 2 + this.settings.offsetY) + ' '
  
  s += (this.settings.offsetX + this.settings.sinAngle * this.settings.size * this.settings.cellSize + this.settings.cellPoly[0][0]) + ',' 
  s += (this.settings.height / 2 + this.settings.offsetY + this.settings.cosAngle * this.settings.size * this.settings.cellSize) + ' '
  
  s += (this.settings.offsetX + this.settings.sinAngle * this.settings.size * this.settings.cellSize + this.settings.cellPoly[0][0]) + ','
  s += (this.settings.height / 2 + this.settings.offsetY + this.settings.cosAngle * this.settings.size * this.settings.cellSize + this.settings.baseHeight) + ' '
  
  s += (this.settings.offsetX + this.settings.sinAngle * this.settings.size * this.settings.cellSize * 2 + this.settings.cellPoly[0][0]) + ','
  s += (this.settings.height / 2 + this.settings.offsetY + this.settings.baseHeight) + ' '
  s += '" stroke="none" fill="url(\'#rightBaseGradient\')"/>'

  return s
}


board.getCoord = function(x, y) {
  const x2 = this.settings.cellSize * (x + y) * this.settings.sinAngle + this.settings.offsetX
  const y2 = this.settings.height / 2 + this.settings.cellSize * (x - y) * this.settings.cosAngle + this.settings.offsetY
  return [x2, y2]
}


board.toggle = function(att) {
  board.settings[att] = !board.settings[att]
  board.update()
}
