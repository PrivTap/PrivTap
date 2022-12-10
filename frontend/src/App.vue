<script setup lang="ts">
import {storeToRefs} from "pinia";
import {watch} from "vue";
import {RouterView, useRouter} from "vue-router";
import {useAuthStore} from "./stores/auth_store";
import NavBar from "./components/NavBar.vue";
import RoutingPath from "./router/routing_path";
import GoTopButton from "./components/GoTopButton.vue"

/// Used to access the store variables and functions
const authStore = useAuthStore();
// Used to listen on the store changes
const userStore = storeToRefs(authStore);
// Used to access the router
const router = useRouter();
// Always watch if the user is logged in 
// if not, redirect to login
watch(userStore.isAutheticated, (val) => {
  console.log("isAutheticated", val);
  if (!val) return router.replace(RoutingPath.AUTH);
});
</script>

<template>
  <v-app >
    <NavBar class="flex bg-[#232323]/90"/>
    <RouterView class="min-h-screen bg-[#232323]/90">
    </RouterView>
    <GoTopButton class="fixed bottom-20 right-20"/>
  </v-app>
</template>
