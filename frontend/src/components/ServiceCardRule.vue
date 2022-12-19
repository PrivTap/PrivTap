<template>
    <div class=" hover:shadow-2xl hover:-translate-y-2.5 transition ease-in-out duration-700">
    <v-card
        elevation="3" 
        outlined class="h-full"
    >
      <div class="rounded-lg py-8 px-8 bg-blue-700 fill-height">
        <div class="h-1/2">
          <v-card-title  class="text-2xl text-center font-medium">{{ service.name }}</v-card-title>
          <br>
        </div>
        
    
<div class="use margin:auto" >

  

          <v-btn  class="ma-2" variant="outlined" color="text-blue-100"  @click="router.push(`${RoutingPath.CHOOSE_TRIGGER_FOR_RULE}/${service._id}`) ">
Choose          </v-btn>
                                        
</div>
        
    </div>
    </v-card>
    </div>
  </template>
  
<script setup lang="ts">
import type SimpleServiceModel from '@/model/simple_service_model';
import {defineProps, ref} from 'vue';
import RoutingPath from "@/router/routing_path";
import {useRouter} from "vue-router";


 
 
const props = defineProps<{
  service: SimpleServiceModel;
  authorization : boolean;
}>();



const tabs = ref(0);
const router = useRouter();

 
const flipped = ref(false);


</script>

<style scoped>

</style>