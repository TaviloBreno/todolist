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
}
