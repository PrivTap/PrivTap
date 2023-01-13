import mongoose, { Schema, Types } from "mongoose";
import Service from "./Service";
import Model from "../Model";
import logger from "../helper/logger";
import Permission, { IPermission } from "./Permission";
import { DataDefinition } from "../helper/dataDefinition";
import permission from "./Permission";
import { findAllOperationAddingAuthorizedTag } from "../helper/misc";
import Action from "./Action";
import Rule from "./Rule";

export interface ITrigger {
    _id: string;
    name: string;
    description: string;
    serviceId: string;
    outputs: string;
    permissions?: Types.Array<string> | Partial<IPermission>[];
    resourceServer?: string;
    authorized?: boolean;
    data?: Types.Array<string>; // TO DEFINE
}

const triggerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    outputs: {
        type: String,
        required: true
    },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "permission" }],
    resourceServer: {
        type: String
    },
    data: [String]
});

class Trigger extends Model<ITrigger> {

    constructor() {
        triggerSchema.post("deleteOne", async (doc) => {
            //Propagate deletion to all rules
            try {
                const rules = (await Rule.findAll({ triggerId: doc._id })) ?? [];
                for (const rule of rules) {
                    if (rule._id) {
                        try {
                            await Rule.delete(rule._id);
                        } catch (error) {
                            logger.log(error);
                        }
                    }
                }
            } catch (error) {
                logger.log(error);
            }
        });
        super("trigger", triggerSchema);
    }

    /**
     * Finds all the triggers provided by a service
     * @param serviceId the id of the service
     * @param associated Default false. If true, it returns the triggers containing all the permissions of the service with a boolean field associated. "associated" is true if the permission is already associated to the trigger.
     */
    async findAllForService(serviceId: string, associated = false): Promise<Partial<ITrigger>[] | null> {
        let triggers: ITrigger[] | null;
        if (associated)
            //we don't populate the permissions, permissions is now an array of idPermission (string)
            triggers = await this.findAll({ serviceId }, "-serviceId");
        else
            //we populate the permissions, permissions is now an Array of IPermission
            triggers = await this.findAll({ serviceId }, "-serviceId", "permissions", "name description");
        if (triggers == null)
            return null;
        const triggersResult = new Array<Partial<ITrigger>>();
        for (const trigger of triggers) {
            if (trigger.permissions != undefined) {
                let allPermAndAssociated;
                if (associated)
                    allPermAndAssociated = await Permission.getAllPermissionAndAddBooleanTag(serviceId, trigger.permissions as string[]);

                const triggerResult: Partial<ITrigger> = {
                    name: trigger.name,
                    _id: trigger._id,
                    resourceServer: trigger.resourceServer,
                    description: trigger.description,
                    permissions: associated ? (allPermAndAssociated ? allPermAndAssociated : []) : trigger.permissions as Partial<IPermission>[],
                    outputs: trigger.outputs,
                };
                triggersResult.push(triggerResult);
            }
        }
        return triggersResult;
    }

    /**
     * Returns all the triggers of the following serviceId.The response object includes name, description,populated permission and authorized.
     * A trigger is authorized if the grantedPermission of the user contains the permission of the trigger.
     * @param userId the id of the user
     * @param serviceId the id of the service
     */

    async findAllTriggerAddingAuthorizedTag(userId: string, serviceId: string): Promise<Partial<ITrigger>[] | null> {
        try {
            return await findAllOperationAddingAuthorizedTag(this.model, userId, serviceId) as Partial<ITrigger>[];
        } catch (e) {
            logger.debug(e);
            return null;
        }
    }

    /**
     * Checks if a user is the creator of a trigger.
     * @param userId the id of the user
     * @param triggerId the id of the trigger
     */
    async isCreator(userId: string, triggerId: string) {
        const trigger = await this.findById(triggerId);
        if (trigger == null)
            return false;
        return Service.isCreator(userId, trigger.serviceId);
    }

    /**
     * Find the url for notification of the trigger service of a rule and the id of the service
     * @param: triggerId is the id of the trigger in the rule
     */
    // This doesn't work: return only the serviceId
    // example output:
    // { serviceId: new ObjectId("639dcb606b1eb8eff9ed80e1") }
    async getTriggerServiceNotificationServer(triggerId: string): Promise<Partial<triggerServiceNotificationServer> | null> {
        try {
            const result = await this.model.aggregate()
                .match({ _id: new mongoose.Types.ObjectId(triggerId) })
                //keep only the serviceId
                .project({ _id: 0, "serviceId": 1 })
                //left outer join with collection service
                .lookup({ from: "services", localField: "serviceId", foreignField: "_id", as: "service" })
                .unwind({ path: "$service" })
                .addFields({ triggerNotificationServer: "$service.triggerNotificationServer" })
                //remove all the field except the trigger Notification center
                .project({
                    _id: 0,
                    "triggerNotificationServer": 1,
                    "serviceId": 1
                }) as Partial<triggerServiceNotificationServer>[];
            //this way should return a list of documents and in each document there should be only the
            //triggerNotificationServer
            if (result.length > 1) {
                logger.debug("Should only have one element here");
            }
            return result[0];
        } catch (e) {
            logger.debug("Unexpected error while finding the trigger notification url after creating a rule" + e);
            return null;
        }
    }
}

export default new Trigger();

export interface triggerServiceNotificationServer {
    serviceId: string,
    triggerNotificationServer: string,
    triggerId: string
}
