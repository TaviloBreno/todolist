import { test } from '@japa/runner'
import User from '#models/user'

test.group('Users', () => {
  test('Criar usuário', async ({ assert }) => {
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

  test('Validação de email duplicado', async ({ assert }) => {
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
    } catch (error) {
      // Verifica se o erro foi lançado corretamente
      assert.exists(error)
    }
  })
})
