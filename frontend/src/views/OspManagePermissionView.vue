<template>
    <div>
        OSP Manage Permission for service: service.name
            - Permission 1
            <div>
                - Role 1
                <div>
                    - User 1
                </div>
                <div>
                    - User 2
                </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AxiosService from '@/helpers/axios_service';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

/// On Mounted page, check if the Service has already defined permissions
onMounted(async () => {
    const serviceId = route.params.id as string;
});




</script>

<style scoped>

</style>