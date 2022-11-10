import { useAuthStore } from "@/stores/auth_store";
import { createRouter, createWebHistory } from "vue-router";

const authStore = useAuthStore();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "base",
      redirect: authStore ? "/home" : "/auth",
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("../views/AuthView.vue"),
    },
  ],
});

export default router;
