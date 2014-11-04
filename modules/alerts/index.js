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

function generateUUID () {
  return Date.now().toString(16) // for now
}

function displayAlerts (data, template) {
  $alerts.innerHTML = template(data)
  if (!eventListenerOn) {
    $alerts.addEventListener('click', function (event) {
      if (event.target && dismissClassRegex.test(event.target.classList)) {
        deleteAlert(event.target.dataset.id)
        displayAlerts (alerts, template)
      }
    })
  }
}

function deleteAlert (id) {
  var beforeLength = alerts.length
  alerts = _.filter(alerts, function (item) {
    return item.id !== id
  })
  return alerts.length !== beforeLength // true if successful
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

      var id = generateUUID()
      alerts.push(_.extend(req.body, { id : id }))
      displayAlerts(alerts, template)

      res.send(201, { 'status' : 'created', 'url' : '/alert/' + id })
      next()
    })

    server.get('/alert/:id', function (req, res, next) {
      var all = req.params.id === 'all'

      if (!all) {
          var id = req.params.id
          ,   alert = _.find(alerts, { id : id })

          if (!alert) {
            res.send(404)
            return false
          }
      }

      res.send(200, all ? alerts : alert)
      next()
    })

    server.del('/alert/:id', function (req, res, next) {
      var id = req.params.id

      if (!deleteAlert(id)) {
        res.send(404)
        return false
      }

      displayAlerts(alerts, template)

      res.send(204)
      next()
    })

  })

}
