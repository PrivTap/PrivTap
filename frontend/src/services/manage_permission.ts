import type PermissionModel from "@/model/permission_model";
import {ref} from "vue";
import {GenericServices} from "@/services/generic-services";

const path = "/permissions";


export interface IManagePermission {
    getPermissions(serviceId: string, map: Function): Promise<void>;

    createPermission(serviceId: string, name: string, description: string, authorization_details: object): Promise<void>;

    deletePermission(serviceId: string, permissionId: string): Promise<void>;

    updatePermission(serviceId: string, permissionId: string, name: string, description: string, authorization_details: object): Promise<void>;
}

export class ManagePermission extends GenericServices<PermissionModel[]> implements IManagePermission {
    permissions;

    constructor() {
        super();
        this.permissions = ref<PermissionModel[]>([]);
    }

    getRef() {
        return this.permissions;
    }

    async getPermissions(serviceId: string): Promise<void> {
        this.permissions.value = await super.get(path, {query: {serviceId: serviceId}});
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
        this.permissions.value.push(newPermission);
    }

    async deletePermission(serviceId: string, permissionId: string): Promise<void> {
        await super.delete(path, {message: "Permission deleted successfully"});
        this.permissions.value = this.permissions.value.filter((permission) => permission._id !== permissionId);
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
        const index = this.permissions.value.findIndex((permission) => permission._id === permissionId);
        if (index !== -1)
            this.permissions.value[index] = updatedPermission;
    }

    async fetchPermissions(serviceId: string, permissionsArray: string []) {
        const perms = await super.get<PermissionModel[]>(path, {query: {serviceId: serviceId}});
        perms.map((perm) => {
            if (permissionsArray.includes(perm._id)) {
                this.permissions.value.push(perm);
            }
        });
    }
}

export default new ManagePermission();