<template>
    <div class="bg-slate-800 rounded-lg py-8 px-8 shadow-lg">
        <p class="text-2xl font-medium"> {{ permission.name }} </p>
        <p class="text-lg font-medium text-white/60"> {{ permission.description }} </p>
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
import { defineProps, ref } from 'vue';
import ModalComponent from '@/components/ModalComponent.vue';
import CreatePermissionVue from './PermissionForm.vue';
import manage_permission from '@/controllers/manage_permission';
const props = defineProps<{
    permission: PermissionModel;
}>();

const showDialog = ref(false);
const dialog = ref(false);

function onModalClose(res: boolean) {
    showDialog.value = false;
    if (!res) return;
    manage_permission.deletePermission(props.permission.serviceId, props.permission._id);
}


</script>

<style scoped>

</style>