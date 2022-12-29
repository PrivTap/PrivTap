<template>

  <div class="h-full">
    <h2 class="text-5xl text-blue-100 font-medium text-center py-5"> Create Your Own Rule</h2>

    <div class="flex-col items-center flex py-16">
      <div class="text-center items-center flex space-x-4 ring-4 py-4 px-16 rounded-xl ring-blue-800">
        <div class="items-center text-5xl font-semibold"> If This
        </div>
        <div v-if="ruleCreation.triggerName !== ''">
          <v-chip class="ma-2" color="success" size="x-large" label text-color="white" closable
            @click:close="ruleCreation.triggerName = ''">
            {{ ruleCreation.triggerName }}
          </v-chip>
        </div>
        <div v-else>
          <v-chip class="ma-2 opacity-70" color="success" size="x-large" label text-color="white" @click="onChipTap">
            select a trigger
          </v-chip>
        </div>
      </div>
      <div class="w-1 h-10 bg-blue-800 rounded-full" v-bind:class="{
        'opacity-30': ruleCreation.triggerName === '',
      }"></div>
      <div class=" text-center items-center flex space-x-4 py-4 px-8 rounded-xl ring-4 ring-blue-800" v-bind:class="{
        'opacity-30': ruleCreation.triggerName === '',
      }">
        <div class="items-center text-5xl font-semibold"> Then That
        </div>
        <div v-if="ruleCreation.actionName !== ''">
          <v-chip class="ma-2 " color="info" size="x-large" label text-color="white" closable
            @click:close="ruleCreation.actionName = ''">
            {{ ruleCreation.actionName }}
          </v-chip>
        </div>
        <div v-else>
          <v-chip class="ma-2 opacity-70" color="info" size="x-large" label text-color="white" @click="onChipTap">
            select an action
          </v-chip>
        </div>
      </div>
    </div>
    <div v-if="ruleCreation.triggerName !== '' && ruleCreation.actionName !== ''"
      class="justify-items-center items-center content-center text-center pt-5 pb-20">
      <v-form ref="formRef" v-model="ruleCreation.valid" lazy-validation>
        <v-responsive class="mx-auto" max-width="344">
          <v-text-field :rules="nameRule" v-model="ruleCreation.name" label="Rule Name" variant="underlined" />
        </v-responsive>
        <v-btn @click="createRule()" color="#3662E3" size="large">
          <v-icon>mdi-plus</v-icon>
          Create Rule
        </v-btn>
      </v-form>
    </div>

    <h2 v-if="ruleCreation.actionName === '' || ruleCreation.triggerName === ''"
      class="text-3xl text-blue-100 font-medium text-center py-5 justify-center">Choose from which service you want to
      take the <strong v-bind:class="{
        'text-green-700': lookingForTriggers,
        'text-blue-500': !lookingForTriggers
      }"> {{ lookingForTriggers ? 'Trigger' : 'Action' }} </strong> </h2>

    <div ref="scrollTarget" class="text-center flex flex-col justify-center items-center content-center pb-10">
      <div class=" px-5 grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <ServiceCardRule v-for="item in services" :operation="lookingForTriggers ? 'trigger' : 'action'"
          :key="componentKey" :service="item" :authorization="authorized" />
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">


import ruleModel from "@/controllers/rules_controller"
import { onMounted, ref, provide, watch, reactive } from "vue";
import { useRoute } from 'vue-router';
import ServiceCardRule from '@/components/ServiceCardRule.vue';
import showServices from "@/controllers/show_services";
import router from "@/router/router";
import RuleModel from "@/model/rule_model";
import RoutingPath from "@/router/routing_path";

const route = useRoute();
const serviceId = route.params.id as string;
const scrollTarget = ref()
const formRef = ref();
const nameRule = [
  (v: string) => !!v || 'Name is required',
  (v: string) => (v && v.length <= 20) || 'Name must be less than 20 characters',
];
const ruleCreation = reactive({
  name: '',
  triggerName: '',
  triggerId: '',
  actionName: '',
  actionId: '',
  valid: true,
})

async function createRule() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  await ruleModel.createRule(ruleCreation.name, ruleCreation.triggerId, ruleCreation.actionId);
  await router.push(RoutingPath.PERSONAL_PAGE);
}

function onChipTap() {
  scrollTarget.value.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

provide("ruleCreation", ruleCreation.triggerId);
provide("setTriggerId", (id: string) => {
  ruleCreation.triggerId = id;
});
provide("setTriggerName", (name: string) => {
  ruleCreation.triggerName = name;
});

provide("setActionId", (id: string) => {
  ruleCreation.actionId = id;
});
provide("setActionName", (name: string) => {
  ruleCreation.actionName = name;
});
const services = showServices.getNewRef();
const componentKey = ref(0);
const authorized = ref(false);
const lookingForTriggers = ref(true);
watch(ruleCreation, (value) => {
  lookingForTriggers.value = value.triggerName === "";
});

const props = defineProps(
  {
    rule: {
      type: RuleModel,
      required: false,
      default: null
    },
  }
);


onMounted(async () => {
  services.value = await showServices.getAllServices(true);
  ruleCreation.triggerName = '';
  ruleCreation.actionName = '';
  ruleCreation.triggerId = '';
  ruleCreation.actionId = '';
});


</script>


<style scoped>

</style>