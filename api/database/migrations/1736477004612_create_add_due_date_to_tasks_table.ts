import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddDueDateToTasks extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime('due_date').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('due_date')
    })
  }
}
