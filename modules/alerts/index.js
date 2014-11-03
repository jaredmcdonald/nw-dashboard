var restify = require('restify')
,   _ = require('underscore')
,   getView = require('../../view-getter')
,   $alerts = window.document.getElementById('alerts')
,   eventListenerOn = false
,   dismissClassRegex = /\bdismiss\b/
,   alerts = []

var server = restify.createServer()
server.use(restify.bodyParser({ mapParams: false }))
server.use(restify.queryParser())

function displayAlerts (data, template) {
  $alerts.innerHTML = template(data)
  if (!eventListenerOn) {
    $alerts.addEventListener('click', function (event) {
      if (event.target && dismissClassRegex.test(event.target.classList)) {
        deleteAlert(parseInt(event.target.dataset.id))
        && displayAlerts (alerts, template)
      }
    })
  }
}

function deleteAlert (id) {
  delete alerts[id]

  var hasAlerts = _.some(alerts, function (item) { return !!item })

  if (!hasAlerts) {
    $alerts.innerHTML = ''
  }

  return hasAlerts
}

module.exports = function (host, port, handlebars) {

  getView('alerts', handlebars, function (err, template) {
    if (err) {
      console.error(err)
      return false
    }

    server.listen(port || 8080, host || 'localhost', function () {
      console.log(server.name + ' listening at ' + server.url)
    })

    server.post('/alert', function (req, res, next) {
      if (!req.body || !req.body.title || !req.body.description) {
        res.send(400, { 'status' : 'bad request' })
        return false
      }

      var id = alerts.push(req.body) - 1
      displayAlerts(alerts, template)
      res.send(201, { 'status' : 'created', 'url' : '/alert/' + id })
      next()
    })

    server.get('/alert/:id', function (req, res, next) {
      var all = req.params.id === 'all'

      if (!all) {
          var id = parseInt(req.params.id)
          if (!alerts[id]) {
            res.send(404)
            return false
          }
      }

      res.send(200, all ? alerts : alerts[id])
      next()
    })

    server.del('/alert/:id', function (req, res, next) {
      var id = parseInt(req.params.id)

      if (!alerts[id]) {
        res.send(404)
        return false
      }

      deleteAlert(id) && displayAlerts(alerts, template)
      res.send(204)
      next()
    })

  })

}
