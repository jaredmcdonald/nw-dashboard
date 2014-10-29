var request = require('request')
,   getView = require('../../view-getter')
,   pollFrequency = 60 * 5 * 1000 // 5 mins
,   intervalKey = null

function handleWeatherResponse (template, body) {
  var data = {
    icon : body.current_observation.icon_url,
    description : body.current_observation.weather,
    city : body.current_observation.display_location.city,
    temperature : body.current_observation.temp_f
  }
  window.document.getElementById('weather').innerHTML = template(data)
}

function getWeather (key, template) {
  request('http://api.wunderground.com/api/' + key + '/conditions/q/autoip.json', function (err, res, body) {
    if (err) {
      console.error(err)
      return false
    }
    handleWeatherResponse(template, JSON.parse(body))
  })
}


module.exports = function (key) {
  getView('weather', function (err, template) {
    if (err) {
      console.error(err)
      return false
    }
    getWeather(key, template)
    intervalKey = setInterval(getWeather, pollFrequency, key, template)
  })

  return {
    stop : function () {
      clearInterval(intervalKey)
    }
  }
}
