/// Build class for the service

export default class SimpleServiceModel {
    _id: string;
    name: string;
    description: string;
    _v: number;

    constructor(
        serviceId: string,
        name: string,
        description: string,
        _v: number
    ) {
        this._id = serviceId;
        this.name = name;
        this.description = description;
        this._v = _v;
    }
}
