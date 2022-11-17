<template>
  <div class="text-center text-white">
    <p class="font-semibold text-4xl"> Hello, {{ authStore.user?.username }} 👋 </p>
    <p class="text-stone-400"> Welcome back and start new automation </p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth_store";
const authStore = useAuthStore();
</script>


<style scoped>
</style>
