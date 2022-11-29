<template>
    <button
      type="button"
      class="lg:rounded-lg py-4 px-16 font-normal text-blue-500 ring-blue-500 ring-[4px] hover:text-blue-400 hover:ring-blue-400"
    >
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
  