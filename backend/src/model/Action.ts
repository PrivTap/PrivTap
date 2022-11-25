import { Schema, Types } from "mongoose";
import Service from "./Service";
import Model from "../Model";

export interface IAction {
    _id: string;
    name: string;
    description: string;
    serviceId: string;
    endpoint: string;
    permissions?: Types.Array<string>;
}

const actionSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    description: {
        type: String,
        required: true,
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    endpoint: {
        type: String,
        required: true
    },
    permissions: [Schema.Types.ObjectId]
});

class Action extends Model<IAction> {

    constructor() {
        super("action", actionSchema);
    }

    /**
     * Finds all the actions provided by a service.
     * @param serviceId the id of the service
     */
    async findAllForService(serviceId: string): Promise<Partial<IAction>[] | null> {
        return await this.findAll({ serviceId }, "-serviceId -endpoint");
    }

    /**
     * Checks if a user is the creator of an action.
     * @param userId the id of the user
     * @param actionId the id of the action
     */
    async isCreator(userId: string, actionId: string): Promise<boolean> {
        const action = await this.findById(actionId);
        if (action == null)
            return false;
        return await Service.isCreator(userId, action.serviceId);
    }
}

export default new Action();