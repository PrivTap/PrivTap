import {model as mongooseModel, Schema, Types} from "mongoose";
import {authorizationType, location, operation, postGranularity, userGranularity} from "../Granularity";

export interface IPermission {
    _id: string;
    userId: string,
    operation: string;
    authorizationType: string;
    location: string;
    userGranularity: string;
    postGranularity: string;
}

const permissionSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true
    },
    operation: {
        type: String,
        enum: Object.keys(operation),
        required: true
    },
    authorizationType: {
        type: String,
        enum: Object.keys(authorizationType),
        required: true
    },
    location: {
        type: String,
        enum: Object.keys(location),
        required: true
    },
    userGranularity:{
        type: String,
        enum: Object.keys(userGranularity),
        required: true
    },
    postGranularity:{
        type: String,
        enum: Object.keys(postGranularity),
        required: true
    }
});

class Permission {
    model = mongooseModel<IPermission>("permission", permissionSchema);

    async insert(document: Partial<IPermission>): Promise<boolean>{
        const model = new this.model(document);
        try {
            await model.save();
            return true;
        } catch (e) {
            console.log("Error inserting permission", e);
        }
        return false;
    }

    async getAggregateData(userId: string){
        const permissions = await this.model.find({ userId });
        let operations;
        let authorizationTypes;
        let userGranularities;
        let postGranularities;
        return "";
    }
}

export default new Permission();





