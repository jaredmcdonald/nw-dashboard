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
var weather = require('./modules/weather')
,   clock   = require('./modules/clock')
,   todos   = require('./modules/todos')

// export app
module.exports = {
  init : function () {
    weather(nconf.get('WUNDERGROUND_API_KEY'), handlebars)
    todos(nconf.get('TODO_SERVER_URL'), handlebars)
    clock()
  }
}
