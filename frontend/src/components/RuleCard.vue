<template>
  <div class="bg-violet-900/20 rounded-lg py-8 px-8 shadow-lg">

    <h3 class="text-2xl font-medium"> {{ rule.name }} </h3>

    <v-label class="pt-4 pb-2"> Trigger</v-label>
    <div>
      <PermissionChip :permission-model="{_id:trigger._id, description: trigger.description, name:trigger.name}"/>
    </div>

    <v-label class="pt-4 pb-2"> Action</v-label>


    <div>
      <PermissionChip :permission-model="{_id:action._id, description: action.description, name:action.name}"/>
    </div>

    <div class="flex justify-center">

      <v-btn class="ma-2" color="error" size="small" variant="flat" @click="showModal = true">
        <v-icon start icon="mdi-delete"></v-icon>
        Delete
      </v-btn>
    </div>


    <div class="flex justify-start mt-5 space-x-5">


    </div>

  </div>


  <div v-if="showModal">
    <ModalComponent title="Are you sure?" subTitle="You are deleting the rule permanently"
                    :onPressed="onModalClose"/>
  </div>

</template>


<script setup lang="ts">
import {defineProps, ref} from 'vue';
import rules_controller from '@/controllers/rules_controller';
import {useRouter} from "vue-router";
import type RuleModel from '@/model/rule_model';
import ModalComponent from './ModalComponent.vue';
import PermissionChip from './InformationChip.vue';
import type TriggerModel from "@/model/trigger_model";
import type ActionModel from "@/model/action_model";

const showModal = ref(false);

const router = useRouter();


const props = defineProps<{
  rule: RuleModel;

}>();
const trigger = props.rule.triggerId as Partial<TriggerModel>;
const action = props.rule.actionId as Partial<ActionModel>;

function onModalClose(res: boolean | null) {
  showModal.value = false;
  if (res) {
    rules_controller.deleteRule(props.rule._id);
  }
}


</script>

<style scoped>

</style>