<template>

  <div class="h-full">
    <h2 class="text-5xl text-blue-100 font-medium text-center py-5"> Create Your Own Rule</h2>
    <!--    <v-form ref="formRef" v-model="form.valid">-->
    <!--      <v-container>-->
    <!--        <v-row>-->
    <!--          <v-col cols="12" md="4">-->
    <!--            <v-text-field v-model="form.name" :rules="form.nameRule" label="Name" required></v-text-field>-->
    <!--          </v-col>-->
    <!--        </v-row>-->
    <!--      </v-container>-->
    <!--    </v-form>-->
    <h2 class="text-3xl text-blue-100 font-medium text-center py-5"> Choose from which service you want to take the
      {{ lookingForTriggers ? 'trigger' : 'action' }}</h2>
    <div class="flex justify-md-space-around text-center py-5" v-if="ruleCreation.triggerName.length!==0">
      <span>SelectedTrigger:</span>
      <span> {{ ruleCreation.triggerName }}</span>
      <v-btn @click="ruleCreation.triggerName=''">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
    <div class="flex justify-md-space-around text-center py-5" v-if="ruleCreation.actionName.length!==0">
      <div><span>SelectedAction:</span></div>
      <div><span> {{ ruleCreation.actionName }}</span></div>
    </div>
    <div v-if="ruleCreation.triggerName!=='' && ruleCreation.actionName!==''"
         class="flex justify-md-space-around text-center py-5">
      <v-text-field v-model="ruleCreation.name" required >
      </v-text-field>
      <v-btn @click="createRule()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div class="text-center flex flex-col justify-center items-center content-center ">
      <div class=" px-5 grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
        <ServiceCardRule v-for="item in services" :operation="lookingForTriggers? 'trigger': 'action'"
                         :key="componentKey" :service="item"
                         :authorization="authorized"/>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">


import ruleModel from "@/controllers/rules_controller"
import {onMounted, ref, provide, watch, reactive} from "vue";
import {useRoute} from 'vue-router';
import ServiceCardRule from '@/components/ServiceCardRule.vue';
import showServices from "@/controllers/show_services";
import router from "@/router/router";
import RuleModel from "@/model/rule_model";
import RoutingPath from "@/router/routing_path";

const route = useRoute();
const serviceId = route.params.id as string;
const ruleCreation = reactive({
  name: '',
  triggerName: '',
  triggerId: '',
  actionName: '',
  actionId: '',
  ruleName: [
    (v: string) => !!v || 'Name is required',
    (v: string) => (v && v.length <= 20) || 'Name must be less than 20 characters',
  ],
})

function createRule() {
  ruleModel.createRule(ruleCreation.name, ruleCreation.triggerId, ruleCreation.actionId);
  router.push(RoutingPath.PERSONAL_PAGE);
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