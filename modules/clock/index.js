function setClock () {
  window.document.getElementById('clock').innerHTML = new Date().toLocaleTimeString()
}

module.exports = function () {
  setClock()
  setInterval(setClock, 200) // whatever
}
