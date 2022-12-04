<template>
  <v-card
      elevation="3" @click="flipped=!flipped"
      outlined
  >
    <div class="bg-blue-700 rounded-lg py-8 px-8 fill-height">
      <div class="h-1/2">
        <v-card-title v-if="!flipped" class="text-2xl text-center font-medium">{{ service.name }}</v-card-title>
        <v-card-subtitle v-if="flipped" class="text-lg font-medium text-white/60">{{
            service.description
          }}
        </v-card-subtitle>
        <br>
      </div>
      <div  class=":hover-spin">
        <v-card-actions  >
          <v-btn size="small" variant="tonal"
                 @click="router.push(`${RoutingPath.MODIFY_AUTH_PAGE}/${props.service._id}`)">
            {{authorization? 'Permission': 'Authorized'}}
          </v-btn>

          <v-btn size="small" variant="tonal" >
            Explore
          </v-btn>
        </v-card-actions>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type SimpleServiceModel from '@/model/simple_service_model';
import {defineProps, ref} from 'vue';

const props = defineProps<{
  service: SimpleServiceModel;
  authorization : boolean;
}>();
import {useRouter} from "vue-router";
import RoutingPath from "@/router/routing_path";

const router = useRouter();
const flipped = ref(false);


</script>

<style scoped>

</style>