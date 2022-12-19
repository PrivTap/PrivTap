import {model as mongooseModel, Schema} from "mongoose";

export class oAuthAuthorization {
    clientId: String
    redirectUri: String
    state: String
    authorization_details: String

    constructor(clientId: String, redirectUri: String, state: String, authorization_details: String) {
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.state = state;
        this.authorization_details = authorization_details;
    }
}

export interface IState {
    _id: string;
    stateValue: string;
    code_verifier: string;
    oauthAuthorization: oAuthAuthorization
}

const stateSchema = new Schema({
    stateValue: {
        type: String,
        required: true,
    },
    code_verifier: {
        type: String,
        required: true,
    },
    oauthAuthorization: {
        type: {
            clientId: String,
            redirectUri: String,
            state: String,
            authorization_details: String
        }
    }
});

class State {
    model = mongooseModel<IState>("state", stateSchema);

    async insert(document: Partial<IState>): Promise<boolean> {
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

    async deleteByStateValue(stateValue: string): Promise<boolean> {
        const deleteStatus = await this.model.deleteOne({stateValue}) as { deletedCount: number, acknowledged: boolean };
        return deleteStatus.deletedCount == 1;

    }

}

export default new State();





