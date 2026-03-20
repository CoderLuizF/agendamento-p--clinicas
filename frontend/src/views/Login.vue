<template>
  <div
    style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    "
  >
    <div
      style="
        background: white;
        padding: 40px;
        border-radius: 10px;
        width: 350px;
        text-align: center;
      "
    >
      <h1>Clínica Medical</h1>
      <form @submit.prevent="login">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          style="
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
          "
        />
        <input
          v-model="senha"
          type="password"
          placeholder="Senha"
          style="
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
          "
        />
        <button
          type="submit"
          style="
            width: 100%;
            padding: 10px;
            background: #42b983;
            color: white;
            border: none;
            border-radius: 5px;
          "
        >
          Entrar
        </button>
      </form>
      <p><router-link to="/register">Criar conta</router-link></p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const email = ref("");
    const senha = ref("");

    const login = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          {
            email: email.value,
            senha: senha.value,
          },
        );

        if (response.data.success) {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.data));
          alert("Login realizado!");
          router.push("/dashboard");
        }
      } catch (error) {
        alert("Email ou senha inválidos");
      }
    };

    return { email, senha, login };
  },
};
</script>
