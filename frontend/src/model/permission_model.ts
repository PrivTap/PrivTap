export class PermissionModel {
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

export class RarObjectModel {
    type: string;
    actions: string[];
    locations: string[];

    constructor(type: string, actions: string[], locations: string[]) {
        this.type = type;
        this.actions = actions;
        this.locations = locations;
    }
}