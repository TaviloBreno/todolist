import TaskRepository from '../repositories/task_repository.js'
import Task from '#models/task'
import ValidationException from '#exceptions/e_validationexception'
import NotFoundException from '#exceptions/e_notfoundexception'

export default class TaskService {
  private taskRepository: TaskRepository

  constructor() {
    this.taskRepository = new TaskRepository()
  }

  public async createTask(data: { title: string; description: string }): Promise<Task> {
    if (!data.title || !data.description) {
      throw new ValidationException('Os campos title e description são obrigatórios.')
    }

    return this.taskRepository.create(data)
  }

  public async listTasks(): Promise<Task[]> {
    return this.taskRepository.getAll()
  }

  public async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.getById(id)

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.')
    }

    return task
  }

  public async updateTask(
    id: number,
    data: Partial<{
      title: string
      description: string
      completed: boolean
      priority: number
      due_date: string | null
    }>
  ): Promise<Task> {
    const hasDataToUpdate =
      data.title !== undefined ||
      data.description !== undefined ||
      data.completed !== undefined ||
      data.priority !== undefined ||
      data.due_date !== undefined

    if (!hasDataToUpdate) {
      throw new ValidationException('Pelo menos um campo deve ser atualizado.')
    }

    // Atualiza a tarefa via repositório
    const task = await this.taskRepository.updateById(id, data)
    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`)
    }

    return task
  }

  public async deleteTask(id: number): Promise<boolean> {
    const task = await this.taskRepository.getById(id)
    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada.`)
    }

    return this.taskRepository.deleteById(id)
  }
}
