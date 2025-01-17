<template>
  <nav class="menu-container">
    <ul>
      <li><a href="/">Início</a></li>
      <li><a href="/profile">Meu Perfil</a></li>
      <li><a href="/tasks">Minhas Tarefas</a></li>
      <li><a href="/tasks/sharedwithme">Tarefas Compartilhadas</a></li>
      <li><a href="#" @click.prevent="logout">Sair</a></li>
    </ul>
  </nav>
</template>

<script setup>
import "~/assets/css/menu.css";

const logout = async () => {
  try {
    // Faz a requisição para a rota de logout
    await fetch("http://localhost:3333/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    // Remove o token JWT do localStorage
    localStorage.removeItem("jwt");

    // Redireciona para a página de login
    window.location.href = "/";
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    alert("Erro ao sair. Tente novamente.");
  }
};
</script>
