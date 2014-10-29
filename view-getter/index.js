var fs = require('fs')
,   path = require('path')
,   viewDir = path.join(__dirname, '../views')
,   extRegex = /\.hbs$/

module.exports = function getView (viewName, handlebars, callback) {
  if (!extRegex.test(viewName)) {
    viewName += '.hbs'
  }

  fs.readFile(path.join(viewDir, viewName), function (err, data) {
    callback(err, handlebars.compile(data.toString()))
  })
}
