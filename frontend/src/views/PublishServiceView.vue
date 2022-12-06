<template>
  <div class="h-screen">
    <h1 class="text-5xl text-center text-blue-100 font-medium py-10">
      {{ route.params.id ? "Edit" : "Publish" }} Service
    </h1>
    <div class="items-center justify-center flex flex-col">
      <div class="min-w-[400px] w-2xl">
        <v-form ref="formRef" v-model="form.valid" lazy-validation class="space-y-4">
          <v-text-field variant="outlined" v-model="form.name" :rules="form.nameRule" label="Name"
            required></v-text-field>
          <v-textarea variant="outlined" no-resize v-model="form.description" :rules="form.descriptionRule"
            label="Description" required></v-textarea>
          <v-text-field variant="outlined" v-model="form.endpoint" :rules="form.endpointRule" label="Endpoint Url"
            hint="www.example.com" required></v-text-field>
          <v-text-field variant="outlined" v-model="form.clientId" :rules="form.idRule" label="Client ID"
            required></v-text-field>
          <v-text-field variant="outlined" v-model="form.secret" :rules="form.secretRule" label="Client Secret"
            required></v-text-field>
        </v-form>

      </div>
      <PrimaryButton @click="validate" class="mt-5"
        :text="route.params.id ? 'Edit API endpoint' : 'Create API endpoint'" />
    </div>

  </div>
</template>
>

<script setup lang="ts">
// import { useOspServiceStore } from "@/stores/osp_service_store";
import { onMounted, reactive, ref, watch } from "vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import { useRoute } from "vue-router";
import { ManageService } from "@/services/manage_service";
import router from "@/router/router";
import RoutingPath from "@/router/routing_path";
import { isValidUrlRegex } from "@/helpers/validators";

const route = useRoute();
const isValidUrl = ref<boolean>(true);
const isLoading = ref<boolean>(false);
const manageService = ManageService.getInstance;

async function checkEdit() {
  if (route.params.id) {
    /// Means that we are editing a service
    let serviceToEdit = await manageService.getServiceById(route.params.id as string);
    if (serviceToEdit) {
      form.name = serviceToEdit.name;
      form.description = serviceToEdit.description;
      form.endpoint = serviceToEdit.authServer;
      form.clientId = serviceToEdit.clientId;
      form.secret = serviceToEdit.clientSecret;
    }
  }
}

/// Form part
const formRef = ref();
const form = reactive({
  valid: true,
  name: '',
  nameRule: [(v: string) => !!v || 'Name is required'],
  description: '',
  descriptionRule: [(v: string) => !!v || 'Description is required'],
  endpoint: '',
  endpointRule: [
    (v: string) => !!v || 'Endpoint is required',
    (v: string) => isValidUrlRegex(v) || 'Endpoint is not valid'
  ],
  clientId: '',
  idRule: [(v: string) => !!v || 'Client Id is required'],
  secret: '',
  secretRule: [(v: string) => !!v || 'Client secret is required'],
});

onMounted(async () => {
  await checkEdit();
});

async function validate() {
  isLoading.value = true;
  const { valid } = await formRef.value.validate();
  if (valid) {
    if (route.params.id) {
      const serviceId = route.params.id as string;
      await manageService.updateService(
        serviceId,
        form.name,
        form.description,
        form.endpoint,
        form.clientId,
        form.secret,
      )
    } else {
      await manageService.createService(
        form.name,
        form.description,
        form.endpoint,
        form.clientId,
        form.secret,
      );
    }
    isLoading.value = false;
    return router.replace(RoutingPath.OSP_PERSONAL_PAGE);
  }

}
</script>

<style scoped>

</style>
