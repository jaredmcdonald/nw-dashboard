var request = require('request')
,   getView = require('../../view-getter')

module.exports = function (key, handlebars) {
  getView('forecast', handlebars, function (err, template) {
    if (err) {
      console.error('error getting forecast view', err)
      return false
    }
    getForecast(key, template)
  })
}

function getForecast (key, template) {
  request('http://api.wunderground.com/api/' + key + '/forecast/q/autoip.json', function (err, res, body) {
    if (err) {
      console.error(err)
      return false
    }
    handleForecastResponse(template, JSON.parse(body))
  })
}

function handleForecastResponse (template, data) {
  var forecast = data.forecast.simpleforecast.forecastday
  forecast.shift() // don't need today
  window.document.getElementById('forecast').innerHTML = template(forecast)
}