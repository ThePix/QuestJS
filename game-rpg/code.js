"use strict"




console.log(util.getDateTime())
game.elapsedTime = 60
console.log(util.getDateTime())
game.elapsedTime = 59*60
console.log(util.getDateTime())
game.elapsedTime = 60*60
console.log(util.getDateTime())
game.elapsedTime = 61*60
console.log(util.getDateTime())
game.elapsedTime = (60*60-1)*60
console.log(util.getDateTime())
game.elapsedTime = (60*60)*60
console.log(util.getDateTime())
game.elapsedTime = (60*60+1)*60
console.log(util.getDateTime())
game.elapsedTime = 1000000
console.log(util.getDateTime())
game.elapsedTime = 10000000
console.log(util.getDateTime())
game.elapsedTime = 100000000
console.log('----------')
console.log(util.getDateTime())
console.log(util.getDateTime({format:'time'}))
console.log(util.getDateTime({is:10000000}))
console.log(util.getDateTime({add:10000000}))
console.log(util.getDateTime({is:10000000, add:10000000}))
console.log(processText('It is {dateTime}.'))
console.log(processText('It is {dateTime:time}.'))
console.log(processText('It is {dateTime::10000000}.'))
console.log(processText('It is {dateTime:::10000000}.'))