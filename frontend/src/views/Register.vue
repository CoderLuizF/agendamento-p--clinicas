<template>
  <div class="container">
    <div class="card">
      <h1>Cadastro</h1>
      <form @submit.prevent="register">
        <input
          type="text"
          v-model="form.nome"
          placeholder="Nome completo"
          required
        />
        <input type="email" v-model="form.email" placeholder="Email" required />
        <input
          type="password"
          v-model="form.senha"
          placeholder="Senha (mínimo 6 caracteres)"
          required
        />
        <input
          type="text"
          v-model="form.telefone"
          placeholder="Telefone (11 99999-9999)"
          required
        />
        <input type="date" v-model="form.dataNascimento" required />

        <select v-model="form.tipo">
          <option value="paciente">Paciente</option>
          <option value="secretario">Secretário</option>
        </select>

        <!-- Seção de CEP -->
        <div class="cep-section">
          <div class="cep-group">
            <input
              type="text"
              v-model="form.cep"
              placeholder="CEP (opcional)"
              @blur="buscarCep"
            />
            <button type="button" @click="buscarCep" class="btn-small">
              Buscar
            </button>
          </div>

          <div v-if="enderecoEncontrado" class="endereco-info">
            <input
              type="text"
              v-model="form.logradouro"
              placeholder="Logradouro"
            />
            <div class="row">
              <input type="text" v-model="form.numero" placeholder="Número" />
              <input
                type="text"
                v-model="form.complemento"
                placeholder="Complemento"
              />
            </div>
            <div class="row">
              <input type="text" v-model="form.bairro" placeholder="Bairro" />
              <input type="text" v-model="form.cidade" placeholder="Cidade" />
            </div>
            <input type="text" v-model="form.estado" placeholder="Estado" />
          </div>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Cadastrando..." : "Cadastrar" }}
        </button>
        <p><router-link to="/login">Já tem conta? Faça login</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import axios from "axios";

export default {
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const enderecoEncontrado = ref(false);

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
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    });

    const buscarCep = async () => {
      const cepLimpo = form.cep.replace(/\D/g, "");

      if (cepLimpo.length !== 8) {
        if (form.cep) alert("CEP inválido. Digite 8 números");
        return;
      }

      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cepLimpo}/json/`,
        );

        if (response.data.erro) {
          alert("CEP não encontrado");
          enderecoEncontrado.value = false;
          return;
        }

        // Preencher os campos com os dados do CEP
        form.logradouro = response.data.logradouro || "";
        form.bairro = response.data.bairro || "";
        form.cidade = response.data.localidade || "";
        form.estado = response.data.uf || "";
        form.complemento = response.data.complemento || "";

        enderecoEncontrado.value = true;
        alert("Endereço encontrado!");
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao buscar CEP");
        enderecoEncontrado.value = false;
      }
    };

    const register = async () => {
      // Validar campos obrigatórios
      if (
        !form.nome ||
        !form.email ||
        !form.senha ||
        !form.telefone ||
        !form.dataNascimento
      ) {
        alert("Preencha todos os campos obrigatórios");
        return;
      }

      if (form.senha.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres");
        return;
      }

      loading.value = true;

      try {
        const dataNascimento = new Date(form.dataNascimento);

        const userData = {
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          tipo: form.tipo,
          telefone: form.telefone,
          dataNascimento: dataNascimento.toISOString(),
          endereco: {
            cep: form.cep,
            logradouro: form.logradouro,
            numero: form.numero,
            complemento: form.complemento,
            bairro: form.bairro,
            cidade: form.cidade,
            estado: form.estado,
          },
        };

        console.log("Enviando dados:", userData);

        const response = await axios.post(
          "http://localhost:3000/api/auth/register",
          userData,
        );

        if (response.data.success) {
          alert("Cadastro realizado com sucesso!");
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.data));
          router.push("/dashboard");
        } else {
          alert(response.data.message || "Erro no cadastro");
        }
      } catch (error) {
        console.error("Erro detalhado:", error.response?.data);
        alert(
          error.response?.data?.message || "Erro ao conectar com o servidor",
        );
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      register,
      buscarCep,
      loading,
      enderecoEncontrado,
    };
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
  width: 500px;
  max-width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

input,
select {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

input:focus,
select:focus {
  outline: none;
  border-color: #667eea;
}

.cep-section {
  margin: 10px 0;
}

.cep-group {
  display: flex;
  gap: 10px;
  margin: 8px 0;
}

.cep-group input {
  flex: 1;
  margin: 0;
}

.btn-small {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.btn-small:hover {
  background: #5a67d8;
}

.endereco-info {
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
  animation: fadeIn 0.3s ease;
}

.row {
  display: flex;
  gap: 10px;
}

.row input {
  flex: 1;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;
}

button[type="submit"]:hover:not(:disabled) {
  background: #3aa876;
  transform: translateY(-2px);
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

p {
  text-align: center;
  margin-top: 15px;
  color: #666;
}

a {
  color: #667eea;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
