import type PermissionModel from "./permission_model";

export default class ActionModel {
    _id: string;
    name: string;
    description: string;
    serviceId?: string;
    permissions: Partial<PermissionModel>[];
    endpoint: string;
    authorized?: boolean;
    inputs: string;
    constructor(
        actionId: string,
        name: string,
        description: string,
        permissions: Partial<PermissionModel>[],
        endpoint: string,
        inputs: string,
        authorized?: boolean
    ) {
        this._id = actionId;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
        this.endpoint = endpoint;
        this.authorized= authorized;
        this.inputs = inputs;
    }
}