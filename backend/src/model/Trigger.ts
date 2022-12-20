import mongoose, { Schema, Types } from "mongoose";
import Service from "./Service";
import Model from "../Model";
import logger from "../helper/logger";
import Permission, { IPermission } from "./Permission";
import { DataDefinition } from "../helper/dataDefinition";
import permission from "./Permission";
import Authorization from "./Authorization";

export interface ITrigger {
    _id: string;
    name: string;
    description: string;
    serviceId: string;
    outputs: DataDefinition;
    permissions?: Types.Array<string> | Types.Array<Partial<IPermission>>;
    resourceServer?: string;
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
        type: String
        // required?
    },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "permission" }],
    resourceServer: {
        type: String
    },
    data: [String]
});

class Trigger extends Model<ITrigger> {

    constructor() {
        super("trigger", triggerSchema);
    }

    /**
     * Finds all the triggers provided by a service
     * @param serviceId the id of the service
     * @param associated Default false. If true, it returns the triggers containing all the permissions of the service with a boolean field associated. "associated" is true if the permission is already associated to the trigger.
     */
    async findAllForService(serviceId: string, associated = false): Promise<TriggerOsp[] | null> {
        let triggers: ITrigger[] | null;
        if (associated)
            //we don't populate the permissions, permissions is now an array of idPermission (string)
            triggers = await this.findAll({ serviceId }, "-serviceId");
        else
            //we populate the permissions, permissions is now an Array of IPermission
            triggers = await this.findAll({ serviceId }, "-serviceId", "permissions", "name description");
        if (triggers == null)
            return null;
        const triggersResult = new Array<TriggerOsp>();
        for (const trigger of triggers) {
            if (trigger.permissions != undefined) {
                let allPermAndAssociated;
                if (associated)
                    allPermAndAssociated = await Permission.getAllPermissionAndAddBooleanTag(serviceId, trigger.permissions as Types.Array<string>);

                const triggerResult: TriggerOsp = {
                    name: trigger.name,
                    _id: trigger._id,
                    resourceServer: trigger.resourceServer,
                    description: trigger.description,
                    permissions: associated ? (allPermAndAssociated ? allPermAndAssociated : []) : trigger.permissions as Types.Array<Partial<IPermission>>
                };
                triggersResult.push(triggerResult);
            }
        }
        return triggersResult;
    }


    async findAllTriggerAuthorizedByUser(userId: string, serviceId: string): Promise<TriggerOsp[] | null> {
        let grantedPermissionId = await Authorization.getGrantedPermissionsId(userId, serviceId);
        if (grantedPermissionId == null)
            grantedPermissionId = [];
        let result;
        try {
            result = await this.model.aggregate()
                .match({ serviceId: new mongoose.Types.ObjectId(serviceId) })
                .match({
                    $expr: {
                        $setIsSubset: ["$permissions", grantedPermissionId]
                    }
                })
                .project({ "outputs": 0, "data": 0, "serviceId": 0 }) as TriggerOsp[];
        } catch (e) {
            console.log(e);
            return null;
        }
        return result;
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

export interface TriggerOsp {
    _id: string,
    name: string,
    description: string,
    resourceServer?: string,
    permissions?: Partial<IPermission>[]
}