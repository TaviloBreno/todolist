import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'task_shares'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('can_edit').defaultTo(false).notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('can_edit')
    })
  }
}
