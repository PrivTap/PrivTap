<template>
    <v-chip :key="props.permissionModel._id" variant="outlined" class="mr-2" :color="props.color ?? 'success'"
        :append-icon="props.appendIcon ?? 'mdi-check-circle-outline'">
        {{ props.permissionModel.name }}
        <v-tooltip activator="parent" location="bottom">{{ props.permissionModel.description }}</v-tooltip>
    </v-chip>
</template>

<script setup lang="ts">
import type PermissionModel from '@/model/permission_model';

const props = defineProps<{ permissionModel: Partial<PermissionModel>, color?: string, appendIcon?: string }>();
console.log(props.permissionModel);

</script>