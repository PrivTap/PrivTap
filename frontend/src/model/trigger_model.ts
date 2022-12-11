import type PermissionModel from "./permission_model";

export default class TriggerModel {
    _id: string;
    name: string;
    description: string;
    serviceId?: string;
    permissions: Partial<PermissionModel>[];
    resourceServer?: string;

    constructor(
        _id: string,
        name: string,
        description: string,
        permissions: Partial<PermissionModel>[],
        resourceServer?: string
    ) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
        this.resourceServer = resourceServer;
    }

}

export function clone(triggerModel: TriggerModel): TriggerModel {
    let permClone = [] as Partial<PermissionModel>[];
    triggerModel.permissions.forEach((perm) => permClone.push(perm));
    return new TriggerModel(triggerModel._id, triggerModel.name, triggerModel.description, permClone, triggerModel.resourceServer);
}