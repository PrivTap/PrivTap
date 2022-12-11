<template>
  <v-card>
    <v-card-title>
      <h2 class="text-h5"> {{ props.onEdit ? 'Edit' : 'Create' }} Action </h2>
    </v-card-title>
    <v-card-text>
      <v-form ref="formRef" v-model="form.valid" lazy-validation>
        <v-text-field v-model="form.name" :rules="form.nameRule" label="Name" required></v-text-field>
        <v-textarea :rules="form.descriptionRule" v-model="form.description" label="Description" required></v-textarea>
        <v-text-field v-model="form.endpoint" :rules="form.endpointRule" label="Endpoint" required></v-text-field>
        <v-label class="mb-2 mt-4">Choose Permissions</v-label>

        <!-- <v-chip-group v-model="selectedPermissions" column multiple selected-class="text-success">
            <v-chip v-for="choosablePerm in choosablePermissions" :key="choosablePerm._id" filter
                variant="outlined">
                {{ choosablePerm.name }}
            </v-chip>
            <v-chip v-for="choosablePerm in choosablePermissions" :key="choosablePerm._id" filter
                variant="outlined">
                {{ choosablePerm.name }}
            </v-chip>
        </v-chip-group> -->
          <v-row align-content="start" no-gutters class="-translate-x-3 h-14">
            <v-col cols="2" align-self="start" v-for="choosablePerm in choosablePermissions.perm" :key="choosablePerm._id">
              <v-checkbox v-model="choosablePerm.associated" :label="choosablePerm.name"
                color="success"></v-checkbox>
            </v-col>
          </v-row>
        <v-divider class="my-5"></v-divider>
      </v-form>
    </v-card-text>
    <v-row class="px-8 space-x-6">
      <v-btn color="indigo" text @click="validate"> {{ props.onEdit ? 'Edit' : 'Create' }}</v-btn>
      <v-btn color="red" variant="outlined" text @click="resetValidation">Reset</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="error" variant="text" text @click="onClose">Cancel</v-btn>
    </v-row>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import ActionModel from '@/model/action_model';
import { isValidUrlRegex } from '@/helpers/validators';
import manage_action from '@/controllers/manage_action';
import manage_permission from '@/controllers/manage_permission';
import type PermissionModel from '@/model/permission_model';

const props = defineProps(
  {
    serviceId: {
      type: String,
      required: true
    },
    onCancel: {
      type: Function,
      required: true
    },
    onEdit: {
      type: Boolean,
      required: false,
      default: false
    },
    action: {
      type: ActionModel,
      required: false,
      default: null
    }
  }
);

const choosablePermissions = reactive<{ perm: Partial<PermissionModel>[] }>({
  perm: []
})

onMounted(async () => {
  if (props.onEdit && props.action) {
    const action = props.action;
    form.name = action.name;
    form.description = action.description;
    form.endpoint = action.endpoint ?? '';
    choosablePermissions.perm = action.permissions;
  } else {
    await manage_permission.getAllPermissions(props.serviceId);
    choosablePermissions.perm = manage_permission.getRef().value;
  }
});

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
});

async function onClose() {
    await manage_action.getAllActions(props.serviceId);
    props.onCancel();
}

async function validate() {
  const { valid } = await formRef.value.validate();
  console.log(valid);
  if (valid) {
    const perm = choosablePermissions.perm.filter(p => p._id !== undefined && p.associated === true).map(p => p._id) as string[];
    if (props.onEdit) {
      await manage_action.updateAction(props.action._id, form.name, form.description, perm, form.endpoint);
    } else {
      await manage_action.createAction(form.name, form.description, props.serviceId, perm, form.endpoint);
    }
    onClose();
  }
}

function resetValidation() {
  formRef.value.resetValidation()
}

</script>


