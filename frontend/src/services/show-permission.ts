import {ref} from "vue";

import type Ref from "vue";
import {GenericServices} from "@/services/generic-services";
import type SimplePermissionModel from "@/model/simple_permission_model";

const path = "/permission-authorized";
let permissions = ref<SimplePermissionModel[]>([]);

export interface IShowPermissions {
    getAllPermissions(serviceId: string): Promise<Ref.Ref<SimplePermissionModel[]>>;

}

export class ShowPermissions extends GenericServices<SimplePermissionModel> implements IShowPermissions {

    async getAllPermissions(serviceId: string) {
        const result = await super.get<SimplePermissionModel[]>(path, {query: {serviceId: serviceId}})
        permissions.value = !!result ? result : [];
        return permissions;
    }


    getRef() {
        return permissions;
    }
}

export default new ShowPermissions();
