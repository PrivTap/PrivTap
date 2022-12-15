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

    getAggregateData(permissions: IPermission[]): {operations: string[], authorizationTypes: string[], userGranularities: string[], postGranularities: string[]}{
        let operations: string[] = [];
        let authorizationTypes: string[] = [];
        let userGranularities: string[] = [];
        let postGranularities: string[] = [];

        let operationKeys = Object.keys(operation);
        let authorizationTypeKeys = Object.keys(authorizationType);
        let userGranularityKeys = Object.keys(userGranularity);
        let postGranularityKeys = Object.keys(postGranularity);

        /*
        console.log(operationKeys);
        console.log(authorizationTypeKeys);
        console.log(userGranularityKeys);
        console.log(postGranularityKeys);
         */

        // All good


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
}

export default new Permission();





