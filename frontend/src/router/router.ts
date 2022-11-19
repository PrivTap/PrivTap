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
      }
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("../views/AuthView.vue"),
    },

    {
      path: "/personalPage",
      name: "personalPage",
      component: () => import("../views/PersonalPageView.vue"),
    },

    {
      path: "/osppersonalpage",
      name: "osppersonalPage",
      component: () => import("../views/OspPersonalPageView.vue"),
    },

    {
      path: "/services",
      name: "services",
      component: () => import("../views/ServicesView.vue"),
    },


    {
      path: "/unauthorizedservices",
      name: "unauthorizedservices",
      component: () => import("../views/UnAuthorizedServicesView.vue"),
    },


    {
      path: "/publishservice",
      name: "publishservice",
      component: () => import("../views/PublishServiceView.vue"),
    },
 




     //Playing
    {
      path: "/test",
      name: "test",
      component: () => import("../views/test.vue"),
    }



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
