
const weather = {
  update:function() {
    // every turn...
    if (player.currentWeatherDisabled) return
    if (player.currentWeatherName) {
      // weather is set, run its turn() function
      weatherTypes[player.currentWeatherName].turn()
    }
    else {
      // weather is NOT set, initialise with the first one in the list
      weatherTypes[Object.keys(weatherTypes)[0]].init()
    }  
  }
}
io.modulesToUpdate.push(weather)

const weatherTypes = {}

class Weather {
  constructor(name, data) {
    this.name = name
    for (const key in data) this[key] = data[key]
    if (weatherTypes[name]) return errormsg("Two weather types called \"" + name + "\".")
    weatherTypes[name] = this
  }
  
  turn() {
    player.currentWeatherCount++
    //log(player.currentWeatherCount)
    if (this.wetness) {
      if (!player.currentWeatherWetness) player.currentWeatherWetness = 0
      player.currentWeatherWetness += this.wetness
      if (this.wetness > 100) this.wetness = 100
      if (this.wetness < 0) this.wetness = 0
      if (this.wetness > 80) this.wetness--
      if (this.wetness > 60) this.wetness--
    }
    if (player.currentWeatherCount >= player.currentWeatherTotal) {
      //log('here')
      const currentName = this.getNext()
      weatherTypes[currentName].init(this.name)
    }
    else {
      if (this.ongoing) this.ongoing()
    }
  }
  
  init(previousName) {
    if (!previousName) previousName = this.name
    player.currentWeatherName = this.name
    player.currentWeatherCount = 0
    player.currentWeatherTotal = this.getNumberOfTurns()
    if (this.start) this.start(this.previousName)
  }
  
  outside(includeVisible) {
    if (settings.weatherReportsAssumeYes && currentLocation.noWeather) return false
    if (!settings.weatherReportsAssumeYes && !currentLocation.yesWeather) return false
    if (includeVisible) return true
    return !currentLocation.weatherModifier
  }
  
  report(s, options) {
    if (!this.outside(true)) return false
    if (currentLocation.weatherModifier) s = currentLocation.weatherModifier.replace('#', s)
    msg(s, options)
    return true
  }
  
  getCloudCover() { return 100 }
}

