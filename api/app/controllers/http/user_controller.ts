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
}
