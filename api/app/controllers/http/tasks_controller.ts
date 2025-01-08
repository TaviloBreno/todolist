import { HttpContext } from '@adonisjs/core/http'
import TaskService from '#services/task_service'

export default class TasksController {
  private taskService: TaskService

  constructor() {
    this.taskService = new TaskService()
  }

  public async store({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.status(401).json({ message: 'Usuário não autenticado' })
      }

      const data = request.only(['title', 'description'])
      const task = await user.related('tasks').create(data)

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

  public async index({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }

      const status = request.qs().status

      // Filtra as tarefas com base no status
      const query = user.related('tasks').query()
      if (status === 'completed') {
        query.where('completed', true)
      } else if (status === 'pending') {
        query.where('completed', false)
      }

      const tasks = await query

      return response.status(200).json({
        message: 'Tarefas listadas com sucesso!',
        data: tasks,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao listar as tarefas.',
        error: (error as Error).message,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const task = await this.taskService.getTaskById(params.id)

      return response.status(200).json({
        message: 'Tarefa encontrada!',
        data: task,
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Tarefa não encontrada.',
        error: (error as Error).message,
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.only(['title', 'description', 'completed'])
      const task = await this.taskService.updateTask(params.id, data)

      return response.status(200).json({
        message: 'Tarefa atualizada com sucesso!',
        data: task,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const statusCode = error instanceof Error && 'status' in error ? (error as any).status : 500

      return response.status(statusCode).send({
        message: errorMessage,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      await this.taskService.deleteTask(params.id)

      return response.status(204).send({})
    } catch (error) {
      return response.status(404).json({
        message: 'Tarefa não encontrada.',
        error: (error as Error).message,
      })
    }
  }
}
