import { HttpContext } from '@adonisjs/core/http'
import TaskService from '#services/task_service'

export default class TasksController {
  private taskService: TaskService

  constructor() {
    this.taskService = new TaskService()
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['title', 'description'])
      const task = await this.taskService.createTask(data)

      return response.status(201).json({
        message: 'Tarefa criada com sucesso!',
        data: task,
      })
    } catch (error) {
      return response.status(400).json({
        message: (error as Error).message,
      })
    }
  }
}
