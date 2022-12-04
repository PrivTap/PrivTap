<template>
    <div class="flex flex-col justify-start items-center mt-20">
        <v-dialog v-model="dialog">
            <template v-slot:activator="{ props }">
                <v-btn color="indigo" v-bind="props">
                    Create New Action
                </v-btn>
            </template>
            <ActionForm v-if="service" :serviceId=service!._id :onCancel="() => (dialog = false)" />
        </v-dialog>
    </div>
    <div class="px-10 grid lg:grid-cols-3 xl:grid-cols-3 gap-10 py-10">
        <ActionCard v-if="service" v-for="action in actions" :tag="action._id" :action="action"
            :serviceId="service?._id" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ManageService } from '@/services/manage_service';
import type ServiceModel from '@/model/service_model';
import { ManageAction } from '@/services/manage_action';
import ActionCard from '@/components/ServiceComponents/ActionCard.vue';
import ActionForm from '@/components/ServiceComponents/ActionForm.vue';

const dialog = ref(false);

const route = useRoute();
const managePermission = ManageAction.getInstance;
const manageService = ManageService.getInstance;
let service = ref<ServiceModel | null>(null);
let actions = managePermission.actions;

// On Mounted page, check if the Service has already defined permissions
onMounted(async () => {
    const serviceId = route.params.id as string;
    service.value = await manageService.getServiceById(serviceId);
    await managePermission.getAllActions(serviceId);
});

</script>

<style scoped>

</style>