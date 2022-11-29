import type { List } from "postcss/lib/list";
import type PermissionModel from "./permission_model";

export default class TriggerModel {
    _id: string;
    name: string;
    serviceId: string;
    description: string;
    premission: PermissionModel[];

    constructor(
        triggerId: string,
        name: string,
        serviceId: string,
        description: string,
        premission: PermissionModel[],

    ) {

        this._id = triggerId;
        this.name = name;
        this.description = description;
        this.serviceId = serviceId;
        this.premission = premission;
    }
}