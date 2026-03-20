<template>
  <div class="container">
    <div class="card">
      <h1>Clínica Medical</h1>
      <form @submit.prevent="login">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="senha" placeholder="Senha" required />
        <button type="submit">Entrar</button>
        <p><router-link to="/register">Criar conta</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref("");
    const senha = ref("");

    const login = async () => {
      const result = await store.dispatch("login", {
        email: email.value,
        senha: senha.value,
      });
      if (result.success) {
        router.push("/dashboard");
      } else {
        alert(result.error || "Erro no login");
      }
    };

    return { email, senha, login };
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
}
.card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  width: 350px;
  text-align: center;
}
input {
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
  margin-top: 10px;
}
a {
  color: #42b983;
  text-decoration: none;
}
</style>
