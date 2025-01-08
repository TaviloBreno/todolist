import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddPriorityToTasks extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('priority').defaultTo(1).notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('priority')
    })
  }
}
