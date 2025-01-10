import vine from '@vinejs/vine'

export default class UpdateTaskValidator {
  public schema = vine.object({
    title: vine.string().maxLength(255).optional(),
    description: vine.string().maxLength(500).optional(),
    priority: vine.number().min(1).max(3).optional(),
    due_date: vine.date().after('today').optional(),
    completed: vine.boolean().optional(),
  })

  public messages = {
    'title.maxLength': 'O título não pode ter mais de 255 caracteres.',
    'description.maxLength': 'A descrição não pode ter mais de 500 caracteres.',
    'priority.min': 'A prioridade deve ser 1 (Baixa), 2 (Média) ou 3 (Alta).',
    'priority.max': 'A prioridade deve ser 1 (Baixa), 2 (Média) ou 3 (Alta).',
    'due_date.after': 'A data de vencimento deve ser posterior à data atual.',
  }
}
