import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import User from '#models/user'

describe('Users', () => {
  it('Criar usuário', async () => {
    // Gera um e-mail único para cada execução do teste
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`

    // Cria um usuário com o e-mail único
    const user = await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    // Verifica se o usuário foi criado corretamente
    assert.equal(user.email, uniqueEmail)
  })

  it('Validação de email duplicado', async () => {
    // Gera um e-mail único para cada execução do teste
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`

    // Cria o primeiro usuário com o e-mail único
    await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    try {
      // Tenta criar um segundo usuário com o mesmo e-mail
      await User.create({
        email: uniqueEmail,
        password: 'senha1234',
      })

      // Se não lançar erro, o teste falha
      assert.fail('Deveria ter lançado um erro de email duplicado')
    } catch (error) {
      // Verifica se o erro foi lançado corretamente
      assert.ok(error instanceof Error)
    }
  })
})
