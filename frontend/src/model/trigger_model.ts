import type { List } from "postcss/lib/list";

export default class TriggerModel {
    _id: string;
    name: string;
    serviceId: string;
    description: string;
    premission: string[];
    
    constructor(
        triggerId: string,
        name: string,
        serviceId: string,
        description: string,
        premission: string[],

    ) {

        this._id = triggerId;
        this.name = name;
        this.description = description;
        this.serviceId = serviceId;
        this.premission = premission;
    }
  }