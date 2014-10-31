var restify = require('restify')
,   getView = require('../../view-getter')
,   $alerts = window.document.getElementById('alerts')
,   eventListenerOn = false
,   dismissClassRegex = /\bdismiss\b/

var server = restify.createServer()
server.use(restify.bodyParser({ mapParams: false }))

function displayAlert (data, template) {   
  $alerts.innerHTML = template(data)
  if (!eventListenerOn) {
    $alerts.addEventListener('click', function (event) {
      if (event.target && dismissClassRegex.test(event.target.classList)) {
        $alerts.innerHTML = ''
      }
    })
  }
}

module.exports = function (port, handlebars) {

  getView('alerts', handlebars, function (err, template) {
    if (err) {
      console.error(err)
      return false
    }

    server.listen(port || 8080, 'localhost', function () {
      console.log(server.name + ' listening at ' + server.url)
    })

    server.post('/alert', function (req, res, next) {
      if (!req.body || !req.body.title || !req.body.description) {
        res.send(400, { 'status' : 'bad request' })
        return false
      }

      displayAlert(req.body, template)
      res.send(200, { 'status' : 'ok' })
      next()
    })

  })

}