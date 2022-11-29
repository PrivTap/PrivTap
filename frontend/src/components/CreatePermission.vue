<template>
    <div class="w-full max-w-screen-md">
        <el-container direction="vertical" class="bg-slate-900/60 rounded-lg shadow-xl p-10 m-4">
            <p class="text-blue-500 font-medium text-4xl mb-4"> Create Permission </p>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" label-position="top"
                class="demo-ruleForm" :size="formSize" status-icon>
                <el-form-item label="Permission name" prop="name">
                    <el-input v-model="ruleForm.name" />
                </el-form-item>
                <el-form-item label="Permission description" prop="desc">
                    <el-input v-model="ruleForm.desc" type="textarea" rows="3" resize="none" />
                </el-form-item>
                <el-form-item label="Permission type" prop="type">
                    <el-input v-model="ruleForm.type" />
                </el-form-item>
                <el-form-item label="Permission actions" prop="actions">
                    <el-tag v-for="tag in dynamicActions" :key="tag" class="mx-1" closable :disable-transitions="false"
                        @close="handleActionClose(tag)">
                        {{ tag }}
                    </el-tag>
                    <el-input v-if="actionInputVisible" ref="ActionInputRef" v-model="actionInput" class="ml-1 w-20"
                        size="small" @keyup.enter="hangleActionConfirm" @blur="hangleActionConfirm" />
                    <el-button v-else class="button-new-tag ml-1" size="small" @click="showActionInput">
                        + New Action
                    </el-button>
                </el-form-item>
                <br>
                <div class="w-full bg-slate-600/50 h-1 rounded-full"></div>
                <br>
                <div class="space-x-5">
                    <PrimaryButton type="button" text="Confirm" @click.prevent="submitForm(ruleFormRef)"
                        class="pt-2 pb-2" />
                    <OutlinedButton text="Reset" @click.prevent="resetForm(ruleFormRef)"
                        class="pt-2 pb-2 lg:rounded-md rounded-md ring-2" />
                </div>
            </el-form>
        </el-container>
    </div>
</template>
  
<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue'
import { ElButton, ElForm, ElFormItem, ElInput, ElTag, type FormInstance, type FormRules } from 'element-plus'
import PrimaryButton from '@/components/PrimaryButton.vue';
import OutlinedButton from './OutlinedButton.vue';
import ManagePermission from '@/services/manage_permission';
import RarObjectModel from '@/model/rar_model';

const props = defineProps<{
    serviceId: string;
}>();

const managePermission = ManagePermission.getInstance;
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            await managePermission.createPermission(
                props.serviceId,
                ruleForm.name,
                ruleForm.desc,
                new RarObjectModel(
                    ruleForm.type,
                    ruleForm.actions,
                    [],
                )
            );
            resetForm(ruleFormRef.value);
        } else {
            console.log('error submit!', fields)
        }
    })
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    name: '',
    desc: '',
    type: '',
    actions: []
})

const rules = reactive<FormRules>({
    name: [
        { required: true, message: 'Please input Permission name', trigger: 'blur' },
    ],
    desc: [
        { required: true, message: 'Please input Permission description', trigger: 'blur' },
    ],
    type: [
        { required: true, message: 'Please input Permission type', trigger: 'blur' },
    ],
    actions: [
        {
            type: 'array',
            required: true,
            message: 'Please add at least one permission action',
            trigger: 'blur',
            min: 1
        },
        {
            type: 'array',
            required: true,
            message: 'To many permission actions',
            trigger: 'blur',
            max: 10
        },
    ],

})

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

const actionInput = ref('')
const dynamicActions = ref<string[]>(ruleForm.actions);
const actionInputVisible = ref(false)
const ActionInputRef = ref<InstanceType<typeof ElInput>>()

const handleActionClose = (tag: string) => {
    dynamicActions.value.splice(dynamicActions.value.indexOf(tag), 1)
}

const showActionInput = () => {
    actionInputVisible.value = true
    nextTick(() => {
        ActionInputRef.value!.input!.focus()
    })
}

const hangleActionConfirm = () => {
    if (actionInput.value) {
        dynamicActions.value.push(actionInput.value)
    }
    actionInputVisible.value = false
    actionInput.value = ''
}
</script>


