

export default class PermissionModel {
    _id: string;
    serviceId: string;
    name: string;
    description: string;
    authorization_details: object;

    constructor(
        permissionId: string,
        serviceId: string,
        name: string,
        description: string,
        authorization_details: object,
    ) {
        this._id = permissionId;
        this.serviceId = serviceId;
        this.name = name;
        this.description = description;
        this.authorization_details = authorization_details;
    }
}
