function setClock () {
  window.document.querySelector('#clock pre').innerHTML = new Date().toLocaleString()
}

module.exports = function () {
  setClock()
  setInterval(setClock, 200) // whatever
}
