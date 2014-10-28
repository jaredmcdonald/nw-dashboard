var nconf   = require('nconf')
,   request = require('request')

// config
nconf.argv()
     .env()
     .file({ file: './config.json' })

// weather
var weather = function () {
  request('http://api.wunderground.com/api/' +
           nconf.get('WUNDERGROUND_API_KEY') +
          '/conditions/q/autoip.json',
    handleWeatherResponse)
}

var handleWeatherResponse = function (err, res, body) {
  if (err) {
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

// clock
var clock = function () {
  setClock()
  setInterval(setClock, 200) // whatever
}

var setClock = function () {
  window.document.getElementById('clock').innerHTML = new Date().toLocaleTimeString()
}

// export the app
module.exports = {
  init : function () {
    weather()
    clock()
  }
}
