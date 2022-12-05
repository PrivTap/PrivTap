<template>
  <div>
    <h1 class="text-5xl text-blue-100 font-medium text-center py-5">Authorization Granted to {{ serviceName }}</h1>
    <div class="flex py-10 justify-center">
      <span class="text-2xl"> Decide which data you want <strong
          class="text-blue-500">PrivTap</strong> to have access.<br>
        Modifying authorizations will require you to connect with {{ serviceName }}<br>
        <strong class="text-red-500">Watch out!</strong> Revoking permission will cause some rule to not work</span>
    </div>
    <div class="text-right relative right-1/3">
      <button v-bind:disabled="!authorizationChanged"
              class="rounded-lg bg-blue-800 py-5 px-10 hover:bg-blue-900 shadow-lg text-xl text-white  ">
        Authorize
      </button>
    </div>


    <div class="flex relative justify-center ">
      <img :src="radial" alt class="w-1/2">
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
                      density="comfortable" flat
            ></v-switch>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import radial from "@/assets/images/radial.svg"
import showPermissions from "@/services/show-permission";

const route = useRoute();

let permission = showPermissions.getRef();
const serviceName = ref("service");
const arrayAuthorized = ref<String[]>([]);
const authorizationChanged = ref(false);


onMounted(async () => {
  await getHttp();
  permission.value?.forEach(function (p) {
    if (p.authorized) {
      arrayAuthorized.value?.push(p._id);
    }
  })
  console.log(arrayAuthorized.value);
})

async function getHttp() {
  const serviceId = route.params.id as string
  if (serviceId)
    if (route.params.id) {
      /// Means that we are editing a service
      permission = await showPermissions.getAllPermissions(serviceId);
    }
}
</script>

  