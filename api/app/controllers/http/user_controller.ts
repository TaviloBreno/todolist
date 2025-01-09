import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'

export default class UsersController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  public async register({ request, response }: HttpContext) {
    try {
      const data = request.only(['fullName', 'email', 'password'])
      console.log('Dados recebidos no controller:', data)
      const user = await this.userService.registerUser(data)

      return response.status(201).json({
        message: 'Usuário registrado com sucesso!',
        data: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt,
        },
      })
    } catch (error) {
      const status = error instanceof Error && 'status' in error ? (error.status as number) : 500
      return response.status(status).json({
        message: (error as Error).message,
      })
    }
  }

  public async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const { user, token } = await this.userService.loginUser(email, password)

      return response.status(200).json({
        message: 'Usuário autenticado com sucesso!',
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
          },
          token,
        },
      })
    } catch (error) {
      const status = error instanceof Error && 'status' in error ? (error.status as number) : 500
      return response.status(status).json({
        message: (error as Error).message,
      })
    }
  }

  public async profile({ auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.status(401).json({ message: 'Usuário não autenticado' })
      }

      const profile = await this.userService.getAuthenticatedUserProfile(user.id)

      return response.status(200).json({
        message: 'Perfil do usuário encontrado!',
        data: {
          id: profile.id,
          fullName: profile.fullName,
          email: profile.email,
          createdAt: profile.createdAt,
        },
      })
    } catch (error) {
      const status = error instanceof Error && 'status' in error ? (error.status as number) : 500
      return response.status(status).json({
        message: (error as Error).message,
      })
    }
  }

  public async updateProfile({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user // Obtém o usuário autenticado

      if (!user) {
        return response.status(401).json({ message: 'Usuário não autenticado.' })
      }

      const data = request.only(['fullName', 'email', 'password'])
      const updatedUser = await this.userService.updateUserProfile(user.id, data)

      return response.status(200).json({
        message: 'Perfil atualizado com sucesso!',
        data: {
          id: updatedUser.id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          updatedAt: updatedUser.updatedAt,
        },
      })
    } catch (error) {
      const status = error instanceof Error && 'status' in error ? (error.status as number) : 500
      return response.status(status).json({
        message: 'Erro ao atualizar o perfil.',
        error: (error as Error).message,
      })
    }
  }
}
