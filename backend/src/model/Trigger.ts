import { Schema, model } from "mongoose";
import { IOperation } from "./Operation";

export interface ITrigger {
    data: string;
    operation: IOperation;
}

const triggerSchema = new Schema<ITrigger>({
    data:{
        //TODO: change this type
        type: String,
    },
    operation: {
        type: Schema.Types.ObjectId,
    }

},
{ collection: "trigger" }
);

export default class Trigger {

    private static triggerModel = model<ITrigger>("Trigger", triggerSchema);

}