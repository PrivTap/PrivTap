import SimplePermissionModel from "./simple_permission_model";

export default class PermissionModel {
    _id: string;
    serviceId: string;
    name: string;
    description: string;
    authorization_details: object;
    associated: boolean;

    constructor(
        permissionId: string,
        serviceId: string,
        name: string,
        description: string,
        authorization_details: object,
        associated: boolean = false,
    ) {
        this._id = permissionId;
        this.serviceId = serviceId;
        this.name = name;
        this.description = description;
        this.authorization_details = authorization_details;
        this.associated = associated;
    }

    toSimplePermissionModel(): SimplePermissionModel {
        return new SimplePermissionModel(this._id, this.name, this.associated, this.description);
    }
}
