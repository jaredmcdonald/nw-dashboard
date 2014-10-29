var getView    = require('../../view-getter')
,   request    = require('request')

module.exports = function (server) {
  getView('todos', function (err, template) {
    if (err){
      console.error('error getting view:', err)
      return false
    }
    init(server, template)
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
