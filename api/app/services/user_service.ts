import User from '#models/user'
import ValidationException from '#exceptions/e_validationexception'

export default class UserService {
  public async registerUser(data: {
    fullName?: string
    email: string
    password: string
  }): Promise<User> {
    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      throw new ValidationException('O email já está em uso.')
    }

    const user = await User.create(data)
    return user
  }
}
