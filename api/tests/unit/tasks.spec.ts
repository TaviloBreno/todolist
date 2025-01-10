import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import Task from '#models/task'
import User from '#models/user'

describe('Tasks', () => {
  it('Criar uma nova tarefa', async () => {
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`

    const user = await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    const task = await Task.create({
      title: 'Tarefa de Teste',
      description: 'Descrição da tarefa',
      priority: 2,
      userId: user.id,
    })

    assert.equal(task.title, 'Tarefa de Teste')
    assert.equal(task.priority, 2)
  })

  it('Listar tarefas por usuário', async () => {
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`

    const user = await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    await Task.createMany([
      { title: 'Tarefa 1', description: 'Desc 1', priority: 1, userId: user.id },
      { title: 'Tarefa 2', description: 'Desc 2', priority: 3, userId: user.id },
    ])

    const tasks = await Task.query().where('userId', user.id)

    assert.strictEqual(tasks.length, 2)
  })

  it('Ordenar tarefas por prioridade', async () => {
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`

    const user = await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    await Task.createMany([
      { title: 'Tarefa Alta', description: 'Desc alta', priority: 3, userId: user.id },
      { title: 'Tarefa Baixa', description: 'Desc baixa', priority: 1, userId: user.id },
    ])

    const tasks = await Task.query().where('userId', user.id).orderBy('priority', 'desc')

    assert.strictEqual(tasks[0].priority, 3)
    assert.strictEqual(tasks[1].priority, 1)
  })
})
