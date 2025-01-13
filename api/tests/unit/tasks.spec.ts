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

  it('Atualizar uma tarefa', async () => {
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

    await task.merge({ title: 'Tarefa Atualizada' }).save()

    assert.equal(task.title, 'Tarefa Atualizada')
  })

  it('Deletar uma tarefa', async () => {
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

    await task.delete()

    const taskDeleted = await Task.find(task.id)

    assert.equal(taskDeleted, null)
  })

  it('Compartilhar uma tarefa', async () => {
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`
    const uniqueEmail2 = `teste-${Date.now() + 1}@exemplo.com`

    const user = await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    const user2 = await User.create({
      email: uniqueEmail2,
      password: 'senha123',
    })

    const task = await Task.create({
      title: 'Tarefa de Teste',
      description: 'Descrição da tarefa',
      priority: 2,
      userId: user.id,
    })

    await task.related('sharedWith').attach({
      [user2.id]: { can_edit: false }, // Use a coluna existente `can_edit`
    })

    const sharedUsers = await task.related('sharedWith').query()

    assert.strictEqual(sharedUsers.length, 1)
    assert.strictEqual(sharedUsers[0].id, user2.id)

    const sharedTasks = await user2.related('sharedTasks').query()

    assert.strictEqual(sharedTasks.length, 1)
    assert.strictEqual(sharedTasks[0].id, task.id)
  })

  it('Listar tarefas compartilhadas comigo', async () => {
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`
    const uniqueEmail2 = `teste-${Date.now() + 1}@exemplo.com`

    const user = await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    const user2 = await User.create({
      email: uniqueEmail2,
      password: 'senha123',
    })

    const task = await Task.create({
      title: 'Tarefa de Teste',
      description: 'Descrição da tarefa',
      priority: 2,
      userId: user.id,
    })

    await task.related('sharedWith').attach({
      [user2.id]: { can_edit: false },
    })

    const sharedTasks = await user2.related('sharedTasks').query()

    assert.strictEqual(sharedTasks.length, 1)
    assert.strictEqual(sharedTasks[0].id, task.id)
  })
})
