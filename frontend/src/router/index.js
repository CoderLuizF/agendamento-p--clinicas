import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import NewAppointment from "../views/NewAppointment.vue";
import MyAppointments from "../views/MyAppointments.vue";
import AdminAppointments from "../views/AdminAppointments.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  {
    path: "/new-appointment",
    component: NewAppointment,
    meta: { requiresAuth: true },
  },
  {
    path: "/my-appointments",
    component: MyAppointments,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    component: AdminAppointments,
    meta: { requiresAuth: true, admin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.meta.admin && user?.tipo !== "secretario") {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
