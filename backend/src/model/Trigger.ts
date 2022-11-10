import {Schema, model, Document} from "mongoose";
import {IOperation} from "./Operation";

export interface ITrigger extends Document {
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

export default model<ITrigger>("Trigger", triggerSchema);