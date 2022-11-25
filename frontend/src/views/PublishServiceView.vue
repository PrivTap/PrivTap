<template>
  <div class="text-center h-screen">
    <h1 class="text-5xl text-blue-100 font-medium py-20">
      {{ route.params.id ? "Edit" : "Publish" }} Service
    </h1>
    <form @submit.prevent="onSubmitted">
      <div class="mb-6 mx-auto w-96">
        <label for="text" class="block mb-2 text-sm font-semibold text-white dark:text-gray-300">Name</label>
        <input type="text" id="text"
          class="border-2 border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="..." v-model="newService.name" required />
      </div>

      <div class="mb-6 mx-auto w-96">
        <label for="text" class="block mb-2 text-sm font-semibold text-white dark:text-gray-300"
          required>Description</label>
        <input type="text" id="text"
          class="border-2 border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="..." v-model="newService.description" required />
      </div>

      <div class="mb-6 mx-auto w-96">
        <label for="text" class="block mb-2 text-sm font-semibold text-white dark:text-gray-300">Endpoint Url</label>
        <input type="text" id="text"
          class="border-2 border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="http://example.com:8080" v-model="newService.authServer" required />
        <div v-show="!isValidUrl" class="animate-fade-in mt-2">
          <span :class="{
            'text-green-400': isValidUrl,
            'text-red-200': !isValidUrl,
          }" class="font-medium text-sm ml-3" v-text="isValidUrl ? '' : 'Insert a valid url'"></span>
        </div>
      </div>

      <div class="mb-6 mx-auto w-96">
        <label type="url" class="block mb-2 text-sm font-semibold text-white dark:text-gray-300">Client ID</label>
        <input type="text" id="text"
          class="border-2 border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="..." v-model="newService.clientId" required />
      </div>

      <div class="mb-6 mx-auto w-96">
        <label type="url" class="block mb-2 text-sm font-semibold text-white dark:text-gray-300">Client Secret</label>
        <input type="text" id="text"
          class="border-2 border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="..." v-model="newService.clientSecret" required />
      </div>
      <PrimaryButton class="mt-5" :text="route.params.id ? 'Edit API endpoint' : 'Create API endpoint'" />
    </form>
  </div>
</template>
>

<script setup lang="ts">
// import { useOspServiceStore } from "@/stores/osp_service_store";
import { onMounted, ref, watch } from "vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { useRoute } from "vue-router";
import { ManageService } from "@/services/manage_service";
import router from "@/router/router";
import RoutingPath from "@/router/routing_path";

const route = useRoute();
const isValidUrl = ref<boolean>(true);
const isLoading = ref<boolean>(false);
const manageService = ManageService.getInstance()
let newService = ref({
  name: "",
  description: "",
  authServer: "",
  clientId: "",
  clientSecret: "",
});

async function checkEdit() {
  if (route.params.id) {
    /// Means that we are editing a service
    let serviceToEdit = await manageService.getServiceById(route.params.id as string);
    if (serviceToEdit) {
      newService.value = {
        name: serviceToEdit.name,
        description: serviceToEdit.description,
        authServer: serviceToEdit.authServer,
        clientId: serviceToEdit.clientId,
        clientSecret: serviceToEdit.clientSecret,
      };
    }
  }
}

onMounted(async () => {
  await checkEdit();
});

watch(
  () => newService.value.authServer,
  (newValue) => {
    !newValue.length
      ? (isValidUrl.value = true)
      : (isValidUrl.value = checkUrl(newValue));
  }
);

/// function that check if a string is a valid url
function checkUrl(url: string): boolean {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    url
  );
}

async function onSubmitted() {
  isLoading.value = true;
  if (route.params.id) {
    const serviceId = route.params.id as string;
    console.log("Editing service with id: ", serviceId);
    await manageService.updateService(
      serviceId,
      newService.value.name,
      newService.value.description,
      newService.value.authServer,
      newService.value.clientId,
      newService.value.clientSecret
    )
    isLoading.value = false;
  }else{
    await manageService.createService(
      newService.value.name,
      newService.value.description,
      newService.value.authServer,
      newService.value.clientId,
      newService.value.clientSecret
    );
    isLoading.value = false;
  }
  return router.replace(RoutingPath.OSP_PERSONAL_PAGE);
}
</script>

<style scoped>

</style>
