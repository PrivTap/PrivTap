
<template>
<nav class="flex justify-between pt-5 pl-6">
    <img
            class="h-12"
            src="https://tailwindui.com/img/logos/mark.svg?color=white"
          />
    <div class="flex pr-10 space-x-5 text-center items-center">
      <button
        class="rounded-lg bg-blue-600 py-2 px-9 text-lg font-medium text-white hover:bg-blue-700"
      >
        Create
      </button>
      <button
        class="rounded-lg py-2 px-8 font-semibold text-blue-500 ring-blue-500 ring-[3px] hover:text-blue-400 hover:ring-blue-400"
        @click="logout"
      >
      Logout
      </button>
      <div class="rounded-full ring-[3px] ring-blue-500 w-10 h-10 hover:ring-blue-400">
        <img src="//web-assets.ifttt.com/packs/media/header/icon-avatar-5d8d838b5b5b3f55ce30.svg" alt="">
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import router from '@/router/router';

function logout() {
  router.push('/auth');
}

</script>