<template>
  <div
    class=" w-full flex flex-col justify-between h-[50vh] my-auto mx-auto min-w-md max-w-lg text-gray-200 rounded-xl shadow-xl hover:shadow-2xl p-10  bg-gradient-to-tr from-blue-600 to-blue-400 hover:-translate-y-6 hover:ring-4 ring-white hover:ring-offset-2 ring-offset-white transition ease-in-out duration-700">
    <div>

      <p class="text-3xl font-medium">{{ service.name }}</p>


      <p class="text-base font-normal text-slate-800 mb-8">
        {{ service.description }} lorem ispus ipsus lorem...
      </p>

      <p class="text-xl font-medium">
        Endpoint URL:
        <label class="text-lg font-normal">{{ service.authServer }} </label>
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


    </div>
    <hr class="border-[1] border-white rounded-full " />

    <!-- BUTTONS -->
    <div class="flex justify-between w-full">
     
      <button class="flex items-center rounded-lg bg-blue-700 py-2 px-12 text-lg font-medium text-white hover:bg-blue-900" @click="edit">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
        Edit
      </button>
      
      <button
        class="inline-flex items-center px-10 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
        @click="showModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
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
import { ManageService } from "@/services/manage_service";

const showPass = ref(false);
const showModal = ref(false);
const manageService = ManageService.getInstance();

function edit() {
  router.replace(`${RoutingPath.PUBLISH_SERVICE_PAGE}/${props.service._id}`);
}

function onModalClose(res: boolean | null) {
  showModal.value = false;
  if (res) {
    manageService.deleteService(props.service._id);
  }
}

const props = defineProps<{
  service: ServiceModel;
}>();
</script>

<style scoped>

</style>
