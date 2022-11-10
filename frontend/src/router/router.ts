import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "base",
      redirect: "/auth",
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
