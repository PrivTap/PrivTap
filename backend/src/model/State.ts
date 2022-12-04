import { Schema, Types } from "mongoose";
import Model from "../Model";

export interface IState {
    _id: string;
    value: string;
    userId: string;
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
        type: Types.ObjectId,
        required: true
    },
    permissionId: {
        type: [Types.ObjectId],
        required: true
    }
});

class State extends Model<IState> {

    constructor() {
        super("state", stateSchema);
    }

    async findByValue(value: string): Promise<IState | null> {
        return await this.find({ value });
    }

}

export default new State();





