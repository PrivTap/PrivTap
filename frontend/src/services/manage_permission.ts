import type { PermissionModel, RarObjectModel } from "@/model/permission_model";

export interface IManagePermission {
    getPermissions(serviceId: string): Promise<PermissionModel[] | null>;
    createPermission(serviceId: string, name: string, description: string, rarObject: RarObjectModel): Promise<PermissionModel | null>;
    deletePermission(permissionId: string): Promise<PermissionModel[] | null>;

}