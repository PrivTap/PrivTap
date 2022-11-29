import type RarObjectModel from "./rar_model";

export default class PermissionModel {
    _id: string;
    serviceId: string;
    name: string;
    description: string;
    rarObject: RarObjectModel;

    constructor(
        permissionId: string,
        serviceId: string,
        name: string,
        description: string,
        rarObject: RarObjectModel
    ) {
        this._id = permissionId;
        this.serviceId = serviceId;
        this.name = name;
        this.description = description;
        this.rarObject = rarObject;
    }
}
