import Task from '#models/task'
import { DateTime } from 'luxon'

export default class TaskRepository {
  public async create(data: { title: string; description: string }): Promise<Task> {
    return Task.create(data)
  }

  public async getAll(): Promise<Task[]> {
    return Task.query()
  }

  public async getById(id: number): Promise<Task | null> {
    return Task.find(id)
  }

  public async updateById(
    id: number,
    data: Partial<{
      title: string
      description: string
      completed: boolean
      due_date: string | null
    }>
  ): Promise<Task | null> {
    // Encontra a tarefa pelo ID
    const task = await Task.find(id)
    if (!task) {
      return null
    }

    // Atualiza os campos fornecidos
    if (data.title !== undefined) task.title = data.title
    if (data.description !== undefined) task.description = data.description
    if (data.completed !== undefined) task.completed = data.completed
    if (data.due_date !== undefined) {
      task.due_date = data.due_date ? DateTime.fromISO(data.due_date) : null
    }

    // Salva as alterações no banco de dados
    await task.save()

    return task
  }

  public async deleteById(id: number): Promise<boolean> {
    const task = await Task.find(id)
    if (!task) {
      return false
    }

    await task.delete()
    return true
  }
}
