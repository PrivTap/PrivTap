import { Schema } from "mongoose";
import Model from "../Model";

export interface IState {
    _id: string;
    value: string;
    userId: string;
    serviceId: string;
    permissionId: string[];
}

const stateSchema = new Schema({
    value: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    permissionId: {
        type: [Schema.Types.ObjectId],
        required: true
    }
});

class State extends Model<IState> {

    constructor() {
        super("state", stateSchema);
    }

    async findByValue(value: string): Promise<IState | null> {
        try{
            const res=await this.find({ value: value });
            console.log(res);
            return res;
        }catch (e) {
            return null;
        }
    }

}

export default new State();





