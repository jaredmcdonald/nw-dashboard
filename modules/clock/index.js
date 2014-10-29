var moment = require('moment')
,   interval = moment.duration(30, 'seconds')

function setClock () {
  window.document.querySelector('#clock time').innerHTML = moment().format('dddd, MMMM Do, YYYY h:mm a');
}

module.exports = function () {
  setClock()
  setInterval(setClock, interval)
}
