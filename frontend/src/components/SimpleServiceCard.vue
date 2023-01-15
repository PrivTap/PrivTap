<template>
  <div class=" hover:shadow-2xl hover:-translate-y-6 transition ease-in-out duration-700">
    <v-card
        elevation="3" @click="flipped=!flipped"
        outlined class="h-full"
    >
      <div class="rounded-lg py-8 px-8 bg-blue-700 fill-height ">
        <div class="h-1/2">
          <v-card-title v-if="!flipped" class="text-2xl text-center font-medium">{{ service.name }}</v-card-title>
          <v-card-subtitle v-if="flipped" class="text-lg font-medium text-white/60">{{ service.description }}
          </v-card-subtitle>
          <br>
        </div>
        <div class=":hover-spin">
          <v-card-actions>
            <v-btn size="small" variant="tonal"
                   @click="router.push(`${RoutingPath.MODIFY_AUTH_PAGE}/${props.service._id}`)">
              {{ authorization ? 'Permission' : 'Authorize' }}
            </v-btn>

            <v-btn size="small" variant="tonal" @click="redirectToExplore">
              Explore
            </v-btn>
          </v-card-actions>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type SimpleServiceModel from '@/model/simple_service_model';
import {defineProps, ref} from 'vue';
import {useRouter} from "vue-router";
import RoutingPath from "@/router/routing_path";

const props = defineProps<{
  service: SimpleServiceModel;
  authorization: boolean;
}>();


const router = useRouter();
const flipped = ref(false);

function redirectToExplore() {
  router.push(`${RoutingPath.EXPLORE_SERVICE_PAGE}/${props.service._id}`)
}

</script>

<style scoped>

</style>