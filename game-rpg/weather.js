// weather

/*


precipitation - rain/snow/sleet
wind
thunder/lightning
cloud
fog


weather
name
getNumberOfTurns
getNextWeather
getDescription





currentWeatherName
currentWeatherCount
currentWeatherTotal

  ___   _   _   ____     ___   _____        _______     ___
 / _ \ | | | | |  __|  / ___| |_   _|      |__   __|  / ___|
| | | || | | | | |_   | |__     | |           | |    | |__
| | | || | | | |  _|   \__ \    | |           | |     \__ \
| | | || |_| | | |__   ___| |   | |         __| |     ___| |
 \__/\_\\___/  |____| |____/    |_|        |___/     |____/
*/





new Weather("hot", {
  getNumberOfTurns:function() { return 3 },
  getNext:function() { return random.fromArray(['hot', 'cloudingOver', 'stormPrelude']) },
  getDescription:function() { return "It is hot!" },
  getCloudCover:function() { return 0 },
  wetness:-1,
})
new Weather("cloudingOver", {
  getNumberOfTurns:function() { return 3 },
  getNext:function() { return random.fromArray(['rain', 'clearing', 'drizzle', 'cloudy']) },
  getDescription:function() { return "It is getting cloudy." },
  getCloudCover:function() { return Math.round(player.currentWeatherCount / player.currentWeatherTotal * 100) },
  start:function() { this.report("It is starting to get cloudy.") },
})
new Weather("rain", {
  getNumberOfTurns:function() { return 3 },
  getNext:function() { return random.fromArray(['rain', 'clearing', 'cloudy']) },
  getDescription:function() { return "It is raining." },
  start:function() { this.report("It is starting to rain.") },
  wetness:2,
})
new Weather("cloudy", {
  getNumberOfTurns:function() { return 3 },
  getNext:function() { return random.fromArray(['rain', 'clearing', 'cloudy']) },
  getDescription:function() { return "It is raining." },
  start:function() { this.report("It is starting to rain.") },
  wetness:2,
})
new Weather("drizzle", {
  getNumberOfTurns:function() { return 3 },
  getNext:function() { return random.fromArray(['rain', 'clearing', 'drizzle', 'cloudy']) },
  getDescription:function() { return "There is a very light fall of rain; nt much more than mist really." },
  start:function() { this.report("It is starting to drizzle.") },
  wetness:1,
})
new Weather("clearing", {
  getNumberOfTurns:function() { return 3 },
  getNext:function() { return random.fromArray(['hot', 'cloudingOver']) },
  getDescription:function() { return "The sky is clearing." },
  getCloudCover:function() { return 100 - Math.round(player.currentWeatherCount / player.currentWeatherTotal * 100) },
  start:function(previous) { if (previous === "rain") this.report("The rain stops.") },
})
new Weather("clearingToHot", {
  getNumberOfTurns:function() { return 3 },
  getNext:function() { return 'hot' },
  getDescription:function() { return "The sky is clearing." },
  start:function(previous) { this.report(previous === "rain" ? "The rain stops, and the clouds are clearing." : "The clouds are clearing, it is going to get warm.") },
})
new Weather("stormPrelude", {
  getNumberOfTurns:function() { return 3 },
  getNext:function() { return random.fromArray(['storm']) },
  getDescription:function() { return "It is getting cloudy, and the wind is picking up. A storm is coming." },
  start:function() { this.report("It is starting to get cloudy.") },
})
new Weather("storm", {
  getNumberOfTurns:function() { return 3 },
  getNext:function() { return random.fromArray(['rain', 'clearing']) },
  getDescription:function() { return "It is raining hard; the wind is howling." },
  start:function() { this.report("Suddenly the heavens open, and the rain is coming down hard.") },
  ongoing:function() { if (random.chance(10)) this.report("A flash of lightning illuminates the landscape, and a moment later you hear the crack of thunder.") },
  wetness:4,
})

