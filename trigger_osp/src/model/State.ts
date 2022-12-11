import {model as mongooseModel, Schema} from "mongoose";

export interface IState {
    _id: string;
    stateValue: string;
    code_verifier: string;
}

const stateSchema = new Schema({
    stateValue: {
        type: String,
        required: true,
    },
    code_verifier: {
        type: String,
        required: true,
    }
});

class State {
    model = mongooseModel<IState>("state", stateSchema);

    async insert(document: Partial<IState>): Promise<boolean>{
        const model = new this.model(document);
        try {
            await model.save();
            return true;
        } catch (e) {
            console.log("Error inserting state");
        }
        return false;
    }

    async findByStateValue(stateValue: string): Promise<IState | null> {
        return this.model.findOne({stateValue});
    }
}

export default new State();





