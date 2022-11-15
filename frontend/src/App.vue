<script setup lang="ts">
import { storeToRefs } from "pinia";
import { watch } from "vue";
import { RouterView, useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth_store";

/// Used to access the store variables and functions
const authStore = useAuthStore();
// Used to listen on the store changes
const userStore = storeToRefs(authStore);
// Used to access the router
const router = useRouter();

// Always watch if the user is logged in
// if not, redirect to login
watch(userStore.isAutheticated, (val) => {
  if (!val) return router.push("/auth");
});
</script>

<template>
  <RouterView />
</template>
