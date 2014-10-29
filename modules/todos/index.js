var getView    = require('../../view-getter')
,   request    = require('request')
,   handlebars = require('handlebars')

module.exports = function (server) {
  getView('todos', function (err, viewTxt) {
    if (err){
      console.error('error getting view:', err)
      return false
    }
    init(server, handlebars.compile(viewTxt))
  })
}

function init (server, template) {
  getTodos(server, template)
}

function getTodos (server, template) {
  request(server + '/todos', function (err, res, body) {
    if (err) {
      console.error(err)
      return false
    }
    render(JSON.parse(body), template)
  })
}

function render (data, template) {
  var html = template(data)
  window.document.getElementById('todos').innerHTML = html
}
