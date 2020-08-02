"use strict";





const board = {}



board.setup = function(settings) {
  this.settings = settings
  
  this.settings.cosAngle = Math.cos(this.settings.angle * Math.PI / 180)
  this.settings.sinAngle = Math.sin(this.settings.angle * Math.PI / 180)
  this.settings.rootTwo = Math.sqrt(2)
  this.settings.cellPoly = [
    [-this.settings.sinAngle * this.settings.cellSize, 0],
    [0, -this.settings.cosAngle * this.settings.cellSize],
    [this.settings.sinAngle * this.settings.cellSize, 0],
    [0, this.settings.cosAngle * this.settings.cellSize],
  ]  
  
  $('<div id="map" style="position: fixed;bottom: 0px; left: 200px;width:1200px;height:400px;">This will be the board...</div>').insertAfter('#dialog')
  $('#main').css('margin-bottom',"420px");
  this.update()
}


board.update = function() {
  const map = []
  
  map.push('<defs>')
  map.push('<linearGradient id="leftBaseGradient" gradientTransform="rotate(120)"><stop offset="0%"  stop-color="black" /><stop offset="30%" stop-color="white" /></linearGradient>')
  map.push('<linearGradient id="rightBaseGradient" gradientTransform="rotate(60)"><stop offset="45%"  stop-color="black" /><stop offset="80%" stop-color="white" /></linearGradient>')
  map.push('</defs>')
  
  
  if (this.settings.title) map.push(board.getTitle())
  
  // 0,0 is at the left, x increases towards the bottom, y to the top
  // 0,size is at the top; size,0 at the bottom; size,size at the right
  // Start at 0,size; then 0,size-1 and 1,size

  for (let i = 0; i < this.settings.size; i++) {
    for (let j = 0; j < i; j++) {
      const x = j
      const y = this.settings.size - i + j
      //map.push(getCell(i, j, 'rgb(0,' + ((x + count) * 10 % 256) + ',' + ((y + count) * 10 % 256) + ')'))
      map.push(board.getCell(x, y))
    }
  }
  for (let i = this.settings.size; i <= (2 * this.settings.size); i++) {
    for (let j = 0; j < (2 * this.settings.size - i); j++) {
      const x = j + i - this.settings.size
      const y = j
      map.push(board.getCell(x, y))
    }
  }

  if (this.settings.baseHeight) map.push(board.getBase())
  if (this.settings.compass) map.push(board.getCompass())
  $('#map').html('<svg width="1200" height="400" viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg">' + map.join() + '</svg>')
  return true
}  


board.getCell = function(x, y) {
  const [x2, y2] = board.getCoord(x, y)
  
  //console.log(Math.round((x + y) * sinAngle * 10) + ',' + Math.round((x - y) * cosAngle * 10))
  //console.log(Math.round(x2) + ',' + Math.round(y2))

  let s = '<polygon points="'
  for (let el of this.settings.cellPoly) {
    s += (x2 + el[0]) + ',' + (y2 + el[1]) + ' '
  }
  s += '" stroke="none" fill="' + this.settings.getColourAt(x, y) + '"/>'
  
  for (let feature of this.settings.getFeaturesAt(x, y)) {
    if (feature.script) {
      s += feature.script(x2, y2, x, y)
    }
    else if (feature.text) {
      s += '<text x="' + x2 + '" y="' + (y2+(feature.y ? feature.y : 0)) + '" style="text-anchor:middle;'
      if (feature.style) s += feature.style
      s += '" '
      if (feature.colour) s+= 'fill="' + feature.colour + '"'      
      s += '>' + feature.text + '</text>'
    }
    else if (feature.file) {
      let x3 = x2-feature.width/2
      if (feature.x) x3 += feature.x
      let y3 = y2-feature.height
      if (feature.y) y3 += feature.y
      s += '<image href="images/' + feature.file + '" '
      s += 'width="' + feature.width + '" height="' + feature.height + '" '
      s += 'x="' + x3 + '" y="' + y3 + '"/>'
    }
    else if (feature.flatFile) {
      let x3 = x2-feature.width/2 + 18
      let y3 = y2-feature.height + 30.5 - 0.26 * this.settings.cellSize
      s += '<image href="images/' + feature.flatFile + '" '
      s += 'width="' + Math.round(this.settings.cellSize * this.settings.rootTwo) + '"'// height="' + this.settings.cellSize + '" '
      s += ' x="' + x3 + '" y="' + y3 + '" transform-origin="'
      s += x3 + 'px ' + y3 + 'px" transform="scale(1, '
      s += (this.settings.cosAngle/this.settings.sinAngle) + ') rotate(45)"/>'
//      s += (this.settings.cosAngle/this.settings.sinAngle) + ')"/>'
    }
  }
//console.log(s)
  return s
}


board.getTitle = function() {
  const x = this.settings.titleX || 10
  const y = this.settings.titleY || (this.settings.height / 4)
  let s = '<text x="' + x + '" y="' + y
  if (this.settings.titleStyle) s += '" style="' + this.settings.titleStyle
  s += '">' + this.settings.title + '</text>'
  return s
}

board.getCompass = function() {
  const x = this.settings.width * 4 / 5
  const y = this.settings.height * 4 / 5
  let s = '<image href="images/compass45.png" width="160" height="159" x="' 
  s += x + '" y="' + y
  s += '" transform="scale(1, ' + (this.settings.cosAngle/this.settings.sinAngle) + ')" transform-origin="'
  s += x + 'px ' + y + 'px"/>'
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