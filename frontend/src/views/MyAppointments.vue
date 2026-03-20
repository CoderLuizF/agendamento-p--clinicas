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
      <h1>Minhas Consultas</h1>
      <div v-if="appointments.length === 0" class="empty">
        Nenhuma consulta agendada
      </div>
      <div v-for="a in appointments" :key="a._id" class="card">
        <p>
          <strong>{{ formatDate(a.data) }}</strong> às {{ a.horario }}
        </p>
        <p>
          Status: <span :class="a.status">{{ a.status }}</span>
        </p>
        <button v-if="a.status === 'agendado'" @click="cancelar(a._id)">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import axios from "axios";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const token = localStorage.getItem("token");
    const appointments = ref([]);
    const isSecretario = computed(() => store.getters.isSecretario);

    const carregar = async () => {
      const res = await axios.get("http://localhost:3000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) appointments.value = res.data.data;
    };

    const cancelar = async (id) => {
      if (confirm("Cancelar consulta?")) {
        await axios.delete(`http://localhost:3000/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        carregar();
      }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString("pt-BR");

    const logout = () => {
      store.dispatch("logout");
      router.push("/login");
    };

    onMounted(carregar);

    return { appointments, cancelar, formatDate, logout, isSecretario };
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
  max-width: 600px;
  margin: 0 auto;
}
.card {
  background: white;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
}
.empty {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 5px;
}
.agendado {
  color: orange;
}
.confirmado {
  color: green;
}
.cancelado {
  color: red;
}
button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
