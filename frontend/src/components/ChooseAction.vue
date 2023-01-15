
<template>
    <div class="bg-blue-700/40 rounded-lg py-8 px-8 shadow-lg">
        <p class="text-2xl font-medium"> {{ action.name }} </p>
        <p class="text-lg font-medium text-white/60"> {{ action.description }} </p>
        <v-label class="pt-4 pb-2">Permissions </v-label>
        <div>
            <div v-if="!action.permissions.some(p => p.associated)"> No permission required </div>
            <PermissionChip v-for="permission in action.permissions.filter(p => p.associated)"
                :permissionModel="permission" />
            <v-btn class="ma-2" variant="outlined" color="text-blue-100"
                @click="router.push(`${RoutingPath.CREATE_RULE_PAGE}/${props.action._id}`)">
            </v-btn>
        </div>

        <div class="flex justify-start mt-5 space-x-5">


        </div>

    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type ActionModel from '@/model/action_model';
import RoutingPath from "@/router/routing_path";
import { useRouter } from "vue-router";
import PermissionChip from './InformationChip.vue';


const router = useRouter();


const props = defineProps<{
    action: ActionModel;
    serviceId: string;
}>();





const formDialog = ref(false);




</script>

<style scoped>

</style>