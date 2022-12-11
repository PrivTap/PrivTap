import type PermissionModel from "./permission_model";

export default class ActionModel {
    _id: string;
    name: string;
    description: string;
    serviceId?: string;
    permissions: Partial<PermissionModel>[];
    endpoint?: string;

    constructor(
        actionId: string,
        name: string,
        description: string,
        permissions: Partial<PermissionModel>[],
        endpoint?: string,
    ) {
        this._id = actionId;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
        this.endpoint = endpoint;
    }
}

export function clone(acitonModel: ActionModel): ActionModel {
    let permClone = [] as Partial<PermissionModel>[];
    acitonModel.permissions.forEach((perm) => permClone.push(perm));
    return new ActionModel(acitonModel._id, acitonModel.name, acitonModel.description, permClone, acitonModel.endpoint);
}