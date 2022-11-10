import {IUser} from "./model/User";

declare module "express-serve-static-core" {
    export interface Request {
        user?: IUser
    }
}