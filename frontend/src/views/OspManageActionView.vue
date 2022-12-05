<template>
    <div class="h-full">
        <h1 class="text-5xl text-blue-100 font-medium text-center py-5">Your Actions</h1>

        <div class="flex flex-col items-center justify-center place-self-center relative">
            <img :src="radial" class="w-1/2">
            <div class="absolute top-2 w-half">
                <div v-if="isLoading" class="flex flex-col justify-center items-center content-center ">
                    <img :src="logo" class="h-32 my-20 animate-bounce">
                </div>

                <div v-if="(!actions.length && !isLoading)"
                    class="flex flex-col justify-center items-center content-center ">
                    <h1 class="text-3xl text-blue-100 text-center pt-8 font-medium">
                        You have no action yet
                    </h1>
                    <h1 class="text-lg text-stone-400 text-center pt-4 pb-10 font-medium">
                        Create a action by clicking the button below
                    </h1>
                    <img :src=empty class="h-72 ">
                    <div v-if="!actions.length" class="flex justify-center items-center mt-20">
                        <v-dialog v-model="dialog">
                            <template v-slot:activator="{ props }">
                                <v-btn color="indigo" v-bind="props" variant="flat" size="large">
                                    Create New Action
                                </v-btn>
                            </template>
                            <ActionForm v-if="service" :serviceId=service!._id :onCancel="() => (dialog = false)" />
                        </v-dialog>
                    </div>
                </div>
                <div v-if="actions.length" class="py-10">
                    <div class=" px-10 grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
                        <ActionCard v-if="service" v-for="action in actions" :tag="action._id" :action="action"
                            :serviceId="service?._id" />
                        <v-dialog v-model="dialog" class="flex flex-col justify-center items-center center">
                            <template v-slot:activator="{ props }">
                                <div v-bind="props"
                                    class="ring-2 rounded-lg flex items-center justify-center bg-indigo-900/10 ring-indigo-900 hover:ring-indigo-700">
                                    <div class="flex flex-col items-center space-y-5 my-10">
                                        <v-icon size="60">mdi-plus</v-icon>
                                        <v-btn color="indigo" v-bind="props" elevation="0" variant="text">
                                            Create New Action
                                        </v-btn>
                                    </div>
                                </div>
                            </template>
                            <ActionForm v-if="service" :serviceId=service!._id :onCancel="() => (dialog = false)" />
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
import { ManageService } from '@/services/manage_service';
import type ServiceModel from '@/model/service_model';
import { ManageAction } from '@/services/manage_action';
import ActionCard from '@/components/ServiceComponents/ActionCard.vue';
import ActionForm from '@/components/ServiceComponents/ActionForm.vue';
import radial from '@/assets/images/radial.svg';
import logo from '@/assets/images/logo_dark.svg';
import empty from '@/assets/images/empty.svg';

const dialog = ref(false);
const isLoading = ref(true);

const route = useRoute();
const managePermission = ManageAction.getInstance;
const manageService = ManageService.getInstance;
let service = ref<ServiceModel | null>(null);
let actions = managePermission.actions;

// On Mounted page, check if the Service has already defined permissions
onMounted(async () => {
    isLoading.value = true;
    const serviceId = route.params.id as string;
    service.value = await manageService.getServiceById(serviceId);
    await managePermission.getAllActions(serviceId);
    isLoading.value = false;
});

</script>

<style scoped>

</style>