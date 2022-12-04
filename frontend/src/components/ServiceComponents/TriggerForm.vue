<template>
    <v-card>
        <v-card-title>
            <h2 class="text-h5"> {{ props.onEdit ? 'Edit' : 'Create' }} Trigger </h2>
        </v-card-title>
        <v-card-text>
            <v-form ref="formRef" v-model="form.valid" lazy-validation>
                <v-text-field v-model="form.name" :rules="form.nameRule" label="Name" required></v-text-field>
                <v-textarea :rules="form.descriptionRule" v-model="form.description" label="Description"
                    required></v-textarea>
                    <v-text-field v-if="!onEdit" v-model="form.endpoint" :rules="form.endpointRule" label="Endpoint"
                    required></v-text-field>
                    <v-label class="mb-2 mt-4">Choose Permissions</v-label>

                    <v-input :rules="permissionRule" v-model="selectedPermissions" :readonly="true">
                    <v-row align-content="start" no-gutters class="-translate-x-3 h-14"
                        >
                        <v-col cols="1" align-self="start" v-for="choosablePerm in choosablePermissions" :key="choosablePerm._id">
                            <v-checkbox v-model="selectedPermissions" :label="choosablePerm.name" :value="choosablePerm"
                                color="success"></v-checkbox>
                        </v-col>
                    </v-row>
                </v-input>
                <v-divider class="my-5"></v-divider>
            </v-form>
        </v-card-text>
        <v-row class="px-8 space-x-6">
            <v-btn color="info" text @click="validate"> {{ props.onEdit ? 'Edit' : 'Create' }}</v-btn>
            <v-btn color="red" variant="outlined" text @click="resetValidation">Reset</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" text @click="props.onCancel()">Cancel</v-btn>
        </v-row>
        <v-card-triggers></v-card-triggers>
    </v-card>
</template>
  



<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import TriggerModel from '@/model/trigger_model';
import {ManageTrigger} from '@/services/manage_trigger'; //MOZDA OVOOOOOOOOOOOOOOOOOOOOOOOOOO
import { isValidUrlRegex } from '@/helpers/validators';
import type PermissionModel from '@/model/permission_model';
import ManagePermission from '@/services/manage_permission';
import { trigger } from '@vue/reactivity';


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
        trigger: {
            type: TriggerModel,
            required: false,
            default: null
        },
    }
);


onMounted(async () => {
    choosablePermissions.value = await ManagePermission.getInstance.getPermissions(props.serviceId);
    if (props.onEdit && props.trigger) {
        const trigger = props.trigger;
        form.name = trigger.name;
        form.description = trigger.description;
        _getSelectedPermissions(trigger);
    }
});



let choosablePermissions = ref<PermissionModel[]>([]);
const selectedPermissions = ref<PermissionModel[]>([]);

function _getSelectedPermissions(trigger: TriggerModel) {
    for (const permId of trigger.permissions) {
        const permIndex = choosablePermissions.value.findIndex(p => p._id === permId);
        if (permIndex >= -1) {
            selectedPermissions.value.push(choosablePermissions.value[permIndex]);
        }
    }
}

const permissionRule = ref([
    (v: string[]) => (v.length !== 0) || 'Permission is required',
]);

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



const manageTrigger = ManageTrigger.getInstance;
async function validate() {
    const { valid } = await formRef.value.validate();
    console.log(valid);
    if (valid) {
        const permissionIds = selectedPermissions.value.map(p => p._id);
        if (props.onEdit) {
            await manageTrigger.updateTrigger(form.name, props.trigger._id, form.description, permissionIds, form.endpoint);
        } else {
            await manageTrigger.createTrigger(form.name, form.description, props.serviceId, permissionIds, form.endpoint);
           
        }
        props.onCancel();
    }
}
function resetValidation() {
    formRef.value.resetValidation()
}

</script>


