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
  watchTodos(server, template)
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

function submitTodo (server, template, todo) {
  request.post(server + '/todos/create', { form : { description : todo }}, function (err, res, body) {
    if (err) {
      window.alert('error saving todo :(')
      console.error(err)
      return false
    }
    getTodos(server, template)
  })
}

function deleteTodo (server, template, id) {
  request.del(server + '/todos/' + id.toString(), null, function (err, res, body) {
    if (err) {
      window.alert('error deleting todo :(')
      console.error(err)
      return false
    }
    getTodos(server, template)
  })
}

function watchTodos (server, template) {
  var $todos = window.document.getElementById('todos')
  ,   deleteClassRegex = /\bdelete\b/

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
    
    if (event.target && deleteClassRegex.test(event.target.className)) {
      deleteTodo(server, template, event.target.dataset.id)
    }

  })
}

function render (data, template) {
  var html = template(data)
  window.document.getElementById('todos').innerHTML = html
}
