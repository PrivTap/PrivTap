import { Schema, model, Document } from "mongoose";
import { IOperation } from "./Operation";

export interface IAction extends Document {
    data: string;
    operation: IOperation;
}

const actionSchema = new Schema<IAction>({
    data:{
        //TODO: change this type
        type: String,
    },
    operation: {
        type: Schema.Types.ObjectId
    }

},
{ collection: "Action" }
);

export default class Action {

    private static actionModel = model<IAction>("Action", actionSchema);

}