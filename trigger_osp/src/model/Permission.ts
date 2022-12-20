import {model as mongooseModel, Schema, Types} from "mongoose";
import {authorizationType, location, operation, postGranularity, userGranularity} from "../Granularity";
import logger from "../helper/logger";
import Post from "./Post";

export interface IPermission {
    _id: string;
    userId: string,
    operation: string;
    authorizationType: string;
    location: string;
    userGranularity: string;
    postGranularity: string;
    authorized: boolean;
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
    },
    authorized:{
        type: Boolean,
        required: true,
        default: false
    }
});

permissionSchema.index({ userId: 1, operation: 1, authorizationType: 1, location: 1, userGranularity: 1, postGranularity:1 }, { unique: true });

class Permission {
    model = mongooseModel<IPermission>("permission", permissionSchema);

    checkSchema(document: Partial<IPermission>): boolean{
        // Hardcoded, I'm sure there is a better solution
        if (!(document.operation &&  Object.keys(operation).includes(document.operation))) {
            return false;
        }
        if (!(document.authorizationType && Object.keys(authorizationType).includes(document.authorizationType))) {
            return false;
        }
        if (!(document.location && Object.keys(location).includes(document.location ))) {
            return false;
        }
        if (!(document.userGranularity && Object.keys(userGranularity).includes(document.userGranularity))) {
            return false;
        }
        if (!(document.postGranularity &&  Object.keys(postGranularity).includes(document.postGranularity))) {
            return false;
        }
        return true;
    }

    async insert(document: Partial<IPermission>, returnId=false): Promise<boolean | string>{
        const model = new this.model(document);
        try {
            await model.save();
            if (returnId){
                return model._id;
            }
            return true;
        } catch (e) {
            // Duplicate insertion
            if ((e as Error).name == "MongoServerError"){
                logger.debug("The permission already exists");
                if (returnId){
                    return model._id;
                }
                return true;
            }
            console.log("Error inserting permission", e);
        }
        return false;
    }

    async insertAll(documents: Partial<IPermission>[]): Promise<string[] | null> {
        let permissionIds: string[] = [];
        for (let i = 0; i < documents.length; i++) {
            const documentId = await this.insert(documents[i], true) as string;
            if (!documentId) {
                return null;
            }
            permissionIds.push(documentId)
        }
        return permissionIds;
    }

    // Is there a better way to generalize this?
    getAggregateData(permissions: IPermission[]): {operations: string[], authorizationTypes: string[], userGranularities: string[], postGranularities: string[]}{
        let operations: string[] = [];
        let authorizationTypes: string[] = [];
        let userGranularities: string[] = [];
        let postGranularities: string[] = [];

        let operationKeys = Object.keys(operation);
        let authorizationTypeKeys = Object.keys(authorizationType);
        let userGranularityKeys = Object.keys(userGranularity);
        let postGranularityKeys = Object.keys(postGranularity);

        type OperationKey = keyof typeof operation
        type AuthorizationTypeKey = keyof typeof authorizationType
        type PostGranularityKey = keyof typeof postGranularity
        type UserGranularityKey = keyof typeof userGranularity

        permissions.forEach(permission => {
            const opKey = permission.operation as OperationKey
            if(operationKeys.includes(opKey as string)){
                operations.push(operation[opKey]);
                operationKeys = operationKeys.filter(key => key != opKey);
            }

            const authKey = permission.authorizationType as AuthorizationTypeKey
            if(authorizationTypeKeys.includes(authKey)){
                authorizationTypes.push(authorizationType[authKey]);
                authorizationTypeKeys = authorizationTypeKeys.filter(key => key != authKey);
            }

            const userKey = permission.userGranularity as UserGranularityKey
            if(userGranularityKeys.includes(userKey)){
                userGranularities.push(userGranularity[userKey]);
                userGranularityKeys = userGranularityKeys.filter(key => key != userKey);
            }

            const postKey = permission.postGranularity as PostGranularityKey
            if(postGranularityKeys.includes(postKey)){
                postGranularities.push(postGranularity[postKey]);
                postGranularityKeys = postGranularityKeys.filter(key => key != postKey);
            }
        })

        return {
            operations,
            authorizationTypes,
            userGranularities,
            postGranularities
        };
    }

    async deleteUnauthorizedPermissions(userId: string): Promise<boolean>{
        try{
            this.model.deleteMany({ userId, authorized: false });
            return true;
        } catch (e) {
            logger.debug("Error deleting unauthorized permissions", e);
            return false;
        }
    }

    async authorizePermissions(userId: string): Promise<string[] | null>{
        try{
            this.model.updateMany({ userId, authorized: false }, { authorized: true });
            const permissions = await this.model.find({ userId, authorized: true });
            return permissions.map(permission => permission._id);
        } catch (e) {
            return null;
        }
    }

    // TODO: Implement
    async authorized(userId: string, permissions: {[id:string]:string}[]): Promise<boolean>{
        /*
        const authorizedPermissions = await this.model.find({ userId, authorized: true});
        const idk = permissions as Partial<IPermission>;
         */
        return true;
    }

    // TODO: Implement
    async retrieveData(userId: string, permissions: {[id:string]:string}[]): Promise<string>{
        const posts = await Post.findAllByUserId(userId);
        posts.sort((a ,b) => {
            if (a.creationDate < b.creationDate){
                return 1;
            }
            if (a.creationDate > b.creationDate){
                return -1;
            }
            return 0;
        })
        return posts[0].content;
    }

}

export default new Permission();





