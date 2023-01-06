<template>

  <v-fab-transition origin="top right">
    <button v-show="show" class=" rounded-full px-4 py-4
                       bg-blue-500 text-white font-normal hover:bg-blue-700"
            @click="toTop">
      <v-icon>mdi-chevron-up</v-icon>
    </button>
  </v-fab-transition>
</template>
<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";

const show = ref(false);
const heightForShow = 20;

function toTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  show.value = !show.value;
}

function onScroll() {
  show.value = window.scrollY > heightForShow;
}

onMounted(async () => {
  window.addEventListener("scroll", onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})

</script>
<style scoped>
</style>