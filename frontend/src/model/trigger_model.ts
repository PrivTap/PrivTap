 
export default class TriggerModel {
    _id: string;
    name: string;
    description: string;
    serviceId: string;
    permissions: string[];

    constructor(
        triggerId: string,
        name: string,
        description: string,
        serviceId: string,
        permissions: string[],

    ) {

        this._id = triggerId;
        this.name = name;
        this.description = description;
        this.serviceId = serviceId;
        this.permissions = permissions;
    }
}