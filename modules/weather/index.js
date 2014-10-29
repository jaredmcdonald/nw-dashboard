var request = require('request')
,   getView = require('../../view-getter')

function handleWeatherResponse (template, body) {
  var data = {
    icon : body.current_observation.icon_url,
    description : body.current_observation.weather,
    city : body.current_observation.display_location.city,
    temperature : body.current_observation.temp_f
  }
  window.document.getElementById('weather').innerHTML = template(data)
}

module.exports = function (key) {
  getView('weather', function (err, template) {
    if (err) {
      console.error(err)
      return false
    }
    request('http://api.wunderground.com/api/' + key + '/conditions/q/autoip.json', function (apiErr, res, body) {
      if (apiErr) {
        console.error(apiErr)
        return false
      }
      handleWeatherResponse(template, JSON.parse(body))
    })
  })
}
