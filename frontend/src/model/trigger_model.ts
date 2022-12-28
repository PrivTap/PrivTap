import type PermissionModel from "./permission_model";

export default class TriggerModel {
    _id: string;
    name: string;
    description: string;
    serviceId?: string;
    permissions: Partial<PermissionModel>[];
    resourceServer: string;
    authorized?: boolean;

    constructor(
        _id: string,
        name: string,
        description: string,
        permissions: Partial<PermissionModel>[],
        resourceServer: string,
        authorized?: boolean,
    ) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
        this.resourceServer = resourceServer;
        this.authorized= authorized;
    }

}
