import { HttpContext } from '@adonisjs/core/http'
import TaskService from '#services/task_service'

export default class TasksController {
  private taskService: TaskService

  constructor() {
    this.taskService = new TaskService()
  }

  public async store({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }

      const data = request.only(['title', 'description', 'priority'])
      const task = await user.related('tasks').create({
        ...data,
        priority: data.priority || 1,
      })

      return response.status(201).json({
        message: 'Tarefa criada com sucesso!',
        data: task,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao criar a tarefa.',
        error: (error as Error).message,
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
      const orderBy = request.qs().orderBy || 'created_at'
      const orderDirection = request.qs().orderDirection || 'asc'
      const page = request.qs().page || 1
      const limit = request.qs().limit || 10

      const query = user.related('tasks').query()

      // Aplicar filtro de status
      if (status === 'completed') {
        query.where('completed', true)
      } else if (status === 'pending') {
        query.where('completed', false)
      }

      // Aplicar ordenação
      if (['created_at', 'title', 'priority'].includes(orderBy)) {
        query.orderBy(orderBy, orderDirection)
      }

      // Paginação
      const tasks = await query.paginate(page, limit)

      return response.status(200).json({
        message: 'Tarefas listadas com sucesso!',
        data: tasks.toJSON(),
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
