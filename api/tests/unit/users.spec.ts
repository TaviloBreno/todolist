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

  it('Validação de email obrigatório', async () => {
    try {
      await User.create({
        email: '',
        password: 'senha123',
      })

      assert.fail('Deveria ter lançado um erro de email obrigatório')
    } catch (error) {
      assert.ok(error instanceof Error)
    }
  })

  it('Validação de senha obrigatória', async () => {
    try {
      await User.create({
        email: `teste-${Date.now()}@exemplo.com`,
        password: '',
      })

      assert.fail('Deveria ter lançado um erro de senha obrigatória')
    } catch (error) {
      assert.ok(error instanceof Error)
    }
  })

  it('Validação de senha mínima', async () => {
    try {
      await User.create({
        email: `teste-${Date.now()}@exemplo.com`,
        password: '123',
      })

      assert.fail('Deveria ter lançado um erro de senha mínima')
    } catch (error) {
      assert.ok(error instanceof Error)
    }
  })

  it('Validação de email válido', async () => {
    try {
      await User.create({
        email: 'emailinvalido',
        password: 'senha123',
      })

      assert.fail('Deveria ter lançado um erro de email inválido')
    } catch (error) {
      assert.ok(error instanceof Error)
    }
  })

  it('Buscar usuário por email', async () => {
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`

    await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    const user = await User.findBy('email', uniqueEmail)

    assert.ok(user)
  })

  it('Buscar usuário por email inexistente', async () => {
    const user = await User.findBy('email', 'emailinexistente')

    assert.ok(!user)
  })

  it('Buscar usuário por id', async () => {
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`

    const userCreated = await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    const user = await User.find(userCreated.id)

    assert.ok(user)
  })

  it('Buscar usuário por id inexistente', async () => {
    const user = await User.find(999999)

    assert.ok(!user)
  })
})
