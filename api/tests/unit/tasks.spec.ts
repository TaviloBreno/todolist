import { test } from '@japa/runner'
import Task from '#models/task'
import User from '#models/user'

test.group('Tasks', () => {
  test('Criar uma nova tarefa', async ({ assert }) => {
    // Gera um e-mail único para cada execução do teste
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`

    // Cria um usuário com o e-mail único
    const user = await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    // Cria uma tarefa associada ao usuário
    const task = await Task.create({
      title: 'Tarefa de Teste',
      description: 'Descrição da tarefa',
      priority: 2,
      userId: user.id,
    })

    // Verifica se a tarefa foi criada corretamente
    assert.equal(task.title, 'Tarefa de Teste')
    assert.equal(task.priority, 2)
  })

  test('Listar tarefas por usuário', async ({ assert }) => {
    // Gera um e-mail único para cada execução do teste
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`

    // Cria um usuário com o e-mail único
    const user = await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    // Cria várias tarefas associadas ao usuário
    await Task.createMany([
      { title: 'Tarefa 1', description: 'Desc 1', priority: 1, userId: user.id },
      { title: 'Tarefa 2', description: 'Desc 2', priority: 3, userId: user.id },
    ])

    // Busca as tarefas do usuário
    const tasks = await Task.query().where('userId', user.id)

    // Verifica se as tarefas foram criadas corretamente
    assert.lengthOf(tasks, 2)
  })

  test('Ordenar tarefas por prioridade', async ({ assert }) => {
    // Gera um e-mail único para cada execução do teste
    const uniqueEmail = `teste-${Date.now()}@exemplo.com`

    // Cria um usuário com o e-mail único
    const user = await User.create({
      email: uniqueEmail,
      password: 'senha123',
    })

    // Cria várias tarefas associadas ao usuário
    await Task.createMany([
      { title: 'Tarefa Alta', description: 'Desc alta', priority: 3, userId: user.id },
      { title: 'Tarefa Baixa', description: 'Desc baixa', priority: 1, userId: user.id },
    ])

    // Busca as tarefas do usuário, ordenadas por prioridade (decrescente)
    const tasks = await Task.query().where('userId', user.id).orderBy('priority', 'desc')

    // Verifica se as tarefas foram ordenadas corretamente
    assert.equal(tasks[0].priority, 3) // A primeira tarefa deve ter prioridade 3
    assert.equal(tasks[1].priority, 1) // A segunda tarefa deve ter prioridade 1
  })
})
