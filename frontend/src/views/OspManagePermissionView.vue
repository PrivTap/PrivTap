<template>
    <div class="h-full">
        <h1 class="text-5xl text-blue-100 font-medium text-center py-5">Your Permissions</h1>

        <div class="flex flex-col items-center justify-center place-self-center relative">
            <img :src="radial" class="w-1/2">
            <div class="absolute top-2 w-half h-5/6">
                <div v-if="isLoading" class="flex flex-col justify-center items-center content-center ">
                    <img :src="logo" class="h-32 my-20 animate-bounce">
                </div>
                <div v-if="(!permissions.length && !isLoading)"
                    class="flex flex-col justify-center items-center content-center ">
                    <h1 class="text-3xl text-blue-100 text-center pt-8 font-medium">
                        You have no permission yet
                    </h1>
                    <h1 class="text-lg text-stone-400 text-center pt-4 pb-10 font-medium">
                        Create a permission by clicking the button below
                    </h1>
                    <img :src=empty class="h-72 ">
                    <div class="flex justify-center items-center mt-20">
                        <v-dialog v-model="dialog" persistent>
                            <template v-slot:activator="{ props }">
                                <v-btn color="info" v-bind="props">
                                    Create New Permission
                                </v-btn>
                            </template>
                            <CreatePermission v-if="service" :serviceId=service!._id
                                :onCancel="() => (dialog = false)" />
                        </v-dialog>
                    </div>
                </div>
                <div v-if="permissions.length" class="py-10">
                    <div class=" px-10 grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
                        <PermissionCard v-for="permission in permissions" :tag="permission._id"
                            :permission="permission"></PermissionCard>
                        <v-dialog v-model="dialog" class="flex flex-col justify-center items-center center">
                            <template v-slot:activator="{ props }">
                                <div v-bind="props"
                                    class="ring-2 rounded-lg flex items-center justify-center bg-slate-900/20 ring-slate-900 hover:ring-slate-700 ring-inset">
                                    <div class="flex flex-col items-center space-y-5 my-10">
                                        <v-icon size="60">mdi-plus</v-icon>
                                        <v-btn color="info" v-bind="props" elevation="0" variant="text">
                                            Create Permission
                                        </v-btn>
                                    </div>
                                </div>
                            </template>
                            <CreatePermission v-if="service" :serviceId=service!._id
                                :onCancel="() => (dialog = false)" />
                        </v-dialog>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type ServiceModel from '@/model/service_model';
import CreatePermission from '@/components/ServiceComponents/PermissionForm.vue';
import PermissionCard from '@/components/ServiceComponents/PermissionCard.vue';
import radial from '@/assets/images/radial.svg';
import logo from '@/assets/images/logo_dark.svg';
import empty from '@/assets/images/empty.svg';
import manage_permission from '@/controllers/manage_permission';
import { manage_service } from '@/controllers/manage_service';

const dialog = ref(false);

const route = useRoute();
let service = ref<ServiceModel | null>(null);
let permissions = manage_permission.getRef();
const isLoading = ref(true);

// On Mounted page, check if the Service has already defined permissions
onMounted(async () => {
    isLoading.value = true;
    const serviceId = route.params.id as string;
    service.value = await manage_service.getServiceById(serviceId);
    await manage_permission.getPermissions(serviceId);
    isLoading.value = false;
});

</script>

<style scoped>

</style>