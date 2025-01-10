import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import User from '#models/user'

describe('Users', () => {
  it('Criar usuário', async () => {
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`

    const user = await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    assert.equal(user.email, uniqueEmail)
  })

  it('Validação de email duplicado', async () => {
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`

    await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    try {
      await User.create({
        email: uniqueEmail,
        password: 'senha1234',
      })

      assert.fail('Deveria ter lançado um erro de email duplicado')
    } catch (error) {
      assert.ok(error instanceof Error)
    }
  })
})
