<template>
  <div class="register-container">
    <h1>Registro de Usuário</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="fullName">Nome Completo:</label>
        <input type="text" id="fullName" v-model="form.fullName" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>
      <div>
        <label for="password">Senha:</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>
      <button type="submit">Registrar</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import "~/assets/css/register.css";

// Dados do formulário
const form = ref({
  fullName: "", // Nome completo
  email: "",
  password: "",
});

const message = ref("");

// Função de envio do formulário
const handleSubmit = async () => {
  try {
    // Envia os dados no formato esperado pelo backend
    await axios.post("http://localhost:3333/register", form.value);
    message.value = "Registro realizado com sucesso!";
    // Opcional: Redirecionar ou limpar o formulário
    form.value = { fullName: "", email: "", password: "" };
  } catch (error) {
    message.value = "Erro ao registrar usuário. Tente novamente.";
    console.error(error);
  }
};
</script>
