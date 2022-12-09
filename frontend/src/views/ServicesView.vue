<template>

  <div class="h-full">
    <h1 class="text-5xl text-blue-100 font-medium text-center py-5">Services</h1>
    <v-container class="align-center my-0 py-16 w-1/2">
      <v-row class="justify-space-around ">
        <v-col cols="auto" class="relative ">
          <form class=" flex">
            <label for="simple-search" class="sr-only ">Search</label>
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
        </v-col>
        <v-col cols="auto" class="relative">
          <v-switch :label="'Show Authorized'" v-model="authorized" inset @change="switchAuthorization"
                    color="blue" class="flex d-inline-block " density="compact">
            <v-selection-control/>
          </v-switch>
        </v-col>
      </v-row>
    </v-container>


    <div class="flex flex-col items-center justify-center relative">
      <img :src="radial" class="w-1/2">
      <div class=" absolute top-2 w-half h-5/6">
        <div v-if="isLoading" class="flex flex-col justify-center items-center content-center ">
          <img :src="logo" class="h-32 my-20 animate-bounce">
          Loading
        </div>

        <div v-if="!services.length && !isLoading" class="flex flex-col justify-center items-center content-center ">
          <h1 class="text-3xl text-blue-100 text-center pt-8 py-10 font-medium">
            {{ authorized ? "You didn't authorize any services yet" : 'Unfortunately there are no services yet' }}
          </h1>
          <img :src=empty class="h-72 ">
        </div>
        <div v-if="services?.length" class="py-10">
          <div class=" px-10 grid  lg:grid-cols-2 xl:grid-cols-3 gap-10">
            <SimpleServiceCard v-for="item in services" :key="componentKey" :service="item"
                               :authorization="authorized"/>
          </div>
        </div>
      </div>
    </div>


  </div>

</template>


<script setup lang="ts">
import {useRouter} from "vue-router";
import SimpleServiceCard from "@/components/SimpleServiceCard.vue";
import {onMounted, ref} from "vue";
import empty from '@/assets/images/empty1.svg';
import radial from '@/assets/images/radial.svg';
import logo from '@/assets/images/logo_dark.svg';
import showServices from "@/controllers/show-services";
import type SimpleServiceModel from "@/model/simple_service_model";

const router = useRouter();
const isLoading = ref(true);
const authorized = ref(false);
const services = showServices.getRef();
let serviceAuthorized: SimpleServiceModel[] | null = null;
let serviceUnauthorized: SimpleServiceModel[] | null = null;


onMounted(async () => {
  await showServices.getAllServices();
  serviceUnauthorized = services.value;
  isLoading.value = false;
});

//this function is called after the user switch from authorized to unauthorized or viceversa-> it's called after the value change. Also it caches the services
async function switchAuthorization() {
  console.log(authorized.value);
  if (authorized.value) {
    if (serviceAuthorized == null) {
      isLoading.value = true;
      await showServices.getAuthorizedServices();
      serviceAuthorized = services.value;
      isLoading.value = false;
    }
    services.value = serviceAuthorized;

  } else {
    if (serviceUnauthorized == null) {
      isLoading.value = true;
      await showServices.getAllServices();
      serviceUnauthorized = services.value;
      isLoading.value = false;
    }
    services.value = serviceUnauthorized;
  }
}

const componentKey = ref(0);


</script>
<style scoped>
</style>