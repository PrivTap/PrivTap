<template>
  <button class=" rounded-lg bg-blue-600 py-5 px-16 font-normal text-white hover:bg-blue-700">
    {{ text }}
  </button>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
