<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>
      <div>
        <label for="password">Senha:</label>
        <div class="password-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="form.password"
            required
          />
          <span @click="togglePassword" class="toggle-password">
            {{ showPassword ? "👁️" : "🙈" }}
          </span>
        </div>
      </div>
      <button type="submit">Entrar</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

// Referência ao CSS
import "~/assets/css/login.css";

// Dados do formulário de login
const form = ref({
  email: "",
  password: "",
});

const message = ref("");
const showPassword = ref(false);

// Alterna a visualização da senha
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Função para submeter o formulário de login
const handleSubmit = async () => {
  try {
    // Faz a requisição à API de login
    const response = await axios.post(
      "http://localhost:3333/login",
      form.value
    );

    // Extrai os dados da resposta
    const token = response.data.data?.token; // Acessa token dentro de data
    const user = response.data.data?.user; // Acessa os dados do usuário

    if (!token) {
      throw new Error("Token não retornado pela API.");
    }

    // Armazena o token JWT no localStorage
    localStorage.setItem("jwt", token);

    // Exibe mensagem de sucesso
    message.value = `Bem-vindo(a), ${user.fullName}! Login realizado com sucesso.`;

    // Redireciona para a página de perfil
    setTimeout(() => {
      window.location.href = "/profile";
    }, 500);
  } catch (error) {
    // Tratamento de erro com mensagem personalizada
    message.value =
      error.response?.data?.message ||
      "Erro ao realizar login. Verifique suas credenciais.";
    console.error(
      "Erro ao realizar login:",
      error.response?.data || error.message
    );
  }
};
</script>
