<template>


    <h1 class="text-5xl text-blue-100 font-medium text-center py-5"> Add new rule</h1>
    <v-form ref="formRef" v-model="form.valid">
        <v-container>
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field v-model="form.name" :rules="form.nameRule" label="Name" required></v-text-field>
                </v-col>
            </v-row>
        </v-container>
    </v-form>

    <h2 class="text-3xl text-blue-100 font-medium text-center py-5"> Choose a service</h2>

    <div class="text-center flex flex-col justify-center items-center content-center ">

        <div class=" px-5 grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
            <ServiceCardRule v-for="item in services" :key="componentKey" :service="item" :authorization="authorized" />

        </div>
    </div>











</template>

<script setup lang="ts">



import RuleModel from '@/model/rule_model';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import ServiceCardRule from '@/components/ServiceCardRule.vue';
import showServices from "@/controllers/show_services";
import manage_trigger from '@/controllers/manage_trigger';
import ChooseTrigger from '@/components/ChooseTrigger.vue';
import manage_action from '@/controllers/manage_action';
import ChooseAction from '@/components/ChooseAction.vue';



const tabs = ref(0);
const route = useRoute();
const serviceId = route.params.id as string;



const services = showServices.getRef();




const componentKey = ref(0);
const authorized = ref(false);



const props = defineProps(

    {

        userId: {
            type: String,
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
    await showServices.getAllServices();
    const serviceId = route.params.id as string;


});





const formRef = ref();
const form = reactive({
    valid: false,
    name: '',
    nameRule: [
        (v: string) => !!v || 'Name is required',
    ],


});









</script>
    
    
    
    
<style scoped>

</style>