import TaskRepository from '../repositories/task_repository.js'
import Task from '#models/task'

export default class TaskService {
  private taskRepository: TaskRepository

  constructor() {
    this.taskRepository = new TaskRepository()
  }

  public async createTask(data: { title: string; description: string }): Promise<Task> {
    if (!data.title || !data.description) {
      throw new Error('Título e descrição são obrigatórios.')
    }

    return this.taskRepository.create(data)
  }

  public async listTasks(): Promise<Task[]> {
    return this.taskRepository.getAll()
  }
}
