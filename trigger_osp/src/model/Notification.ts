import {model as mongooseModel, Schema, Types} from "mongoose";
import logger from "../helper/logger";

export interface INotification {
    _id: string;
    userId: string;
    foreignUserId: string;
    foreignTriggerId: string;
    triggerName: string;
}

const notificationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        unique: true
    },
    foreignUserId: {
        type: String,
        required: true,
    },
    foreignTriggerId: {
        type: String,
        required: true,
    },
    triggerName: {
        type: String,
        required: true,
    }
});


class Notification {
    model = mongooseModel<INotification>("notification", notificationSchema);

    async insert(document: Partial<INotification>): Promise<boolean>{
        const model = new this.model(document);
        try {
            await model.save();
            return true;
        } catch (e) {
            if ((e as Error).name == "MongoServerError"){
                logger.debug("The notification already exists");
                return true;
            }
            console.log("Error inserting notification", e);
            return false;
        }
    }

    async update(update: Partial<INotification>, filter: Partial<INotification>): Promise<boolean>{
        try{
            this.model.findOneAndUpdate(filter, update);
            return true;
        } catch (e) {
            console.log("Error updating notification", e);
            return false;
        }
    }

    async delete(userId: string): Promise<boolean>{
        try{
            this.model.deleteOne({userId});
            return true;
        } catch (e) {
            console.log("Error deleting authorization", e);
            return false;
        }
    }

    async find(userId: string, triggerName: string): Promise<INotification[] | null> {
        return this.model.find({userId, triggerName});
    }
}

export default new Notification();





