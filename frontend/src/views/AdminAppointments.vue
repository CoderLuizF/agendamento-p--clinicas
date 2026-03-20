<template>
  <div class="dashboard">
    <nav>
      <h2>Clínica Medical</h2>
      <div>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/my-appointments">Minhas Consultas</router-link>
        <router-link to="/new-appointment">Nova Consulta</router-link>
        <router-link to="/admin">Admin</router-link>
        <button @click="logout">Sair</button>
      </div>
    </nav>
    <div class="content">
      <h1>Painel Administrativo</h1>
      <div class="filters">
        <select v-model="filtroStatus">
          <option value="">Todos</option>
          <option value="agendado">Agendado</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in filteredAppointments" :key="a._id">
            <td>{{ a.paciente?.nome }}</td>
            <td>{{ formatDate(a.data) }}</td>
            <td>{{ a.horario }}</td>
            <td>
              <span :class="a.status">{{ a.status }}</span>
            </td>
            <td>
              <select
                @change="atualizarStatus(a._id, $event.target.value)"
                :value="a.status"
              >
                <option value="agendado">Agendado</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
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
    const filtroStatus = ref("");

    const carregar = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/appointments/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) appointments.value = res.data.data;
    };

    const atualizarStatus = async (id, status) => {
      await axios.put(
        `http://localhost:3000/api/appointments/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      carregar();
    };

    const filteredAppointments = computed(() => {
      if (!filtroStatus.value) return appointments.value;
      return appointments.value.filter((a) => a.status === filtroStatus.value);
    });

    const formatDate = (date) => new Date(date).toLocaleDateString("pt-BR");

    const logout = () => {
      store.dispatch("logout");
      router.push("/login");
    };

    onMounted(carregar);

    return {
      appointments,
      filteredAppointments,
      filtroStatus,
      atualizarStatus,
      formatDate,
      logout,
    };
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
}
.filters {
  margin-bottom: 20px;
}
table {
  width: 100%;
  background: white;
  border-collapse: collapse;
}
th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
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
select {
  padding: 5px;
}
</style>
