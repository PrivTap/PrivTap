
export default class TriggerModel {
    _id: string;
    name: string;
    description: string;
    serviceId?: string;
    permissions: string[];
    inputs?: string[];
    resourceServer?: string;

    constructor(
        _id: string,
        name: string,
        description: string,
        permissions: string[],
    ) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
    }
}