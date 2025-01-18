<template>
  <div>
    <Menu />
    <div class="shared-tasks-container">
      <h1>Tarefas Compartilhadas</h1>

      <!-- Verifica se há tarefas compartilhadas -->
      <div v-if="sharedTasks.length">
        <table class="tasks-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Prioridade</th>
              <th>Data de Vencimento</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in sharedTasks" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.title }}</td>
              <td>{{ task.description }}</td>
              <td>{{ priorityLabel(task.priority) }}</td>
              <td>{{ formatDate(task.dueDate) }}</td>
              <td>{{ statusLabel(task) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>Não há tarefas compartilhadas com você no momento.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import "~/assets/css/shared-tasks.css";

// Dados reativos
const sharedTasks = ref([]);

// Função para buscar tarefas compartilhadas
const fetchSharedTasks = async () => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("Usuário não autenticado! Faça login novamente.");
      window.location.href = "/";
      return;
    }

    // Faz a requisição para buscar as tarefas compartilhadas
    const response = await axios.get(
      "http://localhost:3333/tasks/sharedwithme",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    sharedTasks.value = response.data.data; // Acessa as tarefas compartilhadas
  } catch (error) {
    console.error(
      "Erro ao carregar tarefas compartilhadas:",
      error.response?.data || error.message
    );
    alert("Erro ao carregar as tarefas compartilhadas. Tente novamente.");
  }
};

// Funções auxiliares para formatação
const priorityLabel = (priority) => {
  switch (priority) {
    case 1:
      return "Baixa";
    case 2:
      return "Média";
    case 3:
      return "Alta";
    default:
      return "Desconhecida";
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("pt-BR");
};

const statusLabel = (task) => {
  if (task.completed) {
    return "Concluída";
  } else if (new Date(task.dueDate) < new Date()) {
    return "Atrasada";
  } else {
    return "Pendente";
  }
};

// Busca as tarefas compartilhadas ao montar o componente
onMounted(fetchSharedTasks);
</script>
