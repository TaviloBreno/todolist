import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    try {
      // Obter dados do corpo da requisição
      const data = request.only(['email', 'password', 'name'])

      // Criar um novo usuário
      const user = await User.create(data)

      // Retornar resposta de sucesso
      return response.status(201).json({
        message: 'Usuário registrado com sucesso!',
        data: user,
      })
    } catch (error) {
      // Retornar resposta de erro
      return response.status(400).json({
        message: 'Erro ao registrar usuário',
        error: (error as Error).message,
      })
    }
  }
}
