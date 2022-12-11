export default class ActionModel {
    _id: string;
    name: string;
    description: string;
    serviceId?: string;
    permissions: string[];
    inputs?: string[];
    endpoint?: string;

    constructor(
        actionId: string,
        name: string,
        description: string,
        permissions: string[],
    ) {
        this._id = actionId;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
    }
}