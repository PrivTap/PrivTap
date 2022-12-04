import { useAuthStore } from "@/stores/auth_store";
import { createRouter, createWebHistory } from "vue-router";
import RoutingPath from "./routing_path";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: RoutingPath.BASE,
      name: "base",
      redirect: "/auth",
    },
    {
      path: RoutingPath.HOME,
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: RoutingPath.AUTH,
      name: "auth",
      component: () => import("../views/AuthView.vue"),
    },
    {
      path: RoutingPath.OSP_PERSONAL_PAGE,
      name: "osppersonalPage",
      component: () => import("../views/OspPersonalPageView.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: RoutingPath.SERVICES_PAGE,
      name: "services",
      component: () => import("../views/ServicesView.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: RoutingPath.UNAUTHORIZED_SERVICE_PAGE,
      name: "unauthorizedservices",
      component: () => import("../views/UnAuthorizedServicesView.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: `${RoutingPath.PUBLISH_SERVICE_PAGE}/:id?`,
      name: "publishservice",
      component: () => import("../views/PublishServiceView.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: RoutingPath.PERSONAL_PAGE,
      name: "personalpage",
      component: () => import("../views/PersonalPageView.vue"),
      meta: {
        requireAuth: true,
      },
    },

    {
      path: RoutingPath.AUTHORIZED_SERVICES_PAGE,
      name: "authorizedservices",
      component: () => import("../views/AuthorizedServicesView.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: RoutingPath.MODIFY_AUTH_PAGE,
      name: "modifyauth",
      component: () => import("../views/ModifyAuth.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: `${RoutingPath.SERVICE_PERMISSION_PAGE}/:id?`,
      name: "servicepermission",
      component: () => import("../views/OspManagePermissionView.vue"),
      meta: {
        requireAuth: true,
      },
    },

    {
      path: `${RoutingPath.SERVICE_TRIGGER_PAGE}/:id?`,
      name: "servicetrigger",
      component: () => import("../views/OspManageTriggerView.vue"),
      meta: {
        requireAuth: true,
      },
    },

    {
      path: `${RoutingPath.SERVICE_ACTION_PAGE}/:id?`,
      name: "serviceaction",
      component: () => import("../views/OspManageActionView.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      redirect: "/home",
    }
  ],
});

/// Router guard to check if user is authenticated
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.query.activate) {
    authStore.activate(to.query.activate as string);
  }

  const isAutheticated: boolean = authStore.isAutheticated;
  if (to.meta.requireAuth && !isAutheticated) return next("/auth");
  if (to.name === "auth" && isAutheticated) return next("/home");
  return next();
});

export default router;
