<template>
    <div class="flex flex-col justify-start items-center mt-20">
        <v-dialog v-model="dialog" persistent>
            <template v-slot:activator="{ props }">
                <v-btn color="info" v-bind="props">
                    Create New Permission
                </v-btn>
            </template>
            <CreatePermissionVue v-if="service" :serviceId=service!._id :onCancel="() => (dialog = false)" />
        </v-dialog>
    </div>
    <div class="px-10 grid lg:grid-cols-2 xl:grid-cols-3 gap-10 py-10">
        <div v-for="permission in permissions" :tag="permission._id">
           <PermissionCard :permission="permission"></PermissionCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ManagePermission from '@/services/manage_permission';
import { ManageService } from '@/services/manage_service';
import type ServiceModel from '@/model/service_model';
import CreatePermissionVue from '@/components/ServiceComponents/PermissionForm.vue';
import PermissionCard from '@/components/ServiceComponents/PermissionCard.vue';

const dialog = ref(false);

const route = useRoute();
const managePermission = ManagePermission.getInstance;
const manageService = ManageService.getInstance;
let service = ref<ServiceModel | null>(null);
let permissions = managePermission.permissions;

// On Mounted page, check if the Service has already defined permissions
onMounted(async () => {
    const serviceId = route.params.id as string;
    service.value = await manageService.getServiceById(serviceId);
    await managePermission.getPermissions(serviceId);
});

</script>

<style scoped>

</style>