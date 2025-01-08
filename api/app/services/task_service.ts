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
}
