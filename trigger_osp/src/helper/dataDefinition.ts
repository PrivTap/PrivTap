import { DataType, DataTypeUtil } from "./dataType";

/**
 * The interface of a data model definition for the trigger output and action input
 */
interface IDataDefinition {
    trigger_data: IEntryDefinition[];
}

/**
 * The internal interface object used to define entries in the data definition object
 */
interface IEntryDefinition {
    identifier?: string, //Undefined only for subtypes
    type: DataType,
    data: unknown //The content of the entry
}

export class EntryData implements IEntryDefinition {

    identifier?: string;
    data: unknown;
    type: DataType;

    constructor(externalData: unknown, identifier?: string) {
        //Automagically map the object to a supported type
        this.identifier = identifier;
        this.type = DataTypeUtil.getSupportedType(externalData) ?? DataType.Text;
        if (this.type == DataType.Array) {
            //Recursively convert each of the array objects
            this.data = convertExternalEntryArray(externalData as Array<unknown>);
        } else {
            this.data = externalData; //For simple data where we don't need recursion (e.g. strings)
        }
    }

}

export class TriggerData implements IDataDefinition {

    trigger_data: IEntryDefinition[];

    constructor(data: unknown[], identifiers: string[], dataFilter: string[]) {
        //Automagically map each entry of the array to one of the supported types, skipping any type that is not supported
        this.trigger_data = convertExternalEntryArray(data, identifiers, dataFilter);
    }

}

function convertExternalEntryArray(externalEntryArray: unknown[], identifiers?: string[], dataFilter?: string[]): IEntryDefinition[] {
    let mappedEntries: (IEntryDefinition | null)[] = [];
    for (let index = 0; index < externalEntryArray.length; index++) {
        let shouldPush = true;
        if (dataFilter && identifiers) {
            shouldPush = dataFilter.filter((filterEntry) => filterEntry == identifiers[index]).length > 0;
        }
        if (shouldPush) {
            mappedEntries.push(convertExternalEntry(externalEntryArray[index], identifiers ? identifiers[index] : undefined));
        }
    }
    return mappedEntries.filter((entry) => entry != null) as IEntryDefinition[]
}

function convertExternalEntry(externalEntry: unknown, identifier?: string): IEntryDefinition | null {
    if (DataTypeUtil.isSupported(externalEntry)) {
        return new EntryData(externalEntry, identifier);
    }
    return null;
}