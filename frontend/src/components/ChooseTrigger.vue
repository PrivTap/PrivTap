
<template>
    <div class="bg-blue-700/40 rounded-lg py-8 px-8 shadow-lg">
        <p class="text-2xl font-medium"> {{ trigger.name }} </p>
        <p class="text-lg font-medium text-white/60"> {{ trigger.description }} </p>
        <v-label class="pt-4 pb-2">Permissions </v-label>
        <div>
            <div v-if="!trigger.permissions.some(p => p.associated)"> No permission required </div>
            <PermissionChip v-for="permission in trigger.permissions.filter(p => p.associated)"
                :permissionModel="permission" />

            <v-btn class="ma-2" variant="outlined" color="text-blue-100"
                @click="router.push(`${RoutingPath.CREATE_RULE_PAGE}/${props.trigger._id}`)">
                choose
            </v-btn>
        </div>

        <div class="flex justify-start mt-5 space-x-5">


        </div>

    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type TriggerModel from '@/model/trigger_model';
import RoutingPath from "@/router/routing_path";
import { useRouter } from "vue-router";
import PermissionChip from './InformationChip.vue';


const router = useRouter();


const props = defineProps<{
    trigger: TriggerModel;
    serviceId: string;
}>();





const formDialog = ref(false);




</script>

<style scoped>

</style>