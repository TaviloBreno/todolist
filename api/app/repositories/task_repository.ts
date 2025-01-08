import Task from '#models/task'

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
    data: Partial<{ title: string; description: string; completed: boolean }>
  ): Promise<Task | null> {
    const task = await Task.find(id)
    if (!task) {
      return null
    }

    task.merge(data)
    await task.save()
    return task
  }
}
