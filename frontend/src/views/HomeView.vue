<template>
  <NavBar />
  <div class="text-center text-white">
    <h2> Hello, {{ authStore.user?.username }} 👋 </h2>
    <h4 class="text-stone-400"> Welcome back and start new automation </h4>
  </div>
</template>

<script setup lang="ts">
import NavBar from "../components/NavBar.vue";
import { useAuthStore } from "../stores/auth_store";
const authStore = useAuthStore();
</script>


<style scoped></style>
