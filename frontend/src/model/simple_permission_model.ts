export default class SimplePermissionModel {
    _id: string;
    name: string;
    description: string;
    authorized: boolean;

    constructor(
        permissionId: string,
        name: string,
        description: string,
        authorized: boolean
    ) {
        this._id = permissionId;
        this.name = name;
        this.description = description;
        this.authorized = authorized;
    }
}
