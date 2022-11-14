import {IUser} from "./model/documents/User";

declare module "express-serve-static-core" {
    export interface Request {
        user?: IUser
    }
}