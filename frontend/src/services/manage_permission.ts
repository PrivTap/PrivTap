import axiosCatch from "@/helpers/axios_catch";
import { http } from "@/helpers/axios_service";
import type PermissionModel from "@/model/permission_model";
import type RarObjectModel from "@/model/rar_model";
import type { AxiosInstance } from "axios";
import { useToast } from "vue-toastification";

export interface IManagePermission {
    getPermissions(serviceId: string): Promise<PermissionModel[] | null>;
    createPermission(serviceId: string, name: string, description: string, rarObject: RarObjectModel): Promise<PermissionModel | null>;
    deletePermission(permissionId: string): Promise<PermissionModel[] | null>;
    updatePermission(permissionId: string, name: string, description: string, rarObject: RarObjectModel): Promise<PermissionModel | null>;
}

export default class ManagePermission {

    private static _instance: ManagePermission;
    http: AxiosInstance;
    path: string = "/permissions";

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
            return response.data.data as PermissionModel[];
        } catch (error) {
            axiosCatch(error);
            return [];
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
            this.toast.success("Permission created successfully");
            /// TODO: Here we should return the permission object but from backend the permission object is not returned
            return response.data.data as PermissionModel;
        } catch (error) {
            axiosCatch(error);
            return null;
        }
    }

    async deletePermission(permissionId: string): Promise<PermissionModel[] | null> {
        try {
            ///TODO: Check where pass the permissionId
            const response = await this.http.delete(this.path);
            this.toast.success("Permission deleted successfully");
            ///TODO: Should be better to have as response the list of permissions
            return response.data.data as PermissionModel[];
        } catch (error) {
            axiosCatch(error);
            return null;
        }
    }

    async updatePermission(permissionId: string, name: string, description: string, rarObject: RarObjectModel): Promise<PermissionModel | null> {
        try {
            const response = await this.http.put(this.path, {
                permissionId,
                name,
                description,
                rarObject
            });
            this.toast.success("Permission updated successfully");
            ///TODO: Should be better to have as response the list of permissions or the updated permission
            return response.data.data as PermissionModel;
        } catch (error) {
            axiosCatch(error);
            return null;
        }
    }
}