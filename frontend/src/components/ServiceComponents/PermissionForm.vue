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
                <v-textarea required hint="Paste a valid JSON object" :rules="form.authorization_detailsRurl"
                    v-model="form.authorization_details" label="Authorization Details"></v-textarea>
                <vue-json-pretty :data="form.authorization_details"/>
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
import managePermission from '@/services/manage_permission';
import PermissionModel from '@/model/permission_model';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

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
        form.authorization_details = JSON.stringify(perm.authorization_details);
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
    authorization_details: '',
    authorization_detailsRurl: [
        (v: string) => !!v || 'Authorization Details Object is required',
        (v: string) => {
            try {
                JSON.parse(v);
                return true;
            } catch (error) {
                return "Authorization Details Object is not valid";
            }
        }
    ]
});



async function validate() {
    const { valid } = await formRef.value.validate();
    console.log(valid);
    if (valid) {
        const object = JSON.parse(form.authorization_details);
        if (props.onEdit) {
            await managePermission.updatePermission(props.permission.serviceId, props.permission._id, form.name, form.description, object);
        } else {
            await managePermission.createPermission(props.serviceId, form.name, form.description, object);
        }
        props.onCancel();
    }
}






function resetValidation() {
    formRef.value.resetValidation()
}

</script>


