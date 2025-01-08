/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import Router from '@adonisjs/core/services/router'

Router.post('/tasks', '#controllers/http/tasks_controller.store')
Router.get('/tasks', '#controllers/http/tasks_controller.index')
Router.get('/tasks/:id', '#controllers/http/tasks_controller.show')
Router.put('/tasks/:id', '#controllers/http/tasks_controller.update')
Router.delete('/tasks/:id', '#controllers/http/tasks_controller.destroy')

Router.post('/register', '#controllers/http/user_controller.register')

Router.post('/login', '#controllers/http/user_controller.login')
