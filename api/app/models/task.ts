import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, computed, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  public title!: string

  @column()
  public description!: string

  @column()
  public completed!: boolean

  @column()
  public priority!: number

  @column.dateTime()
  public due_date!: DateTime | null

  @computed()
  public get isOverdue(): boolean {
    return this.due_date ? this.due_date < DateTime.local() && !this.completed : false
  }

  @column()
  public userId!: number

  @belongsTo(() => User)
  public User!: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'task_shares',
    pivotForeignKey: 'task_id',
    pivotRelatedForeignKey: 'shared_with_user_id',
    pivotColumns: ['can_edit'], // Apenas colunas existentes
  })
  public sharedWith!: ManyToMany<typeof User>

  @manyToMany(() => Task, {
    pivotTable: 'task_shares',
    pivotForeignKey: 'shared_with_user_id',
    pivotRelatedForeignKey: 'task_id',
    pivotColumns: ['can_edit'],
  })
  public sharedTasks!: ManyToMany<typeof Task>
}
