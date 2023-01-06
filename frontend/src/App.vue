<script setup lang="ts">
import { storeToRefs } from "pinia";
import { watch } from "vue";
import { RouterView, useRouter } from "vue-router";
import NavBar from "./components/NavBar.vue";
import RoutingPath from "./router/routing_path";
import GoTopButton from "./components/GoTopButton.vue"
import auth_controller from "./controllers/authorization_controller";

// Used to access the router
const router = useRouter();

const user = localStorage.getItem("user");
console.log("user", user);
if (user) {
  auth_controller.setUser(JSON.parse(user));
}
// Always watch if the user is logged in
// if not, redirect to login
watch(auth_controller.getRef(), (val) => {
  console.log("isAutheticated", val);
  if (!val) return router.replace(RoutingPath.AUTH);
});
</script>

<template>
  <v-app>
    <NavBar class="flex bg-[#232323]/90" />
    <RouterView class="min-h-screen bg-[#232323]/90">
    </RouterView>
    <GoTopButton class="fixed bottom-20 right-20" />
  </v-app>
</template>
