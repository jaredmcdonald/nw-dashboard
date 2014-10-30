var request = require('request')
,   moment = require('moment')
,   getView = require('../../view-getter')
,   pollFrequency = moment.duration(5, 'minutes')
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

module.exports = function (key, handlebars) {
  getView('weather', handlebars, function (err, template) {
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
