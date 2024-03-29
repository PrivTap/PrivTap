<template>
    <div class="h-full">
        <h1 class="text-5xl text-blue-100 font-medium text-center py-5">Your Triggers</h1>

        <div class="flex flex-col items-center justify-center place-self-center relative">
            <img :src="radial" class="w-1/2">
            <div class="absolute top-2 w-half">
                <div v-if="isLoading" class="flex flex-col justify-center items-center content-center ">
                    <img :src="logo" class="h-32 my-20 animate-bounce">
                </div>

                <div v-if="(!triggers.length && !isLoading)"
                    class="flex flex-col justify-center items-center content-center ">
                    <h1 class="text-3xl text-blue-100 text-center pt-8 font-medium">
                        You have no trigger yet
                    </h1>
                    <h1 class="text-lg text-stone-400 text-center pt-4 pb-10 font-medium">
                        Create a trigger by clicking the button below
                    </h1>
                    <img :src=empty class="h-72 ">
                    <div v-if="!triggers.length" class="flex justify-center items-center mt-20">
                        <v-dialog v-model="dialog">
                            <template v-slot:activator="{ props }">
                                <v-btn color="indigo" v-bind="props" variant="flat" size="large">
                                    Create New Trigger
                                </v-btn>
                            </template>
                            <TriggerForm :serviceId="(route.params.id as string)" :onCancel="onClose" />
                        </v-dialog>
                    </div>
                </div>
                <div v-if="triggers.length" class="py-10">
                    <div class=" px-10 grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
                        <TriggerCard v-for="trigger in triggers" :tag="trigger._id"
                            :trigger="trigger" :serviceId="(route.params.id as string)" />
                        <v-dialog v-model="dialog" class="flex flex-col justify-center items-center center">
                            <template v-slot:activator="{ props }">
                                <div v-bind="props"
                                    class="ring-2 rounded-lg flex items-center justify-center bg-green-900/10 ring-green-900 hover:ring-green-700">
                                    <div class="flex flex-col items-center space-y-5 my-10">
                                        <v-icon size="60">mdi-plus</v-icon>
                                        <v-btn color="green" v-bind="props" elevation="0" variant="text">
                                            Create New Trigger
                                        </v-btn>
                                    </div>
                                </div>
                            </template>
                            <TriggerForm :serviceId="(route.params.id as string)" :onCancel="onClose" />
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
import TriggerCard from '@/components/ServiceComponents/TriggerCard.vue';
import TriggerForm from '@/components/ServiceComponents/TriggerForm.vue';
import radial from '@/assets/images/radial.svg';
import logo from '@/assets/images/logo_dark.svg';
import empty from '@/assets/images/empty.svg';
import manage_trigger from '@/controllers/manage_trigger';

const dialog = ref(false);
const isLoading = ref(true);

const route = useRoute();

let triggers = manage_trigger.getRef();

async function onClose(){
    dialog.value = false
}

// On Mounted page, check if the Service has already defined permissions
onMounted(async () => {
    isLoading.value = true;
    const serviceId = route.params.id as string;
    await manage_trigger.getAllTriggers(serviceId);
    isLoading.value = false;
});

</script>

<style scoped>

</style>