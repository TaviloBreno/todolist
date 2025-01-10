import { Exception } from '@adonisjs/core/exceptions'

export default class ValidationException extends Exception {
  constructor(message: string) {
    super(message, { status: 400 })
  }

  public async handle(error: this, { response }: { response: any }) {
    response.status(error.status).send({
      message: error.message,
      status: error.status,
    })
  }
}
