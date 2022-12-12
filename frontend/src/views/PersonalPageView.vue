

       
        
<template>
        
        <v-dialog v-model="dialog" class="flex flex-col justify-center items-center center"> 
          <template v-slot:activator="{ props }">
          <div  v-bind:="props"
              class="ring-2 rounded-lg flex items-center justify-center bg-green-900/10 ring-pink-900 hover:ring-pink-700">
                  <v-btn color="pink"   elevation="0" variant="text">
                      Create New Rule
                  </v-btn>
          </div>

         </template>
      <CreateRule :userId="(route.params.id as string)" :onCancel="onClose" />



</v-dialog>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import CreateRule from '@/components/CreateRule.vue';
import { useRoute } from 'vue-router';

const dialog = ref(false);

const route = useRoute();



async function onClose(){
  dialog.value = false
}




</script>






<style scoped>

</style>