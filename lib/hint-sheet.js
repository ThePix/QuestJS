
log('here')

const hintData = [
  {q:'Stuck in the library?', a:'kill goblin'},
  {q:'Stuck at the dorm courtyard?', a:'pull the torch'},
  {q:'Bothered by the witch?', a:'wear the pearl necklace'},
]


io.showHintSheet = function() { 
  let html = '<div id="main"><div id="inner"><div id="output"><h2 class="default-h default-h2">Hint Sheet</h2>'
  html += "<p class=\"default-p\">To use this hint sheet, start to read through the list of questions to see if there is one dealing with the place where you're stuck in the game. To decode a hint, substitute the numbers in the hint for the numbered words in the 'dictionary' at the bottom of the hint sheet.</p>"

  const words = []
  for (const el of hintData) words.push(...el.a.split(' '))
  const uniqueWords = [...new Set(words)].sort()
    
  for (const el of hintData) {
    html += "<p class=\"default-p\"><i>" + el.q + '</i>&nbsp;&nbsp;&nbsp; ' + io.encodeWords(el.a, uniqueWords) + "</p>"
  }

  html += "<hr/><table><tr>"

  for (let i = 0; i < uniqueWords.length; i++) {
    html += "<td>" + i + " - " + uniqueWords[i] + "</td>"

    if (i % 6 === 5) html += "</tr><tr>"
  }

  html += '</tr><table></div></div></div>'
  io.showInTab(html, 'Hint Sheet')
}

io.encodeWords = function(s, words) {
  const numbers = []
  for (const word of s.split(' ')) numbers.push(words.indexOf(word))
  return numbers.map(el => '' + el).join(' ')
}