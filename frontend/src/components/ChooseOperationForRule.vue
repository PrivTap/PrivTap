<template>
  <div class="py-16">
    <h1 class="text-5xl text-blue-100 font-medium text-center py-5">Choose {{ props.operation }}</h1>
    <div class="flex flex-col items-center justify-center place-self-center relative">
      <div class=" px-5 grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <div v-for="operation in operations" class="bg-blue-700/40 rounded-lg py-8 px-8 shadow-lg">
          <p class="text-2xl font-medium"> {{ operation.name }} </p>
          <p class="text-lg font-medium text-white/60"> {{ operation.description }} </p>
          <v-label class="pt-4 pb-2">Permissions</v-label>
          <div>
            <div v-if="!operation.permissions.length || !operation.permissions.some(p => p.associated)"> No permission
              required
            </div>
            <v-chip v-for="permission in operation.permissions.filter(p => p.associated)" :key="permission._id"
                    class="mr-2" variant="outlined">
              {{ permission.name }}
            </v-chip>
            <v-btn class="ma-2" variant="outlined" color="text-blue-100"
                   @click="chooseThisOperation(operation._id, operation.name)">
              choose
            </v-btn>
          </div>
          <div class="flex justify-start mt-5 space-x-5">
          </div>
        </div>
      </div>
      <div v-if="!operations.length" class="justify-items-center">
        <p class="py-16">This service has not published any {{ props.operation }} or there aren't enough authorization.
          {{ !lookingForTriggers ? "Actions also maybe incompatible with the selected trigger" : "" }}</p>
        <img :src=empty :alt="empty" class="max-w-xs max-h-xs mx-0 "/>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">


import empty from '@/assets/images/empty.svg';
import {useRoute} from 'vue-router';
import {computed, defineProps, inject, onMounted, ref} from 'vue';
import user_trigger from "@/controllers/user_trigger";
import user_action from "@/controllers/user_action";
import type TriggerModel from '@/model/trigger_model';
import type ActionModel from '@/model/action_model';


const operations = ref<TriggerModel[] | ActionModel[]>([]);
const props = defineProps<{
  serviceId: string;
  operation: "trigger" | "action";
  close: () => void;
}>();
const actions = user_action.getNewRef();
const lookingForTriggers = ref(computed(() => props.operation === "trigger"));

onMounted(async () => {
  if (lookingForTriggers.value)
    operations.value = await user_trigger.getAllTriggers(props.serviceId, true);
  else
    operations.value = await user_action.getAllActions(props.serviceId, true);
  //TODO Put the compatible actions
});
const setTriggerId = inject("setTriggerId") as (triggerId: string) => void;
const setTriggerName = inject("setTriggerName") as (triggerName: string) => void;
const setActionId = inject("setActionId") as (actionId: string) => void;
const setActionName = inject("setActionName") as (actionName: string) => void;

function chooseThisOperation(operationId: string, operationName: string) {
  if (lookingForTriggers.value) {
    setTriggerId(operationId);
    setTriggerName(operationName);
  } else {
    setActionId(operationId);
    setActionName(operationName);
  }
  props.close();
}

const route = useRoute();


</script>

<style>

</style>