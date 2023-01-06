export default class SimplePermissionModel {
    _id: string;
    name: string;
    authorized: boolean;
    description?: string;

    constructor(
        permissionId: string,
        name: string,
        description?: string,
        authorized: boolean = false,
    ) {
        this._id = permissionId;
        this.name = name;
        this.description = description;
        this.authorized = authorized;
    }
}
