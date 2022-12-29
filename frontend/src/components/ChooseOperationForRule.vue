<template>
  <div class="py-16">
    <h1 class="text-5xl text-blue-100 font-medium text-center py-5">Choose <strong v-bind:class="{
        'text-green-700': lookingForTriggers,
        'text-blue-500': !lookingForTriggers
      }"> {{ lookingForTriggers ? 'Trigger' : 'Action' }} </strong></h1>
    <div v-if="props.operation==='action'" class="text-center py-4">
      If you can't find the <strong class="text-blue-500">action</strong> you want, it may be not compatible with your
      selected <strong class="text-green-500">trigger </strong>. Try to select another one!
    </div>
    <div class="flex flex-col items-center justify-center place-self-center relative">
      <div class=" px-5 grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <div v-for="operation in operations"
             v-bind:class="{ 'bg-blue-700/40': !operation.authorized, 'bg-blue-800': operation.authorized}"
             class=" rounded-lg py-8 px-6 shadow-lg">
          <div v-bind:class="{'opacity-30': !operation.authorized}">
            <p class="text-2xl font-medium"> {{ operation.name }} </p>
            <p class="text-lg font-medium text-white/60"> {{ operation.description }} </p>
            <v-label class="pt-4 pb-2">Permissions</v-label>
            <div v-if="!operation.permissions.length"> No permission
              required
            </div>
            <PermissionChip v-for="permission in operation.permissions" :permissionModel="permission"/>
            <v-btn class="ma-2" variant="outlined" color="text-blue-100" v-bind:disabled="!operation.authorized"
                   @click="chooseThisOperation(operation._id, operation.name)">
              choose
            </v-btn>
          </div>
          <div v-if="!operation.authorized">
            <div class="opacity-100 text-red-600">
              Grant more permissions to our platform in order to use {{ operation.name }}
            </div>
            <v-btn class="ma-2" variant="outlined"
                   @click="authorizeService()">
              Authorize
            </v-btn>
          </div>
          <div class="flex justify-start mt-5 space-x-5">
          </div>
        </div>

      </div>
      <div v-if="!operations.length" class="justify-items-center">
        <p class="py-16">This service has not published any
          {{ !lookingForTriggers ? "suitable" : "" }} {{ props.operation }}.</p>
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
import PermissionChip from './InformationChip.vue';
import {useRouter} from "vue-router";
import RoutingPath from "@/router/routing_path";

const router = useRouter();
const operations = ref<TriggerModel[] | ActionModel[]>([]);
const props = defineProps<{
  serviceId: string;
  operation: "trigger" | "action";
  close: () => void;
}>();
const actions = user_action.getNewRef();
const lookingForTriggers = ref(computed(() => props.operation === "trigger"));
const getTriggerId = inject("getTriggerId") as ()=>string;
onMounted(async () => {
  if (lookingForTriggers.value)
    operations.value = await user_trigger.getAllTriggers(props.serviceId, true);
  else
    operations.value = await user_action.getCompatibleActions(props.serviceId, getTriggerId(), true);
});
const setTriggerId = inject("setTriggerId") as (triggerId: string) => void;
const setTriggerName = inject("setTriggerName") as (triggerName: string) => void;
const setActionId = inject("setActionId") as (actionId: string) => void;
const setActionName = inject("setActionName") as (actionName: string) => void;

function authorizeService() {
  try {
    let url;
    url = RoutingPath.MODIFY_AUTH_PAGE + "/" + props.serviceId;
    router.push(url);
  } catch (e) {
    router.push(RoutingPath.SERVICES_PAGE);
  }
}

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