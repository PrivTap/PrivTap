<template>
    <div class="flex flex-col justify-start items-center mt-20">
        <v-dialog v-model="dialog" persistent>
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    Create New Trigger
                </v-btn>
            </template>
            <TriggerForm v-if="service" :serviceId=service!._id :onCancel="() => (dialog = false)"/>
        </v-dialog>
    </div>
    <div class="px-10 grid lg:grid-cols-2 xl:grid-cols-3 gap-10 py-10">
       
        <TriggerCard v-if="service" v-for="trigger in triggers" :tag="trigger._id" :trigger="trigger"
            :serviceId="service?._id" />
        
    </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import {ManageTrigger} from '@/services/manage_trigger';
import { ManageService } from '@/services/manage_service';
import type ServiceModel from '@/model/service_model';
import TriggerForm from '@/components/ServiceComponents/TriggerForm.vue';
import TriggerCard from '@/components/ServiceComponents/TriggerCard.vue';

const dialog = ref(false);

const route = useRoute();
const manageTrigger = ManageTrigger.getInstance;
const manageService = ManageService.getInstance;
let service = ref<ServiceModel | null>(null);
let triggers = manageTrigger.triggers;

 
onMounted(async () => {
    const serviceId = route.params.id as string;
    service.value = await manageService.getServiceById(serviceId);
   await manageTrigger.getAllTriggers(serviceId);
});

</script>

<style scoped>

</style>