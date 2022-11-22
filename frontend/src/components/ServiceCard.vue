<template>
  <div
    class="text-white rounded-xl shadow-xl hover:shadow-2xl p-10 bg-blue-600 h-80 min-w-80 bg-gradient-to-tr from-blue-600 to-blue-400 hover:-translate-y-6 hover:ring-4 ring-white hover:ring-offset-2 ring-offset-white transition ease-in-out duration-700"
  >
    <div class="flex-col justify-between">
      <div class="">
        <p class="text-2xl font-medium">
          Name: <label class="text-lg font-normal">{{ service.name }} </label>
        </p>
        <p class="text-2xl font-medium">
          Description:
          <label class="text-lg font-normal">{{ service.description }} </label>
        </p>
        <p class="text-2xl font-medium">
          Endpoint URL:
          <label class="text-lg font-normal">{{ service.description }} </label>
        </p>
        <p class="text-2xl font-medium">
          Client ID:
          <label class="text-lg font-normal">{{ service.clientId }} </label>
        </p>
        <p class="">
          Client Secret:
          <input
            type="password"
            disabled="true"
            class="text-black bg-transparent ml-5"
            value="service.clientSecret"
          />
        </p>
      </div>
      <div class="space-x-4 ">
        <button
          class="rounded-lg bg-blue-700 py-2 px-12 text-lg font-medium text-white hover:bg-blue-900"
        >
          Edit
        </button>
        <button
          class="rounded-lg bg-white py-2 px-9 text-lg font-medium text-red-500 hover:ring-red-500 hover:ring-4 ring-2 ring-red-500 duration-500"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type ServiceModel from "@/model/service_model";

defineProps<{
  service: ServiceModel;
}>();
</script>

<style scoped></style>
