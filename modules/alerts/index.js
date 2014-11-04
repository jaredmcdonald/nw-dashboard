var restify = require('restify')
,   _ = require('underscore')
,   getView = require('../../view-getter')
,   $alerts = window.document.getElementById('alerts')
,   dismissClassRegex = /\bdismiss\b/
,   alerts = []

// get an ID for alerts
// (just a timestamp for now)
function generateID () {
  return Date.now().toString(16)
}

// render and insert HTML into DOM
function render (template) {
  $alerts.innerHTML = template(alerts)
}

// removes alert with specified id
// returns true if successful, false otherwise
// (i.e., alert with that id wasn't found)
function deleteAlert (id) {
  var beforeLength = alerts.length
  alerts = _.filter(alerts, function (item) {
    return item.id !== id
  })
  return alerts.length !== beforeLength
}

// add event listener to 'dismiss' links
function addEvents (template) {
  $alerts.addEventListener('click', function (event) {
    if (event.target && dismissClassRegex.test(event.target.classList)) {
      deleteAlert(event.target.dataset.id)
      render(template)
    }
  })
}

function init (template, host, port) {
  // set up server and routes
  var server = restify.createServer()
  server.use(restify.bodyParser({ mapParams: false }))
  server.use(restify.queryParser())

  server.listen(port || 8080, host || 'localhost', function () {
    console.log(server.name + ' listening at ' + server.url)
  })

  server.post('/alert', function (req, res, next) {
    if (!req.body || !req.body.title || !req.body.description) {
      res.send(400, { 'status' : 'bad request' })
      return false
    }

    var id = generateID()
    // only allow 'title' and 'description'
    ,   data = {
          title : req.body.title,
          description : req.body.description
        }

    alerts.push(_.extend(data, { id : id }))
    render(template)

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

  server.patch('/alert/:id', function (req, res, next) {
    var id = req.params.id
    ,   alert = _.find(alerts, function (item) {
          return item.id === id
        })

    if (!alert) {
      res.send(404)
      return false
    }

    Object.keys(req.body).forEach(function (key) {
      if (key === 'title' || key === 'description') {
        alert[key] = req.body[key]
      }
    })

    render(template)

    res.send(204)
    next()
  })

  server.del('/alert/:id', function (req, res, next) {
    var id = req.params.id

    if (!deleteAlert(id)) {
      res.send(404)
      return false
    }

    render(template)

    res.send(204)
    next()
  })

  // event listener on DOM
  addEvents(template)

}

module.exports = function (host, port, handlebars) {
  getView('alerts', handlebars, function (err, template) {
    if (err) {
      console.error(err)
      return false
    }
    init(template, host, port)
  })
}
