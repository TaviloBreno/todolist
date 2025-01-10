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

      // Obtém parâmetros da query string
      const status = request.qs().status // Filtro por status (opcional)
      const orderBy = request.qs().orderBy || 'priority' // Campo para ordenação (prioridade por padrão)
      const orderDirection = request.qs().orderDirection || 'desc' // Direção da ordenação (decrescente por padrão)
      const page = Number(request.qs().page) || 1 // Página atual
      const limit = Number(request.qs().limit) || 10 // Limite de itens por página

      // Valida o campo de ordenação
      const validOrderFields = ['created_at', 'title', 'priority']
      if (!validOrderFields.includes(orderBy)) {
        return response.status(400).json({
          message: `Campo de ordenação inválido. Use: ${validOrderFields.join(', ')}`,
        })
      }

      // Constrói a consulta
      const query = user.related('tasks').query()

      // Aplica o filtro por status
      if (status === 'completed') {
        query.where('completed', true)
      } else if (status === 'pending') {
        query.where('completed', false)
      }

      // Aplica a ordenação
      query.orderBy(orderBy, orderDirection)

      // Executa a paginação
      const tasks = await query.paginate(page, limit)

      // Retorna a resposta com os dados paginados
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
      // Obtém os campos permitidos para atualização
      const data = request.only(['title', 'description', 'completed', 'priority'])

      // Validação do campo `priority`
      const validPriorities = [1, 2, 3] // 1 = Baixa, 2 = Média, 3 = Alta
      if (data.priority && !validPriorities.includes(data.priority)) {
        return response.status(400).json({
          message: 'Prioridade inválida. Use: 1 (Baixa), 2 (Média), ou 3 (Alta).',
        })
      }

      // Atualiza a tarefa via serviço
      const task = await this.taskService.updateTask(params.id, data)

      return response.status(200).json({
        message: 'Tarefa atualizada com sucesso!',
        data: task,
      })
    } catch (error) {
      // Trata os erros de forma robusta
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
}
