import User from '#models/user'
import ValidationException from '#exceptions/e_validationexception'
import Hash from '@adonisjs/core/services/hash'

export default class UserService {
  public async registerUser(data: {
    fullName?: string
    email: string
    password: string
  }): Promise<User> {
    console.log('Dados recebidos:', data) // Verifique os dados recebidos
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      throw new ValidationException('O email já está em uso.')
    }

    const user = await User.create(data)
    console.log('Usuário criado:', user) // Verifique o usuário criado
    return user
  }

  public async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    console.log('Email fornecido:', email) // Verifique o email fornecido
    const user = await User.findBy('email', email)
    console.log('Usuário encontrado:', user) // Verifique se o usuário foi encontrado

    if (!user) {
      throw new ValidationException('Credenciais inválidas.')
    }

    const passwordValid = await Hash.verify(user.password, password.trim())

    if (!passwordValid) {
      throw new ValidationException('Credenciais inválidas.')
    }

    const token = await user.generateToken()
    return { user, token }
  }

  public async getAuthenticatedUserProfile(userId: number): Promise<User> {
    const user = await User.findOrFail(userId)
    if (!user) {
      throw new ValidationException('Usuário não encontrado.')
    }
    return user
  }

  public async updateUserProfile(
    userId: number,
    data: { fullName?: string; email?: string; password?: string }
  ): Promise<User> {
    const user = await User.find(userId)
    if (!user) {
      throw new ValidationException('Usuário não encontrado.')
    }

    // Valida se o email já está em uso por outro usuário
    if (data.email && data.email !== user.email) {
      const emailInUse = await User.findBy('email', data.email)
      if (emailInUse) {
        throw new ValidationException('O email já está em uso.')
      }
    }

    if (data.fullName) user.fullName = data.fullName
    if (data.email) user.email = data.email
    if (data.password) user.password = data.password

    await user.save()
    return user
  }
}
