import Task from '#models/task'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

export default class NotifyOverdueTasks {
  public static async handle() {
    const overdueTasks = await Task.query()
      .where('completed', false)
      .andWhere('due_date', '<', DateTime.local().toISO())

    overdueTasks.forEach((task) => {
      logger.warn(`Tarefa atrasada: ${task.title} (ID: ${task.id})`)
    })

    return overdueTasks.length
  }
}
