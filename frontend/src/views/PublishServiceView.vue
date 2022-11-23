<template>
  <div class="text-center pb-20">
    <h1 class="text-5xl text-blue-100 font-medium py-20">Publish Service</h1>
    <form @click.prevent="onSubmitted">
      <div class="mb-6 mx-auto w-96">
        <label
          for="text"
          class="block mb-2 text-sm font-semibold text-white dark:text-gray-300"
          >Name</label
        >
        <input
          type="text"
          id="text"
          class="border-2 border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="..."
          v-model="newService.name"
          required="true"
        />
        <div v-show="!newService.name.length" class="animate-fade-in mt-2">
          <span class="font-medium text-sm ml-3 text-red-200">
            Please, provide a service name</span
          >
        </div>
      </div>

      <div class="mb-6 mx-auto w-96">
        <label
          for="text"
          class="block mb-2 text-sm font-semibold text-white dark:text-gray-300"
          required="true"
          >Description</label
        >
        <input
          type="text"
          id="text"
          class="border-2 border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="..."
          v-model="newService.description"
          required="true"
        />
        <div
          v-show="!newService.description.length"
          class="animate-fade-in mt-2"
        >
          <span class="font-medium text-sm ml-3 text-red-200">
            Please, provide a service description</span
          >
        </div>
      </div>

      <div class="mb-6 mx-auto w-96">
        <label
          for="text"
          class="block mb-2 text-sm font-semibold text-white dark:text-gray-300"
          >Endpoint Url</label
        >
        <input
          type="text"
          id="text"
          class="border-2 border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="http://example.com:8080"
          v-model="newService.authUrl"
          required="true"
        />
        <div v-show="!isValidUrl" class="animate-fade-in mt-2">
          <span
            :class="{
              'text-green-400': isValidUrl,
              'text-red-200': !isValidUrl,
            }"
            class="font-medium text-sm ml-3"
            v-text="isValidUrl ? '' : 'Insert a valid url'"
          ></span>
        </div>
      </div>

      <div class="mb-6 mx-auto w-96">
        <label
          type="url"
          class="block mb-2 text-sm font-semibold text-white dark:text-gray-300"
          >Client ID</label
        >
        <input
          type="text"
          id="text"
          class="border-2 border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="..."
          v-model="newService.clientID"
          required="true"
        />
        <div v-show="!newService.clientID.length" class="animate-fade-in mt-2">
          <span class="font-medium text-sm ml-3 text-red-200">
            Plese, provice a client ID</span
          >
        </div>
      </div>

      <div class="mb-6 mx-auto w-96">
        <label
          type="url"
          class="block mb-2 text-sm font-semibold text-white dark:text-gray-300"
          >Client Secret</label
        >
        <input
          type="text"
          id="text"
          class="border-2 border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
          placeholder="..."
          v-model="newService.clientSecret"
          required="true"
        />
        <div
          v-show="!newService.clientSecret.length"
          class="animate-fade-in mt-2"
        >
          <span class="font-medium text-sm ml-3 text-red-200">
            Please, provide a client secret</span
          >
        </div>
      </div>
      <PrimaryButton class="mt-5" text="Create API endpoint" />
    </form>
  </div>
</template>
>

<script setup lang="ts">
import { useOspServiceStore } from "@/stores/osp_service_store";
import { ref, watch } from "vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import router from "@/router/router";
import RoutingPath from "@/router/routing_path";
const newService = ref({
  name: "",
  description: "",
  authUrl: "",
  clientID: "",
  clientSecret: "",
});

const isValidUrl = ref<boolean>(false);

watch(newService.value, (_, newValue) => {
  isValidUrl.value = checkUrl(newValue.authUrl);
});

/// function that check if a string is a valid url
function checkUrl(url: string): boolean {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    url
  );
}

const manageServiceStore = useOspServiceStore();
async function onSubmitted() {
  const res = await manageServiceStore.addService(
    newService.value.name,
    newService.value.description,
    newService.value.authUrl,
    newService.value.clientID,
    newService.value.clientSecret
  );
  if (res) router.push(RoutingPath.OSP_PERSONAL_PAGE);
}
</script>

<style scoped></style>
