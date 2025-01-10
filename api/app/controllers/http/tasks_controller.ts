import { HttpContext } from '@adonisjs/core/http'
import TaskService from '#services/task_service'
import Task from '#models/task'

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

      const data = request.only(['title', 'description', 'priority', 'due_date'])

      if (data.due_date && new Date(data.due_date) < new Date()) {
        return response.status(400).json({
          message: 'A data de vencimento não pode ser anterior à data atual.',
        })
      }

      const validPriorities = [1, 2, 3]
      if (data.priority && !validPriorities.includes(data.priority)) {
        return response.status(400).json({
          message: `Prioridade inválida. Use: 1 (Baixa), 2 (Média), ou 3 (Alta).`,
        })
      }

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
      const orderBy = request.qs().orderBy || 'priority' || 'due_date'
      const orderDirection = request.qs().orderDirection || 'desc'
      const page = Number(request.qs().page) || 1
      const limit = Number(request.qs().limit) || 10

      // Valida o campo de ordenação
      const validOrderFields = ['created_at', 'title', 'priority']
      if (!validOrderFields.includes(orderBy)) {
        return response.status(400).json({
          message: `Campo de ordenação inválido. Use: ${validOrderFields.join(', ')}`,
        })
      }

      const query = user.related('tasks').query()

      if (status === 'completed') {
        query.where('completed', true)
      } else if (status === 'pending') {
        query.where('completed', false)
      }

      query.orderBy(orderBy, orderDirection)

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

  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }

      // Obtém os dados de atualização
      const data = request.only(['title', 'description', 'completed', 'priority', 'due_date'])

      // Validação da data de vencimento
      if (data.due_date && new Date(data.due_date) < new Date()) {
        return response.status(400).json({
          message: 'A data de vencimento não pode ser anterior à data atual.',
        })
      }

      // Validação da prioridade
      const validPriorities = [1, 2, 3]
      if (data.priority && !validPriorities.includes(data.priority)) {
        return response.status(400).json({
          message: 'Prioridade inválida. Use: 1 (Baixa), 2 (Média), ou 3 (Alta).',
        })
      }

      // Verifica se o usuário é o proprietário ou possui permissão de edição
      const task = await Task.query()
        .where('id', params.id)
        .where((query) => {
          query.where('user_id', user.id).orWhereHas('sharedWith', (subQuery) => {
            subQuery.where('shared_with_user_id', user.id).where('can_edit', true)
          })
        })
        .first()

      if (!task) {
        return response.status(403).json({
          message: 'Você não tem permissão para editar esta tarefa.',
        })
      }

      // Atualiza a tarefa com os dados permitidos
      task.merge(data)
      await task.save()

      return response.status(200).json({
        message: 'Tarefa atualizada com sucesso!',
        data: task,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      const statusCode = error instanceof Error && 'status' in error ? (error as any).status : 500

      return response.status(statusCode).json({
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

  public async share({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }

      const task = await user.related('tasks').query().where('id', params.id).first()
      if (!task) {
        return response
          .status(404)
          .json({ message: 'Tarefa não encontrada ou não pertence a você.' })
      }

      const sharedWith = request.input('shared_with', [])
      if (!Array.isArray(sharedWith)) {
        return response.status(400).json({
          message: 'Formato inválido. O campo "shared_with" deve ser uma lista de objetos.',
        })
      }

      const sharedData = sharedWith.reduce((acc, item) => {
        if (item.user_id) {
          acc[item.user_id] = { can_edit: item.can_edit || false }
        }
        return acc
      }, {})

      await task.related('sharedWith').sync(sharedData)

      return response.status(200).json({
        message: 'Tarefa compartilhada com sucesso!',
        data: {
          task_id: task.id,
          shared_with: sharedWith,
        },
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao compartilhar a tarefa.',
        error: (error as Error).message,
      })
    }
  }

  public async sharedWithMe({ auth, response }: HttpContext) {
    console.log('sharedWithMe')
    try {
      const user = auth.user
      if (!user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }

      const tasks = await user.related('sharedTasks').query()

      return response.status(200).json({
        message: 'Tarefas compartilhadas com você listadas com sucesso!',
        data: tasks,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao listar as tarefas compartilhadas.',
        error: (error as Error).message,
      })
    }
  }
}
