<template>
  <div class=" hover:shadow-2xl hover:-translate-y-2.5 transition ease-in-out duration-700">
    <v-card
        elevation="3"
        outlined class="h-full"
    >
      <div class="rounded-lg py-8 px-8 bg-blue-700 fill-height">
        <div class="h-1/2">
          <v-card-title class="text-2xl text-center font-medium">{{ service.name }}</v-card-title>
          <br>
        </div>
        <div class="use margin:auto">
          <v-btn @click="chooseOperation=true" btn class="ma-2" variant="outlined" color="text-blue-100">
            Choose
          </v-btn>
          <v-dialog v-model="chooseOperation" transition="dialog-top-transition" scrollable>
            <v-card>
              <ChooseOperationForRule :serviceId="service._id" :operation="props.operation" :close="onClose"/>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type SimpleServiceModel from '@/model/simple_service_model';
import {defineProps, ref} from 'vue';
import {useRouter} from "vue-router";
import ChooseOperationForRule from "@/components/ChooseOperationForRule.vue";

const chooseOperation = ref(false);
const props = defineProps<{
  service: SimpleServiceModel;
  authorization: boolean;
  operation: "trigger" | "action";
}>();

function onClose() {
  chooseOperation.value = false;
}

const router = useRouter();


</script>
<style scoped>

</style>