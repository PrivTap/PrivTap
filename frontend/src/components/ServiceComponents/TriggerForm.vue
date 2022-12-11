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
                    <v-text-field v-model="form.resourceServer" :rules="form.resourceServerRule" label="ResourceServer"
                    required></v-text-field>
                    <v-label class="mb-2 mt-4">Choose Permissions</v-label>
                    <v-row align-content="start" no-gutters class="-translate-x-3 h-14"
                        >
                        <v-col cols="2" align-self="start" v-for="choosablePerm in choosablePermissions.perm" :key="choosablePerm._id">
                            <v-checkbox v-model="choosablePerm.associated" :label="choosablePerm.name"
                                color="success"></v-checkbox>
                        </v-col>
                    </v-row>
                <v-divider class="my-5"></v-divider>
            </v-form>
        </v-card-text>
        <v-row class="px-8 space-x-6">
            <v-btn color="info" text @click="validate"> {{ props.onEdit ? 'Edit' : 'Create' }}</v-btn>
            <v-btn color="red" variant="outlined" text @click="resetValidation">Reset</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" text @click="onClose()">Cancel</v-btn>
        </v-row>
    </v-card>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import TriggerModel from '@/model/trigger_model';
import { isValidUrlRegex } from '@/helpers/validators';
import manage_permission from '@/controllers/manage_permission';
import manage_trigger from '@/controllers/manage_trigger';
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
        trigger: {
            type: TriggerModel,
            required: false,
            default: null
        },
    }
);

onMounted(async () => {
    if (props.onEdit && props.trigger) {
        const trigger = props.trigger;
        form.name = trigger.name;
        form.description = trigger.description;
        form.resourceServer = trigger.resourceServer ?? '';
        choosablePermissions.perm = trigger.permissions
    }else{
        await manage_permission.getAllPermissions(props.serviceId);
        choosablePermissions.perm = manage_permission.getRef().value;
    }
});

const choosablePermissions = reactive<{perm: Partial<PermissionModel>[]}>({
    perm: []
})

/// Form part
const formRef = ref();
const form = reactive({
    valid: true,
    name: '',
    nameRule: [(v: string) => !!v || 'Name is required'],
    description: '',
    descriptionRule: [(v: string) => !!v || 'Description is required'],
    resourceServer: '',
    resourceServerRule: [
        (v: string) => !!v || 'Resource Server is required',
        (v: string) => isValidUrlRegex(v) || 'Resource Server is not valid'
    ],
});

async function onClose() {
    await manage_trigger.getAllTriggers(props.serviceId);
    props.onCancel();
}

async function validate() {
    const { valid } = await formRef.value.validate();
    console.log(valid);
    if (valid) {
        const perm = choosablePermissions.perm.filter(p => p._id !== undefined && p.associated === true).map(p => p._id) as string[];
        if (props.onEdit) {
            await manage_trigger.updateTrigger(props.trigger._id, form.name, form.description, perm, form.resourceServer);
        } else {
            await manage_trigger.createTrigger(form.name, form.description, props.serviceId, perm, form.resourceServer);
        }
        onClose();
    }
}

function resetValidation() {
    formRef.value.resetValidation()
}

</script>


