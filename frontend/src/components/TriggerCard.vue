<template>
    <div class="bg-slate-800 rounded-lg py-8 px-8 shadow-lg">
        <p class="text-2xl font-medium"> {{ trigger.name }} </p>
        <p class="text-lg font-medium text-white/60"> {{ trigger.description }} </p>
        <p class="text-lg font-medium text-white/90 py-5"> Service id: {{ trigger.serviceId }} </p>
        <br>
        <h1 class="pt-4 pb-2">Permissions: </h1>

        <!-- <v-chip v-for="a in trigger.permissions" :tag="a" size="small" class="mr-2" color="green">
            {{ a }}
        </v-chip> -->
        <div class="flex justify-end mt-5 space-x-5">
            <v-dialog v-model="dialog" persistent>
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props">
                        Edit
                    </v-btn>
                </template>
                <CreateTrigger :serviceId=props.trigger.serviceId :onCancel="() => dialog = false" :onEdit="true" :trigger="props.trigger" />
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
import type TriggerModel from '@/model/trigger_model';
import ManageTrigger from '@/services/manage_trigger';
import { defineProps, ref } from 'vue';
import ModalComponent from './ModalComponent.vue';
import type { trigger } from '@vue/reactivity';
const props = defineProps<{
    trigger: TriggerModel;
}>();

const showDialog = ref(false);
const dialog = ref(false);

const manageTrigger = ManageTrigger.getInstance;
function onModalClose(res: boolean) {
    showDialog.value = false;
    if (!res) return;
    manageTrigger.deleteTrigger(props.trigger._id);
}

</script>

<style scoped>

</style>