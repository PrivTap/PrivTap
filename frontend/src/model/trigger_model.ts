import type SimplePermissionModel from "./simple_permission_model";

export default class TriggerModel {
    _id: string;
    name: string;
    description: string;
    serviceId?: string;
    permissions: SimplePermissionModel[];
    inputs?: string[];
    resourceServer?: string;

    constructor(
        _id: string,
        name: string,
        description: string,
        permissions: SimplePermissionModel[],
    ) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
    }
}