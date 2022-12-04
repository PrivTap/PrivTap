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
import SimplePermissionModel from "@/model/simple_permission_model";
import radial from "@/assets/images/radial.svg"

const route = useRoute();

let permission = ref<SimplePermissionModel[]>();
const serviceName = ref("service");
const arrayAuthorized = ref<String[]>([]);
const authorizationChanged = ref(false);

function print() {
  console.log(arrayAuthorized.value)
}

onMounted(async () => {
  await checkEdit();
  permission.value?.forEach(function (permission) {
    if (permission.authorized) {
      arrayAuthorized.value?.push(permission._id);
    }
  })
})

async function checkEdit() {
  const serviceId = route.params.id
  if (serviceId)
    if (route.params.id) {
      /// Means that we are editing a service
      permission.value = [{
        _id: "id1",
        name: "permission1",
        description: "This permission will use a",
        authorized: true
      },
        {
          _id: "id2",
          name: "permission2",
          description: "This permission will use b",
          authorized: false
        },] //await getPermission({params:serviceId});
    }
}
</script>

  