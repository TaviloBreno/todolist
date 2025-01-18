<template>
  <div>
    <Menu />
    <div class="edit-task-container">
      <h1>Editar Tarefa</h1>

      <form @submit.prevent="handleEditTask" class="task-form">
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

        <button type="submit" class="submit-btn">Salvar Alterações</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

// Dados do formulário
const form = ref({
  title: "",
  description: "",
  priority: "",
  due_date: "",
});

const route = useRoute(); // Obter o ID da tarefa da rota
const router = useRouter(); // Navegação dinâmica
const taskId = route.params.id; // ID da tarefa

// Função para buscar os dados da tarefa
const fetchTask = async () => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("Usuário não autenticado! Faça login novamente.");
      router.push("/");
      return;
    }

    const response = await axios.get(`http://localhost:3333/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const task = response.data.data;

    form.value.title = task.title;
    form.value.description = task.description;
    form.value.priority = task.priority;
    form.value.due_date = task.dueDate.split("T")[0]; // Formato `yyyy-MM-dd`
  } catch (error) {
    console.error(
      "Erro ao buscar tarefa:",
      error.response?.data || error.message
    );
    alert("Erro ao carregar a tarefa. Tente novamente.");
    router.push("/tasks");
  }
};

// Função para salvar as alterações
const handleEditTask = async () => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("Usuário não autenticado! Faça login novamente.");
      router.push("/");
      return;
    }

    if (!form.value.title || !form.value.description || !form.value.due_date) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    await axios.put(`http://localhost:3333/tasks/${taskId}`, form.value, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Tarefa editada com sucesso!");
    router.push("/tasks");
  } catch (error) {
    console.error(
      "Erro ao editar tarefa:",
      error.response?.data || error.message
    );
    alert("Erro ao salvar as alterações. Tente novamente.");
  }
};

// Busca os dados da tarefa ao montar o componente
onMounted(fetchTask);
</script>

<style scoped>
.edit-task-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-task-container h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  resize: vertical;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>
