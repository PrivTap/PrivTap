<template>
    <v-card>
        <v-card-title>
            <h2 class="text-h5"> {{ props.onEdit ? 'Edit' : 'Create' }} Action </h2>
        </v-card-title>
        <v-card-text>
            <v-form ref="formRef" v-model="form.valid" lazy-validation>
                <v-text-field v-model="form.name" :rules="form.nameRule" label="Name" required></v-text-field>
                <v-textarea :rules="form.descriptionRule" v-model="form.description" label="Description"
                    required></v-textarea>
                <v-text-field v-if="!onEdit" v-model="form.endpoint" :rules="form.endpointRule" label="Endpoint"
                    required></v-text-field>
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
            <v-btn color="indigo" text @click="validate"> {{ props.onEdit ? 'Edit' : 'Create' }}</v-btn>
            <v-btn color="red" variant="outlined" text @click="resetValidation">Reset</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" text @click="props.onCancel()">Cancel</v-btn>
        </v-row>
        <v-card-actions></v-card-actions>
    </v-card>
</template>
  
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import ActionModel from '@/model/action_model';
import { ManageAction } from '@/services/manage_action';
import { isValidUrlRegex } from '@/helpers/validators';
import type PermissionModel from '@/model/permission_model';
import ManagePermission from '@/services/manage_permission';

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

onMounted(async () => {
    choosablePermissions.value = await ManagePermission.getInstance.getPermissions(props.serviceId);
    if (props.onEdit && props.action) {
        const action = props.action;
        form.name = action.name;
        form.description = action.description;
        _getSelectedPermissions(action);
    }
});

let choosablePermissions = ref<PermissionModel[]>([]);
const selectedPermissions = ref<PermissionModel[]>([]);

function _getSelectedPermissions(action: ActionModel) {
    for (const permId of action.permissions) {
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



const manageAction = ManageAction.getInstance;
async function validate() {
    const { valid } = await formRef.value.validate();
    console.log(valid);
    if (valid) {
        const permissionIds = selectedPermissions.value.map(p => p._id);
        if (props.onEdit) {
            await manageAction.updateAction(props.action._id, form.name, form.description, permissionIds, form.endpoint);
        } else {
            await manageAction.createAction(form.name, form.description, props.serviceId, permissionIds, form.endpoint);
        }
        props.onCancel();
    }
}
function resetValidation() {
    formRef.value.resetValidation() 
}

</script>


