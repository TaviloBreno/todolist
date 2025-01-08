import { DateTime } from 'luxon'
import Hash from '@adonisjs/core/services/hash'
import { BaseModel, column, hasMany, beforeSave } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Task from './task.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @hasMany(() => Task)
  declare tasks: HasMany<typeof Task>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public async generateToken(): Promise<string> {
    const token = await User.accessTokens.create(this)
    const tokenJson = token.toJSON()

    // Suponha que `tokenJson` seja um objeto com uma propriedade `value` que contém o token
    if (typeof tokenJson.token === 'string') {
      return tokenJson.token
    }

    throw new Error('Falha ao gerar o token')
  }
}
