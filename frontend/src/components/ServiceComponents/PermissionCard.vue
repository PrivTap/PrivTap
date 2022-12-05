<template>
    <div class="bg-slate-800 rounded-lg py-8 px-8 shadow-lg">
        <p class="text-2xl font-medium"> {{ permission.name }} </p>
        <p class="text-lg font-medium text-white/60"> {{ permission.description }} </p>
        <p class="text-lg font-medium text-white/90 py-5"> Service id: {{ permission.serviceId }} </p>
        <br>
        <div class="flex justify-end mt-5 space-x-5">
            <v-dialog v-model="dialog" persistent>
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props">
                        Edit
                    </v-btn>
                </template>
                <CreatePermissionVue :serviceId=props.permission.serviceId :onCancel="() => dialog = false"
                    :onEdit="true" :permission="props.permission" />
            </v-dialog>
            <v-btn color="error" @click="(showDialog = true)">
                Delete
            </v-btn>
        </div>
        <div v-if="showDialog">
            <ModalComponent title="Are you sure?" subTitle="You are deleting the service permanently"
                :onPressed="onModalClose" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type PermissionModel from '@/model/permission_model';
import ManagePermission from '@/services/manage_permission';
import { defineProps, ref } from 'vue';
import ModalComponent from '@/components/ModalComponent.vue';
import CreatePermissionVue from './PermissionForm.vue';
const props = defineProps<{
    permission: PermissionModel;
}>();

const showDialog = ref(false);
const dialog = ref(false);

const managePermission = ManagePermission.getInstance;
function onModalClose(res: boolean) {
    showDialog.value = false;
    if (!res) return;
    managePermission.deletePermission(props.permission.serviceId, props.permission._id);
}


</script>

<style scoped>

</style>