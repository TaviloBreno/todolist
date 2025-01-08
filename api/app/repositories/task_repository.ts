import Task from '#models/task'

export default class TaskRepository {
  public async create(data: { title: string; description: string }): Promise<Task> {
    return Task.create(data)
  }
}
