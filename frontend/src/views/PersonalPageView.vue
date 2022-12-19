<template>


<v-dialog v-model="dialog" class="flex flex-col justify-center items-center center"> 
          <template v-slot:activator="{ props }">
          <div  v-bind:="props"
              class="ring-2 rounded-lg flex items-center justify-center bg-green-900/10 ring-pink-900 hover:ring-pink-700">
                  <v-btn color="pink"   elevation="0" variant="text" :onClick="() => router.push(RoutingPath.CREATE_RULE_PAGE)" >
                      Create New Rule
                  </v-btn>
          </div>

         </template>
 


</v-dialog> 
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router/router';
import RoutingPath from "@/router/routing_path";


const dialog = ref(false);

const route = useRoute();



async function onClose(){
  dialog.value = false
}


</script>

<style scoped>

</style>