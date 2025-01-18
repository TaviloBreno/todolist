<template>
  <div>
    <Menu />
    <div class="profile-container">
      <h1 v-if="!loading">Bem-vindo(a), {{ user.fullName }}!</h1>
      <p v-if="!loading"><strong>Email:</strong> {{ user.email }}</p>
      <p v-if="!loading">
        <strong>Data de Criação:</strong> {{ formattedDate }}
      </p>
      <p v-else>Carregando dados do perfil...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import "~/assets/css/profile.css";

// Variáveis reativas
const user = ref({});
const formattedDate = ref("");
const loading = ref(true); // Indicador de carregamento

onMounted(async () => {
  try {
    const token = localStorage.getItem("jwt");
    console.log("Token recebido do localStorage:", token); // Log do token

    if (!token) {
      alert("Usuário não autenticado! Faça login novamente.");
      window.location.href = "/";
      return;
    }

    // Faz a requisição para a API com o token JWT
    const response = await axios.get("http://localhost:3333/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Resposta da API:", response.data); // Log da resposta da API
    user.value = response.data.data;

    formattedDate.value = new Date(user.value.createdAt).toLocaleDateString(
      "pt-BR",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  } catch (error) {
    console.error(
      "Erro ao carregar o perfil:",
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
        "Erro ao carregar o perfil. Faça login novamente."
    );
    window.location.href = "/";
  } finally {
    loading.value = false;
  }
});
</script>
