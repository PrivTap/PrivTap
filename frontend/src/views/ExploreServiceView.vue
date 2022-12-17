<template>
    <div class="h-full">
        <div class="text-center pt-10 mt-5 bg-slate-900/60 shadow-md">
            <v-avatar color="#172540" style="height: 80px; width: 80px;">
                <v-icon size="40px" color="info" icon="mdi-lan"></v-icon>
            </v-avatar>
            <p class="text-h3 font-weight-medium text-white mt-10 mb-4"> {{ service.name }} </p>
            <p class="text-h6 font-weight-regular text-white/60"> {{ service.description }} </p>
            <v-btn variant="tonal" color="info" rounded size="x-large" class="my-10"> CONNECT </v-btn>
            <v-tabs fixed-tabs v-model="tabs">
                <v-tab :value="1">
                    Trigger
                </v-tab>
                <v-tab :value="2">
                    Actions
                </v-tab>
            </v-tabs>
        </div>
        <v-window v-model="tabs">
            <v-window-item v-for="i in 2" :key="i" :value="i">
                <div v-if="i == 1" class="py-10 content-center flex items-center justify-center">
                    <div v-if="!listOfTrigger.length"
                        class="text-center flex flex-col justify-center items-center content-center ">
                        <h1 class="text-3xl text-blue-100 pt-8 font-medium">
                            This service has no trigger yet
                        </h1>
                        <h1 class="text-lg text-stone-400 pt-4 pb-10 font-medium">
                            Wait until the service provider add some trigger
                        </h1>
                        <img :src=empty class="h-40 ">
                    </div>
                    <div v-else class="mx-10 grid lg:grid-cols-2 xl:grid-cols-3 gap-10 content-center">
                        <div v-for="trigger in listOfTrigger"
                            class="rounded-lg py-8 px-8 shadow-lg bg-blue-900/60 hover:bg-blue-900 duration-500">
                            <v-card class="mx-auto" variant="text">
                                <v-card-title>
                                    <p class="text-h4 font-weight-medium"> {{ trigger.name }} </p>
                                </v-card-title>
                                <v-card-subtitle>
                                    <p class="text-h7 font-weight-regular"> {{ trigger.description }} </p>
                                </v-card-subtitle>
                                <v-card-text>
                                    <p class="text-h6 font-weight-regular"> Pemrission required: </p>
                                    <v-chip v-for="permission in trigger.permissions"
                                         class="mr-2 mt-2" color="success" variant="outlined"
                                        appendIcon="mdi-check-circle-outline">
                                        {{ permission.name }}
                                    </v-chip>
                                </v-card-text>
                            </v-card>
                        </div>
                    </div>
                </div>
                <div v-if="i == 2" class="py-10 content-center flex items-center justify-center">
                    <div v-if="!listOfAction.length"
                        class="text-center flex flex-col justify-center items-center content-center ">
                        <h1 class="text-3xl text-blue-100 pt-8 font-medium">
                            This service has no action yet
                        </h1>
                        <h1 class="text-lg text-stone-400 pt-4 pb-10 font-medium">
                            Wait until the service provider add some action
                        </h1>
                        <img :src=empty class="h-40 ">
                    </div>
                    <div class="mx-10 grid lg:grid-cols-2 xl:grid-cols-3 gap-10 content-center">
                        <div v-for="action in listOfAction"
                            class="rounded-lg py-8 px-8 shadow-lg bg-indigo-900/60 hover:bg-indigo-900 duration-500">
                            <v-card class="mx-auto" variant="text">
                                <v-card-title>
                                    <p class="text-h4 font-weight-medium"> {{ action.name }} </p>
                                </v-card-title>
                                <v-card-subtitle>
                                    <p class="text-h7 font-weight-regular"> {{ action.description }} </p>
                                </v-card-subtitle>
                                <v-card-text>
                                    <p class="text-h6 font-weight-regular"> Pemrission required: </p>
                                    <v-chip v-for="permission in action.permissions"
                                         class="mr-2 mt-2" color="success" variant="outlined"
                                        appendIcon="mdi-check-circle-outline">
                                        {{ permission.name }}
                                    </v-chip>
                                </v-card-text>
                            </v-card>
                        </div>
                    </div>
                </div>
            </v-window-item>
        </v-window>


    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import empty from '@/assets/images/empty.svg';
import { useRoute } from 'vue-router';
import type SimpleServiceModel from '@/model/simple_service_model';
import UserTrigger from "@/controllers/user-trigger";
import UserAction from "@/controllers/user-action";

const route = useRoute();
const temp = route.params.service;
let service = JSON.parse(temp as string) as SimpleServiceModel

const tabs = ref(0);
// const service = new ServiceModel("id", "GitHub Integration", "Description of what that service offers..", "creator", "http://github.com", "authPath", "tokenPath", "clientId", "clientSecret");


let listOfTrigger = UserTrigger.getNewRef();
let listOfAction = UserAction.getNewRef();
onMounted(async () => {

  listOfTrigger.value = await UserTrigger.getAllTriggers(service._id, true);
  listOfAction.value = await UserAction.getAllActions(service._id, true);
});
</script>
