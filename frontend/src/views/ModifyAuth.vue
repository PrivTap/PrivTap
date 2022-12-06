<template>
  <div>
    <h1 class="text-5xl text-blue-100 font-medium text-center py-5">Authorization Granted to {{ serviceName }}</h1>
    <div class="flex py-10 justify-center">
      <span class="text-2xl"> Decide which data you want <strong
          class="text-blue-500">PrivTap</strong> to have access.<br>
        Modifying authorizations will require you to connect with {{ serviceName }}<br>
        <strong class="text-red-500">Watch out!</strong> Revoking permission will cause some rule to not work</span>
    </div>
    <div v-if="permission.length">
      <div class="text-right relative right-1/3">
        <button :disabled="!authorizationChanged" @click="oAuthAuthorization"
                class=" rounded-lg bg-blue-800 py-5 px-10 hover:bg-blue-900 disabled:opacity-70 shadow-lg text-xl text-white  ">
          Authorize
        </button>
      </div>
      <div class="flex relative justify-center ">
        <img :src="radial" class="w-1/2">
        <table class="w-1/3 absolute top-20 table-fixed bg-transparent border-spacing-y-2">
          <thead class="border-b-md">
          <tr>
            <th class="text-left">
              <span class="text-3xl font-medium">Name</span>
            </th>
            <th class="text-right text-blue-400 ">
              <span class="text-3xl font-medium">Authorized</span>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in permission"
              :key="item.name"
              class="border-b p-12 h-20 align-top"
          >
            <td class="text-left"><span class="text-xl  font-weight-medium">{{ item.name }}</span></td>
            <td class="relative">
              <v-switch v-model="arrayAuthorized" inset color="green" v-bind:value="item._id"
                        class="absolute top-0 right-0"
                        density="comfortable" flat @change="onSwitch"
              ></v-switch>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else>
      <div class="flex flex-col justify-center items-center content-center ">
        <h1 class="text-3xl text-blue-100 text-center pt-8 py-10 font-medium">
          This services hasn't defined his permission yet
        </h1>
        <img :src=empty class="h-72 ">
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import radial from "@/assets/images/radial.svg"
import showPermissions from "@/services/show-permission";
import empty from '@/assets/images/empty1.svg';
import router from "@/router/router";
import RoutingPath from "@/router/routing_path";

const route = useRoute();

let permission = showPermissions.getRef();
const serviceName = ref("service");
const originalAuthorized: string[] = [];
const arrayAuthorized = ref<string[]>([]);
const authorizationChanged = ref(false);
const isLoading = ref(true);
const serviceId = route.params.id as string

onMounted(async () => {
  const code = route.query.code as string;
  const state = route.query.state as string;
  if (code != undefined && state != undefined) {
    await showPermissions.sendCodeOAuth(code, state);
    await router.replace(`${RoutingPath.MODIFY_AUTH_PAGE}/${serviceId}`)
  }

  await savePermissions();
})

function onSwitch() {
  authorizationChanged.value = JSON.stringify(originalAuthorized) != JSON.stringify(arrayAuthorized.value);
}

async function savePermissions() {
  if (route.params.id) {
    permission = await showPermissions.getAllPermissions(serviceId);
    isLoading.value = false;
  }
  permission.value?.forEach(function (p) {
    if (p.authorized) {
      originalAuthorized.push(p._id)
      arrayAuthorized.value?.push(p._id);
    }
  })
}

async function oAuthAuthorization() {
  await showPermissions.postOAuth(serviceId, arrayAuthorized.value)
}
</script>

  