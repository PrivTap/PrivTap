

<template>
<h1 class="text-5xl text-blue-100 font-medium text-center py-5">Choose trigger</h1>
<div class="flex flex-col items-center justify-center place-self-center relative">

    <div class=" px-5 grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
 <ChooseTrigger v-for="trigger in triggers" :tag="trigger._id"
                            :trigger="trigger" :serviceId="(route.params.id as string)" /> 
    </div>
</div>
</template>


<script setup lang="ts">


import ChooseTrigger from '@/components/ChooseTrigger.vue';
import manage_trigger from '@/controllers/manage_trigger';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

onMounted(async () => {
    
    const serviceId = route.params.id as string;
    await manage_trigger.getAllTriggers(serviceId);
    
});





const route = useRoute();

let triggers = manage_trigger.getRef();





</script>


<style>


</style>