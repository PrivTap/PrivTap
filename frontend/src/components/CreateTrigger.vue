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
                <v-input :rules="permissionRule" v-model="permissions" :readonly="true"> Permissions
                </v-input>
                <div>
                    <v-chip v-if="permissions.length > 0" v-for="permission in permissions" :key="permission" class="mr-2" color="green"
                        closable @click:close="removePermission(permission)">
                        {{ permission }}
                    </v-chip>
                    <v-btn color="primary" @click="addPermission" variant="outlined" rounded="pill" size="small">Add</v-btn>
                    <v-text-field class="max-w-sm mt-5" v-if="showInput" v-model="newPermission" label="Permission"
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
import TriggerModel from '@/model/trigger_model';
import ManageTrigger from '@/services/manage_trigger';
import { trigger } from '@vue/reactivity';
// import { trigger } from '@vue/reactivity';



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


onMounted(() => {
    if (props.onEdit && props.trigger) {
        const trig = props.trigger;
        console.log(trig);
        form.name = trig.name;
        form.description = trig.description;
        // trig.permission = trig
        permissions.value = trig.permissions;
        // form.type = perm.rarObject.type;            //OVO ZAMENITI
        // actions.value = perm.rarObject.actions;
    }
});





const formRef = ref();
const showInput = ref(false);
const newPermission = ref('');
function addPermission() {
    if (!showInput.value) return showInput.value = true;
    if (!newPermission.value) return showInput.value = false;
    if (newPermission.value !== '') {
        permissions.value.push(newPermission.value);
        newPermission.value = '';
        showInput.value = false;
    }
}


function removePermission(permission: string) {
    permissions.value = permissions.value.filter((item) => item !== permission);
}


const permissions = ref<string[]>([]);
const permissionRule = ref([
    (v: string[]) => (v.length !== 0) || 'Permission is required',
]);


const form = reactive({
    valid: true,
    name: '',
    nameRule: [(v: string) => !!v || 'Name is required'],
    description: '',
    descriptionRule: [(v: string) => !!v || 'Description is required'],
    // permission: '',
    // permissionRule: [(v: string) => !!v || 'Description is required'],
});

const manageTrigger = ManageTrigger.getInstance;

async function validate() {
    const { valid } = await formRef.value.validate();
    console.log(valid);
    if (valid) {
        if (props.onEdit) {
            await manageTrigger.updateTrigger(form.name, form.description, props.trigger.serviceId, permissions.value);
        } else {
            await manageTrigger.createTrigger(form.name, form.description, props.serviceId, permissions.value);
        }
        console.log(props.serviceId);
        console.log(form.name);
        console.log(form.description);
        console.log(permissions.value);
        
        props.onCancel();
    }
}


function resetValidation() {
    formRef.value.resetValidation()
}

</script>


