<template>
  <!-- <div class="w-full flex flex-col justify-between h-[50vh] my-auto mx-auto min-w-md max-w-lg text-gray-200 rounded-lg shadow-lg hover:shadow-2xl p-10  bg-gradient-to-tr from-blue-600 to-blue-400 hover:-translate-y-6 hover:ring-4 transition ease-in-out duration-700"> -->
  <v-card variant="tonal" color="#4E80EE" rounded="lg">
    <div class="p-4">
      <v-card-title>
        <p class="text-3xl font-medium text-white">{{ service.name }}</p>
      </v-card-title>
      <v-card-subtitle>
        <p class="text-lg font-medium text-white/80">{{ service.description }}</p>
      </v-card-subtitle>
      <v-card-text>
        <p class="text-xl font-medium ">
          Base Url:
          <label class="text-lg font-normal text-white">{{ service.baseUrl }} </label>
        </p>
        <p v-if="service.authPath" class="text-xl font-medium my-2">
          Auth Path:
          <label class="text-lg font-normal text-white">{{ service.authPath }} </label>
        </p>
        <p v-if="service.tokenPath" class="text-xl font-medium my-2">
          Token Path:
          <label class="text-lg font-normal text-white">{{ service.tokenPath }} </label>
        </p>
        <p class="text-xl font-medium my-2">
          Client ID:
          <label class="text-lg font-normal text-white">{{ service.clientId }} </label>
        </p>
        <v-text-field @click:append="showPass = !showPass" :type="showPass ? 'text' : 'password'"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" variant="plain" label="Client Secret" readonly
          v-model="service.clientSecret">
        </v-text-field>
        <v-text-field @click:append="show1 = !show1" :type="show1 ? 'text' : 'password'"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" variant="plain" label="ApiKey" readonly
          v-model="service.apiKey">
        </v-text-field>
        <p v-if="service.triggerNotificationServer" class="text-xl font-medium mb-4">
          Trigger Notification Server:
          <label class="text-lg font-normal text-white">{{ service.triggerNotificationServer }} </label>
        </p>
        <div class="pt-4 space-x-2">
          <v-btn size="small" variant="flat" color="primary"
            @click="router.push(`${RoutingPath.SERVICE_PERMISSION_PAGE}/${props.service._id}`)">
            Permission
          </v-btn>
          <v-btn color="green" size="small" variant="flat"
            @click="router.push(`${RoutingPath.SERVICE_TRIGGER_PAGE}/${props.service._id}`)">
            Triggers
          </v-btn>
          <v-btn color="indigo" size="small" variant="flat"
            @click="router.push(`${RoutingPath.SERVICE_ACTION_PAGE}/${props.service._id}`)">
            Actions
          </v-btn>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn class="ma-2" color="blue" size="large" variant="flat" @click="edit">
          <v-icon start icon="mdi-pen"></v-icon>
          Edit
        </v-btn>
        <v-btn class="ma-2" color="error" size="large" variant="flat" @click="showModal = true">
          <v-icon start icon="mdi-delete"></v-icon>
          Delete
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
  <div v-if="showModal">
    <ModalComponent title="Are you sure?" subTitle="You are deleting the service permanently"
      :onPressed="onModalClose" />
  </div>

</template>

<script setup lang="ts">
import type ServiceModel from "@/model/service_model";
import { ref } from "vue";
import { EyeSlashIcon, EyeIcon } from "@heroicons/vue/24/solid";
import ModalComponent from "@/components/ModalComponent.vue";
import router from "@/router/router";
import RoutingPath from "@/router/routing_path";
import manage_service from "@/controllers/manage_service";
const props = defineProps<{
  service: ServiceModel;
}>();


const show1 = ref(false);

const showPass = ref(false);
const showModal = ref(false);

function edit() {
  router.replace(`${RoutingPath.PUBLISH_SERVICE_PAGE}/${props.service._id}`);
}

function onModalClose(res: boolean | null) {
  showModal.value = false;
  if (res) {
    manage_service.deleteService(props.service._id);
  }
}


</script>

<style scoped>

</style>
