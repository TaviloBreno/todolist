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
