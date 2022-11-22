
<template>
<nav v-if="authStore.isAutheticated" class="flex justify-between pt-5 pl-6">
    <img
            class="h-24"
            :src="logo"
            @click="router.push(RoutingPath.HOME)"
          />
    <div class="flex pr-10 space-x-5 text-center items-center">
      <div class="text-xl font-medium text-white px-5 space-x-7">
        <a @click="router.push(RoutingPath.OSP_PERSONAL_PAGE)">OSP Personal Page</a>
        <a @click="router.push(RoutingPath.PERSONAL_PAGE)">My Rules</a>
        <a @click="router.push(RoutingPath.SERVICES_PAGE)">My Services</a>
      </div>
      <button
        class="rounded-lg bg-blue-600 py-2 px-9 text-lg font-medium text-white hover:bg-blue-700"
        @click="router.push(RoutingPath.PERSONAL_PAGE)"
      >
        Create
      </button>
      <button
        class="rounded-lg py-2 px-8 font-semibold text-blue-500 ring-blue-500 ring-[3px] hover:text-blue-400 hover:ring-blue-400"
        @click="authStore.logout(false)"
      >
      Logout
      </button>
      <div class="bg-stone-500 flex font-medium text-white items-center justify-center content-center rounded-full ring-[3px] ring-blue-500 w-10 h-10 hover:ring-blue-400" @click="router.push(RoutingPath.PERSONAL_PAGE)">
        {{ authStore.user?.username.slice(0, 2).toUpperCase() }}
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import logo from '@/assets/images/logo_light.svg';
import { useAuthStore } from "../stores/auth_store";
import { useRouter } from 'vue-router';
import RoutingPath from '@/router/routing_path';

const authStore = useAuthStore();
const router = useRouter();

</script>