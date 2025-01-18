<template>
  <div>
    <Menu />
    <div class="tasks-container">
      <h1>Minhas Tarefas</h1>

      <!-- Botão para criar nova tarefa -->
      <button @click="createTask" class="create-task-btn">Nova Tarefa</button>

      <!-- Tabela de tarefas -->
      <table class="tasks-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Prioridade</th>
            <th>Data de Vencimento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id">
            <td>{{ task.id }}</td>
            <td>{{ task.title }}</td>
            <td>{{ task.description }}</td>
            <td>{{ task.priority }}</td>
            <td>{{ new Date(task.dueDate).toLocaleDateString("pt-BR") }}</td>
            <td>
              {{
                task.completed
                  ? "Concluída"
                  : task.isOverdue
                  ? "Atrasada"
                  : "Pendente"
              }}
            </td>
            <td>
              <div class="action-buttons">
                <button
                  @click="viewTask(task.id)"
                  class="action-btn view"
                  title="Visualizar"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="editTask(task.id)"
                  class="action-btn edit"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteTask(task.id)"
                  class="action-btn delete"
                  title="Deletar"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import "~/assets/css/tasks.css";

// Dados reativos
const tasks = ref([]);
const router = useRouter();

// Função para buscar as tarefas do backend
const fetchTasks = async () => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("Usuário não autenticado! Faça login novamente.");
      window.location.href = "/";
      return;
    }

    // Faz a requisição para buscar as tarefas
    const response = await axios.get("http://localhost:3333/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    tasks.value = response.data.data.data; // Acessa as tarefas no array "data"
  } catch (error) {
    console.error(
      "Erro ao carregar tarefas:",
      error.response?.data || error.message
    );
    alert("Erro ao carregar as tarefas. Tente novamente.");
  }
};

// Funções para ações nas tarefas
const createTask = () => {
  router.push("/create"); // Redireciona para a página de criação de tarefa
};

const viewTask = (id) => {
  router.push(`/tasks/${id}`); // Redireciona para a página de visualização da tarefa
};

const editTask = (id) => {
  router.push(`/${id}/edit`); // Redireciona para a página de edição da tarefa
};

const deleteTask = async (id) => {
  if (confirm("Tem certeza que deseja deletar esta tarefa?")) {
    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`http://localhost:3333/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Tarefa deletada com sucesso!");
      fetchTasks(); // Recarrega a lista de tarefas
    } catch (error) {
      console.error(
        "Erro ao deletar tarefa:",
        error.response?.data || error.message
      );
      alert("Erro ao deletar a tarefa. Tente novamente.");
    }
  }
};

// Busca as tarefas ao montar o componente
onMounted(fetchTasks);
</script>
