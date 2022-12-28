<template>
  <div class=" h-full">
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
      <PrimaryButton :onClick="() => router.push(RoutingPath.PUBLISH_SERVICE_PAGE)" text="Create New Service"
        class="min-w-fit" />
    </div>

    <div v-if="services?.length && !isLoading" class="py-10">
      <div class=" px-10 grid  lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <ServiceCard v-for="(item, index) in services" :key="index" :service="item" />
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
import empty from '@/assets/images/empty.svg';
import logo from '@/assets/images/logo_dark.svg';
import manage_service from "@/controllers/manage_service";

const router = useRouter();
const isLoading = ref(true);
const services = manage_service.getRef();


onMounted(async () => {
  isLoading.value = true;
  await manage_service.getAllServices();
  isLoading.value = false;
});

</script>

<style scoped>

</style>
