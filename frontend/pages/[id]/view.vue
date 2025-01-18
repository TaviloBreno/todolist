<template>
  <div>
    <Menu />
    <div class="view-task-container">
      <h1>Detalhes da Tarefa</h1>
      <div class="task-details">
        <p><strong>Título:</strong> {{ task.title }}</p>
        <p><strong>Descrição:</strong> {{ task.description }}</p>
        <p><strong>Prioridade:</strong> {{ priorityLabel(task.priority) }}</p>
        <p>
          <strong>Data de Vencimento:</strong> {{ formatDate(task.dueDate) }}
        </p>
        <p><strong>Status:</strong> {{ statusLabel(task) }}</p>
      </div>
      <div class="action-buttons">
        <button @click="editTask" class="action-btn edit" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button @click="deleteTask" class="action-btn delete" title="Excluir">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import "~/assets/css/view.css";

const route = useRoute();
const router = useRouter();
const task = ref({});

const fetchTask = async () => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("Usuário não autenticado! Faça login novamente.");
      router.push("/");
      return;
    }

    const response = await axios.get(
      `http://localhost:3333/tasks/${route.params.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    task.value = response.data.data;
  } catch (error) {
    console.error(
      "Erro ao carregar a tarefa:",
      error.response?.data || error.message
    );
    alert("Erro ao carregar a tarefa. Tente novamente.");
    router.push("/tasks");
  }
};

const editTask = () => {
  router.push(`/${route.params.id}/edit`);
};

const deleteTask = async () => {
  if (confirm("Tem certeza que deseja deletar esta tarefa?")) {
    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`http://localhost:3333/tasks/${route.params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Tarefa deletada com sucesso!");
      router.push("/tasks");
    } catch (error) {
      console.error(
        "Erro ao deletar tarefa:",
        error.response?.data || error.message
      );
      alert("Erro ao deletar a tarefa. Tente novamente.");
    }
  }
};

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

onMounted(fetchTask);
</script>
