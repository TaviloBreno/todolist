import User from '#models/user'
import ValidationException from '#exceptions/e_validationexception'
import Hash from '@adonisjs/core/services/hash'
import UserRepository from '../repositories/user_repository.js'

export default class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  public async registerUser(data: {
    fullName?: string
    email: string
    password: string
  }): Promise<User> {
    const existingUser = await this.userRepository.getByEmail(data.email)
    if (existingUser) {
      throw new ValidationException('O email já está em uso.')
    }

    const user = await this.userRepository.create(data)
    return user
  }

  public async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.getByEmail(email)
    if (!user) {
      throw new ValidationException('Credenciais inválidas.')
    }

    const passwordValid = await Hash.verify(user.password, password.trim())
    if (!passwordValid) {
      throw new ValidationException('Credenciais inválidas.')
    }

    const token = await this.userRepository.generateToken(user)
    return { user, token }
  }

  public async logoutUser(userId: number): Promise<void> {
    await this.userRepository.revokeToken(userId)
  }

  public async getAuthenticatedUserProfile(userId: number): Promise<User> {
    const user = await this.userRepository.getById(userId)
    if (!user) {
      throw new ValidationException('Usuário não encontrado.')
    }
    return user
  }

  public async updateUserProfile(
    userId: number,
    data: { fullName?: string; email?: string; password?: string }
  ): Promise<User> {
    const user = await this.userRepository.getById(userId)
    if (!user) {
      throw new ValidationException('Usuário não encontrado.')
    }

    if (data.email && data.email !== user.email) {
      const emailInUse = await this.userRepository.getByEmail(data.email)
      if (emailInUse) {
        throw new ValidationException('O email já está em uso.')
      }
    }

    const updatedUser = await this.userRepository.updateById(userId, data)
    if (!updatedUser) {
      throw new ValidationException('Falha ao atualizar o perfil do usuário.')
    }

    return updatedUser
  }
}
