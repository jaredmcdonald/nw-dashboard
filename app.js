var nconf = require('nconf')
,   handlebars = require('handlebars')
,   gui = window.nwDispatcher.requireNwGui()

// config
nconf.argv()
     .env()
     .file({ file: './config.json' })

// menu bar
require('./menu')(gui)

// modules
var weather  = require('./modules/weather')
,   forecast = require('./modules/forecast')
,   clock    = require('./modules/clock')
,   todos    = require('./modules/todos')

// export app
module.exports = {
  init : function () {
    var weatherKey = nconf.get('WUNDERGROUND_API_KEY')
    
    weather(weatherKey, handlebars)
    forecast(weatherKey, handlebars)
    todos(nconf.get('TODO_SERVER_URL'), handlebars)
    clock()
  }
}
