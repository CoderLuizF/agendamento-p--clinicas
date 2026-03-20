import { createStore } from "vuex";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  },
  mutations: {
    setAuth(state, { user, token }) {
      state.user = user;
      state.token = token;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  actions: {
    async login({ commit }, { email, senha }) {
      try {
        const res = await axios.post(`${API_URL}/auth/login`, { email, senha });
        if (res.data.success) {
          commit("setAuth", {
            user: res.data.data,
            token: res.data.data.token,
          });
          return { success: true };
        }
        return { success: false, error: res.data.message };
      } catch (error) {
        return { success: false, error: "Erro ao conectar com servidor" };
      }
    },
    async register({ commit }, userData) {
      try {
        const res = await axios.post(`${API_URL}/auth/register`, userData);
        if (res.data.success) {
          commit("setAuth", {
            user: res.data.data,
            token: res.data.data.token,
          });
          return { success: true };
        }
        return { success: false, error: res.data.message };
      } catch (error) {
        return { success: false, error: "Erro ao conectar com servidor" };
      }
    },
    logout({ commit }) {
      commit("logout");
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isSecretario: (state) => state.user?.tipo === "secretario",
  },
});
