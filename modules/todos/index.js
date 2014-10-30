var getView    = require('../../view-getter')
,   request    = require('request')
,   _          = require('underscore')
,   todos      = []

function init (server, template) {
  getTodos(server, template)
  watchTodos(server, template)
}

function getTodos (server, template) {
  request(server + '/todos', function (err, res, body) {
    if (err) {
      console.error(err)
      return false
    }
    todos = JSON.parse(body)
    render(todos, template)
  })
}

function submitTodo (server, template, todo) {
  request.post({
    url : server + '/todos/create',
    json : true,
    body : { description : todo }
  }, function (err, res, body) {
    if (err) {
      window.alert('error saving todo :(')
      console.error(err)
      return false
    }
    getTodos(server, template)
  })
}

function deleteTodo (server, template, id) {
  request.del(server + '/todos/' + id, null, function (err, res, body) {
    if (err) {
      window.alert('error deleting todo :(')
      console.error(err)
      return false
    }
    getTodos(server, template)
  })
}

function completeTodo (server, template, id) {
  var targetTodo = _.find(todos, { _id : id })
  targetTodo.completed = !targetTodo.completed // toggle

  request.put({
    url : server + '/todos/' + id.toString(),
    json : true,
    body : { completed : targetTodo.completed }
  }, function (err, res, body) {
    if (err) {
      window.alert('error updating todo :(')
      console.error(err)
      return false
    }
    getTodos(server, template)
  })
}

function watchTodos (server, template) {
  var $todos = window.document.getElementById('todos')
  ,   deleteClassRegex = /\bdelete\b/
  ,   completeClassRegex = /\bcomplete\b/

  $todos.addEventListener('submit', function (event) {
    event.preventDefault()
    if (event.target && event.target.nodeName === 'FORM') {

      var todoDescription = event.target.children[0].value

      if (todoDescription === '') {
        return false
      }

      submitTodo(server, template, todoDescription)

    }
  })

  $todos.addEventListener('click', function (event) {
    event.preventDefault()
    if (!event.target) {
      return false
    }

    var id = event.target.dataset.id

    if (deleteClassRegex.test(event.target.className)) {
      deleteTodo(server, template, id)
      return false
    }
    if (completeClassRegex.test(event.target.className)) {
      completeTodo(server, template, id)
      return false
    }

  })
}

function render (data, template) {
  data.forEach(function (item) {
    item.id = item._id // handlebars apparently doesn't support property
  })                   // names that begin with underscores
  var html = template(data)
  window.document.getElementById('todos').innerHTML = html
}

module.exports = function (server, handlebars) {
  getView('todos', handlebars, function (err, template) {
    if (err) {
      console.error('error getting view:', err)
      return false
    }
    init(server, template)
  })
}
