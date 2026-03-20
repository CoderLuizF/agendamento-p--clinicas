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
      <div class="card">
        <h1>Nova Consulta</h1>
        <form @submit.prevent="agendar">
          <input type="date" v-model="data" :min="minDate" required />
          <select v-model="horario" required>
            <option value="">Selecione horário</option>
            <option v-for="h in horarios" :key="h">{{ h }}</option>
          </select>
          <input
            type="text"
            v-model="cep"
            placeholder="CEP"
            @blur="buscarCep"
          />
          <input type="text" v-model="logradouro" placeholder="Logradouro" />
          <input type="text" v-model="numero" placeholder="Número" />
          <textarea v-model="observacoes" placeholder="Observações"></textarea>
          <button type="submit">Agendar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import axios from "axios";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const token = localStorage.getItem("token");
    const isSecretario = computed(() => store.getters.isSecretario);

    const data = ref("");
    const horario = ref("");
    const cep = ref("");
    const logradouro = ref("");
    const numero = ref("");
    const observacoes = ref("");
    const minDate = new Date().toISOString().split("T")[0];
    const horarios = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];

    const buscarCep = async () => {
      const cepLimpo = cep.value.replace(/\D/g, "");
      if (cepLimpo.length === 8) {
        const res = await axios.get(
          `https://viacep.com.br/ws/${cepLimpo}/json/`,
        );
        if (!res.data.erro) {
          logradouro.value = res.data.logradouro || "";
        }
      }
    };

    const agendar = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/appointments",
          {
            data: data.value,
            horario: horario.value,
            cep: cep.value,
            numero: numero.value,
            observacoes: observacoes.value,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (res.data.success) {
          alert("Consulta agendada!");
          router.push("/my-appointments");
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        alert("Erro ao agendar");
      }
    };

    const logout = () => {
      store.dispatch("logout");
      router.push("/login");
    };

    return {
      data,
      horario,
      cep,
      logradouro,
      numero,
      observacoes,
      minDate,
      horarios,
      buscarCep,
      agendar,
      logout,
      isSecretario,
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
  max-width: 500px;
  margin: 0 auto;
}
.card {
  background: white;
  padding: 30px;
  border-radius: 10px;
}
input,
select,
textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
