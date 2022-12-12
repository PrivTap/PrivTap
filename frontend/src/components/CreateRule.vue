<template>

<v-card>
    <v-card-title>
            <h2 class="text-h5"> Add Rule </h2>
    </v-card-title>
<v-form ref="formRef" v-model="form.valid">
  <v-container>
    <v-row>
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="form.name"
          :rules="form.nameRule"
          label="Name"
          required
        ></v-text-field>
      </v-col>
  </v-row>
 

    <!--to-->




          

    <!--e-->
    
  </v-container>



</v-form>



</v-card>

 
</template>

<script setup lang="ts">

import manage_rule from '@/controllers/manage_rule';
import manage_action from '@/controllers/manage_action';

import RuleModel from '@/model/rule_model';
import { onMounted, reactive, ref } from 'vue';



const props = defineProps(
    {
        userId: {
            type: String,
            required: true
        },
        onCancel: {
            type: Function,
            required: true
        },
        rule: {
            type: RuleModel,
            required: false,
            default: null
        },
    }
);

onMounted(async () => {

        await manage_action.getAllActions;
    });








const formRef = ref();
const form = reactive({
    valid: false,
      name: '',
      nameRule: [
      (v: string) => !!v || 'Name is required',
      ],

      select: null,

      triggers: [
        'Trigger 1',
        'Trigger 2',
        'Trigger 3',
        'Trigger 4',
      ],

      actions: [
        'Action 1',
        'Action 2',
        'Action 3',
        'Action 4',
      ],
   


});


async function validate() {


}

function resetValidation() {
    formRef.value.resetValidation()
}

</script>

<style scoped>

</style>