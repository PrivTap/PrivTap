import {model as mongooseModel, Schema, Types} from "mongoose";
import logger from "../helper/logger";
import Permission from "./Permission";
import ResourceHelper from "../helper/resourceHelper";

export interface IAuthorization {
    _id: string;
    userId: string;
    permissionIds: string[];
    code: string;
    oauthToken: string;
}

const authorizationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        unique: true
    },
    permissionIds: {
        type: [Types.ObjectId],
    },
    code: {
        type: String
    },
    oauthToken: {
        type: String
    }
});

class Authorization {
    model = mongooseModel<IAuthorization>("authorization", authorizationSchema);

    async insert(document: Partial<IAuthorization>): Promise<boolean>{
        const model = new this.model(document);
        try {
            await model.save();
            return true;
        } catch (e) {
            if ((e as Error).name == "MongoServerError"){
                logger.debug("The Authorization already exists");
                return true;
            }
            console.log("Error inserting authorization", e);
            return false;
        }
    }

    async update(update: Partial<IAuthorization>, filter: Partial<IAuthorization>): Promise<boolean>{
        try{
            await this.model.updateOne(filter, update);
            return true;
        } catch (e) {
            console.log("Error updating authorization", e);
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

    async findByToken(oauthToken: string): Promise<IAuthorization | null>{
        return this.model.findOne({ oauthToken });
    }

    async findByUserId(userId: string): Promise<IAuthorization | null>{
        return this.model.findOne({ userId });
    }

    async isAuthorized(oauthToken: string, eventDataParameters: {userGranularity: string[], postGranularity: string[]}): Promise<boolean>{
        const authorization = await this.model.findOne({ oauthToken }) as IAuthorization;
        if (!authorization)
            return false;

        const permissions = await Permission.findAll(authorization.permissionIds);
        if (!permissions)
            return false;

        const userGranularityList = eventDataParameters.userGranularity;
        for (let i=0; i<userGranularityList.length; i++){
            if(permissions.filter(permission => permission.userGranularity == userGranularityList[i]).length == 0)
                return false;
        }

        const postGranularityList = eventDataParameters.postGranularity;
        for (let i=0; i<postGranularityList.length; i++){
            if(permissions.filter(permission => permission.postGranularity == postGranularityList[i]).length == 0)
                return false;
        }

        return true;
    }

    async retrieveData(oauthToken: string, eventDataParameters: {userGranularity: string[], postGranularity: string[]}): Promise<object>{
        const userGranularityList = eventDataParameters.userGranularity.filter(granularity => granularity != "none");
        const authorization = await this.model.findOne({ oauthToken }) as IAuthorization;
        const userId = authorization.userId;
        let userData = [];
        for (let i=0; i<userGranularityList.length; i++){
            const data = await ResourceHelper.getUserResource(userId, userGranularityList[i]);
            userData.push(data);
        }

        const postGranularityList = eventDataParameters.postGranularity.filter(granularity => granularity != "none");
        let postData = [];
        for (let i=0; i<postGranularityList.length; i++){
            const data = await ResourceHelper.getPostResource(userId, postGranularityList[i]);
            postData.push(data);
        }

        return {"userData": userData, "postData": postData};
    }
}

export default new Authorization();





