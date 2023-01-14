<template>
  <v-chip :key="props.permissionModel._id" variant="outlined" class="mr-2" :color="props.color ?? 'success'"
          :append-icon="props.appendIcon ?? 'mdi-check-circle-outline'">
    {{ props.permissionModel.name }}
    <v-tooltip activator="parent" location="bottom">{{ props.permissionModel.description }}</v-tooltip>
  </v-chip>
</template>

<script setup lang="ts">

const props = defineProps<{ permissionModel: Partial<{ _id: string, name: string, description: string }>, color?: string, appendIcon?: string }>();

</script>