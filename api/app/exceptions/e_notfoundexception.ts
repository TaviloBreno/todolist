import { Exception } from '@adonisjs/core/exceptions'

export default class ENotFoundException extends Exception {
  constructor(message: string) {
    super(message, { status: 404 })
  }

  /**
   * Handle this exception and return a formatted response
   */
  public async handle(error: this, { response }: { response: any }) {
    response.status(error.status).send({
      message: error.message,
      status: error.status,
    })
  }
}
