<template>
  <div class="h-full">
    <div class="text-center pt-10 mt-5 bg-slate-900/60 shadow-md">
      <v-avatar color="#172540" style="height: 80px; width: 80px;">
        <v-icon size="40px" color="info" icon="mdi-open-in-new" @click="redirectToService"></v-icon>
      </v-avatar>
      <p class="text-h3 font-weight-medium text-white mt-10 mb-4"> {{ service.name }} </p>
      <p class="text-h6 font-weight-regular text-white/60"> {{ service.description }} </p>
      <!-- TODO Define where this button should redirect, otherwhise remove it -->
      <v-btn variant="tonal" color="info" rounded size="x-large" class="my-10" @click="authorizeService"> AUTHORIZE
      </v-btn>
      <v-tabs fixed-tabs v-model="tabs
        ">
        <v-tab :value="1">
          Trigger
        </v-tab>
        <v-tab :value="2">
          Actions
        </v-tab>
      </v-tabs>
    </div>
    <v-window v-model="tabs">
      <v-window-item v-for="i in 2" :key="i" :value="i">
        <div v-if="i === 1" class="py-10 content-center flex items-center justify-center">
          <div v-if="isLoading">
            <v-progress-circular indeterminate color="info"></v-progress-circular>
          </div>
          <div v-else-if="!listOfTrigger.length"
            class="text-center flex flex-col justify-center items-center content-center ">
            <h1 class="text-3xl text-blue-100 pt-8 font-medium">
              This service has no trigger yet
            </h1>
            <h1 class="text-lg text-stone-400 pt-4 pb-10 font-medium">
              Wait until the service provider add some trigger
            </h1>
            <img :src=empty class="h-40 " :alt="empty">
          </div>
          <div v-else class="mx-10 grid lg:grid-cols-2 xl:grid-cols-3 gap-10 content-center">
            <div v-for="trigger in listOfTrigger"
              class="rounded-lg py-8 px-8 shadow-lg bg-blue-900/60 hover:bg-blue-900 duration-500">
              <v-card class="mx-auto" variant="text">
                <v-card-title>
                  <p class="text-h4 font-weight-medium"> {{ trigger.name }} </p>
                </v-card-title>
                <v-card-subtitle>
                  <p class="text-h7 font-weight-regular"> {{ trigger.description }} </p>
                </v-card-subtitle>
                <v-card-text>
                  <p class="text-h6 font-weight-regular"> Permission required: </p>
                  <PermissionChip v-for="permission in trigger.permissions" :permissionModel="permission">
                  </PermissionChip>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </div>
        <div v-if="i === 2" class="py-10 content-center flex items-center justify-center">
          <div v-if="isLoading">
            <v-progress-circular indeterminate color="info"></v-progress-circular>
          </div>
          <div v-else-if="!listOfAction.length"
            class="text-center flex flex-col justify-center items-center content-center ">
            <h1 class="text-3xl text-blue-100 pt-8 font-medium">
              This service has no action yet
            </h1>
            <h1 class="text-lg text-stone-400 pt-4 pb-10 font-medium">
              Wait until the service provider add some action
            </h1>
            <img :src=empty class="h-40 " alt="empty">
          </div>
          <div class="mx-10 grid lg:grid-cols-2 xl:grid-cols-3 gap-10 content-center">
            <div v-for="action in listOfAction"
              class="rounded-lg py-8 px-8 shadow-lg bg-indigo-900/60 hover:bg-indigo-900 duration-500">
              <v-card class="mx-auto" variant="text">
                <v-card-title>
                  <p class="text-h4 font-weight-medium"> {{ action.name }} </p>
                </v-card-title>
                <v-card-subtitle>
                  <p class="text-h7 font-weight-regular"> {{ action.description }} </p>
                </v-card-subtitle>
                <v-card-text>
                  <p class="text-h6 font-weight-regular"> Permission required: </p>
                  <PermissionChip v-for="permission in action.permissions" :permissionModel="permission">
                  </PermissionChip>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </div>
      </v-window-item>
    </v-window>


  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import empty from '@/assets/images/empty.svg';
import { useRoute } from 'vue-router';
import type SimpleServiceModel from '@/model/simple_service_model';
import show_services from "@/controllers/show_services";
import UserTrigger from "@/controllers/user_trigger";
import UserAction from "@/controllers/user_action";
import PermissionChip from '@/components/InformationChip.vue';
import { useRouter } from "vue-router";
import RoutingPath from "@/router/routing_path";

const router = useRouter();
const route = useRoute();
let serviceId = route.params.id as string;
let service = ref({} as SimpleServiceModel);
const tabs = ref(0);
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  const value = await show_services.getServiceById(serviceId, true);
  if (value === null) {
    router.back();
    return;
  }
  service.value = value;
  listOfTrigger.value = await UserTrigger.getAllTriggers(serviceId, true);
  listOfAction.value = await UserAction.getAllActions(serviceId, true);
  isLoading.value = false;
});

// const service = new ServiceModel("id", "GitHub Integration", "Description of what that service offers..", "creator", "http://github.com", "authPath", "tokenPath", "clientId", "clientSecret");
function redirectToService() {
  if (service.value?.baseUrl != null) {
    window.open(service.value.baseUrl, '_blank');
  }
}

function authorizeService() {
  try {
    let url;
    url = RoutingPath.MODIFY_AUTH_PAGE + "/" + service?.value._id;
    router.push(url);
  } catch (e) {
    router.push(RoutingPath.SERVICES_PAGE);
  }
}

let listOfTrigger = UserTrigger.getNewRef();
let listOfAction = UserAction.getNewRef();

</script>
