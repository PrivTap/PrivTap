//define what is scope
import { Schema } from "mongoose";

export interface IPermission {
    readonly scope: string;
    readonly name: string;
}

export class Permission implements IPermission {
    readonly scope: string;
    readonly name: string;

    static schema = new Schema<IPermission>({
        name: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        scope: {
            type: String,
            required: true,
        },
    });

    constructor(scope: string, name: string) {
        this.scope = scope;
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public getScope(): string {
        return this.scope;
    }
}