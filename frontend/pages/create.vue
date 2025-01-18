<template>
  <div>
    <Menu />
    <div class="create-task-container">
      <h1>Criar Nova Tarefa</h1>

      <form @submit.prevent="handleCreateTask" class="task-form">
        <div class="form-group">
          <label for="title">Título:</label>
          <input type="text" id="title" v-model="form.title" required />
        </div>

        <div class="form-group">
          <label for="description">Descrição:</label>
          <textarea
            id="description"
            v-model="form.description"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="priority">Prioridade:</label>
          <select id="priority" v-model.number="form.priority" required>
            <option value="1">Baixa</option>
            <option value="2">Média</option>
            <option value="3">Alta</option>
          </select>
        </div>

        <div class="form-group">
          <label for="due_date">Data de Vencimento:</label>
          <input type="date" id="due_date" v-model="form.due_date" required />
        </div>

        <button type="submit" class="submit-btn">Criar Tarefa</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import "~/assets/css/create.css";

// Dados do formulário
const form = ref({
  title: "",
  description: "",
  priority: "",
  due_date: "",
});

// Função para criar a tarefa
const handleCreateTask = async () => {
  try {
    const token = localStorage.getItem("jwt");

    if (!token) {
      alert("Usuário não autenticado! Faça login novamente.");
      window.location.href = "/";
      return;
    }

    // Certifique-se de que os dados estão no formato correto
    const taskData = {
      title: form.value.title,
      description: form.value.description,
      priority: form.value.priority,
      due_date: form.value.due_date,
    };

    console.log("Enviando dados:", taskData); // Log para depuração

    // Faz a requisição de criação de tarefa
    const response = await axios.post("http://localhost:3333/tasks", taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Resposta da API:", response.data); // Log para depuração

    alert("Tarefa criada com sucesso!");
    window.location.href = "/tasks"; // Redireciona para a página de listagem
  } catch (error) {
    console.error(
      "Erro ao criar tarefa:",
      error.response?.data || error.message
    );
    alert(
      error.response?.data?.message ||
        "Erro ao criar a tarefa. Tente novamente."
    );
  }
};
</script>
