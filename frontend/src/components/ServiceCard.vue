<template>
  <div
    class="my-auto text-gray-200 rounded-xl shadow-xl hover:shadow-2xl p-10 bg-blue-600 bg-gradient-to-tr from-blue-600 to-blue-400 hover:-translate-y-6 hover:ring-4 ring-white hover:ring-offset-2 ring-offset-white transition ease-in-out duration-700"
  >
    <div class="flex justify-between">
      <p class="text-3xl font-medium">{{ service.name }}</p>
      <p class="text-4xl font-medium">
        {{ !editMode ? "🔒" : "🔓" }}
      </p>
    </div>

    <p class="text-base font-normal text-slate-800 mb-8">
      {{ service.description }} lorem ispus ipsus lorem...
    </p>

    <p class="text-xl font-medium">
      Endpoint URL:
      <label class="text-lg font-normal">{{ service.authServer }} </label>
    </p>
    <p class="text-xl font-medium">
      Client ID:
      <label class="text-lg font-normal">{{ service.clientId }} </label>
    </p>
    <div
      class="flex content-center items-center text-2xl space-x-6 font-medium"
    >
      <p class="text-xl font-normal">Client Secret:</p>
      <div
        class="flex relative justify-between bg-transparent items-center rounded-md border border-white px-3 py-2 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-base"
      >
        <input
          id="clientSecret"
          name="clientSecret"
          :type="showPass ? 'text' : 'password'"
          v-model="service.clientSecret"
          class="bg-transparent outline-none placeholder-white h-full w-full"
          placeholder="Client Secret"
          disabled="true"
        />

        <button
          @click.prevent="showPass = !showPass"
          class="absolute right-7 top-2"
        >
          <EyeSlashIcon
            :class="showPass ? 'opacity-0' : 'opacity-100'"
            class="w-5 absolute duration-1000 fill-white"
          ></EyeSlashIcon>
          <EyeIcon
            :class="!showPass ? 'opacity-0' : 'opacity-100'"
            class="w-5 absolute duration-1000 fill-white"
          ></EyeIcon>
        </button>
      </div>
    </div>
    <br />
    <!-- create horizontal divider -->
    <hr class="border-2 border-slate-700 rounded-full" />
    <br />
    <div class="space-x-4">
      <button
        class="rounded-lg bg-blue-700 py-2 px-12 text-lg font-medium text-white hover:bg-blue-900"
        @click="editMode = !editMode"
      >
        Edit ✍️
      </button>
      <button
        class="rounded-lg bg-white py-2 px-9 text-lg font-medium text-red-500 hover:ring-red-500 hover:ring-4 ring-2 ring-red-500 duration-500"
        @click="deleteService"
      >
        Delete 🗑️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type ServiceModel from "@/model/service_model";
import { ref } from "vue";
import { EyeSlashIcon, EyeIcon } from "@heroicons/vue/24/solid";
import { useOspServiceStore } from "@/stores/osp_service_store";

const ospServiceStore = useOspServiceStore();
const showPass = ref(false);
const editMode = ref(false);

const props = defineProps<{
  service: ServiceModel;
}>();

function deleteService() {
  ospServiceStore.deleteService(props.service._id);
}
</script>

<style scoped></style>
