<template>
  <div>
    <h1 class="text-5xl text-blue-100 text-center py-16 font-medium">
      OSP Personal Page
    </h1>

    <div class="flex flex-row justify-center py-10 space-x-32">
      <PrimaryButton :onClick="() => router.push(RoutingPath.PUBLISH_SERVICE_PAGE)" text="Create New API enpoint" />
    </div>

    <div v-if="services?.length" class="py-10">
      <div class=" px-10 grid  lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <ServiceCard v-for="(item, index) in services" :key="index" :service="item" />

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOspServiceStore } from "../stores/osp_service_store";
import { onMounted, ref } from "vue";
// import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import RoutingPath from "@/router/routing_path";
import ServiceCard from "@/components/ServiceCard.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import type ServiceModel from "@/model/service_model";
const router = useRouter();

const services = ref<ServiceModel[]>([])

onMounted(async () => {
  await useOspServiceStore().getServices();
  services.value = useOspServiceStore().services
});

// const ospServiceStore = useOspServiceStore();
// // const storeRef = storeToRefs(ospServiceStore);


// onMounted(async () => {
//   services.value = ospServiceStore.services;
//   // setTimeout(async () => {
//   //   await ospServiceStore.getServices();
//   // }, 1000);

// });
</script>

<style scoped>

</style>
