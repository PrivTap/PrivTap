import axiosCatch from "@/helpers/axios_catch";
import { http } from "@/helpers/axios_service";
import type PermissionModel from "@/model/permission_model";
import type RarObjectModel from "@/model/rar_model";
import type { AxiosInstance } from "axios";
import { ref } from "vue";
import { useToast } from "vue-toastification";

export interface IManagePermission {
    getPermissions(serviceId: string): Promise<PermissionModel[]>;
    createPermission(serviceId: string, name: string, description: string, rarObject: RarObjectModel): Promise<PermissionModel | null>;
    deletePermission(serviceId: string, permissionId: string): Promise<PermissionModel[]>;
    updatePermission(serviceId: string, permissionId: string, name: string, description: string, rarObject: RarObjectModel): Promise<PermissionModel | null>;
}

export default class ManagePermission implements IManagePermission {

    private static _instance: ManagePermission;
    http: AxiosInstance;
    path: string = "/permissions";
    permissions = ref<PermissionModel[]>([]);

    private toast = useToast();

    private constructor() {
        this.http = http();
    }

    static get getInstance(): ManagePermission {
        if (!this._instance) {
            this._instance = new ManagePermission();
        }
        return this._instance;
    }

    async getPermissions(serviceId: string): Promise<PermissionModel[]> {
        try {
            const response = await this.http.get(this.path, { params: { serviceId } });
            this.permissions.value = response.data.data as PermissionModel[];
            return this.permissions.value;
        } catch (error) {
            axiosCatch(error);
            return this.permissions.value;
        }
    }

    async createPermission(serviceId: string, name: string, description: string, rarObject: RarObjectModel): Promise<PermissionModel | null> {
        try {
            const response = await this.http.post(this.path, {
                serviceId,
                name,
                description,
                rarObject
            });
            const newPermission = response.data.data as PermissionModel;
            this.toast.success("Permission created successfully");
            this.permissions.value.push(newPermission);
            return newPermission;
        } catch (error) {
            axiosCatch(error);
            return null;
        }
    }

    async deletePermission(serviceId: string, permissionId: string): Promise<PermissionModel[]> {
        try {
            const body = {
                "serviceId": serviceId,
                "permissionId": permissionId
            }
            const response = await this.http.delete(this.path, { data: body });
            this.toast.success("Permission deleted successfully");
            this.permissions.value = this.permissions.value.filter((permission) => permission._id !== permissionId);
            return this.permissions.value;
        } catch (error) {
            axiosCatch(error);
            return this.permissions.value;
        }
    }

    async updatePermission(serviceId: string, permissionId: string, name: string, description: string, rarObject: RarObjectModel): Promise<PermissionModel | null> {
        try {
            const body = {
                "serviceId": serviceId,
                "permissionId": permissionId,
                "name": name,
                "description": description,
                "rarObject": rarObject
            }
            const response = await this.http.put(this.path, body);
            this.toast.success("Permission updated successfully");
            const updatedPermission = response.data.data as PermissionModel;
            const index = this.permissions.value.findIndex((permission) => permission._id === permissionId);
            this.permissions.value[index] = updatedPermission;
            return updatedPermission;
        } catch (error) {
            axiosCatch(error);
            return null;
        }
    }
}