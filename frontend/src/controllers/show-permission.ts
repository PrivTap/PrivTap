import type Ref from "vue";
import {ref} from "vue";
import {GenericController} from "@/controllers/generic_controller";
import type SimplePermissionModel from "@/model/simple_permission_model";
import axiosInstance from "@/helpers/axios_service";
import {useToast} from "vue-toastification";
import axiosCatch from "@/helpers/axios_catch";

const path = "/permission-authorized";
let permissions = ref<SimplePermissionModel[]>([]);

export interface IShowPermissions {
    getAllPermissions(serviceId: string): Promise<Ref.Ref<SimplePermissionModel[]>>;

}

export class ShowPermissions extends GenericController<SimplePermissionModel[]> implements IShowPermissions {

    async getAllPermissions(serviceId: string) {
        const result = await super.get<SimplePermissionModel[]>(path, {query: {serviceId: serviceId}})
        permissions.value = !!result ? result : [];
        return permissions;
    }


    getRef() {
        return permissions;
    }

    async postOAuth(serviceId: string, permissionId: string[]) {
        const path = "service-authorization";
        const body = {
            serviceId: serviceId,
            permissionId: permissionId
        }
        const res = await axiosInstance.post(path, body);
        const redirectUri = res.data.data.redirectUri;
        console.log(redirectUri);
        //TODO put here something to check before the redirectUri
        /*const res1 = await axiosInstance.get(path);
        if (res1.status != 404 && res.status != 500)*/
            window.location.href = redirectUri;
        /*else
            useToast().error("Problem while contacting this service. Avoid to use it");*/
    }

    async sendCodeOAuth(code: string, state: string) {
        const path = "oauth";
        try {
            const res = await axiosInstance.get(path, {params: {code: code, state: state}});
            if (res.status == 200)
                useToast().success("Authorization Granted!");
        } catch
            (error) {
            axiosCatch(error);
            return null
        }
    }
}

export default new ShowPermissions();
