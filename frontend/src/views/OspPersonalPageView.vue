<template>
  <div class="flex flex-col items-center justify-center relative h-full">
    <img :src="radial" class="w-1/2">
    <div class="absolute top-2 w-full h-5/6">
      <h1 class="text-5xl text-blue-100 text-center pb-12 font-medium">
        OSP Personal Page
      </h1>

      <div v-if="!services.length && !isLoading" class="flex flex-col justify-center items-center content-center ">
        <h1 class="text-3xl text-blue-100 text-center pt-8 font-medium">
          You have no services yet
        </h1>
        <h1 class="text-lg text-stone-400 text-center pt-4 pb-10 font-medium">
          Create a service by clicking the button below
        </h1>
        <img :src=empty class="h-72 ">
      </div>
      <div v-if="isLoading" class="flex flex-col justify-center items-center content-center ">
        <img :src="logo" class="h-32 my-20 animate-bounce">
      </div>

      <div class="flex flex-row justify-center py-10">
        <PrimaryButton :onClick="() => router.push(RoutingPath.PUBLISH_SERVICE_PAGE)" text="Create New API enpoint"
          class="min-w-fit" />
      </div>

      <div v-if="services?.length" class="py-10">
        <div class=" px-10 grid  lg:grid-cols-2 xl:grid-cols-3 gap-10">
          <ServiceCard v-for="(item, index) in services" :key="index" :service="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RoutingPath from "@/router/routing_path";
import ServiceCard from "@/components/ServiceComponents/ServiceCard.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { ManageService } from "@/services/manage_service";
import empty from '@/assets/images/empty.svg';
import radial from '@/assets/images/radial.svg';
import logo from '@/assets/images/logo_dark.svg';
const router = useRouter();
const isLoading = ref(true);
const manageService = ManageService.getInstance;
const services = manageService.services;


onMounted(async () => {
  console.log("here");
  await manageService.getAllServices();
  isLoading.value = false;
});

</script>

<style scoped>

</style>
