var request = require('request')

function handleWeatherResponse (err, res, body) {
  if (err) {
    console.error(err)
    return false
  }

  var parsed = JSON.parse(body)
  ,   iconUrl = parsed.current_observation.icon_url
  ,   weatherText = parsed.current_observation.weather
  ,   cityText = parsed.current_observation.display_location.city
  ,   doc = window.document

  doc.getElementById('weatherIcon').setAttribute('src', iconUrl)
  doc.getElementById('weatherDescription').innerHTML = weatherText
  doc.getElementById('weatherHeadline').innerHTML = 'Weather for ' + cityText
}

module.exports = function (key) {
  request('http://api.wunderground.com/api/' + key + '/conditions/q/autoip.json', handleWeatherResponse)
}
