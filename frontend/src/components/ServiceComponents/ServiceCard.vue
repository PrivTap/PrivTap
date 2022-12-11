<template>
  <div
    class=" w-full flex flex-col justify-between h-[50vh] my-auto mx-auto min-w-md max-w-lg rounded-lg shadow-lg hover:shadow-2xl p-10  bg-gradient-to-tr from-blue-600 to-blue-400 hover:-translate-y-6 hover:ring-4 transition ease-in-out duration-700">
    <div>

      <p class="text-3xl font-medium">{{ service.name }}</p>


      <p class="text-base font-normal text-slate-800 mb-8">
        {{ service.description }}
      </p>

      <p class="text-xl font-medium">
        Base Url:
        <label class="text-lg font-normal">{{ service.baseUrl }} </label>
      </p>
      <p class="text-xl font-medium my-2">
        Auth Path:
        <label class="text-lg font-normal">{{ service.authPath }} </label>
      </p>
      <p class="text-xl font-medium my-2">
        Token Path:
        <label class="text-lg font-normal">{{ service.tokenPath }} </label>
      </p>
      <p class="text-xl font-medium my-2">
        Client ID:
        <label class="text-lg font-normal">{{ service.clientId }} </label>
      </p>

      <div class="flex content-center items-center text-2xl space-x-6 font-medium">
        <p class="text-xl font-normal">Client Secret:</p>
        <div
          class="flex relative justify-between bg-transparent items-center rounded-md border border-white px-3 py-2 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-base">
          <input id="clientSecret" name="clientSecret" :type="showPass ? 'text' : 'password'"
            v-model="service.clientSecret" class="bg-transparent outline-none placeholder-white h-full w-full"
            placeholder="Client Secret" disabled="true" />

          <button @click.prevent="showPass = !showPass" class="absolute right-7 top-2">
            <EyeSlashIcon :class="showPass ? 'opacity-0' : 'opacity-100'" class="w-5 absolute duration-1000 fill-white">
            </EyeSlashIcon>
            <EyeIcon :class="!showPass ? 'opacity-0' : 'opacity-100'" class="w-5 absolute duration-1000 fill-white">
            </EyeIcon>
          </button>
        </div>
      </div>
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

    </div>
    <hr class="border-white/50 rounded-full " />

    <div class="flex justify-between w-full">
      <v-btn class="ma-2" color="blue" size="large" variant="flat" @click="edit">
        <v-icon start icon="mdi-pen"></v-icon>
        Edit
      </v-btn>
      <v-btn class="ma-2" color="error" size="large" variant="flat" @click="showModal = true">
        <v-icon start icon="mdi-delete"></v-icon>
        Cancel
      </v-btn>
    </div>
  </div>
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
