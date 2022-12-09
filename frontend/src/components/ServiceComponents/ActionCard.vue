
<template>
    <div class="bg-indigo-900/40 rounded-lg py-8 px-8 shadow-lg">
        <p class="text-2xl font-medium"> {{ action.name }} </p>
        <p class="text-lg font-medium text-white/60"> {{ action.description }} </p>
        <p class="text-lg font-medium text-white/60"> {{ action.endpoint }} </p>
        <v-label class="pt-4 pb-2">Selected Permissions </v-label>
        <div>
            <v-chip v-for="permission in permissions" :key="permission._id" class="mr-2" color="success"
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
                <ActionForm v-if="serviceId" :serviceId="serviceId" :onCancel="onFormClose" onEdit
                    :action="action" />
            </v-dialog>

            <v-btn color="error" @click="(showDialog = true)">
                Delete
            </v-btn>
        </div>
        <div v-if="showDialog">
            <ModalComponent title="Are you sure?" subTitle="You are deleting the action permanently"
                :onPressed="onModalClose" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import ModalComponent from '@/components/ModalComponent.vue';
import type ActionModel from '@/model/action_model';
import managePermission from '@/controllers/manage_permission';
import ActionForm from './ActionForm.vue';
import manage_action from '@/controllers/manage_action';
import type PermissionModel from '@/model/permission_model';
const props = defineProps<{
    action: ActionModel;
    serviceId: string;
}>();

let permissions = ref<PermissionModel[]>([]);

onMounted(async () => {
    await _fetchPermissions();
});

function onFormClose() {
    permissions.value = [];
    _fetchPermissions();
    formDialog.value = false;
}

async function _fetchPermissions() {
    permissions.value = await managePermission.getSelectedPermission(props.serviceId, props.action.permissions)
}

const showDialog = ref(false);
const formDialog = ref(false);

function onModalClose(res: boolean) {
    showDialog.value = false;
    if (!res) return;
    manage_action.deleteAction(props.action._id);
}

</script>

<style scoped>

</style>