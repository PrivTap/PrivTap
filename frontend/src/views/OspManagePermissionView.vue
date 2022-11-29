<template>
    <div class="flex flex-col items-center justify-center content-start place-items-center " v-if="!showCreatePermission">
            <CreatePermissionVue v-if="service" :service-id=service!._id />
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import ManagePermission from '@/services/manage_permission';
import { ManageService } from '@/services/manage_service';
import type ServiceModel from '@/model/service_model';
import type PermissionModel from '@/model/permission_model';
import CreatePermissionVue from '@/components/CreatePermission.vue';

const showCreatePermission = ref(false);
const route = useRoute();
const managePermission = ManagePermission.getInstance;
const manageService = ManageService.getInstance;
let service = ref<ServiceModel | null>(null);
let permissions = ref<PermissionModel[]>([]);

// On Mounted page, check if the Service has already defined permissions
onMounted(async () => {
    const serviceId = route.params.id as string;
    service.value = await manageService.getServiceById(serviceId);
    permissions.value = await managePermission.getPermissions(serviceId);
    console.log(permissions.value[0]);
});

</script>

<style scoped>

</style>