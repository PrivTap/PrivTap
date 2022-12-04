 
export default class TriggerModel {
    _id: string;
    name: string;
    description: string;
    serviceId?: string;
    permissions: string[];
    inputs: string[];
    endpoint?: string;

    constructor(
        triggerId: string,
        name: string,
        description: string,
        permissions: string[],
        inputs: string[],

    ) {

        this._id = triggerId;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
        this.inputs = inputs;
    }
}