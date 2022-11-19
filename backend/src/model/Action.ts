import { Schema, model, Document } from "mongoose";
import { IService } from "./Service";

export interface IAction extends Document {
    description: string;
    name: string;
    service: IService;
    permission: [string];
    data: string;
}

const actionSchema = new Schema<IAction>({
    data:{
        //TODO: change this type
        type: String,
    }
},
{ collection: "Action" }
);

export default class Action {

    private static actionModel = model<IAction>("Action", actionSchema);

}