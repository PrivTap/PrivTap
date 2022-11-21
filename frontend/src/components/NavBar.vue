
<template>
<nav v-if="authStore.isAutheticated" class="flex justify-between pt-5 pl-6">
    <img
            class="h-24"
            :src="logo"
            @click="router.push('home')"
          />
    <div class="flex pr-10 space-x-5 text-center items-center">
      <div class="text-xl font-medium text-white px-5 space-x-7">
        <a @click="router.push('personalpage')">My Rules</a>
        <a @click="router.push('osppersonalpage')">My Services</a>
      </div>
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
      <div class="rounded-full ring-[3px] ring-blue-500 w-10 h-10 hover:ring-blue-400" @click="router.push('personalpage')">
        <img src="//web-assets.ifttt.com/packs/media/header/icon-avatar-5d8d838b5b5b3f55ce30.svg" alt="">
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import logo from '@/assets/images/logo_light.svg';
import AuthService from "@/services/auth_service";
import { useAuthStore } from "../stores/auth_store";
import { useToast } from "vue-toastification";
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

async function logout(){
  const res = await new AuthService().logout();
  if(res.status){
    return toast.success(res.message);
  }
  return toast.error(res.message);

}

</script>