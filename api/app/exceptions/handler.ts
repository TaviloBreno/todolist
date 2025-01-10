import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger' // Importe o logger corretamente

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * Em modo debug, o manipulador exibirá erros detalhados com
   * rastreamento de pilha formatado.
   */
  protected debug = !app.inProduction

  /**
   * Lida com o erro e retorna uma resposta padronizada para o cliente.
   */
  public async handle(error: unknown, ctx: HttpContext) {
    const statusCode = this.getStatusCode(error)
    const message = this.getErrorMessage(error, statusCode)

    // Retorna uma resposta padronizada para o cliente
    return ctx.response.status(statusCode).json({
      status: statusCode,
      message,
      errors: this.getErrorDetails(error), // Detalhes adicionais, se disponíveis
    })
  }

  /**
   * Relata erros críticos para serviços externos ou logs internos.
   *
   * @note Não deve enviar respostas a partir deste método.
   */
  public async report(error: unknown) {
    // Apenas erros 500 ou críticos são reportados
    if (this.getStatusCode(error) >= 500) {
      logger.error(`[Critical Error]: ${this.getErrorMessage(error, 500)}`, error)
    }
  }

  /**
   * Obtém o código de status HTTP a partir do erro.
   */
  private getStatusCode(error: unknown): number {
    return (error as any)?.status || 500
  }

  /**
   * Obtém a mensagem de erro padronizada.
   */
  private getErrorMessage(error: unknown, statusCode: number): string {
    if (statusCode === 500) {
      return 'Ocorreu um erro interno no servidor.'
    }
    return (error as any)?.message || 'Erro desconhecido.'
  }

  /**
   * Obtém os detalhes adicionais do erro, se disponíveis.
   */
  private getErrorDetails(error: unknown): any | undefined {
    return (error as any)?.messages || undefined
  }
}
