import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'
import Task from '#models/task'

export default class UserRepository {
  public async create(data: {
    fullName?: string | null
    email: string
    password: string
  }): Promise<User> {
    return User.create(data)
  }

  public async getAll(): Promise<User[]> {
    return User.query()
  }

  public async getById(id: number): Promise<User | null> {
    return User.find(id)
  }

  public async getByEmail(email: string): Promise<User | null> {
    return User.findBy('email', email)
  }

  public async updateById(
    id: number,
    data: Partial<{
      fullName: string
      email: string
      password: string
    }>
  ): Promise<User | null> {
    const user = await User.find(id)
    if (!user) {
      return null
    }

    if (data.fullName !== undefined) user.fullName = data.fullName
    if (data.email !== undefined) user.email = data.email
    if (data.password !== undefined) {
      user.password = await Hash.make(data.password)
    }

    await user.save()

    return user
  }

  public async deleteById(id: number): Promise<boolean> {
    const user = await User.find(id)
    if (!user) {
      return false
    }

    await user.delete()
    return true
  }

  public async generateToken(user: User): Promise<string> {
    const token = await User.accessTokens.create(user)
    const tokenJson = token.toJSON()

    if (typeof tokenJson.token === 'string') {
      return tokenJson.token
    }

    throw new Error('Falha ao gerar o token')
  }

  public async getSharedTasks(userId: number): Promise<Task[]> {
    const user = await User.query().where('id', userId).preload('sharedTasks').first()

    return user?.sharedTasks || []
  }

  public async revokeToken(userId: number): Promise<void> {
    await User.query().where('id', userId).update({ token: null })
  }
}
