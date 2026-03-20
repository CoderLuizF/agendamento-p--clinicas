<template>
  <div class="dashboard">
    <nav>
      <h2>Clínica Medical</h2>
      <div>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/my-appointments">Minhas Consultas</router-link>
        <router-link to="/new-appointment">Nova Consulta</router-link>
        <router-link v-if="isSecretario" to="/admin">Admin</router-link>
        <button @click="logout">Sair</button>
      </div>
    </nav>
    <div class="content">
      <h1>Bem-vindo, {{ user?.nome }}!</h1>
      <p>Você é {{ isSecretario ? "Secretário" : "Paciente" }}</p>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "vue";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => store.state.user);
    const isSecretario = computed(() => store.getters.isSecretario);

    const logout = () => {
      store.dispatch("logout");
      router.push("/login");
    };

    return { user, isSecretario, logout };
  },
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}
nav {
  background: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
nav a,
nav button {
  margin-left: 15px;
  text-decoration: none;
  color: #333;
  padding: 5px 10px;
}
nav button {
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.content {
  padding: 40px;
  text-align: center;
}
</style>
