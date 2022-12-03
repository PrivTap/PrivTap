<template>
  <div class="h-full">
    <div class="flex flex-row justify-center py-10 space-x-20">
      <button type="button" class="px-5 py-3 bg-blue-800 font-semibold text-white rounded-md hover:bg-blue-900"
              @click="router.push(RoutingPath.MODIFY_AUTH_PAGE)">
        Modify authorization
      </button>

      <button type="button" class="px-5 py-3 bg-blue-800 font-semibold text-white rounded-md hover:bg-blue-900"
              @click="router.push(RoutingPath.UNAUTHORIZED_SERVICE_PAGE)">
        Authorize new service
      </button>
      <button type="button" class="px-5 py-3 bg-blue-800 font-semibold text-white rounded-md hover:bg-blue-900">
        Remove Service
      </button>
    </div>
    <h1 class="text-5xl text-blue-100 font-medium text-center py-5">Services</h1>

    <form class="flex items-center mx-auto justify-center py-16 ">
      <label for="simple-search" class="sr-only">Search</label>

      <div class="relative">
        <div
            class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
        >
          <svg
              aria-hidden="true"
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <input
            type="text"
            id="simple-search"
            class="px-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
        >
      </div>

    </form>
    <div class="flex flex-col items-center justify-center relative h-screen">
      <img :src="radial" class="w-1/2">
      <div class="absolute top-2 w-half h-5/6">
        <div v-if="isLoading" class="flex flex-col justify-center items-center content-center ">
          <img :src="logo" class="h-32 my-20 animate-bounce">
        </div>

        <div v-if="!services.length" class="flex flex-col justify-center items-center content-center ">
          <h1 class="text-3xl text-blue-100 text-center pt-8 font-medium">
            You have no services yet
          </h1>
          <h1 class="text-lg text-stone-400 text-center pt-4 pb-10 font-medium">
            Create a service by clicking the button below
          </h1>
          <img :src=empty class="h-72 ">
        </div>
        <div v-if="services?.length" class="py-10">
          <div class=" px-10 grid  lg:grid-cols-2 xl:grid-cols-3 gap-10">
            <SimpleServiceCard v-for="(item, index) in services" :key="index" :service="item"/>
          </div>
        </div>
      </div>
    </div>


  </div>

</template>


<script setup lang="ts">
import {useRouter} from "vue-router";
import SimpleServiceCard from "@/components/SimpleServiceCard.vue";
import RoutingPath from "@/router/routing_path";
import {onMounted, ref} from "vue";
import empty from '@/assets/images/empty.svg';
import radial from '@/assets/images/radial.svg';
import logo from '@/assets/images/logo_dark.svg';
import showServices from "@/services/show-services";

const router = useRouter();
const isLoading = ref(true);
const authorized = false;
let services = showServices.getRef();


onMounted(async () => {
  services = await showServices.getAllServices();
  console.log(services);
  isLoading.value = false;
});


</script>
<style scoped>
</style>