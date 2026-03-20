<template>
  <div class="container">
    <div class="card">
      <h1>Cadastro</h1>
      <form @submit.prevent="register">
        <input type="text" v-model="form.nome" placeholder="Nome" required />
        <input type="email" v-model="form.email" placeholder="Email" required />
        <input
          type="password"
          v-model="form.senha"
          placeholder="Senha"
          required
        />
        <input
          type="text"
          v-model="form.telefone"
          placeholder="Telefone"
          required
        />
        <input type="date" v-model="form.dataNascimento" required />
        <select v-model="form.tipo">
          <option value="paciente">Paciente</option>
          <option value="secretario">Secretário</option>
        </select>
        <div class="cep-group">
          <input
            type="text"
            v-model="form.cep"
            placeholder="CEP"
            @blur="buscarCep"
          />
          <button type="button" @click="buscarCep" class="btn-small">
            Buscar
          </button>
        </div>
        <input type="text" v-model="form.logradouro" placeholder="Logradouro" />
        <input type="text" v-model="form.numero" placeholder="Número" />
        <button type="submit">Cadastrar</button>
        <p><router-link to="/login">Já tem conta? Login</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { reactive } from "vue";
import axios from "axios";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const form = reactive({
      nome: "",
      email: "",
      senha: "",
      tipo: "paciente",
      telefone: "",
      dataNascimento: "",
      cep: "",
      logradouro: "",
      numero: "",
    });

    const buscarCep = async () => {
      const cep = form.cep.replace(/\D/g, "");
      if (cep.length === 8) {
        const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!res.data.erro) {
          form.logradouro = res.data.logradouro || "";
        }
      }
    };

    const register = async () => {
      const userData = {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        tipo: form.tipo,
        telefone: form.telefone,
        dataNascimento: form.dataNascimento,
        endereco: {
          cep: form.cep,
          logradouro: form.logradouro,
          numero: form.numero,
        },
      };
      const result = await store.dispatch("register", userData);
      if (result.success) {
        router.push("/dashboard");
      } else {
        alert(result.error || "Erro no cadastro");
      }
    };

    return { form, register, buscarCep };
  },
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}
.card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 450px;
}
input,
select {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.cep-group {
  display: flex;
  gap: 5px;
}
.btn-small {
  width: auto;
  padding: 8px 15px;
  background: #667eea;
  margin: 5px 0;
}
button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}
a {
  color: #42b983;
  text-decoration: none;
}
</style>
