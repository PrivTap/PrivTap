import type PermissionModel from "@/model/permission_model";
import { ref } from "vue";
import { GenericController } from "@/controllers/generic_controller";

const path = "/permissions";
let permissions = ref<PermissionModel[]>([]);

export interface IManagePermission {
    getPermissions(serviceId: string, map: Function): Promise<void>;

    createPermission(serviceId: string, name: string, description: string, authorization_details: object): Promise<void>;

    deletePermission(serviceId: string, permissionId: string): Promise<void>;

    updatePermission(serviceId: string, permissionId: string, name: string, description: string, authorization_details: object): Promise<void>;
}

class ManagePermission extends GenericController<PermissionModel[]> implements IManagePermission {
    getRef() {
        return permissions;
    }

    async getPermissions(serviceId: string): Promise<void> {
        permissions.value = await super.get(path, { query: { serviceId: serviceId } });
    }

    async createPermission(serviceId: string, name: string, description: string, authorization_details: object): Promise<void> {
        const newPermission = await super.post<PermissionModel>(path, {
            body: {
                serviceId,
                name,
                description,
                authorization_details
            }, message: "Permission created successfully"
        })
        permissions.value.push(newPermission);
    }

    async deletePermission(serviceId: string, permissionId: string): Promise<void> {
        await super.delete(path, { body: { serviceId, permissionId }, message: "Permission deleted successfully" });
        permissions.value = permissions.value.filter((permission) => permission._id !== permissionId);
    }

    async updatePermission(serviceId: string, permissionId: string, name: string, description: string, authorization_details: object) {
        const body = {
            serviceId,
            permissionId,
            name,
            description,
            authorization_details
        }
        const updatedPermission = await super.put<PermissionModel>(path, {
            body: body,
            message: "Permission updated successfully"
        })
        const index = permissions.value.findIndex((permission) => permission._id === permissionId);
        if (index !== -1)
            permissions.value[index] = updatedPermission;
    }

    async getSelectedPermission(serviceId: string, permissionsArray: string[]): Promise<PermissionModel[]> {
        const perms = await super.get<PermissionModel[]>(path, { query: { serviceId: serviceId } });
        let temp = Array<PermissionModel>();
        perms.map((perm) => {
            if (permissionsArray.includes(perm._id)) {
                temp.push(perm);
            }
        });
        return temp;
    }
}

export default new ManagePermission();