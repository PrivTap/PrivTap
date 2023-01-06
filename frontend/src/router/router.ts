import auth_controller from "@/controllers/authorization_controller";
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
      path: `${RoutingPath.MODIFY_AUTH_PAGE}/:id?`,
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
      path: `${RoutingPath.EXPLORE_SERVICE_PAGE}/:service`,
      name: "exploreservice",
      component: () => import("../views/ExploreServiceView.vue"),
      props: true,
      meta: {
        requireAuth: true,
      },
    },

    {
      path: `${RoutingPath.CREATE_RULE_PAGE}/:id?`,
      name: "createrule",
      component: () => import("../views/CreateRuleView.vue"),
      props: true,
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

  if (to.query.activate) {
    auth_controller.activate(to.query.activate as string);
  }

  let isAutheticated = auth_controller.isAuthenticated.value;
  console.log("isAutheticatedGuard", isAutheticated);
  if (to.meta.requireAuth && !isAutheticated) return next("/auth");
  if (to.name === "auth" && isAutheticated) return next("/home");
  return next();
});

export default router;
