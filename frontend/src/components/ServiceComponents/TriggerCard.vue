
<template>
    <div class="bg-green-900/40 rounded-lg py-8 px-8 shadow-lg">
        <p class="text-2xl font-medium"> {{ trigger.name }} </p>
        <p class="text-lg font-medium text-white/60"> {{ trigger.description }} </p>
        <v-label class="pt-4 pb-2">Selected Permissions </v-label>
        <div>
            <v-chip v-for="permission in selectedPermission" :key="permission._id" class="mr-2" color="success"
                variant="outlined" appendIcon="mdi-check-circle-outline">
                {{ permission.name }}
            </v-chip>
        </div>

        <div class="flex justify-start mt-5 space-x-5">
            <v-dialog v-model="formDialog">
                <template v-slot:activator="{ props }">
                    <v-btn color="info" v-bind="props">
                        Edit
                    </v-btn>
                </template>
                <TriggerForm v-if="serviceId" :serviceId="serviceId" :onCancel="onFormClose" onEdit
                    :trigger="trigger"/>
            </v-dialog>

            <v-btn color="error" @click="(showDialog = true)">
                Delete
            </v-btn>
        </div>
        <div v-if="showDialog">
            <ModalComponent title="Are you sure?" subTitle="You are deleting the trigger permanently"
                :onPressed="onModalClose" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import ModalComponent from '@/components/ModalComponent.vue';
import type TriggerModel from '@/model/trigger_model';
import type PermissionModel from '@/model/permission_model';
import TriggerForm from './TriggerForm.vue';
import manage_permission from '@/controllers/manage_permission';
import manage_trigger from '@/controllers/manage_trigger';
const props = defineProps<{
    trigger: TriggerModel;
    serviceId: string;
}>();

const selectedPermission = ref<PermissionModel[]>([]);

onMounted(async () => {
    _fetchPermissions();
});

function onFormClose() {
    selectedPermission.value = [];
    _fetchPermissions();
    formDialog.value = false;
}

async function _fetchPermissions() {
    selectedPermission.value = await manage_permission.getSelectedPermission(props.serviceId, props.trigger.permissions);
}

const showDialog = ref(false);
const formDialog = ref(false);

function onModalClose(res: boolean) {
    showDialog.value = false;
    if (!res) return;
    manage_trigger.deleteTrigger(props.trigger._id);
}

</script>

<style scoped>

</style>