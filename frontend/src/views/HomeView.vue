<template>
  <div
    class="h-[calc(100vh-116px)] relative w-full flex items-center justify-center"
  >
    <div
      class="w-1/2 h-[80vh] mx-auto rounded-full bg-gradient-radial from-blue-300 via-transparent"
    ></div>
    <div class="h-full w-full bg-[#232323]/90 absolute z-10"></div>

    <div class="absolute z-50">
      <div class="text-center text-white h-full w-full">
        <p class="font-semibold text-4xl">
          Hello, {{ authStore.user?.username }} 👋
        </p>
        <p class="text-stone-400">Welcome back and start new automation</p>
      </div>
      <div class="grid grid-cols-12 gap-20 lg:gap-none pt-10">
        <div
          class="col-span-full lg:col-span-7 flex items-center justify-center0"
        >
          <div class="flex justify-between w-full">
            <div class=""></div>
            <div>
              <span class="text-white text-5xl font-semibold"
                >Start connecting your world
              </span>
              <div class="h-1 w-40 bg-blue-600 rounded-full mb-5 mt-2"></div>
              <ul class="list-disc pl-4 text-stone-400 text-lg">
                <li>
                  Users create trigger-action rules through a
                  <strong class="text-blue-500">simple</strong> interface.
                </li>
                <li>
                  Grant <strong class="text-blue-500">control</strong> over your
                  personal data needed for rule execution.
                </li>
                <li>
                  Prevent data leaks through
                  <strong class="text-blue-500">unauthorized</strong> flows.
                </li>
                <li>
                  Allow third-party Online Service Providers to
                  <strong class="text-blue-500">integrate</strong> with the
                  platform,
                  <br />
                  giving the possibility to utilize their services to create
                  rules.
                </li>
              </ul>
              <div class="text-white font-semibold text-xl space-x-16 pt-20">
                <button
                  class="rounded-lg bg-blue-600 py-5 px-16 font-normal text-white hover:bg-blue-700"
                >
                  Create your Rule
                </button>
                <button
                  class="rounded-lg py-4 px-16 font-normal text-blue-500 ring-blue-500 ring-[4px] hover:text-blue-400 hover:ring-blue-400"
                  @click="router.push('/publishservice')"
                >
                  Publish your Service
                </button>
              </div>
            </div>
            <div class="w-0 lg:w-1 rounded bg-blue-500 mr-10"></div>
          </div>
        </div>

        <!-- <div class="h-96 w-1 bg-blue-500 rounded-full"></div> -->
        <div class="col-span-full lg:col-span-5">
          <img class="h-[70vh] mx-auto" :src="draw" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth_store";
import draw from "@/assets/images/draw.svg";
import { useRouter } from "vue-router";
const authStore = useAuthStore();
const router = useRouter();
</script>

<style scoped></style>
