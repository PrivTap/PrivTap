<template>
    <v-card>
        <v-card-title>
            <h2 class="text-h5"> {{ props.onEdit ? 'Edit' : 'Create' }} Permission </h2>
        </v-card-title>
        <v-card-text>
            <v-form ref="formRef" v-model="form.valid" lazy-validation>
                <v-text-field v-model="form.name" :rules="form.nameRule" label="Name" required></v-text-field>
                <v-textarea :rules="form.descriptionRule" v-model="form.description" label="Description"
                    required></v-textarea>
                <v-text-field v-model="form.type" :rules="form.typeRule" label="Type" required></v-text-field>
                <v-input :rules="actionRule" v-model="actions" :readonly="true"> Actions
                </v-input>
                <div>
                    <v-chip v-if="actions.length > 0" v-for="action in actions" :key="action" class="mr-2" color="green"
                        closable @click:close="removeAction(action)">
                        {{ action }}
                    </v-chip>
                    <v-btn color="primary" @click="addAction" variant="outlined" rounded="pill" size="small">Add</v-btn>
                    <v-text-field class="max-w-sm mt-5" v-if="showInput" v-model="newAction" label="Action"
                        required></v-text-field>
                </div>
                <v-divider class="my-5"></v-divider>
            </v-form>
        </v-card-text>
        <v-row class="px-8 space-x-6">
            <v-btn color="primary" text @click="validate"> {{ props.onEdit ? 'Edit' : 'Create' }}</v-btn>
            <v-btn color="red" variant="outlined" text @click="resetValidation">Reset</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" text @click="props.onCancel()">Cancel</v-btn>
        </v-row>
        <v-card-actions></v-card-actions>
    </v-card>
</template>
  
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import ManagePermission from '@/services/manage_permission';
import RarObjectModel from '@/model/rar_model';
import PermissionModel from '@/model/permission_model';

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
        permission: {
            type: PermissionModel,
            required: false,
            default: null
        }
    }
);

onMounted(() => {
    if (props.onEdit && props.permission) {
        const perm = props.permission;
        console.log(perm);
        form.name = perm.name;
        form.description = perm.description;
        form.type = perm.rarObject.type;
        actions.value = perm.rarObject.actions;
    }
});

const formRef = ref();
const showInput = ref(false);
const newAction = ref('');
function addAction() {
    if (!showInput.value) return showInput.value = true;
    if (!newAction.value) return showInput.value = false;
    if (newAction.value !== '') {
        actions.value.push(newAction.value);
        newAction.value = '';
        showInput.value = false;
    }
}
function removeAction(action: string) {
    actions.value = actions.value.filter((item) => item !== action);
}

const actions = ref<string[]>([]);
const actionRule = ref([
    (v: string[]) => (v.length !== 0) || 'Action is required',
]);

const form = reactive({
    valid: true,
    name: '',
    nameRule: [(v: string) => !!v || 'Name is required'],
    description: '',
    descriptionRule: [(v: string) => !!v || 'Description is required'],
    type: '',
    typeRule: [(v: string) => !!v || 'Type is required'],
});

const managePermission = ManagePermission.getInstance;

async function validate() {
    const { valid } = await formRef.value.validate();
    console.log(valid);
    if (valid) {
        const rar = new RarObjectModel(form.type, actions.value, []);
        if (props.onEdit) {
            await managePermission.updatePermission(props.permission.serviceId, props.permission._id, form.name, form.description, rar);
        } else {
            await managePermission.createPermission(props.serviceId, form.name, form.description, rar);
        }
        props.onCancel();
    }
}
function resetValidation() {
    formRef.value.resetValidation()
}

</script>


