import { useAuthStore } from "@/stores/auth_store";
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
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("../views/AuthView.vue"),
    },
    {
      path: "/osppersonalpage",
      name: "osppersonalPage",
      component: () => import("../views/OspPersonalPageView.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/services",
      name: "services",
      component: () => import("../views/ServicesView.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/unauthorizedservices",
      name: "unauthorizedservices",
      component: () => import("../views/UnAuthorizedServicesView.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/publishservice",
      name: "publishservice",
      component: () => import("../views/PublishServiceView.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/personalpage",
      name: "personalpage",
      component: () => import("../views/PersonalPageView.vue"),
      meta: {
        requireAuth: true,
      },
    },
 
    {
      path: "/authorizedservices",
      name: "authorizedservices",
      component: () => import("../views/AuthorizedServicesView.vue"),
      meta: {
        requireAuth: true,
      },
    },

    {
      path: "/modifyauth",
      name: "modifyauth",
      component: () => import("../views/ModifyAuth.vue"),
      meta: {
        requireAuth: true,
      },
    }


     //Playing
    // {
    //   path: "/test",
    //   name: "test",
    //   component: () => import("../views/Testt.vue"),
    // }



  ],
});

/// Router guard to check if user is authenticated
router.beforeEach((to, from, next) => {
  const isAutheticated: boolean = useAuthStore().isAutheticated;
  if (to.meta.requireAuth && !isAutheticated) return next("/auth");
  if(to.name === "auth" && isAutheticated) return next("/home");
  return next();
});

export default router;
