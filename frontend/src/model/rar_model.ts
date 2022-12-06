
export default class RarObjectModel {
    type: string;
    actions: string[];
    locations: string[];

    constructor(type: string, actions: string[], locations: string[]) {
        this.type = type;
        this.actions = actions;
        this.locations = locations;
    }
}