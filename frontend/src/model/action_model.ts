export default class ActionModel {
    _id: string;
    name: string;
    description: string;
    serviceName: string;
    serviceId: string;
  
    constructor(
        actionId: string,
        name: string,
        description: string,
        serviceName: string,
        serviceId: string,
    ) {
        this._id = actionId;
        this.name = name;
        this.description = description;
        this.serviceName = serviceName;
        this.serviceId =serviceId;
    }
  }